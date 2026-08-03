# DraBornGate Web v2.6.0

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## v2.6.0 güvenlik düzeltmeleri

- Açılışta eski v2.3/v2.5 metninin görünmesini engelleyen sabit v2.6.0 karşılama katmanı eklendi.
- Sade Tema, Modern panelin tüm metinlerini kopyalamak yerine yalnızca gerçek 6 haneli eşleştirme alanı ve bağlı işlem düğmesini kaynak kabul eder.
- Menü, profil, sürüm ve güvenlik paneli metinlerinin kurye kartına karışması engellenir.
- Bekleyen kurye sayısı tek taramada sıfırlanmaz; geçici DOM yenilenmelerinde dört doğrulama turu boyunca son kararlı değer korunur.
- Canlı geçiş talebi kartı modern başlık, durum rozeti, düzenli bilgi alanları, kod paneli ve işlem geri bildirimiyle yeniden tasarlandı.
- Modern Güvenlik panelindeki “Sade Temaya Geç” işlemi korunur.
- Sade Tema yalnızca doğrulanmış Güvenlik oturumu açıldıktan sonra etkinleşir; giriş ekranını kapatmaz.
- Tasarım görsel dosyası kullanmadan CSS, yerel SVG ikonlar ve erişilebilir animasyonlarla oluşturulmuştur.

## Tema seçimi

- **Sade Tema:** Kapıya gelen kuryeleri, düzenli talep ayrıntılarını, 6 haneli eşleştirme kodunu ve eşleştirme işlemini gösterir.
- **Modern Tema:** Mevcut tam kapsamlı Güvenlik Merkezi’ni korur.
- İki tema arasında güvenlik oturumu açıkken çift yönlü geçiş yapılabilir.

Sade Tema adresi:

`https://www.draborneagle.com/DraBornGate/Guvenlik-Sade-Tema/`

Sade Tema yeni bir yetkilendirme veya veri API’si oluşturmaz. İşlemler mevcut Supabase oturumu, RPC çağrıları ve RLS politikaları üzerinden gerçekleştirilir.

## Dosyalar

- `index.html`: Web v2.6.0 giriş noktası ve eski sürüm parlamasını engelleyen karşılama katmanı
- `Guvenlik-Sade-Tema/index.html`: doğrudan Sade Tema giriş adresi
- `assets/app.js`: çekirdek ve v2.4/v2.5/v2.6 katman yükleyicisi
- `assets/v2.6.js.payload.txt`: kararlı kuyruk, veri süzme, sayaç ve eşleştirme denetleyicisi
- `assets/v2.6.css.payload.txt`: modern tam ekran Sade Tema tasarım sistemi
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: v2.6.0 PWA önbelleği
