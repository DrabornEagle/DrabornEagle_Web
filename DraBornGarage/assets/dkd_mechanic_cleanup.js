(() => {
  'use strict';

  const HIDDEN_CLASS = 'dkd-force-hidden';
  const normalize = (value = '') => value.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');

  function getPanelMode() {
    const activeSwitch = document.querySelector('.dkd-panel-switch button.active');
    const topTitle = document.querySelector('.dkd-top-title strong');
    const pageTitle = document.querySelector('.dkd-page-head h1');
    const text = normalize(`${activeSwitch?.textContent || ''} ${topTitle?.textContent || ''} ${pageTitle?.textContent || ''}`);
    if (text.includes('işletme panel')) return 'business';
    if (text.includes('usta panel') || text.includes('usta panelim')) return 'mechanic';
    return 'other';
  }

  function labelNodes(root, phrase) {
    return [...root.querySelectorAll('button,a,strong,b,h1,h2,h3,h4,span,p,div')]
      .filter((element) => normalize(element.textContent).includes(phrase));
  }

  function looksLikeCard(element, root) {
    if (!element || element === root) return false;
    const className = typeof element.className === 'string' ? element.className : '';
    if (/(quick|action|shortcut|tile|card)/i.test(className)) return true;
    if (element.matches('button,a,article,section')) {
      const style = getComputedStyle(element);
      const radius = Number.parseFloat(style.borderRadius) || 0;
      return radius >= 10;
    }
    return false;
  }

  function closestVisualCard(node, root) {
    let current = node;
    let fallback = null;
    while (current && current !== root) {
      if (!fallback && current.matches('button,a,article,section')) fallback = current;
      if (looksLikeCard(current, root)) return current;
      current = current.parentElement;
    }
    return fallback || node.parentElement;
  }

  function hideCardForPhrase(root, phrase) {
    const nodes = labelNodes(root, phrase).sort((a, b) => b.querySelectorAll('*').length - a.querySelectorAll('*').length);
    const deepest = nodes[nodes.length - 1];
    if (!deepest) return;
    const card = closestVisualCard(deepest, root);
    if (card && !card.closest('.dkd-topbar,.dkd-sidebar,.dkd-modal')) {
      card.classList.add(HIDDEN_CLASS);
      card.setAttribute('aria-hidden', 'true');
    }
  }

  function hideCombinedQuickContainer(root) {
    const quick = labelNodes(root, 'hızlı servis').pop();
    const dropped = labelNodes(root, 'bırakılan motor').pop();
    if (!quick || !dropped) return false;

    let container = quick.parentElement;
    while (container && container !== root) {
      const text = normalize(container.textContent);
      if (text.includes('hızlı servis') && text.includes('bırakılan motor')) {
        const childCards = [...container.children].filter((child) => looksLikeCard(child, root));
        if (childCards.length >= 2 || /(grid|quick|action|shortcut)/i.test(container.className || '')) {
          container.classList.add(HIDDEN_CLASS);
          container.setAttribute('aria-hidden', 'true');
          return true;
        }
      }
      container = container.parentElement;
    }
    return false;
  }

  function cleanup() {
    const root = document.querySelector('.dkd-content');
    if (!root) return;

    root.querySelectorAll(`.${HIDDEN_CLASS}`).forEach((element) => {
      element.classList.remove(HIDDEN_CLASS);
      element.removeAttribute('aria-hidden');
    });

    const mode = getPanelMode();
    if (mode === 'mechanic') {
      if (!hideCombinedQuickContainer(root)) {
        hideCardForPhrase(root, 'hızlı servis');
        hideCardForPhrase(root, 'bırakılan motor');
      }
    } else if (mode === 'business') {
      labelNodes(root, 'hızlı servis').forEach((node) => {
        const card = closestVisualCard(node, root);
        if (card && !card.closest('.dkd-topbar,.dkd-sidebar,.dkd-modal')) {
          card.classList.add(HIDDEN_CLASS);
          card.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      cleanup();
    });
  };

  document.addEventListener('click', (event) => {
    if (event.target.closest('.dkd-panel-switch,.dkd-nav-item,.dkd-mobile-menu,.dkd-btn')) {
      setTimeout(schedule, 0);
      setTimeout(schedule, 160);
      setTimeout(schedule, 500);
    }
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();
