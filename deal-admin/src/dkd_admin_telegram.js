import { dkdDealDiscountPercent, dkdDealEstimatedInterest } from './dkd_deal_quality_v0_24.js';

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

function dkdAdminPriceDiff(dkdProduct) {
  const dkdCurrent = Number(dkdProduct.dkd_current_price || 0);
  const dkdOriginal = Number(dkdProduct.dkd_original_price || 0);
  if (dkdCurrent > 0 && dkdOriginal > dkdCurrent) return dkdOriginal - dkdCurrent;
  return null;
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
  const dkdCurrentPrice = dkdAdminMoney(dkdProduct.dkd_current_price, dkdProduct.dkd_currency_code) || 'Fiyat bilgisi yok';
  const dkdOriginalPrice = dkdAdminMoney(dkdProduct.dkd_original_price, dkdProduct.dkd_currency_code);
  const dkdDiscount = dkdDealDiscountPercent(dkdProduct);
  const dkdInterest = dkdDealEstimatedInterest(dkdProduct);
  const dkdPriceDiff = dkdAdminPriceDiff(dkdProduct);
  const dkdPriceDiffText = dkdPriceDiff ? dkdAdminMoney(dkdPriceDiff, dkdProduct.dkd_currency_code) : null;
  const dkdRating = Number(dkdProduct.dkd_rating || 0);
  const dkdReviews = Number(dkdProduct.dkd_review_count || 0);
  const dkdSourceLabel = dkdAdminSourceLabel(dkdProduct);
  const dkdStockLabel = dkdAdminStockLabel(dkdProduct);
  const dkdHeadline = dkdDiscount >= 15 ? '🔥 Fiyatı Düşen Fırsat' : dkdInterest >= 70 ? '🔥 Yoğun İlgi Alan Ürün' : '🔥 Fırsat Radarı';

  return [
    dkdHeadline,
    '',
    `🛒 ${dkdProduct.dkd_product_name}`,
    '',
    `🏬 Kaynak: ${dkdSourceLabel}`,
    `💰 Güncel Fiyat: ${dkdCurrentPrice}`,
    dkdOriginalPrice ? `🏷️ Önceki / Liste Fiyatı: ${dkdOriginalPrice}` : null,
    dkdPriceDiffText ? `📉 Tahmini Kazanç: ${dkdPriceDiffText}` : null,
    dkdDiscount > 0 ? `📊 İndirim: %${Number(dkdDiscount).toLocaleString('tr-TR')}` : null,
    `📦 Stok: ${dkdStockLabel}`,
    dkdRating ? `⭐ Puan: ${dkdRating.toLocaleString('tr-TR')}` : null,
    dkdReviews ? `💬 Yorum: ${dkdReviews.toLocaleString('tr-TR')}` : null,
    `👀 İlgi Skoru: ${dkdInterest}/100`,
    '',
    '🔗 Ürün Linki:',
    dkdUrl,
    '',
    '#fırsat #indirim #DraBornDeal'
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
