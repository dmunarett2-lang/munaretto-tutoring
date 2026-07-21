-- Munaretto Tutoring - let admins update any student's profile
-- (focus, session balance, etc.). Without this, admin edits to another
-- user's profile silently affect 0 rows.
-- Run in Supabase SQL Editor. Plain ASCII. Safe to re-run.

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
