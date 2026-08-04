const DKD_CACHE = 'draborngate-web-v3.1.2-current-only';
const DKD_VERSION = '3.1.2';
const DKD_ASSETS = [
  '/DraBornGate/','/DraBornGate/index.html','/DraBornGate/Guvenlik-Sade-Tema/','/DraBornGate/Guvenlik-Sade-Tema/index.html',
  '/DraBornGate/assets/app.css?v=3.1.2','/DraBornGate/assets/v2.1-fixes.css?v=3.1.2','/DraBornGate/assets/v2.2.css?v=3.1.2','/DraBornGate/assets/v2.3.css?v=3.1.2',
  '/DraBornGate/assets/v2.4.css.payload.txt?v=3.1.2','/DraBornGate/assets/v2.5.css.payload.txt?v=3.1.2','/DraBornGate/assets/v2.6.css.payload.txt?v=3.1.2',
  '/DraBornGate/assets/v2.7.css?v=3.1.2','/DraBornGate/assets/v2.8.css?v=3.1.2','/DraBornGate/assets/v3.0.css?v=3.1.2','/DraBornGate/assets/v3.1.2.css?v=3.1.2',
  '/DraBornGate/assets/app.js?v=3.1.2','/DraBornGate/assets/v2.3.js?v=3.1.2','/DraBornGate/assets/v2.4.js.payload.txt?v=3.1.2',
  '/DraBornGate/assets/v2.5.js.payload.1.txt?v=3.1.2','/DraBornGate/assets/v2.5.js.payload.2.txt?v=3.1.2','/DraBornGate/assets/v2.5.js.payload.3.txt?v=3.1.2','/DraBornGate/assets/v2.5.js.payload.4.txt?v=3.1.2','/DraBornGate/assets/v2.5.js.payload.5.txt?v=3.1.2',
  '/DraBornGate/assets/v2.6.js.payload.txt?v=3.1.2','/DraBornGate/assets/v2.7.guard.js?v=3.1.2','/DraBornGate/assets/v2.7.js?v=3.1.2','/DraBornGate/assets/v2.8.js?v=3.1.2',
  '/DraBornGate/assets/v3.1.2.guard.js?v=3.1.2','/DraBornGate/assets/v3.1.2.moto.js?v=3.1.2','/DraBornGate/assets/v3.1.2.data.js?v=3.1.2','/DraBornGate/assets/v3.1.2.js?v=3.1.2',
  '/DraBornGate/assets/v3.1.0.css.part.1.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.css.part.2.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.css.part.3.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.css.part.4.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.css.part.5.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.css.part.6.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.css.part.7.txt?v=3.1.2',
  '/DraBornGate/assets/v3.1.0.js.part.1.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.2.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.3.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.4.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.5.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.6.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.7.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.8.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.9.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.10.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.11.txt?v=3.1.2','/DraBornGate/assets/v3.1.0.js.part.12.txt?v=3.1.2',
  '/DraBornGate/manifest.webmanifest?v=3.1.2'
];
self.addEventListener('install',(dkdEvent)=>{dkdEvent.waitUntil(caches.open(DKD_CACHE).then((dkdCache)=>dkdCache.addAll(DKD_ASSETS)).catch(()=>undefined));self.skipWaiting()});
self.addEventListener('activate',(dkdEvent)=>{dkdEvent.waitUntil((async()=>{const dkdKeys=await caches.keys();await Promise.all(dkdKeys.map((dkdKey)=>dkdKey===DKD_CACHE?undefined:caches.delete(dkdKey)));await self.clients.claim();const dkdClients=await self.clients.matchAll({includeUncontrolled:true});for(const dkdClient of dkdClients)dkdClient.postMessage({type:'DKD_VERSION',version:DKD_VERSION})})())});
self.addEventListener('fetch',(dkdEvent)=>{
  if(dkdEvent.request.method!=='GET'||!dkdEvent.request.url.includes('/DraBornGate/'))return;
  const dkdUrl=new URL(dkdEvent.request.url);
  const dkdCritical=dkdEvent.request.mode==='navigate'||/\/DraBornGate\/(?:index\.html)?$/.test(dkdUrl.pathname)||/\/DraBornGate\/Guvenlik-Sade-Tema\/(?:index\.html)?$/.test(dkdUrl.pathname)||dkdUrl.pathname.endsWith('/assets/app.js')||dkdUrl.pathname.includes('/assets/v3.1.2.');
  dkdEvent.respondWith((async()=>{try{const dkdRequest=dkdCritical?new Request(dkdEvent.request,{cache:'reload'}):dkdEvent.request;const dkdResponse=await fetch(dkdRequest);if(dkdResponse.ok){const dkdCache=await caches.open(DKD_CACHE);dkdCache.put(dkdEvent.request,dkdResponse.clone()).catch(()=>undefined)}return dkdResponse}catch{return(await caches.match(dkdEvent.request))||(await caches.match('/DraBornGate/'))}})())
});
