const DKD_V325_SESSION_VERSION = '3.2.5';
const dkdV325SessionData = window.dkdV31Data;

if (!dkdV325SessionData) throw new Error('DraBornGate v3.2.5 oturum katmanı veri bağlantısını bulamadı.');

const dkdV325SessionState = {
  context: null,
  contextPromise: null,
  logoutBusy: false,
  redirectingRole: false,
};

function dkdV325SessionNormalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV325CanonicalRole(dkdValue) {
  const dkdRole = dkdV325SessionNormalize(dkdValue);
  if (dkdRole === 'security' || dkdRole === 'guvenlik') return 'security';
  if (dkdRole === 'courier' || dkdRole === 'kurye') return 'courier';
  if (dkdRole === 'site management' || dkdRole === 'site yonetimi') return 'site_management';
  if (dkdRole === 'resident' || dkdRole === 'site sakini') return 'resident';
  return dkdRole;
}

function dkdV325CurrentRole() {
  return dkdV325CanonicalRole(dkdV325SessionState.context?.preferred_role || '');
}

function dkdV325SimpleRequested() {
  return dkdV325SessionNormalize(location.pathname).includes('guvenlik sade tema') ||
    sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
    sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

async function dkdV325LoadContext(dkdForce = false) {
  if (!dkdForce && dkdV325SessionState.context) return dkdV325SessionState.context;
  if (dkdV325SessionState.contextPromise) return dkdV325SessionState.contextPromise;
  dkdV325SessionState.contextPromise = (async () => {
    const dkdContext = await dkdV325SessionData.rpc('dkd_gate_current_user_context_v325', {});
    dkdV325SessionState.context = dkdContext && typeof dkdContext === 'object' ? dkdContext : null;
    return dkdV325SessionState.context;
  })();
  try {
    return await dkdV325SessionState.contextPromise;
  } finally {
    dkdV325SessionState.contextPromise = null;
  }
}

function dkdV325ClearSimpleFlags() {
  for (const dkdKey of [
    'dkd_gate_security_theme',
    'dkd_gate_force_theme',
    'dkd_gate_transition',
    'dkd_gate_route',
    'dkd_gate_clean_personal_route',
  ]) sessionStorage.removeItem(dkdKey);
}

function dkdV325ApplyRoleAccess() {
  const dkdRole = dkdV325CurrentRole();
  if (!dkdRole) return;
  document.documentElement.dataset.dkdV325Role = dkdRole;
  const dkdIsSecurity = dkdRole === 'security';
  if (!dkdIsSecurity && dkdV325SimpleRequested() && !dkdV325SessionState.redirectingRole) {
    dkdV325SessionState.redirectingRole = true;
    dkdV325ClearSimpleFlags();
    location.replace(`/DraBornGate/?theme=modern&role=${encodeURIComponent(dkdRole)}&v=${DKD_V325_SESSION_VERSION}&dkd=${Date.now()}`);
  }
}

function dkdV325IsLogoutControl(dkdTarget) {
  const dkdControl = dkdTarget?.closest?.('button,a,[role="button"]');
  if (!dkdControl) return null;
  if (dkdControl.id === 'dkd-v28-exit') return dkdControl;
  const dkdLabel = dkdV325SessionNormalize([
    dkdControl.getAttribute('aria-label'),
    dkdControl.getAttribute('title'),
    dkdControl.textContent,
  ].join(' '));
  return /(^| )cikis yap( |$)|(^| )cikis( |$)|(^| )logout( |$)/.test(dkdLabel) ? dkdControl : null;
}

async function dkdV325RunLogout(dkdControl) {
  if (dkdV325SessionState.logoutBusy) return;
  dkdV325SessionState.logoutBusy = true;
  if (dkdControl) {
    dkdControl.disabled = true;
    dkdControl.setAttribute('aria-busy', 'true');
  }
  try {
    await dkdV325SessionData.logout();
  } catch (dkdError) {
    console.error('DraBornGate çıkışı tamamlanamadı:', dkdError);
    dkdV325ClearSimpleFlags();
    location.replace(`/DraBornGate/?logout=1&v=${DKD_V325_SESSION_VERSION}&dkd=${Date.now()}`);
  }
}

document.addEventListener('click', (dkdEvent) => {
  const dkdLogoutControl = dkdV325IsLogoutControl(dkdEvent.target);
  if (!dkdLogoutControl) return;
  dkdEvent.preventDefault();
  dkdEvent.stopPropagation();
  dkdEvent.stopImmediatePropagation();
  void dkdV325RunLogout(dkdLogoutControl);
}, true);

async function dkdV325SessionBoot() {
  const dkdContext = await dkdV325LoadContext();
  dkdV325ApplyRoleAccess();
  if (dkdContext?.is_admin) await dkdV325SessionData.loadAdminCatalog(true).catch(() => undefined);
  if (dkdContext?.partner_visible) await dkdV325SessionData.loadPartnerSummary().catch(() => undefined);
  if (dkdV325CurrentRole() === 'security' && dkdV325SimpleRequested()) {
    await dkdV325SessionData.loadQueue().catch(() => undefined);
  }
}

window.dkdV325Session = {
  version: DKD_V325_SESSION_VERSION,
  state: dkdV325SessionState,
  loadContext: dkdV325LoadContext,
  currentRole: dkdV325CurrentRole,
  applyRoleAccess: dkdV325ApplyRoleAccess,
  logout: dkdV325RunLogout,
};

void dkdV325SessionBoot();
