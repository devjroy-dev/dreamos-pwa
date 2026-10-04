// WEB-5 rig: styles-site fixture cards in the shape dream-os a0bfe02 serves (siteCard.js), filled with the approved
// prototypes' own mock data (engine.js T.makeup, REVIEWS, FAQ; each style's STYLE constants), palettes and pairs read
// from WEB-4's registry itself (dream-os src/lib/site/styles.js), so a server page compares with the approved rendition.
const REG = require(process.env.TDW_DREAM_OS ? require('path').join(process.env.TDW_DREAM_OS, 'src/lib/site/styles.js') : '../../../dream-os/src/lib/site/styles.js');
module.exports = function cards(base) {
  const POS = { 'green-necklace': [50, 26], 'pastel-saree': [50, 28], 'veil-hands': [50, 38], tikka: [38, 35], kaleere: [50, 45], kundan: [50, 50], mehendi: [50, 50], arch: [50, 62], staircase: [45, 50], sherwani: [50, 40], pavilion: [58, 55], 'sikh-couple': [32, 45], 'pink-stair': [62, 50], 'lake-mandap': [50, 55], poolside: [50, 55], 'mandap-sea': [50, 45] };
  const P = (k) => ({ url: `${base}/tdwfx/image/upload/v1/site/${k}.jpg`, w: null, h: null, focal_portrait: { x: POS[k][0], y: POS[k][1] }, focal_landscape: { x: POS[k][0], y: POS[k][1] }, alt: '' });
  const names = ['The Emerald Bride', 'Rose Mehendi', 'Maang Tikka Classic', 'Golden Hour', 'Palace Morning', 'Pavilion Evening', 'The Groom Edit', 'Kaleere and Chooda'];
  const prices = [55000, 18000, 48000, 35000, 45000, 42000, 15000, 22000];
  const cats = ['New looks', 'Bridal', 'Engagement', 'Reception', 'Mehendi', 'Sangeet'];
  const PH = [['green-necklace', 'kundan'], ['veil-hands', 'mehendi'], ['tikka', 'kaleere'], ['pastel-saree', 'sikh-couple'], ['arch', 'staircase'], ['pavilion', 'pink-stair'], ['sherwani', 'sikh-couple'], ['kaleere', 'veil-hands']];
  const rs = (n) => { const s = String(n), l = s.slice(-3), r = s.slice(0, -3); return 'Rs ' + (r ? r.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + l; };
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const testimonials = [
    { words: 'She understood my face in ten minutes. On the day I cried twice and nothing moved.', name: 'Ananya', place: 'Udaipur', month: '2026-02', occasion: null, video: null },
    { words: 'Calm, on time, and the trial was exactly what I wore on the day. My mother wants her for my sister.', name: 'Ira', place: 'New Delhi', month: '2025-12', occasion: null, video: null },
    { words: 'Every photograph from the reception looks like me, only rested. That is all I wanted.', name: 'Sana', place: 'Gurugram', month: '2026-03', occasion: null, video: null },
    // WEB-8 (MERGED): the prototype's video review (Couture draws it), so the gate compares like with like
    { words: null, name: 'Ananya and Kabir', place: null, month: null, occasion: null, video: { url: 'https://www.youtube.com/watch?v=fixture', duration_s: 64, title: 'Ananya and Kabir, in their own words', poster: `${base}/tdwfx/image/upload/v1/site/sikh-couple.jpg` } }];
  const faq = [['How far ahead should I book?', 'Most brides book four to eight months ahead. Winter weekends go first.'], ['Do you travel for destination weddings?', 'Yes. Travel and stay are quoted with the booking.'], ['Is a trial included?', 'A trial is booked separately and adjusted against the final package.'], ['How do I hold my date?', 'Ask about your date here. The studio confirms on WhatsApp and a deposit holds it.']].map(([question, answer]) => ({ question, answer }));
  const packages = [['Bridal makeup and hair', 45000], ['Engagement or reception', 25000], ['Mehendi or haldi', 18000], ['Family and bridesmaids, per person', 8000], ['Trial session', 5000]].map(([name, total]) => ({ name, description: null, total, items: [] }));
  const pal = (id) => { const p = REG.PALETTE_BY_ID[id] || REG.palettesOf(id.split('.')[0])[0]; return { id: p.id, roles: p.roles, extras: p.extras || {} }; };
  const fonts = (id) => ({ id, ...REG.FONT_PAIRS[id] });
  const sec = (key, extra = {}) => ({ key, variant: null, eyebrow: null, heading: null, body: key === 'band' ? { lines: [], words: [], destinations: [], photos: [] } : {}, ...extra });
  const bandSec = (photos, lines, words, eyebrow, heading) => sec('band', { eyebrow: eyebrow || null, heading: heading || null, body: { lines: lines || [], words: words || [], destinations: [], photos: photos.map(P) } });
  const COLLN = ['The Winter Brides', 'Mehendi and Haldi', 'Reception Glam', 'Destination'];
  const D = {
    couture: { cover: [['green-necklace', 'The winter edit', 'The winter brides', 'Explore the looks'], ['pastel-saree', 'Reception', 'Golden hour, softly', 'See reception looks'], ['veil-hands', 'Mehendi and haldi', 'Hands, henna, colour', 'See mehendi looks']],
      order: ['cover', 'looks', bandSec(['mehendi'], [], ['Mehendi', 'Haldi', 'Sangeet', 'Pheras', 'Reception'], 'The mehendi edit', 'Colour for the day before'), 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'], coll: ['green-necklace', 'mehendi', 'pastel-saree', 'lake-mandap'], story: 'staircase', texture: 'rolling_words' },
    gallery: { cover: [['staircase', 'No. 01 · Bridal makeup and hair', 'The staircase', 'See the looks']], order: ['cover', 'looks', 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'], coll: ['arch', 'pavilion', 'mandap-sea', 'sikh-couple'], story: 'pavilion', texture: 'clean',
      intro: 'Bridal makeup and hair, New Delhi. Twenty-four looks from the 2026 season, hung one by one.' },
    noir: { cover: [['tikka', 'After dark', 'The Night Bride', 'Discover'], ['kaleere', 'The mehendi', 'Hands in gold', 'Discover'], ['sherwani', 'The groom', 'Ivory and velvet', 'Discover']],
      order: ['cover', 'looks', bandSec(['veil-hands']), 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'], coll: ['kaleere', 'green-necklace', 'sherwani', 'tikka'], story: 'sherwani', texture: 'film_grain' },
    heritage: { cover: [['arch', 'The wedding season · 2026', 'A palace morning', 'See the looks'], ['kundan', 'Heirloom detail', 'Kundan, polki, gold', 'See the looks'], ['pastel-saree', 'The haldi', 'Saffron and silk', 'See the looks']],
      order: ['cover', 'looks', bandSec(['kundan']), 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'], coll: ['arch', 'mandap-sea', 'pastel-saree', 'sikh-couple'], story: 'staircase', texture: 'paper' },
    aurora: { cover: [['pink-stair', 'Winter 2026 looks', 'Soft light, all day', 'See the looks', 'light,'], ['pastel-saree', '', '', ''], ['poolside', '', '', '']],
      order: ['cover', bandSec(['pastel-saree', 'mehendi', 'pink-stair'], ['Skin that breathes in the heat of a Delhi winter noon.', 'Colour that lasts from the haldi to the last dance.', 'A look that is yours, not a trend.']), 'looks', 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'],
      coll: ['pink-stair', 'mehendi', 'pastel-saree', 'poolside'], story: 'pastel-saree', texture: 'clean' },
    riviera: { cover: [['lake-mandap', 'By the water · 2026', 'Weddings by the water', 'See the looks']], order: ['cover', 'looks', bandSec(['poolside']), 'collections', 'reviews', 'pricing', 'studio', 'faq', 'enquire'],
      coll: ['mandap-sea', 'lake-mandap', 'poolside', 'arch'], collNames: ['By the sea', 'Lakeside', 'Poolside', 'Palace'], story: 'mandap-sea', texture: 'sunlight',
      destinations: ['Udaipur', 'Goa', 'Jaipur', 'Kerala', 'Rishikesh', 'Mussoorie', 'Jodhpur', 'Andaman'], note: 'Prices are set by the studio. Travel and stay are quoted with the booking.' },
  };
  const make = (st, handle, name, palId, pairId) => { const d = D[st];
    return { business_name: name, category: 'makeup_artist', city: 'New Delhi', handle, enquire_link: 'https://wa.me/910000000000', date_check_enabled: true, starting_price: 45000, packages, instagram_handle: 'studio.ivara',
      meta: { title: `${name} · Makeup artist · New Delhi`, description: 'Bridal makeup and hair for weddings across Delhi NCR.' }, testimonials, faq, eliza: { live_booking: 'coming_soon', own_voice: 'not_in_plan' },
      site: { v: 'styles', style: st, site_name: name, monogram: 'SI', credit: true, domain: null, palette: pal(palId || REG.palettesOf(st)[0].id), fonts: fonts(pairId || REG.STYLES[st].pairs[0]), motion: 'lively', corners: 'square', buttons: 'solid', texture: d.texture, cover_mode: 'slideshow',
        cover: d.cover.map(([k, e, h, b, em]) => ({ photo: P(k), eyebrow: e || null, headline: h || null, emphasis: em || null, button: b || null, target: st === 'gallery' ? { kind: 'look', ref: slug(names[4]) } : { kind: 'section', ref: 'looks' } })),   // WEB-8 (MERGED): Gallery's cover points at the look its wall label names in the prototype
        sections: d.order.map((o) => (typeof o === 'string' ? sec(o) : o)), pages: [], trade: { items: 'Looks', item: 'look', request: 'Request this look' },
        copy: { intro: d.intro || null, announcements: ['Now booking November 2026 to March 2027', 'Trials in New Delhi and Gurugram', 'Request any look on WhatsApp', 'Travel for destination weddings'], categories: cats,
          studio_heading: 'Makeup that looks like you, on the best day of your life.', studio_body: `${name} works from New Delhi and travels across India for weddings. Every booking is handled by the studio itself, from the first call to the last photograph of the night.`,
          studio_photo: P(d.story), pricing_note: d.note || 'Prices are set by the studio. Your quote follows a short call about the day.', enquire_line: null, cities: 'New Delhi · Gurugram', destinations: d.destinations || [], rolling_words: [] },
        seo: { title: `${name} · Makeup artist · New Delhi`, description: 'Bridal makeup and hair for weddings across Delhi NCR.', image: null, canonical: `https://thedreamwedding.in/v/${handle}` } },
      looks: PH.map((p, i) => ({ slug: slug(names[i]), title: names[i], category: st === 'gallery' ? `Bridal makeup and hair · ${cats[1 + (i % (cats.length - 1))]}` : cats[1 + (i % (cats.length - 1))], year_label: st === 'gallery' ? '2026' : null, from_price: rs(prices[i]), is_new: i < 2, cover: P(p[0]), second: P(p[1]), photo_count: 2, has_video: false, video_duration_s: null })),
      collections: d.coll.map((k, i) => ({ slug: slug((d.collNames || COLLN)[i]), name: (d.collNames || COLLN)[i], description: null, cover: P(k), look_slugs: Array.from({ length: 6 + i * 2 }, (_, j) => 'x' + j) })) }; };
  const out = {};
  for (const st of Object.keys(D)) {
    out[`fixture-${st}`] = make(st, `fixture-${st}`, 'Studio Ivara');
    out[`fixture-${st}-long`] = make(st, `fixture-${st}-long`, 'Rukmini Sethi Bridal Artistry');
    for (const p of REG.palettesOf(st)) out[`fixture-${st}-${p.id.split('.')[1]}`] = make(st, `fixture-${st}-${p.id.split('.')[1]}`, 'Studio Ivara', p.id);
    for (const f of REG.STYLES[st].pairs) out[`fixture-${st}-f-${f}`] = make(st, `fixture-${st}-f-${f}`, 'Studio Ivara', null, f);
  }
  return out;
};
