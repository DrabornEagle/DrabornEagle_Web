// Public discovery pages only: exclude private app routes, retired pages,
// aliases and exports that declare a different canonical URL.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { dkdAssertStructuredData } from './dkd-search-structured-data.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.draborneagle.com';
const directories = [
  '', 'DogancanKartal', 'Hakkimizda', 'Support', 'DraBornGames',
  'DraBornGames/LastMile', 'DraBornGames/shifterror', 'DraBornGarage',
  'DraBornGate', 'DraBornLand/Office', 'DraBornNews', 'DraBornOdds',
  'DraBornOdds/App', 'DraBornPark', 'DraBornPortal', 'DraBornPortal/App',
  'DraBornSeries', 'DraBornStyle', 'DraBornBuy', 'DraBornZikir', 'draborngo',
  'DraBornStudio', 'DraBornStudio/Coconut-app', 'DraBornStudio/Banana-edits', 'DraBornStudio/clipboard-app'
];
const sitemapPath = resolve(root, 'sitemap.xml');
const previous = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : '';
const previousDates = new Map([...previous.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)]
  .map(match => [match[1], match[2]]));
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let boundaries = new Set();
try {
  const shallow = resolve(root, git(['rev-parse', '--git-path', 'shallow']));
  if (existsSync(shallow)) boundaries = new Set(readFileSync(shallow, 'utf8').trim().split(/\s+/));
} catch { /* Exported source archives may not include .git. */ }

const pageHead = html => html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
const canonical = html => pageHead(html).match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["']/i)?.[1];
const noindex = html => /<meta\b(?=[^>]*\bname=["'](?:robots|googlebot)["'])(?=[^>]*\bcontent=["'][^"']*\bnoindex\b)[^>]*>/i.test(pageHead(html));

function modifiedAt(sources, url) {
  try {
    // Actual local/export changes are significant; never stamp unchanged URLs
    // with the sitemap generation date.
    if (git(['diff', 'HEAD', '--name-only', '--', ...sources])) return new Date().toISOString().slice(0, 10);
    const line = git(['log', '-1', '--format=%H %cI', '--', ...sources]);
    const [sha, timestamp] = line.split(' ');
    // A shallow boundary looks like an initial commit touching every file.
    // It is not reliable evidence of when those files were last modified.
    if (sha && !boundaries.has(sha)) return new Date(timestamp).toISOString().slice(0, 10);
  } catch { /* Keep an existing verified date when Git history is unavailable. */ }
  return previousDates.get(url);
}

const entries = directories.map(directory => {
  const url = `${origin}/${directory ? directory + '/' : ''}`;
  const file = directory ? `${directory}/index.html` : 'index.html';
  if (!existsSync(resolve(root, file))) throw new Error(`Missing public page: ${file}`);
  const html = readFileSync(resolve(root, file), 'utf8');
  dkdAssertStructuredData(html, file);
  if (noindex(html)) throw new Error(`Sitemap page is noindex: ${url}`);
  if (canonical(html) !== url) throw new Error(`Canonical mismatch: ${file}: ${canonical(html)} != ${url}`);
  const sources = directory ? [directory] : ['index.html', 'DraBornPS/index.html', 'DraBornPS/js', 'DraBornPS/css', 'DraBornPS/games'];
  return { url, lastmod: modifiedAt(sources, url) };
});
if (new Set(entries.map(entry => entry.url)).size !== entries.length) throw new Error('Duplicate sitemap URL.');

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + entries.map(({ url, lastmod }) => `  <url>\n    <loc>${url}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}  </url>\n`).join('')
  + '</urlset>\n';

if (process.argv.includes('--check')) {
  if (previous !== xml) throw new Error('Sitemap is out of date. Run node scripts/dkd-search-sitemap.mjs.');
} else writeFileSync(sitemapPath, xml);

if (process.argv.includes('--check-live')) {
  // Run after deployment: redirects, errors and conflicting canonicals must
  // not silently turn a valid XML file into an inaccurate discovery list.
  const queue = [...entries];
  await Promise.all(Array.from({ length: 4 }, async () => {
    for (let entry; (entry = queue.shift());) {
      const response = await fetch(entry.url, { signal: AbortSignal.timeout(25000), redirect: 'manual' });
      if (response.status !== 200) throw new Error(`${entry.url}: HTTP ${response.status}`);
      if (/noindex/i.test(response.headers.get('x-robots-tag') ?? '')) throw new Error(`${entry.url}: HTTP noindex`);
      const html = await response.text();
      dkdAssertStructuredData(html, entry.url);
      if (noindex(html) || canonical(html) !== entry.url) throw new Error(`${entry.url}: live canonical/indexing mismatch`);
      console.log(`200 indexable ${entry.url}`);
    }
  }));
}
console.log(`${entries.length} public canonical URLs: sitemap ${process.argv.includes('--check') ? 'verified' : 'updated'}.`);
