const DKD_V329_SIMPLE_VERSION = '3.2.9';
const dkdV329SimpleRoot = document.querySelector('#dkd-app');
const dkdV329SimpleData = window.dkdV31Data;

const dkdV329SimpleState = {
  queue: [],
  queueLoaded: false,
  queueError: '',
  lastSync: null,
  busy: false,
  limits: { arrived: 3, approaching: 3, other: 3 },
  modalPass: null,
  modalCode: '',
};

function dkdV329SimpleEscape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV329SimpleIcon(dkdName) {
  const dkdIcons = {
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="16" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 13 9-9m-3 3 3 3m-6 0 3 3" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h3l1.2 4-2 1.4a15 15 0 0 0 6.4 6.4l1.4-2 4 1.2v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="1.7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.1 7-12A7 7 0 0 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="2"/></svg>',
    switch: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" stroke="currentColor" stroke-width="1.9"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 5H5v14h5M13 8l4 4-4 4m4-4H9" stroke="currentColor" stroke-width="1.9"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV329SimpleReadableError(dkdError) {
  return dkdV329SimpleData?.readableError?.(dkdError)
    || dkdError?.message
    || String(dkdError || 'Beklenmeyen hata oluştu.');
}

function dkdV329SimpleFormatDate(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime())
    ? String(dkdValue)
    : dkdDate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
}

function dkdV329SimpleStatusLabel(dkdStatus) {
  return ({ arrived: 'Kapıda', waiting: 'Yaklaşıyor', approved: 'Onay Bekliyor', completed: 'Tamamlandı' })[dkdStatus]
    || String(dkdStatus || 'Aktif');
}

function dkdV329SimpleSetFeedback(dkdType = '', dkdText = '') {
  const dkdFeedback = document.querySelector('#dkd-v329-feedback');
  if (!dkdFeedback) return;
  dkdFeedback.hidden = !dkdText;
  dkdFeedback.className = `dkd-v329-feedback ${dkdType}`.trim();
  dkdFeedback.textContent = dkdText;
}

function dkdV329SimpleQueueCard(dkdPass) {
  return `<article class="dkd-v329-queue-card">
    <div class="dkd-v329-queue-card-head">
      <div><h3>${dkdV329SimpleEscape(dkdPass.courier_name)}</h3><p>${dkdV329SimpleEscape([dkdPass.platform, dkdPass.courier_plate].filter(Boolean).join(' · '))}</p></div>
      <span class="dkd-v329-status">${dkdV329SimpleEscape(dkdV329SimpleStatusLabel(dkdPass.status))}</span>
    </div>
    <dl>
      <div><dt>MÜŞTERİ</dt><dd>${dkdV329SimpleEscape(dkdPass.customer_name)}</dd></div>
      <div><dt>SİPARİŞ</dt><dd>${dkdV329SimpleEscape(dkdPass.order_number)}</dd></div>
      <div><dt>ADRES</dt><dd>${dkdV329SimpleEscape(dkdPass.destination_full)}</dd></div>
      <div><dt>KOD</dt><dd>${dkdV329SimpleEscape(dkdPass.approval_code || '—')}</dd></div>
    </dl>
    <button type="button" data-dkd-v329-open-pass="${dkdV329SimpleEscape(dkdPass.pass_id || '')}">Tüm Bilgileri Aç</button>
  </article>`;
}

function dkdV329SimpleCategory(dkdKey, dkdTitle, dkdRows) {
  const dkdLimit = dkdV329SimpleState.limits[dkdKey] || 3;
  const dkdVisible = dkdRows.slice(0, dkdLimit);
  const dkdRemaining = Math.max(0, dkdRows.length - dkdVisible.length);
  return `<details class="dkd-v329-category" data-dkd-v329-category="${dkdKey}">
    <summary><span><strong>${dkdV329SimpleEscape(dkdTitle)}</strong> <small>${dkdRows.length} kurye</small></span>${dkdV329SimpleIcon('chevron')}</summary>
    <div class="dkd-v329-category-body">
      ${dkdVisible.length ? dkdVisible.map(dkdV329SimpleQueueCard).join('') : '<div class="dkd-v329-empty">Bu kategoride aktif kurye yok.</div>'}
      ${dkdRemaining ? `<button type="button" class="dkd-v329-more" data-dkd-v329-more="${dkdKey}">${dkdV329SimpleIcon('plus')} 5 Kayıt Daha Göster</button>` : ''}
    </div>
  </details>`;
}

function dkdV329SimpleRenderQueue() {
  const dkdQueueRoot = document.querySelector('#dkd-v329-queue-list');
  const dkdCount = document.querySelector('#dkd-v329-queue-count');
  const dkdSync = document.querySelector('#dkd-v329-last-sync');
  if (!dkdQueueRoot || !dkdCount || !dkdSync) return;

  dkdCount.textContent = `${dkdV329SimpleState.queue.length} aktif`;
  dkdSync.textContent = dkdV329SimpleState.lastSync
    ? `Son güncelleme ${dkdV329SimpleState.lastSync.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
    : 'Canlı bağlantı hazırlanıyor';

  if (dkdV329SimpleState.queueError) {
    dkdQueueRoot.innerHTML = `<div class="dkd-v329-empty">${dkdV329SimpleEscape(dkdV329SimpleState.queueError)}<br><button type="button" class="dkd-v329-more" id="dkd-v329-retry-queue">Tekrar Dene</button></div>`;
    document.querySelector('#dkd-v329-retry-queue')?.addEventListener('click', () => void dkdV329SimpleRefreshQueue());
    return;
  }

  const dkdArrived = dkdV329SimpleState.queue.filter((dkdPass) => dkdPass.category === 'arrived');
  const dkdApproaching = dkdV329SimpleState.queue.filter((dkdPass) => dkdPass.category === 'approaching');
  const dkdOther = dkdV329SimpleState.queue.filter((dkdPass) => dkdPass.category === 'other');
  dkdQueueRoot.innerHTML = [
    dkdV329SimpleCategory('arrived', 'Kapıda Bekleyenler', dkdArrived),
    dkdV329SimpleCategory('approaching', 'Yaklaşan / Onay Bekleyenler', dkdApproaching),
    dkdOther.length ? dkdV329SimpleCategory('other', 'Diğer Aktif Geçişler', dkdOther) : '',
  ].join('');

  for (const dkdButton of document.querySelectorAll('[data-dkd-v329-more]')) {
    dkdButton.addEventListener('click', () => {
      const dkdKey = dkdButton.dataset.dkdV329More;
      dkdV329SimpleState.limits[dkdKey] = (dkdV329SimpleState.limits[dkdKey] || 3) + 5;
      dkdV329SimpleRenderQueue();
      document.querySelector(`[data-dkd-v329-category="${dkdKey}"]`)?.setAttribute('open', '');
    });
  }

  for (const dkdButton of document.querySelectorAll('[data-dkd-v329-open-pass]')) {
    dkdButton.addEventListener('click', () => {
      const dkdPassId = dkdButton.dataset.dkdV329OpenPass;
      const dkdPass = dkdV329SimpleState.queue.find((dkdRow) => String(dkdRow.pass_id || '') === String(dkdPassId || ''));
      if (dkdPass) dkdV329SimpleOpenPassModal(dkdPass, dkdPass.approval_code);
    });
  }
}

async function dkdV329SimpleRefreshQueue() {
  if (typeof dkdV329SimpleData?.loadQueue !== 'function') {
    dkdV329SimpleState.queueError = 'Canlı kurye veri servisi başlatılamadı.';
    dkdV329SimpleRenderQueue();
    return;
  }
  try {
    dkdV329SimpleState.queueError = '';
    const dkdRows = await dkdV329SimpleData.loadQueue();
    dkdV329SimpleState.queue = Array.isArray(dkdRows) ? dkdRows : [];
    dkdV329SimpleState.queueLoaded = true;
    dkdV329SimpleState.lastSync = new Date();
  } catch (dkdError) {
    dkdV329SimpleState.queueError = dkdV329SimpleReadableError(dkdError);
  }
  dkdV329SimpleRenderQueue();
}

function dkdV329SimpleDetail(dkdLabel, dkdValue, dkdIcon = 'user', dkdWide = false) {
  return `<article class="dkd-v329-detail ${dkdWide ? 'wide' : ''}"><span>${dkdV329SimpleIcon(dkdIcon)}</span><div><small>${dkdV329SimpleEscape(dkdLabel)}</small><strong>${dkdV329SimpleEscape(dkdValue || '—')}</strong></div></article>`;
}

function dkdV329SimpleModalRoot() {
  return document.querySelector('#dkd-v329-modal');
}

function dkdV329SimpleCloseModal() {
  const dkdModal = dkdV329SimpleModalRoot();
  if (!dkdModal) return;
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  dkdV329SimpleState.modalPass = null;
  dkdV329SimpleState.modalCode = '';
  document.body.classList.remove('dkd-v329-modal-open');
}

function dkdV329SimpleBindModalClose() {
  for (const dkdClose of document.querySelectorAll('[data-dkd-v329-close]')) {
    dkdClose.addEventListener('click', dkdV329SimpleCloseModal);
  }
}

function dkdV329SimpleOpenPassModal(dkdPass, dkdCode) {
  const dkdModal = dkdV329SimpleModalRoot();
  if (!dkdModal) return;
  const dkdDestination = dkdPass.destination_full
    || [dkdPass.site_name, dkdPass.gate, dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' · ')
    || '—';
  const dkdOrigin = [dkdPass.origin_name, dkdPass.origin_address].filter(Boolean).join(' · ') || '—';
  const dkdDistance = dkdPass.distance_m || dkdPass.distance_m === 0 ? `${dkdPass.distance_m} m` : '—';
  const dkdEta = dkdPass.eta_minutes || dkdPass.eta_minutes === 0 ? `${dkdPass.eta_minutes} dk` : '—';
  dkdV329SimpleState.modalPass = dkdPass;
  dkdV329SimpleState.modalCode = String(dkdCode || dkdPass.approval_code || '').replace(/\D/g, '').slice(0, 6);
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v329-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v329-modal-backdrop" data-dkd-v329-close></div>
    <section class="dkd-v329-modal-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v329-modal-title">
      <header><div><span>KODLA KURYE DOĞRULAMA</span><h2 id="dkd-v329-modal-title">Kurye Bilgileri</h2><p>Giriş vermeden önce bütün teslimat bilgilerini kontrol edin.</p></div><button type="button" class="dkd-v329-modal-close" data-dkd-v329-close aria-label="Kapat">${dkdV329SimpleIcon('close')}</button></header>
      <main>
        <div class="dkd-v329-pass-hero"><div class="dkd-v329-pass-avatar">${dkdV329SimpleIcon('user')}</div><div><small>KURYE</small><h3>${dkdV329SimpleEscape(dkdPass.courier_name || 'Kurye')}</h3><p>${dkdV329SimpleEscape([dkdPass.platform, dkdPass.courier_plate].filter(Boolean).join(' · ') || 'Bilgi bekleniyor')}</p></div><span>${dkdV329SimpleEscape(dkdV329SimpleStatusLabel(dkdPass.status))}</span></div>
        <div class="dkd-v329-route"><article><span>${dkdV329SimpleIcon('route')}</span><div><small>NEREDEN GELİYOR</small><strong>${dkdV329SimpleEscape(dkdOrigin)}</strong></div></article><article><span>${dkdV329SimpleIcon('pin')}</span><div><small>GİDECEĞİ TAM ADRES</small><strong>${dkdV329SimpleEscape(dkdDestination)}</strong></div></article></div>
        <div class="dkd-v329-detail-grid">
          ${dkdV329SimpleDetail('Kurye Adı Soyadı', dkdPass.courier_name, 'user')}
          ${dkdV329SimpleDetail('Kurye Telefonu', dkdPass.courier_phone, 'phone')}
          ${dkdV329SimpleDetail('Platform', dkdPass.platform, 'route')}
          ${dkdV329SimpleDetail('Plaka', dkdPass.courier_plate, 'route')}
          ${dkdV329SimpleDetail('Müşteri Adı Soyadı', dkdPass.customer_name, 'user')}
          ${dkdV329SimpleDetail('Sipariş Numarası', dkdPass.order_number, 'search')}
          ${dkdV329SimpleDetail('Site / Kapı', [dkdPass.site_name, dkdPass.gate].filter(Boolean).join(' · '), 'pin')}
          ${dkdV329SimpleDetail('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '), 'pin')}
          ${dkdV329SimpleDetail('Mesafe / Tahmini Varış', `${dkdDistance} · ${dkdEta}`, 'route')}
          ${dkdV329SimpleDetail('Kapıya Geliş', dkdV329SimpleFormatDate(dkdPass.arrived_at || dkdPass.created_at), 'route')}
          ${dkdV329SimpleDetail('Teslimat Notu', dkdPass.note, 'user', true)}
        </div>
        <div class="dkd-v329-code"><small>6 HANELİ EŞLEŞTİRME KODU</small><strong>${dkdV329SimpleEscape(dkdV329SimpleState.modalCode || '—')}</strong>${dkdV329SimpleIcon('key')}</div>
      </main>
      <footer><button type="button" class="secondary" data-dkd-v329-close>Kapat</button><button type="button" id="dkd-v329-approve">${dkdV329SimpleIcon('key')}<span>Kodu Onayla ve Giriş Ver</span></button></footer>
    </section>`;
  dkdV329SimpleBindModalClose();
  document.querySelector('#dkd-v329-approve')?.addEventListener('click', () => void dkdV329SimpleApprovePass());
  requestAnimationFrame(() => document.querySelector('.dkd-v329-modal-close')?.focus({ preventScroll: true }));
}

async function dkdV329SimpleApprovePass() {
  const dkdButton = document.querySelector('#dkd-v329-approve');
  if (!dkdButton || typeof dkdV329SimpleData?.approvePass !== 'function') return;
  const dkdPass = dkdV329SimpleState.modalPass;
  dkdButton.disabled = true;
  dkdButton.querySelector('span').textContent = 'Kod onaylanıyor…';
  try {
    const dkdResult = await dkdV329SimpleData.approvePass(dkdV329SimpleState.modalCode);
    const dkdModal = dkdV329SimpleModalRoot();
    dkdModal.innerHTML = `<div class="dkd-v329-modal-backdrop"></div><section class="dkd-v329-modal-panel dkd-v329-success" role="dialog" aria-modal="true"><div>${dkdV329SimpleIcon('check')}</div><h2>Giriş Onaylandı</h2><p>${dkdV329SimpleEscape(dkdResult?.courier_name || dkdPass?.courier_name || 'Kurye')} için kurye geçişi tamamlandı.</p><button type="button" data-dkd-v329-close>Tamam</button></section>`;
    dkdV329SimpleBindModalClose();
    await dkdV329SimpleRefreshQueue();
  } catch (dkdError) {
    dkdButton.disabled = false;
    dkdButton.querySelector('span').textContent = 'Kodu Onayla ve Giriş Ver';
    let dkdErrorBox = document.querySelector('.dkd-v329-modal-error');
    if (!dkdErrorBox) {
      dkdErrorBox = document.createElement('div');
      dkdErrorBox.className = 'dkd-v329-modal-error';
      document.querySelector('.dkd-v329-modal-panel footer')?.before(dkdErrorBox);
    }
    dkdErrorBox.textContent = dkdV329SimpleReadableError(dkdError);
  }
}

async function dkdV329SimpleSearch(dkdEvent) {
  dkdEvent?.preventDefault?.();
  if (dkdV329SimpleState.busy) return;
  const dkdInput = document.querySelector('#dkd-v329-code');
  const dkdButton = document.querySelector('#dkd-v329-search-button');
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdInput) dkdInput.value = dkdCode;
  if (dkdCode.length !== 6) {
    dkdV329SimpleSetFeedback('error', 'Lütfen 6 haneli kurye kodunu eksiksiz girin.');
    dkdInput?.focus({ preventScroll: true });
    return;
  }
  if (typeof dkdV329SimpleData?.findPass !== 'function') {
    dkdV329SimpleSetFeedback('error', 'Kurye doğrulama servisi başlatılamadı. Sayfayı yenileyip tekrar deneyin.');
    return;
  }

  dkdV329SimpleState.busy = true;
  dkdButton.disabled = true;
  dkdButton.innerHTML = `${dkdV329SimpleIcon('search')}<span>Kurye aranıyor…</span>`;
  dkdV329SimpleSetFeedback('loading', 'Kurye kodu güvenli veritabanında aranıyor…');
  try {
    const dkdPass = await dkdV329SimpleData.findPass(dkdCode);
    dkdV329SimpleSetFeedback('success', 'Kurye bulundu. Detaylar açılıyor…');
    dkdV329SimpleOpenPassModal(dkdPass, dkdCode);
  } catch (dkdError) {
    dkdV329SimpleSetFeedback('error', dkdV329SimpleReadableError(dkdError));
  } finally {
    dkdV329SimpleState.busy = false;
    dkdButton.disabled = false;
    dkdButton.innerHTML = `${dkdV329SimpleIcon('search')}<span>Kuryeni Bul ve Eşleştir</span>`;
  }
}

function dkdV329SimpleSwitchTheme() {
  sessionStorage.removeItem('dkd_gate_security_theme');
  sessionStorage.removeItem('dkd_gate_force_theme');
  sessionStorage.removeItem('dkd_gate_route');
  location.href = `/DraBornGate/?v=${DKD_V329_SIMPLE_VERSION}`;
}

async function dkdV329SimpleLogout() {
  const dkdSession = window.dkdV325Session || window.dkdV324Session;
  for (const dkdMethod of ['logout', 'signOut', 'clearSession']) {
    if (typeof dkdSession?.[dkdMethod] === 'function') {
      try { await dkdSession[dkdMethod](); } catch { /* Yerel temizleme devam eder. */ }
      break;
    }
  }
  for (const dkdStore of [localStorage, sessionStorage]) {
    const dkdKeys = [];
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = String(dkdStore.key(dkdIndex) || '');
      if (dkdKey.includes('guuwomvszlwhkmstewfl') || dkdKey.startsWith('dkd_gate_')) dkdKeys.push(dkdKey);
    }
    dkdKeys.forEach((dkdKey) => dkdStore.removeItem(dkdKey));
  }
  location.href = `/DraBornGate/?logout=1&v=${DKD_V329_SIMPLE_VERSION}`;
}

function dkdV329SimpleMount() {
  if (!dkdV329SimpleRoot) throw new Error('Sade Tema kök alanı bulunamadı.');
  document.body.classList.add('dkd-v329-simple-body');
  dkdV329SimpleRoot.innerHTML = `<div id="dkd-v329-simple">
    <header class="dkd-v329-simple-header">
      <div class="dkd-v329-brand"><div class="dkd-v329-brand-mark">DBG</div><div><strong>DraBornGate</strong><span>GÜVENLİK SADE TEMA · WEB v${DKD_V329_SIMPLE_VERSION}</span></div></div>
      <div class="dkd-v329-header-actions"><button type="button" id="dkd-v329-switch-theme" aria-label="Modern Tema">${dkdV329SimpleIcon('switch')}</button><button type="button" id="dkd-v329-logout" aria-label="Çıkış Yap">${dkdV329SimpleIcon('logout')}</button></div>
    </header>
    <main class="dkd-v329-simple-main">
      <section class="dkd-v329-finder">
        <span class="dkd-v329-eyebrow">ASİL İŞLEM · 6 HANELİ KOD</span>
        <h1>Kuryeni Bul ve Eşleştir</h1>
        <p class="dkd-v329-finder-copy">Kuryenin telefonundaki kodu girin. Doğru kurye bulunduğunda ad, telefon, plaka, platform, müşteri, sipariş ve tam adres bilgileri modern doğrulama penceresinde açılır.</p>
        <form id="dkd-v329-search-form" class="dkd-v329-search-form" novalidate>
          <label for="dkd-v329-code">KURYE KODU</label>
          <div class="dkd-v329-code-shell"><input id="dkd-v329-code" type="tel" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="• • • • • •" aria-label="6 haneli kurye kodu"></div>
          <button type="submit" id="dkd-v329-search-button">${dkdV329SimpleIcon('search')}<span>Kuryeni Bul ve Eşleştir</span></button>
          <div id="dkd-v329-feedback" class="dkd-v329-feedback" hidden></div>
        </form>
      </section>
      <section class="dkd-v329-queue">
        <div class="dkd-v329-queue-head"><div><span>CANLI GÜVENLİK AKIŞI</span><h2>Canlı Kurye Kuyruğu</h2><p id="dkd-v329-last-sync">Canlı bağlantı hazırlanıyor</p></div><b id="dkd-v329-queue-count" class="dkd-v329-queue-count">0 aktif</b></div>
        <div id="dkd-v329-queue-list" class="dkd-v329-queue-list"><div class="dkd-v329-empty">Kuyruk hazırlanıyor…</div></div>
      </section>
    </main>
    <div id="dkd-v329-modal" class="dkd-v329-modal" hidden></div>
  </div>`;

  const dkdInput = document.querySelector('#dkd-v329-code');
  dkdInput?.addEventListener('input', () => {
    dkdInput.value = dkdInput.value.replace(/\D/g, '').slice(0, 6);
  });
  document.querySelector('#dkd-v329-search-form')?.addEventListener('submit', dkdV329SimpleSearch);
  document.querySelector('#dkd-v329-switch-theme')?.addEventListener('click', dkdV329SimpleSwitchTheme);
  document.querySelector('#dkd-v329-logout')?.addEventListener('click', () => void dkdV329SimpleLogout());
  document.addEventListener('keydown', (dkdEvent) => {
    if (dkdEvent.key === 'Escape' && !dkdV329SimpleModalRoot()?.hidden) dkdV329SimpleCloseModal();
  });

  document.documentElement.dataset.dkdSimpleFinal = 'true';
  document.documentElement.dataset.dkdV329SimpleReady = 'true';
  sessionStorage.setItem('dkd_gate_web_version', DKD_V329_SIMPLE_VERSION);
  void dkdV329SimpleRefreshQueue();
  setInterval(() => void dkdV329SimpleRefreshQueue(), 30000);
}

dkdV329SimpleMount();
