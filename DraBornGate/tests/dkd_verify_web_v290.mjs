import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdV29 = dkdRead('assets/v2.9.js');
const dkdCss = dkdRead('assets/v2.9.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdSw = dkdRead('sw.js');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));

new vm.Script(dkdApp, { filename: 'assets/app.js' });
new vm.Script(dkdV29.replace('export async function dkdV29PrepareInitialSurface', 'async function dkdV29PrepareInitialSurface'), { filename: 'assets/v2.9.js' });

assert.match(dkdApp, /DKD_WEB_VERSION\s*=\s*['"]2\.9\.0['"]/);
assert.match(dkdApp, /dkdBootProgressValue\s*=\s*Math\.max/);
assert.match(dkdApp, /document\.body\.classList\.add\(['"]dkd-web-ready['"]\)/);
assert.match(dkdApp, /v2\.9\.css/);
assert.match(dkdApp, /v2\.9\.js/);
assert.match(dkdApp, /dkdV29PrepareInitialSurface/);
assert.match(dkdApp, /dkdSetBootProgress\(99/);
assert.match(dkdApp, /function dkdBootWebV29/);

for (const dkdRequired of [
  'dkdV29EnsureCodeView',
  'dkdV29FindCodeControl',
  'dkdV29SubmitLookup',
  'KURYENİ BUL',
  '6 Haneli Kurye Kodu',
  'dkdV29EnsureQueueView',
  'dkdV29ExtractQueueRecords',
  'Canlı Kurye Kuyruğu',
  'GELDİĞİ YER / KAYNAK',
  'TESLİMAT ADRESİ / HEDEF',
  'SİPARİŞ / KAYIT',
  'MESAFE',
  'İLETİŞİM',
  'dkdV29PatchAllMotorcycleIcons',
  'dkdV29MotorcycleSvg',
  'M39 46C47 32 59 23 77 24',
  'MutationObserver',
]) assert.ok(dkdV29.includes(dkdRequired), `Eksik v2.9 işlevi/metni: ${dkdRequired}`);

assert.match(dkdV29, /setTimeout\(\(\) => void dkdV29RefreshNativeSnapshots\(\), 4800\)/);
assert.match(dkdV29, /Geldiği adres paylaşılmadı/);
assert.match(dkdV29, /Teslimat adresi paylaşılmadı/);
assert.match(dkdV29, /location\.replace\(`\/DraBornGate\/\?theme=modern&v=\$\{DKD_V29_VERSION\}/);

for (const dkdClass of [
  '#dkd-v29-root',
  '.dkd-v29-lookup-card',
  '.dkd-v29-lookup-row',
  '.dkd-v29-courier-card',
  '.dkd-v29-route-grid',
  '.dkd-v29-detail-grid',
  '.dkd-v29-motorcycle',
  '.dkd-v29-motorcycle-host',
]) assert.ok(dkdCss.includes(dkdClass), `Eksik v2.9 CSS sınıfı: ${dkdClass}`);
assert.match(dkdCss, /body:not\(\.dkd-web-ready\) #dkd-app/);
assert.match(dkdCss, /@keyframes dkdV29Ride/);
assert.match(dkdCss, /@media \(max-width: 620px\)/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v2\.9\.1/);
  assert.match(dkdHtml, /body:not\(\.dkd-web-ready\) #dkd-app/);
  assert.match(dkdHtml, /assets\/app\.js\?v=2\.9\.1/);
  assert.match(dkdHtml, /v2\.9\.1-boot-recovery\.js\?v=2\.9\.1/);
  assert.doesNotMatch(dkdHtml, />[^<]*v2\.3(?:\.0)?[^<]*</i);
  assert.doesNotMatch(dkdHtml, />[^<]*v2\.8(?:\.\d+)?[^<]*</i);
}
assert.match(dkdSimpleIndex, /dkd_gate_force_theme/);
assert.equal(dkdManifest.name, 'DraBornGate Web v2.9.1');
assert.match(dkdSw, /draborngate-web-v2\.9\.1-boot-hotfix/);
assert.match(dkdSw, /assets\/v2\.9\.js\?v=2\.9\.0/);
assert.match(dkdSw, /assets\/v2\.9\.css\?v=2\.9\.0/);

console.log('DraBornGate Web v2.9.1 açılış hotfix ve ayrıntılı canlı kurye kuyruğu doğrulaması başarılı.');
