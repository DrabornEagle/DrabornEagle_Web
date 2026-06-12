(() => {
  const dkdAdminKey = () => localStorage.getItem('dkd_admin_key') || '';
  const dkdResultBox = () => document.getElementById('dkdActionResult');

  function dkdText(dkdNode, dkdFallback) {
    return (dkdNode?.querySelector('.dkd-title')?.textContent || dkdFallback || '').trim();
  }

  function dkdActionRow(dkdCard, dkdKind) {
    if (dkdKind === 'product') {
      let dkdProductRow = dkdCard.querySelector('.dkd-product-actions');
      if (!dkdProductRow) {
        dkdProductRow = document.createElement('div');
        dkdProductRow.className = 'dkd-product-actions';
        dkdCard.appendChild(dkdProductRow);
      }
      return dkdProductRow;
    }

    let dkdRow = dkdCard.querySelector('.dkd-cleanup-actions');
    if (!dkdRow) {
      dkdRow = document.createElement('div');
      dkdRow.className = 'dkd-cleanup-actions';
      dkdCard.appendChild(dkdRow);
    }
    return dkdRow;
  }

  async function dkdDeleteRequest(dkdEndpoint, dkdMessage) {
    const dkdBox = dkdResultBox();
    if (dkdBox) dkdBox.textContent = `${dkdMessage} siliniyor...`;
    const dkdResponse = await fetch(dkdEndpoint, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'x-dkd-admin-key': dkdAdminKey()
      }
    });
    const dkdJson = await dkdResponse.json();
    if (!dkdResponse.ok) throw new Error(dkdJson.dkd_error || 'Silme işlemi başarısız.');
    if (dkdBox) dkdBox.textContent = JSON.stringify(dkdJson, null, 2);
    if (window.dkdAdminReloadAll) await window.dkdAdminReloadAll();
  }

  function dkdAddDeleteButton(dkdCard, dkdKind, dkdId, dkdEndpoint, dkdLabel, dkdConfirmText) {
    if (!dkdId || dkdCard.querySelector(`[data-dkd-cleanup-kind="${dkdKind}"]`)) return;
    const dkdRow = dkdActionRow(dkdCard, dkdKind);
    const dkdButton = document.createElement('button');
    dkdButton.type = 'button';
    dkdButton.className = 'dkd-cleanup-delete-btn';
    dkdButton.dataset.dkdCleanupKind = dkdKind;
    dkdButton.textContent = dkdLabel;
    dkdButton.addEventListener('click', async () => {
      const dkdName = dkdText(dkdCard, dkdKind);
      const dkdOk = confirm(`${dkdConfirmText}\n\n${dkdName}\n\nBu işlem veritabanı kaydını siler.`);
      if (!dkdOk) return;
      const dkdOldText = dkdButton.textContent;
      try {
        dkdButton.disabled = true;
        dkdButton.textContent = 'Siliniyor';
        await dkdDeleteRequest(dkdEndpoint, dkdName || dkdLabel);
      } catch (dkdError) {
        const dkdBox = dkdResultBox();
        if (dkdBox) dkdBox.textContent = `Hata: ${dkdError.message}`;
      } finally {
        dkdButton.disabled = false;
        dkdButton.textContent = dkdOldText;
      }
    });
    dkdRow.appendChild(dkdButton);
  }

  function dkdAddCleanupButtons() {
    document.querySelectorAll('#dkdProducts .dkd-item[data-dkd-product-id]').forEach((dkdCard) => {
      const dkdId = dkdCard.dataset.dkdProductId || '';
      dkdAddDeleteButton(dkdCard, 'product', dkdId, `/api/dkd-products/${encodeURIComponent(dkdId)}`, 'Sil', 'Bu ürünü, ürün snapshot kayıtlarını ve bu ürüne bağlı sosyal gönderi kayıtlarını silmek istiyor musun?');
    });

    document.querySelectorAll('#dkdSocialPosts .dkd-item[data-dkd-social-post-id]').forEach((dkdCard) => {
      const dkdId = dkdCard.dataset.dkdSocialPostId || '';
      dkdAddDeleteButton(dkdCard, 'social-post', dkdId, `/api/dkd-social-posts/${encodeURIComponent(dkdId)}`, 'Gönderi Kaydını Sil', 'Bu Telegram gönderi kaydını silmek istiyor musun? Kanal içindeki gerçek Telegram mesajı ayrıca elle silinmelidir.');
    });

    document.querySelectorAll('#dkdWatchLinks .dkd-item[data-dkd-watch-link-id]').forEach((dkdCard) => {
      const dkdId = dkdCard.dataset.dkdWatchLinkId || '';
      dkdAddDeleteButton(dkdCard, 'watch-link', dkdId, `/api/dkd-watch-links/${encodeURIComponent(dkdId)}`, 'Link Geçmişini Sil', 'Bu bağlantı geçmişi kaydını silmek istiyor musun?');
    });
  }

  const dkdObserver = new MutationObserver(() => dkdAddCleanupButtons());
  window.addEventListener('load', () => {
    dkdAddCleanupButtons();
    ['dkdProducts', 'dkdSocialPosts', 'dkdWatchLinks'].forEach((dkdId) => {
      const dkdNode = document.getElementById(dkdId);
      if (dkdNode) dkdObserver.observe(dkdNode, { childList: true, subtree: true });
    });
  });
})();
