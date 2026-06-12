# DraBornDeal Admin Panel v0.15

Termux veya CX33 üzerinde çalışan hafif admin paneldir.

## Özellikler

- Ürün linki ekleme
- Telegram mesaj önizleme
- Önizlemeden sonra Telegram’da paylaşma
- Kayıtlı ürünleri tekrar paylaşma
- Watch link kuyruğu görüntüleme
- Çekilen ürünleri görüntüleme
- Sıcak fırsat feed görüntüleme
- Telegram gönderi geçmişi görüntüleme
- Kaynak ve affiliate kuralı görüntüleme

## Termux kurulum

```bash
cd ~/projects/DrabornEagle_Web
git pull
cd deal-admin
npm install
cp .env.example .env
nano .env
npm run dev
```

`.env` içinde `DKD_ADMIN_PANEL_KEY`, `DKD_SUPABASE_URL`, `DKD_SUPABASE_SERVICE_ROLE_KEY` ve Telegram paylaşımı için `DKD_TELEGRAM_BOT_TOKEN` değerlerini kontrol et.

Panel adresi:

```text
http://127.0.0.1:8787
```

Android tarayıcıdan aç.

## v0.15 Telegram önizleme akışı

1. Ürünün tam bağlantısını yapıştır.
2. `Önizleme Oluştur` butonuna bas.
3. Panel ürün görselini, Telegram caption metnini, karakter limitini ve son bağlantıyı gösterir.
4. Mesaj doğruysa `Telegram’da Paylaş` butonuna bas.

## Güvenlik

- Supabase service role key tarayıcıya verilmez.
- Service role key sadece server `.env` içinde kalır.
- API istekleri `DKD_ADMIN_PANEL_KEY` ile korunur.
- CX33'e taşınırken aynı klasör ve `.env` mantığı kullanılabilir.
