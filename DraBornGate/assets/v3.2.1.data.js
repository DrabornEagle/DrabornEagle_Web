const DKD_V321_VERSION = '3.2.1';
const DKD_V321_RPC_PATTERN = /\/rest\/v1\/rpc\/dkd_gate_[a-z0-9_]+_v31(?:\?|$)/i;

if (!window.__DKD_GATE_V321_PUBLIC_RPC_FETCH__) {
  const dkdV321NativeFetch = window.fetch.bind(window);
  window.__DKD_GATE_V321_PUBLIC_RPC_FETCH__ = dkdV321NativeFetch;

  window.fetch = function dkdV321PublicRpcFetch(dkdInput, dkdInit = {}) {
    const dkdUrl = typeof dkdInput === 'string' || dkdInput instanceof URL
      ? String(dkdInput)
      : String(dkdInput?.url || '');

    if (!DKD_V321_RPC_PATTERN.test(dkdUrl)) return dkdV321NativeFetch(dkdInput, dkdInit);

    const dkdHeaders = new Headers(dkdInput instanceof Request ? dkdInput.headers : undefined);
    const dkdOverrideHeaders = new Headers(dkdInit?.headers || undefined);
    dkdOverrideHeaders.forEach((dkdValue, dkdKey) => dkdHeaders.set(dkdKey, dkdValue));
    dkdHeaders.delete('Accept-Profile');
    dkdHeaders.delete('Content-Profile');

    return dkdV321NativeFetch(dkdInput, {
      ...dkdInit,
      headers: dkdHeaders,
      cache: 'no-store',
    });
  };
}

await import(`./v3.1.1.data.js?v=${DKD_V321_VERSION}`);

if (!window.dkdV31Data) throw new Error('DraBornGate v3.2.1 veri katmanı başlatılamadı.');
window.dkdV31Data.version = DKD_V321_VERSION;
window.dkdV31Data.rpcSchema = 'public';
