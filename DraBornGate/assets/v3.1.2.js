const DKD_V312_JS_PARTS = 12;
const DKD_V312_CSS_PARTS = 7;

async function dkdV312LoadPart(dkdKind, dkdIndex) {
  const dkdUrl = new URL(`./v3.1.0.${dkdKind}.part.${dkdIndex}.txt?v=3.1.2`, import.meta.url);
  const dkdResponse = await fetch(dkdUrl, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`v3.1.2 ${dkdKind} parçası yüklenemedi (${dkdIndex}).`);
  return dkdResponse.text();
}

const dkdV312Css = (await Promise.all(
  Array.from({ length: DKD_V312_CSS_PARTS }, (_, dkdIndex) => dkdV312LoadPart('css', dkdIndex + 1))
)).join('');
const dkdV312Style = document.createElement('style');
dkdV312Style.dataset.dkdWebV312 = 'true';
dkdV312Style.textContent = dkdV312Css;
document.head.appendChild(dkdV312Style);

const dkdV312Source = (await Promise.all(
  Array.from({ length: DKD_V312_JS_PARTS }, (_, dkdIndex) => dkdV312LoadPart('js', dkdIndex + 1))
)).join('');
const dkdV312ModuleUrl = URL.createObjectURL(new Blob([dkdV312Source], { type: 'text/javascript' }));
try {
  await import(dkdV312ModuleUrl);
} finally {
  URL.revokeObjectURL(dkdV312ModuleUrl);
}
