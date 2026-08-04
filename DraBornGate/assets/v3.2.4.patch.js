const DKD_V324_PATCH_VERSION = '3.2.4';
const dkdV324State = {
  timer: 0,
  categoryOpen: { arrived: false, approaching: false, other: false },
  selectedSiteValue: '',
  selectedSiteLabel: '',
  newPassVisible: false,
  adminRequested: false,
};

function dkdV324Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV324DecodeJwtPayload(dkdToken) {
  try {
    const dkdPart = String(dkdToken || '').split('.')[1];
    if (!dkdPart) return null;
    const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
    const dkdJson = decodeURIComponent(Array.from(atob(dkdBase64), (dkdChar) =>
      `%${dkdChar.charCodeAt(0).toString(16).padStart(2, '0')}`
    ).join(''));
    return JSON.parse(dkdJson);
  } catch {
    return null;
  }
}

function dkdV324FindAccessToken(dkdValue, dkdDepth = 0) {
  if (dkdDepth > 7 || dkdValue == null) return '';
  if (typeof dkdValue === 'string') {
    if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(dkdValue)) return dkdValue;
    try {
      return dkdV324FindAccessToken(JSON.parse(dkdValue), dkdDepth + 1);
    } catch {
      return '';
    }
  }
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) {
      const dkdToken = dkdV324FindAccessToken(dkdItem, dkdDepth + 1);
      if (dkdToken) return dkdToken;
    }
    return '';
  }
  if (typeof dkdValue === 'object') {
    if (typeof dkdValue.access_token === 'string') return dkdValue.access_token;
    for (const dkdKey of ['currentSession', 'session', 'data', 'value']) {
      const dkdToken = dkdV324FindAccessToken(dkdValue[dkdKey], dkdDepth + 1);
      if (dkdToken) return dkdToken;
    }
  }
  return '';
}

function dkdV324CurrentPayload() {
  for (const dkdStore of [localStorage, sessionStorage]) {
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = String(dkdStore.key(dkdIndex) || '');
      if (!/auth-token|session|guuwomvszlwhkmstewfl/i.test(dkdKey)) continue;
      const dkdToken = dkdV324FindAccessToken(dkdStore.getItem(dkdKey));
      if (dkdToken) return dkdV324DecodeJwtPayload(dkdToken);
    }
  }
  return null;
}

function dkdV324IsCourier() {
  const dkdPayload = dkdV324CurrentPayload();
  const dkdRoles = [
    dkdPayload?.user_metadata?.preferred_role,
    dkdPayload?.user_metadata?.role,
    dkdPayload?.app_metadata?.preferred_role,
    dkdPayload?.app_metadata?.role,
  ].map(dkdV324Normalize).filter(Boolean);
  if (dkdRoles.some((dkdRole) => dkdRole.includes('courier') || dkdRole.includes('kurye'))) return true;

  return [...document.querySelectorAll('span,strong,b,small')].some((dkdElement) => {
    if (dkdElement.closest('#dkd-v31-root,#dkd-v31-global-modal')) return false;
    return dkdV324Normalize(dkdElement.textContent) === 'kurye' && String(dkdElement.textContent || '').trim().length <= 8;
  });
}

function dkdV324FindExactText(dkdText, dkdRoot = document) {
  const dkdWanted = dkdV324Normalize(dkdText);
  return [...dkdRoot.querySelectorAll('h1,h2,h3,h4,strong,b,span,p,label,button,a,[role="button"]')]
    .find((dkdElement) => dkdV324Normalize(dkdElement.textContent) === dkdWanted);
}

function dkdV324ClosestCard(dkdElement, dkdMaxText = 620) {
  let dkdNode = dkdElement;
  for (let dkdDepth = 0; dkdNode && dkdDepth < 8; dkdDepth += 1, dkdNode = dkdNode.parentElement) {
    const dkdLength = String(dkdNode.textContent || '').trim().length;
    if (dkdLength > 8 && dkdLength <= dkdMaxText && /article|section|li|div/i.test(dkdNode.tagName)) {
      const dkdParentLength = String(dkdNode.parentElement?.textContent || '').trim().length;
      if (!dkdNode.parentElement || dkdParentLength > dkdLength * 1.35) return dkdNode;
    }
  }
  return dkdElement?.closest('article,section,li,div') || null;
}

function dkdV324PatchSimpleFinder() {
  const dkdFinder = document.querySelector('.dkd-v31-finder');
  if (!dkdFinder) return;
  dkdFinder.classList.add('dkd-v324-premium-finder');
  const dkdCopy = dkdFinder.querySelector('.dkd-v31-finder-copy');
  dkdCopy?.querySelector('p')?.remove();
  const dkdEyebrow = dkdCopy?.querySelector(':scope > span');
  if (dkdEyebrow) dkdEyebrow.textContent = 'HIZLI EŞLEŞTİRME · CANLI DOĞRULAMA';
  const dkdButton = dkdFinder.querySelector('.dkd-v31-search-form button[type="submit"]');
  dkdButton?.classList.add('dkd-v324-premium-action');
}

function dkdV324PatchQueueCategories() {
  for (const dkdDetails of document.querySelectorAll('.dkd-v31-queue-category[data-dkd-v31-category]')) {
    const dkdKey = dkdDetails.dataset.dkdV31Category;
    if (!(dkdKey in dkdV324State.categoryOpen)) continue;
    if (dkdDetails.dataset.dkdV324Bound !== 'true') {
      dkdDetails.open = Boolean(dkdV324State.categoryOpen[dkdKey]);
      dkdDetails.dataset.dkdV324Bound = 'true';
      dkdDetails.addEventListener('toggle', () => {
        dkdV324State.categoryOpen[dkdKey] = dkdDetails.open;
      });
    }
  }
}

function dkdV324PatchPassModal() {
  const dkdModal = document.querySelector('#dkd-v31-global-modal:not([hidden])');
  const dkdPanel = dkdModal?.querySelector('.dkd-v31-pass-modal');
  if (!dkdPanel) return;
  dkdModal.classList.add('dkd-v324-detail-popup');
  dkdPanel.classList.add('dkd-v324-detail-panel');
}

function dkdV324PatchMinimalStats() {
  for (const dkdLabel of ['Tamamlanan', 'Aktif Geçiş', 'Aktif Site']) {
    const dkdElement = dkdV324FindExactText(dkdLabel);
    const dkdCard = dkdElement && dkdV324ClosestCard(dkdElement, 520);
    if (dkdCard) dkdCard.classList.add('dkd-v31-minimal-stat', 'dkd-v324-minimal-stat');
  }
}

function dkdV324PatchCourierHeader() {
  if (!dkdV324IsCourier() || document.body.classList.contains('dkd-v31-simple-active')) return;
  const dkdCandidates = [...document.querySelectorAll('header,[class*="topbar"],[class*="top-bar"],[class*="app-header"],[class*="page-header"]')]
    .filter((dkdHeader) => {
      const dkdRect = dkdHeader.getBoundingClientRect();
      return dkdRect.width > 280 && dkdRect.top < 210 && dkdHeader.querySelectorAll('button,a,[role="button"]').length >= 2;
    });

  for (const dkdHeader of dkdCandidates) {
    const dkdTexts = [...dkdHeader.querySelectorAll('h1,h2,h3,strong,b,span,p')]
      .filter((dkdElement) => {
        const dkdText = String(dkdElement.textContent || '').trim();
        const dkdNormalized = dkdV324Normalize(dkdText);
        if (!dkdText || dkdText.length > 60 || dkdNormalized.includes('draborngate') || dkdNormalized === 'kurye') return false;
        const dkdRect = dkdElement.getBoundingClientRect();
        const dkdFontSize = Number.parseFloat(getComputedStyle(dkdElement).fontSize || '0');
        return dkdRect.width > 70 && dkdRect.left > 65 && dkdFontSize >= 18;
      });
    const dkdTitle = dkdTexts.sort((dkdA, dkdB) =>
      Number.parseFloat(getComputedStyle(dkdB).fontSize || '0') - Number.parseFloat(getComputedStyle(dkdA).fontSize || '0')
    )[0];
    if (!dkdTitle) continue;
    if (!dkdTitle.dataset.dkdV324OriginalTitle) dkdTitle.dataset.dkdV324OriginalTitle = String(dkdTitle.textContent || '').trim();
    dkdTitle.textContent = 'Kurye Merkezi';
    dkdTitle.classList.add('dkd-v324-courier-header-title');
    dkdHeader.classList.add('dkd-v324-courier-header');
    break;
  }
}

function dkdV324IsNewPassPage() {
  const dkdHeadings = [...document.querySelectorAll('h1,h2,h3')].map((dkdElement) => dkdV324Normalize(dkdElement.textContent));
  return dkdHeadings.some((dkdText) => dkdText.includes('yeni kurye gecisi') || dkdText.includes('yeni gecis talebi'));
}

function dkdV324FindSiteSelect() {
  for (const dkdLabel of document.querySelectorAll('label')) {
    const dkdFirstText = [...dkdLabel.childNodes]
      .filter((dkdNode) => dkdNode.nodeType === Node.TEXT_NODE)
      .map((dkdNode) => String(dkdNode.nodeValue || '').trim())
      .filter(Boolean)
      .join(' ');
    const dkdLabelText = dkdV324Normalize(dkdFirstText || dkdLabel.querySelector(':scope > span,:scope > strong')?.textContent);
    if (dkdLabelText !== 'site') continue;
    const dkdSelect = dkdLabel.querySelector('select') || dkdLabel.parentElement?.querySelector('select');
    if (dkdSelect) return dkdSelect;
  }
  return null;
}

function dkdV324BuildSiteResults(dkdInput, dkdResults, dkdSelect) {
  const dkdQuery = dkdV324Normalize(dkdInput.value);
  const dkdOptions = [...dkdSelect.options]
    .filter((dkdOption) => dkdOption.value && (!dkdQuery || dkdV324Normalize(dkdOption.textContent).includes(dkdQuery)))
    .slice(0, 12);

  dkdResults.innerHTML = dkdOptions.length
    ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v324-site-value="${String(dkdOption.value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"><strong>${String(dkdOption.textContent || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</strong><small>Bu siteyi seç</small></button>`).join('')
    : '<div class="dkd-v324-site-empty">Aramanızla eşleşen aktif site bulunamadı.</div>';
  dkdResults.hidden = false;

  for (const dkdButton of dkdResults.querySelectorAll('[data-dkd-v324-site-value]')) {
    dkdButton.addEventListener('click', () => {
      const dkdValue = dkdButton.dataset.dkdV324SiteValue || '';
      const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdValue);
      if (!dkdOption) return;
      dkdV324State.selectedSiteValue = dkdValue;
      dkdV324State.selectedSiteLabel = String(dkdOption.textContent || '').trim();
      dkdSelect.value = dkdValue;
      dkdInput.value = dkdV324State.selectedSiteLabel;
      dkdResults.hidden = true;
      dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
      dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

function dkdV324PatchSitePicker() {
  const dkdVisible = dkdV324IsNewPassPage();
  if (!dkdVisible) {
    if (dkdV324State.newPassVisible) {
      dkdV324State.selectedSiteValue = '';
      dkdV324State.selectedSiteLabel = '';
    }
    dkdV324State.newPassVisible = false;
    return;
  }
  dkdV324State.newPassVisible = true;

  const dkdSelect = dkdV324FindSiteSelect();
  if (!dkdSelect || dkdSelect.dataset.dkdV324Picker === 'true') return;
  dkdSelect.dataset.dkdV324Picker = 'true';

  let dkdBlank = [...dkdSelect.options].find((dkdOption) => !dkdOption.value);
  if (!dkdBlank) {
    dkdBlank = new Option('Site seçilmedi', '', true, true);
    dkdSelect.add(dkdBlank, 0);
  }

  const dkdWrapper = document.createElement('div');
  dkdWrapper.className = 'dkd-v324-site-picker';
  dkdWrapper.innerHTML = `<div class="dkd-v324-site-search"><span aria-hidden="true">⌕</span><input type="search" autocomplete="off" placeholder="Site adıyla ara ve seç" aria-label="Site ara"><button type="button" aria-label="Site seçimini temizle">×</button></div><div class="dkd-v324-site-results" hidden></div>`;
  dkdSelect.before(dkdWrapper);
  dkdSelect.classList.add('dkd-v324-native-site-select');

  const dkdInput = dkdWrapper.querySelector('input');
  const dkdClear = dkdWrapper.querySelector('button');
  const dkdResults = dkdWrapper.querySelector('.dkd-v324-site-results');

  if (dkdV324State.selectedSiteValue && [...dkdSelect.options].some((dkdOption) => dkdOption.value === dkdV324State.selectedSiteValue)) {
    dkdSelect.value = dkdV324State.selectedSiteValue;
    dkdInput.value = dkdV324State.selectedSiteLabel;
  } else {
    dkdV324State.selectedSiteValue = '';
    dkdV324State.selectedSiteLabel = '';
    dkdSelect.value = '';
    dkdSelect.selectedIndex = 0;
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }

  const dkdOpenResults = () => dkdV324BuildSiteResults(dkdInput, dkdResults, dkdSelect);
  dkdInput.addEventListener('focus', dkdOpenResults);
  dkdInput.addEventListener('input', () => {
    if (dkdInput.value !== dkdV324State.selectedSiteLabel) {
      dkdV324State.selectedSiteValue = '';
      dkdV324State.selectedSiteLabel = '';
      dkdSelect.value = '';
    }
    dkdOpenResults();
  });
  dkdClear.addEventListener('click', () => {
    dkdV324State.selectedSiteValue = '';
    dkdV324State.selectedSiteLabel = '';
    dkdInput.value = '';
    dkdSelect.value = '';
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
    dkdInput.focus();
    dkdOpenResults();
  });
  document.addEventListener('pointerdown', (dkdEvent) => {
    if (!dkdWrapper.contains(dkdEvent.target)) dkdResults.hidden = true;
  }, { once: true, capture: true });
}

async function dkdV324EnsureAdminMenu() {
  if (!window.dkdV324IsAdminEmail?.() || dkdV324State.adminRequested) return;
  const dkdProfileText = dkdV324FindExactText('Profil ve Bağlantı');
  if (!dkdProfileText) return;
  dkdV324State.adminRequested = true;
  try {
    await window.dkdV31Data?.loadAdminCatalog?.();
  } finally {
    const dkdProfileItem = dkdProfileText.closest('button,a,[role="button"]') || dkdV324ClosestCard(dkdProfileText, 260);
    if (dkdProfileItem) {
      dkdProfileItem.dataset.dkdV324AdminReady = String(Date.now());
      const dkdPulse = document.createElement('i');
      dkdPulse.hidden = true;
      dkdProfileItem.after(dkdPulse);
      queueMicrotask(() => dkdPulse.remove());
    }
    setTimeout(() => {
      dkdV324State.adminRequested = false;
    }, 1200);
  }
}

function dkdV324PatchAll() {
  document.documentElement.dataset.dkdGateVersion = DKD_V324_PATCH_VERSION;
  dkdV324PatchSimpleFinder();
  dkdV324PatchQueueCategories();
  dkdV324PatchPassModal();
  dkdV324PatchMinimalStats();
  dkdV324PatchCourierHeader();
  dkdV324PatchSitePicker();
  dkdV324EnsureAdminMenu().catch(() => undefined);
}

function dkdV324SchedulePatch() {
  clearTimeout(dkdV324State.timer);
  dkdV324State.timer = setTimeout(dkdV324PatchAll, 70);
}

new MutationObserver(dkdV324SchedulePatch).observe(document.body, { childList: true, subtree: true });
window.addEventListener('popstate', dkdV324SchedulePatch);
window.addEventListener('hashchange', dkdV324SchedulePatch);
dkdV324PatchAll();
