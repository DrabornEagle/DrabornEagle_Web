-- DraBornDeal / Firsat Radari v0.8.1
-- Admin panel permissions for service_role via PostgREST.

grant select on public.dkd_deal_system_settings to service_role;
grant select on public.dkd_deal_watch_links to service_role;
grant select on public.dkd_deal_products to service_role;
grant select on public.dkd_deal_sources to service_role;
grant select on public.dkd_deal_telegram_channels to service_role;
grant select on public.dkd_deal_social_posts to service_role;

grant select on public.dkd_deal_watch_link_queue_v0_7_2 to service_role;
grant select on public.dkd_deal_hot_ranked_products_v0_5 to service_role;
grant select on public.dkd_deal_hot_feed_v0_5 to service_role;
grant select on public.dkd_deal_super_hot_v0_5 to service_role;
grant select on public.dkd_deal_ready_to_share_v0_5 to service_role;
grant select on public.dkd_deal_social_post_queue_v0_6 to service_role;
grant select on public.dkd_deal_telegram_draft_candidates_v0_6 to service_role;

grant execute on function public.dkd_deal_add_watch_link_v0_7_2(text, integer, text) to service_role;
grant execute on function public.dkd_deal_generate_telegram_drafts_v0_6(text, integer) to service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_admin_permissions_version', '{"version":"0.8.1","fix":"service_role_select_grants_for_admin_panel"}'::jsonb, 'Admin panel service_role read permissions.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
