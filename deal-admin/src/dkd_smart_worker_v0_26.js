import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { dkdAdminDirectShareFullUrlOnly } from './dkd_admin_direct_share_full_url_only.js';
import { dkdDiscoverProductsWithAdaptersV023 } from './dkd_source_adapters_v0_23.js';
import { dkdDiscoverTrendyolApiUrlsV026 } from './dkd_trendyol_api_adapter_v0_26.js';

const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', { auth: { persistSession: false, autoRefreshToken: false } });
const dkdBotToken = process.env.DKD_TELEGRAM_BOT_TOKEN || '';
const dkdIntervalMinutes = Math.max(5, Math.min(Number(process.env.DKD_GATEWAY_INTERVAL_MINUTES || 45), 240));
const dkdShareLimit = Math.max(1, Math.min(Number(process.env.DKD_GATEWAY_SHARE_LIMIT || 5), 10));
const dkdAttemptLimit = Math.max(5, Math.min(Number(process.env.DKD_WORKER_ATTEMPT_LIMIT || 25), 80));
let dkdRunning = false;

function dkdLog(dkdPayload) { console.log(JSON.stringify({ dkd_worker: 'drabornbee_smart_v0_26', dkd_time: new Date().toISOString(), ...dkdPayload })); }
function dkdText(dkdError) { return dkdError?.message || String(dkdError || 'Bilinmeyen hata'); }
function dkdSleep(dkdMs) { return new Promise((resolve) => setTimeout(resolve, dkdMs)); }
function dkdMerge(dkdFirst, dkdSecond) { const dkdSeen = new Set(); const dkdOut = []; for (const dkdUrl of [...(dkdFirst || []), ...(dkdSecond || [])]) { if (!dkdUrl || dkdSeen.has(dkdUrl)) continue; dkdSeen.add(dkdUrl); dkdOut.push(dkdUrl); } return dkdOut; }

async function dkdRecent(dkdProductUrl) {
  const { data: dkdProduct } = await dkdSupabase.from('dkd_deal_products').select('dkd_id').eq('dkd_product_url', dkdProductUrl).maybeSingle();
  if (!dkdProduct?.dkd_id) return false;
  const dkdSince = new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString();
  const { data: dkdPost } = await dkdSupabase.from('dkd_deal_social_posts').select('dkd_id').eq('dkd_product_id', dkdProduct.dkd_id).eq('dkd_platform', 'telegram').eq('dkd_status', 'published').gte('dkd_published_at', dkdSince).limit(1).maybeSingle();
  return Boolean(dkdPost?.dkd_id);
}

async function dkdRunOnce() {
  if (dkdRunning) return;
  dkdRunning = true;
  let dkdShared = 0;
  let dkdSkipped = 0;
  let dkdAttempts = 0;
  try {
    dkdLog({ dkd_message: 'smart_started', dkd_share_limit: dkdShareLimit, dkd_attempt_limit: dkdAttemptLimit });
    const dkdTrendyol = await dkdDiscoverTrendyolApiUrlsV026();
    const dkdOther = await dkdDiscoverProductsWithAdaptersV023({ dkd_sitemap_limit: Number(process.env.DKD_ADAPTER_SITEMAP_LIMIT || 8), dkd_product_limit: Number(process.env.DKD_ADAPTER_PRODUCT_LIMIT || 40) });
    const dkdUrls = dkdMerge(dkdTrendyol.dkd_product_urls, dkdOther.dkd_product_urls);
    dkdLog({ dkd_message: 'smart_discovery_done', dkd_trendyol_count: dkdTrendyol.dkd_product_url_count || 0, dkd_other_count: dkdOther.dkd_product_url_count || 0, dkd_total_count: dkdUrls.length, dkd_trendyol_logs: (dkdTrendyol.dkd_logs || []).slice(0, 8) });
    for (const dkdUrl of dkdUrls) {
      if (dkdShared >= dkdShareLimit || dkdAttempts >= dkdAttemptLimit) break;
      dkdAttempts += 1;
      try {
        if (await dkdRecent(dkdUrl)) { dkdSkipped += 1; dkdLog({ dkd_message: 'skipped_recent', dkd_url: dkdUrl }); continue; }
        dkdLog({ dkd_message: 'try_share', dkd_attempts: dkdAttempts, dkd_url: dkdUrl });
        const dkdResult = await dkdAdminDirectShareFullUrlOnly(dkdSupabase, dkdBotToken, dkdUrl);
        dkdShared += 1;
        dkdLog({ dkd_message: 'shared', dkd_url: dkdUrl, dkd_result: dkdResult });
        await dkdSleep(900);
      } catch (dkdError) {
        dkdSkipped += 1;
        dkdLog({ dkd_message: 'skipped_error', dkd_url: dkdUrl, dkd_error: dkdText(dkdError) });
      }
    }
    dkdLog({ dkd_message: 'smart_finished', dkd_shared, dkd_skipped: dkdSkipped, dkd_attempts: dkdAttempts });
  } catch (dkdError) {
    dkdLog({ dkd_message: 'smart_failed', dkd_error: dkdText(dkdError) });
  } finally {
    dkdRunning = false;
  }
}

dkdLog({ dkd_message: 'smart_worker_started', dkd_interval_minutes: dkdIntervalMinutes, dkd_share_limit: dkdShareLimit, dkd_attempt_limit: dkdAttemptLimit });
await dkdRunOnce();
setInterval(dkdRunOnce, dkdIntervalMinutes * 60 * 1000);
