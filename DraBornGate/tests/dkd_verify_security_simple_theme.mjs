import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dkdTestDir = path.dirname(fileURLToPath(import.meta.url));
const dkdRoot = path.resolve(dkdTestDir, '..');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');

const dkdApp = dkdRead('assets/app.js');
const dkdThemeV28Js = dkdRead('assets/v2.8.js');
const dkdThemeV28Css = dkdRead('assets/v2.8.css');
const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = JSON.parse(dkdRead('manifest.webmanifest'));
const dkdServiceWorker = dkdRead('sw.js');

new vm.Script(dkdApp, { filename: 'assets/app.js' });
new vm.Script(dkdThemeV28Js, { filename: 'assets/v2.8.js' });

assert.match(dkdApp, /DKD_WEB_VERSION\s*=\s*['"]2\.8\.0['"]/);
assert.match(dkdApp, /dkdBootWebV28/);
assert.match(dkdApp, /dkdSetBootProgress/);
assert.match(dkdApp, /dkdBootWatchdog/);
assert.match(dkdApp, /dkdIsSimpleModeRequested/);
assert.match(dkdApp, /if \(!dkdSimpleMode\)/);
assert.match(dkdApp, /v2\.8\.css/);
assert.match(dkdApp, /v2\.8\.js/);

const dkdBootStart = dkdApp.indexOf('async function dkdBootWebV28');
const dkdBootEnd = dkdApp.indexOf('dkdBootWebV28().catch');
assert.ok(dkdBootStart >= 0 && dkdBootEnd > dkdBootStart);
const dkdBootBody = dkdApp.slice(dkdBootStart, dkdBootEnd);
const dkdProgressValues = [...dkdBootBody.matchAll(/dkdSetBootProgress\((\d+)/g)].map((dkdMatch) => Number(dkdMatch[1]));
assert.ok(dkdProgressValues.length >= 10, 'Gerçek yükleme aşamaları eksik.');
for (let dkdIndexValue = 1; dkdIndexValue < dkdProgressValues.length; dkdIndexValue += 1) {
  assert.ok(
    dkdProgressValues[dkdIndexValue] >= dkdProgressValues[dkdIndexValue - 1],
    `Yükleme ilerlemesi geriye gidiyor: ${dkdProgressValues.join(', ')}`
  );
}
assert.equal(dkdProgressValues.at(-1), 96);
assert.match(dkdApp, /function dkdFinishBoot\(\)[\s\S]*dkdSetBootProgress\(100, ['"]Hazır['"]\)/);

const dkdLegacyStart = dkdApp.indexOf('if (!dkdSimpleMode)');
const dkdV28LoadStart = dkdApp.indexOf("await dkdAppendStyleLink('./assets/v2.8.css'");
assert.ok(dkdLegacyStart >= 0 && dkdV28LoadStart > dkdLegacyStart);
const dkdLegacyBlock = dkdApp.slice(dkdLegacyStart, dkdV28LoadStart);
for (const dkdLegacyAsset of ['v2.4.css.payload.txt', 'v2.5.css.payload.txt', 'v2.6.css.payload.txt', 'v2.7.guard.js', 'v2.7.js']) {
  assert.ok(dkdLegacyBlock.includes(dkdLegacyAsset), `Modern katman eksik: ${dkdLegacyAsset}`);
}

for (const dkdRequired of [
  'dkdV28Mount', 'dkdV28ScanCandidates', 'dkdV28ScanSources',
  'dkdV28CandidateSignature', 'dkdV28Identity', 'dkdV28FindNativePair',
  'dkdV28Submit', 'dkdV28GoSimple', 'dkdV28GoModern',
  'dkdV28EnsureModernSwitchIcon', 'dkdV28HideLegacySwitches',
  'dkd-v28-root', 'MutationObserver', 'DKD_V28_LEGACY_SELECTOR',
]) assert.ok(dkdThemeV28Js.includes(dkdRequired), `Eksik v2.8 işlevi: ${dkdRequired}`);

assert.match(dkdThemeV28Js, /DKD_V28_VERSION\s*=\s*['"]2\.8\.0['"]/);
assert.match(dkdThemeV28Js, /new Set\(\)/);
assert.match(dkdThemeV28Js, /dkdCandidates\.length > 0 \? 2 : 5/);
assert.match(dkdThemeV28Js, /generic-live-request/);
assert.match(dkdThemeV28Js, /location\.replace\(/);
assert.match(dkdThemeV28Js, /Object\.getOwnPropertyDescriptor\(HTMLInputElement\.prototype, ['"]value['"]\)/);
assert.match(dkdThemeV28Js, /Sade Tema görünümüne geç/);
assert.doesNotMatch(dkdThemeV28Js, /Modern Temadan Sade Temaya Geçiş/);

for (const dkdClass of [
  '#dkd-v28-root', '.dkd-v28-request-card', '.dkd-v28-code-panel',
  '.dkd-v28-info-grid', '.dkd-v28-empty', '.dkd-v28-radar',
  '#dkd-v28-modern-switch', '.dkd-v28-legacy-switch-hidden',
]) assert.ok(dkdThemeV28Css.includes(dkdClass), `Eksik v2.8 stil sınıfı: ${dkdClass}`);
assert.match(dkdThemeV28Css, /body\.dkd-v28-simple-active/);
assert.match(dkdThemeV28Css, /left: -100000px !important/);
assert.match(dkdThemeV28Css, /@media \(max-width: 620px\)/);
assert.match(dkdThemeV28Css, /prefers-reduced-motion/);

assert.match(dkdIndex, /DraBornGate Web v2\.8\.0/);
assert.match(dkdIndex, /id="dkd-v28-splash"/);
assert.match(dkdIndex, />DBG</);
assert.match(dkdIndex, /id="dkd-v28-progress-fill"/);
assert.match(dkdIndex, /assets\/app\.js\?v=2\.8\.0/);
assert.doesNotMatch(dkdIndex, /animation:dkdSplash/);
assert.match(dkdSimpleIndex, /Güvenlik Sade Tema v2\.8\.0/);
assert.match(dkdSimpleIndex, /id="dkd-v28-splash"/);
assert.match(dkdSimpleIndex, />DBG</);
assert.match(dkdSimpleIndex, /dkd_gate_force_theme/);
assert.equal(dkdManifest.name, 'DraBornGate Web v2.8.0');
assert.match(dkdServiceWorker, /draborngate-web-v2\.8\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.8\.js\?v=2\.8\.0/);
assert.match(dkdServiceWorker, /assets\/v2\.8\.css\?v=2\.8\.0/);

console.log('DraBornGate Web v2.8.0 gerçek yükleme ve kararlı Sade Tema doğrulaması başarılı.');
