(() => {
  if (window.__DKD_GATE_V3220_GUARD__) {
    window.dkdV3219Cleanup = () => window.dkdV3220Cleanup?.();
    window.__DKD_GATE_V3219_GUARD__ = true;
    return;
  }

  const DKD_V3219_VERSION = '3.2.19';
  const dkdV3219NativeAppendChild = Node.prototype.appendChild;
  const dkdV3219NativeInsertBefore = Node.prototype.insertBefore;
  const dkdV3219NativeInsertAdjacentElement = Element.prototype.insertAdjacentElement;

  function dkdV3219Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV3219IsCanonicalEarnings(dkdNode) {
    return dkdNode instanceof Element && (
      dkdNode.classList.contains('dkd-v3219-earnings-menu')
      || Boolean(dkdNode.closest('#dkd-v3211-earnings,#dkd-v328-modal'))
    );
  }

  function dkdV3219IsLegacyEarnings(dkdNode) {
    if (!(dkdNode instanceof Element) || dkdV3219IsCanonicalEarnings(dkdNode)) return false;
    if (dkdNode.matches('.dkd-v3211-earnings-menu,.dkd-v3217-earnings-menu,.dkd-v3218-earnings-menu,.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]')) return true;
    if (!dkdNode.matches('button,a,[role="button"],li,article')) return false;
    return dkdV3219Normalize(dkdNode.textContent) === 'kazanclarim';
  }

  function dkdV3219ShouldBlock(dkdNode) {
    return dkdV3219IsLegacyEarnings(dkdNode);
  }

  Node.prototype.appendChild = function dkdV3219AppendChild(dkdNode) {
    if (dkdV3219ShouldBlock(dkdNode)) return dkdNode;
    return dkdV3219NativeAppendChild.call(this, dkdNode);
  };

  Node.prototype.insertBefore = function dkdV3219InsertBefore(dkdNode, dkdReference) {
    if (dkdV3219ShouldBlock(dkdNode)) return dkdNode;
    return dkdV3219NativeInsertBefore.call(this, dkdNode, dkdReference);
  };

  Element.prototype.insertAdjacentElement = function dkdV3219InsertAdjacentElement(dkdPosition, dkdElement) {
    if (dkdV3219ShouldBlock(dkdElement)) return dkdElement;
    return dkdV3219NativeInsertAdjacentElement.call(this, dkdPosition, dkdElement);
  };

  function dkdV3219ReplaceVersion(dkdText) {
    const dkdValue = String(dkdText || '');
    if (!/(?:draborngate|\bweb\s*v|\bweb\s+v)/i.test(dkdValue)) return dkdValue;
    return dkdValue.replace(/(?:DraBornGate\s+Web\s+)?v(?:2(?:\.\d+){0,2}|3(?:\.\d+){1,2})\b/gi, (dkdMatch) => (
      /draborngate\s+web/i.test(dkdMatch) ? `DraBornGate Web v${DKD_V3219_VERSION}` : `v${DKD_V3219_VERSION}`
    ));
  }

  function dkdV3219PatchTextNode(dkdNode) {
    if (!(dkdNode instanceof Text) || /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) return;
    const dkdUpdated = dkdV3219ReplaceVersion(dkdNode.nodeValue);
    if (dkdUpdated !== dkdNode.nodeValue) dkdNode.nodeValue = dkdUpdated;
  }

  function dkdV3219PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot instanceof Text) {
      dkdV3219PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    if (dkdRoot instanceof Element && /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdRoot.tagName)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV3219PatchTextNode(dkdWalker.currentNode);
  }

  function dkdV3219Cleanup() {
    for (const dkdNode of document.querySelectorAll('.dkd-v3211-earnings-menu,.dkd-v3217-earnings-menu,.dkd-v3218-earnings-menu,.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]')) {
      if (!dkdV3219IsCanonicalEarnings(dkdNode)) dkdNode.remove();
    }
    for (const dkdNode of document.querySelectorAll('button,a,[role="button"],li,article')) {
      if (dkdV3219IsLegacyEarnings(dkdNode)) dkdNode.remove();
    }
    dkdV3219PatchRoot(document.body);
    document.documentElement.dataset.dkdGateVersion = DKD_V3219_VERSION;
    sessionStorage.setItem('dkd_gate_web_version', DKD_V3219_VERSION);
    window.__DKD_GATE_WEB_VERSION__ = DKD_V3219_VERSION;
  }

  let dkdV3219Queued = false;
  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV3219PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV3219PatchRoot(dkdNode);
    }
    if (dkdV3219Queued) return;
    dkdV3219Queued = true;
    requestAnimationFrame(() => {
      dkdV3219Queued = false;
      dkdV3219Cleanup();
    });
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  window.dkdV3219Cleanup = dkdV3219Cleanup;
  window.__DKD_GATE_V3219_GUARD__ = true;
  dkdV3219Cleanup();
})();
