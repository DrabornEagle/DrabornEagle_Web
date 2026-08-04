const DKD_CACHE = 'draborngate-web-v3.2.4-courier-admin-premium';
const DKD_FALLBACK = '/DraBornGate/';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/manifest.webmanifest?v=3.2.4',
  '/DraBornGate/assets/app.js?v=3.2.4',
  '/DraBornGate/assets/app.css?v=3.2.4',
  '/DraBornGate/assets/v2.1-fixes.css?v=3.2.4',
  '/DraBornGate/assets/v2.2.css?v=3.2.4',
  '/DraBornGate/assets/v2.3.css?v=3.2.4',
  '/DraBornGate/assets/v3.2.4.guard.js?v=3.2.4',
  '/DraBornGate/assets/v3.2.4.data.js?v=3.2.4',
  '/DraBornGate/assets/v3.2.4.css?v=3.2.4',
  '/DraBornGate/assets/v3.2.4.js?v=3.2.4',
  '/DraBornGate/assets/v3.2.4.patch.js?v=3.2.4'
];

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(caches.open(DKD_CACHE).then((dkdCache) => dkdCache.addAll(DKD_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.keys()
      .then((dkdKeys) => Promise.all(
        dkdKeys
          .filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_CACHE)
          .map((dkdKey) => caches.delete(dkdKey))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (dkdEvent) => {
  if (dkdEvent.request.method !== 'GET' || !dkdEvent.request.url.includes('/DraBornGate/')) return;

  const dkdRequest = dkdEvent.request.mode === 'navigate'
    ? new Request(dkdEvent.request, { cache: 'no-store' })
    : dkdEvent.request;

  dkdEvent.respondWith(
    fetch(dkdRequest)
      .then((dkdResponse) => {
        if (!dkdResponse || !dkdResponse.ok) return dkdResponse;
        const dkdCopy = dkdResponse.clone();
        caches.open(DKD_CACHE)
          .then((dkdCache) => dkdCache.put(dkdEvent.request, dkdCopy))
          .catch(() => undefined);
        return dkdResponse;
      })
      .catch(async () => {
        const dkdCached = await caches.match(dkdEvent.request);
        if (dkdCached) return dkdCached;
        if (dkdEvent.request.mode === 'navigate') return caches.match(DKD_FALLBACK);
        return Response.error();
      })
  );
});
