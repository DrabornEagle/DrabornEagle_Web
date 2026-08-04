const DKD_V3212_BOOT_VERSION = '3.2.12';
const dkdV3212WorkerState = {
  container: null,
  originalOwnDescriptor: null,
  originalRegister: null,
  patched: false,
  started: false,
};

function dkdV3212SetProgress(dkdPercent, dkdLabel) {
  window.dkdSetBootProgress?.(dkdPercent, dkdLabel);
  const dkdFill = document.querySelector('#dkd-v28-progress-fill');
  const dkdProgress = document.querySelector('#dkd-v28-progress');
  const dkdText = document.querySelector('#dkd-v28-progress-label');
  const dkdSafe = Math.max(0, Math.min(100, Number(dkdPercent) || 0));
  if (dkdFill) dkdFill.style.width = `${dkdSafe}%`;
  if (dkdProgress) dkdProgress.setAttribute('aria-valuenow', String(Math.round(dkdSafe)));
  if (dkdText && dkdLabel) dkdText.textContent = dkdLabel;
}

function dkdV3212InstallFastWorkerRegister() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker?.register) return;
  try {
    const dkdContainer = navigator.serviceWorker;
    const dkdOriginalRegister = dkdContainer.register.bind(dkdContainer);
    dkdV3212WorkerState.container = dkdContainer;
    dkdV3212WorkerState.originalOwnDescriptor = Object.getOwnPropertyDescriptor(dkdContainer, 'register') || null;
    dkdV3212WorkerState.originalRegister = dkdOriginalRegister;

    Object.defineProperty(dkdContainer, 'register', {
      configurable: true,
      writable: true,
      value(dkdUrl, dkdOptions) {
        if (!dkdV3212WorkerState.started) {
          dkdV3212WorkerState.started = true;
          setTimeout(() => {
            void dkdOriginalRegister(`./sw.js?v=${DKD_V3212_BOOT_VERSION}-hotfix`, {
              ...(dkdOptions || {}),
              scope: '/DraBornGate/',
              updateViaCache: 'none',
            }).then((dkdRegistration) => dkdRegistration.update().catch(() => undefined)).catch(() => undefined);
          }, 0);
        }
        return Promise.resolve({ update: async () => undefined });
      },
    });
    dkdV3212WorkerState.patched = true;
  } catch (dkdError) {
    console.warn('DraBornGate Service Worker hızlandırması uygulanamadı; normal açılış kullanılacak.', dkdError);
  }
}

function dkdV3212RestoreWorkerRegister() {
  if (!dkdV3212WorkerState.patched || !dkdV3212WorkerState.container) return;
  try {
    if (dkdV3212WorkerState.originalOwnDescriptor) {
      Object.defineProperty(dkdV3212WorkerState.container, 'register', dkdV3212WorkerState.originalOwnDescriptor);
    } else {
      delete dkdV3212WorkerState.container.register;
    }
  } catch (dkdError) {
    console.warn('DraBornGate Service Worker kaydı geri yüklenemedi.', dkdError);
  } finally {
    dkdV3212WorkerState.patched = false;
  }
}

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
    dkdLink.href = `${dkdPath}?v=${DKD_V3212_BOOT_VERSION}-hotfix`;
    dkdLink.setAttribute(`data-${dkdDatasetKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3212ReleaseBoot() {
  document.documentElement.classList.remove('dkd-simple-booting', 'dkd-v3212-booting');
  dkdV3212SetProgress(100, 'Hazır');
  const dkdSplash = document.querySelector('#dkd-v28-splash');
  dkdSplash?.classList.add('is-hidden');
  setTimeout(() => dkdSplash?.remove(), 460);
}

function dkdV3212BootError(dkdError) {
  console.error(dkdError);
  dkdV3212RestoreWorkerRegister();
  document.documentElement.classList.remove('dkd-simple-booting', 'dkd-v3212-booting');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  dkdV3212SetProgress(100, `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`);
  if (dkdRetry) dkdRetry.hidden = false;
}

async function dkdV3212Start() {
  document.documentElement.classList.add('dkd-v3212-booting');
  dkdV3212SetProgress(3, 'Açılış koruması hazırlanıyor');
  await import(`./v3.2.12.guard.js?v=${DKD_V3212_BOOT_VERSION}-hotfix`);

  dkdV3212InstallFastWorkerRegister();
  dkdV3212SetProgress(5, 'Ana uygulama başlatılıyor');
  await import(`./app.js?v=${DKD_V3212_BOOT_VERSION}-hotfix-core`);

  await dkdV3212BootWait();
  const dkdSimple = dkdV3212BootIsSimple();
  dkdV3212SetProgress(98, 'Güncel arayüz sonlandırılıyor');

  if (!dkdSimple) {
    await dkdV3212BootStyle('./assets/v3.2.11.css', 'dkd-web-v3211');
    await import(`./v3.2.11.js?v=${DKD_V3212_BOOT_VERSION}-hotfix`);
  }

  await dkdV3212BootStyle('./assets/v3.2.12.css', 'dkd-web-v3212');
  await import(`./v3.2.12.js?v=${DKD_V3212_BOOT_VERSION}-hotfix`);

  document.documentElement.dataset.dkdGateVersion = DKD_V3212_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3212_BOOT_VERSION);
  dkdV3212RestoreWorkerRegister();
  dkdV3212ReleaseBoot();
}

dkdV3212Start().catch(dkdV3212BootError);
