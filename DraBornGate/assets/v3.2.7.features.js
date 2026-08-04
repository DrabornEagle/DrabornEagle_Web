const DKD_V327_VERSION = '3.2.7';
const dkdV327Data = window.dkdV31Data;
const dkdV327State = {
  finderBusy: false,
  patchTimer: 0,
  observer: null,
};

function dkdV327Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9@._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV327Escape(dkdValue) {
  return String(dkdValue ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV327Icon(dkdName) {
  const dkdIcons = {
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m16.5 16.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    courier: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16h2l2-6h7l2 6h2M8 10 6.5 7H4M15 10h3l2 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV327IsVisible(dkdElement) {
  if (!(dkdElement instanceof Element)) return false;
  const dkdStyle = getComputedStyle(dkdElement);
  const dkdRect = dkdElement.getBoundingClientRect();
  return dkdStyle.display !== 'none' && dkdStyle.visibility !== 'hidden' && dkdRect.width > 0 && dkdRect.height > 0;
}

function dkdV327RemoveLegacySimpleShell() {
  document.querySelector('#dkd-v28-root')?.remove();
  document.body?.classList.remove('dkd-v28-simple-active');
  document.documentElement.dataset.dkdV327SimpleClean = 'true';
}

function dkdV327RemoveDuplicateEarnings() {
  const dkdControls = [...document.querySelectorAll('button,a,[role="button"]')];
  for (const dkdControl of dkdControls) {
    if (dkdControl.closest('.dkd-v325-modal,.dkd-v327-modal')) continue;
    const dkdStrong = dkdControl.querySelector(':scope > strong');
    const dkdLabel = dkdV327Normalize(dkdStrong?.textContent || dkdControl.textContent);
    if (dkdLabel !== 'kazancim') continue;
    dkdControl.remove();
  }

  const dkdEarnings = [...document.querySelectorAll('[data-dkd-v325-earnings-menu],.dkd-v325-earnings-menu')]
    .filter(dkdV327IsVisible);
  for (const dkdDuplicate of dkdEarnings.slice(1)) dkdDuplicate.remove();
}

function dkdV327IsNewPassPage() {
  const dkdText = dkdV327Normalize(document.body?.innerText || '');
  return (dkdText.includes('yeni kurye gecisi') || dkdText.includes('yeni gecis talebi')) &&
    dkdText.includes('site');
}

function dkdV327FindSiteSelect() {
  const dkdNative = document.querySelector('select.dkd-v324-native-site');
  if (dkdNative) return dkdNative;
  const dkdLabels = [...document.querySelectorAll('label,span,strong,p,div')]
    .filter((dkdElement) => dkdV327Normalize(dkdElement.textContent) === 'site');
  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) return dkdSelect;
    }
  }
  return null;
}

function dkdV327CompactSiteSearch() {
  document.body?.classList.toggle('dkd-v327-new-pass', dkdV327IsNewPassPage());
  if (!dkdV327IsNewPassPage()) return;
  const dkdSelect = dkdV327FindSiteSelect();
  if (!dkdSelect?.parentElement) return;
  const dkdWidget = dkdSelect.parentElement.querySelector(':scope > .dkd-v23-site-search,:scope > .dkd-v324-site-search') ||
    dkdSelect.parentElement.querySelector('.dkd-v23-site-search,.dkd-v324-site-search');
  if (!dkdWidget) return;

  dkdWidget.classList.add('dkd-v327-site-search');
  dkdWidget.setAttribute('aria-label', 'Site ara ve seç');
  const dkdInput = dkdWidget.querySelector('input[type="search"],input');
  if (dkdInput) {
    dkdInput.placeholder = 'Site adı veya şehir ile ara';
    dkdInput.setAttribute('autocomplete', 'off');
    dkdInput.setAttribute('enterkeyhint', 'search');
  }

  for (const dkdParagraph of dkdWidget.querySelectorAll(':scope > p')) {
    const dkdText = dkdV327Normalize(dkdParagraph.textContent);
    if (dkdText.includes('otomatik secilmez') || dkdText.includes('en az 2 harf')) dkdParagraph.remove();
  }
}

function dkdV327FindCodeInput(dkdControl) {
  const dkdSelectors = [
    '#dkd-v31-code',
    'input[autocomplete="one-time-code"]',
    'input[maxlength="6"]',
    'input[inputmode="numeric"]',
    'input[type="tel"]',
    'input[type="text"]',
  ].join(',');

  let dkdScope = dkdControl;
  for (let dkdDepth = 0; dkdScope && dkdDepth < 8; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
    const dkdInput = [...dkdScope.querySelectorAll(dkdSelectors)]
      .find((dkdCandidate) => dkdV327IsVisible(dkdCandidate) && !dkdCandidate.disabled);
    if (dkdInput) return dkdInput;
  }

  return [...document.querySelectorAll(dkdSelectors)]
    .find((dkdCandidate) => {
      if (!dkdV327IsVisible(dkdCandidate) || dkdCandidate.disabled) return false;
      const dkdClue = dkdV327Normalize([
        dkdCandidate.id,
        dkdCandidate.name,
        dkdCandidate.placeholder,
        dkdCandidate.getAttribute('aria-label'),
        dkdCandidate.parentElement?.textContent?.slice(0, 180),
      ].join(' '));
      return dkdCandidate.maxLength === 6 || dkdClue.includes('kurye kodu') || dkdClue.includes('6 haneli');
    }) || null;
}

function dkdV327EnsureModal() {
  let dkdModal = document.querySelector('#dkd-v327-pass-modal');
  if (!dkdModal) {
    dkdModal = document.createElement('div');
    dkdModal.id = 'dkd-v327-pass-modal';
    dkdModal.className = 'dkd-v327-modal';
    dkdModal.hidden = true;
    document.body.appendChild(dkdModal);
  }
  return dkdModal;
}

function dkdV327CloseModal() {
  const dkdModal = document.querySelector('#dkd-v327-pass-modal');
  if (!dkdModal) return;
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  document.body.classList.remove('dkd-v327-modal-open');
}

function dkdV327BindClose(dkdModal) {
  for (const dkdButton of dkdModal.querySelectorAll('[data-dkd-v327-close]')) {
    dkdButton.addEventListener('click', dkdV327CloseModal);
  }
}

function dkdV327OpenLoading(dkdCode) {
  const dkdModal = dkdV327EnsureModal();
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v327-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v327-backdrop" data-dkd-v327-close></div>
    <section class="dkd-v327-panel" role="dialog" aria-modal="true" aria-label="Kurye geçiş detayları">
      <header class="dkd-v327-head"><div><span>DRABORNGATE WEB v${DKD_V327_VERSION}</span><h2>Kurye aranıyor</h2><p>${dkdV327Escape(dkdCode)} kodu canlı geçiş kayıtlarında doğrulanıyor.</p></div><button type="button" data-dkd-v327-close aria-label="Kapat">${dkdV327Icon('close')}</button></header>
      <div class="dkd-v327-loading"><i></i><strong>Detaylı kurye bilgileri hazırlanıyor…</strong></div>
    </section>`;
  dkdV327BindClose(dkdModal);
  return dkdModal;
}

function dkdV327Field(dkdLabel, dkdValue, dkdWide = false) {
  return `<article${dkdWide ? ' class="wide"' : ''}><span>${dkdV327Escape(dkdLabel)}</span><strong>${dkdV327Escape(dkdValue || '—')}</strong></article>`;
}

function dkdV327RenderPass(dkdModal, dkdPass, dkdCode) {
  const dkdDistance = Number(dkdPass.distance_m || 0) > 0
    ? `${Number(dkdPass.distance_m).toLocaleString('tr-TR')} m`
    : '—';
  const dkdEta = Number(dkdPass.eta_minutes || 0) > 0 ? `${Number(dkdPass.eta_minutes)} dk` : '—';
  const dkdAddress = dkdPass.destination_full || dkdPass.address_text || '—';

  dkdModal.querySelector('section').innerHTML = `<header class="dkd-v327-head"><div><span>KOD DOĞRULANDI · ${dkdV327Escape(dkdCode)}</span><h2>Kurye geçiş detayları</h2><p>Kurye, araç, sipariş ve teslimat bilgilerini kontrol ederek eşleştirmeyi tamamlayın.</p></div><button type="button" data-dkd-v327-close aria-label="Kapat">${dkdV327Icon('close')}</button></header>
    <div class="dkd-v327-hero"><div>${dkdV327Icon('courier')}</div><section><span>${dkdV327Escape(dkdPass.status || 'Aktif')}</span><h3>${dkdV327Escape(dkdPass.courier_name || 'Kurye')}</h3><p>${dkdV327Escape(dkdPass.platform || 'Platform yok')} · ${dkdV327Escape(dkdPass.courier_plate || 'Plaka yok')}</p></section><b>${dkdV327Escape(dkdEta)}</b></div>
    <div class="dkd-v327-grid">
      ${dkdV327Field('Telefon', dkdPass.courier_phone)}
      ${dkdV327Field('Plaka', dkdPass.courier_plate)}
      ${dkdV327Field('Platform', dkdPass.platform)}
      ${dkdV327Field('Sipariş', dkdPass.order_number)}
      ${dkdV327Field('Gönderici', dkdPass.origin_name)}
      ${dkdV327Field('Gönderici Adresi', dkdPass.origin_address, true)}
      ${dkdV327Field('Müşteri', dkdPass.customer_name)}
      ${dkdV327Field('Site', dkdPass.site_name)}
      ${dkdV327Field('Kapı', dkdPass.gate)}
      ${dkdV327Field('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '))}
      ${dkdV327Field('Mesafe', dkdDistance)}
      ${dkdV327Field('Tahmini Varış', dkdEta)}
      ${dkdV327Field('Tam Adres', dkdAddress, true)}
      ${dkdV327Field('Teslimat Notu', dkdPass.note, true)}
    </div>
    <footer class="dkd-v327-actions"><button type="button" data-dkd-v327-close>Vazgeç</button><button type="button" class="primary" data-dkd-v327-approve>${dkdV327Icon('check')} Eşleştirmeyi Tamamla</button></footer>`;
  dkdV327BindClose(dkdModal);

  dkdModal.querySelector('[data-dkd-v327-approve]')?.addEventListener('click', async (dkdEvent) => {
    const dkdButton = dkdEvent.currentTarget;
    dkdButton.disabled = true;
    dkdButton.textContent = 'Eşleştiriliyor…';
    try {
      const dkdResult = await dkdV327Data.approvePass(dkdCode);
      dkdModal.querySelector('section').innerHTML = `<div class="dkd-v327-success">${dkdV327Icon('check')}<h2>Eşleştirme tamamlandı</h2><p>${dkdV327Escape(dkdResult?.courier_name || dkdPass.courier_name || 'Kurye')} için geçiş güvenli şekilde tamamlandı.</p><button type="button" data-dkd-v327-close>Tamam</button></div>`;
      dkdV327BindClose(dkdModal);
      for (const dkdInput of document.querySelectorAll('#dkd-v31-code,input[autocomplete="one-time-code"]')) dkdInput.value = '';
    } catch (dkdError) {
      dkdButton.disabled = false;
      dkdButton.textContent = 'Tekrar Dene';
      alert(dkdV327Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
    }
  });
}

function dkdV327RenderError(dkdModal, dkdError) {
  const dkdMessage = dkdV327Data?.readableError?.(dkdError) || dkdError?.message || String(dkdError);
  dkdModal.querySelector('section').innerHTML = `<div class="dkd-v327-error"><h2>Kurye bulunamadı</h2><p>${dkdV327Escape(dkdMessage)}</p><button type="button" data-dkd-v327-close>Kapat</button></div>`;
  dkdV327BindClose(dkdModal);
}

async function dkdV327FindAndOpen(dkdControl) {
  if (dkdV327State.finderBusy) return;
  const dkdInput = dkdV327FindCodeInput(dkdControl);
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCode.length !== 6) {
    dkdInput?.focus();
    dkdInput?.setCustomValidity?.('6 haneli kurye kodunu girin.');
    dkdInput?.reportValidity?.();
    setTimeout(() => dkdInput?.setCustomValidity?.(''), 1400);
    return;
  }
  if (!dkdV327Data?.findPass || !dkdV327Data?.approvePass) {
    const dkdModal = dkdV327OpenLoading(dkdCode);
    dkdV327RenderError(dkdModal, new Error('Kurye doğrulama bağlantısı henüz hazır değil. Sayfayı yenileyip tekrar deneyin.'));
    return;
  }

  dkdV327State.finderBusy = true;
  const dkdModal = dkdV327OpenLoading(dkdCode);
  try {
    const dkdPass = await dkdV327Data.findPass(dkdCode);
    if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
    dkdV327RenderPass(dkdModal, dkdPass, dkdCode);
  } catch (dkdError) {
    dkdV327RenderError(dkdModal, dkdError);
  } finally {
    dkdV327State.finderBusy = false;
  }
}

function dkdV327IsFinderControl(dkdControl) {
  if (!dkdControl || dkdControl.closest('.dkd-v325-modal,.dkd-v327-modal')) return false;
  const dkdText = dkdV327Normalize([
    dkdControl.textContent,
    dkdControl.getAttribute('aria-label'),
    dkdControl.getAttribute('title'),
  ].join(' '));
  return dkdText.includes('kuryeni bul ve eslestir');
}

function dkdV327BindFinderCapture() {
  if (document.documentElement.dataset.dkdV327FinderBound === 'true') return;
  document.documentElement.dataset.dkdV327FinderBound = 'true';

  document.addEventListener('click', (dkdEvent) => {
    const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : dkdEvent.target?.parentElement;
    const dkdControl = dkdTarget?.closest('button,a,[role="button"],input[type="submit"]');
    if (!dkdV327IsFinderControl(dkdControl)) return;
    dkdEvent.preventDefault();
    dkdEvent.stopPropagation();
    dkdEvent.stopImmediatePropagation();
    void dkdV327FindAndOpen(dkdControl);
  }, true);

  document.addEventListener('submit', (dkdEvent) => {
    const dkdForm = dkdEvent.target;
    if (!(dkdForm instanceof HTMLFormElement)) return;
    const dkdControl = [...dkdForm.querySelectorAll('button,input[type="submit"]')].find(dkdV327IsFinderControl);
    if (!dkdControl) return;
    dkdEvent.preventDefault();
    dkdEvent.stopPropagation();
    dkdEvent.stopImmediatePropagation();
    void dkdV327FindAndOpen(dkdControl);
  }, true);

  document.addEventListener('keydown', (dkdEvent) => {
    if (dkdEvent.key !== 'Enter') return;
    const dkdInput = dkdEvent.target;
    if (!(dkdInput instanceof HTMLInputElement)) return;
    const dkdCode = String(dkdInput.value || '').replace(/\D/g, '');
    if (dkdCode.length !== 6) return;
    const dkdScope = dkdInput.closest('form,.dkd-v31-finder,.dkd-v324-finder,section,article');
    const dkdControl = [...(dkdScope?.querySelectorAll('button,[role="button"],input[type="submit"]') || [])].find(dkdV327IsFinderControl);
    if (!dkdControl) return;
    dkdEvent.preventDefault();
    void dkdV327FindAndOpen(dkdControl);
  }, true);
}

function dkdV327Patch() {
  dkdV327RemoveLegacySimpleShell();
  dkdV327RemoveDuplicateEarnings();
  dkdV327CompactSiteSearch();
  document.documentElement.dataset.dkdV327Ready = 'true';
  sessionStorage.setItem('dkd_gate_web_version', DKD_V327_VERSION);
}

function dkdV327SchedulePatch() {
  clearTimeout(dkdV327State.patchTimer);
  dkdV327State.patchTimer = setTimeout(dkdV327Patch, 90);
}

function dkdV327Boot() {
  dkdV327BindFinderCapture();
  dkdV327Patch();
  dkdV327State.observer = new MutationObserver(dkdV327SchedulePatch);
  dkdV327State.observer.observe(document.body, { childList: true, subtree: true });
}

window.__DKD_GATE_V327_FEATURES__ = {
  version: DKD_V327_VERSION,
  state: dkdV327State,
  patch: dkdV327Patch,
  findAndOpen: dkdV327FindAndOpen,
};

dkdV327Boot();
