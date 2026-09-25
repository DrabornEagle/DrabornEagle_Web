const dkd_headers_value = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,x-signature-sha256',
};

function dkd_reply_value(dkd_body_value: Record<string, unknown>, dkd_status_value = 200) {
  return new Response(JSON.stringify(dkd_body_value), { status: dkd_status_value, headers: dkd_headers_value });
}

Deno.serve(async (dkd_request_value: Request) => {
  if (dkd_request_value.method === 'OPTIONS') return new Response('ok', { headers: dkd_headers_value });
  if (dkd_request_value.method === 'GET') return dkd_reply_value({ ok: true, service: 'dkd-bmc-webhook', version: '1.0.0' });
  if (dkd_request_value.method !== 'POST') return dkd_reply_value({ ok: false, reason: 'method_not_allowed' }, 405);

  const dkd_raw_body_value = await dkd_request_value.text();
  const dkd_signature_value = dkd_request_value.headers.get('x-signature-sha256') || '';
  const dkd_supabase_url_value = Deno.env.get('SUPABASE_URL') || '';
  const dkd_anon_key_value = Deno.env.get('SUPABASE_ANON_KEY') || '';

  if (!dkd_supabase_url_value || !dkd_anon_key_value) return dkd_reply_value({ ok: false, reason: 'edge_env_missing' }, 503);

  const dkd_rpc_response_value = await fetch(`${dkd_supabase_url_value}/rest/v1/rpc/dkd_bmc_ingest`, {
    method: 'POST',
    headers: {
      apikey: dkd_anon_key_value,
      authorization: `Bearer ${dkd_anon_key_value}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ dkd_raw_body_value, dkd_signature_value }),
  });

  const dkd_rpc_payload_value = await dkd_rpc_response_value.json().catch(() => ({ ok: false, status: 500, reason: 'rpc_invalid_response' }));
  const dkd_status_value = Number(dkd_rpc_payload_value?.status || (dkd_rpc_response_value.ok ? 200 : 500));
  return dkd_reply_value(dkd_rpc_payload_value, Number.isFinite(dkd_status_value) ? dkd_status_value : 500);
});
