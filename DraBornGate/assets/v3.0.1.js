const dkdV301 = window.dkdV301Data;
const dkdV301State = dkdV301.state;
const DKD_V301_MOTO_TERMS = /\b(kurye|courier|motosiklet|motorcycle|motorbike|scooter|surucu|rider|teslimat)\b/;

function dkdV301Moto(dkdClass = '') {
  const dkdSource = document.querySelector('.dkd-v281-moto');
  return `<span class="dkd-v30-moto-host ${dkdClass}" aria-hidden="true">${dkdSource?.outerHTML || '<span class="dkd-v30-moto-fallback">DBG</span>'}</span>`;
}

function dkdV301Icon(dkdName) {
  const dkdIcons = {
    search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.9"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.1 7-12A7 7 0 0 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.8"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.8"/><path d="M18 12a6 6 0 0 0-10.8-3.6L4 11m16 2-3.2 2.6A6 6 0 0 1 6 12" stroke="currentColor" stroke-width="1.8"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2.8 19h18.4L12 3Z" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v4m0 3h.01" stroke="currentColor" stroke-width="2"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV301SelectedDetails() {
  return (dkdV301State.sources.find((dkdItem) => dkdItem.id === dkdV301State.selectedId) || dkdV301State.sources[0])?.details;
}

function dkdV301Finder() {
  const dkdDetails = dkdV301SelectedDetails();
  const dkdFeedback = dkdV301State.feedback;
  const dkdEscape = dkdV301.escape;
  return `<section class="dkd-v30-finder">
    <div class="dkd-v30-finder-copy">
      <span class="dkd-v30-kicker">6 HANELİ KURYE KODU</span>
      <h1>Kuryeni Bul</h1>
      <p>Kuryenin DraBornGate ekranındaki 6 haneli kodu girin. Kuyrukta kart seçmeniz gerekmez; kod doğrudan güvenli doğrulama ekranına gönderilir.</p>
      <div class="dkd-v30-selected">
        <div class="dkd-v30-selected-icon">${dkdV301Moto('compact')}</div>
        <div><span>${dkdDetails ? 'SEÇİLİ KURYE' : 'CANLI DOĞRULAMA'}</span><strong>${dkdEscape(dkdDetails?.courier || 'Kodla kurye bulmaya hazır')}</strong><small>${dkdEscape(dkdDetails ? `${dkdDetails.company} · ${dkdDetails.plate}` : '6 haneli kod aktif taleple doğrudan eşleştirilir')}</small></div>
      </div>
    </div>
    <div class="dkd-v30-code-card">
      <div class="dkd-v30-code-head"><div>${dkdV301Icon('search')}</div><span>KURYE KODUNU GİRİN</span></div>
      <input id="dkd-v30-code" type="tel" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="6 haneli kurye kodu" placeholder="• • • • • •" ${dkdV301State.busy ? 'disabled' : ''}>
      <button id="dkd-v30-submit" type="button" ${dkdV301State.busy ? 'disabled' : ''}>${dkdV301State.busy ? dkdV301Icon('sync') : dkdV301Icon('check')}<span>${dkdV301State.busy ? 'Doğrulanıyor' : 'Kuryeni Bul ve Eşleştir'}</span></button>
      ${dkdFeedback ? `<div class="dkd-v30-feedback ${dkdFeedback.type}">${dkdFeedback.type === 'success' ? dkdV301Icon('check') : dkdFeedback.type === 'loading' ? dkdV301Icon('sync') : dkdV301Icon('alert')}<span>${dkdEscape(dkdFeedback.text)}</span></div>` : ''}
      <small class="dkd-v30-code-note">Kod araması Canlı Kurye Kuyruğundan bağımsız çalışır.</small>
    </div>
  </section>`;
}

function dkdV301Detail(dkdIcon, dkdLabel, dkdValue, dkdWide = false) {
  return `<div class="dkd-v30-detail ${dkdWide ? 'wide' : ''}"><span class="dkd-v30-detail-icon">${dkdIcon}</span><div><small>${dkdV301.escape(dkdLabel)}</small><strong>${dkdV301.escape(dkdValue)}</strong></div></div>`;
}

function dkdV301Card(dkdSource, dkdIndex) {
  const dkdDetails = dkdSource.details;
  const dkdSelected = dkdSource.id === dkdV301State.selectedId;
  return `<article class="dkd-v30-queue-card ${dkdSelected ? 'selected' : ''}" data-dkd-v30-source="${dkdV301.escape(dkdSource.id)}">
    <div class="dkd-v30-card-head"><div class="dkd-v30-card-moto">${dkdV301Moto()}</div><div class="dkd-v30-card-title"><span>KURYE #${String(dkdIndex + 1).padStart(2, '0')}</span><h3>${dkdV301.escape(dkdDetails.courier)}</h3><p>${dkdV301.escape(dkdDetails.company)} · ${dkdV301.escape(dkdDetails.vehicle)}</p></div><div class="dkd-v30-status"><i></i>${dkdV301.escape(dkdDetails.status)}</div></div>
    <div class="dkd-v30-route"><div class="from"><span>${dkdV301Icon('route')}</span><div><small>NEREDEN GELİYOR</small><strong>${dkdV301.escape(dkdDetails.origin)}</strong></div></div><div class="route-line"><i></i><b></b><i></i></div><div class="to"><span>${dkdV301Icon('pin')}</span><div><small>GİDECEĞİ TAM ADRES</small><strong>${dkdV301.escape(dkdDetails.destination)}</strong></div></div></div>
    <div class="dkd-v30-details-grid">
      ${dkdV301Detail(dkdV301Icon('user'), 'Kurye Telefonu', dkdDetails.phone)}
      ${dkdV301Detail(dkdV301Moto('tiny'), 'Plaka / Araç', `${dkdDetails.plate} · ${dkdDetails.vehicle}`)}
      ${dkdV301Detail(dkdV301Icon('user'), 'Teslim Alacak Kişi', dkdDetails.resident)}
      ${dkdV301Detail(dkdV301Icon('pin'), 'Site / Blok / Daire', `${dkdDetails.site} · ${dkdDetails.block} Blok · Daire ${dkdDetails.apartment}`)}
      ${dkdV301Detail(dkdV301Icon('clock'), 'Talep / Varış', `${dkdDetails.arrival} · Mesafe ${dkdDetails.distance}`)}
      ${dkdV301Detail(dkdV301Icon('search'), 'Sipariş / Kayıt No', dkdDetails.order)}
      ${dkdV301Detail(dkdV301Icon('alert'), 'Teslimat Notu', dkdDetails.note, true)}
    </div>
    <button class="dkd-v30-select" type="button">${dkdSelected ? dkdV301Icon('check') : dkdV301Icon('search')}<span>${dkdSelected ? 'Kuryeni Bul kartında seçili' : 'Bu kuryeyi seç'}</span></button>
  </article>`;
}

function dkdV301Queue() {
  const dkdCount = dkdV301State.sources.length;
  const dkdLiveText = dkdV301State.initialized ? `${dkdCount} bekleyen` : 'Kuyruk hazırlanıyor';
  const dkdBody = dkdCount
    ? dkdV301State.sources.map(dkdV301Card).join('')
    : dkdV301State.initialized
      ? `<div class="dkd-v30-empty"><div>${dkdV301Moto()}</div><h3>Kapıda bekleyen kurye bulunmuyor</h3><p>Yeni bir kurye talebi geldiğinde çıkış noktası, hedef adresi ve tüm teslimat ayrıntıları burada görünecek.</p><span><i></i> Canlı kurye kuyruğu izleniyor</span></div>`
      : `<div class="dkd-v30-empty dkd-v301-loading"><div class="dkd-v301-dots"><i></i><i></i><i></i></div><h3>Canlı Kurye Kuyruğu açılıyor</h3><p>Modern Güvenlik panelindeki gerçek kuyruk ekranı arka planda açılıyor ve kurye kartları senkronize ediliyor.</p><span><i></i> Lütfen birkaç saniye bekleyin</span></div>`;
  return `<section class="dkd-v30-queue-section"><div class="dkd-v30-section-head"><div><span>GERÇEK ZAMANLI GÜVENLİK AKIŞI</span><h2>Canlı Kurye Kuyruğu</h2><p>Kapıda bekleyen tüm kuryeler; nereden geldiği, gideceği tam adres, telefon, firma, plaka, alıcı ve teslimat notuyla gösterilir.</p></div><div class="dkd-v30-live"><i></i><strong>${dkdLiveText}</strong><small id="dkd-v30-sync-time">${dkdV301State.lastSync.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small></div></div><div class="dkd-v30-queue-list">${dkdBody}</div></section>`;
}

function dkdV301Mount() {
  if (!dkdV301.isSimple() || document.querySelector('#dkd-v30-root')) return;
  const dkdMain = document.querySelector('#dkd-v28-root .dkd-v28-main');
  if (!dkdMain) return;
  const dkdRoot = document.createElement('div');
  dkdRoot.id = 'dkd-v30-root';
  dkdMain.appendChild(dkdRoot);
  document.body.classList.add('dkd-v30-simple-active');
  dkdV301Render();
}

function dkdV301Bind() {
  const dkdCode = document.querySelector('#dkd-v30-code');
  dkdCode?.addEventListener('input', () => {
    dkdCode.value = dkdCode.value.replace(/\D/g, '').slice(0, 6);
    dkdCode.classList.toggle('ready', dkdCode.value.length === 6);
  });
  dkdCode?.addEventListener('keydown', (dkdEvent) => {
    if (dkdEvent.key === 'Enter') dkdV301.submit(dkdV301RenderFinder, dkdV301Refresh);
  });
  document.querySelector('#dkd-v30-submit')?.addEventListener('click', () => dkdV301.submit(dkdV301RenderFinder, dkdV301Refresh));
  for (const dkdCard of document.querySelectorAll('[data-dkd-v30-source]')) {
    dkdCard.querySelector('.dkd-v30-select')?.addEventListener('click', () => {
      dkdV301State.selectedId = dkdCard.dataset.dkdV30Source || '';
      dkdV301State.feedback = null;
      dkdV301Render();
      document.querySelector('#dkd-v30-code')?.focus();
    });
  }
}

function dkdV301RenderFinder() {
  const dkdFinder = document.querySelector('#dkd-v30-root .dkd-v30-finder');
  if (!dkdFinder) return dkdV301Render();
  const dkdWrapper = document.createElement('div');
  dkdWrapper.innerHTML = dkdV301Finder();
  dkdFinder.replaceWith(dkdWrapper.firstElementChild);
  dkdV301Bind();
}

function dkdV301Render() {
  const dkdRoot = document.querySelector('#dkd-v30-root');
  if (!dkdRoot) return;
  dkdRoot.innerHTML = dkdV301Finder() + dkdV301Queue();
  dkdV301Bind();
  dkdV301PatchAllMotorcycleIcons(document);
}

function dkdV301Commit(dkdSources, dkdSignature) {
  dkdV301State.sources = dkdSources;
  dkdV301State.signature = dkdSignature;
  dkdV301State.initialized = true;
  dkdV301State.lastSync = new Date();
  if (!dkdSources.some((dkdSource) => dkdSource.id === dkdV301State.selectedId)) dkdV301State.selectedId = dkdSources[0]?.id || '';
  dkdV301Render();
}

async function dkdV301Refresh() {
  dkdV301Mount();
  dkdV301PatchAllMotorcycleIcons(document);
  if (!dkdV301.isSimple() || !document.querySelector('#dkd-v30-root') || dkdV301State.refreshing || dkdV301State.busy) return;
  dkdV301State.refreshing = true;
  try {
    dkdV301.clickNativeView('queue');
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 240));
    const dkdSources = dkdV301.scanQueue();
    const dkdSignature = JSON.stringify(dkdSources.map((dkdSource) => [dkdSource.fingerprint, dkdSource.details]));
    if (dkdSignature === dkdV301State.candidateSignature) dkdV301State.candidateHits += 1;
    else {
      dkdV301State.candidateSignature = dkdSignature;
      dkdV301State.candidateHits = 1;
    }

    if (dkdSources.length) {
      dkdV301State.emptyHits = 0;
      if (dkdV301State.candidateHits >= 2 && dkdSignature !== dkdV301State.signature) dkdV301Commit(dkdSources, dkdSignature);
    } else {
      dkdV301State.emptyHits += 1;
      if (!dkdV301State.initialized && dkdV301State.emptyHits >= 3) dkdV301Commit([], '[]');
      else if (dkdV301State.initialized && dkdV301State.emptyHits >= 6 && dkdV301State.sources.length) dkdV301Commit([], '[]');
    }

    dkdV301State.lastSync = new Date();
    const dkdClock = document.querySelector('#dkd-v30-sync-time');
    if (dkdClock) dkdClock.textContent = dkdV301State.lastSync.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } finally {
    dkdV301State.refreshing = false;
  }
}

function dkdV301ReplaceIcon(dkdTarget) {
  if (!dkdTarget || dkdTarget.dataset?.dkdV30Motorcycle === 'true' || dkdTarget.closest('.dkd-v30-moto-host,.dkd-v281-moto')) return;
  dkdTarget.innerHTML = dkdV301Moto();
  dkdTarget.dataset.dkdV30Motorcycle = 'true';
  dkdTarget.classList.add('dkd-v30-global-motorcycle');
}

function dkdV301PatchAllMotorcycleIcons(dkdRoot = document) {
  const dkdSelectors = ['.dkd-v28-request-icon', '.dkd-v28-stats .icon.cyan', '[class*="courier-icon"]', '[class*="kurye-icon"]', '[class*="motorcycle-icon"]', '[class*="motosiklet-icon"]', '[data-icon*="courier"]', '[data-icon*="kurye"]', '[data-icon*="motorcycle"]', '[data-icon*="motosiklet"]'];
  for (const dkdTarget of dkdRoot.querySelectorAll?.(dkdSelectors.join(',')) || []) dkdV301ReplaceIcon(dkdTarget);
  for (const dkdImage of dkdRoot.querySelectorAll?.('img') || []) {
    if (!DKD_V301_MOTO_TERMS.test(dkdV301.normalize([dkdImage.alt, dkdImage.title, dkdImage.src].join(' ')))) continue;
    const dkdReplacement = document.createElement('span');
    dkdReplacement.className = 'dkd-v30-image-motorcycle dkd-v30-global-motorcycle';
    dkdReplacement.dataset.dkdV30Motorcycle = 'true';
    dkdReplacement.innerHTML = dkdV301Moto();
    dkdImage.replaceWith(dkdReplacement);
  }
}

dkdV301Mount();
dkdV301Refresh();
setInterval(dkdV301Refresh, 1100);
new MutationObserver(() => {
  dkdV301Mount();
  dkdV301PatchAllMotorcycleIcons(document);
}).observe(document.body, { childList: true, subtree: true });
