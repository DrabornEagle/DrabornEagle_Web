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
const dkdLoader = dkdRead('assets/app.v3.2.20.js');
const dkdGuard = dkdRead('assets/v3.2.20.guard.js');
const dkdUi = dkdRead('assets/v3.2.20.js');
const dkdBaseGuard = dkdRead('assets/v3.2.19.guard.js');
const dkdCss = dkdRead('assets/v3.2.20.css');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdGuard, dkdUi, dkdCss })) {
  dkdIncludes(dkdSource, '3.2.20', `${dkdName} v3.2.20 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.20.js?v=3.2.20-single-earnings-color-small-moto1', 'Ana giriş v3.2.20 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.20.js?v=3.2.20-single-earnings-color-small-moto1', 'Sade Tema v3.2.20 yükleyicisini kullanmıyor.');
dkdIncludes(dkdLoader, './v3.2.20.guard.js', 'v3.2.20 koruması temel uygulamadan önce yüklenmiyor.');
dkdIncludes(dkdLoader, './app.v3.2.19.js', 'Kararlı v3.2.19 temel yükleyicisi kullanılmıyor.');
dkdIncludes(dkdLoader, './assets/v3.2.20.css', 'v3.2.20 görünüm katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.20.js', 'v3.2.20 davranış katmanı yüklenmiyor.');
dkdIncludes(dkdBaseGuard, 'window.__DKD_GATE_V3220_GUARD__', 'v3.2.19 koruması v3.2.20 altında devre dışı kalmıyor.');

dkdIncludes(dkdGuard, "dkdNormalized === 'kazancim'", 'Eski tekil Kazancım düğmesi engellenmiyor.');
dkdIncludes(dkdGuard, "dkdNormalized === 'kazanclarim'", 'Eski çoğul Kazançlarım düğmeleri engellenmiyor.');
dkdIncludes(dkdGuard, 'dkd-v3219-earnings-menu', 'Tek kanonik Kazançlarım düğmesi korunmuyor.');
dkdIncludes(dkdGuard, 'Node.prototype.appendChild', 'Eski Kazancım düğmesini ekleme anında durduran koruma yok.');

dkdIncludes(dkdUi, "dkdMenu.classList.add('dkd-v3220-earnings-menu')", 'Kazançlarım düğmesi v3.2.20 görünümüne geçirilmiyor.');
dkdIncludes(dkdUi, "dkdNormalized === 'kazancim'", 'Çalışma anındaki eski Kazancım temizliği yok.');
dkdIncludes(dkdUi, "classList.toggle('dkd-v3220-passes-page'", 'Geçişlerim sayfası motosiklet küçültme kapsamına alınmıyor.');

dkdIncludes(dkdCss, '.dkd-v3219-earnings-menu.dkd-v3220-earnings-menu', 'Modern minimalist Kazançlarım stili yok.');
dkdIncludes(dkdCss, 'linear-gradient(180deg, #52e4ff, #8f7cff 58%, #ff6fa8)', 'Renkli vurgu şeridi yok.');
dkdIncludes(dkdCss, 'width: 46px !important;', 'Geçişlerim motosiklet ikonu küçültülmemiş.');
dkdIncludes(dkdCss, 'html.dkd-v3220-passes-page', 'Motosiklet küçültmesi yalnızca Geçişlerim sayfasına uygulanmıyor.');

dkdIncludes(dkdWorker, 'draborngate-web-v3.2.20-single-earnings-color-small-moto1', 'Service worker v3.2.20 önbellek adını kullanmıyor.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/app.v3.2.20.js', 'Yeni yükleyici çevrimdışı pakete eklenmemiş.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/v3.2.20.guard.js', 'Yeni koruma çevrimdışı pakete eklenmemiş.');
dkdExcludes(dkdIndex, 'app.v3.2.19.js?v=3.2.19-clean-single-earnings-site-gate1', 'Ana giriş eski v3.2.19 sürümünü doğrudan çağırıyor.');

JSON.parse(dkdManifest);
console.log('DraBornGate Web v3.2.20 doğrulamaları başarılı.');
