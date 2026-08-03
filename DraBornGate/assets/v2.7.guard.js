const DKD_V27_LEGACY_SELECTOR = '[class*="dkd-v24"],[class*="dkd-v25"],[class*="dkd-v26"],[data-dkd-v24-theme],[data-dkd-v25-theme],[data-dkd-v26-theme]';
const dkdV27QueueClickTimes = new WeakMap();

function dkdV27GuardNormalize(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV27MarkLegacyThemeNodes(root = document) {
  for (const element of root.querySelectorAll(DKD_V27_LEGACY_SELECTOR)) {
    if (element.closest('#dkd-v27-root')) continue;
    element.classList.add('dkd-v26-simple-legacy');
  }
}

function dkdV27IsQueueNavigation(element) {
  const text = dkdV27GuardNormalize(element?.textContent || element?.getAttribute?.('aria-label'));
  return text.includes('kurye kodu dogrula') || text === 'kurye kuyrugu' || text.includes('gecis talepleri');
}

document.addEventListener('click', (event) => {
  if (sessionStorage.getItem('dkd_gate_security_theme') !== 'simple' &&
      sessionStorage.getItem('dkd_gate_force_theme') !== 'simple' &&
      !location.pathname.toLocaleLowerCase('tr-TR').includes('guvenlik-sade-tema')) return;
  const target = event.target?.closest?.('button,a,[role="button"]');
  if (!target || target.closest('#dkd-v27-root') || !dkdV27IsQueueNavigation(target)) return;
  const now = Date.now();
  const previous = dkdV27QueueClickTimes.get(target) || 0;
  if (now - previous < 3500) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  dkdV27QueueClickTimes.set(target, now);
}, true);

dkdV27MarkLegacyThemeNodes();
new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches(DKD_V27_LEGACY_SELECTOR)) node.classList.add('dkd-v26-simple-legacy');
      dkdV27MarkLegacyThemeNodes(node);
    }
  }
}).observe(document.body, { childList: true, subtree: true });
