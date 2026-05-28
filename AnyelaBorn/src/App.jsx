const dkd_primary_packages = [
  { dkd_icon: '💬', dkd_title: 'Anyela Intro', dkd_label: '10 dk yazılı sohbet', dkd_price: '149 TL', dkd_features: ['10 dakika tanışma sohbeti', 'Samimi ve doğal cevaplar', 'İlk deneyim için ideal'], dkd_button: 'Paketi Seç' },
  { dkd_icon: '💗', dkd_title: 'Private Chat', dkd_label: '30 dk özel sohbet', dkd_price: '499 TL', dkd_features: ['30 dakika özel yazılı sohbet', 'Öncelikli yanıt akışı', 'Kişiye özel sohbet deneyimi'], dkd_button: 'Paketi Seç', dkd_featured: true },
  { dkd_icon: '🎙️', dkd_title: 'Voice Message', dkd_label: '1 özel sesli cevap', dkd_price: '249 TL', dkd_features: ['Anyela sesiyle özel mesaj', 'İsme özel hitap seçeneği', 'MP3 teslim formatı'], dkd_button: 'Paketi Seç' },
  { dkd_icon: '🎧', dkd_title: 'Voice Chat Private', dkd_label: '30 dk sesli mesajlaşma', dkd_price: '999 TL', dkd_features: ['Sesli mesaj gönder', 'Anyela sesli cevap versin', 'Yazı yazmadan özel deneyim'], dkd_button: 'Paketi Seç' },
  { dkd_icon: '👗', dkd_title: 'Style Try-On', dkd_label: '2 özel görsel', dkd_price: '399 TL', dkd_features: ['Kıyafet referansı gönder', 'Anyela tarzına uyarlansın', '2 özel konsept görsel'], dkd_button: 'Paketi Seç' },
  { dkd_icon: '🎬', dkd_title: 'Talking Video', dkd_label: 'kişiye özel kısa video', dkd_price: '1.500 TL+', dkd_features: ['Kısa konuşmalı video', 'Özel mesaj senaryosu', '30-60 saniye konsept'], dkd_button: 'Teklif Al' },
];

const dkd_business_packages = [
  { dkd_icon: '📱', dkd_title: 'Reklam Mini', dkd_label: '1 kısa video + 1 görsel', dkd_price: '1.500 TL', dkd_features: ['15-30 sn reklam videosu', '1 kapak/görsel tasarım', 'Açıklama metni'] },
  { dkd_icon: '💎', dkd_title: 'Reklam Standart', dkd_label: '3 video + 3 görsel', dkd_price: '4.500 TL', dkd_features: ['3 kısa reklam videosu', '3 görsel paylaşım', 'Story/Reels açıklamaları'], dkd_featured: true },
  { dkd_icon: '🚀', dkd_title: 'Reklam Pro', dkd_label: '5 video + story/reels seti', dkd_price: '7.500 TL', dkd_features: ['5 kısa video', '5 premium görsel', 'Kampanya metinleri'] },
  { dkd_icon: '👑', dkd_title: 'Marka Yüzü', dkd_label: 'özel kampanya ve sponsorlu paylaşım', dkd_price: '12.000 TL+', dkd_features: ['Özel kampanya planı', 'Sponsorlu paylaşım modeli', 'Performans raporu'] },
];

const dkd_trust_items = [
  { dkd_icon: '🤖', dkd_title: 'AI karakter', dkd_text: 'Gerçek bir kişi değildir.' },
  { dkd_icon: '🛡️', dkd_title: '18+', dkd_text: 'Yetişkinlere yöneliktir.' },
  { dkd_icon: '🏦', dkd_title: 'IBAN ödeme', dkd_text: 'Manuel ödeme onayı.' },
  { dkd_icon: '✅', dkd_title: 'Dekont onayı', dkd_text: 'Erişim onay sonrası açılır.' },
];

const dkd_chat_messages = [
  { dkd_role: 'user', dkd_text: 'Merhaba Anyela 💜 seninle biraz konuşmak istiyorum. Stilinden bahseder misin?', dkd_time: '21:20' },
  { dkd_role: 'anyela', dkd_text: 'Merhaba tatlım 💕 Ben Anyela. Sanal bir AI influencer karakteriyim; stilim feminen, cesur, zarif ve yaratıcı.', dkd_time: '21:21' },
  { dkd_role: 'user', dkd_text: 'Bu kıyafet tarzıyla özel bir konsept hazırlayabilir misin?', dkd_time: '21:22', dkd_attachment: true },
  { dkd_role: 'anyela', dkd_text: 'Bu tarz sana çok yakışır! İstersen bunu özel görsel setine veya kısa konuşmalı videoya çevirebiliriz ✨', dkd_time: '21:24', dkd_voice: true },
];

const dkd_faq_items = [
  { dkd_question: 'Anyela gerçek bir kişi mi?', dkd_answer: 'Hayır. Anyela Born, eğlence ve yaratıcı içerik amaçlı tasarlanmış sanal bir AI influencer karakteridir.' },
  { dkd_question: 'Ödemeyi nasıl yaparım?', dkd_answer: 'İlk sürümde IBAN ödemesi alınır. Açıklama kodunu yazıp dekontu site üzerinden yüklersiniz.' },
  { dkd_question: 'İçeriklerim gizli mi?', dkd_answer: 'Yüklediğiniz görsel, ses ve dekontlar yalnızca sipariş ve ödeme onayı için kullanılır.' },
  { dkd_question: 'Reklam içerikleri nasıl paylaşılır?', dkd_answer: 'Marka iş birliklerinde içerikler reklam/sponsorlu ibaresiyle şeffaf şekilde hazırlanır.' },
];

function DkdSectionTitle(dkd_props) {
  return (
    <div className="dkd-section-title">
      <span>{dkd_props.dkd_kicker}</span>
      <h2>{dkd_props.dkd_title}</h2>
      {dkd_props.dkd_text ? <p>{dkd_props.dkd_text}</p> : null}
    </div>
  );
}

function DkdPackageCard(dkd_props) {
  const dkd_package_item = dkd_props.dkd_package_item;
  return (
    <article className={`dkd-card dkd-package-card ${dkd_package_item.dkd_featured ? 'dkd-card-featured' : ''}`}>
      {dkd_package_item.dkd_featured ? <div className="dkd-popular-badge">En popüler</div> : null}
      <div className="dkd-package-icon">{dkd_package_item.dkd_icon}</div>
      <div>
        <h3>{dkd_package_item.dkd_title}</h3>
        <p className="dkd-package-label">{dkd_package_item.dkd_label}</p>
      </div>
      <strong className="dkd-price">{dkd_package_item.dkd_price}</strong>
      <ul>{dkd_package_item.dkd_features.map((dkd_feature_item) => <li key={dkd_feature_item}>{dkd_feature_item}</li>)}</ul>
      <a className="dkd-small-button" href="#dkd-payment">{dkd_package_item.dkd_button || 'Paketi Seç'}</a>
    </article>
  );
}

function DkdChatPreview() {
  return (
    <section className="dkd-section dkd-chat-preview-section" id="dkd-chat-preview">
      <DkdSectionTitle dkd_kicker="Sohbet Önizleme" dkd_title="Yazı, ses, görsel ve video isteğini tek akışta topla" dkd_text="İlk sürümde sohbet manuel/yari manuel yönetilir; ödeme onayından sonra kullanıcıya özel akış başlatılır." />
      <div className="dkd-chat-phone">
        <div className="dkd-chat-header"><div className="dkd-avatar dkd-avatar-small">A</div><div><strong>Anyela</strong><span>AI Influencer • şu an çevrimiçi</span></div></div>
        <div className="dkd-timer-card"><span>30 DK Private Chat</span><strong>27:14</strong><small>Kalan süre</small></div>
        <div className="dkd-message-list">
          {dkd_chat_messages.map((dkd_message_item) => (
            <div className={`dkd-message-row ${dkd_message_item.dkd_role === 'user' ? 'dkd-message-row-user' : 'dkd-message-row-anyela'}`} key={`${dkd_message_item.dkd_time}-${dkd_message_item.dkd_role}`}>
              <div className="dkd-message-bubble">
                <p>{dkd_message_item.dkd_text}</p>
                {dkd_message_item.dkd_attachment ? <div className="dkd-attachment-preview">Kıyafet referansı yüklendi</div> : null}
                {dkd_message_item.dkd_voice ? <div className="dkd-voice-preview"><span>▶</span><div className="dkd-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>00:26</small></div> : null}
                <small>{dkd_message_item.dkd_time}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="dkd-voice-loading"><span>🎙️</span><div><strong>Sesli yanıtın hazırlanıyor...</strong><p>Sana özel ses birazdan burada olacak.</p></div></div>
        <div className="dkd-chat-input"><button>📎</button><span>Mesajınızı buraya yazın...</span><button>➤</button></div>
      </div>
    </section>
  );
}

function DkdPaymentPreview() {
  return (
    <section className="dkd-section dkd-payment-section" id="dkd-payment">
      <DkdSectionTitle dkd_kicker="Ödeme ve Başlangıç" dkd_title="IBAN öde, dekont yükle, Anyela deneyimini başlat" dkd_text="Sanal POS gelmeden önce hızlı satış için manuel ödeme ve dekont onayı akışı kullanılır." />
      <div className="dkd-payment-grid">
        <div className="dkd-card dkd-selected-package-card"><div className="dkd-media-mini"></div><div><span>Seçilen Paket</span><h3>Private Chat – 30 DK</h3><ul><li>Anyela ile 1’e 1 özel sohbet</li><li>30 dakika kesintisiz sohbet</li><li>Gizli ve güvenli iletişim</li></ul></div><strong>499 TL</strong></div>
        <div className="dkd-card dkd-steps-card">{['Paket Seçildi', 'IBAN ile Ödeme', 'Dekont Yükle', 'Sohbet Aktivasyonu'].map((dkd_step_item, dkd_step_index) => <div className={`dkd-step-row ${dkd_step_index === 1 ? 'dkd-step-active' : ''}`} key={dkd_step_item}><span>{dkd_step_index + 1}</span><div><strong>{dkd_step_item}</strong><p>{dkd_step_index === 1 ? 'Ödemenizi IBAN’a yapın.' : 'Onay adımı takip edilir.'}</p></div></div>)}</div>
        <div className="dkd-card dkd-iban-card"><h3>IBAN ile Ödeme</h3><div className="dkd-iban-row"><span>Banka</span><strong>Banka adı eklenecek</strong></div><div className="dkd-iban-row"><span>Alıcı</span><strong>Alıcı adı eklenecek</strong></div><div className="dkd-iban-row"><span>IBAN</span><strong>TR00 0000 0000 0000 0000 0000 00</strong></div><div className="dkd-reference-code">ANYELA - kullaniciadi - 30DK</div></div>
        <div className="dkd-card dkd-upload-card"><span>☁️</span><strong>Dekont Yükle</strong><p>JPG, PNG veya PDF • Maks. 10 MB</p><button>Dekont Dosyası Seç</button></div>
      </div>
    </section>
  );
}

function DkdBusinessSection() {
  return (
    <section className="dkd-section dkd-business-section" id="dkd-business">
      <DkdSectionTitle dkd_kicker="Reklam Paketleri" dkd_title="Anyela reklam yüzünüz olsun" dkd_text="Restoran, kafe, butik, güzellik salonu, otel, emlak ve dijital ürünler için AI destekli reklam içerikleri." />
      <div className="dkd-business-hero-card"><div><span>Premium AI influencer reklamları</span><h3>Markanız Anyela ile daha dikkat çekici görünsün</h3><p>Ürün tanıtımı, story/reels seti, kampanya içeriği ve sponsorlu paylaşım planı tek yerde.</p><a className="dkd-primary-button" href="#dkd-lead-form">Teklif Al</a></div><div className="dkd-business-visual"><div className="dkd-laptop">A</div></div></div>
      <div className="dkd-business-package-list">{dkd_business_packages.map((dkd_package_item) => <DkdPackageCard dkd_package_item={dkd_package_item} key={dkd_package_item.dkd_title} />)}</div>
      <div className="dkd-card dkd-compliance-card"><span>📣</span><div><h3>Sponsorlu / Reklam etiketi ile paylaşım</h3><p>Marka iş birlikleri şeffaf şekilde reklam/sponsorlu ibaresiyle hazırlanır. Bu güven ve profesyonellik için önemlidir.</p></div></div>
      <form className="dkd-card dkd-lead-form" id="dkd-lead-form"><h3>Markanızı Anlayalım</h3><label>Marka Adı<input placeholder="Markanızı yazın" /></label><label>Hedef<select><option>Hedefinizi seçin</option><option>Satış artırma</option><option>Takipçi büyütme</option><option>Ürün tanıtımı</option></select></label><label>İçerik Türü<select><option>İçerik türünü seçin</option><option>Reels / Shorts</option><option>Story seti</option><option>Konuşmalı video</option></select></label><label>Bütçe<select><option>Bütçe aralığını seçin</option><option>1.500 - 4.500 TL</option><option>4.500 - 12.000 TL</option><option>12.000 TL+</option></select></label><button type="button">Teklif Talep Et</button></form>
    </section>
  );
}

function DkdAnyelaBornApp() {
  return (
    <main className="dkd-app-shell">
      <header className="dkd-site-header"><a className="dkd-brand" href="#dkd-home" aria-label="Anyela Born Club ana sayfa"><strong>Anyela</strong><span>Born Club</span></a><nav className="dkd-desktop-nav" aria-label="Ana menü"><a href="#dkd-home">Ana Sayfa</a><a href="#dkd-packages">Paketler</a><a href="#dkd-chat-preview">Sohbet</a><a href="#dkd-payment">Ödeme</a><a href="#dkd-business">Reklam</a></nav><div className="dkd-header-actions"><a href="#dkd-payment">Giriş Yap</a><button aria-label="Menü">☰</button></div></header>
      <section className="dkd-hero-section" id="dkd-home"><div className="dkd-hero-copy"><span className="dkd-kicker">✦ Premium AI influencer deneyimi</span><h1>Anyela ile konuş, <em>sesli cevap al,</em> özel görsel ve video iste</h1><p>Anyela Born, eğlence ve yaratıcı içerik amaçlı tasarlanmış sanal bir AI influencer karakteridir. Yazılı sohbet, sesli cevap, kıyafet konsepti, özel video ve marka reklamı tek sayfada.</p><div className="dkd-hero-actions"><a className="dkd-primary-button" href="#dkd-payment">10 DK Tanışma</a><a className="dkd-secondary-button" href="#dkd-packages">Paketleri Gör</a></div></div><div className="dkd-hero-media-card" aria-label="Anyela konuşan video önizleme"><div className="dkd-portrait-glow"><div className="dkd-portrait-face"><span>A</span></div><button aria-label="Videoyu oynat">▶</button><div className="dkd-video-badge"><strong>Konuşan Video Önizleme</strong><small>Anyela ile tanışın • 00:45</small></div></div></div></section>
      <section className="dkd-trust-row" aria-label="Güven bilgileri">{dkd_trust_items.map((dkd_trust_item) => <div className="dkd-card dkd-trust-card" key={dkd_trust_item.dkd_title}><span>{dkd_trust_item.dkd_icon}</span><strong>{dkd_trust_item.dkd_title}</strong><p>{dkd_trust_item.dkd_text}</p></div>)}</section>
      <section className="dkd-section" id="dkd-packages"><DkdSectionTitle dkd_kicker="Popüler Paketler" dkd_title="Takipçiyi müşteriye çeviren deneyim paketleri" dkd_text="İlk satış için net, kolay anlaşılır ve hızlı teslim edilebilir paketler." /><div className="dkd-package-grid">{dkd_primary_packages.map((dkd_package_item) => <DkdPackageCard dkd_package_item={dkd_package_item} key={dkd_package_item.dkd_title} />)}</div></section>
      <DkdChatPreview />
      <DkdPaymentPreview />
      <DkdBusinessSection />
      <section className="dkd-section dkd-faq-section" id="dkd-faq"><DkdSectionTitle dkd_kicker="SSS" dkd_title="Kullanıcıyı ödeme öncesi rahatlatan net cevaplar" dkd_text="Güven, açıklık ve sınırlar net olursa ödeme kararı daha kolay gelir." /><div className="dkd-faq-list">{dkd_faq_items.map((dkd_faq_item) => <details className="dkd-card dkd-faq-item" key={dkd_faq_item.dkd_question}><summary>{dkd_faq_item.dkd_question}</summary><p>{dkd_faq_item.dkd_answer}</p></details>)}</div></section>
      <footer className="dkd-footer"><a className="dkd-brand" href="#dkd-home"><strong>Anyela</strong><span>Born Club</span></a><p>Premium AI influencer deneyimi sunan özel platform.</p><div className="dkd-footer-links"><a href="#dkd-packages">Paketler</a><a href="#dkd-chat-preview">Sohbet</a><a href="#dkd-business">Reklam</a><a href="#dkd-faq">SSS</a></div><small>© 2026 Anyela Born Club • DrabornEagle</small></footer>
    </main>
  );
}

export default DkdAnyelaBornApp;
