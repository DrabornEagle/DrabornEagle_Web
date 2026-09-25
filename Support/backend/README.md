# DraBornEagle Support backend

Buy Me a Coffee webhook entegrasyonu Supabase Edge Function + PostgreSQL RPC ile çalışır.

## Production endpoint

`https://guuwomvszlwhkmstewfl.supabase.co/functions/v1/dkd-bmc-webhook`

## Akış

1. Buy Me a Coffee tüm seçili olayları production endpoint'e POST eder.
2. Edge Function ham request body ve `x-signature-sha256` başlığını değiştirmeden `dkd_bmc_ingest` RPC'sine iletir.
3. RPC, signing secret'ı public istemciye açılmayan `dkd_internal_webhook_config` tablosundan okur ve HMAC-SHA256 doğrulaması yapar.
4. Doğrulanmış olaylar `dkd_bmc_events` tablosuna idempotent olarak kaydedilir.
5. `/Support/` sayfası yalnızca anonimleştirilmiş ve güvenli alanları `dkd_bmc_public_dashboard` RPC'sinden okur.

## Desteklenen Buy Me a Coffee event'leri

- donation.created / donation.refunded
- extra_purchase.created / updated / refunded
- commission_order.created / refunded
- wishlist_payment.created / refunded
- membership.started / updated / cancelled / paused
- recurring_donation.started / updated / cancelled

Signing secret hiçbir zaman GitHub repository'sine veya tarayıcı koduna yazılmaz.
