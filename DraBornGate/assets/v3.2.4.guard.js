(() => {
  const DKD_V324_VERSION = '3.2.4';
  const DKD_V324_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0(?:\.\d+)?|1(?:\.\d+)?|2(?:\.[0-3])?))(?!\.\d)\b/gi;

  function dkdV324PatchTextNode(dkdNode) {
    const dkdValue = String(dkdNode?.nodeValue || '');
    DKD_V324_VERSION_PATTERN.lastIndex = 0;
    if (!DKD_V324_VERSION_PATTERN.test(dkdValue)) return;
    DKD_V324_VERSION_PATTERN.lastIndex = 0;
    const dkdUpdated = dkdValue.replace(DKD_V324_VERSION_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V324_VERSION}`
        : `v${DKD_V324_VERSION}`
    );
    if (dkdUpdated !== dkdValue) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV324PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV324PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV324PatchTextNode(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V324_VERSION;
  window.__DKD_GATE_V324_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V324_VERSION);
  dkdV324PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV324PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV324PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
