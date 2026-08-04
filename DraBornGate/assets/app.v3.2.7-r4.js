const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '3.2.7';
const DKD_WEB_REVISION = '3.2.7-r4';

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
  const dkdUrl = new URL(dkdPath, document.baseURI);
  dkdUrl.searchParams.set('v', DKD_WEB_REVISION);
  return dkdUrl.href;
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
  dkdSetBootProgress(100, 'Açılış tamamlanamadı. Tekrar Dene düğmesine dokunun.');
  if (dkdRetry) dkdRetry.hidden = false;
}, 45000);

function dkdCleanOldRuntimeInBackground() {
  sessionStorage.setItem('dkd_gate_web_version', DKD_WEB_VERSION);
  sessionStorage.setItem('dkd_gate_web_revision', DKD_WEB_REVISION);

  setTimeout(() => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistrations()
        .then((dkdRegistrations) => Promise.allSettled(
          dkdRegistrations.map((dkdRegistration) => dkdRegistration.unregister())
        ))
        .catch(() => undefined);
    }

    if ('caches' in window) {
      void caches.keys()
        .then((dkdKeys) => Promise.allSettled(
          dkdKeys
            .filter((dkdKey) => String(dkdKey || '').startsWith('draborngate-web-'))
            .map((dkdKey) => caches.delete(dkdKey))
        ))
        .catch(() => undefined);
    }
  }, 0);
}

function dkdPrepareCleanPersonalRoute() {
  const dkdReserved = new Set([
    'privacy',
    'data-safety',
    'account-deletion',
    'subscriptions',
    'support',
    'terms',
    'assets',
    'guvenlik-sade-tema',
  ]);
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

async function dkdImportModule(dkdPath, dkdLabel, dkdTimeout = 30000) {
  return dkdWithTimeout(import(dkdVersioned(dkdPath)), dkdTimeout, dkdLabel);
}

async function dkdAppendStyleLink(dkdPath, dkdDatasetKey, dkdTimeout = 20000) {
  await dkdWithTimeout(new Promise((dkdResolve, dkdReject) => {
    const dkdExisting = document.querySelector(`link[data-${dkdDatasetKey.replace(/[A-Z]/g, (dkdMatch) => `-${dkdMatch.toLowerCase()}`)}="true"]`);
    if (dkdExisting) {
      dkdResolve();
      return;
    }

    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = dkdVersioned(dkdPath);
    dkdLink.dataset[dkdDatasetKey] = 'true';
    dkdLink.onload = () => dkdResolve();
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  }), dkdTimeout, `${dkdLabel} stil dosyası`);
}

function dkdFinishBoot() {
  clearTimeout(dkdBootWatchdog);
  dkdSetBootProgress(100, 'Hazır');
  setTimeout(() => {
    const dkdSplash = document.querySelector('#dkd-v28-splash');
    dkdSplash?.classList.add('is-hidden');
    setTimeout(() => dkdSplash?.remove(), 460);
  }, 160);
}

function dkdShowBootError(dkdError) {
  clearTimeout(dkdBootWatchdog);
  console.error(dkdError);
  const dkdMessage = String(dkdError?.message || dkdError || 'Bilinmeyen açılış hatası');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(100, `Açılış hatası: ${dkdMessage}`);
  if (dkdRetry) dkdRetry.hidden = false;

  if (!document.querySelector('#dkd-v28-splash') && dkdRoot) {
    dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v${DKD_WEB_VERSION} açılamadı</strong><span>${dkdMessage}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
  }
}

async function dkdWaitForV327SimpleReady() {
  if (!dkdIsSimpleModeRequested()) return;
  const dkdStartedAt = performance.now();
  while (performance.now() - dkdStartedAt < 4000) {
    document.querySelector('#dkd-v28-root')?.remove();
    document.body.classList.remove('dkd-v28-simple-active');
    const dkdReady = document.documentElement.dataset.dkdV327Ready === 'true';
    const dkdFinderReady = Boolean(document.querySelector('.dkd-v31-finder,.dkd-v324-finder'));
    if (dkdReady && dkdFinderReady) return;
    await dkdDelay(50);
  }
}

async function dkdBootWebV327R4() {
  dkdSetBootProgress(2, 'v3.2.7-r4 statik açılış başlatılıyor');
  dkdCleanOldRuntimeInBackground();
  dkdPrepareCleanPersonalRoute();

  void dkdImportModule('./assets/v3.2.7.guard.js', 'Sürüm koruması', 12000)
    .catch((dkdError) => console.warn('Sürüm koruması atlandı:', dkdError));

  const dkdSimpleMode = dkdIsSimpleModeRequested();

  dkdSetBootProgress(10, 'Ana stil dosyası yükleniyor');
  await dkdAppendStyleLink('./assets/app.v2.runtime.css', 'dkdWebV2Runtime', 'Ana');

  dkdSetBootProgress(22, 'Ana uygulama doğrudan açılıyor');
  await dkdImportModule('./assets/app.v2.runtime.js', 'Ana uygulama', 35000);

  dkdSetBootProgress(45, 'Oturum ve rol sistemi bağlanıyor');
  await dkdImportModule('./assets/v2.3.js', 'Oturum ve rol sistemi');

  if (!dkdSimpleMode) {
    dkdSetBootProgress(55, 'Modern tema hazırlanıyor');
    await dkdAppendStyleLink('./assets/v2.4.runtime.css', 'dkdWebV24Runtime', 'Modern tema');
    await dkdImportModule('./assets/v2.4.runtime.js', 'Modern tema');

    dkdSetBootProgress(65, 'Güvenlik paneli hazırlanıyor');
    await dkdAppendStyleLink('./assets/v2.5.runtime.css', 'dkdWebV25Runtime', 'Güvenlik paneli');
    await dkdImportModule('./assets/v2.5.runtime.js', 'Güvenlik paneli', 35000);

    dkdSetBootProgress(74, 'Tema geçişleri bağlanıyor');
    await dkdAppendStyleLink('./assets/v2.6.runtime.css', 'dkdWebV26Runtime', 'Tema geçişleri');
    await dkdImportModule('./assets/v2.6.runtime.js', 'Tema geçişleri');

    dkdSetBootProgress(81, 'Modern panel tamamlanıyor');
    await dkdImportModule('./assets/v2.7.guard.js', 'Modern panel koruması');
    await dkdAppendStyleLink('./assets/v2.7.css', 'dkdWebV27', 'Modern panel');
    await dkdImportModule('./assets/v2.7.js', 'Modern panel');
  } else {
    dkdSetBootProgress(81, 'Bağımsız Sade Tema hazırlanıyor');
  }

  dkdSetBootProgress(86, 'Sade Tema güvenlik ekranı hazırlanıyor');
  await dkdAppendStyleLink('./assets/v2.8.css', 'dkdWebV28', 'Sade Tema');
  await dkdImportModule('./assets/v2.8.js', 'Sade Tema güvenlik ekranı');
  await dkdImportModule('./assets/v2.8.1.js', 'DraBornGate ikonu');
  await dkdImportModule('./assets/v3.1.1.moto.js', 'Motosiklet ikonu');

  dkdSetBootProgress(91, 'Güncel arayüz stilleri yükleniyor');
  await dkdAppendStyleLink('./assets/v3.0.css', 'dkdWebV30', 'v3 arayüzü');
  await dkdAppendStyleLink('./assets/v3.1.1.css', 'dkdWebV311', 'v3.1 arayüzü');

  dkdSetBootProgress(94, 'Canlı veri sistemi bağlanıyor');
  await dkdImportModule('./assets/v3.2.1.data.js', 'Public RPC köprüsü');
  await dkdImportModule('./assets/v3.2.1.js', 'Canlı veri arayüzü');

  dkdSetBootProgress(97, 'v3.2.7 ekranları tamamlanıyor');
  await dkdAppendStyleLink('./assets/v3.2.4.runtime.css', 'dkdWebV324Runtime', 'v3.2.4');
  await dkdAppendStyleLink('./assets/v3.2.5.runtime.css', 'dkdWebV325Runtime', 'v3.2.5');
  await dkdAppendStyleLink('./assets/v3.2.7.css', 'dkdWebV327', 'v3.2.7');
  await dkdImportModule('./assets/v3.2.7-r4.js', 'v3.2.7 statik özellikleri', 35000);

  await dkdWaitForV327SimpleReady();
  dkdFinishBoot();
}

dkdBootWebV327R4().catch(dkdShowBootError);
