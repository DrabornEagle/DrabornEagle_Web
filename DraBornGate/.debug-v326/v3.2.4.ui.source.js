(() => {
  const DKD_V324_VERSION = '3.2.4';
  const DKD_V324_ADMIN_EMAILS = new Set([
    'draborneagle@gmail.com',
    'playreview@draborneagle.com',
  ]);
  const dkdV324State = {
    patchTimer: 0,
    adminLoading: false,
    adminEmail: '',
    adminLastAttempt: 0,
    openQueueCategories: new Set(),
    queueCategoriesInitialised: false,
    sitePageKey: '',
    siteSelection: null,
    siteSelectStates: new WeakMap(),
  };

  function dkdV324Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9@._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function dkdV324Escape(dkdValue) {
    if (window.dkdV31Data?.escape) return window.dkdV31Data.escape(dkdValue);
    return String(dkdValue ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function dkdV324ExactText(dkdText, dkdRoot = document) {
    const dkdWanted = dkdV324Normalize(dkdText);
    return [...dkdRoot.querySelectorAll('h1,h2,h3,h4,strong,b,span,p,button,a,label,[role="button"]')]
      .find((dkdElement) => dkdV324Normalize(dkdElement.textContent) === dkdWanted);
  }

  function dkdV324ClosestCard(dkdElement, dkdMaxText = 850) {
    let dkdNode = dkdElement;
    for (let dkdDepth = 0; dkdNode && dkdDepth < 8; dkdDepth += 1, dkdNode = dkdNode.parentElement) {
      if (!/^(ARTICLE|SECTION|LI|DIV|ASIDE)$/i.test(dkdNode.tagName || '')) continue;
      const dkdLength = String(dkdNode.textContent || '').trim().length;
      if (dkdLength < 8 || dkdLength > dkdMaxText) continue;
      const dkdParentLength = String(dkdNode.parentElement?.textContent || '').trim().length;
      if (!dkdNode.parentElement || dkdParentLength > dkdLength * 1.25) return dkdNode;
    }
    return dkdElement?.closest?.('article,section,li,div,aside') || null;
  }

  function dkdV324IsSimpleTheme() {
    return Boolean(window.dkdV31Data?.isSimpleTheme?.()) ||
      dkdV324Normalize(location.pathname).includes('guvenlik sade tema') ||
      sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
      sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
  }

  function dkdV324DecodeJwt(dkdToken) {
    try {
      const dkdPart = String(dkdToken || '').split('.')[1];
      if (!dkdPart) return null;
      const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
      const dkdJson = decodeURIComponent(Array.from(atob(dkdBase64), (dkdCharacter) =>
        `%${dkdCharacter.charCodeAt(0).toString(16).padStart(2, '0')}`
      ).join(''));
      return JSON.parse(dkdJson);
    } catch {
      return null;
    }
  }

  function dkdV324FindAdminEmail() {
    if (DKD_V324_ADMIN_EMAILS.has(dkdV324State.adminEmail)) return dkdV324State.adminEmail;
    for (const dkdStorage of [localStorage, sessionStorage]) {
      for (let dkdIndex = 0; dkdIndex < dkdStorage.length; dkdIndex += 1) {
        const dkdValue = String(dkdStorage.getItem(dkdStorage.key(dkdIndex)) || '');
        const dkdTokens = dkdValue.match(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g) || [];
        for (const dkdToken of dkdTokens) {
          const dkdPayload = dkdV324DecodeJwt(dkdToken);
          const dkdEmail = dkdV324Normalize(dkdPayload?.email || dkdPayload?.user_metadata?.email || '');
          if (DKD_V324_ADMIN_EMAILS.has(dkdEmail)) {
            dkdV324State.adminEmail = dkdEmail;
            return dkdEmail;
          }
        }
        for (const dkdEmail of DKD_V324_ADMIN_EMAILS) {
          if (dkdV324Normalize(dkdValue).includes(dkdEmail)) {
            dkdV324State.adminEmail = dkdEmail;
            return dkdEmail;
          }
        }
      }
    }
    const dkdBodyText = dkdV324Normalize(document.body?.innerText || '');
    for (const dkdEmail of DKD_V324_ADMIN_EMAILS) {
      if (dkdBodyText.includes(dkdEmail)) {
        dkdV324State.adminEmail = dkdEmail;
        return dkdEmail;
      }
    }
    return '';
  }

  function dkdV324AdminIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" stroke-width="1.8"/></svg>';
  }

  function dkdV324CloseIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg>';
  }

  function dkdV324FormatMoney(dkdValue) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 2,
    }).format(Number(dkdValue || 0));
  }

  function dkdV324EnsureAdminModal() {
    let dkdModal = document.querySelector('#dkd-v324-admin-modal');
    if (!dkdModal) {
      dkdModal = document.createElement('div');
      dkdModal.id = 'dkd-v324-admin-modal';
      dkdModal.hidden = true;
      document.body.appendChild(dkdModal);
    }
    return dkdModal;
  }

  function dkdV324CloseAdminModal() {
    const dkdModal = dkdV324EnsureAdminModal();
    dkdModal.hidden = true;
    dkdModal.innerHTML = '';
    document.body.classList.remove('dkd-v324-admin-open');
  }

  function dkdV324BindAdminClose() {
    for (const dkdButton of document.querySelectorAll('[data-dkd-v324-admin-close]')) {
      dkdButton.addEventListener('click', dkdV324CloseAdminModal);
    }
  }

  async function dkdV324OpenAdminPanel() {
    const dkdData = window.dkdV31Data;
    const dkdModal = dkdV324EnsureAdminModal();
    dkdModal.hidden = false;
    document.body.classList.add('dkd-v324-admin-open');
    dkdModal.innerHTML = `<div class="dkd-v324-admin-backdrop" data-dkd-v324-admin-close></div>
      <section class="dkd-v324-admin-panel" role="dialog" aria-modal="true" aria-label="Admin Paneli">
        <div class="dkd-v324-admin-loading"><span></span><strong>Admin Paneli hazırlanıyor…</strong></div>
      </section>`;
    dkdV324BindAdminClose();
    try {
      if (!dkdData?.loadAdminCatalog) throw new Error('Admin veri bağlantısı hazır değil.');
      const dkdCatalog = await dkdData.loadAdminCatalog();
      if (!dkdCatalog) throw new Error('Admin yetkisi doğrulanamadı.');
      dkdV324RenderAdminPanel(dkdCatalog);
    } catch (dkdError) {
      dkdModal.querySelector('section').innerHTML = `<div class="dkd-v324-admin-error"><h2>Admin Paneli açılamadı</h2><p>${dkdV324Escape(dkdData?.readableError?.(dkdError) || dkdError?.message || dkdError)}</p><button type="button" data-dkd-v324-admin-close>Kapat</button></div>`;
      dkdV324BindAdminClose();
    }
  }

  function dkdV324RenderAdminPanel(dkdCatalog = window.dkdV31Data?.state?.adminCatalog) {
    if (!dkdCatalog) return;
    const dkdModal = dkdV324EnsureAdminModal();
    const dkdUsers = Array.isArray(dkdCatalog.users) ? dkdCatalog.users : [];
    const dkdSites = Array.isArray(dkdCatalog.sites) ? dkdCatalog.sites : [];
    const dkdLinks = Array.isArray(dkdCatalog.links) ? dkdCatalog.links : [];
    const dkdActiveLinks = dkdLinks.filter((dkdLink) => dkdLink.is_active);
    dkdModal.innerHTML = `<div class="dkd-v324-admin-backdrop" data-dkd-v324-admin-close></div>
      <section class="dkd-v324-admin-panel" role="dialog" aria-modal="true" aria-label="Admin Paneli">
        <header>
          <div><span>YETKİLİ YÖNETİM</span><h2>Admin Paneli</h2><p>${dkdV324Escape(dkdV324State.adminEmail)} hesabı için tüm rollerden erişilebilir.</p></div>
          <button type="button" data-dkd-v324-admin-close aria-label="Kapat">${dkdV324CloseIcon()}</button>
        </header>
        <div class="dkd-v324-admin-stats">
          <article><small>Kullanıcı</small><strong>${dkdUsers.length}</strong></article>
          <article><small>Site</small><strong>${dkdSites.length}</strong></article>
          <article><small>Aktif Bağlantı</small><strong>${dkdActiveLinks.length}</strong></article>
        </div>
        <details class="dkd-v324-admin-section" open>
          <summary><div><strong>Siteyi Kullanıcıya Bağla</strong><small>Kurye başı kazanç ve bağlantı durumu</small></div><b>+</b></summary>
          <form id="dkd-v324-admin-link-form" class="dkd-v324-admin-form">
            <label>Kullanıcı<select id="dkd-v324-admin-user" required><option value="">Kullanıcı seçin</option>${dkdUsers.map((dkdUser) => `<option value="${dkdV324Escape(dkdUser.user_id)}">${dkdV324Escape(dkdUser.full_name || dkdUser.email)} · ${dkdV324Escape(dkdUser.email)}</option>`).join('')}</select></label>
            <label>Site<select id="dkd-v324-admin-site" required><option value="">Site seçin</option>${dkdSites.map((dkdSite) => `<option value="${dkdV324Escape(dkdSite.site_id)}">${dkdV324Escape(dkdSite.site_name)}${dkdSite.city ? ` · ${dkdV324Escape(dkdSite.city)}` : ''}</option>`).join('')}</select></label>
            <label>Kurye Başı Kazanç<input id="dkd-v324-admin-amount" type="number" min="0" step="0.01" value="10.00"></label>
            <label class="dkd-v324-admin-toggle"><input id="dkd-v324-admin-active" type="checkbox" checked><span>Bağlantı aktif</span></label>
            <button type="submit">Bağlantıyı Kaydet</button>
          </form>
        </details>
        <details class="dkd-v324-admin-section" open>
          <summary><div><strong>Site–Kullanıcı Bağlantıları</strong><small>${dkdLinks.length} kayıt</small></div><b>+</b></summary>
          <div class="dkd-v324-admin-links">${dkdLinks.map((dkdLink) => `<article><div><strong>${dkdV324Escape(dkdLink.user_name)}</strong><span>${dkdV324Escape(dkdLink.site_name)}</span><small>Kurye başına ${dkdV324FormatMoney(dkdLink.amount_per_courier)} · ${dkdLink.is_active ? 'Aktif' : 'Pasif'}</small></div><button type="button" data-dkd-v324-toggle-link data-user="${dkdV324Escape(dkdLink.user_id)}" data-site="${dkdV324Escape(dkdLink.site_id)}" data-amount="${dkdV324Escape(dkdLink.amount_per_courier)}" data-active="${dkdLink.is_active ? 'true' : 'false'}">${dkdLink.is_active ? 'Pasifleştir' : 'Aktifleştir'}</button></article>`).join('') || '<p>Henüz bağlantı yok.</p>'}</div>
        </details>
      </section>`;
    dkdV324BindAdminClose();
    document.querySelector('#dkd-v324-admin-link-form')?.addEventListener('submit', async (dkdEvent) => {
      dkdEvent.preventDefault();
      const dkdSubmit = dkdEvent.submitter;
      const dkdUserId = document.querySelector('#dkd-v324-admin-user')?.value;
      const dkdSiteId = document.querySelector('#dkd-v324-admin-site')?.value;
      const dkdAmount = document.querySelector('#dkd-v324-admin-amount')?.value;
      const dkdActive = document.querySelector('#dkd-v324-admin-active')?.checked;
      if (!dkdUserId || !dkdSiteId) return;
      if (dkdSubmit) dkdSubmit.disabled = true;
      try {
        await window.dkdV31Data.assignPartnerSite(dkdUserId, dkdSiteId, dkdAmount, dkdActive);
        dkdV324RenderAdminPanel();
      } catch (dkdError) {
        if (dkdSubmit) dkdSubmit.disabled = false;
        alert(window.dkdV31Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
      }
    });
    for (const dkdButton of document.querySelectorAll('[data-dkd-v324-toggle-link]')) {
      dkdButton.addEventListener('click', async () => {
        dkdButton.disabled = true;
        try {
          await window.dkdV31Data.assignPartnerSite(
            dkdButton.dataset.user,
            dkdButton.dataset.site,
            Number(dkdButton.dataset.amount || 10),
            dkdButton.dataset.active !== 'true'
          );
          dkdV324RenderAdminPanel();
        } catch (dkdError) {
          dkdButton.disabled = false;
          alert(window.dkdV31Data?.readableError?.(dkdError) || String(dkdError?.message || dkdError));
        }
      });
    }
  }

  function dkdV324FindProfileMenuItem() {
    const dkdProfileText = dkdV324ExactText('Profil ve Bağlantı');
    return dkdProfileText?.closest('button,a,[role="button"]') || dkdV324ClosestCard(dkdProfileText, 300);
  }

  function dkdV324EnsureAdminMenu() {
    const dkdEmail = dkdV324FindAdminEmail();
    if (!DKD_V324_ADMIN_EMAILS.has(dkdEmail)) return;
    const dkdExisting = document.querySelector('[data-dkd-v31-menu="admin"]');
    if (dkdExisting) {
      dkdExisting.classList.add('dkd-v324-admin-menu');
      document.querySelector('[data-dkd-v324-admin-menu]')?.remove();
      return;
    }
    const dkdProfileItem = dkdV324FindProfileMenuItem();
    if (!dkdProfileItem || document.querySelector('[data-dkd-v324-admin-menu]')) return;
    const dkdButton = document.createElement('button');
    dkdButton.type = 'button';
    dkdButton.className = 'dkd-v31-menu-item dkd-v324-admin-menu';
    dkdButton.dataset.dkdV324AdminMenu = 'true';
    dkdButton.innerHTML = `<span>${dkdV324AdminIcon()}</span><strong>Admin Paneli</strong>`;
    dkdButton.addEventListener('click', dkdV324OpenAdminPanel);
    dkdProfileItem.after(dkdButton);
  }

  async function dkdV324PrimeAdminCatalog() {
    if (dkdV324State.adminLoading || !DKD_V324_ADMIN_EMAILS.has(dkdV324FindAdminEmail())) return;
    if (!window.dkdV31Data?.state?.adminCatalog && Date.now() - dkdV324State.adminLastAttempt < 15000) return;
    if (window.dkdV31Data?.state?.adminCatalog) {
      dkdV324EnsureAdminMenu();
      return;
    }
    if (!window.dkdV31Data?.loadAdminCatalog) return;
    dkdV324State.adminLastAttempt = Date.now();
    dkdV324State.adminLoading = true;
    try {
      await window.dkdV31Data.loadAdminCatalog();
      const dkdPulse = document.createElement('span');
      dkdPulse.hidden = true;
      document.body.appendChild(dkdPulse);
      dkdPulse.remove();
    } finally {
      dkdV324State.adminLoading = false;
      dkdV324EnsureAdminMenu();
    }
  }

  function dkdV324PatchFinder() {
    if (!dkdV324IsSimpleTheme()) return;
    const dkdFinder = document.querySelector('.dkd-v31-finder');
    if (!dkdFinder) return;
    dkdFinder.classList.add('dkd-v324-finder');
    const dkdCopy = dkdFinder.querySelector('.dkd-v31-finder-copy');
    dkdCopy?.querySelector(':scope > p')?.remove();
    if (!dkdFinder.querySelector('.dkd-v324-finder-motion')) {
      const dkdMotion = document.createElement('i');
      dkdMotion.className = 'dkd-v324-finder-motion';
      dkdMotion.setAttribute('aria-hidden', 'true');
      dkdFinder.prepend(dkdMotion);
    }
    const dkdInput = dkdFinder.querySelector('#dkd-v31-code');
    if (dkdInput) {
      dkdInput.removeAttribute('aria-describedby');
      dkdInput.setAttribute('enterkeyhint', 'go');
    }
    dkdFinder.querySelector('#dkd-v324-code-help')?.remove();
  }

  function dkdV324PatchQueueCategories() {
    if (!dkdV324IsSimpleTheme()) return;
    const dkdCategories = [...document.querySelectorAll('.dkd-v31-queue-category')];
    if (!dkdCategories.length) return;
    if (!dkdV324State.queueCategoriesInitialised) {
      dkdV324State.queueCategoriesInitialised = true;
      dkdV324State.openQueueCategories.clear();
    }
    for (const dkdCategory of dkdCategories) {
      const dkdKey = String(dkdCategory.dataset.dkdV31Category || '');
      if (dkdV324State.openQueueCategories.has(dkdKey)) dkdCategory.setAttribute('open', '');
      else dkdCategory.removeAttribute('open');
      if (dkdCategory.dataset.dkdV324Bound === 'true') continue;
      dkdCategory.dataset.dkdV324Bound = 'true';
      dkdCategory.addEventListener('toggle', () => {
        if (dkdCategory.open) dkdV324State.openQueueCategories.add(dkdKey);
        else dkdV324State.openQueueCategories.delete(dkdKey);
      });
    }
  }

  function dkdV324PatchPassModal() {
    const dkdPanel = document.querySelector('#dkd-v31-global-modal .dkd-v31-pass-modal');
    if (!dkdPanel) return;
    dkdPanel.classList.add('dkd-v324-pass-modal');
    dkdPanel.setAttribute('role', 'dialog');
    dkdPanel.setAttribute('aria-modal', 'true');
    const dkdHeader = dkdPanel.querySelector(':scope > header');
    const dkdDescription = dkdHeader?.querySelector('p');
    if (dkdDescription) dkdDescription.textContent = 'Kurye, araç, platform, müşteri, sipariş, adres, mesafe ve teslimat notunu tek ekranda kontrol edin.';
    if (dkdHeader && !dkdHeader.querySelector('.dkd-v324-modal-tags')) {
      const dkdTags = document.createElement('div');
      dkdTags.className = 'dkd-v324-modal-tags';
      dkdTags.innerHTML = '<span>Kurye</span><span>Araç</span><span>Sipariş</span><span>Tam Adres</span>';
      dkdHeader.firstElementChild?.appendChild(dkdTags);
    }
  }

  function dkdV324PatchMinimalStats() {
    for (const dkdLabel of ['Tamamlanan', 'Aktif Geçiş', 'Aktif Site']) {
      const dkdElement = dkdV324ExactText(dkdLabel);
      const dkdCard = dkdElement && dkdV324ClosestCard(dkdElement, 560);
      if (dkdCard) dkdCard.classList.add('dkd-v324-minimal-stat');
    }
  }

  function dkdV324StorageHasCourierRole() {
    const dkdRoleKeys = new Set(['role', 'preferred_role', 'active_role', 'selected_role', 'current_role']);
    function dkdWalk(dkdValue, dkdDepth = 0) {
      if (dkdDepth > 7 || dkdValue == null) return false;
      if (Array.isArray(dkdValue)) return dkdValue.some((dkdItem) => dkdWalk(dkdItem, dkdDepth + 1));
      if (typeof dkdValue !== 'object') return false;
      for (const [dkdKey, dkdItem] of Object.entries(dkdValue)) {
        if (dkdRoleKeys.has(dkdV324Normalize(dkdKey).replace(/ /g, '_'))) {
          const dkdRole = dkdV324Normalize(dkdItem);
          if (dkdRole === 'courier' || dkdRole === 'kurye') return true;
        }
        if (dkdWalk(dkdItem, dkdDepth + 1)) return true;
      }
      return false;
    }
    for (const dkdStorage of [localStorage, sessionStorage]) {
      for (let dkdIndex = 0; dkdIndex < dkdStorage.length; dkdIndex += 1) {
        const dkdRaw = dkdStorage.getItem(dkdStorage.key(dkdIndex));
        try {
          if (dkdWalk(JSON.parse(dkdRaw))) return true;
        } catch {
          // Non-JSON storage is ignored.
        }
      }
    }
    return false;
  }

  function dkdV324IsCourierRole() {
    const dkdActiveRole = [...document.querySelectorAll('[aria-current="page"],.active,.is-active,[data-active="true"]')]
      .some((dkdElement) => ['kurye', 'courier'].includes(dkdV324Normalize(dkdElement.textContent)));
    if (dkdActiveRole) return true;
    const dkdPageText = dkdV324Normalize(document.body?.innerText || '');
    const dkdCourierSignals = ['yeni gecis talebi', 'yeni kurye gecisi', 'kapıya geldim', 'konum kontrolu yap'];
    if (dkdCourierSignals.some((dkdSignal) => dkdPageText.includes(dkdSignal))) return true;
    return dkdV324StorageHasCourierRole();
  }

  function dkdV324IsNewPassPage() {
    const dkdPageText = dkdV324Normalize(document.body?.innerText || '');
    return (dkdPageText.includes('yeni gecis talebi') || dkdPageText.includes('yeni kurye gecisi')) &&
      (dkdPageText.includes('site') || dkdPageText.includes('musteri'));
  }

  function dkdV324RemoveCourierSiteContext() {
    if (dkdV324IsSimpleTheme() || !dkdV324IsCourierRole() || dkdV324IsNewPassPage()) return;
    const dkdScopes = [...document.querySelectorAll('aside,nav,[class*="sidebar"],[class*="side-bar"],[class*="sidepanel"],[class*="side-panel"]')];
    const dkdSelectors = [
      '[class*="site-context"]',
      '[class*="site-badge"]',
      '[class*="selected-site"]',
      '[class*="active-site"]',
      '[data-site-id]',
    ].join(',');
    for (const dkdScope of dkdScopes) {
      const dkdCandidates = new Set([...dkdScope.querySelectorAll(dkdSelectors)]);
      for (const dkdElement of dkdScope.querySelectorAll('article,section,div')) {
        const dkdText = dkdV324Normalize(dkdElement.textContent);
        if (dkdText.length > 180) continue;
        if (/(bagli site|aktif site|site baglantisi|secili site|siteye bagli|site:)/.test(dkdText)) dkdCandidates.add(dkdElement);
      }
      for (const dkdCandidate of dkdCandidates) {
        if (!dkdCandidate || dkdCandidate.closest('main,#dkd-v31-root,#dkd-v31-global-modal,#dkd-v324-admin-modal')) continue;
        if (dkdCandidate.matches('.dkd-v31-minimal-stat,.dkd-v324-minimal-stat') || dkdCandidate.closest('.dkd-v31-minimal-stat,.dkd-v324-minimal-stat')) continue;
        const dkdText = dkdV324Normalize(dkdCandidate.textContent);
        if (dkdText.includes('profil ve baglanti') || dkdText.includes('admin paneli') || dkdText.includes('site yonetimi')) continue;
        dkdCandidate.classList.add('dkd-v324-hidden-courier-site');
        dkdCandidate.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function dkdV324FindSelectByLabel(dkdLabelText) {
    const dkdTarget = dkdV324Normalize(dkdLabelText);
    const dkdLabels = [...document.querySelectorAll('label,div,span,p,strong')]
      .filter((dkdElement) => dkdV324Normalize(dkdElement.textContent) === dkdTarget);
    for (const dkdLabel of dkdLabels) {
      let dkdScope = dkdLabel.parentElement;
      for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
        const dkdSelect = dkdScope.querySelector('select');
        if (dkdSelect) return dkdSelect;
      }
    }
    return null;
  }

  function dkdV324SetSelectValue(dkdSelect, dkdValue, dkdDispatch = true) {
    if (!dkdSelect) return;
    const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
    else dkdSelect.value = dkdValue;
    for (const dkdOption of dkdSelect.options) dkdOption.selected = dkdOption.value === dkdValue;
    if (dkdDispatch) {
      dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
      dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function dkdV324EnsureEmptySiteOption(dkdSelect) {
    let dkdEmpty = [...dkdSelect.options].find((dkdOption) => !dkdOption.value);
    if (!dkdEmpty) {
      dkdEmpty = document.createElement('option');
      dkdEmpty.value = '';
      dkdSelect.insertBefore(dkdEmpty, dkdSelect.firstChild);
    }
    dkdEmpty.textContent = 'Site seçilmedi — arama yapın';
    dkdEmpty.disabled = false;
    return dkdEmpty;
  }

  function dkdV324MountFallbackSiteSearch(dkdSelect) {
    const dkdParent = dkdSelect.parentElement;
    if (!dkdParent || dkdParent.querySelector(':scope > .dkd-v23-site-search,:scope > .dkd-v324-site-search')) return;
    const dkdWidget = document.createElement('div');
    dkdWidget.className = 'dkd-v324-site-search';
    dkdWidget.innerHTML = `<label>Site Ara<input type="search" autocomplete="off" placeholder="Site adı veya şehir yazarak ara" aria-label="Site ara"></label><div hidden></div><p>Site otomatik seçilmez. En az 2 harf yazarak seçim yapın.</p>`;
    dkdParent.insertBefore(dkdWidget, dkdSelect);
    const dkdInput = dkdWidget.querySelector('input');
    const dkdResults = dkdWidget.querySelector('div');
    const dkdRender = () => {
      const dkdQuery = dkdV324Normalize(dkdInput.value);
      if (dkdQuery.length < 2) {
        dkdResults.hidden = true;
        dkdResults.innerHTML = '';
        return;
      }
      const dkdOptions = [...dkdSelect.options]
        .filter((dkdOption) => dkdOption.value && !dkdOption.disabled && dkdV324Normalize(dkdOption.textContent).includes(dkdQuery))
        .slice(0, 15);
      dkdResults.hidden = false;
      dkdResults.innerHTML = dkdOptions.length
        ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-v324-site="${encodeURIComponent(dkdOption.value)}">${dkdV324Escape(dkdOption.textContent)}<b>SEÇ</b></button>`).join('')
        : '<p>Eşleşen aktif site bulunamadı.</p>';
    };
    dkdInput.addEventListener('input', () => {
      dkdV324State.siteSelection = null;
      const dkdSelectState = dkdV324State.siteSelectStates.get(dkdSelect);
      if (dkdSelectState) dkdSelectState.userChosen = false;
      dkdV324SetSelectValue(dkdSelect, '');
      dkdRender();
    });
    dkdResults.addEventListener('click', (dkdEvent) => {
      const dkdButton = dkdEvent.target.closest('[data-dkd-v324-site]');
      if (!dkdButton) return;
      const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV324Site || '');
      const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdValue);
      if (!dkdOption) return;
      dkdV324State.siteSelection = { value: dkdValue, label: String(dkdOption.textContent || '').trim() };
      const dkdSelectState = dkdV324State.siteSelectStates.get(dkdSelect);
      if (dkdSelectState) dkdSelectState.userChosen = true;
      dkdV324SetSelectValue(dkdSelect, dkdValue);
      dkdInput.value = dkdV324State.siteSelection.label;
      dkdResults.hidden = true;
    });
  }

  function dkdV324PatchSiteSearch() {
    if (!dkdV324IsNewPassPage()) {
      dkdV324State.sitePageKey = '';
      dkdV324State.siteSelection = null;
      return;
    }
    const dkdPageKey = `${location.pathname}|${dkdV324Normalize(dkdV324ExactText('Yeni Geçiş Talebi')?.textContent || dkdV324ExactText('Yeni Kurye Geçişi')?.textContent || 'new-pass')}`;
    if (dkdV324State.sitePageKey !== dkdPageKey) {
      dkdV324State.sitePageKey = dkdPageKey;
      dkdV324State.siteSelection = null;
    }
    const dkdSelect = dkdV324FindSelectByLabel('Site');
    if (!dkdSelect) return;
    dkdSelect.classList.add('dkd-v324-native-site');
    dkdV324EnsureEmptySiteOption(dkdSelect);
    let dkdSelectState = dkdV324State.siteSelectStates.get(dkdSelect);
    if (!dkdSelectState) {
      dkdSelectState = { userChosen: false };
      dkdV324State.siteSelectStates.set(dkdSelect, dkdSelectState);
    }
    const dkdSelection = dkdV324State.siteSelection;
    if (dkdSelection && [...dkdSelect.options].some((dkdOption) => dkdOption.value === dkdSelection.value)) {
      dkdSelectState.userChosen = true;
      if (dkdSelect.value !== dkdSelection.value) dkdV324SetSelectValue(dkdSelect, dkdSelection.value);
    } else if (!dkdSelectState.userChosen && dkdSelect.value) {
      dkdV324SetSelectValue(dkdSelect, '');
    }
    const dkdExistingWidget = dkdSelect.parentElement?.querySelector(':scope > .dkd-v23-site-search');
    if (dkdExistingWidget) dkdExistingWidget.classList.add('dkd-v324-site-search-upgraded');
    else dkdV324MountFallbackSiteSearch(dkdSelect);
  }

  function dkdV324BindGlobalEvents() {
    if (document.documentElement.dataset.dkdV324Events === 'true') return;
    document.documentElement.dataset.dkdV324Events = 'true';
    document.addEventListener('click', (dkdEvent) => {
      const dkdSiteButton = dkdEvent.target.closest('[data-dkd-site]');
      if (!dkdSiteButton) return;
      const dkdWidget = dkdSiteButton.closest('.dkd-v23-site-search');
      const dkdSelect = dkdWidget?.parentElement?.querySelector('select');
      if (!dkdSelect) return;
      queueMicrotask(() => {
        const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdSelect.value);
        if (!dkdOption || !dkdOption.value) return;
        const dkdSelectState = dkdV324State.siteSelectStates.get(dkdSelect) || { userChosen: true };
        dkdSelectState.userChosen = true;
        dkdV324State.siteSelectStates.set(dkdSelect, dkdSelectState);
        dkdV324State.siteSelection = { value: dkdOption.value, label: String(dkdOption.textContent || '').trim() };
      });
    }, true);
    document.addEventListener('input', (dkdEvent) => {
      if (!dkdEvent.target.matches('.dkd-v23-site-search input[type="search"]')) return;
      const dkdWidget = dkdEvent.target.closest('.dkd-v23-site-search');
      const dkdSelect = dkdWidget?.parentElement?.querySelector('select');
      const dkdSelectedLabel = dkdWidget?.querySelector('.dkd-v23-site-selected strong')?.textContent || '';
      if (dkdSelectedLabel && String(dkdEvent.target.value || '') === String(dkdSelectedLabel)) return;
      dkdV324State.siteSelection = null;
      const dkdSelectState = dkdSelect && dkdV324State.siteSelectStates.get(dkdSelect);
      if (dkdSelectState) dkdSelectState.userChosen = false;
    }, true);
  }

  function dkdV324Patch() {
    document.body.classList.add('dkd-v324-active');
    dkdV324PatchFinder();
    dkdV324PatchQueueCategories();
    dkdV324PatchPassModal();
    dkdV324PatchMinimalStats();
    dkdV324RemoveCourierSiteContext();
    dkdV324PatchSiteSearch();
    dkdV324EnsureAdminMenu();
    dkdV324PrimeAdminCatalog().catch((dkdError) => console.error('DraBornGate v3.2.4 Admin hazırlığı tamamlanamadı:', dkdError));
  }

  function dkdV324SchedulePatch() {
    clearTimeout(dkdV324State.patchTimer);
    dkdV324State.patchTimer = setTimeout(dkdV324Patch, 70);
  }

  window.__DKD_GATE_V324_UI__ = {
    version: DKD_V324_VERSION,
    adminEmails: [...DKD_V324_ADMIN_EMAILS],
    patch: dkdV324Patch,
    openAdminPanel: dkdV324OpenAdminPanel,
  };
  sessionStorage.setItem('dkd_gate_web_version', DKD_V324_VERSION);
  dkdV324BindGlobalEvents();
  new MutationObserver(dkdV324SchedulePatch).observe(document.body, { childList: true, subtree: true });
  dkdV324Patch();
})();
