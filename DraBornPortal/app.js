const VERSION='0.1';
const GLOSSARY=['PlayStation Portal','PlayStation','Oculus','RuneScape','Dragon Slayer','Wise Old Man','Restless Ghost','Ghostspeak','Kettan','Void','Temple','Shield','Goblin','Cloud Streaming'];
const $=id=>document.getElementById(id);
const state={file:null,history:loadHistory()};

function cleanText(text=''){
  const lines=text.replace(/\r/g,'').split('\n').map(v=>v.replace(/\s+/g,' ').trim()).filter(Boolean);
  return lines.filter((line,i)=>i===0||line.toLocaleLowerCase('en-US')!==lines[i-1].toLocaleLowerCase('en-US')).join('\n').trim();
}
function protectTerms(text){
  let result=text;const tokens=[];
  [...GLOSSARY].sort((a,b)=>b.length-a.length).forEach(term=>{
    const rx=new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
    result=result.replace(rx,m=>{const token=`__DKDTERM${tokens.length}__`;tokens.push([token,m]);return token;});
  });
  return {text:result,tokens};
}
function restoreTerms(text,tokens){let out=text;tokens.forEach(([token,value])=>{out=out.replaceAll(token,value)});return out}
function chunkText(text,max=420){
  const parts=[];let current='';
  text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean).forEach(piece=>{if((current+' '+piece).trim().length>max&&current){parts.push(current);current=piece}else current=(current+' '+piece).trim()});
  if(current)parts.push(current);return parts;
}
async function translateChunk(text){
  const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|tr`;
  const res=await fetch(url);if(!res.ok)throw new Error('Çeviri servisine ulaşılamadı');
  const json=await res.json();if(!json?.responseData?.translatedText)throw new Error('Çeviri sonucu boş');
  return decodeHtml(json.responseData.translatedText);
}
function decodeHtml(value){const d=document.createElement('textarea');d.innerHTML=value;return d.value}
async function translate(text){
  const protectedData=protectTerms(text);const chunks=chunkText(protectedData.text);const translated=[];
  for(let i=0;i<chunks.length;i++){setProgress(68+Math.round(((i+1)/chunks.length)*27),`Türkçeye çevriliyor • ${i+1}/${chunks.length}`);translated.push(await translateChunk(chunks[i]))}
  return restoreTerms(translated.join('\n'),protectedData.tokens);
}
async function analyze(){
  if(!state.file)return;
  try{
    $('analyzeBtn').disabled=true;setProgress(5,'OCR hazırlanıyor');$('translatedText').textContent='Metin okunuyor…';
    const result=await Tesseract.recognize(state.file,'eng',{logger:m=>{if(m.status==='recognizing text')setProgress(10+Math.round((m.progress||0)*50),`Metin algılanıyor • %${Math.round((m.progress||0)*100)}`)}});
    const original=cleanText(result?.data?.text||'');if(!original)throw new Error('Bu görüntüde okunabilir İngilizce metin bulunamadı.');
    $('originalText').textContent=original;$('charCount').textContent=original.length;$('termCount').textContent=countTerms(original);setProgress(65,'OCR tamamlandı');
    const tr=await translate(original);$('translatedText').textContent=tr;saveHistory(original,tr);setProgress(100,'Çeviri tamamlandı');
  }catch(err){$('translatedText').textContent=`Hata: ${err.message||err}`;setProgress(0,'Tekrar deneyebilirsin')}finally{$('analyzeBtn').disabled=!state.file}
}
function countTerms(text){return GLOSSARY.filter(t=>text.toLowerCase().includes(t.toLowerCase())).length}
function setProgress(v,label){$('progressBar').style.width=`${v}%`;$('progressText').textContent=label}
function saveHistory(en,tr){const same=state.history.find(x=>x.en===en);if(same)return;state.history.unshift({en,tr,at:Date.now()});state.history=state.history.slice(0,50);localStorage.setItem('dkd_portal_history',JSON.stringify(state.history));renderHistory()}
function loadHistory(){try{return JSON.parse(localStorage.getItem('dkd_portal_history')||'[]')}catch{return []}}
function renderHistory(){
  $('historyCount').textContent=state.history.length;
  $('history').innerHTML=state.history.length?state.history.slice(0,8).map(x=>`<div class="history-item"><b>${new Date(x.at).toLocaleString('tr-TR')}</b><p>${escapeHtml(x.tr.slice(0,240))}</p></div>`).join(''):'<p class="muted">Henüz çeviri yok.</p>';
}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function setFile(file){if(!file?.type?.startsWith('image/'))return;state.file=file;$('preview').src=URL.createObjectURL(file);$('preview').style.display='block';$('emptyPreview').style.display='none';$('analyzeBtn').disabled=false;setProgress(0,'Görsel hazır • Metni algıla')}
function demo(){
  const en='Hunt a Deer and bring one of its Antlers to the Wise Old Man. Search the goblin castle and look for Kettan.';
  $('originalText').textContent=en;$('charCount').textContent=en.length;$('termCount').textContent=countTerms(en);$('translatedText').textContent='Geyik avla ve boynuzlarından birini Wise Old Man’e götür. Goblin kalesini araştır ve Kettan’ı bul.';setProgress(100,'Demo çeviri hazır')
}

$('chips').innerHTML=GLOSSARY.map(x=>`<span class="chip">${x}</span>`).join('');
$('fileInput').addEventListener('change',e=>setFile(e.target.files[0]));$('analyzeBtn').addEventListener('click',analyze);$('demoBtn').addEventListener('click',demo);$('clearBtn').addEventListener('click',()=>{state.history=[];localStorage.removeItem('dkd_portal_history');renderHistory()});
const dz=$('dropzone');['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag')}));['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')}));dz.addEventListener('drop',e=>setFile(e.dataTransfer.files[0]));
renderHistory();$('engineLabel').textContent=`Web OCR: Tesseract.js • Android: ML Kit • v${VERSION}`;
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});