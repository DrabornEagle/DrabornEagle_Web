(() => {
  const DKD_V326_VERSION = '3.2.6';
  const DKD_V326_PATTERN = /(?:DraBornGate\s+Web\s+)?v3\.2\.5\b/gi;

  function dkdV326ReplaceVersion(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V326_PATTERN.lastIndex = 0;
    if (!DKD_V326_PATTERN.test(dkdText)) return dkdText;
    DKD_V326_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V326_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V326_VERSION}`
        : `v${DKD_V326_VERSION}`
    );
  }

  function dkdV326PatchNode(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV326ReplaceVersion(dkdCurrent);
    if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV326PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV326PatchNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV326PatchNode(dkdWalker.currentNode);
    document.title = dkdV326ReplaceVersion(document.title);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V326_VERSION;
  window.__DKD_GATE_V326_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V326_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V326_VERSION;
  dkdV326PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV326PatchNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV326PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
