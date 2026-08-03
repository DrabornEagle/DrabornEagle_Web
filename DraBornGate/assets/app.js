const dkdRoot = document.querySelector('#dkd-app');

async function dkdReadPayload(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`DraBornGate web paketi alınamadı (${response.status}).`);
  return (await response.text()).trim();
}
async function dkdUnpack(base64) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Bu tarayıcı gerekli modern sıkıştırma desteğini sunmuyor. Chrome, Edge, Firefox veya Safari güncel sürümünü kullanın.');
  const binary = atob(base64);
  const compressed = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) compressed[index] = binary.charCodeAt(index);
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}
async function dkdBootWebV1() {
  const cssPayload = await dkdReadPayload('./assets/app.css.payload.txt?v=1.0.0');
  const cssSource = await dkdUnpack(cssPayload);
  const style = document.createElement('style');
  style.dataset.dkdWebV1 = 'true';
  style.textContent = cssSource;
  document.head.appendChild(style);

  const partPaths = [1, 2, 3, 4, 5, 6].map((part) => `./assets/app.payload.${part}.txt?v=1.0.0`);
  const jsPayload = (await Promise.all(partPaths.map(dkdReadPayload))).join('');
  const source = await dkdUnpack(jsPayload);
  const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  try { await import(moduleUrl); }
  finally { URL.revokeObjectURL(moduleUrl); }
}
dkdBootWebV1().catch((error) => {
  console.error(error);
  dkdRoot.innerHTML = `<div class="dkd-boot"><div class="dkd-boot-mark">!</div><strong>Web paneli açılamadı</strong><span>${String(error?.message || error)}</span><a class="btn" href="./">Tekrar Dene</a></div>`;
});
