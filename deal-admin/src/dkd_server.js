import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const dkdPort = Number(process.env.DKD_ADMIN_PORT || 8787);
const dkdAdminPanelKey = process.env.DKD_ADMIN_PANEL_KEY || '';
const dkdSupabaseUrl = process.env.DKD_SUPABASE_URL || '';
const dkdSupabaseServiceRoleKey = process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '';

if (!dkdSupabaseUrl || !dkdSupabaseServiceRoleKey) {
  console.error('Missing DKD_SUPABASE_URL or DKD_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!dkdAdminPanelKey || dkdAdminPanelKey === 'local-admin-key-change-me') {
  console.warn('Warning: DKD_ADMIN_PANEL_KEY should be changed before real use.');
}

const dkdSupabase = createClient(dkdSupabaseUrl, dkdSupabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const dkdApp = express();
dkdApp.use(express.json({ limit: '256kb' }));
dkdApp.use(express.urlencoded({ extended: true }));
dkdApp.use(express.static(new URL('../public', import.meta.url).pathname));

function dkdRequireAdmin(req, res, next) {
  const dkdHeaderKey = req.headers['x-dkd-admin-key'];
  const dkdQueryKey = req.query.dkd_key;
  const dkdCookieKey = (req.headers.cookie || '').split(';').map((dkdCookie) => dkdCookie.trim()).find((dkdCookie) => dkdCookie.startsWith('dkd_admin_key='))?.split('=')[1];
  const dkdGivenKey = dkdHeaderKey || dkdQueryKey || dkdCookieKey;

  if (!dkdAdminPanelKey || dkdGivenKey !== dkdAdminPanelKey) {
    return res.status(401).json({ dkd_error: 'unauthorized' });
  }
  next();
}

function dkdSafeError(dkdError) {
  if (dkdError instanceof Error) return dkdError.message;
  try { return JSON.stringify(dkdError); } catch { return String(dkdError); }
}

dkdApp.get('/api/dkd-health', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_system_settings')
    .select('dkd_setting_key, dkd_setting_value')
    .in('dkd_setting_key', ['dkd_deal_worker_runtime_mode', 'dkd_deal_termux_telegram_live_test', 'dkd_deal_hot_deals_version', 'dkd_deal_affiliate_links_version'])
    .order('dkd_setting_key');

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_settings: data || [] });
});

dkdApp.post('/api/dkd-watch-links', dkdRequireAdmin, async (req, res) => {
  const dkdUrl = String(req.body.dkd_url || '').trim();
  const dkdPriority = Number(req.body.dkd_priority || 10);
  if (!dkdUrl) return res.status(400).json({ dkd_error: 'missing_url' });

  const { data, error } = await dkdSupabase.rpc('dkd_deal_add_watch_link_v0_7_2', {
    dkd_url: dkdUrl,
    dkd_priority: dkdPriority,
    dkd_note: 'Added from DraBornDeal admin panel v0.8.'
  });

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_result: data });
});

dkdApp.get('/api/dkd-watch-links', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_watch_link_queue_v0_7_2')
    .select('*')
    .limit(30);

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-products', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_products')
    .select('dkd_id, dkd_product_name, dkd_brand_name, dkd_product_url, dkd_image_url, dkd_currency_code, dkd_current_price, dkd_original_price, dkd_discount_percent, dkd_stock_status, dkd_rating, dkd_review_count, dkd_deal_score, dkd_trend_score, dkd_created_at, dkd_updated_at')
    .order('dkd_updated_at', { ascending: false })
    .limit(30);

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-hot-feed', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_hot_ranked_products_v0_5')
    .select('*')
    .order('dkd_hot_score', { ascending: false })
    .limit(30);

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-social-posts', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_social_post_queue_v0_6')
    .select('*')
    .limit(30);

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.get('/api/dkd-affiliate-rules', dkdRequireAdmin, async (req, res) => {
  const { data, error } = await dkdSupabase
    .from('dkd_deal_affiliate_rules_v0_9')
    .select('*')
    .limit(50);

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_rows: data || [] });
});

dkdApp.post('/api/dkd-affiliate-rules/:dkdRuleId', dkdRequireAdmin, async (req, res) => {
  const dkdRuleId = String(req.params.dkdRuleId || '').trim();
  const dkdMode = String(req.body.dkd_affiliate_mode || 'append_query');
  const dkdParamKey = String(req.body.dkd_param_key || '').trim() || null;
  const dkdParamValue = String(req.body.dkd_param_value || '').trim() || null;
  const dkdTemplateUrl = String(req.body.dkd_template_url || '').trim() || null;
  const dkdIsActive = Boolean(req.body.dkd_is_active);

  if (!dkdRuleId) return res.status(400).json({ dkd_error: 'missing_rule_id' });
  if (!['append_query', 'template', 'none'].includes(dkdMode)) return res.status(400).json({ dkd_error: 'invalid_affiliate_mode' });

  const { data, error } = await dkdSupabase
    .from('dkd_deal_affiliate_rules')
    .update({
      dkd_is_active: dkdIsActive,
      dkd_affiliate_mode: dkdMode,
      dkd_param_key: dkdParamKey,
      dkd_param_value: dkdParamValue,
      dkd_template_url: dkdTemplateUrl,
      dkd_notes: 'Updated from DraBornDeal admin panel v0.9.',
      dkd_updated_at: new Date().toISOString()
    })
    .eq('dkd_id', dkdRuleId)
    .select('dkd_id')
    .single();

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_result: data });
});

dkdApp.post('/api/dkd-generate-drafts', dkdRequireAdmin, async (req, res) => {
  const dkdLimit = Number(req.body.dkd_limit || 10);
  const { data, error } = await dkdSupabase.rpc('dkd_deal_generate_telegram_drafts_v0_6', {
    dkd_country_filter: 'TR',
    dkd_limit: dkdLimit
  });

  if (error) return res.status(500).json({ dkd_error: dkdSafeError(error) });
  res.json({ dkd_ok: true, dkd_result: data });
});

dkdApp.listen(dkdPort, '0.0.0.0', () => {
  console.log(JSON.stringify({ dkd_message: 'dkd_admin_started', dkd_port: dkdPort }));
});
