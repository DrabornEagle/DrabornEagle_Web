// Original procedural Miami district. Static architecture is cached; street life follows simulation time.
import {BUILDINGS,PROPERTIES} from "./city.js?v=0.4.0";
export const PROJECTION={x:.86,y:.43};
export const projectPoint=(x,y,z=0)=>({x:(x-y)*PROJECTION.x,y:(x+y)*PROJECTION.y-z});
const P=projectPoint,Z=-25;
const palettes={
 day:{sky:["#8053ab","#f4a9be","#82d8dc","#1698ad"],sea:"#229eb2",land:"#c1c9b2",sand:"#f4d7ad",road:"#4d526c",walk:"#e1bcb1",leaf:"#2c947e",deepLeaf:"#237866",building:"#edb8c7"},
 sunset:{sky:["#573178","#df739c","#f6b796","#3798b6"],sea:"#518fb5",land:"#b8adb0",sand:"#efc2a4",road:"#49445f",walk:"#d4a3ad",leaf:"#3d887d",deepLeaf:"#286d6a",building:"#e6a0b9"},
 night:{sky:["#181237","#443364","#876088","#164f77"],sea:"#16476f",land:"#586c7b",sand:"#b19aaa",road:"#292d4b",walk:"#947f9f",leaf:"#346d72",deepLeaf:"#254e60",building:"#a58bb3"}
};
function poly(c,points,fill,stroke,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function plane(c,x,y,w,d,z,color,stroke){poly(c,[P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)],color,stroke);}
function box(c,x,y,w,d,h,top,front,side,z=Z){
 poly(c,[P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)],front);
 poly(c,[P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)],side);
 plane(c,x,y,w,d,z+h,top);
}
function line(c,a,b,color,width=1){c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function ellipse(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
function text(c,s,x,y,size,color,weight=700){c.font=weight+" "+size+"px 'Trebuchet MS',sans-serif";c.fillStyle=color;c.textAlign="center";c.fillText(s,x,y);}
function inView(v,x,y,z=0,margin=180){const p=P(x,y,z),s=v.transform.s;const px=p.x*s+v.transform.x,py=p.y*s+v.transform.y;return px>-margin&&px<v.width+margin&&py>-margin&&py<v.height+margin;}
function palm(c,x,y,h,p,phase=0){
 const b=P(x,y,Z),top={x:b.x+Math.sin(phase)*7,y:b.y-h};
 ellipse(c,b.x+22,b.y+10,36,9,"#34537324");
 line(c,{x:b.x,y:b.y},top,"#867875",8);line(c,{x:b.x-1.5,y:b.y},top,"#d1a98e",3);
 for(let i=0;i<6;i++){const yy=b.y-h*i/7;line(c,{x:b.x-3,y:yy},{x:b.x+3,y:yy-2},"#6c666752",1.5);}
 for(let i=0;i<8;i++){const a=i*Math.PI/4+phase*.2,dx=Math.cos(a)*50,dy=Math.sin(a)*23;
  poly(c,[top,{x:top.x+dx*.45-5,y:top.y+dy*.5-11},{x:top.x+dx,y:top.y+dy+13},{x:top.x+dx*.45+4,y:top.y+dy*.5+2}],i%2?p.leaf:p.deepLeaf);
  line(c,top,{x:top.x+dx*.85,y:top.y+dy+5},"#93c8a14d",1);
 }
 ellipse(c,top.x-3,top.y+5,4,5,"#9e8b6f");ellipse(c,top.x+4,top.y+3,4,5,"#c7a080");
}
function umbrella(c,x,y,color){
 const p=P(x,y,Z+39);line(c,P(x,y,Z),p,"#bb9c9c",2);ellipse(c,p.x+8,p.y+40,32,11,"#826e8040");
 for(let i=0;i<8;i++){const a=i*Math.PI/4,b=(i+1)*Math.PI/4;poly(c,[{x:p.x,y:p.y-12},{x:p.x+Math.cos(a)*28,y:p.y+Math.sin(a)*12},{x:p.x+Math.cos(b)*28,y:p.y+Math.sin(b)*12}],i%2?"#ffe6ce":color);}
 line(c,{x:p.x,y:p.y-13},{x:p.x,y:p.y-17},"#c7b5ad",2);
 plane(c,x+14,y+12,36,17,Z+1,"#e9c6b6");plane(c,x+17,y+14,28,12,Z+1.5,color);
}
function car(c,x,y,color,reverse=false){
 const d=reverse?-1:1;box(c,x,y,51,23,9,color,"#e385ae","#704f76");box(c,x+12,y+2,25,19,10,"#a3e1e2","#567d9a","#315d7e",Z+9);
 plane(c,x+16,y+3,17,17,Z+20,color);
 for(const dx of [8,40]){const p=P(x+dx,y+24,Z+4);ellipse(c,p.x,p.y,4,5,"#2a2846");ellipse(c,p.x,p.y,2,3,"#acb2c9");}
 line(c,P(x+(d>0?50:1),y+2,Z+6),P(x+(d>0?50:1),y+20,Z+6),"#f9dbba",2.2);
}
function tower(c,b,p){
 const {x,y,w,d,h,accent}=b,night=p===palettes.night;
 // Raised stone podium, two glass volumes and a stepped illuminated crown.
 plane(c,x-22,y-22,w+64,d+68,Z+1,night?"#67768a":"#d7d2d0");
 poly(c,[P(x+w,y+d,Z),P(x+w+120,y+d+30,Z),P(x+105,y+d+115,Z),P(x,y+d,Z)],"#344c7130");
 box(c,x-9,y-9,w+18,d+18,26,"#e0c9cf",night?"#655e80":"#bdaab9","#8496ad");
 const front=c.createLinearGradient(P(x,y,Z+h).x,P(x,y,Z+h).y,P(x+w,y+d,Z).x,P(x+w,y+d,Z).y);
 front.addColorStop(0,night?"#364c7f":b.glass);front.addColorStop(.45,night?"#31416c":"#93cbd9");front.addColorStop(1,night?"#292d50":"#5c89aa");
 box(c,x,y,w,d,h,night?"#596a8d":"#c0e6df",front,night?"#273756":"#4e7895",Z+26);
 const floors=Math.floor((h-30)/17),cols=Math.max(4,Math.floor(w/20)),step=w/cols;
 for(let j=0;j<floors;j++){
  const z=Z+39+j*17;
  line(c,P(x,y+d+.5,z),P(x+w,y+d+.5,z),night?"#7295b541":"#c8edf07a",1.1);
  line(c,P(x+w+.5,y,z),P(x+w+.5,y+d,z),night?"#6a8ba749":"#9ecbd45a",1);
  for(let i=0;i<cols;i++){
   const lit=(j*13+i*7+b.h)%11<4,color=night?(lit?((i+j)%3?"#ffe6b2":accent):"#345171"):((i+j)%4?"#a5dbe259":"#dbf1ecaa");
   poly(c,[P(x+4+i*step,y+d+1,z+3),P(x+(i+1)*step-4,y+d+1,z+3),P(x+(i+1)*step-4,y+d+1,z+13),P(x+4+i*step,y+d+1,z+13)],color);
   if(i<cols-1){const yy=y+5+i*d/(cols-1);poly(c,[P(x+w+1,yy,z+3),P(x+w+1,yy+d/(cols-1)-7,z+3),P(x+w+1,yy+d/(cols-1)-7,z+13),P(x+w+1,yy,z+13)],night?(lit?"#c9d7c8":"#294967"):"#8ebdcb77");}
  }
 }
 for(let i=0;i<=cols;i++)line(c,P(x+i*step,y+d+1,Z+28),P(x+i*step,y+d+1,Z+h+25),"#d5f5ee5c",1.3);
 poly(c,[P(x+w*.12,y+d+2,Z+70),P(x+w*.34,y+d+2,Z+70),P(x+w*.86,y+d+2,Z+h+20),P(x+w*.6,y+d+2,Z+h+20)],"#e1f9f01c");
 box(c,x+9,y+9,w-18,d-18,12,"#cde7de","#90aebd","#607d9c",Z+h+26);
 box(c,x+25,y+25,w-50,d-50,21,"#e0c6d8","#8e98b6","#647993",Z+h+38);
 for(const xx of [x+2,x+w-2])line(c,P(xx,y+d+2,Z+30),P(xx,y+d+2,Z+h+26),accent,2.4);
 line(c,P(x,y+d+2,Z+h+26),P(x+w,y+d+2,Z+h+26),accent,3.4);
 line(c,P(x+w+2,y,Z+h+26),P(x+w+2,y+d,Z+h+26),accent,2.8);
 // Roof garden and rooftop antenna distinguish towers from the old short blocks.
 for(let i=0;i<3;i++)box(c,x+33+i*20,y+34,12,22,9,"#86b9a1","#537d7f","#456d76",Z+h+59);
 line(c,P(x+w*.7,y+d*.5,Z+h+59),P(x+w*.7,y+d*.5,Z+h+100),"#d4e5df",2);
 const antenna=P(x+w*.7,y+d*.5,Z+h+101);ellipse(c,antenna.x,antenna.y,2,2,accent);
 for(let i=0;i<3;i++){const xx=x+12+i*(w-20)/3;poly(c,[P(xx,y+d+3,Z+3),P(xx+24,y+d+3,Z+3),P(xx+24,y+d+3,Z+22),P(xx,y+d+3,Z+22)],"#345d7a");}
 const name=P(x+w*.5,y+d+3,Z+h+6);text(c,b.name,name.x,name.y,12,night?"#fff1ec":"#f5ffff");
 for(const [xx,yy] of [[x-12,y+d+32],[x+w+22,y+d+25]]){box(c,xx,yy,18,18,12,"#ddc6c3","#a49caa","#8a8ca2");const q=P(xx+9,yy+9,Z+28);ellipse(c,q.x,q.y,13,12,p.leaf);}
}
function sunbather(c,x,y,i,p){
 const colors=["#ff9cbf","#78dfd4","#d1b4f3","#f5b68f"],skin=["#edbd99","#b48269","#d79c7e"][i%3];
 plane(c,x,y,52,24,Z+1,colors[i%4]);plane(c,x+3,y+3,8,18,Z+2,"#fff1dd");
 const q=P(x+11,y+12,Z+5),hip=P(x+32,y+12,Z+5),feet=P(x+48,y+12,Z+4);
 line(c,q,hip,skin,7);line(c,hip,feet,skin,4);const a=P(x+27,y+12,Z+5);line(c,a,P(x+34,y+5,Z+4),skin,3);
 line(c,P(x+26,y+10,Z+6),P(x+32,y+10,Z+6),i%2?"#8361a2":"#3d9ba5",6);ellipse(c,q.x-3,q.y-1,4.5,4.5,skin);
 if(i%3===0){const hat=P(x+7,y+12,Z+10);ellipse(c,hat.x,hat.y,8,4,"#fbe0b4");}
 const drink=P(x+53,y+26,Z+5);ellipse(c,drink.x,drink.y,3,4,"#e79abc");line(c,drink,{x:drink.x+2,y:drink.y-7},"#fff3d6",1);
}
function pedestrian(c,x,y,i,t=0){
 const p=P(x,y,Z),skin=["#dbac8f","#ac7a65","#eac5a2"][i%3],shirt=["#f3a5cb","#6edbd0","#ddd1ed","#e9bc87"][i%4],step=Math.sin(t*.006+i)*2.5;
 ellipse(c,p.x+2,p.y+2,7,3,"#2d446f29");
 line(c,{x:p.x-2,y:p.y-6},{x:p.x-3+step,y:p.y+1},"#465779",3);line(c,{x:p.x+2,y:p.y-6},{x:p.x+3-step,y:p.y+1},"#465779",3);
 line(c,{x:p.x,y:p.y-17},{x:p.x,y:p.y-6},shirt,7);line(c,{x:p.x-5,y:p.y-15},{x:p.x-5-step*.5,y:p.y-6},skin,2.5);
 ellipse(c,p.x,p.y-21,4,4.5,skin);ellipse(c,p.x,p.y-24,4,2.3,i%2?"#795c68":"#4a465d");
}
function streetLamp(c,x,y,p){
 const b=P(x,y,Z),a=P(x,y,Z+62);line(c,b,a,"#687a94",3);line(c,a,{x:a.x+17,y:a.y},"#8fa0ac",2);
 ellipse(c,a.x+16,a.y+2,7,2,p===palettes.night?"#ffe5ad":"#e6d8cf");
 if(p===palettes.night){ellipse(c,a.x+16,a.y+4,20,12,"#ffe6ac0c");ellipse(c,b.x+15,b.y+4,39,14,"#ffe2b610");}
}
function salePlot(c,item,p,owned){
 const {x,y,w,d,accent}=item;
 plane(c,x-9,y-9,w+18,d+18,Z+1,p.walk);
 plane(c,x,y,w,d,Z+2,p===palettes.night?"#48696f":"#9fc3a6");
 for(let i=0;i<6;i++)line(c,P(x+14+i*(w-28)/6,y+12,Z+3),P(x+14+i*(w-28)/6,y+d-12,Z+3),"#c9e5b72b",1);
 for(const [a,b] of [[[x,y],[x+w,y]],[[x+w,y],[x+w,y+d]],[[x+w,y+d],[x,y+d]],[[x,y+d],[x,y]]]){
  line(c,P(...a,Z+4),P(...b,Z+4),accent,2);
  for(let i=0;i<=4;i++){const xx=a[0]+(b[0]-a[0])*i/4,yy=a[1]+(b[1]-a[1])*i/4;line(c,P(xx,yy,Z+2),P(xx,yy,Z+12),"#dfe5d4",2);}
 }
 const sign=P(x+w*.55,y+d*.55,Z+52);line(c,P(x+w*.55,y+d*.55,Z+2),sign,"#7c7a94",5);
 c.fillStyle=owned?"#376f6c":"#251b45";c.fillRect(sign.x-73,sign.y-32,146,45);c.fillStyle=accent;c.fillRect(sign.x-73,sign.y-32,4,45);
 text(c,"DraBornLand",sign.x+2,sign.y-14,16,"#fff1eb");text(c,owned?"PORTFÖYÜNDE":"SATILIK ARSA",sign.x+2,sign.y+3,11,accent);
}
function district(c,v,p,owned){
 // Connected city blocks replace the empty ground around the studio.
 plane(c,-1190,-30,920,1030,Z+.8,p.walk);
 plane(c,-1175,-15,890,1000,Z+1,p===palettes.night?"#556e76":"#a8bdae");
 plane(c,1570,-35,640,1160,Z+.9,p.walk);
 plane(c,1590,-15,600,1120,Z+1,p===palettes.night?"#586e80":"#b1c4b6");
 plane(c,-1240,410,900,75,Z+1,p.walk);
 plane(c,-1240,950,910,65,Z+1,p.walk);
 plane(c,1550,-50,95,2750,Z+1,p.road);
 plane(c,-245,1185,1800,95,Z+1,p.walk);
 plane(c,-300,1920,2500,125,Z+1,p.road);
 plane(c,440,1277,86,645,Z+1,p.walk);
 for(let i=0;i<22;i++){const x=-300+i*110;line(c,P(x,1983,Z+2),P(x+45,1983,Z+2),"#ffe4bd80",2);}
 for(let i=0;i<25;i++)line(c,P(1598,60+i*100,Z+2),P(1598,105+i*100,Z+2),"#ffe4bd70",2);
 // A landscaped public square: fountain, café, seating, parking and a cycle lane.
 plane(c,565,1288,520,290,Z+2,p.walk);
 plane(c,584,1308,185,225,Z+3,p===palettes.night?"#4e7974":"#8bbba5");
 box(c,801,1335,150,108,9,"#e4d7ce","#b9aebc","#8a9bb0");
 plane(c,815,1348,122,82,Z+10,p===palettes.night?"#398da7":"#6bc9d1");
 const fountain=P(878,1390,Z+32);line(c,P(878,1390,Z+11),fountain,"#b8f0ecb3",3);ellipse(c,fountain.x,fountain.y,12,4,"#d2ffff6b");
 box(c,1005,1300,74,94,53,"#b6d4ce","#d2a8bc","#7e9fae");
 plane(c,998,1293,88,108,Z+56,"#f8a7c4");
 const cafe=P(1042,1396,Z+35);text(c,"OCEAN CAFÉ",cafe.x,cafe.y,10,"#fff3df");
 for(let i=0;i<3;i++){const x=786+i*92;box(c,x,1515,60,14,13,"#ddc5be","#ba9fad","#8d899f");}
 for(const [x,y] of [[644,1370],[712,1460],[1010,1460]]){umbrella(c,x,y,"#f7ba9b");const q=P(x+10,y+6,Z+8);ellipse(c,q.x,q.y,16,7,"#d6c1bd");}
 plane(c,40,1220,1435,17,Z+2,p===palettes.night?"#326b75":"#73bbaa");
 for(let i=0;i<9;i++)line(c,P(100+i*150,1228,Z+3),P(153+i*150,1228,Z+3),"#e7f0d98c",1.5);
 plane(c,1150,1305,300,530,Z+1,p===palettes.night?"#536e79":"#9abca5");
 plane(c,1172,1328,256,55,Z+2,p.walk);
 plane(c,1265,1330,55,485,Z+2,p.walk);
 for(let i=0;i<5;i++){box(c,1175,1420+i*72,58,14,13,"#d9c2b5","#b5a0ac","#8d8e9e");palm(c,1370,1420+i*76,77,p,i*.9);}
 // A few parked cars occupy marked bays beside the marina, away from studio rooms.
 plane(c,1455,340,77,430,Z+2,p.road);
 for(let i=0;i<6;i++){line(c,P(1455,350+i*67,Z+3),P(1528,350+i*67,Z+3),"#d2d6d67a",1.5);if(i%3!==1)car(c,1468,363+i*67,["#d8d3ed","#f2b0c8","#7bc8d3"][i%3]);}
 for(const item of PROPERTIES.filter(q=>q.type==="land"))if(inView(v,item.x+item.w/2,item.y+item.d/2,Z,400))salePlot(c,item,p,owned.includes(item.id));
 for(const b of [...BUILDINGS].sort((a,b)=>a.x+a.y-b.x-b.y))if(inView(v,b.x+b.w/2,b.y+b.d/2,Z+b.h/2,Math.max(240,b.h*v.transform.s)))tower(c,b,p);
 for(const [x,y] of [[-1040,860],[-900,510],[-330,860],[1700,670],[2150,700],[590,1560],[1100,1555],[80,1900],[455,1890],[1160,1880]])if(inView(v,x,y,Z,130))palm(c,x,y,82,p,x*.01);
 for(let i=-3;i<12;i++)if(inView(v,i*215,-48,Z,100))streetLamp(c,i*215,-48,p);
 for(let i=-2;i<10;i++)if(inView(v,i*230,1260,Z,100))streetLamp(c,i*230,1260,p);
}
function boat(c,x,y,color="#ffd3e6"){
 const p=P(x,y,Z),wake=[P(x-50,y+3,Z),P(x+30,y-4,Z),P(x+30,y+30,Z),P(x-50,y+20,Z)];poly(c,wake,"#c4f3e71a");
 poly(c,[P(x-12,y+10,Z+2),P(x+50,y-1,Z+2),P(x+70,y+10,Z+2),P(x+42,y+25,Z+2),P(x-12,y+22,Z+2)],color,"#d2eff444");
 box(c,x+10,y+6,29,12,9,"#fff0df","#d2b1c5","#819fb9",Z+2);plane(c,x+17,y+8,15,8,Z+12,"#91cedc");
}
const shoreY=x=>-398+Math.sin(x*.0018)*32;
export class CoastalWorld{
 constructor(createCanvas){this.createCanvas=createCanvas;this.cache=null;this.key="";}
 backdrop(c,v,p){
  const W=v.width,H=v.height,g=c.createLinearGradient(0,0,W*.23,H);p.sky.forEach((col,i)=>g.addColorStop([0,.24,.46,1][i],col));c.fillStyle=g;c.fillRect(0,0,W,H);
  // A distant, softly colored skyline uses parallax rather than following the office.
  for(let i=0;i<23;i++){const x=(i/22)*W+v.pan.x*.02,w=12+(i%4)*8,h=20+(i*23%61),y=H*.275+Math.sin(i)*8;
   c.fillStyle=p===palettes.night?"#8b6d9c38":"#a56fa43a";c.fillRect(x,y-h,w,h);
   if(i%4===0){c.fillRect(x+w*.3,y-h-12,w*.4,12);line(c,{x:x+w*.5,y:y-h-12},{x:x+w*.5,y:y-h-23},"#c39ac944",1);}
  }
  for(let i=0;i<3;i++){const x=W*(.18+i*.2),y=H*(.1+(i%2)*.035);line(c,{x:x-5,y:y+1},{x,y:y-2},"#67467f70",1.1);line(c,{x,y:y-2},{x:x+5,y:y+1},"#67467f70",1.1);}
 }
 sun(c,v,p){
  const sx=v.width*.88+v.pan.x*.025,sy=v.height*.11+v.pan.y*.015,r=Math.min(v.width*.095,v.height*.115,76);
  ellipse(c,sx,sy,r,r,p===palettes.night?"#edcee3":"#ffd5ab");
  for(let i=1;i<7;i++){const dy=r*(i*.16+.02),half=Math.sqrt(Math.max(0,r*r-dy*dy));line(c,{x:sx-half,y:sy+dy},{x:sx+half,y:sy+dy},p.sky[1],Math.max(1,r*.035));}
 }
 staticScene(c,v,p,w){
  this.backdrop(c,v,p);
  const tf=v.transform;c.save();c.translate(tf.x,tf.y);c.scale(tf.s,tf.s);
  const xs=[-6000,-3000,-1400,-500,400,1300,2400,4000,7000],outer=xs.map(x=>P(x,shoreY(x)-245,Z)),inner=xs.map(x=>P(x,shoreY(x),Z));
  const farWater=xs.map(x=>P(x,shoreY(x)-650,Z)),a=P(900,-1100,Z),b=P(900,-640,Z),water=c.createLinearGradient(a.x,a.y,b.x,b.y);
  water.addColorStop(0,p.sky[1]+"88");water.addColorStop(.5,p.sea+"dd");water.addColorStop(1,p.sea);
  poly(c,[...farWater,...outer.slice().reverse()],water);
  c.restore();this.sun(c,v,p);c.save();c.translate(tf.x,tf.y);c.scale(tf.s,tf.s);
  poly(c,[...inner,P(7000,7000,Z),P(-6000,7000,Z)],p.land);
  poly(c,[...outer,...inner.slice().reverse()],p.sand);
  const waterline=xs.map(x=>P(x,shoreY(x)-258,Z));poly(c,[...waterline,...outer.slice().reverse()],"#d1f1e659");
  for(let i=0;i<48;i++){const x=-1700+i*105,y=shoreY(x)-215+(i%3)*40;if(inView(v,x,y,Z,70))line(c,P(x,y,Z+.2),P(x+30+(i%4)*8,y+4,Z+.2),"#fff0cb42",1);}
  // Coastal boardwalk and boulevard, both connected to the studio district.
  plane(c,-5000,-290,11000,85,Z+.2,p.walk);
  for(let i=-45;i<65;i++)line(c,P(i*85,-289,Z+1),P(i*85,-206,Z+1),"#fff0d01f",1);
  plane(c,-5000,-200,11000,143,Z+.3,p.road);
  line(c,P(-5000,-205,Z+1),P(6000,-205,Z+1),"#fbe1c0",3);line(c,P(-5000,-54,Z+1),P(6000,-54,Z+1),"#f3c5d3",3);
  plane(c,-225,-60,145,6000,Z+.4,p.road);
  plane(c,-80,-48,1370,1100,Z+.5,p.walk);
  // A garden apron anchors the office foundation to the district.
  plane(c,-62,-33,1328,1018,Z+.8,p===palettes.night?"#4c6e79":"#a7c7ac");
  plane(c,-22,-21,1247,857,Z+1,p.walk);
  plane(c,440,810,230,228,Z+2,p===palettes.night?"#9d7d9e":"#ebc5ba");
  plane(c,24,846,350,125,Z+1,p===palettes.night?"#51756f":"#90b8a0");
  plane(c,752,846,350,125,Z+1,p===palettes.night?"#547579":"#98c0ac");
  for(let i=0;i<4;i++){box(c,85+i*65,870,48,17,11,"#d6b2b2","#b18e9c","#887e99");box(c,785+i*65,870,48,17,11,"#d6b2b2","#b18e9c","#887e99");}
  // The sea-side pool, lifeguard hut and a small timber pier.
  box(c,1240,270,180,390,8,"#e2c0c7","#bf9eb6","#9aa9bd",Z-3);plane(c,1252,282,156,366,Z+6,p===palettes.night?"#357caa":"#59c7d2");
  for(let i=0;i<9;i++)line(c,P(1260,305+i*35,Z+7),P(1390,305+i*35,Z+7),"#d2f0ed36",1);
  for(let i=0;i<3;i++){plane(c,1450,300+i*95,58,24,Z+1,"#f4d4b9");plane(c,1456,304+i*95,42,16,Z+2,i%2?"#e88dbb":"#8bdfd8");}
  box(c,970,-490,43,35,28,"#ef9dbd","#ce79a6","#9d75a0");box(c,974,-485,35,27,16,"#b7eeea","#70b3c3","#6998b5",Z+28);plane(c,965,-495,53,45,Z+46,"#f5c1b0");
  for(const x of [975,1004])line(c,P(x,-482,Z-1),P(x,-482,Z+28),"#a88992",3);
  plane(c,1335,-1200,62,930,Z+3,"#b6a5a4");
  for(let i=0;i<36;i++)line(c,P(1335,-1190+i*25,Z+4),P(1397,-1190+i*25,Z+4),"#eeccba55",1);
  for(let i=0;i<5;i++){box(c,1329,-1150+i*190,7,8,16,"#c6b2aa","#8d8997","#746f88");box(c,1396,-1150+i*190,7,8,16,"#c6b2aa","#8d8997","#746f88");}
  for(let i=0;i<15;i++){const x=-700+i*205,y=shoreY(x)-94;if(inView(v,x,y,Z,100)){umbrella(c,x,y,i%2?"#fa8dbd":"#62d8ce");sunbather(c,x+44,y-7,i,p);if(i%2===0)sunbather(c,x+20,y-65,i+1,p);}}
  for(let i=0;i<9;i++){const x=80+i*172,y=shoreY(x)-178;if(inView(v,x,y,Z,80))sunbather(c,x,y,i+3,p);}

  for(let i=-3;i<9;i++){const x=i*210,y=-240;if(inView(v,x,y,Z,120))palm(c,x,y,95+(i%3)*9,p,i*.8);}
  for(const [x,y,h] of [[-45,170,110],[-40,730,106],[1209,100,113],[1206,715,120],[1485,255,104],[1485,650,117],[-280,610,112],[-280,890,99]])if(inView(v,x,y,Z,140))palm(c,x,y,h,p,x*.01);
  // Subtle luminous accents replace the old abstract grid.
  line(c,P(-80,-40,Z+2),P(1210,-40,Z+2),"#f9b5d9",2);line(c,P(1217,10,Z+2),P(1217,820,Z+2),"#86eee1",2);
  plane(c,-5000,1015,11000,170,Z+2,p.road);
  for(let i=-35;i<50;i++){line(c,P(i*100,-129,Z+1),P(i*100+43,-129,Z+1),"#ffe1b191",2);line(c,P(i*100,1100,Z+3),P(i*100+43,1100,Z+3),"#ffddbda3",2);}
  for(let i=0;i<5;i++)plane(c,430+i*23,1018,12,164,Z+3,"#e9d8cebb");
  // Parking / bicycles and a neon identity sign on the studio's approach.
  box(c,1110,915,70,10,35,"#c389bb","#9c6c9f","#6d6d96");
  const sign=P(1145,926,Z+58);text(c,"DRABORN",sign.x,sign.y,14,"#ffe7ed");text(c,"MIAMI SHORES",sign.x,sign.y+15,9,"#8affec");
  for(let i=0;i<3;i++){const b=P(28+i*27,956,Z);ellipse(c,b.x-8,b.y,6,6,"#6d5c86");ellipse(c,b.x+8,b.y,6,6,"#6d5c86");line(c,{x:b.x-8,y:b.y},{x:b.x,y:b.y-10},"#e4bad1",2);line(c,{x:b.x,y:b.y-10},{x:b.x+8,y:b.y},"#e4bad1",2);}
  district(c,v,p,w.ownedProperties||[]);
  c.restore();
 }
 render(c,v,w,time){
  const theme=v.theme(w),p=palettes[theme],tf=v.transform;
  const key=[v.width,v.height,tf.s,Math.round(tf.x),Math.round(tf.y),theme,(w.ownedProperties||[]).join(",")].join(":");
  if(!this.cache||key!==this.key){this.key=key;this.cache||=this.createCanvas();const width=Math.ceil(v.width),height=Math.ceil(v.height);if(this.cache.width!==width)this.cache.width=width;if(this.cache.height!==height)this.cache.height=height;const layer=this.cache.getContext("2d");layer.setTransform(1,0,0,1,0,0);layer.clearRect(0,0,width,height);this.staticScene(layer,v,p,w);}
  c.drawImage(this.cache,0,0);
  c.save();c.translate(tf.x,tf.y);c.scale(tf.s,tf.s);
  const t=w.settings.effects&&time?w.simElapsed*1000:0;
  // Animated whitecaps share the world's projection and camera.
  for(let i=0;i<64;i++){const x=-1200+(i*173%3900),y=-700-(i*137%400),offset=Math.sin(t*.0006+i)*10;if(y<shoreY(x)-245&&y>shoreY(x)-650&&inView(v,x,y,Z,90)){line(c,P(x+offset,y,Z),P(x+offset+22+(i%4)*8,y-3,Z),i%4?"#d2f6ed37":"#ffe0e75a",1.2);}}
  for(let i=0;i<5;i++){const bx=((t*(.012+i*.002)+i*720)%4000)-1100,by=-780-(i%3)*110;if(inView(v,bx,by,Z,130))boat(c,bx,by,["#ffd0de","#c9f4ec","#e0d1f5"][i%3]);}
  for(let i=0;i<4;i++)if(inView(v,1425,-1110+i*135,Z,130))boat(c,1425,-1110+i*135,i%2?"#d7f6ee":"#ead6f1");
  for(let i=0;i<8;i++){const reverse=i%2===1,x=reverse?2400-((t*.037+i*570)%3800):((t*.043+i*540)%3800)-1400,y=reverse?-94:-165;if(inView(v,x,y,Z,90))car(c,x,y,["#fb85bd","#94e6db","#d9d9ee","#dfb88d"][i%4],reverse);}
  for(let i=0;i<24;i++){const x=((t*.008+i*173)%3850)-900,y=-258+(i%3)*14;if(inView(v,x,y,Z,65))pedestrian(c,x,y,i,t);}
  // Swimmers stay close to the shoreline; their ripples move gently with the water.
  if(p!==palettes.night)for(let i=0;i<7;i++){const x=130+i*230,y=shoreY(x)-275,a=P(x,y,Z+3);if(inView(v,x,y,Z,60)){ellipse(c,a.x,a.y+2,9+Math.sin(t*.001+i),3,"#c6f1e877");ellipse(c,a.x,a.y-2,3,3,"#d8aa8b");line(c,{x:a.x-8,y:a.y},{x:a.x+8,y:a.y},"#d8aa8b",2);}}
  c.restore();
 }
 foreground(c,v,w,time){
  const tf=v.transform,p=palettes[v.theme(w)],t=w.settings.effects&&time?w.simElapsed*1000:0;c.save();c.translate(tf.x,tf.y);c.scale(tf.s,tf.s);
  for(const [x,y,h] of [[-68,980,114],[220,985,110],[925,985,120],[1220,980,113]])if(inView(v,x,y,Z,145))palm(c,x,y,h,p,x*.012);
  for(let i=0;i<7;i++){const reverse=i%2===1,x=reverse?2300-((t*.032+i*690)%4000):((t*.039+i*650)%4000)-1250,y=reverse?1055:1130;if(inView(v,x,y,Z,100))car(c,x,y,["#bcabf5","#f4a6c4","#92dcd0","#ddc3a5"][i%4],reverse);}
  for(let i=0;i<14;i++){const x=((t*.006+i*164)%2300)-120,y=1199+(i%3)*17;if(inView(v,x,y,Z,65))pedestrian(c,x,y,i+20,t);}
  for(let i=0;i<7;i++){const x=600+(i*117)%460,y=1320+(i%3)*77;if(inView(v,x,y,Z,65))pedestrian(c,x,y,i+40,t);}
  const carX=((t*.027+1400)%2900)-350;if(inView(v,carX,2000,Z,100))car(c,carX,2000,"#92cdd9");
  c.restore();
 }
 labels(c,v,w){
  this.hits=[];const occupied=[],max=v.width<650?3:7;
  const candidates=PROPERTIES.map(item=>({item,q:v.toScreen(item.type==="land"?item.x+item.w*.55:item.x,item.type==="land"?item.y+item.d*.55:item.y,Z+(item.type==="land"?70:item.z))})).filter(({q})=>q.x>38&&q.x<v.width-38&&q.y>85&&q.y<v.height-125).sort((a,b)=>Math.hypot(a.q.x-v.width/2,a.q.y-v.height/2)-Math.hypot(b.q.x-v.width/2,b.q.y-v.height/2));
  for(const {item,q} of candidates){if(this.hits.length>=max)break;const mobile=v.width<650,width=mobile?112:item.type==="land"?144:134,height=mobile?35:40,x=Math.max(8,Math.min(v.width-width-8,q.x-width/2)),y=q.y-height;
   const under=v.toWorld(x+width/2,y+height/2);if(under.x>=0&&under.x<=1152&&under.y>=0&&under.y<=768)continue;
   if(occupied.some(o=>x<o.x+o.w+8&&x+width+8>o.x&&y<o.y+o.h+8&&y+height+8>o.y))continue;
   const isOwned=(w.ownedProperties||[]).includes(item.id);c.beginPath();c.roundRect(x,y,width,height,8);c.fillStyle="#201738ed";c.fill();c.strokeStyle=isOwned?"#76d7c4":item.accent;c.lineWidth=1;c.stroke();
   text(c,isOwned?"PORTFÖYÜNDE":item.type==="land"?"SATILIK ARSA":item.type==="office"?"SATILIK OFİS":"SATILIK KONUT",x+width/2,y+14,mobile?9:10,item.accent);
   text(c,item.type==="land"?"DraBornLand":item.name.split(" ").slice(0,2).join(" "),x+width/2,y+(mobile?28:30),mobile?10:11,"#fff2f0",600);
   line(c,{x:q.x,y:y+height},{x:q.x,y:q.y+6},item.accent,1.2);ellipse(c,q.x,q.y+8,3,3,item.accent);
   const hit={type:"property",id:item.id,x,y,w:width,h:height+12};this.hits.push(hit);occupied.push(hit);
  }
 }
 pick(x,y){return this.hits?.find(p=>x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h)||null;}

}
