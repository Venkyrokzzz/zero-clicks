import { formatDate, reviewLabel, type ReviewEvidence } from "./panel-data";
import s from "./Workspace.module.css";

export default function ReviewProgress({ review, publishingEnabled = false }: { review: ReviewEvidence; publishingEnabled?: boolean }) {
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
    ...(publishingEnabled ? [{
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
    }] : []),
    {
      label: "Google",
      detail:
        review.posted_to_google_at ||
        review.status === "sent" ||
        review.publication_blocked
          ? reviewLabel(review, publishingEnabled)
          : publishingEnabled ? "Waiting for submission" : "Draft only",
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
          Five-star reviews get a default thank-you. For one to four stars,
          the draft uses the guest’s feedback when available. You can edit or copy any draft.
        </p>
        <p className={s.muted}>
          {publishingEnabled
            ? "Approving queues the exact reply text. Google submissions and moderation appear separately."
            : "Publishing is off during the pilot. Drafts are saved in your inbox."}
        </p>
      </details>
    </>
  );
}
