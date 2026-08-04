const DKD_V3210_VERSION = '3.2.10';
const dkdV3210SiteState = {
  selectedValue: '',
  selectedLabel: '',
  applying: false,
  initialized: false,
  pageActive: false,
  patchQueued: false,
};

function dkdV3210Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3210Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV3210Icon(dkdName) {
  const dkdIcons = {
    building: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" stroke="currentColor" stroke-width="1.8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV3210FindSelectByLabel(dkdLabelText) {
  const dkdTarget = dkdV3210Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
    .filter((dkdElement) => dkdV3210Normalize(dkdElement.textContent) === dkdTarget);
  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) return dkdSelect;
    }
  }
  return null;
}

function dkdV3210IsSitePage() {
  const dkdText = dkdV3210Normalize(document.body?.innerText || '');
  return dkdText.includes('yeni kurye gecisi') && dkdText.includes('siparis numarasi');
}

function dkdV3210InstallSelectionGuards() {
  if (window.__DKD_GATE_V3210_SELECT_GUARD_INSTALLED__) return;
  window.__DKD_GATE_V3210_SELECT_GUARD_INSTALLED__ = true;
  const dkdSelectDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const dkdOptionDescriptor = Object.getOwnPropertyDescriptor(HTMLOptionElement.prototype, 'selected');
  if (dkdSelectDescriptor?.get && dkdSelectDescriptor?.set) {
    Object.defineProperty(HTMLSelectElement.prototype, 'value', {
      configurable: dkdSelectDescriptor.configurable,
      enumerable: dkdSelectDescriptor.enumerable,
      get: dkdSelectDescriptor.get,
      set(dkdValue) {
        const dkdGuard = window.__DKD_GATE_V3210_SITE_GUARD__;
        if (dkdGuard?.shouldBlockSelect?.(this, dkdValue)) return;
        dkdSelectDescriptor.set.call(this, dkdValue);
      },
    });
  }
  if (dkdOptionDescriptor?.get && dkdOptionDescriptor?.set) {
    Object.defineProperty(HTMLOptionElement.prototype, 'selected', {
      configurable: dkdOptionDescriptor.configurable,
      enumerable: dkdOptionDescriptor.enumerable,
      get: dkdOptionDescriptor.get,
      set(dkdValue) {
        const dkdGuard = window.__DKD_GATE_V3210_SITE_GUARD__;
        if (dkdGuard?.shouldBlockOption?.(this, dkdValue)) return;
        dkdOptionDescriptor.set.call(this, dkdValue);
      },
    });
  }
}

window.__DKD_GATE_V3210_SITE_GUARD__ = {
  shouldBlockSelect(dkdSelect, dkdValue) {
    return dkdSelect?.dataset?.dkdV3210SiteSelect === 'true'
      && Boolean(dkdV3210SiteState.selectedValue)
      && !dkdV3210SiteState.applying
      && String(dkdValue) !== dkdV3210SiteState.selectedValue;
  },
  shouldBlockOption(dkdOption, dkdSelected) {
    const dkdSelect = dkdOption?.parentElement;
    if (dkdSelect?.dataset?.dkdV3210SiteSelect !== 'true' || !dkdV3210SiteState.selectedValue || dkdV3210SiteState.applying) return false;
    if (dkdOption.value === dkdV3210SiteState.selectedValue && dkdSelected === false) return true;
    return dkdOption.value !== dkdV3210SiteState.selectedValue && dkdSelected === true;
  },
};

dkdV3210InstallSelectionGuards();

function dkdV3210ApplySelect(dkdSelect, dkdValue, dkdDispatch = true) {
  if (!dkdSelect) return;
  dkdV3210SiteState.applying = true;
  try {
    const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
    else dkdSelect.value = dkdValue;
    for (const dkdOption of dkdSelect.options) dkdOption.selected = dkdOption.value === dkdValue;
    if (dkdDispatch) {
      dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
      dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } finally {
    queueMicrotask(() => {
      dkdV3210SiteState.applying = false;
    });
  }
}

function dkdV3210GateSelect() {
  return dkdV3210FindSelectByLabel('Kapı') || dkdV3210FindSelectByLabel('Kapi');
}

function dkdV3210SyncGate(dkdEnabled) {
  const dkdGate = dkdV3210GateSelect();
  if (!dkdGate) return;
  if (!dkdEnabled) dkdV3210ApplySelect(dkdGate, '', true);
  dkdGate.disabled = !dkdEnabled;
}

function dkdV3210RenderSiteResults(dkdPicker, dkdSelect) {
  const dkdInput = dkdPicker.querySelector('input');
  const dkdResults = dkdPicker.querySelector('.dkd-v3210-site-results');
  const dkdQuery = dkdV3210Normalize(dkdInput?.value || '');
  if (!dkdResults) return;
  if (dkdQuery.length < 2) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
    return;
  }
  const dkdOptions = [...dkdSelect.options]
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
    .map((dkdOption) => ({ value: dkdOption.value, label: dkdOption.textContent.trim() }))
    .filter((dkdOption) => dkdV3210Normalize(dkdOption.label).includes(dkdQuery))
    .slice(0, 20);
  dkdResults.hidden = false;
  dkdResults.innerHTML = dkdOptions.length
    ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v3210-site="${encodeURIComponent(dkdOption.value)}"><span>${dkdV3210Icon('building')}</span><strong>${dkdV3210Escape(dkdOption.label)}</strong><i>${dkdV3210Icon('check')} Seç</i></button>`).join('')
    : '<div class="dkd-v3210-site-empty">Aramanızla eşleşen aktif site bulunamadı.</div>';
}

function dkdV3210ClearSite(dkdPicker, dkdSelect) {
  dkdV3210SiteState.selectedValue = '';
  dkdV3210SiteState.selectedLabel = '';
  dkdV3210ApplySelect(dkdSelect, '', true);
  dkdV3210SyncGate(false);
  const dkdInput = dkdPicker.querySelector('input');
  const dkdResults = dkdPicker.querySelector('.dkd-v3210-site-results');
  const dkdClear = dkdPicker.querySelector('.dkd-v3210-site-clear');
  if (dkdInput) dkdInput.value = '';
  if (dkdResults) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
  }
  if (dkdClear) dkdClear.hidden = true;
  dkdPicker.classList.remove('selected');
}

function dkdV3210MountSitePicker() {
  if (!dkdV3210IsSitePage()) {
    dkdV3210SiteState.pageActive = false;
    dkdV3210SiteState.initialized = false;
    dkdV3210SiteState.selectedValue = '';
    dkdV3210SiteState.selectedLabel = '';
    return false;
  }
  dkdV3210SiteState.pageActive = true;
  const dkdSelect = dkdV3210FindSelectByLabel('Site');
  if (!dkdSelect) return false;
  dkdSelect.dataset.dkdV3210SiteSelect = 'true';
  const dkdHost = dkdSelect.parentElement;
  if (!dkdHost) return false;
  dkdHost.classList.add('dkd-v3210-site-host');

  if (!dkdV3210SiteState.initialized) {
    dkdV3210SiteState.initialized = true;
    dkdV3210SiteState.selectedValue = '';
    dkdV3210SiteState.selectedLabel = '';
    dkdV3210ApplySelect(dkdSelect, '', true);
    dkdV3210SyncGate(false);
  }

  let dkdPicker = dkdHost.querySelector(':scope > .dkd-v3210-site-picker');
  if (!dkdPicker) {
    dkdPicker = document.createElement('div');
    dkdPicker.className = 'dkd-v3210-site-picker';
    dkdPicker.innerHTML = `<div class="dkd-v3210-site-row"><span>${dkdV3210Icon('search')}</span><input type="search" autocomplete="off" inputmode="search" placeholder="Site adı veya şehir yazarak ara" aria-label="Site ara"><button type="button" class="dkd-v3210-site-clear" aria-label="Site seçimini temizle" hidden>${dkdV3210Icon('close')}</button></div><div class="dkd-v3210-site-help">Varsayılan seçim yapılmaz; en az iki harf yazarak siteyi bulun.</div><div class="dkd-v3210-site-results" hidden></div>`;
    dkdHost.insertBefore(dkdPicker, dkdSelect);
    const dkdInput = dkdPicker.querySelector('input');
    const dkdResults = dkdPicker.querySelector('.dkd-v3210-site-results');
    const dkdClear = dkdPicker.querySelector('.dkd-v3210-site-clear');
    dkdInput?.addEventListener('input', () => {
      if (dkdV3210SiteState.selectedValue && dkdInput.value !== dkdV3210SiteState.selectedLabel) dkdV3210ClearSite(dkdPicker, dkdSelect);
      dkdV3210RenderSiteResults(dkdPicker, dkdSelect);
    });
    dkdInput?.addEventListener('focus', () => dkdV3210RenderSiteResults(dkdPicker, dkdSelect));
    dkdInput?.addEventListener('keydown', (dkdEvent) => {
      if (dkdEvent.key === 'Escape' && dkdResults) dkdResults.hidden = true;
    });
    dkdClear?.addEventListener('click', () => {
      dkdV3210ClearSite(dkdPicker, dkdSelect);
      dkdInput?.focus();
    });
    dkdResults?.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target instanceof Element ? dkdEvent.target.closest('[data-dkd-v3210-site]') : null;
      if (!dkdButton) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV3210Site || '');
      const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdValue);
      if (!dkdOption) return;
      dkdV3210SiteState.selectedValue = dkdOption.value;
      dkdV3210SiteState.selectedLabel = dkdOption.textContent.trim();
      dkdV3210ApplySelect(dkdSelect, dkdV3210SiteState.selectedValue, true);
      dkdV3210SyncGate(true);
      if (dkdInput) dkdInput.value = dkdV3210SiteState.selectedLabel;
      if (dkdResults) {
        dkdResults.hidden = true;
        dkdResults.innerHTML = '';
      }
      if (dkdClear) dkdClear.hidden = false;
      dkdPicker.classList.add('selected');
      dkdHost.dataset.dkdV3210Stable = 'true';
    });
  }

  if (dkdV3210SiteState.selectedValue) {
    if (dkdSelect.value !== dkdV3210SiteState.selectedValue) dkdV3210ApplySelect(dkdSelect, dkdV3210SiteState.selectedValue, false);
    const dkdInput = dkdPicker.querySelector('input');
    if (dkdInput && dkdInput.value !== dkdV3210SiteState.selectedLabel) dkdInput.value = dkdV3210SiteState.selectedLabel;
    const dkdClear = dkdPicker.querySelector('.dkd-v3210-site-clear');
    if (dkdClear) dkdClear.hidden = false;
    dkdPicker.classList.add('selected');
    dkdV3210SyncGate(true);
  }
  return true;
}

function dkdV3210InterceptOldSiteEvents(dkdEvent) {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget) return;
  const dkdOldWidget = dkdTarget.closest('.dkd-v23-site-search,.dkd-v324-site-search,.dkd-v328-site-picker');
  if (dkdOldWidget) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    return;
  }
  const dkdSiteSelect = dkdTarget.matches('select[data-dkd-v3210-site-select="true"]') ? dkdTarget : null;
  if (dkdSiteSelect && dkdV3210SiteState.selectedValue && !dkdV3210SiteState.applying) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    if (dkdSiteSelect.value !== dkdV3210SiteState.selectedValue) dkdV3210ApplySelect(dkdSiteSelect, dkdV3210SiteState.selectedValue, false);
  }
}

document.addEventListener('input', dkdV3210InterceptOldSiteEvents, true);
document.addEventListener('change', dkdV3210InterceptOldSiteEvents, true);
document.addEventListener('click', dkdV3210InterceptOldSiteEvents, true);

function dkdV3210RemoveDuplicateEarnings() {
  const dkdItems = [...new Set([...document.querySelectorAll('button,a,[role="button"],li')]
    .filter((dkdElement) => dkdV3210Normalize(dkdElement.textContent) === 'kazanclarim'))];
  if (dkdItems.length < 2) return;
  const dkdPreferred = dkdItems.find((dkdItem) => dkdItem.classList.contains('dkd-v328-earnings-menu') || dkdItem.querySelector('.dkd-v328-earnings-menu'));
  const dkdIsGreen = (dkdItem) => {
    const dkdIcon = dkdItem.querySelector('svg,i,span') || dkdItem;
    const dkdColor = getComputedStyle(dkdIcon).color.match(/\d+/g)?.map(Number) || [];
    return dkdColor.length >= 3 && dkdColor[1] > dkdColor[0] * 1.18 && dkdColor[1] > dkdColor[2] * 1.08;
  };
  const dkdKeep = dkdPreferred || dkdItems.find((dkdItem) => !dkdIsGreen(dkdItem)) || dkdItems.at(-1);
  for (const dkdItem of dkdItems) {
    if (dkdItem !== dkdKeep) dkdItem.remove();
  }
}

function dkdV3210Patch() {
  dkdV3210SiteState.patchQueued = false;
  dkdV3210MountSitePicker();
  dkdV3210RemoveDuplicateEarnings();
  document.documentElement.dataset.dkdGateVersion = DKD_V3210_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3210_VERSION);
}

function dkdV3210QueuePatch() {
  if (dkdV3210SiteState.patchQueued) return;
  dkdV3210SiteState.patchQueued = true;
  requestAnimationFrame(dkdV3210Patch);
}

new MutationObserver(dkdV3210QueuePatch).observe(document.body, { childList: true, subtree: true });
dkdV3210Patch();
