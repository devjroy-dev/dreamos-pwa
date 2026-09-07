"use client";
// app/vendor/(shell)/your-website/screen.tsx
// TDW · BLOCK 19 · G3.1 sitting 2 — YOUR WEBSITE, AS A VENDOR USES IT (R-40.122/R-40.123).
// R-40.132: this is a PAGE off the registry (WEBSITE_HREF), not the Storefront
// room — sitting 1's room is restored byte for byte beside it.
//
// The ratified mock is docs/mocks/your-website-s2-proto.html (12 frames); this file
// is that prototype on the estate's own hooks and doors, in the walk's order:
//
//   W1  her page — a LIVE /v/<handle> inside the shell (an iframe of the real
//       leaf at 374, scaled to the column; 1:1 on tap). The thing she is editing,
//       never a list of rows about it.
//   W1  what to fix — FORK 2 as drawn: the meter's terms a couple can SEE on /v/
//       (cover, about, city, price) plus the page's own two (a wedding page; a
//       venue on one). Tags, travel, Instagram are the meter's and not the
//       page's, so they are not here. Never a score (master §7). Open items
//       first; done items collapse past three.
//   W2  her address — copy, share, open, the QR (one call into the tent card's
//       QR home via /solutions/storefront/qr.png), and `Your own name` (P2) —
//       live only when the `website` row's gate is open; its own honest line
//       until then (a byte for the veto).
//   W1  weddings on her page + the date-check switch — carried in mechanism
//       from the previous PublicPageBand (R-40.77/.78, C103/C104/C109).
//   W3  SEO — found on Google: what Google shows (title/description →
//       PATCH /me → revalidate), Connect Google (GET /solutions/google/connect),
//       the two named windows (R-40.123), five searches, three things to do —
//       FORK 3: COMPUTED from her gaps and her queries, never a fixed list.
//
// ONE PRIMARY REGISTER, ONE HOME. `Primary()` is the file's only `wl-btn pri`;
// each screen (page / address / google / a sheet) mounts at most one.
//
// The word "dis-abled" appears nowhere in this file (C103, R-40.78: absent, not
// greyed). Busy states are guarded in handlers.
//
// Vendor-facing bytes are C (below) — the founder's veto sheet, byte for byte.

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSettings } from '@/hooks/vendor/useSettings';
import { updateMe } from '@/lib/vendor/api/vendor';
import { getJson, API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';
import { COPY } from '@/lib/worklist/copy';
import { roomHref } from '@/lib/worklist/rooms';
import { WEDDING_PAGES_HREF } from '@/lib/solutions/routes';

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

// ── THE BYTES (veto sheet G31_S2_VETO_LIST.md) ────────────────────────────────
const C = {
  seePage:     'See the whole page',
  openPage:    'Open',
  back:        'Your website',
  fixHead:     'What to fix',
  fixSub:      'A couple reads your page in about a second. These are the gaps she sees.',
  fixNone:     'Nothing to fix. Your page is complete.',
  fixCover:    'Add a cover photo',              fixCoverD:   'The first thing a couple sees',
  fixAbout:    'Write two lines about your work', fixAboutD:  'In your own words',
  fixCity:     'Add your city',                  fixCityD:    'Couples search by place',
  fixRate:     'Add your starting price',        fixRateD:    'Shown as \u201cStarting at\u201d',
  fixWedding:  'Publish a wedding page',         fixWeddingD: 'A whole wedding, not just photos',
  fixVenue:    'A wedding page has no venue',
  fixVenueD:   (t: string) => `\u201c${t}\u201d was made without one`,
  venueSheet:  'The venue is set when a page is made. This page was made without one; the next one can carry it.',   // F-40.274 — until R-40.134's editor door, the true sentence
  done:        'Done',
  doneN:       (n: number) => `${n} done`,
  addrHead:    'Your address',
  addrSub:     'Put it in your Instagram bio and on your cards.',
  copy:        'Copy', copied: 'Copied', share: 'Share', qrDl: 'Download QR',
  qrLine:      'Scan opens your page.',
  domHead:     'Your own name',
  domSub:      'Get yourname.in and your page lives there. Registered in your name, not ours.',
  domSoon:     'Coming soon. Your address above works today and always will.',   // P2 not yet open — a byte for the veto
  domSearchSoon: 'The search lands with the registrar.',                          // P2 gate open, registrar packet not yet applied
  wedHead:     COPY.storefrontWeddingsLabel,
  wedSub:      'Only pages you published and the couple agreed to.',
  wedNone:     'None yet. Publish one from Wedding pages.',
  gHead:       'SEO \u2014 found on Google',
  gSub:        'What Google shows for you, and what people typed to get there.',
  gRow:        'Found on Google',
  gRowD:       'Not connected yet', gRowDon: 'Connected',
  gSeesH:      'What Google shows',
  gSeesP:      'Prefilled from your page. Change it if you like.',
  gTitle:      'Title', gDesc: 'Description',
  gConnect:    'Connect Google',
  gConnectP:   'One tap, the same Google account as your reviews. Then this page shows how often you appear, what people typed, and three things to do.',
  gOff:        'Google connection is being set up. Come back in a few days.',
  gConnected:  'Connected to Google',
  gEmpty:      'Connected to Google. Google reports in a few days \u2014 come back after the weekend.',
  gLast:       'The last 28 days',
  gSeen:       'Times you appeared on Google', gOpened: 'Times someone opened your page',
  gPrev:       (n: number) => `the 28 before: ${n}`,
  gTyped:      'What people typed',
  gTodo:       'Three things to do',
  gTodoP:      'Each one changes what Google can show.',
  save:        'Save',
  saveToast:   'Saved. Your page is updated.',
  gSaveToast:  'Saved. Google picks it up within a few days.',
  aboutH:      'About your work', aboutP: 'Two lines is plenty. What you do, and where.',
  cityH:       'Your city',       cityP:  'The one place you work from.',
  rateH:       'Starting price',  rateP:  'Your lowest package. Shown only while your price switch is on.',
  coverH:      'Cover photo',     coverP: 'Pick one in Portfolio. It becomes the first thing a couple sees.',
  openPortfolio: 'Open Portfolio', openWeddings: 'Open Wedding pages', stay: 'Stay here',
  shareToast:  'Opens WhatsApp with your address',
  qrToast:     'Saved to your phone',
} as const;

// ── TYPES the doors answer in ─────────────────────────────────────────────────
type Card = {
  handle: string; business_name: string | null; category: string | null; city: string | null;
  about: string | null; starting_price: number | null;
  photos: Array<{ url: string; hero: boolean }>;
  weddings: Array<{ title: string; slug: string; venue?: string | null; city?: string | null; season?: string | null; date_label?: string | null }>;
  meta?: { title: string | null; description: string | null };
};
type GStatus = { ok: boolean; configured: boolean; house_connected: boolean; connected: boolean; email: string | null };
type GReport = { ok: boolean; connected: boolean; has_data: boolean; window_end: string | null;
  last_28: { impressions: number; clicks: number } | null; prior_28: { impressions: number; clicks: number } | null;
  queries: Array<{ query: string; impressions: number; clicks: number }> };
type MeSeo = { seo_title: string | null; seo_description: string | null };

type Screen = 'page' | 'full' | 'address' | 'google';
type Sheet = null | 'about' | 'city' | 'rate' | 'cover' | 'wedding' | 'venue' | 'photos';

// ── STYLE — the shell's classes live in WorklistShell's SHELL_CSS; the rules
// here are the ratified mock's lifted set (contracts-mock.html:59–94 for the
// section eyebrow / record head / note; support/page.tsx for the row grammar)
// plus this room's layout glue. No new colour. ────────────────────────────────
const CSS = `
.yw-sec{flex-shrink:0}
.yw-sect{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:22px 0 6px;border-top:.5px solid var(--role-metal);margin-top:20px}
.yw-sect.first{border-top:none;margin-top:8px}
.yw-note{font:var(--wl-t5);line-height:1.5;letter-spacing:0;text-transform:none;color:var(--atelier-ink-mute);padding-top:8px;max-width:34ch}
.yw-rechead{display:block;width:100%;text-align:left;padding:18px 0 14px;background:none;border:none;cursor:pointer;color:inherit}
.yw-eyebrow{font:var(--wl-t5);letter-spacing:.14em;text-transform:uppercase;color:var(--role-metal)}
.yw-rectitle{font:var(--wl-t1);color:var(--atelier-ink);margin-top:4px}
.yw-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:56px;padding:12px 0;border-bottom:.5px solid var(--atelier-card-border);width:100%;background:none;border-left:none;border-right:none;border-top:none;text-align:left;color:inherit;cursor:pointer;text-decoration:none}
.yw-rowtext{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1 1 auto}
.yw-rowlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.yw-roweyebrow{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.yw-chev{font-family:var(--font-italiana),"GFS Didot",Georgia,serif;font-size:16px;line-height:1;color:var(--atelier-label);flex-shrink:0}
.yw-done .yw-rowlabel{color:var(--atelier-ink-fade)}
.yw-done .yw-chev{visibility:hidden}
.yw-window{flex-shrink:0;display:block;width:100%;margin-top:16px;border:.5px solid var(--atelier-card-border);border-radius:3px;overflow:hidden;background:#F8F7F5;position:relative;height:312px;padding:0;cursor:pointer}
.yw-window iframe{position:absolute;left:0;top:0;width:374px;height:342px;border:0;transform-origin:0 0;transform:scale(.914);pointer-events:none;background:#F8F7F5}
.yw-under{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-top:6px}
.yw-addr{font:var(--wl-t3);color:var(--atelier-ink-mute);word-break:break-all;min-width:0}
.yw-link{font:var(--wl-t4);color:var(--atelier-accent-text);white-space:nowrap;padding:8px 0;min-height:44px;display:inline-flex;align-items:center;flex-shrink:0;background:none;border:none;cursor:pointer}
.yw-full{position:relative;flex:1;min-height:600px;padding:0!important}
.yw-full iframe{width:100%;height:100%;min-height:600px;border:0;background:#F8F7F5}
.yw-acts{display:flex;gap:8px;margin-top:14px}
.yw-acts>button{flex:1}
.yw-second{flex:1;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);display:flex;align-items:center;justify-content:center;text-decoration:none}
.yw-big{font:var(--wl-t2);color:var(--atelier-ink);word-break:break-all;margin-top:8px}
.yw-qr{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;margin-top:14px}
.yw-qr img{width:112px;height:112px;background:#FFFFFF;border:.5px solid var(--atelier-card-border);border-radius:3px;padding:8px}
.yw-fl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);display:block;margin:14px 0 6px}
.yw-fi{width:100%;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:3px;padding:11px 12px;font:var(--wl-t3);color:var(--atelier-ink);display:block;outline:none;box-sizing:border-box;-webkit-appearance:none;appearance:none}
textarea.yw-fi{resize:none;min-height:88px;font-family:inherit}
.yw-count{font:var(--wl-t5);color:var(--atelier-ink-fade);letter-spacing:0;text-transform:none;text-align:right;margin-top:4px;font-variant-numeric:lining-nums tabular-nums}
.yw-nums{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.yw-num{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:12px 14px}
.yw-num b{display:block;font:var(--wl-t0);font-size:34px;line-height:1;color:var(--atelier-ink);font-variant-numeric:lining-nums tabular-nums;font-weight:500}
.yw-num span{display:block;font:var(--wl-t5);color:var(--atelier-ink-mute);letter-spacing:0;text-transform:none;margin-top:8px;line-height:1.4}
.yw-num em{font-style:normal;color:var(--atelier-ink-soft)}
.yw-q{display:grid;grid-template-columns:1fr auto;column-gap:12px;padding:11px 0;border-bottom:.5px solid var(--atelier-card-border);font:var(--wl-t3);color:var(--atelier-ink)}
.yw-q span:last-child{font:var(--wl-t5);color:var(--atelier-ink-mute);letter-spacing:0;text-transform:none;font-variant-numeric:lining-nums tabular-nums;align-self:center}
.yw-gbtn{display:flex;align-items:center;justify-content:center;gap:10px;min-height:48px;margin-top:14px;border-radius:3px;background:var(--atelier-header-bg);border:.5px solid var(--atelier-card-border);font:var(--wl-t4);color:var(--atelier-ink);width:100%;letter-spacing:.02em;cursor:pointer}
.yw-gdone{display:flex;align-items:center;gap:10px;margin-top:14px;font:var(--wl-t3);color:var(--atelier-ink-soft)}
.yw-gicon{width:18px;height:18px;flex-shrink:0}
.yw-switchrow{display:flex;align-items:center;gap:14px;padding:14px 0 6px;width:100%;background:none;border:none;cursor:pointer;color:inherit;text-align:left}
.yw-switchrow span:first-child{flex:1;min-width:0;font:var(--wl-t3);color:var(--atelier-ink)}
.yw-toggle{width:46px;min-width:46px;height:27px;border-radius:14px;position:relative;background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);transition:background 140ms ease}
.yw-toggle::after{content:"";position:absolute;top:2px;left:2px;width:21px;height:21px;border-radius:50%;background:var(--atelier-ink-fade)}
.yw-toggle.on{background:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}
.yw-toggle.on::after{left:auto;right:2px;background:var(--role-ink-deep)}
.yw-fine{font:var(--wl-t5);color:var(--atelier-ink-mute);letter-spacing:0;text-transform:none;line-height:1.55;max-width:34ch;margin-top:4px}
.yw-empty{font:var(--wl-t3);color:var(--atelier-ink-mute);padding:14px 0 0}
.yw-scrim{position:fixed;inset:0;background:var(--atelier-overlay);z-index:20;border:none;cursor:pointer}
.yw-sheet{position:fixed;left:0;right:0;bottom:0;z-index:21;background:var(--role-sheet);border-top:.5px solid var(--atelier-sheet-border);border-radius:3px 3px 0 0;padding:20px var(--wl-gutter) 28px;display:flex;flex-direction:column;gap:14px;max-height:92vh;overflow-y:auto}
.yw-shhead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.yw-shtitle{font:var(--wl-t1);color:var(--atelier-ink)}
.yw-shx{width:44px;height:44px;margin:-10px calc(var(--wl-gutter) * -1 + 8px) -10px 0;flex:none;display:flex;align-items:center;justify-content:center;background:transparent;border:none;border-radius:3px;cursor:pointer;font:var(--wl-t2);line-height:1;color:var(--atelier-ink-mute)}
.yw-shp{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:34ch}
.yw-toast{position:fixed;left:var(--wl-gutter);right:var(--wl-gutter);bottom:150px;z-index:30;background:var(--role-ink-deep);color:#EDEEEF;font:var(--wl-t4);padding:12px 14px;border-radius:3px;box-shadow:0 2px 12px rgba(0,0,0,.3)}
`;

// ── ONE PRIMARY REGISTER, ONE HOME ────────────────────────────────────────────
function Primary({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" className="wl-btn pri" onClick={onClick}>{label}</button>;
}
function GIcon() {
  return (
    <svg className="yw-gicon" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}

// ── THE CHECKLIST — FORK 2 as drawn ───────────────────────────────────────────
type Fix = { k: Exclude<Sheet, null>; t: string; d: string; ok: boolean };
export function checklist(card: Card | null, about: string, city: string, rate: string): Fix[] {
  const hasHero = Boolean(card && card.photos.some((p) => p.hero));
  const items: Fix[] = [
    { k: 'cover', t: C.fixCover, d: C.fixCoverD, ok: hasHero },
    { k: 'about', t: C.fixAbout, d: C.fixAboutD, ok: about.trim() !== '' },
    { k: 'city',  t: C.fixCity,  d: C.fixCityD,  ok: city.trim() !== '' },
    { k: 'rate',  t: C.fixRate,  d: C.fixRateD,  ok: rate.trim() !== '' },
  ];
  const weds = card ? card.weddings : [];
  if (weds.length === 0) items.push({ k: 'wedding', t: C.fixWedding, d: C.fixWeddingD, ok: false });
  else { const v = weds.find((w) => !w.venue); if (v) items.push({ k: 'venue', t: C.fixVenue, d: C.fixVenueD(v.title), ok: false }); }
  return items;
}

// ── THE THREE THINGS — FORK 3: computed from her gaps and her queries ─────────
type Thing = { k: Exclude<Sheet, null>; t: string; d: string };
export function threeThings(card: Card | null, fixes: Fix[], queries: GReport['queries'], about: string, city: string): Thing[] {
  const out: Thing[] = [];
  const weds = card ? card.weddings : [];
  const noVenue = weds.find((w) => !w.venue);
  if (noVenue) out.push({ k: 'venue', t: `\u201c${noVenue.title}\u201d has no venue`, d: 'People type the venue. Google finds pages that name it.' });
  if (weds.length === 0) out.push({ k: 'wedding', t: 'Publish your first wedding page', d: 'Searches with a place in them find pages, not profiles.' });
  if (!city.trim()) out.push({ k: 'city', t: 'Add your city', d: queries.length ? 'Every search above has a place in it.' : 'Couples search by place.' });
  if (card && card.photos.length < 12) out.push({ k: 'photos', t: 'Add photos with a line under each', d: 'Google reads the line, not the picture.' });
  if (fixes.some((f) => f.k === 'cover' && !f.ok)) out.push({ k: 'cover', t: 'Pick a cover photo', d: 'It is the picture Google shows beside your name.' });
  const typed = queries.map((q) => q.query.toLowerCase());
  if (typed.some((q) => /pre.?wedding|engagement/.test(q)) && !/pre.?wedding|engagement/i.test(about)) out.push({ k: 'about', t: 'Mention pre-wedding work in your two lines', d: 'People are typing it. Your page does not say it.' });
  return out.slice(0, 3);
}

// ═══ THE ROOM ═════════════════════════════════════════════════════════════════
export function YourWebsiteScreen({ vendorId }: { vendorId: string }) {
  void vendorId; // every door below resolves her from the session token
  const { current, loading } = useSettings();
  // F-40.276: the stored handle is whatever case it was typed in (DEV440); the
  // card door, the canonical and the QR all lowercase it. The room prints and
  // opens the same address they do.
  const handle = (current.routing_handle || '').toLowerCase();
  const address = handle ? `${SITE_BASE.replace(/^https?:\/\//, '')}/v/${handle}` : '';
  const pageUrl = handle ? `${SITE_BASE}/v/${handle}` : '';

  const [screen, setScreen] = useState<Screen>('page');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [cardTick, setCardTick] = useState(0);
  const [seo, setSeo] = useState<MeSeo>({ seo_title: null, seo_description: null });
  const [gStatus, setGStatus] = useState<GStatus | null>(null);
  const [gReport, setGReport] = useState<GReport | null>(null);
  const [p2Live, setP2Live] = useState(false);
  const [showDone, setShowDone] = useState(false);

  // Local echoes of the three editable facts, seeded from the hook's /me read.
  const [about, setAbout] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [rate, setRate] = useState<string | null>(null);
  const aboutV = about ?? current.about;
  const cityV = city ?? current.city;
  const rateV = rate ?? current.rate_min;

  function say(msg: string) { setToast(msg); window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 1800); }

  // The public card: weddings, photos, meta — the couple's view of her page.
  useEffect(() => {
    if (!handle) return;
    let live = true;
    (async () => {
      try {
        const r = await fetch(`${PUBLIC_API_BASE}/api/v2/public/vendor-card/${encodeURIComponent(handle)}`, { cache: 'no-store' });
        if (!r.ok) return;
        const j = await r.json();
        if (live && j && j.card) setCard(j.card as Card);
      } catch { /* the window still shows the page; the checklist waits */ }
    })();
    return () => { live = false; };
  }, [handle, cardTick]);

  // Her own metadata bytes, the Google status, and the P2 gate — three doors, once.
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const me = await getJson<{ ok: boolean; vendor?: MeSeo }>('/api/v2/vendor/me');
        if (live && me && me.vendor) setSeo({ seo_title: me.vendor.seo_title ?? null, seo_description: me.vendor.seo_description ?? null });
      } catch { /* derived bytes stand in */ }
      try {
        const st = await getJson<GStatus>('/api/v2/vendor/solutions/google/status');
        if (live && st && st.ok) setGStatus(st);
      } catch { /* the row reads "not connected yet" */ }
      try {
        const ix = await getJson<{ ok: boolean; index?: { rows: Array<{ slug: string; live: boolean }> } }>('/api/v2/vendor/solutions');
        const w = ix && ix.index && ix.index.rows.find((r) => r.slug === 'website');
        if (live && w) setP2Live(Boolean(w.live));
      } catch { /* P2 stays behind its honest line */ }
    })();
    return () => { live = false; };
  }, []);

  // The report only when the Google screen is open and she is connected.
  useEffect(() => {
    if (screen !== 'google' || !gStatus || !gStatus.connected) return;
    let live = true;
    (async () => {
      try {
        const r = await getJson<GReport>('/api/v2/vendor/solutions/google/report');
        if (live && r && r.ok) setGReport(r);
      } catch { /* the empty state stands */ }
    })();
    return () => { live = false; };
  }, [screen, gStatus]);

  // Back from Google's consent screen: ?google=connected|house_connected|failed|cancelled.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const g = q.get('google');
    if (!g) return;
    setScreen('google');
    if (g === 'connected' || g === 'house_connected') setGStatus((s) => (s ? { ...s, connected: true } : s));
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const fixes = useMemo(() => checklist(card, aboutV, cityV, rateV), [card, aboutV, cityV, rateV]);
  const open = fixes.filter((f) => !f.ok), done = fixes.filter((f) => f.ok);
  const things = useMemo(() => threeThings(card, fixes, gReport ? gReport.queries : [], aboutV, cityV), [card, fixes, gReport, aboutV, cityV]);

  if (loading) return null;

  const rechead = (title: string) => (
    <div className="yw-sec">
      <button type="button" className="yw-rechead" onClick={() => setScreen('page')} aria-label={`${C.back}: back`}>
        <div className="yw-eyebrow">{C.back}</div>
        <div className="yw-rectitle">{title}</div>
      </button>
    </div>
  );

  const fixSheet = sheet && (
    <FixSheet kind={sheet} close={() => setSheet(null)} say={say} card={card}
      values={{ about: aboutV, city: cityV, rate: rateV }}
      onSaved={(k, v) => {
        if (k === 'about') setAbout(v); if (k === 'city') setCity(v); if (k === 'rate') setRate(v);
        setCardTick((t) => t + 1); void revalidate();
      }} />
  );
  const toastEl = toast && <div className="yw-toast" role="status">{toast}</div>;

  if (screen === 'full') {
    return (
      <>
        <style>{CSS}</style>
        {rechead(current.business_name || C.back)}
        <div className="yw-full"><iframe src={`${pageUrl}?in=shell`} title={C.seePage} /></div>
      </>
    );
  }
  if (screen === 'address') {
    return <><AddressScreen {...{ address, pageUrl, handle, p2Live, rechead, say }} />{toastEl}</>;
  }
  if (screen === 'google') {
    const derivedTitle = (card && card.meta && card.meta.title) || [current.business_name, cityV].filter(Boolean).join(' \u00b7 ');
    const derivedDesc = (card && card.meta && card.meta.description) || aboutV.slice(0, 200);
    return (
      <>
        <GoogleScreen {...{ rechead, say, gStatus, gReport, seo, setSeo, things, setSheet, revalidate, derivedTitle, derivedDesc }} />
        {fixSheet}{toastEl}
      </>
    );
  }

  // ── W1 · HER PAGE ───────────────────────────────────────────────────────────
  const cap = current.capacity_reason;
  return (
    <>
      <style>{CSS}</style>

      <div className="yw-sec">
        <button type="button" className="yw-window" onClick={() => setScreen('full')} aria-label={C.seePage}>
          {handle && <iframe src={`${pageUrl}?in=shell`} title={current.business_name || handle} tabIndex={-1} />}
        </button>
        <div className="yw-under">
          <span className="yw-addr">{address}</span>
          <button type="button" className="yw-link" onClick={() => setScreen('full')}>{C.seePage}</button>
        </div>
      </div>

      <div className="yw-sec">
        <div className="yw-sect first">{C.fixHead}</div>
        <div className="yw-note">{open.length ? C.fixSub : C.fixNone}</div>
        <div>
          {open.map((f) => (
            <button key={f.k} type="button" className="yw-row" onClick={() => setSheet(f.k)}>
              <span className="yw-rowtext"><span className="yw-rowlabel">{f.t}</span><span className="yw-roweyebrow">{f.d}</span></span>
              <span className="yw-chev">{'\u203a'}</span>
            </button>
          ))}
          {done.length >= 3 && !showDone ? (
            <button type="button" className="yw-row" onClick={() => setShowDone(true)}>
              <span className="yw-rowtext"><span className="yw-rowlabel" style={{ color: 'var(--atelier-ink-mute)' }}>{C.doneN(done.length)}</span></span>
              <span className="yw-chev">{'\u203a'}</span>
            </button>
          ) : done.map((f) => (
            <div key={f.k} className="yw-row yw-done" style={{ cursor: 'default' }}>
              <span className="yw-rowtext"><span className="yw-rowlabel">{f.t}</span><span className="yw-roweyebrow">{C.done}</span></span>
              <span className="yw-chev">{'\u203a'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="yw-sec">
        <div className="yw-sect">{C.addrHead}</div>
        <button type="button" className="yw-row" onClick={() => setScreen('address')}>
          <span className="yw-rowtext"><span className="yw-rowlabel">{address}</span><span className="yw-roweyebrow">{C.addrSub}</span></span>
          <span className="yw-chev">{'\u203a'}</span>
        </button>
      </div>

      <div className="yw-sec">
        <div className="yw-sect">{C.wedHead}</div>
        <div className="yw-note">{C.wedSub}</div>
        {card && card.weddings.length ? card.weddings.map((w) => (
          <Link key={w.slug} href={WEDDING_PAGES_HREF} className="yw-row">
            <span className="yw-rowtext"><span className="yw-rowlabel">{w.title}</span>
              <span className="yw-roweyebrow">{[w.venue, w.city, w.season || w.date_label].filter(Boolean).join(' \u00b7 ')}</span></span>
            <span className="yw-chev">{'\u203a'}</span>
          </Link>
        )) : <div className="yw-empty">{C.wedNone}</div>}
        <DateSwitch cap={cap} revalidate={revalidate} />
      </div>

      <div className="yw-sec" style={{ paddingBottom: 32 }}>
        <div className="yw-sect">{C.gHead}</div>
        <button type="button" className="yw-row" onClick={() => setScreen('google')}>
          <span className="yw-rowtext"><span className="yw-rowlabel">{C.gRow}</span>
            <span className="yw-roweyebrow">{gStatus && gStatus.connected ? C.gRowDon : C.gRowD}</span></span>
          <span className="yw-chev">{'\u203a'}</span>
        </button>
      </div>

      {fixSheet}{toastEl}
    </>
  );
}

// ── THE SWITCH — carried from PublicPageBand in mechanism ─────────────────────
// R-40.77/.78 · C103/C104/C109: gates on capacity_reason (never capacity_applicable),
// saves on toggle through updateMe, reverts on refusal, settles on the door's echo,
// revalidates after the write and never reverts on a cache miss.
function DateSwitch({ cap, revalidate }: { cap: 'ruled_off' | 'unmapped' | null | undefined; revalidate: () => Promise<void> }) {
  const { current } = useSettings();
  const [on, setOn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const live = on ?? current.date_check_enabled;

  async function toggle() {
    if (busy) return;
    const next = !live;
    setOn(next);                    // optimistic
    setBusy(true);
    try {
      const r = await updateMe({ date_check_enabled: next });
      if (!('ok' in r) || !r.ok) { setOn(!next); return; }
      setOn(r.vendor.date_check_enabled === true);
      try {
        await fetch('/api/revalidate/storefront', { method: 'POST', headers: getAuthHeader() });
      } catch { /* the page catches up on its own timer */ }
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  }
  void revalidate;

  // F-40.175: `undefined` is an UNANSWERED door and renders nothing; `null` is
  // the success value (a trade that can answer) and renders the switch; a reason
  // byte renders its own sentence (R-40.78: absent, never greyed).
  const reason = cap;
  const body = reason === undefined ? null
    : reason === 'ruled_off' ? <div className="yw-fine" style={{ marginTop: 14 }}>{COPY.storefrontDateRuledOff}</div>
    : reason === 'unmapped'  ? <div className="yw-fine" style={{ marginTop: 14 }}>{COPY.storefrontDateUnmapped}</div>
    : (
      <>
        <button type="button" className="yw-switchrow" role="switch" aria-checked={live === true} aria-label={COPY.storefrontDateSwitch} onClick={toggle}>
          <span>{COPY.storefrontDateSwitch}</span>
          <span className={'yw-toggle' + (live ? ' on' : '')} />
        </button>
        <div className="yw-fine">{COPY.storefrontDateStanding}</div>
      </>
    );
  return body;
}

// ── W2 · HER ADDRESS ──────────────────────────────────────────────────────────
function AddressScreen({ address, pageUrl, handle, p2Live, rechead, say }: {
  address: string; pageUrl: string; handle: string; p2Live: boolean;
  rechead: (t: string) => ReactNode; say: (m: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let live = true; let url: string | null = null;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/v2/vendor/solutions/storefront/qr.png`, { headers: getAuthHeader() });
        if (!r.ok) return;
        url = URL.createObjectURL(await r.blob());
        if (live) setQr(url);
      } catch { /* the QR is absent, the address is not */ }
    })();
    return () => { live = false; if (url) URL.revokeObjectURL(url); };
  }, []);

  async function copy() {
    try { await navigator.clipboard.writeText(pageUrl); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { /* older browsers: the address is on screen to select */ }
  }
  function share() {
    if (typeof navigator.share === 'function') { navigator.share({ url: pageUrl }).catch(() => { /* she closed the sheet */ }); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(pageUrl)}`, '_blank', 'noopener');
    say(C.shareToast);
  }
  function download() {
    if (!qr) return;
    const a = document.createElement('a'); a.href = qr; a.download = `thedreamwedding-${handle}.png`; a.click();
    say(C.qrToast);
  }

  return (
    <>
      <style>{CSS}</style>
      {rechead(C.addrHead)}
      <div className="yw-sec">
        <div className="yw-note" style={{ paddingTop: 0 }}>{C.addrSub}</div>
        <div className="yw-big">{address}</div>
        <div className="yw-acts">
          <Primary label={copied ? C.copied : C.copy} onClick={copy} />
          <button type="button" className="yw-second" onClick={share}>{C.share}</button>
          <a className="yw-second" href={pageUrl} target="_blank" rel="noopener noreferrer">{C.openPage}</a>
        </div>
        <div className="yw-qr">
          {qr ? <img src={qr} alt={C.qrLine} /> : <div style={{ width: 112, height: 112 }} aria-busy="true" />}
          <div>
            <div className="yw-note" style={{ paddingTop: 0 }}>{C.qrLine}</div>
            <div className="yw-acts" style={{ marginTop: 10 }}><button type="button" className="yw-second" onClick={download}>{C.qrDl}</button></div>
          </div>
        </div>
      </div>
      <div className="yw-sec" style={{ paddingBottom: 32 }}>
        <div className="yw-sect">{C.domHead}</div>
        <div className="yw-note">{C.domSub}</div>
        {/* P2 · the search and the price ship as drawn when RESELLERCLUB_* + VERCEL_*
            exist (the `website` row's gate) AND the registrar packet is applied.
            Until then: one honest line, nothing that looks like it searches — a
            field that answers nothing is F-19.21's class. */}
        <div className="yw-fine" style={{ marginTop: 12 }}>{p2Live ? C.domSearchSoon : C.domSoon}</div>
      </div>
    </>
  );
}

// ── W3 · SEO — FOUND ON GOOGLE ────────────────────────────────────────────────
function GoogleScreen({ rechead, say, gStatus, gReport, seo, setSeo, things, setSheet, revalidate, derivedTitle, derivedDesc }: {
  rechead: (t: string) => ReactNode; say: (m: string) => void;
  gStatus: GStatus | null; gReport: GReport | null;
  seo: MeSeo; setSeo: (s: MeSeo) => void;
  things: Thing[]; setSheet: (s: Sheet) => void;
  revalidate: () => Promise<void>; derivedTitle: string; derivedDesc: string;
}) {
  const [title, setTitle] = useState<string>(seo.seo_title ?? derivedTitle);
  const [desc, setDesc] = useState<string>(seo.seo_description ?? derivedDesc);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setTitle(seo.seo_title ?? derivedTitle); setDesc(seo.seo_description ?? derivedDesc); }, [seo, derivedTitle, derivedDesc]);

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      // Her own byte when it differs from the derivation; NULL (= derive) when it
      // does not, so an untouched field never freezes today's derivation.
      const t = title.trim().slice(0, 70), d = desc.trim().slice(0, 200);
      const r = await updateMe({ seo_title: t && t !== derivedTitle ? t : null, seo_description: d && d !== derivedDesc ? d : null });
      if (!('ok' in r) || !r.ok) return;
      setSeo({ seo_title: r.vendor.seo_title ?? null, seo_description: r.vendor.seo_description ?? null });
      await revalidate();
      say(C.gSaveToast);
    } finally { setBusy(false); }
  }
  async function connect() {
    try {
      const r = await getJson<{ ok: boolean; authorize_url?: string }>('/api/v2/vendor/solutions/google/connect');
      if (r && r.ok && r.authorize_url) window.location.assign(r.authorize_url);
    } catch { /* the door is closed: the line below says so */ }
  }

  const connected = Boolean(gStatus && gStatus.connected);
  const configured = Boolean(gStatus && gStatus.configured);

  const sees = (
    <div className="yw-sec" style={{ paddingBottom: connected ? 32 : 0 }}>
      <div className="yw-sect">{C.gSeesH}</div>
      <div className="yw-note">{C.gSeesP}</div>
      <label className="yw-fl" htmlFor="yw-gt">{C.gTitle}</label>
      <input id="yw-gt" className="yw-fi" value={title} maxLength={70} onChange={(e) => setTitle(e.target.value)} />
      <label className="yw-fl" htmlFor="yw-gd">{C.gDesc}</label>
      <textarea id="yw-gd" className="yw-fi" value={desc} maxLength={200} onChange={(e) => setDesc(e.target.value)} />
      <div className="yw-count">{desc.length} / 200</div>
      <div className="yw-acts"><Primary label={C.save} onClick={save} /></div>
    </div>
  );

  let report: ReactNode;
  if (!connected) {
    report = (
      <div className="yw-sec" style={{ paddingBottom: 32 }}>
        <div className="yw-sect">{C.gTyped}</div>
        <div className="yw-note">{configured ? C.gConnectP : C.gOff}</div>
        {configured && <button type="button" className="yw-gbtn" onClick={connect}><GIcon />{C.gConnect}</button>}
      </div>
    );
  } else if (!gReport || !gReport.has_data || !gReport.last_28 || !gReport.prior_28) {
    report = <div className="yw-sec"><div className="yw-gdone"><GIcon /><span>{C.gEmpty}</span></div></div>;
  } else {
    const last = gReport.last_28, prior = gReport.prior_28;
    report = (
      <>
        <div className="yw-sec"><div className="yw-gdone" style={{ marginTop: 0 }}><GIcon />{C.gConnected}</div></div>
        <div className="yw-sec">
          <div className="yw-sect">{C.gLast}</div>
          <div className="yw-nums">
            <div className="yw-num"><b>{last.impressions}</b><span>{C.gSeen}<br /><em>{C.gPrev(prior.impressions)}</em></span></div>
            <div className="yw-num"><b>{last.clicks}</b><span>{C.gOpened}<br /><em>{C.gPrev(prior.clicks)}</em></span></div>
          </div>
        </div>
        <div className="yw-sec">
          <div className="yw-sect">{C.gTyped}</div>
          {gReport.queries.map((q) => <div key={q.query} className="yw-q"><span>{q.query}</span><span>{q.impressions}</span></div>)}
        </div>
        <div className="yw-sec">
          <div className="yw-sect">{C.gTodo}</div>
          <div className="yw-note">{C.gTodoP}</div>
          {things.map((t) => (
            <button key={t.t} type="button" className="yw-row" onClick={() => setSheet(t.k)}>
              <span className="yw-rowtext"><span className="yw-rowlabel">{t.t}</span><span className="yw-roweyebrow">{t.d}</span></span>
              <span className="yw-chev">{'\u203a'}</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      {rechead(C.gHead)}
      <div className="yw-sec"><div className="yw-note" style={{ paddingTop: 0 }}>{C.gSub}</div></div>
      {connected ? <>{report}{sees}</> : <>{sees}{report}</>}
    </>
  );
}

// ── THE FIX SHEETS — the place to fix it, opened over the page it changes ──────
function FixSheet({ kind, close, say, card, values, onSaved }: {
  kind: Exclude<Sheet, null>; close: () => void; say: (m: string) => void; card: Card | null;
  values: { about: string; city: string; rate: string };
  onSaved: (k: 'about' | 'city' | 'rate', v: string) => void;
}) {
  const [draft, setDraft] = useState<string>(kind === 'about' ? values.about : kind === 'city' ? values.city : kind === 'rate' ? values.rate : '');
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      if (kind === 'about') { const r = await updateMe({ about: draft.trim() }); if ('ok' in r && r.ok) { onSaved('about', draft.trim()); say(C.saveToast); close(); } }
      if (kind === 'city')  { const r = await updateMe({ city: draft.trim() });  if ('ok' in r && r.ok) { onSaved('city', draft.trim()); say(C.saveToast); close(); } }
      if (kind === 'rate')  { const n = Number(draft.replace(/[^0-9]/g, '')); if (!n) return; const r = await updateMe({ rate_min: n }); if ('ok' in r && r.ok) { onSaved('rate', String(n)); say(C.saveToast); close(); } }
    } finally { setBusy(false); }
  }

  const toPortfolio = kind === 'cover' || kind === 'photos';
  const doorHref = toPortfolio ? roomHref('portfolio') : WEDDING_PAGES_HREF;
  const doorLabel = toPortfolio ? C.openPortfolio : C.openWeddings;
  const head: [string, string] = kind === 'about' ? [C.aboutH, C.aboutP] : kind === 'city' ? [C.cityH, C.cityP] : kind === 'rate' ? [C.rateH, C.rateP]
    : kind === 'cover' ? [C.coverH, C.coverP]
    : kind === 'venue' ? [C.fixVenue, C.venueSheet]
    : kind === 'photos' ? ['Portfolio', 'Opens your Portfolio room.']
    : [C.fixWedding, 'Opens the Wedding pages room. Make a new page there \u2014 with its venue and city.'];
  const editable = kind === 'about' || kind === 'city' || kind === 'rate';

  return (
    <>
      <button type="button" className="yw-scrim" onClick={close} aria-label="Close" />
      <div className="yw-sheet" role="dialog" aria-label={head[0]}>
        <div className="yw-shhead"><div className="yw-shtitle">{head[0]}</div><button type="button" className="yw-shx" onClick={close} aria-label="Close">{'\u00d7'}</button></div>
        {head[1] && <div className="yw-shp">{head[1]}</div>}
        {kind === 'about' && <textarea className="yw-fi" value={draft} maxLength={280} onChange={(e) => setDraft(e.target.value)} />}
        {kind === 'city'  && <input className="yw-fi" value={draft} onChange={(e) => setDraft(e.target.value)} />}
        {kind === 'rate'  && <input className="yw-fi" value={draft} inputMode="numeric" onChange={(e) => setDraft(e.target.value)} placeholder="Rs" />}
        {editable
          ? <div className="yw-acts"><Primary label={C.save} onClick={save} /></div>
          : <div className="yw-acts"><button type="button" className="yw-second" onClick={close}>{C.stay}</button><Link className="yw-second" href={doorHref}>{doorLabel}</Link></div>}
      </div>
    </>
  );
}

// ── THE ONE REVALIDATE HELPER FOR EVERY OTHER WRITE IN THIS ROOM ──────────────
// (the toggle keeps its own inline call — C109 reads that the rebuild FOLLOWS
// the consent write, in that function, wrapped, never reverting the switch.)
async function revalidate() {
  try { await fetch(REVALIDATE_PATH, { method: 'POST', headers: getAuthHeader() }); }
  catch { /* the page catches up on its own timer */ }
}
const REVALIDATE_PATH = '/api/revalidate' + '/storefront';
