# DraBornAPK v0.1

DrabornEagle_Web deposu için bağımsız, mobil uyumlu web tabanlı APK kaynak keşif aracı.

**Adres:** https://www.draborneagle.com/DraBornAPK/

## Çalışma şekli

1. Kullanıcı Google Play uygulama/oyun paylaşım bağlantısını veya Android paket kimliğini girer.
2. Tarayıcı paket kimliğini doğrular; aynı alan adındaki Vercel \`/api/drabornapk-lookup\` endpoint'ine sorgu yollar.
3. Backend Google Play herkese açık sayfasından *yalnızca metadata* okumayı dener (başlık/ikon); bloklanırsa paket kimliği gösterilir.
4. Backend açık kaynak F-Droid'in herkese açık katalog API'sini sorgular, önerilen paket koduyla F-Droid deposunda doğrudan APK URL'sinin HEAD isteğine erişilebilirliğini kontrol eder.
5. Bağımsız APK mevcutsa kullanıcı F-Droid'de barındırılan APK URL'sine yönlendirilir; varsayılan otomatik indirme tercihi kapatılabilir. Tarayıcı indirmeyi veya güvenlik onayını sorabilir.
6. F-Droid'de yoksa APK indirdiği izlenimi verilmez, resmi Google Play ve varsa F-Droid sayfası sunulur.

## Sınırlar ve güvenlik

- **Google Play bağlantısı bir APK indirme linki değildir.** Google Play'in resmi, herkesin istediği uygulama APK'sını indireceği açık API'si bulunmaz. AAB/cihaza özel split APK yayımlayan ticari uygulamalar için bu servis genellikle doğrudan APK bulamaz.
- APK *Google Play'den çekilmez*. Yalnızca F-Droid kendi sunucusundaki alternatif sürümler yönlendirilir. Play sürümüyle imza, sürüm, varyant farkı olabilir ve yükseltme kurulumunda sorun çıkarabilir.
- F-Droid katalog API'si güvenli imza doğrulama servisi değildir; bu web uygulaması **bağımsız imza/hash doğrulaması yapmaz**. İmzaları güvenle doğrulamak ve otomatik güncelleme almak için resmi F-Droid uygulamasını kullanın. Kaynak: https://f-droid.org/docs/All_our_APIs/
- APK binary dosyaları DraBornEagle sunucusundan geçmez, depolanmaz veya yeniden dağıtılmaz.
- Sorgular dış bağlantı olarak yalnızca önceden sabitlenmiş Play/F-Droid hostlarına gider; kullanıcı keyfi URL ile sunucu proxy isteği yaptıramaz.
- Yalnızca GET; paket formatı doğrulanır. Ekrandaki sunucu verileri metin olarak eklenir (HTML enjekte edilmez). Kullanıcının son 5 sorgusu yalnızca kendi cihazındaki localStorage'da tutulur ve silinebilir.
- Bu araç Google, Google Play veya F-Droid ile bağlantılı değildir.
- Tarayıcıların güvenlik modelinden ötürü otomatik indirme ve APK kurulumu her cihazda zorlanamaz.

## Dosyalar

- \`index.html\`: erişilebilir semantik HTML
- \`assets/app.css\`: DrabornEagle tasarımına uygun responsive arayüz
- \`assets/app.js\`: URL ayrıştırma, metadata sonucu, otomatik indirme tercihi, yerel geçmiş
- \`../api/drabornapk-lookup.js\`: Vercel Node.js serverless metadata ve kaynak kontrolü

## Lokal doğrulama

Vercel API gereklidir. Normal statik HTTP sunucusu HTML arayüzünü açabilir ancak \`/api/drabornapk-lookup\` route'u olmadan gerçek kaynak sorgusu çalışmaz. Vercel'e bağlı ana dal dağıtıldığında bu endpoint otomatik tanınır.

Örnek Google Play URL: https://play.google.com/store/apps/details?id=org.kde.kdeconnect_tp

## v0.2 fikirleri

Yayıncının izin verdiği resmî GitHub Releases APK dosyaları için açıkça kayıtlı paket->repo eşleştirmesi ve hash/doğrulama ile kaynak çeşitlendirme. Üçüncü taraf belirsiz APK aynalarından otomatik indirme planlanmaz.
