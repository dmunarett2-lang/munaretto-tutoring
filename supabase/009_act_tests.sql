-- Munaretto Tutoring - ACT test history (dated section scores per student)
-- Run in Supabase SQL Editor. Plain ASCII. Safe to re-run.

create table if not exists public.act_tests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  test_date date not null,
  english int,
  math int,
  reading int,
  science int,
  writing int,
  composite int,
  created_at timestamptz not null default now()
);
alter table public.act_tests enable row level security;

drop policy if exists act_tests_select on public.act_tests;
create policy act_tests_select on public.act_tests
  for select using (auth.uid() = student_id or public.is_admin());
drop policy if exists act_tests_write on public.act_tests;
create policy act_tests_write on public.act_tests
  for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.act_tests to authenticated;
