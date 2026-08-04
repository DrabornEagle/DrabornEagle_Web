const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '3.2.4';
const DKD_WEB_CACHE = 'draborngate-web-v3.2.4-courier-admin-premium';

function dkdIsSimpleModeRequested() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema') ||
    sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
    sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

function dkdSetBootProgress(dkdPercent, dkdLabel) {
  const dkdSafePercent = Math.max(0, Math.min(100, Number(dkdPercent) || 0));
  const dkdFill = document.querySelector('#dkd-v28-progress-fill');
  const dkdProgress = document.querySelector('#dkd-v28-progress');
  const dkdText = document.querySelector('#dkd-v28-progress-label');
  if (dkdFill) dkdFill.style.width = `${dkdSafePercent}%`;
  if (dkdProgress) dkdProgress.setAttribute('aria-valuenow', String(Math.round(dkdSafePercent)));
  if (dkdText && dkdLabel) dkdText.textContent = dkdLabel;
}

window.dkdSetBootProgress = dkdSetBootProgress;

const dkdBootWatchdog = setTimeout(() => {
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(96, 'Bağlantı beklenenden uzun sürüyor. Yeniden deneyebilirsiniz.');
  if (dkdRetry) dkdRetry.hidden = false;
}, 20000);

async function dkdPrepareFreshRuntime() {
  sessionStorage.setItem('dkd_gate_web_version', DKD_WEB_VERSION);

  if ('caches' in window) {
    const dkdCacheKeys = await caches.keys().catch(() => []);
    await Promise.all(
      dkdCacheKeys
        .filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_WEB_CACHE)
        .map((dkdKey) => caches.delete(dkdKey))
    );
  }

  if ('serviceWorker' in navigator) {
    const dkdRegistration = await navigator.serviceWorker.register(
      `./sw.js?v=${DKD_WEB_VERSION}`,
      { scope: '/DraBornGate/', updateViaCache: 'none' }
    );
    await dkdRegistration.update().catch(() => undefined);
  }
}

function dkdPrepareCleanPersonalRoute() {
  const dkdReserved = new Set(['privacy', 'data-safety', 'account-deletion', 'subscriptions', 'support', 'terms', 'assets', 'guvenlik-sade-tema']);
  const dkdStoredRoute = sessionStorage.getItem('dkd_gate_route');
  if (!dkdStoredRoute) return;
  let dkdPathname = dkdStoredRoute;
  try {
    dkdPathname = new URL(dkdStoredRoute, location.origin).pathname;
  } catch {
    dkdPathname = String(dkdStoredRoute).split(/[?#]/)[0];
  }
  const dkdParts = dkdPathname.split('/').filter(Boolean);
  const dkdRouteName = String(dkdParts[1] || '').toLocaleLowerCase('tr-TR');
  if (dkdParts[0] !== 'DraBornGate' || dkdParts.length !== 2) return;
  if (dkdRouteName === 'guvenlik-sade-tema') {
    sessionStorage.removeItem('dkd_gate_route');
    sessionStorage.setItem('dkd_gate_security_theme', 'simple');
    sessionStorage.setItem('dkd_gate_force_theme', 'simple');
    return;
  }
  if (dkdReserved.has(dkdRouteName)) return;
  sessionStorage.removeItem('dkd_gate_route');
  sessionStorage.setItem('dkd_gate_clean_personal_route', `/DraBornGate/${dkdParts[1]}`);
}

async function dkdReadPayload(dkdPath) {
  const dkdResponse = await fetch(dkdPath, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`DraBornGate Web v${DKD_WEB_VERSION} paketi alınamadı (${dkdResponse.status}).`);
  return (await dkdResponse.text()).trim();
}

async function dkdUnpack(dkdBase64) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Tarayıcınız modern sıkıştırma desteği sunmuyor. Güncel Chrome, Edge, Firefox veya Safari kullanın.');
  }
  const dkdBinary = atob(dkdBase64);
  const dkdCompressed = new Uint8Array(dkdBinary.length);
  for (let dkdIndex = 0; dkdIndex < dkdBinary.length; dkdIndex += 1) {
    dkdCompressed[dkdIndex] = dkdBinary.charCodeAt(dkdIndex);
  }
  const dkdStream = new Blob([dkdCompressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(dkdStream).text();
}

async function dkdImportSource(dkdSource) {
  const dkdModuleUrl = URL.createObjectURL(new Blob([dkdSource], { type: 'text/javascript' }));
  try {
    await import(dkdModuleUrl);
  } finally {
    URL.revokeObjectURL(dkdModuleUrl);
  }
}

async function dkdAppendPackedStyle(dkdPath, dkdDatasetKey) {
  const dkdPayload = await dkdReadPayload(`${dkdPath}?v=${DKD_WEB_VERSION}`);
  const dkdStyle = document.createElement('style');
  dkdStyle.dataset[dkdDatasetKey] = 'true';
  dkdStyle.textContent = await dkdUnpack(dkdPayload);
  document.head.appendChild(dkdStyle);
}

async function dkdAppendStyleLink(dkdPath, dkdDatasetKey) {
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_WEB_VERSION}`;
    dkdLink.dataset[dkdDatasetKey] = 'true';
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

async function dkdReadJoinedPayload(dkdPattern, dkdCount) {
  const dkdPaths = Array.from({ length: dkdCount }, (_, dkdIndex) => `${dkdPattern}.${dkdIndex + 1}.txt?v=${DKD_WEB_VERSION}`);
  return (await Promise.all(dkdPaths.map(dkdReadPayload))).join('');
}

function dkdFinishBoot() {
  clearTimeout(dkdBootWatchdog);
  dkdSetBootProgress(100, 'Hazır');
  setTimeout(() => {
    const dkdSplash = document.querySelector('#dkd-v28-splash');
    dkdSplash?.classList.add('is-hidden');
    setTimeout(() => dkdSplash?.remove(), 460);
  }, 240);
}

function dkdShowBootError(dkdError) {
  clearTimeout(dkdBootWatchdog);
  console.error(dkdError);
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(100, `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`);
  if (dkdRetry) dkdRetry.hidden = false;
  if (!document.querySelector('#dkd-v28-splash')) {
    dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v${DKD_WEB_VERSION} açılamadı</strong><span>${String(dkdError?.message || dkdError)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
  }
}

async function dkdBootWebV324() {
  dkdSetBootProgress(2, 'v3.2.4 sürüm ve önbellek koruması başlatılıyor');
  await import(`./v3.2.4.guard.js?v=${DKD_WEB_VERSION}`);
  await dkdPrepareFreshRuntime();
  dkdSetBootProgress(5, 'Başlatılıyor');
  dkdPrepareCleanPersonalRoute();
  const dkdSimpleMode = dkdIsSimpleModeRequested();

  dkdSetBootProgress(10, 'Arayüz dosyaları yükleniyor');
  await dkdAppendPackedStyle('./assets/app.v2.css.payload.txt', 'dkdWebV2');
  dkdSetBootProgress(20, 'Ana uygulama paketi alınıyor');
  const dkdCorePayload = await dkdReadJoinedPayload('./assets/app.v2.payload', 4);
  dkdSetBootProgress(34, 'Ana uygulama hazırlanıyor');
  await dkdImportSource(await dkdUnpack(dkdCorePayload));
  dkdSetBootProgress(48, 'Oturum ve rol sistemi bağlanıyor');
  await import(`./v2.3.js?v=${DKD_WEB_VERSION}`);

  if (!dkdSimpleMode) {
    dkdSetBootProgress(57, 'Modern tema hazırlanıyor');
    await dkdAppendPackedStyle('./assets/v2.4.css.payload.txt', 'dkdWebV24');
    await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.4.js.payload.txt?v=${DKD_WEB_VERSION}`)));
    dkdSetBootProgress(66, 'Güvenlik paneli güncelleniyor');
    await dkdAppendPackedStyle('./assets/v2.5.css.payload.txt', 'dkdWebV25');
    await dkdImportSource(await dkdUnpack(await dkdReadJoinedPayload('./assets/v2.5.js.payload', 5)));
    dkdSetBootProgress(75, 'Tema geçişleri bağlanıyor');
    await dkdAppendPackedStyle('./assets/v2.6.css.payload.txt', 'dkdWebV26');
    await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.6.js.payload.txt?v=${DKD_WEB_VERSION}`)));
    dkdSetBootProgress(82, 'Modern panel son kontrolleri yapılıyor');
    await import(`./v2.7.guard.js?v=${DKD_WEB_VERSION}`);
    await dkdAppendStyleLink('./assets/v2.7.css', 'dkdWebV27');
    await import(`./v2.7.js?v=${DKD_WEB_VERSION}`);
  } else {
    dkdSetBootProgress(82, 'Bağımsız Sade Tema hazırlanıyor');
  }

  dkdSetBootProgress(88, 'Sade Tema güvenlik kabuğu hazırlanıyor');
  await dkdAppendStyleLink('./assets/v2.8.css', 'dkdWebV28');
  await import(`./v2.8.js?v=${DKD_WEB_VERSION}`);
  dkdSetBootProgress(91, 'DraBornGate motosiklet ikonu hazırlanıyor');
  await import(`./v2.8.1.js?v=${DKD_WEB_VERSION}`);
  await import(`./v3.1.1.moto.js?v=${DKD_WEB_VERSION}`);
  dkdSetBootProgress(94, 'v3.2.4 premium arayüz hazırlanıyor');
  await dkdAppendStyleLink('./assets/v3.0.css', 'dkdWebV30');
  await dkdAppendStyleLink('./assets/v3.1.1.css', 'dkdWebV311Fixes');
  await dkdAppendStyleLink('./assets/v3.2.4.css', 'dkdWebV324');
  dkdSetBootProgress(97, 'Admin, rol ve canlı veri bağlantıları kuruluyor');
  await import(`./v3.2.4.data.js?v=${DKD_WEB_VERSION}`);
  dkdSetBootProgress(99, 'Kurye ekranları ve arama sistemi bağlanıyor');
  await import(`./v3.2.4.js?v=${DKD_WEB_VERSION}`);
  dkdFinishBoot();
}

dkdBootWebV324().catch(dkdShowBootError);
