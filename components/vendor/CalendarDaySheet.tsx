'use client';
// components/vendor/CalendarDaySheet.tsx
// TDW_04 B6 surfaces S2 — item 4, P5's day sheet: "the platform thesis in one
// surface." One round trip (GET /vendor/day/:vendorId/:date) feeds:
//   1. bookings by slot, binder chips (linked_binder_id -> name, fail-soft)
//   2. the followup projection (C7, read-time; quiet italic lines)
//   3. the muhurat note when present
//   4. money due — milestones from payment_schedules, mark-paid = existing door
//   5. actions: Block morning/noon/evening/day toggles (availability door,
//      per-slot since 0078) · + Booking (AddSheet create, draft-first per 03) ·
//      Move on any booking -> date+slot picker with the INLINE CONFLICT VERDICT
//      riding the 409 body whole (conflictOr400 puts conflict.message in
//      `error` and the conflict object beside it; _base's handleResponse never
//      throws on non-2xx, so the refusal ARRIVES and renders VERBATIM — the
//      door reasons, this sheet only renders) · the ask primer.
//
// HONESTY POSTURE, AMENDED AT F-38.61 (founder walk, 2026-08-29) — READ THE AMENDMENT, NOT ONLY THE RULE.
// This block used to read 「every verdict line printed here is the wire's own sentence」, and
// that stopped being literally true the moment the Collab pill's two refusals were ruled into
// this sheet's verdict surface. THEY ARE NOT WIRE SENTENCES; they are client-side pre-checks
// that fire BEFORE any door is called. Leaving the old sentence standing would have been a
// comment asserting a contract the same cut falsified — F-38.29's shape, three lines from the
// code it describes.
//
// THE WIDENED CONTRACT: this surface renders exactly THREE kinds of line, each labelled at
// its render site with `data-verdict-kind`, and none is ever invented or softened.
//   (1) `wire`      — the door's own sentence, verbatim. The original rule, still binding.
//   (2) `preflight` — this sheet's own pre-check, from the veto ledger's exact bytes, saying
//                     why a door was NOT CALLED at all. The collab pill's two refusals.
//   (3) `transport` — the door was called and did not answer. The client saying so.
//
// A FOURTH CANNOT SLIP IN UNLABELLED, and that is structural rather than a promise: the kind
// lives in the state's TYPE, so there is no way to write this surface without saying what the
// line is, and a new kind cannot arrive without widening a union that `b40` C42 reads.
//
// ⚠ KIND (3) IS NOT NEW — IT WAS FOUND BY THIS AMENDMENT, IN THE FIRST MINUTE. Five `catch`
// arms have printed `'Network error.'` here for as long as the sheet has existed, under a
// header calling every line the wire's own sentence. It was a third kind all along and
// NOTHING COULD SEE IT while one untyped setter carried everything. Forcing it into `wire`
// to keep the count at two would have been the type asserting a lie. Filed as F-38.p7.
//
// The founder ruled ONE refusal surface rather than a second; the honest form of that ruling
// is to say what the one surface actually carries.
// A refused Move renders the checker's message and moves nothing; an advisory
// (ok:true + conflict) renders as a heads-up over work that LANDED. Nothing is
// invented, nothing is softened. isOverridable never reaches this file (Q-C-3:
// the client must never learn kind !== 'date_blocked').

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchDay, blockDate, unblockDate, updateEvent, cancelEvent, markMilestonePaid,
} from '@/lib/vendor/api/vendor';
import type {
  VendorDayResponse, DayEvent, DayBlock, ApiErr,
} from '@/lib/vendor/types/vendor';
import { SLOT_LABELS, SLOT_ORDER, SLOT_HEADINGS } from '@/lib/vendor/slotWords';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home
import { fetchMe } from '@/lib/vendor/api/vendor';
import { requirementForKind } from '@/lib/vendor/api/roster';
import { roomHref } from '@/lib/worklist/rooms'; // the one home for where a room lives

// ── F-38.61 · THE COLLAB LEG'S THREE BYTES, MOVED HERE WITH THE CONTROL ────────
// Founder walk, 2026-08-29: 「in crew, edit etc — collab should be there」. The leg is
// F10(b)'s and its bytes are the veto ledger's exact ones; what moved is the home, not the
// words. Copy has ONE HOME and the home is wherever the control is.
const POST_TO_COLLAB = 'Collab';
const PAST_DATE      = 'This date has passed. Collab posts need a future date.';
const NO_CITY        = 'Add a city to your profile before posting.';

const D = {
  border: '0.5px solid var(--atelier-card-border)',
  borderStrong: '0.5px solid rgba(201,168,76,0.35)',
  muted: 'var(--atelier-ink-mute)',
  cream: 'var(--atelier-ink)',
  gold: 'var(--atelier-accent-text)',
  red: 'var(--role-critical)',
  terracotta: 'var(--role-critical)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label: 'var(--font-jost), system-ui, sans-serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
};
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SHEET: React.CSSProperties = {
  background: 'var(--atelier-sheet-top)',
  backdropFilter: 'blur(40px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
};

// TDW_04.5 P3, CE ruling F8(d) — LABELED HOIST, behaviour-identical: SLOT_LABELS,
// SLOT_ORDER and SLOT_HEADINGS moved verbatim to lib/vendor/slotWords.ts so the public
// crew page can import the SAME words instead of declaring a second copy (F-04.104's
// class). Byte-for-byte the same values; this file's only change is where they live.
// The import rides the block above.

function fmtDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3])} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m[2])-1]} ${m[1]}`;
}
// TDW_09 R-U27/R-U28: glyph and shorthand together. A day-sheet line reflows.
function rupees(n: number) {
  return formatRs(n);
}

interface Props {
  open: boolean;
  dateIso: string | null;
  vendorId: string;
  muhuratLocal?: boolean;         // grid-side hot flag, shown while the payload loads
  onClose: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** Refresh the grid's own reads (windowed events + blocks projection). */
  onRefresh: () => void;
  /** Open the AddSheet in create mode with this date prefilled (+ Booking). */
  onAddBooking: (date: string) => void;
  /** Open the full-day block flow (the existing CalendarBlockSheet: reason
      picker on block, unblock on an existing full-day block). */
  onFullDayBlock: (date: string) => void;
  /** Open the edit form for a booking (the existing AddSheet edit mount). */
  onEdit: (ev: DayEvent) => void;
  /** TDW_04.5 P1 #6 (CE Ruling №10): open the "Assign crew" picker for this booking. */
  onAssignCrew: (ev: DayEvent) => void;
}

export function CalendarDaySheet({
  open, dateIso, vendorId, muhuratLocal, onClose, onToast, onRefresh, onAddBooking, onFullDayBlock, onEdit, onAssignCrew,
}: Props) {
  const router = useRouter();
  const [day, setDay] = useState<VendorDayResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  // The inline verdict line. See the HONESTY POSTURE amendment at the head of this file:
  // it carries wire sentences AND, since F-38.61, this sheet's own two collab refusals.
  const [verdict, setVerdictState] = useState<{ kind: 'wire' | 'preflight' | 'transport'; line: string } | null>(null);

  // ── THE TWO WRITERS, AND THERE IS NO THIRD ────────────────────────────────
  // The chair ruled the amended contract must NAME BOTH KINDS AND LABEL EACH AT ITS RENDER
  // SITE, so a third kind cannot slip in unlabelled. A single `wireVerdict(string)` could not
  // carry that: every call would have to remember which kind it was, and the one that forgot
  // would render as whichever the reader assumed. So the KIND IS IN THE TYPE. There is no
  // way to write this state without saying what it is, and `b40` C42 asserts no bare writer
  // grows back.
  //
  // `wireVerdict` — the door's own sentence, verbatim, never softened.
  // `preflightRefusal` — this sheet's own pre-check, from the veto ledger's bytes, saying why
  //   no door was called at all.
  // `transportFailure` — see below. THE THIRD KIND, AND IT WAS ALREADY HERE.
  //
  // ⚠ MAKING THE KIND EXPLICIT FOUND A THIRD KIND IN THE FIRST MINUTE, WHICH IS THE WHOLE
  // ARGUMENT FOR THE RULING. Five `catch` arms printed `'Network error.'` into this surface
  // and the old header called every line 「the wire's own sentence」 — but the wire never
  // answered; that is the client saying so. It has been a third, unlabelled kind since long
  // before the collab pill, and nothing could see it while one untyped setter carried all
  // three.
  //
  // FORCING IT INTO `wire` WOULD HAVE BEEN THE TYPE ASSERTING A LIE, so it is named instead.
  // It is not a preflight either: the door WAS called and did not answer. Filed as F-38.p7 —
  // the class is 「a surface whose declared contract was narrower than its traffic」, and its
  // cure here is a label, not a rewrite of five catch arms.
  const wireVerdict = (line: string) => setVerdictState({ kind: 'wire', line });
  const preflightRefusal = (line: string) => setVerdictState({ kind: 'preflight', line });
  const transportFailure = (line: string) => setVerdictState({ kind: 'transport', line });
  const clearVerdict = () => setVerdictState(null);
  // F-38.61: the city the collab post would carry. Read once when the sheet opens, from the SAME
  // /me the profile screen reads — never guessed, never cached across sessions (no browser
  // storage in this estate). Travelled here with the leg, unchanged.
  const [city, setCity] = useState<string | null>(null);
  // Move state: which booking is being moved, and the picker's values.
  const [moveId, setMoveId] = useState<string | null>(null);
  const [moveDate, setMoveDate] = useState('');
  const [moveSlot, setMoveSlot] = useState<'' | 'morning' | 'noon' | 'evening'>('');

  const load = useCallback(async () => {
    if (!dateIso) return;
    setLoading(true);
    try {
      const res = await fetchDay(vendorId, dateIso);
      if ((res as VendorDayResponse).ok) setDay(res as VendorDayResponse);
      else setDay(null);
    } catch { setDay(null); }
    finally { setLoading(false); }
  }, [vendorId, dateIso]);

  useEffect(() => {
    if (!open || !dateIso) { setDay(null); clearVerdict(); setMoveId(null); return; }
    clearVerdict(); setMoveId(null); setMoveDate(''); setMoveSlot('');
    let liveMe = true;
    fetchMe()
      .then((r) => { if (liveMe) setCity(((r as { vendor?: { city?: string } })?.vendor?.city) || null); })
      .catch(() => { /* soft — a null city fires the refusal in words, not a crash */ });
    void load();
    return () => { liveMe = false; };
  }, [open, dateIso, load]);

  if (!dateIso) return null;

  const blocks: DayBlock[] = day?.blocks ?? [];
  const fullDayBlock = blocks.find((b) => b.slot === 'full_day') ?? null;
  const slotBlock = (s: string) => blocks.find((b) => b.slot === s) ?? null;

  async function toggleSlot(slot: 'morning' | 'noon' | 'evening') {
    if (working || !dateIso) return;
    setWorking(true); clearVerdict();
    try {
      const existing = slotBlock(slot);
      if (existing) {
        const r = await unblockDate(existing.id);
        if (!r.ok) { wireVerdict((r as ApiErr).error ?? 'Could not unblock.'); return; }
        onToast('Slot unblocked', 'success');
      } else {
        const r = await blockDate({ blocked_date: dateIso, slot });
        // The refusal (full_day already held, or the race's 409) arrives in
        // `error` — the door's sentence, rendered verbatim, moving nothing.
        if (!r.ok) { wireVerdict((r as ApiErr).error ?? 'Could not block.'); return; }
        onToast('Slot blocked', 'success');
      }
      await load(); onRefresh();
    } catch { transportFailure('Network error.'); }
    finally { setWorking(false); }
  }

  async function doMove(ev: DayEvent) {
    if (working || !moveDate) return;
    setWorking(true); clearVerdict();
    try {
      const body: { event_date: string; slot?: 'morning' | 'noon' | 'evening' } = { event_date: moveDate };
      if (moveSlot) body.slot = moveSlot;
      const r = await updateEvent(ev.id, body);
      if (!r.ok) {
        // THE INLINE CONFLICT VERDICT (item 4's centrepiece): conflictOr400 put
        // the checker's blessed sentence in `error` and the conflict object
        // beside it. Print the sentence; name the holders if they rode along.
        const e = r as ApiErr & { conflict?: { holding?: { title: string }[] } };
        const holders = e.conflict?.holding?.map((h) => h.title).filter(Boolean) ?? [];
        wireVerdict((e.error ?? 'Could not move it.') + (holders.length ? ` Holding: ${holders.join(', ')}.` : ''));
        return;
      }
      const adv = (r as unknown as { conflict?: { message?: string } }).conflict;
      // An ADVISORY over a landed write: the move HAPPENED; the heads-up prints
      // over it as a success toast carrying the checker's sentence — never
      // mistaken for a refusal (ToastKind is success|error; an advisory is not
      // an error, and calling it one would be a false failure).
      onToast(adv?.message ? `Moved — heads-up: ${adv.message}` : 'Moved.', 'success');
      setMoveId(null); setMoveDate(''); setMoveSlot('');
      await load(); onRefresh();
    } catch { transportFailure('Network error.'); }
    finally { setWorking(false); }
  }

  // ── F-38.61 · POST TO COLLAB, FROM THE EVENT'S OWN ACTION ROW ─────────────
  // FOUNDER WALK, 2026-08-29: 「in crew, edit etc — collab should be there」.
  //
  // THE ACTION WAS FILED UNDER THE WRONG NOUN, and that is the finding rather than the
  // placement. This leg has been live since F10(b) — buried inside `CalendarCrewSheet`, so a
  // vendor who wanted to post a requirement for an event had to open a sheet ABOUT HER OWN
  // TEAM to reach a door about hiring SOMEBODY ELSE'S. A live capability behind a door nobody
  // would think to open is F-09.129's shape, and it was found the same way that one was: by
  // walking, not by reading.
  //
  // ONE HOME. The crew sheet's button RETIRED in the same cut rather than staying as a second
  // door — founder-ruled, and two homes for one action is the disease this estate names most
  // often. The function, its two refusals, its city read and its three bytes all travelled
  // together; a leg split across two files is how the halves drift.
  //
  // THE GAP YOU ARE LOOKING AT IS THE REQUIREMENT. Rather than make the vendor retype the
  // date, the city and the category on another screen, this hands them to the composer in
  // the URL — unchanged from F10(b), including `requirementForKind`'s map from its one home
  // and its deliberate refusal to prefill a chip it cannot be sure of.
  //
  // BOTH REFUSALS FIRE HERE, IN WORDS, BEFORE NAVIGATION. Sending someone to a composer that
  // will reject them is the failure this control exists to avoid, and a disabled pill would
  // tell her nothing about why. Founder-ruled at F-38.61: they render in the VERDICT surface this
  // sheet already owns — one refusal surface, never a second.
  function postToCollab(ev: DayEvent) {
    clearVerdict();
    if (!dateIso || new Date(dateIso) < new Date(new Date().toDateString())) {
      preflightRefusal(PAST_DATE); return;
    }
    if (!city) { preflightRefusal(NO_CITY); return; }
    const type = requirementForKind(ev.kind);
    const qs = new URLSearchParams({ post: '1', date: dateIso, city });
    if (type) qs.set('type', type);
    onClose();
    // The address book, not a literal — §4-4 batch ③'s ruling holds wherever this leg lives.
    router.push(`${roomHref('collab')}?${qs.toString()}`);
  }

  async function doCancel(ev: DayEvent) {
    if (working) return;
    setWorking(true); clearVerdict();
    try {
      const r = await cancelEvent(ev.id);
      if (!r.ok) { wireVerdict((r as ApiErr).error ?? 'Could not cancel.'); return; }
      onToast('Cancelled.', 'success');
      await load(); onRefresh();
    } catch { transportFailure('Network error.'); }
    finally { setWorking(false); }
  }

  async function doMarkPaid(id: string, amount: number) {
    if (working) return;
    setWorking(true); clearVerdict();
    try {
      const r = await markMilestonePaid(id, amount);
      if (!r.ok) { wireVerdict((r as ApiErr).error ?? 'Could not mark it paid.'); return; }
      onToast('Marked paid.', 'success');
      await load();
    } catch { transportFailure('Network error.'); }
    finally { setWorking(false); }
  }

  // Bookings grouped by slot, C2's order; unslotted last (timeline-only).
  const groups = SLOT_ORDER
    .map((s) => ({
      slot: s,
      rows: (day?.events ?? []).filter((e) => (e.slot ?? null) === s),
    }))
    .filter((g) => g.rows.length > 0);

  const hotNote = day?.hot ? (day.hot.note || day.hot.label || 'Auspicious date') : (muhuratLocal ? 'Auspicious date' : null);

  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'var(--atelier-overlay-bg)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        }} />
      )}

      <div style={{
        ...SHEET,
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderTop: D.borderStrong,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 320ms ${EASE}`,
        maxHeight: '86dvh', display: 'flex', flexDirection: 'column',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '6px 24px 14px', borderBottom: D.border }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                {fmtDate(dateIso)}
              </p>
              <h2 style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, lineHeight: 1.5, color: D.cream, marginTop: 2 }}>
                {fullDayBlock ? 'Blocked day' : 'The day'}
              </h2>
            </div>
            <button type="button" onClick={() => { onClose(); onAddBooking(dateIso); }} style={{
              border: '0.5px solid rgba(201,168,76,0.4)', background: 'none', borderRadius: 999,
              padding: '7px 14px', cursor: 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 9, color: D.gold,
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>+ Booking</button>
          </div>
          {hotNote && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: D.terracotta, boxShadow: '0 0 6px rgba(224,123,92,0.6)' }} />
              <span style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: D.terracotta }}>{hotNote}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* The verdict line — the wire's sentence, verbatim, never softened. */}
          {verdict && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              border: '0.5px solid rgba(224,112,112,0.4)', background: 'rgba(180,40,40,0.10)',
              fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.red,
            }}>
              {/* ── EACH KIND LABELLED AT ITS RENDER SITE, chair-ruled ────────────────
                  The label is for the READER OF THIS FILE and for the cell that walks it —
                  it is `data-verdict-kind`, not a visible eyebrow. THE VENDOR SEES ONE
                  SENTENCE and should: she does not care whether a door refused her or was
                  never called, only what to do next, and printing 「preflight」 over her copy
                  would be the estate talking to itself on her screen.
                  A fourth kind cannot arrive unlabelled, because it cannot arrive without a
                  writer, and a writer cannot exist without widening the union above. */}
              <span data-verdict-kind={verdict.kind}>{verdict.line}</span>
            </div>
          )}

          {loading && !day && (
            <div style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>Fetching the day…</div>
          )}

          {/* Blocks — the held slots, named, beside the bookings (Q-S-4). */}
          {blocks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {blocks.map((b) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: D.muted, minWidth: 64 }}>
                    {b.slot === 'full_day' ? 'All day' : b.slot}
                  </span>
                  <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.cream }}>
                    Blocked{b.reason ? <span style={{ color: D.muted }}> · {b.reason}</span> : null}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bookings by slot, binder chips */}
          {groups.length === 0 && !loading && blocks.length === 0 && (
            <div style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>
              Nothing scheduled.
            </div>
          )}
          {groups.map((g) => (
            <div key={String(g.slot)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                {SLOT_HEADINGS[g.slot ?? '_none']}
              </span>
              {g.rows.map((ev) => (
                <div key={ev.id} className="atelier-card" style={{ padding: '12px 14px' }}>
                  {/* ── F-38.p9 · THE ACTIONS TOOK THEIR OWN ROW, AND THE ARITHMETIC IS WHY ──
                      Founder walk, 2026-08-29, on the cut that added the fifth pill:
                      「all working but the layout fucked」. He was right and it was not a
                      tuning problem — the row ran out of card.

                      DERIVED FROM THIS FILE'S OWN VALUES at his 374px viewport, not measured
                      by eye. `pillBtn` is 8px Jost at 0.24em tracking with 5px 10px padding
                      and a 0.5px border, `gap: 6`:

                        Move 49 · Crew 49 · Collab 62 · Edit 49 · Cancel 62  = 271
                        four gaps                                           =  24
                                                                        row = 295px
                        card inner at 374 (24 sheet gutter + 28 card padding) = 322px
                        left for the title                                  =  17px

                      The title carried `flex: 1, minWidth: 0` against pills at
                      `flexShrink: 0`, so it collapsed to seventeen pixels and its text ran
                      under the controls. FOUR pills was 251px and left 61 — tight, and it had
                      been getting away with it; the fifth is what tipped it.

                      ⚠ THE OLD ROW WAS ALREADY WRONG AND NOBODY HAD SEEN IT. An event with a
                      long title was having its name squeezed by controls at four pills too.
                      The fifth did not create the defect, it made it unmissable — which is
                      the second time this arc a walk has found what no cell could.

                      NOT `flexWrap`, AND THE REASON IS RULED RATHER THAN AESTHETIC. Wrapping
                      breaks at a point that MOVES WITH THE TITLE'S LENGTH, so the pills would
                      sit differently on every event. R-37.22: a control that moves under the
                      thumb is a control that cannot be learned. A full-width row of its own
                      puts every pill in the same place on every card.

                      295px in 322px, nothing shrinking, and the title stops competing with
                      the buttons entirely. */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--atelier-label)', marginBottom: 3 }}>
                      {ev.kind}{ev.event_time ? ` · ${ev.event_time.slice(0, 5)}` : ''}{ev.state === 'done' ? ' · done' : ''}
                    </div>
                    <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: D.cream }}>{ev.title}</div>
                    {ev.binder_name && (
                      <div style={{ marginTop: 4, display: 'inline-block', padding: '3px 9px', borderRadius: 999, border: '0.5px solid rgba(201,168,76,0.28)', fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: D.gold }}>
                        {ev.binder_name}
                      </div>
                    )}
                  </div>
                  {/* THE ACTION ROW · F-38.61's ruled order: Move · Crew · Collab · Edit ·
                      Cancel. Collab beside Crew because both answer 「who works this event」,
                      and both ahead of the destructive Cancel, which stays inline — founder's
                      default at the F-38.p9 relay.
                      No `flexShrink: 0` and no `flex: 1` on anything: the row owns the full
                      card width now, so there is nothing for the pills to compete with and
                      nothing to protect them from. */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button type="button" onClick={() => { clearVerdict(); setMoveId(moveId === ev.id ? null : ev.id); setMoveDate(''); setMoveSlot(''); }} style={pillBtn(D.gold)}>Move</button>
                    <button type="button" onClick={() => { onClose(); onAssignCrew(ev); }} style={pillBtn('var(--atelier-label)')}>Crew</button>
                    <button type="button" onClick={() => postToCollab(ev)} style={pillBtn('var(--atelier-label)')}>{POST_TO_COLLAB}</button>
                    <button type="button" onClick={() => { onClose(); onEdit(ev); }} style={pillBtn('var(--atelier-label)')}>Edit</button>
                    <button type="button" onClick={() => void doCancel(ev)} style={pillBtn(D.terracotta, 'rgba(224,123,92,0.4)')}>Cancel</button>
                  </div>

                  {/* The Move picker + inline verdict (item 4's centrepiece) */}
                  {moveId === ev.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: D.border, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input type="date" value={moveDate} onChange={(e) => setMoveDate(e.target.value)} style={{
                        width: '100%', padding: '10px 13px', boxSizing: 'border-box',
                        background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)',
                        borderRadius: 10, fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
                        color: D.cream, outline: 'none', 
                      }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        {SLOT_LABELS.map(({ key, label }) => (
                          <button key={key} type="button" onClick={() => setMoveSlot(moveSlot === key ? '' : key)} style={{
                            padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                            background: moveSlot === key ? 'var(--atelier-input-border)' : 'var(--atelier-input-bg)',
                            border: 'none',
                            outline: moveSlot === key ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid var(--atelier-input-border)',
                            fontFamily: F.label, fontWeight: moveSlot === key ? 400 : 300, fontSize: 9,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            color: moveSlot === key ? D.cream : D.muted,
                          }}>{label}</button>
                        ))}
                      </div>
                      <button type="button" disabled={working || !moveDate} onClick={() => void doMove(ev)} style={{
                        padding: '11px 0', width: '100%', border: 'none', borderRadius: 999,
                        background: working || !moveDate ? 'var(--atelier-input-border)' : D.gold,
                        cursor: working || !moveDate ? 'default' : 'pointer',
                        fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#111',
                        letterSpacing: '0.26em', textTransform: 'uppercase',
                      }}>{working ? 'Working…' : 'Move it'}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Followup projection — C7's quiet italic lines */}
          {(day?.followups?.length ?? 0) > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 4, borderTop: D.border }}>
              {day!.followups.map((f) => (
                <div key={f.id} style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>
                  Follow up{f.client ? ` — ${f.client}` : ''}{f.note ? `: ${f.note}` : ''}{f.repeat_every ? ` (repeats ${f.repeat_every})` : ''}
                </div>
              ))}
            </div>
          )}

          {/* Money due — C8, mark-paid through the existing door */}
          {(day?.milestones?.length ?? 0) > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4, borderTop: D.border }}>
              <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Money due</span>
              {day!.milestones.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ flex: 1, fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.cream }}>
                    {rupees(m.amount_due)} due{m.client_name ? ` — ${m.client_name}` : ''}{m.of ? ` (${m.ordinal} of ${m.of})` : ''}
                  </span>
                  <button type="button" disabled={working} onClick={() => void doMarkPaid(m.id, m.amount_due)} style={pillBtn(D.gold)}>
                    Mark paid
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions: the block toggles + the full-day flow + the ask primer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8, borderTop: D.border }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              Hold the day
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SLOT_LABELS.map(({ key, label }) => {
                const held = !!slotBlock(key) || !!fullDayBlock;
                const own = !!slotBlock(key);
                return (
                  <button key={key} type="button"
                    disabled={working || (!!fullDayBlock && !own)}
                    onClick={() => void toggleSlot(key)}
                    style={{
                      padding: '8px 14px', borderRadius: 999,
                      cursor: working || (!!fullDayBlock && !own) ? 'default' : 'pointer',
                      background: held ? 'var(--atelier-input-border)' : 'var(--atelier-input-bg)',
                      border: 'none',
                      outline: held ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid var(--atelier-input-border)',
                      opacity: !!fullDayBlock && !own ? 0.5 : 1,
                      fontFamily: F.label, fontWeight: held ? 400 : 300, fontSize: 9,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: held ? D.cream : D.muted,
                    }}>{held ? `${label} ✕` : label}</button>
                );
              })}
              <button type="button" disabled={working} onClick={() => { onClose(); onFullDayBlock(dateIso); }} style={{
                padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
                background: fullDayBlock ? 'var(--atelier-input-border)' : 'var(--atelier-input-bg)',
                border: 'none',
                outline: fullDayBlock ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid var(--atelier-input-border)',
                fontFamily: F.label, fontWeight: fullDayBlock ? 400 : 300, fontSize: 9,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: fullDayBlock ? D.cream : D.muted,
              }}>{fullDayBlock ? 'Day blocked — manage' : 'Block day'}</button>
            </div>

            <button type="button" onClick={() => {
              onClose();
              router.push(`/vendor?aiPrimer=${encodeURIComponent(`About ${fmtDate(dateIso)}: `)}`);
            }} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left',
              fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold,
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>{/* R-37.70: 「Victor」 is an internal SEAT name and appears in no vendor-facing
                    byte. This control was invisible to the shell's persona sweep until
                    calendar crossed at §4-2 and the served-bytes gate found it — and then
                    invisible to the sweep AGAIN, because that matcher covered one name out
                    of five in bare JSX text (F-38.40's sibling). The affordance keeps its
                    verb; only the character leaves. */}
              Ask TDW about this date →</button>
          </div>
        </div>
      </div>
    </>
  );
}

function pillBtn(color: string, border?: string): React.CSSProperties {
  return {
    background: 'none', border: `0.5px solid ${border ?? 'rgba(201,168,76,0.28)'}`,
    borderRadius: 999, padding: '5px 10px', cursor: 'pointer',
    fontFamily: F.label, fontWeight: 300, fontSize: 8,
    letterSpacing: '0.24em', textTransform: 'uppercase', color,
  };
}
