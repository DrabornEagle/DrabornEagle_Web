(() => {
  const DKD_V327_BOOT_UNLOCK = '3.2.7-r2';
  window.__DKD_GATE_V327_BOOT_UNLOCK__ = {
    version: DKD_V327_BOOT_UNLOCK,
    startedAt: Date.now(),
  };
  sessionStorage.setItem('dkd_gate_boot_unlock', DKD_V327_BOOT_UNLOCK);

  function dkdV327RunCacheCleanupInBackground(dkdNativeKeys) {
    void dkdNativeKeys()
      .then((dkdKeys) => Promise.allSettled(
        dkdKeys
          .filter((dkdKey) => String(dkdKey || '').startsWith('draborngate-web-'))
          .map((dkdKey) => caches.delete(dkdKey))
      ))
      .catch(() => undefined);
  }

  if ('caches' in window && typeof caches.keys === 'function') {
    const dkdNativeKeys = caches.keys.bind(caches);
    try {
      Object.defineProperty(caches, 'keys', {
        configurable: true,
        value() {
          try {
            delete caches.keys;
          } catch {
            // Prototype method remains available even if deleting the temporary override fails.
          }
          dkdV327RunCacheCleanupInBackground(dkdNativeKeys);
          return Promise.resolve([]);
        },
      });
    } catch {
      dkdV327RunCacheCleanupInBackground(dkdNativeKeys);
    }
  }

  if ('serviceWorker' in navigator && typeof navigator.serviceWorker.register === 'function') {
    const dkdNativeRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
    try {
      Object.defineProperty(navigator.serviceWorker, 'register', {
        configurable: true,
        value(...dkdArguments) {
          try {
            delete navigator.serviceWorker.register;
          } catch {
            // Prototype method remains available even if deleting the temporary override fails.
          }

          const dkdRegistrationTask = dkdNativeRegister(...dkdArguments).catch(() => null);
          const dkdFacade = {
            update() {
              void dkdRegistrationTask
                .then((dkdRegistration) => dkdRegistration?.update?.())
                .catch(() => undefined);
              return Promise.resolve();
            },
          };
          return Promise.resolve(dkdFacade);
        },
      });
    } catch {
      // Service worker maintenance is optional; the application must still start.
    }
  }
})();
