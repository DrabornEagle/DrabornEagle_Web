import React, { useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const h = React.createElement;

const dkd_anyela_packages = [
  ["Intro", "Anyela Intro", "10 dakikalık yazılı başlangıç deneyimi.", "pink"],
  ["Private", "Private Chat", "30 dakikalık özel yazılı sohbet alanı.", "violet"],
  ["Voice", "Voice Message", "Kişiye özel hazırlanmış sesli cevap.", "blue"],
  ["Voice+", "Voice Chat Private", "Sesli mesaj mantığında özel sohbet deneyimi.", "gold"],
  ["Style", "Style Try-On", "Kıyafet ve konsept referansına göre özel stil hazırlığı.", "green"],
  ["Photo", "Photo Set", "Özel konseptli Anyela görsel seti.", "pink"],
  ["Video", "Talking Video", "Kişiye özel konuşmalı video deneyimi.", "violet"],
  ["VIP", "VIP Fan Pack", "Sohbet, ses ve özel görsel paketi.", "gold"]
];

const dkd_anyela_nav_items = [
  ["club", "Club", "✦"],
  ["packages", "Paket", "♛"],
  ["chat", "Chat", "💬"],
  ["orders", "Sipariş", "◉"],
  ["ads", "Reklam", "◆"]
];

function DkdAnyelaApp() {
  const [dkd_active_screen, dkd_set_active_screen] = useState("club");
  const [dkd_selected_package, dkd_set_selected_package] = useState(null);
  const [dkd_chat_input, dkd_set_chat_input] = useState("");
  const [dkd_chat_messages, dkd_set_chat_messages] = useState([
    ["anyela", "Hey, Anyela Born Club’a hoş geldin. Paket seçebilir, mesaj yazabilir veya ses/görsel/video gönderebilirsin."],
    ["anyela", "İlk sürümde cevaplar özel olarak hazırlanır ve bu chat ekranına düşer."]
  ]);

  const dkd_selected_package_text = useMemo(function dkd_get_selected_package_text() {
    return dkd_selected_package ? dkd_selected_package[1] : "Paket seçilmedi";
  }, [dkd_selected_package]);

  function dkd_go_to_screen(dkd_screen_key) {
    dkd_set_active_screen(dkd_screen_key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function dkd_select_package(dkd_package_item) {
    dkd_set_selected_package(dkd_package_item);
    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return dkd_previous_messages.concat([
        ["user", "Paket seçildi: " + dkd_package_item[1]],
        ["anyela", "Seçimin alındı. Şimdi ödeme/dekont adımına geçebilir veya özel isteğini yazabilirsin."]
      ]);
    });
    dkd_go_to_screen("chat");
  }

  function dkd_submit_chat_message(dkd_form_event) {
    dkd_form_event.preventDefault();

    const dkd_message_text = dkd_chat_input.trim();

    if (!dkd_message_text) {
      return;
    }

    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return dkd_previous_messages.concat([
        ["user", dkd_message_text],
        ["anyela", "Mesajın alındı. Bu mockup aşamasında cevap demo olarak gösteriliyor; gerçek sistemde cevaplar admin panelinden eklenecek."]
      ]);
    });

    dkd_set_chat_input("");
  }

  function dkd_handle_upload(dkd_upload_event, dkd_upload_type) {
    const dkd_uploaded_file = dkd_upload_event.target.files && dkd_upload_event.target.files[0];

    if (!dkd_uploaded_file) {
      return;
    }

    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return dkd_previous_messages.concat([
        ["user", dkd_upload_type + " yüklendi: " + dkd_uploaded_file.name],
        ["anyela", "Dosyan alındı. Gerçek sistemde bu dosya sipariş detayına eklenecek."]
      ]);
    });

    dkd_go_to_screen("chat");
  }

  return h(
    "main",
    { className: "dkd_anyela_app_shell" },
    dkd_active_screen === "club" && h(DkdAnyelaClubScreen, { goToScreen: dkd_go_to_screen }),
    dkd_active_screen === "packages" && h(DkdAnyelaPackagesScreen, { selectPackage: dkd_select_package }),
    dkd_active_screen === "chat" &&
      h(DkdAnyelaChatScreen, {
        selectedPackageText: dkd_selected_package_text,
        chatMessages: dkd_chat_messages,
        chatInput: dkd_chat_input,
        setChatInput: dkd_set_chat_input,
        submitChatMessage: dkd_submit_chat_message,
        handleUpload: dkd_handle_upload
      }),
    dkd_active_screen === "orders" && h(DkdAnyelaOrdersScreen, { selectedPackageText: dkd_selected_package_text }),
    dkd_active_screen === "ads" && h(DkdAnyelaAdsScreen),
    h(DkdAnyelaBottomNav, { activeScreen: dkd_active_screen, goToScreen: dkd_go_to_screen })
  );
}

function DkdAnyelaClubScreen(props) {
  return h(
    "section",
    null,
    h(
      "div",
      { className: "dkd_anyela_hero" },
      h(
        "div",
        { className: "dkd_anyela_topbar" },
        h("div", { className: "dkd_anyela_brand_mark" }, "AB"),
        h("button", { className: "dkd_anyela_ghost_button", onClick: function dkd_click_private_room() { props.goToScreen("chat"); } }, "Private Room")
      ),
      h(
        "div",
        { className: "dkd_anyela_hero_grid" },
        h(
          "div",
          null,
          h("p", { className: "dkd_anyela_kicker" }, "Anyela Born Club"),
          h("h1", null, "Premium fan experience."),
          h("p", { className: "dkd_anyela_hero_text" }, "Yazılı sohbet, sesli cevap, özel görsel/video isteği ve işletmeler için reklam yüzü deneyimi tek sayfada."),
          h(
            "div",
            { className: "dkd_anyela_hero_actions" },
            h("button", { className: "dkd_anyela_primary_button", onClick: function dkd_click_chat() { props.goToScreen("chat"); } }, "Sohbete Başla →"),
            h("button", { className: "dkd_anyela_secondary_button", onClick: function dkd_click_packages() { props.goToScreen("packages"); } }, "Paketleri Gör")
          )
        ),
        h(
          "div",
          { className: "dkd_anyela_phone_mockup" },
          h("div", { className: "dkd_anyela_phone_header" }, h("span", null, "Anyela"), h("em", null, "Online")),
          h("div", { className: "dkd_anyela_story_card" }, h("p", null, "Tonight’s private room"), h("strong", null, "Voice reply ready")),
          h(
            "div",
            { className: "dkd_anyela_mini_chat" },
            h("p", { className: "dkd_anyela_bubble_anyela" }, "Hey, bugün nasıl bir içerik hazırlayalım?"),
            h("p", { className: "dkd_anyela_bubble_user" }, "Kişiye özel sesli cevap istiyorum."),
            h("p", { className: "dkd_anyela_bubble_anyela" }, "Paketini seç, sonra mesajını gönder.")
          )
        )
      )
    ),
    h(
      "div",
      { className: "dkd_anyela_signal_grid" },
      h(DkdAnyelaSignalCard, { icon: "💬", title: "Private Chat", text: "Site içi yazışma deneyimi." }),
      h(DkdAnyelaSignalCard, { icon: "🎙️", title: "Voice Reply", text: "Sesli cevap dinleme akışı." }),
      h(DkdAnyelaSignalCard, { icon: "📎", title: "Media Upload", text: "Ses, görsel, video ve dekont alanı." }),
      h(DkdAnyelaSignalCard, { icon: "🛡️", title: "Controlled Club", text: "18+ kurallar ve manuel onay." })
    ),
    h(
      "div",
      { className: "dkd_anyela_panel" },
      h("p", { className: "dkd_anyela_kicker" }, "First release plan"),
      h("h2", null, "Önce görünüm, sonra gerçek sistem."),
      h(
        "div",
        { className: "dkd_anyela_step_list" },
        h(DkdAnyelaStep, { numberText: "01", text: "Mobil premium ana sayfa ve club hissi." }),
        h(DkdAnyelaStep, { numberText: "02", text: "Site içi chat ve dosya gönderme arayüzü." }),
        h(DkdAnyelaStep, { numberText: "03", text: "Paket, ödeme ve sipariş durumu akışı." }),
        h(DkdAnyelaStep, { numberText: "04", text: "Son aşamada gerçek backend ve admin panel." })
      )
    )
  );
}

function DkdAnyelaSignalCard(props) {
  return h("article", { className: "dkd_anyela_signal_card" }, h("i", null, props.icon), h("strong", null, props.title), h("p", null, props.text));
}

function DkdAnyelaStep(props) {
  return h("div", { className: "dkd_anyela_step" }, h("b", null, props.numberText), h("span", null, props.text));
}

function DkdAnyelaPageHeader(props) {
  return h("header", { className: "dkd_anyela_page_header" }, h("p", { className: "dkd_anyela_kicker" }, props.kicker), h("h1", null, props.title), h("p", null, props.text));
}

function DkdAnyelaPackagesScreen(props) {
  return h(
    "section",
    null,
    h(DkdAnyelaPageHeader, {
      kicker: "Club Packages",
      title: "Paketler",
      text: "Paket seçimi chat akışını başlatır. Fiyatlar ve ödeme bilgileri sonraki aşamada eklenecek."
    }),
    h(
      "div",
      { className: "dkd_anyela_package_grid" },
      dkd_anyela_packages.map(function dkd_render_package(dkd_package_item) {
        return h(
          "button",
          {
            key: dkd_package_item[1],
            className: "dkd_anyela_package_card dkd_anyela_accent_" + dkd_package_item[3],
            onClick: function dkd_click_package() {
              props.selectPackage(dkd_package_item);
            }
          },
          h("span", null, dkd_package_item[0]),
          h("strong", null, dkd_package_item[1]),
          h("p", null, dkd_package_item[2]),
          h("small", null, "Paketi seç")
        );
      })
    )
  );
}

function DkdAnyelaChatScreen(props) {
  return h(
    "section",
    null,
    h(
      "header",
      { className: "dkd_anyela_chat_header" },
      h("div", { className: "dkd_anyela_brand_mark" }, "AB"),
      h("div", null, h("p", { className: "dkd_anyela_kicker" }, "Private Room"), h("h1", null, "Anyela Chat")),
      h("span", null, "Online")
    ),
    h("div", { className: "dkd_anyela_selected_strip" }, h("p", null, "Seçili paket: ", h("strong", null, props.selectedPackageText))),
    h(
      "div",
      { className: "dkd_anyela_chat_window" },
      props.chatMessages.map(function dkd_render_message(dkd_message_item, dkd_message_index) {
        return h(
          "div",
          {
            key: "dkd_message_" + dkd_message_index,
            className:
              dkd_message_item[0] === "user"
                ? "dkd_anyela_message dkd_anyela_message_user"
                : "dkd_anyela_message dkd_anyela_message_anyela"
          },
          dkd_message_item[1]
        );
      })
    ),
    h(
      "div",
      { className: "dkd_anyela_upload_grid" },
      h(DkdAnyelaUploadButton, { label: "Ses", accept: "audio/*", uploadType: "Ses dosyası", handleUpload: props.handleUpload }),
      h(DkdAnyelaUploadButton, { label: "Görsel", accept: "image/*", uploadType: "Görsel", handleUpload: props.handleUpload }),
      h(DkdAnyelaUploadButton, { label: "Video", accept: "video/*", uploadType: "Video", handleUpload: props.handleUpload }),
      h(DkdAnyelaUploadButton, { label: "Dekont", accept: "image/*,.pdf", uploadType: "Dekont", handleUpload: props.handleUpload })
    ),
    h(
      "form",
      { className: "dkd_anyela_chat_form", onSubmit: props.submitChatMessage },
      h("input", {
        value: props.chatInput,
        onChange: function dkd_input_change(dkd_input_event) {
          props.setChatInput(dkd_input_event.target.value);
        },
        placeholder: "Anyela’ya mesaj yaz..."
      }),
      h("button", { type: "submit" }, "➤")
    )
  );
}

function DkdAnyelaUploadButton(props) {
  return h(
    "label",
    { className: "dkd_anyela_upload_button" },
    h("input", {
      type: "file",
      accept: props.accept,
      onChange: function dkd_upload_change(dkd_upload_event) {
        props.handleUpload(dkd_upload_event, props.uploadType);
      }
    }),
    h("span", null, props.label)
  );
}

function DkdAnyelaOrdersScreen(props) {
  return h(
    "section",
    null,
    h(DkdAnyelaPageHeader, {
      kicker: "Order Center",
      title: "Siparişlerim",
      text: "Ödeme, onay, hazırlık ve teslim aşamaları burada takip edilecek."
    }),
    h(
      "div",
      { className: "dkd_anyela_order_panel" },
      h(
        "div",
        { className: "dkd_anyela_order_head" },
        h("div", null, h("span", null, "Aktif Sipariş"), h("strong", null, props.selectedPackageText)),
        h("em", null, "Mockup")
      ),
      h(
        "div",
        { className: "dkd_anyela_progress_list" },
        h("div", { className: "dkd_anyela_progress dkd_anyela_progress_active" }, "Paket seçildi"),
        h("div", { className: "dkd_anyela_progress" }, "Dekont yüklendi"),
        h("div", { className: "dkd_anyela_progress" }, "Onaylandı"),
        h("div", { className: "dkd_anyela_progress" }, "Hazırlanıyor"),
        h("div", { className: "dkd_anyela_progress" }, "Teslim edildi")
      )
    ),
    h("div", { className: "dkd_anyela_panel" }, h("h2", null, "Ödeme akışı"), h("p", null, "İlk canlı sürümde IBAN bilgisi bu ekranda gösterilecek. Kullanıcı dekontu chat içinden yükleyecek, sen onayladıktan sonra sipariş aktif olacak."))
  );
}

function DkdAnyelaAdsScreen() {
  return h(
    "section",
    null,
    h(DkdAnyelaPageHeader, {
      kicker: "Brand Collaboration",
      title: "Anyela reklam yüzünüz olsun",
      text: "İşletmeler için premium tanıtım, görsel set, video konsept ve sponsorlu içerik paketi."
    }),
    h(
      "div",
      { className: "dkd_anyela_brand_grid" },
      h(DkdAnyelaBrandCard, { icon: "📷", title: "Reklam Mini", text: "Tek konsept görsel veya kısa tanıtım fikri." }),
      h(DkdAnyelaBrandCard, { icon: "🖼️", title: "Reklam Standart", text: "Görsel set, açıklama metni ve ürün odağı." }),
      h(DkdAnyelaBrandCard, { icon: "🎬", title: "Reklam Pro", text: "Video konsept, görsel set ve paylaşım metni." }),
      h(DkdAnyelaBrandCard, { icon: "👑", title: "Marka Yüzü", text: "Anyela ile özel marka yüzü kampanyası." })
    ),
    h("div", { className: "dkd_anyela_panel dkd_anyela_policy_row" }, h("p", null, "Anyela hesabında paylaşım yapılırsa “Reklam / İş birliği / Sponsorlu” etiketi kullanılmalıdır."))
  );
}

function DkdAnyelaBrandCard(props) {
  return h("article", { className: "dkd_anyela_brand_card" }, h("i", null, props.icon), h("strong", null, props.title), h("p", null, props.text));
}

function DkdAnyelaBottomNav(props) {
  return h(
    "nav",
    { className: "dkd_anyela_bottom_nav" },
    dkd_anyela_nav_items.map(function dkd_render_nav(dkd_nav_item) {
      return h(
        "button",
        {
          key: dkd_nav_item[0],
          className:
            props.activeScreen === dkd_nav_item[0]
              ? "dkd_anyela_nav_button dkd_anyela_nav_button_active"
              : "dkd_anyela_nav_button",
          onClick: function dkd_click_nav() {
            props.goToScreen(dkd_nav_item[0]);
          }
        },
        h("span", null, dkd_nav_item[2]),
        h("span", null, dkd_nav_item[1])
      );
    })
  );
}

createRoot(document.getElementById("dkd_anyela_root")).render(h(DkdAnyelaApp));
