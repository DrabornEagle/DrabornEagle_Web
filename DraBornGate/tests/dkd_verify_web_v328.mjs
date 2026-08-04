import fs from 'node:fs';
import assert from 'node:assert/strict';

const dkdRead = (dkdPath) => fs.readFileSync(new URL(`../${dkdPath}`, import.meta.url), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.8.guard.js');
const dkdFeatures = dkdRead('assets/v3.2.8.js');
const dkdStyles = dkdRead('assets/v3.2.8.css');
const dkdData = dkdRead('assets/v3.2.1.data.js');
const dkdMainHtml = dkdRead('index.html');
const dkdSimpleHtml = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.8'/);
assert.match(dkdApp, /v3\.2\.8\.guard\.js/);
assert.match(dkdApp, /v3\.2\.8\.css/);
assert.match(dkdApp, /v3\.2\.8\.js/);
assert.doesNotMatch(dkdApp, /v3\.2\.7\.js\?v=/);
assert.match(dkdApp, /classList\.remove\('dkd-simple-booting'\)/);

assert.match(dkdGuard, /DKD_V328_VERSION = '3\.2\.8'/);
assert.match(dkdData, /DKD_V321_COMPAT_VERSION = '3\.2\.8'/);

assert.match(dkdFeatures, /dkdV328EnsureEarningsMenu/);
assert.match(dkdFeatures, /Kazançlarım/);
assert.match(dkdFeatures, /dkdV328MountSitePicker/);
assert.match(dkdFeatures, /dkd-v328-site-picker/);
assert.match(dkdFeatures, /dkdV328SyncLegacySelection/);
assert.match(dkdFeatures, /dkdLegacyButton\.click\(\)/);
assert.match(dkdFeatures, /dkdOriginalForm\.cloneNode\(true\)/);
assert.match(dkdFeatures, /dkdData\.findPass\(dkdCode\)/);
assert.match(dkdFeatures, /dkdV328RenderPassModal/);
assert.match(dkdFeatures, /Kurye Paneli/);
assert.match(dkdFeatures, /dkdV328WaitForSimpleReady/);
assert.doesNotMatch(dkdFeatures, /classList\.remove\('dkd-simple-booting'\)/);

assert.match(dkdStyles, /dkd-v328-site-host/);
assert.match(dkdStyles, /dkd-v328-site-row input/);
assert.match(dkdStyles, /pointer-events:auto/);
assert.match(dkdStyles, /dkd-v328-earnings-menu/);
assert.match(dkdStyles, /dkd-v328-panel/);

for (const dkdHtml of [dkdMainHtml, dkdSimpleHtml]) {
  assert.match(dkdHtml, /v3\.2\.8/);
  assert.match(dkdHtml, /app\.js\?v=3\.2\.8/);
  assert.match(dkdHtml, /dkd-simple-booting/);
}
assert.match(dkdManifest, /DraBornGate Web v3\.2\.8/);
assert.match(dkdManifest, /\?v=3\.2\.8/);
assert.match(dkdWorker, /draborngate-web-v3\.2\.8-site-popup-earnings-header/);
assert.match(dkdWorker, /v3\.2\.8\.js\?v=3\.2\.8/);
assert.match(dkdWorker, /v3\.2\.8\.css\?v=3\.2\.8/);
assert.doesNotMatch(dkdWorker, /v3\.2\.7\.js\?v=3\.2\.8/);

console.log('DraBornGate Web v3.2.8 doğrulamaları başarılı.');
