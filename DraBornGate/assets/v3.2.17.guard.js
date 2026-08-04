(() => {
  const DKD_V3217_VERSION = '3.2.17';
  const DKD_V3217_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.(?:[0-9]|1[0-6]))?)(?!\.\d)\b/gi;

  function dkdV3217Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV3217Replace(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V3217_PATTERN.lastIndex = 0;
    if (!DKD_V3217_PATTERN.test(dkdText)) return dkdText;
    DKD_V3217_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V3217_PATTERN, (dkdMatch) => /draborngate\s+web/i.test(dkdMatch)
      ? `DraBornGate Web v${DKD_V3217_VERSION}`
      : `v${DKD_V3217_VERSION}`);
  }

  function dkdV3217PatchText(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return false;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV3217Replace(dkdCurrent);
    if (dkdUpdated === dkdCurrent) return false;
    dkdNode.nodeValue = dkdUpdated;
    return true;
  }

  function dkdV3217PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV3217PatchText(dkdRoot);
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
    while (dkdWalker.nextNode()) dkdV3217PatchText(dkdWalker.currentNode);
  }

  function dkdV3217PatchMetadata() {
    const dkdUpdatedTitle = dkdV3217Replace(document.title);
    if (dkdUpdatedTitle !== document.title) document.title = dkdUpdatedTitle;
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      const dkdCurrent = dkdMeta.getAttribute('content') || '';
      const dkdUpdated = dkdV3217Replace(dkdCurrent);
      if (dkdUpdated !== dkdCurrent) dkdMeta.setAttribute('content', dkdUpdated);
    }
  }

  function dkdV3217RemoveLegacySyncCard() {
    for (const dkdLabel of document.querySelectorAll('strong,span,h1,h2,h3,h4,p')) {
      if (dkdV3217Normalize(dkdLabel.textContent) !== 'canli senkron') continue;
      const dkdCandidate = dkdLabel.closest('article,section,button,a,[role="button"],li,[class*="card"],[class*="sync"]') || dkdLabel.parentElement;
      const dkdText = dkdV3217Normalize(dkdCandidate?.textContent);
      if (dkdCandidate && dkdText.includes('canli senkron') && dkdText.includes('web uygulama')) dkdCandidate.remove();
    }
  }

  function dkdV3217Cleanup() {
    dkdV3217RemoveLegacySyncCard();
    dkdV3217PatchMetadata();
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V3217_VERSION;
  window.__DKD_GATE_V3217_ACTIVE__ = true;
  window.dkdV3217Cleanup = dkdV3217Cleanup;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3217_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V3217_VERSION;
  document.documentElement.classList.add('dkd-v3217-runtime');
  dkdV3217PatchRoot(document.documentElement);
  dkdV3217Cleanup();

  let dkdV3217Queued = false;
  const dkdV3217Observer = new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3217PatchText(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3217PatchRoot(dkdNode);
    }
    if (dkdV3217Queued) return;
    dkdV3217Queued = true;
    requestAnimationFrame(() => {
      dkdV3217Queued = false;
      dkdV3217Cleanup();
    });
  });

  dkdV3217Observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('pageshow', () => requestAnimationFrame(dkdV3217Cleanup));
})();
