import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getDemoState } from '../mock-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

loadEnv(path.join(ROOT, '.env'));

const PORT = Number(process.env.PORT || 4173);
const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || 'mock';
const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v23.0';
let store = getDemoState();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(JSON.stringify(payload));
}

function text(res, status, payload, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType, 'X-Content-Type-Options': 'nosniff' });
  res.end(payload);
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2_000_000) throw new Error('İstek gövdesi çok büyük.');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function sanitizePhone(value = '') {
  return String(value).replace(/\D/g, '');
}

function integrationStatus() {
  return {
    mode: process.env.DATA_PROVIDER || 'mock',
    whatsapp: {
      configured: WHATSAPP_PROVIDER === 'meta' && Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
      provider: WHATSAPP_PROVIDER
    },
    database: {
      configured: Boolean(process.env.DATABASE_URL || process.env.SUPABASE_URL),
      provider: process.env.DATABASE_URL ? 'postgresql' : process.env.SUPABASE_URL ? 'supabase' : 'memory'
    },
    calendar: {
      configured: Boolean(process.env.GOOGLE_CALENDAR_CLIENT_ID && process.env.GOOGLE_CALENDAR_CLIENT_SECRET),
      provider: process.env.GOOGLE_CALENDAR_CLIENT_ID ? 'google' : 'mock'
    },
    payments: {
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
      provider: process.env.STRIPE_SECRET_KEY ? 'stripe' : 'mock'
    }
  };
}

async function sendWhatsApp(payload) {
  const customer = store.customers.find((item) => item.id === payload.customerId);
  const appointment = store.appointments.find((item) => item.id === payload.appointmentId);
  const template = store.messageTemplates.find((item) => item.id === payload.templateId);
  const to = sanitizePhone(payload.to || customer?.phone);

  if (!customer || !template || !to) {
    throw new Error('Müşteri, şablon veya hedef telefon eksik.');
  }

  if (WHATSAPP_PROVIDER !== 'meta') {
    const log = {
      id: `msg-${Date.now()}`,
      customerId: customer.id,
      appointmentId: appointment?.id || null,
      templateId: template.id,
      channel: 'whatsapp',
      sentAt: new Date().toISOString(),
      status: 'sent',
      provider: 'mock',
      cost: 0
    };
    store.messageLogs.unshift(log);
    if (appointment) appointment.reminder = 'sent';
    return { success: true, mock: true, messageId: log.id, status: 'sent' };
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) throw new Error('WhatsApp sunucu anahtarları eksik.');

  const service = appointment && store.services.find((item) => item.id === appointment.serviceId);
  const bodyParameters = appointment ? [
    customer.name,
    new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }).format(new Date(appointment.start)),
    new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(new Date(appointment.start)),
    service?.name || 'randevunuz'
  ] : [customer.name];

  const messagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: template.metaName,
      language: { code: payload.languageCode || 'tr' },
      components: [{
        type: 'body',
        parameters: bodyParameters.map((textValue) => ({ type: 'text', text: String(textValue) }))
      }]
    }
  };

  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messagePayload)
  });

  const result = await response.json();
  if (!response.ok) {
    const message = result?.error?.message || 'Meta WhatsApp gönderimi başarısız.';
    throw new Error(message);
  }

  const messageId = result?.messages?.[0]?.id || `meta-${Date.now()}`;
  store.messageLogs.unshift({
    id: messageId,
    customerId: customer.id,
    appointmentId: appointment?.id || null,
    templateId: template.id,
    channel: 'whatsapp',
    sentAt: new Date().toISOString(),
    status: 'sent',
    provider: 'meta',
    cost: null
  });
  if (appointment) appointment.reminder = 'sent';
  return { success: true, mock: false, messageId, status: 'sent', meta: result };
}

function verifyWebhookSignature(req, rawBody) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true;
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;
  const expected = `sha256=${crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
  const supplied = Buffer.from(String(signature));
  const target = Buffer.from(expected);
  return supplied.length === target.length && crypto.timingSafeEqual(supplied, target);
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;

  if (req.method === 'GET' && pathname === '/api/health') {
    return json(res, 200, { ok: true, app: 'DraBornTest CRM', version: '1.0.0-demo', time: new Date().toISOString() });
  }
  if (req.method === 'GET' && pathname === '/api/bootstrap') return json(res, 200, store);
  if (req.method === 'GET' && pathname === '/api/integrations/status') return json(res, 200, integrationStatus());

  if (req.method === 'PUT' && pathname === '/api/state') {
    const payload = await readJson(req);
    if (!payload?.customers || !payload?.appointments) return json(res, 400, { error: 'Geçersiz durum nesnesi.' });
    store = payload;
    return json(res, 200, { success: true });
  }

  if (req.method === 'POST' && pathname === '/api/reset-demo') {
    store = getDemoState();
    return json(res, 200, store);
  }

  if (req.method === 'POST' && pathname === '/api/customers') {
    const payload = await readJson(req);
    const customer = { ...payload, id: payload.id || `cus-${Date.now()}`, createdAt: payload.createdAt || new Date().toISOString().slice(0, 10) };
    store.customers.unshift(customer);
    return json(res, 201, customer);
  }

  if (req.method === 'POST' && pathname === '/api/appointments') {
    const payload = await readJson(req);
    const appointment = { ...payload, id: payload.id || `apt-${Date.now()}` };
    store.appointments.unshift(appointment);
    return json(res, 201, appointment);
  }

  const appointmentMatch = pathname.match(/^\/api\/appointments\/([^/]+)$/);
  if (req.method === 'PATCH' && appointmentMatch) {
    const appointment = store.appointments.find((item) => item.id === appointmentMatch[1]);
    if (!appointment) return json(res, 404, { error: 'Randevu bulunamadı.' });
    Object.assign(appointment, await readJson(req));
    return json(res, 200, appointment);
  }

  if (req.method === 'POST' && pathname === '/api/leads') {
    const payload = await readJson(req);
    const lead = { ...payload, id: payload.id || `lead-${Date.now()}` };
    store.leads.unshift(lead);
    return json(res, 201, lead);
  }

  const leadMatch = pathname.match(/^\/api\/leads\/([^/]+)$/);
  if (req.method === 'PATCH' && leadMatch) {
    const lead = store.leads.find((item) => item.id === leadMatch[1]);
    if (!lead) return json(res, 404, { error: 'Fırsat bulunamadı.' });
    Object.assign(lead, await readJson(req));
    return json(res, 200, lead);
  }

  if (req.method === 'POST' && pathname === '/api/whatsapp/send') {
    try {
      return json(res, 200, await sendWhatsApp(await readJson(req)));
    } catch (error) {
      return json(res, 400, { error: error.message });
    }
  }

  if (req.method === 'GET' && pathname === '/api/webhooks/whatsapp') {
    const mode = searchParams.get('hub.mode');
    const verifyToken = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');
    if (mode === 'subscribe' && verifyToken === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return text(res, 200, challenge || '');
    }
    return json(res, 403, { error: 'Webhook doğrulaması başarısız.' });
  }

  if (req.method === 'POST' && pathname === '/api/webhooks/whatsapp') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);
    if (!verifyWebhookSignature(req, rawBody)) return json(res, 401, { error: 'Geçersiz webhook imzası.' });

    let payload;
    try { payload = JSON.parse(rawBody.toString('utf8')); }
    catch { return json(res, 400, { error: 'Geçersiz JSON.' }); }

    const statuses = payload?.entry?.flatMap((entry) => entry.changes || [])
      .flatMap((change) => change.value?.statuses || []) || [];
    for (const status of statuses) {
      const log = store.messageLogs.find((item) => item.id === status.id);
      if (log) log.status = status.status;
    }
    console.log('[WhatsApp webhook]', JSON.stringify(payload));
    return json(res, 200, { received: true });
  }

  return json(res, 404, { error: 'API uç noktası bulunamadı.' });
}

async function serveStatic(req, res, url) {
  let requestedPath = decodeURIComponent(url.pathname);
  if (requestedPath === '/') requestedPath = '/index.html';
  const safePath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) return json(res, 403, { error: 'Erişim reddedildi.' });

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
    const content = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    res.end(content);
  } catch {
    if (!path.extname(requestedPath)) {
      const content = await readFile(path.join(ROOT, 'index.html'));
      return text(res, 200, content, 'text/html; charset=utf-8');
    }
    return json(res, 404, { error: 'Dosya bulunamadı.' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: 'Sunucu hatası.', detail: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`DraBornTest CRM çalışıyor: http://localhost:${PORT}`);
  console.log(`Veri sağlayıcı: ${process.env.DATA_PROVIDER || 'mock'} · WhatsApp: ${WHATSAPP_PROVIDER}`);
});
