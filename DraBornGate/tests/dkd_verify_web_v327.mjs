import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdR4App = dkdRead('assets/app.v3.2.7-r4.js');
const dkdR4Loader = dkdRead('assets/v3.2.7-r4.js');
const dkdGuard = dkdRead('assets/v3.2.7.guard.js');
const dkdFeatures = dkdRead('assets/v3.2.7.features.js');
const dkdCss = dkdRead('assets/v3.2.7.css');
const dkdDataCompat = dkdRead('assets/v3.2.1.data.js');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorkflow = fs.readFileSync(
  path.resolve(dkdRoot, '..', '.github/workflows/draborngate-web-v2-4.yml'),
  'utf8'
);

for (const [dkdLabel, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
  ['r4 app', dkdR4App],
  ['r4 loader', dkdR4Loader],
  ['guard', dkdGuard],
  ['özellikler', dkdFeatures],
  ['CSS', dkdCss],
  ['veri uyumluluğu', dkdDataCompat],
  ['manifest', dkdManifest],
  ['workflow', dkdWorkflow],
]) {
  assert.match(dkdSource, /3\.2\.7/, `${dkdLabel} v3.2.7 içermeli`);
}

assert.match(dkdR4App, /const DKD_WEB_REVISION = '3\.2\.7-r4'/);
assert.match(dkdR4App, /dkdBootWebV327R4\(\)\.catch\(dkdShowBootError\)/);
assert.match(dkdR4App, /serviceWorker\.getRegistrations/);
assert.match(dkdR4App, /dkdRegistration\.unregister\(\)/);
assert.doesNotMatch(dkdR4App, /serviceWorker\.register/);
assert.doesNotMatch(dkdR4App, /DecompressionStream/);
assert.doesNotMatch(dkdR4App, /\.payload(?:\.|')/);

for (const dkdRuntime of [
  'app.v2.runtime.css',
  'app.v2.runtime.js',
  'v2.4.runtime.css',
  'v2.4.runtime.js',
  'v2.5.runtime.css',
  'v2.5.runtime.js',
  'v2.6.runtime.css',
  'v2.6.runtime.js',
  'v3.2.4.runtime.css',
  'v3.2.5.runtime.css',
  'v3.2.7-r4.js',
]) {
  assert.ok(dkdR4App.includes(dkdRuntime), `${dkdRuntime} r4 app içinde bulunmalı`);
}

for (const dkdRuntime of [
  'v3.2.4.runtime.js',
  'v3.2.5.session.runtime.js',
  'v3.2.5.features.runtime.js',
  'v3.2.7.features.js',
]) {
  assert.ok(dkdR4Loader.includes(dkdRuntime), `${dkdRuntime} r4 loader içinde bulunmalı`);
}
assert.doesNotMatch(dkdR4Loader, /payload/);
assert.doesNotMatch(dkdR4Loader, /DecompressionStream/);

assert.match(dkdGuard, /__DKD_GATE_V327_ACTIVE__/);
assert.match(dkdGuard, /dataset\.dkdV327Active/);
assert.match(dkdGuard, /#dkd-v28-root/);

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
for (const dkdField of [
  'Telefon',
  'Plaka',
  'Platform',
  'Sipariş',
  'Gönderici',
  'Müşteri',
  'Site',
  'Tam Adres',
  'Teslimat Notu',
]) {
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

for (const [dkdLabel, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
]) {
  assert.match(
    dkdSource,
    /app\.v3\.2\.7-r4\.js\?v=3\.2\.7-r4/,
    `${dkdLabel} r4 statik yükleyiciyi kullanmalı`
  );
  assert.doesNotMatch(dkdSource, /app\.v3\.2\.7-r3\.js/);
  assert.doesNotMatch(dkdSource, /v3\.2\.7\.boot-unlock\.js/);
}

assert.match(dkdSimpleIndex, /dkd-v327-inline-hide/);
assert.match(dkdSimpleIndex, /#dkd-v28-root\{display:none!important/);
assert.match(dkdDataCompat, /DKD_V321_COMPAT_VERSION = '3\.2\.7'/);

const dkdManifestJson = JSON.parse(dkdManifest);
assert.equal(dkdManifestJson.name, 'DraBornGate Web v3.2.7');
assert.equal(dkdManifestJson.start_url, '/DraBornGate/?v=3.2.7-r4');

assert.match(dkdWorkflow, /DraBornGate Web v3\.2\.7 Verify/);
assert.match(dkdWorkflow, /dkd_verify_web_v327\.mjs/);

console.log('DraBornGate Web v3.2.7-r4 statik açılış, menü, kompakt site arama, Sade Tema ve detay popup doğrulamaları geçti.');
