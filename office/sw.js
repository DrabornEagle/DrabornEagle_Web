/* Retire only the previous /office/ worker. Never touch the new district's cache. */
self.addEventListener("install",event=>event.waitUntil(self.skipWaiting()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{
 const oldCaches=(await caches.keys()).filter(key=>/^draborn-office-static-v(?:[12]$|0\.[0-3](?:\.|$))/.test(key));
 await Promise.all(oldCaches.map(key=>caches.delete(key)));
 await self.registration.unregister();
 const clients=await self.clients.matchAll({type:"window",includeUncontrolled:true});
 await Promise.all(clients.map(client=>{
  const url=new URL(client.url);
  if(url.origin!==self.location.origin||!/^\/office(?:\/|$)/.test(url.pathname))return;
  return client.navigate("/DraBornLand/Office/"+url.search+url.hash).catch(()=>{});
 }));
})()));
