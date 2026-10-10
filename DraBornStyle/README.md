# DraBornStyle v0.1.0

React Native / Expo SDK 58 / TypeScript ile Android ve Web için ortak uygulama. Veriler `DraBorn-Park-Garage-Series` projesindeki **drabornstyle** şemasında tutulur. Tablolar `db_style_` ile başlar. İstemcide yalnızca publishable API anahtarı bulunur.

Web: https://www.draborneagle.com/DraBornStyle/

## Termux ve Expo Go

Node.js 24 önerilir (en az 22.18). Android Expo Go 58 ile test için:

```bash
pkg update -y
pkg install nodejs-lts git -y
git clone https://github.com/DrabornEagle/DraBornStyle.git
cd DraBornStyle
npm ci
npx expo start --localhost --clear
```

Termux ve Expo Go aynı telefondaysa Expo Go içinden `exp://127.0.0.1:8081` adresini aç. Başka cihaz kullanacaksan `npx expo start --lan` ve terminaldeki QR kullanılabilir. Eski bir checkout varsa proje klasöründe `git pull --ff-only` ve `npm ci` çalıştır.

Hedef Expo Go uygulama sürümü 58.0.2'dir. Kaynaklar Expo **58.0.7**, React **19.3.0** ve Expo'nun önerdiği React Native **0.88.0-rc.4** paket setiyle sabitlenmiştir. `npx expo install --check` geçer. SDK 58 aday React Native sürümü nedeniyle `.npmrc` içindeki `legacy-peer-deps` gerekir. Fiziksel telefon üzerinde Expo Go 58.0.2 çalıştırması bu ortamda yapılmamıştır; cihaz kabul testi teslimat notlarında ayrı listelenir.

## Roller ve ilk kurulum

1. Müşteri email ile kayıt olur; mevcut ortak Supabase hesabıyla giriş de yapılabilir.
2. İşletmem → İşletme kaydet. Admin başvuruyu onaylar.
3. İşletme sahibi hizmet fiyatı/süresi ve ustaları ekler. Usta paneli için ustanın kayıtlı e-posta hesabı bağlanır.
4. Müşteri Keşfet → hizmet → usta → tarih → saat → fiyat → onay akışını kullanır.
5. Usta randevuyu veya hızlı müşteriyi başlatır ve tamamlar. Komisyon sunucuda bir kez oluşur.
6. İşletme ödeme bildirir; admin onaylarsa borçtan düşer.

`draborneagle@gmail.com` mevcut Auth kullanıcısı `db_style_admin_users` üzerinden yetkilendirilmiştir. Parola kaynak koduna eklenmez, ortak kullanıcı hesabı veya başka proje profili değiştirilmez. Giriş kullanıcı tarafından verilen mevcut parola ile doğrulanmıştır.

## Kaynaklar ve doğrulama

```bash
npm run typecheck
npx expo install --check
npm test
npm run export:web
node scripts/export-site.mjs
npm run export:android
```

`export:android` sadece JavaScript/Hermes paket doğrulamasıdır. APK/AAB üretmez. Web çıktısı `dist/`, Android doğrulama çıktısı `dist-android/` içindedir.

`supabase/migrations/` dağıtım geçmişini içerir. `tests/engine.sql` ve `tests/workflows.sql` tek transaction içinde gerçek DB fonksiyonlarını test eder ve tamamını rollback eder. `scripts/live-tests.mjs` iki bağımsız API istemcisi ve Realtime testi içindir: kimlik bilgilerini stdin'den alır, tokenları yazdırmaz; geçici test işletmesi ID'sini çıktıda verir. Test sonunda yalnızca bu doğrulanmış test işletmesine ait kayıtlar SQL üzerinden temizlenmelidir.

Müşteri verileri ve finans kayıtları mobil/Web istemcilerinden doğrudan yazılamaz. `api` RPC, canlı üyelik/yetki denetimi yapar. Yetkili işlemleri gerçekleştiren fonksiyonlar Data API'ye açılmayan `drabornstyle_private` alanındadır.

Ayrıntılar: [teslimat ve test raporu](docs/DELIVERY.md), [veritabanı](docs/DATABASE.md), [Expo Go sınırları](docs/EXPO-GO.md).
