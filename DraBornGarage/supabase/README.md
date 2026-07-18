# DraBornGarage Web Supabase Katmanı

Web v1.0 için aşağıdaki migrations canlı DraBornGarage Supabase projesine uygulanmıştır:

1. `20260717224251_draborngarage_web_profiles_v1`
   - `workshop_web_profiles`
   - `mechanic_web_profiles`
   - güvenli slug normalizasyonu
   - işletme sahibi / usta düzenleme RLS politikaları
   - yalnızca yayınlanan alanları döndüren `web_get_public_profile(text,text)` RPC
   - mevcut işletme ve ekip üyeleri için yayınlanmamış taslak profiller

2. `20260717231144_draborngarage_web_registration_claim_v1`
   - oturum açmış müşterinin tek kullanımlık kayıt QR/kodunu webden tüketmesini sağlayan `customer_claim_by_registration_link(text)` RPC

3. `20260718055311_draborngarage_web_profile_indexes_v1`
   - web profil düzenleme ve kullanıcı sorguları için yardımcı foreign-key indeksleri

## Güvenlik sonucu

- `anon`, web profil tablolarını doğrudan okuyamaz.
- `anon`, yalnızca filtrelenmiş halka açık profil RPC’sini çalıştırabilir.
- İşletme profilini yalnızca işletme sahibi düzenler/yayınlar.
- Usta profilini ilgili usta veya işletme sahibi düzenler.
- Mobil uygulamanın mevcut RLS, Auth ve iş emri tabloları değiştirilmeden korunmuştur.

## Supabase Auth URL ayarı

Supabase Dashboard → Authentication → URL Configuration bölümündeki Redirect URLs listesinde aşağıdaki adres bulunmalıdır:

`https://www.draborneagle.com/DraBornGarage/**`

Web kayıt ve e-posta doğrulama akışı kullanıcıyı `https://www.draborneagle.com/DraBornGarage/panel` adresine yönlendirir. Bu Dashboard izin listesi, SQL migration ile yönetilemediği için yayın öncesi panelden kontrol edilmelidir.
