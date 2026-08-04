const DKD_V324_SESSION_VERSION = '3.2.4';
const dkdV324Data = window.dkdV31Data;

if (!dkdV324Data) throw new Error('DraBornGate v3.2.4 oturum katmanı veri bağlantısını bulamadı.');

const dkdV324SessionState = {
  context: null,
  contextPromise: null,
  patchTimer: 0,
  logoutBusy: false,
  redirectingRole: false,
};

function dkdV324SessionNormalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV324CanonicalRole(dkdValue) {
  const dkdRole = dkdV324SessionNormalize(dkdValue);
  if (dkdRole === 'security' || dkdRole === 'guvenlik') return 'security';
  if (dkdRole === 'courier' || dkdRole === 'kurye') return 'courier';
  if (dkdRole === 'site management' || dkdRole === 'site yonetimi') return 'site_management';
  if (dkdRole === 'resident' || dkdRole === 'site sakini') return 'resident';
  return dkdRole;
}

function dkdV324DomRole() {
  const dkdCandidates = [...document.querySelectorAll('span,strong,b,p,small')]
    .filter((dkdElement) => {
      const dkdText = dkdV324SessionNormalize(dkdElement.textContent);
      if (!['guvenlik', 'kurye', 'site yonetimi', 'site sakini'].includes(dkdText)) return false;
      const dkdRect = dkdElement.getBoundingClientRect();
      return dkdRect.top >= 0 && dkdRect.top < 720 && String(dkdElement.textContent || '').trim().length < 30;
    });
  return dkdV324CanonicalRole(dkdCandidates[0]?.textContent || '');
}

function dkdV324CurrentRole() {
  return dkdV324CanonicalRole(dkdV324SessionState.context?.preferred_role || dkdV324DomRole());
}

function dkdV324SimpleRequested() {
  return dkdV324SessionNormalize(location.pathname).includes('guvenlik sade tema') ||
    sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
    sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

async function dkdV324LoadContext(dkdForce = false) {
  if (!dkdForce && dkdV324SessionState.context) return dkdV324SessionState.context;
  if (dkdV324SessionState.contextPromise) return dkdV324SessionState.contextPromise;
  dkdV324SessionState.contextPromise = (async () => {
    try {
      const dkdContext = await dkdV324Data.rpc('dkd_gate_current_user_context_v324', {});
      dkdV324SessionState.context = dkdContext && typeof dkdContext === 'object' ? dkdContext : null;
      return dkdV324SessionState.context;
    } catch (dkdError) {
      console.warn('DraBornGate kullanıcı bağlamı alınamadı:', dkdError);
      return null;
    }
  })();
  try {
    return await dkdV324SessionState.contextPromise;
  } finally {
    dkdV324SessionState.contextPromise = null;
  }
}

function dkdV324ClearSimpleFlags() {
  sessionStorage.removeItem('dkd_gate_security_theme');
  sessionStorage.removeItem('dkd_gate_force_theme');
  sessionStorage.removeItem('dkd_gate_transition');
  sessionStorage.removeItem('dkd_gate_route');
  sessionStorage.removeItem('dkd_gate_clean_personal_route');
}

function dkdV324PatchThemeAccess() {
  const dkdRole = dkdV324CurrentRole();
  const dkdIsSecurity = dkdRole === 'security';

  if (dkdRole && !dkdIsSecurity) {
    for (const dkdControl of document.querySelectorAll('#dkd-v28-modern-switch,button[aria-label],button[title],a[aria-label],a[title]')) {
      const dkdLabel = dkdV324SessionNormalize([
        dkdControl.getAttribute('aria-label'),
        dkdControl.getAttribute('title'),
        dkdControl.textContent,
      ].join(' '));
      if (dkdControl.id === 'dkd-v28-modern-switch' || dkdLabel.includes('sade tema')) dkdControl.remove();
    }
  }

  if (
    dkdV324SessionState.context &&
    !dkdIsSecurity &&
    dkdV324SimpleRequested() &&
    !dkdV324SessionState.redirectingRole
  ) {
    dkdV324SessionState.redirectingRole = true;
    dkdV324ClearSimpleFlags();
    location.replace(`/DraBornGate/?theme=modern&role=${encodeURIComponent(dkdRole || 'user')}&v=${DKD_V324_SESSION_VERSION}&dkd=${Date.now()}`);
  }
}

function dkdV324IsLogoutControl(dkdTarget) {
  const dkdControl = dkdTarget?.closest?.('button,a,[role="button"]');
  if (!dkdControl) return null;
  if (dkdControl.id === 'dkd-v28-exit') return dkdControl;
  const dkdLabel = dkdV324SessionNormalize([
    dkdControl.getAttribute('aria-label'),
    dkdControl.getAttribute('title'),
    dkdControl.textContent,
  ].join(' '));
  return /(^| )cikis yap( |$)|(^| )cikis( |$)|(^| )logout( |$)/.test(dkdLabel) ? dkdControl : null;
}

async function dkdV324RunLogout(dkdControl) {
  if (dkdV324SessionState.logoutBusy) return;
  dkdV324SessionState.logoutBusy = true;
  if (dkdControl) {
    dkdControl.disabled = true;
    dkdControl.setAttribute('aria-busy', 'true');
  }
  try {
    await dkdV324Data.logout();
  } catch (dkdError) {
    console.error('DraBornGate çıkışı tamamlanamadı:', dkdError);
    dkdV324ClearSimpleFlags();
    location.replace(`/DraBornGate/?logout=1&v=${DKD_V324_SESSION_VERSION}&dkd=${Date.now()}`);
  }
}

document.addEventListener('click', (dkdEvent) => {
  const dkdLogoutControl = dkdV324IsLogoutControl(dkdEvent.target);
  if (!dkdLogoutControl) return;
  dkdEvent.preventDefault();
  dkdEvent.stopPropagation();
  dkdEvent.stopImmediatePropagation();
  void dkdV324RunLogout(dkdLogoutControl);
}, true);

function dkdV324ScheduleSessionPatch() {
  clearTimeout(dkdV324SessionState.patchTimer);
  dkdV324SessionState.patchTimer = setTimeout(dkdV324PatchThemeAccess, 60);
}

new MutationObserver(dkdV324ScheduleSessionPatch).observe(document.body, { childList: true, subtree: true });

async function dkdV324SessionBoot() {
  const dkdContext = await dkdV324LoadContext();
  dkdV324PatchThemeAccess();
  if (dkdContext?.is_admin) await dkdV324Data.loadAdminCatalog(true);
  if (dkdContext?.preferred_role && dkdV324CanonicalRole(dkdContext.preferred_role) === 'security' && dkdV324SimpleRequested()) {
    await dkdV324Data.loadQueue().catch(() => undefined);
  }
}

window.dkdV324Session = {
  version: DKD_V324_SESSION_VERSION,
  state: dkdV324SessionState,
  loadContext: dkdV324LoadContext,
  currentRole: dkdV324CurrentRole,
  logout: dkdV324RunLogout,
};

void dkdV324SessionBoot();
