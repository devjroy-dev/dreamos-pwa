"use client";
// components/worklist/TodayCards.tsx — THE FEED, MATCHING D-1's RATIFIED FRAMES.
//
// SUBJECT: docs/mocks/today-working-mock.html @ d1f2c80, sha256 18bbf7a8027e…, frames
// A1-work / A1-open / A1-trunc / A1-rest. The A2-* frames in the same file are the
// UNPICKED shape and are retained for the record only — D1_VETO_SHEET.md says a charter
// must name the FRAMES and not only the file, "otherwise a cell reading the file finds two
// answers." Nothing below is built from an A2 frame.
//
// ── THE ORDER IS THE WIRE'S, AND THIS FILE NEVER SORTS ──────────────────────
// §3 property 4: key order in `needs_attention` IS D-4's ranking, and JSON preserves
// insertion order. So the render walks the body's own keys. Property 5: ties break
// oldest-first, DELIVERED THAT WAY — which is why the fold's "three in place" is a
// `slice(0, 3)` and not a sort. A client-side sort would look tidy and silently override a
// ranking the backend owns.
//
// ── ⚠ EVERY VENDOR-FACING BYTE COMES FROM copy.ts OR THE REGISTRY ───────────
// Section eyebrows are `ROOMS` labels. The kind line's nouns are `COPY.kindNouns` (D-1/c3:
// five NEW bytes, because `Team` does not singularise to `task`). The fold, the room door,
// `owed` and the two due arms are the vetoed set of 2026-08-29. Nothing is spelled inline.
//
// ── ⚠ THE REDACTED UPSELL IS NOT MINTED HERE. ONE HOME. ─────────────────────
// Both bytes are the Leads room's own — `components/vendor/slices/SliceShell.tsx`, the
// `slice === 'leads' && sel?.redacted` block, founder copy executed 2026-08-25 and shipped
// character for character. The line-7 byte proposed on 2026-08-29 was WITHDRAWN BEFORE
// BUILD under the one-home clause. Keyed on `redacted` (R-37.23), never on a missing
// phone — and on this wire there is no phone field to miss at any tier (§3 property 7).
//
// SUPPRESSION, NOT SUBSTITUTION: the upsell occupies the seat a contact affordance would
// have taken and grows nothing new beside it.
import { useState } from 'react';
import Link from 'next/link';
import { ROOMS, ROOM_FOR_KIND, roomHref } from '@/lib/worklist/rooms';
import { COPY } from '@/lib/worklist/copy';
import { formatRs } from '@/lib/vendor/format';
import type { AttentionKind, WorklistTodayResponse } from '@/lib/vendor/types/vendor';

/** The two bytes reused verbatim from the Leads room's founder-vetoed block. */
const COPY_REDACTED = {
  line: 'Upgrade to Essential tier or above to connect with your lead.',
  cta:  'See plans',
};

/** THE IN-PLACE COUNT. R-39.14: three, and the rest behind one control. */
const IN_PLACE = 3;

/** The anchor a kind-line segment resolves to. One spelling, two consumers. */
export function sectionId(kind: AttentionKind): string {
  return 'sec-' + ROOM_FOR_KIND[kind];
}

function roomLabel(kind: AttentionKind): string {
  const id = ROOM_FOR_KIND[kind];
  return ROOMS.find((r) => r.id === id)?.label ?? id;
}

/**
 * THE FIGURE A SECTION AND A KIND-LINE SEGMENT BOTH SHOW.
 *
 * `counts[k]` is a FLOOR once `truncated[k]` fires (§3 property 3), so the tell rides
 * every rendering of the figure and there is no path on which a capped count reaches the
 * glass bare.
 */
function countText(t: WorklistTodayResponse, kind: AttentionKind): string {
  const n = t.counts[kind] ?? 0;
  return String(n) + (t.truncated[kind] === true ? COPY.todayTruncatedSuffix : '');
}

/** A date the vendor reads. Never a raw ISO on glass. */
function dateLine(iso: string | null | undefined, withYear = true): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', withYear
    ? { day: 'numeric', month: 'short', year: 'numeric' }
    : { day: 'numeric', month: 'short' });
}

function dot(parts: Array<string | null | undefined>): string {
  return parts.filter((p) => !!p && String(p).trim()).join(' \u00b7 ');
}

/**
 * ⚠ THE DUE LINE READS THE WIRE'S OWN DATE, NEVER THE DEVICE'S  [F-b, RULED].
 *
 * The response carries `today` — the IST calendar date the feed was cut for — precisely so
 * the client does not compute one. A `new Date()` comparison on a phone in another
 * timezone would label a due invoice overdue, or the reverse, and the vendor would have no
 * way to tell which of the two clocks she was reading. F-P3.8's class (`istTodayISO` had
 * five independent homes) arriving on the pwa side; the cell asserts no Date construction
 * in this path.
 *
 * The two arms are the vetoed pair: 「Due today」 on a match, 「Due 29 Aug」 otherwise, and
 * the year drops on the second by the chair's substitution.
 */
function dueLine(due: string | null | undefined, wireToday: string): string {
  if (!due) return '';
  return due.slice(0, 10) === wireToday
    ? COPY.todayDueToday
    : COPY.todayDuePrefix + ' ' + dateLine(due, false);
}

/** The lead's budget band, as the mock draws it: 「Rs 80,000 – Rs 1,20,000」. */
function budgetBand(min: number | null, max: number | null): string {
  if (min == null && max == null) return '';
  if (min != null && max != null) return formatRs(min) + ' \u2013 ' + formatRs(max);
  return formatRs(min ?? max);
}

function Card({ kind, row, wireToday }: { kind: AttentionKind; row: Record<string, unknown>; wireToday: string }) {
  const id = String(row.id ?? '');
  let primary = '';
  let detail = '';
  let figure: { value: string; label: string } | null = null;

  if (kind === 'lead_unanswered') {
    primary = (row.name as string) || '\u2014';
    detail  = dot([row.wedding_city as string, dateLine(row.wedding_date as string),
                   budgetBand(row.budget_min as number, row.budget_max as number)]);
  } else if (kind === 'invoice_due') {
    primary = (row.client_name as string) || (row.invoice_number as string) || '\u2014';
    detail  = dot([
      row.invoice_number as string,
      formatRs(row.amount_paid as number) + ' of ' + formatRs(row.amount_total as number),
      dueLine(row.due_date as string, wireToday),
    ]);
    // THE ZERO IS THE ROW'S TRUTH AND IT PRINTS (chair, 2026-08-29). The card shows
    // `amount_owed` as computed and nothing else. A state that says unpaid over a fully
    // paid row is the WRITER's defect (F-39.8); a card that hides it is a card covering
    // for a write path, which is how a false-done gets built.
    figure  = { value: formatRs(row.amount_owed as number), label: COPY.todayOwedCaption };
  } else if (kind === 'events_today') {
    primary = (row.title as string) || '\u2014';
    detail  = dot([row.event_time as string, row.kind as string, row.slot as string]);
  } else if (kind === 'contract_unsigned') {
    primary = (row.title as string) || '\u2014';
    detail  = dot([row.state as string, dateLine(row.sent_at as string)]);
  } else {
    primary = (row.title as string) || '\u2014';
    detail  = dot([row.state as string, row.priority as string, dateLine(row.due_date as string)]);
  }

  // ONE TAP TO THE RECORD (F-39.17). Leads carry the id so the room can open it; the other
  // four land in the room, because none of them has an existing per-record address and
  // inventing one here would be a new door by the back way.
  // ARM D (F-39.68): every card opens its RECORD, not its room. The key each kind writes is
  // declared once, beside the kind→room map it travels with; a kind with no key lands on the
  // room root, which today is `contract_unsigned` (the contracts room has no record sheet —
  // F-39.76) and is the one case the founder card states rather than demonstrates.
  const KEY_FOR_KIND: Partial<Record<string, string>> = {
    lead_unanswered: 'lead',
    invoice_due:     'invoice',
    events_today:    'event',
    team_tasks:      'task',
  };
  const key = KEY_FOR_KIND[kind];
  const href = key
    ? `${roomHref(ROOM_FOR_KIND[kind])}?${key}=${encodeURIComponent(id)}`
    : roomHref(ROOM_FOR_KIND[kind]);

  const redacted = kind === 'lead_unanswered' && row.redacted === true;

  return (
    <Link href={href} className="wl-tcard" data-kind={kind} data-row={id}>
      <div>
        <span className="wl-tcprimary">{primary}</span>
        {detail && <span className="wl-tcdetail">{detail}</span>}
      </div>
      <div className="wl-tcfig">
        {figure && <><span className="wl-tcfigval">{figure.value}</span>
                     <span className="wl-tcfiglab">{figure.label}</span></>}
      </div>
      {redacted && (
        <div className="wl-tcgate">
          <span className="wl-tcgateline">{COPY_REDACTED.line}</span>
          <span className="wl-tcgatecta">{COPY_REDACTED.cta}</span>
        </div>
      )}
    </Link>
  );
}

/**
 * ONE SECTION, WITH ITS FOLD  [R-39.14].
 *
 * ⚠ THE HIDDEN ROWS ARE IN THE DOM, IN THE WIRE'S ORDER. Opening the fold reveals rows
 * that were already rendered in place; it cannot re-rank anything, because there is no
 * second list to rank. The alternative — slicing on open — would put the ordering decision
 * inside a click handler, which is the last place anyone would look for it.
 *
 * ⚠ TRUNCATED SECTIONS CARRY BOTH CONTROLS, AND THAT IS RULED (c-39.28, amending F-a).
 * The label reads 「Show all 20+」 rather than a bare total, so the tell sits INSIDE the
 * promise; the room door beside it goes where the twenty-first row lives. Two controls,
 * two different jobs, neither promising what the wire cannot deliver.
 */
function Section({ kind, rows, today }: { kind: AttentionKind; rows: Array<Record<string, unknown>>; today: WorklistTodayResponse }) {
  const [open, setOpen] = useState(false);
  const cut = today.truncated[kind] === true;
  const label = roomLabel(kind);
  const foldable = rows.length > IN_PLACE;

  return (
    <section className="wl-tsec" id={sectionId(kind)} data-foldscope data-open={open ? '1' : '0'} aria-label={label}>
      <div className="wl-tsechead">
        <span className="wl-tsecname">{label}</span>
        <span className="wl-tseccount" data-truncated={cut ? 'true' : undefined}>{countText(today, kind)}</span>
      </div>

      {rows.map((row, i) => {
        const card = <Card key={String(row.id ?? i)} kind={kind} row={row} wireToday={today.today} />;
        return i < IN_PLACE ? card : <div key={String(row.id ?? i)} className="wl-tfolded">{card}</div>;
      })}

      {foldable && (
        <button className="wl-tfoldbtn" type="button" aria-expanded={open}
                aria-controls={sectionId(kind)} onClick={() => setOpen((v) => !v)}>
          {open ? COPY.todayFoldLess : `${COPY.todayFoldMore} ${countText(today, kind)}`}
        </button>
      )}

      {cut && (
        <div className="wl-tmore">
          <span className="wl-tmorecount">{countText(today, kind)}</span>
          <Link href={roomHref(ROOM_FOR_KIND[kind])} className="wl-tmorelink">
            {COPY.todaySeeAllIn} {label}
          </Link>
        </div>
      )}
    </section>
  );
}

/**
 * THE KIND LINE — F-39.24's CURE  [chair amendment (a); D-1 measured it at 96/110 px].
 *
 * Five kinds above the fold in ONE line at t5, each segment an in-page anchor to its own
 * eyebrow. Shape 1 could not clear the fold clause at any in-place count above one; the
 * cure is not to compress the masthead or cut the cards, but to put the KNOWING and the
 * WAY DOWN in the same fourteen pixels.
 *
 * ⚠ COUNTS FROM THE WIRE, NOUNS FROM `COPY.kindNouns`, ANCHORS FROM `ROOM_FOR_KIND`.
 * Three sources, one home each, and no label spelled in this file.
 */
export function TodayKindLine({ today }: { today: WorklistTodayResponse }) {
  const na = today.needs_attention as unknown as Record<string, unknown[]>;
  const kinds = (Object.keys(na) as AttentionKind[]).filter((k) => (today.counts[k] ?? 0) > 0);
  if (kinds.length === 0) return null;
  return (
    <div className="wl-mkinds">
      {kinds.map((kind, i) => {
        const n = today.counts[kind] ?? 0;
        const [one, many] = COPY.kindNouns[kind];
        // The plural rides the COUNT, and a truncated kind is always plural — it is a
        // floor of twenty, never one.
        const noun = n === 1 && today.truncated[kind] !== true ? one : many;
        return (
          <span key={kind} style={{ display: 'contents' }}>
            {i > 0 && <span className="wl-mkdot">{'\u00b7'}</span>}
            <a className="wl-mkind" href={'#' + sectionId(kind)}>{countText(today, kind)} {noun}</a>
          </span>
        );
      })}
    </div>
  );
}

export function TodayCards({ today }: { today: WorklistTodayResponse }) {
  const na = today.needs_attention as unknown as Record<string, Array<Record<string, unknown>>>;
  const kinds = Object.keys(na) as AttentionKind[];
  return (
    <div className="wl-tfeed">
      {kinds.map((kind) => {
        const rows = na[kind] ?? [];
        if (rows.length === 0) return null;
        return <Section key={kind} kind={kind} rows={rows} today={today} />;
      })}
      <style>{FEED_CSS}</style>
    </div>
  );
}

/**
 * THE LEDGER — `done_today`, THREE KEYS, WITH THE PARTICULAR  [F-d, amending F-39.18 (3)].
 *
 * S4/2 shipped this as a bare count block; c-39.28's sibling ruling AMENDS THAT SEAL BY
 * NAME to a ledger that shows what was finished. `invoice_number`, `client_name`,
 * `amount_total` and the task `title` were all on the wire from Phase 3 and read by
 * nobody — this is a client change only, and it discharges s-39.6: the three registry
 * labels were a stand-in for a vetoed set, and a particular removes the need for one.
 *
 * §3 property 8: three keys, because only three kinds can PROVE 「today」. The response
 * says so BY SHAPE, and the instruction is 「do not render a fourth bucket or a sentence
 * explaining the absence」 — so `todayRestingScope` is the one scope line and there is no
 * second.
 */
function DoneSummary({ today }: { today: WorklistTodayResponse }) {
  const d = today.done_today;
  const label = (id: string) => ROOMS.find((r) => r.id === id)?.label ?? id;
  const groups: Array<[string, string[], number]> = [
    [label('invoices'),  (d?.invoice_paid ?? []).map((r) =>
       dot([r.client_name, r.invoice_number, formatRs(r.amount_total)])), (d?.invoice_paid ?? []).length],
    [label('contracts'), (d?.contract_signed ?? []).map((r) => r.title || '\u2014'), (d?.contract_signed ?? []).length],
    [label('team'),      (d?.team_task_done ?? []).map((r) => r.title || '\u2014'), (d?.team_task_done ?? []).length],
  ];
  return (
    <>
      <div className="wl-trestrows">
        {groups.map(([name, particulars, n]) => (
          <div key={name} className="wl-trestrow">
            <span>
              <span className="wl-trestlabel">{name}</span>
              {particulars.map((p, i) => <span key={i} className="wl-trestpart">{p}</span>)}
            </span>
            <span className="wl-trestn">{n}</span>
          </div>
        ))}
      </div>
      <p className="wl-trestscope">{COPY.todayRestingScope}</p>
    </>
  );
}

/**
 * THE RESTING STATE  [R-37.63 ③, as re-drawn at D-1/c5].
 *
 * ⚠ NO NUMERAL BESIDE IT. The masthead carries the date and the rule and nothing else:
 * a measured 0 standing next to 「All clear.」 says the same thing twice, in two registers,
 * and the sentence is the better of the two. `app/w/today/page.tsx` gates the numeral on
 * the working state for exactly this reason.
 */
export function TodayResting({ today }: { today: WorklistTodayResponse }) {
  return (
    <section className="wl-trest" aria-label="Done today">
      <h1 className="wl-tresthead">{COPY.todayRestingHead}</h1>
      <DoneSummary today={today} />
      <style>{REST_CSS}</style>
    </section>
  );
}

/** THE SAME LEDGER, BENEATH A WORKING DAY. Its eyebrow is the vetoed `Done today`; no
 *  status byte, because 「All clear.」 over the cards that disprove it is F-38.31 inverted. */
export function TodayDone({ today }: { today: WorklistTodayResponse }) {
  return (
    <section className="wl-tdone" aria-label="Done today">
      <div className="wl-tdonerule" />
      <div className="wl-tdonehead">{COPY.todayDoneHead}</div>
      <DoneSummary today={today} />
      <style>{REST_CSS}</style>
    </section>
  );
}

// Rules transcribed from the ratified frames' own stylesheet, not re-authored. Existing
// rungs and tokens only. NO BACKTICKS ANYWHERE IN THESE LITERALS (s-39.7, eighth instance
// was in this delivery's sibling file).
const FEED_CSS = `
.wl-tfeed{padding-top:20px;padding-bottom:24px}
.wl-tsec+.wl-tsec{margin-top:24px}
.wl-tsechead{display:flex;align-items:baseline;justify-content:space-between;margin:0 0 8px}
.wl-tsecname{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-tseccount{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-tseccount{font-variant-numeric:lining-nums tabular-nums}
/* ONE TAP TO THE RECORD: the whole card is the target and no second affordance inside it
   competes for the finger. The figure sits IN the card grid rather than under it in its
   own padded block, which is what made the rejected surface read as a list with a receipt
   stapled to each row. */
.wl-tcard{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:13px 14px;margin-bottom:var(--wl-step);text-decoration:none}
.wl-tcprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.wl-tcdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px}
.wl-tcdetail{font-variant-numeric:lining-nums tabular-nums}
.wl-tcfig{text-align:right;white-space:nowrap}
.wl-tcfigval{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.wl-tcfigval{font-variant-numeric:lining-nums tabular-nums}
.wl-tcfiglab{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:2px}
.wl-tcgate{grid-column:1/-1;border-top:.5px solid var(--atelier-card-border);margin-top:11px;padding-top:11px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.wl-tcgateline{font:var(--wl-t5);color:var(--atelier-ink-mute)}
/* F-39.22 RETIRED HERE. This declaration shipped at .32em, carried without re-derivation
   from SliceShell's own See-plans block — which is main-side and legitimately tracked at
   that value. In the shell it was the sole outlier against fourteen declarations at .08em.
   A main-side tracking crossing into a branch-side surface is the class of drift R-38.4
   exists to catch, and the census is the finding's text. */
.wl-tcgatecta{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-accent-text);white-space:nowrap}
/* R-39.14 · THE FOLD. Hidden rows stay in the DOM in the wire's order, so opening cannot
   re-rank anything. */
[data-foldscope][data-open="0"] .wl-tfolded{display:none}
.wl-tfoldbtn{display:flex;align-items:center;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);background:none;border:none;cursor:pointer;padding:0}
.wl-tfoldbtn{font-variant-numeric:lining-nums tabular-nums}
.wl-tmore{display:flex;align-items:baseline;justify-content:space-between;gap:12px;min-height:44px}
.wl-tmorecount{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-tmorecount{font-variant-numeric:lining-nums tabular-nums}
.wl-tmorelink{font:var(--wl-t4);color:var(--atelier-accent-text);text-decoration:none}
.wl-tcard:active{background:var(--atelier-row-hover)}
.wl-tcard:focus-visible,.wl-tfoldbtn:focus-visible,.wl-tmorelink:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;

const REST_CSS = `
.wl-trest{padding-top:20px;padding-bottom:24px}
.wl-tresthead{font:var(--wl-t1);color:var(--atelier-ink);margin-bottom:14px}
.wl-tdone{padding-bottom:28px}
.wl-tdonerule{height:.5px;background:var(--role-metal);opacity:.55;margin:0 0 18px}
.wl-tdonehead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin-bottom:10px}
.wl-trestrows{border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg)}
.wl-trestrow{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:11px 14px}
.wl-trestrow+.wl-trestrow{border-top:.5px solid var(--atelier-card-border)}
.wl-trestlabel{font:var(--wl-t4);color:var(--atelier-ink-soft)}
.wl-trestpart{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px}
.wl-trestpart{font-variant-numeric:lining-nums tabular-nums}
.wl-trestn{font:var(--wl-t4);color:var(--atelier-ink)}
.wl-trestn{font-variant-numeric:lining-nums tabular-nums}
.wl-trestscope{font:var(--wl-t5);color:var(--atelier-ink-mute);margin-top:10px}
`;
