const DKD_V3219_VERSION = '3.2.19';
const dkdV3219State = {
  patchQueued: false,
  pageActive: false,
  siteInitialized: false,
  siteValue: '',
  siteLabel: '',
  gateSiteValue: '',
  gateValue: '',
  gateReady: false,
  gateLoadToken: 0,
};

function dkdV3219Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3219Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV3219Icon(dkdName) {
  const dkdIcons = {
    wallet: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7.5A3.5 3.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h14M15 12h5v4h-5a2 2 0 1 1 0-4Z" stroke="currentColor" stroke-width="1.8"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" stroke="currentColor" stroke-width="1.8"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.8-2.8 8.2-7 10-4.2-1.8-7-5.2-7-10V6l7-3Z" stroke="currentColor" stroke-width="1.8"/><path d="m9 12 2 2 4-5" stroke="currentColor" stroke-width="1.9"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV3219Visible(dkdElement) {
  if (!(dkdElement instanceof Element)) return false;
  const dkdStyle = getComputedStyle(dkdElement);
  return dkdStyle.display !== 'none' && dkdStyle.visibility !== 'hidden';
}

function dkdV3219IsNewPassPage() {
  const dkdText = dkdV3219Normalize(document.body?.innerText || '');
  return dkdText.includes('yeni kurye gecisi') && dkdText.includes('siparis numarasi');
}

function dkdV3219FindSelectByLabel(dkdLabelText, dkdExcluded = null) {
  const dkdWanted = dkdV3219Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
    .filter((dkdNode) => dkdV3219Normalize(dkdNode.textContent) === dkdWanted);
  for (const dkdLabel of dkdLabels) {
    if (dkdLabel instanceof HTMLLabelElement && dkdLabel.htmlFor) {
      const dkdLinked = document.getElementById(dkdLabel.htmlFor);
      if (dkdLinked instanceof HTMLSelectElement && dkdLinked !== dkdExcluded) return dkdLinked;
    }
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelects = [...dkdScope.querySelectorAll('select')].filter((dkdSelect) => dkdSelect !== dkdExcluded);
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

function dkdV3219SiteSelect() {
  return document.querySelector('select[data-dkd-v3219-site="true"]') || dkdV3219FindSelectByLabel('Site');
}

function dkdV3219GateSelect() {
  const dkdSite = dkdV3219SiteSelect();
  return document.querySelector('select[data-dkd-v3219-gate="true"]')
    || dkdV3219FindSelectByLabel('Kapı', dkdSite)
    || dkdV3219FindSelectByLabel('Kapi', dkdSite);
}

function dkdV3219NativeSet(dkdSelect, dkdValue, dkdDispatch = true) {
  if (!(dkdSelect instanceof HTMLSelectElement)) return;
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  for (const dkdOption of dkdSelect.options) dkdOption.selected = dkdOption.value === dkdValue;
  if (dkdDispatch) {
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function dkdV3219FindMenuAnchor() {
  return [...document.querySelectorAll('button,a,[role="button"],li')]
    .find((dkdItem) => dkdV3219Normalize(dkdItem.textContent) === 'profil ve baglanti') || null;
}

function dkdV3219IsCourierMenu() {
  const dkdRole = dkdV3219Normalize(
    window.dkdV325Session?.currentRole?.()
      || window.dkdV324Session?.currentRole?.()
      || window.dkdV31Data?.state?.role
      || ''
  );
  if (dkdRole === 'courier' || dkdRole === 'kurye') return true;
  const dkdText = dkdV3219Normalize(document.body?.innerText || '');
  return dkdText.includes('kurye merkezi') && dkdText.includes('gecislerim') && dkdText.includes('profil ve baglanti');
}

function dkdV3219OpenEarnings() {
  const dkdTrigger = document.createElement('button');
  dkdTrigger.type = 'button';
  dkdTrigger.hidden = true;
  dkdTrigger.dataset.dkdV3211Earnings = 'true';
  document.body.appendChild(dkdTrigger);
  dkdTrigger.click();
  dkdTrigger.remove();
}

function dkdV3219EnsureSingleEarnings() {
  for (const dkdLegacy of document.querySelectorAll('.dkd-v3211-earnings-menu,.dkd-v3217-earnings-menu,.dkd-v3218-earnings-menu,.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]')) dkdLegacy.remove();
  for (const dkdItem of [...document.querySelectorAll('button,a,[role="button"],li,article')]) {
    if (dkdItem.classList.contains('dkd-v3219-earnings-menu') || dkdItem.closest('#dkd-v3211-earnings,#dkd-v328-modal')) continue;
    if (dkdV3219Normalize(dkdItem.textContent) === 'kazanclarim') dkdItem.remove();
  }

  if (!dkdV3219IsCourierMenu()) {
    document.querySelector('.dkd-v3219-earnings-menu')?.remove();
    return;
  }
  const dkdAnchor = dkdV3219FindMenuAnchor();
  if (!dkdAnchor) return;
  const dkdAll = [...document.querySelectorAll('.dkd-v3219-earnings-menu')];
  let dkdButton = dkdAll.shift() || null;
  for (const dkdDuplicate of dkdAll) dkdDuplicate.remove();
  if (!dkdButton) {
    dkdButton = document.createElement('button');
    dkdButton.type = 'button';
    dkdButton.className = 'dkd-v3219-earnings-menu';
    dkdButton.innerHTML = `<span>${dkdV3219Icon('wallet')}</span><strong>Kazançlarım</strong><i aria-hidden="true">›</i>`;
    dkdButton.addEventListener('click', dkdV3219OpenEarnings);
  }
  if (dkdButton.previousElementSibling !== dkdAnchor) dkdAnchor.insertAdjacentElement('afterend', dkdButton);
}

function dkdV3219PatchCourierHeader() {
  const dkdText = dkdV3219Normalize(document.body?.innerText || '');
  if (!dkdText.includes('yeni kurye gecisi') && !dkdText.includes('gecislerim')) return;
  for (const dkdCandidate of document.querySelectorAll('header h1,header h2,header h3,header strong,[class*="topbar"] strong,[class*="header"] strong')) {
    if (!dkdV3219Visible(dkdCandidate)) continue;
    const dkdRect = dkdCandidate.getBoundingClientRect();
    if (dkdRect.top < 0 || dkdRect.top > 230 || dkdRect.width < 70) continue;
    const dkdValue = dkdV3219Normalize(dkdCandidate.textContent);
    if (!dkdValue || dkdValue === 'kurye paneli' || dkdValue.includes('draborngate')) continue;
    if (/^(menu|bildirim|kurye|yeni|gecislerim|hareket)$/.test(dkdValue)) continue;
    dkdCandidate.textContent = 'Kurye Paneli';
    break;
  }
}

function dkdV3219SiteOptions(dkdSite) {
  return [...dkdSite.options]
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
    .map((dkdOption) => ({ value: dkdOption.value, label: dkdOption.textContent.trim() }));
}

function dkdV3219RenderSiteResults(dkdPicker, dkdSite) {
  const dkdInput = dkdPicker.querySelector('input');
  const dkdResults = dkdPicker.querySelector('.dkd-v3219-site-results');
  if (!dkdInput || !dkdResults) return;
  const dkdQuery = dkdV3219Normalize(dkdInput.value);
  if (dkdQuery.length < 2 || dkdV3219State.siteValue) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
    return;
  }
  const dkdOptions = dkdV3219SiteOptions(dkdSite)
    .filter((dkdOption) => dkdV3219Normalize(dkdOption.label).includes(dkdQuery))
    .slice(0, 20);
  dkdResults.hidden = false;
  dkdResults.innerHTML = dkdOptions.length
    ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v3219-site="${encodeURIComponent(dkdOption.value)}"><span>${dkdV3219Icon('building')}</span><strong>${dkdV3219Escape(dkdOption.label)}</strong><i>Seç</i></button>`).join('')
    : '<div class="dkd-v3219-site-empty">Bu adla eşleşen aktif site bulunamadı.</div>';
}

function dkdV3219GateOptions(dkdGate) {
  return [...dkdGate.options]
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
    .map((dkdOption) => ({ value: dkdOption.value, label: dkdOption.textContent.trim() }));
}

function dkdV3219ResetGateForSite(dkdSiteValue) {
  const dkdGate = dkdV3219GateSelect();
  dkdV3219State.gateLoadToken += 1;
  dkdV3219State.gateSiteValue = dkdSiteValue;
  dkdV3219State.gateValue = '';
  dkdV3219State.gateReady = false;
  if (!(dkdGate instanceof HTMLSelectElement)) return;
  const dkdPlaceholder = [...dkdGate.options].find((dkdOption) => !dkdOption.value)?.cloneNode(true);
  dkdGate.innerHTML = '';
  dkdGate.appendChild(dkdPlaceholder || new Option('Kapı seçin', ''));
  dkdV3219NativeSet(dkdGate, '', false);
  dkdGate.disabled = true;
}

function dkdV3219DispatchSite(dkdSite) {
  if (!(dkdSite instanceof HTMLSelectElement) || !dkdSite.value) return;
  dkdSite.dispatchEvent(new Event('input', { bubbles: true }));
  dkdSite.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV3219WaitForSelectedSiteGates(dkdSiteValue) {
  const dkdToken = ++dkdV3219State.gateLoadToken;
  let dkdAttempts = 0;
  const dkdPoll = () => {
    if (dkdToken !== dkdV3219State.gateLoadToken) return;
    const dkdSite = dkdV3219SiteSelect();
    const dkdGate = dkdV3219GateSelect();
    if (!(dkdSite instanceof HTMLSelectElement) || !(dkdGate instanceof HTMLSelectElement)) return;
    if (String(dkdSite.value || '') !== dkdSiteValue) return;
    const dkdOptions = dkdV3219GateOptions(dkdGate);
    if (dkdOptions.length > 0) {
      dkdV3219State.gateSiteValue = dkdSiteValue;
      dkdV3219State.gateReady = true;
      dkdGate.disabled = false;
      dkdV3219QueuePatch();
      return;
    }
    dkdAttempts += 1;
    if (dkdAttempts <= 10) {
      if (dkdAttempts === 1 || dkdAttempts === 4 || dkdAttempts === 7) dkdV3219DispatchSite(dkdSite);
      setTimeout(dkdPoll, 120 + dkdAttempts * 90);
      return;
    }
    dkdV3219State.gateReady = false;
    dkdGate.disabled = true;
    dkdV3219QueuePatch();
  };
  setTimeout(dkdPoll, 80);
}

function dkdV3219SelectSite(dkdSite, dkdValue, dkdLabel) {
  dkdV3219State.siteValue = dkdValue;
  dkdV3219State.siteLabel = dkdLabel;
  dkdV3219NativeSet(dkdSite, dkdValue, false);
  dkdV3219ResetGateForSite(dkdValue);
  dkdV3219DispatchSite(dkdSite);
  dkdV3219WaitForSelectedSiteGates(dkdValue);
}

function dkdV3219ClearSite(dkdPicker, dkdSite) {
  dkdV3219State.siteValue = '';
  dkdV3219State.siteLabel = '';
  dkdV3219NativeSet(dkdSite, '', true);
  dkdV3219ResetGateForSite('');
  const dkdInput = dkdPicker.querySelector('input');
  const dkdResults = dkdPicker.querySelector('.dkd-v3219-site-results');
  const dkdClear = dkdPicker.querySelector('.dkd-v3219-site-clear');
  if (dkdInput) dkdInput.value = '';
  if (dkdResults) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
  }
  if (dkdClear) dkdClear.hidden = true;
  dkdPicker.classList.remove('selected');
  dkdV3219QueuePatch();
}

function dkdV3219MountSitePicker() {
  if (!dkdV3219IsNewPassPage()) {
    dkdV3219State.pageActive = false;
    dkdV3219State.siteInitialized = false;
    dkdV3219State.siteValue = '';
    dkdV3219State.siteLabel = '';
    return;
  }
  dkdV3219State.pageActive = true;
  const dkdSite = dkdV3219SiteSelect();
  if (!(dkdSite instanceof HTMLSelectElement)) return;
  dkdSite.dataset.dkdV3219Site = 'true';
  const dkdHost = dkdSite.parentElement;
  if (!dkdHost) return;
  dkdHost.classList.add('dkd-v3219-site-host');
  dkdSite.classList.add('dkd-v3219-native-site');
  for (const dkdOld of dkdHost.querySelectorAll('.dkd-v23-site-search,.dkd-v324-site-search,.dkd-v328-site-picker,.dkd-v3210-site-picker,.dkd-v3218-site-picker')) dkdOld.remove();

  if (!dkdV3219State.siteInitialized) {
    dkdV3219State.siteInitialized = true;
    dkdV3219State.siteValue = '';
    dkdV3219State.siteLabel = '';
    dkdV3219NativeSet(dkdSite, '', true);
    dkdV3219ResetGateForSite('');
  }

  let dkdPicker = dkdHost.querySelector(':scope > .dkd-v3219-site-picker');
  if (!dkdPicker) {
    dkdPicker = document.createElement('div');
    dkdPicker.className = 'dkd-v3219-site-picker';
    dkdPicker.innerHTML = `<div class="dkd-v3219-site-row"><span>${dkdV3219Icon('search')}</span><input type="search" autocomplete="off" inputmode="search" placeholder="Site Adı Yaz" aria-label="Site Adı Yaz"><button type="button" class="dkd-v3219-site-clear" aria-label="Site seçimini temizle" hidden>${dkdV3219Icon('close')}</button></div><div class="dkd-v3219-site-help">Varsayılan seçim yapılmaz; en az iki harf yazarak siteyi bulun.</div><div class="dkd-v3219-site-results" hidden></div>`;
    dkdHost.insertBefore(dkdPicker, dkdSite);
    const dkdInput = dkdPicker.querySelector('input');
    const dkdResults = dkdPicker.querySelector('.dkd-v3219-site-results');
    const dkdClear = dkdPicker.querySelector('.dkd-v3219-site-clear');
    dkdInput?.addEventListener('input', () => {
      if (dkdV3219State.siteValue && dkdInput.value !== dkdV3219State.siteLabel) dkdV3219ClearSite(dkdPicker, dkdSite);
      dkdV3219RenderSiteResults(dkdPicker, dkdSite);
    });
    dkdInput?.addEventListener('focus', () => dkdV3219RenderSiteResults(dkdPicker, dkdSite));
    dkdClear?.addEventListener('click', () => {
      dkdV3219ClearSite(dkdPicker, dkdSite);
      dkdInput?.focus();
    });
    dkdResults?.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target instanceof Element ? dkdEvent.target.closest('[data-dkd-v3219-site]') : null;
      if (!dkdButton) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV3219Site || '');
      const dkdOption = [...dkdSite.options].find((dkdItem) => dkdItem.value === dkdValue);
      if (!dkdOption) return;
      const dkdLabel = dkdOption.textContent.trim();
      dkdV3219SelectSite(dkdSite, dkdValue, dkdLabel);
      if (dkdInput) dkdInput.value = dkdLabel;
      if (dkdResults) {
        dkdResults.hidden = true;
        dkdResults.innerHTML = '';
      }
      if (dkdClear) dkdClear.hidden = false;
      dkdPicker.classList.add('selected');
    });
  }

  if (dkdV3219State.siteValue) {
    if (dkdSite.value !== dkdV3219State.siteValue) {
      dkdV3219NativeSet(dkdSite, dkdV3219State.siteValue, false);
      dkdV3219ResetGateForSite(dkdV3219State.siteValue);
      dkdV3219DispatchSite(dkdSite);
      dkdV3219WaitForSelectedSiteGates(dkdV3219State.siteValue);
    }
    const dkdInput = dkdPicker.querySelector('input');
    if (dkdInput) dkdInput.value = dkdV3219State.siteLabel;
    const dkdClear = dkdPicker.querySelector('.dkd-v3219-site-clear');
    if (dkdClear) dkdClear.hidden = false;
    dkdPicker.classList.add('selected');
  }
}

function dkdV3219RenderGatePicker(dkdPicker, dkdGate) {
  const dkdButton = dkdPicker.querySelector('.dkd-v3219-gate-button');
  const dkdLabel = dkdButton?.querySelector('strong');
  const dkdList = dkdPicker.querySelector('.dkd-v3219-gate-list');
  const dkdOptions = dkdV3219State.gateReady && dkdV3219State.gateSiteValue === dkdV3219State.siteValue
    ? dkdV3219GateOptions(dkdGate)
    : [];
  const dkdCurrent = dkdOptions.find((dkdOption) => dkdOption.value === dkdGate.value);
  if (dkdLabel) {
    dkdLabel.textContent = !dkdV3219State.siteValue
      ? 'Önce Site Seçin'
      : dkdOptions.length === 0
        ? 'Kapı bilgileri yükleniyor…'
        : dkdCurrent?.label || 'Kapı Seç';
  }
  if (dkdButton) {
    dkdButton.disabled = !dkdV3219State.siteValue || dkdOptions.length === 0;
    dkdButton.setAttribute('aria-expanded', String(dkdPicker.classList.contains('open')));
  }
  if (dkdList) {
    dkdList.innerHTML = dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v3219-gate="${encodeURIComponent(dkdOption.value)}" class="${dkdOption.value === dkdGate.value ? 'selected' : ''}"><span>${dkdV3219Escape(dkdOption.label)}</span>${dkdOption.value === dkdGate.value ? dkdV3219Icon('check') : ''}</button>`).join('');
  }
}

function dkdV3219MountGatePicker() {
  if (!dkdV3219IsNewPassPage()) return;
  const dkdGate = dkdV3219GateSelect();
  if (!(dkdGate instanceof HTMLSelectElement)) return;
  dkdGate.dataset.dkdV3219Gate = 'true';
  const dkdNativeHost = dkdGate.parentElement;
  const dkdField = dkdNativeHost?.parentElement;
  if (!dkdNativeHost || !dkdField) return;
  dkdNativeHost.classList.add('dkd-v3219-native-gate-host');
  dkdNativeHost.setAttribute('aria-hidden', 'true');
  dkdGate.classList.add('dkd-v3219-native-gate');

  for (const dkdOld of dkdField.querySelectorAll('.dkd-v3218-gate-picker,.dkd-v3217-gate-picker')) dkdOld.remove();
  let dkdPicker = dkdField.querySelector(':scope > .dkd-v3219-gate-picker');
  if (!dkdPicker) {
    dkdPicker = document.createElement('div');
    dkdPicker.className = 'dkd-v3219-gate-picker';
    dkdPicker.innerHTML = `<button type="button" class="dkd-v3219-gate-button" aria-expanded="false"><span>${dkdV3219Icon('shield')}</span><strong>Önce Site Seçin</strong><i>${dkdV3219Icon('chevron')}</i></button><div class="dkd-v3219-gate-list"></div>`;
    dkdNativeHost.insertAdjacentElement('afterend', dkdPicker);
    dkdPicker.querySelector('.dkd-v3219-gate-button')?.addEventListener('click', () => {
      if (!dkdV3219State.gateReady) return;
      dkdPicker.classList.toggle('open');
      dkdV3219RenderGatePicker(dkdPicker, dkdGate);
    });
    dkdPicker.querySelector('.dkd-v3219-gate-list')?.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target instanceof Element ? dkdEvent.target.closest('[data-dkd-v3219-gate]') : null;
      if (!dkdButton || dkdV3219State.gateSiteValue !== dkdV3219State.siteValue) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV3219Gate || '');
      if (!dkdV3219GateOptions(dkdGate).some((dkdOption) => dkdOption.value === dkdValue)) return;
      dkdV3219State.gateValue = dkdValue;
      dkdV3219NativeSet(dkdGate, dkdValue, true);
      dkdPicker.classList.remove('open');
      dkdV3219RenderGatePicker(dkdPicker, dkdGate);
    });
  }

  if (dkdV3219State.siteValue && dkdV3219GateOptions(dkdGate).length === 0 && dkdV3219State.gateReady) {
    dkdV3219State.gateReady = false;
    dkdV3219WaitForSelectedSiteGates(dkdV3219State.siteValue);
  }
  if (dkdV3219State.gateReady && dkdV3219State.gateValue && dkdV3219GateOptions(dkdGate).some((dkdOption) => dkdOption.value === dkdV3219State.gateValue)) {
    if (dkdGate.value !== dkdV3219State.gateValue) dkdV3219NativeSet(dkdGate, dkdV3219State.gateValue, false);
  }
  dkdV3219RenderGatePicker(dkdPicker, dkdGate);
}

function dkdV3219PatchVersionText() {
  const dkdPattern = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3(?:\.\d+){1,2})\b/gi;
  for (const dkdNode of document.querySelectorAll('small,strong,span,p,h1,h2,h3')) {
    const dkdText = String(dkdNode.textContent || '');
    if (!/(?:draborngate|\bweb\s*v)/i.test(dkdText)) continue;
    dkdNode.textContent = dkdText.replace(dkdPattern, (dkdMatch) => /draborngate\s+web/i.test(dkdMatch) ? `DraBornGate Web v${DKD_V3219_VERSION}` : `v${DKD_V3219_VERSION}`);
  }
}

function dkdV3219Patch() {
  dkdV3219State.patchQueued = false;
  dkdV3219EnsureSingleEarnings();
  dkdV3219PatchCourierHeader();
  dkdV3219MountSitePicker();
  dkdV3219MountGatePicker();
  dkdV3219PatchVersionText();
  document.documentElement.dataset.dkdGateVersion = DKD_V3219_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3219_VERSION);
}

function dkdV3219QueuePatch() {
  if (dkdV3219State.patchQueued) return;
  dkdV3219State.patchQueued = true;
  requestAnimationFrame(dkdV3219Patch);
}

document.addEventListener('click', (dkdEvent) => {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget?.closest('.dkd-v3219-gate-picker')) document.querySelector('.dkd-v3219-gate-picker.open')?.classList.remove('open');
}, false);

new MutationObserver(dkdV3219QueuePatch).observe(document.body, { childList: true, subtree: true });
window.addEventListener('pageshow', dkdV3219QueuePatch);
window.addEventListener('popstate', dkdV3219QueuePatch);

dkdV3219Patch();
setTimeout(dkdV3219Patch, 120);
setTimeout(dkdV3219Patch, 600);
window.__DKD_GATE_V3219_UI__ = true;
