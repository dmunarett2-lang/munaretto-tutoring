-- Munaretto Tutoring - Supabase schema + RLS
-- Run in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Plain ASCII only (avoids copy-paste artifacts). Safe to re-run.

-- profiles: one row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  focus text,
  next_session text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- inquiries: consult requests from the contact form
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;

-- admin check (SECURITY DEFINER bypasses RLS, avoiding policy recursion)
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- keep non-admins from changing their own role
create or replace function public.prevent_role_change()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  -- Only restrict real logged-in users. auth.uid() is null for the SQL editor
  -- and service role, so admin promotion from the dashboard still works.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- RLS policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin on public.profiles for select using (public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists inquiries_insert_anyone on public.inquiries;
create policy inquiries_insert_anyone on public.inquiries for insert with check (true);

drop policy if exists inquiries_select_admin on public.inquiries;
create policy inquiries_select_admin on public.inquiries for select using (public.is_admin());

-- table grants (RLS still filters rows)
grant select, update on public.profiles to authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select on public.inquiries to authenticated;

-- After running this, sign up on the site, then promote yourself:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
