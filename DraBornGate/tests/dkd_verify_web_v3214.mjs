import fs from 'node:fs';
import path from 'node:path';

const dkdRoot = path.resolve(process.cwd(), 'DraBornGate');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdAssert = (dkdCondition, dkdMessage) => {
  if (!dkdCondition) throw new Error(dkdMessage);
};
const dkdIncludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(dkdSource.includes(dkdValue), dkdMessage);
const dkdExcludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(!dkdSource.includes(dkdValue), dkdMessage);

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');
const dkdLoader = dkdRead('assets/app.v3.2.14.js');
const dkdGuard = dkdRead('assets/v3.2.14.guard.js');
const dkdCleanup = dkdRead('assets/v3.2.14.js');
const dkdCss = dkdRead('assets/v3.2.14.css');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdGuard, dkdCleanup })) {
  dkdIncludes(dkdSource, '3.2.14', `${dkdName} v3.2.14 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.14.js?v=3.2.14-ui-clean1', 'Ana giriş v3.2.14 temiz açılış dosyasını kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.14.js?v=3.2.14-ui-clean1', 'Sade Tema v3.2.14 temiz açılış dosyasını kullanmıyor.');
dkdExcludes(dkdIndex, 'app.v3.2.11.js', 'Ana giriş eski v3.2.11 yükleyicisini hâlâ çağırıyor.');
dkdExcludes(dkdSimpleIndex, 'app.v3.2.11.js', 'Sade Tema eski v3.2.11 yükleyicisini hâlâ çağırıyor.');

dkdIncludes(dkdLoader, 'dkdV3214PrepareFreshRuntime', 'Açılış önbellek temizliği yok.');
dkdIncludes(dkdLoader, "dkdKey.startsWith('draborngate-web-')", 'Eski DraBornGate önbellekleri temizlenmiyor.');
dkdIncludes(dkdLoader, './v3.2.14.guard.js', 'v3.2.14 guard yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.11.js', 'Kararlı Kazançlarım katmanı korunmuyor.');
dkdIncludes(dkdLoader, './v3.2.14.js', 'v3.2.14 temizlik katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, './assets/v3.2.14.css', 'v3.2.14 CSS katmanı yüklenmiyor.');

dkdIncludes(dkdGuard, 'dkdV3214RemoveDuplicateEarnings', 'Çift Kazançlarım temizliği yok.');
dkdIncludes(dkdGuard, 'dkdV3214RemoveLegacySyncCard', 'Canlı Senkron eski kart temizliği yok.');
dkdIncludes(dkdGuard, "dkdText.includes('web uygulama')", 'Web + Uygulama eski kart koşulu yok.');
dkdIncludes(dkdGuard, 'MutationObserver', 'Sonradan eklenen eski kartları temizleyen gözlemci yok.');
dkdIncludes(dkdGuard, "window.addEventListener('pageshow'", 'Tarayıcı geri dönüşünde temizlik çalışmıyor.');

dkdIncludes(dkdCleanup, 'dkdV3214KeepSingleEarningsMenu', 'Kurye Premium menüsünde tek Kazançlarım koruması yok.');
dkdIncludes(dkdCleanup, 'dkdOfficialButtons.slice(1)', 'Birden fazla güncel Kazançlarım düğmesi temizlenmiyor.');
dkdIncludes(dkdCleanup, 'dkdV3214RemoveOldHomeFragments', 'Eski ana sayfa parçaları temizlenmiyor.');

dkdIncludes(dkdCss, '[data-dkd-earnings-menu]:not(.dkd-v3211-earnings-menu)', 'Eski Kazançlarım katmanını gizleyen CSS yok.');

dkdIncludes(dkdWorker, 'draborngate-web-v3.2.14-ui-clean1', 'Service worker yeni önbellek adını kullanmıyor.');
dkdIncludes(dkdWorker, "cache: 'no-store'", 'Service worker ağdan güncel dosya istemiyor.');
dkdIncludes(dkdWorker, "dkdKey.startsWith('draborngate-web-')", 'Service worker eski sürüm önbelleklerini silmiyor.');

JSON.parse(dkdManifest);
console.log('DraBornGate Web v3.2.14 doğrulamaları başarılı.');
