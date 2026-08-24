import fs from 'node:fs';

const dkd_tag_bootstrap=`<base href="/DraBornPark/">
<script>
(() => {
  const dkd_match=location.pathname.match(/^\\/DraBornPark\\/tag\\/([^/?#]+)\\/?$/i);
  globalThis.DKDBP_PATH_TAG=dkd_match?decodeURIComponent(dkd_match[1]):'';
})();
</script>`;

let dkd_index=fs.readFileSync('DraBornPark/index.html','utf8');
if(!dkd_index.includes('<head>'))throw new Error('DraBornPark index head missing');
dkd_index=dkd_index.replace('<head>','<head>'+dkd_tag_bootstrap);
dkd_index=dkd_index.replace('<title>DraBornPark — Güvenli Araç İletişimi</title>','<title>DraBornPark — Güvenli Araç İletişimi • v1.0.5</title><meta name="robots" content="noindex,nofollow">');
fs.writeFileSync('DraBornPark/tag/index.html',dkd_index);

for(const dkd_path of ['DraBornPark/contact-v051.js','DraBornPark/web-v055.js']){
  let dkd_source=fs.readFileSync(dkd_path,'utf8');
  const dkd_old=dkd_path.endsWith('contact-v051.js')
    ? "const rawTag=(new URLSearchParams(location.search).get('tag')||'').trim();"
    : "const dkd_raw_tag=(new URLSearchParams(location.search).get('tag')||'').trim();";
  const dkd_new=dkd_path.endsWith('contact-v051.js')
    ? "const rawTag=(new URLSearchParams(location.search).get('tag')||globalThis.DKDBP_PATH_TAG||'').trim();"
    : "const dkd_raw_tag=(new URLSearchParams(location.search).get('tag')||globalThis.DKDBP_PATH_TAG||'').trim();";
  if(!dkd_source.includes(dkd_old) && !dkd_source.includes(dkd_new))throw new Error(`Tag resolver marker missing: ${dkd_path}`);
  dkd_source=dkd_source.replace(dkd_old,dkd_new);
  fs.writeFileSync(dkd_path,dkd_source);
}

console.log('DraBornPark old premium Güvenli Araç İletişimi design restored for /tag/* path URLs.');
