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
const dkdLoader = dkdRead('assets/app.v3.2.15.js');
const dkdGuard = dkdRead('assets/v3.2.15.guard.js');
const dkdUi = dkdRead('assets/v3.2.15.js');
const dkdCss = dkdRead('assets/v3.2.15.css');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdGuard, dkdUi })) {
  dkdIncludes(dkdSource, '3.2.15', `${dkdName} v3.2.15 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.15.js?v=3.2.15-earnings-moto1', 'Ana giriş v3.2.15 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.15.js?v=3.2.15-earnings-moto1', 'Sade Tema v3.2.15 yükleyicisini kullanmıyor.');
dkdExcludes(dkdIndex, 'app.v3.2.14.js', 'Ana giriş eski v3.2.14 yükleyicisini çağırıyor.');

dkdIncludes(dkdLoader, './v3.2.15.guard.js', 'v3.2.15 guard yüklenmiyor.');
dkdIncludes(dkdLoader, './assets/v3.2.15.css', 'v3.2.15 CSS yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.15.js', 'v3.2.15 arayüz katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, 'dkdV3215PrepareFreshRuntime', 'Eski önbellek temizliği korunmuyor.');

dkdIncludes(dkdGuard, 'dkdV3215RemoveBottomEarnings', 'Alttaki bozuk Kazançlarım kartını kaldıran guard yok.');
dkdIncludes(dkdGuard, '.dkd-v3211-earnings-menu', 'v3.2.11 büyük Kazançlarım kartı hedeflenmiyor.');
dkdIncludes(dkdGuard, "dkdText.includes('site kurye')", 'Bozuk Site kurye kartı metin koruması yok.');
dkdIncludes(dkdGuard, 'MutationObserver', 'Sonradan oluşan bozuk kartı temizleyen gözlemci yok.');

dkdIncludes(dkdUi, 'dkdV3215RestoreTopEarningsAfterClick', 'Üst Kazançlarım düğmesini koruyan tıklama katmanı yok.');
dkdIncludes(dkdUi, 'dkdV3215ApplyMotorcycles', 'Geçiş kartı motosiklet dönüşümü yok.');
dkdIncludes(dkdUi, 'DraBornGate yarış motosikleti', 'DraBornGate uygulama motosikleti erişilebilir etiketi yok.');
dkdIncludes(dkdUi, 'M39 46C47 32 59 23 77 24', 'Uygulamadaki RacingMotorcycle gövde yolu aktarılmamış.');
dkdIncludes(dkdUi, 'M12 71 C34 76 96 76 120 70', 'Uygulamadaki motosiklet zemin gölgesi aktarılmamış.');
dkdIncludes(dkdUi, "if (dkdText.includes('trendyol go')) return '#FF8A4C'", 'Trendyol Go uygulama tonu kullanılmıyor.');

dkdIncludes(dkdCss, '.dkd-v3211-earnings-menu', 'Alttaki büyük Kazançlarım kartını anında gizleyen CSS yok.');
dkdIncludes(dkdCss, '.dkd-v3215-racing-motorcycle', 'DraBornGate motosiklet CSS sınıfı yok.');
dkdIncludes(dkdCss, '@keyframes dkdV3215MotoRide', 'Uygulamadaki hareket hissi eklenmemiş.');

dkdIncludes(dkdWorker, 'draborngate-web-v3.2.15-earnings-moto1', 'Service worker v3.2.15 önbellek adını kullanmıyor.');
dkdIncludes(dkdWorker, "cache: 'no-store'", 'Service worker güncel dosyayı ağdan istemiyor.');

JSON.parse(dkdManifest);
console.log('DraBornGate Web v3.2.15 doğrulamaları başarılı.');
