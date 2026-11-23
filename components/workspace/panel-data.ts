export interface BillingSnapshot {
  businessName: string | null;
  plan: string;
  trialEndsAt: string | null;
  trialPaused: boolean;
  hasAccess: boolean;
  syncedStatus: string | null;
  hasCustomer: boolean;
  source: "local" | "stripe" | "unavailable";
  mode?: "live" | "test";
  dashboardUrl?: string;
  subscription: {
    status: string;
    periodEnd: number | null;
    cancelAt: number | null;
    invoice: {
      number: string | null;
      status: string | null;
      created: number;
    } | null;
  } | null;
}

export interface ReviewEvidence {
  status: "pending" | "approved" | "sent" | "skipped";
  created_at: string;
  draft_response?: string | null;
  posted_to_google_at?: string | null;
  publication_message?: string | null;
  publication_blocked?: boolean | null;
  google_reply_state?: string | null;
}

export function statusLabel(value?: string | null) {
  if (!value) return "Not recorded";
  if (value === "canceled" || value === "cancelled") return "Cancelled";
  if (value === "founding") return "Founding Member";
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ");
}

export function reviewLabel(value: ReviewEvidence, publishingEnabled = false) {
  if (value.google_reply_state === "rejected") return "Rejected by Google";
  if (value.publication_blocked) return "Needs attention";
  if (value.posted_to_google_at) {
    if (value.google_reply_state === "pending") return "Google moderation";
    if (value.google_reply_state === "approved") return "Approved by Google";
    return "Accepted by Google";
  }
  if (value.status === "sent") return "Publication unverified";
  if (value.status === "approved") return publishingEnabled ? "Queued" : "Draft ready";
  if (value.status === "skipped") return "Skipped";
  return value.draft_response?.trim() ? (publishingEnabled ? "Needs approval" : "Draft ready") : "Needs draft";
}

export function formatDate(value?: number | string | null) {
  if (!value) return "Not recorded";
  const time = new Date(typeof value === "number" ? value * 1000 : value);
  return Number.isNaN(time.getTime())
    ? "Not recorded"
    : time.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function formatDateTime(value?: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not recorded";
  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London",
    }).format(new Date(value)) + " UK time"
  );
}

export async function panelRequest<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const timeout = AbortSignal.timeout(15_000);
  const result = await fetch(url, {
    cache: "no-store",
    ...init,
    signal: init?.signal ? AbortSignal.any([timeout, init.signal]) : timeout,
  });
  const payload = await result.json().catch(() => null);
  if (!result.ok || !payload) {
    throw new Error(
      typeof payload?.error === "string"
        ? payload.error
        : "The request failed. Please try again.",
    );
  }
  return payload as T;
}
