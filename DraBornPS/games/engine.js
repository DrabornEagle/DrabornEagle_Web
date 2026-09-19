DKD.sessions={};DKD.engines={};
DKD.input={keys:new Set(),pressed:new Set(),pointer:{x:800,y:300,down:false,active:false},pad:{x:0,y:0,aimX:0,aimY:0,fire:false,jump:false,boost:false,dash:false},down(...keys){return keys.some(key=>this.keys.has(key));},hit(...keys){return keys.some(key=>this.pressed.has(key));},clear(){this.keys.clear();this.pressed.clear();this.pointer.down=false;}};
DKD.clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
DKD.GameSession=class{
 constructor(game){this.game=game;this.started=false;this.paused=true;this.over=false;this.running=true;this.last=0;this.hudTime=0;this.messageTimer=0;this.root=document.createElement('section');this.root.className='game-session game-'+game.id.replace(/[^a-z0-9-]/gi,'').toLowerCase();this.root.innerHTML=`<canvas width="1600" height="900" aria-label="${game.title} game canvas"></canvas><div class="game-hud" aria-live="off"></div><div class="game-message"></div><div class="game-help">${game.controls}</div><div class="game-toolbar"><button data-action="game-pause">${DKD.icon('pause')} Pause</button><button data-action="control-center">${DKD.icon('ps')} Control Center</button></div><div class="touch-pad"><button class="up" data-game-key="KeyW" aria-label="Move up">↑</button><button class="left" data-game-key="KeyA" aria-label="Move left">←</button><button class="down" data-game-key="KeyS" aria-label="Move down">↓</button><button class="right" data-game-key="KeyD" aria-label="Move right">→</button></div><div class="touch-actions"><button class="touch-jump" data-game-key="Space">${game.engine==='platformer'?'Jump':'Fire'}</button><button class="touch-boost" data-game-key="${game.engine==='shooter'?'KeyE':'ShiftLeft'}">${game.engine==='shooter'?'Dash':'Boost'}</button></div><div class="game-overlay"></div>`;
 this.canvas=this.root.querySelector('canvas');this.ctx=this.canvas.getContext('2d',{alpha:false});this.hud=this.root.querySelector('.game-hud');this.overlay=this.root.querySelector('.game-overlay');this.background=new Image();this.background.src=DKD.art(game.id);this.sim=DKD.engines[game.engine](this);this.sim.reset();this.renderMenu('start');this.sim.render(this.ctx);this.updateHUD();this.loop=this.loop.bind(this);this.frame=requestAnimationFrame(this.loop);this.root.querySelector('.game-help').hidden=!DKD.state.settings.subtitles;
 this.canvas.addEventListener('pointermove',event=>{const rect=this.canvas.getBoundingClientRect();DKD.input.pointer.x=(event.clientX-rect.left)/rect.width*1600;DKD.input.pointer.y=(event.clientY-rect.top)/rect.height*900;DKD.input.pointer.active=true;});this.canvas.addEventListener('pointerdown',()=>{DKD.input.pointer.down=true;DKD.audio.init();});
 }
 loop(now){if(!this.running)return;const dt=Math.min((now-this.last)/1000||0,.04);this.last=now;if(!this.paused&&!this.over){this.sim.update(dt,DKD.input);this.hudTime+=dt;if(this.messageTimer>0){this.messageTimer-=dt;if(this.messageTimer<=0)this.root.querySelector('.game-message').textContent='';}if(this.hudTime>.12){this.updateHUD();this.hudTime=0;}}if(!this.root.hidden)this.sim.render(this.ctx);if(DKD.activeSession===this)DKD.input.pressed.clear();this.frame=requestAnimationFrame(this.loop);}
 updateHUD(){const data=this.sim.stats();this.hud.innerHTML=`<div><div class="hud-title">${this.game.title}</div><div class="hud-label">SCORE</div><div class="hud-score">${Math.floor(data.score).toLocaleString()}</div></div><div class="hud-center"><div class="hud-label">${data.label}</div><div>${data.stage}</div>${data.progress!==undefined?`<div class="hud-progress"><span style="width:${DKD.clamp(data.progress,0,100)}%"></span></div>`:''}</div><div class="hud-block"><div class="hud-label">${data.healthLabel||'LIVES'}</div><div class="hud-hearts">${'●'.repeat(Math.max(0,data.lives))}${'○'.repeat(Math.max(0,3-data.lives))}</div><div class="small" style="margin-top:15px">${data.extra||''}</div></div>`;}
 renderMenu(mode){const game=this.game;let title=game.title,caption=game.subtitle;if(mode==='pause'){title='Paused';caption='Your adventure can wait.';}if(mode==='over'){title=this.won?'Mission complete':'Game over';caption=`Score ${Math.floor(this.sim.stats().score).toLocaleString()} · Best ${(DKD.state.scores[game.id]||0).toLocaleString()}`;}
 this.overlay.hidden=false;this.overlay.innerHTML=`<div class="game-menu"><span class="tag">${mode==='start'?game.tag:game.title}</span><h1>${title}</h1><p>${caption}</p>${mode==='start'?`<div class="game-controls">${game.controls}<br>Esc / P: pause · F1 / PS button: Control Center</div>`:''}<div class="buttons">${mode==='over'?`<button class="pill primary" data-action="game-restart">Play Again</button>`:`<button class="pill primary" data-action="game-start">${mode==='start'?'Start Game':'Resume Game'}</button>`}${mode==='pause'?'<button class="pill" data-action="game-restart">Restart</button>':''}<button class="pill" data-action="home">Back to Home</button></div></div>`;
 }
 start(){this.started=true;this.paused=false;this.overlay.hidden=true;DKD.input.clear();DKD.audio.init();DKD.audio.collect();DKD.award('first-play','A new adventure');}
 pause(showMenu=false){this.paused=true;DKD.input.clear();this.saveScore();if(showMenu&&!this.over)this.renderMenu(this.started?'pause':'start');}
 resume(){if(this.started&&!this.over){this.paused=false;this.overlay.hidden=true;DKD.input.clear();}}
 restart(){this.over=false;this.won=false;this.sim.reset();this.start();this.updateHUD();}
 finish(won=false){if(this.over)return;this.over=true;this.won=won;this.paused=true;this.saveScore();if(won)DKD.award(this.game.id+'-complete',this.game.title+' · Journey complete');this.updateHUD();this.renderMenu('over');}
 saveScore(){const score=Math.floor(this.sim.stats().score);if(score>(DKD.state.scores[this.game.id]||0)){DKD.state.scores[this.game.id]=score;DKD.persist();}}
 message(text,duration=2.4){this.root.querySelector('.game-message').textContent=text;this.messageTimer=duration;}
 destroy(){this.saveScore();this.running=false;cancelAnimationFrame(this.frame);this.root.remove();}
};
DKD.stopGame=()=>{
 const host=document.getElementById('game-host');
 for(const [id,session] of Object.entries(DKD.sessions||{})){try{session.destroy();}catch{}delete DKD.sessions[id];}
 DKD.activeSession=null;DKD.input.clear();if(host){host.innerHTML='';host.hidden=true;}
};
DKD.launch=id=>{
 const game=DKD.game(id);if(!game)return;
 if(!game.external&&!DKD.state.installed.includes(id)){DKD.navigate('product',id);return;}
 if(!DKD.historyApplying)DKD.pushHistory?.('game',id);
 DKD.audio?.pauseMusic?.();DKD.stopGame();DKD.closeModal();DKD.closeCC(false);
 const host=document.getElementById('game-host');
 if(game.external&&game.externalUrl){
  host.innerHTML=`<section class="external-game-session"><iframe class="external-game-frame" src="${game.externalUrl}" title="${DKD.escape(game.title)}" allow="fullscreen; autoplay; gamepad"></iframe><div class="external-game-bar"><button data-action="home" aria-label="DraBornPS Home">${DKD.icon('ps')}<span>DraBornPS</span></button><span class="external-game-brand">DraBorn<b>Games</b> · ${DKD.escape(game.title)}</span></div></section>`;
  host.hidden=false;
 }else{
  const session=new DKD.GameSession(game);DKD.sessions[id]=session;DKD.activeSession=session;host.append(session.root);session.root.hidden=false;host.hidden=false;
 }
 DKD.route='game';DKD.screen.hidden=true;document.getElementById('system-footer').hidden=true;
 DKD.state.recent=[id,...DKD.state.recent.filter(value=>value!==id)].slice(0,6);DKD.persist();
};
