import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Row} from './data';
export async function testNotification(){
 if(Platform.OS==='web'){if(!('Notification' in window))throw new Error('Bu tarayıcı sistem bildirimlerini desteklemiyor; uygulama içi bildirimler kullanılabilir.');const p=await Notification.requestPermission();if(p!=='granted')throw new Error('Bildirim izni verilmedi.');new Notification('DraBornStyle',{body:'Bildirimlerin için her şey hazır.',tag:'drabornstyle-test'});return;}
 const N=await import('expo-notifications');const p=await N.requestPermissionsAsync();if(p.status!=='granted')throw new Error('Bildirim izni verilmedi.');
 await N.setNotificationChannelAsync('appointments',{name:'Randevu hatırlatmaları',importance:N.AndroidImportance.DEFAULT});
 N.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:false,shouldSetBadge:false})});
 await N.scheduleNotificationAsync({identifier:'drabornstyle-test',content:{title:'DraBornStyle',body:'Yerel bildirim testi başarılı.'},trigger:null});
}
export async function enableReminders(){await testNotification();await AsyncStorage.setItem('dbstyle-reminders','enabled');}
export async function syncReminders(appointments:Row[]){
 if(Platform.OS==='web'||await AsyncStorage.getItem('dbstyle-reminders')!=='enabled')return;
 const N=await import('expo-notifications');const scheduled=await N.getAllScheduledNotificationsAsync();
 const ids=new Set(appointments.filter(a=>['confirmed','late'].includes(a.status)).map(a=>'dbstyle:'+a.id));
 for(const n of scheduled)if(n.identifier.startsWith('dbstyle:')&&!ids.has(n.identifier))await N.cancelScheduledNotificationAsync(n.identifier);
 for(const a of appointments.filter(a=>['confirmed','late'].includes(a.status))){const time=new Date(a.starts_at).getTime()-30*60000;const id='dbstyle:'+a.id;if(time<=Date.now())continue;const old=scheduled.find(n=>n.identifier===id);if(old&&old.content.data?.starts_at===a.starts_at)continue;if(old)await N.cancelScheduledNotificationAsync(id);await N.scheduleNotificationAsync({identifier:id,content:{title:'Randevun yaklaşıyor',body:'DraBornStyle randevuna 30 dakika kaldı.',data:{starts_at:a.starts_at,appointment_id:a.id}},trigger:{type:N.SchedulableTriggerInputTypes.DATE,date:new Date(time),channelId:'appointments'}});}
}
