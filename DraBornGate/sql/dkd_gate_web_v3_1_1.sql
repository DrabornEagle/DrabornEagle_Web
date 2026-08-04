begin;

-- v3.1.1: Sipariş ekran görüntüsü artık isteğe bağlıdır.
create or replace function public.dkd_gate_create_courier_pass_v2(
  p_site_id uuid,
  p_gate_id uuid,
  p_gate text,
  p_customer_name text,
  p_address_text text,
  p_block text,
  p_floor text,
  p_apartment text,
  p_order_number text,
  p_note text default ''::text,
  p_screenshot_url text default null::text,
  p_ocr_text text default null::text,
  p_ocr_payload jsonb default '{}'::jsonb,
  p_eta_minutes integer default 6,
  p_rules_version integer default null::integer,
  p_rules_accepted boolean default false,
  p_screenshot_captured_at timestamptz default now()
)
returns uuid
language plpgsql
security definer
set search_path = draborngate, public, auth
as $$
declare
  dkd_uid uuid := auth.uid();
  dkd_pass_id uuid;
  dkd_profile record;
  dkd_courier_profile record;
  dkd_selected_gate record;
  dkd_has_critical_rules boolean;
  dkd_generated_code text;
  dkd_attempts integer := 0;
begin
  if dkd_uid is null then
    raise exception 'Oturum gerekli';
  end if;

  if not exists (
    select 1 from draborngate.dkd_gate_sites dkd_site
    where dkd_site.id = p_site_id and dkd_site.is_active
  ) then
    raise exception 'Aktif site bulunamadı';
  end if;

  if p_gate_id is not null then
    select dkd_gate.* into dkd_selected_gate
    from draborngate.dkd_gate_site_gates dkd_gate
    where dkd_gate.id = p_gate_id
      and dkd_gate.site_id = p_site_id
      and dkd_gate.is_active;

    if dkd_selected_gate.id is null then
      raise exception 'Seçilen kapı bu siteye ait değil veya aktif değil';
    end if;
    if trim(coalesce(p_gate, '')) <> trim(dkd_selected_gate.name) then
      raise exception 'Kapı bilgisi eşleşmiyor';
    end if;
  end if;

  select exists (
    select 1 from draborngate.dkd_gate_site_rules dkd_rule
    where dkd_rule.site_id = p_site_id
      and dkd_rule.is_active
      and dkd_rule.is_critical
      and dkd_rule.audience in ('all', 'courier')
      and dkd_rule.starts_at <= now()
      and (dkd_rule.ends_at is null or dkd_rule.ends_at >= now())
      and (dkd_rule.scope_type = 'site' or dkd_rule.gate_id = p_gate_id)
  ) into dkd_has_critical_rules;

  if dkd_has_critical_rules and not p_rules_accepted then
    raise exception 'Kritik kuralları okuyup onaylamalısınız';
  end if;

  if p_rules_version is not null and not exists (
    select 1 from draborngate.dkd_gate_site_rules dkd_rule
    where dkd_rule.site_id = p_site_id
      and dkd_rule.version = p_rules_version
      and dkd_rule.is_active
      and dkd_rule.audience in ('all', 'courier')
      and (dkd_rule.scope_type = 'site' or dkd_rule.gate_id = p_gate_id)
  ) then
    raise exception 'Kural sürümü site veya kapı ile eşleşmiyor';
  end if;

  select dkd_row.* into dkd_profile
  from draborngate.dkd_gate_profiles dkd_row
  where dkd_row.user_id = dkd_uid;

  select dkd_row.* into dkd_courier_profile
  from draborngate.dkd_gate_courier_profiles dkd_row
  where dkd_row.user_id = dkd_uid;

  if coalesce(trim(dkd_profile.full_name), '') = '' then
    raise exception 'Kurye profilini tamamlayın';
  end if;
  if coalesce(trim(dkd_courier_profile.plate), '') = '' then
    raise exception 'Kurye profilinde motosiklet plakası gerekli';
  end if;
  if coalesce(trim(p_customer_name), '') = ''
     or coalesce(trim(p_address_text), '') = ''
     or coalesce(trim(p_block), '') = ''
     or coalesce(trim(p_floor), '') = ''
     or coalesce(trim(p_apartment), '') = '' then
    raise exception 'Müşteri ve adres bilgileri eksik';
  end if;

  loop
    dkd_attempts := dkd_attempts + 1;
    dkd_generated_code := lpad((floor(random() * 1000000))::integer::text, 6, '0');
    exit when not exists (
      select 1 from draborngate.dkd_gate_courier_passes dkd_pass
      where dkd_pass.approval_code = dkd_generated_code
        and dkd_pass.status in ('waiting', 'approved', 'arrived')
        and dkd_pass.code_used_at is null
    );
    if dkd_attempts >= 30 then
      raise exception 'Benzersiz geçiş kodu üretilemedi';
    end if;
  end loop;

  insert into draborngate.dkd_gate_courier_passes (
    courier_user_id, site_id, gate_id, courier_name, courier_phone,
    courier_plate, platform, gate, customer_name, address_text,
    block, floor, apartment, order_number, note, screenshot_url,
    screenshot_path, screenshot_captured_at, ocr_text, ocr_payload,
    ocr_status, eta_minutes, rules_version, rules_accepted_at,
    approval_code, code_created_at
  ) values (
    dkd_uid, p_site_id, p_gate_id, dkd_profile.full_name, dkd_profile.phone,
    dkd_courier_profile.plate, coalesce(dkd_courier_profile.platform, 'DraBornGo'),
    trim(p_gate), trim(p_customer_name), trim(p_address_text), trim(p_block),
    trim(p_floor), trim(p_apartment), trim(p_order_number), coalesce(trim(p_note), ''),
    nullif(trim(coalesce(p_screenshot_url, '')), ''),
    nullif(trim(coalesce(p_screenshot_url, '')), ''),
    case when nullif(trim(coalesce(p_screenshot_url, '')), '') is null then null
         else coalesce(p_screenshot_captured_at, now()) end,
    p_ocr_text, coalesce(p_ocr_payload, '{}'::jsonb),
    case when nullif(trim(coalesce(p_ocr_text, '')), '') is null then 'manual' else 'parsed' end,
    greatest(coalesce(p_eta_minutes, 6), 0), p_rules_version,
    case when dkd_has_critical_rules or p_rules_accepted then now() end,
    dkd_generated_code, now()
  ) returning id into dkd_pass_id;

  insert into draborngate.dkd_gate_pass_events (
    pass_id, actor_user_id, event_type, title, detail, tone, icon
  ) values (
    dkd_pass_id, dkd_uid, 'created', 'Geçiş talebi gönderildi',
    trim(p_gate) || ' • ' || trim(p_block) || ' / Kat ' || trim(p_floor) || ' / Daire ' || trim(p_apartment),
    'cyan', 'paper-plane'
  );

  insert into draborngate.dkd_gate_notifications (user_id, kind, title, body, data)
  values (
    dkd_uid, 'pass_code_ready', 'Tek kullanımlık geçiş kodun hazır',
    'Kapıya geldiğinde 6 haneli kodu güvenlik görevlisine söyle.',
    jsonb_build_object('pass_id', dkd_pass_id, 'code', dkd_generated_code)
  );

  perform draborngate.dkd_gate_notify_site_staff(
    p_site_id,
    'pass_created',
    'Yeni kurye geçiş talebi',
    dkd_profile.full_name || ' • ' || coalesce(dkd_courier_profile.platform, 'DraBornGo') || ' • ' || trim(p_gate),
    jsonb_build_object('pass_id', dkd_pass_id, 'gate_id', p_gate_id, 'status', 'waiting')
  );

  return dkd_pass_id;
end;
$$;

insert into draborngate.dkd_gate_schema_migrations (version, description)
values (
  'web-v3.1.1',
  'Proje özel JWT oturumu, isteğe bağlı sipariş ekran görüntüsü ve Admin Paneli mobil düzeltmeleri'
)
on conflict (version) do nothing;

commit;
