# DraBornGarage Web v1.0

DraBornGarage mobil uygulamasının aynı Supabase projesi, kullanıcı hesapları ve canlı verileriyle çalışan GitHub Pages web sürümüdür.

## Adresler

- Ana sayfa: `https://www.draborneagle.com/DraBornGarage/`
- İşletme: `/DraBornGarage/<isletme-baglanti-adi>`
- Usta: `/DraBornGarage/<isletme-baglanti-adi>/<usta-baglanti-adi>`

İşletme ve usta profilleri önce taslak oluşturulur. İşletme sahibi Web Profili ekranından yayınlamadan halka açılmaz.

## Senkron modüller

- Supabase Auth ve mobil uygulamayla ortak oturum
- İşletme sahibi, sahip + usta, usta, çırak ve müşteri rolleri
- İş emirleri, durumlar, hizmet/parça/not/teşhis yönetimi
- Nakit–IBAN tahsilatı, açık hesap ve alacak takibi
- Müşteri, motosiklet, kilometre ve servis geçmişi
- Randevu oluşturma, onay, geldi, iptal ve servise dönüştürme
- Kayıt kodu, takip kodu, telefon ve usta onayıyla eşleştirme
- Kişisel usta ve işletme raporları
- Ekip rolleri, erişim başvuruları ve davet kodları
- Supabase Realtime panel yenilemesi
- Yayınlanabilir işletme ve usta web sayfaları

## Webden ayrılan mobil özellikler

Expo/FCM push, cihaz tokenı, bildirim sesi, haptik ve kamera QR tarama web paketine alınmadı. Manuel QR/kod girişi korunur.

## Yapı

- `index.html`: uygulama girişi
- `assets/dkd_bundle_loader.js`: üretim yükleyicisi
- `assets/chunks_v3/`: doğrulanmış sıkıştırılmış modüller
- `assets/dkd_garage.css`: responsive garaj teması
- `supabase/README.md`: uygulanan web veritabanı katmanı

## Güvenlik

Tarayıcıda yalnızca Supabase publishable key kullanılır. `service_role` bulunmaz. Kişisel veriler mevcut RLS/RPC yetkileriyle korunur; halka açık sayfalar yalnızca yayınlanmış filtreli profil RPC’sini okur.
