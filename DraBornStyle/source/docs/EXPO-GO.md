# Expo Go kabul testi

Hedef: Android **Expo Go 58.0.2**. Proje **Expo SDK 58.0.7** kullanır. Expo'nun kurulu SDK manifestiyle paket uyumu kontrol edildi; React 19.3.0, React Native 0.88.0-rc.4, camera, maps, location ve notifications önerilen paket setindedir. `package-lock.json` ve `.npmrc` birlikte korunmalıdır.

Bu ortamda fiziksel Android telefon ve Expo Go 58.0.2 çalıştırılmadı. Android Metro/Hermes exportu başarılıdır; cihaz üzerinde kamera, harita, dokunsal geri bildirim ve izin diyaloglarını doğrulamaz.

## Çalıştırma

```bash
git clone https://github.com/DrabornEagle/DraBornStyle.git
cd DraBornStyle
npm ci
npx expo start --lan --clear
```

Expo Go'da QR okut. Aynı Android telefonda Termux kullanıyorsan `--localhost` ile başlatıp `exp://127.0.0.1:8081` adresini Expo Go'da aç. Başka cihazın LAN erişimi yoksa internet bağlantısıyla `npx expo start --tunnel` kullanılabilir; tünel için Expo'nun istediği ek paket gerekir.

## Destek sınırları

| Özellik | Bu sürüm | Cihaz testi |
|---|---|---|
| E-posta giriş/kayıt, randevu, finans RPC | Expo Go ve Web ortak Supabase | Gerçek sunucu/API testleri geçti; fiziksel cihaz bekliyor |
| Realtime randevu/usta/mesaj/bildirim | Uygulama açıkken Supabase WebSocket | İki istemci canlı testi geçti; Web ↔ telefon testi bekliyor |
| Harita | Android react-native-maps; Web OpenStreetMap | Telefonda görsel kontrol bekliyor |
| QR tarama | Expo Camera, yalnızca 5 dakikalık DraBornStyle müşteri QR | Kamera izni ve tarama bekliyor; sunucu QR testi geçti |
| Konum | Kullanıcı izniyle önde çalışan, süreli varış takibi | İzin/geri çekme sunucu testleri geçti; cihaz bekliyor |
| Yerel hatırlatma | Profilde açılır; tek randevu ID'siyle yinelenme önlenir | Expo Go telefonunda işletim sistemi testi bekliyor |
| Android uzak push | Etkin değil | Expo Go desteklemez; ayrı development build ve FCM/Expo push yapılandırması gerekir |
| Arka plan konumu | Etkin değil | Development build gerekir; kullanıcı rızası olmadan eklenmemeli |
| Web sistem bildirimi | İzin verilen tarayıcıda yerel test | Kapalı tarayıcıya Web Push / service worker kurulmadı |
| Google OAuth | Web düğmesi, mevcut Supabase sağlayıcısı | Uçtan uca sağlayıcı callback/redirect testi bekliyor; Expo Go için native OAuth yok |
| Dekont/görsel/rapor | Expo Document Picker, Storage, Print/Sharing | Dosya biçimi testleri geçti; Android paylaşım ve yazdırma bekliyor |

Uzaktan push varmış gibi başarı durumu gösterilmez. Uygulama içi bildirim kutusu gerçek sunucu kayıtlarını gösterir. Yerel hatırlatmalar bu cihazda uygulamanın en son senkronize ettiği randevulardan oluşur; uygulama kapalıyken değişen randevu için uzak push yerine geçmez.

Expo belgeleri: [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/), [Location](https://docs.expo.dev/versions/latest/sdk/location/), [SDK sürümleri](https://docs.expo.dev/versions/latest/).

## Telefon kabul senaryoları

1. 360–430 px Android ekranda giriş, koyu/açık tema, klavye ve alt navigasyonu kontrol et.
2. Onaylı işletmeye hizmet/usta ekle; müşteri hesabıyla son fiyatı onaylayıp randevu oluştur.
3. Web'de açık aynı usta panelinde randevuyu gör; telefonda başlat; Web çalışma durumunu kontrol et.
4. Telefonda tamamla; Web'de tek komisyon ve güncel borcu doğrula.
5. Konum iznini reddet; rezervasyonun etkilenmediğini gör. İzin verip takip aç; ekran arka plana geçince yeni konum göndermediğini, izin geri çekilince kayıtların temizlendiğini kontrol et.
6. Profilde QR oluştur; yetkili usta telefonunda tarayıp hızlı müşteri başlat.
7. Yerel bildirim iznini aç; test ve 30 dakika önce hatırlatmayı dene. Randevu ertelenince eski yerel hatırlatmanın kaldırıldığını kontrol et.
8. Oturumu kapat/aç, uygulamayı yeniden başlat; verilerin Supabase'den geldiğini doğrula.

**APK/AAB oluşturulmadı.** `npm run export:android` yalnızca JavaScript/Hermes paket kontrolüdür.
