const DKD_V324_VERSION = '3.2.4';

async function dkdV324ReadPayload() {
  const dkdPayloadUrl = new URL('./v3.2.4.js.payload.txt', import.meta.url);
  dkdPayloadUrl.searchParams.set('v', DKD_V324_VERSION);
  const dkdResponse = await fetch(dkdPayloadUrl, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`DraBornGate v${DKD_V324_VERSION} arayüz paketi yüklenemedi (${dkdResponse.status}).`);
  return (await dkdResponse.text()).trim();
}

async function dkdV324Unpack(dkdBase64) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Tarayıcınız modern sıkıştırma desteği sunmuyor.');
  const dkdBinary = atob(dkdBase64);
  const dkdCompressed = Uint8Array.from(dkdBinary, (dkdCharacter) => dkdCharacter.charCodeAt(0));
  const dkdStream = new Blob([dkdCompressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(dkdStream).text();
}

const dkdV324Source = await dkdV324Unpack(await dkdV324ReadPayload());
const dkdV324ModuleUrl = URL.createObjectURL(new Blob([dkdV324Source], { type: 'text/javascript' }));
try {
  await import(dkdV324ModuleUrl);
} finally {
  URL.revokeObjectURL(dkdV324ModuleUrl);
}
