import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdHotfix = dkdRead('assets/v3.2.3.hotfix.js');
const dkdData = dkdRead('assets/v3.2.3.data.js');
const dkdUi = dkdRead('assets/v3.2.3.ui.js');
const dkdCss = dkdRead('assets/v3.2.3.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdSw = dkdRead('sw.js');

assert.match(dkdHotfix, /DKD_V323_HOTFIX_VERSION = '3\.2\.3'/);
assert.match(dkdHotfix, /loadAdminCatalog/);
assert.match(dkdHotfix, /v3\.2\.3\.data\.js/);
assert.match(dkdHotfix, /v3\.2\.3\.ui\.js/);

assert.match(dkdData, /dkdV323ReadBestAccessToken/);
assert.match(dkdData, /sort\(\(dkdLeft, dkdRight\) => dkdRight\.exp - dkdLeft\.exp\)/);
assert.doesNotMatch(dkdData, /grant_type=refresh_token/);
assert.match(dkdData, /dkd_gate_admin_partner_catalog_v31/);
assert.match(dkdData, /dkdV323State\.queueOpen = false/);

assert.match(dkdUi, /const dkdV323CategoryOpen = new Set\(\)/);
assert.match(dkdUi, /let dkdV323QueueOpen = false/);
assert.match(dkdUi, /Kuryeni Bul ve Eşleştir/);
assert.match(dkdUi, /Kurye ve Teslimat Bilgileri/);
assert.match(dkdUi, /Site Bağlantısı/);
assert.match(dkdUi, /Geçiş oluştururken seçilir/);
assert.match(dkdUi, /Site adı veya şehir yazın/);
assert.match(dkdUi, /dkdV323SetSelect\(dkdSelect, ''\)/);

assert.match(dkdCss, /dkd-v323-premium-finder/);
assert.match(dkdCss, /dkd-v323-pass-modal/);
assert.match(dkdCss, /dkd-v323-stat-grid/);
assert.match(dkdCss, /dkd-v323-site-search/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /DraBornGate Web v3\.2\.3/);
  assert.match(dkdHtml, /v3\.2\.3\.css\?v=3\.2\.3/);
  assert.match(dkdHtml, /v3\.2\.3\.hotfix\.js\?v=3\.2\.3/);
}
assert.equal(dkdManifest.name, 'DraBornGate Web v3.2.3');
assert.equal(dkdManifest.start_url, '/DraBornGate/?v=3.2.3');
assert.match(dkdSw, /draborngate-web-v3\.2\.3-admin-simple-site-search/);
assert.match(dkdSw, /v3\.2\.3\.hotfix\.js\?v=3\.2\.3/);
assert.match(dkdSw, /v3\.2\.3\.data\.js\?v=3\.2\.3/);
assert.match(dkdSw, /v3\.2\.3\.ui\.js\?v=3\.2\.3/);

console.log('DraBornGate Web v3.2.3 Admin menüsü, Sade Tema, popup, minimalist kart ve aramalı site seçimi kontrolleri geçti.');
