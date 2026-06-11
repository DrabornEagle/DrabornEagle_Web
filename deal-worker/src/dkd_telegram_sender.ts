import type { DkdWorkerConfig } from './dkd_config.js';
import { dkdLog } from './dkd_logger.js';
import type { DkdSupabase } from './dkd_supabase.js';

type DkdSocialPost = {
  dkd_id: string;
  dkd_caption: string;
  dkd_media_url: string | null;
  dkd_telegram_channel_id: string | null;
  dkd_metrics: Record<string, unknown> | null;
};

type DkdTelegramChannel = {
  dkd_id: string;
  dkd_channel_key: string;
  dkd_chat_id: string;
};

type DkdTelegramSendResult = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

export async function dkdEnsureTelegramChannels(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  if (!dkdConfig.dkdTelegramChatIdTrMain) return;

  const dkdHotChatId = dkdConfig.dkdTelegramChatIdTrHot || dkdConfig.dkdTelegramChatIdTrMain;
  const dkdSingleChannelMode = dkdConfig.dkdTelegramChatIdTrMain === dkdHotChatId;

  const { error: dkdMainError } = await dkdSupabase
    .from('dkd_deal_telegram_channels')
    .update({
      dkd_chat_id: dkdConfig.dkdTelegramChatIdTrMain,
      dkd_is_active: true,
      dkd_updated_at: new Date().toISOString()
    })
    .eq('dkd_channel_key', 'draborndeal_tr_main');

  if (dkdMainError) throw dkdMainError;

  if (dkdSingleChannelMode) {
    const { error: dkdHotDeactivateError } = await dkdSupabase
      .from('dkd_deal_telegram_channels')
      .update({
        dkd_is_active: false,
        dkd_updated_at: new Date().toISOString()
      })
      .eq('dkd_channel_key', 'draborndeal_tr_hot');

    if (dkdHotDeactivateError) throw dkdHotDeactivateError;
  } else {
    const { error: dkdHotError } = await dkdSupabase
      .from('dkd_deal_telegram_channels')
      .update({
        dkd_chat_id: dkdHotChatId,
        dkd_is_active: true,
        dkd_updated_at: new Date().toISOString()
      })
      .eq('dkd_channel_key', 'draborndeal_tr_hot');

    if (dkdHotError) throw dkdHotError;
  }

  dkdLog('info', 'dkd_telegram_channels_ready', {
    dkd_single_channel_mode: dkdSingleChannelMode
  });
}

export async function dkdProcessTelegramDrafts(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  if (!dkdConfig.dkdEnableTelegram) {
    dkdLog('info', 'dkd_telegram_disabled');
    return;
  }

  if (!dkdConfig.dkdTelegramBotToken) {
    throw new Error('Missing Telegram bot token while Telegram is enabled.');
  }

  await dkdEnsureTelegramChannels(dkdSupabase, dkdConfig);

  const { data: dkdPosts, error: dkdPostError } = await dkdSupabase
    .from('dkd_deal_social_posts')
    .select('dkd_id, dkd_caption, dkd_media_url, dkd_telegram_channel_id, dkd_metrics')
    .eq('dkd_platform', 'telegram')
    .eq('dkd_status', 'draft')
    .order('dkd_created_at', { ascending: true })
    .limit(dkdConfig.dkdWorkerJobLimit);

  if (dkdPostError) throw dkdPostError;
  const dkdRows = (dkdPosts || []) as DkdSocialPost[];
  dkdLog('info', 'dkd_telegram_drafts_loaded', { dkd_count: dkdRows.length });

  for (const dkdPost of dkdRows) {
    await dkdSendSingleDraft(dkdSupabase, dkdConfig, dkdPost);
  }
}

async function dkdSendSingleDraft(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig, dkdPost: DkdSocialPost): Promise<void> {
  const dkdChannel = await dkdLoadTelegramChannel(dkdSupabase, dkdPost.dkd_telegram_channel_id);
  if (!dkdChannel) {
    await dkdMarkPostFailed(dkdSupabase, dkdPost, 'Telegram channel not found or inactive.');
    return;
  }

  dkdLog('info', 'dkd_telegram_draft_ready_to_send', {
    dkd_post_id: dkdPost.dkd_id,
    dkd_channel_key: dkdChannel.dkd_channel_key,
    dkd_dry_run: dkdConfig.dkdWorkerDryRun
  });

  if (dkdConfig.dkdWorkerDryRun) {
    return;
  }

  try {
    const dkdResult = dkdPost.dkd_media_url
      ? await dkdSendTelegramPhoto(dkdConfig.dkdTelegramBotToken!, dkdChannel.dkd_chat_id, dkdPost.dkd_media_url, dkdPost.dkd_caption)
      : await dkdSendTelegramMessage(dkdConfig.dkdTelegramBotToken!, dkdChannel.dkd_chat_id, dkdPost.dkd_caption);

    if (!dkdResult.ok) {
      await dkdMarkPostFailed(dkdSupabase, dkdPost, dkdResult.description || 'Telegram API send failed.');
      return;
    }

    const { error: dkdUpdateError } = await dkdSupabase
      .from('dkd_deal_social_posts')
      .update({
        dkd_status: 'published',
        dkd_external_message_id: dkdResult.result?.message_id ? String(dkdResult.result.message_id) : null,
        dkd_published_at: new Date().toISOString(),
        dkd_metrics: {
          ...(dkdPost.dkd_metrics || {}),
          dkd_sent_by: dkdConfig.dkdWorkerKey,
          dkd_sent_at: new Date().toISOString(),
          dkd_channel_key: dkdChannel.dkd_channel_key
        },
        dkd_updated_at: new Date().toISOString()
      })
      .eq('dkd_id', dkdPost.dkd_id);

    if (dkdUpdateError) throw dkdUpdateError;
    dkdLog('info', 'dkd_telegram_draft_published', { dkd_post_id: dkdPost.dkd_id });
  } catch (dkdError) {
    await dkdMarkPostFailed(dkdSupabase, dkdPost, dkdError instanceof Error ? dkdError.message : JSON.stringify(dkdError));
  }
}

async function dkdLoadTelegramChannel(dkdSupabase: DkdSupabase, dkdChannelId: string | null): Promise<DkdTelegramChannel | null> {
  if (!dkdChannelId) return null;
  const { data: dkdChannel, error: dkdError } = await dkdSupabase
    .from('dkd_deal_telegram_channels')
    .select('dkd_id, dkd_channel_key, dkd_chat_id')
    .eq('dkd_id', dkdChannelId)
    .eq('dkd_is_active', true)
    .maybeSingle();

  if (dkdError) throw dkdError;
  return (dkdChannel as DkdTelegramChannel | null) || null;
}

async function dkdMarkPostFailed(dkdSupabase: DkdSupabase, dkdPost: DkdSocialPost, dkdReason: string): Promise<void> {
  const { error: dkdError } = await dkdSupabase
    .from('dkd_deal_social_posts')
    .update({
      dkd_status: 'failed',
      dkd_metrics: {
        ...(dkdPost.dkd_metrics || {}),
        dkd_failed_at: new Date().toISOString(),
        dkd_failure_reason: dkdReason
      },
      dkd_updated_at: new Date().toISOString()
    })
    .eq('dkd_id', dkdPost.dkd_id);

  if (dkdError) throw dkdError;
  dkdLog('warn', 'dkd_telegram_draft_failed', { dkd_post_id: dkdPost.dkd_id, dkd_reason: dkdReason });
}

async function dkdSendTelegramMessage(dkdBotToken: string, dkdChatId: string, dkdText: string): Promise<DkdTelegramSendResult> {
  const dkdResponse = await fetch(`https://api.telegram.org/bot${dkdBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: dkdChatId,
      text: dkdText,
      disable_web_page_preview: false
    })
  });
  return (await dkdResponse.json()) as DkdTelegramSendResult;
}

async function dkdSendTelegramPhoto(dkdBotToken: string, dkdChatId: string, dkdPhotoUrl: string, dkdCaption: string): Promise<DkdTelegramSendResult> {
  const dkdResponse = await fetch(`https://api.telegram.org/bot${dkdBotToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: dkdChatId,
      photo: dkdPhotoUrl,
      caption: dkdCaption.slice(0, 1024)
    })
  });
  return (await dkdResponse.json()) as DkdTelegramSendResult;
}
