import { dkdAdminDirectShareFullUrlOnly } from './dkd_admin_direct_share_full_url_only.js';

const dkdDefaultSeedUrls = [
  'https://www.trendyol.com/sr?q=telefon',
  'https://www.trendyol.com/sr?q=playstation',
  'https://www.trendyol.com/sr?q=airfryer',
  'https://www.hepsiburada.com/ara?q=telefon',
  'https://www.hepsiburada.com/ara?q=playstation',
  'https://www.hepsiburada.com/ara?q=airfryer'
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

function dkdSplitSeedUrls(dkdValue) {
  return String(dkdValue || '')
    .split(/[\n,]+/)
    .map((dkdUrl) => dkdUrl.trim())
    .filter(Boolean);
}

function dkdSeedUrlsFromOptions(dkdOptions = {}) {
  const dkdFromRequest = Array.isArray(dkdOptions.dkd_seed_urls) ? dkdOptions.dkd_seed_urls : [];
  const dkdFromEnv = dkdSplitSeedUrls(process.env.DKD_CRAWL_SEED_URLS || '');
  const dkdSeeds = [...dkdFromRequest, ...dkdFromEnv, ...dkdDefaultSeedUrls]
    .map((dkdUrl) => String(dkdUrl || '').trim())
    .filter(Boolean);
  return Array.from(new Set(dkdSeeds)).slice(0, 12);
}

function dkdCleanHtmlUrl(dkdUrl) {
  return String(dkdUrl || '')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/\u0026/g, '&')
    .replace(/["'<>\\]+$/g, '')
    .trim();
}

function dkdNormalizeProductUrl(dkdRawUrl, dkdBaseUrl) {
  try {
    const dkdUrl = new URL(dkdCleanHtmlUrl(dkdRawUrl), dkdBaseUrl);
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

async function dkdFetchHtml(dkdUrl) {
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), 14000);
  try {
    const dkdResponse = await fetch(dkdUrl, {
      signal: dkdController.signal,
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
        'user-agent': 'Mozilla/5.0 (Linux; Android 15; DraBornDealBot/0.20) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
      }
    });
    if (!dkdResponse.ok) throw new Error(`HTTP ${dkdResponse.status}`);
    return await dkdResponse.text();
  } finally {
    clearTimeout(dkdTimer);
  }
}

function dkdExtractProductUrls(dkdHtml, dkdBaseUrl) {
  const dkdFound = new Set();
  const dkdPatterns = [
    /https?:\\?\/\\?\/(?:www\.)?trendyol\.com[^"'\s<>]+/gi,
    /https?:\\?\/\\?\/(?:www\.)?hepsiburada\.com[^"'\s<>]+/gi,
    /href=["']([^"']+)["']/gi
  ];

  for (const dkdPattern of dkdPatterns) {
    let dkdMatch;
    while ((dkdMatch = dkdPattern.exec(dkdHtml)) !== null) {
      const dkdRawUrl = dkdMatch[1] || dkdMatch[0];
      const dkdUrl = dkdNormalizeProductUrl(dkdRawUrl, dkdBaseUrl);
      if (dkdUrl) dkdFound.add(dkdUrl);
      if (dkdFound.size >= 60) break;
    }
  }

  return Array.from(dkdFound);
}

async function dkdCrawlSeed(dkdSeedUrl) {
  const dkdHtml = await dkdFetchHtml(dkdSeedUrl);
  const dkdUrls = dkdExtractProductUrls(dkdHtml, dkdSeedUrl);
  return { dkd_seed_url: dkdSeedUrl, dkd_found_urls: dkdUrls };
}

export async function dkdAutoCrawlAndShare(dkdSupabase, dkdBotToken, dkdOptions = {}) {
  const dkdLimit = Math.max(1, Math.min(Number(dkdOptions.dkd_limit || process.env.DKD_AUTO_CRAWL_SHARE_LIMIT || 5), 10));
  const dkdSeeds = dkdSeedUrlsFromOptions(dkdOptions);
  const dkdStartedAt = new Date().toISOString();
  const dkdSeedResults = [];
  const dkdAllUrls = [];
  const dkdShared = [];
  const dkdSkipped = [];
  const dkdErrors = [];

  for (const dkdSeedUrl of dkdSeeds) {
    try {
      const dkdResult = await dkdCrawlSeed(dkdSeedUrl);
      dkdSeedResults.push({ dkd_seed_url: dkdSeedUrl, dkd_found_count: dkdResult.dkd_found_urls.length });
      dkdAllUrls.push(...dkdResult.dkd_found_urls);
      await dkdSleep(650);
    } catch (dkdError) {
      dkdErrors.push({ dkd_seed_url: dkdSeedUrl, dkd_error: dkdErrorText(dkdError) });
    }
  }

  const dkdUniqueUrls = Array.from(new Set(dkdAllUrls));

  for (const dkdProductUrl of dkdUniqueUrls) {
    if (dkdShared.length >= dkdLimit) break;
    try {
      const { data: dkdExistingProduct } = await dkdSupabase
        .from('dkd_deal_products')
        .select('dkd_id')
        .eq('dkd_product_url', dkdProductUrl)
        .maybeSingle();

      if (dkdExistingProduct?.dkd_id) {
        const dkdSince = new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString();
        const { data: dkdExistingPost } = await dkdSupabase
          .from('dkd_deal_social_posts')
          .select('dkd_id')
          .eq('dkd_product_id', dkdExistingProduct.dkd_id)
          .eq('dkd_platform', 'telegram')
          .eq('dkd_status', 'published')
          .gte('dkd_published_at', dkdSince)
          .limit(1)
          .maybeSingle();
        if (dkdExistingPost?.dkd_id) {
          dkdSkipped.push({ dkd_product_url: dkdProductUrl, dkd_reason: 'Son 18 saat içinde paylaşılmış.' });
          continue;
        }
      }

      const dkdShareResult = await dkdAdminDirectShareFullUrlOnly(dkdSupabase, dkdBotToken, dkdProductUrl);
      dkdShared.push({ dkd_product_url: dkdProductUrl, ...dkdShareResult });
      await dkdSleep(1600);
    } catch (dkdError) {
      dkdSkipped.push({ dkd_product_url: dkdProductUrl, dkd_reason: dkdErrorText(dkdError) });
    }
  }

  return {
    dkd_auto_crawler_version: 'v0.20',
    dkd_started_at: dkdStartedAt,
    dkd_finished_at: new Date().toISOString(),
    dkd_seed_count: dkdSeeds.length,
    dkd_seed_results: dkdSeedResults,
    dkd_found_product_url_count: dkdUniqueUrls.length,
    dkd_shared_count: dkdShared.length,
    dkd_skipped_count: dkdSkipped.length,
    dkd_error_count: dkdErrors.length,
    dkd_shared: dkdShared,
    dkd_skipped: dkdSkipped.slice(0, 20),
    dkd_errors: dkdErrors
  };
}
