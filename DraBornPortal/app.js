const VERSION='0.2';
const GLOSSARY=['PlayStation Portal','PlayStation','RuneScape','Dragonwilds','Dragon Slayer','Wise Old Man','Restless Ghost','Ghostspeak','Kettan','Oculus','Void'];
const $=id=>document.getElementById(id);
const state={file:null,blocks:[],showOriginal:false,history:loadHistory()};

function cleanText(text=''){return text.replace(/\r/g,'').split('\n').map(v=>v.replace(/\s+/g,' ').trim()).filter(Boolean).filter((v,i,a)=>i===0||v!==a[i-1]).join('\n')}
function useful(text){const compact=text.replace(/\s/g,'');if(text.length<3||text.length>1200||!compact)return false;const letters=(compact.match(/[A-Za-zÀ-ž]/g)||[]).length;return letters/compact.length>=.48&&/[A-Za-z]{2,}/.test(text)}
function protectTerms(text){let out=text;const terms=[];[...GLOSSARY].sort((a,b)=>b.length-a.length).forEach((term,i)=>{const rx=new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');out=out.replace(rx,m=>{const token=`QZX${i}ZXQ`;terms.push([token,m]);return token})});return {text:out,terms}}
function restoreTerms(text,terms){let out=text;terms.forEach(([token,value])=>out=out.replace(new RegExp(token,'gi'),value));return out}
async function translate(text){const p=protectTerms(text);const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(p.text)}&langpair=en|tr`);if(!r.ok)throw new Error('Ücretsiz web çeviri servisine ulaşılamadı');const j=await r.json();return restoreTerms(decodeHtml(j?.responseData?.translatedText||''),p.terms).trim()}
function decodeHtml(v){const d=document.createElement('textarea');d.innerHTML=v;return d.value}
function progress(v,t){$('progressBar').style.width=`${v}%`;$('progressText').textContent=t}

async function analyze(){
  if(!state.file)return;
  $('analyzeBtn').disabled=true;$('error').textContent='';state.blocks=[];$('overlay').innerHTML='';progress(4,'OCR hazırlanıyor');
  let worker;
  try{
    worker=await Tesseract.createWorker('eng',undefined,{logger:m=>{if(m.status==='recognizing text')progress(8+Math.round((m.progress||0)*48),`Metin bölgeleri algılanıyor • %${Math.round((m.progress||0)*100)}`)}});
    const result=await worker.recognize(state.file,{}, {text:true,blocks:true});
    const candidates=(result.data.blocks||result.data.lines||[]).map(item=>({text:cleanText(item.text||''),bbox:item.bbox})).filter(x=>x.bbox&&useful(x.text)).slice(0,24);
    if(!candidates.length){const all=cleanText(result.data.text||'');if(all) candidates.push({text:all,bbox:{x0:0,y0:0,x1:$('preview').naturalWidth,y1:$('preview').naturalHeight}})}
    if(!candidates.length)throw new Error('Çevrilebilir İngilizce metin bulunamadı.');
    for(let i=0;i<candidates.length;i++){
      progress(58+Math.round(((i+1)/candidates.length)*38),`Türkçeye çevriliyor • ${i+1}/${candidates.length}`);
      const translated=await translate(candidates[i].text);
      if(translated)state.blocks.push({...candidates[i],translated});
    }
    renderOverlay();saveHistory(state.blocks.map(x=>x.translated).join('\n'));$('viewerSection').hidden=false;progress(100,'Çeviri tamamlandı');
  }catch(e){$('error').textContent=e.message||String(e);progress(0,'Tekrar deneyebilirsin')}
  finally{if(worker)await worker.terminate();$('analyzeBtn').disabled=!state.file}
}

function renderOverlay(){
  const img=$('preview'),layer=$('overlay');layer.innerHTML='';$('regionCount').textContent=`${state.blocks.length} metin bölgesi çevrildi`;
  if(state.showOriginal)return;
  const iw=img.naturalWidth||1,ih=img.naturalHeight||1;
  state.blocks.forEach(b=>{const el=document.createElement('div');el.className='tr-block';el.textContent=b.translated;el.style.left=`${b.bbox.x0/iw*100}%`;el.style.top=`${b.bbox.y0/ih*100}%`;el.style.width=`${Math.max(8,(b.bbox.x1-b.bbox.x0)/iw*100)}%`;el.style.minHeight=`${Math.max(2,(b.bbox.y1-b.bbox.y0)/ih*100)}%`;layer.appendChild(el)})
}
function setFile(file){if(!file?.type?.startsWith('image/'))return;state.file=file;state.blocks=[];const url=URL.createObjectURL(file);$('preview').onload=()=>{URL.revokeObjectURL(url);$('viewerSection').hidden=false;renderOverlay()};$('preview').src=url;$('analyzeBtn').disabled=false;progress(0,'Görsel hazır')}
function saveHistory(tr){if(!tr)return;if(state.history[0]?.text===tr)return;state.history.unshift({text:tr,at:Date.now()});state.history=state.history.slice(0,50);localStorage.setItem('dkd_portal_history_v2',JSON.stringify(state.history));renderHistory()}
function loadHistory(){try{return JSON.parse(localStorage.getItem('dkd_portal_history_v2')||'[]')}catch{return []}}
function renderHistory(){$('history').innerHTML=state.history.length?state.history.slice(0,8).map(x=>`<article class="history-item"><time>${new Date(x.at).toLocaleString('tr-TR')}</time><p>${escapeHtml(x.text.slice(0,360))}</p></article>`).join(''):'<p>Henüz çeviri yok.</p>'}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

$('fileInput').addEventListener('change',e=>setFile(e.target.files[0]));$('analyzeBtn').addEventListener('click',analyze);$('toggleBtn').addEventListener('click',()=>{state.showOriginal=!state.showOriginal;$('toggleBtn').textContent=state.showOriginal?'TÜRKÇEYİ GÖSTER':'ORİJİNALİ GÖSTER';renderOverlay()});$('clearBtn').addEventListener('click',()=>{state.history=[];localStorage.removeItem('dkd_portal_history_v2');renderHistory()});renderHistory();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
