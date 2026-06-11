import { dkdAdminDirectShare } from './dkd_admin_direct_share.js';

function dkdIsShortProductUrl(dkdUrl) {
  try {
    const dkdHost = new URL(dkdUrl).hostname.toLowerCase();
    return dkdHost === 'ty.gl' || dkdHost.endsWith('.ty.gl');
  } catch {
    return false;
  }
}

export async function dkdAdminDirectShareFullUrlOnly(dkdSupabase, dkdBotToken, dkdUrl) {
  if (dkdIsShortProductUrl(dkdUrl)) {
    throw new Error('Kısa bağlantı desteklenmiyor. Lütfen ürünün tam Trendyol veya Hepsiburada bağlantısını yapıştır.');
  }
  return dkdAdminDirectShare(dkdSupabase, dkdBotToken, dkdUrl);
}
