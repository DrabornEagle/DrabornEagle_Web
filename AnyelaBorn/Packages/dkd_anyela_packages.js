
(function dkdAnyelaPackagesScope() {
  "use strict";

  const dkdAnyelaReceiptInputs = Array.from(document.querySelectorAll("[data-dkd-anyela-receipt]"));
  const dkdAnyelaConfirmButtons = Array.from(document.querySelectorAll("[data-dkd-anyela-confirm]"));
  const dkdAnyelaCopyButtons = Array.from(document.querySelectorAll("[data-dkd-anyela-copy-iban]"));
  const dkdAnyelaOfferForm = document.querySelector("[data-dkd-anyela-offer-form]");

  function dkdAnyelaFormatTry(dkdAnyelaAmount) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }).format(dkdAnyelaAmount);
  }

  dkdAnyelaReceiptInputs.forEach(function dkdAnyelaBindReceipt(dkdAnyelaReceiptInput) {
    dkdAnyelaReceiptInput.addEventListener("change", function dkdAnyelaReceiptChange() {
      const dkdAnyelaStatus = dkdAnyelaReceiptInput.closest(".dkd_anyela_receipt")?.querySelector("[data-dkd-anyela-receipt-status]");
      const dkdAnyelaFile = dkdAnyelaReceiptInput.files && dkdAnyelaReceiptInput.files[0];

      if (!dkdAnyelaStatus) {
        return;
      }

      dkdAnyelaStatus.textContent = dkdAnyelaFile
        ? "Dekont seçildi: " + dkdAnyelaFile.name + ". Onay sonrası kısa süre içerisinde bilgilendirileceksin."
        : "Dekont henüz seçilmedi.";
    });
  });

  dkdAnyelaConfirmButtons.forEach(function dkdAnyelaBindConfirm(dkdAnyelaConfirmButton) {
    dkdAnyelaConfirmButton.addEventListener("click", function dkdAnyelaShowConfirm() {
      const dkdAnyelaStatus = dkdAnyelaConfirmButton.closest(".dkd_anyela_receipt")?.querySelector("[data-dkd-anyela-receipt-status]");
      if (dkdAnyelaStatus) {
        dkdAnyelaStatus.textContent = "Dekont onay talebi alındı. Dekont onayından sonra kısa süre içerisinde onaylanacaktır.";
      }
    });
  });

  dkdAnyelaCopyButtons.forEach(function dkdAnyelaBindCopy(dkdAnyelaCopyButton) {
    dkdAnyelaCopyButton.addEventListener("click", function dkdAnyelaCopyIban() {
      const dkdAnyelaIbanText = "TR53 0011 1000 0000 0151 1527 14 - Doğancan Kartal";
      navigator.clipboard?.writeText(dkdAnyelaIbanText);
      dkdAnyelaCopyButton.textContent = "IBAN kopyalandı";
      window.setTimeout(function dkdAnyelaResetCopyText() {
        dkdAnyelaCopyButton.textContent = "IBAN bilgilerini kopyala";
      }, 1700);
    });
  });

  if (dkdAnyelaOfferForm) {
    const dkdAnyelaMinuteRange = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-offer-minutes]");
    const dkdAnyelaVoiceRange = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-offer-voice]");
    const dkdAnyelaVideoRange = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-offer-video]");
    const dkdAnyelaPhotoRange = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-offer-photo]");
    const dkdAnyelaPrioritySelect = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-offer-priority]");
    const dkdAnyelaMinuteValue = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-minute-value]");
    const dkdAnyelaVoiceValue = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-voice-value]");
    const dkdAnyelaVideoValue = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-video-value]");
    const dkdAnyelaPhotoValue = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-photo-value]");
    const dkdAnyelaTotalValue = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-total-value]");
    const dkdAnyelaBreakdown = dkdAnyelaOfferForm.querySelector("[data-dkd-anyela-breakdown]");

    function dkdAnyelaNumberFrom(dkdAnyelaInput, dkdAnyelaFallback) {
      return Number(dkdAnyelaInput?.value || dkdAnyelaFallback);
    }

    function dkdAnyelaCalculateOffer() {
      const dkdAnyelaMinutes = dkdAnyelaNumberFrom(dkdAnyelaMinuteRange, 10);
      const dkdAnyelaVoiceCount = dkdAnyelaNumberFrom(dkdAnyelaVoiceRange, 0);
      const dkdAnyelaVideoCount = dkdAnyelaNumberFrom(dkdAnyelaVideoRange, 0);
      const dkdAnyelaPhotoCount = dkdAnyelaNumberFrom(dkdAnyelaPhotoRange, 0);
      const dkdAnyelaPriorityMultiplier = Number(dkdAnyelaPrioritySelect?.value || 1);
      const dkdAnyelaBaseTotal = 299;
      const dkdAnyelaMinuteTotal = dkdAnyelaMinutes * 18;
      const dkdAnyelaVoiceTotal = dkdAnyelaVoiceCount * 129;
      const dkdAnyelaVideoTotal = dkdAnyelaVideoCount * 449;
      const dkdAnyelaPhotoTotal = dkdAnyelaPhotoCount * 89;
      const dkdAnyelaCalculatedTotal = Math.round((dkdAnyelaBaseTotal + dkdAnyelaMinuteTotal + dkdAnyelaVoiceTotal + dkdAnyelaVideoTotal + dkdAnyelaPhotoTotal) * dkdAnyelaPriorityMultiplier);

      if (dkdAnyelaMinuteValue) dkdAnyelaMinuteValue.textContent = String(dkdAnyelaMinutes) + " dk";
      if (dkdAnyelaVoiceValue) dkdAnyelaVoiceValue.textContent = String(dkdAnyelaVoiceCount) + " adet";
      if (dkdAnyelaVideoValue) dkdAnyelaVideoValue.textContent = String(dkdAnyelaVideoCount) + " adet";
      if (dkdAnyelaPhotoValue) dkdAnyelaPhotoValue.textContent = String(dkdAnyelaPhotoCount) + " görsel";
      if (dkdAnyelaTotalValue) dkdAnyelaTotalValue.textContent = dkdAnyelaFormatTry(dkdAnyelaCalculatedTotal);
      if (dkdAnyelaBreakdown) {
        dkdAnyelaBreakdown.textContent = "Başlangıç 299 TL + dakika " + dkdAnyelaFormatTry(dkdAnyelaMinuteTotal) + " + sesli " + dkdAnyelaFormatTry(dkdAnyelaVoiceTotal) + " + video " + dkdAnyelaFormatTry(dkdAnyelaVideoTotal) + " + görsel " + dkdAnyelaFormatTry(dkdAnyelaPhotoTotal) + ".";
      }
    }

    [dkdAnyelaMinuteRange, dkdAnyelaVoiceRange, dkdAnyelaVideoRange, dkdAnyelaPhotoRange, dkdAnyelaPrioritySelect].forEach(function dkdAnyelaBindOffer(dkdAnyelaOfferInput) {
      if (dkdAnyelaOfferInput) {
        dkdAnyelaOfferInput.addEventListener("input", dkdAnyelaCalculateOffer);
        dkdAnyelaOfferInput.addEventListener("change", dkdAnyelaCalculateOffer);
      }
    });

    dkdAnyelaCalculateOffer();
  }
})();
