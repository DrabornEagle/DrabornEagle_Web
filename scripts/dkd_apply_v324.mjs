import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dkdPayloadRoot = path.resolve(process.cwd(), 'scripts/v324_payload');
const dkdPayload = fs.readdirSync(dkdPayloadRoot)
  .filter((dkdName) => /^\d+\.txt$/.test(dkdName))
  .sort()
  .map((dkdName) => fs.readFileSync(path.join(dkdPayloadRoot, dkdName), 'utf8').trim())
  .join('');

const dkdFiles = JSON.parse(
  zlib.gunzipSync(Buffer.from(dkdPayload, 'base64')).toString('utf8')
);

for (const [dkdRelativePath, dkdContent] of Object.entries(dkdFiles)) {
  const dkdTarget = path.resolve(process.cwd(), dkdRelativePath);
  fs.mkdirSync(path.dirname(dkdTarget), { recursive: true });
  fs.writeFileSync(dkdTarget, dkdContent, 'utf8');
}

for (const dkdCleanup of [
  'scripts/v324_payload',
  'scripts/dkd_apply_v324.mjs',
  '.github/workflows/draborngate-web-v324-bootstrap.yml',
]) {
  fs.rmSync(path.resolve(process.cwd(), dkdCleanup), { recursive: true, force: true });
}

console.log(`DraBornGate Web v3.2.4 dosyaları uygulandı: ${Object.keys(dkdFiles).length}`);
