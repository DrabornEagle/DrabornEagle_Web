(() => {
  const DKD_V328_VERSION = '3.2.8';
  const DKD_V328_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.[0-7])?)(?!\.\d)\b/gi;

  function dkdV328ReplaceVersion(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V328_VERSION_PATTERN.lastIndex = 0;
    if (!DKD_V328_VERSION_PATTERN.test(dkdText)) return dkdText;
    DKD_V328_VERSION_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V328_VERSION_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V328_VERSION}`
        : `v${DKD_V328_VERSION}`
    );
  }

  function dkdV328PatchTextNode(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV328ReplaceVersion(dkdCurrent);
    if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
    if (String(dkdNode.nodeValue || '').trim() === 'DG') dkdNode.nodeValue = 'DBG';
  }

  function dkdV328PatchMetadata() {
    const dkdTitle = dkdV328ReplaceVersion(document.title);
    if (dkdTitle !== document.title) document.title = dkdTitle;
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      const dkdCurrent = dkdMeta.getAttribute('content') || '';
      const dkdUpdated = dkdV328ReplaceVersion(dkdCurrent);
      if (dkdUpdated !== dkdCurrent) dkdMeta.setAttribute('content', dkdUpdated);
    }
  }

  function dkdV328PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV328PatchTextNode(dkdRoot);
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
    while (dkdWalker.nextNode()) dkdV328PatchTextNode(dkdWalker.currentNode);
    dkdV328PatchMetadata();
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V328_VERSION;
  window.__DKD_GATE_V328_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V328_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V328_VERSION;
  dkdV328PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV328PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV328PatchRoot(dkdNode);
    }
    dkdV328PatchMetadata();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
