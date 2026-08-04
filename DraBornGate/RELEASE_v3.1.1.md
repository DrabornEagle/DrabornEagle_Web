# DraBornGate Web v3.1.1

Bu düzeltme sürümü Güvenlik Sade Tema oturum hatasını, Yeni Geçiş talebi oluşturma sorununu ve mobil arayüz ayrıntılarını giderir.

- Sade Tema yalnızca DraBornGate projesine ait Supabase oturum anahtarını kullanır; yanlış projeye ait JWT seçilmez.
- Süresi dolan oturum anahtarı yenilenir ve 401 yanıtında istek bir kez tekrar edilir.
- Yeni Geçiş talebinde sipariş ekran görüntüsü isteğe bağlıdır.
- Premium menüye yalnızca Admin rolünde görünen merkezi **Admin Paneli** eklenir.
- Admin Paneli kullanıcı, site, aktif bağlantı ve kurye başı kazanç yönetimini bir araya getirir.
- Alt menüde `DBG` yerine `Kurye` yazılır.
- Kurye kodu yazılırken canlı yenileme input alanını yeniden oluşturmaz; mobil klavye kapanmaz.
- Konum Kontrolü Yap ve Kapıya Geldim butonları tek satır ve yan yana kalır.
- Modern Tema kurye kartlarında DraBornGate uygulamasındaki motosiklet SVG'si kullanılır.
