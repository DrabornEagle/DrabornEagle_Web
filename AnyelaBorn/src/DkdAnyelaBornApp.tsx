import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Camera,
  ChevronRight,
  Copy,
  Crown,
  Gem,
  Gift,
  Headphones,
  Heart,
  Image as ImageIcon,
  LockKeyhole,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Palette,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Wand2,
  Zap
} from 'lucide-react';

type DkdIconComponent = typeof Sparkles;

type DkdPackageItem = {
  dkd_title: string;
  dkd_tagline: string;
  dkd_price: string;
  dkd_badge: string;
  dkd_icon: DkdIconComponent;
  dkd_points: string[];
  dkd_tone: string;
};

type DkdAdvertItem = {
  dkd_title: string;
  dkd_price: string;
  dkd_icon: DkdIconComponent;
  dkd_points: string[];
};

type DkdStepItem = {
  dkd_title: string;
  dkd_text: string;
  dkd_icon: DkdIconComponent;
};

const dkd_customer_packages: DkdPackageItem[] = [
  {
    dkd_title: 'Intro Chat',
    dkd_tagline: '10 dk yazılı tanışma',
    dkd_price: '149 TL',
    dkd_badge: 'Hızlı Başlangıç',
    dkd_icon: MessageCircle,
    dkd_tone: 'dkd-tone-coral',
    dkd_points: ['10 dakika özel sohbet', 'Anyela karakter tonunda yanıt', 'Sohbet sonrası mini özet']
  },
  {
    dkd_title: 'Private Chat',
    dkd_tagline: '30 dk premium sohbet',
    dkd_price: '499 TL',
    dkd_badge: 'En Çok Seçilen',
    dkd_icon: Heart,
    dkd_tone: 'dkd-tone-violet',
    dkd_points: ['30 dakika kesintisiz deneyim', 'Kıyafet ve konsept fikri konuşma', 'Öncelikli dönüş']
  },
  {
    dkd_title: 'Voice Message',
    dkd_tagline: 'Kişiye özel sesli cevap',
    dkd_price: '249 TL',
    dkd_badge: 'Sesli',
    dkd_icon: Mic,
    dkd_tone: 'dkd-tone-cyan',
    dkd_points: ['Adınla hitap seçeneği', 'MP3 teslim', 'Duygulu ve doğal tonlama']
  },
  {
    dkd_title: 'Style Try-On',
    dkd_tagline: 'Kıyafet fikrinden görsel',
    dkd_price: '399 TL',
    dkd_badge: 'Özel Görsel',
    dkd_icon: Wand2,
    dkd_tone: 'dkd-tone-gold',
    dkd_points: ['2 özel konsept görsel', 'Referans kıyafet ilhamı', 'Atmosfer ve poz seçimi']
  }
];

const dkd_advert_packages: DkdAdvertItem[] = [
  {
    dkd_title: 'Reklam Mini',
    dkd_price: '1.500 TL',
    dkd_icon: Camera,
    dkd_points: ['1 kısa video', '1 kapak görseli', 'Reels/Shorts açıklaması']
  },
  {
    dkd_title: 'Reklam Standart',
    dkd_price: '4.500 TL',
    dkd_icon: BriefcaseBusiness,
    dkd_points: ['3 kısa video', '3 sosyal medya görseli', 'Marka tonu uyarlaması']
  },
  {
    dkd_title: 'Marka Yüzü',
    dkd_price: '12.000 TL+',
    dkd_icon: Crown,
    dkd_points: ['Sponsorlu kampanya', 'Anyela konsept serisi', 'İş birliği etiketi']
  }
];

const dkd_process_steps: DkdStepItem[] = [
  { dkd_title: 'Paketi seç', dkd_text: 'Sohbet, ses, görsel veya reklam paketini belirle.', dkd_icon: Gift },
  { dkd_title: 'IBAN ile öde', dkd_text: 'Açıklama kodu ile ödeme yap ve dekontu hazırla.', dkd_icon: Banknote },
  { dkd_title: 'Dekont gönder', dkd_text: 'Dekontunu yükle ya da DM/WhatsApp ile ilet.', dkd_icon: Upload },
  { dkd_title: 'Anyela başlasın', dkd_text: 'Onaydan sonra özel deneyim manuel olarak aktif edilir.', dkd_icon: Sparkles }
];

const dkd_faq_items = [
  'Anyela gerçek bir kişi mi?',
  'Ödemeyi nasıl yaparım?',
  'Sadece sesli mesajla konuşabilir miyim?',
  'Markam için Anyela reklam yüzü olabilir mi?',
  'İçeriklerim ve dekontum gizli mi?'
];

function DkdLogo() {
  return (
    <a className="dkd-logo" href="#dkd-hero" aria-label="Anyela Born Club ana sayfa">
      <span className="dkd-logo-script">Anyela</span>
      <span className="dkd-logo-sub">Born Club</span>
    </a>
  );
}

function DkdHeader() {
  const dkd_nav_items = ['Deneyim', 'Paketler', 'Sohbet', 'Reklam', 'Ödeme'];
  return (
    <header className="dkd-header">
      <DkdLogo />
      <nav className="dkd-nav" aria-label="Ana menü">
        {dkd_nav_items.map((dkd_nav_item) => (
          <a key={dkd_nav_item} href={`#dkd-${dkd_nav_item.toLowerCase()}`}>{dkd_nav_item}</a>
        ))}
      </nav>
      <div className="dkd-header-actions">
        <a className="dkd-login-pill" href="#dkd-odeme"><LockKeyhole size={16} /> Giriş / Başla</a>
        <button className="dkd-menu-button" aria-label="Menüyü aç"><Menu size={24} /></button>
      </div>
    </header>
  );
}

function DkdAvatarShowcase() {
  return (
    <section className="dkd-avatar-card" aria-label="Anyela konuşan video önizleme">
      <div className="dkd-avatar-aura" />
      <div className="dkd-avatar-room">
        <div className="dkd-avatar-orb dkd-avatar-orb-one" />
        <div className="dkd-avatar-orb dkd-avatar-orb-two" />
        <div className="dkd-avatar-silhouette">
          <div className="dkd-avatar-face" />
          <div className="dkd-avatar-hair" />
          <div className="dkd-avatar-neck" />
          <div className="dkd-avatar-body" />
          <div className="dkd-avatar-jewel">A</div>
        </div>
        <div className="dkd-neon-sign">Anyela</div>
      </div>
      <button className="dkd-play-button" aria-label="Konuşan video önizleme"><Play fill="currentColor" /></button>
      <div className="dkd-preview-caption">
        <span><Headphones size={15} /> Konuşan Video Önizleme</span>
        <strong>00:45</strong>
      </div>
    </section>
  );
}

function DkdHero() {
  return (
    <section className="dkd-hero" id="dkd-hero">
      <div className="dkd-hero-copy">
        <div className="dkd-kicker"><Sparkles size={16} /> Premium AI influencer deneyimi</div>
        <h1>Anyela ile konuş, <span>sesli cevap al</span>, özel görsel ve reklam deneyimi oluştur.</h1>
        <p>
          Anyela Born Club; sohbet, sesli mesaj, kişiye özel görsel/video ve marka reklam paketlerini tek premium mobil deneyimde toplar.
        </p>
        <div className="dkd-hero-actions">
          <a className="dkd-primary-button" href="#dkd-paketler"><MessageCircle size={18} /> Paketleri İncele</a>
          <a className="dkd-secondary-button" href="#dkd-reklam"><Megaphone size={18} /> Markam İçin Reklam</a>
        </div>
        <div className="dkd-metric-strip" aria-label="Güven göstergeleri">
          <span><BadgeCheck size={16} /> AI olduğu açık</span>
          <span><ShieldCheck size={16} /> 18+ deneyim</span>
          <span><Zap size={16} /> Hızlı manuel onay</span>
        </div>
      </div>
      <DkdAvatarShowcase />
    </section>
  );
}

function DkdPackageCard({ dkd_package }: { dkd_package: DkdPackageItem }) {
  const DkdIcon = dkd_package.dkd_icon;
  return (
    <article className={`dkd-package-card ${dkd_package.dkd_tone}`}>
      <div className="dkd-card-topline">
        <div className="dkd-icon-box"><DkdIcon size={24} /></div>
        <span>{dkd_package.dkd_badge}</span>
      </div>
      <h3>{dkd_package.dkd_title}</h3>
      <p>{dkd_package.dkd_tagline}</p>
      <strong>{dkd_package.dkd_price}</strong>
      <ul>
        {dkd_package.dkd_points.map((dkd_point) => <li key={dkd_point}><Star size={13} /> {dkd_point}</li>)}
      </ul>
      <a href="#dkd-odeme" className="dkd-card-button">Paketi Seç <ChevronRight size={16} /></a>
    </article>
  );
}

function DkdPackages() {
  return (
    <section className="dkd-section" id="dkd-paketler">
      <div className="dkd-section-heading">
        <span><Gem size={17} /> Net ve anlaşılır paketler</span>
        <h2>İlk satışa odaklı premium paket yapısı</h2>
        <p>Kullanıcı önce küçük paketle gelir; sesli mesaj, görsel ve video ekstra satışa dönüşür.</p>
      </div>
      <div className="dkd-package-grid">
        {dkd_customer_packages.map((dkd_package) => <DkdPackageCard key={dkd_package.dkd_title} dkd_package={dkd_package} />)}
      </div>
    </section>
  );
}

function DkdChatPreview() {
  return (
    <section className="dkd-chat-preview" id="dkd-sohbet">
      <div className="dkd-chat-device">
        <div className="dkd-chat-header">
          <div className="dkd-mini-avatar" />
          <div>
            <strong>Anyela</strong>
            <span>AI Influencer • çevrimiçi</span>
          </div>
          <div className="dkd-live-dot" />
        </div>
        <div className="dkd-chat-timer">
          <Heart size={20} />
          <div>
            <span>30 DK Private Chat</span>
            <strong>27:14 kaldı</strong>
          </div>
        </div>
        <div className="dkd-message dkd-message-user">Anyela, bu kıyafet tarzıyla özel bir konsept yapabilir misin?</div>
        <div className="dkd-image-message"><ImageIcon size={22} /> Kıyafet referansı yüklendi</div>
        <div className="dkd-message dkd-message-anyela">Bu tarzı sana özel bir atmosferle birleştirip premium görsel seti hazırlayabilirim ✨</div>
        <div className="dkd-voice-card">
          <button aria-label="Sesli mesajı oynat"><Play fill="currentColor" size={17} /></button>
          <div className="dkd-wave"><span /><span /><span /><span /><span /><span /><span /></div>
          <strong>00:26</strong>
        </div>
        <div className="dkd-input-preview">Mesaj yaz, ses gönder, görsel yükle <ArrowRight size={16} /></div>
      </div>
      <div className="dkd-chat-copy">
        <div className="dkd-kicker"><Mic size={16} /> Yazılı + sesli deneyim</div>
        <h2>Sadece yazı değil; ses, görsel ve video isteğiyle daha değerli satış.</h2>
        <p>
          İlk sürümde sohbet manuel/yari manuel ilerler. Kullanıcı webden paket seçer, dekont gönderir; sen Anyela karakterinde yanıtı hazırlayıp teslim edersin.
        </p>
        <div className="dkd-addons-row">
          <span><Mic size={15} /> Sesli Cevap</span>
          <span><Palette size={15} /> Style Try-On</span>
          <span><Camera size={15} /> Talking Video</span>
        </div>
      </div>
    </section>
  );
}

function DkdAdvertCard({ dkd_advert }: { dkd_advert: DkdAdvertItem }) {
  const DkdIcon = dkd_advert.dkd_icon;
  return (
    <article className="dkd-advert-card">
      <div className="dkd-icon-box"><DkdIcon size={24} /></div>
      <div>
        <h3>{dkd_advert.dkd_title}</h3>
        <strong>{dkd_advert.dkd_price}</strong>
        {dkd_advert.dkd_points.map((dkd_point) => <p key={dkd_point}><BadgeCheck size={14} /> {dkd_point}</p>)}
      </div>
    </article>
  );
}

function DkdAdvertSection() {
  return (
    <section className="dkd-advert-section" id="dkd-reklam">
      <div className="dkd-advert-hero">
        <div>
          <div className="dkd-kicker"><Megaphone size={16} /> İşletmeler için Anyela</div>
          <h2>Anyela reklam yüzünüz olsun.</h2>
          <p>Restoran, kafe, butik, güzellik salonu, otel, emlak ve dijital ürünler için AI destekli premium tanıtım setleri.</p>
          <a className="dkd-primary-button" href="#dkd-odeme">Teklif Talep Et</a>
        </div>
        <div className="dkd-brand-stage">
          <span>Your Brand</span>
          <strong>AI reklam stüdyosu</strong>
        </div>
      </div>
      <div className="dkd-advert-grid">
        {dkd_advert_packages.map((dkd_advert) => <DkdAdvertCard key={dkd_advert.dkd_title} dkd_advert={dkd_advert} />)}
      </div>
      <div className="dkd-compliance-note">
        <ShieldCheck size={22} />
        <p><strong>Şeffaf reklam etiketi:</strong> Anyela hesabında paylaşılacak marka içerikleri “Reklam / İş birliği / Sponsorlu” ibaresiyle yayınlanır.</p>
      </div>
    </section>
  );
}

function DkdPaymentSection() {
  return (
    <section className="dkd-payment-section" id="dkd-odeme">
      <div className="dkd-payment-card">
        <div className="dkd-section-heading dkd-section-heading-left">
          <span><Banknote size={17} /> Ödeme ve başlangıç</span>
          <h2>IBAN + dekont ile hızlı manuel satış.</h2>
          <p>Bu ilk sürümde sanal POS yok. Müşteri paket seçer, açıklama koduyla IBAN’a ödeme yapar, dekont gönderir.</p>
        </div>
        <div className="dkd-iban-box">
          <div><span>Banka</span><strong>Gerçek banka adı eklenecek</strong><Copy size={16} /></div>
          <div><span>Alıcı</span><strong>Alıcı adı eklenecek</strong><Copy size={16} /></div>
          <div><span>IBAN</span><strong>TR__ ____ ____ ____ ____ ____ __</strong><Copy size={16} /></div>
          <div className="dkd-reference-code"><span>Açıklama</span><strong>ANYELA - kullaniciadi - 30DK</strong></div>
        </div>
      </div>
      <div className="dkd-upload-card">
        <Upload size={34} />
        <h3>Dekont gönder</h3>
        <p>Dekont onayından sonra sohbet, sesli cevap veya reklam süreci başlatılır.</p>
        <a href="mailto:info@draborneagle.com" className="dkd-secondary-button">Dekont / Talep Gönder</a>
      </div>
    </section>
  );
}

function DkdProcess() {
  return (
    <section className="dkd-section dkd-process-section" id="dkd-deneyim">
      <div className="dkd-section-heading">
        <span><Sparkles size={17} /> Süreç</span>
        <h2>Daha sade, daha anlaşılır, daha güven veren akış.</h2>
      </div>
      <div className="dkd-process-grid">
        {dkd_process_steps.map((dkd_step, dkd_index) => {
          const DkdIcon = dkd_step.dkd_icon;
          return (
            <article className="dkd-process-card" key={dkd_step.dkd_title}>
              <span className="dkd-step-number">{String(dkd_index + 1).padStart(2, '0')}</span>
              <DkdIcon size={25} />
              <h3>{dkd_step.dkd_title}</h3>
              <p>{dkd_step.dkd_text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DkdFaq() {
  return (
    <section className="dkd-faq-section">
      <div className="dkd-section-heading dkd-section-heading-left">
        <span><ShieldCheck size={17} /> Güven & SSS</span>
        <h2>Kullanıcı daha girmeden sınırlar net.</h2>
      </div>
      <div className="dkd-faq-list">
        {dkd_faq_items.map((dkd_faq_item) => <button key={dkd_faq_item}>{dkd_faq_item}<ChevronRight size={17} /></button>)}
      </div>
      <div className="dkd-legal-strip">
        <span>Anyela gerçek kişi değildir.</span>
        <span>18+ deneyimdir.</span>
        <span>Uygunsuz içerik kabul edilmez.</span>
      </div>
    </section>
  );
}

function DkdFooter() {
  return (
    <footer className="dkd-footer">
      <DkdLogo />
      <p>Premium AI influencer sohbet, sesli mesaj, özel görsel/video ve reklam yüzü deneyimi.</p>
      <div className="dkd-footer-links">
        <a href="mailto:info@draborneagle.com"><Mail size={16} /> info@draborneagle.com</a>
        <a href="#dkd-paketler">Paketler</a>
        <a href="#dkd-reklam">Reklam</a>
      </div>
    </footer>
  );
}

export default function DkdAnyelaBornApp() {
  return (
    <main className="dkd-anyela-page">
      <div className="dkd-aurora dkd-aurora-one" />
      <div className="dkd-aurora dkd-aurora-two" />
      <DkdHeader />
      <DkdHero />
      <DkdPackages />
      <DkdChatPreview />
      <DkdAdvertSection />
      <DkdPaymentSection />
      <DkdProcess />
      <DkdFaq />
      <DkdFooter />
      <aside className="dkd-mobile-action-bar" aria-label="Mobil hızlı işlem çubuğu">
        <a href="#dkd-paketler"><Gift size={17} /> Paket</a>
        <a href="#dkd-sohbet"><MessageCircle size={17} /> Sohbet</a>
        <a href="#dkd-reklam"><Megaphone size={17} /> Reklam</a>
      </aside>
    </main>
  );
}
