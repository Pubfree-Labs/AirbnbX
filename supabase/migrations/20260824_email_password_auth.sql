begin;

-- Link business guests to Supabase Auth users.
alter table public.guests
  add column if not exists "userId" uuid
  references auth.users(id) on delete set null;

create unique index if not exists guests_user_id_unique
  on public.guests ("userId") where "userId" is not null;
create or replace function public.is_admin()
returns boolean language sql stable set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function public.current_guest_id()
returns bigint language sql stable security definer set search_path = ''
as $$
  select id from public.guests where "userId" = auth.uid() limit 1;
$$;

revoke all on function public.current_guest_id() from public;
grant execute on function public.current_guest_id() to authenticated;

-- Website registration sends account_type=guest. The trigger creates or links
-- the matching guest without permitting browser-side guest insertion.
create or replace function public.handle_new_guest_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  existing_guest_id bigint;
begin
  if coalesce(new.raw_user_meta_data ->> 'account_type', '') <> 'guest' then
    return new;
  end if;

  select id into existing_guest_id
  from public.guests
  where lower(email) = lower(new.email)
  order by id limit 1;

  if existing_guest_id is null then
    insert into public.guests ("fullName", email, "userId")
    values (
      coalesce(nullif(new.raw_user_meta_data ->> 'fullName', ''), split_part(new.email, '@', 1)),
      new.email,
      new.id
    );
  else
    update public.guests
    set "userId" = new.id,
        "fullName" = coalesce(
          nullif("fullName", ''),
          nullif(new.raw_user_meta_data ->> 'fullName', ''),
          split_part(new.email, '@', 1)
        )
    where id = existing_guest_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_guest on auth.users;
create trigger on_auth_user_created_create_guest
  after insert on auth.users
  for each row execute function public.handle_new_guest_user();

-- Public availability exposes dates only, not guest or pricing details.
create or replace function public.get_booked_dates(p_cabin_id bigint)
returns table (
  "startDate" timestamp without time zone,
  "endDate" timestamp without time zone,
  status text
)
language sql stable security definer set search_path = ''
as $$
  select b."startDate", b."endDate", b.status
  from public.bookings b
  where b."cabinId" = p_cabin_id
    and (b."startDate" >= current_date or b.status = 'checked-in');
$$;

revoke all on function public.get_booked_dates(bigint) from public;
grant execute on function public.get_booked_dates(bigint) to anon, authenticated;

alter table public.guests enable row level security;
alter table public.bookings enable row level security;
alter table public.cabins enable row level security;
alter table public.settings enable row level security;

-- Remove the existing policies that grant every authenticated user admin access.
drop policy if exists "Enable delete access for all users" on public.guests;
drop policy if exists "Enable insert access for all users" on public.guests;
drop policy if exists "Enable read access for all users" on public.guests;
drop policy if exists "Enable Insert access to all users" on public.bookings;
drop policy if exists "Enable delete access for all users" on public.bookings;
drop policy if exists "Enable read access for all users" on public.bookings;
drop policy if exists "Enable update access for all users" on public.bookings;
drop policy if exists "Enable create access to all users" on public.cabins;
drop policy if exists "Enable delete access for all users" on public.cabins;
drop policy if exists "Enable read access for all users" on public.cabins;
drop policy if exists "Enable update access to all users" on public.cabins;
drop policy if exists "Enable read access for all users" on public.settings;
drop policy if exists "Enable update for all users" on public.settings;

create policy "Guests read own profile or admin reads all"
on public.guests for select to authenticated
using ("userId" = auth.uid() or public.is_admin());
create policy "Guests update own profile or admin updates all"
on public.guests for update to authenticated
using ("userId" = auth.uid() or public.is_admin())
with check ("userId" = auth.uid() or public.is_admin());
create policy "Admins insert guests"
on public.guests for insert to authenticated with check (public.is_admin());
create policy "Admins delete guests"
on public.guests for delete to authenticated using (public.is_admin());

create policy "Guests read own bookings or admin reads all"
on public.bookings for select to authenticated
using ("guestId" = public.current_guest_id() or public.is_admin());
create policy "Guests create own bookings or admin creates all"
on public.bookings for insert to authenticated
with check ("guestId" = public.current_guest_id() or public.is_admin());
create policy "Guests update own bookings or admin updates all"
on public.bookings for update to authenticated
using ("guestId" = public.current_guest_id() or public.is_admin())
with check ("guestId" = public.current_guest_id() or public.is_admin());
create policy "Guests delete own bookings or admin deletes all"
on public.bookings for delete to authenticated
using ("guestId" = public.current_guest_id() or public.is_admin());

-- Existing public read policies remain; business-data mutations are admin-only.
create policy "Admins create cabins"
on public.cabins for insert to authenticated with check (public.is_admin());
create policy "Admins update cabins"
on public.cabins for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete cabins"
on public.cabins for delete to authenticated using (public.is_admin());
create policy "Admins update settings"
on public.settings for update to authenticated
using (public.is_admin()) with check (public.is_admin());

commit;
