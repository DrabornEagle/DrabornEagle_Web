const VERSION='0.3';
const GLOSSARY=['PlayStation Portal','PlayStation','PSN','RuneScape','Dragonwilds','Wise Old Man','Ghostspeak','Kettan','Cathan','Oculus','Void'];
const $=id=>document.getElementById(id);
const state={file:null,blocks:[],showOriginal:false,imageUrl:null,zoom:1,panX:0,panY:0,pointers:new Map(),gesture:null,sourceWidth:1,sourceHeight:1};

function cleanText(text=''){return text.replace(/\r/g,'').split('\n').map(v=>v.replace(/\s+/g,' ').trim()).filter(Boolean).filter((v,i,a)=>i===0||v!==a[i-1]).join('\n')}
function useful(text,confidence=100){
  const compact=text.replace(/\s/g,'');if(text.length<3||text.length>1300||!compact||confidence<30)return false;
  const letters=(compact.match(/[A-Za-zÀ-ž]/g)||[]).length;
  const words=(text.match(/[A-Za-z]{2,}/g)||[]),singles=(text.match(/(?:^|\s)[A-Za-z](?=\s|$)/g)||[]);
  if(!words.length||letters/compact.length<.55)return false;
  if(singles.length>Math.max(3,words.length*2))return false;
  return true
}
function protectTerms(text){let out=text;const terms=[];[...GLOSSARY].sort((a,b)=>b.length-a.length).forEach((term,i)=>{const rx=new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');out=out.replace(rx,m=>{const token=`QZX${i}ZXQ`;terms.push([token,m]);return token})});return {text:out,terms}}
function restoreTerms(text,terms){let out=text;terms.forEach(([token,value])=>{out=out.replace(new RegExp(token,'gi'),value);const relaxed=token.split('').join('\\s*');out=out.replace(new RegExp(relaxed,'gi'),value)});return out}
function decodeHtml(v){const d=document.createElement('textarea');d.innerHTML=v;return d.value}
function progress(v,t){$('progressBar').style.width=`${v}%`;$('progressText').textContent=t;$('progressPercent').textContent=`${Math.round(v)}%`}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function splitForTranslation(text,max=420){
  const input=cleanText(text);if(!input)return[];const pieces=[];
  for(const raw of input.split('\n')){let part=raw.trim();while(part.length>max){let cut=part.lastIndexOf(' ',max);if(cut<Math.floor(max*.6))cut=max;pieces.push(part.slice(0,cut).trim());part=part.slice(cut).trim()}if(part)pieces.push(part)}
  const chunks=[];let current='';for(const piece of pieces){const next=current?`${current}\n${piece}`:piece;if(next.length<=max)current=next;else{if(current)chunks.push(current);current=piece}}if(current)chunks.push(current);return chunks
}
async function translateChunk(text){
  const p=protectTerms(text),url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(p.text)}&langpair=en|tr`;
  const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('Ücretsiz web çeviri servisine ulaşılamadı');
  const j=await r.json(),raw=decodeHtml(j?.responseData?.translatedText||'').trim();
  if(!raw)throw new Error('Web çeviri servisi boş yanıt verdi.');
  if(/QUERY LENGTH LIMIT EXCEEDED|MAX ALLOWED QUERY/i.test(raw))throw new Error('Çeviri servis sınırına ulaştı. Daha küçük bir görüntüyle tekrar dene.');
  return restoreTerms(raw,p.terms).replace(/\s+([,.!?;:])/g,'$1').trim()
}
async function translate(text){const chunks=splitForTranslation(text),translated=[];for(const chunk of chunks)translated.push(await translateChunk(chunk));return translated.filter(Boolean).join('\n')}

function collectNested(data){
  const paragraphs=[];for(const block of data?.blocks||[])for(const paragraph of block?.paragraphs||[])if(paragraph?.bbox)paragraphs.push(paragraph);
  if(paragraphs.length)return paragraphs;
  const lines=[];for(const block of data?.blocks||[])for(const paragraph of block?.paragraphs||[])for(const line of paragraph?.lines||[])if(line?.bbox)lines.push(line);
  if(lines.length)return lines;
  if(data?.lines?.length)return data.lines;if(data?.paragraphs?.length)return data.paragraphs;if(data?.blocks?.length)return data.blocks;return []
}
function avgConfidence(item){if(Number.isFinite(item?.confidence))return item.confidence;const lines=item?.lines||[];const nums=lines.map(x=>x.confidence).filter(Number.isFinite);return nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:70}
function mapBBox(bbox,sx,sy){return{x0:bbox.x0*sx,y0:bbox.y0*sy,x1:bbox.x1*sx,y1:bbox.y1*sy}}

async function makeEnhancedCanvas(file){
  const url=URL.createObjectURL(file),img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});URL.revokeObjectURL(url);
  const maxSide=Math.max(img.naturalWidth,img.naturalHeight),scale=Math.max(1.35,Math.min(2.35,3200/maxSide));
  const canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,canvas.width,canvas.height);
  const image=ctx.getImageData(0,0,canvas.width,canvas.height),d=image.data;
  for(let i=0;i<d.length;i+=4){const lum=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];const v=Math.max(0,Math.min(255,(lum-128)*1.42+128));d[i]=d[i+1]=d[i+2]=v}
  ctx.putImageData(image,0,0);return{canvas,scaleX:img.naturalWidth/canvas.width,scaleY:img.naturalHeight/canvas.height,width:img.naturalWidth,height:img.naturalHeight}
}

async function analyze(){
  if(!state.file)return;$('analyzeBtn').disabled=true;$('error').textContent='';state.blocks=[];renderPlainText();renderOverlay();progress(3,'Görüntü yüksek kalite OCR için hazırlanıyor');let worker;
  try{
    if(!window.Tesseract)throw new Error('OCR motoru yüklenemedi. İnternet bağlantısını kontrol edip sayfayı yenile.');
    const enhanced=await makeEnhancedCanvas(state.file);state.sourceWidth=enhanced.width;state.sourceHeight=enhanced.height;progress(8,'Görüntü keskinleştirildi • oyun metinleri aranıyor');
    worker=await Tesseract.createWorker('eng',undefined,{logger:m=>{if(m.status==='recognizing text')progress(10+Math.round((m.progress||0)*45),`Gelişmiş OCR taraması • %${Math.round((m.progress||0)*100)}`)}});
    await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1'});
    const result=await worker.recognize(enhanced.canvas,{}, {text:true,blocks:true});
    const regions=collectNested(result.data);
    let candidates=regions.map(item=>({text:cleanText(item.text||''),confidence:avgConfidence(item),bbox:item.bbox?mapBBox(item.bbox,enhanced.scaleX,enhanced.scaleY):null})).filter(x=>x.bbox&&useful(x.text,x.confidence));
    candidates.sort((a,b)=>a.bbox.y0-b.bbox.y0||a.bbox.x0-b.bbox.x0);candidates=candidates.slice(0,24);
    if(!candidates.length){
      const all=cleanText(result.data.text||'');if(all){const lines=all.split('\n').map(cleanText).filter(v=>useful(v,50)).slice(0,24);const step=Math.max(1,state.sourceHeight/Math.max(lines.length,1));lines.forEach((line,i)=>candidates.push({text:line,confidence:50,bbox:{x0:0,y0:i*step,x1:state.sourceWidth,y1:(i+1)*step},overlay:false}))}
    }
    if(!candidates.length)throw new Error('Okunabilir İngilizce oyun metni bulunamadı. Daha net bir ekran görüntüsü dene.');
    for(let i=0;i<candidates.length;i++){
      progress(58+Math.round(((i+1)/candidates.length)*38),`Türkçeye çevriliyor • ${i+1}/${candidates.length}`);
      try{const translated=await translate(candidates[i].text);if(translated)state.blocks.push({...candidates[i],translated})}catch(e){console.warn('Bölge çevrilemedi',e)}
    }
    if(!state.blocks.length)throw new Error('Metin bulundu ancak web çeviri servisi yanıt vermedi. Birkaç saniye sonra tekrar dene.');
    renderPlainText();renderOverlay();$('viewerSection').hidden=false;progress(100,'Hazır • Görsele dokun, Türkçe katmanı tam ekranda aç');
  }catch(e){$('error').textContent=e.message||String(e);progress(0,'Tekrar deneyebilirsin')}
  finally{if(worker)await worker.terminate();$('analyzeBtn').disabled=!state.file}
}

function renderPlainText(){
  const host=$('translationText');if(!state.blocks.length){host.innerHTML='<div class="empty-translation">Henüz çeviri yok.</div>';return}
  host.innerHTML=state.blocks.map((x,i)=>`<article class="text-result"><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(x.translated)}</p></article>`).join('')
}
function renderOverlay(){
  const img=$('fullImage'),layer=$('fullOverlay');layer.innerHTML='';$('regionCount').textContent=`${state.blocks.length} okunabilir metin`;
  $('modeBadge').textContent=state.showOriginal?'ORİJİNAL':'TÜRKÇE KATMAN';if(state.showOriginal)return;
  const iw=state.sourceWidth||$('preview').naturalWidth||img.naturalWidth||1,ih=state.sourceHeight||$('preview').naturalHeight||img.naturalHeight||1;
  state.blocks.filter(b=>b.overlay!==false).forEach((b,i)=>{
    const el=document.createElement('div');el.className='tr-block';el.dataset.index=String(i+1);el.textContent=b.translated;
    const left=b.bbox.x0/iw*100,top=b.bbox.y0/ih*100,originalWidth=(b.bbox.x1-b.bbox.x0)/iw*100,width=Math.min(72,Math.max(43,originalWidth)),safeLeft=Math.max(0,Math.min(left,100-width));
    el.style.left=`${safeLeft}%`;el.style.top=`${Math.max(0,Math.min(96,top))}%`;el.style.width=`${width}%`;layer.appendChild(el)
  })
}

function setFile(file){
  if(!file?.type?.startsWith('image/'))return;state.file=file;state.blocks=[];state.showOriginal=false;renderPlainText();
  if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);state.imageUrl=URL.createObjectURL(file);
  $('preview').onload=()=>{state.sourceWidth=$('preview').naturalWidth||1;state.sourceHeight=$('preview').naturalHeight||1;$('viewerSection').hidden=false;$('fullImage').src=state.imageUrl;renderOverlay()};
  $('preview').src=state.imageUrl;$('analyzeBtn').disabled=false;progress(0,'Görsel hazır • Türkçeleştir düğmesine dokun');$('fileName').textContent=file.name||'Oyun ekran görüntüsü'
}
function openFullscreen(){if(!$('preview').src)return;$('fullImage').src=$('preview').src;$('fullscreen').hidden=false;document.body.classList.add('modal-open');resetZoom();renderOverlay()}
function closeFullscreen(){$('fullscreen').hidden=true;document.body.classList.remove('modal-open');state.pointers.clear();state.gesture=null}
function applyTransform(){$('zoomCanvas').style.transform=`translate3d(${state.panX}px,${state.panY}px,0) scale(${state.zoom})`;$('zoomValue').textContent=`${Math.round(state.zoom*100)}%`}
function resetZoom(){state.zoom=1;state.panX=0;state.panY=0;applyTransform()}
function setZoom(next){const old=state.zoom;state.zoom=Math.max(1,Math.min(8,next));if(state.zoom===1){state.panX=0;state.panY=0}else if(old>0){const ratio=state.zoom/old;state.panX*=ratio;state.panY*=ratio}applyTransform()}
function pointerDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}function pointerMid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}
function bindZoom(){
  const stage=$('zoomStage');stage.addEventListener('pointerdown',e=>{stage.setPointerCapture(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(state.pointers.size===2){const[a,b]=[...state.pointers.values()];state.gesture={distance:pointerDistance(a,b),mid:pointerMid(a,b),zoom:state.zoom,panX:state.panX,panY:state.panY}}});
  stage.addEventListener('pointermove',e=>{const prev=state.pointers.get(e.pointerId);if(!prev)return;state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(state.pointers.size===1&&state.zoom>1){state.panX+=e.clientX-prev.x;state.panY+=e.clientY-prev.y;applyTransform();return}if(state.pointers.size===2){const[a,b]=[...state.pointers.values()];if(!state.gesture)state.gesture={distance:pointerDistance(a,b),mid:pointerMid(a,b),zoom:state.zoom,panX:state.panX,panY:state.panY};const distance=Math.max(1,pointerDistance(a,b)),mid=pointerMid(a,b);state.zoom=Math.max(1,Math.min(8,state.gesture.zoom*(distance/Math.max(1,state.gesture.distance))));state.panX=state.gesture.panX+(mid.x-state.gesture.mid.x);state.panY=state.gesture.panY+(mid.y-state.gesture.mid.y);if(state.zoom===1){state.panX=0;state.panY=0}applyTransform()}});
  const end=e=>{state.pointers.delete(e.pointerId);state.gesture=null};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('wheel',e=>{e.preventDefault();setZoom(state.zoom*(e.deltaY<0?1.16:.86))},{passive:false});stage.addEventListener('dblclick',()=>state.zoom>1?resetZoom():setZoom(2.5))
}

$('fileInput').addEventListener('change',e=>setFile(e.target.files[0]));$('analyzeBtn').addEventListener('click',analyze);$('viewer').addEventListener('click',openFullscreen);$('closeFull').addEventListener('click',closeFullscreen);$('fullscreen').addEventListener('click',e=>{if(e.target===$('fullscreen'))closeFullscreen()});
$('toggleBtn').addEventListener('click',()=>{state.showOriginal=!state.showOriginal;$('toggleBtn').textContent=state.showOriginal?'TÜRKÇEYİ GÖSTER':'ORİJİNALİ GÖSTER';renderOverlay()});$('zoomIn').addEventListener('click',()=>setZoom(state.zoom*1.35));$('zoomOut').addEventListener('click',()=>setZoom(state.zoom/1.35));$('zoomReset').addEventListener('click',resetZoom);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('fullscreen').hidden)closeFullscreen()});
bindZoom();renderPlainText();progress(0,'Hazır • oyun ekran görüntüsünü seç');if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=0.3').catch(()=>{});
