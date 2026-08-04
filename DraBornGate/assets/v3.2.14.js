const DKD_V3214_VERSION = '3.2.14';

function dkdV3214Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3214FindProfileAnchor() {
  return [...document.querySelectorAll('button,a,[role="button"],li')]
    .find((dkdElement) => dkdV3214Normalize(dkdElement.textContent) === 'profil ve baglanti') || null;
}

function dkdV3214KeepSingleEarningsMenu() {
  const dkdOfficialButtons = [...document.querySelectorAll('.dkd-v3211-earnings-menu')];
  const dkdOfficial = dkdOfficialButtons[0] || null;
  for (const dkdExtra of dkdOfficialButtons.slice(1)) dkdExtra.remove();

  const dkdProfileAnchor = dkdV3214FindProfileAnchor();
  if (dkdOfficial && dkdProfileAnchor && dkdOfficial.previousElementSibling !== dkdProfileAnchor) {
    dkdProfileAnchor.insertAdjacentElement('afterend', dkdOfficial);
  }

  const dkdLabels = [...document.querySelectorAll('strong,span,h1,h2,h3,h4,p')]
    .filter((dkdLabel) => dkdV3214Normalize(dkdLabel.textContent) === 'kazanclarim')
    .filter((dkdLabel) => !dkdLabel.closest('#dkd-v3211-earnings,#dkd-v3214-earnings'));

  for (const dkdLabel of dkdLabels) {
    const dkdCandidate = dkdLabel.closest('button,a,[role="button"],li,article,[data-dkd-earnings-menu]') || dkdLabel.parentElement;
    if (!dkdCandidate || dkdCandidate === dkdOfficial || dkdCandidate.closest('.dkd-v3211-earnings-menu')) continue;
    const dkdText = dkdV3214Normalize(dkdCandidate.textContent);
    if (dkdText.includes('kazanclarim') && (dkdText.includes('site kurye') || dkdText.includes('goruntule') || /earnings|kazanc/i.test(String(dkdCandidate.className || '')))) {
      dkdCandidate.remove();
    }
  }
}

function dkdV3214RemoveOldHomeFragments() {
  for (const dkdLabel of [...document.querySelectorAll('strong,span,h1,h2,h3,h4,p')]) {
    if (dkdV3214Normalize(dkdLabel.textContent) !== 'canli senkron') continue;
    const dkdCard = dkdLabel.closest('article,section,button,a,[role="button"],li,[class*="card"],[class*="sync"]') || dkdLabel.parentElement;
    if (!dkdCard) continue;
    const dkdText = dkdV3214Normalize(dkdCard.textContent);
    if (dkdText.includes('canli senkron') && dkdText.includes('web uygulama')) dkdCard.remove();
  }

  for (const dkdLegacy of document.querySelectorAll('#dkd-v328-earnings,#dkd-v325-earnings,.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]:not(.dkd-v3211-earnings-menu)')) {
    dkdLegacy.remove();
  }
}

function dkdV3214ApplyCleanup() {
  dkdV3214KeepSingleEarningsMenu();
  dkdV3214RemoveOldHomeFragments();
  window.dkdV3214Cleanup?.();
}

let dkdV3214CleanupQueued = false;
const dkdV3214CleanupObserver = new MutationObserver(() => {
  if (dkdV3214CleanupQueued) return;
  dkdV3214CleanupQueued = true;
  requestAnimationFrame(() => {
    dkdV3214CleanupQueued = false;
    dkdV3214ApplyCleanup();
  });
});

dkdV3214CleanupObserver.observe(document.body, { childList: true, subtree: true });
document.addEventListener('click', () => requestAnimationFrame(dkdV3214ApplyCleanup), true);
window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3214ApplyCleanup));

requestAnimationFrame(dkdV3214ApplyCleanup);
setTimeout(dkdV3214ApplyCleanup, 250);
setTimeout(dkdV3214ApplyCleanup, 1200);

document.documentElement.dataset.dkdGateVersion = DKD_V3214_VERSION;
sessionStorage.setItem('dkd_gate_web_version', DKD_V3214_VERSION);
window.__DKD_GATE_V3214_UI_CLEANUP__ = true;
