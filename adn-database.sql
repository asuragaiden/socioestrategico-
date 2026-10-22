-- Ejecutar en Supabase SQL Editor; NO exponer esta operación en el navegador.
-- Los datos se protegen por usuario autenticado y RLS.
create table if not exists public.adn_participants (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text check (phone is null or char_length(phone) between 8 and 25),
  city text,
  years_experience integer check (years_experience between 0 and 80),
  privacy_accepted_at timestamptz not null,
  privacy_version text not null,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.adn_diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  questionnaire_version text not null,
  answers jsonb not null,
  results jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists adn_diagnostics_user_date on public.adn_diagnostics(user_id,created_at desc);
alter table public.adn_participants enable row level security;
alter table public.adn_diagnostics enable row level security;
revoke all on public.adn_participants from anon;
revoke all on public.adn_diagnostics from anon;
grant select,insert,update on public.adn_participants to authenticated;
grant select,insert on public.adn_diagnostics to authenticated;
drop policy if exists "participant_read_own" on public.adn_participants;
create policy "participant_read_own" on public.adn_participants for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "participant_insert_own" on public.adn_participants;
create policy "participant_insert_own" on public.adn_participants for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists "participant_update_own" on public.adn_participants;
create policy "participant_update_own" on public.adn_participants for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "diagnostics_read_own" on public.adn_diagnostics;
create policy "diagnostics_read_own" on public.adn_diagnostics for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "diagnostics_insert_own" on public.adn_diagnostics;
create policy "diagnostics_insert_own" on public.adn_diagnostics for insert to authenticated with check ((select auth.uid())=user_id);
-- El dashboard administrativo necesitará un backend separado con control de roles.
-- No colocar una service_role key en GitHub Pages.
