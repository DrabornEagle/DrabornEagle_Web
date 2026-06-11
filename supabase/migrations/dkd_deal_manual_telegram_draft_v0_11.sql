-- DraBornDeal / Firsat Radari v0.11
-- Manual Telegram draft creation for any mapped product.

create or replace function public.dkd_deal_create_manual_telegram_draft_v0_11(
  dkd_product_id_input uuid,
  dkd_channel_key_input text default 'draborndeal_tr_main'
)
returns table (
  dkd_post_id uuid,
  dkd_status text,
  dkd_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  dkd_product record;
  dkd_channel record;
  dkd_caption text;
  dkd_existing_id uuid;
  dkd_new_id uuid;
begin
  select
    dkd_product_table.*,
    dkd_source.dkd_source_key
  into dkd_product
  from public.dkd_deal_products dkd_product_table
  join public.dkd_deal_sources dkd_source on dkd_source.dkd_id = dkd_product_table.dkd_source_id
  where dkd_product_table.dkd_id = dkd_product_id_input
  limit 1;

  if dkd_product is null then
    return query select null::uuid, 'not_found'::text, 'Product not found.'::text;
    return;
  end if;

  select *
  into dkd_channel
  from public.dkd_deal_telegram_channels
  where dkd_channel_key = dkd_channel_key_input
    and dkd_is_active = true
  limit 1;

  if dkd_channel is null then
    return query select null::uuid, 'no_active_channel'::text, 'Active Telegram channel not found.'::text;
    return;
  end if;

  select dkd_id
  into dkd_existing_id
  from public.dkd_deal_social_posts
  where dkd_product_id = dkd_product_id_input
    and dkd_platform = 'telegram'
    and dkd_status = 'draft'
    and dkd_metrics ->> 'dkd_manual_test_draft' = 'true'
  order by dkd_created_at desc
  limit 1;

  if dkd_existing_id is not null then
    return query select dkd_existing_id, 'exists'::text, 'Manual Telegram draft already exists.'::text;
    return;
  end if;

  dkd_caption := public.dkd_deal_share_caption(
    dkd_product.dkd_product_name,
    dkd_product.dkd_currency_code,
    dkd_product.dkd_current_price,
    dkd_product.dkd_original_price,
    dkd_product.dkd_discount_percent,
    dkd_product.dkd_rating,
    dkd_product.dkd_review_count,
    public.dkd_deal_affiliate_url_v0_9(dkd_product.dkd_product_url, dkd_product.dkd_source_key)
  );

  dkd_caption := '🧪 TEST TASLAĞI' || E'\n\n' || dkd_caption;

  insert into public.dkd_deal_social_posts (
    dkd_product_id,
    dkd_platform,
    dkd_status,
    dkd_caption,
    dkd_media_url,
    dkd_telegram_channel_id,
    dkd_metrics
  ) values (
    dkd_product_id_input,
    'telegram',
    'draft',
    dkd_caption,
    dkd_product.dkd_image_url,
    dkd_channel.dkd_id,
    jsonb_build_object(
      'dkd_manual_test_draft', true,
      'dkd_created_from', 'admin_panel_v0_11',
      'dkd_channel_key', dkd_channel.dkd_channel_key,
      'dkd_created_at', now()
    )
  ) returning dkd_id into dkd_new_id;

  return query select dkd_new_id, 'draft'::text, 'Manual Telegram draft created.'::text;
end;
$$;

grant execute on function public.dkd_deal_create_manual_telegram_draft_v0_11(uuid, text) to service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_manual_telegram_draft_version', '{"version":"0.11","feature":"manual_product_to_telegram_draft","safe":"creates_draft_only"}'::jsonb, 'Manual Telegram draft creation for mapped products.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
