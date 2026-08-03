import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdLoader = dkdRead('assets/app-v2.9.2.js');
const dkdV29 = dkdRead('assets/v2.9.js');
const dkdCss = dkdRead('assets/v2.9.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdSw = dkdRead('sw.js');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));

new vm.Script(dkdLoader, { filename: 'assets/app-v2.9.2.js' });
new vm.Script(dkdV29.replace('export async function dkdV29PrepareInitialSurface', 'async function dkdV29PrepareInitialSurface'), { filename: 'assets/v2.9.js' });
new vm.Script(dkdSw, { filename: 'sw.js' });

assert.match(dkdLoader, /DKD_WEB_VERSION\s*=\s*['"]2\.9\.2['"]/);
assert.match(dkdLoader, /function dkdBootWebV292/);
assert.match(dkdLoader, /dkdFinishBoot\(['"]Hazır['"]\)/);
assert.match(dkdLoader, /void dkdLoadEnhancements\(dkdSimpleMode\)/);
assert.ok(
  dkdLoader.indexOf("dkdFinishBoot('Hazır')") < dkdLoader.indexOf('void dkdLoadEnhancements(dkdSimpleMode)'),
  'Yükleme ekranı, gelişmiş v2.9 katmanından önce kapanmalıdır.'
);
assert.match(dkdLoader, /setTimeout\(\(\) => \{\s*dkdFinishBoot\(/);
assert.match(dkdLoader, /9000/);
assert.match(dkdLoader, /Promise\.allSettled/);
assert.match(dkdLoader, /Gelişmiş Sade Tema zaman aşımına uğradı/);
assert.match(dkdLoader, /temel panel açık kaldı/);

for (const dkdRequired of [
  'dkdV29EnsureCodeView', 'dkdV29SubmitLookup', 'KURYENİ BUL', '6 Haneli Kurye Kodu',
  'dkdV29EnsureQueueView', 'dkdV29ExtractQueueRecords', 'Canlı Kurye Kuyruğu',
  'GELDİĞİ YER / KAYNAK', 'TESLİMAT ADRESİ / HEDEF', 'SİPARİŞ / KAYIT',
  'MESAFE', 'İLETİŞİM', 'dkdV29PatchAllMotorcycleIcons', 'dkdV29MotorcycleSvg',
]) assert.ok(dkdV29.includes(dkdRequired), `Eksik v2.9 işlevi/metni: ${dkdRequired}`);

for (const dkdClass of ['#dkd-v29-root','.dkd-v29-lookup-card','.dkd-v29-courier-card','.dkd-v29-route-grid','.dkd-v29-motorcycle']) {
  assert.ok(dkdCss.includes(dkdClass), `Eksik v2.9 CSS sınıfı: ${dkdClass}`);
}

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v2\.9\.2/);
  assert.match(dkdHtml, /assets\/app-v2\.9\.2\.js/);
  assert.doesNotMatch(dkdHtml, /v2\.9\.1-boot-recovery\.js/);
  assert.doesNotMatch(dkdHtml, /assets\/app\.js\?v=/);
  assert.match(dkdHtml, /body:not\(\.dkd-web-ready\) #dkd-app/);
}
assert.match(dkdSimpleIndex, /dkd_gate_force_theme/);
assert.equal(dkdManifest.name, 'DraBornGate Web v2.9.2');
assert.match(dkdSw, /draborngate-web-v2\.9\.2-nonblocking-loader/);
assert.match(dkdSw, /assets\/app-v2\.9\.2\.js/);
assert.doesNotMatch(dkdSw, /ignoreSearch/);

console.log('DraBornGate Web v2.9.2 kilitlenmeyen açılış ve canlı kuyruk doğrulaması başarılı.');
