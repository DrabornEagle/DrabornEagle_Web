-- DraBornDeal / Firsat Radari v0.7
-- Telegram sender worker marker. Real secrets stay only in CX33 .env.

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_telegram_sender_version', '{"version":"0.7","mode":"worker_env_sender","single_channel":true,"secret_storage":"cx33_env_only"}'::jsonb, 'DraBornDeal Telegram sender worker layer.'),
  ('dkd_deal_telegram_sender_safety_v0_7', '{"requires_enable_flag":true,"requires_dry_run_false":true,"updates_post_status":["published","failed"],"does_not_store_bot_token":true}'::jsonb, 'Telegram sender safety settings.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
