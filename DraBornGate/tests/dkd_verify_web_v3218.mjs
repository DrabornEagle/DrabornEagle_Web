import fs from 'node:fs';
import path from 'node:path';

const dkdRoot = path.resolve(process.cwd(), 'DraBornGate');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdAssert = (dkdCondition, dkdMessage) => { if (!dkdCondition) throw new Error(dkdMessage); };
const dkdIncludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(dkdSource.includes(dkdValue), dkdMessage);

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');
const dkdLoader = dkdRead('assets/app.v3.2.18.js');
const dkdUi = dkdRead('assets/v3.2.18.js');
const dkdCss = dkdRead('assets/v3.2.18.css');
const dkdLock = dkdRead('assets/v3.2.18.lock.js');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdUi, dkdCss, dkdLock })) {
  dkdIncludes(dkdSource, '3.2.18', `${dkdName} v3.2.18 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.18.js?v=3.2.18-single-earnings-stable-gate1', 'Ana giriş v3.2.18 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.18.js?v=3.2.18-single-earnings-stable-gate1', 'Sade Tema v3.2.18 yükleyicisini kullanmıyor.');
dkdIncludes(dkdLoader, './v3.2.18.lock.js', 'v3.2.18 sürüm kilidi yüklenmiyor.');
dkdIncludes(dkdUi, "placeholder = 'Site Adı Yaz'", 'Site arama metni yalnızca site adı olacak şekilde güncellenmemiş.');
dkdIncludes(dkdUi, 'dkdV3218HideLegacyEarnings', 'Eski Kazançlarım düğmelerini görünmez yapan katman yok.');
dkdIncludes(dkdUi, 'dkd-v3218-earnings-menu', 'Tek sabit Kazançlarım düğmesi yok.');
dkdIncludes(dkdUi, 'dkdV3218MountGatePicker', 'Kararlı özel Kapı seçicisi yok.');
dkdIncludes(dkdUi, 'dkdV3218NativeSet', 'Kapı seçimini forma aktaran yerel select köprüsü yok.');
dkdIncludes(dkdCss, '.dkd-v3217-earnings-menu', 'Önceki Kazançlarım düğmesi koşulsuz gizlenmiyor.');
dkdIncludes(dkdCss, '[data-dkd-v3218-legacy-earnings="true"]', 'Eski Kazançlarım düğmeleri CSS ile kesin gizlenmiyor.');
dkdIncludes(dkdCss, '.dkd-v3218-gate-picker.open .dkd-v3218-gate-list', 'Kapı seçeneklerini sabit açık tutan görünüm yok.');
dkdIncludes(dkdLock, "attributeFilter: ['data-dkd-gate-version']", 'Eski katmanların sürüm değerini geri almasını engelleyen kilit yok.');
dkdIncludes(dkdWorker, 'draborngate-web-v3.2.18-single-earnings-stable-gate1', 'Service worker v3.2.18 önbellek adını kullanmıyor.');
dkdIncludes(dkdWorker, 'v3.2.18.lock.js', 'Service worker sürüm kilidi dosyasını paketlemiyor.');

JSON.parse(dkdManifest);
console.log('DraBornGate Web v3.2.18 doğrulamaları başarılı.');
