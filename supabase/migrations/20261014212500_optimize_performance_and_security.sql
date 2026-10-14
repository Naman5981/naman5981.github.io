-- Migration: Optimize performance and security
-- 1. Index foreign key constraints for fast joins & cascades
create index if not exists idx_achievements_profile_id 
  on public.achievements (profile_id);

create index if not exists idx_education_profile_id 
  on public.education (profile_id);

create index if not exists idx_experience_highlights_experience_id 
  on public.experience_highlights (experience_id);

create index if not exists idx_experiences_profile_id 
  on public.experiences (profile_id);

create index if not exists idx_projects_profile_id 
  on public.projects (profile_id);

-- 2. Drop redundant single-column indexes covered by portfolio_events_target_lookup_idx
drop index if exists public.portfolio_events_profile_slug_idx;
drop index if exists public.portfolio_events_event_type_idx;

-- 3. Security: Enforce invoker permissions on analytics totals view
alter view public.portfolio_event_totals set (security_invoker = true);

-- 4. Security: Secure function search_path against search path injection
alter function public.set_updated_at() set search_path = public, pg_temp;
