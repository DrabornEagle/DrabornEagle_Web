# DraBornGate Web v3.0.0

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## v3.0 Güvenlik Sade Tema

- Sade Tema artık üst bölümde Modern Temadaki 6 haneli kurye kodu akışını kullanan **Kuryeni Bul** kartını gösterir.
- Kod doğrulama yeni bir API oluşturmaz; görünmeyen yerel giriş alanı ve mevcut doğrulama düğmesi üzerinden güvenli Supabase/RPC akışına bağlanır.
- **Canlı Kurye Kuyruğu** ayrı ve görünür bir bölüm olarak eklenmiştir.
- Kuyruktaki her kurye için kurye adı, telefon, firma/platform, araç, plaka, nereden geldiği, gideceği tam adres, site, blok, daire, teslim alacak kişi, sipariş/kayıt numarası, varış, mesafe, durum ve teslimat notu gösterilir.
- Aynı talebin tekrar eden DOM kopyaları tekilleştirilir; yeni kayıtlar iki taramada doğrulanır, geçici kaybolmalar altı boş tarama boyunca korunur.
- Kuyruk henüz açılmadıysa sistem Modern Tema çekirdeğindeki Kuryeni Bul, kurye kodu veya kurye kuyruğu işlemini kontrollü biçimde açar.
- Güvenlik görevlisi kuyruktan bir kurye seçip 6 haneli kodu doğrudan Kuryeni Bul kartından eşleştirebilir.

## Birleşik motosiklet ikonu

- DraBornGate uygulamasındaki motosiklet çizimi v3.0 ortak web ikonu olarak kullanılır.
- Sade Tema kartları, sayaçlar, boş durumlar ve kurye ayrıntıları bu ikonu kullanır.
- Web tarafındaki `kurye`, `courier`, `motosiklet`, `motorcycle`, `rider` ve `teslimat` bağlamındaki eski motosiklet ikonları MutationObserver ile yakalanıp aynı ikonla değiştirilir.
- Hareket azaltma tercihi açık olan cihazlarda ikon animasyonları kapatılır.

## Güvenlik yaklaşımı

Sade Tema yeni bir yetkilendirme, veri API’si veya ayrı kurye kaynağı oluşturmaz. Mevcut oturum, rol kontrolü, RLS politikaları, gerçek 6 haneli kod alanı ve eşleştirme düğmesi kullanılmaya devam eder.

Sade Tema adresi:

`https://www.draborneagle.com/DraBornGate/Guvenlik-Sade-Tema/`

## v3.0 dosyaları

- `index.html`: Web v3.0.0 giriş noktası
- `Guvenlik-Sade-Tema/index.html`: doğrudan Sade Tema giriş adresi
- `assets/app.js`: v3.0 yükleme sırası ve sürüm yönetimi
- `assets/v3.0.data.js`: ayrıntılı kurye veri eşleme ve mevcut 6 haneli doğrulama köprüsü
- `assets/v3.0.js`: Kuryeni Bul, Canlı Kurye Kuyruğu ve tüm motosiklet ikonlarını tekilleştirme katmanı
- `assets/v3.0.css`: telefon, tablet ve masaüstü uyumlu v3.0 Sade Tema tasarımı
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: v3.0.0 PWA önbelleği
