const DKD_CACHE = 'draborngate-web-v2.9.1-boot-hotfix';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=2.9.1',
  '/DraBornGate/assets/v2.1-fixes.css?v=2.9.1',
  '/DraBornGate/assets/v2.2.css?v=2.9.1',
  '/DraBornGate/assets/v2.3.css?v=2.9.1',
  '/DraBornGate/assets/app.js?v=2.9.1',
  '/DraBornGate/assets/v2.9.1-boot-recovery.js?v=2.9.1',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=2.9.0',
  '/DraBornGate/assets/v2.5.css.payload.txt?v=2.9.0',
  '/DraBornGate/assets/v2.6.css.payload.txt?v=2.9.0',
  '/DraBornGate/assets/v2.7.css?v=2.9.0',
  '/DraBornGate/assets/v2.8.css?v=2.9.0',
  '/DraBornGate/assets/v2.9.css?v=2.9.0',
  '/DraBornGate/assets/v2.3.js?v=2.9.0',
  '/DraBornGate/assets/v2.4.js.payload.txt?v=2.9.0',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=2.9.0',
  '/DraBornGate/assets/v2.5.js.payload.2.txt?v=2.9.0',
  '/DraBornGate/assets/v2.5.js.payload.3.txt?v=2.9.0',
  '/DraBornGate/assets/v2.5.js.payload.4.txt?v=2.9.0',
  '/DraBornGate/assets/v2.5.js.payload.5.txt?v=2.9.0',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=2.9.0',
  '/DraBornGate/assets/v2.7.guard.js?v=2.9.0',
  '/DraBornGate/assets/v2.7.js?v=2.9.0',
  '/DraBornGate/assets/v2.8.js?v=2.9.0',
  '/DraBornGate/assets/v2.8.1.js?v=2.9.0',
  '/DraBornGate/assets/v2.9.js?v=2.9.0',
  '/DraBornGate/manifest.webmanifest?v=2.9.1'
];

function dkdFetchWithTimeout(dkdRequest, dkdTimeout = 6500) {
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), dkdTimeout);
  return fetch(dkdRequest, { signal: dkdController.signal })
    .finally(() => clearTimeout(dkdTimer));
}

async function dkdCacheResponse(dkdRequest, dkdResponse) {
  if (!dkdResponse || !dkdResponse.ok) return dkdResponse;
  const dkdCache = await caches.open(DKD_CACHE);
  await dkdCache.put(dkdRequest, dkdResponse.clone()).catch(() => undefined);
  return dkdResponse;
}

async function dkdCacheFirst(dkdRequest) {
  const dkdExact = await caches.match(dkdRequest);
  if (dkdExact) return dkdExact;
  const dkdLoose = await caches.match(dkdRequest, { ignoreSearch: true });
  if (dkdLoose) {
    void dkdFetchWithTimeout(dkdRequest, 5000)
      .then((dkdResponse) => dkdCacheResponse(dkdRequest, dkdResponse))
      .catch(() => undefined);
    return dkdLoose;
  }
  return dkdCacheResponse(dkdRequest, await dkdFetchWithTimeout(dkdRequest));
}

async function dkdNavigationNetworkFirst(dkdRequest) {
  try {
    return await dkdCacheResponse(dkdRequest, await dkdFetchWithTimeout(dkdRequest, 7000));
  } catch {
    const dkdCached = await caches.match(dkdRequest, { ignoreSearch: true });
    if (dkdCached) return dkdCached;
    const dkdPath = new URL(dkdRequest.url).pathname.toLocaleLowerCase('tr-TR');
    if (dkdPath.includes('guvenlik-sade-tema')) {
      const dkdSimple = await caches.match('/DraBornGate/Guvenlik-Sade-Tema/');
      if (dkdSimple) return dkdSimple;
    }
    return caches.match('/DraBornGate/');
  }
}

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.open(DKD_CACHE).then((dkdCache) => Promise.allSettled(
      DKD_ASSETS.map(async (dkdAsset) => {
        const dkdRequest = new Request(dkdAsset, { cache: 'reload' });
        const dkdResponse = await dkdFetchWithTimeout(dkdRequest, 7000);
        if (dkdResponse.ok) await dkdCache.put(dkdRequest, dkdResponse);
      })
    ))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.keys().then((dkdKeys) => Promise.all(
      dkdKeys
        .filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_CACHE)
        .map((dkdKey) => caches.delete(dkdKey))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (dkdEvent) => {
  if (dkdEvent.request.method !== 'GET' || !dkdEvent.request.url.includes('/DraBornGate/')) return;
  const dkdUrl = new URL(dkdEvent.request.url);
  const dkdIsNavigation = dkdEvent.request.mode === 'navigate';
  const dkdIsStaticAsset = dkdUrl.pathname.includes('/DraBornGate/assets/')
    || dkdUrl.pathname.endsWith('/manifest.webmanifest');

  if (dkdIsNavigation) {
    dkdEvent.respondWith(dkdNavigationNetworkFirst(dkdEvent.request));
    return;
  }
  if (dkdIsStaticAsset) {
    dkdEvent.respondWith(
      dkdCacheFirst(dkdEvent.request).catch(() => caches.match(dkdEvent.request, { ignoreSearch: true }))
    );
    return;
  }
  dkdEvent.respondWith(
    dkdFetchWithTimeout(dkdEvent.request)
      .then((dkdResponse) => dkdCacheResponse(dkdEvent.request, dkdResponse))
      .catch(() => caches.match(dkdEvent.request, { ignoreSearch: true }))
  );
});
