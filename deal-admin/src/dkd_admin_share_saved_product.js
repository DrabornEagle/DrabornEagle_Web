import { dkdAdminBuildCaption, dkdAdminSendTelegram } from './dkd_admin_telegram.js';

function dkdSavedProductToCaptionProduct(dkdRow) {
  return {
    dkd_product_name: dkdRow.dkd_product_name,
    dkd_brand_name: dkdRow.dkd_brand_name,
    dkd_image_url: dkdRow.dkd_image_url,
    dkd_currency_code: dkdRow.dkd_currency_code || 'TRY',
    dkd_current_price: dkdRow.dkd_current_price,
    dkd_original_price: dkdRow.dkd_original_price,
    dkd_discount_percent: dkdRow.dkd_discount_percent,
    dkd_stock_status: dkdRow.dkd_stock_status,
    dkd_rating: dkdRow.dkd_rating,
    dkd_review_count: dkdRow.dkd_review_count
  };
}

export async function dkdAdminShareSavedProduct(dkdSupabase, dkdBotToken, dkdProductId) {
  const { data: dkdProductRow, error: dkdProductError } = await dkdSupabase
    .from('dkd_deal_products')
    .select('dkd_id, dkd_source_id, dkd_product_name, dkd_brand_name, dkd_product_url, dkd_canonical_url, dkd_image_url, dkd_currency_code, dkd_current_price, dkd_original_price, dkd_discount_percent, dkd_stock_status, dkd_rating, dkd_review_count')
    .eq('dkd_id', dkdProductId)
    .single();

  if (dkdProductError || !dkdProductRow) throw new Error('Kayıtlı ürün bulunamadı.');

  const { data: dkdSourceRow } = await dkdSupabase
    .from('dkd_deal_sources')
    .select('dkd_source_key')
    .eq('dkd_id', dkdProductRow.dkd_source_id)
    .single();

  const dkdSourceKey = dkdSourceRow?.dkd_source_key || null;
  let dkdFinalUrl = dkdProductRow.dkd_product_url;

  if (dkdSourceKey) {
    const { data: dkdAffiliateUrl } = await dkdSupabase.rpc('dkd_deal_affiliate_url_v0_9', {
      dkd_product_url: dkdProductRow.dkd_product_url,
      dkd_source_key: dkdSourceKey
    });
    dkdFinalUrl = dkdAffiliateUrl || dkdProductRow.dkd_product_url;
  }

  const { data: dkdChannelRow, error: dkdChannelError } = await dkdSupabase
    .from('dkd_deal_telegram_channels')
    .select('*')
    .eq('dkd_channel_key', 'draborndeal_tr_main')
    .eq('dkd_is_active', true)
    .single();

  if (dkdChannelError || !dkdChannelRow) throw new Error('Aktif Telegram kanalı bulunamadı.');

  const dkdCaptionProduct = dkdSavedProductToCaptionProduct(dkdProductRow);
  const dkdCaption = dkdAdminBuildCaption(dkdCaptionProduct, dkdFinalUrl);
  const dkdMessageId = await dkdAdminSendTelegram(dkdBotToken, dkdChannelRow.dkd_chat_id, dkdCaptionProduct, dkdCaption);

  await dkdSupabase.from('dkd_deal_social_posts').insert({
    dkd_product_id: dkdProductRow.dkd_id,
    dkd_platform: 'telegram',
    dkd_status: 'published',
    dkd_caption: dkdCaption,
    dkd_media_url: dkdProductRow.dkd_image_url,
    dkd_telegram_channel_id: dkdChannelRow.dkd_id,
    dkd_external_message_id: dkdMessageId,
    dkd_published_at: new Date().toISOString(),
    dkd_metrics: {
      dkd_created_from: 'admin_saved_product_reshare_v0_14',
      dkd_channel_key: dkdChannelRow.dkd_channel_key,
      dkd_source_key: dkdSourceKey
    }
  });

  return {
    dkd_product_id: dkdProductRow.dkd_id,
    dkd_product_name: dkdProductRow.dkd_product_name,
    dkd_price: dkdProductRow.dkd_current_price,
    dkd_source_key: dkdSourceKey,
    dkd_telegram_message_id: dkdMessageId
  };
}
