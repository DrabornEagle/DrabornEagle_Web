# DraBornDeal Admin Panel v0.21

Termux veya CX33 üzerinde çalışan hafif admin paneli, otomatik crawler worker ve DraBornBee fetch gateway sistemidir.

## Özellikler

- Ürün linki ekleme
- Telegram mesaj önizleme
- Önizlemeden sonra Telegram’da paylaşma
- DraBornBee fetch gateway katmanı
- Robots.txt ve sitemap keşfi
- Türkiye e-ticaret kaynaklarından ürün linki çıkarma
- Trendyol ve Hepsiburada ürün linki normalize etme
- Ürün detayını çekip Supabase’e kaydetme
- Fırsatları Telegram’a otomatik gönderme
- Son 18 saatte paylaşılmış ürünü tekrar paylaşmama
- Hatalı ürün kayıtlarını silme
- Telegram gönderi kayıtlarını silme
- Bağlantı geçmişi kayıtlarını silme
- Basit istatistik paneli
- Kaynak bazlı ürün sayımı
- En sıcak 5 ürün listesi
- Watch link kuyruğu görüntüleme
- Çekilen ürünleri görüntüleme
- Sıcak fırsat feed görüntüleme
- Telegram gönderi geçmişi görüntüleme
- Kaynak ve affiliate kuralı görüntüleme

## Admin panel Termux kurulum

```bash
cd ~/projects/DrabornEagle_Web
git pull
cd deal-admin
npm install
cp .env.example .env
nano .env
npm run dev
```

`.env` içinde `DKD_ADMIN_PANEL_KEY`, `DKD_SUPABASE_URL`, `DKD_SUPABASE_SERVICE_ROLE_KEY` ve `DKD_TELEGRAM_BOT_TOKEN` değerlerini kontrol et.

Panel adresi:

```text
http://127.0.0.1:8787
```

Android tarayıcıdan aç.

## v0.21 DraBornBee gateway worker

Bu worker, ScrapingBee benzeri yerel fetch gateway mantığıdır. Panelden bağımsız çalışır. Ayrı Termux oturumunda açık kalır.

```bash
cd ~/projects/DrabornEagle_Web/deal-admin
node src/dkd_gateway_worker_v0_21.js
```

Worker şunları yapar:

1. `DKD_GATEWAY_SOURCE_HOMES` içindeki kaynak ana domainlerini alır.
2. Robots.txt ve sitemap adaylarını dener.
3. Sitemap içinden ürün URL adaylarını çıkarır.
4. Trendyol ve Hepsiburada ürün URL’lerini normalize eder.
5. Ürün detayını mevcut fetcher ile çeker.
6. Supabase’e ürün ve snapshot kaydı atar.
7. Telegram caption oluşturur.
8. Telegram kanalına otomatik gönderir.
9. Son 18 saatte paylaşılmış ürünü tekrar paylaşmaz.
10. `DKD_GATEWAY_INTERVAL_MINUTES` süresi dolunca yeniden çalışır.

Örnek `.env`:

```text
DKD_GATEWAY_INTERVAL_MINUTES=45
DKD_GATEWAY_SHARE_LIMIT=5
DKD_GATEWAY_SOURCE_HOMES=https://www.trendyol.com,https://www.hepsiburada.com
DKD_GATEWAY_SITEMAP_LIMIT=10
DKD_GATEWAY_PRODUCT_LIMIT=80
DKD_GATEWAY_TIMEOUT_MS=16000
DKD_GATEWAY_RETRIES=2
```

## v0.20 eski sayfa crawler worker

Arama/kategori HTML sayfalarını dener. JavaScript ile boş dönen sayfalarda yetersiz kalabilir. v0.21 gateway worker daha doğru başlangıçtır.

```bash
cd ~/projects/DrabornEagle_Web/deal-admin
node src/dkd_auto_crawler_worker_v0_20.js
```

## v0.15 Telegram önizleme akışı

1. Ürünün tam bağlantısını yapıştır.
2. `Önizleme Oluştur` butonuna bas.
3. Panel ürün görselini, Telegram caption metnini, karakter limitini ve son bağlantıyı gösterir.
4. Mesaj doğruysa `Telegram’da Paylaş` butonuna bas.

## v0.16 temizlik akışı

- Ürün kartında `Sil` butonu ürün kaydını, ona bağlı snapshot kayıtlarını ve sosyal gönderi kayıtlarını temizler.
- Telegram gönderileri bölümünde `Gönderi Kaydını Sil` sadece veritabanı kaydını siler; kanal içindeki gerçek Telegram mesajı ayrıca Telegram’dan elle silinmelidir.
- Bağlantı geçmişinde `Link Geçmişini Sil` yanlış/test link kayıtlarını temizler.
- Her silme işleminden önce tarayıcı onay penceresi çıkar.

## v0.17 istatistik akışı

- `İstatistikler` bölümü panel açılınca açık gelir.
- Toplam ürün, bugün güncellenen ürün, yayınlanan Telegram gönderisi, bugünkü Telegram gönderisi, bekleyen link ve aktif kaynak sayısı gösterilir.
- Kaynak bazlı ürün dağılımı ve en sıcak 5 ürün listesi aynı bölümde görünür.

## Güvenlik

- Supabase service role key tarayıcıya verilmez.
- Service role key sadece server `.env` içinde kalır.
- API istekleri `DKD_ADMIN_PANEL_KEY` ile korunur.
- Crawler worker aynı `.env` değerlerini kullanır.
- Gateway sistemi rate-limit, timeout ve retry mantığıyla çalışır.
- CX33'e taşınırken aynı klasör ve `.env` mantığı kullanılabilir.
