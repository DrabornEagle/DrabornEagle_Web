# Banana Studio Web

27 Ekim 2026 · Orijinal kaynak: `source/` · Kaynak commit: `c9fe7de8293dfb1d8521359452a61ded75351003`.

Bu sürüm orijinal React arayüzünü kullanır. Masaüstü ve tablet ekranları için dokunma alanları, taşan menüler, güvenli ekran boşlukları ve alt dizin adresleri uyarlanmıştır.

| Özellik | Durum |
| --- | --- |
| Galeriyi açma, görsel/video ekleme ve indirme | Bu tarayıcıda çalışır |
| Klasörler, favoriler, arama, karşılaştırma, referanslar ve şablonlar | Yerel çalışma alanında çalışır |
| Yenilemeden sonra galeri ve ayarların korunması | IndexedDB ile bu tarayıcıda saklanır |
| AI görsel/video üretimi, Enhance, Brainstorm, YouTube analizi | Özel sunucu, veritabanı ve uygun sağlayıcı anahtarı kurulmalıdır |
| Hesaplar, cihazlar arası eşitleme, paylaşılan klasör linkleri ve yönetim | Bulut kurulumu gerektirir |

Tarayıcı verileri silinirse yerel çalışma alanı da silinir. Kalıcı arşiv için galeriden dosyalarını indir. Masaüstü uygulamasıyla ve farklı tarayıcılarla otomatik eşitleme yoktur. Site, orijinal geliştiricinin hesaplarına veya anahtarlarına bağlanmaz.

## Tam bulut sürümünü etkinleştirme

1. Kendi `banana-studio` reponun orijinal kökünü ayrı Vercel projesi olarak dağıt. Tam kaynak `source/` klasöründe de bulunur.
2. Uygulamaya özel boş bir Supabase projesi kullan. `source/docs/tr/deploy.md` ve `source/docs/en/deploy.md` yönergeleri; tablolar, özel medya bucket'ı, Google oturumu, ilk yönetici ve sağlayıcı değişkenlerini ayrıntılı açıklar. Baseline SQL'i mevcut başka uygulamaların tabloları üzerine uygulama.
3. Orijinal projenin Vercel Queue ve dakikalık kurtarma Cron kurulumunu koru. Bunların desteklendiği bir plan gerekir. API ve barındırma ücretleri hizmet sağlayıcısına bağlıdır.
4. Doğrudan özel sunucuda başarılı giriş, üretim, kalıcı medya ve indirmeyi doğrula.
5. Ana alan adı şu anda GitHub Pages üzerinden sunuluyor. Pages, `api/` altındaki sunucu kodunu çalıştırmaz. API köprüsü için mevcut DrabornEagle_Web Vercel dağıtımını veya özel bir Vercel dağıtımını kullan. Bu dağıtımda `BANANA_WORKSPACE_ORIGIN` değişkenini kendi Banana sunucunun HTTPS origin adresi olarak tanımla; yol, sorgu veya `/api` ekleme. Yeniden dağıtım sonrası köprünün `workspace-config` ve CORS ön uçuş yanıtlarını doğrula. DNS değişikliği gerekmez.
6. `source/public/workspace.json` içindeki `mode` değerini `cloud`, `apiBase` değerini köprünün **herkese erişilebilir** HTTPS adresiyle değiştir: örneğin `https://YOUR-BRIDGE.example/api/banana-studio`. Gizli anahtar, token, kullanıcı bilgisi veya sorgu parametresi ekleme. Ön yüzü yeniden derleyip `dist/` içeriğini web klasörüne kopyala. Bu ayar uygulamanın giriş, üretim, durum sorguları ve paylaşım sayfasındaki bütün uygulama API çağrılarına uygulanır; çerezler başka origin'e aktarılmaz. Vercel oturum açması gerektiren ön izleme adresleri üretim API'si olarak kullanılamaz.
7. Özel Banana kaynağındaki OAuth dönüş adresini `https://www.draborneagle.com/banana-studio/` olarak tanımla ve Supabase izinli dönüş adreslerine ekle. Alt dizine uyarlanmış web kaynağı bu adresi otomatik kullanır.
8. Son kontrolde giriş, gerçek bir görsel/video üretimi, işlem durumunun geri alınması, kalıcı medya indirme ve paylaşılan klasörü ikinci tarayıcıda açmayı dene. Sağlayıcı anahtarı ve sunucu kurulmadan AI üretimi doğrulanmış sayılmaz.

`api/banana-studio/[route].js`, yalnızca izinli uygulama rotalarını yapılandırılmış sabit sunucuya iletir. Kurulum yoksa galeri açık kalır; üretim isteği ücretli bir sağlayıcıya gönderilmeden anlaşılır hata döner. Yerel çalışma alanının kimliği sunucuda oturum açma yetkisi vermez. Tarayıcı modu AI/paylaşım çağrılarını ağ isteği yapmadan durdurur; sağlayıcı durumu açıkça yapılandırılmamış olarak döner. API yanıt vermiyorsa açılış zaman aşımı sonrası yerel galeriye geçer.

## Geliştirme

```sh
cd banana-studio/source
npm ci --ignore-scripts
npm test
npm run typecheck
npm run build
```

`dist/` çıktısının içeriği `banana-studio/` klasörüne kopyalanır. `source/` içindeki masaüstü uygulamaları, sunucu, Supabase kaynakları, testler, lisanslar ve belgeler korunur. Sağlayıcı anahtarı veya kullanıcı medyası repoya eklenmez.
