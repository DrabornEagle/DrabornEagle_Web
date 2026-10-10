# DraBornStyle veri mimarisi

Proje: `DraBorn-Park-Garage-Series` / `xpdiwyxnnrmyvpcqwuyb`. Uygulama alanı `drabornstyle`; güvenli sunucu işlevleri Data API'ye açılmayan `drabornstyle_private` şemasındadır. Mevcut diğer uygulamaların tabloları, Auth hesapları ve dosyaları korunur.

**43 tablo** vardır; tamamı `db_style_` ile başlar ve RLS aktiftir. İstemciler SELECT yetkisiyle yalnızca kendi kapsamlarını okur. İşlem yazımları `drabornstyle.api(action,data)` üzerinden canlı kullanıcı, rol, işletme, usta ve fiyat kontrolleriyle yapılır. İstemci admin rolü veremez; `user_metadata` yetki kaynağı değildir.

## Tablolar ve ilişkiler

| Grup | Tablolar | Temel ilişki / erişim |
|---|---|---|
| Kimlik | db_style_profiles, db_style_admin_users | auth.users → kullanıcı; admin üyeliği sunucudan |
| İşletme | db_style_businesses, db_style_business_members, db_style_business_settings | İşletme → sahip / owner-manager-staff üyeleri; her tenant ayrı |
| Usta | db_style_staff, db_style_staff_schedules, db_style_staff_availability, db_style_staff_breaks | İşletme → usta → haftalık program / durum / izin; aktif hesap üyeliği gerekir |
| Hizmet | db_style_services, db_style_staff_services | İşletme → hizmet; aynı işletmedeki ustayla bileşik FK |
| Randevu | db_style_appointments, db_style_appointment_events, db_style_waitlists, db_style_availability_requests | Usta + hizmet + müşteri; olay geçmişi; bekleme ve talep mevcut randevuyu değiştirmez |
| Hizmet işlemi | db_style_service_sessions, db_style_discounts | Randevu → tek hizmet oturumu; gerçek başlangıç/bitiş; indirim izi |
| Müşteri | db_style_customers, db_style_customer_notes, db_style_customer_loyalty | İşletme müşteri defteri; usta notları ve ziyaret sayısı |
| Kod / QR | db_style_referral_codes, db_style_customer_referrals, db_style_qr_tokens | Kod yalnızca ilgili usta; müşteri ilişkisi; QR 5 dakika |
| Finans | db_style_commission_rules, db_style_commission_ledger, db_style_commission_adjustments, db_style_business_balances | İşletme anlaşması → tek oturum tahakkuku → gerekçeli düzeltme → bakiye |
| Platform ödemesi | db_style_payment_schedules, db_style_payment_requests, db_style_payment_allocations, db_style_payment_receipts | Talep → admin onayı → FIFO ledger dağıtımı; özel dekont |
| İletişim | db_style_conversations, db_style_messages, db_style_conversation_presence | Randevu → tek sohbet; sadece müşteri / ilgili usta / yetkili işletme |
| Bildirim | db_style_notifications, db_style_notification_preferences | Kullanıcı + benzersiz dedupe_key; tercih ve kampanya izni |
| Konum | db_style_location_sessions | İlgili randevu + müşteri rızası + süre; platform adminine genel konum izni verilmez |
| İşletme akışı | db_style_reviews, db_style_queue, db_style_expenses | Tamamlanan randevu değerlendirmesi; dijital sıra; yetkili gider kaydı |
| Destek / denetim | db_style_support_requests, db_style_admin_logs, db_style_analytics_events | Kullanıcı talebi; fiyat/yetki/finans işlemleri denetimi; genişletilebilir olay tablosu |

`staff_services`, program, randevu gibi kritik ilişkilerde `(id,business_id)` bileşik FK farklı işletmeden hizmet/usta bağlanmasını engeller. FK ve tenant erişim sütunları indekslidir. Mesajlar conversation/time, randevular staff/time, işlemler business/completed_at indekslerini kullanır.

## Randevu ve fiyat güvenliği

Saatler `timestamptz` olarak tutulur; Türkiye çalışma takvimi `Europe/Istanbul` ile hesaplanır. Bu sürüm Türkiye saat dilimiyle sınırlıdır. Tutarlar `numeric(12,2)` TRY; yüzde `numeric(5,2)` kullanır.

Usta düzeyindeki transaction advisory lock yanında PostgreSQL GiST exclusion constraint bulunur:

```sql
exclude using gist (
  staff_id with =,
  tstzrange(starts_at,reserved_until,'[)') with &&
) where (status in ('confirmed','late','in_progress'))
```

Hizmet + hazırlık süresi, program, mola, manuel izin, anlık meşguliyet ve bitmemiş hizmet birlikte kontrol edilir. Tekrarlı seri 2–8 haftalıktır ve tamamı tek transaction içinde oluşur. Bir haftası çakışırsa bütün seri geri alınır.

`quote` müşteri fiyatını sunucuda hesaplar. `book.expected_total` son gösterilen fiyatla eşleşmelidir. Onaylanan randevu temel fiyat ve komisyon anlaşmasını snapshot olarak saklar; sonraki anlaşma değişikliği önceki rezervasyona sessizce uygulanmaz. %15: 350 → 297,50; +20 → 317,50 TL. Sadakat ve müşteri kodu üst üste eklenmez; daha yüksek uygun indirim uygulanır.

`finish` oturumu kilitler; tamamlanan kaydın tekrar tamamlanması aynı sonucu döndürür. Ledger'da `session_id` UNIQUE olduğundan ikinci komisyon oluşmaz. İndirim yetkisi, limiti, gerekçesi ve tahsilat üst sınırı sunucuda doğrulanır. Tamamlanmış finans kayıtlarının doğrudan istemci UPDATE yetkisi yoktur.

## Tahakkuk, tahsilat ve düzeltme

Varsayılan sabit bedel 20 TL ve kaynak `platform`dur. Admin işletmeye özel sabit/yüzdesel bedel, kaynaklar ve indirimin yüzdesel komisyona etkisini seçer. Çat kapı/telefon/özel kaynaklar sözleşmede açılmadıkça sıfır bedeldir.

Ödeme bildirimi borcu azaltmaz. Admin onayı talebi ve bakiyeyi kilitler, eski tahakkuklardan başlayarak dağıtır. Aynı onay ikinci tahsilat üretmez. Onay sonrası `balance = accrued - paid`. Reddedilen talep bakiyeyi değiştirmez. Gerekçeli komisyon farkı ayrı `commission_adjustments` ve admin günlüğüyle kaydedilir; tahsil edilmiş tutarın altına indirilemez.

Sunucu `dashboard` ve `staff_dashboard` fonksiyonları tüm yetkili geçmişten toplam üretir; arayüzün ilk 250 satırlık listesi toplamları sınırlandırmaz. Uzun geçmişler sayfalanır. Tahminler son 28 günün haftalık ortalamasıdır; trafik veya makine öğrenmesi tahmini değildir.

## Realtime, görevler ve dosyalar

Mevcut `supabase_realtime` publication korunarak 12 Style tablosu eklendi: appointments, staff_availability, service_sessions, messages, conversations, conversation_presence, notifications, business_balances, payment_requests, location_sessions, queue, availability_requests. RLS, abonenin okuyabildiği kayıtları sınırlar. Arayüz ilgili tabloyu 300 ms toplu yeniler; bağlantı dönüşünde ve 60 saniyede sunucudan tekrar okur.

`drabornstyle-minute` cron görevi dakika başına yaklaşan randevu, ödeme günü/gecikme, süreli meşguliyet ve konum temizleme işlemlerini yürütür. İşletme açıkça `recall_after_days` ayarlarsa kampanya izni olan müşteriye son ziyaretinden sonra bir kez geri çağırma bildirimi gönderir. Varsayılan kapalıdır.

Storage: `drabornstyle-media` işletme görselleri için public, 5 MB; `drabornstyle-receipts` özel dekont için private, 5 MB. Dekont erişimi owner/manager/admin; signed URL 120 saniye. Dosya yolları işletme UUID'siyle başlar ve ödeme talebiyle eşleştirilir.

Konum takibi ilgili randevunun iki saat öncesi/sonrası pencerede ve en fazla iki saat için açılır. İzin kaldırılınca, randevu tamamlanınca veya süre dolunca koordinatlar temizlenir. Mesafe tabanlı ETA trafik içermez. İzin vermeyen müşteri randevu alabilir.

Silme talebi Style içinde admin tarafından sonuçlandırılır: kişisel içerikler temizlenir, gerekli finans izleri korunur ve Style hesabı kapatılır. Ortak `auth.users` hesabı ve diğer uygulama verileri silinmez. İşletme sahipliği/admin yetkisi önce devredilmelidir.

## Migration ve işletim

Migrationları tarih sırasıyla uygula. Mevcut üretim projesine bu sürümün migrationları zaten uygulandı; başlangıç migrationlarını tekrar çalıştırma. Mevcut projeyi `db reset` ile sıfırlama. Dosya sürümleri uzak migration geçmişindeki Style sürümleriyle eşleşir. Ortak projede diğer uygulamaların migrationları da olduğundan bu repo tek başına tüm uzak geçmişi temsil etmez; körlemesine `db push` veya migration repair uygulama. Yeni migrationı ilgili schema ile sınırlandırıp denetleyerek uygula; diğer uygulamaların migration geçmişini silme.

Yeni bir veritabanında pgcrypto/btree_gist, Supabase Auth/Storage/Realtime ve pg_cron gerekir. `drabornstyle` Data API exposed schemas listesine eklenmeli; önceki listeden hiçbir schema çıkarılmamalı. Private schema bu listeye eklenmez.

Sunucu fonksiyonları `search_path=''` ve açık şema adları kullanır. Publishable key istemcide bulunabilir; service_role, DB parolası, admin parolası ve kullanıcı tokenı repo içinde yoktur.
