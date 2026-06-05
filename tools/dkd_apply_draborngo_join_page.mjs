import dkd_file_system_module from 'fs';

const dkd_download_page_path = 'DraBornGo/App/dkd_download.html';
const dkd_join_page_path = 'DraBornGo/App/dkd_join.html';

if (!dkd_file_system_module.existsSync(dkd_download_page_path)) {
  throw new Error(`DKD download page bulunamadı: ${dkd_download_page_path}`);
}

if (!dkd_file_system_module.existsSync(dkd_join_page_path)) {
  throw new Error(`DKD join page bulunamadı: ${dkd_join_page_path}`);
}

let dkd_download_page_value = dkd_file_system_module.readFileSync(dkd_download_page_path, 'utf8');

dkd_download_page_value = dkd_download_page_value
  .replace(/<style id="dkd_join_button_style">[\s\S]*?<\/style>/gi, '')
  .replace(/<script id="dkd_join_button_script">[\s\S]*?<\/script>/gi, '')
  .replace(/<a\b[^>]*class=["'][^"']*dkd_join_button[^"']*["'][\s\S]*?<\/a>/gi, '');

const dkd_join_style_value = `
<style id="dkd_join_button_style">
  .dkd_join_button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 50px !important;
    padding: 13px 18px !important;
    border-radius: 20px !important;
    border: 1px solid rgba(250, 204, 21, 0.55) !important;
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.98), rgba(251, 146, 60, 0.94)) !important;
    color: #111827 !important;
    font: 950 15px/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    letter-spacing: 0.01em !important;
    text-decoration: none !important;
    -webkit-tap-highlight-color: transparent !important;
  }

  .dkd_join_button:active {
    transform: scale(0.98) !important;
  }
</style>
`;

const dkd_join_script_value = `
<script id="dkd_join_button_script">
(function () {
  if (document.querySelector('.dkd_join_button')) {
    return;
  }

  const dkd_join_button = document.createElement('a');
  dkd_join_button.className = 'dkd_join_button';
  dkd_join_button.href = './dkd_join.html';
  dkd_join_button.textContent = 'Projeye Katıl';
  dkd_join_button.setAttribute('aria-label', 'DraBornGo kurye yatırım ortaklık bilgi sayfasını aç');

  const dkd_action_values = Array.from(document.querySelectorAll('a, button'));
  const dkd_release_button = dkd_action_values.find(function (dkd_action_value) {
    return (dkd_action_value.textContent || '').trim().includes('Sürüm Notları');
  });

  if (dkd_release_button && dkd_release_button.parentElement) {
    dkd_release_button.parentElement.appendChild(dkd_join_button);
    return;
  }

  const dkd_heading_values = Array.from(document.querySelectorAll('h1, h2, h3'));
  const dkd_download_heading = dkd_heading_values.find(function (dkd_heading_value) {
    return (dkd_heading_value.textContent || '').trim().includes('DraBornGo APK İndir');
  });

  if (dkd_download_heading && dkd_download_heading.parentElement) {
    dkd_download_heading.parentElement.appendChild(dkd_join_button);
    return;
  }

  document.body.appendChild(dkd_join_button);
})();
</script>
`;

if (!dkd_download_page_value.includes('dkd_join_button_style')) {
  dkd_download_page_value = dkd_download_page_value.replace('</head>', `${dkd_join_style_value}\n</head>`);
}

if (!dkd_download_page_value.includes('dkd_join_button_script')) {
  dkd_download_page_value = dkd_download_page_value.replace('</body>', `${dkd_join_script_value}\n</body>`);
}

dkd_file_system_module.writeFileSync(dkd_download_page_path, dkd_download_page_value);

console.log('DKD join page eklendi ve download sayfasına Projeye Katıl butonu bağlandı.');
