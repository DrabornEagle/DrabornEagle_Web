# DraBornDeal Admin Panel v0.20

Termux veya CX33 üzerinde çalışan hafif admin paneli ve otomatik crawler worker sistemidir.

## Özellikler

- Ürün linki ekleme
- Telegram mesaj önizleme
- Önizlemeden sonra Telegram’da paylaşma
- Türkiye e-ticaret seed sayfalarını otomatik tarama
- Trendyol ve Hepsiburada ürün linki çıkarma
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

## v0.20 otomatik crawler worker

Panelden bağımsız çalışır. Ayrı Termux oturumunda açık kalır.

```bash
cd ~/projects/DrabornEagle_Web/deal-admin
node src/dkd_auto_crawler_worker_v0_20.js
```

Worker şunları yapar:

1. `DKD_CRAWL_SEED_URLS` içindeki Türkiye e-ticaret arama/kategori sayfalarını gezer.
2. Trendyol ve Hepsiburada ürün linklerini çıkarır.
3. Ürün detayını mevcut ürün fetcher ile çeker.
4. Supabase’e ürün ve snapshot kaydı atar.
5. Telegram caption oluşturur.
6. Telegram kanalına otomatik gönderir.
7. Son 18 saatte paylaşılmış ürünü tekrar paylaşmaz.
8. `DKD_AUTO_CRAWL_INTERVAL_MINUTES` süresi dolunca yeniden tarar.

Örnek `.env`:

```text
DKD_AUTO_CRAWL_INTERVAL_MINUTES=30
DKD_AUTO_CRAWL_SHARE_LIMIT=5
DKD_CRAWL_SEED_URLS=https://www.trendyol.com/sr?q=telefon,https://www.trendyol.com/sr?q=playstation,https://www.hepsiburada.com/ara?q=telefon,https://www.hepsiburada.com/ara?q=playstation
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
- CX33'e taşınırken aynı klasör ve `.env` mantığı kullanılabilir.
