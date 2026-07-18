(() => {
  'use strict';

  const VERSION = '1.5';
  const VERSION_PATTERN = /\bWEB\s+v?1\.(?:0|1|2|3|4)\b/gi;

  function updateTextNode(node) {
    if (!node?.nodeValue) return;
    VERSION_PATTERN.lastIndex = 0;
    if (!VERSION_PATTERN.test(node.nodeValue)) return;
    VERSION_PATTERN.lastIndex = 0;
    node.nodeValue = node.nodeValue.replace(VERSION_PATTERN, `WEB v${VERSION}`);
  }

  function scan(root = document.body) {
    if (!root) return;
    document.documentElement.dataset.webVersion = VERSION;

    if (root.nodeType === Node.TEXT_NODE) {
      updateTextNode(root);
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) updateTextNode(walker.currentNode);
  }

  scan(document.body);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => scan(node));
      if (mutation.type === 'characterData') updateTextNode(mutation.target);
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
