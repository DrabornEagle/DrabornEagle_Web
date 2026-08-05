const DKD_V3218_LOCK_VERSION = '3.2.18';

function dkdV3218LockVersion() {
  if (document.documentElement.dataset.dkdGateVersion !== DKD_V3218_LOCK_VERSION) {
    document.documentElement.dataset.dkdGateVersion = DKD_V3218_LOCK_VERSION;
  }
  if (sessionStorage.getItem('dkd_gate_web_version') !== DKD_V3218_LOCK_VERSION) {
    sessionStorage.setItem('dkd_gate_web_version', DKD_V3218_LOCK_VERSION);
  }
}

new MutationObserver(dkdV3218LockVersion).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-dkd-gate-version'],
});

dkdV3218LockVersion();
window.__DKD_GATE_V3218_VERSION_LOCK__ = true;
