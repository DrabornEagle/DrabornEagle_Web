import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';

const dkd_el = React.createElement;

const dkd_routes = [
  { dkd_key: 'home', dkd_label: 'Ana Sayfa', dkd_icon: '✦', dkd_path: '/AnyelaBorn/' },
  { dkd_key: 'chat', dkd_label: 'Sohbet', dkd_icon: '💬', dkd_path: '/AnyelaBorn/chat/' },
  { dkd_key: 'voice', dkd_label: 'Ses', dkd_icon: '🎙️', dkd_path: '/AnyelaBorn/voice/' },
  { dkd_key: 'packages', dkd_label: 'Paketler', dkd_icon: '◈', dkd_path: '/AnyelaBorn/packages/' },
  { dkd_key: 'ads', dkd_label: 'Reklam', dkd_icon: '📣', dkd_path: '/AnyelaBorn/ads/' },
  { dkd_key: 'faq', dkd_label: 'SSS', dkd_icon: '؟', dkd_path: '/AnyelaBorn/faq/' }
];

const dkd_serviceCards = [
  { dkd_title: 'Yazılı Sohbet', dkd_desc: 'Anyela ile 10 veya 30 dakikalık özel mesajlaşma deneyimi. Başlangıç için en kolay yol.', dkd_icon: '💬', dkd_link: '/AnyelaBorn/chat/', dkd_accent: 'rgba(24,245,255,0.22)' },
  { dkd_title: 'Sesli Mesaj', dkd_desc: 'Sen sesli mesaj gönder, Anyela sana karakter sesiyle kişiye özel cevap hazırlasın.', dkd_icon: '🎙️', dkd_link: '/AnyelaBorn/voice/', dkd_accent: 'rgba(55,232,163,0.22)' },
  { dkd_title: 'Özel İçerik', dkd_desc: 'Kıyafet, tema veya fikir gönder; Anyela için özel görsel/video konsepti hazırlansın.', dkd_icon: '🎬', dkd_link: '/AnyelaBorn/custom/', dkd_accent: 'rgba(255,110,167,0.24)' },
  { dkd_title: 'Marka Reklamı', dkd_desc: 'İşletmen için Anyela ile sosyal medyaya uygun AI reklam içerikleri oluştur.', dkd_icon: '📣', dkd_link: '/AnyelaBorn/ads/', dkd_accent: 'rgba(246,199,111,0.22)' }
];

const dkd_packages = [
  { dkd_group: 'fan', dkd_title: 'Anyela Intro', dkd_tag: 'Başlangıç', dkd_price: '149 TL', dkd_desc: '10 dakika yazılı tanışma sohbeti.', dkd_features: ['10 dk yazılı sohbet', 'Sade ve hızlı başlangıç', 'Ödeme sonrası manuel onay'], dkd_slug: 'intro' },
  { dkd_group: 'fan', dkd_title: 'Private Chat', dkd_tag: 'Popüler', dkd_price: '499 TL', dkd_desc: '30 dakika özel yazılı sohbet.', dkd_features: ['30 dk özel sohbet', 'Öncelikli dönüş', 'Ekstra içerik isteği açılabilir'], dkd_slug: 'private-chat' },
  { dkd_group: 'fan', dkd_title: 'Voice Message', dkd_tag: 'Ses', dkd_price: '249 TL', dkd_desc: 'Anyela’dan 1 kişiye özel sesli mesaj.', dkd_features: ['Kısa kişisel sesli cevap', 'Ad ile hitap opsiyonu', 'Teslim: manuel onay sonrası'], dkd_slug: 'voice-message' },
  { dkd_group: 'fan', dkd_title: 'Voice Chat Private', dkd_tag: 'Premium', dkd_price: '999 TL', dkd_desc: '30 dakika sesli mesajlaşma penceresi.', dkd_features: ['Sesli mesaj gönderme', 'Anyela sesiyle cevap', 'WhatsApp sesli not mantığı'], dkd_slug: 'voice-chat-private' },
  { dkd_group: 'custom', dkd_title: 'Style Try-On', dkd_tag: 'Görsel', dkd_price: '399 TL', dkd_desc: 'Kıyafet referansından 2 özel görsel konsepti.', dkd_features: ['2 özel konsept görsel', 'Kıyafet/tema referansı', 'Benzer tarz / ilham yaklaşımı'], dkd_slug: 'style-try-on' },
  { dkd_group: 'custom', dkd_title: 'Photo Set', dkd_tag: 'Set', dkd_price: '999 TL', dkd_desc: '5 özel Anyela görseli.', dkd_features: ['5 görsel konsept', 'Farklı poz ve atmosfer', 'Sosyal medya odaklı çıktı'], dkd_slug: 'photo-set' },
  { dkd_group: 'custom', dkd_title: 'Talking Video', dkd_tag: 'Video', dkd_price: '1.500 TL+', dkd_desc: 'Kişiye özel kısa konuşmalı video.', dkd_features: ['Kısa konuşmalı video', 'Metin/senaryo desteği', 'Süre ve detay fiyatı değiştirir'], dkd_slug: 'talking-video' },
  { dkd_group: 'custom', dkd_title: 'VIP Fan Pack', dkd_tag: 'VIP', dkd_price: '1.999 TL+', dkd_desc: 'Sohbet + ses + özel görsel kombinasyonu.', dkd_features: ['30 dk sohbet', '1 sesli mesaj', '3 özel görsel'], dkd_slug: 'vip-fan-pack' },
  { dkd_group: 'business', dkd_title: 'Reklam Mini', dkd_tag: 'İşletme', dkd_price: '1.500 TL', dkd_desc: '1 kısa video + 1 görsel + açıklama metni.', dkd_features: ['Sosyal medya reklam konsepti', '1 video fikri/teslimi', 'Kısa açıklama metni'], dkd_slug: 'reklam-mini' },
  { dkd_group: 'business', dkd_title: 'Reklam Standart', dkd_tag: 'İşletme', dkd_price: '4.500 TL', dkd_desc: '3 video + 3 görsel + 3 açıklama.', dkd_features: ['3 sosyal medya videosu', '3 görsel konsept', 'Paylaşım metinleri'], dkd_slug: 'reklam-standart' },
  { dkd_group: 'business', dkd_title: 'Reklam Pro', dkd_tag: 'İşletme', dkd_price: '7.500 TL', dkd_desc: '5 video + 5 görsel + story/reels seti.', dkd_features: ['5 video konsepti', 'Story/Reels seti', 'Daha kapsamlı kampanya'], dkd_slug: 'reklam-pro' },
  { dkd_group: 'business', dkd_title: 'Marka Yüzü', dkd_tag: 'Teklif', dkd_price: '12.000 TL+', dkd_desc: 'Özel kampanya ve sponsorlu paylaşım modeli.', dkd_features: ['Marka yüzü konsepti', 'Sponsorlu/reklam etiketi', 'Proje bazlı teklif'], dkd_slug: 'marka-yuzu' }
];

const dkd_faqs = [
  { dkd_question: 'Anyela gerçek bir kişi mi?', dkd_answer: 'Hayır. Anyela Born sanal bir AI influencer karakteridir. Deneyim eğlence, yaratıcı içerik ve marka reklam konseptleri için tasarlanır.' },
  { dkd_question: 'Ödeme nasıl yapılacak?', dkd_answer: 'İlk sürümde ödeme IBAN ile manuel alınır. Kullanıcı ödeme açıklama kodunu yazar, dekont gönderir ve onay sonrası hizmet başlatılır.' },
  { dkd_question: 'Sohbet tamamen otomatik mi?', dkd_answer: 'İlk sürüm kontrollü ilerler. Amaç yanlış/uygunsuz cevap riskini azaltmak ve ilk satışları güvenli şekilde test etmektir.' },
  { dkd_question: 'Sesli mesaj sistemi nasıl çalışır?', dkd_answer: 'Kullanıcı sesli mesaj gönderir; Anyela karakterine uygun cevap hazırlanır ve karakter sesiyle ses dosyası olarak teslim edilir.' },
  { dkd_question: 'Gönderdiğim kıyafet veya görseller nasıl kullanılır?', dkd_answer: 'Yüklenen referanslar sadece sipariş üretimi ve destek süreci için kullanılır. Marka/logolu birebir kopya yerine benzer tarz ve ilham yaklaşımı tercih edilir.' },
  { dkd_question: 'İade koşulları nasıl olacak?', dkd_answer: 'Hizmet başlamadan önce iptal talebi değerlendirilebilir. Hizmet başladıktan sonra iade koşulları paket ve üretim durumuna göre ayrıca belirtilir.' }
];

function dkd_getCurrentRoute() {
  const dkd_pathname = window.location.pathname.toLowerCase();
  if (dkd_pathname.includes('/packages')) return 'packages';
  if (dkd_pathname.includes('/chat')) return 'chat';
  if (dkd_pathname.includes('/voice')) return 'voice';
  if (dkd_pathname.includes('/custom')) return 'custom';
  if (dkd_pathname.includes('/ads')) return 'ads';
  if (dkd_pathname.includes('/payment')) return 'payment';
  if (dkd_pathname.includes('/faq')) return 'faq';
  return 'home';
}

function DkdHeader({ dkd_currentRoute }) {
  return dkd_el('header', { className: 'dkd-header' },
    dkd_el('div', { className: 'dkd-container dkd-header-inner' },
      dkd_el('a', { className: 'dkd-brand', href: '/AnyelaBorn/' },
        dkd_el('div', { className: 'dkd-brand-mark' }, 'AB'),
        dkd_el('div', { className: 'dkd-brand-title' }, 'Anyela Born', dkd_el('span', null, 'Club Platform'))
      ),
      dkd_el('nav', { className: 'dkd-nav', 'aria-label': 'Ana menü' },
        dkd_routes.map((dkd_route) => dkd_el('a', { key: dkd_route.dkd_key, href: dkd_route.dkd_path, className: dkd_currentRoute === dkd_route.dkd_key ? 'dkd-active' : '' }, dkd_route.dkd_label))
      ),
      dkd_el('div', { className: 'dkd-header-actions' },
        dkd_el('a', { className: 'dkd-button dkd-button-soft', href: '/AnyelaBorn/payment/' }, 'Ödeme'),
        dkd_el('a', { className: 'dkd-button dkd-button-primary', href: '/AnyelaBorn/packages/' }, 'Başla')
      )
    )
  );
}

function DkdMobileNav({ dkd_currentRoute }) {
  const dkd_mobileRoutes = [
    { dkd_key: 'home', dkd_label: 'Ana', dkd_icon: '✦', dkd_path: '/AnyelaBorn/' },
    { dkd_key: 'chat', dkd_label: 'Sohbet', dkd_icon: '💬', dkd_path: '/AnyelaBorn/chat/' },
    { dkd_key: 'packages', dkd_label: 'Paket', dkd_icon: '◈', dkd_path: '/AnyelaBorn/packages/' },
    { dkd_key: 'ads', dkd_label: 'Reklam', dkd_icon: '📣', dkd_path: '/AnyelaBorn/ads/' },
    { dkd_key: 'payment', dkd_label: 'Başla', dkd_icon: '✓', dkd_path: '/AnyelaBorn/payment/' }
  ];
  return dkd_el('nav', { className: 'dkd-mobile-nav', 'aria-label': 'Mobil menü' },
    dkd_mobileRoutes.map((dkd_route) => dkd_el('a', { key: dkd_route.dkd_key, href: dkd_route.dkd_path, className: dkd_currentRoute === dkd_route.dkd_key ? 'dkd-active' : '' },
      dkd_el('span', null, dkd_route.dkd_icon),
      dkd_route.dkd_label
    ))
  );
}

function DkdFooter() {
  return dkd_el('footer', { className: 'dkd-footer' },
    dkd_el('div', { className: 'dkd-container dkd-footer-grid' },
      dkd_el('div', null,
        dkd_el('div', { className: 'dkd-brand', style: { marginBottom: '14px' } },
          dkd_el('div', { className: 'dkd-brand-mark' }, 'AB'),
          dkd_el('div', { className: 'dkd-brand-title' }, 'Anyela Born', dkd_el('span', null, 'AI Character Platform'))
        ),
        dkd_el('p', null, 'Sohbet, sesli mesaj, özel içerik ve marka reklam deneyimleri için premium AI karakter platformu.')
      ),
      dkd_el('div', null,
        dkd_el('h4', null, 'Platform'),
        dkd_el('a', { href: '/AnyelaBorn/chat/' }, 'Sohbet'),
        dkd_el('a', { href: '/AnyelaBorn/voice/' }, 'Sesli Mesaj'),
        dkd_el('a', { href: '/AnyelaBorn/custom/' }, 'Özel İçerik')
      ),
      dkd_el('div', null,
        dkd_el('h4', null, 'Satış'),
        dkd_el('a', { href: '/AnyelaBorn/packages/' }, 'Paketler'),
        dkd_el('a', { href: '/AnyelaBorn/ads/' }, 'Reklam Paketi'),
        dkd_el('a', { href: '/AnyelaBorn/payment/' }, 'Ödeme')
      ),
      dkd_el('div', null,
        dkd_el('h4', null, 'Güven'),
        dkd_el('a', { href: '/AnyelaBorn/faq/' }, 'SSS ve Kurallar'),
        dkd_el('a', { href: 'mailto:info@draborneagle.com' }, 'info@draborneagle.com'),
        dkd_el('p', null, '© 2026 Anyela Born Club')
      )
    )
  );
}

function DkdPageShell({ dkd_currentRoute, children }) {
  return dkd_el('div', { className: 'dkd-app' },
    dkd_el(DkdHeader, { dkd_currentRoute }),
    dkd_el('main', { className: 'dkd-page' }, children),
    dkd_el(DkdFooter, null),
    dkd_el(DkdMobileNav, { dkd_currentRoute })
  );
}

function DkdSectionHead({ dkd_kicker, dkd_title, dkd_text, dkd_action }) {
  return dkd_el('div', { className: 'dkd-section-head' },
    dkd_el('div', null,
      dkd_kicker ? dkd_el('div', { className: 'dkd-kicker' }, dkd_kicker) : null,
      dkd_el('h2', null, dkd_title),
      dkd_text ? dkd_el('p', null, dkd_text) : null
    ),
    dkd_action || null
  );
}

function DkdServiceCard({ dkd_card }) {
  return dkd_el('article', { className: 'dkd-card dkd-service-card', style: { '--dkd-accent': dkd_card.dkd_accent } },
    dkd_el('div', { className: 'dkd-icon-box' }, dkd_card.dkd_icon),
    dkd_el('h3', null, dkd_card.dkd_title),
    dkd_el('p', null, dkd_card.dkd_desc),
    dkd_el('a', { className: 'dkd-card-link', href: dkd_card.dkd_link }, 'Detayları gör →')
  );
}

function DkdPackageCard({ dkd_package }) {
  return dkd_el('article', { className: 'dkd-card dkd-package-card' },
    dkd_el('div', { className: 'dkd-package-top' },
      dkd_el('div', null,
        dkd_el('span', { className: 'dkd-badge' }, dkd_package.dkd_tag),
        dkd_el('h3', null, dkd_package.dkd_title),
        dkd_el('p', null, dkd_package.dkd_desc)
      ),
      dkd_el('div', { className: 'dkd-price' }, dkd_package.dkd_price)
    ),
    dkd_el('ul', { className: 'dkd-feature-list' }, dkd_package.dkd_features.map((dkd_feature) => dkd_el('li', { key: dkd_feature }, dkd_feature))),
    dkd_el('a', { className: 'dkd-button dkd-button-primary dkd-button-block', href: `/AnyelaBorn/payment/?package=${encodeURIComponent(dkd_package.dkd_slug)}` }, 'Paketi seç')
  );
}

function DkdHeroShowcase() {
  return dkd_el('div', { className: 'dkd-showcase' },
    dkd_el('div', { className: 'dkd-phone-card' },
      dkd_el('div', { className: 'dkd-phone-screen' },
        dkd_el('div', { className: 'dkd-phone-top' },
          dkd_el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
            dkd_el('div', { className: 'dkd-avatar-mini' }, 'AB'),
            dkd_el('div', null,
              dkd_el('strong', null, 'Anyela'),
              dkd_el('div', { className: 'dkd-online-line' }, dkd_el('span', { className: 'dkd-proof-dot' }), 'AI karakter aktif')
            )
          ),
          dkd_el('span', { className: 'dkd-badge' }, 'Önizleme')
        ),
        dkd_el('div', { className: 'dkd-phone-body' },
          dkd_el('div', { className: 'dkd-media-card' },
            dkd_el('img', { className: 'dkd-avatar-portrait', src: '/AnyelaBorn/assets/dkd-anyela-avatar.svg', alt: 'Anyela Born AI karakter görsel alanı' }),
            dkd_el('div', { className: 'dkd-play-orb' }, '▶'),
            dkd_el('div', { className: 'dkd-media-label' },
              dkd_el('div', null,
                dkd_el('h3', null, 'Konuşmalı tanıtım videosu'),
                dkd_el('p', null, 'Kullanıcılar önce deneyimi net şekilde görür, sonra paket seçer.')
              ),
              dkd_el('span', { className: 'dkd-badge' }, '00:45')
            )
          ),
          dkd_el('div', { className: 'dkd-stat-row' },
            dkd_el('div', { className: 'dkd-stat-card' }, dkd_el('strong', null, '4'), dkd_el('span', null, 'ana hizmet')),
            dkd_el('div', { className: 'dkd-stat-card' }, dkd_el('strong', null, '18+'), dkd_el('span', null, 'güven netliği')),
            dkd_el('div', { className: 'dkd-stat-card' }, dkd_el('strong', null, 'IBAN'), dkd_el('span', null, 'manuel onay'))
          )
        )
      )
    )
  );
}

function DkdHomePage() {
  const dkd_homePackages = dkd_packages.filter((dkd_package) => ['private-chat', 'voice-message', 'style-try-on', 'reklam-standart'].includes(dkd_package.dkd_slug));
  return dkd_el(React.Fragment, null,
    dkd_el('section', { className: 'dkd-hero' },
      dkd_el('div', { className: 'dkd-container dkd-hero-grid' },
        dkd_el('div', null,
          dkd_el('div', { className: 'dkd-kicker' }, 'AI karakter deneyim platformu'),
          dkd_el('h1', null, 'Anyela Born ile ', dkd_el('span', { className: 'dkd-gradient-text' }, 'özel ve güven veren'), ' dijital deneyim'),
          dkd_el('p', { className: 'dkd-hero-lead' }, 'Sohbet, sesli mesaj, özel görsel/video ve marka reklam içerikleri için tasarlanmış premium AI influencer karakter platformu.'),
          dkd_el('div', { className: 'dkd-hero-actions' },
            dkd_el('a', { className: 'dkd-button dkd-button-primary', href: '/AnyelaBorn/packages/' }, 'Paketleri incele'),
            dkd_el('a', { className: 'dkd-button dkd-button-violet', href: '/AnyelaBorn/chat/' }, 'Sohbeti gör'),
            dkd_el('a', { className: 'dkd-button dkd-button-ghost', href: '/AnyelaBorn/ads/' }, 'Markam için reklam')
          ),
          dkd_el('div', { className: 'dkd-proof-row' },
            ['AI karakter', '18+ deneyim', 'Manuel ödeme onayı', 'Gizli içerik süreci'].map((dkd_proof) => dkd_el('span', { key: dkd_proof, className: 'dkd-proof-pill' }, dkd_el('span', { className: 'dkd-proof-dot' }), dkd_proof))
          )
        ),
        dkd_el(DkdHeroShowcase, null)
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el(DkdSectionHead, { dkd_kicker: 'Net hizmetler', dkd_title: 'Kullanıcı ne alacağını ilk bakışta anlar.', dkd_text: 'Tek sayfaya her şeyi sıkıştırmak yerine Anyela deneyimini dört ana hizmete ayırdık.' }),
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_serviceCards.map((dkd_card) => dkd_el(DkdServiceCard, { key: dkd_card.dkd_title, dkd_card })))
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el(DkdSectionHead, { dkd_kicker: 'Satın alma akışı', dkd_title: '4 adımda kontrollü başlangıç.', dkd_text: 'İlk sürümde ödeme ve teslim manuel onaylıdır. Böylece güven, kalite ve kontrol kaybolmaz.' }),
        dkd_el('div', { className: 'dkd-step-list' },
          [
            ['1', 'Paket seç', 'Sohbet, sesli mesaj, özel içerik veya reklam paketlerinden birini seç.'],
            ['2', 'IBAN ile öde', 'Açıklama kodunu kullanarak ödemeyi yap.'],
            ['3', 'Dekont gönder', 'Dekontunu yükle veya iletişim kanalından gönder.'],
            ['4', 'Deneyim başlasın', 'Onay sonrası sohbet veya içerik süreci açılır.']
          ].map((dkd_step) => dkd_el('article', { key: dkd_step[0], className: 'dkd-card dkd-step-card' }, dkd_el('div', { className: 'dkd-step-number' }, dkd_step[0]), dkd_el('h3', null, dkd_step[1]), dkd_el('p', null, dkd_step[2])))
        )
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el('div', { className: 'dkd-feature-band' },
          dkd_el('div', null,
            dkd_el('div', { className: 'dkd-kicker' }, 'Güven veren açıklık'),
            dkd_el('h2', null, 'Fan sitesi değil, açık kurallı AI karakter platformu.'),
            dkd_el('p', null, 'Anyela’nın AI karakter olduğu baştan söylenir. Kullanıcı ödeme, içerik ve teslim sürecini net görür. Reklam iş birliklerinde sponsorlu/reklam etiketi kullanılır.')
          ),
          dkd_el('div', { className: 'dkd-mini-list' },
            ['Gerçek kişi gibi yanıltıcı sunum yok', '18+ kullanıcı bilgilendirmesi', 'Dekont ve ödeme manuel onaylı', 'Özel içerikler ayrı paketlenmiş'].map((dkd_item) => dkd_el('div', { key: dkd_item, className: 'dkd-mini-item' }, dkd_el('span', null, '✓'), dkd_item))
          )
        )
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el(DkdSectionHead, { dkd_kicker: 'Öne çıkan paketler', dkd_title: 'İlk satış için sade seçenekler.', dkd_text: 'Kullanıcıyı fiyat karmaşasına boğmadan en anlaşılır paketleri öne çıkarıyoruz.', dkd_action: dkd_el('a', { className: 'dkd-button dkd-button-ghost', href: '/AnyelaBorn/packages/' }, 'Tüm paketler') }),
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_homePackages.map((dkd_package) => dkd_el(DkdPackageCard, { key: dkd_package.dkd_slug, dkd_package })))
      )
    )
  );
}

function DkdPageHero({ dkd_kicker, dkd_title, dkd_text, dkd_noteTitle, dkd_noteText }) {
  return dkd_el('section', { className: 'dkd-page-hero' },
    dkd_el('div', { className: 'dkd-container' },
      dkd_el('div', null,
        dkd_el('div', { className: 'dkd-kicker' }, dkd_kicker),
        dkd_el('h1', null, dkd_title),
        dkd_el('p', null, dkd_text)
      ),
      dkd_el('aside', { className: 'dkd-card dkd-page-note' },
        dkd_el('h3', null, dkd_noteTitle),
        dkd_el('p', null, dkd_noteText)
      )
    )
  );
}

function DkdPackagesPage() {
  const dkd_groups = [
    { dkd_key: 'fan', dkd_title: 'Fan & Sohbet Paketleri' },
    { dkd_key: 'custom', dkd_title: 'Özel İçerik Paketleri' },
    { dkd_key: 'business', dkd_title: 'İşletme Reklam Paketleri' }
  ];
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'Paketler', dkd_title: 'Karmaşık değil, kategori kategori net paketler.', dkd_text: 'Sohbet, sesli mesaj, özel içerik ve reklam seçeneklerini ayrı gruplara böldük. Kullanıcı satın alacağı şeyi kolayca anlar.', dkd_noteTitle: 'Lansman modeli', dkd_noteText: 'İlk sürümde paketler IBAN + dekont onayı ile manuel açılır. Otomatik ödeme ve kullanıcı paneli sonraki aşamada eklenir.' }),
    dkd_groups.map((dkd_group) => dkd_el('section', { key: dkd_group.dkd_key, className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el(DkdSectionHead, { dkd_title: dkd_group.dkd_title, dkd_text: dkd_group.dkd_key === 'business' ? 'Markalar ve işletmeler için Anyela reklam yüzü / tanıtım paketleri.' : 'Bireysel kullanıcılar için eğlence ve yaratıcı içerik deneyimleri.' }),
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_packages.filter((dkd_package) => dkd_package.dkd_group === dkd_group.dkd_key).map((dkd_package) => dkd_el(DkdPackageCard, { key: dkd_package.dkd_slug, dkd_package })))
      )
    ))
  );
}

function DkdChatPage() {
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'Sohbet önizleme', dkd_title: 'Sohbet sayfası sade, kontrollü ve güven veren görünür.', dkd_text: 'Bu alan v1’de deneyim tanıtımıdır. Gerçek sohbet ödeme onayından sonra manuel/yari manuel yönetilir.', dkd_noteTitle: 'Neden kontrollü?', dkd_noteText: 'İlk aşamada otomatik AI cevabı yerine kalite ve güven için cevaplar kontrol edilerek gönderilir.' }),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container dkd-chat-layout' },
        dkd_el('aside', { className: 'dkd-card dkd-chat-panel' },
          dkd_el('span', { className: 'dkd-badge' }, '30 DK Private Chat'),
          dkd_el('h2', null, 'Sohbet akışı'),
          dkd_el('ul', { className: 'dkd-feature-list' },
            ['Paket seçilir ve ödeme onaylanır', 'Kullanıcı yazı, ses veya referans görsel gönderebilir', 'Anyela karakterinde cevap hazırlanır', 'Ekstra görsel/video siparişi açılabilir'].map((dkd_item) => dkd_el('li', { key: dkd_item }, dkd_item))
          ),
          dkd_el('a', { className: 'dkd-button dkd-button-primary dkd-button-block', href: '/AnyelaBorn/packages/' }, 'Sohbet paketi seç')
        ),
        dkd_el('div', { className: 'dkd-card dkd-chat-window' },
          dkd_el('div', { className: 'dkd-message dkd-message-user' }, 'Merhaba Anyela, seninle konuşmak ve tarz önerisi almak istiyorum.'),
          dkd_el('div', { className: 'dkd-message dkd-message-anyela' }, 'Merhaba 💫 Ben Anyela Born, sanal bir AI influencer karakteriyim. Sohbetimiz eğlence ve yaratıcı içerik amaçlı ilerler.'),
          dkd_el('div', { className: 'dkd-message dkd-message-user' }, 'Bu kıyafet tarzından ilham alan özel bir görsel seti hazırlanabilir mi?', dkd_el('div', { className: 'dkd-upload-preview' }, 'Kıyafet referansı yüklendi')),
          dkd_el('div', { className: 'dkd-message dkd-message-anyela dkd-voice-bubble' }, dkd_el('span', null, '▶'), dkd_el('div', { className: 'dkd-wave' }), dkd_el('strong', null, '00:26')),
          dkd_el('div', { className: 'dkd-card', style: { padding: '16px', borderColor: 'rgba(24,245,255,0.28)' } }, dkd_el('strong', null, 'Sesli yanıt hazırlanıyor...'), dkd_el('p', { style: { color: 'var(--dkd-muted)', marginBottom: 0 } }, 'Anyela sesiyle kişiye özel cevap hazırlanıp teslim edilir.')),
          dkd_el('div', { className: 'dkd-input-bar' }, dkd_el('button', { className: 'dkd-button dkd-button-soft' }, '+'), dkd_el('span', null, 'Mesajınızı yazın veya referans gönderin...'), dkd_el('button', { className: 'dkd-button dkd-button-primary' }, 'Gönder'))
        )
      )
    )
  );
}

function DkdVoicePage() {
  const dkd_voiceSteps = [
    ['Voice paketini seç', 'Sadece yazı değil, sesli mesaj deneyimi isteyen kullanıcı için ayrı giriş.'],
    ['Sesli mesaj gönder', 'Kullanıcı mesajını sesli not gibi gönderir.'],
    ['Cevap hazırlanır', 'Anyela karakterinde cevap yazılır ve sese çevrilir.'],
    ['Ses dosyası teslim edilir', 'Kullanıcı Anyela’dan kişiye özel sesli cevap alır.']
  ];
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'Voice', dkd_title: 'Yazmak istemeyen kullanıcı için sesli mesaj deneyimi.', dkd_text: 'Canlı arama yerine sesli mesajlaşma modeliyle daha güvenli, daha ucuz ve daha kontrollü bir başlangıç yapılır.', dkd_noteTitle: 'Başlangıçta canlı arama yok', dkd_noteText: 'V1’de WhatsApp sesli not mantığı kullanılır. Gerçek zamanlı canlı sesli sohbet v3 aşamasına bırakılır.' }),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_voiceSteps.map((dkd_step, dkd_index) => dkd_el('article', { key: dkd_step[0], className: 'dkd-card dkd-step-card' }, dkd_el('div', { className: 'dkd-step-number' }, String(dkd_index + 1)), dkd_el('h3', null, dkd_step[0]), dkd_el('p', null, dkd_step[1]))))
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container dkd-grid-2' },
        dkd_el(DkdPackageCard, { dkd_package: dkd_packages.find((dkd_package) => dkd_package.dkd_slug === 'voice-message') }),
        dkd_el(DkdPackageCard, { dkd_package: dkd_packages.find((dkd_package) => dkd_package.dkd_slug === 'voice-chat-private') })
      )
    )
  );
}

function DkdCustomPage() {
  const dkd_customPackages = dkd_packages.filter((dkd_package) => dkd_package.dkd_group === 'custom');
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'Özel içerik', dkd_title: 'Kıyafet, tema veya fikir gönder; Anyela konsepti üret.', dkd_text: 'Özel görsel ve video tarafını sohbetten ayırdık. Kullanıcı tam olarak ne sipariş ettiğini görür.', dkd_noteTitle: 'Telif ve güven notu', dkd_noteText: 'Marka/logolu birebir kopya yerine benzer tarzdan ilham alan konseptler kullanılır.' }),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_customPackages.map((dkd_package) => dkd_el(DkdPackageCard, { key: dkd_package.dkd_slug, dkd_package })))
      )
    )
  );
}

function DkdAdsPage() {
  const dkd_businessPackages = dkd_packages.filter((dkd_package) => dkd_package.dkd_group === 'business');
  const dkd_sectors = ['Restoran', 'Kafe', 'Butik', 'Güzellik Salonu', 'Otel', 'Emlak', 'Dijital Ürün', 'Oyun/Creator'];
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'İşletme reklamları', dkd_title: 'Anyela Born markanızın AI reklam yüzü olsun.', dkd_text: 'Bu sayfa fanlara değil işletmelere konuşur. Marka, ürün veya hizmet için sosyal medya reklam içerikleri hazırlanır.', dkd_noteTitle: 'Şeffaf reklam', dkd_noteText: 'Anyela hesabında paylaşım yapılırsa reklam/sponsorlu iş birliği etiketi kullanılır.' }),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el(DkdSectionHead, { dkd_title: 'Reklam paketleri', dkd_text: 'Tek video fikrinden marka yüzü kampanyasına kadar büyüyebilen B2B paketler.' }),
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_businessPackages.map((dkd_package) => dkd_el(DkdPackageCard, { key: dkd_package.dkd_slug, dkd_package })))
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container' },
        dkd_el(DkdSectionHead, { dkd_title: 'Kimler kullanabilir?', dkd_text: 'Küçük işletmeler, dijital ürün sahipleri ve sosyal medya görünürlüğünü artırmak isteyen markalar için.' }),
        dkd_el('div', { className: 'dkd-grid-4' }, dkd_sectors.map((dkd_sector) => dkd_el('div', { key: dkd_sector, className: 'dkd-card dkd-service-card' }, dkd_el('div', { className: 'dkd-icon-box' }, '◈'), dkd_el('h3', null, dkd_sector), dkd_el('p', null, 'Kısa video, görsel ve açıklama metniyle sosyal medya tanıtımı.'))))
      )
    ),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container dkd-grid-2' },
        dkd_el('div', { className: 'dkd-card dkd-chat-panel' },
          dkd_el('h2', null, 'Teklif formu'),
          dkd_el('form', { className: 'dkd-form' },
            ['Marka adı', 'Sektör', 'Hedef', 'Bütçe aralığı'].map((dkd_label) => dkd_el('div', { key: dkd_label, className: 'dkd-field' }, dkd_el('label', null, dkd_label), dkd_el('input', { placeholder: dkd_label }))),
            dkd_el('div', { className: 'dkd-field' }, dkd_el('label', null, 'Kısa açıklama'), dkd_el('textarea', { placeholder: 'Markanız için nasıl bir içerik istiyorsunuz?' })),
            dkd_el('a', { className: 'dkd-button dkd-button-primary dkd-button-block', href: 'mailto:info@draborneagle.com?subject=Anyela%20Reklam%20Teklif%20Talebi' }, 'Teklif talep et')
          )
        ),
        dkd_el('div', { className: 'dkd-feature-band', style: { display: 'block' } },
          dkd_el('h2', null, 'Sponsorlu / Reklam etiketi'),
          dkd_el('p', null, 'Marka iş birlikleri tüketiciye açıkça belirtilmelidir. Bu yüzden Anyela hesabında yayınlanan reklam içeriklerinde reklam veya sponsorlu iş birliği ibaresi kullanılır.'),
          dkd_el('div', { className: 'dkd-mini-list', style: { marginTop: '18px' } }, ['Şeffaf iş birliği', 'Güven veren marka imajı', 'Yasal uyuma daha uygun sunum'].map((dkd_item) => dkd_el('div', { key: dkd_item, className: 'dkd-mini-item' }, dkd_el('span', null, '✓'), dkd_item)))
        )
      )
    )
  );
}

function DkdPaymentPage() {
  const dkd_params = new URLSearchParams(window.location.search);
  const dkd_slug = dkd_params.get('package') || 'private-chat';
  const dkd_selectedPackage = dkd_packages.find((dkd_package) => dkd_package.dkd_slug === dkd_slug) || dkd_packages.find((dkd_package) => dkd_package.dkd_slug === 'private-chat');
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'Ödeme ve başlangıç', dkd_title: 'Ödeme sayfası sade, güvenli ve anlaşılır olmalı.', dkd_text: 'Kullanıcı burada ne ödeyeceğini, açıklama kodunu ve dekont sürecini net görür.', dkd_noteTitle: 'IBAN bilgisi', dkd_noteText: 'Canlı satışa geçmeden önce gerçek alıcı adı ve IBAN bilgisi eklenecek.' }),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container dkd-payment-grid' },
        dkd_el('aside', { className: 'dkd-card dkd-chat-panel' },
          dkd_el('span', { className: 'dkd-badge' }, 'Seçilen paket'),
          dkd_el('h2', null, dkd_selectedPackage.dkd_title),
          dkd_el('div', { className: 'dkd-price' }, dkd_selectedPackage.dkd_price),
          dkd_el('p', { style: { color: 'var(--dkd-muted)' } }, dkd_selectedPackage.dkd_desc),
          dkd_el('ul', { className: 'dkd-feature-list' }, dkd_selectedPackage.dkd_features.map((dkd_feature) => dkd_el('li', { key: dkd_feature }, dkd_feature)))
        ),
        dkd_el('div', { className: 'dkd-card dkd-chat-panel' },
          dkd_el('h2', null, 'IBAN ile ödeme'),
          dkd_el('div', { className: 'dkd-iban-row' }, dkd_el('span', null, 'Alıcı adı'), dkd_el('strong', null, 'EKLENECEK')),
          dkd_el('div', { className: 'dkd-iban-row' }, dkd_el('span', null, 'IBAN'), dkd_el('strong', null, 'TR__ ____ ____ ____ ____ ____ __')),
          dkd_el('div', { className: 'dkd-iban-row' }, dkd_el('span', null, 'Açıklama'), dkd_el('strong', null, `ANYELA - kullaniciadi - ${dkd_selectedPackage.dkd_slug}`)),
          dkd_el('div', { className: 'dkd-upload-box' },
            dkd_el('div', null,
              dkd_el('h3', null, 'Dekont yükleme alanı'),
              dkd_el('p', null, 'V1’de dekont WhatsApp/Instagram DM veya e-posta ile alınabilir. V2’de bu alan gerçek yükleme paneline bağlanır.')
            )
          ),
          dkd_el('a', { className: 'dkd-button dkd-button-primary dkd-button-block', href: 'mailto:info@draborneagle.com?subject=Anyela%20Dekont%20Onay' }, 'Dekontu e-posta ile gönder')
        )
      )
    )
  );
}

function DkdFaqPage() {
  return dkd_el(React.Fragment, null,
    dkd_el(DkdPageHero, { dkd_kicker: 'SSS ve kurallar', dkd_title: 'Güven, açıklık ve net kurallar.', dkd_text: 'Site dolandırıcı gibi görünmesin diye Anyela’nın AI karakter olduğu, ödeme akışı ve içerik sınırları açık yazılır.', dkd_noteTitle: 'V1 kuralı', dkd_noteText: 'Kullanıcı ödeme yapmadan önce tüm kuralları görmelidir.' }),
    dkd_el('section', { className: 'dkd-section' },
      dkd_el('div', { className: 'dkd-container dkd-faq-list' }, dkd_faqs.map((dkd_faq) => dkd_el('article', { key: dkd_faq.dkd_question, className: 'dkd-card dkd-faq-item' }, dkd_el('h3', null, dkd_faq.dkd_question), dkd_el('p', null, dkd_faq.dkd_answer))))
    )
  );
}

function DkdApp() {
  const dkd_currentRoute = dkd_getCurrentRoute();
  const dkd_pageMap = {
    home: dkd_el(DkdHomePage),
    packages: dkd_el(DkdPackagesPage),
    chat: dkd_el(DkdChatPage),
    voice: dkd_el(DkdVoicePage),
    custom: dkd_el(DkdCustomPage),
    ads: dkd_el(DkdAdsPage),
    payment: dkd_el(DkdPaymentPage),
    faq: dkd_el(DkdFaqPage)
  };
  return dkd_el(DkdPageShell, { dkd_currentRoute }, dkd_pageMap[dkd_currentRoute] || dkd_pageMap.home);
}

createRoot(document.getElementById('dkd-root')).render(dkd_el(DkdApp));
