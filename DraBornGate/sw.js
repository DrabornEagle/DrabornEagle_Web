const DKD_CACHE = 'draborngate-web-v3.2.9-isolated-simple-stable-site-popup';
const DKD_FALLBACK = '/DraBornGate/';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=3.2.9',
  '/DraBornGate/assets/v2.1-fixes.css?v=3.2.9',
  '/DraBornGate/assets/v2.2.css?v=3.2.9',
  '/DraBornGate/assets/v2.3.css?v=3.2.9',
  '/DraBornGate/assets/app.v2.css.payload.txt?v=3.2.9',
  '/DraBornGate/assets/app.v2.payload.1.txt?v=3.2.9',
  '/DraBornGate/assets/app.v2.payload.2.txt?v=3.2.9',
  '/DraBornGate/assets/app.v2.payload.3.txt?v=3.2.9',
  '/DraBornGate/assets/app.v2.payload.4.txt?v=3.2.9',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v2.4.js.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v2.5.css.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=3.2.9',
  '/DraBornGate/assets/v2.5.js.payload.2.txt?v=3.2.9',
  '/DraBornGate/assets/v2.5.js.payload.3.txt?v=3.2.9',
  '/DraBornGate/assets/v2.5.js.payload.4.txt?v=3.2.9',
  '/DraBornGate/assets/v2.5.js.payload.5.txt?v=3.2.9',
  '/DraBornGate/assets/v2.6.css.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v2.7.css?v=3.2.9',
  '/DraBornGate/assets/v2.7.guard.js?v=3.2.9',
  '/DraBornGate/assets/v2.7.js?v=3.2.9',
  '/DraBornGate/assets/v2.8.1.js?v=3.2.9',
  '/DraBornGate/assets/v3.0.css?v=3.2.9',
  '/DraBornGate/assets/v3.1.1.css?v=3.2.9',
  '/DraBornGate/assets/v3.1.1.moto.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.4.css.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v3.2.5.css.payload.txt?v=3.2.9',
  '/DraBornGate/assets/v3.2.1.data.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.1.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.4.data.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.4.auth.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.4.auth.js.payload.txt?v=3.2.4',
  '/DraBornGate/assets/v3.2.4.session.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.4.session.js.payload.txt?v=3.2.4',
  '/DraBornGate/assets/v3.1.1.data.js?v=3.2.4-session-refresh-lock',
  '/DraBornGate/assets/v3.1.0.css.part.1.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.css.part.2.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.css.part.3.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.css.part.4.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.css.part.5.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.css.part.6.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.css.part.7.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.1.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.2.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.3.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.4.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.5.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.6.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.7.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.8.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.9.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.10.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.11.txt?v=3.2.1',
  '/DraBornGate/assets/v3.1.0.js.part.12.txt?v=3.2.1',
  '/DraBornGate/assets/v3.2.9.guard.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.9.simple.css?v=3.2.9',
  '/DraBornGate/assets/v3.2.9.simple.js?v=3.2.9',
  '/DraBornGate/assets/v3.2.9.css?v=3.2.9',
  '/DraBornGate/assets/v3.2.9.js?v=3.2.9',
  '/DraBornGate/assets/app.js?v=3.2.9',
  '/DraBornGate/manifest.webmanifest?v=3.2.9'
];
self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(caches.open(DKD_CACHE).then((dkdCache) => dkdCache.addAll(DKD_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil(caches.keys().then((dkdKeys) => Promise.all(dkdKeys.filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_CACHE).map((dkdKey) => caches.delete(dkdKey)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (dkdEvent) => {
  if (dkdEvent.request.method !== 'GET' || !dkdEvent.request.url.includes('/DraBornGate/')) return;
  const dkdRequest = new Request(dkdEvent.request, { cache: 'no-store' });
  dkdEvent.respondWith(fetch(dkdRequest).then((dkdResponse) => {
    if (!dkdResponse || !dkdResponse.ok) return dkdResponse;
    const dkdCopy = dkdResponse.clone();
    caches.open(DKD_CACHE).then((dkdCache) => dkdCache.put(dkdEvent.request, dkdCopy)).catch(() => undefined);
    return dkdResponse;
  }).catch(async () => {
    const dkdCached = await caches.match(dkdEvent.request);
    if (dkdCached) return dkdCached;
    if (dkdEvent.request.mode === 'navigate') return caches.match(DKD_FALLBACK);
    return Response.error();
  }));
});
