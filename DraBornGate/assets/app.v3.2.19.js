const dkdV3219Root = document.querySelector('#dkd-app');
const DKD_V3219_BOOT_VERSION = '3.2.19';
const DKD_V3219_BOOT_REVISION = 'clean-single-earnings-site-gate1';
const DKD_V3219_CACHE = `draborngate-web-${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`;

function dkdV3219IsSimple() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema')
    || sessionStorage.getItem('dkd_gate_security_theme') === 'simple'
    || sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

function dkdV3219Progress(dkdPercent, dkdLabel) {
  const dkdValue = Math.max(0, Math.min(100, Number(dkdPercent) || 0));
  const dkdFill = document.querySelector('#dkd-v28-progress-fill');
  const dkdProgress = document.querySelector('#dkd-v28-progress');
  const dkdText = document.querySelector('#dkd-v28-progress-label');
  if (dkdFill) dkdFill.style.width = `${dkdValue}%`;
  if (dkdProgress) dkdProgress.setAttribute('aria-valuenow', String(Math.round(dkdValue)));
  if (dkdText && dkdLabel) dkdText.textContent = dkdLabel;
}

function dkdV3219ResetDom() {
  for (const dkdChild of [...document.body.children]) {
    if (dkdChild.matches('#dkd-v28-splash,#dkd-app,.ambient,noscript,script')) continue;
    dkdChild.remove();
  }
  if (dkdV3219Root) {
    dkdV3219Root.innerHTML = '<div class="boot-shell"><div class="boot-logo"><span>DBG</span></div><div class="boot-copy"><strong>DraBornGate Web v3.2.19</strong><span>Tek Kazançlarım ve siteye bağlı Kapı seçimi hazırlanıyor</span></div><div class="boot-progress"><i></i></div></div>';
  }
}

async function dkdV3219PrepareRuntime() {
  dkdV3219ResetDom();
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3219_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', `${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`);
  document.documentElement.dataset.dkdGateVersion = DKD_V3219_BOOT_VERSION;

  if ('caches' in window) {
    const dkdKeys = await caches.keys().catch(() => []);
    await Promise.all(dkdKeys
      .filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_V3219_CACHE)
      .map((dkdKey) => caches.delete(dkdKey)));
  }
}

async function dkdV3219Read(dkdPath) {
  const dkdResponse = await fetch(dkdPath, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`${dkdPath} alınamadı (${dkdResponse.status}).`);
  return (await dkdResponse.text()).trim();
}

async function dkdV3219Unpack(dkdBase64) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Tarayıcı sıkıştırılmış uygulama paketini açamıyor.');
  const dkdBinary = atob(dkdBase64);
  const dkdBytes = Uint8Array.from(dkdBinary, (dkdCharacter) => dkdCharacter.charCodeAt(0));
  return new Response(new Blob([dkdBytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}

async function dkdV3219ImportSource(dkdSource) {
  const dkdUrl = URL.createObjectURL(new Blob([dkdSource], { type: 'text/javascript' }));
  try {
    await import(dkdUrl);
  } finally {
    URL.revokeObjectURL(dkdUrl);
  }
}

async function dkdV3219ReadJoined(dkdPattern, dkdCount) {
  const dkdPaths = Array.from({ length: dkdCount }, (_, dkdIndex) => `${dkdPattern}.${dkdIndex + 1}.txt?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`);
  return (await Promise.all(dkdPaths.map(dkdV3219Read))).join('');
}

async function dkdV3219PackedStyle(dkdPath, dkdKey) {
  const dkdStyle = document.createElement('style');
  dkdStyle.dataset[dkdKey] = 'true';
  dkdStyle.textContent = await dkdV3219Unpack(await dkdV3219Read(`${dkdPath}?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`));
  document.head.appendChild(dkdStyle);
}

async function dkdV3219Style(dkdPath, dkdKey) {
  if (document.querySelector(`link[data-${dkdKey}]`)) return;
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`;
    dkdLink.setAttribute(`data-${dkdKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3219Finish() {
  dkdV3219Progress(100, 'Hazır');
  document.documentElement.classList.remove('dkd-simple-booting');
  window.dkdV3219Cleanup?.();
  setTimeout(() => {
    const dkdSplash = document.querySelector('#dkd-v28-splash');
    dkdSplash?.classList.add('is-hidden');
    setTimeout(() => dkdSplash?.remove(), 460);
  }, 180);
}

function dkdV3219Failure(dkdError) {
  console.error('DraBornGate v3.2.19 açılış hatası:', dkdError);
  document.documentElement.classList.remove('dkd-simple-booting');
  dkdV3219Progress(100, `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`);
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  if (dkdRetry) dkdRetry.hidden = false;
}

async function dkdV3219ImportEarningsLayer() {
  const dkdNativeSetInterval = window.setInterval;
  const dkdNativeMutationObserver = window.MutationObserver;
  window.setInterval = (dkdCallback, dkdDelay, ...dkdArguments) => {
    if (Number(dkdDelay) === 1800 && String(dkdCallback).includes('dkdV3211Patch')) return -3211;
    return dkdNativeSetInterval(dkdCallback, dkdDelay, ...dkdArguments);
  };
  window.MutationObserver = function dkdV3219MutationObserver(dkdCallback) {
    if (String(dkdCallback).includes('dkdV3211QueuePatch')) {
      return { observe() {}, disconnect() {}, takeRecords() { return []; } };
    }
    return new dkdNativeMutationObserver(dkdCallback);
  };
  window.MutationObserver.prototype = dkdNativeMutationObserver.prototype;
  try {
    await import(`./v3.2.11.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}-earnings`);
  } finally {
    window.setInterval = dkdNativeSetInterval;
    window.MutationObserver = dkdNativeMutationObserver;
  }
}

async function dkdV3219BootSimple() {
  dkdV3219Progress(48, 'Sade Tema veri katmanı bağlanıyor');
  await import(`./v3.2.1.data.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`);
  await dkdV3219Style('./assets/v3.2.9.simple.css', 'dkd-web-v329-simple');
  await import(`./v3.2.9.simple.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`);
  await dkdV3219Style('./assets/v3.2.10.simple.css', 'dkd-web-v3210-simple');
  await import(`./v3.2.10.simple.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`);
}

async function dkdV3219BootModern() {
  dkdV3219Progress(42, 'Modern panel hazırlanıyor');
  await dkdV3219PackedStyle('./assets/v2.4.css.payload.txt', 'dkdWebV24');
  await dkdV3219ImportSource(await dkdV3219Unpack(await dkdV3219Read(`./assets/v2.4.js.payload.txt?v=${DKD_V3219_BOOT_VERSION}`)));
  await dkdV3219PackedStyle('./assets/v2.5.css.payload.txt', 'dkdWebV25');
  await dkdV3219ImportSource(await dkdV3219Unpack(await dkdV3219ReadJoined('./assets/v2.5.js.payload', 5)));
  await dkdV3219PackedStyle('./assets/v2.6.css.payload.txt', 'dkdWebV26');
  await dkdV3219ImportSource(await dkdV3219Unpack(await dkdV3219Read(`./assets/v2.6.js.payload.txt?v=${DKD_V3219_BOOT_VERSION}`)));
  await import(`./v2.7.guard.js?v=${DKD_V3219_BOOT_VERSION}`);
  await dkdV3219Style('./assets/v2.7.css', 'dkd-web-v27');
  await import(`./v2.7.js?v=${DKD_V3219_BOOT_VERSION}`);
  await dkdV3219Style('./assets/v2.8.css', 'dkd-web-v28');
  await import(`./v2.8.js?v=${DKD_V3219_BOOT_VERSION}`);
  await import(`./v2.8.1.js?v=${DKD_V3219_BOOT_VERSION}`);
  await import(`./v3.1.1.moto.js?v=${DKD_V3219_BOOT_VERSION}`);
  await dkdV3219Style('./assets/v3.0.css', 'dkd-web-v30');
  await dkdV3219Style('./assets/v3.1.1.css', 'dkd-web-v311');

  dkdV3219Progress(76, 'Canlı rol ve veri sistemi bağlanıyor');
  await import(`./v3.2.1.data.js?v=${DKD_V3219_BOOT_VERSION}`);
  await import(`./v3.2.1.js?v=${DKD_V3219_BOOT_VERSION}`);
  await dkdV3219PackedStyle('./assets/v3.2.4.css.payload.txt', 'dkdWebV324');
  await dkdV3219PackedStyle('./assets/v3.2.5.css.payload.txt', 'dkdWebV325');
  await import(`./v3.2.5.js?v=${DKD_V3219_BOOT_VERSION}`);

  dkdV3219Progress(90, 'Kazanç ve kurye kartları hazırlanıyor');
  await dkdV3219Style('./assets/v3.2.11.css', 'dkd-web-v3211');
  await dkdV3219ImportEarningsLayer();
  await dkdV3219Style('./assets/v3.2.15.css', 'dkd-web-v3215');
  const dkdNativeSetInterval = window.setInterval;
  window.setInterval = (dkdCallback, dkdDelay, ...dkdArguments) => {
    if (Number(dkdDelay) === 1200 && String(dkdCallback).includes('dkdV3215Apply')) return -3215;
    return dkdNativeSetInterval(dkdCallback, dkdDelay, ...dkdArguments);
  };
  try {
    await import(`./v3.2.15.js?v=${DKD_V3219_BOOT_VERSION}-motorcycle`);
  } finally {
    window.setInterval = dkdNativeSetInterval;
  }

  await dkdV3219Style('./assets/v3.2.19.css', 'dkd-web-v3219');
  await import(`./v3.2.19.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}-ui`);
}

async function dkdV3219Start() {
  await import(`./v3.2.19.guard.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`);
  await dkdV3219PrepareRuntime();
  dkdV3219Progress(8, 'Ana uygulama paketi alınıyor');
  await dkdV3219PackedStyle('./assets/app.v2.css.payload.txt', 'dkdWebV2');
  const dkdCore = await dkdV3219ReadJoined('./assets/app.v2.payload', 4);
  dkdV3219Progress(24, 'Ana uygulama hazırlanıyor');
  await dkdV3219ImportSource(await dkdV3219Unpack(dkdCore));
  await import(`./v2.3.js?v=${DKD_V3219_BOOT_VERSION}`);

  if (dkdV3219IsSimple()) await dkdV3219BootSimple();
  else await dkdV3219BootModern();

  if ('serviceWorker' in navigator) {
    const dkdRegistration = await navigator.serviceWorker.register(
      `./sw.js?v=${DKD_V3219_BOOT_VERSION}-${DKD_V3219_BOOT_REVISION}`,
      { scope: '/DraBornGate/', updateViaCache: 'none' }
    );
    await dkdRegistration.update().catch(() => undefined);
    dkdRegistration.waiting?.postMessage('SKIP_WAITING');
  }

  document.documentElement.dataset.dkdGateVersion = DKD_V3219_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3219_BOOT_VERSION);
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3219_BOOT_VERSION;
  window.__DKD_GATE_V3219_ACTIVE__ = true;
  dkdV3219Finish();
}

dkdV3219Start().catch(dkdV3219Failure);
