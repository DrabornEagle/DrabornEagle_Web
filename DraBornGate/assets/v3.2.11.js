const DKD_V3211_VERSION = '3.2.11';
const dkdV3211Data = window.dkdV31Data;
const dkdV3211State = {
  context: null,
  contextPromise: null,
  earningsBusy: false,
  securityBusy: false,
  activePass: null,
  activeCode: '',
  patchQueued: false,
};

function dkdV3211Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3211Escape(dkdValue) {
  return String(dkdValue ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV3211Icon(dkdName) {
  const dkdIcons = {
    wallet: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7.5A3.5 3.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h14M15 12h5v4h-5a2 2 0 1 1 0-4Z" stroke="currentColor" stroke-width="1.8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.9"/><path d="M18.2 9A7 7 0 0 0 6.1 6.1L4 8m2 7a7 7 0 0 0 11.9 2.9L20 16" stroke="currentColor" stroke-width="1.9"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="16" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 13 9-9m-3 3 3 3m-6 0 3 3" stroke="currentColor" stroke-width="1.8"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h3l1.2 4-2 1.4a15 15 0 0 0 6.4 6.4l1.4-2 4 1.2v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="1.7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.1 7-12A7 7 0 0 0 5 9c0 6.9 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2"/></svg>',
    reject: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2"/></svg>',
    order: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4" stroke="currentColor" stroke-width="1.8"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" stroke="currentColor" stroke-width="1.8"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV3211Money(dkdValue, dkdCurrency = 'TRY') {
  const dkdAmount = Number(dkdValue || 0);
  try {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: dkdCurrency || 'TRY', maximumFractionDigits: 2 }).format(dkdAmount);
  } catch {
    return `${dkdAmount.toLocaleString('tr-TR')} ${dkdCurrency || 'TL'}`;
  }
}

function dkdV3211Date(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime()) ? String(dkdValue) : dkdDate.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
}

function dkdV3211Readable(dkdError) {
  return dkdV3211Data?.readableError?.(dkdError) || dkdError?.message || String(dkdError || 'İşlem tamamlanamadı.');
}

function dkdV3211Toast(dkdTitle, dkdBody = '', dkdTone = 'info') {
  let dkdToast = document.querySelector('#dkd-v3211-toast');
  if (!dkdToast) {
    dkdToast = document.createElement('div');
    dkdToast.id = 'dkd-v3211-toast';
    document.body.appendChild(dkdToast);
  }
  dkdToast.className = `dkd-v3211-toast ${dkdTone}`;
  dkdToast.innerHTML = `<span>${dkdTone === 'success' ? dkdV3211Icon('check') : dkdTone === 'error' ? dkdV3211Icon('reject') : dkdV3211Icon('key')}</span><div><strong>${dkdV3211Escape(dkdTitle)}</strong><p>${dkdV3211Escape(dkdBody)}</p></div>`;
  requestAnimationFrame(() => dkdToast.classList.add('show'));
  clearTimeout(dkdToast.dkdTimer);
  dkdToast.dkdTimer = setTimeout(() => dkdToast.classList.remove('show'), 4200);
}

async function dkdV3211Context(dkdForce = false) {
  if (!dkdForce && dkdV3211State.context) return dkdV3211State.context;
  if (!dkdForce && dkdV3211State.contextPromise) return dkdV3211State.contextPromise;
  if (!dkdV3211Data?.rpc) return null;
  dkdV3211State.contextPromise = dkdV3211Data.rpc('dkd_gate_current_user_context_v325', {})
    .then((dkdContext) => {
      dkdV3211State.context = dkdContext || null;
      return dkdV3211State.context;
    })
    .catch(() => null)
    .finally(() => {
      dkdV3211State.contextPromise = null;
    });
  return dkdV3211State.contextPromise;
}

function dkdV3211EarningsElements() {
  return [...new Set([...document.querySelectorAll('button,a,[role="button"],li')]
    .filter((dkdElement) => dkdV3211Normalize(dkdElement.textContent) === 'kazanclarim'))];
}

function dkdV3211RemoveLegacyEarnings() {
  for (const dkdItem of dkdV3211EarningsElements()) {
    if (!dkdItem.classList.contains('dkd-v3211-earnings-menu')) dkdItem.remove();
  }
  for (const dkdOld of document.querySelectorAll('.dkd-v328-earnings-menu,.dkd-v325-earnings-menu,[data-dkd-earnings-menu]:not(.dkd-v3211-earnings-menu)')) dkdOld.remove();
}

function dkdV3211FindMenuAnchor() {
  const dkdCandidates = [...document.querySelectorAll('button,a,[role="button"],li')];
  return dkdCandidates.find((dkdItem) => dkdV3211Normalize(dkdItem.textContent) === 'profil ve baglanti') || null;
}

async function dkdV3211EnsureEarningsMenu() {
  dkdV3211RemoveLegacyEarnings();
  const dkdContext = await dkdV3211Context();
  const dkdAllowed = Boolean(
    dkdContext
    && !dkdContext.is_admin
    && dkdContext.partner_visible
    && dkdV3211Normalize(dkdContext.preferred_role).includes('kurye')
  );
  const dkdExisting = document.querySelector('.dkd-v3211-earnings-menu');
  if (!dkdAllowed) {
    dkdExisting?.remove();
    return;
  }
  const dkdAnchor = dkdV3211FindMenuAnchor();
  if (!dkdAnchor) return;
  if (dkdExisting?.isConnected) {
    if (dkdExisting.previousElementSibling !== dkdAnchor) dkdAnchor.insertAdjacentElement('afterend', dkdExisting);
    return;
  }
  const dkdButton = document.createElement('button');
  dkdButton.type = 'button';
  dkdButton.className = 'dkd-v3211-earnings-menu';
  dkdButton.dataset.dkdV3211Earnings = 'true';
  dkdButton.innerHTML = `<span>${dkdV3211Icon('wallet')}</span><div><strong>Kazançlarım</strong><small>Site kurye partneri gelirleri</small></div><i>Görüntüle</i>`;
  dkdAnchor.insertAdjacentElement('afterend', dkdButton);
}

function dkdV3211EarningsRoot() {
  let dkdRoot = document.querySelector('#dkd-v3211-earnings');
  if (!dkdRoot) {
    dkdRoot = document.createElement('div');
    dkdRoot.id = 'dkd-v3211-earnings';
    dkdRoot.hidden = true;
    document.body.appendChild(dkdRoot);
  }
  return dkdRoot;
}

function dkdV3211CloseEarnings() {
  const dkdRoot = dkdV3211EarningsRoot();
  dkdRoot.hidden = true;
  dkdRoot.innerHTML = '';
  document.body.classList.remove('dkd-v3211-earnings-open');
}

function dkdV3211EarningStatus(dkdStatus) {
  const dkdValue = dkdV3211Normalize(dkdStatus);
  if (dkdValue.includes('cancel')) return ['İptal', 'cancelled'];
  if (dkdValue.includes('pending') || dkdValue.includes('wait')) return ['Bekliyor', 'pending'];
  return ['Kazandı', 'earned'];
}

function dkdV3211RenderEarnings(dkdSummary, dkdRows) {
  const dkdRoot = dkdV3211EarningsRoot();
  const dkdSites = Array.isArray(dkdSummary?.sites) ? dkdSummary.sites : [];
  const dkdCurrency = dkdSites[0]?.currency || dkdRows?.[0]?.currency || 'TRY';
  dkdRoot.innerHTML = `<div class="dkd-v3211-earnings-backdrop" data-dkd-v3211-close-earnings></div>
    <section class="dkd-v3211-earnings-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v3211-earnings-title">
      <header>
        <div class="dkd-v3211-earnings-title"><span>${dkdV3211Icon('wallet')}</span><div><small>DraBornGate Kurye Partneri</small><h2 id="dkd-v3211-earnings-title">Kazançlarım</h2><p>Yalnızca bağlı olduğunuz sitelerde tamamlanan kurye geçişlerinden oluşur.</p></div></div>
        <div class="dkd-v3211-earnings-actions"><button type="button" data-dkd-v3211-refresh-earnings aria-label="Yenile">${dkdV3211Icon('refresh')}</button><button type="button" data-dkd-v3211-close-earnings aria-label="Kapat">${dkdV3211Icon('close')}</button></div>
      </header>
      <main>
        <div class="dkd-v3211-summary-grid">
          <article class="total"><small>TOPLAM KAZANÇ</small><strong>${dkdV3211Money(dkdSummary?.total_amount, dkdCurrency)}</strong><span>Tüm zamanlar</span></article>
          <article class="today"><small>BUGÜN</small><strong>${dkdV3211Money(dkdSummary?.today_amount, dkdCurrency)}</strong><span>Günlük kazanç</span></article>
          <article class="month"><small>BU AY</small><strong>${dkdV3211Money(dkdSummary?.month_amount, dkdCurrency)}</strong><span>Aylık toplam</span></article>
          <article class="passes"><small>TAMAMLANAN GEÇİŞ</small><strong>${Number(dkdSummary?.pass_count || 0).toLocaleString('tr-TR')}</strong><span>Gelir oluşturan işlem</span></article>
        </div>
        <section class="dkd-v3211-linked-sites"><div><small>AKTİF BAĞLANTILAR</small><h3>Bağlı Siteler</h3></div><div>${dkdSites.length ? dkdSites.map((dkdSite) => `<article><span>${dkdV3211Icon('building')}</span><div><strong>${dkdV3211Escape(dkdSite.site_name)}</strong><small>Her tamamlanan kurye: ${dkdV3211Money(dkdSite.amount_per_courier, dkdSite.currency || dkdCurrency)}</small></div></article>`).join('') : '<p>Aktif site bağlantısı bulunamadı.</p>'}</div></section>
        <section class="dkd-v3211-earnings-table"><div class="dkd-v3211-table-head"><div><small>SON İŞLEMLER</small><h3>Kazanç Hareketleri</h3></div><span>${dkdRows.length} kayıt</span></div>
          <div class="dkd-v3211-table-body">${dkdRows.length ? dkdRows.map((dkdRow) => {
            const [dkdLabel, dkdClass] = dkdV3211EarningStatus(dkdRow.status);
            return `<article><span class="dkd-v3211-row-icon">${dkdV3211Icon('order')}</span><div class="dkd-v3211-row-main"><strong>${dkdV3211Escape(dkdRow.site_name || 'Site')}</strong><small>${dkdV3211Escape([dkdRow.courier_name, dkdRow.platform].filter(Boolean).join(' · ') || 'Kurye geçişi')}</small><p>${dkdV3211Escape(dkdRow.order_number || 'Sipariş numarası yok')} · ${dkdV3211Escape(dkdV3211Date(dkdRow.earned_at))}</p></div><div class="dkd-v3211-row-amount"><strong>${dkdV3211Money(dkdRow.amount, dkdRow.currency || dkdCurrency)}</strong><span class="${dkdClass}">${dkdLabel}</span></div></article>`;
          }).join('') : '<div class="dkd-v3211-empty"><span>'+dkdV3211Icon('wallet')+'</span><strong>Henüz kazanç hareketi yok</strong><p>Bağlı sitenizde kurye geçişi tamamlandığında burada görünecek.</p></div>'}</div>
        </section>
      </main>
    </section>`;
}

async function dkdV3211OpenEarnings() {
  const dkdContext = await dkdV3211Context(true);
  if (!dkdContext || dkdContext.is_admin || !dkdContext.partner_visible || !dkdV3211Normalize(dkdContext.preferred_role).includes('kurye')) {
    dkdV3211Toast('Kazançlarım kullanılamıyor', 'Bu bölüm yalnızca aktif bir siteye bağlanmış Kurye kullanıcısına açıktır.', 'error');
    return;
  }
  if (dkdV3211State.earningsBusy) return;
  dkdV3211State.earningsBusy = true;
  const dkdRoot = dkdV3211EarningsRoot();
  dkdRoot.hidden = false;
  document.body.classList.add('dkd-v3211-earnings-open');
  dkdRoot.innerHTML = `<div class="dkd-v3211-earnings-backdrop"></div><div class="dkd-v3211-loading"><i></i><strong>v3.2.11 Kazançlarım hazırlanıyor</strong><span>Güncel gelirler ve site bağlantıları alınıyor…</span></div>`;
  try {
    const [dkdSummary, dkdRows] = await Promise.all([
      dkdV3211Data.loadPartnerSummary(),
      dkdV3211Data.loadPartnerRows(100, 0),
    ]);
    dkdV3211RenderEarnings(dkdSummary || {}, Array.isArray(dkdRows) ? dkdRows : []);
  } catch (dkdError) {
    dkdRoot.innerHTML = `<div class="dkd-v3211-earnings-backdrop" data-dkd-v3211-close-earnings></div><div class="dkd-v3211-loading error"><span>${dkdV3211Icon('reject')}</span><strong>Kazançlarım açılamadı</strong><p>${dkdV3211Escape(dkdV3211Readable(dkdError))}</p><div><button type="button" data-dkd-v3211-close-earnings>Kapat</button><button type="button" data-dkd-v3211-refresh-earnings>Tekrar Dene</button></div></div>`;
  } finally {
    dkdV3211State.earningsBusy = false;
  }
}

function dkdV3211SecurityRoot() {
  let dkdRoot = document.querySelector('#dkd-v3211-security-modal');
  if (!dkdRoot) {
    dkdRoot = document.createElement('div');
    dkdRoot.id = 'dkd-v3211-security-modal';
    dkdRoot.hidden = true;
    document.body.appendChild(dkdRoot);
  }
  return dkdRoot;
}

function dkdV3211CloseSecurity() {
  const dkdRoot = dkdV3211SecurityRoot();
  dkdRoot.hidden = true;
  dkdRoot.innerHTML = '';
  document.body.classList.remove('dkd-v3211-security-open');
  dkdV3211State.activePass = null;
  dkdV3211State.activeCode = '';
}

function dkdV3211Status(dkdStatus) {
  const dkdValue = dkdV3211Normalize(dkdStatus);
  if (dkdValue.includes('arrived')) return ['Kapıda', 'arrived'];
  if (dkdValue.includes('approved')) return ['Onaylandı', 'approved'];
  if (dkdValue.includes('waiting')) return ['Bekliyor', 'waiting'];
  if (dkdValue.includes('rejected')) return ['Reddedildi', 'rejected'];
  return [dkdStatus || 'Aktif', 'active'];
}

function dkdV3211Detail(dkdLabel, dkdValue, dkdIcon = 'user', dkdWide = false) {
  return `<article class="dkd-v3211-security-detail ${dkdWide ? 'wide' : ''}"><span>${dkdV3211Icon(dkdIcon)}</span><div><small>${dkdV3211Escape(dkdLabel)}</small><strong>${dkdV3211Escape(dkdValue || '—')}</strong></div></article>`;
}

function dkdV3211OpenSecurity(dkdPass, dkdCode = '', dkdSource = 'queue') {
  const dkdRoot = dkdV3211SecurityRoot();
  const [dkdStatusLabel, dkdStatusClass] = dkdV3211Status(dkdPass?.status);
  const dkdCleanCode = String(dkdCode || dkdPass?.approval_code || '').replace(/\D/g, '').slice(0, 6);
  const dkdDestination = dkdPass?.destination_full || dkdPass?.address_text || [dkdPass?.site_name, dkdPass?.gate, dkdPass?.block, dkdPass?.floor, dkdPass?.apartment].filter(Boolean).join(' · ') || '—';
  const dkdOrigin = [dkdPass?.origin_name, dkdPass?.origin_address].filter(Boolean).join(' · ') || '—';
  dkdV3211State.activePass = dkdPass;
  dkdV3211State.activeCode = dkdCleanCode;
  dkdRoot.hidden = false;
  document.body.classList.add('dkd-v3211-security-open');
  dkdRoot.innerHTML = `<div class="dkd-v3211-security-backdrop" data-dkd-v3211-close-security></div>
    <section class="dkd-v3211-security-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v3211-security-title">
      <header><div><small>GÜVENLİK DOĞRULAMA MERKEZİ · WEB v3.2.11</small><h2 id="dkd-v3211-security-title">Kurye ve Teslimat Bilgileri</h2><p>Onay vermeden önce kurye kimliğini, siparişi ve gideceği adresi kontrol edin.</p></div><button type="button" data-dkd-v3211-close-security aria-label="Kapat">${dkdV3211Icon('close')}</button></header>
      <main>
        <div class="dkd-v3211-security-hero"><span>${dkdV3211Icon('user')}</span><div><small>KURYE</small><h3>${dkdV3211Escape(dkdPass?.courier_name || 'Kurye')}</h3><p>${dkdV3211Escape([dkdPass?.platform, dkdPass?.courier_plate].filter(Boolean).join(' · ') || 'Bilgi paylaşılmadı')}</p></div><i class="${dkdStatusClass}">${dkdV3211Escape(dkdStatusLabel)}</i></div>
        <div class="dkd-v3211-security-route"><article><span>${dkdV3211Icon('route')}</span><div><small>NEREDEN GELİYOR</small><strong>${dkdV3211Escape(dkdOrigin)}</strong></div></article><b></b><article><span>${dkdV3211Icon('pin')}</span><div><small>GİDECEĞİ TAM ADRES</small><strong>${dkdV3211Escape(dkdDestination)}</strong></div></article></div>
        <div class="dkd-v3211-security-sections">
          <section><div class="dkd-v3211-section-title"><span>1</span><div><small>KİMLİK KONTROLÜ</small><h3>Kurye Bilgileri</h3></div></div><div class="dkd-v3211-security-grid">${dkdV3211Detail('Kurye Adı Soyadı', dkdPass?.courier_name, 'user')}${dkdV3211Detail('Kurye Telefonu', dkdPass?.courier_phone, 'phone')}${dkdV3211Detail('Platform', dkdPass?.platform, 'route')}${dkdV3211Detail('Plaka', dkdPass?.courier_plate, 'route')}</div></section>
          <section><div class="dkd-v3211-section-title"><span>2</span><div><small>TESLİMAT KONTROLÜ</small><h3>Sipariş ve Müşteri</h3></div></div><div class="dkd-v3211-security-grid">${dkdV3211Detail('Müşteri Adı Soyadı', dkdPass?.customer_name, 'user')}${dkdV3211Detail('Sipariş Numarası', dkdPass?.order_number, 'order')}${dkdV3211Detail('Site / Kapı', [dkdPass?.site_name, dkdPass?.gate].filter(Boolean).join(' · '), 'building')}${dkdV3211Detail('Blok / Kat / Daire', [dkdPass?.block, dkdPass?.floor, dkdPass?.apartment].filter(Boolean).join(' / '), 'pin')}${dkdV3211Detail('Mesafe / Tahmini Varış', `${dkdPass?.distance_m ?? '—'} m · ${dkdPass?.eta_minutes ?? '—'} dk`, 'route')}${dkdV3211Detail('Oluşturulma', dkdV3211Date(dkdPass?.arrived_at || dkdPass?.created_at), 'clock')}${dkdV3211Detail('Teslimat Notu', dkdPass?.note, 'order', true)}</div></section>
        </div>
        ${dkdCleanCode ? `<div class="dkd-v3211-security-code"><div><small>6 HANELİ TEK KULLANIMLIK KOD</small><strong>${dkdV3211Escape(dkdCleanCode)}</strong></div>${dkdV3211Icon('key')}</div>` : ''}
        <div id="dkd-v3211-security-error" class="dkd-v3211-security-error" hidden></div>
      </main>
      <footer><button type="button" class="secondary" data-dkd-v3211-close-security>Kapat</button><button type="button" class="reject" data-dkd-v3211-reject>${dkdV3211Icon('reject')}<span>Geçişi Reddet</span></button><button type="button" class="approve" data-dkd-v3211-approve data-dkd-source="${dkdV3211Escape(dkdSource)}">${dkdV3211Icon('check')}<span>${dkdCleanCode ? 'Kodu Doğrula ve Giriş Ver' : 'Kuryeyi Onayla'}</span></button></footer>
    </section>`;
}

function dkdV3211SecurityError(dkdText) {
  const dkdBox = document.querySelector('#dkd-v3211-security-error');
  if (!dkdBox) return;
  dkdBox.hidden = false;
  dkdBox.textContent = dkdText;
}

async function dkdV3211LoadQueue() {
  const dkdRows = await dkdV3211Data.loadQueue();
  return Array.isArray(dkdRows) ? dkdRows : [];
}

function dkdV3211CodeNear(dkdElement) {
  let dkdScope = dkdElement;
  for (let dkdDepth = 0; dkdScope && dkdDepth < 8; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
    const dkdInput = dkdScope.querySelector?.('input[inputmode="numeric"],input[type="tel"],input[maxlength="6"]');
    const dkdFromInput = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
    if (dkdFromInput.length === 6) return dkdFromInput;
    const dkdMatches = String(dkdScope.textContent || '').match(/(?:^|\D)(\d(?:\s*\d){5})(?:\D|$)/g) || [];
    for (const dkdMatch of dkdMatches) {
      const dkdCode = dkdMatch.replace(/\D/g, '').slice(0, 6);
      if (dkdCode.length === 6 && dkdCode !== '000000') return dkdCode;
    }
  }
  return '';
}

async function dkdV3211PassNear(dkdElement) {
  const dkdRows = await dkdV3211LoadQueue();
  let dkdScope = dkdElement;
  for (let dkdDepth = 0; dkdScope && dkdDepth < 9; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
    const dkdText = dkdV3211Normalize(dkdScope.textContent);
    if (dkdText.length < 8) continue;
    const dkdByOrder = dkdRows.find((dkdRow) => dkdRow.order_number && dkdText.includes(dkdV3211Normalize(dkdRow.order_number)));
    if (dkdByOrder) return dkdByOrder;
    const dkdByIdentity = dkdRows.find((dkdRow) => {
      const dkdCourier = dkdV3211Normalize(dkdRow.courier_name);
      const dkdPlate = dkdV3211Normalize(dkdRow.courier_plate);
      return dkdCourier && dkdText.includes(dkdCourier) && (!dkdPlate || dkdText.includes(dkdPlate));
    });
    if (dkdByIdentity) return dkdByIdentity;
  }
  return null;
}

async function dkdV3211FindByCode(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6 || dkdCleanCode === '000000') {
    dkdV3211Toast('6 haneli kod gerekli', 'Kurye tarafından gösterilen tek kullanımlık kodu eksiksiz girin.', 'error');
    return;
  }
  if (dkdV3211State.securityBusy) return;
  dkdV3211State.securityBusy = true;
  dkdV3211Toast('Kurye aranıyor', 'Kod güvenli geçiş sisteminde kontrol ediliyor.', 'info');
  try {
    const dkdPass = await dkdV3211Data.findPass(dkdCleanCode);
    dkdV3211OpenSecurity(dkdPass, dkdCleanCode, 'code');
  } catch (dkdError) {
    dkdV3211Toast('Kurye bulunamadı', dkdV3211Readable(dkdError), 'error');
  } finally {
    dkdV3211State.securityBusy = false;
  }
}

async function dkdV3211UpdatePass(dkdPass, dkdStatus, dkdReason = '', dkdCode = '') {
  if (!dkdPass?.pass_id) throw new Error('Kurye geçiş kaydı bulunamadı.');
  return dkdV3211Data.rpc('dkd_gate_update_courier_pass_status_v2', {
    p_pass_id: dkdPass.pass_id,
    p_status: dkdStatus,
    p_rejection_reason: dkdReason || null,
    p_code: dkdCode || null,
  });
}

async function dkdV3211ApproveActive() {
  const dkdButton = document.querySelector('[data-dkd-v3211-approve]');
  const dkdPass = dkdV3211State.activePass;
  const dkdCode = dkdV3211State.activeCode;
  if (!dkdPass || dkdV3211State.securityBusy) return;
  dkdV3211State.securityBusy = true;
  if (dkdButton) {
    dkdButton.disabled = true;
    dkdButton.querySelector('span').textContent = 'İşlem yapılıyor…';
  }
  try {
    if (dkdCode.length === 6) await dkdV3211Data.approvePass(dkdCode);
    else await dkdV3211UpdatePass(dkdPass, 'approved');
    dkdV3211CloseSecurity();
    dkdV3211Toast(dkdCode.length === 6 ? 'Giriş başarıyla verildi' : 'Kurye geçişi onaylandı', `${dkdPass.courier_name || 'Kurye'} için işlem tamamlandı.`, 'success');
    setTimeout(() => location.reload(), 850);
  } catch (dkdError) {
    dkdV3211SecurityError(dkdV3211Readable(dkdError));
    if (dkdButton) {
      dkdButton.disabled = false;
      dkdButton.querySelector('span').textContent = dkdCode.length === 6 ? 'Kodu Doğrula ve Giriş Ver' : 'Kuryeyi Onayla';
    }
  } finally {
    dkdV3211State.securityBusy = false;
  }
}

function dkdV3211OpenReject(dkdPass = dkdV3211State.activePass) {
  if (!dkdPass) return;
  dkdV3211State.activePass = dkdPass;
  const dkdRoot = dkdV3211SecurityRoot();
  dkdRoot.hidden = false;
  document.body.classList.add('dkd-v3211-security-open');
  dkdRoot.innerHTML = `<div class="dkd-v3211-security-backdrop" data-dkd-v3211-close-security></div><section class="dkd-v3211-reject-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v3211-reject-title"><header><div><small>GÜVENLİK KARARI</small><h2 id="dkd-v3211-reject-title">Kurye Geçişini Reddet</h2><p>Kurye reddetme sebebini kendi ekranında görecek.</p></div><button type="button" data-dkd-v3211-close-security>${dkdV3211Icon('close')}</button></header><main><div class="dkd-v3211-reject-person"><span>${dkdV3211Icon('user')}</span><div><strong>${dkdV3211Escape(dkdPass.courier_name || 'Kurye')}</strong><small>${dkdV3211Escape([dkdPass.platform, dkdPass.courier_plate, dkdPass.order_number].filter(Boolean).join(' · '))}</small></div></div><label for="dkd-v3211-reason">Reddetme Sebebi</label><textarea id="dkd-v3211-reason" maxlength="300" placeholder="Örneğin: Sipariş bilgileri site kaydıyla eşleşmiyor."></textarea><div id="dkd-v3211-security-error" class="dkd-v3211-security-error" hidden></div></main><footer><button type="button" class="secondary" data-dkd-v3211-close-security>Vazgeç</button><button type="button" class="reject" data-dkd-v3211-confirm-reject>${dkdV3211Icon('reject')}<span>Geçişi Reddet</span></button></footer></section>`;
  requestAnimationFrame(() => document.querySelector('#dkd-v3211-reason')?.focus({ preventScroll: true }));
}

async function dkdV3211ConfirmReject() {
  const dkdPass = dkdV3211State.activePass;
  const dkdReason = String(document.querySelector('#dkd-v3211-reason')?.value || '').trim();
  const dkdButton = document.querySelector('[data-dkd-v3211-confirm-reject]');
  if (!dkdReason) {
    dkdV3211SecurityError('Reddetme sebebi boş bırakılamaz.');
    return;
  }
  if (!dkdPass || dkdV3211State.securityBusy) return;
  dkdV3211State.securityBusy = true;
  if (dkdButton) {
    dkdButton.disabled = true;
    dkdButton.querySelector('span').textContent = 'Reddediliyor…';
  }
  try {
    await dkdV3211UpdatePass(dkdPass, 'rejected', dkdReason);
    dkdV3211CloseSecurity();
    dkdV3211Toast('Kurye geçişi reddedildi', dkdReason, 'success');
    setTimeout(() => location.reload(), 850);
  } catch (dkdError) {
    dkdV3211SecurityError(dkdV3211Readable(dkdError));
    if (dkdButton) {
      dkdButton.disabled = false;
      dkdButton.querySelector('span').textContent = 'Geçişi Reddet';
    }
  } finally {
    dkdV3211State.securityBusy = false;
  }
}

function dkdV3211IsLegacyAction(dkdTarget, dkdNames) {
  const dkdButton = dkdTarget.closest('button,a,[role="button"]');
  if (!dkdButton || dkdButton.closest('#dkd-v3211-security-modal,#dkd-v3211-earnings')) return null;
  const dkdText = dkdV3211Normalize(dkdButton.textContent);
  return dkdNames.some((dkdName) => dkdText === dkdName || dkdText.includes(dkdName)) ? dkdButton : null;
}

async function dkdV3211HandleLegacyClick(dkdEvent) {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget) return;

  if (dkdTarget.closest('[data-dkd-v3211-earnings]')) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    void dkdV3211OpenEarnings();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v3211-close-earnings]')) {
    dkdV3211CloseEarnings();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v3211-refresh-earnings]')) {
    void dkdV3211OpenEarnings();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v3211-close-security]')) {
    dkdV3211CloseSecurity();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v3211-approve]')) {
    void dkdV3211ApproveActive();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v3211-reject]')) {
    dkdV3211OpenReject();
    return;
  }
  if (dkdTarget.closest('[data-dkd-v3211-confirm-reject]')) {
    void dkdV3211ConfirmReject();
    return;
  }

  const dkdEarnings = dkdV3211IsLegacyAction(dkdTarget, ['kazanclarim']);
  if (dkdEarnings) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    dkdEarnings.remove();
    void dkdV3211OpenEarnings();
    return;
  }

  const dkdFind = dkdV3211IsLegacyAction(dkdTarget, ['kuryeni bul', 'kodu dogrula']);
  if (dkdFind) {
    const dkdCode = dkdV3211CodeNear(dkdFind);
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    void dkdV3211FindByCode(dkdCode);
    return;
  }

  const dkdApprove = dkdV3211IsLegacyAction(dkdTarget, ['onayla']);
  if (dkdApprove) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    try {
      const dkdPass = await dkdV3211PassNear(dkdApprove);
      if (!dkdPass) throw new Error('Onaylanacak kurye geçişi bulunamadı.');
      dkdV3211OpenSecurity(dkdPass, '', 'queue');
    } catch (dkdError) {
      dkdV3211Toast('Kurye bilgisi açılamadı', dkdV3211Readable(dkdError), 'error');
    }
    return;
  }

  const dkdReject = dkdV3211IsLegacyAction(dkdTarget, ['reddet']);
  if (dkdReject) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    try {
      const dkdPass = await dkdV3211PassNear(dkdReject);
      if (!dkdPass) throw new Error('Reddedilecek kurye geçişi bulunamadı.');
      dkdV3211OpenReject(dkdPass);
    } catch (dkdError) {
      dkdV3211Toast('Kurye bilgisi açılamadı', dkdV3211Readable(dkdError), 'error');
    }
  }
}

function dkdV3211HandleLegacySubmit(dkdEvent) {
  const dkdForm = dkdEvent.target instanceof HTMLFormElement ? dkdEvent.target : null;
  if (!dkdForm || dkdForm.closest('#dkd-v3211-security-modal,#dkd-v3211-earnings')) return;
  const dkdText = dkdV3211Normalize(dkdForm.textContent);
  if (!dkdText.includes('kuryeni bul') && !dkdText.includes('kodu dogrula')) return;
  const dkdCode = dkdV3211CodeNear(dkdForm);
  dkdEvent.preventDefault();
  dkdEvent.stopImmediatePropagation();
  void dkdV3211FindByCode(dkdCode);
}

function dkdV3211Patch() {
  dkdV3211RemoveLegacyEarnings();
  void dkdV3211EnsureEarningsMenu();
  document.documentElement.dataset.dkdGateVersion = DKD_V3211_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3211_VERSION);
}

function dkdV3211QueuePatch() {
  if (dkdV3211State.patchQueued) return;
  dkdV3211State.patchQueued = true;
  requestAnimationFrame(() => {
    dkdV3211State.patchQueued = false;
    dkdV3211Patch();
  });
}

document.addEventListener('click', (dkdEvent) => void dkdV3211HandleLegacyClick(dkdEvent), true);
document.addEventListener('submit', dkdV3211HandleLegacySubmit, true);
document.addEventListener('keydown', (dkdEvent) => {
  if (dkdEvent.key !== 'Escape') return;
  if (!dkdV3211SecurityRoot().hidden) dkdV3211CloseSecurity();
  else if (!dkdV3211EarningsRoot().hidden) dkdV3211CloseEarnings();
});

new MutationObserver(dkdV3211QueuePatch).observe(document.body, { childList: true, subtree: true });
setInterval(dkdV3211Patch, 1800);
if (!dkdV3211Data) throw new Error('DraBornGate v3.2.11 veri katmanı başlatılamadı.');
dkdV3211Patch();
