const dkdPackageData = {
  mini: {
    icon: "💬",
    title: "Mini Sohbet Paketi",
    slug: "mini-sohbet-paketi.html",
    price: 499,
    duration: "20 dakika yazılı sohbet",
    delivery: "Dekont onayından sonra özel sohbet alanı açılır.",
    short: "Günlük kısa mesajlaşma ve sıcak, kişiye özel yanıtlar.",
    badges: ["20 dk", "Yazılı sohbet", "1 gün içinde kullanım", "Başlangıç paketi"],
    features: [
      ["20 dakika yazılı sohbet", "Anyela ile kısa tanışma, günlük sohbet ve özel yanıt deneyimi."],
      ["Maksimum 12 kısa mesaj", "Sohbeti hızlı ve net tutmak için ideal kullanım sınırı."],
      ["Site içi özel alan", "Ödeme/dekont onayından sonra paket takibi için özel sohbet alanı açılır."],
      ["Ekstra yükseltme", "Sesli mesaj, özel görsel veya Full Premium pakete geçiş önerilebilir."]
    ],
    steps: ["Paketi seç ve ödeme açıklamasına ANYELA - Kullanıcı Adı - MINI yaz.", "Dekontu yükle ve kısa notunu ekle.", "Onaydan sonra sohbet başlangıç bilgisi iletilir."],
    paymentCode: "ANYELA - Kullanıcı Adı - MINI"
  },
  voice: {
    icon: "🎙️",
    title: "Sesli Mesaj Paketi",
    slug: "sesli-mesaj-paketi.html",
    price: 999,
    duration: "30 dakika sesli mesajlaşma",
    delivery: "Sesli cevaplar manuel hazırlanır ve onaylı alana yüklenir.",
    short: "Yazmak istemeyenler için Anyela tarzında kişiye özel sesli cevap deneyimi.",
    badges: ["30 dk", "4 kullanıcı ses mesajı", "4 Anyela sesli yanıt", "Premium ses"],
    features: [
      ["30 dakika sesli mesajlaşma", "Kullanıcı ses kaydı gönderir, Anyela yanıtı sesli olarak hazırlanır."],
      ["4 adet özel sesli yanıt", "Her yanıt ayrı ses dosyası olarak teslim edilir."],
      ["Canlı arama değildir", "Sistem güvenli ve kontrollü sesli mesajlaşma mantığıyla çalışır."],
      ["Özel konu seçimi", "Anime, oyun, motivasyon, günlük sohbet veya konsept mesaj isteyebilirsin."]
    ],
    steps: ["Ödeme açıklamasına ANYELA - Kullanıcı Adı - VOICE yaz.", "Dekontu ve ilk sesli mesaj konunu yükle.", "Onaydan sonra sesli yanıt süreci başlar."],
    paymentCode: "ANYELA - Kullanıcı Adı - VOICE"
  },
  vip: {
    icon: "💎",
    title: "VIP Özel İçerik",
    slug: "vip-ozel-icerik.html",
    price: 1499,
    duration: "45 dakika konsept planlama + özel içerik",
    delivery: "Özel görsel/konsept teslimi onay sırasına göre hazırlanır.",
    short: "Kişiye özel premium fotoğraf/konsept içerikleri için daha kapsamlı paket.",
    badges: ["45 dk", "3 özel görsel", "1 sesli yanıt", "VIP teslim"],
    features: [
      ["45 dakika özel konsept planlama", "Kıyafet, mekan, poz, tema ve tarz isteği detaylandırılır."],
      ["3 özel Anyela görseli", "Benzer tarz / ilham alınmış konsept yaklaşımıyla hazırlanır."],
      ["1 kişiye özel sesli cevap", "Paket deneyimini daha özel hissettiren kısa sesli yanıt eklenir."],
      ["Öncelikli kontrol", "İçerik hazırlığı Full Premium’dan sonra en öncelikli gruptadır."]
    ],
    steps: ["Ödeme açıklamasına ANYELA - Kullanıcı Adı - VIP yaz.", "Dekontla birlikte konsept/kıyafet/mekan notunu ekle.", "Onaydan sonra VIP içerik planı hazırlanır."],
    paymentCode: "ANYELA - Kullanıcı Adı - VIP"
  },
  full: {
    icon: "👑",
    title: "Full Premium Paket",
    slug: "full-premium-paket.html",
    price: 1999,
    duration: "60 dakika sohbet + tam premium teslim",
    delivery: "En popüler paket; sohbet, ses ve özel içerik tek deneyimde toplanır.",
    short: "Sohbet, sesli mesaj ve özel içeriklerin tamamını kapsayan en güçlü paket.",
    badges: ["60 dk", "5 sesli cevap", "5 özel görsel", "1 kısa video mesaj"],
    features: [
      ["60 dakika premium sohbet", "Yazılı sohbet ve içerik planı aynı pakette ilerler."],
      ["5 adet Anyela sesli yanıt", "Kişiye özel hazırlanmış kısa sesli cevaplar teslim edilir."],
      ["5 özel görsel", "Konsept, mekan, kıyafet ve poz isteğine göre premium set hazırlanır."],
      ["1 kısa video mesaj fikri", "Kişiye özel kısa konuşmalı video planı veya demo teslim taslağı eklenir."],
      ["En popüler", "Tek tek paket almadan tam deneyim isteyen kullanıcılar için tasarlandı."]
    ],
    steps: ["Ödeme açıklamasına ANYELA - Kullanıcı Adı - FULL yaz.", "Dekontu, konsept notunu ve varsa referans dosyanı yükle.", "Onaydan sonra premium teslim planı başlatılır."],
    paymentCode: "ANYELA - Kullanıcı Adı - FULL"
  }
};

const dkdIban = "TR53 0011 1000 0000 0151 1527 14";
const dkdAccountName = "Doğancan Kartal";

function dkdFormatLira(dkdAmount) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Number(dkdAmount || 0)) + " TL";
}

function dkdCopyText(dkdText) {
  if (!navigator.clipboard) {
    window.prompt("Kopyala:", dkdText);
    return;
  }
  navigator.clipboard.writeText(dkdText).then(() => {
    const dkdToast = document.querySelector("[data-dkd-toast]");
    if (dkdToast) {
      dkdToast.textContent = "Kopyalandı: " + dkdText;
      dkdToast.classList.add("dkd-visible");
      window.setTimeout(() => dkdToast.classList.remove("dkd-visible"), 2200);
    }
  });
}

function dkdWireCopyButtons() {
  document.querySelectorAll("[data-dkd-copy]").forEach((dkdCopyButton) => {
    dkdCopyButton.addEventListener("click", () => dkdCopyText(dkdCopyButton.getAttribute("data-dkd-copy") || ""));
  });
}

function dkdPaymentMarkup(dkdPackage) {
  const dkdAmountText = dkdFormatLira(dkdPackage.price);
  return `
    <h2>Ödeme ve dekont yükleme</h2>
    <p class="dkd-lead">FAST / EFT / havale sonrası dekontunu seç. Dekont onayından sonra kısa süre içerisinde onaylanacaktır.</p>
    <div class="dkd-payment-field">
      <div class="dkd-payment-label">IBAN</div>
      <div class="dkd-payment-value"><span>${dkdIban}</span><button class="dkd-payment-copy" data-dkd-copy="${dkdIban}">Kopyala</button></div>
    </div>
    <div class="dkd-payment-field">
      <div class="dkd-payment-label">Ad Soyad</div>
      <div class="dkd-payment-value"><span>${dkdAccountName}</span><button class="dkd-payment-copy" data-dkd-copy="${dkdAccountName}">Kopyala</button></div>
    </div>
    <div class="dkd-payment-field">
      <div class="dkd-payment-label">Tutar</div>
      <div class="dkd-payment-value"><span>${dkdAmountText}</span><button class="dkd-payment-copy" data-dkd-copy="${dkdAmountText}">Kopyala</button></div>
    </div>
    <div class="dkd-payment-field">
      <div class="dkd-payment-label">Açıklama</div>
      <div class="dkd-payment-value"><span>${dkdPackage.paymentCode}</span><button class="dkd-payment-copy" data-dkd-copy="${dkdPackage.paymentCode}">Kopyala</button></div>
    </div>
    <form class="dkd-form-grid" data-dkd-receipt-form>
      <div class="dkd-input-group">
        <label for="dkdCustomerName">Kullanıcı adı / ad soyad</label>
        <input class="dkd-input" id="dkdCustomerName" name="dkdCustomerName" placeholder="Örn: drabornfan23" autocomplete="name">
      </div>
      <div class="dkd-input-group">
        <label for="dkdCustomerContact">E-posta veya telefon</label>
        <input class="dkd-input" id="dkdCustomerContact" name="dkdCustomerContact" placeholder="Onay bilgisi için iletişim" autocomplete="email">
      </div>
      <div class="dkd-input-group">
        <label for="dkdReceiptFile">Dekont yükle</label>
        <input class="dkd-input dkd-file-input" id="dkdReceiptFile" name="dkdReceiptFile" type="file" accept="image/*,.pdf" data-dkd-file-input>
        <div class="dkd-file-name" data-dkd-file-name>Dekont görseli veya PDF seçebilirsin.</div>
      </div>
      <div class="dkd-input-group">
        <label for="dkdCustomerNote">Not / özel istek</label>
        <textarea class="dkd-textarea" id="dkdCustomerNote" name="dkdCustomerNote" placeholder="Paketle ilgili kısa notunu yaz."></textarea>
      </div>
      <button class="dkd-action-button" type="submit">Dekontu onaya hazırla</button>
      <div class="dkd-submit-state" data-dkd-submit-state>Bilgi alındı. Dekont onayından sonra kısa süre içerisinde onaylanacaktır.</div>
    </form>
    <div class="dkd-submit-state" data-dkd-toast></div>
  `;
}

function dkdWireReceiptForm() {
  document.querySelectorAll("[data-dkd-file-input]").forEach((dkdFileInput) => {
    dkdFileInput.addEventListener("change", () => {
      const dkdFileName = dkdFileInput.files && dkdFileInput.files[0] ? dkdFileInput.files[0].name : "Dekont görseli veya PDF seçebilirsin.";
      const dkdFileLabel = dkdFileInput.closest("form")?.querySelector("[data-dkd-file-name]");
      if (dkdFileLabel) dkdFileLabel.textContent = "Seçilen dekont: " + dkdFileName;
    });
  });
  document.querySelectorAll("[data-dkd-receipt-form]").forEach((dkdReceiptForm) => {
    dkdReceiptForm.addEventListener("submit", (dkdSubmitEvent) => {
      dkdSubmitEvent.preventDefault();
      const dkdState = dkdReceiptForm.querySelector("[data-dkd-submit-state]");
      if (dkdState) dkdState.classList.add("dkd-visible");
      dkdReceiptForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

function dkdRenderPackagePage() {
  const dkdPackageKey = document.body.getAttribute("data-dkd-package-key");
  if (!dkdPackageKey || !dkdPackageData[dkdPackageKey]) return;
  const dkdPackage = dkdPackageData[dkdPackageKey];
  document.title = dkdPackage.title + " | Anyela Born Miami Style Club";
  const dkdHero = document.querySelector("[data-dkd-package-hero]");
  const dkdDetails = document.querySelector("[data-dkd-package-details]");
  const dkdPayment = document.querySelector("[data-dkd-payment]");
  if (dkdHero) {
    dkdHero.innerHTML = `
      <span class="dkd-kicker">${dkdPackage.icon} Miami Style Club</span>
      <h1 class="dkd-section-title"><span class="dkd-gradient-text">${dkdPackage.title}</span></h1>
      <p class="dkd-lead">${dkdPackage.short}</p>
      <div class="dkd-price-row"><div class="dkd-price">${dkdFormatLira(dkdPackage.price)}</div><div class="dkd-price-note">tek seferlik paket</div></div>
      <div class="dkd-badges">${dkdPackage.badges.map((dkdBadge) => `<span class="dkd-badge">${dkdBadge}</span>`).join("")}</div>
    `;
  }
  if (dkdDetails) {
    dkdDetails.innerHTML = `
      <div class="dkd-two-columns">
        <section class="dkd-panel">
          <h2>Paket içeriği</h2>
          <p class="dkd-lead"><strong>${dkdPackage.duration}</strong>. ${dkdPackage.delivery}</p>
          <ul class="dkd-feature-list">
            ${dkdPackage.features.map((dkdFeature) => `<li><span class="dkd-list-icon">✦</span><span><strong>${dkdFeature[0]}</strong><br>${dkdFeature[1]}</span></li>`).join("")}
          </ul>
        </section>
        <section class="dkd-panel">
          <h2>Nasıl başlar?</h2>
          <ol class="dkd-step-list">
            ${dkdPackage.steps.map((dkdStep) => `<li><span class="dkd-list-icon">✓</span><span>${dkdStep}</span></li>`).join("")}
          </ol>
          <div class="dkd-info-strip">Anyela Born dijital karakter deneyimidir. İçerikler eğlence, sosyal etkileşim ve yaratıcı konsept üretimi amaçlıdır. 18 yaş altı özel sohbet paketi alamaz.</div>
        </section>
      </div>
    `;
  }
  if (dkdPayment) dkdPayment.innerHTML = dkdPaymentMarkup(dkdPackage);
}

function dkdCalculateOffer() {
  const dkdTextMinutes = Number(document.querySelector("#dkdOfferTextMinutes")?.value || 0);
  const dkdVoiceCount = Number(document.querySelector("#dkdOfferVoiceCount")?.value || 0);
  const dkdVideoCount = Number(document.querySelector("#dkdOfferVideoCount")?.value || 0);
  const dkdPhotoCount = Number(document.querySelector("#dkdOfferPhotoCount")?.value || 0);
  const dkdBusinessSelected = Boolean(document.querySelector("#dkdOfferBusiness")?.checked);
  const dkdPrioritySelected = Boolean(document.querySelector("#dkdOfferPriority")?.checked);
  const dkdDetailedSelected = Boolean(document.querySelector("#dkdOfferDetailed")?.checked);
  const dkdBasePrice = 249;
  const dkdTextPrice = dkdTextMinutes * 14;
  const dkdVoicePrice = dkdVoiceCount * 169;
  const dkdVideoPrice = dkdVideoCount * 549;
  const dkdPhotoPrice = dkdPhotoCount * 249;
  const dkdBusinessPrice = dkdBusinessSelected ? 1500 : 0;
  const dkdPriorityPrice = dkdPrioritySelected ? 349 : 0;
  const dkdDetailedPrice = dkdDetailedSelected ? 499 : 0;
  const dkdTotalPrice = dkdBasePrice + dkdTextPrice + dkdVoicePrice + dkdVideoPrice + dkdPhotoPrice + dkdBusinessPrice + dkdPriorityPrice + dkdDetailedPrice;
  const dkdBreakdownItems = [
    ["Teklif başlangıç bedeli", dkdBasePrice],
    [`Yazılı sohbet: ${dkdTextMinutes} dk`, dkdTextPrice],
    [`Sesli cevap: ${dkdVoiceCount} adet`, dkdVoicePrice],
    [`Video mesaj: ${dkdVideoCount} adet`, dkdVideoPrice],
    [`Özel görsel: ${dkdPhotoCount} adet`, dkdPhotoPrice]
  ];
  if (dkdBusinessSelected) dkdBreakdownItems.push(["İşletme / reklam kullanım hakkı", dkdBusinessPrice]);
  if (dkdPrioritySelected) dkdBreakdownItems.push(["Öncelikli teslim", dkdPriorityPrice]);
  if (dkdDetailedSelected) dkdBreakdownItems.push(["Detaylı konsept planı", dkdDetailedPrice]);
  document.querySelectorAll("[data-dkd-range-output]").forEach((dkdOutput) => {
    const dkdInput = document.querySelector("#" + dkdOutput.getAttribute("data-dkd-range-output"));
    if (dkdInput) dkdOutput.textContent = dkdInput.value;
  });
  const dkdTotalNode = document.querySelector("[data-dkd-offer-total]");
  const dkdBreakdownNode = document.querySelector("[data-dkd-offer-breakdown]");
  const dkdPaymentNode = document.querySelector("[data-dkd-offer-payment]");
  if (dkdTotalNode) dkdTotalNode.textContent = dkdFormatLira(dkdTotalPrice);
  if (dkdBreakdownNode) {
    dkdBreakdownNode.innerHTML = dkdBreakdownItems.map((dkdItem) => `<div class="dkd-breakdown-item"><span>${dkdItem[0]}</span><strong>${dkdFormatLira(dkdItem[1])}</strong></div>`).join("");
  }
  if (dkdPaymentNode) {
    const dkdOfferPackage = {
      price: dkdTotalPrice,
      paymentCode: `ANYELA - Kullanıcı Adı - TEKLIF - ${dkdFormatLira(dkdTotalPrice)}`
    };
    dkdPaymentNode.innerHTML = dkdPaymentMarkup(dkdOfferPackage);
    dkdWireCopyButtons();
    dkdWireReceiptForm();
  }
}

function dkdWireOfferCalculator() {
  const dkdOfferControls = document.querySelectorAll("[data-dkd-offer-control]");
  if (!dkdOfferControls.length) return;
  dkdOfferControls.forEach((dkdControl) => {
    dkdControl.addEventListener("input", dkdCalculateOffer);
    dkdControl.addEventListener("change", dkdCalculateOffer);
  });
  dkdCalculateOffer();
}

function dkdRenderHomeCards() {
  const dkdCards = document.querySelector("[data-dkd-home-cards]");
  if (!dkdCards) return;
  dkdCards.innerHTML = Object.values(dkdPackageData).map((dkdPackage) => `
    <a class="dkd-card-link" href="${dkdPackage.slug}">
      <div class="dkd-card-icon">${dkdPackage.icon}</div>
      <div class="dkd-card-title">${dkdPackage.title}</div>
      <p class="dkd-card-copy">${dkdPackage.short}</p>
      <div class="dkd-card-price">${dkdFormatLira(dkdPackage.price)}</div>
    </a>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  dkdRenderPackagePage();
  dkdRenderHomeCards();
  dkdWireCopyButtons();
  dkdWireReceiptForm();
  dkdWireOfferCalculator();
});
