begin;

-- PostgREST yalnızca public şemasını yayınlıyor. DraBornGate'in güvenli iş mantığı
-- draborngate şemasında kalır; bu public fonksiyonlar yalnızca yetkili köprü görevi görür.
create or replace function public.dkd_gate_security_queue_v31(
  dkd_limit integer default 50,
  dkd_offset integer default 0
)
returns table (
  pass_id uuid, site_id uuid, site_name text, site_address text, gate text,
  courier_user_id uuid, courier_name text, courier_phone text, courier_plate text,
  platform text, origin_name text, origin_address text, origin_contact_name text,
  origin_contact_phone text, block text, floor text, apartment text,
  customer_name text, address_text text, destination_full text, order_number text,
  note text, status text, approval_code text, eta_minutes integer, distance_m numeric,
  created_at timestamptz, arrived_at timestamptz
)
language sql stable security invoker
set search_path = public, draborngate, auth
as $$
  select * from draborngate.dkd_gate_security_queue_v31(dkd_limit, dkd_offset);
$$;

create or replace function public.dkd_gate_security_find_pass_v31(dkd_code text)
returns table (
  pass_id uuid, site_id uuid, site_name text, site_address text, gate text,
  courier_name text, courier_phone text, courier_plate text, platform text,
  origin_name text, origin_address text, origin_contact_name text,
  origin_contact_phone text, block text, floor text, apartment text,
  customer_name text, address_text text, destination_full text, order_number text,
  note text, status text, approval_code text, eta_minutes integer, distance_m numeric,
  created_at timestamptz, arrived_at timestamptz
)
language sql stable security invoker
set search_path = public, draborngate, auth
as $$
  select * from draborngate.dkd_gate_security_find_pass_v31(dkd_code);
$$;

create or replace function public.dkd_gate_security_approve_pass_v31(dkd_code text)
returns jsonb
language sql volatile security invoker
set search_path = public, draborngate, auth
as $$
  select draborngate.dkd_gate_security_approve_pass_v31(dkd_code);
$$;

create or replace function public.dkd_gate_partner_summary_v31()
returns jsonb
language sql stable security invoker
set search_path = public, draborngate, auth
as $$
  select draborngate.dkd_gate_partner_summary_v31();
$$;

create or replace function public.dkd_gate_partner_earnings_rows_v31(
  dkd_limit integer default 20,
  dkd_offset integer default 0
)
returns table (
  earning_id uuid, site_name text, courier_name text, platform text,
  order_number text, amount numeric, currency text, status text, earned_at timestamptz
)
language sql stable security invoker
set search_path = public, draborngate, auth
as $$
  select * from draborngate.dkd_gate_partner_earnings_rows_v31(dkd_limit, dkd_offset);
$$;

create or replace function public.dkd_gate_admin_partner_catalog_v31()
returns jsonb
language sql stable security invoker
set search_path = public, draborngate, auth
as $$
  select draborngate.dkd_gate_admin_partner_catalog_v31();
$$;

create or replace function public.dkd_gate_admin_assign_partner_site_v31(
  dkd_user_id uuid,
  dkd_site_id uuid,
  dkd_amount_per_courier numeric default 10.00,
  dkd_is_active boolean default true
)
returns jsonb
language sql volatile security invoker
set search_path = public, draborngate, auth
as $$
  select draborngate.dkd_gate_admin_assign_partner_site_v31(
    dkd_user_id,
    dkd_site_id,
    dkd_amount_per_courier,
    dkd_is_active
  );
$$;

revoke all on function public.dkd_gate_security_queue_v31(integer, integer) from public, anon;
revoke all on function public.dkd_gate_security_find_pass_v31(text) from public, anon;
revoke all on function public.dkd_gate_security_approve_pass_v31(text) from public, anon;
revoke all on function public.dkd_gate_partner_summary_v31() from public, anon;
revoke all on function public.dkd_gate_partner_earnings_rows_v31(integer, integer) from public, anon;
revoke all on function public.dkd_gate_admin_partner_catalog_v31() from public, anon;
revoke all on function public.dkd_gate_admin_assign_partner_site_v31(uuid, uuid, numeric, boolean) from public, anon;

grant execute on function public.dkd_gate_security_queue_v31(integer, integer) to authenticated;
grant execute on function public.dkd_gate_security_find_pass_v31(text) to authenticated;
grant execute on function public.dkd_gate_security_approve_pass_v31(text) to authenticated;
grant execute on function public.dkd_gate_partner_summary_v31() to authenticated;
grant execute on function public.dkd_gate_partner_earnings_rows_v31(integer, integer) to authenticated;
grant execute on function public.dkd_gate_admin_partner_catalog_v31() to authenticated;
grant execute on function public.dkd_gate_admin_assign_partner_site_v31(uuid, uuid, numeric, boolean) to authenticated;

insert into draborngate.dkd_gate_schema_migrations(version, description)
values (
  'web-v3.2.1',
  'Public RPC bridge ile Sade Tema, Admin Paneli ve partner kazanç çağrıları PostgREST üzerinden çalışır'
)
on conflict (version) do update set description = excluded.description;

notify pgrst, 'reload schema';

commit;
