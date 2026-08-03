import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdThemeV27Js = dkdRead('assets/v2.7.js');
const dkdThemeV27Css = dkdRead('assets/v2.7.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdServiceWorker = dkdRead('sw.js');

new vm.Script(dkdApp, { filename: 'assets/app.js' });
new vm.Script(dkdThemeV27Js, { filename: 'assets/v2.7.js' });

assert.match(dkdApp, /DKD_WEB_VERSION\s*=\s*['"]2\.7\.0['"]/);
assert.match(dkdApp, /dkdBootWebV27/);
assert.match(dkdApp, /dkdAppendStyleLink/);
assert.match(dkdApp, /v2\.7\.css/);
assert.match(dkdApp, /v2\.7\.js/);

for (const dkdRequired of [
  'dkdV27Mount', 'dkdV27ScanSources', 'dkdV27IsNativeCodeInput',
  'dkdV27FindSubmit', 'dkdV27ExtractDetails', 'dkdV27Submit',
  'dkdV27RenameModernSwitch', 'dkdV27OpenNativeQueue',
  'dkd-v27-root', 'MutationObserver', 'DKD_V27_BANNED_ANCESTOR',
]) assert.ok(dkdThemeV27Js.includes(dkdRequired), `Eksik v2.7 işlevi: ${dkdRequired}`);

assert.match(dkdThemeV27Js, /DKD_V27_VERSION\s*=\s*['"]2\.7\.0['"]/);
assert.match(dkdThemeV27Js, /dkdV27State\.missCycles\s*>=\s*6/);
assert.match(dkdThemeV27Js, /seenInputs\s*=\s*new Set/);
assert.match(dkdThemeV27Js, /Object\.getOwnPropertyDescriptor\(HTMLInputElement\.prototype, ['"]value['"]\)/);
assert.match(dkdThemeV27Js, /Modern Temadan Sade Temaya Geçiş/);
assert.match(dkdThemeV27Js, /premium menu/);
assert.match(dkdThemeV27Js, /input\.closest\(DKD_V27_BANNED_ANCESTOR\)/);
assert.match(dkdThemeV27Js, /location\.assign\(['"]\/DraBornGate\/['"]\)/);
assert.match(dkdThemeV27Js, /location\.assign\(['"]\/DraBornGate\/Guvenlik-Sade-Tema\/['"]\)|DKD_V27_SIMPLE_PATH/);

for (const dkdClass of [
  '#dkd-v27-root', '.dkd-v27-request-card', '.dkd-v27-code-panel',
  '.dkd-v27-info-grid', '.dkd-v27-empty', '.dkd-v27-radar',
]) assert.ok(dkdThemeV27Css.includes(dkdClass), `Eksik v2.7 stil sınıfı: ${dkdClass}`);
assert.match(dkdThemeV27Css, /body\.dkd-v27-simple-active>\*:not\(#dkd-v27-root\)/);
assert.match(dkdThemeV27Css, /left:-100000px!important/);
assert.match(dkdThemeV27Css, /prefers-reduced-motion/);
assert.match(dkdThemeV27Css, /@media\(max-width:560px\)/);

assert.match(dkdIndex, /DraBornGate Web v2\.7\.0/);
assert.match(dkdIndex, /id="dkd-v27-splash"/);
assert.match(dkdIndex, /assets\/app\.js\?v=2\.7\.0/);
assert.doesNotMatch(dkdIndex, /DraBornGate Web v2\.3\.0/);
assert.match(dkdSimpleIndex, /Güvenlik Sade Tema v2\.7\.0/);
assert.match(dkdSimpleIndex, /id="dkd-v27-splash"/);
assert.match(dkdSimpleIndex, /dkd_gate_force_theme/);
assert.equal(dkdManifest.name, 'DraBornGate Web v2.7.0');
assert.match(dkdServiceWorker, /draborngate-web-v2\.7\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.7\.js\?v=2\.7\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.7\.css\?v=2\.7\.0/);

console.log('DraBornGate Web v2.7.0 bağımsız Sade Tema doğrulaması başarılı.');
