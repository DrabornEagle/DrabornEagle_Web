import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';

const h = React.createElement;

const dkd_packages = [
  {
    dkd_title: 'Intro Chat',
    dkd_label: 'Başlangıç',
    dkd_price: '149 TL',
    dkd_text: '10 dakikalık tanışma sohbeti. Yeni gelenler için düşük riskli giriş paketi.',
    dkd_icon: '💬',
    dkd_color: 'cyan',
    dkd_points: ['10 dk yazılı sohbet', 'Anyela karakter tonu', 'Hızlı manuel aktivasyon']
  },
  {
    dkd_title: 'Private Chat',
    dkd_label: 'En net satış paketi',
    dkd_price: '499 TL',
    dkd_text: '30 dakikalık özel yazılı sohbet ve kişiye özel yönlendirme deneyimi.',
    dkd_icon: '💜',
    dkd_color: 'violet',
    dkd_points: ['30 dk özel sohbet', 'Kıyafet/konsept konuşma', 'Öncelikli dönüş']
  },
  {
    dkd_title: 'Voice Message',
    dkd_label: 'Sesli cevap',
    dkd_price: '249 TL',
    dkd_text: 'Anyela’dan kişiye özel sesli mesaj. Yazıdan daha gerçek ve özel hissettirir.',
    dkd_icon: '🎙️',
    dkd_color: 'pink',
    dkd_points: ['1 özel sesli cevap', 'Adla hitap opsiyonu', 'MP3 teslim']
  },
  {
    dkd_title: 'Style Try-On',
    dkd_label: 'Özel görsel',
    dkd_price: '399 TL',
    dkd_text: 'Kullanıcının gönderdiği kıyafet fikrinden Anyela için özel görsel seti.',
    dkd_icon: '✨',
    dkd_color: 'gold',
    dkd_points: ['2 özel görsel', 'Referans kıyafet ilhamı', '24-48 saat teslim']
  },
  {
    dkd_title: 'Talking Video',
    dkd_label: 'Premium video',
    dkd_price: '1.500 TL+',
    dkd_text: 'Kişiye özel kısa konuşmalı video veya marka tanıtım videosu.',
    dkd_icon: '🎬',
    dkd_color: 'emerald',
    dkd_points: ['30-60 sn video', 'Ses + görsel konsept', 'Proje bazlı teslim']
  }
];

const dkd_business_packages = [
  {
    dkd_title: 'Reklam Mini',
    dkd_price: '1.500 TL',
    dkd_desc: '1 kısa video + 1 kapak görseli + açıklama metni',
    dkd_points: ['Reels/Shorts uyumlu', 'Marka tonu düzenleme', 'Hızlı demo üretim']
  },
  {
    dkd_title: 'Reklam Standart',
    dkd_price: '4.500 TL',
    dkd_desc: '3 video + 3 görsel + 3 paylaşım metni',
    dkd_points: ['Kampanya dili', 'Ürün yerleştirme', 'Story/Reels seti']
  },
  {
    dkd_title: 'Marka Yüzü',
    dkd_price: '12.000 TL+',
    dkd_desc: 'Sponsorlu paylaşım ve Anyela konsept kampanyası',
    dkd_points: ['Reklam etiketi', 'Proje bazlı plan', 'Performans raporu']
  }
];

const dkd_steps = [
  ['01', 'Paket seç', 'Kullanıcı sohbet, sesli cevap, görsel/video veya reklam paketini seçer.'],
  ['02', 'Ödeme kodu al', 'IBAN açıklamasında kullanıcı adı ve paket kodu kullanılır.'],
  ['03', 'Dekont gönder', 'Dekont DM, WhatsApp veya form ile iletilir; manuel onay yapılır.'],
  ['04', 'Deneyim başlar', 'Sohbet, sesli cevap veya içerik üretimi güvenli şekilde başlatılır.']
];

const dkd_faq = [
  'Anyela gerçek bir kişi mi?',
  'Sadece sesli mesajla konuşabilir miyim?',
  'Ödeme ve dekont nasıl ilerler?',
  'Markam için Anyela reklam yüzü olabilir mi?',
  'İçeriklerim gizli tutulur mu?'
];

function DkdLogo() {
  return h('a', { className: 'dkd-logo', href: '#dkd-hero', 'aria-label': 'Anyela Born Club ana sayfa' },
    h('span', { className: 'dkd-logo-mark' }, 'Anyela'),
    h('span', { className: 'dkd-logo-sub' }, 'Born Club')
  );
}

function DkdHeader() {
  return h('header', { className: 'dkd-header' },
    h(DkdLogo),
    h('nav', { className: 'dkd-nav', 'aria-label': 'Ana menü' },
      ['Deneyim', 'Paketler', 'Sohbet', 'Reklam', 'Ödeme'].map((dkd_item) => h('a', { key: dkd_item, href: `#dkd-${dkd_item.toLowerCase()}` }, dkd_item))
    ),
    h('div', { className: 'dkd-header-actions' },
      h('a', { className: 'dkd-login-button', href: '#dkd-odeme' }, 'Giriş / Başla'),
      h('button', { className: 'dkd-menu-button', 'aria-label': 'Mobil menü' }, '☰')
    )
  );
}

function DkdHologramCard() {
  return h('section', { className: 'dkd-hologram-card', 'aria-label': 'Anyela dijital karakter önizleme' },
    h('div', { className: 'dkd-holo-toolbar' },
      h('span', null, 'LIVE PREVIEW'),
      h('strong', null, 'AI Character')
    ),
    h('div', { className: 'dkd-holo-stage' },
      h('div', { className: 'dkd-holo-ring dkd-holo-ring-one' }),
      h('div', { className: 'dkd-holo-ring dkd-holo-ring-two' }),
      h('div', { className: 'dkd-avatar-core' },
        h('div', { className: 'dkd-avatar-face' }),
        h('div', { className: 'dkd-avatar-hair' }),
        h('div', { className: 'dkd-avatar-shoulders' }),
        h('div', { className: 'dkd-avatar-spark' }, 'A')
      ),
      h('div', { className: 'dkd-holo-data dkd-holo-data-one' }, 'Voice ready'),
      h('div', { className: 'dkd-holo-data dkd-holo-data-two' }, 'Style prompt'),
      h('button', { className: 'dkd-play-orb', 'aria-label': 'Önizleme oynat' }, '▶')
    ),
    h('div', { className: 'dkd-holo-bottom' },
      h('div', null,
        h('span', null, 'Konuşan tanıtım'),
        h('strong', null, 'Anyela ile güvenli başlangıç')
      ),
      h('small', null, '00:45')
    )
  );
}

function DkdHero() {
  return h('section', { className: 'dkd-hero', id: 'dkd-hero' },
    h('div', { className: 'dkd-hero-copy' },
      h('div', { className: 'dkd-kicker' }, '✦ Premium AI karakter deneyimi'),
      h('h1', null, 'Güven veren, renkli ve profesyonel ', h('span', null, 'Anyela Born Club'), ' deneyimi.'),
      h('p', null, 'Yazılı sohbet, sesli mesaj, özel görsel/video ve markalar için AI reklam yüzü paketleri tek modern web deneyiminde.'),
      h('div', { className: 'dkd-hero-actions' },
        h('a', { href: '#dkd-paketler', className: 'dkd-primary-button' }, 'Paketleri İncele'),
        h('a', { href: '#dkd-reklam', className: 'dkd-secondary-button' }, 'Markam İçin Reklam')
      ),
      h('div', { className: 'dkd-trust-strip' },
        h('span', null, 'AI olduğu açık'),
        h('span', null, '18+ sınır'),
        h('span', null, 'IBAN + dekont takip'),
        h('span', null, 'Manuel onay')
      )
    ),
    h(DkdHologramCard)
  );
}

function DkdProductPillars() {
  const dkd_pillars = [
    ['Fan deneyimi', 'Sohbet, sesli mesaj ve kişiye özel içerikler.', '💎'],
    ['Creator studio', 'Kıyafet referansından görsel/video üretimi.', '🪄'],
    ['Business ads', 'İşletmeler için Anyela reklam yüzü.', '🚀']
  ];
  return h('section', { className: 'dkd-pillar-grid', id: 'dkd-deneyim' },
    dkd_pillars.map(([dkd_title, dkd_text, dkd_icon]) => h('article', { className: 'dkd-pillar-card', key: dkd_title },
      h('div', { className: 'dkd-pillar-icon' }, dkd_icon),
      h('h3', null, dkd_title),
      h('p', null, dkd_text)
    ))
  );
}

function DkdPackageCard({ dkd_package }) {
  return h('article', { className: `dkd-package-card dkd-package-${dkd_package.dkd_color}` },
    h('div', { className: 'dkd-package-top' },
      h('span', { className: 'dkd-package-icon' }, dkd_package.dkd_icon),
      h('em', null, dkd_package.dkd_label)
    ),
    h('h3', null, dkd_package.dkd_title),
    h('strong', null, dkd_package.dkd_price),
    h('p', null, dkd_package.dkd_text),
    h('ul', null, dkd_package.dkd_points.map((dkd_point) => h('li', { key: dkd_point }, '✓ ', dkd_point))),
    h('a', { className: 'dkd-card-button', href: '#dkd-odeme' }, 'Paketi Seç')
  );
}

function DkdPackages() {
  return h('section', { className: 'dkd-section', id: 'dkd-paketler' },
    h('div', { className: 'dkd-section-heading' },
      h('span', null, 'Net fiyat + net içerik'),
      h('h2', null, 'Kullanıcıyı yormayan anlaşılır paketler'),
      h('p', null, 'İlk ödeme alma hedefi için küçük giriş paketleri ve güçlü ekstra satış alanları.')
    ),
    h('div', { className: 'dkd-package-grid' }, dkd_packages.map((dkd_package) => h(DkdPackageCard, { dkd_package, key: dkd_package.dkd_title })))
  );
}

function DkdChatPreview() {
  return h('section', { className: 'dkd-chat-section', id: 'dkd-sohbet' },
    h('div', { className: 'dkd-phone-shell' },
      h('div', { className: 'dkd-phone-header' },
        h('div', { className: 'dkd-avatar-dot' }),
        h('div', null, h('strong', null, 'Anyela'), h('span', null, 'AI karakter • çevrimiçi')),
        h('small', null, '27:14')
      ),
      h('div', { className: 'dkd-chat-bubble dkd-chat-user' }, 'Merhaba Anyela, sadece sesli mesajla konuşmak istiyorum.'),
      h('div', { className: 'dkd-chat-bubble dkd-chat-anyela' }, 'Tabii 💫 Sesli cevap paketini seçebilirsin. Cevabın sana özel tonla hazırlanır.'),
      h('div', { className: 'dkd-voice-message' },
        h('button', null, '▶'),
        h('div', { className: 'dkd-waveform' }, Array.from({ length: 12 }).map((_, dkd_index) => h('span', { key: dkd_index }))),
        h('small', null, '00:26')
      ),
      h('div', { className: 'dkd-upload-preview' }, 'Kıyafet referansı yüklendi • Style Try-On önerildi'),
      h('div', { className: 'dkd-composer-preview' }, 'Mesaj yaz, ses gönder, görsel yükle  ↗')
    ),
    h('div', { className: 'dkd-chat-copy' },
      h('div', { className: 'dkd-kicker' }, 'Yazı + ses + görsel'),
      h('h2', null, 'Sohbet artık sadece mesaj değil; satın alınabilir özel deneyim.'),
      h('p', null, 'İlk sürüm manuel/yari manuel ilerler. Böylece maliyet düşük kalır, yanıt kalitesi senin kontrolünde olur ve kullanıcı güveni artar.'),
      h('div', { className: 'dkd-mini-service-grid' },
        ['Sesli Cevap', 'Style Try-On', 'Konuşmalı Video', 'Reklam Talebi'].map((dkd_item) => h('span', { key: dkd_item }, dkd_item))
      )
    )
  );
}

function DkdBusiness() {
  return h('section', { className: 'dkd-business-section', id: 'dkd-reklam' },
    h('div', { className: 'dkd-business-hero' },
      h('div', null,
        h('div', { className: 'dkd-kicker' }, 'İşletmeler için yaratıcı reklam yüzü'),
        h('h2', null, 'Anyela reklam yüzünüz olsun.'),
        h('p', null, 'Restoran, kafe, butik, güzellik salonu, otel, emlak ve dijital ürünler için profesyonel, şeffaf ve modern AI tanıtım paketleri.'),
        h('a', { href: '#dkd-odeme', className: 'dkd-primary-button' }, 'Teklif Talep Et')
      ),
      h('div', { className: 'dkd-brand-preview' },
        h('span', null, 'YOUR BRAND'),
        h('strong', null, 'Anyela AI Studio'),
        h('small', null, 'Reels • Story • Sponsorlu içerik')
      )
    ),
    h('div', { className: 'dkd-business-grid' }, dkd_business_packages.map((dkd_item) => h('article', { className: 'dkd-business-card', key: dkd_item.dkd_title },
      h('h3', null, dkd_item.dkd_title),
      h('strong', null, dkd_item.dkd_price),
      h('p', null, dkd_item.dkd_desc),
      h('ul', null, dkd_item.dkd_points.map((dkd_point) => h('li', { key: dkd_point }, '✓ ', dkd_point)))
    ))),
    h('div', { className: 'dkd-compliance-card' },
      h('strong', null, 'Güven veren reklam yaklaşımı'),
      h('p', null, 'Anyela hesabında yayınlanacak marka içerikleri “Reklam / İş birliği / Sponsorlu” etiketiyle açıkça belirtilir. Bu, markayı daha güvenilir gösterir.')
    )
  );
}

function DkdPayment() {
  return h('section', { className: 'dkd-payment-section', id: 'dkd-odeme' },
    h('div', { className: 'dkd-payment-copy' },
      h('div', { className: 'dkd-kicker' }, 'Ödeme ve güven'),
      h('h2', null, 'Basit, takip edilebilir ve dolandırıcı gibi görünmeyen ödeme akışı.'),
      h('p', null, 'Sitede kullanıcıya açık ödeme kodu, paket özeti, dekont yönlendirmesi ve manuel onay bilgisi net şekilde gösterilir.')
    ),
    h('div', { className: 'dkd-payment-card' },
      h('div', { className: 'dkd-selected-package' },
        h('span', null, 'Seçilen Paket'),
        h('strong', null, 'Private Chat — 30 DK'),
        h('em', null, '499 TL')
      ),
      h('div', { className: 'dkd-iban-list' },
        h('div', null, h('span', null, 'Banka'), h('strong', null, 'Banka adı eklenecek')),
        h('div', null, h('span', null, 'Alıcı'), h('strong', null, 'Alıcı adı eklenecek')),
        h('div', null, h('span', null, 'IBAN'), h('strong', null, 'TR__ ____ ____ ____ ____ ____ __')),
        h('div', null, h('span', null, 'Açıklama'), h('strong', null, 'ANYELA - kullaniciadi - 30DK'))
      ),
      h('a', { href: 'mailto:info@draborneagle.com', className: 'dkd-card-button' }, 'Dekont / Talep Gönder')
    )
  );
}

function DkdProcess() {
  return h('section', { className: 'dkd-process-section' },
    h('div', { className: 'dkd-section-heading' },
      h('span', null, 'Adım adım'),
      h('h2', null, 'Kullanıcı ne olacağını ilk ekranda anlar')
    ),
    h('div', { className: 'dkd-process-grid' }, dkd_steps.map(([dkd_number, dkd_title, dkd_text]) => h('article', { className: 'dkd-process-card', key: dkd_number },
      h('em', null, dkd_number),
      h('h3', null, dkd_title),
      h('p', null, dkd_text)
    )))
  );
}

function DkdFaq() {
  return h('section', { className: 'dkd-faq-section' },
    h('div', { className: 'dkd-section-heading' },
      h('span', null, 'SSS & güven sınırları'),
      h('h2', null, 'Şeffaflık premium görünümün parçası')
    ),
    h('div', { className: 'dkd-faq-list' }, dkd_faq.map((dkd_item) => h('button', { key: dkd_item }, dkd_item, h('span', null, '+')))),
    h('div', { className: 'dkd-legal-strip' },
      h('span', null, 'Anyela sanal AI karakterdir.'),
      h('span', null, '18+ deneyimdir.'),
      h('span', null, 'Uygunsuz içerik kabul edilmez.'),
      h('span', null, 'Dekontlar yalnızca ödeme onayı için kullanılır.')
    )
  );
}

function DkdFooter() {
  return h('footer', { className: 'dkd-footer' },
    h(DkdLogo),
    h('p', null, 'Anyela Born Club; sohbet, sesli mesaj, özel görsel/video ve marka reklam deneyimini profesyonel bir vitrine taşır.'),
    h('div', { className: 'dkd-footer-links' },
      h('a', { href: 'mailto:info@draborneagle.com' }, 'info@draborneagle.com'),
      h('a', { href: '#dkd-paketler' }, 'Paketler'),
      h('a', { href: '#dkd-reklam' }, 'Reklam'),
      h('a', { href: '#dkd-odeme' }, 'Ödeme')
    )
  );
}

function DkdAnyelaBornApp() {
  return h('main', { className: 'dkd-anyela-app' },
    h('div', { className: 'dkd-bg dkd-bg-one' }),
    h('div', { className: 'dkd-bg dkd-bg-two' }),
    h(DkdHeader),
    h(DkdHero),
    h(DkdProductPillars),
    h(DkdPackages),
    h(DkdChatPreview),
    h(DkdBusiness),
    h(DkdPayment),
    h(DkdProcess),
    h(DkdFaq),
    h(DkdFooter),
    h('aside', { className: 'dkd-mobile-bar', 'aria-label': 'Mobil hızlı işlem çubuğu' },
      h('a', { href: '#dkd-paketler' }, 'Paket'),
      h('a', { href: '#dkd-sohbet' }, 'Sohbet'),
      h('a', { href: '#dkd-reklam' }, 'Reklam')
    )
  );
}

const dkd_root = document.getElementById('root');
if (dkd_root) {
  createRoot(dkd_root).render(h(React.StrictMode, null, h(DkdAnyelaBornApp)));
}
