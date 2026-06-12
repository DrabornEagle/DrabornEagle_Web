(() => {
  let dkdStopRequested = false;
  let dkdRunning = false;

  function dkdKey() {
    return localStorage.getItem('dkd_admin_key') || '';
  }

  function dkdFindProductCards() {
    const dkdRoot = document.getElementById('dkdProducts');
    if (!dkdRoot) return [];
    return Array.from(dkdRoot.querySelectorAll('.dkd-item[data-dkd-product-url]'));
  }

  function dkdCardTitle(dkdCard) {
    return (dkdCard.querySelector('.dkd-title')?.textContent || 'Ürün').trim();
  }

  function dkdCardUrl(dkdCard) {
    return String(dkdCard.dataset.dkdProductUrl || '').trim();
  }

  function dkdIsShortUrl(dkdUrl) {
    try {
      const dkdHost = new URL(dkdUrl).hostname.toLowerCase();
      return dkdHost === 'ty.gl' || dkdHost.endsWith('.ty.gl');
    } catch {
      return true;
    }
  }

  function dkdLog(dkdText, dkdClass = '') {
    const dkdBox = document.getElementById('dkdBatchShareLog');
    if (!dkdBox) return;
    const dkdLine = document.createElement('div');
    dkdLine.className = `dkd-item ${dkdClass}`;
    dkdLine.textContent = dkdText;
    dkdBox.prepend(dkdLine);
    while (dkdBox.children.length > 8) dkdBox.lastChild.remove();
  }

  function dkdSleep(dkdMs) {
    return new Promise((resolve) => setTimeout(resolve, dkdMs));
  }

  async function dkdShareUrl(dkdUrl) {
    const dkdResponse = await fetch('/api/dkd-share-link-direct', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-dkd-admin-key': dkdKey()
      },
      body: JSON.stringify({ dkd_url: dkdUrl })
    });
    const dkdJson = await dkdResponse.json().catch(() => ({}));
    if (!dkdResponse.ok) throw new Error(dkdJson.dkd_error || 'Paylaşım başarısız');
    return dkdJson;
  }

  async function dkdRunBatchShare() {
    if (dkdRunning) return;
    dkdRunning = true;
    dkdStopRequested = false;
    const dkdStartButton = document.getElementById('dkdBatchShareStart');
    if (dkdStartButton) dkdStartButton.disabled = true;

    try {
      const dkdCards = dkdFindProductCards();
      const dkdCandidates = dkdCards.map((dkdCard) => ({ title: dkdCardTitle(dkdCard), url: dkdCardUrl(dkdCard) })).filter((dkdItem) => dkdItem.url);
      const dkdLimit = Math.min(3, dkdCandidates.length);
      let dkdShared = 0;
      let dkdSkipped = 0;
      dkdLog(`${dkdCandidates.length} ürün tarandı. En fazla ${dkdLimit} ürün paylaşılacak.`, '');

      for (const dkdItem of dkdCandidates) {
        if (dkdStopRequested) {
          dkdLog('Durduruldu.', '');
          break;
        }
        if (dkdShared >= dkdLimit) break;
        if (dkdIsShortUrl(dkdItem.url)) {
          dkdSkipped += 1;
          dkdLog(`Kısa link atlandı: ${dkdItem.title}`, '');
          continue;
        }
        try {
          dkdLog(`Paylaşılıyor: ${dkdItem.title}`, '');
          await dkdShareUrl(dkdItem.url);
          dkdShared += 1;
          dkdLog(`Paylaşıldı: ${dkdItem.title}`, '');
          await dkdSleep(1400);
        } catch (dkdError) {
          dkdSkipped += 1;
          dkdLog(`Atlandı: ${dkdItem.title} — ${dkdError.message}`, '');
        }
      }
      dkdLog(`Bitti. Paylaşılan: ${dkdShared}, atlanan: ${dkdSkipped}`, '');
      if (window.dkdSafeLoadAll) setTimeout(window.dkdSafeLoadAll, 900);
    } finally {
      dkdRunning = false;
      if (dkdStartButton) dkdStartButton.disabled = false;
    }
  }

  function dkdCreatePanel() {
    if (document.getElementById('dkdBatchShareCard')) return;
    const dkdPanel = document.getElementById('dkdPanel');
    const dkdFirstSection = dkdPanel?.querySelector('.dkd-section');
    if (!dkdPanel || !dkdFirstSection) return;

    const dkdCard = document.createElement('section');
    dkdCard.id = 'dkdBatchShareCard';
    dkdCard.className = 'dkd-card dkd-share-card';
    dkdCard.innerHTML = `
      <div class="dkd-card-head">
        <div>
          <p class="dkd-kicker-small">Fırsat Radarı</p>
          <h2>Toplu Telegram Paylaşımı</h2>
        </div>
      </div>
      <p class="dkd-muted">Kayıtlı ürünleri tarar, kısa linkleri atlar ve uygun ilk 3 ürünü Telegram kanalına sırayla gönderir.</p>
      <div class="dkd-form-actions">
        <button id="dkdBatchShareStart" type="button">Tara ve Paylaş</button>
        <button id="dkdBatchShareStop" type="button" class="dkd-secondary-btn">Durdur</button>
      </div>
      <div id="dkdBatchShareLog" class="dkd-list"></div>
    `;
    dkdPanel.insertBefore(dkdCard, dkdFirstSection);

    document.getElementById('dkdBatchShareStart')?.addEventListener('click', dkdRunBatchShare);
    document.getElementById('dkdBatchShareStop')?.addEventListener('click', () => {
      dkdStopRequested = true;
      dkdLog('Durdurma istendi. Çalışan işlem bitince duracak.', '');
    });
  }

  window.addEventListener('load', () => {
    setTimeout(dkdCreatePanel, 400);
    setTimeout(dkdCreatePanel, 1400);
  });
})();
