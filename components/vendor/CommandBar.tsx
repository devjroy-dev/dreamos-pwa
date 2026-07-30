'use client';
// components/CommandBar.tsx
// Sticky accountability bar — between Header and Greeting.
// 4 bars, each a live tap target navigating to the relevant page.
//
// Bar 1 — Enquiry follow-ups        → /vendor/list/leads     (from context)
// Bar 2 — Incomplete profiles        → /vendor/list/leads     (from context)
// Bar 3 — Discover profile complete  → /vendor/discover       (fetched)
// Bar 4 — Hot dates availability     → /vendor/calendar       (fetched)
//
// Auto-expands once at 08:00 and once at 21:00 per session.
// Full dark/light theme via ThemeTokens.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/lib/vendor/ThemeContext';
import { fetchMe, fetchDiscoverStatus, fetchHotDates, fetchAvailability } from '@/lib/vendor/api/vendor';
import type { VendorContextResponse, MeResponse, DiscoverStatus, HotDate, AvailabilityBlock } from '@/lib/vendor/types/vendor';

const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ── Auto-expand once per 8am / 9pm slot ──────────────────────────
function shouldAutoExpand(): boolean {
  try {
    const h   = new Date().getHours();
    const hit = (h >= 8 && h < 9) || (h >= 21 && h < 22);
    if (!hit) return false;
    const key = `cmdbar_${new Date().toISOString().slice(0, 13)}`;
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
    return true;
  } catch { return false; }
}

// ── TDW_07 P4b · F-07.15 — scoreDiscover IS DEAD. ─────────────────────────────────────
// This bar carried its OWN completeness score: a five-check list re-implementing, in
// TypeScript, in another repo, a question `src/lib/vendor/profileScore.js` is the one
// authority on. It was a second authority and it was WRONG in two specific ways at the
// moment it died:
//
//   · a stale `>= 5` portfolio floor. The floor moved to SIX at P2, at one server constant,
//     and this copy never heard. It told a vendor with five approved photos that his
//     portfolio check PASSED while the server rejected his Discover request.
//   · a both-bounds rate check (`v.rate_min && v.rate_max`). P4b retires `rate_max` from
//     the estate's rate model entirely, so that check now demands a field nothing collects.
//
// Both are the same disease: a number that lives twice drifts, and the copy that is not the
// authority is the one that lies. The fix is not to correct the copy — a corrected copy
// drifts again at the next ruling. The fix is that the copy stops existing.
//
// WHAT THE BAR DOES NOW: it LINKS. Title, and a tap that routes to the Discover Profile,
// where the real meter renders. It asserts NO percentage and NO gap list, because it has no
// authority to assert them from.
//
// THE RICHER BRANCH OF THE RULING IS NOT REACHABLE YET, AND THAT IS REPORTED, NOT WORKED
// AROUND. F-07.15 rules the bar consumes "the server's one-authority score+hints OR links
// only". `GET /api/v2/vendor/discover/status` carries neither a score nor hints today —
// derived by reading DiscoverStatus at the P4b tips, not assumed. Publishing them is a
// backend movement nobody chartered this sitting, so the bar takes the ruling's second arm.
// The first arm stays available the moment the server carries the number.

// ── Hot dates availability ────────────────────────────────────────
// Hot dates from today → Dec 31 this year.
// Pct = (hot dates that ARE blocked) / (total hot dates remaining).
// A higher % = more of your hot dates are confirmed booked/blocked.
// We want this bar to fill UP — so it rewards the vendor for locking dates.
function scoreHotDates(
  hotDates: HotDate[],
  blocks: AvailabilityBlock[],
): { pct: number; total: number; confirmed: number; remaining: number } {
  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const yearEnd = new Date(today.getFullYear(), 11, 31);
  const blockedSet = new Set(blocks.map(b => b.blocked_date));

  const upcoming = hotDates.filter(d => {
    const dt = new Date(d.date); dt.setHours(0, 0, 0, 0);
    return dt >= today && dt <= yearEnd;
  });

  const confirmed  = upcoming.filter(d => blockedSet.has(d.date)).length;
  const total      = upcoming.length;
  const remaining  = total - confirmed;
  const pct        = total === 0 ? 100 : Math.round((confirmed / total) * 100);
  return { pct, total, confirmed, remaining };
}

// ── Progress colour — based on completion pct ────────────────────
// < 30%  → red
// 30–59% → amber
// ≥ 60%  → green
function progressColor(pct: number, isLight: boolean): string {
  if (pct < 30)  return isLight ? '#B02A1A' : '#C0392B';
  if (pct < 60)  return isLight ? '#A8811A' : '#D4A017';
  return isLight ? '#2E6E38' : '#3E8B4A';
}
function BarRow({
  title, aside, asideAlert, pct, route, sublabels, chips, loading, onTap,
}: {
  title: string;
  aside: string;
  asideAlert?: boolean;
  pct: number;
  route: string;
  sublabels?: { label: string; color?: string }[];
  chips?: { label: string; gap: string }[];
  loading?: boolean;
  onTap: () => void;
}) {
  const T = useT();
  const [pressed, setPressed] = useState(false);

  // Flair = the dreamai navy room — route the dark branch to ember/bone so the bar
  // stops reading brass/cream over navy. Dark + light are left byte-identical.
  const isFlair = T.pageBg === '#090d17';
  const gold = isFlair ? 'rgba(201,154,99' : 'rgba(201,168,76'; // ember vs brass base
  const bone = isFlair ? 'rgba(233,228,217' : 'rgba(240,230,210'; // bone vs warm cream

  const borderColor = pressed
    ? T.isLight ? 'rgba(122,56,40,0.38)' : `${gold},0.38)`
    : T.isLight ? 'rgba(122,56,40,0.12)' : `${gold},0.1)`;
  const bgColor = pressed
    ? T.isLight ? 'rgba(122,56,40,0.05)' : `${gold},0.06)`
    : T.isLight ? 'rgba(26,15,8,0.02)'   : (isFlair ? `${bone},0.02)` : 'rgba(245,235,212,0.02)');

  const asideColor = asideAlert
    ? T.isLight ? '#7A3828' : '#E07B5C'
    : T.inkDim;
  const routeColor  = T.isLight ? 'rgba(26,15,8,0.18)'   : `${bone},0.14)`;
  const trackBg     = T.isLight ? 'rgba(26,15,8,0.07)'   : `${bone},0.06)`;
  const chipBorder  = T.isLight ? 'rgba(26,15,8,0.1)'    : `${bone},0.1)`;
  const chipText    = T.isLight ? 'rgba(26,15,8,0.3)'    : `${bone},0.28)`;
  const gapColor    = T.isLight ? 'rgba(122,56,40,0.7)'  : 'rgba(224,123,92,0.65)';
  const arrowColor  = T.isLight ? 'rgba(122,56,40,0.38)' : `${gold},0.35)`;

  return (
    <button
      type="button"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onTap(); }}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        padding: '9px 11px',
        border: `0.5px solid ${borderColor}`,
        borderRadius: 3,
        background: bgColor,
        transition: `background 160ms ${EASE}, border-color 160ms ${EASE}`,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
        <span style={{
          fontFamily: F.label, fontSize: 7.5, fontWeight: 300,
          letterSpacing: '0.36em', textTransform: 'uppercase',
          color: T.isLight ? 'rgba(122,56,40,0.62)' : 'rgba(201,168,76,0.6)',
          lineHeight: 1,
        }}>{title}</span>

        <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{
            fontFamily: F.label, fontSize: 6.5, fontWeight: 300,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: routeColor,
            padding: '1px 5px',
            border: `0.5px solid ${T.isLight ? 'rgba(26,15,8,0.07)' : 'rgba(240,230,210,0.07)'}`,
            borderRadius: 2,
          }}>{route}</span>
          <span style={{
            fontFamily: F.script, fontStyle: 'italic', fontSize: 10.5,
            color: loading ? T.inkDim : asideColor,
          }}>{loading ? 'loading…' : aside}</span>
          <span style={{
            fontSize: 10, color: arrowColor,
            transform: pressed ? 'translateX(3px)' : 'translateX(0)',
            transition: `transform 160ms ${EASE}`,
          }}>→</span>
        </span>
      </div>

      {/* Progress bar — width = pct, colour = red/amber/green by threshold */}
      <div style={{
        width: '100%', height: 3.5,
        background: trackBg,
        borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          width: loading ? '0%' : `${pct}%`,
          height: '100%',
          background: progressColor(pct, T.isLight),
          borderRadius: 3,
          transition: `width 700ms ${EASE}, background 500ms ${EASE}`,
        }} />
      </div>

      {/* Sublabels */}
      {sublabels && sublabels.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1px' }}>
          {sublabels.map((s, i) => (
            <span key={i} style={{
              fontFamily: F.label, fontSize: 6.5, fontWeight: 200,
              color: s.color ?? (T.isLight ? 'rgba(26,15,8,0.22)' : 'rgba(240,230,210,0.2)'),
              letterSpacing: '0.04em',
            }}>{s.label}</span>
          ))}
        </div>
      )}

      {/* Chips for missing profile fields */}
      {chips && chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 1 }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              padding: '2px 6px',
              border: `0.5px solid ${chipBorder}`,
              borderRadius: 2,
              fontFamily: F.label, fontSize: 7, fontWeight: 300,
              color: chipText, letterSpacing: '0.08em',
              background: T.isLight ? 'rgba(26,15,8,0.02)' : 'rgba(240,230,210,0.02)',
            }}>
              {c.label}
              <span style={{ color: gapColor, marginLeft: 3 }}>{c.gap}</span>
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// ── CommandBar ────────────────────────────────────────────────────
export function CommandBar({
  context,
  vendorId,
  justDoIt,
  onJustDoItChange,
}: {
  context: VendorContextResponse | null;
  vendorId: string;
  justDoIt: boolean;
  onJustDoItChange: (v: boolean) => void;
}) {
  const T      = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Fetched data for bars 3 & 4
  const [me,        setMe]        = useState<MeResponse | null>(null);
  const [status,    setStatus]    = useState<DiscoverStatus | null>(null);
  const [hotDates,  setHotDates]  = useState<HotDate[]>([]);
  const [blocks,    setBlocks]    = useState<AvailabilityBlock[]>([]);
  const [fetching,  setFetching]  = useState(true);

  useEffect(() => {
    if (shouldAutoExpand()) setOpen(true);
  }, []);

  useEffect(() => {
    if (!vendorId) return;
    setFetching(true);
    Promise.all([
      fetchMe().catch(() => null),
      fetchDiscoverStatus().catch(() => null),
      fetchHotDates().catch(() => null),
      fetchAvailability(vendorId).catch(() => null),
    ]).then(([meRes, statusRes, hotRes, availRes]) => {
      if (meRes && 'vendor' in meRes)        setMe(meRes as MeResponse);
      if (statusRes && 'ok' in statusRes)    setStatus(statusRes as DiscoverStatus);
      if (hotRes && 'dates' in hotRes)       setHotDates((hotRes as { ok: true; dates: HotDate[]; total: number }).dates ?? []);
      if (availRes && 'blocks' in availRes)  setBlocks((availRes as { ok: true; blocks: AvailabilityBlock[]; total: number }).blocks ?? []);
      setFetching(false);
    });
  }, [vendorId]);

  // ── Derive bar metrics ───────────────────────────────────────────

  // Bar 1 — Enquiry follow-ups
  const newLeads     = context?.new_leads ?? [];
  const enquiryTotal = newLeads.length;
  const enquiryPct   = enquiryTotal === 0 ? 100 : 0; // all new_leads = unread

  // Bar 2 — Incomplete profiles
  const incompleteLeads = newLeads.filter(l => !l.name || !l.wedding_date || !l.budget_total);
  const profileTotal    = newLeads.length;
  const profileComplete = profileTotal - incompleteLeads.length;
  const profilePct      = profileTotal === 0 ? 100 : Math.round((profileComplete / profileTotal) * 100);
  const profileChips    = incompleteLeads.slice(0, 4).map(l => ({
    label: l.name ?? 'Unnamed',
    gap:   !l.name ? 'no name' : !l.wedding_date ? 'no date' : 'no budget',
  }));

  // Bar 3 — Discover profile. F-07.15: no local score. The bar links; the meter scores.

  // Bar 4 — Hot dates availability
  const hotScore        = scoreHotDates(hotDates, blocks);

  // ── Theme tokens — Flair = dreamai navy room: navy strip, ember accents, bone dims.
  // (barBg is the actual strip background — was hardcoded espresso-black for all non-light.)
  const isFlair = T.pageBg === '#090d17';
  const brassColor  = T.isLight ? T.accent                 : isFlair ? '#c99a63'                 : '#C9A84C';
  const barBg       = T.isLight ? 'rgba(245,242,238,0.94)' : isFlair ? 'rgba(11,17,32,0.88)'      : 'rgba(18,12,8,0.88)';
  const stripBorder = T.isLight ? 'rgba(122,56,40,0.09)'   : isFlair ? 'rgba(233,228,217,0.10)'   : 'rgba(201,168,76,0.09)';
  const panelSep    = T.isLight ? 'rgba(122,56,40,0.07)'   : isFlair ? 'rgba(233,228,217,0.08)'   : 'rgba(201,168,76,0.07)';
  const trackBg     = T.isLight ? 'rgba(26,15,8,0.07)'     : isFlair ? 'rgba(233,228,217,0.06)'   : 'rgba(240,230,210,0.06)';
  const dotColor    = T.isLight ? T.accent                 : isFlair ? '#c99a63'                 : '#C9A84C';
  const chevColor   = T.isLight ? 'rgba(122,56,40,0.38)'   : isFlair ? 'rgba(201,154,99,0.40)'    : 'rgba(201,168,76,0.36)';
  const dimColor    = T.isLight ? T.inkDim                 : isFlair ? 'rgba(233,228,217,0.35)'   : 'rgba(240,230,210,0.35)';
  const brassWarm   = T.isLight ? T.accent                 : isFlair ? 'rgba(201,154,99,0.85)'    : 'rgba(201,168,76,0.82)';
  const redColor    = T.isLight ? '#7A3828'                : '#E07B5C';

  // ── Collapsed strip prose ────────────────────────────────────────
  const parts: { text: string; color: string }[] = [];
  if (enquiryTotal > 0)
    parts.push({ text: `${enquiryTotal} unread`, color: brassWarm });
  if (incompleteLeads.length > 0)
    parts.push({ text: `${incompleteLeads.length} incomplete`, color: dimColor });
  // F-07.15 — the collapsed strip's "Discover NN%" retires WITH the score that fed it.
  // It was the same false number in a smaller font: stale 5-photo floor, both-bounds rate.
  // There is no honest percentage to print here until the server publishes one, and
  // printing an honest-looking wrong one is the disease, not the symptom.
  if (!fetching && hotScore.remaining > 0)
    parts.push({ text: `${hotScore.remaining} hot dates open`, color: redColor });
  if (parts.length === 0)
    parts.push({ text: 'All clear', color: dimColor });

  // JDI toggle
  const toggleBg     = justDoIt ? brassColor : T.isLight ? 'rgba(122,56,40,0.1)' : 'rgba(240,230,210,0.1)';
  const toggleBorder = justDoIt ? brassColor : T.isLight ? 'rgba(122,56,40,0.2)' : 'rgba(240,230,210,0.18)';
  const knobColor    = justDoIt ? '#F5F2EE' : T.inkDim;

  return (
    <div style={{
      flexShrink: 0,
      background: barBg,
      backdropFilter: 'blur(20px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
      borderBottom: `0.5px solid ${stripBorder}`,
    }}>
      <style>{`
        @keyframes cbPulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.38; }
        }
        @keyframes cbSlide {
          from { opacity:0; transform:translateY(-5px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* ── Collapsed strip — always visible ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'center',
          padding: '8px 15px', gap: 9,
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        {/* Pulsing dot */}
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: dotColor,
          boxShadow: `0 0 6px ${dotColor}cc`,
          flexShrink: 0,
          animation: enquiryTotal > 0 || hotScore.remaining > 0
            ? `cbPulse 2.2s ease-in-out infinite`
            : 'none',
        }} />

        {/* Prose line */}
        <span style={{
          flex: 1,
          fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
          fontSize: 13, lineHeight: 1,
          color: T.inkSoft,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {parts.map((p, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: dimColor }}> · </span>}
              <span style={{ color: p.color }}>{p.text}</span>
            </span>
          ))}
        </span>

        {/* 4 mini bars — width = pct, colour by threshold */}
        <span style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
          {[
            { pct: enquiryPct,   skip: false },
            { pct: profilePct,   skip: false },
            // F-07.15 — the Discover dot retires with its score. A dot is a READOUT, not a
            // control: it rendered a fill proportional to a number that no longer exists,
            // and there is no value to give it that would not be invented. The row is three
            // dots now, disclosed rather than backfilled with a placeholder.
            { pct: hotScore.pct, skip: fetching },
          ].map((b, i) => (
            <span key={i} style={{
              display: 'block', width: 20, height: 3,
              background: trackBg,
              borderRadius: 2, overflow: 'hidden',
            }}>
              <span style={{
                display: 'block',
                width: b.skip ? '0%' : `${b.pct}%`,
                height: '100%',
                background: progressColor(b.pct, T.isLight),
                borderRadius: 2,
                transition: `width 700ms ${EASE}, background 500ms ${EASE}`,
              }} />
            </span>
          ))}
        </span>

        {/* Chevron */}
        <span style={{
          fontSize: 13, color: chevColor, flexShrink: 0, lineHeight: 1,
          transform: open ? 'rotate(-90deg)' : 'rotate(90deg)',
          transition: `transform 300ms ${EASE}`,
          display: 'inline-block',
        }}>›</span>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div style={{
          borderTop: `0.5px solid ${panelSep}`,
          padding: '11px 13px 13px',
          display: 'flex', flexDirection: 'column', gap: 9,
          animation: `cbSlide 220ms ${EASE} both`,
        }}>

          {/* Bar 1 — Enquiry follow-ups */}
          <BarRow
            title="Enquiry Follow-ups"
            aside={enquiryTotal === 0 ? 'all replied' : `${enquiryTotal} awaiting reply`}
            asideAlert={enquiryTotal > 0}
            pct={enquiryPct}
            route="/leads"
            sublabels={newLeads.slice(0, 5).map(l => ({ label: l.name ?? 'Unnamed' }))}
            onTap={() => router.push('/vendor/list/leads')}
          />

          <div style={{ height: '0.5px', background: panelSep }} />

          {/* Bar 2 — Incomplete profiles */}
          <BarRow
            title="Incomplete Profiles"
            aside={incompleteLeads.length === 0 ? 'all complete' : `${incompleteLeads.length} of ${profileTotal} need info`}
            asideAlert={false}
            pct={profilePct}
            route="/leads"
            chips={profileChips}
            onTap={() => router.push('/vendor/list/leads')}
          />

          <div style={{ height: '0.5px', background: panelSep }} />

          {/* Bar 3 — Discover profile */}
          {/* F-07.15 — a LINK, not a second score. `aside` states where the number lives
              rather than inventing one here; `pct={0}` draws no progress fill, which is
              honest: this bar measures nothing. Deleting the bar outright was refused —
              the vendor would lose his route to the Discover Profile, and a control removed
              because its data was wrong is the control-inventory law's exact subject. */}
          <BarRow
            title="Discover Profile"
            aside="open"
            pct={0}
            route="/discover"
            loading={fetching}
            onTap={() => router.push('/vendor/discover')}
          />

          <div style={{ height: '0.5px', background: panelSep }} />

          {/* Bar 4 — Hot dates availability */}
          <BarRow
            title="Hot Dates Locked In"
            aside={
              fetching ? '…' :
              hotScore.total === 0 ? 'no hot dates' :
              hotScore.remaining === 0 ? 'all locked' :
              `${hotScore.remaining} of ${hotScore.total} open`
            }
            asideAlert={!fetching && hotScore.remaining > 0}
            pct={hotScore.pct}
            route="/calendar"
            loading={fetching}
            sublabels={!fetching && hotScore.total > 0 ? [
              {
                label: `${hotScore.confirmed} confirmed`,
                color: T.isLight ? 'rgba(122,56,40,0.5)' : 'rgba(201,168,76,0.45)',
              },
              {
                label: `${hotScore.remaining} unconfirmed`,
                color: hotScore.remaining > 0
                  ? T.isLight ? 'rgba(122,56,40,0.6)' : 'rgba(224,123,92,0.5)'
                  : T.inkDim,
              },
            ] : undefined}
            onTap={() => router.push('/vendor/calendar')}
          />

          <div style={{ height: '0.5px', background: panelSep }} />

          {/* Just Do It — lives inside panel */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 9px',
            border: `0.5px solid ${T.isLight ? 'rgba(26,15,8,0.07)' : 'rgba(240,230,210,0.07)'}`,
            borderRadius: 3,
          }}>
            <div>
              <div style={{
                fontFamily: F.label, fontSize: 8.5, fontWeight: justDoIt ? 400 : 300,
                letterSpacing: '0.26em', textTransform: 'uppercase',
                color: justDoIt ? brassColor : T.inkMute,
                transition: `color 280ms ${EASE}`,
              }}>Just Do It</div>
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontSize: 10.5,
                color: justDoIt ? T.inkSoft : T.inkDim,
                transition: `color 280ms ${EASE}`,
                marginTop: 2,
              }}>{justDoIt ? 'Smart automation on' : 'AI confirms before acting'}</div>
            </div>

            <button
              type="button"
              onClick={() => onJustDoItChange(!justDoIt)}
              style={{
                width: 42, height: 22, borderRadius: 999,
                background: toggleBg,
                border: `0.5px solid ${toggleBorder}`,
                cursor: 'pointer', flexShrink: 0,
                position: 'relative',
                transition: `all 280ms ${EASE}`,
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: justDoIt ? 'calc(100% - 20px)' : 2,
                width: 18, height: 18, borderRadius: '50%',
                background: knobColor,
                transition: `left 240ms ${EASE}, background 240ms ${EASE}`,
                boxShadow: justDoIt ? '0 1px 4px rgba(0,0,0,0.25)' : 'none',
              }} />
            </button>
          </div>

          {/* Collapse chevron — tap to close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Collapse"
            style={{
              width: '100%', padding: '4px 0 2px',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6,
            }}
          >
            <span style={{
              display: 'block', width: 32, height: '0.5px',
              background: T.isLight ? 'rgba(122,56,40,0.15)' : 'rgba(201,168,76,0.15)',
            }} />
            <span style={{
              fontSize: 14,
              color: T.isLight ? 'rgba(122,56,40,0.35)' : 'rgba(201,168,76,0.35)',
              lineHeight: 1,
              transform: 'rotate(-90deg)',
              display: 'inline-block',
            }}>›</span>
            <span style={{
              display: 'block', width: 32, height: '0.5px',
              background: T.isLight ? 'rgba(122,56,40,0.15)' : 'rgba(201,168,76,0.15)',
            }} />
          </button>

        </div>
      )}
    </div>
  );
}
