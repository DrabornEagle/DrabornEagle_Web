// Original, fictional property listings. All prices belong to the local game economy.
export const BUILDINGS=[
 {id:"aurora",name:"AURORA",x:-665,y:65,w:130,d:132,h:365,accent:"#ff8cce",glass:"#84cbd7",floors:32},
 {id:"azure",name:"AZURE",x:-470,y:275,w:120,d:125,h:295,accent:"#71efdf",glass:"#79c5db",floors:26},
 {id:"solstice",name:"SOLSTICE",x:-650,y:625,w:145,d:145,h:425,accent:"#cfb1ff",glass:"#9baddc",floors:38},
 {id:"marina",name:"MARINA ONE",x:1635,y:40,w:165,d:155,h:465,accent:"#74ecdf",glass:"#78becd",floors:42},
 {id:"coral",name:"CORAL",x:1920,y:340,w:140,d:150,h:350,accent:"#ffb4ba",glass:"#a4bdd6",floors:31},
 {id:"vista",name:"VISTA",x:-280,y:1310,w:135,d:145,h:310,accent:"#ffcf8e",glass:"#8cbecc",floors:28}
];
export const PROPERTY_TYPES={land:"Arsa",office:"Ofis",home:"Konut"};
export const PROPERTIES=[
 {id:"land-01",type:"land",name:"DraBornLand · Sahil Parseli",district:"Ocean Boulevard",price:65000,area:640,x:110,y:1340,w:270,d:245,accent:"#71ebce",features:["Sahile yürüyüş mesafesi","Köşe parsel","Şehir yoluna cephe"],description:"Palmiyeli bulvarın arkasında, yeni hayallerine yer açan bir şehir arsası."},
 {id:"land-02",type:"land",name:"DraBornLand · Palm Garden",district:"Palm Avenue",price:45000,area:480,x:580,y:1650,w:250,d:230,accent:"#f7cf8d",features:["Park komşusu","Sakin mahalle","Yola doğrudan bağlantı"],description:"Yeşil avlu ve bisiklet yolunun yanında, şehrin yeni gelişen mahallesinde bir parsel."},
 {id:"land-03",type:"land",name:"DraBornLand · Marina Parseli",district:"Marina District",price:95000,area:920,x:1760,y:810,w:330,d:270,accent:"#caafff",features:["Marina bölgesi","Geniş cephe","Ticari bölge"],description:"Gökdelenlerin ve marinadaki teknelerin buluştuğu bölgede geniş bir arsa."},
 {id:"office-azure",type:"office",name:"Azure Creative Office",district:"Azure Tower · Kat 08",price:125000,area:180,building:"azure",x:-410,y:408,z:132,accent:"#71efdf",features:["Açık çalışma alanı","Panoramik cam cephe","Toplantı odası"],description:"Yaratıcı ekipler için ışık alan, modern bir kule ofisi. Mevcut stüdyonu taşımadan portföyüne eklenir."},
 {id:"office-marina",type:"office",name:"Marina Business Loft",district:"Marina One · Kat 12",price:245000,area:310,building:"marina",x:1720,y:196,z:182,accent:"#74ecdf",features:["Deniz manzarası","Teras kullanımı","Marina adresi"],description:"Sahil şeridindeki Marina One gökdeleninde, geniş ve aydınlık bir iş alanı."},
 {id:"home-aurora",type:"home",name:"Aurora Ocean Residence",district:"Aurora Tower · Kat 21",price:285000,area:125,building:"aurora",x:-600,y:197,z:265,accent:"#ff8cce",features:["2+1 konut","Okyanus manzarası","Ortak havuz"],description:"Pembe ışıklı Aurora kulesinde, Miami kıyılarına bakan modern bir konut."},
 {id:"home-solstice",type:"home",name:"Solstice Sky Penthouse",district:"Solstice Tower · Kat 36",price:780000,area:260,building:"solstice",x:-578,y:772,z:365,accent:"#cfb1ff",features:["Çatı katı","Özel teras","Şehir panoraması"],description:"Solstice gökdeleninin zirvesinde, şehrin neon ışıklarına açılan bir çatı katı."},
 {id:"home-coral",type:"home",name:"Coral Bay Apartment",district:"Coral Tower · Kat 16",price:195000,area:95,building:"coral",x:1990,y:491,z:190,accent:"#ffb4ba",features:["1+1 konut","Balkon","Sahil yürüyüş yolu"],description:"Mercan tonlu cam cephelerin arkasında, sahil yaşamının ritmini yakalayan bir daire."},
 {id:"home-vista",type:"home",name:"Vista Park Residence",district:"Vista Tower · Kat 14",price:165000,area:110,building:"vista",x:-212,y:1456,z:165,accent:"#ffcf8e",features:["2+1 konut","Park manzarası","Bisiklet parkı"],description:"Palm Garden mahallesinde, yeşil meydanın üzerinde yükselen ferah bir konut."}
];
export const findProperty=id=>PROPERTIES.find(p=>p.id===id);
