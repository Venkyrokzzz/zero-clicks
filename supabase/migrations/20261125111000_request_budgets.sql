create table public.request_budgets (
  bucket text primary key,
  hits integer not null check (hits > 0),
  expires_at timestamptz not null
);

create index request_budgets_expires_at_idx on public.request_budgets (expires_at);

alter table public.request_budgets enable row level security;
revoke all on table public.request_budgets from public, anon, authenticated;
grant select, insert, update, delete on table public.request_budgets to service_role;

create function public.consume_request_budget(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  request_time timestamptz := statement_timestamp();
  consumed integer;
begin
  if p_bucket is null or length(p_bucket) not between 1 and 128
     or p_limit is null or p_limit not between 1 and 10000
     or p_window_seconds is null or p_window_seconds not between 1 and 3600 then
    raise exception 'Invalid request budget';
  end if;

  insert into public.request_budgets as budget (bucket, hits, expires_at)
  values (p_bucket, 1, request_time + make_interval(secs => p_window_seconds))
  on conflict (bucket) do update
    set hits = case when budget.expires_at <= request_time then 1 else budget.hits + 1 end,
        expires_at = case when budget.expires_at <= request_time then excluded.expires_at else budget.expires_at end
    where budget.expires_at <= request_time or budget.hits < p_limit
  returning budget.hits into consumed;

  if consumed = 1 and p_bucket like '%:global' then
    delete from public.request_budgets
    where bucket in (
      select expired.bucket from public.request_budgets as expired
      where expired.expires_at < request_time - interval '1 hour'
      order by expired.expires_at
      limit 500
      for update skip locked
    );
  end if;

  return consumed is not null;
end;
$$;

revoke all on function public.consume_request_budget(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_request_budget(text, integer, integer) to service_role;
