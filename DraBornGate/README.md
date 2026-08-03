# DraBornGate Web v2.4

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## Güvenlik tema seçimi

Güvenlik rolüne sahip kullanıcı giriş yaptıktan sonra iki görünüm arasından seçim yapar:

- **Sade Tema:** Yalnızca kapıya gelen kuryeleri, kurye ayrıntılarını, 6 haneli eşleştirme kodu alanını ve eşleştirme işlemini gösterir.
- **Modern Tema:** Mevcut tam kapsamlı güvenlik panelini hiçbir işlev kaybı olmadan kullanmaya devam eder.

Sade Tema adresi:

`https://www.draborneagle.com/DraBornGate/Guvenlik-Sade-Tema/`

Sade Tema yeni bir yetkilendirme veya veri katmanı oluşturmaz. Mevcut güvenlik panelindeki izinli kurye kartlarını yansıtır ve kod eşleştirme işlemini yine mevcut Supabase oturumu, RPC çağrıları ve RLS politikaları üzerinden gerçekleştirir.

## Web v2.4 arayüzü

- Tam ekran, büyük ve okunabilir metinler
- Animasyonlu tema seçimi
- Canlı saat ve senkronizasyon durumu
- Modern kurye bilgi kartları
- 6 haneli kod alanı ve belirgin eşleştirme butonu
- Başarı penceresi, hata ve işlem geri bildirimleri
- Masaüstü, tablet ve mobil uyumluluk
- `prefers-reduced-motion` erişilebilirlik desteği

## Rol panelleri

- **Kurye:** geçiş talebi, kapıya geldim, tek seferlik konum kontrolü, geçiş kodu ve geçmiş.
- **Güvenlik:** Sade Tema veya mevcut Modern Tema üzerinden güvenli kurye eşleştirme ve kapı operasyonu.
- **Site Sakini:** gelen kuryeler, misafir kodu, aidat, paylaşılan finans özeti ve web bildirim merkezi.
- **Site Yönetimi:** raporlar, CSV dışa aktarma, rol başvuruları, sakin arama, kurallar, aidat ve finans.

## Kişisel bağlantılar ve güvenlik

Kişisel yollar yalnızca okunabilir bağlantıdır; URL tek başına yetki sağlamaz. Erişim Supabase oturumu, rol doğrulaması, mevcut RPC kontrolleri ve RLS politikalarıyla korunur.

## Dosyalar

- `index.html`: Web v2.4 giriş noktası
- `Guvenlik-Sade-Tema/index.html`: doğrudan Sade Tema giriş adresi
- `assets/app.js`: sıkıştırılmış çekirdek uygulamayı ve sürüm katmanlarını yükler
- `assets/v2.4.js.payload.txt`: sıkıştırılmış güvenlik tema seçimi ve Sade Tema işlev katmanı
- `assets/v2.4.css.payload.txt`: sıkıştırılmış tam ekran Sade Tema ve tema seçimi tasarım sistemi
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: güncel statik web kabuğu önbelleği
