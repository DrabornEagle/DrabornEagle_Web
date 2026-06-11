-- DraBornDeal / Firsat Radari v0.10
-- Source management permissions and marker for admin panel.

grant select, update on public.dkd_deal_sources to service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_source_admin_version', '{"version":"0.10","feature":"admin_source_management","scope":"manual_source_controls"}'::jsonb, 'DraBornDeal admin source management layer.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
