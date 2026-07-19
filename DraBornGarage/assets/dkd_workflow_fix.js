(() => {
  'use strict';

  const WEB_VERSION = '1.6';
  const POLL_INTERVAL = 15000;
  let corePatched = false;
  let gateActive = false;
  let gateRefreshBusy = false;
  let originalRender = null;
  let originalRenderPanel = null;
  let originalRefreshWorkspace = null;
  let gatePoll = null;
  let gateChannel = null;
  let observedUserId = null;

  const getDKD = () => window.DKD;
  const getState = () => getDKD()?.state || {};
  const escapeHtml = (value = '') => {
    const dkd = getDKD();
    if (typeof dkd?.esc === 'function') return dkd.esc(value);
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  };

  function formatDate(value) {
    if (!value) return 'Başvuru tarihi hazırlanıyor';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Başvuru tarihi hazırlanıyor';
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function activeMembershipExists() {
    const state = getState();
    return Boolean(
      state.workshop
      && state.membership
      && state.membership.is_active !== false
      && Array.isArray(state.memberships)
      && state.memberships.some((item) => item?.is_active !== false),
    );
  }

  function gateApplication() {
    const state = getState();
    if (!state.session?.user || state.profile?.is_admin || activeMembershipExists()) return null;
    const application = state.businessApplication;
    if (!application) return null;
    if (application.status === 'pending') return application;
    if (application.status === 'approved' && !activeMembershipExists()) return application;
    return null;
  }

  function shouldGate() {
    return Boolean(gateApplication());
  }

  function gateCopy(application) {
    if (application.status === 'approved') {
      return {
        kicker: 'ADMİN ONAYI TAMAMLANDI',
        title: 'Panellerin hazırlanıyor',
        copy: 'İşletme ve Usta erişimin onaylandı. Yetkilerin hesabına aktarılıyor; birkaç saniye içinde panellerin otomatik açılacak.',
        step: 'Yetkiler aktarılıyor',
        icon: '✓',
      };
    }
    return {
      kicker: 'İŞLETME BAŞVURUSU',
      title: 'Başvurunuz inceleniyor',
      copy: 'Başvurun Admin paneline ulaştı. Onay verilene kadar yalnızca bu durum ekranı gösterilir; İşletme ve Usta panelleri onaydan sonra birlikte aktif olur.',
      step: 'Admin onayı bekleniyor',
      icon: '⌛',
    };
  }

  function renderGate() {
    const dkd = getDKD();
    const application = gateApplication();
    const app = document.getElementById('dkd-app');
    if (!dkd || !application || !app) return false;

    gateActive = true;
    document.body.classList.add('dkd-application-gated');
    document.getElementById('dkd-modal-root')?.replaceChildren();

    const copy = gateCopy(application);
    const reference = String(application.id || '').split('-')[0].toUpperCase();
    const note = application.review_note
      ? `<p class="dkd-application-gate-note">Admin notu: ${escapeHtml(application.review_note)}</p>`
      : `<p class="dkd-application-gate-note">Durum otomatik kontrol edilir. Sayfayı açık bırakabilirsin.</p>`;

    app.innerHTML = `<main class="dkd-application-gate" role="main">
      <section class="dkd-application-gate-card" aria-live="polite">
        <div class="dkd-application-gate-brand">
          <div class="dkd-application-gate-logo" aria-hidden="true">⚙</div>
          <div><strong>DraBornGarage</strong><span>WEB v${WEB_VERSION} · GÜVENLİ BAŞVURU</span></div>
        </div>

        <div class="dkd-application-gate-status" aria-hidden="true">${copy.icon}</div>
        <p class="dkd-application-gate-kicker">${copy.kicker}</p>
        <h1>${copy.title}</h1>
        <p class="dkd-application-gate-copy">${copy.copy}</p>

        <div class="dkd-application-gate-business">
          <div class="ico" aria-hidden="true">🏢</div>
          <div>
            <strong>${escapeHtml(application.business_name || 'Yeni işletme')}</strong>
            <span>${escapeHtml(formatDate(application.submitted_at))}${reference ? ` · Başvuru ${escapeHtml(reference)}` : ''}</span>
          </div>
        </div>

        <div class="dkd-application-gate-steps" aria-label="Başvuru adımları">
          <div class="dkd-application-gate-step done"><b>✓</b>Hesap oluşturuldu</div>
          <div class="dkd-application-gate-step ${application.status === 'approved' ? 'done' : 'active'}"><b>${application.status === 'approved' ? '✓' : '2'}</b>${application.status === 'approved' ? 'Admin onayladı' : copy.step}</div>
          <div class="dkd-application-gate-step ${application.status === 'approved' ? 'active' : ''}"><b>3</b>İşletme + Usta paneli</div>
        </div>

        <div class="dkd-application-gate-actions">
          <button class="dkd-btn" id="dkd-gate-refresh" type="button">↻ Durumu Yenile</button>
          <button class="dkd-btn ghost" id="dkd-gate-logout" type="button">Çıkış</button>
        </div>
        ${note}
      </section>
    </main>`;

    app.querySelector('#dkd-gate-refresh')?.addEventListener('click', refreshGate);
    app.querySelector('#dkd-gate-logout')?.addEventListener('click', signOutFromGate);
    startGatePoll();
    subscribeGateUpdates();
    return true;
  }

  async function refreshGate() {
    if (gateRefreshBusy || !originalRefreshWorkspace) return;
    gateRefreshBusy = true;
    const button = document.getElementById('dkd-gate-refresh');
    if (button) {
      button.disabled = true;
      button.textContent = 'Kontrol ediliyor…';
    }
    try {
      await originalRefreshWorkspace(true);
      syncGate(true);
    } catch (error) {
      getDKD()?.toast?.(error?.message || 'Başvuru durumu kontrol edilemedi.', 'error');
    } finally {
      gateRefreshBusy = false;
      const current = document.getElementById('dkd-gate-refresh');
      if (current) {
        current.disabled = false;
        current.textContent = '↻ Durumu Yenile';
      }
    }
  }

  async function signOutFromGate() {
    const dkd = getDKD();
    const button = document.getElementById('dkd-gate-logout');
    if (button) button.disabled = true;
    try {
      await dkd?.client?.auth?.signOut();
    } finally {
      location.replace(`${dkd?.BASE || '/DraBornGarage'}/giris`);
    }
  }

  function deactivateGate(openPanel = true) {
    if (!gateActive) return;
    gateActive = false;
    document.body.classList.remove('dkd-application-gated');
    stopGatePoll();

    if (openPanel && activeMembershipExists()) {
      const dkd = getDKD();
      const panelPath = `${dkd?.BASE || '/DraBornGarage'}/panel`;
      history.replaceState({}, '', panelPath);
      if (typeof originalRender === 'function') originalRender();
      else location.reload();
    }
  }

  function syncGate(openPanel = false) {
    if (shouldGate()) return renderGate();
    if (gateActive) deactivateGate(openPanel || activeMembershipExists());
    return false;
  }

  function startGatePoll() {
    if (gatePoll) return;
    gatePoll = window.setInterval(() => {
      if (!gateActive) return;
      refreshGate();
    }, POLL_INTERVAL);
  }

  function stopGatePoll() {
    if (!gatePoll) return;
    clearInterval(gatePoll);
    gatePoll = null;
  }

  function subscribeGateUpdates() {
    const dkd = getDKD();
    const userId = dkd?.state?.session?.user?.id;
    if (!dkd?.client || !userId || observedUserId === userId) return;

    if (gateChannel) dkd.client.removeChannel(gateChannel).catch(() => undefined);
    observedUserId = userId;
    gateChannel = dkd.client
      .channel(`dkd-web-application-gate-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'business_applications',
        filter: `user_id=eq.${userId}`,
      }, refreshGate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workshop_members',
        filter: `user_id=eq.${userId}`,
      }, refreshGate)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      }, refreshGate)
      .subscribe();
  }

  function patchCore() {
    const dkd = getDKD();
    if (corePatched || !dkd?.render || !dkd?.refreshWorkspace) return false;
    corePatched = true;
    dkd.__workflowV16Patched = true;

    originalRender = dkd.render.bind(dkd);
    originalRenderPanel = typeof dkd.renderPanel === 'function' ? dkd.renderPanel.bind(dkd) : null;
    originalRefreshWorkspace = dkd.refreshWorkspace.bind(dkd);

    dkd.render = (...args) => {
      if (shouldGate()) return renderGate();
      deactivateGate(false);
      return originalRender(...args);
    };

    if (originalRenderPanel) {
      dkd.renderPanel = (...args) => {
        if (shouldGate()) return renderGate();
        deactivateGate(false);
        return originalRenderPanel(...args);
      };
    }

    dkd.refreshWorkspace = async (...args) => {
      const result = await originalRefreshWorkspace(...args);
      queueMicrotask(() => syncGate(true));
      return result;
    };

    document.documentElement.dataset.webVersion = WEB_VERSION;
    setTimeout(() => syncGate(false), 0);
    setTimeout(() => syncGate(false), 500);
    return true;
  }

  function updateVisualViewport() {
    const viewport = window.visualViewport;
    const height = Math.max(320, Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight));
    const top = Math.max(0, Math.round(viewport?.offsetTop || 0));
    document.documentElement.style.setProperty('--dkd-visual-viewport-height', `${height}px`);
    document.documentElement.style.setProperty('--dkd-visual-viewport-top', `${top}px`);
  }

  function prepareModal() {
    updateVisualViewport();
    const modal = document.querySelector('.dkd-modal-backdrop .dkd-modal');
    if (!modal || modal.dataset.dkdViewportReady === '1') return;
    modal.dataset.dkdViewportReady = '1';
    requestAnimationFrame(() => {
      modal.scrollTop = 0;
      const head = modal.querySelector('.dkd-modal-head');
      head?.scrollIntoView({ block: 'start' });
    });
  }

  function installViewportFix() {
    updateVisualViewport();
    window.addEventListener('resize', updateVisualViewport, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(updateVisualViewport, 120), { passive: true });
    window.visualViewport?.addEventListener('resize', updateVisualViewport, { passive: true });
    window.visualViewport?.addEventListener('scroll', updateVisualViewport, { passive: true });

    const modalRoot = document.getElementById('dkd-modal-root');
    if (modalRoot) {
      new MutationObserver(prepareModal).observe(modalRoot, { childList: true, subtree: true });
    }

    document.addEventListener('focusin', (event) => {
      const field = event.target.closest?.('.dkd-modal input,.dkd-modal textarea,.dkd-modal select');
      if (!field) return;
      setTimeout(() => {
        updateVisualViewport();
        field.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 260);
    }, true);
  }

  function observeGateIntegrity() {
    const app = document.getElementById('dkd-app');
    if (!app) return;
    new MutationObserver(() => {
      if (!gateActive || app.querySelector('.dkd-application-gate')) return;
      requestAnimationFrame(renderGate);
    }).observe(app, { childList: true });
  }

  function boot() {
    installViewportFix();
    observeGateIntegrity();

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (patchCore() || attempts > 240) clearInterval(timer);
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
