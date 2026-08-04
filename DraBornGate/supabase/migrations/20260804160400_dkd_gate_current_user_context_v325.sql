create or replace function public.dkd_gate_current_user_context_v325()
returns jsonb
language sql
stable
security definer
set search_path to 'public', 'draborngate', 'auth'
as $function$
  select jsonb_build_object(
    'user_id', dkd_user.id,
    'email', lower(coalesce(dkd_user.email, '')),
    'full_name', coalesce(dkd_profile.full_name, ''),
    'preferred_role', coalesce(dkd_profile.preferred_role, ''),
    'is_admin', exists (
      select 1 from draborngate.dkd_gate_admins dkd_admin
      where dkd_admin.user_id = dkd_user.id
    ),
    'partner_visible', exists (
      select 1 from draborngate.dkd_gate_partner_site_links dkd_link
      where dkd_link.user_id = dkd_user.id
        and dkd_link.is_active
        and (dkd_link.ends_at is null or dkd_link.ends_at > now())
    ),
    'partner_sites', coalesce((
      select jsonb_agg(jsonb_build_object(
        'link_id', dkd_link.id,
        'site_id', dkd_link.site_id,
        'site_name', dkd_site.name,
        'amount_per_courier', dkd_link.amount_per_courier,
        'currency', dkd_link.currency,
        'starts_at', dkd_link.starts_at
      ) order by dkd_site.name)
      from draborngate.dkd_gate_partner_site_links dkd_link
      join draborngate.dkd_gate_sites dkd_site on dkd_site.id = dkd_link.site_id
      where dkd_link.user_id = dkd_user.id
        and dkd_link.is_active
        and (dkd_link.ends_at is null or dkd_link.ends_at > now())
    ), '[]'::jsonb)
  )
  from auth.users dkd_user
  left join draborngate.dkd_gate_profiles dkd_profile on dkd_profile.user_id = dkd_user.id
  where dkd_user.id = auth.uid();
$function$;

revoke all on function public.dkd_gate_current_user_context_v325() from public;
grant execute on function public.dkd_gate_current_user_context_v325() to authenticated;
