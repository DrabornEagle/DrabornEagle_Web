-- DraBornDeal / Firsat Radari v0.5
-- Hot deal classification and ready-to-share deal views.

create or replace function public.dkd_deal_heat_label(
  dkd_deal_score numeric,
  dkd_trend_score numeric,
  dkd_discount_percent numeric,
  dkd_stock_status text
)
returns text
language sql
immutable
as $$
  select case
    when coalesce(dkd_stock_status, 'unknown') = 'out_of_stock' then 'out_of_stock'
    when coalesce(dkd_deal_score, 0) >= 80 or coalesce(dkd_trend_score, 0) >= 70 then 'super_hot'
    when coalesce(dkd_deal_score, 0) >= 60 or coalesce(dkd_trend_score, 0) >= 45 or coalesce(dkd_discount_percent, 0) >= 25 then 'hot'
    when coalesce(dkd_deal_score, 0) >= 40 or coalesce(dkd_discount_percent, 0) >= 10 then 'warm'
    else 'normal'
  end;
$$;

create or replace function public.dkd_deal_share_caption(
  dkd_product_name text,
  dkd_currency_code text,
  dkd_current_price numeric,
  dkd_original_price numeric,
  dkd_discount_percent numeric,
  dkd_rating numeric,
  dkd_review_count integer,
  dkd_product_url text
)
returns text
language plpgsql
immutable
as $$
declare
  dkd_caption text;
  dkd_price_text text;
  dkd_discount_text text;
begin
  dkd_price_text := case
    when dkd_current_price is null then 'Fiyat bilgisi güncelleniyor'
    else trim(to_char(dkd_current_price, 'FM999G999G999G990D00')) || ' ' || coalesce(dkd_currency_code, '')
  end;

  dkd_discount_text := case
    when dkd_discount_percent is null then ''
    else E'\nİndirim: %' || trim(to_char(dkd_discount_percent, 'FM990D00'))
  end;

  dkd_caption := '🔥 DraBornDeal Fırsat Radarı' || E'\n\n'
    || coalesce(dkd_product_name, 'Ürün') || E'\n'
    || 'Fiyat: ' || dkd_price_text
    || case when dkd_original_price is not null then E'\nÖnceki: ' || trim(to_char(dkd_original_price, 'FM999G999G999G990D00')) || ' ' || coalesce(dkd_currency_code, '') else '' end
    || dkd_discount_text
    || case when dkd_rating is not null then E'\nPuan: ' || trim(to_char(dkd_rating, 'FM990D00')) else '' end
    || case when dkd_review_count is not null then E'\nYorum: ' || dkd_review_count::text else '' end
    || E'\n\nLink: ' || coalesce(dkd_product_url, '')
    || E'\n\n#fırsat #indirim #draborndeal';

  return dkd_caption;
end;
$$;

create or replace view public.dkd_deal_hot_ranked_products_v0_5 with (security_invoker = true) as
select
  dkd_product.dkd_id as dkd_product_id,
  dkd_product.dkd_country_code,
  dkd_product.dkd_product_name,
  dkd_product.dkd_brand_name,
  dkd_product.dkd_product_url,
  dkd_product.dkd_image_url,
  dkd_product.dkd_currency_code,
  dkd_product.dkd_current_price,
  dkd_product.dkd_original_price,
  dkd_product.dkd_discount_percent,
  dkd_product.dkd_stock_status,
  dkd_product.dkd_rating,
  dkd_product.dkd_review_count,
  dkd_product.dkd_sold_count_visible,
  dkd_product.dkd_click_count_own,
  dkd_product.dkd_deal_score,
  dkd_product.dkd_trend_score,
  public.dkd_deal_heat_label(dkd_product.dkd_deal_score, dkd_product.dkd_trend_score, dkd_product.dkd_discount_percent, dkd_product.dkd_stock_status) as dkd_heat_label,
  round(least(100, greatest(0,
    coalesce(dkd_product.dkd_deal_score, 0) * 0.55
    + coalesce(dkd_product.dkd_trend_score, 0) * 0.35
    + coalesce(dkd_product.dkd_discount_percent, 0) * 0.25
    + case when dkd_product.dkd_stock_status in ('in_stock','low_stock') then 8 else 0 end
    + case when dkd_product.dkd_last_seen_at >= now() - interval '24 hours' then 5 else 0 end
  )), 2) as dkd_hot_score,
  dkd_price_alert.dkd_price_drop_amount,
  dkd_price_alert.dkd_price_drop_percent,
  dkd_source.dkd_source_key,
  dkd_source.dkd_source_name,
  dkd_category.dkd_category_key,
  dkd_category.dkd_category_name,
  dkd_product.dkd_last_seen_at,
  dkd_product.dkd_created_at,
  dkd_product.dkd_updated_at
from public.dkd_deal_products dkd_product
join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_product.dkd_source_id
left join public.dkd_deal_categories dkd_category on dkd_category.dkd_id = dkd_product.dkd_category_id
left join public.dkd_deal_price_drop_alerts_v0_4 dkd_price_alert on dkd_price_alert.dkd_product_id = dkd_product.dkd_id
where dkd_product.dkd_is_active = true
  and dkd_source.dkd_is_active = true
  and dkd_product.dkd_stock_status <> 'out_of_stock';

create or replace view public.dkd_deal_super_hot_v0_5 with (security_invoker = true) as
select *
from public.dkd_deal_hot_ranked_products_v0_5
where dkd_heat_label = 'super_hot'
order by dkd_hot_score desc, dkd_last_seen_at desc;

create or replace view public.dkd_deal_hot_feed_v0_5 with (security_invoker = true) as
select *
from public.dkd_deal_hot_ranked_products_v0_5
where dkd_heat_label in ('super_hot','hot')
order by dkd_hot_score desc, dkd_last_seen_at desc;

create or replace view public.dkd_deal_ready_to_share_v0_5 with (security_invoker = true) as
select
  dkd_hot.dkd_product_id,
  dkd_hot.dkd_country_code,
  dkd_hot.dkd_source_key,
  dkd_hot.dkd_source_name,
  dkd_hot.dkd_product_name,
  dkd_hot.dkd_brand_name,
  dkd_hot.dkd_product_url,
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
    dkd_hot.dkd_product_url
  ) as dkd_caption,
  dkd_hot.dkd_last_seen_at
from public.dkd_deal_hot_ranked_products_v0_5 dkd_hot
where dkd_hot.dkd_heat_label in ('super_hot','hot')
  and dkd_hot.dkd_current_price is not null
  and dkd_hot.dkd_product_url is not null
order by dkd_hot.dkd_hot_score desc, dkd_hot.dkd_last_seen_at desc;

grant execute on function public.dkd_deal_heat_label(numeric, numeric, numeric, text) to anon, authenticated, service_role;
grant execute on function public.dkd_deal_share_caption(text, text, numeric, numeric, numeric, numeric, integer, text) to service_role;
grant select on public.dkd_deal_hot_ranked_products_v0_5, public.dkd_deal_super_hot_v0_5, public.dkd_deal_hot_feed_v0_5, public.dkd_deal_ready_to_share_v0_5 to anon, authenticated;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_hot_deals_version', '{"version":"0.5","labels":["normal","warm","hot","super_hot","out_of_stock"],"views":["dkd_deal_hot_feed_v0_5","dkd_deal_ready_to_share_v0_5"]}'::jsonb, 'DraBornDeal hot deal ranking layer.'),
  ('dkd_deal_hot_thresholds_v0_5', '{"super_hot":"deal_score>=80 or trend_score>=70","hot":"deal_score>=60 or trend_score>=45 or discount>=25","warm":"deal_score>=40 or discount>=10"}'::jsonb, 'DraBornDeal heat label thresholds.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
