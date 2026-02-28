drop policy if exists "users create own staff profile" on public.profiles;
create policy "users create own staff profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and (
    (
      dealer_id is null
      and role = 'DEALER_STAFF'::public.app_role
    )
    or (
      dealer_id is not null
      and role::text = coalesce(nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''), 'DEALER_STAFF')
      and dealer_id::text = nullif(auth.jwt() -> 'app_metadata' ->> 'dealer_id', '')
    )
  )
);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid() and dealer_id is null and role = 'DEALER_STAFF'::public.app_role)
with check (id = auth.uid() and dealer_id is null and role = 'DEALER_STAFF'::public.app_role);
