# DraBornDeal Admin Panel v0.8

Termux veya CX33 üzerinde çalışan hafif admin paneldir.

## Özellikler

- Ürün linki ekleme
- Watch link kuyruğu görüntüleme
- Çekilen ürünleri görüntüleme
- Sıcak fırsat feed görüntüleme
- Telegram post kuyruğu görüntüleme
- Telegram draft üretme

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

`.env` içinde `DKD_ADMIN_PANEL_KEY` değerini kendi lokal anahtarınla değiştir.

Panel adresi:

```text
http://127.0.0.1:8787
```

Android tarayıcıdan aç.

## Güvenlik

- Supabase service role key tarayıcıya verilmez.
- Service role key sadece server `.env` içinde kalır.
- API istekleri `DKD_ADMIN_PANEL_KEY` ile korunur.
- CX33'e taşınırken aynı klasör ve `.env` mantığı kullanılabilir.
