const DKD_V3211_BOOT_VERSION = '3.2.11';
const DKD_V3211_BOOT_REVISION = 'bootfix1';

function dkdV3211BootFailure(dkdError) {
  console.error('DraBornGate v3.2.11 açılış hatası:', dkdError);
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
    dkdLink.href = `./assets/v3.2.11.css?v=${DKD_V3211_BOOT_VERSION}-${DKD_V3211_BOOT_REVISION}`;
    dkdLink.dataset.dkdWebV3211 = 'true';
    dkdLink.onload = dkdResolve;
    dkdLink.onerror = () => dkdReject(new Error('v3.2.11 arayüz dosyası yüklenemedi.'));
    document.head.appendChild(dkdLink);
  });
}

function dkdV3211PartnerDataBridge(dkdOriginalData) {
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

async function dkdV3211Start() {
  await import(`./v3.2.11.guard.js?v=${DKD_V3211_BOOT_VERSION}-${DKD_V3211_BOOT_REVISION}`);
  await import(`./app.js?v=${DKD_V3211_BOOT_VERSION}-${DKD_V3211_BOOT_REVISION}-core`);
  await dkdV3211BootWait();

  if (!dkdV3211BootIsSimple()) {
    await dkdV3211BootStyle();
    const dkdOriginalData = window.dkdV31Data;
    window.dkdV31Data = dkdV3211PartnerDataBridge(dkdOriginalData);
    try {
      await import(`./v3.2.11.js?v=${DKD_V3211_BOOT_VERSION}-${DKD_V3211_BOOT_REVISION}-courier-role`);
    } finally {
      window.dkdV31Data = dkdOriginalData;
    }
  }

  document.documentElement.dataset.dkdGateVersion = DKD_V3211_BOOT_VERSION;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V3211_BOOT_VERSION);
}

dkdV3211Start().catch(dkdV3211BootFailure);
