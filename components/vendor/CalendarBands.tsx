'use client';
// components/vendor/CalendarBands.tsx
// TDW_04.5 · P2 — THE WEDDING-BAND VIEW (spec §P2, CE-ruled F1–F7).
//
// One lane per wedding: Cormorant title + money whisper on the left, the function
// pips strung along a hairline span on the right. Crew ride the pips as brass-line
// initial circles. Loose functions (no binder) get their own section beneath.
//
// ── THE VISUAL VOCABULARY IS INHERITED, NOT INVENTED ─────────────────────────
// CalendarCrewSheet.tsx already shipped the crew language and this file speaks it
// rather than opening a second dialect: the same Atelier tokens, the same Cormorant
// display / Jost label pairing, brass-line circles, and ONE gold per screen. On this
// board the single gold is the MUHURAT DIAMOND (spec §3, verbatim: "the muhurat
// diamond stays the only gold; crew circles are brass-line, not gold fill").
//
// ── THE RINGS (CE ruling F6) ─────────────────────────────────────────────────
//   pending   -> HOLLOW ring        (transparent fill, brass-soft stroke)
//   confirmed -> SOLID BRASS-LINE   (brass-tinted fill, full brass stroke)
//   declined  -> TERRACOTTA ring
// The state is DB truth, straight from crew_confirmations (0087 §D) via the wire.
// Nothing here infers a confirmation; an unreadable crew leg renders no circle at all.
//
// ── THE MONEY WHISPER (CE ruling F2(b)) ──────────────────────────────────────
// This file imports the estate's CANON — derive.ts::pendingOf, F-04.13, CE-ratified
// 2026-07-15 — and applies it to the four raw cells the endpoint ships. It does NOT
// compute "owed" by any other means; it is a consumer, exactly as derive.ts's own
// header requires of every renderer. ABSENT-HONESTY, ruled: no cells => NO whisper.
// A zero is never printed in place of an unknown.

import { useEffect, useMemo, useState } from 'react';
import { fetchBands } from '@/lib/vendor/api/vendor';
import { pendingOf } from '@/lib/vendor/derive';
import type { Band, BandFunction, BandCrew, BandsResponse } from '@/lib/vendor/types/vendor';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  brassSoft: 'rgba(201,168,76,0.28)',
  brassRing: 'rgba(201,168,76,0.55)',
  terracotta:'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtShort(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) return s;
  return `${parseInt(m[3])} ${MONTHS_SHORT[parseInt(m[2]) - 1]}`;
}

// COPY (founder veto ANSWERED YES, 2026-07-22 — all six as proposed):
const UNTITLED   = 'Untitled wedding';
const EMPTY_BOARD = "No weddings on the board. Link a booking to a client's binder and it becomes a band.";
const LOOSE_LABEL = 'Loose engagements';

/** Indian-grouped rupees: 125000 -> "₹1,25,000". */
function inr(n: number): string {
  return formatRs(Math.round(n)); // TDW_09 R-U25: was the glyph form
}

/**
 * The money whisper, or null.
 *
 * THE CANON DOES THE ARITHMETIC — this function only decides whether there is
 * anything honest to SAY. Two absences are distinguished deliberately:
 *   · no cells object at all (hop failed / no binder)  -> null, silent
 *   · cells present but the headline `amount` unfiled  -> null, silent
 * Neither prints ₹0. A settled binder (pending 0) shows its value alone.
 */
function whisperFor(band: Band): string | null {
  const m = band.money;
  if (!m) return null;
  const amount = m.amount == null ? null : Number(m.amount);
  if (amount == null || !Number.isFinite(amount) || amount === 0) return null;
  const pending = pendingOf(m);   // derive.ts, F-04.13 — the ONE rule
  return pending > 0 ? `${inr(amount)} · ${inr(pending)} pending` : inr(amount);
}

// ── the crew circle ──────────────────────────────────────────────────────────
function CrewCircle({ c }: { c: BandCrew }) {
  const pending   = c.confirmation === 'pending';
  const declined  = c.confirmation === 'declined';
  const stroke    = declined ? A.terracotta : (pending ? A.brassSoft : A.brassRing);
  const fill      = declined ? 'transparent' : (pending ? 'transparent' : 'rgba(201,168,76,0.14)');
  const text      = declined ? A.terracotta : A.brassWarm;
  return (
    <span
      title={`${c.name} — ${c.confirmation}`}
      aria-label={`${c.name}, ${c.confirmation}`}
      style={{
        width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `0.5px solid ${stroke}`,
        background: fill,
        fontFamily: F.label, fontWeight: 400, fontSize: 16, lineHeight: 1.5,
        letterSpacing: '0.04em', color: text,
      }}>{c.initials}</span>
  );
}

// ── one function pip ─────────────────────────────────────────────────────────
function Pip({ fn, muhurat, onTap }: { fn: BandFunction; muhurat: boolean; onTap: (fn: BandFunction) => void }) {
  return (
    <button type="button" onClick={() => onTap(fn)}
      aria-label={`${fn.title}, ${fmtShort(fn.date)}${fn.gap ? ', no crew assigned' : ''}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        background: 'none', border: 'none', padding: '2px 0', cursor: 'pointer',
        minWidth: 62, flexShrink: 0,
      }}>
      {/* the pip itself — a gap is HOLLOW with a hairline pulse */}
      <span
        className={fn.gap ? 'tdw-gap-pulse' : undefined}
        style={{
          width: 11, height: 11, borderRadius: '50%',
          border: `0.5px ${fn.gap ? 'dashed' : 'solid'} ${fn.gap ? A.brassSoft : A.brassRing}`,
          background: fn.gap ? 'transparent' : 'rgba(201,168,76,0.16)',
          position: 'relative',
        }}>
        {/* THE ONE GOLD ON THIS SCREEN — the muhurat diamond (spec §3) */}
        {muhurat && (
          <span style={{
            position: 'absolute', top: -6, left: '50%', marginLeft: -2.5,
            width: 5, height: 5, background: 'var(--role-metal)',
            transform: 'rotate(45deg)',
          }} />
        )}
      </span>
      <span style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 8,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: A.inkMute, whiteSpace: 'nowrap',
      }}>{fmtShort(fn.date)}</span>
      <span style={{
        fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5,
        color: A.inkSoft, maxWidth: 74, overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{fn.kind}</span>
      {fn.crew.length > 0 && (
        <span style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {fn.crew.slice(0, 4).map(c => <CrewCircle key={c.member_id} c={c} />)}
        </span>
      )}
    </button>
  );
}

interface Props {
  vendorId: string;
  from: string;
  to: string;
  /** Muhurat dates in view, already gated by the page's Hot Dates toggle. */
  muhuratDates: Set<string>;
  /** A NON-gap pip goes to the day sheet (04's, unchanged). */
  onOpenDay: (dateIso: string) => void;
  /** A GAP pip goes straight to the shipped crew picker (CE ruling F3). */
  onAssignCrew: (fn: BandFunction) => void;
  /** Bumped by the page after any write, so the board re-reads. */
  refreshKey: number;
}

export function CalendarBands({ vendorId, from, to, muhuratDates, onOpenDay, onAssignCrew, refreshKey }: Props) {
  const [data, setData]       = useState<BandsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed]   = useState(false);

  // Re-fetches on window change (month-nav) AND on refreshKey — the grid and the
  // board read the same span, F-04.47's lesson applied at birth.
  useEffect(() => {
    let live = true;
    setLoading(true);
    setFailed(false);
    fetchBands(vendorId, from, to)
      .then((r) => {
        if (!live) return;
        if (r && (r as BandsResponse).ok) setData(r as BandsResponse);
        else { setData(null); setFailed(true); }
      })
      .catch(() => { if (live) { setData(null); setFailed(true); } })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [vendorId, from, to, refreshKey]);

  const tapPip = useMemo(() => (fn: BandFunction) => {
    if (fn.gap) onAssignCrew(fn);
    else onOpenDay(fn.date);
  }, [onAssignCrew, onOpenDay]);

  if (loading && !data) {
    // Skeleton: three quiet lanes. Never an empty state while a read is in flight —
    // "no weddings" and "not loaded yet" are different sentences.
    return (
      <div style={{ padding: '10px 22px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ opacity: 0.28 - i * 0.07 }}>
            <div style={{ height: 15, width: 148, background: A.brassLine, borderRadius: 2 }} />
            <div style={{ height: 0.5, background: A.brassLine, margin: '16px 0 0' }} />
          </div>
        ))}
      </div>
    );
  }

  if (failed) {
    // ST-2 disclosed blindness: say the board could not be read. Do NOT render an
    // empty board, which would assert "no weddings" on the strength of a failed GET.
    return (
      <div style={{
        padding: '18px 22px 26px', fontFamily: F.script, fontStyle: 'italic',
        fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute,
      }}>The board could not be read just now.</div>
    );
  }

  const bands = data?.bands ?? [];
  const loose = data?.loose ?? [];

  if (bands.length === 0 && loose.length === 0) {
    return (
      <div style={{
        padding: '18px 22px 26px', fontFamily: F.script, fontStyle: 'italic',
        fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.5,
      }}>{EMPTY_BOARD}</div>
    );
  }

  return (
    <div style={{ padding: '4px 0 20px' }}>
      <style>{`
        @keyframes tdwGapPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.00); }
          50%      { box-shadow: 0 0 0 3px rgba(201,168,76,0.13); }
        }
        .tdw-gap-pulse { animation: tdwGapPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tdw-gap-pulse { animation: none; } }
      `}</style>

      {bands.map((b) => {
        const whisper = whisperFor(b);
        return (
          <div key={b.binder_id} style={{ padding: '0 22px' }}>
            <div style={{ padding: '16px 0 10px', borderBottom: `0.5px solid ${A.brassLine}` }}>
              {/* THE BAND HEAD — title + money whisper.
                  Band-tap navigation is deliberately ABSENT (CE ruling F4): the 03
                  binder story has no addressable route at HEAD, so this sitting builds
                  no destination rather than guessing one. Wire point named in the
                  handover beside F3's Post-to-Collab. */}
              <div style={{
                fontFamily: F.display, fontWeight: 400, fontSize: 20,
                color: A.ink, lineHeight: 1.15, letterSpacing: '0.005em',
              }}>{b.title ?? UNTITLED}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                <span style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  letterSpacing: '0.3em', textTransform: 'uppercase', color: A.brassWarm,
                }}>
                  {b.span.start === b.span.end ? fmtShort(b.span.start) : `${fmtShort(b.span.start)} — ${fmtShort(b.span.end)}`}
                </span>
                {/* Absent-honesty: when the canon has nothing trustworthy to say,
                    this element does not exist. It never renders ₹0. */}
                {whisper && (
                  <span style={{
                    fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                    fontSize: 16, lineHeight: 1.5, color: A.inkMute,
                  }}>{whisper}</span>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex', gap: 14, overflowX: 'auto', padding: '12px 0 4px',
              scrollbarWidth: 'none',
            }}>
              {b.functions.map(fn => (
                <Pip key={fn.event_id} fn={fn} muhurat={muhuratDates.has(fn.date)} onTap={tapPip} />
              ))}
            </div>
          </div>
        );
      })}

      {loose.length > 0 && (
        <div style={{ padding: '0 22px', marginTop: bands.length ? 20 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 8px' }}>
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass,
            }}>{LOOSE_LABEL}</div>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--atelier-ink-dim)' }} />
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
            {loose.map(fn => (
              <Pip key={fn.event_id} fn={fn} muhurat={muhuratDates.has(fn.date)} onTap={tapPip} />
            ))}
          </div>
        </div>
      )}

      {/* The cap's honest tell — the same sentence class as the grid's (page.tsx:417).
          No truncation class is expected on a month±1 window; if this ever draws, it
          is a finding, not a shrug. */}
      {data?.truncated && (
        <div style={{
          padding: '10px 22px 0', fontFamily: F.script, fontStyle: 'italic',
          fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute,
        }}>Over 400 entries in this span — the furthest are not drawn.</div>
      )}
    </div>
  );
}
