const DKD_V3221_EARNINGS_FIX_VERSION = '3.2.21';
const dkdV3221EarningsFixState = { dispatching: false };

function dkdV3221EarningsNormalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV3221IsCourierRole(dkdValue) {
  const dkdRole = dkdV3221EarningsNormalize(dkdValue);
  return dkdRole.includes('courier') || dkdRole.includes('kurye');
}

function dkdV3221CurrentRole() {
  return window.dkdV325Session?.currentRole?.()
    || window.dkdV324Session?.currentRole?.()
    || window.dkdV31Data?.state?.role
    || '';
}

async function dkdV3221EnrichEarningsContext(dkdOriginalRpc, dkdThis, dkdArguments) {
  const dkdContext = await dkdOriginalRpc.apply(dkdThis, dkdArguments);
  if (!dkdContext || typeof dkdContext !== 'object' || Array.isArray(dkdContext)) return dkdContext;

  const dkdStoredRole = String(dkdContext.preferred_role || '');
  const dkdFallbackRole = String(dkdV3221CurrentRole() || '');
  const dkdRole = dkdV3221IsCourierRole(dkdStoredRole) ? dkdStoredRole : dkdFallbackRole;
  let dkdPreferredRole = dkdStoredRole;

  if (dkdV3221IsCourierRole(dkdRole)) {
    const dkdNormalizedRole = dkdV3221EarningsNormalize(dkdRole);
    if (dkdNormalizedRole.includes('courier') && !dkdNormalizedRole.includes('kurye')) {
      dkdPreferredRole = `${dkdRole} kurye`;
    } else if (!dkdPreferredRole) {
      dkdPreferredRole = dkdRole;
    }
  }

  let dkdPartnerVisible = Boolean(dkdContext.partner_visible);
  if (!dkdPartnerVisible && typeof window.dkdV31Data?.loadPartnerSummary === 'function') {
    const dkdSummary = await window.dkdV31Data.loadPartnerSummary().catch(() => null);
    dkdPartnerVisible = Boolean(
      dkdSummary?.visible
      || (Array.isArray(dkdSummary?.sites) && dkdSummary.sites.length > 0)
    );
  }

  return {
    ...dkdContext,
    preferred_role: dkdPreferredRole,
    partner_visible: dkdPartnerVisible,
  };
}

function dkdV3221ArmContextCompatibility() {
  const dkdData = window.dkdV31Data;
  if (!dkdData || typeof dkdData.rpc !== 'function') return false;
  if (dkdData.rpc.__dkdV3221EarningsContextWrapper) return true;

  const dkdOriginalRpc = dkdData.rpc;
  const dkdWrappedRpc = async function dkdV3221EarningsContextRpc(...dkdArguments) {
    const dkdFunctionName = String(dkdArguments[0] || '');
    if (dkdFunctionName !== 'dkd_gate_current_user_context_v325') {
      return dkdOriginalRpc.apply(this, dkdArguments);
    }

    dkdData.rpc = dkdOriginalRpc;
    return dkdV3221EnrichEarningsContext(dkdOriginalRpc, this, dkdArguments);
  };
  dkdWrappedRpc.__dkdV3221EarningsContextWrapper = true;
  dkdData.rpc = dkdWrappedRpc;
  return true;
}

function dkdV3221DispatchEarningsOpen() {
  if (!dkdV3221ArmContextCompatibility()) return;
  const dkdTrigger = document.createElement('button');
  dkdTrigger.type = 'button';
  dkdTrigger.hidden = true;
  dkdTrigger.dataset.dkdV3211Earnings = 'true';
  document.body.appendChild(dkdTrigger);
  dkdV3221EarningsFixState.dispatching = true;
  try {
    dkdTrigger.click();
  } finally {
    dkdV3221EarningsFixState.dispatching = false;
    dkdTrigger.remove();
  }
}

document.addEventListener('click', (dkdEvent) => {
  const dkdTarget = dkdEvent.target instanceof Element ? dkdEvent.target : null;
  if (!dkdTarget || dkdV3221EarningsFixState.dispatching) return;

  if (dkdTarget.closest('[data-dkd-v3211-earnings],[data-dkd-v3211-refresh-earnings]')) {
    dkdV3221ArmContextCompatibility();
    return;
  }

  const dkdCanonical = dkdTarget.closest('.dkd-v3219-earnings-menu,.dkd-v3220-earnings-menu');
  const dkdLegacy = dkdTarget.closest('button,a,[role="button"],li,article');
  const dkdLegacyLabel = dkdLegacy && !dkdLegacy.closest('#dkd-v3211-earnings,#dkd-v328-modal')
    ? dkdV3221EarningsNormalize(dkdLegacy.textContent)
    : '';

  if (!dkdCanonical && dkdLegacyLabel !== 'kazanclarim' && dkdLegacyLabel !== 'kazancim') return;
  dkdEvent.preventDefault();
  dkdEvent.stopImmediatePropagation();
  dkdV3221DispatchEarningsOpen();
}, true);

window.__DKD_GATE_V3221_EARNINGS_FIX__ = true;
window.__DKD_GATE_V3221_EARNINGS_FIX_VERSION__ = DKD_V3221_EARNINGS_FIX_VERSION;
