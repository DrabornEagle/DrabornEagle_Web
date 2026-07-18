(() => {
  'use strict';

  const INITIAL_LIMIT = 4;
  const PAGE_STEP = 5;
  const SECTION_LABELS = ['son işler', 'zaman çizelgesi', 'iş emirleri', 'müşteri hafızası'];
  const ITEM_SELECTOR = '.dkd-list-card,.dkd-timeline-item,.dkd-table tbody tr,.dkd-memory-card,.dkd-work-order-card,.dkd-customer-card';
  const limits = new Map();
  let scheduled = false;

  const normalize = (value = '') => value
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('tr-TR');

  const isTargetTitle = (element) => SECTION_LABELS.includes(normalize(element.textContent));

  function panelMode() {
    const active = document.querySelector('.dkd-panel-switch button.active');
    const topTitle = document.querySelector('.dkd-top-title strong');
    const text = normalize(active?.textContent || topTitle?.textContent || '');
    if (text.includes('işletme')) return 'business';
    if (text.includes('usta')) return 'mechanic';
    return 'other';
  }

  function removeQuickCards() {
    const content = document.querySelector('.dkd-content');
    if (!content) return;

    const mode = panelMode();
    content.querySelectorAll('.dkd-rule-quick-hidden').forEach((element) => {
      element.classList.remove('dkd-rule-quick-hidden');
      element.removeAttribute('aria-hidden');
    });

    const quickCards = [...content.querySelectorAll('.dkd-quick-card')];
    for (const card of quickCards) {
      const text = normalize(card.textContent);
      const isQuickService = text.includes('hızlı servis');
      const isDroppedBike = text.includes('bırakılan motor');
      const shouldHide = mode === 'business'
        ? isQuickService
        : mode === 'mechanic' && (isQuickService || isDroppedBike);

      if (shouldHide) {
        card.classList.add('dkd-rule-quick-hidden');
        card.setAttribute('aria-hidden', 'true');
      }
    }

    if (mode === 'business') {
      content.querySelectorAll('.dkd-page-actions .dkd-btn,.dkd-page-actions button,.dkd-page-actions a').forEach((control) => {
        if (normalize(control.textContent).includes('hızlı servis')) {
          control.classList.add('dkd-rule-quick-hidden');
          control.setAttribute('aria-hidden', 'true');
        }
      });
    }

    content.querySelectorAll('.dkd-quick-grid').forEach((grid) => {
      const hasVisibleCard = [...grid.children].some((child) => !child.classList.contains('dkd-rule-quick-hidden'));
      grid.classList.toggle('dkd-rule-quick-hidden', !hasVisibleCard);
      if (!hasVisibleCard) grid.setAttribute('aria-hidden', 'true');
      else grid.removeAttribute('aria-hidden');
    });
  }

  function targetHeadings(scope = document) {
    return [...scope.querySelectorAll('.dkd-content h1,.dkd-content h2,.dkd-content h3,.dkd-content h4,.dkd-modal-body h1,.dkd-modal-body h2,.dkd-modal-body h3,.dkd-modal-body h4')]
      .filter(isTargetTitle);
  }

  function sectionKey(title, occurrence) {
    return `${location.pathname}|${normalize(title.textContent)}|${occurrence}`;
  }

  function nextTargetHeading(title, scope) {
    return targetHeadings(scope).find((candidate) => {
      if (candidate === title) return false;
      return Boolean(title.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING);
    }) || null;
  }

  function collectItems(title) {
    const scope = title.closest('.dkd-modal-body,.dkd-content') || document;
    const boundary = nextTargetHeading(title, scope);
    const candidates = [...scope.querySelectorAll(ITEM_SELECTOR)];
    const unique = [];
    const seen = new Set();

    for (const item of candidates) {
      const afterTitle = Boolean(title.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING);
      if (!afterTitle) continue;
      if (boundary) {
        const afterBoundary = Boolean(boundary.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING);
        if (afterBoundary) continue;
      }
      if (item.closest('.dkd-sidebar,.dkd-topbar')) continue;
      if (!seen.has(item)) {
        seen.add(item);
        unique.push(item);
      }
    }
    return unique;
  }

  function existingHeaderAction(title) {
    const header = title.closest('.dkd-section-head,.dkd-section-title,.dkd-card-head,.dkd-page-head') || title.parentElement;
    if (!header) return null;
    return [...header.querySelectorAll('button,a')].find((control) => {
      const text = normalize(control.textContent);
      return text === 'tümünü gör' || text === 'daha fazla';
    }) || null;
  }

  function pagerAnchor(items) {
    if (!items.length) return null;
    const first = items[0];
    if (first.tagName === 'TR') return first.closest('.dkd-table-wrap') || first.closest('table');
    return first.parentElement;
  }

  function ensurePager(title, items, key) {
    let button = existingHeaderAction(title);
    if (button) {
      button.dataset.dkdMoreKey = key;
      button.textContent = 'Daha Fazla';
      button.classList.add('dkd-more-link');
      return button;
    }

    const scope = title.closest('.dkd-modal-body,.dkd-content') || document;
    button = scope.querySelector(`[data-dkd-more-key="${CSS.escape(key)}"]`);
    if (button) return button;

    const anchor = pagerAnchor(items);
    if (!anchor) return null;

    const wrap = document.createElement('div');
    wrap.className = 'dkd-inline-pagination';
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'dkd-btn ghost dkd-more-button';
    button.dataset.dkdMoreKey = key;
    button.innerHTML = '<span>Daha Fazla</span><b>+5</b>';
    wrap.appendChild(button);
    anchor.insertAdjacentElement('afterend', wrap);
    return button;
  }

  function applyPagination() {
    const headings = targetHeadings();
    const counts = new Map();

    headings.forEach((title) => {
      const label = normalize(title.textContent);
      const occurrence = counts.get(label) || 0;
      counts.set(label, occurrence + 1);
      const key = sectionKey(title, occurrence);
      const items = collectItems(title);
      if (!items.length) return;

      const limit = limits.get(key) || INITIAL_LIMIT;
      items.forEach((item, index) => {
        item.classList.add('dkd-paged-item');
        item.hidden = index >= limit;
      });

      const pager = ensurePager(title, items, key);
      if (!pager) return;
      const remaining = Math.max(0, items.length - limit);
      pager.hidden = remaining === 0;
      pager.setAttribute('aria-label', remaining ? `${label} için ${Math.min(PAGE_STEP, remaining)} kayıt daha göster` : 'Tüm kayıtlar gösteriliyor');
      if (pager.classList.contains('dkd-more-button')) {
        const badge = pager.querySelector('b');
        if (badge) badge.textContent = `+${Math.min(PAGE_STEP, remaining)}`;
      }
    });
  }

  function applyRules() {
    scheduled = false;
    removeQuickCards();
    applyPagination();
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(applyRules);
  }

  document.addEventListener('click', (event) => {
    const more = event.target.closest('[data-dkd-more-key]');
    if (more) {
      event.preventDefault();
      event.stopPropagation();
      const key = more.dataset.dkdMoreKey;
      limits.set(key, (limits.get(key) || INITIAL_LIMIT) + PAGE_STEP);
      applyPagination();
      return;
    }

    if (event.target.closest('.dkd-panel-switch button,.dkd-nav-item,.dkd-mobile-menu')) {
      setTimeout(scheduleApply, 0);
      setTimeout(scheduleApply, 180);
    }
  }, true);

  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleApply, { once: true });
  } else {
    scheduleApply();
  }
})();
