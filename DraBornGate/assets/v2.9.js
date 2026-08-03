const DKD_V29_VERSION = '2.9.0';
const DKD_V29_ROOT_ID = 'dkd-v29-root';
const DKD_V29_SIMPLE_PATH = '/DraBornGate/Guvenlik-Sade-Tema/';
const DKD_V29_THEME_KEY = 'dkd_gate_security_theme';
const DKD_V29_FORCE_KEY = 'dkd_gate_force_theme';

const dkdV29State = {
  mounted: false,
  nativeSyncWorking: false,
  nativeSyncTimer: 0,
  maintenanceTimer: 0,
  queueRecords: [],
  queueSignature: '',
  codeControl: null,
  lookupValue: '',
  lookupState: 'idle',
  lookupMessage: '',
  lastSync: null,
  iconSequence: 0,
};

function dkdV29Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV29Escape(dkdValue) {
  return String(dkdValue ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV29Wait(dkdMilliseconds) {
  return new Promise((dkdResolve) => setTimeout(dkdResolve, dkdMilliseconds));
}

function dkdV29IsSimpleRequested() {
  return dkdV29Normalize(location.pathname).includes('guvenlik sade tema') ||
    sessionStorage.getItem(DKD_V29_THEME_KEY) === 'simple' ||
    sessionStorage.getItem(DKD_V29_FORCE_KEY) === 'simple';
}

function dkdV29HasSecuritySession() {
  const dkdApp = document.querySelector('#dkd-app');
  const dkdText = dkdV29Normalize(dkdApp?.textContent);
  return dkdText.includes('guvenlik') && (
    dkdText.includes('kurye') ||
    dkdText.includes('gecis') ||
    dkdText.includes('cikis yap')
  );
}

function dkdV29LooksLikeAuthSurface() {
  const dkdText = dkdV29Normalize(document.querySelector('#dkd-app')?.textContent);
  return dkdText.includes('giris yap') ||
    dkdText.includes('e posta') ||
    dkdText.includes('sifre') ||
    dkdText.includes('hesap olustur');
}

function dkdV29ScrubLegacyVersions(dkdRoot = document.body) {
  if (!dkdRoot) return;
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
  for (const dkdNode of dkdNodes) {
    const dkdCurrent = dkdNode.nodeValue || '';
    if (!/v2\.\d/i.test(dkdCurrent)) continue;
    const dkdContext = dkdV29Normalize(`${dkdCurrent} ${dkdNode.parentElement?.textContent || ''}`);
    if (!/(draborngate|web|premium|guvenlik sade tema)/.test(dkdContext)) continue;
    dkdNode.nodeValue = dkdCurrent.replace(/v2\.\d+(?:\.\d+)?/gi, `v${DKD_V29_VERSION}`);
  }
}

function dkdV29MotorcycleSvg(dkdClassName = '') {
  dkdV29State.iconSequence += 1;
  const dkdPaintId = `dkd-v29-paint-${dkdV29State.iconSequence}`;
  const dkdGlassId = `dkd-v29-glass-${dkdV29State.iconSequence}`;
  return `
    <span class="dkd-v29-motorcycle ${dkdClassName}" aria-hidden="true">
      <span class="dkd-v29-speed-lines"><i></i><i></i></span>
      <svg viewBox="0 0 132 84" fill="none">
        <defs>
          <linearGradient id="${dkdPaintId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F5FAFF" stop-opacity=".98"/>
            <stop offset=".28" stop-color="#48E4FF"/>
            <stop offset="1" stop-color="#8B74FF" stop-opacity=".78"/>
          </linearGradient>
          <linearGradient id="${dkdGlassId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#E5FAFF" stop-opacity=".92"/>
            <stop offset="1" stop-color="#6BCBFF" stop-opacity=".16"/>
          </linearGradient>
        </defs>
        <path d="M12 71C34 76 96 76 120 70" stroke="#000" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>
        <g>
          <circle cx="27" cy="61" r="16" fill="#07111D" stroke="#D7E8F5" stroke-width="2.4"/>
          <circle cx="27" cy="61" r="10.2" fill="#101E2B" stroke="#48E4FF" stroke-width="2.2"/>
          <circle cx="27" cy="61" r="3.4" fill="#F5FAFF"/>
          <path d="M27 50.8V71.2M16.8 61H37.2M20 54L34 68M34 54L20 68" stroke="#F5FAFF" stroke-opacity=".52" stroke-width="1.4"/>
        </g>
        <g>
          <circle cx="102" cy="61" r="16" fill="#07111D" stroke="#D7E8F5" stroke-width="2.4"/>
          <circle cx="102" cy="61" r="10.2" fill="#101E2B" stroke="#8B74FF" stroke-width="2.2"/>
          <circle cx="102" cy="61" r="3.4" fill="#F5FAFF"/>
          <path d="M102 50.8V71.2M91.8 61H112.2M95 54L109 68M109 54L95 68" stroke="#F5FAFF" stroke-opacity=".52" stroke-width="1.4"/>
        </g>
        <path d="M31 58 47 42 74 49 96 59" stroke="#B8C7D2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42 58 59 36 79 52 62 58Z" fill="#0B1722" stroke="#48E4FF" stroke-width="2.2"/>
        <path d="M88 57 100 33" stroke="#C6D8E5" stroke-width="4" stroke-linecap="round"/>
        <path d="M93 58 104 35" stroke="#8B74FF" stroke-width="2.1" stroke-linecap="round"/>
        <path d="M39 46C47 32 59 23 77 24 87 25 94 31 99 40L91 49 68 50 53 57 38 55Z" fill="url(#${dkdPaintId})" stroke="#F5FAFF" stroke-opacity=".74" stroke-width="1.7" stroke-linejoin="round"/>
        <path d="M56 28C63 18 76 17 87 22L83 32 63 34Z" fill="#48E4FF" stroke="#F5FAFF" stroke-opacity=".7" stroke-width="1.6"/>
        <path d="M75 22C84 13 95 15 100 25L88 27Z" fill="url(#${dkdGlassId})" stroke="#F5FAFF" stroke-opacity=".72" stroke-width="1.4"/>
        <path d="M83 31 99 32 107 39 97 42 89 39Z" fill="#8B74FF" stroke="#F5FAFF" stroke-opacity=".72" stroke-width="1.5"/>
        <path d="M35 42 17 37 12 42 38 50Z" fill="#48E4FF" stroke="#F5FAFF" stroke-opacity=".62" stroke-width="1.5"/>
        <path d="M19 39 37 42" stroke="#F5FAFF" stroke-width="2" stroke-linecap="round"/>
        <path d="M54 55C65 50 78 49 91 51L85 59 58 61Z" fill="#0A1520" stroke="#F5FAFF" stroke-opacity=".44" stroke-width="1.3"/>
        <path d="M48 34 69 35 61 43 43 44Z" fill="#111D28" opacity=".94"/>
        <path d="M52 31 69 30M45 48 70 43" stroke="#F5FAFF" stroke-opacity=".82" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M50 51 79 46" stroke="#08131E" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M68 28 78 40 90 38" stroke="#F5FAFF" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M43 58 29 63M67 59 48 68" stroke="#AFC2CF" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M46 67H62" stroke="#48E4FF" stroke-width="4.2" stroke-linecap="round"/>
        <rect x="40" y="64" width="17" height="5" rx="2.5" fill="#101D28" stroke="#F5FAFF" stroke-opacity=".5"/>
        <path d="M99 38 112 36" stroke="#F5FAFF" stroke-width="2.3" stroke-linecap="round"/>
        <circle cx="98" cy="36" r="2.2" fill="#F5FAFF"/>
        <path d="M93 35 101 29" stroke="#BFD7E5" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M99 41H106" stroke="#FFF4B8" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M28 42 20 45" stroke="#FF6A7D" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M84 52 97 55M83 55 95 60" stroke="#CFDAE2" stroke-width="2.8" stroke-linecap="round"/>
        <circle cx="65" cy="50" r="6.2" fill="#142737" stroke="#F5FAFF" stroke-opacity=".58" stroke-width="1.5"/>
        <circle cx="65" cy="50" r="2.4" fill="#48E4FF"/>
      </svg>
    </span>`;
}

function dkdV29Icon(dkdName) {
  const dkdIcons = {
    shield: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 20 6v5c0 5.2-3.3 8.7-8 10-4.7-1.3-8-4.8-8-10V6l8-3Z" stroke="currentColor" stroke-width="1.8"/><path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    switch: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M9 4v16M13 9h5m-2-2 2 2-2 2M18 15h-5m2-2-2 2 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 9 8-4M15 7l2 3M17 6l2 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.2 12a6.5 6.5 0 0 0-11-4.5L4 10m16 4-3.2 2.5A6.5 6.5 0 0 1 5.8 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="18" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 18h2a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" stroke-width="1.8"/><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3h4l2 5-2.5 1.7a15 15 0 0 0 3.8 3.8L16 11l5 2v4c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7c0-2.2 1.8-4 4-4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV29ClearThemeRouteState() {
  for (const dkdKey of ['dkd_gate_route', 'dkd_gate_clean_personal_route', 'dkd_gate_transition']) {
    sessionStorage.removeItem(dkdKey);
  }
}

function dkdV29GoModern() {
  dkdV29ClearThemeRouteState();
  sessionStorage.setItem(DKD_V29_THEME_KEY, 'modern');
  sessionStorage.removeItem(DKD_V29_FORCE_KEY);
  location.replace(`/DraBornGate/?theme=modern&v=${DKD_V29_VERSION}&dkd=${Date.now()}`);
}

function dkdV29Logout() {
  const dkdTarget = [...document.querySelectorAll('button,a,[role="button"]')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V29_ROOT_ID}`))
    .find((dkdElement) => /cikis yap|cikis|logout/.test(dkdV29Normalize(
      `${dkdElement.textContent || ''} ${dkdElement.getAttribute('aria-label') || ''}`
    )));
  if (dkdTarget) {
    dkdTarget.click();
    return;
  }
  dkdV29ClearThemeRouteState();
  sessionStorage.removeItem(DKD_V29_THEME_KEY);
  sessionStorage.removeItem(DKD_V29_FORCE_KEY);
  location.replace('/DraBornGate/');
}

function dkdV29FindClickable(dkdNeedles, dkdExact = false) {
  const dkdNormalizedNeedles = dkdNeedles.map(dkdV29Normalize);
  return [...document.querySelectorAll('button,a,[role="button"],[tabindex]')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V29_ROOT_ID}`) && !dkdElement.closest('#dkd-v28-root'))
    .find((dkdElement) => {
      const dkdText = dkdV29Normalize(`${dkdElement.textContent || ''} ${dkdElement.getAttribute('aria-label') || ''} ${dkdElement.getAttribute('title') || ''}`);
      return dkdNormalizedNeedles.some((dkdNeedle) => dkdExact ? dkdText === dkdNeedle : dkdText.includes(dkdNeedle));
    }) || null;
}

function dkdV29SetNativeValue(dkdInput, dkdValue) {
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdInput, dkdValue);
  else dkdInput.value = dkdValue;
  dkdInput.dispatchEvent(new Event('input', { bubbles: true }));
  dkdInput.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV29FindCodeControl() {
  const dkdInputs = [...document.querySelectorAll('input')]
    .filter((dkdInput) => !dkdInput.closest(`#${DKD_V29_ROOT_ID}`) && !dkdInput.closest('#dkd-v28-root'));
  for (const dkdInput of dkdInputs) {
    const dkdClue = dkdV29Normalize(`${dkdInput.placeholder || ''} ${dkdInput.getAttribute('aria-label') || ''} ${dkdInput.parentElement?.textContent || ''}`);
    const dkdLooksSixDigit = dkdInput.maxLength === 6 || dkdInput.getAttribute('maxlength') === '6' || dkdClue.includes('000000');
    if (!dkdLooksSixDigit) continue;
    let dkdContainer = dkdInput.parentElement;
    for (let dkdDepth = 0; dkdContainer && dkdDepth < 9; dkdDepth += 1, dkdContainer = dkdContainer.parentElement) {
      const dkdText = dkdV29Normalize(dkdContainer.textContent);
      if (!dkdText.includes('6 haneli kurye kodu') && !dkdText.includes('kuryeni bul')) continue;
      const dkdButton = [...dkdContainer.querySelectorAll('button,[role="button"],input[type="submit"]')]
        .find((dkdCandidate) => dkdV29Normalize(`${dkdCandidate.textContent || ''} ${dkdCandidate.value || ''}`).includes('kuryeni bul'));
      if (dkdButton) return { input: dkdInput, button: dkdButton, container: dkdContainer };
    }
  }
  return null;
}

async function dkdV29EnsureCodeView() {
  let dkdControl = dkdV29FindCodeControl();
  if (dkdControl) return dkdControl;

  const dkdSecurityTab = dkdV29FindClickable(['Güvenlik'], true) || dkdV29FindClickable(['Güvenlik Merkezi']);
  dkdSecurityTab?.click();
  await dkdV29Wait(320);

  const dkdOpenCode = dkdV29FindClickable(['Kurye Kodu Doğrula', '6 Haneli Kurye Kodu', 'Kodu Doğrula']);
  dkdOpenCode?.click();

  for (let dkdAttempt = 0; dkdAttempt < 28; dkdAttempt += 1) {
    await dkdV29Wait(90);
    dkdControl = dkdV29FindCodeControl();
    if (dkdControl) return dkdControl;
  }
  return null;
}

function dkdV29FindQueueHeading() {
  return [...document.querySelectorAll('h1,h2,h3,strong,div,span')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V29_ROOT_ID}`) && !dkdElement.closest('#dkd-v28-root'))
    .find((dkdElement) => dkdV29Normalize(dkdElement.textContent) === 'canli kurye kuyrugu') || null;
}

async function dkdV29EnsureQueueView() {
  let dkdHeading = dkdV29FindQueueHeading();
  if (dkdHeading) return dkdHeading;

  const dkdQueueTab = dkdV29FindClickable(['Kurye'], true) || dkdV29FindClickable(['Kurye Kuyruğu', 'Canlı Kurye Kuyruğu']);
  dkdQueueTab?.click();
  for (let dkdAttempt = 0; dkdAttempt < 28; dkdAttempt += 1) {
    await dkdV29Wait(90);
    dkdHeading = dkdV29FindQueueHeading();
    if (dkdHeading) return dkdHeading;
  }
  return null;
}

function dkdV29TextLines(dkdElement) {
  return String(dkdElement?.innerText || dkdElement?.textContent || '')
    .split(/\n+/)
    .map((dkdLine) => dkdLine.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function dkdV29ReadLabeledValue(dkdContainer, dkdLabels) {
  const dkdNormalizedLabels = dkdLabels.map(dkdV29Normalize);
  const dkdElements = [...dkdContainer.querySelectorAll('small,span,div,p,strong,b,label,dt,dd')];
  for (const dkdElement of dkdElements) {
    const dkdRaw = String(dkdElement.textContent || '').replace(/\s+/g, ' ').trim();
    const dkdText = dkdV29Normalize(dkdRaw);
    const dkdLabelIndex = dkdNormalizedLabels.findIndex((dkdLabel) => dkdText === dkdLabel || dkdText.startsWith(`${dkdLabel} `));
    if (dkdLabelIndex < 0) continue;
    const dkdLabel = dkdLabels[dkdLabelIndex];
    const dkdInline = dkdRaw.replace(new RegExp(`^${dkdLabel}\\s*[:\\-]?\\s*`, 'i'), '').trim();
    if (dkdInline && dkdV29Normalize(dkdInline) !== dkdNormalizedLabels[dkdLabelIndex] && dkdInline.length <= 180) return dkdInline;
    const dkdSibling = String(dkdElement.nextElementSibling?.textContent || '').replace(/\s+/g, ' ').trim();
    if (dkdSibling && dkdSibling.length <= 180) return dkdSibling;
    const dkdParentChildren = [...(dkdElement.parentElement?.children || [])]
      .filter((dkdChild) => dkdChild !== dkdElement)
      .map((dkdChild) => String(dkdChild.textContent || '').replace(/\s+/g, ' ').trim())
      .find((dkdValue) => dkdValue && dkdValue.length <= 180 && !dkdNormalizedLabels.includes(dkdV29Normalize(dkdValue)));
    if (dkdParentChildren) return dkdParentChildren;
  }
  return '';
}

function dkdV29FindQueueCard(dkdStatusElement) {
  let dkdNode = dkdStatusElement.parentElement;
  let dkdBest = null;
  for (let dkdDepth = 0; dkdNode && dkdDepth < 9; dkdDepth += 1, dkdNode = dkdNode.parentElement) {
    if (dkdNode.closest(`#${DKD_V29_ROOT_ID}`) || dkdNode.closest('#dkd-v28-root')) break;
    const dkdText = String(dkdNode.innerText || dkdNode.textContent || '').replace(/\s+/g, ' ').trim();
    const dkdNormalized = dkdV29Normalize(dkdText);
    if (dkdNormalized.includes('canli kurye kuyrugu')) continue;
    if (dkdText.length < 35 || dkdText.length > 1800) continue;
    const dkdHasDetails = /adres|siparis|mesafe|plaka|trendyol|getir|yemeksepeti|uber|kapida|bekliyor/i.test(dkdText);
    if (!dkdHasDetails) continue;
    const dkdInputCount = dkdNode.querySelectorAll('input').length;
    const dkdScore = dkdText.length + dkdInputCount * 160;
    if (!dkdBest || dkdScore < dkdBest.score) dkdBest = { node: dkdNode, score: dkdScore };
  }
  return dkdBest?.node || null;
}

function dkdV29ExtractName(dkdCard, dkdLines) {
  const dkdCandidates = [...dkdCard.querySelectorAll('h2,h3,h4,strong,b')]
    .map((dkdElement) => String(dkdElement.textContent || '').replace(/\s+/g, ' ').trim())
    .filter((dkdValue) => {
      const dkdNormalized = dkdV29Normalize(dkdValue);
      return dkdValue.length >= 2 && dkdValue.length <= 70 &&
        !/bekliyor|kapida|onayla|reddet|adres|siparis|mesafe|canli kurye kuyrugu/.test(dkdNormalized);
    });
  return dkdCandidates[0] || dkdLines.find((dkdLine) => /^[\p{L}\d_. -]{2,50}$/u.test(dkdLine)) || 'Kurye bilgisi bekleniyor';
}

function dkdV29ExtractPlatform(dkdLines) {
  return dkdLines.find((dkdLine) => /trendyol|yemeksepeti|getir|migros|hepsijet|aras|mng|yurtici|surat|ptt|amazon|uber|draborngo/i.test(dkdLine)) || '';
}

function dkdV29ExtractQueueRecords() {
  const dkdStatuses = new Set(['bekliyor', 'kapida', 'onaylandi', 'incelendi', 'geldi']);
  const dkdStatusElements = [...document.querySelectorAll('span,strong,b,div,p')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V29_ROOT_ID}`) && !dkdElement.closest('#dkd-v28-root'))
    .filter((dkdElement) => dkdStatuses.has(dkdV29Normalize(dkdElement.textContent)));

  const dkdCards = [];
  const dkdCardSet = new Set();
  for (const dkdStatusElement of dkdStatusElements) {
    const dkdCard = dkdV29FindQueueCard(dkdStatusElement);
    if (!dkdCard || dkdCardSet.has(dkdCard)) continue;
    dkdCardSet.add(dkdCard);
    dkdCards.push(dkdCard);
  }

  const dkdRecords = [];
  const dkdFingerprints = new Set();
  for (const dkdCard of dkdCards) {
    const dkdLines = dkdV29TextLines(dkdCard);
    const dkdAllText = dkdLines.join(' • ');
    const dkdPlate = dkdAllText.toUpperCase().match(/\b\d{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?\d{2,4}\b/)?.[0] ||
      dkdV29ReadLabeledValue(dkdCard, ['Plaka', 'Plaka / Kayıt']);
    const dkdOrder = dkdV29ReadLabeledValue(dkdCard, ['Sipariş', 'Sipariş No', 'Kayıt No']) ||
      dkdAllText.match(/\bDBG[- ]?\d{4,}\b/i)?.[0] || '';
    const dkdName = dkdV29ExtractName(dkdCard, dkdLines);
    const dkdPlatform = dkdV29ExtractPlatform(dkdLines) || dkdV29ReadLabeledValue(dkdCard, ['Platform', 'Firma', 'Kargo']);
    const dkdGate = dkdV29ReadLabeledValue(dkdCard, ['Kapı', 'Site / Kapı', 'Site', 'Giriş Kapısı']) ||
      dkdLines.find((dkdLine) => /referans|etap|kapisi|kapısı|ana kapi|ana kapı/i.test(dkdLine)) || '';
    const dkdOrigin = dkdV29ReadLabeledValue(dkdCard, [
      'Nereden', 'Kaynak', 'Alış Adresi', 'Çıkış Noktası', 'Gönderi Kaynağı', 'Mağaza', 'Restoran', 'Geldiği Yer'
    ]);
    const dkdDestination = dkdV29ReadLabeledValue(dkdCard, [
      'Teslimat Adresi', 'Hedef Adres', 'Adres', 'Nereye', 'Hedef Nokta', 'Blok / Daire', 'Daire'
    ]);
    const dkdDistance = dkdV29ReadLabeledValue(dkdCard, ['Mesafe', 'Uzaklık']) ||
      dkdLines.find((dkdLine) => /\b\d+(?:[.,]\d+)?\s*(?:m|metre|km)\b/i.test(dkdLine)) || '';
    const dkdPhone = dkdV29ReadLabeledValue(dkdCard, ['Telefon', 'Kurye Telefonu', 'İletişim']);
    const dkdNote = dkdV29ReadLabeledValue(dkdCard, ['Not', 'Açıklama', 'Teslimat Notu']);
    const dkdStatus = dkdLines.find((dkdLine) => dkdStatuses.has(dkdV29Normalize(dkdLine))) || 'Bekliyor';
    const dkdFingerprint = dkdV29Normalize([dkdOrder, dkdPlate, dkdName, dkdGate, dkdStatus].filter(Boolean).join('|'));
    if (!dkdFingerprint || dkdFingerprints.has(dkdFingerprint)) continue;
    dkdFingerprints.add(dkdFingerprint);
    dkdRecords.push({
      id: `dkd-${Math.abs([...dkdFingerprint].reduce((dkdHash, dkdChar) => ((dkdHash << 5) - dkdHash) + dkdChar.charCodeAt(0), 0)).toString(36)}`,
      name: dkdName,
      status: dkdStatus,
      platform: dkdPlatform || 'Platform bilgisi paylaşılmadı',
      plate: dkdPlate || 'Plaka paylaşılmadı',
      gate: dkdGate || 'Kapı bilgisi paylaşılmadı',
      origin: dkdOrigin || 'Geldiği adres paylaşılmadı',
      destination: dkdDestination || 'Teslimat adresi paylaşılmadı',
      order: dkdOrder || 'Sipariş bilgisi paylaşılmadı',
      distance: dkdDistance || 'Mesafe paylaşılmadı',
      phone: dkdPhone || 'Telefon paylaşılmadı',
      note: dkdNote || '',
      nativeCard: dkdCard,
    });
  }
  return dkdRecords;
}

function dkdV29PatchMotorcycleHost(dkdHost) {
  if (!dkdHost || dkdHost.dataset.dkdV29Motorcycle === 'true') return;
  dkdHost.dataset.dkdV29Motorcycle = 'true';
  dkdHost.classList.add('dkd-v29-motorcycle-host');
  dkdHost.innerHTML = dkdV29MotorcycleSvg();
}

function dkdV29FindLikelyIconHost(dkdContainer) {
  const dkdCandidates = [...dkdContainer.querySelectorAll('div,span')]
    .filter((dkdElement) => dkdElement.querySelector(':scope > svg') || dkdElement.matches('[class*="icon"],[class*="motor"],[class*="bike"]'))
    .filter((dkdElement) => !String(dkdElement.textContent || '').trim())
    .filter((dkdElement) => dkdElement.querySelectorAll('svg').length === 1);
  return dkdCandidates.find((dkdElement) => {
    const dkdRect = dkdElement.getBoundingClientRect();
    return (!dkdRect.width || (dkdRect.width >= 34 && dkdRect.width <= 145)) &&
      (!dkdRect.height || (dkdRect.height >= 34 && dkdRect.height <= 145));
  }) || dkdCandidates[0] || null;
}

function dkdV29PatchAllMotorcycleIcons() {
  document.querySelectorAll('.dkd-v28-request-icon').forEach(dkdV29PatchMotorcycleHost);
  document.querySelectorAll('[class*="motorcycle"],[class*="moto-icon"],[class*="bike-icon"],[aria-label*="motosiklet" i],[title*="motosiklet" i]')
    .forEach((dkdElement) => {
      if (dkdElement.closest(`#${DKD_V29_ROOT_ID}`)) return;
      const dkdHost = dkdElement.matches('svg') ? dkdElement.parentElement : dkdElement;
      dkdV29PatchMotorcycleHost(dkdHost);
    });

  for (const dkdRecord of dkdV29State.queueRecords) {
    const dkdHost = dkdV29FindLikelyIconHost(dkdRecord.nativeCard);
    if (dkdHost) dkdV29PatchMotorcycleHost(dkdHost);
  }

  const dkdCourierCards = [...document.querySelectorAll('article,section,[class*="card"]')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V29_ROOT_ID}`) && !dkdElement.closest('#dkd-v28-root'))
    .filter((dkdElement) => {
      const dkdText = dkdV29Normalize(dkdElement.textContent);
      return dkdText.includes('kurye') && (dkdText.includes('plaka') || dkdText.includes('siparis') || dkdText.includes('kapida'));
    });
  for (const dkdCard of dkdCourierCards) {
    const dkdHost = dkdV29FindLikelyIconHost(dkdCard);
    if (dkdHost) dkdV29PatchMotorcycleHost(dkdHost);
  }
}

function dkdV29RootTemplate() {
  return `
    <div class="dkd-v29-ambient" aria-hidden="true"><i></i><i></i><i></i></div>
    <header class="dkd-v29-header">
      <div class="dkd-v29-brand">
        <div class="dkd-v29-brand-mark"><b>DBG</b><span></span></div>
        <div><strong>DraBornGate</strong><span>GÜVENLİK SADE TEMA · WEB v${DKD_V29_VERSION}</span></div>
      </div>
      <div class="dkd-v29-header-actions">
        <button type="button" id="dkd-v29-modern" aria-label="Modern temaya geç" title="Modern temaya geç">${dkdV29Icon('switch')}</button>
        <button type="button" id="dkd-v29-exit" class="danger" aria-label="Çıkış yap" title="Çıkış yap">${dkdV29Icon('exit')}</button>
      </div>
    </header>
    <main class="dkd-v29-main">
      <section class="dkd-v29-intro">
        <div><span><i></i> CANLI KAPI OPERASYONU</span><h1>Kurye eşleştirme<br><em>tek ve anlaşılır ekranda</em></h1><p>Kuryeyi 6 haneli kodla bulun; geldiği yer, teslimat adresi, sipariş, plaka, kapı ve mesafe bilgilerini canlı kuyrukta kontrol edin.</p></div>
        <div class="dkd-v29-intro-moto">${dkdV29MotorcycleSvg('large')}</div>
      </section>

      <section class="dkd-v29-lookup-card">
        <div class="dkd-v29-lookup-head"><div class="dkd-v29-lookup-icon">${dkdV29Icon('key')}</div><div><span>HIZLI KOD DOĞRULAMA</span><h2>6 Haneli Kurye Kodu</h2><p>Kapıya gelen kuryenin tek kullanımlık kodunu girin.</p></div></div>
        <div class="dkd-v29-lookup-row">
          <label><span>${dkdV29Icon('key')}</span><input id="dkd-v29-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" aria-label="6 haneli kurye kodu"></label>
          <button type="button" id="dkd-v29-find">${dkdV29Icon('search')}<span>KURYENİ BUL</span></button>
        </div>
        <div id="dkd-v29-lookup-feedback" class="dkd-v29-lookup-feedback" hidden></div>
      </section>

      <section class="dkd-v29-summary" aria-label="Kapı özeti">
        <article><div class="dkd-v29-summary-icon moto">${dkdV29MotorcycleSvg()}</div><div><span>AKTİF KAYIT</span><strong id="dkd-v29-total">—</strong></div></article>
        <article><div class="dkd-v29-summary-icon waiting">${dkdV29Icon('sync')}</div><div><span>BEKLEYEN</span><strong id="dkd-v29-waiting">—</strong></div></article>
        <article><div class="dkd-v29-summary-icon gate">${dkdV29Icon('pin')}</div><div><span>KAPIDA</span><strong id="dkd-v29-at-gate">—</strong></div></article>
        <article><div class="dkd-v29-summary-icon sync">${dkdV29Icon('sync')}</div><div><span>SON GÜNCELLEME</span><strong id="dkd-v29-time">--:--</strong></div></article>
      </section>

      <section class="dkd-v29-queue">
        <div class="dkd-v29-section-head"><div><span>CANLI OPERASYON</span><h2>Canlı Kurye Kuyruğu</h2><p>Modern paneldeki aktif kurye kayıtları otomatik senkronize edilir.</p></div><div class="dkd-v29-live"><i></i><b id="dkd-v29-live-label">Kuyruk hazırlanıyor</b></div></div>
        <div id="dkd-v29-cards" class="dkd-v29-cards" aria-live="polite"></div>
      </section>

      <section class="dkd-v29-safety"><div>${dkdV29Icon('shield')}</div><p><strong>Güvenli eşleştirme</strong><span>Kurye kodunu yalnızca ekrandaki kişi, plaka, sipariş ve teslimat bilgilerini kontrol ettikten sonra doğrulayın.</span></p></section>
    </main>`;
}

function dkdV29Mount() {
  if (dkdV29State.mounted || !document.body) return;
  document.querySelector('#dkd-v28-root')?.remove();
  document.body.classList.remove('dkd-v28-simple-active');
  const dkdRoot = document.createElement('div');
  dkdRoot.id = DKD_V29_ROOT_ID;
  dkdRoot.innerHTML = dkdV29RootTemplate();
  document.body.appendChild(dkdRoot);
  document.body.classList.add('dkd-v29-simple-active');
  document.documentElement.dataset.dkdV29Simple = 'true';
  document.querySelector('#dkd-v29-modern')?.addEventListener('click', dkdV29GoModern);
  document.querySelector('#dkd-v29-exit')?.addEventListener('click', dkdV29Logout);
  const dkdInput = document.querySelector('#dkd-v29-code');
  dkdInput?.addEventListener('input', () => {
    dkdInput.value = dkdInput.value.replace(/\D/g, '').slice(0, 6);
    dkdV29State.lookupValue = dkdInput.value;
    document.querySelector('.dkd-v29-lookup-card')?.classList.toggle('code-ready', dkdInput.value.length === 6);
  });
  dkdInput?.addEventListener('keydown', (dkdEvent) => {
    if (dkdEvent.key === 'Enter') void dkdV29SubmitLookup();
  });
  document.querySelector('#dkd-v29-find')?.addEventListener('click', () => void dkdV29SubmitLookup());
  dkdV29State.mounted = true;
  dkdV29Render();
  void dkdV29RefreshNativeSnapshots();
}

function dkdV29DetailItem(dkdIcon, dkdLabel, dkdValue, dkdClassName = '') {
  return `<div class="dkd-v29-detail ${dkdClassName}"><span class="dkd-v29-detail-icon">${dkdV29Icon(dkdIcon)}</span><div><small>${dkdV29Escape(dkdLabel)}</small><strong>${dkdV29Escape(dkdValue)}</strong></div></div>`;
}

function dkdV29QueueCardTemplate(dkdRecord, dkdIndex) {
  const dkdStatus = dkdV29Normalize(dkdRecord.status);
  const dkdStatusClass = dkdStatus.includes('kapida') ? 'at-gate' : dkdStatus.includes('onay') ? 'approved' : 'waiting';
  return `
    <article class="dkd-v29-courier-card ${dkdStatusClass}" data-record-id="${dkdV29Escape(dkdRecord.id)}">
      <div class="dkd-v29-card-top">
        <div class="dkd-v29-card-moto">${dkdV29MotorcycleSvg()}</div>
        <div class="dkd-v29-card-person"><span>AKTİF KURYE #${String(dkdIndex + 1).padStart(2, '0')}</span><h3>${dkdV29Escape(dkdRecord.name)}</h3><p>${dkdV29Escape(dkdRecord.platform)} · ${dkdV29Escape(dkdRecord.plate)} · ${dkdV29Escape(dkdRecord.gate)}</p></div>
        <div class="dkd-v29-status"><i></i>${dkdV29Escape(dkdRecord.status.toLocaleUpperCase('tr-TR'))}</div>
      </div>
      <div class="dkd-v29-route-grid">
        ${dkdV29DetailItem('route', 'GELDİĞİ YER / KAYNAK', dkdRecord.origin, 'origin')}
        ${dkdV29DetailItem('pin', 'TESLİMAT ADRESİ / HEDEF', dkdRecord.destination, 'destination')}
      </div>
      <div class="dkd-v29-detail-grid">
        ${dkdV29DetailItem('shield', 'SİTE / KAPI', dkdRecord.gate)}
        ${dkdV29DetailItem('receipt', 'SİPARİŞ / KAYIT', dkdRecord.order)}
        ${dkdV29DetailItem('route', 'MESAFE', dkdRecord.distance)}
        ${dkdV29DetailItem('phone', 'İLETİŞİM', dkdRecord.phone)}
      </div>
      ${dkdRecord.note ? `<div class="dkd-v29-note"><strong>TESLİMAT NOTU</strong><span>${dkdV29Escape(dkdRecord.note)}</span></div>` : ''}
    </article>`;
}

function dkdV29EmptyTemplate() {
  return `<div class="dkd-v29-empty"><div>${dkdV29MotorcycleSvg('empty')}</div><h3>Canlı kurye kuyruğu hazırlanıyor</h3><p>Modern paneldeki kayıtlar ve detay alanları okunuyor. Yeni talepler sayfayı yenilemeden burada görünecek.</p><span><i></i> Canlı senkronizasyon aktif</span></div>`;
}

function dkdV29RenderLookupFeedback() {
  const dkdFeedback = document.querySelector('#dkd-v29-lookup-feedback');
  const dkdButton = document.querySelector('#dkd-v29-find');
  if (!dkdFeedback || !dkdButton) return;
  dkdButton.disabled = dkdV29State.lookupState === 'loading';
  dkdButton.innerHTML = dkdV29State.lookupState === 'loading'
    ? `${dkdV29Icon('sync')}<span>ARANIYOR</span>`
    : `${dkdV29Icon('search')}<span>KURYENİ BUL</span>`;
  if (!dkdV29State.lookupMessage) {
    dkdFeedback.hidden = true;
    dkdFeedback.className = 'dkd-v29-lookup-feedback';
    dkdFeedback.innerHTML = '';
    return;
  }
  dkdFeedback.hidden = false;
  dkdFeedback.className = `dkd-v29-lookup-feedback ${dkdV29State.lookupState}`;
  dkdFeedback.innerHTML = `${dkdV29State.lookupState === 'error' ? dkdV29Icon('shield') : dkdV29State.lookupState === 'success' ? dkdV29Icon('check') : dkdV29Icon('sync')}<span>${dkdV29Escape(dkdV29State.lookupMessage)}</span>`;
}

function dkdV29Render() {
  if (!dkdV29State.mounted) return;
  const dkdRecords = dkdV29State.queueRecords;
  const dkdWaiting = dkdRecords.filter((dkdRecord) => dkdV29Normalize(dkdRecord.status).includes('bekliyor')).length;
  const dkdAtGate = dkdRecords.filter((dkdRecord) => dkdV29Normalize(dkdRecord.status).includes('kapida')).length;
  const dkdSetText = (dkdSelector, dkdValue) => {
    const dkdElement = document.querySelector(dkdSelector);
    if (dkdElement) dkdElement.textContent = String(dkdValue);
  };
  dkdSetText('#dkd-v29-total', dkdRecords.length || '—');
  dkdSetText('#dkd-v29-waiting', dkdRecords.length ? dkdWaiting : '—');
  dkdSetText('#dkd-v29-at-gate', dkdRecords.length ? dkdAtGate : '—');
  dkdSetText('#dkd-v29-time', dkdV29State.lastSync ? dkdV29State.lastSync.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--');
  dkdSetText('#dkd-v29-live-label', dkdRecords.length ? `${dkdRecords.length} aktif kayıt` : 'Kuyruk hazırlanıyor');
  const dkdCards = document.querySelector('#dkd-v29-cards');
  if (dkdCards) dkdCards.innerHTML = dkdRecords.length ? dkdRecords.map(dkdV29QueueCardTemplate).join('') : dkdV29EmptyTemplate();
  const dkdInput = document.querySelector('#dkd-v29-code');
  if (dkdInput && dkdInput.value !== dkdV29State.lookupValue) dkdInput.value = dkdV29State.lookupValue;
  dkdV29RenderLookupFeedback();
}

async function dkdV29SubmitLookup() {
  const dkdCode = String(document.querySelector('#dkd-v29-code')?.value || '').replace(/\D/g, '').slice(0, 6);
  dkdV29State.lookupValue = dkdCode;
  if (dkdCode.length !== 6) {
    dkdV29State.lookupState = 'error';
    dkdV29State.lookupMessage = 'Kuryenin verdiği 6 haneli kodu eksiksiz girin.';
    dkdV29RenderLookupFeedback();
    return;
  }
  dkdV29State.lookupState = 'loading';
  dkdV29State.lookupMessage = 'Kurye güvenli sistemde aranıyor…';
  dkdV29RenderLookupFeedback();

  const dkdControl = await dkdV29EnsureCodeView();
  if (!dkdControl) {
    dkdV29State.lookupState = 'error';
    dkdV29State.lookupMessage = 'Modern paneldeki Kuryeni Bul alanına ulaşılamadı. Birkaç saniye sonra tekrar deneyin.';
    dkdV29RenderLookupFeedback();
    return;
  }
  dkdV29State.codeControl = dkdControl;
  dkdV29SetNativeValue(dkdControl.input, dkdCode);
  await dkdV29Wait(160);
  dkdControl.button.click();
  dkdV29State.lookupState = 'success';
  dkdV29State.lookupMessage = 'Kurye araması gönderildi. Sonuç ve kuyruk bilgileri güncelleniyor.';
  dkdV29RenderLookupFeedback();
  setTimeout(() => void dkdV29RefreshNativeSnapshots(), 850);
}

async function dkdV29RefreshNativeSnapshots() {
  if (dkdV29State.nativeSyncWorking || !dkdV29IsSimpleRequested() || !dkdV29HasSecuritySession()) return;
  dkdV29State.nativeSyncWorking = true;
  try {
    const dkdQueueHeading = await dkdV29EnsureQueueView();
    if (dkdQueueHeading) {
      await dkdV29Wait(180);
      const dkdRecords = dkdV29ExtractQueueRecords();
      const dkdSignature = JSON.stringify(dkdRecords.map((dkdRecord) => ({
        id: dkdRecord.id,
        name: dkdRecord.name,
        status: dkdRecord.status,
        platform: dkdRecord.platform,
        plate: dkdRecord.plate,
        gate: dkdRecord.gate,
        origin: dkdRecord.origin,
        destination: dkdRecord.destination,
        order: dkdRecord.order,
        distance: dkdRecord.distance,
        phone: dkdRecord.phone,
        note: dkdRecord.note,
      })));
      if (dkdSignature !== dkdV29State.queueSignature || dkdRecords.length) {
        dkdV29State.queueRecords = dkdRecords;
        dkdV29State.queueSignature = dkdSignature;
      }
      dkdV29PatchAllMotorcycleIcons();
    }

    const dkdCodeControl = await dkdV29EnsureCodeView();
    if (dkdCodeControl) dkdV29State.codeControl = dkdCodeControl;
    dkdV29State.lastSync = new Date();
    dkdV29Render();
  } finally {
    dkdV29State.nativeSyncWorking = false;
    clearTimeout(dkdV29State.nativeSyncTimer);
    dkdV29State.nativeSyncTimer = setTimeout(() => void dkdV29RefreshNativeSnapshots(), 4800);
  }
}

function dkdV29Maintenance() {
  dkdV29ScrubLegacyVersions();
  dkdV29PatchAllMotorcycleIcons();
  if (dkdV29IsSimpleRequested() && dkdV29HasSecuritySession()) {
    if (!dkdV29State.mounted) dkdV29Mount();
  }
}

export async function dkdV29PrepareInitialSurface({ simpleMode = dkdV29IsSimpleRequested() } = {}) {
  const dkdStartedAt = Date.now();
  while (Date.now() - dkdStartedAt < 4200) {
    dkdV29ScrubLegacyVersions();
    dkdV29PatchAllMotorcycleIcons();
    if (simpleMode && dkdV29HasSecuritySession()) {
      dkdV29Mount();
      break;
    }
    if (!simpleMode && document.querySelector('#dkd-app')?.childElementCount) break;
    if (dkdV29LooksLikeAuthSurface()) break;
    await dkdV29Wait(80);
  }
  dkdV29ScrubLegacyVersions();
  dkdV29PatchAllMotorcycleIcons();
  if (simpleMode && dkdV29HasSecuritySession() && !dkdV29State.mounted) dkdV29Mount();
  if (!dkdV29State.maintenanceTimer) dkdV29State.maintenanceTimer = setInterval(dkdV29Maintenance, 650);
}

new MutationObserver((dkdMutations) => {
  if (!dkdMutations.some((dkdMutation) => dkdMutation.addedNodes.length || dkdMutation.type === 'characterData')) return;
  dkdV29ScrubLegacyVersions();
  dkdV29PatchAllMotorcycleIcons();
  if (dkdV29IsSimpleRequested() && dkdV29HasSecuritySession() && !dkdV29State.mounted) dkdV29Mount();
}).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
