const dkdQueries = ['telefon', 'playstation', 'airfryer', 'robot süpürge', 'laptop', 'kulaklık'];

function dkdSleep(dkdMs) {
  return new Promise((resolve) => setTimeout(resolve, dkdMs));
}

function dkdSlug(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function dkdProductUrl(dkdProduct) {
  const dkdRawUrl = dkdProduct?.url || dkdProduct?.urlWithBoutiques || dkdProduct?.productUrl || dkdProduct?.link || '';
  if (dkdRawUrl) {
    try { return new URL(dkdRawUrl, 'https://www.trendyol.com').toString(); } catch {}
  }
  const dkdId = dkdProduct?.id || dkdProduct?.contentId || dkdProduct?.productId;
  const dkdName = dkdProduct?.name || dkdProduct?.title || dkdProduct?.productName || 'urun';
  if (!dkdId) return null;
  return `https://www.trendyol.com/${dkdSlug(dkdName)}-p-${dkdId}`;
}

function dkdCollectProducts(dkdValue, dkdProducts = []) {
  if (!dkdValue || dkdProducts.length >= 80) return dkdProducts;
  if (Array.isArray(dkdValue)) {
    for (const dkdItem of dkdValue) dkdCollectProducts(dkdItem, dkdProducts);
    return dkdProducts;
  }
  if (typeof dkdValue !== 'object') return dkdProducts;
  const dkdUrl = dkdProductUrl(dkdValue);
  if (dkdUrl && /trendyol\.com\/.+(-p-|p-)/i.test(dkdUrl)) dkdProducts.push(dkdUrl);
  for (const dkdChild of Object.values(dkdValue)) {
    if (dkdProducts.length >= 80) break;
    if (dkdChild && typeof dkdChild === 'object') dkdCollectProducts(dkdChild, dkdProducts);
  }
  return dkdProducts;
}

async function dkdFetchJson(dkdUrl) {
  const dkdResponse = await fetch(dkdUrl, {
    headers: {
      accept: 'application/json,text/plain,*/*',
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
      origin: 'https://www.trendyol.com',
      referer: 'https://www.trendyol.com/',
      'user-agent': process.env.DKD_GATEWAY_USER_AGENT || 'Mozilla/5.0 (Linux; Android 15; DraBornBee/0.26) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
    }
  });
  if (!dkdResponse.ok) throw new Error(`Trendyol API HTTP ${dkdResponse.status}`);
  return await dkdResponse.json();
}

export async function dkdDiscoverTrendyolApiUrlsV026() {
  const dkdFound = new Set();
  const dkdLogs = [];
  for (const dkdQuery of dkdQueries) {
    for (const dkdPage of [1, 2]) {
      const dkdUrl = `https://public.trendyol.com/discovery-web-searchgw-service/v2/api/infinite-scroll/sr?q=${encodeURIComponent(dkdQuery)}&pi=${dkdPage}&culture=tr-TR`;
      try {
        const dkdJson = await dkdFetchJson(dkdUrl);
        const dkdUrls = dkdCollectProducts(dkdJson, []);
        for (const dkdProductUrl of dkdUrls) dkdFound.add(dkdProductUrl);
        dkdLogs.push({ dkd_query: dkdQuery, dkd_page: dkdPage, dkd_found: dkdUrls.length });
      } catch (dkdError) {
        dkdLogs.push({ dkd_query: dkdQuery, dkd_page: dkdPage, dkd_error: dkdError?.message || String(dkdError) });
      }
      await dkdSleep(350);
    }
  }
  return { dkd_source_key: 'trendyol_api', dkd_product_urls: Array.from(dkdFound), dkd_product_url_count: dkdFound.size, dkd_logs: dkdLogs };
}
