/* DraBornPS v0.6 — project catalog. Only confirmed public destinations. */
DKD.projectSelection="draborngo";
DKD.projects=[
  {
    "id": "draborngo",
    "title": "DraBornGo",
    "theme": "go",
    "mark": "GO",
    "eyebrow": "ŞEHRİN HAREKETİ",
    "subtitle": "Kurye, işletme ve müşteri operasyonlarını tek akışta buluşturan teslimat ekosistemi.",
    "description": "Sipariş havuzu, canlı rota, ödeme akışı, kurye durumu ve işletme operasyonlarını tek merkezde birleştiren DraBornEagle teslimat platformu.",
    "web": "https://www.draborneagle.com/draborngo/",
    "play": "",
    "status": "Web",
    "rows": [
      "Sipariş havuzu",
      "Canlı rota",
      "Kurye & işletme"
    ],
    "image": "assets/projects/dkd-go-v06.webp"
  },
  {
    "id": "drabornpark",
    "title": "DraBornPark",
    "theme": "park",
    "mark": "PARK",
    "eyebrow": "GÜVENLİ ARAÇ İLETİŞİMİ",
    "subtitle": "Telefon numarası paylaşmadan araç sahibiyle güvenli iletişim kur.",
    "description": "Aracındaki NFC veya QR etiketini okutan kişiler, telefon numaranı görmeden sana ulaşsın. Bildirimleri, araç bilgilerini ve iletişim akışını tek yerden yönet.",
    "web": "https://www.draborneagle.com/DraBornPark/",
    "play": "https://play.google.com/store/apps/details?id=com.draborneagle.drabornpark",
    "status": "Google Play",
    "rows": [
      "NFC / QR etiket",
      "Gizli numara",
      "Hızlı bildirim"
    ],
    "image": "assets/projects/dkd-park-v06.webp"
  },
  {
    "id": "drabornsea",
    "title": "DraBornSea",
    "theme": "sea",
    "mark": "SEA",
    "eyebrow": "ROTANI DENİZE ÇEVİR",
    "subtitle": "Antalya tekne turlarını, rotaları ve boş koltukları tek ekranda keşfet.",
    "description": "Kalkış limanı, saat, koylar, yemek/içecek bilgisi, canlı boş koltuk ve rezervasyon akışıyla deniz turlarını karşılaştıran platform.",
    "web": "",
    "play": "",
    "status": "Geliştiriliyor",
    "rows": [
      "Antalya koyları",
      "Tur karşılaştırma",
      "Rezervasyon"
    ],
    "image": "assets/projects/dkd-sea-v06.webp"
  },
  {
    "id": "draborngate",
    "title": "DraBornGate",
    "theme": "gate",
    "mark": "GATE",
    "eyebrow": "AKILLI GEÇİŞ DENEYİMİ",
    "subtitle": "Site girişlerini AirPass ve geçiş kodlarıyla hızlı, kontrollü ve kayıtlı yönet.",
    "description": "Kurye, sakin, güvenlik ve ziyaretçi akışlarını; kapı bazlı kurallar, GPS yakınlık ve yedek kod sistemiyle yöneten geçiş platformu.",
    "web": "https://www.draborneagle.com/DraBornGate/",
    "play": "",
    "status": "Web",
    "rows": [
      "AirPass",
      "Ziyaretçi kodu",
      "Güvenlik paneli"
    ],
    "image": "assets/projects/dkd-gate-v06.webp"
  },
  {
    "id": "drabornodds",
    "title": "DraBornOdds",
    "theme": "odds",
    "mark": "ODDS",
    "eyebrow": "VERİYLE OYUNU OKU",
    "subtitle": "Maç verilerini risk profiline göre analiz et ve açıklamalı kupon önerileri oluştur.",
    "description": "Maç sayısı, bütçe ve risk tercihlerine göre analizleri incele. Seçim nedenlerini ve risk özetini gör. Öneriler tahmindir; kazanma garantisi içermez.",
    "web": "https://www.draborneagle.com/DraBornOdds/",
    "play": "",
    "status": "Web",
    "rows": [
      "Maç analizi",
      "Risk profili",
      "Açıklamalı öneriler"
    ],
    "image": "assets/projects/dkd-odds-v06.webp"
  },
  {
    "id": "drabornportal",
    "title": "DraBornPortal",
    "theme": "portal",
    "mark": "TR",
    "eyebrow": "OYUNUN DİLİNİ DEĞİŞTİR",
    "subtitle": "Oyundaki metni yakala, bağlamı koruyarak Türkçeye çevir ve tam ekranda incele.",
    "description": "Oyun ekranlarını bağlama uygun Türkçe çeviriyle incele. Görsel üstündeki metni tam ekranda yakınlaştır; düz metin çevirilere de kolayca ulaş.",
    "web": "https://www.draborneagle.com/DraBornPortal/",
    "play": "",
    "status": "Web",
    "rows": [
      "Ekran çevirisi",
      "Türkçe metin",
      "Tam ekran & zoom"
    ],
    "android": "https://www.draborneagle.com/DraBornPortal/App/",
    "image": "assets/projects/dkd-portal-v06.webp"
  }
];
DKD.project = dkdId => DKD.projects.find(dkdProject => dkdProject.id === dkdId);
DKD.projectTile = dkdProject => `<span class="project-tile-art"><img src="${dkdProject.image}" alt="" width="1536" height="1024" decoding="async"><span class="project-tile-mark">${dkdProject.mark}</span></span><span class="tile-label">${dkdProject.title}</span>`;
DKD.projectMockup = dkdProject => `<figure class="project-showcase"><img src="${dkdProject.image}" alt="${dkdProject.title} uygulamasının projeye özel telefon mockup görseli" width="1536" height="1024" fetchpriority="high" decoding="async"><figcaption>Uygulama konsepti</figcaption></figure>`;
DKD.projectsView = function dkdProjectsView() {
 const dkdProject = DKD.project(DKD.projectSelection) || DKD.projects[0];
 const dkdProjectNumber = DKD.projects.indexOf(dkdProject) + 1;
 return `<nav class="project-rail" aria-label="DraBornEagle Projects">${DKD.projects.map(dkdItem => `<button class="project-tile ${dkdItem.theme} ${dkdItem.id === dkdProject.id ? 'selected' : ''}" data-action="project-select" data-id="${dkdItem.id}" aria-label="${dkdItem.title}" aria-pressed="${dkdItem.id === dkdProject.id}">${DKD.projectTile(dkdItem)}</button>`).join('')}</nav>
 <div class="projects-body">
  <section class="project-feature project-feature-${dkdProject.theme}" aria-labelledby="dkd-project-title">
   <div class="project-copy">
    <div class="project-kicker"><span>${dkdProject.eyebrow}</span><span class="project-status">${dkdProject.status}</span></div>
    <h1 id="dkd-project-title">${dkdProject.title}</h1>
    <p class="project-subtitle">${dkdProject.subtitle}</p>
    <p class="project-description">${dkdProject.description}</p>
    <ul class="project-features" aria-label="Proje özellikleri">${dkdProject.rows.map(dkdFeature => `<li>${dkdFeature}</li>`).join('')}</ul>
    <div class="project-actions">
     ${dkdProject.web ? `<a class="pill primary" href="${dkdProject.web}" target="_blank" rel="noopener noreferrer" aria-label="${dkdProject.title} web sitesini aç">Web Sitesini Aç ${DKD.icon('arrow')}</a>` : ''}
     ${dkdProject.play ? `<a class="pill project-play" href="${dkdProject.play}" target="_blank" rel="noopener noreferrer" aria-label="${dkdProject.title} Google Play sayfasını aç">${DKD.icon('store')} Google Play</a>` : ''}
     ${dkdProject.android ? `<a class="pill project-play" href="${dkdProject.android}" target="_blank" rel="noopener noreferrer" aria-label="${dkdProject.title} Android indirme sayfasını aç">${DKD.icon('download')} Android APK</a>` : ''}
     ${!dkdProject.web && !dkdProject.play ? '<span class="project-coming">Web deneyimi yakında</span>' : ''}
    </div>
   </div>
   ${DKD.projectMockup(dkdProject)}
  </section>
  <div class="project-strip"><span>DrabornEagle Ecosystem</span><strong>${String(dkdProjectNumber).padStart(2,'0')} / ${String(DKD.projects.length).padStart(2,'0')}</strong><span>Web · Android</span></div>
 </div>`;
};
