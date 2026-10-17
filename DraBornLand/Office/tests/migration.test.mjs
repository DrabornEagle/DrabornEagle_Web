import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
test("Old office links forward to the exact new path and retain query and hash",async()=>{
 const html=await readFile(new URL("../../../office/index.html",import.meta.url),"utf8"),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];let target;
 vm.runInNewContext(script,{location:{search:"?v=0.3&from=home",hash:"#studio",replace:value=>target=value}});
 assert.equal(target,"/DraBornLand/Office/?v=0.3&from=home#studio");assert.ok(html.includes('href="/DraBornLand/Office/"'));assert.ok(!script.includes("localStorage"));
});
test("Retiring the old worker preserves new and unrelated caches and only redirects old office clients",async()=>{
 const source=await readFile(new URL("../../../office/sw.js",import.meta.url),"utf8"),handlers={},deleted=[],navigated=[];let unregistered=false;
 const names=["draborn-office-static-v1","draborn-office-static-v0.3.0","draborn-office-static-v0.4.0","draborn-office-static-v0.5.0","other-app"];
 const clients=["https://example.test/office/?saved=1#home","https://example.test/DraBornLand/Office/","https://example.test/office-other/","https://other.test/office/"];
 const self={location:{origin:"https://example.test"},addEventListener:(event,fn)=>handlers[event]=fn,skipWaiting:async()=>{},registration:{unregister:async()=>unregistered=true},clients:{matchAll:async()=>clients.map(url=>({url,navigate:async target=>navigated.push(target)}))}};
 vm.runInNewContext(source,{self,URL,caches:{keys:async()=>names,delete:async name=>deleted.push(name)}});
 let done;handlers.activate({waitUntil:p=>done=p});await done;
 assert.equal(unregistered,true);assert.deepEqual(deleted,["draborn-office-static-v1","draborn-office-static-v0.3.0"]);assert.deepEqual(navigated,["/DraBornLand/Office/?saved=1#home"]);
});
