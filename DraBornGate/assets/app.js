const dkdRoot = document.querySelector('#dkd-app');
const DKD_WEB_VERSION = '2.7.0';

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
  if (!response.ok) throw new Error(`DraBornGate Web v${DKD_WEB_VERSION} paketi alınamadı (${response.status}).`);
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

async function dkdAppendPackedStyle(dkdPath, dkdDatasetKey) {
  const dkdPayload = await dkdReadPayload(`${dkdPath}?v=${DKD_WEB_VERSION}`);
  const dkdStyle = document.createElement('style');
  dkdStyle.dataset[dkdDatasetKey] = 'true';
  dkdStyle.textContent = await dkdUnpack(dkdPayload);
  document.head.appendChild(dkdStyle);
}

async function dkdAppendStyleLink(dkdPath, dkdDatasetKey) {
  await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${dkdPath}?v=${DKD_WEB_VERSION}`;
    link.dataset[dkdDatasetKey] = 'true';
    link.onload = resolve;
    link.onerror = () => reject(new Error(`${dkdPath} yüklenemedi.`));
    document.head.appendChild(link);
  });
}

async function dkdReadJoinedPayload(dkdPattern, dkdCount) {
  const dkdPaths = Array.from({ length: dkdCount }, (_, dkdIndex) => `${dkdPattern}.${dkdIndex + 1}.txt?v=${DKD_WEB_VERSION}`);
  return (await Promise.all(dkdPaths.map(dkdReadPayload))).join('');
}

async function dkdBootWebV27() {
  dkdPrepareCleanPersonalRoute();
  await dkdAppendPackedStyle('./assets/app.v2.css.payload.txt', 'dkdWebV2');

  const dkdCorePayload = await dkdReadJoinedPayload('./assets/app.v2.payload', 4);
  await dkdImportSource(await dkdUnpack(dkdCorePayload));
  await import(`./v2.3.js?v=${DKD_WEB_VERSION}`);

  await dkdAppendPackedStyle('./assets/v2.4.css.payload.txt', 'dkdWebV24');
  await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.4.js.payload.txt?v=${DKD_WEB_VERSION}`)));

  await dkdAppendPackedStyle('./assets/v2.5.css.payload.txt', 'dkdWebV25');
  const dkdV25Payload = await dkdReadJoinedPayload('./assets/v2.5.js.payload', 5);
  await dkdImportSource(await dkdUnpack(dkdV25Payload));

  await dkdAppendPackedStyle('./assets/v2.6.css.payload.txt', 'dkdWebV26');
  await dkdImportSource(await dkdUnpack(await dkdReadPayload(`./assets/v2.6.js.payload.txt?v=${DKD_WEB_VERSION}`)));

  await dkdAppendStyleLink('./assets/v2.7.css', 'dkdWebV27');
  await import(`./v2.7.js?v=${DKD_WEB_VERSION}`);
}

dkdBootWebV27().catch((error) => {
  console.error(error);
  const splash = document.querySelector('#dkd-v27-splash') || document.querySelector('#dkd-v26-splash');
  if (splash) splash.classList.add('is-hidden');
  dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v${DKD_WEB_VERSION} açılamadı</strong><span>${String(error?.message || error)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
});
