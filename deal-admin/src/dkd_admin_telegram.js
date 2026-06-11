export function dkdAdminBuildCaption(dkdProduct, dkdUrl) {
  const dkdPrice = dkdProduct.dkd_current_price
    ? `${Number(dkdProduct.dkd_current_price).toLocaleString('tr-TR')} ${dkdProduct.dkd_currency_code || 'TRY'}`
    : 'Fiyat bilgisi yok';
  const dkdRating = dkdProduct.dkd_rating
    ? `⭐ ${dkdProduct.dkd_rating}${dkdProduct.dkd_review_count ? ` (${dkdProduct.dkd_review_count} yorum)` : ''}`
    : '';

  return [
    '🔥 Fırsat Radarı',
    '',
    dkdProduct.dkd_product_name,
    '',
    `💸 ${dkdPrice}`,
    dkdRating,
    '',
    `🔗 ${dkdUrl}`,
    '',
    '#fırsat #indirim #DraBornDeal'
  ].filter((dkdLine) => dkdLine !== '').join('\n');
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
