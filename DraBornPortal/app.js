const VERSION='0.2';
const GLOSSARY=['PlayStation Portal','PlayStation','RuneScape','Dragonwilds','Dragon Slayer','Wise Old Man','Restless Ghost','Ghostspeak','Kettan','Oculus','Void'];
const $=id=>document.getElementById(id);
const state={file:null,blocks:[],showOriginal:false,imageUrl:null,zoom:1,panX:0,panY:0,pointers:new Map(),gesture:null};

function cleanText(text=''){return text.replace(/\r/g,'').split('\n').map(v=>v.replace(/\s+/g,' ').trim()).filter(Boolean).filter((v,i,a)=>i===0||v!==a[i-1]).join('\n')}
function useful(text){const compact=text.replace(/\s/g,'');if(text.length<3||text.length>1600||!compact)return false;const letters=(compact.match(/[A-Za-zÀ-ž]/g)||[]).length;return letters/compact.length>=.48&&/[A-Za-z]{2,}/.test(text)}
function protectTerms(text){let out=text;const terms=[];[...GLOSSARY].sort((a,b)=>b.length-a.length).forEach((term,i)=>{const rx=new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');out=out.replace(rx,m=>{const token=`QZX${i}ZXQ`;terms.push([token,m]);return token})});return {text:out,terms}}
function restoreTerms(text,terms){let out=text;terms.forEach(([token,value])=>out=out.replace(new RegExp(token,'gi'),value));return out}
function decodeHtml(v){const d=document.createElement('textarea');d.innerHTML=v;return d.value}
function progress(v,t){$('progressBar').style.width=`${v}%`;$('progressText').textContent=t}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function splitForTranslation(text,max=420){
  const input=cleanText(text);if(!input)return[];const pieces=[];
  for(const raw of input.split('\n')){
    let part=raw.trim();
    while(part.length>max){let cut=part.lastIndexOf(' ',max);if(cut<Math.floor(max*.6))cut=max;pieces.push(part.slice(0,cut).trim());part=part.slice(cut).trim()}
    if(part)pieces.push(part)
  }
  const chunks=[];let current='';
  for(const piece of pieces){const next=current?`${current}\n${piece}`:piece;if(next.length<=max)current=next;else{if(current)chunks.push(current);current=piece}}
  if(current)chunks.push(current);return chunks
}

async function translateChunk(text){
  const p=protectTerms(text);
  const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(p.text)}&langpair=en|tr`;
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok)throw new Error('Ücretsiz web çeviri servisine ulaşılamadı');
  const j=await r.json();
  const raw=decodeHtml(j?.responseData?.translatedText||'').trim();
  if(!raw)throw new Error('Web çeviri servisi boş yanıt verdi.');
  if(/QUERY LENGTH LIMIT EXCEEDED|MAX ALLOWED QUERY/i.test(raw))throw new Error('Çeviri metni servis sınırını aştı. Metin otomatik bölünemedi.');
  return restoreTerms(raw,p.terms).trim()
}
async function translate(text){const chunks=splitForTranslation(text);const translated=[];for(const chunk of chunks)translated.push(await translateChunk(chunk));return translated.filter(Boolean).join('\n')}

function getRegions(data){
  if(data?.blocks?.length)return data.blocks;
  if(data?.lines?.length)return data.lines;
  if(data?.paragraphs?.length)return data.paragraphs;
  return []
}

async function analyze(){
  if(!state.file)return;
  $('analyzeBtn').disabled=true;$('error').textContent='';state.blocks=[];renderPlainText();renderOverlay();progress(4,'OCR hazırlanıyor');
  let worker;
  try{
    if(!window.Tesseract)throw new Error('OCR motoru yüklenemedi. İnternet bağlantısını kontrol edip sayfayı yenile.');
    worker=await Tesseract.createWorker('eng',undefined,{logger:m=>{if(m.status==='recognizing text')progress(8+Math.round((m.progress||0)*48),`Metin bölgeleri algılanıyor • %${Math.round((m.progress||0)*100)}`)}});
    const result=await worker.recognize(state.file,{}, {text:true,blocks:true});
    const regions=getRegions(result.data);
    const candidates=regions.map(item=>({text:cleanText(item.text||''),bbox:item.bbox})).filter(x=>x.bbox&&useful(x.text)).slice(0,30);
    if(!candidates.length){
      const all=cleanText(result.data.text||'');
      if(all){
        const lines=all.split('\n').filter(useful).slice(0,30);
        const bbox={x0:0,y0:0,x1:$('preview').naturalWidth||1,y1:$('preview').naturalHeight||1};
        lines.forEach(line=>candidates.push({text:line,bbox,overlay:false}))
      }
    }
    if(!candidates.length)throw new Error('Çevrilebilir İngilizce metin bulunamadı.');
    for(let i=0;i<candidates.length;i++){
      progress(58+Math.round(((i+1)/candidates.length)*38),`Türkçeye çevriliyor • ${i+1}/${candidates.length}`);
      const translated=await translate(candidates[i].text);
      if(translated)state.blocks.push({...candidates[i],translated});
    }
    renderPlainText();renderOverlay();$('viewerSection').hidden=false;progress(100,'Çeviri tamamlandı • Görüntüye dokun ve tam ekranda incele');
  }catch(e){$('error').textContent=e.message||String(e);progress(0,'Tekrar deneyebilirsin')}
  finally{if(worker)await worker.terminate();$('analyzeBtn').disabled=!state.file}
}

function renderPlainText(){const text=state.blocks.map(x=>x.translated).filter(Boolean).join('\n\n');$('translationText').textContent=text||'Henüz çeviri yok.'}
function renderOverlay(){
  const img=$('fullImage'),layer=$('fullOverlay');layer.innerHTML='';$('regionCount').textContent=`${state.blocks.length} metin bölgesi çevrildi`;
  if(state.showOriginal)return;
  const iw=$('preview').naturalWidth||img.naturalWidth||1,ih=$('preview').naturalHeight||img.naturalHeight||1;
  state.blocks.filter(b=>b.overlay!==false).forEach(b=>{
    const el=document.createElement('div');el.className='tr-block';el.textContent=b.translated;
    el.style.left=`${b.bbox.x0/iw*100}%`;el.style.top=`${b.bbox.y0/ih*100}%`;
    el.style.width=`${Math.max(1,(b.bbox.x1-b.bbox.x0)/iw*100)}%`;el.style.height=`${Math.max(.8,(b.bbox.y1-b.bbox.y0)/ih*100)}%`;
    const area=Math.max(36,(b.bbox.x1-b.bbox.x0)*(b.bbox.y1-b.bbox.y0));const fitted=Math.max(7,Math.min(14,Math.sqrt(area/Math.max(1,b.translated.length))*.34));el.style.fontSize=`${fitted}px`;
    layer.appendChild(el)
  })
}

function setFile(file){
  if(!file?.type?.startsWith('image/'))return;
  state.file=file;state.blocks=[];state.showOriginal=false;renderPlainText();
  if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);state.imageUrl=URL.createObjectURL(file);
  $('preview').onload=()=>{$('viewerSection').hidden=false;$('fullImage').src=state.imageUrl;renderOverlay()};
  $('preview').src=state.imageUrl;$('analyzeBtn').disabled=false;progress(0,'Görsel hazır • Türkçeleştir düğmesine dokun')
}

function openFullscreen(){if(!$('preview').src)return;$('fullImage').src=$('preview').src;$('fullscreen').hidden=false;document.body.classList.add('modal-open');resetZoom();renderOverlay()}
function closeFullscreen(){$('fullscreen').hidden=true;document.body.classList.remove('modal-open');state.pointers.clear();state.gesture=null}
function applyTransform(){$('zoomCanvas').style.transform=`translate3d(${state.panX}px,${state.panY}px,0) scale(${state.zoom})`;$('zoomValue').textContent=`${Math.round(state.zoom*100)}%`}
function resetZoom(){state.zoom=1;state.panX=0;state.panY=0;applyTransform()}
function setZoom(next){const old=state.zoom;state.zoom=Math.max(1,Math.min(8,next));if(state.zoom===1){state.panX=0;state.panY=0}else if(old>0){const ratio=state.zoom/old;state.panX*=ratio;state.panY*=ratio}applyTransform()}
function pointerDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function pointerMid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}

function bindZoom(){
  const stage=$('zoomStage');
  stage.addEventListener('pointerdown',e=>{stage.setPointerCapture(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(state.pointers.size===2){const [a,b]=[...state.pointers.values()];state.gesture={distance:pointerDistance(a,b),mid:pointerMid(a,b),zoom:state.zoom,panX:state.panX,panY:state.panY}}});
  stage.addEventListener('pointermove',e=>{
    const prev=state.pointers.get(e.pointerId);if(!prev)return;state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(state.pointers.size===1&&state.zoom>1){state.panX+=e.clientX-prev.x;state.panY+=e.clientY-prev.y;applyTransform();return}
    if(state.pointers.size===2){const [a,b]=[...state.pointers.values()];if(!state.gesture)state.gesture={distance:pointerDistance(a,b),mid:pointerMid(a,b),zoom:state.zoom,panX:state.panX,panY:state.panY};const distance=Math.max(1,pointerDistance(a,b));const mid=pointerMid(a,b);state.zoom=Math.max(1,Math.min(8,state.gesture.zoom*(distance/Math.max(1,state.gesture.distance))));state.panX=state.gesture.panX+(mid.x-state.gesture.mid.x);state.panY=state.gesture.panY+(mid.y-state.gesture.mid.y);if(state.zoom===1){state.panX=0;state.panY=0}applyTransform()}
  });
  const end=e=>{state.pointers.delete(e.pointerId);state.gesture=null};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  stage.addEventListener('wheel',e=>{e.preventDefault();setZoom(state.zoom*(e.deltaY<0?1.16:.86))},{passive:false});
  stage.addEventListener('dblclick',()=>state.zoom>1?resetZoom():setZoom(2.5));
}

$('fileInput').addEventListener('change',e=>setFile(e.target.files[0]));
$('analyzeBtn').addEventListener('click',analyze);
$('viewer').addEventListener('click',openFullscreen);
$('closeFull').addEventListener('click',closeFullscreen);
$('fullscreen').addEventListener('click',e=>{if(e.target===$('fullscreen'))closeFullscreen()});
$('toggleBtn').addEventListener('click',()=>{state.showOriginal=!state.showOriginal;$('toggleBtn').textContent=state.showOriginal?'TÜRKÇEYİ GÖSTER':'ORİJİNALİ GÖSTER';renderOverlay()});
$('zoomIn').addEventListener('click',()=>setZoom(state.zoom*1.35));$('zoomOut').addEventListener('click',()=>setZoom(state.zoom/1.35));$('zoomReset').addEventListener('click',resetZoom);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('fullscreen').hidden)closeFullscreen()});
bindZoom();renderPlainText();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
