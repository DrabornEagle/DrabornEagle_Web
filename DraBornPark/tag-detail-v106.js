/* DraBornPark v1.0.21-web — premium protected vehicle card, single-pass enhancer. */
(()=>{
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function readVehicleData(card){
    const meta=card.querySelector('.dp-meta');
    const plate=String(meta?.querySelector('strong')?.textContent||'').trim()||'Plaka gizli';
    const detail=String(meta?.querySelector('span')?.textContent||'').trim();
    const parts=detail.split('•').map(value=>value.trim()).filter(Boolean);
    const color=parts[0]||'Belirtilmedi';
    const model=parts.slice(1).join(' • ')||'Araç bilgisi';
    const title=String(card.querySelector('.dp-identity h1')?.textContent||'DraBornPark aracı').trim();
    const ownerRaw=String(card.querySelector('.dp-owner')?.textContent||'Araç Sahibi').replace(/\s+/g,' ').trim();
    const username=(ownerRaw.split('•')[1]||'').trim();
    const image=card.querySelector('.dp-avatar img');
    const avatar=image?.src?`<img src="${esc(image.src)}" alt="Araç sahibinin profil fotoğrafı" referrerpolicy="no-referrer">`:'<i class="ri-car-line"></i>';
    return{plate,color,model,title,username,avatar};
  }

  function openMarketplace(){
    document.getElementById('dp-market-modal')?.classList.add('open');
    document.body.classList.add('dp-market-open');
  }

  function enhance(){
    const card=document.querySelector('.dp-vehicle');
    if(!card||card.dataset.dkdPremiumCard==='1')return false;
    const data=readVehicleData(card);
    const owner=data.username||'DraBornPark kullanıcısı';

    card.className='dp-vehicle dkd107-vehicle-card';
    card.dataset.dkdPremiumCard='1';
    card.innerHTML=`
      <div class="dkd107-spectrum" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="dkd107-card-head">
        <div class="dkd107-protection-state"><span class="dkd107-shield"><i class="ri-shield-check-line"></i></span><span><small>DRABORNPARK</small><b>KORUMALI ARAÇ</b></span></div>
        <button id="dp-protect" class="dkd107-protect-cta" type="button"><span><i class="ri-shield-star-line"></i></span><b>SEN DE ARACINI KORU</b><i class="ri-arrow-right-line"></i></button>
      </div>

      <div class="dkd107-hero">
        <div class="dkd107-avatar">${data.avatar}<span class="dkd107-online" aria-label="Aktif"></span></div>
        <div class="dkd107-hero-copy">
          <span class="dkd107-overline">GÜVENLİ ARAÇ PROFİLİ</span>
          <h1>${esc(data.title)}</h1>
          <div class="dkd107-live-row"><span class="dkd107-live-dot"></span><b>NFC + QR AKTİF</b><small>Doğrulanmış etiket</small></div>
        </div>
      </div>

      <div class="dkd107-data-grid">
        <article class="dkd107-data dkd107-plate">
          <span class="dkd107-data-icon"><i class="ri-car-washing-line"></i></span>
          <span class="dkd107-data-copy"><small>PLAKA</small><b>${esc(data.plate)}</b><em>Araç kimliği</em></span>
        </article>
        <article class="dkd107-data dkd107-color">
          <span class="dkd107-data-icon"><i class="ri-palette-line"></i></span>
          <span class="dkd107-data-copy"><small>RENK</small><b>${esc(data.color)}</b></span>
        </article>
        <article class="dkd107-data dkd107-model">
          <span class="dkd107-data-icon"><i class="ri-roadster-line"></i></span>
          <span class="dkd107-data-copy"><small>ARAÇ BİLGİSİ</small><b>${esc(data.model)}</b></span>
        </article>
      </div>

      <div class="dkd107-owner-row">
        <span class="dkd107-owner-avatar"><i class="ri-user-3-line"></i></span>
        <span class="dkd107-owner-copy"><small>ARAÇ SAHİBİ</small><b>${esc(owner)}</b></span>
        <span class="dkd107-owner-safe"><i class="ri-lock-2-line"></i> Gizli iletişim</span>
      </div>`;

    card.querySelector('#dp-protect')?.addEventListener('click',openMarketplace);
    return true;
  }

  function boot(){
    if(enhance())return;
    let tries=0;
    const timer=setInterval(()=>{tries+=1;if(enhance()||tries>=40)clearInterval(timer);},150);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
