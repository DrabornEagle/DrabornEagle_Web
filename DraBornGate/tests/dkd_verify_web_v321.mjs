import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.1.guard.js');
const dkdDataBridge = dkdRead('assets/v3.2.1.data.js');
const dkdLoader = dkdRead('assets/v3.2.1.js');
const dkdUi = Array.from({ length: 12 }, (_, dkdIndex) => dkdRead(`assets/v3.1.0.js.part.${dkdIndex + 1}.txt`)).join('');
const dkdSql = dkdRead('sql/dkd_gate_web_v3_2_1.sql');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdSw = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.1'/);
assert.match(dkdApp, /dkdBootWebV321/);
assert.match(dkdApp, /v3\.2\.1\.guard\.js/);
assert.match(dkdApp, /v3\.2\.1\.data\.js/);
assert.match(dkdApp, /v3\.2\.1\.js/);
assert.doesNotMatch(dkdApp, /import\(`\.\/v3\.1\.0\.guard\.js/);
assert.match(dkdApp, /updateViaCache: 'none'/);
assert.match(dkdApp, /dkdKey\.startsWith\('draborngate-web-'\)/);
assert.match(dkdApp, /cache: 'no-store'/);

assert.match(dkdGuard, /DKD_V321_VERSION = '3\.2\.1'/);
assert.match(dkdGuard, /MutationObserver/);
assert.match(dkdGuard, /window\.__DKD_GATE_WEB_VERSION__/);
assert.ok(dkdGuard.includes('1(?:\\.\\d+)?'), 'Sürüm koruması v3.1.x metinlerini kapsamalı.');

assert.match(dkdDataBridge, /DKD_V321_RPC_PATTERN/);
assert.match(dkdDataBridge, /dkdHeaders\.delete\('Accept-Profile'\)/);
assert.match(dkdDataBridge, /dkdHeaders\.delete\('Content-Profile'\)/);
assert.match(dkdDataBridge, /v3\.1\.1\.data\.js\?v=\$\{DKD_V321_VERSION\}/);
assert.match(dkdDataBridge, /rpcSchema = 'public'/);

assert.match(dkdLoader, /DKD_V321_JS_PARTS = 12/);
assert.match(dkdLoader, /DKD_V321_CSS_PARTS = 7/);
assert.match(dkdLoader, /DKD_V321_VERSION = '3\.2\.1'/);
assert.match(dkdLoader, /cache: 'no-store'/);

for (const dkdRpc of [
  'dkd_gate_security_queue_v31',
  'dkd_gate_security_find_pass_v31',
  'dkd_gate_security_approve_pass_v31',
  'dkd_gate_partner_summary_v31',
  'dkd_gate_partner_earnings_rows_v31',
  'dkd_gate_admin_partner_catalog_v31',
  'dkd_gate_admin_assign_partner_site_v31',
]) {
  assert.match(dkdSql, new RegExp(`create or replace function public\\.${dkdRpc}`));
  assert.match(dkdSql, new RegExp(`grant execute on function public\\.${dkdRpc}`));
}
assert.match(dkdSql, /'web-v3\.2\.1'/);
assert.match(dkdSql, /notify pgrst, 'reload schema'/);

assert.match(dkdUi, /Admin Paneli/);
assert.match(dkdUi, /data-dkd-v31-menu=\"admin\"/);
assert.match(dkdUi, /dkdV31PatchPartnerMenus/);
assert.match(dkdUi, /dkdV31MountSimple/);
assert.match(dkdUi, /dkdV31RefreshQueue/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /DraBornGate Web v3\.2\.1/);
  assert.match(dkdHtml, /assets\/app\.js\?v=3\.2\.1/);
  assert.match(dkdHtml, /no-cache, no-store, must-revalidate/);
}
assert.match(dkdSimpleIndex, /dkd_gate_security_theme','simple'/);
assert.match(dkdSimpleIndex, /dkd_gate_force_theme','simple'/);
assert.equal(dkdManifest.name, 'DraBornGate Web v3.2.1');
assert.equal(dkdManifest.start_url, '/DraBornGate/?v=3.2.1');

assert.match(dkdSw, /draborngate-web-v3\.2\.1-public-rpc-version-guard/);
assert.match(dkdSw, /v3\.2\.1\.guard\.js\?v=3\.2\.1/);
assert.match(dkdSw, /v3\.2\.1\.data\.js\?v=3\.2\.1/);
assert.match(dkdSw, /v3\.2\.1\.js\?v=3\.2\.1/);
assert.match(dkdSw, /new Request\(dkdEvent\.request, \{ cache: 'no-store' \}\)/);
assert.match(dkdSw, /dkdKey\.startsWith\('draborngate-web-'\)/);

console.log('DraBornGate Web v3.2.1 sürüm koruması, public RPC, Admin Paneli, Sade Tema ve önbellek doğrulamaları geçti.');
