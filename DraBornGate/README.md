# DraBornGate Web v1.0

DraBornGate mobil uygulamasıyla aynı Supabase projesini, kullanıcı oturumunu, `draborngate` şemasını ve `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## Web panelleri

- Kurye: geçiş talebi, kapıya geldim, tek seferlik konum kontrolü, geçiş kodu ve geçmiş.
- Güvenlik: kapı kuyruğu, kurye kodu eşleştirme, onay/ret, giriş tamamlama ve ziyaretçi doğrulama.
- Site Sakini: gelen kuryeler, misafir kodu, aidat, paylaşılan finans özeti ve web bildirim merkezi.
- Site Yönetimi: raporlar, CSV dışa aktarma, rol başvuruları, sakin arama, kurallar, aidat ve finans.

## Güvenlik ve kişisel bağlantılar

Kişisel yollar okunabilir bağlantılardır:

- `/DraBornGate/site-adi/yonetim-kullanici-adi`
- `/DraBornGate/site-adi/guvenlik-kullanici-adi`
- `/DraBornGate/site-adi/sitesakini-kullanici-adi`
- `/DraBornGate/site-adi/kurye-kullanici-adi`

URL tek başına yetki sağlamaz. Her ekran Supabase oturumu, rol doğrulaması ve mevcut RLS politikalarıyla korunur. GitHub Pages doğrudan alt yol istekleri, kök `404.html` üzerinden SPA girişine taşınır.

## Mobil uygulamadan ayrılan özellikler

Native push bildirimi, bildirim zil sesi, Google Play Billing ve ödüllü reklam web istemcisine taşınmamıştır. Web, uygulama içi bildirim kayıtlarını ve Supabase Realtime yenilemeyi kullanır. Mevcut Google Play politika sayfaları ayrı klasörlerde korunur.

## Dosyalar

- `index.html`: DraBornGate Web giriş noktası
- `assets/app.js`: sıkıştırılmış uygulama ve stil paketlerini güvenli biçimde açan yükleyici
- `assets/app.payload.*.txt`: Supabase istemcisi, rol panelleri ve işlem akışlarının sıkıştırılmış kaynak paketi
- `assets/app.css` ve `assets/app.css.payload.txt`: başlangıç ekranı ile tam modern kurye/güvenlik arayüzü
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
