(() => {
  'use strict';

  const REMOVAL_TARGETS = ['bırakılan motor'];
  const QUICK_SERVICE_LABEL = 'hızlı servis';
  const QUICK_BUTTON_CLASS = 'dkd-mechanic-quick-return';
  const normalize = (value = '') => String(value)
    .replace(/[+＋]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('tr-TR');

  const protectedArea = (element) => Boolean(element?.closest(
    '.dkd-topbar,.dkd-sidebar,.dkd-modal,.dkd-modal-root,#dkd-modal-root,.dkd-panel-switch'
  ));

  function panelMode() {
    const activeSwitch = document.querySelector('.dkd-panel-switch button.active');
    const topTitle = document.querySelector('.dkd-top-title strong');
    const pageTitle = document.querySelector('.dkd-page-head h1');
    const text = normalize(`${activeSwitch?.textContent || ''} ${topTitle?.textContent || ''} ${pageTitle?.textContent || ''}`);
    if (text.includes('işletme panel')) return 'business';
    if (text.includes('usta panel') || text.includes('usta panelim')) return 'mechanic';
    return 'other';
  }

  function containsRemovalTarget(value) {
    const text = normalize(value);
    return REMOVAL_TARGETS.some((target) => text.includes(target));
  }

  function directRemovalNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!containsRemovalTarget(node.nodeValue)) return NodeFilter.FILTER_REJECT;
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

  function removeObsoleteShortcut() {
    const root = document.querySelector('.dkd-content') || document.getElementById('dkd-app');
    if (!root) return;

    const candidates = new Set();
    directRemovalNodes(root).forEach((textNode) => {
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
      if (!containsRemovalTarget(labels) || protectedArea(element)) return;
      candidates.add(element.closest('button,a,[role="button"],article,.dkd-quick-card,.dkd-card') || element);
    });

    candidates.forEach((element) => {
      if (!element?.isConnected || protectedArea(element)) return;
      element.remove();
    });
  }

  function quickServiceControl(root) {
    const controls = [...root.querySelectorAll('button,a,[role="button"],article,.dkd-quick-card')]
      .filter((element) => !element.classList.contains(QUICK_BUTTON_CLASS))
      .filter((element) => normalize(element.textContent).includes(QUICK_SERVICE_LABEL));
    return controls.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length)[0] || null;
  }

  function ensureQuickButtonStyle() {
    if (document.getElementById('dkd-mechanic-quick-return-style')) return;
    const style = document.createElement('style');
    style.id = 'dkd-mechanic-quick-return-style';
    style.textContent = `
      .${QUICK_BUTTON_CLASS}{
        width:max-content!important;min-height:48px!important;margin:0 0 16px!important;padding:0 18px!important;
        display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;
        border:1px solid rgba(255,226,102,.78)!important;border-radius:16px!important;
        background:linear-gradient(135deg,#ffe45c 0%,#ffc400 47%,#ff9300 100%)!important;
        color:#211500!important;font-weight:900!important;letter-spacing:.01em!important;
        box-shadow:0 12px 32px rgba(255,166,0,.28),inset 0 1px 0 rgba(255,255,255,.65)!important;
        cursor:pointer!important;position:relative!important;z-index:3!important;
      }
      .${QUICK_BUTTON_CLASS}:active{transform:translateY(1px) scale(.985)!important}
      .${QUICK_BUTTON_CLASS} .dkd-quick-flash{font-size:18px;line-height:1}
      @media(max-width:560px){.${QUICK_BUTTON_CLASS}{min-height:44px!important;padding:0 15px!important;border-radius:14px!important;font-size:14px!important;margin-bottom:14px!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureQuickButton() {
    const root = document.querySelector('.dkd-content');
    const existing = document.querySelector(`.${QUICK_BUTTON_CLASS}`);
    if (!root || panelMode() !== 'mechanic') {
      existing?.remove();
      return;
    }

    const pageHead = root.querySelector('.dkd-page-head');
    if (!pageHead) return;
    ensureQuickButtonStyle();

    let button = existing;
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = `dkd-btn ${QUICK_BUTTON_CLASS}`;
      button.setAttribute('aria-label', 'Hızlı İşlem ekranını aç');
      button.innerHTML = '<span class="dkd-quick-flash" aria-hidden="true">⚡</span><span>Hızlı İşlem</span>';
      button.addEventListener('click', () => {
        const currentRoot = document.querySelector('.dkd-content');
        const target = currentRoot && quickServiceControl(currentRoot);
        if (!target) return;
        target.click();
      });
    }

    if (button.parentElement !== pageHead) pageHead.prepend(button);
  }

  function apply() {
    removeObsoleteShortcut();
    ensureQuickButton();
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
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
