const DKD_V281_PATCH_ID = 'dkd-v281-racing-motorcycle-patch';
let dkdV281IconSequence = 0;

function dkdV281Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV281MotorcycleSvg() {
  dkdV281IconSequence += 1;
  const dkdBodyPaint = `dkd-v281-body-${dkdV281IconSequence}`;
  const dkdGlass = `dkd-v281-glass-${dkdV281IconSequence}`;
  return `
    <span class="dkd-v281-moto" aria-hidden="true">
      <span class="dkd-v281-speed-lines"><i></i><i></i></span>
      <svg class="dkd-v281-moto-bike" viewBox="0 0 132 84" fill="none" role="img">
        <defs>
          <linearGradient id="${dkdBodyPaint}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F5FAFF" stop-opacity=".98"/>
            <stop offset=".28" stop-color="currentColor"/>
            <stop offset="1" stop-color="currentColor" stop-opacity=".62"/>
          </linearGradient>
          <linearGradient id="${dkdGlass}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#DFF8FF" stop-opacity=".9"/>
            <stop offset="1" stop-color="#6BCBFF" stop-opacity=".16"/>
          </linearGradient>
        </defs>
        <path d="M12 71C34 76 96 76 120 70" stroke="#000" stroke-opacity=".24" stroke-width="5" stroke-linecap="round"/>
        <g>
          <circle cx="27" cy="61" r="16" fill="#07111D" stroke="#D7E8F5" stroke-width="2.4"/>
          <circle cx="27" cy="61" r="10.2" fill="#101E2B" stroke="currentColor" stroke-width="2.2"/>
          <circle cx="27" cy="61" r="3.4" fill="#F5FAFF"/>
          <path d="M27 50.8V71.2M16.8 61H37.2M20 54L34 68M34 54L20 68" stroke="#F5FAFF" stroke-opacity=".52" stroke-width="1.4"/>
        </g>
        <g>
          <circle cx="102" cy="61" r="16" fill="#07111D" stroke="#D7E8F5" stroke-width="2.4"/>
          <circle cx="102" cy="61" r="10.2" fill="#101E2B" stroke="currentColor" stroke-width="2.2"/>
          <circle cx="102" cy="61" r="3.4" fill="#F5FAFF"/>
          <path d="M102 50.8V71.2M91.8 61H112.2M95 54L109 68M109 54L95 68" stroke="#F5FAFF" stroke-opacity=".52" stroke-width="1.4"/>
        </g>
        <path d="M31 58 47 42 74 49 96 59" stroke="#B8C7D2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m42 58 17-22 20 16-17 6Z" fill="#0B1722" stroke="currentColor" stroke-width="2.2"/>
        <path d="m88 57 12-24" stroke="#C6D8E5" stroke-width="4" stroke-linecap="round"/>
        <path d="m93 58 11-23" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
        <path d="M39 46c8-14 20-23 38-22 10 1 17 7 22 16l-8 9-23 1-15 7-15-2Z" fill="url(#${dkdBodyPaint})" stroke="#F5FAFF" stroke-opacity=".72" stroke-width="1.7" stroke-linejoin="round"/>
        <path d="M56 28c7-10 20-11 31-6l-4 10-20 2Z" fill="currentColor" stroke="#F5FAFF" stroke-opacity=".7" stroke-width="1.6"/>
        <path d="M75 22c9-9 20-7 25 3l-12 2Z" fill="url(#${dkdGlass})" stroke="#F5FAFF" stroke-opacity=".7" stroke-width="1.4"/>
        <path d="m83 31 16 1 8 7-10 3-8-3Z" fill="currentColor" stroke="#F5FAFF" stroke-opacity=".72" stroke-width="1.5"/>
        <path d="m35 42-18-5-5 5 26 8Z" fill="currentColor" stroke="#F5FAFF" stroke-opacity=".62" stroke-width="1.5"/>
        <path d="m19 39 18 3" stroke="#F5FAFF" stroke-width="2" stroke-linecap="round"/>
        <path d="M54 55c11-5 24-6 37-4l-6 8-27 2Z" fill="#0A1520" stroke="#F5FAFF" stroke-opacity=".44" stroke-width="1.3"/>
        <path d="m48 34 21 1-8 8-18 1Z" fill="#111D28" opacity=".94"/>
        <path d="m52 31 17-1M45 48l25-5" stroke="#F5FAFF" stroke-opacity=".78" stroke-width="2.2" stroke-linecap="round"/>
        <path d="m50 51 29-5" stroke="#0A1520" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round"/>
        <path d="m68 28 10 12 12-2" stroke="#F5FAFF" stroke-width="2.2" stroke-linecap="round"/>
        <path d="m43 58-14 5M67 59l-19 9" stroke="#AFC2CF" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M46 67h16" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"/>
        <rect x="40" y="64" width="17" height="5" rx="2.5" fill="#101D28" stroke="#F5FAFF" stroke-opacity=".5"/>
        <path d="m99 38 13-2" stroke="#F5FAFF" stroke-width="2.3" stroke-linecap="round"/>
        <circle cx="98" cy="36" r="2.2" fill="#F5FAFF"/>
        <path d="m93 35 8-6" stroke="#BFD7E5" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M99 41h7" stroke="#FFF4B8" stroke-width="3.2" stroke-linecap="round"/>
        <path d="m28 42-8 3" stroke="#FF6A7D" stroke-width="2.8" stroke-linecap="round"/>
        <path d="m84 52 13 3M83 55l12 5" stroke="#CFDAE2" stroke-width="2.7" stroke-linecap="round"/>
        <circle cx="65" cy="50" r="6.2" fill="#142737" stroke="#F5FAFF" stroke-opacity=".58" stroke-width="1.5"/>
        <circle cx="65" cy="50" r="2.4" fill="currentColor"/>
      </svg>
    </span>`;
}

function dkdV281InstallStyles() {
  if (document.querySelector(`#${DKD_V281_PATCH_ID}`)) return;
  const dkdStyle = document.createElement('style');
  dkdStyle.id = DKD_V281_PATCH_ID;
  dkdStyle.textContent = `
    .dkd-v281-moto{position:relative;width:64px;height:43px;display:grid;place-items:center;color:var(--dkd-v28-cyan,#4ce4ff);overflow:visible}
    .dkd-v281-moto svg.dkd-v281-moto-bike{width:64px!important;height:41px!important;overflow:visible;animation:dkdV281Ride 1.24s ease-in-out infinite}
    .dkd-v281-speed-lines{position:absolute;left:-5px;top:15px;width:23px;display:grid;gap:5px;animation:dkdV281Streak .84s ease-in-out infinite}
    .dkd-v281-speed-lines i{display:block;height:2px;border-radius:999px;background:currentColor;box-shadow:0 0 9px currentColor}
    .dkd-v281-speed-lines i:first-child{width:23px}.dkd-v281-speed-lines i:last-child{width:14px;margin-left:6px;background:#f5faff;opacity:.72}
    .dkd-v28-stats .icon .dkd-v281-moto{width:52px;height:36px}.dkd-v28-stats .icon .dkd-v281-moto svg.dkd-v281-moto-bike{width:52px!important;height:34px!important}
    .dkd-v28-stats .icon .dkd-v281-speed-lines{left:-3px;top:12px;transform:scale(.78)}
    @keyframes dkdV281Ride{0%,100%{transform:translate(-1px,1px) rotate(-1deg)}50%{transform:translate(2px,-1.5px) rotate(1.5deg)}}
    @keyframes dkdV281Streak{0%,100%{opacity:.2;transform:translateX(3px)}50%{opacity:.82;transform:translateX(-4px)}}
    @media(prefers-reduced-motion:reduce){.dkd-v281-moto svg.dkd-v281-moto-bike,.dkd-v281-speed-lines{animation:none}}
  `;
  document.head.appendChild(dkdStyle);
}

function dkdV281PatchMotorcycles(dkdRoot = document) {
  const dkdTargets = [
    ...dkdRoot.querySelectorAll('.dkd-v28-request-icon'),
    ...dkdRoot.querySelectorAll('.dkd-v28-stats .icon.cyan'),
  ];
  for (const dkdTarget of dkdTargets) {
    if (dkdTarget.dataset.dkdV281Motorcycle === 'true') continue;
    dkdTarget.innerHTML = dkdV281MotorcycleSvg();
    dkdTarget.dataset.dkdV281Motorcycle = 'true';
  }
}

function dkdV281PatchText(dkdRoot = document) {
  for (const dkdTitle of dkdRoot.querySelectorAll('.dkd-v28-request-title h3')) {
    if (dkdTitle.textContent !== 'Kodu Doğrula') dkdTitle.textContent = 'Kodu Doğrula';
  }
  for (const dkdCourier of dkdRoot.querySelectorAll('.dkd-v28-info-grid > div:first-child strong')) {
    const dkdText = dkdV281Normalize(dkdCourier.textContent);
    if (dkdText.includes('kodu dogrula') || dkdText.includes('ziyaretci merkezi') || dkdText.includes('kurye gecis talebi')) {
      dkdCourier.textContent = 'Kurye bilgisi bekleniyor';
    }
  }
}

function dkdV281Apply(dkdRoot = document) {
  dkdV281InstallStyles();
  dkdV281PatchMotorcycles(dkdRoot);
  dkdV281PatchText(dkdRoot);
}

dkdV281Apply();
new MutationObserver((dkdMutations) => {
  for (const dkdMutation of dkdMutations) {
    for (const dkdNode of dkdMutation.addedNodes) {
      if (!(dkdNode instanceof Element)) continue;
      dkdV281Apply(dkdNode.matches('#dkd-v28-root,.dkd-v28-request-card,.dkd-v28-stats') ? dkdNode : dkdNode);
    }
  }
}).observe(document.body, { childList: true, subtree: true });
