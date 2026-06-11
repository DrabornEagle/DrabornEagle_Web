-- DraBornDeal / Firsat Radari schema v0.1
-- Supabase project: guuwomvszlwhkmstewfl | Worker target: Hetzner CX33
-- All DraBornDeal-owned identifiers use dkd_ prefix.

begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.dkd_deal_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.dkd_updated_at = now();
  return new;
end;
$$;

create or replace function public.dkd_deal_score(
  dkd_discount_percent numeric,
  dkd_rating numeric,
  dkd_review_count integer,
  dkd_sold_count_visible integer,
  dkd_click_count_own integer
)
returns numeric
language sql
immutable
as $$
  select round(least(100, greatest(0,
    coalesce(dkd_discount_percent, 0) * 1.35
    + coalesce(dkd_rating, 0) * 7
    + least(coalesce(dkd_review_count, 0), 5000) / 120.0
    + least(coalesce(dkd_sold_count_visible, 0), 10000) / 160.0
    + least(coalesce(dkd_click_count_own, 0), 10000) / 180.0
  )), 2);
$$;

create table if not exists public.dkd_deal_sources (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_source_key text not null,
  dkd_source_name text not null,
  dkd_country_code text not null,
  dkd_base_url text not null,
  dkd_source_type text not null default 'marketplace',
  dkd_parser_mode text not null default 'html',
  dkd_affiliate_network text,
  dkd_terms_url text,
  dkd_robots_url text,
  dkd_respect_robots boolean not null default true,
  dkd_allowed_by_terms boolean not null default false,
  dkd_needs_manual_review boolean not null default true,
  dkd_is_active boolean not null default true,
  dkd_priority integer not null default 100,
  dkd_crawl_interval_minutes integer not null default 60,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now(),
  constraint dkd_deal_sources_country_chk check (dkd_country_code = upper(dkd_country_code) and length(dkd_country_code) = 2),
  constraint dkd_deal_sources_type_chk check (dkd_source_type in ('marketplace','retailer','brand','affiliate_network','price_feed','manual')),
  constraint dkd_deal_sources_parser_chk check (dkd_parser_mode in ('api','html','rss','partner_feed','manual'))
);

create table if not exists public.dkd_deal_categories (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_source_id uuid references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_parent_id uuid references public.dkd_deal_categories(dkd_id) on delete set null,
  dkd_country_code text not null,
  dkd_category_key text not null,
  dkd_category_name text not null,
  dkd_category_url text,
  dkd_sort_order integer not null default 100,
  dkd_is_active boolean not null default true,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create table if not exists public.dkd_deal_products (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_source_id uuid not null references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_category_id uuid references public.dkd_deal_categories(dkd_id) on delete set null,
  dkd_country_code text not null,
  dkd_external_product_id text,
  dkd_product_name text not null,
  dkd_brand_name text,
  dkd_model_name text,
  dkd_product_url text not null,
  dkd_canonical_url text,
  dkd_image_url text,
  dkd_currency_code text not null default 'TRY',
  dkd_current_price numeric(14,2),
  dkd_original_price numeric(14,2),
  dkd_discount_percent numeric(7,2) generated always as (
    case when dkd_original_price is not null and dkd_original_price > 0 and dkd_current_price is not null
    then round(greatest(0, ((dkd_original_price - dkd_current_price) / dkd_original_price) * 100), 2)
    else null end
  ) stored,
  dkd_stock_status text not null default 'unknown',
  dkd_rating numeric(3,2),
  dkd_review_count integer,
  dkd_comment_count_visible integer,
  dkd_sold_count_visible integer,
  dkd_click_count_visible integer,
  dkd_click_count_own integer not null default 0,
  dkd_deal_score numeric(7,2) not null default 0,
  dkd_trend_score numeric(7,2) not null default 0,
  dkd_is_featured boolean not null default false,
  dkd_is_active boolean not null default true,
  dkd_first_seen_at timestamptz not null default now(),
  dkd_last_seen_at timestamptz not null default now(),
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now(),
  dkd_raw_last_payload jsonb not null default '{}'::jsonb,
  constraint dkd_deal_products_country_chk check (dkd_country_code = upper(dkd_country_code) and length(dkd_country_code) = 2),
  constraint dkd_deal_products_currency_chk check (dkd_currency_code = upper(dkd_currency_code) and length(dkd_currency_code) = 3),
  constraint dkd_deal_products_stock_chk check (dkd_stock_status in ('unknown','in_stock','out_of_stock','low_stock','preorder'))
);

create table if not exists public.dkd_deal_product_snapshots (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_product_id uuid not null references public.dkd_deal_products(dkd_id) on delete cascade,
  dkd_source_id uuid not null references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_scraped_at timestamptz not null default now(),
  dkd_currency_code text not null,
  dkd_current_price numeric(14,2),
  dkd_original_price numeric(14,2),
  dkd_discount_percent numeric(7,2),
  dkd_stock_status text not null default 'unknown',
  dkd_rating numeric(3,2),
  dkd_review_count integer,
  dkd_comment_count_visible integer,
  dkd_sold_count_visible integer,
  dkd_click_count_visible integer,
  dkd_raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.dkd_deal_campaigns (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_source_id uuid references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_country_code text not null,
  dkd_campaign_key text,
  dkd_title text not null,
  dkd_description text,
  dkd_campaign_url text,
  dkd_banner_url text,
  dkd_coupon_code text,
  dkd_discount_text text,
  dkd_starts_at timestamptz,
  dkd_ends_at timestamptz,
  dkd_is_active boolean not null default true,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create table if not exists public.dkd_deal_affiliate_links (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_product_id uuid references public.dkd_deal_products(dkd_id) on delete cascade,
  dkd_campaign_id uuid references public.dkd_deal_campaigns(dkd_id) on delete cascade,
  dkd_source_id uuid references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_network_key text not null default 'manual',
  dkd_affiliate_url text not null,
  dkd_short_url text,
  dkd_utm_source text default 'draborndeal',
  dkd_utm_medium text default 'affiliate',
  dkd_utm_campaign text,
  dkd_is_active boolean not null default true,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now(),
  constraint dkd_deal_affiliate_links_target_chk check (dkd_product_id is not null or dkd_campaign_id is not null)
);

create table if not exists public.dkd_deal_watch_links (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_submitted_url text not null,
  dkd_source_id uuid references public.dkd_deal_sources(dkd_id) on delete set null,
  dkd_product_id uuid references public.dkd_deal_products(dkd_id) on delete set null,
  dkd_status text not null default 'pending',
  dkd_priority integer not null default 100,
  dkd_note text,
  dkd_created_by uuid references auth.users(id) on delete set null,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now(),
  constraint dkd_deal_watch_links_status_chk check (dkd_status in ('pending','accepted','rejected','mapped','paused'))
);

create table if not exists public.dkd_deal_scrape_jobs (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_source_id uuid references public.dkd_deal_sources(dkd_id) on delete cascade,
  dkd_watch_link_id uuid references public.dkd_deal_watch_links(dkd_id) on delete set null,
  dkd_job_type text not null default 'source_scan',
  dkd_target_url text,
  dkd_status text not null default 'pending',
  dkd_priority integer not null default 100,
  dkd_run_after timestamptz not null default now(),
  dkd_started_at timestamptz,
  dkd_finished_at timestamptz,
  dkd_worker_key text,
  dkd_attempt_count integer not null default 0,
  dkd_max_attempts integer not null default 3,
  dkd_error_message text,
  dkd_meta jsonb not null default '{}'::jsonb,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now(),
  constraint dkd_deal_scrape_jobs_status_chk check (dkd_status in ('pending','running','success','failed','cancelled','paused'))
);

create table if not exists public.dkd_deal_telegram_channels (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_channel_key text not null,
  dkd_channel_name text not null,
  dkd_chat_id text not null,
  dkd_country_code text,
  dkd_language_code text not null default 'tr',
  dkd_min_deal_score numeric(7,2) not null default 60,
  dkd_is_active boolean not null default true,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create table if not exists public.dkd_deal_social_posts (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_product_id uuid references public.dkd_deal_products(dkd_id) on delete set null,
  dkd_campaign_id uuid references public.dkd_deal_campaigns(dkd_id) on delete set null,
  dkd_telegram_channel_id uuid references public.dkd_deal_telegram_channels(dkd_id) on delete set null,
  dkd_platform text not null default 'telegram',
  dkd_status text not null default 'draft',
  dkd_caption text not null,
  dkd_media_url text,
  dkd_external_message_id text,
  dkd_scheduled_at timestamptz,
  dkd_published_at timestamptz,
  dkd_metrics jsonb not null default '{}'::jsonb,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create table if not exists public.dkd_deal_click_events (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_product_id uuid references public.dkd_deal_products(dkd_id) on delete set null,
  dkd_affiliate_link_id uuid references public.dkd_deal_affiliate_links(dkd_id) on delete set null,
  dkd_social_post_id uuid references public.dkd_deal_social_posts(dkd_id) on delete set null,
  dkd_country_code text,
  dkd_platform text,
  dkd_referrer text,
  dkd_visitor_hash text,
  dkd_user_agent_hash text,
  dkd_created_at timestamptz not null default now()
);

create table if not exists public.dkd_deal_system_settings (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_setting_key text not null,
  dkd_setting_value jsonb not null default '{}'::jsonb,
  dkd_description text,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create unique index if not exists dkd_deal_sources_key_country_uidx on public.dkd_deal_sources (dkd_source_key, dkd_country_code);
create unique index if not exists dkd_deal_categories_source_key_uidx on public.dkd_deal_categories (dkd_source_id, dkd_category_key);
create unique index if not exists dkd_deal_products_source_external_uidx on public.dkd_deal_products (dkd_source_id, dkd_external_product_id) where dkd_external_product_id is not null;
create unique index if not exists dkd_deal_products_source_url_uidx on public.dkd_deal_products (dkd_source_id, dkd_product_url);
create unique index if not exists dkd_deal_campaigns_source_key_uidx on public.dkd_deal_campaigns (dkd_source_id, dkd_campaign_key) where dkd_campaign_key is not null;
create unique index if not exists dkd_deal_telegram_channels_key_uidx on public.dkd_deal_telegram_channels (dkd_channel_key);
create unique index if not exists dkd_deal_telegram_channels_chat_uidx on public.dkd_deal_telegram_channels (dkd_chat_id);
create unique index if not exists dkd_deal_system_settings_key_uidx on public.dkd_deal_system_settings (dkd_setting_key);
create index if not exists dkd_deal_products_hot_idx on public.dkd_deal_products (dkd_country_code, dkd_is_active, dkd_deal_score desc, dkd_last_seen_at desc);
create index if not exists dkd_deal_snapshots_product_time_idx on public.dkd_deal_product_snapshots (dkd_product_id, dkd_scraped_at desc);
create index if not exists dkd_deal_scrape_jobs_queue_idx on public.dkd_deal_scrape_jobs (dkd_status, dkd_run_after, dkd_priority, dkd_created_at);
create index if not exists dkd_deal_click_events_product_time_idx on public.dkd_deal_click_events (dkd_product_id, dkd_created_at desc);

create or replace view public.dkd_deal_hot_products_v0_1 with (security_invoker = true) as
select dkd_product.dkd_id, dkd_product.dkd_country_code, dkd_product.dkd_product_name, dkd_product.dkd_brand_name,
  dkd_product.dkd_product_url, dkd_product.dkd_image_url, dkd_product.dkd_currency_code, dkd_product.dkd_current_price,
  dkd_product.dkd_original_price, dkd_product.dkd_discount_percent, dkd_product.dkd_stock_status, dkd_product.dkd_rating,
  dkd_product.dkd_review_count, dkd_product.dkd_sold_count_visible, dkd_product.dkd_click_count_own,
  public.dkd_deal_score(dkd_product.dkd_discount_percent, dkd_product.dkd_rating, dkd_product.dkd_review_count, dkd_product.dkd_sold_count_visible, dkd_product.dkd_click_count_own) as dkd_computed_deal_score,
  dkd_product.dkd_deal_score, dkd_product.dkd_trend_score, dkd_product.dkd_last_seen_at,
  dkd_source.dkd_source_key, dkd_source.dkd_source_name, dkd_category.dkd_category_name
from public.dkd_deal_products dkd_product
join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_product.dkd_source_id
left join public.dkd_deal_categories dkd_category on dkd_category.dkd_id = dkd_product.dkd_category_id
where dkd_product.dkd_is_active = true and dkd_source.dkd_is_active = true;

create or replace view public.dkd_deal_active_campaigns_v0_1 with (security_invoker = true) as
select dkd_campaign.dkd_id, dkd_campaign.dkd_country_code, dkd_campaign.dkd_title, dkd_campaign.dkd_description,
  dkd_campaign.dkd_campaign_url, dkd_campaign.dkd_banner_url, dkd_campaign.dkd_coupon_code, dkd_campaign.dkd_discount_text,
  dkd_campaign.dkd_starts_at, dkd_campaign.dkd_ends_at, dkd_source.dkd_source_key, dkd_source.dkd_source_name
from public.dkd_deal_campaigns dkd_campaign
left join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_campaign.dkd_source_id
where dkd_campaign.dkd_is_active = true
  and (dkd_campaign.dkd_starts_at is null or dkd_campaign.dkd_starts_at <= now())
  and (dkd_campaign.dkd_ends_at is null or dkd_campaign.dkd_ends_at >= now());

create or replace view public.dkd_deal_next_scrape_jobs_v0_1 with (security_invoker = true) as
select dkd_job.dkd_id, dkd_job.dkd_source_id, dkd_job.dkd_watch_link_id, dkd_job.dkd_job_type, dkd_job.dkd_target_url,
  dkd_job.dkd_status, dkd_job.dkd_priority, dkd_job.dkd_run_after, dkd_job.dkd_attempt_count, dkd_job.dkd_max_attempts,
  dkd_job.dkd_meta, dkd_source.dkd_source_key, dkd_source.dkd_country_code, dkd_source.dkd_crawl_interval_minutes
from public.dkd_deal_scrape_jobs dkd_job
left join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_job.dkd_source_id
where dkd_job.dkd_status = 'pending' and dkd_job.dkd_run_after <= now()
  and dkd_job.dkd_attempt_count < dkd_job.dkd_max_attempts
  and (dkd_source.dkd_id is null or dkd_source.dkd_is_active = true);

do $$
declare dkd_table_name text;
begin
  foreach dkd_table_name in array array['dkd_deal_sources','dkd_deal_categories','dkd_deal_products','dkd_deal_campaigns','dkd_deal_affiliate_links','dkd_deal_watch_links','dkd_deal_scrape_jobs','dkd_deal_telegram_channels','dkd_deal_social_posts','dkd_deal_system_settings'] loop
    execute format('drop trigger if exists %I on public.%I', dkd_table_name || '_set_updated_at', dkd_table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.dkd_deal_set_updated_at()', dkd_table_name || '_set_updated_at', dkd_table_name);
  end loop;
end $$;

alter table public.dkd_deal_sources enable row level security;
alter table public.dkd_deal_categories enable row level security;
alter table public.dkd_deal_products enable row level security;
alter table public.dkd_deal_product_snapshots enable row level security;
alter table public.dkd_deal_campaigns enable row level security;
alter table public.dkd_deal_affiliate_links enable row level security;
alter table public.dkd_deal_watch_links enable row level security;
alter table public.dkd_deal_scrape_jobs enable row level security;
alter table public.dkd_deal_telegram_channels enable row level security;
alter table public.dkd_deal_social_posts enable row level security;
alter table public.dkd_deal_click_events enable row level security;
alter table public.dkd_deal_system_settings enable row level security;

drop policy if exists dkd_deal_sources_public_read on public.dkd_deal_sources;
create policy dkd_deal_sources_public_read on public.dkd_deal_sources for select to anon, authenticated using (dkd_is_active = true);
drop policy if exists dkd_deal_categories_public_read on public.dkd_deal_categories;
create policy dkd_deal_categories_public_read on public.dkd_deal_categories for select to anon, authenticated using (dkd_is_active = true);
drop policy if exists dkd_deal_products_public_read on public.dkd_deal_products;
create policy dkd_deal_products_public_read on public.dkd_deal_products for select to anon, authenticated using (dkd_is_active = true);
drop policy if exists dkd_deal_campaigns_public_read on public.dkd_deal_campaigns;
create policy dkd_deal_campaigns_public_read on public.dkd_deal_campaigns for select to anon, authenticated using (dkd_is_active = true);
drop policy if exists dkd_deal_affiliate_links_public_read on public.dkd_deal_affiliate_links;
create policy dkd_deal_affiliate_links_public_read on public.dkd_deal_affiliate_links for select to anon, authenticated using (dkd_is_active = true);
drop policy if exists dkd_deal_telegram_channels_public_read on public.dkd_deal_telegram_channels;
create policy dkd_deal_telegram_channels_public_read on public.dkd_deal_telegram_channels for select to anon, authenticated using (dkd_is_active = true);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.dkd_deal_sources, public.dkd_deal_categories, public.dkd_deal_products, public.dkd_deal_campaigns, public.dkd_deal_affiliate_links, public.dkd_deal_telegram_channels to anon, authenticated;
grant select on public.dkd_deal_hot_products_v0_1, public.dkd_deal_active_campaigns_v0_1 to anon, authenticated;
grant all on all tables in schema public to service_role;
grant all on all routines in schema public to service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_schema_version', '{"version":"0.1","project":"DraBornDeal / Firsat Radari"}'::jsonb, 'Current DraBornDeal schema version.'),
  ('dkd_deal_worker_profile', '{"provider":"hetzner","package":"CX33","primary_country":"TR","secondary_country":"AE"}'::jsonb, 'Crawler worker deployment profile.'),
  ('dkd_deal_public_read_model', '{"products":true,"campaigns":true,"writes":"service_role_only"}'::jsonb, 'Public API exposure summary.')
on conflict (dkd_setting_key) do update set dkd_setting_value = excluded.dkd_setting_value, dkd_description = excluded.dkd_description, dkd_updated_at = now();

commit;
