import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.4.guard.js');
const dkdData = dkdRead('assets/v3.2.4.data.js');
const dkdUi = dkdRead('assets/v3.2.4.js');
const dkdPatch = dkdRead('assets/v3.2.4.patch.js');
const dkdCss = dkdRead('assets/v3.2.4.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdSw = dkdRead('sw.js');

for (const [dkdName, dkdContent] of Object.entries({
  app: dkdApp,
  guard: dkdGuard,
  data: dkdData,
  ui: dkdUi,
  patch: dkdPatch,
  index: dkdIndex,
  simpleIndex: dkdSimpleIndex,
  manifest: dkdManifest,
  sw: dkdSw,
})) {
  assert.match(dkdContent, /3\.2\.4/, `${dkdName} v3.2.4 içermiyor.`);
}

assert.match(dkdApp, /v3\.2\.4\.guard\.js/);
assert.match(dkdApp, /v3\.2\.4\.data\.js/);
assert.match(dkdApp, /v3\.2\.4\.css/);
assert.match(dkdApp, /v3\.2\.4\.js/);
assert.match(dkdGuard, /__DKD_GATE_V324_ACTIVE__/);

assert.match(dkdData, /draborneagle@gmail\.com/);
assert.match(dkdData, /playreview@draborneagle\.com/);
assert.match(dkdData, /dkd_gate_admin_partner_catalog_v31/);
assert.match(dkdData, /dkd_v324_admin_verified/);

assert.match(dkdPatch, /categoryOpen:\s*\{\s*arrived:\s*false,\s*approaching:\s*false,\s*other:\s*false\s*\}/);
assert.match(dkdPatch, /dkdCopy\?\.querySelector\('p'\)\?\.remove\(\)/);
assert.match(dkdPatch, /dkd-v324-detail-popup/);
assert.match(dkdPatch, /dkd-v324-minimal-stat/);
assert.match(dkdPatch, /Kurye Merkezi/);
assert.match(dkdPatch, /Site adıyla ara ve seç/);
assert.match(dkdPatch, /dkdSelect\.value = ''/);
assert.match(dkdPatch, /window\.dkdV324IsAdminEmail/);

assert.match(dkdCss, /dkd-v324-premium-finder/);
assert.match(dkdCss, /dkd-v324-site-picker/);
assert.match(dkdCss, /dkd-v324-detail-panel/);
assert.match(dkdCss, /prefers-reduced-motion/);

assert.match(dkdSimpleIndex, /Güvenlik Sade Tema v3\.2\.4/);
assert.match(dkdManifest, /"start_url": "\/DraBornGate\/\?v=3\.2\.4"/);
assert.match(dkdSw, /draborngate-web-v3\.2\.4-courier-admin-premium/);
assert.doesNotMatch(dkdApp, /DKD_WEB_VERSION = '3\.2\.2'/);

console.log('DraBornGate Web v3.2.4 Admin, Sade Tema, popup, minimalist kartlar ve kurye site seçimi doğrulamaları geçti.');
