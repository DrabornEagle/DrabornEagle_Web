const DKD_V22 = {
  registrationActive: false,
  roleAttempts: 0,
  roleDeadline: 0,
  platformDeadline: 0,
  patchQueued: false,
};

function dkdV22Text(dkdElement) {
  return String(dkdElement?.textContent || '').replace(/\s+/g, ' ').trim();
}

function dkdV22Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV22IsRegistrationPage() {
  const dkdPageText = dkdV22Normalize(document.body.innerText);
  const dkdRoleCount = ['kurye', 'guvenlik', 'site yonetimi', 'site sakini']
    .filter((dkdRole) => dkdPageText.includes(dkdRole)).length;
  return dkdPageText.includes('premium hesabi olustur')
    && dkdPageText.includes('ad soyad')
    && dkdRoleCount >= 3;
}

function dkdV22ExactNodes(dkdTextValue) {
  const dkdTarget = dkdV22Normalize(dkdTextValue);
  return Array.from(document.querySelectorAll('button,[role="button"],label,div,span,strong,h1,h2,h3,p'))
    .filter((dkdNode) => dkdV22Normalize(dkdV22Text(dkdNode)) === dkdTarget);
}

function dkdV22RoleCard(dkdRoleName) {
  const dkdNodes = dkdV22ExactNodes(dkdRoleName);
  for (const dkdNode of dkdNodes) {
    let dkdCurrent = dkdNode;
    for (let dkdDepth = 0; dkdDepth < 7 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
      const dkdRect = dkdCurrent.getBoundingClientRect();
      const dkdParentText = dkdV22Normalize(dkdCurrent.parentElement?.innerText);
      const dkdSiblingRoleCount = ['kurye', 'guvenlik', 'site yonetimi', 'site sakini']
        .filter((dkdRole) => dkdParentText.includes(dkdRole)).length;
      const dkdInteractive = dkdCurrent.matches?.('button,[role="button"],label')
        || dkdCurrent.querySelector?.('input[type="radio"]')
        || dkdCurrent.tabIndex >= 0
        || /(role|choice|option|select|card|tile)/i.test(String(dkdCurrent.className || ''));
      if (dkdInteractive && dkdRect.width > 140 && dkdRect.height >= 50 && dkdRect.height < 260 && dkdSiblingRoleCount >= 2) {
        return dkdCurrent;
      }
      dkdCurrent = dkdCurrent.parentElement;
    }
  }
  return null;
}

function dkdV22IsSelected(dkdCard) {
  if (!dkdCard) return false;
  const dkdRadio = dkdCard.querySelector?.('input[type="radio"]');
  if (dkdRadio?.checked) return true;
  if (['true', 'selected', 'checked', 'active'].includes(String(dkdCard.getAttribute?.('aria-checked')).toLowerCase())) return true;
  if (['true', 'selected', 'checked', 'active'].includes(String(dkdCard.getAttribute?.('aria-selected')).toLowerCase())) return true;
  if (String(dkdCard.getAttribute?.('aria-pressed')).toLowerCase() === 'true') return true;
  const dkdState = [
    dkdCard.className,
    dkdCard.getAttribute?.('data-state'),
    dkdCard.getAttribute?.('data-selected'),
    dkdCard.getAttribute?.('data-active'),
  ].join(' ').toLowerCase();
  return /\b(active|selected|checked|current|is-active|is-selected)\b/.test(dkdState);
}

function dkdV22ActivateCard(dkdCard) {
  if (!dkdCard) return;
  const dkdRadio = dkdCard.querySelector?.('input[type="radio"]');
  if (dkdRadio && !dkdRadio.checked) {
    dkdRadio.click();
    return;
  }
  dkdCard.click();
}

function dkdV22EnsureCourierRole() {
  const dkdRegistration = dkdV22IsRegistrationPage();
  if (!dkdRegistration) {
    DKD_V22.registrationActive = false;
    DKD_V22.roleAttempts = 0;
    DKD_V22.roleDeadline = 0;
    DKD_V22.platformDeadline = 0;
    return false;
  }

  if (!DKD_V22.registrationActive) {
    DKD_V22.registrationActive = true;
    DKD_V22.roleAttempts = 0;
    DKD_V22.roleDeadline = Date.now() + 4500;
    DKD_V22.platformDeadline = Date.now() + 5500;
  }

  const dkdCourierCard = dkdV22RoleCard('Kurye');
  if (!dkdCourierCard) return false;
  if (dkdV22IsSelected(dkdCourierCard)) return false;

  const dkdOtherSelected = ['Güvenlik', 'Site Yönetimi', 'Site Sakini']
    .map(dkdV22RoleCard)
    .some(dkdV22IsSelected);

  if ((dkdOtherSelected || DKD_V22.roleAttempts === 0) && Date.now() < DKD_V22.roleDeadline && DKD_V22.roleAttempts < 4) {
    DKD_V22.roleAttempts += 1;
    dkdV22ActivateCard(dkdCourierCard);
    setTimeout(dkdV22QueuePatch, 120);
    setTimeout(dkdV22QueuePatch, 360);
    return true;
  }
  return false;
}

function dkdV22FindPlatformSelect() {
  const dkdLabels = Array.from(document.querySelectorAll('label,div,span,p,strong'))
    .filter((dkdItem) => dkdV22Normalize(dkdV22Text(dkdItem)) === 'teslimat platformu / kurum');

  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdDepth < 7 && dkdScope; dkdDepth += 1) {
      const dkdSelect = dkdScope.querySelector?.('select');
      if (dkdSelect) return dkdSelect;
      dkdScope = dkdScope.parentElement;
    }
  }
  return null;
}

function dkdV22EnsurePlatform() {
  if (!DKD_V22.registrationActive) return;
  const dkdSelect = dkdV22FindPlatformSelect();
  if (!dkdSelect) return;

  const dkdOptions = Array.from(dkdSelect.options);
  const dkdUberTrendyol = dkdOptions.find((dkdOption) => {
    const dkdOptionText = dkdV22Normalize(dkdOption.textContent);
    return dkdOptionText.includes('trendyol go') || dkdOptionText.includes('uber/trendyol');
  });
  if (!dkdUberTrendyol) return;

  dkdUberTrendyol.textContent = 'Uber/Trendyol GO';
  const dkdPlaceholder = dkdOptions.find((dkdOption) => !dkdOption.value);
  const dkdExpectedFirst = dkdPlaceholder?.nextElementSibling || dkdSelect.firstElementChild;
  if (dkdExpectedFirst !== dkdUberTrendyol) {
    if (dkdPlaceholder) dkdSelect.insertBefore(dkdUberTrendyol, dkdPlaceholder.nextSibling);
    else dkdSelect.insertBefore(dkdUberTrendyol, dkdSelect.firstChild);
  }

  if (Date.now() > DKD_V22.platformDeadline && dkdV22Normalize(dkdSelect.selectedOptions?.[0]?.textContent) === 'uber/trendyol go') return;

  if (dkdSelect.value !== dkdUberTrendyol.value) {
    dkdUberTrendyol.selected = true;
    dkdSelect.value = dkdUberTrendyol.value;
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

const DKD_V22_TRANSLATIONS = new Map([
  ['gates', 'Kapılar'],
  ['gate', 'Kapı'],
  ['staff', 'Güvenlik Personeli'],
  ['staff members', 'Güvenlik Personeli'],
  ['residents', 'Site Sakinleri'],
  ['resident', 'Site Sakini'],
  ['courier passes month', 'Aylık Kurye Geçişi'],
  ['visitor passes month', 'Aylık Ziyaretçi Geçişi'],
  ['courier passes', 'Kurye Geçişleri'],
  ['visitor passes', 'Ziyaretçi Geçişleri'],
  ['dashboard', 'Ana Merkez'],
  ['overview', 'Genel Bakış'],
  ['applications', 'Başvurular'],
  ['reports', 'Raporlar'],
  ['settings', 'Ayarlar'],
  ['notifications', 'Bildirimler'],
  ['status', 'Durum'],
  ['pending', 'Bekleyen'],
  ['approved', 'Onaylanan'],
  ['rejected', 'Reddedilen'],
  ['active', 'Aktif'],
  ['inactive', 'Pasif'],
  ['monthly', 'Aylık'],
  ['total', 'Toplam'],
]);

function dkdV22TranslateText(dkdValue) {
  const dkdRaw = String(dkdValue || '');
  const dkdNormalized = dkdV22Normalize(dkdRaw);
  if (DKD_V22_TRANSLATIONS.has(dkdNormalized)) return DKD_V22_TRANSLATIONS.get(dkdNormalized);

  return dkdRaw
    .replace(/\bcourier passes month\b/gi, 'Aylık Kurye Geçişi')
    .replace(/\bvisitor passes month\b/gi, 'Aylık Ziyaretçi Geçişi')
    .replace(/\bcourier passes\b/gi, 'Kurye Geçişleri')
    .replace(/\bvisitor passes\b/gi, 'Ziyaretçi Geçişleri');
}

function dkdV22TranslateInterface() {
  const dkdRoot = document.querySelector('#dkd-app') || document.body;
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);

  dkdNodes.forEach((dkdNode) => {
    const dkdParentTag = dkdNode.parentElement?.tagName;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(dkdParentTag)) return;
    const dkdTranslated = dkdV22TranslateText(dkdNode.nodeValue);
    if (dkdTranslated !== dkdNode.nodeValue) dkdNode.nodeValue = dkdTranslated;
  });

  document.querySelectorAll('option[title],input[placeholder],textarea[placeholder],[aria-label]').forEach((dkdElement) => {
    ['title', 'placeholder', 'aria-label'].forEach((dkdAttribute) => {
      const dkdCurrent = dkdElement.getAttribute(dkdAttribute);
      if (!dkdCurrent) return;
      const dkdTranslated = dkdV22TranslateText(dkdCurrent);
      if (dkdTranslated !== dkdCurrent) dkdElement.setAttribute(dkdAttribute, dkdTranslated);
    });
  });
}

function dkdV22UpdateVersion() {
  const dkdRoot = document.querySelector('#dkd-app') || document.body;
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  while (dkdWalker.nextNode()) {
    const dkdNode = dkdWalker.currentNode;
    let dkdValue = String(dkdNode.nodeValue || '');
    dkdValue = dkdValue
      .replace(/DraBornGate Web v2\.1(?:\.\d+)?/gi, 'DraBornGate Web v2.2.0')
      .replace(/\bWEB v2\.1(?:\.\d+)?/g, 'WEB v2.2')
      .replace(/\bWeb v2\.1(?:\.\d+)?/g, 'Web v2.2');
    if (dkdValue !== dkdNode.nodeValue) dkdNode.nodeValue = dkdValue;
  }
  document.documentElement.dataset.dkdWebVersion = '2.2.0';
}

function dkdV22Patch() {
  DKD_V22.patchQueued = false;
  const dkdRoleChanged = dkdV22EnsureCourierRole();
  if (!dkdRoleChanged) dkdV22EnsurePlatform();
  dkdV22TranslateInterface();
  dkdV22UpdateVersion();
}

function dkdV22QueuePatch() {
  if (DKD_V22.patchQueued) return;
  DKD_V22.patchQueued = true;
  requestAnimationFrame(dkdV22Patch);
}

const dkdV22Observer = new MutationObserver(dkdV22QueuePatch);
dkdV22Observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
});

window.addEventListener('popstate', dkdV22QueuePatch);
window.addEventListener('hashchange', dkdV22QueuePatch);
document.addEventListener('click', () => {
  setTimeout(dkdV22QueuePatch, 40);
  setTimeout(dkdV22QueuePatch, 220);
}, true);

dkdV22QueuePatch();
