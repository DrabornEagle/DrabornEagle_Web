const dkdDefaultSourceHomes = [
  'https://www.trendyol.com',
  'https://www.hepsiburada.com'
];

const dkdKnownSitemapCandidates = [
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/sitemap/sitemap.xml'
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

function dkdSplitList(dkdValue) {
  return String(dkdValue || '')
    .split(/[\n,]+/)
    .map((dkdItem) => dkdItem.trim())
    .filter(Boolean);
}

function dkdSourceHomesFromEnv() {
  const dkdFromEnv = dkdSplitList(process.env.DKD_GATEWAY_SOURCE_HOMES || '');
  return Array.from(new Set([...dkdFromEnv, ...dkdDefaultSourceHomes])).slice(0, 8);
}

function dkdMakeUrl(dkdBase, dkdPath) {
  try {
    return new URL(dkdPath, dkdBase).toString();
  } catch {
    return null;
  }
}

function dkdCleanTextUrl(dkdUrl) {
  return String(dkdUrl || '')
    .replace(/&amp;/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/["'<>\s]+$/g, '')
    .trim();
}

export function dkdNormalizeGatewayProductUrl(dkdRawUrl, dkdBaseUrl) {
  try {
    const dkdUrl = new URL(dkdCleanTextUrl(dkdRawUrl), dkdBaseUrl);
    dkdUrl.hash = '';
    const dkdHost = dkdUrl.hostname.toLowerCase().replace(/^www\./, '');
    const dkdPath = dkdUrl.pathname.toLowerCase();

    if (dkdHost.includes('trendyol.com')) {
      if (!dkdPath.includes('/p-')) return null;
      return `https://www.trendyol.com${dkdUrl.pathname}${dkdUrl.search}`;
    }

    if (dkdHost.includes('hepsiburada.com')) {
      if (!dkdPath.includes('-p-') && !dkdPath.includes('/p-')) return null;
      return `https://www.hepsiburada.com${dkdUrl.pathname}${dkdUrl.search}`;
    }

    return null;
  } catch {
    return null;
  }
}

function dkdExtractLocUrls(dkdText) {
  const dkdFound = new Set();
  const dkdLocPattern = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let dkdMatch;
  while ((dkdMatch = dkdLocPattern.exec(dkdText)) !== null) {
    dkdFound.add(dkdCleanTextUrl(dkdMatch[1]));
    if (dkdFound.size >= 500) break;
  }

  const dkdPlainUrlPattern = /https?:\/\/[^\s"'<>]+/gi;
  while ((dkdMatch = dkdPlainUrlPattern.exec(dkdText)) !== null) {
    dkdFound.add(dkdCleanTextUrl(dkdMatch[0]));
    if (dkdFound.size >= 700) break;
  }
  return Array.from(dkdFound);
}

function dkdExtractSitemapUrls(dkdText, dkdBaseUrl) {
  const dkdUrls = dkdExtractLocUrls(dkdText)
    .map((dkdUrl) => dkdMakeUrl(dkdBaseUrl, dkdUrl) || dkdUrl)
    .filter((dkdUrl) => /sitemap|site-map|xml/i.test(dkdUrl));
  return Array.from(new Set(dkdUrls));
}

function dkdExtractProductUrls(dkdText, dkdBaseUrl) {
  const dkdAllUrls = dkdExtractLocUrls(dkdText);
  const dkdProductUrls = dkdAllUrls
    .map((dkdUrl) => dkdNormalizeGatewayProductUrl(dkdUrl, dkdBaseUrl))
    .filter(Boolean);
  return Array.from(new Set(dkdProductUrls));
}

export async function dkdGatewayFetch(dkdUrl, dkdOptions = {}) {
  const dkdTimeoutMs = Number(dkdOptions.dkd_timeout_ms || process.env.DKD_GATEWAY_TIMEOUT_MS || 16000);
  const dkdRetries = Math.max(1, Math.min(Number(dkdOptions.dkd_retries || process.env.DKD_GATEWAY_RETRIES || 2), 4));
  let dkdLastError = null;

  for (let dkdAttempt = 1; dkdAttempt <= dkdRetries; dkdAttempt += 1) {
    const dkdController = new AbortController();
    const dkdTimer = setTimeout(() => dkdController.abort(), dkdTimeoutMs);
    try {
      const dkdResponse = await fetch(dkdUrl, {
        signal: dkdController.signal,
        redirect: 'follow',
        headers: {
          'accept': dkdOptions.dkd_accept || 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7',
          'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
          'cache-control': 'no-cache',
          'pragma': 'no-cache',
          'user-agent': process.env.DKD_GATEWAY_USER_AGENT || 'Mozilla/5.0 (Linux; Android 15; DraBornBee/0.21) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
        }
      });
      const dkdText = await dkdResponse.text();
      clearTimeout(dkdTimer);
      return {
        dkd_ok: dkdResponse.ok,
        dkd_url: dkdUrl,
        dkd_final_url: dkdResponse.url,
        dkd_status: dkdResponse.status,
        dkd_attempt,
        dkd_text_length: dkdText.length,
        dkd_text: dkdText
      };
    } catch (dkdError) {
      clearTimeout(dkdTimer);
      dkdLastError = dkdError;
      await dkdSleep(700 * dkdAttempt);
    }
  }

  return {
    dkd_ok: false,
    dkd_url: dkdUrl,
    dkd_status: 0,
    dkd_attempt: dkdRetries,
    dkd_text_length: 0,
    dkd_text: '',
    dkd_error: dkdErrorText(dkdLastError)
  };
}

async function dkdDiscoverForHome(dkdHomeUrl, dkdOptions = {}) {
  const dkdSitemapLimit = Math.max(2, Math.min(Number(dkdOptions.dkd_sitemap_limit || process.env.DKD_GATEWAY_SITEMAP_LIMIT || 10), 30));
  const dkdProductLimit = Math.max(1, Math.min(Number(dkdOptions.dkd_product_limit || process.env.DKD_GATEWAY_PRODUCT_LIMIT || 80), 300));
  const dkdLogs = [];
  const dkdProductUrls = new Set();
  const dkdSitemapQueue = [];

  for (const dkdCandidatePath of dkdKnownSitemapCandidates) {
    const dkdCandidateUrl = dkdMakeUrl(dkdHomeUrl, dkdCandidatePath);
    if (dkdCandidateUrl) dkdSitemapQueue.push(dkdCandidateUrl);
  }

  const dkdVisited = new Set();
  for (let dkdIndex = 0; dkdIndex < dkdSitemapQueue.length && dkdVisited.size < dkdSitemapLimit; dkdIndex += 1) {
    const dkdFetchUrl = dkdSitemapQueue[dkdIndex];
    if (!dkdFetchUrl || dkdVisited.has(dkdFetchUrl)) continue;
    dkdVisited.add(dkdFetchUrl);

    const dkdResult = await dkdGatewayFetch(dkdFetchUrl, { dkd_accept: 'text/plain,application/xml,text/xml,text/html,*/*' });
    dkdLogs.push({ dkd_url: dkdFetchUrl, dkd_status: dkdResult.dkd_status, dkd_text_length: dkdResult.dkd_text_length });
    if (!dkdResult.dkd_text) continue;

    const dkdNewProductUrls = dkdExtractProductUrls(dkdResult.dkd_text, dkdResult.dkd_final_url || dkdFetchUrl);
    for (const dkdProductUrl of dkdNewProductUrls) {
      dkdProductUrls.add(dkdProductUrl);
      if (dkdProductUrls.size >= dkdProductLimit) break;
    }
    if (dkdProductUrls.size >= dkdProductLimit) break;

    const dkdNewSitemaps = dkdExtractSitemapUrls(dkdResult.dkd_text, dkdResult.dkd_final_url || dkdFetchUrl);
    for (const dkdSitemapUrl of dkdNewSitemaps) {
      if (!dkdVisited.has(dkdSitemapUrl) && dkdSitemapQueue.length < dkdSitemapLimit * 4) {
        dkdSitemapQueue.push(dkdSitemapUrl);
      }
    }

    await dkdSleep(550);
  }

  return {
    dkd_home_url: dkdHomeUrl,
    dkd_checked_count: dkdVisited.size,
    dkd_product_url_count: dkdProductUrls.size,
    dkd_product_urls: Array.from(dkdProductUrls),
    dkd_logs: dkdLogs
  };
}

export async function dkdGatewayDiscoverProductUrls(dkdOptions = {}) {
  const dkdHomes = Array.isArray(dkdOptions.dkd_source_homes) && dkdOptions.dkd_source_homes.length
    ? dkdOptions.dkd_source_homes
    : dkdSourceHomesFromEnv();
  const dkdResults = [];
  const dkdAllUrls = new Set();

  for (const dkdHomeUrl of dkdHomes) {
    try {
      const dkdResult = await dkdDiscoverForHome(dkdHomeUrl, dkdOptions);
      dkdResults.push(dkdResult);
      for (const dkdProductUrl of dkdResult.dkd_product_urls) dkdAllUrls.add(dkdProductUrl);
      await dkdSleep(800);
    } catch (dkdError) {
      dkdResults.push({ dkd_home_url: dkdHomeUrl, dkd_error: dkdErrorText(dkdError), dkd_product_urls: [] });
    }
  }

  return {
    dkd_gateway_version: 'v0.21',
    dkd_created_at: new Date().toISOString(),
    dkd_source_count: dkdHomes.length,
    dkd_product_url_count: dkdAllUrls.size,
    dkd_product_urls: Array.from(dkdAllUrls),
    dkd_results: dkdResults
  };
}
