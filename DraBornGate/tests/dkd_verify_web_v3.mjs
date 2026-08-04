import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const dkdTestDir=path.dirname(fileURLToPath(import.meta.url));
const dkdRoot=path.resolve(dkdTestDir,'..');
const dkdRead=(dkdPath)=>fs.readFileSync(path.join(dkdRoot,dkdPath),'utf8');
const dkdApp=dkdRead('assets/app.js'),dkdData=dkdRead('assets/v3.0.data.js'),dkdUi=dkdRead('assets/v3.0.js'),dkdCss=dkdRead('assets/v3.0.css'),dkdIndex=dkdRead('index.html'),dkdSimple=dkdRead('Guvenlik-Sade-Tema/index.html'),dkdManifest=JSON.parse(dkdRead('manifest.webmanifest')),dkdSw=dkdRead('sw.js'),dkdReadme=dkdRead('README.md');
new vm.Script(dkdApp,{filename:'assets/app.js'});new vm.Script(dkdData,{filename:'assets/v3.0.data.js'});new vm.Script(dkdUi,{filename:'assets/v3.0.js'});
for(const dkdRequired of["const DKD_V30_VERSION='3.0.0'",'Nereden Geliyor','Gideceği Adres','Gönderici Adresi','Teslimat Adresi','Kurye Firması','Daire No','Tahmini Varış','Mesafe','dkdV30Scan','dkdV30OpenQueue','dkdV30Submit'])assert.ok(dkdData.includes(dkdRequired),`Eksik veri davranışı: ${dkdRequired}`);
for(const dkdRequired of['Kuryeni Bul','6 HANELİ KURYE KODU','Canlı Kurye Kuyruğu','NEREDEN GELİYOR','GİDECEĞİ TAM ADRES','Kurye Telefonu','Plaka / Araç','Teslim Alacak Kişi','Site / Blok / Daire','Sipariş / Kayıt No','Teslimat Notu','dkdV30PatchAllMotorcycleIcons',"document.querySelector('.dkd-v281-moto')",'dkd-v30-moto-host','MutationObserver'])assert.ok(dkdUi.includes(dkdRequired),`Eksik arayüz davranışı: ${dkdRequired}`);
assert.match(dkdUi,/\[class\*="courier-icon"\]/);assert.match(dkdUi,/\[class\*="kurye-icon"\]/);assert.match(dkdUi,/querySelectorAll\?\.\('img'\)/);assert.match(dkdUi,/querySelectorAll\?\.\('svg'\)/);
for(const dkdRequired of['#dkd-v30-root','.dkd-v30-finder','.dkd-v30-queue-section','.dkd-v30-route','.dkd-v30-details-grid','.dkd-v30-global-motorcycle','prefers-reduced-motion'])assert.ok(dkdCss.includes(dkdRequired),`Eksik CSS davranışı: ${dkdRequired}`);
assert.match(dkdApp,/DKD_WEB_VERSION = '3\.0\.0'/);assert.match(dkdApp,/v3\.0\.data\.js/);assert.match(dkdApp,/v3\.0\.css/);assert.match(dkdApp,/v3\.0\.js/);assert.match(dkdApp,/dkdBootWebV30/);
for(const dkdHtml of[dkdIndex,dkdSimple]){assert.match(dkdHtml,/v3\.0\.0/);assert.match(dkdHtml,/assets\/app\.js\?v=3\.0\.0/)}
assert.match(dkdSimple,/dkd_gate_security_theme/);assert.equal(dkdManifest.name,'DraBornGate Web v3.0.0');assert.match(dkdSw,/draborngate-web-v3\.0\.0-detailed-courier/);assert.match(dkdSw,/assets\/v3\.0\.data\.js\?v=3\.0\.0/);assert.match(dkdSw,/assets\/v3\.0\.js\?v=3\.0\.0/);assert.match(dkdReadme,/Birleşik motosiklet ikonu/);
console.log('DraBornGate Web v3.0.0 Kuryeni Bul, ayrıntılı canlı kuyruk ve birleşik motosiklet ikonu doğrulandı.');
