import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { dkdRegisterClickRedirectRoute } from './dkd_click_redirect_v0_25.js';

const dkdClickPort = Number(process.env.DKD_CLICK_PORT || 8789);
const dkdApp = express();
const dkdSupabase = createClient(process.env.DKD_SUPABASE_URL || '', process.env.DKD_SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});

dkdApp.set('trust proxy', true);
dkdApp.get('/health', (req, res) => res.json({ dkd_ok: true, dkd_service: 'DraBornDeal click tracking', dkd_version: 'v0.34' }));
dkdRegisterClickRedirectRoute(dkdApp, dkdSupabase);

dkdApp.listen(dkdClickPort, '0.0.0.0', () => {
  console.log(JSON.stringify({ dkd_message: 'draborndeal_click_server_started', dkd_port: dkdClickPort, dkd_version: 'v0.34' }));
});
