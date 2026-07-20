# DraBornNews Mimari ve Yol Haritası

## Ürün hedefi

DraBornNews klasik bir haber kopyalama sitesi değildir. Sistem farklı kaynaklarda yayımlanan aynı olayı bir araya getirir, doğrulanabilir bilgileri çıkarır, kaynaklar arasındaki ortak ve çelişkili noktaları gösterir ve kullanıcıya kısa, anlaşılır bir haber deneyimi sunar.

## Önerilen üretim hattı

```text
RSS / Resmî API / İzinli kaynak
        ↓
Kaynak ve yayın tarihi doğrulama
        ↓
Ana metin ve metadata çıkarma
        ↓
Kopya ve benzer haber tespiti
        ↓
Kişi, kurum, tarih ve sayı çıkarımı
        ↓
Çoklu kaynak karşılaştırması
        ↓
AI özet + başlık + neden önemli
        ↓
Güven sinyalleri ve uyarılar
        ↓
Editör onayı
        ↓
Web, mobil, bildirim ve sesli bülten
```

## Üretim teknolojileri

- Web: Next.js veya mevcut bağımsız web modülü yaklaşımının geliştirilmiş sürümü
- Mobil: Expo + React Native
- API: Node.js / NestJS
- İçerik işleme: Python FastAPI işçileri
- Veritabanı: PostgreSQL + pgvector
- Kuyruk: Redis + BullMQ
- Arama: Meilisearch veya Typesense
- Dosya: Cloudflare R2
- CDN ve güvenlik: Cloudflare

## Temel veri varlıkları

- `sources`: kaynak adı, alan adı, RSS/API adresi, dil, güven durumu
- `raw_articles`: kaynaktan gelen ham kayıt ve hash
- `stories`: aynı olaya ait birleştirilmiş ana haber
- `story_sources`: ana haber ile kaynak ilişkisi
- `article_versions`: düzeltme ve güncelleme geçmişi
- `categories` ve `tags`
- `users`, `follows`, `bookmarks`, `reading_history`
- `comments`, `reports`, `moderation_actions`
- `audio_briefs` ve `notifications`

## Güven skoru sinyalleri

Skor tek başına “doğru/yanlış” hükmü değildir. Kullanıcıya şeffaf sinyaller sunar:

- Birincil veya resmî kaynağın varlığı
- Bağımsız kaynak sayısı
- Kaynak çeşitliliği
- Tarih, kişi, kurum ve sayı tutarlılığı
- Kaynağın düzeltme geçmişi
- Aşırı iddialı başlık ile metin uyumsuzluğu
- Haber üzerindeki editör incelemesi

## Yol haritası

### v0.1 — Ürün demosu

- Haber akışı
- Kategori, arama ve kaydetme
- Haber ayrıntısı
- Güven skoru görselleştirmesi
- Sesli okuma
- Demo API

### v0.2 — Gerçek veri çekirdeği

- PostgreSQL şeması
- Kaynak yönetimi
- RSS toplayıcı
- Ham haber arşivi
- Editör onay paneli
- Kaynak bağlantısı ve düzeltme kaydı

### v0.3 — AI haber motoru

- Özet ve başlık üretimi
- Kategori ve etiket çıkarımı
- Benzer haber birleştirme
- Kaynaklar arası çelişki tespiti
- Günlük otomatik bülten

### v0.4 — Kullanıcı ve topluluk

- Hesaplar
- Kaynak ve kategori takibi
- Kişiselleştirilmiş akış
- Yorum, rapor ve moderasyon
- Puan, seviye ve rozet

### v1.0 — Web + Expo mobil

- Ortak API
- Push bildirimleri
- Çevrimdışı okuma
- Arka planda sesli haber
- Story formatı
- DraBornCreator ve DrabornEagle Launcher Hub entegrasyonu

## Hukuki ve editoryal ilkeler

- Tam metin ve görseller izinsiz kopyalanmaz.
- Öncelik RSS, resmî API ve izinli kaynaklardadır.
- Kaynak bağlantısı görünür şekilde gösterilir.
- AI ile oluşturulan özet açıkça işaretlenir.
- Düzeltmeler silinmez; değişiklik geçmişi tutulur.
- Şikâyet ve içerik kaldırma mekanizması bulunur.
- Kullanıcı davranış verileri için KVKK uyumlu aydınlatma ve tercih yönetimi uygulanır.
