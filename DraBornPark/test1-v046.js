/* DraBornPark Test1 v0.4.9 — all Test1 icons use raster assets taken from the user-provided reference screenshot. */
(function(){
  const raw=new URLSearchParams(location.search).get('tag')||'';
  const clean=raw.toUpperCase().replace(/^DP-/,'').replace(/[^A-Z0-9]/g,'');
  if(clean!=='TEST1') return;

  const CATEGORIES=[
    {key:'blocking_exit',tone:'cyan',icon:'blocking',label:'PARK / GEÇİŞ',title:'Aracınız çıkışımı engelliyor',body:'Araç sahibinden aracını güvenli biçimde hareket ettirmesi istenir.'},
    {key:'move_vehicle',tone:'blue',icon:'blocking',label:'KISA İSTEK',title:'Aracınızı hareket ettirebilir misiniz?',body:'Telefon numarası paylaşmadan kısa hareket ettirme isteği gönderilir.'},
    {key:'lights_on',tone:'yellow',icon:'lights',label:'ARAÇ UYARISI',title:'Farlarınız açık olabilir',body:'Akü boşalmasını önlemek için araç sahibine hızlı uyarı iletilir.'},
    {key:'window_open',tone:'aqua',icon:'window',label:'GÜVENLİK',title:'Camınız açık olabilir',body:'Açık görünen cam için gizlilik korumalı bildirim oluşturulur.'},
    {key:'door_open',tone:'orange',icon:'window',label:'YÜKSEK ÖNCELİK',title:'Kapınız açık olabilir',body:'Kapının açık görünmesi nedeniyle yüksek öncelikli uyarı iletilir.'},
    {key:'damage',tone:'pink',icon:'damage',label:'YÜKSEK ÖNCELİK',title:'Aracınıza zarar verilmiş olabilir',body:'Olası hasar fark edildiğinde araç sahibine hızlı bilgi verilir.'},
    {key:'child',tone:'red',icon:'child',label:'ACİL DURUM',title:'Araçta çocuk var',body:'Araç sahibine acil öncelikli bildirim gösterilir. Gerçek acilde resmi acil servisler aranmalıdır.'},
    {key:'animal',tone:'red',icon:'animal',label:'ACİL DURUM',title:'Araçta hayvan var',body:'Araç sahibine acil öncelikli bildirim gösterilir. Gerçek acilde resmi acil servisler aranmalıdır.'},
    {key:'witness',tone:'purple',icon:'witness',label:'TANIK',title:'Bir olaya şahit oldum',body:'Gördüğünüz olayı kişisel iletişim bilgisi vermeden araç sahibine aktarabilirsiniz.'},
    {key:'other',tone:'blue',icon:'other',label:'MESAJ',title:'Başka bir mesaj',body:'Listede olmayan bir durum için kısa ve güvenli açıklama gönderebilirsiniz.'}
  ];

  const CAR='<span class="dbp48-raster dbp48-i-blocking dbp49-car-raster" aria-hidden="true"></span>';
  const SECURITY='<img class="dbp49-security-raster" src="./assets/test1-privacy-icon-v049.webp" alt="" aria-hidden="true">';

  let selectedKey=null;
  let messages=[];
  const time=()=>new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function cardMarkup(c){return `<button class="dbp47-choice tone-${c.tone}" type="button" data-key="${c.key}" aria-pressed="false">
    <span class="dbp47-choice-rail"></span>
    <span class="dbp47-choice-top"><span class="dbp47-icon"><span class="dbp48-raster dbp48-i-${c.icon}" aria-hidden="true"></span></span><span class="dbp47-select-hint"><i></i> DOKUN • SEÇ</span></span>
    <span class="dbp47-priority">${c.label}</span>
    <strong>${esc(c.title)}</strong><small>${esc(c.body)}</small>
    <span class="dbp47-selected-label">SEÇİLDİ <b>✓</b></span>
  </button>`}

  function shellMarkup(){return `<div class="dbp47-app">
    <div class="dbp47-ambient dbp47-a1"></div><div class="dbp47-ambient dbp47-a2"></div>
    <header class="dbp47-top"><a href="./" class="dbp47-brand"><span class="dbp47-brandmark">DP</span><span><b>DraBornPark</b><small>GÜVENLİ ARAÇ İLETİŞİMİ</small></span></a><span class="dbp47-demo"><i></i> TEST1 • DEMO</span></header>
    <section class="dbp47-vehicle">
      <div class="dbp47-vehicle-main"><div class="dbp47-car">${CAR}<span></span></div><div class="dbp47-vehicle-copy"><span class="dbp47-kicker">DRABORNPARK KORUMALI ARAÇ</span><h1>Volkswagen Tiguan</h1><p><b>06 DBP 2026</b><i>•</i>Gece Mavisi</p></div></div>
      <div class="dbp47-vehicle-status"><span>${SECURITY}<b>KORUMALI</b></span><span class="dbp47-tag">TAG • TEST1</span></div>
    </section>
    <section class="dbp47-privacy"><span class="dbp47-lock">${SECURITY}</span><div><span class="dbp47-kicker">GİZLİLİK AKTİF</span><h2>Telefon numarası gizlidir.</h2><p>Telefon, e-posta ve açık kimlik bilgileri gösterilmez. Bildiriminiz DraBornPark üzerinden güvenli biçimde iletilir.</p></div></section>
    <section class="dbp47-demo-note"><b>Bu bir güvenli Test1 demosudur.</b><span>Seçim ve mesajlar gerçek araç sahibine gönderilmez, üretim verisine yazılmaz.</span></section>
    <section class="dbp47-flow"><div class="is-current"><b>1</b><span>Durumu seç</span></div><i></i><div><b>2</b><span>Kısa açıklama</span></div><i></i><div><b>3</b><span>Güvenli gönder</span></div></section>
    <section id="dbp47-choose" class="dbp47-section"><div class="dbp47-heading"><span class="dbp47-kicker">1 • BİLDİRİM TÜRÜ</span><h2>Ne bildirmek istiyorsunuz?</h2><p>Aşağıdaki renkli kartlardan birine dokunun. Seçtiğiniz kart belirgin biçimde işaretlenir.</p></div><div class="dbp47-grid">${CATEGORIES.map(cardMarkup).join('')}</div></section>
    <section id="dbp47-compose" class="dbp47-compose" hidden>
      <div class="dbp47-compose-head"><div><span class="dbp47-kicker">2 • SEÇİLEN BİLDİRİM</span><h2 id="dbp47-selected-title"></h2><p id="dbp47-selected-body"></p></div><button id="dbp47-change" type="button">DEĞİŞTİR</button></div>
      <label for="dbp47-message">İsteğe bağlı kısa açıklama</label><textarea id="dbp47-message" maxlength="500" placeholder="Örn. Sağ ön cam yaklaşık 2 cm açık görünüyor…"></textarea>
      <div class="dbp47-safe-row"><span>${SECURITY}</span><p>Kişisel telefon/e-posta yazmanız gerekmez. Gerçek sistem hassas içerikleri güvenlik filtresinden geçirir.</p></div>
      <button id="dbp47-send" class="dbp47-send" type="button"><span>${SECURITY}</span><div><b>ARAÇ SAHİBİNE GÜVENLİ GÖNDER</b><small>Test1 demosunda gerçek bildirim gönderilmez</small></div><em>→</em></button>
    </section>
    <section id="dbp47-success" class="dbp47-success" hidden>
      <div class="dbp47-success-icon">${SECURITY}</div><span class="dbp47-kicker">3 • DEMO TAMAMLANDI</span><h2>Bildirim güvenli şekilde hazırlandı.</h2><p>Gerçek DraBornPark etiketinde bu noktada araç sahibine push bildirimi gider ve kişisel telefon numaraları paylaşılmadan geçici iletişim açılır.</p><div class="dbp47-demo-banner"><b>TEST1:</b> Bu demo hiçbir gerçek kullanıcıya bildirim göndermedi.</div>
      <div class="dbp47-chat"><div class="dbp47-chat-head"><div><b>Geçici anonim iletişim</b><small>Demo konuşması</small></div><span><i></i> AÇIK</span></div><div id="dbp47-messages" class="dbp47-messages"></div><div class="dbp47-chat-input"><input id="dbp47-chat-input" maxlength="300" placeholder="Kısa bir cevap yaz…"><button id="dbp47-chat-send" type="button">GÖNDER</button></div></div>
      <button id="dbp47-again" class="dbp47-again" type="button">← BAŞKA BİR DURUMU DENE</button>
    </section>
    <footer class="dbp47-footer"><span>DraBornPark • DrabornEagle</span><nav><a href="./privacy/">Gizlilik</a><a href="./data-safety/">Veri Güvenliği</a><a href="./support/">Destek</a></nav></footer>
  </div>`}

  function installRasterIcons(){
    if(document.getElementById('dbp48-raster-icons'))return;
    const style=document.createElement('style');
    style.id='dbp48-raster-icons';
    style.textContent=`
      .dbp47-icon{padding:0!important;border:0!important;background:transparent!important;overflow:hidden!important}
      .dbp48-raster{display:block;width:54px;height:54px;border-radius:18px;background-image:url('./assets/test1-icons-v048.webp');background-repeat:no-repeat;background-size:216px 108px}
      .dbp48-i-blocking{background-position:0 0}
      .dbp48-i-lights{background-position:-54px 0}
      .dbp48-i-window{background-position:-108px 0}
      .dbp48-i-damage{background-position:-162px 0}
      .dbp48-i-child{background-position:0 -54px}
      .dbp48-i-animal{background-position:-54px -54px}
      .dbp48-i-witness{background-position:-108px -54px}
      .dbp48-i-other{background-position:-162px -54px}
      .dbp47-choice.is-selected .dbp48-raster{transform:scale(1.04)}
      .dbp49-security-raster{display:block;width:30px;height:30px;object-fit:cover;border-radius:10px}
      .dbp49-car-raster{width:54px;height:54px;border-radius:18px}
    `;
    document.head.appendChild(style);
  }

  function syncFlow(step){document.querySelectorAll('.dbp47-flow div').forEach((x,i)=>x.classList.toggle('is-current',i===step-1));}
  function select(key){
    selectedKey=key;const c=CATEGORIES.find(x=>x.key===key);if(!c)return;
    document.querySelectorAll('.dbp47-choice').forEach(btn=>{const active=btn.dataset.key===key;btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));const hint=btn.querySelector('.dbp47-select-hint');if(hint)hint.lastChild.textContent=active?' SEÇİLDİ':' DOKUN • SEÇ';});
    document.getElementById('dbp47-selected-title').textContent=c.title;document.getElementById('dbp47-selected-body').textContent=c.body;
    const compose=document.getElementById('dbp47-compose');compose.hidden=false;syncFlow(2);setTimeout(()=>compose.scrollIntoView({behavior:'smooth',block:'center'}),80);
  }
  function renderMessages(){const box=document.getElementById('dbp47-messages');if(!box)return;box.innerHTML=messages.map(m=>`<div class="dbp47-bubble ${m.owner?'is-owner':'is-visitor'}"><span>${m.owner?'ARAÇ SAHİBİ':'SİZ'}</span><p>${esc(m.text)}</p><small>${m.at}</small></div>`).join('');box.scrollTop=box.scrollHeight;}
  function send(){const c=CATEGORIES.find(x=>x.key===selectedKey);if(!c)return;const extra=document.getElementById('dbp47-message').value.trim();messages=[{owner:false,text:`${c.title}${extra?` — ${extra}`:''}`,at:time()}];document.getElementById('dbp47-choose').hidden=true;document.getElementById('dbp47-compose').hidden=true;document.getElementById('dbp47-success').hidden=false;syncFlow(3);renderMessages();document.getElementById('dbp47-success').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>{messages.push({owner:true,text:'5 dakika içinde geliyorum. Teşekkür ederim.',at:time()});renderMessages();},950);}
  function chat(){const input=document.getElementById('dbp47-chat-input');const text=input.value.trim();if(!text)return;messages.push({owner:false,text,at:time()});input.value='';renderMessages();setTimeout(()=>{messages.push({owner:true,text:'Mesajınızı gördüm, teşekkür ederim.',at:time()});renderMessages();},700);}
  function reset(){selectedKey=null;messages=[];document.getElementById('dbp47-success').hidden=true;document.getElementById('dbp47-compose').hidden=true;document.getElementById('dbp47-choose').hidden=false;document.getElementById('dbp47-message').value='';document.querySelectorAll('.dbp47-choice').forEach(btn=>{btn.classList.remove('is-selected');btn.setAttribute('aria-pressed','false');const hint=btn.querySelector('.dbp47-select-hint');if(hint)hint.lastChild.textContent=' DOKUN • SEÇ';});syncFlow(1);window.scrollTo({top:0,behavior:'smooth'});}

  document.addEventListener('DOMContentLoaded',()=>{
    installRasterIcons();
    document.body.classList.add('test1-v047','test1-v048');
    document.getElementById('landing')?.classList.add('hidden');
    const shell=document.getElementById('tag-shell');if(!shell)return;
    shell.classList.remove('hidden');shell.innerHTML=shellMarkup();
    document.querySelectorAll('.dbp47-choice').forEach(btn=>btn.addEventListener('click',()=>select(btn.dataset.key)));
    document.getElementById('dbp47-change')?.addEventListener('click',()=>{document.getElementById('dbp47-choose').scrollIntoView({behavior:'smooth',block:'start'});syncFlow(1)});
    document.getElementById('dbp47-send')?.addEventListener('click',send);
    document.getElementById('dbp47-chat-send')?.addEventListener('click',chat);
    document.getElementById('dbp47-chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();chat();}});
    document.getElementById('dbp47-again')?.addEventListener('click',reset);
  });
})();