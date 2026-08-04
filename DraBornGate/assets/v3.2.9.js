const DKD_V329_VERSION = '3.2.9';

function dkdV329Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV329FindSelectByLabel(dkdLabelText) {
  const dkdTarget = dkdV329Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
    .filter((dkdElement) => dkdV329Normalize(dkdElement.textContent) === dkdTarget);
  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) return dkdSelect;
    }
  }
  return null;
}

function dkdV329SetNativeSelect(dkdSelect, dkdValue) {
  if (!dkdSelect) return;
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  [...dkdSelect.options].forEach((dkdOption) => {
    dkdOption.selected = dkdOption.value === dkdValue;
  });
  dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
  dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV329IsLegacySiteInput(dkdTarget) {
  return dkdTarget instanceof HTMLInputElement
    && Boolean(dkdTarget.closest('.dkd-v23-site-search,.dkd-v324-site-search'));
}

function dkdV329InterceptLegacyInput(dkdEvent) {
  if (dkdEvent.isTrusted || !dkdV329IsLegacySiteInput(dkdEvent.target)) return;
  const dkdHost = dkdEvent.target.closest('.dkd-v328-site-host') || dkdEvent.target.parentElement?.parentElement;
  const dkdSelect = dkdHost?.querySelector('select.dkd-v328-native-site') || dkdV329FindSelectByLabel('Site');
  dkdEvent.preventDefault();
  dkdEvent.stopImmediatePropagation();
  if (!String(dkdEvent.target.value || '').trim()) dkdV329SetNativeSelect(dkdSelect, '');
}

function dkdV329InterceptLegacyButton(dkdEvent) {
  const dkdButton = dkdEvent.target instanceof Element ? dkdEvent.target.closest('[data-dkd-site]') : null;
  if (dkdEvent.isTrusted || !dkdButton || !dkdButton.closest('.dkd-v23-site-search,.dkd-v324-site-search')) return;
  const dkdHost = dkdButton.closest('.dkd-v328-site-host') || dkdButton.parentElement?.parentElement;
  const dkdSelect = dkdHost?.querySelector('select.dkd-v328-native-site') || dkdV329FindSelectByLabel('Site');
  let dkdValue = '';
  try {
    dkdValue = decodeURIComponent(dkdButton.dataset.dkdSite || '');
  } catch {
    dkdValue = dkdButton.dataset.dkdSite || '';
  }
  dkdEvent.preventDefault();
  dkdEvent.stopImmediatePropagation();
  if (dkdValue) {
    dkdV329SetNativeSelect(dkdSelect, dkdValue);
    dkdSelect?.closest('.dkd-v328-site-host')?.setAttribute('data-dkd-v329-stable', 'true');
  }
}

function dkdV329PatchCourierTitle() {
  const dkdText = dkdV329Normalize(document.body?.innerText || '');
  if (!dkdText.includes('yeni kurye gecisi') && !dkdText.includes('kurye operasyonu')) return;
  for (const dkdCandidate of document.querySelectorAll('header h1,header h2,header h3,header strong,[class*="topbar"] strong,[class*="header"] strong')) {
    const dkdRect = dkdCandidate.getBoundingClientRect();
    if (dkdRect.top < 0 || dkdRect.top > 230 || dkdRect.width < 70) continue;
    const dkdValue = dkdV329Normalize(dkdCandidate.textContent);
    if (!dkdValue || dkdValue === 'kurye paneli' || dkdValue.includes('draborngate')) continue;
    if (/^(menu|bildirim|kurye|yeni|gecislerim|hareket)$/.test(dkdValue)) continue;
    dkdCandidate.textContent = 'Kurye Paneli';
    break;
  }
}

document.addEventListener('input', dkdV329InterceptLegacyInput, true);
document.addEventListener('click', dkdV329InterceptLegacyButton, true);

let dkdV329PatchQueued = false;
function dkdV329QueuePatch() {
  if (dkdV329PatchQueued) return;
  dkdV329PatchQueued = true;
  requestAnimationFrame(() => {
    dkdV329PatchQueued = false;
    dkdV329PatchCourierTitle();
  });
}

new MutationObserver(dkdV329QueuePatch).observe(document.body, { childList: true, subtree: true });
dkdV329PatchCourierTitle();
document.documentElement.dataset.dkdGateVersion = DKD_V329_VERSION;
sessionStorage.setItem('dkd_gate_web_version', DKD_V329_VERSION);
