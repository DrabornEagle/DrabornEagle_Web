const DKD_V3212_VERSION = '3.2.12';
const dkdV3212State = { queued: false };

function dkdV3212Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3212Retire(dkdElement, dkdReason) {
  if (!(dkdElement instanceof Element)) return;
  dkdElement.dataset.dkdV3212Retired = 'true';
  dkdElement.dataset.dkdV3212Reason = dkdReason;
  dkdElement.setAttribute('aria-hidden', 'true');
}

function dkdV3212RetireDuplicateEarnings() {
  for (const dkdElement of document.querySelectorAll('.dkd-v3211-earnings-menu')) {
    dkdV3212Retire(dkdElement, 'duplicate-earnings-card');
  }

  const dkdCandidates = [...document.querySelectorAll('button,a,[role="button"],li')]
    .filter((dkdElement) => {
      if (dkdElement.closest('#dkd-v3211-earnings,#dkd-v3211-security-modal')) return false;
      const dkdText = dkdV3212Normalize(dkdElement.textContent);
      return dkdText.includes('kazanclarim')
        && dkdText.includes('site kurye partneri gelirleri')
        && dkdText.includes('goruntule');
    });
  for (const dkdElement of dkdCandidates) dkdV3212Retire(dkdElement, 'duplicate-earnings-card');
}

function dkdV3212FindSmallestCard(dkdRequiredParts) {
  const dkdSelector = [
    'article',
    'section',
    'button',
    '[role="button"]',
    '[class*="card"]',
    '[class*="tile"]',
    '[class*="stat"]',
    '[class*="metric"]',
    '[class*="widget"]',
  ].join(',');
  return [...document.querySelectorAll(dkdSelector)]
    .map((dkdElement) => ({ dkdElement, dkdText: dkdV3212Normalize(dkdElement.textContent) }))
    .filter(({ dkdElement, dkdText }) => {
      if (!dkdText || dkdText.length > 520) return false;
      if (dkdElement.closest('#dkd-v3211-earnings,#dkd-v3211-security-modal')) return false;
      return dkdRequiredParts.every((dkdPart) => dkdText.includes(dkdPart));
    })
    .sort((dkdLeft, dkdRight) => dkdLeft.dkdText.length - dkdRight.dkdText.length)[0]?.dkdElement || null;
}

function dkdV3212RetireLegacyWidgets() {
  const dkdLegacySignatures = [
    { parts: ['canli senkron', 'web uygulama'], reason: 'legacy-live-sync-card' },
    { parts: ['akilli talep yok'], reason: 'legacy-smart-request-card' },
  ];
  for (const dkdSignature of dkdLegacySignatures) {
    const dkdCard = dkdV3212FindSmallestCard(dkdSignature.parts);
    if (dkdCard) dkdV3212Retire(dkdCard, dkdSignature.reason);
  }
}

function dkdV3212BindCompactEarnings() {
  const dkdCompact = [...document.querySelectorAll('button,a,[role="button"],li')]
    .find((dkdElement) => {
      if (dkdElement.matches('[data-dkd-v3212-retired="true"]')) return false;
      if (dkdElement.closest('#dkd-v3211-earnings,#dkd-v3211-security-modal')) return false;
      return dkdV3212Normalize(dkdElement.textContent) === 'kazanclarim';
    });
  if (dkdCompact) dkdCompact.dataset.dkdV3211Earnings = 'true';
}

function dkdV3212Patch() {
  dkdV3212State.queued = false;
  dkdV3212RetireDuplicateEarnings();
  dkdV3212RetireLegacyWidgets();
  dkdV3212BindCompactEarnings();
  document.documentElement.dataset.dkdGateVersion = DKD_V3212_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3212_VERSION);
}

function dkdV3212QueuePatch() {
  if (dkdV3212State.queued) return;
  dkdV3212State.queued = true;
  requestAnimationFrame(dkdV3212Patch);
}

new MutationObserver(dkdV3212QueuePatch).observe(document.body, { childList: true, subtree: true });
dkdV3212Patch();
window.__DKD_GATE_V3212_FINALIZED__ = true;
