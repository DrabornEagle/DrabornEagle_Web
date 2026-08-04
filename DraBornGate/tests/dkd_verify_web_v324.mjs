import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdUnpack = (dkdRelativePath) => zlib.gunzipSync(Buffer.from(dkdRead(dkdRelativePath), 'base64')).toString('utf8');

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.4.guard.js');
const dkdCompatData = dkdRead('assets/v3.2.1.data.js');
const dkdDataBridge = dkdRead('assets/v3.2.4.data.js');
const dkdAuthLoader = dkdRead('assets/v3.2.4.auth.js');
const dkdAuth = dkdUnpack('assets/v3.2.4.auth.js.payload.txt');
const dkdUiLoader = dkdRead('assets/v3.2.4.js');
const dkdUi = dkdUnpack('assets/v3.2.4.js.payload.txt');
const dkdSessionLoader = dkdRead('assets/v3.2.4.session.js');
const dkdSession = dkdUnpack('assets/v3.2.4.session.js.payload.txt');
const dkdCss = dkdUnpack('assets/v3.2.4.css.payload.txt');
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

assert.match(dkdCompatData, /v3\.2\.4\.data\.js/);
assert.match(dkdCompatData, /v3\.2\.4\.auth\.js/);
assert.match(dkdCompatData, /refreshLock/);
assert.match(dkdDataBridge, /DKD_V324_RPC_PATTERN/);
assert.match(dkdDataBridge, /dkd_gate_\[a-z0-9_\]/);
assert.match(dkdDataBridge, /Content-Profile/);
assert.match(dkdDataBridge, /session-refresh-lock/);

assert.match(dkdAuthLoader, /new URL\('\.\/v3\.2\.4\.auth\.js\.payload\.txt', import\.meta\.url\)/);
assert.match(dkdAuthLoader, /DecompressionStream\('gzip'\)/);
assert.match(dkdAuth, /refreshPromise/);
assert.match(dkdAuth, /refreshBlockedUntil/);
assert.match(dkdAuth, /dkdV324ReadSession/);
assert.match(dkdAuth, /dkdV324WriteSession/);
assert.match(dkdAuth, /dkdV324LoadAdminCatalog/);
assert.match(dkdAuth, /dkdV324LoadQueue/);
assert.match(dkdAuth, /\/auth\/v1\/logout\?scope=local/);
assert.match(dkdAuth, /Object\.assign\(dkdV324AuthData/);
assert.doesNotMatch(dkdAuth, /setInterval\([^)]*refresh/i);

assert.match(dkdUiLoader, /v3\.2\.4\.js\.payload\.txt/);
assert.match(dkdUiLoader, /new URL\('\.\/v3\.2\.4\.js\.payload\.txt', import\.meta\.url\)/);
assert.match(dkdUiLoader, /searchParams\.set\('v', DKD_V324_VERSION\)/);
assert.doesNotMatch(dkdUiLoader, /fetch\(`\.\/v3\.2\.4\.js\.payload\.txt/);
assert.match(dkdUiLoader, /v3\.2\.4\.session\.js/);
assert.match(dkdUiLoader, /DecompressionStream/);

assert.match(dkdSessionLoader, /new URL\('\.\/v3\.2\.4\.session\.js\.payload\.txt', import\.meta\.url\)/);
assert.match(dkdSessionLoader, /DecompressionStream\('gzip'\)/);
assert.match(dkdSession, /dkd_gate_current_user_context_v324/);
assert.match(dkdSession, /preferred_role/);
assert.match(dkdSession, /dkdRole === 'security'/);
assert.match(dkdSession, /dkd-v28-modern-switch/);
assert.match(dkdSession, /dkdLabel\.includes\('sade tema'\)/);
assert.match(dkdSession, /dkdControl\.id === 'dkd-v28-exit'/);
assert.match(dkdSession, /stopImmediatePropagation/);
assert.match(dkdSession, /dkdV324Data\.logout\(\)/);
assert.match(dkdSession, /document\.addEventListener\('click',[\s\S]*true\)/);

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

assert.match(dkdSw, /draborngate-web-v3\.2\.4-session-admin-logout-role-hotfix/);
assert.match(dkdSw, /v3\.2\.4\.data\.js\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.auth\.js\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.auth\.js\.payload\.txt\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.session\.js\?v=3\.2\.4/);
assert.match(dkdSw, /v3\.2\.4\.session\.js\.payload\.txt\?v=3\.2\.4/);
assert.match(dkdSw, /new Request\(dkdEvent\.request, \{ cache: 'no-store' \}\)/);
assert.match(dkdSw, /dkdKey\.startsWith\('draborngate-web-'\)/);

assert.match(dkdWorkflow, /DraBornGate Web v3\.2\.4 Verify/);
assert.match(dkdWorkflow, /node --check DraBornGate\/assets\/v3\.2\.4\.data\.js/);
assert.match(dkdWorkflow, /node --check DraBornGate\/assets\/v3\.2\.4\.auth\.js/);
assert.match(dkdWorkflow, /node --check DraBornGate\/assets\/v3\.2\.4\.session\.js/);
assert.match(dkdWorkflow, /node DraBornGate\/tests\/dkd_verify_web_v324\.mjs/);

console.log('DraBornGate Web v3.2.4 oturum kilidi, Admin, Sade Tema rol erişimi, çıkış, kurye popup ve site seçimi doğrulamaları geçti.');
