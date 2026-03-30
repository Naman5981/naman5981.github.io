create table if not exists public.portfolio_events (
  id uuid primary key default gen_random_uuid(),
  profile_slug text not null,
  event_type text not null check (event_type in ('section_view', 'project_view', 'resume_download')),
  target_key text not null,
  target_label text not null,
  source text,
  session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists portfolio_events_profile_slug_idx
  on public.portfolio_events (profile_slug);

create index if not exists portfolio_events_event_type_idx
  on public.portfolio_events (event_type);

create index if not exists portfolio_events_created_at_idx
  on public.portfolio_events (created_at desc);

create index if not exists portfolio_events_target_lookup_idx
  on public.portfolio_events (profile_slug, event_type, target_key);

create or replace view public.portfolio_event_totals as
select
  profile_slug,
  event_type,
  target_key,
  max(target_label) as target_label,
  count(*)::bigint as total_events,
  count(distinct session_id)::bigint as unique_sessions,
  max(created_at) as last_seen_at
from public.portfolio_events
group by profile_slug, event_type, target_key;

alter table public.portfolio_events enable row level security;

drop policy if exists "Public insert portfolio events" on public.portfolio_events;
create policy "Public insert portfolio events"
on public.portfolio_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public read portfolio events" on public.portfolio_events;
create policy "Public read portfolio events"
on public.portfolio_events
for select
to anon, authenticated
using (true);

grant select on public.portfolio_event_totals to anon, authenticated;
