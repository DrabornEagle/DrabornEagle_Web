import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');
const dkdUnpackText = (dkdPayload) => zlib.gunzipSync(Buffer.from(dkdPayload.trim(), 'base64')).toString('utf8');
const dkdUnpack = (dkdRelative) => dkdUnpackText(dkdRead(dkdRelative));
const dkdJoin = (dkdPattern, dkdCount) => Array.from({ length: dkdCount }, (_, dkdIndex) => dkdRead(`${dkdPattern}.${dkdIndex + 1}.txt`).trim()).join('');

const dkdApp = dkdRead('assets/app.js');
const dkdThemeV24Js = dkdUnpack('assets/v2.4.js.payload.txt');
const dkdThemeV24Css = dkdUnpack('assets/v2.4.css.payload.txt');
const dkdThemeV25Js = dkdUnpackText(dkdJoin('assets/v2.5.js.payload', 5));
const dkdThemeV25Css = dkdUnpack('assets/v2.5.css.payload.txt');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdServiceWorker = dkdRead('sw.js');

new vm.Script(dkdApp, { filename: 'assets/app.js' });
new vm.Script(dkdThemeV24Js, { filename: 'assets/v2.4.js' });
new vm.Script(dkdThemeV25Js, { filename: 'assets/v2.5.js' });
JSON.parse(dkdManifest);

assert.match(dkdApp, /DKD_WEB_VERSION\s*=\s*['"]2\.5\.2['"]/);
assert.match(dkdApp, /dkdReadJoinedPayload/);
assert.match(dkdApp, /v2\.5\.js\.payload/);
assert.match(dkdApp, /v2\.5\.css\.payload\.txt/);
assert.match(dkdApp, /dkdBootWebV25/);

for (const dkdRequired of [
  'dkdV25ReplaceVersions', 'dkdV25FixThemeChooserLayout', 'dkdV25EnsureModernToSimpleSwitch',
  'dkdV25SourceCards', 'dkdV25OpenQueuePage', 'dkdV25RenderSimpleQueue',
  'dkdV25SubmitMatch', 'dkdV25NativeValue', 'dkdV25WaitForNativeInput',
  'MutationObserver', 'DKD_V25_SIMPLE_PATH', 'kurye kuyrugu', 'gecis talepleri',
]) assert.ok(dkdThemeV25Js.includes(dkdRequired), `Eksik v2.5 işlevi: ${dkdRequired}`);

assert.match(dkdThemeV25Js, /DKD_V25_VERSION\s*=\s*['"]2\.5\.2['"]/);
assert.match(dkdThemeV25Js, /Object\.getOwnPropertyDescriptor\(HTMLInputElement\.prototype, ['"]value['"]\)/);
assert.match(dkdThemeV25Js, /sessionStorage\.setItem\(DKD_V25_THEME_KEY/);
assert.match(dkdThemeV25Js, /location\.assign\(DKD_V25_SIMPLE_PATH\)/);
assert.match(dkdThemeV25Css, /\.dkd-v25-theme-action/);
assert.match(dkdThemeV25Css, /\.dkd-v25-modern-to-simple/);
assert.match(dkdThemeV25Css, /\.dkd-v25-courier-card/);
assert.match(dkdThemeV25Css, /\.dkd-v25-code-row input/);
assert.match(dkdThemeV25Css, /prefers-reduced-motion/);

assert.match(dkdThemeV24Js, /dkdV24ShowChooser/);
assert.match(dkdThemeV24Css, /\.dkd-v24-simple-shell/);
assert.match(dkdIndex, /DraBornGate Web v2\.5\.2/);
assert.match(dkdIndex, /assets\/app\.js\?v=2\.5\.2/);
assert.match(dkdSimpleIndex, /Güvenlik Sade Tema v2\.5\.2/);
assert.match(dkdSimpleIndex, /dkd_gate_security_theme/);
assert.match(dkdSimpleIndex, /Guvenlik-Sade-Tema/);
assert.equal(JSON.parse(dkdManifest).name, 'DraBornGate Web v2.5.2');
assert.match(dkdServiceWorker, /draborngate-web-v2\.5\.2/);
for (let dkdPart = 1; dkdPart <= 5; dkdPart += 1) {
  assert.match(dkdServiceWorker, new RegExp(`assets/v2\\.5\\.js\\.payload\\.${dkdPart}\\.txt\\?v=2\\.5\\.2`));
}
assert.match(dkdServiceWorker, /assets\/v2\.5\.css\.payload\.txt\?v=2\.5\.2/);

console.log('DraBornGate Web v2.5.2 Guvenlik tema ve canli kuyruk dogrulamasi basarili.');
