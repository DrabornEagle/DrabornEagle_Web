(() => {
  const DKD_RECOVERY_VERSION = '2.9.1';
  const DKD_RECOVERY_KEY = 'dkd_gate_boot_recovery_version';
  const DKD_RECOVERY_ATTEMPT_KEY = 'dkd_gate_boot_recovery_attempt';

  function dkdRecoverySetStatus(dkdMessage, dkdShowRetry = false) {
    const dkdLabel = document.querySelector('#dkd-v28-progress-label');
    const dkdFill = document.querySelector('#dkd-v28-progress-fill');
    const dkdRetry = document.querySelector('#dkd-v28-retry');
    if (dkdLabel) dkdLabel.textContent = dkdMessage;
    if (dkdFill) dkdFill.style.width = '100%';
    if (dkdRetry && dkdShowRetry) dkdRetry.hidden = false;
  }

  async function dkdRecoveryClearLegacyRuntime() {
    const dkdTasks = [];
    if ('serviceWorker' in navigator) {
      dkdTasks.push(
        navigator.serviceWorker.getRegistrations()
          .then((dkdRegistrations) => Promise.allSettled(
            dkdRegistrations
              .filter((dkdRegistration) => String(dkdRegistration.scope || '').includes('/DraBornGate/'))
              .map((dkdRegistration) => dkdRegistration.unregister())
          ))
          .catch(() => undefined)
      );
    }
    if ('caches' in window) {
      dkdTasks.push(
        caches.keys()
          .then((dkdKeys) => Promise.allSettled(
            dkdKeys
              .filter((dkdKey) => dkdKey.startsWith('draborngate-web-'))
              .map((dkdKey) => caches.delete(dkdKey))
          ))
          .catch(() => undefined)
      );
    }
    await Promise.allSettled(dkdTasks);
  }

  async function dkdRecoveryReloadOnce() {
    if (sessionStorage.getItem(DKD_RECOVERY_ATTEMPT_KEY) === DKD_RECOVERY_VERSION) return false;
    sessionStorage.setItem(DKD_RECOVERY_ATTEMPT_KEY, DKD_RECOVERY_VERSION);
    dkdRecoverySetStatus('Eski önbellek temizleniyor, güvenli bağlantı yenileniyor…');
    await dkdRecoveryClearLegacyRuntime();
    const dkdUrl = new URL(location.href);
    dkdUrl.searchParams.set('dkd_boot_recovery', DKD_RECOVERY_VERSION.replace(/\./g, ''));
    dkdUrl.searchParams.set('dkd_boot_time', String(Date.now()));
    location.replace(dkdUrl.toString());
    return true;
  }

  async function dkdRecoveryInitialReset() {
    const dkdStoredVersion = localStorage.getItem(DKD_RECOVERY_KEY);
    if (dkdStoredVersion === DKD_RECOVERY_VERSION) return;
    localStorage.setItem(DKD_RECOVERY_KEY, DKD_RECOVERY_VERSION);
    await dkdRecoveryReloadOnce();
  }

  function dkdRecoveryWatchBoot() {
    const dkdStartedAt = Date.now();
    const dkdTimer = setInterval(async () => {
      if (document.body.classList.contains('dkd-web-ready')) {
        clearInterval(dkdTimer);
        sessionStorage.removeItem(DKD_RECOVERY_ATTEMPT_KEY);
        return;
      }
      if (Date.now() - dkdStartedAt < 11000) return;
      clearInterval(dkdTimer);
      const dkdReloaded = await dkdRecoveryReloadOnce();
      if (!dkdReloaded) {
        dkdRecoverySetStatus('Açılış tamamlanamadı. Tekrar Dene düğmesine dokunun.', true);
      }
    }, 350);
  }

  window.addEventListener('DOMContentLoaded', () => {
    void dkdRecoveryInitialReset().finally(dkdRecoveryWatchBoot);
  }, { once: true });
})();
