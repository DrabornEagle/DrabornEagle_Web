/* DraBornPark v0.5.3 — camera-only evidence capture. No gallery picker is used. */
(function(){
  const CONTACT_PART='/functions/v1/drabornpark-public-contact';
  const originalFetch=window.fetch.bind(window);
  let pendingEvidence=null;
  let stream=null;
  let attached=false;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const two=n=>String(n).padStart(2,'0');
  function stampFor(date){return `${two(date.getDate())}.${two(date.getMonth()+1)}.${date.getFullYear()} ${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;}
  function stopCamera(){if(stream){stream.getTracks().forEach(track=>track.stop());stream=null;}const video=document.getElementById('dbp53-video');if(video)video.srcObject=null;}
  function hideCamera(){stopCamera();document.getElementById('dbp53-camera-modal')?.classList.remove('is-open');}
  function setError(text){const el=document.getElementById('dbp53-evidence-error');if(!el)return;el.textContent=text||'';el.hidden=!text;}
  function updatePreview(){const box=document.getElementById('dbp53-evidence-preview');const image=document.getElementById('dbp53-evidence-image');const time=document.getElementById('dbp53-evidence-time');const start=document.getElementById('dbp53-camera-open');if(!box||!image||!time||!start)return;if(!pendingEvidence){box.hidden=true;image.removeAttribute('src');time.textContent='';start.innerHTML='<i class="ri-camera-line"></i><span>ANLIK KANIT FOTOĞRAFI ÇEK</span>';return;}box.hidden=false;image.src=pendingEvidence.dataUrl;time.textContent=`Çekim: ${pendingEvidence.stampLabel}`;start.innerHTML='<i class="ri-camera-switch-line"></i><span>YENİDEN ÇEK</span>';}

  async function openCamera(){
    setError('');
    if(!navigator.mediaDevices?.getUserMedia){setError('Bu tarayıcı canlı kamera çekimini desteklemiyor. Lütfen güncel bir mobil tarayıcı kullanın.');return;}
    try{
      stopCamera();
      stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}});
      const modal=document.getElementById('dbp53-camera-modal');const video=document.getElementById('dbp53-video');if(!modal||!video){stopCamera();return;}
      video.srcObject=stream;await video.play();modal.classList.add('is-open');
    }catch(error){stopCamera();setError('Kamera açılamadı. Tarayıcı kamera iznini kontrol edip tekrar deneyin.');}
  }

  function capture(){
    const video=document.getElementById('dbp53-video');if(!video||!video.videoWidth||!video.videoHeight){setError('Kamera görüntüsü henüz hazır değil. Bir saniye sonra tekrar deneyin.');return;}
    const max=1600;let width=video.videoWidth;let height=video.videoHeight;const scale=Math.min(1,max/Math.max(width,height));width=Math.round(width*scale);height=Math.round(height*scale);
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)return;
    ctx.drawImage(video,0,0,width,height);
    const now=new Date();const stamp=stampFor(now);const label=`DraBornPark • ANLIK KANIT • ${stamp}`;
    const bar=Math.max(62,Math.round(height*.085));ctx.fillStyle='rgba(2,5,15,.76)';ctx.fillRect(0,height-bar,width,bar);
    const fontSize=Math.max(20,Math.round(width*.026));ctx.font=`800 ${fontSize}px system-ui, -apple-system, sans-serif`;ctx.fillStyle='#ffffff';ctx.textBaseline='middle';ctx.fillText(label,Math.max(18,Math.round(width*.025)),height-bar/2,Math.max(100,width-Math.round(width*.05)));
    const dataUrl=canvas.toDataURL('image/jpeg',.82);pendingEvidence={dataUrl,base64:dataUrl.split(',')[1],mime:'image/jpeg',capturedAt:now.toISOString(),stampLabel:stamp};
    hideCamera();updatePreview();setError('');
  }

  function removeEvidence(){pendingEvidence=null;updatePreview();setError('');}

  function cameraMarkup(){return `<div id="dbp53-camera-modal" class="dbp53-camera-modal" role="dialog" aria-modal="true" aria-label="Anlık kanıt fotoğrafı çek"><div class="dbp53-camera-panel"><div class="dbp53-camera-head"><div><b>Anlık kanıt kamerası</b><small>Galeriden seçim yok • yalnızca canlı kamera</small></div><button id="dbp53-camera-close" type="button" aria-label="Kamerayı kapat"><i class="ri-close-line"></i></button></div><video id="dbp53-video" autoplay muted playsinline></video><div class="dbp53-camera-actions"><button id="dbp53-capture" type="button"><i class="ri-camera-3-line"></i><span>FOTOĞRAF ÇEK</span></button></div></div></div>`;}
  function evidenceMarkup(){return `<section id="dbp53-evidence" class="dbp53-evidence"><div class="dbp53-evidence-head"><span class="dbp53-camera-icon"><i class="ri-camera-check-line"></i></span><div><b>Kanıt fotoğrafı ekle</b><small>İsteğe bağlı • yalnızca o anda canlı kameradan çekilir</small></div></div><button id="dbp53-camera-open" class="dbp53-camera-open" type="button"><i class="ri-camera-line"></i><span>ANLIK KANIT FOTOĞRAFI ÇEK</span></button><div id="dbp53-evidence-preview" class="dbp53-evidence-preview" hidden><img id="dbp53-evidence-image" alt="Çekilen kanıt fotoğrafı"><div><b>Kanıt hazır</b><small id="dbp53-evidence-time"></small><span>Tarih ve saat fotoğrafın içine işlendi.</span></div><button id="dbp53-evidence-remove" type="button" aria-label="Kanıt fotoğrafını kaldır"><i class="ri-delete-bin-6-line"></i></button></div><p id="dbp53-evidence-error" class="dbp53-evidence-error" hidden></p><div class="dbp53-evidence-note"><i class="ri-shield-check-line"></i><span>Fotoğraf özel olarak saklanır ve yalnızca ilgili araç hesabında görüntülenebilir.</span></div></section>`;}

  function attach(){
    if(attached)return;
    const compose=document.getElementById('dbp47-compose');const textarea=document.getElementById('dbp47-message');if(!compose||!textarea)return;
    attached=true;
    const holder=document.createElement('div');holder.innerHTML=evidenceMarkup();textarea.insertAdjacentElement('afterend',holder.firstElementChild);
    document.body.insertAdjacentHTML('beforeend',cameraMarkup());
    document.getElementById('dbp53-camera-open')?.addEventListener('click',openCamera);
    document.getElementById('dbp53-camera-close')?.addEventListener('click',hideCamera);
    document.getElementById('dbp53-capture')?.addEventListener('click',capture);
    document.getElementById('dbp53-evidence-remove')?.addEventListener('click',removeEvidence);
    document.getElementById('dbp53-camera-modal')?.addEventListener('click',event=>{if(event.target?.id==='dbp53-camera-modal')hideCamera();});
    updatePreview();
  }

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:String(input?.url||'');
    if(url.includes(CONTACT_PART)&&init?.body&&typeof init.body==='string'){
      try{
        const payload=JSON.parse(init.body);
        if(payload?.action==='notify'&&pendingEvidence){payload.evidence={base64:pendingEvidence.base64,mime:'image/jpeg',capturedAt:pendingEvidence.capturedAt,stampLabel:pendingEvidence.stampLabel};init={...init,body:JSON.stringify(payload)};}
        const response=await originalFetch(input,init);
        if(response.ok&&payload?.action==='notify'&&pendingEvidence){pendingEvidence=null;setTimeout(()=>{updatePreview();const success=document.getElementById('dbp47-success');if(success&&!document.getElementById('dbp53-sent-note')){const note=document.createElement('div');note.id='dbp53-sent-note';note.className='dbp53-sent-note';note.innerHTML='<i class="ri-camera-check-line"></i><span>Anlık kanıt fotoğrafı güvenli şekilde araç sahibine gönderildi.</span>';success.querySelector('.dbp47-chat')?.insertAdjacentElement('beforebegin',note);}},120);}
        return response;
      }catch(error){if(error instanceof SyntaxError)return originalFetch(input,init);throw error;}
    }
    return originalFetch(input,init);
  };

  const observer=new MutationObserver(()=>attach());observer.observe(document.documentElement,{childList:true,subtree:true});attach();
  window.addEventListener('pagehide',stopCamera);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCamera();});
})();
