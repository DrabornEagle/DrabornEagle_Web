const DKD_V325_FEATURE_VERSION = '3.2.5';
const dkdV325Data = window.dkdV31Data;
const dkdV325State = {
  context: null,
  patchTimer: 0,
  finderBusy: false,
  earningsBusy: false,
  adminBusy: false,
  observer: null,
};

function dkdV325Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9@._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV325Escape(dkdValue) {
  return String(dkdValue ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV325Money(dkdValue, dkdCurrency = 'TRY') {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: dkdCurrency || 'TRY',
    maximumFractionDigits: 2,
  }).format(Number(dkdValue || 0));
}

function dkdV325Date(dkdValue) {
  if (!dkdValue) return '—';
  const dkdDate = new Date(dkdValue);
  return Number.isNaN(dkdDate.getTime()) ? '—' : dkdDate.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
}

function dkdV325ExactText(dkdText, dkdRoot = document) {
  const dkdWanted = dkdV325Normalize(dkdText);
  return [...dkdRoot.querySelectorAll('h1,h2,h3,h4,strong,b,span,p,button,a,label,[role="button"]')]
    .find((dkdElement) => dkdV325Normalize(dkdElement.textContent) === dkdWanted);
}

function dkdV325MenuControl(dkdText) {
  const dkdNode = dkdV325ExactText(dkdText);
  return dkdNode?.closest('button,a,[role="button"]') || null;
}

function dkdV325Icon(dkdName) {
  const dkdIcons = {
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    earnings: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18V9m5 9V5m5 13v-6m5 6V3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    admin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"/></svg>',
    courier: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16h2l2-6h7l2 6h2M8 10 6.5 7H4M15 10h3l2 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdV325EnsureModal(dkdId) {
  let dkdModal = document.querySelector(`#${dkdId}`);
  if (!dkdModal) {
    dkdModal = document.createElement('div');
    dkdModal.id = dkdId;
    dkdModal.className = 'dkd-v325-modal';
    dkdModal.hidden = true;
    document.body.appendChild(dkdModal);
  }
  return dkdModal;
}

function dkdV325CloseModal(dkdId) {
  const dkdModal = document.querySelector(`#${dkdId}`);
  if (!dkdModal) return;
  dkdModal.hidden = true;
  dkdModal.innerHTML = '';
  document.body.classList.remove('dkd-v325-modal-open');
}

function dkdV325BindClose(dkdModal, dkdId) {
  for (const dkdButton of dkdModal.querySelectorAll('[data-dkd-v325-close]')) {
    dkdButton.addEventListener('click', () => dkdV325CloseModal(dkdId));
  }
}

function dkdV325OpenShell(dkdId, dkdClassName, dkdTitle, dkdSubtitle) {
  const dkdModal = dkdV325EnsureModal(dkdId);
  dkdModal.hidden = false;
  document.body.classList.add('dkd-v325-modal-open');
  dkdModal.innerHTML = `<div class="dkd-v325-backdrop" data-dkd-v325-close></div>
    <section class="dkd-v325-panel ${dkdClassName}" role="dialog" aria-modal="true" aria-label="${dkdV325Escape(dkdTitle)}">
      <header class="dkd-v325-panel-head"><div><span>DRABORNGATE WEB v${DKD_V325_FEATURE_VERSION}</span><h2>${dkdV325Escape(dkdTitle)}</h2><p>${dkdV325Escape(dkdSubtitle)}</p></div><button type="button" data-dkd-v325-close aria-label="Kapat">${dkdV325Icon('close')}</button></header>
      <div class="dkd-v325-loading"><i></i><strong>Bilgiler hazırlanıyor…</strong></div>
    </section>`;
  dkdV325BindClose(dkdModal, dkdId);
  return dkdModal;
}

async function dkdV325LoadContext() {
  if (dkdV325State.context) return dkdV325State.context;
  const dkdContext = await dkdV325Data?.rpc?.('dkd_gate_current_user_context_v325', {});
  dkdV325State.context = dkdContext && typeof dkdContext === 'object' ? dkdContext : null;
  return dkdV325State.context;
}

function dkdV325PatchVersionText(dkdRoot = document.body) {
  if (!dkdRoot) return;
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
  for (const dkdNode of dkdNodes) {
    if (/^(SCRIPT|STYLE|NOSCRIPT)$/i.test(dkdNode.parentElement?.tagName || '')) continue;
    const dkdCurrent = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdCurrent.replace(/(?:DraBornGate\s+Web\s+)?v3\.2\.4\b/gi, (dkdMatch) =>
      /draborngate/i.test(dkdMatch) ? `DraBornGate Web v${DKD_V325_FEATURE_VERSION}` : `v${DKD_V325_FEATURE_VERSION}`
    );
    if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
  }
}

function dkdV325PatchNewPassPage() {
  const dkdBodyText = dkdV325Normalize(document.body?.innerText || '');
  const dkdIsNewPass = (dkdBodyText.includes('yeni kurye gecisi') || dkdBodyText.includes('yeni gecis talebi')) && dkdBodyText.includes('site');
  document.body.classList.toggle('dkd-v325-new-pass-stable', dkdIsNewPass);
}

function dkdV325EnsureEarningsMenu() {
  const dkdContext = dkdV325State.context;
  if (!dkdContext?.partner_visible) {
    document.querySelector('[data-dkd-v325-earnings-menu]')?.remove();
    return;
  }
  if (document.querySelector('[data-dkd-v325-earnings-menu]')) return;
  const dkdProfile = dkdV325MenuControl('Profil ve Bağlantı');
  if (!dkdProfile?.parentElement) return;
  const dkdButton = document.createElement('button');
  dkdButton.type = 'button';
  dkdButton.className = 'dkd-v31-menu-item dkd-v325-earnings-menu';
  dkdButton.dataset.dkdV325EarningsMenu = 'true';
  dkdButton.innerHTML = `<span>${dkdV325Icon('earnings')}</span><strong>Kazançlarım</strong><small>${(dkdContext.partner_sites || []).length} site bağlantısı</small>`;
  dkdButton.addEventListener('click', () => void dkdV325OpenEarnings());
  dkdProfile.after(dkdButton);
}

async function dkdV325OpenEarnings() {
  if (dkdV325State.earningsBusy) return;
  dkdV325State.earningsBusy = true;
  const dkdModal = dkdV325OpenShell('dkd-v325-earnings-modal', 'dkd-v325-earnings-panel', 'Kazançlarım', 'Bağlı sitelerden oluşan kurye geçiş kazançlarınız.');
  try {
    const [dkdSummary, dkdRows] = await Promise.all([
      dkdV325Data.loadPartnerSummary(),
      dkdV325Data.loadPartnerRows(50, 0),
    ]);
    const dkdSites = Array.isArray(dkdSummary?.sites) ? dkdSummary.sites : [];
    const dkdEarnings = Array.isArray(dkdRows) ? dkdRows : [];
    dkdModal.querySelector('section').innerHTML = `<header class="dkd-v325-panel-head"><div><span>KURYE GELİR MERKEZİ</span><h2>Kazançlarım</h2><p>Aktif site bağlantıları ve tamamlanan geçiş kazançları.</p></div><button type="button" data-dkd-v325-close aria-label="Kapat">${dkdV325Icon('close')}</button></header>
      <div class="dkd-v325-earnings-stats">
        <article><span>Toplam</span><strong>${dkdV325Money(dkdSummary?.total_amount)}</strong></article>
        <article><span>Bugün</span><strong>${dkdV325Money(dkdSummary?.today_amount)}</strong></article>
        <article><span>Bu Ay</span><strong>${dkdV325Money(dkdSummary?.month_amount)}</strong></article>
        <article><span>Geçiş</span><strong>${Number(dkdSummary?.pass_count || 0)}</strong></article>
      </div>
      <section class="dkd-v325-site-links"><div class="dkd-v325-section-title"><span>AKTİF BAĞLANTILAR</span><strong>${dkdSites.length} site</strong></div>${dkdSites.map((dkdSite) => `<article><div><strong>${dkdV325Escape(dkdSite.site_name)}</strong><span>Kurye başına ${dkdV325Money(dkdSite.amount_per_courier, dkdSite.currency)}</span></div><b>AKTİF</b></article>`).join('') || '<p>Aktif site bağlantısı bulunamadı.</p>'}</section>
      <section class="dkd-v325-earning-list"><div class="dkd-v325-section-title"><span>SON KAZANÇLAR</span><strong>${dkdEarnings.length} kayıt</strong></div>${dkdEarnings.map((dkdRow) => `<article><div><strong>${dkdV325Escape(dkdRow.site_name)}</strong><span>${dkdV325Escape(dkdRow.courier_name)} · ${dkdV325Escape(dkdRow.order_number || 'Sipariş yok')}</span><small>${dkdV325Date(dkdRow.earned_at)} · ${dkdV325Escape(dkdRow.status)}</small></div><b>${dkdV325Money(dkdRow.amount, dkdRow.currency)}</b></article>`).join('') || '<div class="dkd-v325-empty"><strong>Henüz kazanç kaydı yok</strong><span>Bağlantınız aktif. Tamamlanan uygun geçişler burada listelenecek.</span></div>'}</section>`;
    dkdV325BindClose(dkdModal, 'dkd-v325-earnings-modal');
  } catch (dkdError) {
    dkdModal.querySelector('section').innerHTML = `<div class="dkd-v325-error"><h2>Kazançlar yüklenemedi</h2><p>${dkdV325Escape(dkdV325Data?.readableError?.(dkdError) || dkdError?.message || dkdError)}</p><button type="button" data-dkd-v325-close>Kapat</button></div>`;
    dkdV325BindClose(dkdModal, 'dkd-v325-earnings-modal');
  } finally {
    dkdV325State.earningsBusy = false;
  }
}

async function dkdV325OpenAdmin() {
  if (dkdV325State.adminBusy) return;
  dkdV325State.adminBusy = true;
  const dkdModal = dkdV325OpenShell('dkd-v325-admin-modal', 'dkd-v325-admin-panel', 'Admin Paneli', 'Kullanıcı, site ve kazanç bağlantılarını tek merkezden yönetin.');
  try {
    const dkdCatalog = await dkdV325Data.loadAdminCatalog(true);
    if (!dkdCatalog) throw new Error('Admin yetkisi doğrulanamadı.');
    dkdV325RenderAdmin(dkdModal, dkdCatalog);
  } catch (dkdError) {
    dkdModal.querySelector('section').innerHTML = `<div class="dkd-v325-error"><h2>Admin Paneli açılamadı</h2><p>${dkdV325Escape(dkdV325Data?.readableError?.(dkdError) || dkdError?.message || dkdError)}</p><button type="button" data-dkd-v325-close>Kapat</button></div>`;
    dkdV325BindClose(dkdModal, 'dkd-v325-admin-modal');
  } finally {
    dkdV325State.adminBusy = false;
  }
}

function dkdV325RenderAdmin(dkdModal, dkdCatalog) {
  const dkdUsers = Array.isArray(dkdCatalog.users) ? dkdCatalog.users : [];
  const dkdSites = Array.isArray(dkdCatalog.sites) ? dkdCatalog.sites : [];
  const dkdLinks = Array.isArray(dkdCatalog.links) ? dkdCatalog.links : [];
  const dkdActive = dkdLinks.filter((dkdLink) => dkdLink.is_active);
  dkdModal.querySelector('section').innerHTML = `<header class="dkd-v325-panel-head"><div><span>RENKLİ YÖNETİM MERKEZİ</span><h2>Admin Paneli</h2><p>Kullanıcıları sitelere bağlayın ve kurye başı kazançları düzenleyin.</p></div><button type="button" data-dkd-v325-close aria-label="Kapat">${dkdV325Icon('close')}</button></header>
    <div class="dkd-v325-admin-stats"><article><i>01</i><span>Kullanıcı</span><strong>${dkdUsers.length}</strong></article><article><i>02</i><span>Site</span><strong>${dkdSites.length}</strong></article><article><i>03</i><span>Aktif Bağlantı</span><strong>${dkdActive.length}</strong></article></div>
    <section class="dkd-v325-admin-grid">
      <form id="dkd-v325-admin-form" class="dkd-v325-admin-form">
        <div class="dkd-v325-section-title"><span>YENİ BAĞLANTI</span><strong>Kullanıcı + Site</strong></div>
        <label>Kullanıcı<select id="dkd-v325-admin-user" required><option value="">Kullanıcı seçin</option>${dkdUsers.map((dkdUser) => `<option value="${dkdV325Escape(dkdUser.user_id)}">${dkdV325Escape(dkdUser.full_name || dkdUser.email)} · ${dkdV325Escape(dkdUser.email)}</option>`).join('')}</select></label>
        <label>Site<select id="dkd-v325-admin-site" required><option value="">Site seçin</option>${dkdSites.map((dkdSite) => `<option value="${dkdV325Escape(dkdSite.site_id)}">${dkdV325Escape(dkdSite.site_name)}${dkdSite.city ? ` · ${dkdV325Escape(dkdSite.city)}` : ''}</option>`).join('')}</select></label>
        <label>Kurye Başı Kazanç<input id="dkd-v325-admin-amount" type="number" min="0" step="0.01" value="10.00"></label>
        <label class="dkd-v325-toggle"><input id="dkd-v325-admin-active" type="checkbox" checked><span>Bağlantı aktif</span></label>
        <button type="submit">Bağlantıyı Kaydet</button>
      </form>
      <div class="dkd-v325-admin-links"><div class="dkd-v325-section-title"><span>SİTE BAĞLANTILARI</span><strong>${dkdLinks.length} kayıt</strong></div>${dkdLinks.map((dkdLink) => `<article><div><strong>${dkdV325Escape(dkdLink.user_name)}</strong><span>${dkdV325Escape(dkdLink.site_name)}</span><small>Kurye başına ${dkdV325Money(dkdLink.amount_per_courier, dkdLink.currency)} · ${dkdLink.is_active ? 'Aktif' : 'Pasif'}</small></div><button type="button" data-dkd-v325-toggle-link data-user="${dkdV325Escape(dkdLink.user_id)}" data-site="${dkdV325Escape(dkdLink.site_id)}" data-amount="${dkdV325Escape(dkdLink.amount_per_courier)}" data-active="${dkdLink.is_active ? 'true' : 'false'}">${dkdLink.is_active ? 'Pasifleştir' : 'Aktifleştir'}</button></article>`).join('') || '<div class="dkd-v325-empty"><strong>Bağlantı yok</strong><span>İlk kullanıcı–site bağlantısını formdan oluşturun.</span></div>'}</div>
    </section>`;
  dkdV325BindClose(dkdModal, 'dkd-v325-admin-modal');
  dkdModal.querySelector('#dkd-v325-admin-form')?.addEventListener('submit', async (dkdEvent) => {
    dkdEvent.preventDefault();
    const dkdSubmit = dkdEvent.submitter;
    if (dkdSubmit) dkdSubmit.disabled = true;
    try {
      await dkdV325Data.assignPartnerSite(
        dkdModal.querySelector('#dkd-v325-admin-user')?.value,
        dkdModal.querySelector('#dkd-v325-admin-site')?.value,
        dkdModal.querySelector('#dkd-v325-admin-amount')?.value,
        dkdModal.querySelector('#dkd-v325-admin-active')?.checked
      );
      const dkdUpdated = await dkdV325Data.loadAdminCatalog(true);
      dkdV325RenderAdmin(dkdModal, dkdUpdated);
    } catch (dkdError) {
      if (dkdSubmit) dkdSubmit.disabled = false;
      alert(dkdV325Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
    }
  });
  for (const dkdButton of dkdModal.querySelectorAll('[data-dkd-v325-toggle-link]')) {
    dkdButton.addEventListener('click', async () => {
      dkdButton.disabled = true;
      try {
        await dkdV325Data.assignPartnerSite(dkdButton.dataset.user, dkdButton.dataset.site, Number(dkdButton.dataset.amount || 10), dkdButton.dataset.active !== 'true');
        const dkdUpdated = await dkdV325Data.loadAdminCatalog(true);
        dkdV325RenderAdmin(dkdModal, dkdUpdated);
      } catch (dkdError) {
        dkdButton.disabled = false;
        alert(dkdV325Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
      }
    });
  }
}

function dkdV325PassField(dkdLabel, dkdValue, dkdWide = false) {
  return `<article${dkdWide ? ' class="wide"' : ''}><span>${dkdV325Escape(dkdLabel)}</span><strong>${dkdV325Escape(dkdValue || '—')}</strong></article>`;
}

function dkdV325RenderPassModal(dkdModal, dkdPass, dkdCode) {
  const dkdDistance = Number(dkdPass.distance_m || 0) > 0 ? `${Number(dkdPass.distance_m).toLocaleString('tr-TR')} m` : '—';
  const dkdEta = Number(dkdPass.eta_minutes || 0) > 0 ? `${Number(dkdPass.eta_minutes)} dk` : '—';
  dkdModal.querySelector('section').innerHTML = `<header class="dkd-v325-panel-head"><div><span>KOD DOĞRULANDI · ${dkdV325Escape(dkdCode)}</span><h2>Kurye geçiş detayları</h2><p>Tüm bilgileri kontrol edip eşleştirmeyi tamamlayın.</p></div><button type="button" data-dkd-v325-close aria-label="Kapat">${dkdV325Icon('close')}</button></header>
    <div class="dkd-v325-pass-hero"><div>${dkdV325Icon('courier')}</div><section><span>${dkdV325Escape(dkdPass.status || 'Aktif')}</span><h3>${dkdV325Escape(dkdPass.courier_name)}</h3><p>${dkdV325Escape(dkdPass.platform)} · ${dkdV325Escape(dkdPass.courier_plate)}</p></section><b>${dkdV325Escape(dkdEta)}</b></div>
    <div class="dkd-v325-pass-grid">
      ${dkdV325PassField('Telefon', dkdPass.courier_phone)}
      ${dkdV325PassField('Plaka', dkdPass.courier_plate)}
      ${dkdV325PassField('Platform', dkdPass.platform)}
      ${dkdV325PassField('Sipariş', dkdPass.order_number)}
      ${dkdV325PassField('Gönderici', dkdPass.origin_name)}
      ${dkdV325PassField('Gönderici Adresi', dkdPass.origin_address, true)}
      ${dkdV325PassField('Müşteri', dkdPass.customer_name)}
      ${dkdV325PassField('Site', dkdPass.site_name)}
      ${dkdV325PassField('Kapı', dkdPass.gate)}
      ${dkdV325PassField('Blok / Kat / Daire', [dkdPass.block, dkdPass.floor, dkdPass.apartment].filter(Boolean).join(' / '))}
      ${dkdV325PassField('Mesafe', dkdDistance)}
      ${dkdV325PassField('Tahmini Varış', dkdEta)}
      ${dkdV325PassField('Tam Adres', dkdPass.destination_full || dkdPass.address_text, true)}
      ${dkdV325PassField('Teslimat Notu', dkdPass.note, true)}
    </div>
    <footer class="dkd-v325-pass-actions"><button type="button" data-dkd-v325-close>Vazgeç</button><button type="button" class="primary" data-dkd-v325-approve>${dkdV325Icon('check')} Eşleştirmeyi Tamamla</button></footer>`;
  dkdV325BindClose(dkdModal, 'dkd-v325-pass-modal');
  dkdModal.querySelector('[data-dkd-v325-approve]')?.addEventListener('click', async (dkdEvent) => {
    const dkdButton = dkdEvent.currentTarget;
    dkdButton.disabled = true;
    dkdButton.textContent = 'Eşleştiriliyor…';
    try {
      const dkdResult = await dkdV325Data.approvePass(dkdCode);
      dkdModal.querySelector('section').innerHTML = `<div class="dkd-v325-success">${dkdV325Icon('check')}<h2>Eşleştirme tamamlandı</h2><p>${dkdV325Escape(dkdResult?.courier_name || dkdPass.courier_name)} için geçiş güvenli şekilde tamamlandı.</p><button type="button" data-dkd-v325-close>Tamam</button></div>`;
      dkdV325BindClose(dkdModal, 'dkd-v325-pass-modal');
      const dkdCodeInput = document.querySelector('#dkd-v31-code');
      if (dkdCodeInput) dkdCodeInput.value = '';
    } catch (dkdError) {
      dkdButton.disabled = false;
      dkdButton.textContent = 'Tekrar Dene';
      alert(dkdV325Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
    }
  });
}

async function dkdV325FindAndOpenPass(dkdButton) {
  if (dkdV325State.finderBusy) return;
  const dkdFinder = dkdButton.closest('.dkd-v31-finder,.dkd-v324-finder');
  const dkdInput = dkdFinder?.querySelector('#dkd-v31-code,input[inputmode="numeric"],input[type="text"]');
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCode.length !== 6) {
    dkdInput?.focus();
    dkdInput?.setCustomValidity?.('6 haneli kurye kodunu girin.');
    dkdInput?.reportValidity?.();
    setTimeout(() => dkdInput?.setCustomValidity?.(''), 1200);
    return;
  }
  dkdV325State.finderBusy = true;
  const dkdModal = dkdV325OpenShell('dkd-v325-pass-modal', 'dkd-v325-pass-panel', 'Kurye aranıyor', `${dkdCode} kodu canlı geçiş kayıtlarında doğrulanıyor.`);
  try {
    const dkdPass = await dkdV325Data.findPass(dkdCode);
    if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
    dkdV325RenderPassModal(dkdModal, dkdPass, dkdCode);
  } catch (dkdError) {
    dkdModal.querySelector('section').innerHTML = `<div class="dkd-v325-error"><h2>Kurye bulunamadı</h2><p>${dkdV325Escape(dkdV325Data?.readableError?.(dkdError) || dkdError?.message || dkdError)}</p><button type="button" data-dkd-v325-close>Kapat</button></div>`;
    dkdV325BindClose(dkdModal, 'dkd-v325-pass-modal');
  } finally {
    dkdV325State.finderBusy = false;
  }
}

function dkdV325BindGlobalCapture() {
  if (document.documentElement.dataset.dkdV325Capture === 'true') return;
  document.documentElement.dataset.dkdV325Capture = 'true';
  document.addEventListener('click', (dkdEvent) => {
    const dkdControl = dkdEvent.target.closest('button,a,[role="button"]');
    if (!dkdControl) return;
    const dkdText = dkdV325Normalize([dkdControl.textContent, dkdControl.getAttribute('aria-label'), dkdControl.getAttribute('title')].join(' '));
    const dkdInsideFinder = Boolean(dkdControl.closest('.dkd-v31-finder,.dkd-v324-finder'));
    if (dkdInsideFinder && dkdText.includes('kuryeni bul ve eslestir')) {
      dkdEvent.preventDefault();
      dkdEvent.stopPropagation();
      dkdEvent.stopImmediatePropagation();
      void dkdV325FindAndOpenPass(dkdControl);
      return;
    }
    if ((dkdControl.dataset.dkdV324AdminMenu || dkdControl.dataset.dkdV31Menu === 'admin' || dkdText === 'admin paneli') && !dkdControl.closest('#dkd-v325-admin-modal')) {
      dkdEvent.preventDefault();
      dkdEvent.stopPropagation();
      dkdEvent.stopImmediatePropagation();
      void dkdV325OpenAdmin();
    }
  }, true);
}

function dkdV325Patch() {
  dkdV325PatchNewPassPage();
  dkdV325EnsureEarningsMenu();
}

function dkdV325SchedulePatch() {
  clearTimeout(dkdV325State.patchTimer);
  dkdV325State.patchTimer = setTimeout(dkdV325Patch, 120);
}

async function dkdV325Boot() {
  if (!dkdV325Data) throw new Error('DraBornGate v3.2.5 veri bağlantısı bulunamadı.');
  dkdV325BindGlobalCapture();
  dkdV325State.context = await dkdV325LoadContext().catch(() => window.dkdV325Session?.state?.context || null);
  dkdV325Patch();
  dkdV325State.observer = new MutationObserver(dkdV325SchedulePatch);
  dkdV325State.observer.observe(document.body, { childList: true, subtree: true });
}

window.__DKD_GATE_V325_FEATURES__ = {
  version: DKD_V325_FEATURE_VERSION,
  state: dkdV325State,
  patch: dkdV325Patch,
  openAdmin: dkdV325OpenAdmin,
  openEarnings: dkdV325OpenEarnings,
};

void dkdV325Boot();
