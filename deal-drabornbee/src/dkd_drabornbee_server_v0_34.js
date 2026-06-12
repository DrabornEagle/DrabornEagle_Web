import 'dotenv/config';
import express from 'express';
import { chromium } from 'playwright';

const dkdApp = express();
const dkdPort = Number(process.env.DKD_DRABORNBEE_PORT || 8790);
const dkdAccessKey = process.env.DKD_DRABORNBEE_KEY || '';
let dkdLastRunAt = 0;

function dkdAuth(req, res, next) {
  if (!dkdAccessKey) return next();
  if (req.headers['x-dkd-drabornbee-key'] !== dkdAccessKey) return res.status(401).json({ dkd_error: 'unauthorized' });
  next();
}

function dkdCleanText(dkdValue) {
  return String(dkdValue || '').replace(/\s+/g, ' ').trim();
}

function dkdDelay(dkdMs) {
  return new Promise((resolve) => setTimeout(resolve, dkdMs));
}

async function dkdRateLimit() {
  const dkdDelayMs = Number(process.env.DKD_DRABORNBEE_RATE_DELAY_MS || 1500);
  const dkdElapsed = Date.now() - dkdLastRunAt;
  if (dkdElapsed < dkdDelayMs) await dkdDelay(dkdDelayMs - dkdElapsed);
  dkdLastRunAt = Date.now();
}

function dkdTrendyolSearchUrl(dkdQuery) {
  const dkdUrl = new URL('https://www.trendyol.com/sr');
  dkdUrl.searchParams.set('q', dkdQuery || 'telefon');
  return dkdUrl.toString();
}

dkdApp.get('/health', (req, res) => {
  res.json({ dkd_ok: true, dkd_service: 'DraBornBee', dkd_version: 'v0.34' });
});

dkdApp.get('/api/trendyol/search', dkdAuth, async (req, res) => {
  const dkdQuery = dkdCleanText(req.query.q || 'telefon');
  const dkdLimit = Math.max(1, Math.min(Number(req.query.limit || 24), 60));
  let dkdBrowser;

  try {
    await dkdRateLimit();
    dkdBrowser = await chromium.launch({ headless: String(process.env.DKD_DRABORNBEE_HEADLESS || 'true') !== 'false' });
    const dkdPage = await dkdBrowser.newPage({
      locale: 'tr-TR',
      viewport: { width: 1366, height: 900 },
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36'
    });

    await dkdPage.goto(dkdTrendyolSearchUrl(dkdQuery), {
      waitUntil: 'domcontentloaded',
      timeout: Number(process.env.DKD_DRABORNBEE_TIMEOUT_MS || 30000)
    });
    await dkdPage.waitForTimeout(3500);

    const dkdProducts = await dkdPage.evaluate((dkdLimitArg) => {
      const dkdAbs = (dkdHref) => {
        try { return new URL(dkdHref, location.origin).toString(); } catch { return null; }
      };
      const dkdNum = (dkdValue) => {
        const dkdText = String(dkdValue || '').replace(/\./g, '').replace(',', '.');
        const dkdMatch = dkdText.match(/[0-9]+(?:\.[0-9]+)?/);
        return dkdMatch ? Number(dkdMatch[0]) : null;
      };
      const dkdLinks = Array.from(document.querySelectorAll('a[href*="-p-"]'));
      const dkdSeen = new Set();
      const dkdOut = [];

      for (const dkdLink of dkdLinks) {
        if (dkdOut.length >= dkdLimitArg) break;
        const dkdUrl = dkdAbs(dkdLink.getAttribute('href'));
        if (!dkdUrl || dkdSeen.has(dkdUrl)) continue;
        dkdSeen.add(dkdUrl);

        const dkdCard = dkdLink.closest('[class]') || dkdLink;
        const dkdText = (dkdCard.innerText || dkdLink.innerText || '').replace(/\s+/g, ' ').trim();
        const dkdImage = dkdCard.querySelector('img')?.src || dkdLink.querySelector('img')?.src || null;
        const dkdPrices = Array.from(new Set((dkdText.match(/[0-9.]+,[0-9]{2}\s*TL/g) || []).map((dkdItem) => dkdItem.trim())));
        const dkdNumbers = dkdPrices.map(dkdNum).filter(Boolean).sort((a, b) => a - b);
        const dkdCurrent = dkdNumbers[0] || null;
        const dkdOriginal = dkdNumbers.length > 1 ? dkdNumbers[dkdNumbers.length - 1] : null;
        const dkdDiscount = dkdCurrent && dkdOriginal && dkdOriginal > dkdCurrent ? Math.round(((dkdOriginal - dkdCurrent) / dkdOriginal) * 100) : 0;
        const dkdName = dkdText.split(' TL')[0]?.slice(0, 180) || 'Trendyol Ürünü';

        dkdOut.push({
          dkd_source_key: 'trendyol',
          dkd_product_name: dkdName,
          dkd_product_url: dkdUrl,
          dkd_url: dkdUrl,
          dkd_image_url: dkdImage,
          dkd_currency_code: 'TRY',
          dkd_current_price: dkdCurrent,
          dkd_original_price: dkdOriginal,
          dkd_discount_percent: dkdDiscount,
          dkd_stock_status: 'in_stock'
        });
      }

      return dkdOut;
    }, dkdLimit);

    const dkdDiscounted = dkdProducts.filter((dkdProduct) => Number(dkdProduct.dkd_original_price || 0) > Number(dkdProduct.dkd_current_price || 0));
    res.json({ dkd_ok: true, dkd_query: dkdQuery, dkd_total_count: dkdProducts.length, dkd_discounted_count: dkdDiscounted.length, dkd_products: dkdProducts });
  } catch (dkdError) {
    res.status(500).json({ dkd_ok: false, dkd_error: dkdError?.message || String(dkdError) });
  } finally {
    if (dkdBrowser) await dkdBrowser.close().catch(() => {});
  }
});

dkdApp.listen(dkdPort, '0.0.0.0', () => {
  console.log(JSON.stringify({ dkd_message: 'drabornbee_started', dkd_service: 'DraBornBee', dkd_port: dkdPort, dkd_version: 'v0.34' }));
});
