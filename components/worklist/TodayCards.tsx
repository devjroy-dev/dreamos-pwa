"use client";
// components/worklist/TodayCards.tsx — THE FEED, RENDERED IN THE BODY'S OWN ORDER.
//
// ── THE ORDER IS THE WIRE'S, AND THIS FILE NEVER SORTS ──────────────────────
// §3 property 4: key order in `needs_attention` IS D-4's ranking, and JSON preserves
// insertion order. So the render walks `Object.keys(needs_attention)` and the only thing
// it does with a kind is look up where that kind lives. `ATTENTION_KINDS` exists as a SET
// for the type system; it is deliberately NOT the sequence this loop reads, because then
// a wire re-rank would be silently overridden by a constant in the client.
//
// §3 property 5: ties within a kind break oldest-first, DELIVERED THAT WAY. Nothing here
// re-orders rows either.
//
// ── ⚠ ZERO NEW COPY, AND THE HEADERS PROVE IT (R-39.x, copy line 8) ─────────
// Every card header is the room's own label, read from `ROOMS`. Spelling 「Leads」 here
// would be a second home for a byte the registry already owns, and the two would drift
// the first time a room is renamed — which is exactly what happened to Team Hub.
//
// ── ⚠ THE REDACTED UPSELL IS NOT MINTED HERE. ONE HOME. ─────────────────────
// The founder's line-7 veto of 2026-08-29 carried the clause that decided this: if the
// Leads room already carries a vetoed redacted-row byte, THAT BYTE WINS and the new one
// is not minted. It does — `components/vendor/slices/SliceShell.tsx`, the
// `slice === 'leads' && sel?.redacted` block, copy executed by the founder 2026-08-25 and
// shipped character for character. So `COPY_REDACTED` below is that sentence and that CTA
// label, verbatim, and `Contact details are on Essential and above. Upgrade in Billing.`
// was WITHDRAWN BEFORE IT WAS BUILT. The register carries both facts.
//
// KEYED ON `redacted`, NEVER ON A MISSING PHONE (R-37.23) — and on this wire there is no
// phone field to miss at any tier (§3 property 7), so the positive statement is the only
// signal there could be.
//
// SUPPRESSION, NOT SUBSTITUTION, carried across from the row swipe's ruling: a redacted
// card grows no contact affordance that then explains itself. The upsell occupies the slot
// the affordance would have taken, and a gesture never opens a sales surface.
import Link from 'next/link';
import { ROOMS, ROOM_FOR_KIND, roomHref } from '@/lib/worklist/rooms';
import { COPY } from '@/lib/worklist/copy';
import { formatRs } from '@/lib/vendor/format';
import type { AttentionKind, WorklistTodayResponse } from '@/lib/vendor/types/vendor';

// The two bytes reused verbatim from the Leads room's founder-vetoed block. Named as
// reuse, at the point of reuse, so a reader who greps either sentence finds both sites.
const COPY_REDACTED = {
  line: 'Upgrade to Essential tier or above to connect with your lead.',
  cta:  'See plans',
};

function labelFor(kind: AttentionKind): string {
  const id = ROOM_FOR_KIND[kind];
  return ROOMS.find((r) => r.id === id)?.label ?? id;
}

/** A date the vendor reads, from an ISO the wire sends. Never a raw ISO on glass. */
function dateLine(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function dot(parts: Array<string | null | undefined>): string {
  return parts.filter((p) => !!p && String(p).trim()).join(' · ');
}

/**
 * ONE ROW, PER KIND. The fields are the contract's, and no kind reads a field §3 does not
 * put on its rows — a render that reaches for `row.phone` would be reaching for something
 * the wire does not carry at ANY tier, and would fail silently rather than loudly.
 */
function Row({ kind, row }: { kind: AttentionKind; row: Record<string, unknown> }) {
  const id = String(row.id ?? '');
  let primary = '';
  let detail = '';
  let figure = '';

  if (kind === 'lead_unanswered') {
    primary = (row.name as string) || '—';
    detail  = dot([row.wedding_city as string, dateLine(row.wedding_date as string)]);
  } else if (kind === 'invoice_due') {
    primary = (row.client_name as string) || (row.invoice_number as string) || '—';
    detail  = dot([row.invoice_number as string, dateLine(row.due_date as string)]);
    // THE ZERO IS THE ROW'S TRUTH, AND IT PRINTS. Chair's ruling, 2026-08-29 addendum:
    // the card shows `amount_owed` as computed and nothing else. A state that says unpaid
    // over a fully-paid row is the WRITER's defect (F-39.8), and a card that hides it is a
    // card covering for a write path — which is how a false-done gets built.
    figure  = formatRs(row.amount_owed as number);
  } else if (kind === 'events_today') {
    primary = (row.title as string) || '—';
    detail  = dot([row.event_time as string, row.kind as string, row.slot as string]);
  } else if (kind === 'contract_unsigned') {
    primary = (row.title as string) || '—';
    detail  = dot([row.state as string, dateLine(row.sent_at as string)]);
  } else {
    primary = (row.title as string) || '—';
    detail  = dot([row.priority as string, dateLine(row.due_date as string)]);
  }

  // WHERE THE TAP LANDS. Leads carry the record in the query so the room can focus it
  // (F-39.11); the other four land in the room itself, because none of those rooms has an
  // existing per-record address and inventing one here would be a new door by the back way.
  const href = kind === 'lead_unanswered'
    ? `${roomHref(ROOM_FOR_KIND[kind])}?lead=${encodeURIComponent(id)}`
    : roomHref(ROOM_FOR_KIND[kind]);

  const redacted = kind === 'lead_unanswered' && row.redacted === true;

  return (
    <div className="wl-tcard" data-kind={kind} data-row={id}>
      <Link href={href} className="wl-tcardtap">
        <span className="wl-tcprimary">{primary}</span>
        {detail && <span className="wl-tcdetail">{detail}</span>}
      </Link>
      {figure && <div className="wl-tcfigure">{figure}</div>}
      {redacted && (
        <div className="wl-tcgate">
          <div className="wl-tcgateline">{COPY_REDACTED.line}</div>
          <Link href={roomHref('billing')} className="wl-tcgatecta">{COPY_REDACTED.cta}</Link>
        </div>
      )}
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
        // THE COUNT IS `counts[k]`, NOT `rows.length`, AND THE DIFFERENCE IS THE POINT.
        // §3 property 1 makes them equal — and property 3 makes `counts[k]` a FLOOR when
        // the cap fired, so the tell rides the wire's figure, never the array we happen to
        // have been handed.
        const n = today.counts[kind] ?? rows.length;
        const cut = today.truncated[kind] === true;
        return (
          <section key={kind} className="wl-tsec" aria-label={labelFor(kind)}>
            <div className="wl-tsechead">
              <span className="wl-tsecname">{labelFor(kind)}</span>
              <span className="wl-tseccount" data-truncated={cut ? 'true' : undefined}>
                {n}{cut ? COPY.todayTruncatedSuffix : ''}
              </span>
            </div>
            {rows.map((row, i) => <Row key={String(row.id ?? i)} kind={kind} row={row} />)}
          </section>
        );
      })}
      <style>{FEED_CSS}</style>
    </div>
  );
}

/**
 * THE RESTING STATE — `done_today`, THREE KEYS, AND NO FOURTH  [R-37.63 ③].
 *
 * §3 property 8: there are three keys because only three kinds can PROVE 「today」; leads
 * and events carry no completion timestamp. The response says so BY SHAPE, and the
 * instruction that follows is 「do not render a fourth bucket or a sentence explaining the
 * absence」 — so `todayRestingScope` is the one line about coverage and there is no second.
 */
export function TodayResting({ today }: { today: WorklistTodayResponse }) {
  const d = today.done_today;
  const groups: Array<[string, number]> = [
    ['Invoices paid',    (d?.invoice_paid ?? []).length],
    ['Contracts signed', (d?.contract_signed ?? []).length],
    ['Tasks done',       (d?.team_task_done ?? []).length],
  ];
  return (
    <section className="wl-trest" aria-label="Done today">
      <h2 className="wl-tresthead">{COPY.todayRestingHead}</h2>
      <div className="wl-trestrows">
        {groups.map(([label, n]) => (
          <div key={label} className="wl-trestrow">
            <span className="wl-trestlabel">{label}</span>
            <span className="wl-trestn">{n}</span>
          </div>
        ))}
      </div>
      <p className="wl-trestscope">{COPY.todayRestingScope}</p>
      <style>{REST_CSS}</style>
    </section>
  );
}

const FEED_CSS = `
.wl-tfeed{padding-bottom:24px}
.wl-tsec+.wl-tsec{margin-top:24px}
.wl-tsechead{display:flex;align-items:baseline;justify-content:space-between;margin:0 0 8px}
/* R-38.4 permits letter-spaced uppercase in exactly two places, and a section eyebrow is
   one of them. The card headers are section eyebrows over the feed's kinds. */
.wl-tsecname{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-tseccount{font:var(--wl-t5);color:var(--atelier-ink-mute);font-variant-numeric:tabular-nums}
.wl-tcard{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;margin-bottom:var(--wl-step)}
.wl-tcardtap{display:flex;flex-direction:column;gap:4px;padding:14px 16px;text-decoration:none}
.wl-tcprimary{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-tcdetail{font:var(--wl-t5);color:var(--atelier-ink-mute)}
/* R-38.5: a right-aligned figure is tabular. Declared after any shorthand that would
   reset it — the shorthand wipes font-variant-numeric and takes the setting with it. */
.wl-tcfigure{font:var(--wl-t4);color:var(--atelier-ink-soft);text-align:right;padding:0 16px 12px}
.wl-tcfigure{font-variant-numeric:tabular-nums}
.wl-tcgate{border-top:.5px solid var(--atelier-card-border);padding:12px 16px;display:flex;flex-direction:column;gap:10px}
.wl-tcgateline{font:var(--wl-t4);color:var(--atelier-ink-mute);text-align:center}
.wl-tcgatecta{display:flex;align-items:center;justify-content:center;padding:11px 0;background:var(--atelier-input-bg);border:.5px solid var(--atelier-sheet-border);border-radius:2px;text-decoration:none;font:var(--wl-t5);letter-spacing:.32em;text-transform:uppercase;color:var(--atelier-label)}
.wl-tcardtap:active{background:var(--atelier-row-hover)}
.wl-tcardtap:focus-visible,.wl-tcgatecta:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;

const REST_CSS = `
.wl-trest{padding-bottom:24px}
.wl-tresthead{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 12px}
.wl-trestrows{border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg)}
.wl-trestrow{display:flex;align-items:center;justify-content:space-between;padding:12px 16px}
.wl-trestrow+.wl-trestrow{border-top:.5px solid var(--atelier-card-border)}
.wl-trestlabel{font:var(--wl-t4);color:var(--atelier-ink-soft)}
.wl-trestn{font:var(--wl-t4);color:var(--atelier-ink)}
.wl-trestn{font-variant-numeric:tabular-nums}
.wl-trestscope{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:10px 0 0}
`;
