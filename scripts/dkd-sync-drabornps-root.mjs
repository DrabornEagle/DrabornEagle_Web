import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dkdRepo = new URL('../', import.meta.url);
const dkdSource = new URL('DraBornPS/index.html', dkdRepo);
const dkdTarget = new URL('index.html', dkdRepo);
const dkdRawHtml = await readFile(dkdSource, 'utf8');
const dkdSupportPreload = '  <script src="js/support-preload.js?v=0.6.13"></script>\n';
const dkdVersionScript = "  <script>document.querySelectorAll('.dkd-version').forEach(el=>el.textContent='v'+document.documentElement.dataset.dkdVersion);</script>";
const dkdHtml = dkdRawHtml.includes('js/support-preload.js')
 ? dkdRawHtml
 : dkdRawHtml.replace(dkdVersionScript, `${dkdSupportPreload}${dkdVersionScript}`);

if (!/data-dkd-version="[0-9.]+"/.test(dkdHtml) || !dkdHtml.includes("dkdBase.href = '/DraBornPS/'")) {
 throw new Error('DraBornPS entry point must declare its version and shared asset base.');
}
if (!dkdHtml.includes('js/support-preload.js?v=0.6.13')) {
 throw new Error('DraBornPS Support instant preloader injection failed.');
}

if (process.argv.includes('--check')) {
 if (await readFile(dkdTarget, 'utf8') !== dkdHtml) throw new Error('Root entry point is out of sync with DraBornPS.');
 console.log('DraBornPS root synchronization verified.');
} else {
 await writeFile(dkdSource, dkdHtml);
 await writeFile(dkdTarget, dkdHtml);
 console.log(`DraBornPS synchronized to ${fileURLToPath(dkdTarget)} with instant Support preload.`);
}
