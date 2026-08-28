"use client";
// app/w/support/page.tsx — BUSINESS SOLUTIONS, THE ROOM INDEX (R-19.2).
//
// ═══════════════════════════════════════════════════════════════════════════
// WHAT THIS PAGE WAS, AND WHAT SURVIVED THE TAKEOVER
// ═══════════════════════════════════════════════════════════════════════════
// It was the coming-soon sheet (R-37.66/.67 arm c′) — one sentence and a button
// that reached a human on WhatsApp. R-19.2 makes it the index of six surfaces.
//
// THE WHATSAPP LINE SURVIVES, AS THE FOOTER. Ruled at CE-38 relay #1 item 6, and
// the reasoning is worth keeping at the site: displacing it would have traded
// the one row on this page that reaches a person for six rows that all read
// `Coming`. It consumes `COPY.supportAction` UNCHANGED (the footer body shrank to
// the ruled one-liner at the founder walk — see the footer block below)
// from `lib/worklist/copy.ts` — read, never edited, because that file is the
// M-FINISH S2 seat's (kickoff §2). No string is orphaned and no relay was needed.
//
// THE NUMBER IS STILL NEVER INLINE. `supportWaNumber()` remains the declared
// home. F-09.190 counts six homes for that number already; this makes no seventh.
//
// THE TITLE IS UNCHANGED. `rooms.ts:62` already labels this room `Business
// Solutions` and `copy.ts` already reads `supportTitle: 'Business Solutions'`,
// so the tile, the shell title and this page agreed before it was written.
//
// ── R-38.2 · THE FRAME RENDERS FIRST ───────────────────────────────────────
// The six rows render IMMEDIATELY, with their `coming` chips, before any fetch
// resolves. `GET /solutions` then supplies each row's real state. A vendor never
// sees a spinner where her rooms should be, and if the call fails she sees the
// six rows plus a sentence — not an empty page. Billing paid for this lesson;
// this page inherits it.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { COPY as WL } from '@/lib/worklist/copy';
import { supportWaNumber } from '@/lib/waNumbers';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS } from '@/lib/solutions/copy';
import { SURFACE_SLUGS, surfaceHref } from '@/lib/solutions/routes';
import { fetchIndex } from '@/lib/solutions/client';
import type { SolutionsRow } from '@/lib/solutions/types';
import { SurfaceRow, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function SolutionsIndexPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <SolutionsIndexScreen />;
}

function SolutionsIndexScreen() {
  // `null` means "not answered yet", and the rows render `coming` meanwhile —
  // which is also the truthful answer while every gate is closed, so the first
  // paint is never a lie that the fetch later corrects.
  const [rows, setRows] = useState<SolutionsRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchIndex()
      .then((ix) => { if (alive) setRows(ix.rows as SolutionsRow[]); })
      .catch(() => { if (alive) setErr(COPY.indexUnavailable); });
    return () => { alive = false; };
  }, []);

  const stateFor = (slug: string): SolutionsRow['state'] =>
    rows?.find((r) => r.slug === slug)?.state ?? 'coming';

  return (
    <WorklistShell title={WL.supportTitle}>
      <p className="sol-eyebrow" style={{ paddingTop: 14 }}>{COPY.indexEyebrow}</p>
      {err ? <p className="sol-err">{err}</p> : null}
      <nav className="sol-rows">
        {SURFACE_SLUGS.map((slug) => (
          <SurfaceRow
            key={slug}
            href={surfaceHref(slug)}
            label={ROWS[slug]}
            eyebrow={ROW_EYEBROWS[slug]}
            state={stateFor(slug)}
          />
        ))}
      </nav>

      {/* The one row that reaches a human. Strings from their own home.
          ⚠ THE CLASS IS `wl-supportaction`, NOT `sol-btn`, AND THAT IS DELIBERATE.
          The first cut renamed it — gratuitously, since this is the same button
          doing the same job in the same place — and `b40` C10 went RED: its tap-
          target census at `scripts/b40_worklist_shell_bench.js:162` maps
          `app/w/support/page.tsx` to exactly this class, and the rule vanished
          from under it. The button is the worklist's support action, not a
          solutions button, so its name was right and the rename was the error.
          Cured here rather than relayed: an S2 census that correctly tracks a
          live element should not be edited to accommodate a rename that bought
          nothing. Its rule is carried below, ≥44px, where the census can see it. */}
      <div className="sol-footer">
        {/* ── DESK NOTE · THE FOOTER SHRINKS TO THE RULED ONE-LINER ──────────
            Was `WL.supportBody`, a four-line paragraph about SEO, ads and
            campaign pages — written when this room WAS the offer. The six rows
            above now say all of that, so the paragraph repeated the page back to
            itself and pushed the one control that reaches a human below the fold.

            The ruled line is `Something broken? Message us on WhatsApp.` and it
            renders as exactly that: THE TAIL OF THE SENTENCE IS THE BUTTON.
            `WL.supportAction` already reads `Message us on WhatsApp`, so those
            four words keep their one home in the S2 seat's file and this seat
            adds only the three that are new.

            ⚠ `WL.supportBody` is now unreferenced — an orphan in
            `lib/worklist/copy.ts`, which is S2's. Reported, not touched. */}
        <p className="sol-footerbody">{COPY.footerLine}</p>
        <button
          type="button"
          className="wl-supportaction"
          onClick={() => window.open(
            `https://wa.me/${supportWaNumber()}?text=${encodeURIComponent('Hi')}`,
            '_blank', 'noopener',
          )}
        >
          {WL.supportAction}
        </button>
      </div>
      <SolutionsStyles />
      <style>{`
/* Carried from the surface this page replaced, byte-for-byte in its properties.
   R-38.5: the column owns the gutter — vertical only, no horizontal inset. */
.wl-supportaction{background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.wl-supportaction:active{background:var(--atelier-row-hover)}
.wl-supportaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
      `}</style>
    </WorklistShell>
  );
}
