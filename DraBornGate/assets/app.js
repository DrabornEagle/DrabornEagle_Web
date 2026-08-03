const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '2.3.0';

function dkdPrepareCleanPersonalRoute() {
  const reserved = new Set(['privacy', 'data-safety', 'account-deletion', 'subscriptions', 'support', 'terms', 'assets']);
  const storedRoute = sessionStorage.getItem('dkd_gate_route');
  if (!storedRoute) return;
  let pathname = storedRoute;
  try { pathname = new URL(storedRoute, location.origin).pathname; } catch { pathname = String(storedRoute).split(/[?#]/)[0]; }
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'DraBornGate' || parts.length !== 2 || reserved.has(parts[1])) return;
  sessionStorage.removeItem('dkd_gate_route');
  sessionStorage.setItem('dkd_gate_clean_personal_route', `/DraBornGate/${parts[1]}`);
}

async function dkdReadPayload(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`DraBornGate Web v2.3 paketi alınamadı (${response.status}).`);
  return (await response.text()).trim();
}

async function dkdUnpack(base64) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Tarayıcınız modern sıkıştırma desteği sunmuyor. Güncel Chrome, Edge, Firefox veya Safari kullanın.');
  const binary = atob(base64);
  const compressed = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) compressed[index] = binary.charCodeAt(index);
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

async function dkdBootWebV23() {
  dkdPrepareCleanPersonalRoute();
  const cssPayload = await dkdReadPayload(`./assets/app.v2.css.payload.txt?v=${DKD_WEB_VERSION}`);
  const cssSource = await dkdUnpack(cssPayload);
  const style = document.createElement('style');
  style.dataset.dkdWebV2 = 'true';
  style.textContent = cssSource;
  document.head.appendChild(style);

  const partPaths = [1, 2, 3, 4].map((part) => `./assets/app.v2.payload.${part}.txt?v=${DKD_WEB_VERSION}`);
  const jsPayload = (await Promise.all(partPaths.map(dkdReadPayload))).join('');
  const source = await dkdUnpack(jsPayload);
  const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  try {
    await import(moduleUrl);
    await import(`./v2.3.js?v=${DKD_WEB_VERSION}`);
  } finally {
    URL.revokeObjectURL(moduleUrl);
  }
}

dkdBootWebV23().catch((error) => {
  console.error(error);
  dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v2.3 açılamadı</strong><span>${String(error?.message || error)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
});
