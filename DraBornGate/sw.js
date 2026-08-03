const DKD_CACHE = 'draborngate-web-v2.6.0';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=2.6.0',
  '/DraBornGate/assets/v2.1-fixes.css?v=2.6.0',
  '/DraBornGate/assets/v2.2.css?v=2.6.0',
  '/DraBornGate/assets/v2.3.css?v=2.6.0',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=2.6.0',
  '/DraBornGate/assets/v2.5.css.payload.txt?v=2.6.0',
  '/DraBornGate/assets/v2.6.css.payload.txt?v=2.6.0',
  '/DraBornGate/assets/app.js?v=2.6.0',
  '/DraBornGate/assets/v2.3.js?v=2.6.0',
  '/DraBornGate/assets/v2.4.js.payload.txt?v=2.6.0',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=2.6.0',
  '/DraBornGate/assets/v2.5.js.payload.2.txt?v=2.6.0',
  '/DraBornGate/assets/v2.5.js.payload.3.txt?v=2.6.0',
  '/DraBornGate/assets/v2.5.js.payload.4.txt?v=2.6.0',
  '/DraBornGate/assets/v2.5.js.payload.5.txt?v=2.6.0',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=2.6.0',
  '/DraBornGate/manifest.webmanifest?v=2.6.0'
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
