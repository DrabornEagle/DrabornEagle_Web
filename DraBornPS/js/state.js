(() => {
 const defaults = () => ({version:4,owned:['last-mile','shift-error','apex','lumen','orbital'],installed:['last-mile','shift-error','apex','lumen','orbital'],downloads:{},wishlist:['neon-revenant','abyss-signal'],recent:[],scores:{},trophies:[],notifications:[],settings:{volume:65,music:true,mic:false,reducedMotion:false,contrast:false,textSize:'Normal',network:true,status:'Online',resolution:'1920 × 1080',hdr:false,brightness:70,vibration:true,controllerSpeaker:50,autoRest:'20 minutes',privacy:'Friends only',parental:'No restrictions',difficulty:'Normal',subtitles:true},widgets:[{id:'friends',size:2},{id:'battery',size:1},{id:'headset',size:1},{id:'storage',size:2},{id:'trophies',size:1},{id:'wishlist',size:2},{id:'store',size:4}],wallpaper:'default',profile:{name:'DrabornEagle',color:0,photo:'assets/profile/dkd-default-yacht.webp'},transactions:[]});
 let saved; try {saved=JSON.parse(localStorage.getItem('dkd_ps5_state'));} catch {}
 const base=defaults();DKD.state={...base,...saved,settings:{...base.settings,...saved?.settings},profile:{...base.profile,...saved?.profile}};
 const dkdAccessoriesPatch=!saved?.uiPatchAccessories20260919;
 if(dkdAccessoriesPatch){
  const batteryIndex=DKD.state.widgets.findIndex(widget=>widget.id==='battery');
  if(!DKD.state.widgets.some(widget=>widget.id==='headset'))DKD.state.widgets.splice(batteryIndex>=0?batteryIndex+1:DKD.state.widgets.length,0,{id:'headset',size:1});
  DKD.state.uiPatchAccessories20260919=true;
 }
 const dkdV04Upgrade=(DKD.state.version||0)<4;
 if(dkdV04Upgrade){
  const replacements={'apex-nightfall':'neon-revenant','lumen-echoes':'abyss-signal','orbital-frontier':'helix-protocol','apex-summit':'iron-horizon','orbital-infinity':'skyward-zero'};
  const remapList=list=>[...new Set((Array.isArray(list)?list:[]).map(id=>replacements[id]||id).filter(id=>DKD.game(id)))];
  DKD.state.owned=remapList(DKD.state.owned);DKD.state.installed=remapList(DKD.state.installed);DKD.state.wishlist=remapList(DKD.state.wishlist);DKD.state.recent=remapList(DKD.state.recent);
  DKD.state.downloads=Object.fromEntries(Object.entries(DKD.state.downloads||{}).map(([id,value])=>[replacements[id]||id,value]).filter(([id])=>DKD.game(id)));
  DKD.state.scores=Object.fromEntries(Object.entries(DKD.state.scores||{}).map(([id,value])=>[replacements[id]||id,value]).filter(([id])=>DKD.game(id)));
  DKD.state.transactions=(DKD.state.transactions||[]).map(item=>({...item,id:replacements[item.id]||item.id})).filter(item=>DKD.game(item.id));
  DKD.state.version=4;
 }
 ['last-mile','shift-error'].forEach(id=>{if(!DKD.state.owned.includes(id))DKD.state.owned.push(id);if(!DKD.state.installed.includes(id))DKD.state.installed.push(id);});
 const dkdPriority=['last-mile','shift-error'];
 DKD.state.installed=[...dkdPriority.filter(id=>DKD.state.installed.includes(id)),...DKD.state.installed.filter(id=>!dkdPriority.includes(id))];
 DKD.state.owned=[...dkdPriority.filter(id=>DKD.state.owned.includes(id)),...DKD.state.owned.filter(id=>!dkdPriority.includes(id))];
 DKD.persist = () => {try {localStorage.setItem('dkd_ps5_state',JSON.stringify(DKD.state));}catch {DKD.toast?.('Storage is full. This session is still available.');}document.dispatchEvent(new CustomEvent('dkd-state'));};
 if(dkdV04Upgrade||dkdAccessoriesPatch)DKD.persist();
 DKD.notify = (title,body='') => {DKD.state.notifications.unshift({id:Date.now(),title,body,date:new Date().toISOString()});DKD.state.notifications=DKD.state.notifications.slice(0,30);DKD.persist();DKD.toast?.(title,body);};
 DKD.download = id => {if(DKD.state.installed.includes(id)||DKD.state.downloads[id]) return;DKD.state.downloads[id]={progress:0,paused:false};DKD.persist();DKD.notify('Added to Downloads',DKD.game(id).title);};
 DKD.buy = id => {if(DKD.state.owned.includes(id))return false;DKD.state.owned.push(id);DKD.state.transactions.push({id,date:new Date().toISOString(),amount:DKD.game(id).price,type:'local'});DKD.persist();DKD.download(id);return true;};
 DKD.wishlist = id => {DKD.state.wishlist=DKD.state.wishlist.includes(id)?DKD.state.wishlist.filter(value=>value!==id):[...DKD.state.wishlist,id];DKD.persist();};
 DKD.award = (id,title) => {if(DKD.state.trophies.some(t=>t.id===id))return;DKD.state.trophies.push({id,title,date:new Date().toISOString()});DKD.notify('Trophy earned',title);};
 setInterval(()=>{let changed=false;for(const [id,download] of Object.entries(DKD.state.downloads)){if(download.paused||DKD.powerState==='off'||!DKD.state.settings.network)continue;download.progress=Math.min(100,download.progress+3+Math.random()*4);changed=true;if(download.progress>=100){if(!DKD.state.installed.includes(id))DKD.state.installed.push(id);delete DKD.state.downloads[id];DKD.notify('Ready to play',DKD.game(id).title);}}if(changed){DKD.persist();DKD.refreshDownloads?.();}},800);
})();
