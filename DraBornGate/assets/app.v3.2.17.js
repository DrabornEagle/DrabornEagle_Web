const DKD_V3217_BOOT_VERSION = '3.2.17';
const DKD_V3217_BOOT_REVISION = 'stable-earnings-gate-moto1';

function dkdV3217BootFailure(dkdError) {
  console.error('DraBornGate v3.2.17 açılış hatası:', dkdError);
  document.documentElement.classList.remove('dkd-simple-booting');
  const dkdMessage = String(dkdError?.message || dkdError || 'Bilinmeyen açılış hatası');
  const dkdLabel = document.querySelector('#dkd-v28-progress-label');
  const dkdFill = document.querySelector('#dkd-v28-progress-fill');
  const dkdProgress = document.querySelector('#dkd-v28-progress');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  if (dkdLabel) dkdLabel.textContent = `Yükleme tamamlanamadı: ${dkdMessage}`;
  if (dkdFill) dkdFill.style.width = '100%';
  if (dkdProgress) dkdProgress.setAttribute('aria-valuenow', '100');
  if (dkdRetry) dkdRetry.hidden = false;
}

function dkdV3217BootIsSimple() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema')
    || sessionStorage.getItem('dkd_gate_security_theme') === 'simple'
    || sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

function dkdV3217ResetStaleDom() {
  if (!document.body) return;
  for (const dkdChild of [...document.body.children]) {
    if (dkdChild.matches('#dkd-v28-splash,#dkd-app,.ambient,noscript,script')) continue;
    dkdChild.remove();
  }
  const dkdRoot = document.querySelector('#dkd-app');
  if (dkdRoot) {
    dkdRoot.innerHTML = '<div class="boot-shell"><div class="boot-logo"><span>DBG</span></div><div class="boot-copy"><strong>DraBornGate Web v3.2.17</strong><span>Kararlı Kazançlarım, kapı seçimi ve kurye ikonları hazırlanıyor</span></div><div class="boot-progress"><i></i></div></div>';
  }
}

async function dkdV3217PrepareFreshRuntime() {
  dkdV3217ResetStaleDom();
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3217_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', `${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}`);
  document.documentElement.dataset.dkdGateVersion = DKD_V3217_BOOT_VERSION;

  if ('caches' in window) {
    const dkdCacheKeys = await caches.keys().catch(() => []);
    await Promise.all(dkdCacheKeys
      .filter((dkdKey) => dkdKey.startsWith('draborngate-web-'))
      .map((dkdKey) => caches.delete(dkdKey)));
  }

  if ('serviceWorker' in navigator) {
    const dkdRegistrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
    await Promise.all(dkdRegistrations
      .filter((dkdRegistration) => String(dkdRegistration.scope || '').includes('/DraBornGate/'))
      .map((dkdRegistration) => dkdRegistration.update().catch(() => undefined)));
  }
}

async function dkdV3217BootWait(dkdTimeout = 30000) {
  const dkdStarted = Date.now();
  while (Date.now() - dkdStarted < dkdTimeout) {
    if (window.dkdV31Data && document.body && document.querySelector('#dkd-app')) return;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 100));
  }
  throw new Error('DraBornGate v3.2.17 veri katmanı zamanında hazırlanamadı.');
}

async function dkdV3217BootStyle(dkdPath, dkdDatasetKey) {
  if (document.querySelector(`link[data-${dkdDatasetKey}]`)) return;
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}`;
    dkdLink.setAttribute(`data-${dkdDatasetKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3217PartnerDataBridge(dkdOriginalData) {
  return new Proxy(dkdOriginalData, {
    get(dkdTarget, dkdProperty, dkdReceiver) {
      if (dkdProperty !== 'rpc') return Reflect.get(dkdTarget, dkdProperty, dkdReceiver);
      return async (dkdFunctionName, dkdArguments = {}) => {
        const dkdResult = await dkdTarget.rpc(dkdFunctionName, dkdArguments);
        if (dkdFunctionName !== 'dkd_gate_current_user_context_v325' || !dkdResult || typeof dkdResult !== 'object') return dkdResult;
        const dkdRole = String(dkdResult.preferred_role || '').toLocaleLowerCase('tr-TR');
        return dkdRole === 'courier'
          ? { ...dkdResult, preferred_role: 'kurye', preferred_role_code: 'courier' }
          : dkdResult;
      };
    },
  });
}

async function dkdV3217RegisterWorker() {
  if (!('serviceWorker' in navigator)) return;
  const dkdRegistration = await navigator.serviceWorker.register(
    `./sw.js?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}`,
    { scope: '/DraBornGate/', updateViaCache: 'none' }
  );
  await dkdRegistration.update().catch(() => undefined);
  dkdRegistration.waiting?.postMessage('SKIP_WAITING');
}

async function dkdV3217Start() {
  await import(`./v3.2.17.guard.js?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}`);
  await dkdV3217PrepareFreshRuntime();
  await import(`./app.js?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}-core`);
  await dkdV3217BootWait();

  if (!dkdV3217BootIsSimple()) {
    await dkdV3217BootStyle('./assets/v3.2.11.css', 'dkd-web-v3211');
    await dkdV3217BootStyle('./assets/v3.2.15.css', 'dkd-web-v3215');
    await dkdV3217BootStyle('./assets/v3.2.17.css', 'dkd-web-v3217');
    const dkdOriginalData = window.dkdV31Data;
    window.dkdV31Data = dkdV3217PartnerDataBridge(dkdOriginalData);
    try {
      await import(`./v3.2.11.js?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}-earnings`);
      const dkdOriginalSetInterval = window.setInterval;
      window.setInterval = (dkdCallback, dkdDelay, ...dkdArguments) => {
        if (Number(dkdDelay) === 1200 && String(dkdCallback).includes('dkdV3215Apply')) return -3215;
        return dkdOriginalSetInterval(dkdCallback, dkdDelay, ...dkdArguments);
      };
      try {
        await import(`./v3.2.15.js?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}-motorcycle`);
      } finally {
        window.setInterval = dkdOriginalSetInterval;
      }
      await import(`./v3.2.17.js?v=${DKD_V3217_BOOT_VERSION}-${DKD_V3217_BOOT_REVISION}-stable-ui`);
    } finally {
      window.dkdV31Data = dkdOriginalData;
    }
  }

  document.documentElement.dataset.dkdGateVersion = DKD_V3217_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3217_BOOT_VERSION);
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3217_BOOT_VERSION;
  window.__DKD_GATE_V3217_ACTIVE__ = true;
  await dkdV3217RegisterWorker();
  window.dkdV3217Cleanup?.();
}

dkdV3217Start().catch(dkdV3217BootFailure);
