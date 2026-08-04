(() => {
  const DKD_V327_VERSION = '3.2.7';
  const DKD_V327_OLD_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.[0-6])?)(?!\.\d)\b/gi;

  window.__DKD_GATE_V327_ACTIVE__ = {
    version: DKD_V327_VERSION,
    startedAt: Date.now(),
  };
  document.documentElement.dataset.dkdV327Active = 'true';
  sessionStorage.setItem('dkd_gate_web_version', DKD_V327_VERSION);

  if (!document.querySelector('#dkd-v327-early-style')) {
    const dkdStyle = document.createElement('style');
    dkdStyle.id = 'dkd-v327-early-style';
    dkdStyle.textContent = `
      html[data-dkd-v327-active="true"] #dkd-v28-root{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      html[data-dkd-v327-active="true"] body.dkd-v28-simple-active #dkd-app{visibility:visible!important}
    `;
    document.head.appendChild(dkdStyle);
  }

  function dkdV327ReplaceVersionText(dkdRoot = document.body) {
    if (!dkdRoot) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    const dkdNodes = [];
    while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
    for (const dkdNode of dkdNodes) {
      if (/^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) continue;
      const dkdCurrent = String(dkdNode.nodeValue || '');
      const dkdUpdated = dkdCurrent.replace(DKD_V327_OLD_VERSION_PATTERN, (dkdMatch) =>
        /draborngate/i.test(dkdMatch) ? `DraBornGate Web v${DKD_V327_VERSION}` : `v${DKD_V327_VERSION}`
      );
      if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
    }
  }

  function dkdV327PatchMetadata() {
    document.title = document.title.replace(/v\d+(?:\.\d+){1,2}/i, `v${DKD_V327_VERSION}`);
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      dkdMeta.content = String(dkdMeta.content || '').replace(/v\d+(?:\.\d+){1,2}/gi, `v${DKD_V327_VERSION}`);
    }
  }

  dkdV327PatchMetadata();
  dkdV327ReplaceVersionText();
  new MutationObserver((dkdMutations) => {
    if (!dkdMutations.some((dkdMutation) => dkdMutation.addedNodes.length || dkdMutation.type === 'characterData')) return;
    dkdV327ReplaceVersionText();
    dkdV327PatchMetadata();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
