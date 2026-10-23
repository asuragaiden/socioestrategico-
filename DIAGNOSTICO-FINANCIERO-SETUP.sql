-- Ejecutar manualmente en Supabase SQL Editor, proyecto ADN Estratégico.
-- Requiere tabla public.adn_admins y función public.adn_is_admin() existentes.
-- Acceso: exclusivamente el UUID indicado en app_financial_owner; NO todos los administradores ADN.
create table if not exists public.app_financial_owner (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.app_financial_owner enable row level security;
revoke all on public.app_financial_owner from anon, authenticated;
create or replace function public.app_is_financial_owner()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.app_financial_owner o where o.user_id = (select auth.uid())); $$;
revoke all on function public.app_is_financial_owner() from public;
grant execute on function public.app_is_financial_owner() to authenticated;
create table if not exists public.app_financial_cases (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 reference text not null default '',
 appointment_date date,
 stage text not null default 'Primera entrevista',
 priority text not null default 'Protección',
 financial_data jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists app_financial_cases_owner_updated on public.app_financial_cases(owner_id,updated_at desc);
alter table public.app_financial_cases enable row level security;
revoke all on public.app_financial_cases from anon,authenticated;
grant select,insert,update,delete on public.app_financial_cases to authenticated;
drop policy if exists financial_owner_select on public.app_financial_cases;
create policy financial_owner_select on public.app_financial_cases for select to authenticated
using (owner_id=(select auth.uid()) and (select public.app_is_financial_owner()));
drop policy if exists financial_owner_insert on public.app_financial_cases;
create policy financial_owner_insert on public.app_financial_cases for insert to authenticated
with check (owner_id=(select auth.uid()) and (select public.app_is_financial_owner()));
drop policy if exists financial_owner_update on public.app_financial_cases;
create policy financial_owner_update on public.app_financial_cases for update to authenticated
using (owner_id=(select auth.uid()) and (select public.app_is_financial_owner()))
with check (owner_id=(select auth.uid()) and (select public.app_is_financial_owner()));
drop policy if exists financial_owner_delete on public.app_financial_cases;
create policy financial_owner_delete on public.app_financial_cases for delete to authenticated
using (owner_id=(select auth.uid()) and (select public.app_is_financial_owner()));
-- DESPUÉS de autenticarte en la app, sustituye el UUID por tu auth.users.id REAL:
-- insert into public.app_financial_owner(user_id) values ('UUID-DE-TU-CUENTA') on conflict do nothing;
-- Nunca pongas service_role en el navegador.
