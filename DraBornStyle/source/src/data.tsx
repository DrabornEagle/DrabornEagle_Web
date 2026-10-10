import 'react-native-url-polyfill/auto';
import { createClient, Session } from '@supabase/supabase-js';
import React,{createContext,useContext,useEffect,useState,useCallback,useRef} from 'react';
import { AppState,Platform } from 'react-native';
import { SUPABASE_URL,SUPABASE_KEY } from './config';
import { sessionStorage } from './storage';
export const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{storage:sessionStorage,storageKey:'drabornstyle-auth',autoRefreshToken:true,persistSession:true,detectSessionInUrl:Platform.OS==='web'},db:{schema:'drabornstyle'}});
export type Row=Record<string,any>;
export const tables=['profiles','admin_users','businesses','business_members','staff','staff_schedules','staff_availability','staff_breaks','services','staff_services','appointments','service_sessions','customers','customer_notes','referral_codes','waitlists','availability_requests','commission_rules','commission_ledger','commission_adjustments','business_balances','payment_schedules','payment_requests','payment_receipts','conversations','messages','conversation_presence','notifications','location_sessions','reviews','customer_loyalty','business_settings','queue','expenses','support_requests','admin_logs'] as const;
export type Table=typeof tables[number];
export type Snapshot=Partial<Record<Table,Row[]>>;
export async function api(action:string,data:Row={}) { const r=await supabase.rpc('api',{action,data}); if(r.error) throw new Error(r.error.message);return r.data; }
export function money(n:any){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(Number(n||0));}
export function dateLabel(d:any){return d?new Date(d).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'—';}
export function clock(d:any){return new Date(d).toLocaleTimeString('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit'});}
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function dayAfter(i:number){const d=new Date(today()+'T12:00:00+03:00');d.setDate(d.getDate()+i);return d.toISOString().slice(0,10);}
export function istanbul(d:string,time='00:00'){return new Date(d+'T'+time+':00+03:00').toISOString();}
export function km(a:number,b:number,c:number,d:number){const r=Math.PI/180;return 6371*2*Math.asin(Math.sqrt(Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2));}
export function statusLabel(s:string){return ({available:'Müsait',working:'Tıraş yapıyor',busy:'Meşgul',break:'Molada',off:'Mesai bitti',confirmed:'Onaylı',late:'Gecikiyor',in_progress:'Devam ediyor',completed:'Tamamlandı',cancelled:'İptal',no_show:'Gelmedi',pending:'Onay bekliyor',active:'Aktif',suspended:'Durduruldu',approved:'Onaylandı',rejected:'Reddedildi',reviewing:'İnceleniyor',waiting:'Bekliyor',started:'Başladı',paid:'Ödendi',accrued:'Tahakkuk etti',partial:'Kısmi ödeme',platform:'Uygulama',walk_in:'Çat kapı',phone:'Telefon',private:'Özel',cash:'Nakit',card:'Kart',transfer:'Banka'} as Row)[s]||s;}
type State={session:Session|null;loading:boolean;directory:Row[];rows:Snapshot;error:string;realtime:boolean;isAdmin:boolean;isManager:boolean;refresh:()=>Promise<void>;act:(action:string,data?:Row)=>Promise<any>;page:(table:Table,offset:number)=>Promise<Row[]>};
const C=createContext<State>(null!);export const useData=()=>useContext(C);
export function DataProvider({children}:{children:React.ReactNode}) {
 const [session,setSession]=useState<Session|null>(null),[loading,setLoading]=useState(true),[directory,setDirectory]=useState<Row[]>([]),[rows,setRows]=useState<Snapshot>({}),[error,setError]=useState(''),[realtime,setRealtime]=useState(false);
 const sessionRef=useRef(session);sessionRef.current=session;const request=useRef(0);const initialized=useRef(false);const oldUser=useRef<string|undefined>(undefined);
 const reload=useCallback(async(names:Table[])=>{const user=sessionRef.current?.user.id;if(!user)return;try{const pairs=await Promise.all(names.map(async t=>{let q=supabase.from('db_style_'+t).select('*').limit(250);if(['notifications','messages','appointments','service_sessions','admin_logs','support_requests'].includes(t))q=q.order('created_at',{ascending:false});const r=await q;if(r.error)throw r.error;return [t,r.data||[]] as const;}));if(sessionRef.current?.user.id===user)setRows(r=>({...r,...Object.fromEntries(pairs)}));}catch(e:any){setError(e.message);}},[]);
 const refresh=useCallback(async()=>{
  const n=++request.current;const current=sessionRef.current;setError('');
  try {
   const d=await supabase.rpc('directory');if(d.error)throw d.error;
   if(n!==request.current)return;setDirectory(d.data||[]);
   if(current){
    const results=await Promise.all(tables.map(async t=>{let q=supabase.from('db_style_'+t).select('*').limit(250);if(['notifications','messages','appointments','service_sessions','admin_logs','support_requests'].includes(t))q=q.order('created_at',{ascending:false});const {data,error}=await q;if(error)throw new Error(t+': '+error.message);return [t,data||[]] as const;}));
    if(n===request.current&&sessionRef.current?.user.id===current.user.id)setRows(Object.fromEntries(results));
   }else if(n===request.current)setRows({});
  }catch(e:any){if(n===request.current)setError(e.message||'Bağlantı kurulamadı.');}finally{if(n===request.current)setLoading(false);}
 },[]);
 useEffect(()=>{
  supabase.auth.getSession().then(({data})=>{sessionRef.current=data.session;setSession(data.session);initialized.current=true;void refresh();});
  const {data}=supabase.auth.onAuthStateChange((_ev,s)=>{sessionRef.current=s;setSession(s);if(oldUser.current!==s?.user.id){oldUser.current=s?.user.id;setRows({});if(initialized.current) setTimeout(()=>void refresh(),0);}});
  return()=>{data.subscription.unsubscribe();};
 },[refresh]);
 useEffect(()=>{
  let debounce:ReturnType<typeof setTimeout>|undefined;const dirty=new Set<Table>();const ch=supabase.channel('db-style:'+ (session?.user.id||'guest'));
  if(session) for(const t of ['appointments','conversations','staff_availability','service_sessions','messages','conversation_presence','notifications','business_balances','payment_requests','location_sessions','queue','availability_requests'] as Table[]) ch.on('postgres_changes',{event:'*',schema:'drabornstyle',table:'db_style_'+t},payload=>{dirty.add(t);if(t==='staff_availability'&&payload.new&&'staff_id' in payload.new){const av=payload.new;setDirectory(d=>d.map(b=>({...b,staff:b.staff.map((s:Row)=>s.id===av.staff_id?{...s,state:av.state,busy_until:av.busy_until}:s)})));}clearTimeout(debounce);debounce=setTimeout(()=>{const names=[...dirty];dirty.clear();void reload(names);},300);});
  if(session)ch.subscribe(status=>setRealtime(status==='SUBSCRIBED'));else setRealtime(false);
  const interval=setInterval(()=>{if(AppState.currentState==='active')void refresh();},60000);
  const app=AppState.addEventListener('change',state=>{if(state==='active'){supabase.auth.startAutoRefresh();void refresh();}else if(Platform.OS!=='web')supabase.auth.stopAutoRefresh();});
  return()=>{clearTimeout(debounce);clearInterval(interval);app.remove();void supabase.removeChannel(ch);};
 },[session?.user.id,refresh,reload]);
 const act=async(action:string,data:Row={})=>{const r=await api(action,data);const affected:Record<string,Table[]>={profile:['profiles'],message:['messages','notifications'],typing:['conversation_presence'],chat_read:['messages'],chat_block:['conversations'],notification_read:['notifications'],status:['staff_availability'],start:['appointments','service_sessions','staff_availability','customers'],extend:['appointments','service_sessions','staff_availability'],finish:['appointments','service_sessions','staff_availability','commission_ledger','commission_adjustments','business_balances','customer_loyalty','staff_breaks','notifications'],appointment_change:['appointments','location_sessions','notifications'],book:['appointments','customers','conversations','notifications','referral_codes'],repeat_book:['appointments','customers','conversations','notifications','referral_codes'],payment_submit:['payment_requests','notifications'],payment_review:['payment_requests','business_balances','commission_ledger','notifications'],location_consent:['location_sessions'],location_revoke:['location_sessions'],queue_add:['queue'],queue_change:['queue'],customer_note:['customer_notes'],referral_create:['referral_codes'],support:['support_requests'],data_delete:['support_requests','location_sessions']};if(affected[action])await reload(affected[action]);else await refresh();return r;};
 const page=async(table:Table,offset:number)=>{const {data,error}=await supabase.from('db_style_'+table).select('*').order('created_at',{ascending:false}).range(offset,offset+99);if(error)throw error;return data||[];};
 const isAdmin=(rows.admin_users||[]).some(r=>r.user_id===session?.user.id&&r.active);
 const isManager=isAdmin||(rows.business_members||[]).some(r=>r.user_id===session?.user.id&&r.active&&['owner','manager'].includes(r.role));
 return <C.Provider value={{session,loading,directory,rows,error,realtime,isAdmin,isManager,refresh,act,page}}>{children}</C.Provider>;
}
