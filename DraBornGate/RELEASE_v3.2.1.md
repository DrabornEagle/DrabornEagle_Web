# DraBornGate Web v3.2.1

Bu sürüm; yenileme sırasında eski sürüm numarasının görünmesi, Admin kullanıcıların menüsünün kaybolması ve Güvenlik Sade Tema canlı verilerinin açılamaması sorunlarını birlikte giderir.

## Kök nedenler

- Açılışta yüklenen eski `v3.1.0.guard.js`, DOM içine sonradan eklenen sürüm metinlerini yeniden `v3.1.0` yapıyordu. Daha sonra v3.1.1 katmanı bunların bir bölümünü tekrar değiştiriyor ve ekranda sürüm sıçraması oluşuyordu.
- Güvenlik kuyruğu ve Admin Paneli RPC istekleri `Accept-Profile: draborngate` ile gönderiliyordu. Supabase PostgREST bu şemayı yayınlamadığı için istekler HTTP 406 dönüyordu.
- Admin katalog isteği başarısız olunca arayüz hatayı sessizce `null` değerine çeviriyor, bu yüzden gerçek Admin hesaplarında bile menü öğesi oluşturulmuyordu.

## Uygulanan düzeltmeler

- Tek kaynaklı v3.2.1 sürüm koruması eklendi; eski v2.x, v3.0.x, v3.1.x ve v3.2.0 metinleri ekrana girmeden v3.2.1'e çevrilir.
- Açılış sırasında eski DraBornGate service worker önbellekleri temizlenir, yeni worker `updateViaCache: none` ile zorla güncellenir.
- HTML, manifest, JavaScript yükleyicileri ve tüm cache-buster değerleri v3.2.1 olarak eşitlendi.
- `public` şemasına, mevcut güvenli `draborngate` fonksiyonlarını çağıran authenticated RPC köprüleri eklendi.
- v3.2.1 veri katmanı yalnızca ilgili DraBornGate v31 RPC isteklerinde `Accept-Profile` ve `Content-Profile` başlıklarını kaldırır.
- Sade Tema canlı kurye kuyruğu, kod arama ve kod onaylama istekleri public RPC köprüsüne bağlandı.
- Admin katalog ve partner kazanç çağrıları aynı köprüye bağlandı; Admin Paneli yalnızca veritabanındaki gerçek Admin kullanıcılarında görünür.

## Kontrol edilen Admin hesapları

- `draborneagle@gmail.com`
- `playreview@draborneagle.com`

İki hesap da `draborngate.dkd_gate_admins` tablosunda aktif Admin kaydına sahiptir. Rolün `courier` seçilmiş olması Admin yetkisini kaldırmaz; Admin Paneli menüsü veritabanındaki Admin üyeliğine göre gösterilir.
