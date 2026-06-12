function dkdSleep(dkdMs) {
  return new Promise((resolve) => setTimeout(resolve, dkdMs));
}

function dkdText(dkdError) {
  return dkdError?.message || String(dkdError || 'Bilinmeyen hata');
}

function dkdProvider() {
  return String(process.env.DKD_RENDER_PROVIDER || 'disabled').toLowerCase().trim();
}

function dkdBuildScrapingBeeUrl(dkdTargetUrl) {
  const dkdKey = process.env.DKD_SCRAPINGBEE_API_KEY || '';
  if (!dkdKey) return null;
  const dkdUrl = new URL('https://app.scrapingbee.com/api/v1/');
  dkdUrl.searchParams.set('api_key', dkdKey);
  dkdUrl.searchParams.set('url', dkdTargetUrl);
  dkdUrl.searchParams.set('render_js', 'true');
  dkdUrl.searchParams.set('wait', String(process.env.DKD_RENDER_WAIT_MS || 3000));
  dkdUrl.searchParams.set('country_code', process.env.DKD_RENDER_COUNTRY_CODE || 'tr');
  return dkdUrl.toString();
}

function dkdBuildGenericGatewayUrl(dkdTargetUrl) {
  const dkdGateway = String(process.env.DKD_RENDER_GATEWAY_URL || '').trim();
  if (!dkdGateway) return null;
  const dkdUrl = new URL(dkdGateway);
  dkdUrl.searchParams.set(process.env.DKD_RENDER_GATEWAY_URL_PARAM || 'url', dkdTargetUrl);
  if (process.env.DKD_RENDER_GATEWAY_KEY) dkdUrl.searchParams.set(process.env.DKD_RENDER_GATEWAY_KEY_PARAM || 'key', process.env.DKD_RENDER_GATEWAY_KEY);
  return dkdUrl.toString();
}

function dkdBuildRenderUrl(dkdTargetUrl) {
  const dkdSelected = dkdProvider();
  if (dkdSelected === 'scrapingbee') return dkdBuildScrapingBeeUrl(dkdTargetUrl);
  if (dkdSelected === 'generic') return dkdBuildGenericGatewayUrl(dkdTargetUrl);
  return null;
}

export async function dkdRenderFetchTextV030(dkdTargetUrl, dkdOptions = {}) {
  const dkdRenderUrl = dkdBuildRenderUrl(dkdTargetUrl);
  if (!dkdRenderUrl) {
    return { dkd_ok: false, dkd_status: 0, dkd_text: '', dkd_text_length: 0, dkd_disabled: true, dkd_provider: dkdProvider(), dkd_error: 'render_disabled_or_missing_key' };
  }

  const dkdTimeoutMs = Number(dkdOptions.dkd_timeout_ms || process.env.DKD_RENDER_TIMEOUT_MS || 35000);
  const dkdRetries = Math.max(1, Math.min(Number(process.env.DKD_RENDER_RETRIES || 2), 4));
  let dkdLastError = null;

  for (let dkdAttempt = 1; dkdAttempt <= dkdRetries; dkdAttempt += 1) {
    const dkdController = new AbortController();
    const dkdTimer = setTimeout(() => dkdController.abort(), dkdTimeoutMs);
    try {
      const dkdResponse = await fetch(dkdRenderUrl, {
        signal: dkdController.signal,
        redirect: 'follow',
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6',
          'user-agent': process.env.DKD_GATEWAY_USER_AGENT || 'Mozilla/5.0 (Linux; Android 15; DraBornDeal/0.30) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36'
        }
      });
      const dkdTextBody = await dkdResponse.text();
      clearTimeout(dkdTimer);
      return { dkd_ok: dkdResponse.ok, dkd_status: dkdResponse.status, dkd_text: dkdTextBody, dkd_text_length: dkdTextBody.length, dkd_attempt: dkdAttempt, dkd_provider: dkdProvider() };
    } catch (dkdError) {
      clearTimeout(dkdTimer);
      dkdLastError = dkdError;
      await dkdSleep(800 * dkdAttempt);
    }
  }

  return { dkd_ok: false, dkd_status: 0, dkd_text: '', dkd_text_length: 0, dkd_provider: dkdProvider(), dkd_error: dkdText(dkdLastError) };
}
