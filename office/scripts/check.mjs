import {readFile,readdir,stat} from "node:fs/promises";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const files=await readdir(root);let checks=0;
for(const name of files.filter(f=>f.endsWith(".js"))){const p=resolve(root,name),s=await readFile(p,"utf8"),result=spawnSync(process.execPath,["--check",p],{encoding:"utf8"});if(result.status)throw Error(result.stderr);checks++;for(const [,ref] of s.matchAll(/from\s+["'](\.\/[^"']+)["']/g)){await stat(resolve(root,ref.split("?")[0]));checks++;}}
const html=await readFile(resolve(root,"index.html"),"utf8");
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)throw Error("Duplicate HTML IDs");
for(const [,ref] of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)){await stat(resolve(root,ref.split("?")[0]));checks++;}
const app=await readFile(resolve(root,"app.js"),"utf8");
const dynamic=["teamRows","teamSearch","resetConfirm"];
for(const [,id] of app.matchAll(/\$\("([^"]+)"\)/g))if(!ids.includes(id)&&!dynamic.includes(id))throw Error("Missing DOM target: "+id);
const manifest=JSON.parse(await readFile(resolve(root,"manifest.webmanifest"),"utf8"));for(const i of manifest.icons)await stat(resolve(root,i.src));if(manifest.scope!=="/office/")throw Error("Incorrect PWA scope");
const sw=await readFile(resolve(root,"sw.js"),"utf8");
const paths=sw.match(/const CORE=(\[[^;]+\]);/);for(const ref of JSON.parse(paths[1]))if(ref!=="./"){await stat(resolve(root,ref.split("?")[0]));checks++;}
if(sw.includes("ignoreSearch:true"))throw Error("Unsafe cross-version asset matching");
console.log(JSON.stringify({ok:true,checks,htmlIds:ids.length,version:JSON.parse(await readFile(resolve(root,"package.json"),"utf8")).version}));
