# DraBornTest CRM — Sistem Özeti

## 1. Ürünün amacı

DraBornTest, randevuyla çalışan küçük işletmelerin günlük operasyonunu tek panelde toplamak için hazırlanmış demo SaaS ürünüdür. Tasarım, bir kuaförün veya güzellik salonunun doğrudan kullanabileceği kadar pratik; özel ders, danışmanlık ve benzeri sektörlere uyarlanabilecek kadar esnektir.

Bu sürüm test amaçlıdır. Gerçek veritabanı, gerçek ödeme sağlayıcısı veya gerçek WhatsApp hesabı bağlı değildir.

## 2. Uygulamanın iki ana bölümü

### Landing page

Ürünü tanıtan halka açık alandır. Özellikleri, sektörleri, çalışma biçimini, demo paketlerini ve sık sorulan soruları gösterir. “Canlı Demoyu Aç” butonu dashboard’a geçer.

### Dashboard

İşletme sahibinin veya yetkili personelin operasyon panelidir. Sol menüden modüller arasında geçiş yapılır.

## 3. Dashboard modülleri

### Genel Bakış

- Bugünkü tahsilat
- Günlük ve aylık randevu sayıları
- Aktif müşteri sayısı
- Gelir grafiği
- Bugünün randevu akışı
- Yapılacak görevler
- Müşteri segmentleri
- Hızlı işlemler
- İşletmeye özel akıllı öneriler

### Takvim

- Haftalık ekip takvimi
- Saatlik randevu blokları
- Uzman rengine göre randevu ayrımı
- Randevu detay penceresi
- Durum güncelleme

### Randevular

- Bekleyen, onaylanan, işlemde, tamamlanan, iptal ve gelmedi filtreleri
- Müşteri, hizmet, uzman, kanal ve ödeme bilgisi
- Ön ödeme ve kalan tutar
- WhatsApp hatırlatma durumu
- Randevu oluşturma
- Durum akışı güncelleme

### Müşteri CRM’i

- Müşteri kartı
- Telefon ve e-posta
- Etiket ve segmentler
- Tercih edilen uzman
- Kaynak kanalı
- Toplam ziyaret ve toplam harcama
- Son ve sonraki ziyaret
- Açık bakiye
- KVKK/iletişim izni
- Notlar, alerji ve tercih bilgileri
- Paket ve üyelik hakkı
- Randevu geçmişi
- Hızlı arama

### CRM & Satış

- Instagram, Google, web, tavsiye ve telefon kaynaklı potansiyel müşteriler
- Yeni → İletişimde → Teklif → Kazanıldı aşamaları
- Potansiyel satış değeri
- Sonraki takip tarihi
- Sorumlu ekip üyesi
- Takip görevleri

### Hizmetler & Paketler

- Hizmet kategorisi
- Hizmet adı
- Süre
- Fiyat
- KDV oranı
- Aktif/pasif durumu
- Hizmetten doğrudan randevu oluşturma
- Seans paketleri ve kalan haklar

### Ekip & Vardiya

- Personel profili
- Rol
- Hizmet yetkileri
- Çalışma saatleri
- İzin günleri
- Doluluk oranı
- Aylık gelir katkısı
- Puan ve performans
- Komisyon alanı için hazırlık

### WhatsApp & Mesajlar

- Randevu onay şablonu
- Randevu hatırlatma şablonu
- İptal sonrası takip
- Doğum günü kampanyası
- Meta şablon durumları
- Mesaj gönderim logları
- Gönderildi, teslim edildi ve okundu durumları
- Segment bazlı kampanyalar
- Mock mesaj gönderimi
- Meta Cloud API’ye geçiş altyapısı

### Stok & Ürün

- Ürün adı ve SKU
- Mevcut miktar
- Minimum stok seviyesi
- Kritik stok uyarısı
- Maliyet
- Perakende satış fiyatı
- Tahmini stok değeri

### Kasa & Ödemeler

- Günlük ve aylık tahsilat
- Ön ödeme / kapora
- Kısmi ödeme
- Açık bakiye
- Kart, nakit ve havale kırılımı
- Aylık gelir hedefi
- Son tahsilat listesi

### Raporlar

- Gelir trendi
- Doluluk oranı
- Tekrar ziyaret oranı
- Gelmedi oranı
- Ekip performansı
- En çok satan hizmetler
- Müşteri edinme kaynakları

### Ayarlar & Entegrasyon

- İşletme profili
- Sektör
- Şube
- Çalışma saatleri
- Randevu kuralları
- Roller ve yetkiler için hazırlık
- WhatsApp, veritabanı, takvim ve ödeme bağlantıları
- JSON yedekleme
- Demo verisini sıfırlama
- Gelecekte açılabilecek SaaS modülleri

## 4. Demo verisinin çalışma şekli

Frontend, `config.js` içinde varsayılan olarak `apiMode: "mock"` ayarıyla açılır. Veriler `mock-data.js` dosyasından alınır ve tarayıcıdaki `localStorage` alanına yazılır.

Bu nedenle:

- Sayfayı yenileyince demo değişiklikleri korunur.
- Başka tarayıcı veya cihazda aynı kayıtlar görünmez.
- “Demo Veriyi Sıfırla” butonu ilk örnek duruma döner.
- JSON yedekleme ile test verisi taşınabilir.

## 5. Sunucu yapısı

`server/index.js`, yalnızca Node.js yerleşik modüllerini kullanır. Ek paket yüklenmez.

Sunucu görevleri:

- Statik dosyaları servis etmek
- Demo REST API uç noktalarını sağlamak
- Entegrasyon durumunu bildirmek
- Meta WhatsApp Cloud API mesajlarını sunucu tarafında göndermek
- Meta webhook doğrulamasını yapmak
- Gönderim durumlarını webhook üzerinden güncellemek

## 6. Gerçek SaaS sürümüne geçiş planı

### Veri katmanı

Bellek ve localStorage yerine:

- PostgreSQL
- Supabase
- Firebase
- MongoDB
- Özel REST/GraphQL API

kullanılabilir. Frontend servis katmanı `api-client.js` dosyasında ayrılmıştır.

### Kimlik doğrulama

Gerçek sürümde şu roller önerilir:

- Platform Admin
- İşletme Sahibi
- Şube Yöneticisi
- Personel / Uzman
- Resepsiyon
- Muhasebe
- Salt okunur rapor kullanıcısı

### Multi-tenant SaaS

Her tablo veya kayıt `tenant_id / business_id` ile ayrılmalıdır. Kullanıcının yalnızca yetkili olduğu işletmenin verisini görmesi veritabanı ve API seviyesinde zorunlu olmalıdır.

### Güvenlik

- API anahtarları yalnızca sunucuda tutulmalı
- HTTPS zorunlu olmalı
- Webhook imzaları doğrulanmalı
- Yetkilendirme her API isteğinde kontrol edilmeli
- Audit log değiştirilemez şekilde saklanmalı
- KVKK izin zamanı ve kaynağı kayıt altına alınmalı
- Toplu mesajlarda açık rıza ve çıkış mekanizması uygulanmalı

## 7. Çalıştırma

```bash
cd DraBornTest
cp .env.example .env
npm start
```

Adres:

```text
http://localhost:4173
```
