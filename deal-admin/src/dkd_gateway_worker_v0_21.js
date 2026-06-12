import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { dkdAdminDirectShareFullUrlOnly } from './dkd_admin_direct_share_full_url_only.js';
import { dkdGatewayDiscoverProductUrls } from './dkd_fetch_gateway_v0_21.js';

const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});
const dkdBotToken = process.env.DKD_TELEGRAM_BOT_TOKEN || '';
const dkdIntervalMinutes = Math.max(5, Math.min(Number(process.env.DKD_GATEWAY_INTERVAL_MINUTES || 45), 240));
const dkdShareLimit = Math.max(1, Math.min(Number(process.env.DKD_GATEWAY_SHARE_LIMIT || 5), 10));
let dkdRunning = false;

function dkdLog(dkdPayload) {
  console.log(JSON.stringify({ dkd_worker: 'drabornbee_gateway_v0_21', dkd_time: new Date().toISOString(), ...dkdPayload }));
}

function dkdText(dkdError) {
  if (!dkdError) return 'Bilinmeyen hata';
  if (typeof dkdError === 'string') return dkdError;
  if (dkdError.message) return String(dkdError.message);
  try {
    const dkdJson = JSON.stringify(dkdError);
    return dkdJson && dkdJson !== '{}' ? dkdJson : 'Bilinmeyen hata';
  } catch {
    return String(dkdError);
  }
}

function dkdSleep(dkdMs) {
  return new Promise((resolve) => setTimeout(resolve, dkdMs));
}

async function dkdWasSharedRecently(dkdProductUrl) {
  const { data: dkdExistingProduct } = await dkdSupabase
    .from('dkd_deal_products')
    .select('dkd_id')
    .eq('dkd_product_url', dkdProductUrl)
    .maybeSingle();

  if (!dkdExistingProduct?.dkd_id) return false;

  const dkdSince = new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString();
  const { data: dkdExistingPost } = await dkdSupabase
    .from('dkd_deal_social_posts')
    .select('dkd_id')
    .eq('dkd_product_id', dkdExistingProduct.dkd_id)
    .eq('dkd_platform', 'telegram')
    .eq('dkd_status', 'published')
    .gte('dkd_published_at', dkdSince)
    .limit(1)
    .maybeSingle();

  return Boolean(dkdExistingPost?.dkd_id);
}

async function dkdRunOnce() {
  if (dkdRunning) return;
  dkdRunning = true;
  let dkdSharedCount = 0;
  let dkdSkippedCount = 0;

  try {
    dkdLog({ dkd_message: 'gateway_discovery_started', dkd_share_limit: dkdShareLimit });
    const dkdDiscovery = await dkdGatewayDiscoverProductUrls({
      dkd_sitemap_limit: Number(process.env.DKD_GATEWAY_SITEMAP_LIMIT || 10),
      dkd_product_limit: Number(process.env.DKD_GATEWAY_PRODUCT_LIMIT || 80)
    });

    dkdLog({
      dkd_message: 'gateway_discovery_finished',
      dkd_source_count: dkdDiscovery.dkd_source_count,
      dkd_product_url_count: dkdDiscovery.dkd_product_url_count,
      dkd_results: dkdDiscovery.dkd_results.map((dkdResult) => ({
        dkd_home_url: dkdResult.dkd_home_url,
        dkd_checked_count: dkdResult.dkd_checked_count || 0,
        dkd_product_url_count: dkdResult.dkd_product_url_count || 0,
        dkd_error: dkdResult.dkd_error || null
      }))
    });

    for (const dkdProductUrl of dkdDiscovery.dkd_product_urls) {
      if (dkdSharedCount >= dkdShareLimit) break;
      try {
        const dkdRecent = await dkdWasSharedRecently(dkdProductUrl);
        if (dkdRecent) {
          dkdSkippedCount += 1;
          dkdLog({ dkd_message: 'product_skipped_recent', dkd_product_url: dkdProductUrl });
          continue;
        }

        dkdLog({ dkd_message: 'product_share_started', dkd_product_url: dkdProductUrl });
        const dkdShareResult = await dkdAdminDirectShareFullUrlOnly(dkdSupabase, dkdBotToken, dkdProductUrl);
        dkdSharedCount += 1;
        dkdLog({ dkd_message: 'product_shared', dkd_product_url: dkdProductUrl, dkd_share_result: dkdShareResult });
        await dkdSleep(1600);
      } catch (dkdError) {
        dkdSkippedCount += 1;
        dkdLog({ dkd_message: 'product_skipped_error', dkd_product_url: dkdProductUrl, dkd_error: dkdText(dkdError) });
      }
    }

    dkdLog({ dkd_message: 'gateway_run_finished', dkd_shared_count: dkdSharedCount, dkd_skipped_count: dkdSkippedCount });
  } catch (dkdError) {
    dkdLog({ dkd_message: 'gateway_run_failed', dkd_error: dkdText(dkdError) });
  } finally {
    dkdRunning = false;
  }
}

dkdLog({ dkd_message: 'gateway_worker_started', dkd_interval_minutes: dkdIntervalMinutes, dkd_share_limit: dkdShareLimit });
await dkdRunOnce();
setInterval(dkdRunOnce, dkdIntervalMinutes * 60 * 1000);
