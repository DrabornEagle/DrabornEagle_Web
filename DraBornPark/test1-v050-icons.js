/* DraBornPark v0.5.3 — shared Remix Icon contact UI for Test1 and real NFC/QR tags. */
(function(){
  const raw=new URLSearchParams(location.search).get('tag')||'';
  const clean=raw.toUpperCase().replace(/^DP-/,'').replace(/[^A-Z0-9]/g,'');
  if(!clean)return;
  const isTest1=clean==='TEST1';

  function ensureRemix(){
    if(document.getElementById('dbp51-remixicon'))return;
    const link=document.createElement('link');
    link.id='dbp51-remixicon';
    link.rel='stylesheet';
    link.href='https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css';
    link.crossOrigin='anonymous';
    document.head.appendChild(link);
  }

  const ICON_CLASS={
    blocking_exit:'ri-car-line',
    move_vehicle:'ri-direction-line',
    lights_on:'ri-lightbulb-flash-line',
    window_open:'ri-window-line',
    door_open:'ri-door-open-line',
    damage:'ri-alarm-warning-line',
    child:'ri-parent-line',
    animal:'ri-footprint-line',
    witness:'ri-eye-line',
    other:'ri-chat-3-line'
  };
  const BADGE_CLASS={blocking_exit:'ri-arrow-right-line',move_vehicle:'ri-car-line',damage:'ri-car-line'};
  const TITLE_KEY=[
    ['çıkışımı engelliyor','blocking_exit'],['hareket ettirebilir','move_vehicle'],['farlarınız','lights_on'],
    ['camınız','window_open'],['kapınız','door_open'],['zarar verilmiş','damage'],['çocuk','child'],
    ['hayvan','animal'],['şahit','witness'],['başka bir mesaj','other']
  ];
  const LABEL={blocking_exit:'PARK / GEÇİŞ',move_vehicle:'KISA İSTEK',lights_on:'ARAÇ UYARISI',window_open:'GÜVENLİK',door_open:'YÜKSEK ÖNCELİK',damage:'YÜKSEK ÖNCELİK',child:'ACİL DURUM',animal:'ACİL DURUM',witness:'TANIK',other:'MESAJ'};

  const iconHtml=key=>BADGE_CLASS[key]
    ? `<span class="dbp51-icon-stack"><i class="${ICON_CLASS[key]}"></i><i class="${BADGE_CLASS[key]} dbp51-badge"></i></span>`
    : `<i class="${ICON_CLASS[key]||ICON_CLASS.other}"></i>`;

  function keyFromTitle(title){
    const t=String(title||'').toLocaleLowerCase('tr-TR');
    return TITLE_KEY.find(([needle])=>t.includes(needle))?.[1]||'other';
  }

  function installCss(){
    if(document.getElementById('dbp52-shared-css'))return;
    const s=document.createElement('style');
    s.id='dbp52-shared-css';
    s.textContent=`
      .dbp48-raster,.dbp49-security-raster,.dbp50-svg{background-image:none!important}
      .dbp47-icon{position:relative;width:60px!important;height:60px!important;border-radius:20px!important;border:1px solid rgba(var(--c),.52)!important;background:linear-gradient(145deg,rgba(var(--c),.22),rgba(var(--c),.07))!important;display:grid!important;place-items:center!important;overflow:hidden!important;padding:0!important}
      .dbp47-icon>i,.dbp51-icon-stack>i{font-size:31px;line-height:1;color:var(--tone);font-weight:400;transition:transform .18s ease}
      .dbp51-icon-stack{position:relative;display:grid;place-items:center;width:100%;height:100%}
      .dbp51-icon-stack>.dbp51-badge{position:absolute;right:6px;top:7px;width:19px;height:19px;border-radius:7px;display:grid;place-items:center;font-size:12px!important;background:var(--tone);color:#061019!important;border:2px solid rgba(5,8,22,.92)}
      .dbp47-choice.is-selected .dbp47-icon>i,.dbp47-choice.is-selected .dbp51-icon-stack>i:first-child,.dbp52-live .dbp47-choice.active .dbp47-icon>i,.dbp52-live .dbp47-choice.active .dbp51-icon-stack>i:first-child{transform:scale(1.08)}
      .dbp47-choice strong{font-size:16px!important;line-height:1.22!important}
      .dbp47-choice small{font-size:12px!important;line-height:1.48!important}
      .dbp47-priority{font-size:9px!important}
      .dbp47-select-hint{font-size:12.5px!important;font-weight:900!important;letter-spacing:.09em!important;padding:9px 11px!important}
      .dbp47-heading p,.dbp47-compose-head p,.dbp47-success>p{font-size:14px!important}
      .dbp51-vehicle-icon{font-size:46px;color:var(--dbp-cyan);line-height:1}
      .dbp51-security-icon{font-size:23px;line-height:1;color:currentColor}
      .dbp47-lock .dbp51-security-icon{font-size:30px;color:var(--dbp-green)}
      .dbp47-safe-row .dbp51-security-icon,.dbp47-send .dbp51-security-icon,.dbp47-success-icon .dbp51-security-icon{font-size:24px}

      .dbp52-live .contact-shell{max-width:760px;margin-inline:auto}
      .dbp52-live #tag-app{display:grid;gap:18px}
      .dbp52-live .vehicle-card{position:relative;border:1px solid rgba(53,228,255,.52)!important;border-radius:30px!important;background:linear-gradient(145deg,rgba(22,64,112,.84),rgba(9,25,54,.96))!important;padding:24px!important;overflow:hidden}
      .dbp52-live .vehicle-card:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#35e4ff,#6c8cff,#a67bff,#ff73c6)}
      .dbp52-live .vehicle-head{display:flex;align-items:center;gap:18px!important}
      .dbp52-live .vehicle-icon{width:84px!important;height:84px!important;border-radius:25px!important;display:grid!important;place-items:center!important;background:rgba(53,228,255,.12)!important;border:1px solid rgba(53,228,255,.45)!important;color:#35e4ff!important;font-size:0!important;flex:0 0 auto}
      .dbp52-live .vehicle-icon:before{font-family:remixicon!important;content:"\\ebc6";font-size:42px;line-height:1}
      .dbp52-live .vehicle-name{font-size:28px!important;font-weight:900!important;line-height:1.08!important}
      .dbp52-live .vehicle-meta{font-size:16px!important;margin-top:7px!important;color:#c9d5ee!important}
      .dbp52-live .privacy-note{border:1px solid rgba(79,230,164,.45)!important;border-radius:28px!important;background:linear-gradient(145deg,rgba(15,75,62,.62),rgba(7,35,37,.88))!important;padding:22px!important;gap:16px!important}
      .dbp52-live .privacy-note>.icon{width:58px!important;height:58px!important;border-radius:19px!important;font-size:0!important;display:grid!important;place-items:center!important;background:rgba(79,230,164,.12)!important;border:1px solid rgba(79,230,164,.38)!important}
      .dbp52-live .privacy-note>.icon:before{font-family:remixicon!important;content:"\\f0f4";font-size:29px;color:#4fe6a4}
      .dbp52-live .privacy-note b{font-size:20px!important}.dbp52-live .privacy-note p{font-size:14px!important;line-height:1.55!important}
      .dbp52-live #categories-wrap>.section{margin-top:4px!important}
      .dbp52-live #categories-wrap>.section>h2{font-size:31px!important;line-height:1.08!important;margin-bottom:10px!important}
      .dbp52-live #categories-wrap>.section>.section-intro{font-size:15px!important;line-height:1.5!important}
      .dbp52-live .category-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}
      .dbp52-live .category.dbp47-choice{min-height:230px!important;height:auto!important;text-align:left!important;padding:18px!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;border-radius:28px!important;overflow:hidden!important}
      .dbp52-live .category.dbp47-choice .dbp47-choice-top{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:8px!important;margin-bottom:16px!important}
      .dbp52-live .category.dbp47-choice .dbp47-priority{margin-bottom:9px!important}
      .dbp52-live .category.dbp47-choice strong{display:block!important;color:#fff!important;margin-bottom:9px!important}
      .dbp52-live .category.dbp47-choice small{display:block!important;color:#aebbd5!important}
      .dbp52-live .category.dbp47-choice.active{transform:translateY(-2px);border-color:var(--tone)!important}
      .dbp52-live .category.dbp47-choice.active .dbp47-selected-label{display:flex!important}
      .dbp52-live #compose{border-radius:28px!important;border:1px solid rgba(53,228,255,.35)!important;background:rgba(11,25,52,.94)!important;padding:22px!important}
      .dbp52-live #notify-btn{border-radius:18px!important;min-height:58px!important;font-weight:900!important;letter-spacing:.04em!important}
      .dbp52-flow{display:flex;align-items:center;gap:10px;padding:4px 4px 12px}.dbp52-flow div{display:flex;align-items:center;gap:7px;color:#64708d;font-size:11px;font-weight:800}.dbp52-flow b{width:32px;height:32px;border-radius:11px;border:1px solid #263959;display:grid;place-items:center}.dbp52-flow i{height:3px;flex:1;border-radius:999px;background:#1d3154}.dbp52-flow .current{color:#35e4ff}.dbp52-flow .current b{border-color:#35e4ff;background:rgba(53,228,255,.12)}
      @media(max-width:420px){.dbp47-icon{width:56px!important;height:56px!important}.dbp47-icon>i,.dbp51-icon-stack>i{font-size:29px}.dbp47-choice strong{font-size:16px!important}.dbp47-choice small{font-size:12px!important}.dbp47-select-hint{font-size:12.5px!important}.dbp52-live .vehicle-card{padding:20px!important}.dbp52-live .vehicle-icon{width:72px!important;height:72px!important}.dbp52-live .vehicle-name{font-size:25px!important}.dbp52-live .category.dbp47-choice{min-height:218px!important;padding:16px!important}}
    `;
    document.head.appendChild(s);
  }

  function swapTest1(){
    document.querySelectorAll('.dbp47-choice').forEach(btn=>{const box=btn.querySelector('.dbp47-icon');const key=btn.dataset.key;if(box)box.innerHTML=iconHtml(key);});
    const car=document.querySelector('.dbp47-car');if(car){const dot=car.querySelector(':scope > span:last-child');car.innerHTML='<i class="ri-car-line dbp51-vehicle-icon" aria-hidden="true"></i>';if(dot)car.appendChild(dot);}
    document.querySelectorAll('.dbp49-security-raster,.dbp50-security-svg').forEach((node,index)=>{const i=document.createElement('i');i.className=index===1?'ri-phone-lock-line dbp51-security-icon':'ri-shield-check-line dbp51-security-icon';i.setAttribute('aria-hidden','true');node.replaceWith(i);});
  }

  function enhanceLiveCard(btn){
    if(btn.dataset.dbp52==='1')return;
    const title=btn.querySelector('.category-title')?.textContent?.trim()||'';
    const body=btn.querySelector('.category-body')?.textContent?.trim()||'';
    const key=keyFromTitle(title);
    const label=LABEL[key]||'BİLDİRİM';
    btn.dataset.dbp52='1';btn.dataset.key=key;btn.setAttribute('aria-pressed','false');btn.classList.add('dbp47-choice');
    btn.innerHTML=`<span class="dbp47-choice-rail"></span><span class="dbp47-choice-top"><span class="dbp47-icon">${iconHtml(key)}</span><span class="dbp47-select-hint"><i></i> DOKUN • SEÇ</span></span><span class="dbp47-priority">${label}</span><strong>${title}</strong><small>${body}</small><span class="dbp47-selected-label">SEÇİLDİ <b>✓</b></span>`;
    btn.addEventListener('click',()=>setTimeout(syncLiveSelected,0));
  }

  function syncLiveSelected(){
    document.querySelectorAll('.dbp52-live .category').forEach(btn=>{const active=btn.classList.contains('active');btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));const hint=btn.querySelector('.dbp47-select-hint');if(hint)hint.lastChild.textContent=active?' SEÇİLDİ':' DOKUN • SEÇ';});
  }

  function enhanceLiveContact(){
    if(isTest1)return;
    const app=document.getElementById('tag-app');if(!app||app.classList.contains('hidden'))return;
    document.body.classList.add('dbp52-live');
    const vehicleIcon=document.querySelector('.vehicle-icon');if(vehicleIcon)vehicleIcon.textContent='';
    const privacyIcon=document.querySelector('.privacy-note>.icon');if(privacyIcon)privacyIcon.textContent='';
    const section=document.querySelector('#categories-wrap>.section');
    if(section&&!document.getElementById('dbp52-flow')){const flow=document.createElement('div');flow.id='dbp52-flow';flow.className='dbp52-flow';flow.innerHTML='<div class="current"><b>1</b><span>Durumu seç</span></div><i></i><div><b>2</b><span>Kısa açıklama</span></div><i></i><div><b>3</b><span>Güvenli gönder</span></div>';section.prepend(flow);}
    document.querySelectorAll('.category').forEach(enhanceLiveCard);syncLiveSelected();
  }

  function observeLive(){
    if(isTest1)return;
    const target=document.getElementById('tag-shell');if(!target)return;
    const obs=new MutationObserver(()=>enhanceLiveContact());
    obs.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    enhanceLiveContact();
  }

  ensureRemix();installCss();
  document.addEventListener('DOMContentLoaded',()=>{requestAnimationFrame(()=>{if(isTest1)swapTest1();else observeLive();});});
})();
