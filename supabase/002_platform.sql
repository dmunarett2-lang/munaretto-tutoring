-- Munaretto Tutoring - platform schema (packages, orders, student data, settings)
-- Run in Supabase SQL Editor after schema.sql. Plain ASCII. Safe to re-run.

-- ---------- profiles: session balance ----------
alter table public.profiles add column if not exists sessions_remaining int not null default 0;

-- ---------- app settings (single row: zelle handle, calendly url, notify email) ----------
create table if not exists public.app_settings (
  id int primary key default 1,
  zelle_handle text,
  calendly_url text,
  notify_email text,
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id = 1)
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;
alter table public.app_settings enable row level security;

drop policy if exists app_settings_select_all on public.app_settings;
create policy app_settings_select_all on public.app_settings for select using (true);
drop policy if exists app_settings_update_admin on public.app_settings;
create policy app_settings_update_admin on public.app_settings for update using (public.is_admin()) with check (public.is_admin());
grant select on public.app_settings to anon, authenticated;
grant update on public.app_settings to authenticated;

-- ---------- packages (purchasable; admin-editable prices) ----------
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sessions int not null,
  price_cents int not null default 0,
  description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.packages enable row level security;

drop policy if exists packages_select on public.packages;
create policy packages_select on public.packages for select using (is_active or public.is_admin());
drop policy if exists packages_insert_admin on public.packages;
create policy packages_insert_admin on public.packages for insert with check (public.is_admin());
drop policy if exists packages_update_admin on public.packages;
create policy packages_update_admin on public.packages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists packages_delete_admin on public.packages;
create policy packages_delete_admin on public.packages for delete using (public.is_admin());
grant select on public.packages to anon, authenticated;
grant insert, update, delete on public.packages to authenticated;

-- seed default packages only if the table is empty (price 0 = "contact for rate" until set)
insert into public.packages (name, sessions, price_cents, description, sort_order)
select v.name, v.sessions, v.price_cents, v.description, v.sort_order
from (values
  ('Single Session', 1, 0, 'One 1-hour session - help with a specific subject, assignment, or test section.', 1),
  ('5-Session Package', 5, 0, 'Five 1-hour sessions.', 2),
  ('10-Session Package', 10, 0, 'Ten 1-hour sessions.', 3)
) as v(name, sessions, price_cents, description, sort_order)
where not exists (select 1 from public.packages);

-- ---------- orders (manual payment queue) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete set null,
  buyer_name text not null,
  buyer_email text not null,
  package_id uuid references public.packages(id) on delete set null,
  package_name text not null,
  sessions int not null,
  amount_cents int not null,
  payment_method text not null default 'zelle',
  status text not null default 'pending' check (status in ('pending','paid','cancelled')),
  note text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.orders enable row level security;

drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders for insert with check (auth.uid() = student_id or public.is_admin());
drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders for select using (auth.uid() = student_id or public.is_admin());
drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders for update using (public.is_admin()) with check (public.is_admin());
grant insert, select on public.orders to authenticated;
grant update on public.orders to authenticated;

-- when an order flips to 'paid', credit its sessions to the student (definer bypasses RLS)
create or replace function public.credit_sessions_on_paid()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') and new.student_id is not null then
    update public.profiles
      set sessions_remaining = sessions_remaining + new.sessions
      where id = new.student_id;
    new.paid_at := now();
  end if;
  return new;
end;
$$;
drop trigger if exists orders_credit_sessions on public.orders;
create trigger orders_credit_sessions
  before update on public.orders
  for each row execute function public.credit_sessions_on_paid();

-- ---------- per-student dashboard data (admin edits, student reads) ----------
create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  detail text,
  percent int not null default 0 check (percent between 0 and 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.student_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subtitle text,
  when_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.student_resources (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.student_progress enable row level security;
alter table public.student_sessions enable row level security;
alter table public.student_resources enable row level security;

-- student reads own rows; admin reads + writes all (three tables, same shape)
do $$
declare t text;
begin
  foreach t in array array['student_progress','student_sessions','student_resources']
  loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format('create policy %I_select on public.%I for select using (auth.uid() = student_id or public.is_admin())', t, t);
    execute format('drop policy if exists %I_write on public.%I', t, t);
    execute format('create policy %I_write on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
