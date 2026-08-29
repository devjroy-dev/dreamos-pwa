"use client";
// components/worklist/BooksBody.tsx — THE BOOKS REGISTER. ROAD STEP 2b.
//
// ── ZERO VERBS, AND THAT IS THE ROOM'S WHOLE DESIGN ─────────────────────────
// This file mounts no <button>, no <a>, no <form>, no input, no onClick, no
// swipe and no long-press. It is the first room in the shell with no way to act
// on anything it shows, and the emptiness is the ruling rather than an
// unfinished state.
//
// THE REASON IS THE ID SPACE. Every other money surface keys its controls on a
// row id, and on this branch those ids are ENGINE BINDER uuids while this door
// returns TYPED uuids. A control here would be a control keyed on the wrong
// space, which is exactly the defect that kept Invoices and Expenses from
// crossing this sitting (CE-39, arm (c) on the 2b read-first). The movement ids
// this component receives are composites — `invoice:<uuid>`, `expense:<uuid>`,
// `schedule:<invoice_id>:<ordinal>` — deliberately unusable as addresses. They
// are React keys and nothing else.
//
// ── THE BALANCE IS NOT COMPUTED HERE, AND MUST NEVER BE ─────────────────────
// `movement.balance` arrives server-computed from zero at the first movement.
// This file sums nothing. F-04.13's tuition, applied before it can be paid
// again: the hub totalled `public.invoices` while the list totalled binders, two
// derivations of one rule, and they could not agree by luck.
//
// ── TABULAR FIGURES, AND WHY THE DECLARATION ORDER IS LOAD-BEARING ──────────
// `font: var(--wl-t3)` is the SHORTHAND, and the shorthand RESETS
// font-variant-numeric. `lib/worklist/theme.ts` (symbol: typeCss) states this
// explicitly and BillingRoom.tsx already carries the same two-rule pattern for
// the same reason. Every numeral rule below therefore declares its `font` line
// first and `font-variant-numeric` in a SECOND rule after it. Declared in one
// rule, the tabular setting is silently thrown away and the columns stop
// aligning — silently, which is the part worth the paragraph.
//
// ── THE MONEY REGISTER ──────────────────────────────────────────────────────
// `Rs X,XX,XXX`, from `lib/vendor/format.ts` :: formatRs — THE canonical home
// (R-U25/R-U27/R-U30). `components/vendor/slices/SliceRow.tsx` :: fmtRs is the
// second home F-38.p13 names and it is NOT used here: a new surface reaching for
// the second home is how a second home becomes permanent. No rupee glyph, no
// k/L/Cr shorthand, and no truncation — `fitMoneySize` exists for fixed-width
// cells and this table reflows, so R-U28 says wrap rather than shrink.
import { useEffect, useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { formatRs, formatShortDate } from '@/lib/vendor/format';
import { fetchBooks } from '@/lib/vendor/api/vendor';
import type { BooksMovement } from '@/lib/vendor/types/vendor';

export function BooksBody({ vendorId }: { vendorId: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [received, setReceived] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [movements, setMovements] = useState<BooksMovement[]>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetchBooks(vendorId);
        if (!live) return;
        if (!r.ok) { setState('failed'); return; }
        setReceived(r.received);
        setOutstanding(r.outstanding);
        setMovements(r.movements ?? []);
        setState('ready');
      } catch {
        // FAILS CLOSED ON THE FIGURES. A books register that renders Rs 0 over a
        // call that never landed tells the vendor her money is gone. The room
        // says it could not read instead — AdvisorPage's own shape, and the
        // class Block 06 spent itself removing.
        if (live) setState('failed');
      }
    })();
    return () => { live = false; };
  }, [vendorId]);

  if (state === 'loading') return <div className="wl-books" aria-busy="true" />;

  return (
    <div className="wl-books">
      <style>{BOOKS_CSS}</style>

      <div className="wl-bkhead">
        <div className="wl-bkfig">
          <div className="wl-bkfiglabel">{COPY.booksReceived}</div>
          <div className="wl-bkfigval">{state === 'failed' ? '—' : formatRs(received)}</div>
        </div>
        <div className="wl-bkfig">
          <div className="wl-bkfiglabel">{COPY.booksOutstanding}</div>
          <div className="wl-bkfigval">{state === 'failed' ? '—' : formatRs(outstanding)}</div>
        </div>
      </div>

      {/* ── TWO EMPTY STATES, BECAUSE THEY ARE OPPOSITE FACTS ────────────────────
          `booksFailed` says the estate could not look; `booksEmpty` says it looked and
          found nothing. Rendering the second over a failed call tells a vendor WITH money
          that her money is gone, so neither byte may carry the other's meaning.

          THE HEAD ALSO CHANGES, and that is the same rule one line up: on failure each
          figure renders an em-dash rather than Rs 0. A books register showing Rs 0 over a
          call that never landed is the same lie in numerals.

          F-39.p3: this byte was WITHHELD at the build and vetoed after — ten bytes had
          been ruled and an executor-invented eleventh on a money surface is what the veto
          slot exists to stop. */}
      {state === 'failed' ? (
        <p className="wl-bkempty">{COPY.booksFailed}</p>
      ) : movements.length === 0 ? (
        <p className="wl-bkempty">{COPY.booksEmpty}</p>
      ) : (
        // A REAL <table>. The columns are a register the vendor reads ACROSS —
        // date against credit against balance — and a div grid gives a screen
        // reader no way to say which column a figure sits in. `scope="col"`
        // makes each head announce with its cell.
        <table className="wl-bktable">
          <thead>
            <tr>
              <th scope="col" className="wl-bkcolh">{COPY.booksColDate}</th>
              <th scope="col" className="wl-bkcolh wl-bknum">{COPY.booksColCredit}</th>
              <th scope="col" className="wl-bkcolh wl-bknum">{COPY.booksColDebit}</th>
              <th scope="col" className="wl-bkcolh wl-bknum">{COPY.booksColBalance}</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="wl-bkdate">
                  {formatShortDate(m.date)}
                  {/* The caveat rides WITH the date it qualifies rather than in a
                      legend at the foot of the table, because a legend is read by
                      nobody and the substitution is per-row. */}
                  {m.undated && <span className="wl-bkundated">{COPY.booksUndated}</span>}
                </td>
                <td className="wl-bknum">{m.credit == null ? '' : formatRs(m.credit)}</td>
                <td className="wl-bknum">{m.debit == null ? '' : formatRs(m.debit)}</td>
                <td className="wl-bknum wl-bkbal">{formatRs(m.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const BOOKS_CSS = `
.wl-books{padding-top:16px;padding-bottom:24px;display:flex;flex-direction:column;gap:16px}
/* R-38.5 · THE EDGE. This surface takes NO horizontal margin of its own; the scroll
   column's gutter is the only inset on this axis, exactly as RoomBody sets up. */
.wl-bkhead{display:flex;gap:24px;align-items:baseline}
.wl-bkfig{display:flex;flex-direction:column;gap:4px}
.wl-bkfiglabel{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
/* R-38.10 asks for the head 「in t2 numerals」. t2 is witnessed present in
   lib/worklist/theme.ts :: TYPE — 17/1.3 DM Sans 500 — and is the rung the wordmark and
   every section heading already use, so this is the ruled rung and not a substitution. */
.wl-bkfigval{font:var(--wl-t2);color:var(--atelier-ink)}
.wl-bkfigval{font-variant-numeric:tabular-nums}
.wl-bktable{width:100%;border-collapse:collapse}
.wl-bkcolh{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);font-weight:500;text-align:left;padding:0 0 8px;border-bottom:.5px solid var(--atelier-card-border)}
.wl-bktable td{padding:12px 0;border-bottom:.5px solid var(--atelier-card-border);vertical-align:top}
.wl-bkdate{font:var(--wl-t4);color:var(--atelier-ink-mute);white-space:nowrap;padding-right:12px}
/* RIGHT-ALIGNED AND TABULAR, WHICH IS THE WHOLE OF READING A LEDGER: the digits stack
   in columns so the eye compares magnitudes without reading a single figure. The second
   rule is not a duplicate — see the paragraph at the head of this file. */
.wl-bknum{font:var(--wl-t3);color:var(--atelier-ink);text-align:right;padding-left:12px}
.wl-bknum{font-variant-numeric:tabular-nums}
.wl-bkbal{color:var(--atelier-ink)}
/* The undated caveat sits UNDER the date rather than beside it: at 374px a second
   inline phrase in the date column pushes the three money columns off the glass, and
   R-U28 says reflow rather than shrink. */
.wl-bkundated{display:block;font:var(--wl-t5);color:var(--atelier-ink-dim);margin-top:2px;white-space:nowrap}
.wl-bkempty{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0}
`;
