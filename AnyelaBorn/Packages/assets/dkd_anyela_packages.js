const dkdPaymentInfo = Object.freeze({
  iban: "TR53 0011 1000 0000 0151 1527 14",
  holder: "Doğancan Kartal",
  descriptionPrefix: "ANYELA"
});

const dkdPackageCatalog = Object.freeze([
  {
    id: "mini-sohbet",
    icon: "💬",
    title: "Mini Sohbet Paketi",
    subtitle: "Günlük kısa mesajlaşma ve özel yanıtlar",
    price: 499,
    duration: "20 dakika",
    messageLimit: "25 yazılı mesaj hakkı",
    delivery: "Dekont onayından sonra aynı gün içinde başlatılır",
    badge: "Hızlı başlangıç",
    description: "Anyela ile kısa, sıcak ve kontrollü bir tanışma sohbeti için hazırlandı. Kullanıcı site içindeki özel sohbet alanından yazılı mesaj gönderir, admin onaylı Anyela yanıtları ile ilerler.",
    includes: [
      "20 dakika yazılı sohbet deneyimi",
      "25 yazılı mesaj hakkı",
      "1 görsel referans gönderme alanı",
      "Kişiye özel kısa Anyela yanıtları",
      "Ödeme/dekont onayından sonra özel sohbet odası"
    ],
    extras: [
      "Sesli cevap istenirse özel teklife dönüştürülebilir",
      "Özel görsel/video talebi ekstra ücretlendirilir",
      "Hizmet başladıktan sonra süre kullanılmış sayılır"
    ]
  },
  {
    id: "sesli-mesaj",
    icon: "🎙️",
    title: "Sesli Mesaj Paketi",
    subtitle: "Özel sesli mesajlar ve daha yakın iletişim",
    price: 999,
    duration: "30 dakika",
    messageLimit: "5 kişiye özel sesli cevap",
    delivery: "Sesli cevaplar onaydan sonra sırayla hazırlanır",
    badge: "Voice chat",
    description: "Yazmak istemeyen kullanıcılar için sesli mesajlaşma mantığında premium deneyim. Kullanıcı sesli mesaj gönderebilir, Anyela tarzında hazırlanan kişisel sesli cevaplar dinlenebilir.",
    includes: [
      "30 dakika sesli mesajlaşma akışı",
      "5 adet kişiye özel sesli cevap hakkı",
      "Yazılı not ve konu açıklaması ekleme",
      "Sesli cevapların chat odasında oynatılması",
      "Öncelikli dekont kontrol sırası"
    ],
    extras: [
      "Canlı telefon görüşmesi değildir",
      "Ek sesli cevap adeti teklif oluştur ekranından eklenebilir",
      "Uygunsuz veya yasa dışı istekler kabul edilmez"
    ]
  },
  {
    id: "vip-icerik",
    icon: "💎",
    title: "VIP Özel İçerik",
    subtitle: "Kişiye özel premium fotoğraf ve konsept içerikler",
    price: 1499,
    duration: "45 dakika içerik planı",
    messageLimit: "5 özel görsel + 2 revizyon notu",
    delivery: "Konsept netleşince üretim sırasına alınır",
    badge: "Premium içerik",
    description: "Kullanıcının istediği konsept, mekan, kıyafet veya stil fikrine göre Anyela için özel yaratıcı görsel set planlanır. Birebir marka/telif kopyası yerine ilham alınmış özgün konsept üretilir.",
    includes: [
      "45 dakika konsept konuşma ve planlama",
      "5 özel Anyela görseli teslimi",
      "2 revizyon notu hakkı",
      "Kıyafet, mekan ve poz fikri gönderme alanı",
      "Görsel/video referansı yükleme paneli"
    ],
    extras: [
      "Üçüncü kişilere ait özel görseller izinsiz kullanılamaz",
      "Marka logoları ve telifli tasarımlar birebir kopyalanmaz",
      "Ek görsel adedi teklif oluştur ekranından eklenebilir"
    ]
  },
  {
    id: "full-premium",
    icon: "👑",
    title: "Full Premium Paket",
    subtitle: "Sohbet, sesli mesaj ve özel içeriklerin tamamı",
    price: 1999,
    duration: "60 dakika",
    messageLimit: "Yazılı + sesli + özel içerik birleşimi",
    delivery: "En popüler paket; onaydan sonra öncelikli sıraya alınır",
    badge: "En çok tercih edilen",
    popular: true,
    description: "Anyela Born Club deneyimini tek pakette isteyen kullanıcılar için hazırlandı. Yazılı sohbet, sesli cevap, görsel konsept ve mini video notu aynı akışta birleşir.",
    includes: [
      "60 dakika özel deneyim süresi",
      "Yazılı sohbet + 5 sesli cevap",
      "5 özel görsel konsept teslimi",
      "1 mini video mesaj / konuşmalı konsept notu",
      "VIP öncelikli kontrol ve teslim sırası"
    ],
    extras: [
      "Ek video mesajlar teklif ekranından eklenebilir",
      "İşletme/reklam kullanımı ayrıca fiyatlandırılır",
      "Dekont onayından sonra kısa süre içerisinde başlatılır"
    ]
  }
]);

const dkdOfferRates = Object.freeze({
  writtenMinute: 18,
  voiceMessage: 165,
  videoMessage: 490,
  photoConcept: 240,
  priorityRatio: 0.18,
  brandUsage: 1500
});

const dkdDom = Object.freeze({
  packageGrid: document.getElementById("dkd_package_grid"),
  packagesScreen: document.getElementById("dkd_packages_screen"),
  detailScreen: document.getElementById("dkd_detail_screen"),
  detailTitle: document.getElementById("dkd_detail_title"),
  detailCard: document.getElementById("dkd_detail_card"),
  offerScreen: document.getElementById("dkd_offer_screen"),
  offerPaymentPanel: document.getElementById("dkd_offer_payment_panel"),
  minutesInput: document.getElementById("dkd_minutes_input"),
  minutesValue: document.getElementById("dkd_minutes_value"),
  voiceCountInput: document.getElementById("dkd_voice_count_input"),
  videoCountInput: document.getElementById("dkd_video_count_input"),
  photoCountInput: document.getElementById("dkd_photo_count_input"),
  priorityInput: document.getElementById("dkd_priority_input"),
  usageInput: document.getElementById("dkd_usage_input"),
  offerTotal: document.getElementById("dkd_offer_total"),
  offerBreakdown: document.getElementById("dkd_offer_breakdown")
});

const dkdFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0
});

function dkdFormatTl(dkdAmount) {
  return dkdFormatter.format(dkdAmount).replace("₺", "TL");
}

function dkdEscapeHtml(dkdValue) {
  return String(dkdValue)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dkdSwitchScreen(dkdTargetScreen) {
  [dkdDom.packagesScreen, dkdDom.detailScreen, dkdDom.offerScreen].forEach((dkdScreenItem) => {
    dkdScreenItem.classList.remove("dkd-screen-active");
  });
  dkdTargetScreen.classList.add("dkd-screen-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function dkdRenderPackageCards() {
  dkdDom.packageGrid.innerHTML = dkdPackageCatalog.map((dkdPackageItem) => {
    const dkdPopularRibbon = dkdPackageItem.popular ? `<span class="dkd-popular-ribbon">⭐ ${dkdEscapeHtml(dkdPackageItem.badge)}</span>` : "";
    return `
      <button class="dkd-package-card" type="button" data-dkd-package-id="${dkdEscapeHtml(dkdPackageItem.id)}" aria-label="${dkdEscapeHtml(dkdPackageItem.title)} paketini seç">
        ${dkdPopularRibbon}
        <span class="dkd-package-icon" aria-hidden="true">${dkdEscapeHtml(dkdPackageItem.icon)}</span>
        <span class="dkd-package-copy">
          <h2>${dkdEscapeHtml(dkdPackageItem.title)}</h2>
          <p>${dkdEscapeHtml(dkdPackageItem.subtitle)}</p>
          <span class="dkd-badge-row">
            <span>${dkdEscapeHtml(dkdPackageItem.duration)}</span>
            <span>${dkdEscapeHtml(dkdPackageItem.messageLimit)}</span>
          </span>
          <span class="dkd-package-footer">
            <strong class="dkd-price">${dkdFormatTl(dkdPackageItem.price)}</strong>
            <span class="dkd-select-pill">Paketi Seç ›</span>
          </span>
        </span>
      </button>`;
  }).join("");
}

function dkdBuildCheckList(dkdItems) {
  return `<ul class="dkd-check-list">${dkdItems.map((dkdListItem) => `<li>${dkdEscapeHtml(dkdListItem)}</li>`).join("")}</ul>`;
}

function dkdRenderPaymentPanel(dkdPaymentContext) {
  const dkdSafeContextId = dkdPaymentContext.id;
  const dkdSafeTitle = dkdEscapeHtml(dkdPaymentContext.title);
  const dkdSafeAmount = Number(dkdPaymentContext.amount || 0);
  const dkdReferenceDescription = `${dkdPaymentInfo.descriptionPrefix} - Kullanıcı Adı - ${dkdPaymentContext.reference}`;
  return `
    <div class="dkd-payment-head">
      <div>
        <p class="dkd-kicker">IBAN / Dekont</p>
        <h2>${dkdSafeTitle}</h2>
        <p>Dekont yükledikten sonra ödemen kısa süre içerisinde kontrol edilip onaylanacaktır.</p>
      </div>
      <strong class="dkd-payment-amount">${dkdFormatTl(dkdSafeAmount)}</strong>
    </div>

    <div class="dkd-bank-box">
      <div class="dkd-bank-line">
        <small>IBAN</small>
        <b id="${dkdSafeContextId}_iban_text">${dkdEscapeHtml(dkdPaymentInfo.iban)}</b>
      </div>
      <div class="dkd-bank-line">
        <small>AD SOYAD</small>
        <b>${dkdEscapeHtml(dkdPaymentInfo.holder)}</b>
      </div>
      <div class="dkd-bank-line">
        <small>AÇIKLAMA ÖNERİSİ</small>
        <b>${dkdEscapeHtml(dkdReferenceDescription)}</b>
      </div>
      <button class="dkd-copy-button" type="button" data-dkd-copy-source="${dkdSafeContextId}_iban_text">IBAN Kopyala</button>
    </div>

    <form class="dkd-payment-form" id="${dkdSafeContextId}_form" data-dkd-context-title="${dkdSafeTitle}" data-dkd-context-amount="${dkdSafeAmount}" data-dkd-context-reference="${dkdEscapeHtml(dkdPaymentContext.reference)}">
      <div class="dkd-form-grid">
        <label class="dkd-field-control">
          <span>Ad Soyad</span>
          <input name="dkd_customer_name" type="text" autocomplete="name" placeholder="Adını yaz" required />
        </label>
        <label class="dkd-field-control">
          <span>Telefon veya e-posta</span>
          <input name="dkd_customer_contact" type="text" autocomplete="email" placeholder="Onay için iletişim bilgisi" required />
        </label>
      </div>

      <label class="dkd-field-control">
        <span>İstek / açıklama</span>
        <textarea name="dkd_customer_note" placeholder="Paket veya özel teklif için istediğin detayları yaz"></textarea>
      </label>

      <label class="dkd-file-control">
        <span>Dekont yükle</span>
        <input name="dkd_receipt_file" type="file" accept="image/*,.pdf" required />
        <small class="dkd-file-note">PDF, JPG veya PNG dekont yükleyebilirsin. Maksimum dosya boyutunu hosting/Supabase tarafında ayrıca sınırlamak gerekir.</small>
      </label>

      <p class="dkd-warning-note">Ödeme açıklamasına <b>${dkdEscapeHtml(dkdReferenceDescription)}</b> yazılması onayı hızlandırır.</p>
      <button class="dkd-submit-button" type="submit">Dekontu Onaya Gönder</button>
      <p class="dkd-success-note" id="${dkdSafeContextId}_success"></p>
    </form>`;
}

function dkdOpenPackageDetail(dkdPackageId) {
  const dkdSelectedPackage = dkdPackageCatalog.find((dkdPackageItem) => dkdPackageItem.id === dkdPackageId);
  if (!dkdSelectedPackage) {
    return;
  }

  dkdDom.detailTitle.textContent = dkdSelectedPackage.title;
  dkdDom.detailCard.innerHTML = `
    <div class="dkd-detail-hero">
      <span class="dkd-detail-hero-icon" aria-hidden="true">${dkdEscapeHtml(dkdSelectedPackage.icon)}</span>
      <div class="dkd-detail-copy">
        <p class="dkd-kicker">${dkdEscapeHtml(dkdSelectedPackage.badge)}</p>
        <h2>${dkdEscapeHtml(dkdSelectedPackage.title)}</h2>
        <p>${dkdEscapeHtml(dkdSelectedPackage.description)}</p>
        <div class="dkd-badge-row">
          <span>${dkdEscapeHtml(dkdSelectedPackage.duration)}</span>
          <span>${dkdEscapeHtml(dkdSelectedPackage.messageLimit)}</span>
          <span>${dkdFormatTl(dkdSelectedPackage.price)}</span>
        </div>
      </div>
    </div>

    <div class="dkd-detail-sections">
      <div class="dkd-mini-card">
        <h3>Paket içeriği</h3>
        ${dkdBuildCheckList(dkdSelectedPackage.includes)}
      </div>
      <div class="dkd-mini-card">
        <h3>Önemli notlar</h3>
        ${dkdBuildCheckList(dkdSelectedPackage.extras)}
      </div>
    </div>

    <div class="dkd-mini-card">
      <h3>Onay ve teslim</h3>
      <p>${dkdEscapeHtml(dkdSelectedPackage.delivery)}. Dekont onayından sonra kısa süre içerisinde onaylanacaktır bilgisi kullanıcıya gösterilir.</p>
    </div>

    <section class="dkd-payment-card">
      ${dkdRenderPaymentPanel({
        id: "dkd_package_payment",
        title: dkdSelectedPackage.title,
        amount: dkdSelectedPackage.price,
        reference: dkdSelectedPackage.title
      })}
    </section>`;

  dkdAttachPaymentForm("dkd_package_payment_form", "dkd_package_payment_success");
  dkdSwitchScreen(dkdDom.detailScreen);
}

function dkdClampNumber(dkdValue, dkdMinValue, dkdMaxValue) {
  const dkdParsedValue = Number.parseInt(dkdValue, 10);
  if (Number.isNaN(dkdParsedValue)) {
    return dkdMinValue;
  }
  return Math.min(Math.max(dkdParsedValue, dkdMinValue), dkdMaxValue);
}

function dkdCalculateOffer() {
  const dkdMinutes = dkdClampNumber(dkdDom.minutesInput.value, 10, 120);
  const dkdVoiceCount = dkdClampNumber(dkdDom.voiceCountInput.value, 0, 20);
  const dkdVideoCount = dkdClampNumber(dkdDom.videoCountInput.value, 0, 10);
  const dkdPhotoCount = dkdClampNumber(dkdDom.photoCountInput.value, 0, 20);
  const dkdPrioritySelected = dkdDom.priorityInput.value === "priority";
  const dkdBrandSelected = dkdDom.usageInput.value === "brand";

  const dkdWrittenAmount = dkdMinutes * dkdOfferRates.writtenMinute;
  const dkdVoiceAmount = dkdVoiceCount * dkdOfferRates.voiceMessage;
  const dkdVideoAmount = dkdVideoCount * dkdOfferRates.videoMessage;
  const dkdPhotoAmount = dkdPhotoCount * dkdOfferRates.photoConcept;
  const dkdBrandAmount = dkdBrandSelected ? dkdOfferRates.brandUsage : 0;
  const dkdBaseAmount = dkdWrittenAmount + dkdVoiceAmount + dkdVideoAmount + dkdPhotoAmount + dkdBrandAmount;
  const dkdPriorityAmount = dkdPrioritySelected ? Math.round(dkdBaseAmount * dkdOfferRates.priorityRatio) : 0;
  const dkdTotalAmount = Math.max(249, dkdBaseAmount + dkdPriorityAmount);

  return {
    minutes: dkdMinutes,
    voiceCount: dkdVoiceCount,
    videoCount: dkdVideoCount,
    photoCount: dkdPhotoCount,
    prioritySelected: dkdPrioritySelected,
    brandSelected: dkdBrandSelected,
    writtenAmount: dkdWrittenAmount,
    voiceAmount: dkdVoiceAmount,
    videoAmount: dkdVideoAmount,
    photoAmount: dkdPhotoAmount,
    brandAmount: dkdBrandAmount,
    priorityAmount: dkdPriorityAmount,
    totalAmount: dkdTotalAmount
  };
}

function dkdRenderOfferCalculation() {
  const dkdOffer = dkdCalculateOffer();
  dkdDom.minutesValue.textContent = `${dkdOffer.minutes} dk`;
  dkdDom.offerTotal.textContent = dkdFormatTl(dkdOffer.totalAmount);

  const dkdBreakdownRows = [
    ["Yazılı sohbet", `${dkdOffer.minutes} dk × ${dkdFormatTl(dkdOfferRates.writtenMinute)}`, dkdOffer.writtenAmount],
    ["Sesli mesaj", `${dkdOffer.voiceCount} adet × ${dkdFormatTl(dkdOfferRates.voiceMessage)}`, dkdOffer.voiceAmount],
    ["Video mesaj", `${dkdOffer.videoCount} adet × ${dkdFormatTl(dkdOfferRates.videoMessage)}`, dkdOffer.videoAmount],
    ["Özel görsel", `${dkdOffer.photoCount} adet × ${dkdFormatTl(dkdOfferRates.photoConcept)}`, dkdOffer.photoAmount]
  ];

  if (dkdOffer.brandSelected) {
    dkdBreakdownRows.push(["Marka / işletme kullanım hakkı", "Tanıtım ve reklam konsepti", dkdOffer.brandAmount]);
  }

  if (dkdOffer.prioritySelected) {
    dkdBreakdownRows.push(["Öncelikli teslim", "%18 hızlı sıra farkı", dkdOffer.priorityAmount]);
  }

  dkdDom.offerBreakdown.innerHTML = dkdBreakdownRows.map((dkdBreakdownItem) => `
    <div class="dkd-breakdown-row">
      <span>${dkdEscapeHtml(dkdBreakdownItem[0])}<br><small>${dkdEscapeHtml(dkdBreakdownItem[1])}</small></span>
      <strong>${dkdFormatTl(dkdBreakdownItem[2])}</strong>
    </div>`).join("");

  dkdDom.offerPaymentPanel.innerHTML = dkdRenderPaymentPanel({
    id: "dkd_offer_payment",
    title: "Özel Anyela Teklifi",
    amount: dkdOffer.totalAmount,
    reference: `OZEL-TEKLIF-${dkdOffer.minutes}DK-${dkdOffer.voiceCount}SES-${dkdOffer.videoCount}VIDEO-${dkdOffer.photoCount}GORSEL`
  });
  dkdAttachPaymentForm("dkd_offer_payment_form", "dkd_offer_payment_success");
}

function dkdCreateOrderCode() {
  const dkdTimestampPart = Date.now().toString(36).toUpperCase();
  const dkdRandomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DKD-ANYELA-${dkdTimestampPart}-${dkdRandomPart}`;
}

function dkdReadStoredOrders() {
  try {
    return JSON.parse(localStorage.getItem("dkd_anyela_order_records") || "[]");
  } catch (dkdStorageError) {
    return [];
  }
}

function dkdSaveStoredOrder(dkdOrderRecord) {
  const dkdStoredOrders = dkdReadStoredOrders();
  dkdStoredOrders.unshift(dkdOrderRecord);
  localStorage.setItem("dkd_anyela_order_records", JSON.stringify(dkdStoredOrders.slice(0, 30)));
}

function dkdAttachPaymentForm(dkdFormId, dkdSuccessId) {
  const dkdPaymentForm = document.getElementById(dkdFormId);
  const dkdSuccessBox = document.getElementById(dkdSuccessId);
  if (!dkdPaymentForm || !dkdSuccessBox) {
    return;
  }

  dkdPaymentForm.addEventListener("submit", (dkdSubmitEvent) => {
    dkdSubmitEvent.preventDefault();
    const dkdFormData = new FormData(dkdPaymentForm);
    const dkdReceiptFile = dkdFormData.get("dkd_receipt_file");
    const dkdOrderCode = dkdCreateOrderCode();
    const dkdOrderRecord = {
      dkd_order_code: dkdOrderCode,
      dkd_title: dkdPaymentForm.dataset.dkdContextTitle,
      dkd_reference: dkdPaymentForm.dataset.dkdContextReference,
      dkd_amount: Number(dkdPaymentForm.dataset.dkdContextAmount || 0),
      dkd_customer_name: String(dkdFormData.get("dkd_customer_name") || "").trim(),
      dkd_customer_contact: String(dkdFormData.get("dkd_customer_contact") || "").trim(),
      dkd_customer_note: String(dkdFormData.get("dkd_customer_note") || "").trim(),
      dkd_receipt_file_name: dkdReceiptFile && dkdReceiptFile.name ? dkdReceiptFile.name : "dekont-secilmedi",
      dkd_status: "dekont_onayi_bekliyor",
      dkd_created_at: new Date().toISOString()
    };

    dkdSaveStoredOrder(dkdOrderRecord);
    dkdSuccessBox.innerHTML = `Dekont talebin hazırlandı. Sipariş kodun: <span class="dkd-order-code">${dkdEscapeHtml(dkdOrderCode)}</span><br>Dekont onayından sonra kısa süre içerisinde onaylanacaktır.`;
    dkdSuccessBox.classList.add("dkd-success-note-active");
    dkdPaymentForm.reset();
  }, { once: false });
}

function dkdCopyTextFromButton(dkdButtonElement) {
  const dkdSourceId = dkdButtonElement.getAttribute("data-dkd-copy-source");
  const dkdSourceElement = document.getElementById(dkdSourceId);
  if (!dkdSourceElement) {
    return;
  }

  navigator.clipboard.writeText(dkdSourceElement.textContent.trim()).then(() => {
    const dkdOriginalLabel = dkdButtonElement.textContent;
    dkdButtonElement.textContent = "Kopyalandı ✓";
    window.setTimeout(() => {
      dkdButtonElement.textContent = dkdOriginalLabel;
    }, 1300);
  }).catch(() => {
    dkdButtonElement.textContent = "Manuel kopyala";
  });
}

function dkdAttachGlobalActions() {
  document.body.addEventListener("click", (dkdClickEvent) => {
    const dkdPackageButton = dkdClickEvent.target.closest("[data-dkd-package-id]");
    if (dkdPackageButton) {
      dkdOpenPackageDetail(dkdPackageButton.getAttribute("data-dkd-package-id"));
      return;
    }

    const dkdCopyButton = dkdClickEvent.target.closest("[data-dkd-copy-source]");
    if (dkdCopyButton) {
      dkdCopyTextFromButton(dkdCopyButton);
      return;
    }

    const dkdScrollButton = dkdClickEvent.target.closest("[data-dkd-scroll-target]");
    if (dkdScrollButton) {
      const dkdTargetElement = document.getElementById(dkdScrollButton.getAttribute("data-dkd-scroll-target"));
      if (dkdTargetElement) {
        dkdTargetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  document.getElementById("dkd_back_to_packages_button").addEventListener("click", () => dkdSwitchScreen(dkdDom.packagesScreen));
  document.getElementById("dkd_back_from_offer_button").addEventListener("click", () => dkdSwitchScreen(dkdDom.packagesScreen));
  document.getElementById("dkd_open_offer_button").addEventListener("click", () => {
    dkdRenderOfferCalculation();
    dkdSwitchScreen(dkdDom.offerScreen);
  });

  [
    dkdDom.minutesInput,
    dkdDom.voiceCountInput,
    dkdDom.videoCountInput,
    dkdDom.photoCountInput,
    dkdDom.priorityInput,
    dkdDom.usageInput
  ].forEach((dkdInputElement) => {
    dkdInputElement.addEventListener("input", dkdRenderOfferCalculation);
    dkdInputElement.addEventListener("change", dkdRenderOfferCalculation);
  });
}

function dkdInitializePage() {
  dkdRenderPackageCards();
  dkdRenderOfferCalculation();
  dkdAttachGlobalActions();
}

document.addEventListener("DOMContentLoaded", dkdInitializePage);
