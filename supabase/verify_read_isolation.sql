-- Run after `supabase db reset`.
-- This script assumes seeded profile IDs from supabase/seed.sql.

begin;

-- Dealer A manager should only see Dealer A rows.
set local role authenticated;
set local request.jwt.claim.role = 'authenticated';
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';

do $$
declare
  visible_vehicles integer;
  visible_photos integer;
  visible_dealers integer;
begin
  select count(*) into visible_vehicles from public.vehicles;
  if visible_vehicles <> 1 then
    raise exception 'Dealer A manager expected 1 visible vehicle, got %', visible_vehicles;
  end if;

  select count(*) into visible_photos from public.photos;
  if visible_photos <> 1 then
    raise exception 'Dealer A manager expected 1 visible photo, got %', visible_photos;
  end if;

  select count(*) into visible_dealers from public.dealers;
  if visible_dealers <> 1 then
    raise exception 'Dealer A manager expected 1 visible dealer row, got %', visible_dealers;
  end if;
end;
$$;

reset request.jwt.claim.sub;

-- Dealer B manager should only see Dealer B rows.
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000004';

do $$
declare
  visible_vehicles integer;
  visible_photos integer;
  visible_dealers integer;
begin
  select count(*) into visible_vehicles from public.vehicles;
  if visible_vehicles <> 1 then
    raise exception 'Dealer B manager expected 1 visible vehicle, got %', visible_vehicles;
  end if;

  select count(*) into visible_photos from public.photos;
  if visible_photos <> 1 then
    raise exception 'Dealer B manager expected 1 visible photo, got %', visible_photos;
  end if;

  select count(*) into visible_dealers from public.dealers;
  if visible_dealers <> 1 then
    raise exception 'Dealer B manager expected 1 visible dealer row, got %', visible_dealers;
  end if;
end;
$$;

reset request.jwt.claim.sub;

-- Dealer staff should not see all dealers either.
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';

do $$
declare
  visible_dealers integer;
begin
  select count(*) into visible_dealers from public.dealers;
  if visible_dealers <> 1 then
    raise exception 'Dealer staff expected 1 visible dealer row, got %', visible_dealers;
  end if;
end;
$$;

reset request.jwt.claim.sub;

-- Super admin should see all rows across dealers.
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

do $$
declare
  visible_vehicles integer;
  visible_photos integer;
  visible_dealers integer;
begin
  select count(*) into visible_vehicles from public.vehicles;
  if visible_vehicles <> 2 then
    raise exception 'Super admin expected 2 visible vehicles, got %', visible_vehicles;
  end if;

  select count(*) into visible_photos from public.photos;
  if visible_photos <> 2 then
    raise exception 'Super admin expected 2 visible photos, got %', visible_photos;
  end if;

  select count(*) into visible_dealers from public.dealers;
  if visible_dealers <> 2 then
    raise exception 'Super admin expected 2 visible dealers, got %', visible_dealers;
  end if;
end;
$$;

rollback;
