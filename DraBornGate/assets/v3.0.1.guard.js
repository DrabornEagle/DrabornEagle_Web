(() => {
  const DKD_V301_VERSION = '3.0.1';
  const DKD_V301_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2\.8(?:\.0)?|3\.0\.0)\b/gi;

  function dkdV301PatchTextNode(dkdNode) {
    const dkdValue = dkdNode?.nodeValue || '';
    if (!DKD_V301_VERSION_PATTERN.test(dkdValue)) {
      DKD_V301_VERSION_PATTERN.lastIndex = 0;
      return;
    }
    DKD_V301_VERSION_PATTERN.lastIndex = 0;
    dkdNode.nodeValue = dkdValue.replace(DKD_V301_VERSION_PATTERN, (dkdMatch) =>
      /draborngate\s+web/i.test(dkdMatch)
        ? `DraBornGate Web v${DKD_V301_VERSION}`
        : `v${DKD_V301_VERSION}`
    );
  }

  function dkdV301PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV301PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV301PatchTextNode(dkdWalker.currentNode);

    for (const dkdMark of dkdRoot.querySelectorAll?.('.boot-logo span,.dkd-boot-mark,.mark b,[class*="logo"] [class*="mark"]') || []) {
      if (String(dkdMark.textContent || '').trim() === 'DG') dkdMark.textContent = 'DBG';
    }
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V301_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V301_VERSION);
  dkdV301PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV301PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV301PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
