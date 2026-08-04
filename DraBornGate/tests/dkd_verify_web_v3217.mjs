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
const dkdLoader = dkdRead('assets/app.v3.2.17.js');
const dkdGuard = dkdRead('assets/v3.2.17.guard.js');
const dkdUi = dkdRead('assets/v3.2.17.js');
const dkdCss = dkdRead('assets/v3.2.17.css');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdGuard, dkdUi, dkdCss })) {
  dkdIncludes(dkdSource, '3.2.17', `${dkdName} v3.2.17 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.17.js?v=3.2.17-stable-earnings-gate-moto1', 'Ana giriş v3.2.17 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.17.js?v=3.2.17-stable-earnings-gate-moto1', 'Sade Tema v3.2.17 yükleyicisini kullanmıyor.');
dkdExcludes(dkdIndex, 'app.v3.2.15.js', 'Ana giriş eski v3.2.15 yükleyicisini çağırıyor.');

dkdIncludes(dkdLoader, './v3.2.17.guard.js', 'v3.2.17 guard yüklenmiyor.');
dkdIncludes(dkdLoader, './assets/v3.2.17.css', 'v3.2.17 CSS yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.17.js', 'v3.2.17 arayüz katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.11.js', 'Kazanç popup katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.15.js', 'DraBornGate motosiklet çizimi korunmuyor.');
dkdIncludes(dkdLoader, 'dkdV3217PartnerDataBridge', 'Kurye rol köprüsü korunmuyor.');

dkdExcludes(dkdGuard, '.dkd-v3211-earnings-menu', 'Guard Kazançlarım düğmesini kaldırmamalı.');
dkdExcludes(dkdGuard, 'RemoveBottomEarnings', 'Eski Kazançlarım silme döngüsü guard içinde kalmış.');

dkdIncludes(dkdUi, '__DKD_GATE_V3210_SITE_GUARD__', 'Site seçim korumasını gevşeten kapı düzeltmesi yok.');
dkdIncludes(dkdUi, "removeAttribute('data-dkd-v3210-site-select')", 'Site değişimini çekirdek forma yeniden ileten düzeltme yok.');
dkdIncludes(dkdUi, 'dkdV3217RepairGate', 'Kapı seçeneklerini onaran işlem yok.');
dkdIncludes(dkdUi, 'dkd-v3217-earnings-menu', 'Sabit Kazançlarım düğmesi yok.');
dkdIncludes(dkdUi, 'dkdTrigger.dataset.dkdV3211Earnings', 'Kazanç popupını açan güvenli köprü yok.');
dkdIncludes(dkdUi, 'dkd-v3217-moto-history', 'Geçişlerim motosiklet sınıfı yok.');
dkdIncludes(dkdUi, 'dkd-v3217-moto-queue', 'Canlı Kurye Kuyruğu motosiklet sınıfı yok.');
dkdExcludes(dkdUi, 'setInterval(', 'v3.2.17 arayüz katmanı sürekli zamanlayıcı kullanmamalı.');

dkdIncludes(dkdCss, 'min-height:68px', 'Minimalist Kazançlarım yüksekliği uygulanmamış.');
dkdIncludes(dkdCss, 'content:attr(aria-label)', 'Kazançlarım metni titreşim döngüsünden bağımsız değil.');
dkdIncludes(dkdCss, 'width:54px', 'Geçişlerim motosikleti 54 px yapılmamış.');
dkdIncludes(dkdCss, 'width:50px', 'Canlı Kurye Kuyruğu motosikleti 50 px yapılmamış.');
dkdIncludes(dkdCss, '.dkd-v3217-gate-ready', 'Kapı seçim görünürlük düzeltmesi yok.');

dkdIncludes(dkdWorker, 'draborngate-web-v3.2.17-stable-earnings-gate-moto1', 'Service worker v3.2.17 önbellek adını kullanmıyor.');
dkdIncludes(dkdWorker, "cache: 'no-store'", 'Service worker güncel dosyaları ağdan istemiyor.');
dkdIncludes(dkdWorker, 'app.v3.2.17.js', 'Service worker yeni yükleyiciyi önbelleğe almıyor.');

const dkdParsedManifest = JSON.parse(dkdManifest);
dkdAssert(dkdParsedManifest.name === 'DraBornGate Web v3.2.17', 'Manifest adı v3.2.17 değil.');
dkdAssert(dkdParsedManifest.start_url.includes('3.2.17-stable-earnings-gate-moto1'), 'Manifest başlangıç URL sürümü yanlış.');

console.log('DraBornGate Web v3.2.17 doğrulamaları başarılı.');
