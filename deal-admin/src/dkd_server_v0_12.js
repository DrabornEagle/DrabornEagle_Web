import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { dkdAdminDirectShare } from './dkd_admin_direct_share.js';

const dkdPort = Number(process.env.DKD_ADMIN_PORT || 8787);
const dkdAdminPanelKey = process.env.DKD_ADMIN_PANEL_KEY || '';
const dkdBotToken = process.env.DKD_TELEGRAM_BOT_TOKEN || '';
const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});
const dkdApp = express();

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

dkdApp.post('/api/dkd-share-link-direct', dkdRequireAdmin, async (req, res) => {
  try {
    const dkdUrl = String(req.body.dkd_url || '').trim();
    if (!dkdUrl) return res.status(400).json({ dkd_error: 'missing_url' });
    const dkdResult = await dkdAdminDirectShare(dkdSupabase, dkdBotToken, dkdUrl);
    res.json({ dkd_ok: true, dkd_result: dkdResult });
  } catch (error) {
    res.status(500).json({ dkd_error: dkdErrorText(error) });
  }
});

dkdApp.get('/api/dkd-health', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase.from('dkd_deal_system_settings').select('dkd_setting_key, dkd_setting_value').order('dkd_setting_key').limit(8);
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

dkdApp.listen(dkdPort, '0.0.0.0', () => console.log(JSON.stringify({ dkd_message: 'dkd_admin_started', dkd_port: dkdPort, dkd_direct_share: true })));
