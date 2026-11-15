# Automatic Review Replier v1

Zero Clicks is the customer-facing brand. Automatic Review Replier v1 is the focused product: a reliable Google Business Profile review workflow for independent hospitality venues.

## Customer journey

1. Customer signs in and authorises Google Business Profile access.
2. The app identifies or asks the customer to choose the venue to monitor.
3. The scheduler reads new unanswered Google reviews.
4. The app saves the review and produces a venue-specific draft.
5. The owner edits, approves or skips the draft.
6. An approved reply waits in the publish queue.
7. The scheduler posts it to Google and only then marks it as sent.

## V1 rules

- `pending`: draft needs a decision.
- `approved`: explicitly approved or policy-approved; waiting for Google publication.
- `sent`: Google accepted the reply and the app recorded `posted_to_google_at`.
- `skipped`: no reply will be posted.
- New or recovered legacy queue rows must never be shown as published before Google confirms success.
- A failed Google post stays queued and exposes the failure to operations; it must not be falsely marked sent.

## Release proof

Before selling v1 as operational, verify on an authorised test profile:

1. connection and venue selection;
2. retrieval of a real unanswered review;
3. generated draft visible in the dashboard;
4. explicit approval;
5. one confirmed Google publication;
6. duplicate scheduler run does not publish a second reply.
