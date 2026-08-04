import fs from 'node:fs';
import path from 'node:path';

const dkdRoot = path.resolve(process.cwd(), 'DraBornGate');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');
const dkdAssert = (dkdCondition, dkdMessage) => {
  if (!dkdCondition) throw new Error(dkdMessage);
};
const dkdIncludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(dkdSource.includes(dkdValue), dkdMessage);
const dkdExcludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(!dkdSource.includes(dkdValue), dkdMessage);

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdLoader = dkdRead('assets/app.v3.2.12.js');
const dkdGuard = dkdRead('assets/v3.2.12.guard.js');
const dkdCleanup = dkdRead('assets/v3.2.12.js');
const dkdCss = dkdRead('assets/v3.2.12.css');
const dkdData = dkdRead('assets/v3.2.1.data.js');
const dkdWorker = dkdRead('sw.js');
const dkdManifest = dkdRead('manifest.webmanifest');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdLoader, dkdGuard, dkdCleanup, dkdData, dkdWorker, dkdManifest })) {
  dkdIncludes(dkdSource, '3.2.12', `${dkdName} v3.2.12 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.12.js?v=3.2.12', 'Ana giriş v3.2.12 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.12.js?v=3.2.12', 'Sade Tema v3.2.12 yükleyicisini kullanmıyor.');
dkdIncludes(dkdIndex, 'dkd-v3212-booting', 'Ana giriş temiz başlangıç görünürlük kilidini kullanmıyor.');
dkdIncludes(dkdLoader, './v3.2.12.guard.js', 'v3.2.12 guard yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.11.js', 'v3.2.11 kazanç ve güvenlik işlevleri korunmuyor.');
dkdIncludes(dkdLoader, './v3.2.12.js', 'v3.2.12 temizlik katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, 'dkdV3212ReleaseBoot()', 'Temizlik tamamlanmadan başlangıç ekranı kapatılıyor.');

dkdIncludes(dkdLoader, 'dkdV3212FastRegister', 'Service Worker başlangıç kilidi hızlı kayıt köprüsüyle aşılmıyor.');
dkdIncludes(dkdLoader, 'Promise.resolve({ update: async () => undefined })', 'Eski çekirdeğin Service Worker beklemesi kritik yoldan çıkarılmamış.');
dkdIncludes(dkdLoader, 'dkdV3212RestoreWorkerRegister', 'Geçici Service Worker köprüsü temizlenmiyor.');
dkdIncludes(dkdGuard, 'dkdV3212ProtectedRemove', 'Kompakt Kazançlarım girişi eski katman tarafından silinmeye karşı korunmuyor.');

dkdIncludes(dkdCleanup, '.dkd-v3211-earnings-menu', 'İkinci Kazançlarım kartı hedeflenmiyor.');
dkdIncludes(dkdCleanup, 'duplicate-earnings-card', 'İkinci Kazançlarım kartı emekliye ayrılmıyor.');
dkdIncludes(dkdCleanup, "['canli senkron', 'web uygulama']", 'Eski Canlı Senkron kartı temizlenmiyor.');
dkdIncludes(dkdCleanup, "['akilli talep yok']", 'Eski Akıllı Talep kartı temizlenmiyor.');
dkdIncludes(dkdCleanup, 'MutationObserver', 'Sonradan oluşan eski kartlar izlenmiyor.');
dkdIncludes(dkdCleanup, 'dkdV3212BindCompactEarnings', 'Tek ve kompakt Kazançlarım girişi korunmuyor.');
dkdIncludes(dkdCss, '.dkd-v3211-earnings-menu', 'Hatalı ikinci Kazançlarım kartı CSS düzeyinde gizlenmiyor.');

dkdIncludes(dkdWorker, 'draborngate-web-v3.2.12-clean-runtime', 'Service Worker önbellek anahtarı güncel değil.');
dkdIncludes(dkdWorker, 'Promise.allSettled', 'Service Worker tek dosya hatasında kurulumu kilitliyor.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/app.v3.2.12.js?v=3.2.12', 'v3.2.12 yükleyicisi kabuk listesinde yok.');
dkdExcludes(dkdWorker, 'v2.5.js.payload.5.txt', 'Service Worker eski ağır paketlerin tamamını başlangıçta önbelleğe almaya devam ediyor.');

console.log('DraBornGate Web v3.2.12 doğrulamaları başarılı.');
