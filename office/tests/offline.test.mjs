import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
const source=await readFile(new URL("../sw.js",import.meta.url),"utf8");
function setup(){
 const handlers={},stores=new Map(),scope="https://example.test/office/",calls=[];
 const cache=name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {async addAll(paths){paths.forEach(p=>m.set(new URL(p,scope).href,new Response("cached:"+p)));},async put(k,v){m.set(new URL(typeof k==="string"?k:k.url,scope).href,v);},async match(k){return m.get(new URL(typeof k==="string"?k:k.url,scope).href)?.clone();}};};
 const caches={open:async name=>cache(name),keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name)};
 let net=true;const fetch=async r=>{calls.push(typeof r==="string"?r:r.url);if(!net)throw Error("offline");return new Response("network");};
 const self={location:{origin:"https://example.test"},registration:{scope},addEventListener:(t,f)=>handlers[t]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}};
 vm.runInNewContext(source,{self,caches,fetch,URL,Response});
 return{handlers,stores,calls,caches,setOffline:()=>net=false};
}
async function lifecycle(fn){let promise;fn({waitUntil:p=>promise=p});await promise;}
test("Offline installation preloads the complete atomic v0.3 release",async()=>{
 const s=setup();await lifecycle(s.handlers.install);const m=s.stores.get("draborn-office-static-v0.3.0");assert.ok(m.has("https://example.test/office/app.js?v=0.3.0"));assert.ok(m.has("https://example.test/office/renderer.js?v=0.3.0"));assert.ok(m.has("https://example.test/office/assets/eagle.svg"));assert.ok(m.has("https://example.test/office/coast.js?v=0.3.0"));assert.ok(m.has("https://example.test/office/miami.css?v=0.3.0"));assert.equal(m.size,12);
});
test("Activation retires V1 caches while preserving every other app cache",async()=>{
 const s=setup();await s.caches.open("draborn-office-static-v1");await s.caches.open("another-app");await lifecycle(s.handlers.install);await lifecycle(s.handlers.activate);assert.equal(s.stores.has("draborn-office-static-v1"),false);assert.equal(s.stores.has("another-app"),true);
});
test("Navigation works offline and scoped workers leave unrelated routes alone",async()=>{
 const s=setup();await lifecycle(s.handlers.install);s.setOffline();let p;s.handlers.fetch({request:{url:"https://example.test/office/",method:"GET",mode:"navigate"},respondWith:x=>p=x});assert.ok((await(await p).text()).startsWith("cached"));let handled=false;for(const url of ["https://example.test/DraBornStyle/","https://example.test/office-other/","https://remote.test/office/app.js"]){s.handlers.fetch({request:{url,method:"GET",mode:"navigate"},respondWith:()=>handled=true});}assert.equal(handled,false);
});
test("A v0.3 cache can never silently return a V1 or mismatched module",async()=>{
 const s=setup();await lifecycle(s.handlers.install);let p;const event=url=>({request:{url,method:"GET",mode:"cors"},respondWith:x=>p=x,waitUntil:()=>{}});
 s.handlers.fetch(event("https://example.test/office/app.js?v=0.3.0"));assert.ok((await(await p).text()).includes("v=0.3.0"));assert.equal(s.calls.length,0);
 s.handlers.fetch(event("https://example.test/office/app.js?v=1"));assert.equal(await(await p).text(),"network");assert.equal(s.calls.length,1);
});
