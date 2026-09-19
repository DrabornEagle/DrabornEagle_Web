DKD.audio = {
 context:null,musicTimer:null,musicEl:null,musicTrack:null,musicLoadPromise:null,switching:false,
 tracks:[
  {name:'InnerLight',start:0,end:258.86},
  {name:'SeMeNota',start:258.90,end:435.04}
 ],
 musicUrl:'assets/audio/dkd-home-mix.webm',
 volume(){return Math.max(0,Math.min(1,Number(DKD.state.settings.volume||0)/100));},
 applyVolume(){if(this.musicEl)this.musicEl.volume=this.volume();},
 init(){
  if(!this.context){try{this.context=new(window.AudioContext||window.webkitAudioContext)();}catch{}}
  if(this.context?.state==='suspended')this.context.resume();
 },
 tone(freq=440,duration=.09,type='sine',gain=.045){
  if(!this.context||!DKD.state.settings.volume)return;
  const now=this.context.currentTime,osc=this.context.createOscillator(),amp=this.context.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,now);
  amp.gain.setValueAtTime(gain*DKD.state.settings.volume/100,now);
  amp.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(amp).connect(this.context.destination);osc.start(now);osc.stop(now+duration);
 },
 click(){this.tone(700,.055,'sine',.025);},
 collect(){this.tone(660,.12);setTimeout(()=>this.tone(990,.2),65);},
 hit(){this.tone(95,.22,'sawtooth',.07);if(DKD.state.settings.vibration){try{const actuator=navigator.getGamepads?.()?.[0]?.vibrationActuator;actuator?.playEffect('dual-rumble',{duration:150,strongMagnitude:.35,weakMagnitude:.55})?.catch(()=>{});}catch{}}},
 async preload(){
  if(this.musicEl)return this.musicEl;
  if(this.musicLoadPromise)return this.musicLoadPromise;
  this.musicLoadPromise=(async()=>{
   const audio=new Audio(this.musicUrl);
   audio.preload='auto';
   audio.volume=this.volume();
   audio.addEventListener('timeupdate',()=>{
    if(this.musicTrack&&!audio.paused&&audio.currentTime>=this.musicTrack.end-.12)this.playRandomTrack();
   });
   audio.addEventListener('ended',()=>this.playRandomTrack());
   audio.addEventListener('error',()=>{this.musicTrack=null;});
   this.musicEl=audio;
   try{audio.load();}catch{}
   return audio;
  })().catch(error=>{this.musicLoadPromise=null;console.warn('DraBornPS music:',error);return null;});
  return this.musicLoadPromise;
 },
 async playRandomTrack(){
  if(this.switching||!DKD.state.settings.music||DKD.route==='game'||DKD.powerState)return;
  this.switching=true;
  try{
   const audio=await this.preload();if(!audio)return;
   if(!DKD.state.settings.music||DKD.route==='game'||DKD.powerState){this.pauseMusic();return;}
   if(audio.readyState<1)await new Promise(resolve=>{
    const done=()=>resolve();audio.addEventListener('loadedmetadata',done,{once:true});setTimeout(done,1800);
   });
   if(!DKD.state.settings.music||DKD.route==='game'||DKD.powerState){this.pauseMusic();return;}
   let next=this.tracks[Math.floor(Math.random()*this.tracks.length)];
   if(this.musicTrack&&this.tracks.length>1&&next.name===this.musicTrack.name)next=this.tracks.find(track=>track.name!==next.name)||next;
   this.musicTrack=next;
   audio.volume=this.volume();
   try{audio.currentTime=next.start;}catch{}
   await audio.play().catch(()=>{});
  }finally{this.switching=false;}
 },
 async setMusic(on){
  clearInterval(this.musicTimer);this.musicTimer=null;
  if(!on||DKD.route==='game'||DKD.powerState){this.pauseMusic();return;}
  const audio=await this.preload();if(!audio)return;
  if(!on||DKD.route==='game'||DKD.powerState){this.pauseMusic();return;}
  audio.volume=this.volume();
  if(!this.musicTrack||audio.currentTime<this.musicTrack.start||audio.currentTime>=this.musicTrack.end-.12)return this.playRandomTrack();
  if(audio.paused)await audio.play().catch(()=>{});
 },
 pauseMusic(){if(this.musicEl&&!this.musicEl.paused)this.musicEl.pause();},
 bindUnlock(){
  const unlock=()=>{this.init();if(DKD.state.settings.music&&DKD.route!=='game')this.setMusic(true);};
  document.addEventListener('pointerdown',unlock,{passive:true});
  document.addEventListener('touchstart',unlock,{passive:true});
 }
};
DKD.audio.preload();
DKD.audio.bindUnlock();
