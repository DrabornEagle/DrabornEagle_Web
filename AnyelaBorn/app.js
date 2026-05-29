const dkd_create_element = React.createElement;
const dkd_use_state = React.useState;

const dkd_city_tower_heights = [54, 88, 68, 106, 74, 124, 92, 132, 72, 112, 82, 98, 64, 118, 78, 102];

const dkd_social_items = [
  { dkd_label: "Google", dkd_icon: "fa-brands fa-google" },
  { dkd_label: "Apple", dkd_icon: "fa-brands fa-apple" },
  { dkd_label: "Instagram", dkd_icon: "fa-brands fa-instagram" }
];

function dkd_icon(dkd_class_name) {
  return dkd_create_element("i", { className: dkd_class_name, "aria-hidden": "true" });
}

function dkd_city_skyline() {
  return dkd_create_element(
    "div",
    { className: "dkd-skyline", "aria-hidden": "true" },
    dkd_create_element(
      "div",
      { className: "dkd-city-row" },
      dkd_city_tower_heights.map((dkd_height, dkd_index) =>
        dkd_create_element("div", {
          className: "dkd-city-tower",
          key: `dkd_city_tower_${dkd_index}`,
          style: { height: `${dkd_height}px` }
        })
      )
    )
  );
}

function dkd_hero_section() {
  return dkd_create_element(
    "section",
    { className: "dkd-hero", "aria-label": "Anyela Born Club tanıtım alanı" },
    dkd_create_element("div", { className: "dkd-hero-grid", "aria-hidden": "true" }),
    dkd_create_element("div", { className: "dkd-miami-sun", "aria-hidden": "true" }),
    dkd_city_skyline(),
    dkd_create_element("div", { className: "dkd-water-reflection", "aria-hidden": "true" }),
    dkd_create_element("div", { className: "dkd-palm-left", "aria-hidden": "true" }),
    dkd_create_element("div", { className: "dkd-palm-right", "aria-hidden": "true" }),
    dkd_create_element(
      "div",
      { className: "dkd-hero-content" },
      dkd_create_element(
        "div",
        { className: "dkd-brand", "aria-label": "Anyela Born Club" },
        dkd_create_element(
          "div",
          { className: "dkd-brand-script" },
          "Anyela",
          dkd_create_element("span", { className: "dkd-heart" }, "♡")
        ),
        dkd_create_element("div", { className: "dkd-brand-sub" }, "BORN CLUB")
      ),
      dkd_create_element(
        "figure",
        { className: "dkd-anyela-frame" },
        dkd_create_element("img", {
          className: "dkd-anyela-image",
          src: "./assets/anyela-born-yacht.jpg",
          alt: "Anyela Born Miami temalı premium club görseli"
        })
      ),
      dkd_create_element(
        "div",
        { className: "dkd-welcome" },
        dkd_create_element(
          "h1",
          { className: "dkd-welcome-title" },
          "Anyela Born Club’a",
          dkd_create_element("span", null, "Hoş Geldin♡")
        ),
        dkd_create_element(
          "p",
          { className: "dkd-welcome-copy" },
          "Özel içerikler, sınırsız sohbet ve benzersiz anlar seni bekliyor."
        )
      ),
      dkd_create_element(
        "aside",
        { className: "dkd-premium-card", "aria-label": "Premium üyelik" },
        dkd_create_element("div", { className: "dkd-premium-icon" }, dkd_icon("fa-regular fa-gem")),
        dkd_create_element(
          "div",
          null,
          dkd_create_element("p", { className: "dkd-premium-title" }, "PREMIUM ÜYELİK"),
          dkd_create_element("p", { className: "dkd-premium-copy" }, "Sadece üyeler için özel ayrıcalıklar")
        )
      )
    )
  );
}

function dkd_auth_section() {
  const [dkd_active_tab, dkd_set_active_tab] = dkd_use_state("login");
  const [dkd_password_visible, dkd_set_password_visible] = dkd_use_state(false);

  function dkd_handle_form_submit(dkd_event) {
    dkd_event.preventDefault();
    window.alert("Anyela Born Club giriş altyapısı bağlanmaya hazır. Supabase/Auth bağlantısı sonraki adımda eklenecek.");
  }

  function dkd_select_login() {
    dkd_set_active_tab("login");
  }

  function dkd_select_register() {
    dkd_set_active_tab("register");
  }

  function dkd_toggle_password() {
    dkd_set_password_visible(!dkd_password_visible);
  }

  return dkd_create_element(
    "section",
    { className: "dkd-auth-card", "aria-label": "Anyela Born Club giriş formu" },
    dkd_create_element(
      "div",
      { className: "dkd-auth-tabs", role: "tablist" },
      dkd_create_element(
        "button",
        {
          className: `dkd-tab-button ${dkd_active_tab === "login" ? "dkd-active" : ""}`,
          type: "button",
          role: "tab",
          "aria-selected": dkd_active_tab === "login",
          onClick: dkd_select_login
        },
        dkd_icon("fa-regular fa-user"),
        "GİRİŞ YAP"
      ),
      dkd_create_element(
        "button",
        {
          className: `dkd-tab-button ${dkd_active_tab === "register" ? "dkd-active" : ""}`,
          type: "button",
          role: "tab",
          "aria-selected": dkd_active_tab === "register",
          onClick: dkd_select_register
        },
        dkd_icon("fa-solid fa-user-plus"),
        "ÜYE OL"
      )
    ),
    dkd_create_element(
      "form",
      { className: "dkd-form", onSubmit: dkd_handle_form_submit },
      dkd_create_element(
        "label",
        { className: "dkd-input-wrap" },
        dkd_create_element("span", { className: "dkd-input-icon" }, dkd_icon("fa-regular fa-user")),
        dkd_create_element("input", {
          className: "dkd-field",
          type: "text",
          autoComplete: "username",
          placeholder: "E-posta veya kullanıcı adı",
          "aria-label": "E-posta veya kullanıcı adı"
        })
      ),
      dkd_create_element(
        "label",
        { className: "dkd-input-wrap" },
        dkd_create_element("span", { className: "dkd-input-icon" }, dkd_icon("fa-solid fa-lock")),
        dkd_create_element("input", {
          className: "dkd-field",
          type: dkd_password_visible ? "text" : "password",
          autoComplete: dkd_active_tab === "login" ? "current-password" : "new-password",
          placeholder: "Şifre",
          "aria-label": "Şifre"
        }),
        dkd_create_element(
          "button",
          {
            className: "dkd-eye-button",
            type: "button",
            onClick: dkd_toggle_password,
            "aria-label": dkd_password_visible ? "Şifreyi gizle" : "Şifreyi göster"
          },
          dkd_icon(dkd_password_visible ? "fa-regular fa-eye-slash" : "fa-regular fa-eye")
        )
      ),
      dkd_create_element(
        "div",
        { className: "dkd-form-row" },
        dkd_create_element(
          "span",
          { className: "dkd-remember" },
          dkd_create_element("span", { className: "dkd-checkbox" }, dkd_icon("fa-solid fa-check")),
          "Beni Hatırla"
        ),
        dkd_create_element("a", { className: "dkd-forgot", href: "#sifremi-unuttum" }, "Şifremi Unuttum?")
      ),
      dkd_create_element(
        "button",
        { className: "dkd-submit", type: "submit" },
        dkd_create_element("span", null, dkd_active_tab === "login" ? "GİRİŞ YAP" : "ÜYE OL", dkd_icon("fa-solid fa-chevron-right"))
      ),
      dkd_create_element("div", { className: "dkd-separator" }, "Veya şununla devam et"),
      dkd_create_element(
        "div",
        { className: "dkd-social-row" },
        dkd_social_items.map((dkd_social_item) =>
          dkd_create_element(
            "button",
            {
              className: "dkd-social",
              type: "button",
              key: dkd_social_item.dkd_label,
              "aria-label": `${dkd_social_item.dkd_label} ile devam et`
            },
            dkd_icon(dkd_social_item.dkd_icon),
            dkd_create_element("span", null, dkd_social_item.dkd_label)
          )
        )
      ),
      dkd_create_element(
        "button",
        { className: "dkd-outline-join", type: "button", onClick: dkd_select_register },
        "ÜYE OL",
        dkd_icon("fa-solid fa-user-plus")
      ),
      dkd_create_element(
        "div",
        { className: "dkd-safe-card" },
        dkd_create_element("div", { className: "dkd-safe-icon" }, dkd_icon("fa-solid fa-shield-halved")),
        dkd_create_element(
          "div",
          null,
          dkd_create_element("p", { className: "dkd-safe-title" }, "%100 Güvenli & Özel"),
          dkd_create_element("p", { className: "dkd-safe-copy" }, "Tüm bilgileriniz gizli tutulur. Sadece üyeler için özel bir dünya.")
        ),
        dkd_create_element("div", { className: "dkd-line-art", "aria-hidden": "true" })
      )
    )
  );
}

function dkd_anyela_born_login_page() {
  return dkd_create_element(
    "div",
    { className: "dkd-page" },
    dkd_create_element(
      "div",
      { className: "dkd-phone-shell" },
      dkd_hero_section(),
      dkd_auth_section(),
      dkd_create_element(
        "p",
        { className: "dkd-note" },
        "Anyela Born dijital karakter deneyimidir. İçerikler eğlence, sosyal etkileşim ve yaratıcı konsept üretimi amaçlıdır."
      )
    )
  );
}

const dkd_root_element = document.getElementById("dkd_anyela_born_root");
const dkd_react_root = ReactDOM.createRoot(dkd_root_element);
dkd_react_root.render(dkd_create_element(dkd_anyela_born_login_page));
