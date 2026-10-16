import {WORLD,ROOMS,STAFF} from "./data.js";
import {OfficeWorld,drawWorld,formatCurrency} from "./engine.js";

const $=id=>document.getElementById(id);
const world=new OfficeWorld();
const stage=$("stageShell"),canvas=$("officeCanvas"),ctx=canvas.getContext("2d",{alpha:false});
const camera={scale:1,x:0,y:0};const touch=new Map();
let selected=null,rosterFilter="all",full=false,last=performance.now(),raf=0,lastRender=0,dragged=false,origin=null,toastTimeout=0,soundOn=false,audioCtx=null,lastMusic=0;
const fmt=n=>Math.round(n).toLocaleString("tr-TR");
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function toast(str){
 const el=$("mapToast");el.textContent=str;el.classList.add("shown");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove("shown"),2700);
}
function save(){if(world.save()){toast("✓ İlerleme bu cihaza kaydedildi.");$("saveBtn").classList.add("active");setTimeout(()=>$("saveBtn").classList.remove("active"),650);}else toast("Tarayıcı depolamasına erişilemiyor.");}
function selectStaff(id,follow=true){const p=world.findPerson(id);if(!p)return;selected={type:"staff",id};world.selectedId=id;renderInspector();renderRoster();if(follow)focusOn(p.x,p.y);beep(660,.055);}
function selectRoom(id){const room=ROOMS.find(r=>r.id===id);if(!room)return;selected={type:"room",id};world.selectedId=null;renderInspector();renderRoster();beep(520,.06);}
function selectProject(id){if(!world.projectById(id))return;selected={type:"project",id};world.selectedId=null;renderInspector();renderRoster();beep(620,.06);}
function focusOn(x,y){const s=Math.max(1.35,camera.scale);camera.scale=s;camera.x=WORLD.width/2-x*s;camera.y=WORLD.height/2-y*s;constrainCamera();updateZoom();}
function constrainCamera(){
 const minx=Math.min(0,WORLD.width-WORLD.width*camera.scale),miny=Math.min(0,WORLD.height-WORLD.height*camera.scale);
 camera.x=Math.max(minx,Math.min(0,camera.x));camera.y=Math.max(miny,Math.min(0,camera.y));
}
function updateZoom(){$("zoomLabel").textContent=Math.round(camera.scale*100)+"%";}
function zoomTo(value,cx=WORLD.width/2,cy=WORLD.height/2){
 const prev=camera.scale,next=Math.max(1,Math.min(3.4,value));
 const px=(cx-camera.x)/prev,py=(cy-camera.y)/prev;
 camera.scale=next;camera.x=cx-px*next;camera.y=cy-py*next;constrainCamera();updateZoom();
}
function canvasPoint(e){const r=canvas.getBoundingClientRect(),fit=Math.min(r.width/WORLD.width,r.height/WORLD.height),ox=(r.width-WORLD.width*fit)/2,oy=(r.height-WORLD.height*fit)/2;return{x:(e.clientX-r.left-ox)/fit,y:(e.clientY-r.top-oy)/fit};}
function worldPoint(e){const pos=canvasPoint(e);return{x:(pos.x-camera.x)/camera.scale,y:(pos.y-camera.y)/camera.scale};}
function handlePick(e){
 const pt=worldPoint(e);
 const actor=[...world.employees].reverse().find(p=>Math.hypot(p.x-pt.x,p.y-pt.y+4)<23);
 if(actor){selectStaff(actor.id,false);return;}
 const room=world.getRoomByPoint(pt.x,pt.y);
 if(room)selectRoom(room.id);
}
stage.addEventListener("pointerdown",e=>{
 stage.setPointerCapture?.(e.pointerId);touch.set(e.pointerId,canvasPoint(e));
 if(touch.size===1){origin={pointer:e.pointerId,start:canvasPoint(e),last:canvasPoint(e)};dragged=false;}
});
stage.addEventListener("pointermove",e=>{
 if(!touch.has(e.pointerId))return;
 const current=canvasPoint(e),prev=touch.get(e.pointerId);touch.set(e.pointerId,current);
 if(touch.size===2){
  const items=[...touch.entries()],a=items[0],b=items[1];
  const oldA=a[0]===e.pointerId?prev:a[1],oldB=b[0]===e.pointerId?prev:b[1];
  const before=Math.hypot(oldA.x-oldB.x,oldA.y-oldB.y)||1,after=Math.hypot(a[1].x-b[1].x,a[1].y-b[1].y);
  zoomTo(camera.scale*after/before,(a[1].x+b[1].x)/2,(a[1].y+b[1].y)/2);dragged=true;return;
 }
 if(origin&&origin.pointer===e.pointerId){
  if(Math.hypot(current.x-origin.start.x,current.y-origin.start.y)>8)dragged=true;
  if(dragged){stage.classList.add("dragging");camera.x+=current.x-origin.last.x;camera.y+=current.y-origin.last.y;constrainCamera();}
  origin.last=current;
 }
});
function releasePointer(e){
 if(!touch.has(e.pointerId))return;
 const click=!dragged&&touch.size===1&&origin?.pointer===e.pointerId;
 touch.delete(e.pointerId);if(touch.size===0){origin=null;stage.classList.remove("dragging");}
 if(click)handlePick(e);
}
stage.addEventListener("pointerup",releasePointer);
stage.addEventListener("pointercancel",e=>{touch.delete(e.pointerId);origin=null;dragged=false;stage.classList.remove("dragging");});
stage.addEventListener("wheel",e=>{e.preventDefault();const pos=canvasPoint(e);zoomTo(camera.scale*(e.deltaY<0?1.12:.89),pos.x,pos.y);},{passive:false});
stage.addEventListener("keydown",e=>{
 if(e.key==="+"||e.key==="=")zoomTo(camera.scale+.2);
 if(e.key==="-")zoomTo(camera.scale-.2);
 const delta=40;
 if(e.key==="ArrowLeft")camera.x+=delta;if(e.key==="ArrowRight")camera.x-=delta;
 if(e.key==="ArrowUp")camera.y+=delta;if(e.key==="ArrowDown")camera.y-=delta;
 constrainCamera();if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-","="].includes(e.key))e.preventDefault();
});
$("zoomIn").onclick=()=>zoomTo(camera.scale+.25);
$("zoomOut").onclick=()=>zoomTo(camera.scale-.25);
$("zoomFit").onclick=()=>{camera.scale=1;camera.x=0;camera.y=0;updateZoom();toast("Bütün stüdyo görüntüleniyor.");};
$("fullscreenBtn").onclick=toggleFull;
function toggleFull(){
 full=!full;const panel=document.querySelector(".studio-panel");
 panel.classList.toggle("is-fullscreen",full);document.body.style.overflow=full?"hidden":"";$("fullscreenBtn").textContent=full?"✕":"⛶";
 setTimeout(()=>{constrainCamera();},20);
}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&full)toggleFull();});
document.querySelectorAll(".speed-btn").forEach(button=>button.addEventListener("click",()=>{
 const speed=Number(button.dataset.speed);world.setSpeed(speed);
 document.querySelectorAll(".speed-btn").forEach(b=>b.classList.toggle("selected",b===button));
 toast(speed===0?"Simülasyon duraklatıldı.":"Simülasyon hızı "+speed+"×");
}));
$("saveBtn").onclick=save;
$("resetBtn").onclick=()=>{if(confirm("Tüm yerel stüdyo ilerlemen silinsin mi? Bu işlem geri alınamaz.")){world.reset();location.reload();}};
$("clearFeed").onclick=()=>{world.feed=[];renderFeed();toast("Olay geçmişi temizlendi.");};
document.querySelectorAll(".filter-btn").forEach(b=>b.onclick=()=>{rosterFilter=b.dataset.filter;document.querySelectorAll(".filter-btn").forEach(x=>x.classList.toggle("active",x===b));renderRoster();});
$("guideBtn").onclick=()=>openHelp();
$("modalClose").onclick=()=>$("modal").close();
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))$("modal").close();});
function openHelp(){
 $("modalContent").innerHTML='<p class="panel-kicker">DRABORN OFFICE / OYUN REHBERİ</p><h2>🦅 Stüdyona hoş geldin!</h2><p>Bu yaşayan ofiste her ekip üyesi programına, enerjisine, yeteneklerine ve sosyal ilişkilerine göre hareket eder. Oyun internet API hizmeti kullanmadan cihazında simüle edilir.</p><ul><li><b>Karaktere dokun:</b> Kişiliğini, istatistiklerini ve görevlerini incele. Kahve ısmarla, motive et veya odak görevine gönder.</li><li><b>Odaya dokun:</b> Departmanları, çalışanları ve odanın işlevini gör.</li><li><b>Projelere yatırım yap:</b> Bütçenle üretimi hızlandır. Yeterince ilerleyen projeler sürüm yayınlar ve hayran kazandırır.</li><li><b>Karar kartları:</b> Rastgele gelen yönetim kararlarının ekonomik ve sosyal sonuçları olur.</li><li><b>1× / 2× / 4×:</b> Zamanı hızlandır. Duraklat tuşuyla durdur.</li><li><b>Kaydet:</b> Otomatik kayıt da açıktır. İlerleme bu tarayıcının yerel depolamasında tutulur; cihazlar arasında paylaşılmaz.</li></ul><p><b>Not:</b> Bu gerçek bir çok oyunculu sunucu değildir. Konuşmalar, hikâyeler ve karakter davranışları lisanssız harici servislerle değil, yazılı simülasyon kurallarıyla üretilir. API anahtarı, hesap ve abonelik gerekmez.</p>';
 $("modal").showModal();
}
function renderMetrics(){
 $("topDay").textContent="GÜN "+String(world.day).padStart(2,"0");
 $("topClock").textContent=world.clock;$("canvasTime").textContent=world.clock;
 $("periodText").textContent=world.daypart;
 $("daySubtitle").textContent=world.minutes<12*60?"Günün ilk fikirleri şekilleniyor":world.minutes<16*60?"Üretim tüm hızıyla sürüyor":"Ekip günü tamamlamaya hazırlanıyor";
 $("weatherIcon").textContent=world.minutes<16*60?"☀️":"🌇";
 $("budgetStat").textContent=formatCurrency(world.budget);
 $("fansStat").textContent=fmt(world.fans);
 $("moraleStat").textContent="%"+world.averageMorale;
 $("moraleFill").style.width=world.averageMorale+"%";
 $("repStat").textContent=world.reputation+"/100";
 $("repHint").textContent=world.reputation>=70?"Tanınan stüdyo":world.reputation>=45?"Gelişen stüdyo":"Yükselen stüdyo";
 $("activeCount").textContent=world.activeCount+"/"+world.employeeCount+" aktif";
}
const personEmoji=p=>p.icon||"👤";
function renderRoster(){
 const users=world.employees.filter(p=>rosterFilter==="all"||(rosterFilter==="busy"&&!["break","idle"].includes(p.task))||(rosterFilter==="free"&&["break","idle"].includes(p.task)));
 $("teamRoster").innerHTML=users.map(p=>'<button class="staff-chip '+(selected?.id===p.id?"active":"")+'" data-id="'+escapeHtml(p.id)+'" type="button"><span class="avatar-mini" style="border-left:2px solid '+escapeHtml(p.color)+'">'+personEmoji(p)+'</span><span class="chip-copy"><span class="chip-name">'+escapeHtml(p.name)+'</span><span class="chip-role">'+escapeHtml(p.role)+'</span></span><i class="chip-dot '+(p.task==="break"?"break":"")+'"></i></button>').join("")||'<div class="inspector-desc">Bu filtre için ekip üyesi bulunamadı.</div>';
}
$("teamRoster").addEventListener("click",e=>{const item=e.target.closest("[data-id]");if(item)selectStaff(item.dataset.id);});
function renderProjects(){
 $("projectList").innerHTML=world.projects.map(p=>{
  return '<article class="project-row" data-project-view="'+escapeHtml(p.id)+'"><div class="project-art" style="background:linear-gradient(135deg,'+p.color+',#182038)">'+p.icon+'</div><div class="project-main"><div class="project-head"><strong>'+escapeHtml(p.name)+'</strong><b>%'+Math.floor(p.progress)+'</b></div><div class="project-meta">'+escapeHtml(p.subtitle)+' · v'+(p.finished+1)+'.0</div><div class="progress-track"><i style="width:'+p.progress+'%;background:linear-gradient(90deg,'+p.color+','+p.accent+')"></i></div><div class="project-foot"><span>'+escapeHtml(p.genre)+'</span><button data-project="'+escapeHtml(p.id)+'" title="₺1.800 karşılığında +%7 ilerleme">+₺1.800 YATIRIM</button></div></div></article>';
 }).join("");
}
$("projectList").addEventListener("click",e=>{
 const btn=e.target.closest("[data-project]");if(btn){const p=world.projectById(btn.dataset.project);if(!world.invest(btn.dataset.project)){toast("Yatırım için yeterli bütçe yok.");beep(230,.1);}else{toast(p.name+" ilerliyor!");beep(880,.09);renderAll();}return;}
 const row=e.target.closest("[data-project-view]");if(row)selectProject(row.dataset.projectView);
});
function renderInspector(){
 const container=$("inspector");
 if(!selected)return;
 if(selected.type==="staff"){
  const p=world.findPerson(selected.id);if(!p)return;
  $("inspectorHeading").textContent="Ekip Üyesi";
  const highest=Object.entries(p.friendships).sort((a,b)=>b[1]-a[1])[0],friend=highest&&world.findPerson(highest[0]);
  container.innerHTML='<div class="inspector-head"><div class="portrait" style="border-color:'+p.color+'">'+personEmoji(p)+'</div><div><strong>'+escapeHtml(p.name)+'</strong><span>'+escapeHtml(p.role)+'</span></div></div><div class="inspector-tags"><span class="tag pink">✦ '+escapeHtml(p.trait)+'</span><span class="tag green">'+escapeHtml(p.team)+'</span><span class="tag">'+escapeHtml(p.status)+'</span></div><p class="inspector-desc">'+escapeHtml(p.bio)+'</p><div class="inspector-stat"><span>ENERJİ</span><b>'+Math.round(p.energy)+'%</b></div><div class="tiny-bar"><i style="width:'+p.energy+'%"></i></div><div class="inspector-stat"><span>MORAL</span><b>'+Math.round(p.morale)+'%</b></div><div class="tiny-bar"><i style="width:'+p.morale+'%;background:linear-gradient(90deg,#32bba4,#92e8bc)"></i></div><div class="inspector-stat"><span>UZMANLIK</span><b>'+p.skill+'/100</b></div><p class="inspector-desc">🤝 En güçlü bağ: '+escapeHtml(friend?.name||"Henüz yok")+' · '+(highest?.[1]||0)+'/100<br>⌘ '+Math.round(p.workCount)+' üretim birimi · '+p.socialCount+' sosyal etkileşim</p><div class="inspector-actions"><button class="action-btn primary" data-actor="'+p.id+'" data-action="focus">⚡ ODAK GÖREVİ</button><button class="action-btn" data-actor="'+p.id+'" data-action="coffee">☕ KAHVE ₺200</button><button class="action-btn" data-actor="'+p.id+'" data-action="motivate">♡ MOTİVE ET</button><button class="action-btn" data-actor="'+p.id+'" data-action="talk">💬 SOHBET ET</button></div>';
 }
 if(selected.type==="room"){
  const r=ROOMS.find(v=>v.id===selected.id);if(!r)return;
  $("inspectorHeading").textContent="Departman Detayı";
  const coworkers=world.employees.filter(p=>p.room===r.id);
  container.innerHTML='<div class="inspector-head"><div class="portrait">'+escapeHtml(r.icon)+'</div><div><strong>'+escapeHtml(r.name)+'</strong><span>'+escapeHtml(r.sub)+'</span></div></div><p class="inspector-desc">'+escapeHtml(r.desc)+'</p><div class="inspector-tags"><span class="tag green">'+coworkers.length+' KİŞİ</span><span class="tag">AKTİF DEPARTMAN</span></div><p class="inspector-desc">Şu anda burada: '+(coworkers.length?coworkers.map(p=>escapeHtml(p.name)).join(", "):"Henüz kimse yok")+'</p><div class="inspector-actions"><button class="action-btn primary" data-room-focus="'+r.id+'">◎ ODAYI GÖSTER</button><button class="action-btn" data-room-chat="'+r.id+'">✦ ODADAKİ EKİP</button></div>';
 }
 if(selected.type==="project"){
  const p=world.projectById(selected.id);if(!p)return;
  $("inspectorHeading").textContent="Proje Kontrolü";
  container.innerHTML='<div class="inspector-head"><div class="portrait">'+p.icon+'</div><div><strong>'+escapeHtml(p.name)+'</strong><span>'+escapeHtml(p.subtitle)+'</span></div></div><div class="inspector-tags"><span class="tag pink">'+escapeHtml(p.genre)+'</span><span class="tag green">'+p.finished+' SÜRÜM</span></div><div class="inspector-stat"><span>ÜRETİM İLERLEMESİ</span><b>%'+p.progress.toFixed(1)+'</b></div><div class="tiny-bar"><i style="width:'+p.progress+'%"></i></div><div class="inspector-stat"><span>KALİTE PUANI</span><b>'+p.quality+'/100</b></div><p class="inspector-desc">Üretim otomatik ilerler. Ekip çalıştıkça proje gelişir; %100 olduğunda yeni sürüm yayınlanır ve oyun içi gelir ile hayran kazanılır.</p><div class="inspector-actions"><button class="action-btn primary" data-project="'+p.id+'">✦ YATIRIM YAP (₺1.800)</button><button class="action-btn" data-actor-tour="true">◎ EKİBİ GÖR</button></div>';
 }
}
$("inspector").addEventListener("click",e=>{
 const actor=e.target.closest("[data-actor]");if(actor){
  const ok=world.interact(actor.dataset.actor,actor.dataset.action);
  toast(ok?"Karakter ile etkileşim gerçekleşti.":"Yeterli bütçe yok.");if(ok)beep(750,.09);renderAll();return;
 }
 const room=e.target.closest("[data-room-focus]");if(room){const r=ROOMS.find(x=>x.id===room.dataset.roomFocus);if(r)focusOn((r.x+r.w/2)*32,(r.y+r.h/2)*32);return;}
 const team=e.target.closest("[data-room-chat]");if(team){const p=world.employees.find(p=>p.room===team.dataset.roomChat);if(p)selectStaff(p.id);else toast("Bu odada şu an kimse yok.");return;}
 const project=e.target.closest("[data-project]");if(project){const p=world.projectById(project.dataset.project);if(world.invest(p.id)){toast("Projeye yatırım yapıldı!");beep(880,.09);}else toast("Bütçe yetersiz.");renderAll();return;}
 if(e.target.closest("[data-actor-tour]"))selectStaff(world.employees[0].id);
});
function renderFeed(){
 $("eventFeed").innerHTML=world.feed.slice(0,15).map(event=>'<article class="feed-item"><span class="feed-icon">'+escapeHtml(event.icon)+'</span><div class="feed-copy"><strong>'+escapeHtml(event.title)+'</strong><p>'+escapeHtml(event.detail)+'</p></div><time>G'+event.day+' '+event.time+'</time></article>').join("")||'<div class="inspector-empty"><p>Olaylar birazdan burada görünecek.</p></div>';
}
function renderDecision(){
 const decision=world.pendingDecision;
 $("decisionBar").hidden=!decision;if(!decision)return;
 $("decisionTitle").textContent=decision.title;$("decisionDesc").textContent=decision.desc;
 $("decisionOptions").innerHTML=decision.options.map((option,index)=>'<button type="button" data-choice="'+index+'">'+escapeHtml(option.label)+'</button>').join("");
}
$("decisionOptions").addEventListener("click",e=>{
 const b=e.target.closest("[data-choice]");if(b&&world.makeChoice(Number(b.dataset.choice))){beep(840,.12);toast("Kararın stüdyoyu etkiledi!");renderAll();}
});
function renderAll(){renderMetrics();renderRoster();renderProjects();renderInspector();renderFeed();renderDecision();}
world.onUpdate=()=>{if(performance.now()-lastRender>900){lastRender=performance.now();renderAll();}};
world.onEvent=event=>{if(event.kind==="launch"){beep(940,.14);toast("🚀 "+event.title);}renderFeed();renderDecision();};
function beep(freq=550,len=.07){
 if(!soundOn)return;
 try{
  if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended")audioCtx.resume();
  const osc=audioCtx.createOscillator(),g=audioCtx.createGain(),now=audioCtx.currentTime;
  osc.type="sine";osc.frequency.setValueAtTime(freq,now);osc.frequency.exponentialRampToValueAtTime(freq*.76,now+len);
  g.gain.setValueAtTime(.035,now);g.gain.exponentialRampToValueAtTime(.0001,now+len);
  osc.connect(g);g.connect(audioCtx.destination);osc.start(now);osc.stop(now+len);
 }catch{}
}
$("soundBtn").onclick=()=>{
 soundOn=!soundOn;$("soundBtn").classList.toggle("active",soundOn);$("soundBtn").setAttribute("aria-pressed",String(soundOn));
 if(soundOn){beep(650,.13);toast("Prosedürel stüdyo sesleri açıldı.");}else toast("Stüdyo sesleri kapatıldı.");
};
function ambient(time){
 if(!soundOn||document.hidden||time-lastMusic<18000)return;
 lastMusic=time;beep([440,520,590,660][Math.floor(Math.random()*4)],.15);
}
function frame(time){
 const delta=Math.min(.08,(time-last)/1000||0);last=time;
 world.tick(delta);drawWorld(ctx,world,camera,time);ambient(time);
 raf=requestAnimationFrame(frame);
}
renderAll();
raf=requestAnimationFrame(frame);
setInterval(()=>world.save(),20000);
window.addEventListener("pagehide",()=>world.save());
document.addEventListener("visibilitychange",()=>{last=performance.now();if(document.hidden)world.save();});

if("serviceWorker" in navigator && location.protocol==="https:"){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{}),{once:true});
}
