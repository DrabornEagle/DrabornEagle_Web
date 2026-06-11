export type DkdParsedProduct = {
  dkdProductName: string | null;
  dkdBrandName: string | null;
  dkdImageUrl: string | null;
  dkdCurrencyCode: string | null;
  dkdCurrentPrice: number | null;
  dkdOriginalPrice: number | null;
  dkdStockStatus: 'unknown' | 'in_stock' | 'out_of_stock' | 'low_stock' | 'preorder';
  dkdRating: number | null;
  dkdReviewCount: number | null;
  dkdRawPayload: Record<string, unknown>;
};

export async function dkdFetchAndParseProduct(dkdUrl: string): Promise<DkdParsedProduct> {
  const dkdResponse = await fetch(dkdUrl, {
    method: 'GET',
    redirect: 'follow',
    headers: dkdBuildProductFetchHeaders(dkdUrl)
  });

  if (!dkdResponse.ok) {
    throw new Error(`Product fetch failed: ${dkdResponse.status}`);
  }

  const dkdHtml = await dkdResponse.text();
  return dkdParseProductHtml(dkdHtml, dkdResponse.url || dkdUrl);
}

function dkdBuildProductFetchHeaders(dkdUrl: string): Record<string, string> {
  const dkdHost = new URL(dkdUrl).hostname.toLowerCase();
  const dkdBaseHeaders: Record<string, string> = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
  };

  if (dkdHost.includes('hepsiburada.com')) {
    return {
      ...dkdBaseHeaders,
      'referer': 'https://www.hepsiburada.com/',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1'
    };
  }

  if (dkdHost.includes('trendyol.com') || dkdHost.includes('ty.gl')) {
    return {
      ...dkdBaseHeaders,
      'referer': 'https://www.trendyol.com/'
    };
  }

  return dkdBaseHeaders;
}

export function dkdParseProductHtml(dkdHtml: string, dkdUrl: string): DkdParsedProduct {
  const dkdJsonLdList = dkdExtractJsonLd(dkdHtml);
  const dkdProductJsonLd = dkdFindProductJsonLd(dkdJsonLdList);
  const dkdOg = dkdExtractOpenGraph(dkdHtml);

  const dkdOffer = dkdProductJsonLd ? dkdExtractOffer(dkdProductJsonLd) : null;
  const dkdAggregateRating = dkdProductJsonLd ? dkdExtractAggregateRating(dkdProductJsonLd) : null;

  const dkdProductName = dkdCleanText(
    dkdReadString(dkdProductJsonLd, 'name') ||
    dkdOg['og:title'] ||
    dkdExtractTitle(dkdHtml)
  );

  const dkdBrandName = dkdCleanText(dkdExtractBrandName(dkdProductJsonLd));
  const dkdImageUrl = dkdNormalizeMaybeUrl(
    dkdReadImage(dkdProductJsonLd) || dkdOg['og:image'] || null,
    dkdUrl
  );

  const dkdCurrentPrice = dkdReadNumber(dkdOffer, 'price') || dkdExtractPriceFromMeta(dkdHtml);
  const dkdOriginalPrice = dkdExtractOriginalPriceGuess(dkdHtml, dkdCurrentPrice);
  const dkdCurrencyCode = dkdReadString(dkdOffer, 'priceCurrency') || dkdExtractCurrencyGuess(dkdHtml) || 'TRY';
  const dkdAvailability = dkdReadString(dkdOffer, 'availability');
  const dkdStockStatus = dkdMapAvailability(dkdAvailability, dkdHtml);
  const dkdRating = dkdReadNumber(dkdAggregateRating, 'ratingValue');
  const dkdReviewCount = dkdReadInteger(dkdAggregateRating, 'reviewCount') || dkdReadInteger(dkdAggregateRating, 'ratingCount');

  return {
    dkdProductName,
    dkdBrandName,
    dkdImageUrl,
    dkdCurrencyCode,
    dkdCurrentPrice,
    dkdOriginalPrice,
    dkdStockStatus,
    dkdRating,
    dkdReviewCount,
    dkdRawPayload: {
      dkd_url: dkdUrl,
      dkd_json_ld_count: dkdJsonLdList.length,
      dkd_json_ld_product_found: Boolean(dkdProductJsonLd),
      dkd_og_found: Object.keys(dkdOg).length > 0,
      dkd_parser_version: '0.8.3'
    }
  };
}

function dkdExtractJsonLd(dkdHtml: string): unknown[] {
  const dkdResults: unknown[] = [];
  const dkdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let dkdMatch: RegExpExecArray | null;
  while ((dkdMatch = dkdRegex.exec(dkdHtml))) {
    const dkdRaw = dkdDecodeHtml(dkdMatch[1].trim());
    try {
      const dkdParsed = JSON.parse(dkdRaw);
      if (Array.isArray(dkdParsed)) dkdResults.push(...dkdParsed);
      else dkdResults.push(dkdParsed);
    } catch {
      // Ignore invalid JSON-LD blocks.
    }
  }
  return dkdResults;
}

function dkdFindProductJsonLd(dkdItems: unknown[]): Record<string, unknown> | null {
  const dkdStack = [...dkdItems];
  while (dkdStack.length > 0) {
    const dkdItem = dkdStack.shift();
    if (!dkdItem || typeof dkdItem !== 'object') continue;
    const dkdObject = dkdItem as Record<string, unknown>;
    const dkdType = dkdObject['@type'];
    if (dkdType === 'Product' || (Array.isArray(dkdType) && dkdType.includes('Product'))) return dkdObject;
    for (const dkdValue of Object.values(dkdObject)) {
      if (Array.isArray(dkdValue)) dkdStack.push(...dkdValue);
      else if (dkdValue && typeof dkdValue === 'object') dkdStack.push(dkdValue);
    }
  }
  return null;
}

function dkdExtractOffer(dkdProduct: Record<string, unknown>): Record<string, unknown> | null {
  const dkdOffer = dkdProduct.offers;
  if (Array.isArray(dkdOffer)) return (dkdOffer[0] as Record<string, unknown>) || null;
  if (dkdOffer && typeof dkdOffer === 'object') return dkdOffer as Record<string, unknown>;
  return null;
}

function dkdExtractAggregateRating(dkdProduct: Record<string, unknown>): Record<string, unknown> | null {
  const dkdRating = dkdProduct.aggregateRating;
  if (dkdRating && typeof dkdRating === 'object') return dkdRating as Record<string, unknown>;
  return null;
}

function dkdExtractOpenGraph(dkdHtml: string): Record<string, string> {
  const dkdResult: Record<string, string> = {};
  const dkdRegex = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']*)["'][^>]*>/gi;
  let dkdMatch: RegExpExecArray | null;
  while ((dkdMatch = dkdRegex.exec(dkdHtml))) {
    dkdResult[dkdMatch[1]] = dkdDecodeHtml(dkdMatch[2]);
  }
  return dkdResult;
}

function dkdExtractTitle(dkdHtml: string): string | null {
  const dkdMatch = dkdHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return dkdMatch ? dkdDecodeHtml(dkdMatch[1]) : null;
}

function dkdExtractBrandName(dkdProduct: Record<string, unknown> | null): string | null {
  if (!dkdProduct) return null;
  const dkdBrand = dkdProduct.brand;
  if (typeof dkdBrand === 'string') return dkdBrand;
  if (dkdBrand && typeof dkdBrand === 'object') return dkdReadString(dkdBrand as Record<string, unknown>, 'name');
  return null;
}

function dkdReadImage(dkdProduct: Record<string, unknown> | null): string | null {
  if (!dkdProduct) return null;
  const dkdImage = dkdProduct.image;
  if (typeof dkdImage === 'string') return dkdImage;
  if (Array.isArray(dkdImage) && typeof dkdImage[0] === 'string') return dkdImage[0];
  if (dkdImage && typeof dkdImage === 'object') return dkdReadString(dkdImage as Record<string, unknown>, 'url');
  return null;
}

function dkdReadString(dkdObject: Record<string, unknown> | null, dkdKey: string): string | null {
  if (!dkdObject) return null;
  const dkdValue = dkdObject[dkdKey];
  if (typeof dkdValue === 'string' && dkdValue.trim()) return dkdValue.trim();
  return null;
}

function dkdReadNumber(dkdObject: Record<string, unknown> | null, dkdKey: string): number | null {
  const dkdString = dkdReadString(dkdObject, dkdKey);
  if (!dkdString && dkdObject && typeof dkdObject[dkdKey] === 'number') return dkdObject[dkdKey] as number;
  if (!dkdString) return null;
  const dkdParsed = Number(dkdString.replace(',', '.').replace(/[^0-9.]/g, ''));
  return Number.isFinite(dkdParsed) ? dkdParsed : null;
}

function dkdReadInteger(dkdObject: Record<string, unknown> | null, dkdKey: string): number | null {
  const dkdNumber = dkdReadNumber(dkdObject, dkdKey);
  return dkdNumber === null ? null : Math.round(dkdNumber);
}

function dkdExtractPriceFromMeta(dkdHtml: string): number | null {
  const dkdPatterns = [
    /property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i,
    /itemprop=["']price["'][^>]+content=["']([^"']+)["']/i,
    /"price"\s*:\s*"?([0-9.,]+)"?/i
  ];
  for (const dkdPattern of dkdPatterns) {
    const dkdMatch = dkdHtml.match(dkdPattern);
    if (!dkdMatch) continue;
    const dkdParsed = Number(dkdMatch[1].replace(',', '.').replace(/[^0-9.]/g, ''));
    if (Number.isFinite(dkdParsed)) return dkdParsed;
  }
  return null;
}

function dkdExtractOriginalPriceGuess(dkdHtml: string, dkdCurrentPrice: number | null): number | null {
  const dkdPatterns = [/originalPrice[^0-9]{0,30}([0-9]+[.,]?[0-9]*)/i, /listPrice[^0-9]{0,30}([0-9]+[.,]?[0-9]*)/i];
  for (const dkdPattern of dkdPatterns) {
    const dkdMatch = dkdHtml.match(dkdPattern);
    if (!dkdMatch) continue;
    const dkdParsed = Number(dkdMatch[1].replace(',', '.'));
    if (Number.isFinite(dkdParsed) && (!dkdCurrentPrice || dkdParsed >= dkdCurrentPrice)) return dkdParsed;
  }
  return null;
}

function dkdExtractCurrencyGuess(dkdHtml: string): string | null {
  if (/TRY|TL|₺/i.test(dkdHtml)) return 'TRY';
  if (/AED|د\.إ/i.test(dkdHtml)) return 'AED';
  if (/USD|\$/i.test(dkdHtml)) return 'USD';
  return null;
}

function dkdMapAvailability(dkdAvailability: string | null, dkdHtml: string): DkdParsedProduct['dkdStockStatus'] {
  const dkdText = `${dkdAvailability || ''} ${dkdHtml.slice(0, 50000)}`.toLowerCase();
  if (dkdText.includes('outofstock') || dkdText.includes('out of stock') || dkdText.includes('tükendi')) return 'out_of_stock';
  if (dkdText.includes('preorder') || dkdText.includes('ön sipariş')) return 'preorder';
  if (dkdText.includes('lowstock') || dkdText.includes('az stok')) return 'low_stock';
  if (dkdText.includes('instock') || dkdText.includes('in stock') || dkdText.includes('stokta')) return 'in_stock';
  return 'unknown';
}

function dkdNormalizeMaybeUrl(dkdMaybeUrl: string | null, dkdBaseUrl: string): string | null {
  if (!dkdMaybeUrl) return null;
  try {
    return new URL(dkdMaybeUrl, dkdBaseUrl).toString();
  } catch {
    return dkdMaybeUrl;
  }
}

function dkdCleanText(dkdText: string | null): string | null {
  if (!dkdText) return null;
  return dkdText.replace(/\s+/g, ' ').trim() || null;
}

function dkdDecodeHtml(dkdText: string): string {
  return dkdText
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");
}
