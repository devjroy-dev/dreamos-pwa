// lib/site/doc.ts · WEB-5 · the styles site as ONE server-drawn document, no React on the page (CE-47 ruling B).
// Everything a Next page would have given is written here by hand and every value goes through html.ts:
// lang, charset, the viewport, title, description, canonical, Open Graph and Twitter tags from site.seo, theme-color
// from her palette, the icon. Then the first screen's needs in order: the cover's 480 preloaded at the highest
// priority, her display face preloaded by its exact file, her two faces and the style's CSS inline (no stylesheet
// request), the markup, the 400-byte release script, and the runtime (one cached file, deferred).
import { html, raw, esc, href, type Raw } from './html';
import { STYLES, ENGINE, type StyleCtx } from './styles';
import { paletteVars, palName } from './tokens';
import { facesFor, type Display } from './faces';
import { drawer, igUrl, tradeKey, prepareLq, type NavItem } from './parts';
import { at, lqData } from './img';
import { RT_SHA } from './rt.gen';
import type { SiteCard } from './card';
import { lookBody, type Look } from './look';
import { fetchShop, withShopSection, itemBody as shopItemBody, SHOP_CSS, SHOP_EYEBROW, type CardWithShop, type ShopItem } from './shop';
// WEB-7's file (lands beside this one in the integrator's tree): panelCardJson(card) and PANEL_BOOT.
import { panelCardJson, PANEL_BOOT, type PanelCard } from './enquirePanelBoot';

// The first screen's one script: when the cover has loaded, release every other photograph and THEN fetch the runtime
// (measured: the runtime's 23 KB, requested with the HTML, took the cover's bandwidth on Slow 3G).
const release = (rt: string, later: string) => `(function(){var d=document,h=d.querySelector('img[fetchpriority=high]'),done=0;function go(){if(done)return;done=1;var f=d.createElement('style');f.textContent=${JSON.stringify(later).replace(/</g, '\\u003c')};d.head.appendChild(f);d.querySelectorAll('img[data-src]').forEach(function(i){if(i.dataset.srcset){i.srcset=i.dataset.srcset;i.removeAttribute('data-srcset')}i.src=i.dataset.src;i.removeAttribute('data-src')});var s=d.createElement('script');s.src='${rt}';d.body.appendChild(s)}if(!h||h.complete)go();else{h.addEventListener('load',go,{once:true});h.addEventListener('error',go,{once:true});setTimeout(go,8000)}})();`;
const NAV: Record<string, (c: SiteCard) => string> = { shop: () => SHOP_EYEBROW, looks: (c) => c.site.trade.items, collections: () => 'Collections', journal: () => 'Journal', pricing: () => 'Pricing', studio: () => 'The studio', reviews: () => 'Client reviews', faq: () => 'Questions' };
const ANCHOR: Record<string, string> = { shop: '#shop', looks: '#looks', collections: '#collections', journal: '#journal', pricing: '#pricing', studio: '#story', reviews: '#reviews', faq: '#faq' };
const LAYER: Record<string, string> = { noir: 'grain', heritage: 'texture', riviera: 'sun', couture: 'roll' };
const COUTURE_FONT: Record<string, string> = { bodoni_inter_tight: 'a', cormorant_manrope: 'b', instrument_serif_sans: 'c' };

export type DocOpts = { code: string; base: string; api: string; display: Display; preview: boolean };
/** Her own subdomain is her canonical address (the founder, 1 Oct). The card's canonical is kept only when it is her own
 *  domain (Prestige); an apex /v/<handle> canonical gives way to her subdomain (o.base, publicUrlFor). */
function canonicalOf(c: string | null | undefined, base: string): string {
  try { if (c) { const u = new URL(c); if (u.protocol === 'https:' && !/(^|\.)thedreamwedding\.in$/i.test(u.hostname)) return c; } } catch { /* fall to base */ }
  return base;
}
type Page = { title: string; desc: string; canonical: string; image: string; hero: { url: string } | null; body: string; page: 'home' | 'look' | 'collection' | 'shop'; look?: string; lookTitle?: string };

/** The document around any page of her site: head, her faces, the style's CSS, the release script. */
function frame(card: SiteCard, o: DocOpts, x: StyleCtx, pg: Page): string {
  const st = card.site.style; const entry = STYLES[st];
  const f = facesFor(st, card.site.fonts, o.display, process.env.TDW_SITE_FACE_TIMING === 'after');
  const vars = { ...paletteVars(card.site.palette), ...f.vars, ...(entry.def.vars ? entry.def.vars(card) : {}) };
  const attrs: Record<string, string> = { lang: 'en', 'data-style': st, 'data-pal': palName(card.site.palette), 'data-trade': x.trade, 'data-motion': card.site.motion === 'cinematic' ? 'cinema' : card.site.motion, 'data-code': o.code, 'data-page': pg.page };
  if (pg.look) attrs['data-look'] = pg.look;
  if (LAYER[st]) attrs[`data-${LAYER[st]}`] = card.site.texture === 'clean' ? 'off' : 'on';            // her off switch is 'clean' (WEB-4 FINISH)
  let cls = card.site.motion === 'calm' ? 'calm' : card.site.motion === 'cinematic' ? 'cinema' : '';
  if (st === 'couture') { cls = 'm-' + (card.site.motion === 'cinematic' ? 'cinema' : card.site.motion); attrs['data-font'] = COUTURE_FONT[card.site.fonts?.id || ''] || 'a'; }
  if (cls) attrs.class = cls;
  attrs.style = Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
  const ground = card.site.palette?.roles?.ground || '';
  const hasShop = ((card as CardWithShop).shop || []).length > 0 || pg.page === 'shop';   // CE-47 OFF-A2: the shop's CSS only where it draws
  const css = (entry.ownBase ? '' : ENGINE + '\n') + entry.css + '\n' + entry.firstScreen + '\n' + LINK_AS_BUTTON + DISPLAY_TEXT + (hasShop ? '\n' + SHOP_CSS : '');
  const head: Raw = html`<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${pg.title}</title>${pg.desc ? html`<meta name="description" content="${pg.desc}">` : ''}<link rel="canonical" href="${href(pg.canonical)}">
${o.preview ? raw('<meta name="robots" content="noindex">') : ''}<meta property="og:type" content="website"><meta property="og:title" content="${pg.title}">${pg.desc ? html`<meta property="og:description" content="${pg.desc}">` : ''}<meta property="og:url" content="${href(pg.canonical)}">${pg.image ? html`<meta property="og:image" content="${pg.image}">` : ''}
<meta name="twitter:card" content="${pg.image ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${pg.title}">${pg.desc ? html`<meta name="twitter:description" content="${pg.desc}">` : ''}${pg.image ? html`<meta name="twitter:image" content="${pg.image}">` : ''}
${/^#[0-9a-f]{3,8}$/i.test(ground) ? html`<meta name="theme-color" content="${ground}">` : ''}<link rel="icon" href="/favicon.ico">
${pg.hero && at(pg.hero.url, 480) ? html`<link rel="preload" as="image" href="${at(pg.hero.url, 480)}" fetchpriority="high">` : ''}${f.preload ? html`<link rel="preload" as="font" type="font/woff2" href="${f.preload}" crossorigin>` : ''}
<noscript><style>.rv,.card{opacity:1!important;transform:none!important}.jaali{display:none!important}${raw(f.later.replace(/<\//g, '<\\/'))}</style></noscript><style>${raw(f.css.replace(/<\//g, '<\\/'))}</style><style>${raw(css.replace(/<\//g, '<\\/'))}</style>`;
  const htmlAttrs = Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
  // Eliza's enquiry panel (WEB-7): her card's panel data as inert JSON (no '<' can close it), and the panel's boot last.
  // WEB-8 (MERGED): WEB-7's panelCardJson takes its own PanelCard, not her whole card; the panel gets only the fields it reads.
  const lb = card.eliza?.live_booking, ov = card.eliza?.own_voice; const word = (v: unknown): 'not_in_plan' | 'coming_soon' | 'on' => (v === 'on' || v === 'coming_soon' ? v : 'not_in_plan');
  const pc: PanelCard = { code: o.code, handle: card.handle || '', studio_name: x.name, monogram: x.mono || undefined, category: card.category, date_check_enabled: card.date_check_enabled === true,
    eliza: { live_booking: word(lb), own_voice: word(ov) }, enquire_link: card.enquire_link, page: { kind: pg.page === 'shop' ? 'home' : pg.page, ...(pg.lookTitle ? { title: pg.lookTitle } : {}) }, api_base: o.api };
  const panel = `<script type="application/json" id="tdw-site-card">${String(panelCardJson(pc)).replace(/</g, '\\u003c')}</script>`;
  return `<!doctype html><html ${htmlAttrs}><head>${head.s}</head><body>${pg.body}<script>${release(`/site-rt/${RT_SHA}.js`, f.later)}</script>${panel}<script>${String(PANEL_BOOT).replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
}
// The prototypes' Enquire and "Ask" controls are <button>s that opened Eliza's panel in-page; on the live site they are
// links to her date page (Eliza's panel is WEB-7's), so they keep a button's centring (a <button> centres its content).
const LINK_AS_BUTTON = `a.enq{display:inline-flex;align-items:center;justify-content:center}a.pill[data-eliza]{display:inline-flex;align-items:center}:where(a[data-eliza]){text-align:center}`;   // WEB-8 (MERGED): a button centres its words only by default; :where keeps that default from beating a style's own alignment (Gallery's closing line is left-aligned)

// WEB-8 C2 (CE-47, the founder's walk): display text (her name, titles, eyebrows, menus, controls, prices) cannot be selected,
// so a tap on it does not raise the phone's search sheet; body copy (her about, look and review words, answers) stays
// selectable. A pricing row's quote link keeps its row's look. Nothing here moves a pixel.
const DISPLAY_TEXT = `h1,h2,h3,header,nav,.drawer,.caps,.lbl,.pill,.kick,.wm,.wmt,.ttl,.mono,.btn,.cats,.price .row,.cat .row,.rates .row,#price .row,.stampc,.pm,.ticker,a,button{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}:where(a.ask-q,a.ticker){color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent}`;   // :where adds no weight, so each style's own colour and layout for these keep winning

function ctx(card: SiteCard, o: DocOpts, coverLq: string): StyleCtx {
  return { name: card.site.site_name || card.business_name || '', mono: card.site.monogram || '', trade: tradeKey(card), instagram: igUrl(card.instagram_handle), coverLq,
    dateHref: `${o.base}/date`, lookHref: (s) => `${o.base}/${card.site.trade.items.toLowerCase()}/${encodeURIComponent(s)}`, collectionHref: (s) => `${o.base}/collections/${encodeURIComponent(s)}` };
}

export async function siteDocument(card0: SiteCard, o: DocOpts): Promise<string | null> {
  const st = card0.site.style; const entry = STYLES[st]; if (!entry) return null;
  // CE-47 OFF-A2: her shown shop items (OFF-A1's public door); the section sits at her 'shop' row, else before Enquire.
  const shop = await fetchShop(o.code, o.preview);
  const card: CardWithShop = { ...card0, shop, shop_base: o.base, site: { ...card0.site, sections: withShopSection(card0.site.sections, shop.length > 0) } };
  const cover = (card.site.cover || [])[0]?.photo || null;
  const band = card.site.sections.find((s) => s.key === 'band')?.body as { photos?: { url: string }[] } | undefined;
  await prepareLq([...(card.site.cover || []).map((c) => c.photo?.url), ...(card.looks || []).flatMap((l) => [l.cover?.url, l.second?.url]), ...(card.collections || []).map((k) => k.cover?.url),
    (card.site.copy?.studio_photo as { url?: string } | null)?.url, ...(band?.photos || []).map((p) => p.url)]);
  const x = ctx(card, o, await lqData(cover?.url));
  const anchor = (k: string) => (k === 'collections' && st === 'gallery' ? '#side' : ANCHOR[k]);
  // CE-47 OFF-A2: her own 'shop' row with nothing shown draws no menu line (and, its section empty, nothing at all).
  const nav: NavItem[] = card.site.sections.filter((s) => NAV[s.key] && (s.key !== 'shop' || shop.length > 0)).map((s) => ({ label: NAV[s.key](card), href: anchor(s.key) }));
  nav.push({ label: 'Enquire', href: x.dateHref, eliza: true });
  const body = entry.def.header(card, x).s + (entry.def.drawer || drawer)(nav, { instagram: x.instagram, whatsapp: card.enquire_link, cities: (card.site.copy?.cities as string) || card.city }).s + entry.def.body(card, x).s;
  const seo = card.site.seo || {};
  return frame(card, o, x, { title: seo.title || card.meta?.title || x.name, desc: seo.description || card.meta?.description || '', canonical: canonicalOf(seo.canonical, o.base),
    image: seo.image && /^https:\/\//.test(seo.image) ? seo.image : '', hero: cover, body, page: 'home' });
}

export async function lookDocument(card: SiteCard, look: Look, o: DocOpts & { vendorHref: (h: string) => string }): Promise<string | null> {
  if (!STYLES[card.site.style]) return null;
  const x = ctx(card, o, '');
  const { body, hero } = await lookBody(card, look, { base: o.base, dateHref: x.dateHref, lookHref: x.lookHref, vendorHref: o.vendorHref, name: x.name });
  const seo = look.seo || {}; const canonical = x.lookHref(look.slug);
  return frame(card, o, x, { title: `${seo.title || look.title} · ${x.name}`, desc: seo.description || '', canonical, image: seo.image && /^https:\/\//.test(seo.image) ? seo.image : '', hero, body: body.s, page: 'look', look: look.slug, lookTitle: look.title });
}

/** CE-47 OFF-A2 · an item's own page (/shop/<slug>): her style's header and drawer, the item, and Ask (or Buy, with INS's link). */
export async function shopItemDocument(card: SiteCard, item: ShopItem, o: DocOpts): Promise<string | null> {
  const entry = STYLES[card.site.style]; if (!entry) return null;
  const x = ctx(card, o, '');
  const nav: NavItem[] = [{ label: SHOP_EYEBROW, href: `${o.base}/#shop` }, { label: 'Enquire', href: x.dateHref, eliza: true }];
  // F-44.343 (CE-47, option b): on an item page the header is solid from the first paint, in every style. The shared runtime
  // (lib/site/rt/runtime.ts:81, WEB-8's) decides solid from scroll alone; WEB-8's change keeps it solid on data-page="shop".
  const header = entry.def.header(card, x).s.replace(/<header class="hd(?=[ "])/, '<header class="hd solid') + (entry.def.drawer || drawer)(nav, { instagram: x.instagram, whatsapp: card.enquire_link, cities: (card.site.copy?.cities as string) || card.city }).s;
  const body = shopItemBody(item, { base: o.base, api: o.api, code: o.code, studio: x.name, header });
  const canonical = `${o.base}/shop/${encodeURIComponent(item.slug)}`;
  return frame({ ...card, shop: [item] } as CardWithShop, o, x, { title: `${item.name} · ${x.name}`, desc: item.facts, canonical, image: item.photo_url && /^https:\/\//.test(item.photo_url) ? item.photo_url : '',
    hero: item.photo_url ? { url: item.photo_url } : null, body, page: 'shop' });
}
