const DKD_V211 = {
  registrationActive: false,
  courierRoleInitialized: false,
  platformInitialized: false,
  platformEnsureUntil: 0,
  patchQueued: false,
};

function dkdV211Text(dkdElement) {
  return String(dkdElement?.textContent || '').replace(/\s+/g, ' ').trim();
}

function dkdV211Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV211IsRegistrationPage() {
  const dkdPageText = dkdV211Normalize(document.body.innerText);
  return dkdPageText.includes('premium hesabi olustur')
    && dkdPageText.includes('ad soyad')
    && dkdPageText.includes('teslimat platformu / kurum');
}

function dkdV211FindRoleControl(dkdRoleName) {
  const dkdRole = dkdV211Normalize(dkdRoleName);
  const dkdNodes = Array.from(document.querySelectorAll('button,[role="button"],label,div,span,strong,h2,h3,p'))
    .filter((dkdNode) => dkdV211Normalize(dkdV211Text(dkdNode)) === dkdRole);

  for (const dkdNode of dkdNodes) {
    let dkdCurrent = dkdNode;
    for (let dkdDepth = 0; dkdDepth < 6 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
      const dkdClass = String(dkdCurrent.className || '').toLowerCase();
      const dkdRect = dkdCurrent.getBoundingClientRect();
      const dkdRadio = dkdCurrent.querySelector?.('input[type="radio"]');
      const dkdLooksInteractive = dkdCurrent.matches?.('button,[role="button"],label')
        || dkdRadio
        || dkdCurrent.tabIndex >= 0
        || typeof dkdCurrent.onclick === 'function'
        || /(role|choice|option|select|card|tile)/.test(dkdClass);
      const dkdSizeIsReasonable = dkdRect.width > 120 && dkdRect.height >= 48 && dkdRect.height < 240;
      if (dkdLooksInteractive && dkdSizeIsReasonable) return { control: dkdCurrent, radio: dkdRadio };
      dkdCurrent = dkdCurrent.parentElement;
    }
  }
  return null;
}

function dkdV211DefaultCourierRole() {
  if (!dkdV211IsRegistrationPage()) {
    if (DKD_V211.registrationActive) {
      DKD_V211.registrationActive = false;
      DKD_V211.courierRoleInitialized = false;
      DKD_V211.platformInitialized = false;
      DKD_V211.platformEnsureUntil = 0;
    }
    return false;
  }

  DKD_V211.registrationActive = true;
  if (DKD_V211.courierRoleInitialized) return false;

  const dkdCourierControl = dkdV211FindRoleControl('Kurye');
  if (!dkdCourierControl) return false;

  DKD_V211.courierRoleInitialized = true;
  DKD_V211.platformInitialized = false;
  DKD_V211.platformEnsureUntil = 0;

  if (dkdCourierControl.radio && !dkdCourierControl.radio.checked) dkdCourierControl.radio.click();
  else dkdCourierControl.control.click();

  return true;
}

function dkdV211FindPlatformSelect() {
  const dkdLabels = Array.from(document.querySelectorAll('label,div,span,p,strong'))
    .filter((dkdItem) => dkdV211Normalize(dkdV211Text(dkdItem)) === 'teslimat platformu / kurum');

  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdDepth < 6 && dkdScope; dkdDepth += 1) {
      const dkdSelect = dkdScope.querySelector?.('select');
      if (dkdSelect) return dkdSelect;
      dkdScope = dkdScope.parentElement;
    }
  }
  return null;
}

function dkdV211DefaultPlatform() {
  if (!DKD_V211.registrationActive || !DKD_V211.courierRoleInitialized) return;

  const dkdSelect = dkdV211FindPlatformSelect();
  if (!dkdSelect) return;

  const dkdOptions = Array.from(dkdSelect.options);
  const dkdUberTrendyol = dkdOptions.find((dkdOption) => {
    const dkdOptionText = dkdV211Normalize(dkdOption.textContent);
    return dkdOptionText.includes('trendyol go') || dkdOptionText.includes('uber/trendyol');
  });
  if (!dkdUberTrendyol) return;

  dkdUberTrendyol.textContent = 'Uber/Trendyol GO';
  const dkdPlaceholder = dkdOptions.find((dkdOption) => !dkdOption.value);
  const dkdFirstRealOption = dkdPlaceholder?.nextElementSibling || dkdSelect.firstElementChild;
  if (dkdFirstRealOption !== dkdUberTrendyol) {
    if (dkdPlaceholder) dkdSelect.insertBefore(dkdUberTrendyol, dkdPlaceholder.nextSibling);
    else dkdSelect.insertBefore(dkdUberTrendyol, dkdSelect.firstChild);
  }

  const dkdShouldEnsure = !DKD_V211.platformInitialized || Date.now() < DKD_V211.platformEnsureUntil;
  if (!dkdShouldEnsure) return;

  if (!DKD_V211.platformInitialized) {
    DKD_V211.platformInitialized = true;
    DKD_V211.platformEnsureUntil = Date.now() + 1800;
  }

  if (dkdSelect.value !== dkdUberTrendyol.value) {
    dkdSelect.value = dkdUberTrendyol.value;
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function dkdV211Patch() {
  DKD_V211.patchQueued = false;
  const dkdRoleChanged = dkdV211DefaultCourierRole();
  if (!dkdRoleChanged) dkdV211DefaultPlatform();
}

function dkdV211QueuePatch() {
  if (DKD_V211.patchQueued) return;
  DKD_V211.patchQueued = true;
  requestAnimationFrame(dkdV211Patch);
}

const dkdV211Observer = new MutationObserver(dkdV211QueuePatch);
dkdV211Observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('popstate', dkdV211QueuePatch);
document.addEventListener('click', () => setTimeout(dkdV211QueuePatch, 40), true);
dkdV211QueuePatch();
