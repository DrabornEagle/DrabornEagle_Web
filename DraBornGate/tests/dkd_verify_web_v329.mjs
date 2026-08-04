import fs from 'node:fs';
import assert from 'node:assert/strict';

const dkdRead = (dkdPath) => fs.readFileSync(new URL(`../${dkdPath}`, import.meta.url), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.9.guard.js');
const dkdModern = dkdRead('assets/v3.2.9.js');
const dkdModernStyles = dkdRead('assets/v3.2.9.css');
const dkdSimple = dkdRead('assets/v3.2.9.simple.js');
const dkdSimpleStyles = dkdRead('assets/v3.2.9.simple.css');
const dkdData = dkdRead('assets/v3.2.1.data.js');
const dkdMainHtml = dkdRead('index.html');
const dkdSimpleHtml = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.9'/);
assert.match(dkdApp, /v3\.2\.9\.guard\.js/);
assert.match(dkdApp, /dkdBootSimpleV329/);
assert.match(dkdApp, /v3\.2\.9\.simple\.css/);
assert.match(dkdApp, /v3\.2\.9\.simple\.js/);
assert.match(dkdApp, /if \(dkdSimpleMode\) \{/);
assert.match(dkdApp, /await dkdBootSimpleV329\(\);[\s\S]*dkdFinishBoot\(\);[\s\S]*return;/);
assert.ok(dkdApp.indexOf('if (dkdSimpleMode) {') < dkdApp.indexOf("dkdAppendPackedStyle('./assets/app.v2.css.payload.txt'"));
const dkdSimpleBootBody = dkdApp.slice(dkdApp.indexOf('async function dkdBootSimpleV329'), dkdApp.indexOf('async function dkdBootModernV329'));
assert.doesNotMatch(dkdSimpleBootBody, /v2\.8\.js/);
assert.match(dkdApp, /v3\.2\.8\.js/);
assert.match(dkdApp, /v3\.2\.9\.js/);
assert.match(dkdApp, /classList\.remove\('dkd-simple-booting'\)/);

assert.match(dkdGuard, /DKD_V329_VERSION = '3\.2\.9'/);
assert.match(dkdGuard, /\[0-8\]/);
assert.match(dkdData, /DKD_V321_COMPAT_VERSION = '3\.2\.9'/);

assert.match(dkdModern, /dkdV329InterceptLegacyInput/);
assert.match(dkdModern, /dkdV329InterceptLegacyButton/);
assert.match(dkdModern, /stopImmediatePropagation/);
assert.match(dkdModern, /HTMLSelectElement\.prototype/);
assert.match(dkdModern, /data-dkd-v329-stable/);
assert.doesNotMatch(dkdModern, /setInterval/);
assert.match(dkdModernStyles, /data-dkd-v329-stable/);
assert.match(dkdModernStyles, /animation: none/);

assert.match(dkdSimple, /Kuryeni Bul ve Eşleştir/);
assert.match(dkdSimple, /dkdV329Data\.findPass/);
assert.match(dkdSimple, /dkdV329SimpleOpenPass/);
assert.match(dkdSimple, /dkdV329Data\.approvePass/);
assert.match(dkdSimple, /Kurye Bilgileri/);
assert.match(dkdSimple, /GİDECEĞİ TAM ADRES/);
assert.match(dkdSimple, /Kapıda Bekleyenler/);
assert.match(dkdSimple, /<details class="dkd-v329-group"/);
assert.doesNotMatch(dkdSimple, /MutationObserver/);
assert.match(dkdSimpleStyles, /#dkd-v329-simple-root/);
assert.match(dkdSimpleStyles, /#dkd-app>\*:not\(#dkd-v329-simple-root\)/);

for (const dkdHtml of [dkdMainHtml, dkdSimpleHtml]) {
  assert.match(dkdHtml, /v3\.2\.9/);
  assert.match(dkdHtml, /app\.js\?v=3\.2\.9/);
  assert.match(dkdHtml, /dkd-simple-booting/);
  assert.doesNotMatch(dkdHtml, /v3\.2\.8/);
}

assert.match(dkdManifest, /DraBornGate Web v3\.2\.9/);
assert.match(dkdManifest, /\?v=3\.2\.9/);
assert.match(dkdWorker, /draborngate-web-v3\.2\.9-simple-isolation-site-stability/);
assert.match(dkdWorker, /v3\.2\.9\.simple\.js\?v=3\.2\.9/);
assert.match(dkdWorker, /v3\.2\.9\.js\?v=3\.2\.9/);
assert.match(dkdWorker, /v3\.2\.9\.guard\.js\?v=3\.2\.9/);

console.log('DraBornGate Web v3.2.9 doğrulamaları başarılı.');
