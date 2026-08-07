'use client';
// app/wedding/page.tsx — AI Hub · Atelier rebuild
//
// The Hub at dusk. Brass-lamp gradient bleeding in from upper-left.
// Greeting in italic Cormorant. Three-cell brass ledger above a ◆ printer's mark.
// Calling card with corner ornaments for new enquiries.
// DreamAi message styled as a whisper — italic Cormorant beside a luminous brass hairline.
//
// All hooks, primer/autoSend logic, streaming, and OnboardingOverlay are preserved.
// Only the visual layer changes.

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/vendor/Header';
import { VictorModeChip } from '@/components/vendor/VictorModeChip'; // TDW_06 P6d (R-2)
import { ChatThread } from '@/components/vendor/ChatThread';
import { FreshThreadControl } from '@/components/vendor/FreshThreadControl'; // TDW_06 D-7
import { InputBar } from '@/components/vendor/InputBar';
import { TierMeter } from '@/components/vendor/TierMeter'; // TDW_02 P5
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useCabinetData, useTodayData } from '@/hooks/vendor/useVendorData'; // TDW_04 A3: binder truth, already cached on this screen · TDW_09 O-2 R-O18: the waiting zone's loader
import { deriveMoney, type MoneyDerivation } from '@/lib/vendor/derive'; // TDW_04 A3: THE derivation
import { setVendorSession } from '@/lib/vendor/session';

import { getJson } from '@/lib/vendor/api/_base';
import { useChat } from '@/hooks/vendor/useChat';
import { useToast } from '@/hooks/vendor/useToast';
import { Toast } from '@/components/vendor/Toast';
import { createNote, reportGlitch, fetchDiscoverStatus } from '@/lib/vendor/api/vendor'; // TDW_06 M-3: the Report chip's route

import { OnboardingOverlay } from '@/components/vendor/OnboardingOverlay';
import Cabinet from '@/components/vendor/Cabinet';
// TDW_09 P2-R1 — F-09.21's pressed primitive, worn by the ledger door (F-09.91(b)).
import { pressedStyle } from '@/lib/vendor/controls';
// ── WALK HOTFIX MICRO · F-09.112 — the late-load flash, this screen's limb ──
import { Reserve } from '@/components/vendor/Reserve';
import { useT } from '@/lib/vendor/ThemeContext';
import type { VendorContextResponse, TodayResponse, DiscoverStatus } from '@/lib/vendor/types/vendor';
import { formatRs, fitMoneySize, moneyNeedsReflow } from '@/lib/vendor/format'; // TDW_09 R-U25/R-U24 · MICRO-2 R2: the reflow branch, F-09.80

// ── Static Atelier tokens (non-theme-sensitive) ──────────────────
const A = {
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassDeep: 'var(--role-metal)',
  brassLine: 'rgba(201,168,76,0.18)',
  brassSoft: 'rgba(201,168,76,0.28)',
  terracotta:'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

// ── TDW_09 O-2 · R-O14-AMENDED — QUICK_ACTIONS IS REMOVED-DEAD ─────────────
// The CommandBar's primer array. The bar itself was REMOVED-BY-FOUNDER-RULING at
// TDW_07 MICRO-2, and that deletion's CE-115 inventory accounted all five of its
// CONTROLS — but not this data structure, which survived unconsumed (F-09.54:
// "a readout inventory that missed a data structure"). Derived by command before
// removal, not assumed: `QUICK_ACTIONS` appeared exactly once in this file and
// nowhere else in app/, components/, lib/ or hooks/ — a declaration with no
// reader. Not a control, so R-X30's parity line is untouched. O-2 rewrites this
// file; carrying a corpse through a rewrite is how F-08.89s breed.

// ── THE COMPACT FORMATTER IS DEAD (TDW_09 R-U24) ─────────────────────
// TDW_04 A3 (ST-4's acceptance, executor judgment — flagged for CE review):
// the compact form must not ROUND AWAY the agreement it exists to prove. The
// old one-decimal L (and whole-number K) printed Rs 1,25,000 as "1.3L" and
// Rs 65,400 as "65K" — while the Invoices masthead, reading the SAME
// derivation, printed the exact figure. A vendor comparing the two saw a
// disagreement that wasn't there. Compaction is a design need (this brass cell
// is ~120px wide); rounding is not. So: keep the compact scale, drop the lie —
// trailing zeros stripped, real precision kept (1.25L, 65.4K, 1.3L when it IS
// 1.3L). Only used by the Owed cell (verified: one call site, ln ~181).
// THE COMMENT ABOVE IS SUPERSEDED and is kept only as the record of what it argued.
// It reasoned that compaction was a DESIGN NEED because the brass Owed cell is
// ~120px wide, and that only the ROUNDING was a lie. R-U24 rules otherwise: the
// register law forbids the short forms on any rendered byte, and this cell's own
// ellipsis meant the honest alternative would have rendered a figure the reader
// cannot tell is incomplete — a worse lie than the compaction ever was.
//
// THE MECHANISM THAT REPLACES IT, NAMED HERE SO ITS NEXT SITTING RE-READS THIS
// SENTENCE (F-06.85): `fitMoneySize` in lib/vendor/format.ts computes the largest
// type size at which the WHOLE figure fits, and the cell steps down to it.
// Compaction was the thing the law forbade; type size is free. The Ledger already
// stepped this cell 48 -> 34 for money, so this extends a mechanism, not invents one.
function fmtRs(n: number): string {
  return formatRs(n);
}
function fmtEventDate(iso: string): string {
  try {
    const d = new Date(iso);
    const today = new Date();
    const diff  = Math.round((d.getTime() - today.setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return 'tomorrow';
    if (diff <= 6)  return d.toLocaleDateString('en-IN', { weekday: 'long' }).toLowerCase();
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch (_e) { return iso; }
}
function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Good Evening';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ── Greeting line — Cormorant italic. Reads as a butler announcing the moment ──
function GreetingLine({ context, money, today }: { context: VendorContextResponse | null; money: MoneyDerivation; today: TodayResponse | null }) {
  const T = useT();
  const greeting = timeOfDayGreeting();
  const timeOfDay = greeting.toLowerCase().includes('evening') ? 'evening'
                  : greeting.toLowerCase().includes('afternoon') ? 'afternoon'
                  : 'morning';

  // TDW_04 A3 (ST-4/L-4), AMENDED TDW_09 O-2 · R-O12/R-O15 — LETTERS NO LONGER
  // STAY TYPED. The sentence this comment used to carry ("letters stay TYPED;
  // enquiries are typed rows") defended a plane this code no longer reads, and
  // leaving it would have been a trap set for the next reader (F-06.85).
  //
  // THE MECHANISM, NAMED SO ITS NEXT SITTING RE-READS THIS: the figure is
  // TodayResponse.open_leads_count, served by src/api/vendor-engine/today.js —
  // the ENGINE plane, the same binder ledger deriveMoney reads. It is the
  // route's only true count; its sibling `needs_attention.new_leads` is a
  // display list capped at ten and must never be used for a figure.
  //
  // WHY IT MOVED (F-09.49): the old read was `context.new_leads.length`, off
  // public.leads via vendor/context.js — a DIFFERENT TABLE, filtered
  // state='new', capped at `.limit(5)`. Founder-witnessed on 2026-08-06: eleven
  // live enquiries, five rendered. Not a drift between zones — a lid the vendor
  // could not see past. The Ledger below reads the SAME figure from the SAME
  // payload, because one derivation means one on the SCREEN, not one per
  // component; re-plumbing half the screen would have reproduced F-09.49 with
  // its own cure.
  const leads = today?.open_leads_count ?? 0;
  const owedCount = money.owedCount;

  // ── F-09.112 CURED — THE GREETING NO LONGER REWRITES ITSELF ───────────────
  // THIS FILE READ, until this delivery:  `if (!context) { line = 'Welcome
  // back.'; }` — and that is not a blank, it is a PROVISIONAL SENTENCE. The
  // founder opened his home screen, read "Welcome back.", and watched it become
  // "Nine letters await you this morning, and five invoices remain." Words
  // swapping under the eye is the thing he convicted, 2026-08-07. S5 Paper C
  // rule 5 governs: loading is skeleton, never blank — and never a placeholder
  // sentence either, which is worse than blank because it reads as the answer.
  //
  // THE MECHANISM, NAMED SO ITS NEXT SITTING RE-READS THIS (F-06.85): `context`
  // is VendorContextResponse, and this component is rendered by the home before
  // that fetch settles. The cure returns null-for-line and lets the caller
  // render a reserved skeleton instead. It does NOT touch the sentence
  // construction below — R-O12/R-O15's one-derivation law and R-O17's spell()
  // ceiling are byte-untouched; only the pre-arrival state changed.
  //
  // RESIDUAL, DECLARED RATHER THAN HIDDEN (§8 declared-gaps): the loaded line
  // is one or two line-boxes depending on her actual figures, so a skeleton
  // cannot reserve it exactly without knowing the answer it is waiting for. The
  // skeleton reserves TWO boxes — the taller outcome, and the founder's own
  // account (12 leads + open invoices) renders the two-clause sentence. A
  // one-line outcome therefore collapses upward by one 28px box, once. The
  // alternative — padding the LOADED state to two lines always — was refused:
  // the ruling requires zero visual change once loaded.
  const pending = !context;

  let line: string;
  if (!context) {
    line = '';
  } else if (leads === 0 && owedCount === 0) {
    line = 'A quiet day. Everything in order.';
  } else if (leads > 0 && owedCount > 0) {
    const leadWord = leads === 1 ? 'One letter awaits' : `${spell(leads)} letters await you`;
    // TDW_09 O-2, founder's walk 2026-08-06: this half of the sentence rendered a
    // NUMERAL while its other half spelled — "Nine letters await you this morning,
    // and 5 invoices remain." Pre-existing, but R-O17's ceiling made it glaring by
    // pushing the letters into words the invoices never used. One sentence, one
    // register. spell() falls through to digits above twenty for both halves, so
    // they stay matched at every size.
    const invWord  = owedCount === 1 ? 'one invoice remains' : `${spell(owedCount).toLowerCase()} invoices remain`;
    line = `${leadWord} this ${timeOfDay}, and ${invWord}.`;
  } else if (leads > 0) {
    line = leads === 1
      ? `One letter awaits you this ${timeOfDay}.`
      : `${spell(leads)} letters await you this ${timeOfDay}.`;
  } else {
    line = owedCount === 1
      ? `One invoice remains to be collected.`
      : `${spell(owedCount)} invoices remain to be collected.`;
  }

  return (
    <div style={{ textAlign: 'center', padding: '16px 24px 4px' }}>
      <div style={{
        fontFamily: F.label, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.42em', textTransform: 'uppercase',
        color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.7)', marginBottom: 10,
      }}>{greeting}</div>
      {/* The GREETING WORD ITSELF is never pending — timeOfDayGreeting() reads
          the clock, not the network, so it paints correct on the first frame
          and is deliberately left outside the skeleton. Only the sentence
          waits. */}
      {pending ? (
        <div style={{ maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          {/* 28px = the loaded sentence's own 20px Cormorant at lineHeight 1.4 */}
          <Reserve h={28} w="100%" />
          <Reserve h={28} w="64%" />
        </div>
      ) : (
        <div style={{
          fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
          fontSize: 20, color: T.inkSoft,
          lineHeight: 1.4, letterSpacing: '0.01em',
          maxWidth: 320, margin: '0 auto',
        }}>{line}</div>
      )}
    </div>
  );
}

// Spell small integers — keeps the greeting reading like prose, not data
//
// TDW_09 O-2 · R-O17 (founder-ruled, arm (b)) — THE CEILING MOVED 10 -> 20, AND
// THE MECHANISM THAT FORCED IT IS NAMED HERE SO ITS NEXT SITTING RE-READS THIS
// SENTENCE (F-06.85). The old ceiling of ten was never reachable: the greeting's
// source was `context.new_leads`, and vendor/context.js caps that read at
// `.limit(5)`. The prose could not have rendered a numeral if it tried. R-O12
// re-plumbs both readers onto TodayResponse.open_leads_count — an UNCAPPED count
// — so the first vendor past ten would have read "12 letters await you this
// morning." on a line built for words. The founder's own test account sits at 12.
//
// WHY TWENTY AND NOT HIGHER: past twenty, English numerals become hyphenated
// compounds ("twenty-three letters await you") that read as clutter in a
// one-line greeting and stop sounding like a butler announcing the moment. The
// ledger cell directly beneath carries the exact figure at any size, so nothing
// is lost by falling through to digits above the ceiling — the prose gives up
// the number precisely where the number stops being prose.
function spell(n: number): string {
  const words = [
    'Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen',
    'Eighteen','Nineteen','Twenty',
  ];
  return n >= 0 && n <= 20 ? words[n] : String(n);
}

// ── The Ledger — three brass cells with a ◆ printer's mark above ──
function Ledger({ context, money, today }: { context: VendorContextResponse | null; money: MoneyDerivation; today: TodayResponse | null }) {
  const T = useT();
  // TDW_04 A3 (ST-4/L-4) — one derivation, two renderers: `owed` here and
  // `outstanding` on the Invoices masthead are the same call into
  // lib/vendor/derive.ts over the same binder rows. They cannot drift.
  //
  // TDW_09 O-2 · R-O12/R-O15 — AND NOW `leads` OBEYS THE SAME LAW. It reads
  // TodayResponse.open_leads_count off the ENGINE plane
  // (src/api/vendor-engine/today.js), which is the binder ledger `owed` already
  // derives from — so this strip's own sub-copy, "from your binders", is a true
  // sentence for the first time. It was false while Letters read public.leads
  // through vendor/context.js (F-09.49). GreetingLine above reads THE SAME
  // FIGURE FROM THE SAME PAYLOAD; if a future sitting moves one, it moves both.
  // Never `needs_attention.new_leads.length` — that list is capped at ten
  // (today.js:108) and is a display slice, not a count.
  const leads      = today?.open_leads_count ?? 0;
  const owed       = money.outstanding;
  const owedCount  = money.owedCount;
  const nextEvent  = context?.upcoming_events?.[0] ?? null;

  // ── TDW_09 MICRO-2 RIDER 2 · F-09.58 — THE STRIP MEASURES ITSELF ─────────────
  // WHAT THE FOUNDER CAUGHT, and it killed the theory this defect was filed under:
  // the SAME frame renders this strip correctly on a quiet ledger and clips it on a
  // loaded one. 「 renders fine before the home page loads. thereafter, alignment
  // goes down the right side drain 」. The width never changed; the data did. So
  // F-09.58 is not a 390px design floor — it is data-dependent, at any width.
  // THE MECHANISM: LedgerCell is `flex: 1`, i.e. flex-basis 0%, but a flex item's
  // min-width defaults to AUTO, and every line in the cell is nowrap. The cell
  // therefore floors at its longest unbroken string, flex-basis never binds, and
  // the strip's min-content width is the sum of three strings. `overflow: hidden`
  // and `textOverflow: ellipsis` were already on those lines and could do nothing:
  // overflow clips, it does not lower min-content width. `minWidth: 0` does, and it
  // is the one byte that makes the ellipsis below finally mean something.
  // WHY AN OBSERVER AND NOT A FORMULA. The money fit used a hardcoded 100 derived
  // once against a 390 viewport. The true inner width is (V - 44 - 16)/3 - 8 —
  // 92 at 360, 102 at 390, 115 at 430 — so that constant was 8px OPTIMISTIC on a
  // 360 handset, where a rupee figure would clip silently: R-U24's named violation
  // arriving through its own guard. A formula would fix the number and keep the
  // coupling to four geometry constants that a future padding change would break
  // in silence. This measures the box that actually renders. ONE observer on the
  // container, never three on the cells; it disconnects on unmount below.
  // PRE-MEASURE IS SAFE BY CONTRACT: cellInner starts 0, and fitMoneySize returns
  // its floor for any non-positive width, which cannot clip. One frame at the
  // smallest step is the whole cost.
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [cellInner, setCellInner] = useState(0);
  useEffect(() => {
    const el = stripRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(([entry]) => {
      // The container's own box, minus its horizontal padding, split three ways,
      // minus each cell's horizontal padding. Read from the render, not assumed.
      const w = entry.contentRect.width;               // padding already excluded
      setCellInner(Math.max(0, w / 3 - CELL_PAD_X * 2));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const owedText = fmtRs(owed);
  // F-09.80 — `moneyNeedsReflow` was exported by lib/vendor/format.ts for exactly
  // this branch ("Exported so a cell can BRANCH instead of silently clipping, which
  // is the whole point of the clause") and had ZERO callers repo-wide until now.
  // At 360 the founder's own figure trips it: 'Rs 5,00,000' at the 18px floor wants
  // 99px and the cell holds 92. Without this branch, minWidth:0 would have made the
  // strip fit by clipping the rupee figure — curing F-09.58 by committing R-U24.
  // The figure stays WHOLE and wraps instead; the strip is alignItems:'stretch', so
  // the neighbours follow the taller cell.
  const owedReflow = owed > 0 && cellInner > 0 && moneyNeedsReflow(owedText, cellInner, 18);

  // ── TDW_09 P2-R1 · F-09.91 arm (b), FOUNDER-RULED — THE STRIP IS THE DOOR ──
  // 「 the natural inclination of any user will be to click the bar with
  // numbers written and see where it takes 」. The strip now opens Your Books:
  // it dispatches `tdw-open-books`, and Cabinet.tsx's listener answers
  // (mechanism pair — grep the event name). The crest handle it replaces is
  // retired in Cabinet.tsx with its own tombstone. F-09.21: an interactive
  // surface wears the pressed acknowledgment; reduced-motion read inline.
  const [pressed, setPressed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  return (
    <div ref={stripRef}
      role="button" tabIndex={0}
      aria-label="Open your books"
      onClick={() => window.dispatchEvent(new CustomEvent('tdw-open-books'))}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('tdw-open-books')); } }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
      display: 'flex', alignItems: 'stretch',
      padding: '14px 8px 12px',
      margin: '10px 22px 0',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      ...pressedStyle(pressed, reducedMotion),
      borderTop: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : A.brassSoft}`,
      borderBottom: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : A.brassSoft}`,
      position: 'relative',
    }}>
      {/* Printer's mark ◆ — small brass diamond floating above the rule.
          The bgWarm padding trick "cuts" the top border behind it. */}
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
        background: `linear-gradient(180deg, ${T.pageBg} 0%, ${T.pageBg} 60%, transparent 100%)`,
        padding: '0 14px', height: 14, display: 'flex', alignItems: 'center',
        color: T.isLight ? T.accent : A.brass, fontSize: 16, lineHeight: 1.5, letterSpacing: '0.3em',
      }}>◆</div>

      <LedgerCell
        big={String(leads)}
        bigSize={48}
        label="Letters"
        // L-4's lane clause: enquiries stay typed — the sub-line says whose plane.
        sub={leads === 0 ? 'enquiries · all replied' : 'enquiries · awaiting reply'}
        accent={leads > 0}
      />
      <LedgerCell
        big={owed > 0 ? owedText : '—'}
        // TDW_09 R-U24: the whole figure, at whatever size holds it — now computed
        // against the MEASURED cell rather than a constant derived at one viewport.
        // No width literal survives in this call; that is acceptance number ②.
        bigSize={owed > 0 ? fitMoneySize(owedText, cellInner, 34, 18) : 48}
        bigReflow={owedReflow}
        label="Owed"
        // Lane honesty: this figure is your binders' truth, not a stale invoice table.
        sub={owedCount === 0 ? 'from your binders · settled' : owedCount === 1 ? 'from your binders · 1 open' : `from your binders · ${owedCount} open`}
        accent={owed > 0}
        bigColor={owed > 0 ? (T.isLight ? T.accent : A.brassWarm) : undefined}
        divider
      />
      <LedgerCell
        big={nextEvent ? fmtEventDate(nextEvent.event_date) : '—'}
        bigSize={nextEvent ? 22 : 48}
        bigFamily={nextEvent ? F.script : undefined}
        bigItalic={!!nextEvent}
        label="Next"
        sub={nextEvent ? nextEvent.title : 'no engagements'}
        accent={!!nextEvent}
        divider
      />
    </div>
  );
}

// One home for the cell's horizontal padding: the observer's arithmetic and the
// cell's own style must not drift, and a second literal is how they would.
const CELL_PAD_X = 4;

function LedgerCell({
  big, label, sub, accent, bigSize = 46, bigColor, bigFamily, bigItalic, divider, bigReflow,
}: {
  big: string; label: string; sub: string; accent?: boolean;
  bigSize?: number; bigColor?: string; bigFamily?: string; bigItalic?: boolean;
  divider?: boolean; bigReflow?: boolean;
}) {
  const T = useT();
  return (
    <div style={{
      // TDW_09 MICRO-2 RIDER 2 · F-09.58 — THE ONE BYTE. `flex: 1` is `flex-basis:
      // 0%`, but min-width defaults to AUTO on a flex item, so this cell could never
      // shrink below its longest nowrap string and the basis never bound. With
      // minWidth 0 the three cells split the strip evenly whatever they contain, and
      // the ellipsis on the sub-line below stops being decorative.
      flex: 1, minWidth: 0, textAlign: 'center', padding: `0 ${CELL_PAD_X}px`,
      position: 'relative',
    }}>
      {divider && (
        <span aria-hidden style={{
          position: 'absolute', left: 0, top: '12%', bottom: '12%',
          width: '0.5px', background: T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.22)',
        }} />
      )}
      <div style={{
        fontFamily: bigFamily ?? F.display,
        fontWeight: 400,
        fontStyle: bigItalic ? 'italic' : 'normal',
        fontSize: bigSize,
        lineHeight: 1,
        color: bigColor ?? (accent ? 'var(--atelier-ink)' : 'var(--atelier-ink-dim)'),
        letterSpacing: '-0.01em',
        // ── TDW_09 R-U24 — THE CLIPPING PROPERTY IS DELETED FROM THIS CELL ─────
        // Truncating a money figure is its own violation class: the clipped form
        // reads as a complete number to anyone not counting digits. The cell no
        // longer needs it — `fitMoneySize` guarantees the whole figure fits before
        // it renders — and keeping it would leave a silent clipper armed for the
        // first figure the estimate underserves. `overflow: hidden` stays as the
        // container's own hygiene; nothing should reach it.
        // R-U24 HOLDS AND IS LOAD-BEARING HERE: still no textOverflow, because an
        // ellipsised money figure reads as a complete number. When the figure cannot
        // hold one line at the floor size, the caller sets bigReflow and it WRAPS —
        // whole, on two lines — rather than being cut.
        whiteSpace: bigReflow ? 'normal' : 'nowrap',
        overflowWrap: bigReflow ? 'anywhere' : undefined,
        overflow: 'hidden',
      }}>{big}</div>
      <div style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 8,
        letterSpacing: '0.34em', textTransform: 'uppercase',
        color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginTop: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
        fontSize: 16, lineHeight: 1.5, color: T.inkDim,
        marginTop: 2, letterSpacing: '0.02em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{sub}</div>
    </div>
  );
}

// ── TDW_09 O-2 · R-O14-AMENDED — EnquiryCard IS REMOVED-DEAD (F-09.52) ─────
// The Calling Card. RENDER COUNT ON THE REAL PLANE: ZERO — defined here, never
// mounted in this file's JSX tree, derived by a full control census of all 611
// lines rather than by grep. Its live twin runs on the demo plane at
// app/demo/vendor/[handle]/studio/page.tsx, whose own :66-68 comment names the
// reason the pair survived: incompatible signatures, unconvergeable without a
// shape ruling. So the mirror was alive and the thing it mirrored was dead —
// F-08.1's disease, inverted.
//
// WHAT REPLACES IT, NAMED SO NOTHING LOOKS AMPUTATED: zone 2, WHAT'S WAITING.
// The card's job — surface an unanswered enquiry and offer to draft a reply —
// becomes a waiting LINE in the spec's one-to-three-line shape, keeping the
// card's own `Reply →` verb (R-O19) and seeding the input through
// `draft` -> InputBar initialValue, the live rendered mechanism (R-O14-AMENDED).
// Not a control (render count zero — the census is the witness), so R-X30's
// parity line is untouched.

// ── ZONE 2 — WHAT'S WAITING (R-X23 §1, R-O19 copy) ─────────────────────────
// TYPE: every size here is a NAMED RUNG (scripts/tdw09_type_census.mjs RUNGS —
// register [8,9,10] for engraved uppercase, body [16,20,25,31,39,49]). The first
// cut of these zones used 17, 15 and 14; the type floor went 16/16 -> 13/16 and
// named them ad-hoc. Weight between the line and its trailing note is carried by
// COLOUR, never by an off-ladder size.
// One to three lines, ONLY items needing his hand, each tappable to its act,
// ABSENT ENTIRELY WHEN EMPTY. The zero-collapse law: an empty waiting zone
// renders NOTHING — never a cheerful "all clear" card. The charter's test is the
// bar: does it answer "what happened while I was away?" faster than the vendor
// could ask Victor? A standing status line fails that test and is a dashboard
// relapse; only things awaiting his hand belong here.
//
// SOURCE: TodayResponse.needs_attention, one payload, no per-line fetch.
// F-09.51 stands corrected on the record: the endpoint is shipped, but the HOME
// did not call it — this zone costs one fetch, and it is paid once for all lines.
//
// VERB ASSIGNMENT — ALL THREE FOUNDER-WORDED. R-O19 ruled `Reply →` and
// `Confirm →` but not which line type takes which; that mapping was proposed
// from this desk, disclosed rather than assumed, and the money line's own verb
// came back as R-O21 (founder-worded, 「 Remind works 」). The ledger, closed:
//   enquiry         -> `Reply →`    (R-O19)  — seeds a message to a client
//   overdue invoice -> `Remind →`   (R-O21)  — its own act, not a reply
//   hold            -> `Confirm →`  (R-O19)  — settles a calendar fact, no message
// No verb on this surface is the executor's. A new line type needs a new founder
// byte before it ships; this comment is where that lands.
function daysSince(iso: string): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 86400000));
}
function ageWord(days: number): string {
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

type WaitingLine = { key: string; text: string; verb: string; draft: string; href?: string };

function buildWaitingLines(today: TodayResponse | null, discoverPending: boolean): WaitingLine[] {
  if (!today) return [];
  const na = today.needs_attention;
  const lines: WaitingLine[] = [];

  for (const l of na?.new_leads ?? []) {
    const who = l.name ?? 'A new enquiry';
    lines.push({
      key: `lead:${l.id}`,
      text: `${who} — enquired ${ageWord(daysSince(l.created_at))}`,
      verb: 'Reply →',
      draft: `I'd like to reply to ${l.name ?? 'this enquiry'}. Draft something warm but not pushy.`,
    });
  }
  for (const inv of na?.overdue_invoices ?? []) {
    lines.push({
      key: `inv:${inv.id}`,
      text: `${inv.client_name ?? 'A client'} — ${fmtRs(inv.amount_owed)} overdue`,
      verb: 'Remind →',
      draft: `${inv.client_name ?? 'This client'} has ${fmtRs(inv.amount_owed)} overdue. Draft a polite payment reminder.`,
    });
  }
  // THE DISCOVER MEMBER (R-X23 §1's fourth line, shown ONLY while pending).
  // THE STATE WORD IS 'requested', DERIVED FROM THE SERVER, NOT FROM THE TYPE.
  // `DiscoverStatus.discover_request_state` is typed as a bare `string`; the real
  // vocabulary lives in the writers — 'not_requested' (discover.js:131 default),
  // 'requested' (discover.js:80), 'approved' / 'denied' / 'revoked'
  // (admin/discover.js:52/65/78). Shaping this member from its type name would
  // have tested for 'pending' — a word the server never writes — and produced a
  // line that could never render: a silent zero, which is not a check.
  // Approved-and-live is NOT news and never renders here (dashboard relapse);
  // only the waiting state does.
  if (discoverPending) {
    lines.push({
      key: 'discover:pending',
      text: 'Storefront — awaiting Discover approval',
      verb: '',
      draft: '',
      href: '/vendor/discover',
    });
  }
  for (const e of na?.events_today ?? []) {
    lines.push({
      key: `evt:${e.id}`,
      text: `${e.title} — today, unconfirmed`,
      verb: 'Confirm →',
      draft: `Confirm the hold for "${e.title}" today.`,
    });
  }
  return lines;
}

function WaitingZone({ today, discoverPending, onAct, onOpen, onOverflow }: {
  today: TodayResponse | null;
  discoverPending: boolean;
  onAct: (draft: string) => void;
  onOpen: (href: string) => void;
  onOverflow: () => void;
}) {
  const T = useT();
  const all = buildWaitingLines(today, discoverPending);
  if (all.length === 0) return null;          // ← the zero-collapse law, at the byte

  const shown = all.slice(0, 3);              // ceiling of three, per R-X23 §1
  const extra = all.length - shown.length;

  return (
    <div style={{ margin: '14px 22px 0' }}>
      <div style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 8,
        letterSpacing: '0.34em', textTransform: 'uppercase',
        color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginBottom: 8,
      }}>What&rsquo;s waiting</div>

      {shown.map((line) => (
        <button
          key={line.key}
          type="button"
          onClick={() => (line.href ? onOpen(line.href) : onAct(line.draft))}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', gap: 12,
            background: 'none', border: 'none',
            borderBottom: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.12)' : A.brassLine}`,
            padding: '11px 0', minHeight: 44,      // F-09.22's floor — a real touch box
            textAlign: 'left', cursor: 'pointer',
          }}
        >
          <span style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 16, lineHeight: 1.4, color: T.ink,
          }}>{line.text}</span>
          <span style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T.isLight ? T.accent : A.brassWarm, flexShrink: 0,
          }}>{line.verb}</span>
        </button>
      ))}

      {extra > 0 && (
        <button
          type="button"
          onClick={onOverflow}
          style={{
            background: 'none', border: 'none', padding: '10px 0', minHeight: 44,
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16,
            color: T.inkDim, cursor: 'pointer', textAlign: 'left', width: '100%',
          }}
        >{`…and ${extra} more →`}</button>
      )}
    </div>
  );
}

// ── THE THIS-WEEK STRIP (R-X23 §2 IN-candidate, sourced per R-O13) ─────────
// One quiet line under zone 2, ABSENT when the week is empty.
//
// SOURCE IS TodayResponse.this_week, NOT context.upcoming_events (R-O13): the
// today payload is already paid for by zone 2, `this_week` is IST-bounded to
// [today, today+7] by its own query (vendor-engine/today.js:58-59), and its rows
// carry stable `id`s — the context shape carries none, so it could not furnish
// honest keys.
//
// ⚠ DECLARED CONDITIONAL (F-09.53, R-O16-AMENDED): the today route's events
// query does NOT filter `deleted_at`, while the day-sheet covenant
// ("deleted_at + cancelled: the covenant, read side, every events read",
// src/api/vendor/day.js:59) and vendor/context.js:88 both DO. Until the dream-os
// micro's fourth limb lands, a soft-deleted engagement can appear in this strip
// while the Next cell above it — which reads context — correctly hides it.
// Founder-witnessed 2026-08-06: zero soft-deleted rows on the live account, so
// the leak is unexercised, not absent. THIS STRIP'S CORRECTNESS IS CONDITIONAL
// ON THAT CLAUSE. Do not grade it green on this file alone.
function WeekStrip({ today }: { today: TodayResponse | null }) {
  const T = useT();
  const week = today?.this_week ?? [];
  if (week.length === 0) return null;         // ← zero-collapse, second site

  return (
    <div style={{
      margin: '12px 22px 0',
      fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
      fontSize: 16, lineHeight: 1.5, color: T.inkDim,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {'This week — '}
      {week.map((e, i) => (
        <span key={e.id}>
          {i > 0 ? ' · ' : ''}
          {fmtEventDate(e.event_date)}{' '}{e.title}
        </span>
      ))}
    </div>
  );
}

// ── THE FIRST-RUN CHAPTER (R-X23 §3) ───────────────────────────────────────
// On a home with nothing filed: zone 2 renders nothing, the ledger stands honest
// at zero (F-07.90 — zero IS an answer, never a blank), and the space carries
// LABELLED EXAMPLES. Each is marked `Example` — the founder's ruled word, NEVER
// `Hint` — each seeds the input on tap, and they RETIRE the moment real data
// exists. They are teaching lines, not content, and they say so on their face:
// the honesty architecture rendered — nothing pretends to be a lead that isn't.
//
// THE RETIREMENT PREDICATE, STATED SO A BENCH CAN ASSERT IT: exemplars render
// iff the home is empty on every axis the ledger reports — no open leads, no
// money owed, no week. Any one of them arriving retires the exemplars, which is
// what the files-one-lead-sees-them-gone cell drives. Strings are R-O19's.
const EXEMPLARS = [
  'Hold 14 Dec for the Kapoor mehndi',
  "What's owed this month?",
];

function isFirstRun(today: TodayResponse | null, money: MoneyDerivation): boolean {
  if (!today) return false;                   // unknown is not empty — never teach over a pending fetch
  const na = today.needs_attention;
  const waiting =
    (na?.new_leads?.length ?? 0) +
    (na?.overdue_invoices?.length ?? 0) +
    (na?.events_today?.length ?? 0);
  return waiting === 0
    && (today.open_leads_count ?? 0) === 0
    && (money.outstanding ?? 0) === 0
    && (today.this_week?.length ?? 0) === 0;
}

function FirstRunExemplars({ onAct }: { onAct: (draft: string) => void }) {
  const T = useT();
  return (
    <div style={{ margin: '16px 22px 0' }}>
      {EXEMPLARS.map((text) => (
        <button
          key={text}
          type="button"
          onClick={() => onAct(text)}
          style={{
            display: 'flex', alignItems: 'baseline', gap: 10, width: '100%',
            background: 'none', border: 'none',
            borderBottom: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.12)' : A.brassLine}`,
            padding: '11px 0', minHeight: 44, textAlign: 'left', cursor: 'pointer',
            opacity: 0.78,
          }}
        >
          <span style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 8,
            letterSpacing: '0.34em', textTransform: 'uppercase',
            color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', flexShrink: 0,
          }}>Example</span>
          <span style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 16, lineHeight: 1.4, color: T.ink,
          }}>{`“${text}”`}</span>
          <span style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 16, color: T.inkDim, marginLeft: 'auto', flexShrink: 0,
          }}>tap to try</span>
        </button>
      ))}
    </div>
  );
}

// ── Page root ───────────────────────────────────────────────────
export default function WeddingChatPage() {
  const router = useRouter();
  const [seeded, setSeeded] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const fromStorage = localStorage.getItem('vendor_session') || localStorage.getItem('vendor_web_session');
      if (!fromStorage) {
        const cookieMatch = document.cookie.split('; ').find(r => r.startsWith('tdw_vendor_session='));
        if (cookieMatch) {
          const cookieVal = decodeURIComponent(cookieMatch.split('=').slice(1).join('='));
          const parsed = JSON.parse(cookieVal);
          if (parsed?.access_token) {
            setVendorSession(parsed);
            // demo flag removed — vendor demo system deleted
          }
        }
      }
    } catch (_e) { /* ignore */ }
    setSeeded(true);
  }, []);

  const { session, loading: sessionLoading } = useVendorSession();

  useEffect(() => {
    if (seeded === null) return;
    if (!sessionLoading && !session) { router.replace('/'); return; }
    if (!sessionLoading && session) {
      // Verify JWT against backend — catches expired tokens and wrong accounts.
      // If the stored session points to the wrong vendor (e.g. stale mock),
      // the /me response will have a different vendor ID — force re-login.
      getJson<{ ok: boolean; vendor?: Record<string, unknown> }>('/api/v2/vendor/me', true)
        .then(data => {
          if (!data.ok) {
            // 401 / bad token — clear and redirect
            import('@/lib/vendor/session').then(({ clearVendorSession }) => {
              clearVendorSession();
              router.replace('/');
            });
            return;
          }
          if (data.vendor) {
            const remoteId  = data.vendor.id as string;
            const sessionId = session.id;
            if (remoteId && sessionId && remoteId !== sessionId) {
              // Session ID doesn't match what backend says — stale/wrong account
              console.warn('[vendor/page] session ID mismatch — clearing');
              import('@/lib/vendor/session').then(({ clearVendorSession }) => {
                clearVendorSession();
                router.replace('/');
              });
              return;
            }
            // Check onboarding state
            const state = data.vendor.onboarding_state as string | null;
            if (state && state !== 'complete') {
              router.replace('/vendor/onboarding');
            }
          }
        })
        .catch(() => { /* non-fatal — network error, stay on chat */ });
    }
  }, [seeded, sessionLoading, session, router]);

  if (seeded === null) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (sessionLoading) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (!session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <Suspense fallback={<div style={{ flex: 1 }} aria-busy="true" />}>
      <ChatScreen vendorId={session.id} vendorName={session.name} />
    </Suspense>
  );
}

function ChatScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const T            = useT();

  const autoSendPrimer = searchParams?.get('primer') ?? '';
  const autoSend       = searchParams?.get('autoSend') === '1';
  const aiPrimer       = searchParams?.get('aiPrimer') ?? '';
  const draft          = searchParams?.get('draft') ?? '';

  const { messages, loading, context, send, injectAiMessage, meta, freshThread, markFreshThread } = useChat({ vendorId }); // TDW_02 P5: +meta · TDW_06 D-7: +freshThread
  // TDW_04 A3 (ST-4/L-4): the hub's money leaves the typed plane. The cabinet
  // is already on this screen (the YOUR BOOKS drawer reads it through the same
  // cached hook — no new network call), and deriveMoney is the same function
  // the Invoices page runs. That is the repoint: not new numbers, the SAME ones.
  const cab = useCabinetData(vendorId);
  const money = useMemo(() => deriveMoney(cab.data), [cab.data]);

  // ── TDW_09 O-2 · R-O18 — the WHAT'S WAITING payload, and its two triggers ──
  // TRIGGER 1 (the house pattern) lives inside the hook: subscribeToSlice('leads')
  // catches every form-driven write (SliceShell / AddSheet).
  // TRIGGER 2 IS HERE, AND IT IS THE ONE THE ACCEPTANCE CELL RIDES (F-09.55):
  // useChat is OFF the slice bus. A lead filed by talking to Victor calls that
  // hook's private refreshContext() at useChat.ts:176 and emits no slice event,
  // so a slice subscriber alone would be deaf to exactly the act the
  // files-one-lead-sees-them-gone cell is built on — green on fixtures, wrong on
  // the founder's screen. refreshContext() calls setContext() with a fresh object
  // from fetchContext, so `context` identity changes on every chat mutation and
  // this effect fires. The honest cost, accepted at R-O18: an occasional /today
  // refetch after an unrelated turn. The gain is structural — zone 2 refreshes on
  // the SAME signal as zone 1, so the screen cannot disagree about staleness any
  // more than R-O15 lets it disagree about the figure.
  const todayState = useTodayData(vendorId);
  const today = todayState.data;
  const todayRefreshRef = useRef(todayState.refresh); todayRefreshRef.current = todayState.refresh;
  const firstContextRef = useRef(true);
  useEffect(() => {
    if (firstContextRef.current) { firstContextRef.current = false; return; } // the hook's own mount fetch already ran
    todayRefreshRef.current();
  }, [context]);
  // TDW_07 MICRO-2 · F-07.31 — `justDoIt` RETIRED with the CommandBar. It was state that
  // fed exactly one thing: the bar's own toggle colours. Nothing persisted it, no endpoint
  // received it, and no behaviour consulted it — derived by grep across app/, components/
  // and lib/ before removal, not assumed.
  const { toast: noteToast, show: showNote } = useToast();
  async function sendNote(text: string) {
    const r = await createNote(text);
    if (r.ok) showNote('Noted', 'success');
    else showNote((r as { error?: string }).error ?? 'Could not save note', 'error');
  }

  const autoSentRef = useRef(false);
  const sendRef     = useRef(send);     sendRef.current = send;
  const injectRef   = useRef(injectAiMessage); injectRef.current = injectAiMessage;

  useEffect(() => {
    if (autoSend && autoSendPrimer && !autoSentRef.current) {
      autoSentRef.current = true;
      sendRef.current(autoSendPrimer);
      const t = setTimeout(() => { router.replace(pathname ?? '/vendor'); }, 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend, autoSendPrimer]);

  const aiInjectedRef = useRef(false);
  useEffect(() => {
    if (aiPrimer && !aiInjectedRef.current) {
      aiInjectedRef.current = true;
      const t = setTimeout(() => { injectRef.current(aiPrimer); router.replace(pathname ?? '/vendor'); }, 80);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPrimer]);

  // Hub top stack (greeting + ledger + enquiry) is ALWAYS visible.
  // The vendor's house — they should see it every time they arrive.
  // Use the vendor's business name from context when available; fall back to session name.
  const displayName = context?.vendor?.name ?? vendorName ?? null;

  // Scroll ref for ChatThread (the scroll surface).
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // ── THE RISE (R-X22's amended Model 1; mock frame 2 is the acceptance picture) ──
  // The home sits at rest with its three zones. Touching the input RAISES the chat,
  // which renders as the FULL CLEAN ROOM — full-bleed thread, no ledger fragments
  // bleeding through — and one dismiss returns the home intact beneath.
  //
  // ONE ROOM, ONE TRUTH: ChatThread is mounted EXACTLY ONCE in this tree, and the
  // InputBar is mounted exactly once too — the foot is the same bar risen or at
  // rest, not a second surface. Derived before building: ChatThread has one other
  // consumer in the real app and it is a COMMENT (BottomNav.tsx:136), never a
  // render, so no second chat surface exists to collide with.
  //
  // THE RAISE IS onFocusCapture ON A WRAPPER, NOT A PROP ON InputBar. W-1 puts the
  // chat's wire out of this sitting's reach; a wrapper catches the bar's own focus
  // without a byte entering it.
  const [risen, setRisen] = useState(false);
  // TDW_09 P2-R1 (founder-asked): the risen masthead speaks Victor's ROOM.
  // Read-only mirror of the chip's own hook state via its onMode publisher —
  // one control, one truth. null while the first read is in flight, and the
  // masthead falls back to the standing 「 Chat 」 byte rather than guessing.
  const [victorRoom, setVictorRoom] = useState<'business' | 'advisor' | null>(null);

  // ── TDW_09 P2 · fork 8.3 (chair relay #3): REST-VISIBLE, RISEN-HIDDEN ──────
  // The five-door bar now renders on this screen (the old AI-null died with the
  // mode). While the chat is RISEN the bar hides — the amended Model 1's
  // full-bleed acceptance picture is the warrant. MECHANISM (F-06.85): this
  // effect publishes `chat-risen` on <body>; the rule in app/globals.css
  // (`body.chat-risen .tdw-bottom-nav`) hides the bar, whose className carries
  // the same pointer back here. The risen room itself is IN FLOW (see its own
  // comment below) — it cannot cover a sibling of its layout, so the hide is
  // CSS-published, not overlay-implied. Cleanup removes the class so a
  // navigation away mid-chat never strands a hidden bar on the next screen.
  useEffect(() => {
    document.body.classList.toggle('chat-risen', risen);
    return () => { document.body.classList.remove('chat-risen'); };
  }, [risen]);

  // R-O14-AMENDED — the seam: a waiting line or an Example seeds the input through
  // `draft` -> InputBar initialValue, the live rendered mechanism. `key` forces the
  // bar to take a NEW seed (initialValue is a mount-time prop); the cost is a
  // cleared half-typed line at the exact moment the vendor asked for a template.
  const [seed, setSeed] = useState<string>('');
  function act(draftText: string) { setSeed(draftText); setRisen(true); }

  // The first-run chapter's gate (R-X23 §3). Its predicate is stated at
  // isFirstRun's own definition so a bench can assert the retirement pair.
  const firstRun = isFirstRun(today, money);

  // ── The Discover member's own read (F-09.51's second fetch, ruled) ──────────
  // It does NOT ride the slice bus and that is deliberate, not an omission: no
  // Slice owns discover, and the state only moves when an ADMIN approves, denies
  // or revokes — never by a vendor write this app could invalidate on. Once on
  // mount is the honest cadence for a flag that changes on someone else's desk.
  const [discoverPending, setDiscoverPending] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchDiscoverStatus()
      .then((r) => {
        if (!alive) return;
        const st = (r as DiscoverStatus)?.discover_request_state;
        setDiscoverPending(st === 'requested');
      })
      .catch(() => { /* non-fatal — the member simply stays collapsed */ });
    return () => { alive = false; };
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <Cabinet vendorId={vendorId} />

      {/* ── Header ── */}
      <Header vendorName={displayName} />

      {/* ── TDW_09 · F-09.129 · FORK A(a) + B(b1) — THE MODE CONTROL LEFT THIS
             MASTHEAD. What stood here: the Business·Advisor chip, centred under
             the Header on every Hub load, placement riding the founder's veto
             since TDW_06 P6d (R-2).
             Founder's walk, 2026-08-07: 「 the mode pills looks forced and out of
             place 」 — PLURAL, and naming no surface. F-09.120 read that as the
             More mount alone and retired only that one; the founder walked the
             result and asked again 「 ddnt we decide to retire this advisor
             business pill? 」. His original plural governs (F-09.129 Fork A(a)).
             RE-HOMED, NOT RETIRED (Fork B(b1)). The verdict was on PLACEMENT and
             REGISTER, not on the capability: `victor_mode` is SERVER truth
             (engine.agents.victor_mode, PATCH /api/v2/vendor-e/mode, a flip
             resets Victor's thread), and retiring a live server-backed control on
             a chrome complaint would strand a field with no vendor-reachable
             door. It now sits inside the risen chat, beside the masthead that
             already speaks its two words. See the mount in the risen branch. */}

      {/* ── TDW_07 MICRO-2 — THE COMMAND BAR IS REMOVED-BY-FOUNDER-RULING. ──────────────
          Founder's word, 2026-07-31: "delete completely. serves no purpose". Shape (i):
          the mount and the component both go. This was its ONLY live mount, derived by
          command — `<CommandBar` appeared exactly once in the tree.

          CONTROL INVENTORY (CE-115), every control accounted, all REMOVED-BY-FOUNDER-RULING
          rather than tidied away:
            1. Enquiry Follow-ups   → /vendor/list/leads   — SURVIVES: /vendor/list
                                       redirects to the leads slice (list/page.tsx:14), and
                                       Studio, BinderCard and the invoices cross-chip all
                                       link it. Derived, not assumed: the route was checked
                                       for orphaning BEFORE the bar was deleted.
            2. Incomplete Profiles  → /vendor/list/leads   — same route, same survival
            3. Discover Profile     → /vendor/discover     — SURVIVES: four other entry
                                       points, and the drawer's own "Discover Profile ·
                                       How couples see you" item (Header.tsx:195) is the
                                       named surviving route.
            4. Hot Dates Locked In  → /vendor/calendar     — SURVIVES: BottomNav's Calendar
                                       tab and one other push.
            5. JUST DO IT toggle    → F-07.31, dies with the file. It was a switch that
                                       changed its own colour and NOTHING else — never
                                       persisted, never sent, never read outside the bar's
                                       own styling. The dead-control class with a paint job,
                                       on the vendor's most-visited screen.
          No route is orphaned by this deletion. Every count the bar surfaced is a readout,
          not a control, and readouts do not survive the surface that hosted them.

          `DemoCommandBar` in app/demo/vendor/[handle]/studio/page.tsx is UNTOUCHED and
          NAMED: it is a separate mock that shares no code with this component, and the demo
          subdomain is Block 08's territory. */}

      {/* ── THE HOME AT REST — zones 1 and 2 (R-X23) ────────────────────────
             Hidden, not unmounted, while the chat is risen: the mock's frame 2
             shows the home STAYING PUT beneath a full-bleed room, and unmounting
             would re-run the ledger's fetches on every dismiss. */}
      {/* ── THE HOME AT REST — zones 1 and 2 (R-X23) ──────────────────────
             `display: contents` so these children are direct flex items of the
             column; a spacer below them is what pushes zone 3 to the foot. */}
      <div style={{ display: risen ? 'none' : 'contents' }}>
        {/* ZONE 1 — the state ledger */}
        <GreetingLine context={context} money={money} today={today} />
        <Ledger context={context} money={money} today={today} />

        {/* ZONE 2 — what's waiting, plus the week strip. Both self-collapse to
            NOTHING when empty; there is no "all clear" card anywhere below. */}
        {firstRun
          ? <FirstRunExemplars onAct={act} />
          : (
            <>
              <WaitingZone
                today={today}
                discoverPending={discoverPending}
                onAct={act}
                onOpen={(href) => router.push(href)}
                onOverflow={() => router.push('/vendor/list/leads')}
              />
              <WeekStrip today={today} />
            </>
          )}
      </div>

      {/* ── THE GROWER ────────────────────────────────────────────────────────
             ChatThread carried `flex: 1` (ChatThread.tsx:74) and was the ONLY
             growing child of this column. Moving it into the risen room removed
             the grower and nothing replaced it, so the column collapsed to
             content height: the input bar floated mid-screen at rest, and the
             risen room — absolutely positioned to `inset: 0` of that collapsed
             box — was never full screen. Founder's walk, 2026-08-06.
             The cure is FLOW, not a bigger overlay: at rest this spacer eats the
             slack; risen, the room itself grows and this yields. */}
      {!risen && <div style={{ flex: 1, minHeight: 0 }} />}

      {/* ── THE RISEN ROOM — mock frame 2, the acceptance picture ────────────
             A FLEX CHILD, NOT AN OVERLAY. The first cut used
             `position:absolute; inset:0; zIndex:40`, which failed three ways at
             once on the founder's walk: it sized to a collapsed parent (so the
             chat was never full screen), it let the normal-flow InputBar at
             zIndex 41 float over the thread and clip the last message, and it
             covered Header and the mode pill — leaving no way to Studio, AI or
             Discover from inside the chat. In flow, the room grows to fill,
             the chrome above stays, and the shared foot stays a foot.
             The InputBar is NOT in here: it is the shared foot below, which is
             what makes this one room rather than a second chat surface. */}
      {risen && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <button
            type="button"
            onClick={() => setRisen(false)}
            aria-label="Close the chat and return home"
            style={{
              alignSelf: 'center', width: 34, height: 4, borderRadius: 2,
              border: 'none', padding: 0, margin: '10px 0 2px',
              background: T.isLight ? 'rgba(122,56,40,0.25)' : 'rgba(240,230,210,0.25)',
              cursor: 'pointer',
            }}
          />
          {/* ── TDW_09 P2-R1→R2: THE ROOM, NAMED ON THE CHAT — ONE REGISTER ──
                 R1 gave the two rooms two TYPEFACES (small-caps vs Cormorant
                 italic); the founder read the split as inconsistency, and his
                 eye outranks the intent (「 why is the business and advisor in
                 different fonts? 」→ ruled (a)). ONE register now — the house
                 small-caps the pill above already wears — and HUE + WORD carry
                 the distinction: BUSINESS in brass, ADVISOR in the primary ink,
                 both themes. The words stay the chip's vetoed pair; unknown
                 room still says 「 Chat 」 in the standing muted byte. */}
          {/* ── TDW_09 · F-09.129 Fork B(b1) — THE MODE CONTROL'S NEW SEAT ────
                 Moved here from the Hub masthead, WIRED IDENTICALLY: the same
                 `onThreadReset={markFreshThread}` and `onMode={setVictorRoom}`
                 pair, the same PATCH door, the same server-side thread reset on
                 a flip. F-09.122's wiring is the spec and nothing about it
                 moved — only the seat. ZERO new copy: the chip carries its own
                 vetoed pair of words and the mirror below still speaks them.
                 SEATED HERE, and not anywhere else in the room, because this is
                 where its vocabulary already lives: the label directly below is
                 a READ-ONLY MIRROR of this very control, published by the
                 `onMode` above. Control and mirror now share one block, so a
                 reader can see the switch and the room it selected without
                 leaving the chat.
                 MECHANISM NOTE (F-06.85), and it is a real behaviour delta:
                 the chip used to mount on every Hub load and so read
                 `victor_mode` once at page open. Mounted inside `{risen && (`,
                 it reads on each chat OPEN instead. That is safe only because
                 `useVictorMode` holds NO localStorage and re-reads server truth
                 on mount by design — if that ever gains a cache, this seat is
                 the thing to re-read. Until the first read lands, the mirror
                 below says the standing 'Chat' byte, exactly as it always did
                 while a first read was in flight. */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 2px' }}>
            <VictorModeChip onThreadReset={markFreshThread} onMode={setVictorRoom} />
          </div>

          <div style={{
            alignSelf: 'center', fontFamily: F.label,
            fontWeight: victorRoom ? 400 : 300, fontSize: 8,
            letterSpacing: '0.34em', textTransform: 'uppercase',
            color: victorRoom === 'business'
              ? (T.isLight ? T.accent : A.brassWarm)
              : victorRoom === 'advisor'
                ? (T.isLight ? T.ink : 'var(--atelier-ink)')
                : (T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)'),
            margin: '2px 0 6px',
          }}>{victorRoom === 'business' ? 'Business' : victorRoom === 'advisor' ? 'Advisor' : 'Chat'}</div>

          {/* Fresh thread (TDW_06 D-7) travels WITH the room it belongs to. */}
          <FreshThreadControl onConfirm={freshThread} disabled={loading} />

          <ChatThread
            messages={messages}
            loading={loading}
            onConfirm={() => {}}
            onCancel={() => {}}
            onChipTap={send}
            onReportGlitch={async () => { await reportGlitch(); }} // TDW_06 M-3: its OWN wire, never onChipTap
            scrollRef={chatScrollRef}
            onRetryLast={() => { const last = [...messages].reverse().find((m) => m.role === 'user'); if (last?.text) send(last.text); }}
          />
        </div>
      )}

      {/* ── ZONE 3 — the foot. The books handle is the Cabinet's own (mounted at
             the top of this tree, positioned at the foot by .dd-cab); the input
             bar is here, and touching it raises the room. ── */}
      <Toast toast={noteToast} />
      <TierMeter meta={meta} />
      <div onFocusCapture={() => setRisen(true)}>
        <InputBar
          key={seed || 'idle'}
          onSend={(t: string) => { setRisen(true); send(t); }}
          onSendNote={sendNote}
          disabled={loading || (meta && meta.state === 'capped')}
          initialValue={seed || draft || undefined}
          onPrimerApplied={() => router.replace(pathname ?? '/vendor')}
        />
      </div>

      <OnboardingOverlay onSend={send} />
    </div>
  );
}
