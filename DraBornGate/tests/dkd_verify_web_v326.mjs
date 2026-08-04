import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.6.guard.js');
const dkdUi = dkdRead('assets/v3.2.6.js');
const dkdCss = dkdRead('assets/v3.2.6.css');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdSw = dkdRead('sw.js');
const dkdWorkflow = fs.readFileSync(path.resolve(dkdRoot, '..', '.github/workflows/draborngate-web-v2-4.yml'), 'utf8');

for (const [dkdName, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
  ['yükleyici', dkdApp],
  ['sürüm koruması', dkdGuard],
  ['arayüz düzeltmesi', dkdUi],
  ['manifest', dkdManifest],
  ['service worker', dkdSw],
  ['workflow', dkdWorkflow],
]) assert.match(dkdSource, /3\.2\.6/, `${dkdName} v3.2.6 içermeli`);

assert.match(dkdApp, /const DKD_WEB_VERSION = '3\.2\.6'/);
assert.match(dkdApp, /v3\.2\.6\.guard\.js/);
assert.match(dkdApp, /v3\.2\.5\.js/);
assert.match(dkdApp, /v3\.2\.6\.css/);
assert.match(dkdApp, /v3\.2\.6\.js/);
assert.match(dkdApp, /dkdBootWebV326\(\)\.catch/);

assert.match(dkdSimpleIndex, /dkd-v326-simple-preboot/);
assert.match(dkdSimpleIndex, /document\.documentElement\.classList\.add\('dkd-v326-simple-preboot'\)/);
assert.match(dkdCss, /html\.dkd-v326-simple-preboot #dkd-app/);
assert.match(dkdUi, /dataset\.dkdV326Ready = 'true'/);
assert.match(dkdUi, /classList\.remove\('dkd-v326-simple-preboot'\)/);

assert.match(dkdUi, /dkdV326RemoveLegacyEarnings/);
assert.match(dkdUi, /!== 'kazancim'/);
assert.match(dkdUi, /dkdV326LegacyEarnings/);
assert.match(dkdCss, /data-dkd-v326-legacy-earnings/);

assert.match(dkdUi, /dkdV326MountCompactSiteSearch/);
assert.match(dkdUi, /dkd-v326-site-search/);
assert.match(dkdUi, /Site adı veya şehir yazarak ara/);
assert.match(dkdUi, /data-dkd-v326-site-value/);
assert.match(dkdCss, /\.dkd-v326-site-search/);
assert.match(dkdCss, /\.dkd-v326-site-results/);
assert.match(dkdCss, /dkd-v326-legacy-site-search/);

assert.match(dkdUi, /window\.addEventListener\('pointerup'/);
assert.match(dkdUi, /window\.addEventListener\('click'/);
assert.match(dkdUi, /stopImmediatePropagation/);
assert.match(dkdUi, /findPass\(dkdCode\)/);
assert.match(dkdUi, /approvePass\(dkdCode\)/);
assert.match(dkdUi, /Kurye geçiş detayları/);
for (const dkdField of ['Telefon', 'Plaka', 'Platform', 'Sipariş', 'Gönderici', 'Müşteri', 'Site / Kapı', 'Tam Adres', 'Teslimat Notu']) {
  assert.match(dkdUi, new RegExp(dkdField));
}
assert.match(dkdCss, /\.dkd-v326-pass-panel/);
assert.match(dkdCss, /\.dkd-v326-pass-grid/);

const dkdManifestJson = JSON.parse(dkdManifest);
assert.equal(dkdManifestJson.name, 'DraBornGate Web v3.2.6');
assert.equal(dkdManifestJson.start_url, '/DraBornGate/?v=3.2.6');
assert.match(dkdSw, /draborngate-web-v3\.2\.6-clean-menu-compact-site-popup/);
for (const dkdAsset of ['v3.2.6.guard.js', 'v3.2.6.css', 'v3.2.6.js']) {
  assert.match(dkdSw, new RegExp(dkdAsset.replaceAll('.', '\\.')));
}
assert.match(dkdWorkflow, /DraBornGate Web v3\.2\.6 Verify/);
assert.match(dkdWorkflow, /dkd_verify_web_v326\.mjs/);

console.log('DraBornGate Web v3.2.6 menü temizliği, minimalist site araması, Sade Tema açılış koruması ve güvenilir kurye popup doğrulamaları geçti.');
