// lib/analytics.ts — typed event tracking via Vercel Analytics
// Usage: track("cta_click", { label: "Book a call", location: "navbar" })
import { track as vercelTrack } from "@vercel/analytics";

type EventName =
  | "cta_click"
  | "form_submit"
  | "calendly_open"
  | "product_view";

export function track(
  event: EventName,
  props?: Record<string, string | number | boolean>
) {
  try {
    vercelTrack(event, props);
  } catch {
    // Never throw — analytics must not break the app
  }
}
