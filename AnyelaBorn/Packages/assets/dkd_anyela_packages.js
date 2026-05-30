(function dkd_anyelaPackageSystem() {
  const dkd_formatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });

  const dkd_paymentData = {
    iban: "TR53 0011 1000 0000 0151 1527 14",
    owner: "Doğancan Kartal",
  };

  const dkd_packageConfig = {
    mini: {
      name: "Mini Sohbet Paketi",
      price: 499,
      minutes: 20,
      badge: "Günlük kısa mesajlaşma",
      delivery: "Aynı gün içinde dönüş",
      voice: "Yok",
      video: "Yok",
      photos: "Yok",
      title: "Mini Sohbet Paketi",
      subtitle: "Anyela ile hızlı, sıcak ve kontrollü bir tanışma sohbeti.",
      features: [
        "20 dakika yazılı sohbet hakkı",
        "Site içi özel sohbet ekranı açılır",
        "Günlük kısa mesajlaşma ve özel yanıt hissi",
        "Kıyafet, oyun, anime, Miami/Dubai konsepti gibi hafif sohbet konuları",
        "Dekont onayından sonra chat erişimi kısa süre içinde açılır",
      ],
    },
    voice: {
      name: "Sesli Mesaj Paketi",
      price: 999,
      minutes: 30,
      badge: "Sesli cevap deneyimi",
      delivery: "Aynı gün / yoğunluğa göre sırayla",
      voice: "5 adet Anyela sesli cevap",
      video: "Yok",
      photos: "Yok",
      title: "Sesli Mesaj Paketi",
      subtitle: "Yazışmak istemeyenler için Anyela tarzında sesli mesaj deneyimi.",
      features: [
        "30 dakika aktif sesli mesajlaşma akışı",
        "5 adet kişiye özel Anyela sesli cevap hakkı",
        "Kullanıcı sesli not gönderebilir, cevap ses dosyası olarak teslim edilir",
        "ElevenLabs tarzı ses üretimiyle premium his veren teslim modeli",
        "Dekont onayından sonra sesli mesaj alanı kısa süre içinde aktif edilir",
      ],
    },
    vip: {
      name: "VIP Özel İçerik",
      price: 1499,
      minutes: 45,
      badge: "Premium fotoğraf ve içerik",
      delivery: "Öncelikli sıra",
      voice: "2 adet sesli cevap",
      video: "Opsiyonel teklif",
      photos: "5 özel görsel konsepti",
      title: "VIP Özel İçerik",
      subtitle: "Kişiye özel Anyela konsepti, görsel fikir ve premium içerik paketi.",
      features: [
        "45 dakika konsept planlama ve yazılı sohbet",
        "5 adet özel Anyela görsel/konsept teslim hakkı",
        "2 adet kısa kişisel sesli cevap hakkı",
        "Kıyafet, mekan, poz ve sosyal medya açıklama fikri hazırlanır",
        "Teslimler özel chat ekranından paylaşılır; onay süreci dekonttan sonra başlar",
      ],
    },
    full: {
      name: "Full Premium Paket",
      price: 1999,
      minutes: 60,
      badge: "En çok tercih edilen",
      delivery: "VIP öncelik",
      voice: "6 adet sesli cevap",
      video: "1 kısa video mesaj konsepti",
      photos: "8 özel görsel konsepti",
      title: "Full Premium Paket",
      subtitle: "Sohbet, sesli mesaj ve özel içeriklerin tamamını tek pakette toplayan Miami premium deneyimi.",
      features: [
        "60 dakika yazılı sohbet ve özel yönlendirme",
        "6 adet kişiye özel Anyela sesli cevap hakkı",
        "8 adet özel görsel/konsept teslim hakkı",
        "1 adet kısa video mesaj veya konuşmalı video konsept planı",
        "VIP öncelikli kontrol ve teslim sırası",
        "Dekont onayından sonra kısa süre içerisinde onaylanacaktır bilgisi kullanıcıya gösterilir",
      ],
    },
  };

  function dkd_byId(dkd_elementId) {
    return document.getElementById(dkd_elementId);
  }

  function dkd_setText(dkd_elementId, dkd_textValue) {
    const dkd_element = dkd_byId(dkd_elementId);
    if (dkd_element) {
      dkd_element.textContent = dkd_textValue;
    }
  }

  function dkd_renderPackageDetail() {
    const dkd_screenNode = dkd_byId("dkd-package-screen");
    if (!dkd_screenNode) {
      return;
    }

    const dkd_packageKey = dkd_screenNode.dataset.packageKey;
    const dkd_packageData = dkd_packageConfig[dkd_packageKey] || dkd_packageConfig.mini;

    document.title = `${dkd_packageData.name} | Anyela Born Miami Style Club`;
    dkd_setText("dkd-package-title", dkd_packageData.title);
    dkd_setText("dkd-package-subtitle", dkd_packageData.subtitle);
    dkd_setText("dkd-package-kicker", dkd_packageData.badge);
    dkd_setText("dkd-package-price", dkd_formatter.format(dkd_packageData.price));
    dkd_setText("dkd-package-minutes", `${dkd_packageData.minutes} dakika`);
    dkd_setText("dkd-package-delivery", dkd_packageData.delivery);
    dkd_setText("dkd-package-voice", dkd_packageData.voice);
    dkd_setText("dkd-package-video", dkd_packageData.video);
    dkd_setText("dkd-package-photos", dkd_packageData.photos);
    dkd_setText("dkd-payment-package", dkd_packageData.name);
    dkd_setText("dkd-payment-price", dkd_formatter.format(dkd_packageData.price));

    const dkd_featureList = dkd_byId("dkd-package-features");
    if (dkd_featureList) {
      dkd_featureList.innerHTML = "";
      dkd_packageData.features.forEach(function dkd_appendFeature(dkd_featureText) {
        const dkd_itemNode = document.createElement("li");
        dkd_itemNode.textContent = dkd_featureText;
        dkd_featureList.appendChild(dkd_itemNode);
      });
    }

    const dkd_packageInput = dkd_byId("dkd-selected-package");
    if (dkd_packageInput) {
      dkd_packageInput.value = dkd_packageData.name;
    }
  }

  function dkd_copyPaymentText() {
    const dkd_copyButtons = document.querySelectorAll("[data-dkd-copy-payment]");
    dkd_copyButtons.forEach(function dkd_prepareCopyButton(dkd_buttonNode) {
      dkd_buttonNode.addEventListener("click", function dkd_handleCopyClick() {
        const dkd_paymentText = `IBAN: ${dkd_paymentData.iban}\nAd Soyad: ${dkd_paymentData.owner}`;
        navigator.clipboard.writeText(dkd_paymentText).then(function dkd_afterCopy() {
          dkd_buttonNode.textContent = "IBAN kopyalandı ✓";
          window.setTimeout(function dkd_resetCopyButton() {
            dkd_buttonNode.textContent = "IBAN + Ad Soyad Kopyala";
          }, 1800);
        }).catch(function dkd_copyFallback() {
          dkd_buttonNode.textContent = "Kopyalama için IBAN'ı seç";
        });
      });
    });
  }

  function dkd_prepareReceiptInputs() {
    const dkd_receiptInputs = document.querySelectorAll("[data-dkd-receipt-input]");
    dkd_receiptInputs.forEach(function dkd_bindReceiptInput(dkd_inputNode) {
      dkd_inputNode.addEventListener("change", function dkd_handleReceiptChange() {
        const dkd_previewTarget = document.querySelector(`[data-dkd-receipt-preview="${dkd_inputNode.dataset.dkdReceiptInput}"]`);
        const dkd_fileData = dkd_inputNode.files && dkd_inputNode.files[0];
        if (dkd_previewTarget && dkd_fileData) {
          const dkd_fileSizeKb = Math.ceil(dkd_fileData.size / 1024);
          dkd_previewTarget.textContent = `${dkd_fileData.name} seçildi • ${dkd_fileSizeKb} KB`;
        }
      });
    });
  }

  function dkd_prepareLocalSubmit() {
    const dkd_forms = document.querySelectorAll("[data-dkd-local-submit]");
    dkd_forms.forEach(function dkd_bindLocalForm(dkd_formNode) {
      dkd_formNode.addEventListener("submit", function dkd_handleLocalFormSubmit(dkd_event) {
        dkd_event.preventDefault();
        const dkd_statusNode = dkd_formNode.querySelector("[data-dkd-submit-status]");
        if (dkd_statusNode) {
          dkd_statusNode.textContent = "Dekont talebin hazırlandı. Onaydan sonra kısa süre içerisinde erişim açılacaktır.";
        }
      });
    });
  }

  function dkd_calculateOfferTotal() {
    const dkd_minutesNode = dkd_byId("dkd-offer-minutes");
    const dkd_voiceNode = dkd_byId("dkd-offer-voice");
    const dkd_videoNode = dkd_byId("dkd-offer-video");
    const dkd_photoNode = dkd_byId("dkd-offer-photo");
    const dkd_speedNode = dkd_byId("dkd-offer-speed");
    const dkd_usageNode = dkd_byId("dkd-offer-usage");

    if (!dkd_minutesNode || !dkd_voiceNode || !dkd_videoNode || !dkd_photoNode || !dkd_speedNode || !dkd_usageNode) {
      return;
    }

    const dkd_minutes = Number(dkd_minutesNode.value);
    const dkd_voiceCount = Number(dkd_voiceNode.value);
    const dkd_videoCount = Number(dkd_videoNode.value);
    const dkd_photoCount = Number(dkd_photoNode.value);
    const dkd_basePrice = 199;
    const dkd_minutePrice = dkd_minutes * 18;
    const dkd_voicePrice = dkd_voiceCount * 140;
    const dkd_videoPrice = dkd_videoCount * 650;
    const dkd_photoPrice = dkd_photoCount * 220;
    const dkd_subtotal = dkd_basePrice + dkd_minutePrice + dkd_voicePrice + dkd_videoPrice + dkd_photoPrice;
    const dkd_speedMultiplier = Number(dkd_speedNode.value);
    const dkd_usageMultiplier = Number(dkd_usageNode.value);
    const dkd_multiplierTotal = dkd_subtotal * dkd_speedMultiplier * dkd_usageMultiplier;
    const dkd_discountRate = dkd_multiplierTotal >= 4500 ? 0.08 : dkd_multiplierTotal >= 2500 ? 0.05 : 0;
    const dkd_discountAmount = Math.round(dkd_multiplierTotal * dkd_discountRate);
    const dkd_total = Math.max(249, Math.round(dkd_multiplierTotal - dkd_discountAmount));

    dkd_setText("dkd-minutes-value", `${dkd_minutes} dk`);
    dkd_setText("dkd-voice-value", `${dkd_voiceCount} adet`);
    dkd_setText("dkd-video-value", `${dkd_videoCount} adet`);
    dkd_setText("dkd-photo-value", `${dkd_photoCount} adet`);
    dkd_setText("dkd-breakdown-base", dkd_formatter.format(dkd_basePrice));
    dkd_setText("dkd-breakdown-minutes", dkd_formatter.format(dkd_minutePrice));
    dkd_setText("dkd-breakdown-voice", dkd_formatter.format(dkd_voicePrice));
    dkd_setText("dkd-breakdown-video", dkd_formatter.format(dkd_videoPrice));
    dkd_setText("dkd-breakdown-photo", dkd_formatter.format(dkd_photoPrice));
    dkd_setText("dkd-breakdown-discount", dkd_discountRate > 0 ? `-${dkd_formatter.format(dkd_discountAmount)}` : dkd_formatter.format(0));
    dkd_setText("dkd-offer-total", dkd_formatter.format(dkd_total));
    dkd_setText("dkd-offer-payment-price", dkd_formatter.format(dkd_total));

    const dkd_offerInput = dkd_byId("dkd-selected-offer");
    if (dkd_offerInput) {
      dkd_offerInput.value = `Özel Teklif • ${dkd_minutes} dk • ${dkd_voiceCount} sesli • ${dkd_videoCount} video • ${dkd_photoCount} görsel • ${dkd_formatter.format(dkd_total)}`;
    }
  }

  function dkd_prepareOfferCalculator() {
    const dkd_calculatorNode = dkd_byId("dkd-offer-calculator");
    if (!dkd_calculatorNode) {
      return;
    }

    const dkd_controlNodes = dkd_calculatorNode.querySelectorAll("input, select");
    dkd_controlNodes.forEach(function dkd_bindCalculatorControl(dkd_controlNode) {
      dkd_controlNode.addEventListener("input", dkd_calculateOfferTotal);
      dkd_controlNode.addEventListener("change", dkd_calculateOfferTotal);
    });
    dkd_calculateOfferTotal();
  }

  document.addEventListener("DOMContentLoaded", function dkd_onReady() {
    dkd_renderPackageDetail();
    dkd_copyPaymentText();
    dkd_prepareReceiptInputs();
    dkd_prepareLocalSubmit();
    dkd_prepareOfferCalculator();
  });
})();
