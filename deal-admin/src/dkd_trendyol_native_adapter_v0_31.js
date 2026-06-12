const dkdQueries = ['iphone', 'samsung telefon', 'playstation 5', 'airfryer', 'robot süpürge', 'laptop', 'kulaklık'];
const dkdEndpointBases = [
  'https://apigw.trendyol.com/discovery-web-searchgw-service/v2/api/infinite-scroll/sr',
  'https://public.trendyol.com/discovery-web-searchgw-service/v2/api/infinite-scroll/sr',
  'https://public-mdc.trendyol.com/discovery-web-searchgw-service/v2/api/infinite-scroll/sr'
];

function dkdSleep(dkdMs) { return new Promise((resolve) => setTimeout(resolve, dkdMs)); }
function dkdNum(dkdValue) { const dkdParsed = Number(String(dkdValue ?? '').replace(',', '.').replace(/[^0-9.]/g, '')); return Number.isFinite(dkdParsed) && dkdParsed > 0 ? dkdParsed : null; }
function dkdText(dkdValue) { return String(dkdValue || '').trim(); }
function dkdSlug(dkdValue) { return dkdText(dkdValue).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

function dkdGet(dkdObject, dkdPath) {
  let dkdCurrent = dkdObject;
  for (const dkdKey of dkdPath.split('.')) {
    if (!dkdCurrent || typeof dkdCurrent !== 'object') return undefined;
    dkdCurrent = dkdCurrent[dkdKey];
  }
  return dkdCurrent;
}

function dkdFirstNumber(dkdObject, dkdPaths) {
  for (const dkdPath of dkdPaths) {
    const dkdValue = dkdNum(dkdGet(dkdObject, dkdPath));
    if (dkdValue) return dkdValue;
  }
  return null;
}

function dkdBuildEndpoint(dkdBase, dkdQuery, dkdPage) {
  const dkdUrl = new URL(dkdBase);
  dkdUrl.searchParams.set('q', dkdQuery);
  dkdUrl.searchParams.set('pi', String(dkdPage));
  dkdUrl.searchParams.set('culture', 'tr-TR');
  dkdUrl.searchParams.set('userGenderId', '1');
  return dkdUrl.toString();
}

function dkdProductUrl(dkdProduct) {
  const dkdRaw = dkdProduct.url || dkdProduct.urlWithBoutiques || dkdProduct.productUrl || dkdProduct.link;
  if (dkdRaw) {
    try { return new URL(dkdRaw, 'https://www.trendyol.com').toString(); } catch {}
  }
  const dkdId = dkdProduct.id || dkdProduct.contentId || dkdProduct.productId;
  const dkdName = dkdProduct.name || dkdProduct.title || dkdProduct.productName;
  if (!dkdId || !dkdName) return null;
  return `https://www.trendyol.com/${dkdSlug(dkdName)}-p-${dkdId}`;
}

function dkdImageUrl(dkdProduct) {
  const dkdImages = dkdProduct.images || dkdProduct.imageUrls || dkdProduct.imageUrl;
  const dkdPicked = Array.isArray(dkdImages) ? dkdImages[0] : dkdImages;
  if (!dkdPicked) return null;
  const dkdClean = typeof dkdPicked === 'string' ? dkdPicked : dkdPicked.url || dkdPicked.baseUrl;
  if (!dkdClean) return null;
  if (/^https?:\/\//i.test(dkdClean)) return dkdClean;
  return `https://cdn.dsmcdn.com${String(dkdClean).startsWith('/') ? '' : '/'}${dkdClean}`;
}

function dkdExtractProduct(dkdProduct) {
  if (!dkdProduct || typeof dkdProduct !== 'object') return null;
  const dkdName = dkdText(dkdProduct.name || dkdProduct.title || dkdProduct.productName);
  const dkdUrl = dkdProductUrl(dkdProduct);
  if (!dkdName || !dkdUrl || !dkdUrl.includes('trendyol.com')) return null;
  const dkdCurrent = dkdFirstNumber(dkdProduct, ['price.discountedPrice.value', 'price.sellingPrice.value', 'price.originalPrice.value', 'sellingPrice.value', 'discountedPrice.value', 'price.value', 'price']);
  const dkdOriginal = dkdFirstNumber(dkdProduct, ['price.originalPrice.value', 'price.marketPrice.value', 'price.rrp.value', 'originalPrice.value', 'marketPrice.value', 'strikeThroughPrice.value', 'listPrice.value']);
  const dkdRating = dkdFirstNumber(dkdProduct, ['ratingScore.averageRating', 'ratingScore', 'rating.averageRating']);
  const dkdReviews = dkdFirstNumber(dkdProduct, ['ratingScore.totalCount', 'ratingScore.commentCount', 'reviewCount', 'commentCount']);
  const dkdDiscountPercent = dkdCurrent && dkdOriginal && dkdOriginal > dkdCurrent ? Math.round(((dkdOriginal - dkdCurrent) / dkdOriginal) * 100) : 0;
  return {
    dkd_source_key: 'trendyol',
    dkd_product_name: dkdName,
    dkd_product_url: dkdUrl,
    dkd_url: dkdUrl,
    dkd_image_url: dkdImageUrl(dkdProduct),
    dkd_currency_code: 'TRY',
    dkd_current_price: dkdCurrent,
    dkd_original_price: dkdOriginal,
    dkd_discount_percent: dkdDiscountPercent,
    dkd_stock_status: 'in_stock',
    dkd_rating: dkdRating,
    dkd_review_count: dkdReviews,
    dkd_raw_payload: { dkd_parser_version: 'trendyol_native_v0_31', dkd_native_id: dkdProduct.id || dkdProduct.contentId || dkdProduct.productId }
  };
}

function dkdWalkProducts(dkdValue, dkdOut = []) {
  if (!dkdValue || dkdOut.length >= 120) return dkdOut;
  if (Array.isArray(dkdValue)) { for (const dkdItem of dkdValue) dkdWalkProducts(dkdItem, dkdOut); return dkdOut; }
  if (typeof dkdValue !== 'object') return dkdOut;
  const dkdProduct = dkdExtractProduct(dkdValue);
  if (dkdProduct) dkdOut.push(dkdProduct);
  for (const dkdChild of Object.values(dkdValue)) {
    if (dkdOut.length >= 120) break;
    if (dkdChild && typeof dkdChild === 'object') dkdWalkProducts(dkdChild, dkdOut);
  }
  return dkdOut;
}

async function dkdFetchJson(dkdUrl) {
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), Number(process.env.DKD_TRENDYOL_NATIVE_TIMEOUT_MS || 16000));
  try {
    const dkdResponse = await fetch(dkdUrl, {
      signal: dkdController.signal,
      headers: {
        accept: 'application/json,text/plain,*/*',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
        origin: 'https://www.trendyol.com',
        referer: 'https://www.trendyol.com/',
        'user-agent': process.env.DKD_GATEWAY_USER_AGENT || 'Mozilla/5.0 (Linux; Android 15; DraBornBee/0.31) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
      }
    });
    const dkdTextBody = await dkdResponse.text();
    if (!dkdResponse.ok) throw new Error(`HTTP ${dkdResponse.status} ${dkdTextBody.slice(0, 80)}`);
    return JSON.parse(dkdTextBody);
  } finally {
    clearTimeout(dkdTimer);
  }
}

export async function dkdDiscoverTrendyolNativeV031() {
  const dkdMap = new Map();
  const dkdLogs = [];
  for (const dkdQuery of dkdQueries) {
    for (const dkdBase of dkdEndpointBases) {
      for (const dkdPage of [1, 2]) {
        const dkdEndpoint = dkdBuildEndpoint(dkdBase, dkdQuery, dkdPage);
        try {
          const dkdJson = await dkdFetchJson(dkdEndpoint);
          const dkdProducts = dkdWalkProducts(dkdJson, []);
          for (const dkdProduct of dkdProducts) if (!dkdMap.has(dkdProduct.dkd_product_url)) dkdMap.set(dkdProduct.dkd_product_url, dkdProduct);
          dkdLogs.push({ dkd_query: dkdQuery, dkd_host: new URL(dkdBase).hostname, dkd_page: dkdPage, dkd_found: dkdProducts.length });
        } catch (dkdError) {
          dkdLogs.push({ dkd_query: dkdQuery, dkd_host: new URL(dkdBase).hostname, dkd_page: dkdPage, dkd_error: String(dkdError?.message || dkdError).slice(0, 180) });
        }
        await dkdSleep(250);
      }
      if (dkdMap.size >= Number(process.env.DKD_TRENDYOL_NATIVE_LIMIT || 80)) break;
    }
    if (dkdMap.size >= Number(process.env.DKD_TRENDYOL_NATIVE_LIMIT || 80)) break;
  }
  return { dkd_source_key: 'trendyol_native_v0_31', dkd_product_count: dkdMap.size, dkd_products: Array.from(dkdMap.values()), dkd_product_urls: Array.from(dkdMap.keys()), dkd_logs: dkdLogs };
}
