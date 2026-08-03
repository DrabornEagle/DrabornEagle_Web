const DKD_CACHE = 'draborngate-web-v2.8.0';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=2.8.0',
  '/DraBornGate/assets/v2.1-fixes.css?v=2.8.0',
  '/DraBornGate/assets/v2.2.css?v=2.8.0',
  '/DraBornGate/assets/v2.3.css?v=2.8.0',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=2.8.0',
  '/DraBornGate/assets/v2.5.css.payload.txt?v=2.8.0',
  '/DraBornGate/assets/v2.6.css.payload.txt?v=2.8.0',
  '/DraBornGate/assets/v2.7.css?v=2.8.0',
  '/DraBornGate/assets/v2.8.css?v=2.8.0',
  '/DraBornGate/assets/app.js?v=2.8.0',
  '/DraBornGate/assets/v2.3.js?v=2.8.0',
  '/DraBornGate/assets/v2.4.js.payload.txt?v=2.8.0',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=2.8.0',
  '/DraBornGate/assets/v2.5.js.payload.2.txt?v=2.8.0',
  '/DraBornGate/assets/v2.5.js.payload.3.txt?v=2.8.0',
  '/DraBornGate/assets/v2.5.js.payload.4.txt?v=2.8.0',
  '/DraBornGate/assets/v2.5.js.payload.5.txt?v=2.8.0',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=2.8.0',
  '/DraBornGate/assets/v2.7.guard.js?v=2.8.0',
  '/DraBornGate/assets/v2.7.js?v=2.8.0',
  '/DraBornGate/assets/v2.8.js?v=2.8.0',
  '/DraBornGate/manifest.webmanifest?v=2.8.0'
];

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.open(DKD_CACHE)
      .then((dkdCache) => dkdCache.addAll(DKD_ASSETS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.keys().then((dkdKeys) => Promise.all(
      dkdKeys.filter((dkdKey) => dkdKey !== DKD_CACHE).map((dkdKey) => caches.delete(dkdKey))
    ))
  );
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
