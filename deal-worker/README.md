# DraBornDeal / Fırsat Radarı Worker v0.7

Bu klasör Hetzner CX33 üzerinde çalışacak DraBornDeal worker iskeletidir.

## Mevcut yetenekler

- Supabase bağlantısı
- Manuel ürün linki kuyruğu okuma
- Ürün parser altyapısı
- Telegram draft post kuyruğu okuma
- Tek kanal Telegram gönderimi
- Dry-run modunda güvenli test
- Kaynak discovery scraping kapalı varsayılan

## Güvenli varsayılanlar

```env
DKD_WORKER_DRY_RUN=true
DKD_ENABLE_SOURCE_DISCOVERY=false
DKD_ENABLE_WATCH_LINKS=true
DKD_ENABLE_TELEGRAM=false
```

Bu ayarlarla worker siteye otomatik istek atmaz ve Telegram'a mesaj göndermez. Sadece Supabase'deki bekleyen işleri okur ve JSON log üretir.

## Telegram tek kanal modu

Aynı Telegram kanalını hem ana fırsatlar hem sıcak fırsatlar için kullanabilirsin:

```env
DKD_TELEGRAM_CHAT_ID_TR_MAIN=-100xxxxxxxxxx
DKD_TELEGRAM_CHAT_ID_TR_HOT=-100xxxxxxxxxx
```

Canlı gönderim için:

```env
DKD_ENABLE_TELEGRAM=true
DKD_WORKER_DRY_RUN=false
```

## CX33 kurulum özeti

```bash
cd ~/DrabornEagle_Web/deal-worker
npm install
cp .env.example .env
nano .env
npm run dev
```

Gerçek sunucuda `.env` içine Supabase service role key ve Telegram token yazılmalıdır. Bu anahtarlar GitHub'a koyulmaz.

## Çalışma mantığı

1. `dkd_deal_social_posts` içinde `draft` Telegram postları aranır.
2. Kanal aktifse ve `.env` içinde Telegram açık ise mesaj gönderilir.
3. Başarılıysa post `published` olur.
4. Hata olursa post `failed` olur ve hata sebebi `dkd_metrics` içine yazılır.
