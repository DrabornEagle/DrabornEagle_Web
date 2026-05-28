import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import {
  Home,
  MessageCircle,
  Package,
  Megaphone,
  Sparkles,
  Menu,
  Crown,
  Bot,
  BadgeCheck,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  UploadCloud,
  WandSparkles,
  Mic,
  Image as ImageIcon,
  Video,
  Gift,
  Headphones,
  Heart,
  ArrowRight,
  Star,
  Box,
  BriefcaseBusiness,
  ClipboardCopy,
  Building2,
  Send,
  Coffee,
  Utensils,
  Shirt,
  Hotel,
  House,
  CircleHelp,
  ChevronDown,
  CheckCircle2,
  Info,
  Rocket,
  ChartNoAxesCombined,
  Gem,
  Camera,
  MessageSquareText,
  UserRound,
  FileUp,
  Play,
  Volume2,
  Clock3,
  Palette,
  PartyPopper,
  BadgeDollarSign,
  Mail
} from 'https://esm.sh/lucide-react@0.468.0?deps=react@18.2.0';

const dkd_asset = '/AnyelaBorn/assets/images/';
const dkd_img = {
  hero: `${dkd_asset}anyela-miami-teal.jpg`,
  pool: `${dkd_asset}anyela-pool-cream.jpg`,
  gold: `${dkd_asset}anyela-yacht-gold.jpg`,
  blue: `${dkd_asset}anyela-yacht-blue.jpg`,
  navy: `${dkd_asset}anyela-yacht-navy.jpg`,
  green: `${dkd_asset}anyela-yacht-green.jpg`,
  champagne: `${dkd_asset}anyela-yacht-champagne.jpg`,
};

const dkd_nav = [
  { path: '/AnyelaBorn/', label: 'Ana Sayfa', icon: Home, key: 'home' },
  { path: '/AnyelaBorn/chat/', label: 'Sohbet', icon: MessageCircle, key: 'chat' },
  { path: '/AnyelaBorn/packages/', label: 'Paketler', icon: Box, key: 'packages' },
  { path: '/AnyelaBorn/ads/', label: 'Reklam', icon: Megaphone, key: 'ads' },
  { path: '/AnyelaBorn/payment/', label: 'Başla', icon: Sparkles, key: 'start' },
];

const dkd_packages = {
  fan: [
    { title: 'Anyela Intro', desc: 'Anyela ile tanışmanın en özel yolu.', price: '259 TL', icon: Heart, tone: 'rose', tag: 'Önerilen' },
    { title: 'Private Chat', desc: 'Anyela ile özel yazılı sohbet.', price: '599 TL', icon: MessageCircle, tone: 'violet' },
    { title: 'Voice Message', desc: 'Kişiye özel sesli mesaj.', price: '349 TL', icon: Volume2, tone: 'cyan' },
    { title: 'Voice Chat Private', desc: 'Anyela ile sesli mesajlaşma.', price: '1.199 TL', icon: Headphones, tone: 'pink' },
  ],
  custom: [
    { title: 'Style Try-On', desc: 'İstediğin kıyafeti Anyela stilinde gör.', price: '1.199 TL', icon: Shirt, tone: 'cyan' },
    { title: 'Photo Set', desc: 'Konseptine özel profesyonel görsel seti.', price: '1.699 TL', icon: ImageIcon, tone: 'violet' },
    { title: 'Talking Video', desc: 'Anyela’dan sana özel konuşan video.', price: '1.999 TL', icon: Video, tone: 'rose' },
    { title: 'VIP Fan Pack', desc: 'Sohbet, ses ve görsel deneyimi.', price: '2.499 TL', icon: Crown, tone: 'gold', tag: 'Premium' },
  ],
  business: [
    { title: 'Reklam Mini', desc: 'Küçük işletmeler için hızlı başlangıç.', price: '2.990 TL', icon: Play, tone: 'cyan' },
    { title: 'Reklam Standart', desc: 'Daha fazla içerik, daha güçlü etki.', price: '5.990 TL', icon: Star, tone: 'violet' },
    { title: 'Reklam Pro', desc: 'Profesyonel kampanyalar için ideal paket.', price: '9.990 TL', icon: Crown, tone: 'rose', tag: 'Popüler' },
    { title: 'Marka Yüzü', desc: 'Anyela Born markanızın yüzü olsun.', price: '19.990 TL', icon: Gem, tone: 'gold' },
  ],
};

const dkd_go = (path) => {
  window.location.href = path;
};

function DkdLogo() {
  return React.createElement('div', { className: 'dkd-logo-wrap' },
    React.createElement('div', { className: 'dkd-logo-mark' },
      React.createElement('span', { className: 'dkd-logo-crown' }, '♛'),
      React.createElement('span', null, 'AB')
    ),
    React.createElement('div', { className: 'dkd-logo-text' }, 'Anyela Born Club')
  );
}

function DkdHeader() {
  return React.createElement('header', { className: 'dkd-header' },
    React.createElement(DkdLogo),
    React.createElement('button', { className: 'dkd-icon-button', 'aria-label': 'Menü' }, React.createElement(Menu, { size: 30 }))
  );
}

function DkdBottomNav({ active }) {
  return React.createElement('nav', { className: 'dkd-bottom-nav' },
    dkd_nav.map((item) => React.createElement('button', {
      key: item.key,
      className: `dkd-nav-item ${active === item.key || (active === 'payment' && item.key === 'start') ? 'dkd-active' : ''}`,
      onClick: () => dkd_go(item.path)
    }, React.createElement(item.icon, { size: 26 }), React.createElement('span', null, item.label)))
  );
}

function DkdPageShell({ active, children }) {
  return React.createElement('main', { className: 'dkd-shell' },
    React.createElement(DkdHeader),
    React.createElement('div', { className: 'dkd-page-body' }, children),
    React.createElement(DkdBottomNav, { active })
  );
}

function DkdIconTile({ icon: Icon, label, sub, tone = 'cyan' }) {
  return React.createElement('div', { className: `dkd-trust-pill dkd-tone-${tone}` },
    React.createElement(Icon, { size: 25 }),
    React.createElement('div', null, React.createElement('strong', null, label), sub && React.createElement('small', null, sub))
  );
}

function DkdHeroCard() {
  return React.createElement('section', { className: 'dkd-hero' },
    React.createElement('div', { className: 'dkd-hero-copy' },
      React.createElement('div', { className: 'dkd-mini-spark' }, '✦'),
      React.createElement('h1', null,
        'Anyela Born ile ', React.createElement('span', null, 'özel AI karakter'), ' deneyimi'
      ),
      React.createElement('p', null, 'Anyela Born ile yazış, sesli yanıtlar al, özel görsel / video iste, markan için iş birlikleri planla.'),
      React.createElement('div', { className: 'dkd-hero-actions' },
        React.createElement('button', { className: 'dkd-primary-btn', onClick: () => dkd_go('/AnyelaBorn/payment/') }, React.createElement(Sparkles, { size: 19 }), ' Deneyimi Başlat'),
        React.createElement('button', { className: 'dkd-ghost-btn', onClick: () => dkd_go('/AnyelaBorn/packages/') }, React.createElement(Gift, { size: 19 }), ' Paketleri İncele')
      ),
      React.createElement('button', { className: 'dkd-text-link', onClick: () => dkd_go('/AnyelaBorn/ads/') }, 'Markam İçin Reklam ', React.createElement(ArrowRight, { size: 18 }))
    ),
    React.createElement('div', { className: 'dkd-hero-media' },
      React.createElement('img', { src: dkd_img.hero, alt: 'Anyela Born portrait' }),
      React.createElement('div', { className: 'dkd-hero-media-glow' }),
      React.createElement('div', { className: 'dkd-neon-sign' }, 'Anyela Born ♡')
    )
  );
}

function DkdHowItWorks() {
  const dkd_steps = [
    { icon: ShoppingBag, title: 'Paket seç', text: 'İhtiyacına uygun paketi seç.', tone: 'cyan' },
    { icon: CreditCard, title: 'Ödemeyi yap', text: 'Güvenli ödeme yöntemini seç.', tone: 'violet' },
    { icon: UploadCloud, title: 'Dekont gönder', text: 'Ödeme dekontunu bize ilet.', tone: 'rose' },
    { icon: WandSparkles, title: 'Deneyim başlasın', text: 'Onay sonrası Anyela seninle.', tone: 'emerald' },
  ];
  return React.createElement('section', { className: 'dkd-panel dkd-how' },
    React.createElement('h2', null, '✨ Nasıl Çalışır?'),
    React.createElement('div', { className: 'dkd-step-grid' },
      dkd_steps.map((step, index) => React.createElement('div', { className: `dkd-step dkd-tone-${step.tone}`, key: step.title },
        React.createElement('b', null, index + 1),
        React.createElement(step.icon, { size: 34 }),
        React.createElement('h3', null, step.title),
        React.createElement('p', null, step.text)
      ))
    )
  );
}

function DkdServiceCard({ icon: Icon, title, text, tone, path }) {
  return React.createElement('button', { className: `dkd-service-card dkd-tone-${tone}`, onClick: () => dkd_go(path) },
    React.createElement('span', { className: 'dkd-service-icon' }, React.createElement(Icon, { size: 48 })),
    React.createElement('span', { className: 'dkd-service-text' }, React.createElement('strong', null, title), React.createElement('small', null, text)),
    React.createElement('span', { className: 'dkd-round-arrow' }, React.createElement(ArrowRight, { size: 20 }))
  );
}

function DkdHomePage() {
  return React.createElement(DkdPageShell, { active: 'home' },
    React.createElement(DkdHeroCard),
    React.createElement('section', { className: 'dkd-trust-row' },
      React.createElement(DkdIconTile, { icon: Bot, label: 'AI karakter', tone: 'cyan' }),
      React.createElement(DkdIconTile, { icon: BadgeCheck, label: '18+', tone: 'rose' }),
      React.createElement(DkdIconTile, { icon: ShieldCheck, label: 'Manuel ödeme onayı', tone: 'emerald' }),
      React.createElement(DkdIconTile, { icon: LockKeyhole, label: 'Gizli içerik', tone: 'gold' })
    ),
    React.createElement(DkdHowItWorks),
    React.createElement('section', { className: 'dkd-service-grid' },
      React.createElement(DkdServiceCard, { icon: MessageCircle, title: 'Yazılı Sohbet', text: 'Anyela Born ile özel yazış.', tone: 'cyan', path: '/AnyelaBorn/chat/' }),
      React.createElement(DkdServiceCard, { icon: Mic, title: 'Sesli Mesaj', text: 'Kişiye özel sesli yanıt al.', tone: 'violet', path: '/AnyelaBorn/voice/' }),
      React.createElement(DkdServiceCard, { icon: ImageIcon, title: 'Özel Görsel / Video', text: 'Sana özel görsel ve videolar iste.', tone: 'rose', path: '/AnyelaBorn/custom/' }),
      React.createElement(DkdServiceCard, { icon: Crown, title: 'Anyela Reklam Yüzünüz Olsun', text: 'Markan için Anyela ile iş birliği yap.', tone: 'gold', path: '/AnyelaBorn/ads/' })
    ),
    React.createElement('section', { className: 'dkd-cta-band' },
      React.createElement(Crown, { size: 34 }),
      React.createElement('div', null, React.createElement('h2', null, 'Anyela Born ile benzersiz bir bağ kur.'), React.createElement('p', null, 'Özel içerikler, kişisel ilgi ve ayrıcalıklı deneyimler seni bekliyor.')),
      React.createElement('button', { className: 'dkd-primary-btn', onClick: () => dkd_go('/AnyelaBorn/payment/') }, 'Hemen Başla ', React.createElement(ArrowRight, { size: 18 }))
    )
  );
}

function DkdPackageCard({ dkd_package }) {
  const Icon = dkd_package.icon;
  return React.createElement('article', { className: `dkd-package-card dkd-tone-${dkd_package.tone}` },
    dkd_package.tag && React.createElement('span', { className: 'dkd-chip' }, `★ ${dkd_package.tag}`),
    React.createElement(Icon, { size: 42 }),
    React.createElement('h3', null, dkd_package.title),
    React.createElement('p', null, dkd_package.desc),
    React.createElement('strong', { className: 'dkd-price' }, dkd_package.price),
    React.createElement('button', { onClick: () => dkd_go('/AnyelaBorn/payment/') }, 'Paketi Seç ', React.createElement(ArrowRight, { size: 17 }))
  );
}

function DkdPackagesPage() {
  return React.createElement(DkdPageShell, { active: 'packages' },
    React.createElement('section', { className: 'dkd-page-title' }, React.createElement('span', null, '✦'), React.createElement('h1', null, 'Paketler'), React.createElement('p', null, 'En özel deneyimi seçmek için doğru yerdesin.')),
    React.createElement(DkdPackageSection, { icon: Heart, title: 'Fan Paketleri', items: dkd_packages.fan }),
    React.createElement(DkdPackageSection, { icon: Sparkles, title: 'Özel İçerik Paketleri', items: dkd_packages.custom }),
    React.createElement(DkdPackageSection, { icon: BriefcaseBusiness, title: 'İşletme Paketleri', items: dkd_packages.business })
  );
}

function DkdPackageSection({ icon: Icon, title, items }) {
  return React.createElement('section', { className: 'dkd-package-section' },
    React.createElement('h2', null, React.createElement(Icon, { size: 28 }), title),
    React.createElement('div', { className: 'dkd-package-grid' }, items.map((item) => React.createElement(DkdPackageCard, { key: item.title, dkd_package: item })))
  );
}

function DkdChatPage() {
  return React.createElement(DkdPageShell, { active: 'chat' },
    React.createElement('section', { className: 'dkd-page-title dkd-split-title' },
      React.createElement('div', null, React.createElement('span', null, '✦'), React.createElement('h1', null, 'Sohbet'), React.createElement('p', null, 'Anyela ile yazılı deneyim')),
      React.createElement('img', { src: dkd_img.pool, alt: 'Anyela profile' })
    ),
    React.createElement('section', { className: 'dkd-info-card' }, React.createElement(MessageCircle, { size: 44 }), React.createElement('div', null, React.createElement('h3', null, 'Bu bir ön izleme demo deneyimidir.'), React.createElement('p', null, 'Gerçek sohbete başlamak için bir paket satın almanız gerekir.'))),
    React.createElement('section', { className: 'dkd-chat-card' },
      React.createElement(DkdMessage, { side: 'left', avatar: dkd_img.pool, name: 'Anyela Born', text: 'Merhaba! 💜\nBen Anyela. Bugün nasılsın?\nSeninle sohbet etmek harika olur.', time: '14:32' }),
      React.createElement(DkdMessage, { side: 'right', text: 'Merhaba Anyela! İyiyim, sen nasılsın? Bugün enerjin harika görünüyor ✨', time: '14:33' }),
      React.createElement(DkdMessage, { side: 'left', avatar: dkd_img.pool, text: 'Teşekkür ederim, tatlısın 💫 Seninle konuşmak da günümü güzelleştiriyor. Neler yapıyorsun?', time: '14:34' }),
      React.createElement(DkdMessage, { side: 'right', text: 'Şu an dinleniyorum, müzik dinliyorum. Senin yeni içeriğini de izledim 😍', time: '14:35' }),
      React.createElement('div', { className: 'dkd-chat-input' }, React.createElement('span', null, 'Mesajını yaz...'), React.createElement(Send, { size: 22 }))
    ),
    React.createElement('section', { className: 'dkd-mini-flow' },
      React.createElement(DkdMiniFlowItem, { icon: ShoppingBag, title: 'Paket seç', text: 'Sohbet paketini seç ve satın al.' }),
      React.createElement(DkdMiniFlowItem, { icon: ShieldCheck, title: 'Ödeme onayı', text: 'Ödemen onaylansın, erişimin aktif olsun.' }),
      React.createElement(DkdMiniFlowItem, { icon: MessageSquareText, title: 'Sohbet başlar', text: 'Anyela ile yazılı sohbete başla.' })
    ),
    React.createElement('section', { className: 'dkd-info-card dkd-wide' }, React.createElement(Info, { size: 34 }), React.createElement('div', null, React.createElement('h3', null, 'İlk sürüm bilgisi'), React.createElement('p', null, 'Sohbet deneyimi şu an manuel veya yarı otomatik yanıt desteği ile sunulmaktadır.'))),
    React.createElement('section', { className: 'dkd-cta-band dkd-slim' }, React.createElement(Heart, { size: 38 }), React.createElement('p', null, 'Gerçek sohbete başlamak için uygun paketi seç.'), React.createElement('button', { className: 'dkd-primary-btn', onClick: () => dkd_go('/AnyelaBorn/packages/') }, 'Sohbet Paketlerini Gör ', React.createElement(ArrowRight, { size: 18 })))
  );
}

function DkdMessage({ side, avatar, name, text, time }) {
  return React.createElement('div', { className: `dkd-message dkd-${side}` },
    side === 'left' && React.createElement('img', { src: avatar, alt: 'Anyela' }),
    React.createElement('div', { className: 'dkd-bubble' }, name && React.createElement('strong', null, name, ' ✓'), text.split('\n').map((line, index) => React.createElement('span', { key: index }, line)), React.createElement('small', null, time))
  );
}

function DkdMiniFlowItem({ icon: Icon, title, text }) {
  return React.createElement('div', null, React.createElement(Icon, { size: 30 }), React.createElement('h3', null, title), React.createElement('p', null, text));
}

function DkdVoicePage() {
  return React.createElement(DkdPageShell, { active: 'home' },
    React.createElement('section', { className: 'dkd-page-title dkd-voice-title' }, React.createElement(Volume2, { size: 25 }), React.createElement('h1', null, 'Sesli Mesaj'), React.createElement('p', null, 'Sesini gönder, Anyela’nın sesiyle özel bir yanıt al.')),
    React.createElement('section', { className: 'dkd-voice-hero' },
      React.createElement('div', { className: 'dkd-wave-box' }, React.createElement(Mic, { size: 82 }), React.createElement('div', { className: 'dkd-wave-line' }), React.createElement('h2', null, 'Konuş, paylaş, bağ kur.'), React.createElement('p', null, 'Anyela seni dinliyor.')),
      React.createElement('img', { src: dkd_img.green, alt: 'Anyela voice' })
    ),
    React.createElement('section', { className: 'dkd-panel dkd-how' }, React.createElement('h2', null, '✨ Sesli Deneyim Nasıl Çalışır?'), React.createElement('div', { className: 'dkd-step-grid' },
      [{ icon: ShoppingBag, title: 'Paketi seç', text: 'İhtiyacına uygun paketi seç.' }, { icon: Mic, title: 'Sesli mesaj gönder', text: 'Kendini ifade et.' }, { icon: WandSparkles, title: 'Anyela hazırlar', text: 'Yanıt hazırlanır.' }, { icon: Volume2, title: 'Teslim edilir', text: 'Özel sesli yanıt ulaşır.' }].map((item, index) => React.createElement('div', { className: `dkd-step dkd-tone-${['cyan','violet','rose','emerald'][index]}`, key: item.title }, React.createElement('b', null, index + 1), React.createElement(item.icon, { size: 32 }), React.createElement('h3', null, item.title), React.createElement('p', null, item.text))))),
    React.createElement(DkdPackageSection, { icon: Gift, title: 'Sesli Mesaj Paketleri', items: [
      { title: 'Voice Intro', desc: 'Kısa ve tatlı bir sesli yanıt deneyimi.', price: '349 TL', icon: Star, tone: 'cyan' },
      { title: 'Voice Chat Private', desc: 'Daha uzun ve kişisel sesli yanıt.', price: '699 TL', icon: Heart, tone: 'rose', tag: 'Popüler' },
      { title: 'Voice VIP', desc: 'En özel, detaylı ve premium sesli deneyim.', price: '1.299 TL', icon: Crown, tone: 'gold' },
    ]}),
    React.createElement('section', { className: 'dkd-info-card' }, React.createElement(ShieldCheck, { size: 39 }), React.createElement('div', null, React.createElement('h3', null, '%100 gizli ve güvenli'), React.createElement('p', null, 'Bu deneyim tamamen özel ve kişiseldir. Anyela Born AI karakter sesidir.')))
  );
}

function DkdCustomPage() {
  return React.createElement(DkdPageShell, { active: 'home' },
    React.createElement('section', { className: 'dkd-page-title' }, React.createElement('span', null, '✦'), React.createElement('h1', null, 'Özel İçerik'), React.createElement('p', null, 'Hayal ettiğin konsept, kıyafet, mood veya fikri gönder; Anyela sana özel görseller ve videolar hazırlasın.')),
    React.createElement('section', { className: 'dkd-custom-hero' },
      React.createElement('div', null, React.createElement('h2', null, 'Sen hayal et, Anyela gerçeğe dönüştürsün.'), React.createElement('p', null, 'Konseptini yükle, detayları belirt, gerisini Anyela’ya bırak.'), React.createElement('div', { className: 'dkd-upload-preview' }, React.createElement(UploadCloud, { size: 38 }), React.createElement('span', null, 'Görsel, video veya referans yükle'), React.createElement('small', null, 'PNG, JPG, MP4 • Maks. 50MB'))),
      React.createElement('div', { className: 'dkd-collage' },
        React.createElement('img', { src: dkd_img.blue, alt: 'Anyela custom 1' }),
        React.createElement('img', { src: dkd_img.gold, alt: 'Anyela custom 2' }),
        React.createElement('img', { src: dkd_img.champagne, alt: 'Anyela custom 3' }),
        React.createElement('img', { src: dkd_img.pool, alt: 'Anyela custom 4' })
      )
    ),
    React.createElement(DkdPackageSection, { icon: Crown, title: 'Özel İçerik Seçenekleri', items: [
      { title: 'Style Try-On', desc: 'İstediğin kıyafeti Anyela üzerinde gör.', price: '1.199 TL', icon: Shirt, tone: 'cyan' },
      { title: 'Photo Set', desc: 'Konseptine özel 4-8 görsel set.', price: '1.699 TL', icon: ImageIcon, tone: 'violet' },
      { title: 'Talking Video', desc: 'Anyela’dan konuşan video mesajı.', price: '1.999 TL', icon: Video, tone: 'rose' },
      { title: 'Birthday / Special Message', desc: 'Özel günlerin için kişisel video mesaj.', price: '1.499 TL', icon: PartyPopper, tone: 'gold' },
    ]}),
    React.createElement('section', { className: 'dkd-request-card' }, React.createElement('h2', null, 'Kıyafet veya fikir yükle'), React.createElement('p', null, 'Referans görsel, mood board, konsept veya kısa açıklama ekle.'), React.createElement('div', { className: 'dkd-dashed' }, React.createElement(FileUp, { size: 34 }), ' Dosya seç veya buraya sürükle'), React.createElement('textarea', { placeholder: 'Fikrini, konseptini veya özel isteklerini yaz...' }), React.createElement('button', { className: 'dkd-primary-btn' }, 'Özel İçerik İste ', React.createElement(ArrowRight, { size: 18 })))
  );
}

function DkdAdsPage() {
  const dkd_industries = [
    { icon: Utensils, label: 'Restoran' }, { icon: Coffee, label: 'Kafe' }, { icon: Shirt, label: 'Butik' }, { icon: Sparkles, label: 'Güzellik' }, { icon: Hotel, label: 'Otel' }, { icon: House, label: 'Emlak' }
  ];
  return React.createElement(DkdPageShell, { active: 'ads' },
    React.createElement('section', { className: 'dkd-ads-hero' },
      React.createElement('div', null, React.createElement('span', null, '✦'), React.createElement('h1', null, 'Reklam'), React.createElement('h2', null, 'Anyela Born markanızın AI reklam yüzü olsun'), React.createElement('p', null, 'Yapay zekâ ile oluşturulan özel içeriklerle markanızı öne çıkarın, daha fazla kişiye ulaşın, satışlarınızı artırın.')),
      React.createElement('div', { className: 'dkd-campaign-card' }, React.createElement('img', { src: dkd_img.navy, alt: 'Anyela brand face' }), React.createElement('div', { className: 'dkd-chart-card' }, 'Kampanya Performansı', React.createElement('strong', null, '+128%')), React.createElement('div', { className: 'dkd-neon-sign' }, 'Anyela Born'))
    ),
    React.createElement('section', { className: 'dkd-industry-row' }, React.createElement('h3', null, 'Sektörünü seç'), dkd_industries.map((item) => React.createElement('button', { key: item.label }, React.createElement(item.icon, { size: 21 }), item.label))),
    React.createElement('div', { className: 'dkd-ad-grid' }, dkd_packages.business.map((item) => React.createElement(DkdAdCard, { key: item.title, item }))),
    React.createElement('section', { className: 'dkd-form-trust' },
      React.createElement('div', { className: 'dkd-fast-form' }, React.createElement('h2', null, 'Hızlı Teklif Formu'), ['Marka Adı', 'Sektör', 'Hedef', 'Bütçe'].map((label) => React.createElement('label', { key: label }, label, React.createElement('input', { placeholder: label === 'Marka Adı' ? 'Örn: Born Coffee' : 'Seçiniz' }))), React.createElement('button', { className: 'dkd-primary-btn' }, 'Teklif Talebini Gönder ', React.createElement(ArrowRight, { size: 17 }))),
      React.createElement('div', { className: 'dkd-reklam-badge' }, React.createElement(ShieldCheck, { size: 42 }), React.createElement('h2', null, 'Güvenli & Şeffaf'), React.createElement('p', null, 'Tüm reklam içeriklerinde reklam etiketi kullanılır.'), React.createElement('strong', null, '#Reklam ✓'))
    )
  );
}

function DkdAdCard({ item }) {
  const Icon = item.icon;
  return React.createElement('article', { className: `dkd-ad-card dkd-tone-${item.tone}` }, React.createElement(Icon, { size: 38 }), item.tag && React.createElement('span', { className: 'dkd-chip' }, item.tag), React.createElement('h3', null, item.title), React.createElement('p', null, item.desc), ['AI video', 'Görsel tasarım', 'Sosyal medya uyumlu', 'Revizyon'].map((line) => React.createElement('small', { key: line }, '✓ ', line)), React.createElement('strong', null, item.price), React.createElement('button', null, 'Teklif Al'));
}

function DkdPaymentPage() {
  return React.createElement(DkdPageShell, { active: 'payment' },
    React.createElement('section', { className: 'dkd-page-title' }, React.createElement('span', null, '✦'), React.createElement('h1', null, 'Ödeme ve Başlangıç'), React.createElement('p', null, 'Paketi seçtin, şimdi ödemenı tamamla ve Anyela Born deneyimine başla.')),
    React.createElement(DkdPaymentStep, { number: 1, icon: Crown, title: 'Seçilen Paket' }, React.createElement('div', { className: 'dkd-selected-package' }, React.createElement('span', null, 'Premium Deneyim Paketi'), React.createElement('small', null, '30 Gün • Tüm Özelliklere Erişim'), React.createElement('strong', null, '₺999'))),
    React.createElement(DkdPaymentStep, { number: 2, icon: Building2, title: 'IBAN’a Ödeme Yapın' }, React.createElement('div', { className: 'dkd-iban-table' }, [['Hesap Sahibi', 'ANYELA BORN MEDYA'], ['IBAN', 'TR12 0006 7010 0000 0098 7654 32'], ['Banka', 'YAPI VE KREDİ BANKASI'], ['Şube', 'Levent Şubesi (0670)']].map(([label, value]) => React.createElement('div', { key: label }, React.createElement('span', null, label), React.createElement('strong', null, value), React.createElement(ClipboardCopy, { size: 18 }))))),
    React.createElement(DkdPaymentStep, { number: 3, icon: ClipboardCopy, title: 'Açıklama (Ödeme Notu)' }, React.createElement('p', null, 'Ödeme yaparken açıklama kısmına aşağıdaki kodu yazmayı unutmayın.'), React.createElement('div', { className: 'dkd-code-box' }, 'ABP-7543-29XK ', React.createElement(ClipboardCopy, { size: 18 }))),
    React.createElement(DkdPaymentStep, { number: 4, icon: UploadCloud, title: 'Dekontunuzu Gönderin' }, React.createElement('p', null, 'Ödemenizi yaptıktan sonra dekontunuzu yükleyin.'), React.createElement('div', { className: 'dkd-dashed dkd-small-dashed' }, React.createElement(UploadCloud, { size: 27 }), ' Dekont yüklemek için dokunun'), React.createElement('button', { className: 'dkd-primary-btn' }, React.createElement(Send, { size: 18 }), ' Dekont Gönder')),
    React.createElement(DkdPaymentStep, { number: 5, icon: ShieldCheck, title: 'Onay sonrası ne olacak?' }, React.createElement('ul', null, ['Ödemeniz kontrol edilir ve onaylanır.', 'Hesabınıza erişim sağlanır.', 'Tüm özellikleri kullanmaya başlarsınız.', 'Özel içerikler sizi bekliyor.'].map((line) => React.createElement('li', { key: line }, '✓ ', line))))
  );
}

function DkdPaymentStep({ number, icon: Icon, title, children }) {
  return React.createElement('section', { className: 'dkd-payment-step' }, React.createElement('b', null, number), React.createElement(Icon, { size: 34 }), React.createElement('h2', null, title), children);
}

function DkdFaqPage() {
  const dkd_questions = ['Anyela gerçek kişi mi?', 'Ödeme nasıl yapılıyor?', 'Sohbet gerçek zamanlı mı?', 'Sesli yanıt nasıl geliyor?', 'İade var mı?', 'Gönderdiğim görseller saklanıyor mu?'];
  return React.createElement(DkdPageShell, { active: 'home' },
    React.createElement('section', { className: 'dkd-page-title dkd-faq-title' }, React.createElement('span', null, '✦'), React.createElement('h1', null, 'SSS ve Kurallar'), React.createElement('p', null, 'Güven, ödeme, gizlilik ve deneyim kurallarımız hakkında en çok sorulan sorular.')),
    React.createElement('section', { className: 'dkd-trust-panel' }, React.createElement('h2', null, '✨ Güveniniz bizim için önemli ✨'), React.createElement('div', null,
      React.createElement(DkdIconTile, { icon: Bot, label: 'AI karakter', sub: 'Gelişmiş yapay zekâ deneyimi.', tone: 'cyan' }),
      React.createElement(DkdIconTile, { icon: BadgeDollarSign, label: '18+ içerik', sub: 'Yetişkinlere özel süreç.', tone: 'rose' }),
      React.createElement(DkdIconTile, { icon: LockKeyhole, label: 'Gizlilik', sub: 'Verileriniz gizli kalır.', tone: 'emerald' }),
      React.createElement(DkdIconTile, { icon: BadgeCheck, label: 'Manuel onay', sub: 'Ödemeler manuel onaylanır.', tone: 'gold' })
    )),
    React.createElement('section', { className: 'dkd-faq-list' }, React.createElement('h2', null, React.createElement(CircleHelp, { size: 27 }), ' Sık Sorulan Sorular'), dkd_questions.map((question) => React.createElement('button', { key: question }, React.createElement(Sparkles, { size: 18 }), question, React.createElement(ChevronDown, { size: 23 })))),
    React.createElement('section', { className: 'dkd-cta-band dkd-slim' }, React.createElement(MessageCircle, { size: 44 }), React.createElement('div', null, React.createElement('h2', null, 'Hâlâ sorunuz mu var?'), React.createElement('p', null, 'Ekibimiz size hızlıca yardımcı olmaktan mutluluk duyar.')), React.createElement('button', { className: 'dkd-primary-btn' }, React.createElement(Headphones, { size: 18 }), ' Destek Al'))
  );
}

function DkdApp() {
  const dkd_path = window.location.pathname.replace(/\/+$/, '/') || '/AnyelaBorn/';
  if (dkd_path.includes('/packages/')) return React.createElement(DkdPackagesPage);
  if (dkd_path.includes('/chat/')) return React.createElement(DkdChatPage);
  if (dkd_path.includes('/voice/')) return React.createElement(DkdVoicePage);
  if (dkd_path.includes('/custom/')) return React.createElement(DkdCustomPage);
  if (dkd_path.includes('/ads/')) return React.createElement(DkdAdsPage);
  if (dkd_path.includes('/payment/')) return React.createElement(DkdPaymentPage);
  if (dkd_path.includes('/faq/')) return React.createElement(DkdFaqPage);
  return React.createElement(DkdHomePage);
}

createRoot(document.getElementById('dkd-anyela-root')).render(React.createElement(DkdApp));
