const DKD_V323_VERSION = '3.2.3';
const DKD_V323_PROJECT_REF = 'guuwomvszlwhkmstewfl';
const DKD_V323_API_URL = `https://${DKD_V323_PROJECT_REF}.supabase.co`;
const DKD_V323_API_KEY = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';

if (!window.dkdV31Data) throw new Error('DraBornGate v3.2.3 veri katmanı başlatılamadı.');

const dkdV323Data = window.dkdV31Data;
const dkdV323State = dkdV323Data.state;
dkdV323State.queueOpen = false;
dkdV323State.adminError = '';

function dkdV323DecodeJwt(dkdToken) {
  try {
    const dkdPart = String(dkdToken || '').split('.')[1];
    if (!dkdPart) return null;
    const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
    const dkdJson = decodeURIComponent(Array.from(atob(dkdBase64), (dkdChar) => `%${dkdChar.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
    return JSON.parse(dkdJson);
  } catch {
    return null;
  }
}

function dkdV323PushToken(dkdValue, dkdTokens, dkdDepth = 0) {
  if (dkdDepth > 9 || dkdValue == null) return;
  if (typeof dkdValue === 'string') {
    if (/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(dkdValue)) {
      const dkdPayload = dkdV323DecodeJwt(dkdValue);
      const dkdIssuer = String(dkdPayload?.iss || '');
      const dkdRef = String(dkdPayload?.ref || dkdPayload?.project_ref || '');
      if (dkdPayload?.sub && (dkdIssuer.includes(DKD_V323_PROJECT_REF) || dkdRef === DKD_V323_PROJECT_REF)) {
        dkdTokens.push({ token: dkdValue, exp: Number(dkdPayload.exp || 0) });
      }
      return;
    }
    try {
      dkdV323PushToken(JSON.parse(dkdValue), dkdTokens, dkdDepth + 1);
    } catch {
      // Normal metin değerleri oturum değildir.
    }
    return;
  }
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) dkdV323PushToken(dkdItem, dkdTokens, dkdDepth + 1);
    return;
  }
  if (typeof dkdValue === 'object') {
    for (const dkdItem of Object.values(dkdValue)) dkdV323PushToken(dkdItem, dkdTokens, dkdDepth + 1);
  }
}

function dkdV323ReadBestAccessToken() {
  const dkdTokens = [];
  for (const dkdStore of [localStorage, sessionStorage]) {
    for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
      const dkdKey = String(dkdStore.key(dkdIndex) || '');
      if (!dkdKey.includes(DKD_V323_PROJECT_REF) && !/supabase|auth|session/i.test(dkdKey)) continue;
      dkdV323PushToken(dkdStore.getItem(dkdKey), dkdTokens);
    }
  }
  const dkdNow = Math.floor(Date.now() / 1000);
  return dkdTokens
    .filter((dkdItem) => dkdItem.exp > dkdNow + 20)
    .sort((dkdLeft, dkdRight) => dkdRight.exp - dkdLeft.exp)[0]?.token || '';
}

async function dkdV323WaitForAccessToken(dkdTimeoutMs = 8000) {
  const dkdStartedAt = Date.now();
  while (Date.now() - dkdStartedAt < dkdTimeoutMs) {
    const dkdToken = dkdV323ReadBestAccessToken();
    if (dkdToken) return dkdToken;
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 220));
  }
  throw new Error('DraBornGate oturumu henüz hazır değil. Sayfayı yenileyip tekrar deneyin.');
}

async function dkdV323Rpc(dkdFunctionName, dkdArguments = {}) {
  let dkdToken = await dkdV323WaitForAccessToken();
  const dkdCall = async () => {
    const dkdResponse = await fetch(`${DKD_V323_API_URL}/rest/v1/rpc/${encodeURIComponent(dkdFunctionName)}`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        apikey: DKD_V323_API_KEY,
        Authorization: `Bearer ${dkdToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dkdArguments),
    });
    const dkdText = await dkdResponse.text();
    let dkdPayload = null;
    if (dkdText) {
      try { dkdPayload = JSON.parse(dkdText); } catch { dkdPayload = dkdText; }
    }
    return { response: dkdResponse, payload: dkdPayload };
  };

  let dkdResult = await dkdCall();
  if (dkdResult.response.status === 401) {
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 350));
    dkdToken = await dkdV323WaitForAccessToken(2500);
    dkdResult = await dkdCall();
  }
  if (!dkdResult.response.ok) {
    const dkdMessage = dkdV323Data.readableError?.(dkdResult.payload)
      || `Sunucu isteği tamamlanamadı (HTTP ${dkdResult.response.status}).`;
    throw new Error(dkdMessage);
  }
  return dkdResult.payload;
}

function dkdV323CleanPass(dkdRow) {
  const dkdStatus = String(dkdRow?.status || 'waiting');
  const dkdCategory = dkdStatus === 'arrived' ? 'arrived' : ['waiting', 'approved'].includes(dkdStatus) ? 'approaching' : 'other';
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

async function dkdV323LoadQueue() {
  if (dkdV323State.queueLoading) return dkdV323State.queue;
  dkdV323State.queueLoading = true;
  dkdV323State.queueError = '';
  try {
    const dkdRows = await dkdV323Rpc('dkd_gate_security_queue_v31', { dkd_limit: 100, dkd_offset: 0 });
    dkdV323State.queue = (Array.isArray(dkdRows) ? dkdRows : []).map(dkdV323CleanPass);
    dkdV323State.queueLoaded = true;
    dkdV323State.lastQueueSync = new Date();
    return dkdV323State.queue;
  } catch (dkdError) {
    dkdV323State.queueError = dkdV323Data.readableError?.(dkdError) || 'Canlı kurye kuyruğu alınamadı.';
    throw dkdError;
  } finally {
    dkdV323State.queueLoading = false;
  }
}

async function dkdV323FindPass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('Lütfen 6 haneli kurye kodunu eksiksiz girin.');
  const dkdRows = await dkdV323Rpc('dkd_gate_security_find_pass_v31', { dkd_code: dkdCleanCode });
  const dkdPass = Array.isArray(dkdRows) ? dkdRows[0] : null;
  if (!dkdPass) throw new Error('Bu kodla eşleşen aktif kurye geçişi bulunamadı.');
  dkdV323State.foundPass = dkdV323CleanPass(dkdPass);
  return dkdV323State.foundPass;
}

async function dkdV323ApprovePass(dkdCode) {
  const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCleanCode.length !== 6) throw new Error('6 haneli kurye kodu geçersiz.');
  const dkdResult = await dkdV323Rpc('dkd_gate_security_approve_pass_v31', { dkd_code: dkdCleanCode });
  dkdV323State.approvalSuccess = dkdResult;
  dkdV323State.foundPass = null;
  await dkdV323LoadQueue();
  return dkdResult;
}

async function dkdV323LoadPartnerSummary() {
  try {
    const dkdSummary = await dkdV323Rpc('dkd_gate_partner_summary_v31', {});
    dkdV323State.partnerSummary = dkdSummary || { visible: false, sites: [] };
  } catch {
    dkdV323State.partnerSummary = { visible: false, sites: [] };
  }
  return dkdV323State.partnerSummary;
}

async function dkdV323LoadPartnerRows(dkdLimit = 20, dkdOffset = 0) {
  const dkdRows = await dkdV323Rpc('dkd_gate_partner_earnings_rows_v31', { dkd_limit: dkdLimit, dkd_offset: dkdOffset });
  if (dkdOffset === 0) dkdV323State.partnerRows = Array.isArray(dkdRows) ? dkdRows : [];
  else dkdV323State.partnerRows.push(...(Array.isArray(dkdRows) ? dkdRows : []));
  return Array.isArray(dkdRows) ? dkdRows : [];
}

async function dkdV323LoadAdminCatalog() {
  if (dkdV323State.adminLoading) return dkdV323State.adminCatalog;
  dkdV323State.adminLoading = true;
  dkdV323State.adminError = '';
  try {
    const dkdCatalog = await dkdV323Rpc('dkd_gate_admin_partner_catalog_v31', {});
    dkdV323State.adminCatalog = dkdCatalog || null;
  } catch (dkdError) {
    dkdV323State.adminCatalog = null;
    dkdV323State.adminError = dkdV323Data.readableError?.(dkdError) || String(dkdError?.message || dkdError);
  } finally {
    dkdV323State.adminLoading = false;
  }
  return dkdV323State.adminCatalog;
}

async function dkdV323AssignPartnerSite(dkdUserId, dkdSiteId, dkdAmount, dkdIsActive) {
  const dkdResult = await dkdV323Rpc('dkd_gate_admin_assign_partner_site_v31', {
    dkd_user_id: dkdUserId,
    dkd_site_id: dkdSiteId,
    dkd_amount_per_courier: Number(dkdAmount || 10),
    dkd_is_active: Boolean(dkdIsActive),
  });
  await dkdV323LoadAdminCatalog();
  return dkdResult;
}

Object.assign(dkdV323Data, {
  version: DKD_V323_VERSION,
  rpc: dkdV323Rpc,
  loadQueue: dkdV323LoadQueue,
  findPass: dkdV323FindPass,
  approvePass: dkdV323ApprovePass,
  loadPartnerSummary: dkdV323LoadPartnerSummary,
  loadPartnerRows: dkdV323LoadPartnerRows,
  loadAdminCatalog: dkdV323LoadAdminCatalog,
  assignPartnerSite: dkdV323AssignPartnerSite,
});
