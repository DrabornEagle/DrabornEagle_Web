(() => {
  const DKD_V301_VERSION = '3.0.1';
  const DKD_V301_VERSION_PATTERN = /(?:DraBornGate\s+Web\s+)?v(?:2\.8(?:\.0)?|3\.0\.0)\b/gi;

  function dkdV301GuardNormalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV301GuardIsSimple() {
    return dkdV301GuardNormalize(location.pathname).includes('guvenlik sade tema') ||
      sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
      sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
  }

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
  window.__DKD_GATE_V301_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V301_VERSION);
  dkdV301PatchRoot(document.documentElement);

  document.addEventListener('click', (dkdEvent) => {
    if (!dkdV301GuardIsSimple()) return;
    const dkdTarget = dkdEvent.target?.closest?.('button,a,[role="button"]');
    if (!dkdTarget || dkdTarget.closest('#dkd-v30-root,#dkd-v28-root')) return;
    const dkdText = dkdV301GuardNormalize([
      dkdTarget.textContent,
      dkdTarget.getAttribute('aria-label'),
      dkdTarget.title,
    ].join(' '));
    const dkdFinderNavigation = /kurye kodu dogrula|kuryeni bul|6 haneli kurye kodu|kodu dogrula/.test(dkdText);
    if (!dkdFinderNavigation) return;
    const dkdCode = String(document.querySelector('#dkd-v30-code')?.value || '').replace(/\D/g, '');
    if (dkdCode.length === 6) return;
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
  }, true);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV301PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV301PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
