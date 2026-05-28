import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Clock3,
  Crown,
  Diamond,
  Filter,
  Gem,
  Heart,
  Home,
  Image as ImageIcon,
  LockKeyhole,
  Mail,
  Megaphone,
  MessageCircle,
  Mic,
  PackageOpen,
  Play,
  Plus,
  Rocket,
  SendHorizontal,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  UploadCloud,
  UserRound,
  Video,
  Volume2,
  WandSparkles,
  Waves,
} from 'lucide-react';
import dkdAnyelaCarRed from './assets/anyela_car_red.jpg';
import dkdAnyelaCarWhite from './assets/anyela_car_white.jpg';
import dkdAnyelaBeachCafe from './assets/anyela_beach_cafe.jpg';
import dkdAnyelaPool from './assets/anyela_pool.jpg';
import dkdAnyelaYachtBlue from './assets/anyela_yacht_blue.jpg';
import dkdAnyelaYachtGreen from './assets/anyela_yacht_green.jpg';
import dkdAnyelaYachtGold from './assets/anyela_yacht_gold.jpg';

const dkd_imageSet = {
  dkd_carRed: dkdAnyelaCarRed,
  dkd_carWhite: dkdAnyelaCarWhite,
  dkd_beachCafe: dkdAnyelaBeachCafe,
  dkd_pool: dkdAnyelaPool,
  dkd_yachtBlue: dkdAnyelaYachtBlue,
  dkd_yachtGreen: dkdAnyelaYachtGreen,
  dkd_yachtGold: dkdAnyelaYachtGold,
};

const dkd_navItems = [
  { dkd_key: 'home', dkd_label: 'Ana Sayfa', dkd_Icon: Home },
  { dkd_key: 'chat', dkd_label: 'Sohbet', dkd_Icon: MessageCircle },
  { dkd_key: 'favorites', dkd_label: 'Favoriler', dkd_Icon: Heart },
  { dkd_key: 'packages', dkd_label: 'Paketler', dkd_Icon: ShoppingBag },
  { dkd_key: 'account', dkd_label: 'Hesabım', dkd_Icon: UserRound },
];

const dkd_primaryActions = [
  {
    dkd_key: 'chat',
    dkd_title: 'Sohbet Başlat',
    dkd_subtitle: 'Hemen yazışmaya başla',
    dkd_Icon: MessageCircle,
  },
  {
    dkd_key: 'voice',
    dkd_title: 'Voice',
    dkd_subtitle: 'Sesli mesaj gönder ve cevap al',
    dkd_Icon: Waves,
  },
  {
    dkd_key: 'packages',
    dkd_title: 'Paketler',
    dkd_subtitle: 'Özel içerik paketlerini keşfet',
    dkd_Icon: Crown,
  },
  {
    dkd_key: 'ads',
    dkd_title: 'Reklam',
    dkd_subtitle: 'Anyela reklam yüzünüz olsun',
    dkd_Icon: Megaphone,
  },
];

const dkd_packageItems = [
  {
    dkd_key: 'intro',
    dkd_label: 'Intro',
    dkd_title: 'Anyela Intro',
    dkd_short: 'Kişiye özel karşılama videosu',
    dkd_detail: '10 dk yazılı sohbet ve karşılama deneyimi.',
    dkd_price: '₺149',
    dkd_badge: 'Popüler',
    dkd_Icon: MessageCircle,
    dkd_image: dkd_imageSet.dkd_carRed,
  },
  {
    dkd_key: 'private',
    dkd_label: 'Private Chat',
    dkd_title: 'Private Chat',
    dkd_short: 'Özel yazışma deneyimi',
    dkd_detail: '30 dakika özel yazışma, öncelikli yanıt.',
    dkd_price: '₺299',
    dkd_badge: 'En Çok Tercih Edilen',
    dkd_Icon: MessageCircle,
    dkd_image: dkd_imageSet.dkd_carWhite,
  },
  {
    dkd_key: 'voice_message',
    dkd_label: 'Voice Message',
    dkd_title: 'Voice Message',
    dkd_short: 'Kişisel sesli mesajın',
    dkd_detail: 'Adınla hitap edebilen özel sesli cevap.',
    dkd_price: '₺199',
    dkd_badge: 'Popüler',
    dkd_Icon: Mic,
    dkd_image: dkd_imageSet.dkd_yachtBlue,
  },
  {
    dkd_key: 'voice_private',
    dkd_label: 'Voice Chat',
    dkd_title: 'Voice Chat Private',
    dkd_short: 'Anyela ile özel sesli görüşme',
    dkd_detail: 'Sesli mesajlaşma ve hızlı yanıt deneyimi.',
    dkd_price: '₺599',
    dkd_badge: 'Premium',
    dkd_Icon: Volume2,
    dkd_image: dkd_imageSet.dkd_pool,
  },
  {
    dkd_key: 'style',
    dkd_label: 'Style Try-On',
    dkd_title: 'Style Try-On',
    dkd_short: 'Stil dene, fotoğraf iste',
    dkd_detail: 'Kıyafet referansından özel görsel konsept.',
    dkd_price: '₺249',
    dkd_badge: 'Yeni',
    dkd_Icon: WandSparkles,
    dkd_image: dkd_imageSet.dkd_beachCafe,
  },
  {
    dkd_key: 'photo',
    dkd_label: 'Photo Set',
    dkd_title: 'Photo Set',
    dkd_short: 'Senin için özel fotoğraf seti',
    dkd_detail: '5 adet özel konsept fotoğraf seti.',
    dkd_price: '₺349',
    dkd_badge: 'Hızlı',
    dkd_Icon: ImageIcon,
    dkd_image: dkd_imageSet.dkd_yachtGreen,
  },
  {
    dkd_key: 'video',
    dkd_label: 'Talking Video',
    dkd_title: 'Talking Video',
    dkd_short: 'Senin için özel konuşan video',
    dkd_detail: 'Kişiye özel kısa konuşmalı video.',
    dkd_price: '₺399',
    dkd_badge: 'Video',
    dkd_Icon: Video,
    dkd_image: dkd_imageSet.dkd_yachtGold,
  },
  {
    dkd_key: 'vip',
    dkd_label: 'VIP',
    dkd_title: 'VIP Fan Pack',
    dkd_short: 'Koleksiyonluk özel içerik paketi',
    dkd_detail: 'Sohbet, sesli mesaj ve özel görseller.',
    dkd_price: '₺899',
    dkd_badge: 'VIP',
    dkd_Icon: Crown,
    dkd_image: dkd_imageSet.dkd_carRed,
  },
];

const dkd_adPackages = [
  {
    dkd_key: 'ad_mini',
    dkd_title: 'Reklam Mini',
    dkd_price: '₺4.999+',
    dkd_period: '7 iş günü',
    dkd_Icon: Rocket,
    dkd_lines: ['1 İçerik (Foto/Video)', '1 Platform Paylaşım', 'Reklam Etiketi'],
  },
  {
    dkd_key: 'ad_standard',
    dkd_title: 'Reklam Standart',
    dkd_price: '₺9.999+',
    dkd_period: '7–10 iş günü',
    dkd_Icon: Star,
    dkd_lines: ['2 İçerik (Foto/Video)', '2 Platform Paylaşım', 'Hikaye Paylaşımı', 'Ürün Yerleştirme'],
  },
  {
    dkd_key: 'ad_pro',
    dkd_title: 'Reklam Pro',
    dkd_price: '₺19.999+',
    dkd_period: '10–14 iş günü',
    dkd_Icon: Crown,
    dkd_featured: true,
    dkd_lines: ['3 İçerik (Foto/Video)', '3 Platform Paylaşım', 'Hikaye + Reels', 'Kısa Senaryo', 'Raporlama'],
  },
  {
    dkd_key: 'brand_face',
    dkd_title: 'Marka Yüzü',
    dkd_price: '₺49.999+',
    dkd_period: 'Özel planlama',
    dkd_Icon: Diamond,
    dkd_lines: ['1 Ay Marka Yüzü', '8+ İçerik', 'Tüm Platformlar', 'Reklam Kampanyası', 'Aylık Raporlama'],
  },
];

const dkd_industryItems = [
  { dkd_label: 'Restoran', dkd_Icon: ShoppingCart },
  { dkd_label: 'Kafe', dkd_Icon: Mail },
  { dkd_label: 'Butik', dkd_Icon: ShoppingBag },
  { dkd_label: 'Güzellik Salonu', dkd_Icon: Gem },
  { dkd_label: 'Otel', dkd_Icon: BriefcaseBusiness },
  { dkd_label: 'Emlak', dkd_Icon: Home },
  { dkd_label: 'Dijital Ürün', dkd_Icon: Camera },
];

function DkdBrandHeader({ dkd_showBack = false, dkd_title = '' }) {
  return (
    <header className="dkd-brand-header">
      <div className="dkd-brand-left">
        {dkd_showBack ? <ArrowLeft className="dkd-back-icon" size={26} /> : <DkdLogoMark />}
        <div>
          {dkd_title ? <div className="dkd-page-mini-title">{dkd_title}</div> : <><div className="dkd-brand-name">ANYELA</div><div className="dkd-brand-subtitle">BORN CLUB</div></>}
        </div>
      </div>
      <div className="dkd-brand-actions">
        <span className="dkd-premium-badge"><Sparkles size={16} /> Premium AI</span>
        <Bell size={22} />
      </div>
    </header>
  );
}

function DkdLogoMark() {
  return (
    <div className="dkd-logo-mark" aria-hidden="true">
      <span className="dkd-logo-slash dkd-logo-slash-left" />
      <span className="dkd-logo-slash dkd-logo-slash-right" />
      <span className="dkd-logo-core" />
    </div>
  );
}

function DkdBottomNav({ dkd_activeScreen, dkd_setActiveScreen }) {
  return (
    <nav className="dkd-bottom-nav">
      {dkd_navItems.map((dkd_item) => {
        const DkdIcon = dkd_item.dkd_Icon;
        const dkd_isActive = dkd_activeScreen === dkd_item.dkd_key;
        return (
          <button
            key={dkd_item.dkd_key}
            className={`dkd-nav-button ${dkd_isActive ? 'dkd-nav-button-active' : ''}`}
            onClick={() => dkd_setActiveScreen(dkd_item.dkd_key)}
            type="button"
          >
            <DkdIcon size={24} />
            <span>{dkd_item.dkd_label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DkdScreenFrame({ dkd_activeScreen, dkd_setActiveScreen, children }) {
  return (
    <div className="dkd-phone-shell">
      <main className="dkd-phone-screen">{children}</main>
      <DkdBottomNav dkd_activeScreen={dkd_activeScreen} dkd_setActiveScreen={dkd_setActiveScreen} />
    </div>
  );
}

function DkdSectionTitle({ dkd_icon: DkdIcon, dkd_title, dkd_linkText, dkd_onLink }) {
  return (
    <div className="dkd-section-title-row">
      <div className="dkd-section-title-left">
        {DkdIcon ? <DkdIcon size={21} /> : null}
        <h2>{dkd_title}</h2>
      </div>
      {dkd_linkText ? (
        <button className="dkd-inline-link" type="button" onClick={dkd_onLink}>
          {dkd_linkText} <ArrowRight size={18} />
        </button>
      ) : null}
    </div>
  );
}

function DkdHomeScreen({ dkd_setActiveScreen }) {
  return (
    <div className="dkd-screen dkd-home-screen">
      <DkdBrandHeader />
      <section className="dkd-home-hero">
        <div className="dkd-hero-copy">
          <h1>Anyela ile konuş, <span>sesli cevap al, özel içerik iste.</span></h1>
          <p>Gerçekçi, zeki ve tamamen size özel AI influencer deneyimi.</p>
          <div className="dkd-online-row"><span /> Şu an online</div>
        </div>
        <button className="dkd-hero-video-card" onClick={() => dkd_setActiveScreen('chat')} type="button">
          <img src={dkd_imageSet.dkd_yachtGreen} alt="Anyela hoş geldin videosu" />
          <div className="dkd-play-ring"><Play size={34} fill="currentColor" /></div>
          <div className="dkd-video-caption"><strong>Anyela’dan</strong><span>Hoş geldin videosu</span></div>
          <span className="dkd-video-time">00:45</span>
        </button>
      </section>

      <section className="dkd-action-grid">
        {dkd_primaryActions.map((dkd_item) => {
          const DkdIcon = dkd_item.dkd_Icon;
          return (
            <button key={dkd_item.dkd_key} className="dkd-action-card" onClick={() => dkd_setActiveScreen(dkd_item.dkd_key)} type="button">
              <DkdIcon size={42} />
              <strong>{dkd_item.dkd_title}</strong>
              <span>{dkd_item.dkd_subtitle}</span>
            </button>
          );
        })}
      </section>

      <section>
        <DkdSectionTitle dkd_icon={Star} dkd_title="Popüler Paketler" dkd_linkText="Tümünü Gör" dkd_onLink={() => dkd_setActiveScreen('packages')} />
        <div className="dkd-package-strip">
          {dkd_packageItems.slice(0, 5).map((dkd_item) => {
            const DkdIcon = dkd_item.dkd_Icon;
            return (
              <button className="dkd-mini-package-card" key={dkd_item.dkd_key} onClick={() => dkd_setActiveScreen('payment')} type="button">
                <img src={dkd_item.dkd_image} alt={dkd_item.dkd_title} />
                <span className="dkd-card-label">{dkd_item.dkd_label}</span>
                <DkdIcon className="dkd-card-icon" size={19} />
                <p>{dkd_item.dkd_short}</p>
                <strong>{dkd_item.dkd_price}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <button className="dkd-ad-banner" onClick={() => dkd_setActiveScreen('ads')} type="button">
        <div className="dkd-ad-banner-copy">
          <h2>Anyela reklam <span>yüzünüz olsun.</span></h2>
          <p>Markanıza özel içerikler, profesyonel çözümler ve geniş kitlelere erişim.</p>
          <span>Detaylı Bilgi Al <ArrowRight size={17} /></span>
        </div>
        <img src={dkd_imageSet.dkd_carWhite} alt="Anyela reklam yüzünüz olsun" />
      </button>

      <DkdTrustRow />
      <DkdFaqPreview />
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdPackagesScreen({ dkd_setActiveScreen }) {
  return (
    <div className="dkd-screen">
      <div className="dkd-page-topbar">
        <button type="button" onClick={() => dkd_setActiveScreen('home')}><ArrowLeft size={25} /></button>
        <h1>Paketler ve Deneyimler</h1>
        <button type="button"><Filter size={21} /> Filtrele</button>
      </div>

      <section className="dkd-package-hero">
        <div>
          <h2>Doğru paketi seç, <span>benzersiz deneyimi yaşa.</span></h2>
          <p>İhtiyacına en uygun paketi seç, hızlı ve güvenli ödeme ile Anyela’dan özel içerikler al.</p>
        </div>
        <div className="dkd-glow-box"><PackageOpen size={58} /><Sparkles size={22} /></div>
      </section>

      <div className="dkd-section-title-row dkd-compact-title-row">
        <h2>Tüm Paketler</h2>
        <span className="dkd-secure-pill"><ShieldCheck size={16} /> 100% Güvenli Alışveriş</span>
      </div>

      <section className="dkd-package-grid">
        {dkd_packageItems.map((dkd_item) => {
          const DkdIcon = dkd_item.dkd_Icon;
          return (
            <button
              className={`dkd-package-card ${dkd_item.dkd_badge === 'VIP' ? 'dkd-package-card-vip' : ''}`}
              key={dkd_item.dkd_key}
              onClick={() => dkd_setActiveScreen('payment')}
              type="button"
            >
              <span className="dkd-package-badge">{dkd_item.dkd_badge}</span>
              <DkdIcon className="dkd-package-card-icon" size={48} />
              <strong>{dkd_item.dkd_title}</strong>
              <p>{dkd_item.dkd_detail}</p>
              <b>{dkd_item.dkd_price}</b>
              <span className="dkd-outline-button">Paketi Seç</span>
            </button>
          );
        })}
      </section>

      <DkdFeatureStrip />
      <DkdHowItWorks />
      <DkdFaqPreview />
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdChatScreen() {
  return (
    <div className="dkd-screen dkd-chat-screen">
      <header className="dkd-chat-header">
        <ArrowLeft size={28} />
        <img src={dkd_imageSet.dkd_pool} alt="Anyela avatar" />
        <div className="dkd-chat-title-wrap">
          <h1>Anyela <BadgeCheck size={22} fill="currentColor" /></h1>
          <span><i /> Şu an online</span>
        </div>
        <div className="dkd-chat-timer"><Clock3 size={20} /><span>30 DK Private Chat</span><strong>24:17 / 30:00</strong></div>
      </header>

      <section className="dkd-conversation">
        <DkdChatBubble dkd_side="left" dkd_text="Merhaba! 💙 Bugün seninle konuşmak harika. Nasılsın?" dkd_time="21:42" />
        <DkdChatBubble dkd_side="right" dkd_text="Harikayım, seninle konuşmak günümü çok güzelleştiriyor 😊" dkd_time="21:43" />
        <div className="dkd-chat-bubble dkd-left-bubble dkd-voice-bubble">
          <img src={dkd_imageSet.dkd_pool} alt="Anyela" />
          <div className="dkd-message-card"><Play size={24} fill="currentColor" /><DkdWaveform /><span>0:18</span><small>21:44</small></div>
        </div>
        <div className="dkd-chat-bubble dkd-right-bubble dkd-photo-bubble">
          <div className="dkd-message-card">
            <img src={dkd_imageSet.dkd_yachtGold} alt="Kullanıcı görsel eki" />
            <p>Bugün şu manzaradayım 🌃</p>
            <small>21:45 ✓✓</small>
          </div>
        </div>
        <DkdChatBubble dkd_side="left" dkd_text="Harika bir manzara! 🌉✨ İstanbul geceleri bambaşka..." dkd_time="21:46" />
      </section>

      <section className="dkd-preparing-card">
        <div className="dkd-mic-gem"><Mic size={34} /></div>
        <div>
          <h3>Sesli yanıt hazırlanıyor...</h3>
          <p>En iyi yanıtı senin için hazırlıyorum.</p>
          <div className="dkd-progress"><span style={{ width: '68%' }} /></div>
        </div>
        <strong>%68</strong>
      </section>

      <section className="dkd-session-card">
        <Clock3 size={36} />
        <div><span>Private Chat Oturumun</span><strong>24:17 <small>/ 30:00</small></strong><p>Kalan süre 05:43</p></div>
        <button type="button"><Sparkles size={18} /> Süre Ekle</button>
      </section>

      <section className="dkd-chat-action-row">
        <button type="button"><Mic size={32} /><strong>Ses Gönder</strong><span>Ses kaydı gönder</span></button>
        <button type="button"><ImageIcon size={32} /><strong>Görsel Yükle</strong><span>Fotoğraf / Görsel ekle</span></button>
        <button type="button"><Video size={32} /><strong>Özel Video İste</strong><span>Kısa video talep et</span></button>
      </section>

      <section className="dkd-chat-shortcuts">
        <DkdShortcutCard dkd_Icon={WandSparkles} dkd_title="Style Try-On" dkd_text="Tarzını deneyimle" />
        <DkdShortcutCard dkd_Icon={Volume2} dkd_title="Sesli Cevap" dkd_text="Sesli yanıt al" />
        <DkdShortcutCard dkd_Icon={Video} dkd_title="Konuşmalı Video" dkd_text="Yüz yüze sohbet et" />
        <DkdShortcutCard dkd_Icon={Megaphone} dkd_title="Reklam Talebi" dkd_text="Birlikte çalışalım" />
      </section>

      <section className="dkd-message-input">
        <Plus size={25} />
        <input placeholder="Mesajını yaz..." />
        <button type="button"><SendHorizontal size={24} /></button>
      </section>
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdPaymentScreen() {
  return (
    <div className="dkd-screen dkd-payment-screen">
      <DkdBrandHeader />
      <div className="dkd-page-heading-row">
        <ArrowLeft size={26} />
        <div><h1>Ödeme ve Başlangıç</h1><p>Ödemenizi tamamlayın, Anyela ile hemen sohbet etmeye başlayın.</p></div>
      </div>
      <DkdPaymentStepper />

      <section className="dkd-selected-package">
        <img src={dkd_imageSet.dkd_carWhite} alt="Private Chat paketi" />
        <div><span>Seçilen Paket</span><h2>Private Chat – 30 DK</h2><p>Anyela ile tamamen size özel birebir sohbet.</p></div>
        <strong>₺299</strong>
      </section>

      <section className="dkd-payment-card">
        <h2><ShieldCheck size={26} /> IBAN ile Ödeme</h2>
        <DkdPaymentRow dkd_label="Banka Adı" dkd_value="TR Dijital Bank" />
        <DkdPaymentRow dkd_label="Alıcı Adı" dkd_value="ANYELA BORN CLUB LTD. ŞTİ." />
        <DkdPaymentRow dkd_label="IBAN" dkd_value="TR12 3456 7890 1234 5678 9012 34" dkd_copy />
        <DkdPaymentRow dkd_label="Açıklama / Referans Kodu" dkd_value="ANYELA-123456" dkd_copy />
        <p className="dkd-info-note">Ödemenizi yaptıktan sonra dekontunuzu yükleyerek onay sürecini başlatın.</p>
      </section>

      <section className="dkd-upload-card">
        <h2><UploadCloud size={26} /> Dekont Yükle</h2>
        <div className="dkd-upload-zone"><UploadCloud size={46} /><span>Dekontunuzu buraya sürükleyin veya cihazınızdan seçin</span><button type="button">Dosya Seç</button></div>
      </section>

      <section className="dkd-activation-card">
        <Rocket size={36} />
        <div><h2>Sohbet Aktivasyonu</h2><p>Dekontunuz onaylandıktan sonra sohbetiniz otomatik olarak aktif hale gelecektir.</p></div>
        <span>Onay süresi: 5–15 dk</span>
      </section>

      <DkdTrustRules />
      <DkdAddons />
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdAdsScreen() {
  return (
    <div className="dkd-screen dkd-ads-screen">
      <DkdBrandHeader />
      <section className="dkd-ads-hero">
        <div className="dkd-ads-copy">
          <span className="dkd-outline-pill">REKLAM İŞ BİRLİĞİ</span>
          <h1>Anyela Reklam <span>Yüzünüz Olsun</span></h1>
          <p>Markanız için içerik üretir, tanıtım yapar, ürün yerleştirir ve sosyal medyada etkili reklam kampanyaları oluştururum.</p>
          <button type="button">Teklif Al <ArrowRight size={20} /></button>
          <small><i /> Hemen yanıt • Güvenli iş birliği</small>
        </div>
        <img src={dkd_imageSet.dkd_carRed} alt="Anyela reklam iş birliği" />
      </section>

      <section className="dkd-ad-package-row">
        {dkd_adPackages.map((dkd_item) => {
          const DkdIcon = dkd_item.dkd_Icon;
          return (
            <article key={dkd_item.dkd_key} className={`dkd-ad-package-card ${dkd_item.dkd_featured ? 'dkd-ad-package-featured' : ''}`}>
              {dkd_item.dkd_featured ? <span className="dkd-featured-chip">POPÜLER</span> : null}
              <DkdIcon size={31} />
              <h2>{dkd_item.dkd_title}</h2>
              <strong>{dkd_item.dkd_price}</strong>
              <ul>{dkd_item.dkd_lines.map((dkd_line) => <li key={dkd_line}>{dkd_line}</li>)}</ul>
              <span>{dkd_item.dkd_period}</span>
            </article>
          );
        })}
      </section>

      <section className="dkd-benefit-row">
        <DkdBenefit dkd_Icon={Clock3} dkd_title="Hızlı Üretim" dkd_text="Kısa sürede profesyonel içerik teslimi" />
        <DkdBenefit dkd_Icon={Heart} dkd_title="Yüksek Etkileşim" dkd_text="AI influencer gücüyle daha fazla etkileşim" />
        <DkdBenefit dkd_Icon={ShieldCheck} dkd_title="Premium Kalite" dkd_text="Sinema kalitesinde görsel ve video içerik" />
        <DkdBenefit dkd_Icon={ArrowRight} dkd_title="Ölçülebilir Sonuçlar" dkd_text="Performans raporları ile net sonuçlar" />
      </section>

      <DkdSectionTitle dkd_title="Hangi Sektörler İçin Uygun?" dkd_linkText="Tümünü Gör" />
      <section className="dkd-industry-grid">
        {dkd_industryItems.map((dkd_item) => {
          const DkdIcon = dkd_item.dkd_Icon;
          return <div key={dkd_item.dkd_label}><DkdIcon size={28} /><span>{dkd_item.dkd_label}</span></div>;
        })}
      </section>

      <section className="dkd-sponsored-note"><ShieldCheck size={32} /><div><h3>Tüm paylaşımlar reklam / sponsorlu etiketiyle yapılır.</h3><p>Yasalara ve platform kurallarına uygun, şeffaf içerik üretimi sağlanır.</p></div></section>
      <DkdLeadForm />
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdVoiceScreen() {
  return (
    <div className="dkd-screen dkd-voice-screen">
      <DkdBrandHeader dkd_showBack dkd_title="Voice Deneyimi" />
      <section className="dkd-voice-hero">
        <div className="dkd-orb"><Mic size={58} /></div>
        <h1>Sadece sesli konuşmak isteyenler için.</h1>
        <p>Sesli mesaj gönder, Anyela’dan kişiye özel sesli cevap al. Yazı yazmadan doğal ve premium bir deneyim.</p>
        <button type="button">Voice Chat Başlat <ArrowRight size={20} /></button>
      </section>
      <section className="dkd-voice-card-list">
        <DkdVoiceOption dkd_Icon={Volume2} dkd_title="Voice Intro" dkd_price="₺199" dkd_text="1 kişiye özel sesli cevap" />
        <DkdVoiceOption dkd_Icon={Waves} dkd_title="Voice Chat Mini" dkd_price="₺699" dkd_text="5 sesli mesaj hakkı" />
        <DkdVoiceOption dkd_Icon={Mic} dkd_title="Voice Chat Private" dkd_price="₺999" dkd_text="30 dk sesli mesajlaşma" />
      </section>
      <DkdHowItWorks />
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdFavoritesScreen() {
  return (
    <div className="dkd-screen">
      <DkdBrandHeader dkd_showBack dkd_title="Favoriler" />
      <section className="dkd-placeholder-screen">
        <Heart size={64} />
        <h1>Favori paketlerin burada.</h1>
        <p>Sohbet, sesli cevap ve reklam paketlerini kaydedip hızlıca satın alabilirsin.</p>
      </section>
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdAccountScreen() {
  return (
    <div className="dkd-screen">
      <DkdBrandHeader dkd_showBack dkd_title="Hesabım" />
      <section className="dkd-profile-card">
        <img src={dkd_imageSet.dkd_pool} alt="Kullanıcı profili" />
        <h1>Anyela Born Club</h1>
        <p>Ödeme geçmişi, sohbet oturumları, içerik teslimleri ve gizlilik seçenekleri.</p>
        <button type="button">Giriş Yap / Kayıt Ol</button>
      </section>
      <DkdTrustRules />
      <div className="dkd-bottom-spacer" />
    </div>
  );
}

function DkdChatBubble({ dkd_side, dkd_text, dkd_time }) {
  const dkd_isLeft = dkd_side === 'left';
  return (
    <div className={`dkd-chat-bubble ${dkd_isLeft ? 'dkd-left-bubble' : 'dkd-right-bubble'}`}>
      {dkd_isLeft ? <img src={dkd_imageSet.dkd_pool} alt="Anyela" /> : null}
      <div className="dkd-message-card"><p>{dkd_text}</p><small>{dkd_time}{dkd_isLeft ? '' : ' ✓✓'}</small></div>
    </div>
  );
}

function DkdWaveform() {
  const dkd_waveBars = Array.from({ length: 32 }, (_, dkd_index) => dkd_index);
  return <div className="dkd-waveform">{dkd_waveBars.map((dkd_index) => <span key={dkd_index} style={{ height: `${8 + ((dkd_index * 7) % 28)}px` }} />)}</div>;
}

function DkdShortcutCard({ dkd_Icon, dkd_title, dkd_text }) {
  const DkdIcon = dkd_Icon;
  return <button type="button"><DkdIcon size={36} /><strong>{dkd_title}</strong><span>{dkd_text}</span><i><ArrowRight size={16} /></i></button>;
}

function DkdFeatureStrip() {
  const dkd_features = [
    { dkd_title: 'Hızlı Teslimat', dkd_text: 'Paketine göre 6–48 saat içinde teslimat.', dkd_Icon: Clock3 },
    { dkd_title: 'Özel Sohbet', dkd_text: 'Seçili paketlerde özel yazışma imkanı.', dkd_Icon: MessageCircle },
    { dkd_title: 'Kişisel Ses', dkd_text: 'Anyela’dan sana özel sesli mesaj.', dkd_Icon: Mic },
    { dkd_title: 'Özel Görseller', dkd_text: 'Try-on ve fotoğraf içerikleri.', dkd_Icon: ImageIcon },
    { dkd_title: 'Konuşan Video', dkd_text: 'Kişisel video mesajları.', dkd_Icon: Video },
  ];
  return <section className="dkd-feature-strip">{dkd_features.map((dkd_item) => { const DkdIcon = dkd_item.dkd_Icon; return <div key={dkd_item.dkd_title}><DkdIcon size={23} /><strong>{dkd_item.dkd_title}</strong><span>{dkd_item.dkd_text}</span></div>; })}</section>;
}

function DkdHowItWorks() {
  const dkd_steps = [
    { dkd_title: 'Paket seç', dkd_text: 'İhtiyacına en uygun paketi seç.', dkd_Icon: ShoppingCart },
    { dkd_title: 'IBAN ile öde', dkd_text: 'Ödemeni IBAN’a gerçekleştir.', dkd_Icon: ShieldCheck },
    { dkd_title: 'Dekont yükle', dkd_text: 'Dekontunu sisteme yükle.', dkd_Icon: UploadCloud },
    { dkd_title: 'Anyela ile başla', dkd_text: 'İçeriğin hazırlanır ve sana ulaşır.', dkd_Icon: DkdLogoMark },
  ];
  return (
    <section className="dkd-how-section">
      <h2>Nasıl Çalışır?</h2>
      <div className="dkd-step-row">
        {dkd_steps.map((dkd_item, dkd_index) => {
          const DkdIcon = dkd_item.dkd_Icon;
          return (
            <div key={dkd_item.dkd_title} className="dkd-step-card">
              <span className="dkd-step-number">{dkd_index + 1}</span>
              <DkdIcon size={30} />
              <strong>{dkd_item.dkd_title}</strong>
              <p>{dkd_item.dkd_text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DkdFaqPreview() {
  return (
    <section className="dkd-faq-section">
      <DkdSectionTitle dkd_icon={MessageCircle} dkd_title="Sık Sorulanlar" dkd_linkText="Tüm SSS" />
      {['Anyela kimdir?', 'İçeriklerim gizli mi kalır?', 'Ödemeler nasıl yapılıyor?'].map((dkd_question) => (
        <button className="dkd-faq-row" key={dkd_question} type="button">{dkd_question}<ChevronDown size={20} /></button>
      ))}
    </section>
  );
}

function DkdTrustRow() {
  return (
    <section className="dkd-trust-row">
      <DkdTrustItem dkd_Icon={ShieldCheck} dkd_title="AI Karakter" dkd_text="Gerçekçi ve özgün AI kişilik" />
      <DkdTrustItem dkd_Icon={CheckCircle2} dkd_title="18+ İçerik" dkd_text="Yetişkin kullanıcılar için" />
      <DkdTrustItem dkd_Icon={LockKeyhole} dkd_title="Güvenli Ödeme" dkd_text="Koruma ve onay akışı" />
      <DkdTrustItem dkd_Icon={ShieldCheck} dkd_title="Gizlilik" dkd_text="Verileriniz güvende" />
    </section>
  );
}

function DkdTrustItem({ dkd_Icon, dkd_title, dkd_text }) {
  const DkdIcon = dkd_Icon;
  return <div><DkdIcon size={30} /><strong>{dkd_title}</strong><span>{dkd_text}</span></div>;
}

function DkdPaymentStepper() {
  const dkd_steps = ['Paket Seçildi', 'IBAN ile Ödeme', 'Dekont Yükle', 'Sohbet Aktivasyonu'];
  return <section className="dkd-payment-stepper">{dkd_steps.map((dkd_step, dkd_index) => <div key={dkd_step} className={dkd_index === 0 ? 'dkd-active-step' : ''}><span>{dkd_index + 1}</span><p>{dkd_step}</p></div>)}</section>;
}

function DkdPaymentRow({ dkd_label, dkd_value, dkd_copy = false }) {
  return <div className="dkd-payment-row"><span>{dkd_label}</span><strong>{dkd_value}</strong>{dkd_copy ? <Clipboard size={18} /> : null}</div>;
}

function DkdTrustRules() {
  const dkd_rules = [
    { dkd_title: 'AI Karakter', dkd_text: 'Gerçek kişi değil, AI kişilik', dkd_Icon: ShieldCheck },
    { dkd_title: '18+ İçerik', dkd_text: 'Yalnızca yetişkin kullanıcılar için', dkd_Icon: CheckCircle2 },
    { dkd_title: 'Gizlilik', dkd_text: 'Veriler kontrollü saklanır', dkd_Icon: LockKeyhole },
    { dkd_title: 'Uygun İçerik', dkd_text: 'Saygılı ve uygun içerik beklenir', dkd_Icon: BadgeCheck },
  ];
  return <section className="dkd-rules-section"><h2>Güvenli ve Keyifli Deneyim Kuralları</h2><div>{dkd_rules.map((dkd_item) => { const DkdIcon = dkd_item.dkd_Icon; return <article key={dkd_item.dkd_title}><DkdIcon size={27} /><strong>{dkd_item.dkd_title}</strong><span>{dkd_item.dkd_text}</span></article>; })}</div></section>;
}

function DkdAddons() {
  const dkd_addons = [
    { dkd_title: 'Sesli Cevap', dkd_text: 'Sesli mesaj gönder ve cevap al', dkd_price: '+₺199', dkd_Icon: Waves },
    { dkd_title: 'Style Try-On', dkd_text: 'Stil dene, fotoğraf iste', dkd_price: '+₺249', dkd_Icon: WandSparkles },
    { dkd_title: 'Talking Video', dkd_text: 'Senin için özel konuşan video', dkd_price: '+₺399', dkd_Icon: Video },
  ];
  return <section className="dkd-addons"><DkdSectionTitle dkd_title="Deneyimini Genişlet" dkd_linkText="Tümünü Gör" />{dkd_addons.map((dkd_item) => { const DkdIcon = dkd_item.dkd_Icon; return <article key={dkd_item.dkd_title}><DkdIcon size={31} /><div><strong>{dkd_item.dkd_title}</strong><span>{dkd_item.dkd_text}</span><b>{dkd_item.dkd_price}</b></div><button type="button"><Plus size={18} /></button></article>; })}</section>;
}

function DkdBenefit({ dkd_Icon, dkd_title, dkd_text }) {
  const DkdIcon = dkd_Icon;
  return <article><DkdIcon size={29} /><strong>{dkd_title}</strong><span>{dkd_text}</span></article>;
}

function DkdLeadForm() {
  return (
    <section className="dkd-lead-form">
      <h2>Hemen Teklif Al</h2>
      <p>İhtiyaçlarını bize ilet, sana en uygun teklifi hazırlayalım.</p>
      <div className="dkd-form-grid"><input placeholder="Marka Adı" /><button type="button">Hedef <ChevronDown size={18} /></button><button type="button">İçerik Türü <ChevronDown size={18} /></button><button type="button">Bütçe <ChevronDown size={18} /></button></div>
      <textarea placeholder="Ek notlar, hedef kitle veya özel isteklerinizi yazabilirsiniz..." />
      <button className="dkd-form-submit" type="button">Teklif Talep Et <ArrowRight size={20} /></button>
    </section>
  );
}

function DkdVoiceOption({ dkd_Icon, dkd_title, dkd_price, dkd_text }) {
  const DkdIcon = dkd_Icon;
  return <article><DkdIcon size={35} /><div><h2>{dkd_title}</h2><p>{dkd_text}</p></div><strong>{dkd_price}</strong><button type="button">Seç</button></article>;
}

export default function DkdAnyelaBornMobileApp() {
  const [dkd_activeScreen, dkd_setActiveScreen] = useState('home');
  const dkd_screenContent = useMemo(() => {
    const dkd_screens = {
      home: <DkdHomeScreen dkd_setActiveScreen={dkd_setActiveScreen} />,
      packages: <DkdPackagesScreen dkd_setActiveScreen={dkd_setActiveScreen} />,
      chat: <DkdChatScreen />,
      payment: <DkdPaymentScreen />,
      ads: <DkdAdsScreen />,
      voice: <DkdVoiceScreen />,
      favorites: <DkdFavoritesScreen />,
      account: <DkdAccountScreen />,
    };
    return dkd_screens[dkd_activeScreen] || dkd_screens.home;
  }, [dkd_activeScreen]);

  return <DkdScreenFrame dkd_activeScreen={dkd_activeScreen} dkd_setActiveScreen={dkd_setActiveScreen}>{dkd_screenContent}</DkdScreenFrame>;
}
