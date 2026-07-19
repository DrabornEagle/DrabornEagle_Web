# API Anahtarları ve WhatsApp Cloud API Rehberi

Bu belge, DraBornTest’i demo modundan gerçek servislerle çalışan yapıya geçirmek için hazırlanmıştır. Özellikle Meta WhatsApp Cloud API kurulumu ekran ekran anlatılır.

> Meta panelindeki menü adları hesap türüne, ülkeye ve panel güncellemelerine göre küçük farklılıklar gösterebilir. “WhatsApp”, “API Setup”, “Getting Started”, “Configuration”, “Webhooks” ve “WhatsApp Manager” ifadelerini arayın.

## A. Önce güvenlik kuralı

API anahtarlarını şu dosyalara yazmayın:

- `config.js`
- `app.js`
- `api-client.js`
- `index.html`
- GitHub’a gönderilen başka bir frontend dosyası

Gizli bilgiler yalnızca sunucuda bulunan `.env` dosyasında tutulmalıdır. `.env`, `.gitignore` içinde olduğu için repoya gönderilmez.

Başlangıç:

```bash
cd DraBornTest
cp .env.example .env
```

## B. Meta WhatsApp Cloud API — ekran ekran kurulum

### 1. Meta Business hesabını hazırla

1. Tarayıcıdan `business.facebook.com` adresini aç.
2. Meta hesabınla giriş yap.
3. Sol üstteki işletme seçicisinden mevcut işletmeni seç veya yeni bir **Business Portfolio / İşletme Portföyü** oluştur.
4. İşletme adı, ad-soyad ve işletme e-postasını gir.
5. E-posta doğrulaması istenirse tamamla.

Gerçek ve yüksek hacimli kullanımda Meta işletme doğrulaması isteyebilir. **Business Settings / İşletme Ayarları → Security Center / Güvenlik Merkezi** bölümünde doğrulama durumunu kontrol et.

### 2. Meta Developer hesabını aç

1. `developers.facebook.com` adresini aç.
2. Sağ üstten **Get Started / Başla** seçeneğine bas.
3. Meta hesabını doğrula.
4. Telefon ve e-posta doğrulama adımları çıkarsa tamamla.
5. Kullanım şartlarını kabul et.

### 3. Yeni uygulama oluştur

1. Meta for Developers panelinde **My Apps / Uygulamalarım** bölümüne gir.
2. **Create App / Uygulama Oluştur** butonuna bas.
3. Kullanım senaryosu ekranında WhatsApp veya işletme mesajlaşmasına uygun seçeneği seç.
4. Uygulama türü sorulursa **Business / İşletme** seç.
5. Uygulama adı olarak örneğin `DraBornTest CRM` yaz.
6. İletişim e-postasını seç.
7. Bir önceki adımda oluşturduğun Business Portfolio’yu bağla.
8. **Create App** ile tamamla.

### 4. WhatsApp ürününü ekle

1. Uygulamanın dashboard ekranında ürünler bölümünü aç.
2. **WhatsApp** kartını bul.
3. **Set up / Kur** butonuna bas.
4. İstenirse bağlanacak Business Portfolio ve WhatsApp Business Account’u seç.
5. İlk kurulumda Meta bir test telefon numarası ve test WhatsApp Business Account oluşturabilir.

### 5. Test ekranındaki kimlikleri al

Uygulama menüsünden:

```text
WhatsApp → API Setup
```

veya:

```text
WhatsApp → Getting Started
```

bölümüne gir.

Bu ekranda genellikle şu bilgiler görünür:

- **Temporary access token / Geçici erişim tokenı**
- **Phone Number ID**
- **WhatsApp Business Account ID (WABA ID)**
- Meta’nın verdiği test telefon numarası
- Mesaj gönderilecek test alıcısını ekleme alanı

İlk test için geçici token kullanılabilir. Geçici token üretim/test içindir; kalıcı canlı sistem için sistem kullanıcısı tokenı oluşturulmalıdır.

`.env` dosyasına şimdilik şunları ekle:

```env
WHATSAPP_PROVIDER=meta
WHATSAPP_GRAPH_VERSION=v23.0
WHATSAPP_ACCESS_TOKEN=BURAYA_GECICI_TOKEN
WHATSAPP_PHONE_NUMBER_ID=BURAYA_PHONE_NUMBER_ID
WHATSAPP_BUSINESS_ACCOUNT_ID=BURAYA_WABA_ID
```

Graph API sürümü Meta panelinde farklı gösterilirse `.env` içindeki değeri panelde önerilen güncel sürümle değiştir.

### 6. Test alıcısı ekle ve ilk mesajı gönder

1. API Setup ekranında **To / Alıcı** alanını bul.
2. **Manage phone number list / Telefon numarası listesini yönet** seçeneğine bas.
3. Kendi WhatsApp numaranı ülke koduyla ekle.
4. WhatsApp’a gelen doğrulama kodunu Meta paneline gir.
5. Paneldeki örnek mesaj gönderme butonunu kullan.
6. Telefonuna Meta’nın örnek şablon mesajı geliyorsa temel bağlantı çalışıyor demektir.

### 7. Gerçek işletme telefonunu ekle

1. Meta Developer uygulamasında **WhatsApp → API Setup** veya **WhatsApp Manager → Phone numbers** bölümüne gir.
2. **Add phone number / Telefon numarası ekle** butonuna bas.
3. İşletme görünen adını yaz.
4. İşletme kategorisini seç.
5. Ülke ve telefon numarasını gir.
6. SMS veya sesli arama ile doğrulama yöntemini seç.
7. Gelen doğrulama kodunu gir.
8. Oluşan gerçek **Phone Number ID** değerini `.env` dosyasına yaz.

Öneri: İlk kurulumda yalnızca bu iş için ayrılmış bir telefon numarası kullan. Meta hesabında “coexistence / birlikte kullanım” seçeneği sunuluyorsa mevcut WhatsApp Business App numarasını bağlamak için paneldeki özel akışı takip et; bu seçenek her hesapta aynı görünmeyebilir.

### 8. Kalıcı erişim tokenı oluştur

Geçici token yerine sunucu tarafında uzun süre kullanılacak token oluşturmak için:

1. `business.facebook.com/settings` adresinden **Business Settings / İşletme Ayarları** ekranını aç.
2. Sol menüden **Users / Kullanıcılar → System Users / Sistem Kullanıcıları** bölümüne gir.
3. **Add / Ekle** butonuna bas.
4. Ad olarak örneğin `DraBornTest Server` yaz.
5. Rol olarak mümkünse yalnızca gerekli yetkileri verecek şekilde yönetici veya çalışan sistem kullanıcısı seç.
6. Sistem kullanıcısını aç ve **Add Assets / Varlık Ekle** butonuna bas.
7. Şu varlıkları ata:
   - Meta uygulaması (`DraBornTest CRM`)
   - WhatsApp Business Account
8. Mesajlaşma ve yönetim için gerekli yetkileri etkinleştir.
9. **Generate New Token / Yeni Token Oluştur** seçeneğine bas.
10. Uygulama olarak `DraBornTest CRM` seç.
11. Gerekli izinleri seç. Yaygın olarak gerekenler:
    - `whatsapp_business_messaging`
    - `whatsapp_business_management`
    - İş akışına göre Meta’nın panelde istediği ek işletme izni
12. Tokenı oluştur ve güvenli yere kopyala.
13. `.env` içindeki `WHATSAPP_ACCESS_TOKEN` değerini bu tokenla değiştir.

Tokenı ekran görüntüsü, mesaj veya GitHub dosyası olarak paylaşma.

### 9. Randevu hatırlatma şablonunu oluştur

DraBornTest sunucusu varsayılan olarak şu şablon adını bekler:

```text
appointment_reminder_tr
```

Oluşturmak için:

1. Meta Business Suite veya Business Settings içinde **WhatsApp Manager** ekranını aç.
2. İlgili WhatsApp Business Account’u seç.
3. **Account tools / Hesap araçları → Message templates / Mesaj şablonları** bölümüne gir.
4. **Create template / Şablon oluştur** butonuna bas.
5. Kategori olarak randevu hatırlatma için uygun **Utility / Yardımcı Program** kategorisini seç.
6. Şablon adı:

```text
appointment_reminder_tr
```

7. Dil olarak Türkçe’yi seç.
8. Gövde örneği:

```text
Merhaba {{1}}, {{2}} tarihinde saat {{3}} için {{4}} randevunuzu hatırlatırız. Değişiklik için bu mesaja yanıt verebilirsiniz.
```

9. Örnek değişken değerleri gir:
   - `{{1}}` → Elif Yılmaz
   - `{{2}}` → 21 Temmuz 2026
   - `{{3}}` → 14:30
   - `{{4}}` → Saç Boyama & Bakım
10. Şablonu incelemeye gönder.
11. Durum **Approved / Onaylandı** olduğunda gerçek gönderimde kullanılabilir.

Uygulamadaki diğer örnek şablon adları:

```text
appointment_confirmed_tr
appointment_followup_tr
birthday_offer_tr
```

Meta panelindeki şablon adı ile `mock-data.js` içindeki `metaName` değeri birebir aynı olmalıdır.

### 10. Webhook callback adresini hazırla

Meta webhookları yalnızca internetten erişilebilen HTTPS adresine gönderir. Yerel `localhost` adresi doğrudan kullanılamaz.

Canlı örnek:

```text
https://crm.senin-domainin.com/api/webhooks/whatsapp
```

`.env` dosyasında güçlü bir doğrulama tokenı üret:

```env
WHATSAPP_WEBHOOK_VERIFY_TOKEN=uzun-rastgele-bir-deger
WHATSAPP_APP_SECRET=META_UYGULAMA_SECRET
```

Uygulama secret değerini almak için:

1. Meta Developer dashboard’a dön.
2. **App Settings / Uygulama Ayarları → Basic / Temel** ekranını aç.
3. **App Secret** alanında **Show / Göster** seçeneğine bas.
4. Hesap şifreni doğrula.
5. Değeri yalnızca sunucu `.env` dosyasına ekle.

### 11. Webhook’u Meta paneline bağla

1. Meta Developer dashboard’da uygulamanı aç.
2. **WhatsApp → Configuration / Yapılandırma** bölümünü aç. Bazı panellerde ana menüde ayrıca **Webhooks** ürünü bulunur.
3. **Callback URL** alanına yaz:

```text
https://crm.senin-domainin.com/api/webhooks/whatsapp
```

4. **Verify token** alanına `.env` içindeki `WHATSAPP_WEBHOOK_VERIFY_TOKEN` değerini aynen yaz.
5. **Verify and save / Doğrula ve kaydet** butonuna bas.
6. Webhook alanları listesinden en az **messages** alanına abone ol.
7. WhatsApp Business Account’un uygulamaya abone edildiğini kontrol et.

DraBornTest sunucusu:

- GET isteğinde webhook doğrulamasını yapar.
- POST isteğinde mesaj durumlarını alır.
- `sent`, `delivered`, `read`, `failed` gibi durumları mesaj loguyla eşleştirmeye hazırdır.
- `WHATSAPP_APP_SECRET` tanımlıysa `x-hub-signature-256` imzasını doğrular.

### 12. DraBornTest’i gerçek API moduna geçir

`config.js` dosyasını aç:

```js
apiMode: 'api'
```

`.env` örneği:

```env
PORT=4173
APP_BASE_URL=https://crm.senin-domainin.com
DATA_PROVIDER=mock

WHATSAPP_PROVIDER=meta
WHATSAPP_GRAPH_VERSION=v23.0
WHATSAPP_ACCESS_TOKEN=GERCEK_SUNUCU_TOKENI
WHATSAPP_PHONE_NUMBER_ID=GERCEK_PHONE_NUMBER_ID
WHATSAPP_BUSINESS_ACCOUNT_ID=GERCEK_WABA_ID
WHATSAPP_WEBHOOK_VERIFY_TOKEN=UZUN_RASTGELE_DEGER
WHATSAPP_APP_SECRET=META_APP_SECRET
```

Sunucuyu yeniden başlat:

```bash
npm start
```

Entegrasyon kontrolü:

```bash
curl http://localhost:4173/api/integrations/status
```

Sağlık kontrolü:

```bash
curl http://localhost:4173/api/health
```

Dashboard’da:

```text
Ayarlar & Entegrasyon → WhatsApp Cloud API
```

kartının “Bağlı · meta” durumuna geçtiğini kontrol et.

### 13. Uygulama içinden gerçek test

1. Dashboard’u aç.
2. **WhatsApp & Mesajlar** bölümüne gir.
3. Telefon numarası sana ait bir test müşterisi oluştur.
4. Bu müşteri için randevu oluştur.
5. Randevu detayını aç.
6. **WhatsApp Hatırlat** butonuna bas.
7. Sunucu konsolunda hata olmadığını kontrol et.
8. Meta panelinde gönderim logunu kontrol et.
9. Telefonunda mesajın geldiğini doğrula.
10. Mesaj okununca webhook üzerinden durumun güncellenmesini kontrol et.

## C. Canlıya geçmeden önce kontrol listesi

- [ ] İşletme bilgileri gerçek ve doğrulanabilir
- [ ] Gerçek telefon numarası doğrulandı
- [ ] Kalıcı sunucu tokenı kullanılıyor
- [ ] Token GitHub’a gönderilmedi
- [ ] HTTPS alan adı çalışıyor
- [ ] Webhook doğrulandı
- [ ] `messages` webhook alanına abone olundu
- [ ] Randevu şablonu onaylandı
- [ ] Müşteriden WhatsApp iletişim izni alınıyor
- [ ] Pazarlama mesajlarında izin ve çıkış süreci var
- [ ] Başarısız gönderimler loglanıyor
- [ ] Meta ücretlendirme ve ödeme ayarları kontrol edildi
- [ ] Uygulama geliştirme modundan canlı kullanıma uygun moda alındı

## D. Gerçek veritabanı anahtarı

DraBornTest şu anda gerçek veritabanı kullanmaz. Gerçek sisteme geçerken iki öneri vardır.

### Seçenek 1 — PostgreSQL

Sunucu sağlayıcından bağlantı adresini al:

```env
DATABASE_URL=postgresql://kullanici:sifre@sunucu:5432/veritabani
DATA_PROVIDER=postgresql
```

Önerilen temel tablolar:

- tenants / businesses
- branches
- users
- roles
- customers
- customer_consents
- appointments
- services
- staff
- payments
- message_templates
- message_logs
- leads
- tasks
- products
- stock_movements
- audit_logs

Her işletmeye ait kayıtta `business_id` bulunmalıdır.

### Seçenek 2 — Supabase

1. `supabase.com` üzerinden proje oluştur.
2. Project Settings → API bölümünü aç.
3. Project URL değerini al.
4. Sunucu tarafı için Service Role Key değerini al.
5. `.env` dosyasına ekle:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUNUCU_TARAFI_ANAHTARI
DATA_PROVIDER=supabase
```

Service Role Key frontend’e kesinlikle verilmez.

## E. Google Calendar anahtarları

1. `console.cloud.google.com` üzerinden proje oluştur.
2. APIs & Services → Library ekranında Google Calendar API’yi etkinleştir.
3. OAuth consent screen ekranını yapılandır.
4. Credentials → Create Credentials → OAuth client ID seç.
5. Uygulama türü Web application seç.
6. Yetkili yönlendirme adresini ekle.
7. Client ID ve Client Secret değerlerini `.env` dosyasına yaz:

```env
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
```

Gerçek çift yönlü senkron için kullanıcı bazlı OAuth token saklama tablosu gerekir.

## F. Ödeme sağlayıcısı anahtarı

Demo `.env.example` dosyasında Stripe örneği bulunur:

```env
STRIPE_SECRET_KEY=
```

Türkiye’de kullanılacak gerçek sağlayıcı seçildiğinde aynı prensip uygulanır:

- Gizli anahtar yalnızca backend’de tutulur.
- Ödeme sonucu webhook ile doğrulanır.
- Frontend’den gelen “ödendi” bilgisine tek başına güvenilmez.
- Kapora ve iade kayıtları ayrı hareket olarak saklanır.

## G. Resmî kaynaklar

- Meta WhatsApp Cloud API başlangıç dokümantasyonu: `https://developers.facebook.com/docs/whatsapp/cloud-api/get-started`
- Meta’nın resmî WhatsApp Business Platform Postman koleksiyonu: `https://www.postman.com/meta/whatsapp-business-platform/overview/`
- Meta Business Suite / İşletme ayarları: `https://business.facebook.com/settings`
- Meta Developer uygulamaları: `https://developers.facebook.com/apps/`
