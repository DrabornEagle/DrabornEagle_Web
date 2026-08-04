import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.0.1.guard.js');
const dkdData = dkdRead('assets/v3.0.1.data.js');
const dkdUi = dkdRead('assets/v3.0.1.js');
const dkdCss = dkdRead('assets/v3.0.1.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdServiceWorker = dkdRead('sw.js');

for (const [dkdName, dkdSource] of [
  ['app.js', dkdApp],
  ['v3.0.1.guard.js', dkdGuard],
  ['v3.0.1.data.js', dkdData],
  ['v3.0.1.js', dkdUi],
]) new vm.Script(dkdSource, { filename: dkdName });

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.0\.1'/);
assert.match(dkdApp, /v3\.0\.1\.guard\.js/);
assert.match(dkdApp, /v3\.0\.1\.data\.js/);
assert.match(dkdApp, /v3\.0\.1\.js/);
assert.ok(dkdApp.indexOf('v3.0.1.guard.js') < dkdApp.indexOf('app.v2.payload'), 'Sürüm koruması çekirdek uygulamadan önce yüklenmeli.');
assert.doesNotMatch(dkdApp, /v3\.0\.data\.js/);

assert.ok(dkdGuard.includes('2\\.8'));
assert.ok(dkdGuard.includes('3\\.0\\.0'));
assert.match(dkdGuard, /dkdMark\.textContent = 'DBG'/);
assert.match(dkdGuard, /MutationObserver/);
assert.match(dkdGuard, /stopImmediatePropagation/);

assert.match(dkdData, /dkdKind === 'finder'/);
assert.match(dkdData, /canli kurye kuyrugu/);
assert.match(dkdData, /dkdV301EnsureBridge/);
assert.match(dkdData, /dkdV301FindBridge/);
assert.match(dkdData, /dkdV301ScanQueue/);
assert.match(dkdData, /Nereden Geliyor/);
assert.match(dkdData, /Gideceği Tam Adres/);
assert.match(dkdData, /Teslim Alacak Kişi/);
assert.match(dkdData, /Sipariş Numarası/);
assert.match(dkdData, /Teslimat Notu/);
assert.doesNotMatch(dkdData, /Canlı kuyrukta eşleştirilecek kurye bulunamadı/);

assert.match(dkdUi, /Kuyrukta kart seçmeniz gerekmez/);
assert.match(dkdUi, /Kod araması Canlı Kurye Kuyruğundan bağımsız çalışır/);
assert.match(dkdUi, /Kuyruk hazırlanıyor/);
assert.match(dkdUi, /Canlı Kurye Kuyruğu açılıyor/);
assert.match(dkdUi, /NEREDEN GELİYOR/);
assert.match(dkdUi, /GİDECEĞİ TAM ADRES/);
assert.match(dkdUi, /dkdV301State\.busy/);
assert.match(dkdCss, /Web v3\.0\.1/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v3\.0\.1/);
  assert.match(dkdHtml, /assets\/app\.js\?v=3\.0\.1/);
  assert.doesNotMatch(dkdHtml, /v2\.8\.0/);
  assert.doesNotMatch(dkdHtml, /v3\.0\.0/);
}

assert.equal(dkdManifest.name, 'DraBornGate Web v3.0.1');
assert.match(dkdServiceWorker, /draborngate-web-v3\.0\.1-live-queue-finder/);
assert.match(dkdServiceWorker, /v3\.0\.1\.guard\.js\?v=3\.0\.1/);
assert.match(dkdServiceWorker, /v3\.0\.1\.data\.js\?v=3\.0\.1/);
assert.match(dkdServiceWorker, /v3\.0\.1\.js\?v=3\.0\.1/);

console.log('DraBornGate Web v3.0.1 sürüm koruması, doğrudan Kuryeni Bul ve gerçek Canlı Kurye Kuyruğu doğrulandı.');
