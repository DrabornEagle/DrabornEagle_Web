# DraBornGate Web v1.1

DraBornGate mobil uygulamasıyla aynı Supabase projesini, kullanıcı oturumunu, `draborngate` şemasını ve `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## v1.1 premium tasarım sistemi

- Tüm rol ekranlarında elektrik mavisi, mor, magenta, yeşil ve turuncu vurgu paleti.
- Animasyonlu arka plan ışıkları, üst durum ışını, cam yüzeyler ve hareketli premium kenarlıklar.
- Yönetim istatistik kartlarında mobilde 2x2 yoğun görünüm, masaüstünde 4 sütunlu dashboard düzeni.
- Kurye, bekleyen işlem, ziyaretçi, aidat ve diğer metriklere özel renk ve kaliteli çizgi SVG ikonları.
- Yan menüde yeniden tasarlanan marka alanı, kullanıcı kartı, aktif menü göstergesi ve ikon kutuları.
- Butonlarda parlama, ripple, hover ve basma geri bildirimi; yenile ikonunda dönüş animasyonu.
- Başlık gradyanları, canlı rol rozetleri, premium sürüm rozeti ve kademeli görünme animasyonları.
- `prefers-reduced-motion` desteğiyle hareket azaltma erişilebilirliği.

Premium UI katmanı çalışan veri ve işlem kodundan ayrıdır. Önce v1.0 Supabase/RPC çekirdeği yüklenir, ardından `premium-v1.1` stil ve dekorasyon motoru arayüzü dönüştürür. Böylece mevcut geçiş, yönetim, güvenlik, sakin ve kurye işlemleri korunur.

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

- `index.html`: DraBornGate Web v1.1 giriş noktası.
- `assets/app.js`: temel uygulama paketini ve v1.1 premium katmanını açan yükleyici.
- `assets/app.payload.*.txt`: Supabase istemcisi, rol panelleri ve işlem akışlarının sıkıştırılmış kaynak paketi.
- `assets/app.css` ve `assets/app.css.payload.txt`: premium açılış ekranı ile temel v1.0 arayüzü.
- `assets/premium-v1.1.css.payload.txt`: yeni renk, kart, menü, responsive ve animasyon tasarım sistemi.
- `assets/premium-v1.1.js.payload.txt`: otomatik kart sınıflandırması, kaliteli SVG ikonlar, sürüm dönüşümü ve mikro etkileşim motoru.
- `manifest.webmanifest`: kurulabilir v1.1 web uygulaması bilgileri.
