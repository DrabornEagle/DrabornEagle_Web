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
5. DrabornEagle_Web Vercel projesine `BANANA_WORKSPACE_ORIGIN` değişkenini kendi özel sunucunun HTTPS origin adresi olarak ekle; yol, sorgu veya sonuna `/api` ekleme. Sonra yeniden dağıt. Bu değişken gizli sağlayıcı anahtarı içermez. Web köküne başka uygulamaların Supabase anahtarları kopyalanmaz.
6. Özel Banana kaynağındaki OAuth dönüş adresini `https://www.draborneagle.com/banana-studio/` olarak tanımla ve Supabase izinli dönüş adreslerine ekle. Alt dizine uyarlanmış web kaynağı bu adresi otomatik kullanır.

`api/banana-studio/[route].js`, yalnızca izinli uygulama rotalarını yapılandırılmış sabit sunucuya iletir. Kurulum yoksa galeri açık kalır; üretim isteği ücretli bir sağlayıcıya gönderilmeden anlaşılır hata döner. Yerel çalışma alanının kimliği sunucuda oturum açma yetkisi vermez.

## Geliştirme

```sh
cd banana-studio/source
npm ci --ignore-scripts
npm test
npm run typecheck
npm run build
```

`dist/` çıktısının içeriği `banana-studio/` klasörüne kopyalanır. `source/` içindeki masaüstü uygulamaları, sunucu, Supabase kaynakları, testler, lisanslar ve belgeler korunur. Sağlayıcı anahtarı veya kullanıcı medyası repoya eklenmez.
