begin;

create or replace function public.dkd_gate_current_user_context_v324()
returns jsonb
language sql
stable
security definer
set search_path = public, draborngate, auth
as $$
  select jsonb_build_object(
    'user_id', dkd_user.id,
    'email', lower(coalesce(dkd_user.email, '')),
    'full_name', coalesce(dkd_profile.full_name, ''),
    'preferred_role', coalesce(dkd_profile.preferred_role, ''),
    'is_admin', exists (
      select 1
      from draborngate.dkd_gate_admins dkd_admin
      where dkd_admin.user_id = dkd_user.id
    )
  )
  from auth.users dkd_user
  left join draborngate.dkd_gate_profiles dkd_profile
    on dkd_profile.user_id = dkd_user.id
  where dkd_user.id = auth.uid();
$$;

revoke all on function public.dkd_gate_current_user_context_v324() from public, anon;
grant execute on function public.dkd_gate_current_user_context_v324() to authenticated;

insert into draborngate.dkd_gate_schema_migrations(version, description)
values (
  'web-v3.2.4-session-role-context',
  'Oturum, Admin doğrulaması ve Güvenlik Sade Tema erişimi için güvenli kullanıcı rolü bağlamı'
)
on conflict (version) do update
set description = excluded.description;

notify pgrst, 'reload schema';

commit;
