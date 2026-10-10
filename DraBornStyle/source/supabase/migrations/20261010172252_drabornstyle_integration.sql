-- Preserve all existing exposed schemas and publications.
do $$ declare existing text; begin
 select substr(c,18) into existing from pg_roles r cross join unnest(r.rolconfig) c where r.rolname='authenticator' and c like 'pgrst.db_schemas=%';
 existing:=coalesce(existing,'public, graphql_public');
 if not 'drabornstyle'=any(string_to_array(replace(existing,' ',''),',')) then execute format('alter role authenticator set pgrst.db_schemas = %L',existing||', drabornstyle'); end if;
end $$;
notify pgrst,'reload config';notify pgrst,'reload schema';
do $$ declare t text; begin
 foreach t in array array['db_style_appointments','db_style_staff_availability','db_style_service_sessions','db_style_messages','db_style_conversations','db_style_conversation_presence','db_style_notifications','db_style_business_balances','db_style_payment_requests','db_style_location_sessions','db_style_queue','db_style_availability_requests'] loop
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='drabornstyle' and tablename=t) then execute format('alter publication supabase_realtime add table drabornstyle.%I',t); end if;
 end loop;
end $$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('drabornstyle-media','drabornstyle-media',true,5242880,array['image/jpeg','image/png','image/webp']),('drabornstyle-receipts','drabornstyle-receipts',false,5242880,array['image/jpeg','image/png','application/pdf']) on conflict(id) do nothing;
create policy db_style_media_read on storage.objects for select to anon,authenticated using(bucket_id='drabornstyle-media');
create policy db_style_media_insert on storage.objects for insert to authenticated with check(bucket_id='drabornstyle-media' and drabornstyle_private.manages((storage.foldername(name))[1]::uuid));
create policy db_style_media_update on storage.objects for update to authenticated using(bucket_id='drabornstyle-media' and drabornstyle_private.manages((storage.foldername(name))[1]::uuid)) with check(bucket_id='drabornstyle-media' and drabornstyle_private.manages((storage.foldername(name))[1]::uuid));
create policy db_style_receipt_insert on storage.objects for insert to authenticated with check(bucket_id='drabornstyle-receipts' and drabornstyle_private.manages((storage.foldername(name))[1]::uuid) and exists(select 1 from drabornstyle.db_style_payment_requests p where p.id=(storage.foldername(name))[2]::uuid and p.business_id=(storage.foldername(name))[1]::uuid and p.status in ('pending','reviewing')));
create policy db_style_receipt_read on storage.objects for select to authenticated using(bucket_id='drabornstyle-receipts' and drabornstyle_private.manages((storage.foldername(name))[1]::uuid));
alter table drabornstyle.db_style_payment_schedules add column last_due date;
create function drabornstyle_private.tick() returns void language plpgsql security definer set search_path='' as $$
declare r record; d date:=(now() at time zone 'Europe/Istanbul')::date; begin
 for r in select a.*,s.user_id as staff_user from drabornstyle.db_style_appointments a join drabornstyle.db_style_staff s on s.id=a.staff_id where a.status in ('confirmed','late') and a.starts_at between now() and now()+interval '30 minutes' loop
  perform drabornstyle_private.notify(r.customer_user_id,r.business_id,'reminder','Randevun yaklaşıyor',r.customer_name||' · '||r.starts_at,'reminder:'||r.id,jsonb_build_object('appointment_id',r.id));
  perform drabornstyle_private.notify(r.staff_user,r.business_id,'reminder','Sıradaki randevun yaklaşıyor',r.customer_name,'reminder:'||r.id,jsonb_build_object('appointment_id',r.id));
 end loop;
 for r in select p.*,b.owner_id,ba.balance from drabornstyle.db_style_payment_schedules p join drabornstyle.db_style_businesses b on b.id=p.business_id join drabornstyle.db_style_business_balances ba on ba.business_id=p.business_id where p.next_due<=d loop
  if r.balance>0 then perform drabornstyle_private.notify(r.owner_id,r.business_id,'payment_due','Platform ödeme günü',r.balance||' TL bakiye · Ödeme bildirimi oluşturabilirsin.','due:'||r.business_id||':'||r.next_due); end if;
  update drabornstyle.db_style_payment_schedules set last_due=next_due,next_due=case when period='weekly' then d+((payment_day-extract(isodow from d)::integer+6)%7+1) else (date_trunc('month',d)::date+interval '1 month')::date+payment_day-1 end where business_id=r.business_id;
 end loop;
 for r in select p.*,b.owner_id,ba.balance from drabornstyle.db_style_payment_schedules p join drabornstyle.db_style_businesses b on b.id=p.business_id join drabornstyle.db_style_business_balances ba on ba.business_id=p.business_id where p.last_due<d and ba.balance>0 loop
  perform drabornstyle_private.notify(r.owner_id,r.business_id,'payment_late','Bekleyen platform borcu',r.balance||' TL · Tahsilat bekleniyor.','late:'||r.business_id||':'||d);
 end loop;
 update drabornstyle.db_style_staff_availability set state='available',busy_until=null,updated_at=now() where state in ('busy','break') and busy_until<=now();
 update drabornstyle.db_style_location_sessions set revoked_at=coalesce(revoked_at,now()),latitude=null,longitude=null,distance_km=null,eta_minutes=null where expires_at<now() and latitude is not null;
end $$;
revoke all on function drabornstyle_private.tick() from public,anon,authenticated;
select cron.schedule('drabornstyle-minute','* * * * *','select drabornstyle_private.tick()');

-- Mutations are possible only through explicitly authenticated RPCs.
revoke insert,update,delete,truncate,references,trigger on all tables in schema drabornstyle from anon,authenticated;
revoke execute on all functions in schema drabornstyle_private from public;
revoke execute on all functions in schema drabornstyle from public;
grant execute on function drabornstyle.directory() to anon,authenticated;
grant execute on function drabornstyle.api(text,jsonb) to authenticated;
