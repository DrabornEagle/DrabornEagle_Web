import React from 'react';
import { createRoot } from 'react-dom/client';
import './dkdAnyelaBornPremium.css';

type DkdPackage = {
  dkd_title: string;
  dkd_label: string;
  dkd_price: string;
  dkd_text: string;
  dkd_icon: string;
  dkd_color: string;
  dkd_points: string[];
};

const dkd_packages: DkdPackage[] = [
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

export default function DkdAnyelaBornApp() {
  return (
    <main className="dkd-anyela-app">
      <header className="dkd-header">
        <a className="dkd-logo" href="#dkd-hero" aria-label="Anyela Born Club ana sayfa">
          <span className="dkd-logo-mark">Anyela</span>
          <span className="dkd-logo-sub">Born Club</span>
        </a>
        <nav className="dkd-nav" aria-label="Ana menü">
          {['Deneyim', 'Paketler', 'Sohbet', 'Reklam', 'Ödeme'].map((dkd_item) => (
            <a key={dkd_item} href={`#dkd-${dkd_item.toLowerCase()}`}>{dkd_item}</a>
          ))}
        </nav>
        <div className="dkd-header-actions">
          <a className="dkd-login-button" href="#dkd-odeme">Giriş / Başla</a>
          <button className="dkd-menu-button" aria-label="Mobil menü">☰</button>
        </div>
      </header>

      <section className="dkd-hero" id="dkd-hero">
        <div className="dkd-hero-copy">
          <div className="dkd-kicker">✦ Premium AI karakter deneyimi</div>
          <h1>Güven veren, renkli ve profesyonel <span>Anyela Born Club</span> deneyimi.</h1>
          <p>Yazılı sohbet, sesli mesaj, özel görsel/video ve markalar için AI reklam yüzü paketleri tek modern web deneyiminde.</p>
          <div className="dkd-hero-actions">
            <a href="#dkd-paketler" className="dkd-primary-button">Paketleri İncele</a>
            <a href="#dkd-reklam" className="dkd-secondary-button">Markam İçin Reklam</a>
          </div>
          <div className="dkd-trust-strip">
            <span>AI olduğu açık</span><span>18+ sınır</span><span>IBAN + dekont takip</span><span>Manuel onay</span>
          </div>
        </div>
        <section className="dkd-hologram-card" aria-label="Anyela dijital karakter önizleme">
          <div className="dkd-holo-toolbar"><span>LIVE PREVIEW</span><strong>AI Character</strong></div>
          <div className="dkd-holo-stage">
            <div className="dkd-holo-ring dkd-holo-ring-one" />
            <div className="dkd-holo-ring dkd-holo-ring-two" />
            <div className="dkd-avatar-core"><div className="dkd-avatar-face" /><div className="dkd-avatar-hair" /><div className="dkd-avatar-shoulders" /><div className="dkd-avatar-spark">A</div></div>
            <div className="dkd-holo-data dkd-holo-data-one">Voice ready</div>
            <div className="dkd-holo-data dkd-holo-data-two">Style prompt</div>
            <button className="dkd-play-orb" aria-label="Önizleme oynat">▶</button>
          </div>
          <div className="dkd-holo-bottom"><div><span>Konuşan tanıtım</span><strong>Anyela ile güvenli başlangıç</strong></div><small>00:45</small></div>
        </section>
      </section>

      <section className="dkd-section" id="dkd-paketler">
        <div className="dkd-section-heading">
          <span>Net fiyat + net içerik</span>
          <h2>Kullanıcıyı yormayan anlaşılır paketler</h2>
          <p>İlk ödeme alma hedefi için küçük giriş paketleri ve güçlü ekstra satış alanları.</p>
        </div>
        <div className="dkd-package-grid">
          {dkd_packages.map((dkd_package) => (
            <article className={`dkd-package-card dkd-package-${dkd_package.dkd_color}`} key={dkd_package.dkd_title}>
              <div className="dkd-package-top"><span className="dkd-package-icon">{dkd_package.dkd_icon}</span><em>{dkd_package.dkd_label}</em></div>
              <h3>{dkd_package.dkd_title}</h3>
              <strong>{dkd_package.dkd_price}</strong>
              <p>{dkd_package.dkd_text}</p>
              <ul>{dkd_package.dkd_points.map((dkd_point) => <li key={dkd_point}>✓ {dkd_point}</li>)}</ul>
              <a className="dkd-card-button" href="#dkd-odeme">Paketi Seç</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<DkdAnyelaBornApp />);
