# DraBornGames

Oyun platformu: https://www.draborneagle.com/DraBornGames/

- Last Mile: `Last-Mile/` — Android ile aynı HTML5 oyun kaynağından üretilir.
- Shift Error: `shifterror/` — mevcut oyunun eksiksiz açılmış HTML dosyası.
- Eski `Games/` adreslerinde yalnızca geriye uyumluluk yönlendirmeleri bulunur.

## Ortak geliştirme kuralı

Last Mile oyun değişikliklerini `DrabornEagle/DraBornGames` deposundaki
`DraBornGo-LastMile/game/` ve `App.tsx` kaynaklarında yap. Android ve web için
ayrı oyun kopyaları düzenleme. `Last-Mile/index.html` üretilmiş dosyadır.
Tarayıcıya özel aygıt işlemleri `web/dkd-browser-adapter.js` içindedir; hesap,
görev ve kayıt işleyicisi doğrudan Android `App.tsx` dosyasından derlenir.

Kaynak değişince Android Release workflow'u otomatik çalışır. Web deposu
GitHub Actions zamanlamasıyla 5 dakikada bir kaynağı kontrol eder; GitHub
yoğunluğunda zamanlama gecikebilir. `version.json` kaynak commit ve iki
paketin SHA-256 bilgisini taşır. APK, build doğrulamaları geçtikten sonra
GitHub Release'den indirilir, hash ve sertifika kaydı doğrulanır ve
`Last-Mile/downloads/` altına kopyalanır. Sonra Pages yayını istenir.

APK cihazda kendiliğinden kurulmaz. Kullanıcı güncel APK'yı indirip mevcut
uygulamanın üzerine kurar. Keystore değişmez. Yeni sürüm hazırlanırken web
önden güncellenebilir; APK ve web derlemelerinin tamamlanma zamanı farklıdır.

## Oyuncu kaydı

Aynı hesap aynı Supabase kariyerini yükler. Cihaz değiştirirken bağlantı
açıkken kaydın gönderilmesini bekle ve diğer cihazda yeniden giriş yap.
Eşzamanlı iki aktif oyun oturumu için çatışma birleştirme uygulanmamıştır.

## Görseller

`assets/` altındaki görseller tanıtım çizimleridir, oyun içi ekran görüntüsü değildir.
Yeni portal CSS'inde gradient, glow ve shadow kullanılmaz.
