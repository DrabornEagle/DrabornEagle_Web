import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { dkdAdminDirectShareFullUrlOnly } from './dkd_admin_direct_share_full_url_only.js';
import { dkdDiscoverCampaignUrlsV028 } from './dkd_campaign_discovery_v0_28.js';
import { dkdDiscoverHepsiburadaDealsV033 } from './dkd_hepsiburada_deal_discovery_v0_33.js';
import { dkdDiscoverTrendyolApiUrlsV026 } from './dkd_trendyol_api_adapter_v0_26.js';
import { dkdDiscoverTrendyolRenderUrlsV030 } from './dkd_trendyol_render_adapter_v0_30.js';

const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', { auth: { persistSession: false, autoRefreshToken: false } });
const dkdBotToken = process.env.DKD_TELEGRAM_BOT_TOKEN || '';
const dkdShareLimit = Math.max(1, Math.min(Number(process.env.DKD_GATEWAY_SHARE_LIMIT || 5), 10));
const dkdAttemptLimit = Math.max(5, Math.min(Number(process.env.DKD_WORKER_ATTEMPT_LIMIT || 30), 80));
const dkdIntervalMinutes = Math.max(5, Math.min(Number(process.env.DKD_GATEWAY_INTERVAL_MINUTES || 45), 240));
let dkdRunning = false;

function dkdLog(dkdPayload) { console.log(JSON.stringify({ dkd_worker: 'drabornbee_hepsi_v0_33', dkd_time: new Date().toISOString(), ...dkdPayload })); }
function dkdText(dkdError) { return dkdError?.message || String(dkdError || 'Bilinmeyen hata'); }
function dkdSleep(dkdMs) { return new Promise((resolve) => setTimeout(resolve, dkdMs)); }
function dkdMerge(...dkdLists) { const dkdSeen = new Set(); const dkdOut = []; for (const dkdList of dkdLists) for (const dkdUrl of dkdList || []) { if (!dkdUrl || dkdSeen.has(dkdUrl)) continue; dkdSeen.add(dkdUrl); dkdOut.push(dkdUrl); } return dkdOut; }

async function dkdRecent(dkdUrl) {
  const { data: dkdProduct } = await dkdSupabase.from('dkd_deal_products').select('dkd_id').eq('dkd_product_url', dkdUrl).maybeSingle();
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
    dkdLog({ dkd_message: 'hepsi_v033_started', dkd_share_limit: dkdShareLimit, dkd_attempt_limit: dkdAttemptLimit });
    const dkdHepsiDeals = await dkdDiscoverHepsiburadaDealsV033();
    const dkdCampaign = await dkdDiscoverCampaignUrlsV028();
    const dkdApi = await dkdDiscoverTrendyolApiUrlsV026();
    const dkdRender = await dkdDiscoverTrendyolRenderUrlsV030();
    const dkdUrls = dkdMerge(dkdHepsiDeals.dkd_product_urls, dkdCampaign.dkd_product_urls, dkdApi.dkd_product_urls, dkdRender.dkd_product_urls);
    dkdLog({ dkd_message: 'hepsi_v033_discovery_done', dkd_hepsi_deal_count: dkdHepsiDeals.dkd_product_url_count || 0, dkd_campaign_count: dkdCampaign.dkd_product_url_count || 0, dkd_trendyol_api_count: dkdApi.dkd_product_url_count || 0, dkd_trendyol_render_count: dkdRender.dkd_product_url_count || 0, dkd_total_count: dkdUrls.length, dkd_hepsi_logs: (dkdHepsiDeals.dkd_logs || []).slice(0, 8), dkd_campaign_logs: (dkdCampaign.dkd_logs || []).slice(0, 4) });
    for (const dkdUrl of dkdUrls) {
      if (dkdShared >= dkdShareLimit || dkdAttempts >= dkdAttemptLimit) break;
      dkdAttempts += 1;
      try {
        if (await dkdRecent(dkdUrl)) { dkdSkipped += 1; dkdLog({ dkd_message: 'skipped_recent', dkd_url: dkdUrl }); continue; }
        dkdLog({ dkd_message: 'try_hepsi_opportunity', dkd_attempts: dkdAttempts, dkd_url: dkdUrl });
        const dkdResult = await dkdAdminDirectShareFullUrlOnly(dkdSupabase, dkdBotToken, dkdUrl);
        dkdShared += 1;
        dkdLog({ dkd_message: 'hepsi_opportunity_shared', dkd_url: dkdUrl, dkd_result: dkdResult });
        await dkdSleep(900);
      } catch (dkdError) {
        dkdSkipped += 1;
        dkdLog({ dkd_message: 'hepsi_opportunity_skipped', dkd_url: dkdUrl, dkd_error: dkdText(dkdError) });
      }
    }
    dkdLog({ dkd_message: 'hepsi_v033_finished', dkd_shared: dkdShared, dkd_skipped: dkdSkipped, dkd_attempts: dkdAttempts });
  } catch (dkdError) {
    dkdLog({ dkd_message: 'hepsi_v033_failed', dkd_error: dkdText(dkdError) });
  } finally {
    dkdRunning = false;
  }
}

dkdLog({ dkd_message: 'hepsi_v033_worker_started', dkd_interval_minutes: dkdIntervalMinutes, dkd_share_limit: dkdShareLimit, dkd_attempt_limit: dkdAttemptLimit });
await dkdRunOnce();
setInterval(dkdRunOnce, dkdIntervalMinutes * 60 * 1000);
