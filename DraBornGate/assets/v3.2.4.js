const DKD_V324_JS_PARTS = 12;
const DKD_V324_CSS_PARTS = 7;
const DKD_V324_VERSION = '3.2.4';

async function dkdV324LoadPart(dkdKind, dkdIndex) {
  const dkdUrl = new URL(`./v3.1.0.${dkdKind}.part.${dkdIndex}.txt?v=${DKD_V324_VERSION}`, import.meta.url);
  const dkdResponse = await fetch(dkdUrl, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`v${DKD_V324_VERSION} ${dkdKind} parçası yüklenemedi (${dkdIndex}).`);
  return dkdResponse.text();
}

const dkdV324Css = (await Promise.all(
  Array.from({ length: DKD_V324_CSS_PARTS }, (_, dkdIndex) => dkdV324LoadPart('css', dkdIndex + 1))
)).join('');
const dkdV324Style = document.createElement('style');
dkdV324Style.dataset.dkdWebV324Core = 'true';
dkdV324Style.textContent = dkdV324Css;
document.head.appendChild(dkdV324Style);

const dkdV324Source = (await Promise.all(
  Array.from({ length: DKD_V324_JS_PARTS }, (_, dkdIndex) => dkdV324LoadPart('js', dkdIndex + 1))
)).join('');
const dkdV324ModuleUrl = URL.createObjectURL(new Blob([dkdV324Source], { type: 'text/javascript' }));
try {
  await import(dkdV324ModuleUrl);
} finally {
  URL.revokeObjectURL(dkdV324ModuleUrl);
}

await import(`./v3.2.4.patch.js?v=${DKD_V324_VERSION}`);
