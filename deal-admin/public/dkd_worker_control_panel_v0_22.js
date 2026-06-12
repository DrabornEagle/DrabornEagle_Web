(() => {
  const dkdControlBase = 'http://127.0.0.1:8788';

  function dkdKey() {
    return localStorage.getItem('dkd_admin_key') || '';
  }

  function dkdEscape(dkdValue) {
    return String(dkdValue ?? '').replace(/[&<>"']/g, (dkdChar) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[dkdChar]));
  }

  async function dkdControlApi(dkdPath, dkdOptions = {}) {
    const dkdResponse = await fetch(`${dkdControlBase}${dkdPath}`, {
      ...dkdOptions,
      headers: {
        'content-type': 'application/json',
        'x-dkd-admin-key': dkdKey(),
        ...(dkdOptions.headers || {})
      }
    });
    const dkdJson = await dkdResponse.json().catch(() => ({}));
    if (!dkdResponse.ok) throw new Error(dkdJson.dkd_error || 'DraBornBee kontrol API hatası');
    return dkdJson;
  }

  function dkdRenderState(dkdState) {
    const dkdBox = document.getElementById('dkdWorkerControlState');
    if (!dkdBox) return;
    const dkdLogs = (dkdState.dkd_logs || []).slice(0, 8).map((dkdLog) => `<div class="dkd-item"><div class="dkd-meta">${dkdEscape(dkdLog.dkd_time)}</div><div class="dkd-title">${dkdEscape(dkdLog.dkd_line)}</div></div>`).join('');
    dkdBox.innerHTML = `
      <div class="dkd-item">
        <div class="dkd-title">Durum: ${dkdState.dkd_running ? 'Çalışıyor' : 'Kapalı'}</div>
        <div class="dkd-meta">PID: ${dkdEscape(dkdState.dkd_pid || '-')} · Başladı: ${dkdEscape(dkdState.dkd_started_at || '-')} · Sürüm: ${dkdEscape(dkdState.dkd_worker_version || 'v0.34')}</div>
        <span class="dkd-pill ${dkdState.dkd_running ? 'hot' : 'warn'}">${dkdState.dkd_running ? 'aktif' : 'kapalı'}</span>
      </div>
      ${dkdLogs || '<p class="dkd-muted">Henüz DraBornBee logu yok.</p>'}
    `;
  }

  async function dkdRefreshState() {
    const dkdBox = document.getElementById('dkdWorkerControlState');
    try {
      const dkdJson = await dkdControlApi('/api/dkd-worker-status');
      dkdRenderState(dkdJson.dkd_state);
    } catch (dkdError) {
      if (dkdBox) dkdBox.innerHTML = `<div class="dkd-item"><div class="dkd-title">DraBornBee kontrol server kapalı</div><div class="dkd-meta">${dkdEscape(dkdError.message)}. npm run dev komutunun v0.34 launcher ile çalıştığından emin ol.</div></div>`;
    }
  }

  async function dkdStartWorker() {
    const dkdBox = document.getElementById('dkdWorkerControlState');
    if (dkdBox) dkdBox.innerHTML = '<div class="dkd-item"><div class="dkd-title">DraBornBee başlatılıyor...</div></div>';
    const dkdJson = await dkdControlApi('/api/dkd-worker-start', { method: 'POST', body: '{}' });
    dkdRenderState(dkdJson.dkd_state);
    setTimeout(dkdRefreshState, 1200);
  }

  async function dkdStopWorker() {
    const dkdJson = await dkdControlApi('/api/dkd-worker-stop', { method: 'POST', body: '{}' });
    dkdRenderState(dkdJson.dkd_state);
    setTimeout(dkdRefreshState, 1200);
  }

  function dkdCreateCard() {
    if (document.getElementById('dkdWorkerControlCard')) return;
    const dkdPanel = document.getElementById('dkdPanel');
    const dkdFirstSection = dkdPanel?.querySelector('.dkd-section');
    if (!dkdPanel || !dkdFirstSection) return;

    const dkdCard = document.createElement('section');
    dkdCard.id = 'dkdWorkerControlCard';
    dkdCard.className = 'dkd-card dkd-share-card';
    dkdCard.innerHTML = `
      <div class="dkd-card-head">
        <div>
          <p class="dkd-kicker-small">DraBornBee</p>
          <h2>Veri Çekme Motoru</h2>
        </div>
      </div>
      <p class="dkd-muted">DraBornDeal için fırsat adaylarını DraBornBee ile tara, başlat, durdur ve logları izle.</p>
      <div class="dkd-form-actions">
        <button id="dkdWorkerStartBtn" type="button">DraBornBee Başlat</button>
        <button id="dkdWorkerStopBtn" type="button" class="dkd-secondary-btn">Durdur</button>
      </div>
      <button id="dkdWorkerRefreshBtn" type="button" class="dkd-secondary-btn" style="margin-top:8px;width:100%">Durum Yenile</button>
      <div id="dkdWorkerControlState" class="dkd-list"></div>
    `;
    dkdPanel.insertBefore(dkdCard, dkdFirstSection);

    document.getElementById('dkdWorkerStartBtn')?.addEventListener('click', () => dkdStartWorker().catch((dkdError) => alert(dkdError.message)));
    document.getElementById('dkdWorkerStopBtn')?.addEventListener('click', () => dkdStopWorker().catch((dkdError) => alert(dkdError.message)));
    document.getElementById('dkdWorkerRefreshBtn')?.addEventListener('click', dkdRefreshState);
    dkdRefreshState();
  }

  window.addEventListener('load', () => {
    setTimeout(dkdCreateCard, 400);
    setTimeout(dkdCreateCard, 1400);
    setInterval(dkdRefreshState, 10000);
  });
})();
