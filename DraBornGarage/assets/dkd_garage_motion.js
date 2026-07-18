(() => {
  'use strict';

  const revealSelectors = [
    '.dkd-page-head', '.dkd-hero-card', '.dkd-stat-card', '.dkd-quick-card',
    '.dkd-card', '.dkd-panel', '.dkd-list-card', '.dkd-table-wrap',
    '.dkd-detail-item', '.dkd-service-card', '.dkd-mechanic-card'
  ].join(',');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observed = new WeakSet();

  const observer = reduceMotion ? null : new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('dkd-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  function enhance(root = document) {
    const elements = [];
    if (root instanceof Element && root.matches(revealSelectors)) elements.push(root);
    root.querySelectorAll?.(revealSelectors).forEach((element) => elements.push(element));

    elements.forEach((element, index) => {
      if (observed.has(element)) return;
      observed.add(element);
      element.classList.add('dkd-reveal');
      element.style.setProperty('--dkd-stagger', String(Math.min(index % 8, 7)));
      if (observer) {
        element.addEventListener('animationend', () => {
          element.classList.remove('dkd-reveal', 'dkd-visible');
          element.style.removeProperty('--dkd-stagger');
        }, { once: true });
        observer.observe(element);
      } else {
        element.classList.remove('dkd-reveal');
        element.classList.add('dkd-visible');
      }
    });
  }

  function addRipple(event) {
    const button = event.target.closest('.dkd-btn, .dkd-nav-item, .dkd-panel-switch button');
    if (!button || button.disabled || reduceMotion) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'dkd-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  function syncModalState() {
    document.body.classList.toggle('dkd-modal-open', Boolean(document.querySelector('.dkd-modal-backdrop')));
  }

  function boot() {
    document.documentElement.classList.add('dkd-motion-ready');
    enhance(document);
    syncModalState();

    document.addEventListener('pointerdown', addRipple, { passive: true });
    window.addEventListener('scroll', () => {
      document.body.classList.toggle('dkd-scrolled', window.scrollY > 14);
    }, { passive: true });

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) enhance(node);
        });
      }
      syncModalState();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
