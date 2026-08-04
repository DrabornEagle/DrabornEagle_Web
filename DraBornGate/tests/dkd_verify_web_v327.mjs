import fs from 'node:fs';
import assert from 'node:assert/strict';

const dkdRead = (dkdPath) => fs.readFileSync(new URL(`../${dkdPath}`, import.meta.url), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.7.guard.js');
const dkdFeatures = dkdRead('assets/v3.2.7.js');
const dkdStyles = dkdRead('assets/v3.2.7.css');
const dkdMainHtml = dkdRead('index.html');
const dkdSimpleHtml = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.7'/);
assert.match(dkdApp, /v3\.2\.7\.guard\.js/);
assert.match(dkdApp, /v3\.2\.7\.css/);
assert.match(dkdApp, /v3\.2\.7\.js/);
assert.match(dkdApp, /classList\.add\('dkd-simple-booting'\)/);
assert.match(dkdApp, /classList\.remove\('dkd-simple-booting'\)/);

assert.match(dkdGuard, /DKD_V327_VERSION = '3\.2\.7'/);
assert.match(dkdFeatures, /dkdV327RemoveDuplicateEarnings/);
assert.match(dkdFeatures, /!== 'kazancim'/);
assert.match(dkdFeatures, /dkd-v23-site-search,\.dkd-v324-site-search/);
assert.match(dkdFeatures, /document\.addEventListener\('click'/);
assert.match(dkdFeatures, /document\.addEventListener\('submit'/);
assert.match(dkdFeatures, /dkdData\.findPass\(dkdCode\)/);
assert.match(dkdFeatures, /dkdData\.approvePass/);
assert.match(dkdFeatures, /dkd-v327-courier-modal/);
assert.match(dkdStyles, /dkd-v327-site-compact/);
assert.match(dkdStyles, /dkd-v327-panel/);

for (const dkdHtml of [dkdMainHtml, dkdSimpleHtml]) {
  assert.match(dkdHtml, /v3\.2\.7/);
  assert.match(dkdHtml, /app\.js\?v=3\.2\.7/);
  assert.match(dkdHtml, /dkd-simple-booting/);
}
assert.match(dkdManifest, /DraBornGate Web v3\.2\.7/);
assert.match(dkdManifest, /\?v=3\.2\.7/);
assert.match(dkdWorker, /draborngate-web-v3\.2\.7-popup-site-flash-fixes/);
assert.match(dkdWorker, /v3\.2\.7\.js\?v=3\.2\.7/);
assert.match(dkdWorker, /v3\.2\.7\.css\?v=3\.2\.7/);

console.log('DraBornGate Web v3.2.7 doğrulamaları başarılı.');
