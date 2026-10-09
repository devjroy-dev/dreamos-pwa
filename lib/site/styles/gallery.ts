// lib/site/styles/gallery.ts · WEB-5 · Gallery on the server: the approved rendition's markup
// (tools/site_port/gallery.html, body :121-137 and STYLE.render :143-153), filled from the card.
// The words that belong to the STYLE (its default section titles, "Scroll to enter") are WEB-3's, cited; every word
// that belongs to HER comes from the card. A section she hides is not drawn; her order is the card's order.
import { html, raw, href, type Raw } from '../html';
import { pic, lq, heartBtn, quotes, rs, PLAY_SVG, HEART_SVG, lines, quoteLink } from '../parts';
import type { SiteCard, Section } from '../card';
import { shopSection, type CardWithShop } from '../shop';
import type { StyleCtx } from './index';

// gallery.html:141 (heads) and :147 (the exhibition's title per trade): the style's own defaults.
const LOOKS_HEAD: Record<string, string> = { makeup: 'The exhibition', photo: 'The exhibition', performer: 'The programme', planner: 'The exhibition' };
const s = (x: unknown): string => (typeof x === 'string' ? x : '');

function cover(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const slide = (c.site.cover || [])[0] || null; const ph = slide?.photo || null; const copy = c.site.copy || {};
  // WEB-8 (MERGED): the prototype's wall label names a look (its name in italics, its year, then the medium). When the cover slide points at a look, that look is named; otherwise the eyebrow stands as before.
  const lk = slide?.target?.kind === 'look' ? (c.looks || []).find((l) => l.slug === slide.target?.ref) : null; const medium = s(slide?.eyebrow).replace(/^No\.\s*\d+\s*·\s*/, '');
  const wall = lk ? html`<i>${lk.title}</i>${lk.year_label ? `, ${lk.year_label}` : ''}${medium ? html`<br>${medium}` : ''}` : null;
  return html`<div class="enter" id="enter"><div class="stage">
  <div class="head" id="ehead"><h1 class="fitlines in" id="eh1"><span class="ln"><span>${x.name}</span></span></h1><p id="ep">${s(copy.intro)}</p></div>
  <div class="big" id="big"><div class="hang rv in" id="bigh"><div class="frame" id="bigf"><div class="ph" id="bigph" style="${lq(ph, x.coverLq)}">${pic(ph, { hero: true, sizes: '(min-width:1024px) 100vw, 100vw' })}</div></div></div></div>
  <div class="foot" id="efoot"><div class="hint" id="hint"><i></i>Scroll to enter</div><div class="wl lbl" id="ewl">${slide?.headline ? html`<b>${slide.headline}</b>` : ''}${wall || slide?.eyebrow || ''}</div></div>
  <div class="over" id="over" data-over><span class="lbl" style="color:rgba(255,255,255,.8)" id="ok">${slide?.eyebrow || ''}</span><h2 id="oh">${slide?.headline || x.name}</h2><a class="btn" href="#looks"><span id="ob">${slide?.button || c.site.trade.items}</span><span class="ar">→</span></a></div>
 </div></div>`;
}
function looks(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const L = c.looks || []; if (!L.length) return raw('');
  return html`<section id="looks"><div class="sh rv"><div><span class="lbl">${sec.eyebrow || c.site.trade.items}</span><h2 id="lh">${sec.heading || LOOKS_HEAD[x.trade] || LOOKS_HEAD.makeup}</h2></div><span class="lbl" id="lcount">${L.length} works</span></div><div class="ex" id="ex">${raw(L.map((l, i) => html`<a class="card" href="${href(x.lookHref(l.slug))}" data-i="${i}"><div class="frame hang rv"><div class="ph" style="${lq(l.cover)}">${pic(l.cover, { sizes: '(min-width:1024px) 34vw, 80vw' })}</div><span class="vidtag" data-over>${PLAY_SVG}</span></div>
   <div class="row1" style="width:var(--w)"><div class="lbl rv"><span class="no">No. ${String(i + 1).padStart(2, '0')}</span><b><i>${l.title}</i>${l.year_label ? html`, ${l.year_label}` : ''}</b>${l.category || ''}${l.from_price ? html`<br>From ${l.from_price}` : ''}</div>${heartBtn(i, '', l.slug)}</div></a>`.s).join(''))}</div></section>`;
}
function collections(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const C = c.collections || []; if (!C.length) return raw('');
  const n = C.length, pad = (k: number) => String(k).padStart(2, '0');
  return html`<div class="side" id="side"><div class="stage"><div class="t"><span class="lbl">${sec.eyebrow || 'Collections'}</span><h2>${sec.heading || 'On the wall this season'}</h2></div><div class="wire"></div><div class="track" id="track">${raw(C.map((k) => html`<a class="hung" href="${href(x.collectionHref(k.slug))}"><div class="frame"><div class="ph" style="${lq(k.cover)}">${pic(k.cover, { sizes: '(min-width:1024px) 24vw, 58vw' })}</div></div><div class="lbl"><b>${k.name}</b>${k.look_slugs.length} ${c.site.trade.items.toLowerCase()}</div></a>`.s).join(''))}</div><div class="count"><span id="cn">01</span><span class="bar"><b id="cbar"></b></span><span>${pad(n)}</span></div></div></div>`;
}
function reviews(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const q = quotes(c.testimonials || []); if (!q.s) return raw('');
  const n = (c.testimonials || []).filter((t) => t.words && t.words.trim()).length;
  return html`<section id="reviews"><div class="rev"><span class="lbl rv">${sec.eyebrow || 'Wall text · Client reviews'}</span><div id="qwrap" style="margin-top:14px">${q}</div>${n > 1 ? html`<div class="qnav"><button id="qPrev">Previous</button><button id="qNext">Next</button><span id="qCt" class="lbl">1 / ${n}</span></div>` : ''}</div></section>`;
}
// WEB-8 C2 (MERGED): "Ask for a quote" is a real control (parts.ts quoteLink): her WhatsApp with the package named, opened in the enquiry panel when it runs.
function pricing(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const P = (c.packages || []).filter((p) => p.name); if (!P.length) return raw('');
  const note = s(c.site.copy?.pricing_note);
  return html`<section id="pricing"><div class="sh rv"><div><span class="lbl">${sec.eyebrow || 'Catalogue'}</span><h2>${sec.heading || 'Starting from'}</h2></div></div><div class="cat" id="price">${raw(P.map((p, i) => `<div class="row rv" style="--d:${(i * 0.08).toFixed(2)}s"><span class="no">${String(i + 1).padStart(2, '0')}</span><span class="n">${html`${p.name}`.s}</span>${typeof p.total === 'number' ? `<span class="v">${'From ' + rs(p.total)}</span>` : quoteLink(c, p.name, 'Ask for a quote')}</div>`).join(''))}${note ? html`<p class="note rv">${note}</p>` : ''}</div></section>`;
}
function studio(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const copy = c.site.copy || {}; const ph = (copy.studio_photo || null) as never; const lead = s(copy.studio_heading), body = s(copy.studio_body);
  if (!lead && !body) return raw('');
  return html`<section id="story"><div class="story">${ph ? html`<div class="frame hang rv" id="storyF"><div class="ph" id="storyPh" style="${lq(ph)}">${pic(ph, { sizes: '(min-width:1024px) 40vw, 72vw' })}</div></div>` : ''}<div><span class="lbl rv">${sec.eyebrow || 'The studio'}</span>${lead ? html`<p class="lead rv" id="sl">${lead}</p>` : ''}${body ? html`<p class="rv" id="sp">${body}</p>` : ''}</div></div></section>`;
}
function faq(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const F = c.faq || []; if (!F.length) return raw('');
  return html`<section id="faq"><div class="sh rv"><div><span class="lbl">${sec.eyebrow || 'Questions'}</span><h2>${sec.heading || 'Before you ask'}</h2></div></div><div class="faq" id="faql">${raw(F.map((f) => html`<div class="fq rv"><button>${f.question}<span class="pm"></span></button><div class="ans"><div><p>${f.answer}</p></div></div></div>`.s).join(''))}</div></section>`;
}
function enquire(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const line = s(c.site.copy?.enquire_line) || 'Ask about your date';
  return html`<footer><a class="ask rv" href="${href(x.dateHref)}" data-eliza><span class="t">${line}</span><span class="go">→</span></a><div class="fname rv" data-fill="200">${x.name}</div><div class="fl">${c.looks?.length ? html`<a href="#looks">${c.site.trade.items}</a>` : ''}${c.collections?.length ? html`<a href="#side">Collections</a>` : ''}${c.packages?.length ? html`<a href="#pricing">Pricing</a>` : ''}${x.instagram ? html`<a href="${href(x.instagram)}" rel="noopener">Instagram</a>` : ''}${c.enquire_link ? html`<a href="${href(c.enquire_link)}" rel="noopener">WhatsApp</a>` : ''}</div>${c.site.credit ? html`<div class="credit">Made with The Dream Wedding</div>` : ''}</footer>`;
}
const DRAW: Record<string, (c: SiteCard, x: StyleCtx, s: Section) => Raw> = { cover, looks, collections, reviews, pricing, studio, faq, enquire, band: () => raw(''),
  // CE-47 OFF-A2: the off-season shop, in this style's own section head (lib/site/shop.ts).
  shop: (c, _x, sec) => shopSection('gallery', (c as CardWithShop).shop || [], sec, (c as CardWithShop).shop_base || '') };

export const gallery = {
  id: 'gallery',
  /** gallery.html:121-125, the header. */
  header(c: SiteCard, x: StyleCtx): Raw {
    return html`<header class="hd" id="hd">
 <div class="l"><button class="ib" data-menu aria-label="Menu"><span class="ml">Menu</span></button><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button></div>
 <a class="wm" href="#top"><span class="wmt">${x.name}</span><span class="mono">${x.mono}</span></a>
 <div class="r"><button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n" data-hc>0</span></button><a class="enq" href="${href(x.dateHref)}" data-eliza>Enquire</a></div>
</header>`;
  },
  body(c: SiteCard, x: StyleCtx): Raw {
    return html`<main id="top">${raw(c.site.sections.map((sec) => (DRAW[sec.key] ? DRAW[sec.key](c, x, sec).s : '')).join('\n'))}</main>`;
  },
  /** STYLE.over, gallery.html:140: text laid on a photograph on purpose (declared above with data-over in the markup). */
  over: ['.over', '.card .vidtag'],
};
void lines;
