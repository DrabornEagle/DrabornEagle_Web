# DraBornDeal Worker — Termux Test Modu

CX33 almadan önce worker'ı telefondaki Termux üzerinden test etmek için kullanılır.

## 1. Termux paketleri

```bash
pkg update -y
pkg install -y git nodejs-lts nano
```

Kontrol:

```bash
node -v
npm -v
```

## 2. Repo kurulumu

```bash
cd ~
git clone https://github.com/DrabornEagle/DrabornEagle_Web.git
cd DrabornEagle_Web/deal-worker
npm install
```

Eğer repo zaten varsa:

```bash
cd ~/DrabornEagle_Web
git pull
cd deal-worker
npm install
```

## 3. .env oluştur

```bash
cp .env.example .env
nano .env
```

İlk güvenli test:

```env
DKD_WORKER_KEY=dkd-termux-main-01
DKD_WORKER_DRY_RUN=true
DKD_WORKER_LOOP=false
DKD_ENABLE_SOURCE_DISCOVERY=false
DKD_ENABLE_WATCH_LINKS=true
DKD_ENABLE_TELEGRAM_DRAFT_GENERATION=true
DKD_ENABLE_TELEGRAM=false
```

Bu modda ürün linkleri ve draft üretimi okunur; Telegram'a gönderim yapılmaz.

## 4. İlk test

```bash
npm run dev
```

Beklenen loglar:

```text
dkd_worker_started
dkd_worker_run_once_started
dkd_source_discovery_disabled
dkd_watch_links_loaded
dkd_telegram_drafts_generated
dkd_telegram_disabled
dkd_worker_run_once_finished
```

## 5. Telegram dry-run

```env
DKD_ENABLE_TELEGRAM=true
DKD_WORKER_DRY_RUN=true
```

Bu modda draft postlar görülür ama gönderilmez.

## 6. Telegram canlı test

Sadece draft post hazırsa kullan:

```env
DKD_ENABLE_TELEGRAM=true
DKD_WORKER_DRY_RUN=false
```

Sonra:

```bash
npm run dev
```

Başarılıysa `dkd_deal_social_posts` kaydı `published` olur.

## 7. Sürekli loop, sadece test için

Telefon açıkken belirli aralıkla çalışsın istersen:

```env
DKD_WORKER_LOOP=true
DKD_WORKER_POLL_SECONDS=60
```

Sonra:

```bash
npm run dev
```

Termux kapanırsa worker durur. 7/24 için daha sonra CX33 kullanılacak.
