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
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { COPY, ROOM_ROWS } from '@/lib/solutions/copy';
import { formatRs } from '@/lib/vendor/format';
import {
  PO, KINDS, cardFileName, couplesCount, feeLine, sendTo, confirmLine, sentLine, referralNextLine,
} from '@/lib/worklist/posts';
import type { CardKind, CardsBody, BroadcastPreview, BroadcastSent, BroadcastKind } from '@/lib/worklist/posts';
// CARRIED, not retyped: "They will receive" and "Back" are the Introductions room's vetoed bytes.
import { IN } from '@/lib/worklist/introductions';
import { SUNDAY_PREVIEW, FIXTURE_BRIEF, SU } from '@/lib/worklist/sunday';
import { SundaySection } from '@/components/worklist/SundaySection';
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

  async function onCopyCaption() {
    if (!body?.caption) return;
    // No confirmation byte: none was vetoed, and the caption is on screen to
    // select if the clipboard refuses.
    try { await navigator.clipboard.writeText(body.caption); } catch { /* selectable on screen */ }
  }

  return (
    <WorklistShell title={TITLE}>
      <div className="pst-room">
        {/* ── CARDS ───────────────────────────────────────────────────────── */}
        <div className="pst-sec">{PO.sectionCards}</div>
        <p className="pst-lede">{PO.ledeCards}</p>

        {refusal ? (
          <div className="pst-card"><p className="pst-state">{refusal}</p></div>
        ) : cards ? (
          <div className="pst-card">
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

            {/* The render IS the card: Cloudinary's pixels, Graphite on both arms. */}
            <div className={'pst-render' + (kind === 'post' ? ' pst-square' : ' pst-tall')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={body?.page?.title ?? ''} />
            </div>

            <span className="pst-lbl">{PO.caption}</span>
            <p className="pst-caption">{body?.caption}</p>

            <button type="button" className="pst-btn pst-primary" onClick={() => void onDownload()}>{PO.download}</button>
            <div className="pst-two">
              <button type="button" className="pst-btn pst-ghost" onClick={onShare}>{PO.share}</button>
              <button type="button" className="pst-btn pst-ghost" onClick={() => void onCopyCaption()}>{PO.copyCaption}</button>
            </div>
          </div>
        ) : (
          <div className="pst-card" aria-busy="true" />
        )}

        {/* ── BROADCAST (4b-2) ───────────────────────────────────────────────── */}
        <div className="pst-sec pst-secgap">{PO.sectionBroadcast}</div>
        <p className="pst-lede">{PO.ledeBroadcast}</p>
        <BroadcastSection />

        {/* ── SUNDAY (4b-3a: the shell, behind SUNDAY_PREVIEW; 4b-3b wires the door) ── */}
        <div className="pst-sec pst-secgap">{PO.sectionSunday}</div>
        {SUNDAY_PREVIEW ? <div className="pst-eyebrow">{SU.eyebrow}</div> : null}
        <p className="pst-lede">{PO.ledeSunday}</p>
        <SundaySection state={SUNDAY_PREVIEW ? 'live' : 'pending'} brief={SUNDAY_PREVIEW ? FIXTURE_BRIEF : null} />
      </div>

      <style>{`
/* THE LEADS-CARD IDIOM, transcribed from the Introductions room rule for rule.
   Every value is an --atelier-* or --role-* token emitted by lib/worklist/theme.ts
   (R-41.140, R-42.6); role colours use the --role- branch of prefixFor, never the
   --atelier- spelling of the frame (F-42.113). This block ships to the browser,
   so it carries no apostrophe (R-40.57) and no backtick (it is a template literal). */
.pst-room{padding-top:20px;padding-bottom:28px}
.pst-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.pst-secgap{margin-top:22px}
.pst-lede{font:var(--wl-t3);color:var(--atelier-ink-soft);line-height:1.5;margin:0 0 12px}
.pst-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:14px;margin-bottom:var(--wl-step);min-height:20px}
.pst-state{font:var(--wl-t3);color:var(--atelier-ink-soft);line-height:1.5;margin:0}
.pst-seg{display:flex;border:.5px solid var(--atelier-card-border);border-radius:2px;margin-bottom:12px;overflow:hidden}
.pst-segbtn{flex:1;padding:10px 0;min-height:44px;background:transparent;border:none;font:var(--wl-t4);color:var(--atelier-ink-dim);cursor:pointer;touch-action:manipulation}
.pst-segbtn+.pst-segbtn{border-left:.5px solid var(--atelier-card-border)}
.pst-on{background:var(--role-metal);color:var(--role-ink-on-metal)}
.pst-segbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.pst-render{margin:0 auto;background:var(--atelier-section-bg);overflow:hidden}
.pst-render img{display:block;width:100%;height:100%;object-fit:cover}
.pst-square{width:100%;aspect-ratio:1/1}
.pst-tall{width:56%;aspect-ratio:9/16}
.pst-lbl{display:block;font:var(--wl-t5);letter-spacing:.07em;text-transform:uppercase;color:var(--atelier-label);margin:14px 0 5px}
.pst-caption{font:var(--wl-t3);color:var(--atelier-ink);line-height:1.5;background:var(--atelier-section-bg);padding:10px 11px;margin:0 0 12px;word-break:break-word;user-select:text}
.pst-btn{width:100%;padding:12px;min-height:44px;border-radius:2px;font:var(--wl-t3);cursor:pointer;touch-action:manipulation}
.pst-primary{background:var(--role-metal);color:var(--role-ink-on-metal);border:.5px solid var(--role-metal)}
.pst-primary:active{background:var(--atelier-row-hover)}
.pst-ghost{background:transparent;color:var(--atelier-ink-soft);border:.5px solid var(--atelier-card-border)}
.pst-ghost:active{background:var(--atelier-row-hover)}
.pst-btn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.pst-two{display:flex;gap:9px;margin-top:9px}
.pst-eyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--role-caution);margin:0 0 8px}
.pst-week{font:var(--wl-t3);color:var(--atelier-ink);margin:0 0 10px}
.pst-tiles{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px}
.pst-tile{border:.5px solid var(--atelier-card-border);border-radius:3px;padding:11px;background:var(--atelier-section-bg)}
.pst-n{font:var(--wl-t1);color:var(--atelier-ink);margin-top:4px}
.pst-note{font:var(--wl-t5);color:var(--atelier-ink-dim);margin-top:4px;line-height:1.4}
.pst-arrow{font:var(--wl-t5);margin-top:3px}
.pst-up{color:var(--role-positive)}.pst-down{color:var(--role-critical)}.pst-flat{color:var(--atelier-ink-mute)}
.pst-held{grid-column:1/3;opacity:.55}
.pst-chip{font:var(--wl-t5);padding:3px 8px;border:.5px solid var(--atelier-card-border);border-radius:2px;color:var(--atelier-ink-mute);margin-left:6px;text-transform:none;letter-spacing:0}
.pst-best{display:flex;gap:11px;align-items:center;width:100%;margin-top:8px;padding:0;background:transparent;border:none;cursor:pointer;text-align:left;min-height:44px}
.pst-thumb{width:64px;height:64px;flex:none;object-fit:cover;background:linear-gradient(160deg,var(--atelier-sheet-top),var(--atelier-overlay-bg))}
.pst-who{font:var(--wl-t3);color:var(--atelier-ink)}
.pst-sharecard{background:var(--atelier-section-bg);position:relative}
.pst-sharetxt{position:absolute;left:8%;right:8%;bottom:9%}
.pst-sharet{font:500 19px/1.15 var(--font-cormorant),Georgia,serif;color:var(--atelier-ink)}
.pst-sharen{font:500 9.5px/1.6 var(--font-dm-sans),system-ui,sans-serif;color:var(--role-metal);margin-top:6px}
.pst-lbl0{margin-top:0}
.pst-body{font:var(--wl-t3);color:var(--atelier-ink);line-height:1.55;margin:0}
.pst-btnchip{margin-top:12px;text-align:center;padding:9px;border:.5px solid var(--atelier-card-border);border-radius:2px;color:var(--atelier-accent-text);font:var(--wl-t4)}
.pst-link{margin-top:6px;font:var(--wl-t5);color:var(--atelier-ink-fade);text-align:center;word-break:break-all}
.pst-fee{font:var(--wl-t4);color:var(--atelier-ink-soft);margin:12px 0 0}
.pst-gap{margin-top:12px}
.pst-foot{font:var(--wl-t5);color:var(--atelier-ink-dim);margin:12px 0 0;line-height:1.5}
.pst-count{font:var(--wl-t2);color:var(--atelier-ink)}
.pst-list{margin-top:8px}
.pst-row{font:var(--wl-t3);color:var(--atelier-ink);padding:9px 0;border-top:.5px solid var(--atelier-card-border)}
.pst-row:first-child{border-top:0}
.pst-over{position:fixed;inset:0;background:var(--atelier-overlay);display:flex;align-items:flex-end;z-index:50}
.pst-sheet{width:100%;padding:20px 16px 26px;background:linear-gradient(180deg,var(--atelier-sheet-top),var(--atelier-sheet-bot));border-top:.5px solid var(--atelier-sheet-border)}
.pst-q{font:var(--wl-t2);color:var(--atelier-ink);line-height:1.4;margin:0 0 16px}
      `}</style>
    </WorklistShell>
  );
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
  if (!pv) return <div className="pst-card" aria-busy="true" />;
  const n = pv.count ?? 0;
  if (n === 0) return <div className="pst-card"><p className="pst-state">{PO.noCouples}</p></div>;
  // WHOLE OR NOT AT ALL (the wallet law, frame 5): the space inside "Rs 6.12" becomes a
  // no-break space so the figure can never split across a line in the sheet or the card.
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

  const card = (kind: BroadcastKind) => {
    const on = !!pv.on?.[kind];
    const spent = kind === 'referral' && !!pv.referral_next;
    return (
      <div className="pst-card" key={kind}>
        <span className="pst-lbl pst-lbl0">{kind === 'couple' ? COPY_PREVIEW_EYEBROW : PO.referralLabel}</span>
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
      </div>
    );
  };

  return (
    <>
      <div className="pst-card">
        <div className="pst-count">{couplesCount(n)}</div>
        <div className="pst-list">
          {(pv.couples ?? []).map((c, i) => (
            <div className="pst-row" key={`${c.last4}-${i}`}>
              {/* A list is not a phonebook: her book's name, else the last four. */}
              {c.name || `\u2022\u2022\u2022\u2022 ${c.last4}`}
            </div>
          ))}
        </div>
      </div>
      {card('couple')}
      {card('referral')}

      {confirm && fee ? (
        <div className="pst-over" role="dialog" aria-modal="true">
          <div className="pst-sheet">
            <p className="pst-q">{confirmLine(n, fee)}</p>
            <div className="pst-two">
              <button type="button" className="pst-btn pst-ghost" disabled={busy} onClick={() => setConfirm(null)}>{COPY_BACK}</button>
              <button type="button" className="pst-btn pst-primary" disabled={busy} onClick={() => void onSend(confirm)}>{sendTo(n)}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
