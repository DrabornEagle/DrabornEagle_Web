/* DraBornPark v1.0.5 — unified public tag polish + camera-only direct message evidence. */
(function(){
  const dkd_tag=(new URLSearchParams(location.search).get('tag')||globalThis.DKDBP_PATH_TAG||'').trim();
  if(!dkd_tag)return;

  const dkd_contact_url='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';
  let dkd_evidence=null;
  let dkd_stream=null;
  let dkd_lookup_started=false;
  let dkd_snapshot=null;

  const dkd_two=dkd_value=>String(dkd_value).padStart(2,'0');
  const dkd_stamp=dkd_date=>`${dkd_two(dkd_date.getDate())}.${dkd_two(dkd_date.getMonth()+1)}.${dkd_date.getFullYear()} ${dkd_two(dkd_date.getHours())}:${dkd_two(dkd_date.getMinutes())}:${dkd_two(dkd_date.getSeconds())}`;

  function dkd_status(dkd_text,dkd_kind='error'){
    const dkd_box=document.getElementById('dkd55-message-status');
    if(!dkd_box)return;
    dkd_box.textContent=dkd_text||'';
    dkd_box.className=`dkd55-message-status is-${dkd_kind}`;
    dkd_box.hidden=!dkd_text;
  }

  async function dkd_api(dkd_payload){
    const dkd_response=await fetch(dkd_contact_url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dkd_payload)});
    let dkd_data=null;try{dkd_data=await dkd_response.json();}catch{}
    if(!dkd_response.ok){
      const dkd_code=String(dkd_data?.error||'request_failed');
      const dkd_map={tag_not_found:'Etiket bulunamadı.',tag_not_available:'Bu etiket şu anda mesaj kabul etmiyor.',rate_limited:'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.',invalid_evidence:'Canlı fotoğraf güvenlik kontrolünden geçemedi.',invalid_evidence_time:'Fotoğraf zamanı doğrulanamadı.',evidence_too_large:'Fotoğraf boyutu çok büyük.'};
      throw new Error(dkd_map[dkd_code]||'İşlem tamamlanamadı. Lütfen tekrar deneyin.');
    }
    return dkd_data||{};
  }

  function dkd_stop_camera(){
    if(dkd_stream){dkd_stream.getTracks().forEach(dkd_track=>dkd_track.stop());dkd_stream=null;}
    const dkd_video=document.getElementById('dkd105-camera-video');if(dkd_video)dkd_video.srcObject=null;
  }

  function dkd_close_camera(){
    dkd_stop_camera();
    document.getElementById('dkd105-camera-modal')?.classList.remove('is-open');
    document.documentElement.classList.remove('dkd105-camera-lock');
  }

  async function dkd_open_camera(){
    dkd_status('');
    if(!navigator.mediaDevices?.getUserMedia){dkd_status('Bu tarayıcı canlı kamera çekimini desteklemiyor.');return;}
    try{
      dkd_stop_camera();
      dkd_stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}});
      const dkd_modal=document.getElementById('dkd105-camera-modal');
      const dkd_video=document.getElementById('dkd105-camera-video');
      if(!dkd_modal||!dkd_video){dkd_stop_camera();return;}
      dkd_video.srcObject=dkd_stream;
      await dkd_video.play();
      dkd_modal.classList.add('is-open');
      document.documentElement.classList.add('dkd105-camera-lock');
    }catch{
      dkd_stop_camera();
      dkd_status('Kamera açılamadı. Tarayıcı kamera iznini kontrol edip tekrar deneyin.');
    }
  }

  function dkd_render_evidence(){
    const dkd_preview=document.getElementById('dkd105-photo-preview');
    const dkd_meta=document.getElementById('dkd105-photo-meta');
    const dkd_button=document.getElementById('dkd105-camera-open');
    if(!dkd_preview||!dkd_meta||!dkd_button)return;
    if(!dkd_evidence){
      dkd_preview.hidden=true;dkd_preview.removeAttribute('src');dkd_meta.hidden=true;dkd_meta.textContent='';
      dkd_button.innerHTML='<i class="ri-camera-3-line"></i><span><b>CANLI FOTOĞRAF ÇEK</b><small>Galeriden seçim yok • anlık çekim</small></span>';
      return;
    }
    dkd_preview.src=dkd_evidence.dataUrl;dkd_preview.hidden=false;dkd_meta.hidden=false;dkd_meta.textContent=`Çekim: ${dkd_evidence.stampLabel}`;
    dkd_button.innerHTML='<i class="ri-camera-switch-line"></i><span><b>YENİDEN ÇEK</b><small>Tarih ve saat fotoğrafın üzerinde</small></span>';
  }

  function dkd_capture(){
    const dkd_video=document.getElementById('dkd105-camera-video');
    if(!dkd_video?.videoWidth||!dkd_video?.videoHeight){dkd_status('Kamera görüntüsü henüz hazır değil. Bir saniye sonra tekrar deneyin.');return;}
    const dkd_max=1600;
    let dkd_width=dkd_video.videoWidth,dkd_height=dkd_video.videoHeight;
    const dkd_scale=Math.min(1,dkd_max/Math.max(dkd_width,dkd_height));dkd_width=Math.round(dkd_width*dkd_scale);dkd_height=Math.round(dkd_height*dkd_scale);
    const dkd_canvas=document.createElement('canvas');dkd_canvas.width=dkd_width;dkd_canvas.height=dkd_height;
    const dkd_ctx=dkd_canvas.getContext('2d');if(!dkd_ctx)return;
    dkd_ctx.drawImage(dkd_video,0,0,dkd_width,dkd_height);
    const dkd_now=new Date();const dkd_label=dkd_stamp(dkd_now);const dkd_text=`DraBornPark • ANLIK KANIT • ${dkd_label}`;
    const dkd_bar=Math.max(64,Math.round(dkd_height*.085));dkd_ctx.fillStyle='rgba(2,5,15,.82)';dkd_ctx.fillRect(0,dkd_height-dkd_bar,dkd_width,dkd_bar);
    const dkd_font=Math.max(20,Math.round(dkd_width*.026));dkd_ctx.font=`800 ${dkd_font}px system-ui,-apple-system,sans-serif`;dkd_ctx.fillStyle='#fff';dkd_ctx.textBaseline='middle';dkd_ctx.fillText(dkd_text,Math.max(18,Math.round(dkd_width*.025)),dkd_height-dkd_bar/2,Math.max(100,dkd_width-Math.round(dkd_width*.05)));
    const dkd_data_url=dkd_canvas.toDataURL('image/jpeg',.82);
    dkd_evidence={dataUrl:dkd_data_url,base64:dkd_data_url.split(',')[1],mime:'image/jpeg',capturedAt:dkd_now.toISOString(),stampLabel:dkd_label};
    dkd_close_camera();dkd_render_evidence();dkd_status('Canlı fotoğraf hazır. Yalnızca bu çekim gönderilecek.','ok');
  }

  function dkd_remove_evidence(){dkd_evidence=null;dkd_render_evidence();dkd_status('');}

  async function dkd_send_direct(){
    const dkd_text=document.getElementById('dkd55-message-text')?.value.trim()||'';
    if(!dkd_text&&!dkd_evidence){dkd_status('Mesaj yazın veya canlı fotoğraf çekin.');return;}
    const dkd_button=document.getElementById('dkd55-message-send');if(!dkd_button||dkd_button.disabled)return;
    dkd_button.disabled=true;dkd_status('');
    const dkd_label=dkd_button.querySelector('span');const dkd_original=dkd_label?.textContent||'ARAÇ SAHİBİNE GÖNDER';if(dkd_label)dkd_label.textContent='GÖNDERİLİYOR…';
    try{
      const dkd_result=await dkd_api({action:'notify',tagCode:dkd_tag,category:'direct_message',message:dkd_text||null,sessionKey:crypto.randomUUID?crypto.randomUUID():String(Date.now()),evidence:dkd_evidence?{base64:dkd_evidence.base64,mime:'image/jpeg',capturedAt:dkd_evidence.capturedAt,stampLabel:`DraBornPark • ANLIK KANIT • ${dkd_evidence.stampLabel}`}:undefined});
      if(dkd_result?.sessionToken)sessionStorage.setItem(`dkd55-message:${dkd_tag.toLowerCase()}`,String(dkd_result.sessionToken));
      const dkd_input=document.getElementById('dkd55-message-text');if(dkd_input)dkd_input.value='';
      dkd_evidence=null;dkd_render_evidence();dkd_status('Mesajınız araç sahibine güvenli şekilde iletildi.','ok');
    }catch(dkd_error){dkd_status(dkd_error?.message||'Mesaj gönderilemedi.');}
    finally{dkd_button.disabled=false;if(dkd_label)dkd_label.textContent=dkd_original;}
  }

  function dkd_camera_markup(){return `<div id="dkd105-camera-modal" class="dkd105-camera-modal" role="dialog" aria-modal="true" aria-label="Canlı kanıt fotoğrafı çek"><div class="dkd105-camera-panel"><div class="dkd105-camera-head"><div><b>Canlı kanıt kamerası</b><small>Galeriden seçim yok • yalnızca o anda çekim</small></div><button id="dkd105-camera-close" type="button" aria-label="Kamerayı kapat"><i class="ri-close-line"></i></button></div><video id="dkd105-camera-video" autoplay muted playsinline></video><div class="dkd105-camera-actions"><button id="dkd105-camera-capture" type="button"><i class="ri-camera-3-line"></i><span>FOTOĞRAF ÇEK</span></button></div></div></div>`;}

  function dkd_install_message_camera(){
    const dkd_panel=document.getElementById('dkd55-message-panel');if(!dkd_panel)return false;
    const dkd_row=dkd_panel.querySelector('.dkd55-photo-row');
    if(dkd_row&&dkd_row.dataset.dkd105Camera!=='1'){
      dkd_row.dataset.dkd105Camera='1';
      dkd_row.innerHTML=`<button id="dkd105-camera-open" class="dkd55-photo-button dkd105-camera-open" type="button"><i class="ri-camera-3-line"></i><span><b>CANLI FOTOĞRAF ÇEK</b><small>Galeriden seçim yok • anlık çekim</small></span></button><div class="dkd105-evidence-preview"><img id="dkd105-photo-preview" class="dkd55-photo-preview" alt="Canlı çekilen kanıt fotoğrafı" hidden><div id="dkd105-photo-meta" class="dkd105-photo-meta" hidden></div><button id="dkd105-photo-remove" class="dkd105-photo-remove" type="button" aria-label="Fotoğrafı kaldır" hidden><i class="ri-delete-bin-6-line"></i></button></div>`;
      document.getElementById('dkd105-camera-open')?.addEventListener('click',dkd_open_camera);
      document.getElementById('dkd105-photo-remove')?.addEventListener('click',dkd_remove_evidence);
      dkd_render_evidence();
    }
    if(!document.getElementById('dkd105-camera-modal')){
      document.body.insertAdjacentHTML('beforeend',dkd_camera_markup());
      document.getElementById('dkd105-camera-close')?.addEventListener('click',dkd_close_camera);
      document.getElementById('dkd105-camera-capture')?.addEventListener('click',dkd_capture);
      document.getElementById('dkd105-camera-modal')?.addEventListener('click',dkd_event=>{if(dkd_event.target?.id==='dkd105-camera-modal')dkd_close_camera();});
    }
    const dkd_send=document.getElementById('dkd55-message-send');
    if(dkd_send&&dkd_send.dataset.dkd105Send!=='1'){
      const dkd_clone=dkd_send.cloneNode(true);dkd_clone.dataset.dkd105Send='1';const dkd_span=dkd_clone.querySelector('span');if(dkd_span)dkd_span.textContent='ARAÇ SAHİBİNE GÖNDER';dkd_send.replaceWith(dkd_clone);dkd_clone.addEventListener('click',dkd_send_direct);
    }
    const dkd_safe=dkd_panel.querySelector('.dkd55-safe span');if(dkd_safe)dkd_safe.textContent='Telefon ve e-posta gibi kişisel bilgiler güvenlik filtresinden geçirilir. Fotoğraf yalnızca canlı kameradan çekilir; tarih ve saat fotoğrafın üzerine işlenir.';
    const dkd_copy=dkd_panel.querySelector('.dkd55-message-copy p');if(dkd_copy)dkd_copy.textContent='Mesajını burada yazabilir, istersen yalnızca canlı kameradan anlık kanıt fotoğrafı çekebilirsin.';
    return true;
  }

  function dkd_install_avatar(dkd_url){
    if(!/^https:\/\//i.test(String(dkd_url||'')))return;
    const dkd_holder=document.querySelector('.dbp47-vehicle .dbp47-car');if(!dkd_holder)return;
    if(dkd_holder.querySelector('img')?.src===dkd_url)return;
    const dkd_img=document.createElement('img');dkd_img.className='dbp47-owner-avatar';dkd_img.alt='Araç sahibinin profil fotoğrafı';dkd_img.loading='eager';dkd_img.referrerPolicy='no-referrer';
    dkd_img.addEventListener('load',()=>{const dkd_dot=document.createElement('span');dkd_dot.className='dbp53-avatar-status';dkd_holder.replaceChildren(dkd_img,dkd_dot);dkd_holder.classList.add('dbp53-has-avatar');},{once:true});
    dkd_img.addEventListener('error',()=>dkd_img.remove(),{once:true});dkd_img.src=dkd_url;
  }

  function dkd_apply_snapshot(dkd_snapshot_value){
    dkd_snapshot=dkd_snapshot_value||dkd_snapshot;
    const dkd_username=String(dkd_snapshot?.username||'').trim();
    const dkd_kicker=document.querySelector('.dbp47-vehicle-copy>.dbp47-kicker');if(dkd_kicker){dkd_kicker.textContent='KORUMALI ARAÇ';dkd_kicker.classList.add('dkd105-protected-badge');}
    document.querySelectorAll('.dkd55-public-badge:not(.is-active)').forEach(dkd_badge=>{dkd_badge.innerHTML=`<i class="ri-user-shield-line"></i> ARAÇ SAHİBİ${dkd_username?` • ${dkd_username}`:''}`;dkd_badge.classList.add('dkd105-owner-badge');});
    const dkd_tag_badge=document.querySelector('.dbp47-tag');if(dkd_tag_badge){dkd_tag_badge.textContent=`Araç Sahibi${dkd_username?` • ${dkd_username}`:''}`;dkd_tag_badge.classList.add('dkd105-owner-tag');}
    dkd_install_avatar(dkd_snapshot?.ownerAvatarUrl);
  }

  async function dkd_load_snapshot(){
    if(dkd_lookup_started)return;dkd_lookup_started=true;
    try{const dkd_data=await dkd_api({action:'lookup',tagCode:dkd_tag});dkd_apply_snapshot(dkd_data?.snapshot||null);}catch{}
  }

  function dkd_sync_text(){
    document.querySelectorAll('#dbp47-send b,#dkd55-message-send span').forEach(dkd_node=>{if(dkd_node.textContent!=='ARAÇ SAHİBİNE GÖNDER')dkd_node.textContent='ARAÇ SAHİBİNE GÖNDER';});
    const dkd_kicker=document.querySelector('.dbp47-vehicle-copy>.dbp47-kicker');if(dkd_kicker&&dkd_kicker.textContent!=='KORUMALI ARAÇ')dkd_kicker.textContent='KORUMALI ARAÇ';
  }

  function dkd_boot(){
    dkd_sync_text();dkd_install_message_camera();if(dkd_snapshot)dkd_apply_snapshot(dkd_snapshot);dkd_load_snapshot();
    const dkd_observer=new MutationObserver(()=>{dkd_sync_text();dkd_install_message_camera();if(dkd_snapshot)dkd_apply_snapshot(dkd_snapshot);});
    dkd_observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>dkd_observer.disconnect(),18000);
  }

  document.addEventListener('keydown',dkd_event=>{if(dkd_event.key==='Escape')dkd_close_camera();});
  window.addEventListener('pagehide',dkd_stop_camera);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)dkd_stop_camera();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',dkd_boot,{once:true});else dkd_boot();
})();
