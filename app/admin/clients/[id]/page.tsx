"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BillingPanel from "@/components/workspace/BillingPanel";
import ReviewProgress from "@/components/workspace/ReviewProgress";
import {
  panelRequest,
  formatDateTime,
  reviewLabel,
  type ReviewEvidence,
} from "@/components/workspace/panel-data";
import s from "@/components/workspace/Workspace.module.css";

interface Profile {
  email: string;
  business_name: string | null;
  business_type: string | null;
  manager_name: string | null;
  location: string | null;
  phone: string | null;
  plan: string;
  trial_paused: boolean;
  notes: string | null;
  has_stripe_customer: boolean;
  subscription_status?: string | null;
}

interface ClientRecord {
  profile: Profile;
  settings: { tone?: string; auto_send_positive?: boolean } | null;
  connection: {
    account_id?: string;
    location_id?: string;
    last_synced_at?: string;
    needs_reconnect?: boolean;
  } | null;
  reviews_count: number;
}

type Review = ReviewEvidence & {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text?: string | null;
};

function ClientSettings({ id, client }: { id: string; client: ClientRecord }) {
  const { profile, settings } = client;
  const [plan, setPlan] = useState(profile.plan);
  const [paused, setPaused] = useState(profile.trial_paused);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setResult("");
    setError("");
    let venueSaved = false;
    try {
      await panelRequest("/api/admin/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: id,
          business_name: fields.business_name,
          manager_name: fields.manager_name,
          business_type: fields.business_type,
          location: fields.location,
          phone: fields.phone,
          tone: fields.tone,
          auto_send_positive: fields.legacy_auto_send === "on",
        }),
      });
      venueSaved = true;
      await panelRequest("/api/admin/client", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: id,
          notes: fields.notes,
          trial_paused: paused,
          ...(!profile.has_stripe_customer &&
          !profile.subscription_status &&
          plan !== profile.plan
            ? { plan }
            : {}),
        }),
      });
      setResult("Changes saved.");
    } catch (e) {
      const detail = e instanceof Error ? e.message : "Could not save.";
      setError(
        venueSaved
          ? `Venue fields were saved. Access settings or notes need a retry. ${detail}`
          : detail,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={`${s.box} ${s.stack}`} onSubmit={save}>
      <h2>Venue settings</h2>
      <div className={s.fieldGrid}>
        {(
          [
            ["business_name", "Venue name"],
            ["manager_name", "Manager"],
            ["location", "Location"],
            ["phone", "Phone"],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              className={s.input}
              name={key}
              defaultValue={profile[key] ?? ""}
            />
          </label>
        ))}
        <label>
          Venue type
          <select
            className={s.input}
            name="business_type"
            defaultValue={profile.business_type || "pub"}
          >
            {["pub", "restaurant", "cafe", "hotel", "bar"].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          Reply tone
          <select
            className={s.input}
            name="tone"
            defaultValue={settings?.tone || "warm-professional"}
          >
            <option value="warm-professional">Warm and professional</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </label>
        {!profile.has_stripe_customer && !profile.subscription_status && (
          <label>
            Local plan
            <select
              className={s.input}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              {Array.from(
                new Set([
                  profile.plan,
                  "trial",
                  "founding",
                  "standard",
                  "pro",
                  "demo",
                  "cancelled",
                ]),
              ).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      <label className={s.row}>
        <input
          type="checkbox"
          checked={paused}
          onChange={(e) => setPaused(e.target.checked)}
        />{" "}
        Pause Zero Clicks service access
      </label>
      <p className={s.muted}>
        Pausing access here leaves the Stripe subscription in place.
      </p>
      <details className={s.flow}>
        <summary>Legacy review integration</summary>
        <label className={s.row}>
          <input
            type="checkbox"
            name="legacy_auto_send"
            defaultChecked={!!settings?.auto_send_positive}
          />{" "}
          Allow eligible positive replies through the legacy Pro integration
        </label>
        <p className={s.muted}>
          Reputation Manager v1 still requires owner approval.
        </p>
      </details>
      <label className={s.stack}>
        Internal notes
        <textarea name="notes" defaultValue={profile.notes ?? ""} />
      </label>
      <div>
        <button className={s.button} disabled={busy}>
          {busy ? "Saving…" : "Save venue settings"}
        </button>
      </div>
      {result && (
        <p role="status" className={s.notice}>
          {result}
        </p>
      )}
      {error && (
        <p role="alert" className={s.alert}>
          {error}
        </p>
      )}
    </form>
  );
}

function ReviewRecord({
  review,
  onRefresh,
}: {
  review: Review;
  onRefresh: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(review.draft_response ?? "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const editable =
    ["pending", "skipped"].includes(review.status) &&
    !review.posted_to_google_at;
  async function update(change: object) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await panelRequest("/api/admin/client/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: review.id, ...change }),
      });
      setMessage("Updated.");
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the review.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className={s.box}>
      <summary className={s.summary}>
        {review.reviewer_name || "Google guest"} · {review.rating}/5{" "}
        <span
          className={`${s.status} ${review.google_reply_state === "rejected" || review.publication_blocked ? s.warn : ""}`}
        >
          {reviewLabel(review)}
        </span>
      </summary>
      <div className={`${s.stack} ${s.detail}`}>
        <ReviewProgress review={review} />
        <blockquote>
          {review.review_text || "Rating without a comment."}
        </blockquote>
        <label className={s.stack}>
          Reply draft
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            readOnly={!editable || busy}
          />
        </label>
        {editable && (
          <div className={s.row}>
            <button
              className={s.button}
              disabled={busy || draft === (review.draft_response ?? "")}
              onClick={() => update({ draft_response: draft })}
            >
              Save draft
            </button>
            <button
              className={s.button}
              disabled={busy}
              onClick={() =>
                update({
                  status: review.status === "skipped" ? "pending" : "skipped",
                })
              }
            >
              {review.status === "skipped"
                ? "Return to review inbox"
                : "Skip reply"}
            </button>
          </div>
        )}
        {message && (
          <p role="status" className={s.notice}>
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className={s.alert}>
            {error}
          </p>
        )}
      </div>
    </details>
  );
}

export default function AdminDetail() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientRecord>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const query = encodeURIComponent(id);
  async function loadReviews() {
    setReviewError("");
    try {
      const data = await panelRequest<{ reviews: Review[] }>(
        `/api/admin/client/reviews?id=${query}`,
      );
      setReviews(data.reviews);
    } catch (e) {
      setReviewError(
        e instanceof Error ? e.message : "Could not load review records.",
      );
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    setClient(undefined);
    setReviews([]);
    setError("");
    setReviewError("");
    panelRequest<ClientRecord>(`/api/admin/client?id=${query}`, {
      signal: controller.signal,
    })
      .then(setClient)
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    panelRequest<{ reviews: Review[] }>(
      `/api/admin/client/reviews?id=${query}`,
      { signal: controller.signal },
    )
      .then((data) => setReviews(data.reviews))
      .catch((e) => {
        if (!controller.signal.aborted) setReviewError(e.message);
      });
    return () => controller.abort();
  }, [query]);

  return (
    <main className={s.workspace}>
      <div className={`${s.frame} ${s.stack}`}>
        <header className={s.header}>
          <div>
            <h1>{client?.profile.business_name || "Client details"}</h1>
            <p className={s.muted}>{client?.profile.email}</p>
          </div>
          <a className={s.button} href="/admin">
            All clients
          </a>
        </header>
        {error && (
          <p role="alert" className={s.alert}>
            {error}
          </p>
        )}
        {!client && !error && <p className={s.muted}>Loading venue…</p>}
        {client && (
          <>
            <section className={`${s.box} ${s.row}`}>
              <h2>Google connection</h2>
              <p className={s.muted}>
                {client.connection?.needs_reconnect
                  ? "Reconnect required"
                  : client.connection?.account_id &&
                      client.connection?.location_id
                    ? "Connected"
                    : client.connection
                      ? "Location still needs to be selected"
                      : "Not connected"}{" "}
                · Last successful check:{" "}
                {formatDateTime(client.connection?.last_synced_at)}
              </p>
            </section>
            <div className={s.split}>
              <BillingPanel key={id} clientId={id} />
              <ClientSettings key={id} id={id} client={client} />
            </div>
            <section className={s.stack}>
              <div className={s.row}>
                <h2>Review records</h2>
                <span className={s.muted}>
                  {client.reviews_count} imported · latest 100 shown
                </span>
                <button className={s.button} onClick={loadReviews}>
                  Refresh reviews
                </button>
              </div>
              {reviewError && (
                <p role="alert" className={s.alert}>
                  {reviewError}
                </p>
              )}
              {!reviews.length && !reviewError && (
                <p className={s.muted}>No review records to show.</p>
              )}
              {reviews.map((review) => (
                <ReviewRecord
                  key={review.id}
                  review={review}
                  onRefresh={loadReviews}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
