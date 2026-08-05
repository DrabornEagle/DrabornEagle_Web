(() => {
  const DKD_V3221_VERSION = '3.2.21';
  const dkdV3221NativeAppendChild = Node.prototype.appendChild;
  const dkdV3221NativeInsertBefore = Node.prototype.insertBefore;
  const dkdV3221NativeInsertAdjacentElement = Element.prototype.insertAdjacentElement;

  function dkdV3221Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV3221IsEarningsLabel(dkdValue) {
    const dkdNormalized = dkdV3221Normalize(dkdValue);
    return dkdNormalized === 'kazancim' || dkdNormalized === 'kazanclarim';
  }

  function dkdV3221IsCanonicalEarnings(dkdNode) {
    return dkdNode instanceof Element && (
      dkdNode.classList.contains('dkd-v3219-earnings-menu')
      || dkdNode.classList.contains('dkd-v3220-earnings-menu')
      || Boolean(dkdNode.closest('#dkd-v3211-earnings,#dkd-v328-modal'))
    );
  }

  function dkdV3221IsLegacyEarnings(dkdNode) {
    if (!(dkdNode instanceof Element) || dkdV3221IsCanonicalEarnings(dkdNode)) return false;
    if (dkdNode.matches('.dkd-v3211-earnings-menu,.dkd-v3217-earnings-menu,.dkd-v3218-earnings-menu,.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]')) return true;
    if (!dkdNode.matches('button,a,[role="button"],li,article')) return false;
    return dkdV3221IsEarningsLabel(dkdNode.textContent);
  }

  Node.prototype.appendChild = function dkdV3221AppendChild(dkdNode) {
    if (dkdV3221IsLegacyEarnings(dkdNode)) return dkdNode;
    return dkdV3221NativeAppendChild.call(this, dkdNode);
  };

  Node.prototype.insertBefore = function dkdV3221InsertBefore(dkdNode, dkdReference) {
    if (dkdV3221IsLegacyEarnings(dkdNode)) return dkdNode;
    return dkdV3221NativeInsertBefore.call(this, dkdNode, dkdReference);
  };

  Element.prototype.insertAdjacentElement = function dkdV3221InsertAdjacentElement(dkdPosition, dkdElement) {
    if (dkdV3221IsLegacyEarnings(dkdElement)) return dkdElement;
    return dkdV3221NativeInsertAdjacentElement.call(this, dkdPosition, dkdElement);
  };

  function dkdV3221ReplaceVersion(dkdText) {
    const dkdValue = String(dkdText || '');
    if (!/(?:draborngate|\bweb\s*v|\bweb\s+v)/i.test(dkdValue)) return dkdValue;
    return dkdValue.replace(/(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3(?:\.\d+){1,2})\b/gi, (dkdMatch) => (
      /draborngate\s+web/i.test(dkdMatch) ? `DraBornGate Web v${DKD_V3221_VERSION}` : `v${DKD_V3221_VERSION}`
    ));
  }

  function dkdV3221PatchTextNode(dkdNode) {
    if (!(dkdNode instanceof Text) || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdUpdated = dkdV3221ReplaceVersion(dkdNode.nodeValue);
    if (dkdUpdated !== dkdNode.nodeValue) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV3221PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot instanceof Text) {
      dkdV3221PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    if (dkdRoot instanceof Element && /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdRoot.tagName)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV3221PatchTextNode(dkdWalker.currentNode);
  }

  function dkdV3221Cleanup() {
    for (const dkdNode of document.querySelectorAll('.dkd-v3211-earnings-menu,.dkd-v3217-earnings-menu,.dkd-v3218-earnings-menu,.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]')) {
      if (!dkdV3221IsCanonicalEarnings(dkdNode)) dkdNode.remove();
    }
    for (const dkdNode of document.querySelectorAll('button,a,[role="button"],li,article')) {
      if (dkdV3221IsLegacyEarnings(dkdNode)) dkdNode.remove();
    }

    const dkdCanonical = [...document.querySelectorAll('.dkd-v3219-earnings-menu,.dkd-v3220-earnings-menu')];
    const dkdPrimary = dkdCanonical.shift();
    for (const dkdDuplicate of dkdCanonical) {
      if (dkdDuplicate !== dkdPrimary) dkdDuplicate.remove();
    }

    dkdV3221PatchRoot(document.body);
    document.documentElement.dataset.dkdGateVersion = DKD_V3221_VERSION;
    sessionStorage.setItem('dkd_gate_web_version', DKD_V3221_VERSION);
    window.__DKD_GATE_WEB_VERSION__ = DKD_V3221_VERSION;
  }

  let dkdV3221Queued = false;
  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3221PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3221PatchRoot(dkdNode);
    }
    if (dkdV3221Queued) return;
    dkdV3221Queued = true;
    requestAnimationFrame(() => {
      dkdV3221Queued = false;
      dkdV3221Cleanup();
    });
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  window.dkdV3221Cleanup = dkdV3221Cleanup;
  window.__DKD_GATE_V3221_GUARD__ = true;
  dkdV3221Cleanup();
})();
