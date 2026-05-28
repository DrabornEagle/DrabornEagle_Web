import React from 'react';
import {
  Crown,
  List,
  ChatCircleDots,
  Gift,
  Robot,
  ShieldCheck,
  LockKey,
  Package,
  CreditCard,
  Receipt,
  RocketLaunch,
  Waveform,
  Images,
  Megaphone,
  House,
  ChatsCircle,
  Cube,
  UserCircle,
  Sparkle,
  Lightning,
  CheckCircle,
  DiamondsFour,
} from '@phosphor-icons/react';

const dkd_asset = (dkd_file_name: string) => `./assets/${dkd_file_name}`;

export function DkdAnyelaHomePage() {
  return (
    <>
      <div className="dkd-page-glow dkd-glow-a" />
      <div className="dkd-page-glow dkd-glow-b" />
      <main className="dkd-mobile-shell">
        <header className="dkd-header">
          <a className="dkd-brand" href="./" aria-label="Anyela Born Club ana sayfa">
            <span className="dkd-brand-mark"><span className="dkd-brand-crown">♛</span>AB</span>
            <span className="dkd-brand-name">Anyela Born Club</span>
          </a>
          <nav className="dkd-top-actions" aria-label="Ana işlemler">
            <a className="dkd-menu-button" href="./packages/" aria-label="Menüyü aç"><List size={30} weight="bold" /></a>
            <a className="dkd-start-button" href="./payment/">Başla</a>
          </nav>
        </header>

        <section className="dkd-hero-card" aria-labelledby="dkd_home_title">
          <div className="dkd-hero-bg-orbit dkd-orbit-one" />
          <div className="dkd-hero-bg-orbit dkd-orbit-two" />
          <div className="dkd-hero-copy">
            <span className="dkd-hero-badge"><Sparkle size={16} weight="fill" />AI ile gerçek bağ</span>
            <h1 id="dkd_home_title">Anyela Born ile <span>özel AI karakter</span> deneyimi</h1>
            <p className="dkd-hero-description">Kişiye özel sohbet, sesli mesaj, özel görsel/video içerikler ve marka reklam iş birlikleri.</p>
            <div className="dkd-hero-buttons">
              <a href="./chat/" className="dkd-primary-cta"><ChatCircleDots size={22} weight="fill" />Sohbete Başla</a>
              <a href="./packages/" className="dkd-secondary-cta"><Gift size={22} weight="fill" />Paketleri Gör</a>
            </div>
          </div>
          <div className="dkd-hero-person">
            <img src={dkd_asset('dkd-anyela-hero.webp')} alt="Anyela Born AI karakter görseli" className="dkd-hero-image" />
            <div className="dkd-premium-chip"><ShieldCheck size={26} weight="duotone" /><strong>Premium AI</strong><span>Sadece Sizin İçin</span></div>
          </div>
        </section>

        <section className="dkd-trust-strip" aria-label="Güven ve platform bilgileri">
          <article className="dkd-trust-item"><span className="dkd-icon-shell dkd-tone-violet"><Robot size={31} weight="duotone" /></span><div><strong>AI Karakter</strong><span>Gerçekçi & Akıllı</span></div></article>
          <article className="dkd-trust-item"><span className="dkd-icon-shell dkd-tone-rose"><ShieldCheck size={31} weight="duotone" /></span><div><strong>18+</strong><span>Yetişkinlere Özel</span></div></article>
          <article className="dkd-trust-item"><span className="dkd-icon-shell dkd-tone-emerald"><CheckCircle size={31} weight="duotone" /></span><div><strong>Manuel Onay</strong><span>Güvenli Süreç</span></div></article>
          <article className="dkd-trust-item"><span className="dkd-icon-shell dkd-tone-cyan"><LockKey size={31} weight="duotone" /></span><div><strong>Gizli İçerik</strong><span>%100 Gizlilik</span></div></article>
        </section>

        <section className="dkd-panel dkd-how-panel" aria-labelledby="dkd_how_title">
          <div className="dkd-section-header"><h2 id="dkd_how_title">Nasıl Çalışır?</h2><span className="dkd-speed-pill"><Lightning size={15} weight="fill" />Kolay & Hızlı</span></div>
          <div className="dkd-step-grid">
            <article className="dkd-step-card dkd-tone-violet"><span className="dkd-step-number">1</span><Package size={39} weight="duotone" /><strong>Paket seç</strong><p>Sana uygun paketi seç.</p></article>
            <article className="dkd-step-card dkd-tone-blue"><span className="dkd-step-number">2</span><CreditCard size={39} weight="duotone" /><strong>Ödeme yap</strong><p>Güvenli ödeme yöntemiyle öde.</p></article>
            <article className="dkd-step-card dkd-tone-teal"><span className="dkd-step-number">3</span><Receipt size={39} weight="duotone" /><strong>Dekont gönder</strong><p>Ödeme dekontunu gönder.</p></article>
            <article className="dkd-step-card dkd-tone-coral"><span className="dkd-step-number">4</span><RocketLaunch size={39} weight="duotone" /><strong>Deneyimi başlat</strong><p>Onay sonrası hemen başla.</p></article>
          </div>
        </section>

        <section className="dkd-panel dkd-services-panel" aria-labelledby="dkd_services_title">
          <div className="dkd-section-header"><h2 id="dkd_services_title">Hizmetlerimiz</h2><a href="./packages/" className="dkd-view-all">Tümünü Gör ›</a></div>
          <div className="dkd-service-grid">
            <a href="./chat/" className="dkd-service-card dkd-tone-violet"><ChatCircleDots size={46} weight="duotone" /><strong>Yazılı Sohbet</strong><span>Kişiye özel yazılı sohbet deneyimi.</span></a>
            <a href="./voice/" className="dkd-service-card dkd-tone-cyan"><Waveform size={46} weight="duotone" /><strong>Sesli Mesaj</strong><span>Anyela’dan size özel sesli mesajlar.</span></a>
            <a href="./custom/" className="dkd-service-card dkd-tone-rose"><Images size={46} weight="duotone" /><strong>Özel İçerik</strong><span>Size özel görsel ve video içerikler.</span></a>
            <a href="./ads/" className="dkd-service-card dkd-tone-gold"><Crown size={46} weight="duotone" /><strong>Marka Reklamı</strong><span>Özel marka tanıtım ve iş birlikleri.</span></a>
          </div>
        </section>

        <section className="dkd-premium-card" aria-labelledby="dkd_premium_title">
          <div className="dkd-premium-image-wrap"><img src={dkd_asset('dkd-anyela-premium.webp')} alt="Anyela Born özel deneyim görseli" className="dkd-premium-image" /><span className="dkd-crown-badge"><Crown size={31} weight="fill" /></span></div>
          <div className="dkd-premium-copy"><span className="dkd-premium-label"><DiamondsFour size={16} weight="fill" />Anyela Born Premium</span><h2 id="dkd_premium_title">Sadece sana özel.<span> Sadece burada.</span></h2><p>“Benimle kurduğun bu bağ, sana özel. Gerçek ilgi, gerçek his, gerçek Anyela.”</p></div>
          <div className="dkd-signature">Anyela♡</div>
        </section>
        <div className="dkd-bottom-safe-space" />
      </main>
    </>
  );
}
