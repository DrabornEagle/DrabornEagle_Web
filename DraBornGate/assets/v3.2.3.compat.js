const DKD_V323_COMPAT_VERSION = '3.2.3';

const dkdV323CompatStyle = document.createElement('style');
dkdV323CompatStyle.dataset.dkdV323Compat = 'true';
dkdV323CompatStyle.textContent = '.dkd-v323-legacy-site-search{display:none!important}';
document.head.appendChild(dkdV323CompatStyle);

function dkdV323ProtectLegacySiteSearch(dkdRoot = document) {
  const dkdWidgets = dkdRoot.matches?.('.dkd-v23-site-search')
    ? [dkdRoot]
    : [...(dkdRoot.querySelectorAll?.('.dkd-v23-site-search') || [])];

  for (const dkdWidget of dkdWidgets) {
    if (dkdWidget.dataset.dkdV323Protected === 'true') continue;
    dkdWidget.dataset.dkdV323Protected = 'true';
    dkdWidget.classList.add('dkd-v323-legacy-site-search');
    dkdWidget.hidden = true;
    Object.defineProperty(dkdWidget, 'remove', {
      configurable: true,
      value() {
        this.hidden = true;
        this.classList.add('dkd-v323-legacy-site-search');
      },
    });
  }
}

dkdV323ProtectLegacySiteSearch(document);
new MutationObserver((dkdMutations) => {
  for (const dkdMutation of dkdMutations) {
    for (const dkdNode of dkdMutation.addedNodes) {
      if (dkdNode instanceof Element) dkdV323ProtectLegacySiteSearch(dkdNode);
    }
  }
}).observe(document.body, { childList: true, subtree: true });

window.__DKD_GATE_V323_COMPAT__ = DKD_V323_COMPAT_VERSION;
