const DKD_V324_DATA_VERSION = '3.2.4';
const DKD_V324_RPC_PATTERN = /\/rest\/v1\/rpc\/dkd_gate_[a-z0-9_]+(?:\?|$)/i;

if (!window.__DKD_GATE_V324_PUBLIC_RPC_FETCH__) {
  const dkdV324NativeFetch = window.fetch.bind(window);
  window.__DKD_GATE_V324_PUBLIC_RPC_FETCH__ = dkdV324NativeFetch;

  window.fetch = function dkdV324PublicRpcFetch(dkdInput, dkdInit = {}) {
    const dkdUrl = typeof dkdInput === 'string' || dkdInput instanceof URL
      ? String(dkdInput)
      : String(dkdInput?.url || '');

    if (!DKD_V324_RPC_PATTERN.test(dkdUrl)) return dkdV324NativeFetch(dkdInput, dkdInit);

    const dkdHeaders = new Headers(dkdInput instanceof Request ? dkdInput.headers : undefined);
    const dkdOverrideHeaders = new Headers(dkdInit?.headers || undefined);
    dkdOverrideHeaders.forEach((dkdValue, dkdKey) => dkdHeaders.set(dkdKey, dkdValue));
    dkdHeaders.delete('Accept-Profile');
    dkdHeaders.delete('Content-Profile');

    return dkdV324NativeFetch(dkdInput, {
      ...dkdInit,
      headers: dkdHeaders,
      cache: 'no-store',
    });
  };
}

await import(`./v3.1.1.data.js?v=${DKD_V324_DATA_VERSION}-session-refresh-lock`);

if (!window.dkdV31Data) throw new Error('DraBornGate v3.2.4 veri katmanı başlatılamadı.');
window.dkdV31Data.version = DKD_V324_DATA_VERSION;
window.dkdV31Data.rpcSchema = 'public';
window.dkdV31Data.refreshLock = true;
