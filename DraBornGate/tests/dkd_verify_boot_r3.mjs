import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdPath) => fs.readFileSync(path.join(dkdRoot, dkdPath), 'utf8');

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdLoader = dkdRead('assets/app.v3.2.7-r3.js');

for (const dkdEntry of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdEntry, /app\.v3\.2\.7-r3\.js\?v=3\.2\.7-r3/);
  assert.match(dkdEntry, /v3\.2\.7\.boot-unlock\.js\?v=3\.2\.7-r3/);
  assert.doesNotMatch(dkdEntry, /app\.js\?v=3\.2\.7-r2/);
}

assert.match(dkdLoader, /const DKD_WEB_REVISION = '3\.2\.7-r3'/);
assert.match(dkdLoader, /function dkdPrepareFreshRuntime\(\)/);
assert.doesNotMatch(dkdLoader, /async function dkdPrepareFreshRuntime/);
assert.doesNotMatch(dkdLoader, /await dkdPrepareFreshRuntime\(\)/);
assert.match(dkdLoader, /void navigator\.serviceWorker\.register/);
assert.match(dkdLoader, /Promise\.allSettled/);
assert.match(dkdLoader, /dkdWithTimeout/);
assert.match(dkdLoader, /v3\.2\.7-r3 güvenli açılış başlatılıyor/);
assert.match(dkdLoader, /dkdSetBootProgress\(5, 'Sürüm koruması hazırlanıyor'\)/);
assert.match(dkdLoader, /dkdBootWebV327\(\)\.catch\(dkdShowBootError\)/);

console.log('DraBornGate v3.2.7-r3 açılış kilidi ve önbellek regresyon testleri geçti.');
