// lib/site/shop.ts · CE-47 · OFF-A2 · THE OFF-SEASON SHOP ON HER WEBSITE (the OFF charter, Part A).
// Her shown items come from OFF-A1's public door (GET /api/v2/public/shop/<code>; 404 while the shop is shut or she has none
// shown). The section is drawn in each of the six styles with that style's OWN section head (each style's pricing() head,
// byte for byte in shape) and her palette's variables (--ink, --mute, --accent, --bg, --serif, --sans, --pad); no colour is
// typed here (R-42.6). Placed where her sections list puts a 'shop' row, else just before 'enquire'.
// An item's own page (/shop/<slug>) carries its picture, what is included, and Buy (with a payment link, once INS lands)
// or Ask (her name and phone; she is told on WhatsApp and marks it paid).
import { html, raw, href, esc, type Raw } from './html';
import { pic, lq } from './parts';
import { at } from './img';
import type { SiteCard, Section, Photo } from './card';

export type ShopItem = { kind: 'voucher' | 'workshop' | 'class' | 'booking'; name: string; slug: string; photo_url: string | null; price: number; price_words: string; includes: string[];
  facts: string; seats_left: number | null; sold_out: boolean; class_dates?: string[]; lead_days?: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
/** Thirty seconds, so seats left stay close to true; her preview is fetched uncached. */
export async function fetchShop(code: string, preview = false): Promise<ShopItem[]> {
  try {
    const r = await fetch(`${API_BASE}/api/v2/public/shop/${encodeURIComponent(code)}`, preview ? { cache: 'no-store' } : { next: { revalidate: 30 } });
    if (!r.ok) return [];
    const j = await r.json();
    return j && j.ok && Array.isArray(j.items) ? (j.items as ShopItem[]) : [];
  } catch { return []; }
}

export const SHOP_EYEBROW = 'Shop';
export const SHOP_HEADING = 'Gift vouchers and workshops';
/** A picture only from an https address; anything else is no picture, so no empty picture box is ever drawn. */
const photoOf = (u: string | null): Photo | null => (u && /^https:\/\//.test(u) ? { url: u } : null);

/** The style's own section head, as its pricing() draws it (lib/site/styles/<style>.ts). */
export function shopHead(style: string, sec: Section): Raw {
  const eb = sec.eyebrow || SHOP_EYEBROW; const h = sec.heading || SHOP_HEADING;
  if (style === 'couture') return html`<div class="shead rv"><div><span class="caps">${eb}</span><h2>${h}</h2></div></div>`;
  if (style === 'gallery') return html`<div class="sh rv"><div><span class="lbl">${eb}</span><h2>${h}</h2></div></div>`;
  if (style === 'aurora') return html`<div class="sh rv"><span class="pill glass">${eb}</span><h2>${h}</h2></div>`;
  return html`<div class="sh rv"><span class="caps">${eb}</span><h2>${h}</h2></div>`;   // noir, heritage, riviera
}
export const shopHref = (base: string, slug: string): string => `${base}/shop/${encodeURIComponent(slug)}`;

/** The section, or nothing when she has no shown item. An item with no picture is drawn text-only: no empty picture box
 *  (CE-47, 7 October 2026; a picture is not required). */
export function shopSection(style: string, items: ShopItem[], sec: Section, base: string): Raw {
  if (!items.length) return raw('');
  const cards = items.map((it, i) => {
    const p = photoOf(it.photo_url);
    return html`<a class="tdw-shop-card rv${style === 'aurora' ? ' glass' : ''}" style="--d:${(i * 0.08).toFixed(2)}s" href="${href(shopHref(base, it.slug))}">${p ? html`<div class="tdw-shop-ph" style="${lq(p)}">${pic(p, { sizes: '(min-width:1024px) 30vw, 46vw' })}</div>` : raw('')}
<div class="tdw-shop-tx"><span class="tdw-shop-nm">${it.name}</span><span class="tdw-shop-fa">${it.facts}</span><span class="tdw-shop-pr">${it.price_words}</span><span class="tdw-shop-go">${it.sold_out ? 'Sold out' : 'See more'}</span></div></a>`.s;
  }).join('');
  return html`<section id="shop">${shopHead(style, sec)}<div class="tdw-shop">${raw(cards)}</div></section>`;
}

/** One stylesheet for all six, every value from her palette's variables; Couture's own base has no engine CSS, so it rides here too. */
export const SHOP_CSS = `#shop{padding-left:var(--pad,20px);padding-right:var(--pad,20px)}
.tdw-shop{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media (min-width:1024px){.tdw-shop{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}}
.tdw-shop-card{display:flex;flex-direction:column;gap:10px;color:var(--ink,inherit);text-decoration:none;min-width:0}
.tdw-shop-ph{aspect-ratio:4/5;overflow:hidden;background-size:cover;background-position:center;border-radius:var(--r,2px)}
.tdw-shop-ph img{width:100%;height:100%;object-fit:cover;display:block}
.tdw-shop-tx{display:flex;flex-direction:column;gap:4px;min-width:0}
.tdw-shop-nm{font-family:var(--serif,inherit);font-size:1.12rem;line-height:1.2}
.tdw-shop-fa{font-family:var(--sans,inherit);font-size:.78rem;line-height:1.4;color:var(--mute,inherit)}
.tdw-shop-pr{font-family:var(--sans,inherit);font-size:.86rem;letter-spacing:.04em}
.tdw-shop-go{font-family:var(--sans,inherit);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent,var(--ink,inherit))}
.tdw-item{padding:calc(80px + env(safe-area-inset-top,0px)) var(--pad,20px) 56px;max-width:1080px;margin:0 auto;color:var(--ink,inherit)}
@media (min-width:1024px){.tdw-item{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}}
.tdw-item .tdw-shop-ph{aspect-ratio:4/5}.tdw-item h1{font-family:var(--serif,inherit);font-size:clamp(1.9rem,6vw,3rem);line-height:1.08;margin:18px 0 8px;font-weight:400}
.tdw-item .tdw-shop-fa{font-size:.9rem}.tdw-item .tdw-shop-pr{font-size:1.1rem;margin:10px 0 16px}
.tdw-item ul{margin:0 0 22px;padding:0 0 0 1.1em;font-family:var(--sans,inherit);font-size:.95rem;line-height:1.6}
.tdw-ask{display:flex;flex-direction:column;gap:12px;font-family:var(--sans,inherit)}
.tdw-ask label{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mute,inherit)}
.tdw-ask input,.tdw-ask select{font:inherit;font-size:1rem;letter-spacing:0;text-transform:none;color:var(--ink,inherit);background:transparent;border:1px solid var(--line,currentColor);border-radius:var(--r,2px);padding:12px 14px;min-height:48px}
.tdw-ask button{font:inherit;font-size:.86rem;letter-spacing:.14em;text-transform:uppercase;min-height:52px;border:1px solid var(--accent,var(--ink,currentColor));background:var(--accent,var(--ink,currentColor));color:var(--bg,#fff);border-radius:var(--r,2px);cursor:pointer}
.tdw-ask button[disabled]{opacity:.6}.tdw-ask .tdw-msg{font-size:.92rem;line-height:1.5;color:var(--ink,inherit);text-transform:none;letter-spacing:0;margin:0}
.tdw-pay{display:flex;align-items:center;justify-content:center;min-height:52px;font-family:var(--sans,inherit);font-size:.86rem;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;border:1px solid var(--accent,var(--ink,currentColor));background:var(--accent,var(--ink,currentColor));color:var(--bg,#fff);border-radius:var(--r,2px)}
.tdw-back{display:inline-block;margin-bottom:6px;font-family:var(--sans,inherit);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mute,inherit);text-decoration:none}`;

// G2 (CE-47, the founder's principle): who takes the money, said on Buy. INS's link pays into her own account.
// Q-B (CE-47, 7 October 2026): a pay_url is a link only when it is https and its host is Razorpay's or Cashfree's, exactly or a
// true subdomain; anything else is treated as no link and the WhatsApp thank-you line is shown. Same tab, rel noopener noreferrer (Q-C).
// F-44.341: the form's fields are read by name with querySelector (f.name is the form's own name). F-44.342: the studio name is
// put in with a function replacer, so a name holding $& or $' is printed as written.
const PAY_LINE = 'Your payment goes through __P__ straight to __S__. __P__ may charge its own fees.';   // R-47.1 (CE-47, 8 Oct): a whole sentence
const PAY_GO = 'Continue to payment';
const LINES = { name: 'Your name', phone: 'Your 10-digit mobile number', qty: 'Seats', date: 'Date', ask: 'Ask about this', buy: 'Buy', soldOut: 'Sold out', soldOutLine: 'This item is sold out.',
  sent: (studio: string) => `Thank you. ${studio} will message you on WhatsApp about payment.`, failed: 'This could not be sent. Please try again in a moment.' };

/** One item's Ask form: her name and 10-digit mobile, seats for a workshop, a date for a booking or a dated class. The
 *  item page gives it the ids its bench reads (tdwAsk, tdwMsg); the classic page's storefront row draws one per item. */
function askForm(it: ShopItem, studio: string, ids: boolean): Raw {
  const needsDate = it.kind === 'booking' || (it.kind === 'class' && (it.class_dates || []).length > 0);
  const dateField = it.kind === 'class' && (it.class_dates || []).length
    ? html`<label>${LINES.date}<select name="wanted_date" required>${raw((it.class_dates || []).map((d) => `<option value="${esc(d)}">${esc(longDate(d))}</option>`).join(''))}</select></label>`
    : needsDate ? html`<label>${LINES.date}<input type="date" name="wanted_date" required></label>` : raw('');
  const qty = it.kind === 'workshop' && !it.sold_out ? html`<label>${LINES.qty}<input type="number" name="qty" min="1" max="${String(Math.min(20, it.seats_left || 1))}" value="1" inputmode="numeric"></label>` : raw('');
  if (it.sold_out) return html`<p class="tdw-msg">${LINES.soldOutLine}</p>`;   // R-47.1: the message is a sentence; the price slot keeps the label
  return html`<form class="tdw-ask"${raw(ids ? ' id="tdwAsk"' : '')} data-slug="${it.slug}" data-studio="${studio}"><label>${LINES.name}<input name="buyer" maxlength="40" autocomplete="name" required></label>
<label>${LINES.phone}<input name="phone" inputmode="numeric" maxlength="10" autocomplete="tel-national" pattern="[6-9][0-9]{9}" required></label>${qty}${dateField}<button type="submit">${LINES.ask}</button><p class="tdw-msg"${raw(ids ? ' id="tdwMsg"' : '')} role="status" aria-live="polite"></p></form>`;
}

/** The one script for every Ask form on a page (form.tdw-ask): it posts to OFF-A1's order door for her handle and says what
 *  happens next. Returned without its <script> tags, so a React page can carry it as well as a drawn document. */
export function askScript(api: string, code: string): string {
  return `(function(){document.querySelectorAll('form.tdw-ask').forEach(function(f){var m=f.querySelector('.tdw-msg');var q=function(n){return f.querySelector('[name='+n+']')};f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('button');b.disabled=true;m.textContent='';
var d={slug:f.dataset.slug,name:q('buyer').value.trim(),phone_e164:'+91'+q('phone').value.replace(/[^0-9]/g,'')};if(q('qty'))d.qty=parseInt(q('qty').value,10)||1;if(q('wanted_date'))d.wanted_date=q('wanted_date').value;
fetch(${JSON.stringify(`${api}/api/v2/public/shop/${encodeURIComponent(code)}/order`)},{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json().then(function(j){return{r:r,j:j}})}).then(function(x){
if(x.r.ok&&x.j.ok){var st=f.dataset.studio||'';var put=function(t){return t.replace(/__S__/g,function(){return st})};var u=null;try{u=x.j.pay_url?new URL(x.j.pay_url):null}catch(_e){u=null}var h=u&&u.protocol==='https:'?u.hostname:'';var pv=/(^|\\.)(rzp\\.io|razorpay\\.com)$/.test(h)?'Razorpay':/(^|\\.)cashfree\\.com$/.test(h)?'Cashfree':'';f.querySelectorAll('label').forEach(function(l){l.style.display='none'});b.style.display='none';if(pv){m.textContent=put(${JSON.stringify(PAY_LINE)}.replace(/__P__/g,pv));var a=document.createElement('a');a.href=u.href;a.className='tdw-pay';a.textContent=${JSON.stringify(PAY_GO)};a.rel='noopener noreferrer';f.appendChild(a);return}m.textContent=put(${JSON.stringify(LINES.sent('__S__'))});return}
m.textContent=(x.j&&x.j.error)||${JSON.stringify(LINES.failed)};b.disabled=false}).catch(function(){m.textContent=${JSON.stringify(LINES.failed)};b.disabled=false})})})})();`;
}

/** The item's own page body: back to the shop, the picture, the words, and the Ask form (its script posts to OFF-A1's door). */
export function itemBody(it: ShopItem, o: { base: string; api: string; code: string; studio: string; header: string }): string {
  const p = photoOf(it.photo_url);
  const form = askForm(it, o.studio, true);
  const script = `<script>${askScript(o.api, o.code)}</script>`;
  return `${o.header}<main class="tdw-item" id="top"><div>${html`<a class="tdw-back" href="${href(o.base + '/#shop')}">← ${SHOP_EYEBROW}</a>`.s}${p ? html`<div class="tdw-shop-ph" style="${lq(p)}">${pic(p, { hero: true, sizes: '(min-width:1024px) 50vw, 100vw' })}</div>`.s : ''}</div>
<div>${html`<h1>${it.name}</h1><span class="tdw-shop-fa">${it.facts}</span><div class="tdw-shop-pr">${it.price_words}</div>`.s}${it.includes.length ? `<ul>${it.includes.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}${form.s}</div></main>${script}`;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function longDate(d: string): string { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : d; }

/** Where the section sits: her own 'shop' row if she has one, else just before 'enquire' (or last). Returns a new list. */
export function withShopSection(sections: Section[], has: boolean): Section[] {
  if (!has || sections.some((s) => s.key === 'shop')) return sections;
  const i = sections.findIndex((s) => s.key === 'enquire'); const row: Section = { key: 'shop', eyebrow: null, heading: null, body: null };
  return i < 0 ? [...sections, row] : [...sections.slice(0, i), row, ...sections.slice(i)];
}
export type CardWithShop = SiteCard & { shop?: ShopItem[]; shop_base?: string };

// ── THE CLASSIC PAGE'S STOREFRONT ROW (CE-47 Q-A, 7 October 2026) ─────────────────────────────────────────────────────────
// A vendor on the classic page (/v/<code>) has no item pages, so each item opens its own Ask in place (a <details>, no React
// state), posting to the same public door with the same thank-you and G2 lines (askScript). Drawn only when the door answers
// with shown items. Its colours are the classic page's own (the cream page, its ink and its gold), as that page writes them.
export const CLASSIC_SHOP_LABEL = 'Gift vouchers and workshops';
export const CLASSIC_SHOP_CSS = `.pv-shop{padding:26px 24px 0}
.pv-shop .pv-wlbl{display:block}
.pv-srow{border-bottom:.5px solid rgba(12,10,9,.09)}.pv-srow:first-of-type{border-top:.5px solid rgba(12,10,9,.09);margin-top:12px}
.pv-srow>summary{list-style:none;display:flex;gap:12px;align-items:center;padding:14px 0;cursor:pointer;min-height:44px}
.pv-srow>summary::-webkit-details-marker{display:none}
.pv-srow>summary:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-stx{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.pv-sname{font:300 19px/1.2 "Cormorant Garamond",Georgia,serif;color:#0C0A09;overflow-wrap:anywhere}
.pv-smeta{font-weight:400;font-size:12px;line-height:1.4;color:#6B6560;overflow-wrap:anywhere}
.pv-sprice{flex:none;font-weight:400;font-size:13px;line-height:1.4;color:#0C0A09}
.pv-sthumb{flex:none;width:44px;height:55px;object-fit:cover;border-radius:2px;display:block;background:#EDEAE4}
.pv-sbody{padding:0 0 18px;display:flex;flex-direction:column;gap:12px}
.pv-sbody ul{margin:0;padding:0 0 0 1.1em;font-size:13px;line-height:1.6;color:#403B36}
.pv-sbody .tdw-ask{display:flex;flex-direction:column;gap:12px}
.pv-sbody .tdw-ask label{display:flex;flex-direction:column;gap:6px;font:300 9px/1.2 "Jost",system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#403B36}
.pv-sbody .tdw-ask input,.pv-sbody .tdw-ask select{font:400 15px/1.2 system-ui,sans-serif;letter-spacing:0;text-transform:none;color:#0C0A09;background:#fff;min-height:44px;padding:0 12px;border:.5px solid rgba(12,10,9,.30);border-radius:2px}
.pv-sbody .tdw-ask input:focus-visible,.pv-sbody .tdw-ask select:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-sbody .tdw-ask button,.pv-sbody .tdw-pay{min-height:44px;padding:0 20px;display:inline-flex;align-items:center;justify-content:center;border:.5px solid rgba(12,10,9,.30);border-radius:2px;background:#fff;color:#0C0A09;font:400 13px/1 system-ui,sans-serif;letter-spacing:.06em;text-decoration:none;cursor:pointer}
.pv-sbody .tdw-ask button:focus-visible,.pv-sbody .tdw-pay:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-sbody .tdw-ask button[disabled]{opacity:.6}
.pv-sbody .tdw-msg{font-size:14px;line-height:1.45;color:#403B36;margin:0}`;

/** The storefront row: one line per shown item (picture, name, facts, price); tapping a line opens its words and its Ask. */
export function classicShopRow(items: ShopItem[], studio: string): string {
  if (!items.length) return '';
  const rows = items.map((it) => {
    const thumb = it.photo_url && /^https:\/\//.test(it.photo_url) ? html`<img class="pv-sthumb" src="${at(it.photo_url, 160) || it.photo_url}" alt="" loading="lazy">` : raw('');
    return html`<details class="pv-srow"><summary>${thumb}<span class="pv-stx"><span class="pv-sname">${it.name}</span><span class="pv-smeta">${it.facts}</span></span><span class="pv-sprice">${it.sold_out ? LINES.soldOut : it.price_words}</span></summary>
<div class="pv-sbody">${it.includes.length ? html`<ul>${it.includes.map((l) => html`<li>${l}</li>`)}</ul>` : raw('')}${askForm(it, studio, false)}</div></details>`.s;
  }).join('');
  return html`<section class="pv-shop" id="shop"><span class="pv-wlbl">${CLASSIC_SHOP_LABEL}</span>${raw(rows)}</section><style>${raw(CLASSIC_SHOP_CSS)}</style>`.s;
}
