
(function () {
  const dkd_create_element = React.createElement;
  const dkd_image_base = '/AnyelaBorn/assets/images/';

  const dkd_images = {
    hero: dkd_image_base + 'dkd_anyela_yacht_gold_close.jpg',
    yachtFull: dkd_image_base + 'dkd_anyela_yacht_gold_full.jpg',
    yachtGreen: dkd_image_base + 'dkd_anyela_yacht_green.jpg',
    yachtNavy: dkd_image_base + 'dkd_anyela_yacht_navy.jpg',
    carBurgundy: dkd_image_base + 'dkd_anyela_car_burgundy.jpg',
    lamboBlack: dkd_image_base + 'dkd_anyela_lambo_black.jpg',
    poolWhite: dkd_image_base + 'dkd_anyela_pool_white.jpg',
    gallery: dkd_image_base + 'dkd_anyela_yacht_gallery.jpg'
  };

  const dkd_icon_map = {
    home: '⌂', chat: '◌', gift: '▣', ad: '◒', rocket: '➤', menu: '☰', user: '◎', back: '‹',
    sparkle: '✦', shield: '◆', lock: '▣', check: '✓', bot: '◈', adult: '18+', card: '▰', file: '▤',
    upload: '⇧', mic: '◉', wave: '▥', play: '▶', camera: '▢', video: '▻', hanger: '♢', phone: '☎',
    crown: '♛', star: '★', bag: '▣', mail: '✉', heart: '♡', copy: '⧉', target: '◎', chart: '↗', help: '?',
    whatsapp: '☘', instagram: '◍', image: '▧', magic: '✦', cake: '✹', palette: '◐', theme: '◈', brand: 'B'
  };

  const dkd_routes = [
    { key: 'home', href: '/AnyelaBorn/', label: 'Ana Sayfa', icon: 'home' },
    { key: 'chat', href: '/AnyelaBorn/chat/', label: 'Sohbet', icon: 'chat' },
    { key: 'packages', href: '/AnyelaBorn/packages/', label: 'Paketler', icon: 'gift' },
    { key: 'ads', href: '/AnyelaBorn/ads/', label: 'Reklam', icon: 'ad' },
    { key: 'payment', href: '/AnyelaBorn/payment/', label: 'Başla', icon: 'rocket' }
  ];

  const dkd_fan_packages = [
    { title: 'Anyela Intro', detail: 'Kısa tanışma ve kişisel video selamı.', price: '₺299', icon: 'chat', tone: 'violet' },
    { title: 'Private Chat', detail: '30 dakika boyunca özel yazılı sohbet.', price: '₺1.199', icon: 'lock', tone: 'rose', badge: 'En Popüler' },
    { title: 'Voice Message', detail: 'Kişiye özel sesli mesajın Anyela’dan.', price: '₺399', icon: 'wave', tone: 'blue' },
    { title: 'Voice Chat Private', detail: '15 dakika özel sesli görüşme.', price: '₺1.699', icon: 'phone', tone: 'teal' },
    { title: 'Style Try-On', detail: 'Anyela senin için kıyafet konsepti denesin.', price: '₺799', icon: 'hanger', tone: 'orange' },
    { title: 'Photo Set', detail: '5 adet kişiye özel fotoğraf seti.', price: '₺649', icon: 'image', tone: 'violet' },
    { title: 'Talking Video', detail: 'Kişiye özel 1 dakikalık konuşma videosu.', price: '₺849', icon: 'video', tone: 'blue' }
  ];

  const dkd_brand_packages = [
    { title: 'Reklam Mini', detail: 'Story paylaşımı ve hızlı görünürlük.', price: '₺4.999 /ay', icon: 'ad', tone: 'violet' },
    { title: 'Reklam Standart', detail: 'Story + Feed paylaşımı ve rapor.', price: '₺9.999 /ay', icon: 'ad', tone: 'blue' },
    { title: 'Reklam Pro', detail: 'Story + Feed + Reels kampanyası.', price: '₺19.999 /ay', icon: 'crown', tone: 'gold' }
  ];

  const dkd_ad_packages = [
    { title: 'Reklam Mini', icon: 'mail', tone: 'violet', detail: 'Hızlı görünürlük için ideal paket.', points: ['1 içerik (fotoğraf veya video)', '1 platform paylaşım', 'AI destekli içerik', '7 gün kullanım hakkı'] },
    { title: 'Reklam Standart', icon: 'target', tone: 'rose', badge: 'Popüler', detail: 'Dengeli içerik ve daha fazla etki.', points: ['2 içerik', '1–2 platform paylaşım', '14 gün kullanım hakkı', 'Performans raporu'] },
    { title: 'Reklam Pro', icon: 'image', tone: 'blue', detail: 'Geniş kapsamlı içerik ve maksimum etki.', points: ['3–4 içerik', 'Tüm platformlarda paylaşım', '30 gün kullanım hakkı', 'Reels desteği'] },
    { title: 'Marka Yüzü', icon: 'crown', tone: 'green', detail: 'Uzun vadeli iş birliği ve marka temsilciliği.', points: ['Aylık içerik planı', 'Sürekli paylaşım desteği', 'Kampanya & çekim', 'Aylık rapor'] }
  ];

  function DkdIcon(dkd_props) {
    const dkd_name = dkd_props && dkd_props.name ? dkd_props.name : 'sparkle';
    const dkd_class_name = dkd_props && dkd_props.className ? dkd_props.className : '';
    return dkd_create_element('span', { className: 'dkd-icon ' + dkd_class_name, 'aria-hidden': 'true' }, dkd_icon_map[dkd_name] || '✦');
  }

  function DkdBrand() {
    return dkd_create_element('a', { className: 'dkd-brand', href: '/AnyelaBorn/' },
      dkd_create_element('span', { className: 'dkd-brand-mark' }, 'AB'),
      dkd_create_element('span', { className: 'dkd-brand-text' }, 'Anyela Born Club')
    );
  }

  function DkdHeader(dkd_props) {
    const dkd_back = dkd_props && dkd_props.back;
    return dkd_create_element('header', { className: 'dkd-header' },
      dkd_create_element('div', { className: 'dkd-header-inner' },
        dkd_back ? dkd_create_element('a', { className: 'dkd-back', href: '/AnyelaBorn/', 'aria-label': 'Geri' }, DkdIcon({ name: 'back' })) : null,
        DkdBrand(),
        dkd_create_element('div', { className: 'dkd-header-actions' },
          dkd_create_element('button', { className: 'dkd-menu', 'aria-label': 'Menü' }, DkdIcon({ name: 'menu' })),
          dkd_create_element('a', { className: 'dkd-login', href: '/AnyelaBorn/payment/' }, 'Giriş Yap')
        )
      )
    );
  }

  function DkdBottomNav(dkd_props) {
    const dkd_active = dkd_props.active;
    return dkd_create_element('nav', { className: 'dkd-bottom-nav', 'aria-label': 'Mobil menü' },
      dkd_routes.map(function (dkd_route) {
        return dkd_create_element('a', { key: dkd_route.key, href: dkd_route.href, className: 'dkd-bottom-item ' + (dkd_active === dkd_route.key ? 'dkd-active' : '') },
          DkdIcon({ name: dkd_route.icon }), dkd_create_element('span', null, dkd_route.label)
        );
      })
    );
  }

  function DkdPage(dkd_props) {
    return dkd_create_element(React.Fragment, null,
      DkdHeader({ back: dkd_props.back }),
      dkd_create_element('main', { className: 'dkd-main' }, dkd_props.children),
      DkdBottomNav({ active: dkd_props.active })
    );
  }

  function DkdPill(dkd_props) {
    return dkd_create_element('span', { className: 'dkd-pill ' + (dkd_props.tone || '') },
      dkd_props.icon ? DkdIcon({ name: dkd_props.icon }) : null,
      dkd_props.children
    );
  }

  function DkdPortrait(dkd_props) {
    const dkd_image = dkd_props.image || dkd_images.hero;
    const dkd_mode = dkd_props.mode || 'hero';
    return dkd_create_element('div', { className: 'dkd-portrait dkd-portrait-' + dkd_mode },
      dkd_create_element('div', { className: 'dkd-portrait-orbit dkd-orbit-one' }),
      dkd_create_element('div', { className: 'dkd-portrait-orbit dkd-orbit-two' }),
      dkd_create_element('img', { src: dkd_image, alt: 'Anyela Born görseli', loading: 'eager' }),
      dkd_props.badge === false ? null : dkd_create_element('div', { className: 'dkd-portrait-badge' },
        DkdIcon({ name: 'shield' }),
        dkd_create_element('strong', null, '%100 Gizlilik'),
        dkd_create_element('span', null, 'Güvenli ve özel süreç')
      )
    );
  }

  function DkdSectionTitle(dkd_props) {
    return dkd_create_element('div', { className: 'dkd-section-title' },
      dkd_create_element('h2', null, dkd_props.icon ? DkdIcon({ name: dkd_props.icon }) : null, dkd_props.title),
      dkd_props.sub ? dkd_create_element('p', null, dkd_props.sub) : null
    );
  }

  function DkdStepCard(dkd_props) {
    return dkd_create_element('article', { className: 'dkd-step-card ' + (dkd_props.tone || '') },
      dkd_create_element('span', { className: 'dkd-step-no' }, dkd_props.no),
      dkd_create_element('div', { className: 'dkd-step-icon' }, DkdIcon({ name: dkd_props.icon })),
      dkd_create_element('h3', null, dkd_props.title),
      dkd_create_element('p', null, dkd_props.text)
    );
  }

  function DkdTrustRibbon() {
    const dkd_items = [
      ['bot', 'AI karakter', 'Gerçekçi etkileşim'],
      ['adult', '18+ içerik', 'Yalnızca yetişkinler'],
      ['lock', 'Gizli süreç', 'Tam gizlilik garantisi'],
      ['shield', 'Manuel ödeme onayı', 'Her ödeme kontrol edilir']
    ];
    return dkd_create_element('section', { className: 'dkd-trust-ribbon' }, dkd_items.map(function (dkd_item, dkd_index) {
      return dkd_create_element('div', { key: dkd_item[1], className: 'dkd-trust-item dkd-trust-' + dkd_index },
        dkd_create_element('span', { className: 'dkd-trust-icon' }, DkdIcon({ name: dkd_item[0] })),
        dkd_create_element('span', null, dkd_create_element('strong', null, dkd_item[1]), dkd_create_element('small', null, dkd_item[2]))
      );
    }));
  }

  function DkdFeatureCard(dkd_props) {
    return dkd_create_element('article', { className: 'dkd-feature-card ' + (dkd_props.tone || '') },
      dkd_create_element('div', { className: 'dkd-feature-image' },
        dkd_create_element('img', { src: dkd_props.image, alt: dkd_props.title, loading: 'lazy' }),
        dkd_create_element('span', { className: 'dkd-feature-icon' }, DkdIcon({ name: dkd_props.icon }))
      ),
      dkd_create_element('h3', null, dkd_props.title),
      dkd_create_element('p', null, dkd_props.text),
      dkd_props.link ? dkd_create_element('a', { href: dkd_props.link }, 'Detayları Gör ', DkdIcon({ name: 'rocket' })) : null
    );
  }

  function DkdPackageCard(dkd_props) {
    const dkd_item = dkd_props.item;
    return dkd_create_element('article', { className: 'dkd-package-card ' + dkd_item.tone + ' ' + (dkd_item.badge ? 'dkd-popular' : '') },
      dkd_item.badge ? dkd_create_element('span', { className: 'dkd-badge' }, DkdIcon({ name: 'star' }), dkd_item.badge) : null,
      dkd_create_element('div', { className: 'dkd-package-icon' }, DkdIcon({ name: dkd_item.icon })),
      dkd_create_element('h3', null, dkd_item.title),
      dkd_create_element('p', null, dkd_item.detail),
      dkd_create_element('strong', { className: 'dkd-price' }, dkd_item.price),
      dkd_create_element('a', { className: 'dkd-package-btn', href: '/AnyelaBorn/payment/' }, 'Paketi Seç')
    );
  }

  function DkdMiniTrust(dkd_props) {
    return dkd_create_element('div', { className: 'dkd-mini-trust ' + (dkd_props.tone || '') },
      DkdIcon({ name: dkd_props.icon || 'shield' }),
      dkd_create_element('strong', null, dkd_props.title),
      dkd_create_element('span', null, dkd_props.text)
    );
  }

  function DkdHomePage() {
    const dkd_steps = [
      ['1', 'bag', 'Paket seç', 'İhtiyacına uygun paketi seç.', 'violet'],
      ['2', 'card', 'Ödeme yap', 'Banka havalesi ile ödemeni yap.', 'rose'],
      ['3', 'file', 'Dekont gönder', 'Dekontunu sistem üzerinden ilet.', 'blue'],
      ['4', 'rocket', 'Deneyimi başlat', 'Onay sonrası Anyela sadece seninle.', 'green']
    ];
    return DkdPage({ active: 'home', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-hero dkd-wide-hero' },
        dkd_create_element('div', { className: 'dkd-hero-copy' },
          DkdPill({ icon: 'sparkle', children: 'Anyela Born • AI Influencer' }),
          dkd_create_element('h1', null, 'Anyela Born ile ', dkd_create_element('span', null, 'özel AI karakter'), ' deneyimine katıl'),
          dkd_create_element('p', null, 'Anyela, sizinle sohbet eden, sesli mesajlar gönderen, size özel görsel ve videolar hazırlayan sanal AI influencer’dır. Markanız için güçlü bir tanıtım yüzüdür.'),
          dkd_create_element('div', { className: 'dkd-hero-actions' },
            dkd_create_element('a', { className: 'dkd-btn dkd-btn-primary', href: '/AnyelaBorn/chat/' }, DkdIcon({ name: 'chat' }), dkd_create_element('span', null, 'Sohbete Başla', dkd_create_element('small', null, 'Hemen konuşmaya başla'))),
            dkd_create_element('a', { className: 'dkd-btn dkd-btn-secondary', href: '/AnyelaBorn/packages/' }, DkdIcon({ name: 'gift' }), dkd_create_element('span', null, 'Paketleri Gör', dkd_create_element('small', null, 'Tüm paketleri incele')))
          )
        ),
        DkdPortrait({ image: dkd_images.hero })
      ),
      DkdTrustRibbon(),
      DkdSectionTitle({ icon: 'sparkle', title: 'Nasıl Çalışır?' }),
      dkd_create_element('section', { className: 'dkd-steps-grid dkd-four-grid' }, dkd_steps.map(function (dkd_step) {
        return DkdStepCard({ key: dkd_step[0], no: dkd_step[0], icon: dkd_step[1], title: dkd_step[2], text: dkd_step[3], tone: dkd_step[4] });
      })),
      DkdSectionTitle({ icon: 'star', title: 'Öne Çıkan Deneyimler' }),
      dkd_create_element('section', { className: 'dkd-feature-grid dkd-four-grid' },
        DkdFeatureCard({ image: dkd_images.carBurgundy, icon: 'chat', title: 'Yazılı Sohbet', text: 'Anyela ile dilediğin zaman yazış, kendini özel hisset.', tone: 'violet', link: '/AnyelaBorn/chat/' }),
        DkdFeatureCard({ image: dkd_images.lamboBlack, icon: 'wave', title: 'Sesli Mesaj', text: 'Kişiye özel sesli mesajlar al, sesini her yerde hisset.', tone: 'rose', link: '/AnyelaBorn/voice/' }),
        DkdFeatureCard({ image: dkd_images.yachtGreen, icon: 'camera', title: 'Özel Görsel / Video', text: 'Sana özel görsel ve videolarla unutulmaz anlar yaşa.', tone: 'blue', link: '/AnyelaBorn/custom/' }),
        DkdFeatureCard({ image: dkd_images.yachtNavy, icon: 'ad', title: 'Anyela Reklam Yüzünüz Olsun', text: 'Markanızı Anyela’nın gücüyle binlere ulaştırın.', tone: 'green', link: '/AnyelaBorn/ads/' })
      ),
      dkd_create_element('section', { className: 'dkd-testimonial' },
        dkd_create_element('div', { className: 'dkd-quote' }, '“'),
        dkd_create_element('img', { src: dkd_images.poolWhite, alt: 'Kullanıcı görseli' }),
        dkd_create_element('div', { className: 'dkd-testimonial-copy' },
          dkd_create_element('div', { className: 'dkd-stars' }, '★★★★★'),
          dkd_create_element('p', null, 'Anyela ile tanıştığımdan beri her günüm daha özel. İlgisi, enerjisi ve mesajları müthiş.'),
          dkd_create_element('strong', null, 'Doğrulanmış Kullanıcı')
        ),
        dkd_create_element('aside', null, dkd_create_element('b', null, '4.9/5'), dkd_create_element('span', null, 'Kullanıcı Puanı'))
      )
    ) });
  }

  function DkdPackagesPage() {
    return DkdPage({ active: 'packages', back: true, children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-title-row' },
        dkd_create_element('div', null, dkd_create_element('h1', null, 'Paketler'), dkd_create_element('p', null, 'Sana en uygun Anyela deneyimini seç')),
        DkdMiniTrust({ icon: 'shield', title: '%100 Gizlilik', text: 'Güvenli ve özel süreç' })
      ),
      dkd_create_element('section', { className: 'dkd-tabs' },
        dkd_create_element('a', { className: 'dkd-tab dkd-active', href: '#fan' }, DkdIcon({ name: 'heart' }), 'Fan Paketleri'),
        dkd_create_element('a', { className: 'dkd-tab', href: '#custom' }, DkdIcon({ name: 'video' }), 'Özel İçerik'),
        dkd_create_element('a', { className: 'dkd-tab', href: '#brand' }, DkdIcon({ name: 'ad' }), 'Marka Paketleri')
      ),
      DkdSectionTitle({ icon: 'sparkle', title: 'Fan Paketleri', sub: 'Anyela ile daha yakın ve özel deneyimler' }),
      dkd_create_element('section', { id: 'fan', className: 'dkd-package-grid dkd-fan-grid' }, dkd_fan_packages.map(function (dkd_item) { return DkdPackageCard({ key: dkd_item.title, item: dkd_item }); })),
      DkdSectionTitle({ icon: 'ad', title: 'Marka Paketleri', sub: 'Markanızı Anyela ile binlere ulaştırın' }),
      dkd_create_element('section', { id: 'brand', className: 'dkd-package-grid dkd-brand-grid' }, dkd_brand_packages.map(function (dkd_item) { return DkdPackageCard({ key: dkd_item.title, item: dkd_item }); })),
      dkd_create_element('section', { className: 'dkd-info-strip' },
        DkdMiniTrust({ icon: 'shield', title: 'Güvenli Ödeme', text: 'Manuel onaylı süreç' }),
        DkdMiniTrust({ icon: 'check', title: '%100 Gizlilik', text: 'Tüm süreç gizlidir' }),
        DkdMiniTrust({ icon: 'chat', title: '7/24 Destek', text: 'Soruların için buradayız' }),
        DkdMiniTrust({ icon: 'rocket', title: 'Hızlı Teslimat', text: 'En kısa sürede teslim' })
      )
    ), back: true });
  }

  function DkdChatBubble(dkd_props) {
    return dkd_create_element('div', { className: 'dkd-chat-row ' + (dkd_props.user ? 'dkd-user' : 'dkd-anyela') },
      dkd_props.user ? null : dkd_create_element('img', { src: dkd_images.hero, alt: 'Anyela' }),
      dkd_create_element('div', { className: 'dkd-message' }, dkd_create_element('p', null, dkd_props.text), dkd_create_element('small', null, dkd_props.time || '14:32'))
    );
  }

  function DkdChatPage() {
    return DkdPage({ active: 'chat', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-hero dkd-chat-hero' },
        dkd_create_element('div', null, DkdPill({ icon: 'chat', children: 'Anyela Born • Sohbet' }), dkd_create_element('h1', null, 'Sohbet'), dkd_create_element('p', null, 'Anyela ile özel yazılı sohbet deneyimi')),
        DkdPortrait({ image: dkd_images.hero, badge: false })
      ),
      dkd_create_element('section', { className: 'dkd-chat-panel' },
        dkd_create_element('header', null,
          dkd_create_element('div', { className: 'dkd-chat-person' }, dkd_create_element('img', { src: dkd_images.hero, alt: 'Anyela' }), dkd_create_element('span', null, dkd_create_element('strong', null, 'Anyela'), dkd_create_element('small', null, '● Aktif'))),
          dkd_create_element('span', { className: 'dkd-session' }, DkdIcon({ name: 'card' }), '30 Dk. Oturum')
        ),
        dkd_create_element('div', { className: 'dkd-day-pill' }, 'Bugün'),
        DkdChatBubble({ text: 'Merhaba ✨ Bugün nasılsın?', time: '14:32' }),
        DkdChatBubble({ user: true, text: 'Merhaba Anyela! Harikayım, ya sen?', time: '14:33' }),
        DkdChatBubble({ text: 'Ben de iyiyim, seninle sohbet etmek hep güzel oluyor 😊', time: '14:33' }),
        DkdChatBubble({ user: true, text: 'Sana bugün ne giymeliyim sence? 😉', time: '14:34' }),
        DkdChatBubble({ text: 'Siyah dantel mi, yoksa kırmızı daha mı iyi olur? Seçim senin...', time: '14:34' }),
        DkdChatBubble({ user: true, text: 'Kırmızı olsun o zaman 😍', time: '14:35' }),
        dkd_create_element('form', { className: 'dkd-chat-input' }, dkd_create_element('span', null, '☺'), dkd_create_element('input', { placeholder: 'Mesajını yaz...', readOnly: true }), dkd_create_element('button', { type: 'button' }, DkdIcon({ name: 'rocket' })))
      ),
      dkd_create_element('section', { className: 'dkd-action-grid' },
        DkdMiniTrust({ icon: 'mic', title: 'Sesli Mesaj Gönder', text: 'Anyela’ya sesli mesajınla sürpriz yap.', tone: 'violet' }),
        DkdMiniTrust({ icon: 'hanger', title: 'Kıyafet Yükle', text: 'Anyela’nın özel seçim yapmasını sağla.', tone: 'blue' }),
        DkdMiniTrust({ icon: 'video', title: 'Özel Video İste', text: 'Kişiye özel kısa video iste.', tone: 'green' })
      ),
      dkd_create_element('section', { className: 'dkd-cta-band' },
        dkd_create_element('div', { className: 'dkd-time-orb' }, '30', dkd_create_element('small', null, 'Dakika')),
        dkd_create_element('div', null, dkd_create_element('h2', null, 'Sohbete Başlamak İçin Paket Seç'), dkd_create_element('p', null, '30 dakikalık özel yazılı sohbetin keyfini çıkar.')), 
        dkd_create_element('a', { href: '/AnyelaBorn/packages/', className: 'dkd-btn dkd-btn-primary' }, DkdIcon({ name: 'gift' }), 'Paketleri Gör')
      )
    ) });
  }

  function DkdVoicePage() {
    const dkd_voice_packages = [
      { title: 'Voice Intro', price: '199 TL', detail: '1 dakika', tone: 'violet', icon: 'wave' },
      { title: 'Voice Chat Private', price: '399 TL', detail: '3 dakika', tone: 'rose', icon: 'wave', badge: 'Popüler' },
      { title: 'Voice VIP', price: '699 TL', detail: '5 dakika', tone: 'green', icon: 'wave', badge: 'VIP' }
    ];
    return DkdPage({ active: 'home', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-hero dkd-voice-hero' },
        dkd_create_element('div', null,
          DkdPill({ icon: 'sparkle', children: 'Anyela Born • Sesli Mesaj' }),
          dkd_create_element('h1', null, 'Sesli Mesaj'),
          dkd_create_element('p', null, 'Sesli mesajını gönder, Anyela’dan sana özel kişisel bir sesli yanıt al.'),
          dkd_create_element('div', { className: 'dkd-mini-chip-row' }, DkdPill({ icon: 'shield', children: '%100 Kişisel' }), DkdPill({ icon: 'lock', children: 'Gizli & Güvenli' }), DkdPill({ icon: 'rocket', children: 'Hızlı Yanıt' }))
        ),
        DkdPortrait({ image: dkd_images.hero, badge: false })
      ),
      DkdSectionTitle({ icon: 'sparkle', title: 'Nasıl Çalışır?' }),
      dkd_create_element('section', { className: 'dkd-steps-grid dkd-four-grid' },
        DkdStepCard({ no: '1', icon: 'bag', title: 'Paket seç', text: 'Sana uygun paketi seç ve ödemeni yap.', tone: 'violet' }),
        DkdStepCard({ no: '2', icon: 'mic', title: 'Sesli mesaj gönder', text: 'Kalbinden geçenleri kaydet ve gönder.', tone: 'rose' }),
        DkdStepCard({ no: '3', icon: 'sparkle', title: 'Anyela cevabı hazırlasın', text: 'Mesajın dinlensin ve özel yanıt hazırlansın.', tone: 'blue' }),
        DkdStepCard({ no: '4', icon: 'play', title: 'Sesli yanıtını al', text: 'Kişisel sesli yanıtını dinle.', tone: 'green' })
      ),
      DkdSectionTitle({ icon: 'gift', title: 'Paketlerini Seç', sub: 'Her paket, farklı süre ve ayrıcalıklar sunar.' }),
      dkd_create_element('section', { className: 'dkd-package-grid dkd-three-grid' }, dkd_voice_packages.map(function (dkd_item) { return DkdPackageCard({ key: dkd_item.title, item: dkd_item }); })),
      dkd_create_element('section', { className: 'dkd-recorder' },
        dkd_create_element('h2', null, DkdIcon({ name: 'mic' }), 'Sesli Mesajını Kaydet'),
        dkd_create_element('div', { className: 'dkd-waveform' }, Array.from({ length: 70 }).map(function (_, dkd_index) { return dkd_create_element('i', { key: dkd_index, style: { height: (10 + (dkd_index % 9) * 4) + 'px' } }); })),
        dkd_create_element('div', { className: 'dkd-recorder-actions' }, dkd_create_element('span', null, '00:00 / 02:00'), dkd_create_element('button', null, DkdIcon({ name: 'mic' })), dkd_create_element('a', { href: '/AnyelaBorn/payment/' }, DkdIcon({ name: 'rocket' }), 'Gönder')),
        dkd_create_element('small', null, 'Maksimum kayıt süresi 2 dakikadır.')
      ),
      dkd_create_element('section', { className: 'dkd-audio-reply' },
        dkd_create_element('img', { src: dkd_images.hero, alt: 'Anyela sesli yanıt' }),
        dkd_create_element('button', null, DkdIcon({ name: 'play' })),
        dkd_create_element('div', null, dkd_create_element('strong', null, 'Anyela’dan sana özel yanıt'), dkd_create_element('div', { className: 'dkd-mini-wave' })),
        dkd_create_element('a', { href: '/AnyelaBorn/payment/' }, 'Dinle')
      )
    ) });
  }

  function DkdCustomPage() {
    const dkd_options = [
      ['Style Try-On', 'Gönderdiğin kıyafetle Anyela’nın sana özel çarpıcı tarzı.', 'hanger', dkd_images.lamboBlack, 'violet'],
      ['Photo Set', 'Sana özel konseptlerle profesyonel fotoğraf setleri.', 'camera', dkd_images.poolWhite, 'rose'],
      ['Talking Video', 'Adınla hitap edilen, sana özel konuşma videoları.', 'video', dkd_images.carBurgundy, 'blue'],
      ['Doğum Günü / Özel Mesaj Videosu', 'Özel anların için kişisel kutlama videosu.', 'gift', dkd_images.yachtGreen, 'green']
    ];
    return DkdPage({ active: 'payment', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-hero dkd-custom-hero' },
        dkd_create_element('div', null, DkdPill({ icon: 'sparkle', children: 'Ana Sayfa › Özel İçerik' }), dkd_create_element('h1', null, 'Özel İçerik'), dkd_create_element('p', null, 'Kıyafet, fikir veya tema gönder — sana özel Anyela konsepti hazırlansın.')),
        DkdPortrait({ image: dkd_images.hero, badge: false })
      ),
      DkdSectionTitle({ icon: 'sparkle', title: 'Özel İçerik Seçenekleri' }),
      dkd_create_element('section', { className: 'dkd-feature-grid dkd-four-grid' }, dkd_options.map(function (dkd_option) { return DkdFeatureCard({ key: dkd_option[0], title: dkd_option[0], text: dkd_option[1], icon: dkd_option[2], image: dkd_option[3], tone: dkd_option[4], link: '/AnyelaBorn/payment/' }); })),
      DkdSectionTitle({ icon: 'sparkle', title: 'Konseptini Oluştur' }),
      dkd_create_element('section', { className: 'dkd-concept-builder' },
        dkd_create_element('article', null, dkd_create_element('b', null, '1'), dkd_create_element('h3', null, 'Kıyafet Yükle'), dkd_create_element('p', null, 'İlham kaynağın olan kıyafet fotoğrafını yükle.'), dkd_create_element('div', { className: 'dkd-upload-box' }, DkdIcon({ name: 'upload' }), 'Dosya Seç veya Sürükle', dkd_create_element('small', null, 'PNG, JPG (Maks. 10MB)'))),
        dkd_create_element('article', null, dkd_create_element('b', null, '2'), dkd_create_element('h3', null, 'Tema Seç'), dkd_create_element('p', null, 'Hayalindeki konsepti seç veya fikrini yaz.'), dkd_create_element('div', { className: 'dkd-theme-tags' }, ['Romantik','Glamour','Siyah & Deri','Beach','Night Vibes','Özel Fikrim Var'].map(function (dkd_tag) { return dkd_create_element('span', { key: dkd_tag }, dkd_tag); }))),
        dkd_create_element('article', null, dkd_create_element('b', null, '3'), dkd_create_element('h3', null, 'Teslim Türü'), dkd_create_element('p', null, 'İçeriğinin nasıl teslim edileceğini seç.'), dkd_create_element('div', { className: 'dkd-delivery-list' }, ['Fotoğraf Seti','Video (Kısa)','Video (Uzun)'].map(function (dkd_delivery) { return dkd_create_element('span', { key: dkd_delivery }, DkdIcon({ name: 'camera' }), dkd_delivery); })))
      ),
      DkdSectionTitle({ icon: 'sparkle', title: 'İlham Al: Örnek Konseptler' }),
      dkd_create_element('section', { className: 'dkd-gallery-row' }, [dkd_images.carBurgundy, dkd_images.poolWhite, dkd_images.lamboBlack, dkd_images.yachtGold, dkd_images.yachtGreen, dkd_images.yachtNavy].map(function (dkd_image, dkd_index) { return dkd_create_element('img', { key: dkd_index, src: dkd_image, alt: 'Örnek konsept ' + (dkd_index + 1) }); })),
      dkd_create_element('section', { className: 'dkd-cta-band dkd-custom-cta' }, DkdIcon({ name: 'gift' }), dkd_create_element('div', null, dkd_create_element('h2', null, 'Kendi Konseptini Başlat'), dkd_create_element('p', null, 'Hayalini gönder, Anyela sana özel hazırlasın.')), dkd_create_element('a', { href: '/AnyelaBorn/payment/', className: 'dkd-btn dkd-btn-primary' }, 'Konseptini Başlat'))
    ) });
  }

  function DkdAdsPage() {
    return DkdPage({ active: 'ads', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-hero dkd-ads-hero' },
        dkd_create_element('div', null,
          DkdPill({ icon: 'sparkle', children: 'Markanız için AI destekli reklam çözümleri' }),
          dkd_create_element('h1', null, 'Anyela Reklam ', dkd_create_element('span', null, 'Yüzünüz Olsun')),
          dkd_create_element('p', null, 'Markanız için AI destekli reklam içerikleri oluşturun.'),
          dkd_create_element('div', { className: 'dkd-mini-chip-row' }, DkdPill({ icon: 'magic', children: 'AI Destekli İçerik' }), DkdPill({ icon: 'shield', children: 'Güvenilir İş Birliği' }), DkdPill({ icon: 'chart', children: 'Ölçülebilir Sonuçlar' }))
        ),
        DkdPortrait({ image: dkd_images.lamboBlack, badge: false })
      ),
      DkdSectionTitle({ icon: 'user', title: 'Kimler İçin?', sub: 'Güvenilir, estetik ve etkili içeriklerle markasını büyütmek isteyen markalar.' }),
      dkd_create_element('section', { className: 'dkd-sector-grid dkd-four-grid' }, ['E-ticaret Markaları','Güzellik & Kozmetik Markaları','Moda & Aksesuar Markaları','Uygulama & Teknoloji Markaları'].map(function (dkd_sector, dkd_index) { return DkdMiniTrust({ key: dkd_sector, icon: ['bag','palette','hanger','phone'][dkd_index], title: dkd_sector, text: '' }); })),
      DkdSectionTitle({ icon: 'sparkle', title: 'Nasıl Çalışır?' }),
      dkd_create_element('section', { className: 'dkd-steps-grid dkd-four-grid' },
        DkdStepCard({ no: '1', icon: 'file', title: 'İhtiyacını Paylaş', text: 'Markanızı ve hedefinizi paylaşın.', tone: 'violet' }),
        DkdStepCard({ no: '2', icon: 'target', title: 'Strateji Oluştur', text: 'AI destekli içerik planı hazırlanır.', tone: 'rose' }),
        DkdStepCard({ no: '3', icon: 'video', title: 'İçerik Üret & Yayınla', text: 'Özgün içerikler üretilir ve paylaşılır.', tone: 'blue' }),
        DkdStepCard({ no: '4', icon: 'chart', title: 'Sonuçları Ölç', text: 'Performans raporları ile büyütürüz.', tone: 'green' })
      ),
      DkdSectionTitle({ icon: 'star', title: 'Paketler' }),
      dkd_create_element('section', { className: 'dkd-ad-package-grid dkd-four-grid' }, dkd_ad_packages.map(function (dkd_item) { return dkd_create_element('article', { key: dkd_item.title, className: 'dkd-ad-card ' + dkd_item.tone }, dkd_item.badge ? dkd_create_element('span', { className: 'dkd-badge' }, dkd_item.badge) : null, dkd_create_element('div', { className: 'dkd-package-icon' }, DkdIcon({ name: dkd_item.icon })), dkd_create_element('h3', null, dkd_item.title), dkd_create_element('p', null, dkd_item.detail), dkd_create_element('ul', null, dkd_item.points.map(function (dkd_point) { return dkd_create_element('li', { key: dkd_point }, DkdIcon({ name: 'check' }), dkd_point); })), dkd_create_element('a', { href: '/AnyelaBorn/payment/' }, 'Detayları Gör')); })),
      dkd_create_element('section', { className: 'dkd-info-strip' }, DkdMiniTrust({ icon: 'shield', title: 'İş Birliği / Reklam etiketi', text: 'Tüm iş birlikleri #reklam etiketi ile paylaşılır.' }), DkdMiniTrust({ icon: 'star', title: 'Profesyonel teslim süreci', text: 'Planlama, çekim ve yayınlama profesyonelce yönetilir.' }), DkdMiniTrust({ icon: 'lock', title: 'Güvenli & yasal', text: 'KVKK uyumlu veri güvenliği.' })),
      dkd_create_element('section', { className: 'dkd-lead-form' }, dkd_create_element('div', null, DkdIcon({ name: 'mail' }), dkd_create_element('h2', null, 'Markanız İçin Teklif Alın'), dkd_create_element('p', null, 'Kısa bilgilerinizi bırakın, ekibimiz sizinle iletişime geçsin.')), dkd_create_element('div', null, ['Marka Adı','Sektör','Hedef','E-posta','Telefon (İsteğe bağlı)'].map(function (dkd_field) { return dkd_create_element('input', { key: dkd_field, placeholder: dkd_field, readOnly: true }); })), dkd_create_element('a', { href: '/AnyelaBorn/payment/' }, 'Teklif Al'))
    ) });
  }

  function DkdPaymentPage() {
    return DkdPage({ active: 'payment', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-hero dkd-payment-hero' },
        dkd_create_element('div', null, dkd_create_element('h1', null, 'Ödeme ve Başlangıç'), dkd_create_element('p', null, 'Paketi seç, ödemeni yap, dekontunu gönder')),
        DkdPortrait({ image: dkd_images.hero, badge: false })
      ),
      dkd_create_element('section', { className: 'dkd-payment-steps' }, ['Ödeme','Dekont','Onay','Başlangıç'].map(function (dkd_label, dkd_index) { return dkd_create_element('span', { key: dkd_label, className: dkd_index === 0 ? 'dkd-active' : '' }, DkdIcon({ name: ['card','file','shield','rocket'][dkd_index] }), dkd_label); })),
      dkd_create_element('section', { className: 'dkd-selected-package' }, DkdIcon({ name: 'gift' }), dkd_create_element('div', null, dkd_create_element('h2', null, 'Seçilen Paket'), dkd_create_element('p', null, '%100 Gizlilik Paketi'), dkd_create_element('small', null, 'Güvenli ve özel süreç')), dkd_create_element('strong', null, '₺1.999', dkd_create_element('small', null, 'Tek seferlik ödeme'))),
      dkd_create_element('section', { className: 'dkd-payment-card' }, dkd_create_element('h2', null, DkdIcon({ name: 'card' }), 'IBAN ile Ödeme'), dkd_create_element('p', null, 'Aşağıdaki hesaba ödemenizi yapınız.'), dkd_create_element('div', { className: 'dkd-bank-table' }, dkd_create_element('span', null, 'Banka'), dkd_create_element('b', null, 'Garanti BBVA'), dkd_create_element('span', null, 'IBAN'), dkd_create_element('b', null, 'TR23 0006 2000 1230 0006 2958 01'), dkd_create_element('span', null, 'Alıcı'), dkd_create_element('b', null, 'Anyela Born Club')), dkd_create_element('button', null, DkdIcon({ name: 'copy' }), 'Kopyala'), dkd_create_element('small', null, 'Ödemelerinizi yalnızca yukarıdaki IBAN’a yapınız.')),
      dkd_create_element('section', { className: 'dkd-code-card' }, dkd_create_element('div', null, dkd_create_element('h2', null, 'Açıklama Kodu'), dkd_create_element('strong', null, 'ABC 7294')), dkd_create_element('p', null, 'Ödemenizi yaparken açıklama kısmına bu kodu yazmanız gerekmektedir.'), dkd_create_element('button', null, DkdIcon({ name: 'copy' }), 'Kopyala')),
      dkd_create_element('section', { className: 'dkd-upload-payment' }, dkd_create_element('div', null, dkd_create_element('h2', null, DkdIcon({ name: 'upload' }), 'Dekont Yükle'), dkd_create_element('p', null, 'PDF, JPG veya PNG • Maks. 10MB')), dkd_create_element('button', null, DkdIcon({ name: 'file' }), 'Dosya Seç')),
      dkd_create_element('section', { className: 'dkd-safe-panel' }, DkdIcon({ name: 'shield' }), dkd_create_element('div', null, dkd_create_element('h2', null, 'Güvenli, Hızlı ve Şeffaf Süreç'), dkd_create_element('p', null, 'Onay sonrası sohbet veya sipariş sürecin başlatılır.')), dkd_create_element('ul', null, ['%100 gizlilik','Güvenli ödeme','Hızlı onay','7/24 destek'].map(function (dkd_item) { return dkd_create_element('li', { key: dkd_item }, DkdIcon({ name: 'check' }), dkd_item); }))),
      dkd_create_element('a', { href: '/AnyelaBorn/faq/', className: 'dkd-submit-wide' }, DkdIcon({ name: 'rocket' }), 'Dekont Gönder')
    ) });
  }

  function DkdFaqPage() {
    const dkd_faq = ['Anyela gerçek kişi mi?', 'Ödeme nasıl yapılıyor?', 'Sohbet nasıl başlıyor?', 'Sesli mesaj nasıl geliyor?', 'İade var mı?', 'Gönderdiğim içerikler gizli mi?'];
    return DkdPage({ active: 'payment', children: dkd_create_element(React.Fragment, null,
      dkd_create_element('section', { className: 'dkd-page-hero dkd-faq-hero' },
        dkd_create_element('div', null, DkdPill({ icon: 'sparkle', children: 'Anyela Born • AI Influencer' }), dkd_create_element('h1', null, 'SSS & Yardım'), dkd_create_element('p', null, 'Merak ettiğin her şeyi burada bulabilirsin. Sorularına hızlı, net ve güvenilir cevaplar.')),
        dkd_create_element('div', { className: 'dkd-help-illustration' }, DkdIcon({ name: 'help' }))
      ),
      dkd_create_element('section', { className: 'dkd-faq-trust-card' }, DkdIcon({ name: 'shield' }), dkd_create_element('div', null, dkd_create_element('h2', null, 'Anyela gerçekte sanal bir AI influencer karakteridir.'), dkd_create_element('p', null, 'Tüm sohbetler, sesli mesajlar, görseller ve videolar eğlence ve kişisel kullanım amacıyla sunulur. Sipariş ettiğiniz özel içerikler size özel olarak hazırlanır.')), dkd_create_element('footer', null, DkdMiniTrust({ icon: 'lock', title: '%100 Gizlilik', text: 'Güvenli süreç' }), DkdMiniTrust({ icon: 'user', title: 'Sanal Karakter', text: 'Gerçek kişi değildir' }), DkdMiniTrust({ icon: 'star', title: 'Eğlence Amaçlı', text: 'Kişisel kullanım' }))),
      DkdSectionTitle({ icon: 'sparkle', title: 'Sık Sorulan Sorular' }),
      dkd_create_element('section', { className: 'dkd-accordion' }, dkd_faq.map(function (dkd_question, dkd_index) { return dkd_create_element('details', { key: dkd_question }, dkd_create_element('summary', null, DkdIcon({ name: ['help','card','chat','mic','rocket','lock'][dkd_index] }), dkd_question), dkd_create_element('p', null, 'Bu süreç manuel onaylı, gizlilik odaklı ve Anyela Born Club deneyimine özel hazırlanır.')) })),
      DkdSectionTitle({ icon: 'phone', title: 'Destek Ekibimiz Sizinle', sub: 'Soruların veya yardıma ihtiyacın mı var? Biz buradayız!' }),
      dkd_create_element('section', { className: 'dkd-support-grid' }, DkdMiniTrust({ icon: 'whatsapp', title: 'WhatsApp Destek', text: '7/24 aktif', tone: 'green' }), DkdMiniTrust({ icon: 'instagram', title: 'Instagram DM', text: '7/24 aktif', tone: 'rose' }), DkdMiniTrust({ icon: 'mail', title: 'E-posta', text: '24 saat içinde yanıt', tone: 'blue' })),
      dkd_create_element('section', { className: 'dkd-satisfaction' }, dkd_create_element('strong', null, 'Senin memnuniyetin bizim için her şeyden önemli.'), dkd_create_element('span', null, 'Güvenle sor, gönül rahatlığıyla keyfini çıkar.'), DkdIcon({ name: 'heart' }))
    ) });
  }

  function DkdApp() {
    const dkd_path = window.location.pathname.replace(/\/$/, '');
    if (dkd_path.endsWith('/packages')) return DkdPackagesPage();
    if (dkd_path.endsWith('/chat')) return DkdChatPage();
    if (dkd_path.endsWith('/voice')) return DkdVoicePage();
    if (dkd_path.endsWith('/custom')) return DkdCustomPage();
    if (dkd_path.endsWith('/ads')) return DkdAdsPage();
    if (dkd_path.endsWith('/payment')) return DkdPaymentPage();
    if (dkd_path.endsWith('/faq')) return DkdFaqPage();
    return DkdHomePage();
  }

  ReactDOM.createRoot(document.getElementById('dkd-root')).render(DkdApp());
})();
