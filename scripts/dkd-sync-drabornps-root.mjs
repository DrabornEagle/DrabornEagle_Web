import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dkdRepo = new URL('../', import.meta.url);
const dkdSource = new URL('DraBornPS/index.html', dkdRepo);
const dkdTarget = new URL('index.html', dkdRepo);
const dkdHtml = await readFile(dkdSource, 'utf8');
if (!/data-dkd-version="[0-9.]+"/.test(dkdHtml) || !dkdHtml.includes("dkdBase.href = '/DraBornPS/'")) {
 throw new Error('DraBornPS entry point must declare its version and shared asset base.');
}
if (process.argv.includes('--check')) {
 if (await readFile(dkdTarget, 'utf8') !== dkdHtml) throw new Error('Root entry point is out of sync with DraBornPS.');
 console.log('DraBornPS root synchronization verified.');
} else {
 await writeFile(dkdTarget, dkdHtml);
 console.log(`DraBornPS synchronized to ${fileURLToPath(dkdTarget)}`);
}
