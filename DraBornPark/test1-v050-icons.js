/* DraBornPark Test1 v0.5.1 — Remix Icon webfont system. No SVG, no raster screenshot icons. */
(function(){
  const raw=new URLSearchParams(location.search).get('tag')||'';
  const clean=raw.toUpperCase().replace(/^DP-/,'').replace(/[^A-Z0-9]/g,'');
  if(clean!=='TEST1')return;

  function ensureRemix(){
    if(document.getElementById('dbp51-remixicon'))return;
    const link=document.createElement('link');
    link.id='dbp51-remixicon';
    link.rel='stylesheet';
    link.href='https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css';
    link.crossOrigin='anonymous';
    document.head.appendChild(link);
  }

  const ICONS={
    blocking_exit:'<span class="dbp51-icon-stack"><i class="ri-car-line"></i><i class="ri-arrow-right-line dbp51-badge"></i></span>',
    move_vehicle:'<span class="dbp51-icon-stack"><i class="ri-car-line"></i><i class="ri-direction-line dbp51-badge"></i></span>',
    lights_on:'<i class="ri-lightbulb-flash-line"></i>',
    window_open:'<i class="ri-window-line"></i>',
    door_open:'<i class="ri-door-open-line"></i>',
    damage:'<span class="dbp51-icon-stack"><i class="ri-car-line"></i><i class="ri-alert-line dbp51-badge"></i></span>',
    child:'<i class="ri-parent-line"></i>',
    animal:'<i class="ri-footprint-line"></i>',
    witness:'<i class="ri-eye-line"></i>',
    other:'<i class="ri-chat-3-line"></i>'
  };

  function installCss(){
    if(document.getElementById('dbp51-icon-css'))return;
    const s=document.createElement('style');
    s.id='dbp51-icon-css';
    s.textContent=`
      .dbp48-raster,.dbp49-security-raster,.dbp50-svg{background-image:none!important}
      .dbp47-icon{position:relative;width:60px!important;height:60px!important;border-radius:20px!important;border:1px solid rgba(var(--c),.52)!important;background:linear-gradient(145deg,rgba(var(--c),.22),rgba(var(--c),.07))!important;display:grid!important;place-items:center!important;overflow:hidden!important;padding:0!important}
      .dbp47-icon>i,.dbp51-icon-stack>i{font-size:31px;line-height:1;color:var(--tone);font-weight:400}
      .dbp51-icon-stack{position:relative;display:grid;place-items:center;width:100%;height:100%}
      .dbp51-icon-stack>.dbp51-badge{position:absolute;right:6px;top:7px;width:19px;height:19px;border-radius:7px;display:grid;place-items:center;font-size:12px!important;background:var(--tone);color:#061019!important;border:2px solid rgba(5,8,22,.92)}
      .dbp47-choice.is-selected .dbp47-icon>i,.dbp47-choice.is-selected .dbp51-icon-stack>i:first-child{transform:scale(1.08)}
      .dbp47-choice strong{font-size:16px!important;line-height:1.22!important}
      .dbp47-choice small{font-size:12px!important;line-height:1.48!important}
      .dbp47-priority{font-size:9px!important}
      .dbp47-select-hint{font-size:9px!important}
      .dbp47-heading p,.dbp47-compose-head p,.dbp47-success>p{font-size:14px!important}
      .dbp51-vehicle-icon{font-size:46px;color:var(--dbp-cyan);line-height:1}
      .dbp51-security-icon{font-size:23px;line-height:1;color:currentColor}
      .dbp47-lock .dbp51-security-icon{font-size:30px;color:var(--dbp-green)}
      .dbp47-safe-row .dbp51-security-icon,.dbp47-send .dbp51-security-icon,.dbp47-success-icon .dbp51-security-icon{font-size:24px}
      @media(max-width:420px){.dbp47-icon{width:56px!important;height:56px!important}.dbp47-icon>i,.dbp51-icon-stack>i{font-size:29px}.dbp47-choice strong{font-size:16px!important}.dbp47-choice small{font-size:12px!important}}
    `;
    document.head.appendChild(s);
  }

  function swap(){
    ensureRemix();
    installCss();

    document.querySelectorAll('.dbp47-choice').forEach(btn=>{
      const box=btn.querySelector('.dbp47-icon');
      const key=btn.dataset.key;
      if(box&&ICONS[key])box.innerHTML=ICONS[key];
    });

    const car=document.querySelector('.dbp47-car');
    if(car){
      const dot=car.querySelector(':scope > span:last-child');
      car.innerHTML='<i class="ri-car-line dbp51-vehicle-icon" aria-hidden="true"></i>';
      if(dot)car.appendChild(dot);
    }

    document.querySelectorAll('.dbp49-security-raster,.dbp50-security-svg').forEach((node,index)=>{
      const i=document.createElement('i');
      i.className=index===1?'ri-phone-lock-line dbp51-security-icon':'ri-shield-check-line dbp51-security-icon';
      i.setAttribute('aria-hidden','true');
      node.replaceWith(i);
    });
  }

  document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(swap));
})();
