import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');

const dkdLoader = dkdRead('assets/app-v2.9.3-stable.js');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdServiceWorker = dkdRead('sw.js');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));

new vm.Script(dkdLoader, { filename: 'assets/app-v2.9.3-stable.js' });
new vm.Script(dkdServiceWorker, { filename: 'sw.js' });

assert.match(dkdLoader, /DKD_WEB_VERSION\s*=\s*['"]2\.9\.3['"]/);
assert.match(dkdLoader, /function dkdRemoveBlockingLayers/);
assert.match(dkdLoader, /classList\.remove\(['"]dkd-v29-simple-active['"], ['"]dkd-v28-simple-active['"]\)/);
assert.match(dkdLoader, /querySelector\(['"]#dkd-v29-root['"]\)\?\.remove\(\)/);
assert.match(dkdLoader, /querySelector\(['"]#dkd-v28-root['"]\)\?\.remove\(\)/);
assert.match(dkdLoader, /style\.pointerEvents\s*=\s*['"]auto['"]/);
assert.match(dkdLoader, /querySelectorAll\(['"]\[inert\]['"]\)/);
assert.match(dkdLoader, /setTimeout\(\(\) => \{\s*dkdFinishBoot\(['"]Güvenlik paneli açıldı['"]\);\s*\}, 8000\)/s);
assert.match(dkdLoader, /dkdFinishBoot\(['"]Güvenlik paneli hazır['"]\)/);
assert.match(dkdLoader, /v2\.7\.guard\.js/);
assert.match(dkdLoader, /v2\.7\.js/);
assert.doesNotMatch(dkdLoader, /import\(`\.\/v2\.8/);
assert.doesNotMatch(dkdLoader, /import\(`\.\/v2\.9/);
assert.doesNotMatch(dkdLoader, /dkdLoadEnhancements/);
assert.doesNotMatch(dkdLoader, /MutationObserver/);
assert.doesNotMatch(dkdLoader, /setInterval/);

assert.match(dkdIndex, /DraBornGate Web v2\.9\.3/);
assert.match(dkdIndex, /assets\/app-v2\.9\.3-stable\.js/);
assert.doesNotMatch(dkdIndex, /app-v2\.9\.2\.js/);
assert.doesNotMatch(dkdIndex, /v2\.9\.1-boot-recovery/);
assert.match(dkdIndex, /dkdRegistration\.unregister\(\)/);
assert.match(dkdIndex, /dkdKey\.startsWith\(['"]draborngate-web-['"]\)/);

assert.match(dkdSimpleIndex, /location\.replace\(dkdStableUrl\)/);
assert.match(dkdSimpleIndex, /theme=modern&dkd_emergency=293/);
assert.match(dkdSimpleIndex, /Dokunmayı engelleyen Sade Tema katmanı geçici olarak devreden çıkarıldı/);
assert.doesNotMatch(dkdSimpleIndex, /app-v2\.9\.2\.js/);
assert.doesNotMatch(dkdSimpleIndex, /app-v2\.9\.3-stable\.js/);
assert.doesNotMatch(dkdSimpleIndex, /setItem\(['"]dkd_gate_force_theme['"],\s*['"]simple['"]\)/);

assert.match(dkdServiceWorker, /self\.registration\.unregister\(\)/);
assert.match(dkdServiceWorker, /dkdKey\.startsWith\(DKD_CACHE_PREFIX\)/);
assert.doesNotMatch(dkdServiceWorker, /addEventListener\(['"]fetch['"]/);
assert.equal(dkdManifest.name, 'DraBornGate Web v2.9.3');
assert.match(dkdManifest.start_url, /v=2\.9\.3/);

console.log('DraBornGate Web v2.9.3 acil kararlı ve tıklanabilir panel doğrulaması başarılı.');
