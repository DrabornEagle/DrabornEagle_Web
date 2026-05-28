
(() => {
  const h = React.createElement;
  const IMG = '/AnyelaBorn/assets/images/';

  const dkd_images = {
    hero: IMG + 'dkd_anyela_yacht_gold_close.jpg',
    yachtFull: IMG + 'dkd_anyela_yacht_gold_full.jpg',
    yachtGreen: IMG + 'dkd_anyela_yacht_green.jpg',
    yachtNavy: IMG + 'dkd_anyela_yacht_navy.jpg',
    carBurgundy: IMG + 'dkd_anyela_car_burgundy.jpg',
    lamboBlack: IMG + 'dkd_anyela_lambo_black.jpg',
    poolWhite: IMG + 'dkd_anyela_pool_white.jpg',
    gallery: IMG + 'dkd_anyela_yacht_gallery.jpg',
  };

  const dkd_routes = [
    { key: 'home', href: '/AnyelaBorn/', label: 'Ana Sayfa', icon: 'fa-house' },
    { key: 'chat', href: '/AnyelaBorn/chat/', label: 'Sohbet', icon: 'fa-comments' },
    { key: 'packages', href: '/AnyelaBorn/packages/', label: 'Paketler', icon: 'fa-gift' },
    { key: 'ads', href: '/AnyelaBorn/ads/', label: 'Reklam', icon: 'fa-bullhorn' },
    { key: 'payment', href: '/AnyelaBorn/payment/', label: 'Başla', icon: 'fa-rocket' },
  ];

  const dkd_fanPackages = [
    { title: 'Anyela Intro', detail: 'Kısa tanışma ve kişisel video selamı.', price: '₺299', icon: 'fa-comment-dots', tone: 'violet' },
    { title: 'Private Chat', detail: '30 dakika boyunca özel yazılı sohbet.', price: '₺1.199', icon: 'fa-comments', tone: 'rose', badge: 'En Popüler' },
    { title: 'Voice Message', detail: 'Kişiye özel sesli mesajın Anyela’dan.', price: '₺399', icon: 'fa-wave-square', tone: 'blue' },
    { title: 'Voice Chat Private', detail: '15 dakika özel sesli mesajlaşma.', price: '₺1.699', icon: 'fa-phone', tone: 'teal' },
    { title: 'Style Try-On', detail: 'Anyela senin için kıyafet konsepti denesin.', price: '₺799', icon: 'fa-shirt', tone: 'orange' },
    { title: 'Photo Set', detail: '5 adet kişiye özel fotoğraf seti.', price: '₺649', icon: 'fa-image', tone: 'violet' },
    { title: 'Talking Video', detail: 'Kişiye özel kısa konuşma videosu.', price: '₺849', icon: 'fa-video', tone: 'blue' },
  ];

  const dkd_brandPackages = [
    { title: 'Reklam Mini', detail: 'Story paylaşımı ve hızlı görünürlük.', price: '₺4.999 /ay', icon: 'fa-bullhorn', tone: 'violet' },
    { title: 'Reklam Standart', detail: 'Story + Feed paylaşımı ve rapor.', price: '₺9.999 /ay', icon: 'fa-bullhorn', tone: 'blue' },
    { title: 'Reklam Pro', detail: 'Story + Feed + Reels kampanyası.', price: '₺19.999 /ay', icon: 'fa-crown', tone: 'gold' },
  ];

  function DkdIcon({ name, className = '' }) {
    return h('i', { className: `fa-solid ${name} ${className}`, 'aria-hidden': 'true' });
  }

  function DkdBrand() {
    return h('a', { className: 'dkd-brand', href: '/AnyelaBorn/' },
      h('span', { className: 'dkd-brand-mark' }, 'AB'),
      h('span', { className: 'dkd-brand-text' }, 'Anyela Born Club')
    );
  }

  function DkdHeader({ back = false }) {
    return h('header', { className: 'dkd-header' },
      h('div', { className: 'dkd-header-inner' },
        back ? h('a', { className: 'dkd-back', href: '/AnyelaBorn/' }, DkdIcon({ name: 'fa-chevron-left' })) : null,
        DkdBrand(),
        h('div', { className: 'dkd-header-actions' },
          h('button', { className: 'dkd-menu', 'aria-label': 'Menü' }, DkdIcon({ name: 'fa-bars' })),
          h('a', { className: 'dkd-login', href: '/AnyelaBorn/payment/' }, 'Giriş Yap')
        )
      )
    );
  }

  function DkdBottomNav({ active }) {
    return h('nav', { className: 'dkd-bottom-nav', 'aria-label': 'Mobil menü' },
      dkd_routes.map(route => h('a', { key: route.key, href: route.href, className: `dkd-bottom-item ${active === route.key ? 'dkd-active' : ''}` },
        DkdIcon({ name: route.icon }),
        h('span', null, route.label)
      ))
    );
  }

  function DkdPage({ active, children, back = false }) {
    return h(React.Fragment, null,
      DkdHeader({ back }),
      h('main', { className: 'dkd-main' }, children),
      DkdBottomNav({ active })
    );
  }

  function DkdPill({ icon, children, tone = '' }) {
    return h('span', { className: `dkd-pill ${tone}` }, icon ? DkdIcon({ name: icon }) : null, children);
  }

  function DkdHeroPortrait({ image = dkd_images.hero, mode = 'default' }) {
    return h('div', { className: `dkd-portrait dkd-portrait-${mode}` },
      h('div', { className: 'dkd-portrait-ring' }),
      h('img', { src: image, alt: 'Anyela Born Club karakter görseli', loading: 'eager' }),
      h('div', { className: 'dkd-portrait-badge' },
        DkdIcon({ name: 'fa-shield-heart' }),
        h('strong', null, '%100 Gizlilik'),
        h('span', null, 'Güvenli ve özel süreç')
      )
    );
  }

  function DkdSectionTitle({ icon, title, sub }) {
    return h('div', { className: 'dkd-section-title' },
      h('h2', null, icon ? DkdIcon({ name: icon }) : null, title),
      sub ? h('p', null, sub) : null
    );
  }

  function DkdStepCard({ no, icon, title, text, tone }) {
    return h('article', { className: `dkd-step-card ${tone || ''}` },
      h('div', { className: 'dkd-step-icon' }, DkdIcon({ name: icon })),
      h('b', { className: 'dkd-step-no' }, no),
      h('h3', null, title),
      h('p', null, text)
    );
  }

  function DkdTrustRibbon() {
    const items = [
      ['fa-robot', 'AI karakter', 'Gerçekçi etkileşim'],
      ['fa-circle-18-plus', '18+ içerik', 'Yalnızca yetişkinler'],
      ['fa-lock', 'Gizli süreç', 'Tam gizlilik garantisi'],
      ['fa-shield-check', 'Manuel ödeme onayı', 'Her ödeme kontrol edilir'],
    ];
    return h('section', { className: 'dkd-trust-ribbon' },
      items.map((it, idx) => h('div', { key: it[1], className: 'dkd-trust-item' },
        h('span', { className: `dkd-trust-icon dkd-trust-${idx}` }, DkdIcon({ name: it[0] })),
        h('span', null, h('strong', null, it[1]), h('small', null, it[2]))
      ))
    );
  }

  function DkdFeatureCard({ image, icon, title, text, tone }) {
    return h('article', { className: `dkd-feature-card ${tone || ''}` },
      h('div', { className: 'dkd-feature-image' },
        h('img', { src: image, alt: title, loading: 'lazy' }),
        h('span', { className: 'dkd-feature-icon' }, DkdIcon({ name: icon }))
      ),
      h('h3', null, title),
      h('p', null, text)
    );
  }

  function DkdHomePage() {
    const steps = [
      ['1', 'fa-bag-shopping', 'Paket seç', 'İhtiyacına uygun paketi seç.', 'violet'],
      ['2', 'fa-credit-card', 'Ödeme yap', 'Banka havalesi ile ödemeni yap.', 'rose'],
      ['3', 'fa-file-arrow-up', 'Dekont gönder', 'Dekontunu sistem üzerinden ilet.', 'blue'],
      ['4', 'fa-rocket', 'Deneyimi başlat', 'Onay sonrası Anyela sadece seninle.', 'green'],
    ];
    return DkdPage({ active: 'home', children: h(React.Fragment, null,
      h('section', { className: 'dkd-hero' },
        h('div', { className: 'dkd-hero-copy' },
          DkdPill({ icon: 'fa-sparkles', children: 'Anyela Born • AI Influencer' }),
          h('h1', null, 'Anyela Born ile ', h('span', null, 'özel AI karakter'), ' deneyimine katıl'),
          h('p', null, 'Anyela, sizinle sohbet eden, sesli mesajlar gönderen, size özel görsel ve videolar hazırlayan sanal AI influencer’dır. Markanız için güçlü bir tanıtım yüzüdür.'),
          h('div', { className: 'dkd-hero-actions' },
            h('a', { className: 'dkd-btn dkd-btn-primary', href: '/AnyelaBorn/chat/' }, DkdIcon({ name: 'fa-comment-dots' }), h('span', null, 'Sohbete Başla', h('small', null, 'Hemen konuşmaya başla'))),
            h('a', { className: 'dkd-btn dkd-btn-secondary', href: '/AnyelaBorn/packages/' }, DkdIcon({ name: 'fa-gift' }), h('span', null, 'Paketleri Gör', h('small', null, 'Tüm paketleri incele')))
          )
        ),
        DkdHeroPortrait({ image: dkd_images.yachtGold || dkd_images.hero })
      ),
      DkdTrustRibbon(),
      DkdSectionTitle({ icon: 'fa-wand-magic-sparkles', title: 'Nasıl Çalışır?' }),
      h('section', { className: 'dkd-steps-grid' }, steps.map(step => DkdStepCard({ no: step[0], icon: step[1], title: step[2], text: step[3], tone: step[4] }))),
      DkdSectionTitle({ icon: 'fa-star', title: 'Öne Çıkan Deneyimler' }),
      h('section', { className: 'dkd-feature-grid' },
        DkdFeatureCard({ image: dkd_images.carBurgundy, icon: 'fa-comment-dots', title: 'Yazılı Sohbet', text: 'Anyela ile dilediğin zaman yazış, kendini özel hisset.', tone: 'violet' }),
        DkdFeatureCard({ image: dkd_images.lamboBlack, icon: 'fa-volume-high', title: 'Sesli Mesaj', text: 'Kişiye özel sesli mesajlar al, sesini her yerde hisset.', tone: 'rose' }),
        DkdFeatureCard({ image: dkd_images.yachtGreen, icon: 'fa-camera', title: 'Özel Görsel / Video', text: 'Sana özel görsel ve videolarla unutulmaz anlar yaşa.', tone: 'blue' }),
        DkdFeatureCard({ image: dkd_images.yachtNavy, icon: 'fa-bullhorn', title: 'Anyela Reklam Yüzünüz Olsun', text: 'Markanızı Anyela’nın gücüyle binlere ulaştırın.', tone: 'green' })
      ),
      h('section', { className: 'dkd-testimonial' },
        h('div', { className: 'dkd-quote' }, '“'),
        h('img', { src: dkd_images.poolWhite, alt: 'Anyela Born örnek görsel' }),
        h('div', null,
          h('div', { className: 'dkd-stars' }, '★★★★★'),
          h('p', null, 'Anyela deneyimi düzenli, net ve premium hissettiriyor. Paketler anlaşılır, süreç güvenli, teslimler kişiye özel.'),
          h('strong', null, 'Doğrulanmış Kullanıcı')
        ),
        h('aside', null, h('b', null, '4.9/5'), h('span', null, 'Kullanıcı Puanı'))
      )
    ) });
  }

  function DkdPackageCard({ item, size = 'normal' }) {
    return h('article', { className: `dkd-package-card ${item.tone || ''} ${item.badge ? 'dkd-popular' : ''} ${size}` },
      item.badge ? h('span', { className: 'dkd-badge' }, DkdIcon({ name: 'fa-star' }), item.badge) : null,
      h('div', { className: 'dkd-package-icon' }, DkdIcon({ name: item.icon })),
      h('h3', null, item.title),
      h('p', null, item.detail),
      h('strong', { className: 'dkd-price' }, item.price),
      h('a', { className: 'dkd-package-btn', href: '/AnyelaBorn/payment/' }, 'Paketi Seç')
    );
  }

  function DkdPackagesPage() {
    return DkdPage({ active: 'packages', back: true, children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-simple' },
        h('div', null, h('h1', null, 'Paketler'), h('p', null, 'Sana en uygun Anyela deneyimini seç. Her paket net, anlaşılır ve manuel onaylıdır.')),
        h('div', { className: 'dkd-mini-trust' }, DkdIcon({ name: 'fa-shield-check' }), h('strong', null, '%100 Gizlilik'), h('span', null, 'Güvenli ve özel süreç'))
      ),
      h('section', { className: 'dkd-tabs' },
        h('a', { className: 'dkd-tab dkd-tab-active', href: '#fan' }, DkdIcon({ name: 'fa-heart' }), 'Fan Paketleri'),
        h('a', { className: 'dkd-tab', href: '#content' }, DkdIcon({ name: 'fa-clapperboard' }), 'Özel İçerik'),
        h('a', { className: 'dkd-tab', href: '#brand' }, DkdIcon({ name: 'fa-bullhorn' }), 'Marka Paketleri')
      ),
      DkdSectionTitle({ icon: 'fa-sparkles', title: 'Fan Paketleri', sub: 'Anyela ile daha yakın ve özel deneyimler' }),
      h('section', { id: 'fan', className: 'dkd-packages-grid' }, dkd_fanPackages.map(pkg => DkdPackageCard({ item: pkg }))),
      DkdSectionTitle({ icon: 'fa-bullhorn', title: 'Marka Paketleri', sub: 'Markanızı Anyela ile binlere ulaştırın' }),
      h('section', { id: 'brand', className: 'dkd-brand-package-grid' }, dkd_brandPackages.map(pkg => DkdPackageCard({ item: pkg, size: 'brand' }))),
      h('section', { className: 'dkd-benefit-strip' },
        [['fa-shield-halved','Güvenli Ödeme','Manuel kontrol'], ['fa-shield-check','%100 Gizlilik','Gizli süreç'], ['fa-headset','7/24 Destek','Hızlı dönüş'], ['fa-bolt','Hızlı Teslimat','Net süreç']].map(row => h('div', { key: row[1] }, DkdIcon({ name: row[0] }), h('strong', null, row[1]), h('span', null, row[2])))
      )
    ) });
  }

  function DkdChatBubble({ from = 'user', children, time }) {
    return h('div', { className: `dkd-chat-row ${from}` },
      from === 'anyela' ? h('img', { className: 'dkd-chat-avatar', src: dkd_images.carBurgundy, alt: 'Anyela avatar' }) : null,
      h('div', { className: 'dkd-bubble' }, children, h('small', null, time, from === 'user' ? ' ✓✓' : ''))
    );
  }

  function DkdChatPage() {
    return DkdPage({ active: 'chat', children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-with-portrait' },
        h('div', null, DkdPill({ icon: 'fa-comments', children: 'Anyela Born • Sohbet' }), h('h1', null, 'Sohbet'), h('p', null, 'Anyela ile özel yazılı sohbet deneyimi')),
        DkdHeroPortrait({ image: dkd_images.hero, mode: 'small' })
      ),
      h('section', { className: 'dkd-chat-panel' },
        h('div', { className: 'dkd-chat-head' },
          h('img', { src: dkd_images.carBurgundy, alt: 'Anyela avatar' }),
          h('div', null, h('h3', null, 'Anyela ', h('span', null, '✓')), h('p', null, '● Aktif')),
          h('span', { className: 'dkd-session' }, DkdIcon({ name: 'fa-clock' }), '30 Dk. Oturum')
        ),
        h('div', { className: 'dkd-date' }, 'Bugün'),
        DkdChatBubble({ from: 'anyela', time: '14:32', children: h(React.Fragment, null, 'Merhaba ✨', h('br'), 'Bugün nasılsın?') }),
        DkdChatBubble({ from: 'user', time: '14:33', children: 'Merhaba Anyela! Harikayım, ya sen?' }),
        DkdChatBubble({ from: 'anyela', time: '14:33', children: 'Ben de iyiyim, seninle sohbet etmek hep güzel oluyor 😊' }),
        DkdChatBubble({ from: 'user', time: '14:34', children: 'Sana bugün ne giymeliyim sence? 😉' }),
        DkdChatBubble({ from: 'anyela', time: '14:34', children: 'Siyah dantel mi, yoksa kırmızı daha mı iyi olur? Seçim senin...' }),
        DkdChatBubble({ from: 'user', time: '14:35', children: 'Kırmızı olsun o zaman 😍' }),
        h('div', { className: 'dkd-message-box' }, DkdIcon({ name: 'fa-face-smile' }), h('span', null, 'Mesajını yaz...'), h('button', null, DkdIcon({ name: 'fa-paper-plane' })))
      ),
      h('section', { className: 'dkd-action-grid' },
        DkdActionCard({ icon: 'fa-microphone', title: 'Sesli Mesaj Gönder', text: 'Anyela’ya sesli mesajınla sürpriz yap.', tone: 'violet' }),
        DkdActionCard({ icon: 'fa-shirt', title: 'Kıyafet Yükle', text: 'Anyela’nın senin için özel seçim yapmasını sağla.', tone: 'blue' }),
        DkdActionCard({ icon: 'fa-video', title: 'Özel Video İste', text: 'Kişiye özel kısa video isteğinde bulun.', tone: 'green' })
      ),
      h('section', { className: 'dkd-wide-cta' },
        h('div', { className: 'dkd-time-orb' }, h('b', null, '30'), h('span', null, 'Dakika')),
        h('div', null, h('h2', null, 'Sohbete Başlamak İçin Paket Seç'), h('p', null, '30 dakikalık özel yazılı sohbetin keyfini çıkar.')),
        h('a', { href: '/AnyelaBorn/packages/', className: 'dkd-btn dkd-btn-primary' }, DkdIcon({ name: 'fa-gift' }), 'Paketleri Gör')
      )
    ) });
  }

  function DkdActionCard({ icon, title, text, tone }) {
    return h('article', { className: `dkd-action-card ${tone || ''}` },
      h('span', null, DkdIcon({ name: icon })),
      h('h3', null, title),
      h('p', null, text),
      DkdIcon({ name: 'fa-chevron-right' })
    );
  }

  function DkdVoicePage() {
    const packages = [
      { title: 'Voice Intro', price: '199 TL', time: '1 dakika', tone: 'violet', features: ['Kişisel sesli yanıt', '24–48 saat içinde', 'Standart öncelik'] },
      { title: 'Voice Chat Private', price: '399 TL', time: '3 dakika', tone: 'rose', badge: 'Popüler', features: ['Daha uzun sesli yanıt', '24 saat içinde', 'Öncelikli yanıt'] },
      { title: 'Voice VIP', price: '699 TL', time: '5 dakika', tone: 'green', badge: 'VIP', features: ['En uzun kişisel yanıt', '12–24 saat içinde', 'VIP öncelik & özel ilgi'] },
    ];
    return DkdPage({ active: 'home', children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-with-portrait' },
        h('div', null, DkdPill({ icon: 'fa-sparkles', children: 'Anyela Born • Sesli Mesaj' }), h('h1', { className: 'dkd-gradient-title' }, 'Sesli Mesaj'), h('p', null, 'Sesli mesajını gönder, Anyela’dan sana özel kişisel bir sesli yanıt al.'),
          h('div', { className: 'dkd-small-badges' }, DkdPill({ icon: 'fa-shield-check', children: '%100 Kişisel' }), DkdPill({ icon: 'fa-lock', children: 'Gizli & Güvenli' }), DkdPill({ icon: 'fa-bolt', children: 'Hızlı Yanıt' }))
        ),
        DkdHeroPortrait({ image: dkd_images.yachtNavy, mode: 'small' })
      ),
      DkdSectionTitle({ icon: 'fa-wand-magic-sparkles', title: 'Nasıl Çalışır?' }),
      h('section', { className: 'dkd-steps-grid' },
        DkdStepCard({ no: '1', icon: 'fa-bag-shopping', title: 'Paket seç', text: 'Sana uygun paketi seç ve ödemeni yap.', tone: 'violet' }),
        DkdStepCard({ no: '2', icon: 'fa-microphone', title: 'Sesli mesaj gönder', text: 'Kalbinden geçenleri kaydet ve gönder.', tone: 'rose' }),
        DkdStepCard({ no: '3', icon: 'fa-sparkles', title: 'Anyela cevabı hazırlasın', text: 'Mesajın dinlensin ve sana özel yanıt hazırlansın.', tone: 'blue' }),
        DkdStepCard({ no: '4', icon: 'fa-play', title: 'Sesli yanıtını al', text: 'Kişisel sesli yanıtını dinle.', tone: 'green' })
      ),
      DkdSectionTitle({ icon: 'fa-gift', title: 'Paketlerini Seç', sub: 'Her paket farklı süre ve ayrıcalık sunar.' }),
      h('section', { className: 'dkd-voice-packages' }, packages.map(p => h('article', { key: p.title, className: `dkd-voice-card ${p.tone}` },
        p.badge ? h('b', { className: 'dkd-mini-badge' }, p.badge) : null,
        h('div', { className: 'dkd-package-icon' }, DkdIcon({ name: 'fa-wave-square' })),
        h('h3', null, p.title), h('strong', null, p.price), h('span', null, p.time),
        h('ul', null, p.features.map(f => h('li', { key: f }, DkdIcon({ name: 'fa-check' }), f))),
        h('a', { href: '/AnyelaBorn/payment/' }, 'Paketi Seç')
      ))),
      h('section', { className: 'dkd-recorder' },
        h('h2', null, DkdIcon({ name: 'fa-microphone' }), 'Sesli Mesajını Kaydet'),
        h('div', { className: 'dkd-wave' }, Array.from({ length: 64 }).map((_, idx) => h('i', { key: idx, style: { '--dkd-h': `${18 + (idx * 13 % 54)}px` } }))),
        h('div', { className: 'dkd-record-row' }, h('span', null, '00:00 / 02:00'), h('button', null, DkdIcon({ name: 'fa-microphone' })), h('a', { href: '/AnyelaBorn/payment/' }, DkdIcon({ name: 'fa-paper-plane' }), 'Gönder')),
        h('p', null, 'Maksimum kayıt süresi 2 dakikadır.')
      ),
      h('section', { className: 'dkd-audio-sample' },
        h('img', { src: dkd_images.yachtGreen, alt: 'Anyela sesli yanıt' }),
        h('button', null, DkdIcon({ name: 'fa-play' })),
        h('div', null, h('h3', null, 'Anyela’dan sana özel yanıt'), h('div', { className: 'dkd-mini-wave' }), h('small', null, '01:23')),
        h('a', { href: '/AnyelaBorn/payment/' }, 'Dinle')
      )
    ) });
  }

  function DkdCustomPage() {
    const customCards = [
      ['fa-shirt', 'Style Try-On', 'Gönderdiğin kıyafetle Anyela’nın sana özel çarpıcı tarzı.', dkd_images.lamboBlack, 'violet'],
      ['fa-camera', 'Photo Set', 'Sana özel konseptlerle profesyonel fotoğraf setleri.', dkd_images.poolWhite, 'rose'],
      ['fa-video', 'Talking Video', 'Adınla hitap edilen, sana özel konuşma videoları.', dkd_images.yachtNavy, 'blue'],
      ['fa-gift', 'Doğum Günü / Özel Mesaj Videosu', 'Özel anların için kişisel kutlama videoları.', dkd_images.yachtFull, 'green'],
    ];
    return DkdPage({ active: 'payment', children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-with-portrait' },
        h('div', null, DkdPill({ icon: 'fa-sparkles', children: 'Ana Sayfa › Özel İçerik' }), h('h1', null, 'Özel İçerik'), h('p', null, 'Kıyafet, fikir veya tema gönder — sana özel Anyela konsepti hazırlansın.')),
        DkdHeroPortrait({ image: dkd_images.yachtGreen, mode: 'small' })
      ),
      DkdSectionTitle({ icon: 'fa-sparkles', title: 'Özel İçerik Seçenekleri' }),
      h('section', { className: 'dkd-custom-card-grid' }, customCards.map(c => h('article', { className: `dkd-custom-card ${c[4]}`, key: c[1] },
        h('img', { src: c[3], alt: c[1], loading: 'lazy' }), h('span', null, DkdIcon({ name: c[0] })), h('h3', null, c[1]), h('p', null, c[2]), h('a', { href: '/AnyelaBorn/payment/' }, 'Detayları Gör', DkdIcon({ name: 'fa-arrow-right' }))
      ))),
      DkdSectionTitle({ icon: 'fa-sparkles', title: 'Konseptini Oluştur' }),
      h('section', { className: 'dkd-builder-grid' },
        h('article', null, h('b', null, '1'), h('h3', null, 'Kıyafet Yükle'), h('p', null, 'İlham kaynağın olan kıyafet fotoğrafını yükle.'), h('div', { className: 'dkd-upload-box' }, DkdIcon({ name: 'fa-cloud-arrow-up' }), 'Dosya Seç veya Sürükle', h('small', null, 'PNG, JPG (Maks. 10MB)'))),
        h('article', null, h('b', null, '2'), h('h3', null, 'Tema Seç'), h('p', null, 'Hayalindeki konsepti seç veya fikrini yaz.'), h('div', { className: 'dkd-chips' }, ['Romantik', 'Glamour', 'Siyah & Deri', 'Beach', 'Night Vibes', 'Özel Fikrim Var'].map(t => h('span', { key: t }, t)))),
        h('article', null, h('b', null, '3'), h('h3', null, 'Teslim Türü'), h('p', null, 'İçeriğinin nasıl teslim edileceğini seç.'), h('div', { className: 'dkd-choice-list' }, ['Fotoğraf Seti', 'Video (Kısa)', 'Video (Uzun)'].map(t => h('span', { key: t }, DkdIcon({ name: 'fa-circle-dot' }), t))))
      ),
      DkdSectionTitle({ icon: 'fa-sparkles', title: 'İlham Al: Örnek Konseptler' }),
      h('section', { className: 'dkd-preview-strip' }, [dkd_images.carBurgundy, dkd_images.poolWhite, dkd_images.lamboBlack, dkd_images.hero, dkd_images.yachtNavy, dkd_images.gallery].map((img, idx) => h('img', { key: idx, src: img, alt: 'Anyela örnek konsept' }))),
      h('section', { className: 'dkd-wide-cta custom' }, h('div', { className: 'dkd-time-orb' }, DkdIcon({ name: 'fa-gift' })), h('div', null, h('h2', null, 'Kendi Konseptini Başlat'), h('p', null, 'Hayalini gönder, Anyela sana özel hazırlansın.')), h('a', { href: '/AnyelaBorn/payment/', className: 'dkd-btn dkd-btn-primary' }, 'Konseptini Başlat', DkdIcon({ name: 'fa-arrow-right' })))
    ) });
  }

  function DkdAdsPage() {
    const sectors = [['fa-bag-shopping','E-ticaret Markaları'], ['fa-bottle-droplet','Güzellik & Kozmetik'], ['fa-shirt','Moda & Aksesuar'], ['fa-mobile-screen','Uygulama & Teknoloji']];
    const packages = [
      ['fa-envelope-open-text','Reklam Mini','Hızlı görünürlük için ideal paket.','1 içerik • 1 platform • 7 gün kullanım','violet'],
      ['fa-bullseye','Reklam Standart','Dengeli içerik ve daha fazla etki.','2 içerik • 1-2 platform • performans raporu','rose'],
      ['fa-clapperboard','Reklam Pro','Geniş kapsamlı içerik ve maksimum etki.','3-4 içerik • tüm platformlar • detaylı rapor','blue'],
      ['fa-crown','Marka Yüzü','Uzun vadeli iş birliği ve temsilcilik.','Aylık plan • sürekli destek • marka temsilciliği','green'],
    ];
    return DkdPage({ active: 'ads', children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-with-portrait' },
        h('div', null, DkdPill({ icon: 'fa-sparkles', children: 'Markanız için AI destekli reklam çözümleri' }), h('h1', null, 'Anyela Reklam ', h('span', null, 'Yüzünüz Olsun')), h('p', null, 'Markanız için AI destekli reklam içerikleri oluşturun.'), h('div', { className: 'dkd-small-badges' }, DkdPill({ icon: 'fa-shield-heart', children: 'AI Destekli İçerik' }), DkdPill({ icon: 'fa-handshake', children: 'Güvenilir İş Birliği' }), DkdPill({ icon: 'fa-chart-line', children: 'Ölçülebilir Sonuçlar' })) ),
        DkdHeroPortrait({ image: dkd_images.yachtNavy, mode: 'small' })
      ),
      DkdSectionTitle({ icon: 'fa-users', title: 'Kimler İçin?', sub: 'Güvenilir, estetik ve etkili içeriklerle markasını büyütmek isteyen markalar.' }),
      h('section', { className: 'dkd-sector-grid' }, sectors.map(s => h('article', { key: s[1] }, DkdIcon({ name: s[0] }), h('h3', null, s[1])))),
      DkdSectionTitle({ icon: 'fa-sparkles', title: 'Nasıl Çalışır?' }),
      h('section', { className: 'dkd-steps-grid' },
        DkdStepCard({ no: '1', icon: 'fa-pen-to-square', title: 'İhtiyacını Paylaş', text: 'Markanızı ve hedefinizi bizimle paylaşın.', tone: 'violet' }),
        DkdStepCard({ no: '2', icon: 'fa-bullseye', title: 'Strateji Oluştur', text: 'AI destekli içerik ve yayın planı hazırlanır.', tone: 'rose' }),
        DkdStepCard({ no: '3', icon: 'fa-clapperboard', title: 'İçerik Üret & Yayımla', text: 'Anyela ile özgün içerikler üretilir.', tone: 'blue' }),
        DkdStepCard({ no: '4', icon: 'fa-chart-line', title: 'Sonuçları Ölç', text: 'Performans raporları ile büyütürüz.', tone: 'green' })
      ),
      DkdSectionTitle({ icon: 'fa-star', title: 'Paketler' }),
      h('section', { className: 'dkd-ads-grid' }, packages.map(p => h('article', { key: p[1], className: `dkd-ads-card ${p[4]}` }, DkdIcon({ name: p[0] }), h('h3', null, p[1]), h('p', null, p[2]), h('ul', null, p[3].split(' • ').map(x => h('li', { key: x }, DkdIcon({ name: 'fa-check' }), x))), h('a', { href: '/AnyelaBorn/payment/' }, 'Detayları Gör')))),
      h('section', { className: 'dkd-compliance-strip' },
        h('div', null, DkdIcon({ name: 'fa-shield' }), h('strong', null, 'İş Birliği / Reklam etiketi'), h('p', null, 'Tüm iş birlikleri şeffaf şekilde #reklam etiketi ile paylaşılır.')),
        h('div', null, DkdIcon({ name: 'fa-award' }), h('strong', null, 'Profesyonel teslim süreci'), h('p', null, 'Planlama, çekim, düzenleme ve yayınlama süreci profesyonelce yönetilir.')),
        h('div', null, DkdIcon({ name: 'fa-lock' }), h('strong', null, 'Güvenli & yasal'), h('p', null, 'Sözleşmeli çalışma ve KVKK uyumlu veri güvenliği.'))
      ),
      h('section', { className: 'dkd-lead-form' },
        h('div', null, DkdIcon({ name: 'fa-envelope' }), h('h2', null, 'Markanız İçin Teklif Alın'), h('p', null, 'Kısa bilgilerinizi bırakın, ekibimiz sizinle iletişime geçsin.')),
        h('form', null, ['Marka Adı','Sektör','Hedef','E-posta','Telefon'].map(x => h('input', { key: x, placeholder: x })), h('button', { type: 'button' }, 'Teklif Al', DkdIcon({ name: 'fa-arrow-right' })))
      )
    ) });
  }

  function DkdPaymentPage() {
    return DkdPage({ active: 'payment', children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-payment-hero' },
        h('div', null, h('h1', null, 'Ödeme ve Başlangıç'), h('p', null, 'Paketi seç, ödemeni yap, dekontunu gönder')),
        DkdHeroPortrait({ image: dkd_images.hero, mode: 'small' })
      ),
      h('section', { className: 'dkd-payment-steps' }, ['Ödeme','Dekont','Onay','Başlangıç'].map((s, idx) => h('div', { className: idx===0?'dkd-active':'', key:s }, DkdIcon({ name: ['fa-credit-card','fa-file-lines','fa-shield-check','fa-rocket'][idx] }), h('span', null, s)))),
      h('section', { className: 'dkd-payment-card dkd-selected' }, DkdIcon({ name: 'fa-gift' }), h('div', null, h('h2', null, 'Seçilen Paket'), h('p', null, 'Paket seçildikten sonra buraya yansır.')), h('strong', null, '₺ —')),
      h('section', { className: 'dkd-payment-card' }, h('h2', null, DkdIcon({ name: 'fa-building-columns' }), 'IBAN ile Ödeme'), h('p', null, 'Gerçek IBAN bilgilerinizi eklemeden satışa açmayın.'), h('div', { className: 'dkd-bank-box' }, h('span', null, 'Banka', h('b', null, 'Banka adı eklenecek')), h('span', null, 'IBAN', h('b', null, 'TR__ ____ ____ ____ ____ ____ __')), h('span', null, 'Alıcı', h('b', null, 'Anyela Born Club')), h('button', null, DkdIcon({ name: 'fa-copy' }), 'Kopyala'))),
      h('section', { className: 'dkd-payment-card dkd-code' }, h('div', null, h('h2', null, DkdIcon({ name: 'fa-arrows-rotate' }), 'Açıklama Kodu'), h('strong', null, 'ABC 7294')), h('p', null, 'Ödeme açıklama kısmına bu kodu yazmanız gerekir.'), h('button', null, DkdIcon({ name: 'fa-copy' }), 'Kopyala')),
      h('section', { className: 'dkd-payment-card dkd-upload' }, h('div', null, h('h2', null, DkdIcon({ name: 'fa-cloud-arrow-up' }), 'Dekont Yükle'), h('p', null, 'PDF, JPG veya PNG • Maks. 10MB')), h('button', null, DkdIcon({ name: 'fa-upload' }), 'Dosya Seç')),
      h('section', { className: 'dkd-secure-panel' }, DkdIcon({ name: 'fa-shield-check' }), h('div', null, h('h2', null, 'Güvenli, Hızlı ve Şeffaf Süreç'), h('p', null, 'Dekontunuz ulaştıktan sonra ödeme kontrol edilir. Onay sonrası sohbet veya sipariş süreciniz başlatılır.')), h('ul', null, ['%100 gizlilik','Güvenli ödeme','Hızlı onay','7/24 destek'].map(x => h('li', { key: x }, DkdIcon({ name: 'fa-check' }), x)))),
      h('a', { href: '/AnyelaBorn/faq/', className: 'dkd-submit-btn' }, DkdIcon({ name: 'fa-paper-plane' }), 'Dekont Gönder')
    ) });
  }

  function DkdFaqPage() {
    const faqs = [
      ['fa-circle-question','Anyela gerçek kişi mi?'], ['fa-wallet','Ödeme nasıl yapılıyor?'], ['fa-message','Sohbet nasıl başlıyor?'], ['fa-microphone','Sesli mesaj nasıl geliyor?'], ['fa-rotate-left','İade var mı?'], ['fa-shield-halved','Gönderdiğim içerikler gizli mi?']
    ];
    return DkdPage({ active: 'payment', children: h(React.Fragment, null,
      h('section', { className: 'dkd-page-hero dkd-faq-hero' },
        h('div', null, DkdPill({ icon: 'fa-sparkles', children: 'Anyela Born • AI Influencer' }), h('h1', null, 'SSS & Yardım'), h('p', null, 'Merak ettiğin her şeyi burada bulabilirsin. Sorularına hızlı, net ve güvenilir cevaplar.')),
        h('div', { className: 'dkd-help-icon' }, DkdIcon({ name: 'fa-comments' }), h('b', null, '?'))
      ),
      h('section', { className: 'dkd-faq-trust' }, DkdIcon({ name: 'fa-shield-check' }), h('div', null, h('h2', null, 'Anyela gerçekte sanal bir AI influencer karakteridir.'), h('p', null, 'Anyela, gelişmiş yapay zeka ile oluşturulmuş sanal bir karakterdir. Tüm sohbetler, sesli mesajlar, görseller ve videolar eğlence ve kişisel kullanım amacıyla sunulur.'))),
      DkdSectionTitle({ icon: 'fa-sparkles', title: 'Sık Sorulan Sorular' }),
      h('section', { className: 'dkd-faq-list' }, faqs.map(f => h('details', { key: f[1] }, h('summary', null, DkdIcon({ name: f[0] }), f[1], DkdIcon({ name: 'fa-chevron-down' })), h('p', null, 'Bu bölüm v1.5’te bilgilendirme amaçlıdır. Canlı ödeme ve teslim süreci başlamadan önce net kurallar ayrıca güncellenecektir.')))),
      DkdSectionTitle({ icon: 'fa-headset', title: 'Destek Ekibimiz Sizinle', sub: 'Soruların veya yardıma ihtiyacın mı var? Biz buradayız!' }),
      h('section', { className: 'dkd-support-grid' },
        DkdActionCard({ icon: 'fa-brands fa-whatsapp', title: 'WhatsApp Destek', text: 'Hemen yaz, hızlıca yardımcı olalım.', tone: 'green' }),
        DkdActionCard({ icon: 'fa-brands fa-instagram', title: 'Instagram DM', text: 'Bize DM at, en kısa sürede dönelim.', tone: 'rose' }),
        DkdActionCard({ icon: 'fa-envelope', title: 'E-posta', text: 'Mail gönder, ekibimiz ilgilensin.', tone: 'blue' })
      ),
      h('section', { className: 'dkd-wide-note' }, h('strong', null, 'Senin memnuniyetin bizim için her şeyden önemli.'), h('p', null, 'Güvenle sor, gönül rahatlığıyla keyfini çıkar.'), DkdIcon({ name: 'fa-heart' }))
    ) });
  }

  function DkdApp() {
    const path = window.location.pathname.replace(/\/+$/, '/') || '/AnyelaBorn/';
    if (path.includes('/packages/')) return DkdPackagesPage();
    if (path.includes('/chat/')) return DkdChatPage();
    if (path.includes('/voice/')) return DkdVoicePage();
    if (path.includes('/custom/')) return DkdCustomPage();
    if (path.includes('/ads/')) return DkdAdsPage();
    if (path.includes('/payment/')) return DkdPaymentPage();
    if (path.includes('/faq/')) return DkdFaqPage();
    return DkdHomePage();
  }

  ReactDOM.createRoot(document.getElementById('dkd-root')).render(h(DkdApp));
})();
