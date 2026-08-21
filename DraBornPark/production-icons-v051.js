/* DraBornPark v0.5.1 — yalnızca üretim NFC/QR sayfasındaki eksik ikonları Remix Icon ile tamamlar; mevcut yerleşime dokunmaz. */
(function(){
  const raw=(new URLSearchParams(location.search).get('tag')||'').trim();
  if(!raw)return;

  const ICONS={
    blocked_exit:'ri-car-line',
    blocking_exit:'ri-car-line',
    move_vehicle:'ri-direction-line',
    lights_on:'ri-lightbulb-flash-line',
    window_open:'ri-window-line',
    door_open:'ri-door-open-line',
    trunk_open:'ri-inbox-unarchive-line',
    damage:'ri-alarm-warning-line',
    suspicious:'ri-eye-line',
    towing:'ri-truck-line',
    animal:'ri-footprint-line',
    child:'ri-parent-line',
    fire:'ri-fire-line',
    forgotten_item:'ri-key-2-line',
    witness:'ri-eye-line',
    emergency:'ri-alarm-warning-line',
    other:'ri-chat-3-line'
  };

  function icon(className,extra=''){
    const node=document.createElement('i');
    node.className=`${className} ${extra}`.trim();
    node.setAttribute('aria-hidden','true');
    return node;
  }

  function apply(){
    const app=document.querySelector('#tag-shell .dbp47-app');
    if(!app)return false;

    app.querySelectorAll('.dbp47-choice[data-key]').forEach(button=>{
      const box=button.querySelector('.dbp47-icon');
      if(!box||box.dataset.remixReady==='1')return;
      const key=button.getAttribute('data-key')||'other';
      box.replaceChildren(icon(ICONS[key]||ICONS.other));
      box.dataset.remixReady='1';
    });

    const car=app.querySelector('.dbp47-car');
    if(car&&!car.querySelector('.dbp51-vehicle-icon')){
      const old=car.querySelector('.dbp48-raster,.dbp49-car-raster');
      if(old)old.replaceWith(icon('ri-car-line','dbp51-vehicle-icon'));
    }

    app.querySelectorAll('.dbp49-security-raster').forEach((old,index)=>{
      const cls=index===1?'ri-phone-lock-line':'ri-shield-check-line';
      old.replaceWith(icon(cls,'dbp51-security-icon'));
    });

    return true;
  }

  const target=document.getElementById('tag-shell');
  if(!target)return;
  const observer=new MutationObserver(()=>{if(apply())observer.disconnect();});
  observer.observe(target,{childList:true,subtree:true});
  apply();
})();
