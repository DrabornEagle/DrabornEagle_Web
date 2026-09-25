const dkdSupabaseUrl = 'https://guuwomvszlwhkmstewfl.supabase.co';
const dkdPublishableKey = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';
const dkdWebhookUrl = `${dkdSupabaseUrl}/functions/v1/dkd-bmc-webhook`;
const dkdDashboardUrl = `${dkdSupabaseUrl}/rest/v1/rpc/dkd_bmc_public_dashboard`;

const dkdElement = (dkdId) => document.getElementById(dkdId);
const dkdState = { loading: false };

function dkdSafeNumber(dkdValue) {
  const dkdNumber = Number(dkdValue);
  return Number.isFinite(dkdNumber) ? dkdNumber : 0;
}

function dkdFormatMoney(dkdAmount, dkdCurrency) {
  const dkdCode = String(dkdCurrency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: dkdCode,
      maximumFractionDigits: 2,
    }).format(dkdSafeNumber(dkdAmount));
  } catch {
    return `${dkdSafeNumber(dkdAmount).toLocaleString('tr-TR')} ${dkdCode}`;
  }
}

function dkdFormatDate(dkdValue) {
  const dkdDate = new Date(dkdValue);
  if (Number.isNaN(dkdDate.getTime())) return '';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dkdDate);
}

function dkdEventLabel(dkdType) {
  const dkdLabels = {
    'donation.created': 'Tek seferlik destek',
    'extra_purchase.created': 'Mağaza desteği',
    'commission_order.created': 'Komisyon siparişi',
    'wishlist_payment.created': 'İstek listesi desteği',
    'membership.started': 'Üyelik başladı',
    'recurring_donation.started': 'Aylık destek başladı',
  };
  return dkdLabels[dkdType] || 'Destek';
}

function dkdSetApiStatus(dkdMode, dkdText) {
  const dkdPill = dkdElement('dkd-api-pill');
  const dkdTextElement = dkdElement('dkd-api-text');
  if (!dkdPill || !dkdTextElement) return;
  dkdPill.classList.remove('is-live', 'is-error');
  if (dkdMode === 'live') dkdPill.classList.add('is-live');
  if (dkdMode === 'error') dkdPill.classList.add('is-error');
  dkdTextElement.textContent = dkdText;
}

async function dkdCheckWebhook() {
  try {
    const dkdResponse = await fetch(dkdWebhookUrl, { method: 'GET', cache: 'no-store' });
    const dkdPayload = await dkdResponse.json().catch(() => null);
    if (!dkdResponse.ok || !dkdPayload?.ok) throw new Error('health_check_failed');
    dkdSetApiStatus('live', 'Webhook API aktif');
  } catch {
    dkdSetApiStatus('error', 'Webhook API bağlantısı yok');
  }
}

function dkdRenderStats(dkdStats) {
  const dkdTotals = Array.isArray(dkdStats?.currency_totals) ? dkdStats.currency_totals : [];
  const dkdTotalElement = dkdElement('dkd-total-support');
  if (dkdTotalElement) {
    if (!dkdTotals.length) dkdTotalElement.textContent = '—';
    else if (dkdTotals.length === 1) dkdTotalElement.textContent = dkdFormatMoney(dkdTotals[0].amount, dkdTotals[0].currency);
    else dkdTotalElement.textContent = dkdTotals.map((dkdItem) => dkdFormatMoney(dkdItem.amount, dkdItem.currency)).join(' + ');
  }
  dkdElement('dkd-supporter-count').textContent = String(dkdSafeNumber(dkdStats?.supporter_count));
  dkdElement('dkd-payment-count').textContent = String(dkdSafeNumber(dkdStats?.payment_count));
  dkdElement('dkd-membership-count').textContent = String(dkdSafeNumber(dkdStats?.active_memberships));
  dkdElement('dkd-monthly-count').textContent = String(dkdSafeNumber(dkdStats?.active_monthly_supports));
}

function dkdSupportItem(dkdItem) {
  const dkdArticle = document.createElement('article');
  dkdArticle.className = 'dkd-support-item';

  const dkdAvatar = document.createElement('div');
  dkdAvatar.className = 'dkd-support-avatar';
  dkdAvatar.textContent = dkdItem?.event_type === 'membership.started' ? '⭐' : dkdItem?.event_type === 'recurring_donation.started' ? '♻️' : '☕';

  const dkdMain = document.createElement('div');
  dkdMain.className = 'dkd-support-main';
  const dkdName = document.createElement('strong');
  dkdName.textContent = String(dkdItem?.supporter_name || 'Anonim Destekçi');
  const dkdMeta = document.createElement('span');
  const dkdParts = [dkdEventLabel(dkdItem?.event_type)];
  if (dkdItem?.membership_level_name) dkdParts.push(String(dkdItem.membership_level_name));
  if (dkdItem?.note) dkdParts.push(`“${String(dkdItem.note)}”`);
  dkdMeta.textContent = dkdParts.join(' • ');
  dkdMain.append(dkdName, dkdMeta);

  const dkdValue = document.createElement('div');
  dkdValue.className = 'dkd-support-value';
  const dkdMoney = document.createElement('strong');
  dkdMoney.textContent = dkdItem?.amount == null ? 'Destek' : dkdFormatMoney(dkdItem.amount, dkdItem.currency);
  const dkdDate = document.createElement('small');
  dkdDate.textContent = dkdFormatDate(dkdItem?.created_at);
  dkdValue.append(dkdMoney, dkdDate);

  dkdArticle.append(dkdAvatar, dkdMain, dkdValue);
  return dkdArticle;
}

function dkdRenderRecent(dkdItems) {
  const dkdList = dkdElement('dkd-support-list');
  if (!dkdList) return;
  dkdList.replaceChildren();
  if (!Array.isArray(dkdItems) || !dkdItems.length) {
    const dkdEmpty = document.createElement('div');
    dkdEmpty.className = 'dkd-empty';
    dkdEmpty.innerHTML = '<span>☕</span><strong>İlk destek burada görünecek.</strong><small>Gerçek bir Buy Me a Coffee desteği webhook üzerinden doğrulandığında bu alan otomatik güncellenir.</small>';
    dkdList.appendChild(dkdEmpty);
    return;
  }
  dkdItems.forEach((dkdItem) => dkdList.appendChild(dkdSupportItem(dkdItem)));
}

async function dkdLoadDashboard() {
  if (dkdState.loading) return;
  dkdState.loading = true;
  const dkdButton = dkdElement('dkd-refresh');
  if (dkdButton) {
    dkdButton.disabled = true;
    dkdButton.textContent = '↻ Yükleniyor';
  }
  try {
    const dkdResponse = await fetch(dkdDashboardUrl, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        apikey: dkdPublishableKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ dkd_limit_value: 12 }),
    });
    if (!dkdResponse.ok) throw new Error(`dashboard_http_${dkdResponse.status}`);
    const dkdPayload = await dkdResponse.json();
    dkdRenderStats(dkdPayload?.stats || {});
    dkdRenderRecent(dkdPayload?.recent || []);
    const dkdUpdated = dkdElement('dkd-updated');
    if (dkdUpdated) dkdUpdated.textContent = `Son güncelleme: ${dkdFormatDate(dkdPayload?.updated_at || new Date())}`;
  } catch (dkdError) {
    console.warn('DraBornEagle Support dashboard error', dkdError);
    const dkdUpdated = dkdElement('dkd-updated');
    if (dkdUpdated) dkdUpdated.textContent = 'Canlı veriye şu an ulaşılamıyor';
  } finally {
    dkdState.loading = false;
    if (dkdButton) {
      dkdButton.disabled = false;
      dkdButton.textContent = '↻ Yenile';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  dkdElement('dkd-refresh')?.addEventListener('click', dkdLoadDashboard);
  dkdCheckWebhook();
  dkdLoadDashboard();
  window.setInterval(dkdLoadDashboard, 30000);
  window.setInterval(dkdCheckWebhook, 60000);
});
