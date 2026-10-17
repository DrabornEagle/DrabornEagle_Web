import test from "node:test";
import assert from "node:assert/strict";
import {OfficeRenderer} from "../renderer.js";
const make=()=>new OfficeRenderer({getContext:()=>({})});
test("Isometric projection and picking are exact inverses at desktop and mobile sizes",()=>{
 for(const [width,height,dpr] of [[1440,900,1],[390,530,3],[768,600,2]]){const r=make();r.resize(width,height,dpr);r.zoom=1.6;r.pan={x:56,y:-18};
  for(const [x,y] of [[0,0],[1152,768],[320,445],[780,300]]){const p=r.toScreen(x,y),q=r.toWorld(p.x,p.y);assert.ok(Math.abs(x-q.x)<1e-9);assert.ok(Math.abs(y-q.y)<1e-9);}
  assert.ok(r.dpr<=2);
 }
});
test("Zoom anchors the touched world point and stays in its bounds",()=>{
 const r=make();r.resize(1000,700);const p=r.toWorld(420,300);r.zoomAt(2,420,300);const q=r.toWorld(420,300);assert.ok(Math.abs(p.x-q.x)<1e-8);assert.ok(Math.abs(p.y-q.y)<1e-8);r.zoomAt(999);assert.equal(r.zoom,3.2);r.zoomAt(-2);assert.equal(r.zoom,.7);
});
test("Focus centers a character and fit resets camera and following",()=>{
 const r=make();r.resize(1200,760);r.focus(356,448);const p=r.toScreen(356,448);assert.equal(Math.round(p.x),600);assert.equal(Math.round(p.y),400);r.follow="ada";r.fit();assert.equal(r.zoom,1);assert.deepEqual(r.pan,{x:0,y:0});assert.equal(r.follow,null);
});
test("Picking prioritizes a speech bubble, then character, then room",()=>{
 const r=make();r.resize(1200,760);r.bubbles=[{x:200,y:200,w:120,h:50,id:"ada",text:"Hi"}];r.hits=[{x:220,y:220,r:20,id:"arda"}];assert.equal(r.pick(220,220).type,"speech");r.bubbles=[];assert.equal(r.pick(220,220).id,"arda");const p=r.toScreen(300,200);assert.equal(r.pick(p.x,p.y).id,"creative");assert.equal(r.pick(-900,-900),null);
});
