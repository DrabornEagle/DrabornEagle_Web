import fs from 'node:fs';
import path from 'node:path';

const dkdRoot = path.resolve(process.cwd(), 'DraBornGate');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdAssert = (dkdCondition, dkdMessage) => { if (!dkdCondition) throw new Error(dkdMessage); };
const dkdIncludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(dkdSource.includes(dkdValue), dkdMessage);
const dkdExcludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(!dkdSource.includes(dkdValue), dkdMessage);

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');
const dkdLoader = dkdRead('assets/app.v3.2.19.js');
const dkdGuard = dkdRead('assets/v3.2.19.guard.js');
const dkdUi = dkdRead('assets/v3.2.19.js');
const dkdCss = dkdRead('assets/v3.2.19.css');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdGuard, dkdUi, dkdCss })) {
  dkdIncludes(dkdSource, '3.2.19', `${dkdName} v3.2.19 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.19.js?v=3.2.19-clean-single-earnings-site-gate1', 'Ana giriş temiz v3.2.19 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.19.js?v=3.2.19-clean-single-earnings-site-gate1', 'Sade Tema temiz v3.2.19 yükleyicisini kullanmıyor.');
dkdExcludes(dkdLoader, 'app.v3.2.18.js', 'v3.2.19 eski v3.2.18 yükleyicisini çağırıyor.');
dkdExcludes(dkdLoader, 'app.v3.2.17.js', 'v3.2.19 eski v3.2.17 yükleyicisini çağırıyor.');
dkdExcludes(dkdLoader, './v3.2.8.js', 'Eski Kazançlarım/site katmanı v3.2.8 yükleniyor.');
dkdExcludes(dkdLoader, './v3.2.10.js', 'Eski site kilidi v3.2.10 modern temada yükleniyor.');
dkdIncludes(dkdLoader, 'dkdV3219ImportEarningsLayer', 'Kazanç modalı güvenli yükleme köprüsü yok.');
dkdIncludes(dkdLoader, "Number(dkdDelay) === 1800", 'v3.2.11 eski periyodik Kazançlarım üretimi durdurulmuyor.');
dkdIncludes(dkdLoader, 'dkdV3211QueuePatch', 'v3.2.11 Kazançlarım MutationObserver üretimi durdurulmuyor.');

dkdIncludes(dkdGuard, 'Node.prototype.appendChild', 'Eski Kazançlarım eklenmesini kaynağında durduran koruma yok.');
dkdIncludes(dkdGuard, 'dkd-v3219-earnings-menu', 'Tek v3.2.19 Kazançlarım istisnası tanımlanmamış.');
dkdIncludes(dkdGuard, 'dkdV3219ReplaceVersion', 'Eski sürüm metinlerini v3.2.19 yapan koruma yok.');

dkdIncludes(dkdUi, 'Site Adı Yaz', 'Site arama metni yalnızca Site Adı Yaz değil.');
dkdIncludes(dkdUi, 'dkdV3219ResetGateForSite', 'Site değişince eski kapıları temizleme yok.');
dkdIncludes(dkdUi, 'dkdV3219WaitForSelectedSiteGates', 'Seçilen siteye ait kapıların yüklenmesini bekleyen akış yok.');
dkdIncludes(dkdUi, 'dkd-v3219-native-gate-host', 'Eski iç içe kapı kutusunu kaldıran sınıf yok.');
dkdIncludes(dkdUi, "insertAdjacentElement('afterend', dkdPicker)", 'Tek Kapı seçici eski kutunun dışına yerleştirilmiyor.');
dkdIncludes(dkdUi, 'dkd-v3219-earnings-menu', 'Tek Kazançlarım menüsü oluşturulmuyor.');

dkdIncludes(dkdCss, '.dkd-v3219-native-gate-host { display: none !important; }', 'Eski Kapı kutusu tamamen gizlenmiyor.');
dkdIncludes(dkdCss, '.dkd-v3219-gate-picker', 'Tek Kapı seçici stili yok.');
dkdIncludes(dkdCss, '.dkd-v3211-earnings-menu', 'Eski Kazançlarım CSS seviyesinde kapatılmıyor.');
dkdIncludes(dkdWorker, 'draborngate-web-v3.2.19-clean-single-earnings-site-gate1', 'Service worker v3.2.19 önbellek adını kullanmıyor.');
dkdIncludes(dkdWorker, "cache: 'no-store'", 'Service worker güncel paketi ağdan istemiyor.');

JSON.parse(dkdManifest);
console.log('DraBornGate Web v3.2.19 doğrulamaları başarılı.');
