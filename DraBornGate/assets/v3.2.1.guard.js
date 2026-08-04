(() => {
  const DKD_V321_VERSION = '3.2.1';
  const DKD_V321_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0(?:\.\d+)?|1(?:\.\d+)?|2(?:\.[01])?))\b/gi;

  function dkdV321PatchTextNode(dkdNode) {
    const dkdValue = String(dkdNode?.nodeValue || '');
    DKD_V321_VERSION_PATTERN.lastIndex = 0;
    if (DKD_V321_VERSION_PATTERN.test(dkdValue)) {
      DKD_V321_VERSION_PATTERN.lastIndex = 0;
      dkdNode.nodeValue = dkdValue.replace(DKD_V321_VERSION_PATTERN, (dkdMatch) =>
        /draborngate\s+web/i.test(dkdMatch)
          ? `DraBornGate Web v${DKD_V321_VERSION}`
          : `v${DKD_V321_VERSION}`
      );
    }
    DKD_V321_VERSION_PATTERN.lastIndex = 0;
    if (String(dkdNode.nodeValue || '').trim() === 'DG') dkdNode.nodeValue = 'DBG';
  }

  function dkdV321PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV321PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV321PatchTextNode(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V321_VERSION;
  window.__DKD_GATE_V321_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V321_VERSION);
  dkdV321PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV321PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV321PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
