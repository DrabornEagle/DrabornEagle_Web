(function dkd_initialize_anyela_chat_room() {
  const dkd_package_from_storage = window.localStorage.getItem("dkd_anyela_selected_package");
  const dkd_package_name = dkd_package_from_storage || "Anyela Özel Sohbet Full Paket";
  const dkd_badge_element = document.getElementById("dkd_anyela_package_badge");
  const dkd_access_element = document.getElementById("dkd_anyela_access_text");
  const dkd_messages_element = document.getElementById("dkd_anyela_chat_messages");
  const dkd_form_element = document.getElementById("dkd_anyela_chat_form");
  const dkd_input_element = document.getElementById("dkd_anyela_chat_input");
  const dkd_prompt_buttons = document.querySelectorAll("[data-dkd-prompt]");

  if (dkd_badge_element) {
    dkd_badge_element.textContent = "💎 " + dkd_package_name;
  }

  if (dkd_access_element) {
    dkd_access_element.textContent = "Aktif demo oda";
  }

  function dkd_append_message(dkd_message_text, dkd_message_owner) {
    if (!dkd_messages_element) {
      return;
    }

    const dkd_message_element = document.createElement("div");
    dkd_message_element.className = "dkd_anyela_message " + (dkd_message_owner === "user" ? "dkd_anyela_message_user" : "dkd_anyela_message_anyela");
    dkd_message_element.textContent = dkd_message_text;
    dkd_messages_element.appendChild(dkd_message_element);
    dkd_messages_element.scrollTop = dkd_messages_element.scrollHeight;
  }

  function dkd_reply_to_user(dkd_user_text) {
    const dkd_clean_text = dkd_user_text.trim();
    if (!dkd_clean_text) {
      return;
    }

    dkd_append_message(dkd_clean_text, "user");
    window.setTimeout(function dkd_send_demo_reply() {
      dkd_append_message("Miami neon modundayım 🌴 Bu demo odada mesajını aldım. Gerçek paket ve canlı sohbet bağlantısı eklenince burası seçilen pakete göre özel yanıt verecek.", "anyela");
    }, 420);
  }

  if (dkd_form_element && dkd_input_element) {
    dkd_form_element.addEventListener("submit", function dkd_handle_chat_submit(dkd_event) {
      dkd_event.preventDefault();
      dkd_reply_to_user(dkd_input_element.value);
      dkd_input_element.value = "";
      dkd_input_element.focus();
    });
  }

  dkd_prompt_buttons.forEach(function dkd_bind_prompt_button(dkd_button_element) {
    dkd_button_element.addEventListener("click", function dkd_handle_prompt_click() {
      const dkd_prompt_text = dkd_button_element.getAttribute("data-dkd-prompt") || "";
      dkd_reply_to_user(dkd_prompt_text);
    });
  });
})();
