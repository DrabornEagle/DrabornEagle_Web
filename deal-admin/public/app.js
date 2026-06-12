const dkdState = { dkdKey: localStorage.getItem('dkd_admin_key') || '' };
const dkdLoginCard = document.getElementById('dkdLoginCard');
const dkdPanel = document.getElementById('dkdPanel');
const dkdAdminKey = document.getElementById('dkdAdminKey');
const dkdActionResult = document.getElementById('dkdActionResult');
const dkdTelegramPreview = document.getElementById('dkdTelegramPreview');
const dkdStatusTr = { mapped: 'işlendi', pending: 'bekliyor', accepted: 'işleniyor', paused: 'duraklatıldı', rejected: 'reddedildi', draft: 'taslak', published: 'yayınlandı', cancelled: 'iptal edildi', failed: 'hatalı' };
const dkdModeTr = { append_query: 'Bağlantının sonuna ekle', template: 'Hazır bağlantı şablonu', none: 'Kullanma' };

function dkdHeaders() { return { 'content-type': 'application/json', 'x-dkd-admin-key': dkdState.dkdKey }; }
async function dkdApi(dkdPath, dkdOptions = {}) {
  const dkdResponse = await fetch(dkdPath, { ...dkdOptions, headers: { ...dkdHeaders(), ...(dkdOptions.headers || {}) } });
  const dkdJson = await dkdResponse.json();
  if (!dkdResponse.ok) throw new Error(dkdJson.dkd_error || 'API error');
  return dkdJson;
}
function dkdMoney(dkdValue, dkdCurrency) {
  if (dkdValue === null || dkdValue === undefined) return 'Fiyat yok';
  const dkdCurrencyLabel = !dkdCurrency || dkdCurrency === 'TRY' ? 'TL' : dkdCurrency;
  return `${Number(dkdValue).toLocaleString('tr-TR')} ${dkdCurrencyLabel}`.trim();
}
function dkdEscape(dkdValue) { return String(dkdValue ?? '').replace(/[&<>"']/g, (dkdChar) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[dkdChar])); }
function dkdPill(dkdText, dkdClass = '') { return `<span class="dkd-pill ${dkdClass}">${dkdEscape(dkdText)}</span>`; }
function dkdSetHtml(dkdId, dkdHtml) { document.getElementById(dkdId).innerHTML = dkdHtml || '<p class="dkd-muted">Kayıt yok.</p>'; }
function dkdTrStatus(dkdValue) { return dkdStatusTr[dkdValue] || dkdValue || '-'; }
function dkdTrMode(dkdValue) { return dkdModeTr[dkdValue] || dkdValue || '-'; }
function dkdTelegramSendType(dkdValue) { return dkdValue === 'photo_caption' ? 'Fotoğraflı gönderi' : 'Metin mesajı'; }

async function dkdLoadAll() {
  try {
    dkdActionResult.textContent = '';
    const [dkdHealth, dkdSources, dkdWatch, dkdProducts, dkdHot, dkdPosts, dkdAffiliateRules] = await Promise.all([
      dkdApi('/api/dkd-health'),
      dkdApi('/api/dkd-sources'),
      dkdApi('/api/dkd-watch-links'),
      dkdApi('/api/dkd-products'),
      dkdApi('/api/dkd-hot-feed'),
      dkdApi('/api/dkd-social-posts'),
      dkdApi('/api/dkd-affiliate-rules')
    ]);
    dkdRenderHealth(dkdHealth.dkd_settings);
    dkdRenderSources(dkdSources.dkd_rows);
    dkdRenderWatchLinks(dkdWatch.dkd_rows);
    dkdRenderProducts(dkdProducts.dkd_rows);
    dkdRenderHotFeed(dkdHot.dkd_rows);
    dkdRenderPosts(dkdPosts.dkd_rows);
    dkdRenderAffiliateRules(dkdAffiliateRules.dkd_rows);
  } catch (dkdError) {
    dkdActionResult.textContent = `Hata: ${dkdError.message}`;
  }
}

function dkdHealthView(dkdRow) {
  const dkdKey = dkdRow.dkd_setting_key;
  const dkdValue = dkdRow.dkd_setting_value || {};
  if (dkdKey === 'dkd_deal_worker_runtime_mode') return { t: 'Çalışma modu', d: 'Sistem şu an Termux test modunda. CX33 sunucu kurulumu sen haber verene kadar beklemede.', p: ['Termux aktif'] };
  if (dkdKey === 'dkd_deal_source_admin_version') return { t: 'Kaynak yönetimi', d: 'Trendyol, Hepsiburada ve diğer kaynakların aktiflik/izin ayarları panelden yönetiliyor.', p: ['hazır'] };
  if (dkdKey === 'dkd_deal_hot_deals_version') return { t: 'Fırsat skoru sistemi', d: `Ürünler fiyat, puan, yorum ve trend bilgilerine göre fırsat skoruna giriyor. Sürüm ${dkdValue.version || 'aktif'}.`, p: ['aktif'] };
  if (dkdKey === 'dkd_deal_telegram_caption_format_version') return { t: 'Telegram mesaj formatı', d: 'Telegram paylaşımlarında TL kullanılır; yeni fiyat, önceki fiyat, indirim, puan, yorum ve link alanları standarttır.', p: ['standart'] };
  if (dkdKey === 'dkd_deal_telegram_preview_version') return { t: 'Telegram önizleme', d: 'v0.15 ile mesaj Telegram’a gitmeden önce panelde kontrol edilebilir.', p: ['v0.15'] };
  if (dkdKey === 'dkd_deal_admin_cleanup_version') return { t: 'Admin temizlik modu', d: 'v0.16 ile ürün, Telegram gönderi kaydı ve bağlantı geçmişi panelden silinebilir.', p: ['v0.16'] };
  if (dkdKey === 'dkd_deal_affiliate_links_version') return { t: 'Affiliate sistemi', d: 'Affiliate altyapısı hazır ama şimdilik kapalı. Gerçek affiliate bilgileri gelince aktif edilecek.', p: ['sona bırakıldı'] };
  if (dkdKey === 'dkd_deal_termux_telegram_live_test') return { t: 'Telegram bağlantısı', d: 'Telegram kanal bağlantısı test edildi ve mesaj gönderimi çalışıyor.', p: ['bağlı'] };
  return null;
}
function dkdRenderHealth(dkdRows) {
  const dkdCards = dkdRows.map(dkdHealthView).filter(Boolean);
  dkdSetHtml('dkdHealth', dkdCards.map((dkdView) => `<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdView.t)}</div><div class="dkd-meta">${dkdEscape(dkdView.d)}</div>${dkdView.p.map((dkdText) => dkdPill(dkdText, 'hot')).join('')}</div>`).join(''));
}
function dkdRenderSources(dkdRows) {
  dkdSetHtml('dkdSources', dkdRows.map((dkdRow) => `<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdRow.dkd_source_name)} — ${dkdRow.dkd_is_active ? 'aktif' : 'kapalı'}</div><div class="dkd-meta">Kaynak: ${dkdEscape(dkdRow.dkd_source_key)}</div>${dkdPill(dkdRow.dkd_allowed_by_terms ? 'izinli' : 'izin kapalı', dkdRow.dkd_allowed_by_terms ? 'hot' : 'warn')}${dkdPill(dkdRow.dkd_needs_manual_review ? 'inceleme bekliyor' : 'inceleme yok', dkdRow.dkd_needs_manual_review ? 'warn' : 'hot')}<form class="dkd-source-form" data-source-id="${dkdEscape(dkdRow.dkd_id)}"><label class="dkd-switch"><input type="checkbox" name="dkd_is_active" ${dkdRow.dkd_is_active ? 'checked' : ''}> Aktif</label><label class="dkd-switch"><input type="checkbox" name="dkd_allowed_by_terms" ${dkdRow.dkd_allowed_by_terms ? 'checked' : ''}> Manuel ürün linki izni</label><label class="dkd-switch"><input type="checkbox" name="dkd_needs_manual_review" ${dkdRow.dkd_needs_manual_review ? 'checked' : ''}> Manuel inceleme beklesin</label><input name="dkd_priority" type="number" min="1" value="${dkdEscape(dkdRow.dkd_priority)}"><input name="dkd_crawl_interval_minutes" type="number" min="5" value="${dkdEscape(dkdRow.dkd_crawl_interval_minutes)}"><button type="submit">Kaydet</button></form></div>`).join(''));
  document.querySelectorAll('.dkd-source-form').forEach((dkdForm) => dkdForm.addEventListener('submit', dkdSaveSource));
}
function dkdRenderWatchLinks(dkdRows) {
  dkdSetHtml('dkdWatchLinks', dkdRows.map((dkdRow) => {
    const dkdWatchId = dkdRow.dkd_id || dkdRow.dkd_watch_link_id || dkdRow.dkd_queue_id || '';
    return `<div class="dkd-item" data-dkd-watch-link-id="${dkdEscape(dkdWatchId)}"><div class="dkd-title">${dkdEscape(dkdRow.dkd_detected_source_key || 'bilinmeyen')} — ${dkdEscape(dkdTrStatus(dkdRow.dkd_status))}</div><div class="dkd-meta">${dkdEscape(dkdRow.dkd_submitted_url)}</div>${dkdRow.dkd_product_name ? dkdPill(dkdRow.dkd_product_name, 'hot') : ''}<div class="dkd-cleanup-actions"></div></div>`;
  }).join(''));
}
function dkdRenderProducts(dkdRows) {
  dkdSetHtml('dkdProducts', dkdRows.map((dkdRow) => `<div class="dkd-item" data-dkd-product-id="${dkdEscape(dkdRow.dkd_id)}" data-dkd-product-url="${dkdEscape(dkdRow.dkd_product_url)}"><div class="dkd-title">${dkdEscape(dkdRow.dkd_product_name)}</div><div class="dkd-meta">${dkdMoney(dkdRow.dkd_current_price, dkdRow.dkd_currency_code)} · ${dkdEscape(dkdRow.dkd_stock_status)} · Puan ${dkdEscape(dkdRow.dkd_rating || '-')} · Yorum ${dkdEscape(dkdRow.dkd_review_count || '-')}</div>${dkdPill(`fırsat puanı ${dkdRow.dkd_deal_score}`)}${dkdPill(`trend ${dkdRow.dkd_trend_score}`)}<div class="dkd-meta dkd-product-url">${dkdEscape(dkdRow.dkd_product_url)}</div><div class="dkd-product-actions"></div><div class="dkd-cleanup-actions"></div></div>`).join(''));
}
function dkdRenderHotFeed(dkdRows) {
  dkdSetHtml('dkdHotFeed', dkdRows.map((dkdRow) => `<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdRow.dkd_product_name)}</div><div class="dkd-meta">${dkdMoney(dkdRow.dkd_current_price, dkdRow.dkd_currency_code)} · ${dkdEscape(dkdRow.dkd_source_key)}</div>${dkdPill(dkdRow.dkd_heat_label, dkdRow.dkd_heat_label === 'super_hot' ? 'hot' : 'warn')}${dkdPill(`sıcaklık ${dkdRow.dkd_hot_score}`)}${dkdPill(`indirim %${dkdRow.dkd_discount_percent || 0}`)}</div>`).join(''));
}
function dkdRenderPosts(dkdRows) {
  dkdSetHtml('dkdSocialPosts', dkdRows.map((dkdRow) => {
    const dkdPostId = dkdRow.dkd_id || dkdRow.dkd_social_post_id || dkdRow.dkd_post_id || '';
    return `<div class="dkd-item" data-dkd-social-post-id="${dkdEscape(dkdPostId)}"><div class="dkd-title">${dkdEscape(dkdTrStatus(dkdRow.dkd_status))} — ${dkdEscape(dkdRow.dkd_channel_key || '-')}</div><div class="dkd-meta">${dkdEscape((dkdRow.dkd_caption || '').slice(0, 180))}</div>${dkdRow.dkd_published_at ? dkdPill('yayınlandı', 'hot') : ''}${dkdRow.dkd_status === 'failed' ? dkdPill('hatalı', 'danger') : ''}<div class="dkd-cleanup-actions"></div></div>`;
  }).join(''));
}
function dkdRenderAffiliateRules(dkdRows) {
  dkdSetHtml('dkdAffiliateRules', dkdRows.map((dkdRow) => `<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdRow.dkd_source_name)} — ${dkdRow.dkd_is_active ? 'aktif' : 'kapalı'}</div><div class="dkd-meta">Yöntem: ${dkdEscape(dkdTrMode(dkdRow.dkd_affiliate_mode))}</div>${dkdPill(dkdRow.dkd_source_key, dkdRow.dkd_is_active ? 'hot' : 'warn')}</div>`).join(''));
}

function dkdRenderTelegramPreview(dkdPreview) {
  if (!dkdTelegramPreview || !dkdPreview) return;
  const dkdLimitClass = dkdPreview.dkd_caption_is_over_limit ? 'danger' : 'hot';
  const dkdImageHtml = dkdPreview.dkd_image_url ? `<img class="dkd-preview-image" src="${dkdEscape(dkdPreview.dkd_image_url)}" alt="Ürün görseli">` : '<div class="dkd-preview-no-image">Görsel yok, metin mesajı olarak gider.</div>';
  dkdTelegramPreview.hidden = false;
  dkdTelegramPreview.innerHTML = `
    <div class="dkd-preview-head">
      <div>
        <p class="dkd-kicker-small">Telegram Önizleme</p>
        <h3>${dkdEscape(dkdPreview.dkd_product_name)}</h3>
      </div>
      ${dkdPill(dkdTelegramSendType(dkdPreview.dkd_will_be_sent_as), 'hot')}
    </div>
    ${dkdImageHtml}
    <pre class="dkd-preview-caption">${dkdEscape(dkdPreview.dkd_caption)}</pre>
    <div class="dkd-preview-meta">
      ${dkdPill(`${dkdPreview.dkd_caption_character_count}/${dkdPreview.dkd_caption_limit} karakter`, dkdLimitClass)}
      ${dkdPill(dkdPreview.dkd_source_key || 'kaynak yok')}
      ${dkdPreview.dkd_caption_is_over_limit ? dkdPill('Telegram limiti aşılabilir', 'danger') : ''}
    </div>
    <a class="dkd-preview-link" href="${dkdEscape(dkdPreview.dkd_final_url)}" target="_blank" rel="noreferrer">Son bağlantıyı aç</a>
  `;
}

async function dkdPreviewByUrl(dkdUrl) {
  if (!dkdUrl) throw new Error('Önizleme için ürün bağlantısı gerekli.');
  dkdActionResult.textContent = 'Telegram mesaj önizlemesi hazırlanıyor...';
  const dkdJson = await dkdApi('/api/dkd-telegram-preview', { method: 'POST', body: JSON.stringify({ dkd_url: dkdUrl }) });
  dkdRenderTelegramPreview(dkdJson.dkd_preview);
  dkdActionResult.textContent = 'Önizleme hazır. Mesajı kontrol edip istersen Telegram’da paylaşabilirsin.';
  return dkdJson.dkd_preview;
}

async function dkdSaveSource(dkdEvent) {
  dkdEvent.preventDefault();
  const dkdForm = dkdEvent.currentTarget;
  const dkdFormData = new FormData(dkdForm);
  try {
    const dkdResult = await dkdApi(`/api/dkd-sources/${dkdForm.dataset.sourceId}`, { method: 'POST', body: JSON.stringify({ dkd_is_active: dkdFormData.get('dkd_is_active') === 'on', dkd_allowed_by_terms: dkdFormData.get('dkd_allowed_by_terms') === 'on', dkd_needs_manual_review: dkdFormData.get('dkd_needs_manual_review') === 'on', dkd_priority: Number(dkdFormData.get('dkd_priority') || 10), dkd_crawl_interval_minutes: Number(dkdFormData.get('dkd_crawl_interval_minutes') || 1440) }) });
    dkdActionResult.textContent = JSON.stringify(dkdResult, null, 2);
    await dkdLoadAll();
  } catch (dkdError) {
    dkdActionResult.textContent = `Hata: ${dkdError.message}`;
  }
}

document.getElementById('dkdSaveKeyBtn').addEventListener('click', async () => {
  dkdState.dkdKey = dkdAdminKey.value.trim();
  localStorage.setItem('dkd_admin_key', dkdState.dkdKey);
  dkdLoginCard.hidden = true;
  dkdPanel.hidden = false;
  await dkdLoadAll();
});
document.getElementById('dkdRefreshBtn').addEventListener('click', dkdLoadAll);
document.getElementById('dkdPreviewBtn').addEventListener('click', async () => {
  try {
    await dkdPreviewByUrl(document.getElementById('dkdProductUrl').value.trim());
  } catch (dkdError) {
    dkdActionResult.textContent = `Hata: ${dkdError.message}`;
  }
});
document.getElementById('dkdAddLinkForm').addEventListener('submit', async (dkdEvent) => {
  dkdEvent.preventDefault();
  try {
    dkdActionResult.textContent = 'Ürün çekiliyor ve Telegram’a gönderiliyor...';
    const dkdUrl = document.getElementById('dkdProductUrl').value.trim();
    const dkdResult = await dkdApi('/api/dkd-share-link-direct', { method: 'POST', body: JSON.stringify({ dkd_url: dkdUrl }) });
    dkdActionResult.textContent = JSON.stringify(dkdResult, null, 2);
    document.getElementById('dkdProductUrl').value = '';
    await dkdLoadAll();
  } catch (dkdError) {
    dkdActionResult.textContent = `Hata: ${dkdError.message}`;
  }
});

window.dkdTelegramPreviewFromUrl = dkdPreviewByUrl;
window.dkdRenderTelegramPreview = dkdRenderTelegramPreview;
window.dkdAdminReloadAll = dkdLoadAll;

if (dkdState.dkdKey) {
  dkdLoginCard.hidden = true;
  dkdPanel.hidden = false;
  dkdLoadAll();
}
