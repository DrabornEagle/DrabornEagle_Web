(function dkd_anyela_miami_login_bootstrap() {
  "use strict";

  const dkd_document_ref = document;
  const dkd_login_tab_button = dkd_document_ref.getElementById("dkd_anyela_login_tab");
  const dkd_join_tab_button = dkd_document_ref.getElementById("dkd_anyela_join_tab");
  const dkd_join_big_button = dkd_document_ref.getElementById("dkd_anyela_join_big");
  const dkd_primary_submit_button = dkd_document_ref.getElementById("dkd_anyela_primary_submit");
  const dkd_identity_input = dkd_document_ref.getElementById("dkd_anyela_identity_input");
  const dkd_password_input = dkd_document_ref.getElementById("dkd_anyela_password_input");
  const dkd_password_toggle_button = dkd_document_ref.getElementById("dkd_anyela_password_toggle");
  const dkd_login_form = dkd_document_ref.getElementById("dkd_anyela_login_form");
  const dkd_toast_box = dkd_document_ref.getElementById("dkd_anyela_toast");
  const dkd_social_buttons = dkd_document_ref.querySelectorAll("[data-dkd-provider]");

  let dkd_active_mode = "login";
  let dkd_toast_timer_id = 0;

  function dkd_show_toast(dkd_message_text) {
    window.clearTimeout(dkd_toast_timer_id);
    dkd_toast_box.textContent = dkd_message_text;
    dkd_toast_box.classList.add("dkd_anyela_toast_active");
    dkd_toast_timer_id = window.setTimeout(function dkd_hide_toast_later() {
      dkd_toast_box.classList.remove("dkd_anyela_toast_active");
    }, 2600);
  }

  function dkd_apply_mode(dkd_next_mode) {
    dkd_active_mode = dkd_next_mode === "join" ? "join" : "login";
    const dkd_is_join_mode = dkd_active_mode === "join";

    dkd_login_tab_button.classList.toggle("dkd_anyela_tab_active", !dkd_is_join_mode);
    dkd_join_tab_button.classList.toggle("dkd_anyela_tab_active", dkd_is_join_mode);
    dkd_login_tab_button.setAttribute("aria-selected", String(!dkd_is_join_mode));
    dkd_join_tab_button.setAttribute("aria-selected", String(dkd_is_join_mode));

    dkd_identity_input.placeholder = dkd_is_join_mode ? "E-posta veya kullanıcı adı oluştur" : "E-posta veya kullanıcı adı";
    dkd_password_input.placeholder = dkd_is_join_mode ? "Güvenli şifre oluştur" : "Şifre";
    dkd_password_input.setAttribute("autocomplete", dkd_is_join_mode ? "new-password" : "current-password");
    dkd_primary_submit_button.querySelector("span").textContent = dkd_is_join_mode ? "ÜYE OL" : "GİRİŞ YAP";
    dkd_join_big_button.style.display = dkd_is_join_mode ? "none" : "flex";
  }

  function dkd_handle_tab_click(dkd_click_event) {
    const dkd_clicked_button = dkd_click_event.currentTarget;
    const dkd_next_mode = dkd_clicked_button.getAttribute("data-dkd-mode") || "login";
    dkd_apply_mode(dkd_next_mode);
  }

  function dkd_toggle_password_visibility() {
    const dkd_next_type = dkd_password_input.type === "password" ? "text" : "password";
    dkd_password_input.type = dkd_next_type;
    dkd_show_toast(dkd_next_type === "text" ? "Şifre görünür yapıldı." : "Şifre gizlendi.");
  }

  function dkd_handle_form_submit(dkd_submit_event) {
    dkd_submit_event.preventDefault();
    const dkd_identity_value = dkd_identity_input.value.trim();
    const dkd_password_value = dkd_password_input.value.trim();

    if (!dkd_identity_value || !dkd_password_value) {
      dkd_show_toast("Lütfen e-posta/kullanıcı adı ve şifre alanlarını doldur.");
      return;
    }

    dkd_show_toast(dkd_active_mode === "join" ? "Üyelik akışı hazır. Backend bağlantısı eklenince aktif olacak." : "Giriş arayüzü hazır. Backend bağlantısı eklenince aktif olacak.");
  }

  function dkd_handle_social_click(dkd_click_event) {
    const dkd_provider_name = dkd_click_event.currentTarget.getAttribute("data-dkd-provider") || "Sosyal giriş";
    dkd_show_toast(dkd_provider_name + " bağlantısı için hazır buton eklendi.");
  }

  dkd_login_tab_button.addEventListener("click", dkd_handle_tab_click);
  dkd_join_tab_button.addEventListener("click", dkd_handle_tab_click);
  dkd_join_big_button.addEventListener("click", function dkd_handle_big_join_click() {
    dkd_apply_mode("join");
    dkd_identity_input.focus();
  });
  dkd_password_toggle_button.addEventListener("click", dkd_toggle_password_visibility);
  dkd_login_form.addEventListener("submit", dkd_handle_form_submit);
  dkd_social_buttons.forEach(function dkd_register_social_button(dkd_social_button) {
    dkd_social_button.addEventListener("click", dkd_handle_social_click);
  });

  dkd_apply_mode("login");
})();
