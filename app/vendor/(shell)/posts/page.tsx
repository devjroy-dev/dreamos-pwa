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
import { getJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { COPY, ROOM_ROWS } from '@/lib/solutions/copy';
import { PO, KINDS, cardFileName } from '@/lib/worklist/posts';
import type { CardKind, CardsBody } from '@/lib/worklist/posts';

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

        {/* ── BROADCAST (4b-2 builds it; pending until then) ──────────────── */}
        <div className="pst-sec pst-secgap">{PO.sectionBroadcast}</div>
        <p className="pst-lede">{PO.ledeBroadcast}</p>
        <div className="pst-card"><p className="pst-state">{PO.notOnYet}</p></div>

        {/* ── SUNDAY (4b-3 builds it, dark; pending until then) ────────────── */}
        <div className="pst-sec pst-secgap">{PO.sectionSunday}</div>
        <p className="pst-lede">{PO.ledeSunday}</p>
        <div className="pst-card"><p className="pst-state">{PO.sundayPending}</p></div>
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
      `}</style>
    </WorklistShell>
  );
}
