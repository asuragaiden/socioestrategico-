-- CRM administrativo ADN Estratégico — ejecutar en Supabase SQL Editor
-- Modelo seguro: roles administradores separados; nunca publicar service_role.
create table if not exists public.adn_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.adn_crm_followups (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.adn_participants(user_id) on delete cascade,
  status text not null default 'nuevo' check(status in ('nuevo','contactado','en_seguimiento','asesoria_agendada','cerrado')),
  notes text not null default '',
  next_contact_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create index if not exists adn_crm_followups_participant on public.adn_crm_followups(participant_id);
alter table public.adn_admins enable row level security;
alter table public.adn_crm_followups enable row level security;
revoke all on public.adn_admins from anon, authenticated;
revoke all on public.adn_crm_followups from anon;
grant select on public.adn_admins to authenticated;
grant select,insert,update on public.adn_crm_followups to authenticated;
-- La lista de administradores no puede ser modificada desde el navegador.
drop policy if exists "admins_read_self" on public.adn_admins;
create policy "admins_read_self" on public.adn_admins for select to authenticated using (user_id=(select auth.uid()));
-- La función SECURITY DEFINER consulta roles sin exponer la lista.
create or replace function public.adn_is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.adn_admins where user_id=(select auth.uid())) $$;
revoke all on function public.adn_is_admin() from public, anon;
grant execute on function public.adn_is_admin() to authenticated;
-- Añadir acceso administrativo a las políticas SELECT existentes; las reglas de propietario se mantienen.
drop policy if exists "admin_read_participants" on public.adn_participants;
create policy "admin_read_participants" on public.adn_participants for select to authenticated using ((select public.adn_is_admin()));
drop policy if exists "admin_read_diagnostics" on public.adn_diagnostics;
create policy "admin_read_diagnostics" on public.adn_diagnostics for select to authenticated using ((select public.adn_is_admin()));
drop policy if exists "admin_read_followups" on public.adn_crm_followups;
create policy "admin_read_followups" on public.adn_crm_followups for select to authenticated using ((select public.adn_is_admin()));
drop policy if exists "admin_insert_followups" on public.adn_crm_followups;
create policy "admin_insert_followups" on public.adn_crm_followups for insert to authenticated with check ((select public.adn_is_admin()));
drop policy if exists "admin_update_followups" on public.adn_crm_followups;
create policy "admin_update_followups" on public.adn_crm_followups for update to authenticated using ((select public.adn_is_admin())) with check ((select public.adn_is_admin()));
-- IMPORTANTE: conceder administrador manualmente desde SQL Editor DESPUÉS de validar la identidad.
-- Buscar el UUID del usuario administrador en Authentication > Users.
-- Sustituir UUID_AQUI y ejecutar aparte:
-- insert into public.adn_admins(user_id) values ('UUID_AQUI') on conflict do nothing;
