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
const dkdBootUnlock = dkdRead('assets/v3.2.7.boot-unlock.js');
const dkdGuard = dkdRead('assets/v3.2.7.guard.js');
const dkdLoader = dkdRead('assets/v3.2.7.js');
const dkdFeatures = dkdRead('assets/v3.2.7.features.js');
const dkdCss = dkdRead('assets/v3.2.7.css');
const dkdDataCompat = dkdRead('assets/v3.2.1.data.js');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdServiceWorker = dkdRead('sw.js');
const dkdWorkflow = fs.readFileSync(path.resolve(dkdRoot, '..', '.github/workflows/draborngate-web-v2-4.yml'), 'utf8');

for (const [dkdLabel, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
  ['app', dkdApp],
  ['başlangıç kilit açıcı', dkdBootUnlock],
  ['guard', dkdGuard],
  ['loader', dkdLoader],
  ['özellikler', dkdFeatures],
  ['CSS', dkdCss],
  ['veri uyumluluğu', dkdDataCompat],
  ['manifest', dkdManifest],
  ['service worker', dkdServiceWorker],
  ['workflow', dkdWorkflow],
]) {
  assert.match(dkdSource, /3\.2\.7/, `${dkdLabel} v3.2.7 içermeli`);
}

assert.match(dkdApp, /const DKD_WEB_VERSION = '3\.2\.7'/);
assert.match(dkdApp, /draborngate-web-v3\.2\.7-clean-menu-site-popup/);
assert.match(dkdApp, /v3\.2\.7\.guard\.js/);
assert.match(dkdApp, /v3\.2\.7\.css/);
assert.match(dkdApp, /v3\.2\.7\.js/);
assert.match(dkdApp, /dkdWaitForV327SimpleReady/);
assert.match(dkdApp, /dataset\.dkdV327Ready/);
assert.match(dkdApp, /dkdBootWebV327\(\)\.catch/);
assert.doesNotMatch(dkdApp, /dkdBootWebV325\(\)\.catch/);

assert.match(dkdBootUnlock, /__DKD_GATE_V327_BOOT_UNLOCK__/);
assert.match(dkdBootUnlock, /Object\.defineProperty\(caches, 'keys'/);
assert.match(dkdBootUnlock, /Object\.defineProperty\(navigator\.serviceWorker, 'register'/);
assert.match(dkdBootUnlock, /return Promise\.resolve\(\[\]\)/);
assert.match(dkdBootUnlock, /return Promise\.resolve\(dkdFacade\)/);
assert.match(dkdBootUnlock, /Promise\.allSettled/);

assert.match(dkdGuard, /__DKD_GATE_V327_ACTIVE__/);
assert.match(dkdGuard, /dataset\.dkdV327Active/);
assert.match(dkdGuard, /#dkd-v28-root/);

assert.match(dkdLoader, /v3\.2\.5\.stability\.js/);
assert.match(dkdLoader, /v3\.2\.4\.js\.payload\.txt/);
assert.match(dkdLoader, /v3\.2\.5\.session\.js\.payload\.txt/);
assert.match(dkdLoader, /v3\.2\.5\.features\.js\.payload\.txt/);
assert.match(dkdLoader, /v3\.2\.7\.features\.js/);

assert.match(dkdFeatures, /dkdV327RemoveDuplicateEarnings/);
assert.match(dkdFeatures, /dkdLabel !== 'kazancim'/);
assert.match(dkdFeatures, /dkdV327CompactSiteSearch/);
assert.match(dkdFeatures, /dkd-v327-site-search/);
assert.match(dkdFeatures, /Site adı veya şehir ile ara/);
assert.match(dkdFeatures, /dkdV327BindFinderCapture/);
assert.match(dkdFeatures, /kuryeni bul ve eslestir/);
assert.match(dkdFeatures, /findPass\(dkdCode\)/);
assert.match(dkdFeatures, /approvePass\(dkdCode\)/);
assert.match(dkdFeatures, /Kurye geçiş detayları/);
for (const dkdField of ['Telefon', 'Plaka', 'Platform', 'Sipariş', 'Gönderici', 'Müşteri', 'Site', 'Tam Adres', 'Teslimat Notu']) {
  assert.match(dkdFeatures, new RegExp(dkdField));
}
assert.match(dkdFeatures, /dkdV327RemoveLegacySimpleShell/);
assert.match(dkdFeatures, /dkd-v28-simple-active/);

for (const dkdSelector of [
  '.dkd-v327-site-search',
  '.dkd-v327-modal',
  '.dkd-v327-panel',
  '.dkd-v327-grid',
  'html[data-dkd-v327-active="true"] #dkd-v28-root',
]) {
  assert.ok(dkdCss.includes(dkdSelector), `${dkdSelector} CSS içinde bulunmalı`);
}

for (const [dkdLabel, dkdSource] of [['ana index', dkdIndex], ['sade tema index', dkdSimpleIndex]]) {
  assert.match(dkdSource, /v3\.2\.7\.boot-unlock\.js\?v=3\.2\.7-r2/, `${dkdLabel} kilit açıcıyı önce yüklemeli`);
  assert.match(dkdSource, /app\.js\?v=3\.2\.7-r2/, `${dkdLabel} hotfix cache anahtarı kullanmalı`);
  assert.ok(
    dkdSource.indexOf('v3.2.7.boot-unlock.js') < dkdSource.indexOf('type="module" src="./assets/app.js'),
    `${dkdLabel} kilit açıcıyı app.js öncesinde çalıştırmalı`
  );
}
assert.match(dkdSimpleIndex, /dkd-v327-inline-hide/);
assert.match(dkdSimpleIndex, /#dkd-v28-root\{display:none!important/);
assert.match(dkdDataCompat, /DKD_V321_COMPAT_VERSION = '3\.2\.7'/);

const dkdManifestJson = JSON.parse(dkdManifest);
assert.equal(dkdManifestJson.name, 'DraBornGate Web v3.2.7');
assert.equal(dkdManifestJson.start_url, '/DraBornGate/?v=3.2.7');

assert.match(dkdServiceWorker, /draborngate-web-v3\.2\.7-clean-menu-site-popup-boot-r2/);
assert.match(dkdServiceWorker, /v3\.2\.7\.boot-unlock\.js\?v=3\.2\.7-r2/);
assert.match(dkdServiceWorker, /app\.js\?v=3\.2\.7-r2/);
assert.match(dkdServiceWorker, /Promise\.allSettled/);
assert.doesNotMatch(dkdServiceWorker, /dkdCache\.addAll\(DKD_ASSETS\)/);
for (const dkdAsset of ['v3.2.7.guard.js', 'v3.2.7.css', 'v3.2.7.js', 'v3.2.7.features.js']) {
  assert.match(dkdServiceWorker, new RegExp(dkdAsset.replaceAll('.', '\\.')));
}
assert.match(dkdWorkflow, /DraBornGate Web v3\.2\.7 Verify/);
assert.match(dkdWorkflow, /v3\.2\.7\.boot-unlock\.js/);
assert.match(dkdWorkflow, /dkd_verify_web_v327\.mjs/);

console.log('DraBornGate Web v3.2.7 başlangıç kilidi, menü, kompakt site arama, Sade Tema ve detay popup doğrulamaları geçti.');
