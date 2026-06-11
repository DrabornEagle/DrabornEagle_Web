-- DraBornDeal v0.3.1 manual watch-link test helper
-- Replace the sample URL with a real product URL when you want a live parser test.
-- Safe default: this only inserts a pending watch link. It does not fetch anything by itself.

insert into public.dkd_deal_watch_links (
  dkd_submitted_url,
  dkd_status,
  dkd_priority,
  dkd_note
) values (
  'https://www.trendyol.com/dkd-test/dkd-manual-watch-link-p-000000000',
  'pending',
  10,
  'dkd_v0_3_1 dry-run source detection test placeholder. Replace with a real product URL for live parser test.'
);

select
  dkd_id,
  dkd_submitted_url,
  dkd_status,
  dkd_priority,
  dkd_note,
  dkd_created_at
from public.dkd_deal_watch_links
order by dkd_created_at desc
limit 5;
