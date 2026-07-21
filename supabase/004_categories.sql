-- Munaretto Tutoring - inquiry deletes + packages grouped by session type
-- Run in Supabase SQL Editor after 003_booking.sql. Plain ASCII. Safe to re-run.

-- ---------- allow admins to delete consult requests ----------
drop policy if exists inquiries_delete_admin on public.inquiries;
create policy inquiries_delete_admin on public.inquiries
  for delete using (public.is_admin());
grant delete on public.inquiries to authenticated;

-- ---------- packages: session-type category ----------
alter table public.packages add column if not exists category text;

-- seed 3 sizes x 3 session types (only if no categorized packages exist yet)
insert into public.packages (name, category, sessions, price_cents, description, sort_order)
select v.name, v.category, v.sessions, v.price_cents, v.description, v.sort_order
from (values
  ('Single Session', 'ACT Prep', 1, 0, 'One 1-hour ACT prep session.', 11),
  ('5-Session Package', 'ACT Prep', 5, 0, 'Five 1-hour ACT prep sessions.', 12),
  ('10-Session Package', 'ACT Prep', 10, 0, 'Ten 1-hour ACT prep sessions.', 13),
  ('Single Session', 'College Applications & Essays', 1, 0, 'One 1-hour session on essays and applications.', 21),
  ('5-Session Package', 'College Applications & Essays', 5, 0, 'Five 1-hour sessions on essays and applications.', 22),
  ('10-Session Package', 'College Applications & Essays', 10, 0, 'Ten 1-hour sessions on essays and applications.', 23),
  ('Single Session', 'Subject-Specific Tutoring', 1, 0, 'One 1-hour subject tutoring session.', 31),
  ('5-Session Package', 'Subject-Specific Tutoring', 5, 0, 'Five 1-hour subject tutoring sessions.', 32),
  ('10-Session Package', 'Subject-Specific Tutoring', 10, 0, 'Ten 1-hour subject tutoring sessions.', 33)
) as v(name, category, sessions, price_cents, description, sort_order)
where not exists (select 1 from public.packages where category is not null);

-- remove the old untyped default packages (only the untouched, unpriced ones)
delete from public.packages
where category is null
  and price_cents = 0
  and name in ('Single Session', '5-Session Package', '10-Session Package');
