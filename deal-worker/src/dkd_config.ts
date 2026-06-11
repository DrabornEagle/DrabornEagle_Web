import 'dotenv/config';

export type DkdWorkerConfig = {
  dkdSupabaseUrl: string;
  dkdSupabaseServiceRoleKey: string;
  dkdWorkerKey: string;
  dkdWorkerCountry: string;
  dkdWorkerDryRun: boolean;
  dkdWorkerLoop: boolean;
  dkdWorkerPollSeconds: number;
  dkdWorkerJobLimit: number;
  dkdEnableSourceDiscovery: boolean;
  dkdEnableWatchLinks: boolean;
  dkdEnableTelegram: boolean;
  dkdTelegramBotToken: string | null;
  dkdTelegramChatIdTrMain: string | null;
  dkdTelegramChatIdTrHot: string | null;
};

function dkdReadRequiredEnv(dkdName: string): string {
  const dkdValue = process.env[dkdName];
  if (!dkdValue || dkdValue.trim().length === 0 || dkdValue.startsWith('replace_')) {
    throw new Error(`Missing required env: ${dkdName}`);
  }
  return dkdValue.trim();
}

function dkdReadOptionalEnv(dkdName: string): string | null {
  const dkdValue = process.env[dkdName];
  if (!dkdValue || dkdValue.trim().length === 0 || dkdValue.startsWith('replace_')) return null;
  return dkdValue.trim();
}

function dkdReadBooleanEnv(dkdName: string, dkdDefaultValue: boolean): boolean {
  const dkdValue = process.env[dkdName];
  if (!dkdValue) return dkdDefaultValue;
  return ['true', '1', 'yes', 'on'].includes(dkdValue.toLowerCase());
}

function dkdReadNumberEnv(dkdName: string, dkdDefaultValue: number): number {
  const dkdValue = process.env[dkdName];
  if (!dkdValue) return dkdDefaultValue;
  const dkdParsedValue = Number(dkdValue);
  if (!Number.isFinite(dkdParsedValue) || dkdParsedValue <= 0) return dkdDefaultValue;
  return dkdParsedValue;
}

export function dkdLoadConfig(): DkdWorkerConfig {
  const dkdEnableTelegram = dkdReadBooleanEnv('DKD_ENABLE_TELEGRAM', false);
  const dkdTelegramBotToken = dkdReadOptionalEnv('DKD_TELEGRAM_BOT_TOKEN');
  const dkdTelegramChatIdTrMain = dkdReadOptionalEnv('DKD_TELEGRAM_CHAT_ID_TR_MAIN');
  const dkdTelegramChatIdTrHot = dkdReadOptionalEnv('DKD_TELEGRAM_CHAT_ID_TR_HOT') || dkdTelegramChatIdTrMain;

  if (dkdEnableTelegram && (!dkdTelegramBotToken || !dkdTelegramChatIdTrMain)) {
    throw new Error('Telegram is enabled but DKD_TELEGRAM_BOT_TOKEN or DKD_TELEGRAM_CHAT_ID_TR_MAIN is missing.');
  }

  return {
    dkdSupabaseUrl: dkdReadRequiredEnv('DKD_SUPABASE_URL'),
    dkdSupabaseServiceRoleKey: dkdReadRequiredEnv('DKD_SUPABASE_SERVICE_ROLE_KEY'),
    dkdWorkerKey: process.env.DKD_WORKER_KEY?.trim() || 'dkd-cx33-main-01',
    dkdWorkerCountry: process.env.DKD_WORKER_COUNTRY?.trim().toUpperCase() || 'TR',
    dkdWorkerDryRun: dkdReadBooleanEnv('DKD_WORKER_DRY_RUN', true),
    dkdWorkerLoop: dkdReadBooleanEnv('DKD_WORKER_LOOP', false),
    dkdWorkerPollSeconds: dkdReadNumberEnv('DKD_WORKER_POLL_SECONDS', 30),
    dkdWorkerJobLimit: dkdReadNumberEnv('DKD_WORKER_JOB_LIMIT', 5),
    dkdEnableSourceDiscovery: dkdReadBooleanEnv('DKD_ENABLE_SOURCE_DISCOVERY', false),
    dkdEnableWatchLinks: dkdReadBooleanEnv('DKD_ENABLE_WATCH_LINKS', true),
    dkdEnableTelegram,
    dkdTelegramBotToken,
    dkdTelegramChatIdTrMain,
    dkdTelegramChatIdTrHot
  };
}
