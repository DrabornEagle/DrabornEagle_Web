# DraBornGate Web v2.8.0

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## v2.8.0 yükleme ve tema mimarisi

- Açılış çubuğu artık ileri-geri oynayan dekoratif animasyon değildir; çekirdek paket, rol sistemi, tema dosyaları ve canlı geçiş katmanı gerçekten tamamlandıkça ilerler.
- Yükleme 20 saniyeyi aşarsa ekran sonsuza kadar beklemez ve `Tekrar Dene` seçeneğini gösterir.
- Açılış işareti `DG` yerine animasyonlu `DBG` olarak güncellenmiştir.
- Güvenlik Sade Tema adresinde v2.4, v2.5, v2.6 ve v2.7 tema katmanları yüklenmez. Yalnızca ana güvenlik çekirdeği ve bağımsız v2.8 ekranı çalışır.
- Modern paneldeki büyük “Modern Temadan Sade Temaya Geçiş” kartı kaldırılır.
- Güvenlik rolü doğrulandığında zil bildirim düğmesinin yanına yalnızca tema geçişini ifade eden ikon eklenir.
- Tema geçişleri çakışan route ve oturum anahtarlarını temizleyerek `location.replace` ile güvenli biçimde gerçekleştirilir.

## Kararlı geçiş talepleri

- Bekleyen sayı yalnızca gerçek 6 haneli eşleştirme alanları ve bağlı yerel doğrulama düğmelerinden hesaplanır.
- Aynı talebin birden fazla DOM kopyası kimlik, plaka, hedef veya temizlenmiş talep parmak iziyle tekilleştirilir.
- Yeni talepler iki ardışık taramada doğrulandıktan sonra gösterilir.
- Kaybolan talepler beş ardışık boş taramadan sonra kaldırılır; geçici yeniden çizimlerde sayaç sıçramaz.
- Kuyruk düğmesi hazır değilse MutationObserver ve kontrollü tekrar deneme sistemiyle otomatik açılır; sayfayı yenilemek gerekmez.
- Talep kartları yalnızca güvenilir ve yapılandırılmış kurye, plaka/kayıt ve hedef bilgilerini gösterir. Profil, Premium Menü ve panel başlıkları kartlara karışmaz.
- Kart arayüzü büyük kod alanı, durum rozeti, radar, renkli geri bildirimler ve telefon uyumlu modern yerleşimle hazırlanmıştır.

## Güvenlik yaklaşımı

Sade Tema yeni bir veri API’si veya yetkilendirme yolu oluşturmaz. Mevcut Supabase oturumu, RPC çağrıları, RLS politikaları, gerçek 6 haneli kod alanı ve mevcut eşleştirme düğmesi kullanılmaya devam eder.

Sade Tema adresi:

`https://www.draborneagle.com/DraBornGate/Guvenlik-Sade-Tema/`

## Dosyalar

- `index.html`: Web v2.8.0 giriş noktası ve gerçek ilerleme gösteren DBG karşılama ekranı
- `Guvenlik-Sade-Tema/index.html`: doğrudan bağımsız Sade Tema giriş adresi
- `assets/app.js`: gerçek yükleme ilerlemesi ve Sade Tema katman izolasyonu
- `assets/v2.8.js`: kararlı talep tarama, tekilleştirme, tema geçişi ve eşleştirme köprüsü
- `assets/v2.8.css`: renkli, animasyonlu ve telefon uyumlu bağımsız Sade Tema tasarımı
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: v2.8.0 PWA önbelleği
