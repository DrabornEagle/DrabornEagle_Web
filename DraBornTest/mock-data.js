const clone = (value) => JSON.parse(JSON.stringify(value));

const dateISO = (offset = 0) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const dateTimeISO = (offset, time) => `${dateISO(offset)}T${time}:00`;

const customers = [
  {
    id: 'cus-1001', name: 'Elif Yılmaz', phone: '+905321112233', email: 'elif@example.com',
    birthday: '1992-04-18', gender: 'Kadın', tags: ['VIP', 'Düzenli'], source: 'Instagram',
    lastVisit: dateISO(-9), nextVisit: dateISO(1), totalVisits: 18, totalSpent: 14250,
    balance: 0, consent: true, notes: 'Sessiz saatleri tercih ediyor. Saç boyası alerji testi notunu kontrol et.',
    preferredStaffId: 'staff-1', status: 'active', createdAt: dateISO(-420)
  },
  {
    id: 'cus-1002', name: 'Mert Kaya', phone: '+905441234567', email: 'mert.kaya@example.com',
    birthday: '1987-11-03', gender: 'Erkek', tags: ['Paket'], source: 'Google',
    lastVisit: dateISO(-2), nextVisit: dateISO(7), totalVisits: 11, totalSpent: 7350,
    balance: 750, consent: true, notes: 'Akşam 18:00 sonrası uygundur.',
    preferredStaffId: 'staff-2', status: 'active', createdAt: dateISO(-280)
  },
  {
    id: 'cus-1003', name: 'Derya Akın', phone: '+905551119988', email: 'derya@example.com',
    birthday: '1996-07-29', gender: 'Kadın', tags: ['Yeni'], source: 'Tavsiye',
    lastVisit: dateISO(-15), nextVisit: null, totalVisits: 2, totalSpent: 1450,
    balance: 0, consent: true, notes: 'İlk ziyaretinde memnun kaldı; 21 gün sonra takip mesajı gönder.',
    preferredStaffId: 'staff-3', status: 'active', createdAt: dateISO(-42)
  },
  {
    id: 'cus-1004', name: 'Ayşe Demir', phone: '+905331234890', email: 'ayse.demir@example.com',
    birthday: '1989-02-12', gender: 'Kadın', tags: ['VIP', 'Doğum Günü'], source: 'Web Randevu',
    lastVisit: dateISO(-31), nextVisit: dateISO(0), totalVisits: 27, totalSpent: 22900,
    balance: 0, consent: true, notes: 'Cilt bakım paketinde 2 seans kaldı.',
    preferredStaffId: 'staff-3', status: 'active', createdAt: dateISO(-690)
  },
  {
    id: 'cus-1005', name: 'Selin Koç', phone: '+905461001122', email: 'selin@example.com',
    birthday: '1999-09-07', gender: 'Kadın', tags: ['Riskli İptal'], source: 'Instagram',
    lastVisit: dateISO(-70), nextVisit: null, totalVisits: 5, totalSpent: 3350,
    balance: 0, consent: false, notes: 'Son iki randevuyu geç iptal etti. Ön ödeme öner.',
    preferredStaffId: 'staff-1', status: 'dormant', createdAt: dateISO(-330)
  },
  {
    id: 'cus-1006', name: 'Can Özkan', phone: '+905301234321', email: 'can@example.com',
    birthday: '1994-12-22', gender: 'Erkek', tags: ['Düzenli'], source: 'Tavsiye',
    lastVisit: dateISO(-12), nextVisit: dateISO(0), totalVisits: 14, totalSpent: 8100,
    balance: 0, consent: true, notes: 'Kısa saç + sakal paketi tercih ediyor.',
    preferredStaffId: 'staff-2', status: 'active', createdAt: dateISO(-510)
  },
  {
    id: 'cus-1007', name: 'Zeynep Arslan', phone: '+905421237777', email: 'zeynep@example.com',
    birthday: '1991-06-01', gender: 'Kadın', tags: ['Potansiyel VIP'], source: 'Google',
    lastVisit: dateISO(-4), nextVisit: dateISO(14), totalVisits: 8, totalSpent: 9800,
    balance: 0, consent: true, notes: 'Premium bakım paketine ilgi gösterdi.',
    preferredStaffId: 'staff-1', status: 'active', createdAt: dateISO(-160)
  },
  {
    id: 'cus-1008', name: 'Burak Şen', phone: '+905381234000', email: 'burak@example.com',
    birthday: '1985-05-14', gender: 'Erkek', tags: ['Yeni'], source: 'Yoldan Geçiş',
    lastVisit: dateISO(-1), nextVisit: null, totalVisits: 1, totalSpent: 650,
    balance: 0, consent: true, notes: 'İlk ziyaretten 28 gün sonra hatırlatma gönder.',
    preferredStaffId: 'staff-2', status: 'active', createdAt: dateISO(-1)
  }
];

const services = [
  { id: 'srv-1', category: 'Saç', name: 'Kadın Saç Kesimi', duration: 60, price: 850, color: '#8b5cf6', active: true, taxRate: 20 },
  { id: 'srv-2', category: 'Saç', name: 'Saç Boyama & Bakım', duration: 150, price: 2450, color: '#ec4899', active: true, taxRate: 20 },
  { id: 'srv-3', category: 'Erkek Bakım', name: 'Saç + Sakal', duration: 50, price: 650, color: '#06b6d4', active: true, taxRate: 20 },
  { id: 'srv-4', category: 'Güzellik', name: 'Cilt Bakımı', duration: 75, price: 1350, color: '#f59e0b', active: true, taxRate: 20 },
  { id: 'srv-5', category: 'Güzellik', name: 'Kaş & Kirpik', duration: 45, price: 700, color: '#10b981', active: true, taxRate: 20 },
  { id: 'srv-6', category: 'Eğitim', name: 'Birebir Özel Ders', duration: 60, price: 900, color: '#3b82f6', active: true, taxRate: 20 },
  { id: 'srv-7', category: 'Paket', name: 'Premium Bakım Paketi', duration: 180, price: 3900, color: '#f97316', active: true, taxRate: 20 },
  { id: 'srv-8', category: 'Danışmanlık', name: 'Ön Görüşme', duration: 30, price: 0, color: '#64748b', active: true, taxRate: 0 }
];

const team = [
  {
    id: 'staff-1', name: 'İrem Aydın', role: 'Kıdemli Kuaför', phone: '+905301112211',
    email: 'irem@demo.local', color: '#8b5cf6', active: true, commissionRate: 35,
    rating: 4.9, monthlyRevenue: 48750, occupancy: 82, services: ['srv-1', 'srv-2', 'srv-7'],
    workHours: { mon: '09:00-18:00', tue: '09:00-18:00', wed: 'off', thu: '11:00-20:00', fri: '11:00-20:00', sat: '09:00-18:00', sun: 'off' }
  },
  {
    id: 'staff-2', name: 'Emre Tunç', role: 'Berber', phone: '+905301113322',
    email: 'emre@demo.local', color: '#06b6d4', active: true, commissionRate: 30,
    rating: 4.8, monthlyRevenue: 32600, occupancy: 74, services: ['srv-3'],
    workHours: { mon: '10:00-20:00', tue: '10:00-20:00', wed: '10:00-20:00', thu: 'off', fri: '10:00-20:00', sat: '10:00-19:00', sun: 'off' }
  },
  {
    id: 'staff-3', name: 'Sude Korkmaz', role: 'Güzellik Uzmanı', phone: '+905301114433',
    email: 'sude@demo.local', color: '#f59e0b', active: true, commissionRate: 32,
    rating: 4.9, monthlyRevenue: 40300, occupancy: 78, services: ['srv-4', 'srv-5', 'srv-7'],
    workHours: { mon: 'off', tue: '09:00-18:00', wed: '09:00-18:00', thu: '09:00-18:00', fri: '09:00-18:00', sat: '09:00-18:00', sun: 'off' }
  },
  {
    id: 'staff-4', name: 'Deniz Çetin', role: 'Özel Ders Eğitmeni', phone: '+905301115544',
    email: 'deniz@demo.local', color: '#3b82f6', active: true, commissionRate: 40,
    rating: 4.7, monthlyRevenue: 21600, occupancy: 61, services: ['srv-6', 'srv-8'],
    workHours: { mon: '12:00-20:00', tue: '12:00-20:00', wed: '12:00-20:00', thu: '12:00-20:00', fri: 'off', sat: '10:00-16:00', sun: 'off' }
  }
];

const appointments = [
  { id: 'apt-2001', customerId: 'cus-1004', serviceId: 'srv-4', staffId: 'staff-3', start: dateTimeISO(0, '09:30'), end: dateTimeISO(0, '10:45'), status: 'confirmed', channel: 'Web', price: 1350, paid: 0, reminder: 'sent', note: 'Paket seansı 4/6' },
  { id: 'apt-2002', customerId: 'cus-1006', serviceId: 'srv-3', staffId: 'staff-2', start: dateTimeISO(0, '10:00'), end: dateTimeISO(0, '10:50'), status: 'completed', channel: 'Telefon', price: 650, paid: 650, reminder: 'read', note: '' },
  { id: 'apt-2003', customerId: 'cus-1001', serviceId: 'srv-2', staffId: 'staff-1', start: dateTimeISO(0, '11:00'), end: dateTimeISO(0, '13:30'), status: 'in_progress', channel: 'WhatsApp', price: 2450, paid: 1000, reminder: 'read', note: 'Alerji notunu kontrol et' },
  { id: 'apt-2004', customerId: 'cus-1003', serviceId: 'srv-5', staffId: 'staff-3', start: dateTimeISO(0, '13:30'), end: dateTimeISO(0, '14:15'), status: 'waiting', channel: 'Instagram', price: 700, paid: 0, reminder: 'delivered', note: '' },
  { id: 'apt-2005', customerId: 'cus-1002', serviceId: 'srv-6', staffId: 'staff-4', start: dateTimeISO(0, '15:00'), end: dateTimeISO(0, '16:00'), status: 'confirmed', channel: 'Web', price: 900, paid: 0, reminder: 'sent', note: 'Matematik - deneme analizi' },
  { id: 'apt-2006', customerId: 'cus-1007', serviceId: 'srv-7', staffId: 'staff-1', start: dateTimeISO(0, '16:30'), end: dateTimeISO(0, '19:30'), status: 'confirmed', channel: 'Web', price: 3900, paid: 1000, reminder: 'scheduled', note: 'Ön ödeme alındı' },
  { id: 'apt-2007', customerId: 'cus-1001', serviceId: 'srv-1', staffId: 'staff-1', start: dateTimeISO(1, '10:00'), end: dateTimeISO(1, '11:00'), status: 'confirmed', channel: 'WhatsApp', price: 850, paid: 0, reminder: 'scheduled', note: '' },
  { id: 'apt-2008', customerId: 'cus-1002', serviceId: 'srv-3', staffId: 'staff-2', start: dateTimeISO(7, '18:30'), end: dateTimeISO(7, '19:20'), status: 'pending', channel: 'Telefon', price: 650, paid: 0, reminder: 'not_scheduled', note: '' },
  { id: 'apt-2009', customerId: 'cus-1007', serviceId: 'srv-2', staffId: 'staff-1', start: dateTimeISO(14, '12:00'), end: dateTimeISO(14, '14:30'), status: 'confirmed', channel: 'Web', price: 2450, paid: 500, reminder: 'scheduled', note: '' },
  { id: 'apt-2010', customerId: 'cus-1005', serviceId: 'srv-1', staffId: 'staff-1', start: dateTimeISO(-8, '13:00'), end: dateTimeISO(-8, '14:00'), status: 'no_show', channel: 'Instagram', price: 850, paid: 0, reminder: 'read', note: 'Gelmedi' },
  { id: 'apt-2011', customerId: 'cus-1008', serviceId: 'srv-3', staffId: 'staff-2', start: dateTimeISO(-1, '17:00'), end: dateTimeISO(-1, '17:50'), status: 'completed', channel: 'Walk-in', price: 650, paid: 650, reminder: 'not_required', note: '' }
];

const leads = [
  { id: 'lead-1', name: 'Nehir Güneş', phone: '+905555551010', source: 'Instagram', interest: 'Premium Bakım Paketi', stage: 'new', value: 3900, nextAction: dateISO(0), ownerId: 'staff-1', note: 'DM üzerinden fiyat sordu.' },
  { id: 'lead-2', name: 'Kerem Bolat', phone: '+905555552020', source: 'Google', interest: 'Birebir Özel Ders', stage: 'contacted', value: 3600, nextAction: dateISO(1), ownerId: 'staff-4', note: '4 derslik paket için geri aranacak.' },
  { id: 'lead-3', name: 'Melis Uçar', phone: '+905555553030', source: 'Tavsiye', interest: 'Saç Boyama & Bakım', stage: 'proposal', value: 2450, nextAction: dateISO(2), ownerId: 'staff-1', note: 'Renk danışmanlığı tamamlandı.' },
  { id: 'lead-4', name: 'Onur Er', phone: '+905555554040', source: 'Web', interest: 'Saç + Sakal', stage: 'won', value: 650, nextAction: null, ownerId: 'staff-2', note: 'İlk randevu oluşturuldu.' }
];

const tasks = [
  { id: 'task-1', title: 'Derya Akın takip mesajı', type: 'follow_up', due: dateISO(0), priority: 'high', assigneeId: 'staff-3', status: 'open', relatedId: 'cus-1003' },
  { id: 'task-2', title: 'Haftalık kasa kontrolü', type: 'finance', due: dateISO(0), priority: 'medium', assigneeId: 'staff-1', status: 'open', relatedId: null },
  { id: 'task-3', title: 'Kerem Bolat paket teklifini ara', type: 'sales', due: dateISO(1), priority: 'high', assigneeId: 'staff-4', status: 'open', relatedId: 'lead-2' },
  { id: 'task-4', title: 'Eksilen saç bakım ürünlerini sipariş et', type: 'stock', due: dateISO(2), priority: 'medium', assigneeId: 'staff-1', status: 'open', relatedId: 'stock-2' },
  { id: 'task-5', title: 'Google yorumlarına cevap ver', type: 'marketing', due: dateISO(-1), priority: 'low', assigneeId: 'staff-2', status: 'done', relatedId: null }
];

const messageTemplates = [
  { id: 'tpl-1', name: 'Randevu Hatırlatma', metaName: 'appointment_reminder_tr', category: 'UTILITY', status: 'approved', body: 'Merhaba {{1}}, {{2}} tarihinde saat {{3}} için {{4}} randevunuzu hatırlatırız. Değişiklik için bu mesaja yanıt verebilirsiniz.' },
  { id: 'tpl-2', name: 'Randevu Onayı', metaName: 'appointment_confirmed_tr', category: 'UTILITY', status: 'approved', body: 'Randevunuz oluşturuldu ✅ {{1}} — {{2}}, {{3}}. Görüşmek üzere!' },
  { id: 'tpl-3', name: 'İptal Sonrası Takip', metaName: 'appointment_followup_tr', category: 'UTILITY', status: 'draft', body: 'Merhaba {{1}}, iptal edilen randevunuz için yeni bir saat belirlemek ister misiniz?' },
  { id: 'tpl-4', name: 'Doğum Günü Teklifi', metaName: 'birthday_offer_tr', category: 'MARKETING', status: 'pending', body: 'Doğum gününüz kutlu olsun {{1}} 🎉 Bu aya özel {{2}} fırsatınız hazır.' }
];

const messageLogs = [
  { id: 'msg-1', customerId: 'cus-1004', appointmentId: 'apt-2001', templateId: 'tpl-1', channel: 'whatsapp', sentAt: dateTimeISO(-1, '09:31'), status: 'read', provider: 'mock', cost: 0 },
  { id: 'msg-2', customerId: 'cus-1006', appointmentId: 'apt-2002', templateId: 'tpl-1', channel: 'whatsapp', sentAt: dateTimeISO(-1, '10:02'), status: 'read', provider: 'mock', cost: 0 },
  { id: 'msg-3', customerId: 'cus-1001', appointmentId: 'apt-2003', templateId: 'tpl-1', channel: 'whatsapp', sentAt: dateTimeISO(-1, '11:05'), status: 'delivered', provider: 'mock', cost: 0 },
  { id: 'msg-4', customerId: 'cus-1003', appointmentId: 'apt-2004', templateId: 'tpl-1', channel: 'whatsapp', sentAt: dateTimeISO(-1, '13:12'), status: 'delivered', provider: 'mock', cost: 0 }
];

const payments = [
  { id: 'pay-1', appointmentId: 'apt-2002', customerId: 'cus-1006', amount: 650, method: 'Kart', status: 'paid', paidAt: dateTimeISO(0, '10:48') },
  { id: 'pay-2', appointmentId: 'apt-2003', customerId: 'cus-1001', amount: 1000, method: 'Havale', status: 'partial', paidAt: dateTimeISO(0, '10:55') },
  { id: 'pay-3', appointmentId: 'apt-2006', customerId: 'cus-1007', amount: 1000, method: 'Kart', status: 'deposit', paidAt: dateTimeISO(-3, '14:20') },
  { id: 'pay-4', appointmentId: 'apt-2009', customerId: 'cus-1007', amount: 500, method: 'Kart', status: 'deposit', paidAt: dateTimeISO(-2, '19:12') },
  { id: 'pay-5', appointmentId: 'apt-2011', customerId: 'cus-1008', amount: 650, method: 'Nakit', status: 'paid', paidAt: dateTimeISO(-1, '17:48') }
];

const stock = [
  { id: 'stock-1', name: 'Profesyonel Şampuan 1L', sku: 'SMP-001', quantity: 14, minQuantity: 5, unit: 'adet', cost: 320, salePrice: 550, status: 'ok' },
  { id: 'stock-2', name: 'Saç Bakım Maskesi', sku: 'MSK-014', quantity: 3, minQuantity: 6, unit: 'adet', cost: 410, salePrice: 750, status: 'low' },
  { id: 'stock-3', name: 'Tek Kullanımlık Havlu', sku: 'HVU-100', quantity: 48, minQuantity: 20, unit: 'paket', cost: 85, salePrice: 0, status: 'ok' },
  { id: 'stock-4', name: 'Cilt Serumu 30ml', sku: 'SRM-030', quantity: 2, minQuantity: 4, unit: 'adet', cost: 690, salePrice: 1190, status: 'low' }
];

const campaigns = [
  { id: 'camp-1', name: 'Uyuyan Müşteri Geri Kazanım', audience: '60+ gündür gelmeyenler', channel: 'WhatsApp', status: 'draft', recipients: 37, sent: 0, conversions: 0, scheduledAt: null },
  { id: 'camp-2', name: 'Temmuz Doğum Günleri', audience: 'Bu ay doğan müşteriler', channel: 'WhatsApp', status: 'scheduled', recipients: 18, sent: 0, conversions: 0, scheduledAt: dateTimeISO(2, '10:00') },
  { id: 'camp-3', name: 'Premium Paket Tanıtımı', audience: '8.000 TL+ harcayanlar', channel: 'E-posta', status: 'completed', recipients: 42, sent: 42, conversions: 9, scheduledAt: dateTimeISO(-14, '11:00') }
];

const memberships = [
  { id: 'mem-1', customerId: 'cus-1004', name: '6 Seans Cilt Bakımı', totalUnits: 6, remainingUnits: 2, paidAmount: 6750, expiresAt: dateISO(90), status: 'active' },
  { id: 'mem-2', customerId: 'cus-1002', name: '4 Derslik Eğitim Paketi', totalUnits: 4, remainingUnits: 3, paidAmount: 3200, expiresAt: dateISO(45), status: 'active' }
];

const notifications = [
  { id: 'ntf-1', type: 'warning', title: '2 ürün kritik stokta', text: 'Saç Bakım Maskesi ve Cilt Serumu sipariş bekliyor.', createdAt: dateTimeISO(0, '08:15'), read: false },
  { id: 'ntf-2', type: 'success', title: 'Ön ödeme alındı', text: 'Zeynep Arslan randevusu için 1.000 TL ödeme kaydedildi.', createdAt: dateTimeISO(-3, '14:21'), read: false },
  { id: 'ntf-3', type: 'info', title: 'WhatsApp şablonu onay bekliyor', text: 'Doğum Günü Teklifi şablonu Meta incelemesinde.', createdAt: dateTimeISO(-1, '12:40'), read: true }
];

const auditLogs = [
  { id: 'log-1', actor: 'Demo Yönetici', action: 'Randevu oluşturdu', target: 'Elif Yılmaz / Kadın Saç Kesimi', createdAt: dateTimeISO(-1, '18:45') },
  { id: 'log-2', actor: 'İrem Aydın', action: 'Müşteri notunu güncelledi', target: 'Elif Yılmaz', createdAt: dateTimeISO(-2, '16:20') },
  { id: 'log-3', actor: 'Sude Korkmaz', action: 'Paket seansı kullandı', target: 'Ayşe Demir / 4. seans', createdAt: dateTimeISO(-7, '10:51') }
];

export const getDemoState = () => clone({
  meta: {
    generatedAt: new Date().toISOString(),
    demo: true,
    schemaVersion: 1
  },
  business: {
    id: 'biz-demo-1',
    name: 'Nova Studio',
    sector: 'Kuaför, Güzellik & Eğitim',
    phone: '+902423001122',
    email: 'merhaba@novastudio.demo',
    address: 'Lara, Muratpaşa / Antalya',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    branches: [
      { id: 'branch-1', name: 'Lara Merkez', address: 'Lara, Muratpaşa / Antalya', active: true },
      { id: 'branch-2', name: 'Konyaaltı Demo', address: 'Arapsuyu, Konyaaltı / Antalya', active: false }
    ],
    workingHours: {
      mon: ['09:00', '20:00'], tue: ['09:00', '20:00'], wed: ['09:00', '20:00'],
      thu: ['09:00', '20:00'], fri: ['09:00', '20:00'], sat: ['09:00', '19:00'], sun: null
    },
    bookingPolicy: { cancellationHours: 12, depositRequired: false, depositRate: 20, autoConfirm: true }
  },
  currentUser: {
    id: 'user-demo', name: 'Demo Yönetici', email: 'demo@draborntest.local', role: 'İşletme Sahibi',
    permissions: ['*']
  },
  customers,
  services,
  team,
  appointments,
  leads,
  tasks,
  messageTemplates,
  messageLogs,
  payments,
  stock,
  campaigns,
  memberships,
  notifications,
  auditLogs
});
