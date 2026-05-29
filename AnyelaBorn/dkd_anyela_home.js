(function dkdAnyelaHomeScope() {
  "use strict";

  const dkdAnyelaHomeRoot = document.getElementById("dkd_anyela_home_root");
  const dkdAnyelaHomeHotspots = Array.from(document.querySelectorAll(".dkd_anyela_hotspot"));

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

  dkdAnyelaHomeHotspots.forEach(function dkdAnyelaHomeBindHotspot(dkdAnyelaHomeHotspot) {
    dkdAnyelaHomeHotspot.addEventListener("click", dkdAnyelaHomeHandleAnchorClick);
  });

  window.addEventListener("load", dkdAnyelaHomeSetLoadedState, { once: true });
})();
