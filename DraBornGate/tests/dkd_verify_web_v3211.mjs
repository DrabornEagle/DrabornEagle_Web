import fs from 'node:fs';
import path from 'node:path';

const dkdRoot = path.resolve(process.cwd(), 'DraBornGate');
const dkdRead = (dkdRelative) => fs.readFileSync(path.join(dkdRoot, dkdRelative), 'utf8');
const dkdAssert = (dkdCondition, dkdMessage) => {
  if (!dkdCondition) throw new Error(dkdMessage);
};
const dkdIncludes = (dkdSource, dkdValue, dkdMessage) => dkdAssert(dkdSource.includes(dkdValue), dkdMessage);

const dkdIndex = dkdRead('index.html');
const dkdSimpleIndex = dkdRead('Guvenlik-Sade-Tema/index.html');
const dkdLoader = dkdRead('assets/app.v3.2.11.js');
const dkdGuard = dkdRead('assets/v3.2.11.guard.js');
const dkdModern = dkdRead('assets/v3.2.11.js');
const dkdCss = dkdRead('assets/v3.2.11.css');
const dkdWorker = dkdRead('sw.js');
const dkdManifest = dkdRead('manifest.webmanifest');

for (const [dkdName, dkdSource] of Object.entries({ dkdIndex, dkdSimpleIndex, dkdLoader, dkdGuard, dkdModern, dkdWorker, dkdManifest })) {
  dkdIncludes(dkdSource, '3.2.11', `${dkdName} v3.2.11 sürümünü içermiyor.`);
}

dkdIncludes(dkdIndex, 'app.v3.2.11.js?v=3.2.11', 'Ana giriş v3.2.11 yükleyicisini kullanmıyor.');
dkdIncludes(dkdSimpleIndex, 'app.v3.2.11.js?v=3.2.11', 'Sade Tema v3.2.11 yükleyicisini kullanmıyor.');
dkdIncludes(dkdLoader, './v3.2.11.guard.js', 'v3.2.11 guard yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.11.css', 'v3.2.11 CSS yüklenmiyor.');
dkdIncludes(dkdLoader, './v3.2.11.js', 'v3.2.11 modern katmanı yüklenmiyor.');
dkdIncludes(dkdLoader, 'dkdV3211BootIsSimple', 'Sade/Modern tema ayrımı korunmuyor.');

dkdIncludes(dkdModern, "dkd_gate_current_user_context_v325", 'Kullanıcı rol ve site bağlantısı bağlanmamış.');
dkdIncludes(dkdModern, '!dkdContext.is_admin', 'Admin için Kazançlarım görünürlük engeli yok.');
dkdIncludes(dkdModern, 'dkdContext.partner_visible', 'Site bağlantısı görünürlük koşulu yok.');
dkdIncludes(dkdModern, "includes('kurye')", 'Kurye rol koşulu yok.');
dkdIncludes(dkdModern, 'dkdV3211RemoveLegacyEarnings', 'Eski Kazançlarım girişleri temizlenmiyor.');
dkdIncludes(dkdModern, 'dkd-v3211-earnings-menu', 'Tek v3.2.11 Kazançlarım menü girişi yok.');
dkdIncludes(dkdModern, 'loadPartnerSummary', 'Kazanç özeti canlı veri katmanına bağlı değil.');
dkdIncludes(dkdModern, 'loadPartnerRows(100, 0)', 'Kazanç hareketleri canlı veri katmanına bağlı değil.');
dkdIncludes(dkdModern, 'Kazanç Hareketleri', 'Yeni Kazançlarım tablosu oluşturulmamış.');

dkdIncludes(dkdModern, 'findPass(dkdCleanCode)', 'Kuryeni Bul gerçek kod servisine bağlı değil.');
dkdIncludes(dkdModern, 'approvePass(dkdCode)', 'Kod doğrulama gerçek onay servisine bağlı değil.');
dkdIncludes(dkdModern, "dkd_gate_update_courier_pass_status_v2", 'Onay/red durum servisi bağlı değil.');
dkdIncludes(dkdModern, "p_status: dkdStatus", 'Kurye durum parametresi gönderilmiyor.');
dkdIncludes(dkdModern, 'Kurye ve Teslimat Bilgileri', 'Modern ayrıntılı kurye popup ekranı yok.');
dkdIncludes(dkdModern, 'Kodu Doğrula ve Giriş Ver', 'Kod onay eylemi popup içinde yok.');
dkdIncludes(dkdModern, 'Geçişi Reddet', 'Red eylemi popup içinde yok.');
dkdIncludes(dkdModern, "document.addEventListener('click'", 'Eski güvenlik tıklamaları yakalanmıyor.');
dkdIncludes(dkdModern, "document.addEventListener('submit'", 'Eski kod formu yakalanmıyor.');

dkdIncludes(dkdCss, '#dkd-v3211-earnings', 'Yeni Kazançlarım arayüz stili yok.');
dkdIncludes(dkdCss, '.dkd-v3211-summary-grid', 'Renkli kazanç özet kartları yok.');
dkdIncludes(dkdCss, '.dkd-v3211-security-panel', 'Modern güvenlik popup stili yok.');
dkdIncludes(dkdCss, '.dkd-v3211-security-route', 'Kurye rota bölümü stili yok.');
dkdIncludes(dkdCss, '.dkd-v3211-reject-panel', 'Modern red penceresi stili yok.');

dkdIncludes(dkdWorker, 'draborngate-web-v3.2.11-earnings-security-actions', 'Service Worker önbellek anahtarı güncel değil.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/app.v3.2.11.js?v=3.2.11', 'v3.2.11 yükleyicisi çevrimdışı listeye eklenmemiş.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/v3.2.11.js?v=3.2.11', 'v3.2.11 JS çevrimdışı listeye eklenmemiş.');
dkdIncludes(dkdWorker, '/DraBornGate/assets/v3.2.11.css?v=3.2.11', 'v3.2.11 CSS çevrimdışı listeye eklenmemiş.');

console.log('DraBornGate Web v3.2.11 doğrulamaları başarılı.');
