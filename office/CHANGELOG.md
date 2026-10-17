# Sürüm notları

## 0.3.0 · Miami Shores

- Kullanıcının istediği sürüm numarasına göre v0.3 olarak adlandırıldı. V1 / V2 kayıtları aynı kayıt şemasıyla korunur.
- Arayüz pembe, turkuaz, mercan ve mor Miami renkleriyle yenilendi. Menü ve panel metinleri büyütüldü.
- Kareli soyut arka plan yerine sahil, deniz, palmiyeli yollar, iskele, tekneler, oteller ve havuzla ofise bağlı bir dünya eklendi.
- Yönetim kararı düğmelerindeki eksik tıklama işleyicisi eklendi. Seçim sonrası sonuç onayı ve güncel bütçe gösteriliyor.
- 0 kimlikli kararın boş sayılıp tekrar oluşturulması ve eski bir seçimin başka karara uygulanması engellendi.
- Karar seçenekleri için 5 DOM testi, karar kimliği / kayıt sürekliliği için 3 regresyon testi eklendi.
- Mobil kamera kadrajı ve takip yakınlaştırması düzeltildi; aynı anda gösterilen konuşma balonları mobilde 1, masaüstünde 2 ile sınırlandı.
- Eski önbelleğin yeni kodları karıştırmaması için tüm modüller v0.3.0 anahtarıyla yayınlanır.

## 0.3.0

Ofis görünümü ve arayüz baştan hazırlandı. İzometrik kesit stüdyo, karakter takibi, mobil alt menü, sohbet ve olay kanalları eklendi.

Proje atamaları artık üretimi doğrudan etkiliyor. Kalite / hız önceliği, proje hataları, test uzmanları, yeni proje oluşturma, oda seviyeleri, araştırma ağacı, ödüller ve finans raporu eklendi.

V1 kayıtları korunarak V2'ye taşınıyor. JSON yedekleme, geçerli dosya denetimi, büyük yazı seçeneği ve sürümlü çevrimdışı önbellek eklendi.

Düzeltmeler:

- Gün değiştikten sonra yeni yönetim kararlarının tekrar oluşturulması.
- Simülasyon hızının enerji tüketimini iki kez çarpmaması.
- Yetersiz bütçeyle satın alma ve ücretli karar verilememesi.
- Kaydedilmiş sıfır enerji / moral değerlerinin doğru yüklenmesi.
- Günlük maaş giderinin raporda iki kez sayılmaması.
- Etkileşim ve hedef ödüllerinin sınırsız tekrar edilememesi.
- Eski önbelleğin yeni sürüm modüllerinin yerine kullanılamaması.
- Mobil dokunma, yakınlaşma ve seçim koordinatlarının aynı dönüşümü kullanması.
