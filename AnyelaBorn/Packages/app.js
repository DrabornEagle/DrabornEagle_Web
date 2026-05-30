const dkdPackages = {
  mini: {
    key: "mini",
    icon: "💬",
    category: "Yazılı sohbet",
    title: "Mini Sohbet Paketi",
    subtitle: "Günlük kısa mesajlaşma, hızlı tanışma ve özel yanıtlar için giriş paketi.",
    price: 499,
    minutes: "20 dakika",
    delivery: "Onay sonrası aynı gün başlangıç",
    voice: "Sesli cevap dahil değil",
    video: "Video mesaj dahil değil",
    reference: "ANYELA-MINI",
    features: [
      "20 dakika yazılı sohbet hakkı",
      "Site içi özel chat odası",
      "Günlük kısa mesajlaşma ve tanışma akışı",
      "1 adet referans görsel yükleme hakkı",
      "Ekstra sesli cevap veya özel görsel paketi sonradan eklenebilir"
    ]
  },
  voice: {
    key: "voice",
    icon: "🎙️",
    category: "Sesli mesajlaşma",
    title: "Sesli Mesaj Paketi",
    subtitle: "Yazmak yerine sesli ilerlemek isteyenler için Miami neon premium ses deneyimi.",
    price: 999,
    minutes: "30 dakika",
    delivery: "Dekont onayından sonra kısa süre içinde açılır",
    voice: "5 kullanıcı sesli mesajı + 5 Anyela sesli cevap",
    video: "Video mesaj dahil değil",
    reference: "ANYELA-VOICE",
    features: [
      "30 dakika boyunca sesli mesajlaşma deneyimi",
      "5 adet kullanıcı sesli mesajı gönderme hakkı",
      "5 adet kişiye özel Anyela sesli cevap",
      "Site içi ses oynatıcı ve özel chat odası",
      "Sesli cevaplar manuel kontrol sonrası yüklenir"
    ]
  },
  vipContent: {
    key: "vipContent",
    icon: "💎",
    category: "Özel içerik",
    title: "VIP Özel İçerik",
    subtitle: "Kişiye özel premium fotoğraf, konsept ve yaratıcı Anyela içerikleri için özel paket.",
    price: 1499,
    minutes: "Sohbet yerine içerik teslim paketi",
    delivery: "24-72 saat içinde konsept teslim hedefi",
    voice: "1 kısa sesli not dahil",
    video: "1 kısa video mesaj isteği taslak hakkı",
    reference: "ANYELA-VIP",
    features: [
      "5 adet özel Anyela görseli",
      "Kıyafet, mekan, konsept ve tarz notu alınır",
      "1 kısa kişiye özel sesli not",
      "1 revize hakkı",
      "Birebir marka kopyası değil, benzer tarz ve ilham konsepti hazırlanır"
    ]
  },
  fullPremium: {
    key: "fullPremium",
    icon: "👑",
    category: "En popüler",
    title: "Full Premium Paket",
    subtitle: "Sohbet, sesli mesaj ve özel içeriklerin tamamını tek pakette isteyenler için.",
    price: 1999,
    minutes: "45 dakika",
    delivery: "Öncelikli onay ve hızlı başlatma",
    voice: "8 Anyela sesli cevap",
    video: "2 kısa video mesaj konsepti",
    reference: "ANYELA-FULL",
    features: [
      "45 dakika yazılı sohbet hakkı",
      "8 adet kişiye özel sesli cevap",
      "5 adet özel Anyela görseli",
      "2 kısa video mesaj veya video konsept taslağı",
      "VIP öncelikli teslim ve özel chat odası"
    ]
  }
};

const dkdScreens = {
  packages: document.getElementById("dkdPackagesScreen"),
  detail: document.getElementById("dkdDetailScreen"),
  offer: document.getElementById("dkdOfferScreen"),
  payment: document.getElementById("dkdPaymentScreen")
};

const dkdPackageGrid = document.getElementById("dkdPackageGrid");
const dkdDetailTemplate = document.getElementById("dkdDetailTemplate");
const dkdPaymentTemplate = document.getElementById("dkdPaymentTemplate");
const dkdBackButton = document.getElementById("dkdBackButton");
const dkdOpenOfferButton = document.getElementById("dkdOpenOfferButton");
const dkdOfferForm = document.getElementById("dkdOfferForm");
const dkdOfferTotal = document.getElementById("dkdOfferTotal");
const dkdOfferSummary = document.getElementById("dkdOfferSummary");
const dkdPriceLines = document.getElementById("dkdPriceLines");
const dkdCreateOfferOrderButton = document.getElementById("dkdCreateOfferOrderButton");
const dkdNavigationStack = ["packages"];
let dkdCurrentSelection = null;
let dkdCurrentOffer = null;

function dkdFormatMoney(dkdAmount) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(dkdAmount);
}

function dkdSetScreen(dkdScreenName, dkdPushHistory = true) {
  Object.values(dkdScreens).forEach((dkdScreenElement) => {
    dkdScreenElement.classList.remove("dkd-screen-active");
  });
  dkdScreens[dkdScreenName].classList.add("dkd-screen-active");
  if (dkdPushHistory && dkdNavigationStack[dkdNavigationStack.length - 1] !== dkdScreenName) {
    dkdNavigationStack.push(dkdScreenName);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function dkdBuildPackageGrid() {
  dkdPackageGrid.innerHTML = "";
  Object.values(dkdPackages).forEach((dkdPackageData) => {
    const dkdPackageButton = document.createElement("button");
    dkdPackageButton.className = "dkd-package-card";
    dkdPackageButton.type = "button";
    dkdPackageButton.dataset.packageKey = dkdPackageData.key;
    dkdPackageButton.innerHTML = `
      <span class="dkd-package-symbol" aria-hidden="true">${dkdPackageData.icon}</span>
      <strong>${dkdPackageData.title}</strong>
      <small>${dkdPackageData.subtitle}</small>
      <span class="dkd-package-price">${dkdFormatMoney(dkdPackageData.price)} TL</span>
    `;
    dkdPackageGrid.appendChild(dkdPackageButton);
  });
}

function dkdBuildMetricCard(dkdLabel, dkdValue) {
  const dkdMetricCard = document.createElement("div");
  dkdMetricCard.className = "dkd-metric-card";
  dkdMetricCard.innerHTML = `<span>${dkdLabel}</span><strong>${dkdValue}</strong>`;
  return dkdMetricCard;
}

function dkdOpenPackageDetail(dkdPackageKey) {
  if (dkdPackageKey === "custom") {
    dkdOpenOfferScreen();
    return;
  }

  const dkdPackageData = dkdPackages[dkdPackageKey];
  if (!dkdPackageData) {
    return;
  }

  dkdCurrentSelection = {
    type: "package",
    title: dkdPackageData.title,
    price: dkdPackageData.price,
    reference: dkdPackageData.reference,
    description: dkdPackageData.subtitle
  };

  const dkdDetailFragment = dkdDetailTemplate.content.cloneNode(true);
  dkdDetailFragment.querySelector('[data-template="icon"]').textContent = dkdPackageData.icon;
  dkdDetailFragment.querySelector('[data-template="category"]').textContent = dkdPackageData.category;
  dkdDetailFragment.querySelector('[data-template="title"]').textContent = dkdPackageData.title;
  dkdDetailFragment.querySelector('[data-template="subtitle"]').textContent = dkdPackageData.subtitle;
  dkdDetailFragment.querySelector('[data-template="price"]').textContent = dkdFormatMoney(dkdPackageData.price);
  dkdDetailFragment.querySelector('[data-template="paymentInfo"]').textContent = "IBAN ödeme sonrası dekont yükle. Onaydan sonra kısa süre içerisinde özel ekranın hazırlanır.";

  const dkdFeatureList = dkdDetailFragment.querySelector('[data-template="features"]');
  dkdPackageData.features.forEach((dkdFeatureText) => {
    const dkdFeatureItem = document.createElement("li");
    dkdFeatureItem.textContent = dkdFeatureText;
    dkdFeatureList.appendChild(dkdFeatureItem);
  });

  const dkdMetrics = dkdDetailFragment.querySelector('[data-template="metrics"]');
  dkdMetrics.appendChild(dkdBuildMetricCard("Süre", dkdPackageData.minutes));
  dkdMetrics.appendChild(dkdBuildMetricCard("Teslim", dkdPackageData.delivery));
  dkdMetrics.appendChild(dkdBuildMetricCard("Ses", dkdPackageData.voice));
  dkdMetrics.appendChild(dkdBuildMetricCard("Video", dkdPackageData.video));

  dkdDetailFragment.querySelector('[data-template="paymentButton"]').addEventListener("click", () => {
    dkdOpenPaymentScreen(dkdCurrentSelection);
  });
  dkdDetailFragment.querySelector('[data-template="offerButton"]').addEventListener("click", () => {
    dkdOpenOfferScreen();
  });

  dkdScreens.detail.innerHTML = "";
  dkdScreens.detail.appendChild(dkdDetailFragment);
  dkdSetScreen("detail");
}

function dkdGetNumberInputValue(dkdInputId) {
  const dkdInput = document.getElementById(dkdInputId);
  const dkdParsedValue = Number(dkdInput.value || 0);
  if (Number.isNaN(dkdParsedValue) || dkdParsedValue < 0) {
    return 0;
  }
  return dkdParsedValue;
}

function dkdCalculateOffer() {
  const dkdOfferType = document.getElementById("dkdOfferType").value;
  const dkdMinutes = dkdGetNumberInputValue("dkdMinuteInput");
  const dkdVoiceCount = dkdGetNumberInputValue("dkdVoiceCountInput");
  const dkdVideoCount = dkdGetNumberInputValue("dkdVideoCountInput");
  const dkdPhotoCount = dkdGetNumberInputValue("dkdPhotoCountInput");
  const dkdRevisionCount = dkdGetNumberInputValue("dkdRevisionCountInput");
  const dkdPriority = document.getElementById("dkdPriorityInput").value;
  const dkdBrandUse = document.getElementById("dkdBrandUseInput").checked;

  const dkdTypeBasePriceMap = {
    fan: 149,
    content: 299,
    brand: 950
  };
  const dkdTypeLabelMap = {
    fan: "Fan sohbet / özel deneyim",
    content: "Özel görsel-video içerik",
    brand: "İşletme / reklam yüzü"
  };

  const dkdBasePrice = dkdTypeBasePriceMap[dkdOfferType];
  const dkdMinutePrice = dkdMinutes * 18;
  const dkdVoicePrice = dkdVoiceCount * 160;
  const dkdVideoPrice = dkdVideoCount * 420;
  const dkdPhotoPrice = dkdPhotoCount * 170;
  const dkdRevisionPrice = dkdRevisionCount * 120;
  let dkdSubtotal = dkdBasePrice + dkdMinutePrice + dkdVoicePrice + dkdVideoPrice + dkdPhotoPrice + dkdRevisionPrice;

  const dkdLines = [
    `${dkdTypeLabelMap[dkdOfferType]} başlangıç: ${dkdFormatMoney(dkdBasePrice)} TL`,
    `${dkdMinutes} dk yazılı sohbet: ${dkdFormatMoney(dkdMinutePrice)} TL`,
    `${dkdVoiceCount} sesli mesaj: ${dkdFormatMoney(dkdVoicePrice)} TL`,
    `${dkdVideoCount} video mesaj: ${dkdFormatMoney(dkdVideoPrice)} TL`,
    `${dkdPhotoCount} özel görsel: ${dkdFormatMoney(dkdPhotoPrice)} TL`,
    `${dkdRevisionCount} revize hakkı: ${dkdFormatMoney(dkdRevisionPrice)} TL`
  ];

  if (dkdPriority === "fast") {
    const dkdFastPrice = Math.round(dkdSubtotal * 0.2);
    dkdSubtotal += dkdFastPrice;
    dkdLines.push(`Hızlı teslim farkı: ${dkdFormatMoney(dkdFastPrice)} TL`);
  }

  if (dkdPriority === "vip") {
    const dkdVipPrice = Math.round(dkdSubtotal * 0.35);
    dkdSubtotal += dkdVipPrice;
    dkdLines.push(`VIP öncelik farkı: ${dkdFormatMoney(dkdVipPrice)} TL`);
  }

  if (dkdBrandUse) {
    const dkdBrandPrice = Math.round(dkdSubtotal * 0.45);
    dkdSubtotal += dkdBrandPrice;
    dkdLines.push(`İşletme / reklam kullanım hakkı: ${dkdFormatMoney(dkdBrandPrice)} TL`);
  }

  const dkdTotal = Math.max(399, Math.round(dkdSubtotal / 10) * 10);
  if (dkdTotal === 399 && dkdSubtotal < 399) {
    dkdLines.push("Minimum özel teklif tutarı: 399 TL");
  }

  dkdCurrentOffer = {
    type: "offer",
    title: "Anyela Özel Teklif",
    price: dkdTotal,
    reference: "ANYELA-TEKLIF",
    description: `${dkdMinutes} dk sohbet, ${dkdVoiceCount} sesli mesaj, ${dkdVideoCount} video mesaj, ${dkdPhotoCount} özel görsel`
  };

  document.getElementById("dkdMinuteOutput").textContent = dkdMinutes;
  dkdOfferTotal.textContent = dkdFormatMoney(dkdTotal);
  dkdOfferSummary.textContent = dkdCurrentOffer.description;
  dkdPriceLines.innerHTML = "";
  dkdLines.forEach((dkdLineText) => {
    const dkdLineItem = document.createElement("li");
    dkdLineItem.textContent = dkdLineText;
    dkdPriceLines.appendChild(dkdLineItem);
  });
}

function dkdOpenOfferScreen() {
  dkdCalculateOffer();
  dkdSetScreen("offer");
}

function dkdOpenPaymentScreen(dkdSelectionData) {
  const dkdPaymentData = dkdSelectionData || dkdCurrentOffer;
  if (!dkdPaymentData) {
    return;
  }

  dkdCurrentSelection = dkdPaymentData;
  const dkdPaymentFragment = dkdPaymentTemplate.content.cloneNode(true);
  dkdPaymentFragment.querySelector('[data-template="title"]').textContent = `${dkdPaymentData.title} ödeme alanı`;
  dkdPaymentFragment.querySelector('[data-template="subtitle"]').textContent = `${dkdPaymentData.description}. Dekont yüklendikten sonra kontrol edilip kısa süre içerisinde onaylanacaktır.`;
  dkdPaymentFragment.querySelector('[data-template="reference"]').textContent = `${dkdPaymentData.reference} - Kullanıcı Adı`;
  dkdPaymentFragment.querySelector('[data-template="selectedPackage"]').value = dkdPaymentData.title;
  dkdPaymentFragment.querySelector('[data-template="selectedPrice"]').value = `${dkdFormatMoney(dkdPaymentData.price)} TL`;

  dkdScreens.payment.innerHTML = "";
  dkdScreens.payment.appendChild(dkdPaymentFragment);
  dkdWirePaymentForm();
  dkdSetScreen("payment");
}

function dkdWirePaymentForm() {
  document.querySelectorAll("[data-copy-target]").forEach((dkdCopyButton) => {
    dkdCopyButton.addEventListener("click", async () => {
      const dkdTargetId = dkdCopyButton.getAttribute("data-copy-target");
      const dkdCopyText = document.getElementById(dkdTargetId).textContent.trim();
      try {
        await navigator.clipboard.writeText(dkdCopyText);
        dkdCopyButton.textContent = "Kopyalandı";
        setTimeout(() => {
          dkdCopyButton.textContent = "Kopyala";
        }, 1400);
      } catch (dkdClipboardError) {
        dkdCopyButton.textContent = "Seç ve kopyala";
      }
    });
  });

  const dkdReceiptInput = document.getElementById("dkdReceiptInput");
  const dkdReceiptFileName = document.getElementById("dkdReceiptFileName");
  dkdReceiptInput.addEventListener("change", () => {
    const dkdSelectedFile = dkdReceiptInput.files && dkdReceiptInput.files[0];
    dkdReceiptFileName.textContent = dkdSelectedFile ? dkdSelectedFile.name : "PNG, JPG veya PDF yükleyebilirsin.";
  });

  const dkdReceiptForm = document.getElementById("dkdReceiptForm");
  dkdReceiptForm.addEventListener("submit", (dkdSubmitEvent) => {
    dkdSubmitEvent.preventDefault();
    const dkdCustomerName = document.getElementById("dkdCustomerNameInput").value.trim();
    const dkdContact = document.getElementById("dkdContactInput").value.trim();
    const dkdReceiptFile = dkdReceiptInput.files && dkdReceiptInput.files[0];
    const dkdResult = document.getElementById("dkdReceiptResult");

    if (!dkdCustomerName || !dkdContact || !dkdReceiptFile || !document.getElementById("dkdAgeConfirmInput").checked) {
      dkdResult.style.color = "#ffb3c8";
      dkdResult.textContent = "Lütfen kullanıcı bilgisi, iletişim, dekont dosyası ve 18+ onayını tamamla.";
      return;
    }

    const dkdOrderRecord = {
      orderDate: new Date().toISOString(),
      customerName: dkdCustomerName,
      contact: dkdContact,
      packageTitle: dkdCurrentSelection.title,
      price: dkdCurrentSelection.price,
      receiptFileName: dkdReceiptFile.name,
      status: "Dekont kontrol bekliyor"
    };

    const dkdStoredOrders = JSON.parse(localStorage.getItem("dkd_anyela_orders") || "[]");
    dkdStoredOrders.push(dkdOrderRecord);
    localStorage.setItem("dkd_anyela_orders", JSON.stringify(dkdStoredOrders));

    dkdResult.style.color = "#5cffd2";
    dkdResult.textContent = "Dekont kaydı alındı. Onaydan sonra kısa süre içerisinde paketiniz aktif edilecektir.";
    dkdReceiptForm.reset();
    dkdReceiptFileName.textContent = "PNG, JPG veya PDF yükleyebilirsin.";
  });
}

function dkdGoBack() {
  if (dkdNavigationStack.length <= 1) {
    dkdSetScreen("packages", false);
    return;
  }
  dkdNavigationStack.pop();
  const dkdPreviousScreen = dkdNavigationStack[dkdNavigationStack.length - 1] || "packages";
  dkdSetScreen(dkdPreviousScreen, false);
}

function dkdWireGlobalEvents() {
  document.addEventListener("click", (dkdClickEvent) => {
    const dkdPackageTrigger = dkdClickEvent.target.closest("[data-package-key]");
    if (dkdPackageTrigger) {
      dkdOpenPackageDetail(dkdPackageTrigger.dataset.packageKey);
    }
  });

  dkdBackButton.addEventListener("click", dkdGoBack);
  dkdOpenOfferButton.addEventListener("click", dkdOpenOfferScreen);
  dkdOfferForm.addEventListener("input", dkdCalculateOffer);
  dkdOfferForm.addEventListener("change", dkdCalculateOffer);
  dkdCreateOfferOrderButton.addEventListener("click", () => {
    dkdCalculateOffer();
    dkdOpenPaymentScreen(dkdCurrentOffer);
  });
}

function dkdInit() {
  dkdBuildPackageGrid();
  dkdWireGlobalEvents();
  dkdCalculateOffer();
}

dkdInit();
