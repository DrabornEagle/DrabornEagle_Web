import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdPatch = dkdRead('assets/v2.8.1.js');
const dkdApp = dkdRead('assets/app.js');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdServiceWorker = dkdRead('sw.js');

new vm.Script(dkdPatch, { filename: 'assets/v2.8.1.js' });
new vm.Script(dkdApp, { filename: 'assets/app.js' });

for (const dkdRequired of [
  'dkdV281MotorcycleSvg',
  'dkdV281PatchMotorcycles',
  'dkdV281PatchText',
  'dkdV281Ride',
  'dkdV281Streak',
  'MutationObserver',
  'viewBox="0 0 132 84"',
  'circle cx="27" cy="61" r="16"',
  'circle cx="102" cy="61" r="16"',
  "dkdTitle.textContent = 'Kodu Doğrula'",
  "dkdCourier.textContent = 'Kurye bilgisi bekleniyor'",
]) assert.ok(dkdPatch.includes(dkdRequired), `Eksik motosiklet/metin davranışı: ${dkdRequired}`);

assert.match(dkdPatch, /\.dkd-v28-request-icon/);
assert.match(dkdPatch, /\.dkd-v28-stats \.icon\.cyan/);
assert.match(dkdPatch, /ziyaretci merkezi/);
assert.match(dkdPatch, /prefers-reduced-motion/);
assert.match(dkdApp, /v2\.8\.1\.js\?v=2\.8\.1/);
assert.match(dkdApp, /Motosiklet arayüzü güncelleniyor/);
assert.match(dkdIndex, /assets\/app\.js\?v=2\.8\.1/);
assert.match(dkdSimpleIndex, /assets\/app\.js\?v=2\.8\.1/);
assert.match(dkdServiceWorker, /draborngate-web-v2\.8\.1-racing-motorcycle/);
assert.match(dkdServiceWorker, /assets\/v2\.8\.1\.js\?v=2\.8\.1/);

console.log('DraBornGate uygulama motosiklet ikonu ve Kodu Doğrula metni doğrulandı.');
