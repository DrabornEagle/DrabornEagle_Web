import { dkdLoadConfig } from './dkd_config.js';
import { dkdRunOnce } from './dkd_job_runner.js';
import { dkdLog, dkdSafeError } from './dkd_logger.js';
import { dkdCreateSupabaseClient } from './dkd_supabase.js';

function dkdSleep(dkdMilliseconds: number): Promise<void> {
  return new Promise((dkdResolve) => setTimeout(dkdResolve, dkdMilliseconds));
}

async function dkdMain(): Promise<void> {
  const dkdConfig = dkdLoadConfig();
  const dkdSupabase = dkdCreateSupabaseClient(dkdConfig);

  dkdLog('info', 'dkd_worker_started', {
    dkd_worker_key: dkdConfig.dkdWorkerKey,
    dkd_dry_run: dkdConfig.dkdWorkerDryRun,
    dkd_loop: dkdConfig.dkdWorkerLoop
  });

  if (!dkdConfig.dkdWorkerLoop) {
    await dkdRunOnce(dkdSupabase, dkdConfig);
    return;
  }

  while (true) {
    try {
      await dkdRunOnce(dkdSupabase, dkdConfig);
    } catch (dkdError) {
      dkdLog('error', 'dkd_worker_loop_error', dkdSafeError(dkdError));
    }
    await dkdSleep(dkdConfig.dkdWorkerPollSeconds * 1000);
  }
}

dkdMain().catch((dkdError) => {
  dkdLog('error', 'dkd_worker_fatal_error', dkdSafeError(dkdError));
  process.exitCode = 1;
});
