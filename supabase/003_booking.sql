-- Munaretto Tutoring - booking types (Calendly event links per session type)
-- Run in Supabase SQL Editor after 002_platform.sql. Plain ASCII. Safe to re-run.

create table if not exists public.booking_types (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  calendly_url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.booking_types enable row level security;

drop policy if exists booking_types_select on public.booking_types;
create policy booking_types_select on public.booking_types
  for select using (is_active or public.is_admin());
drop policy if exists booking_types_write on public.booking_types;
create policy booking_types_write on public.booking_types
  for all using (public.is_admin()) with check (public.is_admin());
grant select on public.booking_types to anon, authenticated;
grant insert, update, delete on public.booking_types to authenticated;

-- seed the three session types (only if the table is empty)
insert into public.booking_types (label, description, calendly_url, sort_order)
select v.label, v.description, v.calendly_url, v.sort_order
from (values
  ('ACT Prep', 'Test prep and strategy sessions.', 'https://calendly.com/dmunarett2/30min', 1),
  ('College Applications & Essays', 'Personal statement, supplements, and application support.', 'https://calendly.com/dmunarett2/1-hour-session-college-application-essays', 2),
  ('Subject-Specific Tutoring', 'One-hour help in any high school subject.', 'https://calendly.com/dmunarett2/1-hour-session-subject-specific-tutoring', 3)
) as v(label, description, calendly_url, sort_order)
where not exists (select 1 from public.booking_types);
