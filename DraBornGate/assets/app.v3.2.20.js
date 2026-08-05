const DKD_V3220_BOOT_VERSION = '3.2.20';
const DKD_V3220_BOOT_REVISION = 'single-earnings-color-small-moto1';
const DKD_V3220_RELEASE = `${DKD_V3220_BOOT_VERSION}-${DKD_V3220_BOOT_REVISION}`;

function dkdV3220WaitFor(dkdCheck, dkdTimeout = 18000) {
  return new Promise((dkdResolve, dkdReject) => {
    const dkdStartedAt = Date.now();
    const dkdPoll = () => {
      if (dkdCheck()) {
        dkdResolve();
        return;
      }
      if (Date.now() - dkdStartedAt >= dkdTimeout) {
        dkdReject(new Error('DraBornGate temel uygulaması zamanında hazırlanamadı.'));
        return;
      }
      setTimeout(dkdPoll, 80);
    };
    dkdPoll();
  });
}

async function dkdV3220Style(dkdPath, dkdKey) {
  if (document.querySelector(`link[data-${dkdKey}]`)) return;
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_V3220_RELEASE}`;
    dkdLink.setAttribute(`data-${dkdKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3220StampRelease() {
  document.documentElement.dataset.dkdGateVersion = DKD_V3220_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3220_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', DKD_V3220_RELEASE);
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3220_BOOT_VERSION;
  window.__DKD_GATE_V3220_ACTIVE__ = true;
  window.dkdV3220Cleanup?.();
}

async function dkdV3220Start() {
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3220_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', DKD_V3220_RELEASE);
  document.documentElement.dataset.dkdGateVersion = DKD_V3220_BOOT_VERSION;

  await import(`./v3.2.20.guard.js?v=${DKD_V3220_RELEASE}`);
  await import(`./app.v3.2.19.js?v=${DKD_V3220_RELEASE}-base`);
  await dkdV3220WaitFor(() => window.__DKD_GATE_V3219_ACTIVE__ === true);

  await dkdV3220Style('./assets/v3.2.20.css', 'dkd-web-v3220');
  await import(`./v3.2.20.js?v=${DKD_V3220_RELEASE}-ui`);
  dkdV3220StampRelease();

  if ('serviceWorker' in navigator) {
    const dkdRegistration = await navigator.serviceWorker.register(
      `./sw.js?v=${DKD_V3220_RELEASE}`,
      { scope: '/DraBornGate/', updateViaCache: 'none' }
    );
    await dkdRegistration.update().catch(() => undefined);
    dkdRegistration.waiting?.postMessage('SKIP_WAITING');
  }
}

function dkdV3220Failure(dkdError) {
  console.error('DraBornGate v3.2.20 yükseltme hatası:', dkdError);
  document.documentElement.classList.remove('dkd-simple-booting');
  const dkdLabel = document.querySelector('#dkd-v28-progress-label');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  if (dkdLabel) dkdLabel.textContent = `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`;
  if (dkdRetry) dkdRetry.hidden = false;
}

dkdV3220Start().catch(dkdV3220Failure);
