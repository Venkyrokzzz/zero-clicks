import { formatDate, reviewLabel, type ReviewEvidence } from "./panel-data";
import s from "./Workspace.module.css";

export default function ReviewProgress({ review }: { review: ReviewEvidence }) {
  const steps = [
    {
      label: "Imported",
      detail: formatDate(review.created_at),
      done: !!review.created_at,
    },
    {
      label: "Draft",
      detail: review.draft_response?.trim() ? "Text saved" : "No draft saved",
      done: !!review.draft_response?.trim(),
    },
    {
      label: "Approval",
      detail:
        review.status === "skipped"
          ? "Skipped"
          : review.status === "approved"
            ? "Queued"
            : review.status === "sent"
              ? "Reply recorded"
              : "Waiting on owner",
      done: review.status === "approved",
    },
    {
      label: "Google",
      detail:
        review.posted_to_google_at ||
        review.status === "sent" ||
        review.publication_blocked
          ? reviewLabel(review)
          : "Waiting for submission",
      done:
        !!review.posted_to_google_at &&
        review.google_reply_state !== "rejected",
    },
  ];
  return (
    <>
      <ol className={s.steps} aria-label="Recorded review progress">
        {steps.map((step) => (
          <li key={step.label} data-done={step.done}>
            <strong>{step.label}</strong>
            {step.detail}
          </li>
        ))}
      </ol>
      {review.publication_message && (
        <p className={s.alert}>{review.publication_message}</p>
      )}
      <details className={s.flow}>
        <summary>How the reply is prepared</summary>
        <p className={s.muted}>
          Zero Clicks checks the connected Google listing for new reviews.
          Drafting can use the review text, star rating, venue details, and your
          saved tone. If the AI draft is unavailable, a template can be offered
          for your approval. You can edit the wording or write it yourself.
        </p>
        <p className={s.muted}>
          Approving a reply queues that exact text. The publisher checks for an
          existing reply before sending. A recorded submission and Google’s
          moderation status are shown separately.
        </p>
      </details>
    </>
  );
}
