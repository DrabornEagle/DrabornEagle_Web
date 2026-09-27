# DraBornNews v0.1

DraBornNews, oyun ve teknoloji gündemini güvenilir RSS kaynaklarından toplayan, önem puanı veren, isteğe bağlı OpenAI özeti oluşturan ve seçilen önemli haberi X, Instagram, TikTok ve Telegram'a dağıtan otomatik haber sistemidir.

## Çalışma akışı

1. GitHub Actions her 30 dakikada bir kaynakları tarar.
2. Son 120 saatteki içerikler normalize edilir ve tekrar haberler elenir.
3. Kaynak güven puanı + tazelik + konu sinyalleri ile `Radar 1-100` puanı hesaplanır.
4. `OPENAI_API_KEY` varsa haber yalnızca RSS başlığı/özeti temel alınarak Türkçe ve özgün biçimde özetlenir. Anahtar yoksa kaynak özeti güvenli fallback olarak kullanılır.
5. `data/news.json` güncellenir; site veriyi doğrudan buradan okur.
6. En önemli haber için sosyal medya kartları hazırlanır.
7. Yapılandırılmış platformlarda paylaşım yapılır ve `data/social-state.json` tekrar paylaşımı engeller.

## Site

Varsayılan adres:

`https://www.draborneagle.com/DraBornNews/`

Ana sayfa; kategori filtreleri, arama, öne çıkan haber, kaynak bağlantısı, AI özet detayları ve Radar önem skorunu gösterir.

## GitHub Actions Secrets

Repository > Settings > Secrets and variables > Actions > Secrets alanına gerektiğinde şunları ekle:

- `OPENAI_API_KEY`
- `DRABORNNEWS_X_USER_ACCESS_TOKEN`
- `DRABORNNEWS_TELEGRAM_BOT_TOKEN`
- `DRABORNNEWS_TELEGRAM_CHAT_ID`
- `DRABORNNEWS_META_IG_USER_ID`
- `DRABORNNEWS_META_ACCESS_TOKEN`
- `DRABORNNEWS_TIKTOK_ACCESS_TOKEN`

## GitHub Actions Variables

İsteğe bağlı değişkenler:

- `DRABORNNEWS_SITE_URL` = `https://www.draborneagle.com/DraBornNews`
- `DRABORNNEWS_OPENAI_MODEL` = `gpt-6-luna`
- `DRABORNNEWS_MAX_NEW_ARTICLES` = `10`
- `DRABORNNEWS_SOCIAL_MIN_SCORE` = `72`
- `DRABORNNEWS_SOCIAL_COOLDOWN_MINUTES` = `120`
- `DRABORNNEWS_META_GRAPH_VERSION` = Meta uygulamanın kullandığı Graph API sürümü
- `DRABORNNEWS_TIKTOK_PRIVACY_LEVEL` = ör. `PUBLIC_TO_EVERYONE`

## Platform notları

- **X:** User access token'ın yazma yetkisi bulunmalı.
- **Telegram:** Bot hedef kanal/grupta mesaj ve medya gönderme yetkisine sahip olmalı.
- **Instagram:** Professional (Business/Creator) hesap, gerekli Meta izinleri ve dışarıdan erişilebilir görsel URL gerekir.
- **TikTok:** Content Posting API, `video.publish` izni ve kullanıcı yetkilendirmesi gerekir. TikTok denetlenmemiş API istemcilerinde Direct Post içeriğini özel görünürlükle sınırlandırabilir. `draborneagle.com/DraBornNews/social/tiktok-latest.png` yolu TikTok uygulamasında doğrulanmış URL/domain kapsamında olmalıdır.

## Editoryal güvenlik

- DraBornNews tam makale kopyalamaz; kısa özet + orijinal kaynak bağlantısı yayınlar.
- AI'ya yalnızca kaynak başlığı ve RSS özeti verilir; yeni gerçekler uydurmaması istenir.
- Kaynak bağlantısı her haberde korunur.
- Kaynaklardan biri erişilemezse o turda atlanır; tüm otomasyon durmaz.
- Sosyal medya dağıtımında varsayılan 120 dakikalık bekleme vardır; çok yüksek önem skorlu haberler daha hızlı geçebilir.

## Manuel çalıştırma

GitHub > Actions > **DraBornNews Radar v0.1** > **Run workflow**.

Yerelde:

```bash
cd DraBornNews
npm install
npm run update
node scripts/tiktok-card.mjs
npm run publish
```
