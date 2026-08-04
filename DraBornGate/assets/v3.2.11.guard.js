(() => {
  const DKD_V3211_VERSION = '3.2.11';
  const DKD_V3211_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.(?:[0-9]|10|11))?)(?!\.\d)\b/gi;

  function dkdV3211Replace(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V3211_PATTERN.lastIndex = 0;
    if (!DKD_V3211_PATTERN.test(dkdText)) return dkdText;
    DKD_V3211_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V3211_PATTERN, (dkdMatch) => /draborngate\s+web/i.test(dkdMatch) ? `DraBornGate Web v${DKD_V3211_VERSION}` : `v${DKD_V3211_VERSION}`);
  }

  function dkdV3211PatchText(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV3211Replace(dkdCurrent);
    if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV3211PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV3211PatchText(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    if (dkdRoot instanceof Element && /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdRoot.tagName)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT, {
      acceptNode(dkdNode) {
        return /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });
    while (dkdWalker.nextNode()) dkdV3211PatchText(dkdWalker.currentNode);
  }

  function dkdV3211PatchMetadata() {
    document.title = dkdV3211Replace(document.title);
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      dkdMeta.setAttribute('content', dkdV3211Replace(dkdMeta.getAttribute('content') || ''));
    }
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V3211_VERSION;
  window.__DKD_GATE_V3211_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3211_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V3211_VERSION;
  dkdV3211PatchRoot(document.documentElement);
  dkdV3211PatchMetadata();

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3211PatchText(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3211PatchRoot(dkdNode);
    }
    dkdV3211PatchMetadata();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
