begin;

create or replace function public.create_guest_booking(
  p_cabin_id bigint,
  p_start_date date,
  p_end_date date,
  p_num_guests integer,
  p_observations text default ''
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  guest_id bigint;
  cabin_record public.cabins%rowtype;
  settings_record public.settings%rowtype;
  num_nights integer;
  calculated_cabin_price real;
  new_booking_id bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select id into guest_id
  from public.guests
  where "userId" = auth.uid()
  limit 1;

  if guest_id is null then
    raise exception 'Guest profile is not linked';
  end if;

  -- Serialize reservations for the same cabin to prevent race-condition
  -- double bookings between the overlap check and insert.
  perform pg_advisory_xact_lock(p_cabin_id);

  select * into cabin_record
  from public.cabins
  where id = p_cabin_id;

  if not found then
    raise exception 'Cabin does not exist';
  end if;

  select * into settings_record
  from public.settings
  order by id
  limit 1;

  if not found then
    raise exception 'Booking settings are missing';
  end if;

  if p_start_date < current_date or p_end_date <= p_start_date then
    raise exception 'Invalid booking dates';
  end if;

  num_nights := p_end_date - p_start_date;

  if num_nights < settings_record."minBookingLength"
     or num_nights > settings_record."maxBookingLength" then
    raise exception 'Booking length is outside the allowed range';
  end if;

  if p_num_guests < 1
     or p_num_guests > cabin_record."maxCapacity"
     or p_num_guests > settings_record."maxGuestsPerBooking" then
    raise exception 'Invalid number of guests';
  end if;

  if exists (
    select 1
    from public.bookings b
    where b."cabinId" = p_cabin_id
      and b."startDate" < p_end_date
      and b."endDate" > p_start_date
  ) then
    raise exception 'Cabin is already booked for these dates';
  end if;

  calculated_cabin_price :=
    num_nights * (cabin_record."regularPrice" - cabin_record.discount);

  insert into public.bookings (
    "startDate",
    "endDate",
    "numNights",
    "numGuests",
    "cabinPrice",
    "extrasPrice",
    "totalPrice",
    status,
    "hasBreakfast",
    "isPaid",
    observations,
    "cabinId",
    "guestId"
  )
  values (
    p_start_date,
    p_end_date,
    num_nights,
    p_num_guests,
    calculated_cabin_price,
    0,
    calculated_cabin_price,
    'unconfirmed',
    false,
    false,
    left(coalesce(p_observations, ''), 1000),
    p_cabin_id,
    guest_id
  )
  returning id into new_booking_id;

  return new_booking_id;
end;
$$;

revoke all on function public.create_guest_booking(bigint, date, date, integer, text) from public;
grant execute on function public.create_guest_booking(bigint, date, date, integer, text) to authenticated;

-- Guests must use the validated RPC. Admins can still insert from the staff app.
drop policy if exists "Guests create own bookings or admin creates all" on public.bookings;
create policy "Admins create bookings"
on public.bookings for insert to authenticated
with check (public.is_admin());

commit;
