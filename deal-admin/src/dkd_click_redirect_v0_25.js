import crypto from 'crypto';

function dkdHashIp(dkdIp) {
  const dkdSalt = process.env.DKD_CLICK_HASH_SALT || 'draborndeal-local-click-salt';
  return crypto.createHash('sha256').update(`${dkdSalt}:${dkdIp || ''}`).digest('hex').slice(0, 32);
}

function dkdSourceKeyFromUrl(dkdUrl) {
  try {
    const dkdHost = new URL(dkdUrl).hostname.toLowerCase();
    if (dkdHost.includes('trendyol')) return 'trendyol';
    if (dkdHost.includes('hepsiburada')) return 'hepsiburada';
    if (dkdHost.includes('amazon.com.tr')) return 'amazon_tr';
    if (dkdHost.includes('n11')) return 'n11';
  } catch {}
  return null;
}

async function dkdFinalUrlForProduct(dkdSupabase, dkdProduct) {
  const dkdSourceKey = dkdSourceKeyFromUrl(dkdProduct.dkd_product_url || dkdProduct.dkd_canonical_url) || 'unknown';
  try {
    const { data: dkdFinalUrl } = await dkdSupabase.rpc('dkd_deal_affiliate_url_v0_9', {
      dkd_product_url: dkdProduct.dkd_product_url || dkdProduct.dkd_canonical_url,
      dkd_source_key: dkdSourceKey
    });
    return { dkd_final_url: dkdFinalUrl || dkdProduct.dkd_product_url || dkdProduct.dkd_canonical_url, dkd_source_key: dkdSourceKey };
  } catch {
    return { dkd_final_url: dkdProduct.dkd_product_url || dkdProduct.dkd_canonical_url, dkd_source_key: dkdSourceKey };
  }
}

export function dkdBuildTrackedProductUrl(dkdProductId, dkdFallbackUrl) {
  const dkdEnabled = String(process.env.DKD_CLICK_TRACKING_ENABLED || '').toLowerCase() === 'true';
  const dkdBase = String(process.env.DKD_PUBLIC_BASE_URL || '').replace(/\/+$/g, '');
  if (!dkdEnabled) return dkdFallbackUrl;
  if (!dkdBase || dkdBase.includes('127.0.0.1') || dkdBase.includes('localhost')) return dkdFallbackUrl;
  return `${dkdBase}/go/product/${encodeURIComponent(dkdProductId)}`;
}

export function dkdRegisterClickRedirectRoute(dkdApp, dkdSupabase) {
  dkdApp.get('/go/product/:dkdProductId', async (req, res) => {
    try {
      const dkdProductId = String(req.params.dkdProductId || '').trim();
      const { data: dkdProduct, error: dkdProductError } = await dkdSupabase
        .from('dkd_deal_products')
        .select('dkd_id, dkd_product_url, dkd_canonical_url')
        .eq('dkd_id', dkdProductId)
        .single();

      if (dkdProductError || !dkdProduct) return res.status(404).send('Ürün bulunamadı.');
      const { dkd_final_url, dkd_source_key } = await dkdFinalUrlForProduct(dkdSupabase, dkdProduct);
      if (!dkd_final_url) return res.status(404).send('Ürün linki bulunamadı.');

      await dkdSupabase.from('dkd_deal_click_events').insert({
        dkd_product_id: dkdProduct.dkd_id,
        dkd_source_key,
        dkd_target_url: dkd_final_url,
        dkd_referrer: req.get('referer') || null,
        dkd_user_agent: req.get('user-agent') || null,
        dkd_ip_hash: dkdHashIp(req.ip || req.socket?.remoteAddress || '')
      });

      return res.redirect(302, dkd_final_url);
    } catch (dkdError) {
      return res.status(500).send('Yönlendirme hatası.');
    }
  });
}
