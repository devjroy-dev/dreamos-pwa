// scripts/lib/b172_fixtures.mjs · CE-47 · WEB-6 · b172 · THE STAND-IN FOR WEB-4's DOORS (mock mode only).
// Shapes are dream-os a0bfe02's src/api/vendor/solutions/siteRoom.js, each answer { ok: true, ...payload }. The styles,
// palettes, pairs and FINISH ids are its registry (src/lib/site/styles.js) read as data. `changes`, `is_live` and
// `preview` (a token) are WEB-4 cut 5's draft fields as CE-47 named them; `opt.today` drops them to prove the room
// as main stands today. Invented: Studio Ivara, the counts, the looks, the words.
const CAN = {
  essential: { styles: 2, custom_palette: false, gradients: false, collections: false, journal: false, custom_sections: false, custom_pages: false, full_order: false, credit_removable: false, written_testimonials: true, video_testimonials: false, visitor_counts: true, visitor_sources: false, visitor_saves: false, own_domain: false, built_from_instagram: true },
  signature: { styles: 4, custom_palette: true, gradients: false, collections: true, journal: true, custom_sections: true, custom_pages: false, full_order: false, credit_removable: false, written_testimonials: true, video_testimonials: true, visitor_counts: true, visitor_sources: true, visitor_saves: false, own_domain: true, built_from_instagram: true },
  prestige: { styles: 6, custom_palette: true, gradients: true, collections: true, journal: true, custom_sections: true, custom_pages: true, full_order: true, credit_removable: true, written_testimonials: true, video_testimonials: true, visitor_counts: true, visitor_sources: true, visitor_saves: true, own_domain: true, built_from_instagram: true },
};
const STYLES = [
  ['couture', 'Couture', ['bodoni_inter_tight', 'cormorant_manrope', 'instrument_serif_sans'], [['couture.ink', 'Ivory and ink'], ['couture.emerald', 'Emerald'], ['couture.rose', 'Rosewood']]],
  ['noir', 'Noir', ['italiana_jost', 'bodoni_inter_tight', 'cormorant_manrope'], [['noir.gold', 'Black and gold'], ['noir.wine', 'Wine and rose gold'], ['noir.midnight', 'Midnight and champagne']]],
  ['heritage', 'Heritage', ['marcellus_mulish', 'cormorant_manrope', 'cormorant_figtree'], [['heritage.marigold', 'Marigold and vermilion'], ['heritage.peacock', 'Peacock and old gold'], ['heritage.rani', 'Rani pink and saffron']]],
  ['aurora', 'Aurora', ['fraunces_jakarta', 'instrument_serif_sans'], [['aurora.blush', 'Blush and peach'], ['aurora.lagoon', 'Mint and lilac'], ['aurora.dusk', 'Dusk (dark)']]],
  ['gallery', 'Gallery', ['instrument_serif_sans', 'bodoni_inter_tight', 'italiana_jost'], [['gallery.white', 'White wall'], ['gallery.grey', 'Gallery grey'], ['gallery.night', 'Night gallery (dark)']]],
  ['riviera', 'Riviera', ['gilda_figtree', 'cormorant_figtree', 'cormorant_manrope'], [['riviera.amalfi', 'Sand and sea'], ['riviera.goa', 'Coral and palm'], ['riviera.santorini', 'White and cobalt']]],
].map(([id, label, pairs, pals]) => ({ id, label, pairs, palettes: pals.map(([pid, pl]) => ({ id: pid, label: pl })) }));
const FIN = { couture: [['square'], ['solid_ink', 'outline'], ['clean']], noir: [['square'], ['gold_outline', 'gold_solid', 'hairline'], ['grain', 'clean']], heritage: [['arch'], ['vermilion_framed', 'outline'], ['paper', 'clean']], aurora: [['rounded'], ['glow', 'solid', 'glass'], ['clean']], gallery: [['square'], ['solid_ink', 'outline', 'text_link', 'round_arrow'], ['clean']], riviera: [['postcard'], ['solid', 'outline'], ['sunlight', 'clean']] };
const finish = () => Object.fromEntries(Object.entries(FIN).map(([s, [c, b, t]]) => [s, { corners: c, buttons: b, textures: t }]));
const KEYS = ['cover', 'looks', 'collections', 'band', 'reviews', 'pricing', 'studio', 'journal', 'faq', 'enquire'];
const sections = (plan) => KEYS.map((key) => ({ key, custom: false, allowed: plan === 'essential' ? !['collections', 'journal'].includes(key) : true, shown: key !== 'journal', variant: 'default', eyebrow: null, heading: null, body: {} }));
// WEB-8 (Basic's one free style, WEB-4 cut 16): Basic's flags, sections and clock are read from the server's own rules
// (../dream-os, beside this checkout, as the app's benches already read it); without it, the same answers written out.
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const SERVER = (() => { try { const p = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../dream-os/src/lib/site/siteModel.js'); return fs.existsSync(p) ? createRequire(import.meta.url)(p) : null; } catch { return null; } })();
const BASIC_CAN = SERVER ? SERVER.capabilitiesFor('basic') : { styles: 1, palettes: false, font_pairs: false, custom_palette: false, gradients: false, collections: false, journal: false, custom_sections: false, custom_pages: false, full_order: false, credit_removable: false, written_testimonials: false, video_testimonials: false, live_booking: false, own_voice: false, visitor_counts: false, visitor_sources: false, visitor_saves: false, own_domain: false, built_from_instagram: true,
  opens: { palettes: 'Essential', font_pairs: 'Essential', custom_palette: 'Signature', gradients: 'Prestige', collections: 'Signature', journal: 'Signature', custom_sections: 'Signature', custom_pages: 'Prestige', full_order: 'Prestige', credit_removable: 'Prestige', written_testimonials: 'Essential', video_testimonials: 'Signature', live_booking: 'Signature', own_voice: 'Prestige', visitor_counts: 'Essential', visitor_sources: 'Signature', visitor_saves: 'Prestige', own_domain: 'Signature', more_styles: 'Essential' } };
const BASIC_OPENS = { reviews: 'Essential', collections: 'Signature', journal: 'Signature' };
const basicSections = () => (SERVER ? SERVER.sectionsFor('basic', []) : KEYS.map((key) => ({ key, custom: false, allowed: !(key in BASIC_OPENS), shown: !(key in BASIC_OPENS), opens: BASIC_OPENS[key] || null })))
  .filter((s) => !s.custom).map((s) => ({ key: s.key, custom: false, allowed: s.allowed, shown: s.shown, opens: s.opens || null, variant: 'default', eyebrow: null, heading: null, body: {} }));
// her clock: 'free' (published, never changed), 'locked' (changed on 6 October 2026, next on 5 November)
const CHANGED = Date.parse('2026-10-06T05:00:00Z');
const basicClock = (state) => (SERVER ? SERVER.styleClock('basic', state === 'locked' ? { style_changed_at: new Date(CHANGED).toISOString() } : {}, CHANGED + 86400000)
  : state === 'locked' ? { last_changed_on: '2026-10-06', next_change_on: '2026-11-05', next_change_words: '5 November', locked: true } : { last_changed_on: null, next_change_on: null, next_change_words: null, locked: false });
export const BASIC_FROM_SERVER = !!SERVER;

// cut 5's changesOf: area is 'settings' | 'sections' | 'pages'; the lines are the server's words (SETTING_LINES, SECTION_LABELS)
const CHANGES = [{ area: 'settings', line: 'Colours changed' }, { area: 'settings', line: 'Styles you picked changed' }, { area: 'sections', line: 'Client reviews section changed' }];

export function room(plan, opt = {}) {
  if (plan === 'basic_classic') return { ok: true, room: { stored: {}, resolved: { v: 'classic', credit: true, can: { ...CAN.essential, styles: 0 }, site_name: 'Studio Ivara', monogram: 'SI', look: 'quiet', pages: ['home', 'contact'] }, styles: STYLES, finish: finish(), to_fix: { packages_below_starting_price: [] } } };
  // WEB-8 (cut 16): Basic has the room with one style, published; 'basic_locked' changed her style on 6 October
  if (plan === 'basic' || plan === 'basic_locked') return { ok: true, room: { stored: { style: 'aurora' },
    resolved: { v: 'styles', credit: true, can: BASIC_CAN, site_name: 'Studio Ivara', monogram: 'SI', style: 'aurora', styles_open: [],
      palette: { id: 'aurora.blush', custom: false, roles: { accent: '#f0a07c' }, extras: {}, moved: [] },
      font_pair: { id: 'fraunces_jakarta', display: 'Fraunces', text: 'Plus Jakarta Sans', offered: ['fraunces_jakarta'] },
      motion: 'lively', corners: 'rounded', buttons: 'glow_pill', texture: 'none', cover_mode: 'slideshow', sections: basicSections(), trade: { items: 'Looks', item: 'look', request: 'Request this look' } },
    styles: STYLES, finish: finish(), to_fix: { packages_below_starting_price: [] },
    changes: { count: 0, list: [], published_at: '2026-10-06T05:00:00Z' }, is_live: true, preview: { token: 'p'.repeat(32), expires_at: '2026-10-06T06:00:00Z' },
    style_clock: basicClock(plan === 'basic_locked' ? 'locked' : 'free') } };
  const fresh = plan === 'new'; const p = fresh ? 'signature' : plan;
  const open = p === 'prestige' ? ['couture', 'noir', 'heritage', 'aurora', 'gallery', 'riviera'] : p === 'signature' ? ['aurora', 'couture', 'gallery', 'riviera'] : ['aurora', 'couture'];
  const r = {
    stored: { style: 'aurora' },
    resolved: { v: 'styles', credit: true, can: CAN[p], site_name: 'Studio Ivara', monogram: 'SI', style: 'aurora', styles_open: open,
      palette: { id: 'aurora.dusk', custom: !!opt.custom, roles: { accent: opt.custom ? '#b4476d' : '#f0a07c' }, extras: {}, moved: opt.custom ? [{ role: 'accent', from: '#e7a3b8', to: '#b4476d', against: 'ground', target: 4.5, before: 3.1, after: 4.6 }] : [] },
      font_pair: { id: 'fraunces_jakarta', display: 'Fraunces', text: 'Plus Jakarta Sans', offered: ['fraunces_jakarta', 'instrument_serif_sans'] },
      motion: 'lively', corners: 'rounded', buttons: 'glow', texture: 'clean', cover_mode: 'slideshow', sections: sections(p), trade: { items: 'Looks', item: 'look', request: 'Request this look' } },
    styles: STYLES, finish: finish(),
    to_fix: { packages_below_starting_price: fresh ? [] : [{ id: 'k1', name: 'Engagement makeup', total: 15000 }] },
  };
  if (!opt.today) {
    r.preview = { token: `tok-${fresh ? 'textcover' : 'aurora'}`, expires_at: new Date(Date.now() + 30 * 60000).toISOString() };
    r.is_live = !fresh;
    r.changes = opt.published ? { count: 0, list: [], published_at: new Date().toISOString() } : fresh ? (opt.nodraft ? { count: 0, list: [], published_at: null } : { count: 1, list: [CHANGES[1]], published_at: null }) : { count: 3, list: CHANGES, published_at: null };
  }
  return { ok: true, room: r };
}
const IMG = (k) => `/__img/${k}`;
const LOOKS = [['l1', 'The Emerald Bride', ['green-necklace', 'kundan', 'tikka'], 'Rs 55,000', 'published', 'live'], ['l2', 'Rose Mehendi', ['veil-hands'], 'Rs 18,000', 'published', 'live'], ['l3', 'Maang Tikka Classic', ['tikka'], 'Rs 48,000', 'published', 'live'], ['l4', 'Golden Hour', ['pastel-saree'], 'Rs 35,000', 'published', 'live'], ['l5', 'Kaleere Morning', ['kaleere'], null, 'published', 'waiting_for_photos'], ['l6', 'Kundan Study', ['kundan'], 'Rs 40,000', 'draft', 'draft']];
const REV = ['approved', 'waiting', 'not_approved'];
export function looks(plan) {
  if (plan === 'new') return { ok: true, looks: [] };
  return { ok: true, looks: LOOKS.map(([id, title, ph, price, status, state]) => ({ id, slug: id, title, status, public_state: state, category: 'bridal', included: id === 'l1' ? ['Makeup and hair for the bride', 'Draping and jewellery setting'] : [], from_price: price, package_id: null,
    credits: id === 'l1' ? [{ role: 'Outfit', name: 'Label Noor' }, { role: 'Jewellery', name: 'Kundan House' }] : [], videos: [],
    photos: ph.map((k, i) => ({ id: `${id}p${i}`, url: IMG(k), review: id === 'l1' ? REV[i] : state === 'waiting_for_photos' ? 'waiting' : 'approved', reason: id === 'l1' && i === 2 ? 'The photo is blurred' : null, caption: null, alt: null, position: i, focal_portrait: { x: 50, y: 26 }, focal_landscape: { x: 50, y: 40 } })) })) };
}
export const testimonials = () => ({ ok: true, testimonials: [
  { id: 't1', name: 'Ananya', occasion: 'Wedding', month: '2026-02', place: 'Udaipur', words: 'She understood my face in ten minutes. On the day I cried twice and nothing moved.', video_url: null, state: 'pending', from_client: true, to_delete: false },
  { id: 't2', name: 'Meher', occasion: 'Wedding', month: '2026-03', place: 'Jaipur', words: 'Calm, quick and exactly what I asked for.', video_url: null, state: 'pending', from_client: true, to_delete: false },
  { id: 't3', name: 'Ira', occasion: 'Wedding', month: '2025-12', place: 'New Delhi', words: 'Lovely.', video_url: null, state: 'approved', from_client: true, to_delete: false },
  { id: 't4', name: 'Sana', occasion: 'Engagement', month: '2026-03', place: 'Gurugram', words: 'Perfect.', video_url: null, state: 'approved', from_client: true, to_delete: false },
  { id: 't5', name: 'Old entry', occasion: null, month: null, place: null, words: 'Typed in before client links.', video_url: null, state: 'pending', from_client: false, to_delete: true },
], requests: [] });
export function visitors(plan, days) {
  if (plan === 'basic' || plan === 'new') return { ok: false, error: 'The new website is on Essential and up.' };
  const by = plan === 'essential' ? null : { google: 34, instagram: 92, facebook: 4, whatsapp: 15, direct: 7, other: 0 };
  const saved = plan === 'prestige' ? [{ slug: 'l2', title: 'Rose Mehendi', hearts: 9 }, { slug: 'l1', title: 'The Emerald Bride', hearts: 7 }, { slug: 'l4', title: 'Golden Hour', hearts: 7 }] : null;
  const k = days === 28 ? 3 : 1;
  return { ok: true, visitors: { days, from: '2026-09-24', to: '2026-09-30', visitors: 152 * k, views: 410 * k, daily: [], top_look: { slug: 'l1', title: 'The Emerald Bride', views: 57 * k },
    by_source: by && Object.fromEntries(Object.entries(by).map(([s, c]) => [s, c * k])), saved_looks: saved } };
}
/** The door router: the route after /__api (with its query) and the method, to an answer. */
export function siteAnswer(plan, route, method, opt = {}) {
  const r = route.split('?')[0].replace(/^\/api\/v2\/vendor\/solutions\/site/, '');
  if (r === '/room') return room(plan, opt);
  if (r === '/publish') return plan === 'new' && opt.nodraft ? { ok: false, error: 'There are no changes to publish.' } : { ok: true, published_at: new Date().toISOString(), is_live: true };
  if (r === '/discard') return { ok: true, discarded: true };
  if (r === '/settings' || r === '/sections') return { ok: true, saved: [] };
  if (r === '/looks' && method === 'GET') return looks(plan);
  if (r === '/looks' && method === 'POST') return { ok: true, look: { id: 'l9', slug: 'new-look' } };
  if (/^\/looks\/[^/]+(\/(publish|unpublish))?$/.test(r)) return { ok: true, saved: [], public_state: 'draft', deleted: true };
  if (/^\/looks\/[^/]+\/photos/.test(r)) return { ok: true, saved: [], deleted: true };
  if (r === '/testimonials') return testimonials();
  if (r === '/testimonials/requests') return { ok: true, request: { id: 'q1', expires_at: '2026-10-30T00:00:00Z' }, link: 'https://thedreamwedding.in/k/k7QmP2xTq', copy_text: 'Hi Ananya, would you write a few words about your day with Studio Ivara? It takes a minute: https://thedreamwedding.in/k/k7QmP2xTq', send: 'copied' };
  if (/^\/testimonials\//.test(r)) return { ok: true, state: 'approved', deleted: true };
  if (r === '/visitors') return visitors(plan, /days=28/.test(route) ? 28 : 7);
  return null;
}
