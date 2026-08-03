import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');

const dkdRecovery = dkdRead('assets/v2.9.1-boot-recovery.js');
const dkdServiceWorker = dkdRead('sw.js');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));

new vm.Script(dkdRecovery, { filename: 'assets/v2.9.1-boot-recovery.js' });
new vm.Script(dkdServiceWorker, { filename: 'sw.js' });

assert.match(dkdRecovery, /DKD_RECOVERY_VERSION\s*=\s*['"]2\.9\.1['"]/);
assert.match(dkdRecovery, /navigator\.serviceWorker\.getRegistrations\(\)/);
assert.match(dkdRecovery, /dkdKey\.startsWith\(['"]draborngate-web-['"]\)/);
assert.match(dkdRecovery, /sessionStorage\.getItem\(DKD_RECOVERY_ATTEMPT_KEY\)/);
assert.match(dkdRecovery, /sessionStorage\.setItem\(DKD_RECOVERY_ATTEMPT_KEY/);
assert.match(dkdRecovery, /Date\.now\(\) - dkdStartedAt < 11000/);
assert.match(dkdRecovery, /location\.replace\(dkdUrl\.toString\(\)\)/);
assert.match(dkdRecovery, /Açılış tamamlanamadı\. Tekrar Dene düğmesine dokunun\./);

assert.match(dkdServiceWorker, /draborngate-web-v2\.9\.1-boot-hotfix/);
assert.match(dkdServiceWorker, /AbortController/);
assert.match(dkdServiceWorker, /dkdFetchWithTimeout/);
assert.match(dkdServiceWorker, /async function dkdCacheFirst/);
assert.ok(
  dkdServiceWorker.indexOf('const dkdExact = await caches.match(dkdRequest)') <
    dkdServiceWorker.indexOf('return dkdCacheResponse(dkdRequest, await dkdFetchWithTimeout(dkdRequest))'),
  'Statik dosyalarda önbellek ağdan önce kontrol edilmeli.'
);
assert.match(dkdServiceWorker, /ignoreSearch: true/);
assert.match(dkdServiceWorker, /dkdEvent\.request\.mode === ['"]navigate['"]/);
assert.match(dkdServiceWorker, /v2\.9\.1-boot-recovery\.js\?v=2\.9\.1/);

for (const dkdHtml of [dkdIndex, dkdSimpleIndex]) {
  assert.match(dkdHtml, /v2\.9\.1/);
  assert.match(dkdHtml, /v2\.9\.1-boot-recovery\.js\?v=2\.9\.1/);
  assert.match(dkdHtml, /assets\/app\.js\?v=2\.9\.1/);
}

assert.equal(dkdManifest.name, 'DraBornGate Web v2.9.1');
console.log('DraBornGate Web v2.9.1 açılış kurtarma ve Service Worker doğrulaması başarılı.');
