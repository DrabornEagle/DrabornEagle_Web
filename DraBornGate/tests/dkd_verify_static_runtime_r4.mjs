import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dkdTestDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDirectory, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdSize = (dkdRelativePath) => fs.statSync(path.join(dkdRoot, dkdRelativePath)).size;

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdLoader = dkdRead('assets/app.v3.2.7-r4.js');
const dkdFeatureLoader = dkdRead('assets/v3.2.7-r4.js');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));

for (const [dkdLabel, dkdSource] of [
  ['ana index', dkdIndex],
  ['sade tema index', dkdSimpleIndex],
]) {
  assert.match(dkdSource, /app\.v3\.2\.7-r4\.js\?v=3\.2\.7-r4/,
    `${dkdLabel} r4 yükleyicisini kullanmalı`);
  assert.match(dkdSource, /v3\.2\.7-r4 statik açılış hazırlanıyor/,
    `${dkdLabel} r4 başlangıç bilgisini göstermeli`);
  assert.doesNotMatch(dkdSource, /app\.v3\.2\.7-r3\.js/,
    `${dkdLabel} r3 yükleyicisini çağırmamalı`);
  assert.doesNotMatch(dkdSource, /v3\.2\.7\.boot-unlock\.js/,
    `${dkdLabel} monkeypatch kilit açıcıyı çağırmamalı`);
}

for (const dkdRuntimePath of [
  'assets/app.v2.runtime.js',
  'assets/app.v2.runtime.css',
  'assets/v2.4.runtime.js',
  'assets/v2.4.runtime.css',
  'assets/v2.5.runtime.js',
  'assets/v2.5.runtime.css',
  'assets/v2.6.runtime.js',
  'assets/v2.6.runtime.css',
  'assets/v3.2.4.runtime.js',
  'assets/v3.2.4.runtime.css',
  'assets/v3.2.5.session.runtime.js',
  'assets/v3.2.5.features.runtime.js',
  'assets/v3.2.5.runtime.css',
]) {
  assert.ok(fs.existsSync(path.join(dkdRoot, dkdRuntimePath)), `${dkdRuntimePath} bulunmalı`);
  assert.ok(dkdSize(dkdRuntimePath) > 100, `${dkdRuntimePath} boş olmamalı`);
}

for (const dkdExpected of [
  'app.v2.runtime.css',
  'app.v2.runtime.js',
  'v2.4.runtime.css',
  'v2.4.runtime.js',
  'v2.5.runtime.css',
  'v2.5.runtime.js',
  'v2.6.runtime.css',
  'v2.6.runtime.js',
  'v3.2.4.runtime.css',
  'v3.2.5.runtime.css',
  'v3.2.7-r4.js',
]) {
  assert.ok(dkdLoader.includes(dkdExpected), `${dkdExpected} r4 yükleyicisinde bulunmalı`);
}

assert.doesNotMatch(dkdLoader, /\.payload(?:\.|')/,
  'r4 yükleyicisi tarayıcıda payload indirmemeli');
assert.doesNotMatch(dkdLoader, /DecompressionStream/,
  'r4 yükleyicisi tarayıcıda gzip açmamalı');
assert.doesNotMatch(dkdLoader, /serviceWorker\.register/,
  'r4 yükleyicisi yeni service worker kaydetmemeli');
assert.match(dkdLoader, /serviceWorker\.getRegistrations/);
assert.match(dkdLoader, /dkdRegistration\.unregister\(\)/);
assert.match(dkdLoader, /dkdBootWebV327R4\(\)\.catch\(dkdShowBootError\)/);

for (const dkdExpected of [
  'v3.2.4.runtime.js',
  'v3.2.5.session.runtime.js',
  'v3.2.5.features.runtime.js',
  'v3.2.7.features.js',
]) {
  assert.ok(dkdFeatureLoader.includes(dkdExpected), `${dkdExpected} statik özellik yükleyicisinde bulunmalı`);
}
assert.doesNotMatch(dkdFeatureLoader, /payload/);
assert.doesNotMatch(dkdFeatureLoader, /DecompressionStream/);

assert.equal(dkdManifest.start_url, '/DraBornGate/?v=3.2.7-r4');

console.log('DraBornGate v3.2.7-r4 statik çalışma dosyaları ve açılış regresyon testleri geçti.');
