// Maintain public SEO metadata that Expo web exports sometimes omit.
// Safe and idempotent: only the document <head> is changed, app bundles remain intact.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const pages = [
  {
    file: 'DraBornZikir/index.html',
    title: 'DraBornZikir | Günlük Zikir ve Dua Uygulaması',
    description: 'DraBornZikir: günlük zikirler, dualar, tesbihat ve takip özelliklerine yönelik DraBornEagle uygulaması.',
    canonical: 'https://www.draborneagle.com/DraBornZikir/'
  },
  {
    file: 'DraBornOdds/index.html',
    title: 'DraBornOdds | Spor Verileri ve Analiz',
    description: 'DraBornOdds, spor karşılaşmalarını ve verileri incelemeye yönelik DraBornEagle analiz projesidir.',
    canonical: 'https://www.draborneagle.com/DraBornOdds/'
  }
];

const onlyApp = process.argv.find(arg => arg.startsWith('--only='))?.slice(7) ?? null;
for (const page of pages) {
  if (onlyApp && !page.file.startsWith(onlyApp + '/')) continue;
  if (!existsSync(page.file)) continue;
  const original = readFileSync(page.file, 'utf8');
  const headMatch = original.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if (!headMatch) throw new Error('HTML <head> missing: ' + page.file);
  let head = headMatch[0];
  const enc = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const titleTag = '<title>' + enc(page.title) + '</title>';
  if (/<title\b[^>]*>[\s\S]*?<\/title>/i.test(head)) {
    head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, titleTag);
  } else head = head.replace(/<\/head>/i, titleTag + '\n</head>');
  function replaceOrAdd(matcher, tag) {
    if (matcher.test(head)) head = head.replace(matcher, tag);
    else head = head.replace(/<\/head>/i, tag + '\n</head>');
  }
  replaceOrAdd(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i,
    '<meta name="description" content="' + enc(page.description) + '">');
  replaceOrAdd(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i,
    '<meta name="robots" content="index,follow,max-image-preview:large">');
  replaceOrAdd(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i,
    '<link rel="canonical" href="' + page.canonical + '">');
  replaceOrAdd(/<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i,
    '<meta property="og:title" content="' + enc(page.title) + '">');
  replaceOrAdd(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i,
    '<meta property="og:url" content="' + page.canonical + '">');
  const output = original.replace(headMatch[0], head);
  if (output !== original) writeFileSync(page.file, output, 'utf8');
  if (!output.includes(page.canonical) || !output.includes(page.title))
    throw new Error('SEO post-export verification failed: ' + page.file);
  process.stdout.write(page.file + ': SEO metadata verified\n');
}