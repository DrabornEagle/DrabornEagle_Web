# DraBornTest CRM

Küçük işletmeler için **landing page + CRM/randevu dashboard** yapısında hazırlanmış, gerçek müşteri verisi kullanmayan geniş kapsamlı demo SaaS web uygulaması.

Hedef sektörler:

- Kuaför ve berberler
- Güzellik salonları ve bakım merkezleri
- Özel ders veren eğitmenler ve kurs merkezleri
- Danışmanlık, stüdyo, klinik ve randevuyla çalışan diğer küçük işletmeler

## Hızlı başlatma

Node.js 20 veya üzeri yeterlidir. Harici paket kurulumu gerekmez.

```bash
cd DraBornTest
cp .env.example .env
npm start
```

Tarayıcıda:

```text
http://localhost:4173
```

Doğrudan statik test için `index.html` açılabilir; önerilen yöntem yerleşik Node sunucusudur.

## Demo davranışı

- Tüm müşteri, randevu, ödeme, ekip ve mesaj kayıtları örnektir.
- Frontend varsayılan olarak `config.js` içindeki `apiMode: "mock"` ayarıyla çalışır.
- Demo değişiklikleri tarayıcı `localStorage` alanında saklanır.
- Ayarlar ekranından JSON yedek indirilebilir, içe aktarılabilir ve demo veri sıfırlanabilir.
- WhatsApp mesajları gerçek gönderilmez; mesaj loguna “mock” kayıt eklenir.

## Gerçek API moduna geçiş

1. `config.js` içinde:

```js
apiMode: 'api'
```

2. `.env` dosyasında sağlayıcı ve anahtarları tanımla.
3. `npm start` ile sunucuyu yeniden başlat.
4. Gerçek veritabanı bağlanırken `server/index.js` içindeki bellek deposunu PostgreSQL, Supabase veya kendi REST servisinle değiştir.

> Gizli anahtarlar hiçbir zaman `config.js`, `app.js` veya başka bir tarayıcı dosyasına yazılmamalıdır.

## Hazır ekran ve modüller

### Landing page

- Modern SaaS açılış sayfası
- Sektörel kullanım alanları
- Özellik ve iş akışı bölümleri
- Demo fiyat paketleri
- SSS ve demo CTA alanları
- Mobil uyumlu tasarım

### Dashboard

- Genel bakış ve günlük operasyon özeti
- Haftalık takvim
- Randevu listesi ve durum yönetimi
- Müşteri CRM’i ve müşteri profili
- Potansiyel müşteri / satış kanbanı
- Görev ve takip kayıtları
- Hizmet, fiyat, süre ve paketler
- Ekip, vardiya, doluluk ve performans
- WhatsApp şablonları, kampanyalar ve mesaj logları
- Kasa, tahsilat, kapora ve açık bakiye
- Stok ve kritik ürün uyarıları
- Gelir, hizmet, ekip ve müşteri raporları
- İşletme, modül, veri ve entegrasyon ayarları

### Çalışan demo işlemleri

- Yeni müşteri oluşturma
- Yeni randevu oluşturma
- Randevu durumunu değiştirme
- WhatsApp hatırlatma simülasyonu
- CRM fırsatını sonraki aşamaya taşıma
- Görev tamamlama
- Müşteri arama
- JSON dışa aktarma / içe aktarma
- Demo veriyi sıfırlama

## API uç noktaları

| Yöntem | Adres | Açıklama |
|---|---|---|
| GET | `/api/health` | Sunucu sağlık kontrolü |
| GET | `/api/bootstrap` | Tüm başlangıç verisi |
| PUT | `/api/state` | Demo durumunu toplu güncelleme |
| POST | `/api/reset-demo` | Demo verisini sıfırlama |
| POST | `/api/customers` | Müşteri oluşturma |
| POST | `/api/appointments` | Randevu oluşturma |
| PATCH | `/api/appointments/:id` | Randevu güncelleme |
| POST | `/api/leads` | CRM fırsatı oluşturma |
| PATCH | `/api/leads/:id` | CRM fırsatı güncelleme |
| POST | `/api/whatsapp/send` | Mock veya Meta üzerinden mesaj gönderme |
| GET/POST | `/api/webhooks/whatsapp` | Meta webhook doğrulama ve olay alma |
| GET | `/api/integrations/status` | Entegrasyon yapılandırma durumu |

## Klasör yapısı

```text
DraBornTest/
├── index.html
├── styles.css
├── app.js
├── api-client.js
├── mock-data.js
├── config.js
├── package.json
├── .env.example
├── server/
│   └── index.js
└── docs/
    ├── SISTEM-OZETI.md
    └── API-ANAHTARLARI-VE-WHATSAPP-REHBERI.md
```

## Dokümantasyon

- [Sistem özeti](./docs/SISTEM-OZETI.md)
- [API anahtarları ve WhatsApp Cloud API ekran ekran rehberi](./docs/API-ANAHTARLARI-VE-WHATSAPP-REHBERI.md)
