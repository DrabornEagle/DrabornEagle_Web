import 'dotenv/config';
import { dkdDiscoverTrendyolNativeV031 } from './dkd_trendyol_native_adapter_v0_31.js';

const dkdResult = await dkdDiscoverTrendyolNativeV031();
const dkdDiscountedCount = (dkdResult.dkd_products || []).filter((dkdProduct) => Number(dkdProduct.dkd_original_price || 0) > Number(dkdProduct.dkd_current_price || 0)).length;
console.log(JSON.stringify({
  dkd_worker: 'ty_native_count_v0_31',
  dkd_total_count: dkdResult.dkd_product_count,
  dkd_discounted_count: dkdDiscountedCount,
  dkd_logs: (dkdResult.dkd_logs || []).slice(0, 12)
}));
