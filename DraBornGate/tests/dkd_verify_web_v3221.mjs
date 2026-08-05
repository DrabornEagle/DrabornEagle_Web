import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const dkdRoot = path.resolve(process.cwd(), 'DraBornGate');
const dkdRead = (dkdRelativePath) => fs.readFileSync(path.join(dkdRoot, dkdRelativePath), 'utf8');
const dkdAssert = (dkdCondition, dkdMessage) => { if (!dkdCondition) throw new Error(dkdMessage); };
const dkdIncludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(dkdSource.includes(dkdValue), dkdMessage);

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdManifest = dkdRead('manifest.webmanifest');
const dkdWorker = dkdRead('sw.js');
const dkdLoader = dkdRead('assets/app.v3.2.21.js');
const dkdGuard = dkdRead('assets/v3.2.21.guard.js');
const dkdCompatibilityGuard = dkdRead('assets/v3.2.19.guard.js');
const dkdEarningsFix = dkdRead('assets/v3.2.21.earnings-fix.js');
const dkdUi = dkdRead('assets/v3.2.21.js');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdManifest, dkdWorker, dkdLoader, dkdGuard, dkdEarningsFix, dkdUi })) {
  dkdIncludes(dkdSource, '3.2.21', `${dkdName} v3.2.21 sürümünü içermiyor.`);
}

new vm.Script(dkdLoader, { filename: 'app.v3.2.21.js' });
new vm.Script(dkdGuard, { filename: 'v3.2.21.guard.js' });
new vm.Script(dkdEarningsFix, { filename: 'v3.2.21.earnings-fix.js' });
new vm.Script(dkdUi, { filename: 'v3.2.21.js' });
new vm.Script(dkdCompatibilityGuard, { filename: 'v3.2.19.guard.js' });

dkdIncludes(dkdIndex, 'app.v3.2.21.js?v=3.2.21-earnings-courier-role-link-fix1', 'Ana giriş v3.2.21 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.21.js?v=3.2.21-earnings-courier-role-link-fix1', 'Sade Tema v3.2.21 yükleyicisini kullanmıyor.');
dkdAssert(
  dkdLoader.indexOf('./v3.2.21.earnings-fix.js') < dkdLoader.indexOf('./app.v3.2.19.js'),
  'Kazançlarım uyumluluk düzeltmesi eski tıklama dinleyicisinden önce yüklenmiyor.'
);
dkdIncludes(dkdEarningsFix, "dkdRole.includes('courier') || dkdRole.includes('kurye')", 'İngilizce courier ve Türkçe kurye rolleri birlikte kabul edilmiyor.');
dkdIncludes(dkdEarningsFix, 'dkd_gate_current_user_context_v325', 'Güncel kullanıcı bağlamı RPC düzeltmesi yok.');
dkdIncludes(dkdEarningsFix, 'loadPartnerSummary', 'Aktif site bağlantısını özet RPC ile doğrulayan yedek kontrol yok.');
dkdIncludes(dkdEarningsFix, '[data-dkd-v3211-refresh-earnings]', 'Kazançlarım yenileme akışı düzeltilmiyor.');
dkdIncludes(dkdCompatibilityGuard, '__DKD_GATE_V3221_GUARD__', 'v3.2.19 koruması v3.2.21 ile çakışmayı durdurmuyor.');
dkdIncludes(dkdUi, "classList.add('dkd-v3220-earnings-menu')", 'Modern Kazançlarım görünümü korunmuyor.');
dkdIncludes(dkdUi, "classList.toggle('dkd-v3220-passes-page'", 'Geçişlerim küçük motosiklet görünümü korunmuyor.');
dkdIncludes(dkdWorker, 'draborngate-web-v3.2.21-earnings-courier-role-link-fix1', 'Service worker v3.2.21 önbelleğini kullanmıyor.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/v3.2.21.earnings-fix.js', 'Kazançlarım düzeltmesi çevrimdışı pakete eklenmemiş.');

JSON.parse(dkdManifest);
console.log('DraBornGate Web v3.2.21 Kazançlarım site bağlantısı ve courier/kurye rol doğrulamaları başarılı.');
