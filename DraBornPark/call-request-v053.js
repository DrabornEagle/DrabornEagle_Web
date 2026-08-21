/* DraBornPark v0.5.3 — secure camera-only call request flow. */
(function(){
  const rawTag=(new URLSearchParams(location.search).get('tag')||'').trim();
  if(!rawTag)return;

  const CALL_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-call-request';
  const CONTACT_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';
  const STORE_KEY=`dbp53-call:${rawTag.toLowerCase()}`;
  let stream=null;
  let photo=null;
  let sessionToken='';
  let poller=null;
  let installed=false;
  let sending=false;

  const two=n=>String(n).padStart(2,'0');
  const stamp=date=>`${two(date.getDate())}.${two(date.getMonth()+1)}.${date.getFullYear()} ${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
  const safePhone=value=>String(value||'').replace(/[^+0-9]/g,'');

  function stopCamera(){
    if(stream){stream.getTracks().forEach(track=>track.stop());stream=null;}
    const video=document.getElementById('dbp53call-video');if(video)video.srcObject=null;
  }
  function closeCamera(){stopCamera();document.getElementById('dbp53call-camera')?.classList.remove('is-open');}
  function openModal(){document.getElementById('dbp53call-info')?.classList.add('is-open');}
  function closeModal(){document.getElementById('dbp53call-info')?.classList.remove('is-open');}
  function setError(text=''){const el=document.getElementById('dbp53call-error');if(!el)return;el.textContent=text;el.hidden=!text;}

  function mainMarkup(){return `<section class="dbp53call-card" id="dbp53call-card">
    <span class="dbp53call-accent"></span>
    <div class="dbp53call-head"><span class="dbp53call-head-icon"><i class="ri-phone-lock-line"></i></span><div><span class="dbp53call-kicker">GÜVENLİ ARAÇ İLETİŞİMİ</span><h2>Araç sahibine ulaş</h2><p>Telefon numarası varsayılan olarak gizlidir. Arama yalnızca araç sahibi onay verirse açılır.</p></div></div>
    <div class="dbp53call-actions">
      <button id="dbp53call-open" class="dbp53call-action is-call" type="button"><span><i class="ri-phone-line"></i></span><div><b>Acil Arama Talep Et</b><small>Zorunlu canlı fotoğraf ile izin iste</small></div><i class="ri-arrow-right-up-line"></i></button>
      <button id="dbp53call-message" class="dbp53call-action is-message" type="button"><span><i class="ri-message-3-line"></i></span><div><b>Mesaj Gönder</b><small>Yeni Araç Bildirimi ile güvenli mesaj yaz</small></div><i class="ri-arrow-down-line"></i></button>
    </div>
    <div class="dbp53call-trust"><i class="ri-shield-check-line"></i><span>Numara kendiliğinden paylaşılmaz • arama talebi 30 dakika içinde sona erer</span></div>
    <div id="dbp53call-panel" class="dbp53call-panel" hidden>
      <div class="dbp53call-panel-title"><div><span class="dbp53call-kicker">ACİL ARAMA TALEBİ</span><h3>Canlı kanıt fotoğrafı zorunlu</h3><p>Galeriden seçim yapılamaz. Fotoğraf o anda kameradan çekilir ve tarih/saat görüntünün içine işlenir.</p></div><button id="dbp53call-collapse" type="button" aria-label="Arama talebini kapat"><i class="ri-close-line"></i></button></div>
      <button id="dbp53call-camera-open" class="dbp53call-photo-button" type="button"><i class="ri-camera-line"></i><span>Fotoğraf ÇEK</span></button>
      <div id="dbp53call-preview" class="dbp53call-preview" hidden><button id="dbp53call-preview-open" type="button" aria-label="Fotoğrafı büyüt"><img id="dbp53call-image" alt="Arama talebi kanıt fotoğrafı"></button><div><b>Resim hazır</b><small id="dbp53call-time"></small><span>Tarih ve saat fotoğrafın içine işlendi.</span></div><button id="dbp53call-remove" type="button" aria-label="Fotoğrafı kaldır"><i class="ri-delete-bin-6-line"></i></button></div>
      <p id="dbp53call-error" class="dbp53call-error" hidden></p>
      <button id="dbp53call-submit" class="dbp53call-submit" type="button" disabled><i class="ri-phone-find-line"></i><span><b>ARAMA TALEBİNİ GÖNDER</b><small>Araç sahibinin onayı olmadan numara açılmaz</small></span><i class="ri-arrow-right-line"></i></button>
      <div id="dbp53call-live" class="dbp53call-live" hidden>
        <div id="dbp53call-state" class="dbp53call-state is-pending"><i class="ri-time-line"></i><div><b>Yanıt bekleniyor</b><small>Araç sahibi talebi onaylayabilir veya reddedebilir.</small></div></div>
        <a id="dbp53call-phone" class="dbp53call-phone" href="#" hidden><span><i class="ri-phone-fill"></i></span><div><small>NUMARA PAYLAŞIMI AKTİF</small><b id="dbp53call-phone-text"></b><em>Aramak için dokun</em></div><i class="ri-arrow-right-up-line"></i></a>
        <div id="dbp53call-chat" class="dbp53call-chat"><label for="dbp53call-chat-input">Yanıt gelene kadar mesaj gönderebilirsiniz</label><div><input id="dbp53call-chat-input" maxlength="700" placeholder="Kısa bir mesaj yaz…"><button id="dbp53call-chat-send" type="button"><i class="ri-send-plane-2-fill"></i></button></div><small>Telefon ve e-posta bilgileri güvenlik filtresinden geçirilir.</small></div>
      </div>
    </div>
  </section>`;}

  function overlays(){return `<div id="dbp53call-camera" class="dbp53call-camera" role="dialog" aria-modal="true" aria-label="Arama talebi için fotoğraf çek"><div class="dbp53call-camera-panel"><div class="dbp53call-camera-head"><div><b>Arama talebi kanıtı</b><small>Galeriden seçim yok • yalnızca canlı kamera</small></div><button id="dbp53call-camera-close" type="button"><i class="ri-close-line"></i></button></div><video id="dbp53call-video" autoplay muted playsinline></video><div class="dbp53call-camera-actions"><button id="dbp53call-capture" type="button"><i class="ri-camera-3-line"></i><span>Fotoğraf ÇEK</span></button></div></div></div>
  <div id="dbp53call-info" class="dbp53call-info" role="dialog" aria-modal="true"><div class="dbp53call-info-card"><span class="dbp53call-info-icon"><i class="ri-checkbox-circle-line"></i></span><span class="dbp53call-kicker">TALEP OLUŞTURULDU</span><h3>Talebiniz araç sahibine iletildi.</h3><p>Talebinizin cevabı gelene kadar mesaj gönderebilirsiniz. Kullanıcı talebinizi reddedebilir.</p><div class="dbp53call-info-note"><i class="ri-shield-user-line"></i><span>Telefon numarası yalnızca araç sahibi <b>Onayla • Numaramı Paylaş</b> seçeneğini kullanırsa geçici olarak görünür.</span></div><button id="dbp53call-info-message" type="button"><i class="ri-message-3-line"></i> MESAJ YAZ</button><button id="dbp53call-info-ok" type="button">TAMAM</button></div></div>
  <div id="dbp53call-viewer" class="dbp53call-viewer" role="dialog" aria-modal="true"><button id="dbp53call-viewer-close" type="button" aria-label="Fotoğrafı kapat"><i class="ri-close-line"></i></button><img id="dbp53call-viewer-img" alt="Kanıt fotoğrafı tam ekran"><small id="dbp53call-viewer-time"></small></div>`;}

  function updatePhoto(){
    const preview=document.getElementById('dbp53call-preview');const image=document.getElementById('dbp53call-image');const time=document.getElementById('dbp53call-time');const button=document.getElementById('dbp53call-camera-open');const submit=document.getElementById('dbp53call-submit');
    if(!preview||!image||!time||!button||!submit)return;
    if(!photo){preview.hidden=true;image.removeAttribute('src');time.textContent='';button.innerHTML='<i class="ri-camera-line"></i><span>Fotoğraf ÇEK</span>';submit.disabled=true;return;}
    preview.hidden=false;image.src=photo.dataUrl;time.textContent=`Çekim: ${photo.label}`;button.innerHTML='<i class="ri-camera-switch-line"></i><span>YENİDEN ÇEK</span>';submit.disabled=false;
  }

  async function openCamera(){
    setError();if(!navigator.mediaDevices?.getUserMedia){setError('Bu tarayıcı canlı kamera çekimini desteklemiyor.');return;}
    try{stopCamera();stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}});const modal=document.getElementById('dbp53call-camera');const video=document.getElementById('dbp53call-video');if(!modal||!video){stopCamera();return;}video.srcObject=stream;await video.play();modal.classList.add('is-open');}catch{stopCamera();setError('Kamera açılamadı. Tarayıcı kamera iznini kontrol edip tekrar deneyin.');}
  }

  function capture(){
    const video=document.getElementById('dbp53call-video');if(!video?.videoWidth||!video?.videoHeight){setError('Kamera görüntüsü henüz hazır değil. Bir saniye sonra tekrar deneyin.');return;}
    const max=1600;let width=video.videoWidth,height=video.videoHeight;const scale=Math.min(1,max/Math.max(width,height));width=Math.round(width*scale);height=Math.round(height*scale);
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.drawImage(video,0,0,width,height);
    const now=new Date();const label=stamp(now);const text=`DraBornPark • ARAMA TALEBİ • ${label}`;const bar=Math.max(64,Math.round(height*.085));ctx.fillStyle='rgba(2,5,15,.78)';ctx.fillRect(0,height-bar,width,bar);const font=Math.max(20,Math.round(width*.026));ctx.font=`800 ${font}px system-ui,-apple-system,sans-serif`;ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.fillText(text,Math.max(18,Math.round(width*.025)),height-bar/2,Math.max(100,width-Math.round(width*.05)));
    const dataUrl=canvas.toDataURL('image/jpeg',.82);photo={dataUrl,base64:dataUrl.split(',')[1],capturedAt:now.toISOString(),label};closeCamera();updatePhoto();setError();
  }

  function removePhoto(){photo=null;updatePhoto();setError();}
  function openViewer(){if(!photo)return;const viewer=document.getElementById('dbp53call-viewer');const img=document.getElementById('dbp53call-viewer-img');const time=document.getElementById('dbp53call-viewer-time');if(!viewer||!img||!time)return;img.src=photo.dataUrl;time.textContent=`Çekim: ${photo.label}`;viewer.classList.add('is-open');}
  function closeViewer(){document.getElementById('dbp53call-viewer')?.classList.remove('is-open');}

  async function post(url,payload){const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});let data=null;try{data=await response.json()}catch{}if(!response.ok){const code=String(data?.error||'request_failed');const map={evidence_required:'Arama talebi için canlı fotoğraf zorunludur.',invalid_evidence:'Fotoğraf doğrulanamadı. Yeniden çekin.',invalid_evidence_time:'Fotoğraf çok eski veya zamanı doğrulanamadı. Yeniden çekin.',evidence_too_large:'Fotoğraf boyutu çok büyük.',rate_limited:'Çok fazla arama talebi oluşturuldu. Lütfen daha sonra tekrar deneyin.',tag_not_available:'Bu araç şu anda arama talebi kabul etmiyor.'};throw new Error(map[code]||'İşlem tamamlanamadı.');}return data;}

  async function createRequest(){
    if(!photo||sending){setError('Arama talebi göndermek için önce canlı fotoğraf çekmelisiniz.');return;}
    const button=document.getElementById('dbp53call-submit');sending=true;if(button)button.disabled=true;setError();
    try{
      const data=await post(CALL_URL,{action:'create',tagCode:rawTag,sessionKey:crypto.randomUUID?crypto.randomUUID():String(Date.now()),evidence:{base64:photo.base64,mime:'image/jpeg',capturedAt:photo.capturedAt,stampLabel:photo.label}});
      sessionToken=String(data.sessionToken||'');if(!sessionToken)throw new Error('Güvenli oturum oluşturulamadı.');sessionStorage.setItem(STORE_KEY,sessionToken);showLive('pending');startPolling();openModal();photo=null;updatePhoto();
    }catch(error){setError(error?.message||'Arama talebi gönderilemedi.');}
    finally{sending=false;if(button)button.disabled=!photo;}
  }

  function showLive(status,data={}){
    const panel=document.getElementById('dbp53call-panel');const live=document.getElementById('dbp53call-live');const state=document.getElementById('dbp53call-state');const phone=document.getElementById('dbp53call-phone');const chat=document.getElementById('dbp53call-chat');
    if(panel)panel.hidden=false;if(live)live.hidden=false;if(!state||!phone)return;
    state.className=`dbp53call-state is-${status}`;phone.hidden=true;
    if(status==='approved'){
      state.innerHTML='<i class="ri-phone-check-line"></i><div><b>Arama talebi onaylandı</b><small>Araç sahibi numarasını bu geçici oturum için paylaştı.</small></div>';
      if(data.phone){const clean=safePhone(data.phone);phone.href=`tel:${clean}`;document.getElementById('dbp53call-phone-text').textContent=data.phone;phone.hidden=false;}else{state.innerHTML='<i class="ri-information-line"></i><div><b>Talep onaylandı</b><small>Araç sahibinin kayıtlı telefon numarası bulunamadı.</small></div>';}
      if(chat)chat.hidden=true;
    }else if(status==='rejected'){
      state.innerHTML='<i class="ri-phone-off-line"></i><div><b>Talep reddedildi</b><small>Araç sahibi telefon numarasını paylaşmadı.</small></div>';if(chat)chat.hidden=true;sessionStorage.removeItem(STORE_KEY);
    }else if(status==='expired'){
      state.innerHTML='<i class="ri-timer-off-line"></i><div><b>Talep süresi doldu</b><small>Telefon numarası paylaşılmadı. Yeni bir talep oluşturabilirsiniz.</small></div>';if(chat)chat.hidden=true;sessionStorage.removeItem(STORE_KEY);
    }else{
      state.innerHTML='<i class="ri-time-line"></i><div><b>Yanıt bekleniyor</b><small>Talebinizin cevabı gelene kadar mesaj gönderebilirsiniz.</small></div>';if(chat)chat.hidden=false;
    }
  }

  async function checkStatus(){
    if(!sessionToken)return;
    try{const data=await post(CALL_URL,{action:'status',sessionToken});showLive(data.status||'pending',data);if(['approved','rejected','expired'].includes(data.status)){stopPolling();}}
    catch(error){console.warn('[DraBornPark arama talebi] durum kontrolü',error);}
  }
  function startPolling(){stopPolling();void checkStatus();poller=setInterval(checkStatus,1500);}
  function stopPolling(){if(poller){clearInterval(poller);poller=null;}}

  async function sendCallChat(){
    const input=document.getElementById('dbp53call-chat-input');const button=document.getElementById('dbp53call-chat-send');const text=String(input?.value||'').trim();if(!text||!sessionToken||!button)return;button.disabled=true;
    try{await post(CONTACT_URL,{action:'chat',sessionToken,message:text});input.value='';button.innerHTML='<i class="ri-check-line"></i>';setTimeout(()=>{button.innerHTML='<i class="ri-send-plane-2-fill"></i>';},900);}catch(error){setError(error?.message||'Mesaj gönderilemedi.');}finally{button.disabled=false;}
  }

  function openNormalMessage(){
    closeModal();const choice=document.querySelector('.dbp47-choice[data-key="other"]');if(choice){choice.click();setTimeout(()=>document.getElementById('dbp47-compose')?.scrollIntoView({behavior:'smooth',block:'center'}),120);return;}
    document.getElementById('dbp47-choose')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function install(){
    if(installed)return;const privacy=document.querySelector('.dbp47-privacy');if(!privacy)return;
    installed=true;const holder=document.createElement('div');holder.innerHTML=mainMarkup();privacy.replaceWith(holder.firstElementChild);document.body.insertAdjacentHTML('beforeend',overlays());
    document.getElementById('dbp53call-open')?.addEventListener('click',()=>{const p=document.getElementById('dbp53call-panel');if(p){p.hidden=false;p.scrollIntoView({behavior:'smooth',block:'center'});}});
    document.getElementById('dbp53call-message')?.addEventListener('click',openNormalMessage);
    document.getElementById('dbp53call-collapse')?.addEventListener('click',()=>{document.getElementById('dbp53call-panel').hidden=true;});
    document.getElementById('dbp53call-camera-open')?.addEventListener('click',openCamera);document.getElementById('dbp53call-camera-close')?.addEventListener('click',closeCamera);document.getElementById('dbp53call-capture')?.addEventListener('click',capture);document.getElementById('dbp53call-remove')?.addEventListener('click',removePhoto);document.getElementById('dbp53call-preview-open')?.addEventListener('click',openViewer);document.getElementById('dbp53call-submit')?.addEventListener('click',createRequest);document.getElementById('dbp53call-chat-send')?.addEventListener('click',sendCallChat);document.getElementById('dbp53call-chat-input')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();void sendCallChat();}});
    document.getElementById('dbp53call-info-message')?.addEventListener('click',()=>{closeModal();document.getElementById('dbp53call-chat-input')?.focus();document.getElementById('dbp53call-live')?.scrollIntoView({behavior:'smooth',block:'center'});});document.getElementById('dbp53call-info-ok')?.addEventListener('click',closeModal);document.getElementById('dbp53call-camera')?.addEventListener('click',event=>{if(event.target?.id==='dbp53call-camera')closeCamera();});document.getElementById('dbp53call-info')?.addEventListener('click',event=>{if(event.target?.id==='dbp53call-info')closeModal();});document.getElementById('dbp53call-viewer')?.addEventListener('click',event=>{if(event.target?.id==='dbp53call-viewer')closeViewer();});document.getElementById('dbp53call-viewer-close')?.addEventListener('click',closeViewer);
    updatePhoto();const saved=sessionStorage.getItem(STORE_KEY);if(saved){sessionToken=saved;showLive('pending');startPolling();}
  }

  const observer=new MutationObserver(()=>{if(!installed)install();else observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.addEventListener('pagehide',()=>{stopCamera();stopPolling();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCamera();else if(sessionToken&&!poller)startPolling();});
})();
