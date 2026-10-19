import { test as dkdTest } from 'node:test';
import dkdAssert from 'node:assert/strict';
import { dkdValidDate, dkdValidateStructuredData } from './dkd-search-structured-data.mjs';

const dkdProfileHtml = dkdDate => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@graph': [{
    '@type': 'ProfilePage', dateModified: dkdDate,
    mainEntity: { '@type': 'Person', name: 'Doğancan Kartal' }
  }]
})}</script>`;

dkdTest('rejects the exact date-only ProfilePage value flagged by Google', () => {
  dkdAssert.equal(dkdValidateStructuredData(dkdProfileHtml('2026-10-18')).errors.length, 1);
});
dkdTest('accepts UTC and explicit local offsets in profile timestamps', () => {
  for (const dkdDate of ['2026-10-19T12:34:11Z', '2026-10-19T15:34:11+03:00']) {
    dkdAssert.deepEqual(dkdValidateStructuredData(dkdProfileHtml(dkdDate)).errors, []);
  }
});
dkdTest('rejects impossible dates and timestamps with no timezone', () => {
  for (const dkdDate of ['2026-02-30T12:34:11Z', '2026-10-19T25:34:11Z', '2026-10-19T12:34:11', '2026-10-19T12:34:11+03:99']) {
    dkdAssert.equal(dkdValidDate(dkdDate, true), false, dkdDate);
  }
});
dkdTest('allows valid date-only values on ordinary pages and detects broken JSON', () => {
  dkdAssert.deepEqual(dkdValidateStructuredData('<script type="application/ld+json">{"@type":"WebPage","dateModified":"2026-10-18"}</script>').errors, []);
  dkdAssert.equal(dkdValidateStructuredData('<script type="application/ld+json">{"@type":</script>').errors.length, 1);
});
