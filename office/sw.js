/* Scope: /office/ only. Versioned modules are cached as one atomic release. */
const CACHE="draborn-office-static-v2.0.0";
const CORE=["./","./index.html","./style.css?v=2.0.0","./app.js?v=2.0.0","./engine.js?v=2.0.0","./data.js?v=2.0.0","./renderer.js?v=2.0.0","./icons.js?v=2.0.0","./assets/eagle.svg","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("draborn-office-static-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url),scope=new URL(self.registration.scope);
 if(r.method!=="GET"||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy)).catch(()=>{});}return response;}).catch(()=>caches.open(CACHE).then(c=>c.match("./index.html")).then(r=>r||Response.error())));return;}
 // Versioned modules keep their query string; a V1 asset can never satisfy a V2 request.
 e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r);if(hit)return hit;const response=await fetch(r);if(response.ok&&CORE.some(p=>new URL(p,scope).href===u.href))await c.put(r,response.clone()).catch(()=>{});return response;}));
});
