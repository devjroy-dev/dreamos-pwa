// lib/site/styles/aurora.ts · WEB-5 · Aurora on the server: the approved rendition's markup
// (tools/site_port/aurora.html, body :87-104, STYLE.render :112-124), filled from the card.
import { html, raw, href, esc, type Raw } from '../html';
import { pic, lq, heartBtn, quotes, rs, PLAY_SVG, HEART_SVG } from '../parts';
import type { SiteCard, Section, Photo } from '../card';
import type { StyleCtx } from './index';

const LH: Record<string, string> = { makeup: 'Looks for the season', photo: 'Recent stories', performer: 'The acts', planner: 'Recent events' };   // :116
const s = (x: unknown): string => (typeof x === 'string' ? x : '');
/** aurora.html :113: the cover title in two lines, her emphasis in italics (the card's `emphasis`, WEB-4 cut 3). */
function title(t: string, em: string | null | undefined): string {
  const w = t.split(' '); const h = Math.ceil(w.length / 2); const L = w.length > 2 ? [w.slice(0, h).join(' '), w.slice(h).join(' ')] : [t];
  return L.map((l, i) => { let e = esc(l); if (em && em.trim()) { const k = esc(em.trim()); const at = e.indexOf(k); if (at >= 0) e = e.slice(0, at) + `<em>${k}</em>` + e.slice(at + k.length); }
    return `<span class="ln"><span style="transition-delay:${(0.1 + i * 0.12).toFixed(2)}s">${e}</span></span>`; }).join('');
}
function cover(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const sl = (c.site.cover || []).filter((k) => k.photo).slice(0, 3); const f = sl[0];
  const fl = ['a', 'b', 'c'].map((k, i) => (sl[i] ? `<div class="fl ${k}"><div class="inner">${pic(sl[i].photo, i ? { defer: true, sizes: i === 1 ? '38vw' : '34vw' } : { hero: true, sizes: '(min-width:1024px) 45vw, 80vw' }).s}</div></div>` : '')).join('');
  return html`<div class="cover go" id="cover"><div>${f?.eyebrow ? html`<span class="pill glass" id="ck">${f.eyebrow}</span>` : ''}<h1 class="h1 fitlines in" id="h1">${raw(title(f?.headline || x.name, f?.emphasis))}</h1>
  </div>
  <div class="floats" id="floats">${raw(fl)}</div>
  <div class="cta">${f?.button ? html`<a class="glow" href="#looks"><span id="cb">${f.button}</span><span>→</span></a>` : ''}<a class="pill glass" href="${href(x.dateHref)}" data-eliza style="min-height:52px;padding:0 18px">Check a date</a></div></div>`;
}
function band(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const b = (sec.body || {}) as { photos?: Photo[]; lines?: string[] }; const P = (b.photos || []).slice(0, 3); const L = (b.lines || []).filter((l) => typeof l === 'string' && l.trim()).slice(0, 3);
  if (!P.length || !L.length) return raw('');
  return html`<div class="pin" id="pin"><div class="stage"><div class="imgs" id="pimgs">${raw(P.map((p, i) => `<div class="ph ${i ? '' : 'on'}" style="${lq(p)}">${pic(p, { sizes: '(min-width:1024px) 45vw, 92vw' }).s}</div>`).join(''))}</div><div><div class="step" id="pstep">${raw(L.map(() => '<i><b></b></i>').join(''))}</div><p class="say" id="psay">${raw(L.map((l, i) => `<span data-s="${i}">${esc(l)} </span>`).join(''))}</p></div></div></div>`;
}
function looks(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const Lk = c.looks || []; if (!Lk.length) return raw('');
  return html`<section id="looks"><div class="sh rv"><span class="pill glass">${sec.eyebrow || c.site.trade.items}</span><h2 id="lh">${sec.heading || LH[x.trade] || LH.makeup}</h2></div><div class="grid" id="grid">${raw(Lk.map((l, i) => html`<a class="card rv" style="--i:${i};--d:${(i % 2) * 0.1}s" href="${href(x.lookHref(l.slug))}" data-i="${i}"><div class="ph" style="${lq(l.cover)}">${pic(l.cover, { sizes: '(min-width:1024px) 24vw, 46vw' })}</div>${heartBtn(i, 'glass', l.slug)}${l.has_video ? html`<span class="vidtag glass" data-over>${PLAY_SVG} Film</span>` : ''}<div class="cap glass" data-over><div class="nm">${l.title}</div>${l.from_price ? html`<div class="pr">From ${l.from_price}</div>` : ''}</div></a>`.s).join(''))}</div></section>`;
}
function collections(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const C = c.collections || []; if (!C.length) return raw('');
  return html`<section id="collections"><div class="sh rv"><span class="pill glass">${sec.eyebrow || 'Collections'}</span><h2>${sec.heading || 'Four moods'}</h2></div><div class="rail" id="rail">${raw(C.map((k, i) => html`<a class="coll glass rv" style="--d:${(i * 0.1).toFixed(1)}s" href="${href(x.collectionHref(k.slug))}"><div class="ph" style="${lq(k.cover)}">${pic(k.cover, { sizes: '72vw' })}</div><div class="cap"><b>${k.name}</b><span>${k.look_slugs.length} ${c.site.trade.items.toLowerCase()}</span></div></a>`.s).join(''))}</div></section>`;
}
function reviews(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const q = quotes(c.testimonials || []); if (!q.s) return raw(''); const n = (c.testimonials || []).filter((t) => t.words && t.words.trim()).length;
  return html`<section id="reviews"><div class="revp glass rv"><span class="pill" style="padding-left:0;color:var(--mute)">${sec.eyebrow || 'Client reviews'}</span><div id="qwrap" style="margin-top:10px">${q}</div>${n > 1 ? html`<div class="qnav"><button id="qPrev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button id="qNext" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button><span id="qCt">1 / ${n}</span></div>` : ''}</div></section>`;
}
function pricing(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const P = (c.packages || []).filter((p) => p.name); if (!P.length) return raw(''); const note = s(c.site.copy?.pricing_note);
  return html`<section id="pricing"><div class="sh rv"><span class="pill glass">${sec.eyebrow || 'Pricing'}</span><h2>${sec.heading || 'Starting from'}</h2></div><div class="price" id="price">${raw(P.map((p, i) => `<div class="row glass rv" style="--d:${(i * 0.08).toFixed(2)}s"><span class="n">${esc(p.name)}</span><span class="v">${typeof p.total === 'number' ? 'From ' + rs(p.total) : 'Ask for a quote'}</span></div>`).join(''))}${note ? html`<p class="note rv">${note}</p>` : ''}</div></section>`;
}
function studio(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const copy = c.site.copy || {}; const p = (copy.studio_photo || null) as Photo | null; const lead = s(copy.studio_heading), body = s(copy.studio_body); if (!lead && !body) return raw('');
  return html`<section id="story"><div class="story">${p ? html`<div class="ph rv" id="storyPh" style="${lq(p)}">${pic(p, { sizes: '(min-width:1024px) 45vw, 92vw' })}</div>` : ''}<div><span class="pill glass rv">${sec.eyebrow || 'The studio'}</span>${lead ? html`<p class="lead rv" id="sl">${lead}</p>` : ''}${body ? html`<p class="rv" id="sp">${body}</p>` : ''}</div></div></section>`;
}
function faq(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const F = c.faq || []; if (!F.length) return raw('');
  return html`<section id="faq"><div class="sh rv"><span class="pill glass">${sec.eyebrow || 'Questions'}</span><h2>${sec.heading || 'Before you ask'}</h2></div><div class="faq" id="faql">${raw(F.map((f) => html`<div class="fq rv"><button>${f.question}<span class="pm"></span></button><div class="ans"><div><p>${f.answer}</p></div></div></div>`.s).join(''))}</div></section>`;
}
function enquire(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const line = s(c.site.copy?.enquire_line) || 'Ask about your date';
  return html`<footer><div class="askp glass rv"><span class="pill" style="padding-left:0;color:var(--mute)">Enquire</span><span class="t">${line}</span><a class="glow" href="${href(x.dateHref)}" data-eliza><span>Begin</span><span>→</span></a></div>
  <div class="fname gtx rv" data-fill="220">${x.name}</div><div class="flinks">${c.looks?.length ? html`<a class="pill glass" href="#looks">${c.site.trade.items}</a>` : ''}${c.packages?.length ? html`<a class="pill glass" href="#pricing">Pricing</a>` : ''}${x.instagram ? html`<a class="pill glass" href="${href(x.instagram)}" rel="noopener">Instagram</a>` : ''}${c.enquire_link ? html`<a class="pill glass" href="${href(c.enquire_link)}" rel="noopener">WhatsApp</a>` : ''}</div>${c.site.credit ? html`<div class="credit">Made with The Dream Wedding</div>` : ''}</footer>`;
}
const DRAW: Record<string, (c: SiteCard, x: StyleCtx, s: Section) => Raw> = { cover, band, looks, collections, reviews, pricing, studio, faq, enquire };

export const aurora = {
  id: 'aurora',
  header(c: SiteCard, x: StyleCtx): Raw {
    return html`<div class="wash" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<header class="hd glass" id="hd">
 <div class="l"><button class="ib" data-menu aria-label="Menu" style="padding:0 8px"><svg viewBox="0 0 24 24"><path d="M4 9h16M4 15h10"/></svg><span class="ml">Menu</span></button><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button></div>
 <a class="wm" href="#top"><span class="wmt">${x.name}</span><span class="mono">${x.mono}</span></a>
 <div class="r"><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button><a class="enq" href="${href(x.dateHref)}" data-eliza>Enquire</a></div>
</header>`;
  },
  body(c: SiteCard, x: StyleCtx): Raw { return html`<main id="top">${raw(c.site.sections.map((sec) => (DRAW[sec.key] ? DRAW[sec.key](c, x, sec).s : '')).join('\n'))}</main>`; },
  over: ['.card .cap', '.card .vidtag'],
};
