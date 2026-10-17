import test from "node:test";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
test("City UI supports filters, purchases, saved ownership, budgets and map navigation",()=>{
 const result=spawnSync(process.execPath,[fileURLToPath(new URL("./support/city-dom.mjs",import.meta.url))],{encoding:"utf8"});
 assert.equal(result.status,0,result.stdout+result.stderr);assert.ok(JSON.parse(result.stdout).ok);
});
