import { gunzipSync } from 'zlib';

const dkdAdapters = [
  {
    dkd_key: 'trendyol',
    dkd_name: 'Trendyol',
    dkd_home: 'https://www.trendyol.com',
    dkd_seed_paths: ['/sr?q=telefon', '/sr?q=playstation', '/sr?q=airfryer', '/sr?q=robot%20s%C3%BCp%C3%BCrge'],
    dkd_sitemap_paths: ['/robots.txt', '/sitemap.xml', '/sitemap_index.xml', '/sitemap/sitemap.xml'],
    dkd_product_regexes: [/https?:\/\/(?:www\.)?trendyol\.com\/[^"'\s<>]+?-p-\d+[^"'\s<>]*/gi, /\/[^"'\s<>]+?-p-\d+[^"'\s<>]*/gi]
  },
  {
    dkd_key: 'hepsiburada',
    dkd_name: 'Hepsiburada',
    dkd_home: 'https://www.hepsiburada.com',
    dkd_seed_paths: ['/ara?q=telefon', '/ara?q=playstation', '/ara?q=airfryer', '/ara?q=robot%20s%C3%BCp%C3%BCrge'],
    dkd_sitemap_paths: ['/robots.txt', '/sitemap.xml', '/sitemapindex.xml', '/sitemap_index.xml', '/sitemap/sitemap.xml'],
    dkd_product_regexes: [/https?:\/\/(?:www\.)?hepsiburada\.com\/[^"'\s<>]+?-p-[A-Z0-9]+[^"'\s<>]*/gi, /\/[^"'\s<>]+?-p-[A-Z0-9]+[^"'\s<>]*/gi]
  }
];

function dkdSleep(dkdMs) {
  return new Promise((resolve) => setTimeout(resolve, dkdMs));
}

function dkdErrorText(dkdError) {
  if (!dkdError) return 'Bilinmeyen hata';
  if (typeof dkdError === 'string') return dkdError || 'Bilinmeyen hata';
  if (dkdError.message) return String(dkdError.message || 'Bilinmeyen hata');
  try {
    const dkdJson = JSON.stringify(dkdError);
    return dkdJson && dkdJson !== '{}' ? dkdJson : 'Bilinmeyen hata';
  } catch {
    return String(dkdError);
  }
}

function dkdCleanUrl(dkdUrl) {
  return String(dkdUrl || '')
    .replace(/&amp;/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/%5C/g, '')
    .replace(/["'<>\s]+$/g, '')
    .trim();
}

function dkdAbsoluteUrl(dkdBase, dkdPath) {
  try {
    return new URL(dkdCleanUrl(dkdPath), dkdBase).toString();
  } catch {
    return null;
  }
}

export function dkdNormalizeAdapterProductUrl(dkdRawUrl, dkdBaseUrl) {
  try {
    const dkdUrl = new URL(dkdCleanUrl(dkdRawUrl), dkdBaseUrl);
    dkdUrl.hash = '';
    const dkdHost = dkdUrl.hostname.toLowerCase().replace(/^www\./, '');
    const dkdPath = dkdUrl.pathname.toLowerCase();

    if (dkdHost.includes('trendyol.com')) {
      if (!dkdPath.includes('-p-')) return null;
      return `https://www.trendyol.com${dkdUrl.pathname}${dkdUrl.search}`;
    }

    if (dkdHost.includes('hepsiburada.com')) {
      if (!dkdPath.includes('-p-')) return null;
      return `https://www.hepsiburada.com${dkdUrl.pathname}${dkdUrl.search}`;
    }

    return null;
  } catch {
    return null;
  }
}

async function dkdFetchText(dkdUrl, dkdOptions = {}) {
  const dkdTimeoutMs = Number(dkdOptions.dkd_timeout_ms || process.env.DKD_ADAPTER_TIMEOUT_MS || 18000);
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), dkdTimeoutMs);
  try {
    const dkdResponse = await fetch(dkdUrl, {
      signal: dkdController.signal,
      redirect: 'follow',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml,text/xml,text/plain,*/*;q=0.8',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'user-agent': process.env.DKD_GATEWAY_USER_AGENT || 'Mozilla/5.0 (Linux; Android 15; DraBornBeeAdapter/0.23) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
      }
    });
    const dkdArrayBuffer = await dkdResponse.arrayBuffer();
    let dkdBuffer = Buffer.from(dkdArrayBuffer);
    if (dkdUrl.endsWith('.gz') || (dkdBuffer[0] === 0x1f && dkdBuffer[1] === 0x8b)) {
      try { dkdBuffer = gunzipSync(dkdBuffer); } catch {}
    }
    const dkdText = dkdBuffer.toString('utf8');
    return { dkd_ok: dkdResponse.ok, dkd_url: dkdUrl, dkd_final_url: dkdResponse.url, dkd_status: dkdResponse.status, dkd_text_length: dkdText.length, dkd_text: dkdText };
  } finally {
    clearTimeout(dkdTimer);
  }
}

function dkdExtractLocUrls(dkdText) {
  const dkdFound = new Set();
  let dkdMatch;
  const dkdLocPattern = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  while ((dkdMatch = dkdLocPattern.exec(dkdText)) !== null) {
    dkdFound.add(dkdCleanUrl(dkdMatch[1]));
    if (dkdFound.size >= 1200) break;
  }
  const dkdSitemapPattern = /^\s*Sitemap:\s*(\S+)\s*$/gim;
  while ((dkdMatch = dkdSitemapPattern.exec(dkdText)) !== null) {
    dkdFound.add(dkdCleanUrl(dkdMatch[1]));
    if (dkdFound.size >= 1400) break;
  }
  const dkdPlainUrlPattern = /https?:\/\/[^\s"'<>]+/gi;
  while ((dkdMatch = dkdPlainUrlPattern.exec(dkdText)) !== null) {
    dkdFound.add(dkdCleanUrl(dkdMatch[0]));
    if (dkdFound.size >= 1800) break;
  }
  return Array.from(dkdFound);
}

function dkdLooksLikeSitemap(dkdUrl) {
  return /sitemap|site-map|\.xml|\.xml\.gz/i.test(String(dkdUrl || ''));
}

function dkdExtractSitemapUrls(dkdText, dkdBaseUrl) {
  return Array.from(new Set(dkdExtractLocUrls(dkdText)
    .map((dkdUrl) => dkdAbsoluteUrl(dkdBaseUrl, dkdUrl) || dkdUrl)
    .filter(dkdLooksLikeSitemap)));
}

function dkdExtractAdapterProductUrls(dkdAdapter, dkdText, dkdBaseUrl) {
  const dkdFound = new Set();
  const dkdAllCandidates = dkdExtractLocUrls(dkdText);

  for (const dkdRegex of dkdAdapter.dkd_product_regexes) {
    let dkdMatch;
    dkdRegex.lastIndex = 0;
    while ((dkdMatch = dkdRegex.exec(dkdText)) !== null) {
      dkdAllCandidates.push(dkdMatch[0]);
      if (dkdAllCandidates.length >= 3000) break;
    }
  }

  for (const dkdCandidate of dkdAllCandidates) {
    const dkdProductUrl = dkdNormalizeAdapterProductUrl(dkdCandidate, dkdBaseUrl);
    if (dkdProductUrl) dkdFound.add(dkdProductUrl);
    if (dkdFound.size >= Number(process.env.DKD_ADAPTER_PRODUCT_LIMIT || 120)) break;
  }

  return Array.from(dkdFound);
}

async function dkdDiscoverAdapter(dkdAdapter, dkdOptions = {}) {
  const dkdSitemapLimit = Math.max(4, Math.min(Number(dkdOptions.dkd_sitemap_limit || process.env.DKD_ADAPTER_SITEMAP_LIMIT || 25), 80));
  const dkdProductLimit = Math.max(1, Math.min(Number(dkdOptions.dkd_product_limit || process.env.DKD_ADAPTER_PRODUCT_LIMIT || 120), 500));
  const dkdLogs = [];
  const dkdProducts = new Set();
  const dkdQueue = [];
  const dkdVisited = new Set();

  for (const dkdPath of dkdAdapter.dkd_sitemap_paths) dkdQueue.push(dkdAbsoluteUrl(dkdAdapter.dkd_home, dkdPath));

  for (let dkdIndex = 0; dkdIndex < dkdQueue.length && dkdVisited.size < dkdSitemapLimit; dkdIndex += 1) {
    const dkdUrl = dkdQueue[dkdIndex];
    if (!dkdUrl || dkdVisited.has(dkdUrl)) continue;
    dkdVisited.add(dkdUrl);
    try {
      const dkdResult = await dkdFetchText(dkdUrl);
      dkdLogs.push({ dkd_type: 'sitemap', dkd_url: dkdUrl, dkd_status: dkdResult.dkd_status, dkd_text_length: dkdResult.dkd_text_length });
      const dkdProductUrls = dkdExtractAdapterProductUrls(dkdAdapter, dkdResult.dkd_text, dkdResult.dkd_final_url || dkdUrl);
      for (const dkdProductUrl of dkdProductUrls) {
        dkdProducts.add(dkdProductUrl);
        if (dkdProducts.size >= dkdProductLimit) break;
      }
      if (dkdProducts.size >= dkdProductLimit) break;
      const dkdNewSitemaps = dkdExtractSitemapUrls(dkdResult.dkd_text, dkdResult.dkd_final_url || dkdUrl);
      for (const dkdSitemapUrl of dkdNewSitemaps) {
        if (!dkdVisited.has(dkdSitemapUrl) && dkdQueue.length < dkdSitemapLimit * 5) dkdQueue.push(dkdSitemapUrl);
      }
    } catch (dkdError) {
      dkdLogs.push({ dkd_type: 'sitemap', dkd_url: dkdUrl, dkd_error: dkdErrorText(dkdError) });
    }
    await dkdSleep(500);
  }

  for (const dkdPath of dkdAdapter.dkd_seed_paths) {
    if (dkdProducts.size >= dkdProductLimit) break;
    const dkdSeedUrl = dkdAbsoluteUrl(dkdAdapter.dkd_home, dkdPath);
    try {
      const dkdResult = await dkdFetchText(dkdSeedUrl);
      dkdLogs.push({ dkd_type: 'seed', dkd_url: dkdSeedUrl, dkd_status: dkdResult.dkd_status, dkd_text_length: dkdResult.dkd_text_length });
      const dkdProductUrls = dkdExtractAdapterProductUrls(dkdAdapter, dkdResult.dkd_text, dkdResult.dkd_final_url || dkdSeedUrl);
      for (const dkdProductUrl of dkdProductUrls) {
        dkdProducts.add(dkdProductUrl);
        if (dkdProducts.size >= dkdProductLimit) break;
      }
    } catch (dkdError) {
      dkdLogs.push({ dkd_type: 'seed', dkd_url: dkdSeedUrl, dkd_error: dkdErrorText(dkdError) });
    }
    await dkdSleep(700);
  }

  return { dkd_source_key: dkdAdapter.dkd_key, dkd_source_name: dkdAdapter.dkd_name, dkd_checked_count: dkdVisited.size, dkd_product_url_count: dkdProducts.size, dkd_product_urls: Array.from(dkdProducts), dkd_logs: dkdLogs };
}

export async function dkdDiscoverProductsWithAdaptersV023(dkdOptions = {}) {
  const dkdResults = [];
  const dkdAllProducts = new Set();
  for (const dkdAdapter of dkdAdapters) {
    const dkdResult = await dkdDiscoverAdapter(dkdAdapter, dkdOptions);
    dkdResults.push(dkdResult);
    for (const dkdProductUrl of dkdResult.dkd_product_urls) dkdAllProducts.add(dkdProductUrl);
    await dkdSleep(800);
  }
  return { dkd_adapter_version: 'v0.23', dkd_created_at: new Date().toISOString(), dkd_source_count: dkdResults.length, dkd_product_url_count: dkdAllProducts.size, dkd_product_urls: Array.from(dkdAllProducts), dkd_results: dkdResults };
}
