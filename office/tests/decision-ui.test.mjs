import test from "node:test";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const script=fileURLToPath(new URL("./support/decision-dom.mjs",import.meta.url));
for(const scenario of ["option-0","option-1","decision-0","unaffordable","free-choice"])test("Decision UI: "+scenario,()=>{
 const r=spawnSync(process.execPath,[script,scenario],{encoding:"utf8"});assert.equal(r.status,0,r.stderr||r.stdout);assert.ok(JSON.parse(r.stdout).ok);
});
