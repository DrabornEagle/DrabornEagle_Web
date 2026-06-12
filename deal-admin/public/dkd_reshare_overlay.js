(() => {
  const dkdResultBox = () => document.getElementById('dkdActionResult');
  const dkdAdminKey = () => localStorage.getItem('dkd_admin_key') || '';

  function dkdFindUrl(dkdCard) {
    const dkdTextItems = Array.from(dkdCard.querySelectorAll('.dkd-meta')).map((dkdNode) => dkdNode.textContent || '');
    const dkdUrlText = dkdTextItems.find((dkdText) => dkdText.includes('http')) || '';
    const dkdMatch = dkdUrlText.match(/https?:\/\/[^\s]+/);
    return dkdMatch ? dkdMatch[0] : '';
  }

  function dkdMakeActionRow(dkdCard) {
    let dkdRow = dkdCard.querySelector('.dkd-product-actions');
    if (!dkdRow) {
      dkdRow = document.createElement('div');
      dkdRow.className = 'dkd-product-actions';
      dkdCard.appendChild(dkdRow);
    }
    return dkdRow;
  }

  async function dkdShareAgain(dkdUrl, dkdButton) {
    const dkdBox = dkdResultBox();
    if (!dkdUrl) {
      if (dkdBox) dkdBox.textContent = 'Ürün bağlantısı bulunamadı.';
      return;
    }
    const dkdOldText = dkdButton.textContent;
    dkdButton.disabled = true;
    dkdButton.textContent = 'Paylaşılıyor...';
    if (dkdBox) dkdBox.textContent = 'Kayıtlı ürün bağlantısı Telegram’da tekrar paylaşılıyor...';
    const dkdResponse = await fetch('/api/dkd-share-link-direct', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-dkd-admin-key': dkdAdminKey()
      },
      body: JSON.stringify({ dkd_url: dkdUrl })
    });
    const dkdJson = await dkdResponse.json();
    dkdButton.disabled = false;
    dkdButton.textContent = dkdOldText;
    if (!dkdResponse.ok) throw new Error(dkdJson.dkd_error || 'Paylaşım başarısız.');
    if (dkdBox) dkdBox.textContent = JSON.stringify(dkdJson, null, 2);
    const dkdRefreshBtn = document.getElementById('dkdRefreshBtn');
    if (dkdRefreshBtn) dkdRefreshBtn.click();
  }

  function dkdAddButtons() {
    const dkdProductsSection = document.getElementById('dkdProducts');
    if (!dkdProductsSection) return;
    dkdProductsSection.querySelectorAll('.dkd-item').forEach((dkdCard) => {
      if (dkdCard.querySelector('.dkd-reshare-existing-btn')) return;
      const dkdUrl = dkdFindUrl(dkdCard);
      if (!dkdUrl) return;
      const dkdRow = dkdMakeActionRow(dkdCard);
      const dkdButton = document.createElement('button');
      dkdButton.type = 'button';
      dkdButton.className = 'dkd-reshare-existing-btn';
      dkdButton.textContent = '↗ Tekrar Paylaş';
      dkdButton.addEventListener('click', async () => {
        try {
          await dkdShareAgain(dkdUrl, dkdButton);
        } catch (dkdError) {
          dkdButton.disabled = false;
          dkdButton.textContent = '↗ Tekrar Paylaş';
          const dkdBox = dkdResultBox();
          if (dkdBox) dkdBox.textContent = `Hata: ${dkdError.message}`;
        }
      });
      dkdRow.appendChild(dkdButton);
    });
  }

  const dkdObserver = new MutationObserver(() => dkdAddButtons());
  window.addEventListener('load', () => {
    dkdAddButtons();
    const dkdProductsSection = document.getElementById('dkdProducts');
    if (dkdProductsSection) dkdObserver.observe(dkdProductsSection, { childList: true, subtree: true });
  });
})();
