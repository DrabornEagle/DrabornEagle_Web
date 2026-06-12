export function dkdDealDiscountPercent(dkdProduct) {
  const dkdCurrent = Number(dkdProduct?.dkd_current_price || 0);
  const dkdOriginal = Number(dkdProduct?.dkd_original_price || 0);
  if (dkdProduct?.dkd_discount_percent !== null && dkdProduct?.dkd_discount_percent !== undefined) return Number(dkdProduct.dkd_discount_percent || 0);
  if (dkdCurrent > 0 && dkdOriginal > dkdCurrent) return Math.round(((dkdOriginal - dkdCurrent) / dkdOriginal) * 100);
  return 0;
}

export function dkdDealEstimatedInterest(dkdProduct) {
  const dkdRating = Number(dkdProduct?.dkd_rating || 0);
  const dkdReviews = Number(dkdProduct?.dkd_review_count || 0);
  const dkdDiscount = dkdDealDiscountPercent(dkdProduct);
  let dkdScore = 10;
  if (dkdRating >= 4.8) dkdScore += 22;
  else if (dkdRating >= 4.5) dkdScore += 18;
  else if (dkdRating >= 4.2) dkdScore += 12;
  else if (dkdRating >= 4) dkdScore += 8;
  if (dkdReviews >= 1000) dkdScore += 26;
  else if (dkdReviews >= 500) dkdScore += 20;
  else if (dkdReviews >= 100) dkdScore += 14;
  else if (dkdReviews >= 25) dkdScore += 8;
  if (dkdDiscount >= 40) dkdScore += 28;
  else if (dkdDiscount >= 25) dkdScore += 20;
  else if (dkdDiscount >= 15) dkdScore += 12;
  else if (dkdDiscount >= 8) dkdScore += 6;
  if (String(dkdProduct?.dkd_stock_status || '').toLowerCase().includes('in_stock')) dkdScore += 8;
  return Math.max(1, Math.min(100, dkdScore));
}

export function dkdDealQuality(dkdProduct) {
  const dkdRating = Number(dkdProduct?.dkd_rating || 0);
  const dkdReviews = Number(dkdProduct?.dkd_review_count || 0);
  const dkdCurrent = Number(dkdProduct?.dkd_current_price || 0);
  const dkdDiscount = dkdDealDiscountPercent(dkdProduct);
  const dkdInterest = dkdDealEstimatedInterest(dkdProduct);
  const dkdHasStock = String(dkdProduct?.dkd_stock_status || '').toLowerCase().includes('stock');
  const dkdReasons = [];
  if (dkdDiscount >= 8) dkdReasons.push(`indirim_%${dkdDiscount}`);
  if (dkdRating >= 4.3) dkdReasons.push('yüksek_puan');
  if (dkdReviews >= 50) dkdReasons.push('yorum_sinyali');
  if (dkdInterest >= 55) dkdReasons.push('yüksek_ilgi');
  if (dkdCurrent > 0) dkdReasons.push('fiyat_var');
  const dkdPass = dkdCurrent > 0 && dkdHasStock && (dkdDiscount >= Number(process.env.DKD_MIN_DISCOUNT_PERCENT || 8) || dkdInterest >= Number(process.env.DKD_MIN_INTEREST_SCORE || 55) || dkdReviews >= Number(process.env.DKD_MIN_REVIEW_COUNT || 80));
  return { dkd_pass: dkdPass, dkd_interest_score: dkdInterest, dkd_discount_percent: dkdDiscount, dkd_reasons: dkdReasons };
}
