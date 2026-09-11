import * as dkd_fs from 'node:fs/promises';
import { createHash as dkd_createHash } from 'node:crypto';
import { execFileSync as dkd_execFileSync } from 'node:child_process';

const dkd_repo = 'DrabornEagle/DraBornGames';
const dkd_base = 'DraBornGames/LastMile';
const dkd_current = JSON.parse(await dkd_fs.readFile(`${dkd_base}/version.json`, 'utf8'));
const dkd_releases = JSON.parse(dkd_execFileSync('gh', ['api', `repos/${dkd_repo}/releases?per_page=20`], { encoding: 'utf8' }));
const dkd_release = dkd_releases.find(dkd_item => !dkd_item.draft && !dkd_item.prerelease && dkd_item.tag_name.startsWith(`lastmile-v${dkd_current.dkd_version}-`));
if (!dkd_release) { console.log('Bu oyun sürümü için imzalı Release APK henüz tamamlanmadı.'); process.exit(0); }
const dkd_filename = `LastMile-v${dkd_current.dkd_version}-release-vc1.apk`;
const dkd_apk = dkd_release.assets.find(dkd_asset => dkd_asset.name === dkd_filename);
const dkd_sums = dkd_release.assets.find(dkd_asset => dkd_asset.name === 'SHA256SUMS.txt');
const dkd_signing = dkd_release.assets.find(dkd_asset => dkd_asset.name === 'SIGNING-IDENTITY.txt');
if (!dkd_apk || !dkd_sums || !dkd_signing) throw new Error('APK doğrulama dosyaları eksik.');
const dkd_dir = `${dkd_base}/downloads`;
await dkd_fs.mkdir(dkd_dir, { recursive: true });
let dkd_previous;
try { dkd_previous = JSON.parse(await dkd_fs.readFile(`${dkd_dir}/release.json`, 'utf8')); } catch {}
if (dkd_previous?.dkd_assetId === dkd_apk.id) {
  const dkd_local = await dkd_fs.readFile(`${dkd_dir}/${dkd_filename}`).catch(() => null);
  if (dkd_local && dkd_createHash('sha256').update(dkd_local).digest('hex') === dkd_previous.dkd_sha256) process.exit(0);
}
dkd_execFileSync('gh', ['release', 'download', dkd_release.tag_name, '--repo', dkd_repo, '--dir', dkd_dir, '--pattern', dkd_filename, '--pattern', 'SHA256SUMS.txt', '--pattern', 'SIGNING-IDENTITY.txt', '--pattern', 'BUILD-INFO.txt', '--clobber'], { stdio: 'inherit' });
const dkd_bytes = await dkd_fs.readFile(`${dkd_dir}/${dkd_filename}`);
if (dkd_bytes.length > 95 * 1024 * 1024) throw new Error('APK GitHub dosya sınırını aşıyor. Önce APK boyutunu azalt.');
const dkd_hash = dkd_createHash('sha256').update(dkd_bytes).digest('hex');
const dkd_sumText = await dkd_fs.readFile(`${dkd_dir}/SHA256SUMS.txt`, 'utf8');
const dkd_expected = dkd_sumText.split('\n').find(dkd_line => dkd_line.trim().endsWith(dkd_filename))?.split(/\s/)[0];
if (dkd_hash !== dkd_expected) throw new Error('APK SHA256 eşleşmiyor.');
const dkd_cert = await dkd_fs.readFile(`${dkd_dir}/SIGNING-IDENTITY.txt`, 'utf8');
if (!dkd_cert.replaceAll(':', '').toLowerCase().includes('b3042b120c61c1deec8cc2619c5513c4f7b3378d81c6235e9285ccf6069609bc')) throw new Error('Kalıcı imza eşleşmiyor.');
const dkd_info = await dkd_fs.readFile(`${dkd_dir}/BUILD-INFO.txt`, 'utf8');
const dkd_sdk = Number(dkd_info.match(/sdkVersion:'(\d+)'/)?.[1] || 24);
const dkd_androidNames = { 24: '7.0', 25: '7.1', 26: '8.0', 27: '8.1', 28: '9', 29: '10', 30: '11', 31: '12', 32: '12L', 33: '13', 34: '14', 35: '15', 36: '16' };
for (const dkd_file of await dkd_fs.readdir(dkd_dir)) {
  if (dkd_file.endsWith('.apk') && dkd_file !== dkd_filename) await dkd_fs.unlink(`${dkd_dir}/${dkd_file}`);
}
await dkd_fs.writeFile(`${dkd_dir}/release.json`, JSON.stringify({
  dkd_version: dkd_current.dkd_version, dkd_versionCode: 1,
  dkd_filename, dkd_sha256: dkd_hash, dkd_bytes: dkd_bytes.length,
  dkd_assetId: dkd_apk.id,
  dkd_apkUrl: dkd_apk.browser_download_url,
  dkd_releaseUrl: dkd_release.html_url,
  dkd_releaseTag: dkd_release.tag_name,
  dkd_minAndroid: dkd_androidNames[dkd_sdk] || `API ${dkd_sdk}`,
  dkd_architecture: 'arm64-v8a',
}, null, 2) + '\n');
console.log(`Doğrulanmış APK web'e kopyalandı: ${dkd_filename}`);

// v0.7.4 signed Release refresh: keep Web and Android publication in the same release checkpoint.
