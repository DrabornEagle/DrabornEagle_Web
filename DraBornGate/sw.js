const DKD_CACHE = 'draborngate-web-v3.2.12-clean-runtime';
const DKD_FALLBACK = '/DraBornGate/';
const DKD_SHELL = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.v3.2.12.js?v=3.2.12',
  '/DraBornGate/assets/app.js?v=3.2.12-core',
  '/DraBornGate/assets/v3.2.12.guard.js?v=3.2.12',
  '/DraBornGate/assets/v3.2.12.js?v=3.2.12',
  '/DraBornGate/assets/v3.2.12.css?v=3.2.12',
  '/DraBornGate/manifest.webmanifest?v=3.2.12'
];

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.open(DKD_CACHE)
      .then((dkdCache) => Promise.allSettled(DKD_SHELL.map((dkdPath) => dkdCache.add(dkdPath))))
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

async function dkdNetworkFirst(dkdRequest) {
  try {
    const dkdFreshRequest = new Request(dkdRequest, { cache: 'no-store' });
    const dkdResponse = await fetch(dkdFreshRequest);
    if (dkdResponse?.ok) {
      const dkdCache = await caches.open(DKD_CACHE);
      void dkdCache.put(dkdRequest, dkdResponse.clone()).catch(() => undefined);
    }
    return dkdResponse;
  } catch {
    const dkdCached = await caches.match(dkdRequest);
    if (dkdCached) return dkdCached;
    if (dkdRequest.mode === 'navigate') {
      const dkdFallback = await caches.match(DKD_FALLBACK);
      if (dkdFallback) return dkdFallback;
    }
    return Response.error();
  }
}

self.addEventListener('fetch', (dkdEvent) => {
  if (dkdEvent.request.method !== 'GET' || !dkdEvent.request.url.includes('/DraBornGate/')) return;
  dkdEvent.respondWith(dkdNetworkFirst(dkdEvent.request));
});
