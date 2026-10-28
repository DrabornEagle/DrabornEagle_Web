"use strict";
(() => {
  const dkdById = (id) => document.getElementById(id);
  const dkdInput = dkdById("dkd-url");
  const dkdForm = dkdById("dkd-form");
  const dkdResult = dkdById("dkd-result");
  const dkdSubmit = dkdById("dkd-submit");
  const dkdHistoryKey = "dkd_drabornapk_recent_v1";
  const dkdPackagePattern = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;
  let dkdRequestCounter = 0;
  let dkdActiveController = null;

  function dkdParsePackage(rawValue) {
    const dkdRaw = String(rawValue || "").trim();
    if (dkdRaw.length > 2048 || !dkdRaw) throw new Error("Lütfen geçerli bir Google Play bağlantısı gir.");
    if (dkdPackagePattern.test(dkdRaw) && dkdRaw.length <= 180) return dkdRaw;
    let dkdUrl;
    try { dkdUrl = new URL(dkdRaw); } catch { throw new Error("Google Play bağlantısı veya paket kimliği geçerli değil."); }
    if (dkdUrl.protocol !== "https:" || !["play.google.com", "market.android.com"].includes(dkdUrl.hostname.toLowerCase())) {
      throw new Error("Yalnızca Google Play bağlantıları ve Android paket kimlikleri desteklenir.");
    }
    if (!["/store/apps/details", "/details"].includes(dkdUrl.pathname.replace(/\/$/, ""))) {
      throw new Error("Uygulamanın Google Play detay bağlantısını yapıştır.");
    }
    const dkdId = (dkdUrl.searchParams.get("id") || "").trim();
    if (!dkdPackagePattern.test(dkdId) || dkdId.length > 180) throw new Error("Bağlantı içinde geçerli paket kimliği bulunamadı.");
    return dkdId;
  }

  function dkdDisplayResult(dkdPackage) {
    dkdResult.hidden = false;
    dkdById("dkd-app-title").textContent = "Uygulama inceleniyor...";
    dkdById("dkd-app-package").textContent = dkdPackage || "";
    dkdById("dkd-app-version").textContent = "";
    dkdById("dkd-app-art").replaceChildren(document.createTextNode("APK"));
    dkdById("dkd-result-status").className = "dkd-result-status";
    dkdById("dkd-result-status").textContent = "Taranıyor...";
    dkdById("dkd-result-message").textContent = "Google Play uygulaması ve bağımsız APK kaynakları kontrol ediliyor.";
    dkdById("dkd-download-link").hidden = true;
    dkdById("dkd-source-link").hidden = true;
    dkdById("dkd-source-note").hidden = true;
    const dkdPlayLink = dkdById("dkd-play-link");
    dkdPlayLink.href = dkdPackage ? "https://play.google.com/store/apps/details?id=" + encodeURIComponent(dkdPackage) : "https://play.google.com/store/apps";
    dkdResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function dkdError(dkdMessage) {
    dkdResult.hidden = false;
    dkdById("dkd-app-title").textContent = "İşlem tamamlanamadı";
    dkdById("dkd-app-package").textContent = "";
    dkdById("dkd-result-status").textContent = "Hata";
    dkdById("dkd-result-status").className = "dkd-result-status is-missing";
    dkdById("dkd-result-message").textContent = dkdMessage;
    dkdById("dkd-download-link").hidden = true;
    dkdById("dkd-source-link").hidden = true;
    dkdById("dkd-source-note").hidden = true;
    dkdResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function dkdGetHistory() {
    try {
      const dkdData = JSON.parse(localStorage.getItem(dkdHistoryKey) || "[]");
      return Array.isArray(dkdData) ? dkdData.filter((dkdItem) => dkdPackagePattern.test(dkdItem)).slice(0, 5) : [];
    } catch { return []; }
  }

  function dkdShowHistory() {
    const dkdItems = dkdGetHistory();
    dkdById("dkd-history-section").hidden = dkdItems.length === 0;
    const dkdList = dkdById("dkd-history-list");
    dkdList.replaceChildren();
    dkdItems.forEach((dkdPackage) => {
      const dkdEntry = document.createElement("li");
      const dkdButton = document.createElement("button");
      dkdButton.type = "button";
      dkdButton.textContent = "↗  " + dkdPackage;
      dkdButton.addEventListener("click", () => { dkdInput.value = dkdPackage; dkdForm.requestSubmit(); });
      dkdEntry.appendChild(dkdButton);
      dkdList.appendChild(dkdEntry);
    });
  }

  function dkdStoreHistory(dkdPackage) {
    try {
      localStorage.setItem(dkdHistoryKey, JSON.stringify([dkdPackage, ...dkdGetHistory().filter((dkdItem) => dkdItem !== dkdPackage)].slice(0, 5)));
    } catch { /* Storage disabled */ }
    dkdShowHistory();
  }

  function dkdSafeFroidUrl(dkdUrl, dkdPackage) {
    try {
      const dkdParsed = new URL(dkdUrl);
      const dkdExpected = new RegExp("^/repo/" + dkdPackage.replace(/\./g, "\\.") + "_[0-9]+\\.apk$");
      if (dkdParsed.protocol === "https:" && dkdParsed.hostname === "f-droid.org" && dkdExpected.test(dkdParsed.pathname)) return dkdParsed.href;
    } catch { /* Invalid URL */ }
    return null;
  }

  function dkdRenderData(dkdData, dkdPackage) {
    const dkdTitle = typeof dkdData.title === "string" && dkdData.title.trim() ? dkdData.title : dkdPackage;
    dkdById("dkd-app-title").textContent = dkdTitle;
    dkdById("dkd-app-package").textContent = dkdPackage;
    const dkdArt = dkdById("dkd-app-art");
    dkdArt.replaceChildren(document.createTextNode("APK"));
    if (typeof dkdData.icon === "string") {
      try {
        const dkdIconURL = new URL(dkdData.icon);
        if (dkdIconURL.protocol === "https:" && (dkdIconURL.hostname === "play-lh.googleusercontent.com" || dkdIconURL.hostname === "lh3.googleusercontent.com")) {
          const dkdImg = document.createElement("img");
          dkdImg.alt = "";
          dkdImg.referrerPolicy = "no-referrer";
          dkdImg.loading = "lazy";
          dkdImg.src = dkdIconURL.href;
          dkdImg.onerror = () => dkdArt.replaceChildren(document.createTextNode("APK"));
          dkdArt.replaceChildren(dkdImg);
        }
      } catch { /* Keep fallback */ }
    }
    const dkdAvailableUrl = dkdSafeFroidUrl(dkdData.fdroid && dkdData.fdroid.downloadUrl, dkdPackage);
    const dkdFdroidExists = !!(dkdData.fdroid && dkdData.fdroid.found);
    const dkdSourceLink = dkdById("dkd-source-link");
    if (dkdFdroidExists) {
      dkdSourceLink.href = "https://f-droid.org/packages/" + encodeURIComponent(dkdPackage) + "/";
      dkdSourceLink.hidden = false;
    } else {
      dkdSourceLink.hidden = true;
    }
    const dkdDownload = dkdById("dkd-download-link");
    dkdDownload.hidden = !dkdAvailableUrl;
    dkdById("dkd-app-version").textContent = dkdAvailableUrl ? "F-Droid sürümü: " + (dkdData.fdroid.versionName || dkdData.fdroid.versionCode) : "";
    const dkdStatus = dkdById("dkd-result-status");
    dkdStatus.className = "dkd-result-status " + (dkdAvailableUrl ? "is-ready" : "is-missing");
    dkdStatus.textContent = dkdAvailableUrl ? "APK mevcut" : dkdFdroidExists ? "Kaynak mevcut" : "APK bulunamadı";
    dkdById("dkd-source-note").hidden = !dkdAvailableUrl;
    if (dkdAvailableUrl) {
      dkdDownload.href = dkdAvailableUrl;
      dkdById("dkd-result-message").textContent = "Bu paket için F-Droid deposunda bağımsız bir APK tespit edildi. Google Play sürümüyle aynı olmayabilir. Dosya F-Droid kaynağından indirilir.";
      if (dkdById("dkd-auto").checked) {
        dkdById("dkd-result-message").textContent = "APK bulundu! F-Droid'den indirme başlatılıyor. Tarayıcı indirmeyi onaylamanı isteyebilir.";
        dkdDownload.click();
      }
    } else if (dkdFdroidExists) {
      dkdById("dkd-result-message").textContent = "F-Droid'de uygulama sayfası bulundu ancak doğrudan APK bağlantısı doğrulanamadı. F-Droid sayfasından sürümü seçebilirsin.";
    } else {
      dkdById("dkd-result-message").textContent = "Bu paket için desteklenen F-Droid deposunda doğrudan indirilebilir APK bulunamadı. Google Play üzerinden kurabilir veya yayıncının resmî dağıtım kanalını kontrol edebilirsin.";
    }
  }

  dkdForm.addEventListener("submit", async (dkdEvent) => {
    dkdEvent.preventDefault();
    let dkdPackage;
    try { dkdPackage = dkdParsePackage(dkdInput.value); }
    catch (dkdCaught) { dkdError(dkdCaught.message); return; }
    if (dkdActiveController) dkdActiveController.abort();
    const dkdRequestId = ++dkdRequestCounter;
    dkdActiveController = new AbortController();
    dkdSubmit.disabled = true;
    dkdById("dkd-submit-label").textContent = "Kaynak aranıyor...";
    dkdDisplayResult(dkdPackage);
    try {
      const dkdResponse = await fetch("/api/drabornapk-lookup?package=" + encodeURIComponent(dkdPackage), {
        method: "GET", signal: dkdActiveController.signal, headers: { "Accept": "application/json" }
      });
      if (!dkdResponse.ok) throw new Error(dkdResponse.status === 429 ? "Çok fazla sorgu yapıldı; daha sonra tekrar dene." : "Kaynak sorgulanamadı. Daha sonra tekrar dene.");
      const dkdData = await dkdResponse.json();
      if (dkdRequestId !== dkdRequestCounter) return;
      if (dkdData.packageName !== dkdPackage) throw new Error("Kaynak yanıtı doğrulanamadı.");
      dkdStoreHistory(dkdPackage);
      dkdRenderData(dkdData, dkdPackage);
    } catch (dkdCaught) {
      if (dkdRequestId !== dkdRequestCounter || dkdCaught.name === "AbortError") return;
      dkdError(dkdCaught.message || "Beklenmeyen bir hata oluştu.");
    } finally {
      if (dkdRequestId === dkdRequestCounter) {
        dkdSubmit.disabled = false;
        dkdById("dkd-submit-label").textContent = "APK'yi Bul";
        dkdActiveController = null;
      }
    }
  });

  dkdById("dkd-paste").addEventListener("click", async () => {
    try {
      const dkdClipboard = await navigator.clipboard.readText();
      dkdInput.value = dkdClipboard.trim();
      dkdInput.focus();
    } catch {
      dkdInput.focus();
      dkdInput.placeholder = "Buraya basılı tutup Yapıştır seç";
    }
  });
  dkdById("dkd-example").addEventListener("click", () => {
    dkdInput.value = "https://play.google.com/store/apps/details?id=org.kde.kdeconnect_tp";
    dkdInput.focus();
  });
  dkdById("dkd-history-clear").addEventListener("click", () => {
    try { localStorage.removeItem(dkdHistoryKey); } catch { /* Storage disabled */ }
    dkdShowHistory();
  });
  if (new URL(location.href).searchParams.has("id")) {
    dkdInput.value = "https://play.google.com/store/apps/details?id=" + new URL(location.href).searchParams.get("id");
  }
  dkdShowHistory();
})();
