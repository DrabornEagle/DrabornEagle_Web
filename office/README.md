# DraBorn Office · Living Studio v1.0

API ve ücretli servis kullanmadan çalışan bir oyun stüdyosu simülasyonu.

## Kurulum

- GitHub Pages: https://www.draborneagle.com/office/
- Yerel test için office klasöründe python3 -m http.server 8080 komutunu çalıştır, ardından http://localhost:8080 adresini aç.
- ES Modules sebebiyle file:// bağlantıları yerine HTTP kullan.

## Özellikler

- Canvas 2D ile çizilen özgün stüdyo haritası (36×24 grid, 32px tile), yedi alan, ışıklandırma, masa ve dekorlar.
- 20 özgün karakter: davranışlar, enerji ve moral, kişilik, uzmanlık, ilişkiler ve iş akışları.
- BFS yol bulma, görevler, mola, sohbet, toplantı ve gün döngüsü.
- Üç aktif proje, üretim ilerlemesi, yatırım ve lansman döngüsü.
- Oyun içi ekonomi, hayran, itibar ve ekip motivasyonu.
- Günlük olay akışı, yönetim kararları, karakter/departman/proje detayları.
- Masaüstü ve mobil etkileşimler, yakınlaştırma, tam ekran, simülasyon hızı, sentetik ses efektleri.
- Otomatik yerel kayıt: localStorage anahtarı draborn-office-v1.

## Mimari

index.html: ekran.
style.css: responsive neon arayüz.
data.js: karakterler, mekanlar, projeler, yazılmış diyaloglar.
engine.js: ajanlar, ekonomi, harita, animasyon, yerel kayıt.
app.js: olaylar, paneller, kontroller.
manifest.webmanifest: web uygulaması metadata.

## Önemli sınırlar

- Simülasyon, her ziyaretçinin cihazında ayrı çalışır. Ortak bir sunucuda senkronize çok oyunculu deneyim değildir.
- Karakter konuşmaları kurallara ve içerik havuzlarına dayanır; gerçek bir LLM veya dış API değildir.
- Oyun içi sanal para gerçek para değildir.
- Sekme kapatıldığında simülasyon ilerlemez. Kayıt bu cihazın tarayıcısında tutulur.
- Grafikleri Canvas primitive'leriyle çiziyoruz: lisanslı 3. parti sprite kullanılmıyor.
- Kök web sitesinin başka dosyaları değiştirilmez.

© 2026 DraBornEagle
