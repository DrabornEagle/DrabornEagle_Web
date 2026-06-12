import { dkdAdminFetchProduct } from './dkd_admin_product_fetcher.js';
import { dkdAdminDetectSourceKey } from './dkd_admin_direct_share.js';
import { dkdAdminBuildCaption } from './dkd_admin_telegram.js';

function dkdPreviewValidateFullUrl(dkdUrl) {
  let dkdParsedUrl;
  try {
    dkdParsedUrl = new URL(dkdUrl);
  } catch {
    throw new Error('Geçerli ürün bağlantısı değil.');
  }

  const dkdHost = dkdParsedUrl.hostname.toLowerCase();
  if (dkdHost === 'ty.gl' || dkdHost.endsWith('.ty.gl')) {
    throw new Error('Kısa bağlantı desteklenmiyor. Lütfen ürünün tam Trendyol veya Hepsiburada bağlantısını yapıştır.');
  }

  return dkdParsedUrl.toString();
}

export async function dkdAdminBuildTelegramPreview(dkdSupabase, dkdUrl) {
  const dkdFullUrl = dkdPreviewValidateFullUrl(String(dkdUrl || '').trim());
  const dkdSourceKey = dkdAdminDetectSourceKey(dkdFullUrl);
  if (!dkdSourceKey) throw new Error('Bu kaynak henüz desteklenmiyor.');

  const { data: dkdSource, error: dkdSourceError } = await dkdSupabase
    .from('dkd_deal_sources')
    .select('dkd_id, dkd_source_key, dkd_source_name, dkd_allowed_by_terms, dkd_needs_manual_review, dkd_is_active')
    .eq('dkd_source_key', dkdSourceKey)
    .eq('dkd_country_code', 'TR')
    .eq('dkd_is_active', true)
    .single();

  if (dkdSourceError || !dkdSource) throw new Error('Kaynak aktif değil veya bulunamadı.');
  if (!dkdSource.dkd_allowed_by_terms || dkdSource.dkd_needs_manual_review) {
    throw new Error('Bu kaynak için manuel ürün bağlantısı izni kapalı.');
  }

  const dkdProduct = await dkdAdminFetchProduct(dkdFullUrl);
  const { data: dkdAffiliateUrl } = await dkdSupabase.rpc('dkd_deal_affiliate_url_v0_9', {
    dkd_product_url: dkdFullUrl,
    dkd_source_key: dkdSourceKey
  });

  const dkdFinalUrl = dkdAffiliateUrl || dkdFullUrl;
  const dkdCaption = dkdAdminBuildCaption(dkdProduct, dkdFinalUrl);
  const dkdHasImage = Boolean(dkdProduct.dkd_image_url);
  const dkdCaptionLimit = dkdHasImage ? 1024 : 4096;

  return {
    dkd_preview_version: 'v0.15',
    dkd_source_key: dkdSourceKey,
    dkd_source_name: dkdSource.dkd_source_name,
    dkd_product_name: dkdProduct.dkd_product_name,
    dkd_brand_name: dkdProduct.dkd_brand_name,
    dkd_image_url: dkdProduct.dkd_image_url,
    dkd_currency_code: dkdProduct.dkd_currency_code,
    dkd_current_price: dkdProduct.dkd_current_price,
    dkd_original_price: dkdProduct.dkd_original_price,
    dkd_stock_status: dkdProduct.dkd_stock_status,
    dkd_rating: dkdProduct.dkd_rating,
    dkd_review_count: dkdProduct.dkd_review_count,
    dkd_product_url: dkdFullUrl,
    dkd_final_url: dkdFinalUrl,
    dkd_caption: dkdCaption,
    dkd_caption_character_count: dkdCaption.length,
    dkd_caption_limit: dkdCaptionLimit,
    dkd_caption_is_over_limit: dkdCaption.length > dkdCaptionLimit,
    dkd_will_be_sent_as: dkdHasImage ? 'photo_caption' : 'text_message',
    dkd_preview_created_from: 'admin_telegram_preview_v0_15'
  };
}
