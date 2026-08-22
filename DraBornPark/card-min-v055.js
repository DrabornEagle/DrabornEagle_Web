/* DraBornPark web v0.5.5 — minimalist protected vehicle enhancer for every ?tag= route. */
(function(){
  const dkd_tag=(new URLSearchParams(location.search).get('tag')||'').trim();
  if(!dkd_tag)return;

  function dkd_upgrade(){
    const dkd_vehicle=document.querySelector('.dbp47-vehicle');
    if(!dkd_vehicle)return false;

    dkd_vehicle.classList.add('dkd55-minimal-card');

    /* Eski büyük ARAÇ SAHİBİ / NFC rozet grubunu tamamen kaldır. */
    dkd_vehicle.querySelectorAll('.dkd55-public-badges').forEach(dkd_node=>dkd_node.remove());

    /* Kartın üstünde daha sade bir koruma başlığı oluştur. */
    if(!dkd_vehicle.querySelector('.dkd55-minimal-top')){
      const dkd_top=document.createElement('div');
      dkd_top.className='dkd55-minimal-top';
      dkd_top.innerHTML='<span class="dkd55-minimal-protected"><i class="ri-shield-check-line"></i><b>DRABORNPARK KORUMALI</b></span>';
      const dkd_main=dkd_vehicle.querySelector('.dbp47-vehicle-main');
      dkd_main?.insertAdjacentElement('beforebegin',dkd_top);
    }

    /* Eski kicker tekrara düşmesin. */
    const dkd_old_kicker=dkd_vehicle.querySelector('.dbp47-vehicle-copy>.dbp47-kicker');
    if(dkd_old_kicker)dkd_old_kicker.classList.add('dkd55-hide-old-kicker');

    /* Plakayı kartın görsel odak noktası yap. */
    const dkd_plate=dkd_vehicle.querySelector('.dbp47-vehicle-copy>p b');
    if(dkd_plate&&!dkd_plate.classList.contains('dkd55-plate-focus')){
      const dkd_text=dkd_plate.textContent?.trim()||'PLAKA GİZLİ';
      dkd_plate.classList.add('dkd55-plate-focus');
      dkd_plate.innerHTML='<i class="ri-bank-card-2-line"></i><span>'+dkd_text+'</span>';
    }

    /* NFC + QR aktif durumunu büyük rozetten çıkarıp güvenlik satırına taşı. */
    const dkd_status=dkd_vehicle.querySelector('.dbp47-vehicle-status');
    const dkd_status_first=dkd_status?.querySelector('span:first-child');
    if(dkd_status_first&&!dkd_status_first.classList.contains('dkd55-nfc-status')){
      dkd_status_first.className='dkd55-nfc-status';
      dkd_status_first.innerHTML='<i class="ri-nfc-line"></i><span><small>ETİKET AĞI</small><b>NFC + QR • AKTİF</b></span>';
    }

    /* Mevcut popup'ı açan CTA'yı daha büyük ve anlaşılır hale getir. */
    const dkd_cta=document.getElementById('dkd55-protect-badge');
    if(dkd_cta&&!dkd_cta.classList.contains('dkd55-protect-badge-v2')){
      dkd_cta.classList.add('dkd55-protect-badge-v2');
      dkd_cta.innerHTML='<span class="dkd55-protect-badge-icon"><i class="ri-shield-star-line"></i></span><span class="dkd55-protect-badge-copy"><b>SEN DE ARACINI KORU</b><small>NFC + QR etiketini keşfet</small></span><em><i class="ri-arrow-right-line"></i></em>';
      dkd_cta.setAttribute('aria-label','Sen de aracını koru — DraBornPark etiket seçeneklerini aç');
    }

    return true;
  }

  function dkd_boot(){
    if(dkd_upgrade())return;
    const dkd_observer=new MutationObserver(()=>{if(dkd_upgrade())dkd_observer.disconnect();});
    dkd_observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>dkd_observer.disconnect(),12000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',dkd_boot);else dkd_boot();
})();