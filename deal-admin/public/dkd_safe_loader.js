(() => {
  const dkdLabels = [
    ['İstatistikler', '/api/dkd-stats'],
    ['Sistem Durumu', '/api/dkd-health'],
    ['Kaynaklar', '/api/dkd-sources'],
    ['Bağlantı Geçmişi', '/api/dkd-watch-links'],
    ['Ürünler', '/api/dkd-products'],
    ['Sıcak Fırsat Akışı', '/api/dkd-hot-feed'],
    ['Telegram Gönderileri', '/api/dkd-social-posts'],
    ['Affiliate Kuralları', '/api/dkd-affiliate-rules']
  ];

  function dkdText(dkdValue) {
    if (!dkdValue) return 'Bilinmeyen hata';
    if (typeof dkdValue === 'string') return dkdValue || 'Bilinmeyen hata';
    if (dkdValue.message) return String(dkdValue.message || 'Bilinmeyen hata');
    try {
      const dkdJson = JSON.stringify(dkdValue);
      return dkdJson && dkdJson !== '{}' ? dkdJson : 'Bilinmeyen hata';
    } catch {
      return String(dkdValue);
    }
  }

  function dkdAdminKey() {
    return localStorage.getItem('dkd_admin_key') || '';
  }

  function dkdEscapeLocal(dkdValue) {
    if (window.dkdEscape) return window.dkdEscape(dkdValue);
    return String(dkdValue ?? '').replace(/[&<>"']/g, (dkdChar) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[dkdChar]));
  }

  async function dkdFetchJson(dkdPath) {
    const dkdResponse = await fetch(dkdPath, {
      headers: {
        'content-type': 'application/json',
        'x-dkd-admin-key': dkdAdminKey()
      }
    });
    let dkdJson = {};
    try { dkdJson = await dkdResponse.json(); } catch { dkdJson = {}; }
    if (!dkdResponse.ok) throw new Error(dkdText(dkdJson.dkd_error || dkdJson.error || dkdJson.message || 'API error'));
    return dkdJson;
  }

  async function dkdSafeFetch(dkdLabel, dkdPath) {
    try {
      return { dkd_ok: true, dkd_label: dkdLabel, dkd_response: await dkdFetchJson(dkdPath) };
    } catch (dkdError) {
      return { dkd_ok: false, dkd_label: dkdLabel, dkd_error: dkdText(dkdError) };
    }
  }

  function dkdErrorCard(dkdLabel, dkdError) {
    return `<div class="dkd-item"><div class="dkd-title">${dkdEscapeLocal(dkdLabel)} yüklenemedi</div><div class="dkd-meta">${dkdEscapeLocal(dkdError)}</div></div>`;
  }

  function dkdSetArea(dkdId, dkdHtml) {
    const dkdNode = document.getElementById(dkdId);
    if (dkdNode) dkdNode.innerHTML = dkdHtml || '<p class="dkd-muted">Kayıt yok.</p>';
  }

  function dkdRenderStatsFallback(dkdStatsResult) {
    if (dkdStatsResult.dkd_ok && window.dkdRenderStats) {
      window.dkdRenderStats(dkdStatsResult.dkd_response.dkd_stats);
      return;
    }
    if (window.dkdRenderStats) {
      window.dkdRenderStats({
        dkd_warnings: [{ dkd_label: 'stats', dkd_error: dkdStatsResult.dkd_error || 'İstatistik alınamadı' }],
        dkd_totals: {},
        dkd_sources: [],
        dkd_top_hot_products: []
      });
      return;
    }
    dkdSetArea('dkdStats', dkdErrorCard('İstatistikler', dkdStatsResult.dkd_error || 'İstatistik alınamadı'));
  }

  async function dkdSafeLoadAll() {
    const dkdResults = await Promise.all(dkdLabels.map(([dkdLabel, dkdPath]) => dkdSafeFetch(dkdLabel, dkdPath)));
    const [dkdStats, dkdHealth, dkdSources, dkdWatch, dkdProducts, dkdHot, dkdPosts, dkdAffiliateRules] = dkdResults;

    dkdRenderStatsFallback(dkdStats);

    if (dkdHealth.dkd_ok && window.dkdRenderHealth) window.dkdRenderHealth(dkdHealth.dkd_response.dkd_settings || []); else dkdSetArea('dkdHealth', dkdErrorCard('Sistem Durumu', dkdHealth.dkd_error));
    if (dkdSources.dkd_ok && window.dkdRenderSources) window.dkdRenderSources(dkdSources.dkd_response.dkd_rows || []); else dkdSetArea('dkdSources', dkdErrorCard('Kaynaklar', dkdSources.dkd_error));
    if (dkdWatch.dkd_ok && window.dkdRenderWatchLinks) window.dkdRenderWatchLinks(dkdWatch.dkd_response.dkd_rows || []); else dkdSetArea('dkdWatchLinks', dkdErrorCard('Bağlantı Geçmişi', dkdWatch.dkd_error));
    if (dkdProducts.dkd_ok && window.dkdRenderProducts) window.dkdRenderProducts(dkdProducts.dkd_response.dkd_rows || []); else dkdSetArea('dkdProducts', dkdErrorCard('Ürünler', dkdProducts.dkd_error));
    if (dkdHot.dkd_ok && window.dkdRenderHotFeed) window.dkdRenderHotFeed(dkdHot.dkd_response.dkd_rows || []); else dkdSetArea('dkdHotFeed', dkdErrorCard('Sıcak Fırsat Akışı', dkdHot.dkd_error));
    if (dkdPosts.dkd_ok && window.dkdRenderPosts) window.dkdRenderPosts(dkdPosts.dkd_response.dkd_rows || []); else dkdSetArea('dkdSocialPosts', dkdErrorCard('Telegram Gönderileri', dkdPosts.dkd_error));
    if (dkdAffiliateRules.dkd_ok && window.dkdRenderAffiliateRules) window.dkdRenderAffiliateRules(dkdAffiliateRules.dkd_response.dkd_rows || []); else dkdSetArea('dkdAffiliateRules', dkdErrorCard('Affiliate Kuralları', dkdAffiliateRules.dkd_error));

    const dkdFailed = dkdResults.filter((dkdResult) => !dkdResult.dkd_ok);
    const dkdResultBox = document.getElementById('dkdActionResult');
    if (dkdResultBox) dkdResultBox.textContent = dkdFailed.length ? `Bazı bölümler yüklenemedi: ${dkdFailed.map((dkdResult) => dkdResult.dkd_label).join(', ')}` : '';
  }

  window.dkdAdminReloadAll = dkdSafeLoadAll;
  window.dkdSafeLoadAll = dkdSafeLoadAll;

  window.addEventListener('load', () => {
    const dkdRefreshBtn = document.getElementById('dkdRefreshBtn');
    if (dkdRefreshBtn) dkdRefreshBtn.addEventListener('click', () => setTimeout(dkdSafeLoadAll, 50));
    setTimeout(dkdSafeLoadAll, 250);
    setTimeout(dkdSafeLoadAll, 1200);
  });
})();
