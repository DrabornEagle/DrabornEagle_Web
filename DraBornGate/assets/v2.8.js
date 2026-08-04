const DKD_V28_VERSION = '2.8.0';
const DKD_V28_ROOT_ID = 'dkd-v28-root';
const DKD_V28_SIMPLE_PATH = '/DraBornGate/Guvenlik-Sade-Tema/';
const DKD_V28_THEME_KEY = 'dkd_gate_security_theme';
const DKD_V28_FORCE_KEY = 'dkd_gate_force_theme';
const DKD_V28_ROUTE_KEYS = ['dkd_gate_route', 'dkd_gate_clean_personal_route', 'dkd_gate_transition'];
const DKD_V28_LEGACY_SELECTOR = [
  '[class*="dkd-v24"]',
  '[class*="dkd-v25"]',
  '[class*="dkd-v26"]',
  '[class*="dkd-v27"]',
  '[data-dkd-v24-theme]',
  '[data-dkd-v25-theme]',
  '[data-dkd-v26-theme]',
  '[data-dkd-v27-theme]',
].join(',');

const dkdV28State = {
  mounted: false,
  initialized: false,
  stableSources: [],
  candidateSignature: '',
  candidateHits: 0,
  lastStableSignature: '',
  lastRenderSignature: '',
  lastSync: new Date(),
  busySourceId: '',
  feedbackBySource: new Map(),
  queueOpenAt: 0,
  queueAttempts: 0,
  scanTimer: null,
  mutationTimer: null,
};

function dkdV28Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV28Escape(dkdValue) {
  return String(dkdValue || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV28Hash(dkdValue) {
  let dkdHash = 2166136261;
  const dkdText = String(dkdValue || '');
  for (let dkdIndex = 0; dkdIndex < dkdText.length; dkdIndex += 1) {
    dkdHash ^= dkdText.charCodeAt(dkdIndex);
    dkdHash = Math.imul(dkdHash, 16777619);
  }
  return `dkd-${(dkdHash >>> 0).toString(36)}`;
}

function dkdV28IsSimpleRequested() {
  const dkdPath = dkdV28Normalize(location.pathname);
  return dkdPath.includes('guvenlik sade tema') ||
    sessionStorage.getItem(DKD_V28_THEME_KEY) === 'simple' ||
    sessionStorage.getItem(DKD_V28_FORCE_KEY) === 'simple';
}

function dkdV28ClearRouteState() {
  for (const dkdKey of DKD_V28_ROUTE_KEYS) sessionStorage.removeItem(dkdKey);
}

function dkdV28GoSimple() {
  dkdV28ClearRouteState();
  sessionStorage.setItem(DKD_V28_THEME_KEY, 'simple');
  sessionStorage.setItem(DKD_V28_FORCE_KEY, 'simple');
  sessionStorage.setItem('dkd_gate_transition', 'simple');
  location.replace(`${DKD_V28_SIMPLE_PATH}?v=${DKD_V28_VERSION}&dkd=${Date.now()}`);
}

function dkdV28GoModern() {
  dkdV28ClearRouteState();
  sessionStorage.setItem(DKD_V28_THEME_KEY, 'modern');
  sessionStorage.removeItem(DKD_V28_FORCE_KEY);
  location.replace(`/DraBornGate/?theme=modern&v=${DKD_V28_VERSION}&dkd=${Date.now()}`);
}

function dkdV28HasSecuritySession() {
  const dkdContextRole = window.dkdV325Session?.currentRole?.() || window.dkdV324Session?.currentRole?.();
  if (dkdContextRole) return dkdContextRole === 'security';
  const dkdRoleBadge = [...document.querySelectorAll('span,strong,b,p,small')].find((dkdElement) => {
    if (dkdV28Normalize(dkdElement.textContent) !== 'guvenlik') return false;
    const dkdRect = dkdElement.getBoundingClientRect();
    return dkdRect.top >= 0 && dkdRect.top < 720 && dkdRect.width > 0 && dkdRect.height > 0;
  });
  return Boolean(dkdRoleBadge);
}

function dkdV28Icon(dkdName, dkdClassName = '') {
  const dkdCommon = `class="${dkdClassName}" viewBox="0 0 24 24" fill="none" aria-hidden="true"`;
  const dkdIcons = {
    shield: `<svg ${dkdCommon}><path d="M12 3 20 6v5c0 5.2-3.3 8.7-8 10-4.7-1.3-8-4.8-8-10V6l8-3Z" stroke="currentColor" stroke-width="1.8"/><path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    switch: `<svg ${dkdCommon}><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M9 4v16M13 9h5m-2-2 2 2-2 2M18 15h-5m2-2-2 2 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    exit: `<svg ${dkdCommon}><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sync: `<svg ${dkdCommon}><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.2 12a6.5 6.5 0 0 0-11-4.5L4 10m16 4-3.2 2.5A6.5 6.5 0 0 1 5.8 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    courier: `<svg ${dkdCommon}><path d="M4 16h2l2-6h7l2 6h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 10 6.5 7H4M15 10h3l2 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/></svg>`,
    key: `<svg ${dkdCommon}><circle cx="8" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 9 8-4M15 7l2 3M17 6l2 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    check: `<svg ${dkdCommon}><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    alert: `<svg ${dkdCommon}><path d="M12 3 2.8 19h18.4L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9v4m0 3h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  };
  return dkdIcons[dkdName] || '';
}

function dkdV28ReplaceVersions(dkdRoot = document.body) {
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
  for (const dkdNode of dkdNodes) {
    const dkdCurrent = dkdNode.nodeValue || '';
    if (!/v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d)?|6(?:\.0)?|7(?:\.0)?)/i.test(dkdCurrent)) continue;
    dkdNode.nodeValue = dkdCurrent
      .replace(/DraBornGate Web v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d)?|6(?:\.0)?|7(?:\.0)?)/gi, `DraBornGate Web v${DKD_V28_VERSION}`)
      .replace(/WEB v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d)?|6(?:\.0)?|7(?:\.0)?)/gi, `WEB v${DKD_V28_VERSION}`);
  }
}

function dkdV28HideLegacySwitches() {
  for (const dkdElement of document.querySelectorAll(
    '.dkd-v24-modern-to-simple,.dkd-v25-modern-to-simple,.dkd-v26-modern-to-simple,.dkd-v27-modern-to-simple,[class*="modern-to-simple"]'
  )) {
    if (!dkdElement.closest(`#${DKD_V28_ROOT_ID}`)) dkdElement.classList.add('dkd-v28-legacy-switch-hidden');
  }

  for (const dkdElement of document.querySelectorAll('button,a,[role="button"]')) {
    if (dkdElement.id === 'dkd-v28-modern-switch') continue;
    const dkdText = dkdV28Normalize(dkdElement.textContent || dkdElement.getAttribute('aria-label'));
    if (!dkdText.includes('sade temaya gec')) continue;
    const dkdContainer = dkdElement.closest('article,section,[class*="dkd-v24"],[class*="dkd-v25"],[class*="dkd-v26"],[class*="dkd-v27"]') || dkdElement;
    dkdContainer.classList.add('dkd-v28-legacy-switch-hidden');
  }
}

function dkdV28FindBellButton() {
  const dkdButtons = [...document.querySelectorAll('button,[role="button"]')]
    .filter((dkdButton) => !dkdButton.closest(`#${DKD_V28_ROOT_ID}`));

  const dkdLabeled = dkdButtons.find((dkdButton) => {
    const dkdLabel = dkdV28Normalize([
      dkdButton.getAttribute('aria-label'),
      dkdButton.getAttribute('title'),
      dkdButton.textContent,
    ].join(' '));
    return dkdLabel.includes('bildirim') || dkdLabel.includes('notification');
  });
  if (dkdLabeled) return dkdLabeled;

  const dkdTopButtons = dkdButtons.filter((dkdButton) => {
    const dkdRect = dkdButton.getBoundingClientRect();
    return dkdRect.top >= 0 && dkdRect.top < 190 && dkdRect.width >= 38 && dkdRect.width <= 100 && dkdButton.querySelector('svg');
  });
  return dkdTopButtons.at(-1) || null;
}

function dkdV28EnsureModernSwitchIcon() {
  if (dkdV28IsSimpleRequested() || !dkdV28HasSecuritySession()) return;
  if (document.querySelector('#dkd-v28-modern-switch')) return;
  const dkdBellButton = dkdV28FindBellButton();
  if (!dkdBellButton?.parentElement) return;

  const dkdButton = document.createElement('button');
  dkdButton.type = 'button';
  dkdButton.id = 'dkd-v28-modern-switch';
  dkdButton.className = 'dkd-v28-modern-switch';
  dkdButton.setAttribute('aria-label', 'Sade Tema görünümüne geç');
  dkdButton.setAttribute('title', 'Sade Tema görünümüne geç');
  dkdButton.innerHTML = dkdV28Icon('switch');
  dkdButton.addEventListener('click', dkdV28GoSimple);
  dkdBellButton.insertAdjacentElement('afterend', dkdButton);
}

function dkdV28RootTemplate() {
  return `
    <div class="dkd-v28-bg" aria-hidden="true"><i></i><i></i><i></i></div>
    <header class="dkd-v28-header">
      <div class="dkd-v28-brand">
        <div class="dkd-v28-brand-mark"><b>DBG</b><span></span></div>
        <div><strong>DraBornGate</strong><span>Güvenlik Sade Tema · Web v${DKD_V28_VERSION}</span></div>
      </div>
      <div class="dkd-v28-header-actions">
        <button type="button" id="dkd-v28-modern" aria-label="Modern temaya geç" title="Modern temaya geç">${dkdV28Icon('switch')}</button>
        <button type="button" id="dkd-v28-exit" class="danger" aria-label="Çıkış yap" title="Çıkış yap">${dkdV28Icon('exit')}</button>
      </div>
    </header>
    <main class="dkd-v28-main">
      <section class="dkd-v28-hero">
        <div class="dkd-v28-hero-copy">
          <span class="dkd-v28-eyebrow"><i></i> CANLI KAPI OPERASYONU</span>
          <h1>Kurye geçişini<br><em>tek ekranda</em> yönetin</h1>
          <p>Bekleyen talebi kontrol edin, kuryenin gösterdiği 6 haneli kodu girin ve güvenli eşleştirmeyi tamamlayın.</p>
        </div>
        <div class="dkd-v28-radar" aria-hidden="true">
          <span class="ring ring-a"></span><span class="ring ring-b"></span><span class="ring ring-c"></span>
          <span class="sweep"></span><span class="core">${dkdV28Icon('shield')}</span>
        </div>
      </section>

      <section class="dkd-v28-stats" aria-label="Sistem durumu">
        <article><div class="icon cyan">${dkdV28Icon('courier')}</div><div><span>BEKLEYEN KURYE</span><strong id="dkd-v28-count">—</strong></div></article>
        <article><div class="icon green">${dkdV28Icon('shield')}</div><div><span>SİSTEM DURUMU</span><strong class="green-text">Aktif</strong></div></article>
        <article><div class="icon violet">${dkdV28Icon('sync')}</div><div><span>SON SENKRONİZASYON</span><strong id="dkd-v28-time">--:--</strong></div></article>
      </section>

      <section class="dkd-v28-queue">
        <div class="dkd-v28-section-head">
          <div><span>CANLI GEÇİŞ TALEPLERİ</span><h2>Kapıda Bekleyenler</h2></div>
          <div class="dkd-v28-live-pill"><i></i><b id="dkd-v28-pill">Kuyruk hazırlanıyor</b></div>
        </div>
        <div id="dkd-v28-cards" class="dkd-v28-cards" aria-live="polite"></div>
      </section>

      <section class="dkd-v28-safety">
        <div>${dkdV28Icon('shield')}</div>
        <p><strong>Güvenli eşleştirme</strong><span>Kodu yalnızca karşınızdaki kuryenin bilgilerini kontrol ettikten sonra girin. Her işlem güvenlik kayıtlarına işlenir.</span></p>
      </section>
    </main>`;
}

function dkdV28Mount() {
  if (dkdV28State.mounted) return;
  const dkdRoot = document.createElement('div');
  dkdRoot.id = DKD_V28_ROOT_ID;
  dkdRoot.innerHTML = dkdV28RootTemplate();
  document.body.appendChild(dkdRoot);
  document.body.classList.add('dkd-v28-simple-active');
  document.documentElement.dataset.dkdV28Simple = 'true';
  document.querySelector('#dkd-v28-modern')?.addEventListener('click', dkdV28GoModern);
  document.querySelector('#dkd-v28-exit')?.addEventListener('click', dkdV28Logout);
  dkdV28State.mounted = true;
  dkdV28Render();
  dkdV28ScheduleScan(40);
}

function dkdV28Logout() {
  const dkdClickables = [...document.querySelectorAll('button,a,[role="button"]')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V28_ROOT_ID}`));
  const dkdTarget = dkdClickables.find((dkdElement) => /cikis yap|cikis|logout/.test(
    dkdV28Normalize(dkdElement.textContent || dkdElement.getAttribute('aria-label'))
  ));
  if (dkdTarget) {
    dkdTarget.click();
    return;
  }
  dkdV28ClearRouteState();
  sessionStorage.removeItem(DKD_V28_THEME_KEY);
  sessionStorage.removeItem(DKD_V28_FORCE_KEY);
  location.replace('/DraBornGate/');
}

function dkdV28OpenNativeQueue() {
  const dkdNow = Date.now();
  if (dkdNow - dkdV28State.queueOpenAt < 1400) return;
  dkdV28State.queueOpenAt = dkdNow;
  dkdV28State.queueAttempts += 1;

  const dkdClickables = [...document.querySelectorAll('button,a,[role="button"]')]
    .filter((dkdElement) => !dkdElement.closest(`#${DKD_V28_ROOT_ID}`) && !dkdElement.closest(DKD_V28_LEGACY_SELECTOR));

  const dkdPriority = ['kurye kodu dogrula', 'kurye kuyrugu', 'gecis talepleri'];
  let dkdTarget = null;
  for (const dkdNeedle of dkdPriority) {
    dkdTarget = dkdClickables.find((dkdElement) => {
      const dkdText = dkdV28Normalize(dkdElement.textContent || dkdElement.getAttribute('aria-label'));
      return dkdText === dkdNeedle || dkdText.includes(dkdNeedle);
    });
    if (dkdTarget) break;
  }
  dkdTarget?.click();
}

function dkdV28IsNativeCodeInput(dkdInput) {
  if (!(dkdInput instanceof HTMLInputElement)) return false;
  if (dkdInput.closest(`#${DKD_V28_ROOT_ID}`) || dkdInput.closest(DKD_V28_LEGACY_SELECTOR)) return false;
  if (dkdInput.disabled || dkdInput.type === 'hidden') return false;
  const dkdType = String(dkdInput.type || 'text').toLowerCase();
  if (!['text', 'tel', 'number', 'password'].includes(dkdType)) return false;
  const dkdClue = dkdV28Normalize([
    dkdInput.placeholder,
    dkdInput.getAttribute('aria-label'),
    dkdInput.name,
    dkdInput.id,
    dkdInput.parentElement?.textContent?.slice(0, 260),
  ].join(' '));
  const dkdSixDigit = dkdInput.maxLength === 6 || dkdInput.getAttribute('maxlength') === '6';
  return dkdSixDigit || (dkdClue.includes('kod') && (dkdClue.includes('6 haneli') || dkdClue.includes('eslestirme')));
}

function dkdV28ButtonMatches(dkdButton) {
  const dkdText = dkdV28Normalize([
    dkdButton.textContent,
    dkdButton.value,
    dkdButton.getAttribute('aria-label'),
    dkdButton.getAttribute('title'),
  ].join(' '));
  return /kodu eslestir|eslestir|dogrula|onayla/.test(dkdText);
}

function dkdV28FindNativePair(dkdInput) {
  const dkdForm = dkdInput.closest('form,dialog,[role="dialog"]');
  if (dkdForm) {
    const dkdButton = [...dkdForm.querySelectorAll('button,[role="button"],input[type="submit"]')]
      .find((dkdCandidate) => !dkdCandidate.closest(`#${DKD_V28_ROOT_ID}`) && dkdV28ButtonMatches(dkdCandidate));
    if (dkdButton) return { button: dkdButton, container: dkdForm };
  }

  let dkdNode = dkdInput.parentElement;
  let dkdBest = null;
  for (let dkdDepth = 0; dkdNode && dkdDepth < 9; dkdDepth += 1, dkdNode = dkdNode.parentElement) {
    if (dkdNode.matches(DKD_V28_LEGACY_SELECTOR) || dkdNode.closest(`#${DKD_V28_ROOT_ID}`)) break;
    const dkdButtons = [...dkdNode.querySelectorAll('button,[role="button"],input[type="submit"]')]
      .filter((dkdCandidate) => !dkdCandidate.closest(`#${DKD_V28_ROOT_ID}`) && dkdV28ButtonMatches(dkdCandidate));
    if (!dkdButtons.length) continue;
    const dkdTextLength = String(dkdNode.innerText || dkdNode.textContent || '').trim().length;
    const dkdInputCount = dkdNode.querySelectorAll('input').length;
    const dkdButtonCount = dkdNode.querySelectorAll('button,[role="button"]').length;
    const dkdScore = dkdTextLength + (dkdInputCount * 90) + (dkdButtonCount * 55);
    if (!dkdBest || dkdScore < dkdBest.score) {
      dkdBest = { button: dkdButtons[0], container: dkdNode, score: dkdScore };
    }
    if (dkdTextLength <= 700 && dkdInputCount <= 4 && dkdButtonCount <= 6) break;
  }
  return dkdBest ? { button: dkdBest.button, container: dkdBest.container } : null;
}

function dkdV28StructuredValue(dkdContainer, dkdLabels) {
  const dkdElements = [...dkdContainer.querySelectorAll('div,p,span,li,dt,dd,strong,b,label')];
  for (const dkdElement of dkdElements) {
    const dkdText = String(dkdElement.textContent || '').replace(/\s+/g, ' ').trim();
    const dkdNormalized = dkdV28Normalize(dkdText);
    for (const dkdLabel of dkdLabels) {
      const dkdNormalizedLabel = dkdV28Normalize(dkdLabel);
      if (!dkdNormalized.startsWith(`${dkdNormalizedLabel} `) && dkdNormalized !== dkdNormalizedLabel) continue;
      const dkdValue = dkdText.replace(new RegExp(`^${dkdLabel}\\s*[:\\-]?\\s*`, 'i'), '').trim();
      if (dkdValue && dkdValue.length <= 64 && dkdValue !== dkdText) return dkdValue;
      const dkdSibling = dkdElement.nextElementSibling?.textContent?.replace(/\s+/g, ' ').trim();
      if (dkdSibling && dkdSibling.length <= 64) return dkdSibling;
    }
  }
  return '';
}

function dkdV28ExtractDetails(dkdContainer) {
  const dkdText = String(dkdContainer?.innerText || dkdContainer?.textContent || '');
  const dkdName = dkdV28StructuredValue(dkdContainer, ['Kurye', 'Ad Soyad', 'Adı Soyadı', 'Sürücü']);
  const dkdCompany = dkdV28StructuredValue(dkdContainer, ['Firma', 'Platform', 'Kargo']);
  const dkdDestination = dkdV28StructuredValue(dkdContainer, ['Hedef', 'Blok', 'Daire', 'Teslimat Noktası']);
  const dkdPlate = dkdText.toUpperCase().match(/\b\d{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?\d{2,4}\b/)?.[0] || '';
  return {
    title: dkdName || 'Kurye Geçiş Talebi',
    subtitle: dkdCompany || 'Kapıda eşleştirme bekleniyor',
    courier: dkdName || 'Bilgiler doğrulanıyor',
    destination: dkdDestination || 'Güvenlik kapısı',
    plate: dkdPlate || 'Kayıt bekleniyor',
  };
}

function dkdV28Identity(dkdInput, dkdButton, dkdContainer, dkdDetails) {
  const dkdAttributeParts = [];
  for (const dkdElement of [dkdInput, dkdButton, dkdContainer]) {
    if (!dkdElement) continue;
    for (const dkdAttribute of [...dkdElement.attributes]) {
      const dkdName = dkdV28Normalize(dkdAttribute.name);
      if (!/request|talep|courier|kurye|pass|gecis|record|kayit|order|siparis|id/.test(dkdName)) continue;
      const dkdValue = String(dkdAttribute.value || '').trim();
      if (dkdValue && dkdValue.length <= 100) dkdAttributeParts.push(`${dkdName}:${dkdValue}`);
    }
  }
  if (dkdAttributeParts.length) return dkdAttributeParts.join('|');

  const dkdStrongDetails = [
    dkdDetails.title !== 'Kurye Geçiş Talebi' ? dkdDetails.title : '',
    dkdDetails.plate !== 'Kayıt bekleniyor' ? dkdDetails.plate : '',
    dkdDetails.destination !== 'Güvenlik kapısı' ? dkdDetails.destination : '',
  ].filter(Boolean);
  if (dkdStrongDetails.length) return dkdStrongDetails.join('|');

  const dkdCompactText = dkdV28Normalize(String(dkdContainer?.innerText || dkdContainer?.textContent || ''))
    .replace(/draborngate|premium menu|guvenlik merkezi|kurye kuyrugu|6 haneli eslestirme kodu|kodu eslestir|bekliyor/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280);
  return dkdCompactText || 'generic-live-request';
}

function dkdV28ScanCandidates() {
  const dkdCandidates = [];
  const dkdFingerprints = new Set();
  const dkdInputs = [...document.querySelectorAll('input')].filter(dkdV28IsNativeCodeInput);

  for (const dkdInput of dkdInputs) {
    const dkdPair = dkdV28FindNativePair(dkdInput);
    if (!dkdPair) continue;
    const dkdDetails = dkdV28ExtractDetails(dkdPair.container);
    const dkdFingerprint = dkdV28Identity(dkdInput, dkdPair.button, dkdPair.container, dkdDetails);
    if (dkdFingerprints.has(dkdFingerprint)) continue;
    dkdFingerprints.add(dkdFingerprint);
    dkdCandidates.push({
      id: dkdV28Hash(dkdFingerprint),
      fingerprint: dkdFingerprint,
      input: dkdInput,
      button: dkdPair.button,
      container: dkdPair.container,
      details: dkdDetails,
    });
  }

  if (dkdCandidates.length > 1) {
    const dkdGeneric = dkdCandidates.filter((dkdSource) => dkdSource.fingerprint === 'generic-live-request');
    if (dkdGeneric.length > 1) return [dkdGeneric[0], ...dkdCandidates.filter((dkdSource) => dkdSource.fingerprint !== 'generic-live-request')];
  }
  return dkdCandidates;
}

function dkdV28CandidateSignature(dkdSources) {
  return JSON.stringify(dkdSources.map((dkdSource) => ({
    fingerprint: dkdSource.fingerprint,
    details: dkdSource.details,
  })));
}

function dkdV28CommitStableSources(dkdSources, dkdSignature) {
  dkdV28State.stableSources = dkdSources;
  dkdV28State.lastStableSignature = dkdSignature;
  dkdV28State.initialized = true;
  dkdV28State.lastSync = new Date();
  dkdV28Render();
}

function dkdV28ScanSources() {
  if (!dkdV28State.mounted) return;
  const dkdCandidates = dkdV28ScanCandidates();
  const dkdSignature = dkdV28CandidateSignature(dkdCandidates);

  if (dkdSignature === dkdV28State.candidateSignature) {
    dkdV28State.candidateHits += 1;
  } else {
    dkdV28State.candidateSignature = dkdSignature;
    dkdV28State.candidateHits = 1;
  }

  const dkdRequiredHits = dkdCandidates.length > 0 ? 2 : 5;
  if (dkdV28State.candidateHits >= dkdRequiredHits && dkdSignature !== dkdV28State.lastStableSignature) {
    dkdV28CommitStableSources(dkdCandidates, dkdSignature);
  } else {
    dkdV28State.lastSync = new Date();
    dkdV28RenderClock();
  }

  if (!dkdCandidates.length) dkdV28OpenNativeQueue();
}

function dkdV28ScheduleScan(dkdDelay = 120) {
  clearTimeout(dkdV28State.mutationTimer);
  dkdV28State.mutationTimer = setTimeout(dkdV28ScanSources, dkdDelay);
}

function dkdV28SetNativeValue(dkdInput, dkdValue) {
  const dkdDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  dkdDescriptor?.set?.call(dkdInput, dkdValue);
  dkdInput.dispatchEvent(new Event('input', { bubbles: true }));
  dkdInput.dispatchEvent(new Event('change', { bubbles: true }));
}

async function dkdV28Submit(dkdSourceId, dkdValue) {
  const dkdSource = dkdV28State.stableSources.find((dkdItem) => dkdItem.id === dkdSourceId);
  const dkdClean = String(dkdValue || '').replace(/\D/g, '').slice(0, 6);
  if (!dkdSource) {
    dkdV28State.feedbackBySource.set(dkdSourceId, { type: 'error', text: 'Talep yenilendi. Lütfen birkaç saniye sonra tekrar deneyin.' });
    dkdV28Render();
    return;
  }
  if (dkdClean.length !== 6) {
    dkdV28State.feedbackBySource.set(dkdSourceId, { type: 'error', text: 'Lütfen 6 haneli eşleştirme kodunu eksiksiz girin.' });
    dkdV28Render();
    return;
  }

  dkdV28State.busySourceId = dkdSourceId;
  dkdV28State.feedbackBySource.set(dkdSourceId, { type: 'loading', text: 'Kod güvenli sistemde doğrulanıyor…' });
  dkdV28Render();

  dkdV28SetNativeValue(dkdSource.input, dkdClean);
  await new Promise((dkdResolve) => setTimeout(dkdResolve, 140));
  dkdSource.button.click();

  setTimeout(() => {
    dkdV28State.busySourceId = '';
    dkdV28State.feedbackBySource.set(dkdSourceId, { type: 'success', text: 'Eşleştirme işlemi gönderildi. Kayıt sonucu kontrol ediliyor.' });
    dkdV28Render();
    dkdV28ScheduleScan(500);
  }, 700);
}

function dkdV28CardTemplate(dkdSource, dkdIndex) {
  const dkdStatus = dkdV28State.feedbackBySource.get(dkdSource.id);
  const dkdBusy = dkdV28State.busySourceId === dkdSource.id;
  const dkdDetails = dkdSource.details;
  return `
    <article class="dkd-v28-request-card" data-source-id="${dkdV28Escape(dkdSource.id)}">
      <div class="dkd-v28-card-glow" aria-hidden="true"></div>
      <div class="dkd-v28-request-head">
        <div class="dkd-v28-request-icon">${dkdV28Icon('courier')}</div>
        <div class="dkd-v28-request-title">
          <span>CANLI GEÇİŞ TALEBİ</span>
          <h3>${dkdV28Escape(dkdDetails.title)}</h3>
          <p>${dkdV28Escape(dkdDetails.subtitle)}</p>
        </div>
        <div class="dkd-v28-waiting"><i></i>BEKLİYOR</div>
      </div>
      <div class="dkd-v28-info-grid">
        <div><span>KURYE</span><strong>${dkdV28Escape(dkdDetails.courier)}</strong></div>
        <div><span>PLAKA / KAYIT</span><strong>${dkdV28Escape(dkdDetails.plate)}</strong></div>
        <div><span>HEDEF NOKTA</span><strong>${dkdV28Escape(dkdDetails.destination)}</strong></div>
        <div><span>TALEP SIRASI</span><strong>#${String(dkdIndex + 1).padStart(2, '0')}</strong></div>
      </div>
      <div class="dkd-v28-code-panel">
        <div class="dkd-v28-code-copy">${dkdV28Icon('key')}<div><strong>6 Haneli Eşleştirme Kodu</strong><span>Kuryenin ekranındaki kodu girin</span></div></div>
        <div class="dkd-v28-code-row">
          <input inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="6 haneli eşleştirme kodu" placeholder="• • • • • •" ${dkdBusy ? 'disabled' : ''}>
          <button type="button" ${dkdBusy ? 'disabled' : ''}>${dkdBusy ? dkdV28Icon('sync') : dkdV28Icon('check')}<span>${dkdBusy ? 'Doğrulanıyor' : 'Kodu Eşleştir'}</span></button>
        </div>
        ${dkdStatus ? `<div class="dkd-v28-feedback ${dkdStatus.type}">${dkdStatus.type === 'success' ? dkdV28Icon('check') : dkdStatus.type === 'error' ? dkdV28Icon('alert') : dkdV28Icon('sync')}<span>${dkdV28Escape(dkdStatus.text)}</span></div>` : ''}
      </div>
    </article>`;
}

function dkdV28EmptyTemplate() {
  if (!dkdV28State.initialized) {
    return `<div class="dkd-v28-empty loading"><div class="dkd-v28-loader"><i></i><i></i><i></i></div><h3>Geçiş talepleri hazırlanıyor</h3><p>Canlı kuyruk açılıyor ve güvenli eşleştirme alanları kontrol ediliyor.</p></div>`;
  }
  return `<div class="dkd-v28-empty"><div class="dkd-v28-empty-icon">${dkdV28Icon('check')}</div><h3>Bekleyen kurye bulunmuyor</h3><p>Yeni bir geçiş talebi oluştuğunda doğrulama kartı otomatik olarak burada görünecek.</p><span><i></i> Canlı kuyruk izleniyor</span></div>`;
}

function dkdV28BindCards() {
  const dkdRoot = document.querySelector(`#${DKD_V28_ROOT_ID}`);
  if (!dkdRoot) return;
  for (const dkdCard of dkdRoot.querySelectorAll('.dkd-v28-request-card')) {
    const dkdSourceId = dkdCard.dataset.sourceId || '';
    const dkdInput = dkdCard.querySelector('input');
    const dkdButton = dkdCard.querySelector('button');
    dkdInput?.addEventListener('input', () => {
      dkdInput.value = dkdInput.value.replace(/\D/g, '').slice(0, 6);
      dkdCard.classList.toggle('code-ready', dkdInput.value.length === 6);
    });
    dkdInput?.addEventListener('keydown', (dkdEvent) => {
      if (dkdEvent.key === 'Enter') dkdV28Submit(dkdSourceId, dkdInput.value);
    });
    dkdButton?.addEventListener('click', () => dkdV28Submit(dkdSourceId, dkdInput?.value));
  }
}

function dkdV28RenderClock() {
  const dkdTimeElement = document.querySelector('#dkd-v28-time');
  if (dkdTimeElement) {
    dkdTimeElement.textContent = dkdV28State.lastSync.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }
}

function dkdV28Render() {
  if (!dkdV28State.mounted) return;
  const dkdCount = dkdV28State.stableSources.length;
  const dkdCountElement = document.querySelector('#dkd-v28-count');
  const dkdPillElement = document.querySelector('#dkd-v28-pill');
  if (dkdCountElement) dkdCountElement.textContent = dkdV28State.initialized ? String(dkdCount) : '—';
  if (dkdPillElement) dkdPillElement.textContent = dkdV28State.initialized ? `${dkdCount} bekleyen` : 'Kuyruk hazırlanıyor';
  dkdV28RenderClock();

  const dkdSignature = JSON.stringify({
    initialized: dkdV28State.initialized,
    sources: dkdV28State.stableSources.map((dkdSource) => [dkdSource.id, dkdSource.details]),
    busy: dkdV28State.busySourceId,
    feedback: [...dkdV28State.feedbackBySource.entries()],
  });
  if (dkdSignature === dkdV28State.lastRenderSignature) return;
  dkdV28State.lastRenderSignature = dkdSignature;

  const dkdCards = document.querySelector('#dkd-v28-cards');
  if (!dkdCards) return;
  dkdCards.innerHTML = dkdCount > 0
    ? dkdV28State.stableSources.map(dkdV28CardTemplate).join('')
    : dkdV28EmptyTemplate();
  dkdV28BindCards();
}

function dkdV28BootSimple() {
  if (!dkdV28IsSimpleRequested()) return false;
  if (!dkdV28HasSecuritySession()) return true;
  dkdV28Mount();
  dkdV28OpenNativeQueue();
  dkdV28ScheduleScan(220);
  if (!dkdV28State.scanTimer) dkdV28State.scanTimer = setInterval(dkdV28ScanSources, 750);
  return true;
}

function dkdV28Maintenance() {
  dkdV28ReplaceVersions();
  dkdV28HideLegacySwitches();
  if (dkdV28IsSimpleRequested()) {
    if (!dkdV28State.mounted) dkdV28BootSimple();
    if (dkdV28State.mounted) dkdV28ScheduleScan(80);
  } else {
    dkdV28EnsureModernSwitchIcon();
  }
}

dkdV28ReplaceVersions();
dkdV28HideLegacySwitches();
dkdV28BootSimple();
dkdV28EnsureModernSwitchIcon();
setInterval(dkdV28Maintenance, 1200);

new MutationObserver((dkdMutations) => {
  let dkdHasElementChange = false;
  for (const dkdMutation of dkdMutations) {
    if ([...dkdMutation.addedNodes].some((dkdNode) => dkdNode instanceof Element)) {
      dkdHasElementChange = true;
      break;
    }
  }
  if (!dkdHasElementChange) return;
  dkdV28HideLegacySwitches();
  if (dkdV28IsSimpleRequested()) {
    if (!dkdV28State.mounted) dkdV28BootSimple();
    if (dkdV28State.mounted) dkdV28ScheduleScan(100);
  } else {
    dkdV28EnsureModernSwitchIcon();
  }
}).observe(document.body, { childList: true, subtree: true });
