# DraBornOffice 2.0

20 özgün karakterin yaşadığı, tamamen cihazda çalışan bir oyun stüdyosu simülasyonu.

**Oyna:** https://www.draborneagle.com/office/

## V2.0 ile gelenler

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
- Sürüm bazlı çevrimdışı önbellek; eski V1 modüllerinin V2 isteğine karışmasını engeller.
- V1 yerel kaydını otomatik taşıma, otomatik kayıt, JSON dışa / içe aktarımı ve büyük yazı seçeneği.

## Kullanım

Bir karaktere veya odaya dokunarak incele. Ofisi sürükleyerek gez; tekerlek veya iki parmakla yakınlaş. `0` ofisi sığdırır, `F` odak görünümünü açar. `Boşluk` duraklatır, `1–6` menü panellerini açar, oklar haritayı taşır, `Ctrl/Cmd+S` kaydeder.

Telefonda ayarlara sağ üstteki `?` rehberi üzerinden ulaşabilirsin. Bütçeye dokunarak finans raporunu açabilirsin.

Yeni projeye mutlaka ekip ata. Kalite kontrol uzmanları proje hatalarını azaltır. Üretim %100'e ulaştığında proje yeni sürüm yayınlar, gelir ve hayran kazandırır.

## Yerel çalıştırma

Bağımlılık, API anahtarı, derleme ve ücretli servis gerekmez.

```sh
cd office
python3 -m http.server 8080
```

Sonra `http://localhost:8080` adresini aç. ES modülleri sebebiyle dosyayı `file://` üzerinden açma.

Termux'ta:

```sh
pkg install git python
git clone https://github.com/DrabornEagle/DrabornEagle_Web.git
cd DrabornEagle_Web/office
python -m http.server 8080
```

Repo zaten varsa proje kökünde `git pull --ff-only` yeterli.

## Kayıt

- V2 anahtarı: `draborn-office-v2`.
- V2 bulunmadığında `draborn-office-v1` okunur ve bilinen bilgiler korunarak dönüştürülür.
- V1 kaydı yeni stüdyo oluşturulmadıkça silinmez.
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
| `data.js` | Özgün karakterler, mekanlar, projeler ve yazılmış senaryolar |
| `icons.js` | Yerel SVG arayüz simgeleri |
| `sw.js` | Yalnızca `/office/` kapsamında sürümlü çevrimdışı önbellek |
| `tests/` | Simülasyon, kamera ve çevrimdışı çalışma testleri |

Çizimler kodla üretilir; üçüncü taraf sanat paketi, dış SDK, font CDN'i veya çalışma zamanında ücretli API kullanılmaz. Simülasyon, render ve DOM durumu birbirinden ayrıdır. Statik ofis zemini önbelleğe çizilir; dünya çizimi 30 FPS ile sınırlanır, cihaz piksel oranı en fazla 2'dir.

## Kontroller

Node.js 22 veya üzeri:

```sh
npm test
npm run check
```

32 otomatik test: kayıt geçişi, bozuk dosyalar, ekonomi, görev ataması, araştırma bağımlılıkları, ücret sınırları, günlük giderler, kararlar, ödüller, kamera / seçim koordinatları, sürümlü önbellek ve 25 oyun günü süren simülasyon.

Ayrıca 16 arayüz akışı DOM emülasyonunda kontrol edildi; gündüz, gece ve mobil ofis çizimi ekran dışında rasterleştirilerek incelendi. Bunlar gerçek tarayıcı düzeni veya fiziksel cihazdaki dokunma / ses testinin yerine geçmez. Bu oturumda etkileşimli tarayıcı testi yapılamadı.

## Sınırlar

Karakterler kurmaca, diyaloglar yazılmış içerik ve kurallara dayanır. Bir LLM çalıştırılmaz. Oyun içindeki bütçe sanal paradır. Ortak sunucu, hesap veya abonelik gerektirmez.
