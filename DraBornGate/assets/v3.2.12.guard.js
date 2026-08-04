(() => {
  const DKD_V3212_VERSION = '3.2.12';
  const DKD_V3212_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3\.(?:0|1)(?:\.\d+)?|3\.2(?:\.\d{1,2})?)(?!\.\d)\b/gi;

  function dkdV3212Replace(dkdValue) {
    const dkdText = String(dkdValue || '');
    DKD_V3212_PATTERN.lastIndex = 0;
    if (!DKD_V3212_PATTERN.test(dkdText)) return dkdText;
    DKD_V3212_PATTERN.lastIndex = 0;
    return dkdText.replace(DKD_V3212_PATTERN, (dkdMatch) => /draborngate\s+web/i.test(dkdMatch)
      ? `DraBornGate Web v${DKD_V3212_VERSION}`
      : `v${DKD_V3212_VERSION}`);
  }

  function dkdV3212PatchText(dkdNode) {
    if (!dkdNode || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdV3212Replace(dkdCurrent);
    if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV3212PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV3212PatchText(dkdRoot);
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
    while (dkdWalker.nextNode()) dkdV3212PatchText(dkdWalker.currentNode);
  }

  function dkdV3212PatchMetadata() {
    document.title = dkdV3212Replace(document.title);
    for (const dkdMeta of document.querySelectorAll('meta[name="description"],meta[name="application-name"]')) {
      dkdMeta.setAttribute('content', dkdV3212Replace(dkdMeta.getAttribute('content') || ''));
    }
  }

  if (!window.__DKD_GATE_V3212_REMOVE_GUARD__) {
    window.__DKD_GATE_V3212_REMOVE_GUARD__ = true;
    const dkdOriginalRemove = Element.prototype.remove;
    Object.defineProperty(Element.prototype, 'remove', {
      configurable: true,
      writable: true,
      value: function dkdV3212ProtectedRemove() {
        const dkdText = String(this.textContent || '')
          .toLocaleLowerCase('tr-TR')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/ı/g, 'i')
          .replace(/[^a-z0-9]+/g, ' ')
          .trim();
        const dkdMenuHost = this.closest?.('aside,nav,[class*="sidebar"],[class*="drawer"],[class*="menu"]');
        if (dkdText === 'kazanclarim' && dkdMenuHost && !this.classList?.contains('dkd-v3211-earnings-menu')) return;
        return dkdOriginalRemove.call(this);
      },
    });
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V3212_VERSION;
  window.__DKD_GATE_V3212_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3212_VERSION);
  document.documentElement.dataset.dkdGateVersion = DKD_V3212_VERSION;
  dkdV3212PatchRoot(document.documentElement);
  dkdV3212PatchMetadata();

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3212PatchText(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3212PatchRoot(dkdNode);
    }
    dkdV3212PatchMetadata();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
