import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dkdTestDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdUnpack = (dkdRelativePath) => zlib.gunzipSync(Buffer.from(dkdRead(dkdRelativePath).trim(), 'base64')).toString('utf8');

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.5.guard.js');
const dkdLoader = dkdRead('assets/v3.2.5.js');
const dkdStability = dkdRead('assets/v3.2.5.stability.js');
const dkdSession = dkdUnpack('assets/v3.2.5.session.js.payload.txt');
const dkdFeatures = dkdUnpack('assets/v3.2.5.features.js.payload.txt');
const dkdCss = dkdUnpack('assets/v3.2.5.css.payload.txt');
const dkdV28 = dkdRead('assets/v2.8.js');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdSw = dkdRead('sw.js');
const dkdMigration = dkdRead('supabase/migrations/20260804160400_dkd_gate_current_user_context_v325.sql');
const dkdWorkflow = fs.readFileSync(path.resolve(dkdRoot, '..', '.github/workflows/draborngate-web-v2-4.yml'), 'utf8');

for (const [dkdName, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
  ['yükleyici', dkdApp],
  ['manifest', dkdManifest],
  ['service worker', dkdSw],
  ['workflow', dkdWorkflow],
]) assert.match(dkdSource, /3\.2\.5/, `${dkdName} v3.2.5 içermeli`);

assert.match(dkdApp, /const DKD_WEB_VERSION = '3\.2\.5'/);
assert.match(dkdApp, /v3\.2\.5\.guard\.js/);
assert.match(dkdApp, /v3\.2\.4\.css\.payload\.txt/);
assert.match(dkdApp, /v3\.2\.5\.css\.payload\.txt/);
assert.match(dkdApp, /v3\.2\.5\.js/);
assert.match(dkdApp, /dkdBootWebV325\(\)\.catch/);

assert.match(dkdGuard, /DKD_V325_VERSION = '3\.2\.5'/);
assert.match(dkdGuard, /__DKD_GATE_V325_ACTIVE__/);
assert.match(dkdLoader, /v3\.2\.5\.stability\.js/);
assert.match(dkdLoader, /v3\.2\.4\.js\.payload\.txt/);
assert.match(dkdLoader, /v3\.2\.5\.session\.js\.payload\.txt/);
assert.match(dkdLoader, /v3\.2\.5\.features\.js\.payload\.txt/);
assert.match(dkdLoader, /DecompressionStream/);

assert.match(dkdStability, /allowUserClearUntil/);
assert.match(dkdStability, /dkdV325StopAutomaticEmptyDispatch/);
assert.match(dkdStability, /stopImmediatePropagation/);
assert.match(dkdStability, /dkd-v23-site-search/);
assert.match(dkdStability, /dkdV325IsNewPassScreen/);

assert.match(dkdV28, /window\.dkdV325Session\?\.currentRole\?\.\(\)/);
assert.match(dkdV28, /dkdV28Normalize\(dkdElement\.textContent\) !== 'guvenlik'/);
assert.doesNotMatch(dkdV28, /const dkdHasRole = dkdText\.includes\('guvenlik'\)/);

assert.match(dkdSession, /dkd_gate_current_user_context_v325/);
assert.match(dkdSession, /partner_visible/);
assert.match(dkdSession, /dataset\.dkdV325Role/);
assert.match(dkdSession, /dkdV325RunLogout/);
assert.doesNotMatch(dkdSession, /new MutationObserver/);

assert.match(dkdFeatures, /kuryeni bul ve eslestir/);
assert.match(dkdFeatures, /findPass\(dkdCode\)/);
assert.match(dkdFeatures, /approvePass\(dkdCode\)/);
assert.match(dkdFeatures, /Kurye geçiş detayları/);
for (const dkdField of ['Telefon', 'Plaka', 'Platform', 'Sipariş', 'Gönderici', 'Müşteri', 'Site', 'Tam Adres', 'Teslimat Notu']) assert.match(dkdFeatures, new RegExp(dkdField));
assert.match(dkdFeatures, /RENKLİ YÖNETİM MERKEZİ/);
assert.match(dkdFeatures, /loadAdminCatalog\(true\)/);
assert.match(dkdFeatures, /assignPartnerSite/);
assert.match(dkdFeatures, /Kazançlarım/);
assert.match(dkdFeatures, /partner_visible/);
assert.match(dkdFeatures, /loadPartnerSummary/);
assert.match(dkdFeatures, /loadPartnerRows\(50, 0\)/);

for (const dkdSelector of ['.dkd-v325-pass-panel', '.dkd-v325-admin-panel', '.dkd-v325-earnings-panel', '.dkd-v325-earnings-menu', 'data-dkd-v325-role']) assert.ok(dkdCss.includes(dkdSelector), `${dkdSelector} v3.2.5 CSS içinde bulunmalı`);
assert.match(dkdCss, /body\.dkd-v325-new-pass-stable/);

assert.match(dkdMigration, /dkd_gate_current_user_context_v325/);
assert.match(dkdMigration, /partner_visible/);
assert.match(dkdMigration, /partner_sites/);
assert.match(dkdMigration, /grant execute .* authenticated/i);

const dkdManifestJson = JSON.parse(dkdManifest);
assert.equal(dkdManifestJson.name, 'DraBornGate Web v3.2.5');
assert.equal(dkdManifestJson.start_url, '/DraBornGate/?v=3.2.5');
assert.match(dkdSw, /draborngate-web-v3\.2\.5-stable-popup-admin-earnings/);
for (const dkdAsset of ['v3.2.5.guard.js', 'v3.2.5.stability.js', 'v3.2.5.js', 'v3.2.5.session.js.payload.txt', 'v3.2.5.features.js.payload.txt', 'v3.2.5.css.payload.txt']) assert.match(dkdSw, new RegExp(dkdAsset.replaceAll('.', '\\.')));
assert.match(dkdWorkflow, /DraBornGate Web v3\.2\.5 Verify/);
assert.match(dkdWorkflow, /dkd_verify_web_v325\.mjs/);

console.log('DraBornGate Web v3.2.5 titreme koruması, detay popup, renkli Admin Paneli ve Kazançlarım doğrulamaları geçti.');
