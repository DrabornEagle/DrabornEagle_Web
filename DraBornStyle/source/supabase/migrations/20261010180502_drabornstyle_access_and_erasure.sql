create or replace function drabornstyle_private.api(action text, data jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare
 u uuid:=auth.uid(); b uuid; s uuid; v uuid; a uuid; c uuid; x uuid; target uuid; t timestamptz; e timestamptz;
 ap drabornstyle.db_style_appointments%rowtype; se drabornstyle.db_style_service_sessions%rowtype; sv drabornstyle.db_style_services%rowtype; st drabornstyle.db_style_staff%rowtype;
 cr drabornstyle.db_style_commission_rules%rowtype; rf drabornstyle.db_style_referral_codes%rowtype; pr drabornstyle.db_style_payment_requests%rowtype;
 total numeric(12,2); price numeric(12,2); fee numeric(12,2); pct numeric(5,2):=0; remaining numeric(12,2); portion numeric(12,2);
 i integer; loyalty_pct numeric(5,2); name text; src text; result jsonb; r record; count_repeat integer; conv uuid; key uuid; sid uuid;
begin
 if u is null then raise exception 'Oturum açmalısın.' using errcode='42501'; end if;
 if exists(select 1 from drabornstyle.db_style_profiles where id=u and deleted_at is not null) then raise exception 'Hesap kapatıldı.' using errcode='42501'; end if;
 sid:=nullif(auth.jwt()->>'session_id','')::uuid;
 if sid is not null and not exists(select 1 from auth.sessions where id=sid and user_id=u) then raise exception 'Oturum süresi doldu.' using errcode='42501'; end if;
 insert into drabornstyle.db_style_profiles(id,display_name) select u,coalesce(nullif(left(raw_user_meta_data->>'display_name',100),''),split_part(email,'@',1),'Müşteri') from auth.users where id=u on conflict do nothing;
 b:=nullif(data->>'business_id','')::uuid; s:=nullif(data->>'staff_id','')::uuid; v:=nullif(data->>'service_id','')::uuid; a:=nullif(data->>'appointment_id','')::uuid;
 case action

 when 'repeat_book' then
  count_repeat:=coalesce((data->>'count')::integer,1);
  if count_repeat not between 2 and 8 then raise exception 'Tekrar sayısı 2–8 olmalı.'; end if;
  result:='[]'::jsonb;
  for i in 0..count_repeat-1 loop
   result:=result||jsonb_build_array(drabornstyle_private.api('book',data||jsonb_build_object('starts_at',(data->>'starts_at')::timestamptz+make_interval(days=>i*7))));
  end loop;
  return result;
 when 'receipt_attach' then
  if not drabornstyle_private.manages(b) then raise exception 'Dekont yetkin yok.' using errcode='42501'; end if;
  x:=(data->>'request_id')::uuid;
  if not exists(select 1 from drabornstyle.db_style_payment_requests where id=x and business_id=b and status in ('pending','reviewing')) or split_part(data->>'path','/',1)<>b::text or split_part(data->>'path','/',2)<>x::text or not exists(select 1 from storage.objects where bucket_id='drabornstyle-receipts' and name=data->>'path') then raise exception 'Dekont ve ödeme eşleşmiyor.'; end if;
  insert into drabornstyle.db_style_payment_receipts(business_id,request_id,storage_path,uploaded_by) values(b,x,data->>'path',u) on conflict(storage_path) do nothing;
  for r in select user_id from drabornstyle.db_style_admin_users where active loop perform drabornstyle_private.notify(r.user_id,b,'payment','Dekont yüklendi','Ödeme bildirimini kontrol edebilirsin.','receipt:'||x||':'||(data->>'path')); end loop;
 when 'support_resolve' then
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  update drabornstyle.db_style_support_requests set status=coalesce(data->>'status','resolved') where id=(data->>'id')::uuid;
  perform drabornstyle_private.audit(null,action,(data->>'id')::uuid,data);
 when 'notification_preferences' then
  insert into drabornstyle.db_style_notification_preferences(user_id,appointments,messages,marketing) values(u,coalesce((data->>'appointments')::boolean,true),coalesce((data->>'messages')::boolean,true),coalesce((data->>'marketing')::boolean,false)) on conflict(user_id) do update set appointments=excluded.appointments,messages=excluded.messages,marketing=excluded.marketing;
 when 'qr_create' then
  insert into drabornstyle.db_style_qr_tokens(user_id) values(u) on conflict(user_id) do update set token=gen_random_uuid(),expires_at=now()+interval '5 minutes' returning token into x;
  return jsonb_build_object('token',x,'expires_at',now()+interval '5 minutes');
 when 'qr_lookup' then
  if not drabornstyle_private.works(s) then raise exception 'Usta yetkin yok.' using errcode='42501'; end if;
  select business_id into b from drabornstyle.db_style_staff where id=s;
  select q.user_id,p.display_name into target,name from drabornstyle.db_style_qr_tokens q join drabornstyle.db_style_profiles p on p.id=q.user_id where q.token=(data->>'token')::uuid and q.expires_at>now() and p.deleted_at is null;
  if target is null then raise exception 'QR kodunun süresi doldu veya geçersiz.'; end if;
  insert into drabornstyle.db_style_customers(business_id,staff_id,user_id,name) values(b,s,target,name) on conflict(business_id,user_id) where user_id is not null do update set name=excluded.name returning id into c;
  return jsonb_build_object('customer_id',c,'name',name);
 when 'admin_grant' then
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  select id into target from auth.users where lower(email)=lower(data->>'email');if target is null then raise exception 'Kullanıcı önce kayıt olmalı.'; end if;
  if target=u and not coalesce((data->>'active')::boolean,true) then raise exception 'Kendi admin yetkini kapatamazsın.'; end if;
  insert into drabornstyle.db_style_admin_users(user_id,active) values(target,coalesce((data->>'active')::boolean,true)) on conflict(user_id) do update set active=excluded.active;
  perform drabornstyle_private.audit(null,action,target,jsonb_build_object('active',coalesce((data->>'active')::boolean,true)));
 when 'member_role' then
  if not drabornstyle_private.manages(b) then raise exception 'Yetkin yok.' using errcode='42501'; end if;
  select id into target from auth.users where lower(email)=lower(data->>'email');
  if target is null or data->>'role' not in ('manager','staff') then raise exception 'Kayıtlı hesap ve uygun rol gerekli.'; end if;
  if exists(select 1 from drabornstyle.db_style_business_members where business_id=b and user_id=target and role='owner') then raise exception 'Sahip rolü bu işlemle değiştirilemez.'; end if;
  insert into drabornstyle.db_style_business_members(business_id,user_id,role,active) values(b,target,data->>'role',coalesce((data->>'active')::boolean,true)) on conflict(business_id,user_id) do update set role=excluded.role,active=excluded.active;
  perform drabornstyle_private.audit(b,action,target,data-'email');
 when 'commission_adjust' then
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  x:=(data->>'ledger_id')::uuid;select business_id into b from drabornstyle.db_style_commission_ledger where id=x;
  if b is null or length(coalesce(data->>'reason',''))<3 then raise exception 'Tahakkuk kaydı ve açıklama gerekli.'; end if;
  perform 1 from drabornstyle.db_style_business_balances where business_id=b for update;perform 1 from drabornstyle.db_style_commission_ledger where id=x for update;price:=round((data->>'amount')::numeric,2);
  if not exists(select 1 from drabornstyle.db_style_commission_ledger where id=x and amount+price>=paid) then raise exception 'Düzeltme tahsilatın altına inemez.'; end if;
  insert into drabornstyle.db_style_commission_adjustments(business_id,ledger_id,amount,reason,actor_id) values(b,x,price,data->>'reason',u);
  update drabornstyle.db_style_commission_ledger set amount=amount+price,state=case when amount+price=paid then 'paid' when paid>0 then 'partial' else 'accrued' end where id=x;
  update drabornstyle.db_style_business_balances set accrued=accrued+price,updated_at=now() where business_id=b;
  perform drabornstyle_private.audit(b,action,x,data);

 when 'data_erase' then
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  x:=(data->>'id')::uuid;
  select user_id into target from drabornstyle.db_style_support_requests where id=x and kind='data_delete' and status='pending' for update;
  if target is null then raise exception 'Bekleyen veri silme talebi bulunamadı.'; end if;
  if exists(select 1 from drabornstyle.db_style_business_members where user_id=target and role='owner' and active) or exists(select 1 from drabornstyle.db_style_admin_users where user_id=target and active) then raise exception 'İşletme sahibi veya admin yetkisi önce güvenli biçimde devredilmeli.'; end if;
  update drabornstyle.db_style_profiles set display_name='Silinen kullanıcı',phone=null,avatar_url=null,marketing_consent=false,deleted_at=now() where id=target;
  delete from drabornstyle.db_style_customer_notes where customer_id in(select id from drabornstyle.db_style_customers where user_id=target) or author_id=target;
  delete from drabornstyle.db_style_notifications where user_id=target;
  delete from drabornstyle.db_style_notification_preferences where user_id=target;
  update drabornstyle.db_style_business_members set active=false where user_id=target;
  update drabornstyle.db_style_staff set active=false,name='Ayrılan usta',bio='',specialties='{}',photo_url=null where user_id=target;
  update drabornstyle.db_style_queue set state='cancelled',customer_name='Silinen müşteri' where customer_user_id=target;
  delete from drabornstyle.db_style_waitlists where user_id=target;
  delete from drabornstyle.db_style_availability_requests where user_id=target;
  update drabornstyle.db_style_reviews set body='' where user_id=target;
  update drabornstyle.db_style_support_requests set body='[Talep kişisel içeriği silindi]' where user_id=target;
  update drabornstyle.db_style_customers set name='Silinen müşteri',phone=null,marketing_consent=false,user_id=null where user_id=target;
  update drabornstyle.db_style_appointments set customer_name='Silinen müşteri',status=case when status in ('confirmed','late') then 'cancelled' else status end where customer_user_id=target;
  update drabornstyle.db_style_messages set body='[Mesaj silindi]' where sender_id=target;
  update drabornstyle.db_style_location_sessions set revoked_at=now(),latitude=null,longitude=null,distance_km=null,eta_minutes=null where user_id=target;
  update drabornstyle.db_style_referral_codes set active=false where customer_user_id=target;
  delete from drabornstyle.db_style_customer_referrals where user_id=target;
  delete from drabornstyle.db_style_qr_tokens where user_id=target;
  update drabornstyle.db_style_support_requests set status='resolved' where id=x;
  perform drabornstyle_private.audit(null,action,x,jsonb_build_object('user_id',target,'financial_records_preserved',true));
 when 'profile' then
  update drabornstyle.db_style_profiles set display_name=coalesce(nullif(data->>'name',''),display_name),phone=coalesce(data->>'phone',phone),avatar_url=coalesce(data->>'avatar_url',avatar_url),marketing_consent=coalesce((data->>'marketing')::boolean,marketing_consent) where id=u;
 when 'business_create' then
  if length(coalesce(data->>'name',''))<2 or length(coalesce(data->>'address',''))<3 then raise exception 'İşletme adı ve adres gerekli.'; end if;
  if (select count(*) from drabornstyle.db_style_businesses where owner_id=u and status='pending')>=3 then raise exception 'Başvurularının onayını beklemelisin.'; end if;
  insert into drabornstyle.db_style_businesses(owner_id,name,slug,address,city,phone,description,latitude,longitude) values(u,data->>'name',lower(regexp_replace(data->>'name','[^a-zA-Z0-9]+','-','g'))||'-'||substr(gen_random_uuid()::text,1,8),data->>'address',coalesce(data->>'city',''),data->>'phone',coalesce(data->>'description',''),nullif(data->>'latitude','')::numeric,nullif(data->>'longitude','')::numeric) returning id into b;
  insert into drabornstyle.db_style_business_members values(b,u,'owner',true,now());
  insert into drabornstyle.db_style_commission_rules(business_id) values(b);
  insert into drabornstyle.db_style_business_balances(business_id) values(b);
  insert into drabornstyle.db_style_business_settings(business_id) values(b);
  insert into drabornstyle.db_style_payment_schedules(business_id,next_due) values(b,(now() at time zone 'Europe/Istanbul')::date+7);
  for r in select user_id from drabornstyle.db_style_admin_users where active loop perform drabornstyle_private.notify(r.user_id,b,'application','Yeni işletme başvurusu',data->>'name','application:'||b); end loop;
  perform drabornstyle_private.audit(b,action,b,data); return jsonb_build_object('id',b);
 when 'business_update' then
  if not drabornstyle_private.manages(b) then raise exception 'İşletme yetkin yok.' using errcode='42501'; end if;
  update drabornstyle.db_style_businesses set name=coalesce(data->>'name',name),description=coalesce(data->>'description',description),address=coalesce(data->>'address',address),phone=coalesce(data->>'phone',phone),logo_url=coalesce(data->>'logo_url',logo_url),cover_url=coalesce(data->>'cover_url',cover_url),gallery=coalesce(data->'gallery',gallery),latitude=coalesce(nullif(data->>'latitude','')::numeric,latitude),longitude=coalesce(nullif(data->>'longitude','')::numeric,longitude) where id=b;
 when 'business_status' then
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  update drabornstyle.db_style_businesses set status=data->>'status' where id=b;
  perform drabornstyle_private.notify((select owner_id from drabornstyle.db_style_businesses where id=b),b,'business','İşletme durumu güncellendi',data->>'status','business:'||b||':'||clock_timestamp());
 when 'staff_save' then
  if not drabornstyle_private.manages(b) then raise exception 'Çalışan yönetme yetkin yok.' using errcode='42501'; end if;
  if nullif(data->>'email','') is not null then select id into target from auth.users where lower(email)=lower(data->>'email'); if target is null then raise exception 'Usta önce DraBornStyle hesabı oluşturmalı.'; end if; end if;
  if s is not null and not exists(select 1 from drabornstyle.db_style_staff where id=s and business_id=b) then raise exception 'Usta bu işletmeye ait değil.'; end if;
  if s is null then
   insert into drabornstyle.db_style_staff(business_id,user_id,name,bio,can_discount,max_discount_pct,photo_url,weekly_goal,specialties) values(b,target,data->>'name',coalesce(data->>'bio',''),coalesce((data->>'can_discount')::boolean,false),coalesce(nullif(data->>'max_discount_pct','')::numeric,0),data->>'photo_url',coalesce(nullif(data->>'weekly_goal','')::numeric,0),array(select jsonb_array_elements_text(coalesce(data->'specialties','[]')))) returning id into s;
   insert into drabornstyle.db_style_staff_availability(staff_id,business_id) values(s,b);
   insert into drabornstyle.db_style_staff_schedules(business_id,staff_id,weekday,opens,closes) select b,s,d,'09:00'::time,'20:00'::time from generate_series(1,6) d;
   insert into drabornstyle.db_style_staff_services(staff_id,service_id,business_id) select s,id,b from drabornstyle.db_style_services where business_id=b and active;
  else
   update drabornstyle.db_style_staff set user_id=coalesce(target,user_id),name=coalesce(data->>'name',name),specialties=case when data?'specialties' then array(select jsonb_array_elements_text(data->'specialties')) else specialties end,active=coalesce((data->>'active')::boolean,active),can_discount=coalesce((data->>'can_discount')::boolean,can_discount),max_discount_pct=coalesce(nullif(data->>'max_discount_pct','')::numeric,max_discount_pct),weekly_goal=coalesce(nullif(data->>'weekly_goal','')::numeric,weekly_goal),photo_url=coalesce(data->>'photo_url',photo_url),bio=coalesce(data->>'bio',bio) where id=s and business_id=b;
  end if;
  if target is not null then insert into drabornstyle.db_style_business_members(business_id,user_id,role) values(b,target,'staff') on conflict(business_id,user_id) do nothing; end if;
  perform drabornstyle_private.audit(b,action,s,data); return jsonb_build_object('id',s);
 when 'service_save' then
  if not drabornstyle_private.manages(b) then raise exception 'Hizmet yönetme yetkin yok.' using errcode='42501'; end if;
  if v is null then
   insert into drabornstyle.db_style_services(business_id,name,price,duration_minutes,buffer_minutes) values(b,data->>'name',(data->>'price')::numeric,(data->>'duration')::integer,coalesce((data->>'buffer')::integer,0)) returning id into v;
   insert into drabornstyle.db_style_staff_services select id,v,b from drabornstyle.db_style_staff where business_id=b and active;
  else update drabornstyle.db_style_services set name=coalesce(data->>'name',name),price=coalesce((data->>'price')::numeric,price),duration_minutes=coalesce((data->>'duration')::integer,duration_minutes),buffer_minutes=coalesce((data->>'buffer')::integer,buffer_minutes),active=coalesce((data->>'active')::boolean,active) where id=v and business_id=b; end if;
  perform drabornstyle_private.audit(b,action,v,data); return jsonb_build_object('id',v);
 when 'schedule_save' then
  select business_id into b from drabornstyle.db_style_staff where id=s;
  if not drabornstyle_private.manages(b) then raise exception 'Program düzenleme yetkin yok.' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(s::text,0));
  if coalesce((data->>'closed')::boolean,false) then delete from drabornstyle.db_style_staff_schedules where staff_id=s and weekday=(data->>'weekday')::integer;
  else insert into drabornstyle.db_style_staff_schedules(business_id,staff_id,weekday,opens,closes) values(b,s,(data->>'weekday')::integer,(data->>'opens')::time,(data->>'closes')::time) on conflict(staff_id,weekday) do update set opens=excluded.opens,closes=excluded.closes; end if;
  perform drabornstyle_private.wake_waitlist(s);
 when 'staff_services' then
  select business_id into b from drabornstyle.db_style_staff where id=s;
  if not drabornstyle_private.manages(b) then raise exception 'Yetkin yok.' using errcode='42501'; end if;
  if not exists(select 1 from drabornstyle.db_style_services where id=v and business_id=b) then raise exception 'Hizmet bu işletmeye ait değil.'; end if;
  if coalesce((data->>'enabled')::boolean,true) then insert into drabornstyle.db_style_staff_services values(s,v,b) on conflict do nothing; else delete from drabornstyle.db_style_staff_services where staff_id=s and service_id=v; end if;
 when 'status' then
  if not drabornstyle_private.works(s) then raise exception 'Usta yetkin yok.' using errcode='42501'; end if;
  select business_id into b from drabornstyle.db_style_staff where id=s;
  perform pg_advisory_xact_lock(hashtextextended(s::text,0));
  if exists(select 1 from drabornstyle.db_style_service_sessions where staff_id=s and completed_at is null) then raise exception 'Önce aktif hizmeti bitir veya süresini uzat.'; end if;
  src:=data->>'state'; if src not in ('available','busy','break','off') then raise exception 'Çalışma durumu geçersiz.'; end if;
  e:=case when src in ('busy','break') then now()+make_interval(mins=>coalesce((data->>'minutes')::integer,15)) else null end;
  if src in ('busy','break') and (e<=now() or e>now()+interval '12 hours') then raise exception 'Süre 1–720 dakika olmalı.'; end if;
  if src in ('busy','break','off') and exists(select 1 from drabornstyle.db_style_appointments where staff_id=s and status in ('confirmed','late','in_progress') and tstzrange(starts_at,reserved_until,'[)') && tstzrange(now(),coalesce(e,((now() at time zone 'Europe/Istanbul')::date+1)::timestamp at time zone 'Europe/Istanbul'),'[)')) then raise exception 'Onaylı randevun var. Önce müşteriyle randevuyu düzenlemelisin.'; end if;
  update drabornstyle.db_style_staff_availability set state=src,busy_until=e,updated_at=now() where staff_id=s;
  if src='available' then perform drabornstyle_private.wake_waitlist(s); end if;
 when 'block' then
  if not drabornstyle_private.works(s) then raise exception 'Usta yetkin yok.' using errcode='42501'; end if;
  select business_id into b from drabornstyle.db_style_staff where id=s; t:=(data->>'starts_at')::timestamptz;e:=(data->>'ends_at')::timestamptz;
  perform pg_advisory_xact_lock(hashtextextended(s::text,0));
  if exists(select 1 from drabornstyle.db_style_appointments where staff_id=s and status in ('confirmed','late','in_progress') and tstzrange(starts_at,reserved_until,'[)') && tstzrange(t,e,'[)')) then raise exception 'İzin aralığında onaylı randevu var.'; end if;
  insert into drabornstyle.db_style_staff_breaks(business_id,staff_id,starts_at,ends_at,reason) values(b,s,t,e,coalesce(data->>'reason','İzin'));
 when 'slots' then
  select * into sv from drabornstyle.db_style_services where id=v and active;
  if sv.id is null or not exists(select 1 from drabornstyle.db_style_staff_services where staff_id=s and service_id=v and business_id=sv.business_id) then raise exception 'Usta bu hizmeti sunmuyor.'; end if;
  t:=(data->>'date')::date::timestamp at time zone 'Europe/Istanbul';
  if t>now()+interval '90 days' then raise exception 'En fazla 90 gün ileri randevu açılır.'; end if;
  select coalesce(jsonb_agg(g),'[]') into result from generate_series(t,t+interval '1 day'-interval '15 minutes',interval '15 minutes') g where drabornstyle_private.slot_ok(s,g,g+make_interval(mins=>sv.duration_minutes+sv.buffer_minutes)); return result;
 when 'quote' then
  select * into sv from drabornstyle.db_style_services where id=v and active;
  if sv.id is null or not exists(select 1 from drabornstyle.db_style_staff_services where staff_id=s and service_id=v) then raise exception 'Geçersiz hizmet.'; end if;
  src:=coalesce(data->>'source','platform'); if src<>'platform' and not drabornstyle_private.works(s) then raise exception 'Manuel fiyat yetkin yok.' using errcode='42501'; end if;
  select * into cr from drabornstyle.db_style_commission_rules where business_id=sv.business_id; price:=sv.price;
  if nullif(data->>'code','') is null then select rc.code into name from drabornstyle.db_style_customer_referrals m join drabornstyle.db_style_referral_codes rc on rc.id=m.referral_id where m.user_id=u and m.staff_id=s and rc.active and (rc.expires_at is null or rc.expires_at>now()) and (rc.max_uses is null or rc.uses<rc.max_uses); if name is not null then data:=data||jsonb_build_object('code',name); end if; end if;
  if nullif(data->>'code','') is not null then select * into rf from drabornstyle.db_style_referral_codes where upper(code)=upper(data->>'code') and staff_id=s and active and (expires_at is null or expires_at>now()) and (max_uses is null or uses<max_uses) and (customer_user_id is null or customer_user_id=u); if rf.id is null then raise exception 'Kod bu usta için geçerli değil.'; end if; price:=round(price*(1-rf.percent/100),2); end if;
  select case when bs.loyalty_every>0 and (coalesce(l.visits,0)+1)%nullif(bs.loyalty_every,0)=0 then bs.loyalty_percent else 0 end into loyalty_pct from drabornstyle.db_style_business_settings bs left join drabornstyle.db_style_customers cu on cu.business_id=bs.business_id and cu.user_id=u left join drabornstyle.db_style_customer_loyalty l on l.customer_id=cu.id and l.business_id=bs.business_id where bs.business_id=sv.business_id;
  if coalesce(loyalty_pct,0)>0 then price:=least(price,round(sv.price*(1-loyalty_pct/100),2)); end if;
  fee:=case when src=any(cr.sources) then cr.fixed_fee+round((case when cr.discount_affects_commission then price else sv.price end)*cr.percentage/100,2) else 0 end;
  return jsonb_build_object('base_price',sv.price,'service_price',price,'discount',sv.price-price,'platform_fee',fee,'total',price+fee);
 when 'book' then
  select * into sv from drabornstyle.db_style_services where id=v and active;
  if sv.id is null then raise exception 'Hizmet bulunamadı.'; end if; b:=sv.business_id;
  select * into st from drabornstyle.db_style_staff where id=s and business_id=b and active;
  if st.id is null or not exists(select 1 from drabornstyle.db_style_staff_services where staff_id=s and service_id=v) then raise exception 'Usta bu hizmeti sunmuyor.'; end if;
  perform pg_advisory_xact_lock(hashtextextended(s::text,0));
  t:=(data->>'starts_at')::timestamptz; e:=t+make_interval(mins=>sv.duration_minutes+sv.buffer_minutes);
  if t>now()+interval '90 days' or not drabornstyle_private.slot_ok(s,t,e) then raise exception 'Bu saat artık müsait değil. Takvimi yenile.' using errcode='23P01'; end if;
  src:=coalesce(data->>'source','platform'); if src<>'platform' and not drabornstyle_private.works(s) then raise exception 'Manuel randevu yetkin yok.' using errcode='42501'; end if;
  select * into cr from drabornstyle.db_style_commission_rules where business_id=b; price:=sv.price;
  if nullif(data->>'code','') is null then select rc.code into name from drabornstyle.db_style_customer_referrals m join drabornstyle.db_style_referral_codes rc on rc.id=m.referral_id where m.user_id=u and m.staff_id=s and rc.active and (rc.expires_at is null or rc.expires_at>now()) and (rc.max_uses is null or rc.uses<rc.max_uses); if name is not null then data:=data||jsonb_build_object('code',name); end if; end if;
  if nullif(data->>'code','') is not null then
   select * into rf from drabornstyle.db_style_referral_codes where upper(code)=upper(data->>'code') and staff_id=s for update;
   if rf.id is null or not rf.active or (rf.expires_at is not null and rf.expires_at<=now()) or (rf.max_uses is not null and rf.uses>=rf.max_uses) or (rf.customer_user_id is not null and rf.customer_user_id<>u) then raise exception 'İndirim kodu kullanılamıyor.'; end if;
   price:=round(price*(1-rf.percent/100),2); update drabornstyle.db_style_referral_codes set uses=uses+1 where id=rf.id;
  end if;
  name:=case when src='platform' then (select display_name from drabornstyle.db_style_profiles where id=u) else coalesce(nullif(data->>'customer_name',''),'Misafir') end;
  if src='platform' then insert into drabornstyle.db_style_customers(business_id,staff_id,user_id,name) values(b,s,u,name) on conflict(business_id,user_id) where user_id is not null do update set name=excluded.name returning id into c;
  else insert into drabornstyle.db_style_customers(business_id,staff_id,name,phone) values(b,s,name,data->>'phone') returning id into c; end if;
  select case when bs.loyalty_every>0 and (coalesce(l.visits,0)+1)%nullif(bs.loyalty_every,0)=0 then bs.loyalty_percent else 0 end into loyalty_pct from drabornstyle.db_style_business_settings bs left join drabornstyle.db_style_customers cu on cu.business_id=bs.business_id and cu.user_id=u left join drabornstyle.db_style_customer_loyalty l on l.customer_id=cu.id and l.business_id=bs.business_id where bs.business_id=sv.business_id;
  if coalesce(loyalty_pct,0)>0 then price:=least(price,round(sv.price*(1-loyalty_pct/100),2)); end if;
  fee:=case when src=any(cr.sources) then cr.fixed_fee+round((case when cr.discount_affects_commission then price else sv.price end)*cr.percentage/100,2) else 0 end;
  if data ? 'expected_total' and round((data->>'expected_total')::numeric,2)<>price+fee then raise exception 'Fiyat güncellendi. Önce yeni fiyatı kontrol et.'; end if;
  if data ? 'expected_total' and round((data->>'expected_total')::numeric,2)<>price+fee then raise exception 'Fiyat güncellendi. Önce yeni fiyatı kontrol et.'; end if;
  if data ? 'expected_total' and round((data->>'expected_total')::numeric,2)<>price+fee then raise exception 'Fiyat güncellendi. Önce yeni fiyatı kontrol et.'; end if;
  insert into drabornstyle.db_style_appointments(business_id,staff_id,service_id,customer_id,customer_user_id,customer_name,source,starts_at,ends_at,reserved_until,base_price,service_price,platform_fee,referral_id,commission_fixed,commission_pct,commission_discounted)
  values(b,s,v,c,case when src='platform' then u else null end,name,src,t,t+make_interval(mins=>sv.duration_minutes),e,sv.price,price,fee,rf.id,case when src=any(cr.sources) then cr.fixed_fee else 0 end,case when src=any(cr.sources) then cr.percentage else 0 end,cr.discount_affects_commission) returning id into a;
  if rf.id is not null then insert into drabornstyle.db_style_customer_referrals(user_id,staff_id,referral_id) values(u,s,rf.id) on conflict(user_id,staff_id) do update set referral_id=excluded.referral_id; end if;
  if rf.id is not null then insert into drabornstyle.db_style_customer_referrals(user_id,staff_id,referral_id) values(u,s,rf.id) on conflict(user_id,staff_id) do update set referral_id=excluded.referral_id; end if;
  if rf.id is not null then insert into drabornstyle.db_style_customer_referrals(user_id,staff_id,referral_id) values(u,s,rf.id) on conflict(user_id,staff_id) do update set referral_id=excluded.referral_id; end if;
  insert into drabornstyle.db_style_appointment_events(business_id,appointment_id,actor_id,event) values(b,a,u,'created');
  if src='platform' then insert into drabornstyle.db_style_conversations(business_id,appointment_id,staff_id,customer_user_id) values(b,a,s,u); perform drabornstyle_private.notify(u,b,'appointment','Randevun oluşturuldu',name||' · '||t,'book:'||a,jsonb_build_object('appointment_id',a)); end if;
  perform drabornstyle_private.notify(st.user_id,b,'appointment','Yeni randevu',name||' · '||t,'book:'||a,jsonb_build_object('appointment_id',a));
  perform drabornstyle_private.notify((select owner_id from drabornstyle.db_style_businesses where id=b),b,'appointment','Yeni randevu',name||' · '||t,'book:'||a,jsonb_build_object('appointment_id',a));
  return jsonb_build_object('id',a,'total',price+fee);
 when 'appointment_change' then
  select * into ap from drabornstyle.db_style_appointments where id=a for update;
  if ap.id is null or not drabornstyle_private.appointment_access(a) then raise exception 'Randevu yetkin yok.' using errcode='42501'; end if;
  if ap.status not in ('confirmed','late') then raise exception 'Bu randevu artık değiştirilemez.'; end if;
  b:=ap.business_id;s:=ap.staff_id; perform pg_advisory_xact_lock(hashtextextended(s::text,0));src:=data->>'status';
  if src in ('cancelled','no_show','late') then
   if src in ('late','no_show') and ap.starts_at>now() then raise exception 'Randevu saati henüz gelmedi.'; end if;
   if src<>'cancelled' and not drabornstyle_private.works(s) then raise exception 'Usta yetkisi gerekli.' using errcode='42501'; end if;
   update drabornstyle.db_style_appointments set status=src where id=a;
   if src in ('cancelled','no_show') then update drabornstyle.db_style_location_sessions set revoked_at=now(),latitude=null,longitude=null,distance_km=null,eta_minutes=null where appointment_id=a;
    if ap.referral_id is not null then update drabornstyle.db_style_referral_codes set uses=greatest(0,uses-1) where id=ap.referral_id; end if; perform drabornstyle_private.wake_waitlist(s); end if;
  else
   t:=(data->>'starts_at')::timestamptz;e:=t+(ap.reserved_until-ap.starts_at);
   if not drabornstyle_private.slot_ok(s,t,e,a) then raise exception 'Yeni saat müsait değil.'; end if;
   update drabornstyle.db_style_appointments set starts_at=t,ends_at=t+(ap.ends_at-ap.starts_at),reserved_until=e where id=a;
  end if;
  insert into drabornstyle.db_style_appointment_events(business_id,appointment_id,actor_id,event,data) values(b,a,u,coalesce(src,'rescheduled'),data);
  perform drabornstyle_private.notify(ap.customer_user_id,b,'appointment','Randevun güncellendi',coalesce(src,'Yeni tarih seçildi'),'change:'||a||':'||clock_timestamp());
  perform drabornstyle_private.notify((select user_id from drabornstyle.db_style_staff where id=s),b,'appointment','Randevu güncellendi',ap.customer_name,'change:'||a||':'||clock_timestamp());
 when 'waitlist','availability_request' then
  select business_id into b from drabornstyle.db_style_staff where id=s and active; if b is null then raise exception 'Usta bulunamadı.'; end if;
  t:=(data->>'starts_at')::timestamptz;e:=(data->>'ends_at')::timestamptz; if t<now() or e>now()+interval '90 days' or e<=t then raise exception 'Tarih aralığı geçersiz.'; end if;
  if action='waitlist' then
   if not exists(select 1 from drabornstyle.db_style_staff_services where staff_id=s and service_id=v and business_id=b) then raise exception 'Hizmet bulunamadı.'; end if;
   insert into drabornstyle.db_style_waitlists(business_id,staff_id,service_id,user_id,starts_at,ends_at) values(b,s,v,u,t,e);
  else insert into drabornstyle.db_style_availability_requests(business_id,staff_id,user_id,starts_at,ends_at,message) values(b,s,u,t,e,coalesce(data->>'message','')) returning id into x;
   perform drabornstyle_private.notify((select owner_id from drabornstyle.db_style_businesses where id=b),b,'availability','Müsaitlik talebi geldi',data->>'message','request:'||x); end if;
 when 'availability_reply' then
  select business_id,staff_id,user_id into b,s,target from drabornstyle.db_style_availability_requests where id=(data->>'id')::uuid;
  if not drabornstyle_private.manages(b) then raise exception 'Yetkin yok.' using errcode='42501'; end if;
  update drabornstyle.db_style_availability_requests set status=data->>'status' where id=(data->>'id')::uuid;
  perform drabornstyle_private.notify(target,b,'availability','Müsaitlik talebin yanıtlandı',coalesce(data->>'message','Takvimi kontrol edebilirsin.'),'reply:'||(data->>'id')||':'||clock_timestamp());
 when 'start' then
  if a is not null then select * into ap from drabornstyle.db_style_appointments where id=a for update; s:=ap.staff_id; v:=ap.service_id; b:=ap.business_id; end if;
  if not drabornstyle_private.works(s) then raise exception 'Tıraş başlatma yetkin yok.' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(s::text,0));
  if exists(select 1 from drabornstyle.db_style_service_sessions where staff_id=s and completed_at is null) then raise exception 'Ustanın devam eden hizmeti var.'; end if;
  select * into sv from drabornstyle.db_style_services where id=v and active;
  select * into st from drabornstyle.db_style_staff where id=s; b:=st.business_id;
  if sv.business_id is distinct from b or not exists(select 1 from drabornstyle.db_style_staff_services where staff_id=s and service_id=v) then raise exception 'Hizmet bu ustaya ait değil.'; end if;
  t:=now();e:=t+make_interval(mins=>sv.duration_minutes+sv.buffer_minutes);
  if a is not null then
   if ap.status not in ('confirmed','late') or ap.starts_at>now()+interval '30 minutes' then raise exception 'Randevu başlangıcına henüz var.'; end if;
  else
   src:=coalesce(data->>'source','walk_in'); if src='platform' then raise exception 'Platform müşterisi için randevu seç.'; end if;
   c:=nullif(data->>'customer_id','')::uuid; if c is not null then select name,user_id into name,target from drabornstyle.db_style_customers where id=c and business_id=b and (staff_id=s or drabornstyle_private.manages(b) or exists(select 1 from drabornstyle.db_style_service_sessions prior where prior.customer_id=c and prior.staff_id=s)); if name is null then raise exception 'Müşteri kaydı erişilebilir değil.'; end if;
   else name:=coalesce(nullif(data->>'customer_name',''),'Misafir'); insert into drabornstyle.db_style_customers(business_id,staff_id,name) values(b,s,name) returning id into c; end if;
   select * into cr from drabornstyle.db_style_commission_rules where business_id=b;
   fee:=case when src=any(cr.sources) then cr.fixed_fee+round(sv.price*cr.percentage/100,2) else 0 end;
   insert into drabornstyle.db_style_appointments(business_id,staff_id,service_id,customer_id,customer_user_id,customer_name,source,starts_at,ends_at,reserved_until,base_price,service_price,platform_fee,commission_fixed,commission_pct,commission_discounted)
   values(b,s,v,c,target,name,src,t,t+make_interval(mins=>sv.duration_minutes),e,sv.price,sv.price,fee,case when src=any(cr.sources) then cr.fixed_fee else 0 end,case when src=any(cr.sources) then cr.percentage else 0 end,cr.discount_affects_commission) returning * into ap;a:=ap.id;
  end if;
  if exists(select 1 from drabornstyle.db_style_appointments z where z.staff_id=s and z.id<>a and z.status in ('confirmed','late','in_progress') and tstzrange(z.starts_at,z.reserved_until,'[)') && tstzrange(t,e,'[)')) then raise exception 'Bu hizmet sonraki randevu ile çakışıyor.'; end if;
  if exists(select 1 from drabornstyle.db_style_staff_breaks br where br.staff_id=s and tstzrange(br.starts_at,br.ends_at,'[)') && tstzrange(t,e,'[)')) then raise exception 'Bu aralıkta izin veya mola kaydı var.'; end if;
  update drabornstyle.db_style_appointments set status='in_progress',starts_at=t,ends_at=t+make_interval(mins=>sv.duration_minutes),reserved_until=e where id=a;
  insert into drabornstyle.db_style_service_sessions(business_id,appointment_id,staff_id,customer_id,customer_user_id,service_id,source,estimated_end,base_price,service_price,discount,platform_fee)
   values(b,a,s,ap.customer_id,ap.customer_user_id,v,ap.source,t+make_interval(mins=>sv.duration_minutes),ap.base_price,ap.service_price,ap.base_price-ap.service_price,ap.platform_fee) returning id into x;
  update drabornstyle.db_style_staff_availability set state='working',busy_until=e,updated_at=now() where staff_id=s;
  insert into drabornstyle.db_style_appointment_events(business_id,appointment_id,actor_id,event) values(b,a,u,'started');return jsonb_build_object('id',x);
 when 'extend' then
  select * into se from drabornstyle.db_style_service_sessions where id=(data->>'session_id')::uuid for update;
  if se.id is null or se.completed_at is not null or not drabornstyle_private.works(se.staff_id) then raise exception 'Aktif hizmet yetkin yok.' using errcode='42501'; end if;
  s:=se.staff_id;b:=se.business_id;perform pg_advisory_xact_lock(hashtextextended(s::text,0));
  if (data->>'minutes')::integer not between 1 and 120 then raise exception '1–120 dakika seç.'; end if;
  e:=greatest(se.estimated_end,now())+make_interval(mins=>(data->>'minutes')::integer);
  select * into ap from drabornstyle.db_style_appointments where id=se.appointment_id;
  update drabornstyle.db_style_appointments set ends_at=e,reserved_until=e+(ap.reserved_until-ap.ends_at) where id=ap.id;
  update drabornstyle.db_style_service_sessions set estimated_end=e where id=se.id;
  update drabornstyle.db_style_staff_availability set busy_until=e+(ap.reserved_until-ap.ends_at),updated_at=now() where staff_id=s;
  perform drabornstyle_private.audit(b,action,se.id,data);
 when 'finish' then
  select * into se from drabornstyle.db_style_service_sessions where id=(data->>'session_id')::uuid for update;
  if se.id is null or not drabornstyle_private.works(se.staff_id) then raise exception 'Hizmeti tamamlama yetkin yok.' using errcode='42501'; end if;
  if se.completed_at is not null then return jsonb_build_object('id',se.id,'already_completed',true); end if;
  s:=se.staff_id;b:=se.business_id;perform pg_advisory_xact_lock(hashtextextended(s::text,0)); select * into st from drabornstyle.db_style_staff where id=s;
  select * into ap from drabornstyle.db_style_appointments where id=se.appointment_id; price:=round(coalesce((data->>'price')::numeric,se.service_price),2);
  if price<0 or price>se.service_price then raise exception 'Fiyat 0 ile onaylı hizmet fiyatı arasında olmalı.'; end if;
  if price<se.service_price and not drabornstyle_private.manages(b) and (not st.can_discount or (se.service_price-price)/nullif(se.service_price,0)*100>st.max_discount_pct) then raise exception 'İndirim yetkisi veya limiti yetersiz.' using errcode='42501'; end if;
  if price<se.service_price and length(coalesce(data->>'reason',''))<2 then raise exception 'İndirim nedeni gerekli.'; end if;
  fee:=ap.commission_fixed+round((case when ap.commission_discounted then price else se.base_price end)*ap.commission_pct/100,2);total:=price+fee;
  remaining:=round(coalesce((data->>'collected')::numeric,total),2);if remaining<0 or remaining>total then raise exception 'Tahsil edilen tutar geçersiz.'; end if;
  if price<se.service_price then insert into drabornstyle.db_style_discounts(business_id,session_id,actor_id,old_price,new_price,amount,reason) values(b,se.id,u,se.service_price,price,se.service_price-price,data->>'reason'); end if;
  update drabornstyle.db_style_service_sessions set completed_at=now(),service_price=price,discount=base_price-price,discount_reason=data->>'reason',discounted_by=case when price<se.service_price then u else null end,platform_fee=fee,payment_method=coalesce(data->>'method','cash'),collected=remaining where id=se.id;
  update drabornstyle.db_style_appointments set status='completed',service_price=price,platform_fee=fee where id=ap.id;
  insert into drabornstyle.db_style_commission_ledger(business_id,staff_id,session_id,amount,source) values(b,s,se.id,fee,se.source) on conflict(session_id) do nothing;
  update drabornstyle.db_style_business_balances set accrued=accrued+fee,updated_at=now() where business_id=b;
  select buffer_minutes into count_repeat from drabornstyle.db_style_services where id=se.service_id;
  select least(now()+make_interval(mins=>count_repeat),coalesce(min(starts_at),'infinity'::timestamptz)) into e from drabornstyle.db_style_appointments where staff_id=s and status in ('confirmed','late') and starts_at>now();
  if count_repeat>0 and e>now() then
   insert into drabornstyle.db_style_staff_breaks(business_id,staff_id,starts_at,ends_at,reason) values(b,s,now(),e,'Hizmet sonrası hazırlık');
   update drabornstyle.db_style_staff_availability set state='busy',busy_until=e,updated_at=now() where staff_id=s;
  else update drabornstyle.db_style_staff_availability set state='available',busy_until=null,updated_at=now() where staff_id=s; end if;
  insert into drabornstyle.db_style_customer_loyalty(business_id,customer_id,visits,last_visit) values(b,se.customer_id,1,now()) on conflict(business_id,customer_id) do update set visits=drabornstyle.db_style_customer_loyalty.visits+1,last_visit=now();
  update drabornstyle.db_style_location_sessions set revoked_at=now(),latitude=null,longitude=null,distance_km=null,eta_minutes=null where appointment_id=ap.id;
  insert into drabornstyle.db_style_appointment_events(business_id,appointment_id,actor_id,event,data) values(b,ap.id,u,'completed',jsonb_build_object('service_price',price,'fee',fee,'collected',remaining));
  perform drabornstyle_private.audit(b,action,se.id,jsonb_build_object('base',se.base_price,'price',price,'fee',fee,'collected',remaining));perform drabornstyle_private.wake_waitlist(s);
  return jsonb_build_object('id',se.id,'service_price',price,'platform_fee',fee,'total',total);
 when 'commission_rule' then
  if exists(select 1 from jsonb_array_elements_text(coalesce(data->'sources','["platform"]')) val where val not in ('platform','walk_in','phone','private')) then raise exception 'Müşteri kaynağı geçersiz.'; end if;
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  update drabornstyle.db_style_commission_rules set fixed_fee=(data->>'fee')::numeric,percentage=coalesce((data->>'percent')::numeric,0),sources=array(select jsonb_array_elements_text(coalesce(data->'sources','["platform"]'))),discount_affects_commission=coalesce((data->>'discount_affects')::boolean,false),updated_at=now() where business_id=b;
  perform drabornstyle_private.audit(b,action,b,data);
 when 'payment_schedule' then
  if not drabornstyle_private.manages(b) then raise exception 'Yetkin yok.' using errcode='42501'; end if;
  update drabornstyle.db_style_payment_schedules set period=data->>'period',payment_day=(data->>'day')::integer,next_due=(data->>'next_due')::date where business_id=b;
 when 'payment_submit' then
  if not drabornstyle_private.manages(b) then raise exception 'Ödeme bildirme yetkin yok.' using errcode='42501'; end if;
  key:=(data->>'key')::uuid;
  select * into pr from drabornstyle.db_style_payment_requests where idempotency_key=key;
  if pr.id is not null then if pr.business_id<>b then raise exception 'İşlem anahtarı kullanıldı.'; end if; return jsonb_build_object('id',pr.id); end if;
  perform 1 from drabornstyle.db_style_commission_ledger where id=x for update;price:=round((data->>'amount')::numeric,2);select balance into total from drabornstyle.db_style_business_balances where business_id=b;
  if price<=0 or price>total then raise exception 'Ödeme pozitif olmalı ve kalan borcu aşmamalı.'; end if;
  insert into drabornstyle.db_style_payment_requests(business_id,amount,method,paid_at,submitted_by,idempotency_key,note) values(b,price,data->>'method',(data->>'paid_at')::timestamptz,u,key,data->>'note') returning id into x;
  for r in select user_id from drabornstyle.db_style_admin_users where active loop perform drabornstyle_private.notify(r.user_id,b,'payment','Ödeme bildirimi geldi',price||' TL · Yönetici kontrolü bekliyor','payment:'||x); end loop;
  perform drabornstyle_private.audit(b,action,x,data);return jsonb_build_object('id',x);
 when 'payment_review' then
  if not drabornstyle_private.is_admin() then raise exception 'Admin yetkisi gerekli.' using errcode='42501'; end if;
  select * into pr from drabornstyle.db_style_payment_requests where id=(data->>'id')::uuid for update;
  if pr.id is null then raise exception 'Ödeme bulunamadı.'; end if;b:=pr.business_id;src:=data->>'status';
  if pr.status in ('approved','rejected') then return jsonb_build_object('id',pr.id,'status',pr.status); end if;
  if src not in ('approved','rejected','reviewing') then raise exception 'Ödeme durumu geçersiz.'; end if;
  if src='approved' then
   select balance into total from drabornstyle.db_style_business_balances where business_id=b for update;
   if pr.amount>total then raise exception 'Ödeme güncel borcu aşıyor; önce bildirimi kontrol et.'; end if;remaining:=pr.amount;
   for r in select * from drabornstyle.db_style_commission_ledger where business_id=b and amount>paid order by created_at,id for update loop
    exit when remaining<=0;portion:=least(remaining,r.amount-r.paid);
    insert into drabornstyle.db_style_payment_allocations(business_id,request_id,ledger_id,amount) values(b,pr.id,r.id,portion);
    update drabornstyle.db_style_commission_ledger set paid=paid+portion,state=case when paid+portion=amount then 'paid' else 'partial' end where id=r.id;
    remaining:=remaining-portion;
   end loop;
   if remaining<>0 then raise exception 'Ödeme dağıtımı tutarsız.'; end if;
   update drabornstyle.db_style_business_balances set paid=paid+pr.amount,updated_at=now() where business_id=b;
  end if;
  update drabornstyle.db_style_payment_requests set status=src,reviewed_by=u,reviewed_at=now(),note=coalesce(data->>'note',note) where id=pr.id;
  perform drabornstyle_private.audit(b,action,pr.id,jsonb_build_object('status',src,'amount',pr.amount));
  perform drabornstyle_private.notify(pr.submitted_by,b,'payment','Ödeme bildirimi güncellendi',src||' · '||pr.amount||' TL','review:'||pr.id||':'||src);
 when 'referral_create' then
  if not drabornstyle_private.works(s) then raise exception 'Usta yetkin yok.' using errcode='42501'; end if;
  select * into st from drabornstyle.db_style_staff where id=s;b:=st.business_id;pct:=(data->>'percent')::numeric;
  if not drabornstyle_private.manages(b) and (not st.can_discount or pct>st.max_discount_pct) then raise exception 'Kod indirim yetkin yetersiz.' using errcode='42501'; end if;
  if data->>'code' !~ '^[A-Za-z0-9]{3,24}$' then raise exception 'Kod 3–24 harf veya rakam olmalı.'; end if;
  insert into drabornstyle.db_style_referral_codes(business_id,staff_id,code,percent,expires_at,max_uses,customer_user_id) values(b,s,upper(data->>'code'),pct,nullif(data->>'expires_at','')::timestamptz,nullif(data->>'max_uses','')::integer,nullif(data->>'customer_user_id','')::uuid);
 when 'message' then
  conv:=(data->>'conversation_id')::uuid;if not drabornstyle_private.chat_access(conv) then raise exception 'Sohbet yetkin yok.' using errcode='42501'; end if;
  select business_id,staff_id,customer_user_id into b,s,target from drabornstyle.db_style_conversations where id=conv;
  if exists(select 1 from drabornstyle.db_style_conversations where id=conv and blocked) then raise exception 'Bu sohbet engellendi.'; end if;
  if (select count(*) from drabornstyle.db_style_messages where sender_id=u and created_at>now()-interval '1 minute')>30 then raise exception 'Biraz bekleyip tekrar dene.'; end if;
  insert into drabornstyle.db_style_messages(business_id,conversation_id,sender_id,body,client_id) values(b,conv,u,trim(data->>'body'),(data->>'key')::uuid) on conflict(client_id) do nothing returning id into x;
  if x is not null then
   if target=u then target:=(select user_id from drabornstyle.db_style_staff where id=s); end if;
   perform drabornstyle_private.notify(target,b,'message','Yeni mesaj',left(data->>'body',100),'message:'||x,jsonb_build_object('conversation_id',conv));
   if not exists(select 1 from drabornstyle.db_style_staff_schedules sc where sc.staff_id=s and sc.weekday=extract(dow from now() at time zone 'Europe/Istanbul') and (now() at time zone 'Europe/Istanbul')::time between sc.opens and sc.closes) and exists(select 1 from drabornstyle.db_style_conversations where id=conv and customer_user_id=u) then perform drabornstyle_private.notify(u,b,'message','Mesai dışında',coalesce((select auto_reply from drabornstyle.db_style_business_settings where business_id=b),'En kısa sürede yanıt vereceğiz.'),'auto:'||conv||':'||(now() at time zone 'Europe/Istanbul')::date); end if;
  end if;
 when 'chat_read','typing','chat_block' then
  conv:=(data->>'conversation_id')::uuid;if not drabornstyle_private.chat_access(conv) then raise exception 'Sohbet yetkin yok.' using errcode='42501'; end if;
  if action='chat_read' then update drabornstyle.db_style_messages set read_at=now() where conversation_id=conv and sender_id<>u and read_at is null;
  elsif action='typing' then insert into drabornstyle.db_style_conversation_presence(conversation_id,user_id,typing_until) values(conv,u,now()+interval '6 seconds') on conflict(conversation_id,user_id) do update set typing_until=excluded.typing_until,updated_at=now();
  else update drabornstyle.db_style_conversations set blocked=coalesce((data->>'blocked')::boolean,true) where id=conv; end if;
 when 'location_consent','location_update','location_revoke' then
  select * into ap from drabornstyle.db_style_appointments where id=a;
  if ap.customer_user_id is distinct from u then raise exception 'Konum yetkin yok.' using errcode='42501'; end if;b:=ap.business_id;
  if action='location_revoke' then update drabornstyle.db_style_location_sessions set revoked_at=now(),latitude=null,longitude=null,distance_km=null,eta_minutes=null where appointment_id=a and user_id=u;
  else
   if ap.status not in ('confirmed','late') or ap.starts_at>now()+interval '2 hours' or ap.starts_at<now()-interval '2 hours' then raise exception 'Varış takibi randevudan iki saat önce ve sonraki iki saat içinde açılabilir.'; end if;
   if action='location_consent' then insert into drabornstyle.db_style_location_sessions(business_id,appointment_id,user_id,consent_at,expires_at) values(b,a,u,now(),least(now()+interval '2 hours',ap.starts_at+interval '2 hours')) on conflict(appointment_id) do update set consent_at=now(),revoked_at=null,expires_at=excluded.expires_at;
   else
    if not exists(select 1 from drabornstyle.db_style_location_sessions where appointment_id=a and user_id=u and revoked_at is null and expires_at>now()) then raise exception 'Aktif konum izni yok.'; end if;
    select 6371*2*asin(sqrt(power(sin(radians((latitude-(data->>'latitude')::numeric)::double precision)/2),2)+cos(radians(latitude::double precision))*cos(radians((data->>'latitude')::double precision))*power(sin(radians((longitude-(data->>'longitude')::numeric)::double precision)/2),2))) into total from drabornstyle.db_style_businesses where id=b;
    update drabornstyle.db_style_location_sessions set latitude=(data->>'latitude')::numeric,longitude=(data->>'longitude')::numeric,accuracy=(data->>'accuracy')::numeric,distance_km=total,eta_minutes=case when total is not null then ceil(total/25*60)::integer else null end,updated_at=now() where appointment_id=a;
   end if;
  end if;
 when 'review' then
  select * into ap from drabornstyle.db_style_appointments where id=a;
  if ap.customer_user_id is distinct from u or ap.status<>'completed' then raise exception 'Yalnızca aldığın hizmeti değerlendirebilirsin.'; end if;
  insert into drabornstyle.db_style_reviews(business_id,appointment_id,staff_id,user_id,rating,body) values(ap.business_id,a,ap.staff_id,u,(data->>'rating')::integer,coalesce(data->>'body','')) on conflict(appointment_id) do update set rating=excluded.rating,body=excluded.body;
 when 'notification_read' then update drabornstyle.db_style_notifications set read_at=now() where user_id=u and (nullif(data->>'id','') is null or id=(data->>'id')::uuid);
 when 'customer_note' then
  c:=(data->>'customer_id')::uuid;
  select business_id into b from drabornstyle.db_style_customers where id=c;
  if s is null then select staff_id into s from drabornstyle.db_style_customers where id=c; end if;
  if not drabornstyle_private.works(s) or not exists(select 1 from drabornstyle.db_style_staff where id=s and business_id=b) then raise exception 'Müşteri notu yetkin yok.' using errcode='42501'; end if;
  if not drabornstyle_private.manages(b) and not exists(select 1 from drabornstyle.db_style_customers where id=c and staff_id=s) and not exists(select 1 from drabornstyle.db_style_service_sessions where customer_id=c and staff_id=s) then raise exception 'Bu müşteriye hizmet kaydın yok.'; end if;
  insert into drabornstyle.db_style_customer_notes(business_id,customer_id,staff_id,author_id,note) values(b,c,s,u,data->>'note');

 when 'queue_add' then
  select business_id into b from drabornstyle.db_style_staff where id=s and active;
  if b is null or not exists(select 1 from drabornstyle.db_style_businesses where id=b and status='active') or not exists(select 1 from drabornstyle.db_style_staff_services where staff_id=s and service_id=v) then raise exception 'Usta/hizmet bulunamadı.'; end if;
  if exists(select 1 from drabornstyle.db_style_queue where staff_id=s and customer_user_id=u and state='waiting') then raise exception 'Bu ustanın sırasında zaten bekliyorsun.'; end if;
  insert into drabornstyle.db_style_queue(business_id,staff_id,service_id,customer_user_id,customer_name) values(b,s,v,case when drabornstyle_private.works(s) then null else u end,coalesce(data->>'name',(select display_name from drabornstyle.db_style_profiles where id=u)));
 when 'queue_change' then
  select business_id,staff_id,customer_user_id into b,s,target from drabornstyle.db_style_queue where id=(data->>'id')::uuid;
  if not drabornstyle_private.works(s) and target is distinct from u then raise exception 'Sıra yetkin yok.' using errcode='42501'; end if;
  if data->>'state'='started' and not drabornstyle_private.works(s) then raise exception 'Usta yetkisi gerekli.'; end if;
  update drabornstyle.db_style_queue set state=data->>'state' where id=(data->>'id')::uuid;
 when 'settings' then
  if not drabornstyle_private.manages(b) then raise exception 'Yetkin yok.' using errcode='42501'; end if;
  update drabornstyle.db_style_business_settings set loyalty_every=coalesce((data->>'loyalty_every')::integer,loyalty_every),loyalty_percent=coalesce((data->>'loyalty_percent')::numeric,loyalty_percent),auto_reply=coalesce(data->>'auto_reply',auto_reply) where business_id=b;
 when 'expense' then
  if not drabornstyle_private.manages(b) then raise exception 'Gider yetkin yok.' using errcode='42501'; end if;
  insert into drabornstyle.db_style_expenses(business_id,amount,category,note,actor_id) values(b,(data->>'amount')::numeric,data->>'category',data->>'note',u);
 when 'support' then insert into drabornstyle.db_style_support_requests(user_id,business_id,kind,body) values(u,b,coalesce(data->>'kind','support'),data->>'body');
 when 'data_delete' then
  insert into drabornstyle.db_style_support_requests(user_id,kind,body) values(u,'data_delete','DraBornStyle kişisel verilerimin silinmesini talep ediyorum.');
  update drabornstyle.db_style_location_sessions set revoked_at=now(),latitude=null,longitude=null,distance_km=null,eta_minutes=null where user_id=u;
 when 'recall' then
  if not drabornstyle_private.works(s) then raise exception 'Usta yetkin yok.' using errcode='42501'; end if;
  select business_id into b from drabornstyle.db_style_staff where id=s;
  for r in select cu.user_id,cu.id from drabornstyle.db_style_customers cu join drabornstyle.db_style_profiles p on p.id=cu.user_id join drabornstyle.db_style_customer_loyalty l on l.customer_id=cu.id and l.business_id=cu.business_id where cu.staff_id=s and p.marketing_consent and l.last_visit<now()-make_interval(days=>greatest(7,coalesce((data->>'days')::integer,30))) loop
   perform drabornstyle_private.notify(r.user_id,b,'recall','Yeni bir bakım zamanı',coalesce(data->>'message','Ustanın yeni müsaitliklerini keşfet.'),'recall:'||r.id||':'||(now() at time zone 'Europe/Istanbul')::date);
  end loop;
 else raise exception 'Bilinmeyen işlem: %',action;
 end case;
 return jsonb_build_object('ok',true);
end $$;

-- Deactivating business membership revokes the associated staff account's access.
create or replace function drabornstyle_private.owns_staff(s uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from drabornstyle.db_style_staff st join drabornstyle.db_style_business_members m on m.business_id=st.business_id and m.user_id=st.user_id where st.id=s and st.user_id=auth.uid() and st.active and m.active); $$;
create or replace function drabornstyle_private.works(s uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from drabornstyle.db_style_staff t join drabornstyle.db_style_businesses b on b.id=t.business_id where t.id=s and t.active and b.status='active' and (drabornstyle_private.owns_staff(t.id) or drabornstyle_private.manages(t.business_id))); $$;
drop policy own_admin on drabornstyle.db_style_admin_users;
create policy own_admin on drabornstyle.db_style_admin_users for select to authenticated using(user_id=(select auth.uid()) or drabornstyle_private.is_admin());
notify pgrst,'reload schema';
