const DKD_V324_VERSION = '3.2.4';
const DKD_V324_PROJECT_REF = 'guuwomvszlwhkmstewfl';
const DKD_V324_API_URL = 'https://guuwomvszlwhkmstewfl.supabase.co';
const DKD_V324_API_KEY = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';
const DKD_V324_RPC_PATTERN = /\/rest\/v1\/rpc\/dkd_gate_[a-z0-9_]+_v31(?:\?|$)/i;
const DKD_V324_ADMIN_EMAILS = new Set([
  'draborneagle@gmail.com',
  'playreview@draborneagle.com',
]);

if (!window.__DKD_GATE_V324_PUBLIC_RPC_FETCH__) {
  const dkdV324NativeFetch = window.fetch.bind(window);
  window.__DKD_GATE_V324_PUBLIC_RPC_FETCH__ = dkdV324NativeFetch;

  window.fetch = function dkdV324PublicRpcFetch(dkdInput, dkdInit = {}) {
    const dkdUrl = typeof dkdInput === 'string' || dkdInput instanceof URL
      ? String(dkdInput)
      : String(dkdInput?.url || '');

    if (!DKD_V324_RPC_PATTERN.test(dkdUrl)) return dkdV324NativeFetch(dkdInput, dkdInit);

    const dkdHeaders = new Headers(dkdInput instanceof Request ? dkdInput.headers : undefined);
    const dkdOverrideHeaders = new Headers(dkdInit?.headers || undefined);
    dkdOverrideHeaders.forEach((dkdValue, dkdKey) => dkdHeaders.set(dkdKey, dkdValue));
    dkdHeaders.delete('Accept-Profile');
    dkdHeaders.delete('Content-Profile');

    return dkdV324NativeFetch(dkdInput, {
      ...dkdInit,
      headers: dkdHeaders,
      cache: 'no-store',
    });
  };
}

await import(`./v3.1.1.data.js?v=${DKD_V324_VERSION}`);

if (!window.dkdV31Data) throw new Error('DraBornGate v3.2.4 veri katmanı başlatılamadı.');
window.dkdV31Data.version = DKD_V324_VERSION;
window.dkdV31Data.rpcSchema = 'public';

function dkdV324DecodeJwt(dkdToken) {
  try {
    const dkdPart = String(dkdToken || '').split('.')[1];
    if (!dkdPart) return null;
    const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
    const dkdJson = decodeURIComponent(Array.from(atob(dkdBase64), (dkdChar) =>
      `%${dkdChar.charCodeAt(0).toString(16).padStart(2, '0')}`
    ).join(''));
    return JSON.parse(dkdJson);
  } catch {
    return null;
  }
}

function dkdV324FindSessionValue(dkdValue, dkdDepth = 0) {
  if (dkdDepth > 7 || dkdValue == null) return null;
  if (typeof dkdValue === 'string') {
    if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(dkdValue)) return { access_token: dkdValue };
    try {
      return dkdV324FindSessionValue(JSON.parse(dkdValue), dkdDepth + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) {
      const dkdSession = dkdV324FindSessionValue(dkdItem, dkdDepth + 1);
      if (dkdSession) return dkdSession;
    }
    return null;
  }
  if (typeof dkdValue === 'object') {
    if (typeof dkdValue.access_token === 'string') return dkdValue;
    for (const dkdKey of ['currentSession', 'session', 'data', 'value']) {
      const dkdSession = dkdV324FindSessionValue(dkdValue[dkdKey], dkdDepth + 1);
      if (dkdSession) return dkdSession;
    }
  }
  return null;
}

function dkdV324ReadSession() {
  for (const dkdStore of [localStorage, sessionStorage]) {
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = String(dkdStore.key(dkdIndex) || '');
      if (!dkdKey.includes(DKD_V324_PROJECT_REF) && !/auth-token|session/i.test(dkdKey)) continue;
      const dkdSession = dkdV324FindSessionValue(dkdStore.getItem(dkdKey));
      if (dkdSession?.access_token) return dkdSession;
    }
  }
  return null;
}

function dkdV324CurrentEmail() {
  const dkdPayload = dkdV324DecodeJwt(dkdV324ReadSession()?.access_token);
  return String(
    dkdPayload?.email ||
    dkdPayload?.user_metadata?.email ||
    dkdPayload?.app_metadata?.email ||
    ''
  ).trim().toLocaleLowerCase('tr-TR');
}

function dkdV324NormalizeCatalog(dkdPayload) {
  if (Array.isArray(dkdPayload) && dkdPayload.length === 1 && dkdPayload[0] && typeof dkdPayload[0] === 'object') return dkdPayload[0];
  return dkdPayload && typeof dkdPayload === 'object' ? dkdPayload : null;
}

async function dkdV324DirectAdminCatalog() {
  const dkdToken = dkdV324ReadSession()?.access_token;
  if (!dkdToken) return null;
  const dkdResponse = await fetch(`${DKD_V324_API_URL}/rest/v1/rpc/dkd_gate_admin_partner_catalog_v31`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: DKD_V324_API_KEY,
      Authorization: `Bearer ${dkdToken}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  if (!dkdResponse.ok) return null;
  return dkdV324NormalizeCatalog(await dkdResponse.json().catch(() => null));
}

const dkdV324OriginalLoadAdminCatalog = window.dkdV31Data.loadAdminCatalog.bind(window.dkdV31Data);
window.dkdV31Data.loadAdminCatalog = async function dkdV324LoadAdminCatalog() {
  const dkdEmail = dkdV324CurrentEmail();
  const dkdAllowed = DKD_V324_ADMIN_EMAILS.has(dkdEmail);
  let dkdCatalog = await dkdV324OriginalLoadAdminCatalog();
  if (dkdCatalog || !dkdAllowed) return dkdCatalog;

  for (const dkdDelay of [0, 320, 900]) {
    if (dkdDelay) await new Promise((dkdResolve) => setTimeout(dkdResolve, dkdDelay));
    dkdCatalog = await dkdV324DirectAdminCatalog().catch(() => null);
    if (dkdCatalog) break;
  }

  window.dkdV31Data.state.adminCatalog = dkdCatalog || {
    users: [],
    sites: [],
    links: [],
    dkd_v324_admin_verified: true,
    dkd_v324_catalog_pending: true,
  };
  return window.dkdV31Data.state.adminCatalog;
};

window.dkdV324CurrentEmail = dkdV324CurrentEmail;
window.dkdV324IsAdminEmail = () => DKD_V324_ADMIN_EMAILS.has(dkdV324CurrentEmail());
