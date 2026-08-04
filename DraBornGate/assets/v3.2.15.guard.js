(() => {
  const DKD_V3215_VERSION = '3.2.15';
  const DKD_V3215_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.(?:[0-9]|1[0-5]))?)(?!\.\d)\b/gi;

  function dkdV3215Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV3215Replace(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V3215_PATTERN.lastIndex = 0;
    if (!DKD_V3215_PATTERN.test(dkdText)) return dkdText;
    DKD_V3215_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V3215_PATTERN, (dkdMatch) => /draborngate\s+web/i.test(dkdMatch)
      ? `DraBornGate Web v${DKD_V3215_VERSION}`
      : `v${DKD_V3215_VERSION}`);
  }

  function dkdV3215PatchText(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return false;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV3215Replace(dkdCurrent);
    if (dkdUpdated === dkdCurrent) return false;
    dkdNode.nodeValue = dkdUpdated;
    return true;
  }

  function dkdV3215PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV3215PatchText(dkdRoot);
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
    while (dkdWalker.nextNode()) dkdV3215PatchText(dkdWalker.currentNode);
  }

  function dkdV3215PatchMetadata() {
    const dkdUpdatedTitle = dkdV3215Replace(document.title);
    if (dkdUpdatedTitle !== document.title) document.title = dkdUpdatedTitle;
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      const dkdCurrent = dkdMeta.getAttribute('content') || '';
      const dkdUpdated = dkdV3215Replace(dkdCurrent);
      if (dkdUpdated !== dkdCurrent) dkdMeta.setAttribute('content', dkdUpdated);
    }
  }

  function dkdV3215RemoveBottomEarnings() {
    for (const dkdBroken of document.querySelectorAll('.dkd-v3211-earnings-menu,[data-dkd-v3211-earnings],.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu],#dkd-v328-earnings,#dkd-v325-earnings')) {
      dkdBroken.remove();
    }

    for (const dkdLabel of document.querySelectorAll('strong,span,h1,h2,h3,h4,p,small,i')) {
      const dkdLabelText = dkdV3215Normalize(dkdLabel.textContent);
      if (dkdLabelText !== 'site kurye partneri gelirleri' && dkdLabelText !== 'goruntule') continue;
      const dkdCandidate = dkdLabel.closest('button,a,[role="button"],article,section,li,[class*="earnings"],[class*="kazanc"]') || dkdLabel.parentElement;
      if (!dkdCandidate || dkdCandidate.closest('#dkd-v3211-earnings')) continue;
      const dkdText = dkdV3215Normalize(dkdCandidate.textContent);
      if (dkdText.includes('kazanclarim') && dkdText.includes('site kurye') && dkdText.includes('goruntule')) dkdCandidate.remove();
    }
  }

  function dkdV3215RemoveLegacySyncCard() {
    for (const dkdLabel of document.querySelectorAll('strong,span,h1,h2,h3,h4,p')) {
      if (dkdV3215Normalize(dkdLabel.textContent) !== 'canli senkron') continue;
      const dkdCandidate = dkdLabel.closest('article,section,button,a,[role="button"],li,[class*="card"],[class*="sync"]') || dkdLabel.parentElement;
      const dkdText = dkdV3215Normalize(dkdCandidate?.textContent);
      if (dkdCandidate && dkdText.includes('canli senkron') && dkdText.includes('web uygulama')) dkdCandidate.remove();
    }
  }

  function dkdV3215Cleanup() {
    dkdV3215RemoveBottomEarnings();
    dkdV3215RemoveLegacySyncCard();
    dkdV3215PatchMetadata();
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V3215_VERSION;
  window.__DKD_GATE_V3215_ACTIVE__ = true;
  window.dkdV3215Cleanup = dkdV3215Cleanup;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3215_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V3215_VERSION;
  document.documentElement.classList.add('dkd-v3215-runtime');
  dkdV3215PatchRoot(document.documentElement);
  dkdV3215Cleanup();

  let dkdV3215Queued = false;
  const dkdV3215Observer = new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3215PatchText(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3215PatchRoot(dkdNode);
    }
    if (dkdV3215Queued) return;
    dkdV3215Queued = true;
    requestAnimationFrame(() => {
      dkdV3215Queued = false;
      dkdV3215Cleanup();
    });
  });

  dkdV3215Observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3215Cleanup));
})();
