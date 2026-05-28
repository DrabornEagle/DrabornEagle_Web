const dkd_anyela_state = {
  selectedPackageName: localStorage.getItem("dkd_anyela_selected_package_name") || "",
  selectedPackageInfo: localStorage.getItem("dkd_anyela_selected_package_info") || ""
};

const dkd_anyela_screen_nodes = document.querySelectorAll("[data-dkd-screen]");
const dkd_anyela_nav_nodes = document.querySelectorAll("[data-dkd-goto]");
const dkd_anyela_chat_box = document.getElementById("dkd_anyela_chat_box");
const dkd_anyela_chat_form = document.getElementById("dkd_anyela_chat_form");
const dkd_anyela_chat_input = document.getElementById("dkd_anyela_chat_input");
const dkd_anyela_selected_package = document.getElementById("dkd_anyela_selected_package");
const dkd_anyela_order_package = document.getElementById("dkd_anyela_order_package");

function dkd_anyela_set_screen(dkd_screen_name) {
  dkd_anyela_screen_nodes.forEach(function dkd_anyela_toggle_screen(dkd_screen_node) {
    const dkd_screen_key = dkd_screen_node.getAttribute("data-dkd-screen");
    dkd_screen_node.classList.toggle("dkd_anyela_screen_active", dkd_screen_key === dkd_screen_name);
  });

  dkd_anyela_nav_nodes.forEach(function dkd_anyela_toggle_nav(dkd_nav_node) {
    const dkd_nav_key = dkd_nav_node.getAttribute("data-dkd-goto");
    dkd_nav_node.classList.toggle("dkd_anyela_nav_active", dkd_nav_key === dkd_screen_name);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function dkd_anyela_render_selected_package() {
  if (!dkd_anyela_state.selectedPackageName) {
    dkd_anyela_selected_package.textContent = "Paket seçilmedi. Paketler ekranından bir paket seçebilirsin.";
    dkd_anyela_order_package.textContent = "Paket seçilmedi";
    return;
  }

  dkd_anyela_selected_package.textContent = "Seçili paket: " + dkd_anyela_state.selectedPackageName + " • " + dkd_anyela_state.selectedPackageInfo;
  dkd_anyela_order_package.textContent = dkd_anyela_state.selectedPackageName;
}

function dkd_anyela_add_message(dkd_message_text, dkd_message_owner) {
  const dkd_message_node = document.createElement("div");
  dkd_message_node.className = "dkd_anyela_message " + dkd_message_owner;
  dkd_message_node.textContent = dkd_message_text;
  dkd_anyela_chat_box.appendChild(dkd_message_node);
  dkd_anyela_chat_box.scrollTop = dkd_anyela_chat_box.scrollHeight;
}

function dkd_anyela_handle_package_select(dkd_package_button) {
  const dkd_package_name = dkd_package_button.getAttribute("data-dkd-package");
  const dkd_package_info = dkd_package_button.getAttribute("data-dkd-price");

  dkd_anyela_state.selectedPackageName = dkd_package_name;
  dkd_anyela_state.selectedPackageInfo = dkd_package_info;

  localStorage.setItem("dkd_anyela_selected_package_name", dkd_package_name);
  localStorage.setItem("dkd_anyela_selected_package_info", dkd_package_info);

  dkd_anyela_render_selected_package();
  dkd_anyela_add_message("Paket seçildi: " + dkd_package_name + "\n" + dkd_package_info, "dkd_anyela_message_user");
  dkd_anyela_add_message("Harika seçim. Şimdi dekont yükleyebilir veya özel isteğini yazabilirsin.", "dkd_anyela_message_anyela");
  dkd_anyela_set_screen("chat");
}

function dkd_anyela_handle_file_upload(dkd_upload_input, dkd_upload_label) {
  const dkd_uploaded_file = dkd_upload_input.files && dkd_upload_input.files[0];

  if (!dkd_uploaded_file) {
    return;
  }

  dkd_anyela_add_message(dkd_upload_label + " yüklendi: " + dkd_uploaded_file.name, "dkd_anyela_message_user");
  dkd_anyela_add_message("Dosyan alındı. İlk sürümde dosya manuel incelenip sipariş sürecine eklenecek.", "dkd_anyela_message_anyela");
}

dkd_anyela_nav_nodes.forEach(function dkd_anyela_bind_nav(dkd_nav_node) {
  dkd_nav_node.addEventListener("click", function dkd_anyela_nav_click() {
    const dkd_target_screen = dkd_nav_node.getAttribute("data-dkd-goto");
    dkd_anyela_set_screen(dkd_target_screen);
  });
});

document.querySelectorAll("[data-dkd-package]").forEach(function dkd_anyela_bind_package(dkd_package_button) {
  dkd_package_button.addEventListener("click", function dkd_anyela_package_click() {
    dkd_anyela_handle_package_select(dkd_package_button);
  });
});

dkd_anyela_chat_form.addEventListener("submit", function dkd_anyela_submit_chat(dkd_submit_event) {
  dkd_submit_event.preventDefault();

  const dkd_message_text = dkd_anyela_chat_input.value.trim();

  if (!dkd_message_text) {
    return;
  }

  dkd_anyela_add_message(dkd_message_text, "dkd_anyela_message_user");
  dkd_anyela_chat_input.value = "";

  setTimeout(function dkd_anyela_mock_reply() {
    dkd_anyela_add_message("Mesajın alındı. İlk sürümde Anyela cevabı manuel hazırlanıp bu chat ekranına eklenecek.", "dkd_anyela_message_anyela");
  }, 500);
});

document.getElementById("dkd_anyela_audio_upload").addEventListener("change", function dkd_anyela_audio_change(dkd_upload_event) {
  dkd_anyela_handle_file_upload(dkd_upload_event.target, "Ses dosyası");
});

document.getElementById("dkd_anyela_image_upload").addEventListener("change", function dkd_anyela_image_change(dkd_upload_event) {
  dkd_anyela_handle_file_upload(dkd_upload_event.target, "Görsel");
});

document.getElementById("dkd_anyela_video_upload").addEventListener("change", function dkd_anyela_video_change(dkd_upload_event) {
  dkd_anyela_handle_file_upload(dkd_upload_event.target, "Video");
});

document.getElementById("dkd_anyela_receipt_upload").addEventListener("change", function dkd_anyela_receipt_change(dkd_upload_event) {
  dkd_anyela_handle_file_upload(dkd_upload_event.target, "Dekont");
});

dkd_anyela_render_selected_package();
