import '@expo/metro-runtime';
import React,{useEffect,useRef,useState} from 'react';
import {View,ScrollView,Pressable,StatusBar,useWindowDimensions,SafeAreaView,Platform} from 'react-native';
import {DataProvider,useData,supabase} from './src/data';
import {ThemeProvider,useTheme,Avatar,Badge,Busy,Button,Card,ErrorText,Logo,Row,Stack,T} from './src/ui';
import {Discover} from './src/Discover';
import {Auth} from './src/Auth';
import {Staff} from './src/Staff';
import {Management} from './src/Management';
import {Bookings} from './src/Bookings';
import {Messages} from './src/Messages';
import {Profile} from './src/Profile';
import {Notifications} from './src/Notifications';
import {syncReminders} from './src/notifications';
function Shell(){
 const {session,rows,loading,error,refresh,isAdmin,isManager,realtime}=useData(),{colors,light,toggle}=useTheme(),{width}=useWindowDimensions();const [screen,setScreen]=useState('discover'),[chat,setChat]=useState('');const scroll=useRef<React.ElementRef<typeof ScrollView>>(null);const wide=width>1000;
 const ownStaff=(rows.staff||[]).some(s=>s.user_id===session?.user.id&&s.active);
 const unread=(rows.notifications||[]).filter(n=>!n.read_at).length;
 const tabs=[{id:'discover',label:'Keşfet',icon:'◇'},{id:'appointments',label:'Randevular',icon:'◷'},{id:'messages',label:'Mesajlar',icon:'↗'},...(ownStaff||isManager?[{id:'staff',label:'Usta paneli',icon:'◈'}]:[]),{id:'management',label:'İşletmem',icon:'▤'},...(isAdmin?[{id:'admin',label:'Platform admin',icon:'◉'}]:[]),{id:'notifications',label:'Bildirimler'+(unread?' · '+unread:''),icon:'○'},{id:'profile',label:'Profil',icon:'◎'}];
 const go=(id:string)=>{setScreen(id);scroll.current?.scrollTo({y:0,animated:false});};
 useEffect(()=>{if(!session&&screen!=='discover')go('auth');},[session?.user.id]);
 useEffect(()=>{void syncReminders((rows.appointments||[]).filter(a=>a.customer_user_id===session?.user.id)).catch(()=>{});},[rows.appointments]);
 useEffect(()=>{if(Platform.OS==='web'&&window.location.search.includes('recovery'))go('profile');const {data}=supabase.auth.onAuthStateChange(ev=>{if(ev==='PASSWORD_RECOVERY')go('profile');});return()=>data.subscription.unsubscribe();},[]);
 const nav=(t:{id:string;label:string;icon:string},small=false)=><Pressable key={t.id} accessibilityRole="tab" accessibilityState={{selected:screen===t.id}} onPress={()=>go(session||t.id==='discover'?t.id:'auth')} style={{paddingVertical:small?9:13,paddingHorizontal:small?11:16,borderRadius:13,backgroundColor:screen===t.id?colors.raised:'transparent',borderWidth:screen===t.id?1:0,borderColor:colors.border,flexDirection:'row',alignItems:'center',gap:12,minHeight:45}}><T color={screen===t.id?colors.mint:colors.muted} size={19}>{t.icon}</T><T size={small?11:13} bold={screen===t.id} color={screen===t.id?colors.text:colors.muted}>{t.label}</T></Pressable>;
 const content=screen==='auth'?<Auth onDone={()=>go('discover')}/>:screen==='discover'?<Discover onLogin={()=>go('auth')}/>:!session?<Auth onDone={()=>go('discover')}/>:screen==='appointments'?<Bookings openChat={id=>{setChat(id);go('messages')}}/>:screen==='messages'?<Messages key={chat} initial={chat}/>:screen==='staff'?<Staff/>:screen==='management'?<Management/>:screen==='admin'&&isAdmin?<Management admin/>:screen==='notifications'?<Notifications/>:<Profile/>;
 return <SafeAreaView style={{flex:1,backgroundColor:colors.bg}}><StatusBar barStyle={light?'dark-content':'light-content'}/><View style={{flex:1,flexDirection:'row'}}>
 {wide&&<View style={{width:238,borderRightWidth:1,borderColor:colors.border,padding:22,gap:30}}><Logo small/><View style={{gap:5}}><T size={9} color={colors.muted} style={{letterSpacing:2,padding:14}}>GÜNÜNÜN MERKEZİ</T>{tabs.map(t=>nav(t))}</View><View style={{flex:1}}/><Card style={{padding:15,gap:8}}><Badge title={realtime?'Canlı bağlantı':'Bağlantı kontrolü'} tone={realtime?colors.mint:colors.coral}/><T color={colors.muted} size={10}>Android + Web, aynı çalışma akışı.</T></Card><Button title={light?'Koyu görünüm':'Açık görünüm'} small secondary onPress={toggle}/></View>}
 <View style={{flex:1}}><Row style={{paddingHorizontal:wide?35:19,paddingTop:Platform.OS==='android'?16:14,paddingBottom:15,borderBottomWidth:1,borderColor:colors.border,justifyContent:'space-between'}}>{!wide?<Logo small/>:<View><T size={10} color={colors.muted} style={{letterSpacing:2}}>MODERN BARBER STUDIO</T><T size={14} bold>{session?'Gününü birlikte planlayalım':'Stilin için doğru adres'}</T></View>}<Row>{session?<><Pressable onPress={()=>go('notifications')}><Badge title={unread?'● '+unread+' bildirim':'Bildirimler'} tone={colors.blue}/></Pressable><Pressable onPress={()=>go('profile')}><Avatar name={rows.profiles?.find(p=>p.id===session.user.id)?.display_name||session.user.email||'DS'} size={36}/></Pressable></>:<Button title="Giriş yap" small onPress={()=>go('auth')}/>}</Row></Row>
 <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:wide?34:18,paddingBottom:35,width:'100%',maxWidth:1400,alignSelf:'center'}}>{loading?<Busy/>:<Stack>{error&&<><ErrorText text={error}/><Button title="Bağlantıyı yenile" secondary onPress={()=>void refresh()}/></>}{content}</Stack>}</ScrollView>
 {!wide&&<View style={{backgroundColor:colors.card,borderTopWidth:1,borderColor:colors.border,paddingVertical:7,paddingBottom:Platform.OS==='android'?12:7}}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:10,gap:4}}>{tabs.map(t=>nav(t,true))}</ScrollView></View>}
 </View></View></SafeAreaView>;
}
export default function App(){return <ThemeProvider><DataProvider><Shell/></DataProvider></ThemeProvider>;}
