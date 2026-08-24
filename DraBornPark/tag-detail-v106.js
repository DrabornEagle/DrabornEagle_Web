/* DraBornPark v1.0.6-web — clearer vehicle identity + minimalist owner card. */
(()=>{
  const dkd_escape=dkd_value=>String(dkd_value??'').replace(/[&<>'"]/g,dkd_char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[dkd_char]));

  function dkd_enhance_vehicle(){
    const dkd_vehicle=document.querySelector('.dp-vehicle');
    if(!dkd_vehicle||dkd_vehicle.dataset.dkdVehicleFacts==='2')return false;

    const dkd_meta=dkd_vehicle.querySelector('.dp-meta');
    const dkd_plate=String(dkd_meta?.querySelector('strong')?.textContent||'').trim()||'Plaka gizli';
    const dkd_detail=String(dkd_meta?.querySelector('span')?.textContent||'').trim();
    const dkd_parts=dkd_detail.split('•').map(dkd_value=>dkd_value.trim()).filter(Boolean);
    const dkd_color=dkd_parts[0]||'Belirtilmedi';
    const dkd_model=dkd_parts.slice(1).join(' • ')||document.querySelector('.dp-identity h1')?.textContent?.trim()||'Araç bilgisi';

    if(dkd_meta){
      dkd_meta.classList.add('dkd106-meta-hidden');
      const dkd_existing=dkd_vehicle.querySelector('.dkd106-vehicle-info');
      if(dkd_existing)dkd_existing.remove();
      const dkd_info=document.createElement('div');
      dkd_info.className='dkd106-vehicle-info';
      dkd_info.innerHTML=`
        <div class="dkd106-info dkd106-plate">
          <span class="dkd106-info-icon"><i class="ri-roadster-line" aria-hidden="true"></i></span>
          <span class="dkd106-info-copy"><small>PLAKA</small><b>${dkd_escape(dkd_plate)}</b><em>Araç kimliği</em></span>
        </div>
        <div class="dkd106-info dkd106-color">
          <span class="dkd106-info-icon"><i class="ri-palette-line" aria-hidden="true"></i></span>
          <span class="dkd106-info-copy"><small>RENK</small><b>${dkd_escape(dkd_color)}</b></span>
        </div>
        <div class="dkd106-info dkd106-model">
          <span class="dkd106-info-icon"><i class="ri-car-line" aria-hidden="true"></i></span>
          <span class="dkd106-info-copy"><small>ARAÇ</small><b>${dkd_escape(dkd_model)}</b></span>
        </div>`;
      dkd_meta.insertAdjacentElement('afterend',dkd_info);
    }

    const dkd_network=dkd_vehicle.querySelector('.dp-network');
    const dkd_net=dkd_network?.querySelector('.dp-net');
    if(dkd_net)dkd_net.classList.add('dkd106-network-hidden');
    if(dkd_network)dkd_network.classList.add('dkd106-owner-row');

    const dkd_owner=dkd_vehicle.querySelector('.dp-owner');
    if(dkd_owner){
      const dkd_raw=String(dkd_owner.textContent||'').replace(/\s+/g,' ').trim();
      const dkd_username=dkd_raw.includes('•')?dkd_raw.split('•').slice(1).join('•').trim():dkd_raw.replace(/^Araç Sahibi\s*/i,'').trim();
      dkd_owner.classList.add('dkd106-owner-min');
      dkd_owner.innerHTML=`<i class="ri-user-3-line" aria-hidden="true"></i><span><small>ARAÇ SAHİBİ</small><b>${dkd_escape(dkd_username||'DraBornPark kullanıcısı')}</b></span>`;
    }

    dkd_vehicle.dataset.dkdVehicleFacts='2';
    return true;
  }

  function dkd_boot(){
    if(dkd_enhance_vehicle())return;
    const dkd_root=document.getElementById('tag-shell')||document.body;
    const dkd_observer=new MutationObserver(()=>{if(dkd_enhance_vehicle())dkd_observer.disconnect();});
    dkd_observer.observe(dkd_root,{childList:true,subtree:true});
    setTimeout(()=>dkd_observer.disconnect(),10000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',dkd_boot,{once:true});else dkd_boot();
})();
