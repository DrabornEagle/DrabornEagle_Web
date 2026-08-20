/* DraBornPark Test1 v0.5.0 — modern semantic icon override. No generated images, no raster screenshot crops. */
(function(){
  const raw=new URLSearchParams(location.search).get('tag')||'';
  const clean=raw.toUpperCase().replace(/^DP-/,'').replace(/[^A-Z0-9]/g,'');
  if(clean!=='TEST1')return;

  const svg=(body)=>`<svg class="dbp50-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICON={
    blocking_exit:svg('<path d="M3.5 15.5v-3.2l1.7-4.1A2 2 0 0 1 7 7h8.8a2 2 0 0 1 1.8 1.2l1.7 4.1v3.2"/><path d="M5 12h13.8"/><path d="M6.2 15.5v1.8M17 15.5v1.8"/><circle cx="7.4" cy="13.7" r="1"/><circle cx="16.5" cy="13.7" r="1"/><path d="M18.5 5.2H22m-1.6-1.6L22 5.2l-1.6 1.6"/>'),
    move_vehicle:svg('<path d="M3.5 15.5v-3.2l1.7-4.1A2 2 0 0 1 7 7h7.6a2 2 0 0 1 1.8 1.2l1.7 4.1v3.2"/><path d="M5 12h12.6"/><path d="M6.2 15.5v1.8M15.8 15.5v1.8"/><circle cx="7.4" cy="13.7" r="1"/><circle cx="15.3" cy="13.7" r="1"/><path d="M18 10h3.5m-1.5-1.6 1.6 1.6-1.6 1.6"/>'),
    lights_on:svg('<path d="M4 7.5h5.2c3.5 0 5.8 1.8 5.8 4.5s-2.3 4.5-5.8 4.5H4z"/><path d="M8 8v8"/><path d="M18 7l3-1M18 10h3M18 14h3M18 17l3 1"/>'),
    window_open:svg('<path d="M5 5.5h12.5v13H5z"/><path d="M7.2 8h8.1v6.4H7.2z"/><path d="M11.2 8v6.4"/><path d="M19 8v7m0 0-2.2-2.2M19 15l2.2-2.2"/>'),
    door_open:svg('<path d="M5 4.5h9.3v15H5z"/><path d="M14.3 8.2 21 5.6v13.2l-6.7-2.8z"/><path d="M8 8h3v7H8z"/><circle cx="17.4" cy="12" r=".55"/>'),
    damage:svg('<path d="M3.5 16v-3.3l1.8-4.2A2 2 0 0 1 7.1 7.3h9a2 2 0 0 1 1.8 1.2l1.7 4.2V16"/><path d="M5.1 12.3h12.8"/><circle cx="7.4" cy="14.2" r="1"/><circle cx="16.2" cy="14.2" r="1"/><path d="m12.6 4.2-1.7 4 2.2-.7-1.2 3.1 2.3-.7-2.6 5.4"/>'),
    child:svg('<circle cx="12" cy="6.2" r="2.2"/><path d="M8.4 19v-5.1c0-2.5 1.4-4.2 3.6-4.2s3.6 1.7 3.6 4.2V19"/><path d="M9.2 13.2 7.3 16M14.8 13.2l1.9 2.8"/><path d="M10.2 18.8v-4.2M13.8 18.8v-4.2"/><path d="M8.3 9.7h7.4"/>'),
    animal:svg('<circle cx="7.2" cy="7.7" r="1.8"/><circle cx="16.8" cy="7.7" r="1.8"/><circle cx="5.2" cy="12.5" r="1.6"/><circle cx="18.8" cy="12.5" r="1.6"/><path d="M12 10.5c3.6 0 5.6 4.4 5.6 6.5 0 2.1-2.1 3.4-5.6 3.4S6.4 19.1 6.4 17c0-2.1 2-6.5 5.6-6.5Z"/>'),
    witness:svg('<path d="M2.7 12s3.6-5.3 9.3-5.3 9.3 5.3 9.3 5.3-3.6 5.3-9.3 5.3S2.7 12 2.7 12Z"/><circle cx="12" cy="12" r="2.7"/><path d="M18.2 5.2h3M19.7 3.7v3"/>'),
    other:svg('<path d="M4 5.5h16v11.2H10l-4.2 3.1v-3.1H4z"/><path d="M7.5 9h9M7.5 12h6.2"/>'),
    vehicle:svg('<path d="M3.5 15.5v-3.2l1.8-4.2A2 2 0 0 1 7.1 7h9.7a2 2 0 0 1 1.8 1.2l1.8 4.1v3.2"/><path d="M5 12h14"/><circle cx="7.5" cy="13.8" r="1.1"/><circle cx="16.5" cy="13.8" r="1.1"/><path d="M6.2 15.5v1.8M17.8 15.5v1.8"/><path d="M9 7V5.4h6V7"/>'),
    security:svg('<path d="M12 3.2 18.5 6v4.9c0 4.6-2.4 7.8-6.5 10-4.1-2.2-6.5-5.4-6.5-10V6z"/><path d="m9.2 12 1.8 1.8 3.9-4"/>'),
    phoneLock:svg('<path d="M7.4 3.8h3l1.1 3-1.9 1.4a14 14 0 0 0 6.2 6.2l1.4-1.9 3 1.1v3c0 1-.8 1.8-1.8 1.8C11 18.4 5.6 13 5.6 6c0-1.2.8-2.2 1.8-2.2Z"/><rect x="14.2" y="4.2" width="5.2" height="4.6" rx="1.1"/><path d="M15.6 4.2V3a1.2 1.2 0 0 1 2.4 0v1.2"/>')
  };

  function installCss(){
    if(document.getElementById('dbp50-icon-css'))return;
    const s=document.createElement('style');s.id='dbp50-icon-css';s.textContent=`
      .dbp47-icon{position:relative;width:58px!important;height:58px!important;border-radius:19px!important;border:1px solid rgba(var(--c),.52)!important;background:linear-gradient(145deg,rgba(var(--c),.22),rgba(var(--c),.07))!important;display:grid!important;place-items:center!important;overflow:hidden!important;padding:0!important}
      .dbp47-icon:after{content:"";position:absolute;left:10px;right:10px;bottom:6px;height:3px;border-radius:999px;background:var(--tone);opacity:.72}
      .dbp50-svg{width:34px;height:34px;color:var(--tone);transition:transform .18s ease,stroke-width .18s ease}
      .dbp47-choice.is-selected .dbp50-svg{transform:scale(1.08);stroke-width:2.15}
      .dbp50-top-svg{width:47px;height:47px;color:var(--dbp-cyan)}
      .dbp50-security-svg{width:22px;height:22px;color:currentColor}
      .dbp47-lock .dbp50-security-svg{width:30px;height:30px;color:var(--dbp-green)}
      .dbp47-safe-row .dbp50-security-svg,.dbp47-send .dbp50-security-svg,.dbp47-success-icon .dbp50-security-svg{width:24px;height:24px}
      @media(max-width:420px){.dbp47-icon{width:54px!important;height:54px!important}.dbp50-svg{width:31px;height:31px}}
    `;document.head.appendChild(s);
  }

  function swap(){
    installCss();
    document.querySelectorAll('.dbp47-choice').forEach(btn=>{const key=btn.dataset.key;const box=btn.querySelector('.dbp47-icon');if(box&&ICON[key])box.innerHTML=ICON[key];});
    const car=document.querySelector('.dbp47-car');if(car){const dot=car.querySelector(':scope > span:last-child');car.innerHTML=`<span class="dbp50-top-svg">${ICON.vehicle}</span>`;if(dot)car.appendChild(dot);}
    document.querySelectorAll('.dbp49-security-raster').forEach((img,i)=>{const wrap=document.createElement('span');wrap.className='dbp50-security-svg';wrap.innerHTML=i===1?ICON.phoneLock:ICON.security;img.replaceWith(wrap);});
  }

  document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(swap));
})();
