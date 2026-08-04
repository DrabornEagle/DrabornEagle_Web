const DKD_V24 = {
  patchQueued: false,
  theme: '',
  securityActive: false,
  chooser: null,
  shell: null,
  sourceMap: new Map(),
  cardSignature: '',
  lastSyncAt: null,
  clockTimer: null,
  syncTimer: null,
  fallbackModal: null,
};

const DKD_V24_THEME_KEY = 'dkd_gate_security_theme';
const DKD_V24_FORCE_KEY = 'dkd_gate_force_theme';
const DKD_V24_SIMPLE_PATH = '/DraBornGate/Guvenlik-Sade-Tema/';

function dkdV24Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV24Text(dkdElement) {
  return String(dkdElement?.innerText || dkdElement?.textContent || '').replace(/\s+/g, ' ').trim();
}

function dkdV24Escape(dkdValue) {
  return String(dkdValue || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV24Root() {
  return document.querySelector('#dkd-app');
}

function dkdV24SelectorEscape(dkdValue) {
  if (globalThis.CSS?.escape) return globalThis.CSS.escape(String(dkdValue || ''));
  return String(dkdValue || '').replace(/[^a-zA-Z0-9_-]/g, (dkdCharacter) => `\\${dkdCharacter}`);
}

function dkdV24IsSimpleRoute() {
  return dkdV24Normalize(location.pathname).includes('/draborngate/guvenlik-sade-tema');
}

function dkdV24StoredTheme() {
  if (dkdV24IsSimpleRoute()) return 'simple';
  const dkdForced = sessionStorage.getItem(DKD_V24_FORCE_KEY);
  if (dkdForced === 'simple' || dkdForced === 'modern') return dkdForced;
  const dkdStored = sessionStorage.getItem(DKD_V24_THEME_KEY);
  return dkdStored === 'simple' || dkdStored === 'modern' ? dkdStored : '';
}

function dkdV24SetTheme(dkdTheme) {
  DKD_V24.theme = dkdTheme;
  sessionStorage.setItem(DKD_V24_THEME_KEY, dkdTheme);
  sessionStorage.removeItem(DKD_V24_FORCE_KEY);
}

function dkdV24PageText() {
  return dkdV24Normalize(dkdV24Root()?.innerText || '');
}

function dkdV24IsAuthScreen() {
  const dkdText = dkdV24PageText();
  const dkdHasLogin = dkdText.includes('giris yap') || dkdText.includes('oturum ac');
  const dkdHasPassword = Boolean(dkdV24Root()?.querySelector('input[type="password"]'));
  return (dkdHasLogin && dkdHasPassword)
    || dkdText.includes('draborngate agina katil')
    || dkdText.includes('premium hesabi olustur');
}

function dkdV24IsSecurityDashboard() {
  const dkdText = dkdV24PageText();
  if (!dkdText || dkdV24IsAuthScreen()) return false;
  const dkdStrongMarker = dkdText.includes('guvenlik operasyonu')
    || dkdText.includes('guvenlik merkezi')
    || dkdText.includes('guvenlik paneli');
  const dkdQueueMarker = (dkdText.includes('kapi kuyrugu') || dkdText.includes('gecis kuyrugu'))
    && (dkdText.includes('kurye') || dkdText.includes('eslestir'));
  const dkdMatchMarker = dkdText.includes('kodu eslestir')
    || dkdText.includes('kurye kodu')
    || dkdText.includes('eslestirme kodu');
  return dkdStrongMarker || dkdQueueMarker || dkdMatchMarker;
}

function dkdV24Icon(dkdName) {
  const dkdIcons = {
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4.5 6v5.2c0 4.7 3.1 8.2 7.5 9.8 4.4-1.6 7.5-5.1 7.5-9.8V6L12 3Z"></path><path d="m8.8 12.1 2.1 2.1 4.5-4.6"></path></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z"></path></svg>',
    layout: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M9 3v18M9 10h12"></path></svg>',
    courier: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16h2l2-5h7l3 5h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="18" cy="17" r="2"></circle><path d="M9 11 7.5 7H5M13 8h4l2 4"></path></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v5h-5"></path><path d="M4 18v-5h5"></path><path d="M6.1 9a7 7 0 0 1 11.8-2.2L20 11M4 13l2.1 4.2A7 7 0 0 0 17.9 15"></path></svg>',
    exit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5"></path><path d="m14 8 4 4-4 4M18 12H8"></path></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>',
    keypad: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"></rect><path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"></path></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
  };
  return dkdIcons[dkdName] || dkdIcons.shield;
}

function dkdV24ChooserMarkup() {
  return `
    <div class="dkd-v24-theme-backdrop" data-dkd-v24-chooser>
      <section class="dkd-v24-theme-panel" role="dialog" aria-modal="true" aria-labelledby="dkd-v24-theme-title">
        <div class="dkd-v24-theme-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="dkd-v24-theme-brand">
          <span>${dkdV24Icon('shield')}</span>
          <div><b>DRABORNGATE</b><small>GÜVENLİK PANELİ</small></div>
        </div>
        <div class="dkd-v24-theme-copy">
          <span class="dkd-v24-kicker">GÖRÜNÜM SEÇİMİ</span>
          <h1 id="dkd-v24-theme-title">Çalışma ekranınızı seçin</h1>
          <p>Sade Tema yalnızca gelen kurye bilgilerini ve eşleştirme kodu işlemini gösterir. Modern Tema mevcut paneli değiştirmeden açar.</p>
        </div>
        <div class="dkd-v24-theme-grid">
          <button type="button" class="dkd-v24-theme-card dkd-v24-theme-card-simple" data-dkd-v24-theme="simple">
            <span class="dkd-v24-theme-icon">${dkdV24Icon('bolt')}</span>
            <span class="dkd-v24-theme-badge">ÖNERİLEN</span>
            <strong>Sade Tema</strong>
            <em>Hızlı Kurye Eşleştirme</em>
            <p>Gelen kuryeyi görün, 6 haneli kodu girin ve tek işlemle eşleştirin.</p>
            <span class="dkd-v24-theme-action">Sade Temayı Aç <i>→</i></span>
          </button>
          <button type="button" class="dkd-v24-theme-card dkd-v24-theme-card-modern" data-dkd-v24-theme="modern">
            <span class="dkd-v24-theme-icon">${dkdV24Icon('layout')}</span>
            <span class="dkd-v24-theme-badge">TAM PANEL</span>
            <strong>Modern Tema</strong>
            <em>Mevcut Güvenlik Merkezi</em>
            <p>Tüm güvenlik araçları, raporlar ve mevcut gelişmiş panel aynı şekilde devam eder.</p>
            <span class="dkd-v24-theme-action">Modern Temayı Aç <i>→</i></span>
          </button>
        </div>
        <div class="dkd-v24-theme-note">${dkdV24Icon('info')} Tema seçimi yalnızca bu tarayıcı oturumu için geçerlidir.</div>
      </section>
    </div>`;
}

function dkdV24ShowChooser() {
  if (DKD_V24.chooser || document.querySelector('[data-dkd-v24-chooser]')) return;
  const dkdWrap = document.createElement('div');
  dkdWrap.innerHTML = dkdV24ChooserMarkup();
  DKD_V24.chooser = dkdWrap.firstElementChild;
  document.body.appendChild(DKD_V24.chooser);
  document.body.classList.add('dkd-v24-theme-choice-open');
  DKD_V24.chooser.addEventListener('click', (dkdEvent) => {
    const dkdButton = dkdEvent.target.closest('[data-dkd-v24-theme]');
    if (!dkdButton) return;
    const dkdTheme = dkdButton.dataset.dkdV24Theme;
    if (dkdTheme === 'simple') {
      sessionStorage.setItem(DKD_V24_THEME_KEY, 'simple');
      sessionStorage.setItem(DKD_V24_FORCE_KEY, 'simple');
      location.assign(DKD_V24_SIMPLE_PATH);
      return;
    }
    dkdV24SetTheme('modern');
    dkdV24RemoveChooser();
    dkdV24DeactivateSimple();
  });
}

function dkdV24RemoveChooser() {
  DKD_V24.chooser?.remove();
  DKD_V24.chooser = null;
  document.body.classList.remove('dkd-v24-theme-choice-open');
}

function dkdV24ShellMarkup() {
  return `
    <main class="dkd-v24-simple-shell" data-dkd-v24-shell>
      <div class="dkd-v24-bg-grid" aria-hidden="true"></div>
      <div class="dkd-v24-bg-orb dkd-v24-bg-orb-a" aria-hidden="true"></div>
      <div class="dkd-v24-bg-orb dkd-v24-bg-orb-b" aria-hidden="true"></div>
      <header class="dkd-v24-simple-header">
        <div class="dkd-v24-header-brand">
          <span class="dkd-v24-brand-icon">${dkdV24Icon('shield')}</span>
          <div><b>DraBornGate</b><small>GÜVENLİK • SADE TEMA</small></div>
        </div>
        <div class="dkd-v24-header-center">
          <span class="dkd-v24-live"><i></i> CANLI BAĞLANTI</span>
          <time data-dkd-v24-clock>--:--:--</time>
        </div>
        <div class="dkd-v24-header-actions">
          <button type="button" data-dkd-v24-refresh aria-label="Kuyruğu yenile">${dkdV24Icon('refresh')}<span>Yenile</span></button>
          <button type="button" data-dkd-v24-modern>${dkdV24Icon('layout')}<span>Modern Tema</span></button>
          <button type="button" class="dkd-v24-exit" data-dkd-v24-logout>${dkdV24Icon('exit')}<span>Çıkış</span></button>
        </div>
      </header>

      <section class="dkd-v24-simple-content">
        <div class="dkd-v24-hero">
          <div class="dkd-v24-hero-copy">
            <span class="dkd-v24-kicker">KURYE EŞLEŞTİRME MERKEZİ</span>
            <h1>Gelen kuryeyi doğrulayın</h1>
            <p>Kurye bilgilerini kontrol edin, size gösterilen 6 haneli eşleştirme kodunu girin ve güvenli geçiş kaydını tamamlayın.</p>
          </div>
          <div class="dkd-v24-hero-visual" aria-hidden="true">
            <span class="dkd-v24-radar"><i></i><i></i><i></i>${dkdV24Icon('courier')}</span>
          </div>
        </div>

        <div class="dkd-v24-metrics">
          <article><span>${dkdV24Icon('courier')}</span><div><small>BEKLEYEN KURYE</small><strong data-dkd-v24-count>0</strong></div></article>
          <article><span>${dkdV24Icon('shield')}</span><div><small>SİSTEM DURUMU</small><strong class="dkd-v24-status-online">Aktif</strong></div></article>
          <article><span>${dkdV24Icon('refresh')}</span><div><small>SON SENKRONİZASYON</small><strong data-dkd-v24-sync>Şimdi</strong></div></article>
        </div>

        <section class="dkd-v24-queue-section">
          <div class="dkd-v24-section-heading">
            <div><span class="dkd-v24-kicker">CANLI KAPI KUYRUĞU</span><h2>Gelen Kuryeler</h2></div>
            <span class="dkd-v24-section-pill"><i></i><b data-dkd-v24-count-label>0 bekleyen</b></span>
          </div>
          <div class="dkd-v24-courier-grid" data-dkd-v24-cards></div>
          <div class="dkd-v24-empty" data-dkd-v24-empty>
            <span>${dkdV24Icon('check')}</span>
            <h3>Bekleyen kurye bulunmuyor</h3>
            <p>Yeni bir kurye kapıya ulaştığında bilgiler bu ekranda otomatik olarak görünecek.</p>
            <div><i></i> Canlı kuyruk izleniyor</div>
          </div>
        </section>

        <aside class="dkd-v24-security-note">
          <span>${dkdV24Icon('shield')}</span>
          <div><strong>Güvenli eşleştirme</strong><p>Kodu yalnızca karşınızdaki kurye ile bilgileri kontrol ettikten sonra girin. Her işlem DraBornGate güvenlik kayıtlarına işlenir.</p></div>
        </aside>
      </section>

      <div class="dkd-v24-toast" data-dkd-v24-toast role="status" aria-live="polite"></div>
      <div class="dkd-v24-result-layer" data-dkd-v24-result hidden></div>
    </main>`;
}

function dkdV24ActivateSimple() {
  if (DKD_V24.shell) return;
  const dkdRoot = dkdV24Root();
  if (!dkdRoot) return;
  const dkdWrap = document.createElement('div');
  dkdWrap.innerHTML = dkdV24ShellMarkup();
  DKD_V24.shell = dkdWrap.firstElementChild;
  document.body.appendChild(DKD_V24.shell);
  document.body.classList.add('dkd-v24-simple-active');
  dkdRoot.classList.add('dkd-v24-source-root');
  dkdV24BindShell();
  dkdV24StartClock();
  dkdV24SyncCards(true);
}

function dkdV24DeactivateSimple() {
  DKD_V24.shell?.remove();
  DKD_V24.shell = null;
  DKD_V24.sourceMap.clear();
  DKD_V24.cardSignature = '';
  document.body.classList.remove('dkd-v24-simple-active', 'dkd-v24-native-modal-open');
  dkdV24Root()?.classList.remove('dkd-v24-source-root');
  clearInterval(DKD_V24.clockTimer);
  DKD_V24.clockTimer = null;
}

function dkdV24StartClock() {
  clearInterval(DKD_V24.clockTimer);
  const dkdTick = () => {
    const dkdClock = DKD_V24.shell?.querySelector('[data-dkd-v24-clock]');
    if (dkdClock) dkdClock.textContent = new Date().toLocaleTimeString('tr-TR');
  };
  dkdTick();
  DKD_V24.clockTimer = setInterval(dkdTick, 1000);
}

function dkdV24BindShell() {
  DKD_V24.shell?.addEventListener('click', (dkdEvent) => {
    const dkdModern = dkdEvent.target.closest('[data-dkd-v24-modern]');
    if (dkdModern) {
      dkdV24SetTheme('modern');
      location.assign('/DraBornGate/');
      return;
    }
    const dkdRefresh = dkdEvent.target.closest('[data-dkd-v24-refresh]');
    if (dkdRefresh) {
      dkdV24TriggerNativeRefresh();
      dkdV24SyncCards(true);
      dkdV24Toast('Kurye kuyruğu yenileniyor…', 'info');
      return;
    }
    const dkdLogout = dkdEvent.target.closest('[data-dkd-v24-logout]');
    if (dkdLogout) {
      dkdV24TriggerLogout();
      return;
    }
    const dkdMatch = dkdEvent.target.closest('[data-dkd-v24-match]');
    if (dkdMatch) dkdV24SubmitMatch(dkdMatch.dataset.dkdV24Match);
    const dkdResultClose = dkdEvent.target.closest('[data-dkd-v24-result-close]');
    if (dkdResultClose) dkdV24CloseResult();
  });

  DKD_V24.shell?.addEventListener('input', (dkdEvent) => {
    const dkdInput = dkdEvent.target.closest('[data-dkd-v24-code]');
    if (!dkdInput) return;
    dkdInput.value = dkdInput.value.replace(/\D/g, '').slice(0, 6);
    const dkdCard = dkdInput.closest('[data-dkd-v24-card]');
    dkdCard?.classList.toggle('dkd-v24-code-ready', dkdInput.value.length === 6);
  });

  DKD_V24.shell?.addEventListener('keydown', (dkdEvent) => {
    const dkdInput = dkdEvent.target.closest('[data-dkd-v24-code]');
    if (dkdInput && dkdEvent.key === 'Enter') {
      dkdEvent.preventDefault();
      dkdV24SubmitMatch(dkdInput.dataset.dkdV24Code);
    }
  });
}

function dkdV24ActionLabel(dkdElement) {
  return dkdV24Normalize(dkdElement?.value || dkdV24Text(dkdElement));
}

function dkdV24IsMatchAction(dkdElement) {
  const dkdLabel = dkdV24ActionLabel(dkdElement);
  return dkdLabel.includes('kodu eslestir')
    || dkdLabel.includes('kod eslestir')
    || dkdLabel === 'eslestir'
    || dkdLabel.includes('eslestirme yap')
    || dkdLabel.includes('kurye kodunu dogrula');
}

function dkdV24FindCard(dkdButton) {
  let dkdCurrent = dkdButton;
  let dkdFallback = null;
  for (let dkdDepth = 0; dkdDepth < 9 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
    const dkdText = dkdV24Normalize(dkdV24Text(dkdCurrent));
    const dkdRect = dkdCurrent.getBoundingClientRect();
    const dkdLooksLikeCourier = /(kurye|siparis|plaka|gecis|musteri|platform)/.test(dkdText);
    const dkdReasonable = dkdRect.width > 220 && dkdRect.height >= 100 && dkdRect.height <= 720 && dkdText.length < 1500;
    if (dkdLooksLikeCourier && dkdReasonable) {
      dkdFallback = dkdCurrent;
      if (/(card|pass|queue|item|panel|row)/i.test(String(dkdCurrent.className || ''))) return dkdCurrent;
    }
    dkdCurrent = dkdCurrent.parentElement;
  }
  return dkdFallback || dkdButton.parentElement;
}

function dkdV24SourceCards() {
  const dkdRoot = dkdV24Root();
  if (!dkdRoot) return [];
  const dkdButtons = Array.from(dkdRoot.querySelectorAll('button,[role="button"],input[type="submit"]'))
    .filter(dkdV24IsMatchAction);
  const dkdSeen = new Set();
  const dkdSources = [];
  dkdButtons.forEach((dkdButton, dkdIndex) => {
    const dkdCard = dkdV24FindCard(dkdButton);
    if (!dkdCard || dkdSeen.has(dkdCard)) return;
    dkdSeen.add(dkdCard);
    const dkdId = dkdButton.dataset.dkdV24SourceId || `dkd-v24-source-${Date.now()}-${dkdIndex}`;
    dkdButton.dataset.dkdV24SourceId = dkdId;
    dkdSources.push({ id: dkdId, button: dkdButton, card: dkdCard });
  });
  return dkdSources;
}

function dkdV24Lines(dkdCard, dkdButton) {
  const dkdRemove = new Set([
    'kodu eşleştir', 'kod eşleştir', 'eşleştir', 'eşleştirme yap', 'detay', 'incele',
    'onayla', 'reddet', 'girişi tamamla', 'daha fazla', 'canlı',
  ].map(dkdV24Normalize));
  const dkdLines = String(dkdCard?.innerText || '')
    .split(/\n+/)
    .map((dkdLine) => dkdLine.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((dkdLine) => !dkdRemove.has(dkdV24Normalize(dkdLine)))
    .filter((dkdLine) => dkdV24Normalize(dkdLine) !== dkdV24ActionLabel(dkdButton));
  return dkdLines.filter((dkdLine, dkdIndex) => dkdLines.indexOf(dkdLine) === dkdIndex).slice(0, 14);
}

function dkdV24TitleFromLines(dkdLines) {
  const dkdIgnored = /(bekleyen|kod hazir|gecis kodu|kurye|canli|onay bekliyor|kapida)/;
  return dkdLines.find((dkdLine) => {
    const dkdNormalized = dkdV24Normalize(dkdLine);
    return dkdLine.length >= 3 && dkdLine.length <= 70 && !dkdIgnored.test(dkdNormalized);
  }) || dkdLines[0] || 'Gelen Kurye';
}

function dkdV24CardMarkup(dkdSource, dkdIndex) {
  const dkdLines = dkdV24Lines(dkdSource.card, dkdSource.button);
  const dkdTitle = dkdV24TitleFromLines(dkdLines);
  const dkdDetails = dkdLines.filter((dkdLine) => dkdLine !== dkdTitle).slice(0, 8);
  const dkdDetailMarkup = dkdDetails.length
    ? dkdDetails.map((dkdLine, dkdDetailIndex) => `<div class="dkd-v24-detail"><span>${dkdDetailIndex + 1}</span><p>${dkdV24Escape(dkdLine)}</p></div>`).join('')
    : '<div class="dkd-v24-detail"><span>•</span><p>Kurye bilgileri güvenlik kaydından alınıyor.</p></div>';
  return `
    <article class="dkd-v24-courier-card" data-dkd-v24-card="${dkdV24Escape(dkdSource.id)}" style="--dkd-v24-delay:${dkdIndex * 70}ms">
      <div class="dkd-v24-card-scan" aria-hidden="true"></div>
      <div class="dkd-v24-card-top">
        <span class="dkd-v24-courier-avatar">${dkdV24Icon('courier')}<i></i></span>
        <div class="dkd-v24-courier-title"><small>GELEN KURYE</small><h3>${dkdV24Escape(dkdTitle)}</h3><span><i></i> Kapıda • Eşleştirme bekleniyor</span></div>
        <span class="dkd-v24-card-number">#${String(dkdIndex + 1).padStart(2, '0')}</span>
      </div>
      <div class="dkd-v24-detail-grid">${dkdDetailMarkup}</div>
      <div class="dkd-v24-match-box">
        <div class="dkd-v24-match-copy"><span>${dkdV24Icon('keypad')}</span><div><strong>Eşleştirme Kodu</strong><p>Kuryenin ekranındaki 6 haneli kodu girin</p></div></div>
        <div class="dkd-v24-code-row">
          <input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="••••••" aria-label="6 haneli eşleştirme kodu" data-dkd-v24-code="${dkdV24Escape(dkdSource.id)}">
          <button type="button" data-dkd-v24-match="${dkdV24Escape(dkdSource.id)}">${dkdV24Icon('check')}<span>Eşleştir</span></button>
        </div>
        <div class="dkd-v24-match-status" data-dkd-v24-card-status></div>
      </div>
    </article>`;
}

function dkdV24SyncCards(dkdForce = false) {
  if (!DKD_V24.shell || DKD_V24.theme !== 'simple') return;
  const dkdSources = dkdV24SourceCards();
  const dkdSignature = dkdSources.map((dkdSource) => `${dkdSource.id}:${dkdV24Text(dkdSource.card)}`).join('|');
  DKD_V24.sourceMap = new Map(dkdSources.map((dkdSource) => [dkdSource.id, dkdSource]));
  DKD_V24.lastSyncAt = new Date();
  dkdV24UpdateMetrics(dkdSources.length);
  if (!dkdForce && dkdSignature === DKD_V24.cardSignature) return;
  DKD_V24.cardSignature = dkdSignature;
  const dkdCards = DKD_V24.shell.querySelector('[data-dkd-v24-cards]');
  const dkdEmpty = DKD_V24.shell.querySelector('[data-dkd-v24-empty]');
  if (!dkdCards || !dkdEmpty) return;
  dkdCards.innerHTML = dkdSources.map(dkdV24CardMarkup).join('');
  dkdEmpty.hidden = dkdSources.length > 0;
  dkdCards.hidden = dkdSources.length === 0;
}

function dkdV24UpdateMetrics(dkdCount) {
  DKD_V24.shell?.querySelectorAll('[data-dkd-v24-count]').forEach((dkdElement) => { dkdElement.textContent = String(dkdCount); });
  const dkdCountLabel = DKD_V24.shell?.querySelector('[data-dkd-v24-count-label]');
  if (dkdCountLabel) dkdCountLabel.textContent = `${dkdCount} bekleyen`;
  const dkdSync = DKD_V24.shell?.querySelector('[data-dkd-v24-sync]');
  if (dkdSync) dkdSync.textContent = DKD_V24.lastSyncAt?.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) || 'Şimdi';
}

function dkdV24NativeValue(dkdInput, dkdValue) {
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdInput, dkdValue);
  else dkdInput.value = dkdValue;
  dkdInput.dispatchEvent(new Event('input', { bubbles: true }));
  dkdInput.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV24VisibleInputs() {
  const dkdRoot = dkdV24Root();
  return Array.from(dkdRoot?.querySelectorAll('input') || []).filter((dkdInput) => {
    const dkdType = String(dkdInput.type || '').toLowerCase();
    if (['hidden', 'email', 'password', 'search'].includes(dkdType)) return false;
    const dkdMeta = dkdV24Normalize(`${dkdInput.placeholder} ${dkdInput.getAttribute('aria-label')} ${dkdInput.name}`);
    return dkdInput.maxLength === 6
      || dkdInput.getAttribute('inputmode') === 'numeric'
      || dkdMeta.includes('kod');
  });
}

function dkdV24DialogScope(dkdInput) {
  let dkdCurrent = dkdInput;
  for (let dkdDepth = 0; dkdDepth < 9 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
    const dkdRole = dkdCurrent.getAttribute?.('role');
    const dkdClass = String(dkdCurrent.className || '');
    const dkdPosition = getComputedStyle(dkdCurrent).position;
    if (dkdRole === 'dialog' || /(modal|dialog|overlay|sheet)/i.test(dkdClass) || dkdPosition === 'fixed') return dkdCurrent;
    dkdCurrent = dkdCurrent.parentElement;
  }
  return dkdInput.parentElement;
}

function dkdV24ConfirmButton(dkdScope) {
  return Array.from((dkdScope || dkdV24Root())?.querySelectorAll('button,[role="button"],input[type="submit"]') || [])
    .find((dkdButton) => {
      const dkdLabel = dkdV24ActionLabel(dkdButton);
      return /(eslestir|dogrula|onayla|tamamla)/.test(dkdLabel) && !/(iptal|vazgec|kapat)/.test(dkdLabel);
    });
}

function dkdV24CardStatus(dkdId, dkdMessage, dkdState = 'info') {
  const dkdCard = DKD_V24.shell?.querySelector(`[data-dkd-v24-card="${dkdV24SelectorEscape(dkdId)}"]`);
  const dkdStatus = dkdCard?.querySelector('[data-dkd-v24-card-status]');
  if (!dkdStatus) return;
  dkdStatus.className = `dkd-v24-match-status dkd-v24-match-status-${dkdState}`;
  dkdStatus.textContent = dkdMessage;
}

async function dkdV24SubmitMatch(dkdId) {
  const dkdSource = DKD_V24.sourceMap.get(dkdId);
  const dkdCard = DKD_V24.shell?.querySelector(`[data-dkd-v24-card="${dkdV24SelectorEscape(dkdId)}"]`);
  const dkdInput = dkdCard?.querySelector('[data-dkd-v24-code]');
  const dkdCode = String(dkdInput?.value || '').replace(/\D/g, '');
  if (!dkdSource || !dkdInput) {
    dkdV24Toast('Kurye kaydı yenilendi. Liste tekrar eşitleniyor.', 'warning');
    dkdV24SyncCards(true);
    return;
  }
  if (dkdCode.length !== 6) {
    dkdInput.focus();
    dkdCard.classList.remove('dkd-v24-shake');
    requestAnimationFrame(() => dkdCard.classList.add('dkd-v24-shake'));
    dkdV24CardStatus(dkdId, 'Lütfen 6 haneli kodu eksiksiz girin.', 'error');
    return;
  }

  const dkdSubmit = dkdCard.querySelector('[data-dkd-v24-match]');
  dkdSubmit.disabled = true;
  dkdSubmit.classList.add('dkd-v24-button-loading');
  dkdV24CardStatus(dkdId, 'Kod güvenli sistemde doğrulanıyor…', 'info');

  try {
    dkdSource.button.click();
    const dkdNativeInput = await dkdV24WaitForNativeInput(1500);
    if (!dkdNativeInput) {
      dkdV24RevealNativeMatchDialog();
      dkdV24CardStatus(dkdId, 'Doğrulama penceresi açıldı. Kodu pencerede tamamlayın.', 'warning');
      return;
    }
    dkdV24NativeValue(dkdNativeInput, dkdCode);
    const dkdScope = dkdV24DialogScope(dkdNativeInput);
    const dkdConfirm = dkdV24ConfirmButton(dkdScope);
    if (!dkdConfirm) {
      dkdV24RevealNativeMatchDialog(dkdScope);
      dkdV24CardStatus(dkdId, 'Kod aktarıldı. Açılan pencereden işlemi onaylayın.', 'warning');
      return;
    }
    dkdConfirm.click();
    const dkdSucceeded = await dkdV24WaitForResult(dkdId, 4800);
    if (dkdSucceeded) {
      dkdV24ShowResult(dkdV24TitleFromLines(dkdV24Lines(dkdSource.card, dkdSource.button)));
      dkdV24CardStatus(dkdId, 'Eşleştirme başarıyla tamamlandı.', 'success');
      setTimeout(() => dkdV24SyncCards(true), 700);
    } else {
      dkdV24CardStatus(dkdId, 'İşlem gönderildi. Sonuç panelden takip ediliyor.', 'info');
      dkdV24Toast('Eşleştirme isteği güvenlik sistemine gönderildi.', 'info');
    }
  } catch (dkdError) {
    console.error(dkdError);
    dkdV24CardStatus(dkdId, 'Eşleştirme başlatılamadı. Lütfen tekrar deneyin.', 'error');
  } finally {
    dkdSubmit.disabled = false;
    dkdSubmit.classList.remove('dkd-v24-button-loading');
  }
}

function dkdV24WaitForNativeInput(dkdTimeout) {
  return new Promise((dkdResolve) => {
    const dkdStarted = Date.now();
    const dkdCheck = () => {
      const dkdInput = dkdV24VisibleInputs().at(-1);
      if (dkdInput) return dkdResolve(dkdInput);
      if (Date.now() - dkdStarted >= dkdTimeout) return dkdResolve(null);
      setTimeout(dkdCheck, 70);
    };
    dkdCheck();
  });
}

function dkdV24WaitForResult(dkdId, dkdTimeout) {
  const dkdOriginal = DKD_V24.sourceMap.get(dkdId)?.button;
  return new Promise((dkdResolve) => {
    const dkdStarted = Date.now();
    const dkdCheck = () => {
      const dkdText = dkdV24PageText();
      const dkdSuccess = dkdText.includes('eslesme gerceklesti')
        || dkdText.includes('eslestirme basarili')
        || dkdText.includes('basariyla eslestirildi')
        || !dkdOriginal?.isConnected;
      if (dkdSuccess) return dkdResolve(true);
      if (Date.now() - dkdStarted >= dkdTimeout) return dkdResolve(false);
      setTimeout(dkdCheck, 120);
    };
    dkdCheck();
  });
}

function dkdV24RevealNativeMatchDialog(dkdScope) {
  const dkdInput = dkdV24VisibleInputs().at(-1);
  const dkdModal = dkdScope || (dkdInput ? dkdV24DialogScope(dkdInput) : null);
  if (!dkdModal) {
    dkdV24Toast('Doğrulama penceresi bulunamadı. Modern temaya geçerek işlemi tamamlayın.', 'warning');
    return;
  }
  DKD_V24.fallbackModal?.classList.remove('dkd-v24-native-modal');
  DKD_V24.fallbackModal = dkdModal;
  dkdModal.classList.add('dkd-v24-native-modal');
  document.body.classList.add('dkd-v24-native-modal-open');
  const dkdClose = () => {
    document.body.classList.remove('dkd-v24-native-modal-open');
    dkdModal.classList.remove('dkd-v24-native-modal');
    DKD_V24.fallbackModal = null;
    setTimeout(() => dkdV24SyncCards(true), 200);
  };
  dkdModal.addEventListener('click', (dkdEvent) => {
    const dkdAction = dkdEvent.target.closest('button,[role="button"]');
    const dkdLabel = dkdV24ActionLabel(dkdAction);
    if (/(iptal|vazgec|kapat|tamam|eslestir|onayla|dogrula)/.test(dkdLabel)) setTimeout(dkdClose, 180);
  }, { once: true });
}

function dkdV24ShowResult(dkdCourierName) {
  const dkdLayer = DKD_V24.shell?.querySelector('[data-dkd-v24-result]');
  if (!dkdLayer) return;
  dkdLayer.hidden = false;
  dkdLayer.innerHTML = `
    <section class="dkd-v24-result-card" role="dialog" aria-modal="true">
      <span class="dkd-v24-result-icon">${dkdV24Icon('check')}<i></i></span>
      <small>EŞLEŞME GERÇEKLEŞTİ</small>
      <h2>Kurye doğrulandı</h2>
      <p><b>${dkdV24Escape(dkdCourierName || 'Kurye')}</b> için eşleştirme işlemi başarıyla tamamlandı ve güvenlik kaydı güncellendi.</p>
      <button type="button" data-dkd-v24-result-close>Tamam</button>
    </section>`;
}

function dkdV24CloseResult() {
  const dkdLayer = DKD_V24.shell?.querySelector('[data-dkd-v24-result]');
  if (!dkdLayer) return;
  dkdLayer.hidden = true;
  dkdLayer.innerHTML = '';
  dkdV24SyncCards(true);
}

function dkdV24Toast(dkdMessage, dkdType = 'info') {
  const dkdToast = DKD_V24.shell?.querySelector('[data-dkd-v24-toast]');
  if (!dkdToast) return;
  dkdToast.className = `dkd-v24-toast dkd-v24-toast-${dkdType} dkd-v24-toast-show`;
  dkdToast.textContent = dkdMessage;
  clearTimeout(dkdToast._dkdV24Timer);
  dkdToast._dkdV24Timer = setTimeout(() => dkdToast.classList.remove('dkd-v24-toast-show'), 3200);
}

function dkdV24TriggerNativeRefresh() {
  const dkdRoot = dkdV24Root();
  const dkdButton = Array.from(dkdRoot?.querySelectorAll('button,[role="button"]') || [])
    .find((dkdItem) => /(yenile|refresh)/.test(dkdV24ActionLabel(dkdItem)));
  dkdButton?.click();
}

function dkdV24TriggerLogout() {
  const dkdRoot = dkdV24Root();
  const dkdButton = Array.from(dkdRoot?.querySelectorAll('button,[role="button"],a') || [])
    .find((dkdItem) => /(cikis yap|oturumu kapat|guvenli cikis)/.test(dkdV24ActionLabel(dkdItem)));
  sessionStorage.removeItem(DKD_V24_THEME_KEY);
  sessionStorage.removeItem(DKD_V24_FORCE_KEY);
  if (dkdButton) dkdButton.click();
  else location.assign('/DraBornGate/');
}

function dkdV24HandleAuthReset() {
  if (!dkdV24IsAuthScreen()) return;
  if (!dkdV24IsSimpleRoute()) {
    sessionStorage.removeItem(DKD_V24_THEME_KEY);
    sessionStorage.removeItem(DKD_V24_FORCE_KEY);
    DKD_V24.theme = '';
  }
  dkdV24RemoveChooser();
  dkdV24DeactivateSimple();
}

function dkdV24Patch() {
  DKD_V24.patchQueued = false;
  if (dkdV24IsAuthScreen()) {
    dkdV24HandleAuthReset();
    return;
  }

  const dkdSecurity = dkdV24IsSecurityDashboard();
  DKD_V24.securityActive = dkdSecurity;
  if (!dkdSecurity) {
    dkdV24RemoveChooser();
    dkdV24DeactivateSimple();
    return;
  }

  DKD_V24.theme = dkdV24StoredTheme();
  if (!DKD_V24.theme) {
    dkdV24DeactivateSimple();
    dkdV24ShowChooser();
    return;
  }

  dkdV24RemoveChooser();
  if (DKD_V24.theme === 'simple') {
    dkdV24ActivateSimple();
    clearTimeout(DKD_V24.syncTimer);
    DKD_V24.syncTimer = setTimeout(() => dkdV24SyncCards(), 90);
  } else {
    dkdV24DeactivateSimple();
    if (dkdV24IsSimpleRoute()) location.replace('/DraBornGate/');
  }
}

function dkdV24QueuePatch() {
  if (DKD_V24.patchQueued) return;
  DKD_V24.patchQueued = true;
  requestAnimationFrame(dkdV24Patch);
}

const dkdV24Observer = new MutationObserver(dkdV24QueuePatch);
dkdV24Observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener('popstate', dkdV24QueuePatch);
window.addEventListener('hashchange', dkdV24QueuePatch);
window.addEventListener('pageshow', dkdV24QueuePatch);
document.addEventListener('click', () => {
  setTimeout(dkdV24QueuePatch, 80);
  setTimeout(dkdV24QueuePatch, 350);
}, true);

document.documentElement.dataset.dkdWebVersion = '2.4.0';
dkdV24QueuePatch();
