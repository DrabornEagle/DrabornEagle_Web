-- DraBornDeal / Firsat Radari v0.8.2
-- Fix admin panel permission chain for hot feed views.

grant select on public.dkd_deal_product_price_history_v0_4 to service_role;
grant select on public.dkd_deal_product_metrics_v0_4 to service_role;
grant select on public.dkd_deal_price_drop_alerts_v0_4 to service_role;

grant select on public.dkd_deal_product_snapshots to service_role;
grant select on public.dkd_deal_categories to service_role;

grant select on public.dkd_deal_product_price_history_v0_4 to anon, authenticated;
grant select on public.dkd_deal_product_metrics_v0_4 to anon, authenticated;
grant select on public.dkd_deal_price_drop_alerts_v0_4 to anon, authenticated;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_admin_price_history_permissions_version', '{"version":"0.8.2","fix":"service_role_price_history_view_chain"}'::jsonb, 'Admin panel price history and price drop view permission chain.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
