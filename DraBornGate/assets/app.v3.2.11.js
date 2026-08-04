const DKD_V3211_BOOT_VERSION = '3.2.11';

await import(`./v3.2.11.guard.js?v=${DKD_V3211_BOOT_VERSION}`);
await import(`./app.js?v=${DKD_V3211_BOOT_VERSION}-core`);

function dkdV3211BootIsSimple() {
  const dkdPath = String(location.pathname || '').toLocaleLowerCase('tr-TR');
  return dkdPath.includes('guvenlik-sade-tema')
    || sessionStorage.getItem('dkd_gate_security_theme') === 'simple'
    || sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

async function dkdV3211BootWait(dkdTimeout = 30000) {
  const dkdStarted = Date.now();
  while (Date.now() - dkdStarted < dkdTimeout) {
    if (window.dkdV31Data && document.body && document.querySelector('#dkd-app')) return;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 100));
  }
  throw new Error('DraBornGate v3.2.11 veri katmanı zamanında hazırlanamadı.');
}

async function dkdV3211BootStyle() {
  if (document.querySelector('link[data-dkd-web-v3211]')) return;
  await new Promise((dkdResolve, dkdReject) => {
    const dkdLink = document.createElement('link');
    dkdLink.rel = 'stylesheet';
    dkdLink.href = `./assets/v3.2.11.css?v=${DKD_V3211_BOOT_VERSION}`;
    dkdLink.dataset.dkdWebV3211 = 'true';
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error('v3.2.11 arayüz dosyası yüklenemedi.'));
    document.head.appendChild(dkdLink);
  });
}

await dkdV3211BootWait();
if (!dkdV3211BootIsSimple()) {
  await dkdV3211BootStyle();
  await import(`./v3.2.11.js?v=${DKD_V3211_BOOT_VERSION}`);
}

document.documentElement.dataset.dkdGateVersion = DKD_V3211_BOOT_VERSION;
sessionStorage.setItem('dkd_gate_web_version', DKD_V3211_BOOT_VERSION);
