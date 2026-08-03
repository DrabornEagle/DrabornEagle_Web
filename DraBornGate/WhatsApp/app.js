(() => {
'use strict';
const CONTACTS_KEY='dkd_gate_whatsapp_contacts_v2';
const MESSAGE_KEY='dkd_gate_whatsapp_message_v2';
const PLAY_KEY='dkd_gate_whatsapp_play_v2';
const DEFAULT_PLAY='https://play.google.com/store/apps/details?id=com.draborneagle.draborngate';
const DEFAULT_MESSAGE=`Merhaba {ad},

Site sakinlerimize özel geliştirilen DraBornGate uygulaması kullanıma açılmıştır.

DraBornGate ile site duyurularını takip edebilir, yönetimle iletişim kurabilir ve site içerisindeki hizmetlerden faydalanabilirsiniz.

Google Play: {google_play}`;
const state={contacts:[],queue:[],queueIndex:0};
const $=id=>document.getElementById(id);
const el={};

function id(){return crypto.randomUUID?crypto.randomUUID():`dkd_${Date.now()}_${Math.random().toString(16).slice(2)}`}
function text(v){return String(v??'').trim()}
function searchText(v){return text(v).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ')}
function normalizePhone(value){
  const raw=text(value).replace(/[^\d+]/g,'');
  let digits=raw.replace(/\D/g,'');
  if(digits.startsWith('0090'))digits=digits.slice(2);
  if(digits.startsWith('90')&&digits.length===12)return `+${digits}`;
  if(digits.startsWith('0')&&digits.length===11)return `+90${digits.slice(1)}`;
  if(digits.length===10&&digits.startsWith('5'))return `+90${digits}`;
  if(raw.startsWith('+')&&digits.length>=10&&digits.length<=15)return `+${digits}`;
  if(digits.length>=10&&digits.length<=15)return `+${digits}`;
  return '';
}
function decodeQP(value){
  const joined=String(value??'').replace(/=\r?\n/g,'');
  const bytes=[];
  for(let i=0;i<joined.length;i++){
    if(joined[i]==='='&&/^[0-9A-Fa-f]{2}$/.test(joined.slice(i+1,i+3))){bytes.push(parseInt(joined.slice(i+1,i+3),16));i+=2}
    else bytes.push(joined.charCodeAt(i));
  }
  try{return new TextDecoder().decode(new Uint8Array(bytes))}catch{return joined}
}
function lineValue(line){
  const cut=line.indexOf(':'); if(cut<0)return '';
  const meta=line.slice(0,cut).toUpperCase();
  let value=line.slice(cut+1);
  if(meta.includes('QUOTED-PRINTABLE'))value=decodeQP(value);
  if(meta.includes('ENCODING=B')||meta.includes('BASE64')){
    try{value=new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g,'')),c=>c.charCodeAt(0)))}catch{}
  }
  return value.replace(/\\n/gi,'\n').replace(/\\,/g,',').replace(/\\;/g,';').replace(/\\\\/g,'\\').trim();
}
function unfold(raw){
  return String(raw??'').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').reduce((out,line)=>{
    if(!out.length)out.push(line);
    else if(line.startsWith(' ')||line.startsWith('\t'))out[out.length-1]+=line.slice(1);
    else if(out[out.length-1].endsWith('='))out[out.length-1]+=`\n${line}`;
    else out.push(line);
    return out;
  },[]);
}
function locationFrom(value){
  const s=text(value);
  const after=s.match(/(?:blok|block)\s*[:\-]?\s*([A-Za-zÇĞİÖŞÜçğıöşü0-9]+)/i);
  const before=s.match(/([A-Za-zÇĞİÖŞÜçğıöşü0-9]+)\s*(?:blok|block)\b/i);
  const flat=s.match(/(?:daire|flat|apt|apartment)\s*[:\-]?\s*([A-Za-z0-9\/-]+)/i);
  const b=(before?.[1]||after?.[1]||'').trim();
  return {block:b?`${b} Blok`:'',flat:flat?.[1]||''};
}
function parseVcf(raw){
  const cards=[]; let current=null;
  unfold(raw).forEach(line=>{
    const up=line.toUpperCase();
    if(up==='BEGIN:VCARD'){current={name:'',phones:[],notes:[]};return}
    if(up==='END:VCARD'){if(current)cards.push(current);current=null;return}
    if(!current)return;
    const prop=line.split(':',1)[0].split(';',1)[0].toUpperCase().split('.').pop();
    const value=lineValue(line);
    if(prop==='FN'&&value)current.name=value;
    else if(prop==='N'&&!current.name&&value){const [last='',first='',middle='']=value.split(';');current.name=[first,middle,last].filter(Boolean).join(' ')}
    else if(prop==='TEL'&&value)current.phones.push(value);
    else if((prop==='NOTE'||prop==='ADR')&&value)current.notes.push(value.replace(/;/g,' '));
  });
  const byPhone=new Map();
  cards.forEach(card=>{
    const loc=locationFrom([card.name,...card.notes].join(' '));
    card.phones.forEach(p=>{
      const phone=normalizePhone(p); if(!phone)return;
      const old=byPhone.get(phone);
      if(old){if(old.name==='İsimsiz Kişi'&&card.name)old.name=card.name;if(!old.block)old.block=loc.block;if(!old.flat)old.flat=loc.flat;return}
      byPhone.set(phone,{id:id(),name:text(card.name)||'İsimsiz Kişi',phone,block:loc.block,flat:loc.flat,selected:true,sent:false});
    });
  });
  return [...byPhone.values()];
}
function save(){localStorage.setItem(CONTACTS_KEY,JSON.stringify(state.contacts))}
function load(){
  try{
    const data=JSON.parse(localStorage.getItem(CONTACTS_KEY)||'[]');
    state.contacts=Array.isArray(data)?data.map(c=>({id:text(c.id)||id(),name:text(c.name)||'İsimsiz Kişi',phone:normalizePhone(c.phone),block:text(c.block),flat:text(c.flat),selected:c.selected!==false,sent:c.sent===true})).filter(c=>c.phone):[];
  }catch{state.contacts=[]}
  el.messageTemplate.value=localStorage.getItem(MESSAGE_KEY)||DEFAULT_MESSAGE;
  el.playUrl.value=localStorage.getItem(PLAY_KEY)||DEFAULT_PLAY;
}
function toast(message){el.toast.textContent=message;el.toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.toast.classList.remove('show'),2200)}
function saveMessage(){localStorage.setItem(MESSAGE_KEY,text(el.messageTemplate.value)||DEFAULT_MESSAGE);localStorage.setItem(PLAY_KEY,text(el.playUrl.value)||DEFAULT_PLAY)}
function buildMessage(contact,template=el.messageTemplate.value){
  const first=text(contact.name).split(/\s+/)[0]||'Site Sakini';
  return String(template||DEFAULT_MESSAGE).replaceAll('{ad}',first).replaceAll('{ad_soyad}',contact.name||'Site Sakini').replaceAll('{google_play}',text(el.playUrl.value)||DEFAULT_PLAY);
}
function waUrl(contact,message){return `https://wa.me/${contact.phone.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`}
function openWa(contact,message){const url=waUrl(contact,message);const w=window.open(url,'_blank');if(w)w.opener=null;else location.assign(url)}
function matches(contact,q){if(!q)return true;return searchText([contact.name,contact.phone,contact.phone.replace(/\D/g,''),contact.block,contact.flat].join(' ')).includes(q)}
function visibleBulk(){const q=searchText(el.bulkSearch.value);return state.contacts.filter(c=>matches(c,q))}
function visibleResidents(){const q=searchText(el.residentSearch.value),b=el.blockFilter.value;return state.contacts.filter(c=>(!b||c.block===b)&&matches(c,q))}
function updateStats(){
  const selected=state.contacts.filter(c=>c.selected&&!c.sent).length;
  el.totalCount.textContent=state.contacts.length;
  el.selectedCount.textContent=selected;
  el.sentCount.textContent=state.contacts.filter(c=>c.sent).length;
  el.queueSummary.textContent=selected?`${selected} kişi gönderime hazır`:'Gönderime hazır kişi yok';
  el.startQueue.disabled=!selected;
}
function button(label,cls,fn){const b=document.createElement('button');b.type='button';b.className=`button ${cls}`;b.textContent=label;b.addEventListener('click',fn);return b}
function renderBulk(){
  const list=visibleBulk();el.bulkEmpty.hidden=!!list.length;el.bulkList.replaceChildren();
  list.forEach(c=>{
    const row=document.createElement('div');row.className='contact';
    const check=document.createElement('input');check.type='checkbox';check.className='check';check.checked=c.selected;check.disabled=c.sent;check.addEventListener('change',()=>{c.selected=check.checked;save();updateStats()});
    const main=document.createElement('div');main.className='main';const strong=document.createElement('strong');strong.textContent=c.name;const span=document.createElement('span');span.textContent=[c.phone,c.block,c.flat&&`Daire ${c.flat}`].filter(Boolean).join(' · ');main.append(strong,span);
    const pill=document.createElement('span');pill.className=`pill${c.sent?' sent':''}`;pill.textContent=c.sent?'Gönderildi':'Hazır';
    row.append(check,main,pill);el.bulkList.append(row);
  });
  updateStats();
}
function renderBlocks(){
  const current=el.blockFilter.value;
  const blocks=[...new Set(state.contacts.map(c=>c.block).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
  el.blockFilter.replaceChildren(new Option('Tüm Bloklar',''),...blocks.map(b=>new Option(b,b)));
  if(blocks.includes(current))el.blockFilter.value=current;
}
function renderResidents(){
  const list=visibleResidents();el.residentEmpty.hidden=!!list.length;el.residentList.replaceChildren();
  list.forEach(c=>{
    const row=document.createElement('div');row.className='resident';
    const main=document.createElement('div');main.className='main';const strong=document.createElement('strong');strong.textContent=c.name;const span=document.createElement('span');span.textContent=c.phone;main.append(strong,span);
    const block=document.createElement('div');block.className='meta';block.innerHTML='<span>Blok</span>';const bs=document.createElement('strong');bs.textContent=c.block||'—';block.append(bs);
    const flat=document.createElement('div');flat.className='meta';flat.innerHTML='<span>Daire</span>';const fs=document.createElement('strong');fs.textContent=c.flat||'—';flat.append(fs);
    const phone=document.createElement('div');phone.className='meta';phone.innerHTML='<span>Telefon</span>';const ps=document.createElement('strong');ps.textContent=c.phone;phone.append(ps);
    const acts=document.createElement('div');acts.className='row-actions';
    acts.append(button('WhatsApp','primary',()=>openMessage(c)),button('Düzenle','secondary',()=>openResident(c)),button('Sil','danger',()=>removeResident(c)));
    row.append(main,block,flat,phone,acts);el.residentList.append(row);
  });
}
function render(){renderBlocks();renderBulk();renderResidents()}
function mergeContacts(incoming){
  const map=new Map(state.contacts.map(c=>[c.phone,c]));
  let added=0;
  incoming.forEach(c=>{const old=map.get(c.phone);if(old){if(old.name==='İsimsiz Kişi'&&c.name)old.name=c.name;if(!old.block)old.block=c.block;if(!old.flat)old.flat=c.flat}else{state.contacts.push(c);map.set(c.phone,c);added++}});
  save();render();return added;
}
function openResident(c=null){
  el.residentTitle.textContent=c?'Sakin kaydını düzenle':'Yeni sakin ekle';
  el.residentId.value=c?.id||'';el.residentName.value=c?.name||'';el.residentPhone.value=c?.phone||'';el.residentBlock.value=c?.block||'';el.residentFlat.value=c?.flat||'';
  el.residentDialog.showModal();
}
function removeResident(c){if(!confirm(`${c.name} kaydı silinsin mi?`))return;state.contacts=state.contacts.filter(x=>x.id!==c.id);save();render();toast('Kayıt silindi')}
function openMessage(c){el.messageContactId.value=c.id;el.messageTitle.textContent=c.name;el.singleMessage.value=buildMessage(c);el.messageDialog.showModal()}
function currentQueue(){return state.contacts.find(c=>c.id===state.queue[state.queueIndex])||null}
function showQueue(){
  if(state.queueIndex>=state.queue.length){el.queueDialog.close();toast('Gönderim listesi tamamlandı');render();return}
  const c=currentQueue();if(!c){state.queueIndex++;showQueue();return}
  el.queueName.textContent=c.name;el.queuePhone.textContent=c.phone;el.queueProgress.textContent=`${state.queueIndex+1} / ${state.queue.length}`;el.queueDialog.showModal();
}
function cache(){
  ['vcfFile','clearAll','exportJson','importJson','importStatus','playUrl','messageTemplate','saveMessage','totalCount','selectedCount','sentCount','bulkSearch','selectVisible','unselectVisible','resetSent','bulkEmpty','bulkList','queueSummary','startQueue','residentSearch','blockFilter','residentEmpty','residentList','addResident','residentDialog','residentForm','residentTitle','residentId','residentName','residentPhone','residentBlock','residentFlat','messageDialog','messageForm','messageTitle','messageContactId','singleMessage','queueDialog','queueName','queueProgress','queuePhone','openQueueWhatsApp','markSentNext','skipQueue','toast'].forEach(k=>el[k]=$(k));
}
function events(){
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');$(t.dataset.tab).classList.add('active')}));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
  el.vcfFile.addEventListener('change',async()=>{
    const file=el.vcfFile.files?.[0];if(!file)return;
    try{const parsed=parseVcf(await file.text());const added=mergeContacts(parsed);el.importStatus.className='status ok';el.importStatus.textContent=`${parsed.length} numara okundu, ${added} yeni kişi eklendi.`}
    catch(e){el.importStatus.className='status error';el.importStatus.textContent=`VCF okunamadı: ${e.message}`}
    el.vcfFile.value='';
  });
  el.saveMessage.addEventListener('click',()=>{saveMessage();toast('Mesaj kaydedildi')});
  el.clearAll.addEventListener('click',()=>{if(!state.contacts.length||!confirm('Tüm rehber kayıtları silinsin mi?'))return;state.contacts=[];save();render();toast('Rehber temizlendi')});
  el.exportJson.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state.contacts,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='DraBornGate_WhatsApp_Rehber_Yedegi.json';a.click();URL.revokeObjectURL(a.href)});
  el.importJson.addEventListener('change',async()=>{try{const data=JSON.parse(await el.importJson.files[0].text());const parsed=Array.isArray(data)?data.map(c=>({...c,id:text(c.id)||id(),phone:normalizePhone(c.phone),name:text(c.name)||'İsimsiz Kişi',selected:c.selected!==false,sent:c.sent===true})).filter(c=>c.phone):[];mergeContacts(parsed);toast('Yedek yüklendi')}catch{toast('Yedek dosyası okunamadı')}el.importJson.value=''});
  el.bulkSearch.addEventListener('input',renderBulk);el.residentSearch.addEventListener('input',renderResidents);el.blockFilter.addEventListener('change',renderResidents);
  el.selectVisible.addEventListener('click',()=>{visibleBulk().forEach(c=>{if(!c.sent)c.selected=true});save();renderBulk()});
  el.unselectVisible.addEventListener('click',()=>{visibleBulk().forEach(c=>c.selected=false);save();renderBulk()});
  el.resetSent.addEventListener('click',()=>{state.contacts.forEach(c=>c.sent=false);save();render()});
  el.startQueue.addEventListener('click',()=>{saveMessage();state.queue=state.contacts.filter(c=>c.selected&&!c.sent).map(c=>c.id);state.queueIndex=0;showQueue()});
  el.openQueueWhatsApp.addEventListener('click',()=>{const c=currentQueue();if(c)openWa(c,buildMessage(c))});
  el.markSentNext.addEventListener('click',()=>{const c=currentQueue();if(c){c.sent=true;c.selected=false;save()}state.queueIndex++;showQueue()});
  el.skipQueue.addEventListener('click',()=>{state.queueIndex++;showQueue()});
  el.addResident.addEventListener('click',()=>openResident());
  el.residentForm.addEventListener('submit',e=>{e.preventDefault();const phone=normalizePhone(el.residentPhone.value);if(!phone){toast('Geçerli telefon numarası yaz');return}const existing=state.contacts.find(c=>c.id===el.residentId.value);const record={id:existing?.id||id(),name:text(el.residentName.value)||'İsimsiz Kişi',phone,block:text(el.residentBlock.value),flat:text(el.residentFlat.value),selected:existing?.selected??true,sent:existing?.sent??false};const duplicate=state.contacts.find(c=>c.phone===phone&&c.id!==record.id);if(duplicate){toast('Bu telefon numarası zaten kayıtlı');return}if(existing)Object.assign(existing,record);else state.contacts.push(record);save();el.residentDialog.close();render();toast('Kayıt kaydedildi')});
  el.messageForm.addEventListener('submit',e=>{e.preventDefault();const c=state.contacts.find(x=>x.id===el.messageContactId.value);if(c){openWa(c,el.singleMessage.value);el.messageDialog.close()}});
}
document.addEventListener('DOMContentLoaded',()=>{cache();load();events();render()});
})();
