# DraBornNews Web

DraBornNews; oyun, teknoloji, yapay zekâ, film-dizi, otomobil-motosiklet ve gündem haberlerini **çoklu kaynak karşılaştırması, kısa özet, neden önemli açıklaması, güven skoru ve sesli okuma** yaklaşımıyla sunmak üzere hazırlanan web modülüdür.

Bu klasördeki **v0.1**, gerçek kaynaklara bağlanmadan çalışan ürün demosudur. Amaç önce kullanıcı deneyimini ve sistem mimarisini doğrulamak, ardından RSS/API toplama ve yapay zekâ işleme hattını eklemektir.

## Çalıştırma

Node.js 20 veya üzeri yeterlidir. Harici paket kurulumu gerekmez.

```bash
cd DraBornNews
cp .env.example .env
npm start
```

Tarayıcıdan:

```text
http://localhost:4180
```

## v0.1 hazır özellikleri

- Mobil ve masaüstü uyumlu modern haber akışı
- Oyun, teknoloji, yapay zekâ, film-dizi, otomobil-motosiklet ve gündem kategorileri
- Haber ve kaynak araması
- Kart ve kompakt görünüm
- Çoklu kaynak ve güven skoru gösterimi
- “Neden önemli?” açıklaması
- Haber ayrıntı penceresi
- Tarayıcı TTS sistemiyle Türkçe sesli okuma
- Haber kaydetme ve `localStorage` okuma listesi
- Günlük sesli bülten demosu
- Kaynak güven modeli açıklaması
- Bağımlılıksız Node.js statik sunucu
- Demo REST API uç noktaları

## API uç noktaları

| Yöntem | Adres | Açıklama |
|---|---|---|
| GET | `/api/health` | Sunucu sağlık kontrolü |
| GET | `/api/bootstrap` | Tüm demo başlangıç verisi |
| GET | `/api/articles` | Haber listesi; `category` ve `q` filtrelerini destekler |
| GET | `/api/articles/:id` | Tek haber ayrıntısı |
| GET | `/api/sources` | Demo kaynak listesi ve haber sayıları |

## Klasör yapısı

```text
DraBornNews/
├── index.html
├── styles.css
├── app.js
├── mock-data.js
├── package.json
├── .env.example
├── server/
│   └── index.js
└── docs/
    └── MIMARI-VE-YOL-HARITASI.md
```

## Önemli sınır

Demo haberleri örnek amaçlıdır. Gerçek sürümde bir sitenin yazısı veya görseli kopyalanmayacak; RSS, resmî API ve izinli kaynaklardan alınan bilgiler özgün biçimde özetlenecek, her içerikte kaynak bağlantısı ve düzeltme geçmişi gösterilecektir.

## Sonraki teknik aşama

1. PostgreSQL veri modeli
2. Kaynak yönetim paneli
3. RSS ve resmî API toplayıcıları
4. Tekrarlanan haberleri birleştirme
5. AI özetleme, kategori ve etiket üretimi
6. Editör onay kuyruğu
7. Gerçek kaynak bağlantıları ve düzeltme geçmişi
8. Kullanıcı hesabı, yorum ve kişiselleştirilmiş akış
9. Expo mobil uygulamasıyla aynı API üzerinde senkron çalışma

Detaylı plan için [Mimari ve Yol Haritası](./docs/MIMARI-VE-YOL-HARITASI.md) dosyasına bakın.
