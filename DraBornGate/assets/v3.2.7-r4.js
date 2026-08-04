const DKD_V327_R4_REVISION = '3.2.7-r4';

function dkdV327R4Import(dkdPath) {
  const dkdUrl = new URL(dkdPath, import.meta.url);
  dkdUrl.searchParams.set('v', DKD_V327_R4_REVISION);
  return import(dkdUrl.href);
}

await dkdV327R4Import('./v3.2.5.stability.js');
await dkdV327R4Import('./v3.2.4.runtime.js');
await dkdV327R4Import('./v3.2.5.session.runtime.js');
await dkdV327R4Import('./v3.2.7.features.js');
await dkdV327R4Import('./v3.2.5.features.runtime.js');
window.__DKD_GATE_V327_FEATURES__?.patch?.();
sessionStorage.setItem('dkd_gate_web_version', '3.2.7');
sessionStorage.setItem('dkd_gate_web_revision', DKD_V327_R4_REVISION);
