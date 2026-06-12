const dkdHepsiUrls = [
  'https://www.hepsiburada.com/ara?q=iphone',
  'https://www.hepsiburada.com/ara?q=samsung%20telefon',
  'https://www.hepsiburada.com/ara?q=playstation%205',
  'https://www.hepsiburada.com/ara?q=airfryer',
  'https://www.hepsiburada.com/ara?q=robot%20s%C3%BCp%C3%BCrge',
  'https://www.hepsiburada.com/ara?q=laptop',
  'https://www.hepsiburada.com/ara?q=kulakl%C4%B1k',
  'https://www.hepsiburada.com/ara?q=ssd',
  'https://www.hepsiburada.com/ara?q=ak%C4%B1ll%C4%B1%20saat',
  'https://www.hepsiburada.com/ara?q=projeksiyon'
];

function dkdClean(dkdValue) {
  return String(dkdValue || '').replace(/\\u002F/g, '/').replace(/\\\//g, '/').replace(/&amp;/g, '&').replace(/["'<>\s]+$/g, '').trim();
}

function dkdNormalizeHepsiUrl(dkdRawUrl, dkdBaseUrl) {
  try {
    const dkdUrl = new URL(dkdClean(dkdRawUrl), dkdBaseUrl);
    dkdUrl.hash = '';
    const dkdHost = dkdUrl.hostname.toLowerCase();
    const dkdPath = dkdUrl.pathname.toLowerCase();
    if (!dkdHost.includes('hepsiburada.com')) return null;
    if (!dkdPath.includes('-p-')) return null;
    return `https://www.hepsiburada.com${dkdUrl.pathname}${dkdUrl.search}`;
  } catch {
    return null;
  }
}

async function dkdFetchText(dkdUrl) {
  const dkdController = new AbortController();
  const dkdTimer = setTimeout(() => dkdController.abort(), Number(process.env.DKD_HEPSI_DEAL_TIMEOUT_MS || 15000));
  try {
    const dkdResponse = await fetch(dkdUrl, {
      signal: dkdController.signal,
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
        referer: 'https://www.hepsiburada.com/',
        'user-agent': process.env.DKD_GATEWAY_USER_AGENT || 'Mozilla/5.0 (Linux; Android 15; DraBornDeal/0.33) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
      }
    });
    const dkdText = await dkdResponse.text();
    return { dkd_status: dkdResponse.status, dkd_ok: dkdResponse.ok, dkd_text: dkdText, dkd_length: dkdText.length };
  } finally {
    clearTimeout(dkdTimer);
  }
}

function dkdExtractUrls(dkdHtml, dkdBaseUrl) {
  const dkdFound = new Set();
  const dkdPatterns = [
    /https?:\\?\/\\?\/(?:www\.)?hepsiburada\.com[^"'\s<>]+?-p-[A-Z0-9]+[^"'\s<>]*/gi,
    /\/[^"'\s<>]+?-p-[A-Z0-9]+[^"'\s<>]*/gi,
    /"url"\s*:\s*"([^"']+?-p-[A-Z0-9]+[^"']*)"/gi,
    /"productUrl"\s*:\s*"([^"']+?-p-[A-Z0-9]+[^"']*)"/gi
  ];
  for (const dkdPattern of dkdPatterns) {
    let dkdMatch;
    dkdPattern.lastIndex = 0;
    while ((dkdMatch = dkdPattern.exec(dkdHtml)) !== null) {
      const dkdCandidate = dkdMatch[1] || dkdMatch[0];
      const dkdUrl = dkdNormalizeHepsiUrl(dkdCandidate, dkdBaseUrl);
      if (dkdUrl) dkdFound.add(dkdUrl);
      if (dkdFound.size >= Number(process.env.DKD_HEPSI_DEAL_URL_LIMIT || 80)) break;
    }
  }
  return Array.from(dkdFound);
}

export async function dkdDiscoverHepsiburadaDealsV033() {
  const dkdAll = new Set();
  const dkdLogs = [];
  for (const dkdUrl of dkdHepsiUrls) {
    try {
      const dkdResult = await dkdFetchText(dkdUrl);
      const dkdUrls = dkdExtractUrls(dkdResult.dkd_text, dkdUrl);
      for (const dkdProductUrl of dkdUrls) dkdAll.add(dkdProductUrl);
      dkdLogs.push({ dkd_url: dkdUrl, dkd_status: dkdResult.dkd_status, dkd_length: dkdResult.dkd_length, dkd_found: dkdUrls.length });
    } catch (dkdError) {
      dkdLogs.push({ dkd_url: dkdUrl, dkd_error: dkdError?.message || String(dkdError) });
    }
    if (dkdAll.size >= Number(process.env.DKD_HEPSI_DEAL_URL_LIMIT || 80)) break;
  }
  return { dkd_source_key: 'hepsiburada_deal_v0_33', dkd_product_urls: Array.from(dkdAll), dkd_product_url_count: dkdAll.size, dkd_logs: dkdLogs };
}
