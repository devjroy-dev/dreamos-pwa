"use client";
// components/worklist/BooksBody.tsx — THE BOOKS REGISTER.
// ROAD STEP 2c · built to `docs/mocks/books-register-mock.html@e7ac23979fc8`,
// frame `B2-months` — the shape the founder picked at D-1.
//
// ── ZERO VERBS, AND THE GUARD CHANGED CHARACTER  [CE-39 2c] ─────────────────
// This file still mounts no <button>, no <a>, no <form>, no input, no onClick,
// no swipe and no long-press, and the emptiness is still the ruling.
//
// ⚠ WHAT CHANGED IS WHY IT HOLDS. At 2b it held partly BY CONSTRUCTION: the
// movement ids are composites — `invoice:<uuid>`, `expense:<uuid>`,
// `schedule:<invoice_id>:<ordinal>` — and were unusable as addresses because
// the rooms keyed their controls on engine binder ids. The rooms are typed now
// and the money door mounts eleven routes, so a control here would have
// something to key on. The ids are unchanged; the room's read-only ruling is
// from this sitting enforced ONLY by the C-money zero-verb cell, never again by
// the id space.
//
// ── THE SURFACE SUMS NOTHING, AND THAT IS THE WHOLE DESIGN  [F-04.13] ───────
// `movement.balance` arrives server-computed from zero at the first movement.
// `opening` and `closing` arrive READ, not derived: opening is zero by the
// door's construction, closing is the last row's own balance cell. A month
// group's opening is the previous group's closing — also read, never summed.
// The hub once totalled `public.invoices` while the list totalled binders, two
// derivations of one rule, and they could not agree by luck. This file adds
// nothing up: `groupsOf` below slices and never accumulates.
//
// ── THE PARTICULAR  [F-39.21 · D-1 B13] ────────────────────────────────────
// The founder's verdict on the 2b room: 「no info about who paid, out of how
// much… more like a rough book than BOOKS of Account」. Every movement now
// carries its particular on its own row beneath — credits read
// `client · number · Rs X of Rs Y`, debits read `category · description`.
// `invoices.description` is ABSENT BY RULING (F-39.23): Victor's money-edit
// writes a rupee-glyph audit log into that column, so it is unrenderable rather
// than merely unrendered.
//
// THE ROW'S OWN WORDS, VERBATIM, ALWAYS. This surface never validates what it
// renders — not the category against the writer's list (F-2c.p1: the two are
// not the same twelve), not the state, not the figure. The row's truth is the
// register's truth, which is the same rule that makes `no date on file` honest.
//
// ── TABULAR FIGURES, AND WHY THE DECLARATION ORDER IS LOAD-BEARING ──────────
// `font: var(--wl-t3)` is the SHORTHAND, and the shorthand RESETS
// font-variant-numeric. Every numeral rule below therefore declares its `font`
// line first and `font-variant-numeric` in a SECOND rule after it. Declared in
// one rule the tabular setting is silently thrown away and the columns stop
// aligning — silently, which is the part worth the paragraph.
//
// ── THE MONEY REGISTER ──────────────────────────────────────────────────────
// `Rs X,XX,XXX`, from `lib/vendor/format.ts` :: formatRs — THE canonical home
// (R-U25/R-U27/R-U30). `SliceRow.tsx :: fmtRs` is the second home F-38.p13
// names and it is NOT used here. No rupee glyph, no k/L/Cr, no truncation.
import { useEffect, useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { formatRs, formatShortDate } from '@/lib/vendor/format';
import { fetchBooks } from '@/lib/vendor/api/vendor';
import type { BooksMovement, BooksParticular } from '@/lib/vendor/types/vendor';

/** A month group. `opening` and `closing` are READ off the chain's own cells —
    the previous group's close, and this group's last row's balance. Neither is
    accumulated here; see the header. */
type Group = { key: string; label: string; opening: number; closing: number; rows: BooksMovement[] };

/** The month label. `date` is `YYYY-MM-DD` from the wire, so the month is a
    SLICE and never a `new Date()` — a Date applies the device's timezone to a
    plain date and could move a 1 Jul movement into June for a vendor west of
    UTC. The estate learnt that at s-39.10 (the UTC-vs-IST compare) and the cure
    was to stop constructing dates from wire strings at all. */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
function monthLabel(date: string): string {
  const y = date.slice(0, 4);
  const m = Number(date.slice(5, 7));
  return m >= 1 && m <= 12 ? `${MONTHS[m - 1]} ${y}` : y;
}

function groupsOf(movements: BooksMovement[], opening: number): Group[] {
  const out: Group[] = [];
  for (const m of movements) {
    const key = m.date.slice(0, 7);
    const last = out[out.length - 1];
    if (last && last.key === key) {
      last.rows.push(m);
      last.closing = m.balance;
      continue;
    }
    out.push({
      key,
      label: monthLabel(m.date),
      // A group opens where the previous one closed. The first opens at the
      // door's `opening`, which is zero by construction. Read, not summed.
      opening: last ? last.closing : opening,
      closing: m.balance,
      rows: [m],
    });
  }
  return out;
}

/** The particular line. Credits and debits carry different facts, so the shape
    follows which side the movement sits on rather than probing for fields.
    Every segment is omitted when its field is absent — a register that printed
    a bare separator would be asserting a fact it does not hold. */
function particularOf(m: BooksMovement): string {
  const p: BooksParticular | null = m.particular;
  if (!p) return '';
  const bits: string[] = [];
  if (m.debit != null) {
    if (p.category) bits.push(p.category);
    if (p.description) bits.push(p.description);
    return bits.join(' · ');
  }
  if (p.client_name) bits.push(p.client_name);
  if (p.invoice_number) bits.push(p.invoice_number);
  if (p.milestone_label) bits.push(p.milestone_label);
  if (p.amount_paid != null && p.amount_total != null) {
    bits.push(`${formatRs(p.amount_paid)} of ${formatRs(p.amount_total)}`);
  }
  return bits.join(' · ');
}

export function BooksBody({ vendorId }: { vendorId: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [received, setReceived] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [opening, setOpening] = useState(0);
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
        setOpening(r.opening ?? 0);
        setMovements(r.movements ?? []);
        setState('ready');
      } catch {
        // FAILS CLOSED ON THE FIGURES. A books register that renders Rs 0 over
        // a call that never landed tells the vendor her money is gone. The room
        // says it could not look instead — the class Block 06 spent itself
        // removing.
        if (live) setState('failed');
      }
    })();
    return () => { live = false; };
  }, [vendorId]);

  if (state === 'loading') return <div className="wl-books" aria-busy="true" />;

  const groups = state === 'ready' ? groupsOf(movements, opening) : [];

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

      {/* ── TWO EMPTY STATES, BECAUSE THEY ARE OPPOSITE FACTS ─────────────────
          `booksFailed` says the estate could not look; `booksEmpty` says it
          looked and found nothing. Rendering the second over a failed call
          tells a vendor WITH money that her money is gone, so neither byte may
          carry the other's meaning. THE HEAD ALSO CHANGES, one rule up: on
          failure each figure renders an em-dash rather than Rs 0, because a
          register showing Rs 0 over a call that never landed is the same lie in
          numerals. F-39.p3: the failed byte was WITHHELD at build and vetoed
          after — an executor-invented eleventh byte on a money surface is what
          the veto slot exists to stop. */}
      {state === 'failed' ? (
        <p className="wl-bkempty">{COPY.booksFailed}</p>
      ) : movements.length === 0 ? (
        <p className="wl-bkempty">{COPY.booksEmpty}</p>
      ) : (
        groups.map((g) => (
          <div className="wl-bkgroup" key={g.key}>
            <div className="wl-bkghead">
              <span className="wl-bkgname">{g.label}</span>
              <span className="wl-bkgfigs">
                <span className="wl-bkpfig">{COPY.booksOpening} <b>{formatRs(g.opening)}</b></span>
                <span className="wl-bkpfig">{COPY.booksClosing} <b>{formatRs(g.closing)}</b></span>
              </span>
            </div>

            {/* A REAL <table>. The columns are a register the vendor reads
                ACROSS — date against received against balance — and a div grid
                gives a screen reader no way to say which column a figure sits
                in. `scope="col"` makes each head announce with its cell. */}
            <table className="wl-bktable">
              <colgroup>
                <col className="wl-bkcdate" /><col /><col /><col className="wl-bkcbal" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="wl-bkcolh wl-bkl">{COPY.booksColDate}</th>
                  <th scope="col" className="wl-bkcolh">{COPY.booksColCredit}</th>
                  <th scope="col" className="wl-bkcolh">{COPY.booksColDebit}</th>
                  <th scope="col" className="wl-bkcolh">{COPY.booksColBalance}</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((m) => {
                  const part = particularOf(m);
                  return (
                    <Movement key={m.id} m={m} part={part} />
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

/** One movement is TWO rows — the figures, then the particular beneath. They
    are a fragment rather than two siblings in the map so the pair cannot drift
    apart in a later edit: a movement without its particular is the 2b room the
    founder rejected. */
function Movement({ m, part }: { m: BooksMovement; part: string }) {
  return (
    <>
      <tr>
        <td className="wl-bkdate">{formatShortDate(m.date)}</td>
        <td className="wl-bknum">{m.credit == null ? '' : formatRs(m.credit)}</td>
        <td className="wl-bknum">{m.debit == null ? '' : formatRs(m.debit)}</td>
        <td className="wl-bknum wl-bkbal">{formatRs(m.balance)}</td>
      </tr>
      {/* THE PARTICULAR SPANS ITS OWN ROW beneath the movement, not inside the
          date cell: at 374px a particular squeezed into a narrow first column
          pushes the three money columns off the glass, and R-U28 says reflow,
          never shrink. The caveat rides the END of this line rather than a
          legend at the foot of the table, because a legend is read by nobody
          and the substitution is per-row. */}
      <tr className="wl-bkpart">
        <td colSpan={4}>
          {part}
          {m.undated && (
            <>
              {part ? ' · ' : ''}
              <span className="wl-bkundated">{COPY.booksUndated}</span>
            </>
          )}
        </td>
      </tr>
    </>
  );
}

// Every rule below is the mock's own, at `books-register-mock.html@e7ac23979fc8`.
// Derived from `lib/worklist/theme.ts` by D-1's generator, not transcribed.
const BOOKS_CSS = `
.wl-books{padding-top:16px;padding-bottom:24px;display:flex;flex-direction:column;gap:16px}
/* R-38.5 · THE EDGE. This surface takes NO horizontal margin of its own; the scroll
   column's gutter is the only inset on this axis, exactly as RoomBody sets up. */
.wl-bkhead{display:flex;gap:24px;align-items:baseline}
.wl-bkfig{display:flex;flex-direction:column;gap:4px}
.wl-bkfiglabel{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-bkfigval{font:var(--wl-t2);color:var(--atelier-ink)}
.wl-bkfigval{font-variant-numeric:lining-nums tabular-nums}
.wl-bkgroup+.wl-bkgroup{margin-top:22px}
.wl-bkghead{display:flex;justify-content:space-between;align-items:baseline;gap:12px;
            padding:10px 0;border-top:.5px solid var(--role-metal)}
.wl-bkgname{font:var(--wl-t2);color:var(--atelier-ink)}
.wl-bkgfigs{display:flex;gap:16px}
.wl-bkpfig{font:var(--wl-t5);color:var(--atelier-ink-mute);white-space:nowrap}
.wl-bkpfig b{font-weight:inherit;color:var(--atelier-ink-soft)}
.wl-bkpfig{font-variant-numeric:lining-nums tabular-nums}
.wl-bktable{width:100%;border-collapse:collapse;table-layout:fixed}
.wl-bkcdate{width:74px}
.wl-bkcbal{width:88px}
.wl-bkcolh{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);
           text-align:right;padding:10px 0 8px;border-bottom:.5px solid var(--atelier-card-border);font-weight:500}
.wl-bkcolh.wl-bkl{text-align:left}
.wl-bkdate{font:var(--wl-t5);color:var(--atelier-ink-mute);text-align:left;padding:11px 8px 0 0;
           vertical-align:top;white-space:nowrap}
.wl-bkdate{font-variant-numeric:lining-nums tabular-nums}
.wl-bknum{font:var(--wl-t3);color:var(--atelier-ink-soft);text-align:right;padding:10px 0 0 10px;vertical-align:top}
.wl-bknum{font-variant-numeric:lining-nums tabular-nums}
.wl-bkbal{color:var(--atelier-ink)}
.wl-bkpart td{font:var(--wl-t5);color:var(--atelier-ink-mute);padding:3px 0 11px;
              border-bottom:.5px solid var(--atelier-card-border)}
.wl-bkpart td{font-variant-numeric:lining-nums tabular-nums}
.wl-bkundated{color:var(--atelier-ink-fade)}
.wl-bkempty{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0}
`;
