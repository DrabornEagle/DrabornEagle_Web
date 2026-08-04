const DKD_V321_JS_PARTS = 12;
const DKD_V321_CSS_PARTS = 7;
const DKD_V321_VERSION = '3.2.1';

async function dkdV321LoadPart(dkdKind, dkdIndex) {
  const dkdUrl = new URL(`./v3.1.0.${dkdKind}.part.${dkdIndex}.txt?v=${DKD_V321_VERSION}`, import.meta.url);
  const dkdResponse = await fetch(dkdUrl, { cache: 'no-store' });
  if (!dkdResponse.ok) throw new Error(`v${DKD_V321_VERSION} ${dkdKind} parçası yüklenemedi (${dkdIndex}).`);
  return dkdResponse.text();
}

const dkdV321Css = (await Promise.all(
  Array.from({ length: DKD_V321_CSS_PARTS }, (_, dkdIndex) => dkdV321LoadPart('css', dkdIndex + 1))
)).join('');
const dkdV321Style = document.createElement('style');
dkdV321Style.dataset.dkdWebV321 = 'true';
dkdV321Style.textContent = dkdV321Css;
document.head.appendChild(dkdV321Style);

const dkdV321Source = (await Promise.all(
  Array.from({ length: DKD_V321_JS_PARTS }, (_, dkdIndex) => dkdV321LoadPart('js', dkdIndex + 1))
)).join('');
const dkdV321ModuleUrl = URL.createObjectURL(new Blob([dkdV321Source], { type: 'text/javascript' }));
try {
  await import(dkdV321ModuleUrl);
} finally {
  URL.revokeObjectURL(dkdV321ModuleUrl);
}
