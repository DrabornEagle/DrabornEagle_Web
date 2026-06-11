import type { DkdWorkerConfig } from './dkd_config.js';
import { dkdLog } from './dkd_logger.js';
import { dkdFetchAndParseProduct } from './dkd_product_parser.js';
import { dkdDetectSourceKey, dkdNormalizeUrl } from './dkd_source_detect.js';
import type { DkdSupabase } from './dkd_supabase.js';

type DkdWatchLink = {
  dkd_id: string;
  dkd_submitted_url: string;
  dkd_status: string;
  dkd_priority: number;
};

type DkdSource = {
  dkd_id: string;
  dkd_source_key: string;
  dkd_country_code: string;
  dkd_allowed_by_terms: boolean;
  dkd_needs_manual_review: boolean;
};

export async function dkdProcessWatchLinks(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig): Promise<void> {
  const { data: dkdLinks, error: dkdError } = await dkdSupabase
    .from('dkd_deal_watch_links')
    .select('dkd_id, dkd_submitted_url, dkd_status, dkd_priority')
    .eq('dkd_status', 'pending')
    .order('dkd_priority', { ascending: true })
    .order('dkd_created_at', { ascending: true })
    .limit(dkdConfig.dkdWorkerJobLimit);

  if (dkdError) throw dkdError;
  const dkdRows = (dkdLinks || []) as DkdWatchLink[];
  dkdLog('info', 'dkd_watch_links_loaded', { dkd_count: dkdRows.length });

  for (const dkdLink of dkdRows) {
    try {
      await dkdProcessSingleWatchLink(dkdSupabase, dkdConfig, dkdLink);
    } catch (dkdError) {
      const dkdMessage = dkdError instanceof Error ? dkdError.message : JSON.stringify(dkdError);
      await dkdUpdateWatchLink(dkdSupabase, dkdLink.dkd_id, 'paused', `Parser failed without crashing worker: ${dkdMessage}`);
      dkdLog('error', 'dkd_watch_link_parser_failed', {
        dkd_watch_link_id: dkdLink.dkd_id,
        dkd_error_message: dkdMessage
      });
    }
  }
}

async function dkdProcessSingleWatchLink(dkdSupabase: DkdSupabase, dkdConfig: DkdWorkerConfig, dkdLink: DkdWatchLink): Promise<void> {
  let dkdNormalizedUrl: string;
  try {
    dkdNormalizedUrl = dkdNormalizeUrl(dkdLink.dkd_submitted_url);
  } catch {
    await dkdUpdateWatchLink(dkdSupabase, dkdLink.dkd_id, 'rejected', 'Invalid URL.');
    return;
  }

  const dkdDetectedSourceKey = dkdDetectSourceKey(dkdNormalizedUrl);
  dkdLog('info', 'dkd_watch_link_seen', {
    dkd_watch_link_id: dkdLink.dkd_id,
    dkd_detected_source_key: dkdDetectedSourceKey,
    dkd_url: dkdNormalizedUrl
  });

  if (!dkdDetectedSourceKey) {
    if (!dkdConfig.dkdWorkerDryRun) await dkdUpdateWatchLink(dkdSupabase, dkdLink.dkd_id, 'rejected', 'Unsupported source URL.');
    return;
  }

  const dkdSource = await dkdLoadSource(dkdSupabase, dkdDetectedSourceKey, dkdConfig.dkdWorkerCountry);
  if (!dkdSource) {
    if (!dkdConfig.dkdWorkerDryRun) await dkdUpdateWatchLink(dkdSupabase, dkdLink.dkd_id, 'rejected', 'Source not found in dkd_deal_sources.');
    return;
  }

  if (dkdConfig.dkdWorkerDryRun) {
    dkdLog('info', 'dkd_watch_link_dry_run_ready', {
      dkd_watch_link_id: dkdLink.dkd_id,
      dkd_source_key: dkdSource.dkd_source_key,
      dkd_allowed_by_terms: dkdSource.dkd_allowed_by_terms,
      dkd_needs_manual_review: dkdSource.dkd_needs_manual_review
    });
    return;
  }

  if (!dkdSource.dkd_allowed_by_terms || dkdSource.dkd_needs_manual_review) {
    await dkdUpdateWatchLink(
      dkdSupabase,
      dkdLink.dkd_id,
      'paused',
      'Source requires manual terms/robots review before product fetch.'
    );
    return;
  }

  await dkdUpdateWatchLink(dkdSupabase, dkdLink.dkd_id, 'accepted', `Accepted by ${dkdConfig.dkdWorkerKey}; parsing started.`);

  const dkdParsedProduct = await dkdFetchAndParseProduct(dkdNormalizedUrl);
  if (!dkdParsedProduct.dkdProductName) {
    await dkdUpdateWatchLink(dkdSupabase, dkdLink.dkd_id, 'rejected', 'Parser could not find product name.');
    return;
  }

  const dkdProductPayload = {
    dkd_source_id: dkdSource.dkd_id,
    dkd_country_code: dkdSource.dkd_country_code,
    dkd_product_name: dkdParsedProduct.dkdProductName,
    dkd_brand_name: dkdParsedProduct.dkdBrandName,
    dkd_product_url: dkdNormalizedUrl,
    dkd_canonical_url: dkdNormalizedUrl,
    dkd_image_url: dkdParsedProduct.dkdImageUrl,
    dkd_currency_code: dkdParsedProduct.dkdCurrencyCode || 'TRY',
    dkd_current_price: dkdParsedProduct.dkdCurrentPrice,
    dkd_original_price: dkdParsedProduct.dkdOriginalPrice,
    dkd_stock_status: dkdParsedProduct.dkdStockStatus,
    dkd_rating: dkdParsedProduct.dkdRating,
    dkd_review_count: dkdParsedProduct.dkdReviewCount,
    dkd_last_seen_at: new Date().toISOString(),
    dkd_raw_last_payload: dkdParsedProduct.dkdRawPayload
  };

  const { data: dkdUpsertedProduct, error: dkdProductError } = await dkdSupabase
    .from('dkd_deal_products')
    .upsert(dkdProductPayload, { onConflict: 'dkd_source_id,dkd_product_url' })
    .select('dkd_id')
    .single();

  if (dkdProductError) throw dkdProductError;
  const dkdProductId = (dkdUpsertedProduct as { dkd_id: string }).dkd_id;

  const { error: dkdSnapshotError } = await dkdSupabase
    .from('dkd_deal_product_snapshots')
    .insert({
      dkd_product_id: dkdProductId,
      dkd_source_id: dkdSource.dkd_id,
      dkd_currency_code: dkdParsedProduct.dkdCurrencyCode || 'TRY',
      dkd_current_price: dkdParsedProduct.dkdCurrentPrice,
      dkd_original_price: dkdParsedProduct.dkdOriginalPrice,
      dkd_stock_status: dkdParsedProduct.dkdStockStatus,
      dkd_rating: dkdParsedProduct.dkdRating,
      dkd_review_count: dkdParsedProduct.dkdReviewCount,
      dkd_raw_payload: dkdParsedProduct.dkdRawPayload
    });

  if (dkdSnapshotError) throw dkdSnapshotError;

  const { error: dkdLinkError } = await dkdSupabase
    .from('dkd_deal_watch_links')
    .update({
      dkd_status: 'mapped',
      dkd_source_id: dkdSource.dkd_id,
      dkd_product_id: dkdProductId,
      dkd_note: `Mapped by ${dkdConfig.dkdWorkerKey}.`,
      dkd_updated_at: new Date().toISOString()
    })
    .eq('dkd_id', dkdLink.dkd_id);

  if (dkdLinkError) throw dkdLinkError;

  dkdLog('info', 'dkd_watch_link_mapped', {
    dkd_watch_link_id: dkdLink.dkd_id,
    dkd_product_id: dkdProductId,
    dkd_source_key: dkdSource.dkd_source_key
  });
}

async function dkdLoadSource(dkdSupabase: DkdSupabase, dkdSourceKey: string, dkdCountryCode: string): Promise<DkdSource | null> {
  const { data: dkdSource, error: dkdError } = await dkdSupabase
    .from('dkd_deal_sources')
    .select('dkd_id, dkd_source_key, dkd_country_code, dkd_allowed_by_terms, dkd_needs_manual_review')
    .eq('dkd_source_key', dkdSourceKey)
    .eq('dkd_country_code', dkdCountryCode)
    .eq('dkd_is_active', true)
    .maybeSingle();

  if (dkdError) throw dkdError;
  return (dkdSource as DkdSource | null) || null;
}

async function dkdUpdateWatchLink(
  dkdSupabase: DkdSupabase,
  dkdWatchLinkId: string,
  dkdStatus: 'accepted' | 'rejected' | 'mapped' | 'paused',
  dkdNote: string
): Promise<void> {
  const { error: dkdError } = await dkdSupabase
    .from('dkd_deal_watch_links')
    .update({
      dkd_status: dkdStatus,
      dkd_note: dkdNote,
      dkd_updated_at: new Date().toISOString()
    })
    .eq('dkd_id', dkdWatchLinkId);

  if (dkdError) throw dkdError;
}
