const dkdRoot = document.querySelector('#dkd-app');

async function dkdReadPayload(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`DraBornGate Web v2.0 paketi alınamadı (${response.status}).`);
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

async function dkdBootWebV2() {
  const cssPayload = await dkdReadPayload('./assets/app.v2.css.payload.txt?v=2.0.0');
  const cssSource = await dkdUnpack(cssPayload);
  const style = document.createElement('style');
  style.dataset.dkdWebV2 = 'true';
  style.textContent = cssSource;
  document.head.appendChild(style);

  const partPaths = [1, 2, 3, 4].map((part) => `./assets/app.v2.payload.${part}.txt?v=2.0.0`);
  const jsPayload = (await Promise.all(partPaths.map(dkdReadPayload))).join('');
  const source = await dkdUnpack(jsPayload);
  const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  try { await import(moduleUrl); }
  finally { URL.revokeObjectURL(moduleUrl); }
}

dkdBootWebV2().catch((error) => {
  console.error(error);
  dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web v2.0 açılamadı</strong><span>${String(error?.message || error)}</span></div><button class="boot-retry" onclick="location.reload()">Tekrar Dene</button></div>`;
});
