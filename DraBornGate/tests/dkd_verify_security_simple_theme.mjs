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
const dkdThemeJs = dkdUnpack('assets/v2.4.js.payload.txt');
const dkdThemeCss = dkdUnpack('assets/v2.4.css.payload.txt');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdServiceWorker = dkdRead('sw.js');

new vm.Script(dkdApp, { filename: 'assets/app.js' });
new vm.Script(dkdThemeJs, { filename: 'assets/v2.4.js' });
JSON.parse(dkdManifest);

assert.match(dkdApp, /DKD_WEB_VERSION\s*=\s*['"]2\.4\.0['"]/);
assert.match(dkdApp, /v2\.3\.js/);
assert.match(dkdApp, /v2\.4\.js\.payload\.txt/);
assert.match(dkdApp, /v2\.4\.css\.payload\.txt/);
assert.match(dkdApp, /dkd_gate_security_theme/);
assert.match(dkdApp, /guvenlik-sade-tema/);

for (const dkdRequired of [
  'dkdV24ShowChooser', 'dkdV24ActivateSimple', 'dkdV24SourceCards',
  'dkdV24SubmitMatch', 'dkdV24NativeValue', 'dkdV24WaitForNativeInput',
  'MutationObserver', 'DKD_V24_SIMPLE_PATH',
  'data-dkd-v24-theme="simple"', 'data-dkd-v24-theme="modern"',
]) assert.ok(dkdThemeJs.includes(dkdRequired), `Eksik v2.4 işlevi: ${dkdRequired}`);

assert.match(dkdThemeJs, /Object\.getOwnPropertyDescriptor\(HTMLInputElement\.prototype, ['"]value['"]\)/);
assert.match(dkdThemeJs, /sessionStorage\.setItem\(DKD_V24_THEME_KEY/);
assert.match(dkdThemeJs, /location\.assign\(DKD_V24_SIMPLE_PATH\)/);
assert.match(dkdThemeCss, /\.dkd-v24-theme-backdrop/);
assert.match(dkdThemeCss, /\.dkd-v24-simple-shell/);
assert.match(dkdThemeCss, /\.dkd-v24-courier-card/);
assert.match(dkdThemeCss, /\.dkd-v24-code-row input/);
assert.match(dkdThemeCss, /prefers-reduced-motion/);

assert.match(dkdIndex, /assets\/app\.js\?v=2\.4\.0/);
assert.match(dkdSimpleIndex, /dkd_gate_security_theme/);
assert.match(dkdSimpleIndex, /dkd_gate_force_theme/);
assert.match(dkdSimpleIndex, /Guvenlik-Sade-Tema/);
assert.match(dkdSimpleIndex, /<base href="\/DraBornGate\/">/);
assert.equal(JSON.parse(dkdManifest).name, 'DraBornGate Web v2.4');
assert.match(dkdServiceWorker, /draborngate-web-v2\.4\.0/);
assert.match(dkdServiceWorker, /Guvenlik-Sade-Tema/);
assert.match(dkdServiceWorker, /assets\/v2\.4\.js\.payload\.txt\?v=2\.4\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.4\.css\.payload\.txt\?v=2\.4\.0/);

console.log('DraBornGate Web v2.4 Guvenlik Sade Tema dogrulamasi basarili.');
