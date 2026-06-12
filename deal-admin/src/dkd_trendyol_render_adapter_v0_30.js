import { dkdRenderFetchTextV030 } from './dkd_render_gateway_v0_30.js';

const dkdTrendyolRenderUrls = [
  'https://www.trendyol.com/sr?q=iphone',
  'https://www.trendyol.com/sr?q=samsung%20telefon',
  'https://www.trendyol.com/sr?q=playstation%205',
  'https://www.trendyol.com/sr?q=airfryer',
  'https://www.trendyol.com/sr?q=robot%20s%C3%BCp%C3%BCrge',
  'https://www.trendyol.com/sr?q=laptop',
  'https://www.trendyol.com/sr?q=kulakl%C4%B1k'
];

function dkdClean(dkdValue) {
  return String(dkdValue || '').replace(/\\u002F/g, '/').replace(/\\\//g, '/').replace(/&amp;/g, '&').replace(/["'<>\s]+$/g, '').trim();
}

function dkdNormalizeTrendyolUrl(dkdRawUrl, dkdBaseUrl) {
  try {
    const dkdUrl = new URL(dkdClean(dkdRawUrl), dkdBaseUrl);
    dkdUrl.hash = '';
    const dkdHost = dkdUrl.hostname.toLowerCase();
    const dkdPath = dkdUrl.pathname.toLowerCase();
    if (!dkdHost.includes('trendyol.com')) return null;
    if (!dkdPath.includes('-p-')) return null;
    return `https://www.trendyol.com${dkdUrl.pathname}${dkdUrl.search}`;
  } catch {
    return null;
  }
}

function dkdExtractRenderedUrls(dkdHtml, dkdBaseUrl) {
  const dkdFound = new Set();
  const dkdPatterns = [
    /https?:\\?\/\\?\/(?:www\.)?trendyol\.com[^"'\s<>]+?-p-\d+[^"'\s<>]*/gi,
    /\/[^"'\s<>]+?-p-\d+[^"'\s<>]*/gi,
    /"url"\s*:\s*"([^"']+?-p-\d+[^"']*)"/gi,
    /"productUrl"\s*:\s*"([^"']+?-p-\d+[^"']*)"/gi
  ];
  for (const dkdPattern of dkdPatterns) {
    let dkdMatch;
    dkdPattern.lastIndex = 0;
    while ((dkdMatch = dkdPattern.exec(dkdHtml)) !== null) {
      const dkdCandidate = dkdMatch[1] || dkdMatch[0];
      const dkdUrl = dkdNormalizeTrendyolUrl(dkdCandidate, dkdBaseUrl);
      if (dkdUrl) dkdFound.add(dkdUrl);
      if (dkdFound.size >= Number(process.env.DKD_TRENDYOL_RENDER_URL_LIMIT || 80)) break;
    }
  }
  return Array.from(dkdFound);
}

export async function dkdDiscoverTrendyolRenderUrlsV030() {
  const dkdAll = new Set();
  const dkdLogs = [];
  for (const dkdUrl of dkdTrendyolRenderUrls) {
    const dkdResult = await dkdRenderFetchTextV030(dkdUrl);
    const dkdFound = dkdResult.dkd_text ? dkdExtractRenderedUrls(dkdResult.dkd_text, dkdUrl) : [];
    for (const dkdProductUrl of dkdFound) dkdAll.add(dkdProductUrl);
    dkdLogs.push({ dkd_url: dkdUrl, dkd_provider: dkdResult.dkd_provider, dkd_status: dkdResult.dkd_status, dkd_text_length: dkdResult.dkd_text_length, dkd_found: dkdFound.length, dkd_error: dkdResult.dkd_error || null, dkd_disabled: Boolean(dkdResult.dkd_disabled) });
    if (dkdAll.size >= Number(process.env.DKD_TRENDYOL_RENDER_URL_LIMIT || 80)) break;
  }
  return { dkd_source_key: 'trendyol_render_v0_30', dkd_product_urls: Array.from(dkdAll), dkd_product_url_count: dkdAll.size, dkd_logs: dkdLogs };
}
