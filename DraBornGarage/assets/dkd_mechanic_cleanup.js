(() => {
  'use strict';

  const TARGETS = ['hızlı servis', 'bırakılan motor'];
  const normalize = (value = '') => String(value)
    .replace(/[+＋]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('tr-TR');

  const protectedArea = (element) => Boolean(element?.closest(
    '.dkd-topbar,.dkd-sidebar,.dkd-modal,.dkd-modal-root,#dkd-modal-root,.dkd-panel-switch'
  ));

  function containsTarget(value) {
    const text = normalize(value);
    return TARGETS.some((target) => text.includes(target));
  }

  function directTargetNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!containsTarget(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || protectedArea(parent)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function removalCandidate(textNode, root) {
    let element = textNode.parentElement;
    let compactFallback = null;

    while (element && element !== root) {
      if (protectedArea(element)) return null;

      const className = typeof element.className === 'string' ? element.className : '';
      const text = normalize(element.textContent);
      const isInteractive = element.matches('button,a,[role="button"],article');
      const isShortcut = /(quick|shortcut|action|tile|service-card|menu-card)/i.test(className);
      const isCompactCard = /(^|\s)dkd-card(\s|$)/i.test(className) && text.length <= 140;

      if (isInteractive || isShortcut || isCompactCard) return element;
      if (!compactFallback && text.length <= 90 && element.children.length <= 5) compactFallback = element;
      element = element.parentElement;
    }

    return compactFallback;
  }

  function removeObsoleteShortcuts() {
    const root = document.querySelector('.dkd-content') || document.getElementById('dkd-app');
    if (!root) return;

    const candidates = new Set();
    directTargetNodes(root).forEach((textNode) => {
      const candidate = removalCandidate(textNode, root);
      if (candidate) candidates.add(candidate);
    });

    root.querySelectorAll('[aria-label],[title],[data-label],[data-action]').forEach((element) => {
      const labels = [
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.getAttribute('data-label'),
        element.getAttribute('data-action')
      ].filter(Boolean).join(' ');
      if (!containsTarget(labels) || protectedArea(element)) return;
      candidates.add(element.closest('button,a,[role="button"],article,.dkd-quick-card,.dkd-card') || element);
    });

    candidates.forEach((element) => {
      if (!element?.isConnected || protectedArea(element)) return;
      element.remove();
    });
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      removeObsoleteShortcuts();
    });
  }

  document.addEventListener('click', () => {
    setTimeout(schedule, 0);
    setTimeout(schedule, 120);
    setTimeout(schedule, 400);
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
