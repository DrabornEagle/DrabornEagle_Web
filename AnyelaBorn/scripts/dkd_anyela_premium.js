import React, { useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const dkd_create = React.createElement;

const dkd_anyela_nav_items = [
  { dkd_key: "home", dkd_icon: "⌂", dkd_label: "Ana Sayfa" },
  { dkd_key: "chat", dkd_icon: "💬", dkd_label: "Sohbet" },
  { dkd_key: "orders", dkd_icon: "♢", dkd_label: "Paketler" },
  { dkd_key: "ads", dkd_icon: "◇", dkd_label: "Reklam" },
  { dkd_key: "profile", dkd_icon: "♙", dkd_label: "Profil" }
];

const dkd_anyela_packages = [
  { dkd_badge: "ANYELA\nINTRO", dkd_title: "Anyela Intro", dkd_text: "Kulübe giriş paketi", dkd_price: "₺149 /aylık", dkd_icon: "♕" },
  { dkd_badge: "PRIVATE\nCHAT", dkd_title: "Private Chat", dkd_text: "Özel sohbet paketi", dkd_price: "₺349 /aylık", dkd_icon: "💬" },
  { dkd_badge: "VOICE\nMESSAGE", dkd_title: "Voice Message", dkd_text: "Sesli mesaj paketi", dkd_price: "₺249 /aylık", dkd_icon: "≋" },
  { dkd_badge: "VIP\nFAN PACK", dkd_title: "VIP Fan Pack", dkd_text: "Tüm ayrıcalıklar", dkd_price: "₺899 /aylık", dkd_icon: "◆" }
];

function DkdAnyelaApp() {
  const [dkd_active_screen, dkd_set_active_screen] = useState("home");
  const [dkd_chat_input, dkd_set_chat_input] = useState("");

  function dkd_go_screen(dkd_screen_key) {
    dkd_set_active_screen(dkd_screen_key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return dkd_create(
    "main",
    { className: "dkd_anyela_app" },
    dkd_create(
      "div",
      { className: "dkd_anyela_phone_frame" },
      dkd_active_screen === "home" && dkd_create(DkdAnyelaHome, { dkd_go_screen }),
      dkd_active_screen === "chat" &&
        dkd_create(DkdAnyelaChat, {
          dkd_chat_input,
          dkd_set_chat_input
        }),
      dkd_active_screen === "orders" && dkd_create(DkdAnyelaOrders, null),
      dkd_active_screen === "ads" && dkd_create(DkdAnyelaAds, null),
      dkd_active_screen === "profile" && dkd_create(DkdAnyelaProfile, null)
    ),
    dkd_create(DkdAnyelaNav, { dkd_active_screen, dkd_go_screen })
  );
}

function DkdAnyelaTopbar() {
  return dkd_create(
    "header",
    { className: "dkd_anyela_topbar" },
    dkd_create("button", { className: "dkd_anyela_circle_button", type: "button" }, "☰"),
    dkd_create(
      "div",
      { className: "dkd_anyela_brand_center" },
      dkd_create("span", { className: "dkd_anyela_brand_word" }, "ANYELA"),
      dkd_create("span", { className: "dkd_anyela_brand_sub" }, "BORN CLUB")
    ),
    dkd_create("button", { className: "dkd_anyela_circle_button", type: "button" }, "♕")
  );
}

function DkdAnyelaHome(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(DkdAnyelaTopbar, null),
    dkd_create(
      "section",
      { className: "dkd_anyela_hero" },
      dkd_create("div", { className: "dkd_anyela_hero_visual" }),
      dkd_create(
        "div",
        { className: "dkd_anyela_hero_content" },
        dkd_create("p", { className: "dkd_anyela_kicker" }, "Anyela Born Club"),
        dkd_create("h1", { className: "dkd_anyela_title" }, "Daha Fazlası", dkd_create("em", null, "Sana Özel")),
        dkd_create("div", { className: "dkd_anyela_ornament" }, "✧"),
        dkd_create(
          "p",
          { className: "dkd_anyela_hero_text" },
          "Anyela ile bağ kurmanın en özel hali. Gerçek etkileşim. Gerçek ayrıcalık. Sadece burada."
        ),
        dkd_create(
          "div",
          { className: "dkd_anyela_button_stack" },
          dkd_create(
            "button",
            {
              className: "dkd_anyela_primary_button",
              type: "button",
              onClick: function dkd_home_join() {
                dkd_props.dkd_go_screen("orders");
              }
            },
            dkd_create("span", null, "♕"),
            dkd_create("span", null, "Kulübe Katıl"),
            dkd_create("span", null, "→")
          ),
          dkd_create(
            "button",
            {
              className: "dkd_anyela_secondary_button",
              type: "button",
              onClick: function dkd_home_packages() {
                dkd_props.dkd_go_screen("orders");
              }
            },
            dkd_create("span", null, "✦"),
            dkd_create("span", null, "Paketleri İncele"),
            dkd_create("span", null, "→")
          )
        )
      ),
      dkd_create(
        "div",
        { className: "dkd_anyela_member_badge" },
        dkd_create(
          "div",
          { className: "dkd_anyela_avatar_stack" },
          dkd_create("div", { className: "dkd_anyela_small_avatar" }, "A"),
          dkd_create("div", { className: "dkd_anyela_small_avatar" }, "B"),
          dkd_create("div", { className: "dkd_anyela_small_avatar" }, "C")
        ),
        dkd_create("div", null, dkd_create("strong", null, "10K+"), dkd_create("span", null, "Mutlu Üye"))
      )
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_feature_grid" },
      dkd_create(DkdAnyelaFeature, { dkd_icon: "💬", dkd_title: "Özel Sohbet", dkd_text: "Anyela ile birebir sohbet et" }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "≋", dkd_title: "Sesli Mesaj", dkd_text: "Sana özel sesli mesajlar gönderir" }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "▣", dkd_title: "Fotoğraf / Video İsteği", dkd_text: "Özel isteklerini iletebilirsin" }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "🎁", dkd_title: "VIP Fan Paketi", dkd_text: "Sürpriz hediyeler ve özel içerikler", dkd_wide: true }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "🛡", dkd_title: "Güvenli Ödeme", dkd_text: "Tüm ödemeleriniz güvenle korunur", dkd_wide: true })
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_section_title" },
      dkd_create("h2", null, "Paketler"),
      dkd_create("button", { type: "button", onClick: function dkd_view_all() { dkd_props.dkd_go_screen("orders"); } }, "Tümünü Gör", "›")
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_packages_home" },
      dkd_anyela_packages.map(function dkd_render_home_package(dkd_package_item) {
        return dkd_create(DkdAnyelaPackageCard, { key: dkd_package_item.dkd_title, dkd_package_item });
      })
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_ad_banner" },
      dkd_create("p", null, "Marka İş Birliği"),
      dkd_create("h2", null, "Anyela Reklam Yüzünüz Olsun"),
      dkd_create("span", null, "Markanıza değer katacak özel iş birlikleri için bizimle iletişime geçin."),
      dkd_create(
        "button",
        {
          type: "button",
          onClick: function dkd_ad_details() {
            dkd_props.dkd_go_screen("ads");
          }
        },
        "Detaylı Bilgi  →"
      )
    )
  );
}

function DkdAnyelaFeature(dkd_props) {
  const dkd_card_class = dkd_props.dkd_wide ? "dkd_anyela_feature_card dkd_anyela_wide" : "dkd_anyela_feature_card";

  return dkd_create(
    "article",
    { className: dkd_card_class },
    dkd_create("div", { className: "dkd_anyela_icon_disc" }, dkd_props.dkd_icon),
    dkd_create("div", null, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text))
  );
}

function DkdAnyelaPackageCard(dkd_props) {
  return dkd_create(
    "article",
    { className: "dkd_anyela_package_card" },
    dkd_create("i", null, dkd_props.dkd_package_item.dkd_badge),
    dkd_create("strong", null, dkd_props.dkd_package_item.dkd_title),
    dkd_create("span", null, dkd_props.dkd_package_item.dkd_text),
    dkd_create("b", null, dkd_props.dkd_package_item.dkd_price)
  );
}

function DkdAnyelaChat(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen dkd_anyela_drawer_wrap" },
    dkd_create(
      "header",
      { className: "dkd_anyela_chat_header" },
      dkd_create("button", { className: "dkd_anyela_back_button", type: "button" }, "‹"),
      dkd_create("div", { className: "dkd_anyela_profile_photo" }),
      dkd_create("div", { className: "dkd_anyela_profile_title" }, dkd_create("strong", null, "Anyela ✓"), dkd_create("span", null, dkd_create("i", { className: "dkd_anyela_online_dot" }), "Çevrimiçi")),
      dkd_create("button", { className: "dkd_anyela_menu_button", type: "button" }, "♕"),
      dkd_create("button", { className: "dkd_anyela_menu_button", type: "button" }, "⋮")
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_info_panel" },
      dkd_create(DkdAnyelaInfo, { dkd_icon: "🛡", dkd_title: "Gizli ve Güvenli", dkd_text: "Tüm mesajlar uçtan uca şifrelenir." }),
      dkd_create(DkdAnyelaInfo, { dkd_icon: "☆", dkd_title: "Özel İstek Gönder", dkd_text: "Size özel içerik talep edebilirsiniz." }),
      dkd_create(DkdAnyelaInfo, { dkd_icon: "≋", dkd_title: "Sesli Mesajlaşma", dkd_text: "Yüksek kalite sesli mesajlaşma." }),
      dkd_create(DkdAnyelaInfo, { dkd_icon: "☁", dkd_title: "Dosya Yükleme", dkd_text: "Fotoğraf, video, ses ve dekont gönderebilirsiniz." })
    ),
    dkd_create("div", { className: "dkd_anyela_day_label" }, "Bugün"),
    dkd_create(
      "section",
      { className: "dkd_anyela_chat_body" },
      dkd_create(DkdAnyelaBubble, { dkd_text: "Merhaba güzelim, nasılsın? ✨", dkd_time: "14:30" }),
      dkd_create(DkdAnyelaBubble, { dkd_text: "Merhaba Anyela! Harikayım, sen nasılsın?", dkd_time: "14:31", dkd_user: true }),
      dkd_create(DkdAnyelaVoice, { dkd_time: "14:31" }),
      dkd_create(DkdAnyelaMediaCard, null),
      dkd_create(DkdAnyelaVipCard, null),
      dkd_create(DkdAnyelaVoice, { dkd_time: "14:34", dkd_user: true }),
      dkd_create(DkdAnyelaBubble, { dkd_text: "Harikasın! Beğenmene çok sevindim. 💛", dkd_time: "14:35" }),
      dkd_create(DkdAnyelaBubble, { dkd_text: "Paketlerin harika, teşekkür ederim! 🖤", dkd_time: "14:36", dkd_user: true })
    ),
    dkd_create(DkdAnyelaUploadDrawer, null),
    dkd_create(
      "form",
      {
        className: "dkd_anyela_chat_input",
        onSubmit: function dkd_submit_chat(dkd_event) {
          dkd_event.preventDefault();
          dkd_props.dkd_set_chat_input("");
        }
      },
      dkd_create("button", { type: "button" }, "☺"),
      dkd_create("input", {
        value: dkd_props.dkd_chat_input,
        placeholder: "Mesajınızı yazın...",
        onChange: function dkd_change_input(dkd_event) {
          dkd_props.dkd_set_chat_input(dkd_event.target.value);
        }
      }),
      dkd_create("button", { type: "button" }, "⌕"),
      dkd_create("button", { className: "dkd_anyela_mic_button", type: "submit" }, "🎙")
    )
  );
}

function DkdAnyelaInfo(dkd_props) {
  return dkd_create(
    "article",
    null,
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("div", null, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text))
  );
}

function DkdAnyelaBubble(dkd_props) {
  const dkd_line_class = dkd_props.dkd_user ? "dkd_anyela_chat_line dkd_anyela_chat_line_user" : "dkd_anyela_chat_line";
  const dkd_message_class = dkd_props.dkd_user ? "dkd_anyela_message dkd_anyela_message_user" : "dkd_anyela_message";

  return dkd_create(
    "div",
    { className: dkd_line_class },
    !dkd_props.dkd_user && dkd_create("div", { className: "dkd_anyela_chat_avatar" }),
    dkd_create("div", { className: dkd_message_class }, dkd_props.dkd_text, dkd_create("span", { className: "dkd_anyela_time" }, dkd_props.dkd_time, dkd_props.dkd_user ? " ✓✓" : ""))
  );
}

function DkdAnyelaVoice(dkd_props) {
  const dkd_line_class = dkd_props.dkd_user ? "dkd_anyela_chat_line dkd_anyela_chat_line_user" : "dkd_anyela_chat_line";

  return dkd_create(
    "div",
    { className: dkd_line_class },
    !dkd_props.dkd_user && dkd_create("div", { className: "dkd_anyela_chat_avatar" }),
    dkd_create(
      "div",
      { className: dkd_props.dkd_user ? "dkd_anyela_message dkd_anyela_message_user dkd_anyela_voice_message" : "dkd_anyela_message dkd_anyela_voice_message" },
      dkd_create("div", { className: "dkd_anyela_play" }, "▶"),
      dkd_create(
        "div",
        { className: "dkd_anyela_wave" },
        Array.from({ length: 12 }).map(function dkd_render_wave(dkd_empty_item, dkd_wave_index) {
          return dkd_create("i", { key: "dkd_wave_" + dkd_wave_index });
        })
      ),
      dkd_create("span", null, dkd_props.dkd_user ? "0:17" : "0:28")
    )
  );
}

function DkdAnyelaMediaCard() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_chat_line" },
    dkd_create("div", { className: "dkd_anyela_chat_avatar" }),
    dkd_create(
      "div",
      { className: "dkd_anyela_media_card" },
      dkd_create(
        "div",
        { className: "dkd_anyela_media_visual" },
        dkd_create("div", null, dkd_create("strong", null, "Yeni Fotoğraflar"), dkd_create("span", null, "5 Fotoğraf • Özel Albüm"), dkd_create("button", { className: "dkd_anyela_media_action", type: "button" }, "Görüntüle"))
      )
    )
  );
}

function DkdAnyelaVipCard() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_chat_line" },
    dkd_create("div", { className: "dkd_anyela_chat_avatar" }),
    dkd_create(
      "div",
      { className: "dkd_anyela_vip_card" },
      dkd_create("div", null, dkd_create("span", null, "♕ VIP İçerik"), dkd_create("h3", null, "Özel Video"), dkd_create("p", null, "Sana özel hazırladığım yeni videoyu izle."), dkd_create("button", { className: "dkd_anyela_media_action", type: "button" }, "Hemen İzle")),
      dkd_create("div", { className: "dkd_anyela_vip_thumb" })
    )
  );
}

function DkdAnyelaUploadDrawer() {
  return dkd_create(
    "aside",
    { className: "dkd_anyela_upload_drawer" },
    dkd_create("div", { className: "dkd_anyela_upload_drawer_head" }, dkd_create("strong", null, "Dosya Gönder"), dkd_create("span", null, "×")),
    dkd_create(DkdAnyelaUploadOption, { dkd_icon: "▣", dkd_title: "Fotoğraf", dkd_text: "Galeriden seç" }),
    dkd_create(DkdAnyelaUploadOption, { dkd_icon: "▶", dkd_title: "Video", dkd_text: "Video dosyası seç" }),
    dkd_create(DkdAnyelaUploadOption, { dkd_icon: "🎙", dkd_title: "Ses", dkd_text: "Ses dosyası seç" }),
    dkd_create(DkdAnyelaUploadOption, { dkd_icon: "▤", dkd_title: "Dekont", dkd_text: "Dekont yükle" })
  );
}

function DkdAnyelaUploadOption(dkd_props) {
  return dkd_create(
    "div",
    { className: "dkd_anyela_upload_option" },
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("div", null, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text))
  );
}

function DkdAnyelaOrders() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(
      "header",
      { className: "dkd_anyela_pay_header" },
      dkd_create("h1", null, "ANYELA"),
      dkd_create("span", null, "BORN CLUB")
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_progress" },
      dkd_create(DkdAnyelaProgress, { dkd_icon: "🎁", dkd_label: "Paket", dkd_active: true }),
      dkd_create(DkdAnyelaProgress, { dkd_icon: "▣", dkd_label: "Ödeme" }),
      dkd_create(DkdAnyelaProgress, { dkd_icon: "🛡", dkd_label: "Onay" }),
      dkd_create(DkdAnyelaProgress, { dkd_icon: "♕", dkd_label: "Başlangıç" })
    ),
    dkd_create("section", { className: "dkd_anyela_section_title" }, dkd_create("h2", null, "Paketini Seç")),
    dkd_create(
      "section",
      { className: "dkd_anyela_payment_packages" },
      dkd_create(DkdAnyelaPaymentPackage, { dkd_title: "ANYELA\nINTRO", dkd_text: "Kulübe giriş paketi. Özel içeriklere ilk adımın.", dkd_price: "₺149 /aylık", dkd_icon: "♕", dkd_active: true }),
      dkd_create(DkdAnyelaPaymentPackage, { dkd_title: "ÖZEL\nSOHBET", dkd_text: "Anyela ile birebir özel sohbet et.", dkd_price: "₺349 /aylık", dkd_icon: "💬" }),
      dkd_create(DkdAnyelaPaymentPackage, { dkd_title: "SESLİ\nMESAJ", dkd_text: "Sana özel sesli mesajlar gönderilir.", dkd_price: "₺249 /aylık", dkd_icon: "≋" }),
      dkd_create(DkdAnyelaPaymentPackage, { dkd_title: "VIP FAN\nPAKETİ", dkd_text: "Sürpriz hediyeler ve özel ayrıcalıklar.", dkd_price: "₺899 /aylık", dkd_icon: "🎁" })
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_payment_panel" },
      dkd_create(DkdAnyelaPaymentStepOne, null),
      dkd_create(DkdAnyelaPaymentStepTwo, null),
      dkd_create(DkdAnyelaPaymentStepThree, null),
      dkd_create(DkdAnyelaPaymentStepFour, null)
    ),
    dkd_create(DkdAnyelaStatusPanel, null)
  );
}

function DkdAnyelaProgress(dkd_props) {
  const dkd_class_name = dkd_props.dkd_active ? "dkd_anyela_progress_item dkd_anyela_progress_item_active" : "dkd_anyela_progress_item";
  return dkd_create("div", { className: dkd_class_name }, dkd_create("i", null, dkd_props.dkd_icon), dkd_create("span", null, dkd_props.dkd_label));
}

function DkdAnyelaPaymentPackage(dkd_props) {
  const dkd_class_name = dkd_props.dkd_active ? "dkd_anyela_payment_package dkd_anyela_payment_package_active" : "dkd_anyela_payment_package";
  return dkd_create(
    "article",
    { className: dkd_class_name },
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("span", null, dkd_props.dkd_text),
    dkd_create("b", null, dkd_props.dkd_price)
  );
}

function DkdAnyelaPaymentStepOne() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_payment_step" },
    dkd_create("div", { className: "dkd_anyela_step_number" }, "1"),
    dkd_create(
      "div",
      null,
      dkd_create("h3", null, "IBAN ile Ödeme"),
      dkd_create("p", null, "Aşağıdaki IBAN hesabına ödemenizi yapın."),
      dkd_create("div", { className: "dkd_anyela_copy_row" }, dkd_create("div", null, dkd_create("span", null, "IBAN"), dkd_create("strong", null, "TR12 3456 7890 1234 5678 9012 34")), dkd_create("button", { type: "button" }, "KOPYALA")),
      dkd_create("div", { className: "dkd_anyela_copy_row" }, dkd_create("div", null, dkd_create("span", null, "Referans Kodu"), dkd_create("strong", null, "ANYELA2025")), dkd_create("button", { type: "button" }, "KOPYALA"))
    )
  );
}

function DkdAnyelaPaymentStepTwo() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_payment_step" },
    dkd_create("div", { className: "dkd_anyela_step_number" }, "2"),
    dkd_create(
      "div",
      null,
      dkd_create("h3", null, "Dekont Yükle"),
      dkd_create("p", null, "Ödeme dekontunuzu yükleyin."),
      dkd_create("div", { className: "dkd_anyela_upload_box" }, dkd_create("i", null, "☁"), dkd_create("div", null, dkd_create("strong", null, "Dekontu buraya sürükleyin veya dosya seçin"), dkd_create("span", null, "JPG, PNG, PDF desteklenir")), dkd_create("button", { type: "button" }, "DOSYA SEÇ"))
    )
  );
}

function DkdAnyelaPaymentStepThree() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_payment_step" },
    dkd_create("div", { className: "dkd_anyela_step_number" }, "3"),
    dkd_create(
      "div",
      null,
      dkd_create("h3", null, "Sipariş Özeti"),
      dkd_create(
        "div",
        { className: "dkd_anyela_summary_box" },
        dkd_create("div", { className: "dkd_anyela_summary_icon" }, "♕"),
        dkd_create("div", null, dkd_create("strong", null, "Anyela Intro"), dkd_create("span", null, "Kulübe giriş paketi • Referans: ANYELA2025")),
        dkd_create("b", null, "₺149 /aylık")
      )
    )
  );
}

function DkdAnyelaPaymentStepFour() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_payment_step" },
    dkd_create("div", { className: "dkd_anyela_step_number" }, "4"),
    dkd_create(
      "div",
      null,
      dkd_create("h3", null, "Onay Bekleniyor"),
      dkd_create("p", null, "Ödemeniz kontrol edildikten sonra erişiminiz otomatik olarak açılacaktır."),
      dkd_create("div", { className: "dkd_anyela_wait_box" }, "⏳ Ortalama onay süresi: 5–30 dakika")
    )
  );
}

function DkdAnyelaStatusPanel() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_status_panel" },
    dkd_create("h2", null, "Sipariş Durumu"),
    dkd_create(
      "div",
      { className: "dkd_anyela_status_track" },
      dkd_create(DkdAnyelaStatusNode, { dkd_icon: "▢", dkd_title: "Sipariş Alındı", dkd_text: "23.05.2025", dkd_active: true }),
      dkd_create(DkdAnyelaStatusNode, { dkd_icon: "▣", dkd_title: "Ödeme Alındı", dkd_text: "Bekleniyor", dkd_active: true }),
      dkd_create(DkdAnyelaStatusNode, { dkd_icon: "⌕", dkd_title: "İnceleniyor", dkd_text: "Bekleniyor" }),
      dkd_create(DkdAnyelaStatusNode, { dkd_icon: "♕", dkd_title: "Erişim Açıldı", dkd_text: "Bekleniyor" })
    )
  );
}

function DkdAnyelaStatusNode(dkd_props) {
  const dkd_class_name = dkd_props.dkd_active ? "dkd_anyela_status_node dkd_anyela_status_node_active" : "dkd_anyela_status_node";
  return dkd_create("div", { className: dkd_class_name }, dkd_create("i", null, dkd_props.dkd_icon), dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text));
}

function DkdAnyelaAds() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(DkdAnyelaTopbar, null),
    dkd_create(
      "section",
      { className: "dkd_anyela_ad_hero" },
      dkd_create("div", { className: "dkd_anyela_hero_visual" }),
      dkd_create(
        "div",
        { className: "dkd_anyela_ad_hero_content" },
        dkd_create("p", { className: "dkd_anyela_kicker" }, "Reklam Paketi"),
        dkd_create("h1", null, "Anyela ", dkd_create("em", null, "Reklam Yüzünüz"), " Olsun"),
        dkd_create("p", null, "Markanızın değer katacak özel iş birlikleri için bizimle iletişime geçin. Birlikte büyüyelim, birlikte ilham verelim."),
        dkd_create("button", { type: "button" }, "Teklif Al  →")
      )
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_stats_row" },
      dkd_create(DkdAnyelaStat, { dkd_title: "12.8M+", dkd_text: "Toplam Erişim" }),
      dkd_create(DkdAnyelaStat, { dkd_title: "1.6M+", dkd_text: "Etkileşim" }),
      dkd_create(DkdAnyelaStat, { dkd_title: "250+", dkd_text: "Marka İş Birliği" }),
      dkd_create(DkdAnyelaStat, { dkd_title: "%78", dkd_text: "Hedef Kitle" })
    ),
    dkd_create("section", { className: "dkd_anyela_section_title" }, dkd_create("h2", null, "Reklam Paketleri")),
    dkd_create(
      "section",
      { className: "dkd_anyela_brand_grid" },
      dkd_create(DkdAnyelaBrandPackage, { dkd_icon: "◇", dkd_title: "Mini", dkd_text: "Hikaye paylaşımı ile markanızı tanıtın.", dkd_price: "₺7.500" }),
      dkd_create(DkdAnyelaBrandPackage, { dkd_icon: "☆", dkd_title: "Standart", dkd_text: "Daha fazla görünürlük, daha güçlü etki.", dkd_price: "₺15.000" }),
      dkd_create(DkdAnyelaBrandPackage, { dkd_icon: "♕", dkd_title: "Pro", dkd_text: "Markanız için maksimum görünürlük.", dkd_price: "₺25.000" }),
      dkd_create(DkdAnyelaBrandPackage, { dkd_icon: "♛", dkd_title: "Marka Yüzü", dkd_text: "Uzun dönem iş birliği ve özel üretim.", dkd_price: "Özel Fiyat" })
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_extra_cards" },
      dkd_create("article", null, dkd_create("strong", null, "Son İş Birlikleri"), dkd_create("span", null, "Tamamlanan projelerimize göz atın.")),
      dkd_create("article", null, dkd_create("strong", null, "Medya Kiti"), dkd_create("span", null, "Detaylı istatistik ve kitle analizleri.")),
      dkd_create("article", null, dkd_create("strong", null, "Başvuru Gönder"), dkd_create("span", null, "Markanızı yükseltecek iş birliği için başvurun."))
    ),
    dkd_create("section", { className: "dkd_anyela_contact_bar" }, dkd_create("span", null, "Her iş birliği, markanızın hikayesine değer katar."), dkd_create("strong", null, "business@anyelaborn.com ✉"))
  );
}

function DkdAnyelaStat(dkd_props) {
  return dkd_create("article", { className: "dkd_anyela_stat" }, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text));
}

function DkdAnyelaBrandPackage(dkd_props) {
  return dkd_create(
    "article",
    { className: "dkd_anyela_brand_card" },
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("p", null, dkd_props.dkd_text, "\n• Story / Feed\n• Etiketleme\n• Raporlama"),
    dkd_create("b", null, dkd_props.dkd_price),
    dkd_create("button", { type: "button" }, dkd_props.dkd_price === "Özel Fiyat" ? "Teklif Al" : "Seç")
  );
}

function DkdAnyelaProfile() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(DkdAnyelaTopbar, null),
    dkd_create(
      "section",
      { className: "dkd_anyela_panel dkd_anyela_profile_panel" },
      dkd_create("h2", null, "Profil"),
      dkd_create("p", null, "Bu alan sonraki aşamada üyelik, bildirimler, sipariş geçmişi ve hesap ayarları için kullanılacak.")
    )
  );
}

function DkdAnyelaNav(dkd_props) {
  return dkd_create(
    "nav",
    { className: "dkd_anyela_nav" },
    dkd_anyela_nav_items.map(function dkd_render_nav(dkd_nav_item) {
      const dkd_class_name = dkd_props.dkd_active_screen === dkd_nav_item.dkd_key ? "dkd_anyela_nav_button dkd_anyela_nav_button_active" : "dkd_anyela_nav_button";

      return dkd_create(
        "button",
        {
          key: dkd_nav_item.dkd_key,
          className: dkd_class_name,
          type: "button",
          onClick: function dkd_click_nav() {
            dkd_props.dkd_go_screen(dkd_nav_item.dkd_key);
          }
        },
        dkd_create("i", null, dkd_nav_item.dkd_icon),
        dkd_create("span", null, dkd_nav_item.dkd_label)
      );
    })
  );
}

createRoot(document.getElementById("dkd_anyela_root")).render(dkd_create(DkdAnyelaApp));
