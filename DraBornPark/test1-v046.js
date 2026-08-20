/* DraBornPark Test1 v0.4.7 — isolated, production-safe demo micro-app. */
(function(){
  const raw=new URLSearchParams(location.search).get('tag')||'';
  const clean=raw.toUpperCase().replace(/^DP-/,'').replace(/[^A-Z0-9]/g,'');
  if(clean!=='TEST1') return;

  const CATEGORIES=[
    {key:'blocking_exit',tone:'cyan',label:'PARK / GEÇİŞ',title:'Aracınız çıkışımı engelliyor',body:'Araç sahibinden aracını güvenli biçimde hareket ettirmesi istenir.',priority:'normal'},
    {key:'move_vehicle',tone:'blue',label:'KISA İSTEK',title:'Aracınızı hareket ettirebilir misiniz?',body:'Telefon numarası paylaşmadan kısa hareket ettirme isteği gönderilir.',priority:'normal'},
    {key:'lights_on',tone:'yellow',label:'ARAÇ UYARISI',title:'Farlarınız açık olabilir',body:'Akü boşalmasını önlemek için araç sahibine hızlı uyarı iletilir.',priority:'normal'},
    {key:'window_open',tone:'aqua',label:'GÜVENLİK',title:'Camınız açık olabilir',body:'Açık görünen cam için gizlilik korumalı bildirim oluşturulur.',priority:'normal'},
    {key:'door_open',tone:'orange',label:'YÜKSEK ÖNCELİK',title:'Kapınız açık olabilir',body:'Kapının açık görünmesi nedeniyle yüksek öncelikli uyarı iletilir.',priority:'high'},
    {key:'damage',tone:'pink',label:'YÜKSEK ÖNCELİK',title:'Aracınıza zarar verilmiş olabilir',body:'Olası hasar fark edildiğinde araç sahibine hızlı bilgi verilir.',priority:'high'},
    {key:'child',tone:'red',label:'ACİL DURUM',title:'Araçta çocuk var',body:'Araç sahibine acil öncelikli bildirim gösterilir. Gerçek acilde resmi acil servisler aranmalıdır.',priority:'emergency'},
    {key:'animal',tone:'red',label:'ACİL DURUM',title:'Araçta hayvan var',body:'Araç sahibine acil öncelikli bildirim gösterilir. Gerçek acilde resmi acil servisler aranmalıdır.',priority:'emergency'},
    {key:'witness',tone:'purple',label:'TANIK',title:'Bir olaya şahit oldum',body:'Gördüğünüz olayı kişisel iletişim bilgisi vermeden araç sahibine aktarabilirsiniz.',priority:'high'},
    {key:'other',tone:'blue',label:'MESAJ',title:'Başka bir mesaj',body:'Listede olmayan bir durum için kısa ve güvenli açıklama gönderebilirsiniz.',priority:'normal'}
  ];

  const ICON={
    blocking_exit:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 27h28l-4-10H14z"/><path d="M14 17l3-6h14l3 6M13 27v7m22-7v7M16 34h16"/><circle cx="17" cy="28" r="3"/><circle cx="31" cy="28" r="3"/><path d="M4 21h7m-4-4-4 4 4 4M44 21h-7m4-4 4 4-4 4"/></svg>',
    move_vehicle:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 28h25l-4-10H13z"/><path d="M13 18l3-6h11l3 6M12 28v7m18-7v7"/><circle cx="15" cy="29" r="3"/><circle cx="27" cy="29" r="3"/><path d="M30 11h13m-5-5 5 5-5 5"/></svg>',
    lights_on:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 12h12c8 0 13 5 13 12s-5 12-13 12H9z"/><path d="M18 13v22M38 14l6-3m-6 10h7m-7 7 7 3m-7 6 6 3"/></svg>',
    window_open:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 7h26v34H11zM15 12h18v14H15zM15 31h18"/><path d="M24 12v14m3-7 5-5m0 0v6m0-6h-6"/></svg>',
    door_open:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 6h19v36H9zM14 11h10v26H14zM28 15l12-7v33l-12-8z"/><circle cx="21" cy="24" r="1.8"/></svg>',
    damage:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 30h34l-5-12H13z"/><path d="M13 18l4-7h14l4 7M11 30v7m26-7v7"/><circle cx="16" cy="31" r="3"/><circle cx="32" cy="31" r="3"/><path d="m26 5-6 14 7-2-4 9 7-2-8 17 2-12-7 2 5-11-7 2z"/></svg>',
    child:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="11" r="6"/><path d="M14 41V28c0-7 4-11 10-11s10 4 10 11v13M18 27l-5 10m17-10 5 10M20 41V30m8 11V30"/><path d="M19 22h10v7H19z"/></svg>',
    animal:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="14" cy="13" r="5"/><circle cx="34" cy="13" r="5"/><circle cx="9" cy="25" r="4"/><circle cx="39" cy="25" r="4"/><path d="M24 19c8 0 13 10 13 16 0 5-5 8-13 8s-13-3-13-8c0-6 5-16 13-16Z"/><path d="M20 34c3-2 5-2 8 0"/></svg>',
    witness:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 24S12 11 24 11s20 13 20 13-8 13-20 13S4 24 4 24Z"/><circle cx="24" cy="24" r="8"/><circle cx="24" cy="24" r="3"/><path d="M37 7v8m-4-4h8"/></svg>',
    other:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 8h34v25H20L10 41v-8H7z"/><path d="M14 16h20M14 23h14"/><circle cx="34" cy="27" r="2"/></svg>'
  };

  const CAR='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M9 36h46l-6-16H15z"/><path d="M16 20l5-9h22l5 9M14 36v10m36-10v10M18 46h28"/><circle cx="21" cy="37" r="5"/><circle cx="43" cy="37" r="5"/><path d="M20 20h24"/></svg>';
  const SHIELD='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 39 10v11c0 11-6 18-15 23C15 39 9 32 9 21V10z"/><path d="m17 24 5 5 10-11"/></svg>';
  const LOCK='<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="21" width="28" height="21" rx="7"/><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v6"/></svg>';

  let selectedKey=null;
  let messages=[];
  const time=()=>new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function cardMarkup(c){return `<button class="dbp47-choice tone-${c.tone}" type="button" data-key="${c.key}" aria-pressed="false">
    <span class="dbp47-choice-rail"></span>
    <span class="dbp47-choice-top"><span class="dbp47-icon">${ICON[c.key]}</span><span class="dbp47-select-hint"><i></i> DOKUN • SEÇ</span></span>
    <span class="dbp47-priority">${c.label}</span>
    <strong>${esc(c.title)}</strong><small>${esc(c.body)}</small>
    <span class="dbp47-selected-label">SEÇİLDİ <b>✓</b></span>
  </button>`}

  function shellMarkup(){return `<div class="dbp47-app">
    <div class="dbp47-ambient dbp47-a1"></div><div class="dbp47-ambient dbp47-a2"></div>
    <header class="dbp47-top"><a href="./" class="dbp47-brand"><span class="dbp47-brandmark">DP</span><span><b>DraBornPark</b><small>GÜVENLİ ARAÇ İLETİŞİMİ</small></span></a><span class="dbp47-demo"><i></i> TEST1 • DEMO</span></header>

    <section class="dbp47-vehicle">
      <div class="dbp47-vehicle-main"><div class="dbp47-car">${CAR}<span></span></div><div class="dbp47-vehicle-copy"><span class="dbp47-kicker">DRABORNPARK KORUMALI ARAÇ</span><h1>Volkswagen Tiguan</h1><p><b>06 DBP 2026</b><i>•</i>Gece Mavisi</p></div></div>
      <div class="dbp47-vehicle-status"><span>${SHIELD}<b>KORUMALI</b></span><span class="dbp47-tag">TAG • TEST1</span></div>
    </section>

    <section class="dbp47-privacy"><span class="dbp47-lock">${LOCK}</span><div><span class="dbp47-kicker">GİZLİLİK AKTİF</span><h2>Telefon numarası gizlidir.</h2><p>Telefon, e-posta ve açık kimlik bilgileri gösterilmez. Bildiriminiz DraBornPark üzerinden güvenli biçimde iletilir.</p></div></section>

    <section class="dbp47-demo-note"><b>Bu bir güvenli Test1 demosudur.</b><span>Seçim ve mesajlar gerçek araç sahibine gönderilmez, üretim verisine yazılmaz.</span></section>

    <section class="dbp47-flow"><div class="is-current"><b>1</b><span>Durumu seç</span></div><i></i><div><b>2</b><span>Kısa açıklama</span></div><i></i><div><b>3</b><span>Güvenli gönder</span></div></section>

    <section id="dbp47-choose" class="dbp47-section"><div class="dbp47-heading"><span class="dbp47-kicker">1 • BİLDİRİM TÜRÜ</span><h2>Ne bildirmek istiyorsunuz?</h2><p>Aşağıdaki renkli kartlardan birine dokunun. Seçtiğiniz kart belirgin biçimde işaretlenir.</p></div><div class="dbp47-grid">${CATEGORIES.map(cardMarkup).join('')}</div></section>

    <section id="dbp47-compose" class="dbp47-compose" hidden>
      <div class="dbp47-compose-head"><div><span class="dbp47-kicker">2 • SEÇİLEN BİLDİRİM</span><h2 id="dbp47-selected-title"></h2><p id="dbp47-selected-body"></p></div><button id="dbp47-change" type="button">DEĞİŞTİR</button></div>
      <label for="dbp47-message">İsteğe bağlı kısa açıklama</label><textarea id="dbp47-message" maxlength="500" placeholder="Örn. Sağ ön cam yaklaşık 2 cm açık görünüyor…"></textarea>
      <div class="dbp47-safe-row"><span>${LOCK}</span><p>Kişisel telefon/e-posta yazmanız gerekmez. Gerçek sistem hassas içerikleri güvenlik filtresinden geçirir.</p></div>
      <button id="dbp47-send" class="dbp47-send" type="button"><span>${SHIELD}</span><div><b>ARAÇ SAHİBİNE GÜVENLİ GÖNDER</b><small>Test1 demosunda gerçek bildirim gönderilmez</small></div><em>→</em></button>
    </section>

    <section id="dbp47-success" class="dbp47-success" hidden>
      <div class="dbp47-success-icon">${SHIELD}</div><span class="dbp47-kicker">3 • DEMO TAMAMLANDI</span><h2>Bildirim güvenli şekilde hazırlandı.</h2><p>Gerçek DraBornPark etiketinde bu noktada araç sahibine push bildirimi gider ve kişisel telefon numaraları paylaşılmadan geçici iletişim açılır.</p><div class="dbp47-demo-banner"><b>TEST1:</b> Bu demo hiçbir gerçek kullanıcıya bildirim göndermedi.</div>
      <div class="dbp47-chat"><div class="dbp47-chat-head"><div><b>Geçici anonim iletişim</b><small>Demo konuşması</small></div><span><i></i> AÇIK</span></div><div id="dbp47-messages" class="dbp47-messages"></div><div class="dbp47-chat-input"><input id="dbp47-chat-input" maxlength="300" placeholder="Kısa bir cevap yaz…"><button id="dbp47-chat-send" type="button">GÖNDER</button></div></div>
      <button id="dbp47-again" class="dbp47-again" type="button">← BAŞKA BİR DURUMU DENE</button>
    </section>

    <footer class="dbp47-footer"><span>DraBornPark • DrabornEagle</span><nav><a href="./privacy/">Gizlilik</a><a href="./data-safety/">Veri Güvenliği</a><a href="./support/">Destek</a></nav></footer>
  </div>`}

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
  function reset(){selectedKey=null;messages=[];document.getElementById('dbp47-success').hidden=true;document.getElementById('dbp47-compose').hidden=true;document.getElementById('dbp47-choose').hidden=false;document.getElementById('dbp47-message').value='';document.querySelectorAll('.dbp47-choice').forEach(btn=>{btn.classList.remove('is-selected');btn.setAttribute('aria-pressed','false');});syncFlow(1);window.scrollTo({top:0,behavior:'smooth'});}

  document.addEventListener('DOMContentLoaded',()=>{
    document.body.classList.add('test1-v047');document.getElementById('landing')?.classList.add('hidden');const shell=document.getElementById('tag-shell');if(!shell)return;shell.classList.remove('hidden');shell.innerHTML=shellMarkup();
    document.querySelectorAll('.dbp47-choice').forEach(btn=>btn.addEventListener('click',()=>select(btn.dataset.key)));
    document.getElementById('dbp47-change')?.addEventListener('click',()=>{document.getElementById('dbp47-choose').scrollIntoView({behavior:'smooth',block:'start'});syncFlow(1)});
    document.getElementById('dbp47-send')?.addEventListener('click',send);document.getElementById('dbp47-chat-send')?.addEventListener('click',chat);document.getElementById('dbp47-chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();chat();}});document.getElementById('dbp47-again')?.addEventListener('click',reset);
  });
})();
