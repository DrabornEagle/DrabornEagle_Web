/* DraBornPark web v0.5.5 — direct secure message + premium protected vehicle card for every ?tag= link. */
(function(){
  const dkd_raw_tag=(new URLSearchParams(location.search).get('tag')||'').trim();
  if(!dkd_raw_tag)return;
  const dkd_contact_url='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';
  const dkd_state={photo:null,sending:false};

  function dkd_escape(dkd_value){return String(dkd_value??'').replace(/[&<>'"]/g,dkd_char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[dkd_char]));}
  function dkd_status(dkd_text,dkd_kind='error'){
    const dkd_box=document.getElementById('dkd55-message-status');if(!dkd_box)return;
    dkd_box.textContent=dkd_text;dkd_box.className=`dkd55-message-status is-${dkd_kind}`;dkd_box.hidden=!dkd_text;
  }
  function dkd_set_preview(){
    const dkd_img=document.getElementById('dkd55-photo-preview');const dkd_button=document.getElementById('dkd55-photo-button');
    if(!dkd_img||!dkd_button)return;
    if(!dkd_state.photo){dkd_img.hidden=true;dkd_img.removeAttribute('src');dkd_button.querySelector('b').textContent='FOTOĞRAF EKLE';return;}
    dkd_img.src=dkd_state.photo.dataUrl;dkd_img.hidden=false;dkd_button.querySelector('b').textContent='FOTOĞRAFI DEĞİŞTİR';
  }
  async function dkd_file_to_jpeg(dkd_file){
    if(!dkd_file)return null;
    if(!String(dkd_file.type||'').startsWith('image/'))throw new Error('Lütfen bir fotoğraf seçin.');
    if(dkd_file.size>8*1024*1024)throw new Error('Fotoğraf çok büyük. 8 MB veya daha küçük bir görsel seçin.');
    const dkd_data_url=await new Promise((dkd_resolve,dkd_reject)=>{const dkd_reader=new FileReader();dkd_reader.onload=()=>dkd_resolve(String(dkd_reader.result||''));dkd_reader.onerror=()=>dkd_reject(new Error('Fotoğraf okunamadı.'));dkd_reader.readAsDataURL(dkd_file);});
    const dkd_image=await new Promise((dkd_resolve,dkd_reject)=>{const dkd_img=new Image();dkd_img.onload=()=>dkd_resolve(dkd_img);dkd_img.onerror=()=>dkd_reject(new Error('Fotoğraf açılamadı.'));dkd_img.src=dkd_data_url;});
    const dkd_max=1600;const dkd_scale=Math.min(1,dkd_max/Math.max(dkd_image.naturalWidth||1,dkd_image.naturalHeight||1));const dkd_width=Math.max(1,Math.round((dkd_image.naturalWidth||1)*dkd_scale));const dkd_height=Math.max(1,Math.round((dkd_image.naturalHeight||1)*dkd_scale));
    const dkd_canvas=document.createElement('canvas');dkd_canvas.width=dkd_width;dkd_canvas.height=dkd_height;const dkd_ctx=dkd_canvas.getContext('2d');if(!dkd_ctx)throw new Error('Fotoğraf hazırlanamadı.');dkd_ctx.drawImage(dkd_image,0,0,dkd_width,dkd_height);
    const dkd_output=dkd_canvas.toDataURL('image/jpeg',.8);return{dataUrl:dkd_output,base64:dkd_output.split(',')[1],capturedAt:new Date().toISOString()};
  }
  async function dkd_api(dkd_payload){
    const dkd_response=await fetch(dkd_contact_url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dkd_payload)});let dkd_data=null;try{dkd_data=await dkd_response.json()}catch{}
    if(!dkd_response.ok){const dkd_code=String(dkd_data?.error||'request_failed');const dkd_map={tag_not_found:'Etiket bulunamadı.',tag_not_available:'Bu etiket şu anda mesaj kabul etmiyor.',rate_limited:'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.',invalid_evidence:'Fotoğraf güvenlik kontrolünden geçemedi.',invalid_evidence_time:'Fotoğraf zamanı doğrulanamadı.',evidence_too_large:'Fotoğraf boyutu çok büyük.'};throw new Error(dkd_map[dkd_code]||'Mesaj gönderilemedi. Lütfen tekrar deneyin.');}
    return dkd_data||{};
  }

  function dkd_panel_markup(){return `<section id="dkd55-message-panel" class="dkd55-message-panel" hidden>
    <div class="dkd55-message-head"><span class="dkd55-message-icon"><i class="ri-message-3-line"></i></span><div class="dkd55-message-copy"><span class="dkd55-kicker">DOĞRUDAN GÜVENLİ MESAJ</span><h3>Araç sahibine mesaj yaz</h3><p>Yeni Araç Bildirimi kartına yönlendirilmez. Mesajını burada yazabilir, istersen fotoğraf ekleyebilirsin.</p></div><button id="dkd55-message-close" class="dkd55-close" type="button" aria-label="Mesaj alanını kapat"><i class="ri-close-line"></i></button></div>
    <textarea id="dkd55-message-text" class="dkd55-textarea" maxlength="700" placeholder="Mesajınızı buraya yazın…"></textarea>
    <div class="dkd55-photo-row"><input id="dkd55-photo-input" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" hidden><button id="dkd55-photo-button" class="dkd55-photo-button" type="button"><i class="ri-camera-add-line"></i><span><b>FOTOĞRAF EKLE</b><small>JPG, PNG veya WebP • isteğe bağlı</small></span></button><img id="dkd55-photo-preview" class="dkd55-photo-preview" alt="Seçilen fotoğraf" hidden></div>
    <div class="dkd55-safe"><i class="ri-shield-check-line"></i><span>Telefon ve e-posta gibi kişisel bilgiler otomatik güvenlik filtresinden geçirilir. Fotoğraf private DraBornPark alanında tutulur.</span></div>
    <div id="dkd55-message-status" class="dkd55-message-status" hidden></div>
    <button id="dkd55-message-send" class="dkd55-send" type="button"><i class="ri-send-plane-2-fill"></i><span>ARAÇ SAHİBİNE GÜVENLİ GÖNDER</span></button>
  </section>`;}

  function dkd_shop_links_markup(dkd_compact=false){
    const dkd_class=dkd_compact?'dkd55-protect-grid':'dkd55-shop-grid';
    const dkd_item=dkd_compact?'dkd55-protect-shop':'dkd55-shop';
    return `<div class="${dkd_class}">
      <a class="${dkd_item} is-trendyol" href="https://www.trendyol.com/" target="_blank" rel="noopener"><i class="ri-shopping-bag-3-line"></i><span><b>Trendyol</b><small>Örnek satış bağlantısı</small></span><em>↗</em></a>
      <a class="${dkd_item} is-hepsiburada" href="https://www.hepsiburada.com/" target="_blank" rel="noopener"><i class="ri-shopping-cart-2-line"></i><span><b>Hepsiburada</b><small>Örnek satış bağlantısı</small></span><em>↗</em></a>
      <a class="${dkd_item} is-amazon" href="https://www.amazon.com.tr/" target="_blank" rel="noopener"><i class="ri-store-2-line"></i><span><b>Amazon</b><small>Örnek satış bağlantısı</small></span><em>↗</em></a>
      <a class="${dkd_item} is-future" href="./shop/"><i class="ri-store-3-line"></i><span><b>DraBornPark Mağaza</b><small>Kendi e-ticaret alanımız • yakında</small></span><em>→</em></a>
    </div>`;
  }

  function dkd_promo_markup(){return `<section id="dkd55-promo" class="dkd55-promo"><div class="dkd55-promo-head"><span class="dkd55-promo-icon"><i class="ri-shield-star-line"></i></span><div><span class="dkd55-kicker" style="color:#ffd757">DRABORNPARK • ARAÇ GÜVENLİĞİ</span><h3>Senin aracında da DraBornPark olsun</h3><p>Bu sayfayı bir QR/NFC etiketiyle açtıysan, kendi aracın için de DraBornPark etiketi edinebilirsin.</p></div></div>${dkd_shop_links_markup(false)}<p class="dkd55-promo-note">Örnek bağlantılar resmî satıcı/iş ortaklığı gösterimi değildir. DraBornPark Mağaza alanı ileride kendi e-ticaret sitemize bağlanacaktır.</p></section>`;}

  function dkd_protect_modal_markup(){return `<div id="dkd55-protect-modal" class="dkd55-protect-modal" aria-hidden="true"><button class="dkd55-protect-backdrop" type="button" data-dkd-close="true" aria-label="Pencereyi kapat"></button><section class="dkd55-protect-sheet" role="dialog" aria-modal="true" aria-labelledby="dkd55-protect-title"><div class="dkd55-protect-spectrum"><i></i><i></i><i></i><i></i><i></i></div><button id="dkd55-protect-close" class="dkd55-protect-close" type="button" aria-label="Kapat"><i class="ri-close-line"></i></button><div class="dkd55-protect-hero"><span class="dkd55-protect-orbit"><i class="ri-shield-star-line"></i></span><div><span class="dkd55-kicker">DRABORNPARK ETİKET AĞI</span><h2 id="dkd55-protect-title">Sen de aracını koru.</h2><p>Telefon numaranı camda bırakmadan ulaşılabilir ol. NFC + QR etiketiyle aracını DraBornPark güvenli iletişim ağına bağla.</p></div></div><div class="dkd55-protect-benefits"><span><i class="ri-phone-lock-line"></i> Numaran gizli</span><span><i class="ri-nfc-line"></i> NFC + QR</span><span><i class="ri-notification-3-line"></i> Anlık bildirim</span></div><div class="dkd55-protect-label">ETİKETİ NEREDEN ALABİLİRSİN?</div>${dkd_shop_links_markup(true)}<div class="dkd55-protect-note"><i class="ri-information-line"></i><span>Şimdilik örnek satış bağlantıları kullanılıyor. Kendi DraBornPark e-ticaret mağazamız hazır olduğunda yeşil mağaza alanı doğrudan oraya bağlanacak.</span></div></section></div>`;}

  function dkd_install_badges(){
    const dkd_copy=document.querySelector('.dbp47-vehicle-copy');if(!dkd_copy||dkd_copy.querySelector('.dkd55-public-badges'))return;
    const dkd_badges=document.createElement('div');dkd_badges.className='dkd55-public-badges';dkd_badges.innerHTML='<span class="dkd55-public-badge"><i class="ri-user-shield-line"></i> ARAÇ SAHİBİ •</span><span class="dkd55-public-badge is-active"><i class="ri-nfc-line"></i> NFC + QR • AKTİF</span>';dkd_copy.appendChild(dkd_badges);
  }

  function dkd_close_protect_modal(){
    const dkd_modal=document.getElementById('dkd55-protect-modal');if(!dkd_modal)return;
    dkd_modal.classList.remove('is-open');dkd_modal.setAttribute('aria-hidden','true');document.documentElement.classList.remove('dkd55-modal-lock');
  }
  function dkd_open_protect_modal(){
    const dkd_modal=document.getElementById('dkd55-protect-modal');if(!dkd_modal)return;
    dkd_modal.classList.add('is-open');dkd_modal.setAttribute('aria-hidden','false');document.documentElement.classList.add('dkd55-modal-lock');setTimeout(()=>document.getElementById('dkd55-protect-close')?.focus(),80);
  }

  function dkd_upgrade_vehicle_card(){
    const dkd_vehicle=document.querySelector('.dbp47-vehicle');if(!dkd_vehicle)return false;
    if(!dkd_vehicle.classList.contains('dkd55-vehicle-premium')){
      dkd_vehicle.classList.add('dkd55-vehicle-premium');
      dkd_vehicle.insertAdjacentHTML('afterbegin','<span class="dkd55-vehicle-aurora dkd55-vehicle-aurora-a"></span><span class="dkd55-vehicle-aurora dkd55-vehicle-aurora-b"></span><span class="dkd55-vehicle-scan"></span><div class="dkd55-vehicle-spectrum"><i></i><i></i><i></i><i></i><i></i></div>');
      const dkd_cta=document.createElement('button');dkd_cta.type='button';dkd_cta.id='dkd55-protect-badge';dkd_cta.className='dkd55-protect-badge';dkd_cta.innerHTML='<span><i class="ri-shield-star-line"></i></span><b>SEN DE ARACINI KORU</b><em>→</em>';dkd_vehicle.appendChild(dkd_cta);
    }
    if(!document.getElementById('dkd55-protect-modal'))document.body.insertAdjacentHTML('beforeend',dkd_protect_modal_markup());
    dkd_install_badges();
    return true;
  }

  function dkd_bind_message_panel(dkd_panel){
    if(!dkd_panel||dkd_panel.dataset.dkdBound==='1')return;
    dkd_panel.dataset.dkdBound='1';
    document.getElementById('dkd55-message-close')?.addEventListener('click',()=>{dkd_panel.hidden=true;});
    document.getElementById('dkd55-photo-button')?.addEventListener('click',()=>document.getElementById('dkd55-photo-input')?.click());
    document.getElementById('dkd55-photo-input')?.addEventListener('change',async dkd_event=>{dkd_status('');try{const dkd_file=dkd_event.target.files?.[0];dkd_state.photo=await dkd_file_to_jpeg(dkd_file);dkd_set_preview();}catch(dkd_error){dkd_state.photo=null;dkd_set_preview();dkd_status(dkd_error?.message||'Fotoğraf hazırlanamadı.');}});
    document.getElementById('dkd55-message-send')?.addEventListener('click',dkd_send);
  }

  function dkd_install_panel(){
    const dkd_message_button=document.getElementById('dbp53call-message');if(!dkd_message_button)return false;
    const dkd_small=dkd_message_button.querySelector('small');if(dkd_small)dkd_small.textContent='Kendi güvenli mesajını yaz • fotoğraf ekleyebilirsin';
    let dkd_panel=document.getElementById('dkd55-message-panel');if(!dkd_panel){dkd_message_button.closest('.dbp53call-actions')?.insertAdjacentHTML('afterend',dkd_panel_markup());dkd_panel=document.getElementById('dkd55-message-panel');}
    if(!document.getElementById('dkd55-promo')){const dkd_root=document.querySelector('.dbp47-app');const dkd_footer=dkd_root?.querySelector('.dbp47-footer');if(dkd_footer)dkd_footer.insertAdjacentHTML('beforebegin',dkd_promo_markup());else document.querySelector('#tag-shell')?.insertAdjacentHTML('beforeend',dkd_promo_markup());}
    dkd_upgrade_vehicle_card();dkd_bind_message_panel(dkd_panel);return true;
  }

  async function dkd_send(){
    if(dkd_state.sending)return;const dkd_text=document.getElementById('dkd55-message-text')?.value.trim()||'';if(!dkd_text&&!dkd_state.photo){dkd_status('Mesaj yazın veya bir fotoğraf ekleyin.');return;}
    const dkd_button=document.getElementById('dkd55-message-send');dkd_state.sending=true;if(dkd_button)dkd_button.disabled=true;dkd_status('');
    try{const dkd_result=await dkd_api({action:'notify',tagCode:dkd_raw_tag,category:'direct_message',message:dkd_text||null,sessionKey:crypto.randomUUID?crypto.randomUUID():String(Date.now()),evidence:dkd_state.photo?{base64:dkd_state.photo.base64,mime:'image/jpeg',capturedAt:dkd_state.photo.capturedAt,stampLabel:'DraBornPark v0.5.5 • Güvenli Araç İletişimi'}:undefined});dkd_status('Mesajınız araç sahibine güvenli şekilde iletildi.','ok');const dkd_input=document.getElementById('dkd55-message-text');if(dkd_input)dkd_input.value='';dkd_state.photo=null;dkd_set_preview();if(dkd_result?.sessionToken)sessionStorage.setItem(`dkd55-message:${dkd_raw_tag.toLowerCase()}`,String(dkd_result.sessionToken));}
    catch(dkd_error){dkd_status(dkd_error?.message||'Mesaj gönderilemedi.');}
    finally{dkd_state.sending=false;if(dkd_button)dkd_button.disabled=false;}
  }

  function dkd_capture_message(dkd_event){
    const dkd_target=dkd_event.target?.closest?.('#dbp53call-message');if(!dkd_target)return;
    dkd_event.preventDefault();dkd_event.stopPropagation();dkd_event.stopImmediatePropagation();
    const dkd_panel=document.getElementById('dkd55-message-panel');if(!dkd_panel)return;dkd_panel.hidden=!dkd_panel.hidden;if(!dkd_panel.hidden)setTimeout(()=>dkd_panel.scrollIntoView({behavior:'smooth',block:'center'}),40);
  }

  function dkd_capture_protect(dkd_event){
    if(dkd_event.target?.closest?.('#dkd55-protect-badge')){dkd_event.preventDefault();dkd_open_protect_modal();return;}
    if(dkd_event.target?.closest?.('#dkd55-protect-close')||dkd_event.target?.closest?.('[data-dkd-close="true"]')){dkd_event.preventDefault();dkd_close_protect_modal();}
  }

  function dkd_boot(){
    document.addEventListener('click',dkd_capture_message,true);
    document.addEventListener('click',dkd_capture_protect,true);
    document.addEventListener('keydown',dkd_event=>{if(dkd_event.key==='Escape')dkd_close_protect_modal();});
    if(dkd_install_panel())return;
    const dkd_observer=new MutationObserver(()=>{dkd_upgrade_vehicle_card();if(dkd_install_panel())dkd_observer.disconnect();});dkd_observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>dkd_observer.disconnect(),10000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',dkd_boot);else dkd_boot();
})();