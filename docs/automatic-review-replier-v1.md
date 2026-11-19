# Automatic Review Replier v1

Zero Clicks is the customer-facing brand. Automatic Review Replier v1 is the focused product: a reliable Google Business Profile review workflow for independent hospitality venues.

## Backend

The Google OAuth callback uses the Business Profile APIs to discover venues. The Next.js poller calls `lib/processReview.ts` directly, saves the original Google review resource, and claims the review before drafting. The legacy n8n ingestion webhook remains available for existing callers. The old n8n publishing endpoint no longer serves queued replies. New V1 imports require owner approval.

The review inbox uses editable, rating-based templates by default and requires no AI API key. Keep this mode for the pilot. Gemini drafting is optional and uses `GEMINI_API_KEY` and `GEMINI_REVIEW_MODEL`; verify provider terms and data handling before enabling it for real reviews. Gemini errors and unusable replies fall back to templates.

Set the same `CRON_SECRET` in the Vercel environment and in the GitHub Actions repository secrets to run the scheduled workflow without n8n configuration. The existing webhook token remains a fallback during the transition.

## Customer journey

1. Customer signs in and authorises Google Business Profile access.
2. The app identifies or asks the customer to choose the venue to monitor.
3. The scheduler reads new unanswered Google reviews.
4. The app saves the review and prepares an editable draft.
5. The owner edits, approves or skips the draft.
6. An approved reply waits in the publish queue.
7. The publisher checks the original venue and reads the current Google reply. It submits the approved text if the review is still unanswered. If Google already has the same text, the publisher records it without posting a second time.

## V1 rules

- `pending`: draft needs a decision.
- `approved`: the owner approved this wording and the reply is queued.
- `sent`: Google accepted the reply and the app recorded `posted_to_google_at`. The dashboard refers to this as submitted. The poller can record moderation state when Google returns it for the matching text. Public visibility is checked separately in the pilot.
- `skipped`: no reply will be posted.
- Legacy queued rows without an original Google review resource are held. Do not backfill a queued reply from the customer's current venue. Re-import the review and obtain a fresh owner approval before publishing it.
- A temporary failure stays queued. Revoked Google access asks the owner to reconnect. A different Google reply stops publication and displays a reason.
- Short database claims prevent overlapping workers from processing the same active job. With a timed-out write, a retry must re-read Google before attempting another write.

## Local checks and preview

Run `node --test tests/*.test.cjs` and `npx tsc --noEmit --incremental false`.
Before deploying to a preview, apply `supabase/migrations/20261115160608_review_replier_v1.sql` to the preview database. The migration adds nullable venue and claim fields to the existing reviews table. It expects the existing unique key on `(clerk_user_id, external_id)`.

With the preview's cron credential, call `GET /api/cron/poll-reviews?customer=<clerk-user-id>` to check just the pilot customer. It imports drafts. The publish endpoint is a separate job and processes approved replies. Use a preview database limited to pilot accounts for live verification.

## Release proof

Before selling v1 as operational, verify on an authorised test profile:

1. connection and venue selection;
2. retrieval of a real unanswered review;
3. generated draft visible in the dashboard;
4. explicit approval;
5. one confirmed Google publication;
6. duplicate scheduler run does not publish a second reply.
