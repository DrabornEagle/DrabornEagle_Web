const DKD_CACHE = 'draborngate-web-v2.9.2-nonblocking-loader';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app-v2.9.2.js',
  '/DraBornGate/assets/app.css?v=2.9.2',
  '/DraBornGate/assets/v2.1-fixes.css?v=2.9.2',
  '/DraBornGate/assets/v2.2.css?v=2.9.2',
  '/DraBornGate/assets/v2.3.css?v=2.9.2',
  '/DraBornGate/assets/v2.9.css?v=2.9.2',
  '/DraBornGate/assets/v2.9.js?v=2.9.2',
  '/DraBornGate/manifest.webmanifest?v=2.9.2'
];

function dkdFetchWithTimeout(dkdRequest, dkdTimeout = 5000) {
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), dkdTimeout);
  return fetch(dkdRequest, { signal: dkdController.signal }).finally(() => clearTimeout(dkdTimer));
}

async function dkdPut(dkdRequest, dkdResponse) {
  if (!dkdResponse || !dkdResponse.ok) return dkdResponse;
  const dkdCache = await caches.open(DKD_CACHE);
  await dkdCache.put(dkdRequest, dkdResponse.clone()).catch(() => undefined);
  return dkdResponse;
}

async function dkdStaticCacheFirst(dkdRequest) {
  const dkdCached = await caches.match(dkdRequest);
  if (dkdCached) return dkdCached;
  return dkdPut(dkdRequest, await dkdFetchWithTimeout(dkdRequest));
}

async function dkdNavigationNetworkFirst(dkdRequest) {
  try {
    return await dkdPut(dkdRequest, await dkdFetchWithTimeout(dkdRequest, 4500));
  } catch {
    const dkdExact = await caches.match(dkdRequest);
    if (dkdExact) return dkdExact;
    const dkdPath = new URL(dkdRequest.url).pathname.toLocaleLowerCase('tr-TR');
    if (dkdPath.includes('guvenlik-sade-tema')) {
      return (await caches.match('/DraBornGate/Guvenlik-Sade-Tema/')) || caches.match('/DraBornGate/');
    }
    return caches.match('/DraBornGate/');
  }
}

self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(
    caches.open(DKD_CACHE).then((dkdCache) => Promise.allSettled(
      DKD_ASSETS.map(async (dkdAsset) => {
        const dkdRequest = new Request(dkdAsset, { cache: 'reload' });
        const dkdResponse = await dkdFetchWithTimeout(dkdRequest, 5000);
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
  if (dkdEvent.request.mode === 'navigate') {
    dkdEvent.respondWith(dkdNavigationNetworkFirst(dkdEvent.request));
    return;
  }
  if (dkdUrl.pathname.includes('/DraBornGate/assets/') || dkdUrl.pathname.endsWith('/manifest.webmanifest')) {
    dkdEvent.respondWith(dkdStaticCacheFirst(dkdEvent.request).catch(() => fetch(dkdEvent.request)));
  }
});
