const DKD_V312_VERSION = '3.1.2';
const DKD_V312_PROJECT_REF = 'guuwomvszlwhkmstewfl';
const DKD_V312_API_URL = 'https://guuwomvszlwhkmstewfl.supabase.co';
const DKD_V312_API_KEY = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';
const DKD_V312_AUTH_STORAGE_KEY = `sb-${DKD_V312_PROJECT_REF}-auth-token`;
const DKD_V312_BRIDGE_KEY = 'dkd_gate_live_session_v312';

const dkdV31State = {
  queue: [], queueLoading: false, queueLoaded: false, queueError: '', queueRenderPending: false,
  codeBusy: false, codeFeedback: null, foundPass: null, approvalSuccess: null,
  queueLimits: { arrived: 3, approaching: 3, other: 3 }, queueOpen: true,
  partnerSummary: null, partnerRows: [], partnerRowsLimit: 10, partnerLoading: false,
  adminStatus: null, adminCatalog: null, adminLoading: false, lastQueueSync: null,
};

function dkdV31Normalize(dkdValue) {
  return String(dkdValue || '').toLocaleLowerCase('tr-TR').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, ' ').trim();
}
function dkdV31Escape(dkdValue) {
  return String(dkdValue ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function dkdV31ReadableError(dkdValue, dkdDepth = 0) {
  if (dkdDepth > 7 || dkdValue == null) return '';
  if (dkdValue instanceof Error) return dkdValue.message || 'Beklenmeyen hata oluştu.';
  if (typeof dkdValue === 'string') {
    const dkdText = dkdValue.trim();
    if (!dkdText || dkdText === '[object Object]') return '';
    try { return dkdV31ReadableError(JSON.parse(dkdText), dkdDepth + 1) || dkdText; } catch { return dkdText; }
  }
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) { const dkdMessage = dkdV31ReadableError(dkdItem, dkdDepth + 1); if (dkdMessage) return dkdMessage; }
    return '';
  }
  if (typeof dkdValue === 'object') {
    for (const dkdKey of ['message','error_description','error','details','hint','description','msg']) {
      const dkdMessage = dkdV31ReadableError(dkdValue[dkdKey], dkdDepth + 1); if (dkdMessage) return dkdMessage;
    }
  }
  return '';
}
function dkdV31DecodeJwtPayload(dkdToken) {
  try {
    const dkdPart = String(dkdToken || '').split('.')[1]; if (!dkdPart) return null;
    const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
    return JSON.parse(decodeURIComponent(Array.from(atob(dkdBase64), (dkdChar) => `%${dkdChar.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
  } catch { return null; }
}
function dkdV31IsProjectAccessToken(dkdToken, dkdAllowExpired = false) {
  if (!/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(String(dkdToken || ''))) return false;
  const dkdPayload = dkdV31DecodeJwtPayload(dkdToken); if (!dkdPayload?.sub) return false;
  const dkdIssuer = String(dkdPayload.iss || ''); const dkdRef = String(dkdPayload.ref || dkdPayload.project_ref || '');
  if (!dkdIssuer.includes(DKD_V312_PROJECT_REF) && dkdRef !== DKD_V312_PROJECT_REF) return false;
  if (!dkdAllowExpired && Number(dkdPayload.exp || 0) <= Math.floor(Date.now() / 1000) + 15) return false;
  return true;
}
function dkdV31FindSessionInValue(dkdValue, dkdDepth = 0) {
  if (dkdDepth > 8 || dkdValue == null) return null;
  if (typeof dkdValue === 'string') {
    if (dkdV31IsProjectAccessToken(dkdValue, true)) return { access_token: dkdValue, refresh_token: '' };
    try { return dkdV31FindSessionInValue(JSON.parse(dkdValue), dkdDepth + 1); } catch { return null; }
  }
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) { const dkdSession = dkdV31FindSessionInValue(dkdItem, dkdDepth + 1); if (dkdSession) return dkdSession; }
    return null;
  }
  if (typeof dkdValue === 'object') {
    const dkdAccessToken = dkdValue.access_token || dkdValue.accessToken || dkdValue.token;
    if (dkdV31IsProjectAccessToken(dkdAccessToken, true)) return {
      access_token: dkdAccessToken,
      refresh_token: typeof (dkdValue.refresh_token || dkdValue.refreshToken) === 'string' ? (dkdValue.refresh_token || dkdValue.refreshToken) : '',
    };
    for (const dkdKey of ['currentSession','session','data','value','auth','user']) {
      const dkdSession = dkdV31FindSessionInValue(dkdValue[dkdKey], dkdDepth + 1); if (dkdSession) return dkdSession;
    }
  }
  return null;
}
function dkdV31ReadStoredSession() {
  const dkdWindowSession = dkdV31FindSessionInValue(window.__DKD_GATE_LAST_SESSION__) || dkdV31FindSessionInValue(window.__DKD_GATE_LAST_ACCESS_TOKEN__);
  if (dkdWindowSession) return { ...dkdWindowSession, storage: sessionStorage, storageKey: DKD_V312_BRIDGE_KEY };
  for (const dkdStore of [sessionStorage, localStorage]) {
    const dkdPriorityKeys = [DKD_V312_BRIDGE_KEY, DKD_V312_AUTH_STORAGE_KEY];
    for (const dkdKey of dkdPriorityKeys) {
      const dkdSession = dkdV31FindSessionInValue(dkdStore.getItem(dkdKey));
      if (dkdSession) return { ...dkdSession, storage: dkdStore, storageKey: dkdKey };
    }
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = String(dkdStore.key(dkdIndex) || ''); if (dkdPriorityKeys.includes(dkdKey)) continue;
      const dkdSession = dkdV31FindSessionInValue(dkdStore.getItem(dkdKey));
      if (dkdSession) return { ...dkdSession, storage: dkdStore, storageKey: dkdKey };
    }
  }
  return null;
}
function dkdV31PublishSession(dkdPayload) {
  const dkdSession = dkdV31FindSessionInValue(dkdPayload); if (!dkdSession?.access_token) return '';
  window.__DKD_GATE_LAST_ACCESS_TOKEN__ = dkdSession.access_token; window.__DKD_GATE_LAST_SESSION__ = dkdSession;
  try { sessionStorage.setItem(DKD_V312_BRIDGE_KEY, JSON.stringify(dkdSession)); } catch {}
  return dkdSession.access_token;
}
async function dkdV31RefreshStoredSession(dkdSession) {
  if (!dkdSession?.refresh_token) return null;
  const dkdResponse = await fetch(`${DKD_V312_API_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', cache: 'no-store', headers: { apikey: DKD_V312_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: dkdSession.refresh_token }),
  });
  const dkdPayload = await dkdResponse.json().catch(() => null);
  if (!dkdResponse.ok || !dkdV31IsProjectAccessToken(dkdPayload?.access_token)) return null;
  return dkdV31PublishSession(dkdPayload);
}
async function dkdV31ResolveAccessToken(dkdForceRefresh = false) {
  window.dkdV312ScanStores?.();
  const dkdSession = dkdV31ReadStoredSession(); if (!dkdSession) return '';
  if (!dkdForceRefresh && dkdV31IsProjectAccessToken(dkdSession.access_token)) return dkdSession.access_token;
  const dkdRefreshed = await dkdV31RefreshStoredSession(dkdSession); if (dkdRefreshed) return dkdRefreshed;
  window.dkdV312ScanStores?.();
  const dkdLatest = dkdV31ReadStoredSession();
  if (dkdLatest && dkdV31IsProjectAccessToken(dkdLatest.access_token) && (!dkdForceRefresh || dkdLatest.access_token !== dkdSession.access_token)) return dkdLatest.access_token;
  return '';
}
async function dkdV31WaitForAccessToken(dkdTimeoutMs = 15000, dkdForceRefresh = false) {
  const dkdStartedAt = Date.now();
  while (Date.now() - dkdStartedAt < dkdTimeoutMs) {
    const dkdToken = await dkdV31ResolveAccessToken(dkdForceRefresh); if (dkdToken) return dkdToken;
    await new Promise((dkdResolve) => {
      const dkdTimer = setTimeout(dkdResolve, 220);
      window.addEventListener('dkd-gate-session-ready', () => { clearTimeout(dkdTimer); dkdResolve(); }, { once: true });
    });
  }
  throw new Error('DraBornGate oturumu bulunamadı. Ana paneldeki açık oturumla tekrar deneyin.');
}
async function dkdV31RpcRequest(dkdFunctionName, dkdArguments, dkdToken) {
  const dkdResponse = await fetch(`${DKD_V312_API_URL}/rest/v1/rpc/${encodeURIComponent(dkdFunctionName)}`, {
    method: 'POST', cache: 'no-store', headers: {
      apikey: DKD_V312_API_KEY, Authorization: `Bearer ${dkdToken}`, 'Content-Type': 'application/json',
      'Accept-Profile': 'draborngate', 'Content-Profile': 'draborngate',
    }, body: JSON.stringify(dkdArguments),
  });
  const dkdText = await dkdResponse.text(); let dkdPayload = null;
  if (dkdText) { try { dkdPayload = JSON.parse(dkdText); } catch { dkdPayload = dkdText; } }
  return { response: dkdResponse, payload: dkdPayload };
}
async function dkdV31Rpc(dkdFunctionName, dkdArguments = {}) {
  let dkdToken = await dkdV31WaitForAccessToken();
  let dkdResult = await dkdV31RpcRequest(dkdFunctionName, dkdArguments, dkdToken);
  if (dkdResult.response.status === 401) {
    dkdToken = await dkdV31WaitForAccessToken(8000, true);
    dkdResult = await dkdV31RpcRequest(dkdFunctionName, dkdArguments, dkdToken);
  }
  if (!dkdResult.response.ok) {
    let dkdMessage = dkdV31ReadableError(dkdResult.payload) || `Sunucu isteği tamamlanamadı (HTTP ${dkdResult.response.status}).`;
    if (dkdResult.response.status === 401 || /suitable key|wrong key|jwt|token/i.test(dkdMessage)) dkdMessage = 'DraBornGate oturumu yenilenemedi. Ana panele dönüp tekrar deneyin.';
    throw new Error(dkdMessage);
  }
  return dkdResult.payload;
}
function dkdV31IsSimpleTheme() {
  return dkdV31Normalize(location.pathname).includes('guvenlik sade tema') || sessionStorage.getItem('dkd_gate_security_theme') === 'simple' || sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}
function dkdV31CleanPass(dkdRow) {
  const dkdStatus = String(dkdRow?.status || 'waiting');
  const dkdCategory = dkdStatus === 'arrived' ? 'arrived' : ['waiting','approved'].includes(dkdStatus) ? 'approaching' : 'other';
  return { ...dkdRow, category: dkdCategory,
    courier_name: dkdRow?.courier_name || 'Kurye bilgisi bulunamadı', courier_phone: dkdRow?.courier_phone || 'Telefon paylaşılmadı',
    courier_plate: dkdRow?.courier_plate || 'Plaka paylaşılmadı', platform: dkdRow?.platform || 'Platform paylaşılmadı',
    origin_name: dkdRow?.origin_name || dkdRow?.platform || 'Çıkış noktası paylaşılmadı', origin_address: dkdRow?.origin_address || `${dkdRow?.platform || 'Kurye'} gönderisi`,
    origin_contact_name: dkdRow?.origin_contact_name || '', origin_contact_phone: dkdRow?.origin_contact_phone || '',
    customer_name: dkdRow?.customer_name || 'Müşteri adı paylaşılmadı', destination_full: dkdRow?.destination_full || dkdRow?.address_text || 'Teslimat adresi paylaşılmadı',
    order_number: dkdRow?.order_number || 'Sipariş numarası paylaşılmadı', note: dkdRow?.note || 'Teslimat notu bulunmuyor', approval_code: dkdRow?.approval_code || '',
  };
}
async function dkdV31LoadQueue() {
  if (dkdV31State.queueLoading) return dkdV31State.queue;
  dkdV31State.queueLoading = true; dkdV31State.queueError = '';
  try {
    const dkdRows = await dkdV31Rpc('dkd_gate_security_queue_v31', { dkd_limit: 100, dkd_offset: 0 });
    dkdV31State.queue = (Array.isArray(dkdRows) ? dkdRows : []).map(dkdV31CleanPass);
    dkdV31State.queueLoaded = true; dkdV31State.lastQueueSync = new Date(); return dkdV31State.queue;
  } catch (dkdError) { dkdV31State.queueError = dkdV31ReadableError(dkdError) || 'Canlı kurye kuyruğu alınamadı.'; throw dkdError; }
  finally { dkdV31State.queueLoading = false; }
}
async function dkdV31FindPass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('Lütfen 6 haneli kurye kodunu eksiksiz girin.');
  const dkdRows = await dkdV31Rpc('dkd_gate_security_find_pass_v31', { dkd_code: dkdCleanCode });
  const dkdPass = Array.isArray(dkdRows) ? dkdRows[0] : null; if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
  dkdV31State.foundPass = dkdV31CleanPass(dkdPass); return dkdV31State.foundPass;
}
async function dkdV31ApprovePass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6); if (dkdCleanCode.length !== 6) throw new Error('6 haneli kurye kodu geçersiz.');
  const dkdResult = await dkdV31Rpc('dkd_gate_security_approve_pass_v31', { dkd_code: dkdCleanCode });
  dkdV31State.approvalSuccess = dkdResult; dkdV31State.foundPass = null; await dkdV31LoadQueue(); return dkdResult;
}
async function dkdV31LoadPartnerSummary() {
  try { const dkdSummary = await dkdV31Rpc('dkd_gate_partner_summary_v31', {}); dkdV31State.partnerSummary = dkdSummary || { visible:false, sites:[] }; }
  catch { dkdV31State.partnerSummary = { visible:false, sites:[] }; }
  return dkdV31State.partnerSummary;
}
async function dkdV31LoadPartnerRows(dkdLimit = 20, dkdOffset = 0) {
  const dkdRows = await dkdV31Rpc('dkd_gate_partner_earnings_rows_v31', { dkd_limit:dkdLimit, dkd_offset:dkdOffset });
  if (dkdOffset === 0) dkdV31State.partnerRows = Array.isArray(dkdRows) ? dkdRows : []; else dkdV31State.partnerRows.push(...(Array.isArray(dkdRows) ? dkdRows : []));
  return Array.isArray(dkdRows) ? dkdRows : [];
}
async function dkdV31LoadAdminStatus() {
  try { dkdV31State.adminStatus = await dkdV31Rpc('dkd_gate_current_access_v312', {}) || { authenticated:false, is_admin:false }; }
  catch { dkdV31State.adminStatus = { authenticated:false, is_admin:false }; }
  return dkdV31State.adminStatus;
}
async function dkdV31LoadAdminCatalog() {
  dkdV31State.adminLoading = true;
  try {
    const dkdStatus = dkdV31State.adminStatus || await dkdV31LoadAdminStatus();
    if (!dkdStatus?.is_admin) { dkdV31State.adminCatalog = null; return null; }
    dkdV31State.adminCatalog = await dkdV31Rpc('dkd_gate_admin_partner_catalog_v31', {}) || null; return dkdV31State.adminCatalog;
  } catch { dkdV31State.adminCatalog = null; return null; }
  finally { dkdV31State.adminLoading = false; }
}
async function dkdV31AssignPartnerSite(dkdUserId, dkdSiteId, dkdAmount, dkdIsActive) {
  const dkdResult = await dkdV31Rpc('dkd_gate_admin_assign_partner_site_v31', {
    dkd_user_id:dkdUserId, dkd_site_id:dkdSiteId, dkd_amount_per_courier:Number(dkdAmount || 10), dkd_is_active:Boolean(dkdIsActive),
  });
  await dkdV31LoadAdminCatalog(); return dkdResult;
}
window.dkdV31Data = {
  version:DKD_V312_VERSION, state:dkdV31State, normalize:dkdV31Normalize, escape:dkdV31Escape, readableError:dkdV31ReadableError,
  isSimpleTheme:dkdV31IsSimpleTheme, rpc:dkdV31Rpc, loadQueue:dkdV31LoadQueue, findPass:dkdV31FindPass, approvePass:dkdV31ApprovePass,
  loadPartnerSummary:dkdV31LoadPartnerSummary, loadPartnerRows:dkdV31LoadPartnerRows, loadAdminStatus:dkdV31LoadAdminStatus,
  loadAdminCatalog:dkdV31LoadAdminCatalog, assignPartnerSite:dkdV31AssignPartnerSite, resolveAccessToken:dkdV31ResolveAccessToken,
};
