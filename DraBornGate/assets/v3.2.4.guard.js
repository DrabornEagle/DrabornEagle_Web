(() => {
  const DKD_V324_VERSION = '3.2.4';
  const DKD_V324_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.[0-3])?)(?!\.\d)\b/gi;

  function dkdV324ReplaceVersion(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V324_VERSION_PATTERN.lastIndex = 0;
    if (!DKD_V324_VERSION_PATTERN.test(dkdText)) return dkdText;
    DKD_V324_VERSION_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V324_VERSION_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V324_VERSION}`
        : `v${DKD_V324_VERSION}`
    );
  }

  function dkdV324PatchTextNode(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV324ReplaceVersion(dkdCurrent);
    if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
    if (String(dkdNode.nodeValue || '').trim() === 'DG') dkdNode.nodeValue = 'DBG';
  }

  function dkdV324PatchMetadata() {
    const dkdTitle = dkdV324ReplaceVersion(document.title);
    if (dkdTitle !== document.title) document.title = dkdTitle;
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      const dkdCurrent = dkdMeta.getAttribute('content') || '';
      const dkdUpdated = dkdV324ReplaceVersion(dkdCurrent);
      if (dkdUpdated !== dkdCurrent) dkdMeta.setAttribute('content', dkdUpdated);
    }
  }

  function dkdV324PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV324PatchTextNode(dkdRoot);
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
    while (dkdWalker.nextNode()) dkdV324PatchTextNode(dkdWalker.currentNode);
    dkdV324PatchMetadata();
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V324_VERSION;
  window.__DKD_GATE_V324_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V324_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V324_VERSION;
  dkdV324PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV324PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV324PatchRoot(dkdNode);
    }
    dkdV324PatchMetadata();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
