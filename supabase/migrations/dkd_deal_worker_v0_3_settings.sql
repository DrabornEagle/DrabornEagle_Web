-- DraBornDeal worker v0.3 settings
-- Manual watch-link parser is implemented in deal-worker.

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_worker_version', '{"version":"0.3","feature":"manual_watch_link_parser","safe_default":"dry_run_and_manual_review_gate"}'::jsonb, 'Current DraBornDeal worker implementation marker.'),
  ('dkd_deal_parser_v0_3', '{"input":"dkd_deal_watch_links.pending","output":["dkd_deal_products","dkd_deal_product_snapshots"],"extractors":["json_ld","open_graph","meta"]}'::jsonb, 'Product parser v0.3 capability summary.'),
  ('dkd_deal_manual_test_flow', '{"step_1":"insert product url into dkd_deal_watch_links","step_2":"run worker dry-run","step_3":"approve source terms gate","step_4":"run worker with dry-run false"}'::jsonb, 'Manual link parser test flow.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
