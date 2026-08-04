import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdScriptDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdScriptDir, '..');
const dkdRead = (dkdPath) => fs.readFileSync(path.join(dkdRoot, dkdPath), 'utf8');
const dkdWrite = (dkdPath, dkdContent) => fs.writeFileSync(path.join(dkdRoot, dkdPath), dkdContent);
const dkdRequire = (dkdCondition, dkdMessage) => { if (!dkdCondition) throw new Error(dkdMessage); };

let dkdV28 = dkdRead('assets/v2.8.js');
const dkdV28Old = `function dkdV28HasSecuritySession() {
  const dkdApp = document.querySelector('#dkd-app');
  if (!dkdApp) return false;
  const dkdText = dkdV28Normalize(dkdApp.textContent);
  const dkdHasRole = dkdText.includes('guvenlik') && (
    dkdText.includes('guvenlik merkezi') ||
    dkdText.includes('kurye kodu dogrula') ||
    dkdText.includes('kurye kuyrugu') ||
    dkdText.includes('gecis talepleri') ||
    dkdText.includes('cikis yap')
  );
  return dkdHasRole;
}`;
const dkdV28New = `function dkdV28HasSecuritySession() {
  const dkdContextRole = window.dkdV325Session?.currentRole?.() || window.dkdV324Session?.currentRole?.();
  if (dkdContextRole) return dkdContextRole === 'security';
  const dkdRoleBadge = [...document.querySelectorAll('span,strong,b,p,small')].find((dkdElement) => {
    if (dkdV28Normalize(dkdElement.textContent) !== 'guvenlik') return false;
    const dkdRect = dkdElement.getBoundingClientRect();
    return dkdRect.top >= 0 && dkdRect.top < 720 && dkdRect.width > 0 && dkdRect.height > 0;
  });
  return Boolean(dkdRoleBadge);
}`;
if (dkdV28.includes(dkdV28Old)) {
  dkdV28 = dkdV28.replace(dkdV28Old, dkdV28New);
} else {
  dkdRequire(dkdV28.includes('window.dkdV325Session?.currentRole?.()'), 'v2.8 Güvenlik rol algılama bloğu bulunamadı.');
}
dkdWrite('assets/v2.8.js', dkdV28);

let dkdApp = dkdRead('assets/app.js');
dkdApp = dkdApp.replaceAll('3.2.4', '3.2.5').replaceAll('dkdBootWebV324', 'dkdBootWebV325');
const dkdFinalOld = `  await dkdAppendPackedStyle('./assets/v3.2.5.css.payload.txt', 'dkdWebV324');
  await import(\`./v3.2.5.js?v=\${DKD_WEB_VERSION}\`);`;
const dkdFinalNew = `  await dkdAppendPackedStyle('./assets/v3.2.4.css.payload.txt', 'dkdWebV324Base');
  await dkdAppendPackedStyle('./assets/v3.2.5.css.payload.txt', 'dkdWebV325');
  await import(\`./v3.2.5.js?v=\${DKD_WEB_VERSION}\`);`;
dkdRequire(dkdApp.includes(dkdFinalOld), 'app.js v3.2.5 son yükleme bloğu bulunamadı.');
dkdApp = dkdApp.replace(dkdFinalOld, dkdFinalNew);
dkdApp = dkdApp.replace('draborngate-web-v3.2.5-admin-simple-courier-site-flow', 'draborngate-web-v3.2.5-stable-popup-admin-earnings');
dkdWrite('assets/app.js', dkdApp);

for (const dkdFile of ['index.html', 'Guvenlik-Sade-Tema/index.html', 'manifest.webmanifest']) {
  dkdWrite(dkdFile, dkdRead(dkdFile).replaceAll('3.2.4', '3.2.5'));
}

let dkdCompat = dkdRead('assets/v3.2.1.data.js');
dkdCompat = dkdCompat.replace("const DKD_V321_COMPAT_VERSION = '3.2.4';", "const DKD_V321_COMPAT_VERSION = '3.2.5';");
dkdCompat = dkdCompat.replaceAll('v3.2.4 kilitli oturum', 'v3.2.5 kilitli oturum');
dkdWrite('assets/v3.2.1.data.js', dkdCompat);

const dkdSw = `const DKD_CACHE = 'draborngate-web-v3.2.5-stable-popup-admin-earnings';
const DKD_FALLBACK = '/DraBornGate/';
const DKD_ASSETS = [
  '/DraBornGate/',
  '/DraBornGate/index.html',
  '/DraBornGate/Guvenlik-Sade-Tema/',
  '/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=3.2.5',
  '/DraBornGate/assets/v2.1-fixes.css?v=3.2.5',
  '/DraBornGate/assets/v2.2.css?v=3.2.5',
  '/DraBornGate/assets/v2.3.css?v=3.2.5',
  '/DraBornGate/assets/app.v2.css.payload.txt?v=3.2.5',
  '/DraBornGate/assets/app.v2.payload.1.txt?v=3.2.5',
  '/DraBornGate/assets/app.v2.payload.2.txt?v=3.2.5',
  '/DraBornGate/assets/app.v2.payload.3.txt?v=3.2.5',
  '/DraBornGate/assets/app.v2.payload.4.txt?v=3.2.5',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v2.5.css.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v2.6.css.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v2.7.css?v=3.2.5',
  '/DraBornGate/assets/v2.8.css?v=3.2.5',
  '/DraBornGate/assets/v3.0.css?v=3.2.5',
  '/DraBornGate/assets/v3.1.1.css?v=3.2.5',
  '/DraBornGate/assets/v3.2.4.css.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v3.2.5.css.payload.txt?v=3.2.5',
  '/DraBornGate/assets/app.js?v=3.2.5',
  '/DraBornGate/assets/v2.3.js?v=3.2.5',
  '/DraBornGate/assets/v2.4.js.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=3.2.5',
  '/DraBornGate/assets/v2.5.js.payload.2.txt?v=3.2.5',
  '/DraBornGate/assets/v2.5.js.payload.3.txt?v=3.2.5',
  '/DraBornGate/assets/v2.5.js.payload.4.txt?v=3.2.5',
  '/DraBornGate/assets/v2.5.js.payload.5.txt?v=3.2.5',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v2.7.guard.js?v=3.2.5',
  '/DraBornGate/assets/v2.7.js?v=3.2.5',
  '/DraBornGate/assets/v2.8.js?v=3.2.5',
  '/DraBornGate/assets/v2.8.1.js?v=3.2.5',
  '/DraBornGate/assets/v3.1.1.moto.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.1.data.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.1.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.4.data.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.4.auth.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.4.auth.js.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v3.2.4.js.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v3.2.5.guard.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.5.stability.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.5.js?v=3.2.5',
  '/DraBornGate/assets/v3.2.5.session.js.payload.txt?v=3.2.5',
  '/DraBornGate/assets/v3.2.5.features.js.payload.txt?v=3.2.5',
  '/DraBornGate/manifest.webmanifest?v=3.2.5'
];
self.addEventListener('install', (dkdEvent) => {
  dkdEvent.waitUntil(caches.open(DKD_CACHE).then((dkdCache) => dkdCache.addAll(DKD_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (dkdEvent) => {
  dkdEvent.waitUntil(caches.keys().then((dkdKeys) => Promise.all(dkdKeys.filter((dkdKey) => dkdKey.startsWith('draborngate-web-') && dkdKey !== DKD_CACHE).map((dkdKey) => caches.delete(dkdKey)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (dkdEvent) => {
  if (dkdEvent.request.method !== 'GET' || !dkdEvent.request.url.includes('/DraBornGate/')) return;
  const dkdRequest = new Request(dkdEvent.request, { cache: 'no-store' });
  dkdEvent.respondWith(fetch(dkdRequest).then((dkdResponse) => {
    if (!dkdResponse || !dkdResponse.ok) return dkdResponse;
    const dkdCopy = dkdResponse.clone();
    caches.open(DKD_CACHE).then((dkdCache) => dkdCache.put(dkdEvent.request, dkdCopy)).catch(() => undefined);
    return dkdResponse;
  }).catch(async () => {
    const dkdCached = await caches.match(dkdEvent.request);
    if (dkdCached) return dkdCached;
    if (dkdEvent.request.mode === 'navigate') return caches.match(DKD_FALLBACK);
    return Response.error();
  }));
});
`;
dkdWrite('sw.js', dkdSw);

console.log('DraBornGate Web v3.2.5 üretimi tamamlandı.');
