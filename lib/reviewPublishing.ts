import "server-only";

export function reviewPublishingEnabled() {
  return process.env.GOOGLE_REVIEW_PUBLISHING_ENABLED === "true";
}
