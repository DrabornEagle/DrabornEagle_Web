const DKD_V324_SESSION_LOADER_VERSION = '3.2.4';
const dkdV324SessionPayloadUrl = new URL('./v3.2.4.session.js.payload.txt', import.meta.url);
dkdV324SessionPayloadUrl.searchParams.set('v', DKD_V324_SESSION_LOADER_VERSION);
const dkdV324SessionResponse = await fetch(dkdV324SessionPayloadUrl, { cache: 'no-store' });
if (!dkdV324SessionResponse.ok) throw new Error(`DraBornGate v${DKD_V324_SESSION_LOADER_VERSION} rol ve çıkış paketi yüklenemedi (${dkdV324SessionResponse.status}).`);
const dkdV324SessionBase64 = (await dkdV324SessionResponse.text()).trim();
const dkdV324SessionBinary = atob(dkdV324SessionBase64);
const dkdV324SessionBytes = Uint8Array.from(dkdV324SessionBinary, (dkdCharacter) => dkdCharacter.charCodeAt(0));
const dkdV324SessionSource = await new Response(new Blob([dkdV324SessionBytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
const dkdV324SessionModuleUrl = URL.createObjectURL(new Blob([dkdV324SessionSource], { type: 'text/javascript' }));
try { await import(dkdV324SessionModuleUrl); } finally { URL.revokeObjectURL(dkdV324SessionModuleUrl); }
