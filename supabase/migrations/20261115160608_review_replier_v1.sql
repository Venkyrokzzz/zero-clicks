-- Existing rows retain their history. A queued row without a verified Google
-- resource is held until the owner can approve a review imported from that venue.
alter table public.reviews
  add column if not exists google_review_resource text,
  add column if not exists draft_claim_id uuid,
  add column if not exists draft_claim_until timestamptz,
  add column if not exists publish_claim_id uuid,
  add column if not exists publish_claim_until timestamptz,
  add column if not exists publication_blocked boolean not null default false,
  add column if not exists publication_message text,
  add column if not exists google_reply_state text;

create index if not exists reviews_v1_publish_queue_idx
  on public.reviews (sent_at, id)
  where status in ('approved', 'sent')
    and posted_to_google_at is null
    and not publication_blocked;
