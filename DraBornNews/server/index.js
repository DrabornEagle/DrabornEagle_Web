import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles, categories, dailyBrief, trendingTopics } from '../mock-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

loadEnv(path.join(ROOT, '.env'));
const PORT = Number(process.env.PORT || 4180);

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
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(JSON.stringify(payload));
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;
  if (req.method === 'GET' && pathname === '/api/health') {
    return json(res, 200, { ok: true, app: 'DraBornNews', version: '0.1.0-demo', mode: process.env.DATA_PROVIDER || 'mock', time: new Date().toISOString() });
  }
  if (req.method === 'GET' && pathname === '/api/bootstrap') {
    return json(res, 200, { articles, categories, dailyBrief, trendingTopics, meta: { demo: true, version: 1 } });
  }
  if (req.method === 'GET' && pathname === '/api/articles') {
    const category = searchParams.get('category');
    const query = (searchParams.get('q') || '').trim().toLocaleLowerCase('tr-TR');
    const result = articles.filter((article) => {
      const categoryMatch = !category || category === 'all' || article.category === category;
      const queryMatch = !query || [article.title, article.summary, article.categoryLabel, ...article.sourceNames].join(' ').toLocaleLowerCase('tr-TR').includes(query);
      return categoryMatch && queryMatch;
    });
    return json(res, 200, { items: result, total: result.length });
  }
  if (req.method === 'GET' && pathname.startsWith('/api/articles/')) {
    const id = decodeURIComponent(pathname.slice('/api/articles/'.length));
    const article = articles.find((item) => item.id === id);
    return article ? json(res, 200, article) : json(res, 404, { error: 'Haber bulunamadı.' });
  }
  if (req.method === 'GET' && pathname === '/api/sources') {
    const sourceMap = new Map();
    for (const article of articles) {
      for (const source of article.sourceNames) sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    }
    return json(res, 200, { items: [...sourceMap].map(([name, articleCount]) => ({ name, articleCount })) });
  }
  return false;
}

function safeFilePath(pathname) {
  const decoded = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  const target = path.resolve(ROOT, `.${normalized.startsWith('/') ? normalized : `/${normalized}`}`);
  return target.startsWith(ROOT) ? target : null;
}

async function serveStatic(res, pathname) {
  const filePath = safeFilePath(pathname);
  if (!filePath) return json(res, 403, { error: 'Erişim reddedildi.' });
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('Dosya değil');
    const extension = path.extname(filePath).toLowerCase();
    const content = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    res.end(content);
  } catch {
    if (pathname !== '/index.html') return serveStatic(res, '/index.html');
    json(res, 404, { error: 'Dosya bulunamadı.' });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, url);
      if (handled !== false) return;
      return json(res, 404, { error: 'API uç noktası bulunamadı.' });
    }
    await serveStatic(res, url.pathname);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) json(res, 500, { error: 'Sunucu hatası.' });
    else res.end();
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`DraBornNews http://localhost:${PORT} adresinde çalışıyor.`);
});
