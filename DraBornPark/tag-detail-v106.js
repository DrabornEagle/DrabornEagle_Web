/* DraBornPark v1.0.6-web — vehicle detail presentation hotfix. */
(()=>{
  function dkd_enhance_vehicle(){
    const dkd_vehicle=document.querySelector('.dp-vehicle');
    if(!dkd_vehicle||dkd_vehicle.dataset.dkdVehicleFacts==='1')return false;
    const dkd_meta=dkd_vehicle.querySelector('.dp-meta');
    const dkd_plate=String(dkd_meta?.querySelector('strong')?.textContent||'').trim()||'Plaka gizli';
    const dkd_detail=String(dkd_meta?.querySelector('span')?.textContent||'').trim();
    const dkd_parts=dkd_detail.split('•').map(dkd_value=>dkd_value.trim()).filter(Boolean);
    const dkd_color=dkd_parts[0]||'Belirtilmedi';
    const dkd_model=dkd_parts.slice(1).join(' • ')||document.querySelector('.dp-identity h1')?.textContent?.trim()||'Araç bilgisi';

    const dkd_net=dkd_vehicle.querySelector('.dp-net');
    if(dkd_net){
      dkd_net.classList.add('dkd106-plate-card');
      dkd_net.innerHTML=`<i class="ri-roadster-line" aria-hidden="true"></i><span><small>PLAKA</small><b>${dkd_plate}</b></span>`;
    }

    if(dkd_meta){
      dkd_meta.classList.add('dkd106-meta-hidden');
      const dkd_facts=document.createElement('div');
      dkd_facts.className='dkd106-facts';
      dkd_facts.innerHTML=`<div class="dkd106-fact dkd106-color"><span class="dkd106-fact-icon"><i class="ri-palette-line"></i></span><span><small>RENK</small><b>${dkd_color}</b></span></div><div class="dkd106-fact dkd106-model"><span class="dkd106-fact-icon"><i class="ri-car-line"></i></span><span><small>ARAÇ BİLGİSİ</small><b>${dkd_model}</b></span></div>`;
      dkd_meta.insertAdjacentElement('afterend',dkd_facts);
    }
    dkd_vehicle.dataset.dkdVehicleFacts='1';
    return true;
  }

  function dkd_boot(){
    if(dkd_enhance_vehicle())return;
    const dkd_root=document.getElementById('tag-shell')||document.body;
    const dkd_observer=new MutationObserver(()=>{if(dkd_enhance_vehicle())dkd_observer.disconnect();});
    dkd_observer.observe(dkd_root,{childList:true,subtree:true});
    setTimeout(()=>dkd_observer.disconnect(),12000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',dkd_boot,{once:true});else dkd_boot();
})();
