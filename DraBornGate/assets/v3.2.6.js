const DKD_V326_VERSION = '3.2.6';
const dkdV326State = {
  patchTimer: 0,
  finderBusy: false,
  lastFinderTriggerAt: 0,
  observer: null,
};

function dkdV326Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9@._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV326Escape(dkdValue) {
  return String(dkdValue ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV326Icon(dkdName) {
  const dkdIcons = {
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    site: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV326ExactText(dkdText, dkdRoot = document) {
  const dkdWanted = dkdV326Normalize(dkdText);
  return [...dkdRoot.querySelectorAll('h1,h2,h3,h4,strong,b,span,p,button,a,label,[role="button"]')]
    .find((dkdElement) => dkdV326Normalize(dkdElement.textContent) === dkdWanted);
}

function dkdV326IsNewPassPage() {
  const dkdText = dkdV326Normalize(document.body?.innerText || '');
  return (dkdText.includes('yeni kurye gecisi') || dkdText.includes('yeni gecis talebi')) && dkdText.includes('site');
}

function dkdV326RemoveLegacyEarnings() {
  for (const dkdNode of document.querySelectorAll('strong,b,span,p,button,a,[role="button"]')) {
    if (dkdV326Normalize(dkdNode.textContent) !== 'kazancim') continue;
    const dkdControl = dkdNode.closest('button,a,[role="button"],li,.dkd-v31-menu-item');
    if (!dkdControl || dkdControl.matches('[data-dkd-v325-earnings-menu]') || dkdControl.querySelector('[data-dkd-v325-earnings-menu]')) continue;
    dkdControl.dataset.dkdV326LegacyEarnings = 'true';
    dkdControl.remove();
  }
}

function dkdV326FindSiteSelect() {
  const dkdSiteLabel = dkdV326ExactText('Site');
  let dkdScope = dkdSiteLabel?.parentElement || null;
  for (let dkdDepth = 0; dkdScope && dkdDepth < 8; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
    const dkdSelect = dkdScope.querySelector('select');
    if (dkdSelect) return dkdSelect;
  }
  return [...document.querySelectorAll('select')].find((dkdSelect) =>
    [...dkdSelect.options].some((dkdOption) => dkdV326Normalize(dkdOption.textContent).includes('site'))
  ) || null;
}

function dkdV326SetSelectValue(dkdSelect, dkdValue, dkdDispatch = true) {
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  for (const dkdOption of dkdSelect.options) dkdOption.selected = dkdOption.value === dkdValue;
  if (dkdDispatch) {
    dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function dkdV326RenderSiteResults(dkdWidget, dkdSelect) {
  const dkdInput = dkdWidget.querySelector('input');
  const dkdResults = dkdWidget.querySelector('.dkd-v326-site-results');
  const dkdClear = dkdWidget.querySelector('.dkd-v326-site-clear');
  const dkdQuery = dkdV326Normalize(dkdInput?.value || '');
  if (dkdClear) dkdClear.hidden = !String(dkdInput?.value || '').trim();
  if (!dkdResults) return;
  if (dkdQuery.length < 2) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
    return;
  }
  const dkdOptions = [...dkdSelect.options]
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled && dkdV326Normalize(dkdOption.textContent).includes(dkdQuery))
    .slice(0, 18);
  dkdResults.hidden = false;
  dkdResults.innerHTML = dkdOptions.length
    ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v326-site-value="${encodeURIComponent(dkdOption.value)}"><span>${dkdV326Escape(String(dkdOption.textContent || '').trim())}</span><b>SEÇ</b></button>`).join('')
    : '<p>Eşleşen aktif site bulunamadı.</p>';
}

function dkdV326MountCompactSiteSearch() {
  if (!dkdV326IsNewPassPage()) return;
  const dkdSelect = dkdV326FindSiteSelect();
  if (!dkdSelect?.parentElement) return;
  const dkdHost = dkdSelect.parentElement;
  dkdHost.classList.add('dkd-v326-site-host');
  dkdSelect.classList.add('dkd-v326-native-site');
  dkdSelect.setAttribute('aria-hidden', 'true');

  for (const dkdLegacy of dkdHost.querySelectorAll('.dkd-v23-site-search,.dkd-v324-site-search')) {
    if (dkdLegacy.classList.contains('dkd-v326-site-search')) continue;
    dkdLegacy.classList.add('dkd-v326-legacy-site-search');
    dkdLegacy.hidden = true;
    dkdLegacy.setAttribute('aria-hidden', 'true');
  }

  let dkdWidget = dkdHost.querySelector(':scope > .dkd-v326-site-search');
  if (!dkdWidget) {
    dkdWidget = document.createElement('div');
    dkdWidget.className = 'dkd-v326-site-search';
    dkdWidget.innerHTML = `${dkdV326Icon('site')}<input type="search" autocomplete="off" inputmode="search" placeholder="Site adı veya şehir yazarak ara" aria-label="Site ara"><button class="dkd-v326-site-clear" type="button" aria-label="Site aramasını temizle" hidden>×</button><div class="dkd-v326-site-results" hidden></div>`;
    dkdHost.insertBefore(dkdWidget, dkdSelect);

    const dkdInput = dkdWidget.querySelector('input');
    const dkdResults = dkdWidget.querySelector('.dkd-v326-site-results');
    const dkdClear = dkdWidget.querySelector('.dkd-v326-site-clear');

    dkdInput?.addEventListener('input', () => {
      if (dkdSelect.value) dkdV326SetSelectValue(dkdSelect, '', false);
      dkdV326RenderSiteResults(dkdWidget, dkdSelect);
    });
    dkdInput?.addEventListener('focus', () => dkdV326RenderSiteResults(dkdWidget, dkdSelect));
    dkdResults?.addEventListener('pointerdown', (dkdEvent) => dkdEvent.preventDefault());
    dkdResults?.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target.closest('[data-dkd-v326-site-value]');
      if (!dkdButton) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV326SiteValue || '');
      const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdValue);
      if (!dkdOption) return;
      dkdV326SetSelectValue(dkdSelect, dkdValue, true);
      if (dkdInput) dkdInput.value = String(dkdOption.textContent || '').trim();
      if (dkdClear) dkdClear.hidden = false;
      dkdResults.hidden = true;
    });
    dkdClear?.addEventListener('click', () => {
      dkdV326SetSelectValue(dkdSelect, '', false);
      if (dkdInput) {
        dkdInput.value = '';
        dkdInput.focus();
      }
      dkdClear.hidden = true;
      if (dkdResults) {
        dkdResults.hidden = true;
        dkdResults.innerHTML = '';
      }
    });
  }

  const dkdSelected = [...dkdSelect.options].find((dkdOption) => dkdOption.value === dkdSelect.value);
  const dkdInput = dkdWidget.querySelector('input');
  if (dkdSelected?.value && dkdInput && document.activeElement !== dkdInput && !dkdInput.value) {
    dkdInput.value = String(dkdSelected.textContent || '').trim();
    const dkdClear = dkdWidget.querySelector('.dkd-v326-site-clear');
    if (dkdClear) dkdClear.hidden = false;
  }
}

function dkdV326FinderControl(dkdTarget) {
  const dkdElement = dkdTarget instanceof Element ? dkdTarget : dkdTarget?.parentElement;
  const dkdControl = dkdElement?.closest?.('button,a,[role="button"]');
  if (!dkdControl) return null;
  const dkdText = dkdV326Normalize([
    dkdControl.textContent,
    dkdControl.getAttribute('aria-label'),
    dkdControl.getAttribute('title'),
  ].join(' '));
  return dkdText.includes('kuryeni bul ve eslestir') ? dkdControl : null;
}

function dkdV326CodeInput(dkdControl) {
  const dkdFinder = dkdControl?.closest('.dkd-v31-finder,.dkd-v324-finder') || document;
  return dkdFinder.querySelector('#dkd-v31-code,input[inputmode="numeric"],input[autocomplete="one-time-code"],input[type="text"]') || document.querySelector('#dkd-v31-code');
}

function dkdV326EnsurePassModal() {
  let dkdModal = document.querySelector('#dkd-v326-pass-modal');
  if (!dkdModal) {
    dkdModal = document.createElement('div');
    dkdModal.id = 'dkd-v326-pass-modal';
    dkdModal.className = 'dkd-v326-modal';
    dkdModal.hidden = true;
    dkdModal.addEventListener('click', (dkdEvent) => {
      if (dkdEvent.target.closest('[data-dkd-v326-close]')) dkdV326ClosePassModal();
    });
    document.body.appendChild(dkdModal);
  }
  return dkdModal;
}

function dkdV326ClosePassModal() {
  const dkdModal = document.querySelector('#dkd-v326-pass-modal');
  if (!dkdModal) return;
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  document.body.classList.remove('dkd-v326-modal-open');
}

function dkdV326OpenPassShell(dkdCode) {
  const dkdModal = dkdV326EnsurePassModal();
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v326-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v326-backdrop" data-dkd-v326-close></div><section class="dkd-v326-pass-panel" role="dialog" aria-modal="true" aria-label="Kurye geçiş detayları"><header class="dkd-v326-pass-head"><div><span>6 HANELİ KOD · ${dkdV326Escape(dkdCode)}</span><h2>Kurye aranıyor</h2><p>Canlı geçiş kaydı ve teslimat bilgileri doğrulanıyor.</p></div><button type="button" data-dkd-v326-close aria-label="Kapat">${dkdV326Icon('close')}</button></header><div class="dkd-v326-loading"><i></i><strong>Kurye bilgileri hazırlanıyor…</strong></div></section>`;
  return dkdModal;
}

function dkdV326PassField(dkdLabel, dkdValue, dkdWide = false) {
  const dkdText = String(dkdValue ?? '').trim();
  return `<article class="dkd-v326-pass-field${dkdWide ? ' wide' : ''}"><span>${dkdV326Escape(dkdLabel)}</span><strong>${dkdV326Escape(dkdText || '—')}</strong></article>`;
}

function dkdV326RenderPass(dkdModal, dkdPass, dkdCode) {
  const dkdDistanceValue = Number(dkdPass.distance_m ?? dkdPass.last_distance_m);
  const dkdDistance = Number.isFinite(dkdDistanceValue)
    ? (dkdDistanceValue >= 1000 ? `${(dkdDistanceValue / 1000).toFixed(1)} km` : `${Math.round(dkdDistanceValue)} m`)
    : '—';
  const dkdEta = Number(dkdPass.eta_minutes) > 0 ? `${Number(dkdPass.eta_minutes)} dakika` : '—';
  const dkdDestination = dkdPass.destination_full || [
    dkdPass.address_text,
    dkdPass.block,
    dkdPass.floor ? `Kat ${dkdPass.floor}` : '',
    dkdPass.apartment ? `Daire ${dkdPass.apartment}` : '',
    dkdPass.gate,
    dkdPass.site_name,
    dkdPass.site_address,
  ].filter(Boolean).join(' · ');
  const dkdPanel = dkdModal.querySelector('section');
  dkdPanel.innerHTML = `<header class="dkd-v326-pass-head"><div><span>KURYE GEÇİŞ DETAYLARI · ${dkdV326Escape(dkdCode)}</span><h2>${dkdV326Escape(dkdPass.courier_name || 'Kurye')}</h2><p>Kapı eşleştirmesinden önce tüm bilgileri kontrol edin.</p></div><button type="button" data-dkd-v326-close aria-label="Kapat">${dkdV326Icon('close')}</button></header><div class="dkd-v326-pass-summary"><article><span>TESLİMAT NOKTASI</span><strong>${dkdV326Escape(dkdPass.site_name || '—')}</strong></article><article><span>DURUM</span><strong>${dkdV326Escape(dkdPass.status || 'Aktif')}</strong></article></div><div class="dkd-v326-pass-grid">${dkdV326PassField('Kurye', dkdPass.courier_name)}${dkdV326PassField('Telefon', dkdPass.courier_phone)}${dkdV326PassField('Plaka', dkdPass.courier_plate)}${dkdV326PassField('Platform', dkdPass.platform)}${dkdV326PassField('Sipariş', dkdPass.order_number)}${dkdV326PassField('Gönderici', dkdPass.origin_name)}${dkdV326PassField('Gönderici Adresi', dkdPass.origin_address, true)}${dkdV326PassField('Gönderici Yetkilisi', [dkdPass.origin_contact_name, dkdPass.origin_contact_phone].filter(Boolean).join(' · '))}${dkdV326PassField('Müşteri', dkdPass.customer_name)}${dkdV326PassField('Site / Kapı', [dkdPass.site_name, dkdPass.gate].filter(Boolean).join(' · '))}${dkdV326PassField('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '))}${dkdV326PassField('Mesafe', dkdDistance)}${dkdV326PassField('Tahmini Varış', dkdEta)}${dkdV326PassField('Tam Adres', dkdDestination, true)}${dkdV326PassField('Teslimat Notu', dkdPass.note, true)}</div><footer class="dkd-v326-pass-actions"><button type="button" data-dkd-v326-close>Vazgeç</button><button type="button" class="primary" data-dkd-v326-approve>${dkdV326Icon('check')} Eşleştirmeyi Tamamla</button></footer>`;
  dkdPanel.querySelector('[data-dkd-v326-approve]')?.addEventListener('click', async (dkdEvent) => {
    const dkdButton = dkdEvent.currentTarget;
    dkdButton.disabled = true;
    dkdButton.textContent = 'Eşleştiriliyor…';
    try {
      const dkdResult = await window.dkdV31Data.approvePass(dkdCode);
      dkdPanel.innerHTML = `<div class="dkd-v326-success">${dkdV326Icon('check')}<h2>Eşleştirme tamamlandı</h2><p>${dkdV326Escape(dkdResult?.courier_name || dkdPass.courier_name)} için kurye geçişi başarıyla tamamlandı.</p><button type="button" data-dkd-v326-close>Tamam</button></div>`;
      const dkdInput = document.querySelector('#dkd-v31-code');
      if (dkdInput) dkdInput.value = '';
      await window.dkdV31Data.loadQueue?.().catch(() => undefined);
    } catch (dkdError) {
      dkdButton.disabled = false;
      dkdButton.textContent = 'Tekrar Dene';
      alert(window.dkdV31Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
    }
  });
}

async function dkdV326FindAndOpenPass(dkdControl) {
  if (dkdV326State.finderBusy) return;
  const dkdInput = dkdV326CodeInput(dkdControl);
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCode.length !== 6) {
    dkdInput?.focus();
    dkdInput?.setCustomValidity?.('6 haneli kurye kodunu girin.');
    dkdInput?.reportValidity?.();
    setTimeout(() => dkdInput?.setCustomValidity?.(''), 1200);
    return;
  }
  if (!window.dkdV31Data?.findPass) {
    alert('Kurye doğrulama bağlantısı henüz hazır değil. Lütfen bir kez daha dokunun.');
    return;
  }
  dkdV326State.finderBusy = true;
  const dkdModal = dkdV326OpenPassShell(dkdCode);
  try {
    const dkdPass = await window.dkdV31Data.findPass(dkdCode);
    if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
    dkdV326RenderPass(dkdModal, dkdPass, dkdCode);
  } catch (dkdError) {
    const dkdPanel = dkdModal.querySelector('section');
    dkdPanel.innerHTML = `<div class="dkd-v326-error"><h2>Kurye bulunamadı</h2><p>${dkdV326Escape(window.dkdV31Data?.readableError?.(dkdError) || dkdError?.message || dkdError)}</p><button type="button" data-dkd-v326-close>Kapat</button></div>`;
  } finally {
    dkdV326State.finderBusy = false;
  }
}

function dkdV326InterceptFinder(dkdEvent, dkdAllowRecent = false) {
  const dkdControl = dkdV326FinderControl(dkdEvent.target);
  if (!dkdControl) return false;
  if (dkdEvent.cancelable) dkdEvent.preventDefault();
  dkdEvent.stopPropagation();
  dkdEvent.stopImmediatePropagation();
  const dkdNow = performance.now();
  if (!dkdAllowRecent && dkdNow - dkdV326State.lastFinderTriggerAt < 900) return true;
  dkdV326State.lastFinderTriggerAt = dkdNow;
  void dkdV326FindAndOpenPass(dkdControl);
  return true;
}

function dkdV326BindFinderEvents() {
  if (document.documentElement.dataset.dkdV326FinderEvents === 'true') return;
  document.documentElement.dataset.dkdV326FinderEvents = 'true';
  window.addEventListener('pointerup', (dkdEvent) => dkdV326InterceptFinder(dkdEvent, false), true);
  window.addEventListener('click', (dkdEvent) => dkdV326InterceptFinder(dkdEvent, false), true);
  window.addEventListener('keydown', (dkdEvent) => {
    if (!['Enter', ' '].includes(dkdEvent.key)) return;
    const dkdControl = dkdV326FinderControl(dkdEvent.target);
    if (!dkdControl) return;
    if (dkdEvent.cancelable) dkdEvent.preventDefault();
    dkdEvent.stopPropagation();
    dkdEvent.stopImmediatePropagation();
    dkdV326State.lastFinderTriggerAt = performance.now();
    void dkdV326FindAndOpenPass(dkdControl);
  }, true);
}

function dkdV326Patch() {
  document.body?.classList.add('dkd-v326-active');
  dkdV326RemoveLegacyEarnings();
  dkdV326MountCompactSiteSearch();
}

function dkdV326SchedulePatch() {
  clearTimeout(dkdV326State.patchTimer);
  dkdV326State.patchTimer = setTimeout(dkdV326Patch, 70);
}

async function dkdV326Boot() {
  dkdV326BindFinderEvents();
  dkdV326Patch();
  await new Promise((dkdResolve) => requestAnimationFrame(() => requestAnimationFrame(dkdResolve)));
  dkdV326Patch();
  document.documentElement.dataset.dkdV326Ready = 'true';
  document.documentElement.classList.remove('dkd-v326-simple-preboot');
  dkdV326State.observer = new MutationObserver(dkdV326SchedulePatch);
  dkdV326State.observer.observe(document.body, { childList: true, subtree: true });
  sessionStorage.setItem('dkd_gate_web_version', DKD_V326_VERSION);
}

window.__DKD_GATE_V326__ = {
  version: DKD_V326_VERSION,
  state: dkdV326State,
  patch: dkdV326Patch,
  openPass: dkdV326FindAndOpenPass,
};

await dkdV326Boot();
