(() => {
  "use strict";

  // DraBornQuiz is an original one-button puzzle implementation. No code,
  // art, audio or level data from Pressing Under Pressure is incorporated.
  const dkdStages = [
    { kind:"tap", goal:1, prompt:"Kontrol testi: Düğmeye bir kez bas.", hint:"Her şey bir dokunuşla başlar.", limit:18 },
    { kind:"tap", goal:2, prompt:"Şimdi tam iki kez bas.", hint:"Fazlası değil, tam iki.", limit:18 },
    { kind:"tap", goal:3, prompt:"Üç kısa basış yap.", hint:"Her basıştan sonra parmağını kaldır.", limit:18 },
    { kind:"wait", seconds:3, prompt:"Bu kez hiçbir şeye dokunma.", sub:"3 saniye sabret.", hint:"Hareketsizlik de bir cevap olabilir.", limit:7 },
    { kind:"hold", seconds:1.5, prompt:"Düğmeyi en az 1,5 saniye basılı tut.", sub:"Süre dolunca bırak.", hint:"Basılı tut → sonra bırak.", limit:12 },
    { kind:"tap", goal:4, prompt:"Dört sinyal gerekiyor.", sub:"● ● ● ●", hint:"Dört net basış.", limit:18 },
    { kind:"tap", goal:1, prompt:"8 bir çift sayıdır. Onayla.", sub:"Doğru olduğunu düşünüyorsan bir kez bas.", hint:"Bazen gerçekten kolaydır.", limit:12 },
    { kind:"wait", seconds:3, prompt:"9 çift sayıysa bas.", sub:"Değilse 3 saniye bekle.", hint:"Önce düşün, sonra karar ver.", limit:8 },
    { kind:"tap", goal:1, prompt:"Gizli erişim kodu: 7", sub:"Bu sayıyı aklında tut. Devam etmek için bas.", hint:"Bu bilgi ileride işine yarayabilir.", clue:"07", limit:20 },
    { kind:"half", goal:1, prompt:"Süre yarıya indiğinde bir kez bas.", sub:"Önce bekle. Çok erken basma.", hint:"Geri sayımın tam yarısından sonra.", limit:10 },
    { kind:"green", goal:1, prompt:"Işık YEŞİL olunca düğmeye bas.", sub:"Kırmızı ışıkta basarsan elenirsin.", hint:"Konsolun üzerindeki durum ışığını izle.", limit:14 },
    { kind:"tap", goal:2, prompt:"İki kısa sinyal daha gönder.", sub:"Hız önemli değil; sayı önemli.", hint:"Basışları say.", limit:14 },
    { kind:"hold", seconds:2, prompt:"Basılı tut. En az iki saniye.", sub:"Düğmeyi erken bırakırsan kaybedersin.", hint:"Bas → bekle → bırak.", limit:11 },
    { kind:"wait", seconds:4, prompt:"BU BİR EMİR: BASMA.", sub:"Dört saniye hiçbir şey yapma.", hint:"Sabır refleksinden güçlüdür.", limit:9 },
    { kind:"tap", goal:4, prompt:"Bu dörtgenin kaç köşesi var?", sub:"Dörtgen = ◇", hint:"Her köşe için bir kez bas.", clue:"◇", limit:18 },
    { kind:"tap", goal:5, prompt:"3 + 2 = ?", sub:"Sonuç kadar bas.", hint:"Beş basış yeterli.", limit:18 },
    { kind:"delay", delay:2.5, goal:1, prompt:"Önce 2,5 saniye bekle. Sonra bas.", sub:"Erken basarsan kaybedersin.", hint:"Geri sayımı takip et.", limit:9 },
    { kind:"rhythm", goal:3, minGap:320, maxGap:1050, prompt:"Üç düzenli ritim tut.", sub:"Basışların arası 0,3–1 saniye olmalı.", hint:"Tık… tık… tık…", limit:13 },
    { kind:"tap", goal:1, prompt:"9. testteki kodu hatırlıyor musun?", sub:"Hatırlıyorsan bir kez bas.", hint:"Kodu yazmana gerek yok.", limit:14 },
    { kind:"wait", seconds:5, prompt:"Acele eden kaybeder.", sub:"Hiçbir yere basmadan beş saniye bekle.", hint:"Geri sayım kendiliğinden biter.", limit:10 },
    { kind:"quick", deadline:2, goal:1, prompt:"HIZLI! İlk 2 saniye içinde bas.", sub:"Bu sefer düşünmek için az vaktin var.", hint:"Şimdi!", limit:5 },
    { kind:"hold", seconds:2.3, prompt:"Sistemi yeniden başlat.", sub:"Kırmızı düğmeyi en az 2,3 saniye tut ve bırak.", hint:"Süreyi doldur.", limit:12 },
    { kind:"tap", goal:2, prompt:"Sadece rakamı takip et: İKİ.", sub:"Konsola iki sinyal gönder.", hint:"Kelime seni yanıltmasın.", limit:14 },
    { kind:"wait", seconds:4, prompt:"Düğmeye basmanı istiyorum...", sub:"...ama SADECE YARIN. Şimdi bekle.", hint:"Dört saniye sabret.", limit:9 },
    { kind:"window", from:2, until:5, goal:1, prompt:"İkinci saniyeden sonra, beşinciden önce bas.", sub:"Çok erken veya geç basma.", hint:"2.0s — 5.0s aralığı", limit:8 },
    { kind:"tap", goal:4, prompt:"Aşağıdaki ışıkları say.", sub:"Her ışık için bir kez bas.", clue:"✦  ✦  ✦  ✦", hint:"Yalnızca parlayan dört ışığı say.", limit:18 },
    { kind:"hold", seconds:2.8, prompt:"Son dayanıklılık testi.", sub:"2,8 saniye basılı tut, sonra bırak.", hint:"Basmaya devam et.", limit:13 },
    { kind:"wait", seconds:5, prompt:"Bu cümlede BAS kelimesi var.", sub:"Ama görev yine de basmamak. 5 saniye bekle.", hint:"Kelimeler değil, talimatlar belirler.", limit:10 },
    { kind:"green", goal:1, prompt:"Son güvenlik kilidi: yeşili bekle.", sub:"Işık değiştiğinde bir kez bas.", hint:"İşareti kaçırırsan bir sonraki döngüyü bekle.", limit:15 },
    { kind:"delay", delay:4, goal:1, prompt:"Final kapısı hazır.", sub:"Tamamlamak için 4 saniye bekle, sonra bir kez bas.", hint:"Son kararı sen ver.", limit:11 }
  ];

  const dkdId = (id) => document.getElementById(id);
  const el = {
    scene:dkdId("dkdScene"), button:dkdId("dkdPress"),
    stage:dkdId("dkdStageLabel"), mode:dkdId("dkdModeLabel"),
    timer:dkdId("dkdTimer"), terminalState:dkdId("dkdTerminalState"),
    number:dkdId("dkdQuestionNumber"), prompt:dkdId("dkdPrompt"),
    sub:dkdId("dkdSubprompt"), clue:dkdId("dkdClue"),
    hint:dkdId("dkdHint"), count:dkdId("dkdPressCount"),
    best:dkdId("dkdBest"), progress:dkdId("dkdProgress"),
    percent:dkdId("dkdPercent"), sceneMessage:dkdId("dkdSceneMessage"),
    overlay:dkdId("dkdOverlay"), overlayTag:dkdId("dkdOverlayTag"),
    overlayTitle:dkdId("dkdOverlayTitle"), overlayText:dkdId("dkdOverlayText"),
    overlayStats:dkdId("dkdOverlayStats"), start:dkdId("dkdStart"),
    sound:dkdId("dkdSound"), fullscreen:dkdId("dkdFullscreen"),
    help:dkdId("dkdHelp"), helpDialog:dkdId("dkdHelpDialog"),
    helpClose:dkdId("dkdCloseHelp"), helpResume:dkdId("dkdResume"),
    announcer:dkdId("dkdAnnouncer")
  };

  if (!el.button || !el.scene || !el.overlay) return;

  const dkdStorage = {
    read(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch { return fallback; }
    },
    save(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage optional */ }
    }
  };

  const state = {
    phase:"intro", index:0, presses:0, down:false, pointer:null,
    downAt:0, startedAt:0, lastTapAt:0, transitioning:false,
    advance:null, best:Math.max(0,Math.min(30,Number(dkdStorage.read("dkd_quiz_best_v1",0))||0)),
    wins:Number(dkdStorage.read("dkd_quiz_wins_v1",0))||0,
    muted:!!dkdStorage.read("dkd_quiz_muted_v1",false),
    pausedAt:0, audio:null, lastTime:-1
  };

  const current = () => dkdStages[state.index];
  const elapsed = (now = performance.now()) => Math.max(0,(now-state.startedAt)/1000);
  const setLive = (value) => { el.announcer.textContent = value; };
  const setMessage = (value, type="") => {
    el.sceneMessage.textContent = value;
    el.sceneMessage.className = "scene-message" + (type ? " " + type : "");
  };
  const updateBest = (value) => {
    state.best = Math.max(state.best,value);
    dkdStorage.save("dkd_quiz_best_v1",state.best);
    el.best.textContent = "EN İYİ: " + state.best + " / " + dkdStages.length;
  };

  function tone(kind="tap") {
    if (state.muted) return;
    try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioClass) return;
      if (!state.audio) state.audio = new AudioClass();
      if (state.audio.state === "suspended") state.audio.resume().catch(()=>{});
      const audio = state.audio, osc = audio.createOscillator();
      const volume = audio.createGain(), time = audio.currentTime;
      const map = {tap:[150,.09,"triangle"],success:[520,.22,"sine"],error:[95,.36,"sawtooth"],win:[760,.5,"sine"]};
      const [freq, duration, wave] = map[kind] || map.tap;
      osc.type = wave;
      osc.frequency.setValueAtTime(freq,time);
      osc.frequency.exponentialRampToValueAtTime(kind==="error" ? 45 : freq*1.4,time+duration);
      volume.gain.setValueAtTime(.0001,time);
      volume.gain.exponentialRampToValueAtTime(kind==="error" ? .075 : .045,time+.013);
      volume.gain.exponentialRampToValueAtTime(.0001,time+duration);
      osc.connect(volume).connect(audio.destination);
      osc.start(time);
      osc.stop(time+duration+.01);
    } catch { /* audio never blocks gameplay */ }
  }

  function stageMode(stage) {
    if (stage.kind==="wait") return "SABIR TESTİ";
    if (stage.kind==="hold") return "BASILI TUT";
    if (stage.kind==="half" || stage.kind==="window" || stage.kind==="delay") return "ZAMANLAMA";
    if (stage.kind==="quick") return "REFLEKS";
    if (stage.kind==="green") return "IŞIK TESTİ";
    if (stage.kind==="rhythm") return "RİTİM";
    return "MANTIK TESTİ";
  }

  function refreshHud() {
    const stage = current();
    const target = stage.goal || 0;
    el.stage.innerHTML = String(state.index+1).padStart(2,"0") + ' <span>/ ' + dkdStages.length + '</span>';
    el.mode.textContent = stageMode(stage);
    el.terminalState.textContent = "ACTIVE / " + stageMode(stage);
    el.number.textContent = "TEST " + String(state.index+1).padStart(2,"0");
    el.prompt.textContent = stage.prompt;
    el.sub.textContent = stage.sub || "Talimatı dikkatlice takip et.";
    el.clue.textContent = stage.clue || "";
    el.clue.hidden = !stage.clue;
    el.hint.textContent = stage.hint || "DİKKATLİ OL";
    el.count.textContent = target ? "BASMA: 0 / " + target : (stage.kind==="hold" ? "BASILI TUT: 0.0s" : "BASMA: GEREKMİYOR");
    el.percent.textContent = Math.round(state.index/dkdStages.length*100) + "%";
    el.progress.style.width = (state.index/dkdStages.length*100) + "%";
    el.timer.textContent = stage.limit.toFixed(1) + "s";
    el.timer.classList.remove("urgent");
    el.scene.classList.remove("is-green","success-flash","error-flash");
    el.scene.classList.toggle("is-hold-test",stage.kind==="hold");
    el.scene.classList.toggle("test-green",stage.kind==="green");
    el.button.classList.remove("is-pressed");
    el.button.disabled = false;
    setMessage("");
    updateBest(state.best);
    setLive("Seviye " + (state.index+1) + ". " + stage.prompt + " " + (stage.sub||""));
  }

  function beginStage() {
    state.down = false; state.pointer = null; state.presses = 0;
    state.lastTapAt = 0; state.downAt = 0; state.lastTime = -1;
    state.transitioning = false; state.startedAt = performance.now();
    state.pausedAt = 0;
    refreshHud();
  }

  function startGame() {
    if (state.advance) clearTimeout(state.advance);
    state.phase = "playing";
    state.index = 0;
    el.overlay.hidden = true;
    el.helpDialog.hidden = true;
    el.scene.classList.remove("error-flash");
    beginStage();
    tone("success");
    el.button.focus({preventScroll:true});
  }

  function completeStage() {
    if (state.phase !== "playing" || state.transitioning) return;
    state.transitioning = true;
    state.down = false; state.pointer = null;
    el.button.classList.remove("is-pressed");
    el.button.disabled = true;
    el.scene.classList.add("success-flash");
    setMessage("DOĞRU CEVAP · GEÇİŞ YAPILIYOR","good");
    setLive("Başarılı. Sonraki seviye açılıyor.");
    tone("success");
    updateBest(state.index+1);
    state.advance = setTimeout(() => {
      state.advance = null;
      if (state.phase !== "playing") return;
      if (state.index === dkdStages.length-1) { winGame(); return; }
      state.index++;
      beginStage();
    },800);
  }

  function overlay(kind,reason="") {
    state.down = false;
    el.button.classList.remove("is-pressed");
    el.button.disabled = true;
    el.scene.classList.remove("is-green");
    el.overlay.hidden = false;
    if (kind==="win") {
      el.overlayTag.textContent = "ASCENSION PROTOCOL COMPLETE";
      el.overlayTitle.innerHTML = 'OYUNU<br><em>BİTİRDİN!</em>';
      el.overlayText.textContent = "Tebrikler! " + dkdStages.length + " denemenin hepsini tamamladın. Başından tekrar denemek ister misin?";
      el.overlayStats.innerHTML = "<span>30 / 30</span><span>🏆 ZAFER</span><span>" + state.wins + ". ZAFER</span>";
      el.start.innerHTML = "YENİDEN OYNA <span>↻</span>";
    } else {
      el.overlayTag.textContent = "SYSTEM FAILURE • TEST " + String(state.index+1).padStart(2,"0");
      el.overlayTitle.innerHTML = 'YANLIŞ<br><em>KARAR.</em>';
      el.overlayText.textContent = reason + " Bir hata ve oyun başa döner. Bu kez daha dikkatli ol.";
      el.overlayStats.innerHTML = "<span>SEVİYE " + (state.index+1) + "</span><span>REKOR " + state.best + "</span><span>" + dkdStages.length + " GÖREV</span>";
      el.start.innerHTML = "TEKRAR DENE <span>↻</span>";
    }
    el.start.focus({preventScroll:true});
  }

  function fail(reason="Talimatı yeniden kontrol et.") {
    if (state.phase!=="playing" || state.transitioning) return;
    state.phase = "failed";
    state.transitioning = true;
    state.down = false;
    el.scene.classList.add("error-flash");
    tone("error");
    if (navigator.vibrate) navigator.vibrate([80,50,130]);
    setLive("Yanlış cevap. " + reason);
    overlay("fail",reason);
  }

  function winGame() {
    state.phase = "won";
    state.wins++;
    dkdStorage.save("dkd_quiz_wins_v1",state.wins);
    el.progress.style.width = "100%";
    el.percent.textContent = "100%";
    tone("win");
    overlay("win");
    setLive("Tebrikler! Tüm seviyeleri tamamladın.");
  }

  function isGreen(seconds) {
    // The green window is intentionally generous, repeats every four seconds.
    const tick = seconds % 4;
    return tick >= 2 && tick < 3.25;
  }

  function registerTap() {
    if (state.phase!=="playing" || state.transitioning) return;
    const stage = current(), seconds = elapsed();
    if (stage.kind==="wait") return fail("Bu görevde düğmeye hiç dokunmamalıydın.");
    if (stage.kind==="half" && seconds < stage.limit/2) return fail("Sayaç henüz yarıya inmemişti.");
    if (stage.kind==="green" && !isGreen(seconds)) return fail("Kırmızı ışıkta bastın.");
    if (stage.kind==="delay" && seconds < stage.delay) return fail("Önce beklemen gerekiyordu.");
    if (stage.kind==="quick" && seconds > stage.deadline) return fail("Çok geç bastın.");
    if (stage.kind==="window" && (seconds < stage.from || seconds >= stage.until)) return fail("Doğru zaman aralığını kaçırdın.");
    if (stage.kind==="rhythm" && state.presses > 0) {
      const gap = performance.now() - state.lastTapAt;
      if (gap < stage.minGap) return fail("Ritmi fazla hızlandırdın.");
      if (gap > stage.maxGap) return fail("Ritmi bozdun, çok uzun bekledin.");
    }
    state.lastTapAt = performance.now();
    state.presses++;
    el.count.textContent = "BASMA: " + state.presses + " / " + stage.goal;
    if (state.presses >= stage.goal) completeStage();
  }

  function pressDown(pointer) {
    if (state.phase!=="playing" || state.transitioning || state.down) return;
    state.down = true;
    state.pointer = pointer;
    state.downAt = performance.now();
    el.button.classList.add("is-pressed");
    tone("tap");
    const stage = current();
    if (stage.kind==="wait") fail("Bu görevde beklemen gerekiyordu.");
  }

  function pressUp(pointer,cancelled=false) {
    if (!state.down || state.pointer !== pointer) return;
    const timeHeld = (performance.now() - state.downAt)/1000;
    state.down = false; state.pointer = null;
    el.button.classList.remove("is-pressed");
    if (state.phase!=="playing" || state.transitioning) return;
    if (cancelled) return fail("Düğmeyi bırakma işlemi tamamlanmadı.");
    const stage = current();
    if (stage.kind==="hold") {
      if (timeHeld < stage.seconds) return fail("Düğmeyi erken bıraktın.");
      if (timeHeld > 8) return fail("Düğmeyi fazla uzun tuttun.");
      return completeStage();
    }
    registerTap();
  }

  el.button.addEventListener("pointerdown",(event) => {
    if (event.pointerType==="mouse" && event.button !== 0) return;
    event.preventDefault();
    try { el.button.setPointerCapture(event.pointerId); } catch {}
    pressDown(event.pointerId);
  });
  el.button.addEventListener("pointerup",(event) => {
    event.preventDefault();
    pressUp(event.pointerId);
  });
  el.button.addEventListener("pointercancel",(event) => pressUp(event.pointerId,true));
  el.button.addEventListener("contextmenu",(event)=>event.preventDefault());

  document.addEventListener("keydown",(event) => {
    if (!["Space","Enter"].includes(event.code) || event.repeat || state.phase!=="playing") return;
    if (!el.helpDialog.hidden || (event.target instanceof HTMLElement && event.target.closest("button:not(#dkdPress)"))) return;
    event.preventDefault();
    pressDown("keyboard");
  });
  document.addEventListener("keyup",(event) => {
    if (["Space","Enter"].includes(event.code) && state.pointer==="keyboard") {
      event.preventDefault();
      pressUp("keyboard");
    }
  });
  window.addEventListener("blur",() => {
    if (state.down && state.pointer==="keyboard") pressUp("keyboard",true);
  });

  function frame(now) {
    requestAnimationFrame(frame);
    if (state.phase!=="playing" || state.transitioning || state.pausedAt || document.hidden) return;
    const stage = current();
    const seconds = elapsed(now);
    const remaining = Math.max(0,stage.limit-seconds);
    const rounded = Math.ceil(remaining*10);
    if (rounded !== state.lastTime) {
      state.lastTime = rounded;
      el.timer.textContent = remaining.toFixed(1) + "s";
      el.timer.classList.toggle("urgent",remaining<3);
    }
    if (stage.kind==="green") el.scene.classList.toggle("is-green",isGreen(seconds));
    if (stage.kind==="hold" && state.down) {
      const held = (now-state.downAt)/1000;
      el.count.textContent = "BASILI TUT: " + held.toFixed(1) + " / " + stage.seconds.toFixed(1) + "s";
      el.button.classList.toggle("hold-ready",held>=stage.seconds);
    } else el.button.classList.remove("hold-ready");
    if (stage.kind==="rhythm" && state.presses>0 && state.presses<stage.goal && now-state.lastTapAt>stage.maxGap) {
      fail("Ritim için çok uzun bekledin.");
      return;
    }
    if (stage.kind==="wait" && seconds>=stage.seconds) {
      completeStage();
      return;
    }
    if (remaining<=0) fail("Süren doldu.");
  }

  const pause = () => { if (state.phase==="playing" && !state.pausedAt) state.pausedAt=performance.now(); };
  const resume = () => {
    if (!state.pausedAt) return;
    const lost = performance.now()-state.pausedAt;
    state.startedAt+=lost;
    if (state.down) state.downAt+=lost;
    state.lastTapAt+=lost;
    state.pausedAt=0;
  };

  el.start.addEventListener("click",startGame);
  el.sound.addEventListener("click",()=>{
    state.muted=!state.muted;
    dkdStorage.save("dkd_quiz_muted_v1",state.muted);
    el.sound.textContent=state.muted ? "♫̸" : "♪";
    el.sound.setAttribute("aria-pressed",String(!state.muted));
    el.sound.setAttribute("aria-label",state.muted ? "Sesi aç" : "Sesi kapat");
    if (!state.muted) tone("success");
  });
  el.fullscreen.addEventListener("click",async()=>{
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setMessage("Bu tarayıcı tam ekran modunu desteklemiyor."); }
  });
  const closeHelp = () => {
    el.helpDialog.hidden=true;
    resume();
    if (state.phase==="playing") el.button.focus({preventScroll:true});
    else el.start.focus({preventScroll:true});
  };
  el.help.addEventListener("click",()=>{
    pause(); el.helpDialog.hidden=false;
    el.helpClose.focus({preventScroll:true});
  });
  el.helpClose.addEventListener("click",closeHelp);
  el.helpResume.addEventListener("click",closeHelp);
  document.addEventListener("keydown",(event)=>{
    if (event.key==="Escape" && !el.helpDialog.hidden) closeHelp();
  });
  document.addEventListener("visibilitychange",()=>{
    if (document.hidden) pause();
    else if (el.helpDialog.hidden) resume();
  });

  dkdId("dkdYear").textContent=String(new Date().getFullYear());
  el.sound.textContent=state.muted ? "♫̸" : "♪";
  el.sound.setAttribute("aria-pressed",String(!state.muted));
  updateBest(state.best);
  el.button.disabled=true;
  requestAnimationFrame(frame);

  // Lightweight regression hooks for developers' automated browsers.
  // Deliberately read-only: no cheat or level-skip functionality is exposed.
  Object.defineProperty(window,"DraBornQuizInfo",{value:Object.freeze({
    version:"1.0.0", stages:dkdStages.length, name:"DraBornQuiz — Pressure Chamber"
  }),configurable:false});
})();