# DraBornGate Web v2.5.1

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## v2.5.1 güvenlik düzeltmeleri

- Eski v2.3/v2.4 görünür sürüm metinleri Web v2.5.1 olarak eşitlenir.
- Tema seçimindeki “Modern Temayı Aç” düğmesi açıklamanın altına alınarak metin çakışması giderilir.
- Modern Güvenlik paneline “Sade Temaya Geç” işlemi eklenir.
- Sade Tema, Modern paneldeki gerçek `Kurye Kuyruğu` ve `Geçiş Talepleri` görünümünü otomatik açar.
- Bekleyen kurye kartları daha geniş DOM eşleştirmesiyle Sade Tema’ya yansıtılır.
- Sade Tema kod alanı, mevcut yetkili eşleştirme penceresi ve Supabase/RLS akışıyla çalışır.

## Tema seçimi

- **Sade Tema:** Kapıya gelen kuryeleri, kurye ayrıntılarını, 6 haneli eşleştirme kodunu ve eşleştirme işlemini gösterir.
- **Modern Tema:** Mevcut tam kapsamlı Güvenlik Merkezi’ni korur.
- İki tema arasında güvenlik oturumu açıkken çift yönlü geçiş yapılabilir.

Sade Tema adresi:

`https://www.draborneagle.com/DraBornGate/Guvenlik-Sade-Tema/`

Sade Tema yeni bir yetkilendirme veya veri API’si oluşturmaz. İşlemler mevcut Supabase oturumu, RPC çağrıları ve RLS politikaları üzerinden gerçekleştirilir.

## Dosyalar

- `index.html`: Web v2.5.1 giriş noktası
- `Guvenlik-Sade-Tema/index.html`: doğrudan Sade Tema giriş adresi
- `assets/app.js`: çekirdek ve v2.4/v2.5 katman yükleyicisi
- `assets/v2.4.*.payload.txt`: temel güvenlik tema sistemi
- `assets/v2.5.js.payload.txt`: sürüm, çift yönlü geçiş ve canlı kuyruk düzeltmeleri
- `assets/v2.5.css.payload.txt`: tema kartı ve canlı kurye kartı yerleşimleri
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: v2.5.1 PWA önbelleği
