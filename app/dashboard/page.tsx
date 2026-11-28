"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { classifyReview, isRoutineReview } from "@/lib/reviewDisposition";
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
  attention_reason?: string | null;
};
function draftDecision(review: Review) {
  const decision = classifyReview(review.rating, review.review_text ?? "");
  if (review.attention_reason && decision.disposition !== "manager") return { disposition: "approval" as const, reason: review.attention_reason };
  return decision;
}

type Connection = {
  connected: boolean;
  needs_reconnect: boolean;
  authorization: boolean;
  lastSyncedAt?: string | null;
};

function ReviewEditor({
  review,
  onChanged,
  publishingEnabled,
}: {
  review: Review;
  onChanged: () => void;
  publishingEnabled: boolean;
}) {
  const [draft, setDraft] = useState(review.draft_response ?? "");
  const decision = draftDecision(review);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const replyField = useRef<HTMLTextAreaElement>(null);
  const editable =
    (review.status === "pending" || review.status === "skipped" ||
      (!publishingEnabled && review.status === "approved")) &&
    !review.posted_to_google_at;
  const oversized = new TextEncoder().encode(draft).length > 4096;
  async function copyDraft() {
    setError("");
    try {
      await navigator.clipboard.writeText(draft.trim());
      setNotice("Draft copied.");
    } catch {
      replyField.current?.focus();
      replyField.current?.select();
      setNotice("Copy the selected text using your device’s copy command.");
    }
  }

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
        setNotice("New draft saved.");
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
      <ReviewProgress review={review} publishingEnabled={publishingEnabled} />
      <div>
        <div className={s.row}>
          <h2>{review.reviewer_name || "Google guest"}</h2>
          <span
            className={`${s.status} ${review.google_reply_state === "rejected" || review.publication_blocked ? s.warn : ""}`}
          >
            {reviewLabel(review, publishingEnabled)}
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
      {(review.escalation_reason || (review.status === "pending" && !isRoutineReview(decision.disposition))) && (
        <p className={s.alert}>
          {decision.disposition === "manager" && <strong>Manager review. </strong>}
          {review.escalation_reason || decision.reason}
        </p>
      )}
      <div className={s.stack}>
        <label htmlFor="workspace-reply">Reply draft</label>
        <textarea
          id="workspace-reply"
          ref={replyField}
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
          {publishingEnabled ? (
            <button className={s.primary} onClick={() => act("approve")} disabled={!!busy || !draft.trim() || oversized}>
              {busy === "approve" ? "Approving…" : "Approve and queue"}
            </button>
          ) : (
            <button className={s.primary} onClick={copyDraft} disabled={!!busy || !draft.trim() || oversized}>
              Copy draft
            </button>
          )}
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
  const [publishingEnabled, setPublishingEnabled] = useState(false);
  const [autoPublishRoutine, setAutoPublishRoutine] = useState(false);
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
      const data = await panelRequest<{ reviews: Review[]; publishingEnabled?: boolean; autoPublishRoutine?: boolean }>("/api/reviews");
      setReviews(data.reviews);
      setPublishingEnabled(data.publishingEnabled === true);
      setAutoPublishRoutine(data.autoPublishRoutine === true);
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
          ? (r.status === "pending" && !isRoutineReview(draftDecision(r).disposition)) || r.publication_blocked || r.google_reply_state === "rejected"
          : filter === "routine"
            ? r.status === "pending" && isRoutineReview(draftDecision(r).disposition)
            : filter === "automatic"
              ? r.automatically_approved === true
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
            <a className={s.button} href="/dashboard/settings">Reply settings</a>
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
        {!loading && !error && (
          <p className={s.notice}>
            {publishingEnabled
              ? autoPublishRoutine
                ? "Automatic replies are on for routine reviews. Flagged reviews wait here for your approval."
                : <>Automatic replies are off. <a href="/dashboard/settings">Enable automatic replies</a> in Reply settings, or approve drafts below.</>
              : "Google publishing is currently in draft-only mode. Replies stay in Zero Clicks until you copy them."}
          </p>
        )}
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
            {error === "Finish setting up your venue first." && (
              <a href="/onboarding">Set up your venue</a>
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
              <option value="flagged">Needs attention</option>
              <option value="automatic">Automatic replies</option>
              <option value="routine">Routine drafts</option>
              <option value="pending">All open drafts</option>
              <option value="approved">{publishingEnabled ? "Queued" : "Previously approved drafts"}</option>
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
                          {reviewLabel(review, publishingEnabled)}
                        </span>
                      </span>
                      <span className={s.muted}>
                        {review.rating}/5 stars ·{" "}
                        {formatDate(review.created_at)}
                        {review.status === "pending" && draftDecision(review).disposition === "manager"
                          ? " · Manager review"
                          : ""}
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
                publishingEnabled={publishingEnabled}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
