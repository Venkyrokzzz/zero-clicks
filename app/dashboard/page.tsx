"use client";

import { useCallback, useEffect, useState } from "react";
import { TrialBanner } from "@/components/TrialBanner";
import ReviewProgress from "@/components/workspace/ReviewProgress";
import {
  formatDate,
  formatDateTime,
  panelRequest,
  reviewLabel,
  type ReviewEvidence,
} from "@/components/workspace/panel-data";
import s from "@/components/workspace/Workspace.module.css";

type Review = ReviewEvidence & {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text?: string | null;
  sentiment?: string;
  escalation_reason?: string | null;
};
type Connection = {
  connected: boolean;
  needs_reconnect: boolean;
  authorization: boolean;
  lastSyncedAt?: string | null;
};

function ReviewEditor({
  review,
  onChanged,
}: {
  review: Review;
  onChanged: () => void;
}) {
  const [draft, setDraft] = useState(review.draft_response ?? "");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const editable =
    (review.status === "pending" || review.status === "skipped") &&
    !review.posted_to_google_at;
  const oversized = new TextEncoder().encode(draft).length > 4096;
  async function act(action: "save" | "approve" | "skip" | "regenerate") {
    setBusy(action);
    setError("");
    setNotice("");
    try {
      const data = await panelRequest<{ draft?: string }>(
        action === "regenerate" ? "/api/reviews/regenerate" : "/api/reviews",
        {
          method: action === "regenerate" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            action === "regenerate"
              ? { id: review.id }
              : {
                  id: review.id,
                  ...(action === "skip"
                    ? { status: "skipped" }
                    : { draft_response: draft }),
                  ...(action === "approve" ? { status: "approved" } : {}),
                },
          ),
        },
      );
      if (typeof data.draft === "string") setDraft(data.draft);
      if (action === "save") setNotice("Draft saved.");
      if (action === "regenerate")
        setNotice("New draft saved. Read it before approving.");
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save that change.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section
      className={`${s.box} ${s.stack} ${s.detail}`}
      aria-label="Selected review"
    >
      <ReviewProgress review={review} />
      <div>
        <div className={s.row}>
          <h2>{review.reviewer_name || "Google guest"}</h2>
          <span
            className={`${s.status} ${review.google_reply_state === "rejected" || review.publication_blocked ? s.warn : ""}`}
          >
            {reviewLabel(review)}
          </span>
        </div>
        <p className={s.muted}>
          {review.rating}/5 stars · Imported {formatDate(review.created_at)}
        </p>
      </div>
      <blockquote>
        {review.review_text ||
          "This guest left a star rating without a comment."}
      </blockquote>
      {review.escalation_reason && (
        <p className={s.alert}>{review.escalation_reason}</p>
      )}
      <div className={s.stack}>
        <label htmlFor="workspace-reply">Reply draft</label>
        <textarea
          id="workspace-reply"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={!editable || !!busy}
          placeholder="Write a reply or generate a draft."
        />
      </div>
      {oversized && (
        <p role="alert" className={s.alert}>
          The reply exceeds Google’s 4,096-byte limit.
        </p>
      )}
      {editable && (
        <div className={s.row}>
          <button
            className={s.primary}
            onClick={() => act("approve")}
            disabled={!!busy || !draft.trim() || oversized}
          >
            {busy === "approve" ? "Approving…" : "Approve and queue"}
          </button>
          <button
            className={s.button}
            onClick={() => act("save")}
            disabled={
              !!busy || oversized || draft === (review.draft_response ?? "")
            }
          >
            {busy === "save" ? "Saving…" : "Save draft"}
          </button>
          {review.status === "pending" && (
            <button
              className={s.button}
              onClick={() => act("regenerate")}
              disabled={!!busy}
            >
              {busy === "regenerate"
                ? "Drafting…"
                : draft
                  ? "Regenerate"
                  : "Generate draft"}
            </button>
          )}
          {review.status !== "skipped" && (
            <button
              className={s.button}
              onClick={() => act("skip")}
              disabled={!!busy}
            >
              Skip reply
            </button>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className={s.alert}>
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className={s.notice}>
          {notice}
        </p>
      )}
    </section>
  );
}

export default function Inbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [connection, setConnection] = useState<Connection>();
  const [connectionError, setConnectionError] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileDetail, setMobileDetail] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await panelRequest<{ reviews: Review[] }>("/api/reviews");
      setReviews(data.reviews);
      setSelected((current) =>
        data.reviews.some((r) => r.id === current)
          ? current
          : (data.reviews.find((r) => r.status === "pending")?.id ??
            data.reviews[0]?.id),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshConnection = useCallback(async () => {
    setConnectionError(false);
    try {
      setConnection(await panelRequest<Connection>("/api/integrations/google"));
    } catch {
      setConnectionError(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
    void refreshConnection();
  }, [refresh, refreshConnection]);

  const matches = reviews.filter(
    (r) =>
      (filter === "all" ||
        (filter === "flagged"
          ? r.rating <= 2 && r.status === "pending"
          : r.status === filter)) &&
      (!search.trim() ||
        `${r.reviewer_name} ${r.review_text ?? ""}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())),
  );
  const active = matches.find((r) => r.id === selected) ?? matches[0];
  return (
    <main className={s.workspace}>
      <div className={s.frame}>
        <header className={s.header}>
          <div>
            <h1>Review inbox</h1>
            <p className={s.muted}>
              Reputation Manager ·{" "}
              {reviews.filter((r) => r.status === "pending").length} waiting for
              a reply
            </p>
          </div>
          <div className={s.row}>
            <a className={s.button} href="/dashboard/billing">
              Billing
            </a>
            <button
              className={s.button}
              onClick={() => {
                void refresh();
                void refreshConnection();
              }}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>
        <TrialBanner />
        {connectionError && (
          <p className={s.alert}>
            Could not read your Google connection. Select Refresh to retry.
          </p>
        )}
        {connection && !connectionError && (
          <p className={s.notice}>
            {connection.connected
              ? `Google connected · Last successful check: ${formatDateTime(connection.lastSyncedAt)}`
              : connection.needs_reconnect
                ? "Google needs to be reconnected. "
                : connection.authorization
                  ? "Choose the Google venue you manage. "
                  : "Connect Google to receive reviews. "}
            {!connection.connected && (
              <a
                href={
                  connection.authorization && !connection.needs_reconnect
                    ? "/connect/success?location=select"
                    : "/connect"
                }
              >
                {connection.needs_reconnect
                  ? "Reconnect"
                  : connection.authorization
                    ? "Choose venue"
                    : "Connect Google"}
              </a>
            )}
          </p>
        )}
        {error && (
          <p role="alert" className={s.alert}>
            {error}{" "}
            {error === "Subscription inactive" && (
              <a href="/dashboard/billing">Open billing</a>
            )}
          </p>
        )}
        <div className={s.controls}>
          <label>
            Search reviews
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setMobileDetail(false);
              }}
            />
          </label>
          <label>
            Status
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setMobileDetail(false);
              }}
            >
              <option value="all">All reviews</option>
              <option value="flagged">Low rating</option>
              <option value="pending">Needs action</option>
              <option value="approved">Queued</option>
              <option value="sent">Recorded replies</option>
              <option value="skipped">Skipped</option>
            </select>
          </label>
        </div>
        <div className={`${s.split} ${mobileDetail ? s.mobileDetail : ""}`}>
          <section className={s.inboxList} aria-label="Review list">
            {matches.length ? (
              <ul className={s.list}>
                {matches.map((review) => (
                  <li key={review.id}>
                    <button
                      aria-pressed={active?.id === review.id}
                      onClick={() => {
                        setSelected(review.id);
                        setMobileDetail(true);
                      }}
                    >
                      <span className={s.row}>
                        <strong>
                          {review.reviewer_name || "Google guest"}
                        </strong>
                        <span
                          className={`${s.status} ${review.google_reply_state === "rejected" || review.publication_blocked ? s.warn : ""}`}
                        >
                          {reviewLabel(review)}
                        </span>
                      </span>
                      <span className={s.muted}>
                        {review.rating}/5 stars ·{" "}
                        {formatDate(review.created_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={s.muted}>
                {loading
                  ? "Loading reviews…"
                  : error
                    ? "Reviews are unavailable."
                    : "No reviews match this view."}
              </p>
            )}
          </section>
          {active && (
            <div className={s.inboxDetail}>
              <button
                className={`${s.button} ${s.mobileBack}`}
                onClick={() => setMobileDetail(false)}
              >
                Back to reviews
              </button>
              <ReviewEditor
                key={active.id}
                review={active}
                onChanged={refresh}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
