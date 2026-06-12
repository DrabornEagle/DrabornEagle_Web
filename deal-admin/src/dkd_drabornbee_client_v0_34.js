const dkdQueries = ['iphone', 'samsung telefon', 'playstation 5', 'airfryer', 'robot süpürge', 'laptop', 'kulaklık'];

function dkdBaseUrl() {
  return String(process.env.DKD_DRABORNBEE_URL || process.env.DKD_DRABORNBEE_GATEWAY_URL || '').replace(/\/+$/g, '');
}

export async function dkdDiscoverFromDraBornBeeV034() {
  const dkdBase = dkdBaseUrl();
  if (!dkdBase) {
    return {
      dkd_source_key: 'drabornbee_v0_34',
      dkd_enabled: false,
      dkd_products: [],
      dkd_product_urls: [],
      dkd_logs: [{ dkd_error: 'DKD_DRABORNBEE_URL boş' }]
    };
  }

  const dkdProducts = [];
  const dkdLogs = [];

  for (const dkdQuery of dkdQueries) {
    try {
      const dkdUrl = new URL(`${dkdBase}/api/trendyol/search`);
      dkdUrl.searchParams.set('q', dkdQuery);
      dkdUrl.searchParams.set('limit', '24');
      const dkdHeaders = {};
      const dkdKey = process.env.DKD_DRABORNBEE_KEY || process.env.DKD_DRABORNBEE_GATEWAY_KEY;
      if (dkdKey) dkdHeaders['x-dkd-drabornbee-key'] = dkdKey;
      const dkdResponse = await fetch(dkdUrl, { headers: dkdHeaders });
      const dkdJson = await dkdResponse.json();
      if (!dkdResponse.ok || !dkdJson.dkd_ok) throw new Error(dkdJson.dkd_error || `HTTP ${dkdResponse.status}`);
      for (const dkdProduct of dkdJson.dkd_products || []) dkdProducts.push(dkdProduct);
      dkdLogs.push({ dkd_query: dkdQuery, dkd_total_count: dkdJson.dkd_total_count || 0, dkd_discounted_count: dkdJson.dkd_discounted_count || 0 });
    } catch (dkdError) {
      dkdLogs.push({ dkd_query: dkdQuery, dkd_error: dkdError?.message || String(dkdError) });
    }
  }

  const dkdMap = new Map();
  for (const dkdProduct of dkdProducts) {
    if (dkdProduct?.dkd_product_url && !dkdMap.has(dkdProduct.dkd_product_url)) dkdMap.set(dkdProduct.dkd_product_url, dkdProduct);
  }

  return {
    dkd_source_key: 'drabornbee_v0_34',
    dkd_enabled: true,
    dkd_products: Array.from(dkdMap.values()),
    dkd_product_urls: Array.from(dkdMap.keys()),
    dkd_logs: dkdLogs
  };
}
