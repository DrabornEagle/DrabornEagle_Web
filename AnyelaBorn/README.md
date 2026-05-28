# Anyela Born Club v1.4 Clean Platform

Bu klasör `www.draborneagle.com/AnyelaBorn/` için hazırlanmış React tabanlı clean platform sürümüdür.

## Amaç

Önceki karmaşık tek sayfa tasarımını temizleyip gerçek web sitesi gibi çalışan, sayfaları ayrılmış ve mobilde anlaşılır bir yapı kurmak.

## Sayfalar

- `/AnyelaBorn/` Ana sayfa
- `/AnyelaBorn/packages/` Paketler
- `/AnyelaBorn/chat/` Sohbet önizleme
- `/AnyelaBorn/voice/` Sesli mesaj
- `/AnyelaBorn/custom/` Özel içerik
- `/AnyelaBorn/ads/` Reklam paketleri
- `/AnyelaBorn/payment/` Ödeme ve dekont
- `/AnyelaBorn/faq/` SSS ve kurallar

## Yayın notu

Canlı yayında build gerektirmemek için React çalışma dosyası `assets/dkd-anyela-react-v1-4.js` üzerinden CDN React import eder.
Kaynak React + TypeScript dosyaları `src/` altında ayrıca korunur.

## Sonraki aşama

- Gerçek IBAN bilgisi ekleme
- Dekont yükleme formunu backend'e bağlama
- Admin panel / chat paneli ekleme
- Sesli cevap ve özel içerik teslim akışı ekleme
