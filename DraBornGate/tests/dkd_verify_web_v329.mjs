import fs from 'node:fs';
import assert from 'node:assert/strict';

const dkdRead = (dkdPath) => fs.readFileSync(new URL(`../${dkdPath}`, import.meta.url), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdGuard = dkdRead('assets/v3.2.9.guard.js');
const dkdSimpleJs = dkdRead('assets/v3.2.9.simple.js');
const dkdSimpleCss = dkdRead('assets/v3.2.9.simple.css');
const dkdModernJs = dkdRead('assets/v3.2.9.js');
const dkdModernCss = dkdRead('assets/v3.2.9.css');
const dkdData = dkdRead('assets/v3.2.1.data.js');
const dkdMainHtml = dkdRead('index.html');
const dkdSimpleHtml = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');

assert.match(dkdApp, /DKD_WEB_VERSION = '3\.2\.9'/);
assert.match(dkdApp, /dkdBootSimpleV329/);
assert.match(dkdApp, /v3\.2\.9\.simple\.css/);
assert.match(dkdApp, /v3\.2\.9\.simple\.js/);
assert.match(dkdApp, /v3\.2\.9\.css/);
assert.match(dkdApp, /v3\.2\.9\.js/);
assert.doesNotMatch(dkdApp, /v2\.3\.js\?v=/);
assert.doesNotMatch(dkdApp, /v2\.8\.js\?v=/);
assert.doesNotMatch(dkdApp, /v3\.2\.5\.js\?v=/);
assert.doesNotMatch(dkdApp, /v3\.2\.8\.js\?v=/);
assert.match(dkdApp, /dataset\.dkdV329SimpleReady/);
assert.match(dkdApp, /dataset\.dkdV329Ready/);

assert.match(dkdGuard, /DKD_V329_VERSION = '3\.2\.9'/);
assert.match(dkdData, /DKD_V321_COMPAT_VERSION = '3\.2\.9'/);

assert.match(dkdSimpleJs, /dkdV329SimpleMount/);
assert.match(dkdSimpleJs, /addEventListener\('submit', dkdV329SimpleSearch\)/);
assert.match(dkdSimpleJs, /dkdV329SimpleData\.findPass\(dkdCode\)/);
assert.match(dkdSimpleJs, /dkdV329SimpleOpenPassModal/);
assert.match(dkdSimpleJs, /dkdV329SimpleData\.approvePass/);
assert.match(dkdSimpleJs, /dataset\.dkdV329SimpleReady = 'true'/);
assert.match(dkdSimpleCss, /dkd-v329-finder/);
assert.match(dkdSimpleCss, /dkd-v329-modal-panel/);

assert.match(dkdModernJs, /dkdV329MountSiteSearch/);
assert.match(dkdModernJs, /dkd-v329-site-host/);
assert.match(dkdModernJs, /dkdV329SetSelectValue/);
assert.match(dkdModernJs, /dkdV329EnsureEarningsMenu/);
assert.match(dkdModernJs, /Kazançlarım/);
assert.match(dkdModernJs, /Kurye Paneli/);
assert.match(dkdModernCss, /select\.dkd-v329-native-site/);
assert.match(dkdModernCss, /dkd-v329-site-window/);
assert.match(dkdModernCss, /data-dkd-v31-menu="earnings"/);

for (const dkdHtml of [dkdMainHtml, dkdSimpleHtml]) {
  assert.match(dkdHtml, /v3\.2\.9/);
  assert.match(dkdHtml, /app\.js\?v=3\.2\.9/);
  assert.match(dkdHtml, /dkd-simple-booting/);
}
assert.match(dkdManifest, /DraBornGate Web v3\.2\.9/);
assert.match(dkdManifest, /\?v=3\.2\.9/);
assert.match(dkdWorker, /draborngate-web-v3\.2\.9-isolated-simple-stable-site-popup/);
assert.match(dkdWorker, /v3\.2\.9\.simple\.js\?v=3\.2\.9/);
assert.match(dkdWorker, /v3\.2\.9\.js\?v=3\.2\.9/);
assert.doesNotMatch(dkdWorker, /v3\.2\.8\.js\?v=3\.2\.9/);

const dkdAssetMatches = [...dkdWorker.matchAll(/'\/DraBornGate\/([^']*)'/g)];
for (const dkdMatch of dkdAssetMatches) {
  const dkdAssetPath = String(dkdMatch[1] || '').split('?')[0];
  if (!dkdAssetPath || dkdAssetPath.endsWith('/')) continue;
  assert.equal(fs.existsSync(new URL(`../${dkdAssetPath}`, import.meta.url)), true, `Service worker varlığı bulunamadı: ${dkdAssetPath}`);
}

console.log('DraBornGate Web v3.2.9 doğrulamaları başarılı.');
