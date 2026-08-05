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
import { fetchTeam, updateEvent, fetchMe } from '@/lib/vendor/api/vendor';
import { requirementForKind } from '@/lib/vendor/api/roster';
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

// TDW_04.5 P4 · ruling F10(b) — the veto ledger's exact bytes.
const POST_TO_COLLAB = 'Post to Collab';
const PAST_DATE      = 'This date has passed. Collab posts need a future date.';
const NO_CITY        = 'Add a city to your profile before posting.';

interface Props {
  open: boolean;
  event: DayEvent | null;
  /** The function's date (YYYY-MM-DD). The DayEvent contract does not carry it —
      the day sheet and the band board each know it, so they hand it down rather
      than the sheet guessing. Absent = the date refusal fires, which is the
      honest failure. */
  eventDate?: string | null;
  onClose: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  onRefresh: () => void;
}

export function CalendarCrewSheet({ open, event, eventDate, onClose, onToast, onRefresh }: Props) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [working, setWorking] = useState(false);
  // F10(b): the city the post would carry. Read once when the sheet opens, from
  // the SAME /me the profile screen reads — never guessed, never cached across
  // sessions (no browser storage in this estate).
  const [city, setCity] = useState<string | null>(null);
  const [collabRefusal, setCollabRefusal] = useState('');

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
    fetchMe()
      .then((r) => { if (live) setCity(((r as { vendor?: { city?: string } })?.vendor?.city) || null); })
      .catch(() => { /* soft — a null city fires the in-sheet refusal, not a crash */ });
    setCollabRefusal('');
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

  // ── F10(b): POST TO COLLAB ────────────────────────────────────────────────
  // The gap you are looking at IS the requirement. Rather than make the vendor
  // retype the date, the city and the category on another screen, the sheet
  // hands them to the composer in the URL.
  //
  // BOTH REFUSALS FIRE HERE, IN WORDS, BEFORE NAVIGATION. Sending someone to a
  // composer that will reject them is the failure this row exists to avoid —
  // and a disabled button would tell them nothing about why.
  function postToCollab() {
    if (!event) return;
    if (!eventDate || new Date(eventDate) < new Date(new Date().toDateString())) {
      setCollabRefusal(PAST_DATE); return;
    }
    if (!city) { setCollabRefusal(NO_CITY); return; }

    // Appendix A's map, from its one home. `other`/`blocked`/unknown prefill
    // NOTHING — a wrong chip is worse than an empty one — and the two-chip ASK
    // (fitting/trial) deliberately prefills nothing so the vendor chooses.
    const type = requirementForKind(event.kind);
    const qs = new URLSearchParams({ post: '1', date: eventDate, city });
    if (type) qs.set('type', type);
    onClose();
    router.push(`/vendor/collab?${qs.toString()}`);
  }

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

        {/* F10(b) — Post to Collab. A ROW, deliberately not a button: the Save
            CTA below is this screen's ONE GOLD and stays that way. This is the
            same brass-outline vocabulary the estate uses for secondary acts. */}
        <div style={{ padding: '12px 24px 0', borderTop: D.border }}>
          <button type="button" onClick={postToCollab} style={{
            width: '100%', padding: '11px 0', background: 'transparent',
            border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 12,
            cursor: 'pointer',
            fontFamily: F.label, fontWeight: 300, fontSize: 9, color: 'var(--atelier-accent-text)',
            letterSpacing: '0.3em', textTransform: 'uppercase',
          }}>{POST_TO_COLLAB}</button>
          {collabRefusal && (
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.muted, marginTop: 8, lineHeight: 1.5 }}>
              {collabRefusal}
            </p>
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
