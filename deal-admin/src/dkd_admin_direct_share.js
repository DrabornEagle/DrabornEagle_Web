import { dkdAdminFetchProduct } from './dkd_admin_product_fetcher.js';
import { dkdAdminBuildCaption, dkdAdminSendTelegram } from './dkd_admin_telegram.js';
import { dkdDealQuality } from './dkd_deal_quality_v0_24.js';

export function dkdAdminDetectSourceKey(dkdUrl) {
  const dkdHost = new URL(dkdUrl).hostname.toLowerCase();
  if (dkdHost.includes('trendyol') || dkdHost.includes('ty.gl')) return 'trendyol';
  if (dkdHost.includes('hepsiburada')) return 'hepsiburada';
  if (dkdHost.includes('n11')) return 'n11';
  if (dkdHost.includes('amazon.com.tr')) return 'amazon_tr';
  return null;
}

export async function dkdAdminDirectShare(dkdSupabase, dkdBotToken, dkdUrl) {
  const dkdSourceKey = dkdAdminDetectSourceKey(dkdUrl);
  if (!dkdSourceKey) throw new Error('Bu kaynak henüz desteklenmiyor.');

  const { data: dkdSource, error: dkdSourceError } = await dkdSupabase
    .from('dkd_deal_sources')
    .select('*')
    .eq('dkd_source_key', dkdSourceKey)
    .eq('dkd_country_code', 'TR')
    .eq('dkd_is_active', true)
    .single();

  if (dkdSourceError || !dkdSource) throw new Error('Kaynak aktif değil veya bulunamadı.');
  if (!dkdSource.dkd_allowed_by_terms || dkdSource.dkd_needs_manual_review) {
    throw new Error('Bu kaynak için manuel ürün bağlantısı izni kapalı.');
  }

  const dkdProduct = await dkdAdminFetchProduct(dkdUrl);
  const dkdQuality = dkdDealQuality(dkdProduct);
  const dkdPayload = {
    dkd_source_id: dkdSource.dkd_id,
    dkd_country_code: 'TR',
    dkd_product_name: dkdProduct.dkd_product_name,
    dkd_brand_name: dkdProduct.dkd_brand_name,
    dkd_product_url: dkdUrl,
    dkd_canonical_url: dkdProduct.dkd_url,
    dkd_image_url: dkdProduct.dkd_image_url,
    dkd_currency_code: dkdProduct.dkd_currency_code,
    dkd_current_price: dkdProduct.dkd_current_price,
    dkd_original_price: dkdProduct.dkd_original_price,
    dkd_stock_status: dkdProduct.dkd_stock_status,
    dkd_rating: dkdProduct.dkd_rating,
    dkd_review_count: dkdProduct.dkd_review_count,
    dkd_deal_score: dkdQuality.dkd_interest_score,
    dkd_trend_score: dkdQuality.dkd_interest_score,
    dkd_last_seen_at: new Date().toISOString(),
    dkd_raw_last_payload: { ...(dkdProduct.dkd_raw_payload || {}), dkd_quality: dkdQuality }
  };

  const { data: dkdSavedProduct, error: dkdSaveError } = await dkdSupabase
    .from('dkd_deal_products')
    .upsert(dkdPayload, { onConflict: 'dkd_source_id,dkd_product_url' })
    .select('dkd_id')
    .single();
  if (dkdSaveError) throw dkdSaveError;

  await dkdSupabase.from('dkd_deal_product_snapshots').insert({
    dkd_product_id: dkdSavedProduct.dkd_id,
    dkd_source_id: dkdSource.dkd_id,
    dkd_currency_code: dkdProduct.dkd_currency_code,
    dkd_current_price: dkdProduct.dkd_current_price,
    dkd_original_price: dkdProduct.dkd_original_price,
    dkd_stock_status: dkdProduct.dkd_stock_status,
    dkd_rating: dkdProduct.dkd_rating,
    dkd_review_count: dkdProduct.dkd_review_count,
    dkd_raw_payload: { ...(dkdProduct.dkd_raw_payload || {}), dkd_quality: dkdQuality }
  });

  if (!dkdQuality.dkd_pass) {
    throw new Error(`Fırsat filtresinden geçmedi: ilgi ${dkdQuality.dkd_interest_score}/100, indirim %${dkdQuality.dkd_discount_percent}, neden ${dkdQuality.dkd_reasons.join(',') || 'zayıf veri'}`);
  }

  const { data: dkdChannel, error: dkdChannelError } = await dkdSupabase
    .from('dkd_deal_telegram_channels')
    .select('*')
    .eq('dkd_channel_key', 'draborndeal_tr_main')
    .eq('dkd_is_active', true)
    .single();
  if (dkdChannelError || !dkdChannel) throw new Error('Aktif Telegram kanalı bulunamadı.');

  const { data: dkdFinalUrl } = await dkdSupabase.rpc('dkd_deal_affiliate_url_v0_9', {
    dkd_product_url: dkdUrl,
    dkd_source_key: dkdSourceKey
  });

  const dkdCaption = dkdAdminBuildCaption({ ...dkdProduct, dkd_deal_score: dkdQuality.dkd_interest_score, dkd_discount_percent: dkdQuality.dkd_discount_percent }, dkdFinalUrl || dkdUrl);
  const dkdMessageId = await dkdAdminSendTelegram(dkdBotToken, dkdChannel.dkd_chat_id, dkdProduct, dkdCaption);

  await dkdSupabase.from('dkd_deal_social_posts').insert({
    dkd_product_id: dkdSavedProduct.dkd_id,
    dkd_platform: 'telegram',
    dkd_status: 'published',
    dkd_caption: dkdCaption,
    dkd_media_url: dkdProduct.dkd_image_url,
    dkd_telegram_channel_id: dkdChannel.dkd_id,
    dkd_external_message_id: dkdMessageId,
    dkd_published_at: new Date().toISOString(),
    dkd_metrics: {
      dkd_created_from: 'admin_direct_share_v0_24',
      dkd_channel_key: dkdChannel.dkd_channel_key,
      dkd_quality: dkdQuality
    }
  });

  return {
    dkd_product_id: dkdSavedProduct.dkd_id,
    dkd_product_name: dkdProduct.dkd_product_name,
    dkd_price: dkdProduct.dkd_current_price,
    dkd_source_key: dkdSourceKey,
    dkd_interest_score: dkdQuality.dkd_interest_score,
    dkd_discount_percent: dkdQuality.dkd_discount_percent,
    dkd_telegram_message_id: dkdMessageId
  };
}
