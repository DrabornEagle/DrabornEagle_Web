(() => {
  const DKD_V3214_VERSION = '3.2.14';
  const DKD_V3214_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.(?:[0-9]|1[0-4]))?)(?!\.\d)\b/gi;
  const DKD_V3214_LEGACY_EARNINGS = '.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]:not(.dkd-v3211-earnings-menu),#dkd-v328-earnings,#dkd-v325-earnings';

  function dkdV3214Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV3214Replace(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V3214_PATTERN.lastIndex = 0;
    if (!DKD_V3214_PATTERN.test(dkdText)) return dkdText;
    DKD_V3214_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V3214_PATTERN, (dkdMatch) => /draborngate\s+web/i.test(dkdMatch)
      ? `DraBornGate Web v${DKD_V3214_VERSION}`
      : `v${DKD_V3214_VERSION}`);
  }

  function dkdV3214PatchText(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return false;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV3214Replace(dkdCurrent);
    if (dkdUpdated === dkdCurrent) return false;
    dkdNode.nodeValue = dkdUpdated;
    return true;
  }

  function dkdV3214PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV3214PatchText(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    if (dkdRoot instanceof Element && /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdRoot.tagName)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT, {
      acceptNode(dkdNode) {
        return /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });
    while (dkdWalker.nextNode()) dkdV3214PatchText(dkdWalker.currentNode);
  }

  function dkdV3214PatchMetadata() {
    const dkdCurrentTitle = document.title;
    const dkdUpdatedTitle = dkdV3214Replace(dkdCurrentTitle);
    if (dkdUpdatedTitle !== dkdCurrentTitle) document.title = dkdUpdatedTitle;

    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      const dkdCurrentContent = dkdMeta.getAttribute('content') || '';
      const dkdUpdatedContent = dkdV3214Replace(dkdCurrentContent);
      if (dkdUpdatedContent !== dkdCurrentContent) dkdMeta.setAttribute('content', dkdUpdatedContent);
    }
  }

  function dkdV3214MenuScope(dkdElement) {
    return dkdElement?.closest('nav,aside,[class*="sidebar"],[class*="drawer"],[class*="menu"],[data-dkd-shell-menu]') || null;
  }

  function dkdV3214RemoveDuplicateEarnings() {
    for (const dkdLegacy of document.querySelectorAll(DKD_V3214_LEGACY_EARNINGS)) dkdLegacy.remove();

    const dkdOfficial = document.querySelector('.dkd-v3211-earnings-menu');
    const dkdLabels = [...document.querySelectorAll('strong,span,h1,h2,h3,h4,p')]
      .filter((dkdLabel) => dkdV3214Normalize(dkdLabel.textContent) === 'kazanclarim')
      .filter((dkdLabel) => !dkdLabel.closest('#dkd-v3211-earnings,#dkd-v3214-earnings'));

    for (const dkdLabel of dkdLabels) {
      const dkdCandidate = dkdLabel.closest('button,a,[role="button"],li,article,[data-dkd-earnings-menu]') || dkdLabel.parentElement;
      if (!dkdCandidate || dkdCandidate === dkdOfficial || dkdCandidate.closest('.dkd-v3211-earnings-menu')) continue;
      const dkdText = dkdV3214Normalize(dkdCandidate.textContent);
      const dkdLooksLikeEarningsCard = dkdText.includes('site kurye')
        || dkdText.includes('goruntule')
        || /earnings|kazanc/i.test(String(dkdCandidate.className || ''))
        || Boolean(dkdV3214MenuScope(dkdCandidate));
      if (dkdLooksLikeEarningsCard) dkdCandidate.remove();
    }

    const dkdOfficialButtons = [...document.querySelectorAll('.dkd-v3211-earnings-menu')];
    for (const dkdExtra of dkdOfficialButtons.slice(1)) dkdExtra.remove();
  }

  function dkdV3214RemoveLegacySyncCard() {
    const dkdLabels = [...document.querySelectorAll('strong,span,h1,h2,h3,h4,p')]
      .filter((dkdLabel) => dkdV3214Normalize(dkdLabel.textContent) === 'canli senkron');

    for (const dkdLabel of dkdLabels) {
      const dkdCandidate = dkdLabel.closest('article,section,button,a,[role="button"],li,[class*="card"],[class*="sync"]') || dkdLabel.parentElement;
      if (!dkdCandidate) continue;
      const dkdText = dkdV3214Normalize(dkdCandidate.textContent);
      if (dkdText.includes('canli senkron') && dkdText.includes('web uygulama')) dkdCandidate.remove();
    }
  }

  function dkdV3214Cleanup() {
    dkdV3214RemoveDuplicateEarnings();
    dkdV3214RemoveLegacySyncCard();
    dkdV3214PatchMetadata();
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V3214_VERSION;
  window.__DKD_GATE_V3214_ACTIVE__ = true;
  window.dkdV3214Cleanup = dkdV3214Cleanup;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3214_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V3214_VERSION;
  document.documentElement.classList.add('dkd-v3214-runtime');
  dkdV3214PatchRoot(document.documentElement);
  dkdV3214Cleanup();

  let dkdV3214ObserverQueued = false;
  const dkdV3214Observer = new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3214PatchText(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3214PatchRoot(dkdNode);
    }
    if (dkdV3214ObserverQueued) return;
    dkdV3214ObserverQueued = true;
    requestAnimationFrame(() => {
      dkdV3214ObserverQueued = false;
      dkdV3214Cleanup();
    });
  });

  dkdV3214Observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3214Cleanup));
})();
