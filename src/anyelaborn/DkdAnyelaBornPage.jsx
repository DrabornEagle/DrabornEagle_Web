import React from 'react';
import './dkd-anyela-born.css';

const dkd_anyelaSteps = [
  {
    dkd_id: 'package',
    dkd_icon: '🛍️',
    dkd_title: '1. Paket Seç',
    dkd_text: 'İhtiyacına uygun paketi seç.',
    dkd_tone: 'pink',
  },
  {
    dkd_id: 'payment',
    dkd_icon: '💳',
    dkd_title: '2. Ödemeyi Yap',
    dkd_text: 'IBAN ile ödemenizi gerçekleştirin.',
    dkd_tone: 'teal',
  },
  {
    dkd_id: 'receipt',
    dkd_icon: '⬆️',
    dkd_title: '3. Dekontu Yükle',
    dkd_text: 'Ödeme dekontunu sisteme yükle.',
    dkd_tone: 'purple',
  },
  {
    dkd_id: 'room',
    dkd_icon: '🚪',
    dkd_title: '4. Özel Odan Açılır',
    dkd_text: 'Onay sonrası özel odan aktif olur.',
    dkd_tone: 'orange',
  },
];

const dkd_anyelaPackages = [
  {
    dkd_id: 'intro',
    dkd_icon: '👑',
    dkd_title: 'Anyela Intro',
    dkd_text: 'Kısa tanışma paketi',
    dkd_price: '149 TL',
    dkd_tone: 'pink',
  },
  {
    dkd_id: 'private-chat',
    dkd_icon: '💬',
    dkd_title: 'Private Chat',
    dkd_text: '30 dk özel sohbet',
    dkd_price: '499 TL',
    dkd_tone: 'teal',
  },
  {
    dkd_id: 'voice-intro',
    dkd_icon: '🎙️',
    dkd_title: 'Voice Intro',
    dkd_text: 'Kişiye özel sesli mesaj',
    dkd_price: '249 TL',
    dkd_tone: 'purple',
  },
  {
    dkd_id: 'photo-set',
    dkd_icon: '🖼️',
    dkd_title: 'Photo Set',
    dkd_text: '5 özel görsel',
    dkd_price: '1.499 TL',
    dkd_tone: 'orange',
  },
];

const dkd_anyelaServices = [
  {
    dkd_id: 'voice-message',
    dkd_icon: '🎤',
    dkd_title: 'Sesli Mesaj',
    dkd_text: 'Kişiye özel ses kaydı siparişi ver.',
    dkd_tone: 'pink',
  },
  {
    dkd_id: 'visual-video',
    dkd_icon: '🎬',
    dkd_title: 'Özel Görsel / Video',
    dkd_text: 'Sana özel içerikler hazırlanır.',
    dkd_tone: 'teal',
  },
  {
    dkd_id: 'brand-ads',
    dkd_icon: '📣',
    dkd_title: 'İşletme Reklam Paketi',
    dkd_text: 'Markan için Anyela reklam yüzü.',
    dkd_tone: 'purple',
  },
];

const dkd_anyelaRules = [
  {
    dkd_id: 'age',
    dkd_title: '18+ kullanıcılar içindir',
    dkd_text: 'Yalnızca yetişkinlere açıktır.',
  },
  {
    dkd_id: 'safe-content',
    dkd_title: 'Uygunsuz içerik yasaktır',
    dkd_text: 'Saygılı ve kurallara uygun kullanım beklenir.',
  },
  {
    dkd_id: 'data-delete',
    dkd_title: 'Veri silme talebi yapılabilir',
    dkd_text: 'Kişisel verilerin silinmesi talep edilebilir.',
  },
];

function DkdAnyelaIconBubble({ dkd_icon, dkd_tone }) {
  return <div className={`dkd-anyela-icon-bubble dkd-anyela-bubble-${dkd_tone}`}>{dkd_icon}</div>;
}

function DkdAnyelaStepCard({ dkd_step }) {
  return (
    <article className="dkd-anyela-step-card">
      <DkdAnyelaIconBubble dkd_icon={dkd_step.dkd_icon} dkd_tone={dkd_step.dkd_tone} />
      <div>
        <h3 className="dkd-anyela-card-title">{dkd_step.dkd_title}</h3>
        <p className="dkd-anyela-card-text">{dkd_step.dkd_text}</p>
      </div>
    </article>
  );
}

function DkdAnyelaPackageCard({ dkd_packageItem }) {
  return (
    <article className={`dkd-anyela-package-card dkd-anyela-${dkd_packageItem.dkd_tone}-card`}>
      <DkdAnyelaIconBubble dkd_icon={dkd_packageItem.dkd_icon} dkd_tone={dkd_packageItem.dkd_tone} />
      <h3 className="dkd-anyela-card-title">{dkd_packageItem.dkd_title}</h3>
      <p className="dkd-anyela-card-text">{dkd_packageItem.dkd_text}</p>
      <div className={`dkd-anyela-price dkd-anyela-price-${dkd_packageItem.dkd_tone}`}>{dkd_packageItem.dkd_price}</div>
      <button className={`dkd-anyela-small-button dkd-anyela-button-${dkd_packageItem.dkd_tone}`} type="button">
        Seç
      </button>
    </article>
  );
}

function DkdAnyelaServiceCard({ dkd_service }) {
  return (
    <article className="dkd-anyela-service-card">
      <DkdAnyelaIconBubble dkd_icon={dkd_service.dkd_icon} dkd_tone={dkd_service.dkd_tone} />
      <div className="dkd-anyela-service-content">
        <h3 className="dkd-anyela-feature-title">{dkd_service.dkd_title}</h3>
        <p className="dkd-anyela-feature-text">{dkd_service.dkd_text}</p>
      </div>
      <div className="dkd-anyela-chevron">›</div>
    </article>
  );
}

function DkdAnyelaRuleItem({ dkd_rule }) {
  return (
    <article className="dkd-anyela-rule-item">
      <div className="dkd-anyela-check">✓</div>
      <div>
        <h3 className="dkd-anyela-rule-title">{dkd_rule.dkd_title}</h3>
        <p className="dkd-anyela-rule-text">{dkd_rule.dkd_text}</p>
      </div>
    </article>
  );
}

export default function DkdAnyelaBornPage() {
  return (
    <main className="dkd-anyela-shell" aria-label="Anyela Born Club mobil ana sayfa">
      <div className="dkd-anyela-content">
        <header className="dkd-anyela-topbar">
          <div className="dkd-anyela-brand" aria-label="Anyela Born Club marka alanı">
            <div className="dkd-anyela-brand-mark">🌴</div>
            <div>
              <h1 className="dkd-anyela-logo-title">Anyela</h1>
              <div className="dkd-anyela-logo-subtitle">BORN CLUB</div>
            </div>
          </div>
          <button className="dkd-anyela-menu-button" type="button" aria-label="Menüyü aç">
            ☰
          </button>
        </header>

        <section className="dkd-anyela-hero">
          <div className="dkd-anyela-hero-palm" aria-hidden="true" />
          <span className="dkd-anyela-hero-badge">🌅 Miami temalı özel deneyim</span>
          <h2 className="dkd-anyela-hero-title">
            Anyela ile Özel Deneyime
            <span className="dkd-anyela-hero-script">Hoş Geldin</span>
          </h2>
          <p className="dkd-anyela-hero-text">Sohbet et, sesli mesaj al, özel görsel/video siparişi ver.</p>
          <div className="dkd-anyela-cta-row">
            <a className="dkd-anyela-primary-button" href="#dkd-anyela-packages">Paketleri İncele →</a>
            <a className="dkd-anyela-secondary-button" href="#dkd-anyela-payment">Dekont Yükle</a>
          </div>
          <div className="dkd-anyela-hero-visual" aria-hidden="true">
            <div className="dkd-anyela-neon-ring" />
            <div className="dkd-anyela-silhouette" />
          </div>
        </section>

        <section className="dkd-anyela-section dkd-anyela-video-card" aria-label="Anyela tanıtım videosu">
          <div className="dkd-anyela-video-thumb"><div className="dkd-anyela-play-icon">▶</div></div>
          <div>
            <h2 className="dkd-anyela-video-title">Anyela Tanıtım Videosu</h2>
            <p className="dkd-anyela-video-text">Kısa tanıtımı izle</p>
          </div>
          <div className="dkd-anyela-round-action">▶</div>
        </section>

        <section className="dkd-anyela-section" aria-labelledby="dkd-anyela-how-title">
          <h2 className="dkd-anyela-heading" id="dkd-anyela-how-title">🌴 Nasıl Çalışır? 🌴</h2>
          <div className="dkd-anyela-step-grid">
            {dkd_anyelaSteps.map((dkd_step) => (
              <DkdAnyelaStepCard key={dkd_step.dkd_id} dkd_step={dkd_step} />
            ))}
          </div>
        </section>

        <section className="dkd-anyela-section" id="dkd-anyela-packages" aria-labelledby="dkd-anyela-package-title">
          <h2 className="dkd-anyela-heading" id="dkd-anyela-package-title">🔥 Popüler Paketler</h2>
          <div className="dkd-anyela-package-scroll">
            {dkd_anyelaPackages.map((dkd_packageItem) => (
              <DkdAnyelaPackageCard key={dkd_packageItem.dkd_id} dkd_packageItem={dkd_packageItem} />
            ))}
          </div>
        </section>

        <section className="dkd-anyela-section" aria-labelledby="dkd-anyela-service-title">
          <h2 className="dkd-anyela-heading" id="dkd-anyela-service-title">⭐ Özel Hizmetler</h2>
          <div className="dkd-anyela-services-grid">
            {dkd_anyelaServices.map((dkd_service) => (
              <DkdAnyelaServiceCard key={dkd_service.dkd_id} dkd_service={dkd_service} />
            ))}
          </div>
        </section>

        <section className="dkd-anyela-section dkd-anyela-payment-card" id="dkd-anyela-payment" aria-label="IBAN ile ödeme">
          <div className="dkd-anyela-secure-mark">🔐</div>
          <div>
            <h2 className="dkd-anyela-payment-title">IBAN ile Ödeme</h2>
            <p className="dkd-anyela-payment-text">Güvenli ödeme için IBAN bilgimize ödeme yapın. Dekontu yükleyerek işleminizi tamamlayın.</p>
          </div>
          <div className="dkd-anyela-payment-actions">
            <button className="dkd-anyela-upload-button" type="button">☁️ Dekont Yükle</button>
            <span className="dkd-anyela-ssl-note">🔒 256-bit SSL</span>
          </div>
        </section>

        <section className="dkd-anyela-section" aria-labelledby="dkd-anyela-rule-heading">
          <h2 className="dkd-anyela-heading" id="dkd-anyela-rule-heading">🛡️ Güvenli Kullanım / Kurallar</h2>
          <div className="dkd-anyela-rules-card">
            <div className="dkd-anyela-rule-list">
              {dkd_anyelaRules.map((dkd_rule) => (
                <DkdAnyelaRuleItem key={dkd_rule.dkd_id} dkd_rule={dkd_rule} />
              ))}
            </div>
          </div>
        </section>

        <section className="dkd-anyela-section dkd-anyela-final-card" aria-label="Özel oda çağrısı">
          <div>
            <h2 className="dkd-anyela-final-title">Hazırsan başlayalım.</h2>
            <p className="dkd-anyela-final-subtitle">Anyela seni bekliyor. ♡</p>
          </div>
          <a className="dkd-anyela-primary-button" href="#dkd-anyela-packages">🚪 Özel Odanı Aç</a>
        </section>
      </div>

      <nav className="dkd-anyela-bottom-nav" aria-label="Alt menü">
        <a className="dkd-anyela-nav-item dkd-anyela-active" href="#"><span className="dkd-anyela-nav-icon">⌂</span>Ana Sayfa</a>
        <a className="dkd-anyela-nav-item" href="#dkd-anyela-packages"><span className="dkd-anyela-nav-icon">🎁</span>Paketler</a>
        <a className="dkd-anyela-nav-item" href="#dkd-anyela-payment"><span className="dkd-anyela-nav-icon">💬</span>Sohbet</a>
        <a className="dkd-anyela-nav-item" href="#"><span className="dkd-anyela-nav-icon">♡</span>Profil</a>
      </nav>
    </main>
  );
}
