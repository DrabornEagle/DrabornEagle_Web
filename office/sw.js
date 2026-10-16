/* DraBorn Office — scoped offline cache. No tracking, no analytics, no remote APIs. */
const CACHE="draborn-office-static-v1";
const REQUIRED=["./","./index.html","./style.css","./app.js","./engine.js","./data.js","./manifest.webmanifest"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(REQUIRED)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("draborn-office-static-")&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 const url=new URL(request.url);
 if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));}return response;}).catch(async()=>{
   const cache=await caches.open(CACHE);return (await cache.match("./index.html"))||Response.error();
  }));
  return;
 }
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const hit=await cache.match(request,{ignoreSearch:true});
  if(hit)return hit;
  try{const net=await fetch(request);if(net.ok)cache.put(request,net.clone());return net;}catch{return Response.error();}
 }));
});
