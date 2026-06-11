# DraBornDeal / Fırsat Radarı Worker v0.2

Bu klasör Hetzner CX33 üzerinde çalışacak DraBornDeal worker iskeletidir.

## v0.2 amacı

- Supabase bağlantısını kurmak
- Job queue ve manuel ürün linki kuyruğunu okumak
- Dry-run modunda güvenli test yapmak
- Kaynak discovery scraping'i kapalı tutmak
- v0.3 parser aşamasına zemin hazırlamak

## Güvenli varsayılanlar

```env
DKD_WORKER_DRY_RUN=true
DKD_ENABLE_SOURCE_DISCOVERY=false
DKD_ENABLE_WATCH_LINKS=true
DKD_ENABLE_TELEGRAM=false
```

Bu ayarlarla worker siteye otomatik istek atmaz. Sadece Supabase'deki bekleyen işleri okur ve JSON log üretir.

## CX33 kurulum özeti

```bash
cd ~/DrabornEagle_Web/deal-worker
npm install
cp .env.example .env
nano .env
npm run dev
```

Gerçek sunucuda `.env` içine Supabase service role key yazılmalıdır. Bu anahtar GitHub'a koyulmaz.

## v0.3 hedefi

- `dkd_deal_watch_links` içindeki manuel ürün linkini parse etmek
- Ürünü `dkd_deal_products` tablosuna yazmak
- Snapshot oluşturmak
- Telegram draft post üretmek
