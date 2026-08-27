/* DraBornPark public tag runtime v1.0.23 — visible version refresh and focused copy cleanup. */
(()=>{
  const VERSION='1.0.23';
  const VERSION_LINE=`v${VERSION} • NFC + QR • AKTİF`;
  const removeCameraSubtitle=()=>{
    document.querySelectorAll('.dp-camera-btn small').forEach(el=>{
      if((el.textContent||'').replace(/\s+/g,' ').trim()==='Galeriden seçim yok • tarih/saat damgalı')el.remove();
    });
  };
  const refreshVersion=()=>{
    globalThis.DKDBP_WEB_VERSION=VERSION;
    const live=document.querySelector('.dp-live');
    if(live){
      const icon=live.querySelector('i');
      live.textContent='';
      if(icon)live.appendChild(icon);
      live.append(document.createTextNode(VERSION_LINE));
      live.dataset.dkdVersion='123';
    }
    document.querySelectorAll('*').forEach(el=>{
      if(el.children.length)return;
      const text=(el.textContent||'').trim();
      if(/^v1\.0\.(?:[0-9]|1[0-9]|20)$/i.test(text))el.textContent='v1.0.23';
      if(/^DraBornPark v1\.0\.(?:[0-9]|1[0-9]|20) güvenli araç ağına bağlanılıyor/i.test(text))el.textContent='DraBornPark v1.0.23 güvenli araç ağına bağlanılıyor…';
    });
  };
  const apply=()=>{refreshVersion();removeCameraSubtitle();};
  let queued=false;
  const queueApply=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};
  new MutationObserver(queueApply).observe(document.documentElement,{subtree:true,childList:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
