const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '3.2.7';
const DKD_WEB_REVISION = '3.2.7-r3';
const DKD_WEB_CACHE = 'draborngate-web-v3.2.7-r3-boot-safe';

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

function dkdVersioned(dkdPath) {
  const dkdSeparator = dkdPath.includes('?') ? '&' : '?';
  return `${dkdPath}${dkdSeparator}v=${encodeURIComponent(DKD_WEB_REVISION)}`;
}

function dkdDelay(dkdMilliseconds) {
  return new Promise((dkdResolve) => setTimeout(dkdResolve, dkdMilliseconds));
}

async function dkdWithTimeout(dkdTask, dkdMilliseconds, dkdLabel) {
  let dkdTimer = 0;
  try {
    return await Promise.race([
      Promise.resolve(dkdTask),
      new Promise((_, dkdReject) => {
        dkdTimer = setTimeout(
          () => dkdReject(new Error(`${dkdLabel} zaman aşımına uğradı.`)),
          dkdMilliseconds
        );
      }),
    ]);
  } finally {
    clearTimeout(dkdTimer);
  }
}

const dkdBootWatchdog = setTimeout(() => {
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(96, 'Açılış beklenenden uzun sürdü. Tekrar Dene düğmesine dokunun.');
  if (dkdRetry) dkdRetry.hidden = false;
}, 18000);

function dkdPrepareFreshRuntime() {
  sessionStorage.setItem('dkd_gate_web_version', DKD_WEB_VERSION);
  sessionStorage.setItem('dkd_gate_web_revision', DKD_WEB_REVISION);

  setTimeout(() => {
    if ('caches' in window) {
      void caches.keys()
        .then((dkdCacheKeys) => Promise.allSettled(
          dkdCacheKeys
            .filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_WEB_CACHE)
            .map((dkdKey) => caches.delete(dkdKey))
        ))
        .catch(() => undefined);
    }

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register(
        dkdVersioned('./sw.js'),
        { scope: '/DraBornGate/', updateViaCache: 'none' }
      )
        .then((dkdRegistration) => dkdRegistration.update().catch(() => undefined))
        .catch(() => undefined);
    }
  }, 0);
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
  const dkdResponse = await dkdWithTimeout(
    fetch(dkdVersioned(dkdPath), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    }),
    15000,
    `${dkdPath} indirmesi`
  );
  if (!dkdResponse.ok) {
    throw new Error(`DraBornGate Web v${DKD_WEB_VERSION} paketi alınamadı (${dkdResponse.status}): ${dkdPath}`);
  }
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
  return dkdWithTimeout(new Response(dkdStream).text(), 15000, 'Paket açma işlemi');
}

async function dkdImportSource(dkdSource, dkdLabel = 'Dinamik modül') {
  const dkdModuleUrl = URL.createObjectURL(new Blob([dkdSource], { type: 'text/javascript' }));
  try {
    await dkdWithTimeout(import(dkdModuleUrl), 15000, dkdLabel);
  } finally {
    URL.revokeObjectURL(dkdModuleUrl);
  }
}

async function dkdImportModule(dkdPath, dkdLabel) {
  return dkdWithTimeout(import(dkdVersioned(dkdPath)), 15000, dkdLabel);
}

async function dkdAppendPackedStyle(dkdPath, dkdDatasetKey) {
  const dkdPayload = await dkdReadPayload(dkdPath);
  const dkdStyle = document.createElement('style');
  dkdStyle.dataset[dkdDatasetKey] = 'true';
  dkdStyle.textContent = await dkdUnpack(dkdPayload);
  document.head.appendChild(dkdStyle);
}

async function dkdAppendStyleLink(dkdPath, dkdDatasetKey) {
  await dkdWithTimeout(new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = dkdVersioned(dkdPath);
    dkdLink.dataset[dkdDatasetKey] = 'true';
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  }), 12000, `${dkdPath} stil dosyası`);
}

async function dkdReadJoinedPayload(dkdPattern, dkdCount) {
  const dkdPaths = Array.from(
    { length: dkdCount },
    (_, dkdIndex) => `${dkdPattern}.${dkdIndex + 1}.txt`
  );
  return (await Promise.all(dkdPaths.map(dkdReadPayload))).join('');
}

function dkdFinishBoot() {
  clearTimeout(dkdBootWatchdog);
  dkdSetBootProgress(100, 'Hazır');
  setTimeout(() => {
    const dkdSplash = document.querySelector('#dkd-v28-splash');
    dkdSplash?.classList.add('is-hidden');
    setTimeout(() => dkdSplash?.remove(), 460);
  }, 180);
}

function dkdShowBootError(dkdError) {
  clearTimeout(dkdBootWatchdog);
  console.error(dkdError);
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(100, `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`);
  if (dkdRetry) dkdRetry.hidden = false;
  if (!document.querySelector('#dkd-v28-splash') && dkdRoot) {
    dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v${DKD_WEB_VERSION} açılamadı</strong><span>${String(dkdError?.message || dkdError)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
  }
}

async function dkdWaitForV327SimpleReady() {
  if (!dkdIsSimpleModeRequested()) return;
  const dkdStartedAt = performance.now();
  while (performance.now() - dkdStartedAt < 2600) {
    document.querySelector('#dkd-v28-root')?.remove();
    document.body.classList.remove('dkd-v28-simple-active');
    const dkdReady = document.documentElement.dataset.dkdV327Ready === 'true';
    const dkdFinderReady = Boolean(document.querySelector('.dkd-v31-finder,.dkd-v324-finder'));
    if (dkdReady && dkdFinderReady) return;
    await dkdDelay(50);
  }
}

async function dkdBootWebV327() {
  dkdSetBootProgress(2, 'v3.2.7-r3 güvenli açılış başlatılıyor');
  dkdPrepareFreshRuntime();
  dkdPrepareCleanPersonalRoute();

  dkdSetBootProgress(5, 'Sürüm koruması hazırlanıyor');
  void dkdImportModule('./v3.2.7.guard.js', 'v3.2.7 sürüm koruması')
    .catch((dkdError) => console.warn('Sürüm koruması atlandı:', dkdError));

  const dkdSimpleMode = dkdIsSimpleModeRequested();

  dkdSetBootProgress(10, 'Arayüz dosyaları yükleniyor');
  await dkdAppendPackedStyle('./assets/app.v2.css.payload.txt', 'dkdWebV2');
  dkdSetBootProgress(20, 'Ana uygulama paketi alınıyor');
  const dkdCorePayload = await dkdReadJoinedPayload('./assets/app.v2.payload', 4);
  dkdSetBootProgress(34, 'Ana uygulama hazırlanıyor');
  await dkdImportSource(await dkdUnpack(dkdCorePayload), 'Ana uygulama');
  dkdSetBootProgress(48, 'Oturum ve rol sistemi bağlanıyor');
  await dkdImportModule('./v2.3.js', 'Oturum ve rol sistemi');

  if (!dkdSimpleMode) {
    dkdSetBootProgress(57, 'Modern tema hazırlanıyor');
    await dkdAppendPackedStyle('./assets/v2.4.css.payload.txt', 'dkdWebV24');
    await dkdImportSource(
      await dkdUnpack(await dkdReadPayload('./assets/v2.4.js.payload.txt')),
      'Modern tema'
    );
    dkdSetBootProgress(66, 'Güvenlik paneli güncelleniyor');
    await dkdAppendPackedStyle('./assets/v2.5.css.payload.txt', 'dkdWebV25');
    await dkdImportSource(
      await dkdUnpack(await dkdReadJoinedPayload('./assets/v2.5.js.payload', 5)),
      'Güvenlik paneli'
    );
    dkdSetBootProgress(75, 'Tema geçişleri bağlanıyor');
    await dkdAppendPackedStyle('./assets/v2.6.css.payload.txt', 'dkdWebV26');
    await dkdImportSource(
      await dkdUnpack(await dkdReadPayload('./assets/v2.6.js.payload.txt')),
      'Tema geçişleri'
    );
    dkdSetBootProgress(82, 'Modern panel son kontrolleri yapılıyor');
    await dkdImportModule('./v2.7.guard.js', 'Modern panel koruması');
    await dkdAppendStyleLink('./assets/v2.7.css', 'dkdWebV27');
    await dkdImportModule('./v2.7.js', 'Modern panel');
  } else {
    dkdSetBootProgress(82, 'Bağımsız Sade Tema hazırlanıyor');
  }

  dkdSetBootProgress(88, 'Sade Tema güvenlik kabuğu hazırlanıyor');
  await dkdAppendStyleLink('./assets/v2.8.css', 'dkdWebV28');
  await dkdImportModule('./v2.8.js', 'Sade Tema güvenlik kabuğu');
  dkdSetBootProgress(91, 'DraBornGate motosiklet ikonu hazırlanıyor');
  await dkdImportModule('./v2.8.1.js', 'DraBornGate ikonu');
  await dkdImportModule('./v3.1.1.moto.js', 'Motosiklet ikonu');
  dkdSetBootProgress(94, 'v3.2.7 modern arayüz hazırlanıyor');
  await dkdAppendStyleLink('./assets/v3.0.css', 'dkdWebV30');
  await dkdAppendStyleLink('./assets/v3.1.1.css', 'dkdWebV324Base');
  dkdSetBootProgress(96, 'Public RPC köprüsü ve canlı veriler bağlanıyor');
  await dkdImportModule('./v3.2.1.data.js', 'Public RPC köprüsü');
  dkdSetBootProgress(98, 'Admin Paneli, kod doğrulama ve kuyruk bağlanıyor');
  await dkdImportModule('./v3.2.1.js', 'Canlı veri arayüzü');
  dkdSetBootProgress(99, 'v3.2.7 arayüz ve kurye akışı tamamlanıyor');
  await dkdAppendPackedStyle('./assets/v3.2.4.css.payload.txt', 'dkdWebV324Base');
  await dkdAppendPackedStyle('./assets/v3.2.5.css.payload.txt', 'dkdWebV325');
  await dkdAppendStyleLink('./assets/v3.2.7.css', 'dkdWebV327');
  await dkdImportModule('./v3.2.7.js', 'v3.2.7 özellikleri');
  await dkdWaitForV327SimpleReady();
  dkdFinishBoot();
}

dkdBootWebV327().catch(dkdShowBootError);
