import test from "node:test";
import assert from "node:assert/strict";
import {OfficeWorld,findPath,blocked,getStorageKey} from "../engine.js";
import {ROOMS,STATIONS,RESEARCH,MILESTONES,PROJECTS,STAFF} from "../data.js?v=0.3.0";
const memory=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
const rng=()=>{let seed=734921;return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};};
const make=(opts={})=>new OfficeWorld({storage:memory(),random:rng(),...opts});
function run(w,seconds){for(let i=0;i<seconds*20;i++)w.tick(.05);}
test("The studio starts with its complete cast, projects, rooms and local conversation",()=>{
 const w=make();assert.equal(w.employees.length,20);assert.equal(w.projects.length,3);assert.equal(Object.keys(w.rooms).length,7);assert.equal(w.chats.length,3);
 for(const p of w.employees){assert.ok(w.projectById(p.projectId));assert.equal(Object.keys(p.friendships).length,19);}
});
test("Every station is reachable via real doorways",()=>{
 for(const pool of Object.values(STATIONS))for(const target of pool){const path=findPath({x:6*32+16,y:21*32+16},target);assert.ok(path.length>0||(target[0]===6&&target[1]===21),"unreachable "+target);for(const point of path.slice(0,-1))assert.ok(!blocked.has(Math.floor(point.x/32)+","+Math.floor(point.y/32)));}
});
test("Pausing stops the clock, walking, production and cooldowns",()=>{
 const w=make(),s=JSON.parse(JSON.stringify(w.snapshot())),x=w.employees[0].x;w.setSpeed(0);run(w,100);assert.equal(w.minutes,s.minutes);assert.equal(w.employees[0].x,x);assert.equal(w.simElapsed,0);assert.equal(w.projects[0].progress,s.projects[0].progress);
});
test("Speed controls advance proportional simulation time",()=>{
 const a=make(),b=make();b.setSpeed(4);run(a,2);run(b,2);assert.ok(Math.abs(b.simElapsed-a.simElapsed*4)<1e-7);assert.ok(Math.abs((b.minutes-550)-(a.minutes-550)*4)<1e-6);
});
test("Energy drain is independent of the selected speed",()=>{
 const a=make(),b=make();for(const w of [a,b]){w.nextSocial=1e7;for(const p of w.employees){p.path=[];p.phase="busy";p.task="code";p.timer=1e7;}}
 b.setSpeed(4);run(a,20);run(b,5);assert.ok(Math.abs(a.employees[0].energy-b.employees[0].energy)<.3);
});
test("Unfunded purchases never mutate the studio",()=>{
 const w=make();w.budget=0;const progress=w.projects[0].progress,lv=w.rooms.art;assert.equal(w.invest("survival"),false);assert.equal(w.upgrade("art"),false);assert.equal(w.doResearch("workflow"),false);assert.equal(w.interact("ada","coffee"),false);assert.equal(w.createProject("New game","survival"),false);assert.equal(w.budget,0);assert.equal(w.rooms.art,lv);assert.equal(w.projects[0].progress,progress);
});
test("Interaction cooldowns prevent repeated free morale boosts",()=>{
 const w=make(),p=w.findPerson("ada");p.morale=40;assert.ok(w.interact(p.id,"motivate"));assert.equal(p.morale,52);assert.equal(w.interact(p.id,"motivate"),false);run(w,31);assert.ok(w.interact(p.id,"motivate"));
});
test("Assignments actually determine which project receives production",()=>{
 const w=make();for(const p of w.employees){p.projectId="survival";p.phase="busy";p.task="code";p.room="creative";p.path=[];}const before=w.projects.map(p=>p.progress);w.updateProduction(1);assert.ok(w.projects[0].progress>before[0]);assert.equal(w.projects[1].progress,before[1]);assert.equal(w.projects[2].progress,before[2]);
 assert.ok(w.assign("ada","arcade"));assert.equal(w.findPerson("ada").projectId,"arcade");assert.equal(w.assign("ada","missing"),false);
});
test("Production priority trades speed for quality",()=>{
 const a=make(),b=make();for(const w of [a,b])for(const p of w.employees){p.phase="busy";p.task="code";p.room="creative";}a.projects[0].priority="speed";b.projects[0].priority="quality";a.updateProduction(10);b.updateProduction(10);assert.ok(a.projects[0].progress>b.projects[0].progress);assert.ok(b.projects[0].quality>a.projects[0].quality);assert.ok(a.projects[0].bugs>b.projects[0].bugs);
});
test("Releases pay revenue, attract fans, reset progress and log the transaction",()=>{
 const w=make(),p=w.projects[0],budget=w.budget,fans=w.fans;w.release(p);assert.equal(p.finished,1);assert.equal(w.stats.releases,1);assert.ok(w.budget>budget);assert.ok(w.fans>fans);assert.equal(p.progress,0);assert.ok(p.income>0);assert.equal(w.ledger[0].amount,w.budget-budget);w.checkMilestones();assert.ok(w.achievements.includes("firstLaunch"));
});
test("Research dependencies and room prerequisites are enforced",()=>{
 const w=make();assert.equal(w.doResearch("qa"),false);assert.ok(w.doResearch("workflow"));assert.ok(w.doResearch("qa"));assert.equal(w.doResearch("qa"),false);assert.equal(w.doResearch("render"),false);assert.ok(w.upgrade("art"));assert.ok(w.doResearch("render"));assert.equal(w.doResearch("publishing"),false);assert.ok(w.doResearch("marketing"));assert.ok(w.doResearch("publishing"));
});
test("Room upgrades cap at level four and apply production modifiers",()=>{
 const a=make(),b=make();for(let i=0;i<3;i++)assert.ok(b.upgrade("creative"));assert.equal(b.rooms.creative,4);assert.equal(b.upgrade("creative"),false);for(const w of [a,b])for(const p of w.employees){p.phase="busy";p.task="code";p.room="creative";}a.updateProduction(1);b.updateProduction(1);assert.ok(b.projects[0].progress>a.projects[0].progress);
});
test("New projects require valid names and respect the six-project limit",()=>{
 const w=make();assert.equal(w.createProject("a","survival"),false);assert.equal(w.createProject("Valid","nope"),false);for(let i=0;i<3;i++)assert.ok(w.createProject("New project "+i,"survival"));assert.equal(w.projects.length,6);assert.equal(w.createProject("One too many","survival"),false);
});
test("A customer contract is available only once per game day",()=>{
 const w=make(),budget=w.budget;assert.ok(w.contract());assert.equal(w.budget,budget+15000);assert.equal(w.contract(),false);w.minutes=1080;w.newDay();assert.ok(w.contract());
});
test("Day rollover pays salaries once and schedules decisions on every day",()=>{
 const w=make(),budget=w.budget;w.minutes=1080;w.newDay();assert.equal(w.day,2);assert.equal(w.minutes,540);assert.equal(w.budget,budget-w.salary);assert.equal(w.ledger[0].day,1);w.pendingDecision=null;w.nextDecision=541;run(w,1);assert.notEqual(w.pendingDecision,null);w.minutes=1080;w.newDay();assert.equal(w.day,3);assert.ok(w.nextDecision<1080);assert.equal(w.reports[0].expenses,w.salary);
});
test("Management decisions cannot spend unavailable cash",()=>{
 const w=make();w.pendingDecision=1;w.budget=0;assert.equal(w.makeChoice(0),false);assert.equal(w.pendingDecision,1);w.budget=10000;assert.ok(w.makeChoice(0));assert.equal(w.pendingDecision,null);assert.equal(w.makeChoice(0),false);
});
test("Milestone rewards cannot be claimed twice",()=>{
 const w=make();w.stats.releases=1;w.checkMilestones();assert.equal(w.claim("community"),false);const before=w.budget;assert.ok(w.claim("firstLaunch"));assert.equal(w.budget-before,3000);assert.equal(w.claim("firstLaunch"),false);
});
test("V1 migration preserves zeros, friendships, custom economy and decisions",()=>{
 const store=memory();store.setItem("draborn-office-v1",JSON.stringify({version:1,day:4,minutes:800,budget:55000,fans:9000,reputation:60,creativity:70,employees:[{id:"ada",energy:0,morale:0,friendships:{dogancan:92}}],projects:[{id:"survival",progress:0,finished:4,quality:90}],achievements:["firstLaunch"],pendingDecision:{title:"Topluluktan yoğun ilgi!"}}));
 const w=make({storage:store});assert.equal(w.day,4);assert.equal(w.budget,55000);assert.equal(w.findPerson("ada").energy,0);assert.equal(w.findPerson("ada").morale,0);assert.equal(w.findPerson("ada").friendships.dogancan,92);assert.equal(w.stats.releases,4);assert.equal(w.pendingDecision,1);assert.ok(w.save());assert.equal(JSON.parse(store.getItem(getStorageKey())).version,2);
});
test("JSON backup roundtrip preserves custom projects, upgrades, research and assignments",()=>{
 const a=make(),store=memory();a.doResearch("workflow");a.upgrade("art");const p=a.createProject("Hayal Adası","sim");a.assign("ada",p.id);a.contract();const exported=JSON.parse(JSON.stringify(a.snapshot()));const b=make({storage:store});assert.ok(b.importSnapshot(exported));assert.equal(b.rooms.art,2);assert.ok(b.research.includes("workflow"));assert.equal(b.projects.length,4);assert.equal(b.findPerson("ada").projectId,p.id);assert.equal(b.projectById(p.id).name,"Hayal Adası");assert.equal(b.budget,a.budget);assert.equal(b.contractDay,a.contractDay);
});
test("Invalid saves are rejected without changing the current studio",()=>{
 const w=make(),before=JSON.stringify({...w.snapshot(),storedAt:0});for(const s of [null,{},[],{version:2,day:-1},{version:2,day:2,employees:[],projects:"bad"}])assert.equal(w.importSnapshot(s),false);assert.equal(JSON.stringify({...w.snapshot(),storedAt:0}),before);
});
test("Corrupted or blocked local storage cannot prevent playing",()=>{
 const store={getItem:()=>"{broken",setItem:()=>{throw Error("blocked");},removeItem:()=>{throw Error("blocked");}};const w=make({storage:store});assert.equal(w.employees.length,20);assert.equal(w.save(),false);assert.equal(w.reset(),false);run(w,2);assert.ok(w.minutes>550);
});
test("Imported data is bounded, strips unknown IDs and preserves finite values",()=>{
 const w=make(),s=JSON.parse(JSON.stringify(w.snapshot()));s.budget=Infinity;s.minutes=NaN;s.research=["workflow","untrusted"];s.rooms.art=100;s.claimed=["not-an-achievement"];s.employees[0].energy=-100;assert.ok(w.importSnapshot(s));assert.ok(Number.isFinite(w.budget));assert.ok(Number.isFinite(w.minutes));assert.equal(w.rooms.art,4);assert.deepEqual(w.research,["workflow"]);assert.equal(w.employees[0].energy,0);assert.equal(w.claimed.length,0);
});
test("Local chat responds and rate limits; authored conversations use real participants",()=>{
 const w=make();assert.ok(w.postMessage("Merhaba ekip!"));assert.equal(w.chats.at(-1).text.includes("Selam"),true);assert.equal(w.postMessage("spam"),false);run(w,40);assert.ok(w.chats.length>5);for(const m of w.chats)assert.ok(m.personId==="you"||w.findPerson(m.personId));
});
test("The studio remains finite and bounded through 25 simulated days",()=>{
 const w=make();w.setSpeed(4);let decisions=0;
 for(let i=0;i<25000;i++){w.tick(.05);if(w.decision){w.makeChoice(0);decisions++;}if(i%1000===0)w.contract();}
 assert.ok(w.day>=25);assert.ok(decisions>20);for(const p of w.employees)for(const k of ["x","y","energy","morale"])assert.ok(Number.isFinite(p[k]),p.id+" "+k);assert.ok(w.feed.length<=80);assert.ok(w.chats.length<=100);assert.ok(w.ledger.length<=80);assert.ok(w.reports.length<=14);assert.ok(w.projects.every(p=>p.progress>=0&&p.progress<100));assert.ok(w.stats.releases>0);
});

test("Decision ID zero remains pending instead of being overwritten every frame",()=>{
 const w=make();w.pendingDecision=0;w.minutes=760;w.nextDecision=700;w.rng=()=>.99;run(w,.5);assert.equal(w.pendingDecision,0);
});
test("A stale or invalid management choice cannot apply to a different decision",()=>{
 const w=make();w.pendingDecision=1;const before=w.budget;assert.equal(w.makeChoice(0,0),false);assert.equal(w.makeChoice(.5,1),false);assert.equal(w.makeChoice(-1,1),false);assert.equal(w.budget,before);assert.ok(w.makeChoice(0,1));assert.equal(w.makeChoice(0,1),false);
});
test("The v0.3 release preserves V2 saved progress and pending decision zero",()=>{
 const a=make();a.day=7;a.budget=208351;a.pendingDecision=0;a.rooms.art=3;a.save();const b=make({storage:a.storage});assert.equal(b.day,7);assert.equal(b.budget,208351);assert.equal(b.pendingDecision,0);assert.equal(b.rooms.art,3);
});
