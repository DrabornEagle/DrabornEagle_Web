const DKD_V31_VERSION = '3.1.0';
const DKD_V31_PROJECT_REF = 'guuwomvszlwhkmstewfl';
const DKD_V31_API_URL = 'https://guuwomvszlwhkmstewfl.supabase.co';
const DKD_V31_API_KEY = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';

const dkdV31State = {
  queue: [],
  queueLoading: false,
  queueLoaded: false,
  queueError: '',
  codeBusy: false,
  codeFeedback: null,
  foundPass: null,
  approvalSuccess: null,
  queueLimits: { arrived: 3, approaching: 3, other: 3 },
  queueOpen: true,
  partnerSummary: null,
  partnerRows: [],
  partnerRowsLimit: 10,
  partnerLoading: false,
  adminCatalog: null,
  adminLoading: false,
  lastQueueSync: null,
};

function dkdV31Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV31Escape(dkdValue) {
  return String(dkdValue ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV31FindAccessTokenInValue(dkdValue, dkdDepth = 0) {
  if (dkdDepth > 5 || dkdValue == null) return '';
  if (typeof dkdValue === 'string') {
    if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(dkdValue)) return dkdValue;
    try {
      return dkdV31FindAccessTokenInValue(JSON.parse(dkdValue), dkdDepth + 1);
    } catch {
      return '';
    }
  }
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) {
      const dkdToken = dkdV31FindAccessTokenInValue(dkdItem, dkdDepth + 1);
      if (dkdToken) return dkdToken;
    }
    return '';
  }
  if (typeof dkdValue === 'object') {
    if (typeof dkdValue.access_token === 'string') return dkdValue.access_token;
    for (const dkdKey of ['currentSession', 'session', 'data', 'value']) {
      const dkdToken = dkdV31FindAccessTokenInValue(dkdValue[dkdKey], dkdDepth + 1);
      if (dkdToken) return dkdToken;
    }
  }
  return '';
}

function dkdV31FindAccessToken() {
  const dkdStores = [localStorage, sessionStorage];
  for (const dkdStore of dkdStores) {
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = dkdStore.key(dkdIndex) || '';
      if (!dkdKey.includes(DKD_V31_PROJECT_REF) && !dkdKey.includes('auth-token')) continue;
      const dkdToken = dkdV31FindAccessTokenInValue(dkdStore.getItem(dkdKey));
      if (dkdToken) return dkdToken;
    }
  }
  return '';
}

async function dkdV31WaitForAccessToken(dkdTimeoutMs = 9000) {
  const dkdStartedAt = Date.now();
  while (Date.now() - dkdStartedAt < dkdTimeoutMs) {
    const dkdToken = dkdV31FindAccessToken();
    if (dkdToken) return dkdToken;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 160));
  }
  throw new Error('Güvenli oturum anahtarı bulunamadı. Çıkış yapıp tekrar giriş yapın.');
}

async function dkdV31Rpc(dkdFunctionName, dkdArguments = {}) {
  const dkdToken = await dkdV31WaitForAccessToken();
  const dkdResponse = await fetch(`${DKD_V31_API_URL}/rest/v1/rpc/${encodeURIComponent(dkdFunctionName)}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: DKD_V31_API_KEY,
      Authorization: `Bearer ${dkdToken}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'draborngate',
      'Content-Profile': 'draborngate',
    },
    body: JSON.stringify(dkdArguments),
  });

  let dkdPayload = null;
  const dkdText = await dkdResponse.text();
  if (dkdText) {
    try {
      dkdPayload = JSON.parse(dkdText);
    } catch {
      dkdPayload = dkdText;
    }
  }
  if (!dkdResponse.ok) {
    const dkdMessage = dkdPayload?.message || dkdPayload?.hint || dkdPayload?.details || String(dkdPayload || `HTTP ${dkdResponse.status}`);
    throw new Error(dkdMessage);
  }
  return dkdPayload;
}

function dkdV31IsSimpleTheme() {
  return dkdV31Normalize(location.pathname).includes('guvenlik sade tema') ||
    sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
    sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

function dkdV31CleanPass(dkdRow) {
  const dkdStatus = String(dkdRow?.status || 'waiting');
  const dkdCategory = dkdStatus === 'arrived'
    ? 'arrived'
    : ['waiting', 'approved'].includes(dkdStatus)
      ? 'approaching'
      : 'other';
  return {
    ...dkdRow,
    category: dkdCategory,
    courier_name: dkdRow?.courier_name || 'Kurye bilgisi bulunamadı',
    courier_phone: dkdRow?.courier_phone || 'Telefon paylaşılmadı',
    courier_plate: dkdRow?.courier_plate || 'Plaka paylaşılmadı',
    platform: dkdRow?.platform || 'Platform paylaşılmadı',
    origin_name: dkdRow?.origin_name || dkdRow?.platform || 'Çıkış noktası paylaşılmadı',
    origin_address: dkdRow?.origin_address || `${dkdRow?.platform || 'Kurye'} gönderisi`,
    origin_contact_name: dkdRow?.origin_contact_name || '',
    origin_contact_phone: dkdRow?.origin_contact_phone || '',
    customer_name: dkdRow?.customer_name || 'Müşteri adı paylaşılmadı',
    destination_full: dkdRow?.destination_full || dkdRow?.address_text || 'Teslimat adresi paylaşılmadı',
    order_number: dkdRow?.order_number || 'Sipariş numarası paylaşılmadı',
    note: dkdRow?.note || 'Teslimat notu bulunmuyor',
    approval_code: dkdRow?.approval_code || '',
  };
}

async function dkdV31LoadQueue() {
  if (dkdV31State.queueLoading) return dkdV31State.queue;
  dkdV31State.queueLoading = true;
  dkdV31State.queueError = '';
  try {
    const dkdRows = await dkdV31Rpc('dkd_gate_security_queue_v31', { dkd_limit: 100, dkd_offset: 0 });
    dkdV31State.queue = (Array.isArray(dkdRows) ? dkdRows : []).map(dkdV31CleanPass);
    dkdV31State.queueLoaded = true;
    dkdV31State.lastQueueSync = new Date();
    return dkdV31State.queue;
  } catch (dkdError) {
    dkdV31State.queueError = String(dkdError?.message || dkdError);
    throw dkdError;
  } finally {
    dkdV31State.queueLoading = false;
  }
}

async function dkdV31FindPass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('Lütfen 6 haneli kurye kodunu eksiksiz girin.');
  const dkdRows = await dkdV31Rpc('dkd_gate_security_find_pass_v31', { dkd_code: dkdCleanCode });
  const dkdPass = Array.isArray(dkdRows) ? dkdRows[0] : null;
  if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
  dkdV31State.foundPass = dkdV31CleanPass(dkdPass);
  return dkdV31State.foundPass;
}

async function dkdV31ApprovePass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('6 haneli kurye kodu geçersiz.');
  const dkdResult = await dkdV31Rpc('dkd_gate_security_approve_pass_v31', { dkd_code: dkdCleanCode });
  dkdV31State.approvalSuccess = dkdResult;
  dkdV31State.foundPass = null;
  await dkdV31LoadQueue();
  return dkdResult;
}

async function dkdV31LoadPartnerSummary() {
  try {
    const dkdSummary = await dkdV31Rpc('dkd_gate_partner_summary_v31', {});
    dkdV31State.partnerSummary = dkdSummary || { visible: false, sites: [] };
    return dkdV31State.partnerSummary;
  } catch {
    dkdV31State.partnerSummary = { visible: false, sites: [] };
    return dkdV31State.partnerSummary;
  }
}

async function dkdV31LoadPartnerRows(dkdLimit = 20, dkdOffset = 0) {
  const dkdRows = await dkdV31Rpc('dkd_gate_partner_earnings_rows_v31', {
    dkd_limit: dkdLimit,
    dkd_offset: dkdOffset,
  });
  if (dkdOffset === 0) dkdV31State.partnerRows = Array.isArray(dkdRows) ? dkdRows : [];
  else dkdV31State.partnerRows.push(...(Array.isArray(dkdRows) ? dkdRows : []));
  return Array.isArray(dkdRows) ? dkdRows : [];
}

async function dkdV31LoadAdminCatalog() {
  try {
    const dkdCatalog = await dkdV31Rpc('dkd_gate_admin_partner_catalog_v31', {});
    dkdV31State.adminCatalog = dkdCatalog || null;
    return dkdV31State.adminCatalog;
  } catch {
    dkdV31State.adminCatalog = null;
    return null;
  }
}

async function dkdV31AssignPartnerSite(dkdUserId, dkdSiteId, dkdAmount, dkdIsActive) {
  const dkdResult = await dkdV31Rpc('dkd_gate_admin_assign_partner_site_v31', {
    dkd_user_id: dkdUserId,
    dkd_site_id: dkdSiteId,
    dkd_amount_per_courier: Number(dkdAmount || 10),
    dkd_is_active: Boolean(dkdIsActive),
  });
  await dkdV31LoadAdminCatalog();
  return dkdResult;
}

window.dkdV31Data = {
  version: DKD_V31_VERSION,
  state: dkdV31State,
  normalize: dkdV31Normalize,
  escape: dkdV31Escape,
  isSimpleTheme: dkdV31IsSimpleTheme,
  rpc: dkdV31Rpc,
  loadQueue: dkdV31LoadQueue,
  findPass: dkdV31FindPass,
  approvePass: dkdV31ApprovePass,
  loadPartnerSummary: dkdV31LoadPartnerSummary,
  loadPartnerRows: dkdV31LoadPartnerRows,
  loadAdminCatalog: dkdV31LoadAdminCatalog,
  assignPartnerSite: dkdV31AssignPartnerSite,
};
