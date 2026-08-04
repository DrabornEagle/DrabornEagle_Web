const DKD_V324_AUTH_LOADER_VERSION = '3.2.4';
const dkdV324AuthPayloadUrl = new URL('./v3.2.4.auth.js.payload.txt', import.meta.url);
dkdV324AuthPayloadUrl.searchParams.set('v', DKD_V324_AUTH_LOADER_VERSION);
const dkdV324AuthResponse = await fetch(dkdV324AuthPayloadUrl, { cache: 'no-store' });
if (!dkdV324AuthResponse.ok) throw new Error(`DraBornGate v${DKD_V324_AUTH_LOADER_VERSION} oturum paketi yüklenemedi (${dkdV324AuthResponse.status}).`);
const dkdV324AuthBase64 = (await dkdV324AuthResponse.text()).trim();
const dkdV324AuthBinary = atob(dkdV324AuthBase64);
const dkdV324AuthBytes = Uint8Array.from(dkdV324AuthBinary, (dkdCharacter) => dkdCharacter.charCodeAt(0));
const dkdV324AuthSource = await new Response(new Blob([dkdV324AuthBytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
const dkdV324AuthModuleUrl = URL.createObjectURL(new Blob([dkdV324AuthSource], { type: 'text/javascript' }));
try { await import(dkdV324AuthModuleUrl); } finally { URL.revokeObjectURL(dkdV324AuthModuleUrl); }
