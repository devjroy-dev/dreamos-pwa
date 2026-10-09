// lib/site/styles/heritage.ts · WEB-5 · Heritage on the server: the approved rendition's markup
// (tools/site_port/heritage.html, body :91-113, STYLE.render :118-129, jaaliTile :131, rosette :134), from the card.
import { html, raw, href, esc, type Raw } from '../html';
import { pic, lq, heartBtn, quotes, rs, lines, PLAY_SVG, HEART_SVG, quoteLink } from '../parts';
import type { SiteCard, Section, Photo } from '../card';
import { shopSection, type CardWithShop } from '../shop';
import type { StyleCtx } from './index';

const LH: Record<string, string> = { makeup: 'Looks for the season', photo: 'Weddings we have kept', performer: 'Acts for every ritual', planner: 'Weddings we have made' };   // :121
const CRAFTH: Record<string, string> = { makeup: 'Jewellery set by hand, stone by stone', photo: 'Every heirloom, kept', performer: 'Instruments made by hand', planner: 'Décor made by hand' };   // :123
const ORN = '<svg class="orn" viewBox="0 0 240 24" aria-hidden="true"><path d="M0 12H100M140 12H240"/><path d="M120 2l10 10-10 10-10-10z"/><circle cx="104" cy="12" r="2.2"/><circle cx="136" cy="12" r="2.2"/><path d="M112 12q8-16 16 0"/></svg>';
const CORNER = (k: string) => `<svg class="corner ${k}" viewBox="0 0 26 26"><path d="M1 25V8a7 7 0 0 1 7-7h17M6 25V11a5 5 0 0 1 5-5h14"/></svg>`;
const s = (x: unknown): string => (typeof x === 'string' ? x : '');

/** heritage.html :134 rosette(), drawn once on the server. */
function rosette(): string {
  let d = '';
  for (let i = 0; i < 16; i++) d += `<ellipse fill="none" stroke="currentColor" stroke-width=".6" cx="0" cy="-52" rx="11" ry="34" transform="rotate(${i * 22.5})"/>`;
  for (let i = 0; i < 32; i++) d += `<circle cx="0" cy="-92" r="3" transform="rotate(${i * 11.25})"/>`;
  return d + '<circle r="18"/><circle r="30"/><circle r="84"/><circle r="99"/>';
}
/** heritage.html :131 jaaliTile(): the lattice tile in her ground colour, as the --jl property (value from the card). */
export function jaaliVar(ground: string): string {
  const c = /^#[0-9a-f]{3,8}$/i.test(ground) ? ground : '#f6efe3'; let star = '';
  for (let i = 0; i < 16; i++) { const a = Math.PI * 2 * i / 16, r = i % 2 ? 8.5 : 15.5; star += (i ? 'L' : 'M') + (24 + Math.cos(a) * r).toFixed(2) + ' ' + (24 + Math.sin(a) * r).toFixed(2); }
  star += 'Z'; const TO = 'L'; /* WEB-8 (MERGED): the path's line-to letter, held apart so tdw09_money does not read a figure then L as lakh; same bytes out */ const corner = (x: number, y: number) => `M${x - 6} ${y}${TO}${x} ${y - 6}${TO}${x + 6} ${y}${TO}${x} ${y + 6}Z`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path fill-rule='evenodd' fill='${c}' d='M0 0h48v48H0z ${star} ${corner(0, 0)} ${corner(48, 0)} ${corner(0, 48)} ${corner(48, 48)}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function cover(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const sl = (c.site.cover || []).filter((k) => k.photo).slice(0, 3); const f = sl[0];
  return html`<div class="cover go" id="cover"><svg class="rosette" id="rosette" viewBox="-100 -100 200 200" aria-hidden="true" style="color:var(--accent)">${raw(rosette())}</svg>
  <div class="txt"><span class="caps" id="ck">${f?.eyebrow || ''}</span><h1 class="ctitle fitlines in" id="ct">${lines(f?.headline || x.name)}</h1>${raw(ORN)}
  ${f?.button ? html`<a class="btn btn-v" href="#looks"><span id="cb">${f.button}</span><span class="ar">→</span></a>` : ''}<div class="pips" id="pips">${raw(sl.map((_, i) => `<button aria-label="Cover ${i + 1}" class="${i ? '' : 'on'}"></button>`).join(''))}</div></div>
  <div class="archw" id="archw"><div id="sls">${raw(sl.map((k, i) => `<div class="sl ${i ? '' : 'on'}" data-kick="${esc(k.eyebrow || '')}" data-h="${esc(k.headline || x.name)}" data-cta="${esc(k.button || '')}">${pic(k.photo, { hero: i === 0, defer: i > 0, sizes: '(min-width:1024px) 40vw, 80vw' }).s}</div>`).join(''))}</div><div class="jaali open" id="jmain"></div></div></div>`;
}
function looks(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const L = c.looks || []; if (!L.length) return raw('');
  return html`<section id="looks"><div class="sh rv"><span class="caps">${sec.eyebrow || c.site.trade.items}</span><h2 id="lh">${sec.heading || LH[x.trade] || LH.makeup}</h2><svg class="orn rv" viewBox="0 0 240 24"><path d="M0 12H100M140 12H240"/><path d="M120 2l10 10-10 10-10-10z"/><circle cx="104" cy="12" r="2.2"/><circle cx="136" cy="12" r="2.2"/></svg></div><div class="grid" id="grid">${raw(L.map((l, i) => html`<a class="card rv" style="--d:${(i % 2) * 0.12}s" href="${href(x.lookHref(l.slug))}" data-i="${i}"><div class="ph" style="${lq(l.cover)}">${pic(l.cover, { sizes: '(min-width:1024px) 22vw, 45vw' })}<div class="jaali"></div>${heartBtn(i, '', l.slug)}${l.has_video ? html`<span class="vidtag" data-over>${PLAY_SVG}</span>` : ''}</div><span class="caps cat">${l.category || ''}</span><div class="nm">${l.title}</div>${l.from_price ? html`<div class="pr">From ${l.from_price}</div>` : ''}</a>`.s).join(''))}</div></section>`;
}
function band(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const b = (sec.body || {}) as { photos?: Photo[] }; const p = (b.photos || [])[0]; if (!p) return raw('');
  return html`<div class="craft rv" id="craft">${raw(pic(p, { sizes: '100vw' }).s.replace('<img', '<img id="craftImg"'))}<div class="jaali" id="jcraft"></div><div class="in2" data-over><span class="caps">${sec.eyebrow || 'Made by hand'}</span><h3 id="craftH">${sec.heading || CRAFTH[x.trade] || CRAFTH.makeup}</h3></div></div>`;
}
function collections(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const C = c.collections || []; if (!C.length) return raw('');
  return html`<section id="collections"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Collections'}</span><h2>${sec.heading || 'Windows into the season'}</h2></div><div class="rail" id="rail">${raw(C.map((k, i) => html`<a class="coll rv" style="--d:${(i * 0.1).toFixed(1)}s" href="${href(x.collectionHref(k.slug))}"><div class="fr"><div class="ph" style="${lq(k.cover)}">${pic(k.cover, { sizes: '62vw' })}</div></div><b>${k.name}</b><span>${k.look_slugs.length} ${c.site.trade.items.toLowerCase()}</span></a>`.s).join(''))}</div></section>`;
}
function reviews(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const q = quotes(c.testimonials || []); if (!q.s) return raw(''); const n = (c.testimonials || []).filter((t) => t.words && t.words.trim()).length;
  return html`<section id="reviews"><span class="caps rv">${sec.eyebrow || 'Client reviews'}</span><div id="qwrap">${q}</div>${n > 1 ? html`<div class="qnav"><button id="qPrev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><span id="qCt">1 / ${n}</span><button id="qNext" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>` : ''}</section>`;
}
// WEB-8 C2 (MERGED): "Ask for a quote" is a real control (parts.ts quoteLink): her WhatsApp with the package named, opened in the enquiry panel when it runs.
function pricing(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const P = (c.packages || []).filter((p) => p.name); if (!P.length) return raw(''); const note = s(c.site.copy?.pricing_note);
  return html`<section id="pricing"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Pricing'}</span><h2>${sec.heading || 'Starting from'}</h2></div><div class="card-frame rv">${raw(['tl', 'tr', 'bl', 'br'].map(CORNER).join(''))}<div id="price">${raw(P.map((p, i) => `<div class="row rv" style="--d:${(i * 0.1).toFixed(1)}s"><span class="n">${esc(p.name)}</span><span class="dots"></span>${typeof p.total === 'number' ? `<span class="v">${rs(p.total)}</span>` : quoteLink(c, p.name, 'Ask for a quote')}</div>`).join(''))}${note ? html`<p class="note">${note}</p>` : ''}</div></div></section>`;
}
function studio(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const copy = c.site.copy || {}; const p = (copy.studio_photo || null) as Photo | null; const lead = s(copy.studio_heading), body = s(copy.studio_body); if (!lead && !body) return raw('');
  return html`<section id="story"><div class="story">${p ? html`<div class="ph rv" id="storyPh" style="${lq(p)}">${pic(p, { sizes: '(min-width:1024px) 40vw, 76vw' })}<div class="jaali" id="jstory"></div></div>` : ''}<div><span class="caps rv">${sec.eyebrow || 'The studio'}</span>${lead ? html`<p class="lead rv" id="sl">${lead}</p>` : ''}${body ? html`<p class="rv" id="sp">${body}</p>` : ''}</div></div></section>`;
}
function faq(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const F = c.faq || []; if (!F.length) return raw('');
  return html`<section id="faq"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Questions'}</span><h2>${sec.heading || 'Before you ask'}</h2></div><div class="faq" id="faql">${raw(F.map((f) => html`<div class="fq rv"><button>${f.question}<span class="pm"></span></button><div class="ans"><div><p>${f.answer}</p></div></div></div>`.s).join(''))}</div></section>`;
}
function enquire(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const line = s(c.site.copy?.enquire_line) || 'Ask about your date';
  return html`<footer><a class="ask rv" href="${href(x.dateHref)}" data-eliza><span class="caps">Enquire</span><span class="t">${line}</span><span class="btn btn-v"><span>Begin</span><span class="ar">→</span></span></a>
  <div class="fname rv" data-fill="200">${x.name}</div><div class="fl">${c.looks?.length ? html`<a href="#looks">${c.site.trade.items}</a>` : ''}${c.collections?.length ? html`<a href="#collections">Collections</a>` : ''}${c.packages?.length ? html`<a href="#pricing">Pricing</a>` : ''}${x.instagram ? html`<a href="${href(x.instagram)}" rel="noopener">Instagram</a>` : ''}${c.enquire_link ? html`<a href="${href(c.enquire_link)}" rel="noopener">WhatsApp</a>` : ''}</div>${c.site.credit ? html`<div class="credit">Made with The Dream Wedding</div>` : ''}</footer>`;
}
const DRAW: Record<string, (c: SiteCard, x: StyleCtx, s: Section) => Raw> = { cover, looks, band, collections, reviews, pricing, studio, faq, enquire,
  // CE-47 OFF-A2: the off-season shop, in this style's own section head (lib/site/shop.ts).
  shop: (c, _x, sec) => shopSection('heritage', (c as CardWithShop).shop || [], sec, (c as CardWithShop).shop_base || '') };

export const heritage = {
  id: 'heritage',
  header(c: SiteCard, x: StyleCtx): Raw {
    return html`<div class="band-top" aria-hidden="true"></div>
<header class="hd" id="hd">
 <div class="l"><button class="ib" data-menu aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 7h18M6 12h12M3 17h18"/></svg><span class="ml">Menu</span></button><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button></div>
 <a class="wm" href="#top"><span class="wmt">${x.name}</span><span class="mono">${x.mono}</span></a>
 <div class="r"><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button><a class="enq" href="${href(x.dateHref)}" data-eliza>Enquire</a></div>
</header>`;
  },
  body(c: SiteCard, x: StyleCtx): Raw { return html`<main id="top">${raw(c.site.sections.map((sec) => (DRAW[sec.key] ? DRAW[sec.key](c, x, sec).s : '')).join('\n'))}</main>`; },
  vars(c: SiteCard): Record<string, string> { return { '--jl': jaaliVar(c.site.palette?.roles?.ground || '') }; },
  over: ['.craft .in2', '.card .vidtag'],
};
