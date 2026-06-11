-- DraBornDeal / Firsat Radari v0.7.2
-- Watch-link helper layer for Termux testing and later web admin panel.

create or replace function public.dkd_deal_detect_source_key_v0_7_2(dkd_url text)
returns text
language sql
immutable
as $$
  select case
    when lower(coalesce(dkd_url, '')) like '%trendyol.com%' then 'trendyol'
    when lower(coalesce(dkd_url, '')) like '%hepsiburada.com%' then 'hepsiburada'
    when lower(coalesce(dkd_url, '')) like '%n11.com%' then 'n11'
    when lower(coalesce(dkd_url, '')) like '%amazon.com.tr%' then 'amazon_tr'
    when lower(coalesce(dkd_url, '')) like '%pazarama.com%' then 'pazarama'
    when lower(coalesce(dkd_url, '')) like '%ciceksepeti.com%' then 'ciceksepeti'
    when lower(coalesce(dkd_url, '')) like '%teknosa.com%' then 'teknosa'
    when lower(coalesce(dkd_url, '')) like '%vatanbilgisayar.com%' then 'vatan_bilgisayar'
    when lower(coalesce(dkd_url, '')) like '%pttavm.com%' then 'pttavm'
    when lower(coalesce(dkd_url, '')) like '%migros.com.tr%' then 'migros'
    else null
  end;
$$;

create or replace function public.dkd_deal_add_watch_link_v0_7_2(
  dkd_url text,
  dkd_priority integer default 10,
  dkd_note text default 'Added for Termux worker test.'
)
returns table (
  dkd_watch_link_id uuid,
  dkd_detected_source_key text,
  dkd_status text,
  dkd_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  dkd_clean_url text;
  dkd_source_key text;
  dkd_source_id uuid;
  dkd_existing_id uuid;
  dkd_new_id uuid;
begin
  dkd_clean_url := trim(coalesce(dkd_url, ''));
  if dkd_clean_url = '' or dkd_clean_url !~* '^https?://' then
    raise exception 'Invalid URL. Use a full http/https product URL.';
  end if;

  dkd_source_key := public.dkd_deal_detect_source_key_v0_7_2(dkd_clean_url);
  if dkd_source_key is null then
    insert into public.dkd_deal_watch_links (dkd_submitted_url, dkd_status, dkd_priority, dkd_note)
    values (dkd_clean_url, 'rejected', coalesce(dkd_priority, 100), 'Unsupported source URL. ' || coalesce(dkd_note, ''))
    returning dkd_id into dkd_new_id;

    return query select dkd_new_id, null::text, 'rejected'::text, 'Unsupported source URL.'::text;
    return;
  end if;

  select dkd_id
  into dkd_source_id
  from public.dkd_deal_sources
  where dkd_source_key = dkd_source_key
    and dkd_country_code = 'TR'
    and dkd_is_active = true
  limit 1;

  select dkd_id
  into dkd_existing_id
  from public.dkd_deal_watch_links
  where dkd_submitted_url = dkd_clean_url
    and dkd_status in ('pending','accepted','mapped','paused')
  order by dkd_created_at desc
  limit 1;

  if dkd_existing_id is not null then
    return query select dkd_existing_id, dkd_source_key, 'exists'::text, 'Watch link already exists.'::text;
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
    dkd_source_id,
    'pending',
    coalesce(dkd_priority, 10),
    coalesce(dkd_note, 'Added for Termux worker test.')
  ) returning dkd_id into dkd_new_id;

  return query select dkd_new_id, dkd_source_key, 'pending'::text, 'Watch link added.'::text;
end;
$$;

create or replace view public.dkd_deal_watch_link_queue_v0_7_2 with (security_invoker = true) as
select
  dkd_link.dkd_id as dkd_watch_link_id,
  dkd_link.dkd_submitted_url,
  public.dkd_deal_detect_source_key_v0_7_2(dkd_link.dkd_submitted_url) as dkd_detected_source_key,
  dkd_source.dkd_source_name,
  dkd_link.dkd_status,
  dkd_link.dkd_priority,
  dkd_link.dkd_note,
  dkd_link.dkd_product_id,
  dkd_product.dkd_product_name,
  dkd_product.dkd_current_price,
  dkd_product.dkd_currency_code,
  dkd_product.dkd_deal_score,
  dkd_product.dkd_trend_score,
  dkd_link.dkd_created_at,
  dkd_link.dkd_updated_at
from public.dkd_deal_watch_links dkd_link
left join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_link.dkd_source_id
left join public.dkd_deal_products dkd_product on dkd_product.dkd_id = dkd_link.dkd_product_id
order by dkd_link.dkd_created_at desc;

grant execute on function public.dkd_deal_detect_source_key_v0_7_2(text) to anon, authenticated, service_role;
grant execute on function public.dkd_deal_add_watch_link_v0_7_2(text, integer, text) to service_role;
grant select on public.dkd_deal_watch_link_queue_v0_7_2 to anon, authenticated;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_watch_link_helpers_version', '{"version":"0.7.2","adds_rpc":"dkd_deal_add_watch_link_v0_7_2","queue_view":"dkd_deal_watch_link_queue_v0_7_2"}'::jsonb, 'Watch link helper layer for Termux and admin panel tests.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
