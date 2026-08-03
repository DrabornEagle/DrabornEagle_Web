# DraBornGate Web v2.7.0

DraBornGate mobil uygulamasıyla aynı Supabase projesini, ortak kullanıcı oturumunu, `draborngate` şemasını ve mevcut `dkd_gate_*` RPC işlemlerini kullanan rol bazlı web istemcisidir.

## v2.7.0 Güvenlik Sade Tema

- Sade Tema artık eski v2.4/v2.5/v2.6 görünüm katmanlarının içine eklenmez; bağımsız, tam ekran bir arayüz olarak çalışır.
- Eski Güvenlik paneli görünür ekrandan tamamen uzaklaştırılır ve yalnızca güvenli eşleştirme köprüsü olarak arka planda tutulur.
- Önceki panel başlıkları, profil bilgileri, Premium Menü ve tekrar eden Geçiş Talebi metinleri yeni kartlara karışmaz.
- Bekleyen sayısı yalnızca gerçek 6 haneli yerel eşleştirme alanlarından hesaplanır; aynı giriş alanı `Set` ile tekilleştirilir.
- Geçici DOM yenilenmelerinde sayaç hemen sıfırlanmaz; altı ardışık doğrulama turundan sonra güncellenir.
- İlk tarama tamamlanmadan `0` gösterilmez; “Kuyruk hazırlanıyor” durumu kullanılır.
- Kurye kartı; temiz talep başlığı, durum rozeti, plaka/kayıt, hedef nokta, sıra bilgisi, büyük kod girişi ve işlem geri bildirimiyle yeniden tasarlanmıştır.
- Modern paneldeki “Sade Temaya Geç” metni “Modern Temadan Sade Temaya Geçiş” olarak değiştirilmiştir.
- Tasarım herhangi bir görsel dosyası kullanmadan CSS, yerel SVG ikonlar ve erişilebilir animasyonlarla oluşturulmuştur.

## Güvenlik yaklaşımı

Sade Tema yeni bir veri API’si veya yetkilendirme yolu oluşturmaz. Mevcut Supabase oturumu, RPC çağrıları, RLS politikaları, gerçek 6 haneli kod alanı ve mevcut eşleştirme düğmesi kullanılmaya devam eder.

Sade Tema adresi:

`https://www.draborneagle.com/DraBornGate/Guvenlik-Sade-Tema/`

## Dosyalar

- `index.html`: Web v2.7.0 giriş noktası ve güncel karşılama katmanı
- `Guvenlik-Sade-Tema/index.html`: doğrudan bağımsız Sade Tema giriş adresi
- `assets/app.js`: çekirdek katmanları ve v2.7 arayüzünü yükler
- `assets/v2.7.js`: bağımsız görünüm, tek kaynaklı kuyruk ve eşleştirme köprüsü
- `assets/v2.7.css`: tam ekran modern, renkli ve animasyonlu Sade Tema tasarımı
- `manifest.webmanifest`: kurulabilir web uygulaması bilgileri
- `sw.js`: v2.7.0 PWA önbelleği
