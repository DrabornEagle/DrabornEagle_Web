# DraBornGate Web v2.0

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan premium rol bazlı web istemcisidir.

## Web v2.0 tasarım sistemi

- Neon cam katmanlı, renkli premium arayüz
- Animasyonlu metrik kartları, radar efektli rol kahraman alanları ve canlı durum göstergeleri
- Yerel SVG ikon sistemi; emoji tabanlı ikon kullanılmaz
- Masaüstü sabit yan menü, mobil çekmece ve mobil alt navigasyon
- Modern tablo, form, modal, bildirim ve işlem kartları
- `prefers-reduced-motion` desteği
- PWA manifesti ve çevrimdışı kabuk önbelleği

## Rol panelleri

- **Kurye:** geçiş talebi, kapıya geldim, tek seferlik konum kontrolü, geçiş kodu ve geçmiş.
- **Güvenlik:** kapı kuyruğu, kurye kodu eşleştirme, onay/ret, giriş tamamlama ve ziyaretçi doğrulama.
- **Site Sakini:** gelen kuryeler, misafir kodu, aidat, paylaşılan finans özeti ve web bildirim merkezi.
- **Site Yönetimi:** premium raporlar, CSV dışa aktarma, rol başvuruları, sakin arama, kurallar, aidat ve finans.

## Kişisel bağlantılar

- `/DraBornGate/site-adi/yonetim-kullanici-adi`
- `/DraBornGate/site-adi/guvenlik-kullanici-adi`
- `/DraBornGate/site-adi/sitesakini-kullanici-adi`
- `/DraBornGate/site-adi/kurye-kullanici-adi`

URL tek başına yetki sağlamaz. Erişim Supabase oturumu, rol doğrulaması, mevcut RPC kontrolleri ve RLS politikalarıyla korunur.

## Web'e taşınmayan native özellikler

Native push bildirimi, cihaz zil sesi, Google Play Billing ve ödüllü reklam web istemcisinden ayrıdır. Web sürümü Supabase Realtime ve uygulama içi bildirim kayıtlarını kullanır.

## Korunan politika sayfaları

- `privacy/`
- `data-safety/`
- `account-deletion/`
- `subscriptions/`
- `support/`
- `terms/`

## Dosyalar

- `index.html`: Web v2.0 giriş noktası
- `assets/app.js`: v2 kaynak paketlerini açan güvenli yükleyici
- `assets/app.v2.payload.*.txt`: Web v2.0 uygulama kaynak paketi
- `assets/app.css`: premium başlangıç ekranı
- `assets/app.v2.css.payload.txt`: tam v2 tasarım sistemi
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: statik web kabuğu önbelleği
