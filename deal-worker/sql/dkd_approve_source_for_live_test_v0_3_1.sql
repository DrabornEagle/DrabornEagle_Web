-- DraBornDeal v0.3.1 live parser approval helper
-- Use only for a source you reviewed manually.
-- This opens the manual watch-link parser gate for one source.

-- Example: approve Trendyol after manual terms/robots review.
update public.dkd_deal_sources
set
  dkd_allowed_by_terms = true,
  dkd_needs_manual_review = false,
  dkd_updated_at = now()
where dkd_source_key = 'trendyol'
  and dkd_country_code = 'TR';

select
  dkd_source_key,
  dkd_source_name,
  dkd_country_code,
  dkd_allowed_by_terms,
  dkd_needs_manual_review,
  dkd_updated_at
from public.dkd_deal_sources
where dkd_source_key = 'trendyol'
  and dkd_country_code = 'TR';
