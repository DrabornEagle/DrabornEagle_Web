-- DraBornDeal / Firsat Radari seed sources v0.1
-- First market: Turkiye. Dubai/UAE sources will be added in the next seed.
-- These sources are marked for manual legal/robots review before worker automation.

begin;

with dkd_seed_sources as (
  select * from (values
    ('trendyol', 'Trendyol', 'TR', 'https://www.trendyol.com', 'https://www.trendyol.com/robots.txt', 'marketplace', 'html', null, 10, 120),
    ('hepsiburada', 'Hepsiburada', 'TR', 'https://www.hepsiburada.com', 'https://www.hepsiburada.com/robots.txt', 'marketplace', 'html', null, 20, 120),
    ('n11', 'N11', 'TR', 'https://www.n11.com', 'https://www.n11.com/robots.txt', 'marketplace', 'html', null, 30, 180),
    ('amazon_tr', 'Amazon TR', 'TR', 'https://www.amazon.com.tr', 'https://www.amazon.com.tr/robots.txt', 'marketplace', 'html', null, 40, 240),
    ('pazarama', 'Pazarama', 'TR', 'https://www.pazarama.com', 'https://www.pazarama.com/robots.txt', 'marketplace', 'html', null, 50, 180),
    ('ciceksepeti', 'ÇiçekSepeti', 'TR', 'https://www.ciceksepeti.com', 'https://www.ciceksepeti.com/robots.txt', 'marketplace', 'html', null, 60, 240),
    ('teknosa', 'Teknosa', 'TR', 'https://www.teknosa.com', 'https://www.teknosa.com/robots.txt', 'retailer', 'html', null, 70, 240),
    ('vatan_bilgisayar', 'Vatan Bilgisayar', 'TR', 'https://www.vatanbilgisayar.com', 'https://www.vatanbilgisayar.com/robots.txt', 'retailer', 'html', null, 80, 240),
    ('pttavm', 'PttAVM', 'TR', 'https://www.pttavm.com', 'https://www.pttavm.com/robots.txt', 'marketplace', 'html', null, 90, 240),
    ('migros', 'Migros', 'TR', 'https://www.migros.com.tr', 'https://www.migros.com.tr/robots.txt', 'retailer', 'html', null, 100, 360)
  ) as dkd_source(dkd_source_key, dkd_source_name, dkd_country_code, dkd_base_url, dkd_robots_url, dkd_source_type, dkd_parser_mode, dkd_affiliate_network, dkd_priority, dkd_crawl_interval_minutes)
)
insert into public.dkd_deal_sources (
  dkd_source_key,
  dkd_source_name,
  dkd_country_code,
  dkd_base_url,
  dkd_robots_url,
  dkd_source_type,
  dkd_parser_mode,
  dkd_affiliate_network,
  dkd_respect_robots,
  dkd_allowed_by_terms,
  dkd_needs_manual_review,
  dkd_is_active,
  dkd_priority,
  dkd_crawl_interval_minutes
)
select
  dkd_source_key,
  dkd_source_name,
  dkd_country_code,
  dkd_base_url,
  dkd_robots_url,
  dkd_source_type,
  dkd_parser_mode,
  dkd_affiliate_network,
  true,
  false,
  true,
  true,
  dkd_priority,
  dkd_crawl_interval_minutes
from dkd_seed_sources
on conflict (dkd_source_key, dkd_country_code) do update set
  dkd_source_name = excluded.dkd_source_name,
  dkd_base_url = excluded.dkd_base_url,
  dkd_robots_url = excluded.dkd_robots_url,
  dkd_source_type = excluded.dkd_source_type,
  dkd_parser_mode = excluded.dkd_parser_mode,
  dkd_affiliate_network = excluded.dkd_affiliate_network,
  dkd_respect_robots = excluded.dkd_respect_robots,
  dkd_allowed_by_terms = excluded.dkd_allowed_by_terms,
  dkd_needs_manual_review = excluded.dkd_needs_manual_review,
  dkd_is_active = excluded.dkd_is_active,
  dkd_priority = excluded.dkd_priority,
  dkd_crawl_interval_minutes = excluded.dkd_crawl_interval_minutes,
  dkd_updated_at = now();

with dkd_seed_categories as (
  select * from (values
    ('electronics', 'Elektronik', 10),
    ('computer_gaming', 'Bilgisayar ve Oyun', 20),
    ('phone_accessory', 'Telefon ve Aksesuar', 30),
    ('home_living', 'Ev ve Yaşam', 40),
    ('small_appliances', 'Küçük Ev Aletleri', 50),
    ('fashion', 'Moda', 60),
    ('beauty_personal_care', 'Kozmetik ve Kişisel Bakım', 70),
    ('supermarket', 'Süpermarket', 80),
    ('mother_baby', 'Anne Bebek', 90),
    ('auto_motorcycle', 'Oto ve Motosiklet', 100)
  ) as dkd_category(dkd_category_key, dkd_category_name, dkd_sort_order)
), dkd_active_sources as (
  select dkd_id, dkd_country_code from public.dkd_deal_sources where dkd_country_code = 'TR' and dkd_is_active = true
)
insert into public.dkd_deal_categories (
  dkd_source_id,
  dkd_country_code,
  dkd_category_key,
  dkd_category_name,
  dkd_sort_order,
  dkd_is_active
)
select
  dkd_active_sources.dkd_id,
  dkd_active_sources.dkd_country_code,
  dkd_seed_categories.dkd_category_key,
  dkd_seed_categories.dkd_category_name,
  dkd_seed_categories.dkd_sort_order,
  true
from dkd_active_sources
cross join dkd_seed_categories
on conflict (dkd_source_id, dkd_category_key) do update set
  dkd_category_name = excluded.dkd_category_name,
  dkd_sort_order = excluded.dkd_sort_order,
  dkd_is_active = true,
  dkd_updated_at = now();

insert into public.dkd_deal_scrape_jobs (
  dkd_source_id,
  dkd_job_type,
  dkd_target_url,
  dkd_status,
  dkd_priority,
  dkd_run_after,
  dkd_meta
)
select
  dkd_source.dkd_id,
  'source_discovery',
  dkd_source.dkd_base_url,
  'paused',
  dkd_source.dkd_priority,
  now() + make_interval(mins => dkd_source.dkd_priority),
  jsonb_build_object(
    'dkd_reason', 'manual_terms_and_robots_review_required',
    'dkd_seed', 'dkd_deal_seed_sources_v0_1',
    'dkd_worker_target', 'hetzner_cx33'
  )
from public.dkd_deal_sources dkd_source
where dkd_source.dkd_country_code = 'TR'
  and not exists (
    select 1
    from public.dkd_deal_scrape_jobs dkd_job
    where dkd_job.dkd_source_id = dkd_source.dkd_id
      and dkd_job.dkd_job_type = 'source_discovery'
      and dkd_job.dkd_target_url = dkd_source.dkd_base_url
  );

insert into public.dkd_deal_telegram_channels (
  dkd_channel_key,
  dkd_channel_name,
  dkd_chat_id,
  dkd_country_code,
  dkd_language_code,
  dkd_min_deal_score,
  dkd_is_active
) values
  ('draborndeal_tr_main', 'DraBornDeal TR Ana Fırsatlar', 'TODO_TELEGRAM_CHAT_ID_TR_MAIN', 'TR', 'tr', 60, false),
  ('draborndeal_tr_hot', 'DraBornDeal TR Sıcak Fırsatlar', 'TODO_TELEGRAM_CHAT_ID_TR_HOT', 'TR', 'tr', 75, false)
on conflict (dkd_channel_key) do update set
  dkd_channel_name = excluded.dkd_channel_name,
  dkd_country_code = excluded.dkd_country_code,
  dkd_language_code = excluded.dkd_language_code,
  dkd_min_deal_score = excluded.dkd_min_deal_score,
  dkd_updated_at = now();

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_seed_sources_version', '{"version":"0.1","country":"TR","source_count":10,"category_count_per_source":10}'::jsonb, 'Initial DraBornDeal source/category seed for Türkiye.'),
  ('dkd_deal_worker_safety_mode', '{"default_job_status":"paused","requires_manual_review":true,"respect_robots":true}'::jsonb, 'Worker safety mode before crawler activation.'),
  ('dkd_deal_next_step', '{"task":"build_cx33_worker_env_and_supabase_edge_bridge","needs":"telegram_bot_token_and_channel_ids"}'::jsonb, 'Next implementation target after seed data.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();

commit;
