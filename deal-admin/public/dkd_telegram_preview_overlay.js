(() => {
  const dkdResultBox = () => document.getElementById('dkdActionResult');

  function dkdFindUrl(dkdCard) {
    const dkdDataUrl = dkdCard.dataset?.dkdProductUrl || '';
    if (dkdDataUrl) return dkdDataUrl;
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

  function dkdScrollToPreview() {
    const dkdPreview = document.getElementById('dkdTelegramPreview');
    if (dkdPreview) dkdPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function dkdAddButtons() {
    const dkdProductsSection = document.getElementById('dkdProducts');
    if (!dkdProductsSection) return;
    dkdProductsSection.querySelectorAll('.dkd-item').forEach((dkdCard) => {
      if (dkdCard.querySelector('.dkd-preview-existing-btn')) return;
      const dkdUrl = dkdFindUrl(dkdCard);
      if (!dkdUrl) return;
      const dkdRow = dkdMakeActionRow(dkdCard);
      const dkdButton = document.createElement('button');
      dkdButton.type = 'button';
      dkdButton.className = 'dkd-preview-existing-btn';
      dkdButton.textContent = '👁 Önizle';
      dkdButton.addEventListener('click', async () => {
        const dkdBox = dkdResultBox();
        const dkdOldText = dkdButton.textContent;
        try {
          dkdButton.disabled = true;
          dkdButton.textContent = 'Hazırlanıyor...';
          if (!window.dkdTelegramPreviewFromUrl) throw new Error('Önizleme modülü yüklenemedi.');
          await window.dkdTelegramPreviewFromUrl(dkdUrl);
          dkdScrollToPreview();
        } catch (dkdError) {
          if (dkdBox) dkdBox.textContent = `Hata: ${dkdError.message}`;
        } finally {
          dkdButton.disabled = false;
          dkdButton.textContent = dkdOldText;
        }
      });
      dkdRow.prepend(dkdButton);
    });
  }

  const dkdObserver = new MutationObserver(() => dkdAddButtons());
  window.addEventListener('load', () => {
    dkdAddButtons();
    const dkdProductsSection = document.getElementById('dkdProducts');
    if (dkdProductsSection) dkdObserver.observe(dkdProductsSection, { childList: true, subtree: true });
  });
})();
