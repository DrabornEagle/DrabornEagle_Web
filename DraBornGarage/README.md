# DraBornGarage Web v1.0

DraBornGarage mobil uygulamasının aynı Supabase projesiyle çalışan, GitHub Pages uyumlu web sürümüdür.

## Canlı adres

- Ana sayfa: `https://www.draborneagle.com/DraBornGarage/`
- İşletme: `https://www.draborneagle.com/DraBornGarage/<isletme-baglanti-adi>`
- Usta: `https://www.draborneagle.com/DraBornGarage/<isletme-baglanti-adi>/<usta-baglanti-adi>`

Bağlantı adları güvenli URL biçimine otomatik dönüştürülür. İşletme ve usta profilleri varsayılan olarak **taslak** oluşturulur; işletme sahibi panelden yayınlamadan dışarı açılmaz.

## Uygulamayla ortak çalışan modüller

- Aynı e-posta/şifre ve Supabase Auth oturumu
- İşletme sahibi, işletme sahibi + usta, usta, çırak ve müşteri rolleri
- İş emirleri, servis durumları, işlem ve parça kalemleri
- Teşhis, iç not, müşteri notu ve servis geçmişi
- Nakit / IBAN tahsilatı ve açık hesap takibi
- Müşteri ve motosiklet kayıtları
- KM, plaka, servis sayısı ve geçmiş
- Randevu oluşturma, onay, geldi ve iptal akışı
- QR, kayıt kodu, takip kodu ve usta onayıyla müşteri eşleştirme
- Usta kişisel raporu ve işletme raporu
- Ekip rolü, aktiflik ve erişim başvuruları
- İşletme ve usta için yayınlanabilir web profilleri
- Supabase Realtime ile panel yenileme

## Web sürümünden ayrılan mobil özellikler

- Expo / FCM push bildirimi
- Bildirim kanal ve cihaz token yönetimi
- Mobil bildirim sesi ve haptik
- Kamera tabanlı QR tarama

Webde kod girişi korunur. Mobil uygulama push bildirimlerini ve kamera taramasını kullanmaya devam eder.

## Dosyalar

- `index.html`: GitHub Pages uygulama girişi
- `assets/dkd_bundle_loader.js`: sıkıştırılmış üretim modüllerini sırasıyla yükler
- `assets/chunks/core_*.txt`: oturum, yönlendirme, ortak bileşenler ve halka açık sayfalar
- `assets/chunks/customer_*.txt`: müşteri paneli
- `assets/chunks/staff_*.txt`: işletme, usta ve çırak paneli
- `assets/chunks/garage_*.txt`: başlangıç, oturum ve Realtime dinleyicisi
- `assets/dkd_garage.css`: responsive garaj/tamir teması
- `supabase/*.sql`: web profil ve kayıt kodu migrations

## Güvenlik

Tarayıcıda yalnızca Supabase publishable key bulunur. `service_role` anahtarı kullanılmaz. Tüm kişisel ve işletme verileri mevcut RLS/RPC kurallarıyla korunur. Halka açık sayfalar doğrudan tablolara erişmez; yalnızca yayınlanmış ve filtrelenmiş alanları döndüren `web_get_public_profile` RPC işlevini kullanır.
