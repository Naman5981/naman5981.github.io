create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  headline text not null,
  bio text not null,
  location text,
  email text,
  phone text,
  years_experience_label text,
  issues_solved_target integer default 0,
  core_domains_count integer default 0,
  backend_focus_label text,
  profile_image_path text,
  resume_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profile_social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null,
  label text,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (profile_id, platform)
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company text not null,
  website text,
  logo_path text,
  logo_alt text,
  location text,
  start_date date,
  end_date date,
  duration_label text not null,
  designation text not null,
  summary text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.experience_highlights (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  highlight text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null,
  repo_url text,
  live_url text,
  description text not null,
  featured boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (profile_id, name)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (category_id, name)
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  degree text not null,
  institution text not null,
  graduation_year integer,
  duration_label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  awarder text,
  award_year integer,
  description text,
  raw_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_social_links_updated_at on public.profile_social_links;
create trigger set_profile_social_links_updated_at
before update on public.profile_social_links
for each row execute function public.set_updated_at();

drop trigger if exists set_experiences_updated_at on public.experiences;
create trigger set_experiences_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_skill_categories_updated_at on public.skill_categories;
create trigger set_skill_categories_updated_at
before update on public.skill_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_education_updated_at on public.education;
create trigger set_education_updated_at
before update on public.education
for each row execute function public.set_updated_at();

drop trigger if exists set_achievements_updated_at on public.achievements;
create trigger set_achievements_updated_at
before update on public.achievements
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.profile_social_links enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_highlights enable row level security;
alter table public.projects enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Public read profile social links" on public.profile_social_links;
create policy "Public read profile social links"
on public.profile_social_links
for select
to anon, authenticated
using (true);

drop policy if exists "Public read experiences" on public.experiences;
create policy "Public read experiences"
on public.experiences
for select
to anon, authenticated
using (true);

drop policy if exists "Public read experience highlights" on public.experience_highlights;
create policy "Public read experience highlights"
on public.experience_highlights
for select
to anon, authenticated
using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "Public read skill categories" on public.skill_categories;
create policy "Public read skill categories"
on public.skill_categories
for select
to anon, authenticated
using (true);

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills"
on public.skills
for select
to anon, authenticated
using (true);

drop policy if exists "Public read education" on public.education;
create policy "Public read education"
on public.education
for select
to anon, authenticated
using (true);

drop policy if exists "Public read achievements" on public.achievements;
create policy "Public read achievements"
on public.achievements
for select
to anon, authenticated
using (true);
