// lib/site/look.ts · WEB-5 · a look's own page: the approved look page (tools/site_port/engine.js :68-69 and openLook
// :112-122; Couture's own, couture.html :451-457 and :640-660) drawn on the server from WEB-4's look door, as the page
// itself (open, full screen), so a direct visit and a shared link land on it. Back goes to her home.
import { html, raw, href, type Raw } from './html';
import { pic, lq, heartBtn, prepareLq } from './parts';
import { previewQuery, type SiteCard, type Photo, type LookSummary, type Preview } from './card';

export type Look = { slug: string; title: string; category?: string | null; year_label?: string | null; description?: string | null; included?: string[]; from_price?: string | null;
  package?: { name: string } | null; credits?: { role: string; name: string | null; handle: string | null }[]; videos?: { kind: string; url: string; duration_s?: number | null; title?: string | null }[];
  photos?: Photo[]; related?: LookSummary[]; seo?: { title?: string | null; description?: string | null; image?: string | null } };

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
export async function fetchLook(code: string, slug: string, preview: Preview = null): Promise<Look | null> {
  try {
    const r = await fetch(`${API}/api/v2/public/vendor-card/${encodeURIComponent(code)}/look/${encodeURIComponent(slug)}${previewQuery(preview)}`, preview ? { cache: 'no-store' } : { next: { revalidate: 300 } });
    if (!r.ok) return null; const j = await r.json(); return j && j.ok && j.look ? (j.look as Look) : null;
  } catch { return null; }
}
const ROLE: Record<string, string> = { outfit: 'Outfit', jewellery: 'Jewellery', photograph: 'Photograph', photography: 'Photograph', makeup: 'Makeup', venue: 'Venue', decor: 'Décor' };
const roleName = (r: string) => ROLE[r] || (r ? r[0].toUpperCase() + r.slice(1) : '');

export async function lookBody(card: SiteCard, L: Look, o: { base: string; dateHref: string; lookHref: (s: string) => string; vendorHref: (h: string) => string; name: string }): Promise<{ body: Raw; hero: Photo | null }> {
  const photos = (L.photos || []).filter((p) => p && p.url).slice(0, 12); const hero = photos[0] || null;
  await prepareLq([...photos.map((p) => p.url), ...(L.related || []).map((r) => r.cover?.url)]);
  const ask = card.enquire_link ? `${card.enquire_link}${card.enquire_link.includes('?') ? '&' : '?'}text=${encodeURIComponent(`Hello ${o.name}, I would like to ask about "${L.title}" for my wedding.`)}` : '';
  const strip = raw(photos.map((p, i) => `<div class="ph" style="${lq(p)}">${pic(p, i === 0 ? { hero: true, sizes: '(min-width:1024px) 30vw, 100vw' } : { sizes: '(min-width:1024px) 30vw, 100vw' }).s}</div>`).join(''));
  const dots = raw(photos.map((_, j) => `<i class="${j ? '' : 'on'}"></i>`).join(''));
  const inc = (L.included || []).filter(Boolean); const cred = (L.credits || []).filter((c) => c.name);
  const rel = (L.related || []).slice(0, 5); const items = card.site.trade.items; const item = card.site.trade.item;
  if (card.site.style === 'couture') {
    return { hero, body: html`<div class="lp on" id="lp" role="main">
  <div class="top" id="lpTop"><a class="ib caps" id="lpBack" href="${href(o.base)}"><svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.4"><path d="M15 5l-7 7 7 7"/></svg>Back</a>${heartBtn(0, '', L.slug)}</div>
  <div class="wrap"><div class="gal"><div class="strip" id="strip">${strip}</div><div class="dots" id="gDots">${dots}</div><div class="ctr" id="gCtr">1 / ${photos.length}</div></div>
    <div class="body" id="lpBody"><span class="caps crumb">${items}${L.category ? html` / ${L.category}` : ''}</span><h1>${L.title}</h1>${L.from_price ? html`<div class="from">From ${L.from_price}</div>` : ''}${L.description ? html`<p class="desc">${L.description}</p>` : ''}
   ${ask ? html`<a class="btn btn-k" id="reqBtn" href="${href(ask)}" target="_blank" rel="noopener">${card.site.trade.request}<span class="ar">→</span></a>` : ''}
   ${card.date_check_enabled ? html`<a class="btn btn-o" href="${href(o.dateHref)}" data-eliza>Check your date</a>` : ''}
   ${inc.length ? html`<details open style="margin-top:28px"><summary class="caps" style="cursor:pointer;padding:10px 0">What's included</summary><ul class="inc">${raw(inc.map((x) => html`<li>${x}</li>`.s).join(''))}</ul></details>` : ''}
   ${cred.length ? html`<div class="caps" style="padding:10px 0">Credits</div><div class="cred"><ul>${raw(cred.map((c) => html`<li><span>${roleName(c.role)}</span>${c.handle ? html`<a href="${href(o.vendorHref(c.handle))}">${c.name}</a>` : html`<b>${c.name}</b>`}</li>`.s).join(''))}</ul></div>` : ''}
   ${rel.length ? html`<div class="also"><div class="caps" style="margin-bottom:14px">Complete the ${item}</div><div class="rail" style="padding:0">${raw(rel.map((r) => html`<a class="coll" href="${href(o.lookHref(r.slug))}"><div class="ph" style="${lq(r.cover)}">${pic(r.cover, { sizes: '40vw' })}</div><div class="cap"><b style="font-size:15px">${r.title}</b></div></a>`.s).join(''))}</div></div>` : ''}</div></div>
</div>` };
  }
  return { hero, body: html`<div class="lp on" id="lp" role="main"><div class="top" id="lpTop"><a class="back" id="lpBack" href="${href(o.base)}"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><span>Back</span></a><span id="lpHeartSlot">${heartBtn(0, 'lph', L.slug)}</span></div>
 <div class="wrap"><div class="gal"><div class="strip" id="strip">${strip}</div><div class="dots" id="gDots">${dots}</div><div class="ctr" id="gCtr">1 / ${photos.length}</div></div><div class="body" id="lpBody"><span class="crumb">${items}${L.category ? html` / ${L.category}` : ''}</span><h1 class="lpt">${L.title}</h1>${L.from_price ? html`<div class="from">From ${L.from_price}</div>` : ''}${L.description ? html`<p class="desc">${L.description}</p>` : ''}
  ${ask ? html`<a class="btn btn-main" href="${href(ask)}" target="_blank" rel="noopener"><span>${card.site.trade.request}</span><span class="ar">→</span></a>` : ''}
  ${card.date_check_enabled ? html`<a class="btn btn-alt" href="${href(o.dateHref)}" data-eliza><span>Check your date</span></a>` : ''}
  ${inc.length ? html`<div class="blk"><div class="bh">What's included</div><ul class="inc">${raw(inc.map((x) => html`<li>${x}</li>`.s).join(''))}</ul></div>` : ''}
  ${cred.length ? html`<div class="blk"><div class="bh">Credits</div><ul class="cred">${raw(cred.map((c) => html`<li><span>${roleName(c.role)}</span>${c.handle ? html`<a href="${href(o.vendorHref(c.handle))}">${c.name}</a>` : html`<b>${c.name}</b>`}</li>`.s).join(''))}</ul></div>` : ''}
  ${rel.length ? html`<div class="blk also"><div class="bh">Complete the ${item}</div><div class="arail">${raw(rel.map((r) => html`<a class="acard" href="${href(o.lookHref(r.slug))}"><div class="ph" style="${lq(r.cover)}">${pic(r.cover, { sizes: '40vw' })}</div><b>${r.title}</b></a>`.s).join(''))}</div></div>` : ''}</div></div></div>` };
}
