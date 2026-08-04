(() => {
  const DKD_V323_VERSION = '3.2.3';
  const DKD_V323_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0(?:\.\d+)?|1(?:\.\d+)?|2(?:\.[0-2])?))(?!\.\d)\b/gi;

  function dkdV323PatchTextNode(dkdNode) {
    const dkdValue = String(dkdNode?.nodeValue || '');
    DKD_V323_VERSION_PATTERN.lastIndex = 0;
    if (!DKD_V323_VERSION_PATTERN.test(dkdValue)) return;
    DKD_V323_VERSION_PATTERN.lastIndex = 0;
    const dkdUpdated = dkdValue.replace(DKD_V323_VERSION_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V323_VERSION}`
        : `v${DKD_V323_VERSION}`
    );
    if (dkdUpdated !== dkdValue) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV323PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV323PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV323PatchTextNode(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V323_VERSION;
  window.__DKD_GATE_V323_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V323_VERSION);
  dkdV323PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV323PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV323PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
