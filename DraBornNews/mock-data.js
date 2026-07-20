export const categories = [
  { id: 'all', label: 'Tümü', icon: '✦' },
  { id: 'gaming', label: 'Oyun', icon: '🎮' },
  { id: 'technology', label: 'Teknoloji', icon: '⌁' },
  { id: 'ai', label: 'Yapay Zekâ', icon: '◇' },
  { id: 'cinema', label: 'Film & Dizi', icon: '▶' },
  { id: 'mobility', label: 'Otomobil & Moto', icon: '⚡' },
  { id: 'world', label: 'Gündem', icon: '◎' }
];

export const articles = [
  {
    id: 'news-001', category: 'gaming', categoryLabel: 'Oyun', eyebrow: 'GÜNÜN DOSYASI',
    title: 'Yeni nesil açık dünya oyunlarında yaşayan şehirler dönemi başlıyor',
    summary: 'Geliştiriciler, sabit görev zincirleri yerine oyuncunun davranışına göre değişen ekonomi, trafik ve karakter ilişkileri üzerinde çalışıyor.',
    whyImportant: 'Bu yaklaşım, her oyuncunun aynı haritada farklı sonuçlarla karşılaşmasını ve oyun dünyasının uzun süre canlı kalmasını sağlayabilir.',
    details: ['NPC davranışları artık yalnızca önceden yazılmış rotalara bağlı olmayacak.', 'Şehir ekonomisi, oyuncuların alım-satım ve görev tercihleriyle değişebilecek.', 'Canlı servis yapısı ile tek oyunculu anlatı arasındaki sınır giderek azalacak.'],
    sourceCount: 8, sourceNames: ['Game Developer', 'IGN', 'Eurogamer'], trustScore: 92,
    publishedAt: '12 dk önce', readTime: '3 dk', icon: '🎮', theme: 'violet', featured: true
  },
  {
    id: 'news-002', category: 'ai', categoryLabel: 'Yapay Zekâ', eyebrow: 'ANALİZ',
    title: 'Yapay zekâ ajanları uygulamalardaki rutin işleri devralıyor',
    summary: 'Yeni ajan sistemleri yalnızca yanıt vermekle kalmıyor; takvim, e-posta, veri analizi ve iş akışı görevlerini araçlarla tamamlıyor.',
    whyImportant: 'Kullanıcı deneyimi, menüler arasında dolaşmaktan hedef söyleyerek sonuç almaya doğru kayıyor.',
    details: ['Ajanlar birden fazla aracı sıralı ve kontrollü biçimde kullanabiliyor.', 'İzin, denetim kaydı ve hata geri alma mekanizmaları kritik hale geliyor.', 'Küçük işletmeler için otomasyon maliyeti düşebilir.'],
    sourceCount: 11, sourceNames: ['OpenAI', 'Google Research', 'MIT Technology Review'], trustScore: 96,
    publishedAt: '28 dk önce', readTime: '4 dk', icon: '◇', theme: 'cyan'
  },
  {
    id: 'news-003', category: 'technology', categoryLabel: 'Teknoloji', eyebrow: 'MOBİL',
    title: 'Telefonlar çevrimdışı çalışan kişisel yapay zekâ merkezlerine dönüşüyor',
    summary: 'Cihaz içi modeller; metin özetleme, fotoğraf düzenleme ve kişisel arama işlemlerini buluta veri göndermeden yapmaya başlıyor.',
    whyImportant: 'Daha hızlı yanıt, düşük bağlantı ihtiyacı ve mahremiyet açısından önemli bir değişim.',
    details: ['Küçük modeller mobil işlemcilere göre optimize ediliyor.', 'Bulut ve cihaz içi çalışma hibrit olarak kullanılacak.', 'Pil tüketimi ve model güncelleme boyutu temel sorunlar arasında.'],
    sourceCount: 6, sourceNames: ['Android Developers', 'Apple Machine Learning', 'Qualcomm'], trustScore: 90,
    publishedAt: '41 dk önce', readTime: '3 dk', icon: '⌁', theme: 'blue'
  },
  {
    id: 'news-004', category: 'mobility', categoryLabel: 'Otomobil & Moto', eyebrow: 'GELECEK',
    title: 'Elektrikli motosikletlerde menzil kadar şarj standardı da belirleyici olacak',
    summary: 'Üreticiler batarya kapasitesinin yanında hızlı şarj ağı, değiştirilebilir batarya ve servis erişimini rekabet alanına dönüştürüyor.',
    whyImportant: 'Şehir içi kullanımda satın alma kararını yalnızca menzil değil, şarj süresi ve servis altyapısı belirleyecek.',
    details: ['Değiştirilebilir batarya istasyonları bazı pazarlarda büyüyor.', 'Standart bağlantı noktaları ikinci el değerini etkileyebilir.', 'Batarya garanti şartları kullanıcıların dikkat etmesi gereken başlık.'],
    sourceCount: 5, sourceNames: ['Electrek', 'RideApart', 'Motorcycle News'], trustScore: 87,
    publishedAt: '1 sa önce', readTime: '2 dk', icon: '⚡', theme: 'amber'
  },
  {
    id: 'news-005', category: 'cinema', categoryLabel: 'Film & Dizi', eyebrow: 'SEKTÖR',
    title: 'Dizilerde etkileşimli hikâye anlatımı yeniden gündemde',
    summary: 'Yayın platformları, izleyicinin seçim yaptığı yapımları daha gelişmiş kişiselleştirme ve oyun mekanikleriyle yeniden deniyor.',
    whyImportant: 'Film, dizi ve oyun tasarımı arasındaki üretim araçları birbirine yaklaşabilir.',
    details: ['Seçimlerin üretim maliyetini artırması hâlâ temel sorun.', 'Yapay zekâ destekli kurgu araçları alternatif sahneleri ucuzlatabilir.', 'İzleyici verisinin hikâye kararlarında kullanılması tartışma yaratıyor.'],
    sourceCount: 4, sourceNames: ['Variety', 'The Hollywood Reporter', 'Screen Rant'], trustScore: 84,
    publishedAt: '2 sa önce', readTime: '3 dk', icon: '▶', theme: 'rose'
  },
  {
    id: 'news-006', category: 'world', categoryLabel: 'Gündem', eyebrow: 'DİJİTAL DÜNYA',
    title: 'Dijital platformlarda içerik kaynağını göstermek yeni güven standardı oluyor',
    summary: 'Okuyucular kısa özet kadar orijinal kaynağı, güncelleme geçmişini ve bir haberin kaç bağımsız kaynakla doğrulandığını görmek istiyor.',
    whyImportant: 'Hızlı haber tüketiminde şeffaflık, marka güveninin ana unsurlarından biri haline geliyor.',
    details: ['Kaynak bağlantısı özetin yanında görünür olmalı.', 'Düzeltmeler silinmek yerine sürüm geçmişinde açıklanmalı.', 'AI tarafından oluşturulan içerik açıkça işaretlenmeli.'],
    sourceCount: 9, sourceNames: ['Reuters Institute', 'AP', 'European Commission'], trustScore: 94,
    publishedAt: '3 sa önce', readTime: '4 dk', icon: '◎', theme: 'green'
  }
];

export const trendingTopics = [
  ['#YapayZekâAjanları', '18,4B konuşma'],
  ['#YeniNesilOyunlar', '12,1B konuşma'],
  ['#MobilTeknoloji', '8,7B konuşma'],
  ['#ElektrikliMoto', '5,2B konuşma']
];

export const dailyBrief = {
  title: 'Bugünün 5 dakikalık özeti',
  text: 'Oyun dünyasında yaşayan şehirler, cihaz içi yapay zekâ, elektrikli motosiklet standartları ve dijital habercilikte kaynak şeffaflığı öne çıkıyor.',
  itemCount: 6,
  duration: '05:12'
};
