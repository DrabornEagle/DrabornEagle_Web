import type { DkdWorkerConfig } from './dkd_config.js';
import { dkdLog } from './dkd_logger.js';
import type { DkdSupabase } from './dkd_supabase.js';
import { dkdGenerateTelegramDrafts } from './dkd_telegram_draft_generator.js';
import { dkdProcessTelegramDrafts } from './dkd_telegram_sender.js';
import { dkdProcessWatchLinks } from './dkd_watch_link_runner.js';

type DkdScrapeJob = {
  dkd_id: string;
  dkd_source_id: string | null;
  dkd_watch_link_id: string | null;
  dkd_job_type: string;
  dkd_target_url: string | null;
  dkd_status: string;
  dkd_priority: number;
  dkd_attempt_count: number;
  dkd_max_attempts: number;
  dkd_meta: Record<string, unknown> | null;
  dkd_source_key?: string | null;
  dkd_country_code?: string | null;
};

export async function dkdRunOnce(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  dkdLog('info', 'dkd_worker_run_once_started', {
    dkd_worker_key: dkdConfig.dkdWorkerKey,
    dkd_country: dkdConfig.dkdWorkerCountry,
    dkd_dry_run: dkdConfig.dkdWorkerDryRun
  });

  if (dkdConfig.dkdEnableSourceDiscovery) {
    await dkdProcessScrapeJobs(dkdSupabase, dkdConfig);
  } else {
    dkdLog('info', 'dkd_source_discovery_disabled');
  }

  if (dkdConfig.dkdEnableWatchLinks) {
    await dkdProcessWatchLinks(dkdSupabase, dkdConfig);
  } else {
    dkdLog('info', 'dkd_watch_links_disabled');
  }

  await dkdGenerateTelegramDrafts(dkdSupabase, dkdConfig);
  await dkdProcessTelegramDrafts(dkdSupabase, dkdConfig);

  dkdLog('info', 'dkd_worker_run_once_finished');
}

async function dkdProcessScrapeJobs(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  const { data: dkdJobs, error: dkdError } = await dkdSupabase
    .from('dkd_deal_next_scrape_jobs_v0_1')
    .select('*')
    .eq('dkd_country_code', dkdConfig.dkdWorkerCountry)
    .order('dkd_priority', { ascending: true })
    .limit(dkdConfig.dkdWorkerJobLimit);

  if (dkdError) throw dkdError;
  const dkdRows = (dkdJobs || []) as DkdScrapeJob[];
  dkdLog('info', 'dkd_scrape_jobs_loaded', { dkd_count: dkdRows.length });

  for (const dkdJob of dkdRows) {
    dkdLog('info', 'dkd_scrape_job_seen', {
      dkd_job_id: dkdJob.dkd_id,
      dkd_job_type: dkdJob.dkd_job_type,
      dkd_source_key: dkdJob.dkd_source_key,
      dkd_target_url: dkdJob.dkd_target_url
    });

    if (dkdConfig.dkdWorkerDryRun) continue;

    await dkdSupabase
      .from('dkd_deal_scrape_jobs')
      .update({
        dkd_status: 'paused',
        dkd_error_message: 'source discovery parser is not enabled in Termux test mode',
        dkd_worker_key: dkdConfig.dkdWorkerKey,
        dkd_updated_at: new Date().toISOString()
      })
      .eq('dkd_id', dkdJob.dkd_id);
  }
}
