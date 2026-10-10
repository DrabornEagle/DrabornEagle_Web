import React,{useState} from 'react';
import {View,Platform,Linking} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {supabase,useData,api} from './data';
import {Button,Card,Fade,Head,Input,Logo,Row,Stack,T,TaskStatus,useTask,useTheme} from './ui';
import {SITE} from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function Auth({onDone}:{onDone:()=>void}){
 const {refresh}=useData(),{colors}=useTheme(),task=useTask();
 const [mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[code,setCode]=useState(''),[accepted,setAccepted]=useState(false),[marketing,setMarketing]=useState(false);
 const submit=()=>task.run(async()=>{
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))throw new Error('Geçerli bir e-posta adresi yaz.');
  if(mode==='reset'){const r=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:SITE+'?recovery=1'});if(r.error)throw r.error;return true;}
  if(password.length<8)throw new Error('Şifre en az 8 karakter olmalı.');
  if(mode==='register'){
   if(name.trim().length<2||!accepted)throw new Error('Adını yaz ve aydınlatma metni ile kullanım koşullarını incele.');
   const r=await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:SITE,data:{display_name:name.trim()}}});if(r.error)throw r.error;
   if(code)await AsyncStorage.setItem('dbstyle-referral',code.trim().toUpperCase());
   if(!r.data.session)return true;await api('profile',{name:name.trim(),marketing});
  }else{const r=await supabase.auth.signInWithPassword({email:email.trim(),password});if(r.error)throw r.error;await api('profile');}
  await refresh();onDone();return true;
 },mode==='reset'?'Şifre sıfırlama e-postası gönderildi.':mode==='register'?'Hesabın oluşturuldu. Gerekirse e-postandaki doğrulama bağlantısını aç.':'Giriş yapıldı.');
 return <Fade><Stack><LinearGradient colors={['#183448','#111925','#272038']} start={{x:0,y:0}} end={{x:1,y:1}} style={{borderRadius:28,padding:28,gap:22,overflow:'hidden'}}><Logo/><View style={{maxWidth:560,gap:10}}><T size={35} bold color="#f5f8fc">Gününü planla.{ '\n'}Stilini yaşa.</T><T color="#b6c6db">İyi bir usta, net bir fiyat, sana ayrılmış bir saat. Müşteriden işletmeye herkes aynı akışta.</T></View><Row><T color="#54e6cf" size={11}>●  Anlık müsaitlik</T><T color="#ffad96" size={11}>●  Şeffaf fiyat</T><T color="#bda9ff" size={11}>●  Profesyonel yönetim</T></Row></LinearGradient>
 <Card style={{maxWidth:600,width:'100%',alignSelf:'center',padding:26}}><Head eyebrow="DraBornStyle hesabın" title={mode==='login'?'Tekrar hoş geldin':mode==='reset'?'Şifreni yenile':'Yeni bir başlangıç'}/><Row>{['login','register'].map(m=><Button key={m} title={m==='login'?'Giriş yap':'Kayıt ol'} secondary={mode!==m} small onPress={()=>setMode(m)}/>)}</Row>
 {mode==='register'&&<Input label="Adın / kullanıcı adın" value={name} onChangeText={setName}/>}
 <Input label="E-posta" value={email} onChangeText={setEmail} placeholder="sen@ornek.com"/>
 {mode!=='reset'&&<Input label="Şifre" value={password} onChangeText={setPassword} secure/>}
 {mode==='register'&&<><Input label="Ustanın indirim kodu (isteğe bağlı)" value={code} onChangeText={setCode} placeholder="AHMET15"/><Button title={(accepted?'✓ ':'○ ')+'Aydınlatma ve kullanım koşullarını inceledim'} secondary small onPress={()=>setAccepted(!accepted)}/><Button title={(marketing?'✓ ':'○ ')+'Kampanya ve geri çağırma bildirimlerine izin ver'} secondary small onPress={()=>setMarketing(!marketing)}/></>}
 <Button title={mode==='login'?'Giriş yap':mode==='reset'?'Sıfırlama bağlantısı gönder':'Hesabımı oluştur'} disabled={task.busy} onPress={submit}/>{Platform.OS==='web'&&mode==='login'&&<Button title="Google ile giriş yap" secondary onPress={()=>task.run(async()=>{const r=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:SITE}});if(r.error)throw r.error;})}/>}<TaskStatus task={task}/>
 {mode==='login'&&<Button title="Şifremi unuttum" small secondary onPress={()=>setMode('reset')}/>}
 <T size={11} color={colors.muted}>Müşteri, usta ve işletme aynı hesap sistemiyle çalışır. İşletme yetkileri sahibinin onayıyla atanır.</T>
 <Row><Button title="Gizlilik ve koşullar" small secondary onPress={()=>void Linking.openURL(SITE+'legal.html')}/><Button title="Keşfe dön" small secondary onPress={onDone}/></Row></Card></Stack></Fade>;
}
