const DKD_V3221_BOOT_VERSION = '3.2.21';
const DKD_V3221_BOOT_REVISION = 'earnings-courier-role-link-fix1';
const DKD_V3221_RELEASE = `${DKD_V3221_BOOT_VERSION}-${DKD_V3221_BOOT_REVISION}`;

function dkdV3221WaitFor(dkdCheck, dkdTimeout = 18000) {
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

async function dkdV3221Style(dkdPath, dkdKey) {
  if (document.querySelector(`link[data-${dkdKey}]`)) return;
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_V3221_RELEASE}`;
    dkdLink.setAttribute(`data-${dkdKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3221StampRelease() {
  document.documentElement.dataset.dkdGateVersion = DKD_V3221_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3221_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', DKD_V3221_RELEASE);
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3221_BOOT_VERSION;
  window.__DKD_GATE_V3221_ACTIVE__ = true;
  window.dkdV3221Cleanup?.();
}

async function dkdV3221Start() {
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3221_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', DKD_V3221_RELEASE);
  document.documentElement.dataset.dkdGateVersion = DKD_V3221_BOOT_VERSION;

  await import(`./v3.2.21.guard.js?v=${DKD_V3221_RELEASE}`);
  await import(`./v3.2.21.earnings-fix.js?v=${DKD_V3221_RELEASE}`);
  await import(`./app.v3.2.19.js?v=${DKD_V3221_RELEASE}-base`);
  await dkdV3221WaitFor(() => window.__DKD_GATE_V3219_ACTIVE__ === true);

  await dkdV3221Style('./assets/v3.2.20.css', 'dkd-web-v3220');
  await import(`./v3.2.21.js?v=${DKD_V3221_RELEASE}-ui`);
  dkdV3221StampRelease();

  if ('serviceWorker' in navigator) {
    const dkdRegistration = await navigator.serviceWorker.register(
      `./sw.js?v=${DKD_V3221_RELEASE}`,
      { scope: '/DraBornGate/', updateViaCache: 'none' }
    );
    await dkdRegistration.update().catch(() => undefined);
    dkdRegistration.waiting?.postMessage('SKIP_WAITING');
  }
}

function dkdV3221Failure(dkdError) {
  console.error('DraBornGate v3.2.21 yükseltme hatası:', dkdError);
  document.documentElement.classList.remove('dkd-simple-booting');
  const dkdLabel = document.querySelector('#dkd-v28-progress-label');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  if (dkdLabel) dkdLabel.textContent = `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`;
  if (dkdRetry) dkdRetry.hidden = false;
}

dkdV3221Start().catch(dkdV3221Failure);
