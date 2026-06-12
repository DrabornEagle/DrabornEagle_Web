# DraBornDeal Admin Panel v0.23

Termux veya CX33 üzerinde çalışan hafif admin paneli, otomatik crawler worker ve DraBornBee site adaptörleri sistemidir.

## Özellikler

- Ürün linki ekleme
- Telegram mesaj önizleme
- Önizlemeden sonra Telegram’da paylaşma
- Panelden worker başlatma / durdurma
- Trendyol ve Hepsiburada özel kaynak adaptörleri
- Robots.txt ve sitemap keşfi
- Sitemap index ve `.xml.gz` desteği
- HTML / script / JSON içinden ürün URL çıkarma
- Ürün detayını çekip Supabase’e kaydetme
- Fırsatları Telegram’a otomatik gönderme
- Son 18 saatte paylaşılmış ürünü tekrar paylaşmama
- Hatalı ürün kayıtlarını silme
- Telegram gönderi kayıtlarını silme
- Bağlantı geçmişi kayıtlarını silme
- Basit istatistik paneli
- Kaynak bazlı ürün sayımı
- En sıcak 5 ürün listesi

## Admin panel Termux kurulum

```bash
cd ~/projects/DrabornEagle_Web
git pull
cd deal-admin
npm install
npm run dev
```

Panel adresi:

```text
http://127.0.0.1:8787/?v=022
```

Panelde `DraBornBee Worker Kontrol` kartından worker başlatılır.

## v0.23 kaynak adaptörleri

Panelden `Worker Başlat` dediğinde artık mevcut worker dosyası v0.23 adaptör mantığıyla çalışır.

Worker şunları yapar:

1. Trendyol ve Hepsiburada adaptörlerini çalıştırır.
2. Robots.txt ve sitemap adaylarını dener.
3. Sitemap index içinden alt sitemapleri takip eder.
4. `.xml.gz` sitemapleri açmayı dener.
5. HTML / script / JSON metinleri içinde ürün URL kalıplarını arar.
6. Ürün URL bulursa mevcut ürün detay fetcher hattına verir.
7. Supabase’e ürün ve snapshot kaydı atar.
8. Telegram kanalına otomatik gönderir.
9. Son 18 saatte paylaşılmış ürünü tekrar paylaşmaz.

Örnek `.env`:

```text
DKD_GATEWAY_INTERVAL_MINUTES=45
DKD_GATEWAY_SHARE_LIMIT=5
DKD_ADAPTER_SITEMAP_LIMIT=25
DKD_ADAPTER_PRODUCT_LIMIT=120
DKD_ADAPTER_TIMEOUT_MS=18000
```

## Manuel worker test komutu

Panel yerine Termux’tan elle test etmek istersen:

```bash
cd ~/projects/DrabornEagle_Web/deal-admin
node src/dkd_gateway_worker_v0_21.js
```

Dosya adı v0_21 olarak kalır ama içindeki worker logu `drabornbee_gateway_v0_23` yazar.

## Güvenlik

- Supabase service role key tarayıcıya verilmez.
- Service role key sadece server `.env` içinde kalır.
- API istekleri `DKD_ADMIN_PANEL_KEY` ile korunur.
- Crawler worker aynı `.env` değerlerini kullanır.
- Gateway sistemi rate-limit, timeout ve retry mantığıyla çalışır.
- CX33'e taşınırken aynı klasör ve `.env` mantığı kullanılabilir.
