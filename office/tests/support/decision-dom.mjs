import {parseHTML} from "linkedom";
import {readFile} from "node:fs/promises";
import assert from "node:assert/strict";
const scenario=process.argv[2]||"option-0",option=scenario==="option-1"?1:scenario==="free-choice"?1:0,decision=scenario==="decision-0"||scenario==="free-choice"?0:1,budget=scenario==="unaffordable"?100:scenario==="free-choice"?-1000:208351;
const {window,document}=parseHTML(await readFile(new URL("../../index.html",import.meta.url),"utf8")),store=new Map(),frames=[];
const storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
storage.setItem("draborn-office-v2",JSON.stringify({schema:"draborn-office",version:2,day:3,minutes:760,budget,fans:4000,reputation:48,employees:[],projects:[],pendingDecision:decision,nextDecision:750}));
Object.assign(globalThis,{window,document,localStorage:storage,innerWidth:390,requestAnimationFrame:cb=>frames.push(cb),ResizeObserver:class{constructor(cb){this.cb=cb;}observe(){this.cb();}},location:{protocol:"https:",reload(){throw Error("Unexpected reload");}}});
Object.defineProperty(globalThis,"navigator",{value:{},configurable:true});
window.devicePixelRatio=2;window.matchMedia=()=>({matches:false});
const ctx=()=>new Proxy({measureText:s=>({width:String(s).length*6}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,key)=>key in o?o[key]:()=>{},set:(o,key,value)=>(o[key]=value,true)});
window.HTMLCanvasElement.prototype.getContext=function(){return this._ctx||=ctx();};
window.HTMLCanvasElement.prototype.toDataURL=()=>"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";
document.getElementById("officeStage").getBoundingClientRect=()=>({left:0,top:0,width:390,height:530});
document.getElementById("officeStage").setPointerCapture=()=>{};
const dialog=document.getElementById("drawer");dialog.open=false;dialog.showModal=function(){this.open=true;};dialog.close=function(){this.open=false;this.dispatchEvent(new window.Event("close"));};
globalThis.setInterval=()=>0;globalThis.setTimeout=()=>0;
await import("../../app.js");
let t=performance.now();for(let i=0;i<3;i++){t+=50;frames.shift()(t);}
document.querySelector('[data-open="decision"]').click();
assert.equal(dialog.open,true);assert.equal(document.querySelectorAll("[data-choice]").length,2);
const button=document.querySelector('[data-choice="'+option+'"]');assert.ok(button,"Choice missing");
if(scenario==="unaffordable"){assert.equal(button.disabled,true);button.querySelector("b").click();assert.equal(JSON.parse(storage.getItem("draborn-office-v2")).budget,budget);}
else{
 assert.equal(button.disabled,false,"Affordable and free options must be usable");
 // Touching the label must bubble to the same actual application handler.
 button.querySelector("b").click();
 const after=JSON.parse(storage.getItem("draborn-office-v2"));
 const cost=decision===0?option===0?2300:0:option===0?1750:850;
 assert.equal(after.budget,budget-cost);assert.equal(after.pendingDecision,null);
 assert.equal(document.getElementById("drawerTitle").textContent,"Kararın uygulandı");
 assert.ok(document.querySelector(".decision-receipt"));assert.equal(document.querySelectorAll("[data-choice]").length,0);assert.equal(document.getElementById("decisionChip").hidden,true);
 const previous=after.budget;button.click();assert.equal(JSON.parse(storage.getItem("draborn-office-v2")).budget,previous,"A stale double tap must never charge twice");
 if(decision===1)assert.equal(after.fans,option===0?4320:4210);
 document.querySelector("[data-dismiss]").click();assert.equal(dialog.open,false);
}
console.log(JSON.stringify({scenario,ok:true,environment:"DOM emulation of the actual app click handler"}));
