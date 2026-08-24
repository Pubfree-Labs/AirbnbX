-- Refresh only old seed bookings so the dashboard has useful recent data.
-- Recent bookings created by the customer website are intentionally untouched.
-- This script is idempotent: after the first run, the updated rows no longer
-- match the "older than 90 days" condition.

with historical_bookings as (
  select
    id,
    row_number() over (order by id) as row_num,
    greatest(coalesce("numNights", 1), 1)::integer as nights
  from public.bookings
  where created_at < current_date - interval '90 days'
),
shifted_bookings as (
  select
    id,
    nights,
    row_num,
    -- Spread stays from 45 days ago through 14 days in the future.
    (current_date - (((row_num - 1) % 60)::integer - 14))::date as new_start_date
  from historical_bookings
),
coherent_bookings as (
  select
    id,
    new_start_date,
    (new_start_date + nights)::date as new_end_date,
    -- A booking is always created before its stay and never in the future.
    least(
      now() - (((row_num % 48) + 1)::text || ' hours')::interval,
      new_start_date::timestamp
        - (((row_num % 10) + 1)::text || ' days')::interval
        + time '10:00'
    ) as new_created_at
  from shifted_bookings
)
update public.bookings as booking
set
  created_at = refreshed.new_created_at,
  "startDate" = refreshed.new_start_date,
  "endDate" = refreshed.new_end_date,
  status = case
    when refreshed.new_start_date >= current_date then 'unconfirmed'
    when refreshed.new_end_date >= current_date then 'checked-in'
    else 'checked-out'
  end,
  "isPaid" = refreshed.new_start_date < current_date
from coherent_bookings as refreshed
where booking.id = refreshed.id;

-- Return a compact verification summary in the Supabase SQL editor.
select
  status,
  count(*) as booking_count,
  min("startDate") as earliest_start,
  max("startDate") as latest_start,
  sum("totalPrice") as total_booking_value
from public.bookings
where created_at >= current_date - interval '90 days'
group by status
order by status;
