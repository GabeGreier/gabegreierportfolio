create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('SUPER_ADMIN', 'DEALER_MANAGER', 'DEALER_STAFF');
  end if;

  if not exists (select 1 from pg_type where typname = 'vehicle_status') then
    create type public.vehicle_status as enum ('NEW', 'PHOTOS_IN', 'NEEDS_RETAKE', 'READY', 'POSTED');
  end if;

  if not exists (select 1 from pg_type where typname = 'checklist_item_state') then
    create type public.checklist_item_state as enum ('missing', 'ok', 'retake');
  end if;
end;
$$;

create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  dealer_id uuid references public.dealers(id) on delete set null,
  role public.app_role not null default 'DEALER_STAFF',
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  stock_number text not null,
  vin text,
  year integer,
  make text,
  model text,
  trim text,
  mileage_km integer,
  price_cad integer,
  color text,
  notes text,
  status public.vehicle_status not null default 'NEW',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  label text,
  sort_index integer,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  name text not null default 'Standard',
  created_at timestamptz not null default now()
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  label text not null,
  key text not null,
  state public.checklist_item_state not null default 'missing',
  notes text,
  updated_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  photo_id uuid references public.photos(id) on delete set null,
  author_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.upload_tokens (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  action text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'vehicles_dealer_stock_number_key'
  ) then
    alter table public.vehicles
      add constraint vehicles_dealer_stock_number_key unique (dealer_id, stock_number);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'checklist_items_vehicle_key_unique'
  ) then
    alter table public.checklist_items
      add constraint checklist_items_vehicle_key_unique unique (vehicle_id, key);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'vehicles_id_dealer_id_unique'
  ) then
    alter table public.vehicles
      add constraint vehicles_id_dealer_id_unique unique (id, dealer_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'photos_id_dealer_vehicle_unique'
  ) then
    alter table public.photos
      add constraint photos_id_dealer_vehicle_unique unique (id, dealer_id, vehicle_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'photos_vehicle_dealer_fk'
  ) then
    alter table public.photos
      add constraint photos_vehicle_dealer_fk
      foreign key (vehicle_id, dealer_id) references public.vehicles(id, dealer_id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'checklist_items_vehicle_dealer_fk'
  ) then
    alter table public.checklist_items
      add constraint checklist_items_vehicle_dealer_fk
      foreign key (vehicle_id, dealer_id) references public.vehicles(id, dealer_id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'comments_vehicle_dealer_fk'
  ) then
    alter table public.comments
      add constraint comments_vehicle_dealer_fk
      foreign key (vehicle_id, dealer_id) references public.vehicles(id, dealer_id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'upload_tokens_vehicle_dealer_fk'
  ) then
    alter table public.upload_tokens
      add constraint upload_tokens_vehicle_dealer_fk
      foreign key (vehicle_id, dealer_id) references public.vehicles(id, dealer_id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'activity_log_vehicle_dealer_fk'
  ) then
    alter table public.activity_log
      add constraint activity_log_vehicle_dealer_fk
      foreign key (vehicle_id, dealer_id) references public.vehicles(id, dealer_id) on delete cascade;
  end if;
end;
$$;

create index if not exists idx_profiles_dealer_id on public.profiles(dealer_id);
create index if not exists idx_vehicles_dealer_id on public.vehicles(dealer_id);
create index if not exists idx_vehicles_status on public.vehicles(status);
create index if not exists idx_photos_vehicle_id on public.photos(vehicle_id);
create index if not exists idx_photos_dealer_id on public.photos(dealer_id);
create index if not exists idx_checklist_items_vehicle_id on public.checklist_items(vehicle_id);
create index if not exists idx_checklist_items_dealer_id on public.checklist_items(dealer_id);
create index if not exists idx_comments_vehicle_id on public.comments(vehicle_id);
create index if not exists idx_upload_tokens_token on public.upload_tokens(token);
create index if not exists idx_upload_tokens_vehicle_id on public.upload_tokens(vehicle_id);
create index if not exists idx_activity_log_vehicle_id on public.activity_log(vehicle_id);

create or replace function public.current_profile_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_profile_dealer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select dealer_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'SUPER_ADMIN'::public.app_role, false);
$$;

create or replace function public.is_manager_or_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('SUPER_ADMIN'::public.app_role, 'DEALER_MANAGER'::public.app_role),
    false
  );
$$;

create or replace function public.has_dealer_access(target_dealer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.is_super_admin() or public.current_profile_dealer_id() = target_dealer_id,
    false
  );
$$;

create or replace function public.set_vehicle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.validate_comment_photo_scope()
returns trigger
language plpgsql
as $$
declare
  photo_dealer_id uuid;
  photo_vehicle_id uuid;
begin
  if new.photo_id is null then
    return new;
  end if;

  select dealer_id, vehicle_id
  into photo_dealer_id, photo_vehicle_id
  from public.photos
  where id = new.photo_id;

  if photo_dealer_id is null then
    raise exception 'photo_id % does not exist', new.photo_id;
  end if;

  if photo_dealer_id <> new.dealer_id or photo_vehicle_id <> new.vehicle_id then
    raise exception 'photo_id % must belong to the same dealer and vehicle', new.photo_id;
  end if;

  return new;
end;
$$;

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
before update on public.vehicles
for each row
execute procedure public.set_vehicle_updated_at();

drop trigger if exists comments_validate_photo_scope on public.comments;
create trigger comments_validate_photo_scope
before insert or update on public.comments
for each row
execute procedure public.validate_comment_photo_scope();

alter table public.dealers enable row level security;
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.photos enable row level security;
alter table public.checklist_templates enable row level security;
alter table public.checklist_items enable row level security;
alter table public.comments enable row level security;
alter table public.upload_tokens enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "super admins manage dealers" on public.dealers;
create policy "super admins manage dealers"
on public.dealers
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "dealer members read own dealer" on public.dealers;
create policy "dealer members read own dealer"
on public.dealers
for select
to authenticated
using (
  public.is_super_admin()
  or id = public.current_profile_dealer_id()
);

drop policy if exists "users read own profile managers read dealer profiles" on public.profiles;
create policy "users read own profile managers read dealer profiles"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_super_admin()
  or (
    public.current_profile_role() = 'DEALER_MANAGER'::public.app_role
    and dealer_id = public.current_profile_dealer_id()
  )
);

drop policy if exists "users create own staff profile" on public.profiles;
create policy "users create own staff profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and role = 'DEALER_STAFF'::public.app_role
  and dealer_id is not null
);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role <> 'SUPER_ADMIN'::public.app_role);

drop policy if exists "super admins manage profiles" on public.profiles;
create policy "super admins manage profiles"
on public.profiles
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "dealer scoped vehicles" on public.vehicles;
create policy "dealer scoped vehicles"
on public.vehicles
for select
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer users insert vehicles" on public.vehicles;
create policy "dealer users insert vehicles"
on public.vehicles
for insert
to authenticated
with check (
  public.has_dealer_access(dealer_id)
  and (created_by = auth.uid() or public.is_super_admin())
);

drop policy if exists "dealer users update vehicles" on public.vehicles;
create policy "dealer users update vehicles"
on public.vehicles
for update
to authenticated
using (public.has_dealer_access(dealer_id))
with check (
  public.has_dealer_access(dealer_id)
  and (status <> 'READY'::public.vehicle_status or public.is_manager_or_super_admin())
);

drop policy if exists "dealer users delete vehicles" on public.vehicles;
create policy "dealer users delete vehicles"
on public.vehicles
for delete
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer scoped photos" on public.photos;
create policy "dealer scoped photos"
on public.photos
for select
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer users insert photos" on public.photos;
create policy "dealer users insert photos"
on public.photos
for insert
to authenticated
with check (
  public.has_dealer_access(dealer_id)
  and (uploaded_by = auth.uid() or uploaded_by is null or public.is_super_admin())
);

drop policy if exists "dealer users update photos" on public.photos;
create policy "dealer users update photos"
on public.photos
for update
to authenticated
using (public.has_dealer_access(dealer_id))
with check (public.has_dealer_access(dealer_id));

drop policy if exists "dealer users delete photos" on public.photos;
create policy "dealer users delete photos"
on public.photos
for delete
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer scoped checklist templates" on public.checklist_templates;
create policy "dealer scoped checklist templates"
on public.checklist_templates
for select
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "managers manage checklist templates" on public.checklist_templates;
create policy "managers manage checklist templates"
on public.checklist_templates
for all
to authenticated
using (
  public.has_dealer_access(dealer_id)
  and public.is_manager_or_super_admin()
)
with check (
  public.has_dealer_access(dealer_id)
  and public.is_manager_or_super_admin()
);

drop policy if exists "dealer scoped checklist items" on public.checklist_items;
create policy "dealer scoped checklist items"
on public.checklist_items
for select
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer users manage checklist items" on public.checklist_items;
create policy "dealer users manage checklist items"
on public.checklist_items
for all
to authenticated
using (public.has_dealer_access(dealer_id))
with check (
  public.has_dealer_access(dealer_id)
  and (updated_by = auth.uid() or public.is_super_admin())
);

drop policy if exists "dealer scoped comments" on public.comments;
create policy "dealer scoped comments"
on public.comments
for select
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer users create comments" on public.comments;
create policy "dealer users create comments"
on public.comments
for insert
to authenticated
with check (
  public.has_dealer_access(dealer_id)
  and (author_id = auth.uid() or public.is_super_admin())
);

drop policy if exists "dealer users delete comments" on public.comments;
create policy "dealer users delete comments"
on public.comments
for delete
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "managers read upload tokens" on public.upload_tokens;
create policy "managers read upload tokens"
on public.upload_tokens
for select
to authenticated
using (
  public.has_dealer_access(dealer_id)
  and public.is_manager_or_super_admin()
);

drop policy if exists "managers create upload tokens" on public.upload_tokens;
create policy "managers create upload tokens"
on public.upload_tokens
for insert
to authenticated
with check (
  public.has_dealer_access(dealer_id)
  and public.is_manager_or_super_admin()
);

drop policy if exists "managers delete upload tokens" on public.upload_tokens;
create policy "managers delete upload tokens"
on public.upload_tokens
for delete
to authenticated
using (
  public.has_dealer_access(dealer_id)
  and public.is_manager_or_super_admin()
);

drop policy if exists "dealer scoped activity log" on public.activity_log;
create policy "dealer scoped activity log"
on public.activity_log
for select
to authenticated
using (public.has_dealer_access(dealer_id));

drop policy if exists "dealer users write activity log" on public.activity_log;
create policy "dealer users write activity log"
on public.activity_log
for insert
to authenticated
with check (
  public.has_dealer_access(dealer_id)
  and (actor_id = auth.uid() or actor_id is null or public.is_super_admin())
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'vehicle-photos',
    'vehicle-photos',
    false,
    15728640,
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.storage_dealer_id_from_path(object_name text)
returns uuid
language sql
stable
as $$
  select
    case
      when split_part(object_name, '/', 1) = 'dealers'
       and split_part(object_name, '/', 2) ~* '^[0-9a-f-]{36}$'
      then split_part(object_name, '/', 2)::uuid
      else null
    end;
$$;

drop policy if exists "dealer users read vehicle photos storage" on storage.objects;
create policy "dealer users read vehicle photos storage"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'vehicle-photos'
  and public.has_dealer_access(public.storage_dealer_id_from_path(name))
);

drop policy if exists "dealer users insert vehicle photos storage" on storage.objects;
create policy "dealer users insert vehicle photos storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vehicle-photos'
  and public.has_dealer_access(public.storage_dealer_id_from_path(name))
);

drop policy if exists "dealer users update vehicle photos storage" on storage.objects;
create policy "dealer users update vehicle photos storage"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'vehicle-photos'
  and public.has_dealer_access(public.storage_dealer_id_from_path(name))
)
with check (
  bucket_id = 'vehicle-photos'
  and public.has_dealer_access(public.storage_dealer_id_from_path(name))
);

drop policy if exists "dealer users delete vehicle photos storage" on storage.objects;
create policy "dealer users delete vehicle photos storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'vehicle-photos'
  and public.has_dealer_access(public.storage_dealer_id_from_path(name))
);
