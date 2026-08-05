const DKD_CACHE = 'draborngate-web-v3.2.17-stable-earnings-gate-moto1';
const DKD_SCOPE = '/DraBornGate/';
const DKD_FALLBACK = '/DraBornGate/index.html';
const DKD_REVISION = '3.2.17-stable-earnings-gate-moto1';
const DKD_CORE_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  `/DraBornGate/manifest.webmanifest?v=${DKD_REVISION}`,
  `/DraBornGate/assets/app.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v2.1-fixes.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v2.2.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v2.3.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/app.v3.2.17.js?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.17.guard.js?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.17.js?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.17.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.11.js?v=${DKD_REVISION}-earnings`,
  `/DraBornGate/assets/v3.2.11.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.10.js?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.10.css?v=${DKD_REVISION}`,
  `/DraBornGate/assets/v3.2.9.js?v=${DKD_REVISION}`
];

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.open(DKD_CACHE).then(async (dkdCache) => {
      await Promise.allSettled(DKD_CORE_ASSETS.map((dkdAsset) => dkdCache.add(new Request(dkdAsset, { cache: 'reload' }))));
    })
  );
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

self.addEventListener('message', (dkdEvent) => {
  if (dkdEvent.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (dkdEvent) => {
  const dkdRequest = dkdEvent.request;
  if (dkdRequest.method !== 'GET' || !dkdRequest.url.includes(DKD_SCOPE)) return;

  dkdEvent.respondWith((async () => {
    try {
      const dkdFreshRequest = new Request(dkdRequest, { cache: 'no-store' });
      const dkdResponse = await fetch(dkdFreshRequest);
      if (dkdResponse?.ok) {
        const dkdCache = await caches.open(DKD_CACHE);
        await dkdCache.put(dkdRequest, dkdResponse.clone());
      }
      return dkdResponse;
    } catch {
      const dkdCached = await caches.match(dkdRequest);
      if (dkdCached) return dkdCached;
      if (dkdRequest.mode === 'navigate') {
        return (await caches.match(DKD_FALLBACK)) || (await caches.match('/DraBornGate/')) || Response.error();
      }
      return Response.error();
    }
  })());
});
