import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const DKD_VERSION = '2.0.0';
const DKD_SUPABASE_URL = 'https://guuwomvszlwhkmstewfl.supabase.co';
const DKD_SUPABASE_KEY = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';
const dkdSupabase = createClient(DKD_SUPABASE_URL, DKD_SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'dkd.draborngate.auth.shared.v0.2'
  },
  realtime: { params: { eventsPerSecond: 10 } }
});

const dkdRoot = document.querySelector('#dkd-app');
const dkdState = {
  session: null,
  profile: null,
  roles: [],
  role: null,
  page: 'home',
  authMode: 'login',
  registerRole: 'resident',
  registrationSites: [],
  selectedRegistrationSite: null,
  drawerOpen: false,
  loading: true,
  refreshing: false,
  busy: false,
  activeSiteId: '',
  data: dkdEmptyData(),
  reportRange: 'month',
  report: null,
  entryReport: null,
  subscriptionCenter: null,
  applications: [],
  residents: [],
  residentQuery: '',
  codeMatch: null,
  modal: null,
  realtime: null,
  routeHint: dkdParseRouteHint(),
};

function dkdEmptyData() {
  return {
    profile: null,
    courierProfile: null,
    residentProfiles: [],
    sites: [],
    gates: [],
    passes: [],
    events: [],
    rules: [],
    ruleAcceptances: [],
    visitors: [],
    notifications: [],
    duesPeriods: [],
    duesCharges: [],
    financeTransactions: [],
    settings: null,
    release: null,
  };
}

const dkdRoleMeta = {
  courier: { label: 'Kurye', icon: 'bike', tone: '#45dbff', slug: 'kurye' },
  security: { label: 'Güvenlik', icon: 'shield', tone: '#4ce4ac', slug: 'guvenlik' },
  management: { label: 'Site Yönetimi', icon: 'building', tone: '#c65cff', slug: 'yonetim' },
  resident: { label: 'Site Sakini', icon: 'home', tone: '#ffb75e', slug: 'sitesakini' },
};

const dkdIconPaths = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8m16 8-2.2 1.8A7 7 0 0 1 5.5 15"/>',
  shield: '<path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-6h6v6"/>',
  bike: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h5l2-5h3l2 5M9 9h4l2 3M5 12h4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  rules: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  wallet: '<path d="M4 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12v4"/><path d="M16 13h5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l3 3"/>',
  map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  sparkles: '<path d="m12 3 1.2 3.2L16 8l-2.8 1.8L12 13l-1.2-3.2L8 8l2.8-1.8L12 3ZM5 14l.8 2.2L8 17.5l-2.2 1.3L5 21l-.8-2.2L2 17.5l2.2-1.3L5 14ZM19 12l.8 2.2 2.2 1.3-2.2 1.3L19 19l-.8-2.2-2.2-1.3 2.2-1.3L19 12Z"/>',
  crown: '<path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z"/><path d="M5 19h14"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a4 4 0 0 0 4-4V10a4 4 0 0 1 4-4"/>',
  visitor: '<circle cx="9" cy="7" r="4"/><path d="M2 21a7 7 0 0 1 14 0M18 8v6M15 11h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  activity: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h7v18h-7"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20l-5 1 1-5 12.5-12.5Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5"/>',
  filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  money: '<circle cx="12" cy="12" r="9"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v12"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  alert: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 18h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
};

function dkdIcon(name, size = 20, className = '') {
  const paths = dkdIconPaths[name] || dkdIconPaths.sparkles;
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function dkdEsc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function dkdSlug(value) {
  return String(value ?? '').trim().toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'kullanici';
}
function dkdMoney(value) { return `${Number(value || 0).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL`; }
function dkdDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('tr-TR', withTime ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium' });
}
function dkdRelative(value) {
  if (!value) return 'şimdi';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'şimdi';
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa`;
  return `${Math.floor(hours / 24)} gün`;
}
function dkdArray(value) { return Array.isArray(value) ? value : []; }
function dkdFirstName() { return (dkdState.profile?.full_name || dkdState.profile?.fullName || dkdState.session?.user?.user_metadata?.full_name || dkdState.session?.user?.email?.split('@')[0] || 'Kullanıcı').split(' ')[0]; }
function dkdFullName() { return dkdState.profile?.full_name || dkdState.profile?.fullName || dkdState.session?.user?.user_metadata?.full_name || dkdState.session?.user?.email?.split('@')[0] || 'DraBornGate Kullanıcısı'; }
function dkdEmail() { return dkdState.session?.user?.email || ''; }
function dkdActiveSite() { return dkdState.data.sites.find((site) => site.id === dkdState.activeSiteId) || dkdState.data.sites[0]; }
function dkdSiteGates(siteId = dkdState.activeSiteId) { return dkdState.data.gates.filter((gate) => gate.site_id === siteId || gate.siteId === siteId); }
function dkdOwnPasses() { return dkdState.data.passes.filter((pass) => (pass.courier_user_id || pass.courierUserId) === dkdState.session?.user?.id); }
function dkdCurrentResident() { return dkdState.data.residentProfiles.find((resident) => (resident.user_id || resident.userId) === dkdState.session?.user?.id && resident.is_active !== false); }
function dkdStatusLabel(status) {
  return ({ waiting: 'Bekliyor', approved: 'Onaylandı', arrived: 'Kapıda', completed: 'Tamamlandı', rejected: 'Reddedildi', cancelled: 'İptal', expired: 'Süresi doldu', pending: 'Onay bekliyor', paid: 'Ödendi', unpaid: 'Ödenmedi' })[status] || String(status || 'Bilinmiyor');
}
function dkdStatusClass(status) { return `status-${status || 'waiting'}`; }
function dkdParseRouteHint() {
  const saved = sessionStorage.getItem('dkd_gate_route');
  if (saved) sessionStorage.removeItem('dkd_gate_route');
  const url = new URL(saved || location.href, location.origin);
  const after = url.pathname.split('/DraBornGate/')[1] || '';
  const parts = after.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length < 2) return null;
  const userPart = parts[1].toLocaleLowerCase('tr-TR');
  let role = null;
  if (userPart.startsWith('guvenlik-')) role = 'security';
  if (userPart.startsWith('yonetim-') || userPart.startsWith('siteyonetimi-')) role = 'management';
  if (userPart.startsWith('sitesakini-') || userPart.startsWith('sakin-')) role = 'resident';
  if (userPart.startsWith('kurye-')) role = 'courier';
  return { siteSlug: parts[0], userSlug: parts[1], role };
}
function dkdPersonalLink() {
  const site = dkdActiveSite();
  const role = dkdRoleMeta[dkdState.role] || dkdRoleMeta.resident;
  return `${location.origin}/DraBornGate/${dkdSlug(site?.name || 'site')}/${role.slug}-${dkdSlug(dkdFullName())}`;
}

function dkdToast(title, message = '', type = 'info') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const item = document.createElement('div');
  item.className = `toast ${type}`;
  item.innerHTML = `<div class="toast-icon">${dkdIcon(type === 'success' ? 'check' : type === 'error' ? 'alert' : 'info', 19)}</div><div><strong>${dkdEsc(title)}</strong>${message ? `<span>${dkdEsc(message)}</span>` : ''}</div>`;
  stack.appendChild(item);
  setTimeout(() => item.remove(), 4200);
}

function dkdSetBusy(busy) { dkdState.busy = busy; dkdRender(); }
function dkdSafeError(error, fallback = 'İşlem tamamlanamadı.') { return error instanceof Error ? error.message : String(error || fallback); }

async function dkdRpc(name, params = {}) {
  const { data, error } = await dkdSupabase.rpc(name, params);
  if (error) throw error;
  return data;
}

async function dkdRefresh(options = {}) {
  if (!dkdState.session) return;
  if (!options.silent) { dkdState.refreshing = true; dkdRender(); }
  try {
    const payload = await dkdRpc('dkd_gate_bootstrap');
    dkdState.data = { ...dkdEmptyData(), ...(payload || {}) };
    dkdState.profile = payload?.profile || null;
    if (!dkdState.activeSiteId || !dkdState.data.sites.some((site) => site.id === dkdState.activeSiteId)) {
      const hinted = dkdState.routeHint ? dkdState.data.sites.find((site) => dkdSlug(site.name) === dkdState.routeHint.siteSlug) : null;
      dkdState.activeSiteId = hinted?.id || dkdState.data.sites[0]?.id || '';
    }
  } catch (error) {
    dkdToast('Veriler yenilenemedi', dkdSafeError(error), 'error');
  } finally {
    dkdState.refreshing = false;
    dkdState.loading = false;
    dkdRender();
  }
}

async function dkdLoadRoles() {
  const data = await dkdRpc('dkd_gate_get_my_available_roles');
  dkdState.roles = [...new Set(dkdArray(data).filter((role) => dkdRoleMeta[role]))];
  const preferred = dkdState.profile?.preferred_role || dkdState.profile?.preferredRole;
  const hinted = dkdState.routeHint?.role;
  dkdState.role = hinted && dkdState.roles.includes(hinted) ? hinted : preferred && dkdState.roles.includes(preferred) ? preferred : dkdState.roles[0] || 'courier';
}

async function dkdBootstrapSession(session) {
  dkdState.session = session;
  if (!session) {
    dkdState.profile = null;
    dkdState.roles = [];
    dkdState.role = null;
    dkdState.data = dkdEmptyData();
    dkdState.loading = false;
    dkdCloseRealtime();
    dkdRender();
    return;
  }
  dkdState.loading = true;
  dkdRender();
  try {
    await dkdRefresh({ silent: true });
    await dkdLoadRoles();
    await dkdRefresh({ silent: true });
    dkdSubscribeRealtime();
    if (dkdState.role === 'management') await dkdLoadManagementExtras();
  } catch (error) {
    dkdState.loading = false;
    dkdToast('Oturum hazırlanamadı', dkdSafeError(error), 'error');
  }
  dkdRender();
}

function dkdCloseRealtime() {
  if (dkdState.realtime) {
    void dkdSupabase.removeChannel(dkdState.realtime);
    dkdState.realtime = null;
  }
}
function dkdSubscribeRealtime() {
  dkdCloseRealtime();
  if (!dkdState.session) return;
  const tables = ['dkd_gate_courier_passes', 'dkd_gate_pass_events', 'dkd_gate_visitor_passes', 'dkd_gate_notifications', 'dkd_gate_dues_charges', 'dkd_gate_dues_periods', 'dkd_gate_finance_transactions', 'dkd_gate_site_rules'];
  let channel = dkdSupabase.channel(`dkd-gate-web-v2-${dkdState.session.user.id}`);
  tables.forEach((table) => { channel = channel.on('postgres_changes', { event: '*', schema: 'draborngate', table }, () => void dkdRefresh({ silent: true })); });
  channel.subscribe();
  dkdState.realtime = channel;
}

function dkdNavItems() {
  const unread = dkdState.data.notifications.filter((item) => !item.read_at && !item.readAt).length;
  const waiting = dkdState.data.passes.filter((item) => item.status === 'waiting').length;
  if (dkdState.role === 'management') return [
    ['home', 'Ana Merkez', 'building'], ['reports', 'Premium Raporlar', 'chart'], ['applications', 'Başvurular', 'users'], ['residents', 'Site Sakinleri', 'search'], ['rules', 'Kurallar', 'rules'], ['finance', 'Aidat ve Finans', 'wallet'], ['profile', 'Profil ve Bağlantı', 'user']
  ];
  if (dkdState.role === 'security') return [
    ['home', 'Güvenlik Merkezi', 'shield', waiting], ['queue', 'Kurye Kuyruğu', 'route', waiting], ['visitors', 'Ziyaretçi Geçişi', 'visitor'], ['history', 'Geçiş Geçmişi', 'history'], ['profile', 'Profil ve Bağlantı', 'user']
  ];
  if (dkdState.role === 'resident') return [
    ['home', 'Sakin Merkezi', 'home'], ['visitors', 'Misafir Kodları', 'visitor'], ['dues', 'Aidat ve Finans', 'wallet'], ['notifications', 'Bildirim Merkezi', 'bell', unread], ['profile', 'Profil ve Bağlantı', 'user']
  ];
  return [
    ['home', 'Kurye Merkezi', 'bike'], ['create', 'Yeni Geçiş', 'plus'], ['passes', 'Geçişlerim', 'key'], ['history', 'Hareket Geçmişi', 'history'], ['profile', 'Profil ve Bağlantı', 'user']
  ];
}

function dkdRender() {
  if (!dkdRoot) return;
  if (dkdState.loading) {
    dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>DG</span></div><div class="boot-copy"><strong>DraBornGate Web v2.0</strong><span>Rol, site ve güvenlik verileri hazırlanıyor</span></div><div class="boot-progress"><i></i></div></div>`;
    return;
  }
  if (!dkdState.session) {
    dkdRoot.innerHTML = dkdRenderAuth();
    return;
  }
  dkdRoot.innerHTML = dkdRenderShell();
}

function dkdRenderAuth() {
  const isRegister = dkdState.authMode === 'register';
  const role = dkdState.registerRole;
  const roleMeta = dkdRoleMeta[role];
  return `<div class="auth-shell page-enter">
    <section class="auth-showcase">
      <div class="auth-brand"><div class="brand-orb">DG</div><div><strong>DraBornGate</strong><small>WEB v2.0 • PREMIUM SENKRON</small></div></div>
      <div class="auth-hero">
        <span class="premium-pill">${dkdIcon('crown',16)} PREMIUM GEÇİŞ DENEYİMİ</span>
        <h1>Kapı güvenliğini <span>geleceğin arayüzüyle</span> yönet.</h1>
        <p>Kurye, güvenlik, site yönetimi ve site sakini operasyonları aynı canlı sistemde. Hızlı, güvenli ve uygulamayla tam senkron.</p>
      </div>
      <div class="auth-proof">
        <div class="proof-card"><div class="proof-icon">${dkdIcon('shield',20)}</div><strong>Rol bazlı güvenlik</strong><span>URL değil, gerçek yetki ve RLS kontrolü.</span></div>
        <div class="proof-card"><div class="proof-icon">${dkdIcon('activity',20)}</div><strong>Canlı senkron</strong><span>Web ve uygulama verileri anında yenilenir.</span></div>
        <div class="proof-card"><div class="proof-icon">${dkdIcon('sparkles',20)}</div><strong>Premium Web v2.0</strong><span>Mobil ve masaüstünde göz alıcı modern deneyim.</span></div>
      </div>
    </section>
    <section class="auth-panel">
      <div class="auth-card">
        <span class="eyebrow">${dkdIcon(isRegister ? 'user' : 'lock',15)} ${isRegister ? 'YENİ HESAP' : 'GÜVENLİ OTURUM'}</span>
        <h2>${isRegister ? 'DraBornGate ağına katıl' : 'Tekrar hoş geldin'}</h2>
        <p>${isRegister ? 'Rolünü seç, site ağına başvur ve web panelini kullanmaya başla.' : 'Uygulamadaki hesabınla giriş yap; tüm kayıtların burada hazır.'}</p>
        <div class="auth-tabs"><button class="auth-tab ${!isRegister ? 'active' : ''}" data-action="auth-mode" data-mode="login">Giriş Yap</button><button class="auth-tab ${isRegister ? 'active' : ''}" data-action="auth-mode" data-mode="register">Kayıt Ol</button></div>
        ${isRegister ? `<div class="role-grid">${Object.entries(dkdRoleMeta).map(([key, item]) => `<button class="role-choice ${role === key ? 'active' : ''}" data-action="register-role" data-role="${key}"><span class="choice-icon" style="color:${item.tone};background:${item.tone}18">${dkdIcon(item.icon,20)}</span><span><strong>${item.label}</strong><small>${key === 'courier' ? 'Geçiş talebi oluştur' : key === 'management' ? 'Admin onayı gerekir' : 'Site yönetimi onayı gerekir'}</small></span></button>`).join('')}</div>` : ''}
        <form id="auth-form" class="field-stack">
          ${isRegister ? `<label class="field"><span>Ad Soyad</span><span class="input-wrap">${dkdIcon('user',19)}<input name="fullName" autocomplete="name" required placeholder="Adınız ve soyadınız"></span></label><label class="field"><span>Telefon</span><span class="input-wrap">${dkdIcon('phone',19)}<input name="phone" autocomplete="tel" required placeholder="05xx xxx xx xx"></span></label>` : ''}
          <label class="field"><span>E-posta</span><span class="input-wrap">${dkdIcon('mail',19)}<input name="email" type="email" autocomplete="email" required placeholder="ornek@email.com"></span></label>
          <label class="field"><span>Şifre</span><span class="input-wrap">${dkdIcon('lock',19)}<input name="password" type="password" minlength="6" autocomplete="${isRegister ? 'new-password' : 'current-password'}" required placeholder="En az 6 karakter"></span></label>
          ${isRegister ? dkdRenderRegistrationFields(role, roleMeta) : ''}
          <button class="auth-submit" type="submit" ${dkdState.busy ? 'disabled' : ''}>${dkdIcon(isRegister ? 'arrow' : 'shield',20)} ${dkdState.busy ? 'İŞLEM YAPILIYOR' : isRegister ? 'PREMIUM HESABI OLUŞTUR' : 'GÜVENLİ GİRİŞ YAP'}</button>
        </form>
        <div class="auth-links"><a href="./privacy/">Gizlilik</a><a href="./terms/">Koşullar</a><a href="./account-deletion/">Hesap Silme</a><a href="./support/">Destek</a></div>
      </div>
    </section>
  </div>`;
}

function dkdRenderRegistrationFields(role, meta) {
  if (role === 'courier') return `<label class="field"><span>Motosiklet Plakası</span><span class="input-wrap">${dkdIcon('bike',19)}<input name="plate" required placeholder="07 ABC 123" style="text-transform:uppercase"></span></label><label class="field"><span>Teslimat Platformu / Kurum</span><span class="input-wrap">${dkdIcon('layers',19)}<select name="platform"><option>DraBornGo</option><option>Trendyol Go</option><option>Yemeksepeti</option><option>Getir</option><option>Diğer</option></select></span></label>`;
  if (role === 'management') return `<label class="field"><span>Site / Apartman Adı</span><span class="input-wrap">${dkdIcon('building',19)}<input name="siteName" required placeholder="Örn. Referans Ankara"></span></label><label class="field"><span>Site Adresi</span><span class="input-wrap">${dkdIcon('pin',19)}<textarea name="siteAddress" required placeholder="Açık adres"></textarea></span></label><label class="field"><span>Şehir</span><span class="input-wrap">${dkdIcon('map',19)}<input name="city" required value="Antalya"></span></label><p class="form-note">${dkdIcon('info',15)} Admin onayından sonra site yönetim paneliniz açılır.</p>`;
  return `<div class="field"><span>Başvuru Yapılacak Site</span><div class="input-wrap">${dkdIcon('search',19)}<input id="registration-site-query" placeholder="Site adından en az 2 harf yaz"><button class="action-btn" type="button" data-action="search-registration-sites">ARA</button></div></div>${dkdState.registrationSites.length ? `<div class="stack">${dkdState.registrationSites.map((site) => `<button type="button" class="list-card" data-action="select-registration-site" data-site-id="${site.id}"><span class="list-icon" style="--tone:${meta.tone}">${dkdIcon('building',20)}</span><span class="list-copy"><strong>${dkdEsc(site.name)}</strong><span>${dkdEsc([site.city, site.address].filter(Boolean).join(' • ') || 'Adres bilgisi yok')}</span></span>${dkdState.selectedRegistrationSite?.id === site.id ? dkdIcon('check',20) : dkdIcon('arrow',18)}</button>`).join('')}</div>` : ''}${dkdState.selectedRegistrationSite ? `<div class="form-note" style="color:var(--green)">${dkdIcon('check',15)} Seçilen site: ${dkdEsc(dkdState.selectedRegistrationSite.name)}</div>` : `<p class="form-note">${dkdIcon('info',15)} Site yönetimi onayladıktan sonra ${meta.label} paneliniz açılır.</p>`}`;
}

function dkdRenderShell() {
  const meta = dkdRoleMeta[dkdState.role] || dkdRoleMeta.courier;
  const nav = dkdNavItems();
  const site = dkdActiveSite();
  return `<div class="shell">
    <div class="drawer-backdrop ${dkdState.drawerOpen ? 'open' : ''}" data-action="close-drawer"></div>
    <aside class="sidebar ${dkdState.drawerOpen ? 'open' : ''}">
      <div class="sidebar-head"><div class="sidebar-logo">DG</div><div class="sidebar-brand"><strong>DraBornGate</strong><small>WEB v2.0 • PREMIUM</small></div></div>
      <div class="profile-chip"><div class="profile-row"><div class="avatar">${dkdEsc(dkdFullName().split(' ').map((x) => x[0]).join('').slice(0,2).toUpperCase())}</div><div class="profile-copy"><strong>${dkdEsc(dkdFullName())}</strong><small>${dkdEsc(dkdEmail())}</small></div></div><span class="role-pill" style="color:${meta.tone};border-color:${meta.tone}42;background:${meta.tone}0d">${dkdIcon(meta.icon,15)} ${meta.label}</span></div>
      <div class="nav-label">PREMIUM MENÜ</div>
      <nav class="nav-list">${nav.map(([page,label,icon,badge]) => `<button class="nav-item ${dkdState.page === page ? 'active' : ''}" data-action="nav" data-page="${page}"><span class="nav-icon">${dkdIcon(icon,20)}</span><span>${label}</span>${badge ? `<span class="nav-badge">${badge}</span>` : ''}</button>`).join('')}</nav>
      <div class="sidebar-foot"><div class="version-card">DraBornGate Web v${DKD_VERSION}<br>Uygulamayla ortak Supabase ve canlı rol sistemi.</div><button class="logout-btn" data-action="logout">${dkdIcon('logout',18)} Çıkış Yap</button></div>
    </aside>
    <main class="main">
      <header class="topbar"><button class="icon-btn menu-button" data-action="toggle-drawer">${dkdIcon('menu',22)}</button><div class="topbar-title"><strong>${dkdEsc(site?.name || 'DraBornGate Premium')}</strong><small>${meta.label} • Web v2.0 senkron panel</small></div><div class="topbar-actions"><span class="live-indicator"><i class="live-dot"></i> CANLI SENKRON</span><button class="ghost-btn" data-action="refresh">${dkdIcon('refresh',17)} ${dkdState.refreshing ? 'Yenileniyor' : 'Yenile'}</button><button class="icon-btn" data-action="nav" data-page="notifications" aria-label="Bildirimler">${dkdIcon('bell',20)}</button></div></header>
      ${dkdRenderPage()}
    </main>
    <nav class="mobile-bottom">${nav.slice(0,4).map(([page,label,icon]) => `<button class="mobile-nav ${dkdState.page === page ? 'active' : ''}" data-action="nav" data-page="${page}">${dkdIcon(icon,18)}<span>${label.split(' ')[0]}</span></button>`).join('')}</nav>
    ${dkdState.modal ? dkdRenderModal() : ''}
  </div>`;
}

function dkdRenderPage() {
  if (dkdState.page === 'profile') return dkdRenderProfile();
  if (dkdState.page === 'notifications') return dkdRenderNotifications();
  if (dkdState.role === 'management') return dkdRenderManagement();
  if (dkdState.role === 'security') return dkdRenderSecurity();
  if (dkdState.role === 'resident') return dkdRenderResident();
  return dkdRenderCourier();
}

function dkdPageHead(eyebrow, title, description, actions = '') {
  return `<div class="page-head"><div><span class="eyebrow">${dkdIcon('sparkles',15)} ${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${actions ? `<div class="head-actions">${actions}</div>` : ''}</div>`;
}
function dkdMetric(label, value, note, icon, tone, trend = 'CANLI') {
  return `<article class="metric-card" style="--tone:${tone}"><div class="metric-top"><span class="metric-icon">${dkdIcon(icon,21)}</span><span class="metric-trend">${trend}</span></div><strong class="metric-value">${dkdEsc(value)}</strong><span class="metric-label">${dkdEsc(label)}</span><span class="metric-note">${dkdEsc(note)}</span></article>`;
}
function dkdEmpty(icon, title, text) { return `<div class="empty-state"><span class="empty-icon">${dkdIcon(icon,27)}</span><strong>${dkdEsc(title)}</strong><span>${dkdEsc(text)}</span></div>`; }
function dkdSiteSelect() {
  if (dkdState.data.sites.length <= 1) return '';
  return `<select class="select-premium" data-action="site-select">${dkdState.data.sites.map((site) => `<option value="${site.id}" ${site.id === dkdState.activeSiteId ? 'selected' : ''}>${dkdEsc(site.name)}</option>`).join('')}</select>`;
}

function dkdRenderManagement() {
  if (dkdState.page === 'reports') return dkdRenderManagementReports();
  if (dkdState.page === 'applications') return dkdRenderManagementApplications();
  if (dkdState.page === 'residents') return dkdRenderResidents();
  if (dkdState.page === 'rules') return dkdRenderRules();
  if (dkdState.page === 'finance') return dkdRenderFinance();
  const siteId = dkdState.activeSiteId;
  const passes = dkdState.data.passes.filter((item) => item.site_id === siteId || item.siteId === siteId);
  const visitors = dkdState.data.visitors.filter((item) => item.site_id === siteId || item.siteId === siteId);
  const dues = dkdState.data.duesCharges.filter((item) => item.site_id === siteId || item.siteId === siteId);
  const waiting = passes.filter((item) => item.status === 'waiting').length;
  const unpaid = dues.filter((item) => item.status === 'unpaid').reduce((sum,item) => sum + Number(item.amount || 0),0);
  const recent = dkdState.data.events.slice(0,6);
  return `<section class="page page-enter">
    ${dkdPageHead('SITE YÖNETİMİ • PREMIUM', 'Site Yönetimi Merkezi', 'Güvenlik, sakin, rapor, kural, aidat ve finans işlemlerini modern tek web ekranından yönet.', dkdSiteSelect())}
    <div class="hero-premium"><div class="hero-copy"><span class="premium-pill">${dkdIcon('crown',16)} YÖNETİM PRO</span><h2>Site operasyonunuz <span>tek bakışta kontrol altında.</span></h2><p>Canlı kurye trafiği, güvenlik kararları, sakin talepleri ve finans hareketleri uygulamayla aynı veri sisteminden anında güncellenir.</p><div class="hero-actions"><button class="primary-btn" data-action="nav" data-page="reports">${dkdIcon('chart',19)} PREMIUM RAPORLARI AÇ</button><button class="secondary-btn" data-action="nav" data-page="applications">${dkdIcon('users',19)} BAŞVURULARI YÖNET</button></div></div><div class="hero-visual"><div class="hero-shield">${dkdIcon('building',72)}</div></div></div>
    <div class="metrics-grid">${dkdMetric('Kurye Geçişi', String(passes.length), 'Seçili site toplam kayıt', 'route', '#45dbff')}${dkdMetric('Bekleyen', String(waiting), 'Güvenlik kuyruğu', 'clock', '#ffb75e')}${dkdMetric('Ziyaretçi', String(visitors.length), 'Misafir geçiş kayıtları', 'visitor', '#4ce4ac')}${dkdMetric('Ödenmemiş Aidat', dkdMoney(unpaid), 'Aktif borç toplamı', 'wallet', '#ff647c')}</div>
    <div class="dashboard-grid">
      <div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('activity',20)}</span><div><h3>Canlı Operasyon Akışı</h3><p>Son güvenlik ve geçiş hareketleri</p></div></div><span class="mini-pill">REALTIME</span></div>${recent.length ? `<div class="activity-list">${recent.map((item,index) => `<div class="activity-item" style="--tone:${index === 0 ? '#45dbff' : index % 2 ? '#8e6bff' : '#4ce4ac'}"><span class="activity-badge">${dkdIcon(index === 0 ? 'route' : 'activity',19)}</span><span class="activity-copy"><strong>${dkdEsc(item.title || 'Geçiş hareketi')}</strong><span>${dkdEsc(item.detail || 'DraBornGate operasyon kaydı güncellendi.')}</span></span><time class="activity-time">${dkdRelative(item.created_at || item.createdAt)}</time></div>`).join('')}</div>` : dkdEmpty('activity','Henüz hareket yok','Kurye ve güvenlik işlemleri başladığında canlı akış burada görünür.')}</div>
      <div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('sparkles',20)}</span><div><h3>Hızlı İşlemler</h3><p>En çok kullanılan yönetim araçları</p></div></div></div><div class="quick-grid"><button class="quick-card" style="--tone:#c65cff" data-action="nav" data-page="applications"><span class="quick-icon">${dkdIcon('users',20)}</span><strong>Başvurular</strong><small>Güvenlik ve sakin onayları</small></button><button class="quick-card" style="--tone:#45dbff" data-action="nav" data-page="residents"><span class="quick-icon">${dkdIcon('search',20)}</span><strong>Sakin Bul</strong><small>Ad, blok, daire, telefon</small></button><button class="quick-card" style="--tone:#ffb75e" data-action="open-modal" data-modal="dues"><span class="quick-icon">${dkdIcon('wallet',20)}</span><strong>Aidat Oluştur</strong><small>Yeni dönem ve borç kaydı</small></button><button class="quick-card" style="--tone:#4ce4ac" data-action="open-modal" data-modal="finance"><span class="quick-icon">${dkdIcon('money',20)}</span><strong>Finans Hareketi</strong><small>Gelir veya gider ekle</small></button></div></div>
    </div>
  </section>`;
}

async function dkdLoadManagementExtras() {
  if (dkdState.role !== 'management' || !dkdState.activeSiteId) return;
  try {
    const [applications, residents] = await Promise.all([
      dkdRpc('dkd_gate_list_site_role_applications', { p_site_id: dkdState.activeSiteId }),
      dkdRpc('dkd_gate_search_site_residents', { p_site_id: dkdState.activeSiteId, p_query: dkdState.residentQuery || '', p_limit: 50 })
    ]);
    dkdState.applications = dkdArray(applications);
    dkdState.residents = dkdArray(residents);
  } catch (error) {
    console.warn(error);
  }
}

async function dkdLoadReport() {
  if (!dkdState.activeSiteId) return;
  dkdState.busy = true; dkdRender();
  try {
    const days = { day: 1, week: 7, month: 30 }[dkdState.reportRange] || 30;
    const to = new Date();
    const from = new Date(to.getTime() - (days - 1) * 86400000);
    const params = { p_site_id: dkdState.activeSiteId, p_date_from: from.toISOString().slice(0,10), p_date_to: to.toISOString().slice(0,10) };
    const [report, entries, center] = await Promise.all([
      dkdRpc('dkd_gate_get_site_report', params),
      dkdRpc('dkd_gate_get_site_entry_report', params),
      dkdRpc('dkd_gate_get_subscription_center', { p_site_id: dkdState.activeSiteId })
    ]);
    dkdState.report = report || null;
    dkdState.entryReport = entries || null;
    dkdState.subscriptionCenter = center || null;
  } catch (error) { dkdToast('Rapor alınamadı', dkdSafeError(error), 'error'); }
  finally { dkdState.busy = false; dkdRender(); }
}

function dkdRenderManagementReports() {
  const report = dkdState.report;
  if (!report && !dkdState.busy) setTimeout(() => void dkdLoadReport(), 0);
  const summary = report?.summary || {};
  const daily = dkdArray(report?.daily);
  const max = Math.max(1, ...daily.map((item) => Number(item.courier || 0) + Number(item.visitor || 0)));
  const entries = dkdArray(dkdState.entryReport?.entries);
  return `<section class="page page-enter">${dkdPageHead('YÖNETİM ANALİTİĞİ', 'Premium Raporlar', 'Kurye, ziyaretçi, güvenlik performansı ve finans verilerini modern analitik görünümde incele.', `<button class="secondary-btn" data-action="export-report">${dkdIcon('download',18)} CSV DIŞA AKTAR</button>${dkdSiteSelect()}`)}
    <div class="filter-bar"><button class="filter-chip ${dkdState.reportRange === 'day' ? 'active' : ''}" data-action="report-range" data-range="day">Bugün</button><button class="filter-chip ${dkdState.reportRange === 'week' ? 'active' : ''}" data-action="report-range" data-range="week">Son 7 Gün</button><button class="filter-chip ${dkdState.reportRange === 'month' ? 'active' : ''}" data-action="report-range" data-range="month">Son 30 Gün</button></div>
    ${dkdState.busy && !report ? `<div class="metrics-grid">${[1,2,3,4].map(() => '<div class="metric-card skeleton"></div>').join('')}</div>` : `<div class="metrics-grid">${dkdMetric('Kurye Geçişi', String(summary.courier_total || 0), 'Seçili rapor dönemi', 'route', '#45dbff')}${dkdMetric('Tamamlanan', String(summary.completed || 0), `Tamamlama %${summary.completion_rate || 0}`, 'check', '#4ce4ac')}${dkdMetric('Ziyaretçi', String(summary.visitor_total || 0), 'Misafir trafiği', 'visitor', '#ffb75e')}${dkdMetric('Finans Bakiyesi', dkdMoney(summary.balance || 0), `Ödenmemiş ${dkdMoney(summary.dues_unpaid || 0)}`, 'wallet', '#c65cff')}</div>`}
    <div class="dashboard-grid"><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('chart',20)}</span><div><h3>Günlük Geçiş Trendi</h3><p>Kurye + ziyaretçi yoğunluğu</p></div></div></div>${daily.length ? `<div class="chart-bars">${daily.map((item) => { const total = Number(item.courier || 0) + Number(item.visitor || 0); return `<div class="chart-bar-wrap"><div class="chart-bar" style="height:${Math.max(5, total / max * 180)}px" title="${total} geçiş"></div><span>${dkdEsc(String(item.date || '').slice(5))}</span></div>`; }).join('')}</div>` : dkdEmpty('chart','Rapor verisi yok','Seçili dönemde grafiğe yansıyacak geçiş bulunmuyor.')}</div>
    <div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('crown',20)}</span><div><h3>Paket Durumu</h3><p>Web ve uygulama erişim planı</p></div></div></div>${dkdState.subscriptionCenter ? `<div class="stack"><div class="list-card"><span class="list-icon" style="--tone:#ffd875">${dkdIcon('crown',21)}</span><span class="list-copy"><strong>${dkdEsc(dkdState.subscriptionCenter.effective_plan?.name || dkdState.subscriptionCenter.effective_plan?.code || 'Aktif Paket')}</strong><span>${dkdEsc(dkdState.subscriptionCenter.effective_plan?.description || 'DraBornGate yönetim paketi')}</span></span></div>${Object.entries(dkdState.subscriptionCenter.usage || {}).slice(0,5).map(([key,value]) => `<div class="activity-item" style="--tone:#8e6bff"><span class="activity-badge">${dkdIcon('activity',18)}</span><span class="activity-copy"><strong>${dkdEsc(key.replaceAll('_',' '))}</strong><span>${Number(value.used || 0)} / ${Number(value.limit || 0) || '∞'}</span></span></div>`).join('')}</div>` : dkdEmpty('crown','Paket yükleniyor','Aktif plan ve kullanım bilgisi hazırlanıyor.')}</div></div>
    <div class="panel panel-pad section-gap"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('history',20)}</span><div><h3>Kurye Giriş Ayrıntıları</h3><p>${entries.length} kayıt</p></div></div></div>${entries.length ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Kurye</th><th>Plaka</th><th>Kapı</th><th>Adres</th><th>Durum</th><th>Tarih</th></tr></thead><tbody>${entries.map((item) => `<tr><td>${dkdEsc(item.courier_name)}</td><td>${dkdEsc(item.courier_plate || '—')}</td><td>${dkdEsc(item.gate || '—')}</td><td>${dkdEsc(`${item.block || ''} / ${item.apartment || ''}`)}</td><td><span class="status-pill ${dkdStatusClass(item.status)}">${dkdStatusLabel(item.status)}</span></td><td>${dkdDate(item.created_at,true)}</td></tr>`).join('')}</tbody></table></div>` : dkdEmpty('history','Giriş kaydı yok','Kurye geçişleri tamamlandıkça ayrıntılar burada görünür.')}</div>
  </section>`;
}

function dkdRenderManagementApplications() {
  const pending = dkdState.applications.filter((item) => item.status === 'pending');
  return `<section class="page page-enter">${dkdPageHead('YETKİ MERKEZİ', 'Başvurular', 'Güvenlik görevlisi ve site sakini başvurularını güvenli şekilde incele ve sonuçlandır.', dkdSiteSelect())}
    <div class="metrics-grid">${dkdMetric('Bekleyen Başvuru', String(pending.length), 'İnceleme gerekli', 'clock', '#ffb75e')}${dkdMetric('Toplam Başvuru', String(dkdState.applications.length), 'Tüm durumlar', 'users', '#45dbff')}${dkdMetric('Aktif Sakin', String(dkdState.residents.filter((item) => item.is_active !== false).length), 'Site üyelikleri', 'home', '#4ce4ac')}${dkdMetric('Güvenlik Katmanı', 'RLS', 'Rol bazlı erişim', 'shield', '#c65cff')}</div>
    <div class="panel panel-pad section-gap"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('users',20)}</span><div><h3>Rol Başvuruları</h3><p>Site yönetimi onayı bekleyen hesaplar</p></div></div><button class="ghost-btn" data-action="reload-management-extras">${dkdIcon('refresh',16)} Yenile</button></div>${dkdState.applications.length ? `<div class="stack">${dkdState.applications.map((item) => `<div class="queue-card" style="--tone:${item.requested_role === 'security' ? '#4ce4ac' : '#ffb75e'}"><div class="queue-top"><span class="queue-avatar">${dkdIcon(item.requested_role === 'security' ? 'shield' : 'home',23)}</span><div class="queue-copy"><h4>${dkdEsc(item.full_name)}</h4><p>${dkdEsc(item.email || 'E-posta yok')} • ${item.requested_role === 'security' ? 'Güvenlik' : 'Site Sakini'}</p></div><span class="status-pill ${item.status === 'pending' ? 'status-waiting' : item.status === 'approved' ? 'status-approved' : 'status-rejected'}">${dkdStatusLabel(item.status)}</span></div>${item.status === 'pending' ? `<div class="queue-actions"><button class="action-btn green" data-action="decide-application" data-id="${item.id}" data-status="approved">${dkdIcon('check',16)} ONAYLA</button><button class="action-btn red" data-action="decide-application" data-id="${item.id}" data-status="rejected">${dkdIcon('close',16)} REDDET</button></div>` : ''}</div>`).join('')}</div>` : dkdEmpty('users','Bekleyen başvuru yok','Yeni güvenlik veya site sakini başvuruları burada görünür.')}</div>
  </section>`;
}

function dkdRenderResidents() {
  return `<section class="page page-enter">${dkdPageHead('SAKİN AĞI', 'Site Sakinleri', 'Ad soyad, blok, daire veya telefon numarasıyla site sakinini hızlıca bul.', dkdSiteSelect())}
    <div class="panel panel-pad"><form id="resident-search-form" class="form-grid"><label class="field full"><span>Sakin Arama</span><span class="input-wrap">${dkdIcon('search',19)}<input name="query" value="${dkdEsc(dkdState.residentQuery)}" placeholder="Ad, daire, blok veya telefon"><button class="action-btn" type="submit">ARA</button></span></label></form></div>
    <div class="panel panel-pad section-gap"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('home',20)}</span><div><h3>Sakin Sonuçları</h3><p>${dkdState.residents.length} aktif kayıt</p></div></div></div>${dkdState.residents.length ? `<div class="stack">${dkdState.residents.map((item) => `<div class="list-card"><span class="list-icon" style="--tone:#45dbff">${dkdIcon('user',20)}</span><span class="list-copy"><strong>${dkdEsc(item.full_name)}</strong><span>Blok ${dkdEsc(item.block)} • Kat ${dkdEsc(item.floor)} • Daire ${dkdEsc(item.apartment)} • ${dkdEsc(item.phone || 'Telefon yok')}</span></span><button class="action-btn" data-action="copy-phone" data-phone="${dkdEsc(item.phone || '')}">${dkdIcon('copy',15)} KOPYALA</button></div>`).join('')}</div>` : dkdEmpty('search','Sakin bulunamadı','Arama bilgisini kontrol edin veya boş aramayla ilk 50 aktif sakini listeleyin.')}</div>
  </section>`;
}

function dkdRenderRules() {
  const rules = dkdState.data.rules.filter((item) => (item.site_id || item.siteId) === dkdState.activeSiteId);
  return `<section class="page page-enter">${dkdPageHead('KURAL MOTORU', 'Site ve Kapı Kuralları', 'Kurye ve ziyaretçi geçişlerinde gösterilecek kuralları premium yönetim panelinden düzenle.', `<button class="primary-btn" data-action="open-modal" data-modal="rule">${dkdIcon('plus',18)} YENİ KURAL</button>${dkdSiteSelect()}`)}
    <div class="panel panel-pad"><div class="stack">${rules.length ? rules.map((item) => `<div class="queue-card" style="--tone:${item.is_critical ? '#ff647c' : '#45dbff'}"><div class="queue-top"><span class="queue-avatar">${dkdIcon('rules',22)}</span><div class="queue-copy"><h4>${dkdEsc(item.title)}</h4><p>${dkdEsc(item.body)}</p></div><span class="status-pill ${item.is_critical ? 'status-rejected' : 'status-approved'}">${item.is_critical ? 'KRİTİK' : 'AKTİF'}</span></div><div class="queue-meta"><div class="meta-box"><span>Hedef</span><strong>${dkdEsc(item.audience || 'all')}</strong></div><div class="meta-box"><span>Kapsam</span><strong>${dkdEsc(item.scope_type || item.scopeType || 'site')}</strong></div><div class="meta-box"><span>Sürüm</span><strong>v${Number(item.version || 1)}</strong></div></div></div>`).join('') : dkdEmpty('rules','Henüz kural yok','Yeni site veya kapı kuralı oluşturarak geçiş akışına ekleyin.')}</div></div>
  </section>`;
}

function dkdRenderFinance() {
  const siteId = dkdState.activeSiteId;
  const dues = dkdState.data.duesCharges.filter((item) => (item.site_id || item.siteId) === siteId);
  const finance = dkdState.data.financeTransactions.filter((item) => (item.site_id || item.siteId) === siteId);
  const income = finance.filter((item) => (item.transaction_type || item.transactionType) === 'income').reduce((sum,item) => sum + Number(item.amount || 0),0);
  const expense = finance.filter((item) => (item.transaction_type || item.transactionType) === 'expense').reduce((sum,item) => sum + Number(item.amount || 0),0);
  const unpaid = dues.filter((item) => item.status === 'unpaid').reduce((sum,item) => sum + Number(item.amount || 0),0);
  return `<section class="page page-enter">${dkdPageHead('FİNANS PRO', 'Aidat ve Finans', 'Site gelir-gider hareketlerini, aidat dönemlerini ve borç durumlarını tek panelden yönetin.', `<button class="secondary-btn" data-action="open-modal" data-modal="finance">${dkdIcon('money',18)} HAREKET EKLE</button><button class="primary-btn" data-action="open-modal" data-modal="dues">${dkdIcon('plus',18)} AİDAT OLUŞTUR</button>${dkdSiteSelect()}`)}
    <div class="metrics-grid">${dkdMetric('Toplam Gelir', dkdMoney(income), 'Görünür işlemler', 'money', '#4ce4ac')}${dkdMetric('Toplam Gider', dkdMoney(expense), 'Görünür işlemler', 'wallet', '#ff647c')}${dkdMetric('Net Bakiye', dkdMoney(income-expense), 'Gelir eksi gider', 'chart', '#45dbff')}${dkdMetric('Ödenmemiş Aidat', dkdMoney(unpaid), `${dues.filter((x)=>x.status==='unpaid').length} borç kaydı`, 'alert', '#ffb75e')}</div>
    <div class="dashboard-grid"><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('wallet',20)}</span><div><h3>Aidat Kayıtları</h3><p>${dues.length} borç / ödeme kaydı</p></div></div></div>${dues.length ? `<div class="stack">${dues.slice(0,30).map((item) => `<div class="list-card"><span class="list-icon" style="--tone:${item.status === 'paid' ? '#4ce4ac' : '#ffb75e'}">${dkdIcon(item.status === 'paid' ? 'check' : 'alert',20)}</span><span class="list-copy"><strong>Blok ${dkdEsc(item.block)} • Daire ${dkdEsc(item.apartment)}</strong><span>${item.status === 'paid' ? 'Ödendi' : 'Ödenmedi'}${item.payment_note ? ` • ${dkdEsc(item.payment_note)}` : ''}</span></span><strong style="color:${item.status === 'paid' ? 'var(--green)' : 'var(--orange)'}">${dkdMoney(item.amount)}</strong>${item.status === 'unpaid' ? `<button class="action-btn green" data-action="mark-due-paid" data-id="${item.id}">ÖDENDİ</button>` : ''}</div>`).join('')}</div>` : dkdEmpty('wallet','Aidat kaydı yok','Yeni aidat dönemi oluşturduğunuzda borçlar burada listelenir.')}</div>
    <div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('money',20)}</span><div><h3>Finans Hareketleri</h3><p>${finance.length} işlem</p></div></div></div>${finance.length ? `<div class="stack">${finance.slice(0,30).map((item) => { const type = item.transaction_type || item.transactionType; return `<div class="activity-item" style="--tone:${type === 'income' ? '#4ce4ac' : '#ff647c'}"><span class="activity-badge">${dkdIcon(type === 'income' ? 'plus' : 'wallet',19)}</span><span class="activity-copy"><strong>${dkdEsc(item.description)}</strong><span>${dkdEsc(item.category)} • ${dkdDate(item.transaction_date || item.transactionDate)}</span></span><strong style="color:${type === 'income' ? 'var(--green)' : 'var(--red)'}">${type === 'income' ? '+' : '-'}${dkdMoney(item.amount)}</strong></div>`; }).join('')}</div>` : dkdEmpty('money','Finans hareketi yok','Gelir veya gider eklediğinizde burada görünür.')}</div></div>
  </section>`;
}

function dkdRenderSecurity() {
  if (dkdState.page === 'visitors') return dkdRenderSecurityVisitors();
  if (dkdState.page === 'history') return dkdRenderHistory('security');
  const siteId = dkdState.activeSiteId;
  const active = dkdState.data.passes.filter((item) => (item.site_id || item.siteId) === siteId && ['waiting','approved','arrived'].includes(item.status));
  const waiting = active.filter((item) => item.status === 'waiting').length;
  const arrived = active.filter((item) => item.status === 'arrived').length;
  const visitors = dkdState.data.visitors.filter((item) => (item.site_id || item.siteId) === siteId && item.status === 'waiting').length;
  return `<section class="page page-enter">${dkdPageHead('GÜVENLİK OPERASYONU', dkdState.page === 'queue' ? 'Kurye Kuyruğu' : 'Premium Güvenlik Merkezi', 'Kurye kodlarını doğrula, ziyaretçileri yönet ve tüm kapı hareketlerini canlı olarak takip et.', dkdSiteSelect())}
    ${dkdState.page === 'home' ? `<div class="hero-premium"><div class="hero-copy"><span class="premium-pill">${dkdIcon('shield',16)} GÜVENLİK AKTİF</span><h2>Kapı kontrolü <span>hızlı, net ve güvenli.</span></h2><p>Tek kullanımlık kurye kodları, ziyaretçi onayları ve geçiş kayıtları uygulamayla eş zamanlı olarak güvenlik ekranına düşer.</p><div class="hero-actions"><button class="primary-btn" data-action="focus-code">${dkdIcon('key',19)} KURYE KODU DOĞRULA</button><button class="secondary-btn" data-action="nav" data-page="visitors">${dkdIcon('visitor',19)} ZİYARETÇİ MERKEZİ</button></div></div><div class="hero-visual"><div class="hero-shield">${dkdIcon('shield',76)}</div></div></div>` : ''}
    <div class="metrics-grid">${dkdMetric('Bekleyen Kurye', String(waiting), 'Onay sırası', 'clock', '#ffb75e')}${dkdMetric('Kapıda', String(arrived), 'Kod eşleşmesi bekliyor', 'pin', '#45dbff')}${dkdMetric('Bekleyen Misafir', String(visitors), 'Ziyaretçi doğrulama', 'visitor', '#4ce4ac')}${dkdMetric('Güvenlik Modu', 'AKTİF', 'Canlı kayıt sistemi', 'shield', '#c65cff')}</div>
    <div class="dashboard-grid"><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('key',20)}</span><div><h3>6 Haneli Kurye Kodu</h3><p>Kapıya gelen kuryenin tek kullanımlık kodunu girin</p></div></div></div><form id="courier-code-form"><div class="input-wrap" id="courier-code-wrap">${dkdIcon('key',21)}<input name="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="000000" style="font-size:24px;letter-spacing:.18em;font-weight:950"><button class="primary-btn" type="submit" style="min-height:42px">KURYENİ BUL</button></div></form>${dkdState.codeMatch ? `<div class="section-gap">${dkdPassCard(dkdState.codeMatch, true)}</div>` : ''}</div>
    <div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('activity',20)}</span><div><h3>Kapı Özeti</h3><p>Aktif geçişlerin durum dağılımı</p></div></div></div><div class="quick-grid"><div class="quick-card" style="--tone:#ffb75e"><span class="quick-icon">${dkdIcon('clock',20)}</span><strong>${waiting} Bekleyen</strong><small>İnceleme sırasındaki kuryeler</small></div><div class="quick-card" style="--tone:#45dbff"><span class="quick-icon">${dkdIcon('pin',20)}</span><strong>${arrived} Kapıda</strong><small>Kod doğrulaması bekliyor</small></div></div></div></div>
    <div class="panel panel-pad section-gap"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('route',20)}</span><div><h3>Canlı Kurye Kuyruğu</h3><p>${active.length} aktif kayıt</p></div></div></div>${active.length ? `<div class="stack">${active.map((pass) => dkdPassCard(pass,true)).join('')}</div>` : dkdEmpty('shield','Kuyruk temiz','Bu site için bekleyen veya kapıda olan kurye geçişi yok.')}</div>
  </section>`;
}

function dkdPassCard(pass, security = false) {
  const tone = pass.status === 'arrived' ? '#45dbff' : pass.status === 'approved' ? '#4ce4ac' : pass.status === 'rejected' ? '#ff647c' : '#ffb75e';
  const id = pass.id;
  return `<article class="queue-card" style="--tone:${tone}"><div class="queue-top"><span class="queue-avatar">${dkdIcon('bike',23)}</span><div class="queue-copy"><h4>${dkdEsc(pass.courier_name || pass.courierName || 'Kurye')}</h4><p>${dkdEsc(pass.platform || 'DraBornGo')} • ${dkdEsc(pass.courier_plate || pass.plate || pass.courierPlate || 'Plaka yok')} • ${dkdEsc(pass.gate || 'Kapı')}</p></div><span class="status-pill ${dkdStatusClass(pass.status)}">${dkdStatusLabel(pass.status)}</span></div><div class="queue-meta"><div class="meta-box"><span>Adres</span><strong>${dkdEsc(`${pass.block || ''} / Daire ${pass.apartment || '—'}`)}</strong></div><div class="meta-box"><span>Sipariş</span><strong>${dkdEsc(pass.order_number || pass.orderNumber || '—')}</strong></div><div class="meta-box"><span>Mesafe</span><strong>${pass.last_distance_m != null ? `${Math.round(pass.last_distance_m)} m` : '—'}</strong></div></div>${pass.status === 'arrived' && pass.approval_code ? `<div class="code-box section-gap"><div><small>TEK KULLANIMLIK KOD</small><strong>${dkdEsc(pass.approval_code)}</strong></div>${dkdIcon('key',31)}</div>` : ''}${security ? `<div class="queue-actions">${pass.status === 'waiting' ? `<button class="action-btn green" data-action="pass-status" data-id="${id}" data-status="approved">${dkdIcon('check',15)} ONAYLA</button>` : ''}${['waiting','approved','arrived'].includes(pass.status) ? `<button class="action-btn red" data-action="open-reject-pass" data-id="${id}">${dkdIcon('close',15)} REDDET</button>` : ''}${pass.status === 'arrived' ? `<button class="action-btn" data-action="open-complete-pass" data-id="${id}">${dkdIcon('key',15)} KODLA GİRİŞ VER</button>` : ''}</div>` : ''}</article>`;
}

function dkdRenderSecurityVisitors() {
  const visitors = dkdState.data.visitors.filter((item) => (item.site_id || item.siteId) === dkdState.activeSiteId);
  return `<section class="page page-enter">${dkdPageHead('ZİYARETÇİ GÜVENLİĞİ', 'Ziyaretçi Geçişi', 'Misafir kodlarını doğrula, giriş kararlarını kaydet ve geçiş geçmişini görüntüle.', dkdSiteSelect())}<div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('visitor',20)}</span><div><h3>Ziyaretçi Kayıtları</h3><p>${visitors.length} kayıt</p></div></div></div>${visitors.length ? `<div class="stack">${visitors.map((item) => `<div class="queue-card" style="--tone:${item.status === 'waiting' ? '#ffb75e' : item.status === 'approved' ? '#4ce4ac' : '#45dbff'}"><div class="queue-top"><span class="queue-avatar">${dkdIcon('visitor',22)}</span><div class="queue-copy"><h4>${dkdEsc(item.guest_name || item.guestName)}</h4><p>${dkdEsc(item.guest_phone || item.guestPhone || 'Telefon yok')} • ${dkdEsc(item.plate || 'Plaka yok')}</p></div><span class="status-pill ${dkdStatusClass(item.status)}">${dkdStatusLabel(item.status)}</span></div><div class="code-box section-gap"><div><small>MİSAFİR KODU</small><strong>${dkdEsc(item.visitor_code || item.visitorCode)}</strong></div>${dkdIcon('key',31)}</div>${item.status === 'waiting' ? `<div class="queue-actions"><button class="action-btn green" data-action="visitor-status" data-code="${item.visitor_code || item.visitorCode}" data-status="approved">ONAYLA</button><button class="action-btn red" data-action="open-reject-visitor" data-code="${item.visitor_code || item.visitorCode}">REDDET</button></div>` : item.status === 'approved' ? `<div class="queue-actions"><button class="action-btn" data-action="visitor-status" data-code="${item.visitor_code || item.visitorCode}" data-status="completed">GİRİŞİ TAMAMLA</button></div>` : ''}</div>`).join('')}</div>` : dkdEmpty('visitor','Ziyaretçi kaydı yok','Site sakinlerinin oluşturduğu misafir kodları burada görünür.')}</div></section>`;
}

function dkdRenderCourier() {
  if (dkdState.page === 'create') return dkdRenderCreatePass();
  if (dkdState.page === 'passes') return dkdRenderCourierPasses();
  if (dkdState.page === 'history') return dkdRenderHistory('courier');
  const own = dkdOwnPasses();
  const active = own.find((item) => ['waiting','approved','arrived'].includes(item.status));
  const completed = own.filter((item) => item.status === 'completed').length;
  const site = dkdState.data.sites.find((item) => item.id === (active?.site_id || active?.siteId));
  const gate = dkdState.data.gates.find((item) => item.id === (active?.gate_id || active?.gateId));
  return `<section class="page page-enter">${dkdPageHead('KURYE OPERASYONU', `Merhaba ${dkdEsc(dkdFirstName())} 👋`, 'Geçiş taleplerini, tek kullanımlık kodlarını ve kapı durumunu premium web panelinden yönet.')}
    <div class="hero-premium"><div class="hero-copy"><span class="premium-pill">${dkdIcon('bike',16)} KURYE PRO</span><h2>Kapıda beklemeyi bırak. <span>Geçişini önceden hazırla.</span></h2><p>Siteye gelmeden talebini oluştur, konumunu tek sefer kontrol ettir ve güvenliğe göstereceğin kodu web veya uygulamadan kullan.</p><div class="hero-actions"><button class="primary-btn" data-action="nav" data-page="create">${dkdIcon('plus',19)} YENİ GEÇİŞ TALEBİ</button><button class="secondary-btn" data-action="nav" data-page="passes">${dkdIcon('key',19)} GEÇİŞLERİMİ AÇ</button></div></div><div class="hero-visual"><div class="hero-shield">${dkdIcon('bike',78)}</div></div></div>
    <div class="metrics-grid">${dkdMetric('Tamamlanan', String(completed), 'Toplam başarılı giriş', 'check', '#4ce4ac')}${dkdMetric('Aktif Geçiş', active ? '1' : '0', active ? dkdStatusLabel(active.status) : 'Yeni talep oluşturabilirsin', 'key', '#45dbff')}${dkdMetric('Aktif Site', String(dkdState.data.sites.length), 'Erişilebilir site ağı', 'building', '#ffb75e')}${dkdMetric('Canlı Senkron', 'AÇIK', 'Web + uygulama', 'activity', '#c65cff')}</div>
    <div class="dashboard-grid"><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('route',20)}</span><div><h3>Aktif Kurye Geçişi</h3><p>${active ? `${site?.name || 'Site'} • ${gate?.name || active.gate || 'Kapı'}` : 'Aktif talep yok'}</p></div></div></div>${active ? `${dkdPassCard(active,false)}<div class="queue-actions section-gap">${gate?.latitude != null && gate?.longitude != null ? `<button class="secondary-btn" data-action="courier-location" data-id="${active.id}">${dkdIcon('pin',18)} KONUM KONTROLÜ YAP</button>` : ''}${['waiting','approved'].includes(active.status) ? `<button class="primary-btn" data-action="pass-status" data-id="${active.id}" data-status="arrived">${dkdIcon('pin',18)} KAPIYA GELDİM</button>` : ''}</div>` : dkdEmpty('route','Aktif geçiş talebin yok','Bir sonraki teslimat için yeni geçiş talebi oluşturabilirsin.')}</div>
    <div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('activity',20)}</span><div><h3>Son Hareketler</h3><p>Kurye hesabına ait operasyon akışı</p></div></div></div>${dkdState.data.events.length ? `<div class="activity-list">${dkdState.data.events.slice(0,6).map((item,index) => `<div class="activity-item" style="--tone:${index%2 ? '#8e6bff' : '#45dbff'}"><span class="activity-badge">${dkdIcon('activity',18)}</span><span class="activity-copy"><strong>${dkdEsc(item.title)}</strong><span>${dkdEsc(item.detail)}</span></span><time class="activity-time">${dkdRelative(item.created_at || item.createdAt)}</time></div>`).join('')}</div>` : dkdEmpty('activity','Henüz hareket yok','Geçiş talebi oluşturduğunda hareketler burada görünür.')}</div></div>
  </section>`;
}

function dkdRenderCreatePass() {
  const sites = dkdState.data.sites;
  const currentSiteId = dkdState.activeSiteId || sites[0]?.id || '';
  const gates = dkdSiteGates(currentSiteId);
  return `<section class="page page-enter">${dkdPageHead('HIZLI GEÇİŞ', 'Yeni Kurye Geçişi', 'Teslimat bilgilerini güvenliğe önceden gönder; kapıda yalnızca tek kullanımlık kodunu göster.', `<button class="ghost-btn" data-action="nav" data-page="home">${dkdIcon('arrow',17)} Ana Merkez</button>`)}
    <div class="panel panel-pad"><form id="create-pass-form" class="form-grid"><label class="field"><span>Site</span><span class="input-wrap">${dkdIcon('building',19)}<select name="siteId" data-action="create-site-select" required>${sites.map((site) => `<option value="${site.id}" ${site.id === currentSiteId ? 'selected' : ''}>${dkdEsc(site.name)}</option>`).join('')}</select></span></label><label class="field"><span>Kapı</span><span class="input-wrap">${dkdIcon('shield',19)}<select name="gateId" required>${gates.map((gate) => `<option value="${gate.id}" data-name="${dkdEsc(gate.name)}">${dkdEsc(gate.name)}</option>`).join('')}</select></span></label><label class="field"><span>Müşteri Adı</span><span class="input-wrap">${dkdIcon('user',19)}<input name="customerName" required placeholder="Teslimat yapılacak kişi"></span></label><label class="field"><span>Sipariş Numarası</span><span class="input-wrap">${dkdIcon('key',19)}<input name="orderNumber" required placeholder="Sipariş numarası"></span></label><label class="field full"><span>Açık Adres</span><span class="input-wrap">${dkdIcon('pin',19)}<input name="addressText" required placeholder="Adres açıklaması"></span></label><label class="field"><span>Blok</span><span class="input-wrap"><input name="block" required placeholder="A Blok"></span></label><label class="field"><span>Kat</span><span class="input-wrap"><input name="floor" placeholder="3"></span></label><label class="field"><span>Daire</span><span class="input-wrap"><input name="apartment" required placeholder="12"></span></label><label class="field"><span>Tahmini Varış</span><span class="input-wrap">${dkdIcon('clock',19)}<input name="etaMinutes" type="number" min="1" max="120" value="6"></span></label><label class="field full"><span>Not</span><span class="input-wrap">${dkdIcon('rules',19)}<textarea name="note" placeholder="Güvenlik için kısa not"></textarea></span></label><label class="list-card full" style="cursor:pointer"><input type="checkbox" name="rulesAccepted" required style="accent-color:var(--cyan)"><span class="list-icon" style="--tone:#4ce4ac">${dkdIcon('shield',20)}</span><span class="list-copy"><strong>Site ve geçiş kurallarını kabul ediyorum</strong><span>Geçiş kaydı güvenlik ve denetim amacıyla saklanabilir.</span></span></label><div class="form-actions full"><button class="primary-btn" type="submit" ${dkdState.busy ? 'disabled' : ''}>${dkdIcon('route',19)} GEÇİŞ TALEBİNİ GÖNDER</button></div></form></div>
  </section>`;
}

function dkdRenderCourierPasses() {
  const passes = dkdOwnPasses();
  return `<section class="page page-enter">${dkdPageHead('KURYE GEÇİŞLERİ', 'Geçişlerim', 'Aktif ve geçmiş tüm kurye geçiş taleplerini tek ekranda görüntüle.', `<button class="primary-btn" data-action="nav" data-page="create">${dkdIcon('plus',18)} YENİ GEÇİŞ</button>`)}<div class="panel panel-pad">${passes.length ? `<div class="stack">${passes.map((pass) => dkdPassCard(pass,false)).join('')}</div>` : dkdEmpty('key','Geçiş kaydı yok','Yeni bir teslimat için geçiş talebi oluşturarak başlayabilirsin.')}</div></section>`;
}

function dkdRenderResident() {
  if (dkdState.page === 'visitors') return dkdRenderResidentVisitors();
  if (dkdState.page === 'dues') return dkdRenderResidentDues();
  const resident = dkdCurrentResident();
  if (!resident) return `<section class="page page-enter">${dkdPageHead('SİTE SAKİNİ', 'Adres Kaydı Bekleniyor', 'Site yönetimi hesabınızı onayladığında sakin paneliniz otomatik açılır.')}<div class="panel panel-pad">${dkdEmpty('home','Aktif site üyeliği bulunamadı','Başvurunuz onaylandıktan sonra adres, aidat ve misafir işlemleri burada kullanılabilir.')}</div></section>`;
  const siteId = resident.site_id || resident.siteId;
  if (!dkdState.activeSiteId) dkdState.activeSiteId = siteId;
  const incoming = dkdState.data.passes.filter((item) => (item.site_id || item.siteId) === siteId && !['completed','rejected','cancelled','expired'].includes(item.status));
  const visitors = dkdState.data.visitors.filter((item) => (item.resident_user_id || item.residentUserId) === dkdState.session.user.id);
  const charges = dkdState.data.duesCharges.filter((item) => (item.resident_user_id || item.residentUserId) === dkdState.session.user.id);
  const unpaid = charges.filter((item) => item.status === 'unpaid');
  const debt = unpaid.reduce((sum,item) => sum + Number(item.amount || 0),0);
  const unread = dkdState.data.notifications.filter((item) => !(item.read_at || item.readAt)).length;
  return `<section class="page page-enter">${dkdPageHead('SİTE SAKİNİ • PREMIUM', `Merhaba ${dkdEsc(dkdFirstName())} 👋`, `${dkdEsc(dkdActiveSite()?.name || 'Site')} • Blok ${dkdEsc(resident.block)} • Daire ${dkdEsc(resident.apartment)}`)}
    <div class="hero-premium"><div class="hero-copy"><span class="premium-pill">${dkdIcon('home',16)} SAKİN AĞI</span><h2>Evinize gelenleri <span>önceden görün ve yönetin.</span></h2><p>Kurye durumları, misafir kodları, aidat borçları ve site duyuruları uygulamayla aynı anda web panelinize ulaşır.</p><div class="hero-actions"><button class="primary-btn" data-action="nav" data-page="visitors">${dkdIcon('visitor',19)} MİSAFİR KODU OLUŞTUR</button><button class="secondary-btn" data-action="nav" data-page="dues">${dkdIcon('wallet',19)} AİDATLARIMI AÇ</button></div></div><div class="hero-visual"><div class="hero-shield">${dkdIcon('home',76)}</div></div></div>
    <div class="metrics-grid">${dkdMetric('Güncel Borç', dkdMoney(debt), `${unpaid.length} ödenmemiş kayıt`, 'wallet', '#ff647c')}${dkdMetric('Gelen Kurye', String(incoming.length), 'Aktif teslimat', 'bike', '#45dbff')}${dkdMetric('Misafir', String(visitors.filter((x)=>['waiting','approved'].includes(x.status)).length), 'Aktif misafir kodu', 'visitor', '#4ce4ac')}${dkdMetric('Bildirim', String(unread), 'Okunmamış kayıt', 'bell', '#ffb75e')}</div>
    <div class="dashboard-grid"><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('bike',20)}</span><div><h3>Adresime Gelen Kuryeler</h3><p>${incoming.length} aktif kayıt</p></div></div></div>${incoming.length ? `<div class="stack">${incoming.map((pass) => dkdPassCard(pass,false)).join('')}</div>` : dkdEmpty('bike','Aktif kurye yok','Adresinizle eşleşen yeni kurye talebi burada görünür.')}</div><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('bell',20)}</span><div><h3>Son Bildirimler</h3><p>Kurye, misafir ve aidat hareketleri</p></div></div></div>${dkdState.data.notifications.length ? `<div class="activity-list">${dkdState.data.notifications.slice(0,6).map((item) => `<button class="activity-item" style="--tone:${item.read_at || item.readAt ? '#71809a' : '#ffb75e'}" data-action="read-notification" data-id="${item.id}"><span class="activity-badge">${dkdIcon('bell',18)}</span><span class="activity-copy"><strong>${dkdEsc(item.title)}</strong><span>${dkdEsc(item.body)}</span></span></button>`).join('')}</div>` : dkdEmpty('bell','Bildirim yok','Yeni site hareketleri burada görünür.')}</div></div>
  </section>`;
}

function dkdRenderResidentVisitors() {
  const visitors = dkdState.data.visitors.filter((item) => (item.resident_user_id || item.residentUserId) === dkdState.session.user.id);
  return `<section class="page page-enter">${dkdPageHead('MİSAFİR GEÇİŞİ', 'Misafir Kodları', 'Gelecek misafiriniz için tek kullanımlık kod oluşturun ve giriş durumunu takip edin.', `<button class="primary-btn" data-action="open-modal" data-modal="visitor">${dkdIcon('plus',18)} YENİ MİSAFİR</button>`)}<div class="panel panel-pad">${visitors.length ? `<div class="stack">${visitors.map((item) => `<div class="queue-card" style="--tone:${item.status === 'waiting' ? '#ffb75e' : '#4ce4ac'}"><div class="queue-top"><span class="queue-avatar">${dkdIcon('visitor',22)}</span><div class="queue-copy"><h4>${dkdEsc(item.guest_name || item.guestName)}</h4><p>${dkdEsc(item.plate || 'Plaka yok')} • ${dkdDate(item.created_at || item.createdAt,true)}</p></div><span class="status-pill ${dkdStatusClass(item.status)}">${dkdStatusLabel(item.status)}</span></div><div class="code-box section-gap"><div><small>MİSAFİR KODU</small><strong>${dkdEsc(item.visitor_code || item.visitorCode)}</strong></div><button class="icon-btn" data-action="copy-code" data-code="${item.visitor_code || item.visitorCode}">${dkdIcon('copy',20)}</button></div></div>`).join('')}</div>` : dkdEmpty('visitor','Misafir kodu yok','Yeni misafir kodu oluşturarak güvenliğe önceden bilgi verin.')}</div></section>`;
}

function dkdRenderResidentDues() {
  const charges = dkdState.data.duesCharges.filter((item) => (item.resident_user_id || item.residentUserId) === dkdState.session.user.id);
  const finance = dkdState.data.financeTransactions;
  const income = finance.filter((item) => (item.transaction_type || item.transactionType) === 'income').reduce((sum,item)=>sum+Number(item.amount||0),0);
  const expense = finance.filter((item) => (item.transaction_type || item.transactionType) === 'expense').reduce((sum,item)=>sum+Number(item.amount||0),0);
  return `<section class="page page-enter">${dkdPageHead('SAKİN FİNANS', 'Aidat ve Finans', 'Aidat borçlarınızı, geçmiş ödemeleri ve yönetimin paylaştığı gelir-gider özetini görüntüleyin.')}<div class="metrics-grid">${dkdMetric('Toplam Gelir', dkdMoney(income), 'Yönetim paylaşımı', 'money', '#4ce4ac')}${dkdMetric('Toplam Gider', dkdMoney(expense), 'Yönetim paylaşımı', 'wallet', '#ff647c')}${dkdMetric('Site Bakiyesi', dkdMoney(income-expense), 'Gelir eksi gider', 'chart', '#45dbff')}${dkdMetric('Aidat Kaydı', String(charges.length), 'Size ait dönemler', 'calendar', '#ffb75e')}</div><div class="panel panel-pad section-gap">${charges.length ? `<div class="stack">${charges.map((item) => `<div class="list-card"><span class="list-icon" style="--tone:${item.status === 'paid' ? '#4ce4ac' : '#ffb75e'}">${dkdIcon(item.status === 'paid' ? 'check' : 'alert',20)}</span><span class="list-copy"><strong>Blok ${dkdEsc(item.block)} • Daire ${dkdEsc(item.apartment)}</strong><span>${item.status === 'paid' ? 'Ödendi' : 'Ödenmedi'}${item.payment_note ? ` • ${dkdEsc(item.payment_note)}` : ''}</span></span><strong style="color:${item.status === 'paid' ? 'var(--green)' : 'var(--orange)'}">${dkdMoney(item.amount)}</strong></div>`).join('')}</div>` : dkdEmpty('wallet','Aidat kaydı yok','Yönetim aidat dönemi oluşturduğunda burada görünür.')}</div></section>`;
}

function dkdRenderHistory(scope) {
  let passes = dkdState.data.passes;
  if (scope === 'courier') passes = dkdOwnPasses();
  if (scope === 'security') passes = passes.filter((item) => (item.site_id || item.siteId) === dkdState.activeSiteId);
  const completed = passes.filter((item) => ['completed','rejected','cancelled','expired'].includes(item.status));
  return `<section class="page page-enter">${dkdPageHead('GEÇİŞ ARŞİVİ', 'Geçiş Geçmişi', 'Tamamlanan, reddedilen ve süresi dolan geçiş kayıtlarını inceleyin.')}<div class="panel panel-pad">${completed.length ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Kurye</th><th>Plaka</th><th>Site</th><th>Kapı</th><th>Durum</th><th>Tarih</th></tr></thead><tbody>${completed.map((item) => `<tr><td>${dkdEsc(item.courier_name || item.courierName || 'Kurye')}</td><td>${dkdEsc(item.courier_plate || item.courierPlate || '—')}</td><td>${dkdEsc(dkdState.data.sites.find((site)=>site.id === (item.site_id || item.siteId))?.name || 'Site')}</td><td>${dkdEsc(item.gate || '—')}</td><td><span class="status-pill ${dkdStatusClass(item.status)}">${dkdStatusLabel(item.status)}</span></td><td>${dkdDate(item.created_at || item.createdAt,true)}</td></tr>`).join('')}</tbody></table></div>` : dkdEmpty('history','Geçmiş kayıt yok','Tamamlanan veya reddedilen geçişler burada görünür.')}</div></section>`;
}

function dkdRenderNotifications() {
  const notifications = dkdState.data.notifications;
  return `<section class="page page-enter">${dkdPageHead('BİLDİRİM MERKEZİ', 'Canlı Bildirimler', 'Kurye, ziyaretçi, aidat, destek ve güvenlik hareketlerini web üzerinden takip edin.', `<button class="secondary-btn" data-action="mark-all-read">${dkdIcon('check',18)} TÜMÜNÜ OKU</button>`)}<div class="panel panel-pad">${notifications.length ? `<div class="stack">${notifications.map((item) => `<button class="activity-item" style="--tone:${item.read_at || item.readAt ? '#71809a' : '#ffb75e'}" data-action="read-notification" data-id="${item.id}"><span class="activity-badge">${dkdIcon('bell',19)}</span><span class="activity-copy"><strong>${dkdEsc(item.title)}</strong><span>${dkdEsc(item.body)}</span></span><time class="activity-time">${dkdRelative(item.created_at || item.createdAt)}</time></button>`).join('')}</div>` : dkdEmpty('bell','Bildirim yok','Yeni operasyon hareketleri burada görünür.')}</div></section>`;
}

function dkdRenderProfile() {
  const meta = dkdRoleMeta[dkdState.role] || dkdRoleMeta.courier;
  return `<section class="page page-enter">${dkdPageHead('HESAP MERKEZİ', 'Profil ve Kişisel Bağlantı', 'Profil bilgilerinizi, erişilebilir rollerinizi ve kişisel DraBornGate web adresinizi yönetin.')}
    <div class="profile-grid"><div class="profile-hero"><div class="avatar">${dkdEsc(dkdFullName().split(' ').map((x)=>x[0]).join('').slice(0,2).toUpperCase())}</div><h2>${dkdEsc(dkdFullName())}</h2><p>${dkdEsc(dkdEmail())}</p><span class="role-pill" style="color:${meta.tone};border-color:${meta.tone}42;background:${meta.tone}0d">${dkdIcon(meta.icon,15)} ${meta.label}</span></div><div class="panel panel-pad"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('layers',20)}</span><div><h3>Erişilebilir Roller</h3><p>Aktif görünümü güvenli şekilde değiştir</p></div></div></div><div class="quick-grid">${dkdState.roles.map((role) => { const item = dkdRoleMeta[role]; return `<button class="quick-card" style="--tone:${item.tone}" data-action="switch-role" data-role="${role}"><span class="quick-icon">${dkdIcon(item.icon,20)}</span><strong>${item.label}</strong><small>${dkdState.role === role ? 'Şu anda aktif rol' : 'Bu görünüme geç'}</small></button>`; }).join('')}</div><div class="panel-title-row section-gap"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('link',20)}</span><div><h3>Kişisel Web Bağlantısı</h3><p>URL yalnızca kolay erişim sağlar; yetki oturum ve RLS ile korunur.</p></div></div></div><div class="link-preview">${dkdEsc(dkdPersonalLink())}</div><div class="form-actions"><button class="secondary-btn" data-action="copy-link">${dkdIcon('copy',18)} BAĞLANTIYI KOPYALA</button></div></div></div>
    <div class="panel panel-pad section-gap"><div class="panel-title-row"><div class="panel-title"><span class="panel-title-icon">${dkdIcon('shield',20)}</span><div><h3>Gizlilik ve Veri Merkezi</h3><p>Google Play ve web politika sayfaları korunmuştur.</p></div></div></div><div class="policy-links"><a class="policy-link" href="./privacy/">${dkdIcon('shield',18)}<span>Gizlilik Politikası</span></a><a class="policy-link" href="./data-safety/">${dkdIcon('lock',18)}<span>Veri Güvenliği</span></a><a class="policy-link" href="./account-deletion/">${dkdIcon('trash',18)}<span>Hesap Silme</span></a><a class="policy-link" href="./support/">${dkdIcon('mail',18)}<span>Destek Merkezi</span></a><a class="policy-link" href="./terms/">${dkdIcon('rules',18)}<span>Kullanım Koşulları</span></a><a class="policy-link" href="./subscriptions/">${dkdIcon('crown',18)}<span>Abonelikler</span></a></div></div>
  </section>`;
}

function dkdRenderModal() {
  const modal = dkdState.modal;
  const close = `<button class="icon-btn" data-action="close-modal">${dkdIcon('x',20)}</button>`;
  if (modal.type === 'visitor') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Yeni Misafir Kodu</h3><p>Misafir bilgilerini güvenliğe önceden gönderin.</p></div>${close}</div><form id="visitor-form" class="form-grid"><label class="field full"><span>Misafir Adı Soyadı</span><span class="input-wrap">${dkdIcon('user',19)}<input name="guestName" required></span></label><label class="field"><span>Telefon</span><span class="input-wrap">${dkdIcon('phone',19)}<input name="guestPhone"></span></label><label class="field"><span>Plaka</span><span class="input-wrap">${dkdIcon('bike',19)}<input name="plate" style="text-transform:uppercase"></span></label><label class="field full"><span>Not</span><span class="input-wrap">${dkdIcon('rules',19)}<textarea name="note"></textarea></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="primary-btn" type="submit">${dkdIcon('key',18)} KOD OLUŞTUR</button></div></form></div></div>`;
  if (modal.type === 'rule') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Yeni Site Kuralı</h3><p>Kurye veya ziyaretçi geçişinde gösterilecek kuralı oluşturun.</p></div>${close}</div><form id="rule-form" class="form-grid"><label class="field full"><span>Başlık</span><span class="input-wrap">${dkdIcon('rules',19)}<input name="title" required></span></label><label class="field full"><span>Açıklama</span><span class="input-wrap">${dkdIcon('edit',19)}<textarea name="body" required></textarea></span></label><label class="field"><span>Hedef</span><span class="input-wrap"><select name="audience"><option value="all">Tümü</option><option value="courier">Kurye</option><option value="visitor">Ziyaretçi</option></select></span></label><label class="field"><span>Kapsam</span><span class="input-wrap"><select name="scopeType"><option value="site">Site</option><option value="gate">Kapı</option></select></span></label><label class="list-card full"><input type="checkbox" name="isCritical" style="accent-color:var(--red)"><span class="list-icon" style="--tone:#ff647c">${dkdIcon('alert',20)}</span><span class="list-copy"><strong>Kritik kural</strong><span>Geçiş öncesinde daha güçlü vurguyla gösterilir.</span></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="primary-btn" type="submit">KURALI KAYDET</button></div></form></div></div>`;
  if (modal.type === 'finance') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Finans Hareketi Ekle</h3><p>Site gelir veya gider kaydını oluşturun.</p></div>${close}</div><form id="finance-form" class="form-grid"><label class="field"><span>İşlem Türü</span><span class="input-wrap"><select name="type"><option value="income">Gelir</option><option value="expense">Gider</option></select></span></label><label class="field"><span>Tutar</span><span class="input-wrap">${dkdIcon('money',19)}<input name="amount" type="number" min="0.01" step="0.01" required></span></label><label class="field"><span>Kategori</span><span class="input-wrap"><input name="category" required placeholder="Aidat, bakım, personel..."></span></label><label class="field"><span>Tarih</span><span class="input-wrap">${dkdIcon('calendar',19)}<input name="date" type="date" required value="${new Date().toISOString().slice(0,10)}"></span></label><label class="field full"><span>Açıklama</span><span class="input-wrap">${dkdIcon('edit',19)}<textarea name="description" required></textarea></span></label><label class="list-card full"><input type="checkbox" name="visible" checked style="accent-color:var(--cyan)"><span class="list-icon" style="--tone:#45dbff">${dkdIcon('eye',20)}</span><span class="list-copy"><strong>Site sakinlerine göster</strong><span>Finans özeti sakin panelinde görünür.</span></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="primary-btn" type="submit">HAREKETİ EKLE</button></div></form></div></div>`;
  if (modal.type === 'dues') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Yeni Aidat Dönemi</h3><p>Seçili site için borç kayıtlarını oluşturun.</p></div>${close}</div><form id="dues-form" class="form-grid"><label class="field full"><span>Dönem Başlığı</span><span class="input-wrap">${dkdIcon('calendar',19)}<input name="title" required value="${new Date().toLocaleString('tr-TR',{month:'long',year:'numeric'})} Aidatı"></span></label><label class="field"><span>Yıl</span><span class="input-wrap"><input name="year" type="number" required value="${new Date().getFullYear()}"></span></label><label class="field"><span>Ay</span><span class="input-wrap"><input name="month" type="number" min="1" max="12" required value="${new Date().getMonth()+1}"></span></label><label class="field"><span>Son Ödeme</span><span class="input-wrap">${dkdIcon('calendar',19)}<input name="dueDate" type="date" required></span></label><label class="field"><span>Tutar</span><span class="input-wrap">${dkdIcon('money',19)}<input name="amount" type="number" min="0.01" step="0.01" required></span></label><label class="field"><span>Kapsam</span><span class="input-wrap"><select name="scopeType"><option value="site">Tüm Site</option><option value="block">Blok</option><option value="apartment">Daire</option></select></span></label><label class="field"><span>Blok (opsiyonel)</span><span class="input-wrap"><input name="scopeBlock"></span></label><label class="field"><span>Daire (opsiyonel)</span><span class="input-wrap"><input name="scopeApartment"></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="primary-btn" type="submit">AİDAT DÖNEMİNİ OLUŞTUR</button></div></form></div></div>`;
  if (modal.type === 'reject-pass') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Kurye Geçişini Reddet</h3><p>Kurye reddetme sebebini kendi ekranında görecek.</p></div>${close}</div><form id="reject-pass-form" class="form-grid"><input type="hidden" name="id" value="${modal.id}"><label class="field full"><span>Reddetme Sebebi</span><span class="input-wrap">${dkdIcon('alert',19)}<textarea name="reason" required></textarea></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="danger-btn" type="submit">GEÇİŞİ REDDET</button></div></form></div></div>`;
  if (modal.type === 'complete-pass') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Kodla Giriş Ver</h3><p>Kuryenin gösterdiği 6 haneli kodu bu geçişle eşleştirin.</p></div>${close}</div><form id="complete-pass-form" class="form-grid"><input type="hidden" name="id" value="${modal.id}"><label class="field full"><span>Tek Kullanımlık Kod</span><span class="input-wrap">${dkdIcon('key',19)}<input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required style="font-size:26px;letter-spacing:.18em;font-weight:950"></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="primary-btn" type="submit">KODU DOĞRULA</button></div></form></div></div>`;
  if (modal.type === 'reject-visitor') return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal"><div class="modal-head"><div><h3>Ziyaretçiyi Reddet</h3><p>Reddetme sebebini kayıt altına alın.</p></div>${close}</div><form id="reject-visitor-form" class="form-grid"><input type="hidden" name="code" value="${modal.code}"><label class="field full"><span>Reddetme Sebebi</span><span class="input-wrap">${dkdIcon('alert',19)}<textarea name="reason" required></textarea></span></label><div class="form-actions full"><button class="ghost-btn" type="button" data-action="close-modal">Vazgeç</button><button class="danger-btn" type="submit">ZİYARETÇİYİ REDDET</button></div></form></div></div>`;
  return '';
}

async function dkdHandleAuth(form) {
  const data = new FormData(form);
  const email = String(data.get('email') || '').trim().toLowerCase();
  const password = String(data.get('password') || '');
  if (!email || password.length < 6) return dkdToast('Eksik bilgi', 'Geçerli e-posta ve en az 6 karakter şifre gerekli.', 'error');
  dkdState.busy = true; dkdRender();
  try {
    if (dkdState.authMode === 'login') {
      const { error } = await dkdSupabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      dkdToast('Giriş başarılı', 'Premium paneliniz hazırlanıyor.', 'success');
      return;
    }
    const fullName = String(data.get('fullName') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (!fullName || !phone) throw new Error('Ad soyad ve telefon zorunludur.');
    const role = dkdState.registerRole;
    if (['security','resident'].includes(role) && !dkdState.selectedRegistrationSite) throw new Error('Başvuru yapılacak siteyi seçin.');
    const base = { full_name: fullName, phone, source_app: 'DraBornGate Web v2.0', signup_role: role };
    const metadata = role === 'courier' ? { ...base, delivery_platform: String(data.get('platform') || 'DraBornGo'), motorcycle_plate: String(data.get('plate') || '').trim().toUpperCase() } : role === 'management' ? { ...base, site_name: String(data.get('siteName') || '').trim(), site_address: String(data.get('siteAddress') || '').trim(), city: String(data.get('city') || '').trim() } : { ...base, selected_site_id: dkdState.selectedRegistrationSite.id, selected_site_name: dkdState.selectedRegistrationSite.name };
    const { data: signup, error } = await dkdSupabase.auth.signUp({ email, password, options: { data: metadata } });
    if (error) throw error;
    if (signup.session && role === 'management') await dkdRpc('dkd_gate_submit_management_application', { p_full_name: fullName, p_phone: phone, p_site_name: metadata.site_name, p_site_address: metadata.site_address, p_city: metadata.city });
    if (signup.session && ['security','resident'].includes(role)) await dkdRpc('dkd_gate_submit_site_role_application', { p_site_id: dkdState.selectedRegistrationSite.id, p_requested_role: role, p_full_name: fullName });
    dkdToast(signup.session ? 'Başvurunuz alındı' : 'E-postanızı doğrulayın', signup.session ? 'Onay sonrası rol paneliniz açılacak.' : 'Hesabınızı etkinleştirmek için e-posta doğrulamasını tamamlayın.', 'success');
    if (!signup.session) { dkdState.authMode = 'login'; dkdState.busy = false; dkdRender(); }
  } catch (error) { dkdToast('İşlem tamamlanamadı', dkdSafeError(error), 'error'); }
  finally { dkdState.busy = false; }
}

async function dkdSetRole(role) {
  if (!dkdState.roles.includes(role)) return dkdToast('Yetki yok', 'Bu rol hesabınıza tanımlı değil.', 'error');
  dkdState.busy = true; dkdRender();
  try {
    await dkdRpc('dkd_gate_set_preferred_role', { p_role: role });
    dkdState.role = role;
    dkdState.page = 'home';
    dkdState.report = null;
    await dkdRefresh({ silent: true });
    if (role === 'management') await dkdLoadManagementExtras();
    dkdToast('Rol değiştirildi', `${dkdRoleMeta[role].label} görünümü açıldı.`, 'success');
  } catch (error) { dkdToast('Rol değiştirilemedi', dkdSafeError(error), 'error'); }
  finally { dkdState.busy = false; dkdRender(); }
}

async function dkdSetPassStatus(id, status, reason = null, code = null) {
  dkdState.busy = true; dkdRender();
  try {
    await dkdRpc('dkd_gate_update_courier_pass_status_v2', { p_pass_id: id, p_status: status, p_rejection_reason: reason, p_code: code });
    dkdState.modal = null;
    dkdState.codeMatch = null;
    await dkdRefresh({ silent: true });
    dkdToast('Geçiş güncellendi', `Yeni durum: ${dkdStatusLabel(status)}`, 'success');
  } catch (error) { dkdToast('Geçiş güncellenemedi', dkdSafeError(error), 'error'); }
  finally { dkdState.busy = false; dkdRender(); }
}

async function dkdHandleSubmit(form) {
  const data = new FormData(form);
  if (form.id === 'auth-form') return dkdHandleAuth(form);
  if (form.id === 'courier-code-form') {
    const code = String(data.get('code') || '').replace(/\D/g,'').slice(0,6);
    if (code.length !== 6) return dkdToast('6 haneli kod gerekli', 'Kuryenin verdiği tek kullanımlık kodu girin.', 'error');
    dkdState.busy = true; dkdRender();
    try {
      const result = await dkdRpc('dkd_gate_lookup_courier_by_code', { p_code: code });
      const id = typeof result === 'string' ? result : Array.isArray(result) ? result[0]?.id || result[0] : result?.id;
      await dkdRefresh({ silent: true });
      dkdState.codeMatch = dkdState.data.passes.find((item) => item.id === id) || null;
      if (!dkdState.codeMatch) throw new Error('Kod yanlış, kullanılmış veya kurye henüz kapıya gelmemiş olabilir.');
      dkdToast('Kurye bulundu', 'Kod aktif geçiş kaydıyla eşleşti.', 'success');
    } catch (error) { dkdState.codeMatch = null; dkdToast('Kurye bulunamadı', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'create-pass-form') {
    dkdState.busy = true; dkdRender();
    try {
      const siteId = String(data.get('siteId'));
      const gateId = String(data.get('gateId'));
      const gate = dkdState.data.gates.find((item) => item.id === gateId);
      await dkdRpc('dkd_gate_create_courier_pass_v2', {
        p_site_id: siteId, p_gate_id: gateId, p_gate: gate?.name || 'Ana Kapı', p_customer_name: String(data.get('customerName') || '').trim(), p_address_text: String(data.get('addressText') || '').trim(), p_block: String(data.get('block') || '').trim(), p_floor: String(data.get('floor') || '').trim(), p_apartment: String(data.get('apartment') || '').trim(), p_order_number: String(data.get('orderNumber') || '').trim(), p_note: String(data.get('note') || '').trim(), p_screenshot_url: null, p_ocr_text: null, p_ocr_payload: {}, p_eta_minutes: Number(data.get('etaMinutes') || 6), p_rules_version: null, p_rules_accepted: data.get('rulesAccepted') === 'on'
      });
      await dkdRefresh({ silent: true });
      dkdState.page = 'home';
      dkdToast('Geçiş talebi gönderildi', 'Güvenlik ekranına anında iletildi.', 'success');
    } catch (error) { dkdToast('Talep oluşturulamadı', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'visitor-form') {
    dkdState.busy = true; dkdRender();
    try {
      const resident = dkdCurrentResident();
      const result = await dkdRpc('dkd_gate_create_visitor_pass', { p_site_id: resident?.site_id || resident?.siteId || dkdState.activeSiteId, p_guest_name: String(data.get('guestName') || '').trim(), p_guest_phone: String(data.get('guestPhone') || '').trim() || null, p_plate: String(data.get('plate') || '').trim().toUpperCase() || null, p_note: String(data.get('note') || '').trim() || null });
      dkdState.modal = null;
      await dkdRefresh({ silent: true });
      dkdToast('Misafir kodu hazır', `Kod: ${result?.code || result?.visitor_code || 'oluşturuldu'}`, 'success');
    } catch (error) { dkdToast('Misafir oluşturulamadı', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'rule-form') {
    dkdState.busy = true; dkdRender();
    try {
      await dkdRpc('dkd_gate_upsert_rule', { p_site_id: dkdState.activeSiteId, p_gate_id: null, p_audience: String(data.get('audience') || 'all'), p_scope_type: String(data.get('scopeType') || 'site'), p_title: String(data.get('title') || '').trim(), p_body: String(data.get('body') || '').trim(), p_starts_at: new Date().toISOString(), p_ends_at: null, p_is_critical: data.get('isCritical') === 'on', p_existing_rule_id: null });
      dkdState.modal = null; await dkdRefresh({ silent: true }); dkdToast('Kural kaydedildi', 'Yeni kural geçiş sistemine eklendi.', 'success');
    } catch (error) { dkdToast('Kural kaydedilemedi', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'finance-form') {
    dkdState.busy = true; dkdRender();
    try {
      await dkdRpc('dkd_gate_add_finance_transaction', { p_site_id: dkdState.activeSiteId, p_type: String(data.get('type')), p_category: String(data.get('category')).trim(), p_description: String(data.get('description')).trim(), p_amount: Number(data.get('amount')), p_date: String(data.get('date')), p_visible: data.get('visible') === 'on' });
      dkdState.modal = null; await dkdRefresh({ silent: true }); dkdToast('Finans hareketi eklendi', 'Gelir-gider kaydı güncellendi.', 'success');
    } catch (error) { dkdToast('Finans hareketi eklenemedi', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'dues-form') {
    dkdState.busy = true; dkdRender();
    try {
      await dkdRpc('dkd_gate_create_dues_period', { p_site_id: dkdState.activeSiteId, p_title: String(data.get('title')).trim(), p_year: Number(data.get('year')), p_month: Number(data.get('month')), p_due_date: String(data.get('dueDate')), p_scope_type: String(data.get('scopeType')), p_scope_block: String(data.get('scopeBlock') || '').trim() || null, p_scope_apartment: String(data.get('scopeApartment') || '').trim() || null, p_amount: Number(data.get('amount')) });
      dkdState.modal = null; await dkdRefresh({ silent: true }); dkdToast('Aidat dönemi oluşturuldu', 'Borç kayıtları hazırlandı.', 'success');
    } catch (error) { dkdToast('Aidat oluşturulamadı', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'reject-pass-form') return dkdSetPassStatus(String(data.get('id')), 'rejected', String(data.get('reason')).trim(), null);
  if (form.id === 'complete-pass-form') return dkdSetPassStatus(String(data.get('id')), 'completed', null, String(data.get('code')).trim());
  if (form.id === 'reject-visitor-form') {
    dkdState.busy = true; dkdRender();
    try { await dkdRpc('dkd_gate_decide_visitor_pass', { p_code: String(data.get('code')), p_status: 'rejected', p_rejection_reason: String(data.get('reason')).trim() }); dkdState.modal = null; await dkdRefresh({ silent: true }); dkdToast('Ziyaretçi reddedildi', 'Karar kayıt altına alındı.', 'success'); }
    catch (error) { dkdToast('İşlem yapılamadı', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (form.id === 'resident-search-form') {
    dkdState.residentQuery = String(data.get('query') || '').trim();
    await dkdLoadManagementExtras(); dkdRender();
  }
}

async function dkdHandleClick(button) {
  const action = button.dataset.action;
  if (!action) return;
  if (action === 'auth-mode') { dkdState.authMode = button.dataset.mode; dkdRender(); return; }
  if (action === 'register-role') { dkdState.registerRole = button.dataset.role; dkdState.registrationSites = []; dkdState.selectedRegistrationSite = null; dkdRender(); return; }
  if (action === 'search-registration-sites') {
    const query = document.querySelector('#registration-site-query')?.value?.trim() || '';
    if (query.length < 2) return dkdToast('En az 2 harf yazın', 'Site adını aramak için biraz daha bilgi gerekli.', 'error');
    try { dkdState.registrationSites = dkdArray(await dkdRpc('dkd_gate_search_registration_sites', { p_query: query })); dkdRender(); }
    catch (error) { dkdToast('Site aranamadı', dkdSafeError(error), 'error'); }
    return;
  }
  if (action === 'select-registration-site') { dkdState.selectedRegistrationSite = dkdState.registrationSites.find((site) => site.id === button.dataset.siteId) || null; dkdRender(); return; }
  if (action === 'toggle-drawer') { dkdState.drawerOpen = !dkdState.drawerOpen; dkdRender(); return; }
  if (action === 'close-drawer') { dkdState.drawerOpen = false; dkdRender(); return; }
  if (action === 'nav') {
    const page = button.dataset.page;
    if (page === 'notifications' && !dkdNavItems().some((item) => item[0] === 'notifications') && dkdState.role !== 'resident') {
      dkdState.page = 'notifications';
    } else dkdState.page = page;
    dkdState.drawerOpen = false;
    if (dkdState.role === 'management' && ['applications','residents'].includes(page)) await dkdLoadManagementExtras();
    if (dkdState.role === 'management' && page === 'reports') { dkdState.report = null; void dkdLoadReport(); }
    dkdRender(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }
  if (action === 'refresh') { await dkdRefresh(); return; }
  if (action === 'logout') { await dkdSupabase.auth.signOut(); return; }
  if (action === 'switch-role') { await dkdSetRole(button.dataset.role); return; }
  if (action === 'site-select') return;
  if (action === 'report-range') { dkdState.reportRange = button.dataset.range; dkdState.report = null; await dkdLoadReport(); return; }
  if (action === 'open-modal') { dkdState.modal = { type: button.dataset.modal }; dkdRender(); return; }
  if (action === 'close-modal' || action === 'modal-backdrop' && button.classList.contains('modal-backdrop')) { dkdState.modal = null; dkdRender(); return; }
  if (action === 'open-reject-pass') { dkdState.modal = { type: 'reject-pass', id: button.dataset.id }; dkdRender(); return; }
  if (action === 'open-complete-pass') { dkdState.modal = { type: 'complete-pass', id: button.dataset.id }; dkdRender(); return; }
  if (action === 'open-reject-visitor') { dkdState.modal = { type: 'reject-visitor', code: button.dataset.code }; dkdRender(); return; }
  if (action === 'pass-status') { await dkdSetPassStatus(button.dataset.id, button.dataset.status); return; }
  if (action === 'visitor-status') {
    dkdState.busy = true; dkdRender();
    try { await dkdRpc('dkd_gate_decide_visitor_pass', { p_code: button.dataset.code, p_status: button.dataset.status, p_rejection_reason: null }); await dkdRefresh({ silent: true }); dkdToast('Ziyaretçi güncellendi', `Yeni durum: ${dkdStatusLabel(button.dataset.status)}`, 'success'); }
    catch (error) { dkdToast('İşlem yapılamadı', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (action === 'decide-application') {
    dkdState.busy = true; dkdRender();
    try { await dkdRpc('dkd_gate_decide_site_role_application', { p_application_id: button.dataset.id, p_status: button.dataset.status, p_admin_note: null }); await Promise.all([dkdLoadManagementExtras(), dkdRefresh({ silent: true })]); dkdToast('Başvuru güncellendi', `Yeni durum: ${dkdStatusLabel(button.dataset.status)}`, 'success'); }
    catch (error) { dkdToast('Başvuru güncellenemedi', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
    return;
  }
  if (action === 'reload-management-extras') { await dkdLoadManagementExtras(); dkdRender(); return; }
  if (action === 'mark-due-paid') {
    try { await dkdRpc('dkd_gate_mark_due_paid', { p_charge_id: button.dataset.id, p_paid: true, p_note: 'Web v2.0 yönetim panelinden ödendi işaretlendi.' }); await dkdRefresh({ silent: true }); dkdToast('Aidat güncellendi', 'Kayıt ödendi olarak işaretlendi.', 'success'); }
    catch (error) { dkdToast('Aidat güncellenemedi', dkdSafeError(error), 'error'); }
    return;
  }
  if (action === 'read-notification') { try { await dkdRpc('dkd_gate_mark_notification_read', { p_notification_id: button.dataset.id }); await dkdRefresh({ silent: true }); } catch {} return; }
  if (action === 'mark-all-read') { try { await dkdRpc('dkd_gate_mark_all_notifications_read'); await dkdRefresh({ silent: true }); dkdToast('Bildirimler okundu', 'Tüm kayıtlar güncellendi.', 'success'); } catch (error) { dkdToast('İşlem yapılamadı', dkdSafeError(error), 'error'); } return; }
  if (action === 'copy-code') { await navigator.clipboard.writeText(button.dataset.code || ''); dkdToast('Kod kopyalandı', button.dataset.code || '', 'success'); return; }
  if (action === 'copy-link') { await navigator.clipboard.writeText(dkdPersonalLink()); dkdToast('Bağlantı kopyalandı', 'Kişisel web adresiniz panoya alındı.', 'success'); return; }
  if (action === 'copy-phone') { if (button.dataset.phone) await navigator.clipboard.writeText(button.dataset.phone); dkdToast('Telefon kopyalandı', button.dataset.phone || 'Numara yok', 'success'); return; }
  if (action === 'focus-code') { document.querySelector('#courier-code-wrap input')?.focus(); document.querySelector('#courier-code-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  if (action === 'courier-location') { await dkdCheckCourierLocation(button.dataset.id); return; }
  if (action === 'export-report') { await dkdExportReport(); return; }
}

async function dkdCheckCourierLocation(passId) {
  const pass = dkdState.data.passes.find((item) => item.id === passId);
  const gate = dkdState.data.gates.find((item) => item.id === (pass?.gate_id || pass?.gateId));
  if (!navigator.geolocation) return dkdToast('Konum desteklenmiyor', 'Tarayıcınız konum API desteği sunmuyor.', 'error');
  if (gate?.latitude == null || gate?.longitude == null) return dkdToast('Kapı koordinatı yok', 'Seçilen kapının konumu tanımlanmamış.', 'error');
  dkdState.busy = true; dkdRender();
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const rad = Math.PI / 180;
      const dLat = (Number(gate.latitude) - latitude) * rad;
      const dLon = (Number(gate.longitude) - longitude) * rad;
      const a = Math.sin(dLat/2)**2 + Math.cos(latitude*rad) * Math.cos(Number(gate.latitude)*rad) * Math.sin(dLon/2)**2;
      const distance = Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
      await dkdRpc('dkd_gate_update_airpass', { p_pass_id: passId, p_latitude: latitude, p_longitude: longitude, p_distance_m: distance, p_send: true });
      await dkdRefresh({ silent: true });
      dkdToast('Konum güvenliğe gönderildi', `${distance} metre mesafe tek sefer kontrol edildi.`, 'success');
    } catch (error) { dkdToast('Konum gönderilemedi', dkdSafeError(error), 'error'); }
    finally { dkdState.busy = false; dkdRender(); }
  }, (error) => { dkdState.busy = false; dkdRender(); dkdToast('Konum alınamadı', error.message || 'Konum izni gerekli.', 'error'); }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 });
}

async function dkdExportReport() {
  if (!dkdState.report) return dkdToast('Rapor hazır değil', 'Önce rapor verilerinin yüklenmesini bekleyin.', 'error');
  try {
    const result = await dkdRpc('dkd_gate_prepare_report_export', { p_site_id: dkdState.activeSiteId, p_date_from: dkdState.report.date_from, p_date_to: dkdState.report.date_to });
    const csv = result?.csv || String(result || '');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `DraBornGate-${dkdSlug(dkdActiveSite()?.name)}-${new Date().toISOString().slice(0,10)}.csv`; link.click();
    URL.revokeObjectURL(url);
    dkdToast('Rapor indirildi', 'CSV dosyası hazırlandı.', 'success');
  } catch (error) { dkdToast('Rapor indirilemedi', dkdSafeError(error), 'error'); }
}

document.addEventListener('submit', (event) => { const form = event.target.closest('form'); if (!form) return; event.preventDefault(); void dkdHandleSubmit(form); });
document.addEventListener('click', (event) => { const button = event.target.closest('[data-action]'); if (!button) return; if (button.dataset.action === 'modal-backdrop' && event.target !== button) return; void dkdHandleClick(button); });
document.addEventListener('change', async (event) => {
  const target = event.target;
  if (target.matches('[data-action="site-select"]')) {
    dkdState.activeSiteId = target.value;
    dkdState.report = null;
    if (dkdState.role === 'management') await dkdLoadManagementExtras();
    dkdRender();
  }
  if (target.matches('[data-action="create-site-select"]')) {
    dkdState.activeSiteId = target.value;
    dkdRender();
  }
});

async function dkdInit() {
  try {
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('./sw.js?v=2.0.0').catch(() => undefined);
    const { data, error } = await dkdSupabase.auth.getSession();
    if (error) throw error;
    await dkdBootstrapSession(data.session);
    dkdSupabase.auth.onAuthStateChange((_event, session) => { if (session?.access_token !== dkdState.session?.access_token) void dkdBootstrapSession(session); });
  } catch (error) {
    dkdState.loading = false;
    dkdRoot.innerHTML = `<div class="boot-shell"><div class="boot-logo"><span>!</span></div><div class="boot-copy"><strong>Web paneli açılamadı</strong><span>${dkdEsc(dkdSafeError(error))}</span></div><button class="primary-btn" onclick="location.reload()">Tekrar Dene</button></div>`;
  }
}

void dkdInit();
