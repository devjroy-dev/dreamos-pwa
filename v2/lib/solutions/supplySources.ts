// v2/lib/solutions/supplySources.ts · CE-47 · PRO · P1 · WHERE TO BUY: only programmes checked on their own pages (PRO
// step 2, chair-accepted 4 Oct 2026). Held, not listed: M·A·C Pro India, Nikon NPS India, METRO (no India page of their
// own reached). Every link plain, http(s), opened in a new tab; none pays TDW (zero kickback). Re-check each quarter.
export type Trade = 'makeup' | 'photo' | 'other';
export type Source = { key: string; from: string; name: string; fee: string; checked: string; url: string; what: string; group: 'prices' | 'repairs';
  joinWithCertificate?: boolean; gstinCard?: boolean; requirement?: boolean; trades: Trade[] };
export const SOURCES: readonly Source[] = [
  { key: 'nykaa_pro', from: 'Nykaa', name: 'Nykaa PRO', fee: 'Free to join', checked: '4 October 2026', url: 'https://www.nykaa.com/pro-intro', group: 'prices', trades: ['makeup'],
    what: 'Nykaa PRO sells makeup and hair products at professional prices to working artists.', joinWithCertificate: true },
  { key: 'amazon_business', from: 'Amazon', name: 'Amazon Business', fee: 'Free to join', checked: '4 October 2026', url: 'https://business.amazon.in', group: 'prices', trades: ['makeup', 'photo', 'other'],
    what: 'Amazon Business gives business prices and GST bills on most products.', gstinCard: true },
  { key: 'indiamart', from: 'IndiaMART', name: 'IndiaMART', fee: 'Free for buyers', checked: '4 October 2026', url: 'https://www.indiamart.com', group: 'prices', trades: ['makeup', 'photo', 'other'],
    what: 'IndiaMART lets you ask wholesalers for quotes when you buy in bulk.', requirement: true },
  { key: 'canon_cps', from: 'Canon', name: 'Canon Professional Services', fee: 'Free to join', checked: '4 October 2026', url: 'https://cps.asia.canon/india/en', group: 'repairs', trades: ['photo'],
    what: 'Canon Professional Services gives priority repairs, a backup camera while yours is repaired and lower labour charges. It does not give lower prices.', joinWithCertificate: true },
  { key: 'sony_pro', from: 'Sony', name: 'Sony Imaging PRO Support', fee: 'Free to join', checked: '4 October 2026', url: 'https://www.alphacommunity.in/pro-support', group: 'repairs', trades: ['photo'],
    what: 'Sony Imaging PRO Support gives service support to professionals who live and work in India. Sony decides who joins.', joinWithCertificate: true },
];
/** Her trade from the trade word the papers door gives ("Makeup artist", "Photographer", ...). */
export function tradeOf(word: string | null | undefined): Trade {
  const w = String(word || '').toLowerCase();
  if (/makeup|hair|mua|beaut/.test(w)) return 'makeup';
  if (/photo|film|video|cinemat/.test(w)) return 'photo';
  return 'other';
}
export const sourcesFor = (t: Trade) => SOURCES.filter((s) => s.trades.includes(t));
export const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : '#');
