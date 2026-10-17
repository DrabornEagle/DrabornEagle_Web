import test from "node:test";
import assert from "node:assert/strict";
import {OfficeWorld,GAME_MINUTES_PER_SECOND,formatCurrency,getStorageKey} from "../engine.js";
import {PROPERTIES} from "../city.js";
import {OfficeRenderer} from "../renderer.js";
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
test("USD is used consistently while existing numeric balances and save keys survive",()=>{
 const storage=memory();storage.setItem(getStorageKey(),JSON.stringify({schema:"draborn-office",version:2,day:6,minutes:980,budget:497215,employees:[],projects:[],pendingDecision:0,feed:[{id:"currency-history",title:"Eski işlem",detail:"₺2.300 gider ve ₺1.234.567 gelir"}]}));
 const w=new OfficeWorld({storage});assert.equal(w.budget,497215);assert.equal(w.day,6);assert.equal(w.minutes,980);assert.equal(w.pendingDecision,0);assert.equal(formatCurrency(w.budget),"$497,215");assert.equal(formatCurrency(-1200),"-$1,200");assert.equal(w.snapshot().currency,"USD");assert.ok(w.feed.some(e=>e.detail==="$2,300 gider ve $1,234,567 gelir"));assert.deepEqual(w.ownedProperties,[]);assert.equal(getStorageKey(),"draborn-office-v2");
});
test("One normal-speed minute of real time advances 54 game minutes instead of 165",()=>{
 const w=new OfficeWorld({storage:null,restore:false}),start=w.minutes;
 for(let i=0;i<1200;i++)w.tick(.05);
 assert.equal(GAME_MINUTES_PER_SECOND,.9);assert.ok(Math.abs(w.minutes-start-54)<1e-7);assert.equal(w.day,1);
 w.setSpeed(0);w.tick(.1);assert.ok(Math.abs(w.minutes-start-54)<1e-7);
});
test("Virtual properties spend once, enter the ledger, and survive save/backup round trips",()=>{
 const storage=memory(),w=new OfficeWorld({storage,restore:false}),p=PROPERTIES.find(p=>p.type==="land"),budget=w.budget;
 assert.ok(w.purchaseProperty(p.id));assert.equal(w.budget,budget-p.price);assert.equal(w.propertyValue,p.price);assert.ok(w.ledger[0].reason.includes(p.name));assert.equal(w.ledger[0].amount,-p.price);
 assert.equal(w.purchaseProperty(p.id),false);assert.equal(w.budget,budget-p.price);
 const restored=new OfficeWorld({storage});assert.deepEqual(restored.ownedProperties,[p.id]);assert.equal(restored.budget,w.budget);
 const backup=JSON.parse(JSON.stringify(w.snapshot()));backup.ownedProperties.push(p.id,"untrusted-property");assert.ok(restored.importSnapshot(backup));assert.deepEqual(restored.ownedProperties,[p.id]);
});
test("Unfunded or unknown property purchases cannot mutate the game",()=>{
 const w=new OfficeWorld({storage:null,restore:false});w.budget=10;const before=JSON.stringify({...w.snapshot(),storedAt:0});
 assert.equal(w.purchaseProperty(PROPERTIES[0].id),false);assert.equal(w.purchaseProperty("not-a-listing"),false);assert.equal(JSON.stringify({...w.snapshot(),storedAt:0}),before);
});
test("Map property signs are clickable while office rooms and people keep their priority",()=>{
 const r=new OfficeRenderer({getContext:()=>({})});r.resize(1000,700);r.coast.hits=[{type:"property",id:"land-01",x:5,y:5,w:140,h:50}];
 assert.equal(r.pick(40,30).id,"land-01");const q=r.toScreen(300,200);r.coast.hits.push({type:"property",id:"land-02",x:q.x-10,y:q.y-10,w:40,h:40});assert.equal(r.pick(q.x,q.y).type,"room");
 r.hits=[{x:40,y:30,r:14,id:"ada"}];assert.equal(r.pick(40,30).type,"staff");r.bubbles=[{x:15,y:15,w:60,h:30,id:"arda"}];assert.equal(r.pick(40,30).type,"speech");
});
