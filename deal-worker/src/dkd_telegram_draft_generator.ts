import type { DkdWorkerConfig } from './dkd_config.js';
import { dkdLog } from './dkd_logger.js';
import type { DkdSupabase } from './dkd_supabase.js';

export async function dkdGenerateTelegramDrafts(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  if (!dkdConfig.dkdEnableTelegramDraftGeneration) {
    dkdLog('info', 'dkd_telegram_draft_generation_disabled');
    return;
  }

  const { data: dkdResult, error: dkdError } = await dkdSupabase.rpc('dkd_deal_generate_telegram_drafts_v0_6', {
    dkd_country_filter: dkdConfig.dkdWorkerCountry,
    dkd_limit: dkdConfig.dkdWorkerJobLimit
  });

  if (dkdError) throw dkdError;

  const dkdRow = Array.isArray(dkdResult) ? dkdResult[0] : dkdResult;
  dkdLog('info', 'dkd_telegram_drafts_generated', {
    dkd_created_count: dkdRow?.dkd_created_count ?? 0,
    dkd_skipped_count: dkdRow?.dkd_skipped_count ?? 0
  });
}
