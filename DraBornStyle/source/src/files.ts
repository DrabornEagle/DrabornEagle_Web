import {Platform} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {File,Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as Crypto from 'expo-crypto';
import {strToU8} from 'fflate';
import {xml,spreadsheetBytes,csvText} from './reports';
export {spreadsheetBytes} from './reports';
import {supabase,api} from './data';
export async function uploadMedia(businessId:string,kind='cover'){
 const r=await DocumentPicker.getDocumentAsync({type:['image/jpeg','image/png','image/webp'],copyToCacheDirectory:true});if(r.canceled)return null;
 const a=r.assets[0];if((a.size||0)>5*1024*1024)throw new Error('Görsel en fazla 5 MB olabilir.');
 const body=Platform.OS==='web'?await a.file!.arrayBuffer():await new File(a.uri).arrayBuffer();
 const path=`${businessId}/${kind}-${Crypto.randomUUID()}.${(a.mimeType||'image/jpeg').split('/')[1]}`;
 const up=await supabase.storage.from('drabornstyle-media').upload(path,body,{contentType:a.mimeType||'image/jpeg'});if(up.error)throw up.error;
 return supabase.storage.from('drabornstyle-media').getPublicUrl(path).data.publicUrl;
}
export async function uploadReceipt(businessId:string,requestId:string){
 const r=await DocumentPicker.getDocumentAsync({type:['image/jpeg','image/png','application/pdf'],copyToCacheDirectory:true});if(r.canceled)return null;const a=r.assets[0];
 if((a.size||0)>5*1024*1024)throw new Error('Dekont en fazla 5 MB olabilir.');
 const path=`${businessId}/${requestId}/${Crypto.randomUUID()}.${(a.mimeType||'application/pdf').split('/')[1]}`;
 const body=Platform.OS==='web'?await a.file!.arrayBuffer():await new File(a.uri).arrayBuffer();
 const up=await supabase.storage.from('drabornstyle-receipts').upload(path,body,{contentType:a.mimeType||'application/pdf'});if(up.error)throw up.error;
 await api('receipt_attach',{business_id:businessId,request_id:requestId,path});return path;
}
export async function receiptUrl(path:string){const r=await supabase.storage.from('drabornstyle-receipts').createSignedUrl(path,120);if(r.error)throw r.error;return r.data.signedUrl;}
async function deliver(name:string,bytes:Uint8Array,mime:string){
 if(Platform.OS==='web'){const url=URL.createObjectURL(new Blob([bytes as any],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 else {const file=new File(Paths.cache,name);file.create({overwrite:true});file.write(bytes);if(await Sharing.isAvailableAsync())await Sharing.shareAsync(file.uri,{mimeType:mime});else throw new Error('Bu cihazda dosya paylaşımı kullanılamıyor.');}
}
export async function exportReport(format:string,rows:(string|number)[][]){
 const name='DraBornStyle-'+new Date().toISOString().slice(0,10);
 if(format==='xlsx')return deliver(name+'.xlsx',spreadsheetBytes(rows),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
 if(format==='csv')return deliver(name+'.csv',strToU8(csvText(rows)),'text/csv;charset=utf-8');
 const html=`<!doctype html><html><head><meta charset="UTF-8"><style>body{font:12px Arial;color:#16233a;margin:30px}h1{font-size:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#edf3fa}footer{margin-top:20px;color:#667}</style></head><body><h1>DraBornStyle · Finans ve performans raporu</h1><p>${new Date().toLocaleString('tr-TR')} · TRY</p><table>${rows.map((r,i)=>`<tr>${r.map(v=>`<${i?'td':'th'}>${xml(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</table><footer>Tahakkuk, tahsilat ve bakiye ayrı alanlardır.</footer></body></html>`;
 if(Platform.OS==='web'){const w=window.open('','_blank');if(!w)throw new Error('PDF için tarayıcı açılır pencere izni gerekli.');w.document.write(html);w.document.close();w.focus();w.print();}
 else{const pdf=await Print.printToFileAsync({html});await Sharing.shareAsync(pdf.uri,{mimeType:'application/pdf'});}
}
