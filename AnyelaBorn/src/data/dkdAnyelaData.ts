export const dkdRoutes = [
  { dkdKey: 'home', dkdLabel: 'Ana Sayfa', dkdIcon: '✦', dkdPath: '/AnyelaBorn/' },
  { dkdKey: 'chat', dkdLabel: 'Sohbet', dkdIcon: '💬', dkdPath: '/AnyelaBorn/chat/' },
  { dkdKey: 'voice', dkdLabel: 'Ses', dkdIcon: '🎙️', dkdPath: '/AnyelaBorn/voice/' },
  { dkdKey: 'packages', dkdLabel: 'Paketler', dkdIcon: '◈', dkdPath: '/AnyelaBorn/packages/' },
  { dkdKey: 'ads', dkdLabel: 'Reklam', dkdIcon: '📣', dkdPath: '/AnyelaBorn/ads/' },
  { dkdKey: 'faq', dkdLabel: 'SSS', dkdIcon: '؟', dkdPath: '/AnyelaBorn/faq/' }
] as const;

export const dkdPackages = [
  { dkdGroup: 'fan', dkdTitle: 'Anyela Intro', dkdTag: 'Başlangıç', dkdPrice: '149 TL', dkdDesc: '10 dakika yazılı tanışma sohbeti.', dkdFeatures: ['10 dk yazılı sohbet', 'Sade ve hızlı başlangıç', 'Ödeme sonrası manuel onay'], dkdSlug: 'intro' },
  { dkdGroup: 'fan', dkdTitle: 'Private Chat', dkdTag: 'Popüler', dkdPrice: '499 TL', dkdDesc: '30 dakika özel yazılı sohbet.', dkdFeatures: ['30 dk özel sohbet', 'Öncelikli dönüş', 'Ekstra içerik isteği açılabilir'], dkdSlug: 'private-chat' },
  { dkdGroup: 'fan', dkdTitle: 'Voice Message', dkdTag: 'Ses', dkdPrice: '249 TL', dkdDesc: 'Anyela’dan 1 kişiye özel sesli mesaj.', dkdFeatures: ['Kısa kişisel sesli cevap', 'Ad ile hitap opsiyonu', 'Teslim: manuel onay sonrası'], dkdSlug: 'voice-message' },
  { dkdGroup: 'fan', dkdTitle: 'Voice Chat Private', dkdTag: 'Premium', dkdPrice: '999 TL', dkdDesc: '30 dakika sesli mesajlaşma penceresi.', dkdFeatures: ['Sesli mesaj gönderme', 'Anyela sesiyle cevap', 'WhatsApp sesli not mantığı'], dkdSlug: 'voice-chat-private' },
  { dkdGroup: 'custom', dkdTitle: 'Style Try-On', dkdTag: 'Görsel', dkdPrice: '399 TL', dkdDesc: 'Kıyafet referansından 2 özel görsel konsepti.', dkdFeatures: ['2 özel konsept görsel', 'Kıyafet/tema referansı', 'Benzer tarz / ilham yaklaşımı'], dkdSlug: 'style-try-on' },
  { dkdGroup: 'custom', dkdTitle: 'Photo Set', dkdTag: 'Set', dkdPrice: '999 TL', dkdDesc: '5 özel Anyela görseli.', dkdFeatures: ['5 görsel konsept', 'Farklı poz ve atmosfer', 'Sosyal medya odaklı çıktı'], dkdSlug: 'photo-set' },
  { dkdGroup: 'custom', dkdTitle: 'Talking Video', dkdTag: 'Video', dkdPrice: '1.500 TL+', dkdDesc: 'Kişiye özel kısa konuşmalı video.', dkdFeatures: ['Kısa konuşmalı video', 'Metin/senaryo desteği', 'Süre ve detay fiyatı değiştirir'], dkdSlug: 'talking-video' },
  { dkdGroup: 'custom', dkdTitle: 'VIP Fan Pack', dkdTag: 'VIP', dkdPrice: '1.999 TL+', dkdDesc: 'Sohbet + ses + özel görsel kombinasyonu.', dkdFeatures: ['30 dk sohbet', '1 sesli mesaj', '3 özel görsel'], dkdSlug: 'vip-fan-pack' },
  { dkdGroup: 'business', dkdTitle: 'Reklam Mini', dkdTag: 'İşletme', dkdPrice: '1.500 TL', dkdDesc: '1 kısa video + 1 görsel + açıklama metni.', dkdFeatures: ['Sosyal medya reklam konsepti', '1 video fikri/teslimi', 'Kısa açıklama metni'], dkdSlug: 'reklam-mini' },
  { dkdGroup: 'business', dkdTitle: 'Reklam Standart', dkdTag: 'İşletme', dkdPrice: '4.500 TL', dkdDesc: '3 video + 3 görsel + 3 açıklama.', dkdFeatures: ['3 sosyal medya videosu', '3 görsel konsept', 'Paylaşım metinleri'], dkdSlug: 'reklam-standart' },
  { dkdGroup: 'business', dkdTitle: 'Reklam Pro', dkdTag: 'İşletme', dkdPrice: '7.500 TL', dkdDesc: '5 video + 5 görsel + story/reels seti.', dkdFeatures: ['5 video konsepti', 'Story/Reels seti', 'Daha kapsamlı kampanya'], dkdSlug: 'reklam-pro' },
  { dkdGroup: 'business', dkdTitle: 'Marka Yüzü', dkdTag: 'Teklif', dkdPrice: '12.000 TL+', dkdDesc: 'Özel kampanya ve sponsorlu paylaşım modeli.', dkdFeatures: ['Marka yüzü konsepti', 'Sponsorlu/reklam etiketi', 'Proje bazlı teklif'], dkdSlug: 'marka-yuzu' }
] as const;

export const dkdFaqs = [
  { dkdQuestion: 'Anyela gerçek bir kişi mi?', dkdAnswer: 'Hayır. Anyela Born sanal bir AI influencer karakteridir.' },
  { dkdQuestion: 'Ödeme nasıl yapılacak?', dkdAnswer: 'İlk sürümde ödeme IBAN ile manuel alınır ve dekont onayından sonra hizmet başlatılır.' },
  { dkdQuestion: 'Sohbet tamamen otomatik mi?', dkdAnswer: 'İlk sürüm kontrollü ilerler; kalite ve güven için cevaplar kontrol edilerek gönderilir.' },
  { dkdQuestion: 'Sesli mesaj sistemi nasıl çalışır?', dkdAnswer: 'Kullanıcı sesli mesaj gönderir; Anyela karakterine uygun sesli cevap hazırlanıp teslim edilir.' }
] as const;
