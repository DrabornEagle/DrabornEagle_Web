import React from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
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
  Medal,
  UsersThree,
  Star,
  DiamondsFour,
  ShieldStar,
} from "https://esm.sh/@phosphor-icons/react@2.1.7?deps=react@18.2.0";

const dkd_h = React.createElement;
const dkd_asset = (dkd_file_name) => `./assets/${dkd_file_name}`;

const dkd_trust_items = [
  { dkd_title: "AI Karakter", dkd_text: "Gerçekçi & Akıllı", dkd_icon: Robot, dkd_tone: "violet" },
  { dkd_title: "18+", dkd_text: "Yetişkinlere Özel", dkd_icon: ShieldCheck, dkd_tone: "rose" },
  { dkd_title: "Manuel Onay", dkd_text: "Güvenli Süreç", dkd_icon: CheckCircle, dkd_tone: "emerald" },
  { dkd_title: "Gizli İçerik", dkd_text: "%100 Gizlilik", dkd_icon: LockKey, dkd_tone: "cyan" },
];

const dkd_steps = [
  { dkd_number: "1", dkd_title: "Paket seç", dkd_text: "Sana uygun paketi seç.", dkd_icon: Package, dkd_tone: "violet" },
  { dkd_number: "2", dkd_title: "Ödeme yap", dkd_text: "Güvenli ödeme yöntemiyle öde.", dkd_icon: CreditCard, dkd_tone: "blue" },
  { dkd_number: "3", dkd_title: "Dekont gönder", dkd_text: "Ödeme dekontunu gönder.", dkd_icon: Receipt, dkd_tone: "teal" },
  { dkd_number: "4", dkd_title: "Deneyimi başlat", dkd_text: "Onay sonrası hemen başla.", dkd_icon: RocketLaunch, dkd_tone: "coral" },
];

const dkd_services = [
  { dkd_title: "Yazılı Sohbet", dkd_text: "Kişiye özel yazılı sohbet deneyimi.", dkd_icon: ChatCircleDots, dkd_tone: "violet", dkd_href: "./chat/" },
  { dkd_title: "Sesli Mesaj", dkd_text: "Anyela’dan size özel sesli mesajlar.", dkd_icon: Waveform, dkd_tone: "cyan", dkd_href: "./voice/" },
  { dkd_title: "Özel İçerik", dkd_text: "Size özel görsel ve video içerikler.", dkd_icon: Images, dkd_tone: "rose", dkd_href: "./custom/" },
  { dkd_title: "Marka Reklamı", dkd_text: "Özel marka tanıtım ve iş birlikleri.", dkd_icon: Crown, dkd_tone: "gold", dkd_href: "./ads/" },
];

const dkd_nav_items = [
  { dkd_title: "Ana Sayfa", dkd_icon: House, dkd_href: "./", dkd_active: true },
  { dkd_title: "Sohbet", dkd_icon: ChatsCircle, dkd_href: "./chat/" },
  { dkd_title: "Paketler", dkd_icon: Cube, dkd_href: "./packages/" },
  { dkd_title: "Reklam", dkd_icon: Megaphone, dkd_href: "./ads/" },
  { dkd_title: "Profil", dkd_icon: UserCircle, dkd_href: "./faq/" },
];

function DkdIconShell({ dkd_icon: DkdIcon, dkd_tone = "violet", dkd_size = 42 }) {
  return dkd_h(
    "span",
    { className: `dkd-icon-shell dkd-tone-${dkd_tone}`, "aria-hidden": "true" },
    dkd_h(DkdIcon, { size: dkd_size, weight: "duotone" })
  );
}

function DkdHeader() {
  return dkd_h(
    "header",
    { className: "dkd-header" },
    dkd_h(
      "a",
      { className: "dkd-brand", href: "./", "aria-label": "Anyela Born Club ana sayfa" },
      dkd_h(
        "span",
        { className: "dkd-brand-mark", "aria-hidden": "true" },
        dkd_h("span", { className: "dkd-brand-crown" }, dkd_h(Crown, { size: 28, weight: "fill" })),
        dkd_h("span", { className: "dkd-brand-ab" }, "AB")
      ),
      dkd_h("span", { className: "dkd-brand-name" }, "Anyela Born Club")
    ),
    dkd_h(
      "nav",
      { className: "dkd-top-actions", "aria-label": "Ana işlemler" },
      dkd_h("a", { className: "dkd-menu-button", href: "./packages/", "aria-label": "Menüyü aç" }, dkd_h(List, { size: 36, weight: "bold" })),
      dkd_h("a", { className: "dkd-start-button", href: "./payment/" }, "Başla")
    )
  );
}

function DkdHero() {
  return dkd_h(
    "section",
    { className: "dkd-hero-card", "aria-labelledby": "dkd_home_title" },
    dkd_h("div", { className: "dkd-hero-light dkd-light-a" }),
    dkd_h("div", { className: "dkd-hero-light dkd-light-b" }),
    dkd_h("div", { className: "dkd-hero-orbit dkd-orbit-one" }),
    dkd_h("div", { className: "dkd-hero-orbit dkd-orbit-two" }),
    dkd_h(
      "div",
      { className: "dkd-hero-copy" },
      dkd_h("span", { className: "dkd-hero-badge" }, dkd_h(Sparkle, { size: 19, weight: "fill" }), "AI ile gerçek bağ"),
      dkd_h("h1", { id: "dkd_home_title" }, "Anyela Born ile ", dkd_h("span", null, "özel AI karakter"), " deneyimi"),
      dkd_h("p", { className: "dkd-hero-description" }, "Kişiye özel sohbet, sesli mesaj, özel görsel/video içerikler ve marka reklam iş birlikleri."),
      dkd_h(
        "div",
        { className: "dkd-hero-buttons" },
        dkd_h("a", { href: "./chat/", className: "dkd-primary-cta" }, dkd_h(ChatCircleDots, { size: 28, weight: "fill" }), "Sohbete Başla"),
        dkd_h("a", { href: "./packages/", className: "dkd-secondary-cta" }, dkd_h(Gift, { size: 28, weight: "fill" }), "Paketleri Gör")
      )
    ),
    dkd_h(
      "div",
      { className: "dkd-hero-person" },
      dkd_h("div", { className: "dkd-portrait-halo" }),
      dkd_h("img", { src: dkd_asset("dkd-anyela-v16-hero.webp"), alt: "Anyela Born AI karakter görseli", className: "dkd-hero-image" }),
      dkd_h(
        "div",
        { className: "dkd-premium-chip" },
        dkd_h(ShieldStar, { size: 32, weight: "duotone" }),
        dkd_h("div", null, dkd_h("strong", null, "Premium AI"), dkd_h("span", null, "Sadece Sizin İçin"))
      )
    )
  );
}

function DkdTrustStrip() {
  return dkd_h(
    "section",
    { className: "dkd-trust-strip", "aria-label": "Güven ve platform bilgileri" },
    dkd_trust_items.map((dkd_item) => dkd_h(
      "article",
      { className: "dkd-trust-item", key: dkd_item.dkd_title },
      dkd_h(DkdIconShell, { dkd_icon: dkd_item.dkd_icon, dkd_tone: dkd_item.dkd_tone, dkd_size: 36 }),
      dkd_h("div", null, dkd_h("strong", null, dkd_item.dkd_title), dkd_h("span", null, dkd_item.dkd_text))
    ))
  );
}

function DkdHowItWorks() {
  return dkd_h(
    "section",
    { className: "dkd-panel dkd-how-panel", "aria-labelledby": "dkd_how_title" },
    dkd_h("div", { className: "dkd-section-header" }, dkd_h("h2", { id: "dkd_how_title" }, "Nasıl Çalışır?"), dkd_h("span", { className: "dkd-speed-pill" }, dkd_h(Lightning, { size: 18, weight: "fill" }), "Kolay & Hızlı")),
    dkd_h(
      "div",
      { className: "dkd-step-grid" },
      dkd_steps.map((dkd_step) => dkd_h(
        "article",
        { className: `dkd-step-card dkd-step-${dkd_step.dkd_tone}`, key: dkd_step.dkd_title },
        dkd_h("span", { className: "dkd-step-number" }, dkd_step.dkd_number),
        dkd_h(DkdIconShell, { dkd_icon: dkd_step.dkd_icon, dkd_tone: dkd_step.dkd_tone, dkd_size: 46 }),
        dkd_h("strong", null, dkd_step.dkd_title),
        dkd_h("p", null, dkd_step.dkd_text)
      ))
    )
  );
}

function DkdServices() {
  return dkd_h(
    "section",
    { className: "dkd-panel dkd-services-panel", "aria-labelledby": "dkd_services_title" },
    dkd_h("div", { className: "dkd-section-header" }, dkd_h("h2", { id: "dkd_services_title" }, "Hizmetlerimiz"), dkd_h("a", { href: "./packages/" }, "Tümünü Gör", " ›")),
    dkd_h(
      "div",
      { className: "dkd-service-grid" },
      dkd_services.map((dkd_service) => dkd_h(
        "a",
        { className: `dkd-service-card dkd-service-${dkd_service.dkd_tone}`, href: dkd_service.dkd_href, key: dkd_service.dkd_title },
        dkd_h(DkdIconShell, { dkd_icon: dkd_service.dkd_icon, dkd_tone: dkd_service.dkd_tone, dkd_size: 56 }),
        dkd_h("strong", null, dkd_service.dkd_title),
        dkd_h("p", null, dkd_service.dkd_text)
      ))
    )
  );
}

function DkdPremiumBand() {
  return dkd_h(
    "section",
    { className: "dkd-premium-band", "aria-labelledby": "dkd_premium_title" },
    dkd_h("div", { className: "dkd-premium-image-wrap" }, dkd_h("img", { src: dkd_asset("dkd-anyela-v16-premium.webp"), alt: "Anyela Born premium deneyim görseli" }), dkd_h("span", { className: "dkd-crown-medal" }, dkd_h(Crown, { size: 34, weight: "fill" }))),
    dkd_h(
      "div",
      { className: "dkd-premium-copy" },
      dkd_h("span", { className: "dkd-premium-eyebrow" }, dkd_h(DiamondsFour, { size: 17, weight: "fill" }), "Anyela Born Premium"),
      dkd_h("h2", { id: "dkd_premium_title" }, "Sadece sana özel.", dkd_h("span", null, " Sadece burada.")),
      dkd_h("p", null, "“ Benimle kurduğun bu bağ, sana özel. Gerçek ilgi, gerçek his, gerçek Anyela. ”"),
      dkd_h("div", { className: "dkd-social-proof" },
        dkd_h("div", { className: "dkd-avatar-stack" },
          ["dkd-anyela-v16-avatar1.webp", "dkd-anyela-v16-avatar2.webp", "dkd-anyela-v16-avatar3.webp"].map((dkd_img) => dkd_h("img", { key: dkd_img, src: dkd_asset(dkd_img), alt: "Anyela topluluk görseli" }))
        ),
        dkd_h("strong", null, "10.000+ mutlu üye"),
        dkd_h("span", null, "güveniyor.")
      )
    ),
    dkd_h("div", { className: "dkd-signature" }, "Anyela♡")
  );
}

function DkdBottomNav() {
  return dkd_h(
    "nav",
    { className: "dkd-bottom-nav", "aria-label": "Mobil menü" },
    dkd_nav_items.map((dkd_item) => dkd_h(
      "a",
      { className: dkd_item.dkd_active ? "dkd-bottom-item dkd-active" : "dkd-bottom-item", href: dkd_item.dkd_href, key: dkd_item.dkd_title },
      dkd_h(dkd_item.dkd_icon, { size: 34, weight: dkd_item.dkd_active ? "fill" : "regular" }),
      dkd_h("span", null, dkd_item.dkd_title)
    ))
  );
}

function DkdAnyelaHomePage() {
  return dkd_h(
    React.Fragment,
    null,
    dkd_h("div", { className: "dkd-page-glow dkd-glow-a" }),
    dkd_h("div", { className: "dkd-page-glow dkd-glow-b" }),
    dkd_h("main", { className: "dkd-mobile-shell" },
      dkd_h(DkdHeader),
      dkd_h(DkdHero),
      dkd_h(DkdTrustStrip),
      dkd_h(DkdHowItWorks),
      dkd_h(DkdServices),
      dkd_h(DkdPremiumBand)
    ),
    dkd_h(DkdBottomNav)
  );
}

const dkd_root_element = document.getElementById("dkd_anyela_root");
if (dkd_root_element) {
  createRoot(dkd_root_element).render(dkd_h(DkdAnyelaHomePage));
}
