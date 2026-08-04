const DKD_V3210_SIMPLE_VERSION = '3.2.10';
const dkdV3210SimpleData = window.dkdV31Data;
const dkdV3210SimpleState = {
  queue: [],
  knownKeys: new Set(),
  notificationOpen: false,
  checking: false,
  pollTimer: 0,
};

function dkdV3210SimpleEscape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV3210SimpleIcon(dkdName) {
  const dkdIcons = {
    theme: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 21h8m-4-4v4" stroke="currentColor" stroke-width="1.8"/><path d="M7 8h10M7 12h6" stroke="currentColor" stroke-width="1.8"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7Z" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 20h5" stroke="currentColor" stroke-width="1.8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV3210PassKey(dkdPass) {
  return String(
    dkdPass?.id
    || dkdPass?.pass_id
    || dkdPass?.courier_pass_id
    || dkdPass?.approval_code
    || dkdPass?.order_number
    || [dkdPass?.courier_phone, dkdPass?.created_at].filter(Boolean).join('-')
    || JSON.stringify(dkdPass)
  );
}

function dkdV3210StatusLabel(dkdPass) {
  const dkdStatus = String(dkdPass?.status || '').toLocaleLowerCase('tr-TR');
  if (dkdStatus === 'arrived') return 'Kapıda';
  if (dkdStatus === 'approved') return 'Onay bekliyor';
  if (dkdStatus === 'waiting') return 'Yaklaşıyor';
  return dkdPass?.status || 'Aktif';
}

function dkdV3210PatchBrand() {
  const dkdBrand = document.querySelector('.dkd-v329-brand > span');
  if (!dkdBrand || dkdBrand.dataset.dkdV3210Brand === 'true') return;
  dkdBrand.dataset.dkdV3210Brand = 'true';
  dkdBrand.setAttribute('aria-label', 'DraBornGate');
}

function dkdV3210PatchHeader() {
  const dkdTopbar = document.querySelector('.dkd-v329-topbar');
  if (!dkdTopbar) return false;
  dkdV3210PatchBrand();

  let dkdActions = dkdTopbar.querySelector('.dkd-v3210-top-actions');
  if (!dkdActions) {
    dkdActions = document.createElement('div');
    dkdActions.className = 'dkd-v3210-top-actions';
    const dkdOldRefresh = dkdTopbar.querySelector('#dkd-v329-refresh');
    if (dkdOldRefresh) {
      dkdOldRefresh.id = 'dkd-v3210-theme';
      dkdOldRefresh.disabled = false;
      dkdOldRefresh.setAttribute('aria-label', 'Modern Temaya Geç');
      dkdOldRefresh.setAttribute('title', 'Modern Temaya Geç');
      dkdOldRefresh.innerHTML = dkdV3210SimpleIcon('theme');
      dkdActions.appendChild(dkdOldRefresh);
    } else {
      dkdActions.innerHTML = `<button type="button" id="dkd-v3210-theme" aria-label="Modern Temaya Geç" title="Modern Temaya Geç">${dkdV3210SimpleIcon('theme')}</button>`;
    }
    dkdActions.insertAdjacentHTML('beforeend', `<button type="button" id="dkd-v3210-bell" aria-label="Bildirimler" title="Bildirimler">${dkdV3210SimpleIcon('bell')}<span id="dkd-v3210-badge" hidden>0</span></button>`);
    dkdTopbar.appendChild(dkdActions);
  }

  if (!document.querySelector('#dkd-v3210-notifications')) {
    dkdTopbar.insertAdjacentHTML('afterend', `<section id="dkd-v3210-notifications" class="dkd-v3210-notifications" hidden aria-label="Kurye bildirimleri"><header><div><small>CANLI BİLDİRİMLER</small><h2>Kurye Geçişleri</h2></div><button type="button" data-dkd-v3210-notification-close aria-label="Bildirimleri kapat">${dkdV3210SimpleIcon('close')}</button></header><div id="dkd-v3210-notification-list"><p>Bildirimler hazırlanıyor…</p></div></section>`);
  }
  return true;
}

function dkdV3210RenderNotifications() {
  const dkdList = document.querySelector('#dkd-v3210-notification-list');
  const dkdBadge = document.querySelector('#dkd-v3210-badge');
  if (dkdBadge) {
    dkdBadge.textContent = String(Math.min(dkdV3210SimpleState.queue.length, 99));
    dkdBadge.hidden = dkdV3210SimpleState.queue.length === 0;
  }
  if (!dkdList) return;
  const dkdRows = dkdV3210SimpleState.queue.slice(0, 8);
  dkdList.innerHTML = dkdRows.length
    ? dkdRows.map((dkdPass) => `<article><span>${dkdV3210SimpleIcon('route')}</span><div><strong>${dkdV3210SimpleEscape(dkdPass.courier_name || 'Kurye')}</strong><small>${dkdV3210SimpleEscape([dkdPass.platform, dkdPass.courier_plate, dkdV3210StatusLabel(dkdPass)].filter(Boolean).join(' · '))}</small><p>${dkdV3210SimpleEscape(dkdPass.destination_full || dkdPass.site_name || 'Teslimat adresi bekleniyor')}</p></div></article>`).join('')
    : '<div class="dkd-v3210-notification-empty">Aktif kurye geçişi bulunmuyor.</div>';
}

function dkdV3210ToggleNotifications(dkdOpen) {
  const dkdPanel = document.querySelector('#dkd-v3210-notifications');
  if (!dkdPanel) return;
  dkdV3210SimpleState.notificationOpen = typeof dkdOpen === 'boolean' ? dkdOpen : !dkdV3210SimpleState.notificationOpen;
  dkdPanel.hidden = !dkdV3210SimpleState.notificationOpen;
  document.querySelector('#dkd-v3210-bell')?.setAttribute('aria-expanded', String(dkdV3210SimpleState.notificationOpen));
  if (dkdV3210SimpleState.notificationOpen) dkdV3210RenderNotifications();
}

function dkdV3210SwitchToModern() {
  sessionStorage.setItem('dkd_gate_security_theme', 'modern');
  sessionStorage.setItem('dkd_gate_force_theme', 'modern');
  sessionStorage.removeItem('dkd_gate_route');
  sessionStorage.removeItem('dkd_gate_clean_personal_route');
  location.replace(`/DraBornGate/?theme=modern&v=${DKD_V3210_SIMPLE_VERSION}`);
}

function dkdV3210EnhanceModal() {
  const dkdPanel = document.querySelector('#dkd-v329-modal:not([hidden]) .dkd-v329-panel');
  if (!dkdPanel || dkdPanel.dataset.dkdV3210Enhanced === 'true') return;
  dkdPanel.dataset.dkdV3210Enhanced = 'true';
  dkdPanel.classList.add('dkd-v3210-panel');

  const dkdMain = dkdPanel.querySelector(':scope > main');
  const dkdRoute = dkdMain?.querySelector('.dkd-v329-route');
  const dkdGrid = dkdMain?.querySelector('.dkd-v329-grid');
  if (dkdMain && !dkdMain.querySelector('.dkd-v3210-status-strip')) {
    dkdMain.insertAdjacentHTML('afterbegin', `<div class="dkd-v3210-status-strip"><span>${dkdV3210SimpleIcon('check')}<b>Kurye doğrulandı</b></span><span>${dkdV3210SimpleIcon('route')}<b>Rota kontrolü</b></span><span>${dkdV3210SimpleIcon('check')}<b>Giriş onayı</b></span></div>`);
  }
  if (dkdRoute && !dkdRoute.previousElementSibling?.classList.contains('dkd-v3210-section-title')) {
    dkdRoute.insertAdjacentHTML('beforebegin', '<div class="dkd-v3210-section-title"><small>01</small><div><strong>Teslimat Rotası</strong><span>Çıkış noktası ve hedef adres</span></div></div>');
  }
  if (dkdGrid && !dkdGrid.previousElementSibling?.classList.contains('dkd-v3210-section-title')) {
    dkdGrid.insertAdjacentHTML('beforebegin', '<div class="dkd-v3210-section-title"><small>02</small><div><strong>Detaylı Bilgiler</strong><span>Kimlik, sipariş ve konum bilgileri</span></div></div>');
  }
  for (const dkdDetail of dkdPanel.querySelectorAll('.dkd-v329-detail')) {
    const dkdLabel = String(dkdDetail.querySelector('small')?.textContent || '').toLocaleLowerCase('tr-TR');
    if (/kurye|platform|plaka|telefon/.test(dkdLabel)) dkdDetail.dataset.dkdV3210Tone = 'courier';
    else if (/müşteri|sipariş/.test(dkdLabel)) dkdDetail.dataset.dkdV3210Tone = 'order';
    else if (/site|kapı|blok|kat|daire/.test(dkdLabel)) dkdDetail.dataset.dkdV3210Tone = 'address';
    else if (/mesafe|varış|geliş/.test(dkdLabel)) dkdDetail.dataset.dkdV3210Tone = 'time';
    else dkdDetail.dataset.dkdV3210Tone = 'note';
  }
}

function dkdV3210NewPasses(dkdRows) {
  const dkdKeys = new Set(dkdRows.map(dkdV3210PassKey));
  if (dkdV3210SimpleState.knownKeys.size === 0) {
    dkdV3210SimpleState.knownKeys = dkdKeys;
    return [];
  }
  const dkdNew = dkdRows.filter((dkdPass) => !dkdV3210SimpleState.knownKeys.has(dkdV3210PassKey(dkdPass)));
  dkdV3210SimpleState.knownKeys = dkdKeys;
  return dkdNew;
}

async function dkdV3210CheckQueue() {
  if (dkdV3210SimpleState.checking || document.hidden) return;
  dkdV3210SimpleState.checking = true;
  try {
    if (typeof dkdV3210SimpleData?.loadQueue !== 'function') return;
    const dkdRows = await dkdV3210SimpleData.loadQueue();
    const dkdQueue = Array.isArray(dkdRows) ? dkdRows : [];
    const dkdNew = dkdV3210NewPasses(dkdQueue);
    dkdV3210SimpleState.queue = dkdQueue;
    dkdV3210RenderNotifications();
    if (dkdNew.length > 0) {
      sessionStorage.setItem('dkd_gate_v3210_auto_refresh_notice', `${dkdNew.length} yeni kurye geçişi`);
      location.reload();
    }
  } catch {
    // Ana Sade Tema hata görünümünü bozmamak için sessizce sonraki kontrolü bekle.
  } finally {
    dkdV3210SimpleState.checking = false;
  }
}

function dkdV3210ShowAutoRefreshNotice() {
  const dkdMessage = sessionStorage.getItem('dkd_gate_v3210_auto_refresh_notice');
  if (!dkdMessage || document.querySelector('#dkd-v3210-auto-notice')) return;
  sessionStorage.removeItem('dkd_gate_v3210_auto_refresh_notice');
  const dkdRoot = document.querySelector('#dkd-v329-simple-root');
  dkdRoot?.insertAdjacentHTML('afterbegin', `<div id="dkd-v3210-auto-notice" class="dkd-v3210-auto-notice">${dkdV3210SimpleIcon('check')}<span>${dkdV3210SimpleEscape(dkdMessage)} geldi; ekran otomatik yenilendi.</span><button type="button" data-dkd-v3210-notice-close>${dkdV3210SimpleIcon('close')}</button></div>`);
}

function dkdV3210BindEvents() {
  document.addEventListener('click', (dkdEvent) => {
    const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
    if (!dkdTarget) return;
    if (dkdTarget.closest('#dkd-v3210-theme')) {
      dkdV3210SwitchToModern();
      return;
    }
    if (dkdTarget.closest('#dkd-v3210-bell')) {
      dkdV3210ToggleNotifications();
      return;
    }
    if (dkdTarget.closest('[data-dkd-v3210-notification-close]')) {
      dkdV3210ToggleNotifications(false);
      return;
    }
    if (dkdTarget.closest('[data-dkd-v3210-notice-close]')) dkdTarget.closest('#dkd-v3210-auto-notice')?.remove();
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void dkdV3210CheckQueue();
  });
  window.addEventListener('focus', () => void dkdV3210CheckQueue());
}

function dkdV3210BootSimplePatch() {
  if (!dkdV3210SimpleData) throw new Error('DraBornGate v3.2.10 canlı veri katmanı başlatılamadı.');
  dkdV3210PatchHeader();
  dkdV3210ShowAutoRefreshNotice();
  dkdV3210BindEvents();
  dkdV3210EnhanceModal();
  new MutationObserver(() => {
    dkdV3210PatchHeader();
    dkdV3210EnhanceModal();
  }).observe(document.body, { childList: true, subtree: true });
  void dkdV3210CheckQueue();
  dkdV3210SimpleState.pollTimer = window.setInterval(dkdV3210CheckQueue, 10000);
  document.documentElement.dataset.dkdGateVersion = DKD_V3210_SIMPLE_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3210_SIMPLE_VERSION);
}

dkdV3210BootSimplePatch();
