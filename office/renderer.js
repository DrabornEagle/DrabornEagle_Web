import {WORLD,ROOMS,DECOR,ROOM_LABELS} from "./data.js?v=0.3.0";
import {CoastalWorld,projectPoint as P,PROJECTION} from "./coast.js?v=0.3.0";
const IX=PROJECTION.x,IY=PROJECTION.y,T=32;
const shade=(h,n)=>{const v=h.replace("#","");return "#"+[0,2,4].map(i=>Math.max(0,Math.min(255,parseInt(v.slice(i,i+2),16)+n)).toString(16).padStart(2,"0")).join("");};
function poly(c,pts,fill,stroke){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
function plane(c,x,y,w,d,z,color,stroke){poly(c,[P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)],color,stroke);}
function box(c,x,y,w,d,h,color,z=0){
 poly(c,[P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)],shade(color,-25));
 poly(c,[P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)],shade(color,-40));
 plane(c,x,y,w,d,z+h,color,"#ffffff13");
}
function line(c,a,b,color,width=1){c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function rounded(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}}
function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
function label(c,value,x,y,size=12,color="#fff",weight=500){c.font=weight+" "+size+"px 'Trebuchet MS',sans-serif";c.fillStyle=color;c.textAlign="center";c.fillText(value,x,y);}
const floors={creative:["#94879f","#8c7f99"],art:["#bd98aa","#b28ba0"],studio:["#615c85","#59537e"],lounge:["#a1b9a2","#95ae99"],meeting:["#85adb2","#7a9fa9"],server:["#6993aa","#5e87a4"],lobby:["#dab4a2","#cda397"]};
function wall(c,x,y,w,d,h,color="#9ba6a6"){box(c,x,y,w,d,h,color);plane(c,x,y,w,d,h,"#d1d5cc");}
function windowPanel(c,x,y,w){
 const p=[P(x,y,27),P(x+w,y,27),P(x+w,y,112),P(x,y,112)];
 poly(c,p,"#375769","#b4c8c3");
 for(let i=0;i<4;i++){const xx=x+3+i*w/4,hh=20+(i%3)*13;poly(c,[P(xx,y-.2,29),P(xx+w/5,y-.2,29),P(xx+w/5,y-.2,29+hh),P(xx,y-.2,29+hh)],i%2?"#4a7180":"#456675");}
 line(c,P(x+w/2,y,27),P(x+w/2,y,112),"#baccc8",2);line(c,P(x,y,64),P(x+w,y,64),"#79999e",1.5);
}
function glass(c,x,y,w,d){
 const a=P(x,y,0),b=P(x+w,y+d,0),a1=P(x,y,44),b1=P(x+w,y+d,44);
 poly(c,[a,b,b1,a1],"#a8e6e71b","#91bfc144");line(c,a1,b1,"#bce6de88",2);
 line(c,a,a1,"#41585d",2);line(c,b,b1,"#41585d",2);
 line(c,P(x+w*.45,y+d*.45,12),P(x+w*.45,y+d*.45,40),"#d4f5e94d",1);
}
function plant(c,x,y,size=1){
 const pt=P(x+9,y+9);ellipse(c,pt.x+3,pt.y+2,15*size,6*size,"#0d202b40");
 box(c,x,y,17,17,17,"#d8c0a4");const p=P(x+8,y+8,20);
 line(c,{x:p.x,y:p.y+6},{x:p.x,y:p.y-28*size},"#51694b",3);
 for(let i=0;i<8;i++){const a=i*2.399,xx=p.x+Math.cos(a)*12*size,yy=p.y-10+Math.sin(a)*15*size;ellipse(c,xx,yy,6*size,3.5*size,["#4e9b71","#70b17d","#367657","#8bc393"][i%4]);line(c,p,{x:xx,y:yy},"#578b5e",1);}
}
function chair(c,x,y,color="#586475"){
 box(c,x,y,14,14,6,"#232c3b");box(c,x,y,14,14,5,color,7);box(c,x,y+11,14,4,15,color,10);
 const p=P(x+7,y+7);line(c,p,{x:p.x,y:p.y+8},"#1e2834",2);
}
function monitor(c,x,y,accent="#8ddccf",large=false){
 const w=large?29:22;
 box(c,x+6,y+2,8,6,2,"#89989b",30);
 box(c,x,y,w,4,18,"#232e3c",35);
 const a=P(x+1,y+4.2,37),b=P(x+w-1,y+4.2,37),cc=P(x+w-1,y+4.2,51),d=P(x+1,y+4.2,51);
 poly(c,[a,b,cc,d],"#193144");
 for(let j=0;j<4;j++)line(c,P(x+3,y+4.5,40+j*2.6),P(x+4+(j%2?7:13),y+4.5,40+j*2.6),j%2?"#6f8c9f":accent,1);
}
function desk(c,d,level=1){
 const x=d.x*T,y=d.y*T,w=54,depth=26;
 plane(c,x-4,y-3,w+12,depth+14,0,"#0b192429");
 for(const [dx,dy] of [[3,2],[46,2],[3,22],[46,22]])box(c,x+dx,y+dy,3,3,27,"#40474a");
 box(c,x-3,y-3,w,depth,4,level>=3?"#d9b88a":"#c1a78a",27);
 box(c,x+41,y+2,8,17,20,"#55565b",4);
 monitor(c,x+9,y+1,d.kind==="console"?"#f3bcde":"#93c7d7");
 if(level>=2)monitor(c,x+29,y+3,"#c0a7e1");
 plane(c,x+12,y+16,19,6,31,"#485363");for(let j=0;j<5;j++)plane(c,x+13+j*3,y+17,1,3,31.5,"#bac0bd");
 box(c,x+34,y+19,4,4,5,"#eee2ce",31);box(c,x+2,y+17,7,8,1,"#c9d8c0",31);
 chair(c,x+15,y+32,level>=2?"#7d7294":"#606879");
}
function furniture(c,d,level,t){
 const x=d.x*T,y=d.y*T,k=d.kind;
 if(k==="desk"||k==="console"){desk(c,d,level);return;}
 if(k==="plant"){plant(c,x,y,1);return;}
 if(k==="couch"){
  plane(c,x-8,y-6,78,42,0,"#a19b7520");box(c,x,y,68,27,13,"#527d73");box(c,x,y,68,6,21,"#729a89",10);box(c,x,y,7,27,11,"#6b9785",10);box(c,x+61,y,7,27,11,"#6b9785",10);
  for(let i=0;i<2;i++)box(c,x+8+i*27,y+7,26,18,4,"#81a794",13);
  box(c,x+12,y+6,10,9,8,"#ddb4a3",17);box(c,x+43,y+6,10,9,8,"#c2b9d0",17);
  box(c,x+18,y+39,40,21,14,"#3a4848");box(c,x+16,y+37,44,25,3,"#c5aa86",14);
  box(c,x+31,y+44,9,11,1,"#a1b3c1",18);box(c,x+44,y+44,4,4,5,"#e6d9c5",18);
 }
 if(k==="coffee"){
  box(c,x,y,54,23,28,"#a17f65");box(c,x-2,y-2,58,27,3,"#d5bf9b",28);
  box(c,x+3,y+2,19,16,23,"#3e5058",31);box(c,x+5,y+17,15,3,5,"#9daca9",35);box(c,x+8,y+14,6,5,6,"#ece7d2",33);
  box(c,x+9,y+4,7,7,9,"#9cb5b5",54);box(c,x+33,y+5,10,10,10,"#d6ded0",31);
  const p=P(x+12,y+12,62);if(t){for(let i=0;i<2;i++)ellipse(c,p.x+Math.sin(t*.001+i)*3,p.y-((t*.008+i*8)%16),1.5,3,"#d9efdd44");}
 }
 if(k==="meeting"){
  plane(c,x-8,y-15,108,72,0,"#3d586235");
  for(let i=0;i<3;i++){chair(c,x+7+i*27,y-15,"#688085");chair(c,x+7+i*27,y+44,"#688085");}
  box(c,x+12,y+9,7,29,27,"#536168");box(c,x+72,y+9,7,29,27,"#536168");
  box(c,x-3,y+3,98,40,5,"#c5aa85",27);box(c,x+35,y+17,20,13,1,"#e1ded0",32);box(c,x+38,y+18,14,8,1,"#84959f",33);
  box(c,x+10,y+11,4,4,5,"#e8dbba",32);box(c,x+76,y+26,4,4,5,"#cbb6d5",32);
 }
 if(k==="rack"){
  box(c,x,y,25,24,65,"#384858");const p=P(x+25,y+24,0);
  for(let i=0;i<6;i++){box(c,x+2,y+24,21,1,7,"#25313e",5+i*9);line(c,P(x+5,y+25,9+i*9),P(x+8,y+25,9+i*9),i%3?"#87d5b1":"#dba583",1.5);line(c,P(x+12,y+25,9+i*9),P(x+20,y+25,9+i*9),"#5e8295",1);}
  if(level>=2){const q=P(x+13,y+10,67);ellipse(c,q.x,q.y,4,2,"#9adfbb");}
 }
 if(k==="reception"){
  box(c,x,y,91,32,30,"#e0c3a7");box(c,x-2,y-2,95,36,4,"#d2bfab",30);box(c,x+3,y+31,85,2,17,"#9a8476",5);monitor(c,x+42,y+4,"#c6a7ec");plant(c,x+9,y+9,.5);
 }
 if(k==="screen"){
  box(c,x+29,y+8,9,8,17,"#56636c");box(c,x,y,76,5,43,"#273643",17);
  poly(c,[P(x+3,y+5.1,20),P(x+73,y+5.1,20),P(x+73,y+5.1,57),P(x+3,y+5.1,57)],"#514f7a");
  for(let i=0;i<6;i++)poly(c,[P(x+4+i*12,y+5.5,21),P(x+16+i*12,y+5.5,21),P(x+16+i*12,y+5.5,30+(i%3)*8),P(x+4+i*12,y+5.5,30+(i%3)*8)],i%2?"#8880a9":"#b68fb2");
  const p=P(x+38,y+6,47);label(c,"DRABORN",p.x,p.y,8,"#f8e8f0",700);
 }
 if(k==="arcade"){
  box(c,x,y,25,25,49,"#a48aba");box(c,x+2,y+21,21,8,7,"#705a8a",23);
  poly(c,[P(x+3,y+25.2,31),P(x+22,y+25.2,31),P(x+22,y+25.2,45),P(x+3,y+25.2,45)],"#23394a");
  for(let i=0;i<3;i++)box(c,x+5+i*6,y+25.5,3,1,3,i%2?"#c7b9ee":"#a6e2c1",35+i%2*4);
  box(c,x+5,y+27,3,3,4,"#edb499",30);
 }
}
function actor(c,p,t,selected=false){
 const a=P(p.x,p.y),walking=p.path?.length>0,step=walking?Math.sin(p.walkFrame*1.8)*3:0,bob=walking?Math.abs(step)*.3:0;
 c.save();c.translate(a.x,a.y-bob);
 ellipse(c,0,0,11,4,"#0a162c60");
 if(selected){c.beginPath();c.ellipse(0,0,16,7,0,0,Math.PI*2);c.strokeStyle="#c9b8fb";c.lineWidth=2;c.stroke();ellipse(c,0,-42,3,3,"#e0cdfd");}
 const px=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
 px(-5,-10,4,10+step,"#2b3546");px(1,-10,4,10-step,"#344154");px(-6,-2+step,5,3,"#d8d1c6");px(1,-2-step,5,3,"#b8b8b1");
 px(-7,-23,14,15,p.top);px(-7,-23,14,3,shade(p.top,20));px(-9,-20,3,10,p.skin);px(7,-19,3,10,p.skin);
 px(-6,-36,12,14,p.skin);px(-7,-37,14,6,p.hair);px(-7,-32,3,7,p.hair);px(5,-32,2,6,p.hair);
 if(p.facing==="up"){px(-6,-33,12,9,p.hair);}else{px(-3,-29,2,2,"#29313a");px(3,-29,2,2,"#29313a");px(0,-25,3,1,"#b87775");}
 if(p.id==="dogancan"){px(-6,-28,5,3,"#242a37");px(2,-28,5,3,"#242a37");px(-1,-28,3,1,"#242a37");}
 if(p.task==="sound"){px(-9,-33,2,9,"#b1a1d7");px(7,-33,2,9,"#b1a1d7");px(-6,-39,12,2,"#b1a1d7");}
 c.restore();return {x:a.x,y:a.y};
}
function wrap(c,text,max){const words=text.split(" "),lines=[];let s="";for(const word of words){const next=s?s+" "+word:word;if(c.measureText(next).width>max&&s){lines.push(s);s=word;}else s=next;}if(s)lines.push(s);return lines.slice(0,3);}
export class OfficeRenderer{
 constructor(canvas,{createCanvas}={}){
  this.canvas=canvas;this.c=canvas.getContext("2d");this.zoom=1;this.pan={x:0,y:0};this.width=1200;this.height=760;this.base=1;this.createCanvas=createCanvas||(()=>document.createElement("canvas"));this.bg=null;this.bgKey="";this.coast=new CoastalWorld(this.createCanvas);this.hits=[];this.bubbles=[];this.hover=null;this.follow=null;
 }
 resize(width,height,dpr=1){this.width=width;this.height=height;this.dpr=Math.min(2,dpr);this.canvas.width=Math.round(width*this.dpr);this.canvas.height=Math.round(height*this.dpr);this.base=Math.min(width/2050,height/1250);this.clampPan();}
 get transform(){const s=this.base*this.zoom;return {s,x:this.width/2-165*s+this.pan.x,y:this.height/2-363*s+this.pan.y+15};}
 toScreen(x,y,z=0){const p=P(x,y,z),v=this.transform;return {x:p.x*v.s+v.x,y:p.y*v.s+v.y};}
 toWorld(x,y){const v=this.transform,px=(x-v.x)/v.s,py=(y-v.y)/v.s;return{x:(px/IX+py/IY)/2,y:(py/IY-px/IX)/2};}
 zoomAt(value,x=this.width/2,y=this.height/2){const p=this.toWorld(x,y);this.zoom=Math.max(.7,Math.min(3.2,value));const next=this.toScreen(p.x,p.y);this.pan.x+=x-next.x;this.pan.y+=y-next.y;this.clampPan();}
 clampPan(){const limitX=this.width*.85*this.zoom,limitY=this.height*.65*this.zoom;this.pan.x=Math.max(-limitX,Math.min(limitX,this.pan.x));this.pan.y=Math.max(-limitY,Math.min(limitY,this.pan.y));}
 fit(){this.zoom=1;this.pan={x:0,y:0};this.follow=null;}
 focus(x,y){this.zoom=Math.min(3.2,Math.max(1.65,this.zoom,.62/this.base));this.pan={x:0,y:0};const p=this.toScreen(x,y);this.pan.x=this.width/2-p.x;this.pan.y=this.height/2+20-p.y;this.clampPan();}
 theme(w){return w.settings.theme==="auto"?(w.minutes<930?"day":w.minutes<1020?"sunset":"night"):w.settings.theme;}
 buildStatic(w){
  const b=this.createCanvas();b.width=1900;b.height=1100;const c=b.getContext("2d");c.translate(730,160);
  // The foundation meets the coastal plaza at street level.
  box(c,-12,-12,1176,792,23,"#566268",-23);
  const shadow=[P(15,15,-28),P(1190,15,-28),P(1190,800,-28),P(15,800,-28)];poly(c,shadow,"#060b1420");
  for(const r of ROOMS){
   for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
    const col=floors[r.id][(x+y)%2];plane(c,x*T,y*T,T,T,0,col,"#182d3620");
    if(["creative","art","lobby","lounge"].includes(r.id)){line(c,P(x*T,y*T+T*.5,.2),P(x*T+T,y*T+T*.5,.2),"#f5deb214",.6);line(c,P(x*T+((y%2)?10:20),y*T,.2),P(x*T+((y%2)?10:20),y*T+T*.5,.2),"#26333218",.6);}
   }
  }
  // Back walls, city-facing windows, acoustic panels and architectural fixtures.
  wall(c,0,-6,1152,7,116,"#ddbecf");wall(c,-6,0,7,768,89,"#b3cbd0");
  for(let x=48;x<1100;x+=128)windowPanel(c,x,-.1,98);
  for(let i=0;i<6;i++){const y=70+i*94;poly(c,[P(.3,y,28),P(.3,y+65,28),P(.3,y+65,69),P(.3,y,69)],i<3?"#697b77":"#445568");}
  // LED coves and discreet cabinet walls.
  line(c,P(1,0,108),P(1150,0,108),"#ff8ecb",3);line(c,P(0,1,81),P(0,766,81),"#8ef2e7",3);
  for(let x=40;x<520;x+=100){box(c,x,31,60,18,22,"#8e9b91");box(c,x+2,32,56,16,2,"#c5ccbc",22);plant(c,x+23,36,.58);}
  for(let x=640;x<1100;x+=115){box(c,x,31,65,18,22,"#a89c99");box(c,x+2,32,61,16,2,"#cfc5b8",22);}
  // Inset rugs give each shared space a distinct identity.
  plane(c,373,398,189,170,.5,"#526f69");plane(c,380,405,175,156,.6,"#617f6d");
  plane(c,637,399,190,162,.5,"#61747b");plane(c,643,405,178,150,.6,"#70848a");
  plane(c,48,416,264,148,.5,"#3c465c");for(let i=0;i<8;i++)line(c,P(50,420+i*17,1),P(306,420+i*17,1),"#6e718222",1);
  // Low cutaway walls and glass dividers leave all characters readable.
  for(let y=0;y<11;y++)if(![5,6,9].includes(y))wall(c,576,y*T,4,T,20,"#9daba4");
  for(let x=0;x<36;x++)if(![5,6,14,15,22,23,30,31].includes(x))wall(c,x*T,352,T,4,15,"#9eaaa3");
  for(const x of [352,608,864])for(const y of [384,416,544,576])glass(c,x,y,0,29);
  for(let x=0;x<36;x++)if(![5,6,14,15,22,23,30,31].includes(x))wall(c,x*T,608,T,4,12,"#b6b8a8");
  for(const x of [120,685,945])glass(c,x,352,64,0);
  // Lobby seating, display plinths, reception carpet and plants.
  plane(c,155,650,220,76,.5,"#7d748a");plane(c,162,657,206,62,.6,"#92849b");
  for(let i=0;i<4;i++){box(c,555+i*42,662,26,24,12,"#7d8884");box(c,553+i*42,660,30,28,4,"#c6ae93",12);}
  for(const [x,y] of [[29,340],[1088,60],[1088,667],[316,670],[865,580],[590,70]])plant(c,x,y,1.2);
  // Door trims, front edge lighting and entrance steps.
  wall(c,0,767,1152,5,7,"#c8c5b6");wall(c,1151,0,5,772,7,"#b4b9ab");
  line(c,P(1,772,-8),P(1152,772,-8),"#c4a8ee",2);
  box(c,455,772,210,42,10,"#8d9693",-20);box(c,470,814,180,25,7,"#758484",-25);
  // Glass doors in the front lobby.
  glass(c,490,765,58,0);glass(c,554,765,58,0);
  this.bg=b;
 }
 render(w,time=0){
  const c=this.c,dpr=this.dpr||1,W=this.width,H=this.height;
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
  const theme=this.theme(w);
  if(this.follow){const person=w.findPerson(this.follow);if(person){const p=this.toScreen(person.x,person.y);this.pan.x+=(W*.5-p.x)*.07;this.pan.y+=(H*.53-p.y)*.07;}}
  this.coast.render(c,this,w,time);
  const key=JSON.stringify(w.rooms);if(!this.bg||key!==this.bgKey){this.bgKey=key;this.buildStatic(w);}
  const v=this.transform;c.save();c.translate(v.x,v.y);c.scale(v.s,v.s);
  c.drawImage(this.bg,-730,-160);
  if(this.hover?.type==="room"){
   const r=ROOMS.find(r=>r.id===this.hover.id);if(r)plane(c,r.x*T,r.y*T,r.w*T,r.h*T,1,"#c8b7ed12","#c5b4f86b");
  }
  // Furniture and people use the same painter order to maintain occlusion.
  const items=[...DECOR.map(d=>({depth:(d.x+d.y)*T+30,type:"decor",d})),...w.employees.map(p=>({depth:p.x+p.y,type:"person",p}))].sort((a,b)=>a.depth-b.depth);
  this.hits=[];
  for(const item of items){if(item.type==="decor"){const r=w.getRoomByPoint(item.d.x*T+16,item.d.y*T+16);furniture(c,item.d,w.rooms[r?.id]||1,w.settings.effects?time:0);}else{const p=item.p;actor(c,p,time,p.id===w.selectedId);const a=this.toScreen(p.x,p.y);this.hits.push({id:p.id,x:a.x,y:a.y-19*v.s,r:Math.max(13,17*v.s)});}}
  if(theme==="night"||theme==="sunset"){plane(c,0,0,1152,768,1,theme==="night"?"#371d662b":"#fa8dca10");}
  // Room titles sit on the floor, with quiet chips that stay legible.
  if(w.settings.labels)for(const r of ROOMS){const p=P((r.x+r.w/2)*T,(r.y+.85)*T,2);const title=r.id==="creative"?"GELİŞTİRME":r.id==="art"?"SANAT & TASARIM":r.id==="studio"?"SES STÜDYOSU":r.id==="lounge"?"KAHVE KÖŞESİ":r.id==="meeting"?"TOPLANTI":r.id==="server"?"TEKNOLOJİ":"DRABORN  /  RECEPTION";label(c,title,p.x,p.y,10,"#e4e9dfc9",700);label(c,"LV."+w.rooms[r.id],p.x,p.y+12,7,"#e4e9df80",500);}
  c.restore();
  this.coast.foreground(c,this,w,time);
  // Labels and speech render in screen pixels so zooming never makes them unreadable.
  const show=w.settings.labels;
  for(const p of w.employees){const q=this.toScreen(p.x,p.y);if(show&&(v.s>.48||p.id===w.selectedId)){const f=p.id===w.selectedId;const width=12+p.name.length*6;rounded(c,q.x-width/2,q.y+7,width,19,5,f?"#ff9bce":"#251a47e8");label(c,p.name,q.x,q.y+20,11,f?"#301b47":"#fff0f7",f?700:500);}}
  this.bubbles=[];
  const talkers=w.employees.filter(p=>{const q=this.toScreen(p.x,p.y);return p.dialogue&&p.dialogueLeft>0&&q.x>-25&&q.x<W+25&&q.y>0&&q.y<H+40;}).sort((a,b)=>(a.id===w.selectedId?-1:0)-(b.id===w.selectedId?-1:0)).slice(0,W<650?1:2),occupied=[];
  for(const p of talkers){const q=this.toScreen(p.x,p.y,47),fs=12*(w.settings.fontScale||1);c.font="500 "+fs+"px 'Trebuchet MS',sans-serif";const lines=wrap(c,p.dialogue,220),bw=Math.min(240,Math.max(110,...lines.map(l=>c.measureText(l).width+28))),bh=18+lines.length*18;
   let x=Math.max(10,Math.min(W-bw-10,q.x-bw/2)),y=Math.max(60,q.y-bh-12);
   for(const o of occupied)if(x<o.x+o.w&&x+bw>o.x&&y<o.y+o.h&&y+bh>o.y)y=Math.max(10,o.y-bh-7);
   occupied.push({x,y,w:bw,h:bh});rounded(c,x,y,bw,bh,9,"#fff1ec",p.id===w.selectedId?"#ff85c3":"#ffd4e0");poly(c,[{x:q.x-4,y:y+bh-1},{x:q.x+4,y:y+bh-1},{x:q.x,y:y+bh+6}],"#fff1ec");
   lines.forEach((l,i)=>label(c,l,x+bw/2,y+18+i*18,fs,"#34404a",500));this.bubbles.push({x,y,w:bw,h:bh,id:p.id,text:p.dialogue});
  }
  if(!w.speed){rounded(c,W/2-72,20,144,30,15,"#172230ed","#8e7da9");label(c,"Ⅱ   SİMÜLASYON DURDU",W/2,40,10,"#d7c5f5",600);}
 }
 pick(x,y){const b=this.bubbles.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);if(b)return {type:"speech",...b};const p=[...this.hits].reverse().find(p=>Math.hypot(p.x-x,p.y-y)<p.r);if(p)return {type:"staff",id:p.id};const v=this.toWorld(x,y),room=ROOMS.find(r=>v.x>=r.x*T&&v.x<(r.x+r.w)*T&&v.y>=r.y*T&&v.y<(r.y+r.h)*T);return room?{type:"room",id:room.id}:null;}
}
export function drawAvatar(c,p,size=64){
 c.clearRect(0,0,size,size);c.save();c.translate(size/2,size*.82);c.scale(size/48,size/48);actor(c,{...p,x:0,y:0,path:[],facing:"down",task:"idle"},0,false);c.restore();
}
