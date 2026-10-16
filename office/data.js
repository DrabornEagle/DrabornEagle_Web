// DraBorn Office — original fictitious cast, authored narrative and simulation definitions.
// All artwork is procedurally drawn. No purchased asset, remote API or external SDK.
export const WORLD={cols:36,rows:24,tile:32,width:1152,height:768};
export const ROOMS=[
 {id:"creative",name:"Yaratıcı Merkez",sub:"Kod • Tasarım • Geliştirme",x:0,y:0,w:18,h:11,color:"#29446c",icon:"⌘",desc:"Yeni dünyaların, oyun mekaniklerinin ve prototiplerin üretildiği merkez."},
 {id:"art",name:"Tasarım Atölyesi",sub:"Piksel • 3D • Arayüz",x:18,y:0,w:18,h:11,color:"#583767",icon:"✿",desc:"Konsept çizimler, karakter animasyonları ve göz alıcı sahneler burada doğuyor."},
 {id:"studio",name:"Ses & Yayın",sub:"Podcast • Sinematik",x:0,y:11,w:11,h:8,color:"#45335f",icon:"♫",desc:"Oyun müzikleri, ses efektleri ve videoların hazırlandığı yaratıcı ses stüdyosu."},
 {id:"lounge",name:"Sosyal Alan",sub:"Kahve • Dinlenme",x:11,y:11,w:8,h:8,color:"#39564d",icon:"☕",desc:"Ekibin kahve içtiği, dinlendiği ve spontane fikirler ürettiği alan."},
 {id:"meeting",name:"Toplantı Odası",sub:"Planlama • Kararlar",x:19,y:11,w:8,h:8,color:"#41476b",icon:"◈",desc:"Ürün stratejisi, sprint planlamaları ve haftalık değerlendirmeler."},
 {id:"server",name:"Teknoloji Merkezi",sub:"Sunucu • Test • QA",x:27,y:11,w:9,h:8,color:"#264f62",icon:"▣",desc:"Test cihazları, sunucular ve sürüm izleme panoları burada bulunur."},
 {id:"lobby",name:"Karşılama & Sergi",sub:"Vitrin • Lansman",x:0,y:19,w:36,h:5,color:"#3f3456",icon:"✦",desc:"Ziyaretçilerin karşılandığı ve stüdyonun projelerinin sergilendiği alan."}
];
export const STAFF=[
 {id:"dogancan",name:"Doğancan",role:"Stüdyo Kurucusu",team:"Yönetim",color:"#ff64ab",skin:"#d79d79",hair:"#221a32",top:"#c9438e",home:[7,5],skill:95,social:78,focus:86,icon:"🦅",trait:"Vizyoner",bio:"Yeni fikirlerin peşinden giden, stüdyonun yaratıcı yönünü belirleyen lider.",job:"Strateji"},
 {id:"selin",name:"Selin",role:"Oyun Tasarımcısı",team:"Geliştirme",color:"#ac85ff",skin:"#e3ad89",hair:"#4a2c28",top:"#8b63de",home:[4,8],skill:87,social:84,focus:76,icon:"🎲",trait:"Hayalperest",bio:"Oyun mekaniği, denge ve keşif hissi üzerine çalışıyor.",job:"Tasarım"},
 {id:"arda",name:"Arda",role:"Kıdemli Yazılımcı",team:"Geliştirme",color:"#57d8f6",skin:"#c38763",hair:"#282633",top:"#348db6",home:[12,5],skill:93,social:48,focus:97,icon:"💻",trait:"Analitik",bio:"Karmaşık sistemleri çözmeyi seven, sistem mimarisini yöneten programcı.",job:"Kodlama"},
 {id:"duru",name:"Duru",role:"Oynanış Programcısı",team:"Geliştirme",color:"#6adebb",skin:"#ecc4a0",hair:"#362744",top:"#36a188",home:[15,8],skill:84,social:69,focus:92,icon:"⚙",trait:"Meraklı",bio:"Fizik, savaş sistemleri ve kontrol hissini geliştiriyor.",job:"Kodlama"},
 {id:"ege",name:"Ege",role:"3D Sanatçısı",team:"Sanat",color:"#ffb16e",skin:"#d8a17b",hair:"#3c2d24",top:"#c5844b",home:[22,5],skill:86,social:62,focus:83,icon:"🧊",trait:"Detaycı",bio:"Görsel dünyaları, atmosferi ve oyun içi modelleri üretiyor.",job:"Görsel"},
 {id:"ada",name:"Ada",role:"Piksel Sanatçısı",team:"Sanat",color:"#ff75a8",skin:"#f1c2a6",hair:"#63374e",top:"#d36b9a",home:[28,5],skill:89,social:75,focus:82,icon:"🎨",trait:"Yaratıcı",bio:"Küçük karelerle büyük dünyalar tasarlıyor.",job:"Görsel"},
 {id:"mira",name:"Mira",role:"UI / UX Tasarımcısı",team:"Sanat",color:"#b18cff",skin:"#c98868",hair:"#171c30",top:"#8064da",home:[32,8],skill:82,social:91,focus:74,icon:"✎",trait:"Empatik",bio:"Oyuncuların hislerini ve deneyimlerini her kararın merkezine koyuyor.",job:"Arayüz"},
 {id:"bora",name:"Bora",role:"Ses Tasarımcısı",team:"Prodüksiyon",color:"#d2a0ff",skin:"#bc8063",hair:"#252136",top:"#7755aa",home:[5,15],skill:85,social:57,focus:87,icon:"🎵",trait:"Ritmik",bio:"Oyunun ritmini müzik ve ses efektleriyle yaratıyor.",job:"Ses"},
 {id:"lara",name:"Lara",role:"Topluluk Yöneticisi",team:"Topluluk",color:"#f8c970",skin:"#efb899",hair:"#5c3233",top:"#b8873e",home:[14,16],skill:80,social:96,focus:67,icon:"💬",trait:"Sosyal",bio:"Oyuncularla stüdyo arasında bağ kuruyor, geri bildirimleri topluyor.",job:"Topluluk"},
 {id:"kaya",name:"Kaya",role:"Yapımcı",team:"Yönetim",color:"#72d4e4",skin:"#b47e62",hair:"#2d2933",top:"#498d9f",home:[23,15],skill:88,social:73,focus:84,icon:"📋",trait:"Planlı",bio:"Takvimi, kaynakları ve stüdyonun üretim düzenini yönetiyor.",job:"Planlama"},
 {id:"deniz",name:"Deniz",role:"Kalite Kontrol",team:"Teknoloji",color:"#79eda7",skin:"#e1b08b",hair:"#514235",top:"#4e9d72",home:[31,15],skill:91,social:63,focus:91,icon:"🧪",trait:"Titiz",bio:"Hataları oyunculardan önce bulan test uzmanı.",job:"Test"},
 {id:"yaman",name:"Yaman",role:"Video Editörü",team:"Prodüksiyon",color:"#fd9e7e",skin:"#dca482",hair:"#382531",top:"#b86b56",home:[17,21],skill:83,social:77,focus:75,icon:"🎬",trait:"Hikâyeci",bio:"Fragmanlara ve stüdyo hikâyelerine sinematik dokunuşlar katıyor.",job:"Video"},
 {id:"idil",name:"İdil",role:"Sistem Tasarımcısı",team:"Geliştirme",color:"#f6a7e0",skin:"#eabb94",hair:"#553751",top:"#b76c9e",home:[2,9],skill:90,social:79,focus:89,icon:"🧩",trait:"Stratejik",bio:"Ekonomi ve ilerleme sistemlerinde oyuncu deneyimini dengeliyor.",job:"Sistem"},
 {id:"atlas",name:"Atlas",role:"Oyun Motoru Uzmanı",team:"Geliştirme",color:"#5ef0e1",skin:"#c88a69",hair:"#25273c",top:"#328d99",home:[9,7],skill:94,social:54,focus:96,icon:"⚡",trait:"Mühendis",bio:"Performans, iş parçacıkları ve rendering sistemlerini optimize ediyor.",job:"Motor"},
 {id:"zeynep",name:"Zeynep",role:"Anlatı Tasarımcısı",team:"Geliştirme",color:"#d6b2ff",skin:"#e7ad82",hair:"#463146",top:"#9772c0",home:[13,9],skill:85,social:88,focus:78,icon:"📖",trait:"Hikâyeci",bio:"Karakterlerin geçmişini, diyaloglarını ve oyun evrenlerini kaleme alıyor.",job:"Hikâye"},
 {id:"asya",name:"Asya",role:"Konsept Sanatçısı",team:"Sanat",color:"#ffce88",skin:"#dfad81",hair:"#302c3a",top:"#bc8757",home:[20,7],skill:92,social:70,focus:86,icon:"🖌",trait:"Gözlemci",bio:"Evrenin ilk görsel fikirlerini karakterlere ve mekânlara dönüştürüyor.",job:"Konsept"},
 {id:"mete",name:"Mete",role:"Animasyon Yönetmeni",team:"Sanat",color:"#fd8b95",skin:"#bc815a",hair:"#342a32",top:"#bd5b6e",home:[25,8],skill:89,social:73,focus:90,icon:"🎞",trait:"Dinamik",bio:"Karakterlerin yaşam hissini animasyonlarla güçlendiriyor.",job:"Animasyon"},
 {id:"ruzgar",name:"Rüzgâr",role:"DevOps Mühendisi",team:"Teknoloji",color:"#6ce4dc",skin:"#ddaa85",hair:"#303a43",top:"#348e89",home:[29,17],skill:88,social:55,focus:92,icon:"🛠",trait:"Güvenilir",bio:"Yayın sistemlerini, test sunucularını ve otomasyonu çalışır tutuyor.",job:"Altyapı"},
 {id:"melis",name:"Melis",role:"Pazarlama Lideri",team:"Topluluk",color:"#ff77c5",skin:"#f1c8a9",hair:"#693c45",top:"#ba548c",home:[15,15],skill:85,social:95,focus:74,icon:"📣",trait:"Girişken",bio:"Lansman stratejileri ve yaratıcı kampanyalar hazırlıyor.",job:"Pazarlama"},
 {id:"derin",name:"Derin",role:"Müzik Bestecisi",team:"Prodüksiyon",color:"#9eb9ff",skin:"#dcad89",hair:"#242b4d",top:"#6d77b9",home:[8,16],skill:93,social:63,focus:90,icon:"🎹",trait:"Duygusal",bio:"Oyunun atmosferine uygun özgün müzikler besteliyor.",job:"Müzik"}
];
export const PROJECTS=[
 {id:"survival",name:"Project WILDLANDS",subtitle:"Açık dünya hayatta kalma",genre:"Survival / Craft",icon:"🌲",color:"#23624f",accent:"#78edb4",progress:33,target:560,type:"game",audience:1.25},
 {id:"series",name:"NEON CHRONICLES",subtitle:"Sinematik mini dizi",genre:"Interactive Story",icon:"🌆",color:"#793e87",accent:"#ff84c4",progress:61,target:420,type:"series",audience:1.1},
 {id:"arcade",name:"PIXEL RUSH",subtitle:"Retro arcade deneyimi",genre:"Arcade / Platform",icon:"👾",color:"#4e4d91",accent:"#afa9ff",progress:79,target:300,type:"game",audience:.8}
];
export const STATIONS={
 creative:[[3,6],[5,7],[8,5],[11,7],[13,5],[16,7]],
 art:[[21,6],[23,5],[27,6],[31,7],[33,5]],
 studio:[[4,14],[6,16],[8,14]],
 lounge:[[12,14],[14,16],[16,14],[15,17]],
 meeting:[[21,14],[23,15],[25,14]],
 server:[[29,14],[31,16],[33,14]],
 lobby:[[6,21],[15,21],[27,21]]
};
export const DIALOGUE={
 greet:["Günaydın! Yeni bir şey üzerinde çalışıyorum.","Selam! Bugün büyük fikirler var.","Kahve içtin mi? Sprint biraz yoğun.","Yeni oyunu gördün mü? Harika ilham!","Bence bu fikri bir sonraki toplantıya taşıyalım.","Merhaba! Bugün enerji güzel."],
 code:["Bir bug yakaladım, şimdi sıra onu düzeltmekte.","Bu sistem artık çok daha akıcı çalışacak.","Frame süreleri çok daha iyi görünüyor!","Refactor tamam, kod nefes aldı.","Oyuncu kontrollerinde ince ayar yapıyorum.","Yeni mekanik için bir prototip hazırladım."],
 art:["Yeni palet tam Miami hissi veriyor.","Işık ve gölge uyumu harika oldu.","Şu siluete bir detay daha ekleyeyim.","Animasyon karelerini bitirdim!","Bu sahnenin atmosferi bambaşka.","Renkleri biraz daha cesur kullanalım."],
 sound:["Bu efektin baslarını biraz artıracağım.","Kulaklıkta çok daha iyi duyuluyor.","Yeni tema melodisi hazır gibi!","Giriş sahnesi için ortam sesi hazırlıyorum.","Ses miksini bir tur daha kontrol edeyim."],
 meeting:["Bu sprintin önceliği ne olmalı?","Oyuncu deneyimini öne koymalıyız.","Bunun için küçük bir test grubu kuralım.","Takvimi gerçekçi planlayalım.","İyi fikir! Yol haritasına ekliyorum."],
 break:["Bir kahve molasını hak ettik.","Bugün epey üretkeniz!","Kafayı biraz dağıtmak iyi geliyor.","Kahve, fikirlerin yakıtı ☕","Dinlenince çok daha yaratıcı oluyorum."],
 qa:["Tam burada bir hata buldum.","Bu cihazda performans testi yapıyorum.","Test senaryosunu bir tur daha geçeceğim.","Erişilebilirlik ayrıntılarını da kontrol edelim."],
 community:["Oyuncular yeni güncellemeyi sevmiş.","Toplulukta güzel fikirler var.","Bir geliştirici günlüğü paylaşalım!","Geri bildirimleri düzenliyorum."],
 launch:["İşte bu! Yeni bir dönüm noktası!","Bütün emeklerimize değdi.","Topluluk bunu çok sevecek!","Yayınlandı! Kutlama zamanı!"],
 idle:["Bir sonraki adımı düşünüyorum…","Yeni fikirler her yerde.","Şu an odak modundayım.","Stüdyo çok iyi görünüyor."]
};
export const CHOICES=[
 {title:"Yeni fikir yarışması!",desc:"Ekibin iki farklı önerisi var. Bugünün kaynağını nereye ayıracağız?",options:[
  {label:"✦ Yaratıcılığa yatırım",effect:{budget:-2300,rep:2,morale:5,creativity:8},text:"Atölye düzenlendi! Ekip yeni fikirlerle dolu."},
  {label:"▣ Üretim hızını artır",effect:{budget:0,rep:0,morale:-3,creativity:0,boost:26},text:"Sprint hızlandı ancak ekip biraz yoruldu."}]},
 {title:"Topluluktan yoğun ilgi!",desc:"Oyuncular erken erişim videosu istiyor. Nasıl karşılık verelim?",options:[
  {label:"▶ Fragman yayınla",effect:{fans:320,budget:-1750,rep:2},text:"Fragman yayımlandı, yeni hayranlar katıldı!"},
  {label:"♡ Özel etkinlik düzenle",effect:{fans:210,budget:-850,morale:4,rep:3},text:"Toplulukla harika bir buluşma yapıldı."}]},
 {title:"Ekip için önemli karar",desc:"Yoğun geçen günlerin ardından ekibin motivasyonunu artırma fırsatı var.",options:[
  {label:"☕ Keyifli mola",effect:{budget:-1100,morale:11},text:"Ekibin morali yükseldi!"},
  {label:"✧ Yeni ekipman",effect:{budget:-3600,rep:1,boost:36},text:"Stüdyoya yeni ekipmanlar geldi, üretim hızlandı."}]},
 {title:"Yayın öncesi kritik test",desc:"Bir proje lansmana yaklaşıyor. Ek test mi, yoksa tanıtım mı?",options:[
  {label:"🧪 Kalite testlerine odaklan",effect:{budget:-950,rep:4},text:"Hatalar azaltıldı, stüdyo güven kazandı."},
  {label:"✦ Tanıtımı güçlendir",effect:{budget:-2600,fans:260},text:"Yeni oyuncuların ilgisi arttı."}]}
];
export const DECOR = [
 {kind:"desk",x:3,y:4},{kind:"desk",x:7,y:4},{kind:"desk",x:11,y:4},{kind:"desk",x:14,y:7},
 {kind:"desk",x:3,y:8},{kind:"desk",x:8,y:8},{kind:"desk",x:11,y:8},
 {kind:"desk",x:21,y:4},{kind:"desk",x:26,y:4},{kind:"desk",x:31,y:4},{kind:"desk",x:21,y:8},{kind:"desk",x:26,y:8},{kind:"desk",x:31,y:8},
 {kind:"console",x:2,y:13},{kind:"console",x:6,y:13},{kind:"plant",x:9,y:17},{kind:"couch",x:12,y:13},
 {kind:"coffee",x:15,y:13},{kind:"plant",x:12,y:18},{kind:"meeting",x:21,y:13},
 {kind:"rack",x:28,y:13},{kind:"rack",x:31,y:13},{kind:"rack",x:33,y:13},
 {kind:"plant",x:1,y:2},{kind:"plant",x:17,y:9},{kind:"plant",x:19,y:2},{kind:"plant",x:34,y:9},
 {kind:"plant",x:18,y:19},{kind:"plant",x:34,y:19},{kind:"reception",x:7,y:20},
 {kind:"screen",x:24,y:20},{kind:"arcade",x:31,y:20},{kind:"plant",x:2,y:22}
];
export const ROOM_LABELS={creative:"GELİŞTİRME",art:"SANAT & TASARIM",studio:"SES & YAYIN",lounge:"COFFEE POINT",meeting:"TOPLANTI",server:"SERVER ROOM",lobby:"SHOWROOM"};
