-- ADN Estratégico: auditoría de lectura de seguridad (solo consultas SELECT).
-- Ejecutar en Supabase SQL Editor como administrador. No modifica datos ni políticas.
-- IMPORTANTE: una consulta desde SQL Editor como administrador puede omitir RLS;
-- estas consultas inspeccionan configuración, NO simulan un usuario autenticado.
select c.relname as tabla,c.relrowsecurity as rls_habilitado,c.relforcerowsecurity as rls_forzado
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('adn_participants','adn_diagnostics')
order by c.relname;

select tablename,policyname,permissive,roles,cmd,qual,with_check
from pg_policies
where schemaname='public' and tablename in ('adn_participants','adn_diagnostics')
order by tablename,cmd,policyname;

select table_name,grantee,privilege_type
from information_schema.role_table_grants
where table_schema='public'
and table_name in ('adn_participants','adn_diagnostics')
and grantee in ('anon','authenticated','PUBLIC')
order by table_name,grantee,privilege_type;

-- Solo conteos, sin datos personales.
select 'adn_participants' as tabla,count(*) as total from public.adn_participants
union all
select 'adn_diagnostics' as tabla,count(*) as total from public.adn_diagnostics;
