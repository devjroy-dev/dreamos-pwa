"use client";
// app/vendor/(shell)/posts/page.tsx — R6 rung 1 · THE "POSTS & ADS" ROOM.
// CE-42 seat R6, packet 4b-1. Base dreamos-pwa a96e2e23a73081070a9d2155e247a847938713f0.
// Frame: docs/mocks/posts-ads-mock.html (8 frames, chair-vetoed 2026-09-10), banked
// in this packet. Ruling 1(a): ONE screen, THREE sections — Cards · Broadcast · Sunday.
//
// ═══ 4b-1 BUILDS THE CARDS; THE OTHER TWO DRAW THEIR PENDING STATE ONLY ══════
// The chair's build line. Broadcast arrives in 4b-2 (0163/0164) and the Sunday
// brief in 4b-3 (dark behind `perm.instagram_business_manage_insights`). Until
// then each section shows its lede and its one vetoed pending sentence, which is
// true by construction: neither has a door to be on.
//
// ═══ THE DOOR DECIDES, THIS DRAWS (the Introductions screen's law) ═══════════
// `GET /api/v2/vendor/posts/cards` answers the three card URLs and the caption,
// or refuses with the ARM'S sentence (no gallery · not live · no address). This
// screen renders `body.error` for a refusal and holds no local map of refusals.
// A 5xx or a network failure is not a refusal the arm wrote, so it reads the
// hub's own generic byte (`COPY.surfaceUnavailable`), never a raw server string.
//
// ═══ THE CARD IS A URL (ruling 2a) ════════════════════════════════════════════
// Cloudinary renders on first fetch; there is no bucket and no byte of the image
// on our servers. Share shares that URL exactly as the website room does
// (your-website/screen.tsx, `share()`); Download fetches it and saves the bytes.
// ⚠ DEVICE-ONLY TRUTHS, named for the card: whether iOS Safari's download lands
// in Files or Photos, and whether res.cloudinary.com answers the fetch with CORS.
// If the fetch refuses, Download OPENS the image instead (she long-presses to
// save) — the deterministic path cells can prove is the URL itself.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/v2/lib/solutions/routes';
import { COPY, ROOM_ROWS } from '@/v2/lib/solutions/copy';
import { formatRs } from '@/lib/vendor/format';
import {
  PO, KINDS, cardFileName, clientsCount, feeLine, sendTo, confirmLine, sentLine, referralNextLine, messageFacts, referralFacts, EXAMPLE_CARD,
} from '@/lib/worklist/posts';
import type { CardKind, CardsBody, BroadcastPreview, BroadcastSent, BroadcastKind } from '@/lib/worklist/posts';
// CARRIED, not retyped: "They will receive" and "Back" are the Introductions room's vetoed bytes.
import { IN } from '@/lib/worklist/introductions';
import { SUNDAY_PREVIEW, FIXTURE_BRIEF, SU } from '@/lib/worklist/sunday';
import type { SundayDoor, SundayActions } from '@/lib/worklist/sunday';
import { SundaySection } from '@/v2/components/worklist/SundaySection';
import { AdsCard } from '@/v2/components/worklist/AdsCard';
import { CopyBox } from '@/v2/components/worklist/CopyBox'; // DESIGN-1 · R-46.17: the text she copies sits in its own box
const COPY_PREVIEW_EYEBROW = IN.previewEyebrow;
const COPY_BACK = IN.back;

// THE TITLE IS THE HUB ROW'S OWN LABEL, read by key — one byte, one home.
const TITLE = ROOM_ROWS.find((r) => r.key === 'posts')?.label ?? '';

// The three refusals the ARM writes. Only these render `body.error`; anything
// else is the estate's failure and reads the generic byte.
const ARM_REFUSALS = new Set(['no_gallery', 'not_live', 'no_address']);

export default function PostsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <PostsScreen />;
}

function PostsScreen() {
  const [body, setBody] = useState<CardsBody | null>(null);
  const [failed, setFailed] = useState(false);
  const [kind, setKind] = useState<CardKind>('post');
  // R-46.17 (the founder's rule, 29 Sept 2026): the caption sits in its own box with its one control.
  // "Copied" shows for two seconds after the clipboard takes it, then "Copy" again (the founder's words). In the new
  // layout the box is the one CopyBox (below), which does exactly this.

  const load = useCallback(async () => {
    try {
      // `handleResponse` does NOT throw on a non-2xx (lib/vendor/api/_base.ts) —
      // every refusal arrives as data. The catch is for the network alone.
      const b = await getJson<CardsBody>(API.postCards());
      setBody(b ?? null);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const cards = body?.ok ? body.cards : undefined;
  const url = cards ? cards[kind] : undefined;
  const refusal = body && !body.ok
    ? (body.code && ARM_REFUSALS.has(body.code) && body.error ? body.error : COPY.surfaceUnavailable)
    : (failed ? COPY.surfaceUnavailable : null);

  async function onDownload() {
    if (!url) return;
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(String(r.status));
      const obj = URL.createObjectURL(await r.blob());
      const a = document.createElement('a');
      a.href = obj; a.download = cardFileName(body?.page?.slug, kind); a.click();
      window.setTimeout(() => URL.revokeObjectURL(obj), 10_000);
    } catch {
      // The fetch refused (CORS, offline). The image itself still opens; she
      // saves it from there. Never a dead button.
      window.open(url, '_blank', 'noopener');
    }
  }

  function onShare() {
    if (!url) return;
    if (typeof navigator.share === 'function') { navigator.share({ url }).catch(() => { /* she closed the sheet */ }); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank', 'noopener');
  }

  // DESIGN-1 · R-46.17: the caption's Copy is its box's (CopyBox). No confirmation byte: none was vetoed, so the
  // control keeps its word; the caption stays selectable in the box if the clipboard refuses.

  // CE-46 FE-6 cut 1 · THE ROOM REWORKED (the founder's verdict on FE-6's mock, 30 Sept 2026): the card is the page,
  // as Portfolio's photos are. One line, the Post/Status/Story switch, the card, Download and Share side by side, the
  // caption in its own box (R-46.17). Then one row each for Ads, the two messages to past clients and the Sunday report.
  // A vendor with no wedding page yet sees the TDW-marked example (R-46.16) under W6, and the door's own sentence for
  // what to do; the example is never offered for Download or Share (R-46.16: never in a real post or ad).
  const example = !!body && !body.ok && body.code === 'no_gallery';
  const pic = example ? EXAMPLE_CARD : url;
  return (
    <WorklistShell title={TITLE}>
      <div className="pst-room">
        <p className="pst-line" data-posts-line="">{example ? PO.exampleLine : PO.ledeCards}</p>
        {(cards || example) ? (
          <>
            <div className="pst-seg" role="group" aria-label={PO.sectionCards}>
              {KINDS.map((k) => (
                <button
                  key={k.key} type="button" aria-pressed={kind === k.key}
                  className={'pst-segbtn' + (kind === k.key ? ' pst-on' : '')}
                  onClick={() => setKind(k.key)}
                >
                  {k.label}
                </button>
              ))}
            </div>
            {/* The render IS the card: Cloudinary's pixels, or the marked example. */}
            <div className={'pst-render' + (kind === 'post' ? ' pst-square' : ' pst-tall')} data-posts-card="">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pic} alt={example ? '' : (body?.page?.title ?? '')} />
              {example ? <span className="pst-mark" data-example-mark="">TDW</span> : null}
            </div>
            {example ? (
              <p className="pst-state pst-gap" data-posts-refusal="">{refusal}</p>
            ) : (
              <>
                <div className="pst-two" data-posts-actions="">
                  <button type="button" className="pst-btn pst-primary" onClick={() => void onDownload()}>{PO.download}</button>
                  <button type="button" className="pst-btn pst-ghost" onClick={onShare}>{PO.share}</button>
                </div>
                {/* LANDING · CE-46 ADS-2: the caption's own box is the one CopyBox, main's words and names */}
                {body?.caption && <CopyBox text={body.caption} label={PO.copy} copied={PO.copied} marks={{ box: 'caption-box', text: 'caption', ctl: 'copy' }} />}
              </>
            )}
          </>
        ) : refusal ? (
          <div className="pst-card"><p className="pst-state">{refusal}</p></div>
        ) : (
          <div className="pst-card" aria-busy="true" />
        )}

        {/* ── ADS (CE-46 ADS-1, R-46.13 item 2): one row, the tap into /vendor/posts/ads ── */}
        <AdsCard />

        <h2 className="pst-h">{PO.sectionBroadcast}</h2>
        <BroadcastSection />

        <h2 className="pst-h">{PO.sectionSundayReport}</h2>
        {SUNDAY_PREVIEW ? <div className="pst-eyebrow">{SU.eyebrow}</div> : null}
        <SundayRow />
      </div>

      <style>{`
/* THE LEADS-CARD IDIOM, transcribed from the Introductions room rule for rule.
   Every value is an --atelier-* or --role-* token emitted by lib/worklist/theme.ts
   (R-41.140, R-42.6); role colours use the --role- branch of prefixFor, never the
   --atelier- spelling of the frame (F-42.113). This block ships to the browser,
   so it carries no apostrophe (R-40.57) and no backtick (it is a template literal). */
.pst-room{padding-top:8px;padding-bottom:32px}
.pst-line{font:var(--wl-t4);color:var(--atelier-ink-mute);margin:0 0 16px}
.pst-h{font:var(--wl-t2);color:var(--atelier-ink);margin:24px 0 8px}
.pst-list{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);overflow:hidden;min-height:20px}
.pst-lrow{display:flex;align-items:center;gap:12px;width:100%;min-height:64px;padding:10px 16px;box-sizing:border-box;background:transparent;border:0;text-align:left;color:inherit;font:inherit;cursor:pointer;touch-action:manipulation}
.pst-lrow + .pst-lrow{border-top:1px solid var(--atelier-card-border)}
.pst-lrow:active{background:var(--atelier-row-hover)}
.pst-lrow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.pst-dead{cursor:default}.pst-dead:active{background:transparent}
.pst-rt{flex:1;min-width:0;display:flex;flex-direction:column}
.pst-rn{font:var(--wl-tb);color:var(--atelier-ink)}
.pst-rf{font:var(--wl-t4);color:var(--atelier-ink-mute);margin-top:2px}
.pst-pill{font:var(--wl-t5);padding:4px 10px;border-radius:999px;border:1px solid currentColor;white-space:nowrap;color:var(--atelier-ink-mute)}
.pst-pill-run{color:var(--role-positive)}.pst-pill-wait{color:var(--role-caution)}
.pst-chev{color:var(--atelier-ink-mute);font:var(--wl-t2);transition:transform .15s}
.pst-chev-open{transform:rotate(90deg)}
.pst-under{margin-top:12px}
.pst-mark{position:absolute;right:10px;bottom:8px;font:var(--wl-t5);color:var(--role-on-primary);opacity:.85;letter-spacing:.04em;pointer-events:none}
.pst-sh{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}
.pst-st{margin:0;font:var(--wl-t2);color:var(--atelier-ink)}
.pst-x{min-width:44px;min-height:44px;border:0;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-t2);cursor:pointer}
.pst-who-list{margin:8px 0 0;padding:0 16px}
.pst-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.pst-secgap{margin-top:24px}
.pst-lede{font:var(--wl-t3);color:var(--atelier-ink-soft);line-height:1.5;margin:0 0 12px}
.pst-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:12px;padding:16px;margin-bottom:var(--wl-step);min-height:20px}
.pst-state{font:var(--wl-t3);color:var(--atelier-ink-soft);line-height:1.5;margin:0}
.pst-seg{display:flex;border:.5px solid var(--atelier-card-border);border-radius:12px;margin-bottom:12px;overflow:hidden}
.pst-segbtn{flex:1;padding:12px 0;min-height:44px;background:transparent;border:none;font:var(--wl-t4);color:var(--atelier-ink-dim);cursor:pointer;touch-action:manipulation}
.pst-segbtn+.pst-segbtn{border-left:.5px solid var(--atelier-card-border)}
.pst-on{background:var(--role-primary);color:var(--role-on-primary)}
.pst-segbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.pst-render{position:relative;border-radius:12px;margin:0 auto 12px;background:var(--atelier-section-bg);overflow:hidden}
.pst-render img{display:block;width:100%;height:100%;object-fit:cover}
.pst-square{width:100%;aspect-ratio:1/1}
.pst-tall{width:56%;aspect-ratio:9/16}
.pst-lbl{display:block;font:var(--wl-t5);letter-spacing:.07em;text-transform:uppercase;color:var(--atelier-label);margin:16px 0 4px}
.pst-caption{font:var(--wl-t3);color:var(--atelier-ink);line-height:1.5;background:var(--atelier-section-bg);padding:12px 12px;margin:0 0 12px;word-break:break-word;user-select:text}
.pst-btn{width:100%;padding:12px;min-height:48px;border-radius:12px;font:var(--wl-tb);cursor:pointer;touch-action:manipulation}
.pst-primary{background:var(--role-primary);color:var(--role-on-primary);border:1px solid var(--role-primary)}
.pst-primary:active{background:var(--atelier-row-hover)}
.pst-ghost{background:transparent;color:var(--atelier-accent-text);border:.5px solid var(--atelier-card-border)}
.pst-ghost:active{background:var(--atelier-row-hover)}
.pst-btn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.pst-two{display:flex;gap:8px;margin:0 0 12px}
.pst-two > .pst-btn{flex:1}
.pst-eyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--role-caution);margin:0 0 8px}
.pst-week{font:var(--wl-t3);color:var(--atelier-ink);margin:0 0 12px}
.pst-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.pst-tile{border:.5px solid var(--atelier-card-border);border-radius:12px;padding:12px;background:var(--atelier-section-bg)}
.pst-n{font:var(--wl-t1);color:var(--atelier-ink);margin-top:4px}
.pst-note{font:var(--wl-t5);color:var(--atelier-ink-dim);margin-top:4px;line-height:1.4}
.pst-arrow{font:var(--wl-t5);margin-top:4px}
.pst-up{color:var(--role-positive)}.pst-down{color:var(--role-critical)}.pst-flat{color:var(--atelier-ink-mute)}
.pst-held{grid-column:1/3;opacity:.55}
.pst-chip{font:var(--wl-t5);padding:4px 8px;border:.5px solid var(--atelier-card-border);border-radius:12px;color:var(--atelier-ink-mute);margin-left:8px;text-transform:none;letter-spacing:0}
.pst-best{display:flex;gap:12px;align-items:center;width:100%;margin-top:8px;padding:0;background:transparent;border:none;cursor:pointer;text-align:left;min-height:44px}
.pst-thumb{width:64px;height:64px;flex:none;object-fit:cover;background:linear-gradient(160deg,var(--atelier-sheet-top),var(--atelier-overlay-bg))}
.pst-who{font:var(--wl-t3);color:var(--atelier-ink)}
.pst-sharecard{background:var(--atelier-section-bg);position:relative}
.pst-sharetxt{position:absolute;left:8%;right:8%;bottom:9%}
.pst-sharet{font:500 1.0625rem/1.15 var(--font-cormorant),Georgia,serif;color:var(--atelier-ink)}
.pst-sharen{font:500 0.8125rem/1.6 var(--font-dm-sans),system-ui,sans-serif;color:var(--role-metal);margin-top:8px}
.pst-lbl0{margin-top:0}
.pst-body{font:var(--wl-t3);color:var(--atelier-ink);line-height:1.55;margin:0}
.pst-btnchip{margin-top:12px;text-align:center;padding:8px;border:.5px solid var(--atelier-card-border);border-radius:12px;color:var(--atelier-accent-text);font:var(--wl-t4)}
.pst-link{margin-top:8px;font:var(--wl-t5);color:var(--atelier-ink-fade);text-align:center;word-break:break-all}
.pst-fee{font:var(--wl-t4);color:var(--atelier-ink-soft);margin:12px 0 0}
.pst-gap{margin-top:12px}
.pst-foot{font:var(--wl-t5);color:var(--atelier-ink-dim);margin:12px 0 0;line-height:1.5}
.pst-count{font:var(--wl-t2);color:var(--atelier-ink)}
.pst-list{margin-top:8px}
.pst-row{font:var(--wl-t3);color:var(--atelier-ink);padding:8px 0;border-top:.5px solid var(--atelier-card-border)}
.pst-row:first-child{border-top:0}
.pst-over{position:fixed;inset:0;background:var(--atelier-overlay);display:flex;align-items:flex-end;z-index:50}
.pst-sheet{width:100%;box-sizing:border-box;max-height:85vh;overflow-y:auto;border-top-left-radius:16px;border-top-right-radius:16px;padding:16px 16px calc(24px + env(safe-area-inset-bottom));background:linear-gradient(180deg,var(--atelier-sheet-top),var(--atelier-sheet-bot));border-top:.5px solid var(--atelier-sheet-border)}
.pst-q{font:var(--wl-t2);color:var(--atelier-ink);line-height:1.4;margin:0 0 16px}
      `}</style>
    </WorklistShell>
  );
}

// ═══ 4b-3b · THE SUNDAY BRIEF, LIVE ═════════════════════════════════════════
// The door decides (src/lib/vendor/sundayBrief.js readForDoor) — one of the
// shell's codes, the accepted Brief, the signed share card. This component
// draws nothing: it hands SundaySection the door's answer and the real actions,
// so the chrome is 4b-3a's byte for byte (R-42.14). The Connect anchor is
// PRE-MINTED the moment the door says she must connect (portfolio/screen.tsx's
// law — no await between her finger and the navigation), re-minted every 8
// minutes while this tab is visible (the server state lives 10). "Check again"
// POSTs refresh (generate now, throttled server-side) and re-reads.
function SundayLive() {
  const [door, setDoor] = useState<SundayDoor | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [connectHref, setConnectHref] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      const d = refresh
        ? await postJson<SundayDoor>(API.postSundayRefresh(), {})
        : await getJson<SundayDoor>(API.postSunday());
      setDoor(d); setFailed(false);
    } catch { setFailed(true); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const needsConnect = !!door && (door.state === 'connect' || door.state === 'notconnected' || door.state === 'expired');
  const mint = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; authorize_url?: string }>(API.igAuthorizeInsights());
      setConnectHref(r && r.authorize_url ? r.authorize_url : null);
    } catch { setConnectHref(null); }
  }, []);
  useEffect(() => {
    if (!needsConnect) { setConnectHref(null); return; }
    void mint();
    const MINT_REFRESH_MS = 8 * 60 * 1000;
    const t = window.setInterval(() => { if (document.visibilityState === 'visible') void mint(); }, MINT_REFRESH_MS);
    return () => window.clearInterval(t);
  }, [needsConnect, mint]);

  const cardUrl = door?.share_card_url ?? null;
  async function onDownload() {
    if (!cardUrl) return;
    try {
      const r = await fetch(cardUrl);
      if (!r.ok) throw new Error(String(r.status));
      const obj = URL.createObjectURL(await r.blob());
      const a = document.createElement('a');
      a.href = obj; a.download = 'my-week-on-instagram.jpg'; a.click();
      window.setTimeout(() => URL.revokeObjectURL(obj), 10_000);
    } catch {
      window.open(cardUrl, '_blank', 'noopener');
    }
  }
  function onShare() {
    if (!cardUrl) return;
    if (typeof navigator.share === 'function') { navigator.share({ url: cardUrl }).catch(() => { /* she closed the sheet */ }); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(cardUrl)}`, '_blank', 'noopener');
  }
  const actions: SundayActions = {
    connectHref,
    onConnectMint: () => { void mint(); },
    onCheckAgain: () => { if (busy) return; setBusy(true); void load(true).finally(() => setBusy(false)); },
    onShare, onDownload, shareCardUrl: cardUrl, busy,
  };

  if (!door && !failed) return <div className="pst-list" aria-busy="true" />;
  const state = failed || !door ? 'error' : door.state;
  // CE-46 FE-6 cut 1: the report is ONE row. Waiting on Instagram's approval it reads Coming soon, with no chevron and
  // no tap (R-46.14); otherwise the row opens the section in place, below it (never a sheet on a sheet).
  if (state === 'pending') return (
    <div className="pst-list"><div className="pst-lrow pst-dead" data-sunday-row="" data-dead="">
      <div className="pst-rt"><div className="pst-rn">{PO.sundayRow}</div><div className="pst-rf">{PO.sundayPending}</div></div>
      <span className="pst-pill" data-pill="">{PO.comingSoon}</span>
    </div></div>
  );
  const fact = state === 'connect' || state === 'notconnected' ? SU.connect : state === 'expired' ? SU.expired
    : state === 'error' ? COPY.surfaceUnavailable : PO.ledeSunday;
  return (
    <>
      <div className="pst-list">
        <button type="button" className="pst-lrow" data-sunday-row="" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="pst-rt"><span className="pst-rn">{PO.sundayRow}</span><span className="pst-rf">{fact}</span></span>
          <span className={'pst-chev' + (open ? ' pst-chev-open' : '')} aria-hidden="true">{'\u203a'}</span>
        </button>
      </div>
      {open ? <div className="pst-under"><SundaySection state={state} brief={door ? door.brief : null} actions={actions} /></div> : null}
    </>
  );
}

function SundayRow() {
  return SUNDAY_PREVIEW ? <SundaySection state="live" brief={FIXTURE_BRIEF} /> : <SundayLive />;
}

// ═══ 4b-2 · THE BROADCAST SECTION ═══════════════════════════════════════════
// The door decides (src/lib/vendor/broadcasts.js); this draws. Every refusal is a
// CODE and each code maps to its vetoed byte here — `dark` to "Not switched on
// yet.", never cap.reason()'s sentence (F-42.193). The fee is formatRs over the
// door's whole paise; the screen holds no rate and does no arithmetic but /100.
// A gate that is off shows its sentence IN PLACE of the Send button: a real dark,
// a real sentence, and no control that can only refuse (the chair's CTA ruling:
// Send is live infrastructure, not a preview).
function BroadcastSection() {
  const [pv, setPv] = useState<BroadcastPreview | null>(null);
  const [failed, setFailed] = useState(false);
  const [confirm, setConfirm] = useState<BroadcastKind | null>(null);
  const [openKind, setOpenKind] = useState<BroadcastKind | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ kind: BroadcastKind; line: string } | null>(null);
  const [refusal, setRefusal] = useState<{ kind: BroadcastKind; line: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const b = await getJson<BroadcastPreview>(API.postBroadcast());
      if (b?.ok) { setPv(b); setFailed(false); } else { setFailed(true); }
    } catch { setFailed(true); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (failed) return <div className="pst-card"><p className="pst-state">{COPY.surfaceUnavailable}</p></div>;
  if (!pv) return <div className="pst-list" aria-busy="true" />;
  const n = pv.count ?? 0;
  // WHOLE OR NOT AT ALL (the wallet law, frame 5): the space inside "Rs 6.12" becomes a
  // no-break space so the figure can never split across a line in the sheet or the row.
  const fee = typeof pv.fee_paise === 'number' ? formatRs(pv.fee_paise / 100).replace(' ', '\u00a0') : null;

  function refusalLine(code: string | undefined, error: string | undefined): string {
    if (code === 'dark') return PO.notOnYet;
    if (code === 'no_couples') return PO.noCouples;
    if (code === 'already_this_year' && pv?.referral_next) return referralNextLine(pv.referral_next);
    if (code === 'no_address' && error) return error;           // the tent-card door's carried byte
    return COPY.surfaceUnavailable;
  }

  async function onSend(kind: BroadcastKind) {
    setBusy(true); setRefusal(null);
    try {
      const r = await postJson<BroadcastSent>(API.postBroadcast(), { kind });
      if (r?.ok) {
        setDone({ kind, line: sentLine(r.sent ?? 0, r.not_delivered ?? 0) });
        await load();
      } else {
        setRefusal({ kind, line: refusalLine(r?.code, r?.error) });
      }
    } catch {
      setRefusal({ kind, line: COPY.surfaceUnavailable });
    } finally {
      setBusy(false); setConfirm(null);
    }
  }

  // CE-46 FE-6 cut 1: each message is ONE row (its name, who and what it costs). A tap opens its sheet: who receives
  // it, the message, then Send; Send turns the same sheet into the confirm step (never a sheet on a sheet).
  const label = (kind: BroadcastKind) => (kind === 'couple' ? PO.coupleLabel : PO.referralLabel);
  const facts = (kind: BroadcastKind) => (n === 0 ? PO.noCouples : kind === 'couple' ? messageFacts(n, fee) : referralFacts(pv.referral_next));
  const row = (kind: BroadcastKind) => (n === 0 ? (
    <div className="pst-lrow pst-dead" key={kind} data-message-row={kind} data-dead="">
      <div className="pst-rt"><div className="pst-rn">{label(kind)}</div><div className="pst-rf">{facts(kind)}</div></div>
    </div>
  ) : (
    <button type="button" className="pst-lrow" key={kind} data-message-row={kind} onClick={() => { setOpenKind(kind); setConfirm(null); }}>
      <span className="pst-rt"><span className="pst-rn">{label(kind)}</span><span className="pst-rf">{facts(kind)}</span></span>
      <span className="pst-chev" aria-hidden="true">{'\u203a'}</span>
    </button>
  ));

  const sheet = (kind: BroadcastKind) => {
    const on = !!pv.on?.[kind];
    const spent = kind === 'referral' && !!pv.referral_next;
    const close = () => { if (!busy) { setOpenKind(null); setConfirm(null); } };
    return (
      <div className="pst-over" role="dialog" aria-modal="true" aria-label={label(kind)} onClick={close} data-message-sheet={kind}>
        <div className="pst-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="pst-sh"><h2 className="pst-st">{label(kind)}</h2><button type="button" className="pst-x" aria-label={COPY_BACK} onClick={close}>{'\u00d7'}</button></div>
          {confirm === kind && fee ? (
            <>
              <p className="pst-q">{confirmLine(n, fee)}</p>
              <div className="pst-two">
                <button type="button" className="pst-btn pst-ghost" disabled={busy} onClick={() => setConfirm(null)}>{COPY_BACK}</button>
                <button type="button" className="pst-btn pst-primary" disabled={busy} onClick={() => void onSend(kind)}>{sendTo(n)}</button>
              </div>
            </>
          ) : (
            <>
              <div className="pst-count">{clientsCount(n)}</div>
              <div className="pst-list pst-who-list">
                {(pv.couples ?? []).map((c, i) => (
                  <div className="pst-row" key={`${c.last4}-${i}`}>
                    {/* A list is not a phonebook: her book's name, else the last four. */}
                    {c.name || `\u2022\u2022\u2022\u2022 ${c.last4}`}
                  </div>
                ))}
              </div>
              <span className="pst-lbl">{COPY_PREVIEW_EYEBROW}</span>
              <p className="pst-body">{pv.bodies?.[kind]}</p>
              {pv.button_label ? <div className="pst-btnchip">{pv.button_label}</div> : null}
              {pv.page_url ? <div className="pst-link">{pv.page_url.replace(/^https?:\/\//, '')}</div> : null}
              {fee ? <p className="pst-fee">{feeLine(fee)}</p> : null}
              {done?.kind === kind ? <p className="pst-state pst-gap">{done.line}</p> : null}
              {refusal?.kind === kind ? <p className="pst-state pst-gap">{refusal.line}</p> : null}
              {spent ? (
                <p className="pst-foot">{referralNextLine(pv.referral_next as string)}</p>
              ) : !on ? (
                <p className="pst-state pst-gap">{PO.notOnYet}</p>
              ) : fee ? (
                <button type="button" className="pst-btn pst-primary pst-gap" disabled={busy} onClick={() => setConfirm(kind)}>
                  {sendTo(n)}
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="pst-list">{row('couple')}{row('referral')}</div>
      {openKind ? sheet(openKind) : null}
    </>
  );
}
