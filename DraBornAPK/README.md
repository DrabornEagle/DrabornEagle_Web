# DraBornAPK v0.1

DraBornAPK, DrabornEagle_Web içinde bağımsız, mobil uyumlu Google Play URL analizi ve **alternatif F-Droid APK keşif** aracıdır.

**Canlı sayfa:** https://www.draborneagle.com/DraBornAPK/

## Kullanım

1. Google Play uygulamasının bağlantısını veya \`org.example.app\` gibi paket kimliğini yapıştır.
2. DraBornAPK paket kimliğini ayıklar ve **aynı alan adındaki** \`/DraBornAPK/data/catalog.json\` kataloğunda arar.
3. Katalogda varsa F-Droid'in kendi deposundaki bilinen APK sürümüne bağlantı gösterir. "Otomatik başlat" açıkken tarayıcı indirme isteği gönderir.
4. Yoksa Google Play sayfasını gösterir. APK indirildiği yanılsamasını vermez.
5. Son 5 arama, yalnızca cihazdaki localStorage'da tutulur; temizlenebilir.

**Not:** Google Play, keyfi uygulamalar için halka açık APK indirme API'si sağlamaz. Bu site **Google Play'den APK indirmez**. F-Droid'de dağıtılan açık kaynak sürümü farklı olabilir. Çoğu ticari oyun ve uygulama için doğrudan APK bağlantısı yoktur.

## Veri güncelleme

Vercel projesinde var olan API endpoint'lerinin 404 döndürmesi nedeniyle DraBornAPK, mevcut sitenin Vercel projesindeki serverless API'lerine bağlı değildir. Böylece ana sitenin konfigürasyonu değiştirilmez.

\`.github/workflows/dkd-drabornapk-catalog.yml\` GitHub Actions iş akışı her gün ve script/workflow değiştiğinde F-Droid'in \`https://f-droid.org/repo/index-v2.json\` dizinini okur; \`DraBornAPK/scripts/dkd-update-catalog.mjs\` yayınlanmış sabit sürüm APK'larının id, ad, sürüm ve dosya adlarını ayıklar. \`DraBornAPK/data/catalog.json\` içine yazar; değişmişse main'e commit eder. İndirilen binary'leri depolamaz. Manuel workflow_dispatch da kullanılabilir.

Çalışma testi: \`node --test DraBornAPK/scripts/dkd-update-catalog.test.mjs\`

### Güvenlik

- Katalog F-Droid'in HTTPS üzerinden yayımladığı index-v2 JSON'a dayanır, **bağımsız GPG/JAR imza doğrulaması yapmaz**. İndirme bağlantısını takip etmeden önce hedefi ve sürümü denetle.
- Resmî F-Droid uygulaması, imzalı paket dizini ve imza kontrolü için tercih edilmelidir: https://f-droid.org/docs/All_our_APIs/
- Yalnızca \`f-droid.org/repo/{paket}_{sürümKodu}.apk\` biçimi kabul edilir; kullanıcı serbest sunucu proxy URL'si veremez.
- Gerçek APK dosyaları DraBornEagle sunucularında barındırılmaz. Sitenin otomatik indirme özelliği Android tarayıcısının izinlerine bağlıdır.
- Play ile F-Droid sürümlerinin uygulama imzaları farklı olabilir; yükleme/güncelleme sorunları mümkündür.
- Bağımsız bir araç; Google veya F-Droid ile resmi bağlantısı bulunmuyor.

## Dosyalar

- \`index.html\`, \`assets/app.css\`, \`assets/app.js\`: sayfa, responsive görünüm ve tarayıcı mantığı
- \`data/catalog.json\`: kullanıcı aramaları için statik APK kataloğu
- \`scripts/dkd-update-catalog.mjs\` ve testi: otomatik veri üretimi
- \`../api/drabornapk-lookup.js\`: ilk API prototipi; aktif istemci tarafından kullanılmaz, Vercel projesi için mevcut statik-route engeli çözülene kadar bağımsızdır

## Sınırlar

Aracın yaptığı şey *Google Play linkinden paket kimliği çıkarıp aynı uygulamanın F-Droid sürümünü önermektir*. Google Play'in oturum ve cihaz kısıtını aşmaz; ticari APK/split APK çıkarma ya da Play hesabından paket çekme sağlamaz.
