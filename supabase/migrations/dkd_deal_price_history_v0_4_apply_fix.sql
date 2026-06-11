-- DraBornDeal / Firsat Radari v0.4 apply fix
-- Applies product price history views and score refresh functions if the first v0.4 apply was interrupted.

create or replace function public.dkd_deal_refresh_product_metrics(dkd_target_product_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  dkd_latest_price numeric(14,2);
  dkd_previous_price numeric(14,2);
  dkd_lowest_30d_price numeric(14,2);
  dkd_drop_percent numeric(7,2) := 0;
  dkd_low_gap_percent numeric(7,2) := 0;
begin
  select dkd_snapshot.dkd_current_price
  into dkd_latest_price
  from public.dkd_deal_product_snapshots dkd_snapshot
  where dkd_snapshot.dkd_product_id = dkd_target_product_id
    and dkd_snapshot.dkd_current_price is not null
  order by dkd_snapshot.dkd_scraped_at desc
  limit 1;

  select dkd_snapshot.dkd_current_price
  into dkd_previous_price
  from public.dkd_deal_product_snapshots dkd_snapshot
  where dkd_snapshot.dkd_product_id = dkd_target_product_id
    and dkd_snapshot.dkd_current_price is not null
  order by dkd_snapshot.dkd_scraped_at desc
  offset 1
  limit 1;

  select min(dkd_snapshot.dkd_current_price)
  into dkd_lowest_30d_price
  from public.dkd_deal_product_snapshots dkd_snapshot
  where dkd_snapshot.dkd_product_id = dkd_target_product_id
    and dkd_snapshot.dkd_current_price is not null
    and dkd_snapshot.dkd_scraped_at >= now() - interval '30 days';

  if dkd_previous_price is not null and dkd_previous_price > 0 and dkd_latest_price is not null and dkd_latest_price < dkd_previous_price then
    dkd_drop_percent := round(((dkd_previous_price - dkd_latest_price) / dkd_previous_price) * 100, 2);
  end if;

  if dkd_lowest_30d_price is not null and dkd_lowest_30d_price > 0 and dkd_latest_price is not null then
    dkd_low_gap_percent := round(greatest(0, ((dkd_latest_price - dkd_lowest_30d_price) / dkd_lowest_30d_price) * 100), 2);
  end if;

  update public.dkd_deal_products dkd_product
  set
    dkd_deal_score = public.dkd_deal_score(
      dkd_product.dkd_discount_percent,
      dkd_product.dkd_rating,
      dkd_product.dkd_review_count,
      dkd_product.dkd_sold_count_visible,
      dkd_product.dkd_click_count_own
    ),
    dkd_trend_score = round(least(100, greatest(0,
      dkd_drop_percent * 1.8
      + case when dkd_latest_price is not null and dkd_lowest_30d_price is not null and dkd_latest_price <= dkd_lowest_30d_price then 20 else 0 end
      - least(dkd_low_gap_percent, 30)
    )), 2),
    dkd_updated_at = now()
  where dkd_product.dkd_id = dkd_target_product_id;
end;
$$;

create or replace function public.dkd_deal_product_after_metrics_trigger()
returns trigger
language plpgsql
as $$
begin
  if pg_trigger_depth() > 1 then
    return null;
  end if;
  perform public.dkd_deal_refresh_product_metrics(new.dkd_id);
  return null;
end;
$$;

create or replace function public.dkd_deal_snapshot_after_metrics_trigger()
returns trigger
language plpgsql
as $$
begin
  perform public.dkd_deal_refresh_product_metrics(new.dkd_product_id);
  return null;
end;
$$;

drop trigger if exists dkd_deal_products_refresh_metrics_v0_4 on public.dkd_deal_products;
create trigger dkd_deal_products_refresh_metrics_v0_4
after insert or update of dkd_current_price, dkd_original_price, dkd_rating, dkd_review_count, dkd_sold_count_visible, dkd_click_count_own
on public.dkd_deal_products
for each row execute function public.dkd_deal_product_after_metrics_trigger();

drop trigger if exists dkd_deal_snapshots_refresh_metrics_v0_4 on public.dkd_deal_product_snapshots;
create trigger dkd_deal_snapshots_refresh_metrics_v0_4
after insert on public.dkd_deal_product_snapshots
for each row execute function public.dkd_deal_snapshot_after_metrics_trigger();

create or replace view public.dkd_deal_product_price_history_v0_4 with (security_invoker = true) as
with dkd_enriched as (
  select
    dkd_snapshot.dkd_id as dkd_snapshot_id,
    dkd_snapshot.dkd_product_id,
    dkd_product.dkd_product_name,
    dkd_product.dkd_brand_name,
    dkd_product.dkd_product_url,
    dkd_source.dkd_source_key,
    dkd_source.dkd_source_name,
    dkd_product.dkd_country_code,
    dkd_snapshot.dkd_scraped_at,
    dkd_snapshot.dkd_currency_code,
    dkd_snapshot.dkd_current_price,
    lag(dkd_snapshot.dkd_current_price) over (partition by dkd_snapshot.dkd_product_id order by dkd_snapshot.dkd_scraped_at) as dkd_previous_price,
    dkd_snapshot.dkd_original_price,
    dkd_snapshot.dkd_discount_percent,
    dkd_snapshot.dkd_stock_status,
    row_number() over (partition by dkd_snapshot.dkd_product_id order by dkd_snapshot.dkd_scraped_at desc) as dkd_latest_rank
  from public.dkd_deal_product_snapshots dkd_snapshot
  join public.dkd_deal_products dkd_product on dkd_product.dkd_id = dkd_snapshot.dkd_product_id
  join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_snapshot.dkd_source_id
)
select
  dkd_enriched.*,
  case when dkd_previous_price is null then null else round(dkd_current_price - dkd_previous_price, 2) end as dkd_price_change_amount,
  case
    when dkd_previous_price is null then null
    when dkd_previous_price = 0 then null
    else round(((dkd_current_price - dkd_previous_price) / dkd_previous_price) * 100, 2)
  end as dkd_price_change_percent
from dkd_enriched;

create or replace view public.dkd_deal_product_metrics_v0_4 with (security_invoker = true) as
select
  dkd_product.dkd_id as dkd_product_id,
  dkd_product.dkd_product_name,
  dkd_product.dkd_product_url,
  dkd_product.dkd_country_code,
  dkd_source.dkd_source_key,
  dkd_source.dkd_source_name,
  count(dkd_snapshot.dkd_id)::integer as dkd_snapshot_count,
  min(dkd_snapshot.dkd_current_price) as dkd_lowest_price_all_time,
  max(dkd_snapshot.dkd_current_price) as dkd_highest_price_all_time,
  round(avg(dkd_snapshot.dkd_current_price), 2) as dkd_average_price_all_time,
  min(dkd_snapshot.dkd_current_price) filter (where dkd_snapshot.dkd_scraped_at >= now() - interval '7 days') as dkd_lowest_price_7d,
  min(dkd_snapshot.dkd_current_price) filter (where dkd_snapshot.dkd_scraped_at >= now() - interval '30 days') as dkd_lowest_price_30d,
  max(dkd_snapshot.dkd_scraped_at) as dkd_last_snapshot_at,
  dkd_product.dkd_current_price,
  dkd_product.dkd_original_price,
  dkd_product.dkd_discount_percent,
  dkd_product.dkd_deal_score,
  dkd_product.dkd_trend_score
from public.dkd_deal_products dkd_product
join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_product.dkd_source_id
left join public.dkd_deal_product_snapshots dkd_snapshot on dkd_snapshot.dkd_product_id = dkd_product.dkd_id
where dkd_product.dkd_is_active = true
  and dkd_source.dkd_is_active = true
group by dkd_product.dkd_id, dkd_source.dkd_source_key, dkd_source.dkd_source_name;

create or replace view public.dkd_deal_price_drop_alerts_v0_4 with (security_invoker = true) as
select
  dkd_history.dkd_product_id,
  dkd_history.dkd_product_name,
  dkd_history.dkd_brand_name,
  dkd_history.dkd_product_url,
  dkd_history.dkd_source_key,
  dkd_history.dkd_source_name,
  dkd_history.dkd_country_code,
  dkd_history.dkd_currency_code,
  dkd_history.dkd_current_price,
  dkd_history.dkd_previous_price,
  abs(dkd_history.dkd_price_change_amount) as dkd_price_drop_amount,
  abs(dkd_history.dkd_price_change_percent) as dkd_price_drop_percent,
  dkd_history.dkd_stock_status,
  dkd_history.dkd_scraped_at
from public.dkd_deal_product_price_history_v0_4 dkd_history
where dkd_history.dkd_latest_rank = 1
  and dkd_history.dkd_previous_price is not null
  and dkd_history.dkd_current_price is not null
  and dkd_history.dkd_current_price < dkd_history.dkd_previous_price
  and abs(dkd_history.dkd_price_change_percent) >= 3;

grant execute on function public.dkd_deal_refresh_product_metrics(uuid) to service_role;
grant select on public.dkd_deal_product_price_history_v0_4, public.dkd_deal_product_metrics_v0_4, public.dkd_deal_price_drop_alerts_v0_4 to anon, authenticated;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_price_history_version', '{"version":"0.4","applied_by":"apply_fix","price_drop_threshold_percent":3}'::jsonb, 'DraBornDeal price history and price drop layer.'),
  ('dkd_deal_score_refresh_version', '{"version":"0.4","refresh_on_product_write":true,"refresh_on_snapshot_insert":true}'::jsonb, 'DraBornDeal product score and trend score refresh layer.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
