# DraBornOffice v0.4 · Miami Shores

20 özgün karakterin yaşadığı, tamamen cihazda çalışan bir oyun stüdyosu simülasyonu.

**Oyna:** https://www.draborneagle.com/DraBornLand/Office/

## v0.4 ile gelenler

- Eski kısa komşu binaların yerine 6 özgün kule; cam cephe, kat çizgileri, ışıklı pencereler, çatı bahçeleri ve neon taçlar.
- DraBornLand’de 3 satılık arsa, 2 ofis, 4 konut. Tür filtreleri, detaylar, haritada konum, oyun içi satın alma ve kalıcı mülk portföyü.
- Bağlantılı bulvarlar, bisiklet şeridi, yaya geçidi, sokak aydınlatmaları, park, fıskiye, kafe, otopark ve marina.
- Hareketli trafik, tekneler, yürüyen insanlar, plaj havlularında güneşlenenler ve kıyıda yüzenler.
- Stüdyo bütçesi, tüm fiyatlar, karar etkileri ve finans raporları USD ($). Eski kayıtların sayısal bakiyeleri aynı kalır; kur dönüşümü yapılmaz.
- Saat 2.75 yerine 0.9 oyun dakikası / simülasyon saniyesi ilerler. 1× hızda 09:00–18:00 günü yaklaşık 10 gerçek dakika sürer; hareket ve üretim temposu korunur.
- Yeni renkli kartal / gökdelen logosu ve mülk arayüzü.
- Oyun `office/` klasöründen `DraBornLand/Office/` klasörüne taşındı. Eski adreste yalnızca yönlendirme ve eski service worker’ı emekliye ayıran iki küçük dosya kalır.
- Eski `/office/` bağlantıları sorgu ve bölüm bilgileriyle yeni adrese yönlenir. Aynı origin’deki kayıt anahtarı değişmez; yeni PWA kapsamı yeni klasördür.

## Stüdyonun özellikleri

- Miami esintili pembe, turkuaz ve gün batımı renkleri; daha büyük menü metinleri ve dokunma alanları.
- Ofise bağlanan sahil dünyası: plaj, palmiyeli bulvar, deniz, iskele, tekneler, cam cepheli gökdelenler, havuz ve hareketli araçlar.
- Yönetim kararları iki seçenek için de çalışır, sonuç onayı gösterir ve ilerlemeyi kaydeder. Kimliği 0 olan karar artık başka bir kararla değiştirilmez.
- Baştan hazırlanmış izometrik stüdyo: 7 alan, kesit duvarlar, şehir pencereleri, parke, cam bölmeler, masalar, çift monitörler, bitkiler, toplantı masası, kahve köşesi, ses alanı, sunucular, resepsiyon ve arcade.
- Ofisi öne çıkaran modern arayüz; masaüstünde sohbet paneli, telefonda alt menü ve açılır sohbet.
- Birbirinden farklı 20 karakter; enerji, moral, uzmanlık, kişilik, görev, arkadaşlık ve küçük anlaşmazlıklar.
- Gerçek kapılardan geçen BFS yol bulma; yürüme, çalışma, dinlenme ve konuşma animasyonları.
- Bağlamlı, karşılıklı yazılmış sohbet senaryoları; okunabilir konuşma balonları ve yerel sohbet kanalı.
- Karakter inceleme, kamerayla takip, motivasyon, kahve, odak görevi ve ekip buluşması.
- Her karakter için proje ataması; atanmış ekip o projenin üretimini etkiler.
- Kalite, dengeli üretim veya hız önceliği; hata birikimi, test uzmanları ve lansman kalitesi.
- 3 başlangıç projesi; 6 eşzamanlı projeye kadar yeni proje oluşturma ve ekip kurma.
- 7 odanın her birinde 4 geliştirme seviyesi. Geliştirilmiş çalışma masalarında ek donanımlar görünür.
- Ön koşullara bağlı 6 kalıcı araştırma.
- 8 hedef ve tek sefer alınabilen ödüller.
- Günlük maaş / işletme gideri, lansman gelirleri, müşteri işi, işlem defteri ve gün sonu raporları.
- Gündüz, gün batımı, gece ve otomatik atmosfer seçimi.
- Duraklatma, 1× / 2× / 4× hız, klavye ve dokunma kontrolleri, odak görünümü.
- Cihazda çevrimdışı Türkçe ses varsa konuşma balonlarını seslendirme. Varsayılan kapalıdır; bulut ses servisi çağrılmaz.
- Sürüm bazlı çevrimdışı önbellek; eski modüllerin v0.4 isteğine karışmasını engeller.
- V1 / V2 yerel kayıtlarını koruma, otomatik kayıt, JSON dışa / içe aktarımı ve büyük yazı seçeneği.

## Kullanım

Haritadaki **DraBornLand** düğmesi arsa, ofis ve konut ilanlarını açar. İlan tabelaları da dokunulabilir. Satın alma bedeli sanal USD bütçenden tek sefer düşer; alınan mülk kayda ve JSON yedeğine eklenir. Mülk alımı ofisini taşımaz ve kendiliğinden kira geliri üretmez. **Şehri haritada gör** tüm bölgeyi gösterir.

Bir karaktere veya odaya dokunarak incele. Ofisi sürükleyerek gez; tekerlek veya iki parmakla yakınlaş. `0` ofisi sığdırır, `F` odak görünümünü açar. `Boşluk` duraklatır, `1–6` menü panellerini açar, oklar haritayı taşır, `Ctrl/Cmd+S` kaydeder.

Telefonda ayarlara sağ üstteki `?` rehberi üzerinden ulaşabilirsin. Bütçeye dokunarak finans raporunu açabilirsin.

Yeni projeye mutlaka ekip ata. Kalite kontrol uzmanları proje hatalarını azaltır. Üretim %100'e ulaştığında proje yeni sürüm yayınlar, gelir ve hayran kazandırır.

## Yerel çalıştırma

Bağımlılık, API anahtarı, derleme ve ücretli servis gerekmez.

```sh
cd DraBornLand/Office
python3 -m http.server 8080
```

Sonra `http://localhost:8080` adresini aç. ES modülleri sebebiyle dosyayı `file://` üzerinden açma.

Termux'ta:

```sh
pkg install git python
git clone https://github.com/DrabornEagle/DrabornEagle_Web.git
cd DrabornEagle_Web/DraBornLand/Office
python -m http.server 8080
```

Repo zaten varsa proje kökünde `git pull --ff-only` yeterli.

## Kayıt

- V2 anahtarı: `draborn-office-v2`.
- Geçerli kayıt bulunmadığında `draborn-office-v1` okunur ve bilinen bilgiler korunarak dönüştürülür.
- Eski kayıtlar yeni stüdyo oluşturulmadıkça silinmez. Kayıt şeması 2 olarak korunur; sürüm adının v0.4 olması ilerlemeyi sıfırlamaz.
- Otomatik kayıt: 20 saniyede bir ve sekmeden ayrılırken.
- Ayarlar → JSON yedeği indir / Yedeği içe aktar ile cihazlar arasında elle taşıma.
- İçe aktarım verisi tür, boyut, değer aralığı ve bilinen kimliklerle denetlenir.
- İçe aktarmadan önce mevcut stüdyo yedeği indirilir. Geçersiz dosya mevcut ilerlemeyi değiştirmez.
- Sekme arka planda veya kapalıyken simülasyon ilerlemez.
- Her ziyaretçinin stüdyosu bağımsızdır; eşzamanlı çok oyunculu sunucu ve gerçek kullanıcı sohbeti yoktur.

## Mimari

| Dosya | İşlev |
| --- | --- |
| `index.html` | Erişilebilir DOM arayüzü, eski çevrimdışı sürümden geçiş |
| `style.css` | Masaüstü / mobil arayüz, açılır paneller, odak görünümü |
| `app.js` | Paneller, kontroller, klavye, dokunma, ses, yedek işlemleri |
| `engine.js` | Bağımsız simülasyon, üretim, ekonomi, ilişkiler, kayıt |
| `renderer.js` | İzometrik Canvas 2D çizimi, kamera, seçim, konuşma balonları |
| `coast.js` | Kamera ile bütünleşen sahil dünyası, deniz, şehir ve ortam hareketleri |
| `city.js` | Özgün gökdelen ve mülk kataloğu |
| `estate-ui.js` | İlan türleri, mülk detayları ve portföy görünümleri |
| `city.css` | v0.4 logo, şehir düğmesi ve mülk panelleri |
| `miami.css` | Miami renkleri, daha büyük tipografi, karar sonuç ekranı |
| `data.js` | Özgün karakterler, mekanlar, projeler ve yazılmış senaryolar |
| `icons.js` | Yerel SVG arayüz simgeleri |
| `sw.js` | Yalnızca `/DraBornLand/Office/` kapsamında sürümlü çevrimdışı önbellek |
| `tests/` | Simülasyon, kamera ve çevrimdışı çalışma testleri |

Oynamak için paket kurulumu gerekmez; geliştirme testleri için ücretsiz linkedom yalnızca devDependency olarak kullanılır.

Çizimler kodla üretilir; üçüncü taraf sanat paketi, dış SDK, font CDN'i veya çalışma zamanında ücretli API kullanılmaz. Simülasyon, render ve DOM durumu birbirinden ayrıdır. Statik ofis zemini önbelleğe çizilir; dünya çizimi 30 FPS ile sınırlanır, cihaz piksel oranı en fazla 2'dir.

## Kontroller

Node.js 22 veya üzeri:

```sh
npm install
npm test
npm run check
```

48 otomatik test: kayıt geçişi, bozuk dosyalar, ekonomi, görev ataması, araştırma bağımlılıkları, ücret sınırları, günlük giderler, kararlar, ödüller, kamera / seçim koordinatları, sürümlü önbellek ve 25 oyun günü süren simülasyon. Karar seçenekleri için beş arayüz regresyon testi gerçek uygulama düğmelerine DOM emülasyonunda tıklayarak iki seçeneği, 0 kimlikli kararı, yetersiz bütçeyi ve ücretsiz seçeneği denetler.

Ayrıca mülk kataloğu, filtreler, satın alma, mükerrer alım engeli, konum ve bütçe akışları ile 16 mevcut stüdyo arayüz akışı DOM emülasyonunda kontrol edildi; gündüz, gece ve mobil ofis çizimi ekran dışında rasterleştirilerek incelendi. Bunlar gerçek tarayıcı düzeni veya fiziksel cihazdaki dokunma / ses testinin yerine geçmez. Bu oturumda etkileşimli tarayıcı testi yapılamadı.

## Sınırlar

Karakterler kurmaca, diyaloglar yazılmış içerik ve kurallara dayanır. Bir LLM çalıştırılmaz. Oyun içindeki bütçe sanal paradır. Ortak sunucu, hesap veya abonelik gerektirmez.
