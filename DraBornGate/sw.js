const DKD_CACHE = 'draborngate-web-v3.1.1-auth-admin-hotfix';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=3.1.1',
  '/DraBornGate/assets/v2.1-fixes.css?v=3.1.1',
  '/DraBornGate/assets/v2.2.css?v=3.1.1',
  '/DraBornGate/assets/v2.3.css?v=3.1.1',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=3.1.1',
  '/DraBornGate/assets/v2.5.css.payload.txt?v=3.1.1',
  '/DraBornGate/assets/v2.6.css.payload.txt?v=3.1.1',
  '/DraBornGate/assets/v2.7.css?v=3.1.1',
  '/DraBornGate/assets/v2.8.css?v=3.1.1',
  '/DraBornGate/assets/v3.0.css?v=3.1.1',
  '/DraBornGate/assets/v3.1.1.css?v=3.1.1',
  '/DraBornGate/assets/app.js?v=3.1.1',
  '/DraBornGate/assets/v2.3.js?v=3.1.1',
  '/DraBornGate/assets/v2.4.js.payload.txt?v=3.1.1',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=3.1.1',
  '/DraBornGate/assets/v2.5.js.payload.2.txt?v=3.1.1',
  '/DraBornGate/assets/v2.5.js.payload.3.txt?v=3.1.1',
  '/DraBornGate/assets/v2.5.js.payload.4.txt?v=3.1.1',
  '/DraBornGate/assets/v2.5.js.payload.5.txt?v=3.1.1',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=3.1.1',
  '/DraBornGate/assets/v2.7.guard.js?v=3.1.1',
  '/DraBornGate/assets/v2.7.js?v=3.1.1',
  '/DraBornGate/assets/v2.8.js?v=3.1.1',
  '/DraBornGate/assets/v2.8.1.js?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.guard.js?v=3.1.1',
  '/DraBornGate/assets/v3.1.1.moto.js?v=3.1.1',
  '/DraBornGate/assets/v3.1.1.data.js?v=3.1.1',
  '/DraBornGate/assets/v3.1.1.js?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.1.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.2.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.3.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.4.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.5.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.6.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.css.part.7.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.1.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.2.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.3.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.4.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.5.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.6.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.7.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.8.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.9.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.10.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.11.txt?v=3.1.1',
  '/DraBornGate/assets/v3.1.0.js.part.12.txt?v=3.1.1',
  '/DraBornGate/manifest.webmanifest?v=3.1.1'
];

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(caches.open(DKD_CACHE).then((dkdCache) => dkdCache.addAll(DKD_ASSETS)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil(caches.keys().then((dkdKeys) => Promise.all(
    dkdKeys.filter((dkdKey) => dkdKey !== DKD_CACHE).map((dkdKey) => caches.delete(dkdKey))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (dkdEvent) => {
  if (dkdEvent.request.method !== 'GET' || !dkdEvent.request.url.includes('/DraBornGate/')) return;
  dkdEvent.respondWith(
    fetch(dkdEvent.request).then((dkdResponse) => {
      const dkdCopy = dkdResponse.clone();
      caches.open(DKD_CACHE).then((dkdCache) => dkdCache.put(dkdEvent.request, dkdCopy)).catch(() => undefined);
      return dkdResponse;
    }).catch(() => caches.match(dkdEvent.request).then((dkdCached) => dkdCached || caches.match('/DraBornGate/')))
  );
});
