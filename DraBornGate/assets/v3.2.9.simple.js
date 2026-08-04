const DKD_V329_SIMPLE_VERSION = '3.2.9';
const dkdV329SimpleState = {
  queue: [],
  loading: false,
  searchBusy: false,
  modalCode: '',
};

const dkdV329SimpleRoot = document.querySelector('#dkd-app');
const dkdV329Data = window.dkdV31Data;

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
    refresh: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.9"/><path d="M18.2 9A7 7 0 0 0 6.1 6.1L4 8m2 7a7 7 0 0 0 11.9 2.9L20 16" stroke="currentColor" stroke-width="1.9"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 9 5 5 5-5" stroke="currentColor" stroke-width="2"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV329SimpleFormatDate(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime())
    ? String(dkdValue)
    : dkdDate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
}

function dkdV329SimpleStatus(dkdPass) {
  const dkdStatus = String(dkdPass?.status || '').toLocaleLowerCase('tr-TR');
  if (dkdStatus === 'arrived') return 'Kapıda';
  if (dkdStatus === 'approved') return 'Onay Bekliyor';
  if (dkdStatus === 'waiting') return 'Yaklaşıyor';
  return dkdPass?.status || 'Aktif';
}

function dkdV329SimpleDetail(dkdLabel, dkdValue, dkdIcon = 'user', dkdWide = false) {
  const dkdSafe = dkdValue === null || dkdValue === undefined || dkdValue === '' ? '—' : dkdValue;
  return `<article class="dkd-v329-detail ${dkdWide ? 'wide' : ''}"><span>${dkdV329SimpleIcon(dkdIcon)}</span><div><small>${dkdV329SimpleEscape(dkdLabel)}</small><strong>${dkdV329SimpleEscape(dkdSafe)}</strong></div></article>`;
}

function dkdV329SimpleShell() {
  return `<main id="dkd-v329-simple-root" aria-label="DraBornGate Güvenlik Sade Tema">
    <header class="dkd-v329-topbar">
      <div class="dkd-v329-brand"><span>DBG</span><div><strong>DraBornGate</strong><small>GÜVENLİK SADE TEMA · WEB V${DKD_V329_SIMPLE_VERSION}</small></div></div>
      <button type="button" id="dkd-v329-refresh" aria-label="Canlı kuyruğu yenile">${dkdV329SimpleIcon('refresh')}</button>
    </header>
    <section class="dkd-v329-finder">
      <div class="dkd-v329-kicker">${dkdV329SimpleIcon('key')}<span>ASIL İŞLEM · 6 HANELİ KOD</span></div>
      <h1>Kuryeni Bul ve Eşleştir</h1>
      <p>Kurye kodunu girin; teslimatın bütün bilgileri modern doğrulama ekranında açılsın.</p>
      <form id="dkd-v329-search-form" novalidate>
        <label for="dkd-v329-code">Kurye Eşleştirme Kodu</label>
        <div class="dkd-v329-code-row"><span>${dkdV329SimpleIcon('key')}</span><input id="dkd-v329-code" type="tel" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" aria-describedby="dkd-v329-feedback"><button type="submit">${dkdV329SimpleIcon('search')}<span>Kuryeni Bul ve Eşleştir</span></button></div>
        <div id="dkd-v329-feedback" class="dkd-v329-feedback" aria-live="polite"></div>
      </form>
    </section>
    <section class="dkd-v329-queue">
      <div class="dkd-v329-section-head"><div><small>CANLI GÜVENLİK AKIŞI</small><h2>Canlı Kurye Kuyruğu</h2><p>Kategoriler başlangıçta kapalıdır. Açınca ilk üç kurye gösterilir.</p></div><span id="dkd-v329-last-sync">Hazırlanıyor</span></div>
      <div id="dkd-v329-queue-content" class="dkd-v329-queue-content"><div class="dkd-v329-loading"><i></i><span>Canlı kurye bilgileri alınıyor…</span></div></div>
    </section>
  </main>
  <div id="dkd-v329-modal" hidden></div>`;
}

function dkdV329SimpleMount() {
  if (!dkdV329SimpleRoot) throw new Error('DraBornGate Sade Tema kökü bulunamadı.');
  dkdV329SimpleRoot.innerHTML = dkdV329SimpleShell();
  document.body.classList.add('dkd-v329-simple-active');
  document.documentElement.dataset.dkdSimpleFinal = 'true';
  document.documentElement.dataset.dkdGateVersion = DKD_V329_SIMPLE_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V329_SIMPLE_VERSION);

  const dkdForm = document.querySelector('#dkd-v329-search-form');
  const dkdInput = document.querySelector('#dkd-v329-code');
  dkdInput?.addEventListener('input', () => {
    dkdInput.value = dkdInput.value.replace(/\D/g, '').slice(0, 6);
    dkdInput.classList.toggle('ready', dkdInput.value.length === 6);
  });
  dkdForm?.addEventListener('submit', (dkdEvent) => {
    dkdEvent.preventDefault();
    void dkdV329SimpleFindCourier();
  });
  document.querySelector('#dkd-v329-refresh')?.addEventListener('click', () => void dkdV329SimpleLoadQueue(true));
  document.addEventListener('click', dkdV329SimpleDelegatedClick);
}

function dkdV329SimpleFeedback(dkdType, dkdText) {
  const dkdFeedback = document.querySelector('#dkd-v329-feedback');
  if (!dkdFeedback) return;
  dkdFeedback.className = `dkd-v329-feedback ${dkdType || ''}`;
  dkdFeedback.textContent = dkdText || '';
}

function dkdV329SimpleQueueRow(dkdPass, dkdIndex) {
  const dkdDestination = dkdPass.destination_full
    || [dkdPass.site_name, dkdPass.gate, dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' · ')
    || 'Adres bekleniyor';
  return `<button type="button" class="dkd-v329-queue-row" data-dkd-v329-pass-index="${dkdIndex}"><span class="dkd-v329-avatar">${dkdV329SimpleIcon('user')}</span><div><strong>${dkdV329SimpleEscape(dkdPass.courier_name || 'Kurye')}</strong><small>${dkdV329SimpleEscape([dkdPass.platform, dkdPass.courier_plate].filter(Boolean).join(' · ') || 'Kurye bilgisi')}</small><p>${dkdV329SimpleEscape(dkdDestination)}</p></div><i>${dkdV329SimpleEscape(dkdV329SimpleStatus(dkdPass))}</i></button>`;
}

function dkdV329SimpleQueueGroup(dkdId, dkdTitle, dkdRows) {
  const dkdIndexes = dkdRows.map((dkdRow) => dkdV329SimpleState.queue.indexOf(dkdRow));
  return `<details class="dkd-v329-group" id="dkd-v329-${dkdId}"><summary><div><strong>${dkdV329SimpleEscape(dkdTitle)}</strong><span>${dkdRows.length} kurye</span></div>${dkdV329SimpleIcon('chevron')}</summary><div class="dkd-v329-group-body">${dkdRows.length ? dkdRows.slice(0, 3).map((dkdRow, dkdOffset) => dkdV329SimpleQueueRow(dkdRow, dkdIndexes[dkdOffset])).join('') : '<p class="dkd-v329-empty">Bu kategoride aktif kurye bulunmuyor.</p>'}</div></details>`;
}

function dkdV329SimpleRenderQueue() {
  const dkdContainer = document.querySelector('#dkd-v329-queue-content');
  if (!dkdContainer) return;
  const dkdArrived = dkdV329SimpleState.queue.filter((dkdPass) => dkdPass.category === 'arrived' || dkdPass.status === 'arrived');
  const dkdApproaching = dkdV329SimpleState.queue.filter((dkdPass) => dkdPass.category === 'approaching' || ['waiting', 'approved'].includes(String(dkdPass.status)));
  const dkdOther = dkdV329SimpleState.queue.filter((dkdPass) => !dkdArrived.includes(dkdPass) && !dkdApproaching.includes(dkdPass));
  dkdContainer.innerHTML = [
    dkdV329SimpleQueueGroup('arrived', 'Kapıda Bekleyenler', dkdArrived),
    dkdV329SimpleQueueGroup('approaching', 'Yaklaşan / Onay Bekleyenler', dkdApproaching),
    dkdV329SimpleQueueGroup('other', 'Diğer Aktif Geçişler', dkdOther),
  ].join('');
  const dkdSync = document.querySelector('#dkd-v329-last-sync');
  if (dkdSync) dkdSync.textContent = `Son güncelleme ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
}

async function dkdV329SimpleLoadQueue(dkdManual = false) {
  if (dkdV329SimpleState.loading) return;
  const dkdContainer = document.querySelector('#dkd-v329-queue-content');
  const dkdRefresh = document.querySelector('#dkd-v329-refresh');
  dkdV329SimpleState.loading = true;
  if (dkdRefresh) dkdRefresh.disabled = true;
  if (dkdManual && dkdContainer) dkdContainer.innerHTML = '<div class="dkd-v329-loading"><i></i><span>Canlı kuyruk yenileniyor…</span></div>';
  try {
    if (typeof dkdV329Data?.loadQueue !== 'function') throw new Error('Canlı kurye servisi hazırlanamadı.');
    const dkdRows = await dkdV329Data.loadQueue();
    dkdV329SimpleState.queue = Array.isArray(dkdRows) ? dkdRows : [];
    dkdV329SimpleRenderQueue();
  } catch (dkdError) {
    const dkdReadable = dkdV329Data?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
    if (dkdContainer) dkdContainer.innerHTML = `<div class="dkd-v329-error"><strong>Canlı kuyruk açılamadı</strong><p>${dkdV329SimpleEscape(dkdReadable)}</p><button type="button" data-dkd-v329-retry>Tekrar Dene</button></div>`;
  } finally {
    dkdV329SimpleState.loading = false;
    if (dkdRefresh) dkdRefresh.disabled = false;
  }
}

function dkdV329SimpleModal() {
  return document.querySelector('#dkd-v329-modal');
}

function dkdV329SimpleCloseModal() {
  const dkdModal = dkdV329SimpleModal();
  if (!dkdModal) return;
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  document.body.classList.remove('dkd-v329-modal-open');
  dkdV329SimpleState.modalCode = '';
}

function dkdV329SimpleOpenPass(dkdPass, dkdCode = '') {
  const dkdModal = dkdV329SimpleModal();
  if (!dkdModal) return;
  const dkdDestination = dkdPass.destination_full
    || [dkdPass.site_name, dkdPass.gate, dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' · ')
    || '—';
  const dkdOrigin = [dkdPass.origin_name, dkdPass.origin_address].filter(Boolean).join(' · ') || '—';
  const dkdDistance = dkdPass.distance_m || dkdPass.distance_m === 0 ? `${dkdPass.distance_m} m` : '—';
  const dkdEta = dkdPass.eta_minutes || dkdPass.eta_minutes === 0 ? `${dkdPass.eta_minutes} dk` : '—';
  dkdV329SimpleState.modalCode = String(dkdCode || dkdPass.approval_code || '').replace(/\D/g, '').slice(0, 6);
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v329-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v329-backdrop" data-dkd-v329-close></div><section class="dkd-v329-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v329-modal-title"><header><div><span>KODLA KURYE DOĞRULAMA</span><h2 id="dkd-v329-modal-title">Kurye Bilgileri</h2><p>Giriş vermeden önce bütün teslimat bilgilerini kontrol edin.</p></div><button type="button" class="dkd-v329-close" data-dkd-v329-close aria-label="Kapat">${dkdV329SimpleIcon('close')}</button></header><main><div class="dkd-v329-hero"><div class="dkd-v329-avatar">${dkdV329SimpleIcon('user')}</div><div><small>KURYE</small><h3>${dkdV329SimpleEscape(dkdPass.courier_name || 'Kurye')}</h3><p>${dkdV329SimpleEscape([dkdPass.platform, dkdPass.courier_plate].filter(Boolean).join(' · ') || 'Bilgi bekleniyor')}</p></div><span>${dkdV329SimpleEscape(dkdV329SimpleStatus(dkdPass))}</span></div><div class="dkd-v329-route"><article><span>${dkdV329SimpleIcon('route')}</span><div><small>NEREDEN GELİYOR</small><strong>${dkdV329SimpleEscape(dkdOrigin)}</strong></div></article><article><span>${dkdV329SimpleIcon('pin')}</span><div><small>GİDECEĞİ TAM ADRES</small><strong>${dkdV329SimpleEscape(dkdDestination)}</strong></div></article></div><div class="dkd-v329-grid">${dkdV329SimpleDetail('Kurye Adı Soyadı', dkdPass.courier_name, 'user')}${dkdV329SimpleDetail('Kurye Telefonu', dkdPass.courier_phone, 'phone')}${dkdV329SimpleDetail('Platform', dkdPass.platform, 'route')}${dkdV329SimpleDetail('Plaka', dkdPass.courier_plate, 'route')}${dkdV329SimpleDetail('Müşteri Adı Soyadı', dkdPass.customer_name, 'user')}${dkdV329SimpleDetail('Sipariş Numarası', dkdPass.order_number, 'search')}${dkdV329SimpleDetail('Site / Kapı', [dkdPass.site_name, dkdPass.gate].filter(Boolean).join(' · '), 'pin')}${dkdV329SimpleDetail('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '), 'pin')}${dkdV329SimpleDetail('Mesafe / Tahmini Varış', `${dkdDistance} · ${dkdEta}`, 'route')}${dkdV329SimpleDetail('Kapıya Geliş', dkdV329SimpleFormatDate(dkdPass.arrived_at || dkdPass.created_at), 'route')}${dkdV329SimpleDetail('Teslimat Notu', dkdPass.note, 'user', true)}</div><div class="dkd-v329-code"><small>6 HANELİ EŞLEŞTİRME KODU</small><strong>${dkdV329SimpleEscape(dkdV329SimpleState.modalCode || '—')}</strong>${dkdV329SimpleIcon('key')}</div><div id="dkd-v329-modal-error" class="dkd-v329-modal-error" hidden></div></main><footer><button type="button" class="secondary" data-dkd-v329-close>Kapat</button><button type="button" id="dkd-v329-approve" ${dkdV329SimpleState.modalCode.length === 6 ? '' : 'disabled'}>${dkdV329SimpleIcon('key')}<span>Kodu Onayla ve Giriş Ver</span></button></footer></section>`;
  requestAnimationFrame(() => dkdModal.querySelector('.dkd-v329-close')?.focus({ preventScroll: true }));
}

async function dkdV329SimpleApprove() {
  const dkdButton = document.querySelector('#dkd-v329-approve');
  const dkdErrorBox = document.querySelector('#dkd-v329-modal-error');
  if (!dkdButton || dkdV329SimpleState.modalCode.length !== 6) return;
  dkdButton.disabled = true;
  dkdButton.querySelector('span').textContent = 'Kod onaylanıyor…';
  if (dkdErrorBox) dkdErrorBox.hidden = true;
  try {
    if (typeof dkdV329Data?.approvePass !== 'function') throw new Error('Onay servisi hazır değil.');
    const dkdResult = await dkdV329Data.approvePass(dkdV329SimpleState.modalCode);
    const dkdModal = dkdV329SimpleModal();
    dkdModal.innerHTML = `<div class="dkd-v329-backdrop"></div><section class="dkd-v329-panel dkd-v329-success" role="dialog" aria-modal="true"><div>${dkdV329SimpleIcon('check')}</div><h2>Giriş Onaylandı</h2><p>${dkdV329SimpleEscape(dkdResult?.courier_name || 'Kurye')} için kurye geçişi tamamlandı.</p><button type="button" data-dkd-v329-close>Tamam</button></section>`;
    await dkdV329SimpleLoadQueue(true);
  } catch (dkdError) {
    const dkdReadable = dkdV329Data?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
    dkdButton.disabled = false;
    dkdButton.querySelector('span').textContent = 'Kodu Onayla ve Giriş Ver';
    if (dkdErrorBox) {
      dkdErrorBox.hidden = false;
      dkdErrorBox.textContent = dkdReadable;
    }
  }
}

async function dkdV329SimpleFindCourier() {
  if (dkdV329SimpleState.searchBusy) return;
  const dkdInput = document.querySelector('#dkd-v329-code');
  const dkdButton = document.querySelector('#dkd-v329-search-form button[type="submit"]');
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdInput) dkdInput.value = dkdCode;
  if (dkdCode.length !== 6) {
    dkdV329SimpleFeedback('error', 'Lütfen 6 haneli kurye kodunu eksiksiz girin.');
    dkdInput?.focus({ preventScroll: true });
    return;
  }
  dkdV329SimpleState.searchBusy = true;
  if (dkdButton) {
    dkdButton.disabled = true;
    dkdButton.querySelector('span').textContent = 'Kurye aranıyor…';
  }
  dkdV329SimpleFeedback('loading', 'Kurye kodu güvenli veritabanında aranıyor…');
  try {
    if (typeof dkdV329Data?.findPass !== 'function') throw new Error('Kurye doğrulama servisi hazır değil.');
    const dkdPass = await dkdV329Data.findPass(dkdCode);
    if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye bulunamadı.');
    dkdV329SimpleFeedback('success', 'Kurye bulundu. Ayrıntılar açılıyor…');
    dkdV329SimpleOpenPass(dkdPass, dkdCode);
  } catch (dkdError) {
    const dkdReadable = dkdV329Data?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
    dkdV329SimpleFeedback('error', dkdReadable);
  } finally {
    dkdV329SimpleState.searchBusy = false;
    if (dkdButton) {
      dkdButton.disabled = false;
      dkdButton.querySelector('span').textContent = 'Kuryeni Bul ve Eşleştir';
    }
  }
}

function dkdV329SimpleDelegatedClick(dkdEvent) {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget) return;
  if (dkdTarget.closest('[data-dkd-v329-close]')) {
    dkdV329SimpleCloseModal();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v329-retry]')) {
    void dkdV329SimpleLoadQueue(true);
    return;
  }
  if (dkdTarget.closest('#dkd-v329-approve')) {
    void dkdV329SimpleApprove();
    return;
  }
  const dkdRow = dkdTarget.closest('[data-dkd-v329-pass-index]');
  if (dkdRow) {
    const dkdPass = dkdV329SimpleState.queue[Number(dkdRow.dataset.dkdV329PassIndex)];
    if (dkdPass) dkdV329SimpleOpenPass(dkdPass, dkdPass.approval_code || '');
  }
}

document.addEventListener('keydown', (dkdEvent) => {
  if (dkdEvent.key === 'Escape' && !dkdV329SimpleModal()?.hidden) dkdV329SimpleCloseModal();
});

if (!dkdV329Data) throw new Error('DraBornGate v3.2.9 canlı veri katmanı başlatılamadı.');
dkdV329SimpleMount();
await dkdV329SimpleLoadQueue();
