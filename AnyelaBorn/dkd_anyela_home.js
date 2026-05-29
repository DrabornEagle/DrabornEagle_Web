(function dkdAnyelaHomeScope() {
  "use strict";

  const dkdAnyelaHomeRoot = document.getElementById("dkd_anyela_home_root");
  const dkdAnyelaHomeHotspots = Array.from(document.querySelectorAll(".dkd_anyela_hotspot"));
  const dkdAnyelaHomePasswordInput = document.getElementById("dkd_anyela_home_password");
  const dkdAnyelaHomePasswordToggle = document.getElementById("dkd_anyela_home_password_toggle");
  const dkdAnyelaHomeLoginTabs = Array.from(document.querySelectorAll(".dkd_anyela_home_login_tab"));
  const dkdAnyelaHomeGuestLinks = Array.from(document.querySelectorAll(".dkd_anyela_home_guest_button, .dkd_anyela_hotspot_start"));

  function dkdAnyelaHomeSetLoadedState() {
    if (!dkdAnyelaHomeRoot) {
      return;
    }

    dkdAnyelaHomeRoot.setAttribute("data-dkd-anyela-home-loaded", "true");
  }

  function dkdAnyelaHomeInjectGuestAnimationStyles() {
    if (document.getElementById("dkd_anyela_guest_button_animation_style")) {
      return;
    }

    const dkdAnyelaHomeStyle = document.createElement("style");
    dkdAnyelaHomeStyle.id = "dkd_anyela_guest_button_animation_style";
    dkdAnyelaHomeStyle.textContent = `
      .dkd_anyela_home_guest_button {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        border: 1.8px solid rgba(255, 255, 255, 0.72) !important;
        background:
          linear-gradient(105deg, #18f7ff 0%, #6f5cff 21%, #ff36c7 43%, #ff8a35 64%, #ffe66d 82%, #18f7ff 100%) !important;
        background-size: 260% 100% !important;
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.18),
          0 14px 28px rgba(255, 54, 199, 0.34),
          0 0 24px rgba(24, 247, 255, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.42) !important;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.36);
        transform: translateZ(0);
        animation:
          dkd_anyela_guest_gradient_flow 3.1s linear infinite,
          dkd_anyela_guest_pulse 1.65s ease-in-out infinite;
      }

      .dkd_anyela_home_guest_button::before {
        content: "";
        position: absolute;
        inset: -40% -18%;
        z-index: -1;
        background:
          linear-gradient(115deg, transparent 0 34%, rgba(255, 255, 255, 0.78) 46%, transparent 60% 100%);
        transform: translateX(-76%) rotate(7deg);
        animation: dkd_anyela_guest_shine 2.35s ease-in-out infinite;
      }

      .dkd_anyela_home_guest_button::after {
        content: "";
        position: absolute;
        inset: 3px;
        z-index: -2;
        border-radius: inherit;
        background:
          radial-gradient(circle at 18% 28%, rgba(255, 255, 255, 0.28), transparent 26%),
          radial-gradient(circle at 84% 18%, rgba(255, 255, 255, 0.22), transparent 24%);
        opacity: 0.92;
      }

      .dkd_anyela_home_guest_button span {
        position: relative;
        z-index: 1;
      }

      .dkd_anyela_home_guest_icon {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.20);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.36),
          0 0 18px rgba(255, 255, 255, 0.34);
      }

      .dkd_anyela_home_guest_button:active {
        transform: scale(0.985) translateY(1px);
      }

      @keyframes dkd_anyela_guest_gradient_flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 260% 50%; }
      }

      @keyframes dkd_anyela_guest_pulse {
        0%, 100% {
          filter: saturate(1.08) brightness(1);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.18),
            0 14px 28px rgba(255, 54, 199, 0.34),
            0 0 24px rgba(24, 247, 255, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.42);
        }
        50% {
          filter: saturate(1.38) brightness(1.12);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.28),
            0 18px 36px rgba(255, 54, 199, 0.48),
            0 0 34px rgba(24, 247, 255, 0.52),
            0 0 26px rgba(255, 230, 109, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.52);
        }
      }

      @keyframes dkd_anyela_guest_shine {
        0% { transform: translateX(-86%) rotate(7deg); opacity: 0; }
        28% { opacity: 0.95; }
        62% { opacity: 0.95; }
        100% { transform: translateX(86%) rotate(7deg); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .dkd_anyela_home_guest_button,
        .dkd_anyela_home_guest_button::before {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(dkdAnyelaHomeStyle);
  }

  function dkdAnyelaHomeRouteGuestLinks() {
    dkdAnyelaHomeGuestLinks.forEach(function dkdAnyelaHomeGuestLink(dkdAnyelaHomeGuestAnchor) {
      dkdAnyelaHomeGuestAnchor.setAttribute("href", "/AnyelaBorn/Home/");
      dkdAnyelaHomeGuestAnchor.setAttribute("aria-label", "Misafir girişi ile Home sayfasına devam et");
    });
  }

  function dkdAnyelaHomeHandleAnchorClick(dkdAnyelaHomeEvent) {
    const dkdAnyelaHomeTarget = dkdAnyelaHomeEvent.currentTarget;
    const dkdAnyelaHomeHref = dkdAnyelaHomeTarget.getAttribute("href");

    if (!dkdAnyelaHomeHref || !dkdAnyelaHomeHref.startsWith("#")) {
      return;
    }

    dkdAnyelaHomeEvent.preventDefault();
    dkdAnyelaHomeTarget.blur();
  }

  function dkdAnyelaHomeTogglePassword() {
    if (!dkdAnyelaHomePasswordInput || !dkdAnyelaHomePasswordToggle) {
      return;
    }

    const dkdAnyelaHomeCurrentType = dkdAnyelaHomePasswordInput.getAttribute("type");
    const dkdAnyelaHomeNextType = dkdAnyelaHomeCurrentType === "password" ? "text" : "password";
    const dkdAnyelaHomeNextLabel = dkdAnyelaHomeNextType === "password" ? "Şifreyi göster" : "Şifreyi gizle";

    dkdAnyelaHomePasswordInput.setAttribute("type", dkdAnyelaHomeNextType);
    dkdAnyelaHomePasswordToggle.setAttribute("aria-label", dkdAnyelaHomeNextLabel);
  }

  function dkdAnyelaHomeActivateTab(dkdAnyelaHomeEvent) {
    const dkdAnyelaHomeSelectedTab = dkdAnyelaHomeEvent.currentTarget;

    dkdAnyelaHomeLoginTabs.forEach(function dkdAnyelaHomeUpdateTab(dkdAnyelaHomeTab) {
      const dkdAnyelaHomeIsSelected = dkdAnyelaHomeTab === dkdAnyelaHomeSelectedTab;
      dkdAnyelaHomeTab.classList.toggle("dkd_anyela_home_login_tab_active", dkdAnyelaHomeIsSelected);
      dkdAnyelaHomeTab.setAttribute("aria-selected", String(dkdAnyelaHomeIsSelected));
    });
  }

  dkdAnyelaHomeInjectGuestAnimationStyles();
  dkdAnyelaHomeRouteGuestLinks();

  dkdAnyelaHomeHotspots.forEach(function dkdAnyelaHomeBindHotspot(dkdAnyelaHomeHotspot) {
    dkdAnyelaHomeHotspot.addEventListener("click", dkdAnyelaHomeHandleAnchorClick);
  });

  dkdAnyelaHomeLoginTabs.forEach(function dkdAnyelaHomeBindLoginTab(dkdAnyelaHomeLoginTab) {
    dkdAnyelaHomeLoginTab.addEventListener("click", dkdAnyelaHomeActivateTab);
  });

  if (dkdAnyelaHomePasswordToggle) {
    dkdAnyelaHomePasswordToggle.addEventListener("click", dkdAnyelaHomeTogglePassword);
  }

  window.addEventListener("load", dkdAnyelaHomeSetLoadedState, { once: true });
})();
