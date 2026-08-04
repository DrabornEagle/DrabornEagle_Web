-- DraBornGate Web v3.1.0
-- Gerçek güvenlik kuyruğu, kodla detay bulma/onaylama ve site bazlı partner kazancı.
begin;

alter table draborngate.dkd_gate_courier_passes
  add column if not exists origin_name text,
  add column if not exists origin_address text,
  add column if not exists origin_contact_name text,
  add column if not exists origin_contact_phone text;

create table if not exists draborngate.dkd_gate_partner_site_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site_id uuid not null references draborngate.dkd_gate_sites(id) on delete cascade,
  amount_per_courier numeric(12,2) not null default 10.00 check (amount_per_courier >= 0),
  currency text not null default 'TRY' check (currency = 'TRY'),
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, site_id)
);

create table if not exists draborngate.dkd_gate_partner_earnings (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references draborngate.dkd_gate_partner_site_links(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  site_id uuid not null references draborngate.dkd_gate_sites(id) on delete cascade,
  pass_id uuid not null references draborngate.dkd_gate_courier_passes(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'TRY' check (currency = 'TRY'),
  status text not null default 'accrued' check (status in ('accrued','paid','cancelled')),
  earned_at timestamptz not null default now(),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (link_id, pass_id)
);

create index if not exists dkd_gate_partner_links_user_active_idx
  on draborngate.dkd_gate_partner_site_links (user_id, is_active);
create index if not exists dkd_gate_partner_links_site_active_idx
  on draborngate.dkd_gate_partner_site_links (site_id, is_active);
create index if not exists dkd_gate_partner_earnings_user_date_idx
  on draborngate.dkd_gate_partner_earnings (user_id, earned_at desc);

alter table draborngate.dkd_gate_partner_site_links enable row level security;
alter table draborngate.dkd_gate_partner_earnings enable row level security;

drop policy if exists dkd_gate_partner_links_select_v31 on draborngate.dkd_gate_partner_site_links;
create policy dkd_gate_partner_links_select_v31
  on draborngate.dkd_gate_partner_site_links for select to authenticated
  using (user_id = auth.uid() or draborngate.dkd_gate_is_admin_user(auth.uid()));

drop policy if exists dkd_gate_partner_earnings_select_v31 on draborngate.dkd_gate_partner_earnings;
create policy dkd_gate_partner_earnings_select_v31
  on draborngate.dkd_gate_partner_earnings for select to authenticated
  using (user_id = auth.uid() or draborngate.dkd_gate_is_admin_user(auth.uid()));

revoke all on draborngate.dkd_gate_partner_site_links from anon, authenticated;
revoke all on draborngate.dkd_gate_partner_earnings from anon, authenticated;
grant select on draborngate.dkd_gate_partner_site_links to authenticated;
grant select on draborngate.dkd_gate_partner_earnings to authenticated;

create or replace function draborngate.dkd_gate_partner_accrue_v31()
returns trigger
language plpgsql
security definer
set search_path = draborngate, public, auth
as $$
declare
  dkd_event_time timestamptz;
begin
  if new.status = 'completed'
     and coalesce(new.is_demo, false) = false
     and (tg_op = 'INSERT' or old.status is distinct from 'completed') then
    dkd_event_time := coalesce(new.code_used_at, new.completed_at, now());
    insert into draborngate.dkd_gate_partner_earnings
      (link_id,user_id,site_id,pass_id,amount,currency,status,earned_at)
    select dkd_link.id,dkd_link.user_id,dkd_link.site_id,new.id,
           dkd_link.amount_per_courier,dkd_link.currency,'accrued',dkd_event_time
    from draborngate.dkd_gate_partner_site_links dkd_link
    where dkd_link.site_id = new.site_id
      and dkd_link.is_active
      and dkd_link.starts_at <= dkd_event_time
      and (dkd_link.ends_at is null or dkd_link.ends_at > dkd_event_time)
    on conflict (link_id,pass_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists dkd_gate_partner_accrue_v31 on draborngate.dkd_gate_courier_passes;
create trigger dkd_gate_partner_accrue_v31
after insert or update of status,code_used_at,completed_at
on draborngate.dkd_gate_courier_passes
for each row execute function draborngate.dkd_gate_partner_accrue_v31();

create or replace function draborngate.dkd_gate_security_queue_v31(
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
language sql stable security definer
set search_path = draborngate, public, auth
as $$
  select dkd_pass.id,dkd_pass.site_id,dkd_site.name,coalesce(dkd_site.address,''),
    dkd_pass.gate,dkd_pass.courier_user_id,dkd_pass.courier_name,
    coalesce(dkd_pass.courier_phone,''),coalesce(dkd_pass.courier_plate,''),
    dkd_pass.platform,coalesce(nullif(dkd_pass.origin_name,''),dkd_pass.platform),
    coalesce(nullif(dkd_pass.origin_address,''),dkd_pass.platform||' gönderisi'),
    coalesce(dkd_pass.origin_contact_name,''),coalesce(dkd_pass.origin_contact_phone,''),
    dkd_pass.block,coalesce(dkd_pass.floor,''),dkd_pass.apartment,
    coalesce(dkd_pass.customer_name,''),coalesce(dkd_pass.address_text,''),
    concat_ws(' · ',nullif(dkd_pass.address_text,''),nullif(dkd_pass.block,''),
      case when nullif(dkd_pass.floor,'') is not null then 'Kat '||dkd_pass.floor end,
      case when nullif(dkd_pass.apartment,'') is not null then 'Daire '||dkd_pass.apartment end,
      nullif(dkd_pass.gate,''),nullif(dkd_site.name,''),nullif(dkd_site.address,'')),
    dkd_pass.order_number,coalesce(dkd_pass.note,''),dkd_pass.status,
    coalesce(dkd_pass.approval_code,''),dkd_pass.eta_minutes,dkd_pass.last_distance_m,
    dkd_pass.created_at,dkd_pass.arrived_at
  from draborngate.dkd_gate_courier_passes dkd_pass
  join draborngate.dkd_gate_sites dkd_site on dkd_site.id=dkd_pass.site_id
  where dkd_pass.status in ('waiting','approved','arrived')
    and (draborngate.dkd_gate_is_admin_user(auth.uid())
      or draborngate.dkd_gate_is_site_staff(dkd_pass.site_id,auth.uid()))
  order by case dkd_pass.status when 'arrived' then 0 when 'approved' then 1 else 2 end,
    dkd_pass.arrived_at desc nulls last,dkd_pass.created_at desc
  limit greatest(1,least(coalesce(dkd_limit,50),100))
  offset greatest(0,coalesce(dkd_offset,0));
$$;

create or replace function draborngate.dkd_gate_security_find_pass_v31(dkd_code text)
returns table (
  pass_id uuid, site_id uuid, site_name text, site_address text, gate text,
  courier_name text, courier_phone text, courier_plate text, platform text,
  origin_name text, origin_address text, origin_contact_name text,
  origin_contact_phone text, block text, floor text, apartment text,
  customer_name text, address_text text, destination_full text, order_number text,
  note text, status text, approval_code text, eta_minutes integer, distance_m numeric,
  created_at timestamptz, arrived_at timestamptz
)
language sql stable security definer
set search_path = draborngate, public, auth
as $$
  select dkd_pass.id,dkd_pass.site_id,dkd_site.name,coalesce(dkd_site.address,''),
    dkd_pass.gate,dkd_pass.courier_name,coalesce(dkd_pass.courier_phone,''),
    coalesce(dkd_pass.courier_plate,''),dkd_pass.platform,
    coalesce(nullif(dkd_pass.origin_name,''),dkd_pass.platform),
    coalesce(nullif(dkd_pass.origin_address,''),dkd_pass.platform||' gönderisi'),
    coalesce(dkd_pass.origin_contact_name,''),coalesce(dkd_pass.origin_contact_phone,''),
    dkd_pass.block,coalesce(dkd_pass.floor,''),dkd_pass.apartment,
    coalesce(dkd_pass.customer_name,''),coalesce(dkd_pass.address_text,''),
    concat_ws(' · ',nullif(dkd_pass.address_text,''),nullif(dkd_pass.block,''),
      case when nullif(dkd_pass.floor,'') is not null then 'Kat '||dkd_pass.floor end,
      case when nullif(dkd_pass.apartment,'') is not null then 'Daire '||dkd_pass.apartment end,
      nullif(dkd_pass.gate,''),nullif(dkd_site.name,''),nullif(dkd_site.address,'')),
    dkd_pass.order_number,coalesce(dkd_pass.note,''),dkd_pass.status,
    coalesce(dkd_pass.approval_code,''),dkd_pass.eta_minutes,dkd_pass.last_distance_m,
    dkd_pass.created_at,dkd_pass.arrived_at
  from draborngate.dkd_gate_courier_passes dkd_pass
  join draborngate.dkd_gate_sites dkd_site on dkd_site.id=dkd_pass.site_id
  where dkd_pass.approval_code=regexp_replace(coalesce(dkd_code,''),'\D','','g')
    and length(regexp_replace(coalesce(dkd_code,''),'\D','','g'))=6
    and dkd_pass.code_used_at is null
    and dkd_pass.status in ('waiting','approved','arrived')
    and (draborngate.dkd_gate_is_admin_user(auth.uid())
      or draborngate.dkd_gate_is_site_staff(dkd_pass.site_id,auth.uid()))
  order by case dkd_pass.status when 'arrived' then 0 when 'approved' then 1 else 2 end,
    dkd_pass.created_at desc limit 1;
$$;

create or replace function draborngate.dkd_gate_security_approve_pass_v31(dkd_code text)
returns jsonb
language plpgsql security definer
set search_path = draborngate, public, auth
as $$
declare
  dkd_clean_code text:=regexp_replace(coalesce(dkd_code,''),'\D','','g');
  dkd_pass draborngate.dkd_gate_courier_passes%rowtype;
  dkd_site_name text;
begin
  if length(dkd_clean_code)<>6 then
    raise exception '6 haneli kurye kodu geçersiz.' using errcode='22023';
  end if;
  select dkd_row.* into dkd_pass
  from draborngate.dkd_gate_courier_passes dkd_row
  where dkd_row.approval_code=dkd_clean_code and dkd_row.code_used_at is null
    and dkd_row.status in ('waiting','approved','arrived')
    and (draborngate.dkd_gate_is_admin_user(auth.uid())
      or draborngate.dkd_gate_is_site_staff(dkd_row.site_id,auth.uid()))
  order by case dkd_row.status when 'arrived' then 0 when 'approved' then 1 else 2 end,
    dkd_row.created_at desc limit 1 for update;
  if dkd_pass.id is null then
    raise exception 'Aktif kurye geçişi bulunamadı veya bu site için yetkiniz yok.' using errcode='P0002';
  end if;
  update draborngate.dkd_gate_courier_passes
    set status='completed',code_used_at=now(),completed_at=now(),approval_code=null
    where id=dkd_pass.id;
  select name into dkd_site_name from draborngate.dkd_gate_sites where id=dkd_pass.site_id;
  insert into draborngate.dkd_gate_pass_events
    (pass_id,actor_user_id,event_type,title,detail,tone,icon,is_demo,demo_owner_user_id)
  values (dkd_pass.id,auth.uid(),'completed','Giriş tamamlandı',
    'Kod doğrulandı • '||concat_ws(' / ',nullif(dkd_pass.block,''),nullif(dkd_pass.floor,''),nullif(dkd_pass.apartment,'')),
    'cyan','key',dkd_pass.is_demo,dkd_pass.demo_owner_user_id);
  return jsonb_build_object('ok',true,'pass_id',dkd_pass.id,'site_name',coalesce(dkd_site_name,''),
    'courier_name',dkd_pass.courier_name,'order_number',dkd_pass.order_number,'completed_at',now());
end;
$$;

create or replace function draborngate.dkd_gate_partner_summary_v31()
returns jsonb
language sql stable security definer
set search_path = draborngate, public, auth
as $$
  select jsonb_build_object(
    'visible',exists(select 1 from draborngate.dkd_gate_partner_site_links l
      where l.user_id=auth.uid() and l.is_active and (l.ends_at is null or l.ends_at>now())),
    'total_amount',coalesce((select sum(e.amount) from draborngate.dkd_gate_partner_earnings e
      where e.user_id=auth.uid() and e.status<>'cancelled'),0),
    'today_amount',coalesce((select sum(e.amount) from draborngate.dkd_gate_partner_earnings e
      where e.user_id=auth.uid() and e.status<>'cancelled' and e.earned_at>=date_trunc('day',now())),0),
    'month_amount',coalesce((select sum(e.amount) from draborngate.dkd_gate_partner_earnings e
      where e.user_id=auth.uid() and e.status<>'cancelled' and e.earned_at>=date_trunc('month',now())),0),
    'pass_count',coalesce((select count(*) from draborngate.dkd_gate_partner_earnings e
      where e.user_id=auth.uid() and e.status<>'cancelled'),0),
    'sites',coalesce((select jsonb_agg(jsonb_build_object('link_id',l.id,'site_id',l.site_id,
      'site_name',s.name,'amount_per_courier',l.amount_per_courier,'currency',l.currency,
      'starts_at',l.starts_at) order by s.name)
      from draborngate.dkd_gate_partner_site_links l join draborngate.dkd_gate_sites s on s.id=l.site_id
      where l.user_id=auth.uid() and l.is_active and (l.ends_at is null or l.ends_at>now())),'[]'::jsonb));
$$;

create or replace function draborngate.dkd_gate_partner_earnings_rows_v31(
  dkd_limit integer default 20, dkd_offset integer default 0
)
returns table (earning_id uuid,site_name text,courier_name text,platform text,
  order_number text,amount numeric,currency text,status text,earned_at timestamptz)
language sql stable security definer
set search_path = draborngate, public, auth
as $$
  select e.id,s.name,p.courier_name,p.platform,p.order_number,e.amount,e.currency,e.status,e.earned_at
  from draborngate.dkd_gate_partner_earnings e
  join draborngate.dkd_gate_sites s on s.id=e.site_id
  join draborngate.dkd_gate_courier_passes p on p.id=e.pass_id
  where e.user_id=auth.uid() order by e.earned_at desc
  limit greatest(1,least(coalesce(dkd_limit,20),100)) offset greatest(0,coalesce(dkd_offset,0));
$$;

create or replace function draborngate.dkd_gate_admin_partner_catalog_v31()
returns jsonb
language plpgsql stable security definer
set search_path = draborngate, public, auth
as $$
begin
  if not draborngate.dkd_gate_is_admin_user(auth.uid()) then
    raise exception 'Admin yetkisi gerekli.' using errcode='42501';
  end if;
  return jsonb_build_object(
    'users',coalesce((select jsonb_agg(jsonb_build_object('user_id',p.user_id,'full_name',p.full_name,
      'email',u.email,'preferred_role',p.preferred_role) order by p.full_name,u.email)
      from draborngate.dkd_gate_profiles p join auth.users u on u.id=p.user_id),'[]'::jsonb),
    'sites',coalesce((select jsonb_agg(jsonb_build_object('site_id',s.id,'site_name',s.name,
      'city',s.city,'is_active',s.is_active) order by s.name) from draborngate.dkd_gate_sites s),'[]'::jsonb),
    'links',coalesce((select jsonb_agg(jsonb_build_object('link_id',l.id,'user_id',l.user_id,
      'user_name',p.full_name,'site_id',l.site_id,'site_name',s.name,
      'amount_per_courier',l.amount_per_courier,'currency',l.currency,'is_active',l.is_active,
      'starts_at',l.starts_at,'ends_at',l.ends_at) order by l.created_at desc)
      from draborngate.dkd_gate_partner_site_links l
      join draborngate.dkd_gate_profiles p on p.user_id=l.user_id
      join draborngate.dkd_gate_sites s on s.id=l.site_id),'[]'::jsonb));
end;
$$;

create or replace function draborngate.dkd_gate_admin_assign_partner_site_v31(
  dkd_user_id uuid, dkd_site_id uuid,
  dkd_amount_per_courier numeric default 10.00,
  dkd_is_active boolean default true
)
returns jsonb
language plpgsql security definer
set search_path = draborngate, public, auth
as $$
declare dkd_link_id uuid;
begin
  if not draborngate.dkd_gate_is_admin_user(auth.uid()) then
    raise exception 'Admin yetkisi gerekli.' using errcode='42501';
  end if;
  if dkd_amount_per_courier<0 then raise exception 'Kurye başı kazanç negatif olamaz.'; end if;
  if not exists(select 1 from auth.users where id=dkd_user_id) then raise exception 'Kullanıcı bulunamadı.'; end if;
  if not exists(select 1 from draborngate.dkd_gate_sites where id=dkd_site_id) then raise exception 'Site bulunamadı.'; end if;
  insert into draborngate.dkd_gate_partner_site_links
    (user_id,site_id,amount_per_courier,is_active,starts_at,ends_at,created_by)
  values (dkd_user_id,dkd_site_id,dkd_amount_per_courier,dkd_is_active,now(),
    case when dkd_is_active then null else now() end,auth.uid())
  on conflict (user_id,site_id) do update set
    amount_per_courier=excluded.amount_per_courier,is_active=excluded.is_active,
    starts_at=case when excluded.is_active then now() else draborngate.dkd_gate_partner_site_links.starts_at end,
    ends_at=case when excluded.is_active then null else now() end,
    created_by=auth.uid(),updated_at=now()
  returning id into dkd_link_id;
  return jsonb_build_object('ok',true,'link_id',dkd_link_id);
end;
$$;

revoke all on function draborngate.dkd_gate_security_queue_v31(integer,integer) from public;
revoke all on function draborngate.dkd_gate_security_find_pass_v31(text) from public;
revoke all on function draborngate.dkd_gate_security_approve_pass_v31(text) from public;
revoke all on function draborngate.dkd_gate_partner_summary_v31() from public;
revoke all on function draborngate.dkd_gate_partner_earnings_rows_v31(integer,integer) from public;
revoke all on function draborngate.dkd_gate_admin_partner_catalog_v31() from public;
revoke all on function draborngate.dkd_gate_admin_assign_partner_site_v31(uuid,uuid,numeric,boolean) from public;

grant execute on function draborngate.dkd_gate_security_queue_v31(integer,integer) to authenticated;
grant execute on function draborngate.dkd_gate_security_find_pass_v31(text) to authenticated;
grant execute on function draborngate.dkd_gate_security_approve_pass_v31(text) to authenticated;
grant execute on function draborngate.dkd_gate_partner_summary_v31() to authenticated;
grant execute on function draborngate.dkd_gate_partner_earnings_rows_v31(integer,integer) to authenticated;
grant execute on function draborngate.dkd_gate_admin_partner_catalog_v31() to authenticated;
grant execute on function draborngate.dkd_gate_admin_assign_partner_site_v31(uuid,uuid,numeric,boolean) to authenticated;

insert into draborngate.dkd_gate_schema_migrations(version,description)
values ('web-v3.1.0','Gerçek güvenlik kuyruğu, kod popup doğrulaması ve site bazlı 10 TL partner kazanç sistemi')
on conflict (version) do nothing;

commit;
