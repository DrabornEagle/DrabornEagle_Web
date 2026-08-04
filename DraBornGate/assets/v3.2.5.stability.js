const DKD_V325_STABILITY_VERSION = '3.2.5';
const dkdV325StabilityState = { allowUserClearUntil: 0 };

function dkdV325StabilityNormalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV325IsNewPassScreen() {
  const dkdText = dkdV325StabilityNormalize(document.body?.innerText || '');
  return (dkdText.includes('yeni kurye gecisi') || dkdText.includes('yeni gecis talebi')) && dkdText.includes('site');
}

function dkdV325IsSiteSelect(dkdSelect) {
  if (!(dkdSelect instanceof HTMLSelectElement)) return false;
  let dkdScope = dkdSelect.parentElement;
  for (let dkdDepth = 0; dkdScope && dkdDepth < 6; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
    const dkdLabels = [...dkdScope.querySelectorAll(':scope > label,:scope > span,:scope > strong')];
    if (dkdLabels.some((dkdLabel) => dkdV325StabilityNormalize(dkdLabel.textContent) === 'site')) return true;
  }
  return false;
}

function dkdV325RememberUserSearch(dkdEvent) {
  if (!dkdEvent.isTrusted) return;
  const dkdInput = dkdEvent.target;
  if (!(dkdInput instanceof HTMLInputElement) || dkdInput.type !== 'search') return;
  if (!dkdInput.closest('.dkd-v23-site-search,.dkd-v324-site-search')) return;
  dkdV325StabilityState.allowUserClearUntil = performance.now() + 180;
}

function dkdV325StopAutomaticEmptyDispatch(dkdEvent) {
  if (dkdEvent.isTrusted || !dkdV325IsNewPassScreen()) return;
  const dkdSelect = dkdEvent.target;
  if (!dkdV325IsSiteSelect(dkdSelect) || dkdSelect.value) return;
  if (performance.now() <= dkdV325StabilityState.allowUserClearUntil) return;
  dkdEvent.preventDefault();
  dkdEvent.stopPropagation();
  dkdEvent.stopImmediatePropagation();
}

document.addEventListener('input', dkdV325RememberUserSearch, true);
document.addEventListener('input', dkdV325StopAutomaticEmptyDispatch, true);
document.addEventListener('change', dkdV325StopAutomaticEmptyDispatch, true);
document.documentElement.dataset.dkdV325Stability = 'true';
sessionStorage.setItem('dkd_gate_web_version', DKD_V325_STABILITY_VERSION);

window.__DKD_GATE_V325_STABILITY__ = {
  version: DKD_V325_STABILITY_VERSION,
  state: dkdV325StabilityState,
};
