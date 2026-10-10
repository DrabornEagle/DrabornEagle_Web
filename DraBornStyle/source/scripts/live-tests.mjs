import {createClient} from '@supabase/supabase-js';
import {createInterface} from 'node:readline';
const rl=createInterface({input:process.stdin});const credentials=await new Promise(resolve=>rl.once('line',l=>{rl.close();resolve(JSON.parse(l));}));
const url='https://xpdiwyxnnrmyvpcqwuyb.supabase.co',key='sb_publishable_cu71JQGPiRusMw_YeZzUbg_6r9r13TG';
const options={db:{schema:'drabornstyle'},auth:{persistSession:false,autoRefreshToken:false}};
const a=createClient(url,key,options),b=createClient(url,key,options);let fixture;const results=[];
async function rpc(client,action,data={}){const r=await client.rpc('api',{action,data});if(r.error)throw new Error(action+': '+r.error.message);return r.data;}
const assert=(name,pass)=>{results.push({name,passed:!!pass});if(!pass)throw new Error('FAILED: '+name);};
try{
 const login=await a.auth.signInWithPassword(credentials);if(login.error)throw login.error;await b.auth.setSession(login.data.session);await rpc(a,'profile');
 fixture=(await rpc(a,'business_create',{name:'QA Automated '+Date.now(),address:'Geçici test kaydı; otomatik temizlenecek',city:'TEST'})).id;
 console.log(JSON.stringify({fixture_id:fixture}));
 await rpc(a,'business_status',{business_id:fixture,status:'active'});
 const staff=(await rpc(a,'staff_save',{business_id:fixture,name:'QA Test Usta',email:credentials.email})).id;
 const service=(await rpc(a,'service_save',{business_id:fixture,name:'QA Hizmet',price:350,duration:30,buffer:0})).id;
 const date=new Date(Date.now()+86400000).toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'});const start=new Date(date+'T10:00:00+03:00').toISOString();
 await rpc(a,'schedule_save',{staff_id:staff,weekday:new Date(start).getUTCDay(),opens:'09:00',closes:'20:00'});
 let changed=0,working=0;const channel=b.channel('qa-style-'+fixture).on('postgres_changes',{event:'INSERT',schema:'drabornstyle',table:'db_style_appointments',filter:'business_id=eq.'+fixture},()=>changed++).on('postgres_changes',{event:'UPDATE',schema:'drabornstyle',table:'db_style_staff_availability',filter:'business_id=eq.'+fixture},p=>{if(p.new.state==='working')working++;});
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Realtime subscribe timeout')),15000);channel.subscribe(s=>{if(s==='SUBSCRIBED'){clearTimeout(timer);resolve();}if(s==='CHANNEL_ERROR'){clearTimeout(timer);reject(new Error('Realtime channel error'));}});});
 const simultaneous=await Promise.all([a.rpc('api',{action:'book',data:{staff_id:staff,service_id:service,starts_at:start,expected_total:370}}),b.rpc('api',{action:'book',data:{staff_id:staff,service_id:service,starts_at:start,expected_total:370}})]);
 assert('İki eşzamanlı API rezervasyonunda yalnızca biri başarılı',simultaneous.filter(r=>!r.error).length===1);
 const id=simultaneous.find(r=>!r.error).data.id;
 const read=await b.from('db_style_appointments').select('id').eq('id',id);assert('Diğer istemci sunucu randevusunu okuyabiliyor',read.data?.length===1);
 await rpc(a,'appointment_change',{appointment_id:id,status:'cancelled'});
 await rpc(a,'commission_rule',{business_id:fixture,fee:20,sources:['platform','walk_in']});
 const se=(await rpc(a,'start',{staff_id:staff,service_id:service,source:'walk_in',customer_name:'QA müşteri'})).id;
 await new Promise(resolve=>setTimeout(resolve,1800));assert('Randevu diğer istemcide Realtime olayına dönüşüyor',changed>0);assert('Tıraş başlama diğer istemcide canlı çalışma durumu oluşturuyor',working>0);
 await rpc(a,'finish',{session_id:se,price:300,reason:'QA indirim',method:'cash'});
 const fresh=await b.from('db_style_service_sessions').select('service_price,platform_fee').eq('id',se);assert('İkinci istemci tamamlanan fiyat ve bedeli doğru okuyor',fresh.data?.[0]?.service_price===300&&fresh.data?.[0]?.platform_fee===20);
 const dashboard=await b.rpc('dashboard',{date_from:'2020-01-01',date_to:'2030-01-01'});assert('Gerçek sunucu raporları veri üretiyor',!dashboard.error&&dashboard.data.services.count>=1);
 await b.removeChannel(channel);console.log(JSON.stringify({results}));
}catch(e){console.log(JSON.stringify({error:e.message,results,fixture_id:fixture}));process.exitCode=1;}finally{await a.removeAllChannels();await b.removeAllChannels();}
