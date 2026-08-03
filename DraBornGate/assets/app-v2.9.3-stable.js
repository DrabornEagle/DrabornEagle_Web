const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '2.9.3';
let dkdBootFinished = false;

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

function dkdRemoveBlockingLayers() {
  document.body?.classList.remove('dkd-v29-simple-active', 'dkd-v28-simple-active');
  document.documentElement.removeAttribute('data-dkd-v29-simple');
  document.documentElement.removeAttribute('data-dkd-v28-simple');
  document.querySelector('#dkd-v29-root')?.remove();
  document.querySelector('#dkd-v28-root')?.remove();

  if (document.body) {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = '';
    document.body.removeAttribute('inert');
  }
  if (dkdRoot) {
    dkdRoot.style.pointerEvents = 'auto';
    dkdRoot.style.visibility = 'visible';
    dkdRoot.removeAttribute('inert');
  }
  document.querySelectorAll('[inert]').forEach((dkdElement) => dkdElement.removeAttribute('inert'));
}

function dkdDisableBrokenSimpleEntry() {
  const dkdCandidates = [...document.querySelectorAll('a,button,[role="button"]')];
  for (const dkdElement of dkdCandidates) {
    const dkdLabel = [
      dkdElement.textContent,
      dkdElement.getAttribute('aria-label'),
      dkdElement.getAttribute('title'),
    ].filter(Boolean).join(' ').toLocaleLowerCase('tr-TR');
    if (!dkdLabel.includes('sade tema')) continue;
    dkdElement.remove();
  }
}

function dkdFinishBoot(dkdLabel = 'Hazır') {
  if (dkdBootFinished) return;
  dkdBootFinished = true;
  clearTimeout(dkdBootWatchdog);
  dkdRemoveBlockingLayers();
  document.body?.classList.add('dkd-web-ready');
  dkdSetBootProgress(100, dkdLabel);

  const dkdSplash = document.querySelector('#dkd-v28-splash');
  if (dkdSplash) {
    dkdSplash.style.pointerEvents = 'none';
    dkdSplash.classList.add('is-hidden');
    setTimeout(() => dkdSplash.remove(), 280);
  }

  dkdDisableBrokenSimpleEntry();
  setTimeout(dkdDisableBrokenSimpleEntry, 800);
  setTimeout(dkdDisableBrokenSimpleEntry, 2200);
}

const dkdBootWatchdog = setTimeout(() => {
  dkdFinishBoot('Güvenlik paneli açıldı');
}, 8000);

function dkdResetThemeState() {
  sessionStorage.removeItem('dkd_gate_security_theme');
  sessionStorage.removeItem('dkd_gate_force_theme');
  sessionStorage.removeItem('dkd_gate_route');
  sessionStorage.removeItem('dkd_gate_clean_personal_route');
  sessionStorage.setItem('dkd_gate_security_theme', 'modern');
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
  const dkdTimer = setTimeout(() => dkdController.abort(), 6000);
  try {
    const dkdResponse = await fetch(dkdPath, {
      cache: 'no-store',
      signal: dkdController.signal,
    });
    if (!dkdResponse.ok) throw new Error(`Paket alınamadı (${dkdResponse.status}).`);
    return (await dkdResponse.text()).trim();
  } finally {
    clearTimeout(dkdTimer);
  }
}

async function dkdUnpack(dkdBase64) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Tarayıcı sıkıştırma desteği sunmuyor.');
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
  await dkdWithTimeout(new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_WEB_VERSION}`;
    dkdLink.dataset[dkdDatasetKey] = 'true';
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  }), 3500, `${dkdPath} zaman aşımına uğradı.`);
}

async function dkdReadJoinedPayload(dkdPattern, dkdCount) {
  const dkdPaths = Array.from(
    { length: dkdCount },
    (_, dkdIndex) => `${dkdPattern}.${dkdIndex + 1}.txt?v=${DKD_WEB_VERSION}`
  );
  return (await Promise.all(dkdPaths.map(dkdReadPayload))).join('');
}

function dkdShowBootError(dkdError) {
  console.error(dkdError);
  dkdRemoveBlockingLayers();
  document.body?.classList.add('dkd-web-ready');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdSetBootProgress(100, `Açılış tamamlanamadı: ${String(dkdError?.message || dkdError)}`);
  if (dkdRetry) {
    dkdRetry.hidden = false;
    dkdRetry.style.pointerEvents = 'auto';
  }
}

async function dkdBootStablePanel() {
  dkdResetThemeState();
  dkdRemoveBlockingLayers();

  dkdSetBootProgress(8, 'Arayüz yükleniyor');
  await dkdAppendPackedStyle('./assets/app.v2.css.payload.txt', 'dkdWebV2');

  dkdSetBootProgress(20, 'Güvenlik çekirdeği alınıyor');
  const dkdCorePayload = await dkdReadJoinedPayload('./assets/app.v2.payload', 4);

  dkdSetBootProgress(36, 'Güvenlik çekirdeği hazırlanıyor');
  await dkdImportSource(await dkdUnpack(dkdCorePayload));

  dkdSetBootProgress(50, 'Oturum ve roller bağlanıyor');
  await dkdWithTimeout(import(`./v2.3.js?v=${DKD_WEB_VERSION}`), 4500, 'Oturum modülü zaman aşımına uğradı.');

  dkdSetBootProgress(62, 'Modern Güvenlik paneli hazırlanıyor');
  await dkdAppendPackedStyle('./assets/v2.4.css.payload.txt', 'dkdWebV24');
  await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.4.js.payload.txt?v=${DKD_WEB_VERSION}`)));

  dkdSetBootProgress(72, 'Güvenlik araçları bağlanıyor');
  await dkdAppendPackedStyle('./assets/v2.5.css.payload.txt', 'dkdWebV25');
  await dkdImportSource(await dkdUnpack(await dkdReadJoinedPayload('./assets/v2.5.js.payload', 5)));

  dkdSetBootProgress(82, 'Panel etkileşimleri hazırlanıyor');
  await dkdAppendPackedStyle('./assets/v2.6.css.payload.txt', 'dkdWebV26');
  await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.6.js.payload.txt?v=${DKD_WEB_VERSION}`)));

  dkdSetBootProgress(90, 'Güvenlik paneli açılıyor');
  await dkdWithTimeout(import(`./v2.7.guard.js?v=${DKD_WEB_VERSION}`), 3500, 'Panel koruması zaman aşımına uğradı.');
  await dkdAppendStyleLink('./assets/v2.7.css', 'dkdWebV27');
  await dkdWithTimeout(import(`./v2.7.js?v=${DKD_WEB_VERSION}`), 3500, 'Panel modülü zaman aşımına uğradı.');

  dkdFinishBoot('Güvenlik paneli hazır');
}

dkdBootStablePanel().catch(dkdShowBootError);
