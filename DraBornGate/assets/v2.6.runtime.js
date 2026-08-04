(() => {
  'use strict';

  const DKD_V26_VERSION = '2.6.0';
  const DKD_V26_SIMPLE_PATH = '/DraBornGate/Guvenlik-Sade-Tema/';
  const DKD_V26_HOME_PATH = '/DraBornGate/';
  const DKD_V26_THEME_KEY = 'dkd_gate_security_theme';
  const DKD_V26_FORCE_KEY = 'dkd_gate_force_theme';
  const DKD_V26_ROOT_ID = 'dkd-v26-simple-root';
  const DKD_V26_SPLASH_ID = 'dkd-v26-splash';
  const DKD_V26_SCAN_INTERVAL = 900;
  const DKD_V26_EMPTY_CONFIRMATIONS = 4;

  const dkdState = {
    nativeEntries: [],
    signature: '',
    lastNonEmptyAt: 0,
    emptyScans: 0,
    queueClickAt: 0,
    scanTimer: 0,
    mutationTimer: 0,
    clockTimer: 0,
    observer: null,
    isSimple: false,
    hasRenderedOnce: false,
  };

  const dkdNormalize = (value) => String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('tr-TR');

  const dkdText = (node) => String(node?.textContent || '').replace(/\s+/g, ' ').trim();

  const dkdEscape = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const dkdIcon = (name) => {
    const icons = {
      shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.9 2.8 8.1 7 10 4.2-1.9 7-5.1 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
      courier: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h2m10 0h2M7 17a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm14 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM7 17h10M6 15l2-7h6l3 4h3v3M9 8V5h4v3"/></svg>',
      sync: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8.2A7 7 0 0 1 18.5 7M17.9 15.8A7 7 0 0 1 5.5 17"/></svg>',
      layout: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16M9 10h12"/></svg>',
      logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></svg>',
      check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
      key: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M15 12v2"/></svg>',
      alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 3 20h18L12 4Z"/><path d="M12 9v5M12 17h.01"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    };
    return icons[name] || icons.shield;
  };

  function dkdReplaceVisibleVersions(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const value = node.nodeValue || '';
      if (!/v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d+)?)/i.test(value)) return;
      node.nodeValue = value
        .replace(/DraBornGate Web v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d+)?)/gi, `DraBornGate Web v${DKD_V26_VERSION}`)
        .replace(/WEB v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d+)?)/gi, `WEB v${DKD_V26_VERSION}`)
        .replace(/v2\.(?:3\.0|4\.0|5\.0|5\.1|5\.2)/gi, `v${DKD_V26_VERSION}`);
    });
    document.title = document.title.replace(/v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d+)?)/gi, `v${DKD_V26_VERSION}`);
  }

  function dkdHideSplash() {
    const splash = document.getElementById(DKD_V26_SPLASH_ID);
    if (!splash) return;
    splash.classList.add('is-hidden');
    window.setTimeout(() => splash.remove(), 480);
  }

  function dkdIsSecuritySession() {
    const rootText = dkdNormalize(document.querySelector('#dkd-app')?.innerText || '');
    return rootText.includes('güvenlik') || rootText.includes('kurye kuyruğu') || rootText.includes('geçiş talepleri');
  }

  function dkdIsSimpleRequested() {
    const pathSimple = location.pathname.toLocaleLowerCase('tr-TR').includes('/guvenlik-sade-tema');
    return pathSimple
      || sessionStorage.getItem(DKD_V26_FORCE_KEY) === 'simple'
      || sessionStorage.getItem(DKD_V26_THEME_KEY) === 'simple';
  }

  function dkdFindClickableByText(patterns, root = document.querySelector('#dkd-app')) {
    if (!root) return null;
    const candidates = Array.from(root.querySelectorAll('button, a, [role="button"], [tabindex], .nav-item, .menu-item'));
    return candidates.find((node) => {
      if (!node.isConnected || node.closest(`#${DKD_V26_ROOT_ID}`)) return false;
      const text = dkdNormalize(dkdText(node));
      return patterns.some((pattern) => text === pattern || text.includes(pattern));
    }) || null;
  }

  function dkdOpenNativeQueue() {
    const now = Date.now();
    if (now - dkdState.queueClickAt < 5000) return;
    const nativeRoot = document.querySelector('#dkd-app');
    if (!nativeRoot) return;
    const hasMatchInput = dkdFindNativeInputs().length > 0;
    if (hasMatchInput) return;
    const trigger = dkdFindClickableByText(['kurye kuyruğu', 'geçiş talepleri'], nativeRoot);
    if (!trigger) return;
    dkdState.queueClickAt = now;
    try { trigger.click(); } catch { /* no-op */ }
  }

  function dkdFindNativeInputs() {
    const root = document.querySelector('#dkd-app');
    if (!root) return [];
    return Array.from(root.querySelectorAll('input')).filter((input) => {
      if (!input.isConnected || input.closest(`#${DKD_V26_ROOT_ID}`)) return false;
      const type = dkdNormalize(input.type);
      if (!['', 'text', 'tel', 'number', 'password'].includes(type)) return false;
      const descriptor = dkdNormalize([
        input.placeholder,
        input.getAttribute('aria-label'),
        input.getAttribute('name'),
        input.id,
        input.closest('label')?.textContent,
        input.parentElement?.textContent,
      ].join(' '));
      return Number(input.maxLength) === 6
        || descriptor.includes('6 haneli')
        || descriptor.includes('eşleştirme kodu')
        || descriptor.includes('geçiş kodu');
    });
  }

  function dkdFindMatchButton(input) {
    let node = input.parentElement;
    for (let depth = 0; node && depth < 7; depth += 1, node = node.parentElement) {
      const buttons = Array.from(node.querySelectorAll('button, [role="button"], input[type="submit"]'));
      const button = buttons.find((candidate) => {
        const text = dkdNormalize(candidate.value || dkdText(candidate));
        return /kodu eşleştir|eşleştir|geçişi onayla|onayla/.test(text);
      });
      if (button) return button;
    }
    return null;
  }

  function dkdFindLocalContainer(input, button) {
    let node = input.parentElement;
    let fallback = input.parentElement;
    const banned = ['premium menü', 'profil ve bağlantı', 'ziyaretçi geçişi', 'geçiş geçmişi', 'çıkış yap'];
    for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
      if (!node.contains(button)) continue;
      const text = dkdNormalize(dkdText(node));
      if (text.length > 1400) continue;
      if (banned.some((term) => text.includes(term))) continue;
      fallback = node;
      if (/canlı geçiş talebi|bekliyor|kurye|eşleştirme kodu/.test(text)) return node;
    }
    return fallback;
  }

  function dkdExtractEntryMeta(container) {
    const banned = [
      'canlı geçiş talebi', 'bekliyor', 'güvenlik', 'premium menü', 'güvenlik merkezi',
      'kurye kuyruğu', '6 haneli eşleştirme kodu', 'kodu eşleştir', 'güvenli eşleştirme',
      'kodu yalnızca karşınızdaki kurye ile bilgileri kontrol ettikten sonra girin',
      'her işlem draborngate güvenlik kayıtlarına işlenir', 'draborngate', 'web v2.',
    ];
    const seen = new Set();
    const values = [];
    const selectors = 'h1,h2,h3,h4,h5,strong,b,[class*="title"],[class*="name"],[class*="meta"],[class*="detail"],[class*="badge"],p,span';
    Array.from(container?.querySelectorAll(selectors) || []).forEach((node) => {
      const value = dkdText(node);
      const normalized = dkdNormalize(value);
      if (value.length < 2 || value.length > 90) return;
      if (/^\d+$/.test(value)) return;
      if (banned.some((term) => normalized === term || normalized.includes(term))) return;
      if (/^[a-zçğıöşü]$/i.test(value)) return;
      if (/^[A-ZÇĞİÖŞÜ]{2,3}$/.test(value) || value.includes('@')) return;
      if (seen.has(normalized)) return;
      seen.add(normalized);
      values.push(value);
    });
    return values.slice(0, 4);
  }

  function dkdBuildNativeEntries() {
    const entries = [];
    dkdFindNativeInputs().forEach((input, index) => {
      const button = dkdFindMatchButton(input);
      if (!button) return;
      const container = dkdFindLocalContainer(input, button);
      const meta = dkdExtractEntryMeta(container);
      const key = [input.id, input.name, index, meta.join('|')].join('::');
      entries.push({ key, input, button, container, meta });
    });
    return entries;
  }

  function dkdNativeSetValue(input, value) {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (descriptor?.set) descriptor.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function dkdUpdateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    document.querySelectorAll('[data-dkd-v26-clock]').forEach((node) => { node.textContent = time; });
  }

  function dkdSetCount(count, syncing = false) {
    document.querySelectorAll('[data-dkd-v26-count]').forEach((node) => { node.textContent = String(count); });
    document.querySelectorAll('[data-dkd-v26-count-label]').forEach((node) => {
      node.textContent = syncing ? 'Senkronize ediliyor' : `${count} bekleyen`;
    });
  }

  function dkdRenderEmpty(syncing = false) {
    const list = document.querySelector('[data-dkd-v26-list]');
    if (!list) return;
    list.innerHTML = `
      <section class="dkd-v26-empty ${syncing ? 'is-syncing' : ''}">
        <div class="dkd-v26-empty-orbit"><span>${dkdIcon(syncing ? 'sync' : 'check')}</span></div>
        <h2>${syncing ? 'Kurye kuyruğu kontrol ediliyor' : 'Bekleyen kurye bulunmuyor'}</h2>
        <p>${syncing
          ? 'Modern Güvenlik Merkezi ile canlı bağlantı kuruluyor. Talep varsa birkaç saniye içinde burada görünecek.'
          : 'Yeni bir kurye kapıya ulaştığında bilgiler bu alana otomatik ve düzenli biçimde eklenecek.'}</p>
        <div class="dkd-v26-live-pill"><i></i>${syncing ? 'Canlı veriler alınıyor' : 'Canlı kuyruk izleniyor'}</div>
      </section>`;
  }

  function dkdEntrySignature(entries) {
    return entries.map((entry) => `${entry.key}:${entry.meta.join('~')}`).join('||');
  }

  function dkdRenderEntries(entries) {
    const list = document.querySelector('[data-dkd-v26-list]');
    if (!list) return;
    list.innerHTML = entries.map((entry, index) => {
      const meta = entry.meta.length ? entry.meta : ['Kurye bilgileri doğrulandı'];
      const title = meta[0] || `Kurye Talebi ${index + 1}`;
      const details = meta.slice(1, 4);
      return `
        <article class="dkd-v26-request-card" data-dkd-v26-entry="${index}">
          <div class="dkd-v26-request-glow"></div>
          <header class="dkd-v26-request-head">
            <div class="dkd-v26-request-icon">${dkdIcon('courier')}</div>
            <div class="dkd-v26-request-title">
              <span>CANLI GEÇİŞ TALEBİ</span>
              <h2>${dkdEscape(title)}</h2>
            </div>
            <div class="dkd-v26-status"><i></i>BEKLİYOR</div>
          </header>
          <div class="dkd-v26-request-details">
            <div><small>İŞLEM</small><strong>Kurye Eşleştirme</strong></div>
            <div><small>DURUM</small><strong>Kapıda doğrulama bekliyor</strong></div>
            ${details.map((detail, detailIndex) => `<div><small>${detailIndex === 0 ? 'BİLGİ' : 'DETAY'}</small><strong>${dkdEscape(detail)}</strong></div>`).join('')}
          </div>
          <div class="dkd-v26-code-panel">
            <div class="dkd-v26-code-copy">
              <span>${dkdIcon('key')}</span>
              <div><small>6 HANELİ EŞLEŞTİRME KODU</small><strong>Kurye ekranındaki kodu girin</strong></div>
            </div>
            <label class="dkd-v26-code-field">
              <span class="sr-only">6 haneli eşleştirme kodu</span>
              <input data-dkd-v26-code="${index}" type="tel" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="••••••" aria-label="6 haneli eşleştirme kodu">
            </label>
            <button class="dkd-v26-match-button" data-dkd-v26-submit="${index}" disabled>
              <span>Kuryeyi Eşleştir</span>${dkdIcon('arrow')}
            </button>
            <p class="dkd-v26-security-note">${dkdIcon('shield')} Kod yalnızca karşınızdaki kurye ile bilgiler uyuşuyorsa kullanılmalıdır.</p>
          </div>
        </article>`;
    }).join('');

    list.querySelectorAll('[data-dkd-v26-code]').forEach((input) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 6);
        const index = input.getAttribute('data-dkd-v26-code');
        const button = list.querySelector(`[data-dkd-v26-submit="${index}"]`);
        if (button) button.disabled = input.value.length !== 6;
      });
    });

    list.querySelectorAll('[data-dkd-v26-submit]').forEach((button) => {
      button.addEventListener('click', () => dkdSubmitEntry(Number(button.getAttribute('data-dkd-v26-submit')), button));
    });
  }

  function dkdShowToast(message, type = 'info') {
    let toast = document.querySelector('.dkd-v26-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'dkd-v26-toast';
      document.body.appendChild(toast);
    }
    toast.className = `dkd-v26-toast is-visible is-${type}`;
    toast.innerHTML = `${dkdIcon(type === 'error' ? 'alert' : 'check')}<span>${dkdEscape(message)}</span>`;
    window.clearTimeout(toast._dkdTimer);
    toast._dkdTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  async function dkdSubmitEntry(index, button) {
    const entry = dkdState.nativeEntries[index];
    const input = document.querySelector(`[data-dkd-v26-code="${index}"]`);
    const code = String(input?.value || '').replace(/\D/g, '').slice(0, 6);
    if (!entry?.input?.isConnected || !entry?.button?.isConnected) {
      dkdShowToast('Canlı talep yenilendi. Lütfen kodu tekrar kontrol edin.', 'error');
      dkdScheduleScan(50);
      return;
    }
    if (code.length !== 6) {
      dkdShowToast('Eşleştirme kodu 6 haneli olmalıdır.', 'error');
      input?.focus();
      return;
    }
    button.disabled = true;
    button.classList.add('is-loading');
    button.querySelector('span').textContent = 'Eşleştiriliyor';
    try {
      dkdNativeSetValue(entry.input, code);
      entry.button.click();
      dkdShowToast('Kod güvenli eşleştirme sistemine gönderildi.', 'success');
      window.setTimeout(() => dkdScheduleScan(0), 900);
    } catch (error) {
      console.error(error);
      dkdShowToast('Eşleştirme işlemi başlatılamadı. Tekrar deneyin.', 'error');
    } finally {
      window.setTimeout(() => {
        if (!button.isConnected) return;
        button.classList.remove('is-loading');
        button.querySelector('span').textContent = 'Kuryeyi Eşleştir';
        button.disabled = String(input?.value || '').length !== 6;
      }, 1600);
    }
  }

  function dkdCreateSimpleShell() {
    if (document.getElementById(DKD_V26_ROOT_ID)) return;
    document.body.classList.add('dkd-v26-simple-active');
    document.querySelectorAll('.dkd-v24-simple-shell,.dkd-v25-simple-shell,.dkd-v24-theme-backdrop,.dkd-v25-theme-backdrop').forEach((node) => {
      node.setAttribute('aria-hidden', 'true');
      node.style.display = 'none';
    });

    const root = document.createElement('main');
    root.id = DKD_V26_ROOT_ID;
    root.className = 'dkd-v26-shell';
    root.innerHTML = `
      <header class="dkd-v26-topbar">
        <div class="dkd-v26-brand">
          <span class="dkd-v26-brand-mark">${dkdIcon('shield')}</span>
          <div><strong>DraBornGate</strong><small>GÜVENLİK SADE TEMA · v${DKD_V26_VERSION}</small></div>
        </div>
        <div class="dkd-v26-top-actions">
          <button type="button" data-dkd-v26-modern title="Modern Güvenlik Paneline Geç">${dkdIcon('layout')}<span>Modern Panel</span></button>
          <button type="button" data-dkd-v26-logout title="Çıkış Yap">${dkdIcon('logout')}<span>Çıkış</span></button>
        </div>
      </header>
      <section class="dkd-v26-dashboard">
        <div class="dkd-v26-hero">
          <div class="dkd-v26-hero-copy">
            <span>CANLI KAPI OPERASYONU</span>
            <h1>Kurye Eşleştirme Merkezi</h1>
            <p>Kapıya gelen kurye bilgilerini kontrol edin, 6 haneli kodu girin ve geçiş talebini tek işlemle eşleştirin.</p>
          </div>
          <div class="dkd-v26-radar"><span>${dkdIcon('courier')}</span><i></i><i></i><i></i></div>
        </div>
        <div class="dkd-v26-metrics">
          <article><span class="dkd-v26-metric-icon is-cyan">${dkdIcon('courier')}</span><div><small>BEKLEYEN KURYE</small><strong data-dkd-v26-count>0</strong></div></article>
          <article><span class="dkd-v26-metric-icon is-green">${dkdIcon('shield')}</span><div><small>SİSTEM DURUMU</small><strong class="is-green-text">Aktif</strong></div></article>
          <article><span class="dkd-v26-metric-icon is-violet">${dkdIcon('sync')}</span><div><small>SON SENKRONİZASYON</small><strong data-dkd-v26-clock>--:--</strong></div></article>
        </div>
        <section class="dkd-v26-queue">
          <div class="dkd-v26-section-head">
            <div><span>CANLI KAPI KUYRUĞU</span><h2>Gelen Kuryeler</h2></div>
            <div class="dkd-v26-count-pill"><i></i><strong data-dkd-v26-count-label>Senkronize ediliyor</strong></div>
          </div>
          <div class="dkd-v26-list" data-dkd-v26-list></div>
        </section>
        <section class="dkd-v26-info-strip">
          <span>${dkdIcon('shield')}</span>
          <div><strong>Güvenli ve kayıtlı işlem</strong><p>Eşleştirme mevcut DraBornGate oturumu, yetki kontrolleri ve güvenlik kayıtları üzerinden gerçekleştirilir.</p></div>
        </section>
      </section>`;
    document.body.appendChild(root);

    root.querySelector('[data-dkd-v26-modern]').addEventListener('click', () => {
      sessionStorage.setItem(DKD_V26_THEME_KEY, 'modern');
      sessionStorage.removeItem(DKD_V26_FORCE_KEY);
      location.assign(DKD_V26_HOME_PATH);
    });
    root.querySelector('[data-dkd-v26-logout]').addEventListener('click', () => {
      const logout = dkdFindClickableByText(['çıkış yap', 'çıkış']);
      if (logout) logout.click();
      else location.assign(DKD_V26_HOME_PATH);
    });

    dkdRenderEmpty(true);
    dkdUpdateClock();
    window.clearInterval(dkdState.clockTimer);
    dkdState.clockTimer = window.setInterval(dkdUpdateClock, 15000);
  }

  function dkdEnsureModernSwitch() {
    if (dkdState.isSimple || !dkdIsSecuritySession()) return;
    if (document.querySelector('.dkd-v26-modern-switch')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dkd-v26-modern-switch';
    button.innerHTML = `${dkdIcon('layout')}<span><small>HIZLI GÖRÜNÜM</small><strong>Sade Temaya Geç</strong></span>${dkdIcon('arrow')}`;
    button.addEventListener('click', () => {
      sessionStorage.setItem(DKD_V26_THEME_KEY, 'simple');
      sessionStorage.setItem(DKD_V26_FORCE_KEY, 'simple');
      location.assign(DKD_V26_SIMPLE_PATH);
    });
    document.body.appendChild(button);
  }

  function dkdScanQueue() {
    if (!dkdState.isSimple) return;
    dkdOpenNativeQueue();
    const entries = dkdBuildNativeEntries();
    const now = Date.now();

    if (entries.length > 0) {
      dkdState.nativeEntries = entries;
      dkdState.lastNonEmptyAt = now;
      dkdState.emptyScans = 0;
      const signature = dkdEntrySignature(entries);
      if (signature !== dkdState.signature) {
        dkdState.signature = signature;
        dkdRenderEntries(entries);
      }
      dkdSetCount(entries.length, false);
      dkdState.hasRenderedOnce = true;
      return;
    }

    dkdState.emptyScans += 1;
    const keepPrevious = dkdState.nativeEntries.length > 0
      && (dkdState.emptyScans < DKD_V26_EMPTY_CONFIRMATIONS || now - dkdState.lastNonEmptyAt < 3600);
    if (keepPrevious) {
      dkdSetCount(dkdState.nativeEntries.length, true);
      return;
    }

    dkdState.nativeEntries = [];
    dkdState.signature = '';
    dkdSetCount(0, !dkdState.hasRenderedOnce && dkdState.emptyScans < DKD_V26_EMPTY_CONFIRMATIONS);
    dkdRenderEmpty(!dkdState.hasRenderedOnce && dkdState.emptyScans < DKD_V26_EMPTY_CONFIRMATIONS);
    dkdState.hasRenderedOnce = true;
  }

  function dkdScheduleScan(delay = 240) {
    window.clearTimeout(dkdState.mutationTimer);
    dkdState.mutationTimer = window.setTimeout(dkdScanQueue, delay);
  }

  function dkdActivateSimpleMode() {
    if (dkdState.isSimple || !dkdIsSimpleRequested() || !dkdIsSecuritySession()) return;
    dkdState.isSimple = true;
    dkdCreateSimpleShell();
    dkdOpenNativeQueue();
    dkdScanQueue();
    window.clearInterval(dkdState.scanTimer);
    dkdState.scanTimer = window.setInterval(dkdScanQueue, DKD_V26_SCAN_INTERVAL);
  }

  function dkdRefreshMode() {
    if (dkdIsSimpleRequested() && dkdIsSecuritySession()) dkdActivateSimpleMode();
    else if (!dkdState.isSimple) dkdEnsureModernSwitch();
  }

  function dkdObserveNativeApp() {
    const app = document.querySelector('#dkd-app');
    if (!app || dkdState.observer) return;
    dkdState.observer = new MutationObserver(() => {
      dkdReplaceVisibleVersions(app);
      dkdRefreshMode();
      if (dkdState.isSimple) dkdScheduleScan();
    });
    dkdState.observer.observe(app, { childList: true, subtree: true, characterData: true });
  }

  function dkdBoot() {
    dkdReplaceVisibleVersions();
    dkdRefreshMode();
    dkdObserveNativeApp();
    dkdHideSplash();
    document.documentElement.dataset.dkdWebVersion = DKD_V26_VERSION;
    window.dispatchEvent(new CustomEvent('dkd:v26:ready', { detail: { version: DKD_V26_VERSION } }));
  }

  const dkdReadyInterval = window.setInterval(() => {
    const app = document.querySelector('#dkd-app');
    if (!app || dkdText(app).length < 20) return;
    window.clearInterval(dkdReadyInterval);
    dkdBoot();
  }, 120);

  window.setTimeout(() => {
    window.clearInterval(dkdReadyInterval);
    dkdBoot();
  }, 9000);
})();
