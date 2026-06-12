import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { dkdAdminDirectShareFullUrlOnly } from './dkd_admin_direct_share_full_url_only.js';
import { dkdAdminBuildTelegramPreview } from './dkd_admin_telegram_preview.js';

const dkdPort = Number(process.env.DKD_ADMIN_PORT || 8787);
const dkdAdminPanelKey = process.env.DKD_ADMIN_PANEL_KEY || '';
const dkdBotToken = process.env.DKD_TELEGRAM_BOT_TOKEN || '';
const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});
const dkdApp = express();
const dkdHealthKeys = [
  'dkd_deal_worker_runtime_mode',
  'dkd_deal_source_admin_version',
  'dkd_deal_hot_deals_version',
  'dkd_deal_telegram_caption_format_version',
  'dkd_deal_telegram_preview_version',
  'dkd_deal_admin_cleanup_version',
  'dkd_deal_affiliate_links_version',
  'dkd_deal_termux_telegram_live_test'
];

dkdApp.use(express.json({ limit: '256kb' }));
dkdApp.use(express.urlencoded({ extended: true }));
dkdApp.use(express.static(new URL('../public', import.meta.url).pathname));

function dkdRequireAdmin(req, res, next) {
  const dkdGivenKey = req.headers['x-dkd-admin-key'];
  if (!dkdAdminPanelKey || dkdGivenKey !== dkdAdminPanelKey) return res.status(401).json({ dkd_error: 'unauthorized' });
  next();
}
function dkdErrorText(error) {
  if (error instanceof Error) return error.message;
  try { return JSON.stringify(error); } catch { return String(error); }
}
function dkdCleanId(dkdValue, dkdName) {
  const dkdId = String(dkdValue || '').trim();
  if (!dkdId) throw new Error(`${dkdName} eksik.`);
  return dkdId;
}
async function dkdDeleteRows(dkdTable, dkdColumn, dkdValue) {
  const { data, error } = await dkdSupabase.from(dkdTable).delete().eq(dkdColumn, dkdValue).select('dkd_id');
  if (error) throw error;
  return { dkd_table: dkdTable, dkd_deleted_count: Array.isArray(data) ? data.length : 0 };
}
async function dkdTryDeleteRows(dkdTable, dkdColumn, dkdValue) {
  const { data, error } = await dkdSupabase.from(dkdTable).delete().eq(dkdColumn, dkdValue).select('dkd_id');
  if (error) return { dkd_table: dkdTable, dkd_ok: false, dkd_error: dkdErrorText(error), dkd_deleted_count: 0 };
  return { dkd_table: dkdTable, dkd_ok: true, dkd_deleted_count: Array.isArray(data) ? data.length : 0 };
}
async function dkdCountRows(dkdTable, dkdBuildQuery = null) {
  let dkdQuery = dkdSupabase.from(dkdTable).select('dkd_id', { count: 'exact', head: true });
  if (dkdBuildQuery) dkdQuery = dkdBuildQuery(dkdQuery);
  const { count, error } = await dkdQuery;
  if (error) throw error;
  return Number(count || 0);
}
function dkdStartOfTodayIso() {
  const dkdNow = new Date();
  dkdNow.setHours(0, 0, 0, 0);
  return dkdNow.toISOString();
}
async function dkdDeleteWatchLink(dkdWatchLinkId) {
  const dkdTables = ['dkd_deal_watch_links', 'dkd_deal_watch_link_queue', 'dkd_deal_watch_link_queue_v0_7_2'];
  const dkdAttempts = [];
  for (const dkdTable of dkdTables) {
    const dkdAttempt = await dkdTryDeleteRows(dkdTable, 'dkd_id', dkdWatchLinkId);
    dkdAttempts.push(dkdAttempt);
    if (dkdAttempt.dkd_ok && dkdAttempt.dkd_deleted_count > 0) return { dkd_deleted: true, dkd_attempts: dkdAttempts };
  }
  return { dkd_deleted: false, dkd_attempts: dkdAttempts };
}
async function dkdBuildStats() {
  const dkdTodayIso = dkdStartOfTodayIso();
  const [dkdTotalProducts, dkdTodayProducts, dkdPublishedPosts, dkdTodayPosts, dkdPendingWatchLinks, dkdSourcesResult, dkdProductSourceRows, dkdTopHotResult] = await Promise.all([
    dkdCountRows('dkd_deal_products'),
    dkdCountRows('dkd_deal_products', (dkdQuery) => dkdQuery.gte('dkd_updated_at', dkdTodayIso)),
    dkdCountRows('dkd_deal_social_posts', (dkdQuery) => dkdQuery.eq('dkd_platform', 'telegram').eq('dkd_status', 'published')),
    dkdCountRows('dkd_deal_social_posts', (dkdQuery) => dkdQuery.eq('dkd_platform', 'telegram').gte('dkd_published_at', dkdTodayIso)),
    dkdCountRows('dkd_deal_watch_link_queue_v0_7_2', (dkdQuery) => dkdQuery.in('dkd_status', ['pending', 'accepted'])),
    dkdSupabase.from('dkd_deal_sources').select('dkd_id, dkd_source_key, dkd_source_name, dkd_is_active').eq('dkd_country_code', 'TR').order('dkd_priority'),
    dkdSupabase.from('dkd_deal_products').select('dkd_source_id').limit(1000),
    dkdSupabase.from('dkd_deal_hot_ranked_products_v0_5').select('dkd_product_name, dkd_source_key, dkd_current_price, dkd_currency_code, dkd_hot_score, dkd_heat_label, dkd_discount_percent').order('dkd_hot_score', { ascending: false }).limit(5)
  ]);

  if (dkdSourcesResult.error) throw dkdSourcesResult.error;
  if (dkdProductSourceRows.error) throw dkdProductSourceRows.error;
  if (dkdTopHotResult.error) throw dkdTopHotResult.error;

  const dkdSourceMap = new Map((dkdSourcesResult.data || []).map((dkdSource) => [dkdSource.dkd_id, dkdSource]));
  const dkdSourceCounts = new Map();
  (dkdProductSourceRows.data || []).forEach((dkdRow) => {
    const dkdKey = dkdRow.dkd_source_id || 'unknown';
    dkdSourceCounts.set(dkdKey, (dkdSourceCounts.get(dkdKey) || 0) + 1);
  });
  const dkdSources = Array.from(dkdSourceCounts.entries()).map(([dkdSourceId, dkdCount]) => {
    const dkdSource = dkdSourceMap.get(dkdSourceId);
    return {
      dkd_source_id: dkdSourceId,
      dkd_source_key: dkdSource?.dkd_source_key || 'unknown',
      dkd_source_name: dkdSource?.dkd_source_name || 'Bilinmeyen kaynak',
      dkd_is_active: Boolean(dkdSource?.dkd_is_active),
      dkd_product_count: dkdCount
    };
  }).sort((dkdLeft, dkdRight) => dkdRight.dkd_product_count - dkdLeft.dkd_product_count).slice(0, 6);

  return {
    dkd_stats_version: 'v0.17',
    dkd_generated_at: new Date().toISOString(),
    dkd_totals: {
      dkd_total_products: dkdTotalProducts,
      dkd_today_products: dkdTodayProducts,
      dkd_published_telegram_posts: dkdPublishedPosts,
      dkd_today_telegram_posts: dkdTodayPosts,
      dkd_pending_watch_links: dkdPendingWatchLinks,
      dkd_active_sources: (dkdSourcesResult.data || []).filter((dkdSource) => dkdSource.dkd_is_active).length
    },
    dkd_sources: dkdSources,
    dkd_top_hot_products: dkdTopHotResult.data || []
  };
}

dkdApp.get('/api/dkd-stats', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdStats = await dkdBuildStats();
    res.json({ dkd_ok: true, dkd_stats: dkdStats });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.post('/api/dkd-telegram-preview', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdUrl = String(req.body.dkd_url || '').trim();
    if (!dkdUrl) return res.status(400).json({ dkd_error: 'missing_url' });
    const dkdPreview = await dkdAdminBuildTelegramPreview(dkdSupabase, dkdUrl);
    res.json({ dkd_ok: true, dkd_preview: dkdPreview });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.post('/api/dkd-share-link-direct', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdUrl = String(req.body.dkd_url || '').trim();
    if (!dkdUrl) return res.status(400).json({ dkd_error: 'missing_url' });
    const dkdResult = await dkdAdminDirectShareFullUrlOnly(dkdSupabase, dkdBotToken, dkdUrl);
    res.json({ dkd_ok: true, dkd_result: dkdResult });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.delete('/api/dkd-products/:dkdProductId', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdProductId = dkdCleanId(req.params.dkdProductId, 'product_id');
    const dkdSocialPosts = await dkdDeleteRows('dkd_deal_social_posts', 'dkd_product_id', dkdProductId);
    const dkdSnapshots = await dkdDeleteRows('dkd_deal_product_snapshots', 'dkd_product_id', dkdProductId);
    const dkdProduct = await dkdDeleteRows('dkd_deal_products', 'dkd_id', dkdProductId);
    if (dkdProduct.dkd_deleted_count < 1) return res.status(404).json({ dkd_error: 'product_not_found' });
    res.json({ dkd_ok: true, dkd_deleted: { dkd_product: dkdProduct, dkd_social_posts: dkdSocialPosts, dkd_snapshots: dkdSnapshots } });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.delete('/api/dkd-social-posts/:dkdPostId', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdPostId = dkdCleanId(req.params.dkdPostId, 'post_id');
    const dkdPost = await dkdDeleteRows('dkd_deal_social_posts', 'dkd_id', dkdPostId);
    if (dkdPost.dkd_deleted_count < 1) return res.status(404).json({ dkd_error: 'social_post_not_found' });
    res.json({ dkd_ok: true, dkd_deleted: dkdPost });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.delete('/api/dkd-watch-links/:dkdWatchLinkId', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdWatchLinkId = dkdCleanId(req.params.dkdWatchLinkId, 'watch_link_id');
    const dkdResult = await dkdDeleteWatchLink(dkdWatchLinkId);
    if (!dkdResult.dkd_deleted) return res.status(404).json({ dkd_error: 'watch_link_not_found', dkd_attempts: dkdResult.dkd_attempts });
    res.json({ dkd_ok: true, dkd_deleted: dkdResult });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.get('/api/dkd-health', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_system_settings')
    .select('dkd_setting_key, dkd_setting_value')
    .in('dkd_setting_key', dkdHealthKeys)
    .order('dkd_setting_key');
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_settings: data || [] });
});

dkdApp.get('/api/dkd-sources', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_sources').select('*').eq('dkd_country_code', 'TR').order('dkd_priority');
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.post('/api/dkd-sources/:id', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_sources').update({
    dkd_is_active: Boolean(req.body.dkd_is_active),
    dkd_allowed_by_terms: Boolean(req.body.dkd_allowed_by_terms),
    dkd_needs_manual_review: Boolean(req.body.dkd_needs_manual_review),
    dkd_priority: Number(req.body.dkd_priority || 10),
    dkd_crawl_interval_minutes: Number(req.body.dkd_crawl_interval_minutes || 1440),
    dkd_updated_at: new Date().toISOString()
  }).eq('dkd_id', req.params.id).select('dkd_id').single();
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_result: data });
});

dkdApp.get('/api/dkd-watch-links', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_watch_link_queue_v0_7_2').select('*').limit(30);
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-products', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_products').select('dkd_id, dkd_product_name, dkd_product_url, dkd_currency_code, dkd_current_price, dkd_stock_status, dkd_rating, dkd_review_count, dkd_deal_score, dkd_trend_score, dkd_updated_at').order('dkd_updated_at', { ascending: false }).limit(30);
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-hot-feed', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_hot_ranked_products_v0_5').select('*').order('dkd_hot_score', { ascending: false }).limit(30);
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-social-posts', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_social_post_queue_v0_6').select('*').limit(30);
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-affiliate-rules', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_affiliate_rules_v0_9').select('*').limit(50);
  if (error) return res.status(500).json({ dkd_error: dkdErrorText(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.listen(dkdPort, '0.0.0.0', () => console.log(JSON.stringify({ dkd_message: 'dkd_admin_started', dkd_port: dkdPort, dkd_direct_share: true, dkd_full_url_only: true, dkd_telegram_preview: true, dkd_cleanup_actions: true, dkd_stats: true, dkd_version: 'v0.17' })));
