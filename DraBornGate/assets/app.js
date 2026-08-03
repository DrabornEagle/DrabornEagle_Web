const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '2.4.0';

function dkdPrepareCleanPersonalRoute() {
  const reserved = new Set(['privacy', 'data-safety', 'account-deletion', 'subscriptions', 'support', 'terms', 'assets', 'guvenlik-sade-tema']);
  const storedRoute = sessionStorage.getItem('dkd_gate_route');
  if (!storedRoute) return;
  let pathname = storedRoute;
  try { pathname = new URL(storedRoute, location.origin).pathname; } catch { pathname = String(storedRoute).split(/[?#]/)[0]; }
  const parts = pathname.split('/').filter(Boolean);
  const routeName = String(parts[1] || '').toLocaleLowerCase('tr-TR');
  if (parts[0] !== 'DraBornGate' || parts.length !== 2) return;
  if (routeName === 'guvenlik-sade-tema') {
    sessionStorage.removeItem('dkd_gate_route');
    sessionStorage.setItem('dkd_gate_security_theme', 'simple');
    sessionStorage.setItem('dkd_gate_force_theme', 'simple');
    return;
  }
  if (reserved.has(routeName)) return;
  sessionStorage.removeItem('dkd_gate_route');
  sessionStorage.setItem('dkd_gate_clean_personal_route', `/DraBornGate/${parts[1]}`);
}

async function dkdReadPayload(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`DraBornGate Web v2.4 paketi alınamadı (${response.status}).`);
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

async function dkdImportSource(dkdSource) {
  const dkdModuleUrl = URL.createObjectURL(new Blob([dkdSource], { type: 'text/javascript' }));
  try { await import(dkdModuleUrl); } finally { URL.revokeObjectURL(dkdModuleUrl); }
}

async function dkdBootWebV24() {
  dkdPrepareCleanPersonalRoute();
  const cssPayload = await dkdReadPayload(`./assets/app.v2.css.payload.txt?v=${DKD_WEB_VERSION}`);
  const cssSource = await dkdUnpack(cssPayload);
  const style = document.createElement('style');
  style.dataset.dkdWebV2 = 'true';
  style.textContent = cssSource;
  document.head.appendChild(style);

  const partPaths = [1, 2, 3, 4].map((part) => `./assets/app.v2.payload.${part}.txt?v=${DKD_WEB_VERSION}`);
  const jsPayload = (await Promise.all(partPaths.map(dkdReadPayload))).join('');
  await dkdImportSource(await dkdUnpack(jsPayload));
  await import(`./v2.3.js?v=${DKD_WEB_VERSION}`);

  const themeCssPayload = await dkdReadPayload(`./assets/v2.4.css.payload.txt?v=${DKD_WEB_VERSION}`);
  const themeStyle = document.createElement('style');
  themeStyle.dataset.dkdWebV24 = 'true';
  themeStyle.textContent = await dkdUnpack(themeCssPayload);
  document.head.appendChild(themeStyle);

  const themeJsPayload = await dkdReadPayload(`./assets/v2.4.js.payload.txt?v=${DKD_WEB_VERSION}`);
  await dkdImportSource(await dkdUnpack(themeJsPayload));
}

dkdBootWebV24().catch((error) => {
  console.error(error);
  dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v2.4 açılamadı</strong><span>${String(error?.message || error)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
});
