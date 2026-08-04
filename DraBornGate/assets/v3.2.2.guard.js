(() => {
  const DKD_V322_VERSION = '3.2.2';
  const DKD_V322_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0(?:\.\d+)?|1(?:\.\d+)?|2(?:\.[0-1])?))\b/gi;

  function dkdV322PatchTextNode(dkdNode) {
    const dkdValue = String(dkdNode?.nodeValue || '');
    DKD_V322_VERSION_PATTERN.lastIndex = 0;
    if (!DKD_V322_VERSION_PATTERN.test(dkdValue)) return;
    DKD_V322_VERSION_PATTERN.lastIndex = 0;
    const dkdUpdated = dkdValue.replace(DKD_V322_VERSION_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V322_VERSION}`
        : `v${DKD_V322_VERSION}`
    );
    if (dkdUpdated !== dkdValue) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV322PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV322PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV322PatchTextNode(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V322_VERSION;
  window.__DKD_GATE_V322_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V322_VERSION);
  dkdV322PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV322PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV322PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
