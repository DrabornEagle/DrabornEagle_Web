import test from 'node:test';
import assert from 'node:assert/strict';
import { dkdApplyIdentity, dkdHome, dkdProfile, dkdOfficialSocials } from './dkd-search-identity.mjs';

const dkdFixture = `<html lang="tr"><head><title>DrabornEagle</title><meta name="description" content="Games"><link rel="canonical" href="${dkdHome}"><link rel="stylesheet" href="console.css"><style>.hero{color:pink}</style><script src="console.js"></script></head><body><h1>DrabornEagle</h1><button>Games</button><script>window.example='unchanged'</script></body></html>`;
const dkdGraph = dkdHtml => [...dkdHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(dkdBlock => JSON.parse(dkdBlock[1])['@graph'] ?? []);

test('changes SEO metadata while preserving the entire interface and its assets', () => {
  const dkdOutput = dkdApplyIdentity(dkdFixture, dkdHome);
  assert.equal(dkdOutput.slice(dkdOutput.indexOf('</head>')), dkdFixture.slice(dkdFixture.indexOf('</head>')));
  for (const dkdAsset of ['<link rel="stylesheet" href="console.css">', '<style>.hero{color:pink}</style>', '<script src="console.js"></script>']) assert.ok(dkdOutput.includes(dkdAsset));
  assert.match(dkdOutput, /<title>Doğancan Kartal \| DrabornEagle Resmî Web Sitesi<\/title>/);
  assert.match(dkdOutput, /Dogancan Kartal/);
  assert.equal(dkdApplyIdentity(dkdOutput, dkdHome), dkdOutput);
});

test('connects the official homepage, founder and verified socials without inventing identities', () => {
  const dkdNodes = dkdGraph(dkdApplyIdentity(dkdFixture, dkdHome));
  const dkdPerson = dkdNodes.find(dkdNode => dkdNode['@type'] === 'Person');
  assert.equal(dkdPerson['@id'], `${dkdProfile}#person`);
  assert.equal(dkdPerson.url, dkdHome);
  assert.ok(dkdPerson.alternateName.includes('draborneagle'));
  assert.deepEqual(dkdPerson.sameAs, dkdOfficialSocials);
  assert.equal(dkdNodes.find(dkdNode => dkdNode['@type'] === 'WebPage').mainEntity['@id'], dkdPerson['@id']);
  assert.equal(dkdNodes.find(dkdNode => dkdNode['@type'] === 'Organization').founder['@id'], dkdPerson['@id']);
  assert.equal(new Set(dkdNodes.map(dkdNode => dkdNode['@id'])).size, dkdNodes.length);
  for (const dkdNode of dkdNodes.filter(dkdNode => ['WebSite', 'Organization'].includes(dkdNode['@type']))) {
    assert.equal(dkdNode.name, 'DrabornEagle');
    assert.ok(dkdNode.alternateName.includes('draborneagle'));
    assert.ok(!JSON.stringify(dkdNode).toLowerCase().includes('dragon eagle'));
  }
});

test('retains profile dates and unrelated structured data across repeated exports', () => {
  const dkdSource = dkdFixture.replace(dkdHome + '">', dkdProfile + '">').replace('</head>', `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'ProfilePage', '@id': `${dkdProfile}#profile`, url: dkdProfile, dateModified: '2026-10-25T07:00:00Z' },
    { '@type': 'BreadcrumbList', '@id': 'breadcrumbs', itemListElement: [] }
  ] })}</script></head>`);
  const dkdOutput = dkdApplyIdentity(dkdSource, dkdProfile);
  assert.equal(dkdGraph(dkdOutput).find(dkdNode => dkdNode['@type'] === 'ProfilePage').dateModified, '2026-10-25T07:00:00Z');
  assert.deepEqual(dkdGraph(dkdOutput).find(dkdNode => dkdNode['@type'] === 'BreadcrumbList'), { '@type': 'BreadcrumbList', '@id': 'breadcrumbs', itemListElement: [] });
  assert.equal(dkdApplyIdentity(dkdOutput, dkdProfile), dkdOutput);
});

test('refuses mismatched canonicals and intentional noindex pages', () => {
  assert.throws(() => dkdApplyIdentity(dkdFixture, dkdProfile), /Canonical mismatch/);
  assert.throws(() => dkdApplyIdentity(dkdFixture.replace('</head>', '<meta name="robots" content="noindex,follow"></head>'), dkdHome), /Intentionally excluded/);
});
