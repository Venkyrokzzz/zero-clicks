create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 1 and 254),
  company text check (char_length(company) <= 200),
  budget text check (char_length(budget) <= 100),
  message text not null check (char_length(message) between 1 and 5000),
  email_status text not null default 'pending' check (email_status in ('pending', 'accepted', 'failed', 'unconfigured', 'unknown')),
  email_id text
);

create index contact_enquiries_created_at_idx on public.contact_enquiries (created_at desc);
alter table public.contact_enquiries enable row level security;
revoke all on public.contact_enquiries from public, anon, authenticated;
grant select, insert, update, delete on public.contact_enquiries to service_role;
