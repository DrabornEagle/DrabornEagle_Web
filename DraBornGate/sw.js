const DKD_CACHE_PREFIX = 'draborngate-web-';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil((async () => {
    const dkdKeys = await caches.keys();
    await Promise.allSettled(
      dkdKeys.filter((dkdKey) => dkdKey.startsWith(DKD_CACHE_PREFIX)).map((dkdKey) => caches.delete(dkdKey))
    );
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
