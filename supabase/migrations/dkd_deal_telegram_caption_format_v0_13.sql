-- DraBornDeal / Firsat Radari v0.13
-- Standard Telegram caption format for admin, worker and draft flows.

create or replace function public.dkd_deal_currency_label_v0_13(dkd_currency_code text)
returns text
language sql
immutable
as $$
  select case
    when dkd_currency_code is null or trim(dkd_currency_code) = '' or upper(trim(dkd_currency_code)) = 'TRY' then 'TL'
    else upper(trim(dkd_currency_code))
  end;
$$;

create or replace function public.dkd_deal_share_caption(
  dkd_product_name text,
  dkd_currency_code text,
  dkd_current_price numeric,
  dkd_original_price numeric,
  dkd_discount_percent numeric,
  dkd_rating numeric,
  dkd_review_count integer,
  dkd_product_url text
)
returns text
language plpgsql
immutable
as $$
declare
  dkd_caption text;
  dkd_currency_label text;
  dkd_current_price_text text;
  dkd_original_price_text text;
  dkd_discount_value numeric;
begin
  dkd_currency_label := public.dkd_deal_currency_label_v0_13(dkd_currency_code);

  dkd_current_price_text := case
    when dkd_current_price is null then 'Fiyat bilgisi güncelleniyor'
    else trim(to_char(dkd_current_price, 'FM999G999G999G990D00')) || ' ' || dkd_currency_label
  end;

  dkd_original_price_text := case
    when dkd_original_price is null then null
    else trim(to_char(dkd_original_price, 'FM999G999G999G990D00')) || ' ' || dkd_currency_label
  end;

  dkd_discount_value := case
    when dkd_discount_percent is not null then dkd_discount_percent
    when dkd_original_price is not null and dkd_current_price is not null and dkd_original_price > dkd_current_price
      then round(((dkd_original_price - dkd_current_price) / dkd_original_price) * 100, 2)
    else null
  end;

  dkd_caption := '🔥 Fırsat Radarı' || E'\n\n'
    || coalesce(dkd_product_name, 'Ürün') || E'\n\n'
    || '💰 Yeni Fiyat: ' || dkd_current_price_text
    || case when dkd_original_price_text is not null then E'\n🏷️ Önceki Fiyat: ' || dkd_original_price_text else '' end
    || case when dkd_discount_value is not null then E'\n📉 İndirim: %' || trim(to_char(dkd_discount_value, 'FM990D00')) else '' end
    || case when dkd_rating is not null then E'\n⭐ Puan: ' || trim(to_char(dkd_rating, 'FM990D00')) else '' end
    || case when dkd_review_count is not null then E'\n💬 Yorum: ' || dkd_review_count::text else '' end
    || E'\n\n🔗 Link:\n' || coalesce(dkd_product_url, '')
    || E'\n\n#fırsat #indirim #DraBornDeal';

  return dkd_caption;
end;
$$;

grant execute on function public.dkd_deal_currency_label_v0_13(text) to anon, authenticated, service_role;
grant execute on function public.dkd_deal_share_caption(text, text, numeric, numeric, numeric, numeric, integer, text) to service_role;

insert into public.dkd_deal_system_settings (dkd_setting_key, dkd_setting_value, dkd_description) values
  ('dkd_deal_telegram_caption_format_version', '{"version":"0.13","currency":"TRY_to_TL","fields":["new_price","old_price","discount","rating","review","link"],"empty_fields":"hidden"}'::jsonb, 'Standard Telegram caption format for DraBornDeal.')
on conflict (dkd_setting_key) do update set
  dkd_setting_value = excluded.dkd_setting_value,
  dkd_description = excluded.dkd_description,
  dkd_updated_at = now();
