const dkdGoodWords = ['telefon','iphone','samsung','xiaomi','honor','playstation','ps5','xbox','laptop','notebook','tablet','ipad','kulaklık','airpods','robot','süpürge','airfryer','fritöz','kahve','televizyon','tv','monitör','ssd','ram','powerbank','akıllı saat','watch','projeksiyon','kamera','oyuncu','gaming'];
const dkdBadWords = ['hortum','radyatör','kılıf','kapak','yedek parça','aparat','askı','paspas','conta','vida'];

function dkdText(dkdProduct) {
  return `${dkdProduct?.dkd_product_name || ''} ${dkdProduct?.dkd_brand_name || ''}`.toLocaleLowerCase('tr-TR');
}

function dkdHints(dkdProduct) {
  const dkdRaw = dkdProduct?.dkd_campaign_hints || dkdProduct?.dkd_raw_payload?.dkd_campaign_hints || [];
  return Array.isArray(dkdRaw) ? dkdRaw.map((dkdItem) => String(dkdItem || '').toLocaleLowerCase('tr-TR')) : [];
}

export function dkdHepsiOpportunityQualityV033(dkdProduct) {
  const dkdCurrent = Number(dkdProduct?.dkd_current_price || 0);
  const dkdOriginal = Number(dkdProduct?.dkd_original_price || 0);
  const dkdDiscountAmount = dkdOriginal > dkdCurrent && dkdCurrent > 0 ? dkdOriginal - dkdCurrent : 0;
  const dkdDiscountPercent = dkdDiscountAmount > 0 ? Math.round((dkdDiscountAmount / dkdOriginal) * 100) : 0;
  const dkdName = dkdText(dkdProduct);
  const dkdCampaignHints = dkdHints(dkdProduct);
  const dkdGood = dkdGoodWords.some((dkdWord) => dkdName.includes(dkdWord));
  const dkdBad = dkdBadWords.some((dkdWord) => dkdName.includes(dkdWord));
  const dkdRating = Number(dkdProduct?.dkd_rating || 0);
  const dkdReviews = Number(dkdProduct?.dkd_review_count || 0);
  const dkdStock = String(dkdProduct?.dkd_stock_status || '').toLowerCase().includes('stock');
  const dkdCampaignSignal = dkdCampaignHints.some((dkdHint) => ['kampanya','indirim','kupon','fırsat','sepette'].includes(dkdHint));
  let dkdScore = 20;
  if (dkdDiscountPercent >= 5) dkdScore += 35;
  if (dkdCampaignSignal) dkdScore += 25;
  if (dkdGood) dkdScore += 15;
  if (dkdRating >= 4.5) dkdScore += 10;
  if (dkdReviews >= 500) dkdScore += 15;
  else if (dkdReviews >= 100) dkdScore += 10;
  else if (dkdReviews >= 30) dkdScore += 5;
  if (dkdBad) dkdScore -= 40;
  dkdScore = Math.max(1, Math.min(100, dkdScore));
  const dkdPass = dkdCurrent > 0 && dkdStock && !dkdBad && (
    dkdDiscountPercent >= Number(process.env.DKD_MIN_DISCOUNT_PERCENT || 5) ||
    (dkdCampaignSignal && dkdGood && dkdReviews >= Number(process.env.DKD_MIN_CAMPAIGN_REVIEW_COUNT || 30)) ||
    (dkdGood && dkdRating >= 4.5 && dkdReviews >= Number(process.env.DKD_MIN_POPULAR_REVIEW_COUNT || 100))
  );
  const dkdReasons = [];
  if (dkdDiscountPercent > 0) dkdReasons.push(`fiyat_dustu_%${dkdDiscountPercent}`);
  if (dkdCampaignSignal) dkdReasons.push(`kampanya_${dkdCampaignHints.join('_')}`);
  if (dkdGood) dkdReasons.push('ilgi_cekici_kategori');
  if (dkdRating >= 4.5) dkdReasons.push('yüksek_puan');
  if (dkdReviews >= 30) dkdReasons.push('yorum_sinyali');
  if (dkdBad) dkdReasons.push('zayıf_kategori');
  return { dkd_pass: dkdPass, dkd_interest_score: dkdScore, dkd_discount_percent: dkdDiscountPercent, dkd_discount_amount: dkdDiscountAmount, dkd_original_price: dkdOriginal, dkd_current_price: dkdCurrent, dkd_campaign_signal: dkdCampaignSignal, dkd_reasons: dkdReasons };
}
