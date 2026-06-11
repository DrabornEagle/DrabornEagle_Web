export function dkdDetectSourceKey(dkdUrl: string): string | null {
  const dkdLowerUrl = dkdUrl.toLowerCase();
  if (dkdLowerUrl.includes('trendyol.com')) return 'trendyol';
  if (dkdLowerUrl.includes('hepsiburada.com')) return 'hepsiburada';
  if (dkdLowerUrl.includes('n11.com')) return 'n11';
  if (dkdLowerUrl.includes('amazon.com.tr')) return 'amazon_tr';
  if (dkdLowerUrl.includes('pazarama.com')) return 'pazarama';
  if (dkdLowerUrl.includes('ciceksepeti.com')) return 'ciceksepeti';
  if (dkdLowerUrl.includes('teknosa.com')) return 'teknosa';
  if (dkdLowerUrl.includes('vatanbilgisayar.com')) return 'vatan_bilgisayar';
  if (dkdLowerUrl.includes('pttavm.com')) return 'pttavm';
  if (dkdLowerUrl.includes('migros.com.tr')) return 'migros';
  return null;
}

export function dkdNormalizeUrl(dkdUrl: string): string {
  const dkdParsedUrl = new URL(dkdUrl);
  dkdParsedUrl.hash = '';
  return dkdParsedUrl.toString();
}
