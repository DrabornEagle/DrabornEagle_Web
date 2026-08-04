import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.1.0.guard.js');
const dkdData = dkdRead('assets/v3.1.0.data.js');
const dkdLoader = dkdRead('assets/v3.1.0.js');
const dkdUi = Array.from({ length: 12 }, (_, dkdIndex) => dkdRead(`assets/v3.1.0.js.part.${dkdIndex + 1}.txt`)).join('');
const dkdCss = Array.from({ length: 7 }, (_, dkdIndex) => dkdRead(`assets/v3.1.0.css.part.${dkdIndex + 1}.txt`)).join('');
const dkdSql = dkdRead('sql/dkd_gate_web_v3_1_0.sql');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdSw = dkdRead('sw.js');

for (const [dkdName, dkdSource] of [
  ['app.js', dkdApp],
  ['v3.1.0.guard.js', dkdGuard],
  ['v3.1.0.data.js', dkdData],
  ['v3.1.0.ui.joined.js', dkdUi],
]) new vm.Script(dkdSource, { filename: dkdName });

assert.match(dkdLoader, /DKD_V31_JS_PARTS = 12/);
assert.match(dkdLoader, /DKD_V31_CSS_PARTS = 7/);
assert.match(dkdLoader, /v3\.1\.0\.\$\{dkdKind\}\.part/);

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.1\.0'/);
assert.match(dkdApp, /dkdBootWebV310/);
assert.match(dkdApp, /v3\.1\.0\.guard\.js/);
assert.match(dkdApp, /v3\.1\.0\.data\.js/);
assert.match(dkdApp, /v3\.1\.0\.js/);
assert.doesNotMatch(dkdApp, /v3\.0\.1\.data\.js/);
assert.doesNotMatch(dkdApp, /v3\.0\.1\.js/);
assert.ok(dkdApp.indexOf('v3.1.0.guard.js') < dkdApp.indexOf('app.v2.payload'));

assert.match(dkdGuard, /DKD_V31_VERSION = '3\.1\.0'/);
assert.match(dkdGuard, /trim\(\) === 'DG'/);
assert.match(dkdGuard, /'DBG'/);
assert.match(dkdGuard, /MutationObserver/);

for (const dkdRpc of [
  'dkd_gate_security_queue_v31',
  'dkd_gate_security_find_pass_v31',
  'dkd_gate_security_approve_pass_v31',
  'dkd_gate_partner_summary_v31',
  'dkd_gate_partner_earnings_rows_v31',
  'dkd_gate_admin_partner_catalog_v31',
  'dkd_gate_admin_assign_partner_site_v31',
]) assert.match(dkdData, new RegExp(dkdRpc));

for (const dkdField of [
  'courier_name', 'courier_phone', 'courier_plate', 'platform',
  'origin_name', 'origin_address', 'customer_name', 'destination_full',
  'order_number', 'approval_code',
]) assert.match(dkdData, new RegExp(dkdField));

for (const dkdText of [
  'Kuryeni Bul ve Eşleştir',
  'Kurye Bilgileri',
  'Kodu Onayla ve Giriş Ver',
  'Canlı Kurye Kuyruğu',
  'Kapıda Bekleyenler',
  'Yaklaşan / Onay Bekleyenler',
  '5 Tane Daha Göster',
  'Kurye Adı Soyadı',
  'Kurye Telefonu',
  'Müşteri Adı Soyadı',
  'Sipariş Numarası',
  '6 HANELİ EŞLEŞTİRME KODU',
  'Kazancım',
  'Kazanç Ortaklıkları',
]) assert.ok(dkdUi.includes(dkdText), `Eksik v3.1.0 arayüz kapsamı: ${dkdText}`);

assert.match(dkdData, /queueLimits:/);
assert.match(dkdUi, /queueLimits\[/);
assert.match(dkdUi, /\+ 5/);
assert.match(dkdUi, /dkdV31RemoveLiveSyncCard/);
assert.match(dkdUi, /canli senkron/);
assert.match(dkdUi, /Tamamlanan/);
assert.match(dkdUi, /Aktif Geçiş/);
assert.match(dkdUi, /Aktif Site/);
assert.match(dkdUi, /Konum Kontrolü Yap/);
assert.match(dkdUi, /Kapıya Geldim/);
assert.match(dkdUi, /Son Hareketler/);
assert.match(dkdUi, /Geçiş Geçmişi/);
assert.match(dkdUi, /Geçişlerim/);
assert.match(dkdUi, /Daha Fazla Göster/);
assert.match(dkdUi, /dkdV31PatchMotorcycleIcons/);
assert.match(dkdCss, /dkd-v31-action-row/);
assert.match(dkdCss, /grid-template-columns:1fr 1fr/);
assert.match(dkdCss, /Güvenlik Sade Tema · Web v3\.1\.0/);

for (const dkdDbName of [
  'dkd_gate_partner_site_links',
  'dkd_gate_partner_earnings',
  'dkd_gate_partner_accrue_v31',
  'dkd_gate_security_queue_v31',
  'dkd_gate_security_find_pass_v31',
  'dkd_gate_security_approve_pass_v31',
  'dkd_gate_partner_summary_v31',
  'dkd_gate_admin_assign_partner_site_v31',
]) assert.match(dkdSql, new RegExp(dkdDbName));
assert.match(dkdSql, /amount_per_courier numeric\(12,2\) not null default 10\.00/);
assert.match(dkdSql, /coalesce\(new\.is_demo, false\) = false/);
assert.match(dkdSql, /unique \(link_id, pass_id\)/);
assert.match(dkdSql, /enable row level security/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v3\.1\.0/);
  assert.match(dkdHtml, /assets\/app\.js\?v=3\.1\.0/);
  assert.doesNotMatch(dkdHtml, /v3\.0\.1/);
  assert.match(dkdHtml, />DBG</);
}
assert.equal(dkdManifest.name, 'DraBornGate Web v3.1.0');
assert.match(dkdSw, /draborngate-web-v3\.1\.0-direct-rpc-earnings/);
assert.match(dkdSw, /v3\.1\.0\.guard\.js\?v=3\.1\.0/);
assert.match(dkdSw, /v3\.1\.0\.data\.js\?v=3\.1\.0/);
assert.match(dkdSw, /v3\.1\.0\.js\?v=3\.1\.0/);
assert.match(dkdSw, /v3\.1\.0\.js\.part\.12\.txt\?v=3\.1\.0/);
assert.match(dkdSw, /v3\.1\.0\.css\.part\.7\.txt\?v=3\.1\.0/);

console.log('DraBornGate Web v3.1.0 gerçek kurye verileri, kod popup, kategorili listeler, modern panel ve kazanç sistemi doğrulandı.');
