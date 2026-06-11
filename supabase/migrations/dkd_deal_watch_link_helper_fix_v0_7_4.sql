-- DraBornDeal / Firsat Radari v0.7.4
-- Fix ambiguous column references in watch-link helper RPC.

create or replace function public.dkd_deal_add_watch_link_v0_7_2(
  dkd_url text,
  dkd_priority integer default 10,
  dkd_note text default 'Added for Termux worker test.'
)
returns table (
  dkd_watch_link_id uuid,
  dkd_detected_source_key text,
  dkd_result_status text,
  dkd_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  dkd_clean_url text;
  dkd_source_key_value text;
  dkd_source_id_value uuid;
  dkd_existing_id uuid;
  dkd_new_id uuid;
begin
  dkd_clean_url := trim(coalesce(dkd_url, ''));
  if dkd_clean_url = '' or dkd_clean_url !~* '^https?://' then
    raise exception 'Invalid URL. Use a full http/https product URL.';
  end if;

  dkd_source_key_value := public.dkd_deal_detect_source_key_v0_7_2(dkd_clean_url);
  if dkd_source_key_value is null then
    insert into public.dkd_deal_watch_links (dkd_submitted_url, dkd_status, dkd_priority, dkd_note)
    values (dkd_clean_url, 'rejected', coalesce(dkd_priority, 100), 'Unsupported source URL. ' || coalesce(dkd_note, ''))
    returning dkd_id into dkd_new_id;

    return query select dkd_new_id, null::text, 'rejected'::text, 'Unsupported source URL.'::text;
    return;
  end if;

  select dkd_source.dkd_id
  into dkd_source_id_value
  from public.dkd_deal_sources dkd_source
  where dkd_source.dkd_source_key = dkd_source_key_value
    and dkd_source.dkd_country_code = 'TR'
    and dkd_source.dkd_is_active = true
  limit 1;

  select dkd_link.dkd_id
  into dkd_existing_id
  from public.dkd_deal_watch_links dkd_link
  where dkd_link.dkd_submitted_url = dkd_clean_url
    and dkd_link.dkd_status in ('pending','accepted','mapped','paused')
  order by dkd_link.dkd_created_at desc
  limit 1;

  if dkd_existing_id is not null then
    return query select dkd_existing_id, dkd_source_key_value, 'exists'::text, 'Watch link already exists.'::text;
    return;
  end if;

  insert into public.dkd_deal_watch_links (
    dkd_submitted_url,
    dkd_source_id,
    dkd_status,
    dkd_priority,
    dkd_note
  ) values (
    dkd_clean_url,
    dkd_source_id_value,
    'pending',
    coalesce(dkd_priority, 10),
    coalesce(dkd_note, 'Added for Termux worker test.')
  ) returning dkd_id into dkd_new_id;

  return query select dkd_new_id, dkd_source_key_value, 'pending'::text, 'Watch link added.'::text;
end;
$$;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_watch_link_helper_fix_v0_7_4', '{"version":"0.7.4","fix":"ambiguous_dkd_status"}'::jsonb, 'Fix ambiguous column references in watch-link helper RPC.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
