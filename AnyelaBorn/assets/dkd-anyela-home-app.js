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
  Medal,
  UsersThree,
  Lightning,
  CheckCircle,
  DiamondsFour,
} from "https://esm.sh/@phosphor-icons/react@2.1.7?deps=react@18.2.0";

const dkd_h = React.createElement;

const dkd_asset = (dkd_file_name) => `./assets/${dkd_file_name}`;

const dkd_trust_items = [
  {
    dkd_title: "AI Karakter",
    dkd_text: "Gerçekçi & Akıllı",
    dkd_icon: Robot,
    dkd_tone: "violet",
  },
  {
    dkd_title: "18+",
    dkd_text: "Yetişkinlere Özel",
    dkd_icon: ShieldCheck,
    dkd_tone: "rose",
  },
  {
    dkd_title: "Manuel Onay",
    dkd_text: "Güvenli Süreç",
    dkd_icon: CheckCircle,
    dkd_tone: "emerald",
  },
  {
    dkd_title: "Gizli İçerik",
    dkd_text: "%100 Gizlilik",
    dkd_icon: LockKey,
    dkd_tone: "cyan",
  },
];

const dkd_steps = [
  {
    dkd_number: "1",
    dkd_title: "Paket seç",
    dkd_text: "Sana uygun paketi seç.",
    dkd_icon: Package,
    dkd_tone: "violet",
  },
  {
    dkd_number: "2",
    dkd_title: "Ödeme yap",
    dkd_text: "Güvenli ödeme yöntemiyle öde.",
    dkd_icon: CreditCard,
    dkd_tone: "blue",
  },
  {
    dkd_number: "3",
    dkd_title: "Dekont gönder",
    dkd_text: "Ödeme dekontunu gönder.",
    dkd_icon: Receipt,
    dkd_tone: "teal",
  },
  {
    dkd_number: "4",
    dkd_title: "Deneyimi başlat",
    dkd_text: "Onay sonrası hemen başla.",
    dkd_icon: RocketLaunch,
    dkd_tone: "coral",
  },
];

const dkd_services = [
  {
    dkd_title: "Yazılı Sohbet",
    dkd_text: "Kişiye özel yazılı sohbet deneyimi.",
    dkd_icon: ChatCircleDots,
    dkd_tone: "violet",
    dkd_href: "./chat/",
  },
  {
    dkd_title: "Sesli Mesaj",
    dkd_text: "Anyela’dan size özel sesli mesajlar.",
    dkd_icon: Waveform,
    dkd_tone: "cyan",
    dkd_href: "./voice/",
  },
  {
    dkd_title: "Özel İçerik",
    dkd_text: "Size özel görsel ve video içerikler.",
    dkd_icon: Images,
    dkd_tone: "rose",
    dkd_href: "./custom/",
  },
  {
    dkd_title: "Marka Reklamı",
    dkd_text: "Özel marka tanıtım ve iş birlikleri.",
    dkd_icon: Crown,
    dkd_tone: "gold",
    dkd_href: "./ads/",
  },
];

const dkd_nav_items = [
  { dkd_title: "Ana Sayfa", dkd_icon: House, dkd_href: "./", dkd_active: true },
  { dkd_title: "Sohbet", dkd_icon: ChatsCircle, dkd_href: "./chat/" },
  { dkd_title: "Paketler", dkd_icon: Cube, dkd_href: "./packages/" },
  { dkd_title: "Reklam", dkd_icon: Megaphone, dkd_href: "./ads/" },
  { dkd_title: "Profil", dkd_icon: UserCircle, dkd_href: "./faq/" },
];

function DkdIconShell({ dkd_icon: DkdIcon, dkd_tone = "violet", dkd_size = 34 }) {
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
        { className: "dkd-brand-mark" },
        dkd_h("span", { className: "dkd-brand-crown" }, "♛"),
        "AB"
      ),
      dkd_h("span", { className: "dkd-brand-name" }, "Anyela Born Club")
    ),
    dkd_h(
      "nav",
      { className: "dkd-top-actions", "aria-label": "Ana işlemler" },
      dkd_h(
        "a",
        { className: "dkd-menu-button", href: "./packages/", "aria-label": "Menüyü aç" },
        dkd_h(List, { size: 30, weight: "bold" })
      ),
      dkd_h("a", { className: "dkd-start-button", href: "./payment/" }, "Başla")
    )
  );
}

function DkdHero() {
  return dkd_h(
    "section",
    { className: "dkd-hero-card", "aria-labelledby": "dkd_home_title" },
    dkd_h("div", { className: "dkd-hero-bg-orbit dkd-orbit-one" }),
    dkd_h("div", { className: "dkd-hero-bg-orbit dkd-orbit-two" }),
    dkd_h(
      "div",
      { className: "dkd-hero-copy" },
      dkd_h(
        "span",
        { className: "dkd-hero-badge" },
        dkd_h(Sparkle, { size: 16, weight: "fill" }),
        "AI ile gerçek bağ"
      ),
      dkd_h(
        "h1",
        { id: "dkd_home_title" },
        "Anyela Born ile ",
        dkd_h("span", null, "özel AI karakter"),
        " deneyimi"
      ),
      dkd_h(
        "p",
        { className: "dkd-hero-description" },
        "Kişiye özel sohbet, sesli mesaj, özel görsel/video içerikler ve marka reklam iş birlikleri."
      ),
      dkd_h(
        "div",
        { className: "dkd-hero-buttons" },
        dkd_h(
          "a",
          { href: "./chat/", className: "dkd-primary-cta" },
          dkd_h(ChatCircleDots, { size: 22, weight: "fill" }),
          "Sohbete Başla"
        ),
        dkd_h(
          "a",
          { href: "./packages/", className: "dkd-secondary-cta" },
          dkd_h(Gift, { size: 22, weight: "fill" }),
          "Paketleri Gör"
        )
      )
    ),
    dkd_h(
      "div",
      { className: "dkd-hero-person" },
      dkd_h("img", {
        src: dkd_asset("dkd-anyela-hero.webp"),
        alt: "Anyela Born AI karakter görseli",
        className: "dkd-hero-image",
      }),
      dkd_h(
        "div",
        { className: "dkd-premium-chip" },
        dkd_h(ShieldCheck, { size: 26, weight: "duotone" }),
        dkd_h("strong", null, "Premium AI"),
        dkd_h("span", null, "Sadece Sizin İçin")
      )
    )
  );
}

function DkdTrustStrip() {
  return dkd_h(
    "section",
    { className: "dkd-trust-strip", "aria-label": "Güven ve platform bilgileri" },
    dkd_trust_items.map((dkd_item) => {
      const DkdIcon = dkd_item.dkd_icon;
      return dkd_h(
        "article",
        { className: "dkd-trust-item", key: dkd_item.dkd_title },
        dkd_h(DkdIconShell, { dkd_icon: DkdIcon, dkd_tone: dkd_item.dkd_tone, dkd_size: 31 }),
        dkd_h("div", null, dkd_h("strong", null, dkd_item.dkd_title), dkd_h("span", null, dkd_item.dkd_text))
      );
    })
  );
}

function DkdHowItWorks() {
  return dkd_h(
    "section",
    { className: "dkd-panel dkd-how-panel", "aria-labelledby": "dkd_how_title" },
    dkd_h(
      "div",
      { className: "dkd-section-header" },
      dkd_h("h2", { id: "dkd_how_title" }, "Nasıl Çalışır?"),
      dkd_h("span", { className: "dkd-speed-pill" }, dkd_h(Lightning, { size: 15, weight: "fill" }), "Kolay & Hızlı")
    ),
    dkd_h(
      "div",
      { className: "dkd-step-grid" },
      dkd_steps.map((dkd_step) => {
        const DkdIcon = dkd_step.dkd_icon;
        return dkd_h(
          "article",
          { className: `dkd-step-card dkd-tone-${dkd_step.dkd_tone}`, key: dkd_step.dkd_title },
          dkd_h("span", { className: "dkd-step-number" }, dkd_step.dkd_number),
          dkd_h(DkdIcon, { size: 39, weight: "duotone" }),
          dkd_h("strong", null, dkd_step.dkd_title),
          dkd_h("p", null, dkd_step.dkd_text)
        );
      })
    )
  );
}

function DkdServices() {
  return dkd_h(
    "section",
    { className: "dkd-panel dkd-services-panel", "aria-labelledby": "dkd_services_title" },
    dkd_h(
      "div",
      { className: "dkd-section-header" },
      dkd_h("h2", { id: "dkd_services_title" }, "Hizmetlerimiz"),
      dkd_h("a", { href: "./packages/", className: "dkd-view-all" }, "Tümünü Gör", " ›")
    ),
    dkd_h(
      "div",
      { className: "dkd-service-grid" },
      dkd_services.map((dkd_service) => {
        const DkdIcon = dkd_service.dkd_icon;
        return dkd_h(
          "a",
          { href: dkd_service.dkd_href, className: `dkd-service-card dkd-tone-${dkd_service.dkd_tone}`, key: dkd_service.dkd_title },
          dkd_h(DkdIcon, { size: 46, weight: "duotone" }),
          dkd_h("strong", null, dkd_service.dkd_title),
          dkd_h("span", null, dkd_service.dkd_text)
        );
      })
    )
  );
}

function DkdPremiumFeature() {
  return dkd_h(
    "section",
    { className: "dkd-premium-card", "aria-labelledby": "dkd_premium_title" },
    dkd_h(
      "div",
      { className: "dkd-premium-image-wrap" },
      dkd_h("img", {
        src: dkd_asset("dkd-anyela-premium.webp"),
        alt: "Anyela Born özel deneyim görseli",
        className: "dkd-premium-image",
      }),
      dkd_h("span", { className: "dkd-crown-badge" }, dkd_h(Crown, { size: 31, weight: "fill" }))
    ),
    dkd_h(
      "div",
      { className: "dkd-premium-copy" },
      dkd_h("span", { className: "dkd-premium-label" }, dkd_h(DiamondsFour, { size: 16, weight: "fill" }), "Anyela Born Premium"),
      dkd_h("h2", { id: "dkd_premium_title" }, "Sadece sana özel.", dkd_h("span", null, " Sadece burada.")),
      dkd_h("p", null, "“Benimle kurduğun bu bağ, sana özel. Gerçek ilgi, gerçek his, gerçek Anyela.”"),
      dkd_h(
        "div",
        { className: "dkd-member-row" },
        dkd_h(
          "div",
          { className: "dkd-avatar-stack", "aria-hidden": "true" },
          ["avatar1", "avatar2", "avatar3"].map((dkd_avatar) =>
            dkd_h("img", { key: dkd_avatar, src: dkd_asset(`dkd-anyela-${dkd_avatar}.webp`), alt: "" })
          )
        ),
        dkd_h("span", null, dkd_h("strong", null, "10.000+"), " mutlu üye güveniyor.")
      )
    ),
    dkd_h("div", { className: "dkd-signature" }, "Anyela♡")
  );
}

function DkdBottomNav() {
  return dkd_h(
    "nav",
    { className: "dkd-bottom-nav", "aria-label": "Mobil hızlı menü" },
    dkd_nav_items.map((dkd_nav) => {
      const DkdIcon = dkd_nav.dkd_icon;
      return dkd_h(
        "a",
        {
          href: dkd_nav.dkd_href,
          className: dkd_nav.dkd_active ? "dkd-nav-item dkd-active" : "dkd-nav-item",
          key: dkd_nav.dkd_title,
        },
        dkd_h(DkdIcon, { size: 25, weight: dkd_nav.dkd_active ? "fill" : "regular" }),
        dkd_h("span", null, dkd_nav.dkd_title)
      );
    })
  );
}

function DkdHomePage() {
  return dkd_h(
    React.Fragment,
    null,
    dkd_h("div", { className: "dkd-page-glow dkd-glow-a" }),
    dkd_h("div", { className: "dkd-page-glow dkd-glow-b" }),
    dkd_h(
      "main",
      { className: "dkd-mobile-shell" },
      dkd_h(DkdHeader),
      dkd_h(DkdHero),
      dkd_h(DkdTrustStrip),
      dkd_h(DkdHowItWorks),
      dkd_h(DkdServices),
      dkd_h(DkdPremiumFeature),
      dkd_h("div", { className: "dkd-bottom-safe-space" })
    ),
    dkd_h(DkdBottomNav)
  );
}

const dkd_root = createRoot(document.getElementById("dkd_anyela_root"));
dkd_root.render(dkd_h(DkdHomePage));
