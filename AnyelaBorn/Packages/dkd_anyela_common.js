const dkd_formatter = new Intl.NumberFormat("tr-TR");

function dkd_money(dkd_amount) {
  return `${dkd_formatter.format(Number(dkd_amount || 0))} TL`;
}

function dkd_get_element(dkd_id) {
  return document.getElementById(dkd_id);
}

function dkd_show_toast(dkd_message) {
  const dkd_toast = dkd_get_element("dkd_toast");
  if (!dkd_toast) {
    return;
  }
  dkd_toast.textContent = dkd_message;
  dkd_toast.dataset.dkdOpen = "true";
  window.clearTimeout(dkd_show_toast.dkd_timeout_id);
  dkd_show_toast.dkd_timeout_id = window.setTimeout(() => {
    dkd_toast.dataset.dkdOpen = "false";
  }, 3400);
}

async function dkd_copy_text(dkd_text, dkd_success_message) {
  try {
    await navigator.clipboard.writeText(dkd_text);
    dkd_show_toast(dkd_success_message);
  } catch (dkd_copy_error) {
    dkd_show_toast(dkd_text);
  }
}

function dkd_bind_payment_screen() {
  const dkd_copy_iban_button = dkd_get_element("dkd_copy_iban_btn");
  const dkd_receipt_input = dkd_get_element("dkd_receipt_file");
  const dkd_submit_button = dkd_get_element("dkd_submit_receipt_btn");
  const dkd_customer_name_input = dkd_get_element("dkd_customer_name");
  const dkd_payment_note_input = dkd_get_element("dkd_customer_note");

  if (dkd_copy_iban_button) {
    dkd_copy_iban_button.addEventListener("click", () => {
      const dkd_iban_text = dkd_get_element("dkd_iban_text").textContent.trim();
      dkd_copy_text(dkd_iban_text, "IBAN kopyalandı.");
    });
  }

  if (dkd_customer_name_input && dkd_payment_note_input) {
    dkd_customer_name_input.addEventListener("input", () => {
      const dkd_current_name = dkd_customer_name_input.value.trim() || "Ad Soyad";
      const dkd_current_package = dkd_payment_note_input.dataset.dkdPackageName || "Paket Adı";
      dkd_payment_note_input.value = `ANYELA - ${dkd_current_name} - ${dkd_current_package}`;
    });
  }

  if (dkd_receipt_input) {
    dkd_receipt_input.addEventListener("change", () => {
      const dkd_file = dkd_receipt_input.files && dkd_receipt_input.files[0];
      if (dkd_file) {
        dkd_get_element("dkd_receipt_status").textContent = `Seçilen dekont: ${dkd_file.name}. Dekont onayından sonra kısa süre içerisinde onaylanacaktır.`;
        dkd_show_toast("Dekont seçildi. Onaya gönder butonuna dokunabilirsin.");
      }
    });
  }

  if (dkd_submit_button) {
    dkd_submit_button.addEventListener("click", () => {
      const dkd_has_file = dkd_receipt_input && dkd_receipt_input.files && dkd_receipt_input.files.length > 0;
      if (!dkd_has_file) {
        dkd_show_toast("Önce dekont dosyasını seçmelisin.");
        return;
      }
      dkd_show_toast("Dekont onay talebi hazırlandı. Onaydan sonra kısa süre içerisinde paket aktif edilecektir.");
    });
  }
}

function dkd_bind_offer_screen() {
  const dkd_offer_form = dkd_get_element("dkd_offer_form");
  if (!dkd_offer_form) {
    return;
  }

  const dkd_select_ids = [
    "dkd_offer_minutes",
    "dkd_offer_voice_count",
    "dkd_offer_video_count",
    "dkd_offer_photo_count",
    "dkd_offer_priority"
  ];

  function dkd_calculate_offer() {
    const dkd_minutes = Number(dkd_get_element("dkd_offer_minutes").value || 0);
    const dkd_voice_count = Number(dkd_get_element("dkd_offer_voice_count").value || 0);
    const dkd_video_count = Number(dkd_get_element("dkd_offer_video_count").value || 0);
    const dkd_photo_count = Number(dkd_get_element("dkd_offer_photo_count").value || 0);
    const dkd_priority_price = Number(dkd_get_element("dkd_offer_priority").value || 0);

    const dkd_base_price = 199;
    const dkd_minutes_price = dkd_minutes * 15;
    const dkd_voice_price = dkd_voice_count * 149;
    const dkd_video_price = dkd_video_count * 799;
    const dkd_photo_price = dkd_photo_count * 199;
    const dkd_raw_total = dkd_base_price + dkd_minutes_price + dkd_voice_price + dkd_video_price + dkd_photo_price + dkd_priority_price;
    const dkd_rounded_total = Math.ceil(dkd_raw_total / 10) * 10;

    dkd_get_element("dkd_offer_total_text").textContent = dkd_money(dkd_rounded_total);
    dkd_get_element("dkd_breakdown_base").textContent = dkd_money(dkd_base_price);
    dkd_get_element("dkd_breakdown_minutes").textContent = dkd_money(dkd_minutes_price);
    dkd_get_element("dkd_breakdown_voice").textContent = dkd_money(dkd_voice_price);
    dkd_get_element("dkd_breakdown_video").textContent = dkd_money(dkd_video_price);
    dkd_get_element("dkd_breakdown_photo").textContent = dkd_money(dkd_photo_price);
    dkd_get_element("dkd_breakdown_priority").textContent = dkd_money(dkd_priority_price);

    const dkd_offer_detail = `${dkd_minutes} dk sohbet + ${dkd_voice_count} sesli cevap + ${dkd_video_count} video mesaj + ${dkd_photo_count} özel görsel`;
    dkd_get_element("dkd_order_detail").textContent = dkd_offer_detail;
    dkd_get_element("dkd_order_amount").textContent = dkd_money(dkd_rounded_total);
    dkd_get_element("dkd_customer_note").dataset.dkdPackageName = "Özel Teklif";
  }

  for (const dkd_select_id of dkd_select_ids) {
    dkd_get_element(dkd_select_id).addEventListener("change", dkd_calculate_offer);
  }

  const dkd_prepare_button = dkd_get_element("dkd_prepare_offer_payment_btn");
  dkd_prepare_button.addEventListener("click", () => {
    const dkd_note = dkd_get_element("dkd_offer_note").value.trim();
    dkd_get_element("dkd_order_name").textContent = "Özel Teklif";
    if (dkd_note) {
      dkd_get_element("dkd_order_detail").textContent = `${dkd_get_element("dkd_order_detail").textContent} — ${dkd_note}`;
    }
    dkd_get_element("dkd_payment_panel").scrollIntoView({ behavior: "smooth", block: "start" });
    dkd_show_toast("Özel teklif ödeme ekranı hazırlandı.");
  });

  dkd_calculate_offer();
}

window.addEventListener("DOMContentLoaded", () => {
  dkd_bind_payment_screen();
  dkd_bind_offer_screen();
});
