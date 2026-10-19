// Google ProfilePage dateCreated/dateModified require DateTime values.
// Generic WebPage dates and sitemap lastmod may legitimately be date-only.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const dkdRoot = fileURLToPath(new URL('../', import.meta.url));

export function dkdValidDate(dkdValue, dkdRequireTime = false) {
  if (typeof dkdValue !== 'string') return false;
  const dkdMatch = dkdValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(Z|[+-]\d{2}:\d{2}))?$/);
  if (!dkdMatch || (dkdRequireTime && !dkdMatch[4])) return false;
  const [, dkdYear, dkdMonth, dkdDay, dkdHour, dkdMinute, dkdSecond, dkdZone] = dkdMatch;
  if (+dkdMonth < 1 || +dkdMonth > 12 || +dkdDay < 1) return false;
  if (+dkdDay > new Date(Date.UTC(+dkdYear, +dkdMonth, 0)).getUTCDate()) return false;
  if (dkdHour !== undefined && (+dkdHour > 23 || +dkdMinute > 59 || +(dkdSecond ?? 0) > 59)) return false;
  if (dkdZone && dkdZone !== 'Z' && (+dkdZone.slice(1, 3) > 23 || +dkdZone.slice(4) > 59)) return false;
  return Number.isFinite(Date.parse(dkdValue));
}

export function dkdValidateStructuredData(dkdHtml, dkdLabel = 'HTML') {
  const dkdErrors = [];
  const dkdBlocks = [...dkdHtml.matchAll(/<script\b(?=[^>]*\btype\s*=\s*["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script\s*>/gi)];
  function dkdWalk(dkdNode, dkdPath) {
    if (!dkdNode || typeof dkdNode !== 'object') return;
    if (Array.isArray(dkdNode)) {
      dkdNode.forEach((dkdItem, dkdIndex) => dkdWalk(dkdItem, `${dkdPath}[${dkdIndex}]`));
      return;
    }
    const dkdTypes = [dkdNode['@type']].flat();
    const dkdProfile = dkdTypes.some(dkdType => dkdType === 'ProfilePage' || dkdType === 'https://schema.org/ProfilePage');
    for (const [dkdKey, dkdValue] of Object.entries(dkdNode)) {
      if (['dateCreated', 'dateModified', 'datePublished'].includes(dkdKey)) {
        const dkdRequireTime = dkdProfile && ['dateCreated', 'dateModified'].includes(dkdKey);
        if (!dkdValidDate(dkdValue, dkdRequireTime)) {
          dkdErrors.push(`${dkdLabel} ${dkdPath}.${dkdKey}: invalid ${dkdRequireTime ? 'DateTime (include time and timezone)' : 'date'}: ${JSON.stringify(dkdValue)}`);
        }
      }
      dkdWalk(dkdValue, `${dkdPath}.${dkdKey}`);
    }
  }
  dkdBlocks.forEach((dkdBlock, dkdIndex) => {
    try { dkdWalk(JSON.parse(dkdBlock[1]), `JSON-LD[${dkdIndex}]`); }
    catch (dkdError) { dkdErrors.push(`${dkdLabel} JSON-LD[${dkdIndex}]: ${dkdError.message}`); }
  });
  return { blocks: dkdBlocks.length, errors: dkdErrors };
}

export function dkdAssertStructuredData(dkdHtml, dkdLabel) {
  const dkdResult = dkdValidateStructuredData(dkdHtml, dkdLabel);
  if (dkdResult.errors.length) throw new Error(dkdResult.errors.join('\n'));
  return dkdResult;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dkdFiles = execFileSync('git', ['ls-files', '-z', '--', '*.html'], { cwd: dkdRoot, encoding: 'utf8' }).split('\0').filter(Boolean);
  let dkdCount = 0;
  const dkdErrors = [];
  for (const dkdFile of dkdFiles) {
    const dkdResult = dkdValidateStructuredData(readFileSync(resolve(dkdRoot, dkdFile), 'utf8'), dkdFile);
    dkdCount += dkdResult.blocks;
    dkdErrors.push(...dkdResult.errors);
  }
  if (dkdErrors.length) {
    console.error(dkdErrors.join('\n'));
    process.exitCode = 1;
  } else console.log(`${dkdFiles.length} HTML files, ${dkdCount} JSON-LD blocks: dates and JSON verified.`);
}
