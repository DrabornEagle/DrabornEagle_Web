# DraBornQuiz — Pressure Chamber v1.0.0

DrabornEagle ekosistemi için sıfırdan hazırlanmış, bağımsız, Türkçe ve mobil uyumlu tek düğmeli bulmaca oyunu.

**Canlı adres:** https://www.draborneagle.com/DraBornQuiz/

## Oynanış
- 30 sabit ve tamamlanabilir görev; mantık, sayma, hafıza, kısa dokunuş, uzun basma, doğru anı bekleme, tepki, ışık ve ritim testleri.
- Tek hatada koşu başa döner; en ileri ulaşılan seviye ve toplam zafer sayısı cihazda saklanır.
- Mouse / dokunmatik ekran / Space / Enter.
- Ses aç-kapat, tam ekran, yardım paneli; Web Audio API ile üretilen özgün efektler.
- CSS ile oluşturulan 3D görünümlü oda ve kırmızı fiziksel düğme.
- Haricî paket, sunucu, ücretli API veya veritabanı gerektirmez.

## Dosyalar
- `index.html` — erişilebilir arayüz, terminal ve kontroller.
- `styles.css` — mobil ve masaüstü, tamamı kod ile üretilmiş oda.
- `game.js` — seviyeler ve oyun motoru.

## Kurulum
Statik dosyalar olduğundan mevcut Vercel statik site dağıtımıyla doğrudan `/DraBornQuiz/` adresinden açılır. Yerel test için bir statik HTTP sunucusu kullanılabilir. `index.html` yerel dosya olarak da açılabilir (Google Fonts yalnızca internetle yüklenir, sistem fontlarına düşer).

## Oyun testi / kabul senaryoları
1. Başlat → Seviye 1'de bir kez bas → Seviye 2.
2. Seviye 2 ve 3'te basış sayısını dene; yanlış hareket ve zaman aşımı kaybettirmeli.
3. 4. seviyede 3 saniye dokunmadan bekle → otomatik geçiş.
4. 5. seviyede en az 1,5 saniye basılı tut ve bırak; erken bırakırsan kaybet.
5. 10. seviyede kalan süre yarıya indikten sonra bas.
6. 11. ve 29. seviyelerde yalnız yeşil pencerede bas.
7. 17. ve 30. seviyelerde önce bekle sonra dokun.
8. Yardım açıkken ve sekme arka plandayken sayaç durmalı.
9. Oyun kaybedildiğinde yeniden başlat; rekor saklanmalı.
10. 30'u tamamla; zafer ekranı ve yüzde 100 görünmeli.

## Referans ve haklar
Oynanış türü ve tek düğme fikri bakımından [Pressing Under Pressure](https://donitz.itch.io/pressing-under-pressure) (Donitz) oyunundan ilham alınmıştır. **Bu çalışma orijinalin birebir kopyası veya resmî portu değildir.** Orijinal oyunun kaynak kodu, seviye metinleri, karakterleri, modelleri, resimleri ve sesleri kullanılmamıştır. Oyun akışı, Türkçe görev içerikleri ve görünüm DrabornEagle için yeniden yazılmıştır. Üçüncü taraf oyunun hakları kendi geliştiricisine aittir.

Not: Üst menüden DraBornGames'e dön bağlantısı bulunur. Buradan ana portal menüsüne otomatik kart eklenmez.