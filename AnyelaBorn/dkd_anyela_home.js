(function dkdAnyelaHomeScope() {
  "use strict";

  const dkdAnyelaHomeRoot = document.getElementById("dkd_anyela_home_root");
  const dkdAnyelaHomeHotspots = Array.from(document.querySelectorAll(".dkd_anyela_hotspot"));
  const dkdAnyelaHomePasswordInput = document.getElementById("dkd_anyela_home_password");
  const dkdAnyelaHomePasswordToggle = document.getElementById("dkd_anyela_home_password_toggle");
  const dkdAnyelaHomeLoginTabs = Array.from(document.querySelectorAll(".dkd_anyela_home_login_tab"));

  function dkdAnyelaHomeSetLoadedState() {
    if (!dkdAnyelaHomeRoot) {
      return;
    }

    dkdAnyelaHomeRoot.setAttribute("data-dkd-anyela-home-loaded", "true");
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
