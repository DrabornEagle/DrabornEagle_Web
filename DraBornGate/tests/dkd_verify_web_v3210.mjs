import fs from 'node:fs';
import assert from 'node:assert/strict';

const dkdRead = (dkdPath) => fs.readFileSync(new URL(`../${dkdPath}`, import.meta.url), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.10.guard.js');
const dkdModern = dkdRead('assets/v3.2.10.js');
const dkdModernCss = dkdRead('assets/v3.2.10.css');
const dkdSimple = dkdRead('assets/v3.2.10.simple.js');
const dkdSimpleCss = dkdRead('assets/v3.2.10.simple.css');
const dkdData = dkdRead('assets/v3.2.1.data.js');
const dkdMainHtml = dkdRead('index.html');
const dkdSimpleHtml = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.10'/);
assert.match(dkdApp, /v3\.2\.10\.guard\.js/);
assert.match(dkdApp, /v3\.2\.10\.simple\.css/);
assert.match(dkdApp, /v3\.2\.10\.simple\.js/);
assert.match(dkdApp, /v3\.2\.10\.css/);
assert.match(dkdApp, /v3\.2\.10\.js/);
assert.doesNotMatch(dkdApp, /v3\.2\.9\.guard\.js/);
assert.ok(dkdApp.indexOf('if (dkdSimpleMode) {') < dkdApp.indexOf('app.v2.payload'));

assert.match(dkdGuard, /DKD_V3210_VERSION = '3\.2\.10'/);
assert.match(dkdGuard, /\(\?!\\d\|\\\.\\d\)/);
assert.doesNotMatch(dkdGuard, /\[0-9\]\|10/);
assert.match(dkdData, /DKD_V321_COMPAT_VERSION = '3\.2\.10'/);

assert.match(dkdSimple, /id = 'dkd-v3210-theme'/);
assert.match(dkdSimple, /dkd-v3210-bell/);
assert.match(dkdSimple, /location\.replace\(`\/DraBornGate\/\?theme=modern/);
assert.match(dkdSimple, /window\.setInterval\(dkdV3210CheckQueue, 10000\)/);
assert.match(dkdSimple, /location\.reload\(\)/);
assert.match(dkdSimple, /dkdV3210EnhanceModal/);
assert.match(dkdSimple, /Kurye doğrulandı/);
assert.match(dkdSimpleCss, /dkdV3210LogoOrbit/);
assert.match(dkdSimpleCss, /box-shadow:none!important/);
assert.match(dkdSimpleCss, /text-shadow:none!important/);
assert.doesNotMatch(dkdSimpleCss, /drop-shadow/);

assert.match(dkdModern, /dkdV3210InstallSelectionGuards/);
assert.match(dkdModern, /HTMLSelectElement\.prototype/);
assert.match(dkdModern, /HTMLOptionElement\.prototype/);
assert.match(dkdModern, /dkdV3210MountSitePicker/);
assert.match(dkdModern, /dkdV3210RemoveDuplicateEarnings/);
assert.match(dkdModern, /dkd-v3210-site-picker/);
assert.match(dkdModernCss, /dkd-v328-site-picker/);
assert.match(dkdModernCss, /select\[data-dkd-v3210-site-select/);
assert.match(dkdModernCss, /box-shadow:none!important/);

for (const dkdHtml of [dkdMainHtml, dkdSimpleHtml]) {
  assert.match(dkdHtml, /v3\.2\.10/);
  assert.match(dkdHtml, /app\.js\?v=3\.2\.10/);
}
assert.match(dkdManifest, /DraBornGate Web v3\.2\.10/);
assert.match(dkdManifest, /\?v=3\.2\.10/);
assert.match(dkdWorker, /draborngate-web-v3\.2\.10-theme-notifications-site-lock/);
assert.match(dkdWorker, /v3\.2\.10\.guard\.js\?v=3\.2\.10/);
assert.match(dkdWorker, /v3\.2\.10\.simple\.js\?v=3\.2\.10/);
assert.match(dkdWorker, /v3\.2\.10\.js\?v=3\.2\.10/);

console.log('DraBornGate Web v3.2.10 doğrulamaları başarılı.');
