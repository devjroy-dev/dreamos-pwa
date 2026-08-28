'use client';
// components/vendor/CalendarCrewSheet.tsx
// TDW_04.5 P1 #6 (CE Ruling №10) — the day-sheet CREW PICKER.
// Bottom sheet: toggle the ACTIVE team on/off a booking, then commit ONE full-array SET
// PATCH through the backend (never client-side). Scaffold + tokens mirror CalendarBlockSheet
// byte-for-byte (Atelier/Editorial; no new design vocabulary; one gold — the Save CTA).
// The clash notice rides the existing toast pattern, verbatim-bare, non-blocking (Ruling №3),
// and is dormant today (F-04.88 + F-04.92; see crewCommit.ts). All write/response logic lives
// in lib/vendor/crewCommit.ts (framework-agnostic, proof-driven); this file is its UI shell.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTeam, updateEvent } from '@/lib/vendor/api/vendor';
import { commitCrew } from '@/lib/vendor/crewCommit';
import type { ToastKind } from '@/hooks/vendor/useToast';
import type { TeamMember, DayEvent } from '@/lib/vendor/types/vendor';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

const SHEET: React.CSSProperties = {
  background: 'var(--atelier-sheet-top)',
  backdropFilter: 'blur(40px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
};
const D = {
  border: '0.5px solid var(--atelier-card-border)',
  borderStrong: '0.5px solid rgba(201,168,76,0.35)',
  muted: 'var(--atelier-ink-mute)',
  cream: 'var(--atelier-ink)',
  gold: 'var(--role-metal)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label: 'var(--font-jost), system-ui, sans-serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
};
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// COPY (founder veto standing — proposals ship unless vetoed):
const EMPTY_STATE = 'No one on your team yet — add crew in Studio.';

// ── F10(b)'s THREE BYTES LEFT WITH THE LEG — F-38.61, founder walk 2026-08-29 ──
// `POST_TO_COLLAB`, `PAST_DATE` and `NO_CITY` moved to `CalendarDaySheet.tsx`, which owns the
// Collab pill now. They are copy with ONE HOME and the home is wherever the control is; a
// constant left behind here would be a byte nobody renders and the next reader's first wrong
// turn. See that file's F-38.61 block for the whole reasoning.

interface Props {
  open: boolean;
  event: DayEvent | null;
  /** The function's date (YYYY-MM-DD). The DayEvent contract does not carry it —
      the day sheet and the band board each know it, so they hand it down rather
      than the sheet guessing. Absent = the date refusal fires, which is the
      honest failure. */
  // `eventDate` LEFT WITH THE LEG AT F-38.61. It existed to carry the post's date into the
  // collab composer and had no other reader in this sheet — derived, not assumed. The caller
  // hands it to the day sheet now.
  onClose: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  onRefresh: () => void;
}

export function CalendarCrewSheet({ open, event, onClose, onToast, onRefresh }: Props) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [working, setWorking] = useState(false);

  // On open: fetch the ACTIVE team (fetchTeam reused — no new fetch shape), seed the
  // toggles from THIS booking's crew (day-fetch's always-an-array assigned_member_ids).
  useEffect(() => {
    if (!open || !event) return;
    setSelected(new Set(event.assigned_member_ids || []));
    let live = true;
    setLoading(true);
    fetchTeam()
      .then((r) => { if (live && r && (r as { ok?: boolean }).ok) setMembers((r as { members: TeamMember[] }).members || []); })
      .catch(() => { /* soft — empty list renders the empty state */ })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [open, event]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function save() {
    if (!event || working) return;
    setWorking(true);
    try {
      await commitCrew(event.id, selected, {
        updateEvent: (id, body) => updateEvent(id, body),
        onToast, onRefresh, onClose,
      });
    } catch {
      onToast('Network error.', 'error'); // existing estate string (CalendarBlockSheet)
    } finally {
      setWorking(false);
    }
  }

  // ── F10(b)'s LEG MOVED OUT AT F-38.61 (founder walk, 2026-08-29) ──────────
  // `postToCollab` and its two refusals now live in `CalendarDaySheet.tsx`, on the Collab
  // pill in the event's own action row.
  //
  // THE FOUNDER FOUND IT BY WALKING, AND THE DIAGNOSIS IS THAT THE ACTION WAS FILED UNDER
  // THE WRONG NOUN. A vendor who wanted to post a requirement for an event had to open a
  // sheet about HER OWN TEAM to find a door about hiring SOMEBODY ELSE'S. The capability was
  // live the whole time and buried one level down — F-09.129's shape, and found the same way.
  //
  // ONE HOME, NOT TWO. The button here retires rather than staying as a second door; two
  // homes for one action is the disease this estate names most often, and this sheet is the
  // wrong home by the same reasoning that gave the pill its right one.

  // TDW_09 R-U25: was the glyph form. A crew rate is money a vendor reads.
  const rate = (m: TeamMember) => (m.daily_rate_inr != null ? formatRs(m.daily_rate_inr) : null);

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
        padding: `0 0 calc(24px + env(safe-area-inset-bottom))`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 320ms ${EASE}`,
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>

        {/* Title */}
        <div style={{ padding: '6px 24px 16px', borderBottom: D.border }}>
          <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: 'var(--atelier-accent-text)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            {event ? event.title : ''}
          </p>
          <h2 style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, lineHeight: 1.5, color: D.cream, marginTop: 2 }}>
            Assign crew
          </h2>
        </div>

        {/* Body — the ACTIVE team as toggles, or the empty state */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {loading && members.length === 0 ? (
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>Loading team…</p>
          ) : members.length === 0 ? (
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>{EMPTY_STATE}</p>
          ) : (
            members.map((m) => {
              const on = selected.has(m.id);
              return (
                <button key={m.id} type="button" onClick={() => toggle(m.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer',
                  padding: '11px 14px', borderRadius: 12,
                  background: on ? 'var(--atelier-input-border)' : 'var(--atelier-input-bg)',
                  border: 'none',
                  outline: on ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid var(--atelier-input-border)',
                }}>
                  {/* selection dot */}
                  <span style={{
                    width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                    border: on ? `1px solid ${D.gold}` : '1px solid var(--atelier-label)',
                    background: on ? D.gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, lineHeight: 1.5, color: '#111', fontWeight: 700,
                  }}>{on ? '✓' : ''}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: F.display, fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: D.cream }}>{m.name}</span>
                    {(m.role || rate(m)) && (
                      <span style={{ display: 'block', marginTop: 2, fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: D.muted }}>
                        {m.role || 'crew'}{rate(m) ? ` · ${rate(m)}` : ''}
                      </span>
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Commit — the one gold */}
        <div style={{ padding: '12px 24px 0' }}>
          <button type="button" disabled={working || !event} onClick={() => void save()} style={{
            padding: '13px 0', width: '100%', border: 'none', borderRadius: 999,
            background: working || !event ? 'var(--atelier-input-border)' : D.gold,
            cursor: working || !event ? 'default' : 'pointer',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#111',
            letterSpacing: '0.26em', textTransform: 'uppercase',
          }}>{working ? 'Saving…' : 'Save crew'}</button>
        </div>
      </div>
    </>
  );
}
