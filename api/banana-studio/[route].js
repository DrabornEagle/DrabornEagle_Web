// Optional bridge to a fully configured, dedicated upstream Banana deployment.
// Local galleries do not need a database or an API key.
const routes = new Set(['workspace-config','gemini-status','gemini-generate','openai-text-generate','openrouter-text-generate','openai-image-generate','openai-image-enqueue','openai-image-recover','fal-image-generate','fal-status','fal-h3-video','fal-video-scale','evolink-generate','evolink-status','seedance-video','youtube','youtube-status','provider-usage','folder-share','shared-folder']);
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // The public website is served by GitHub Pages; its API may live on Vercel.
  const requestOrigin = req.headers.origin;
  const allowedOrigins = new Set(['https://www.draborneagle.com', 'https://draborneagle.com', 'https://draborneagle.github.io']);
  if (requestOrigin) {
    if (!allowedOrigins.has(requestOrigin) && requestOrigin !== `https://${req.headers.host}`) return res.status(403).json({ error: 'Origin is not allowed.' });
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  }
  const route = Array.isArray(req.query.route) ? req.query.route[0] : req.query.route;
  if (!routes.has(route)) return res.status(404).json({ error: 'Unknown Banana-edits route.' });
  if (!['GET','POST','DELETE','OPTIONS'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed.' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  const configured = process.env.BANANA_WORKSPACE_ORIGIN;
  if (!configured) {
    if (req.method === 'GET' && route === 'workspace-config') return res.status(200).json({ mode: 'browser' });
    if (req.method === 'GET' && ['gemini-status','youtube-status'].includes(route)) return res.status(200).json({ configured: false, providers: {}, youtube: false });
    return res.status(503).json({ error: 'AI üretimi için özel Banana-edits sunucusu ve sağlayıcı anahtarı kurulmalıdır. Galeri ve yerel dosyalar kullanılabilir.', code: 'BANANA_SETUP_REQUIRED' });
  }
  try {
    const origin = new URL(configured);
    if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || origin.hostname === req.headers.host) throw new Error('Invalid workspace origin.');
    const target = new URL(`/api/${route}`, origin);
    for (const [key, value] of Object.entries(req.query)) if (key !== 'route') for (const item of Array.isArray(value) ? value : [value]) target.searchParams.append(key, String(item));
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) headers.Authorization = req.headers.authorization;
    const response = await fetch(target, { method: req.method, headers, redirect: 'error', signal: AbortSignal.timeout(280000),
      ...(['POST','DELETE'].includes(req.method) ? { body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}) } : {}) });
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.status(response.status).send(Buffer.from(await response.arrayBuffer()));
  } catch { return res.status(502).json({ error: 'Banana-edits sunucusuna ulaşılamadı. Yerel dosyaların korunuyor.' }); }
}
