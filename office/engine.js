import {WORLD,ROOMS,STAFF,PROJECTS,STATIONS,DIALOGUE,CHOICES,DECOR,ROOM_LABELS} from "./data.js";

const T=WORLD.tile;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const chance=(p)=>Math.random()<p;
const pick=(a)=>a[Math.floor(Math.random()*a.length)];
const pad=(v)=>String(v).padStart(2,"0");
const STORAGE_KEY="draborn-office-v1";
const palette={sky:"#10182b",white:"#f5f5ff"};
const neutralRooms={creative:"code",art:"art",studio:"sound",lounge:"break",meeting:"meeting",server:"qa",lobby:"idle"};
const toPoint=(c,r)=>({x:c*T+T/2,y:r*T+T/2});
function colorMix(hex,amount){
 const raw=hex.replace("#","");if(raw.length!==6)return hex;
 const bits=[0,2,4].map(i=>parseInt(raw.slice(i,i+2),16));
 const out=bits.map(v=>clamp(Math.round(v+amount),0,255).toString(16).padStart(2,"0"));
 return "#"+out.join("");
}
function seededHash(a,b){let n=((a+1)*73856093)^((b+1)*19349663);n=((n^n>>>13)*1274126177)|0;return ((n^n>>>16)>>>0)/4294967295;}
const obstacles=new Set(DECOR.filter(d=>d.kind!=="plant").map(d=>d.x+","+d.y));
function findPath(from,goal){
 const sc=clamp(Math.floor(from.x/T),1,WORLD.cols-2),sr=clamp(Math.floor(from.y/T),1,WORLD.rows-2);
 const gc=clamp(goal[0],1,WORLD.cols-2),gr=clamp(goal[1],1,WORLD.rows-2);
 const key=(c,r)=>r*WORLD.cols+c,start=key(sc,sr),end=key(gc,gr);
 if(start===end)return [];
 const queue=[start],came=new Int16Array(WORLD.cols*WORLD.rows).fill(-1);came[start]=start;
 const deltas=[1,-1,WORLD.cols,-WORLD.cols];
 let found=false;
 for(let i=0;i<queue.length&&i<950&&!found;i++){
  const cur=queue[i],c=cur%WORLD.cols,r=Math.floor(cur/WORLD.cols);
  for(const d of deltas){
   const next=cur+d,nc=next%WORLD.cols,nr=Math.floor(next/WORLD.cols);
   if(nc<1||nc>WORLD.cols-2||nr<1||nr>WORLD.rows-2||Math.abs(nc-c)+Math.abs(nr-r)!==1||came[next]!==-1)continue;
   if(obstacles.has(nc+","+nr)&&next!==end)continue;
   came[next]=cur;
   if(next===end){found=true;break;} queue.push(next);
  }
 }
 if(!found)return [toPoint(gc,gr)];
 let cur=end,arr=[];
 while(cur!==start&&arr.length<250){arr.push(toPoint(cur%WORLD.cols,Math.floor(cur/WORLD.cols)));cur=came[cur];}
 return arr.reverse();
}
export class OfficeWorld{
 constructor(){
  this.day=1;this.minutes=9*60+10;this.speed=1;this.budget=185000;this.fans=3250;this.reputation=38;this.creativity=64;
  this.projects=PROJECTS.map(p=>({...p,finished:0,quality:83}));
  this.employees=STAFF.map((a,i)=>({...a,...toPoint(...a.home),path:[],phase:"idle",status:"İşe hazırlanıyor",room:"creative",task:"idle",energy:78+Math.floor(Math.random()*19),morale:76+Math.floor(Math.random()*18),workCount:0,socialCount:0,timer:1+i*.6,wait:2,dialogue:"",dialogueLeft:0,friendships:{},walkFrame:0}));
  for(const person of this.employees)for(const other of this.employees)if(person.id!==other.id)person.friendships[other.id]=45+Math.floor(Math.random()*35);
  this.feed=[];this.achievements=[];this.pendingDecision=null;this.nextDecision=9*60+160;this.nextSocial=14;this.lastDay=1;this.acc=0;this.simElapsed=0;this.onUpdate=null;this.onEvent=null;this._nextStats=0;this._ended=false;
  this.addEvent("🏢","Kapılar açıldı","DraBorn stüdyosunda yeni bir gün başladı.","info",false);
  if(this.restore())this.addEvent("↺","Tekrar hoş geldin","Kayıtlı stüdyo ilerlemen yüklendi.","info",false);
  this.planAll();
 }
 get clock(){const min=Math.floor(this.minutes);return pad(Math.floor(min/60))+":"+pad(min%60);}
 get daypart(){return this.minutes<12*60?"SABAH VARDİYASI":this.minutes<16*60?"ÖĞLEDEN SONRA":"AKŞAM VARDİYASI";}
 get averageMorale(){return Math.round(this.employees.reduce((s,a)=>s+a.morale,0)/this.employees.length);}
 get activeCount(){return this.employees.filter(e=>!["break","idle"].includes(e.task)).length;}
 get employeeCount(){return this.employees.length;}
 getRoomByPoint(x,y){return ROOMS.find(r=>x>=r.x*T&&x<(r.x+r.w)*T&&y>=r.y*T&&y<(r.y+r.h)*T)||ROOMS[0];}
 findPerson(id){return this.employees.find(p=>p.id===id);}
 projectById(id){return this.projects.find(p=>p.id===id);}
 emit(){this.onUpdate?.();}
 addEvent(icon,title,detail,kind="info",notify=true){
  const item={id:Date.now()+"-"+Math.round(Math.random()*1e5),icon,title,detail,kind,time:this.clock,day:this.day};
  this.feed.unshift(item);if(this.feed.length>60)this.feed.length=60;
  this.onEvent?.(item);if(notify)this.emit();return item;
 }
 say(p,text){p.dialogue=text;p.dialogueLeft=4.8;if(chance(.3))this.addEvent("💬",p.name+" konuşuyor",text,"social",false);}
 chooseTask(p,forced){
  const low=p.energy<34||p.morale<35,work=this.minutes>9*60&&this.minutes<17*60+30;
  const preference=(p.team==="Sanat"?"art":p.team==="Geliştirme"?"creative":p.team==="Prodüksiyon"?"studio":p.team==="Teknoloji"?"server":p.team==="Topluluk"?"lounge":"meeting");
  let room=preference;
  if(forced==="break"||low)room="lounge";
  else if(forced==="meeting"||chance(.12))room="meeting";
  else if(forced==="social"||chance(.11))room="lounge";
  else if(!work||chance(.07))room="lobby";
  else if(forced==="focus")room=preference;
  const pool=STATIONS[room],slot=pick(pool);
  p.room=room;p.task=room==="lounge"?"break":neutralRooms[room];p.status=room==="lounge"?"Kahve molasında":room==="lobby"?"Ofisi geziyor":room==="meeting"?"Planlama yapıyor":room==="server"?"Hata test ediyor":room==="studio"?"Sesleri düzenliyor":room==="art"?"Görsel üretiyor":"Üzerinde çalışıyor";
  if(forced==="focus"){p.task=p.team==="Sanat"?"art":p.team==="Teknoloji"?"qa":p.team==="Prodüksiyon"?"sound":"code";p.status="Odak modunda";}
  p.path=findPath(p,slot);p.wait=3+Math.random()*8;p.timer=8+Math.random()*13;
  if(p.path.length){p.phase="walk";p.status="Hareket ediyor";}else p.phase="busy";
  if(chance(.17))this.say(p,pick(DIALOGUE[p.task]||DIALOGUE.idle));
 }
 planAll(){for(const person of this.employees){if(person.phase==="idle")this.chooseTask(person);}}
 setSpeed(speed){this.speed=[0,1,2,4].includes(speed)?speed:1;this.emit();}
 tick(delta){
  delta=clamp(delta,0,.08);if(this.speed===0)return;
  this.simElapsed+=delta*this.speed;this.minutes+=delta*2.75*this.speed;
  if(this.minutes>=18*60){
   const leftover=this.minutes-18*60;this.day++;this.minutes=9*60+leftover;
   const salaries=7500+this.employees.length*230;
   this.budget-=salaries;
   this.fans+=Math.round(35+Math.random()*70);
   for(const p of this.employees){p.energy=clamp(p.energy+35,0,100);p.morale=clamp(p.morale+4,0,100);p.phase="idle";p.path=[];}
   this.addEvent("🌅","Yeni bir gün: "+this.day,"Maaş ve işletme gideri: -₺"+salaries.toLocaleString("tr-TR")+". Ekip yenilendi.","system");
  }
  if(this.minutes>=this.nextDecision&&!this.pendingDecision){
   this.nextDecision=this.minutes+140+Math.random()*150;
   const template=CHOICES[(this.day+this.achievements.length+Math.floor(Math.random()*CHOICES.length))%CHOICES.length];
   this.pendingDecision={...template};this.addEvent("⚡","Yönetim kararı bekleniyor",template.title,"decision");
  }
  this.acc+=delta*this.speed;
  if(this.acc>=1){
   const n=Math.min(4,Math.floor(this.acc));this.acc-=n;
   this.updateProduction(n);this.updateSocial(n);
  }
  for(const p of this.employees){
   if(p.dialogueLeft>0)p.dialogueLeft=Math.max(0,p.dialogueLeft-delta*this.speed);
   if(p.phase==="walk"&&p.path.length){
    const next=p.path[0],dx=next.x-p.x,dy=next.y-p.y,dist=Math.hypot(dx,dy);
    const step=clamp((44+p.skill*.4)*delta*this.speed,0,12);
    if(dist<=step){p.x=next.x;p.y=next.y;p.path.shift();}
    else{p.x+=dx/dist*step;p.y+=dy/dist*step;}
    p.walkFrame+=delta*9*this.speed;
    if(!p.path.length){p.phase="busy";p.status=p.task==="break"?"Kahve molasında":p.task==="meeting"?"Toplantıda":p.task==="qa"?"Hata test ediyor":p.task==="sound"?"Prodüksiyonda":p.task==="art"?"Tasarım yapıyor":"Üzerinde çalışıyor";p.wait=4+Math.random()*6;}
   }else{
    p.timer-=delta*this.speed;
    if(p.timer<=0){this.chooseTask(p);if(chance(.28))this.say(p,pick(DIALOGUE[p.task]||DIALOGUE.idle));}
   }
  }
  if(this.simElapsed>=this._nextStats){this._nextStats=this.simElapsed+1.3;this.emit();}
 }
 updateProduction(dt){
  const active=this.employees.filter(e=>e.phase==="busy"&&e.task!=="break"&&e.task!=="idle");
  for(const p of this.employees){
   if(p.phase==="busy"&&p.task==="break"){p.energy=clamp(p.energy+dt*2.2,0,100);p.morale=clamp(p.morale+dt*.48,0,100);}
   else if(p.phase==="busy"){p.energy=clamp(p.energy-dt*(.24+.08*this.speed),0,100);p.workCount+=dt;p.morale=clamp(p.morale-dt*.035,0,100);}
  }
  if(active.length===0)return;
  const ratio=(active.reduce((s,p)=>s+(p.skill/90)*(.48+p.energy/200)*(.55+p.morale/220),0)/active.length);
  for(const project of this.projects){
   const gain=(.085+active.length*.017)*ratio*dt*(this.creativity/75)*(project.type==="game"?1:.92);
   project.progress=clamp(project.progress+gain,0,100);
   if(project.progress>=99.999)this.release(project);
  }
  if(chance(.04)){this.creativity=clamp(this.creativity+1,0,100);}
 }
 updateSocial(dt){
  this.nextSocial-=dt;
  if(this.nextSocial>0)return;
  this.nextSocial=8+Math.random()*8;
  const candidate=pick(this.employees);
  const near=this.employees.filter(p=>p!==candidate&&Math.hypot(p.x-candidate.x,p.y-candidate.y)<160);
  if(!near.length)return;
  const friend=pick(near),delta=2+Math.round(Math.random()*4);
  candidate.friendships[friend.id]=clamp((candidate.friendships[friend.id]||50)+delta,0,100);
  friend.friendships[candidate.id]=clamp((friend.friendships[candidate.id]||50)+delta,0,100);
  candidate.socialCount++;friend.socialCount++;candidate.morale=clamp(candidate.morale+1,0,100);friend.morale=clamp(friend.morale+1,0,100);
  this.say(candidate,pick(DIALOGUE.greet));
  if(chance(.55))this.say(friend,pick(DIALOGUE.greet));
  if(chance(.37))this.addEvent("🤝",candidate.name+" & "+friend.name,"Koridorda karşılaştı; ekip bağları güçleniyor.","social",false);
 }
 release(project){
  project.finished++;
  const income=Math.round((12000+Math.random()*19000)*(1+this.reputation/100)*project.audience);
  const fans=Math.round((360+Math.random()*590)*project.audience);
  this.budget+=income;this.fans+=fans;this.reputation=clamp(this.reputation+3,0,100);this.creativity=clamp(this.creativity+2,0,100);
  project.progress=12+Math.round(Math.random()*8);
  project.quality=clamp(project.quality+Math.round(Math.random()*5-1),20,99);
  this.addEvent("🚀",project.name+" güncellendi!","Gelir +₺"+income.toLocaleString("tr-TR")+", +"+fans+" hayran. "+project.finished+". başarılı sürüm.","launch");
  if(!this.achievements.includes("firstLaunch")){this.achievements.push("firstLaunch");this.addEvent("🏆","İlk büyük başarı!","Stüdyonun ilk yeni sürümünü yayınladın.","achievement");}
  this.employees.forEach(e=>e.morale=clamp(e.morale+4,0,100));
 }
 makeChoice(index){
  if(!this.pendingDecision||!this.pendingDecision.options[index])return false;
  const choice=this.pendingDecision.options[index],effect=choice.effect;
  this.adjust(effect);this.pendingDecision=null;
  this.addEvent("✨","Karar uygulandı",choice.text,"decision");this.save();this.emit();return true;
 }
 adjust(e){
  this.budget+=e.budget||0;this.fans=Math.max(0,this.fans+(e.fans||0));
  this.reputation=clamp(this.reputation+(e.rep||0),0,100);this.creativity=clamp(this.creativity+(e.creativity||0),0,100);
  for(const p of this.employees)p.morale=clamp(p.morale+(e.morale||0),0,100);
  if(e.boost){for(const project of this.projects)project.progress=clamp(project.progress+e.boost/this.projects.length,0,99);}
 }
 interact(personId,action){
  const p=this.findPerson(personId);if(!p)return false;
  if(action==="coffee"){if(this.budget<200)return false;this.budget-=200;p.energy=clamp(p.energy+23,0,100);p.morale=clamp(p.morale+7,0,100);this.chooseTask(p,"break");this.say(p,"Tam zamanında bir kahve! Teşekkürler ☕");this.addEvent("☕",p.name+" kahve molasında","Enerjisi ve morali arttı.","action");}
  if(action==="motivate"){p.morale=clamp(p.morale+13,0,100);this.say(p,"Bunu duymak iyi geldi! Hadi işe!");this.addEvent("♡",p.name+" motive oldu","Motivasyon konuşman olumlu sonuç verdi.","action");}
  if(action==="focus"){this.chooseTask(p,"focus");p.energy=clamp(p.energy-3,0,100);this.say(p,"Tamam, odak moduna geçiyorum.");this.addEvent("⚡",p.name+" odaklandı","Yeni bir işe başladı.","action");}
  if(action==="talk"){this.say(p,pick(DIALOGUE.greet));p.morale=clamp(p.morale+2,0,100);}
  this.save();this.emit();return true;
 }
 invest(projectId){
  const p=this.projectById(projectId);if(!p||this.budget<1800)return false;
  this.budget-=1800;p.progress=clamp(p.progress+7,0,99);this.creativity=clamp(this.creativity+1,0,100);
  this.addEvent("✦","Projeye yatırım",p.name+" üretimi +%7 ilerledi.","project");this.save();this.emit();return true;
 }
 reset(){try{localStorage.removeItem(STORAGE_KEY);}catch{}}
 save(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({
   version:1,day:this.day,minutes:this.minutes,budget:this.budget,fans:this.fans,reputation:this.reputation,creativity:this.creativity,
   projects:this.projects.map(p=>({id:p.id,progress:p.progress,finished:p.finished,quality:p.quality})),
   employees:this.employees.map(p=>({id:p.id,energy:p.energy,morale:p.morale,workCount:p.workCount,socialCount:p.socialCount,friendships:p.friendships})),
   achievements:this.achievements,pendingDecision:this.pendingDecision,nextDecision:this.nextDecision,storedAt:Date.now()
  }));return true;}catch{return false;}
 }
 restore(){
  try{
   const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return false;
   const s=JSON.parse(raw);if(s.version!==1||!Number.isFinite(s.day)||s.day<1)return false;
   this.day=clamp(s.day,1,9999);this.minutes=clamp(s.minutes||550,540,1079);this.budget=clamp(s.budget||0,-1e8,1e9);
   this.fans=clamp(s.fans||0,0,1e9);this.reputation=clamp(s.reputation||0,0,100);this.creativity=clamp(s.creativity||0,0,100);
   for(const p of this.projects){const saved=s.projects?.find(v=>v.id===p.id);if(saved){p.progress=clamp(saved.progress||0,0,99);p.finished=clamp(saved.finished||0,0,999);p.quality=clamp(saved.quality||75,0,100);}}
   for(const p of this.employees){const saved=s.employees?.find(v=>v.id===p.id);if(saved){p.energy=clamp(saved.energy||60,0,100);p.morale=clamp(saved.morale||60,0,100);p.workCount=clamp(saved.workCount||0,0,1e7);p.socialCount=clamp(saved.socialCount||0,0,1e7);p.friendships={...p.friendships,...saved.friendships};}}
   this.achievements=Array.isArray(s.achievements)?s.achievements.slice(0,30):[];this.pendingDecision=s.pendingDecision||null;
   this.nextDecision=Number.isFinite(s.nextDecision)&&s.nextDecision>this.minutes?s.nextDecision:this.minutes+160;
   // Offline progression is intentionally paused: simulated time never claims to run while the tab is closed.
   return true;
  }catch{return false;}
 }
}

const pixel=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const panel=(c,x,y,w,h,fill,stroke="#ffffff22",radius=4)=>{
 c.beginPath();c.roundRect(x,y,w,h,radius);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}
};
function furniture(c,d,tick){
 const x=d.x*T,y=d.y*T,kind=d.kind;
 c.save();
 if(kind==="desk"||kind==="console"){
  pixel(c,x-7,y+9,60,28,"#090f20a0");
  panel(c,x-8,y+1,59,27,kind==="console"?"#705287":"#987088","#1d1939",4);
  panel(c,x-5,y-3,53,21,kind==="console"?"#544577":"#b78478","#ffffff22",3);
  panel(c,x+10,y-11,25,19,"#1b2544","#10172b",3);
  panel(c,x+12,y-9,21,14,kind==="console"?"#f292bd":"#489bc8",null,1);
  pixel(c,x+16,y-6,14,2,"#e5f4ff88");pixel(c,x+16,y-2,9,1,"#dff4ff88");
  panel(c,x+15,y+12,17,3,"#e5dce3",null,1);
  pixel(c,x+40,y+1,4,6,"#f5c7a4");
  panel(c,x+14,y+27,17,10,"#47425d",null,3);
 }
 if(kind==="couch"){
  pixel(c,x+1,y+8,77,39,"#0a111e92");
  panel(c,x-6,y+1,78,33,"#2d797b","#163d50",7);
  panel(c,x+2,y+3,61,21,"#5a9f9b",null,5);
  panel(c,x+2,y+20,61,10,"#367a82",null,3);
  panel(c,x+10,y+7,17,13,"#f5bdc5",null,4);panel(c,x+37,y+7,17,13,"#a6a9f6",null,4);
 }
 if(kind==="coffee"){
  panel(c,x-4,y+4,45,27,"#75564a","#3a3337",4);
  panel(c,x+5,y+6,27,14,"#c79877",null,2);
  panel(c,x+8,y+8,8,8,"#e1e8f0",null,3);
  panel(c,x+19,y+8,8,8,"#eed8a4",null,3);
  pixel(c,x+33,y-4,9,12,"#545468");pixel(c,x+34,y-7,7,5,"#a1d8dd");
 }
 if(kind==="meeting"){
  pixel(c,x+4,y+11,94,41,"#080d1b88");
  panel(c,x-6,y+2,90,42,"#694d75","#372741",10);
  panel(c,x-2,y+5,82,32,"#9c7196","#d0a3a522",8);
  for(let i=0;i<3;i++){panel(c,x+8+i*25,y-10,15,9,"#42445e",null,4);panel(c,x+8+i*25,y+42,15,9,"#42445e",null,4);}
  pixel(c,x+35,y+13,13,17,"#c8d2ed");
 }
 if(kind==="rack"){
  pixel(c,x-3,y+13,34,43,"#080e18aa");
  panel(c,x-6,y-9,31,51,"#303d53","#151e37",4);
  panel(c,x-2,y-6,23,41,"#131e31",null,2);
  for(let j=0;j<4;j++){pixel(c,x+1,y-2+j*9,18,6,"#3b5874");pixel(c,x+3,y+j*9,4,2,j===2?"#e9b0ff":"#4efac0");pixel(c,x+11,y+j*9,6,2,"#73b8ff");}
 }
 if(kind==="plant"){
  pixel(c,x+6,y+13,22,9,"#15252b80");
  panel(c,x+8,y+5,18,18,"#bd7c7a","#5a414d",3);
  for(let i=0;i<7;i++){let a=i*2.399+tick*.03;pixel(c,x+16+Math.cos(a)*9,y+4+Math.sin(a)*8,8,8,i%2?"#3fd2a4":"#258f87");}
  pixel(c,x+15,y+1,5,6,"#66f0b9");
 }
 if(kind==="reception"){
  panel(c,x-5,y+5,105,30,"#997d9a","#5d536e",5);panel(c,x+2,y+7,90,22,"#c8a3ab",null,2);
  panel(c,x+33,y-12,29,24,"#24395a","#131a35",2);pixel(c,x+37,y-9,21,17,"#6cece8");
  pixel(c,x+42,y-4,12,2,"#efffff");
 }
 if(kind==="screen"){
  panel(c,x-2,y-16,86,52,"#242944","#161b37",4);
  panel(c,x+3,y-11,76,39,"#4a3576",null,2);
  panel(c,x+6,y+3,70,15,"#ec64b2",null,3);
  c.font="bold 12px system-ui";c.fillStyle="#fff";c.fillText("DRABORN",x+9,y+15);
  pixel(c,x+36,y+37,9,7,"#75809c");
 }
 if(kind==="arcade"){
  panel(c,x+1,y-16,34,61,"#ad60bc","#322848",5);
  panel(c,x+5,y-10,26,27,"#19263b",null,3);
  panel(c,x+7,y-7,22,20,"#4b83b8",null,2);
  pixel(c,x+11,y+2,6,6,"#ffcb6b");pixel(c,x+20,y-1,5,5,"#8df3e1");
  pixel(c,x+8,y+22,8,3,"#f0adcb");pixel(c,x+22,y+24,4,4,"#f7d98c");
 }
 c.restore();
}
function drawPortrait(c,p,x,y,t,selected){
 const walking=p.phase==="walk";const step=walking?Math.sin(p.walkFrame*1.5)*3:0;
 const bob=walking?Math.abs(step)*.45:Math.sin(t*.002+p.skill)*.7;
 const cy=y-bob;
 c.save();
 c.fillStyle="#05091566";c.beginPath();c.ellipse(x,cy+13,12,4,0,0,Math.PI*2);c.fill();
 if(selected){c.shadowBlur=12;c.shadowColor=p.color;c.strokeStyle=p.color;c.lineWidth=2;c.beginPath();c.ellipse(x,cy+12,16,6,0,0,Math.PI*2);c.stroke();c.shadowBlur=0;}
 panel(c,x-7,cy-1,14,15,p.top,"#251e38",4);
 pixel(c,x-9,cy+3,3,8,p.skin);pixel(c,x+6,cy+3,3,8,p.skin);
 pixel(c,x-6,cy+11,5,7+step,"#23314d");pixel(c,x+1,cy+11,5,7-step,"#263451");
 panel(c,x-7,cy-16,14,17,p.skin,"#4c3741",4);
 panel(c,x-8,cy-18,16,8,p.hair,null,4);
 pixel(c,x-6,cy-13,2,6,p.hair);pixel(c,x+4,cy-13,2,6,p.hair);
 pixel(c,x-4,cy-9,2,2,"#302336");pixel(c,x+3,cy-9,2,2,"#302336");
 pixel(c,x-1,cy-5,3,1,"#a65b68");
 c.font="bold 10px system-ui";c.textAlign="center";c.fillStyle="#10152b";panel(c,x-27,cy+20,54,15,"#11172ae3","#ffffff25",4);
 c.fillStyle=selected?"#ffe4fa":"#e8efff";c.fillText(p.name,x,cy+31);
 if(p.dialogue&&p.dialogueLeft>0){
  let msg=p.dialogue.length>34?p.dialogue.slice(0,33)+"…":p.dialogue;
  c.font="10px system-ui";const tw=Math.min(190,c.measureText(msg).width+18);
  let sx=clamp(x-tw/2,4,WORLD.width-tw-4),sy=cy-56;
  panel(c,sx,sy,tw,25,"#101628ed",p.color,7);
  c.fillStyle="#eef4ff";c.textAlign="center";c.fillText(msg,sx+tw/2,sy+16);
  pixel(c,x-2,sy+24,5,4,p.color);
 }
 c.restore();
}
export function drawWorld(c,w,camera,elapsed){
 const scale=camera.scale||1,x=camera.x||0,y=camera.y||0;
 c.clearRect(0,0,WORLD.width,WORLD.height);c.fillStyle="#08101f";c.fillRect(0,0,WORLD.width,WORLD.height);
 c.save();c.translate(x,y);c.scale(scale,scale);
 const dark=w.minutes>=16*60;
 for(const room of ROOMS){
  const rx=room.x*T,ry=room.y*T,rw=room.w*T,rh=room.h*T;
  const g=c.createLinearGradient(rx,ry,rx+rw,ry+rh);g.addColorStop(0,colorMix(room.color,8));g.addColorStop(1,colorMix(room.color,-15));
  c.fillStyle=g;c.fillRect(rx,ry,rw,rh);
  for(let yy=room.y;yy<room.y+room.h;yy++)for(let xx=room.x;xx<room.x+room.w;xx++){
   const f=seededHash(xx,yy);
   if((xx+yy)%2===0){c.fillStyle="#ffffff06";c.fillRect(xx*T,yy*T,T,T);}
   if(f>.77){pixel(c,xx*T+5,yy*T+6,2,2,"#ffffff10");pixel(c,xx*T+23,yy*T+23,4,1,"#00000012");}
  }
  c.lineWidth=5;c.strokeStyle="#11162e";c.strokeRect(rx+2,ry+2,rw-4,rh-4);
  c.lineWidth=2;c.strokeStyle="#d1d4fa2e";c.strokeRect(rx+6,ry+6,rw-12,rh-12);
  c.font="bold 12px system-ui";c.textAlign="left";c.fillStyle="#f5f3ffad";c.fillText(ROOM_LABELS[room.id],rx+16,ry+23);
  c.fillStyle="#ffffff4a";c.font="9px system-ui";c.fillText(room.sub,rx+16,ry+37);
 }
 // Floor markers, glass doors, and atmosphere lights.
 for(let i=0;i<10;i++){
  const xx=((i*141+67)%1080)+25,yy=((i*191+53)%665)+40;
  c.fillStyle=i%2?"#ffffff0b":"#90d0ff0c";c.beginPath();c.arc(xx,yy,11+Math.sin(elapsed*.0005+i)*3,0,Math.PI*2);c.fill();
 }
 for(const d of DECOR)furniture(c,d,elapsed*.001);
 // Show the office entrance and visitor walkway.
 for(let i=0;i<9;i++){c.fillStyle=i%2?"#ddc8f30e":"#fcd6ff16";c.fillRect(10*T+i*55,22*T+5,25,2);}
 const agents=[...w.employees].sort((a,b)=>a.y-b.y);
 for(const p of agents)drawPortrait(c,p,p.x,p.y,elapsed,w.selectedId===p.id);
 if(dark){c.fillStyle="rgba(10,12,37,.16)";c.fillRect(0,0,WORLD.width,WORLD.height);}
 c.restore();
}
export function formatCurrency(num){return "₺"+Math.round(num).toLocaleString("tr-TR");}
export function getStorageKey(){return STORAGE_KEY;}
