const DKD_V329_VERSION = '3.2.9';
const dkdV329Data = window.dkdV31Data;

const dkdV329State = {
  patchQueued: false,
  siteValue: '',
  siteLabel: '',
  siteQuery: '',
  siteSelect: null,
  clearedSelects: new WeakSet(),
  earningsRows: [],
  modalMode: '',
};

function dkdV329Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV329Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV329Icon(dkdName) {
  const dkdIcons = {
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h16m-5 5h5" stroke="currentColor" stroke-width="1.8"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" stroke="currentColor" stroke-width="1.8"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV329Visible(dkdElement) {
  if (!dkdElement) return false;
  const dkdStyle = getComputedStyle(dkdElement);
  const dkdRect = dkdElement.getBoundingClientRect();
  return dkdStyle.display !== 'none' && dkdStyle.visibility !== 'hidden' && dkdRect.width > 1 && dkdRect.height > 1;
}

function dkdV329CurrentRole() {
  return window.dkdV325Session?.currentRole?.()
    || window.dkdV324Session?.currentRole?.()
    || dkdV329Data?.state?.role
    || '';
}

function dkdV329IsCourierArea() {
  const dkdRole = dkdV329Normalize(dkdV329CurrentRole());
  if (dkdRole === 'courier' || dkdRole === 'kurye') return true;
  const dkdText = dkdV329Normalize(document.body?.innerText || '');
  return dkdText.includes('kurye operasyonu')
    || dkdText.includes('yeni kurye gecisi')
    || (dkdText.includes('gecislerim') && dkdText.includes('hareket'));
}

function dkdV329IsNewPassPage() {
  const dkdText = dkdV329Normalize(document.body?.innerText || '');
  return (dkdText.includes('yeni kurye gecisi') || dkdText.includes('yeni gecis talebi'))
    && dkdText.includes('musteri adi')
    && dkdText.includes('siparis numarasi');
}

function dkdV329FindExact(dkdText, dkdRoot = document) {
  const dkdWanted = dkdV329Normalize(dkdText);
  return [...dkdRoot.querySelectorAll('button,a,[role="button"],label,h1,h2,h3,h4,strong,b,span,p,small')]
    .find((dkdElement) => dkdV329Visible(dkdElement) && dkdV329Normalize(dkdElement.textContent) === dkdWanted);
}

function dkdV329FindSelectByLabel(dkdLabelText) {
  const dkdTarget = dkdV329Normalize(dkdLabelText);
  const dkdLabels = [...document.querySelectorAll('label,span,strong,p,div')]
    .filter((dkdElement) => dkdV329Visible(dkdElement) && dkdV329Normalize(dkdElement.textContent) === dkdTarget);
  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
      const dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) return dkdSelect;
    }
  }
  return null;
}

function dkdV329PatchCourierHeader() {
  if (!dkdV329IsCourierArea()) return;
  const dkdCandidates = [...document.querySelectorAll('header h1,header h2,header h3,header strong,header span,[class*="header"] h1,[class*="header"] h2,[class*="header"] h3,[class*="header"] strong,[class*="topbar"] strong,[class*="top-bar"] strong')];
  for (const dkdCandidate of dkdCandidates) {
    if (!dkdV329Visible(dkdCandidate)) continue;
    const dkdRect = dkdCandidate.getBoundingClientRect();
    if (dkdRect.top < 0 || dkdRect.top > 240 || dkdRect.width < 80) continue;
    const dkdText = dkdV329Normalize(dkdCandidate.textContent);
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
    dkdCandidate.dataset.dkdV329CourierTitle = 'true';
    break;
  }
}

function dkdV329SetSelectValue(dkdSelect, dkdValue, dkdNotify = true) {
  if (!(dkdSelect instanceof HTMLSelectElement)) return;
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  for (const dkdOption of dkdSelect.options) dkdOption.selected = dkdOption.value === dkdValue;
  if (!dkdNotify) return;
  dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
  dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV329SiteOptions(dkdSelect) {
  return [...dkdSelect.options]
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
    .map((dkdOption) => ({ value: dkdOption.value, label: String(dkdOption.textContent || '').trim() }));
}

function dkdV329RenderSiteResults(dkdHost, dkdSelect) {
  const dkdInput = dkdHost.querySelector('.dkd-v329-site-input');
  const dkdResults = dkdHost.querySelector('.dkd-v329-site-results');
  if (!dkdInput || !dkdResults) return;
  const dkdQuery = dkdV329Normalize(dkdInput.value);
  dkdV329State.siteQuery = dkdInput.value;
  if (dkdQuery.length < 2) {
    dkdResults.hidden = true;
    dkdResults.innerHTML = '';
    return;
  }
  const dkdRows = dkdV329SiteOptions(dkdSelect)
    .filter((dkdOption) => dkdV329Normalize(dkdOption.label).includes(dkdQuery))
    .slice(0, 20);
  dkdResults.hidden = false;
  dkdResults.innerHTML = dkdRows.length
    ? dkdRows.map((dkdOption) => `<button type="button" data-dkd-v329-site-value="${encodeURIComponent(dkdOption.value)}"><span>${dkdV329Escape(dkdOption.label)}</span><b>SEÇ</b></button>`).join('')
    : '<div class="dkd-v329-site-empty">Eşleşen aktif site bulunamadı.</div>';
}

function dkdV329RenderSiteHost(dkdHost, dkdSelect) {
  const dkdInput = dkdHost.querySelector('.dkd-v329-site-input');
  const dkdSelected = dkdHost.querySelector('.dkd-v329-site-selected');
  const dkdClear = dkdHost.querySelector('.dkd-v329-site-clear');
  const dkdResults = dkdHost.querySelector('.dkd-v329-site-results');
  const dkdHasSelection = Boolean(dkdV329State.siteValue && dkdV329State.siteLabel);
  dkdHost.classList.toggle('is-selected', dkdHasSelection);
  dkdInput.hidden = dkdHasSelection;
  dkdSelected.hidden = !dkdHasSelection;
  dkdClear.hidden = !dkdHasSelection;
  if (dkdHasSelection) {
    dkdSelected.innerHTML = `${dkdV329Icon('building')}<strong>${dkdV329Escape(dkdV329State.siteLabel)}</strong>`;
    dkdResults.hidden = true;
  } else {
    dkdInput.value = dkdV329State.siteQuery;
  }
  dkdV329State.siteSelect = dkdSelect;
}

function dkdV329BindSiteHost(dkdHost, dkdSelect) {
  if (dkdHost.dataset.dkdV329Bound === 'true') return;
  dkdHost.dataset.dkdV329Bound = 'true';
  const dkdInput = dkdHost.querySelector('.dkd-v329-site-input');
  const dkdResults = dkdHost.querySelector('.dkd-v329-site-results');
  const dkdClear = dkdHost.querySelector('.dkd-v329-site-clear');

  dkdInput.addEventListener('input', () => dkdV329RenderSiteResults(dkdHost, dkdSelect));
  dkdInput.addEventListener('focus', () => dkdV329RenderSiteResults(dkdHost, dkdSelect));
  dkdResults.addEventListener('click', (dkdEvent) => {
    const dkdButton = dkdEvent.target.closest('[data-dkd-v329-site-value]');
    if (!dkdButton) return;
    const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV329SiteValue || '');
    const dkdOption = dkdV329SiteOptions(dkdSelect).find((dkdRow) => dkdRow.value === dkdValue);
    if (!dkdOption) return;
    dkdV329State.siteValue = dkdOption.value;
    dkdV329State.siteLabel = dkdOption.label;
    dkdV329State.siteQuery = '';
    dkdV329SetSelectValue(dkdSelect, dkdOption.value, true);
    dkdV329RenderSiteHost(dkdHost, dkdSelect);
  });
  dkdClear.addEventListener('click', () => {
    dkdV329State.siteValue = '';
    dkdV329State.siteLabel = '';
    dkdV329State.siteQuery = '';
    dkdV329SetSelectValue(dkdSelect, '', true);
    dkdV329RenderSiteHost(dkdHost, dkdSelect);
    requestAnimationFrame(() => dkdInput.focus({ preventScroll: true }));
  });
}

function dkdV329MountSiteSearch() {
  if (!dkdV329IsNewPassPage()) return;
  const dkdSelect = dkdV329FindSelectByLabel('Site');
  if (!dkdSelect) return;

  for (const dkdLegacy of document.querySelectorAll('.dkd-v21-site-search,.dkd-v23-site-search,.dkd-v324-site-search,.dkd-v327-site-compact,.dkd-v328-site-host')) {
    if (!dkdLegacy.closest('.dkd-v329-site-host')) dkdLegacy.remove();
  }

  dkdSelect.classList.add('dkd-v329-native-site');
  const dkdNativeOption = [...dkdSelect.options].find((dkdOption) => dkdOption.value === dkdSelect.value);
  if (dkdV329State.siteValue) {
    const dkdSavedOption = [...dkdSelect.options].find((dkdOption) => dkdOption.value === dkdV329State.siteValue);
    if (dkdSavedOption && dkdSelect.value !== dkdV329State.siteValue) dkdV329SetSelectValue(dkdSelect, dkdV329State.siteValue, false);
  } else if (dkdSelect.value && dkdNativeOption) {
    if (!dkdV329State.clearedSelects.has(dkdSelect)) {
      dkdV329State.clearedSelects.add(dkdSelect);
      dkdV329SetSelectValue(dkdSelect, '', true);
    }
  }

  let dkdHost = dkdSelect.parentElement?.querySelector(':scope > .dkd-v329-site-host');
  if (!dkdHost) {
    dkdHost = document.createElement('div');
    dkdHost.className = 'dkd-v329-site-host';
    dkdHost.innerHTML = `<div class="dkd-v329-site-window"><span>${dkdV329Icon('building')}</span><input class="dkd-v329-site-input" type="search" autocomplete="off" inputmode="search" placeholder="Site adı veya şehir yazarak ara" aria-label="Site ara"><div class="dkd-v329-site-selected" hidden></div><button type="button" class="dkd-v329-site-clear" aria-label="Site seçimini temizle" hidden>${dkdV329Icon('close')}</button></div><div class="dkd-v329-site-results" hidden></div>`;
    dkdSelect.parentElement?.insertBefore(dkdHost, dkdSelect);
  }
  dkdV329BindSiteHost(dkdHost, dkdSelect);
  dkdV329RenderSiteHost(dkdHost, dkdSelect);
}

function dkdV329FormatMoney(dkdValue) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(Number(dkdValue || 0));
}

function dkdV329FormatDate(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime())
    ? String(dkdValue)
    : dkdDate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
}

function dkdV329Modal() {
  let dkdModal = document.querySelector('#dkd-v329-modern-modal');
  if (!dkdModal) {
    dkdModal = document.createElement('div');
    dkdModal.id = 'dkd-v329-modern-modal';
    dkdModal.className = 'dkd-v329-modern-modal';
    dkdModal.hidden = true;
    document.body.appendChild(dkdModal);
  }
  return dkdModal;
}

function dkdV329CloseModal() {
  const dkdModal = dkdV329Modal();
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  dkdV329State.modalMode = '';
  document.body.classList.remove('dkd-v329-modal-open');
}

function dkdV329BindModalClose() {
  for (const dkdClose of document.querySelectorAll('[data-dkd-v329-modern-close]')) {
    dkdClose.addEventListener('click', dkdV329CloseModal);
  }
}

function dkdV329RenderEarnings(dkdSummary) {
  const dkdModal = dkdV329Modal();
  if (dkdV329State.modalMode !== 'earnings') return;
  const dkdSites = Array.isArray(dkdSummary?.sites) ? dkdSummary.sites : [];
  const dkdRows = dkdV329State.earningsRows;
  dkdModal.innerHTML = `<div class="dkd-v329-modern-backdrop" data-dkd-v329-modern-close></div><section class="dkd-v329-modern-panel" role="dialog" aria-modal="true"><header><div><span>SİTE ORTAKLIK KAZANCI</span><h2>Kazançlarım</h2><p>Tamamlanan gerçek kurye geçişlerinden oluşan kazançlarınız.</p></div><button type="button" class="dkd-v329-modern-close" data-dkd-v329-modern-close>${dkdV329Icon('close')}</button></header><main><div class="dkd-v329-finance-stats"><div><small>Toplam Kazanç</small><strong>${dkdV329FormatMoney(dkdSummary?.total_amount)}</strong></div><div><small>Bu Ay</small><strong>${dkdV329FormatMoney(dkdSummary?.month_amount)}</strong></div><div><small>Bugün</small><strong>${dkdV329FormatMoney(dkdSummary?.today_amount)}</strong></div><div><small>Kurye Geçişi</small><strong>${Number(dkdSummary?.pass_count || 0)}</strong></div></div><section class="dkd-v329-linked-sites"><h3>Bağlı Siteler</h3>${dkdSites.length ? dkdSites.map((dkdSite) => `<div><strong>${dkdV329Escape(dkdSite.site_name)}</strong><span>Kurye başına ${dkdV329FormatMoney(dkdSite.amount_per_courier)}</span></div>`).join('') : '<p>Aktif site bağlantısı yok.</p>'}</section><section class="dkd-v329-earnings-table"><h3>Kazanç Hareketleri</h3><div class="dkd-v329-table-scroll"><table><thead><tr><th>Tarih</th><th>Site</th><th>Kurye</th><th>Sipariş</th><th>Kazanç</th></tr></thead><tbody>${dkdRows.length ? dkdRows.map((dkdRow) => `<tr><td>${dkdV329FormatDate(dkdRow.earned_at)}</td><td>${dkdV329Escape(dkdRow.site_name)}</td><td>${dkdV329Escape(dkdRow.courier_name)}<small>${dkdV329Escape(dkdRow.platform)}</small></td><td>${dkdV329Escape(dkdRow.order_number)}</td><td><b>${dkdV329FormatMoney(dkdRow.amount)}</b></td></tr>`).join('') : '<tr><td colspan="5">Henüz kazanç hareketi oluşmadı.</td></tr>'}</tbody></table></div><button type="button" id="dkd-v329-earnings-more">10 Kayıt Daha</button></section></main></section>`;
  dkdV329BindModalClose();
  document.querySelector('#dkd-v329-earnings-more')?.addEventListener('click', async () => {
    const dkdButton = document.querySelector('#dkd-v329-earnings-more');
    dkdButton.disabled = true;
    const dkdNewRows = await dkdV329Data.loadPartnerRows(10, dkdV329State.earningsRows.length).catch(() => []);
    if (!dkdNewRows.length) {
      dkdButton.textContent = 'Başka kayıt yok';
      return;
    }
    dkdV329State.earningsRows = [...dkdV329Data.state.partnerRows];
    dkdV329RenderEarnings(dkdSummary);
  });
}

async function dkdV329OpenEarnings() {
  const dkdModal = dkdV329Modal();
  dkdV329State.modalMode = 'earnings';
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v329-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v329-modern-backdrop" data-dkd-v329-modern-close></div><section class="dkd-v329-modern-panel"><div class="dkd-v329-modern-loading">Kazanç tablosu hazırlanıyor…</div></section>`;
  dkdV329BindModalClose();
  try {
    const [dkdSummary] = await Promise.all([
      dkdV329Data.loadPartnerSummary(),
      dkdV329Data.loadPartnerRows(10, 0),
    ]);
    dkdV329State.earningsRows = [...(dkdV329Data.state?.partnerRows || [])];
    dkdV329RenderEarnings(dkdSummary);
  } catch (dkdError) {
    dkdModal.querySelector('section').innerHTML = `<div class="dkd-v329-modern-error"><h2>Kazançlar açılamadı</h2><p>${dkdV329Escape(dkdV329Data?.readableError?.(dkdError) || dkdError?.message || dkdError)}</p><button type="button" data-dkd-v329-modern-close>Kapat</button></div>`;
    dkdV329BindModalClose();
  }
}

function dkdV329EnsureEarningsMenu() {
  if (!dkdV329IsCourierArea()) return;
  for (const dkdItem of document.querySelectorAll('[data-dkd-v31-menu="earnings"],[data-dkd-v328-menu="earnings"],[data-dkd-v327-menu="earnings"]')) dkdItem.remove();
  for (const dkdElement of document.querySelectorAll('button,a,[role="button"]')) {
    if (dkdElement.dataset.dkdV329Menu === 'earnings') continue;
    const dkdText = dkdV329Normalize(dkdElement.textContent);
    if (dkdText === 'kazancim' || dkdText === 'kazanclarim') dkdElement.remove();
  }
  if (document.querySelector('[data-dkd-v329-menu="earnings"]')) return;
  const dkdProfileText = dkdV329FindExact('Profil ve Bağlantı');
  const dkdProfileItem = dkdProfileText?.closest('button,a,[role="button"]') || dkdProfileText?.parentElement;
  if (!dkdProfileItem?.parentElement) return;
  const dkdButton = document.createElement('button');
  dkdButton.type = 'button';
  dkdButton.className = 'dkd-v329-menu-item';
  dkdButton.dataset.dkdV329Menu = 'earnings';
  dkdButton.innerHTML = `<span>${dkdV329Icon('wallet')}</span><strong>Kazançlarım</strong>`;
  dkdButton.addEventListener('click', () => void dkdV329OpenEarnings());
  dkdProfileItem.after(dkdButton);
}

function dkdV329PatchUi() {
  dkdV329State.patchQueued = false;
  dkdV329PatchCourierHeader();
  dkdV329MountSiteSearch();
  dkdV329EnsureEarningsMenu();
}

function dkdV329QueuePatch() {
  if (dkdV329State.patchQueued) return;
  dkdV329State.patchQueued = true;
  requestAnimationFrame(dkdV329PatchUi);
}

new MutationObserver(dkdV329QueuePatch).observe(document.body, { childList: true, subtree: true });
document.addEventListener('click', (dkdEvent) => {
  if (!dkdEvent.target.closest('.dkd-v329-site-host')) {
    const dkdResults = document.querySelector('.dkd-v329-site-results');
    if (dkdResults) dkdResults.hidden = true;
  }
});
document.addEventListener('keydown', (dkdEvent) => {
  if (dkdEvent.key === 'Escape' && !dkdV329Modal().hidden) dkdV329CloseModal();
});

dkdV329PatchUi();
document.documentElement.dataset.dkdV329Ready = 'true';
sessionStorage.setItem('dkd_gate_web_version', DKD_V329_VERSION);
window.__DKD_GATE_V329_RUNTIME__ = { version: DKD_V329_VERSION, state: dkdV329State };
