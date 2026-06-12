create table if not exists public.dkd_deal_click_events (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_product_id uuid references public.dkd_deal_products(dkd_id) on delete cascade,
  dkd_source_key text,
  dkd_target_url text,
  dkd_referrer text,
  dkd_user_agent text,
  dkd_ip_hash text,
  dkd_created_at timestamptz not null default now()
);

create index if not exists dkd_deal_click_events_product_idx on public.dkd_deal_click_events(dkd_product_id, dkd_created_at desc);
create index if not exists dkd_deal_click_events_created_idx on public.dkd_deal_click_events(dkd_created_at desc);

create or replace view public.dkd_deal_click_stats_v0_25 as
select
  dkd_product_id,
  count(*)::integer as dkd_click_count,
  count(*) filter (where dkd_created_at >= now() - interval '24 hours')::integer as dkd_click_count_24h,
  max(dkd_created_at) as dkd_last_click_at
from public.dkd_deal_click_events
group by dkd_product_id;
