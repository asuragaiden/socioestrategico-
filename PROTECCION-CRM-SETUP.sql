-- Proyecto Socio Estratégico / Captación de prospectos de seguros.
-- REVISIÓN PREVIA A EJECUTAR: la instancia existente está inactiva.
-- Aislamiento: ninguna inserción ni consulta anónima a las tablas. Sólo Edge Function
-- validada con Turnstile puede registrar; CRM sólo administradores autenticados.
-- Depende de la función public.adn_is_admin() y tabla public.adn_admins existentes.

create table if not exists public.insurance_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 3 and 100),
  phone text not null check (phone ~ '^[0-9]{10}$'),
  email text check (email is null or char_length(email) <= 150),
  city text check (city is null or char_length(city) <= 80),
  age_range text not null check (age_range in ('18_24','25_34','35_44','45_54','55_64','65_mas')),
  gender text check (gender is null or gender in ('mujer','hombre','otra')),
  objective text not null check (objective in ('familia','ingresos','retiro','educacion','patrimonio','empresa','explorar')),
  budget text not null check (budget in ('menos_500','500_999','1000_1999','2000_3999','4000_mas','por_definir')),
  timeframe text not null check (timeframe in ('esta_semana','este_mes','tres_meses','explorando')),
  contact_method text not null check (contact_method in ('whatsapp','llamada','email')),
  contact_consent boolean not null check (contact_consent = true),
  marketing_opt_in boolean not null default false,
  consent_version text not null check (char_length(consent_version)>3 and consent_version <> 'PENDIENTE'),
  consent_at timestamptz not null default now(),
  source text not null default 'directo',
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  lead_score smallint not null default 0 check (lead_score between 0 and 100),
  is_qualified boolean not null default false,
  stage text not null default 'nuevo' check (stage in ('nuevo','contactado','calificado','cita','propuesta','cerrado','no_viable')),
  next_contact_at timestamptz,
  assigned_to uuid references auth.users(id),
  closed_at timestamptz
);
create index if not exists insurance_leads_created_at_idx on public.insurance_leads(created_at desc);
create index if not exists insurance_leads_stage_idx on public.insurance_leads(stage,next_contact_at);
create index if not exists insurance_leads_phone_idx on public.insurance_leads(phone);
create index if not exists insurance_leads_source_idx on public.insurance_leads(source,created_at desc);

create table if not exists public.insurance_lead_activities(
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.insurance_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  activity_type text not null check(activity_type in ('nota','whatsapp','llamada','correo','cita','propuesta','cierre','baja')),
  note text not null default '' check (char_length(note)<=3000),
  next_contact_at timestamptz
);
create index if not exists insurance_lead_activities_lead_idx on public.insurance_lead_activities(lead_id,created_at desc);

alter table public.insurance_leads enable row level security;
alter table public.insurance_lead_activities enable row level security;
revoke all on public.insurance_leads from anon, authenticated;
revoke all on public.insurance_lead_activities from anon, authenticated;
grant select,insert,update,delete on public.insurance_leads to authenticated;
grant select,insert,update,delete on public.insurance_lead_activities to authenticated;

drop policy if exists "insurance_admin_leads_select" on public.insurance_leads;
create policy "insurance_admin_leads_select" on public.insurance_leads
 for select to authenticated using ((select public.adn_is_admin()));
drop policy if exists "insurance_admin_leads_insert" on public.insurance_leads;
create policy "insurance_admin_leads_insert" on public.insurance_leads
 for insert to authenticated with check ((select public.adn_is_admin()));
drop policy if exists "insurance_admin_leads_update" on public.insurance_leads;
create policy "insurance_admin_leads_update" on public.insurance_leads
 for update to authenticated using ((select public.adn_is_admin())) with check ((select public.adn_is_admin()));
drop policy if exists "insurance_admin_leads_delete" on public.insurance_leads;
create policy "insurance_admin_leads_delete" on public.insurance_leads
 for delete to authenticated using ((select public.adn_is_admin()));

drop policy if exists "insurance_admin_activities_select" on public.insurance_lead_activities;
create policy "insurance_admin_activities_select" on public.insurance_lead_activities
 for select to authenticated using ((select public.adn_is_admin()));
drop policy if exists "insurance_admin_activities_insert" on public.insurance_lead_activities;
create policy "insurance_admin_activities_insert" on public.insurance_lead_activities
 for insert to authenticated with check ((select public.adn_is_admin()));
drop policy if exists "insurance_admin_activities_update" on public.insurance_lead_activities;
create policy "insurance_admin_activities_update" on public.insurance_lead_activities
 for update to authenticated using ((select public.adn_is_admin())) with check ((select public.adn_is_admin()));
drop policy if exists "insurance_admin_activities_delete" on public.insurance_lead_activities;
create policy "insurance_admin_activities_delete" on public.insurance_lead_activities
 for delete to authenticated using ((select public.adn_is_admin()));

-- Revisar y probar el esquema en Supabase antes del lanzamiento.
-- Pendientes: política operativa de retención/baja y controles de auditoría/exportación.
