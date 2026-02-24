create extension if not exists pgcrypto;

create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  full_description text not null,
  problem_goal text not null,
  what_built text not null,
  tools_stack jsonb not null default '[]'::jsonb,
  challenges text not null,
  learnings text not null,
  github_url text,
  live_url text,
  cover_image_url text not null,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.visuals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  thumbnail_url text,
  featured boolean not null default false,
  published boolean not null default false,
  shot_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row
execute procedure public.set_updated_at();

drop trigger if exists visuals_set_updated_at on public.visuals;
create trigger visuals_set_updated_at
before update on public.visuals
for each row
execute procedure public.set_updated_at();

alter table public.admin_emails enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.visuals enable row level security;

drop policy if exists "admins can view admin_emails" on public.admin_emails;
create policy "admins can view admin_emails"
on public.admin_emails
for select
using (public.is_admin_email());

drop policy if exists "admins can manage admin_emails" on public.admin_emails;
create policy "admins can manage admin_emails"
on public.admin_emails
for all
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists "public can read published projects" on public.projects;
create policy "public can read published projects"
on public.projects
for select
using (published = true);

drop policy if exists "admins can manage projects" on public.projects;
create policy "admins can manage projects"
on public.projects
for all
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists "public can read project images for published projects" on public.project_images;
create policy "public can read project images for published projects"
on public.project_images
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_images.project_id
      and projects.published = true
  )
);

drop policy if exists "admins can manage project images" on public.project_images;
create policy "admins can manage project images"
on public.project_images
for all
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists "public can read published visuals" on public.visuals;
create policy "public can read published visuals"
on public.visuals
for select
using (published = true);

drop policy if exists "admins can manage visuals" on public.visuals;
create policy "admins can manage visuals"
on public.visuals
for all
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('visuals', 'visuals', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('project-images', 'project-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read portfolio storage" on storage.objects;
create policy "public read portfolio storage"
on storage.objects
for select
to public
using (bucket_id in ('visuals', 'project-images'));

drop policy if exists "admins insert portfolio storage" on storage.objects;
create policy "admins insert portfolio storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('visuals', 'project-images')
  and public.is_admin_email()
);

drop policy if exists "admins update portfolio storage" on storage.objects;
create policy "admins update portfolio storage"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('visuals', 'project-images')
  and public.is_admin_email()
)
with check (
  bucket_id in ('visuals', 'project-images')
  and public.is_admin_email()
);

drop policy if exists "admins delete portfolio storage" on storage.objects;
create policy "admins delete portfolio storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('visuals', 'project-images')
  and public.is_admin_email()
);

insert into public.admin_emails (email)
values ('your-email@example.com')
on conflict (email) do nothing;
