(function dkdAnyelaBornAppScope() {
  "use strict";

  const dkdCreateElement = React.createElement;

  const dkdIconPathsByType = {
    menu: [
      "M4 7h16",
      "M4 12h16",
      "M4 17h16"
    ],
    palm: [
      "M12 22c1.4-6.1.4-11.7 0-17.6",
      "M12 5.1C9.9 2.8 7.3 2.1 5 3.1c2.5 1.2 4.5 2.7 7 5.1",
      "M12 5.1c2.1-2.3 4.8-3 7-2  -2.5 1.2-4.5 2.7-7 5.1",
      "M12 8.2C8.9 6.8 6.1 7 3.6 9.2c3-.1 5.5.5 8.4 2.3",
      "M12 8.2c3.1-1.4 5.9-1.2 8.4 1-3-.1-5.5.5-8.4 2.3"
    ],
    play: [
      "M8 5v14l11-7z"
    ],
    bag: [
      "M6.5 8.2h11l1 12.1h-13z",
      "M9 8.2V6a3 3 0 0 1 6 0v2.2"
    ],
    card: [
      "M3.6 6.5h16.8v11H3.6z",
      "M3.6 10h16.8",
      "M7 14.7h4.3"
    ],
    upload: [
      "M12 16V5",
      "M7.5 9.5 12 5l4.5 4.5",
      "M5 18.8h14"
    ],
    door: [
      "M7 21V4.5L17 3v18",
      "M10.8 12h.1",
      "M17 21h3"
    ],
    crown: [
      "M4 8.4 8.4 12 12 6.2 15.6 12 20 8.4l-1.3 8.8H5.3z",
      "M6.7 20h10.6"
    ],
    chat: [
      "M4.5 6.2h15v9.5h-9.2L6.2 19v-3.3H4.5z",
      "M8 10h8",
      "M8 13h5"
    ],
    mic: [
      "M12 14.4a3 3 0 0 0 3-3V6.8a3 3 0 0 0-6 0v4.6a3 3 0 0 0 3 3z",
      "M5.8 11.5a6.2 6.2 0 0 0 12.4 0",
      "M12 17.8V21",
      "M8.5 21h7"
    ],
    image: [
      "M4 5h16v14H4z",
      "M7.5 14.5l3.1-3.2 2.3 2.4 2-2.1 3.6 3.9",
      "M8.4 9.2h.1"
    ],
    megaphone: [
      "M4 13V9h3.8L17.5 5v12l-9.7-4z",
      "M7.8 13 9.5 19H6.7L5.2 13",
      "M19 9.1c1.1.8 1.1 4 0 4.8"
    ],
    shield: [
      "M12 3.3 19 6v5.4c0 4.4-2.8 7.8-7 9.3-4.2-1.5-7-4.9-7-9.3V6z",
      "M9.2 12.2 11 14l3.8-4"
    ],
    lock: [
      "M7 11h10v8H7z",
      "M9 11V8.4a3 3 0 0 1 6 0V11"
    ],
    cloud: [
      "M7 17.5h10.8a3.2 3.2 0 0 0 .5-6.4A5.1 5.1 0 0 0 8.4 9.7 3.9 3.9 0 0 0 7 17.5z",
      "M12 16V9.8",
      "M9.6 12.2 12 9.8l2.4 2.4"
    ],
    check: [
      "M5 12.4 9.4 16.8 19 7.2"
    ],
    home: [
      "M3.8 11.4 12 4.5l8.2 6.9",
      "M6.2 10.8V20h11.6v-9.2",
      "M10 20v-5h4v5"
    ],
    gift: [
      "M4.5 10h15v10h-15z",
      "M3.8 7h16.4v3H3.8z",
      "M12 7v13",
      "M9 7c-2.4 0-3.2-3.3-.8-3.3C10 3.7 12 7 12 7",
      "M15 7c2.4 0 3.2-3.3.8-3.3C14 3.7 12 7 12 7"
    ],
    user: [
      "M12 12.4a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2z",
      "M4.5 21a7.5 7.5 0 0 1 15 0"
    ],
    star: [
      "M12 3.8 14.4 9l5.6.6-4.1 3.8 1.1 5.5-5-2.8-5 2.8 1.1-5.5L4 9.6 9.6 9z"
    ],
    arrow: [
      "M9 5.5 15.5 12 9 18.5"
    ],
    heart: [
      "M12 20s-7.2-4.7-8.8-9.3C2.2 7.7 4.3 5 7.2 5c1.7 0 3.1.9 4 2.1C12.1 5.9 13.5 5 15.2 5c2.9 0 5 2.7 4 5.7C19.2 15.3 12 20 12 20z"
    ]
  };

  function DkdIcon(dkdIconProps) {
    const dkdIconType = dkdIconProps.dkdType || "star";
    const dkdIconClassName = dkdIconProps.dkdClassName || "dkd-anyela-icon";
    const dkdIconPaths = dkdIconPathsByType[dkdIconType] || dkdIconPathsByType.star;
    return dkdCreateElement(
      "svg",
      {
        className: dkdIconClassName,
        viewBox: "0 0 24 24",
        role: "img",
        "aria-hidden": "true",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.9",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      dkdIconPaths.map(function dkdRenderIconPath(dkdPathData, dkdPathIndex) {
        return dkdCreateElement("path", { d: dkdPathData, key: dkdIconType + "-path-" + dkdPathIndex });
      })
    );
  }

  const dkdWorkflowItems = [
    { dkdStep: "1.", dkdTitle: "Paket Seç", dkdText: "İhtiyacına uygun paketi seç.", dkdIcon: "bag", dkdTone: "pink" },
    { dkdStep: "2.", dkdTitle: "Ödemeyi Yap", dkdText: "IBAN ile ödemeni gerçekleştir.", dkdIcon: "card", dkdTone: "aqua" },
    { dkdStep: "3.", dkdTitle: "Dekontu Yükle", dkdText: "Ödeme dekontunu sisteme yükle.", dkdIcon: "upload", dkdTone: "violet" },
    { dkdStep: "4.", dkdTitle: "Özel Odan Açılır", dkdText: "Onay sonrası özel odan aktif olur.", dkdIcon: "door", dkdTone: "orange" }
  ];

  const dkdPackageItems = [
    { dkdName: "Anyela Intro", dkdText: "Kısa tanıtım deneyimi", dkdPrice: "149 TL", dkdIcon: "crown", dkdTone: "pink" },
    { dkdName: "Private Chat", dkdText: "30 dk özel sohbet", dkdPrice: "499 TL", dkdIcon: "chat", dkdTone: "aqua" },
    { dkdName: "Voice Intro", dkdText: "Kişiye özel sesli mesaj", dkdPrice: "249 TL", dkdIcon: "mic", dkdTone: "violet" },
    { dkdName: "Photo Set", dkdText: "5 özel fotoğraf", dkdPrice: "1.499 TL", dkdIcon: "image", dkdTone: "orange" }
  ];

  const dkdServiceItems = [
    { dkdName: "Sesli Mesaj", dkdText: "Kişiye özel ses kaydı siparişi ver.", dkdIcon: "mic", dkdTone: "pink" },
    { dkdName: "Özel Görsel / Video", dkdText: "Sana özel içerikler hazırlanır.", dkdIcon: "image", dkdTone: "aqua" },
    { dkdName: "İşletme Reklam Paketi", dkdText: "Markan için özel tanıtım fırsatları.", dkdIcon: "megaphone", dkdTone: "violet" }
  ];

  const dkdRuleItems = [
    { dkdTitle: "18+ kullanıcılar içindir", dkdText: "Yalnızca yetişkinlere açıktır." },
    { dkdTitle: "Uygunsuz içerik yasaktır", dkdText: "Saygılı ve kurallara uygun kullanım beklenir." },
    { dkdTitle: "Veri silme talebi yapılabilir", dkdText: "Kişisel verilerin silinmesi talep edilebilir." }
  ];

  const dkdBottomNavigationItems = [
    { dkdName: "Ana Sayfa", dkdIcon: "home", dkdActive: true },
    { dkdName: "Paketler", dkdIcon: "gift", dkdActive: false },
    { dkdName: "Sohbet", dkdIcon: "chat", dkdActive: false },
    { dkdName: "Profil", dkdIcon: "user", dkdActive: false }
  ];

  function DkdTopHeader() {
    return dkdCreateElement(
      "header",
      { className: "dkd-anyela-header" },
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-logo-area", "aria-label": "Anyela Born Club" },
        dkdCreateElement("span", { className: "dkd-anyela-logo-mark" }, dkdCreateElement(DkdIcon, { dkdType: "palm" })),
        dkdCreateElement(
          "span",
          { className: "dkd-anyela-logo-text" },
          dkdCreateElement("span", { className: "dkd-anyela-logo-script" }, "Anyela"),
          dkdCreateElement("span", { className: "dkd-anyela-logo-subtitle" }, "BORN CLUB")
        )
      ),
      dkdCreateElement("button", { className: "dkd-anyela-menu-button", type: "button", "aria-label": "Menüyü aç" }, dkdCreateElement(DkdIcon, { dkdType: "menu" }))
    );
  }

  function DkdHeroSection() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-hero-card", "aria-labelledby": "dkd-anyela-hero-title" },
      dkdCreateElement("div", { className: "dkd-anyela-hero-sky" }),
      dkdCreateElement("div", { className: "dkd-anyela-hero-palm dkd-anyela-hero-palm-left" }),
      dkdCreateElement("div", { className: "dkd-anyela-hero-palm dkd-anyela-hero-palm-right" }),
      dkdCreateElement("div", { className: "dkd-anyela-hero-skyline" }),
      dkdCreateElement("div", { className: "dkd-anyela-hero-water" }),
      dkdCreateElement("div", { className: "dkd-anyela-neon-ring" }),
      dkdCreateElement("div", { className: "dkd-anyela-silhouette", "aria-hidden": "true" }, dkdCreateElement("span", { className: "dkd-anyela-hair" }), dkdCreateElement("span", { className: "dkd-anyela-body" })),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-hero-content" },
        dkdCreateElement("h1", { id: "dkd-anyela-hero-title" }, "Anyela ile", dkdCreateElement("br"), "Özel Deneyime", dkdCreateElement("span", null, "Hoş Geldin")),
        dkdCreateElement("p", null, "Sohbet et, sesli mesaj al, özel görsel/video siparişi ver."),
        dkdCreateElement("a", { className: "dkd-anyela-primary-button", href: "#dkd-anyela-packages" }, "Paketleri İncele", dkdCreateElement(DkdIcon, { dkdType: "arrow" }))
      ),
      dkdCreateElement("div", { className: "dkd-anyela-hero-signature" }, "Anyela", dkdCreateElement(DkdIcon, { dkdType: "heart" }))
    );
  }

  function DkdVideoPreview() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-video-card", "aria-label": "Anyela tanıtım videosu" },
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-video-thumb" },
        dkdCreateElement("div", { className: "dkd-anyela-video-play" }, dkdCreateElement(DkdIcon, { dkdType: "play" }))
      ),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-video-copy" },
        dkdCreateElement("h2", null, "Anyela Tanıtım Videosu"),
        dkdCreateElement("p", null, "Kısa tanıtımı izle")
      ),
      dkdCreateElement("button", { className: "dkd-anyela-video-action", type: "button", "aria-label": "Videoyu oynat" }, dkdCreateElement(DkdIcon, { dkdType: "play" }))
    );
  }

  function DkdSectionTitle(dkdSectionTitleProps) {
    return dkdCreateElement(
      "div",
      { className: "dkd-anyela-section-title" },
      dkdCreateElement("span", { className: "dkd-anyela-title-deco" }, dkdSectionTitleProps.dkdLeftIcon || "🌴"),
      dkdCreateElement("h2", null, dkdSectionTitleProps.dkdTitle),
      dkdCreateElement("span", { className: "dkd-anyela-title-deco" }, dkdSectionTitleProps.dkdRightIcon || "🌴")
    );
  }

  function DkdWorkflowSection() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-section dkd-anyela-workflow-section" },
      dkdCreateElement(DkdSectionTitle, { dkdTitle: "Nasıl Çalışır?" }),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-workflow-grid" },
        dkdWorkflowItems.map(function dkdRenderWorkflowItem(dkdWorkflowItem) {
          return dkdCreateElement(
            "article",
            { className: "dkd-anyela-workflow-card", key: dkdWorkflowItem.dkdTitle },
            dkdCreateElement("div", { className: "dkd-anyela-icon-bubble dkd-tone-" + dkdWorkflowItem.dkdTone }, dkdCreateElement(DkdIcon, { dkdType: dkdWorkflowItem.dkdIcon })),
            dkdCreateElement(
              "div",
              { className: "dkd-anyela-workflow-copy" },
              dkdCreateElement("h3", null, dkdWorkflowItem.dkdStep + " " + dkdWorkflowItem.dkdTitle),
              dkdCreateElement("p", null, dkdWorkflowItem.dkdText)
            )
          );
        })
      )
    );
  }

  function DkdPackagesSection() {
    return dkdCreateElement(
      "section",
      { id: "dkd-anyela-packages", className: "dkd-anyela-section dkd-anyela-packages-section" },
      dkdCreateElement(DkdSectionTitle, { dkdTitle: "Popüler Paketler", dkdLeftIcon: "🔥", dkdRightIcon: "" }),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-package-row" },
        dkdPackageItems.map(function dkdRenderPackageItem(dkdPackageItem) {
          return dkdCreateElement(
            "article",
            { className: "dkd-anyela-package-card dkd-package-" + dkdPackageItem.dkdTone, key: dkdPackageItem.dkdName },
            dkdCreateElement("div", { className: "dkd-anyela-icon-bubble dkd-tone-" + dkdPackageItem.dkdTone }, dkdCreateElement(DkdIcon, { dkdType: dkdPackageItem.dkdIcon })),
            dkdCreateElement("h3", null, dkdPackageItem.dkdName),
            dkdCreateElement("p", null, dkdPackageItem.dkdText),
            dkdCreateElement("strong", null, dkdPackageItem.dkdPrice),
            dkdCreateElement("button", { className: "dkd-anyela-select-button dkd-tone-" + dkdPackageItem.dkdTone, type: "button" }, "Seç")
          );
        })
      )
    );
  }

  function DkdServicesSection() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-section dkd-anyela-services-section" },
      dkdCreateElement(DkdSectionTitle, { dkdTitle: "Özel Hizmetler", dkdLeftIcon: "☆", dkdRightIcon: "" }),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-service-grid" },
        dkdServiceItems.map(function dkdRenderServiceItem(dkdServiceItem) {
          return dkdCreateElement(
            "article",
            { className: "dkd-anyela-service-card dkd-service-" + dkdServiceItem.dkdTone, key: dkdServiceItem.dkdName },
            dkdCreateElement("div", { className: "dkd-anyela-icon-bubble dkd-tone-" + dkdServiceItem.dkdTone }, dkdCreateElement(DkdIcon, { dkdType: dkdServiceItem.dkdIcon })),
            dkdCreateElement(
              "div",
              { className: "dkd-anyela-service-copy" },
              dkdCreateElement("h3", null, dkdServiceItem.dkdName),
              dkdCreateElement("p", null, dkdServiceItem.dkdText)
            ),
            dkdCreateElement(DkdIcon, { dkdType: "arrow", dkdClassName: "dkd-anyela-service-arrow" })
          );
        })
      )
    );
  }

  function DkdPaymentSection() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-payment-card", "aria-label": "IBAN ile ödeme" },
      dkdCreateElement("div", { className: "dkd-anyela-payment-shield" }, dkdCreateElement(DkdIcon, { dkdType: "lock" })),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-payment-copy" },
        dkdCreateElement("h2", null, "IBAN ile Ödeme"),
        dkdCreateElement("p", null, "Güvenli ödeme için IBAN bilgimize ödeme yapın. Dekontu yükleyerek işleminizi tamamlayın.")
      ),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-payment-action" },
        dkdCreateElement("button", { type: "button" }, dkdCreateElement(DkdIcon, { dkdType: "cloud" }), "Dekont Yükle"),
        dkdCreateElement("span", null, dkdCreateElement(DkdIcon, { dkdType: "lock" }), "256-bit SSL ile korunur")
      )
    );
  }

  function DkdRulesSection() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-rules-section", "aria-label": "Güvenli kullanım ve kurallar" },
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-rules-title" },
        dkdCreateElement(DkdIcon, { dkdType: "shield" }),
        dkdCreateElement("h2", null, "Güvenli Kullanım / Kurallar")
      ),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-rule-list" },
        dkdRuleItems.map(function dkdRenderRuleItem(dkdRuleItem) {
          return dkdCreateElement(
            "article",
            { className: "dkd-anyela-rule-item", key: dkdRuleItem.dkdTitle },
            dkdCreateElement("span", { className: "dkd-anyela-rule-check" }, dkdCreateElement(DkdIcon, { dkdType: "check" })),
            dkdCreateElement(
              "div",
              null,
              dkdCreateElement("h3", null, dkdRuleItem.dkdTitle),
              dkdCreateElement("p", null, dkdRuleItem.dkdText)
            )
          );
        })
      )
    );
  }

  function DkdFinalCallToAction() {
    return dkdCreateElement(
      "section",
      { className: "dkd-anyela-final-cta", "aria-label": "Özel odanı aç" },
      dkdCreateElement("div", null, dkdCreateElement("h2", null, "Hazırsan başlayalım."), dkdCreateElement("p", null, "Anyela seni bekliyor.")),
      dkdCreateElement("button", { type: "button", className: "dkd-anyela-room-button" }, dkdCreateElement(DkdIcon, { dkdType: "door" }), "Özel Odanı Aç")
    );
  }

  function DkdBottomNavigation() {
    return dkdCreateElement(
      "nav",
      { className: "dkd-anyela-bottom-nav", "aria-label": "Anyela Born Club alt menü" },
      dkdBottomNavigationItems.map(function dkdRenderNavigationItem(dkdNavigationItem) {
        return dkdCreateElement(
          "button",
          {
            className: "dkd-anyela-nav-item" + (dkdNavigationItem.dkdActive ? " dkd-active" : ""),
            type: "button",
            key: dkdNavigationItem.dkdName
          },
          dkdCreateElement(DkdIcon, { dkdType: dkdNavigationItem.dkdIcon }),
          dkdCreateElement("span", null, dkdNavigationItem.dkdName)
        );
      })
    );
  }

  function DkdAnyelaBornPage() {
    return dkdCreateElement(
      "div",
      { className: "dkd-anyela-page" },
      dkdCreateElement("div", { className: "dkd-anyela-page-glow dkd-anyela-page-glow-one" }),
      dkdCreateElement("div", { className: "dkd-anyela-page-glow dkd-anyela-page-glow-two" }),
      dkdCreateElement(
        "div",
        { className: "dkd-anyela-phone-shell" },
        dkdCreateElement(DkdTopHeader, null),
        dkdCreateElement(
          "div",
          { className: "dkd-anyela-scroll-area" },
          dkdCreateElement(DkdHeroSection, null),
          dkdCreateElement(DkdVideoPreview, null),
          dkdCreateElement(DkdWorkflowSection, null),
          dkdCreateElement(DkdPackagesSection, null),
          dkdCreateElement(DkdServicesSection, null),
          dkdCreateElement(DkdPaymentSection, null),
          dkdCreateElement(DkdRulesSection, null),
          dkdCreateElement(DkdFinalCallToAction, null)
        ),
        dkdCreateElement(DkdBottomNavigation, null)
      )
    );
  }

  const dkdRootElement = document.getElementById("dkd-anyela-born-root");
  ReactDOM.createRoot(dkdRootElement).render(dkdCreateElement(DkdAnyelaBornPage));
})();
