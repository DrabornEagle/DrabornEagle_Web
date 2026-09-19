(() => {
 DKD.screen=document.getElementById('screen');DKD.route='home';DKD.modalTitle=null;DKD.powerState=null;DKD.lastInstalled=DKD.state.installed.join(',');let wallpaper='',wallpaperIndex=0,toastTimer,lastInput=Date.now(),playTime=0,reminderSent=false;
 const mobileMedia=window.matchMedia('(max-width: 900px)');
 DKD.isMobileUI=mobileMedia.matches&&!document.documentElement.classList.contains('capture-mode');
 DKD.syncUIMode=()=>{const mobile=mobileMedia.matches&&!document.documentElement.classList.contains('capture-mode');const changed=mobile!==DKD.isMobileUI;DKD.isMobileUI=mobile;document.body.classList.toggle('dkd-mobile-ui',mobile);document.body.classList.toggle('dkd-desktop-ui',!mobile);document.getElementById('console').classList.toggle('mobile-console',mobile);return changed;};
 DKD.syncUIMode();
 DKD.historyApplying=false;
 DKD.historySnapshot=(route=DKD.route,id=null)=>({dkdps:true,route,id:id||null,dkdTab:DKD.homeTab,dkdProject:DKD.projectSelection});
 DKD.pushHistory=(route,id=null)=>{
  if(DKD.historyApplying)return;
  try{
   const next=DKD.historySnapshot(route,id),current=history.state;
   if(current?.dkdps&&current.route===next.route&&current.id===next.id&&(route!=='home'||current.dkdTab===next.dkdTab))return;
   history.pushState(next,'',location.href);
  }catch{}
 };
 try{
  const base=DKD.historySnapshot('home',null);
  history.replaceState({...base,base:true},'',location.href);
  history.pushState({...base,guard:true},'',location.href);
 }catch{}
 DKD.clock=()=>document.querySelectorAll('.clock').forEach(element=>element.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(new Date()));
 DKD.setWallpaper=id=>{document.getElementById('console')?.classList.toggle('dkd-game-wallpaper',id!=='default');if(wallpaper===id)return;wallpaper=id;wallpaperIndex=1-wallpaperIndex;const next=document.getElementById(wallpaperIndex?'wallpaper-b':'wallpaper-a'),previous=document.getElementById(wallpaperIndex?'wallpaper-a':'wallpaper-b');next.style.backgroundImage=id==='default'?"url('assets/wallpapers/dkd-miami-v06.webp')":`url('${DKD.art(id)}')`;next.classList.add('shown');previous.classList.remove('shown');};
 DKD.toast=(title,body='')=>{clearTimeout(toastTimer);const target=document.getElementById('toast-root');target.innerHTML=`<div class="toast">${DKD.icon(title.includes('Trophy')?'trophy':title.includes('play')?'controller':'bell')}<div><strong>${DKD.escape(title)}</strong>${body?`<p>${DKD.escape(body)}</p>`:''}</div></div>`;toastTimer=setTimeout(()=>target.innerHTML='',3300);};
 DKD.modal=(title,body,wide=false)=>{DKD.modalTitle=title;DKD.previousFocus=document.activeElement;document.getElementById('modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${DKD.escape(title)}"><button class="icon-btn modal-close" data-action="close-modal" aria-label="Close dialog">${DKD.icon('close')}</button><h2>${title}</h2>${body}</section></div>`;setTimeout(()=>document.querySelector('.modal button:not(.modal-close),.modal input,.modal-close')?.focus(),25);};
 DKD.closeModal=()=>{document.getElementById('modal-root').innerHTML='';DKD.modalTitle=null;if(DKD.previousFocus?.isConnected)DKD.previousFocus.focus({preventScroll:true});};
 DKD.footer=()=>{const footer=document.getElementById('system-footer');if(DKD.isMobileUI){const active=route=>DKD.route===route?'active':'';footer.innerHTML=`<nav class="mobile-system-nav" aria-label="Mobile console navigation"><button class="mobile-nav-item ${active('home')}" data-action="home">${DKD.icon('home')}<span>Home</span></button><button class="mobile-nav-item ${active('store')}" data-action="store">${DKD.icon('store')}<span>Store</span></button><button class="mobile-nav-item mobile-ps" data-action="control-center" aria-label="Control Center">${DKD.icon('ps')}<span>PS</span></button><button class="mobile-nav-item ${active('library')}" data-action="library">${DKD.icon('library')}<span>Library</span></button><button class="mobile-nav-item ${active('settings')}" data-action="settings">${DKD.icon('settings')}<span>Settings</span></button></nav>`;return;}footer.innerHTML=`<button class="footer-ps" data-action="control-center" aria-label="Open Control Center">${DKD.icon('ps')} <span>Control Center</span><span class="key" style="margin-left:6px">F1</span></button><div class="footer-hints"><span><span class="key">↑↓←→</span> Navigate</span><span><span class="key round">×</span> Enter</span><span><span class="key round">○</span> Esc / Back</span><button class="icon-btn" data-action="fullscreen" aria-label="Full screen">${DKD.icon('resize')}</button></div>`;};
 DKD.navigate=(route,id,options={})=>{if(options.history!==false)DKD.pushHistory?.(route,id||null);if(DKD.route==='game')DKD.stopGame?.();else DKD.activeSession?.pause();DKD.closeCC(false);DKD.closeModal();DKD.route=route;DKD.screen.hidden=false;document.getElementById('game-host').hidden=true;document.getElementById('system-footer').hidden=false;if(id)DKD.productId=id;if(route!=='game')DKD.audio?.setMusic?.(DKD.state.settings.music);DKD.render();};
 DKD.render=()=>{if(DKD.route==='home')DKD.renderHome();if(DKD.route==='store')DKD.renderStore();if(DKD.route==='product')DKD.renderProduct(DKD.productId);if(DKD.route==='library')DKD.renderLibrary();if(DKD.route==='settings')DKD.renderSettings();DKD.footer();};
 DKD.showCCPanel=label=>{if(!DKD.ccOpen)DKD.toggleCC();DKD.ccPanel=label;DKD.renderCC();};
 DKD.showTrophies=()=>DKD.modal('Trophies',`<div class="row" style="font-size:29px;margin:30px 0">${DKD.icon('trophy')} ${DKD.state.trophies.length} trophies earned</div>${DKD.state.trophies.length?`<div class="modal-list">${DKD.state.trophies.map(trophy=>`<div class="list-button">${DKD.icon('trophy')}<span>${DKD.escape(trophy.title)}<small class="muted tiny" style="display:block;margin-top:6px">${new Date(trophy.date).toLocaleDateString()}</small></span></div>`).join('')}</div>`:'<p>Start your first game to earn “A new adventure”. Complete campaigns and reach milestones to grow your collection.</p>'}`);
 DKD.search=()=>{DKD.modal('Search',`<label class="search-field">${DKD.icon('search')}<input id="global-search" aria-label="Search all games" placeholder="Search games and apps"></label><div id="global-results" class="search-results">${DKD.catalog.slice(0,3).map(game=>DKD.gameCard(game)).join('')}</div>`,true);setTimeout(()=>document.getElementById('global-search')?.focus(),30);};
 DKD.controls=()=>DKD.modal('Your controls',`<div class="setting-row"><span>Navigate menus</span><span>Arrow keys / D-pad</span></div><div class="setting-row"><span>Select / Back</span><span>Enter / Esc · × / ○</span></div><div class="setting-row"><span>Control Center</span><span>F1 / PS button</span></div><div class="setting-row"><span>Home</span><span>Home key</span></div><div class="setting-row"><span>Pause game</span><span>Esc / P / Options</span></div><p>Racing: steer with A/D, accelerate W, brake S, boost Shift.<br>Platformer: A/D to move, Space to double jump.<br>Space shooter: WASD move, mouse aim, click/Space fire, E dash. Arrow keys also aim and fire.</p><p class="small muted">Touch controls appear on touch devices. Standard gamepads use the left stick to move, right stick to aim, × to jump/fire and R2 to boost/fire.</p>`);
 const actions={
 'home':()=>DKD.navigate('home'),
 'home-tab':id=>{if(['Games','Projects','Media'].includes(id)){DKD.homeTab=id;DKD.pushHistory('home');DKD.renderHome();}},
 'project-select':id=>{if(DKD.project(id)){DKD.projectSelection=id;try{history.replaceState({...history.state,dkdProject:id},'',location.href);}catch{}DKD.renderHome();}},
 'select-home':id=>{if(DKD.homeSelection===id){if(DKD.game(id))DKD.launch(id);else if(id==='store'||id==='plus')DKD.navigate('store');else if(id==='library')DKD.navigate('library');}else {DKD.homeSelection=id;DKD.renderHome();}},
 'store':()=>DKD.navigate('store'),'library':()=>DKD.navigate('library'),'settings':()=>DKD.navigate('settings'),
 'product':id=>DKD.navigate('product',id),'launch':id=>DKD.launch(id),'search':()=>DKD.search(),
 'store-tab':id=>{DKD.storeTab=id;DKD.renderStore();},'library-tab':id=>{DKD.libraryTab=id;DKD.renderLibrary();},'library-filter':id=>{DKD.libraryFilter=id;DKD.renderLibrary();},
 'checkout':id=>DKD.checkout(id),'buy':id=>{if(DKD.buy(id)){DKD.closeModal();DKD.renderProduct(id);DKD.toast('Purchase complete','Added to your Game Library.');}},
 'download':id=>{DKD.download(id);DKD.renderProduct(id);},'downloads':()=>DKD.showDownloads(),
 'pause-download':id=>{if(DKD.state.downloads[id])DKD.state.downloads[id].paused=!DKD.state.downloads[id].paused;DKD.persist();DKD.showDownloads();},
 'cancel-download':id=>{delete DKD.state.downloads[id];DKD.persist();DKD.showDownloads();if(['product','library'].includes(DKD.route))DKD.render();},
 'wishlist-toggle':id=>{DKD.wishlist(id);DKD.renderProduct(id);},'wishlist':()=>{DKD.storeTab='Wishlist';DKD.navigate('store');},
 'edit-widgets':()=>{DKD.editWidgets=!DKD.editWidgets;DKD.renderHome();},'add-widgets':()=>DKD.showAddWidgets(),
 'widget-add':id=>{if(!DKD.state.widgets.some(widget=>widget.id===id))DKD.state.widgets.push({id,size:['battery','headset','trophies'].includes(id)?1:2});DKD.persist();DKD.renderHome();DKD.showAddWidgets();},
 'widget-remove':id=>{DKD.state.widgets=DKD.state.widgets.filter(widget=>widget.id!==id);DKD.persist();DKD.renderHome();},
 'widget-resize':id=>{const widget=DKD.state.widgets.find(item=>item.id===id);widget.size=widget.size>=4?1:widget.size===1?2:4;DKD.persist();DKD.renderHome();},
 'widget-move':id=>{const position=DKD.state.widgets.findIndex(item=>item.id===id),[widget]=DKD.state.widgets.splice(position,1);DKD.state.widgets.splice(position===0?DKD.state.widgets.length:position-1,0,widget);DKD.persist();DKD.renderHome();},
 'wallpaper':()=>DKD.showBackgrounds(),'set-wallpaper':id=>{DKD.state.wallpaper=id;DKD.persist();DKD.closeModal();if(DKD.route==='home')DKD.renderHome();},
 'control-center':()=>DKD.toggleCC(),'cc-item':id=>{if(id==='Home')DKD.navigate('home');else{DKD.ccPanel=DKD.ccPanel===id?'':id;DKD.renderCC();}},
 'profile':()=>DKD.showCCPanel('Profile'),'friends':()=>DKD.showCCPanel('Game Base'),'accessories':()=>DKD.showCCPanel('Accessories'),'music':()=>DKD.showCCPanel('Music'),
 'trophies':()=>DKD.showTrophies(),'storage':()=>{DKD.settingsSection='Storage';DKD.navigate('settings');},'sound-settings':()=>{DKD.settingsSection='Sound';DKD.navigate('settings');},
 'settings-section':id=>{DKD.settingsSection=id;DKD.renderSettings();},
 'toggle-setting':id=>{DKD.state.settings[id]=!DKD.state.settings[id];DKD.persist();DKD.applySettings();if(id==='music')DKD.audio.setMusic(DKD.state.settings.music);if(DKD.ccOpen)DKD.renderCC();else if(DKD.route==='settings')DKD.renderSettings();},
 'toggle-music':()=>{DKD.state.settings.music=!DKD.state.settings.music;DKD.audio.setMusic(DKD.state.settings.music);DKD.persist();DKD.renderCC();},
 'power':id=>DKD.power(id),'wake':()=>DKD.wake(),'close-modal':()=>DKD.closeModal(),'controls-help':()=>DKD.controls(),
 'game-start':()=>{DKD.activeSession?.start();},'game-pause':()=>{const session=DKD.activeSession;if(session?.paused&&session.started)session.resume();else session?.pause(true);},'game-restart':()=>DKD.activeSession?.restart(),
 'fullscreen':async()=>{try {if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{DKD.toast('Full screen unavailable','Use your browser’s full-screen control.');}},
 'friend':id=>{const friend=DKD.friends.find(item=>item.name===id);DKD.modal(friend.name,`<div class="row">${DKD.avatar(friend.name,true,friend.color)}<div><h3>${friend.name}</h3><p>Playing ${friend.game}</p></div></div><p class="small muted">Local profile · This profile is part of your console experience.</p><button class="pill primary" data-action="invite-friend" data-id="${id}">Invite to Party</button>`);},
 'invite-friend':id=>{DKD.closeModal();DKD.notify('Party created',id+' has joined your party.');},
 'edit-profile':()=>DKD.modal('Edit Profile',`<label class="stack small">Online ID<input id="profile-name" value="${DKD.escape(DKD.state.profile.name)}" maxlength="24" style="padding:18px;background:#ffffff0b;border:1px solid #ffffff30;border-radius:8px;color:white;font-size:24px"></label><div class="modal-actions"><button class="pill primary" data-action="save-profile">Save</button></div>`),
 'save-profile':()=>{const value=document.getElementById('profile-name').value.trim();if(!value)return;DKD.state.profile.name=value;DKD.persist();DKD.closeModal();if(DKD.ccOpen)DKD.renderCC();else DKD.render();},
 'transactions':()=>DKD.modal('Transaction History',DKD.state.transactions.length?DKD.state.transactions.map(transaction=>`<div class="setting-row"><span>${DKD.game(transaction.id).title}<small>${new Date(transaction.date).toLocaleDateString()} · Purchase</small></span><span>${DKD.price(transaction.amount)}</span></div>`).join(''):'<p>No purchases yet.</p>'),
 'network-test':()=>{DKD.modal('Test Internet Connection',`<p>Testing your simulated console connection…</p>`);setTimeout(()=>{if(DKD.modalTitle==='Test Internet Connection')DKD.modal('Test Internet Connection',DKD.state.settings.network?'<div class="setting-row"><span>Connection</span><span>Successful</span></div><div class="setting-row"><span>Download speed</span><span>186.4 Mbps</span></div><div class="setting-row"><span>NAT type</span><span>Type 2</span></div><p class="small muted">Simulation results. Your real connection was not measured.</p>':'<p>Connection disabled. Enable the simulated network to resume downloads.</p>');},900);},
 'audio-test':()=>{DKD.audio.init();DKD.audio.collect();DKD.toast('Audio test','Playing through your browser.');},
 'uninstall-confirm':id=>DKD.modal('Delete game?',`<p>${DKD.game(id).title} will be removed from this console. You can download it again from your library. Your scores will be kept.</p><div class="modal-actions"><button class="pill" data-action="close-modal">Cancel</button><button class="pill primary" data-action="uninstall" data-id="${id}">Delete</button></div>`),
 'uninstall':id=>{DKD.state.installed=DKD.state.installed.filter(value=>value!==id);if(DKD.sessions[id]){DKD.sessions[id].destroy();delete DKD.sessions[id];}if(DKD.activeSession?.game.id===id)DKD.activeSession=null;DKD.persist();DKD.closeModal();DKD.renderSettings();},
 'reset-scores-confirm':()=>DKD.modal('Delete saved scores?',`<p>Your local high scores and trophies will be reset. Purchased games stay in your library.</p><div class="modal-actions"><button class="pill" data-action="close-modal">Cancel</button><button class="pill primary" data-action="reset-scores">Reset Scores</button></div>`),
 'reset-scores':()=>{DKD.state.scores={};DKD.state.trophies=[];DKD.persist();DKD.closeModal();DKD.renderSettings();},
 'gallery':()=>DKD.modal('Media Gallery',`<div class="background-choices">${DKD.catalog.slice(0,3).map(game=>`<button class="background-choice" data-action="view-art" data-id="${game.id}" style="background-image:url('${DKD.art(game.id)}')">${game.title}</button>`).join('')}</div>`,true),
 'view-art':id=>DKD.modal(DKD.game(id).title,`<img src="${DKD.art(id)}" alt="${DKD.game(id).title} artwork" style="width:100%;border-radius:10px"><div class="modal-actions"><button class="pill" data-action="gallery">Back to Gallery</button><button class="pill primary" data-action="set-wallpaper" data-id="${DKD.game(id).art}">Set as Background</button></div>`,true),
 'trailer':()=>DKD.modal('Game Showcase',`<img src="${DKD.art('apex')}" alt="APEX DRIFT" style="width:100%;border-radius:12px"><p>APEX DRIFT · Five stages of midnight arcade racing.</p><button class="pill primary" data-action="launch" data-id="apex">Play Game</button>`),
 'about':()=>DKD.modal('DraBornPS v0.6 Software Update',`<p>An independent browser simulation inspired by the documented PS5 Games / Media interface and Welcome Hub. Miami Nights appearance, with a custom Projects showcase. The custom Projects tab showcases the DraBornEagle ecosystem without altering the documented Games / Media base layout.</p><p>The DraBornGames catalog combines original playable browser experiences with the console simulation. Purchases, downloads, friends and hardware indicators are simulated. No connection to PlayStation Network.</p><p class="small muted">PlayStation, PS5 and DualSense are trademarks of Sony Interactive Entertainment. This project is not affiliated with or endorsed by Sony. UI, code, game overlays and audio were created for this project. Store cover photography includes raster imagery from Unsplash. Project concept mockups and the Miami wallpaper were generated for DraBornPS.</p>`)
 };
 DKD.dispatch=(action,id)=>{lastInput=Date.now();DKD.audio.init();const dkdLaunchingGame=action==='launch';if(dkdLaunchingGame)DKD.audio.pauseMusic();else if(DKD.state.settings.music&&DKD.route!=='game')DKD.audio.setMusic(true);DKD.audio.click();const result=actions[action]?.(id);if(document.documentElement.classList.contains('capture-mode'))requestAnimationFrame(()=>window.scrollTo(0,0));if(result?.catch)result.catch(error=>DKD.toast('Something went wrong',error.message));};
 document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button&&!button.disabled)DKD.dispatch(button.dataset.action,button.dataset.id);});
 document.addEventListener('input',event=>{const target=event.target;if(target.id==='store-search'){DKD.storeQuery=target.value;document.getElementById('store-content').innerHTML=DKD.storeContent();}if(target.id==='global-search'){const query=target.value.toLowerCase();document.getElementById('global-results').innerHTML=DKD.catalog.filter(game=>game.title.toLowerCase().includes(query)).map(game=>DKD.gameCard(game)).join('')||'<p>No games found.</p>';}if(target.dataset.setting&&target.type==='range'){DKD.state.settings[target.dataset.setting]=Number(target.value);document.querySelectorAll(`[data-range-label="${target.dataset.setting}"]`).forEach(element=>element.textContent=target.value);DKD.persist();DKD.applySettings();}});
 document.addEventListener('change',event=>{if(event.target.matches('select[data-setting]')){DKD.state.settings[event.target.dataset.setting]=event.target.value;DKD.persist();DKD.applySettings();}});
 const visibleButtons=()=>{const scope=DKD.modalTitle?document.querySelector('.modal'):DKD.ccOpen?document.getElementById('control-center'):DKD.route==='game'?DKD.activeSession.root:DKD.screen;return [...scope.querySelectorAll('button:not(:disabled),a[href],input,select')].filter(element=>element.getBoundingClientRect().width&&element.getBoundingClientRect().height);};
 DKD.moveFocus=direction=>{const buttons=visibleButtons(),active=document.activeElement;if(!buttons.includes(active)){buttons[0]?.focus();return;}const rect=active.getBoundingClientRect(),cx=rect.x+rect.width/2,cy=rect.y+rect.height/2;let best=null,bestDistance=Infinity;for(const element of buttons){if(element===active)continue;const box=element.getBoundingClientRect(),dx=box.x+box.width/2-cx,dy=box.y+box.height/2-cy;if((direction==='ArrowRight'&&dx<10)||(direction==='ArrowLeft'&&dx>-10)||(direction==='ArrowDown'&&dy<10)||(direction==='ArrowUp'&&dy>-10))continue;const primary=['ArrowLeft','ArrowRight'].includes(direction)?Math.abs(dx):Math.abs(dy),secondary=['ArrowLeft','ArrowRight'].includes(direction)?Math.abs(dy):Math.abs(dx),distance=primary+secondary*3;if(distance<bestDistance){best=element;bestDistance=distance;}}best?.focus();};
 const back=()=>{if(DKD.powerState){if(DKD.powerState!=='restart')DKD.wake();return;}if(DKD.modalTitle){DKD.closeModal();return;}if(DKD.ccOpen){DKD.closeCC();return;}if(DKD.route==='game'){actions['game-pause']();return;}if(DKD.route==='product')DKD.navigate('store');else DKD.navigate('home');};
 document.addEventListener('keydown',event=>{lastInput=Date.now();const typing=['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName);if(event.code==='F1'){event.preventDefault();DKD.toggleCC();return;}if(event.code==='Escape'){event.preventDefault();back();return;}if(typing)return;if(event.code==='Home'){event.preventDefault();DKD.navigate('home');return;}if(DKD.powerState)return;
 if(DKD.route==='game'&&!DKD.ccOpen&&!DKD.modalTitle){if(event.code==='KeyP'){event.preventDefault();actions['game-pause']();return;}if(!DKD.activeSession.paused){if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code))event.preventDefault();if(!event.repeat)DKD.input.pressed.add(event.code);DKD.input.keys.add(event.code);return;}}
 if(event.code==='Tab'&&DKD.modalTitle){const buttons=visibleButtons(),position=buttons.indexOf(document.activeElement);if(event.shiftKey&&position<=0){event.preventDefault();buttons.at(-1)?.focus();}else if(!event.shiftKey&&position===buttons.length-1){event.preventDefault();buttons[0]?.focus();}return;}
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.code)){event.preventDefault();if(DKD.route==='home'&&DKD.homeTab==='Games'&&!DKD.ccOpen&&!DKD.modalTitle&&['ArrowLeft','ArrowRight'].includes(event.code)&&(document.activeElement===document.body||document.activeElement.closest('.game-rail'))){const items=DKD.homeItems(),index=items.findIndex(item=>item.id===DKD.homeSelection);DKD.homeSelection=items[DKD.clamp(index+(event.code==='ArrowRight'?1:-1),0,items.length-1)].id;DKD.renderHome();document.querySelector('.game-tile.selected')?.focus();}else DKD.moveFocus(event.code);}
 });
 document.addEventListener('keyup',event=>DKD.input.keys.delete(event.code));
 const dkdGamePointers=new Map();
 const dkdReleaseGamePointer=event=>{
  const key=dkdGamePointers.get(event.pointerId);
  if(!key)return false;
  dkdGamePointers.delete(event.pointerId);
  if(![...dkdGamePointers.values()].includes(key))DKD.input.keys.delete(key);
  return true;
 };
 document.addEventListener('pointerdown',event=>{
  lastInput=Date.now();
  const button=event.target.closest?.('[data-game-key]');
  if(!button)return;
  event.preventDefault();
  event.stopPropagation();
  const key=button.dataset.gameKey;
  dkdGamePointers.set(event.pointerId,key);
  DKD.input.keys.add(key);
  DKD.input.pressed.add(key);
  try{button.setPointerCapture?.(event.pointerId);}catch{}
 },{passive:false});
 document.addEventListener('pointermove',event=>{
  if(dkdGamePointers.has(event.pointerId))event.preventDefault();
 },{passive:false});
 document.addEventListener('pointerup',event=>{
  DKD.input.pointer.down=false;
  if(dkdReleaseGamePointer(event)){event.preventDefault();event.stopPropagation();}
 },{passive:false});
 document.addEventListener('pointercancel',event=>{
  DKD.input.pointer.down=false;
  dkdReleaseGamePointer(event);
 });
 document.addEventListener('lostpointercapture',event=>{dkdReleaseGamePointer(event);});
 document.addEventListener('contextmenu',event=>{if(event.target.closest?.('[data-game-key]'))event.preventDefault();});
 document.addEventListener('selectstart',event=>{if(event.target.closest?.('.game-session'))event.preventDefault();});
 window.addEventListener('blur',()=>{dkdGamePointers.clear();DKD.input.clear();if(DKD.route==='game'&&!DKD.ccOpen)DKD.activeSession?.pause(true);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){DKD.input.clear();if(DKD.route==='game')DKD.activeSession?.pause(true);}});
 let lastPad=[],padCooldown=0;function pollPad(now){const pad=navigator.getGamepads?.()?.[0];if(pad){const buttons=pad.buttons.map(button=>button.pressed),edge=index=>buttons[index]&&!lastPad[index];DKD.input.pad={x:Math.abs(pad.axes[0])>.15?pad.axes[0]:0,y:Math.abs(pad.axes[1])>.15?pad.axes[1]:0,aimX:pad.axes[2]||0,aimY:pad.axes[3]||0,fire:buttons[7]||buttons[0],jump:edge(0),boost:buttons[7]||buttons[5],dash:edge(1)};if(edge(16))DKD.toggleCC();else if(edge(9)&&DKD.route==='game')actions['game-pause']();else if(DKD.route!=='game'||DKD.ccOpen||DKD.activeSession?.paused||DKD.modalTitle){if(edge(1))back();if(edge(0))document.activeElement?.click();if(now>padCooldown){const direction=buttons[12]||pad.axes[1]<-.6?'ArrowUp':buttons[13]||pad.axes[1]>.6?'ArrowDown':buttons[14]||pad.axes[0]<-.6?'ArrowLeft':buttons[15]||pad.axes[0]>.6?'ArrowRight':null;if(direction){DKD.moveFocus(direction);padCooldown=now+180;}}}lastPad=buttons;}requestAnimationFrame(pollPad);}requestAnimationFrame(pollPad);

 window.addEventListener('popstate',event=>{
  const state=event.state;
  if(!state?.dkdps){
   try{history.pushState({...DKD.historySnapshot(DKD.route,DKD.activeSession?.game?.id||DKD.productId||null),guard:true},'',location.href);}catch{}
   return;
  }
  DKD.historyApplying=true;
  try{
   if(['Games','Projects','Media'].includes(state.dkdTab))DKD.homeTab=state.dkdTab;
   if(DKD.project(state.dkdProject))DKD.projectSelection=state.dkdProject;
   if(state.route==='game'&&state.id)DKD.launch(state.id);
   else DKD.navigate(state.route||'home',state.id||null,{history:false});
  }finally{DKD.historyApplying=false;}
  if(state.base&&!state.guard){try{history.pushState({...state,guard:true},'',location.href);}catch{}}
 });

 const dkdPull=document.createElement('div');
 dkdPull.id='dkd-pull-refresh';
 dkdPull.innerHTML='<span class="dkd-refresh-mark">↻</span><span class="dkd-refresh-text">Yenilemek için çek</span>';
 document.body.appendChild(dkdPull);
 let dkdPullActive=false,dkdPullStartY=0,dkdPullStartX=0,dkdPullDistance=0,dkdPullScroller=null;
 const dkdPullText=dkdPull.querySelector('.dkd-refresh-text');
 const dkdFindScroller=target=>target.closest?.('.page,.product-screen,.home-body,.projects-body,.project-rail,.cc-panel,.modal,.widgets')||null;
 document.addEventListener('touchstart',event=>{
  if(!DKD.isMobileUI||DKD.route==='game'||DKD.modalTitle||DKD.ccOpen||event.touches.length!==1)return;
  dkdPullScroller=dkdFindScroller(event.target);
  if(dkdPullScroller&&dkdPullScroller.scrollTop>1)return;
  const touch=event.touches[0];dkdPullStartY=touch.clientY;dkdPullStartX=touch.clientX;dkdPullDistance=0;dkdPullActive=true;
 },{passive:true});
 document.addEventListener('touchmove',event=>{
  if(!dkdPullActive||event.touches.length!==1)return;
  const touch=event.touches[0],dy=touch.clientY-dkdPullStartY,dx=touch.clientX-dkdPullStartX;
  if(dy<=0||Math.abs(dx)>Math.abs(dy)*.8)return;
  if(dkdPullScroller&&dkdPullScroller.scrollTop>1){dkdPullActive=false;return;}
  dkdPullDistance=Math.min(116,dy*.58);
  if(dkdPullDistance>7){
   event.preventDefault();
   dkdPull.classList.add('show');
   dkdPull.classList.toggle('ready',dkdPullDistance>=68);
   dkdPull.style.transform=`translate(-50%,${Math.max(-56,dkdPullDistance-58)}px)`;
   dkdPullText.textContent=dkdPullDistance>=68?'Bırak ve yenile':'Yenilemek için çek';
  }
 },{passive:false});
 const dkdEndPull=()=>{
  if(!dkdPullActive)return;
  const refresh=dkdPullDistance>=68;dkdPullActive=false;
  if(refresh){
   dkdPull.classList.add('show','refreshing');dkdPull.classList.remove('ready');
   dkdPull.style.transform='translate(-50%,8px)';dkdPullText.textContent='Yenileniyor…';
   setTimeout(()=>location.reload(),90);
  }else{
   dkdPull.classList.remove('show','ready');dkdPull.style.transform='translate(-50%,-72px)';
  }
  dkdPullDistance=0;dkdPullScroller=null;
 };
 document.addEventListener('touchend',dkdEndPull,{passive:true});
 document.addEventListener('touchcancel',dkdEndPull,{passive:true});

 if(new URLSearchParams(location.search).get('capture')==='1080p')document.documentElement.classList.add('capture-mode');
 const resize=()=>{const viewport=document.getElementById('viewport'),consoleEl=document.getElementById('console');const changed=DKD.syncUIMode();const usableWidth=viewport.clientWidth||innerWidth,usableHeight=viewport.clientHeight||innerHeight;if(DKD.isMobileUI){consoleEl.style.left='0px';consoleEl.style.top='0px';consoleEl.style.width='100%';consoleEl.style.height='100dvh';consoleEl.style.minWidth='100%';consoleEl.style.minHeight='100dvh';consoleEl.style.transform='none';document.documentElement.style.setProperty('--dkd-console-scale',1);}else{const baseWidth=1920,baseHeight=1080;const scale=Math.min(usableWidth/baseWidth,usableHeight/baseHeight);consoleEl.style.left='50%';consoleEl.style.top='50%';consoleEl.style.width=baseWidth+'px';consoleEl.style.height=baseHeight+'px';consoleEl.style.minWidth='';consoleEl.style.minHeight='';consoleEl.style.transform=`translate(-50%, -50%) scale(${scale})`;document.documentElement.style.setProperty('--dkd-console-scale',scale);}if(changed){DKD.footer();if(DKD.ccOpen)DKD.renderCC();}};window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);window.addEventListener('orientationchange',()=>setTimeout(resize,120));resize();
 if(navigator.maxTouchPoints>0)document.getElementById('console').classList.add('touch-device');
 setInterval(()=>{DKD.clock();const rest=DKD.state.settings.autoRest,limit=rest==='20 minutes'?1200000:rest==='1 hour'?3600000:Infinity;if(!DKD.powerState&&Date.now()-lastInput>limit&&DKD.route!=='game')DKD.power('rest');if(DKD.route==='game'&&!DKD.activeSession?.paused){playTime++;const reminder=DKD.state.settings.playReminder;if(!reminderSent&&reminder&&reminder!=='Off'&&playTime>parseInt(reminder)*60){DKD.toast('Time for a break?',`You have played for ${reminder}.`);reminderSent=true;}}},1000);
 DKD.applySettings();DKD.render();if(DKD.state.settings.music)DKD.audio.setMusic(true);
})();
