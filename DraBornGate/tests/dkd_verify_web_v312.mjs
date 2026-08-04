import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');
const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.1.2.guard.js');
const dkdData = dkdRead('assets/v3.1.2.data.js');
const dkdMoto = dkdRead('assets/v3.1.2.moto.js');
const dkdLoader = dkdRead('assets/v3.1.2.js');
const dkdUi = Array.from({ length: 12 }, (_, dkdIndex) => dkdRead(`assets/v3.1.0.js.part.${dkdIndex + 1}.txt`)).join('');
const dkdCss = dkdRead('assets/v3.1.2.css');
const dkdSql = dkdRead('sql/dkd_gate_web_v3_1_2.sql');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdSw = dkdRead('sw.js');

for (const [dkdName, dkdSource] of [
  ['app.js', dkdApp], ['v3.1.2.guard.js', dkdGuard], ['v3.1.2.data.js', dkdData],
  ['v3.1.2.moto.js', dkdMoto], ['v3.1.2.ui.joined.js', dkdUi],
]) new vm.Script(dkdSource, { filename: dkdName });

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.1\.2'/);
for (const dkdFile of ['v3.1.2.guard.js','v3.1.2.moto.js','v3.1.2.data.js','v3.1.2.js']) assert.ok(dkdApp.includes(dkdFile));
for (const dkdOldRuntime of ['v3.1.0.guard.js','v2.8.1.js','v3.1.1.moto.js','v3.1.1.data.js','v3.1.1.js']) assert.ok(!dkdApp.includes(dkdOldRuntime));
assert.match(dkdApp, /classList\.remove\('dkd-version-lock'\)/);

assert.match(dkdGuard, /DKD_VERSION = '3\.1\.2'/);
assert.match(dkdGuard, /window\.fetch = async function dkdObservedFetch/);
assert.match(dkdGuard, /Storage\.prototype\.setItem/);
assert.match(dkdGuard, /dkd_gate_live_session_v312/);
assert.match(dkdGuard, /dkdScanStores/);
assert.match(dkdGuard, /__DKD_GATE_LAST_ACCESS_TOKEN__/);
assert.match(dkdGuard, /dkd-version-lock/);

assert.match(dkdData, /DKD_V312_VERSION = '3\.1\.2'/);
assert.match(dkdData, /dkd_gate_live_session_v312/);
assert.match(dkdData, /dkd_gate_current_access_v312/);
assert.match(dkdData, /adminStatus/);
assert.match(dkdData, /loadAdminStatus/);
assert.match(dkdData, /15000/);

assert.match(dkdMoto, /dkd-v312-app-moto/);
assert.match(dkdMoto, /dkdV312PatchMotorcycles/);
assert.match(dkdMoto, /dkd-v28-request-icon/);
assert.match(dkdMoto, /kurye merkezi/);
assert.match(dkdMoto, /window\.dkdV311MotorcycleSvg=dkdV312MotorcycleSvg/);
assert.match(dkdUi, /Admin Paneli/);
assert.match(dkdUi, /loadAdminCatalog/);
assert.match(dkdUi, /dkdV31PatchPartnerMenus/);
assert.match(dkdLoader, /v3\.1\.0\.\$\{dkdKind\}\.part/);
assert.match(dkdLoader, /v=3\.1\.2/);

assert.match(dkdCss, /html\.dkd-version-lock #dkd-app/);
assert.match(dkdCss, /dkd-v312-moto-host/);
assert.match(dkdSql, /dkd_gate_current_access_v312/);
assert.match(dkdSql, /dkd_gate_is_admin_user/);
assert.match(dkdSql, /web-v3\.1\.2/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v3\.1\.2/);
  assert.match(dkdHtml, /dkd-version-lock/);
  assert.match(dkdHtml, /assets\/app\.js\?v=3\.1\.2/);
  assert.doesNotMatch(dkdHtml, /Web v3\.1\.1/);
  assert.doesNotMatch(dkdHtml, /WEB v3\.1\.0/);
}
assert.equal(dkdManifest.name, 'DraBornGate Web v3.1.2');
assert.match(dkdSw, /draborngate-web-v3\.1\.2-current-only/);
for (const dkdFile of ['v3.1.2.guard.js','v3.1.2.moto.js','v3.1.2.data.js','v3.1.2.js']) assert.match(dkdSw, new RegExp(dkdFile.replaceAll('.', '\\.')));
assert.doesNotMatch(dkdSw, /v2\.8\.1\.js\?v=3\.1\.2/);
assert.doesNotMatch(dkdSw, /v3\.1\.0\.guard\.js\?v=3\.1\.2/);
assert.doesNotMatch(dkdSw, /v3\.1\.1\.css\?v=3\.1\.2/);
assert.match(dkdSw, /cache:'reload'/);
console.log('DraBornGate Web v3.1.2 sürüm kilidi, canlı oturum, Admin Paneli, Sade Tema ve tek motosiklet ikonu doğrulandı.');
