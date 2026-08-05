const DKD_V3218_BOOT_VERSION = '3.2.18';
const DKD_V3218_BOOT_REVISION = 'single-earnings-stable-gate1';

function dkdV3218LoadStyle(dkdPath, dkdKey) {
  if (document.querySelector(`link[data-${dkdKey}]`)) return Promise.resolve();
  return new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `${dkdPath}?v=${DKD_V3218_BOOT_VERSION}-${DKD_V3218_BOOT_REVISION}`;
    dkdLink.setAttribute(`data-${dkdKey}`, 'true');
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(dkdLink);
  });
}

async function dkdV3218Start() {
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3218_BOOT_VERSION);
  localStorage.setItem('dkd_gate_last_web_release', `${DKD_V3218_BOOT_VERSION}-${DKD_V3218_BOOT_REVISION}`);
  document.documentElement.dataset.dkdGateVersion = DKD_V3218_BOOT_VERSION;

  await import(`./app.v3.2.17.js?v=${DKD_V3218_BOOT_VERSION}-${DKD_V3218_BOOT_REVISION}-base`);
  await dkdV3218LoadStyle('./assets/v3.2.18.css', 'dkd-web-v3218');
  await import(`./v3.2.18.js?v=${DKD_V3218_BOOT_VERSION}-${DKD_V3218_BOOT_REVISION}-ui`);

  document.documentElement.dataset.dkdGateVersion = DKD_V3218_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3218_BOOT_VERSION);
  window.__DKD_GATE_WEB_VERSION__ = DKD_V3218_BOOT_VERSION;
  window.__DKD_GATE_V3218_ACTIVE__ = true;
}

dkdV3218Start().catch((dkdError) => {
  console.error('DraBornGate v3.2.18 açılış hatası:', dkdError);
  const dkdLabel = document.querySelector('#dkd-v28-progress-label');
  const dkdRetry = document.querySelector('#dkd-v28-retry');
  if (dkdLabel) dkdLabel.textContent = `Yükleme tamamlanamadı: ${String(dkdError?.message || dkdError)}`;
  if (dkdRetry) dkdRetry.hidden = false;
});
