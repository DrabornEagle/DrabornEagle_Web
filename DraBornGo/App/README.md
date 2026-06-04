# DraBornGo APK Güncelleme Merkezi

Bu klasör `https://www.draborneagle.com/DraBornGo/App/` altında yayınlanacak APK indirme ve güncelleme manifest dosyalarını tutar.

## Dosyalar

- `index.html`: kullanıcıların APK indirme sayfası.
- `dkd_draborngo_update_manifest.json`: uygulama içi sürüm kontrol manifesti.
- `dkd_draborngo_latest.apk`: kullanıcıya sunulacak güncel APK dosyası.
- `dkd_draborngo_sha256.txt`: APK doğrulama hash değeri.

## Yayın akışı

1. Yeni Android APK aynı package name ve aynı keystore ile imzalanır.
2. `versionCode` her sürümde artırılır.
3. APK `dkd_draborngo_latest.apk` adıyla bu klasöre yüklenir.
4. APK hash değeri `dkd_draborngo_sha256.txt` ve manifest içindeki `dkd_sha256` alanına yazılır.
5. Manifest içindeki `dkd_latest_version_name` ve `dkd_latest_version_code` güncellenir.

DraBornGo uygulaması bu manifesti okuyarak kullanıcıya yeni sürüm uyarısı gösterir. Sessiz kurulum yapılmaz; Android güvenliği gereği kurulum ekranında kullanıcı onayı gerekir.
