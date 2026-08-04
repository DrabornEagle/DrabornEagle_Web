const DKD_V3217_VERSION = '3.2.17';
const dkdV3217State = {
  patchQueued: false,
  selectedSite: '',
  gateRetryCount: 0,
  gateLastDispatchAt: 0,
};

function dkdV3217Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3217IsNewPassPage() {
  const dkdText = dkdV3217Normalize(document.body?.innerText || '');
  return dkdText.includes('yeni kurye gecisi') && dkdText.includes('siparis numarasi');
}

function dkdV3217FieldSelect(dkdLabelText, dkdExcludedSelect = null) {
  const dkdTarget = dkdV3217Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
    .filter((dkdElement) => dkdV3217Normalize(dkdElement.textContent) === dkdTarget);

  for (const dkdLabel of dkdLabels) {
    if (dkdLabel instanceof HTMLLabelElement && dkdLabel.htmlFor) {
      const dkdLinked = document.getElementById(dkdLabel.htmlFor);
      if (dkdLinked instanceof HTMLSelectElement && dkdLinked !== dkdExcludedSelect) return dkdLinked;
    }
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 6; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelects = [...dkdScope.querySelectorAll('select')].filter((dkdSelect) => dkdSelect !== dkdExcludedSelect);
      if (dkdSelects.length === 1) return dkdSelects[0];
      if (dkdSelects.length > 1) {
        const dkdLabelRect = dkdLabel.getBoundingClientRect();
        return dkdSelects.sort((dkdLeft, dkdRight) => {
          const dkdLeftRect = dkdLeft.getBoundingClientRect();
          const dkdRightRect = dkdRight.getBoundingClientRect();
          return Math.abs(dkdLeftRect.top - dkdLabelRect.bottom) - Math.abs(dkdRightRect.top - dkdLabelRect.bottom);
        })[0];
      }
    }
  }
  return null;
}

function dkdV3217SiteSelect() {
  return document.querySelector('select[data-dkd-v3210-site-select="true"]') || dkdV3217FieldSelect('Site');
}

function dkdV3217GateSelect() {
  const dkdSite = dkdV3217SiteSelect();
  return dkdV3217FieldSelect('Kapı', dkdSite) || dkdV3217FieldSelect('Kapi', dkdSite);
}

function dkdV3217AllowNativeSiteUpdates() {
  window.__DKD_GATE_V3210_SITE_GUARD__ = {
    shouldBlockSelect() { return false; },
    shouldBlockOption() { return false; },
  };
}

function dkdV3217DispatchSiteSelection(dkdSite) {
  if (!(dkdSite instanceof HTMLSelectElement) || !dkdSite.value) return;
  const dkdNow = Date.now();
  if (dkdNow - dkdV3217State.gateLastDispatchAt < 300) return;
  dkdV3217State.gateLastDispatchAt = dkdNow;
  const dkdMarker = dkdSite.getAttribute('data-dkd-v3210-site-select');
  dkdSite.removeAttribute('data-dkd-v3210-site-select');
  try {
    dkdSite.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSite.dispatchEvent(new Event('change', { bubbles: true }));
  } finally {
    if (dkdMarker !== null) dkdSite.setAttribute('data-dkd-v3210-site-select', dkdMarker);
  }
}

function dkdV3217RepairGate() {
  if (!dkdV3217IsNewPassPage()) {
    dkdV3217State.selectedSite = '';
    dkdV3217State.gateRetryCount = 0;
    return;
  }
  dkdV3217AllowNativeSiteUpdates();
  const dkdSite = dkdV3217SiteSelect();
  const dkdGate = dkdV3217GateSelect();
  if (!(dkdSite instanceof HTMLSelectElement) || !(dkdGate instanceof HTMLSelectElement)) return;

  const dkdSiteValue = String(dkdSite.value || '');
  if (dkdSiteValue !== dkdV3217State.selectedSite) {
    dkdV3217State.selectedSite = dkdSiteValue;
    dkdV3217State.gateRetryCount = 0;
    dkdV3217State.gateLastDispatchAt = 0;
  }
  if (!dkdSiteValue) {
    dkdGate.disabled = true;
    return;
  }

  dkdGate.disabled = false;
  dkdGate.removeAttribute('aria-disabled');
  dkdGate.closest('[class*="field"],[class*="select"],label,div')?.classList.add('dkd-v3217-gate-ready');
  const dkdOptions = [...dkdGate.options].filter((dkdOption) => dkdOption.value && !dkdOption.disabled);
  if (dkdOptions.length || dkdV3217State.gateRetryCount >= 5) return;

  dkdV3217State.gateRetryCount += 1;
  dkdV3217DispatchSiteSelection(dkdSite);
  setTimeout(dkdV3217RepairGate, 110 + dkdV3217State.gateRetryCount * 140);
}

function dkdV3217WalletIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7.5A3.5 3.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h14M15 12h5v4h-5a2 2 0 1 1 0-4Z" stroke="currentColor" stroke-width="1.8"/></svg>';
}

function dkdV3217FindMenuAnchor() {
  return [...document.querySelectorAll('button,a,[role="button"],li')]
    .find((dkdItem) => dkdV3217Normalize(dkdItem.textContent) === 'profil ve baglanti') || null;
}

function dkdV3217OpenEarnings() {
  const dkdTrigger = document.createElement('button');
  dkdTrigger.type = 'button';
  dkdTrigger.hidden = true;
  dkdTrigger.dataset.dkdV3211Earnings = 'true';
  document.body.appendChild(dkdTrigger);
  dkdTrigger.click();
  dkdTrigger.remove();
}

function dkdV3217IsCourierMenu() {
  const dkdRole = dkdV3217Normalize(
    window.dkdV325Session?.currentRole?.()
      || window.dkdV324Session?.currentRole?.()
      || window.dkdV31Data?.state?.role
      || ''
  );
  if (dkdRole === 'courier' || dkdRole === 'kurye') return true;
  const dkdBodyText = dkdV3217Normalize(document.body?.innerText || '');
  return dkdBodyText.includes('kurye merkezi') && dkdBodyText.includes('yeni gecis') && dkdBodyText.includes('gecislerim');
}

function dkdV3217EnsureStableEarnings() {
  if (!dkdV3217IsCourierMenu()) {
    document.querySelector('.dkd-v3217-earnings-menu')?.remove();
    return;
  }
  const dkdAnchor = dkdV3217FindMenuAnchor();
  if (!dkdAnchor) return;
  let dkdButton = document.querySelector('.dkd-v3217-earnings-menu');
  if (!dkdButton) {
    dkdButton = document.createElement('button');
    dkdButton.type = 'button';
    dkdButton.className = 'dkd-v3217-earnings-menu';
    dkdButton.setAttribute('aria-label', 'Kazançlarım');
    dkdButton.innerHTML = `<span>${dkdV3217WalletIcon()}</span><strong aria-hidden="true"></strong><i aria-hidden="true"></i>`;
    dkdButton.addEventListener('click', dkdV3217OpenEarnings);
  }
  if (dkdButton.previousElementSibling !== dkdAnchor) dkdAnchor.insertAdjacentElement('afterend', dkdButton);
}

function dkdV3217CardMode(dkdWrapper) {
  const dkdCard = dkdWrapper.closest('article,[class*="pass-card"],[class*="transition-card"],[class*="history-card"],[class*="courier-card"],section,[class*="card"]');
  const dkdCardText = dkdV3217Normalize(dkdCard?.textContent || '');
  const dkdBodyText = dkdV3217Normalize(document.body?.innerText || '');
  if (dkdCardText.includes('tek kullanimlik kod') || dkdCardText.includes('reddet') || (dkdBodyText.includes('canli kurye kuyrugu') && dkdCardText.includes('kapida'))) return 'queue';
  return 'history';
}

function dkdV3217ResizeMotorcycles() {
  for (const dkdWrapper of document.querySelectorAll('.dkd-v3215-racing-motorcycle')) {
    dkdWrapper.classList.remove('dkd-v3217-moto-history', 'dkd-v3217-moto-queue');
    dkdWrapper.classList.add(`dkd-v3217-moto-${dkdV3217CardMode(dkdWrapper)}`);
  }
}

function dkdV3217Patch() {
  dkdV3217State.patchQueued = false;
  dkdV3217AllowNativeSiteUpdates();
  dkdV3217EnsureStableEarnings();
  dkdV3217RepairGate();
  dkdV3217ResizeMotorcycles();
  document.documentElement.dataset.dkdGateVersion = DKD_V3217_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3217_VERSION);
}

function dkdV3217QueuePatch() {
  if (dkdV3217State.patchQueued) return;
  dkdV3217State.patchQueued = true;
  requestAnimationFrame(dkdV3217Patch);
}

document.addEventListener('click', (dkdEvent) => {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget?.closest('[data-dkd-v3210-site]')) return;
  dkdV3217State.gateRetryCount = 0;
  dkdV3217State.gateLastDispatchAt = 0;
  setTimeout(dkdV3217RepairGate, 0);
  setTimeout(dkdV3217RepairGate, 150);
  setTimeout(dkdV3217RepairGate, 450);
  setTimeout(dkdV3217RepairGate, 900);
}, false);

window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3217Patch));
window.addEventListener('popstate', () => requestAnimationFrame(dkdV3217Patch));
new MutationObserver(dkdV3217QueuePatch).observe(document.body, { childList: true, subtree: true });

dkdV3217Patch();
setTimeout(dkdV3217Patch, 120);
setTimeout(dkdV3217Patch, 700);
window.__DKD_GATE_V3217_STABLE_EARNINGS_GATE_MOTORCYCLE__ = true;
