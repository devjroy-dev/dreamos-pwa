// lib/site/styles/couture.ts · WEB-5 · Couture on the server: the approved rendition's markup
// (tools/site_port/couture.html, body :359-449 and build() :541-574), filled from the card.
// Couture carries its own base (it is not on engine.css); its drawer, heart count and wordmark are its own markup.
// The style's own words (default titles per trade, "Scroll", "Client reviews") are WEB-3's, cited; her words are the card's.
import { html, raw, href, esc, type Raw } from '../html';
import { heartBtn, quotes, rs, HEART_SVG, PLAY_SVG, lq } from '../parts';
import { at, srcset, pos } from '../img';
import type { SiteCard, Section, Photo } from '../card';
import type { StyleCtx } from './index';

// couture.html:491-517, per trade: the "new in" pair and the collections title (the style's defaults).
const NEWK: Record<string, [string, string]> = { makeup: ['New in', 'Looks for the winter season'], photo: ['Latest', 'Recent weddings and stories'], performer: ['New', 'Acts for the season'], planner: ['Recent', 'Weddings we planned this year'] };
const COLLH: Record<string, string> = { makeup: 'Four ways to begin', photo: 'Stories by place and hour', performer: 'Sets for every evening', planner: 'Where we have planned' };
const s = (x: unknown): string => (typeof x === 'string' ? x : '');
const arr = (x: unknown): string[] => (Array.isArray(x) ? x.filter((v) => typeof v === 'string' && v.trim()) as string[] : []);
/** couture.html:614 lines(): two lines when more than three words, delays .08 and .17. */
const lines = (t: string): Raw => { const w = t.split(' '); const h = Math.ceil(w.length / 2); const L = w.length > 3 ? [w.slice(0, h).join(' '), w.slice(h).join(' ')] : [t];
  return raw(L.map((l, i) => `<span class="ln"><span style="transition-delay:${(0.08 + i * 0.09).toFixed(2)}s">${esc(l)}</span></span>`).join('')); };
/** couture.html:488 pic() and :489 ph(): class a/b, the hero first, the rest deferred until the first is on screen. */
function img(p: Photo | null | undefined, cls: string, mode: 'hero' | 'defer' | 'lazy', sizes = '100vw', extra = ''): Raw {
  if (!p || !at(p.url, 480)) return raw('');
  if (mode === 'hero') return html`<img class="${cls}" alt="" decoding="async" fetchpriority="high" src="${at(p.url, 480)}" data-upgrade="${srcset(p.url)}" data-sizes="${sizes}"${raw(extra)} style="object-position:${pos(p)}">`;
  if (mode === 'defer') return html`<img class="${cls}" alt="" decoding="async" data-src="${at(p.url, 960)}" data-srcset="${srcset(p.url)}" sizes="${sizes}"${raw(extra)} style="object-position:${pos(p)}">`;
  return html`<img class="${cls}" alt="" decoding="async" loading="lazy" data-src="${at(p.url, 960)}" data-srcset="${srcset(p.url)}" sizes="${sizes}" style="object-position:${pos(p)}">`;   // waits for the cover (parts.ts pic)
}
const ph = (p: Photo | null | undefined, extra: Raw | string = '', sizes = '(min-width:1024px) 30vw, 66vw'): Raw => html`<div class="ph" style="${lq(p)}">${img(p, 'a', 'lazy', sizes)}${extra}</div>`;

function cover(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const slides = (c.site.cover || []).filter((sl) => sl.photo).slice(0, 3); const cats = arr(c.site.copy?.categories);
  const first = slides[0];
  return html`<div class="cover" id="cover">
    <div id="slides">${raw(slides.map((sl, i) => { const p = sl.photo as Photo; const d = html` data-kick="${sl.eyebrow || ''}" data-h="${sl.headline || ''}" data-cta="${sl.button || ''}"`.s;
      return `<div class="slide ${i ? '' : 'on drift'}"${d}><picture><source media="(min-width:1024px)" srcset="${esc(at(p.url, 1600))}">${img(p, '', i ? 'defer' : 'hero', '100vw', ` data-dpos="${esc(pos(p, true))}"`).s.replace('style="object-position:', `style="--dp:${esc(pos(p, true))};object-position:`)}</picture></div>`; }).join(''))}</div>
    <nav class="cats caps" id="cats" data-over><span class="bar" id="catBar"></span>${raw(cats.map((k, i) => html`<a href="#looks" class="${i ? '' : 'on'}">${k}</a>`.s).join(''))}</nav>
    <div class="segs" id="segs" data-over>${raw(slides.map((_, i) => `<button aria-label="Cover ${i + 1}"><i></i></button>`).join(''))}</div>
    <div class="copy in" id="copy" data-over>
      <div class="who caps" id="who">${x.name}</div>
      <span class="play" aria-hidden="true">${PLAY_SVG}</span>
      <span class="kick caps"><span id="kick">${first?.eyebrow || ''}</span></span>
      <h1 class="h1" id="h1">${lines(first?.headline || x.name)}</h1>
      ${first?.button ? html`<a class="btn btn-w" href="#looks" id="cta"><span id="ctaT">${first.button}</span><span class="ar">→</span></a>` : ''}
    </div>
    <div class="cue" aria-hidden="true" data-over>Scroll</div>
  </div>`;
}
function looks(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const L = c.looks || []; if (!L.length) return raw(''); const d = NEWK[x.trade] || NEWK.makeup;
  return html`<section id="looks">
    <div class="shead rv"><div><span class="caps" id="newinK">${sec.eyebrow || d[0]}</span><h2 id="newinH">${sec.heading || d[1]}</h2></div><a class="more caps" href="#looks" id="viewAll">All ${c.site.trade.items.toLowerCase()}</a></div>
    <div class="grid" id="grid">${raw(L.map((l, i) => html`<a class="card" href="${href(x.lookHref(l.slug))}" data-i="${i}" style="--d:${(i % 2) * 0.12}s">
    <div class="ph" style="${lq(l.cover)}">${img(l.cover, 'a', 'lazy', '(min-width:1024px) 25vw, 50vw')}${img(l.second || null, 'b', 'lazy', '(min-width:1024px) 25vw, 50vw')}<span class="mask"></span></div>
    ${l.is_new ? html`<span class="tag" data-over>New</span>` : ''}
    ${l.has_video ? html`<span class="vid" data-over>${PLAY_SVG}${l.video_duration_s ? `${Math.floor(l.video_duration_s / 60)}:${String(l.video_duration_s % 60).padStart(2, '0')}` : ''}</span>` : ''}
    ${heartBtn(i, '', l.slug)}
    <div class="meta"><span class="caps" style="color:var(--mute)">${l.category || ''}</span><div class="nm">${l.title}</div>${l.from_price ? html`<div class="pr">From ${l.from_price}</div>` : ''}</div></a>`.s).join(''))}</div>
  </section>`;
}
function band(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  // WEB-4's band body (siteCard.js bodyOf): { lines[], words[], destinations[], photos[] }; the rolling words fall back to
  // the site's own (copy.rolling_words). The band's button goes to her collections (couture.html :396).
  const b = sec.body || {}; const w = arr(b.words).length ? arr(b.words) : arr(c.site.copy?.rolling_words);
  const p = ((Array.isArray(b.photos) && b.photos[0]) || null) as Photo | null;
  const roll = w.length && c.site.texture !== 'clean' ? html`<div class="roll" aria-hidden="true"><div id="roll">${raw((w.map((t, i) => (i % 2 ? `<span>${esc(t)}</span>` : esc(t))).join(' · ') + ' · ').repeat(3))}</div></div>` : '';
  const bandBox = p ? html`<div class="band" id="band">${img(p, '', 'lazy', '100vw', ' id="bandImg"')}<div class="in rv" data-over>${sec.eyebrow ? html`<span class="caps" id="bandK">${sec.eyebrow}</span>` : ''}${sec.heading ? html`<h3 id="bandH">${sec.heading}</h3>` : ''}${(c.collections || []).length ? html`<a class="btn btn-w" href="#collections"><span id="bandB">${s(b.button) || 'See the collection'}</span><span class="ar">→</span></a>` : ''}</div></div>` : '';
  return html`${roll}${bandBox}`;
}
function collections(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const C = c.collections || []; if (!C.length) return raw('');
  return html`<section id="collections">
    <div class="shead rv"><div><span class="caps">${sec.eyebrow || 'Collections'}</span><h2 id="collH">${sec.heading || COLLH[x.trade] || COLLH.makeup}</h2></div></div>
    <div class="rail" id="rail">${raw(C.map((k, i) => html`<a class="coll" href="${href(x.collectionHref(k.slug))}">${ph(k.cover, html`<span class="num" data-over>${String(i + 1).padStart(2, '0')}</span>`)}<div class="cap"><b>${k.name}</b><span class="caps" style="color:var(--mute)">${k.look_slugs.length} ${c.site.trade.items.toLowerCase()}</span></div></a>`.s).join(''))}</div>
    <div class="rail-foot caps"><span id="railN">01</span><div class="track"><div class="thumb" id="thumb"></div></div><span id="railT">${String(C.length).padStart(2, '0')}</span></div>
  </section>`;
}
function reviews(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const q = quotes(c.testimonials || []); if (!q.s) return raw(''); const n = (c.testimonials || []).filter((t) => t.words && t.words.trim()).length;
  // WEB-8 (MERGED): the prototype's video review block, drawn from the first review that carries a video; the counter starts empty as the prototype's does.
  const tv = (c.testimonials || []).find((t) => t.video && t.video.url); const d = tv?.video?.duration_s || 0; const poster = tv?.video?.poster ? { url: tv.video.poster } as Photo : null;
  const vt = tv && tv.video ? html`<a class="vt rv" href="${tv.video.url}" target="_blank" rel="noopener"><div class="ph" id="vtPh" style="${lq(poster)}">${img(poster, 'a', 'lazy', '76px')}<span class="pl"><i><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></i></span></div><div><span class="caps">Video${d ? ` · ${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}` : ''}</span>${tv.video.title ? html`<div class="serif" style="font-size:18px;margin-top:6px">${tv.video.title}</div>` : ''}</div></a>` : raw('');
  return html`<section id="reviews">
    <div class="rev">
      <span class="caps rv">${sec.eyebrow || 'Client reviews'}</span>
      <span class="qmark rv" aria-hidden="true"></span>
      <div class="qwrap" id="qwrap">${raw(q.s.replace(/<div class="by">/g, '<div class="by caps">'))}</div>
      ${n > 1 ? html`<div class="qnav"><button id="qPrev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button id="qNext" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button><span class="caps ct" id="qCt"></span></div>` : ''}
      ${vt}
    </div>
  </section>`;
}
function pricing(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const P = (c.packages || []).filter((p) => p.name); if (!P.length) return raw(''); const note = s(c.site.copy?.pricing_note);
  return html`<section id="pricing">
    <div class="shead rv"><div><span class="caps">${sec.eyebrow || 'Pricing'}</span><h2>${sec.heading || 'Starting from'}</h2></div></div>
    <div class="price" id="price">${raw(P.map((p, i) => `<div class="row rv" style="--d:${(i * 0.08).toFixed(2)}s"><span class="n">${esc(p.name)}</span><span class="dots"></span><span class="v">${typeof p.total === 'number' ? 'From ' + rs(p.total) : 'Ask for a quote'}</span></div>`).join(''))}${note ? html`<p class="note rv">${note}</p>` : ''}</div>
  </section>`;
}
function studio(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const copy = c.site.copy || {}; const p = (copy.studio_photo || null) as Photo | null; const lead = s(copy.studio_heading), body = s(copy.studio_body);
  if (!lead && !body) return raw('');
  return html`<section id="story">
    <div class="story">
      ${p ? html`<div class="ph rv" id="storyPh" style="${lq(p)}">${img(p, 'a', 'lazy', '(min-width:1024px) 45vw, 100vw')}</div>` : ''}
      <div>
        <span class="caps rv">${sec.eyebrow || 'The studio'}</span>
        ${lead ? html`<p class="lead rv" id="storyLead" style="margin-top:12px">${lead}</p>` : ''}
        ${body ? html`<p class="rv" style="margin-top:18px" id="storyP">${body}</p>` : ''}
      </div>
    </div>
  </section>`;
}
function faq(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const F = c.faq || []; if (!F.length) return raw('');
  return html`<section id="faq">
    <div class="shead rv"><div><span class="caps">${sec.eyebrow || 'Questions'}</span><h2>${sec.heading || 'Before you ask'}</h2></div></div>
    <div class="faq" id="faqL">${raw(F.map((f) => html`<div class="fq rv"><button>${f.question}<span class="pm"></span></button><div class="ans"><div><p>${f.answer}</p></div></div></div>`.s).join(''))}</div>
  </section>`;
}
function enquire(c: SiteCard, x: StyleCtx, sec: Section): Raw {
  const line = s(c.site.copy?.enquire_line) || 'Ask about your date';
  return html`<footer>
    <a class="ask rv" href="${href(x.dateHref)}" data-eliza style="width:100%;text-align:left"><span id="askT">${line}</span><span class="ar"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
    <div class="bigwm rv" id="bigwm">${x.name}</div>
    <div class="fl caps">${c.looks?.length ? html`<a href="#looks" id="flLooks">${c.site.trade.items}</a>` : ''}${c.collections?.length ? html`<a href="#collections">Collections</a>` : ''}${c.packages?.length ? html`<a href="#pricing">Pricing</a>` : ''}${c.faq?.length ? html`<a href="#faq">FAQ</a>` : ''}${x.instagram ? html`<a href="${href(x.instagram)}" rel="noopener">Instagram</a>` : ''}${c.enquire_link ? html`<a href="${href(c.enquire_link)}" rel="noopener">WhatsApp</a>` : ''}</div>
    ${c.site.credit ? html`<div class="credit">Made with The Dream Wedding</div>` : ''}
  </footer>`;
}
const DRAW: Record<string, (c: SiteCard, x: StyleCtx, s: Section) => Raw> = { cover, looks, band, collections, reviews, pricing, studio, faq, enquire };

export const couture = {
  id: 'couture',
  header(c: SiteCard, x: StyleCtx): Raw {
    const tk = arr(c.site.copy?.announcements).slice(0, 4);
    return html`${tk.length ? html`<div class="ticker" aria-label="Studio notes"><div class="tk-track" id="tk">${raw([...tk, ...tk].map((t) => `<span>${esc(t)}</span>`).join(''))}</div></div>` : ''}
<header class="hd" id="hd">
  <div class="l">
    <button class="ib" id="menuBtn" data-menu aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg><span class="menu-lbl" id="menuLbl">Menu</span></button>
    <button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n"><b data-hc>0</b></span></button>
  </div>
  <a class="wm" href="#top" id="wm"><span class="full" id="wmFull">${x.name}</span><span class="mono" id="wmMono">${x.mono}</span></a>
  <div class="r">
    <button class="ib heart" data-hh aria-label="Saved">${HEART_SVG}<span class="n"><b data-hc>0</b></span></button>
    <a class="enq" href="${href(x.dateHref)}" data-eliza>Enquire</a>
  </div>
</header>`;
  },
  body(c: SiteCard, x: StyleCtx): Raw {
    return html`<main id="top">${raw(c.site.sections.map((sec) => (DRAW[sec.key] ? DRAW[sec.key](c, x, sec).s : '')).join('\n'))}</main>`;
  },
  /** couture.html:445-449, its own drawer (numberless, a caps foot). */
  drawer(nav: { label: string; href: string; eliza?: boolean }[], foot: { instagram?: string | null; whatsapp?: string | null; cities?: string | null }): Raw {
    return html`<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Menu">
  <button class="x caps" id="drawerX"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>Close</button>
  <nav id="dnav">${raw(nav.map((n, i) => `<a href="${esc(href(n.href))}" style="--i:${i}"${n.eliza ? ' data-eliza' : ''}>${esc(n.label)}</a>`).join(''))}</nav>
  <div class="foot caps">${foot.instagram ? html`<a href="${href(foot.instagram)}" rel="noopener">Instagram</a>` : ''}${foot.whatsapp ? html`<a href="${href(foot.whatsapp)}" rel="noopener">WhatsApp</a>` : ''}${foot.cities ? html`<span>${foot.cities}</span>` : ''}</div>
</aside>`;
  },
  /** couture.html:571: text laid on a photograph on purpose, declared in the markup above with data-over. */
  over: ['.copy', '.cats', '.segs', '.cue', '.band .in', '.card .tag', '.card .vid', '.coll .num'],
};
