// Keep the official founder, website and social identity consistent after exports.
// Only metadata in <head> is changed; the interface, styles and application code stay intact.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { dkdAssertStructuredData } from './dkd-search-structured-data.mjs';

const dkdRoot = fileURLToPath(new URL('../', import.meta.url));
export const dkdHome = 'https://www.draborneagle.com/';
export const dkdProfile = `${dkdHome}DogancanKartal/`;
const dkdPersonId = `${dkdProfile}#person`;
const dkdOrganizationId = `${dkdHome}#organization`;
const dkdWebsiteId = `${dkdHome}#website`;
const dkdPersonReference = { '@id': dkdPersonId };
const dkdOrganizationReference = { '@id': dkdOrganizationId };
export const dkdOfficialSocials = [
  'https://www.instagram.com/draborneagle/',
  'https://x.com/DrabornEagle',
  'https://www.tiktok.com/@draborneagle',
  'https://www.linkedin.com/in/draborneagle',
  'https://www.facebook.com/dogancan.kartal.2025/',
  'https://github.com/DrabornEagle',
  'https://buymeacoffee.com/draborneagle'
];
const dkdPerson = {
  '@type': 'Person', '@id': dkdPersonId,
  name: 'Doğancan Kartal', givenName: 'Doğancan', familyName: 'Kartal',
  alternateName: ['Dogancan Kartal', 'DrabornEagle', 'DraBornEagle', 'draborneagle'],
  url: dkdHome,
  description: 'Doğancan Kartal (Dogancan Kartal), DrabornEagle kurucusu, oyun geliştirici ve oyun tasarımcısıdır.',
  disambiguatingDescription: 'DrabornEagle oyun, Android uygulama ve web projelerinin kurucusu ve geliştiricisi.',
  jobTitle: ['DrabornEagle Kurucusu', 'Oyun Geliştirici', 'Oyun Tasarımcısı'],
  sameAs: dkdOfficialSocials,
  worksFor: dkdOrganizationReference,
  mainEntityOfPage: { '@id': `${dkdProfile}#profile` }
};
const dkdOrganization = {
  '@type': 'Organization', '@id': dkdOrganizationId, name: 'DrabornEagle',
  alternateName: ['draborneagle', 'DraBornEagle', 'DrabornEagle Ecosystem'],
  url: dkdHome, founder: dkdPersonReference,
  disambiguatingDescription: 'Doğancan Kartal tarafından kurulan DrabornEagle oyun, Android uygulama ve web projeleri ekosistemi.'
};
const dkdWebsite = {
  '@type': 'WebSite', '@id': dkdWebsiteId, name: 'DrabornEagle', url: dkdHome,
  alternateName: ['draborneagle', 'DraBornEagle', 'draborneagle.com'],
  description: 'DrabornEagle, Doğancan Kartal (Dogancan Kartal) tarafından geliştirilen oyun, Android uygulama ve web projelerinin resmî web sitesidir.',
  creator: dkdPersonReference, publisher: dkdOrganizationReference, inLanguage: 'tr-TR'
};
const dkdCoreMetadata = new Map([
  [dkdHome, {
    title: 'Doğancan Kartal | DrabornEagle Resmî Web Sitesi',
    description: 'Doğancan Kartal (Dogancan Kartal), DrabornEagle kurucusu, oyun geliştirici ve oyun tasarımcısı. Oyunları, Android ve web projeleri, resmî sosyal hesapları.'
  }],
  [dkdProfile, {
    title: 'Doğancan Kartal (DrabornEagle) | Kurucu Profili',
    description: 'Doğancan Kartal (Dogancan Kartal): DrabornEagle kurucusu, oyun geliştirici ve oyun tasarımcısı. Biyografisi, projeleri ve resmî sosyal medya hesapları.'
  }],
  [`${dkdHome}Hakkimizda/`, {
    title: 'DrabornEagle Hakkında | Doğancan Kartal ve Projeleri',
    description: 'DrabornEagle, Doğancan Kartal (Dogancan Kartal) tarafından kurulan oyun, Android ve web projeleri ekosistemidir. Projeleri ve resmî hesapları keşfet.'
  }]
]);
const dkdEncode = dkdValue => dkdValue.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const dkdDecode = dkdValue => dkdValue.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, dkdCode) => String.fromCodePoint(dkdCode[0].toLowerCase() === 'x' ? parseInt(dkdCode.slice(1), 16) : +dkdCode))
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&apos;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const dkdJson = dkdValue => JSON.stringify(dkdValue).replaceAll('<', '\\u003c');

export function dkdApplyIdentity(dkdHtml, dkdUrl) {
  const dkdHeadMatch = dkdHtml.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if (!dkdHeadMatch) throw new Error(`Missing head: ${dkdUrl}`);
  let dkdHead = dkdHeadMatch[0];
  const dkdCanonicals = [...dkdHead.matchAll(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)];
  if (dkdCanonicals.length !== 1 || dkdCanonicals[0][1] !== dkdUrl) throw new Error(`Canonical mismatch: ${dkdUrl}`);
  if (/<meta\b(?=[^>]*\bname=["'](?:robots|googlebot)["'])(?=[^>]*\bcontent=["'][^"']*\bnoindex\b)/i.test(dkdHead)) throw new Error(`Intentionally excluded page: ${dkdUrl}`);
  dkdAssertStructuredData(dkdHtml, dkdUrl);
  function dkdSetTag(dkdMatcher, dkdTag) {
    if (dkdMatcher.test(dkdHead)) dkdHead = dkdHead.replace(dkdMatcher, dkdTag);
    else dkdHead = dkdHead.replace(/<\/head>/i, `${dkdTag}\n</head>`);
  }
  const dkdCore = dkdCoreMetadata.get(dkdUrl);
  if (dkdCore) {
    dkdSetTag(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${dkdEncode(dkdCore.title)}</title>`);
    dkdSetTag(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i, `<meta name="description" content="${dkdEncode(dkdCore.description)}">`);
    for (const dkdKind of ['title', 'description']) {
      dkdSetTag(new RegExp(`<meta\\b(?=[^>]*\\bproperty=["']og:${dkdKind}["'])[^>]*>`, 'i'), `<meta property="og:${dkdKind}" content="${dkdEncode(dkdCore[dkdKind])}">`);
      dkdSetTag(new RegExp(`<meta\\b(?=[^>]*\\bname=["']twitter:${dkdKind}["'])[^>]*>`, 'i'), `<meta name="twitter:${dkdKind}" content="${dkdEncode(dkdCore[dkdKind])}">`);
    }
  }
  dkdSetTag(/<meta\b(?=[^>]*\bname=["']author["'])[^>]*>/i, '<meta name="author" content="Doğancan Kartal (DrabornEagle)">');
  dkdSetTag(/<link\b(?=[^>]*\brel=["']author["'])[^>]*>/i, `<link rel="author" href="${dkdProfile}">`);
  dkdSetTag(/<meta\b(?=[^>]*\bname=["']twitter:creator["'])[^>]*>/i, '<meta name="twitter:creator" content="@DrabornEagle">');
  const dkdTitle = dkdCore?.title ?? dkdDecode(dkdHead.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? 'DrabornEagle');
  const dkdScripts = [...dkdHead.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script\s*>/gi)];
  const dkdDocuments = dkdScripts.map(dkdScript => JSON.parse(dkdScript[1]));
  const dkdNodes = dkdDocuments.flatMap(dkdDocument => Array.isArray(dkdDocument) ? dkdDocument : dkdDocument['@graph'] ?? [dkdDocument]);
  const dkdAdditions = [];
  for (const dkdDefinition of [dkdPerson, dkdOrganization, dkdWebsite]) {
    const dkdExisting = dkdNodes.filter(dkdNode => dkdNode['@id'] === dkdDefinition['@id']);
    if (dkdExisting.length > 1) throw new Error(`Duplicate identity ID: ${dkdDefinition['@id']}`);
    if (dkdExisting.length) Object.assign(dkdExisting[0], structuredClone(dkdDefinition));
    else dkdAdditions.push(structuredClone(dkdDefinition));
  }
  let dkdPage = dkdNodes.find(dkdNode => dkdNode.url === dkdUrl && ['WebPage', 'ProfilePage', 'AboutPage', 'CollectionPage'].some(dkdType => [dkdNode['@type']].flat().includes(dkdType)));
  if (!dkdPage) {
    dkdPage = { '@type': 'WebPage', '@id': `${dkdUrl}#webpage`, url: dkdUrl, name: dkdTitle };
    dkdAdditions.push(dkdPage);
  }
  Object.assign(dkdPage, { author: dkdPersonReference, creator: dkdPersonReference, isPartOf: { '@id': dkdWebsiteId }, publisher: dkdOrganizationReference });
  if (dkdCore) Object.assign(dkdPage, { name: dkdCore.title, description: dkdCore.description });
  if (dkdUrl === dkdHome || dkdUrl === dkdProfile) dkdPage.mainEntity = dkdPersonReference;
  if (dkdUrl === dkdHome) dkdPage.about = [dkdPersonReference, dkdOrganizationReference];
  dkdScripts.forEach((dkdScript, dkdIndex) => {
    const dkdUpdatedScript = dkdScript[0].replace(dkdScript[1], () => dkdJson(dkdDocuments[dkdIndex]));
    dkdHead = dkdHead.replace(dkdScript[0], () => dkdUpdatedScript);
  });
  if (dkdAdditions.length) {
    // Keep other schemas (breadcrumbs, games, applications) and their IDs intact.
    dkdHead = dkdHead.replace(/<\/head>/i, `<script type="application/ld+json" data-dkd-identity="official">${dkdJson({ '@context': 'https://schema.org', '@graph': dkdAdditions })}</script>\n</head>`);
  }
  const dkdOutput = dkdHtml.replace(dkdHeadMatch[0], () => dkdHead);
  dkdAssertStructuredData(dkdOutput, dkdUrl);
  return dkdOutput;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dkdSitemap = readFileSync(resolve(dkdRoot, 'sitemap.xml'), 'utf8');
  const dkdUrls = [...dkdSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(dkdMatch => dkdMatch[1]);
  let dkdChanged = 0;
  for (const dkdUrl of dkdUrls) {
    if (new URL(dkdUrl).origin !== new URL(dkdHome).origin) throw new Error(`Unexpected sitemap origin: ${dkdUrl}`);
    const dkdFiles = [resolve(dkdRoot, `.${new URL(dkdUrl).pathname}index.html`)];
    if (dkdUrl === dkdHome) dkdFiles.push(resolve(dkdRoot, 'DraBornPS/index.html'));
    for (const dkdFile of dkdFiles) {
      const dkdOriginal = readFileSync(dkdFile, 'utf8');
      const dkdUpdated = dkdApplyIdentity(dkdOriginal, dkdUrl);
      if (dkdOriginal !== dkdUpdated) {
        if (process.argv.includes('--check')) throw new Error(`Official identity metadata is out of sync: ${dkdFile}`);
        writeFileSync(dkdFile, dkdUpdated);
        dkdChanged++;
      }
    }
  }
  console.log(`${dkdUrls.length} canonical public pages plus homepage alias: official identity ${process.argv.includes('--check') ? 'verified' : `synchronized (${dkdChanged} changed)`}.`);
  if (process.argv.includes('--check-live')) {
    const dkdQueue = [...dkdUrls];
    await Promise.all(Array.from({ length: 4 }, async () => {
      for (let dkdUrl; (dkdUrl = dkdQueue.shift());) {
        const dkdResponse = await fetch(dkdUrl, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
        if (dkdResponse.status !== 200 || /noindex/i.test(dkdResponse.headers.get('x-robots-tag') ?? '')) throw new Error(`Live page unavailable or excluded: ${dkdUrl}`);
        const dkdHtml = await dkdResponse.text();
        if (dkdApplyIdentity(dkdHtml, dkdUrl) !== dkdHtml) throw new Error(`Live official identity is outdated: ${dkdUrl}`);
        console.log(`200 canonical/indexable, official identity verified: ${dkdUrl}`);
      }
    }));
  }
}
