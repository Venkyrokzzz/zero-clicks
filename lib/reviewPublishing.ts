import "server-only";

export function reviewPublishingEnabled() {
  return process.env.GOOGLE_REVIEW_PUBLISHING_ENABLED === "true";
}

export function consentCoversReview(
  settings: { auto_publish_venue?: string | null; auto_publish_enabled_at?: string | null } | null | undefined,
  resource: string,
  createdAt: string | null,
) {
  if (!settings?.auto_publish_venue || !settings.auto_publish_enabled_at || !createdAt) return false;
  return resource.startsWith(`${settings.auto_publish_venue}/reviews/`) &&
    Date.parse(createdAt) >= Date.parse(settings.auto_publish_enabled_at);
}
