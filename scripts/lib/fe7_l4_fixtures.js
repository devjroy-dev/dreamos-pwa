'use strict';
// scripts/lib/fe7_l4_fixtures.js · TDW CE-47 · L4 (FE-7): the answers the L4 benches' pages read, in the doors' own
// shapes. Names are invented; photographs are the repo's own examples (public/examples/ads, R-46.16). A scenario S
// picks the state: { introEmpty, wpEmpty, xc: 'sender'|'creator', grEmpty, ob, obDone }.
const PIC = (n) => `/examples/ads/${n}.jpg`;
const now = Date.now(); const ago = (d) => new Date(now - d * 864e5).toISOString();

const INTROS = [
  { id: 'in-1', recipient_name: 'Anita Verma', recipient_phone_last4: '4417', where_met: 'the Verma wedding', status: 'sent', chip: 'read', created_at: '2026-09-08T06:00:00Z', sent_at: '2026-09-08T06:00:00Z' },
  { id: 'in-2', recipient_name: 'Kabir Malhotra', recipient_phone_last4: '2210', where_met: 'the Bridal Asia show', status: 'sent', chip: 'sent_no_receipt', created_at: '2026-09-21T06:00:00Z', sent_at: '2026-09-21T06:00:00Z' },
  { id: 'in-3', recipient_name: null, recipient_phone_last4: '9031', where_met: 'a recce at ITC Grand', status: 'failed', chip: 'not_delivered', created_at: '2026-09-27T06:00:00Z', sent_at: '2026-09-27T06:00:00Z' },
];
const W = (id, title, venue, city, vis, consent, delivered) => ({ id, slug: id, title, venue, city, delivered_at: delivered, couple_consent: consent, visibility: vis, couple_id: null });
const WEDDINGS = [
  W('wp-1', 'Meera and Kunal', 'ITC Grand Bharat', 'Delhi NCR', 'published', true, '2026-09-02'),
  W('wp-2', 'Aanya and Rohan', 'The Leela Palace', 'Udaipur', 'published', false, '2026-09-20'),
  W('wp-3', 'Riya and Dev', 'Taj Mahal Palace', 'Mumbai', 'draft', false, null),
];
const CREDITS = [
  { id: 'c1', role: 'shot_by', name: 'Studio Lumen', phone: null, status: 'claimed', claim_url: '' },
  { id: 'c2', role: 'makeup', name: 'Kavya Rao', phone: null, status: 'claimed', claim_url: '' },
  { id: 'c3', role: 'decor', name: 'Petal and Brass', phone: null, status: 'invited', claim_url: '' },
  { id: 'c4', role: 'venue', name: 'ITC Grand Bharat', phone: null, status: 'declined', claim_url: '' },
];
const PHOTOS = ['example-couple', 'example-portrait', 'example-hands', 'example-bouquet', 'example-couple-2'].map((n, i) => ({ id: 'ph' + i, url: PIC(n), position: i }));
const INF = [
  { id: 'inf-1', business_name: 'Aanya Mehra', city: 'Delhi NCR', handle: '@aanya.mehra', reach: { follower_count: 24600, engagement_pct: 4.1, verified: true, cities: [{ city: 'Delhi NCR', pct: 62 }, { city: 'Chandigarh', pct: 11 }, { city: 'Jaipur', pct: 8 }], age: [{ band: '18\u201324', pct: 31 }, { band: '25\u201334', pct: 49 }, { band: '35\u201344', pct: 14 }], gender: [{ k: 'Women', pct: 84 }, { k: 'Men', pct: 16 }] } },
  { id: 'inf-2', business_name: 'Ritika Sen', city: 'Delhi NCR', handle: '@ritika.frames', reach: { follower_count: 11200, engagement_pct: 5.3, verified: false, cities: [{ city: 'Delhi NCR', pct: 48 }, { city: 'Lucknow', pct: 17 }], age: [{ band: '18\u201324', pct: 44 }, { band: '25\u201334', pct: 41 }], gender: [{ k: 'Women', pct: 71 }, { k: 'Men', pct: 29 }] } },
  { id: 'inf-3', business_name: 'Meher Joshi', city: 'Delhi NCR', handle: '@meher.joshi', reach: { follower_count: 38900, engagement_pct: 3.2, verified: true, cities: [{ city: 'Delhi NCR', pct: 21 }, { city: 'Jaipur', pct: 46 }], age: [{ band: '25\u201334', pct: 52 }], gender: [{ k: 'Women', pct: 88 }, { k: 'Men', pct: 12 }] } },
];
const REQ = [
  { id: 'rq-1', counterpart_name: 'Aanya Mehra', offer_kind: 'makeup', offer_note: 'Bridal look for one styled shoot, trial included.', ask_kind: 'reel', ask_count: 2, date_from: '2026-10-18', date_to: '2026-11-18', state: 'sent' },
  { id: 'rq-2', counterpart_name: 'Ritika Sen', offer_kind: 'makeup', offer_note: '', ask_kind: 'post', ask_count: 1, date_from: '2026-11-02', date_to: '2026-11-30', state: 'accepted' },
  { id: 'rq-3', counterpart_name: 'Meher Joshi', offer_kind: 'makeup', offer_note: '', ask_kind: 'story', ask_count: 3, date_from: '2026-09-04', date_to: '2026-09-20', state: 'declined' },
];
const INBOX = [
  { id: 'ib-1', counterpart_name: 'Studio Lumen', offer_kind: 'photographer', offer_note: 'A portrait session at your chosen location, 30 edited photos.', ask_kind: 'reel', ask_count: 1, date_from: '2026-10-10', date_to: '2026-10-31', state: 'sent' },
  { id: 'ib-2', counterpart_name: 'Petal and Brass', offer_kind: 'decorator', offer_note: '', ask_kind: 'post', ask_count: 2, date_from: '2026-11-01', date_to: '2026-11-15', state: 'accepted' },
];
// The signed-in vendor, as b123's fixture table answers it (scripts/lib/b123_fixtures.mjs ME), read at load so the
// two tables cannot drift; Onboarding's scenario (S.ob) overrides it below with an unfinished vendor.
let ME = null; let B123 = null;
function me() { return ME; }
/** b123's table, loaded once: its ME, and its answer for every route this table does not name (as the harness does). */
async function loadMe() { if (!B123) { B123 = await import('./b123_fixtures.mjs'); ME = B123.ME; } return ME; }
function fallback(route) { return B123 ? B123.answer(route) : undefined; }
function answer(route, S = {}) {
  const V0 = '00000000-0000-0000-0000-000000000000';
  // ── L4b · TDS, Books, Payment reminders (the doors' own shapes; invented names) ──
  if (route === `/api/v2/vendor/money/books/${V0}`) return { ok: true, received: 410000, outstanding: 340000, opening: 0, closing: 382000, total: 3, movements: S.booksEmpty ? [] : [
    { date: '2026-09-05', undated: false, credit: 100000, debit: null, particular: { client_name: 'Aanya Kapoor', invoice_number: 'INV-0012' }, balance: 100000 },
    { date: '2026-09-12', undated: false, credit: null, debit: 18000, particular: { category: 'equipment', description: 'Drone rental' }, balance: 82000 },
    { date: '2026-09-28', undated: false, credit: 190000, debit: null, particular: { client_name: 'Meera Sharma and Kunal Mehta-Oberoi', invoice_number: 'INV-0015' }, balance: 272000 }] };
  if (route === '/api/v2/vendor/reminders') return { ok: true, sent_count: 1, auto_send: true, window_days: 3, sending: { open: true, approved: true },
    due: [{ milestone_id: 'm1', invoice_id: 'i1', client: 'Meera Sharma and Kunal Mehta-Oberoi', milestone: 'Second instalment', amount_due: 152000, due_date: '2027-01-14' },
          { milestone_id: 'm2', invoice_id: 'i2', client: 'Aanya Kapoor', milestone: 'Balance', amount_due: 75000, due_date: '2026-10-03' }],
    asked: [{ id: 'a1', client: 'Meera Sharma and Kunal Mehta-Oberoi', milestone: 'Advance', amount_due: 76000, due_date: '2026-09-20', sent: true, source: 'vendor_tap', asked_at: '2026-09-17T06:00:00Z' },
            { id: 'a2', client: 'Riya Singh', milestone: 'Advance', amount_due: 40000, due_date: '2026-10-10', sent: false, source: 'nightly', asked_at: '2026-09-29T06:00:00Z' }] };
  if (route === `/api/v2/vendor/tds/${V0}`) return { ok: true, entries: S.tdsEmpty ? [] : [
    { id: 'td-1', vendor_id: V0, invoice_id: null, client_id: null, client_name: 'Hotel Leela, Gurugram', client_pan: 'AABCH1234X', client_tan: 'DELH01234C', gross_amount: 100000, tds_rate: 10, tds_amount: 10000, net_received: 90000, section: '194J', deduction_date: '2026-09-14', financial_year: 'FY2026-27', certificate_no: null, notes: null, created_at: '2026-09-14T06:00:00Z', updated_at: '2026-09-14T06:00:00Z' },
    { id: 'td-2', vendor_id: V0, invoice_id: null, client_id: null, client_name: 'Kapoor Events and Hospitality Private Limited', client_pan: null, client_tan: null, gross_amount: 50000, tds_rate: 10, tds_amount: 5000, net_received: 45000, section: '194C', deduction_date: '2026-08-03', financial_year: 'FY2026-27', certificate_no: 'CERT-0042', notes: null, created_at: '2026-08-03T06:00:00Z', updated_at: '2026-08-03T06:00:00Z' }] };
  if (route === `/api/v2/vendor/tds/${V0}/summary`) return S.tdsEmpty ? { ok: true, financial_year: 'FY2026-27', total_gross: 0, total_tds: 0, total_net: 0, entry_count: 0, by_section: [] }
    : { ok: true, financial_year: 'FY2026-27', total_gross: 150000, total_tds: 15000, total_net: 135000, entry_count: 2, by_section: [{ section: '194J', gross: 100000, tds: 10000, count: 1 }, { section: '194C', gross: 50000, tds: 5000, count: 1 }] };
  if (route === '/api/v2/vendor/collab/feed') return { ok: true, feed: [] };
  if (route === '/api/v2/vendor/collab/my-posts') return { ok: true, posts: [] };
  if (route === '/api/v2/vendor/referrals') return { ok: true, sent_count: 5, received_count: 3, peers: [
    { vendor_id: 'v1', name: 'Studio Lumen', category: 'Photographer', sent: 3, received: 1, last_at: '2026-09-20T06:00:00Z' },
    { vendor_id: 'v2', name: 'Petal and Brass', category: 'Decorator', sent: 2, received: 1, last_at: '2026-09-12T06:00:00Z' },
    { vendor_id: 'v3', name: 'Mehendi by Sana', category: 'Mehendi artist', sent: 0, received: 1, last_at: '2026-08-30T06:00:00Z' }] };
  if (route === '/api/v2/vendor/notes') return { ok: true, notes: [
    { id: 'n1', body: 'Call Meera about the album cover before Friday.', binder_id: null, created_at: '2026-09-28T06:00:00Z' },
    { id: 'n2', body: 'Aanya wants the Sangeet first. Two days, Jaipur. Send the full wedding package with a second shooter.', binder_id: null, created_at: '2026-09-24T06:00:00Z' },
    { id: 'n3', body: 'Order new diffusers for the lighting kit.', binder_id: null, created_at: '2026-09-11T06:00:00Z' }] };
  if (route === '/api/v2/vendor/me' && !S.ob) return me() || undefined;
  if (route === '/api/v2/vendor/me' && S.ob) return { ok: true, vendor: { id: '00000000-0000-0000-0000-000000000000', name: 'Kavya Rao', business_name: '', category: '', city: '', instagram_handle: '', onboarding: { complete: false, missing: ['business_name', 'category', 'city', 'starting_price', 'service_area'] } } };
  if (route === '/api/v2/vendor/solutions/google-reviews') return { ok: true, googleReviews: S.grEmpty
    ? { asked: [], askedCount: 0, landedCount: 0, seal: null, gbpAvailableFrom: '2026-10-27', sendEnabled: true }
    : { asked: [{ coupleName: 'Meera and Kunal', weddingTitle: 'Meera and Kunal', askedAt: '2026-09-03T06:00:00Z' }, { coupleName: 'Priya and Arjun', weddingTitle: 'Priya and Arjun', askedAt: '2026-08-14T06:00:00Z' }],
        askedCount: 2, landedCount: 0, seal: { weddings: 4, deliveryDays: 21 }, gbpAvailableFrom: '2026-10-27', sendEnabled: true } };
  if (route === '/api/v2/vendor/solutions/instagram') return { ok: true, state: S.ig || 'not_connected', authorize_url: null };
  if (route === '/api/v2/vendor/solutions/quiet') return { ok: true, minutes: 120 };
  if (route === '/api/v2/vendor/introductions') return { ok: true, introductions: S.introEmpty ? [] : INTROS };
  if (route === '/api/v2/vendor/studio/weddings') return { ok: true, weddings: S.wpEmpty ? [] : WEDDINGS, reel: { reel_enabled: false } };
  const wm = route.match(/^\/api\/v2\/vendor\/studio\/weddings\/(wp-\d)$/);
  if (wm) { const w = WEDDINGS.find((x) => x.id === wm[1]); return { ok: true, wedding: w, credits: w.id === 'wp-3' ? CREDITS.slice(0, 2) : CREDITS, photos: w.id === 'wp-3' ? PHOTOS.slice(0, 3) : PHOTOS }; }
  if (route === '/api/v2/vendor/exchange') return { ok: true, role: S.xc || 'sender', opted_in: true };
  if (route === '/api/v2/vendor/exchange/creators') return { ok: true, creators: INF };
  if (route === '/api/v2/vendor/exchange/requests') return { ok: true, requests: REQ };
  if (route === '/api/v2/vendor/exchange/inbox') return { ok: true, requests: INBOX };
  return undefined;
}
function post(route, S = {}) {
  if (route === '/api/v2/vendor/onboarding') return S.obDone
    ? { ok: true, tdw_link: 'https://thedreamwedding.in/v/kavyarao' }
    : { ok: false, missing: ['business_name', 'category', 'city', 'starting_price', 'service_area'], allowed: ['photographer', 'makeup', 'decorator', 'mehendi', 'designer', 'planner'] };
  if (route === '/api/v2/vendor/introductions') return { ok: true, id: 'in-9', recipient_name: 'Anita Verma', page_url: 'https://thedreamwedding.in/v/kavyarao',
    body_filled: 'Hi Anita Verma, this is Kavya Rao Makeup, and we met at the Verma wedding \u2014 I wanted to send you my work, so here is my page with recent weddings and my open dates. Reply STOP and I will not message you again.' };
  return undefined;
}
function answerOrFallback(route, S = {}) { const a = answer(route, S); return a === undefined ? fallback(route) : a; }
module.exports = { answer: answerOrFallback, post, loadMe };
