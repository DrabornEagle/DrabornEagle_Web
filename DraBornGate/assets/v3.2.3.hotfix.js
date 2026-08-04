const DKD_V323_HOTFIX_VERSION = '3.2.3';

async function dkdV323WaitForLegacyRuntime(dkdTimeoutMs = 20000) {
  const dkdStartedAt = Date.now();
  while (Date.now() - dkdStartedAt < dkdTimeoutMs) {
    if (window.dkdV31Data?.state && document.querySelector('#dkd-v31-root, [data-dkd-v31-menu], #dkd-v28-root')) return;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 120));
  }
  throw new Error('DraBornGate temel arayüzü v3.2.3 için hazır olmadı.');
}

sessionStorage.setItem('dkd_gate_web_version', DKD_V323_HOTFIX_VERSION);
await dkdV323WaitForLegacyRuntime();
await import(`./v3.2.3.data.js?v=${DKD_V323_HOTFIX_VERSION}`);
await import(`./v3.2.3.ui.js?v=${DKD_V323_HOTFIX_VERSION}`);

window.dkdV31Data.loadPartnerSummary().catch(() => undefined);
window.dkdV31Data.loadAdminCatalog().then(() => {
  document.body.appendChild(Object.assign(document.createElement('i'), { hidden: true }));
}).catch(() => undefined);
