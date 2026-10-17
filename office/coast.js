// An original, entirely procedural coastal district. No image download or API.
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
function hotel(c,x,y,h,color,p){
 box(c,x,y,120,110,h,color,color==="#f1b6c8"?"#bb8ea9":"#859fb3","#71819f");
 box(c,x-5,y-5,130,120,7,"#eecad1","#c59bb5","#b69dbd",Z+h);
 box(c,x+7,y+8,106,93,5,"#a9dcda","#80aaa9","#8ca8b1",Z+h+7);
 for(let z=25;z<h-10;z+=26)for(let i=0;i<4;i++)poly(c,[P(x+10+i*26,y+111,Z+z),P(x+29+i*26,y+111,Z+z),P(x+29+i*26,y+111,Z+z+15),P(x+10+i*26,y+111,Z+z+15)],p===palettes.night?(i%2?"#f48cc3":"#7cdddb"):"#8bb8c4");
 for(let z=25;z<h-10;z+=26)for(let i=0;i<3;i++)poly(c,[P(x+121,y+10+i*29,Z+z),P(x+121,y+31+i*29,Z+z),P(x+121,y+31+i*29,Z+z+15),P(x+121,y+10+i*29,Z+z+15)],"#7395ae");
 for(let i=0;i<3;i++)box(c,x+25+i*26,y+109,20,9,6,"#d6c4d6","#9f94b6","#6f7c9f",Z+12);
 const q=P(x+60,y+112,Z+h-15);text(c,h>180?"OCEAN":"PALMS",q.x,q.y,10,"#fff0e2");
 line(c,P(x+1,y+111,Z+17),P(x+119,y+111,Z+17),"#ff83ca",2.5);
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
 staticScene(c,v,p){
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
  for(let i=0;i<8;i++){const x=-100+i*200,y=shoreY(x)-94;if(inView(v,x,y,Z,100))umbrella(c,x,y,i%2?"#fa8dbd":"#62d8ce");}
  for(const [x,y,h,col] of [[-690,10,160,"#f1b6c8"],[-690,240,205,"#c8c8e3"],[-690,520,120,"#add8d4"],[-690,740,170,"#f1b6c8"],[-420,200,113,"#add8d4"]])if(inView(v,x,y,Z,240))hotel(c,x,y,h,col,p);
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
  c.restore();
 }
 render(c,v,w,time){
  const theme=v.theme(w),p=palettes[theme],tf=v.transform;
  const key=[v.width,v.height,tf.s,Math.round(tf.x),Math.round(tf.y),theme].join(":");
  if(!this.cache||key!==this.key){this.key=key;this.cache||=this.createCanvas();const width=Math.ceil(v.width),height=Math.ceil(v.height);if(this.cache.width!==width)this.cache.width=width;if(this.cache.height!==height)this.cache.height=height;const layer=this.cache.getContext("2d");layer.setTransform(1,0,0,1,0,0);layer.clearRect(0,0,width,height);this.staticScene(layer,v,p);}
  c.drawImage(this.cache,0,0);
  c.save();c.translate(tf.x,tf.y);c.scale(tf.s,tf.s);
  const t=w.settings.effects?time:0;
  // Animated whitecaps share the world's projection and camera.
  for(let i=0;i<64;i++){const x=-1200+(i*173%3900),y=-700-(i*137%400),offset=Math.sin(t*.0006+i)*10;if(y<shoreY(x)-245&&y>shoreY(x)-650&&inView(v,x,y,Z,90)){line(c,P(x+offset,y,Z),P(x+offset+22+(i%4)*8,y-3,Z),i%4?"#d2f6ed37":"#ffe0e75a",1.2);}}
  const bx=((t*.018+150)%2600)-400;if(inView(v,bx,-800,Z,120))boat(c,bx,-800,"#ffd0de");
  if(inView(v,1450,-940,Z,130))boat(c,1450,-940,"#d7f6ee");
  const cx=((t*.042+950)%3000)-800;if(inView(v,cx,-153,Z,90))car(c,cx,-153,"#fb85bd");
  if(inView(v,1100-cx*.6,-94,Z,90))car(c,1100-cx*.6,-94,"#94e6db",true);
  c.restore();
 }
 foreground(c,v,w,time){
  const tf=v.transform,p=palettes[v.theme(w)],t=w.settings.effects?time:0;c.save();c.translate(tf.x,tf.y);c.scale(tf.s,tf.s);
  for(const [x,y,h] of [[-68,980,114],[220,985,110],[925,985,120],[1220,980,113]])if(inView(v,x,y,Z,145))palm(c,x,y,h,p,x*.012);
  const x=((t*.036+650)%3100)-700;if(inView(v,x,1130,Z,100))car(c,x,1130,"#bcabf5");
  c.restore();
 }
}
