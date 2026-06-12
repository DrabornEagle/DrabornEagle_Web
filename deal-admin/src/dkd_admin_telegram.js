import { dkdDiscountInfoV029 } from './dkd_discount_quality_v0_29.js';

function dkdAdminCurrencyLabel(dkdCurrencyCode) {
  if (!dkdCurrencyCode || dkdCurrencyCode === 'TRY') return 'TL';
  return dkdCurrencyCode;
}

function dkdAdminMoney(dkdValue, dkdCurrencyCode) {
  if (dkdValue === null || dkdValue === undefined) return null;
  const dkdNumber = Number(dkdValue || 0);
  if (!Number.isFinite(dkdNumber) || dkdNumber <= 0) return null;
  return `${dkdNumber.toLocaleString('tr-TR')} ${dkdAdminCurrencyLabel(dkdCurrencyCode)}`;
}

function dkdAdminSourceLabel(dkdProduct) {
  const dkdRaw = String(dkdProduct.dkd_url || dkdProduct.dkd_product_url || '').toLowerCase();
  if (dkdRaw.includes('trendyol')) return 'Trendyol';
  if (dkdRaw.includes('hepsiburada')) return 'Hepsiburada';
  return 'Türkiye';
}

function dkdAdminStockLabel(dkdProduct) {
  const dkdStock = String(dkdProduct.dkd_stock_status || '').toLowerCase();
  if (dkdStock.includes('in_stock') || dkdStock.includes('stock')) return 'Stokta var';
  if (dkdStock.includes('out')) return 'Stokta yok';
  return dkdProduct.dkd_stock_status || 'Stok bilgisi belirsiz';
}

export function dkdAdminBuildCaption(dkdProduct, dkdUrl) {
  const dkdInfo = dkdDiscountInfoV029(dkdProduct);
  const dkdDiscountPrice = dkdAdminMoney(dkdInfo.dkd_current_price, dkdProduct.dkd_currency_code) || 'Fiyat bilgisi yok';
  const dkdOldPrice = dkdAdminMoney(dkdInfo.dkd_original_price, dkdProduct.dkd_currency_code);
  const dkdSaving = dkdAdminMoney(dkdInfo.dkd_discount_amount, dkdProduct.dkd_currency_code);
  const dkdRating = Number(dkdProduct.dkd_rating || 0);
  const dkdReviews = Number(dkdProduct.dkd_review_count || 0);
  const dkdSourceLabel = dkdAdminSourceLabel(dkdProduct);
  const dkdStockLabel = dkdAdminStockLabel(dkdProduct);
  const dkdCampaign = Boolean(dkdProduct.dkd_campaign_signal);
  const dkdHeadline = dkdInfo.dkd_discount_percent >= 20 ? '🔥 Büyük İndirim Fırsatı' : dkdCampaign ? '🔥 Kampanyalı Fırsat' : '🔥 İndirimli Fırsat';

  return [
    dkdHeadline,
    '',
    `🛒 ${dkdProduct.dkd_product_name}`,
    '',
    `🏬 Kaynak: ${dkdSourceLabel}`,
    dkdOldPrice ? `🏷️ Eski Fiyat: ${dkdOldPrice}` : null,
    `💰 Fırsat Fiyatı: ${dkdDiscountPrice}`,
    dkdInfo.dkd_discount_percent > 0 ? `📉 İndirim Oranı: %${Number(dkdInfo.dkd_discount_percent).toLocaleString('tr-TR')}` : null,
    dkdSaving ? `💸 Fiyat Farkı: ${dkdSaving}` : null,
    dkdCampaign && !dkdInfo.dkd_discount_percent ? '🎯 Kampanya Sinyali: Var' : null,
    `📦 Stok: ${dkdStockLabel}`,
    dkdRating ? `⭐ Puan: ${dkdRating.toLocaleString('tr-TR')}` : null,
    dkdReviews ? `💬 Yorum: ${dkdReviews.toLocaleString('tr-TR')}` : null,
    '',
    '🔗 Ürün Linki:',
    dkdUrl,
    '',
    '#fırsat #kampanya #indirim #DraBornDeal'
  ].filter((dkdLine) => dkdLine !== null && dkdLine !== undefined).join('\n');
}

export async function dkdAdminSendTelegram(dkdBotToken, dkdChatId, dkdProduct, dkdCaption) {
  if (!dkdBotToken) throw new Error('Admin .env içinde DKD_TELEGRAM_BOT_TOKEN eksik.');
  const dkdHasImage = Boolean(dkdProduct.dkd_image_url);
  const dkdEndpoint = dkdHasImage ? 'sendPhoto' : 'sendMessage';
  const dkdBody = dkdHasImage
    ? { chat_id: dkdChatId, photo: dkdProduct.dkd_image_url, caption: dkdCaption.slice(0, 1024) }
    : { chat_id: dkdChatId, text: dkdCaption, disable_web_page_preview: false };

  const dkdResponse = await fetch(`https://api.telegram.org/bot${dkdBotToken}/${dkdEndpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dkdBody)
  });
  const dkdJson = await dkdResponse.json();
  if (!dkdJson.ok) throw new Error(dkdJson.description || 'Telegram gönderimi başarısız.');
  return dkdJson.result?.message_id ? String(dkdJson.result.message_id) : null;
}
