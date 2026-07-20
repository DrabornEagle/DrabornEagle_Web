import { articles, categories, dailyBrief, trendingTopics } from './mock-data.js';

const app = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const toastRoot = document.getElementById('toast-root');
const state = {
  category: 'all',
  query: '',
  saved: new Set(JSON.parse(localStorage.getItem('drabornnews-saved') || '[]')),
  compact: localStorage.getItem('drabornnews-view') === 'compact'
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char]));

function filteredArticles() {
  const query = state.query.trim().toLocaleLowerCase('tr-TR');
  return articles.filter((article) => {
    const categoryMatch = state.category === 'all' || article.category === state.category;
    const haystack = [article.title, article.summary, article.categoryLabel, ...article.sourceNames]
      .join(' ').toLocaleLowerCase('tr-TR');
    return categoryMatch && (!query || haystack.includes(query));
  });
}

function render() {
  const list = filteredArticles();
  app.innerHTML = `
    <header class="topbar">
      <div class="container topbar-inner">
        <a class="brand" href="#" data-home><span>D</span><b>DraBorn<em>News</em></b><small>AI NEWS INTELLIGENCE</small></a>
        <nav><a href="#feed">Akış</a><a href="#brief">Günün Özeti</a><a href="#sources">Kaynaklar</a><a href="#about">Nasıl Çalışır?</a></nav>
        <label class="search"><i>⌕</i><input id="search" type="search" placeholder="Haber veya kaynak ara" value="${escapeHtml(state.query)}" /></label>
        <button class="saved-button" data-saved-list title="Kaydedilenler">☆<b>${state.saved.size}</b></button>
      </div>
    </header>

    <main>
      <section class="hero" id="brief">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="live"><i></i> CANLI HABER ZEKA AKIŞI</span>
            <h1>Haberi değil,<br><em>gerçeğin özünü</em> oku.</h1>
            <p>DraBornNews farklı kaynakları karşılaştırır, önemli noktaları özetler ve her haberin güven seviyesini açıkça gösterir.</p>
            <div class="hero-actions"><button class="primary" data-scroll>Akışı Keşfet →</button><button class="ghost" data-play-brief>▶ Sesli Özeti Dinle</button></div>
            <div class="proof"><span><b>24+</b> kaynak</span><span><b>6</b> kategori</span><span><b>AI</b> karşılaştırma</span></div>
          </div>
          <article class="brief-card">
            <div class="brief-head"><span>GÜNLÜK AKILLI BÜLTEN</span><b>${dailyBrief.duration}</b></div>
            <div class="wave">${Array.from({ length: 24 }, (_, index) => `<i style="--h:${24 + ((index * 19) % 62)}%"></i>`).join('')}</div>
            <h2>${dailyBrief.title}</h2><p>${dailyBrief.text}</p>
            <div class="brief-foot"><span>${dailyBrief.itemCount} haber · Türkçe</span><button data-play-brief>▶</button></div>
          </article>
        </div>
      </section>

      <section class="category-bar"><div class="container category-scroll">
        ${categories.map((category) => `<button class="chip ${state.category === category.id ? 'active' : ''}" data-category="${category.id}"><span>${category.icon}</span>${category.label}</button>`).join('')}
      </div></section>

      <section class="container layout" id="feed">
        <div>
          <div class="feed-title">
            <div><span>AKILLI AKIŞ</span><h2>${feedTitle()}</h2><p>${list.length} haber · Kaynakları karşılaştırılmış özetler</p></div>
            <div class="view"><button class="${!state.compact ? 'active' : ''}" data-view="cards">▦</button><button class="${state.compact ? 'active' : ''}" data-view="compact">☷</button></div>
          </div>
          <div class="news-list ${state.compact ? 'compact' : ''}">${list.length ? list.map(renderCard).join('') : emptyState()}</div>
        </div>
        ${renderSidebar()}
      </section>
    </main>

    <footer id="about"><div class="container footer-grid">
      <div class="footer-brand"><span>D</span><div><b>DraBornNews</b><p>Haberin özü, kaynağı ve güven skoru.</p></div></div>
      <div><b>Platform</b><a href="#feed">Akıllı Akış</a><a href="#brief">Sesli Bülten</a><a href="#sources">Kaynaklar</a></div>
      <div><b>Şeffaflık</b><a href="#about">AI Kullanımı</a><a href="#about">Kaynak Politikası</a><a href="#about">Düzeltmeler</a></div>
      <div><b>Durum</b><span class="status"><i></i> Demo sistem aktif</span><small>v0.1.0</small></div>
    </div></footer>`;
  bindEvents();
}

function renderCard(article) {
  const saved = state.saved.has(article.id);
  return `<article class="news-card" data-open="${article.id}">
    <div class="art theme-${article.theme}"><div class="grid"></div><span>${article.icon}</span><small>${article.categoryLabel}</small></div>
    <div class="news-body">
      <div class="meta"><b>${article.eyebrow}</b><span>${article.publishedAt}</span><span>•</span><span>${article.readTime} okuma</span></div>
      <h3>${article.title}</h3><p>${article.summary}</p>
      <div class="sources"><div>${article.sourceNames.slice(0, 3).map((source) => `<i title="${escapeHtml(source)}">${source[0]}</i>`).join('')}</div><span><b>${article.sourceCount} kaynak</b> karşılaştırıldı</span></div>
      <div class="card-foot"><span class="trust"><i></i> Güven ${article.trustScore}/100</span><div><button data-speak="${article.id}">◖</button><button class="${saved ? 'saved' : ''}" data-save="${article.id}">${saved ? '★' : '☆'}</button><button class="open" data-open="${article.id}">Haberi Aç →</button></div></div>
    </div>
  </article>`;
}

function renderSidebar() {
  return `<aside>
    <section class="side-card" id="sources"><div class="side-head"><b>GÜNDEMDE</b><span>Canlı</span></div><div class="trends">
      ${trendingTopics.map(([title, subtitle], index) => `<button data-topic="${title.replace('#', '')}"><b>0${index + 1}</b><span><strong>${title}</strong><small>${subtitle}</small></span><i>↗</i></button>`).join('')}
    </div></section>
    <section class="side-card trust-card"><div class="side-head"><b>KAYNAK GÜVENİ</b><span>Şeffaf</span></div><div class="score"><div><strong>92</strong><small>/100</small></div></div><h3>Çoklu kaynak doğrulaması</h3><p>Kaynak çeşitliliği, birincil açıklama, tarih tutarlılığı ve içerik benzerliği birlikte değerlendirilir.</p><button class="link-button" data-trust>Nasıl hesaplanıyor? →</button></section>
    <section class="newsletter"><span>✦ DRA AI BRIEF</span><h3>Gürültüyü kapat.<br>Önemli olanı al.</h3><p>Günün en önemli oyun ve teknoloji haberleri tek bir kısa bültende.</p><button data-play-brief>Bugünün bültenini dinle</button></section>
  </aside>`;
}

function feedTitle() {
  if (state.query) return `“${escapeHtml(state.query)}” sonuçları`;
  const category = categories.find((item) => item.id === state.category);
  return state.category === 'all' ? 'Senin için öne çıkanlar' : `${category?.label || ''} haberleri`;
}

function emptyState() {
  return `<div class="empty"><span>⌕</span><h3>Haber bulunamadı.</h3><p>Başka bir kelime veya kategori deneyebilirsin.</p><button data-reset>Akışa dön</button></div>`;
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
    state.category = button.dataset.category; render(); document.querySelector('#feed')?.scrollIntoView({ behavior: 'smooth' });
  }));
  document.getElementById('search')?.addEventListener('input', (event) => {
    state.query = event.target.value; render(); const input = document.getElementById('search'); input?.focus(); input?.setSelectionRange(state.query.length, state.query.length);
  });
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
    state.compact = button.dataset.view === 'compact'; localStorage.setItem('drabornnews-view', state.compact ? 'compact' : 'cards'); render();
  }));
  document.querySelectorAll('[data-save]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); toggleSaved(button.dataset.save); }));
  document.querySelectorAll('[data-speak]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const article = articles.find((item) => item.id === button.dataset.speak); speak(`${article.title}. ${article.summary}. Neden önemli? ${article.whyImportant}`); }));
  document.querySelectorAll('[data-open]').forEach((element) => element.addEventListener('click', (event) => { const id = event.target.closest('[data-open]')?.dataset.open; if (id) openArticle(id); }));
  document.querySelectorAll('[data-play-brief]').forEach((button) => button.addEventListener('click', () => speak(`${dailyBrief.title}. ${dailyBrief.text}`)));
  document.querySelector('[data-scroll]')?.addEventListener('click', () => document.querySelector('#feed')?.scrollIntoView({ behavior: 'smooth' }));
  document.querySelector('[data-home]')?.addEventListener('click', (event) => { event.preventDefault(); state.category = 'all'; state.query = ''; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.querySelector('[data-trust]')?.addEventListener('click', openTrustInfo);
  document.querySelector('[data-reset]')?.addEventListener('click', () => { state.category = 'all'; state.query = ''; render(); });
  document.querySelectorAll('[data-topic]').forEach((button) => button.addEventListener('click', () => { state.query = button.dataset.topic; render(); }));
  document.querySelector('[data-saved-list]')?.addEventListener('click', openSavedList);
}

function toggleSaved(id) {
  if (state.saved.has(id)) { state.saved.delete(id); toast('Haber kaydedilenlerden çıkarıldı.'); }
  else { state.saved.add(id); toast('Haber okuma listene kaydedildi.'); }
  localStorage.setItem('drabornnews-saved', JSON.stringify([...state.saved])); render();
}

function openArticle(id) {
  const article = articles.find((item) => item.id === id); if (!article) return;
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close><article class="article-modal"><button class="close" data-close>×</button><div class="modal-art theme-${article.theme}"><span>${article.icon}</span><small>${article.categoryLabel}</small></div><div class="modal-content"><div class="meta"><b>${article.eyebrow}</b><span>${article.publishedAt}</span><span>•</span><span>${article.readTime}</span></div><h2>${article.title}</h2><p class="lead">${article.summary}</p><section class="important"><b>NEDEN ÖNEMLİ?</b><p>${article.whyImportant}</p></section><h3>Öne çıkan ayrıntılar</h3><ul>${article.details.map((detail) => `<li>${detail}</li>`).join('')}</ul><div class="verification"><div><strong>${article.trustScore}/100</strong><span>Güven skoru</span></div><div><strong>${article.sourceCount}</strong><span>Karşılaştırılan kaynak</span></div><div><strong>${article.sourceNames.length}</strong><span>Ana kaynak</span></div></div><div class="modal-sources"><span>Kaynaklar:</span>${article.sourceNames.map((source) => `<b>${source}</b>`).join('')}</div><div class="modal-actions"><button class="ghost light" data-modal-speak>◖ Sesli Dinle</button><button class="primary" data-modal-save>${state.saved.has(article.id) ? '★ Kaydedildi' : '☆ Kaydet'}</button></div><p class="demo-note">Bu v0.1 demo içeriğidir. Gerçek haber toplama, kaynak bağlantıları ve AI işleme sonraki backend aşamasında bağlanacaktır.</p></div></article></div>`;
  bindModalClose();
  document.querySelector('[data-modal-speak]')?.addEventListener('click', () => speak(`${article.title}. ${article.summary}. ${article.whyImportant}. ${article.details.join('. ')}`));
  document.querySelector('[data-modal-save]')?.addEventListener('click', () => { toggleSaved(article.id); openArticle(article.id); });
}

function openTrustInfo() {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close><article class="info-modal"><button class="close" data-close>×</button><span>DRA TRUST ENGINE</span><h2>Güven skoru nasıl çalışacak?</h2><p>v0.1 demoda puanlar örnek veridir. Gerçek sistemde şu sinyaller kullanılacaktır:</p><ol><li>Birincil veya resmî kaynak bulunması</li><li>Bağımsız kaynak sayısı ve çeşitliliği</li><li>Başlık ile içerik arasındaki tutarlılık</li><li>Tarih, kişi, kurum ve sayıların çapraz kontrolü</li><li>Kaynak geçmişi ve düzeltme kayıtları</li></ol><button class="primary" data-close>Anladım</button></article></div>`;
  bindModalClose();
}

function openSavedList() {
  const savedArticles = articles.filter((article) => state.saved.has(article.id));
  if (!savedArticles.length) return toast('Henüz kaydettiğin bir haber yok.', 'info');
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close><article class="info-modal"><button class="close" data-close>×</button><span>OKUMA LİSTEM</span><h2>Kaydedilen haberler</h2><div class="saved-list">${savedArticles.map((article) => `<button data-saved-open="${article.id}"><span>${article.icon}</span><div><b>${article.title}</b><small>${article.categoryLabel} · ${article.readTime}</small></div><i>→</i></button>`).join('')}</div></article></div>`;
  bindModalClose(); document.querySelectorAll('[data-saved-open]').forEach((button) => button.addEventListener('click', () => openArticle(button.dataset.savedOpen)));
}

function bindModalClose() {
  document.querySelectorAll('[data-close]').forEach((element) => element.addEventListener('click', (event) => { if (event.target === element || element.classList.contains('close') || element.classList.contains('primary')) modalRoot.innerHTML = ''; }));
}

function speak(text) {
  if (!('speechSynthesis' in window)) return toast('Bu tarayıcı sesli okumayı desteklemiyor.', 'danger');
  speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'tr-TR'; utterance.rate = .96; speechSynthesis.speak(utterance); toast('Sesli özet başlatıldı.');
}

function toast(message, tone = 'success') {
  const element = document.createElement('div'); element.className = `toast toast-${tone}`; element.innerHTML = `<span>${tone === 'danger' ? '!' : tone === 'info' ? 'i' : '✓'}</span><p>${escapeHtml(message)}</p>`; toastRoot.appendChild(element); requestAnimationFrame(() => element.classList.add('show')); setTimeout(() => { element.classList.remove('show'); setTimeout(() => element.remove(), 250); }, 2500);
}

render();
