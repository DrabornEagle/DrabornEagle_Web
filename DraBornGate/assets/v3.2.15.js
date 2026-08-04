const DKD_V3215_VERSION = '3.2.15';

function dkdV3215Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3215RemoveBrokenEarnings() {
  for (const dkdBroken of document.querySelectorAll('.dkd-v3211-earnings-menu,[data-dkd-v3211-earnings],.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu],#dkd-v328-earnings,#dkd-v325-earnings')) {
    dkdBroken.remove();
  }

  for (const dkdLabel of document.querySelectorAll('strong,span,h1,h2,h3,h4,p,small,i')) {
    const dkdLabelText = dkdV3215Normalize(dkdLabel.textContent);
    if (dkdLabelText !== 'site kurye partneri gelirleri' && dkdLabelText !== 'goruntule') continue;
    const dkdCandidate = dkdLabel.closest('button,a,[role="button"],article,section,li,[class*="earnings"],[class*="kazanc"]') || dkdLabel.parentElement;
    if (!dkdCandidate || dkdCandidate.closest('#dkd-v3211-earnings')) continue;
    const dkdText = dkdV3215Normalize(dkdCandidate.textContent);
    if (dkdText.includes('kazanclarim') && dkdText.includes('site kurye') && dkdText.includes('goruntule')) dkdCandidate.remove();
  }
}

function dkdV3215RestoreTopEarningsAfterClick(dkdEvent) {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget) return;
  const dkdButton = dkdTarget.closest('button,a,[role="button"],li,article');
  if (!dkdButton || dkdButton.matches('.dkd-v3211-earnings-menu,[data-dkd-v3211-earnings]') || dkdButton.closest('#dkd-v3211-earnings')) return;
  if (dkdV3215Normalize(dkdButton.textContent) !== 'kazanclarim') return;

  const dkdParent = dkdButton.parentNode;
  const dkdNext = dkdButton.nextSibling;
  const dkdClone = dkdButton.cloneNode(true);
  setTimeout(() => {
    if (!dkdParent || dkdButton.isConnected) return;
    if (dkdNext?.parentNode === dkdParent) dkdParent.insertBefore(dkdClone, dkdNext);
    else dkdParent.appendChild(dkdClone);
  }, 0);
}

function dkdV3215MotorcycleTone(dkdText) {
  if (dkdText.includes('trendyol go')) return '#FF8A4C';
  if (dkdText.includes('yemeksepeti')) return '#FF557D';
  if (dkdText.includes('getir')) return '#9075FF';
  if (dkdText.includes('draborngo')) return '#37D8FF';
  return '#FFB35C';
}

function dkdV3215MotorcycleSvg(dkdTone, dkdId) {
  const dkdPaint = `dkd-v3215-body-${dkdId}`;
  const dkdGlass = `dkd-v3215-glass-${dkdId}`;
  return `<span class="dkd-v3215-speed-lines" aria-hidden="true"><i></i><i></i></span><svg viewBox="0 0 132 84" role="img" aria-label="DraBornGate yarış motosikleti">
    <defs>
      <linearGradient id="${dkdPaint}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5FAFF" stop-opacity=".98"/><stop offset=".28" stop-color="${dkdTone}"/><stop offset="1" stop-color="${dkdTone}" stop-opacity=".62"/></linearGradient>
      <linearGradient id="${dkdGlass}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DFF8FF" stop-opacity=".9"/><stop offset="1" stop-color="#6BCBFF" stop-opacity=".16"/></linearGradient>
    </defs>
    <path d="M12 71 C34 76 96 76 120 70" stroke="#000" stroke-opacity=".24" stroke-width="5" stroke-linecap="round"/>
    <g><circle cx="27" cy="61" r="16" fill="#07111D" stroke="#D7E8F5" stroke-width="2.4"/><circle cx="27" cy="61" r="10.2" fill="#101E2B" stroke="${dkdTone}" stroke-width="2.2"/><circle cx="27" cy="61" r="3.4" fill="#F5FAFF"/><path d="M27 50.8V71.2M16.8 61H37.2M20 54L34 68M34 54L20 68" stroke="#F5FAFF" stroke-opacity=".52" stroke-width="1.4"/></g>
    <g><circle cx="102" cy="61" r="16" fill="#07111D" stroke="#D7E8F5" stroke-width="2.4"/><circle cx="102" cy="61" r="10.2" fill="#101E2B" stroke="${dkdTone}" stroke-width="2.2"/><circle cx="102" cy="61" r="3.4" fill="#F5FAFF"/><path d="M102 50.8V71.2M91.8 61H112.2M95 54L109 68M109 54L95 68" stroke="#F5FAFF" stroke-opacity=".52" stroke-width="1.4"/></g>
    <path d="M31 58L47 42L74 49L96 59" fill="none" stroke="#B8C7D2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42 58L59 36L79 52L62 58Z" fill="#0B1722" stroke="${dkdTone}" stroke-width="2.2"/>
    <path d="M88 57L100 33" stroke="#C6D8E5" stroke-width="4" stroke-linecap="round"/><path d="M93 58L104 35" stroke="${dkdTone}" stroke-width="2.1" stroke-linecap="round"/>
    <path d="M39 46C47 32 59 23 77 24C87 25 94 31 99 40L91 49L68 50L53 57L38 55Z" fill="url(#${dkdPaint})" stroke="#F5FAFF" stroke-opacity=".72" stroke-width="1.7" stroke-linejoin="round"/>
    <path d="M56 28C63 18 76 17 87 22L83 32L63 34Z" fill="${dkdTone}" stroke="#F5FAFF" stroke-opacity=".7" stroke-width="1.6"/>
    <path d="M75 22C84 13 95 15 100 25L88 27Z" fill="url(#${dkdGlass})" stroke="#F5FAFF" stroke-opacity=".7" stroke-width="1.4"/>
    <path d="M83 31L99 32L107 39L97 42L89 39Z" fill="${dkdTone}" stroke="#F5FAFF" stroke-opacity=".72" stroke-width="1.5"/>
    <path d="M35 42L17 37L12 42L38 50Z" fill="${dkdTone}" stroke="#F5FAFF" stroke-opacity=".62" stroke-width="1.5"/><path d="M19 39L37 42" stroke="#F5FAFF" stroke-width="2" stroke-linecap="round"/>
    <path d="M54 55C65 50 78 49 91 51L85 59L58 61Z" fill="#0A1520" stroke="#F5FAFF" stroke-opacity=".44" stroke-width="1.3"/>
    <path d="M48 34L69 35L61 43L43 44Z" fill="#111D28" opacity=".94"/><path d="M52 31L69 30" stroke="#F5FAFF" stroke-opacity=".7" stroke-width="2.2" stroke-linecap="round"/><path d="M45 48L70 43" stroke="#F5FAFF" stroke-opacity=".9" stroke-width="2.2" stroke-linecap="round"/><path d="M50 51L79 46" stroke="#0A1520" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round"/><path d="M68 28L78 40L90 38" fill="none" stroke="#F5FAFF" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M43 58L29 63" stroke="#AFC2CF" stroke-width="3.5" stroke-linecap="round"/><path d="M67 59L48 68" stroke="#AFC2CF" stroke-width="3.3" stroke-linecap="round"/><path d="M46 67L62 67" stroke="${dkdTone}" stroke-width="4.2" stroke-linecap="round"/><rect x="40" y="64" width="17" height="5" rx="2.5" fill="#101D28" stroke="#F5FAFF" stroke-opacity=".5"/>
    <path d="M99 38L112 36" stroke="#F5FAFF" stroke-width="2.3" stroke-linecap="round"/><circle cx="98" cy="36" r="2.2" fill="#F5FAFF"/><path d="M93 35L101 29" stroke="#BFD7E5" stroke-width="2.4" stroke-linecap="round"/><path d="M99 41L106 41" stroke="#FFF4B8" stroke-width="3.2" stroke-linecap="round"/><path d="M28 42L20 45" stroke="#FF6A7D" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M84 52L97 55" stroke="#CFDAE2" stroke-width="2.8" stroke-linecap="round"/><path d="M83 55L95 60" stroke="#6E8190" stroke-width="2.6" stroke-linecap="round"/><circle cx="65" cy="50" r="6.2" fill="#142737" stroke="#F5FAFF" stroke-opacity=".58" stroke-width="1.5"/><circle cx="65" cy="50" r="2.4" fill="${dkdTone}"/>
  </svg>`;
}

function dkdV3215PassCards() {
  const dkdCards = new Set();
  const dkdLabels = [...document.querySelectorAll('strong,span,h1,h2,h3,h4,p,small')];
  for (const dkdLabel of dkdLabels) {
    const dkdText = dkdV3215Normalize(dkdLabel.textContent);
    if (!/trendyol go|yemeksepeti|getir|draborngo|tamamlandi|bekliyor|onaylandi|reddedildi/.test(dkdText) && !/dbg\s*\d+/.test(dkdText)) continue;
    const dkdCard = dkdLabel.closest('article,[class*="pass-card"],[class*="transition-card"],[class*="history-card"],[class*="courier-card"],section,[class*="card"]');
    if (!dkdCard || dkdCard.closest('nav,aside,[class*="sidebar"],[class*="drawer"],[class*="menu"]')) continue;
    const dkdCardText = dkdV3215Normalize(dkdCard.textContent);
    if ((dkdCardText.includes('siparis') || dkdCardText.includes('adres') || dkdCardText.includes('mesafe') || /dbg\s*\d+/.test(dkdCardText)) && dkdCardText.length < 1400) dkdCards.add(dkdCard);
  }
  return [...dkdCards];
}

function dkdV3215FindIconHost(dkdCard) {
  const dkdCardRect = dkdCard.getBoundingClientRect();
  const dkdCandidates = [...dkdCard.querySelectorAll('[class*="avatar"],[class*="vehicle"],[class*="moto"],[class*="courier"] [class*="icon"],[class*="identity"] [class*="icon"],[class*="icon"],span,div')];
  let dkdFallback = null;
  for (const dkdCandidate of dkdCandidates) {
    if (dkdCandidate.closest('.dkd-v3215-racing-motorcycle') || dkdCandidate.closest('[class*="status"],[class*="pill"],[class*="badge"]')) continue;
    const dkdText = dkdV3215Normalize(dkdCandidate.textContent);
    if (dkdText.length > 4) continue;
    const dkdHasGraphic = Boolean(dkdCandidate.querySelector('svg,img')) || /🏍|🛵|moto|motorcycle|bike/.test(String(dkdCandidate.textContent || '') + String(dkdCandidate.className || ''));
    const dkdClassLooksRight = /avatar|vehicle|moto|courier.*icon|identity.*icon|icon/i.test(String(dkdCandidate.className || ''));
    if (!dkdHasGraphic && !dkdClassLooksRight) continue;
    if (!dkdFallback) dkdFallback = dkdCandidate;
    const dkdRect = dkdCandidate.getBoundingClientRect();
    const dkdNearTopLeft = dkdRect.left <= dkdCardRect.left + 150 && dkdRect.top <= dkdCardRect.top + 150;
    const dkdSized = dkdRect.width >= 34 && dkdRect.width <= 110 && dkdRect.height >= 30 && dkdRect.height <= 110;
    if (dkdNearTopLeft && dkdSized) return dkdCandidate;
  }
  return dkdFallback;
}

function dkdV3215ApplyMotorcycles() {
  let dkdIndex = 0;
  for (const dkdCard of dkdV3215PassCards()) {
    if (dkdCard.querySelector('.dkd-v3215-racing-motorcycle')) continue;
    const dkdHost = dkdV3215FindIconHost(dkdCard);
    if (!dkdHost) continue;
    const dkdTone = dkdV3215MotorcycleTone(dkdV3215Normalize(dkdCard.textContent));
    dkdHost.innerHTML = `<span class="dkd-v3215-racing-motorcycle" style="--dkd-v3215-moto-tone:${dkdTone}">${dkdV3215MotorcycleSvg(dkdTone, dkdIndex += 1)}</span>`;
    dkdHost.dataset.dkdV3215Motorcycle = 'true';
  }
}

function dkdV3215RemoveLegacySyncCard() {
  for (const dkdLabel of document.querySelectorAll('strong,span,h1,h2,h3,h4,p')) {
    if (dkdV3215Normalize(dkdLabel.textContent) !== 'canli senkron') continue;
    const dkdCard = dkdLabel.closest('article,section,button,a,[role="button"],li,[class*="card"],[class*="sync"]') || dkdLabel.parentElement;
    const dkdText = dkdV3215Normalize(dkdCard?.textContent);
    if (dkdCard && dkdText.includes('canli senkron') && dkdText.includes('web uygulama')) dkdCard.remove();
  }
}

function dkdV3215Apply() {
  dkdV3215RemoveBrokenEarnings();
  dkdV3215RemoveLegacySyncCard();
  dkdV3215ApplyMotorcycles();
  document.documentElement.dataset.dkdGateVersion = DKD_V3215_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3215_VERSION);
}

let dkdV3215Queued = false;
const dkdV3215Observer = new MutationObserver(() => {
  if (dkdV3215Queued) return;
  dkdV3215Queued = true;
  requestAnimationFrame(() => {
    dkdV3215Queued = false;
    dkdV3215Apply();
  });
});

dkdV3215Observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('click', dkdV3215RestoreTopEarningsAfterClick, true);
window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3215Apply));
window.addEventListener('popstate', () => requestAnimationFrame(dkdV3215Apply));
document.addEventListener('click', () => requestAnimationFrame(dkdV3215Apply), true);

requestAnimationFrame(dkdV3215Apply);
setTimeout(dkdV3215Apply, 120);
setTimeout(dkdV3215Apply, 700);
setInterval(dkdV3215Apply, 1200);

window.__DKD_GATE_V3215_EARNINGS_MOTORCYCLE__ = true;
