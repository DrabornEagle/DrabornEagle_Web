(() => {
  'use strict';

  const cardSelector = [
    '.dkd-card','.dkd-panel','.dkd-stat-card','.dkd-quick-card','.dkd-list-card',
    '.dkd-detail-item','.dkd-service-card','.dkd-mechanic-card','.dkd-table-wrap'
  ].join(',');
  const enterSelector = ['.dkd-page-head','.dkd-hero-card',cardSelector].join(',');
  const accents = ['orange','cyan','violet','green','amber','red'];
  const decorated = new WeakSet();
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

  function ambient() {
    if (document.querySelector('.dkd-premium-ambient')) return;
    const layer = document.createElement('div');
    layer.className = 'dkd-premium-ambient';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = '<i></i><i></i><i></i>';
    document.body.prepend(layer);
  }

  function addScrews(card) {
    if (card.querySelector(':scope > .dkd-premium-screw')) return;
    const a = document.createElement('i');
    const b = document.createElement('i');
    a.className = 'dkd-premium-screw a';
    b.className = 'dkd-premium-screw b';
    a.setAttribute('aria-hidden','true');
    b.setAttribute('aria-hidden','true');
    card.append(a,b);
  }

  function addLivePill(root) {
    root.querySelectorAll('.dkd-page-head h1').forEach((title) => {
      if (title.querySelector('.dkd-live-pill')) return;
      const pill = document.createElement('span');
      pill.className = 'dkd-live-pill';
      pill.textContent = 'CANLI SENKRON';
      title.appendChild(pill);
    });
  }

  function addGauge(root) {
    root.querySelectorAll('.dkd-hero-card').forEach((hero) => {
      if (hero.querySelector('.dkd-premium-gauge')) return;
      const gauge = document.createElement('i');
      gauge.className = 'dkd-premium-gauge';
      gauge.setAttribute('aria-hidden','true');
      hero.appendChild(gauge);
    });
  }

  function decorate(root = document) {
    const cards = [];
    if (root instanceof Element && root.matches(cardSelector)) cards.push(root);
    root.querySelectorAll?.(cardSelector).forEach((el) => cards.push(el));
    cards.forEach((card,index) => {
      if (decorated.has(card)) return;
      decorated.add(card);
      card.classList.add('dkd-premium-card');
      card.dataset.accent = accents[index % accents.length];
      addScrews(card);
      if (finePointer && !card.classList.contains('dkd-table-wrap')) card.classList.add('dkd-premium-tilt');
    });

    const enters = [];
    if (root instanceof Element && root.matches(enterSelector)) enters.push(root);
    root.querySelectorAll?.(enterSelector).forEach((el) => enters.push(el));
    enters.forEach((el,index) => {
      if (el.dataset.premiumEntered) return;
      el.dataset.premiumEntered = '1';
      el.classList.add('dkd-premium-enter','is-visible');
      el.style.setProperty('--p-index',String(Math.min(index % 8,7)));
      el.addEventListener('animationend',() => {
        el.classList.remove('dkd-premium-enter','is-visible');
        el.style.removeProperty('--p-index');
      },{once:true});
    });
    addLivePill(root);
    addGauge(root);
  }

  function ripple(event) {
    if (reduceMotion) return;
    const button = event.target.closest('.dkd-btn,.dkd-nav-item,.dkd-panel-switch button,.dkd-modal-close');
    if (!button || button.disabled) return;
    const rect = button.getBoundingClientRect();
    const span = document.createElement('span');
    const size = Math.max(rect.width,rect.height);
    span.className = 'dkd-ripple';
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${event.clientX - rect.left}px`;
    span.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(span);
    span.addEventListener('animationend',() => span.remove(),{once:true});
  }

  function tilt(event) {
    const card = event.target.closest('.dkd-premium-tilt');
    if (!card || reduceMotion) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 3.2}deg) rotateY(${x * 4.2}deg) translateY(-5px)`;
  }

  function clearTilt(event) {
    const card = event.target.closest('.dkd-premium-tilt');
    if (card) card.style.removeProperty('transform');
  }

  function modalState() {
    document.body.classList.toggle('dkd-modal-open',Boolean(document.querySelector('.dkd-modal-backdrop')));
  }

  function boot() {
    document.documentElement.classList.add('dkd-motion-ready');
    ambient();
    decorate(document);
    modalState();
    document.addEventListener('pointerdown',ripple,{passive:true});
    if (finePointer) {
      document.addEventListener('pointermove',tilt,{passive:true});
      document.addEventListener('pointerout',clearTilt,{passive:true});
    }
    addEventListener('scroll',() => document.body.classList.toggle('dkd-scrolled',scrollY > 12),{passive:true});
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) decorate(node);
      }));
      modalState();
    }).observe(document.body,{childList:true,subtree:true});
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
