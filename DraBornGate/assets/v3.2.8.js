const DKD_V328_VERSION = '3.2.8';

const dkdV328State = {
  patchQueued: false,
  searchBusy: false,
  sitePageActive: false,
  siteValue: '',
  siteLabel: '',
  modalMode: '',
};

function dkdV328Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV328Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV328Icon(dkdName) {
  const dkdIcons = {
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="16" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 13 9-9m-3 3 3 3m-6 0 3 3" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h3l1.2 4-2 1.4a15 15 0 0 0 6.4 6.4l1.4-2 4 1.2v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="1.7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.1 7-12A7 7 0 0 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h16m-5 5h5" stroke="currentColor" stroke-width="1.8"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" stroke="currentColor" stroke-width="1.8"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV328IsSimpleTheme() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema')
    || sessionStorage.getItem('dkd_gate_security_theme') === 'simple'
    || sessionStorage.getItem('dkd_gate_force_theme') === 'simple'
    || document.body.classList.contains('dkd-v31-simple-active');
}

function dkdV328Visible(dkdElement) {
  if (!dkdElement) return false;
  const dkdStyle = getComputedStyle(dkdElement);
  const dkdRect = dkdElement.getBoundingClientRect();
  return dkdStyle.display !== 'none' && dkdStyle.visibility !== 'hidden' && dkdRect.width > 1 && dkdRect.height > 1;
}

function dkdV328FindExact(dkdText, dkdRoot = document) {
  const dkdWanted = dkdV328Normalize(dkdText);
  return [...dkdRoot.querySelectorAll('button,a,[role="button"],label,h1,h2,h3,h4,strong,b,span,p,small')]
    .find((dkdElement) => dkdV328Visible(dkdElement) && dkdV328Normalize(dkdElement.textContent) === dkdWanted);
}

function dkdV328CurrentRole() {
  return window.dkdV325Session?.currentRole?.()
    || window.dkdV324Session?.currentRole?.()
    || window.dkdV31Data?.state?.role
    || '';
}

function dkdV328IsCourierArea() {
  const dkdRole = dkdV328Normalize(dkdV328CurrentRole());
  if (dkdRole === 'courier' || dkdRole === 'kurye') return true;
  const dkdText = dkdV328Normalize(document.body?.innerText || '');
  return dkdText.includes('kurye operasyonu')
    || (dkdText.includes('yeni kurye gecisi') && dkdText.includes('gecislerim') && dkdText.includes('hareket'));
}

function dkdV328PatchCourierHeader() {
  if (!dkdV328IsCourierArea()) return;
  const dkdCandidates = [...document.querySelectorAll('header h1,header h2,header h3,header strong,header span,[class*="header"] h1,[class*="header"] h2,[class*="header"] h3,[class*="header"] strong,[class*="topbar"] strong,[class*="top-bar"] strong')];
  for (const dkdCandidate of dkdCandidates) {
    if (!dkdV328Visible(dkdCandidate)) continue;
    const dkdRect = dkdCandidate.getBoundingClientRect();
    if (dkdRect.top < 0 || dkdRect.top > 230 || dkdRect.width < 80) continue;
    const dkdText = dkdV328Normalize(dkdCandidate.textContent);
    if (!dkdText || dkdText === 'kurye paneli' || dkdText.includes('draborngate')) continue;
    if (/^(menu|bildirim|kurye|yeni|gecislerim|hareket)$/.test(dkdText)) continue;
    let dkdScope = dkdCandidate.parentElement;
    let dkdHasControls = false;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 5; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      if (dkdScope.querySelectorAll('button,a,[role="button"]').length >= 2) {
        dkdHasControls = true;
        break;
      }
    }
    if (!dkdHasControls) continue;
    dkdCandidate.textContent = 'Kurye Paneli';
    dkdCandidate.dataset.dkdV328CourierTitle = 'true';
    break;
  }
}

function dkdV328FormatMoney(dkdValue) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(Number(dkdValue || 0));
}

function dkdV328FormatDate(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime())
    ? String(dkdValue)
    : dkdDate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
}

function dkdV328EnsureModal() {
  let dkdModal = document.querySelector('#dkd-v328-modal');
  if (!dkdModal) {
    dkdModal = document.createElement('div');
    dkdModal.id = 'dkd-v328-modal';
    dkdModal.hidden = true;
    document.body.appendChild(dkdModal);
  }
  return dkdModal;
}

function dkdV328CloseModal() {
  const dkdModal = dkdV328EnsureModal();
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  dkdV328State.modalMode = '';
  document.body.classList.remove('dkd-v328-modal-open');
}

function dkdV328BindModalClose(dkdModal) {
  for (const dkdClose of dkdModal.querySelectorAll('[data-dkd-v328-close]')) {
    dkdClose.addEventListener('click', dkdV328CloseModal);
  }
}

function dkdV328Detail(dkdLabel, dkdValue, dkdIcon = 'user', dkdWide = false) {
  const dkdSafeValue = dkdValue === null || dkdValue === undefined || dkdValue === '' ? '—' : dkdValue;
  return `<article class="dkd-v328-detail ${dkdWide ? 'wide' : ''}"><span>${dkdV328Icon(dkdIcon)}</span><div><small>${dkdV328Escape(dkdLabel)}</small><strong>${dkdV328Escape(dkdSafeValue)}</strong></div></article>`;
}

function dkdV328RenderPassModal(dkdPass, dkdCode) {
  const dkdModal = dkdV328EnsureModal();
  const dkdDestination = dkdPass.destination_full
    || [dkdPass.site_name, dkdPass.gate, dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' · ')
    || '—';
  const dkdOrigin = [dkdPass.origin_name, dkdPass.origin_address].filter(Boolean).join(' · ') || '—';
  const dkdDistance = dkdPass.distance_m || dkdPass.distance_m === 0 ? `${dkdPass.distance_m} m` : '—';
  const dkdEta = dkdPass.eta_minutes || dkdPass.eta_minutes === 0 ? `${dkdPass.eta_minutes} dk` : '—';

  dkdV328State.modalMode = 'pass';
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v328-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v328-backdrop" data-dkd-v328-close></div>
    <section class="dkd-v328-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v328-title">
      <header>
        <div><span>KODLA KURYE DOĞRULAMA</span><h2 id="dkd-v328-title">Kurye Bilgileri</h2><p>Giriş vermeden önce bütün teslimat bilgilerini kontrol edin.</p></div>
        <button type="button" class="dkd-v328-close" data-dkd-v328-close aria-label="Kapat">${dkdV328Icon('close')}</button>
      </header>
      <main>
        <div class="dkd-v328-hero">
          <div class="dkd-v328-avatar">${dkdV328Icon('user')}</div>
          <div><small>KURYE</small><h3>${dkdV328Escape(dkdPass.courier_name || 'Kurye')}</h3><p>${dkdV328Escape([dkdPass.platform, dkdPass.courier_plate].filter(Boolean).join(' · ') || 'Bilgi bekleniyor')}</p></div>
          <span>${dkdV328Escape(dkdPass.status || 'Aktif')}</span>
        </div>
        <div class="dkd-v328-route">
          <article><span>${dkdV328Icon('route')}</span><div><small>NEREDEN GELİYOR</small><strong>${dkdV328Escape(dkdOrigin)}</strong></div></article>
          <article><span>${dkdV328Icon('pin')}</span><div><small>GİDECEĞİ TAM ADRES</small><strong>${dkdV328Escape(dkdDestination)}</strong></div></article>
        </div>
        <div class="dkd-v328-grid">
          ${dkdV328Detail('Kurye Adı Soyadı', dkdPass.courier_name, 'user')}
          ${dkdV328Detail('Kurye Telefonu', dkdPass.courier_phone, 'phone')}
          ${dkdV328Detail('Platform', dkdPass.platform, 'route')}
          ${dkdV328Detail('Plaka', dkdPass.courier_plate, 'route')}
          ${dkdV328Detail('Müşteri Adı Soyadı', dkdPass.customer_name, 'user')}
          ${dkdV328Detail('Sipariş Numarası', dkdPass.order_number, 'search')}
          ${dkdV328Detail('Site / Kapı', [dkdPass.site_name, dkdPass.gate].filter(Boolean).join(' · '), 'pin')}
          ${dkdV328Detail('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '), 'pin')}
          ${dkdV328Detail('Mesafe / Tahmini Varış', `${dkdDistance} · ${dkdEta}`, 'route')}
          ${dkdV328Detail('Kapıya Geliş', dkdV328FormatDate(dkdPass.arrived_at || dkdPass.created_at), 'route')}
          ${dkdV328Detail('Teslimat Notu', dkdPass.note, 'user', true)}
        </div>
        <div class="dkd-v328-code"><small>6 HANELİ EŞLEŞTİRME KODU</small><strong>${dkdV328Escape(dkdCode || dkdPass.approval_code || '—')}</strong>${dkdV328Icon('key')}</div>
      </main>
      <footer>
        <button type="button" class="secondary" data-dkd-v328-close>Kapat</button>
        <button type="button" id="dkd-v328-approve">${dkdV328Icon('key')}<span>Kodu Onayla ve Giriş Ver</span></button>
      </footer>
    </section>`;

  dkdV328BindModalClose(dkdModal);
  const dkdApprove = dkdModal.querySelector('#dkd-v328-approve');
  dkdApprove?.addEventListener('click', async () => {
    const dkdData = window.dkdV31Data;
    if (typeof dkdData?.approvePass !== 'function') {
      dkdApprove.querySelector('span').textContent = 'Onay servisi hazır değil';
      return;
    }
    dkdApprove.disabled = true;
    dkdApprove.querySelector('span').textContent = 'Kod onaylanıyor…';
    try {
      const dkdResult = await dkdData.approvePass(String(dkdCode || dkdPass.approval_code || '').replace(/\D/g, '').slice(0, 6));
      dkdModal.innerHTML = `<div class="dkd-v328-backdrop"></div><section class="dkd-v328-panel dkd-v328-success" role="dialog" aria-modal="true"><div>${dkdV328Icon('check')}</div><h2>Giriş Onaylandı</h2><p>${dkdV328Escape(dkdResult?.courier_name || dkdPass.courier_name || 'Kurye')} için kurye geçişi tamamlandı.</p><button type="button" data-dkd-v328-close>Tamam</button></section>`;
      dkdV328BindModalClose(dkdModal);
      await dkdData.loadQueue?.().catch?.(() => undefined);
    } catch (dkdError) {
      dkdApprove.disabled = false;
      dkdApprove.querySelector('span').textContent = 'Kodu Onayla ve Giriş Ver';
      const dkdReadable = dkdData?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
      let dkdErrorBox = dkdModal.querySelector('.dkd-v328-modal-error');
      if (!dkdErrorBox) {
        dkdErrorBox = document.createElement('div');
        dkdErrorBox.className = 'dkd-v328-modal-error';
        dkdModal.querySelector('.dkd-v328-panel footer')?.before(dkdErrorBox);
      }
      dkdErrorBox.textContent = dkdReadable;
    }
  });

  requestAnimationFrame(() => dkdModal.querySelector('.dkd-v328-close')?.focus({ preventScroll: true }));
}

function dkdV328SetFinderFeedback(dkdForm, dkdType, dkdText) {
  let dkdFeedback = dkdForm.querySelector('.dkd-v328-feedback');
  if (!dkdFeedback) {
    dkdFeedback = document.createElement('div');
    dkdFeedback.className = 'dkd-v328-feedback';
    dkdForm.appendChild(dkdFeedback);
  }
  dkdFeedback.className = `dkd-v328-feedback ${dkdType}`;
  dkdFeedback.textContent = dkdText;
}

async function dkdV328FindCourier(dkdForm) {
  if (dkdV328State.searchBusy) return;
  const dkdInput = dkdForm.querySelector('#dkd-v31-code,input[type="tel"][maxlength="6"],input[inputmode="numeric"][maxlength="6"]');
  const dkdButton = dkdForm.querySelector('button');
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdInput) dkdInput.value = dkdCode;
  if (dkdCode.length !== 6) {
    dkdV328SetFinderFeedback(dkdForm, 'error', 'Lütfen 6 haneli kurye kodunu eksiksiz girin.');
    dkdInput?.focus({ preventScroll: true });
    return;
  }

  const dkdData = window.dkdV31Data;
  if (typeof dkdData?.findPass !== 'function') {
    dkdV328SetFinderFeedback(dkdForm, 'error', 'Kurye doğrulama servisi hazır değil. Sayfayı yenileyip tekrar deneyin.');
    return;
  }

  dkdV328State.searchBusy = true;
  const dkdOriginal = dkdButton?.innerHTML || '';
  if (dkdButton) {
    dkdButton.disabled = true;
    dkdButton.innerHTML = `${dkdV328Icon('search')}<span>Kurye aranıyor…</span>`;
  }
  dkdV328SetFinderFeedback(dkdForm, 'loading', 'Kurye kodu güvenli veritabanında aranıyor…');
  try {
    const dkdPass = await dkdData.findPass(dkdCode);
    if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye bulunamadı.');
    dkdV328SetFinderFeedback(dkdForm, 'success', 'Kurye bulundu. Ayrıntılar açılıyor…');
    dkdV328RenderPassModal(dkdPass, dkdCode);
  } catch (dkdError) {
    const dkdReadable = dkdData.readableError?.(dkdError) || dkdError?.message || String(dkdError);
    dkdV328SetFinderFeedback(dkdForm, 'error', dkdReadable);
  } finally {
    dkdV328State.searchBusy = false;
    if (dkdButton) {
      dkdButton.disabled = false;
      dkdButton.innerHTML = dkdOriginal || `${dkdV328Icon('search')}<span>Kuryeni Bul ve Eşleştir</span>`;
    }
  }
}

function dkdV328BindFinder() {
  if (!dkdV328IsSimpleTheme()) return false;
  const dkdOriginalForm = document.querySelector('#dkd-v31-search-form');
  if (!dkdOriginalForm) return false;
  if (dkdOriginalForm.dataset.dkdV328Bound === 'true') return true;

  const dkdForm = dkdOriginalForm.cloneNode(true);
  dkdForm.dataset.dkdV328Bound = 'true';
  dkdOriginalForm.replaceWith(dkdForm);
  const dkdInput = dkdForm.querySelector('#dkd-v31-code,input[type="tel"][maxlength="6"],input[inputmode="numeric"][maxlength="6"]');
  const dkdButton = dkdForm.querySelector('button');
  if (dkdButton) dkdButton.type = 'button';
  dkdInput?.addEventListener('input', () => {
    dkdInput.value = dkdInput.value.replace(/\D/g, '').slice(0, 6);
    dkdInput.classList.toggle('ready', dkdInput.value.length === 6);
  });
  dkdButton?.addEventListener('click', (dkdEvent) => {
    dkdEvent.preventDefault();
    void dkdV328FindCourier(dkdForm);
  });
  dkdForm.addEventListener('submit', (dkdEvent) => {
    dkdEvent.preventDefault();
    void dkdV328FindCourier(dkdForm);
  });
  return true;
}

function dkdV328FindSelectByLabel(dkdLabelText) {
  const dkdTarget = dkdV328Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
    .filter((dkdElement) => dkdV328Normalize(dkdElement.textContent) === dkdTarget);
  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) return dkdSelect;
    }
  }
  return null;
}

function dkdV328SetSelectValue(dkdSelect, dkdValue) {
  if (!dkdSelect) return;
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  [...dkdSelect.options].forEach((dkdOption) => {
    dkdOption.selected = dkdOption.value === dkdValue;
  });
  dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
  dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV328GateSelect() {
  return dkdV328FindSelectByLabel('Kapı') || dkdV328FindSelectByLabel('Kapi');
}

function dkdV328LegacySiteWidget(dkdSelect) {
  return dkdSelect.parentElement?.querySelector('.dkd-v23-site-search,.dkd-v324-site-search')
    || dkdSelect.closest('div')?.querySelector('.dkd-v23-site-search,.dkd-v324-site-search')
    || null;
}

function dkdV328SyncLegacySelection(dkdSelect, dkdOption) {
  const dkdWidget = dkdV328LegacySiteWidget(dkdSelect);
  const dkdLegacyInput = dkdWidget?.querySelector('input[type="search"]');
  if (dkdLegacyInput) {
    dkdLegacyInput.value = dkdOption.textContent.trim();
    dkdLegacyInput.dispatchEvent(new Event('input', { bubbles: true }));
    const dkdLegacyButton = [...dkdWidget.querySelectorAll('[data-dkd-site]')]
      .find((dkdButton) => {
        try {
          return decodeURIComponent(dkdButton.dataset.dkdSite || '') === dkdOption.value;
        } catch {
          return false;
        }
      });
    if (dkdLegacyButton) {
      dkdLegacyButton.click();
      return;
    }
  }
  dkdV328SetSelectValue(dkdSelect, dkdOption.value);
}

function dkdV328ClearSite(dkdSelect, dkdPicker) {
  dkdV328State.siteValue = '';
  dkdV328State.siteLabel = '';
  const dkdWidget = dkdV328LegacySiteWidget(dkdSelect);
  const dkdLegacyInput = dkdWidget?.querySelector('input[type="search"]');
  if (dkdLegacyInput) {
    dkdLegacyInput.value = '';
    dkdLegacyInput.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    dkdV328SetSelectValue(dkdSelect, '');
  }
  const dkdInput = dkdPicker.querySelector('input');
  const dkdResults = dkdPicker.querySelector('.dkd-v328-site-results');
  const dkdClear = dkdPicker.querySelector('.dkd-v328-site-clear');
  if (dkdInput) dkdInput.value = '';
  if (dkdResults) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
  }
  if (dkdClear) dkdClear.hidden = true;
  dkdPicker.classList.remove('selected');
  const dkdGate = dkdV328GateSelect();
  if (dkdGate) {
    dkdV328SetSelectValue(dkdGate, '');
    dkdGate.disabled = true;
  }
}

function dkdV328MountSitePicker() {
  const dkdText = dkdV328Normalize(document.body?.innerText || '');
  const dkdIsPage = dkdText.includes('yeni kurye gecisi') && dkdText.includes('siparis numarasi');
  if (!dkdIsPage) {
    dkdV328State.sitePageActive = false;
    dkdV328State.siteValue = '';
    dkdV328State.siteLabel = '';
    return false;
  }

  const dkdSelect = dkdV328FindSelectByLabel('Site');
  if (!dkdSelect) return false;
  if (!dkdV328State.sitePageActive) {
    dkdV328State.sitePageActive = true;
    dkdV328State.siteValue = '';
    dkdV328State.siteLabel = '';
  }

  const dkdHost = dkdSelect.parentElement;
  if (!dkdHost) return false;
  dkdHost.classList.add('dkd-v328-site-host');
  dkdSelect.classList.add('dkd-v328-native-site');
  for (const dkdLegacy of dkdHost.querySelectorAll('.dkd-v23-site-search,.dkd-v324-site-search')) {
    dkdLegacy.hidden = true;
    dkdLegacy.setAttribute('aria-hidden', 'true');
  }

  let dkdPicker = dkdHost.querySelector(':scope > .dkd-v328-site-picker');
  if (!dkdPicker) {
    dkdPicker = document.createElement('div');
    dkdPicker.className = 'dkd-v328-site-picker';
    dkdPicker.innerHTML = `<div class="dkd-v328-site-row"><span>${dkdV328Icon('building')}</span><input type="search" autocomplete="off" inputmode="search" placeholder="Site adı veya şehir yaz" aria-label="Site ara"><button type="button" class="dkd-v328-site-clear" aria-label="Site seçimini temizle" hidden>${dkdV328Icon('close')}</button></div><div class="dkd-v328-site-results" hidden></div>`;
    dkdHost.insertBefore(dkdPicker, dkdSelect);

    const dkdInput = dkdPicker.querySelector('input');
    const dkdResults = dkdPicker.querySelector('.dkd-v328-site-results');
    const dkdClear = dkdPicker.querySelector('.dkd-v328-site-clear');

    const dkdRenderResults = () => {
      const dkdQuery = dkdV328Normalize(dkdInput.value);
      if (dkdQuery.length < 2) {
        dkdResults.hidden = true;
        dkdResults.innerHTML = '';
        return;
      }
      const dkdOptions = [...dkdSelect.options]
        .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
        .map((dkdOption) => ({ value: dkdOption.value, label: dkdOption.textContent.trim() }))
        .filter((dkdOption) => dkdV328Normalize(dkdOption.label).includes(dkdQuery))
        .slice(0, 15);
      dkdResults.hidden = false;
      dkdResults.innerHTML = dkdOptions.length
        ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v328-site="${encodeURIComponent(dkdOption.value)}"><span>${dkdV328Icon('building')}</span><strong>${dkdV328Escape(dkdOption.label)}</strong><i>Seç</i></button>`).join('')
        : '<div class="dkd-v328-site-empty">Eşleşen aktif site bulunamadı.</div>';
    };

    dkdInput.addEventListener('input', () => {
      if (dkdV328State.siteValue && dkdInput.value !== dkdV328State.siteLabel) dkdV328ClearSite(dkdSelect, dkdPicker);
      dkdRenderResults();
    });
    dkdInput.addEventListener('focus', dkdRenderResults);
    dkdInput.addEventListener('keydown', (dkdEvent) => {
      if (dkdEvent.key === 'Escape') {
        dkdResults.hidden = true;
        dkdResults.innerHTML = '';
      }
    });
    dkdClear.addEventListener('click', () => {
      dkdV328ClearSite(dkdSelect, dkdPicker);
      dkdInput.focus();
    });
    dkdResults.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target.closest('[data-dkd-v328-site]');
      if (!dkdButton) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV328Site || '');
      const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdValue);
      if (!dkdOption) return;
      dkdV328State.siteValue = dkdOption.value;
      dkdV328State.siteLabel = dkdOption.textContent.trim();
      dkdV328SyncLegacySelection(dkdSelect, dkdOption);
      dkdInput.value = dkdV328State.siteLabel;
      dkdResults.hidden = true;
      dkdResults.innerHTML = '';
      dkdClear.hidden = false;
      dkdPicker.classList.add('selected');
      const dkdGate = dkdV328GateSelect();
      if (dkdGate) dkdGate.disabled = false;
    });
  }

  if (dkdV328State.siteValue) {
    const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdV328State.siteValue);
    if (dkdOption) {
      if (dkdSelect.value !== dkdOption.value) dkdV328SyncLegacySelection(dkdSelect, dkdOption);
      dkdPicker.querySelector('input').value = dkdV328State.siteLabel || dkdOption.textContent.trim();
      dkdPicker.querySelector('.dkd-v328-site-clear').hidden = false;
      dkdPicker.classList.add('selected');
    }
  } else {
    if (dkdSelect.value) dkdV328SetSelectValue(dkdSelect, '');
    const dkdGate = dkdV328GateSelect();
    if (dkdGate) {
      if (!dkdGate.dataset.dkdV328Initialized) {
        dkdGate.dataset.dkdV328Initialized = 'true';
        dkdV328SetSelectValue(dkdGate, '');
      }
      dkdGate.disabled = true;
    }
  }
  return true;
}

function dkdV328FindMenuItem(dkdLabel) {
  const dkdNode = dkdV328FindExact(dkdLabel);
  return dkdNode?.closest('button,a,[role="button"],li,.dkd-v31-menu-item') || null;
}

function dkdV328RenderEarnings(dkdSummary, dkdRows) {
  const dkdModal = dkdV328EnsureModal();
  if (dkdV328State.modalMode !== 'earnings') return;
  dkdModal.innerHTML = `<div class="dkd-v328-backdrop" data-dkd-v328-close></div>
    <section class="dkd-v328-panel dkd-v328-finance" role="dialog" aria-modal="true">
      <header><div><span>KURYE KAZANÇ MERKEZİ</span><h2>Kazançlarım</h2><p>Tamamlanan kurye geçişlerinden oluşan kazanç özeti ve hareketleri.</p></div><button type="button" class="dkd-v328-close" data-dkd-v328-close>${dkdV328Icon('close')}</button></header>
      <main>
        <div class="dkd-v328-finance-stats">
          <article><small>Toplam Kazanç</small><strong>${dkdV328FormatMoney(dkdSummary?.total_amount)}</strong></article>
          <article><small>Bu Ay</small><strong>${dkdV328FormatMoney(dkdSummary?.month_amount)}</strong></article>
          <article><small>Bugün</small><strong>${dkdV328FormatMoney(dkdSummary?.today_amount)}</strong></article>
          <article><small>Kurye Geçişi</small><strong>${Number(dkdSummary?.pass_count || 0)}</strong></article>
        </div>
        <section class="dkd-v328-linked-sites"><h3>Bağlı Siteler</h3>${(dkdSummary?.sites || []).map((dkdSite) => `<article><strong>${dkdV328Escape(dkdSite.site_name)}</strong><span>Kurye başına ${dkdV328FormatMoney(dkdSite.amount_per_courier)}</span></article>`).join('') || '<p>Aktif site bağlantısı yok.</p>'}</section>
        <section class="dkd-v328-earnings-list"><h3>Kazanç Hareketleri</h3>${dkdRows.map((dkdRow) => `<article><div><strong>${dkdV328Escape(dkdRow.site_name)}</strong><small>${dkdV328FormatDate(dkdRow.earned_at)} · ${dkdV328Escape(dkdRow.courier_name)}</small></div><span>${dkdV328FormatMoney(dkdRow.amount)}</span></article>`).join('') || '<p>Henüz kazanç hareketi oluşmadı.</p>'}</section>
      </main>
      <footer><button type="button" class="secondary" data-dkd-v328-close>Kapat</button></footer>
    </section>`;
  dkdV328BindModalClose(dkdModal);
}

async function dkdV328OpenEarnings() {
  const dkdModal = dkdV328EnsureModal();
  const dkdData = window.dkdV31Data;
  dkdV328State.modalMode = 'earnings';
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v328-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v328-backdrop" data-dkd-v328-close></div><section class="dkd-v328-panel dkd-v328-loading"><div>${dkdV328Icon('wallet')}</div><h2>Kazançlar hazırlanıyor…</h2></section>`;
  dkdV328BindModalClose(dkdModal);
  try {
    const dkdSummary = typeof dkdData?.loadPartnerSummary === 'function'
      ? await dkdData.loadPartnerSummary()
      : dkdData?.state?.partnerSummary;
    if (typeof dkdData?.loadPartnerRows === 'function') await dkdData.loadPartnerRows(10, 0);
    const dkdRows = dkdData?.state?.partnerRows || [];
    dkdV328RenderEarnings(dkdSummary || dkdData?.state?.partnerSummary || {}, dkdRows);
  } catch (dkdError) {
    const dkdReadable = dkdData?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
    dkdModal.innerHTML = `<div class="dkd-v328-backdrop" data-dkd-v328-close></div><section class="dkd-v328-panel dkd-v328-error"><h2>Kazançlar açılamadı</h2><p>${dkdV328Escape(dkdReadable)}</p><button type="button" data-dkd-v328-close>Kapat</button></section>`;
    dkdV328BindModalClose(dkdModal);
  }
}

function dkdV328EnsureEarningsMenu() {
  for (const dkdItem of [...document.querySelectorAll('button,a,[role="button"],.dkd-v31-menu-item')]) {
    if (dkdV328Normalize(dkdItem.textContent) === 'kazancim') dkdItem.closest('button,a,[role="button"],.dkd-v31-menu-item')?.remove();
  }
  if (!dkdV328IsCourierArea()) return;
  const dkdProfileItem = dkdV328FindMenuItem('Profil ve Bağlantı');
  if (!dkdProfileItem) return;

  const dkdExisting = [...document.querySelectorAll('button,a,[role="button"],.dkd-v31-menu-item')]
    .filter((dkdItem) => dkdV328Normalize(dkdItem.textContent) === 'kazanclarim');
  let dkdMenu = dkdExisting.find((dkdItem) => dkdItem.dataset.dkdV328Earnings === 'true') || dkdExisting[0];
  for (const dkdDuplicate of dkdExisting) {
    if (dkdDuplicate !== dkdMenu) dkdDuplicate.closest('button,a,[role="button"],.dkd-v31-menu-item')?.remove();
  }

  if (!dkdMenu) {
    dkdMenu = dkdProfileItem.cloneNode(true);
    dkdMenu.removeAttribute('id');
    dkdMenu.querySelectorAll('[id]').forEach((dkdNode) => dkdNode.removeAttribute('id'));
    const dkdLabel = [...dkdMenu.querySelectorAll('span,strong,b,p')]
      .find((dkdNode) => dkdV328Normalize(dkdNode.textContent) === 'profil ve baglanti');
    if (dkdLabel) dkdLabel.textContent = 'Kazançlarım';
    else dkdMenu.append('Kazançlarım');
    const dkdIconHost = dkdMenu.querySelector('svg')?.parentElement || dkdMenu.querySelector('[class*="icon"]');
    if (dkdIconHost) dkdIconHost.innerHTML = dkdV328Icon('wallet');
    if (dkdMenu instanceof HTMLAnchorElement) dkdMenu.href = '#';
    if (dkdMenu instanceof HTMLButtonElement) dkdMenu.type = 'button';
    dkdProfileItem.after(dkdMenu);
  }

  if (dkdMenu.dataset.dkdV328Earnings !== 'true') {
    const dkdCleanMenu = dkdMenu.cloneNode(true);
    dkdCleanMenu.dataset.dkdV328Earnings = 'true';
    dkdCleanMenu.classList.add('dkd-v328-earnings-menu');
    if (dkdCleanMenu instanceof HTMLAnchorElement) dkdCleanMenu.href = '#';
    if (dkdCleanMenu instanceof HTMLButtonElement) dkdCleanMenu.type = 'button';
    dkdMenu.replaceWith(dkdCleanMenu);
    dkdMenu = dkdCleanMenu;
    dkdMenu.addEventListener('click', (dkdEvent) => {
      dkdEvent.preventDefault();
      void dkdV328OpenEarnings();
    });
  }
  dkdMenu.hidden = false;
  dkdMenu.style.removeProperty('display');
  dkdMenu.setAttribute('aria-hidden', 'false');
}

function dkdV328PatchUi() {
  dkdV328State.patchQueued = false;
  dkdV328PatchCourierHeader();
  dkdV328MountSitePicker();
  dkdV328EnsureEarningsMenu();
  dkdV328BindFinder();
  if (dkdV328IsSimpleTheme()) {
    document.querySelector('#dkd-v30-root')?.remove();
    document.documentElement.dataset.dkdSimpleFinal = 'true';
  }
}

function dkdV328QueuePatch() {
  if (dkdV328State.patchQueued) return;
  dkdV328State.patchQueued = true;
  requestAnimationFrame(dkdV328PatchUi);
}

async function dkdV328WaitForSimpleReady() {
  if (!dkdV328IsSimpleTheme()) return;
  const dkdDeadline = Date.now() + 2600;
  while (Date.now() < dkdDeadline) {
    dkdV328PatchUi();
    const dkdRoot = document.querySelector('#dkd-v31-root');
    const dkdForm = document.querySelector('#dkd-v31-search-form[data-dkd-v328-bound="true"]');
    if (dkdRoot && dkdForm) return;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 50));
  }
}

document.addEventListener('keydown', (dkdEvent) => {
  if (dkdEvent.key === 'Escape' && !dkdV328EnsureModal().hidden) dkdV328CloseModal();
});

new MutationObserver(dkdV328QueuePatch).observe(document.body, { childList: true, subtree: true });
dkdV328PatchUi();
await dkdV328WaitForSimpleReady();

document.documentElement.dataset.dkdGateVersion = DKD_V328_VERSION;
sessionStorage.setItem('dkd_gate_web_version', DKD_V328_VERSION);
window.__DKD_GATE_V328_ACTIVE__ = true;
