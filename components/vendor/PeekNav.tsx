'use client';
// PeekNav — brass thread above InputBar.
// Scroll up in chat → brass thread appears → tap → panel slides up.
// Contents: 5 create shortcuts + 4 AI cue cards.
// No nav buttons — app is one swipe away from any destination.

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useT } from '@/lib/vendor/ThemeContext';
import type { VendorContextResponse } from '@/lib/vendor/types/vendor';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

const F = {
  label:  'var(--font-jost), system-ui, sans-serif',
  script: 'var(--font-cormorant), Georgia, serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const ANALYTICS_REPLY = "We're collecting your data and usage patterns right now. Analytics will be available after your first month — this ensures the insights are accurate and give you a better picture of your business. Stay tuned.";

// TDW_09 R-U27/R-U28: this broke the law in BOTH directions at once — Cr/L/K
// shorthand with NO currency prefix above a thousand, and the bare glyph below it,
// so the same strip could read "1.2L" and a glyph-prefixed figure one refresh apart.
// One home, one register. A strip row reflows; it does not shrink.
function fmtRs(n: number): string {
  return formatRs(n);
}

const CREATES = [
  { icon: '＋', label: 'Client',  primer: "What are the details of the new client? Give me their name and phone number to start." },
  // TDW_09 R-U32: was the rupee glyph used as an icon. It goes for two reasons —
  // consistency, and the sharper one: R-U29's property cell asserts NO rendered
  // glyph byte anywhere, so a glyph-as-icon either fails the invariant or forces
  // an exemption, and an exemption is the hole a stray formatter hides in later.
  // The mark is DERIVED, not invented: slices/SliceRow.tsx's GLYPHS map is the
  // estate's standing iconography and its invoices mark is 'I' — so the peek row
  // and the Business list now show the same mark for the same object.
  { icon: 'I',  label: 'Invoice', primer: "Give me the details for the invoice — client name, total amount, and any advance?" },
  { icon: '↙',  label: 'Expense', primer: "What did you spend on? Give me the amount and what it was for." },
  { icon: '◇',  label: 'Event',   primer: "What's the event? Give me a title, date, and time if you have it." },
  { icon: '✉',  label: 'Lead',    primer: "Tell me about the new enquiry — paste it or describe it and I'll log it." },
] as const;

interface PeekNavProps {
  scrollRef?: RefObject<HTMLElement | null>;
  context?: VendorContextResponse | null;
  onSend: (text: string) => void;
}

export function PeekNav({ scrollRef, context, onSend }: PeekNavProps) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const lastScrollTop    = useRef(0);
  const summonedByScroll = useRef(false);
  const timer            = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    function onScroll() {
      const cur   = el!.scrollTop;
      const delta = cur - lastScrollTop.current;
      lastScrollTop.current = cur;
      if (delta < -60 && !open && cur > 80) {
        summonedByScroll.current = true;
        setOpen(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          if (summonedByScroll.current) { summonedByScroll.current = false; setOpen(false); }
        }, 3000);
      }
      if (delta > 16 && open && summonedByScroll.current) {
        summonedByScroll.current = false; setOpen(false);
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, open]);

  function fire(primer: string) {
    onSend(primer);
    setOpen(false);
    summonedByScroll.current = false;
  }

  // ── Live context for cue subtitles ───────────────────────────────
  const leadsCount   = context?.new_leads?.length ?? 0;
  const invoiceOwed  = (context?.pending_invoices ?? []).reduce((s, i) => s + i.amount_owed, 0);
  const overdueCount = (context?.pending_invoices ?? []).filter(i => i.overdue).length;
  const nextEvent    = context?.upcoming_events?.[0] ?? null;

  // ── Theme ────────────────────────────────────────────────────────
  const cornerC    = T.isLight ? T.accentLine              : 'rgba(201,168,76,0.5)';
  const sepColor   = T.isLight ? 'rgba(122,56,40,0.08)'   : 'rgba(201,168,76,0.08)';
  const sectionLbl = T.isLight ? T.inkDim                  : 'rgba(201,168,76,0.4)';
  const createBg   = T.isLight ? 'rgba(26,15,8,0.04)'     : 'rgba(201,168,76,0.04)';
  const createBdr  = T.isLight ? 'rgba(122,56,40,0.18)'   : 'rgba(201,168,76,0.18)';
  const createIcon = T.isLight ? T.inkMute                 : 'rgba(201,168,76,0.58)';
  const createLbl  = T.isLight ? 'rgba(26,15,8,0.35)'     : 'rgba(240,230,210,0.3)';
  const cueBdr     = T.isLight ? 'rgba(26,15,8,0.08)'     : 'rgba(240,230,210,0.08)';
  const cueBg      = T.isLight ? 'rgba(26,15,8,0.02)'     : 'rgba(240,230,210,0.02)';
  const cueTopLine = T.isLight
    ? 'linear-gradient(90deg, transparent, rgba(122,56,40,0.12), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)';
  const brassC     = T.isLight ? T.accent                  : '#C9A84C';
  const redC       = T.isLight ? '#7A3828'                 : '#E07B5C';
  const dimC       = T.isLight ? 'rgba(26,15,8,0.22)'     : 'rgba(240,230,210,0.2)';

  const CUES = [
    {
      q: 'Any new enquiries?',
      sub: leadsCount > 0 ? `${leadsCount} unread` : 'all clear',
      badge: leadsCount > 0 ? brassC : null,
      primer: leadsCount > 0 ? `Any new enquiries? (${leadsCount} new)` : 'Any new enquiries?',
      locked: false,
    },
    {
      q: 'Who owes me money?',
      sub: invoiceOwed > 0
        ? overdueCount > 0 ? `${fmtRs(invoiceOwed)} · ${overdueCount} overdue` : fmtRs(invoiceOwed)
        : 'all clear',
      badge: overdueCount > 0 ? redC : null,
      primer: overdueCount > 0 ? `Who owes me money? (${overdueCount} overdue)` : 'Who owes me money?',
      locked: false,
    },
    {
      q: "What's coming up?",
      sub: nextEvent
        ? `Next: ${new Date(nextEvent.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
        : 'no events',
      badge: null,
      primer: "What's on my calendar?",
      locked: false,
    },
    {
      q: 'Analytics',
      sub: 'Learning your patterns…',
      badge: null,
      primer: ANALYTICS_REPLY,
      locked: true,
    },
  ];

  return (
    <>
      {/* Brass thread — sits above InputBar, visible on scroll-up */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Quick actions"
        style={{
          position: 'fixed',
          bottom: 'calc(72px + env(safe-area-inset-bottom))',
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 11, width: 44, height: 14, padding: 0,
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: open ? 0 : 1,
          transition: `opacity 200ms ${EASE}`,
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <span style={{
          display: 'block', width: 54, height: 2, borderRadius: 2,
          background: T.isLight
            ? 'linear-gradient(90deg, transparent, rgba(122,56,40,0.5) 25%, rgba(122,56,40,0.8) 50%, rgba(122,56,40,0.5) 75%, transparent)'
            : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7) 25%, rgba(224,188,110,0.9) 50%, rgba(201,168,76,0.7) 75%, transparent)',
          boxShadow: T.isLight
            ? '0 0 8px rgba(122,56,40,0.30)'
            : '0 0 10px rgba(201,168,76,0.45)',
        }} />
      </button>

      {/* Scrim */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 10 }}
        />
      )}

      {/* Panel */}
      <nav
        aria-label="Quick actions"
        aria-hidden={!open}
        style={{
          position: 'fixed', left: 0, right: 0,
          bottom: 'calc(64px + env(safe-area-inset-bottom))',
          zIndex: 12,
          transform: open ? 'translateY(0)' : 'translateY(calc(100% + 24px))',
          opacity: open ? 1 : 0,
          transition: `transform 280ms ${EASE}, opacity 220ms ${EASE}`,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div style={{
          margin: '0 14px',
          background: T.sheetTop,
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          border: `0.5px solid ${T.sheetBorder}`,
          borderRadius: 3,
          padding: '12px 14px 14px',
          boxShadow: T.isLight
            ? '0 8px 24px -4px rgba(26,15,8,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
            : '0 12px 36px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,235,212,0.05)',
          position: 'relative',
        }}>
          {/* Corner ornaments */}
          <span aria-hidden style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `0.5px solid ${cornerC}`, borderLeft: `0.5px solid ${cornerC}` }} />
          <span aria-hidden style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `0.5px solid ${cornerC}`, borderRight: `0.5px solid ${cornerC}` }} />

          {/* ── Create shortcuts ── */}
          <div style={{
            fontFamily: F.label, fontSize: 7, fontWeight: 300,
            letterSpacing: '0.44em', textTransform: 'uppercase',
            color: sectionLbl, marginBottom: 8,
          }}>Create</div>

          <div style={{ display: 'flex', gap: 5, marginBottom: 11 }}>
            {CREATES.map(c => (
              <button
                key={c.label}
                type="button"
                onClick={() => fire(c.primer)}
                style={{
                  flex: 1, padding: '7px 3px',
                  border: `0.5px solid ${createBdr}`,
                  borderRadius: 3,
                  background: createBg,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4, cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 13, color: createIcon }}>{c.icon}</span>
                <span style={{
                  fontFamily: F.label, fontSize: 6.5, fontWeight: 300,
                  letterSpacing: '0.18em', textTransform: 'uppercase' as const,
                  color: createLbl,
                }}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Separator */}
          <div style={{ height: '0.5px', background: sepColor, margin: '0 0 10px' }} />

          {/* ── Ask cue cards ── */}
          <div style={{
            fontFamily: F.label, fontSize: 7, fontWeight: 300,
            letterSpacing: '0.44em', textTransform: 'uppercase',
            color: T.isLight ? 'rgba(26,15,8,0.22)' : 'rgba(240,230,210,0.2)',
            marginBottom: 7,
          }}>Ask</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {CUES.map(cue => (
              <button
                key={cue.q}
                type="button"
                onClick={() => fire(cue.locked ? ANALYTICS_REPLY : cue.primer)}
                style={{
                  padding: '9px 10px 8px',
                  border: `0.5px solid ${cueBdr}`,
                  borderRadius: 3,
                  background: cueBg,
                  cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  textAlign: 'left' as const,
                  opacity: cue.locked ? 0.6 : 1,
                }}
              >
                {/* Top edge shimmer */}
                <span aria-hidden style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: cueTopLine,
                }} />

                {/* Badge or lock */}
                {cue.locked ? (
                  <span style={{ position: 'absolute', top: 7, right: 8, fontSize: 9, opacity: 0.4 }}>🔒</span>
                ) : cue.badge && (
                  <span style={{
                    position: 'absolute', top: 7, right: 8,
                    width: 5, height: 5, borderRadius: '50%',
                    background: cue.badge,
                    boxShadow: `0 0 5px ${cue.badge}99`,
                  }} />
                )}

                <div style={{
                  fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 12.5,
                  color: cue.locked ? T.inkDim : T.isLight ? T.inkSoft : 'rgba(240,230,210,0.68)',
                  lineHeight: 1.3, marginBottom: 3, paddingRight: 14,
                }}>{cue.q}</div>

                <div style={{
                  fontFamily: F.label, fontSize: 6.5, fontWeight: 300,
                  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  color: dimC,
                }}>{cue.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
