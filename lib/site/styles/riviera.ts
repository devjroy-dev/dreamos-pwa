// lib/site/styles/riviera.ts · WEB-5 · Riviera on the server: the approved rendition's markup
// (tools/site_port/riviera.html, body :91-113, STYLE.render :118-131), filled from the card.
import { html, raw, href, esc, type Raw } from '../html';
import { pic, lq, heartBtn, quotes, rs, lines, PLAY_SVG, HEART_SVG } from '../parts';
import type { SiteCard, Section, Photo } from '../card';
import type { StyleCtx } from './index';

const LH: Record<string, string> = { makeup: 'Postcards from the season', photo: 'Postcards from the road', performer: 'Sets, sent home', planner: 'Postcards from our weddings' };   // :122
const SLOWH: Record<string, string> = { makeup: 'Getting ready, with the doors open', photo: 'The hour before the guests', performer: 'Soundcheck at sunset', planner: 'The hour before the guests' };   // :125
const ROT = [-4, 3, -2, 5, -5, 2, -3, 4]; const RT = [-1.5, 1.2, -0.8, 1.6, -1.2, 0.9, -1.4, 1];   // :123-124
const s = (x: unknown): string => (typeof x === 'string' ? x : '');
const arr = (x: unknown): string[] => (Array.isArray(x) ? (x.filter((v) => typeof v === 'string' && v.trim()) as string[]) : []);

function cover(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const f = (c.site.cover || []).find((k) => k.photo) || null;
  const stamp = `${(s(c.site.copy?.cities) || c.city || '').split('·')[0].trim()} · ${new Date().getFullYear()} · ${arr(c.site.copy?.destinations).length ? 'DESTINATIONS' : 'WEDDINGS'} ·`.toUpperCase();
  return html`<div class="cover go" id="cover"><div id="cimg">${f ? pic(f.photo, { hero: true, sizes: '100vw' }) : ''}</div>
  <svg class="stampc" viewBox="0 0 80 80" aria-hidden="true" data-over><circle cx="40" cy="40" r="36"/><circle cx="40" cy="40" r="28"/><path id="arc" d="M40 40m-32 0a32 32 0 1 1 64 0a32 32 0 1 1-64 0" fill="none"/><text><textPath href="#arc" id="stampT">${stamp}</textPath></text></svg>
  <div class="cc" data-over>${f?.eyebrow ? html`<span class="caps" id="ck">${f.eyebrow}</span>` : ''}<h1 class="h1 fitlines in" id="h1">${lines(f?.headline || x.name)}</h1>${f?.button ? html`<a class="btn btn-p" href="#looks"><span id="cb">${f.button}</span><span class="ar">→</span></a>` : ''}</div></div>
 ${arr(c.site.copy?.destinations).length ? html`<div class="dest" aria-label="Places the studio travels to"><div id="dest">${raw(arr(c.site.copy?.destinations).map((p) => `${esc(p)}<span>✦</span>`).join('').repeat(2))}</div></div>` : ''}`;
}
function looks(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const L = c.looks || []; if (!L.length) return raw('');
  // WEB-8 (MERGED, CE-47 ruling 1): the postmark shows a place; a look carries none, so her profile city is stamped (her category only if she has no city).
  const post = (i: number, l: { category?: string | null }) => (c.city || l.category || '').toUpperCase().slice(0, 9);
  const first = L[0];
  return html`<section id="looks"><div class="sh rv"><span class="caps">${sec.eyebrow || c.site.trade.items}</span><h2 id="lh">${sec.heading || LH[x.trade] || LH.makeup}</h2></div>
  <div class="looksw"><div class="deckw" id="deck">${raw(L.slice(0, 8).map((l, i) => ({ l, i })).reverse().map(({ l, i }, k) => `<div class="pc" data-k="${i}" data-name="${esc(l.title)}" data-price="${esc(l.from_price ? 'From ' + l.from_price : '')}" data-href="${esc(href(x.lookHref(l.slug)))}" style="--rot:${ROT[i % 8]}deg;z-index:${k}"><div class="ph" style="${lq(l.cover)}">${pic(l.cover, { sizes: '(min-width:1024px) 34vw, 80vw' }).s}</div><span class="stamp" data-over><i></i></span><svg class="pm" viewBox="0 0 60 60" data-over><circle cx="30" cy="30" r="26"/><circle cx="30" cy="30" r="20"/><text x="30" y="33" text-anchor="middle">${esc(post(i, l))}</text></svg><div class="pcap"><span>${esc(l.title)}</span><small>N° ${i + 1}</small></div></div>`).join(''))}</div><div><div class="deckcap"><div class="nm" id="dnm">${first.title}</div><div class="pr" id="dpr">${first.from_price ? `From ${first.from_price}` : ''}</div><div class="deckbtns"><a class="btn btn-f" id="dopen" href="${href(x.lookHref(first.slug))}"><span id="dview">View this ${c.site.trade.item}</span></a><button class="btn btn-s" id="dnext"><span>Next card</span><span class="ar">→</span></button></div><div class="hint2">Swipe the card, or tap Next.</div></div></div></div>
  <div class="grid" id="grid">${raw(L.map((l, i) => html`<a class="card rv" href="${href(x.lookHref(l.slug))}" data-i="${i}" style="--rt:${RT[i % 8]}deg;--d:${(i % 2) * 0.1}s"><div class="ph" style="${lq(l.cover)}">${pic(l.cover, { sizes: '(min-width:1024px) 22vw, 45vw' })}</div>${heartBtn(i, '', l.slug)}${l.has_video ? html`<span class="vidtag" data-over>${PLAY_SVG} Film</span>` : ''}<div class="nm">${l.title}</div>${l.from_price ? html`<div class="pr">From ${l.from_price}</div>` : ''}</a>`.s).join(''))}</div></section>`;
}
function band(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const b = (sec.body || {}) as { photos?: Photo[] }; const p = (b.photos || [])[0]; if (!p) return raw('');
  return html`<div class="slow rv" id="slow">${raw(pic(p, { sizes: '100vw' }).s.replace('<img', '<img id="slowImg"'))}<div class="in2" data-over><span class="caps" style="opacity:.9">${sec.eyebrow || 'Slowly'}</span><h3 id="slowH">${sec.heading || SLOWH[x.trade] || SLOWH.makeup}</h3></div></div>`;
}
function collections(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const C = c.collections || []; if (!C.length) return raw('');
  return html`<section id="collections"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Collections'}</span><h2>${sec.heading || 'Places we have been'}</h2></div><div class="rail" id="rail">${raw(C.map((k, i) => html`<a class="coll rv" style="--d:${(i * 0.1).toFixed(1)}s" href="${href(x.collectionHref(k.slug))}"><div class="ph" style="${lq(k.cover)}">${pic(k.cover, { sizes: '66vw' })}</div><b>${k.name}</b><span>${k.look_slugs.length} ${c.site.trade.items.toLowerCase()}</span></a>`.s).join(''))}</div></section>`;
}
function reviews(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const q = quotes(c.testimonials || []); if (!q.s) return raw(''); const n = (c.testimonials || []).filter((t) => t.words && t.words.trim()).length;
  return html`<section id="reviews"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Client reviews'}</span></div><div class="note-card rv"><div id="qwrap">${q}</div>${n > 1 ? html`<div class="qnav"><button id="qPrev">Previous</button><button id="qNext">Next</button><span id="qCt" style="opacity:.6">1 / ${n}</span></div>` : ''}</div></section>`;
}
function pricing(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const P = (c.packages || []).filter((p) => p.name); if (!P.length) return raw(''); const note = s(c.site.copy?.pricing_note);
  return html`<section id="pricing"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Rates'}</span><h2>${sec.heading || 'Starting from'}</h2></div><div class="rates" id="price">${raw(P.map((p, i) => `<div class="row rv" style="--d:${(i * 0.08).toFixed(2)}s"><span class="n">${esc(p.name)}</span><span class="v">${typeof p.total === 'number' ? 'From ' + rs(p.total) : 'Ask for a quote'}</span></div>`).join(''))}${note ? html`<p class="note rv">${note}</p>` : ''}</div></section>`;
}
function studio(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const copy = c.site.copy || {}; const p = (copy.studio_photo || null) as Photo | null; const lead = s(copy.studio_heading), body = s(copy.studio_body); if (!lead && !body) return raw('');
  return html`<section id="story"><div class="story">${p ? html`<div class="ph rv" id="storyPh" style="${lq(p)}">${pic(p, { sizes: '(min-width:1024px) 45vw, 92vw' })}</div>` : ''}<div><span class="caps rv" style="color:var(--atx)">${sec.eyebrow || 'The studio'}</span>${lead ? html`<p class="lead rv" id="sl">${lead}</p>` : ''}${body ? html`<p class="rv" id="sp">${body}</p>` : ''}</div></div></section>`;
}
function faq(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const F = c.faq || []; if (!F.length) return raw('');
  return html`<section id="faq"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Questions'}</span><h2>${sec.heading || 'Before you ask'}</h2></div><div class="faq" id="faql">${raw(F.map((f) => html`<div class="fq rv"><button>${f.question}<span class="pm"></span></button><div class="ans"><div><p>${f.answer}</p></div></div></div>`.s).join(''))}</div></section>`;
}
function enquire(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const line = s(c.site.copy?.enquire_line) || 'Ask about your date';
  return html`<footer><div class="sun"></div><a class="rv" href="${href(x.dateHref)}" data-eliza style="display:block;margin:0 auto"><span class="caps">Enquire</span><span class="t">${line}</span><span class="btn"><span>Begin</span><span class="ar">→</span></span></a>
  <div class="fname rv" data-fill="200">${x.name}</div><div class="fl">${c.looks?.length ? html`<a href="#looks">${c.site.trade.items}</a>` : ''}${c.collections?.length ? html`<a href="#collections">Collections</a>` : ''}${c.packages?.length ? html`<a href="#pricing">Rates</a>` : ''}${x.instagram ? html`<a href="${href(x.instagram)}" rel="noopener">Instagram</a>` : ''}${c.enquire_link ? html`<a href="${href(c.enquire_link)}" rel="noopener">WhatsApp</a>` : ''}</div>${c.site.credit ? html`<div class="credit">Made with The Dream Wedding</div>` : ''}</footer>`;
}
const DRAW: Record<string, (c: SiteCard, x: StyleCtx, s: Section) => Raw> = { cover, looks, band, collections, reviews, pricing, studio, faq, enquire };

export const riviera = {
  id: 'riviera',
  header(c: SiteCard, x: StyleCtx): Raw {
    return html`<div class="leak" aria-hidden="true"></div>
<header class="hd" id="hd">
 <div class="l"><button class="ib" data-menu aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h12"/></svg><span class="ml">Menu</span></button><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button></div>
 <a class="wm" href="#top"><span class="wmt">${x.name}</span><span class="mono">${x.mono}</span></a>
 <div class="r"><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button><a class="enq" href="${href(x.dateHref)}" data-eliza>Enquire</a></div>
</header>`;
  },
  body(c: SiteCard, x: StyleCtx): Raw { return html`<main id="top">${raw(c.site.sections.map((sec) => (DRAW[sec.key] ? DRAW[sec.key](c, x, sec).s : '')).join('\n'))}</main>`; },
  over: ['.cc', '.stampc', '.slow .in2', '.pc .pm', '.pc .stamp', '.card .vidtag'],
};
