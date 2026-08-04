begin;

create or replace function draborngate.dkd_gate_current_access_v312()
returns jsonb
language sql
stable
security definer
set search_path = draborngate, public, auth
as $$
  select jsonb_build_object(
    'authenticated', auth.uid() is not null,
    'user_id', auth.uid(),
    'email', coalesce(auth.jwt() ->> 'email', ''),
    'is_admin', case
      when auth.uid() is null then false
      else draborngate.dkd_gate_is_admin_user(auth.uid())
    end,
    'full_name', coalesce((
      select dkd_profile.full_name
      from draborngate.dkd_gate_profiles dkd_profile
      where dkd_profile.user_id = auth.uid()
    ), ''),
    'preferred_role', coalesce((
      select dkd_profile.preferred_role
      from draborngate.dkd_gate_profiles dkd_profile
      where dkd_profile.user_id = auth.uid()
    ), '')
  );
$$;

revoke all on function draborngate.dkd_gate_current_access_v312() from public;
grant execute on function draborngate.dkd_gate_current_access_v312() to authenticated;

insert into draborngate.dkd_gate_schema_migrations (version, description)
values (
  'web-v3.1.2',
  'Güncel oturum ve Admin yetkisini doğrudan doğrulayan erişim RPC katmanı'
)
on conflict (version) do nothing;

commit;
