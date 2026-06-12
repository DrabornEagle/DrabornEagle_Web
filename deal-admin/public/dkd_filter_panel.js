(() => {
  const dkdTargets = [
    ['dkdProducts', 'Ürünler'],
    ['dkdHotFeed', 'Sıcak Fırsatlar'],
    ['dkdSocialPosts', 'Telegram'],
    ['dkdWatchLinks', 'Bağlantılar']
  ];

  function dkdNorm(dkdValue) {
    return String(dkdValue || '').toLocaleLowerCase('tr-TR').trim();
  }

  function dkdFindItems() {
    return dkdTargets.flatMap(([dkdId, dkdLabel]) => {
      const dkdRoot = document.getElementById(dkdId);
      if (!dkdRoot) return [];
      return Array.from(dkdRoot.querySelectorAll('.dkd-item')).map((dkdItem) => ({ dkdItem, dkdLabel }));
    });
  }

  function dkdApplyFilter() {
    const dkdInput = document.getElementById('dkdQuickFilterInput');
    const dkdCounter = document.getElementById('dkdQuickFilterCount');
    const dkdQuery = dkdNorm(dkdInput?.value || '');
    const dkdItems = dkdFindItems();
    let dkdVisible = 0;

    dkdItems.forEach(({ dkdItem }) => {
      const dkdText = dkdNorm(dkdItem.textContent || '');
      const dkdMatch = !dkdQuery || dkdText.includes(dkdQuery);
      dkdItem.classList.toggle('dkd-filter-hidden', !dkdMatch);
      dkdItem.classList.toggle('dkd-filter-hit', Boolean(dkdQuery && dkdMatch));
      if (dkdMatch) dkdVisible += 1;
    });

    if (dkdCounter) {
      dkdCounter.textContent = dkdQuery ? `${dkdVisible}/${dkdItems.length} kayıt gösteriliyor` : `${dkdItems.length} kayıt hazır`;
    }
  }

  function dkdClearFilter() {
    const dkdInput = document.getElementById('dkdQuickFilterInput');
    if (dkdInput) dkdInput.value = '';
    dkdApplyFilter();
  }

  function dkdOpenTarget(dkdId) {
    const dkdRoot = document.getElementById(dkdId);
    const dkdDetails = dkdRoot?.closest('details');
    if (dkdDetails) dkdDetails.open = true;
    setTimeout(() => dkdDetails?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function dkdCreatePanel() {
    if (document.getElementById('dkdQuickFilterCard')) return;
    const dkdPanel = document.getElementById('dkdPanel');
    const dkdFirstSection = dkdPanel?.querySelector('.dkd-section');
    if (!dkdPanel || !dkdFirstSection) return;

    const dkdCard = document.createElement('section');
    dkdCard.id = 'dkdQuickFilterCard';
    dkdCard.className = 'dkd-card dkd-filter-card';
    dkdCard.innerHTML = `
      <div class="dkd-card-head">
        <div>
          <p class="dkd-kicker-small">Hızlı Bul</p>
          <h2>Mobil Filtre</h2>
        </div>
      </div>
      <div class="dkd-filter-grid">
        <input id="dkdQuickFilterInput" type="search" placeholder="Ürün, fiyat, kaynak, durum ara" autocomplete="off" />
        <button id="dkdQuickFilterClear" type="button" class="dkd-filter-clear">Temizle</button>
      </div>
      <div class="dkd-filter-actions">
        <button type="button" data-dkd-filter-open="dkdProducts">Ürünler</button>
        <button type="button" data-dkd-filter-open="dkdSocialPosts">Telegram</button>
        <button type="button" data-dkd-filter-open="dkdHotFeed">Sıcak</button>
        <button type="button" data-dkd-filter-open="dkdWatchLinks">Linkler</button>
      </div>
      <div id="dkdQuickFilterCount" class="dkd-filter-count">Filtre hazır</div>
    `;
    dkdPanel.insertBefore(dkdCard, dkdFirstSection);

    const dkdInput = document.getElementById('dkdQuickFilterInput');
    const dkdClear = document.getElementById('dkdQuickFilterClear');
    if (dkdInput) dkdInput.addEventListener('input', dkdApplyFilter);
    if (dkdClear) dkdClear.addEventListener('click', dkdClearFilter);
    dkdCard.querySelectorAll('[data-dkd-filter-open]').forEach((dkdButton) => {
      dkdButton.addEventListener('click', () => dkdOpenTarget(dkdButton.dataset.dkdFilterOpen));
    });
    dkdApplyFilter();
  }

  const dkdObserver = new MutationObserver(() => {
    dkdCreatePanel();
    dkdApplyFilter();
  });

  window.addEventListener('load', () => {
    dkdCreatePanel();
    dkdApplyFilter();
    const dkdPanel = document.getElementById('dkdPanel');
    if (dkdPanel) dkdObserver.observe(dkdPanel, { childList: true, subtree: true });
    setTimeout(dkdApplyFilter, 700);
    setTimeout(dkdApplyFilter, 1600);
  });
})();
