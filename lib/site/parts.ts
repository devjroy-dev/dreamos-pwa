// lib/site/parts.ts · WEB-5 · the pieces every style shares, written as the approved engine writes them
// (tools/site_port/engine.js: pic, lq, heartBtn, words, lines, the drawer, the credit). Server-side only.
import { html, raw, esc, href, type Raw } from './html';
import { at, srcset, pos, lqData } from './img';
import type { Photo, SiteCard, Testimonial } from './card';

export const HEART_SVG = raw('<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1z"/></svg>');
export const PLAY_SVG = raw('<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>');

export type PicOpts = { hero?: boolean; eager?: boolean; defer?: boolean; sizes?: string; cls?: string; alt?: string; landscape?: boolean };
/** engine.js pic(): the cover is the 480 first (Q3: for everyone) at the highest priority; CoverUpgrade swaps in
 *  the srcset once it is on screen, unless Save-Data. Deferred covers wait for the first (data-src). */
export function pic(p: Photo | null | undefined, o: PicOpts = {}): Raw {
  if (!p || !at(p.url, 480)) return raw('');
  const pr = o.hero ? raw('fetchpriority="high"') : o.eager ? raw('') : raw('loading="lazy"');
  const src = o.hero ? at(p.url, 480) : at(p.url, 960);
  const set = o.hero ? '' : srcset(p.url);
  // Every photograph but the cover waits for the cover (charter item 3, measured: Couture's grid sits right under its
  // cover, inside Chrome's lazy-load distance, and its 16 files took the cover's bandwidth on Slow 3G).
  const defer = !o.hero;
  const S = defer ? 'data-src' : 'src', SS = defer ? 'data-srcset' : 'srcset';
  const up = o.hero ? html` data-upgrade="${srcset(p.url)}" data-sizes="${o.sizes || '100vw'}"` : raw('');
  return html`<img class="${o.cls || ''}" alt="${o.alt ?? p.alt ?? ''}" decoding="async" ${pr} ${raw(S)}="${src}"${set ? html` ${raw(SS)}="${set}" sizes="${o.sizes || '100vw'}"` : raw('')}${up} style="object-position:${pos(p, o.landscape)}">`;
}
/** engine.js lq(): the placeholder as a custom property. Every placeholder on the page is inlined as a data url
 *  (fetched once on the server, cached a day; prepareLq below), so no placeholder costs the phone a request while the
 *  cover is loading (measured: eleven 300-byte requests, each a Slow 3G round trip, shared the cover's bandwidth). */
const LQ = new Map<string, string>();
export async function prepareLq(urls: (string | null | undefined)[]): Promise<void> {
  await Promise.all([...new Set(urls.filter((u): u is string => !!u))].map(async (u) => { if (!LQ.has(u)) LQ.set(u, await lqData(u)); }));
}
export const lq = (p: Photo | null | undefined, data?: string): string => { const u = data || (p?.url ? LQ.get(p.url) : '') || ''; return u && u.startsWith('data:') ? `--lq:url(${u.replace(/[()'"\s]/g, (c) => encodeURIComponent(c))})` : ''; };
export function heartBtn(i: number, cls = '', slug = ''): Raw {
  return html`<button class="hbtn ${cls}" data-like="${i}"${slug ? html` data-slug="${slug}"` : ''} aria-label="Save">${HEART_SVG}<span class="burst">${raw([0, 60, 120, 180, 240, 300].map((r) => `<i style="--r:${r}deg"></i>`).join(''))}</span></button>`;
}
export const words = (t: string): Raw => raw(t.split(' ').map((w, j) => `<span class="w" style="--i:${j}">${esc(w)}</span>`).join(' '));
export function lines(t: string, n?: number): Raw {
  const w = t.split(' ');
  if (w.length < 4 || n === 1) return html`<span class="ln"><span>${t}</span></span>`;
  const h = Math.ceil(w.length / 2);
  return raw([w.slice(0, h).join(' '), w.slice(h).join(' ')].map((l, i) => `<span class="ln"><span style="transition-delay:${(0.08 + i * 0.1).toFixed(2)}s">${esc(l)}</span></span>`).join(''));
}
/** engine.js rs(): Indian grouping, "Rs 45,000". Formatting only; the figure is the card's. */
export function rs(n: number): string { const s = String(Math.round(n)), l = s.slice(-3), r = s.slice(0, -3); return 'Rs ' + (r ? r.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + l; }
/** engine.js qHTML(): approved words only; a testimonial without words (video only) is not a wall quote. */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** The card's month is 'YYYY-MM'; the page writes it as "February 2026". */
export const monthName = (m: string | null | undefined): string => { const r = /^(\d{4})-(\d{2})$/.exec(String(m || '')); return r && +r[2] >= 1 && +r[2] <= 12 ? `${MONTHS[+r[2] - 1]} ${r[1]}` : ''; };
export function quotes(ts: Testimonial[]): Raw {
  const rows = ts.filter((t) => t.words && t.words.trim());
  return raw(rows.map((t, i) => `<div class="q ${i ? '' : 'on'}"><p>${words(String(t.words)).s}</p><div class="by">${esc([t.name, [t.place, monthName(t.month)].filter(Boolean).join(', ')].filter(Boolean).join(' · '))}</div></div>`).join(''));
}
export type NavItem = { label: string; href: string; eliza?: boolean };
/** engine.js chrome: the drawer menu (numbered), its foot, and the scrim. Eliza's panel is WEB-7's slot. */
export function drawer(nav: NavItem[], foot: { instagram?: string | null; whatsapp?: string | null; cities?: string | null }): Raw {
  return html`<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Menu"><button class="x" id="drawerX"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg><span>Close</span></button><nav id="dnav">${raw(nav.map((n, i) => `<a href="${esc(href(n.href))}" style="--i:${i}"${n.eliza ? ' data-eliza' : ''}><em>0${i + 1}</em>${esc(n.label)}</a>`).join(''))}</nav><div class="dfoot">${foot.instagram ? html`<a href="${href(foot.instagram)}" rel="noopener">Instagram</a>` : ''}${foot.whatsapp ? html`<a href="${href(foot.whatsapp)}" rel="noopener">WhatsApp</a>` : ''}${foot.cities ? html`<span>${foot.cities}</span>` : ''}</div></aside>`;
}
export const igUrl = (h: string | null | undefined): string | null => { const s = String(h || '').replace(/^@/, '').trim(); return /^[A-Za-z0-9._]{1,30}$/.test(s) ? `https://www.instagram.com/${s}/` : null; };
/** The trade row the engine keys video-first on (html[data-trade=performer]); from the card's item word. */
export const tradeKey = (c: SiteCard): string => ({ look: 'makeup', story: 'photo', act: 'performer', event: 'planner' } as Record<string, string>)[c.site.trade.item] || 'makeup';
/**
 * WEB-8 C2 (CE-47, the founder's walk): "Ask for a quote" on a pricing row is a real control (class ask-q: the styles already use .q for review quotes). It is a link to her
 * WhatsApp with the package named (so it works with no script and while the enquiry doors are OFF), and it carries
 * data-enquire and data-package, so the enquiry panel, when it runs, opens instead with that package chosen.
 */
export function quoteLink(c: { enquire_link?: string | null }, pkg: string, label: string, cls = 'v ask-q'): string {
  const name = String(pkg || '').trim(); let href = '#enquire';
  try { if (c.enquire_link && /^https:\/\//.test(c.enquire_link)) { const u = new URL(c.enquire_link); u.searchParams.set('text', `Hello, I would like a quote for ${name}.`); href = u.toString(); } } catch { href = '#enquire'; }
  return `<a class="${esc(cls)}" href="${esc(href)}" target="_blank" rel="noopener" data-enquire data-package="${esc(name)}">${esc(label)}</a>`;
}

