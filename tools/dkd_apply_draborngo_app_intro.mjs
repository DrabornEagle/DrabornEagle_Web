const dkd_file_system_module = require('fs');
const dkd_path_module = require('path');

const dkd_app_directory_path = dkd_path_module.join('DraBornGo', 'App');
const dkd_index_path = dkd_path_module.join(dkd_app_directory_path, 'index.html');
const dkd_download_path = dkd_path_module.join(dkd_app_directory_path, 'dkd_download.html');
const dkd_intro_image_path = dkd_path_module.join(dkd_app_directory_path, 'dkd_draborngo_apk_intro.jpg');

if (!dkd_file_system_module.existsSync(dkd_app_directory_path)) {
  dkd_file_system_module.mkdirSync(dkd_app_directory_path, { recursive: true });
}

if (!dkd_file_system_module.existsSync(dkd_intro_image_path)) {
  throw new Error('DKD intro image missing: DraBornGo/App/dkd_draborngo_apk_intro.jpg');
}

if (!dkd_file_system_module.existsSync(dkd_download_path)) {
  if (dkd_file_system_module.existsSync(dkd_index_path)) {
    dkd_file_system_module.copyFileSync(dkd_index_path, dkd_download_path);
  } else {
    const dkd_fallback_download_html_value = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DraBornGo APK İndir</title>
</head>
<body style="margin:0;background:#050b15;color:#f6fbff;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px;">
  <main>
    <h1>DraBornGo APK İndir</h1>
    <p>Resmi APK indirme merkezi hazırlanıyor.</p>
    <a href="./dkd_draborngo_update_manifest.json" style="color:#7be6ff;font-weight:900;">Manifest</a>
  </main>
</body>
</html>
`;
    dkd_file_system_module.writeFileSync(dkd_download_path, dkd_fallback_download_html_value);
  }
}

const dkd_intro_html_value = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>DraBornGo APK</title>
  <meta name="description" content="DraBornGo APK giriş ekranı." />
  <style>
    :root {
      color-scheme: dark;
      --dkd_intro_background_value: #020713;
      --dkd_intro_focus_value: rgba(123, 230, 255, .86);
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html,
    body {
      margin: 0;
      min-width: 100%;
      min-height: 100%;
      background: var(--dkd_intro_background_value);
      overflow: hidden;
    }

    body {
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .dkd_intro_link {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      cursor: pointer;
      background: var(--dkd_intro_background_value);
      text-decoration: none;
      outline: none;
    }

    .dkd_intro_link:focus-visible {
      box-shadow: inset 0 0 0 4px var(--dkd_intro_focus_value);
    }

    .dkd_intro_image {
      display: block;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      max-width: 100vw;
      max-height: 100dvh;
      object-fit: contain;
      object-position: center center;
      user-select: none;
      pointer-events: none;
    }

    .dkd_intro_hint {
      position: fixed;
      left: 50%;
      bottom: max(14px, env(safe-area-inset-bottom));
      transform: translateX(-50%);
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 999px;
      padding: 9px 14px;
      background: rgba(0,0,0,.38);
      color: rgba(255,255,255,.90);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .2px;
      backdrop-filter: blur(10px);
      pointer-events: none;
    }
  </style>
</head>
<body>
  <a class="dkd_intro_link" href="./dkd_download.html" aria-label="DraBornGo APK indirme sayfasına geç">
    <img class="dkd_intro_image" src="./dkd_draborngo_apk_intro.jpg" alt="DraBornGo APK indir" decoding="async" fetchpriority="high" />
    <span class="dkd_intro_hint">Devam etmek için ekrana dokun</span>
  </a>
</body>
</html>
`;

dkd_file_system_module.writeFileSync(dkd_index_path, dkd_intro_html_value);

console.log('DKD DraBornGo APK intro page applied.');
console.log('DKD current APK page moved/copied to: DraBornGo/App/dkd_download.html');
console.log('DKD intro page path: DraBornGo/App/index.html');
