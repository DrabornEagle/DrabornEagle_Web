(() => {
  const DKD_V31_VERSION = '3.1.0';
  const DKD_V31_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2\.8(?:\.0)?|3\.0(?:\.[01])?)\b/gi;

  function dkdV31GuardNormalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV31PatchTextNode(dkdNode) {
    const dkdValue = dkdNode?.nodeValue || '';
    DKD_V31_VERSION_PATTERN.lastIndex = 0;
    if (DKD_V31_VERSION_PATTERN.test(dkdValue)) {
      DKD_V31_VERSION_PATTERN.lastIndex = 0;
      dkdNode.nodeValue = dkdValue.replace(DKD_V31_VERSION_PATTERN, (dkdMatch) =>
        /draborngate\s+web/i.test(dkdMatch)
          ? `DraBornGate Web v${DKD_V31_VERSION}`
          : `v${DKD_V31_VERSION}`
      );
    }
    DKD_V31_VERSION_PATTERN.lastIndex = 0;
    if (String(dkdNode.nodeValue || '').trim() === 'DG') dkdNode.nodeValue = 'DBG';
  }

  function dkdV31PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV31PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV31PatchTextNode(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V31_VERSION;
  window.__DKD_GATE_V31_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V31_VERSION);
  dkdV31PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV31PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV31PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
