const DKD_V3218_VERSION = '3.2.18';
const dkdV3218State = {
  patchQueued: false,
  siteValue: '',
  gateSignature: '',
  gateRetryTimer: 0,
  gateRetryCount: 0,
};

function dkdV3218Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3218Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV3218IsNewPassPage() {
  const dkdText = dkdV3218Normalize(document.body?.innerText || '');
  return dkdText.includes('yeni kurye gecisi') && dkdText.includes('siparis numarasi');
}

function dkdV3218FindSelectByLabel(dkdLabelText, dkdExcluded = null) {
  const dkdWanted = dkdV3218Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
    .filter((dkdNode) => dkdV3218Normalize(dkdNode.textContent) === dkdWanted);
  for (const dkdLabel of dkdLabels) {
    if (dkdLabel instanceof HTMLLabelElement && dkdLabel.htmlFor) {
      const dkdLinked = document.getElementById(dkdLabel.htmlFor);
      if (dkdLinked instanceof HTMLSelectElement && dkdLinked !== dkdExcluded) return dkdLinked;
    }
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelects = [...dkdScope.querySelectorAll('select')].filter((dkdSelect) => dkdSelect !== dkdExcluded);
      if (dkdSelects.length === 1) return dkdSelects[0];
    }
  }
  return null;
}

function dkdV3218SiteSelect() {
  return document.querySelector('select[data-dkd-v3210-site-select="true"],select.dkd-v328-native-site')
    || dkdV3218FindSelectByLabel('Site');
}

function dkdV3218GateSelect() {
  const dkdSite = dkdV3218SiteSelect();
  return dkdV3218FindSelectByLabel('Kapı', dkdSite) || dkdV3218FindSelectByLabel('Kapi', dkdSite);
}

function dkdV3218PatchSitePlaceholder() {
  for (const dkdInput of document.querySelectorAll('.dkd-v3210-site-picker input,.dkd-v328-site-picker input,input[aria-label="Site ara"]')) {
    dkdInput.placeholder = 'Site Adı Yaz';
    dkdInput.setAttribute('aria-label', 'Site Adı Yaz');
  }
}

function dkdV3218WalletIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7.5A3.5 3.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h14M15 12h5v4h-5a2 2 0 1 1 0-4Z" stroke="currentColor" stroke-width="1.8"/></svg>';
}

function dkdV3218ChevronIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="2"/></svg>';
}

function dkdV3218CheckIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>';
}

function dkdV3218FindMenuAnchor() {
  return [...document.querySelectorAll('button,a,[role="button"],li')]
    .find((dkdItem) => dkdV3218Normalize(dkdItem.textContent) === 'profil ve baglanti') || null;
}

function dkdV3218HideLegacyEarnings() {
  const dkdCandidates = [...document.querySelectorAll('button,a,[role="button"],li,article')];
  for (const dkdCandidate of dkdCandidates) {
    if (dkdCandidate.classList.contains('dkd-v3218-earnings-menu') || dkdCandidate.closest('#dkd-v3211-earnings,#dkd-v328-modal')) continue;
    if (dkdV3218Normalize(dkdCandidate.textContent) !== 'kazanclarim') continue;
    dkdCandidate.dataset.dkdV3218LegacyEarnings = 'true';
    dkdCandidate.setAttribute('aria-hidden', 'true');
    dkdCandidate.tabIndex = -1;
  }
}

function dkdV3218OpenEarnings() {
  const dkdTrigger = document.createElement('button');
  dkdTrigger.type = 'button';
  dkdTrigger.hidden = true;
  dkdTrigger.dataset.dkdV3211Earnings = 'true';
  document.body.appendChild(dkdTrigger);
  dkdTrigger.click();
  dkdTrigger.remove();
}

function dkdV3218EnsureEarnings() {
  dkdV3218HideLegacyEarnings();
  const dkdAnchor = dkdV3218FindMenuAnchor();
  if (!dkdAnchor) return;
  let dkdButton = document.querySelector('.dkd-v3218-earnings-menu');
  if (!dkdButton) {
    dkdButton = document.createElement('button');
    dkdButton.type = 'button';
    dkdButton.className = 'dkd-v3218-earnings-menu';
    dkdButton.innerHTML = `<span>${dkdV3218WalletIcon()}</span><strong>Kazançlarım</strong><i aria-hidden="true">›</i>`;
    dkdButton.addEventListener('click', dkdV3218OpenEarnings);
  }
  if (dkdButton.previousElementSibling !== dkdAnchor) dkdAnchor.insertAdjacentElement('afterend', dkdButton);
}

function dkdV3218NativeSet(dkdSelect, dkdValue, dkdDispatch = true) {
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  for (const dkdOption of dkdSelect.options) dkdOption.selected = dkdOption.value === dkdValue;
  if (dkdDispatch) {
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function dkdV3218GateOptions(dkdGate) {
  return [...dkdGate.options]
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
    .map((dkdOption) => ({ value: dkdOption.value, label: dkdOption.textContent.trim() }));
}

function dkdV3218GateSignature(dkdGate) {
  return dkdV3218GateOptions(dkdGate).map((dkdOption) => `${dkdOption.value}:${dkdOption.label}`).join('|');
}

function dkdV3218RenderGatePicker(dkdPicker, dkdGate) {
  const dkdOptions = dkdV3218GateOptions(dkdGate);
  const dkdCurrent = dkdOptions.find((dkdOption) => dkdOption.value === dkdGate.value);
  const dkdButton = dkdPicker.querySelector('.dkd-v3218-gate-button');
  const dkdLabel = dkdButton?.querySelector('strong');
  const dkdList = dkdPicker.querySelector('.dkd-v3218-gate-list');
  if (dkdLabel) dkdLabel.textContent = dkdCurrent?.label || (dkdOptions.length ? 'Kapı Seç' : 'Kapı bilgileri yükleniyor…');
  if (dkdButton) {
    dkdButton.disabled = dkdOptions.length === 0;
    dkdButton.setAttribute('aria-expanded', String(dkdPicker.classList.contains('open')));
  }
  if (dkdList) {
    dkdList.innerHTML = dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v3218-gate="${encodeURIComponent(dkdOption.value)}" class="${dkdOption.value === dkdGate.value ? 'selected' : ''}"><span>${dkdV3218Escape(dkdOption.label)}</span>${dkdOption.value === dkdGate.value ? dkdV3218CheckIcon() : ''}</button>`).join('');
  }
}

function dkdV3218DispatchSite(dkdSite) {
  if (!(dkdSite instanceof HTMLSelectElement) || !dkdSite.value) return;
  const dkdMarker = dkdSite.getAttribute('data-dkd-v3210-site-select');
  dkdSite.removeAttribute('data-dkd-v3210-site-select');
  try {
    dkdSite.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSite.dispatchEvent(new Event('change', { bubbles: true }));
  } finally {
    if (dkdMarker !== null) dkdSite.setAttribute('data-dkd-v3210-site-select', dkdMarker);
  }
}

function dkdV3218ScheduleGateRepair() {
  clearTimeout(dkdV3218State.gateRetryTimer);
  const dkdRun = () => {
    const dkdSite = dkdV3218SiteSelect();
    const dkdGate = dkdV3218GateSelect();
    if (!(dkdSite instanceof HTMLSelectElement) || !(dkdGate instanceof HTMLSelectElement) || !dkdSite.value) return;
    dkdGate.disabled = false;
    if (dkdV3218GateOptions(dkdGate).length > 0 || dkdV3218State.gateRetryCount >= 8) {
      dkdV3218QueuePatch();
      return;
    }
    dkdV3218State.gateRetryCount += 1;
    dkdV3218DispatchSite(dkdSite);
    dkdV3218State.gateRetryTimer = window.setTimeout(dkdRun, 160 + dkdV3218State.gateRetryCount * 120);
  };
  dkdV3218State.gateRetryTimer = window.setTimeout(dkdRun, 40);
}

function dkdV3218MountGatePicker() {
  if (!dkdV3218IsNewPassPage()) return;
  const dkdSite = dkdV3218SiteSelect();
  const dkdGate = dkdV3218GateSelect();
  if (!(dkdSite instanceof HTMLSelectElement) || !(dkdGate instanceof HTMLSelectElement)) return;

  const dkdSiteValue = String(dkdSite.value || '');
  if (dkdSiteValue !== dkdV3218State.siteValue) {
    dkdV3218State.siteValue = dkdSiteValue;
    dkdV3218State.gateRetryCount = 0;
    dkdV3218State.gateSignature = '';
    if (dkdSiteValue) dkdV3218ScheduleGateRepair();
  }

  const dkdHost = dkdGate.parentElement;
  if (!dkdHost) return;
  dkdHost.classList.add('dkd-v3218-gate-host');
  dkdGate.classList.add('dkd-v3218-native-gate');
  dkdGate.disabled = !dkdSiteValue;

  let dkdPicker = dkdHost.querySelector(':scope > .dkd-v3218-gate-picker');
  if (!dkdPicker) {
    dkdPicker = document.createElement('div');
    dkdPicker.className = 'dkd-v3218-gate-picker';
    dkdPicker.innerHTML = `<button type="button" class="dkd-v3218-gate-button" aria-expanded="false"><span>${dkdV3218CheckIcon()}</span><strong>Kapı Seç</strong><i>${dkdV3218ChevronIcon()}</i></button><div class="dkd-v3218-gate-list"></div>`;
    dkdHost.insertBefore(dkdPicker, dkdGate);
    dkdPicker.querySelector('.dkd-v3218-gate-button')?.addEventListener('click', () => {
      dkdPicker.classList.toggle('open');
      dkdV3218RenderGatePicker(dkdPicker, dkdGate);
    });
    dkdPicker.querySelector('.dkd-v3218-gate-list')?.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target instanceof Element ? dkdEvent.target.closest('[data-dkd-v3218-gate]') : null;
      if (!dkdButton) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV3218Gate || '');
      if (![...dkdGate.options].some((dkdOption) => dkdOption.value === dkdValue)) return;
      dkdV3218NativeSet(dkdGate, dkdValue, true);
      dkdPicker.classList.remove('open');
      dkdV3218RenderGatePicker(dkdPicker, dkdGate);
    });
  }

  const dkdSignature = dkdV3218GateSignature(dkdGate);
  if (dkdSignature !== dkdV3218State.gateSignature) {
    dkdV3218State.gateSignature = dkdSignature;
    dkdV3218RenderGatePicker(dkdPicker, dkdGate);
  } else if (!dkdPicker.classList.contains('open')) {
    dkdV3218RenderGatePicker(dkdPicker, dkdGate);
  }
}

function dkdV3218PatchVersionText() {
  const dkdPattern = /3\.2\.17/g;
  for (const dkdNode of document.querySelectorAll('small,strong,span,p,h1,h2,h3,title')) {
    if (!dkdNode.textContent?.includes('3.2.17')) continue;
    dkdNode.textContent = dkdNode.textContent.replace(dkdPattern, DKD_V3218_VERSION);
  }
  document.title = document.title.replace(dkdPattern, DKD_V3218_VERSION);
}

function dkdV3218Patch() {
  dkdV3218State.patchQueued = false;
  window.__DKD_GATE_V3210_SITE_GUARD__ = { shouldBlockSelect: () => false, shouldBlockOption: () => false };
  dkdV3218PatchSitePlaceholder();
  dkdV3218EnsureEarnings();
  dkdV3218MountGatePicker();
  dkdV3218PatchVersionText();
  document.documentElement.dataset.dkdGateVersion = DKD_V3218_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3218_VERSION);
}

function dkdV3218QueuePatch() {
  if (dkdV3218State.patchQueued) return;
  dkdV3218State.patchQueued = true;
  requestAnimationFrame(dkdV3218Patch);
}

document.addEventListener('click', (dkdEvent) => {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (dkdTarget?.closest('[data-dkd-v3210-site],[data-dkd-v328-site]')) {
    dkdV3218State.gateRetryCount = 0;
    dkdV3218State.siteValue = '';
    dkdV3218ScheduleGateRepair();
  }
  if (!dkdTarget?.closest('.dkd-v3218-gate-picker')) {
    document.querySelector('.dkd-v3218-gate-picker.open')?.classList.remove('open');
  }
}, false);

new MutationObserver(dkdV3218QueuePatch).observe(document.body, { childList: true, subtree: true });
window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3218Patch));
window.addEventListener('popstate', () => requestAnimationFrame(dkdV3218Patch));

dkdV3218Patch();
setTimeout(dkdV3218Patch, 150);
setTimeout(dkdV3218Patch, 700);
window.__DKD_GATE_V3218_SINGLE_EARNINGS_STABLE_GATE__ = true;
