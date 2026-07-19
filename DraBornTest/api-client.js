import { getDemoState } from './mock-data.js';

const STORAGE_KEY = 'draborntest-crm-state-v1';
const CONFIG = window.DRABORN_CONFIG || { apiMode: 'mock', apiBaseUrl: '/api' };

const clone = (value) => JSON.parse(JSON.stringify(value));

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDemoState();
    const parsed = JSON.parse(raw);
    return parsed?.meta?.schemaVersion === 1 ? parsed : getDemoState();
  } catch (error) {
    console.warn('Demo state okunamadı, varsayılan veri yükleniyor.', error);
    return getDemoState();
  }
}

function saveLocalState(state) {
  const copy = clone(state);
  copy.meta = {
    ...(copy.meta || {}),
    demo: true,
    schemaVersion: 1,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  return copy;
}

async function request(path, options = {}) {
  const response = await fetch(`${CONFIG.apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });

  if (!response.ok) {
    let message = `API isteği başarısız (${response.status})`;
    try {
      const payload = await response.json();
      message = payload.error || payload.message || message;
    } catch {
      // JSON olmayan hata yanıtını göz ardı et.
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

export const api = {
  mode: CONFIG.apiMode,

  async bootstrap() {
    if (CONFIG.apiMode === 'api') return request('/bootstrap');
    return loadLocalState();
  },

  async persist(state) {
    if (CONFIG.apiMode === 'api') {
      await request('/state', { method: 'PUT', body: state });
      return state;
    }
    return saveLocalState(state);
  },

  async resetDemo() {
    const state = getDemoState();
    if (CONFIG.apiMode === 'api') {
      return request('/reset-demo', { method: 'POST' });
    }
    localStorage.removeItem(STORAGE_KEY);
    return state;
  },

  async createCustomer(customer, state) {
    if (CONFIG.apiMode === 'api') return request('/customers', { method: 'POST', body: customer });
    state.customers.unshift(customer);
    saveLocalState(state);
    return customer;
  },

  async createAppointment(appointment, state) {
    if (CONFIG.apiMode === 'api') return request('/appointments', { method: 'POST', body: appointment });
    state.appointments.unshift(appointment);
    saveLocalState(state);
    return appointment;
  },

  async updateAppointment(id, updates, state) {
    if (CONFIG.apiMode === 'api') return request(`/appointments/${id}`, { method: 'PATCH', body: updates });
    const appointment = state.appointments.find((item) => item.id === id);
    if (!appointment) throw new Error('Randevu bulunamadı.');
    Object.assign(appointment, updates);
    saveLocalState(state);
    return appointment;
  },

  async createLead(lead, state) {
    if (CONFIG.apiMode === 'api') return request('/leads', { method: 'POST', body: lead });
    state.leads.unshift(lead);
    saveLocalState(state);
    return lead;
  },

  async updateLead(id, updates, state) {
    if (CONFIG.apiMode === 'api') return request(`/leads/${id}`, { method: 'PATCH', body: updates });
    const lead = state.leads.find((item) => item.id === id);
    if (!lead) throw new Error('Potansiyel müşteri bulunamadı.');
    Object.assign(lead, updates);
    saveLocalState(state);
    return lead;
  },

  async sendWhatsApp(payload, state) {
    if (CONFIG.apiMode === 'api') return request('/whatsapp/send', { method: 'POST', body: payload });

    const log = {
      id: `msg-${Date.now()}`,
      customerId: payload.customerId,
      appointmentId: payload.appointmentId || null,
      templateId: payload.templateId,
      channel: 'whatsapp',
      sentAt: new Date().toISOString(),
      status: 'sent',
      provider: 'mock',
      cost: 0
    };

    state.messageLogs.unshift(log);
    if (payload.appointmentId) {
      const appointment = state.appointments.find((item) => item.id === payload.appointmentId);
      if (appointment) appointment.reminder = 'sent';
    }
    saveLocalState(state);
    return { success: true, mock: true, messageId: log.id, status: 'sent' };
  },

  async integrationStatus() {
    if (CONFIG.apiMode === 'api') return request('/integrations/status');
    return {
      mode: 'mock',
      whatsapp: { configured: false, provider: 'mock' },
      database: { configured: false, provider: 'localStorage' },
      calendar: { configured: false, provider: 'mock' },
      payments: { configured: false, provider: 'mock' }
    };
  },

  exportState(state) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `draborntest-demo-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  async importState(file) {
    const text = await file.text();
    const state = JSON.parse(text);
    if (!state?.customers || !state?.appointments || !state?.meta) {
      throw new Error('Geçersiz DraBornTest yedek dosyası.');
    }
    return saveLocalState(state);
  }
};
