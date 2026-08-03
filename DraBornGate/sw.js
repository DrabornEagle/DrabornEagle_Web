const DKD_CACHE = 'draborngate-web-v2.1.1';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/assets/app.css?v=2.1.1',
  '/DraBornGate/assets/v2.1-fixes.css?v=2.1.1',
  '/DraBornGate/assets/v2.1.1-defaults.css?v=2.1.1',
  '/DraBornGate/assets/app.js?v=2.1.1',
  '/DraBornGate/assets/v2.1-fixes.js?v=2.1.1',
  '/DraBornGate/assets/v2.1.1-defaults.js?v=2.1.1',
  '/DraBornGate/manifest.webmanifest?v=2.1.1'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(DKD_CACHE).then((cache) => cache.addAll(DKD_ASSETS)).catch(() => undefined));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== DKD_CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.includes('/DraBornGate/')) return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(DKD_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => undefined);
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/DraBornGate/'))));
});
