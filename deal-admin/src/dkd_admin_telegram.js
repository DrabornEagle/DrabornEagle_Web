function dkdAdminCurrencyLabel(dkdCurrencyCode) {
  if (!dkdCurrencyCode || dkdCurrencyCode === 'TRY') return 'TL';
  return dkdCurrencyCode;
}

function dkdAdminMoney(dkdValue, dkdCurrencyCode) {
  if (dkdValue === null || dkdValue === undefined) return null;
  return `${Number(dkdValue).toLocaleString('tr-TR')} ${dkdAdminCurrencyLabel(dkdCurrencyCode)}`;
}

function dkdAdminDiscountPercent(dkdProduct) {
  if (dkdProduct.dkd_discount_percent !== null && dkdProduct.dkd_discount_percent !== undefined) {
    return Number(dkdProduct.dkd_discount_percent);
  }
  const dkdCurrent = Number(dkdProduct.dkd_current_price || 0);
  const dkdOriginal = Number(dkdProduct.dkd_original_price || 0);
  if (dkdCurrent > 0 && dkdOriginal > dkdCurrent) {
    return Math.round(((dkdOriginal - dkdCurrent) / dkdOriginal) * 10000) / 100;
  }
  return null;
}

export function dkdAdminBuildCaption(dkdProduct, dkdUrl) {
  const dkdCurrentPrice = dkdAdminMoney(dkdProduct.dkd_current_price, dkdProduct.dkd_currency_code) || 'Fiyat bilgisi yok';
  const dkdOriginalPrice = dkdAdminMoney(dkdProduct.dkd_original_price, dkdProduct.dkd_currency_code);
  const dkdDiscount = dkdAdminDiscountPercent(dkdProduct);

  return [
    '🔥 Fırsat Radarı',
    '',
    dkdProduct.dkd_product_name,
    '',
    `💰 Yeni Fiyat: ${dkdCurrentPrice}`,
    dkdOriginalPrice ? `🏷️ Önceki Fiyat: ${dkdOriginalPrice}` : null,
    dkdDiscount !== null ? `📉 İndirim: %${Number(dkdDiscount).toLocaleString('tr-TR')}` : null,
    dkdProduct.dkd_rating ? `⭐ Puan: ${Number(dkdProduct.dkd_rating).toLocaleString('tr-TR')}` : null,
    dkdProduct.dkd_review_count ? `💬 Yorum: ${Number(dkdProduct.dkd_review_count).toLocaleString('tr-TR')}` : null,
    '',
    '🔗 Link:',
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
