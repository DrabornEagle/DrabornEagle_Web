# DraBornDeal Admin Panel v0.34

DraBornDeal genel fırsat radarı projesidir. DraBornBee ise bu projenin worker / veri çekme / crawler motorudur.

## İsim standardı

- Genel proje adı: DraBornDeal
- Admin panel: DraBornDeal Admin Panel
- Telegram sistemi: DraBornDeal Telegram Fırsat Sistemi
- Tıklanma takibi: DraBornDeal Click Tracking
- Worker / veri çekme motoru: DraBornBee
- Hepsiburada modülü: DraBornBee Hepsiburada Adaptörü
- Trendyol modülü: DraBornBee Trendyol Adaptörü

## Güncel çalışma komutu

```bash
cd ~/projects/DrabornEagle_Web
git pull
cd deal-admin
npm install
npm run dev
```

Panel adresi:

```text
http://127.0.0.1:8787/?v=034
```

Panelde `DraBornBee Worker Kontrol` kartından worker başlatılır.

## Güncel sürüm çizgisi

- DraBornDeal Admin: v0.34
- DraBornBee worker motoru: v0.34
- DraBornDeal click tracking wrapper: v0.34
- DraBornBee bağımsız servis klasörü: `deal-drabornbee`

## DraBornBee sunucu modülü

Sunucu alındığında Trendyol gibi Termux üzerinden zorlanan kaynaklar için DraBornBee çalıştırılır:

```bash
cd ~/projects/DrabornEagle_Web/deal-drabornbee
npm install
npx playwright install chromium
npm start
```

DraBornDeal admin `.env` bağlantısı:

```text
DKD_DRABORNBEE_URL=http://127.0.0.1:8790
DKD_DRABORNBEE_KEY=senin-gizli-keyin
```

## Güvenlik

- Supabase service role key tarayıcıya verilmez.
- Service role key sadece server `.env` içinde kalır.
- API istekleri `DKD_ADMIN_PANEL_KEY` ile korunur.
- DraBornBee ayrı key ile korunur.
- Click tracking sunucu yönlendirmesi hazır olana kadar kapalı kalır.
