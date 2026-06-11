import type { DkdWorkerConfig } from './dkd_config.js';
import type { DkdSupabase } from './dkd_supabase.js';
import { dkdLog } from './dkd_logger.js';

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

type DkdWatchLink = {
  dkd_id: string;
  dkd_submitted_url: string;
  dkd_status: string;
  dkd_priority: number;
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
        dkd_error_message: 'source discovery parser is not enabled in worker v0.1',
        dkd_worker_key: dkdConfig.dkdWorkerKey,
        dkd_updated_at: new Date().toISOString()
      })
      .eq('dkd_id', dkdJob.dkd_id);
  }
}

async function dkdProcessWatchLinks(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  const { data: dkdLinks, error: dkdError } = await dkdSupabase
    .from('dkd_deal_watch_links')
    .select('dkd_id, dkd_submitted_url, dkd_status, dkd_priority')
    .eq('dkd_status', 'pending')
    .order('dkd_priority', { ascending: true })
    .order('dkd_created_at', { ascending: true })
    .limit(dkdConfig.dkdWorkerJobLimit);

  if (dkdError) throw dkdError;
  const dkdRows = (dkdLinks || []) as DkdWatchLink[];
  dkdLog('info', 'dkd_watch_links_loaded', { dkd_count: dkdRows.length });

  for (const dkdLink of dkdRows) {
    const dkdDetectedSourceKey = dkdDetectSourceKey(dkdLink.dkd_submitted_url);
    dkdLog('info', 'dkd_watch_link_seen', {
      dkd_watch_link_id: dkdLink.dkd_id,
      dkd_detected_source_key: dkdDetectedSourceKey,
      dkd_url: dkdLink.dkd_submitted_url
    });

    if (dkdConfig.dkdWorkerDryRun) continue;

    await dkdSupabase
      .from('dkd_deal_watch_links')
      .update({
        dkd_status: dkdDetectedSourceKey ? 'accepted' : 'rejected',
        dkd_note: dkdDetectedSourceKey
          ? `Accepted by worker ${dkdConfig.dkdWorkerKey}; parser will run in v0.3.`
          : 'Rejected: unsupported source url.',
        dkd_updated_at: new Date().toISOString()
      })
      .eq('dkd_id', dkdLink.dkd_id);
  }
}

function dkdDetectSourceKey(dkdUrl: string): string | null {
  const dkdLowerUrl = dkdUrl.toLowerCase();
  if (dkdLowerUrl.includes('trendyol.com')) return 'trendyol';
  if (dkdLowerUrl.includes('hepsiburada.com')) return 'hepsiburada';
  if (dkdLowerUrl.includes('n11.com')) return 'n11';
  if (dkdLowerUrl.includes('amazon.com.tr')) return 'amazon_tr';
  if (dkdLowerUrl.includes('pazarama.com')) return 'pazarama';
  if (dkdLowerUrl.includes('ciceksepeti.com')) return 'ciceksepeti';
  if (dkdLowerUrl.includes('teknosa.com')) return 'teknosa';
  if (dkdLowerUrl.includes('vatanbilgisayar.com')) return 'vatan_bilgisayar';
  if (dkdLowerUrl.includes('pttavm.com')) return 'pttavm';
  if (dkdLowerUrl.includes('migros.com.tr')) return 'migros';
  return null;
}
