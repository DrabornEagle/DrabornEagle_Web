const VERSION='0.4';
const GEMINI_ENDPOINT='https://guuwomvszlwhkmstewfl.supabase.co/functions/v1/dkd-portal-gemini-translate';
const $=id=>document.getElementById(id);
const state={file:null,blocks:[],showOriginal:false,imageUrl:null,zoom:1,panX:0,panY:0,pointers:new Map(),gesture:null,sourceWidth:1,sourceHeight:1};

function progress(v,t){$('progressBar').style.width=`${v}%`;$('progressText').textContent=t;$('progressPercent').textContent=`${Math.round(v)}%`}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function cleanText(s=''){return String(s).replace(/\s+/g,' ').trim()}

async function prepareGeminiImage(file){
  const url=URL.createObjectURL(file),img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
  URL.revokeObjectURL(url);
  const maxSide=1800,ratio=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  const dataUrl=canvas.toDataURL('image/jpeg',.9);
  return {base64:dataUrl.split(',')[1],mimeType:'image/jpeg'}
}

async function analyze(){
  if(!state.file)return;
  $('analyzeBtn').disabled=true;$('error').textContent='';state.blocks=[];renderPlainText();renderOverlay();
  try{
    progress(10,'Görüntü Gemini için hazırlanıyor');
    const prepared=await prepareGeminiImage(state.file);
    progress(28,'Gemini 3.1 Flash-Lite oyun metinlerini okuyor ve çeviriyor');
    const response=await fetch(GEMINI_ENDPOINT,{
      method:'POST',
      headers:{'content-type':'application/json','x-drabornportal-client':'web'},
      body:JSON.stringify({mode:'image',mime_type:prepared.mimeType,image_base64:prepared.base64})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok||!payload?.ok)throw new Error('Gemini çeviri servisine ulaşılamadı. Tekrar dene.');
    progress(82,'Türkçe metinler görüntüye yerleştiriliyor');
    const iw=state.sourceWidth||$('preview').naturalWidth||1,ih=state.sourceHeight||$('preview').naturalHeight||1;
    state.blocks=(Array.isArray(payload.items)?payload.items:[]).map(item=>{
      const left=Math.max(0,Math.min(1000,Number(item.left)||0)),top=Math.max(0,Math.min(1000,Number(item.top)||0));
      const right=Math.max(left+1,Math.min(1000,Number(item.right)||0)),bottom=Math.max(top+1,Math.min(1000,Number(item.bottom)||0));
      return {
        text:cleanText(item.source),translated:cleanText(item.translated),
        bbox:{x0:left/1000*iw,y0:top/1000*ih,x1:right/1000*iw,y1:bottom/1000*ih}
      }
    }).filter(x=>x.text&&x.translated&&x.bbox.x1>x.bbox.x0&&x.bbox.y1>x.bbox.y0)
      .sort((a,b)=>a.bbox.y0-b.bbox.y0||a.bbox.x0-b.bbox.x0);
    if(!state.blocks.length)throw new Error('Gemini bu görüntüde çevrilecek anlamlı görev metni bulamadı.');
    renderPlainText();renderOverlay();$('viewerSection').hidden=false;progress(100,`Hazır • ${state.blocks.length} anlamlı oyun metni çevrildi`);
  }catch(e){$('error').textContent=e.message||String(e);progress(0,'Tekrar deneyebilirsin')}
  finally{$('analyzeBtn').disabled=!state.file}
}

function renderPlainText(){
  const host=$('translationText');
  if(!state.blocks.length){host.innerHTML='<div class="empty-translation">Henüz çeviri yok.</div>';return}
  host.innerHTML=state.blocks.map((x,i)=>`<article class="text-result"><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(x.translated)}</p></article>`).join('')
}

function fitOverlayText(el,start){
  let fitted=Math.max(3,Math.min(13,start));el.style.fontSize=`${fitted}px`;el.style.lineHeight='1.03';
  let guard=0;
  while(fitted>2.5&&(el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1)&&guard++<50){fitted-=.25;el.style.fontSize=`${fitted}px`}
}

function renderOverlay(){
  const img=$('fullImage'),layer=$('fullOverlay');layer.innerHTML='';
  $('regionCount').textContent=`${state.blocks.length} anlamlı metin çevrildi`;
  $('modeBadge').textContent=state.showOriginal?'ORİJİNAL':'TÜRKÇE KATMAN';if(state.showOriginal)return;
  const iw=state.sourceWidth||$('preview').naturalWidth||img.naturalWidth||1,ih=state.sourceHeight||$('preview').naturalHeight||img.naturalHeight||1;
  const displayH=img.clientHeight||$('preview').clientHeight||ih,sy=displayH/ih;
  state.blocks.forEach(b=>{
    const el=document.createElement('div');el.className='tr-block';el.textContent=b.translated;
    const bw=Math.max(1,b.bbox.x1-b.bbox.x0),bh=Math.max(1,b.bbox.y1-b.bbox.y0);
    const padX=Math.min(bw*.02,3),padY=Math.min(bh*.08,2);
    el.style.left=`${Math.max(0,b.bbox.x0-padX)/iw*100}%`;el.style.top=`${Math.max(0,b.bbox.y0-padY)/ih*100}%`;
    el.style.width=`${Math.min(iw, bw+padX*2)/iw*100}%`;el.style.height=`${Math.min(ih,bh+padY*2)/ih*100}%`;
    layer.appendChild(el);fitOverlayText(el,bh*sy*.62)
  })
}

function setFile(file){
  if(!file?.type?.startsWith('image/'))return;state.file=file;state.blocks=[];state.showOriginal=false;renderPlainText();
  if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);state.imageUrl=URL.createObjectURL(file);
  $('preview').onload=()=>{state.sourceWidth=$('preview').naturalWidth||1;state.sourceHeight=$('preview').naturalHeight||1;$('viewerSection').hidden=false;$('fullImage').src=state.imageUrl;renderOverlay()};
  $('preview').src=state.imageUrl;$('analyzeBtn').disabled=false;progress(0,'Görsel hazır • Gemini ile Türkçeleştir');$('fileName').textContent=file.name||'Oyun ekran görüntüsü'
}
function openFullscreen(){if(!$('preview').src)return;$('fullImage').src=$('preview').src;$('fullscreen').hidden=false;document.body.classList.add('modal-open');resetZoom();requestAnimationFrame(renderOverlay)}
function closeFullscreen(){$('fullscreen').hidden=true;document.body.classList.remove('modal-open');state.pointers.clear();state.gesture=null}
function applyTransform(){$('zoomCanvas').style.transform=`translate3d(${state.panX}px,${state.panY}px,0) scale(${state.zoom})`;$('zoomValue').textContent=`${Math.round(state.zoom*100)}%`}
function resetZoom(){state.zoom=1;state.panX=0;state.panY=0;applyTransform()}
function setZoom(next){const old=state.zoom;state.zoom=Math.max(1,Math.min(8,next));if(state.zoom===1){state.panX=0;state.panY=0}else if(old>0){const ratio=state.zoom/old;state.panX*=ratio;state.panY*=ratio}applyTransform()}
function pointerDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function pointerMid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}
function bindZoom(){
  const stage=$('zoomStage');
  stage.addEventListener('pointerdown',e=>{stage.setPointerCapture(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(state.pointers.size===2){const[a,b]=[...state.pointers.values()];state.gesture={distance:pointerDistance(a,b),mid:pointerMid(a,b),zoom:state.zoom,panX:state.panX,panY:state.panY}}});
  stage.addEventListener('pointermove',e=>{const prev=state.pointers.get(e.pointerId);if(!prev)return;state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(state.pointers.size===1&&state.zoom>1){state.panX+=e.clientX-prev.x;state.panY+=e.clientY-prev.y;applyTransform();return}if(state.pointers.size===2){const[a,b]=[...state.pointers.values()];if(!state.gesture)state.gesture={distance:pointerDistance(a,b),mid:pointerMid(a,b),zoom:state.zoom,panX:state.panX,panY:state.panY};const distance=Math.max(1,pointerDistance(a,b)),mid=pointerMid(a,b);state.zoom=Math.max(1,Math.min(8,state.gesture.zoom*(distance/Math.max(1,state.gesture.distance))));state.panX=state.gesture.panX+(mid.x-state.gesture.mid.x);state.panY=state.gesture.panY+(mid.y-state.gesture.mid.y);if(state.zoom===1){state.panX=0;state.panY=0}applyTransform()}});
  const end=e=>{state.pointers.delete(e.pointerId);state.gesture=null};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  stage.addEventListener('wheel',e=>{e.preventDefault();setZoom(state.zoom*(e.deltaY<0?1.16:.86))},{passive:false});stage.addEventListener('dblclick',()=>state.zoom>1?resetZoom():setZoom(2.5))
}

$('fileInput').addEventListener('change',e=>setFile(e.target.files[0]));$('analyzeBtn').addEventListener('click',analyze);$('viewer').addEventListener('click',openFullscreen);$('closeFull').addEventListener('click',closeFullscreen);
$('fullscreen').addEventListener('click',e=>{if(e.target===$('fullscreen'))closeFullscreen()});
$('toggleBtn').addEventListener('click',()=>{state.showOriginal=!state.showOriginal;$('toggleBtn').textContent=state.showOriginal?'TÜRKÇEYİ GÖSTER':'ORİJİNALİ GÖSTER';renderOverlay()});
$('zoomIn').addEventListener('click',()=>setZoom(state.zoom*1.35));$('zoomOut').addEventListener('click',()=>setZoom(state.zoom/1.35));$('zoomReset').addEventListener('click',resetZoom);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('fullscreen').hidden)closeFullscreen()});
bindZoom();renderPlainText();progress(0,'Hazır • oyun ekran görüntüsünü seç');
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=0.4').catch(()=>{});
