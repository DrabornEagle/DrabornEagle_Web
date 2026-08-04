const DKD_V311_JS_PARTS = 12;
const DKD_V311_CSS_PARTS = 7;

async function dkdV311LoadPart(dkdKind, dkdIndex) {
  const dkdUrl = new URL(`./v3.1.0.${dkdKind}.part.${dkdIndex}.txt?v=3.1.1`, import.meta.url);
  const dkdResponse = await fetch(dkdUrl, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`v3.1.1 ${dkdKind} parçası yüklenemedi (${dkdIndex}).`);
  return dkdResponse.text();
}

const dkdV311Css = (await Promise.all(
  Array.from({ length: DKD_V311_CSS_PARTS }, (_, dkdIndex) => dkdV311LoadPart('css', dkdIndex + 1))
)).join('');
const dkdV311Style = document.createElement('style');
dkdV311Style.dataset.dkdWebV311 = 'true';
dkdV311Style.textContent = dkdV311Css;
document.head.appendChild(dkdV311Style);

const dkdV311Source = (await Promise.all(
  Array.from({ length: DKD_V311_JS_PARTS }, (_, dkdIndex) => dkdV311LoadPart('js', dkdIndex + 1))
)).join('');
const dkdV311ModuleUrl = URL.createObjectURL(new Blob([dkdV311Source], { type: 'text/javascript' }));
try {
  await import(dkdV311ModuleUrl);
} finally {
  URL.revokeObjectURL(dkdV311ModuleUrl);
}
