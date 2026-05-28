
(function () {
  'use strict';

  const dkd_base_path = '/AnyelaBorn/';
  const dkd_image_base = dkd_base_path + 'assets/images/';
  const dkd_root = document.getElementById('dkd_root');

  const dkd_routes = [
    { dkd_key: 'home', dkd_label: 'Ana Sayfa', dkd_path: dkd_base_path, dkd_icon: '⌂' },
    { dkd_key: 'chat', dkd_label: 'Sohbet', dkd_path: dkd_base_path + 'chat/', dkd_icon: '◌' },
    { dkd_key: 'packages', dkd_label: 'Paketler', dkd_path: dkd_base_path + 'packages/', dkd_icon: '▣' },
    { dkd_key: 'ads', dkd_label: 'Reklam', dkd_path: dkd_base_path + 'ads/', dkd_icon: '◢' },
    { dkd_key: 'payment', dkd_label: 'Başla', dkd_path: dkd_base_path + 'payment/', dkd_icon: '✦' },
  ];

  const dkd_pages = ['packages','chat','voice','custom','ads','payment','faq'];

  const dkd_package_groups = [
    {
      dkd_title: 'Fan Paketleri',
      dkd_icon: '♡',
      dkd_items: [
        { dkd_name: 'Anyela Intro', dkd_desc: 'Anyela ile tanışmanın en özel yolu.', dkd_price: '259 TL', dkd_tone: 'rose', dkd_icon: '💬', dkd_badge: 'Önerilen' },
        { dkd_name: 'Private Chat', dkd_desc: 'Anyela ile özel yazılı sohbet.', dkd_price: '599 TL', dkd_tone: 'violet', dkd_icon: '🔐' },
        { dkd_name: 'Voice Message', dkd_desc: 'Kişiye özel sesli mesaj.', dkd_price: '349 TL', dkd_tone: 'cyan', dkd_icon: '〰️' },
        { dkd_name: 'Voice Chat Private', dkd_desc: 'Sesli mesajlaşma deneyimi.', dkd_price: '1.199 TL', dkd_tone: 'rose', dkd_icon: '🎧' },
      ],
    },
    {
      dkd_title: 'Özel İçerik Paketleri',
      dkd_icon: '✧',
      dkd_items: [
        { dkd_name: 'Style Try-On', dkd_desc: 'İstediğin kıyafeti Anyela üzerinde gör.', dkd_price: '1.199 TL', dkd_tone: 'cyan', dkd_icon: '👗' },
        { dkd_name: 'Photo Set', dkd_desc: 'Konseptine özel profesyonel görsel seti.', dkd_price: '1.699 TL', dkd_tone: 'violet', dkd_icon: '🖼️' },
        { dkd_name: 'Talking Video', dkd_desc: 'Sana özel konuşan kısa video mesajı.', dkd_price: '1.999 TL', dkd_tone: 'rose', dkd_icon: '🎥' },
        { dkd_name: 'VIP Fan Pack', dkd_desc: 'En kapsamlı hayran deneyimi.', dkd_price: '1.499 TL', dkd_tone: 'gold', dkd_icon: '👑', dkd_badge: 'Önerilen' },
      ],
    },
    {
      dkd_title: 'İşletme Paketleri',
      dkd_icon: '▣',
      dkd_items: [
        { dkd_name: 'Reklam Mini', dkd_desc: 'Küçük işletmeler için hızlı başlangıç.', dkd_price: '2.990 TL', dkd_tone: 'emerald', dkd_icon: '📣' },
        { dkd_name: 'Reklam Standart', dkd_desc: 'Daha geniş kitleye profesyonel erişim.', dkd_price: '5.990 TL', dkd_tone: 'violet', dkd_icon: '📈' },
        { dkd_name: 'Reklam Pro', dkd_desc: 'Maksimum görünürlük ve etki.', dkd_price: '9.990 TL', dkd_tone: 'rose', dkd_icon: '🚀', dkd_badge: 'Popüler' },
        { dkd_name: 'Marka Yüzü', dkd_desc: 'Anyela markanızın AI yüzü olsun.', dkd_price: '19.990 TL', dkd_tone: 'gold', dkd_icon: '💎', dkd_badge: 'Önerilen' },
      ],
    },
  ];

  const dkd_service_cards = [
    { dkd_title: 'Yazılı Sohbet', dkd_desc: 'Anyela Born ile özel yazış.', dkd_icon: '💬', dkd_link: 'chat', dkd_tone: 'cyan' },
    { dkd_title: 'Sesli Mesaj', dkd_desc: 'Kişiye özel sesli yanıtlar al.', dkd_icon: '〰️', dkd_link: 'voice', dkd_tone: 'violet' },
    { dkd_title: 'Özel Görsel / Video', dkd_desc: 'Sana özel görsel ve videolar iste.', dkd_icon: '🖼️', dkd_link: 'custom', dkd_tone: 'rose' },
    { dkd_title: 'Anyela Reklam Yüzünüz Olsun', dkd_desc: 'Markan için Anyela Born ile iş birliği yap.', dkd_icon: '👑', dkd_link: 'ads', dkd_tone: 'gold' },
  ];

  function dkd_get_page_key() {
    const dkd_pathname = window.location.pathname;
    const dkd_after_base = dkd_pathname.split('/AnyelaBorn/')[1] || '';
    const dkd_segment = dkd_after_base.split('/').filter(Boolean)[0] || 'home';
    return dkd_pages.includes(dkd_segment) ? dkd_segment : 'home';
  }

  function dkd_go(dkd_path) {
    window.history.pushState({}, '', dkd_path);
    dkd_render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function dkd_link(dkd_path, dkd_text, dkd_class_name) {
    return `<button class="${dkd_class_name}" data-dkd-route="${dkd_path}">${dkd_text}</button>`;
  }

  function dkd_header() {
    return `
      <header class="dkd-header">
        <button class="dkd-brand" data-dkd-route="${dkd_base_path}" aria-label="Anyela Born Club ana sayfa">
          <span class="dkd-logo-mark">AB</span>
          <span class="dkd-brand-text">Anyela Born Club</span>
        </button>
        <button class="dkd-menu-button" aria-label="Menü">☰</button>
      </header>`;
  }

  function dkd_bottom_nav(dkd_current) {
    return `<nav class="dkd-bottom-nav" aria-label="Alt menü">
      ${dkd_routes.map((dkd_route) => `<button class="dkd-bottom-item ${dkd_current === dkd_route.dkd_key ? 'dkd-active' : ''}" data-dkd-route="${dkd_route.dkd_path}"><span>${dkd_route.dkd_icon}</span><small>${dkd_route.dkd_label}</small></button>`).join('')}
    </nav>`;
  }

  function dkd_trust_row() {
    const dkd_trust_items = [
      ['🤖', 'AI karakter'], ['18+', '18+'], ['🛡️', 'Manuel ödeme onayı'], ['🔒', 'Gizli içerik'],
    ];
    return `<section class="dkd-trust-row">${dkd_trust_items.map((dkd_item) => `<div class="dkd-trust-pill"><b>${dkd_item[0]}</b><span>${dkd_item[1]}</span></div>`).join('')}</section>`;
  }

  function dkd_steps(dkd_title, dkd_items) {
    return `<section class="dkd-panel dkd-steps-panel"><h2>${dkd_title}</h2><div class="dkd-steps-grid">${dkd_items.map((dkd_item, dkd_index) => `<article class="dkd-step-card"><strong>${dkd_index + 1}</strong><i>${dkd_item.dkd_icon}</i><h3>${dkd_item.dkd_title}</h3><p>${dkd_item.dkd_desc}</p></article>`).join('')}</div></section>`;
  }

  function dkd_service_grid() {
    return `<section class="dkd-service-grid">${dkd_service_cards.map((dkd_card) => `<button class="dkd-service-card dkd-tone-${dkd_card.dkd_tone}" data-dkd-route="${dkd_base_path + dkd_card.dkd_link + '/'}"><span>${dkd_card.dkd_icon}</span><div><h3>${dkd_card.dkd_title}</h3><p>${dkd_card.dkd_desc}</p></div><em>→</em></button>`).join('')}</section>`;
  }

  function dkd_package_card(dkd_item) {
    return `<article class="dkd-package-card dkd-tone-${dkd_item.dkd_tone}">${dkd_item.dkd_badge ? `<mark>${dkd_item.dkd_badge}</mark>` : ''}<i>${dkd_item.dkd_icon}</i><h3>${dkd_item.dkd_name}</h3><p>${dkd_item.dkd_desc}</p><strong>${dkd_item.dkd_price}</strong>${dkd_link(dkd_base_path + 'payment/', 'Paketi Seç →', 'dkd-small-cta')}</article>`;
  }

  function dkd_home_page() {
    return `
      <main class="dkd-page dkd-home-page">
        <section class="dkd-hero">
          <div class="dkd-hero-copy">
            <div class="dkd-spark">✦</div>
            <h1>Anyela Born ile <span>özel AI karakter deneyimi</span></h1>
            <p>Anyela Born ile yazış, sesli yanıtlar al, özel görsel / video iste, markan için iş birlikleri planla.</p>
            <div class="dkd-hero-actions">
              ${dkd_link(dkd_base_path + 'payment/', '✦ Deneyimi Başlat', 'dkd-primary-cta')}
              ${dkd_link(dkd_base_path + 'packages/', '▣ Paketleri İncele', 'dkd-secondary-cta')}
            </div>
            <button class="dkd-gold-link" data-dkd-route="${dkd_base_path + 'ads/'}">Markam İçin Reklam →</button>
          </div>
          <figure class="dkd-hero-image-card">
            <img src="${dkd_image_base}8751.png" alt="Anyela Born" />
            <figcaption>Anyela Born ♡</figcaption>
          </figure>
        </section>
        ${dkd_trust_row()}
        ${dkd_steps('✨ Nasıl Çalışır?', [
          { dkd_icon: '🛍️', dkd_title: 'Paket seç', dkd_desc: 'İhtiyacına uygun paketi seç.' },
          { dkd_icon: '💳', dkd_title: 'Ödemeyi yap', dkd_desc: 'Güvenli ödeme yöntemini seç.' },
          { dkd_icon: '📤', dkd_title: 'Dekont gönder', dkd_desc: 'Ödeme dekontunu bize ilet.' },
          { dkd_icon: '✨', dkd_title: 'Deneyim başlasın', dkd_desc: 'Onay sonrası Anyela Born seninle.' },
        ])}
        ${dkd_service_grid()}
        <section class="dkd-final-cta"><span>👑</span><div><h2>Anyela Born ile benzersiz bir bağ kur.</h2><p>Özel içerikler, kişisel ilgi ve ayrıcalıklı deneyimler seni bekliyor.</p></div>${dkd_link(dkd_base_path + 'payment/', '✦ Hemen Başla →', 'dkd-primary-cta')}</section>
      </main>`;
  }

  function dkd_packages_page() {
    return `<main class="dkd-page"><section class="dkd-page-title"><h1>Paketler</h1><p>En özel deneyimi seçmek için doğru yerdesin.</p></section>${dkd_package_groups.map((dkd_group) => `<section class="dkd-package-group"><h2><span>${dkd_group.dkd_icon}</span>${dkd_group.dkd_title}</h2><div class="dkd-package-grid">${dkd_group.dkd_items.map(dkd_package_card).join('')}</div></section>`).join('')}</main>`;
  }

  function dkd_chat_page() {
    return `<main class="dkd-page dkd-chat-page"><section class="dkd-page-title dkd-split-title"><div><h1>Sohbet</h1><p><span>Anyela ile yazılı deneyim</span></p></div><img src="${dkd_image_base}8889.png" alt="Anyela profil" /></section><section class="dkd-info-banner"><i>💬</i><div><h3>Bu bir ön izleme demo deneyimidir.</h3><p>Gerçek sohbete başlamak için bir paket satın almanız gerekir.</p></div></section><section class="dkd-chat-panel"><div class="dkd-message dkd-anyela"><img src="${dkd_image_base}8889.png" alt="Anyela"/><div><b>Anyela Born ✓</b><p>Merhaba! 💜<br/>Ben Anyela. Bugün nasılsın? Seninle sohbet etmek harika olur.</p><small>14:32</small></div></div><div class="dkd-message dkd-user"><p>Merhaba Anyela! İyiyim, sen nasılsın? Bugün enerjin harika görünüyor ✨</p><small>14:33 ✓✓</small></div><div class="dkd-message dkd-anyela"><img src="${dkd_image_base}8889.png" alt="Anyela"/><div><p>Teşekkür ederim, tatlısın 💫 Seninle konuşmak da günümü güzelleştiriyor.</p><small>14:34</small></div></div><div class="dkd-message dkd-user"><p>Şu an dinleniyorum, müzik dinliyorum. Senin yeni içeriğini de izledim 😍</p><small>14:35 ✓✓</small></div><div class="dkd-chat-input"><span>Mesajını yaz...</span><b>☺</b><button>➤</button></div></section>${dkd_steps('', [{dkd_icon:'🛍️',dkd_title:'Paket seç',dkd_desc:'Sohbet paketini seç ve satın al.'},{dkd_icon:'🛡️',dkd_title:'Ödeme onayı',dkd_desc:'Ödemen onaylansın, erişimin aktif olsun.'},{dkd_icon:'💬',dkd_title:'Sohbet başlar',dkd_desc:'Anyela ile yazılı sohbete başla.'}])}<section class="dkd-info-banner"><i>ℹ</i><div><h3>İlk sürüm bilgisi</h3><p>Sohbet deneyimi şu an manuel veya yarı otomatik yanıt desteği ile sunulmaktadır.</p></div></section><section class="dkd-final-cta"><span>♡</span><div><h2>Gerçek sohbete başlamak için uygun paketi seç.</h2></div>${dkd_link(dkd_base_path + 'packages/', 'Sohbet Paketlerini Gör →', 'dkd-primary-cta')}</section></main>`;
  }

  function dkd_voice_page() {
    return `<main class="dkd-page"><section class="dkd-voice-hero"><div><small>〰️</small><h1>Sesli Mesaj</h1><p>Sesini gönder, Anyela’nın sesiyle özel bir yanıt al.</p></div><img src="${dkd_image_base}8624.png" alt="Anyela sesli mesaj"/></section><section class="dkd-wave-card"><div class="dkd-wave-line"></div><b>🎙️</b><p><strong>Konuş, paylaş, bağ kur.</strong><br/>Anyela seni dinliyor.</p></section>${dkd_steps('✨ Sesli Deneyim Nasıl Çalışır?', [{dkd_icon:'🛍️',dkd_title:'Paketi seç',dkd_desc:'İhtiyacına uygun paketi seç.'},{dkd_icon:'🎙️',dkd_title:'Sesli mesaj gönder',dkd_desc:'Kendini ifade et, mesajını gönder.'},{dkd_icon:'🪄',dkd_title:'Anyela hazırlar',dkd_desc:'Anyela mesajını dinler ve hazırlar.'},{dkd_icon:'〰️',dkd_title:'Sesli yanıt teslim edilir',dkd_desc:'Özel sesli yanıtın sana ulaşır.'}])}<section class="dkd-package-group"><h2>🎁 Sesli Mesaj Paketleri</h2><div class="dkd-package-grid dkd-three-grid">${[
      {dkd_name:'Voice Intro',dkd_desc:'Kısa ve tatlı bir sesli yanıt deneyimi.',dkd_price:'349 TL',dkd_tone:'cyan',dkd_icon:'★'},
      {dkd_name:'Voice Chat Private',dkd_desc:'Daha uzun ve kişisel sesli yanıt.',dkd_price:'699 TL',dkd_tone:'rose',dkd_icon:'♡',dkd_badge:'Popüler'},
      {dkd_name:'Voice VIP',dkd_desc:'En özel, detaylı ve premium sesli deneyim.',dkd_price:'1.299 TL',dkd_tone:'gold',dkd_icon:'👑'},
    ].map(dkd_package_card).join('')}</div></section><section class="dkd-info-banner"><i>🛡️</i><div><h3>%100 gizli ve güvenli</h3><p>Bu deneyim özel ve kişiseldir. Anyela Born AI karakter sesidir.</p></div><span>Gizlilik Korunur</span></section></main>`;
  }

  function dkd_custom_page() {
    return `<main class="dkd-page"><section class="dkd-page-title"><h1>Özel İçerik</h1><p>Hayal ettiğin konsept, kıyafet, mood veya fikri gönder; Anyela sana özel benzersiz görseller ve videolar hazırlasın.</p></section><section class="dkd-custom-hero"><div><h2>Sen hayal et,<br/>Anyela <span>gerçeğe dönüştürsün.</span></h2><p>Konseptini yükle, detayları belirt, gerisini Anyela’ya bırak.</p><div class="dkd-upload-mini">☁️ <b>Görsel, video veya referans yükle</b><small>PNG, JPG, MP4 • Maks. 50MB</small></div></div><div class="dkd-collage"><img src="${dkd_image_base}8584.png"/><img src="${dkd_image_base}8622.png"/><img src="${dkd_image_base}8581.png"/><img src="${dkd_image_base}8585.png"/></div></section><section class="dkd-package-group"><h2>👑 Özel İçerik Seçenekleri</h2><div class="dkd-package-grid">${[
      {dkd_name:'Style Try-On',dkd_desc:'İstediğin kıyafeti Anyela üzerinde gör.',dkd_price:'1.199 TL',dkd_tone:'cyan',dkd_icon:'👗'},
      {dkd_name:'Photo Set',dkd_desc:'Konseptine özel 4-8 adet profesyonel görsel seti.',dkd_price:'1.699 TL',dkd_tone:'violet',dkd_icon:'🖼️'},
      {dkd_name:'Talking Video',dkd_desc:'Anyela’dan sana özel konuşan video mesajı.',dkd_price:'1.999 TL',dkd_tone:'rose',dkd_icon:'〰️'},
      {dkd_name:'Birthday / Special Message',dkd_desc:'Özel günlerin için kişisel video mesaj.',dkd_price:'1.499 TL',dkd_tone:'gold',dkd_icon:'🎂'},
    ].map(dkd_package_card).join('')}</div></section><section class="dkd-form-panel"><h2>☁ Kıyafet veya fikir yükle</h2><p>Referans görsel, mood board, konsept veya kısa açıklama ekle.</p><div class="dkd-upload-area">＋ <span>Dosya seç veya buraya sürükle</span><small>PNG, JPG, MP4 • Maks. 50MB</small></div><label class="dkd-text-field">💬 <span>Fikrini, konseptini veya özel isteklerini yaz...</span><em>0/500</em></label>${dkd_link(dkd_base_path + 'payment/', '✦ Özel İçerik İste →', 'dkd-primary-cta dkd-full')}</section></main>`;
  }

  function dkd_ads_page() {
    const dkd_ad_packages = [
      ['Reklam Mini','Küçük işletmeler için hızlı başlangıç.','2.990 TL','cyan','▶'],
      ['Reklam Standart','Daha fazla içerik, daha güçlü etki.','5.990 TL','violet','★'],
      ['Reklam Pro','Profesyonel kampanyalar için ideal paket.','9.990 TL','rose','👑'],
      ['Marka Yüzü','Anyela Born sizin markanızın yüzü olsun.','19.990 TL','gold','💎'],
    ];
    return `<main class="dkd-page"><section class="dkd-ads-hero"><div><h1>Reklam</h1><h2>Anyela Born markanızın AI reklam yüzü olsun</h2><p>Yapay zekâ ile oluşturulan özel içeriklerle markanızı öne çıkarın, daha fazla kişiye ulaşın.</p></div><figure><img src="${dkd_image_base}8751.png"/><figcaption>+128% Erişim • +73% Satış Artışı</figcaption></figure></section><section class="dkd-chip-row">${['Restoran','Kafe','Butik','Güzellik','Otel','Emlak'].map((dkd_chip)=>`<span>${dkd_chip}</span>`).join('')}</section><section class="dkd-package-grid dkd-ad-grid">${dkd_ad_packages.map((dkd_item)=>dkd_package_card({dkd_name:dkd_item[0],dkd_desc:dkd_item[1],dkd_price:dkd_item[2],dkd_tone:dkd_item[3],dkd_icon:dkd_item[4],dkd_badge: dkd_item[0] === 'Reklam Pro' ? 'Popüler' : ''})).join('')}</section><section class="dkd-form-panel"><h2>✨ Hızlı Teklif Formu</h2>${['Marka Adı','Sektör','Hedef','Bütçe'].map((dkd_field)=>`<label class="dkd-text-field"><b>${dkd_field}</b><span>${dkd_field === 'Marka Adı' ? 'Örn: Born Coffee' : 'Seçiniz'}</span><em>⌄</em></label>`).join('')}${dkd_link(dkd_base_path + 'payment/', 'Teklif Talebini Gönder →', 'dkd-primary-cta dkd-full')}</section><section class="dkd-info-banner"><i>🛡️</i><div><h3>Güvenli & Şeffaf</h3><p>Tüm reklam içeriklerinde reklam etiketi kullanılır. Yasal düzenlemelere uygun, şeffaf iş ortaklığı.</p></div><span>#Reklam ✓</span></section></main>`;
  }

  function dkd_payment_page() {
    return `<main class="dkd-page"><section class="dkd-page-title"><h1>Ödeme ve Başlangıç</h1><p>Paketi seçtin, şimdi ödemenı tamamla ve Anyela Born deneyimine başla.</p></section><section class="dkd-payment-flow">${[
      ['1. Seçilen Paket','👑','Premium Deneyim Paketi','30 Gün • Tüm Özelliklere Erişim','₺999'],
      ['2. IBAN’a Ödeme Yapın','🏦','ANYELA BORN MEDYA','TR12 0006 7010 0000 0098 7654 32','YAPI VE KREDİ BANKASI'],
      ['3. Açıklama (Ödeme Notu)','🔖','Ödeme yaparken açıklama kısmına aşağıdaki kodu yazmayı unutmayın.','ABP-7543-29XK','Kodu yazmazsanız ödemeniz onaylanmayabilir.'],
      ['4. Dekontunuzu Gönderin','☁️','Dekont yüklemek için dokunun','JPG, PNG veya PDF • Maks. 10 MB','Dekont Gönder'],
      ['5. Onay sonrası ne olacak?','🛡️','Ödemeniz kontrol edilir ve onaylanır.','Hesabınıza erişim sağlanır.','Özel içerikler sizi bekliyor.'],
    ].map((dkd_step, dkd_index)=>`<article class="dkd-payment-card dkd-payment-${dkd_index + 1}"><strong>${dkd_index + 1}.</strong><h2>${dkd_step[0]}</h2><div><i>${dkd_step[1]}</i><p><b>${dkd_step[2]}</b><span>${dkd_step[3]}</span><em>${dkd_step[4]}</em></p></div>${dkd_index === 3 ? dkd_link(dkd_base_path + 'chat/', '➤ Dekont Gönder', 'dkd-primary-cta dkd-full') : ''}</article>`).join('')}</section></main>`;
  }

  function dkd_faq_page() {
    const dkd_questions = ['Anyela gerçek kişi mi?','Ödeme nasıl yapılıyor?','Sohbet gerçek zamanlı mı?','Sesli yanıt nasıl geliyor?','İade var mı?','Gönderdiğim görseller saklanıyor mu?'];
    return `<main class="dkd-page"><section class="dkd-page-title dkd-faq-title"><div><h1>SSS ve Kurallar</h1><p>Güven, ödeme, gizlilik ve deneyim kurallarımız hakkında en çok sorulan sorular.</p></div><span>♡</span></section><section class="dkd-panel"><h2>✨ Güveniniz bizim için önemli ✨</h2><div class="dkd-trust-large"><div>🤖<b>AI karakter</b><p>Gelişmiş yapay zeka karakter deneyimi.</p></div><div>18+<b>18+ içerik</b><p>Yetişkinlere özel içerik ve sohbet.</p></div><div>🔒<b>Gizlilik</b><p>Verileriniz gizli kalır.</p></div><div>✓<b>Manuel onay</b><p>Ödemeler manuel onaylanır.</p></div></div></section><section class="dkd-faq-list"><h2>? Sık Sorulan Sorular</h2>${dkd_questions.map((dkd_question)=>`<button><span>✦</span>${dkd_question}<em>⌄</em></button>`).join('')}</section><section class="dkd-final-cta"><span>💬</span><div><h2>Hâlâ sorunuz mu var?</h2><p>Ekibimiz size hızlıca yardımcı olmaktan mutluluk duyar.</p></div>${dkd_link(dkd_base_path + 'chat/', '🎧 Destek Al →', 'dkd-primary-cta')}</section></main>`;
  }

  function dkd_page_content(dkd_current) {
    if (dkd_current === 'packages') return dkd_packages_page();
    if (dkd_current === 'chat') return dkd_chat_page();
    if (dkd_current === 'voice') return dkd_voice_page();
    if (dkd_current === 'custom') return dkd_custom_page();
    if (dkd_current === 'ads') return dkd_ads_page();
    if (dkd_current === 'payment') return dkd_payment_page();
    if (dkd_current === 'faq') return dkd_faq_page();
    return dkd_home_page();
  }

  function dkd_bind_navigation() {
    document.querySelectorAll('[data-dkd-route]').forEach((dkd_node) => {
      dkd_node.addEventListener('click', (dkd_event) => {
        const dkd_target = dkd_event.currentTarget.getAttribute('data-dkd-route');
        if (dkd_target) dkd_go(dkd_target);
      });
    });
  }

  function dkd_render() {
    const dkd_current = dkd_get_page_key();
    dkd_root.innerHTML = `${dkd_header()}${dkd_page_content(dkd_current)}${dkd_bottom_nav(dkd_current)}`;
    dkd_bind_navigation();
  }

  window.addEventListener('popstate', dkd_render);
  dkd_render();
})();
