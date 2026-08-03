import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');
const dkdUnpack = (dkdRelative) => zlib.gunzipSync(Buffer.from(dkdRead(dkdRelative).trim(), 'base64')).toString('utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdThemeV26Js = dkdUnpack('assets/v2.6.js.payload.txt');
const dkdThemeV26Css = dkdUnpack('assets/v2.6.css.payload.txt');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdServiceWorker = dkdRead('sw.js');

new vm.Script(dkdApp, { filename: 'assets/app.js' });
new vm.Script(dkdThemeV26Js, { filename: 'assets/v2.6.js' });

assert.match(dkdApp, /DKD_WEB_VERSION\s*=\s*['"]2\.6\.0['"]/);
assert.match(dkdApp, /dkdBootWebV26/);
assert.match(dkdApp, /v2\.6\.js\.payload\.txt/);
assert.match(dkdApp, /v2\.6\.css\.payload\.txt/);

for (const dkdRequired of [
  'dkdReplaceVisibleVersions', 'dkdCreateSimpleShell', 'dkdBuildNativeEntries',
  'dkdFindNativeInputs', 'dkdFindMatchButton', 'dkdFindLocalContainer',
  'dkdRenderEntries', 'dkdSubmitEntry', 'dkdEnsureModernSwitch',
  'DKD_V26_EMPTY_CONFIRMATIONS', 'MutationObserver', 'dkd-v26-splash',
]) assert.ok(dkdThemeV26Js.includes(dkdRequired), `Eksik v2.6 işlevi: ${dkdRequired}`);

assert.match(dkdThemeV26Js, /DKD_V26_EMPTY_CONFIRMATIONS\s*=\s*4/);
assert.match(dkdThemeV26Js, /Object\.getOwnPropertyDescriptor\(HTMLInputElement\.prototype, ['"]value['"]\)/);
assert.match(dkdThemeV26Js, /text\.length > 1400/);
assert.match(dkdThemeV26Js, /premium menü/);
assert.match(dkdThemeV26Js, /location\.assign\(DKD_V26_SIMPLE_PATH\)/);
assert.match(dkdThemeV26Js, /data-dkd-v26-code/);

for (const dkdClass of [
  '.dkd-v26-shell', '.dkd-v26-request-card', '.dkd-v26-code-panel',
  '.dkd-v26-modern-switch', '.dkd-v26-empty', '.dkd-v26-metrics',
]) assert.ok(dkdThemeV26Css.includes(dkdClass), `Eksik v2.6 stil sınıfı: ${dkdClass}`);
assert.match(dkdThemeV26Css, /prefers-reduced-motion/);

assert.match(dkdIndex, /DraBornGate Web v2\.6\.0/);
assert.match(dkdIndex, /id="dkd-v26-splash"/);
assert.match(dkdIndex, /assets\/app\.js\?v=2\.6\.0/);
assert.doesNotMatch(dkdIndex, /DraBornGate Web v2\.3\.0/);
assert.match(dkdSimpleIndex, /Güvenlik Sade Tema v2\.6\.0/);
assert.match(dkdSimpleIndex, /id="dkd-v26-splash"/);
assert.match(dkdSimpleIndex, /dkd_gate_force_theme/);
assert.equal(dkdManifest.name, 'DraBornGate Web v2.6.0');
assert.match(dkdServiceWorker, /draborngate-web-v2\.6\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.6\.js\.payload\.txt\?v=2\.6\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.6\.css\.payload\.txt\?v=2\.6\.0/);

console.log('DraBornGate Web v2.6.0 kararlı Sade Tema ve canlı kuyruk doğrulaması başarılı.');
