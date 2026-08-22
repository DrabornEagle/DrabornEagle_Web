/* DraBornPark web v0.5.5 — rebuilt protected vehicle card for every ?tag= route. */
(function(){
  const dkd_tag=(new URLSearchParams(location.search).get('tag')||'').trim();
  if(!dkd_tag)return;

  const dkd_escape=dkd_value=>String(dkd_value??'').replace(/[&<>'"]/g,dkd_char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[dkd_char]));

  function dkd_nfc_svg(){return '<svg class="dkd63-nfc-svg" viewBox="0 0 32 32" aria-hidden="true"><path d="M8 24V8l10 16V8"/><path d="M22 10c2 2.2 2 9.8 0 12"/><path d="M26 7c4 4.7 4 13.3 0 18"/></svg>';}

  function dkd_extract(){
    const dkd_vehicle=document.querySelector('.dbp47-vehicle');if(!dkd_vehicle)return null;
    const dkd_name=dkd_vehicle.querySelector('.dbp47-vehicle-copy h1')?.textContent?.trim()||'DraBornPark aracı';
    const dkd_plate_node=dkd_vehicle.querySelector('.dkd55-plate-focus span')||dkd_vehicle.querySelector('.dbp47-vehicle-copy>p b');
    const dkd_plate=dkd_plate_node?.textContent?.trim()||'PLAKA GİZLİ';
    const dkd_p=dkd_vehicle.querySelector('.dbp47-vehicle-copy>p');
    let dkd_detail=dkd_p?.textContent?.trim()||'';
    if(dkd_detail.startsWith(dkd_plate))dkd_detail=dkd_detail.slice(dkd_plate.length).replace(/^\s*[•·|]\s*/,'').trim();
    const dkd_parts=dkd_detail.split(/\s*[•·|]\s*/).map(dkd_part=>dkd_part.trim()).filter(Boolean);
    const dkd_color=dkd_parts[0]||'Belirtilmedi';
    const dkd_vehicle_detail=dkd_parts.slice(1).join(' • ')||'Araç profili';
    const dkd_tag_label=dkd_vehicle.querySelector('.dbp47-tag')?.textContent?.trim()||('ETİKET • '+dkd_tag.toUpperCase());
    const dkd_car=dkd_vehicle.querySelector('.dbp47-car');
    const dkd_car_html=dkd_car?dkd_car.outerHTML:'<div class="dbp47-car"><span class="dbp48-raster dbp48-i-blocking dbp49-car-raster" aria-hidden="true"></span><span></span></div>';
    return{dkd_vehicle,dkd_name,dkd_plate,dkd_color,dkd_vehicle_detail,dkd_tag_label,dkd_car_html};
  }

  function dkd_rebuild(){
    const dkd_data=dkd_extract();if(!dkd_data)return false;
    const {dkd_vehicle,dkd_name,dkd_plate,dkd_color,dkd_vehicle_detail,dkd_tag_label,dkd_car_html}=dkd_data;
    if(dkd_vehicle.dataset.dkdCardV4==='1')return true;
    dkd_vehicle.dataset.dkdCardV4='1';
    dkd_vehicle.className='dbp47-vehicle dkd63-card dkd64-card';
    dkd_vehicle.innerHTML=`
      <span class="dkd63-orb dkd63-orb-a"></span>
      <span class="dkd63-orb dkd63-orb-b"></span>
      <span class="dkd63-scan"></span>
      <div class="dkd63-spectrum"><i></i><i></i><i></i><i></i><i></i></div>

      <div class="dkd63-head">
        <span class="dkd63-protected"><i class="ri-shield-check-line"></i><span>DRABORNPARK<br><b>KORUMALI</b></span></span>
        <button id="dkd55-protect-badge" class="dkd63-protect-cta" type="button" aria-label="Sen de aracını koru — etiket seçeneklerini aç">
          <span class="dkd63-cta-icon"><i class="ri-shield-star-line"></i></span>
          <span class="dkd63-cta-copy"><b>SEN DE ARACINI KORU</b><small>Etiket seçeneklerini gör</small></span>
          <span class="dkd63-cta-arrow"><i class="ri-arrow-right-line"></i></span>
        </button>
      </div>

      <div class="dkd63-main dkd64-main">
        <div class="dkd63-photo">${dkd_car_html}</div>
        <div class="dkd63-copy dkd64-copy">
          <span class="dkd64-vehicle-kicker">KORUMALI ARAÇ PROFİLİ</span>
          <h1>${dkd_escape(dkd_name)}</h1>
        </div>
      </div>

      <div class="dkd64-info-grid">
        <div class="dkd64-info dkd64-info-plate">
          <span class="dkd64-info-icon"><i class="ri-bank-card-2-line"></i></span>
          <span class="dkd64-info-copy"><small>PLAKA</small><strong>${dkd_escape(dkd_plate)}</strong></span>
        </div>
        <div class="dkd64-info dkd64-info-color">
          <span class="dkd64-info-icon"><i class="ri-palette-line"></i></span>
          <span class="dkd64-info-copy"><small>RENK</small><strong>${dkd_escape(dkd_color)}</strong></span>
        </div>
        <div class="dkd64-info dkd64-info-model">
          <span class="dkd64-info-icon"><i class="ri-car-line"></i></span>
          <span class="dkd64-info-copy"><small>ARAÇ</small><strong>${dkd_escape(dkd_vehicle_detail)}</strong></span>
        </div>
      </div>

      <div class="dkd63-footer">
        <div class="dkd63-nfc">
          <span class="dkd63-nfc-icon">${dkd_nfc_svg()}</span>
          <span class="dkd63-nfc-copy"><small>ETİKET AĞI</small><b>NFC + QR • AKTİF</b></span>
        </div>
        <span class="dkd63-tag">${dkd_escape(dkd_tag_label)}</span>
      </div>
    `;
    return true;
  }

  function dkd_update_send_label(){
    const dkd_send=document.querySelector('#dkd55-message-send span');
    if(dkd_send&&dkd_send.textContent!=='ARAÇ SAHİBİNE GÖNDER')dkd_send.textContent='ARAÇ SAHİBİNE GÖNDER';
  }

  function dkd_boot(){
    dkd_update_send_label();
    const dkd_ready=dkd_rebuild();
    const dkd_observer=new MutationObserver(()=>{
      dkd_update_send_label();
      if(!dkd_ready)dkd_rebuild();
    });
    dkd_observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>{dkd_update_send_label();dkd_observer.disconnect();},12000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',dkd_boot);else dkd_boot();
})();