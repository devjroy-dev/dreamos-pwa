// lib/site/styles/noir.ts · WEB-5 · Noir on the server: the approved rendition's markup (tools/site_port/noir.html,
// body :88-111 and STYLE.render :114-127), filled from the card. Style words are WEB-3's (cited); her words the card's.
import { html, raw, href, esc, type Raw } from '../html';
import { pic, lq, heartBtn, quotes, rs, PLAY_SVG, HEART_SVG, quoteLink } from '../parts';
import type { SiteCard, Section, Photo } from '../card';
import type { StyleCtx } from './index';

const LH: Record<string, string> = { makeup: 'The evening looks', photo: 'Recent stories', performer: 'The acts', planner: 'Recent evenings' };   // noir.html:117
const ROOMH: Record<string, string> = { makeup: 'Every detail, lit', photo: 'Every detail, kept', performer: 'Every note, felt', planner: 'Every detail, placed' };   // :120
const s = (x: unknown): string => (typeof x === 'string' ? x : '');
/** noir.html STYLE.after show(): the title set letter by letter (spans .wd > .c, --i running across words). */
export const noirTitle = (t: string): string => { let j = 0; return t.split(' ').map((wd) => `<span class="wd">${[...wd].map((ch) => `<span class="c" style="--i:${j++}">${esc(ch)}</span>`).join('')}</span>`).join(' '); };

function cover(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const sl = (c.site.cover || []).filter((k) => k.photo).slice(0, 3); const f = sl[0];
  return html`<div class="cover go" id="cover"><div id="slides">${raw(sl.map((k, i) => `<div class="slide${i ? '' : ' on lit'}" data-kick="${esc(k.eyebrow || '')}" data-h="${esc(k.headline || x.name)}" data-cta="${esc(k.button || '')}">${pic(k.photo, { hero: i === 0, defer: i > 0, sizes: '(min-width:1024px) 50vw, 100vw' }).s}</div>`).join(''))}</div>
  <div class="cc" data-over><span class="caps" id="ck">${f?.eyebrow || ''}</span><h1 class="ttl" id="ttl">${raw(noirTitle(f?.headline || x.name))}</h1><div class="rule"></div>${f?.button ? html`<a class="btn bg" href="#looks"><span id="cb">${f.button}</span><span class="ar">→</span></a>` : ''}</div>
  <div class="dots3" id="dots3" data-over>${raw(sl.map((_, i) => `<button aria-label="Cover ${i + 1}"><i></i></button>`).join(''))}</div></div>`;
}
function looks(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const L = c.looks || []; if (!L.length) return raw('');
  return html`<section id="looks"><div class="sh rv"><span class="caps" id="lk">${sec.eyebrow || c.site.trade.items}</span><h2 id="lh">${sec.heading || LH[x.trade] || LH.makeup}</h2></div><div class="stack" id="stack">${raw(L.map((l, i) => html`<a class="card" href="${href(x.lookHref(l.slug))}" data-i="${i}"><span class="n goldtx" data-over>N°${String(i + 1).padStart(2, '0')}</span><div class="ph" style="${lq(l.cover)}">${pic(l.cover, { sizes: '(min-width:1024px) 40vw, 92vw' })}</div>${l.has_video ? html`<span class="vidtag" data-over>${PLAY_SVG} FILM${l.video_duration_s ? ` · ${Math.floor(l.video_duration_s / 60)}:${String(l.video_duration_s % 60).padStart(2, '0')}` : ''}</span>` : ''}
   <div class="meta"><div><span class="caps" style="color:var(--mute)">${l.category || ''}</span><div class="nm">${l.title}</div>${l.from_price ? html`<div class="pr">FROM ${l.from_price.toUpperCase()}</div>` : ''}</div>${heartBtn(i, '', l.slug)}</div></a>`.s).join(''))}</div></section>`;
}
function band(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const b = (sec.body || {}) as { photos?: Photo[] }; const p = (b.photos || [])[0]; if (!p) return raw('');
  return html`<div class="room rv" id="room">${raw(pic(p, { sizes: '100vw' }).s.replace('<img', '<img id="roomImg"'))}<div class="dark"></div><div class="lbl" data-over><span class="caps" style="color:var(--accent)">${sec.eyebrow || 'Touch the photograph'}</span><h3 id="roomH">${sec.heading || ROOMH[x.trade] || ROOMH.makeup}</h3></div></div>`;
}
function collections(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const C = c.collections || []; if (!C.length) return raw('');
  return html`<section id="collections"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Collections'}</span><h2>${sec.heading || 'Four evenings'}</h2></div><div class="rail" id="rail">${raw(C.map((k, i) => html`<a class="coll rv" style="--d:${(i * 0.1).toFixed(1)}s" href="${href(x.collectionHref(k.slug))}"><svg class="fr" preserveAspectRatio="none"><rect x=".5" y=".5" width="99%" height="99.5%"/></svg><div class="ph" style="${lq(k.cover)}">${pic(k.cover, { sizes: '70vw' })}</div><div class="cap"><b>${k.name}</b><span>${k.look_slugs.length} ${c.site.trade.items.toUpperCase()}</span></div></a>`.s).join(''))}</div></section>`;
}
function reviews(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const q = quotes(c.testimonials || []); if (!q.s) return raw(''); const n = (c.testimonials || []).filter((t) => t.words && t.words.trim()).length;
  return html`<section id="reviews"><div class="rev"><div class="sh rv" style="margin-bottom:22px"><span class="caps">${sec.eyebrow || 'Client reviews'}</span></div><div id="qwrap">${q}</div>${n > 1 ? html`<div class="qnav"><button id="qPrev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><span id="qCt">1 / ${n}</span><button id="qNext" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>` : ''}</div></section>`;
}
// WEB-8 C2 (MERGED): "Ask for a quote" is a real control (parts.ts quoteLink): her WhatsApp with the package named, opened in the enquiry panel when it runs.
function pricing(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const P = (c.packages || []).filter((p) => p.name); if (!P.length) return raw(''); const note = s(c.site.copy?.pricing_note);
  return html`<section id="pricing"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Pricing'}</span><h2>${sec.heading || 'Starting from'}</h2></div><div class="price" id="price">${raw(P.map((p, i) => `<div class="row rv" style="--d:${(i * 0.1).toFixed(1)}s"><span class="n">${esc(p.name)}</span>${typeof p.total === 'number' ? `<span class="v">${'FROM ' + rs(p.total).toUpperCase()}</span>` : quoteLink(c, p.name, 'ASK FOR A QUOTE')}</div>`).join(''))}${note ? html`<p class="note rv">${note}</p>` : ''}</div></section>`;
}
function studio(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const copy = c.site.copy || {}; const p = (copy.studio_photo || null) as Photo | null; const lead = s(copy.studio_heading), body = s(copy.studio_body); if (!lead && !body) return raw('');
  return html`<section id="story"><div class="story">${p ? html`<div class="ph rv" id="storyPh" style="${lq(p)}">${pic(p, { sizes: '(min-width:1024px) 40vw, 92vw' })}</div>` : ''}<div><span class="caps rv" style="color:var(--accent)">${sec.eyebrow || 'The studio'}</span>${lead ? html`<p class="lead rv" id="sl">${lead}</p>` : ''}${body ? html`<p class="rv" id="sp">${body}</p>` : ''}</div></div></section>`;
}
function faq(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const F = c.faq || []; if (!F.length) return raw('');
  return html`<section id="faq"><div class="sh rv"><span class="caps">${sec.eyebrow || 'Questions'}</span><h2>${sec.heading || 'Before you ask'}</h2></div><div class="faq" id="faql">${raw(F.map((f) => html`<div class="fq rv"><button>${f.question}<span class="pm"></span></button><div class="ans"><div><p>${f.answer}</p></div></div></div>`.s).join(''))}</div></section>`;
}
function enquire(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const line = s(c.site.copy?.enquire_line) || 'Ask about your date';
  return html`<footer><a class="ask rv" href="${href(x.dateHref)}" data-eliza><span class="caps" style="color:var(--accent)">Enquire</span><span class="t">${line}</span><span class="btn bg" style="opacity:1"><span>Begin</span><span class="ar">→</span></span></a>
  <div class="fname goldtx rv" data-fill="220">${x.name}</div><div class="fl caps">${c.looks?.length ? html`<a href="#looks">${c.site.trade.items}</a>` : ''}${c.collections?.length ? html`<a href="#collections">Collections</a>` : ''}${c.packages?.length ? html`<a href="#pricing">Pricing</a>` : ''}${x.instagram ? html`<a href="${href(x.instagram)}" rel="noopener">Instagram</a>` : ''}${c.enquire_link ? html`<a href="${href(c.enquire_link)}" rel="noopener">WhatsApp</a>` : ''}</div>${c.site.credit ? html`<div class="credit">Made with The Dream Wedding</div>` : ''}</footer>`;
}
const DRAW: Record<string, (c: SiteCard, x: StyleCtx, s: Section) => Raw> = { cover, looks, band, collections, reviews, pricing, studio, faq, enquire };

export const noir = {
  id: 'noir',
  header(c: SiteCard, x: StyleCtx): Raw {
    return html`<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="goldg" x1="0" x2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset=".45" stop-color="var(--g2)"/><stop offset="1" stop-color="var(--g1)"/></linearGradient></defs></svg>
<div class="grain" aria-hidden="true"></div>
<header class="hd" id="hd">
 <div class="l"><button class="ib" data-menu aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 9h18M3 15h18"/></svg><span class="ml">Menu</span></button><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button></div>
 <a class="wm" href="#top"><span class="wmt goldtx">${x.name}</span><span class="mono">${x.mono}</span></a>
 <div class="r"><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button><a class="enq" href="${href(x.dateHref)}" data-eliza>Enquire</a></div>
</header>`;
  },
  body(c: SiteCard, x: StyleCtx): Raw { return html`<main id="top">${raw(c.site.sections.map((sec) => (DRAW[sec.key] ? DRAW[sec.key](c, x, sec).s : '')).join('\n'))}</main>`; },
  over: ['.cc', '.dots3', '.room .lbl', '.card .n', '.card .vidtag'],
};
