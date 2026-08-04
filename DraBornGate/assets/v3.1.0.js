const DKD_V31_JS_PARTS = 12;
const DKD_V31_CSS_PARTS = 7;

async function dkdV31LoadPart(dkdKind, dkdIndex) {
  const dkdUrl = new URL(`./v3.1.0.${dkdKind}.part.${dkdIndex}.txt?v=3.1.0`, import.meta.url);
  const dkdResponse = await fetch(dkdUrl, { cache: 'no-cache' });
  if (!dkdResponse.ok) throw new Error(`v3.1.0 ${dkdKind} parçası yüklenemedi (${dkdIndex}).`);
  return dkdResponse.text();
}

const dkdV31Css = (await Promise.all(
  Array.from({ length: DKD_V31_CSS_PARTS }, (_, dkdIndex) => dkdV31LoadPart('css', dkdIndex + 1))
)).join('');
const dkdV31Style = document.createElement('style');
dkdV31Style.dataset.dkdWebV310 = 'true';
dkdV31Style.textContent = dkdV31Css;
document.head.appendChild(dkdV31Style);

const dkdV31Source = (await Promise.all(
  Array.from({ length: DKD_V31_JS_PARTS }, (_, dkdIndex) => dkdV31LoadPart('js', dkdIndex + 1))
)).join('');
const dkdV31ModuleUrl = URL.createObjectURL(new Blob([dkdV31Source], { type: 'text/javascript' }));
try {
  await import(dkdV31ModuleUrl);
} finally {
  URL.revokeObjectURL(dkdV31ModuleUrl);
}
