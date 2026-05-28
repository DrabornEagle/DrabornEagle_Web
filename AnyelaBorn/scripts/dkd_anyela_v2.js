import React, { useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const dkd_create = React.createElement;

const dkd_anyela_packages = [
  {
    dkd_label: "Intro",
    dkd_title: "Anyela Intro",
    dkd_text: "10 dakikalık yazılı başlangıç deneyimi.",
    dkd_style: "hot"
  },
  {
    dkd_label: "Private",
    dkd_title: "Private Chat",
    dkd_text: "30 dakikalık özel yazılı sohbet alanı.",
    dkd_style: "lilac"
  },
  {
    dkd_label: "Voice",
    dkd_title: "Voice Message",
    dkd_text: "Kişiye özel hazırlanmış sesli cevap.",
    dkd_style: "cyan"
  },
  {
    dkd_label: "Voice+",
    dkd_title: "Voice Chat Private",
    dkd_text: "Sesli mesaj mantığında özel sohbet deneyimi.",
    dkd_style: "gold"
  },
  {
    dkd_label: "Style",
    dkd_title: "Style Try-On",
    dkd_text: "Kıyafet ve konsept referansına göre özel stil hazırlığı.",
    dkd_style: "hot"
  },
  {
    dkd_label: "Photo",
    dkd_title: "Photo Set",
    dkd_text: "Özel konseptli Anyela görsel seti.",
    dkd_style: "lilac"
  },
  {
    dkd_label: "Video",
    dkd_title: "Talking Video",
    dkd_text: "Kişiye özel konuşmalı video deneyimi.",
    dkd_style: "cyan"
  },
  {
    dkd_label: "VIP",
    dkd_title: "VIP Fan Pack",
    dkd_text: "Sohbet, ses ve özel görsel paketi.",
    dkd_style: "gold"
  }
];

const dkd_anyela_nav_items = [
  { dkd_key: "club", dkd_label: "Club", dkd_icon: "✦" },
  { dkd_key: "packages", dkd_label: "Paket", dkd_icon: "♛" },
  { dkd_key: "chat", dkd_label: "Chat", dkd_icon: "💬" },
  { dkd_key: "orders", dkd_label: "Sipariş", dkd_icon: "◉" },
  { dkd_key: "ads", dkd_label: "Reklam", dkd_icon: "◆" }
];

function DkdAnyelaApp() {
  const [dkd_active_screen, dkd_set_active_screen] = useState("club");
  const [dkd_selected_package, dkd_set_selected_package] = useState(null);
  const [dkd_chat_input, dkd_set_chat_input] = useState("");
  const [dkd_chat_messages, dkd_set_chat_messages] = useState([
    {
      dkd_owner: "anyela",
      dkd_text: "Private Room açıldı. Paket seçebilir, mesaj yazabilir veya ses/görsel/video gönderebilirsin."
    },
    {
      dkd_owner: "anyela",
      dkd_text: "İlk sürümde cevaplar özel hazırlanır. Gerçek sistemde tüm konuşmalar bu ekranın içinde ilerleyecek."
    }
  ]);

  const dkd_selected_package_text = useMemo(function dkd_get_selected_text() {
    return dkd_selected_package ? dkd_selected_package.dkd_title : "Paket seçilmedi";
  }, [dkd_selected_package]);

  function dkd_go_screen(dkd_screen_key) {
    dkd_set_active_screen(dkd_screen_key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function dkd_select_package(dkd_package_item) {
    dkd_set_selected_package(dkd_package_item);
    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return dkd_previous_messages.concat([
        {
          dkd_owner: "user",
          dkd_text: "Paket seçildi: " + dkd_package_item.dkd_title
        },
        {
          dkd_owner: "anyela",
          dkd_text: "Seçimin alındı. Şimdi dekont yükleyebilir, ses gönderebilir veya özel isteğini yazabilirsin."
        }
      ]);
    });
    dkd_go_screen("chat");
  }

  function dkd_submit_chat(dkd_form_event) {
    dkd_form_event.preventDefault();

    const dkd_message_text = dkd_chat_input.trim();

    if (!dkd_message_text) {
      return;
    }

    dkd_set_chat_messages(function dkd_update_messages(dkd_previous_messages) {
      return dkd_previous_messages.concat([
        {
          dkd_owner: "user",
          dkd_text: dkd_message_text
        },
        {
          dkd_owner: "anyela",
          dkd_text: "Mesajın alındı. Bu v2 mockup aşamasında demo cevap gösteriliyor; gerçek sistemde admin panelinden cevap eklenecek."
        }
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
        {
          dkd_owner: "user",
          dkd_text: dkd_upload_type + " yüklendi: " + dkd_uploaded_file.name
        },
        {
          dkd_owner: "anyela",
          dkd_text: "Dosya alındı. Gerçek sürümde bu dosya sipariş detayına bağlanacak."
        }
      ]);
    });

    dkd_go_screen("chat");
  }

  return dkd_create(
    "main",
    { className: "dkd_anyela_shell" },
    dkd_create(DkdAnyelaTopbar, null),
    dkd_active_screen === "club" && dkd_create(DkdAnyelaClub, { dkd_go_screen }),
    dkd_active_screen === "packages" && dkd_create(DkdAnyelaPackages, { dkd_select_package }),
    dkd_active_screen === "chat" &&
      dkd_create(DkdAnyelaChat, {
        dkd_selected_package_text,
        dkd_chat_messages,
        dkd_chat_input,
        dkd_set_chat_input,
        dkd_submit_chat,
        dkd_handle_upload
      }),
    dkd_active_screen === "orders" && dkd_create(DkdAnyelaOrders, { dkd_selected_package_text }),
    dkd_active_screen === "ads" && dkd_create(DkdAnyelaAds, null),
    dkd_create(DkdAnyelaNav, { dkd_active_screen, dkd_go_screen })
  );
}

function DkdAnyelaTopbar() {
  return dkd_create(
    "header",
    { className: "dkd_anyela_topbar" },
    dkd_create(
      "div",
      { className: "dkd_anyela_logo_row" },
      dkd_create("div", { className: "dkd_anyela_logo" }, "AB"),
      dkd_create(
        "div",
        null,
        dkd_create("strong", null, "Anyela Born Club"),
        dkd_create("span", null, "Private fan experience")
      )
    ),
    dkd_create("div", { className: "dkd_anyela_status_pill" }, dkd_create("i", null), "OPEN")
  );
}

function DkdAnyelaClub(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(
      "section",
      { className: "dkd_anyela_hero" },
      dkd_create(
        "div",
        { className: "dkd_anyela_hero_grid" },
        dkd_create(
          "div",
          null,
          dkd_create("p", { className: "dkd_anyela_kicker" }, "Mobile-first private club"),
          dkd_create(
            "h1",
            { className: "dkd_anyela_title" },
            "Anyela ile ",
            dkd_create("span", { className: "dkd_anyela_gradient_text" }, "özel oda"),
            " deneyimi."
          ),
          dkd_create(
            "p",
            { className: "dkd_anyela_hero_text" },
            "Yazılı sohbet, sesli cevap, özel görsel/video isteği ve işletmeler için reklam yüzü paketleri tek bir premium mobil deneyimde."
          ),
          dkd_create(
            "div",
            { className: "dkd_anyela_action_row" },
            dkd_create(
              "button",
              {
                className: "dkd_anyela_primary_button",
                onClick: function dkd_click_start() {
                  dkd_props.dkd_go_screen("chat");
                }
              },
              "Private Room Aç →"
            ),
            dkd_create(
              "button",
              {
                className: "dkd_anyela_secondary_button",
                onClick: function dkd_click_packages() {
                  dkd_props.dkd_go_screen("packages");
                }
              },
              "Paketleri İncele"
            )
          ),
          dkd_create(
            "div",
            { className: "dkd_anyela_metric_row" },
            dkd_create(DkdAnyelaMetric, { dkd_value: "Chat", dkd_label: "site içi" }),
            dkd_create(DkdAnyelaMetric, { dkd_value: "Voice", dkd_label: "sesli cevap" }),
            dkd_create(DkdAnyelaMetric, { dkd_value: "Media", dkd_label: "özel istek" })
          )
        ),
        dkd_create(DkdAnyelaDevicePreview, null)
      )
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_feature_grid" },
      dkd_create(DkdAnyelaFeature, { dkd_icon: "💬", dkd_title: "Private Chat", dkd_text: "WhatsApp yok. Tüm konuşma site içinde." }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "🎙️", dkd_title: "Voice Room", dkd_text: "Kullanıcı ses gönderir, Anyela sesli cevap verir." }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "📎", dkd_title: "Media Request", dkd_text: "Görsel, video, ses ve dekont yükleme akışı." }),
      dkd_create(DkdAnyelaFeature, { dkd_icon: "👑", dkd_title: "Brand Face", dkd_text: "İşletmeler için reklam yüzü paketleri." })
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_panel" },
      dkd_create("p", { className: "dkd_anyela_kicker" }, "Launch flow"),
      dkd_create("h2", null, "Önce premium deneyim, sonra gerçek backend."),
      dkd_create(
        "div",
        { className: "dkd_anyela_process_list" },
        dkd_create(DkdAnyelaProcess, { dkd_number: "01", dkd_title: "Tasarım vitrini", dkd_text: "Ana sayfa ve ürün hissi netleşir." }),
        dkd_create(DkdAnyelaProcess, { dkd_number: "02", dkd_title: "Chat mockup", dkd_text: "Ses, görsel, video ve dekont arayüzü hazırlanır." }),
        dkd_create(DkdAnyelaProcess, { dkd_number: "03", dkd_title: "Satış akışı", dkd_text: "Paket seçimi ve sipariş durumu düzenlenir." }),
        dkd_create(DkdAnyelaProcess, { dkd_number: "04", dkd_title: "Supabase en son", dkd_text: "Gerçek chat, storage ve admin panel bağlanır." })
      )
    )
  );
}

function DkdAnyelaDevicePreview() {
  return dkd_create(
    "div",
    { className: "dkd_anyela_device_stage" },
    dkd_create(
      "div",
      { className: "dkd_anyela_device_inner" },
      dkd_create(
        "div",
        { className: "dkd_anyela_device_header" },
        dkd_create(
          "div",
          { className: "dkd_anyela_device_profile" },
          dkd_create("div", { className: "dkd_anyela_avatar" }, "AB"),
          dkd_create("div", null, dkd_create("strong", null, "Anyela"), dkd_create("span", null, "online now"))
        ),
        dkd_create("em", null, "Private")
      ),
      dkd_create(
        "div",
        { className: "dkd_anyela_portrait_card" },
        dkd_create(
          "div",
          { className: "dkd_anyela_portrait_caption" },
          dkd_create("span", null, "Club preview"),
          dkd_create("strong", null, "Custom voice reply ready")
        )
      ),
      dkd_create(
        "div",
        { className: "dkd_anyela_preview_stack" },
        dkd_create("p", { className: "dkd_anyela_preview_message" }, "Bugün nasıl bir özel içerik hazırlayalım?"),
        dkd_create("p", { className: "dkd_anyela_preview_message dkd_anyela_preview_message_user" }, "Sesli cevap ve özel görsel istiyorum."),
        dkd_create(
          "div",
          { className: "dkd_anyela_wave_card" },
          dkd_create("div", { className: "dkd_anyela_play_button" }, "▶"),
          dkd_create(
            "div",
            { className: "dkd_anyela_wave" },
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null),
            dkd_create("i", null)
          ),
          dkd_create("span", { className: "dkd_anyela_wave_time" }, "0:18")
        )
      )
    )
  );
}

function DkdAnyelaMetric(dkd_props) {
  return dkd_create(
    "div",
    { className: "dkd_anyela_metric" },
    dkd_create("strong", null, dkd_props.dkd_value),
    dkd_create("span", null, dkd_props.dkd_label)
  );
}

function DkdAnyelaFeature(dkd_props) {
  return dkd_create(
    "article",
    { className: "dkd_anyela_feature_card" },
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("p", null, dkd_props.dkd_text)
  );
}

function DkdAnyelaProcess(dkd_props) {
  return dkd_create(
    "div",
    { className: "dkd_anyela_process_item" },
    dkd_create("b", null, dkd_props.dkd_number),
    dkd_create("div", null, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text))
  );
}

function DkdAnyelaPackages(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(DkdAnyelaHeader, {
      dkd_kicker: "Club packages",
      dkd_title: "Paket seç, private room başlasın.",
      dkd_text: "Fiyatları bir sonraki adımda ekleriz. Şimdilik ürün hissi, paket düzeni ve chat geçişi netleşiyor."
    }),
    dkd_create(
      "div",
      { className: "dkd_anyela_package_grid" },
      dkd_anyela_packages.map(function dkd_render_package(dkd_package_item) {
        return dkd_create(
          "button",
          {
            key: dkd_package_item.dkd_title,
            className: "dkd_anyela_package_card dkd_anyela_package_" + dkd_package_item.dkd_style,
            onClick: function dkd_click_package() {
              dkd_props.dkd_select_package(dkd_package_item);
            }
          },
          dkd_create("span", null, dkd_package_item.dkd_label),
          dkd_create("strong", null, dkd_package_item.dkd_title),
          dkd_create("p", null, dkd_package_item.dkd_text),
          dkd_create("small", null, "Paketi seç →")
        );
      })
    )
  );
}

function DkdAnyelaChat(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(
      "header",
      { className: "dkd_anyela_chat_header" },
      dkd_create(
        "div",
        { className: "dkd_anyela_chat_identity" },
        dkd_create("div", { className: "dkd_anyela_avatar" }, "AB"),
        dkd_create("div", null, dkd_create("strong", null, "Anyela Chat"), dkd_create("span", null, "private room active"))
      ),
      dkd_create("div", { className: "dkd_anyela_chat_mode" }, "Manual MVP")
    ),
    dkd_create(
      "div",
      { className: "dkd_anyela_selected_bar" },
      dkd_create("i", null, "♛"),
      dkd_create("div", null, dkd_create("span", null, "Seçili paket"), dkd_create("strong", null, dkd_props.dkd_selected_package_text))
    ),
    dkd_create(
      "div",
      { className: "dkd_anyela_chat_window" },
      dkd_props.dkd_chat_messages.map(function dkd_render_message(dkd_message_item, dkd_message_index) {
        return dkd_create(
          "div",
          {
            key: "dkd_chat_message_" + dkd_message_index,
            className:
              dkd_message_item.dkd_owner === "user"
                ? "dkd_anyela_message dkd_anyela_message_user"
                : "dkd_anyela_message dkd_anyela_message_anyela"
          },
          dkd_message_item.dkd_text
        );
      })
    ),
    dkd_create(
      "div",
      { className: "dkd_anyela_request_panel" },
      dkd_create(
        "div",
        { className: "dkd_anyela_upload_grid" },
        dkd_create(DkdAnyelaUpload, { dkd_label: "Ses", dkd_type: "Ses dosyası", dkd_accept: "audio/*", dkd_handle_upload: dkd_props.dkd_handle_upload }),
        dkd_create(DkdAnyelaUpload, { dkd_label: "Görsel", dkd_type: "Görsel", dkd_accept: "image/*", dkd_handle_upload: dkd_props.dkd_handle_upload }),
        dkd_create(DkdAnyelaUpload, { dkd_label: "Video", dkd_type: "Video", dkd_accept: "video/*", dkd_handle_upload: dkd_props.dkd_handle_upload }),
        dkd_create(DkdAnyelaUpload, { dkd_label: "Dekont", dkd_type: "Dekont", dkd_accept: "image/*,.pdf", dkd_handle_upload: dkd_props.dkd_handle_upload })
      ),
      dkd_create(
        "form",
        { className: "dkd_anyela_chat_form", onSubmit: dkd_props.dkd_submit_chat },
        dkd_create("input", {
          value: dkd_props.dkd_chat_input,
          placeholder: "Anyela’ya mesaj yaz...",
          onChange: function dkd_change_chat(dkd_input_event) {
            dkd_props.dkd_set_chat_input(dkd_input_event.target.value);
          }
        }),
        dkd_create("button", { type: "submit" }, "➤")
      )
    )
  );
}

function DkdAnyelaUpload(dkd_props) {
  return dkd_create(
    "label",
    { className: "dkd_anyela_upload_button" },
    dkd_create("input", {
      type: "file",
      accept: dkd_props.dkd_accept,
      onChange: function dkd_change_upload(dkd_upload_event) {
        dkd_props.dkd_handle_upload(dkd_upload_event, dkd_props.dkd_type);
      }
    }),
    dkd_create("span", null, dkd_props.dkd_label)
  );
}

function DkdAnyelaOrders(dkd_props) {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(DkdAnyelaHeader, {
      dkd_kicker: "Order center",
      dkd_title: "Sipariş durumu net ve güvenli.",
      dkd_text: "Kullanıcı ödeme, onay, hazırlık ve teslim aşamasını bu ekranda görecek."
    }),
    dkd_create(
      "section",
      { className: "dkd_anyela_order_card" },
      dkd_create(
        "div",
        { className: "dkd_anyela_order_head" },
        dkd_create("div", null, dkd_create("span", null, "Aktif sipariş"), dkd_create("strong", null, dkd_props.dkd_selected_package_text)),
        dkd_create("em", null, "Beklemede")
      ),
      dkd_create(
        "div",
        { className: "dkd_anyela_status_list" },
        dkd_create(DkdAnyelaStatus, { dkd_active: true, dkd_number: "1", dkd_title: "Paket seçildi", dkd_text: "Kullanıcı deneyim türünü seçti." }),
        dkd_create(DkdAnyelaStatus, { dkd_number: "2", dkd_title: "Dekont bekleniyor", dkd_text: "IBAN ödeme sonrası dekont yüklenir." }),
        dkd_create(DkdAnyelaStatus, { dkd_number: "3", dkd_title: "Onay bekliyor", dkd_text: "Manuel ödeme kontrolü yapılır." }),
        dkd_create(DkdAnyelaStatus, { dkd_number: "4", dkd_title: "Hazırlanıyor", dkd_text: "Ses, görsel veya video üretilir." }),
        dkd_create(DkdAnyelaStatus, { dkd_number: "5", dkd_title: "Teslim edildi", dkd_text: "Cevap chat ekranına düşer." })
      )
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_panel" },
      dkd_create("h2", null, "İlk sürüm manuel kontrol."),
      dkd_create("p", null, "Supabase bağlanana kadar bu ekran satış akışını anlatan mockup olarak kalır. Sonra gerçek sipariş kaydı, dosya ve admin onayı eklenir.")
    )
  );
}

function DkdAnyelaStatus(dkd_props) {
  return dkd_create(
    "div",
    { className: dkd_props.dkd_active ? "dkd_anyela_status_item dkd_anyela_status_item_active" : "dkd_anyela_status_item" },
    dkd_create("b", null, dkd_props.dkd_number),
    dkd_create("div", null, dkd_create("strong", null, dkd_props.dkd_title), dkd_create("span", null, dkd_props.dkd_text))
  );
}

function DkdAnyelaAds() {
  return dkd_create(
    "section",
    { className: "dkd_anyela_screen" },
    dkd_create(DkdAnyelaHeader, {
      dkd_kicker: "Brand collaboration",
      dkd_title: "Anyela reklam yüzünüz olsun.",
      dkd_text: "İşletmeler için daha kurumsal, temiz ve güven veren reklam paketi ekranı."
    }),
    dkd_create(
      "section",
      { className: "dkd_anyela_brand_grid" },
      dkd_create(DkdAnyelaBrandCard, { dkd_icon: "📷", dkd_title: "Reklam Mini", dkd_text: "Tek konsept görsel veya kısa tanıtım fikri." }),
      dkd_create(DkdAnyelaBrandCard, { dkd_icon: "🖼️", dkd_title: "Reklam Standart", dkd_text: "Görsel set, açıklama metni ve ürün odağı." }),
      dkd_create(DkdAnyelaBrandCard, { dkd_icon: "🎬", dkd_title: "Reklam Pro", dkd_text: "Video konsept, görsel set ve paylaşım metni." }),
      dkd_create(DkdAnyelaBrandCard, { dkd_icon: "👑", dkd_title: "Marka Yüzü", dkd_text: "Anyela ile özel marka yüzü kampanyası." })
    ),
    dkd_create(
      "section",
      { className: "dkd_anyela_panel" },
      dkd_create("h2", null, "Reklam etiketi önemli."),
      dkd_create("p", null, "Anyela hesabında paylaşım yapılırsa “Reklam / İş birliği / Sponsorlu” etiketi kullanılmalıdır.")
    )
  );
}

function DkdAnyelaBrandCard(dkd_props) {
  return dkd_create(
    "article",
    { className: "dkd_anyela_brand_card" },
    dkd_create("i", null, dkd_props.dkd_icon),
    dkd_create("strong", null, dkd_props.dkd_title),
    dkd_create("p", null, dkd_props.dkd_text)
  );
}

function DkdAnyelaHeader(dkd_props) {
  return dkd_create(
    "header",
    { className: "dkd_anyela_section_header" },
    dkd_create("p", { className: "dkd_anyela_kicker" }, dkd_props.dkd_kicker),
    dkd_create("h1", null, dkd_props.dkd_title),
    dkd_create("p", null, dkd_props.dkd_text)
  );
}

function DkdAnyelaNav(dkd_props) {
  return dkd_create(
    "nav",
    { className: "dkd_anyela_nav" },
    dkd_anyela_nav_items.map(function dkd_render_nav(dkd_nav_item) {
      return dkd_create(
        "button",
        {
          key: dkd_nav_item.dkd_key,
          className:
            dkd_props.dkd_active_screen === dkd_nav_item.dkd_key
              ? "dkd_anyela_nav_button dkd_anyela_nav_button_active"
              : "dkd_anyela_nav_button",
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
