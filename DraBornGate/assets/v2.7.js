const DKD_V27_VERSION = '2.7.0';
const DKD_V27_ROOT_ID = 'dkd-v27-root';
const DKD_V27_SIMPLE_PATH = '/DraBornGate/Guvenlik-Sade-Tema/';
const DKD_V27_THEME_KEY = 'dkd_gate_security_theme';
const DKD_V27_FORCE_KEY = 'dkd_gate_force_theme';
const DKD_V27_BANNED_ANCESTOR = '#dkd-v27-root,[class*="dkd-v24-simple"],[class*="dkd-v25-simple"],[class*="dkd-v26-simple"],[data-dkd-v24-theme="simple"],[data-dkd-v25-theme="simple"],[data-dkd-v26-theme="simple"]';

const dkdV27State = {
  mounted: false,
  initialized: false,
  missCycles: 0,
  sources: [],
  sourceIds: new WeakMap(),
  nextSourceId: 1,
  lastSignature: '',
  lastSync: new Date(),
  busySourceId: null,
  statusBySource: new Map(),
};

function dkdV27Normalize(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV27IsSimpleRequested() {
  const path = dkdV27Normalize(location.pathname);
  return path.includes('guvenlik sade tema') ||
    sessionStorage.getItem(DKD_V27_THEME_KEY) === 'simple' ||
    sessionStorage.getItem(DKD_V27_FORCE_KEY) === 'simple';
}

function dkdV27ReplaceVisibleVersionText(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const current = node.nodeValue || '';
    if (!/v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d)?|6(?:\.0)?)/i.test(current)) continue;
    node.nodeValue = current
      .replace(/DraBornGate Web v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d)?|6(?:\.0)?)/gi, `DraBornGate Web v${DKD_V27_VERSION}`)
      .replace(/WEB v2\.(?:3(?:\.0)?|4(?:\.0)?|5(?:\.\d)?|6(?:\.0)?)/gi, `WEB v${DKD_V27_VERSION}`);
  }
}

function dkdV27RenameModernSwitch(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const normalized = dkdV27Normalize(node.nodeValue);
    if (normalized === 'sade temaya gec' || normalized === 'modern temadan sade temaya gec') {
      node.nodeValue = 'Modern Temadan Sade Temaya Geçiş';
    }
  }
}

function dkdV27HasSecuritySession() {
  const app = document.querySelector('#dkd-app');
  if (!app) return false;
  const text = dkdV27Normalize(app.textContent);
  const securitySignal = text.includes('guvenlik') && (
    text.includes('cikis yap') ||
    text.includes('guvenlik merkezi') ||
    text.includes('kurye kuyrugu') ||
    text.includes('kurye kodu dogrula')
  );
  return securitySignal;
}

function dkdV27Icon(name, className = '') {
  const common = `class="${className}" viewBox="0 0 24 24" fill="none" aria-hidden="true"`;
  const icons = {
    shield: `<svg ${common}><path d="M12 3 20 6v5c0 5.2-3.3 8.7-8 10-4.7-1.3-8-4.8-8-10V6l8-3Z" stroke="currentColor" stroke-width="1.8"/><path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    layout: `<svg ${common}><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M9 4v16M9 10h12" stroke="currentColor" stroke-width="1.8"/></svg>`,
    exit: `<svg ${common}><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sync: `<svg ${common}><path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.2 12a6.5 6.5 0 0 0-11-4.5L4 10m16 4-3.2 2.5A6.5 6.5 0 0 1 5.8 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    courier: `<svg ${common}><path d="M4 16h2l2-6h7l2 6h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 10 6.5 7H4M15 10h3l2 3v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="1.8"/></svg>`,
    key: `<svg ${common}><circle cx="8" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="m11 9 8-4M15 7l2 3M17 6l2 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    check: `<svg ${common}><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return icons[name] || '';
}

function dkdV27RootTemplate() {
  return `
    <div class="dkd-v27-bg" aria-hidden="true"><i></i><i></i><i></i></div>
    <header class="dkd-v27-header">
      <div class="dkd-v27-brand">
        <div class="dkd-v27-brand-mark">${dkdV27Icon('shield')}</div>
        <div><strong>DraBornGate</strong><span>Güvenlik Sade Tema · Web v${DKD_V27_VERSION}</span></div>
      </div>
      <div class="dkd-v27-header-actions">
        <button type="button" id="dkd-v27-modern" aria-label="Modern temaya geç">${dkdV27Icon('layout')}<span>Modern Tema</span></button>
        <button type="button" id="dkd-v27-exit" class="danger" aria-label="Çıkış yap">${dkdV27Icon('exit')}</button>
      </div>
    </header>
    <main class="dkd-v27-main">
      <section class="dkd-v27-hero">
        <div class="dkd-v27-hero-copy">
          <span class="dkd-v27-eyebrow"><i></i> CANLI KAPI OPERASYONU</span>
          <h1>Gelen kuryeyi<br><em>hızlı ve güvenli</em> eşleştirin</h1>
          <p>Kurye bilgilerini kontrol edin, karşı tarafın gösterdiği 6 haneli kodu girin ve geçiş kaydını tek işlemle tamamlayın.</p>
        </div>
        <div class="dkd-v27-radar" aria-hidden="true">
          <span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span>
          <span class="sweep"></span><span class="core">${dkdV27Icon('shield')}</span>
        </div>
      </section>

      <section class="dkd-v27-stats" aria-label="Sistem durumu">
        <article><div class="icon cyan">${dkdV27Icon('courier')}</div><div><span>BEKLEYEN KURYE</span><strong id="dkd-v27-count">—</strong></div></article>
        <article><div class="icon green">${dkdV27Icon('shield')}</div><div><span>SİSTEM DURUMU</span><strong class="green-text">Aktif</strong></div></article>
        <article><div class="icon violet">${dkdV27Icon('sync')}</div><div><span>SON SENKRONİZASYON</span><strong id="dkd-v27-time">--:--</strong></div></article>
      </section>

      <section class="dkd-v27-queue">
        <div class="dkd-v27-section-head">
          <div><span>CANLI KAPI KUYRUĞU</span><h2>Gelen Kuryeler</h2></div>
          <div class="dkd-v27-live-pill"><i></i><b id="dkd-v27-pill">Kuyruk hazırlanıyor</b></div>
        </div>
        <div id="dkd-v27-cards" class="dkd-v27-cards" aria-live="polite"></div>
      </section>

      <section class="dkd-v27-safety">
        <div>${dkdV27Icon('shield')}</div>
        <p><strong>Güvenli eşleştirme</strong><span>Kodu yalnızca karşınızdaki kurye bilgilerini kontrol ettikten sonra girin. Her işlem güvenlik kayıtlarına işlenir.</span></p>
      </section>
    </main>`;
}

function dkdV27Mount() {
  if (dkdV27State.mounted) return;
  const root = document.createElement('div');
  root.id = DKD_V27_ROOT_ID;
  root.innerHTML = dkdV27RootTemplate();
  document.body.appendChild(root);
  document.body.classList.add('dkd-v27-simple-active');
  document.documentElement.dataset.dkdV27Simple = 'true';
  document.querySelector('#dkd-v27-splash')?.remove();
  document.querySelector('#dkd-v26-splash')?.remove();
  document.querySelector('#dkd-v27-modern')?.addEventListener('click', dkdV27GoModern);
  document.querySelector('#dkd-v27-exit')?.addEventListener('click', dkdV27Logout);
  dkdV27State.mounted = true;
  dkdV27Render();
}

function dkdV27GoModern() {
  sessionStorage.setItem(DKD_V27_THEME_KEY, 'modern');
  sessionStorage.removeItem(DKD_V27_FORCE_KEY);
  location.assign('/DraBornGate/');
}

function dkdV27Logout() {
  const clickables = [...document.querySelectorAll('button,a,[role="button"]')]
    .filter((element) => !element.closest(`#${DKD_V27_ROOT_ID}`));
  const target = clickables.find((element) => /cikis yap|cikis|logout/.test(dkdV27Normalize(element.textContent || element.getAttribute('aria-label'))));
  if (target) {
    target.click();
    return;
  }
  sessionStorage.removeItem(DKD_V27_THEME_KEY);
  sessionStorage.removeItem(DKD_V27_FORCE_KEY);
  location.assign('/DraBornGate/');
}

function dkdV27OpenNativeQueue() {
  const clickables = [...document.querySelectorAll('button,a,[role="button"]')]
    .filter((element) => !element.closest(`#${DKD_V27_ROOT_ID}`) && !element.closest(DKD_V27_BANNED_ANCESTOR));
  const preferred = clickables.find((element) => {
    const text = dkdV27Normalize(element.textContent || element.getAttribute('aria-label'));
    return text.includes('kurye kodu dogrula') || text === 'kurye kuyrugu' || text.includes('gecis talepleri');
  });
  preferred?.click();
}

function dkdV27FindSubmit(input) {
  let node = input.parentElement;
  for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
    const buttons = [...node.querySelectorAll('button,[role="button"],input[type="submit"]')]
      .filter((button) => !button.closest(`#${DKD_V27_ROOT_ID}`) && !button.closest(DKD_V27_BANNED_ANCESTOR));
    const submit = buttons.find((button) => /kodu eslestir|eslestir|dogrula|onayla/.test(dkdV27Normalize(button.textContent || button.value || button.getAttribute('aria-label'))));
    if (submit) return { button: submit, container: node };
  }
  return null;
}

function dkdV27IsNativeCodeInput(input) {
  if (!(input instanceof HTMLInputElement)) return false;
  if (input.closest(`#${DKD_V27_ROOT_ID}`) || input.closest(DKD_V27_BANNED_ANCESTOR)) return false;
  const type = String(input.type || 'text').toLowerCase();
  if (!['text', 'tel', 'number', 'password'].includes(type)) return false;
  const clue = dkdV27Normalize([
    input.placeholder,
    input.getAttribute('aria-label'),
    input.name,
    input.id,
    input.parentElement?.textContent?.slice(0, 260),
  ].join(' '));
  const sixDigit = input.maxLength === 6 || input.getAttribute('maxlength') === '6';
  return sixDigit || (clue.includes('kod') && (clue.includes('6 haneli') || clue.includes('eslestirme')));
}

function dkdV27CleanLines(container) {
  const raw = String(container?.innerText || container?.textContent || '')
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const banned = [
    'draborngate', 'web v', 'premium', 'guvenlik', 'premium menu', 'guvenlik merkezi',
    'kurye kuyrugu', '6 haneli eslestirme kodu', 'kodu eslestir', 'kurye bilgilerini kontrol',
    'canli gecis talebi', 'bekliyor', 'aktif', 'sistem durumu', 'son senkronizasyon',
  ];
  return [...new Set(raw.filter((line) => {
    const normalized = dkdV27Normalize(line);
    if (line.length < 3 || line.length > 72) return false;
    if (/^[0-9]+$/.test(normalized) || /^[a-z]$/.test(normalized)) return false;
    if (line.includes('@') || /v\d/i.test(line)) return false;
    return !banned.some((item) => normalized === item || normalized.includes(item));
  }))];
}

function dkdV27ExtractDetails(container, index) {
  const text = String(container?.innerText || container?.textContent || '');
  const lines = dkdV27CleanLines(container);
  const plate = text.toUpperCase().match(/\b\d{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?\d{2,4}\b/)?.[0] || '';
  const destination = lines.find((line) => /\b(blok|daire|site|kap[iı]|giris|giriş)\b/i.test(line)) || '';
  const name = lines.find((line) => {
    if (line === destination || line === plate) return false;
    const words = line.split(/\s+/).filter(Boolean);
    return words.length >= 2 && words.length <= 5 && /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(line);
  }) || '';
  const company = lines.find((line) => line !== name && line !== destination && line !== plate && /kurye|teslimat|kargo/i.test(line)) || '';
  return {
    title: name || `Kurye Talebi ${index + 1}`,
    subtitle: company || 'Kapıda doğrulama bekleniyor',
    plate: plate || 'Bilgi bekleniyor',
    destination: destination || 'Güvenlik kapısı',
  };
}

function dkdV27SourceId(input) {
  if (!dkdV27State.sourceIds.has(input)) {
    dkdV27State.sourceIds.set(input, dkdV27State.nextSourceId++);
  }
  return dkdV27State.sourceIds.get(input);
}

function dkdV27ScanSources() {
  const inputs = [...document.querySelectorAll('input')].filter(dkdV27IsNativeCodeInput);
  const unique = [];
  const seenInputs = new Set();
  for (const input of inputs) {
    if (seenInputs.has(input)) continue;
    const found = dkdV27FindSubmit(input);
    if (!found) continue;
    seenInputs.add(input);
    unique.push({
      id: dkdV27SourceId(input),
      input,
      button: found.button,
      container: found.container,
      details: dkdV27ExtractDetails(found.container, unique.length),
    });
  }

  if (unique.length > 0) {
    dkdV27State.sources = unique;
    dkdV27State.missCycles = 0;
    dkdV27State.initialized = true;
  } else if (dkdV27State.sources.length > 0) {
    dkdV27State.missCycles += 1;
    if (dkdV27State.missCycles >= 6) {
      dkdV27State.sources = [];
      dkdV27State.missCycles = 0;
    }
  } else if (!dkdV27State.initialized) {
    dkdV27State.missCycles += 1;
    if (dkdV27State.missCycles >= 6) {
      dkdV27State.initialized = true;
      dkdV27State.missCycles = 0;
    }
  }

  dkdV27State.lastSync = new Date();
  dkdV27Render();
}

function dkdV27SetNativeValue(input, value) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function dkdV27Submit(sourceId, value) {
  const source = dkdV27State.sources.find((item) => item.id === sourceId);
  const clean = String(value || '').replace(/\D/g, '').slice(0, 6);
  if (!source) return;
  if (clean.length !== 6) {
    dkdV27State.statusBySource.set(sourceId, { type: 'error', text: 'Lütfen 6 haneli eşleştirme kodunu eksiksiz girin.' });
    dkdV27Render();
    return;
  }
  dkdV27State.busySourceId = sourceId;
  dkdV27State.statusBySource.set(sourceId, { type: 'loading', text: 'Kod güvenli sistemde doğrulanıyor…' });
  dkdV27Render();
  dkdV27SetNativeValue(source.input, clean);
  await new Promise((resolve) => setTimeout(resolve, 120));
  source.button.click();
  setTimeout(() => {
    dkdV27State.busySourceId = null;
    dkdV27State.statusBySource.set(sourceId, { type: 'success', text: 'İşlem gönderildi. Güvenlik kaydı kontrol ediliyor.' });
    dkdV27Render();
    setTimeout(dkdV27ScanSources, 600);
  }, 650);
}

function dkdV27CardTemplate(source, index) {
  const status = dkdV27State.statusBySource.get(source.id);
  const busy = dkdV27State.busySourceId === source.id;
  return `
    <article class="dkd-v27-request-card" data-source-id="${source.id}">
      <div class="dkd-v27-card-glow" aria-hidden="true"></div>
      <div class="dkd-v27-request-head">
        <div class="dkd-v27-request-icon">${dkdV27Icon('courier')}</div>
        <div class="dkd-v27-request-title"><span>CANLI GEÇİŞ TALEBİ</span><h3>${source.details.title}</h3><p>${source.details.subtitle}</p></div>
        <div class="dkd-v27-waiting"><i></i>BEKLİYOR</div>
      </div>
      <div class="dkd-v27-info-grid">
        <div><span>PLAKA / KAYIT</span><strong>${source.details.plate}</strong></div>
        <div><span>HEDEF NOKTA</span><strong>${source.details.destination}</strong></div>
        <div><span>TALEP SIRASI</span><strong>#${String(index + 1).padStart(2, '0')}</strong></div>
      </div>
      <div class="dkd-v27-code-panel">
        <div class="dkd-v27-code-copy">${dkdV27Icon('key')}<div><strong>6 Haneli Eşleştirme Kodu</strong><span>Kuryenin ekranındaki kodu girin</span></div></div>
        <div class="dkd-v27-code-row">
          <input inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="6 haneli eşleştirme kodu" placeholder="• • • • • •" ${busy ? 'disabled' : ''}>
          <button type="button" ${busy ? 'disabled' : ''}>${busy ? dkdV27Icon('sync') : dkdV27Icon('check')}<span>${busy ? 'Doğrulanıyor' : 'Kodu Eşleştir'}</span></button>
        </div>
        ${status ? `<div class="dkd-v27-feedback ${status.type}">${status.type === 'success' ? dkdV27Icon('check') : status.type === 'loading' ? dkdV27Icon('sync') : ''}<span>${status.text}</span></div>` : ''}
      </div>
    </article>`;
}

function dkdV27EmptyTemplate() {
  if (!dkdV27State.initialized) {
    return `<div class="dkd-v27-empty loading"><div class="dkd-v27-loader"><i></i><i></i><i></i></div><h3>Canlı kuyruk hazırlanıyor</h3><p>Güvenlik talepleri ve eşleştirme alanları senkronize ediliyor.</p></div>`;
  }
  return `<div class="dkd-v27-empty"><div class="dkd-v27-empty-icon">${dkdV27Icon('check')}</div><h3>Bekleyen kurye bulunmuyor</h3><p>Yeni bir kurye kapıya ulaştığında doğrulama kartı bu alanda otomatik olarak görünecek.</p><span><i></i> Canlı kuyruk izleniyor</span></div>`;
}

function dkdV27BindCards() {
  const root = document.querySelector(`#${DKD_V27_ROOT_ID}`);
  if (!root) return;
  for (const card of root.querySelectorAll('.dkd-v27-request-card')) {
    const sourceId = Number(card.dataset.sourceId);
    const input = card.querySelector('input');
    const button = card.querySelector('button');
    input?.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 6);
      card.classList.toggle('code-ready', input.value.length === 6);
    });
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') dkdV27Submit(sourceId, input.value);
    });
    button?.addEventListener('click', () => dkdV27Submit(sourceId, input?.value));
  }
}

function dkdV27Render() {
  if (!dkdV27State.mounted) return;
  const count = dkdV27State.sources.length;
  const signature = JSON.stringify({
    initialized: dkdV27State.initialized,
    ids: dkdV27State.sources.map((source) => [source.id, source.details]),
    busy: dkdV27State.busySourceId,
    status: [...dkdV27State.statusBySource.entries()],
  });
  const countElement = document.querySelector('#dkd-v27-count');
  const pillElement = document.querySelector('#dkd-v27-pill');
  const timeElement = document.querySelector('#dkd-v27-time');
  if (countElement) countElement.textContent = dkdV27State.initialized ? String(count) : '—';
  if (pillElement) pillElement.textContent = dkdV27State.initialized ? `${count} bekleyen` : 'Kuyruk hazırlanıyor';
  if (timeElement) timeElement.textContent = dkdV27State.lastSync.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  if (signature === dkdV27State.lastSignature) return;
  dkdV27State.lastSignature = signature;
  const cards = document.querySelector('#dkd-v27-cards');
  if (!cards) return;
  cards.innerHTML = count > 0 ? dkdV27State.sources.map(dkdV27CardTemplate).join('') : dkdV27EmptyTemplate();
  dkdV27BindCards();
}

function dkdV27BootSimple() {
  if (!dkdV27IsSimpleRequested()) return false;
  if (!dkdV27HasSecuritySession()) return true;
  dkdV27Mount();
  dkdV27OpenNativeQueue();
  setTimeout(dkdV27ScanSources, 350);
  return true;
}

function dkdV27Maintenance() {
  dkdV27ReplaceVisibleVersionText();
  dkdV27RenameModernSwitch();
  const simpleRequested = dkdV27IsSimpleRequested();
  if (simpleRequested) {
    if (!dkdV27State.mounted) dkdV27BootSimple();
    if (dkdV27State.mounted) {
      dkdV27ScanSources();
      if (dkdV27State.sources.length === 0) dkdV27OpenNativeQueue();
    }
  } else {
    document.querySelector('#dkd-v27-splash')?.classList.add('is-hidden');
    document.querySelector('#dkd-v26-splash')?.classList.add('is-hidden');
  }
}

dkdV27ReplaceVisibleVersionText();
dkdV27RenameModernSwitch();
dkdV27BootSimple();
setInterval(dkdV27Maintenance, 1100);
new MutationObserver(() => {
  dkdV27ReplaceVisibleVersionText();
  dkdV27RenameModernSwitch();
  if (dkdV27IsSimpleRequested() && !dkdV27State.mounted) dkdV27BootSimple();
}).observe(document.body, { childList: true, subtree: true });
