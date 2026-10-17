import {WORLD,ROOMS,STAFF,PROJECTS,STATIONS,DIALOGUE,CHOICES,DECOR,RESEARCH,MILESTONES,SCENES,GENRES} from "./data.js?v=0.3.0";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const num=(v,f=0,a=0,b=1e9)=>Number.isFinite(v)?clamp(v,a,b):f;
const text=(s,n=160)=>typeof s==="string"?s.slice(0,n):"";
const T=WORLD.tile,KEY="draborn-office-v2",LEGACY="draborn-office-v1";
const safeStorage=()=>{try{return globalThis.localStorage;}catch{return null;}};
const center=([x,y])=>({x:x*T+T/2,y:y*T+T/2});
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const preferred={Yönetim:"meeting",Geliştirme:"creative",Sanat:"art",Prodüksiyon:"studio",Teknoloji:"server",Topluluk:"lounge"};
const tasks={creative:"code",art:"art",studio:"sound",lounge:"break",meeting:"meeting",server:"qa",lobby:"idle"};
const status={code:"Oynanış geliştiriyor",art:"Görsel tasarlıyor",sound:"Sesleri düzenliyor",break:"Kahve molasında",meeting:"Sprint planlıyor",qa:"Hata test ediyor",idle:"Ofisi geziyor",community:"Geri bildirim okuyor"};
export const blocked=new Set();
for(const d of DECOR){const w=d.kind==="meeting"?3:d.kind==="reception"||d.kind==="couch"?2:1;for(let i=0;i<w;i++)blocked.add((d.x+i)+","+d.y);}
// The cutaway walls have actual doorways, shared by the navigation mesh.
for(let y=0;y<11;y++)if(![5,6,9].includes(y))blocked.add("18,"+y);
for(let x=0;x<36;x++)if(![5,6,14,15,22,23,30,31].includes(x))blocked.add(x+",11");
for(const x of [11,19,27])for(let y=12;y<19;y++)if(![15,16,18].includes(y))blocked.add(x+","+y);
for(let x=0;x<36;x++)if(![5,6,14,15,22,23,30,31].includes(x))blocked.add(x+",19");
export function findPath(from,goal){
 const sc=clamp(Math.floor(from.x/T),1,34),sr=clamp(Math.floor(from.y/T),1,22),gc=clamp(goal[0],1,34),gr=clamp(goal[1],1,22);
 const start=sr*36+sc,end=gr*36+gc;if(start===end)return [];
 const queue=[start],came=new Int16Array(864).fill(-1);came[start]=start;
 for(let i=0;i<queue.length;i++){
  const cur=queue[i];if(cur===end)break;const c=cur%36,r=Math.floor(cur/36);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=c+dx,ny=r+dy,n=ny*36+nx;
   if(nx<1||nx>34||ny<1||ny>22||came[n]!==-1||(blocked.has(nx+","+ny)&&n!==end))continue;
   came[n]=cur;queue.push(n);
  }
 }
 if(came[end]===-1)return [];
 const path=[];for(let n=end;n!==start;n=came[n])path.push(center([n%36,Math.floor(n/36)]));return path.reverse();
}
export class OfficeWorld{
 constructor({storage=safeStorage(),random=Math.random,restore=true}={}){
  this.storage=storage;this.rng=random;this.day=1;this.minutes=550;this.speed=1;this.budget=185000;this.fans=3250;this.reputation=38;this.creativity=64;
  this.projects=PROJECTS.map(p=>({...p,finished:0,quality:83,bugs:9,priority:"balanced",income:0}));
  this.employees=STAFF.map((p,i)=>({...p,...center(p.home),phase:"idle",room:preferred[p.team],task:"idle",status:"Güne hazırlanıyor",energy:82+this.rng()*14,morale:80+this.rng()*12,workCount:0,socialCount:0,path:[],timer:3+i*.5,dialogue:"",dialogueLeft:0,walkFrame:0,friendships:{},projectId:PROJECTS[i%3].id,cooldowns:{}}));
  for(const p of this.employees)for(const q of this.employees)if(p!==q)p.friendships[q.id]=45+Math.round(this.rng()*30);
  this.rooms=Object.fromEntries(ROOMS.map(r=>[r.id,1]));this.research=[];this.achievements=[];this.claimed=[];this.feed=[];this.chats=[];this.ledger=[];this.reports=[];this.settings={theme:"auto",labels:true,effects:true,sound:false,voice:false,fontScale:1};
  this.stats={releases:0,upgrades:0,investments:0,earned:0,spent:0};this.pendingDecision=null;this.nextDecision=650;this.nextSocial=5;this.simElapsed=0;this.acc=0;this._nextStats=0;this.meetingAt=-1;this.contractDay=0;this.selectedId=null;this.sequence=null;this.lastSave=0;this.onUpdate=null;this.onEvent=null;
  const restored=restore&&this.restore();
  this.addEvent("home",restored?"Stüdyona tekrar hoş geldin":"Yeni bir hikâye başlıyor",restored?"Kayıtlı ilerleme güvenle yüklendi.":"20 yaratıcı insan, bir stüdyo, sayısız fikir. Bugün ne üreteceğiz?","system");
  if(!this.chats.length){this.chat("dogancan","Günaydın ekip! Bugün harika bir şey üretelim. 🦅");this.chat("ada","Yeni konsept çizimleri hazır. Yorumlarınızı bekliyorum!");this.chat("arda","Prototip çalışıyor. Kahveler hazırsa başlayalım. ☕");}
  this.planAll();
 }
 pick(a){return a[Math.floor(this.rng()*a.length)];}
 get clock(){const m=Math.floor(this.minutes);return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");}
 get averageMorale(){return Math.round(this.employees.reduce((s,p)=>s+p.morale,0)/this.employees.length);}
 get averageEnergy(){return Math.round(this.employees.reduce((s,p)=>s+p.energy,0)/this.employees.length);}
 get activeCount(){return this.employees.filter(p=>p.phase==="busy"&&!['break','idle'].includes(p.task)).length;}
 get employeeCount(){return this.employees.length;}
 get daypart(){return this.minutes<720?"Sabah vardiyası":this.minutes<960?"Öğleden sonra":"Gün batımı";}
 get salary(){return 7500+this.employees.length*230;}
 get level(){return 1+Math.floor(this.reputation/15);}
 findPerson(id){return this.employees.find(p=>p.id===id);}
 projectById(id){return this.projects.find(p=>p.id===id);}
 getRoomByPoint(x,y){return ROOMS.find(r=>x>=r.x*T&&x<(r.x+r.w)*T&&y>=r.y*T&&y<(r.y+r.h)*T);}
 emit(){this.onUpdate?.();}
 addEvent(icon,title,detail,kind="info"){
  const e={id:uid(),icon,title,detail,kind,time:this.clock,day:this.day};this.feed.unshift(e);this.feed.length=Math.min(this.feed.length,80);this.onEvent?.(e);return e;
 }
 chat(personId,message,topic="genel",replyTo=null){const e={id:uid(),personId,text:text(message,280),topic,time:this.clock,day:this.day,replyTo};this.chats.push(e);if(this.chats.length>100)this.chats.shift();return e;}
 say(p,message,log=false){p.dialogue=message;p.dialogueLeft=7;if(log)this.chat(p.id,message);}
 transact(amount,reason,day=this.day){this.budget+=amount;if(amount>0)this.stats.earned+=amount;else this.stats.spent-=amount;this.ledger.unshift({day,time:this.clock,amount,reason});this.ledger.length=Math.min(80,this.ledger.length);}
 canSpend(cost){return this.budget>=cost;}
 chooseTask(p,forced){
  let room=preferred[p.team];
  if(forced==="break"||p.energy<30||p.morale<30)room="lounge";
  else if(forced==="meeting")room="meeting";
  else if(forced!=="focus"){const r=this.rng();if(r<.1)room="lounge";else if(r<.16)room="lobby";else if(r<.24)room="meeting";}
  const slots=[...STATIONS[room]],reserved=this.employees.filter(q=>q!==p&&q.target&&q.room===room).map(q=>q.target.join(","));
  const free=slots.filter(s=>!reserved.includes(s.join(",")));const target=this.pick(free.length?free:slots);
  p.target=target;p.room=room;p.task=forced==="focus"&&p.team==="Topluluk"?"community":tasks[room];
  if(p.team==="Topluluk"&&room==="lounge"&&forced!=="break"&&p.energy>40&&this.rng()>.3)p.task="community";
  p.path=findPath(p,target);p.phase=p.path.length?"walk":"busy";p.status=p.path.length?"Yürüyüşte":status[p.task];p.timer=12+this.rng()*18;
 }
 planAll(){this.employees.forEach(p=>{if(p.phase==="idle")this.chooseTask(p);});}
 setSpeed(speed){if([0,1,2,4].includes(speed))this.speed=speed;this.emit();}
 tick(delta){
  if(!Number.isFinite(delta)||delta<=0||!this.speed)return;
  const dt=Math.min(delta,.1)*this.speed;this.simElapsed+=dt;this.minutes+=dt*2.75;
  if(this.minutes>=1080)this.newDay();
  if(this.minutes>=this.nextDecision&&this.pendingDecision===null){const template=this.pick(CHOICES);this.pendingDecision=CHOICES.indexOf(template);this.nextDecision=this.minutes+150;this.addEvent("bolt","Bir karar seni bekliyor",template.title,"decision");}
  this.acc+=dt;while(this.acc>=1){this.acc--;this.updateProduction(1);this.updateSocial(1);this.checkMilestones();}
  for(const p of this.employees){
   p.dialogueLeft=Math.max(0,p.dialogueLeft-dt);
   if(p.path.length){const n=p.path[0],dx=n.x-p.x,dy=n.y-p.y,d=Math.hypot(dx,dy),step=(43+p.skill*.3)*dt;p.walkFrame+=dt*8;
    p.facing=dx<0?"left":dy<0?"up":dx>0?"right":"down";
    if(d<=step){p.x=n.x;p.y=n.y;p.path.shift();}else{p.x+=dx/d*step;p.y+=dy/d*step;}
    if(!p.path.length){p.phase="busy";p.status=status[p.task];}
   }else{p.timer-=dt;if(p.timer<=0){this.chooseTask(p);if(this.rng()<.25)this.say(p,this.pick(DIALOGUE[p.task]||DIALOGUE.idle));}}
  }
  if(this.simElapsed>=this._nextStats){this._nextStats=this.simElapsed+1;this.emit();}
 }
 newDay(){
  const oldDay=this.day;this.day++;this.minutes=540+(this.minutes-1080);this.nextDecision=this.minutes+100;
  const entries=this.ledger.filter(e=>e.day===oldDay),income=entries.filter(e=>e.amount>0).reduce((s,e)=>s+e.amount,0),out=entries.filter(e=>e.amount<0).reduce((s,e)=>s-e.amount,0);
  this.reports.unshift({day:oldDay,income,expenses:out+this.salary,morale:this.averageMorale,releases:this.stats.releases});this.reports.length=Math.min(14,this.reports.length);
  this.transact(-this.salary,"Gün "+oldDay+" • maaş ve işletme gideri",oldDay);this.fans+=Math.round(35+this.rng()*40);
  for(const p of this.employees){p.energy=clamp(p.energy+40,0,100);p.morale=clamp(p.morale+3,0,100);}
  this.addEvent("sun","Gün "+this.day+" · Yeni bir başlangıç",formatCurrency(this.salary)+" işletme gideri ödendi. Ekip dinlendi.","system");this.save();
 }
 updateProduction(dt){
  for(const p of this.employees)if(p.phase==="busy"){
   if(p.task==="break"){p.energy=clamp(p.energy+dt*(2.1+this.rooms.lounge*.15),0,100);p.morale=clamp(p.morale+dt*.45,0,100);}
   else if(p.task!=="idle"){p.energy=clamp(p.energy-dt*.27*(this.research.includes("ergonomics")?.78:1),0,100);p.morale=clamp(p.morale-dt*.035,0,100);p.workCount+=dt;}
  }
  for(const project of this.projects){
   const active=this.employees.filter(p=>p.projectId===project.id&&p.phase==="busy"&&!['break','idle'].includes(p.task));if(!active.length)continue;
   const power=active.reduce((s,p)=>s+(p.skill/90)*(.45+p.energy/200)*(.55+p.morale/220)*(1+(this.rooms[p.room]-1)*.09),0);
   const mult=(1+(this.research.includes("workflow")?.15:0)+(this.research.includes("render")?.2:0))*(project.priority==="speed"?1.3:project.priority==="quality"?.83:1);
   project.progress=clamp(project.progress+(.035+power*.055)*dt*mult,0,100);
   const testers=active.filter(p=>p.task==="qa").length;
   project.bugs=clamp(project.bugs+dt*(project.priority==="speed"?.025:.008)-testers*dt*.08*(this.research.includes("qa")?1.4:1),0,40);
   project.quality=clamp(project.quality+dt*(project.priority==="quality"?.016:.004),20,99);
   if(project.progress>=100)this.release(project);
  }
 }
 updateSocial(dt){
  if(this.sequence){this.sequence.left-=dt;if(this.sequence.left<=0){const s=this.sequence,p=this.findPerson(s.people[s.index%s.people.length]),msg=s.lines[s.index];this.say(p,msg);this.chat(p.id,msg,s.topic,s.lastId);s.lastId=this.chats.at(-1).id;s.index++;s.left=5;if(s.index>=s.lines.length)this.sequence=null;}return;}
  this.nextSocial-=dt;if(this.nextSocial>0)return;this.nextSocial=12+this.rng()*10;
  const a=this.pick(this.employees),near=this.employees.filter(p=>p!==a&&Math.hypot(p.x-a.x,p.y-a.y)<220);
  if(!near.length){this.say(a,this.pick(DIALOGUE[a.task]||DIALOGUE.idle),true);return;}
  const b=this.pick(near),scene=this.pick(SCENES),relation=scene.topic.includes("anlaşmazlık")?-3:3;
  a.friendships[b.id]=clamp(a.friendships[b.id]+relation,0,100);b.friendships[a.id]=clamp(b.friendships[a.id]+relation,0,100);a.socialCount++;b.socialCount++;
  this.say(a,scene.lines[0]);const first=this.chat(a.id,scene.lines[0],scene.topic);
  this.sequence={people:[a.id,b.id],lines:scene.lines,topic:scene.topic,index:1,left:5,lastId:first.id};
  this.addEvent("message",a.name+" & "+b.name,scene.topic,"social");
 }
 release(p){
  p.finished++;this.stats.releases++;
  const quality=clamp(p.quality-p.bugs*.6,20,99),income=Math.round((18000+this.rng()*16000)*(1+this.reputation/120)*p.audience*(.65+quality/200)*(this.research.includes("publishing")?1.25:1));
  const fans=Math.round((350+this.rng()*500)*p.audience*(this.research.includes("marketing")?1.3:1));
  this.transact(income,p.name+" • v"+p.finished+".0 lansmanı");this.fans+=fans;this.reputation=clamp(this.reputation+(quality>75?4:2),0,100);p.income+=income;p.progress=0;p.bugs=4+this.rng()*5;
  this.addEvent("rocket",p.name+" yayında!","v"+p.finished+".0 · "+formatCurrency(income)+" gelir · +"+fans+" hayran · "+Math.round(quality)+" kalite","launch");
  this.employees.forEach(e=>e.morale=clamp(e.morale+4,0,100));this.say(this.employees[0],"Yayınladık! Bu başarı hepimizin. 🎉",true);this.save();
 }
 get decision(){return this.pendingDecision===null?null:CHOICES[this.pendingDecision];}
 makeChoice(index,expectedDecision=this.pendingDecision){
  if(!Number.isInteger(index)||index<0||expectedDecision!==this.pendingDecision)return false;
  const choice=this.decision?.options[index];if(!choice)return false;const e=choice.effect;if(e.budget<0&&!this.canSpend(-e.budget))return false;
  if(e.budget)this.transact(e.budget,choice.label);this.fans=Math.max(0,this.fans+(e.fans||0));this.reputation=clamp(this.reputation+(e.rep||0),0,100);this.creativity=clamp(this.creativity+(e.creativity||0),0,100);
  this.employees.forEach(p=>p.morale=clamp(p.morale+(e.morale||0),0,100));if(e.boost)this.projects.forEach(p=>p.progress=clamp(p.progress+e.boost/this.projects.length,0,99));
  this.pendingDecision=null;this.addEvent("check","Kararın uygulandı",choice.text,"decision");this.save();this.emit();return true;
 }
 interact(id,action){
  const p=this.findPerson(id),cost=action==="coffee"?200:0;if(!p||!['coffee','focus','motivate','talk'].includes(action)||!this.canSpend(cost))return false;
  if((p.cooldowns[action]??-1)>this.simElapsed)return false;
  p.cooldowns[action]=this.simElapsed+({coffee:15,focus:10,motivate:30,talk:8}[action]);
  if(cost)this.transact(-cost,p.name+" • kahve");
  if(action==="coffee"){p.energy=clamp(p.energy+23,0,100);p.morale=clamp(p.morale+6,0,100);this.chooseTask(p,"break");this.say(p,"Tam zamanında! Bu kahve bana çok iyi gelecek. ☕",true);}
  if(action==="motivate"){p.morale=clamp(p.morale+12,0,100);this.say(p,"Bana güvendiğini bilmek güzel. Birlikte başaracağız!",true);}
  if(action==="focus"){this.chooseTask(p,"focus");this.say(p,"Kulaklıklar takıldı. Bir süre odaklanıyorum.",true);}
  if(action==="talk"){this.say(p,this.pick(DIALOGUE.greet),true);p.morale=clamp(p.morale+2,0,100);}
  this.addEvent(action==="coffee"?"coffee":"spark",p.name+" ile etkileşim",{coffee:"Kahve ısmarladın. Enerji ve moral yükseldi.",motivate:"Ekibini cesaretlendirdin.",focus:"Odak görevi başladı.",talk:"Kısa bir sohbet ettiniz."}[action],"action");this.save();this.emit();return true;
 }
 invest(id){const p=this.projectById(id);if(!p||!this.canSpend(1800))return false;this.transact(-1800,p.name+" • üretim yatırımı");p.progress=clamp(p.progress+7,0,99);this.stats.investments++;this.addEvent("bolt","Üretime destek",p.name+" ilerlemesi +%7.","project");this.save();this.emit();return true;}
 setPriority(id,priority){const p=this.projectById(id);if(!p||!['balanced','quality','speed'].includes(priority))return false;p.priority=priority;this.save();this.emit();return true;}
 assign(id,projectId){const p=this.findPerson(id);if(!p||!this.projectById(projectId))return false;p.projectId=projectId;this.save();this.emit();return true;}
 createProject(name,genre){
  name=text(name,32).trim();const g=GENRES.find(g=>g.id===genre);if(!g||name.length<3||this.projects.length>=6||!this.canSpend(12000))return false;
  const p={id:"custom-"+uid(),name,genre:g.label,subtitle:"Bağımsız stüdyo projesi",icon:g.icon,color:g.color,accent:g.accent,type:"game",audience:g.audience,progress:0,finished:0,quality:72,bugs:8,priority:"balanced",income:0};
  this.projects.push(p);this.transact(-12000,name+" • prototip bütçesi");this.addEvent("spark","Yeni bir dünya doğuyor",name+" üretim planına eklendi. Proje panelinden ekip atayabilirsin.","project");this.save();this.emit();return p;
 }
 upgradeCost(id){return this.rooms[id]>=4?0:Math.round(3500*Math.pow(this.rooms[id],1.6));}
 upgrade(id){if(!ROOMS.some(r=>r.id===id)||this.rooms[id]>=4)return false;const cost=this.upgradeCost(id);if(!this.canSpend(cost))return false;this.transact(-cost,ROOMS.find(r=>r.id===id).name+" • geliştirme");this.rooms[id]++;this.stats.upgrades++;this.addEvent("home","Ofis bir seviye daha iyi",ROOMS.find(r=>r.id===id).name+" artık seviye "+this.rooms[id]+". Üretim ve ortam gelişti.","upgrade");this.save();this.emit();return true;}
 canResearch(id){const r=RESEARCH.find(r=>r.id===id);return !!r&&!this.research.includes(id)&&r.requires.every(x=>this.research.includes(x))&&(!r.room||this.rooms[r.room]>=2)&&this.canSpend(r.cost);}
 doResearch(id){if(!this.canResearch(id))return false;const r=RESEARCH.find(r=>r.id===id);this.transact(-r.cost,r.name+" • araştırma");this.research.push(id);if(id==="qa")this.projects.forEach(p=>p.quality=clamp(p.quality+4,0,99));this.addEvent("flask",r.name+" tamamlandı",r.desc,"research");this.save();this.emit();return true;}
 meeting(){if(!this.canSpend(1200)||this.simElapsed<this.meetingAt)return false;this.meetingAt=this.simElapsed+90;this.transact(-1200,"Ekip buluşması");this.employees.forEach((p,i)=>{p.morale=clamp(p.morale+7,0,100);if(i<5)this.chooseTask(p,"meeting");});this.addEvent("users","Birlikte düşünmek iyi geldi","Ekip morali +7. Toplantı odasında yeni fikirler konuşuluyor.","action");this.chat("dogancan","Herkese teşekkürler! Ortak hedefimiz çok daha net şimdi.","toplantı");this.save();this.emit();return true;}
 contract(){if(this.contractDay===this.day)return false;this.contractDay=this.day;this.transact(15000,"Günlük küçük müşteri işi");this.employees.forEach(p=>p.energy=clamp(p.energy-12,0,100));this.addEvent("wallet","Müşteri işi tamamlandı","+₺15.000 gelir. Ekip enerjisi -12. Günde bir kez yapılabilir.","project");this.save();this.emit();return true;}
 postMessage(message){const msg=text(message,180).trim();if(!msg||this.simElapsed<(this.messageAt??-1))return false;this.messageAt=this.simElapsed+4;this.chat("you",msg);const p=this.pick(this.employees),low=msg.toLocaleLowerCase("tr"),answer=/kahve|mola/.test(low)?"Bir mola çok iyi olur! Kahve köşesinde buluşalım. ☕":/merhaba|selam|günaydın/.test(low)?"Selam! Stüdyoya hoş geldin. Bugün çok güzel fikirler var.":/oyun|proje|bug/.test(low)?"Not aldım! Bir sonraki sprintte bu fikre bakalım.":/teşekkür|harika|güzel/.test(low)?"Teşekkürler! Bunu ekipçe başardık. 💜":"Fikrini duymak güzel! Bunu ekip toplantısına taşıyalım.";this.chat(p.id,answer,"genel",this.chats.at(-1).id);this.say(p,answer);this.save();this.emit();return true;}
 milestoneValue(m){return m.key==="morale"?this.averageMorale:m.key==="research"?this.research.length:this.stats[m.key]??this[m.key]??0;}
 checkMilestones(){for(const m of MILESTONES)if(!this.achievements.includes(m.id)&&this.milestoneValue(m)>=m.target){this.achievements.push(m.id);this.addEvent("trophy",m.title,"Hedef tamamlandı. "+formatCurrency(m.reward)+" ödülünü Hedefler panelinden alabilirsin.","achievement");}}
 claim(id){const m=MILESTONES.find(m=>m.id===id);if(!m||!this.achievements.includes(id)||this.claimed.includes(id))return false;this.claimed.push(id);this.transact(m.reward,m.title+" • hedef ödülü");this.save();this.emit();return true;}
 snapshot(){return {schema:"draborn-office",version:2,day:this.day,minutes:this.minutes,budget:this.budget,fans:this.fans,reputation:this.reputation,creativity:this.creativity,projects:this.projects,employees:this.employees.map(({id,energy,morale,workCount,socialCount,friendships,projectId})=>({id,energy,morale,workCount,socialCount,friendships,projectId})),rooms:this.rooms,research:this.research,achievements:this.achievements,claimed:this.claimed,feed:this.feed,chats:this.chats,ledger:this.ledger,reports:this.reports,settings:this.settings,stats:this.stats,pendingDecision:this.pendingDecision,nextDecision:this.nextDecision,contractDay:this.contractDay,storedAt:Date.now()};}
 save(){try{this.storage?.setItem(KEY,JSON.stringify(this.snapshot()));return !!this.storage;}catch{return false;}}
 restore(){try{const raw=this.storage?.getItem(KEY)||this.storage?.getItem(LEGACY);return raw?this.importSnapshot(JSON.parse(raw),false):false;}catch{return false;}}
 importSnapshot(s,persist=true){
  if(!s||![1,2].includes(s.version)||(s.version===2&&s.schema!=="draborn-office")||!Number.isInteger(s.day)||s.day<1||!Array.isArray(s.employees)||!Array.isArray(s.projects))return false;
  const projectList=PROJECTS.map(p=>({...p,finished:0,quality:83,bugs:9,priority:"balanced",income:0}));
  for(const saved of s.projects.slice(0,6)){
   if(!saved||typeof saved.id!=="string")continue;let p=projectList.find(p=>p.id===saved.id);
   if(!p&&saved.id.startsWith("custom-")&&typeof saved.name==="string"&&saved.name.trim().length>=3){const g=GENRES.find(g=>g.label===saved.genre)||GENRES[0];p={...g,id:text(saved.id,60),name:text(saved.name,32),genre:g.label,subtitle:"Bağımsız stüdyo projesi",type:"game"};projectList.push(p);}
   if(p)Object.assign(p,{progress:num(saved.progress,0,0,99.99),finished:num(saved.finished,0,0,9999),quality:num(saved.quality,75,20,99),bugs:num(saved.bugs,8,0,40),priority:['balanced','speed','quality'].includes(saved.priority)?saved.priority:"balanced",income:num(saved.income)});
  }
  const state={day:num(s.day,1,1,9999),minutes:num(s.minutes,550,540,1079),budget:num(s.budget,185000,-1e8,1e9),fans:num(s.fans,0),reputation:num(s.reputation,38,0,100),creativity:num(s.creativity,64,0,100),projects:projectList};
  Object.assign(this,state);
  for(const p of this.employees){const v=s.employees.find(x=>x?.id===p.id);if(!v)continue;for(const k of ["energy","morale"])p[k]=num(v[k],80,0,100);p.workCount=num(v.workCount);p.socialCount=num(v.socialCount);if(this.projectById(v.projectId))p.projectId=v.projectId;for(const q of this.employees)if(q!==p)p.friendships[q.id]=num(v.friendships?.[q.id],55,0,100);}
  this.rooms=Object.fromEntries(ROOMS.map(r=>[r.id,Math.round(num(s.rooms?.[r.id],1,1,4))]));this.research=RESEARCH.filter(r=>Array.isArray(s.research)&&s.research.includes(r.id)).map(r=>r.id);this.achievements=MILESTONES.filter(m=>Array.isArray(s.achievements)&&s.achievements.includes(m.id)).map(m=>m.id);this.claimed=MILESTONES.filter(m=>Array.isArray(s.claimed)&&s.claimed.includes(m.id)).map(m=>m.id);
  const arrays={feed:80,chats:100,ledger:80,reports:14};
  for(const [key,max] of Object.entries(arrays))this[key]=Array.isArray(s[key])?s[key].slice(-max).filter(e=>e&&typeof e==="object").map(e=>key==="ledger"?{day:num(e.day,1,1,9999),time:text(e.time,5),amount:num(e.amount,0,-1e8,1e9),reason:text(e.reason)}:key==="reports"?{day:num(e.day,1,1,9999),income:num(e.income),expenses:num(e.expenses),morale:num(e.morale,80,0,100),releases:num(e.releases)}:key==="chats"?{id:text(e.id,80),personId:this.findPerson(e.personId)?e.personId:e.personId==="you"?"you":"dogancan",text:text(e.text,280),topic:text(e.topic,40),time:text(e.time,5),day:num(e.day,1,1,9999)}:{id:text(e.id,80),icon:text(e.icon,20),title:text(e.title,100),detail:text(e.detail,240),kind:text(e.kind,20),time:text(e.time,5),day:num(e.day,1,1,9999)}):[];
  const opts=s.settings||{};this.settings={theme:['auto','day','sunset','night'].includes(opts.theme)?opts.theme:"auto",labels:opts.labels!==false,effects:opts.effects!==false,sound:opts.sound===true,voice:opts.voice===true,fontScale:opts.fontScale===1.15?1.15:1};
  this.stats={releases:Math.round(num(s.stats?.releases,this.projects.reduce((n,p)=>n+p.finished,0))),upgrades:num(s.stats?.upgrades),investments:num(s.stats?.investments),earned:num(s.stats?.earned),spent:num(s.stats?.spent)};
  this.pendingDecision=Number.isInteger(s.pendingDecision)&&CHOICES[s.pendingDecision]?s.pendingDecision:s.version===1&&s.pendingDecision?CHOICES.findIndex(c=>c.title===s.pendingDecision.title):null;if(this.pendingDecision===-1)this.pendingDecision=null;
  this.nextDecision=num(s.nextDecision,this.minutes+100,this.minutes+1,1200);this.contractDay=num(s.contractDay);if(persist){this.save();this.emit();}return true;
 }
 reset(){try{this.storage?.removeItem(KEY);this.storage?.removeItem(LEGACY);return true;}catch{return false;}}
}
export function formatCurrency(n){return "₺"+Math.round(n).toLocaleString("tr-TR");}
export function getStorageKey(){return KEY;}
