const DKD_V327_VERSION = '3.2.7';

const dkdV327State = {
  searchBusy: false,
  patchQueued: false,
};

function dkdV327Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV327Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV327Icon(dkdName) {
  const dkdIcons = {
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="16" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 13 9-9m-3 3 3 3m-6 0 3 3" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h3l1.2 4-2 1.4a15 15 0 0 0 6.4 6.4l1.4-2 4 1.2v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="1.7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.1 7-12A7 7 0 0 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV327IsSimpleTheme() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema')
    || sessionStorage.getItem('dkd_gate_security_theme') === 'simple'
    || sessionStorage.getItem('dkd_gate_force_theme') === 'simple'
    || document.body.classList.contains('dkd-v31-simple-active');
}

function dkdV327RemoveDuplicateEarnings() {
  for (const dkdLabel of document.querySelectorAll('button,a,[role="button"],.dkd-v31-menu-item')) {
    if (dkdV327Normalize(dkdLabel.textContent) !== 'kazancim') continue;
    const dkdItem = dkdLabel.closest('.dkd-v31-menu-item,button,a,[role="button"]') || dkdLabel;
    dkdItem.remove();
  }
}

function dkdV327CompactSiteSearch() {
  const dkdWidgets = document.querySelectorAll('.dkd-v23-site-search,.dkd-v324-site-search');
  for (const dkdWidget of dkdWidgets) {
    dkdWidget.classList.add('dkd-v327-site-compact');
    const dkdInput = dkdWidget.querySelector('input[type="search"],input[aria-label*="Site" i]');
    if (dkdInput) {
      dkdInput.placeholder = 'Site ara';
      dkdInput.setAttribute('aria-label', 'Site ara');
    }
    for (const dkdNode of dkdWidget.querySelectorAll('p,h2,h3,h4')) {
      const dkdText = dkdV327Normalize(dkdNode.textContent);
      if (dkdText.includes('site otomatik secilmez') || dkdText === 'site ara') {
        dkdNode.classList.add('dkd-v327-site-extra');
      }
    }
    for (const dkdNode of dkdWidget.querySelectorAll('strong,b,span')) {
      const dkdText = dkdV327Normalize(dkdNode.textContent);
      if (dkdText === 'site ara' || dkdText === 'ara') dkdNode.classList.add('dkd-v327-site-extra');
    }
  }
}

function dkdV327FindSearchControl(dkdSource) {
  const dkdForm = dkdSource?.closest?.('#dkd-v31-search-form,form')
    || document.querySelector('#dkd-v31-search-form');
  const dkdScope = dkdForm || dkdSource?.closest?.('.dkd-v31-finder,section') || document;
  const dkdInput = dkdScope.querySelector?.('#dkd-v31-code,input[type="tel"][maxlength="6"],input[inputmode="numeric"][maxlength="6"]')
    || document.querySelector('#dkd-v31-code');
  const dkdButton = dkdScope.querySelector?.('button[type="submit"],button') || null;
  return { dkdForm, dkdScope, dkdInput, dkdButton };
}

function dkdV327SetFeedback(dkdScope, dkdType, dkdText) {
  if (!dkdScope) return;
  let dkdFeedback = dkdScope.querySelector('.dkd-v327-feedback,.dkd-v31-feedback');
  if (!dkdFeedback) {
    dkdFeedback = document.createElement('div');
    dkdFeedback.className = 'dkd-v327-feedback';
    dkdScope.appendChild(dkdFeedback);
  }
  dkdFeedback.className = `dkd-v327-feedback ${dkdType}`;
  dkdFeedback.textContent = dkdText;
}

function dkdV327Detail(dkdLabel, dkdValue, dkdIcon = 'user', dkdWide = false) {
  const dkdSafeValue = dkdValue === null || dkdValue === undefined || dkdValue === '' ? '—' : dkdValue;
  return `<article class="dkd-v327-detail ${dkdWide ? 'wide' : ''}"><span>${dkdV327Icon(dkdIcon)}</span><div><small>${dkdV327Escape(dkdLabel)}</small><strong>${dkdV327Escape(dkdSafeValue)}</strong></div></article>`;
}

function dkdV327FormatDate(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime())
    ? String(dkdValue)
    : dkdDate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
}

function dkdV327EnsureModal() {
  let dkdModal = document.querySelector('#dkd-v327-courier-modal');
  if (!dkdModal) {
    dkdModal = document.createElement('div');
    dkdModal.id = 'dkd-v327-courier-modal';
    dkdModal.hidden = true;
    document.body.appendChild(dkdModal);
  }
  return dkdModal;
}

function dkdV327CloseModal() {
  const dkdModal = dkdV327EnsureModal();
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  document.body.classList.remove('dkd-v327-modal-open');
}

function dkdV327BindModalClose(dkdModal) {
  for (const dkdClose of dkdModal.querySelectorAll('[data-dkd-v327-close]')) {
    dkdClose.addEventListener('click', dkdV327CloseModal);
  }
}

function dkdV327RenderPassModal(dkdPass, dkdCode) {
  const dkdModal = dkdV327EnsureModal();
  const dkdDestination = dkdPass.destination_full
    || [dkdPass.site_name, dkdPass.gate, dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' · ')
    || '—';
  const dkdOrigin = [dkdPass.origin_name, dkdPass.origin_address].filter(Boolean).join(' · ') || '—';
  const dkdDistance = dkdPass.distance_m || dkdPass.distance_m === 0 ? `${dkdPass.distance_m} m` : '—';
  const dkdEta = dkdPass.eta_minutes || dkdPass.eta_minutes === 0 ? `${dkdPass.eta_minutes} dk` : '—';

  dkdModal.hidden = false;
  document.body.classList.add('dkd-v327-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v327-backdrop" data-dkd-v327-close></div>
    <section class="dkd-v327-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v327-title">
      <header>
        <div><span>KODLA KURYE DOĞRULAMA</span><h2 id="dkd-v327-title">Kurye Bilgileri</h2><p>Giriş vermeden önce bütün teslimat bilgilerini kontrol edin.</p></div>
        <button type="button" class="dkd-v327-close" data-dkd-v327-close aria-label="Kapat">${dkdV327Icon('close')}</button>
      </header>
      <main>
        <div class="dkd-v327-hero">
          <div class="dkd-v327-avatar">${dkdV327Icon('user')}</div>
          <div><small>KURYE</small><h3>${dkdV327Escape(dkdPass.courier_name || 'Kurye')}</h3><p>${dkdV327Escape([dkdPass.platform, dkdPass.courier_plate].filter(Boolean).join(' · ') || 'Bilgi bekleniyor')}</p></div>
          <span>${dkdV327Escape(dkdPass.status || 'Aktif')}</span>
        </div>
        <div class="dkd-v327-route">
          <article><span>${dkdV327Icon('route')}</span><div><small>NEREDEN GELİYOR</small><strong>${dkdV327Escape(dkdOrigin)}</strong></div></article>
          <article><span>${dkdV327Icon('pin')}</span><div><small>GİDECEĞİ TAM ADRES</small><strong>${dkdV327Escape(dkdDestination)}</strong></div></article>
        </div>
        <div class="dkd-v327-grid">
          ${dkdV327Detail('Kurye Adı Soyadı', dkdPass.courier_name, 'user')}
          ${dkdV327Detail('Kurye Telefonu', dkdPass.courier_phone, 'phone')}
          ${dkdV327Detail('Platform', dkdPass.platform, 'route')}
          ${dkdV327Detail('Plaka', dkdPass.courier_plate, 'route')}
          ${dkdV327Detail('Müşteri Adı Soyadı', dkdPass.customer_name, 'user')}
          ${dkdV327Detail('Sipariş Numarası', dkdPass.order_number, 'search')}
          ${dkdV327Detail('Site / Kapı', [dkdPass.site_name, dkdPass.gate].filter(Boolean).join(' · '), 'pin')}
          ${dkdV327Detail('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '), 'pin')}
          ${dkdV327Detail('Mesafe / Tahmini Varış', `${dkdDistance} · ${dkdEta}`, 'route')}
          ${dkdV327Detail('Kapıya Geliş', dkdV327FormatDate(dkdPass.arrived_at || dkdPass.created_at), 'route')}
          ${dkdV327Detail('Teslimat Notu', dkdPass.note, 'user', true)}
        </div>
        <div class="dkd-v327-code"><small>6 HANELİ EŞLEŞTİRME KODU</small><strong>${dkdV327Escape(dkdCode || dkdPass.approval_code || '—')}</strong>${dkdV327Icon('key')}</div>
      </main>
      <footer>
        <button type="button" class="secondary" data-dkd-v327-close>Kapat</button>
        <button type="button" id="dkd-v327-approve">${dkdV327Icon('key')}<span>Kodu Onayla ve Giriş Ver</span></button>
      </footer>
    </section>`;

  dkdV327BindModalClose(dkdModal);
  const dkdApprove = dkdModal.querySelector('#dkd-v327-approve');
  dkdApprove?.addEventListener('click', async () => {
    const dkdData = window.dkdV31Data;
    if (typeof dkdData?.approvePass !== 'function') {
      dkdApprove.disabled = false;
      dkdApprove.querySelector('span').textContent = 'Onay servisi hazır değil';
      return;
    }
    dkdApprove.disabled = true;
    dkdApprove.querySelector('span').textContent = 'Kod onaylanıyor…';
    try {
      const dkdResult = await dkdData.approvePass(String(dkdCode || dkdPass.approval_code || '').replace(/\D/g, '').slice(0, 6));
      dkdModal.innerHTML = `<div class="dkd-v327-backdrop"></div><section class="dkd-v327-panel dkd-v327-success" role="dialog" aria-modal="true"><div>${dkdV327Icon('check')}</div><h2>Giriş Onaylandı</h2><p>${dkdV327Escape(dkdResult?.courier_name || dkdPass.courier_name || 'Kurye')} için kurye geçişi tamamlandı.</p><button type="button" data-dkd-v327-close>Tamam</button></section>`;
      dkdV327BindModalClose(dkdModal);
      await dkdData.loadQueue?.().catch?.(() => undefined);
    } catch (dkdError) {
      dkdApprove.disabled = false;
      dkdApprove.querySelector('span').textContent = 'Kodu Onayla ve Giriş Ver';
      const dkdReadable = dkdData?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
      let dkdErrorBox = dkdModal.querySelector('.dkd-v327-modal-error');
      if (!dkdErrorBox) {
        dkdErrorBox = document.createElement('div');
        dkdErrorBox.className = 'dkd-v327-modal-error';
        dkdModal.querySelector('.dkd-v327-panel footer')?.before(dkdErrorBox);
      }
      dkdErrorBox.textContent = dkdReadable;
    }
  });

  requestAnimationFrame(() => dkdModal.querySelector('.dkd-v327-close')?.focus({ preventScroll: true }));
}

async function dkdV327RunSearch(dkdSource) {
  if (dkdV327State.searchBusy) return;
  const { dkdScope, dkdInput, dkdButton } = dkdV327FindSearchControl(dkdSource);
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdInput) dkdInput.value = dkdCode;
  if (dkdCode.length !== 6) {
    dkdV327SetFeedback(dkdScope, 'error', 'Lütfen 6 haneli kurye kodunu eksiksiz girin.');
    dkdInput?.focus({ preventScroll: true });
    return;
  }

  const dkdData = window.dkdV31Data;
  if (typeof dkdData?.findPass !== 'function') {
    dkdV327SetFeedback(dkdScope, 'error', 'Kurye doğrulama servisi henüz hazır değil. Sayfayı yenileyip tekrar deneyin.');
    return;
  }

  dkdV327State.searchBusy = true;
  const dkdOriginalButton = dkdButton?.innerHTML || '';
  if (dkdButton) {
    dkdButton.disabled = true;
    dkdButton.innerHTML = `${dkdV327Icon('search')}<span>Kurye aranıyor…</span>`;
  }
  dkdV327SetFeedback(dkdScope, 'loading', 'Kurye kodu güvenli veritabanında aranıyor…');

  try {
    const dkdPass = await dkdData.findPass(dkdCode);
    if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye bulunamadı.');
    dkdV327SetFeedback(dkdScope, 'success', 'Kurye bulundu. Bilgiler açılıyor…');
    dkdV327RenderPassModal(dkdPass, dkdCode);
  } catch (dkdError) {
    const dkdReadable = dkdData.readableError?.(dkdError) || dkdError?.message || String(dkdError);
    dkdV327SetFeedback(dkdScope, 'error', dkdReadable);
  } finally {
    dkdV327State.searchBusy = false;
    if (dkdButton) {
      dkdButton.disabled = false;
      dkdButton.innerHTML = dkdOriginalButton || `${dkdV327Icon('search')}<span>Kuryeni Bul ve Eşleştir</span>`;
    }
  }
}

function dkdV327IsFinderButton(dkdButton) {
  if (!(dkdButton instanceof HTMLButtonElement)) return false;
  const dkdText = dkdV327Normalize(dkdButton.textContent);
  if (dkdText !== 'kuryeni bul ve eslestir') return false;
  return Boolean(dkdButton.closest('#dkd-v31-root,.dkd-v31-finder,.dkd-v324-finder,#dkd-v28-root'));
}

document.addEventListener('click', (dkdEvent) => {
  const dkdButton = dkdEvent.target.closest?.('button');
  if (!dkdV327IsFinderButton(dkdButton)) return;
  dkdEvent.preventDefault();
  dkdEvent.stopPropagation();
  dkdEvent.stopImmediatePropagation();
  void dkdV327RunSearch(dkdButton);
}, true);

document.addEventListener('submit', (dkdEvent) => {
  const dkdForm = dkdEvent.target.closest?.('#dkd-v31-search-form');
  if (!dkdForm) return;
  dkdEvent.preventDefault();
  dkdEvent.stopPropagation();
  dkdEvent.stopImmediatePropagation();
  void dkdV327RunSearch(dkdForm);
}, true);

document.addEventListener('keydown', (dkdEvent) => {
  if (dkdEvent.key === 'Escape' && !dkdV327EnsureModal().hidden) dkdV327CloseModal();
});

function dkdV327PatchUi() {
  dkdV327State.patchQueued = false;
  dkdV327RemoveDuplicateEarnings();
  dkdV327CompactSiteSearch();
  if (dkdV327IsSimpleTheme()) {
    document.querySelector('#dkd-v30-root')?.remove();
    document.documentElement.dataset.dkdSimpleFinal = 'true';
  }
}

function dkdV327QueuePatch() {
  if (dkdV327State.patchQueued) return;
  dkdV327State.patchQueued = true;
  requestAnimationFrame(dkdV327PatchUi);
}

new MutationObserver(dkdV327QueuePatch).observe(document.body, { childList: true, subtree: true });
dkdV327PatchUi();

document.documentElement.classList.remove('dkd-simple-booting');
document.documentElement.dataset.dkdGateVersion = DKD_V327_VERSION;
sessionStorage.setItem('dkd_gate_web_version', DKD_V327_VERSION);
window.__DKD_GATE_V327_ACTIVE__ = true;
