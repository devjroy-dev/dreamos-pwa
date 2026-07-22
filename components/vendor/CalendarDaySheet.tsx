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
//      door reasons, this sheet only renders) · Ask Victor primer.
//
// HONESTY POSTURE: every verdict line printed here is the wire's own sentence.
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

const D = {
  border: '0.5px solid var(--atelier-card-border)',
  borderStrong: '0.5px solid rgba(201,168,76,0.35)',
  muted: 'var(--atelier-ink-mute)',
  cream: 'var(--atelier-ink)',
  gold: 'var(--atelier-accent-text)',
  red: '#E07070',
  terracotta: '#E07B5C',
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
function rupees(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₹${n}`;
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
  // The inline verdict line — the wire's own sentence, rendered verbatim.
  const [verdict, setVerdict] = useState<string | null>(null);
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
    if (!open || !dateIso) { setDay(null); setVerdict(null); setMoveId(null); return; }
    setVerdict(null); setMoveId(null); setMoveDate(''); setMoveSlot('');
    void load();
  }, [open, dateIso, load]);

  if (!dateIso) return null;

  const blocks: DayBlock[] = day?.blocks ?? [];
  const fullDayBlock = blocks.find((b) => b.slot === 'full_day') ?? null;
  const slotBlock = (s: string) => blocks.find((b) => b.slot === s) ?? null;

  async function toggleSlot(slot: 'morning' | 'noon' | 'evening') {
    if (working || !dateIso) return;
    setWorking(true); setVerdict(null);
    try {
      const existing = slotBlock(slot);
      if (existing) {
        const r = await unblockDate(existing.id);
        if (!r.ok) { setVerdict((r as ApiErr).error ?? 'Could not unblock.'); return; }
        onToast('Slot unblocked', 'success');
      } else {
        const r = await blockDate({ blocked_date: dateIso, slot });
        // The refusal (full_day already held, or the race's 409) arrives in
        // `error` — the door's sentence, rendered verbatim, moving nothing.
        if (!r.ok) { setVerdict((r as ApiErr).error ?? 'Could not block.'); return; }
        onToast('Slot blocked', 'success');
      }
      await load(); onRefresh();
    } catch { setVerdict('Network error.'); }
    finally { setWorking(false); }
  }

  async function doMove(ev: DayEvent) {
    if (working || !moveDate) return;
    setWorking(true); setVerdict(null);
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
        setVerdict((e.error ?? 'Could not move it.') + (holders.length ? ` Holding: ${holders.join(', ')}.` : ''));
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
    } catch { setVerdict('Network error.'); }
    finally { setWorking(false); }
  }

  async function doCancel(ev: DayEvent) {
    if (working) return;
    setWorking(true); setVerdict(null);
    try {
      const r = await cancelEvent(ev.id);
      if (!r.ok) { setVerdict((r as ApiErr).error ?? 'Could not cancel.'); return; }
      onToast('Cancelled.', 'success');
      await load(); onRefresh();
    } catch { setVerdict('Network error.'); }
    finally { setWorking(false); }
  }

  async function doMarkPaid(id: string, amount: number) {
    if (working) return;
    setWorking(true); setVerdict(null);
    try {
      const r = await markMilestonePaid(id, amount);
      if (!r.ok) { setVerdict((r as ApiErr).error ?? 'Could not mark it paid.'); return; }
      onToast('Marked paid.', 'success');
      await load();
    } catch { setVerdict('Network error.'); }
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
              <h2 style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream, marginTop: 2 }}>
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
              <span style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 400, fontSize: 13, color: D.terracotta }}>{hotNote}</span>
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
              fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.red,
            }}>{verdict}</div>
          )}

          {loading && !day && (
            <div style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: D.muted }}>Fetching the day…</div>
          )}

          {/* Blocks — the held slots, named, beside the bookings (Q-S-4). */}
          {blocks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {blocks.map((b) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: D.muted, minWidth: 64 }}>
                    {b.slot === 'full_day' ? 'All day' : b.slot}
                  </span>
                  <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.cream }}>
                    Blocked{b.reason ? <span style={{ color: D.muted }}> · {b.reason}</span> : null}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bookings by slot, binder chips */}
          {groups.length === 0 && !loading && blocks.length === 0 && (
            <div style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: D.muted }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--atelier-label)', marginBottom: 3 }}>
                        {ev.kind}{ev.event_time ? ` · ${ev.event_time.slice(0, 5)}` : ''}{ev.state === 'done' ? ' · done' : ''}
                      </div>
                      <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 17, color: D.cream }}>{ev.title}</div>
                      {ev.binder_name && (
                        <div style={{ marginTop: 4, display: 'inline-block', padding: '3px 9px', borderRadius: 999, border: '0.5px solid rgba(201,168,76,0.28)', fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: D.gold }}>
                          {ev.binder_name}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button type="button" onClick={() => { setVerdict(null); setMoveId(moveId === ev.id ? null : ev.id); setMoveDate(''); setMoveSlot(''); }} style={pillBtn(D.gold)}>Move</button>
                      <button type="button" onClick={() => { onClose(); onAssignCrew(ev); }} style={pillBtn('var(--atelier-label)')}>Crew</button>
                      <button type="button" onClick={() => { onClose(); onEdit(ev); }} style={pillBtn('var(--atelier-label)')}>Edit</button>
                      <button type="button" onClick={() => void doCancel(ev)} style={pillBtn(D.terracotta, 'rgba(224,123,92,0.4)')}>Cancel</button>
                    </div>
                  </div>

                  {/* The Move picker + inline verdict (item 4's centrepiece) */}
                  {moveId === ev.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: D.border, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input type="date" value={moveDate} onChange={(e) => setMoveDate(e.target.value)} style={{
                        width: '100%', padding: '10px 13px', boxSizing: 'border-box',
                        background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)',
                        borderRadius: 10, fontFamily: F.body, fontWeight: 300, fontSize: 14,
                        color: D.cream, outline: 'none', colorScheme: 'dark',
                      }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        {SLOT_LABELS.map(({ key, label }) => (
                          <button key={key} type="button" onClick={() => setMoveSlot(moveSlot === key ? '' : key)} style={{
                            padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                            background: moveSlot === key ? 'var(--atelier-input-border)' : 'var(--atelier-input-bg)',
                            border: 'none',
                            outline: moveSlot === key ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid rgba(255,255,255,0.08)',
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
                <div key={f.id} style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: D.muted }}>
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
                  <span style={{ flex: 1, fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.cream }}>
                    {rupees(m.amount_due)} due{m.client_name ? ` — ${m.client_name}` : ''}{m.of ? ` (${m.ordinal} of ${m.of})` : ''}
                  </span>
                  <button type="button" disabled={working} onClick={() => void doMarkPaid(m.id, m.amount_due)} style={pillBtn(D.gold)}>
                    Mark paid
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions: the block toggles + the full-day flow + Ask Victor */}
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
                      outline: held ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid rgba(255,255,255,0.08)',
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
                outline: fullDayBlock ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid rgba(255,255,255,0.08)',
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
            }}>Ask Victor about this date →</button>
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
