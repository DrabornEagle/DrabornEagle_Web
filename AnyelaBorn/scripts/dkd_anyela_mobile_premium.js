import React, { useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const dkd_create = React.createElement;

const dkd_nav_items = [
  { dkd_key: "home", dkd_label: "Ana Sayfa", dkd_icon: "⌂" },
  { dkd_key: "chat", dkd_label: "Sohbet", dkd_icon: "☵" },
  { dkd_key: "requests", dkd_label: "İstekler", dkd_icon: "▦" },
  { dkd_key: "packages", dkd_label: "Paketler", dkd_icon: "🎁" },
  { dkd_key: "profile", dkd_label: "Profil", dkd_icon: "♙" }
];

const dkd_package_items = [
  {
    dkd_icon: "♛",
    dkd_title: "Anyela Intro",
    dkd_price: "$4.99 / ay",
    dkd_lines: ["Hoş geldin mesajı", "Genel güncellemeler", "Fan feed erişimi"],
    dkd_active: true
  },
  {
    dkd_icon: "☵",
    dkd_title: "Özel Sohbet",
    dkd_price: "$19.99 / ay",
    dkd_lines: ["Özel sohbet erişimi", "Öncelikli yanıt", "Sohbet geçmişi"]
  },
  {
    dkd_icon: "▥",
    dkd_title: "Sesli Mesaj",
    dkd_price: "$29.99 / ay",
    dkd_lines: ["Sesli mesajlar", "Kişisel sesli notlar", "Özel içeriklere erişim"]
  },
  {
    dkd_icon: "🎁",
    dkd_title: "VIP Fan Paketi",
    dkd_price: "$49.99 / ay",
    dkd_lines: ["Tüm özellikler", "VIP rozet", "Özel ayrıcalıklar"]
  }
];

function DkdAnyelaApp() {
  const [dkd_active_screen, dkd_set_active_screen] = useState("home");
  const [dkd_chat_text, dkd_set_chat_text] = useState("");

  function dkd_go_screen(dkd_screen_key) {
    if (dkd_screen_key === "requests") {
      dkd_set_active_screen("chat");
      return;
    }

    if (dkd_screen_key === "profile") {
      dkd_set_active_screen("ads");
      return;
    }

    dkd_set_active_screen(dkd_screen_key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function dkd_submit_chat(dkd_form_event) {
    dkd_form_event.preventDefault();
    dkd_set_chat_text("");
  }

  return dkd_create(
    "main",
    { className: "dkd_anyela_app" },
    dkd_active_screen === "home" && dkd_create(DkdHomeScreen, { dkd_go_screen }),
    dkd_active_screen === "chat" && dkd_create(DkdChatScreen, { dkd_chat_text, dkd_set_chat_text, dkd_submit_chat }),
    dkd_active_screen === "packages" && dkd_create(DkdPackagesScreen, null),
    dkd_active_screen === "ads" && dkd_create(DkdAdsScreen, null),
    dkd_create(DkdBottomNav, { dkd_active_screen, dkd_go_screen })
  );
}

function DkdPhoneStatus() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_statusbar" },
    dkd_create("span", null, "9:41"),
    dkd_create("span", { className: "dkd_anyela_phone_icons" }, "▂ ▃ ▅  ◉  ▰")
  );
}

function DkdPhoneAppBar(dkd_props) {
  return dkd_create(
    "div",
    { className: "dkd_anyela_appbar" },
    dkd_create("button", { className: "dkd_anyela_icon_button", onClick: dkd_props.dkd_left_click || null }, dkd_props.dkd_left || "☰"),
    dkd_create("div", { className: "dkd_anyela_phone_logo" }, "ANYELA", dkd_create("span", null, "BORN CLUB")),
    dkd_create("button", { className: "dkd_anyela_icon_button" }, dkd_props.dkd_right || "♧")
  );
}

function DkdHomeScreen(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_scene" },
    dkd_create(DkdBackgroundBrand, { dkd_title: ["Özel.", "Kişisel.", "Premium."], dkd_text: ["En özel içerikler, en", "yakın deneyim.", "Sadece senin için."] }),
    dkd_create(
      "div",
      { className: "dkd_anyela_device" },
      dkd_create(
        "div",
        { className: "dkd_anyela_device_screen" },
        dkd_create(DkdPhoneStatus, null),
        dkd_create(DkdPhoneAppBar, { dkd_left: "☰", dkd_right: "♧" }),
        dkd_create(
          "section",
          { className: "dkd_anyela_hero_card" },
          dkd_create("span", { className: "dkd_anyela_hair" }),
          dkd_create(
            "div",
            { className: "dkd_anyela_hero_copy" },
            dkd_create("p", { className: "dkd_anyela_micro" }, "ANYELA'DAN SANA"),
            dkd_create("h1", { className: "dkd_anyela_hero_title" }, "Hoş geldin."),
            dkd_create("p", { className: "dkd_anyela_hero_text" }, "Bu kulüpte her şey sana özel. Daha yakınız, daha gerçek.")
          )
        ),
        dkd_create(
          "div",
          { className: "dkd_anyela_button_row" },
          dkd_create("button", { className: "dkd_anyela_primary", onClick: function dkd_click_join() { dkd_props.dkd_go_screen("packages"); } }, "♛  Kulübe Katıl"),
          dkd_create("button", { className: "dkd_anyela_secondary", onClick: function dkd_click_packages() { dkd_props.dkd_go_screen("packages"); } }, "Paketleri İncele")
        ),
        dkd_create("p", { className: "dkd_anyela_section_label" }, "SENİN İÇİN"),
        dkd_create(
          "div",
          { className: "dkd_anyela_feature_grid" },
          dkd_create(DkdFeatureCard, { dkd_icon: "☵", dkd_title: "Özel Sohbet", dkd_text: "Doğrudan Anyela ile özel mesajlaş." }),
          dkd_create(DkdFeatureCard, { dkd_icon: "▥", dkd_title: "Sesli Mesaj", dkd_text: "Anyela'dan sana özel sesli mesajlar." }),
          dkd_create(DkdFeatureCard, { dkd_icon: "▧", dkd_title: "Özel Görsel / Video İsteği", dkd_text: "Kişiye özel görsel ve video içerikler." }),
          dkd_create(DkdFeatureCard, { dkd_icon: "🎁", dkd_title: "VIP Fan Paketi", dkd_text: "Özel ayrıcalıklar ve sınırlı içerikler." })
        ),
        dkd_create(
          "section",
          { className: "dkd_anyela_vip_card" },
          dkd_create("div", { className: "dkd_anyela_vip_head" }, dkd_create("i", null, "♛"), dkd_create("strong", null, "VIP ÜYELİK AYRICALIKLARI")),
          dkd_create("ul", { className: "dkd_anyela_checklist" },
            dkd_create("li", null, "Sınırsız sohbet erişimi"),
            dkd_create("li", null, "Özel içeriklere tam erişim"),
            dkd_create("li", null, "Öncelikli yanıt ve ayrıcalıklar")
          )
        )
      )
    ),
    dkd_create(DkdFloatingElements, null)
  );
}

function DkdBackgroundBrand(dkd_props) {
  return dkd_create(
    React.Fragment,
    null,
    dkd_create("div", { className: "dkd_anyela_brand_watermark" }, dkd_create("div", { className: "dkd_anyela_mark" }), dkd_create("div", { className: "dkd_anyela_logo_text" }, "ANYELA", dkd_create("span", null, "BORN CLUB"))),
    dkd_create("div", { className: "dkd_anyela_side_title" }, dkd_props.dkd_title.map(function dkd_render_line(dkd_line_text) { return dkd_create("div", { key: dkd_line_text }, dkd_line_text); })),
    dkd_create("div", { className: "dkd_anyela_side_subtitle" }, dkd_props.dkd_text.map(function dkd_render_text(dkd_line_text) { return dkd_create("div", { key: dkd_line_text }, dkd_line_text); }))
  );
}

function DkdFloatingElements() {
  return dkd_create(
    React.Fragment,
    null,
    dkd_create("div", { className: "dkd_anyela_floating_card dkd_anyela_float_left" }, dkd_create("i", null, "▣"), dkd_create("strong", null, "Güvenli ve gizli deneyim"), dkd_create("p", null, "Tüm verilerin koruma altında.")),
    dkd_create("div", { className: "dkd_anyela_floating_card dkd_anyela_float_right" }, dkd_create("i", null, "♢"), dkd_create("strong", null, "Reklam ve İş Birliği"), dkd_create("p", null, "Profesyonel iş birlikleri için iletişime geç.")),
    dkd_create("div", { className: "dkd_anyela_coin" }, "A"),
    dkd_create("div", { className: "dkd_anyela_bottom_signature" }, dkd_create("b", null, "SADECE ÜYELERE ÖZEL"), dkd_create("span", null, "DAHA YAKIN. DAHA GERÇEK."), dkd_create("div", { className: "dkd_anyela_signature" }, "Anyela ♥")),
    dkd_create("div", { className: "dkd_anyela_member_badge" },
      dkd_create("div", { className: "dkd_anyela_avatars" }, dkd_create("i", { className: "dkd_anyela_avatar_dot" }), dkd_create("i", { className: "dkd_anyela_avatar_dot" }), dkd_create("i", { className: "dkd_anyela_avatar_dot" })),
      dkd_create("div", null, dkd_create("strong", null, "+2.5K ÜYE"), dkd_create("span", null, "KATILAN HERKES AYRICALIKLI."))
    )
  );
}

function DkdFeatureCard(dkd_props) {
  return dkd_create(
    "article",
    { className: "dkd_anyela_feature_card" },
    dkd_create("div", { className: "dkd_anyela_feature_icon" }, dkd_props.dkd_icon),
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("span", null, dkd_props.dkd_text)
  );
}

function DkdChatScreen(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_compact_scene" },
    dkd_create(
      "div",
      { className: "dkd_anyela_page_phone" },
      dkd_create(DkdPhoneStatus, null),
      dkd_create(
        "header",
        { className: "dkd_anyela_page_header" },
        dkd_create("button", { className: "dkd_anyela_icon_button" }, "‹"),
        dkd_create("div", { className: "dkd_anyela_page_title" }, dkd_create("h1", null, "Özel Sohbet 🔒"), dkd_create("p", null, dkd_create("span", { className: "dkd_anyela_online" }, "● "), "Anyela çevrimiçi")),
        dkd_create("button", { className: "dkd_anyela_icon_button" }, "⋮")
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_chat_secure" },
        dkd_create("i", null, "🔒"),
        dkd_create("div", null, dkd_create("strong", null, "Özel Oda"), dkd_create("span", null, "Burada paylaşılan her şey gizlidir. Mesajlar uçtan uca şifrelenir."))
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_chat_list" },
        dkd_create(DkdChatBubble, { dkd_avatar: true, dkd_text: "Hoş geldin aşkım ✨\nBugün senin için özel bir şey hazırladım.", dkd_time: "21:34" }),
        dkd_create(DkdChatBubble, { dkd_user: true, dkd_text: "Gerçekten mi? Çok merak ediyorum... 💙", dkd_time: "21:35 ✓✓" }),
        dkd_create(DkdVoiceMessage, null),
        dkd_create("div", { className: "dkd_anyela_chat_row dkd_anyela_chat_row_user" }, dkd_create("div", { className: "dkd_anyela_media_preview" })),
        dkd_create(DkdChatBubble, { dkd_text: "Sadece seninle paylaşmak istediğim bir an... ✨", dkd_time: "21:39" })
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_media_tools" },
        dkd_create("div", { className: "dkd_anyela_media_hint" }, "Anyela'nın medya isteği gönderebilirsiniz.", dkd_create("button", null, "▧ Medya isteği")),
        dkd_create(
          "div",
          { className: "dkd_anyela_upload_grid" },
          dkd_create(DkdUploadButton, { dkd_icon: "▧", dkd_label: "Fotoğraf yükle", dkd_accept: "image/*" }),
          dkd_create(DkdUploadButton, { dkd_icon: "▶", dkd_label: "Video yükle", dkd_accept: "video/*" }),
          dkd_create(DkdUploadButton, { dkd_icon: "▥", dkd_label: "Ses dosyası", dkd_accept: "audio/*" }),
          dkd_create(DkdUploadButton, { dkd_icon: "▤", dkd_label: "Dekont yükle", dkd_accept: "image/*,.pdf" })
        ),
        dkd_create(
          "form",
          { className: "dkd_anyela_inputbar", onSubmit: dkd_props.dkd_submit_chat },
          dkd_create("span", { className: "dkd_anyela_emoji" }, "☺"),
          dkd_create("input", { value: dkd_props.dkd_chat_text, placeholder: "Mesaj yaz...", onChange: function dkd_change_chat(dkd_event) { dkd_props.dkd_set_chat_text(dkd_event.target.value); } }),
          dkd_create("button", { type: "submit" }, "Gönder")
        )
      )
    )
  );
}

function DkdChatBubble(dkd_props) {
  return dkd_create(
    "div",
    { className: dkd_props.dkd_user ? "dkd_anyela_chat_row dkd_anyela_chat_row_user" : "dkd_anyela_chat_row" },
    dkd_props.dkd_avatar && dkd_create("span", { className: "dkd_anyela_mini_avatar" }),
    dkd_create("div", { className: dkd_props.dkd_user ? "dkd_anyela_message dkd_anyela_message_user" : "dkd_anyela_message" }, dkd_props.dkd_text, dkd_create("small", null, dkd_props.dkd_time))
  );
}

function DkdVoiceMessage() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_chat_row" },
    dkd_create("span", { className: "dkd_anyela_mini_avatar" }),
    dkd_create(
      "div",
      { className: "dkd_anyela_message dkd_anyela_audio" },
      dkd_create("span", { className: "dkd_anyela_play" }, "▶"),
      dkd_create("span", { className: "dkd_anyela_wave" }, dkd_create("i", null), dkd_create("i", null), dkd_create("i", null), dkd_create("i", null), dkd_create("i", null), dkd_create("i", null), dkd_create("i", null), dkd_create("i", null), dkd_create("i", null)),
      dkd_create("span", null, "0:28")
    )
  );
}

function DkdUploadButton(dkd_props) {
  return dkd_create(
    "label",
    { className: "dkd_anyela_upload" },
    dkd_create("input", { type: "file", accept: dkd_props.dkd_accept }),
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("span", null, dkd_props.dkd_label)
  );
}

function DkdPackagesScreen() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_compact_scene" },
    dkd_create(
      "div",
      { className: "dkd_anyela_page_phone" },
      dkd_create(DkdPhoneStatus, null),
      dkd_create(DkdPhoneAppBar, { dkd_left: "‹", dkd_right: "♧" }),
      dkd_create("div", { className: "dkd_anyela_page_title" }, dkd_create("h1", null, "Paketini Seç"), dkd_create("p", null, "Deneyimine en uygun paketi seç ve üyeliğini başlat.")),
      dkd_create(
        "section",
        { className: "dkd_anyela_package_grid" },
        dkd_package_items.map(function dkd_render_package(dkd_package) {
          return dkd_create(DkdPackageCard, { key: dkd_package.dkd_title, dkd_package });
        })
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_payment_card" },
        dkd_create("div", { className: "dkd_anyela_payment_title" }, "🏦 IBAN ile Havale", dkd_create("em", null, "Manuel Ödeme")),
        dkd_create(DkdField, { dkd_label: "IBAN", dkd_value: "DE12 3456 7890 1234 5678 90", dkd_button: "Kopyala" }),
        dkd_create(DkdField, { dkd_label: "Alıcı", dkd_value: "Anyela Born Club Ltd.", dkd_button: "ABC-123456" })
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_payment_card dkd_anyela_receipt_area" },
        dkd_create("div", { className: "dkd_anyela_payment_title" }, "Dekont Yükle"),
        dkd_create("div", { className: "dkd_anyela_upload_area" }, dkd_create("i", null, "☁"), dkd_create("div", null, dkd_create("strong", null, "Dekontunu buraya sürükle veya yükle"), dkd_create("span", null, "JPG, PNG veya PDF (Maks. 10MB)")), dkd_create("button", null, "Dosya Seç"))
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_payment_card" },
        dkd_create("div", { className: "dkd_anyela_payment_title" }, "Sipariş Durumu"),
        dkd_create("div", { className: "dkd_anyela_timeline" },
          dkd_create(DkdTimeline, { dkd_active: true, dkd_icon: "✓", dkd_title: "Siparişi Tamamla", dkd_text: "Ödemenizi yapın ve dekontunuzu yükleyin." }),
          dkd_create(DkdTimeline, { dkd_icon: "●", dkd_title: "İnceleme Aşaması", dkd_text: "Ödeme onayı bekleniyor." }),
          dkd_create(DkdTimeline, { dkd_icon: "🔒", dkd_title: "Erişim Açılacak", dkd_text: "Onay sonrası üyelik erişiminiz aktif olacak." })
        )
      ),
      dkd_create("button", { className: "dkd_anyela_gold_button", style: { width: "100%", marginTop: "12px" } }, "Siparişi Tamamla  ›")
    )
  );
}

function DkdPackageCard(dkd_props) {
  const dkd_package = dkd_props.dkd_package;

  return dkd_create(
    "article",
    { className: dkd_package.dkd_active ? "dkd_anyela_package_card dkd_anyela_package_card_active" : "dkd_anyela_package_card" },
    dkd_package.dkd_active && dkd_create("span", { className: "dkd_anyela_package_badge" }, "ÖNERİLEN"),
    dkd_create("i", { className: "dkd_anyela_package_icon" }, dkd_package.dkd_icon),
    dkd_create("strong", null, dkd_package.dkd_title),
    dkd_create("b", null, dkd_package.dkd_price),
    dkd_package.dkd_lines.map(function dkd_render_line(dkd_line) { return dkd_create("span", { key: dkd_line }, "✓ " + dkd_line); }),
    dkd_create("button", null, dkd_package.dkd_active ? "Seçildi ✓" : "Seç")
  );
}

function DkdField(dkd_props) {
  return dkd_create(
    "div",
    { className: "dkd_anyela_field" },
    dkd_create("div", null, dkd_create("span", null, dkd_props.dkd_label), dkd_create("strong", null, dkd_props.dkd_value)),
    dkd_create("button", null, dkd_props.dkd_button)
  );
}

function DkdTimeline(dkd_props) {
  return dkd_create(
    "div",
    { className: dkd_props.dkd_active ? "dkd_anyela_timeline_item dkd_anyela_timeline_item_active" : "dkd_anyela_timeline_item" },
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("div", null, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text))
  );
}

function DkdAdsScreen() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_compact_scene" },
    dkd_create(
      "div",
      { className: "dkd_anyela_page_phone" },
      dkd_create(DkdPhoneStatus, null),
      dkd_create(DkdPhoneAppBar, { dkd_left: "☰", dkd_right: "♧" }),
      dkd_create(
        "section",
        { className: "dkd_anyela_ad_hero" },
        dkd_create(
          "div",
          { className: "dkd_anyela_ad_hero_content" },
          dkd_create("h1", null, "ANYELA REKLAM YÜZÜNÜZ OLSUN"),
          dkd_create("p", null, "Markanızı doğru kitleyle buluşturun. Güven. Etki. Dönüşüm."),
          dkd_create("button", { className: "dkd_anyela_primary" }, "Marka İş Birliği")
        )
      ),
      dkd_create("p", { className: "dkd_anyela_section_label" }, "REKLAM PAKETLERİ"),
      dkd_create(
        "section",
        { className: "dkd_anyela_ad_grid" },
        dkd_create(DkdAdCard, { dkd_title: "MİNİ PAKET", dkd_price: "$2.499", dkd_text: "1 Adet Paylaşım\nStory Serisi (3)\nMarka Etiketi" }),
        dkd_create(DkdAdCard, { dkd_active: true, dkd_title: "STANDART PAKET", dkd_price: "$4.999", dkd_text: "Feed Paylaşımı\nReels (15-30sn)\nPerformans Raporu" }),
        dkd_create(DkdAdCard, { dkd_title: "PRO PAKET", dkd_price: "$9.999", dkd_text: "Reels (30-60sn)\nÖzel İçerik\nDetaylı Analiz" })
      ),
      dkd_create(
        "section",
        { className: "dkd_anyela_metric_grid" },
        dkd_create(DkdMetricCard, { dkd_title: "HEDEF KİTLE", dkd_items: [["78%", "Kadın"], ["65%", "18-34 Yaş"], ["92%", "Yüksek Etkileşim"]] }),
        dkd_create(DkdMetricCard, { dkd_title: "PERFORMANS ÖZETİ", dkd_items: [["2.3M+", "Toplam Erişim"], ["98%", "Etkileşim"], ["250+", "İş Birliği"]] })
      ),
      dkd_create("section", { className: "dkd_anyela_payment_card" }, dkd_create("div", { className: "dkd_anyela_payment_title" }, "🤝 İş Birliği Fırsatları"), dkd_create("p", { style: { margin: 0, color: "rgba(255,250,240,0.68)", fontSize: "12px" } }, "Markanız için en uygun iş birliği fırsatlarını keşfedin.")),
      dkd_create(
        "section",
        { className: "dkd_anyela_media_kit" },
        dkd_create("div", { className: "dkd_anyela_media_thumb" }),
        dkd_create("div", null, dkd_create("strong", null, "Anyela Born Club Medya Kiti"), dkd_create("span", null, "İstatistikler, kitle analizleri ve iş birliği detayları."), dkd_create("button", { className: "dkd_anyela_dark_button", style: { minHeight: "30px", padding: "0 12px", fontSize: "10px" } }, "Medya Kitini İndir ↓"))
      ),
      dkd_create("div", { className: "dkd_anyela_ad_actions" }, dkd_create("button", { className: "dkd_anyela_dark_button" }, "İletişime Geç"), dkd_create("button", { className: "dkd_anyela_gold_button" }, "Teklif Al"))
    )
  );
}

function DkdAdCard(dkd_props) {
  return dkd_create(
    "article",
    { className: dkd_props.dkd_active ? "dkd_anyela_ad_card dkd_anyela_ad_card_active" : "dkd_anyela_ad_card" },
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("b", null, dkd_props.dkd_price),
    dkd_props.dkd_text.split("\n").map(function dkd_render_line(dkd_line) { return dkd_create("span", { key: dkd_line }, "• " + dkd_line); })
  );
}

function DkdMetricCard(dkd_props) {
  return dkd_create(
    "article",
    { className: "dkd_anyela_metric_card" },
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("div", { className: "dkd_anyela_metric_stats" },
      dkd_props.dkd_items.map(function dkd_render_metric(dkd_metric_item) {
        return dkd_create("div", { key: dkd_metric_item[0] }, dkd_create("b", null, dkd_metric_item[0]), dkd_create("span", null, dkd_metric_item[1]));
      })
    )
  );
}

function DkdBottomNav(dkd_props) {
  return dkd_create(
    "nav",
    { className: "dkd_anyela_nav" },
    dkd_nav_items.map(function dkd_render_nav(dkd_nav_item) {
      const dkd_is_active =
        dkd_props.dkd_active_screen === dkd_nav_item.dkd_key ||
        (dkd_props.dkd_active_screen === "ads" && dkd_nav_item.dkd_key === "profile");

      return dkd_create(
        "button",
        {
          key: dkd_nav_item.dkd_key,
          className: dkd_is_active ? "dkd_anyela_nav_button dkd_anyela_nav_button_active" : "dkd_anyela_nav_button",
          onClick: function dkd_click_nav() { dkd_props.dkd_go_screen(dkd_nav_item.dkd_key); }
        },
        dkd_create("i", null, dkd_nav_item.dkd_icon),
        dkd_create("span", null, dkd_nav_item.dkd_label)
      );
    })
  );
}

createRoot(document.getElementById("dkd_anyela_root")).render(dkd_create(DkdAnyelaApp));
