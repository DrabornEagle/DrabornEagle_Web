-- Automatic recall is disabled until the business explicitly enables it.
alter table drabornstyle.db_style_business_settings add column recall_after_days integer not null default 0 check(recall_after_days=0 or recall_after_days between 7 and 365);
do $migration$
declare def text; old_line text := $old$loyalty_percent=coalesce((data->>'loyalty_percent')::numeric,loyalty_percent),auto_reply=$old$;
begin
 select pg_get_functiondef('drabornstyle_private.api(text,jsonb)'::regprocedure) into def;
 if position(old_line in def)=0 then raise exception 'Expected settings implementation missing'; end if;
 execute replace(def,old_line,$new$loyalty_percent=coalesce((data->>'loyalty_percent')::numeric,loyalty_percent),recall_after_days=coalesce((data->>'recall_after_days')::integer,recall_after_days),auto_reply=$new$);
end $migration$;
create or replace function drabornstyle_private.tick() returns void language plpgsql security definer set search_path='' as $$
declare r record; adm record; d date:=(now() at time zone 'Europe/Istanbul')::date; begin
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
  for adm in select user_id from drabornstyle.db_style_admin_users where active loop perform drabornstyle_private.notify(adm.user_id,r.business_id,'payment_late','Geciken işletme borcu',r.balance||' TL tahsilat bekliyor.','admin-late:'||r.business_id||':'||d);end loop;
 end loop;
 for r in select cu.*,l.last_visit,bs.recall_after_days from drabornstyle.db_style_customers cu join drabornstyle.db_style_profiles p on p.id=cu.user_id join drabornstyle.db_style_customer_loyalty l on l.customer_id=cu.id and l.business_id=cu.business_id join drabornstyle.db_style_business_settings bs on bs.business_id=cu.business_id join drabornstyle.db_style_businesses b on b.id=cu.business_id left join drabornstyle.db_style_notification_preferences np on np.user_id=cu.user_id where b.status='active' and p.deleted_at is null and p.marketing_consent and coalesce(np.marketing,true) and bs.recall_after_days>0 and l.last_visit<now()-make_interval(days=>bs.recall_after_days) loop
  perform drabornstyle_private.notify(r.user_id,r.business_id,'recall','Yeni bir bakım zamanı','Son ziyaretinin ardından yeni bir stil için müsait saatleri keşfedebilirsin.','auto-recall:'||r.id||':'||r.last_visit);
 end loop;
 update drabornstyle.db_style_staff_availability set state='available',busy_until=null,updated_at=now() where state in ('busy','break') and busy_until<=now();
 update drabornstyle.db_style_location_sessions set revoked_at=coalesce(revoked_at,now()),latitude=null,longitude=null,distance_km=null,eta_minutes=null where expires_at<now() and latitude is not null;
end $$;
notify pgrst,'reload schema';
