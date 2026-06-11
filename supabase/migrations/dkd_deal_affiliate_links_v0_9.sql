-- DraBornDeal / Firsat Radari v0.9
-- Affiliate link management layer.

create table if not exists public.dkd_deal_affiliate_rules (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_source_id uuid not null references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_rule_name text not null,
  dkd_is_active boolean not null default false,
  dkd_affiliate_mode text not null default 'append_query',
  dkd_param_key text,
  dkd_param_value text,
  dkd_template_url text,
  dkd_notes text,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now(),
  constraint dkd_deal_affiliate_rules_source_unique unique (dkd_source_id),
  constraint dkd_deal_affiliate_mode_check check (dkd_affiliate_mode in ('append_query','template','none'))
);

insert into public.dkd_deal_affiliate_rules (dkd_source_id, dkd_rule_name, dkd_is_active, dkd_affiliate_mode, dkd_param_key, dkd_param_value, dkd_notes)
select dkd_source.dkd_id,
       dkd_source.dkd_source_name || ' Affiliate Kuralı',
       false,
       'append_query',
       null,
       null,
       'Panelden affiliate parametresi girilince aktif edilecek.'
from public.dkd_deal_sources dkd_source
where dkd_source.dkd_source_key in ('trendyol','hepsiburada','n11','amazon_tr')
  and dkd_source.dkd_country_code = 'TR'
on conflict (dkd_source_id) do nothing;

create or replace function public.dkd_deal_affiliate_url_v0_9(
  dkd_product_url text,
  dkd_source_key text
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  dkd_rule record;
  dkd_joiner text;
  dkd_result_url text;
begin
  if dkd_product_url is null or trim(dkd_product_url) = '' then
    return dkd_product_url;
  end if;

  select dkd_affiliate.*
  into dkd_rule
  from public.dkd_deal_affiliate_rules dkd_affiliate
  join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_affiliate.dkd_source_id
  where dkd_source.dkd_source_key = dkd_source_key
    and dkd_source.dkd_country_code = 'TR'
    and dkd_affiliate.dkd_is_active = true
  limit 1;

  if dkd_rule is null or dkd_rule.dkd_affiliate_mode = 'none' then
    return dkd_product_url;
  end if;

  if dkd_rule.dkd_affiliate_mode = 'template' then
    if dkd_rule.dkd_template_url is null or trim(dkd_rule.dkd_template_url) = '' then
      return dkd_product_url;
    end if;
    return replace(dkd_rule.dkd_template_url, '{url}', dkd_product_url);
  end if;

  if dkd_rule.dkd_affiliate_mode = 'append_query' then
    if dkd_rule.dkd_param_key is null or trim(dkd_rule.dkd_param_key) = ''
       or dkd_rule.dkd_param_value is null or trim(dkd_rule.dkd_param_value) = '' then
      return dkd_product_url;
    end if;

    if position('?' in dkd_product_url) > 0 then
      dkd_joiner := '&';
    else
      dkd_joiner := '?';
    end if;

    dkd_result_url := dkd_product_url || dkd_joiner || trim(dkd_rule.dkd_param_key) || '=' || trim(dkd_rule.dkd_param_value);
    return dkd_result_url;
  end if;

  return dkd_product_url;
end;
$$;

create or replace view public.dkd_deal_affiliate_rules_v0_9 with (security_invoker = true) as
select
  dkd_affiliate.dkd_id as dkd_affiliate_rule_id,
  dkd_source.dkd_source_key,
  dkd_source.dkd_source_name,
  dkd_source.dkd_country_code,
  dkd_affiliate.dkd_rule_name,
  dkd_affiliate.dkd_is_active,
  dkd_affiliate.dkd_affiliate_mode,
  dkd_affiliate.dkd_param_key,
  dkd_affiliate.dkd_param_value,
  dkd_affiliate.dkd_template_url,
  dkd_affiliate.dkd_notes,
  dkd_affiliate.dkd_updated_at
from public.dkd_deal_affiliate_rules dkd_affiliate
join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_affiliate.dkd_source_id
order by dkd_source.dkd_country_code, dkd_source.dkd_priority, dkd_source.dkd_source_key;

create or replace view public.dkd_deal_ready_to_share_v0_5 with (security_invoker = true) as
select
  dkd_hot.dkd_product_id,
  dkd_hot.dkd_country_code,
  dkd_hot.dkd_source_key,
  dkd_hot.dkd_source_name,
  dkd_hot.dkd_product_name,
  dkd_hot.dkd_brand_name,
  public.dkd_deal_affiliate_url_v0_9(dkd_hot.dkd_product_url, dkd_hot.dkd_source_key) as dkd_product_url,
  dkd_hot.dkd_image_url,
  dkd_hot.dkd_currency_code,
  dkd_hot.dkd_current_price,
  dkd_hot.dkd_original_price,
  dkd_hot.dkd_discount_percent,
  dkd_hot.dkd_rating,
  dkd_hot.dkd_review_count,
  dkd_hot.dkd_deal_score,
  dkd_hot.dkd_trend_score,
  dkd_hot.dkd_hot_score,
  dkd_hot.dkd_heat_label,
  public.dkd_deal_share_caption(
    dkd_hot.dkd_product_name,
    dkd_hot.dkd_currency_code,
    dkd_hot.dkd_current_price,
    dkd_hot.dkd_original_price,
    dkd_hot.dkd_discount_percent,
    dkd_hot.dkd_rating,
    dkd_hot.dkd_review_count,
    public.dkd_deal_affiliate_url_v0_9(dkd_hot.dkd_product_url, dkd_hot.dkd_source_key)
  ) as dkd_caption,
  dkd_hot.dkd_last_seen_at
from public.dkd_deal_hot_ranked_products_v0_5 dkd_hot
where dkd_hot.dkd_heat_label in ('super_hot','hot')
  and dkd_hot.dkd_current_price is not null
  and dkd_hot.dkd_product_url is not null
order by dkd_hot.dkd_hot_score desc, dkd_hot.dkd_last_seen_at desc;

grant select on public.dkd_deal_affiliate_rules to service_role;
grant insert, update on public.dkd_deal_affiliate_rules to service_role;
grant select on public.dkd_deal_affiliate_rules_v0_9 to service_role;
grant select on public.dkd_deal_affiliate_rules_v0_9 to anon, authenticated;
grant execute on function public.dkd_deal_affiliate_url_v0_9(text, text) to anon, authenticated, service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_affiliate_links_version', '{"version":"0.9","mode":"source_based_rules","safe_default":"inactive_until_param_is_added"}'::jsonb, 'DraBornDeal affiliate link management layer.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
