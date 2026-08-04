import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdData = dkdRead('assets/v3.1.1.data.js');
const dkdMoto = dkdRead('assets/v3.1.1.moto.js');
const dkdLoader = dkdRead('assets/v3.1.1.js');
const dkdFixCss = dkdRead('assets/v3.1.1.css');
const dkdUi = Array.from({ length: 12 }, (_, dkdIndex) => dkdRead(`assets/v3.1.0.js.part.${dkdIndex + 1}.txt`)).join('');
const dkdSql = dkdRead('sql/dkd_gate_web_v3_1_1.sql');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdSw = dkdRead('sw.js');

for (const [dkdName, dkdSource] of [
  ['app.js', dkdApp],
  ['v3.1.1.data.js', dkdData],
  ['v3.1.1.moto.js', dkdMoto],
  ['v3.1.1.ui.joined.js', dkdUi],
]) new vm.Script(dkdSource, { filename: dkdName });

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.1\.1'/);
assert.match(dkdApp, /dkdBootWebV311/);
assert.match(dkdApp, /v3\.1\.1\.moto\.js/);
assert.match(dkdApp, /v3\.1\.1\.css/);
assert.match(dkdApp, /v3\.1\.1\.data\.js/);
assert.match(dkdApp, /v3\.1\.1\.js/);
assert.doesNotMatch(dkdApp, /import\(`\.\/v3\.1\.0\.data\.js/);

assert.match(dkdLoader, /DKD_V311_JS_PARTS = 12/);
assert.match(dkdLoader, /DKD_V311_CSS_PARTS = 7/);
assert.match(dkdLoader, /\?v=3\.1\.1/);
assert.match(dkdLoader, /cache: 'no-store'/);

assert.match(dkdData, /DKD_V311_AUTH_STORAGE_KEY = `sb-\$\{DKD_V311_PROJECT_REF\}-auth-token`/);
assert.match(dkdData, /dkdKey\.includes\(DKD_V311_PROJECT_REF\)/);
assert.match(dkdData, /dkdV31DecodeJwtPayload/);
assert.match(dkdData, /dkdV31IsProjectAccessToken/);
assert.match(dkdData, /dkdPayload\.iss/);
assert.match(dkdData, /dkdPayload\.exp/);
assert.match(dkdData, /grant_type=refresh_token/);
assert.match(dkdData, /dkdResult\.response\.status === 401/);
assert.doesNotMatch(dkdData, /!dkdKey\.includes\(DKD_V311_PROJECT_REF\) && !dkdKey\.includes\('auth-token'\)/);
assert.match(dkdData, /DraBornGate oturum anahtarı geçersiz/);
assert.match(dkdData, /readableError/);

for (const dkdRpc of [
  'dkd_gate_security_queue_v31',
  'dkd_gate_security_find_pass_v31',
  'dkd_gate_security_approve_pass_v31',
  'dkd_gate_partner_summary_v31',
  'dkd_gate_admin_partner_catalog_v31',
  'dkd_gate_admin_assign_partner_site_v31',
]) assert.match(dkdData, new RegExp(dkdRpc));

assert.match(dkdUi, /queueRenderPending/);
assert.match(dkdUi, /dkdInputWasFocused/);
assert.match(dkdUi, /document\.activeElement === dkdCodeInput/);
assert.match(dkdUi, /dkdRoot\.dataset\.dkdV31Mounted/);
assert.match(dkdUi, /setSelectionRange/);
assert.match(dkdUi, /Admin Paneli/);
assert.match(dkdUi, /Siteyi Kullanıcıya Bağla/);
assert.match(dkdUi, /Site–Kullanıcı Bağlantıları/);
assert.match(dkdUi, /Kullanıcılar/);
assert.match(dkdUi, /Siteler/);
assert.match(dkdUi, /data-dkd-v31-menu=\"admin\"/);
assert.match(dkdUi, /dkdV31PatchBottomCourierLabel/);
assert.match(dkdUi, /dkdDbgLabel\.textContent = 'Kurye'/);
assert.match(dkdUi, /window\.dkdV311MotorcycleSvg/);
assert.match(dkdUi, /dkdIsCourierPassCard/);
assert.match(dkdUi, /dkdV31PatchUnreadableErrors/);

assert.match(dkdMoto, /window\.dkdV311MotorcycleSvg/);
assert.match(dkdMoto, /dkd-v281-moto-bike/);
assert.match(dkdMoto, /viewBox=\"0 0 132 84\"/);

assert.match(dkdFixCss, /dkd-v31-action-row/);
assert.match(dkdFixCss, /white-space:nowrap!important/);
assert.match(dkdFixCss, /grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
assert.match(dkdFixCss, /dkd-v311-admin-panel/);
assert.match(dkdFixCss, /dkd-v31-modern-moto-host/);

assert.match(dkdSql, /create or replace function public\.dkd_gate_create_courier_pass_v2/);
assert.match(dkdSql, /nullif\(trim\(coalesce\(p_screenshot_url, ''\)\), ''\)/);
assert.doesNotMatch(dkdSql, /raise exception 'Sipariş ekran görüntüsü gerekli'/);
assert.match(dkdSql, /'web-v3\.1\.1'/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v3\.1\.1/);
  assert.match(dkdHtml, /assets\/app\.js\?v=3\.1\.1/);
}
assert.equal(dkdManifest.name, 'DraBornGate Web v3.1.1');
assert.match(dkdSw, /draborngate-web-v3\.1\.1-auth-admin-hotfix/);
assert.match(dkdSw, /v3\.1\.1\.data\.js\?v=3\.1\.1/);
assert.match(dkdSw, /v3\.1\.1\.moto\.js\?v=3\.1\.1/);
assert.match(dkdSw, /v3\.1\.1\.css\?v=3\.1\.1/);
assert.match(dkdSw, /v3\.1\.1\.js\?v=3\.1\.1/);

console.log('DraBornGate Web v3.1.1 JWT, Yeni Geçiş, Admin Paneli, mobil klavye, tek satır buton ve motosiklet düzeltmeleri doğrulandı.');
