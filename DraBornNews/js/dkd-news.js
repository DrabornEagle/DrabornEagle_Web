(() => {
  'use strict';
  const dkd_state = { items: [], category: 'Tümü', topic: '', query: '', savedOnly: false, visible: 12, sort: 'new', active: null, toastTimer: null };
  const dkd_get = (dkd_id) => document.getElementById(dkd_id);
  const dkd_dateFormat = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Istanbul' });
  const dkd_relativeFormat = new Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' });

  function dkd_savedIds() {
    try { return new Set(JSON.parse(localStorage.getItem('dkd_news_saved') || '[]').filter((dkd_id) => typeof dkd_id === 'string')); }
    catch { return new Set(); }
  }
  let dkd_saved = dkd_savedIds();

  function dkd_time(dkd_value) {
    const dkd_date = new Date(dkd_value);
    if (Number.isNaN(dkd_date.getTime())) return '';
    const dkd_hours = Math.floor((Date.now() - dkd_date.getTime()) / 3600000);
    if (dkd_hours >= 0 && dkd_hours < 24) return dkd_hours < 1 ? 'Az önce' : dkd_relativeFormat.format(-dkd_hours, 'hour');
    return dkd_dateFormat.format(dkd_date);
  }

  function dkd_safeUrl(dkd_value) {
    try { const dkd_url = new URL(dkd_value); return dkd_url.protocol === 'https:' ? dkd_url.href : ''; }
    catch { return ''; }
  }

  function dkd_image(dkd_container, dkd_story, dkd_alt) {
    const dkd_url = dkd_safeUrl(dkd_story.image);
    if (!dkd_url) return;
    const dkd_element = document.createElement('img');
    dkd_element.src = dkd_url;
    dkd_element.alt = dkd_alt ? dkd_story.title : '';
    dkd_element.loading = 'lazy';
    dkd_element.referrerPolicy = 'no-referrer';
    dkd_element.onerror = () => dkd_element.remove();
    dkd_container.append(dkd_element);
  }

  function dkd_node(dkd_tag, dkd_class, dkd_text) {
    const dkd_element = document.createElement(dkd_tag);
    if (dkd_class) dkd_element.className = dkd_class;
    if (dkd_text !== undefined) dkd_element.textContent = dkd_text;
    return dkd_element;
  }

  function dkd_toast(dkd_message) {
    const dkd_element = dkd_get('dkd-toast');
    dkd_element.textContent = dkd_message;
    dkd_element.classList.add('dkd-show');
    clearTimeout(dkd_state.toastTimer);
    dkd_state.toastTimer = setTimeout(() => dkd_element.classList.remove('dkd-show'), 2600);
  }

  function dkd_toggleSaved(dkd_story) {
    if (dkd_saved.has(dkd_story.id)) dkd_saved.delete(dkd_story.id);
    else dkd_saved.add(dkd_story.id);
    try { localStorage.setItem('dkd_news_saved', JSON.stringify([...dkd_saved])); } catch { /* Private browsing may disable storage. */ }
    dkd_toast(dkd_saved.has(dkd_story.id) ? 'Haber kaydedildi' : 'Kayıt kaldırıldı');
    dkd_render();
    if (dkd_state.active?.id === dkd_story.id) dkd_get('dkd-reader-save').textContent = dkd_saved.has(dkd_story.id) ? 'Kaydedildi ✓' : 'Kaydet';
  }

  function dkd_filtered() {
    const dkd_query = dkd_state.query.toLocaleLowerCase('tr-TR').trim();
    const dkd_topic = dkd_state.topic.toLocaleLowerCase('tr-TR');
    return dkd_state.items.filter((dkd_story) => {
      if (dkd_state.savedOnly && !dkd_saved.has(dkd_story.id)) return false;
      if (dkd_state.category !== 'Tümü' && dkd_story.category !== dkd_state.category && !(dkd_state.category === 'Teknoloji' && dkd_story.category !== 'Oyun')) return false;
      const dkd_haystack = `${dkd_story.title} ${dkd_story.summary} ${dkd_story.source} ${dkd_story.category}`.toLocaleLowerCase('tr-TR');
      if (dkd_topic && dkd_story.category.toLocaleLowerCase('tr-TR') !== dkd_topic && !dkd_haystack.includes(dkd_topic)) return false;
      return !dkd_query || dkd_haystack.includes(dkd_query);
    }).sort((dkd_left, dkd_right) => dkd_state.sort === 'old' ? Date.parse(dkd_left.publishedAt) - Date.parse(dkd_right.publishedAt) : Date.parse(dkd_right.publishedAt) - Date.parse(dkd_left.publishedAt));
  }

  function dkd_heroCard(dkd_story) {
    const dkd_element = dkd_node('article', 'dkd-hero-card');
    dkd_element.tabIndex = 0;
    dkd_element.setAttribute('role', 'button');
    dkd_element.setAttribute('aria-label', `${dkd_story.title} haberini oku`);
    dkd_image(dkd_element, dkd_story, false);
    const dkd_content = dkd_node('div', 'dkd-hero-content');
    dkd_content.append(dkd_node('span', 'dkd-pill', dkd_story.category), dkd_node('h2', '', dkd_story.title), dkd_node('p', '', dkd_story.summary || 'Ayrıntılar kaynağında.'));
    const dkd_meta = dkd_node('div', 'dkd-hero-meta');
    dkd_meta.append(dkd_node('span', '', dkd_story.source), dkd_node('i'), dkd_node('span', '', dkd_time(dkd_story.publishedAt)));
    dkd_content.append(dkd_meta);
    dkd_element.append(dkd_content);
    dkd_element.addEventListener('click', () => dkd_open(dkd_story));
    dkd_element.addEventListener('keydown', (dkd_event) => { if (dkd_event.key === 'Enter' || dkd_event.key === ' ') { dkd_event.preventDefault(); dkd_open(dkd_story); } });
    return dkd_element;
  }

  function dkd_selectHeroes(dkd_items) {
    if (!dkd_items.length) return [];
    const dkd_first = dkd_items.find((dkd_story) => dkd_story.category === 'Oyun' && dkd_story.image) || dkd_items.find((dkd_story) => dkd_story.image) || dkd_items[0];
    const dkd_remaining = dkd_items.filter((dkd_story) => dkd_story.id !== dkd_first.id);
    const dkd_second = dkd_remaining.find((dkd_story) => dkd_story.category !== dkd_first.category && dkd_story.image) || dkd_remaining[0];
    const dkd_third = dkd_remaining.find((dkd_story) => dkd_story.id !== dkd_second?.id && dkd_story.source !== dkd_first.source && dkd_story.image) || dkd_remaining.find((dkd_story) => dkd_story.id !== dkd_second?.id);
    return [dkd_first, dkd_second, dkd_third].filter(Boolean);
  }

  function dkd_articleCard(dkd_story) {
    const dkd_article = dkd_node('article', 'dkd-card');
    const dkd_cover = dkd_node('div', 'dkd-card-image');
    dkd_image(dkd_cover, dkd_story, false);
    dkd_cover.append(dkd_node('span', 'dkd-card-type', dkd_story.category));
    const dkd_body = dkd_node('div', 'dkd-card-body');
    const dkd_meta = dkd_node('div', 'dkd-card-meta');
    dkd_meta.append(dkd_node('span', 'dkd-card-source', dkd_story.source), dkd_node('time', '', dkd_time(dkd_story.publishedAt)));
    const dkd_title = dkd_node('h3', '', dkd_story.title);
    const dkd_summary = dkd_node('p', 'dkd-card-summary', dkd_story.summary || 'Bu habere ait kısa özet henüz yok.');
    const dkd_footer = dkd_node('div', 'dkd-card-footer');
    const dkd_openButton = dkd_node('button', 'dkd-card-open', 'Haberi oku');
    dkd_openButton.type = 'button';
    dkd_openButton.setAttribute('aria-label', `${dkd_story.title} haberini oku`);
    dkd_openButton.append(dkd_node('span', '', '↗'));
    dkd_openButton.addEventListener('click', () => dkd_open(dkd_story));
    const dkd_saveButton = dkd_node('button', `dkd-card-save${dkd_saved.has(dkd_story.id) ? ' dkd-saved' : ''}`, dkd_saved.has(dkd_story.id) ? '◆' : '◇');
    dkd_saveButton.type = 'button';
    dkd_saveButton.setAttribute('aria-label', dkd_saved.has(dkd_story.id) ? 'Kaydı kaldır' : 'Haberi kaydet');
    dkd_saveButton.addEventListener('click', () => dkd_toggleSaved(dkd_story));
    dkd_footer.append(dkd_openButton, dkd_saveButton);
    dkd_body.append(dkd_meta, dkd_title, dkd_summary, dkd_footer);
    dkd_article.append(dkd_cover, dkd_body);
    return dkd_article;
  }

  function dkd_render() {
    const dkd_items = dkd_filtered();
    const dkd_featured = dkd_get('dkd-featured');
    const dkd_articles = dkd_get('dkd-articles');
    dkd_featured.replaceChildren(...dkd_selectHeroes(dkd_items).map(dkd_heroCard));
    dkd_articles.replaceChildren(...dkd_items.slice(0, dkd_state.visible).map(dkd_articleCard));
    dkd_get('dkd-empty').hidden = !!dkd_items.length;
    dkd_get('dkd-more').hidden = dkd_items.length <= dkd_state.visible;
    dkd_get('dkd-result-count').textContent = `${dkd_items.length} haber`;
    dkd_get('dkd-news-title').textContent = dkd_state.savedOnly ? 'Kaydettiklerim' : dkd_state.topic ? `${dkd_state.topic} haberleri` : dkd_state.category === 'Tümü' ? 'Son haberler' : `${dkd_state.category} haberleri`;
    dkd_get('dkd-saved-count').textContent = dkd_saved.size;
    dkd_get('dkd-saved-count').hidden = !dkd_saved.size;
    dkd_get('dkd-saved-toggle').setAttribute('aria-pressed', String(dkd_state.savedOnly));
    document.querySelectorAll('[data-dkd-category]').forEach((dkd_button) => {
      dkd_button.classList.toggle('dkd-active', dkd_button.classList.contains('dkd-nav-link') && dkd_button.dataset.dkdCategory === dkd_state.category && !dkd_state.savedOnly);
      dkd_button.classList.toggle('dkd-selected', dkd_button.classList.contains('dkd-filter') && dkd_button.dataset.dkdCategory === dkd_state.category && !dkd_state.savedOnly);
    });
    document.querySelectorAll('[data-dkd-topic]').forEach((dkd_button) => dkd_button.classList.toggle('dkd-topic-active', dkd_button.dataset.dkdTopic === dkd_state.topic));
  }

  function dkd_open(dkd_story, dkd_fromUrl = false) {
    const dkd_dialog = dkd_get('dkd-reader');
    dkd_state.active = dkd_story;
    const dkd_cover = dkd_get('dkd-reader-image');
    dkd_cover.replaceChildren();
    dkd_image(dkd_cover, dkd_story, false);
    dkd_get('dkd-reader-tag').textContent = dkd_story.category;
    dkd_get('dkd-reader-title').textContent = dkd_story.title;
    dkd_get('dkd-reader-meta').textContent = `${dkd_story.source}  ·  ${dkd_time(dkd_story.publishedAt)}  ·  ${dkd_story.editorial ? 'DraBornNews özeti' : 'Kaynak özeti'}`;
    dkd_get('dkd-reader-summary').textContent = dkd_story.summary || 'Kaynakta haberin tamamını okuyabilirsiniz.';
    dkd_get('dkd-reader-disclosure').textContent = dkd_story.editorial ? 'Bu kısa metin, belirtilen kaynağın başlığı ve açık özetinden yapay zekâ yardımıyla hazırlanmıştır. Tam ayrıntılar ve bağlam için orijinal haberi okuyun.' : 'Bu kısa açıklama, kaynağın RSS akışındaki özetinden alınmıştır. Haberin tamamı için yayıncının sayfasını açın.';
    const dkd_source = dkd_get('dkd-reader-source');
    dkd_source.href = dkd_safeUrl(dkd_story.sourceUrl) || '#';
    dkd_get('dkd-reader-save').textContent = dkd_saved.has(dkd_story.id) ? 'Kaydedildi ✓' : 'Kaydet';
    dkd_get('dkd-reader-listen').textContent = 'Dinle';
    if (!dkd_dialog.open) dkd_dialog.showModal();
    if (!dkd_fromUrl) { const dkd_url = new URL(location.href); dkd_url.searchParams.set('haber', dkd_story.id); history.pushState({ dkd_news: true }, '', dkd_url); }
  }

  function dkd_close(dkd_fromPop = false) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const dkd_dialog = dkd_get('dkd-reader');
    if (dkd_dialog.open) dkd_dialog.close();
    dkd_state.active = null;
    if (!dkd_fromPop && new URL(location.href).searchParams.has('haber')) {
      const dkd_url = new URL(location.href);
      dkd_url.searchParams.delete('haber');
      history.replaceState(null, '', dkd_url);
    }
  }

  function dkd_applyCategory(dkd_category) {
    dkd_state.category = dkd_category;
    dkd_state.topic = '';
    dkd_state.savedOnly = false;
    dkd_state.visible = 12;
    dkd_render();
  }

  function dkd_theme() {
    const dkd_isLight = document.documentElement.dataset.dkdTheme === 'light';
    dkd_get('dkd-theme-toggle').setAttribute('aria-label', dkd_isLight ? 'Koyu temaya geç' : 'Açık temaya geç');
  }

  function dkd_bind() {
    try { document.documentElement.dataset.dkdTheme = localStorage.getItem('dkd_news_theme') || 'dark'; } catch { document.documentElement.dataset.dkdTheme = 'dark'; }
    dkd_theme();
    document.querySelectorAll('[data-dkd-category]').forEach((dkd_button) => dkd_button.addEventListener('click', () => dkd_applyCategory(dkd_button.dataset.dkdCategory)));
    document.querySelectorAll('[data-dkd-topic]').forEach((dkd_button) => dkd_button.addEventListener('click', () => { dkd_state.topic = dkd_state.topic === dkd_button.dataset.dkdTopic ? '' : dkd_button.dataset.dkdTopic; dkd_state.category = 'Tümü'; dkd_state.savedOnly = false; dkd_render(); dkd_get('dkd-news-title').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    dkd_get('dkd-theme-toggle').addEventListener('click', () => { document.documentElement.dataset.dkdTheme = document.documentElement.dataset.dkdTheme === 'light' ? 'dark' : 'light'; try { localStorage.setItem('dkd_news_theme', document.documentElement.dataset.dkdTheme); } catch { /* optional */ } dkd_theme(); });
    dkd_get('dkd-saved-toggle').addEventListener('click', () => { dkd_state.savedOnly = !dkd_state.savedOnly; dkd_state.visible = 12; dkd_render(); dkd_get('dkd-news-title').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    dkd_get('dkd-search-toggle').addEventListener('click', () => { const dkd_form = dkd_get('dkd-search-form'); dkd_form.hidden = false; dkd_get('dkd-search-input').focus(); dkd_form.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    dkd_get('dkd-search-close').addEventListener('click', () => { dkd_get('dkd-search-form').hidden = true; dkd_get('dkd-search-input').value = ''; dkd_state.query = ''; dkd_render(); });
    dkd_get('dkd-search-form').addEventListener('submit', (dkd_event) => dkd_event.preventDefault());
    dkd_get('dkd-search-input').addEventListener('input', (dkd_event) => { dkd_state.query = dkd_event.target.value; dkd_state.visible = 12; dkd_render(); });
    dkd_get('dkd-sort').addEventListener('change', (dkd_event) => { dkd_state.sort = dkd_event.target.value; dkd_render(); });
    dkd_get('dkd-more').addEventListener('click', () => { dkd_state.visible += 12; dkd_render(); });
    dkd_get('dkd-clear').addEventListener('click', () => { dkd_applyCategory('Tümü'); dkd_state.query = ''; dkd_get('dkd-search-input').value = ''; dkd_render(); });
    dkd_get('dkd-reader-close').addEventListener('click', () => dkd_close());
    dkd_get('dkd-reader').addEventListener('click', (dkd_event) => { if (dkd_event.target === dkd_get('dkd-reader')) dkd_close(); });
    dkd_get('dkd-reader').addEventListener('cancel', (dkd_event) => { dkd_event.preventDefault(); dkd_close(); });
    dkd_get('dkd-reader-save').addEventListener('click', () => { if (dkd_state.active) dkd_toggleSaved(dkd_state.active); });
    dkd_get('dkd-reader-listen').addEventListener('click', () => {
      if (!dkd_state.active || !('speechSynthesis' in window)) { dkd_toast('Sesli okuma bu tarayıcıda kullanılamıyor'); return; }
      if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); dkd_get('dkd-reader-listen').textContent = 'Dinle'; return; }
      const dkd_speech = new SpeechSynthesisUtterance(`${dkd_state.active.title}. ${dkd_state.active.summary}`);
      dkd_speech.lang = dkd_state.active.language === 'tr' ? 'tr-TR' : 'en-US';
      dkd_speech.rate = .95;
      dkd_speech.onend = () => dkd_get('dkd-reader-listen').textContent = 'Dinle';
      window.speechSynthesis.speak(dkd_speech);
      dkd_get('dkd-reader-listen').textContent = 'Durdur';
    });
    dkd_get('dkd-reader-share').addEventListener('click', async () => {
      if (!dkd_state.active) return;
      const dkd_url = new URL(location.href);
      dkd_url.searchParams.set('haber', dkd_state.active.id);
      try { if (navigator.share) await navigator.share({ title: dkd_state.active.title, url: dkd_url.href }); else { await navigator.clipboard.writeText(dkd_url.href); dkd_toast('Haber bağlantısı kopyalandı'); } }
      catch (dkd_error) { if (dkd_error.name !== 'AbortError') dkd_toast('Bağlantı paylaşılamadı'); }
    });
    window.addEventListener('popstate', () => { const dkd_id = new URL(location.href).searchParams.get('haber'); const dkd_story = dkd_state.items.find((dkd_item) => dkd_item.id === dkd_id); if (dkd_story) dkd_open(dkd_story, true); else dkd_close(true); });
  }

  async function dkd_load() {
    const dkd_controller = new AbortController();
    const dkd_timeout = setTimeout(() => dkd_controller.abort(), 12000);
    try {
      const dkd_response = await fetch('./data/news.json', { signal: dkd_controller.signal, cache: 'no-cache' });
      if (!dkd_response.ok) throw new Error(`HTTP ${dkd_response.status}`);
      const dkd_data = await dkd_response.json();
      if (!Array.isArray(dkd_data.items)) throw new Error('invalid news feed');
      dkd_state.items = dkd_data.items.filter((dkd_story) => dkd_story.id && dkd_story.title && dkd_safeUrl(dkd_story.sourceUrl) && !Number.isNaN(Date.parse(dkd_story.publishedAt)));
      dkd_get('dkd-updated').textContent = dkd_data.generatedAt ? `Akış güncellendi · ${dkd_time(dkd_data.generatedAt)}` : 'Güncel haberler';
      dkd_render();
      const dkd_id = new URL(location.href).searchParams.get('haber');
      const dkd_story = dkd_state.items.find((dkd_item) => dkd_item.id === dkd_id);
      if (dkd_story) dkd_open(dkd_story, true);
    } catch (dkd_error) {
      dkd_get('dkd-featured').replaceChildren(dkd_node('div', 'dkd-loading', 'Haber akışına şu an ulaşılamıyor. Biraz sonra yeniden deneyin.'));
      dkd_get('dkd-updated').textContent = 'Bağlantı kurulamadı';
      dkd_get('dkd-result-count').textContent = '0 haber';
      dkd_get('dkd-empty').hidden = false;
      console.error('DraBornNews feed unavailable', dkd_error);
    } finally { clearTimeout(dkd_timeout); }
  }

  dkd_bind();
  dkd_load();
})();
