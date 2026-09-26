(() => {
  let dkdSupportFrame = null;
  let dkdSupportReady = false;
  let dkdPendingOptions = null;

  const dkdWarmSupport = () => {
    if (location.protocol === 'file:' || dkdSupportFrame?.isConnected) return;

    const dkdFrame = document.createElement('iframe');
    dkdFrame.src = '/Support/';
    dkdFrame.title = 'DraBornEagle Support';
    dkdFrame.tabIndex = -1;
    dkdFrame.setAttribute('aria-hidden', 'true');
    dkdFrame.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;border:0';
    dkdFrame.addEventListener('load', () => {
      dkdSupportReady = true;
      if (dkdPendingOptions) {
        const dkdOptions = dkdPendingOptions;
        dkdPendingOptions = null;
        dkdShowSupport(dkdOptions);
      }
    }, { once: true });

    document.body.appendChild(dkdFrame);
    dkdSupportFrame = dkdFrame;
  };

  const dkdShowSupport = (dkdOptions = {}) => {
    if (DKD.supportOpen) return;
    if (!dkdSupportFrame?.isConnected) dkdWarmSupport();
    if (!dkdSupportFrame || !dkdSupportReady) {
      dkdPendingOptions = dkdOptions;
      return;
    }

    const dkdOverlay = document.createElement('div');
    dkdOverlay.id = 'dkd-support-overlay';
    dkdOverlay.setAttribute('role', 'dialog');
    dkdOverlay.setAttribute('aria-modal', 'true');
    dkdOverlay.setAttribute('aria-label', 'DraBornEagle Support');

    dkdSupportFrame.removeAttribute('aria-hidden');
    dkdSupportFrame.removeAttribute('tabindex');
    dkdSupportFrame.removeAttribute('style');
    dkdOverlay.appendChild(dkdSupportFrame);
    document.body.appendChild(dkdOverlay);

    document.getElementById('viewport').inert = true;
    DKD.supportOpen = true;
    document.title = 'DraBornEagle Support | Bir Kahve, Yeni Bir Evren';

    if (dkdOptions.history !== false) {
      try {
        history.pushState({ ...DKD.historySnapshot('support'), support: true }, '', '/Support/');
      } catch {}
    }
  };

  const dkdOriginalCloseSupport = DKD.closeSupport;
  DKD.openSupport = dkdShowSupport;
  DKD.closeSupport = () => {
    if (!DKD.supportOpen) return;
    dkdOriginalCloseSupport();
    dkdSupportFrame = null;
    dkdSupportReady = false;
    dkdPendingOptions = null;
    const dkdRewarm = () => dkdWarmSupport();
    if ('requestIdleCallback' in window) requestIdleCallback(dkdRewarm, { timeout: 1200 });
    else setTimeout(dkdRewarm, 150);
  };

  dkdWarmSupport();
})();
