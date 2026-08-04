const DKD_V3212_BOOT_VERSION = '3.2.12';

document.documentElement.classList.add('dkd-v3212-booting');
await import(`./v3.2.12.guard.js?v=${DKD_V3212_BOOT_VERSION}`);

const dkdV3212WorkerState = { restored: false, started: false };
const dkdV3212WorkerPrototype = typeof ServiceWorkerContainer !== 'undefined' ? ServiceWorkerContainer.prototype : null;
const dkdV3212OriginalRegister = dkdV3212WorkerPrototype?.register;

function dkdV3212RestoreWorkerRegister() {
  if (dkdV3212WorkerState.restored || !dkdV3212WorkerPrototype || !dkdV3212OriginalRegister) return;
  dkdV3212WorkerState.restored = true;
  Object.defineProperty(dkdV3212WorkerPrototype, 'register', {
    configurable: true,
    writable: true,
    value: dkdV3212OriginalRegister,
  });
}

if (dkdV3212WorkerPrototype && dkdV3212OriginalRegister) {
  Object.defineProperty(dkdV3212WorkerPrototype, 'register', {
    configurable: true,
    writable: true,
    value: function dkdV3212FastRegister(dkdUrl, dkdOptions) {
      if (!dkdV3212WorkerState.started) {
        dkdV3212WorkerState.started = true;
        void dkdV3212OriginalRegister.call(this, `./sw.js?v=${DKD_V3212_BOOT_VERSION}`, {
          ...(dkdOptions || {}),
          scope: '/DraBornGate/',
          updateViaCache: 'none',
        }).then((dkdRegistration) => dkdRegistration.update().catch(() => undefined)).catch(() => undefined);
      }
      return Promise.resolve({ update: async () => undefined });
    },
  });
}

await import(`./app.js?v=${DKD_V3212_BOOT_VERSION}-core`);

function dkdV3212BootIsSimple() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema')
    || sessionStorage.getItem('dkd_gate_security_theme') === 'simple'
    || sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

async function dkdV3212BootWait(dkdTimeout = 22000) {
  const dkdStarted = Date.now();
  while (Date.now() - dkdStarted < dkdTimeout) {
    if (window.dkdV31Data && document.body && document.querySelector('#dkd-app')) return;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 80));
  }
  throw new Error('DraBornGate v3.2.12 çalışma ortamı zamanında hazırlanamadı.');
}

async function dkdV3212BootStyle(dkdPath, dkdDatasetKey) {
  if (document.querySelector(`link[data-${dkdDatasetKey}]`)) return;
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_V3212_BOOT_VERSION}`;
    dkdLink.setAttribute(`data-${dkdDatasetKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3212ReleaseBoot() {
  document.documentElement.classList.remove('dkd-simple-booting', 'dkd-v3212-booting');
  window.dkdSetBootProgress?.(100, 'Hazır');
  const dkdSplash = document.querySelector('#dkd-v28-splash');
  dkdSplash?.classList.add('is-hidden');
  setTimeout(() => dkdSplash?.remove(), 460);
}

function dkdV3212BootError(dkdError) {
  console.error(dkdError);
  dkdV3212RestoreWorkerRegister();
  document.documentElement.classList.remove('dkd-simple-booting', 'dkd-v3212-booting');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  const dkdLabel = document.querySelector('#dkd-v28-progress-label');
  if (dkdLabel) dkdLabel.textContent = `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`;
  if (dkdRetry) dkdRetry.hidden = false;
}

try {
  await dkdV3212BootWait();
  const dkdSimple = dkdV3212BootIsSimple();
  window.dkdSetBootProgress?.(99, 'Eski arayüz kalıntıları temizleniyor');

  if (!dkdSimple) {
    await dkdV3212BootStyle('./assets/v3.2.11.css', 'dkd-web-v3211');
    await import(`./v3.2.11.js?v=${DKD_V3212_BOOT_VERSION}`);
  }

  await dkdV3212BootStyle('./assets/v3.2.12.css', 'dkd-web-v3212');
  await import(`./v3.2.12.js?v=${DKD_V3212_BOOT_VERSION}`);

  document.documentElement.dataset.dkdGateVersion = DKD_V3212_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3212_BOOT_VERSION);
  dkdV3212RestoreWorkerRegister();
  dkdV3212ReleaseBoot();
} catch (dkdError) {
  dkdV3212BootError(dkdError);
}
