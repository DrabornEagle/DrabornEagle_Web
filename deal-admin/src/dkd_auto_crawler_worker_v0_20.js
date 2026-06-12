import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { dkdAutoCrawlAndShare } from './dkd_auto_crawler_v0_20.js';

const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});
const dkdBotToken = process.env.DKD_TELEGRAM_BOT_TOKEN || '';
const dkdIntervalMinutes = Math.max(5, Math.min(Number(process.env.DKD_AUTO_CRAWL_INTERVAL_MINUTES || 30), 240));
const dkdShareLimit = Math.max(1, Math.min(Number(process.env.DKD_AUTO_CRAWL_SHARE_LIMIT || 5), 10));
let dkdRunning = false;

function dkdLog(dkdPayload) {
  console.log(JSON.stringify({ dkd_worker: 'auto_crawler_v0_20', dkd_time: new Date().toISOString(), ...dkdPayload }));
}

async function dkdRunOnce() {
  if (dkdRunning) return;
  dkdRunning = true;
  try {
    dkdLog({ dkd_message: 'crawl_started', dkd_limit: dkdShareLimit });
    const dkdResult = await dkdAutoCrawlAndShare(dkdSupabase, dkdBotToken, { dkd_limit: dkdShareLimit });
    dkdLog({
      dkd_message: 'crawl_finished',
      dkd_found_product_url_count: dkdResult.dkd_found_product_url_count,
      dkd_shared_count: dkdResult.dkd_shared_count,
      dkd_skipped_count: dkdResult.dkd_skipped_count,
      dkd_error_count: dkdResult.dkd_error_count
    });
  } catch (dkdError) {
    dkdLog({ dkd_message: 'crawl_failed', dkd_error: dkdError?.message || String(dkdError) });
  } finally {
    dkdRunning = false;
  }
}

dkdLog({ dkd_message: 'worker_started', dkd_interval_minutes: dkdIntervalMinutes, dkd_share_limit: dkdShareLimit });
await dkdRunOnce();
setInterval(dkdRunOnce, dkdIntervalMinutes * 60 * 1000);
