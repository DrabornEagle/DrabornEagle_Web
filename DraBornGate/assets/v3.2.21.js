const DKD_V3221_VERSION = '3.2.21';
const DKD_V3221_RELEASE = '3.2.21-earnings-courier-role-link-fix1';
let dkdV3221PatchQueued = false;

function dkdV3221Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3221IsEarningsLabel(dkdValue) {
  const dkdNormalized = dkdV3221Normalize(dkdValue);
  return dkdNormalized === 'kazancim' || dkdNormalized === 'kazanclarim';
}

function dkdV3221PatchEarningsMenu() {
  for (const dkdItem of [...document.querySelectorAll('button,a,[role="button"],li,article')]) {
    if (dkdItem.classList.contains('dkd-v3219-earnings-menu') || dkdItem.classList.contains('dkd-v3220-earnings-menu')) continue;
    if (dkdItem.closest('#dkd-v3211-earnings,#dkd-v328-modal')) continue;
    if (dkdV3221IsEarningsLabel(dkdItem.textContent)) dkdItem.remove();
  }

  const dkdMenus = [...document.querySelectorAll('.dkd-v3219-earnings-menu,.dkd-v3220-earnings-menu')];
  const dkdMenu = dkdMenus.shift();
  for (const dkdDuplicate of dkdMenus) dkdDuplicate.remove();
  if (!dkdMenu) return;

  dkdMenu.classList.add('dkd-v3220-earnings-menu');
  dkdMenu.dataset.dkdV3221Earnings = 'true';
  dkdMenu.setAttribute('aria-label', 'Kazançlarım sayfasını aç');
  dkdMenu.title = 'Kazançlarım';

  const dkdTitle = dkdMenu.querySelector('strong');
  if (dkdTitle) dkdTitle.textContent = 'Kazançlarım';
}

function dkdV3221PatchPassPage() {
  const dkdPageText = dkdV3221Normalize(document.body?.innerText || '');
  const dkdIsPasses = dkdPageText.includes('gecislerim')
    && dkdPageText.includes('aktif ve gecmis tum kurye gecis taleplerini');
  document.documentElement.classList.toggle('dkd-v3220-passes-page', dkdIsPasses);
}

function dkdV3221PatchVersion() {
  document.documentElement.dataset.dkdGateVersion = DKD_V3221_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3221_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', DKD_V3221_RELEASE);
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3221_VERSION;
}

function dkdV3221Patch() {
  dkdV3221PatchQueued = false;
  dkdV3221PatchEarningsMenu();
  dkdV3221PatchPassPage();
  dkdV3221PatchVersion();
  window.dkdV3221Cleanup?.();
}

function dkdV3221QueuePatch() {
  if (dkdV3221PatchQueued) return;
  dkdV3221PatchQueued = true;
  requestAnimationFrame(dkdV3221Patch);
}

new MutationObserver(dkdV3221QueuePatch).observe(document.body, { childList: true, subtree: true });
window.addEventListener('pageshow', dkdV3221QueuePatch);
window.addEventListener('popstate', dkdV3221QueuePatch);

dkdV3221Patch();
setTimeout(dkdV3221Patch, 140);
setTimeout(dkdV3221Patch, 700);
window.__DKD_GATE_V3221_UI__ = true;
