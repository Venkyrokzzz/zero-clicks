alter table public.settings
  add column auto_publish_venue text,
  add column auto_publish_enabled_at timestamptz;

alter table public.reviews
  add column automatically_approved boolean not null default false,
  add column attention_reason text;
