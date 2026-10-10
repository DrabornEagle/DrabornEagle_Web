# DraBornStyle v0.1.0 teslimat

Tarih: 10 Ekim 2026. Android ve Web ortak kaynakları gerçek Supabase verilerine bağlıdır. Android: [DraBornStyle](https://github.com/DrabornEagle/DraBornStyle). Web: [DrabornEagle_Web / DraBornStyle](https://github.com/DrabornEagle/DrabornEagle_Web/tree/main/DraBornStyle). Yayın hedefi: [www.draborneagle.com/DraBornStyle](https://www.draborneagle.com/DraBornStyle/).

## Çalışan temel sistem

- E-posta kayıt/giriş, mevcut ortak hesabı kullanma, şifre değiştirme/sıfırlama akışı, yerel ve tüm cihazlardan çıkış; dört rol için sunucu denetimi.
- İşletme başvurusu/admin onayı, vitrin ve görsel yükleme, hizmet fiyatı/süresi/hazırlık, usta hesabı bağlama, program/izin/yetki/indirim limiti/hedef yönetimi.
- Yakındaki işletme keşfi, harita, hizmet-usta-tarih-saat ve nihai fiyat onayı; çakışma engeli; erteleme, iptal, gecikme, gelmeme; gün/hafta/ay filtreleri; telefon randevusu; 2–8 haftalık seri.
- Bekleme listesi ve müsaitlik talebi; boşluk ve işletme yanıtı bildirimleri mevcut randevuyu bozmaz.
- Usta anlık durum, hızlı misafir/kayıtlı müşteri, tıraşı başlat/uzat/bitir, indirim gerekçesi, nakit/kart/banka tahsilatı, hazırlık süresi ve dijital sıra.
- Sabit/yüzdesel işletme anlaşması, kaynak politikası, usta kodu, sadakat, tek hizmet/tek komisyon, gerekçeli düzeltme; tahakkuk ve tahsilat ayrı toplamlar.
- Haftalık/aylık ödeme günü; kısmi ödeme bildirimi, özel dekont, admin onay/ret/inceleme, idempotent dağıtım ve güncel bakiye.
- Admin/işletme/usta panelleri, tarih filtreleri, çalışan performansı, günlük kapanış, basit yoğunluk ve hasılat tahmini, gider, CSV/XLSX/PDF dışa aktarma.
- Randevu bağlantılı canlı sohbet, okundu/yazıyor, hızlı cevap, engel/şikâyet; uygulama içi bildirim kutusu ve izinle yerel hatırlatma.
- Süreli/rızalı varış takibi; kişisel notlar, müşteri geçmişi ve tekrar randevu; 5 dakikalık müşteri QR; isteğe bağlı otomatik geri çağırma.
- Koyu/açık tema, responsive masaüstü paneli ve mobil navigasyon; tek tasarım sistemi.

43 Style tablosu ve 11 migration uygulanmıştır. Supabase güvenlik denetiminde Style şemasına ait uyarı bulunmadı. Önceden mevcut diğer uygulama uyarıları ve verileri değiştirilmedi. Test kayıtları temizlendi; keşif ekranına sahte işletme veya sahte kazanç eklenmedi. Gerçek işletme eklenip onaylanana kadar boş durum görünmesi normaldir.

`draborneagle@gmail.com` mevcut Auth hesabı Style admin olarak tanımlandı. Kullanıcının verdiği mevcut parola ile API girişi başarılıdır. Parola repo veya istemciye yazılmadı; ortak Auth hesabının parolası değiştirilmedi.

## Test sonuçları

| Test grubu | Sonuç | Gerçek kapsam |
|---|---:|---|
| tests/engine.sql | 18 / 18 | PostgreSQL RPC, finans, izolasyon, konum izni, idempotency; transaction rollback |
| tests/workflows.sql | 10 / 10 | Tekrarlı seri rollback, yetki iptali, QR, düzeltme, izinli otomatik geri çağırma |
| scripts/live-tests.mjs | 6 / 6 | İki gerçek Supabase istemcisi, eşzamanlı rezervasyon, Realtime randevu/çalışma durumu ve yeniden okuma |
| tests/reports.test.mjs | 2 / 2 | XLSX sayısal para, XML kaçışı, formül güvenliği ve Türkçe CSV |
| TypeScript | Geçti | npm run typecheck |
| Expo paket kontrolü | Geçti | SDK paket manifesti; son kontrol ağ zaman aşımından sonra offline manifest ile tekrarlandı |
| Android export | Geçti | Metro/Hermes JavaScript paketi; APK/AAB değildir |
| Web export | Geçti | /DraBornStyle altında Metro statik çıktı |

**Toplam 36 otomatik test geçti.** İki API istemcisi testleri, fiziksel Expo Go telefonu ile Web arasında kullanıcı arayüzü testi olarak raporlanmaz. Telefon kabul listesi [EXPO-GO.md](EXPO-GO.md) içindedir.

## Ticari yayından önce tamamlanması gerekenler

1. Fiziksel Expo Go 58.0.2 üzerinde kamera/harita/izin/yerel bildirim/paylaşım ve gerçek Web ↔ Android kabul testi yapılmadı. Paket doğrulaması bunun yerini tutmaz.
2. Android uzak push ve arka plan konumu etkin değil. Development build + gerçek FCM/Expo push yapılandırması ayrı iştir. Kapalı tarayıcıya Web Push/service worker kurulmadı; açık uygulama içi bildirimler çalışır.
3. Google Web OAuth ve şifre sıfırlama e-postası callback/redirect uçtan uca test edilmedi. Supabase ortak Auth redirect allowlist kontrolü ve gerçek e-posta teslim testi gerekir; diğer uygulamaların ayarları değiştirilmedi.
4. Gizlilik/koşullar/işletme komisyon metni başlangıç taslağıdır. Veri sorumlusunun ticari unvanı/adresi, saklama süreleri, yurt dışı aktarım mekanizması, banka/IBAN ve sözleşme tarafları gerçek bilgilerle tamamlanmalıdır. Bu sürüm hukuki uygunluk sertifikası değildir.
5. Tahminler basit geçmiş ortalamasıdır. Harita/ETA trafik servisi, muhasebe/e-fatura entegrasyonu ve banka otomatik tahsilat entegrasyonu yoktur; platform ödemesi admin tarafından doğrulanır.
6. Hizmete/ustaya özel komisyon anlaşması için genişletme noktaları vardır; bu sürüm anlaşmayı işletme düzeyinde uygular. Tekrarlı randevu sınırsız seri yerine 2–8 hafta ile sınırlıdır. Admin sistem duyurusu uygulama içi bildirimlere gönderilir; otomatik şüpheli işlem tespiti henüz ayrı ürün akışı değildir.

Kod, çalışan temel platformu sunar; yukarıdaki cihaz, entegrasyon ve ticari hazırlıklar tamamlanmış gibi gösterilmez. **APK ve AAB oluşturulmadı.**
