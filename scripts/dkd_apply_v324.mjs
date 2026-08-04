import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dkdPayloadRoot = path.resolve(process.cwd(), 'scripts/v324_payload');
const dkdPayloadParts = [
  '01a.txt', '01b.txt', '01c.txt', '01d.txt',
  '02.txt', '03.txt', '04.txt', '05.txt', '06.txt', '07.txt',
];
const dkdPayload = dkdPayloadParts
  .map((dkdName) => fs.readFileSync(path.join(dkdPayloadRoot, dkdName), 'utf8').trim())
  .join('');
const dkdPayloadHash = crypto.createHash('sha256').update(dkdPayload).digest('hex');

if (dkdPayloadHash !== '2b41d46dbbb65de99ff9ebf5cf679ddf8af517fc9963c1f0018d42d5b20d1be4') {
  throw new Error(`v3.2.4 payload doğrulaması başarısız: ${dkdPayloadHash}`);
}

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
