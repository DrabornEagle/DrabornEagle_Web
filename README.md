# DrabornEagle Web

DrabornEagle ekosisteminin [resmî web sitesi](https://www.draborneagle.com/). DraBornStudio uygulamalarının web dağıtımları `DraBornStudio/` altında tutulur.

| Proje | Klasör | Adres |
| --- | --- | --- |
| DraBornStudio | [DraBornStudio/](DraBornStudio/) | https://www.draborneagle.com/DraBornStudio/ |
| Coconut-app | [DraBornStudio/Coconut-app/](DraBornStudio/Coconut-app/) | https://www.draborneagle.com/DraBornStudio/Coconut-app/ |
| Banana-edits | [DraBornStudio/Banana-edits/](DraBornStudio/Banana-edits/) | https://www.draborneagle.com/DraBornStudio/Banana-edits/ |
| clipboard-app | [DraBornStudio/clipboard-app/](DraBornStudio/clipboard-app/) | https://www.draborneagle.com/DraBornStudio/clipboard-app/ |

Coconut-app ve Banana-edits web uygulamalarıdır. clipboard-app sayfası macOS/Windows uygulamasının tanıtımını ve kaynak bağlantılarını içerir.

## Kaynaklar ve eşitleme

Geliştirme kaynağı [DrabornEagle/DraBornStudio](https://github.com/DrabornEagle/DraBornStudio) reposundadır. O repoda `cd Banana-edits && npm ci && npm test && npm run typecheck && npm run build` çalıştır; ardından depo kökünde `python3 scripts/sync-web.py /path/to/DrabornEagle_Web` komutuyla bu repodaki web dosyalarını ve `source/` kopyalarını güncelle.

Eski adreslerin sunucu yönlendirmeleri `vercel.json` içinde, statik barındırma uyumluluğu `404.html` içindedir. Eski proje adlarıyla klasör veya ikinci kaynak kopyası tutulmaz. Banana-edits API köprüsü `api/banana-edits/` altındadır.

## Kontroller

`node --test scripts/test-banana-bridge.mjs` API köprüsünü doğrular. `node scripts/dkd-search-sitemap.mjs` site haritasını günceller; `node scripts/dkd-search-sitemap.mjs --check` güncelliğini denetler. Yerel önizleme için `python3 -m http.server 8080` kullanıp `http://localhost:8080/DraBornStudio/` adresini aç.

Özgün kaynak ve lisans bildirimleri proje klasörlerinde korunur. Gerçek kullanıcı dosyaları, oturum verileri veya sağlayıcı anahtarlarını bu repoya ekleme.
