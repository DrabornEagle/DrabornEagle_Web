import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { DkdWorkerConfig } from './dkd_config.js';

export type DkdSupabase = SupabaseClient;

export function dkdCreateSupabaseClient(dkdConfig: DkdWorkerConfig): DkdSupabase {
  return createClient(dkdConfig.dkdSupabaseUrl, dkdConfig.dkdSupabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
