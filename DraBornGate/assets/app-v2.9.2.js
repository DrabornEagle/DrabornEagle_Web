const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '2.9.2';
let dkdBootProgressValue = 2;
let dkdBootFinished = false;

function dkdIsSimpleModeRequested() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema') ||
    sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
    sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

function dkdSetBootProgress(dkdPercent, dkdLabel) {
  const dkdRequested = Math.max(0, Math.min(100, Number(dkdPercent) || 0));
  dkdBootProgressValue = Math.max(dkdBootProgressValue, dkdRequested);
  const dkdFill = document.querySelector('#dkd-v28-progress-fill');
  const dkdProgress = document.querySelector('#dkd-v28-progress');
  const dkdText = document.querySelector('#dkd-v28-progress-label');
  if (dkdFill) dkdFill.style.width = `${dkdBootProgressValue}%`;
  if (dkdProgress) dkdProgress.setAttribute('aria-valuenow', String(Math.round(dkdBootProgressValue)));
  if (dkdText && dkdLabel) dkdText.textContent = dkdLabel;
}

window.dkdSetBootProgress = dkdSetBootProgress;

function dkdFinishBoot(dkdLabel = 'Hazır') {
  if (dkdBootFinished) return;
  dkdBootFinished = true;
  clearTimeout(dkdBootWatchdog);
  dkdSetBootProgress(100, dkdLabel);
  document.body.classList.add('dkd-web-ready');
  setTimeout(() => {
    const dkdSplash = document.querySelector('#dkd-v28-splash');
    dkdSplash?.classList.add('is-hidden');
    setTimeout(() => dkdSplash?.remove(), 460);
  }, 120);
}

const dkdBootWatchdog = setTimeout(() => {
  dkdFinishBoot('Panel açıldı; gelişmiş görünüm arka planda hazırlanıyor');
}, 9000);

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

function dkdWithTimeout(dkdPromise, dkdMilliseconds, dkdMessage) {
  let dkdTimer;
  const dkdTimeout = new Promise((_, dkdReject) => {
    dkdTimer = setTimeout(() => dkdReject(new Error(dkdMessage)), dkdMilliseconds);
  });
  return Promise.race([dkdPromise, dkdTimeout]).finally(() => clearTimeout(dkdTimer));
}

async function dkdReadPayload(dkdPath) {
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), 6500);
  try {
    const dkdResponse = await fetch(dkdPath, { cache: 'no-store', signal: dkdController.signal });
    if (!dkdResponse.ok) throw new Error(`Paket alınamadı (${dkdResponse.status}).`);
    return (await dkdResponse.text()).trim();
  } finally {
    clearTimeout(dkdTimer);
  }
}

async function dkdUnpack(dkdBase64) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Tarayıcı sıkıştırma desteği sunmuyor.');
  const dkdBinary = atob(dkdBase64);
  const dkdCompressed = new Uint8Array(dkdBinary.length);
  for (let dkdIndex = 0; dkdIndex < dkdBinary.length; dkdIndex += 1) dkdCompressed[dkdIndex] = dkdBinary.charCodeAt(dkdIndex);
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

async function dkdAppendStyleLink(dkdPath, dkdDatasetKey, dkdTimeout = 3500) {
  if (document.querySelector(`link[data-${dkdDatasetKey.replace(/[A-Z]/g, (dkdCharacter) => `-${dkdCharacter.toLowerCase()}`)}]`)) return;
  await dkdWithTimeout(new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_WEB_VERSION}`;
    dkdLink.dataset[dkdDatasetKey] = 'true';
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  }), dkdTimeout, `${dkdPath} zaman aşımına uğradı.`);
}

async function dkdReadJoinedPayload(dkdPattern, dkdCount) {
  const dkdPaths = Array.from({ length: dkdCount }, (_, dkdIndex) => `${dkdPattern}.${dkdIndex + 1}.txt?v=${DKD_WEB_VERSION}`);
  return (await Promise.all(dkdPaths.map(dkdReadPayload))).join('');
}

function dkdShowBootError(dkdError) {
  console.error(dkdError);
  document.body.classList.add('dkd-web-ready');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(100, `Açılış tamamlanamadı: ${String(dkdError?.message || dkdError)}`);
  if (dkdRetry) dkdRetry.hidden = false;
  if (!document.querySelector('#dkd-v28-splash')) {
    dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v${DKD_WEB_VERSION} açılamadı</strong><span>${String(dkdError?.message || dkdError)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
  }
}

async function dkdLoadCore(dkdSimpleMode) {
  dkdSetBootProgress(8, 'Arayüz dosyaları yükleniyor');
  await dkdAppendPackedStyle('./assets/app.v2.css.payload.txt', 'dkdWebV2');

  dkdSetBootProgress(18, 'Ana uygulama paketi alınıyor');
  const dkdCorePayload = await dkdReadJoinedPayload('./assets/app.v2.payload', 4);

  dkdSetBootProgress(34, 'Ana uygulama hazırlanıyor');
  await dkdImportSource(await dkdUnpack(dkdCorePayload));

  dkdSetBootProgress(50, 'Oturum ve rol sistemi bağlanıyor');
  await dkdWithTimeout(import(`./v2.3.js?v=${DKD_WEB_VERSION}`), 5000, 'Oturum modülü zaman aşımına uğradı.');

  if (dkdSimpleMode) return;

  dkdSetBootProgress(60, 'Modern tema hazırlanıyor');
  await dkdAppendPackedStyle('./assets/v2.4.css.payload.txt', 'dkdWebV24');
  await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.4.js.payload.txt?v=${DKD_WEB_VERSION}`)));

  dkdSetBootProgress(70, 'Güvenlik paneli güncelleniyor');
  await dkdAppendPackedStyle('./assets/v2.5.css.payload.txt', 'dkdWebV25');
  await dkdImportSource(await dkdUnpack(await dkdReadJoinedPayload('./assets/v2.5.js.payload', 5)));

  dkdSetBootProgress(78, 'Tema geçişleri bağlanıyor');
  await dkdAppendPackedStyle('./assets/v2.6.css.payload.txt', 'dkdWebV26');
  await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.6.js.payload.txt?v=${DKD_WEB_VERSION}`)));

  dkdSetBootProgress(86, 'Modern panel açılıyor');
  await dkdWithTimeout(import(`./v2.7.guard.js?v=${DKD_WEB_VERSION}`), 3500, 'Modern panel koruması zaman aşımına uğradı.');
  await dkdAppendStyleLink('./assets/v2.7.css', 'dkdWebV27');
  await dkdWithTimeout(import(`./v2.7.js?v=${DKD_WEB_VERSION}`), 3500, 'Modern panel modülü zaman aşımına uğradı.');
}

async function dkdLoadEnhancements(dkdSimpleMode) {
  try {
    if (!dkdSimpleMode) {
      await Promise.allSettled([
        dkdAppendStyleLink('./assets/v2.8.css', 'dkdWebV28', 2500),
        dkdWithTimeout(import(`./v2.8.js?v=${DKD_WEB_VERSION}`), 3000, 'v2.8 modülü zaman aşımına uğradı.'),
        dkdWithTimeout(import(`./v2.8.1.js?v=${DKD_WEB_VERSION}`), 3000, 'Motosiklet modülü zaman aşımına uğradı.'),
      ]);
    }

    const [dkdStyleResult, dkdModuleResult] = await Promise.allSettled([
      dkdAppendStyleLink('./assets/v2.9.css', 'dkdWebV29', 3000),
      dkdWithTimeout(import(`./v2.9.js?v=${DKD_WEB_VERSION}`), 4000, 'Gelişmiş Sade Tema zaman aşımına uğradı.'),
    ]);

    if (dkdModuleResult.status === 'fulfilled') {
      await dkdWithTimeout(
        dkdModuleResult.value.dkdV29PrepareInitialSurface({ simpleMode: dkdSimpleMode }),
        4500,
        'Gelişmiş ekran hazırlığı zaman aşımına uğradı.'
      ).catch((dkdError) => console.warn(dkdError));
    }
    if (dkdStyleResult.status === 'rejected') console.warn(dkdStyleResult.reason);
  } catch (dkdError) {
    console.warn('Gelişmiş DraBornGate katmanı yüklenemedi; temel panel açık kaldı.', dkdError);
  }
}

async function dkdBootWebV292() {
  dkdSetBootProgress(4, 'Başlatılıyor');
  dkdPrepareCleanPersonalRoute();
  const dkdSimpleMode = dkdIsSimpleModeRequested();
  await dkdLoadCore(dkdSimpleMode);

  dkdSetBootProgress(94, dkdSimpleMode ? 'Güvenlik paneli açılıyor' : 'Panel açılıyor');
  dkdFinishBoot('Hazır');

  void dkdLoadEnhancements(dkdSimpleMode);
}

dkdBootWebV292().catch(dkdShowBootError);
