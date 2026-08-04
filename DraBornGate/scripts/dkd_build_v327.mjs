// DraBornGate Web v3.2.7 deterministik yayın üretimi
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdScriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdScriptDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdWrite = (dkdRelativePath, dkdContent) => fs.writeFileSync(path.join(dkdRoot, dkdRelativePath), dkdContent);
const dkdRequire = (dkdCondition, dkdMessage) => {
  if (!dkdCondition) throw new Error(dkdMessage);
};
const dkdReplaceRequired = (dkdSource, dkdOld, dkdNew, dkdLabel) => {
  dkdRequire(dkdSource.includes(dkdOld), `${dkdLabel} bulunamadı.`);
  return dkdSource.replace(dkdOld, dkdNew);
};

let dkdApp = dkdRead('assets/app.js');
dkdApp = dkdReplaceRequired(dkdApp, "const DKD_WEB_VERSION = '3.2.5';", "const DKD_WEB_VERSION = '3.2.7';", 'app sürümü');
dkdApp = dkdReplaceRequired(
  dkdApp,
  "const DKD_WEB_CACHE = 'draborngate-web-v3.2.5-stable-popup-admin-earnings';",
  "const DKD_WEB_CACHE = 'draborngate-web-v3.2.7-clean-menu-site-popup';",
  'app önbelleği'
);
dkdApp = dkdReplaceRequired(
  dkdApp,
  'async function dkdBootWebV325() {',
  `async function dkdWaitForV327SimpleReady() {
  if (!dkdIsSimpleModeRequested()) return;
  const dkdStartedAt = performance.now();
  while (performance.now() - dkdStartedAt < 2600) {
    document.querySelector('#dkd-v28-root')?.remove();
    document.body.classList.remove('dkd-v28-simple-active');
    const dkdReady = document.documentElement.dataset.dkdV327Ready === 'true';
    const dkdFinderReady = Boolean(document.querySelector('.dkd-v31-finder,.dkd-v324-finder'));
    if (dkdReady && dkdFinderReady) return;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 50));
  }
}

async function dkdBootWebV327() {`,
  'v3.2.7 açılış fonksiyonu'
);
dkdApp = dkdApp
  .replaceAll('v3.2.5 sürüm ve önbellek koruması', 'v3.2.7 sürüm ve önbellek koruması')
  .replaceAll("./v3.2.5.guard.js", "./v3.2.7.guard.js")
  .replaceAll('v3.2.5 modern arayüz hazırlanıyor', 'v3.2.7 modern arayüz hazırlanıyor')
  .replaceAll('v3.2.5 arayüz ve kurye akışı tamamlanıyor', 'v3.2.7 arayüz ve kurye akışı tamamlanıyor');
dkdApp = dkdReplaceRequired(
  dkdApp,
  `  await dkdAppendPackedStyle('./assets/v3.2.5.css.payload.txt', 'dkdWebV325');
  await import(\`./v3.2.5.js?v=\${DKD_WEB_VERSION}\`);
  dkdFinishBoot();
}

dkdBootWebV325().catch(dkdShowBootError);`,
  `  await dkdAppendPackedStyle('./assets/v3.2.5.css.payload.txt', 'dkdWebV325');
  await dkdAppendStyleLink('./assets/v3.2.7.css', 'dkdWebV327');
  await import(\`./v3.2.7.js?v=\${DKD_WEB_VERSION}\`);
  await dkdWaitForV327SimpleReady();
  dkdFinishBoot();
}

dkdBootWebV327().catch(dkdShowBootError);`,
  'v3.2.7 son yükleme bloğu'
);
dkdWrite('assets/app.js', dkdApp);

for (const dkdRelativePath of ['index.html', 'Guvenlik-Sade-Tema/index.html', 'manifest.webmanifest']) {
  let dkdSource = dkdRead(dkdRelativePath).replaceAll('3.2.5', '3.2.7');
  if (dkdRelativePath === 'Guvenlik-Sade-Tema/index.html' && !dkdSource.includes('dkd-v327-inline-hide')) {
    dkdSource = dkdSource.replace(
      '</style>',
      '    #dkd-v28-root{display:none!important;visibility:hidden!important;opacity:0!important}html{background:#030713}\n    /* dkd-v327-inline-hide */\n  </style>'
    );
  }
  dkdWrite(dkdRelativePath, dkdSource);
}

let dkdDataCompat = dkdRead('assets/v3.2.1.data.js');
dkdDataCompat = dkdDataCompat
  .replace("const DKD_V321_COMPAT_VERSION = '3.2.5';", "const DKD_V321_COMPAT_VERSION = '3.2.7';")
  .replaceAll('DraBornGate v3.2.5', 'DraBornGate v3.2.7');
dkdWrite('assets/v3.2.1.data.js', dkdDataCompat);

let dkdServiceWorker = dkdRead('sw.js');
dkdServiceWorker = dkdServiceWorker
  .replace(
    "const DKD_CACHE = 'draborngate-web-v3.2.5-stable-popup-admin-earnings';",
    "const DKD_CACHE = 'draborngate-web-v3.2.7-clean-menu-site-popup';"
  )
  .replaceAll('?v=3.2.5', '?v=3.2.7');
const dkdServiceWorkerAnchor = "  '/DraBornGate/assets/v3.2.5.css.payload.txt?v=3.2.7',";
dkdRequire(dkdServiceWorker.includes(dkdServiceWorkerAnchor), 'service worker v3.2.5 CSS satırı');
dkdServiceWorker = dkdServiceWorker.replace(
  dkdServiceWorkerAnchor,
  `${dkdServiceWorkerAnchor}
  '/DraBornGate/assets/v3.2.7.css?v=3.2.7',`
);
const dkdServiceWorkerScriptAnchor = "  '/DraBornGate/assets/v3.2.5.features.js.payload.txt?v=3.2.7',";
dkdRequire(dkdServiceWorker.includes(dkdServiceWorkerScriptAnchor), 'service worker v3.2.5 özellik satırı');
dkdServiceWorker = dkdServiceWorker.replace(
  dkdServiceWorkerScriptAnchor,
  `${dkdServiceWorkerScriptAnchor}
  '/DraBornGate/assets/v3.2.7.guard.js?v=3.2.7',
  '/DraBornGate/assets/v3.2.7.js?v=3.2.7',
  '/DraBornGate/assets/v3.2.7.features.js?v=3.2.7',`
);
dkdWrite('sw.js', dkdServiceWorker);

const dkdWorkflow = `name: DraBornGate Web v3.2.7 Verify

on:
  push:
    branches:
      - main
      - 'agent/**'
      - 'fix/**'
    paths:
      - 'DraBornGate/**'
      - '.github/workflows/draborngate-web-v2-4.yml'
  pull_request:
    branches: [main]
    paths:
      - 'DraBornGate/**'
      - '.github/workflows/draborngate-web-v2-4.yml'
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: draborngate-web-v3-2-7-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Kaynak kodu al
        uses: actions/checkout@v4
      - name: Node.js 22 kur
        uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: v3.2.7 yükleme yöneticisini doğrula
        run: node --check DraBornGate/assets/app.js
      - name: v3.2.7 sürüm korumasını doğrula
        run: node --check DraBornGate/assets/v3.2.7.guard.js
      - name: v3.2.7 ana yükleyicisini doğrula
        run: node --check DraBornGate/assets/v3.2.7.js
      - name: v3.2.7 düzeltme katmanını doğrula
        run: node --check DraBornGate/assets/v3.2.7.features.js
      - name: v3.2.5 kararlılık katmanını doğrula
        run: node --check DraBornGate/assets/v3.2.5.stability.js
      - name: Temel sıkıştırılmış modülleri doğrula
        shell: bash
        run: |
          base64 -d DraBornGate/assets/v3.2.5.session.js.payload.txt | gzip -dc > /tmp/dkd-v325-session.js
          base64 -d DraBornGate/assets/v3.2.5.features.js.payload.txt | gzip -dc > /tmp/dkd-v325-features.js
          node --check /tmp/dkd-v325-session.js
          node --check /tmp/dkd-v325-features.js
      - name: Güvenlik tema rol kontrolünü doğrula
        run: node --check DraBornGate/assets/v2.8.js
      - name: Veri başlangıcını doğrula
        run: node --check DraBornGate/assets/v3.2.1.data.js
      - name: Service worker sözdizimini doğrula
        run: node --check DraBornGate/sw.js
      - name: v3.2.7 kapsam testlerini çalıştır
        run: node DraBornGate/tests/dkd_verify_web_v327.mjs
`;
fs.writeFileSync(path.resolve(dkdRoot, '..', '.github/workflows/draborngate-web-v2-4.yml'), dkdWorkflow);

console.log('DraBornGate Web v3.2.7 üretimi tamamlandı.');
