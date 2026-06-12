export function dkdDiscountInfoV029(dkdProduct) {
  const dkdCurrent = Number(dkdProduct?.dkd_current_price || 0);
  const dkdOriginal = Number(dkdProduct?.dkd_original_price || 0);
  const dkdDiscountAmount = dkdOriginal > dkdCurrent && dkdCurrent > 0 ? dkdOriginal - dkdCurrent : 0;
  const dkdDiscountPercent = dkdDiscountAmount > 0 ? Math.round((dkdDiscountAmount / dkdOriginal) * 100) : 0;
  return {
    dkd_current_price: dkdCurrent,
    dkd_original_price: dkdOriginal,
    dkd_discount_amount: dkdDiscountAmount,
    dkd_discount_percent: dkdDiscountPercent,
    dkd_has_discount: dkdCurrent > 0 && dkdOriginal > dkdCurrent && dkdDiscountPercent > 0
  };
}

export function dkdDiscountQualityV029(dkdProduct) {
  const dkdInfo = dkdDiscountInfoV029(dkdProduct);
  const dkdMinDiscount = Number(process.env.DKD_MIN_DISCOUNT_PERCENT || 5);
  const dkdHasStock = String(dkdProduct?.dkd_stock_status || '').toLowerCase().includes('stock');
  const dkdRating = Number(dkdProduct?.dkd_rating || 0);
  const dkdReviews = Number(dkdProduct?.dkd_review_count || 0);
  let dkdInterestScore = 25;
  if (dkdInfo.dkd_discount_percent >= 40) dkdInterestScore += 35;
  else if (dkdInfo.dkd_discount_percent >= 25) dkdInterestScore += 28;
  else if (dkdInfo.dkd_discount_percent >= 15) dkdInterestScore += 20;
  else if (dkdInfo.dkd_discount_percent >= 5) dkdInterestScore += 12;
  if (dkdRating >= 4.5) dkdInterestScore += 15;
  else if (dkdRating >= 4) dkdInterestScore += 8;
  if (dkdReviews >= 1000) dkdInterestScore += 18;
  else if (dkdReviews >= 250) dkdInterestScore += 12;
  else if (dkdReviews >= 50) dkdInterestScore += 6;
  if (dkdHasStock) dkdInterestScore += 5;
  dkdInterestScore = Math.max(1, Math.min(100, dkdInterestScore));
  const dkdPass = dkdInfo.dkd_has_discount && dkdInfo.dkd_discount_percent >= dkdMinDiscount && dkdHasStock;
  const dkdReasons = [];
  if (dkdInfo.dkd_has_discount) dkdReasons.push(`fiyat_dustu_%${dkdInfo.dkd_discount_percent}`);
  if (dkdInfo.dkd_original_price > 0) dkdReasons.push('eski_fiyat_var');
  if (dkdInfo.dkd_current_price > 0) dkdReasons.push('guncel_fiyat_var');
  if (dkdHasStock) dkdReasons.push('stok_var');
  return {
    dkd_pass: dkdPass,
    dkd_interest_score: dkdInterestScore,
    dkd_discount_percent: dkdInfo.dkd_discount_percent,
    dkd_discount_amount: dkdInfo.dkd_discount_amount,
    dkd_original_price: dkdInfo.dkd_original_price,
    dkd_current_price: dkdInfo.dkd_current_price,
    dkd_reasons: dkdReasons
  };
}
