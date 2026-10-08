// Keep SEO metadata in the exported Expo HTML, even after automated web synchronization.
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'DraBornBuy/index.html';
const current = readFileSync(file, 'utf8');
if (!/<head[^>]*>/i.test(current) || !/<\/head>/i.test(current)) {
  throw new Error('DraBornBuy export is missing an HTML head');
}
let updated = current.replace(/(<html[^>]*?)lang="en"/i, '$1lang="tr"');
const seoTitle = 'DraBornBuy | Market Alışverişi ve Fiyat Karşılaştırma';
if (/<title[^>]*>\s*<\/title>/i.test(updated)) {
  updated = updated.replace(/<title([^>]*)>\s*<\/title>/i, '<title$1>' + seoTitle + '</title>');
} else if (!/<title\b/i.test(updated)) {
  updated = updated.replace(/<head([^>]*)>/i, '<head$1><title>' + seoTitle + '</title>');
}
const tags = [
  ['<meta name="description"', '<meta name="description" content="DraBornBuy, DraBornEagle ekosisteminin market alışverişi ve fiyat karşılaştırma projesidir. Yakınındaki marketleri ve ürünleri keşfet.">'],
  ['<meta name="robots"', '<meta name="robots" content="index,follow,max-image-preview:large">'],
  ['<meta name="author"', '<meta name="author" content="Dogancan Kartal">'],
  ['<link rel="canonical"', '<link rel="canonical" href="https://www.draborneagle.com/DraBornBuy/">'],
  ['<meta property="og:type"', '<meta property="og:type" content="website">'],
  ['<meta property="og:site_name"', '<meta property="og:site_name" content="DraBornEagle">'],
  ['<meta property="og:title"', '<meta property="og:title" content="DraBornBuy | Market Alışverişi">'],
  ['<meta property="og:description"', '<meta property="og:description" content="DraBornEagle market alışverişi ve fiyat karşılaştırma projesi.">'],
  ['<meta property="og:url"', '<meta property="og:url" content="https://www.draborneagle.com/DraBornBuy/">']
];
for (const [needle, tag] of tags) {
  if (!updated.includes(needle)) updated = updated.replace(/<\/head>/i, tag + '</head>');
}
if (updated !== current) {
  writeFileSync(file, updated);
  process.stdout.write('SEO tags updated in DraBornBuy export\n');
} else process.stdout.write('DraBornBuy SEO tags already present\n');
