import { api } from './api-client.js';

const app = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const toastRoot = document.getElementById('toast-root');
const config = window.DRABORN_CONFIG;

let state;
let currentView = 'overview';
let customerSearch = '';
let appointmentFilter = 'all';
let selectedCustomerId = null;
let integrationStatus = null;

const navGroups = [
  {
    label: 'Yönetim',
    items: [
      ['overview', '⌂', 'Genel Bakış'],
      ['calendar', '▦', 'Takvim'],
      ['appointments', '◷', 'Randevular'],
      ['customers', '◎', 'Müşteriler'],
      ['leads', '◇', 'CRM & Satış']
    ]
  },
  {
    label: 'Operasyon',
    items: [
      ['services', '✦', 'Hizmetler & Paketler'],
      ['team', '♙', 'Ekip & Vardiya'],
      ['messages', '◉', 'WhatsApp & Mesajlar'],
      ['stock', '▣', 'Stok & Ürünler'],
      ['finance', '₺', 'Kasa & Ödemeler']
    ]
  },
  {
    label: 'Analiz',
    items: [
      ['reports', '↗', 'Raporlar'],
      ['settings', '⚙', 'Ayarlar & Entegrasyon']
    ]
  }
];

const statusMap = {
  pending: ['Bekliyor', 'warning'],
  confirmed: ['Onaylandı', 'info'],
  waiting: ['Müşteri Geldi', 'purple'],
  in_progress: ['İşlemde', 'orange'],
  completed: ['Tamamlandı', 'success'],
  cancelled: ['İptal', 'danger'],
  no_show: ['Gelmedi', 'danger'],
  sent: ['Gönderildi', 'info'],
  delivered: ['Teslim Edildi', 'purple'],
  read: ['Okundu', 'success'],
  scheduled: ['Planlandı', 'warning'],
  not_scheduled: ['Planlanmadı', 'neutral'],
  not_required: ['Gerekli Değil', 'neutral'],
  active: ['Aktif', 'success'],
  dormant: ['Pasifleşen', 'warning'],
  draft: ['Taslak', 'neutral'],
  approved: ['Onaylandı', 'success'],
  won: ['Kazanıldı', 'success'],
  new: ['Yeni', 'info'],
  contacted: ['İletişimde', 'purple'],
  proposal: ['Teklif', 'orange'],
  lost: ['Kaybedildi', 'danger'],
  open: ['Açık', 'warning'],
  done: ['Tamamlandı', 'success'],
  paid: ['Ödendi', 'success'],
  partial: ['Kısmi', 'warning'],
  deposit: ['Kapora', 'purple'],
  low: ['Kritik', 'danger'],
  ok: ['Yeterli', 'success']
};

const appointmentStatuses = ['pending', 'confirmed', 'waiting', 'in_progress', 'completed', 'cancelled', 'no_show'];

const escapeHTML = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const formatMoney = (amount = 0) => new Intl.NumberFormat('tr-TR', {
  style: 'currency', currency: 'TRY', maximumFractionDigits: 0
}).format(Number(amount) || 0);

const formatDate = (value, options = { day: '2-digit', month: 'short' }) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('tr-TR', options).format(new Date(value));
};

const formatDateTime = (value) => formatDate(value, {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
});

const formatTime = (value) => new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit', minute: '2-digit'
}).format(new Date(value));

const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const customerById = (id) => state.customers.find((item) => item.id === id);
const serviceById = (id) => state.services.find((item) => item.id === id);
const staffById = (id) => state.team.find((item) => item.id === id);

function badge(status, customText) {
  const [label, tone] = statusMap[status] || [customText || status || 'Bilinmiyor', 'neutral'];
  return `<span class="badge badge-${tone}">${escapeHTML(customText || label)}</span>`;
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function avatar(name, color = '#8b5cf6', size = '') {
  return `<span class="avatar ${size}" style="--avatar:${color}">${escapeHTML(initials(name))}</span>`;
}

function toast(message, tone = 'success') {
  const element = document.createElement('div');
  element.className = `toast toast-${tone}`;
  element.innerHTML = `<span>${tone === 'success' ? '✓' : tone === 'danger' ? '!' : 'i'}</span><p>${escapeHTML(message)}</p>`;
  toastRoot.appendChild(element);
  requestAnimationFrame(() => element.classList.add('show'));
  setTimeout(() => {
    element.classList.remove('show');
    setTimeout(() => element.remove(), 250);
  }, 3200);
}

function modal(title, body, size = '') {
  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <section class="modal ${size}" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}" data-modal-panel>
        <header class="modal-header">
          <div><span class="eyebrow">DraBornTest</span><h2>${escapeHTML(title)}</h2></div>
          <button class="icon-btn" data-action="close-modal" aria-label="Kapat">×</button>
        </header>
        <div class="modal-body">${body}</div>
      </section>
    </div>`;
  document.body.classList.add('modal-open');
}

function closeModal() {
  modalRoot.innerHTML = '';
  document.body.classList.remove('modal-open');
}

function setHash(path) {
  window.location.hash = path;
}

function route() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'landing') {
    renderLanding();
    return;
  }
  if (hash.startsWith('dashboard')) {
    const view = hash.split('/')[1];
    if (view) currentView = view;
    renderDashboard();
    return;
  }
  renderLanding();
}

function renderLanding() {
  document.body.className = 'landing-body';
  const modules = [
    ['Müşteri CRM', 'Tek ekranda kişi kartı, ziyaret geçmişi, notlar, etiketler, izinler, borç ve yaşam boyu değer.'],
    ['Akıllı Randevu', 'Takvim, ekip uygunluğu, çakışma önleme, tekrar eden randevu, bekleme listesi ve durum akışı.'],
    ['WhatsApp Otomasyonu', 'Onay, hatırlatma, iptal sonrası takip, doğum günü ve geri kazanım şablonları.'],
    ['Satış Takibi', 'Potansiyel müşteri panosu, görevler, teklif aşamaları, kaynak ve dönüşüm analizi.'],
    ['Ekip & Vardiya', 'Çalışma saatleri, izinler, doluluk, performans, hizmet yetkileri ve komisyon hazırlığı.'],
    ['Kasa & Raporlar', 'Gelir, ön ödeme, borç, ödeme yöntemi, hizmet performansı ve dışa aktarma.']
  ];

  app.innerHTML = `
    <div class="landing-shell">
      <nav class="landing-nav">
        <a class="brand" href="#landing" aria-label="DraBornTest ana sayfa">
          <span class="brand-mark">D</span>
          <span><strong>DraBornTest</strong><small>SMART BUSINESS CRM</small></span>
        </a>
        <div class="landing-links">
          <a href="#features">Özellikler</a><a href="#sectors">Sektörler</a><a href="#pricing">Paketler</a><a href="#faq">SSS</a>
        </div>
        <div class="nav-actions">
          <button class="btn btn-ghost" data-action="open-demo">Demo Giriş</button>
          <button class="btn btn-primary" data-action="open-demo">Ücretsiz Dene <span>→</span></button>
        </div>
      </nav>

      <main>
        <section class="hero">
          <div class="hero-glow hero-glow-one"></div><div class="hero-glow hero-glow-two"></div>
          <div class="hero-content">
            <span class="hero-chip"><i></i> Küçük işletmeler için tak-çalıştır SaaS</span>
            <h1>Randevudan gelire,<br><em>işletmen tek panelde.</em></h1>
            <p>Kuaförler, güzellik salonları, özel ders merkezleri ve randevuyla çalışan tüm küçük işletmeler için müşteri CRM’i, takvim, WhatsApp hatırlatmaları, satış ve raporlama.</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-xl" data-action="open-demo">Canlı Demoyu Aç <span>↗</span></button>
              <a class="btn btn-soft btn-xl" href="#features">Özellikleri İncele</a>
            </div>
            <div class="hero-proof">
              <span>✓ Kredi kartı gerekmez</span><span>✓ Kurulum gerektirmez</span><span>✓ Demo veriler hazır</span>
            </div>
          </div>
          <div class="hero-product">
            <div class="product-window">
              <div class="product-bar"><span></span><span></span><span></span><b>app.draborntest.demo</b></div>
              <div class="product-grid">
                <aside><div class="mini-logo">D</div>${['Genel Bakış','Takvim','Randevular','Müşteriler','WhatsApp','Raporlar'].map((x,i)=>`<div class="mini-nav ${i===0?'active':''}"><i></i>${x}</div>`).join('')}</aside>
                <section>
                  <div class="mini-top"><div><small>Günaydın, Demo Yönetici</small><h3>Bugünün özeti</h3></div><button>+ Randevu</button></div>
                  <div class="mini-stats"><div><small>Bugünkü Ciro</small><b>₺8.150</b><em>+18%</em></div><div><small>Randevu</small><b>6</b><em>5 onaylı</em></div><div><small>Yeni Müşteri</small><b>12</b><em>bu ay</em></div></div>
                  <div class="mini-panels"><div class="mini-chart"><h4>Haftalık Gelir</h4><div class="bars">${[34,58,48,72,66,90,78].map((h,i)=>`<i style="height:${h}%"><span>${['P','S','Ç','P','C','C','P'][i]}</span></i>`).join('')}</div></div><div class="mini-list"><h4>Sıradaki Randevular</h4>${state.appointments.filter(a=>a.start.slice(0,10)===todayISO()).slice(0,3).map(a=>`<div><b>${formatTime(a.start)}</b><span>${escapeHTML(customerById(a.customerId)?.name || '')}</span><i></i></div>`).join('')}</div></div>
                </section>
              </div>
            </div>
            <div class="floating-card floating-one"><span>WhatsApp</span><b>Hatırlatma okundu ✓✓</b></div>
            <div class="floating-card floating-two"><span>Bugün</span><b>₺8.150 gelir</b></div>
          </div>
        </section>

        <section class="trust-strip"><span>KUAFÖR</span><span>GÜZELLİK SALONU</span><span>ÖZEL DERS</span><span>DANIŞMANLIK</span><span>STÜDYO</span><span>KLİNİK</span></section>

        <section class="section" id="features">
          <div class="section-heading"><span class="eyebrow">TEK PANEL, TAM KONTROL</span><h2>İşletme yönetiminin en geniş kapsamlı hali</h2><p>Dağınık defterler, Excel tabloları ve mesaj trafiği yerine günlük operasyonu tek merkezde toplayan modüler yapı.</p></div>
          <div class="feature-grid">${modules.map((item,index)=>`<article class="feature-card"><span class="feature-number">0${index+1}</span><h3>${item[0]}</h3><p>${item[1]}</p><button data-action="open-demo">Demoda gör →</button></article>`).join('')}</div>
        </section>

        <section class="section sectors" id="sectors">
          <div class="section-heading left"><span class="eyebrow">SEKTÖRÜNE UYARLANIR</span><h2>Aynı güçlü altyapı,<br>işletmene özel kullanım.</h2></div>
          <div class="sector-grid">
            <article><span>✂</span><div><h3>Kuaför & Berber</h3><p>Usta takvimi, işlem süresi, ürün kullanımı, müşteri tercihi ve tekrar ziyaret takibi.</p></div></article>
            <article><span>✦</span><div><h3>Güzellik Salonu</h3><p>Seans paketleri, kalan haklar, uzman uygunluğu, ön ödeme ve bakım notları.</p></div></article>
            <article><span>⌁</span><div><h3>Özel Ders & Eğitim</h3><p>Ders paketleri, eğitmen programı, tekrar eden randevu, yoklama ve ödeme takibi.</p></div></article>
            <article><span>＋</span><div><h3>Diğer Randevulu İşletmeler</h3><p>Danışmanlık, klinik, stüdyo, bakım merkezi ve hizmet işletmeleri için esnek yapı.</p></div></article>
          </div>
        </section>

        <section class="section workflow">
          <div class="section-heading"><span class="eyebrow">NASIL ÇALIŞIR?</span><h2>Bugün dene, yarın gerçek veriye bağla</h2></div>
          <div class="steps">
            <article><b>1</b><h3>İşletmeni ayarla</h3><p>Şube, ekip, çalışma saatleri, hizmetler ve randevu kurallarını tanımla.</p></article>
            <article><b>2</b><h3>Müşterilerini yönet</h3><p>Yeni müşteri ekle, geçmişini gör, segmentle ve takip görevleri oluştur.</p></article>
            <article><b>3</b><h3>Otomasyonu aç</h3><p>Meta WhatsApp Cloud API ve diğer anahtarları ekleyerek gerçek mesajları gönder.</p></article>
          </div>
        </section>

        <section class="section pricing" id="pricing">
          <div class="section-heading"><span class="eyebrow">ŞEFFAF PAKETLER</span><h2>İşletmen büyüdükçe büyüyen yapı</h2><p>Bu demo fiyatlandırma ekranıdır; ödeme sistemi bağlı değildir.</p></div>
          <div class="pricing-grid">
            <article><span>Başlangıç</span><h3>₺0<small>/ demo</small></h3><p>Tek şube, demo veriler, CRM ve randevu testi.</p><button class="btn btn-soft" data-action="open-demo">Demoyu Aç</button></article>
            <article class="popular"><em>ÖNERİLEN</em><span>Profesyonel</span><h3>₺749<small>/ ay</small></h3><p>WhatsApp otomasyonu, ekip, raporlar ve paket yönetimi.</p><button class="btn btn-primary" data-action="open-demo">Paneli İncele</button></article>
            <article><span>Çok Şubeli</span><h3>Özel<small> teklif</small></h3><p>Çoklu şube, gelişmiş roller, merkezi rapor ve entegrasyonlar.</p><button class="btn btn-soft" data-action="open-demo">Özellikleri Gör</button></article>
          </div>
        </section>

        <section class="section faq" id="faq">
          <div class="section-heading left"><span class="eyebrow">SIK SORULANLAR</span><h2>Demo hakkında</h2></div>
          <div class="faq-list">
            <details open><summary>Veriler gerçek mi?</summary><p>Hayır. Tüm müşteri, randevu, ödeme ve mesaj kayıtları örnek amaçlıdır. Tarayıcı localStorage alanında saklanır.</p></details>
            <details><summary>WhatsApp mesajı gerçekten gider mi?</summary><p>Demo modunda yalnızca gönderim simülasyonu yapılır. Meta Cloud API anahtarları sunucuya eklendiğinde gerçek gönderime hazır servis katmanı devreye alınabilir.</p></details>
            <details><summary>Başka sektörlerde kullanılabilir mi?</summary><p>Evet. Hizmet, süre, ekip, paket ve randevu kuralları değiştirilebilir olduğu için randevuyla çalışan birçok küçük işletmeye uyarlanabilir.</p></details>
          </div>
        </section>

        <section class="final-cta"><div><span class="eyebrow">DraBornTest CRM</span><h2>İşletmenin kontrol panelini şimdi keşfet.</h2><p>Hazır demo verilerle tüm akışları deneyebilirsin.</p></div><button class="btn btn-primary btn-xl" data-action="open-demo">Canlı Demoyu Aç →</button></section>
      </main>
      <footer><a class="brand" href="#landing"><span class="brand-mark">D</span><span><strong>DraBornTest</strong><small>DEMO SAAS CRM</small></span></a><p>© 2026 DrabornEagle. Demo uygulama — gerçek müşteri verisi içermez.</p><button data-action="open-demo">Dashboard</button></footer>
    </div>`;
}

function renderDashboard() {
  document.body.className = 'dashboard-body';
  const unread = state.notifications.filter((item) => !item.read).length;
  app.innerHTML = `
    <div class="dashboard-shell">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-head">
          <a class="brand compact" href="#landing"><span class="brand-mark">D</span><span><strong>DraBornTest</strong><small>CRM & RANDEVU</small></span></a>
          <button class="icon-btn mobile-only" data-action="toggle-sidebar">×</button>
        </div>
        <div class="business-switcher"><span>NS</span><div><strong>${escapeHTML(state.business.name)}</strong><small>${escapeHTML(state.business.branches[0].name)}</small></div><button>⌄</button></div>
        <nav class="sidebar-nav">${navGroups.map(group=>`<div class="nav-group"><small>${group.label}</small>${group.items.map(([id,icon,label])=>`<button class="nav-item ${currentView===id?'active':''}" data-view="${id}"><span>${icon}</span>${label}${id==='messages'?'<em>'+state.messageLogs.filter(m=>m.status==='sent').length+'</em>':''}</button>`).join('')}</div>`).join('')}</nav>
        <div class="sidebar-demo"><span>DEMO MODU</span><p>Veriler yalnızca test amaçlıdır.</p><button data-action="reset-demo">Demo veriyi sıfırla</button></div>
        <div class="sidebar-user">${avatar(state.currentUser.name,'#8b5cf6')}<div><strong>${escapeHTML(state.currentUser.name)}</strong><small>${escapeHTML(state.currentUser.role)}</small></div><button>⋮</button></div>
      </aside>
      <div class="dashboard-main">
        <header class="topbar">
          <div class="topbar-left"><button class="icon-btn mobile-only" data-action="toggle-sidebar">☰</button><div class="breadcrumb"><span>${viewTitle(currentView)}</span><small>${formatDate(new Date(), {weekday:'long', day:'2-digit', month:'long', year:'numeric'})}</small></div></div>
          <div class="topbar-actions"><button class="search-button" data-action="focus-global-search"><span>⌕</span><i>Hızlı ara...</i><kbd>⌘ K</kbd></button><button class="icon-btn notify" data-action="show-notifications">♧${unread?`<b>${unread}</b>`:''}</button><button class="btn btn-primary" data-action="new-appointment">+ Yeni Randevu</button></div>
        </header>
        <main class="content" id="dashboard-content">${renderView()}</main>
      </div>
    </div>`;
}

function viewTitle(view) {
  const item = navGroups.flatMap(group => group.items).find(([id]) => id === view);
  return item?.[2] || 'Dashboard';
}

function renderView() {
  const renderers = {
    overview: renderOverview,
    calendar: renderCalendar,
    appointments: renderAppointments,
    customers: renderCustomers,
    leads: renderLeads,
    services: renderServices,
    team: renderTeam,
    messages: renderMessages,
    stock: renderStock,
    finance: renderFinance,
    reports: renderReports,
    settings: renderSettings
  };
  return (renderers[currentView] || renderOverview)();
}

function pageHeader(kicker, title, description, actions = '') {
  return `<div class="page-header"><div><span class="eyebrow">${escapeHTML(kicker)}</span><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p></div><div class="page-actions">${actions}</div></div>`;
}

function renderOverview() {
  const today = todayISO();
  const todayAppointments = state.appointments.filter(item => item.start.slice(0, 10) === today).sort((a,b)=>a.start.localeCompare(b.start));
  const todayRevenue = todayAppointments.reduce((sum, item) => sum + (item.paid || 0), 0);
  const monthPrefix = today.slice(0, 7);
  const monthRevenue = state.payments.filter(item => item.paidAt.startsWith(monthPrefix)).reduce((sum,item)=>sum+item.amount,0);
  const activeCustomers = state.customers.filter(item => item.status === 'active').length;
  const noShowCount = state.appointments.filter(item => item.status === 'no_show').length;
  const openTasks = state.tasks.filter(item => item.status === 'open').slice(0, 4);
  const bars = [58,74,62,89,68,96,82];

  return `
    ${pageHeader('OPERASYON MERKEZİ', `Günaydın, ${state.currentUser.name.split(' ')[0]} 👋`, 'Bugünkü randevular, gelir ve yapılacaklar burada.', `<button class="btn btn-soft" data-action="export-data">Veriyi Dışa Aktar</button><button class="btn btn-primary" data-action="new-customer">+ Müşteri Ekle</button>`)}
    <section class="stats-grid">
      ${statCard('Bugünkü Tahsilat', formatMoney(todayRevenue), '+18%', 'Önceki güne göre', '₺', 'green')}
      ${statCard('Bugünkü Randevu', todayAppointments.length, `${todayAppointments.filter(a=>a.status==='confirmed').length} onaylı`, `${todayAppointments.filter(a=>a.status==='completed').length} tamamlandı`, '◷', 'purple')}
      ${statCard('Bu Ay Gelir', formatMoney(monthRevenue), '+12%', 'Aylık hedefin %68’i', '↗', 'blue')}
      ${statCard('Aktif Müşteri', activeCustomers, '+3 yeni', 'Bu ay kazanılan', '◎', 'orange')}
    </section>

    <section class="overview-grid">
      <article class="panel chart-panel">
        <header><div><h2>Gelir Görünümü</h2><p>Son 7 günün demo performansı</p></div><select><option>Son 7 gün</option><option>Bu ay</option></select></header>
        <div class="revenue-total"><strong>${formatMoney(monthRevenue + 48250)}</strong><span>+14,8% büyüme</span></div>
        <div class="bar-chart">${bars.map((height,index)=>`<div class="bar-column"><div class="bar-track"><i style="height:${height}%"><b>${formatMoney((height*110))}</b></i></div><span>${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][index]}</span></div>`).join('')}</div>
      </article>

      <article class="panel today-panel">
        <header><div><h2>Bugünün Akışı</h2><p>${todayAppointments.length} randevu planlandı</p></div><button class="link-btn" data-view="appointments">Tümünü gör →</button></header>
        <div class="timeline-list">${todayAppointments.map(appointmentRow).join('') || emptyState('Bugün için randevu bulunmuyor.')}</div>
      </article>
    </section>

    <section class="overview-bottom">
      <article class="panel task-panel">
        <header><div><h2>Yapılacaklar</h2><p>Takip ve operasyon görevleri</p></div><button class="icon-btn" data-action="new-task">+</button></header>
        <div class="task-list">${openTasks.map(task=>`<label class="task-row"><input type="checkbox" data-action="complete-task" data-id="${task.id}"><span class="priority priority-${task.priority}"></span><div><strong>${escapeHTML(task.title)}</strong><small>${formatDate(task.due,{day:'2-digit',month:'long'})} · ${escapeHTML(staffById(task.assigneeId)?.name || 'Atanmamış')}</small></div>${badge(task.priority==='high'?'danger':task.priority==='medium'?'warning':'neutral',task.priority==='high'?'Yüksek':task.priority==='medium'?'Orta':'Düşük')}</label>`).join('')}</div>
      </article>

      <article class="panel segment-panel">
        <header><div><h2>Müşteri Sağlığı</h2><p>Segment dağılımı</p></div><button class="link-btn" data-view="customers">Detay →</button></header>
        <div class="donut-wrap"><div class="donut" style="--a:62;--b:24"><span><b>${state.customers.length}</b><small>müşteri</small></span></div><div class="legend"><p><i class="dot purple"></i><span>Aktif</span><b>62%</b></p><p><i class="dot blue"></i><span>VIP / Düzenli</span><b>24%</b></p><p><i class="dot orange"></i><span>Geri kazanılacak</span><b>14%</b></p></div></div>
      </article>

      <article class="panel quick-panel">
        <header><div><h2>Hızlı İşlemler</h2><p>En sık kullanılan akışlar</p></div></header>
        <div class="quick-grid"><button data-action="new-appointment"><span>＋</span>Randevu oluştur</button><button data-action="new-customer"><span>◎</span>Müşteri ekle</button><button data-view="messages"><span>◉</span>Hatırlatma gönder</button><button data-view="finance"><span>₺</span>Ödeme kaydet</button></div>
      </article>
    </section>

    <section class="insight-strip"><div><span>✨</span><div><strong>Akıllı öneri</strong><p>60 günden uzun süredir gelmeyen 5 müşteriye geri kazanım kampanyası gönderebilirsin.</p></div></div><button data-view="messages">Kampanya Oluştur →</button></section>`;
}

function statCard(label, value, trend, caption, icon, tone) {
  return `<article class="stat-card"><div class="stat-icon ${tone}">${icon}</div><div class="stat-body"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong><p><b>${escapeHTML(trend)}</b> ${escapeHTML(caption)}</p></div><button>⋮</button></article>`;
}

function appointmentRow(item) {
  const customer = customerById(item.customerId);
  const service = serviceById(item.serviceId);
  const staff = staffById(item.staffId);
  return `<button class="timeline-row" data-action="appointment-detail" data-id="${item.id}"><time>${formatTime(item.start)}</time><i style="--line:${staff?.color || '#8b5cf6'}"></i>${avatar(customer?.name || '?', staff?.color)}<div><strong>${escapeHTML(customer?.name || 'Bilinmeyen')}</strong><small>${escapeHTML(service?.name || '')} · ${escapeHTML(staff?.name || '')}</small></div>${badge(item.status)}</button>`;
}

function renderCalendar() {
  const dates = Array.from({length:7},(_,index)=>{
    const date = new Date(); date.setDate(date.getDate()+index); return date;
  });
  const hours = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
  return `
    ${pageHeader('PLANLAMA', 'Takvim', 'Ekip, hizmet ve randevu yoğunluğunu haftalık görünümde yönet.', `<button class="btn btn-soft">Bugün</button><button class="btn btn-primary" data-action="new-appointment">+ Randevu</button>`)}
    <div class="calendar-toolbar panel"><div class="segmented"><button class="active">Hafta</button><button>Gün</button><button>Ay</button></div><div class="calendar-controls"><button>‹</button><strong>${formatDate(dates[0],{day:'2-digit',month:'long'})} — ${formatDate(dates[6],{day:'2-digit',month:'long',year:'numeric'})}</strong><button>›</button></div><select><option>Tüm ekip</option>${state.team.map(s=>`<option>${escapeHTML(s.name)}</option>`).join('')}</select></div>
    <section class="panel calendar-panel">
      <div class="calendar-grid-head"><span></span>${dates.map(date=>`<div class="${date.toISOString().slice(0,10)===todayISO()?'today':''}"><small>${formatDate(date,{weekday:'short'})}</small><b>${date.getDate()}</b></div>`).join('')}</div>
      <div class="calendar-grid-body">
        <div class="hours-column">${hours.map(hour=>`<span>${hour}</span>`).join('')}</div>
        ${dates.map(date=>{
          const day = date.toISOString().slice(0,10);
          const appts = state.appointments.filter(a=>a.start.slice(0,10)===day);
          return `<div class="calendar-day">${hours.map(()=>'<i></i>').join('')}${appts.map(a=>{
            const startHour = Number(a.start.slice(11,13));
            const startMinute = Number(a.start.slice(14,16));
            const top = ((startHour-9)*72)+(startMinute/60*72)+4;
            const duration = (new Date(a.end)-new Date(a.start))/60000;
            const height = Math.max(46,duration/60*72-8);
            const staff = staffById(a.staffId); const customer = customerById(a.customerId); const service = serviceById(a.serviceId);
            return `<button class="calendar-event" style="top:${top}px;height:${height}px;--event:${staff?.color}" data-action="appointment-detail" data-id="${a.id}"><b>${formatTime(a.start)} · ${escapeHTML(customer?.name || '')}</b><span>${escapeHTML(service?.name || '')}</span></button>`;
          }).join('')}</div>`;
        }).join('')}
      </div>
    </section>`;
}

function renderAppointments() {
  const filtered = state.appointments
    .filter(item => appointmentFilter === 'all' || item.status === appointmentFilter)
    .sort((a,b)=>b.start.localeCompare(a.start));
  return `
    ${pageHeader('RANDEVU YÖNETİMİ', 'Randevular', 'Durum, kanal, ekip ve ödeme bilgileriyle tüm randevu geçmişi.', `<button class="btn btn-soft" data-action="export-data">Dışa Aktar</button><button class="btn btn-primary" data-action="new-appointment">+ Yeni Randevu</button>`)}
    <section class="filter-bar panel"><div class="filter-tabs"><button class="${appointmentFilter==='all'?'active':''}" data-appointment-filter="all">Tümü <span>${state.appointments.length}</span></button>${['pending','confirmed','in_progress','completed','cancelled','no_show'].map(status=>`<button class="${appointmentFilter===status?'active':''}" data-appointment-filter="${status}">${statusMap[status][0]} <span>${state.appointments.filter(a=>a.status===status).length}</span></button>`).join('')}</div><div><input class="input compact" placeholder="Müşteri veya hizmet ara"><select class="input compact"><option>Tüm ekip</option>${state.team.map(s=>`<option>${escapeHTML(s.name)}</option>`).join('')}</select></div></section>
    <section class="panel table-panel">
      <div class="table-wrap"><table><thead><tr><th>Tarih / Saat</th><th>Müşteri</th><th>Hizmet</th><th>Uzman</th><th>Kanal</th><th>Ücret</th><th>Hatırlatma</th><th>Durum</th><th></th></tr></thead><tbody>${filtered.map(a=>{
        const customer=customerById(a.customerId),service=serviceById(a.serviceId),staff=staffById(a.staffId);
        return `<tr><td><strong>${formatDate(a.start,{day:'2-digit',month:'short'})}</strong><small>${formatTime(a.start)}–${formatTime(a.end)}</small></td><td><div class="person-cell">${avatar(customer?.name||'',staff?.color,'small')}<div><strong>${escapeHTML(customer?.name||'')}</strong><small>${escapeHTML(customer?.phone||'')}</small></div></div></td><td><strong>${escapeHTML(service?.name||'')}</strong><small>${service?.duration||0} dk</small></td><td>${escapeHTML(staff?.name||'')}</td><td>${escapeHTML(a.channel)}</td><td><strong>${formatMoney(a.price)}</strong><small>${a.paid?`${formatMoney(a.paid)} ödendi`:'Ödeme yok'}</small></td><td>${badge(a.reminder)}</td><td>${badge(a.status)}</td><td><button class="icon-btn" data-action="appointment-detail" data-id="${a.id}">•••</button></td></tr>`;
      }).join('')}</tbody></table></div>
    </section>`;
}

function renderCustomers() {
  const query = customerSearch.trim().toLocaleLowerCase('tr-TR');
  const filtered = state.customers.filter(customer => !query || [customer.name,customer.phone,customer.email,...customer.tags].join(' ').toLocaleLowerCase('tr-TR').includes(query));
  return `
    ${pageHeader('MÜŞTERİ MERKEZİ', 'Müşteriler', 'Ziyaret geçmişi, notlar, etiketler, izinler, borç ve sadakat bilgileri.', `<button class="btn btn-soft" data-action="import-data">İçe Aktar</button><button class="btn btn-primary" data-action="new-customer">+ Yeni Müşteri</button>`)}
    <section class="customer-stats mini-stats-row">
      <article><span>Toplam Müşteri</span><b>${state.customers.length}</b><small>+3 bu ay</small></article><article><span>VIP / Düzenli</span><b>${state.customers.filter(c=>c.tags.some(t=>['VIP','Düzenli'].includes(t))).length}</b><small>yüksek değerli</small></article><article><span>Geri Kazanılacak</span><b>${state.customers.filter(c=>c.status==='dormant').length}</b><small>60+ gün</small></article><article><span>Toplam Müşteri Değeri</span><b>${formatMoney(state.customers.reduce((s,c)=>s+c.totalSpent,0))}</b><small>yaşam boyu</small></article>
    </section>
    <section class="filter-bar panel"><div class="search-input"><span>⌕</span><input id="customer-search" value="${escapeHTML(customerSearch)}" placeholder="Ad, telefon, e-posta veya etikete göre ara"></div><div><select class="input compact"><option>Tüm segmentler</option><option>VIP</option><option>Yeni</option><option>Pasifleşen</option></select><button class="btn btn-soft">Filtreler</button></div></section>
    <section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Müşteri</th><th>Etiketler</th><th>Son Ziyaret</th><th>Sonraki Randevu</th><th>Ziyaret</th><th>Toplam Harcama</th><th>İzin</th><th></th></tr></thead><tbody>${filtered.map(customer=>{
      const staff=staffById(customer.preferredStaffId);
      return `<tr class="clickable-row" data-action="customer-detail" data-id="${customer.id}"><td><div class="person-cell">${avatar(customer.name,staff?.color,'small')}<div><strong>${escapeHTML(customer.name)}</strong><small>${escapeHTML(customer.phone)}</small></div></div></td><td><div class="tag-list">${customer.tags.map(tag=>`<span>${escapeHTML(tag)}</span>`).join('')}</div></td><td>${formatDate(customer.lastVisit,{day:'2-digit',month:'short',year:'numeric'})}</td><td>${customer.nextVisit?formatDate(customer.nextVisit,{day:'2-digit',month:'short',year:'numeric'}):'—'}</td><td>${customer.totalVisits}</td><td><strong>${formatMoney(customer.totalSpent)}</strong>${customer.balance?`<small class="danger-text">${formatMoney(customer.balance)} borç</small>`:''}</td><td>${customer.consent?badge('approved','KVKK Onaylı'):badge('pending','İzin Yok')}</td><td><button class="icon-btn" data-action="customer-detail" data-id="${customer.id}">›</button></td></tr>`;
    }).join('')}</tbody></table></div>${!filtered.length?emptyState('Aramana uygun müşteri bulunamadı.'):''}</section>`;
}

function renderLeads() {
  const stages = [
    ['new','Yeni'],['contacted','İletişimde'],['proposal','Teklif'],['won','Kazanıldı']
  ];
  return `
    ${pageHeader('CRM & SATIŞ', 'Potansiyel Müşteriler', 'Sosyal medya, web, tavsiye ve telefon kaynaklı fırsatları randevuya dönüştür.', `<button class="btn btn-soft">Satış Raporu</button><button class="btn btn-primary" data-action="new-lead">+ Fırsat Ekle</button>`)}
    <section class="crm-summary"><article><span>Açık Fırsat</span><b>${state.leads.filter(l=>l.stage!=='won'&&l.stage!=='lost').length}</b></article><article><span>Potansiyel Değer</span><b>${formatMoney(state.leads.filter(l=>l.stage!=='won').reduce((s,l)=>s+l.value,0))}</b></article><article><span>Kazanılan</span><b>${state.leads.filter(l=>l.stage==='won').length}</b></article><article><span>Dönüşüm</span><b>28%</b></article></section>
    <section class="kanban">${stages.map(([stage,label])=>{
      const items=state.leads.filter(l=>l.stage===stage);
      return `<div class="kanban-column"><header><span>${label}</span><b>${items.length}</b></header><div class="kanban-list">${items.map(lead=>`<article class="lead-card"><div class="lead-top">${avatar(lead.name,staffById(lead.ownerId)?.color,'small')}<button>•••</button></div><h3>${escapeHTML(lead.name)}</h3><p>${escapeHTML(lead.interest)}</p><div class="lead-meta"><span>${escapeHTML(lead.source)}</span><b>${formatMoney(lead.value)}</b></div><footer><small>${lead.nextAction?`Takip: ${formatDate(lead.nextAction,{day:'2-digit',month:'short'})}`:'Tamamlandı'}</small>${stage!=='won'?`<button data-action="advance-lead" data-id="${lead.id}">İlerle →</button>`:'<span>✓</span>'}</footer></article>`).join('')}${!items.length?'<div class="kanban-empty">Bu aşamada kayıt yok</div>':''}</div></div>`;
    }).join('')}</section>
    <section class="panel task-panel wide"><header><div><h2>Satış & Takip Görevleri</h2><p>Müşteri dönüşümünü hızlandıran aksiyonlar</p></div><button class="btn btn-soft" data-action="new-task">+ Görev</button></header><div class="task-list">${state.tasks.filter(t=>t.type==='sales'||t.type==='follow_up').map(task=>`<label class="task-row"><input type="checkbox" ${task.status==='done'?'checked':''} data-action="complete-task" data-id="${task.id}"><span class="priority priority-${task.priority}"></span><div><strong>${escapeHTML(task.title)}</strong><small>${formatDate(task.due,{day:'2-digit',month:'long'})} · ${escapeHTML(staffById(task.assigneeId)?.name||'')}</small></div>${badge(task.status)}</label>`).join('')}</div></section>`;
}

function renderServices() {
  return `
    ${pageHeader('HİZMET KATALOĞU', 'Hizmetler & Paketler', 'Süre, fiyat, kategori, uzman yetkisi, vergi ve paket haklarını yönet.', `<button class="btn btn-soft">Kategori Ekle</button><button class="btn btn-primary" data-action="new-service">+ Hizmet Ekle</button>`)}
    <section class="service-summary mini-stats-row"><article><span>Aktif Hizmet</span><b>${state.services.filter(s=>s.active).length}</b><small>${new Set(state.services.map(s=>s.category)).size} kategori</small></article><article><span>Ortalama Fiyat</span><b>${formatMoney(state.services.reduce((s,x)=>s+x.price,0)/state.services.length)}</b><small>hizmet başına</small></article><article><span>En Çok Satan</span><b>Saç + Sakal</b><small>32 işlem</small></article><article><span>Aktif Paket</span><b>${state.memberships.length}</b><small>müşteri üyeliği</small></article></section>
    <div class="service-grid">${state.services.map(service=>`<article class="service-card" style="--service:${service.color}"><header><span>${escapeHTML(service.category)}</span><button>•••</button></header><div class="service-icon">✦</div><h3>${escapeHTML(service.name)}</h3><p>${service.duration} dakika · KDV %${service.taxRate}</p><strong>${formatMoney(service.price)}</strong><footer>${badge(service.active?'active':'dormant')}<button data-action="new-appointment" data-service="${service.id}">Randevu oluştur</button></footer></article>`).join('')}</div>
    <section class="panel memberships-panel"><header><div><h2>Aktif Paket & Üyelikler</h2><p>Kalan seans ve son kullanma tarihleri</p></div><button class="btn btn-soft">Paket Oluştur</button></header><div class="membership-list">${state.memberships.map(item=>{const customer=customerById(item.customerId);const used=item.totalUnits-item.remainingUnits;return `<article><div>${avatar(customer?.name||'','#8b5cf6','small')}<span><strong>${escapeHTML(customer?.name||'')}</strong><small>${escapeHTML(item.name)}</small></span></div><div class="progress-info"><span>${used}/${item.totalUnits} kullanıldı</span><div class="progress"><i style="width:${used/item.totalUnits*100}%"></i></div></div><div><strong>${item.remainingUnits} hak</strong><small>${formatDate(item.expiresAt,{day:'2-digit',month:'short',year:'numeric'})} tarihine kadar</small></div></article>`}).join('')}</div></section>`;
}

function renderTeam() {
  return `
    ${pageHeader('EKİP YÖNETİMİ', 'Ekip & Vardiya', 'Çalışma saatleri, hizmet yetkileri, doluluk, izin ve performans görünümü.', `<button class="btn btn-soft">Vardiya Planı</button><button class="btn btn-primary" data-action="new-staff">+ Ekip Üyesi</button>`)}
    <div class="team-grid">${state.team.map(member=>`<article class="team-card"><header>${avatar(member.name,member.color)}<button>•••</button></header><h3>${escapeHTML(member.name)}</h3><p>${escapeHTML(member.role)}</p><div class="rating">★ ${member.rating} <span>· ${member.occupancy}% doluluk</span></div><div class="team-metrics"><div><span>Bu ay gelir</span><b>${formatMoney(member.monthlyRevenue)}</b></div><div><span>Komisyon</span><b>%${member.commissionRate}</b></div></div><div class="progress"><i style="width:${member.occupancy}%;--progress:${member.color}"></i></div><footer>${badge(member.active?'active':'dormant')}<button data-action="staff-detail" data-id="${member.id}">Profili Aç →</button></footer></article>`).join('')}</div>
    <section class="panel shift-panel"><header><div><h2>Haftalık Çalışma Planı</h2><p>Ekip müsaitlik görünümü</p></div><button class="btn btn-soft">Düzenle</button></header><div class="shift-table"><div class="shift-row head"><span>Ekip</span>${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(d=>`<b>${d}</b>`).join('')}</div>${state.team.map(member=>`<div class="shift-row"><span>${avatar(member.name,member.color,'tiny')} ${escapeHTML(member.name)}</span>${Object.values(member.workHours).map(hour=>`<b class="${hour==='off'?'off':''}">${hour==='off'?'İzinli':hour}</b>`).join('')}</div>`).join('')}</div></section>`;
}

function renderMessages() {
  const todaySent = state.messageLogs.filter(item => item.sentAt.slice(0,10)===todayISO()).length;
  return `
    ${pageHeader('İLETİŞİM MERKEZİ', 'WhatsApp & Mesajlar', 'Randevu bildirimleri, onay şablonları, kampanyalar ve teslimat durumları.', `<button class="btn btn-soft" data-action="test-whatsapp">Test Mesajı</button><button class="btn btn-primary" data-action="new-campaign">+ Kampanya</button>`)}
    <section class="integration-banner ${integrationStatus?.whatsapp?.configured?'connected':''}"><div><span>◉</span><div><strong>WhatsApp Cloud API ${integrationStatus?.whatsapp?.configured?'bağlı':'demo modunda'}</strong><p>${integrationStatus?.whatsapp?.configured?'Gerçek mesaj gönderimi hazır.':'Gönderimler simüle ediliyor. Gerçek kullanım için Ayarlar → Entegrasyon bölümünden sunucu anahtarlarını ekle.'}</p></div></div><button data-view="settings">${integrationStatus?.whatsapp?.configured?'Bağlantıyı Yönet':'Kurulum Rehberi →'}</button></section>
    <section class="message-stats mini-stats-row"><article><span>Bugün Gönderilen</span><b>${todaySent}</b><small>demo kayıt</small></article><article><span>Teslim Oranı</span><b>98,4%</b><small>son 30 gün</small></article><article><span>Okunma Oranı</span><b>86,2%</b><small>WhatsApp</small></article><article><span>Yaklaşan Hatırlatma</span><b>${state.appointments.filter(a=>a.reminder==='scheduled').length}</b><small>planlanmış</small></article></section>
    <section class="message-layout">
      <article class="panel templates-panel"><header><div><h2>Mesaj Şablonları</h2><p>Meta onay durumu ve içerik ön izlemesi</p></div><button class="btn btn-soft">+ Şablon</button></header><div class="template-list">${state.messageTemplates.map(t=>`<button class="template-item" data-action="template-detail" data-id="${t.id}"><span class="template-icon">◉</span><div><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.metaName)} · ${escapeHTML(t.category)}</small><p>${escapeHTML(t.body)}</p></div>${badge(t.status)}</button>`).join('')}</div></article>
      <article class="panel campaign-panel"><header><div><h2>Kampanyalar</h2><p>Segment bazlı toplu iletişim</p></div><button class="link-btn" data-action="new-campaign">Yeni →</button></header><div class="campaign-list">${state.campaigns.map(c=>`<article><div><span class="campaign-channel">${c.channel==='WhatsApp'?'◉':'✉'}</span><div><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.audience)}</small></div></div><div class="campaign-numbers"><b>${c.recipients}</b><small>alıcı</small></div>${badge(c.status)}</article>`).join('')}</div></article>
    </section>
    <section class="panel table-panel"><header><div><h2>Son Mesaj Hareketleri</h2><p>Gönderim ve teslimat kayıtları</p></div><button class="btn btn-soft">Tüm loglar</button></header><div class="table-wrap"><table><thead><tr><th>Alıcı</th><th>Şablon</th><th>Randevu</th><th>Gönderim</th><th>Sağlayıcı</th><th>Durum</th><th></th></tr></thead><tbody>${state.messageLogs.map(log=>{const customer=customerById(log.customerId),template=state.messageTemplates.find(t=>t.id===log.templateId),appointment=state.appointments.find(a=>a.id===log.appointmentId);return `<tr><td><strong>${escapeHTML(customer?.name||'')}</strong><small>${escapeHTML(customer?.phone||'')}</small></td><td>${escapeHTML(template?.name||'')}</td><td>${appointment?`${formatDate(appointment.start,{day:'2-digit',month:'short'})} ${formatTime(appointment.start)}`:'—'}</td><td>${formatDateTime(log.sentAt)}</td><td>${escapeHTML(log.provider)}</td><td>${badge(log.status)}</td><td><button class="icon-btn">›</button></td></tr>`}).join('')}</tbody></table></div></section>`;
}

function renderStock() {
  return `
    ${pageHeader('STOK & ÜRÜN', 'Stok Yönetimi', 'Hizmet sarfları ve perakende ürünler için kritik seviye, maliyet ve satış takibi.', `<button class="btn btn-soft">Stok Hareketi</button><button class="btn btn-primary" data-action="new-stock">+ Ürün Ekle</button>`)}
    <section class="stock-summary mini-stats-row"><article><span>Toplam Ürün</span><b>${state.stock.length}</b><small>aktif kalem</small></article><article><span>Kritik Stok</span><b>${state.stock.filter(s=>s.status==='low').length}</b><small>sipariş gerekli</small></article><article><span>Stok Maliyeti</span><b>${formatMoney(state.stock.reduce((s,x)=>s+x.quantity*x.cost,0))}</b><small>tahmini</small></article><article><span>Perakende Değeri</span><b>${formatMoney(state.stock.reduce((s,x)=>s+x.quantity*x.salePrice,0))}</b><small>satış fiyatı</small></article></section>
    <section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Ürün</th><th>SKU</th><th>Miktar</th><th>Minimum</th><th>Maliyet</th><th>Satış</th><th>Durum</th><th></th></tr></thead><tbody>${state.stock.map(item=>`<tr><td><div class="product-cell"><span>▣</span><strong>${escapeHTML(item.name)}</strong></div></td><td>${escapeHTML(item.sku)}</td><td><strong>${item.quantity} ${escapeHTML(item.unit)}</strong><div class="stock-progress"><i style="width:${Math.min(100,item.quantity/(item.minQuantity*3)*100)}%;--stock:${item.status==='low'?'#ef4444':'#10b981'}"></i></div></td><td>${item.minQuantity} ${escapeHTML(item.unit)}</td><td>${formatMoney(item.cost)}</td><td>${item.salePrice?formatMoney(item.salePrice):'—'}</td><td>${badge(item.status)}</td><td><button class="icon-btn">•••</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderFinance() {
  const collected = state.payments.reduce((s,p)=>s+p.amount,0);
  const receivable = state.customers.reduce((s,c)=>s+c.balance,0) + state.appointments.reduce((s,a)=>s+Math.max(0,a.price-a.paid),0);
  return `
    ${pageHeader('FİNANS MERKEZİ', 'Kasa & Ödemeler', 'Tahsilat, ön ödeme, açık bakiye, ödeme yöntemi ve günlük kasa görünümü.', `<button class="btn btn-soft">Kasa Kapat</button><button class="btn btn-primary" data-action="new-payment">+ Ödeme Kaydet</button>`)}
    <section class="finance-hero"><div><span>Bu Ay Tahsilat</span><strong>${formatMoney(collected + 48250)}</strong><p><b>+12,4%</b> geçen aya göre</p></div><div class="finance-ring"><span><b>68%</b><small>hedef</small></span></div><div class="finance-goal"><small>Aylık hedef</small><b>${formatMoney(85000)}</b><div class="progress"><i style="width:68%"></i></div><span>${formatMoney(27200)} kaldı</span></div></section>
    <section class="finance-stats mini-stats-row"><article><span>Bugün Tahsilat</span><b>${formatMoney(state.payments.filter(p=>p.paidAt.slice(0,10)===todayISO()).reduce((s,p)=>s+p.amount,0))}</b><small>kasa girişi</small></article><article><span>Açık Bakiye</span><b>${formatMoney(receivable)}</b><small>randevu + müşteri</small></article><article><span>Ön Ödeme</span><b>${formatMoney(state.payments.filter(p=>p.status==='deposit').reduce((s,p)=>s+p.amount,0))}</b><small>gelecek randevular</small></article><article><span>Ortalama Sepet</span><b>${formatMoney(1180)}</b><small>işlem başına</small></article></section>
    <section class="overview-grid">
      <article class="panel chart-panel"><header><div><h2>Ödeme Yöntemleri</h2><p>Bu ayın dağılımı</p></div></header><div class="payment-breakdown"><div class="donut payment-donut"><span><b>${formatMoney(collected)}</b><small>toplam</small></span></div><div class="legend"><p><i class="dot purple"></i><span>Kart</span><b>48%</b></p><p><i class="dot blue"></i><span>Nakit</span><b>28%</b></p><p><i class="dot orange"></i><span>Havale</span><b>24%</b></p></div></div></article>
      <article class="panel"><header><div><h2>Son Tahsilatlar</h2><p>Güncel ödeme hareketleri</p></div><button class="link-btn">Tümü →</button></header><div class="payment-list">${state.payments.map(p=>{const customer=customerById(p.customerId);return `<div><span class="payment-method">₺</span><div><strong>${escapeHTML(customer?.name||'')}</strong><small>${escapeHTML(p.method)} · ${formatDateTime(p.paidAt)}</small></div><b>${formatMoney(p.amount)}</b>${badge(p.status)}</div>`}).join('')}</div></article>
    </section>`;
}

function renderReports() {
  const teamMax = Math.max(...state.team.map(t=>t.monthlyRevenue));
  return `
    ${pageHeader('İŞ ZEKÂSI', 'Raporlar', 'Gelir, müşteri, hizmet, ekip ve randevu kalitesini tek yerden analiz et.', `<select class="input compact"><option>Bu ay</option><option>Geçen ay</option><option>Son 90 gün</option></select><button class="btn btn-soft">PDF İndir</button>`)}
    <section class="report-kpis stats-grid">${statCard('Net Gelir',formatMoney(143250),'+14,8%','geçen aya göre','₺','green')}${statCard('Doluluk Oranı','76%','+5,2%','ekip ortalaması','▦','purple')}${statCard('Müşteri Dönüşü','64%','+8,1%','tekrar ziyaret','◎','blue')}${statCard('Gelmedi Oranı',`${Math.round((state.appointments.filter(a=>a.status==='no_show').length/state.appointments.length)*100)}%`,'-2,4%','iyileşme','!','orange')}</section>
    <section class="report-grid">
      <article class="panel chart-panel"><header><div><h2>Gelir Trendi</h2><p>Son 6 ay</p></div><select><option>Tüm şubeler</option></select></header><div class="line-chart"><svg viewBox="0 0 600 220" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".35"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs><path d="M0 175 C80 160 90 120 160 135 S250 90 315 110 S410 65 465 85 S540 35 600 48 L600 220 L0 220Z" fill="url(#area)"/><path d="M0 175 C80 160 90 120 160 135 S250 90 315 110 S410 65 465 85 S540 35 600 48" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round"/></svg><div>${['Şub','Mar','Nis','May','Haz','Tem'].map(m=>`<span>${m}</span>`).join('')}</div></div></article>
      <article class="panel"><header><div><h2>Ekip Performansı</h2><p>Aylık gelir katkısı</p></div></header><div class="performance-list">${state.team.map(member=>`<div>${avatar(member.name,member.color,'small')}<span><strong>${escapeHTML(member.name)}</strong><small>${member.occupancy}% doluluk</small></span><div class="progress"><i style="width:${member.monthlyRevenue/teamMax*100}%;--progress:${member.color}"></i></div><b>${formatMoney(member.monthlyRevenue)}</b></div>`).join('')}</div></article>
      <article class="panel"><header><div><h2>En Çok Satan Hizmetler</h2><p>İşlem adedi ve gelir</p></div></header><div class="rank-list">${state.services.slice(0,5).map((service,index)=>`<div><b>${index+1}</b><span><strong>${escapeHTML(service.name)}</strong><small>${32-index*4} işlem</small></span><em>${formatMoney(service.price*(32-index*4))}</em></div>`).join('')}</div></article>
      <article class="panel"><header><div><h2>Müşteri Kaynakları</h2><p>Yeni müşteri edinimi</p></div></header><div class="source-list">${[['Instagram',34],['Google',27],['Tavsiye',24],['Web Randevu',10],['Diğer',5]].map(([name,value],i)=>`<div><span>${name}</span><div class="progress"><i style="width:${value}%;--progress:${['#ec4899','#3b82f6','#10b981','#8b5cf6','#64748b'][i]}"></i></div><b>${value}%</b></div>`).join('')}</div></article>
    </section>`;
}

function renderSettings() {
  const status = integrationStatus || {whatsapp:{configured:false,provider:'mock'},database:{configured:false,provider:'localStorage'},calendar:{configured:false,provider:'mock'},payments:{configured:false,provider:'mock'}};
  return `
    ${pageHeader('SİSTEM YAPILANDIRMASI', 'Ayarlar & Entegrasyon', 'İşletme profili, randevu kuralları, roller, bildirimler ve API bağlantıları.', `<button class="btn btn-primary" data-action="save-settings">Değişiklikleri Kaydet</button>`)}
    <div class="settings-layout">
      <aside class="settings-nav panel"><button class="active">İşletme Profili</button><button>Randevu Kuralları</button><button>Çalışma Saatleri</button><button>Roller & Yetkiler</button><button>Bildirimler</button><button>Entegrasyonlar</button><button>Veri & Güvenlik</button><button>Faturalandırma</button></aside>
      <div class="settings-content">
        <section class="panel settings-section"><header><div><h2>İşletme Profili</h2><p>Randevu sayfasında ve bildirimlerde görünen bilgiler.</p></div></header><div class="form-grid"><label><span>İşletme Adı</span><input class="input" value="${escapeHTML(state.business.name)}"></label><label><span>Sektör</span><select class="input"><option>${escapeHTML(state.business.sector)}</option><option>Kuaför & Berber</option><option>Güzellik Salonu</option><option>Özel Ders</option></select></label><label><span>Telefon</span><input class="input" value="${escapeHTML(state.business.phone)}"></label><label><span>E-posta</span><input class="input" value="${escapeHTML(state.business.email)}"></label><label class="span-2"><span>Adres</span><input class="input" value="${escapeHTML(state.business.address)}"></label></div></section>
        <section class="panel settings-section"><header><div><h2>Entegrasyonlar</h2><p>Gerçek servis anahtarları yalnızca sunucu ortam değişkenlerinde tutulmalıdır.</p></div></header><div class="integration-list">
          ${integrationCard('WhatsApp Cloud API','Randevu onayı, hatırlatma ve kampanya mesajları.','◉',status.whatsapp.configured,status.whatsapp.provider,'WHATSAPP_ACCESS_TOKEN, PHONE_NUMBER_ID')}
          ${integrationCard('Veri Katmanı','Demo localStorage yerine Supabase, PostgreSQL veya özel REST API.','▦',status.database.configured,status.database.provider,'DATABASE_URL veya SUPABASE_URL')}
          ${integrationCard('Google Calendar','Randevuları çalışan takvimleriyle çift yönlü senkronla.','G',status.calendar.configured,status.calendar.provider,'GOOGLE_CALENDAR_CLIENT_ID')}
          ${integrationCard('Online Ödeme','Kapora, paket satışı ve ödeme linkleri için sağlayıcı bağla.','₺',status.payments.configured,status.payments.provider,'STRIPE_SECRET_KEY / yerel sağlayıcı')}
        </div><div class="security-note"><span>🔒</span><p><strong>Güvenlik:</strong> API anahtarlarını hiçbir zaman <code>config.js</code> veya tarayıcı koduna yazma. Anahtarlar yalnızca sunucudaki <code>.env</code> dosyasında tutulur.</p></div></section>
        <section class="panel settings-section"><header><div><h2>Veri Yönetimi</h2><p>Demo verisini yedekle, geri yükle veya sıfırla.</p></div></header><div class="data-actions"><button class="btn btn-soft" data-action="export-data">JSON Yedek İndir</button><button class="btn btn-soft" data-action="import-data">Yedek İçe Aktar</button><button class="btn btn-danger" data-action="reset-demo">Demo Veriyi Sıfırla</button></div></section>
        <section class="panel settings-section"><header><div><h2>Hazır Modüller</h2><p>Gerçek SaaS sürümüne geçerken açılabilecek genişletmeler.</p></div></header><div class="module-checks">${['Çoklu şube','Online randevu sayfası','Müşteri sadakat puanı','Paket & üyelik','E-fatura entegrasyonu','Personel prim/komisyon','KVKK izin kayıtları','Audit log','Webhook çıkışları','Mobil PWA','SMS sağlayıcısı','Google yorum takibi'].map((item,index)=>`<label><input type="checkbox" ${index<9?'checked':''}><span>${item}</span></label>`).join('')}</div></section>
      </div>
    </div>`;
}

function integrationCard(name, description, icon, configured, provider, keys) {
  return `<article><span class="integration-logo">${icon}</span><div><strong>${name}</strong><p>${description}</p><small>${keys}</small></div><div>${configured?badge('approved',`Bağlı · ${provider}`):badge('draft',`Demo · ${provider}`)}<button data-action="show-api-guide">Kurulum</button></div></article>`;
}

function emptyState(text) {
  return `<div class="empty-state"><span>◇</span><p>${escapeHTML(text)}</p></div>`;
}

function customerForm() {
  return `<form id="customer-form" class="modal-form"><div class="form-grid"><label><span>Ad Soyad *</span><input class="input" name="name" required placeholder="Örn. Deniz Yılmaz"></label><label><span>Telefon *</span><input class="input" name="phone" required placeholder="+90 5xx xxx xx xx"></label><label><span>E-posta</span><input class="input" name="email" type="email" placeholder="ornek@email.com"></label><label><span>Doğum Tarihi</span><input class="input" name="birthday" type="date"></label><label><span>Kaynak</span><select class="input" name="source"><option>Instagram</option><option>Google</option><option>Tavsiye</option><option>Web Randevu</option><option>Telefon</option><option>Yoldan Geçiş</option></select></label><label><span>Tercih Edilen Uzman</span><select class="input" name="preferredStaffId"><option value="">Seçilmedi</option>${state.team.map(s=>`<option value="${s.id}">${escapeHTML(s.name)}</option>`).join('')}</select></label><label class="span-2"><span>Not</span><textarea class="input" name="notes" rows="3" placeholder="Tercihler, alerji notları, özel talepler..."></textarea></label><label class="check-label span-2"><input type="checkbox" name="consent" checked><span>Müşteri iletişim ve KVKK izinlerini onayladı.</span></label></div><div class="modal-actions"><button type="button" class="btn btn-soft" data-action="close-modal">Vazgeç</button><button class="btn btn-primary" type="submit">Müşteriyi Kaydet</button></div></form>`;
}

function appointmentForm(serviceId = '') {
  const now = new Date(); now.setMinutes(Math.ceil(now.getMinutes()/15)*15,0,0);
  const local = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  return `<form id="appointment-form" class="modal-form"><div class="form-grid"><label class="span-2"><span>Müşteri *</span><select class="input" name="customerId" required><option value="">Müşteri seç</option>${state.customers.map(c=>`<option value="${c.id}">${escapeHTML(c.name)} · ${escapeHTML(c.phone)}</option>`).join('')}</select></label><label><span>Hizmet *</span><select class="input" name="serviceId" required><option value="">Hizmet seç</option>${state.services.filter(s=>s.active).map(s=>`<option value="${s.id}" ${s.id===serviceId?'selected':''}>${escapeHTML(s.name)} · ${s.duration} dk · ${formatMoney(s.price)}</option>`).join('')}</select></label><label><span>Uzman *</span><select class="input" name="staffId" required><option value="">Uzman seç</option>${state.team.filter(s=>s.active).map(s=>`<option value="${s.id}">${escapeHTML(s.name)} · ${escapeHTML(s.role)}</option>`).join('')}</select></label><label><span>Başlangıç *</span><input class="input" name="start" type="datetime-local" value="${local}" required></label><label><span>Kanal</span><select class="input" name="channel"><option>Web</option><option>WhatsApp</option><option>Telefon</option><option>Instagram</option><option>Walk-in</option></select></label><label><span>Durum</span><select class="input" name="status"><option value="confirmed">Onaylandı</option><option value="pending">Bekliyor</option><option value="waiting">Müşteri Geldi</option></select></label><label><span>Ön Ödeme</span><input class="input" name="paid" type="number" min="0" value="0"></label><label class="span-2"><span>Randevu Notu</span><textarea class="input" name="note" rows="3"></textarea></label><label class="check-label span-2"><input type="checkbox" name="reminder" checked><span>WhatsApp hatırlatmasını otomatik planla.</span></label></div><div class="modal-actions"><button type="button" class="btn btn-soft" data-action="close-modal">Vazgeç</button><button class="btn btn-primary" type="submit">Randevuyu Oluştur</button></div></form>`;
}

function showCustomerDetail(id) {
  const customer=customerById(id); if(!customer) return;
  const visits=state.appointments.filter(a=>a.customerId===id).sort((a,b)=>b.start.localeCompare(a.start));
  const membership=state.memberships.find(m=>m.customerId===id);
  modal('Müşteri Profili', `<div class="customer-profile"><div class="profile-hero">${avatar(customer.name,staffById(customer.preferredStaffId)?.color)}<div><h3>${escapeHTML(customer.name)}</h3><p>${escapeHTML(customer.phone)} · ${escapeHTML(customer.email)}</p><div class="tag-list">${customer.tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div></div><button class="btn btn-primary" data-action="new-appointment" data-customer="${customer.id}">+ Randevu</button></div><div class="profile-metrics"><div><span>Toplam Ziyaret</span><b>${customer.totalVisits}</b></div><div><span>Toplam Harcama</span><b>${formatMoney(customer.totalSpent)}</b></div><div><span>Son Ziyaret</span><b>${formatDate(customer.lastVisit,{day:'2-digit',month:'short'})}</b></div><div><span>Açık Bakiye</span><b>${formatMoney(customer.balance)}</b></div></div><div class="profile-sections"><section><h4>Müşteri Notları</h4><p class="note-box">${escapeHTML(customer.notes||'Not bulunmuyor.')}</p>${membership?`<h4>Aktif Paket</h4><div class="membership-mini"><strong>${escapeHTML(membership.name)}</strong><span>${membership.remainingUnits}/${membership.totalUnits} hak kaldı</span></div>`:''}</section><section><h4>Randevu Geçmişi</h4><div class="compact-list">${visits.map(v=>`<button data-action="appointment-detail" data-id="${v.id}"><span><strong>${formatDate(v.start,{day:'2-digit',month:'short'})} · ${formatTime(v.start)}</strong><small>${escapeHTML(serviceById(v.serviceId)?.name||'')}</small></span>${badge(v.status)}</button>`).join('')||emptyState('Randevu geçmişi yok.')}</div></section></div></div>`, 'large');
}

function showAppointmentDetail(id) {
  const appointment=state.appointments.find(a=>a.id===id); if(!appointment) return;
  const customer=customerById(appointment.customerId),service=serviceById(appointment.serviceId),staff=staffById(appointment.staffId);
  modal('Randevu Detayı', `<div class="appointment-detail"><div class="appointment-title">${avatar(customer?.name||'',staff?.color)}<div><h3>${escapeHTML(customer?.name||'')}</h3><p>${escapeHTML(service?.name||'')} · ${escapeHTML(staff?.name||'')}</p></div>${badge(appointment.status)}</div><div class="detail-grid"><div><span>Tarih</span><strong>${formatDate(appointment.start,{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</strong></div><div><span>Saat</span><strong>${formatTime(appointment.start)} – ${formatTime(appointment.end)}</strong></div><div><span>Ücret</span><strong>${formatMoney(appointment.price)}</strong></div><div><span>Ödenen</span><strong>${formatMoney(appointment.paid)}</strong></div><div><span>Kanal</span><strong>${escapeHTML(appointment.channel)}</strong></div><div><span>Hatırlatma</span>${badge(appointment.reminder)}</div></div><div class="note-box">${escapeHTML(appointment.note||'Randevu notu bulunmuyor.')}</div><div class="status-actions"><p>Durumu güncelle</p><div>${appointmentStatuses.map(s=>`<button class="${appointment.status===s?'active':''}" data-action="set-appointment-status" data-id="${appointment.id}" data-status="${s}">${statusMap[s][0]}</button>`).join('')}</div></div><div class="modal-actions spread"><button class="btn btn-soft" data-action="send-reminder" data-id="${appointment.id}">◉ WhatsApp Hatırlat</button><button class="btn btn-primary" data-action="close-modal">Tamam</button></div></div>`);
}

function showNotifications() {
  modal('Bildirimler', `<div class="notification-list">${state.notifications.map(n=>`<article class="${n.read?'read':''}"><span class="notification-dot ${n.type}"></span><div><strong>${escapeHTML(n.title)}</strong><p>${escapeHTML(n.text)}</p><small>${formatDateTime(n.createdAt)}</small></div></article>`).join('')}</div>`);
  state.notifications.forEach(n=>n.read=true); api.persist(state); renderDashboard();
}

function showApiGuide() {
  modal('API Kurulum Özeti', `<div class="guide-preview"><div class="guide-step"><b>1</b><div><strong>Meta Developer hesabı ve uygulama</strong><p>Business türünde uygulama oluştur, WhatsApp ürününü ekle.</p></div></div><div class="guide-step"><b>2</b><div><strong>Kimlik bilgilerini al</strong><p>Phone Number ID, WhatsApp Business Account ID ve sunucu tarafı erişim tokenını kaydet.</p></div></div><div class="guide-step"><b>3</b><div><strong>.env dosyasına ekle</strong><pre>WHATSAPP_PROVIDER=meta\nWHATSAPP_ACCESS_TOKEN=...\nWHATSAPP_PHONE_NUMBER_ID=...</pre></div></div><div class="guide-step"><b>4</b><div><strong>Webhook bağla</strong><p><code>/api/webhooks/whatsapp</code> adresini Meta paneline callback URL olarak gir.</p></div></div><p class="guide-note">Ayrıntılı ekran ekran rehber: <code>DraBornTest/docs/API-ANAHTARLARI-VE-WHATSAPP-REHBERI.md</code></p></div>`, 'large');
}

async function handleClick(event) {
  const target = event.target.closest('[data-action],[data-view],[data-appointment-filter]');
  if (!target) return;

  if (target.dataset.view) {
    currentView = target.dataset.view;
    setHash(`dashboard/${currentView}`);
    document.getElementById('sidebar')?.classList.remove('open');
    return;
  }

  if (target.dataset.appointmentFilter) {
    appointmentFilter = target.dataset.appointmentFilter;
    renderDashboard();
    return;
  }

  const action = target.dataset.action;
  if (action === 'open-demo') setHash('dashboard/overview');
  if (action === 'toggle-sidebar') document.getElementById('sidebar')?.classList.toggle('open');
  if (action === 'close-modal' && !event.target.closest('[data-modal-panel]')) closeModal();
  if (action === 'close-modal' && target.matches('[data-action="close-modal"]')) closeModal();
  if (action === 'new-customer') modal('Yeni Müşteri', customerForm(), 'large');
  if (action === 'new-appointment') modal('Yeni Randevu', appointmentForm(target.dataset.service || ''), 'large');
  if (action === 'customer-detail') showCustomerDetail(target.dataset.id);
  if (action === 'appointment-detail') showAppointmentDetail(target.dataset.id);
  if (action === 'show-notifications') showNotifications();
  if (action === 'show-api-guide') showApiGuide();

  if (action === 'send-reminder') {
    const appointment=state.appointments.find(a=>a.id===target.dataset.id);
    const customer=appointment && customerById(appointment.customerId);
    const template=state.messageTemplates.find(t=>t.metaName==='appointment_reminder_tr');
    if(!appointment||!customer||!template) return;
    await api.sendWhatsApp({customerId:customer.id,appointmentId:appointment.id,templateId:template.id,to:customer.phone},state);
    toast(`${customer.name} için WhatsApp hatırlatması gönderildi (demo).`);
    closeModal(); renderDashboard();
  }

  if (action === 'set-appointment-status') {
    await api.updateAppointment(target.dataset.id,{status:target.dataset.status},state);
    toast(`Randevu durumu “${statusMap[target.dataset.status][0]}” olarak güncellendi.`);
    closeModal(); renderDashboard();
  }

  if (action === 'advance-lead') {
    const lead=state.leads.find(l=>l.id===target.dataset.id); if(!lead) return;
    const order=['new','contacted','proposal','won'];
    const next=order[Math.min(order.indexOf(lead.stage)+1,order.length-1)];
    await api.updateLead(lead.id,{stage:next},state); toast(`${lead.name} “${statusMap[next][0]}” aşamasına taşındı.`); renderDashboard();
  }

  if (action === 'complete-task') {
    const task=state.tasks.find(t=>t.id===target.dataset.id); if(!task) return;
    task.status=target.checked?'done':'open'; await api.persist(state); toast('Görev durumu güncellendi.','info'); renderDashboard();
  }

  if (action === 'export-data') { api.exportState(state); toast('Demo verisi JSON olarak indirildi.'); }
  if (action === 'import-data') {
    const input=document.createElement('input'); input.type='file'; input.accept='application/json';
    input.onchange=async()=>{try{state=await api.importState(input.files[0]);toast('Yedek başarıyla içe aktarıldı.');renderDashboard();}catch(error){toast(error.message,'danger')}}; input.click();
  }
  if (action === 'reset-demo') {
    state=await api.resetDemo(); toast('Demo verileri başlangıç durumuna döndürüldü.','info'); renderDashboard();
  }
  if (action === 'test-whatsapp') {
    const appointment=state.appointments.find(a=>a.start.slice(0,10)===todayISO());
    if(appointment){await api.sendWhatsApp({customerId:appointment.customerId,appointmentId:appointment.id,templateId:'tpl-1',to:customerById(appointment.customerId)?.phone},state);toast('Test WhatsApp mesajı gönderim kuyruğuna eklendi.');renderDashboard();}
  }
  if (action === 'save-settings') toast('Demo ayarları kaydedildi.');
  if (['new-task','new-lead','new-service','new-staff','new-campaign','new-stock','new-payment'].includes(action)) toast('Bu genişletme ekranı demo kapsamına hazır; örnek akış başarıyla tetiklendi.','info');
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));

  if (form.id === 'customer-form') {
    const customer = {
      id: uid('cus'), name: data.name.trim(), phone: data.phone.trim(), email: data.email.trim(),
      birthday: data.birthday || null, gender: 'Belirtilmedi', tags: ['Yeni'], source: data.source,
      lastVisit: null, nextVisit: null, totalVisits: 0, totalSpent: 0, balance: 0,
      consent: Boolean(form.elements.consent.checked), notes: data.notes.trim(),
      preferredStaffId: data.preferredStaffId || null, status: 'active', createdAt: todayISO()
    };
    await api.createCustomer(customer, state); toast(`${customer.name} müşteri listesine eklendi.`); closeModal(); currentView='customers'; setHash('dashboard/customers');
  }

  if (form.id === 'appointment-form') {
    const service=serviceById(data.serviceId); const start=new Date(data.start); const end=new Date(start.getTime()+(service?.duration||60)*60000);
    const appointment = {
      id: uid('apt'), customerId: data.customerId, serviceId: data.serviceId, staffId: data.staffId,
      start: start.toISOString(), end: end.toISOString(), status: data.status, channel: data.channel,
      price: service?.price || 0, paid: Number(data.paid)||0,
      reminder: form.elements.reminder.checked?'scheduled':'not_scheduled', note: data.note.trim()
    };
    await api.createAppointment(appointment,state);
    const customer=customerById(appointment.customerId); if(customer) customer.nextVisit=appointment.start.slice(0,10);
    await api.persist(state); toast('Randevu oluşturuldu ve takvime eklendi.'); closeModal(); currentView='appointments'; setHash('dashboard/appointments');
  }
}

function handleInput(event) {
  if (event.target.id === 'customer-search') {
    customerSearch = event.target.value;
    const content=document.getElementById('dashboard-content');
    if(content) content.innerHTML=renderCustomers();
    const input=document.getElementById('customer-search'); if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length);}
  }
}

async function init() {
  state = await api.bootstrap();
  try { integrationStatus = await api.integrationStatus(); } catch (error) { console.warn(error); }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('input', handleInput);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k') { event.preventDefault(); currentView='customers'; setHash('dashboard/customers'); setTimeout(()=>document.getElementById('customer-search')?.focus(),50); }
    if (event.key==='Escape') closeModal();
  });
  route();
}

init().catch(error => {
  console.error(error);
  app.innerHTML = `<div class="fatal"><h1>DraBornTest başlatılamadı</h1><p>${escapeHTML(error.message)}</p><button onclick="localStorage.clear();location.reload()">Demo veriyi temizle ve yeniden dene</button></div>`;
});
