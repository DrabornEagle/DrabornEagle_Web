drop policy location_read on drabornstyle.db_style_location_sessions;
create policy location_read on drabornstyle.db_style_location_sessions for select to authenticated using (
 user_id=(select auth.uid()) or (
 revoked_at is null and expires_at>now()
 and exists(select 1 from drabornstyle.db_style_appointments a where a.id=appointment_id and a.status in ('confirmed','late','in_progress') and (
  drabornstyle_private.owns_staff(a.staff_id) or exists(select 1 from drabornstyle.db_style_business_members m where m.business_id=a.business_id and m.user_id=(select auth.uid()) and m.active and m.role in ('owner','manager'))
 ))));
drop policy business_read on drabornstyle.db_style_businesses;
create policy business_read on drabornstyle.db_style_businesses for select to authenticated using(drabornstyle_private.manages(id) or owner_id=(select auth.uid()) or exists(select 1 from drabornstyle.db_style_business_members m where m.business_id=id and m.user_id=(select auth.uid()) and m.active));
drop policy directory_read on drabornstyle.db_style_staff_breaks;
create policy break_read on drabornstyle.db_style_staff_breaks for select to authenticated using(drabornstyle_private.manages(business_id) or drabornstyle_private.owns_staff(staff_id));
drop policy customer_read on drabornstyle.db_style_customers;
create policy customer_read on drabornstyle.db_style_customers for select to authenticated using(user_id=(select auth.uid()) or drabornstyle_private.owns_staff(staff_id) or drabornstyle_private.manages(business_id) or exists(select 1 from drabornstyle.db_style_service_sessions s where s.customer_id=db_style_customers.id and drabornstyle_private.owns_staff(s.staff_id)));
notify pgrst,'reload schema';
