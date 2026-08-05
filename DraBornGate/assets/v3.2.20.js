const DKD_V3220_VERSION = '3.2.20';
let dkdV3220PatchQueued = false;

function dkdV3220Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3220IsEarningsLabel(dkdValue) {
  const dkdNormalized = dkdV3220Normalize(dkdValue);
  return dkdNormalized === 'kazancim' || dkdNormalized === 'kazanclarim';
}

function dkdV3220PatchEarningsMenu() {
  for (const dkdItem of [...document.querySelectorAll('button,a,[role="button"],li,article')]) {
    if (dkdItem.classList.contains('dkd-v3219-earnings-menu') || dkdItem.classList.contains('dkd-v3220-earnings-menu')) continue;
    if (dkdItem.closest('#dkd-v3211-earnings,#dkd-v328-modal')) continue;
    if (dkdV3220IsEarningsLabel(dkdItem.textContent)) dkdItem.remove();
  }

  const dkdMenus = [...document.querySelectorAll('.dkd-v3219-earnings-menu,.dkd-v3220-earnings-menu')];
  const dkdMenu = dkdMenus.shift();
  for (const dkdDuplicate of dkdMenus) dkdDuplicate.remove();
  if (!dkdMenu) return;

  dkdMenu.classList.add('dkd-v3220-earnings-menu');
  dkdMenu.dataset.dkdV3220Earnings = 'true';
  dkdMenu.setAttribute('aria-label', 'Kazançlarım sayfasını aç');
  dkdMenu.title = 'Kazançlarım';

  const dkdTitle = dkdMenu.querySelector('strong');
  if (dkdTitle) dkdTitle.textContent = 'Kazançlarım';
}

function dkdV3220PatchPassPage() {
  const dkdPageText = dkdV3220Normalize(document.body?.innerText || '');
  const dkdIsPasses = dkdPageText.includes('gecislerim')
    && dkdPageText.includes('aktif ve gecmis tum kurye gecis taleplerini');
  document.documentElement.classList.toggle('dkd-v3220-passes-page', dkdIsPasses);
}

function dkdV3220PatchVersion() {
  document.documentElement.dataset.dkdGateVersion = DKD_V3220_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3220_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', '3.2.20-single-earnings-color-small-moto1');
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3220_VERSION;
}

function dkdV3220Patch() {
  dkdV3220PatchQueued = false;
  dkdV3220PatchEarningsMenu();
  dkdV3220PatchPassPage();
  dkdV3220PatchVersion();
  window.dkdV3220Cleanup?.();
}

function dkdV3220QueuePatch() {
  if (dkdV3220PatchQueued) return;
  dkdV3220PatchQueued = true;
  requestAnimationFrame(dkdV3220Patch);
}

new MutationObserver(dkdV3220QueuePatch).observe(document.body, { childList: true, subtree: true });
window.addEventListener('pageshow', dkdV3220QueuePatch);
window.addEventListener('popstate', dkdV3220QueuePatch);

dkdV3220Patch();
setTimeout(dkdV3220Patch, 140);
setTimeout(dkdV3220Patch, 700);
window.__DKD_GATE_V3220_UI__ = true;
