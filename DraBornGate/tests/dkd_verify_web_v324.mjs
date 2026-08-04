import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.4.guard.js');
const dkdUiLoader = dkdRead('assets/v3.2.4.js');
const dkdUi = zlib.gunzipSync(Buffer.from(dkdRead('assets/v3.2.4.js.payload.txt'), 'base64')).toString('utf8');
const dkdCss = zlib.gunzipSync(Buffer.from(dkdRead('assets/v3.2.4.css.payload.txt'), 'base64')).toString('utf8');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdSw = dkdRead('sw.js');
const dkdWorkflow = fs.readFileSync(path.resolve(dkdRoot, '..', '.github/workflows/draborngate-web-v2-4.yml'), 'utf8');

for (const [dkdName, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
  ['yükleyici', dkdApp],
  ['manifest', dkdManifest],
  ['service worker', dkdSw],
  ['workflow', dkdWorkflow],
]) {
  assert.match(dkdSource, /3\.2\.4/, `${dkdName} v3.2.4 içermeli`);
  assert.doesNotMatch(dkdSource, /3\.2\.2/, `${dkdName} eski görünür v3.2.2 sürümünü içermemeli`);
}

assert.match(dkdApp, /const DKD_WEB_VERSION = '3\.2\.4'/);
assert.match(dkdApp, /import\(`\.\/v3\.2\.4\.guard\.js\?v=\$\{DKD_WEB_VERSION\}`\)/);
assert.match(dkdApp, /dkdAppendPackedStyle\('\.\/assets\/v3\.2\.4\.css\.payload\.txt', 'dkdWebV324'\)/);
assert.match(dkdApp, /import\(`\.\/v3\.2\.4\.js\?v=\$\{DKD_WEB_VERSION\}`\)/);
assert.match(dkdApp, /dkdBootWebV324\(\)\.catch/);

assert.match(dkdUiLoader, /v3\.2\.4\.js\.payload\.txt/);
assert.match(dkdUiLoader, /new URL\('\.\/v3\.2\.4\.js\.payload\.txt', import\.meta\.url\)/);
assert.match(dkdUiLoader, /searchParams\.set\('v', DKD_V324_VERSION\)/);
assert.doesNotMatch(dkdUiLoader, /fetch\(`\.\/v3\.2\.4\.js\.payload\.txt/);
assert.match(dkdUiLoader, /DecompressionStream/);

assert.match(dkdGuard, /DKD_V324_VERSION = '3\.2\.4'/);
assert.match(dkdGuard, /__DKD_GATE_V324_ACTIVE__/);
assert.match(dkdGuard, /MutationObserver/);

assert.match(dkdUi, /draborneagle@gmail\.com/);
assert.match(dkdUi, /playreview@draborneagle\.com/);
assert.match(dkdUi, /Profil ve Bağlantı/);
assert.match(dkdUi, /data-dkd-v324-admin-menu/);
assert.match(dkdUi, /loadAdminCatalog/);
assert.match(dkdUi, /assignPartnerSite/);
assert.match(dkdUi, /adminLastAttempt/);

assert.match(dkdUi, /openQueueCategories: new Set\(\)/);
assert.match(dkdUi, /queueCategoriesInitialised/);
assert.match(dkdUi, /dkdCategory\.removeAttribute\('open'\)/);
assert.match(dkdUi, /dkdCopy\?\.querySelector\(':scope > p'\)\?\.remove\(\)/);
assert.doesNotMatch(dkdUi, /6 haneli eşleştirme kodunu girin/);

assert.match(dkdUi, /dkd-v324-pass-modal/);
assert.match(dkdUi, /Kurye, araç, platform, müşteri, sipariş, adres, mesafe/);
assert.match(dkdUi, /<span>Kurye<\/span><span>Araç<\/span><span>Sipariş<\/span><span>Tam Adres<\/span>/);

for (const dkdStat of ['Tamamlanan', 'Aktif Geçiş', 'Aktif Site']) assert.match(dkdUi, new RegExp(dkdStat));
assert.match(dkdUi, /dkd-v324-minimal-stat/);
assert.match(dkdUi, /dkd-v324-hidden-courier-site/);
assert.match(dkdUi, /dkdV324IsNewPassPage/);
assert.match(dkdUi, /Site seçilmedi — arama yapın/);
assert.match(dkdUi, /data-dkd-site/);
assert.match(dkdUi, /data-dkd-v324-site/);
assert.match(dkdUi, /dkdV324SetSelectValue\(dkdSelect, ''\)/);

for (const dkdSelector of [
  '.dkd-v324-finder',
  '.dkd-v31-queue-category',
  '.dkd-v324-pass-modal',
  '.dkd-v324-minimal-stat',
  '.dkd-v324-admin-menu',
  '.dkd-v324-site-search',
]) assert.ok(dkdCss.includes(dkdSelector), `${dkdSelector} CSS içinde bulunmalı`);
assert.match(dkdCss, /@keyframes dkdV324FinderLine/);
assert.match(dkdCss, /font-size:clamp\(30px,4vw,44px\)/);
assert.doesNotMatch(dkdCss, /body\.dkd-v324-active\s+body\.dkd-v324-active/);

const dkdManifestJson = JSON.parse(dkdManifest);
assert.equal(dkdManifestJson.name, 'DraBornGate Web v3.2.4');
assert.equal(dkdManifestJson.start_url, '/DraBornGate/?v=3.2.4');

assert.match(dkdSw, /draborngate-web-v3\.2\.4-admin-simple-courier-site-flow/);
assert.match(dkdSw, /v3\.2\.4\.guard\.js\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.css\.payload\.txt\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.js\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.js\.payload\.txt\?v=3\.2\.4/);
assert.match(dkdSw, /new Request\(dkdEvent\.request, \{ cache: 'no-store' \}\)/);
assert.match(dkdSw, /dkdKey\.startsWith\('draborngate-web-'\)/);

assert.match(dkdWorkflow, /DraBornGate Web v3\.2\.4 Verify/);
assert.match(dkdWorkflow, /node --check DraBornGate\/assets\/v3\.2\.4\.js/);
assert.match(dkdWorkflow, /node DraBornGate\/tests\/dkd_verify_web_v324\.mjs/);

console.log('DraBornGate Web v3.2.4 Admin, Sade Tema, kurye popup, minimalist istatistik, aramalı site seçimi ve payload yol doğrulamaları geçti.');
