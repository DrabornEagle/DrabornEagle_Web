const DKD_V324_AUTH_VERSION = '3.2.4';
const DKD_V324_PROJECT_REF = 'guuwomvszlwhkmstewfl';
const DKD_V324_API_URL = 'https://guuwomvszlwhkmstewfl.supabase.co';
const DKD_V324_API_KEY = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';
const DKD_V324_AUTH_KEY = `sb-${DKD_V324_PROJECT_REF}-auth-token`;
const dkdV324AuthData = window.dkdV31Data;

if (!dkdV324AuthData) throw new Error('DraBornGate v3.2.4 oturum veri katmanı bulunamadı.');

const dkdV324AuthRuntime = {
  memorySession: null,
  refreshPromise: null,
  refreshBlockedUntil: 0,
  adminPromise: null,
  adminLastAttempt: 0,
  partnerPromise: null,
  partnerLoadedAt: 0,
  logoutPromise: null,
};

function dkdV324DecodeJwt(dkdToken) {
  try {
    const dkdPart = String(dkdToken || '').split('.')[1];
    if (!dkdPart) return null;
    const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
    return JSON.parse(decodeURIComponent(Array.from(atob(dkdBase64), (dkdChar) => `%${dkdChar.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
  } catch {
    return null;
  }
}

function dkdV324IsAccessToken(dkdToken, dkdAllowExpired = false) {
  if (!/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(String(dkdToken || ''))) return false;
  const dkdPayload = dkdV324DecodeJwt(dkdToken);
  if (!dkdPayload?.sub) return false;
  const dkdIssuer = String(dkdPayload.iss || '');
  const dkdRef = String(dkdPayload.ref || dkdPayload.project_ref || '');
  if (!dkdIssuer.includes(DKD_V324_PROJECT_REF) && dkdRef !== DKD_V324_PROJECT_REF) return false;
  return dkdAllowExpired || Number(dkdPayload.exp || 0) > Math.floor(Date.now() / 1000) + 20;
}

function dkdV324FindSession(dkdValue, dkdDepth = 0, dkdVisited = new WeakSet()) {
  if (dkdDepth > 8 || dkdValue == null) return null;
  if (typeof dkdValue === 'string') {
    if (dkdV324IsAccessToken(dkdValue, true)) return { access_token: dkdValue, refresh_token: '' };
    try { return dkdV324FindSession(JSON.parse(dkdValue), dkdDepth + 1, dkdVisited); } catch { return null; }
  }
  if (typeof dkdValue !== 'object' || dkdVisited.has(dkdValue)) return null;
  dkdVisited.add(dkdValue);
  if (dkdV324IsAccessToken(dkdValue.access_token, true)) {
    return {
      access_token: dkdValue.access_token,
      refresh_token: typeof dkdValue.refresh_token === 'string' ? dkdValue.refresh_token : '',
      expires_at: Number(dkdValue.expires_at || dkdV324DecodeJwt(dkdValue.access_token)?.exp || 0),
    };
  }
  for (const dkdNested of Array.isArray(dkdValue) ? dkdValue : Object.values(dkdValue)) {
    const dkdSession = dkdV324FindSession(dkdNested, dkdDepth + 1, dkdVisited);
    if (dkdSession) return dkdSession;
  }
  return null;
}

function dkdV324SessionScore(dkdSession) {
  const dkdPayload = dkdV324DecodeJwt(dkdSession?.access_token);
  return (dkdV324IsAccessToken(dkdSession?.access_token) ? 10_000_000_000 : 0) +
    (dkdSession?.storageKey === DKD_V324_AUTH_KEY ? 1_000_000_000 : 0) +
    (dkdSession?.refresh_token ? 100_000_000 : 0) + Number(dkdPayload?.exp || dkdSession?.expires_at || 0);
}

function dkdV324ReadSession() {
  const dkdCandidates = [];
  if (dkdV324AuthRuntime.memorySession) dkdCandidates.push({ ...dkdV324AuthRuntime.memorySession, storageKey: 'memory' });
  for (const dkdStore of [localStorage, sessionStorage]) {
    const dkdKeys = [DKD_V324_AUTH_KEY];
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = String(dkdStore.key(dkdIndex) || '');
      if (dkdKey && !dkdKeys.includes(dkdKey)) dkdKeys.push(dkdKey);
    }
    for (const dkdKey of dkdKeys) {
      let dkdRaw = null;
      try { dkdRaw = dkdStore.getItem(dkdKey); } catch { continue; }
      const dkdSession = dkdV324FindSession(dkdRaw);
      if (dkdSession) dkdCandidates.push({ ...dkdSession, storage: dkdStore, storageKey: dkdKey, rawValue: dkdRaw });
    }
  }
  dkdCandidates.sort((dkdLeft, dkdRight) => dkdV324SessionScore(dkdRight) - dkdV324SessionScore(dkdLeft));
  return dkdCandidates[0] || null;
}

function dkdV324MergeEnvelope(dkdValue, dkdPayload, dkdDepth = 0) {
  if (dkdDepth > 8 || dkdValue == null || typeof dkdValue !== 'object') return dkdValue;
  if (Array.isArray(dkdValue)) return dkdValue.map((dkdItem) => dkdV324MergeEnvelope(dkdItem, dkdPayload, dkdDepth + 1));
  if ('access_token' in dkdValue || 'refresh_token' in dkdValue) return { ...dkdValue, ...dkdPayload };
  const dkdCopy = { ...dkdValue };
  for (const [dkdKey, dkdNested] of Object.entries(dkdCopy)) dkdCopy[dkdKey] = dkdV324MergeEnvelope(dkdNested, dkdPayload, dkdDepth + 1);
  return dkdCopy;
}

function dkdV324WriteSession(dkdOldSession, dkdPayload) {
  dkdV324AuthRuntime.memorySession = { ...dkdPayload };
  const dkdOldAccess = String(dkdOldSession?.access_token || '');
  const dkdOldRefresh = String(dkdOldSession?.refresh_token || '');
  for (const dkdStore of [localStorage, sessionStorage]) {
    const dkdKeys = Array.from({ length: dkdStore.length }, (_, dkdIndex) => String(dkdStore.key(dkdIndex) || '')).filter(Boolean);
    for (const dkdKey of dkdKeys) {
      let dkdRaw = '';
      try { dkdRaw = String(dkdStore.getItem(dkdKey) || ''); } catch { continue; }
      if (dkdKey !== DKD_V324_AUTH_KEY && !(dkdOldAccess && dkdRaw.includes(dkdOldAccess)) && !(dkdOldRefresh && dkdRaw.includes(dkdOldRefresh))) continue;
      try { dkdStore.setItem(dkdKey, JSON.stringify(dkdV324MergeEnvelope(JSON.parse(dkdRaw), dkdPayload))); }
      catch { if (dkdKey === DKD_V324_AUTH_KEY) dkdStore.setItem(dkdKey, JSON.stringify(dkdPayload)); }
    }
  }
  try { localStorage.setItem(DKD_V324_AUTH_KEY, JSON.stringify(dkdPayload)); } catch { /* memory fallback */ }
}

async function dkdV324Refresh(dkdSession) {
  if (!dkdSession?.refresh_token || Date.now() < dkdV324AuthRuntime.refreshBlockedUntil) return '';
  if (dkdV324AuthRuntime.refreshPromise) return dkdV324AuthRuntime.refreshPromise;
  dkdV324AuthRuntime.refreshPromise = (async () => {
    const dkdResponse = await fetch(`${DKD_V324_API_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST', cache: 'no-store',
      headers: { apikey: DKD_V324_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: dkdSession.refresh_token }),
    });
    const dkdPayload = await dkdResponse.json().catch(() => null);
    if (!dkdResponse.ok || !dkdV324IsAccessToken(dkdPayload?.access_token)) {
      dkdV324AuthRuntime.refreshBlockedUntil = Date.now() + (dkdResponse.status === 429 ? 30000 : 15000);
      return '';
    }
    dkdV324AuthRuntime.refreshBlockedUntil = 0;
    dkdV324WriteSession(dkdSession, dkdPayload);
    return dkdPayload.access_token;
  })();
  try { return await dkdV324AuthRuntime.refreshPromise; }
  finally { dkdV324AuthRuntime.refreshPromise = null; }
}

async function dkdV324ResolveToken(dkdForceRefresh = false) {
  const dkdSession = dkdV324ReadSession();
  if (!dkdSession) return '';
  if (!dkdForceRefresh && dkdV324IsAccessToken(dkdSession.access_token)) return dkdSession.access_token;
  return dkdV324Refresh(dkdSession);
}

async function dkdV324WaitToken(dkdTimeout = 9000, dkdForceRefresh = false) {
  const dkdStarted = Date.now();
  let dkdFirst = true;
  while (Date.now() - dkdStarted < dkdTimeout) {
    const dkdToken = await dkdV324ResolveToken(dkdForceRefresh && dkdFirst);
    dkdFirst = false;
    if (dkdToken) return dkdToken;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 300));
  }
  throw new Error('DraBornGate oturumu doğrulanamadı. Çıkış yapıp tekrar giriş yapın.');
}

async function dkdV324RpcRequest(dkdName, dkdArgs, dkdToken) {
  const dkdResponse = await fetch(`${DKD_V324_API_URL}/rest/v1/rpc/${encodeURIComponent(dkdName)}`, {
    method: 'POST', cache: 'no-store',
    headers: { apikey: DKD_V324_API_KEY, Authorization: `Bearer ${dkdToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(dkdArgs),
  });
  const dkdText = await dkdResponse.text();
  let dkdPayload = null;
  try { dkdPayload = dkdText ? JSON.parse(dkdText) : null; } catch { dkdPayload = dkdText; }
  return { response: dkdResponse, payload: dkdPayload };
}

async function dkdV324Rpc(dkdName, dkdArgs = {}) {
  let dkdToken = await dkdV324WaitToken();
  let dkdResult = await dkdV324RpcRequest(dkdName, dkdArgs, dkdToken);
  if (dkdResult.response.status === 401) {
    dkdToken = await dkdV324WaitToken(6000, true);
    dkdResult = await dkdV324RpcRequest(dkdName, dkdArgs, dkdToken);
  }
  if (!dkdResult.response.ok) {
    let dkdMessage = dkdV324AuthData.readableError?.(dkdResult.payload) || `Sunucu isteği tamamlanamadı (HTTP ${dkdResult.response.status}).`;
    if (dkdResult.response.status === 401) dkdMessage = 'DraBornGate oturumu geçersiz veya süresi dolmuş. Çıkış yapıp tekrar giriş yapın.';
    if (dkdResult.response.status === 429) dkdMessage = 'Oturum doğrulama isteği geçici olarak sınırlandı. Birkaç saniye sonra tekrar deneyin.';
    throw new Error(dkdMessage);
  }
  return dkdResult.payload;
}

function dkdV324CleanPass(dkdRow) {
  const dkdStatus = String(dkdRow?.status || 'waiting');
  return {
    ...dkdRow,
    category: dkdStatus === 'arrived' ? 'arrived' : ['waiting', 'approved'].includes(dkdStatus) ? 'approaching' : 'other',
    courier_name: dkdRow?.courier_name || 'Kurye bilgisi bulunamadı',
    courier_phone: dkdRow?.courier_phone || 'Telefon paylaşılmadı',
    courier_plate: dkdRow?.courier_plate || 'Plaka paylaşılmadı',
    platform: dkdRow?.platform || 'Platform paylaşılmadı',
    origin_name: dkdRow?.origin_name || dkdRow?.platform || 'Çıkış noktası paylaşılmadı',
    origin_address: dkdRow?.origin_address || `${dkdRow?.platform || 'Kurye'} gönderisi`,
    customer_name: dkdRow?.customer_name || 'Müşteri adı paylaşılmadı',
    destination_full: dkdRow?.destination_full || dkdRow?.address_text || 'Teslimat adresi paylaşılmadı',
    order_number: dkdRow?.order_number || 'Sipariş numarası paylaşılmadı',
    note: dkdRow?.note || 'Teslimat notu bulunmuyor',
    approval_code: dkdRow?.approval_code || '',
  };
}

async function dkdV324LoadQueue() {
  const dkdState = dkdV324AuthData.state;
  if (dkdState.queueLoading) return dkdState.queue;
  dkdState.queueLoading = true; dkdState.queueError = '';
  try {
    const dkdRows = await dkdV324Rpc('dkd_gate_security_queue_v31', { dkd_limit: 100, dkd_offset: 0 });
    dkdState.queue = (Array.isArray(dkdRows) ? dkdRows : []).map(dkdV324CleanPass);
    dkdState.queueLoaded = true; dkdState.lastQueueSync = new Date();
    return dkdState.queue;
  } catch (dkdError) {
    dkdState.queueError = dkdV324AuthData.readableError?.(dkdError) || 'Canlı kurye kuyruğu alınamadı.';
    throw dkdError;
  } finally { dkdState.queueLoading = false; }
}

async function dkdV324FindPass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('Lütfen 6 haneli kurye kodunu eksiksiz girin.');
  const dkdRows = await dkdV324Rpc('dkd_gate_security_find_pass_v31', { dkd_code: dkdCleanCode });
  const dkdPass = Array.isArray(dkdRows) ? dkdRows[0] : null;
  if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
  dkdV324AuthData.state.foundPass = dkdV324CleanPass(dkdPass);
  return dkdV324AuthData.state.foundPass;
}

async function dkdV324ApprovePass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('6 haneli kurye kodu geçersiz.');
  const dkdResult = await dkdV324Rpc('dkd_gate_security_approve_pass_v31', { dkd_code: dkdCleanCode });
  dkdV324AuthData.state.approvalSuccess = dkdResult; dkdV324AuthData.state.foundPass = null;
  await dkdV324LoadQueue();
  return dkdResult;
}

async function dkdV324LoadPartnerSummary(dkdForce = false) {
  if (!dkdForce && dkdV324AuthData.state.partnerSummary && Date.now() - dkdV324AuthRuntime.partnerLoadedAt < 15000) return dkdV324AuthData.state.partnerSummary;
  if (dkdV324AuthRuntime.partnerPromise) return dkdV324AuthRuntime.partnerPromise;
  dkdV324AuthRuntime.partnerPromise = (async () => {
    try {
      dkdV324AuthData.state.partnerSummary = await dkdV324Rpc('dkd_gate_partner_summary_v31', {}) || { visible: false, sites: [] };
      dkdV324AuthRuntime.partnerLoadedAt = Date.now();
    } catch { dkdV324AuthData.state.partnerSummary = { visible: false, sites: [] }; }
    return dkdV324AuthData.state.partnerSummary;
  })();
  try { return await dkdV324AuthRuntime.partnerPromise; }
  finally { dkdV324AuthRuntime.partnerPromise = null; }
}

async function dkdV324LoadPartnerRows(dkdLimit = 20, dkdOffset = 0) {
  const dkdRows = await dkdV324Rpc('dkd_gate_partner_earnings_rows_v31', { dkd_limit: dkdLimit, dkd_offset: dkdOffset });
  if (dkdOffset === 0) dkdV324AuthData.state.partnerRows = Array.isArray(dkdRows) ? dkdRows : [];
  else dkdV324AuthData.state.partnerRows.push(...(Array.isArray(dkdRows) ? dkdRows : []));
  return Array.isArray(dkdRows) ? dkdRows : [];
}

async function dkdV324LoadAdminCatalog(dkdForce = false) {
  if (!dkdForce && dkdV324AuthData.state.adminCatalog) return dkdV324AuthData.state.adminCatalog;
  if (dkdV324AuthRuntime.adminPromise) return dkdV324AuthRuntime.adminPromise;
  if (!dkdForce && Date.now() - dkdV324AuthRuntime.adminLastAttempt < 5000) return dkdV324AuthData.state.adminCatalog;
  dkdV324AuthRuntime.adminLastAttempt = Date.now();
  dkdV324AuthData.state.adminLoading = true;
  dkdV324AuthRuntime.adminPromise = (async () => {
    try { dkdV324AuthData.state.adminCatalog = await dkdV324Rpc('dkd_gate_admin_partner_catalog_v31', {}) || null; }
    catch (dkdError) {
      dkdV324AuthData.state.adminCatalog = null;
      dkdV324AuthData.state.adminError = dkdV324AuthData.readableError?.(dkdError) || 'Admin yetkisi doğrulanamadı.';
    } finally { dkdV324AuthData.state.adminLoading = false; }
    return dkdV324AuthData.state.adminCatalog;
  })();
  try { return await dkdV324AuthRuntime.adminPromise; }
  finally { dkdV324AuthRuntime.adminPromise = null; }
}

async function dkdV324AssignPartnerSite(dkdUserId, dkdSiteId, dkdAmount, dkdActive) {
  const dkdResult = await dkdV324Rpc('dkd_gate_admin_assign_partner_site_v31', {
    dkd_user_id: dkdUserId, dkd_site_id: dkdSiteId,
    dkd_amount_per_courier: Number(dkdAmount || 10), dkd_is_active: Boolean(dkdActive),
  });
  await dkdV324LoadAdminCatalog(true);
  return dkdResult;
}

function dkdV324ClearSessions() {
  dkdV324AuthRuntime.memorySession = null;
  for (const dkdStore of [localStorage, sessionStorage]) {
    const dkdKeys = Array.from({ length: dkdStore.length }, (_, dkdIndex) => String(dkdStore.key(dkdIndex) || '')).filter(Boolean);
    for (const dkdKey of dkdKeys) {
      let dkdRaw = '';
      try { dkdRaw = String(dkdStore.getItem(dkdKey) || ''); } catch { continue; }
      if (dkdV324FindSession(dkdRaw) || dkdKey.includes(DKD_V324_PROJECT_REF) || /dkd_gate.*session|draborngate.*auth/i.test(dkdKey)) {
        try { dkdStore.removeItem(dkdKey); } catch { /* ignore */ }
      }
    }
  }
  for (const dkdKey of ['dkd_gate_route','dkd_gate_clean_personal_route','dkd_gate_transition','dkd_gate_security_theme','dkd_gate_force_theme']) sessionStorage.removeItem(dkdKey);
}

async function dkdV324Logout() {
  if (dkdV324AuthRuntime.logoutPromise) return dkdV324AuthRuntime.logoutPromise;
  dkdV324AuthRuntime.logoutPromise = (async () => {
    let dkdToken = '';
    try { dkdToken = await dkdV324ResolveToken(); } catch { /* local logout */ }
    if (dkdToken) await fetch(`${DKD_V324_API_URL}/auth/v1/logout?scope=local`, {
      method: 'POST', cache: 'no-store',
      headers: { apikey: DKD_V324_API_KEY, Authorization: `Bearer ${dkdToken}`, 'Content-Type': 'application/json' },
    }).catch(() => undefined);
    dkdV324ClearSessions();
    location.replace(`/DraBornGate/?logout=1&v=${DKD_V324_AUTH_VERSION}&dkd=${Date.now()}`);
  })();
  return dkdV324AuthRuntime.logoutPromise;
}

Object.assign(dkdV324AuthData, {
  version: DKD_V324_AUTH_VERSION,
  rpc: dkdV324Rpc,
  resolveAccessToken: dkdV324ResolveToken,
  readStoredSession: dkdV324ReadSession,
  loadQueue: dkdV324LoadQueue,
  findPass: dkdV324FindPass,
  approvePass: dkdV324ApprovePass,
  loadPartnerSummary: dkdV324LoadPartnerSummary,
  loadPartnerRows: dkdV324LoadPartnerRows,
  loadAdminCatalog: dkdV324LoadAdminCatalog,
  assignPartnerSite: dkdV324AssignPartnerSite,
  logout: dkdV324Logout,
  refreshLock: true,
});

window.dkdV324Auth = { version: DKD_V324_AUTH_VERSION, runtime: dkdV324AuthRuntime };
