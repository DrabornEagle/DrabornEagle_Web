import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
// SecureStore entries are kept below Android/iOS per-entry size limits.
export const sessionStorage = {
 async getItem(key:string):Promise<string|null> {
  if(Platform.OS==='web') return AsyncStorage.getItem(key);
  const count = await SecureStore.getItemAsync(key+'-count');
  if(!count) return null;
  const parts = await Promise.all(Array.from({length:Number(count)},(_,i)=>SecureStore.getItemAsync(key+'-'+i)));
  return parts.every(p=>p!==null)?parts.join(''):null;
 },
 async setItem(key:string,value:string) {
  if(Platform.OS==='web') return AsyncStorage.setItem(key,value);
  const previous=Number(await SecureStore.getItemAsync(key+'-count')||0);
  const parts=value.match(/[\s\S]{1,1800}/g)||[''];
  for(let i=0;i<parts.length;i++) await SecureStore.setItemAsync(key+'-'+i,parts[i]);
  await SecureStore.setItemAsync(key+'-count',String(parts.length));
  for(let i=parts.length;i<previous;i++) await SecureStore.deleteItemAsync(key+'-'+i);
 },
 async removeItem(key:string) {
  if(Platform.OS==='web') return AsyncStorage.removeItem(key);
  const n=Number(await SecureStore.getItemAsync(key+'-count')||0);
  for(let i=0;i<n;i++) await SecureStore.deleteItemAsync(key+'-'+i);
  await SecureStore.deleteItemAsync(key+'-count');
 }
};
