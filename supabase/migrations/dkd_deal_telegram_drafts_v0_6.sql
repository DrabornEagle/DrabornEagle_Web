-- DraBornDeal / Firsat Radari v0.6
-- Telegram/social draft generation layer. This does not send Telegram messages.

create or replace view public.dkd_deal_telegram_draft_candidates_v0_6 with (security_invoker = true) as
select
  dkd_share.dkd_product_id,
  dkd_share.dkd_country_code,
  dkd_share.dkd_source_key,
  dkd_share.dkd_source_name,
  dkd_share.dkd_product_name,
  dkd_share.dkd_brand_name,
  dkd_share.dkd_product_url,
  dkd_share.dkd_image_url,
  dkd_share.dkd_caption,
  dkd_share.dkd_hot_score,
  dkd_share.dkd_heat_label,
  dkd_share.dkd_last_seen_at,
  dkd_channel.dkd_id as dkd_telegram_channel_id,
  dkd_channel.dkd_channel_key,
  dkd_channel.dkd_channel_name,
  case
    when dkd_channel.dkd_id is null then 'no_active_channel'
    when exists (
      select 1
      from public.dkd_deal_social_posts dkd_post
      where dkd_post.dkd_product_id = dkd_share.dkd_product_id
        and dkd_post.dkd_platform = 'telegram'
        and dkd_post.dkd_status in ('draft','scheduled','published')
        and dkd_post.dkd_created_at >= now() - interval '24 hours'
    ) then 'duplicate_recent_post'
    else 'ready'
  end as dkd_candidate_status
from public.dkd_deal_ready_to_share_v0_5 dkd_share
left join lateral (
  select dkd_channel.*
  from public.dkd_deal_telegram_channels dkd_channel
  where dkd_channel.dkd_country_code = dkd_share.dkd_country_code
    and dkd_channel.dkd_is_active = true
    and dkd_share.dkd_hot_score >= dkd_channel.dkd_min_deal_score
  order by dkd_channel.dkd_min_deal_score desc, dkd_channel.dkd_created_at asc
  limit 1
) dkd_channel on true;

create or replace function public.dkd_deal_generate_telegram_drafts_v0_6(
  dkd_country_filter text default 'TR',
  dkd_limit integer default 10
)
returns table (
  dkd_created_count integer,
  dkd_skipped_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  dkd_candidate record;
  dkd_created integer := 0;
  dkd_skipped integer := 0;
begin
  for dkd_candidate in
    select *
    from public.dkd_deal_telegram_draft_candidates_v0_6
    where dkd_country_code = dkd_country_filter
      and dkd_candidate_status = 'ready'
    order by dkd_hot_score desc, dkd_last_seen_at desc
    limit greatest(1, least(coalesce(dkd_limit, 10), 50))
  loop
    insert into public.dkd_deal_social_posts (
      dkd_product_id,
      dkd_telegram_channel_id,
      dkd_platform,
      dkd_status,
      dkd_caption,
      dkd_media_url,
      dkd_metrics
    ) values (
      dkd_candidate.dkd_product_id,
      dkd_candidate.dkd_telegram_channel_id,
      'telegram',
      'draft',
      dkd_candidate.dkd_caption,
      dkd_candidate.dkd_image_url,
      jsonb_build_object(
        'dkd_generated_by', 'dkd_deal_generate_telegram_drafts_v0_6',
        'dkd_hot_score', dkd_candidate.dkd_hot_score,
        'dkd_heat_label', dkd_candidate.dkd_heat_label,
        'dkd_source_key', dkd_candidate.dkd_source_key
      )
    );
    dkd_created := dkd_created + 1;
  end loop;

  select count(*)::integer
  into dkd_skipped
  from public.dkd_deal_telegram_draft_candidates_v0_6
  where dkd_country_code = dkd_country_filter
    and dkd_candidate_status <> 'ready';

  return query select dkd_created, dkd_skipped;
end;
$$;

create or replace view public.dkd_deal_social_post_queue_v0_6 with (security_invoker = true) as
select
  dkd_post.dkd_id as dkd_post_id,
  dkd_post.dkd_product_id,
  dkd_product.dkd_product_name,
  dkd_product.dkd_product_url,
  dkd_product.dkd_image_url,
  dkd_source.dkd_source_key,
  dkd_source.dkd_source_name,
  dkd_channel.dkd_channel_key,
  dkd_channel.dkd_channel_name,
  dkd_post.dkd_platform,
  dkd_post.dkd_status,
  dkd_post.dkd_caption,
  dkd_post.dkd_media_url,
  dkd_post.dkd_scheduled_at,
  dkd_post.dkd_published_at,
  dkd_post.dkd_metrics,
  dkd_post.dkd_created_at,
  dkd_post.dkd_updated_at
from public.dkd_deal_social_posts dkd_post
left join public.dkd_deal_products dkd_product on dkd_product.dkd_id = dkd_post.dkd_product_id
left join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_product.dkd_source_id
left join public.dkd_deal_telegram_channels dkd_channel on dkd_channel.dkd_id = dkd_post.dkd_telegram_channel_id
where dkd_post.dkd_platform = 'telegram'
order by dkd_post.dkd_created_at desc;

grant select on public.dkd_deal_telegram_draft_candidates_v0_6, public.dkd_deal_social_post_queue_v0_6 to anon, authenticated;
grant execute on function public.dkd_deal_generate_telegram_drafts_v0_6(text, integer) to service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_telegram_drafts_version', '{"version":"0.6","send_messages":false,"creates_status":"draft","source_view":"dkd_deal_ready_to_share_v0_5"}'::jsonb, 'DraBornDeal Telegram draft generation layer.'),
  ('dkd_deal_telegram_drafts_safety_v0_6', '{"duplicate_window_hours":24,"requires_active_channel":true,"max_batch":50}'::jsonb, 'Telegram draft generation safety settings.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
