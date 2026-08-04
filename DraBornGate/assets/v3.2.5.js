const DKD_V325_VERSION = '3.2.5';

async function dkdV325LoadPackedModule(dkdFileName, dkdLabel) {
  const dkdPayloadUrl = new URL(dkdFileName, import.meta.url);
  dkdPayloadUrl.searchParams.set('v', DKD_V325_VERSION);
  const dkdResponse = await fetch(dkdPayloadUrl, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`DraBornGate v${DKD_V325_VERSION} ${dkdLabel} paketi yüklenemedi (${dkdResponse.status}).`);
  const dkdBase64 = (await dkdResponse.text()).trim();
  const dkdBinary = atob(dkdBase64);
  const dkdBytes = Uint8Array.from(dkdBinary, (dkdCharacter) => dkdCharacter.charCodeAt(0));
  const dkdSource = await new Response(new Blob([dkdBytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  const dkdModuleUrl = URL.createObjectURL(new Blob([dkdSource], { type: 'text/javascript' }));
  try {
    await import(dkdModuleUrl);
  } finally {
    URL.revokeObjectURL(dkdModuleUrl);
  }
}

await import(`./v3.2.5.stability.js?v=${DKD_V325_VERSION}`);
await dkdV325LoadPackedModule('./v3.2.4.js.payload.txt', 'temel arayüz');
await dkdV325LoadPackedModule('./v3.2.5.session.js.payload.txt', 'oturum ve rol');
await dkdV325LoadPackedModule('./v3.2.5.features.js.payload.txt', 'popup, Admin ve kazanç');
sessionStorage.setItem('dkd_gate_web_version', DKD_V325_VERSION);
