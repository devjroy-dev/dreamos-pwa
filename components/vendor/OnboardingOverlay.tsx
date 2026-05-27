'use client';
// OnboardingOverlay — Atelier spotlight tour with SVG cutout mask.
// SVG <mask> punches a real hole in the overlay — no box-shadow hack.
// Works on all mobile browsers. Positions tooltip intelligently.
// Storage: 'dreamai_tour_v2'

import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/vendor/ThemeContext';

const STORAGE_KEY = 'dreamai_tour_v2';

const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
};

// ── Steps ────────────────────────────────────────────────────────
// selector: CSS selector to spotlight. null = full-centre card, no spotlight.
// tooltip:  'above' | 'below' | 'center'
const STEPS = [
  {
    id: 'welcome',
    selector: null,
    tooltip: 'center' as const,
    label: 'Welcome',
    headline: 'Not just a CRM.\nA conversation.',
    body: 'DreamAi runs your wedding business — leads, invoices, calendar, clients — in plain language. No forms. No menus. Just ask.',
    cta: 'Begin →',
  },
  {
    id: 'hub',
    selector: '[data-tour="hub-greeting"]',
    tooltip: 'below' as const,
    label: 'The Hub',
    headline: 'This is where\nbusiness happens.',
    body: 'The AI Hub is your command centre. Ask anything — it knows your leads, your calendar, your money. Available 24 hours.',
    cta: 'Next →',
  },
  {
    id: 'enquiry',
    selector: '[data-tour="enquiry-card"]',
    tooltip: 'below' as const,
    label: 'Your Leads',
    headline: 'Every enquiry\narrives as a letter.',
    body: 'Reply, hold, or decline in one tap. DreamAi reads the brief and drafts your reply. You just approve.',
    cta: 'Next →',
  },
  {
    id: 'mode-pill',
    selector: '[data-tour="mode-pill"]',
    tooltip: 'below' as const,
    label: 'Three Rooms',
    headline: 'Studio. Hub. Discover.\nSwipe to move.',
    body: 'Studio is your business. Hub is your AI. Discover is how brides find you. Swipe left or right anywhere to switch rooms.',
    cta: 'Next →',
  },
  {
    id: 'studio',
    selector: '[data-tour="bottom-nav"]',
    tooltip: 'above' as const,
    label: 'Studio',
    headline: 'Your calendar,\nclients, and money.',
    body: 'Calendar shows every engagement and blocked date. Business holds your clients, invoices, and expenses.',
    cta: 'Next →',
  },
  {
    id: 'discover',
    selector: '[data-tour="mode-pill"]',
    tooltip: 'below' as const,
    label: 'Discover',
    headline: 'A curated stage.\nNot a marketplace.',
    body: 'Upload your portfolio. Qualified brides on The Dream Wedding discover and enquire directly.',
    cta: 'Next →',
  },
  {
    id: 'theme',
    selector: '[data-tour="profile-coin"]',
    tooltip: 'below' as const,
    label: 'Your Atelier',
    headline: 'Made to be\nlooked at.',
    body: 'Tap your initials → Display → toggle between dark espresso and editorial paper mode. Your choice persists.',
    cta: 'Next →',
  },
  {
    id: 'prompts',
    selector: null,
    tooltip: 'center' as const,
    label: 'Start Here',
    headline: 'Ask DreamAi\nanything.',
    body: 'Tap a prompt to start. The first one sets up DreamAi on WhatsApp — so you can manage your business from any chat.',
    cta: null,
  },
];

const WA_PA_LINK = 'https://wa.me/917982159047?text=Hi%2C%20I%20want%20DreamAi%20to%20act%20as%20my%20personal%20assistant%20%E2%80%94%20take%20messages%20and%20reply%20to%20leads%20on%20my%20behalf.';

const AI_PROMPTS: { text: string; primer?: string; waLink?: string; badge?: string }[] = [
  { text: 'DreamAi on WhatsApp — your PA',  waLink: WA_PA_LINK, badge: 'On WhatsApp too' },
  { text: 'Who owes me money?',             primer: 'Who owes me money?' },
  { text: 'Any new enquiries?',             primer: 'Any new enquiries today?' },
  { text: 'What\'s on my calendar?',        primer: 'What\'s on my calendar this week?' },
  { text: 'Raise an invoice',               primer: 'Help me raise an invoice for my last shoot' },
  { text: 'Log an expense',                 primer: 'Log a travel expense for me' },
  { text: 'Reply to my latest lead',        primer: 'Draft a reply to my latest lead' },
];

const PAD = 10; // spotlight padding px
const R   = 14; // spotlight corner radius px

interface Rect { x: number; y: number; w: number; h: number; }

interface Props { onSend: (text: string) => void; }

export function OnboardingOverlay({ onSend }: Props) {
  const T = useT();
  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState(0);
  const [rect, setRect]         = useState<Rect | null>(null);
  const [fading, setFading]     = useState(false);
  const [vw, setVw]             = useState(0);
  const [vh, setVh]             = useState(0);
  const rafRef                  = useRef<number>(0);

  // ── Measure spotlight element ──────────────────────────────────
  const measureElement = useCallback((selector: string | null) => {
    if (!selector) { setRect(null); return; }
    const el = document.querySelector(selector);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({
      x: r.left - PAD,
      y: r.top  - PAD,
      w: r.width  + PAD * 2,
      h: r.height + PAD * 2,
    });
  }, []);

  // ── Window size ────────────────────────────────────────────────
  useEffect(() => {
    function update() {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Measure on step change ─────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const sel = STEPS[step].selector;
    // rAF to wait for DOM paint
    rafRef.current = requestAnimationFrame(() => {
      measureElement(sel);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [step, visible, measureElement]);

  // ── Show on first visit ────────────────────────────────────────
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  function advance() {
    if (step >= STEPS.length - 1) { finish(); return; }
    setFading(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setFading(false);
    }, 180);
  }

  function finish() {
    try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  }

  function handlePrompt(primer: string) {
    finish();
    setTimeout(() => onSend(primer), 120);
  }

  if (!visible || vw === 0) return null;

  const current   = STEPS[step];
  const isLight   = T.isLight;
  const hasSpot   = rect !== null;
  const tooltipPos = current.tooltip;

  // ── Colours ────────────────────────────────────────────────────
  const overlayFill   = isLight ? 'rgba(26,15,8,0.60)'  : 'rgba(10,8,6,0.72)';
  const cardBg        = isLight ? T.sheetTop             : 'rgba(24,19,15,0.98)';
  const cardBorder    = isLight ? T.sheetBorder          : 'rgba(201,168,76,0.25)';
  const labelColor    = isLight ? T.accent               : '#C9A84C';
  const headColor     = isLight ? T.ink                  : '#F0E6D2';
  const bodyColor     = isLight ? T.inkSoft              : 'rgba(240,230,210,0.65)';
  const mutedColor    = isLight ? T.inkMute              : 'rgba(240,230,210,0.38)';
  const ringColor     = isLight ? T.accent               : '#C9A84C';
  const ctaBg         = isLight
    ? 'linear-gradient(180deg, #9B4E38 0%, #7A3828 100%)'
    : 'linear-gradient(180deg, #D4B86A 0%, #B59548 100%)';
  const ctaColor      = isLight ? '#F5F2EE' : '#1A120E';
  const topAccent     = isLight
    ? `linear-gradient(90deg, transparent, ${T.accent}55, transparent)`
    : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)';
  const dotActive     = isLight ? T.accent : '#C9A84C';
  const dotInactive   = isLight ? 'rgba(26,15,8,0.16)' : 'rgba(201,168,76,0.18)';

  // ── SVG mask path ──────────────────────────────────────────────
  // Full screen rect with rounded-rect hole punched out
  function maskPath(): string {
    if (!rect) return '';
    const { x, y, w, h } = rect;
    // Outer rect (full screen) + inner rounded rect (hole) using SVG even-odd fill
    return `M0,0 H${vw} V${vh} H0 Z ` +
      `M${x + R},${y} H${x + w - R} ` +
      `Q${x + w},${y} ${x + w},${y + R} ` +
      `V${y + h - R} ` +
      `Q${x + w},${y + h} ${x + w - R},${y + h} ` +
      `H${x + R} ` +
      `Q${x},${y + h} ${x},${y + h - R} ` +
      `V${y + R} ` +
      `Q${x},${y} ${x + R},${y} Z`;
  }

  // ── Tooltip vertical position ──────────────────────────────────
  const CARD_H_ESTIMATE = 280;
  const MARGIN = 16;
  const CARD_W = Math.min(vw - 32, 420);

  let cardTop: number | undefined;
  let cardBottom: number | undefined;

  if (tooltipPos === 'center' || !hasSpot) {
    cardTop = Math.max(MARGIN, (vh - CARD_H_ESTIMATE) / 2);
  } else if (tooltipPos === 'below') {
    const spaceBelow = vh - (rect!.y + rect!.h);
    const spaceAbove = rect!.y;
    if (spaceBelow >= CARD_H_ESTIMATE + MARGIN) {
      cardTop = rect!.y + rect!.h + MARGIN;
    } else if (spaceAbove >= CARD_H_ESTIMATE + MARGIN) {
      cardBottom = vh - rect!.y + MARGIN;
    } else {
      // Not enough space either side — put it at bottom
      cardBottom = MARGIN;
    }
  } else { // above
    const spaceAbove = rect!.y;
    if (spaceAbove >= CARD_H_ESTIMATE + MARGIN) {
      cardBottom = vh - rect!.y + MARGIN;
    } else {
      cardTop = rect!.y + rect!.h + MARGIN;
    }
  }

  return (
    <div
      onClick={advance}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        pointerEvents: 'all',
      }}
    >
      <style>{`
        @keyframes spotIn   { from{opacity:0} to{opacity:1} }
        @keyframes cardUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ringPulse {
          0%,100% { opacity: 0.9 }
          50%     { opacity: 0.4 }
        }
      `}</style>

      {/* ── SVG overlay with cutout ────────────────────────────── */}
      <svg
        width={vw} height={vh}
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          animation: 'spotIn 300ms ease both',
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dim overlay with hole */}
        {hasSpot ? (
          <path
            d={maskPath()}
            fill={overlayFill}
            fillRule="evenodd"
            style={{ backdropFilter: 'blur(2px)' }}
          />
        ) : (
          <rect width={vw} height={vh} fill={overlayFill} />
        )}

        {/* Spotlight ring — pulsing brass/oxblood border */}
        {hasSpot && rect && (
          <rect
            x={rect.x} y={rect.y}
            width={rect.w} height={rect.h}
            rx={R} ry={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="1.5"
            style={{ animation: 'ringPulse 2s ease-in-out infinite' }}
          />
        )}

        {/* Outer glow ring */}
        {hasSpot && rect && (
          <rect
            x={rect.x - 3} y={rect.y - 3}
            width={rect.w + 6} height={rect.h + 6}
            rx={R + 3} ry={R + 3}
            fill="none"
            stroke={ringColor}
            strokeWidth="0.5"
            opacity="0.3"
          />
        )}
      </svg>

      {/* ── Tooltip card ──────────────────────────────────────── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: Math.max(MARGIN, (vw - CARD_W) / 2),
          width: CARD_W,
          ...(cardTop    !== undefined ? { top:    cardTop    } : {}),
          ...(cardBottom !== undefined ? { bottom: cardBottom } : {}),
          background: cardBg,
          border: `0.5px solid ${cardBorder}`,
          borderRadius: 12,
          overflow: 'hidden',
          zIndex: 1,
          boxShadow: isLight
            ? '0 8px 40px rgba(26,15,8,0.20), inset 0 1px 0 rgba(255,255,255,0.7)'
            : '0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,235,212,0.05)',
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 180ms, transform 180ms',
          animation: !fading ? 'cardUp 320ms cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}
      >
        {/* Accent line */}
        <div style={{ height: 1, background: topAccent }} />

        <div style={{ padding: '20px 22px 24px' }}>

          {/* Label + counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 8,
              letterSpacing: '0.38em', textTransform: 'uppercase' as const,
              color: labelColor,
            }}>{current.label}</span>
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 8,
              letterSpacing: '0.08em', color: mutedColor,
            }}>{step + 1} / {STEPS.length}</span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: F.display, fontStyle: 'italic', fontWeight: 300,
            fontSize: 30, lineHeight: 1.18, color: headColor,
            marginBottom: 10, whiteSpace: 'pre-line' as const,
          }}>{current.headline}</h2>

          {/* Body */}
          <p style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 13,
            lineHeight: 1.65, color: bodyColor,
            marginBottom: current.id === 'prompts' ? 16 : 20,
          }}>{current.body}</p>

          {/* Prompts */}
          {current.id === 'prompts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              {AI_PROMPTS.map((p, i) => (
                <button key={i} type="button" onClick={() => p.waLink ? window.open(p.waLink, '_blank') : handlePrompt(p.primer!)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: p.waLink ? '12px 14px' : '10px 14px',
                    background: p.waLink
                      ? 'rgba(37,211,102,0.08)'
                      : isLight ? 'rgba(122,56,40,0.06)' : 'rgba(201,168,76,0.07)',
                    border: `0.5px solid ${p.waLink ? 'rgba(37,211,102,0.35)' : isLight ? 'rgba(122,56,40,0.20)' : 'rgba(201,168,76,0.18)'}`,
                    borderRadius: 6, cursor: 'pointer', textAlign: 'left' as const,
                  }}>
                  <span style={{ fontSize: 8, color: p.waLink ? '#25D366' : labelColor, flexShrink: 0 }}>
                    {p.waLink ? '◎' : '✦'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: F.display, fontStyle: 'italic', fontSize: 15,
                      color: headColor, lineHeight: 1.3,
                    }}>{p.text}</div>
                    {p.badge && (
                      <div style={{
                        fontFamily: F.label, fontWeight: 300, fontSize: 8,
                        letterSpacing: '0.18em', textTransform: 'uppercase' as const,
                        color: '#25D366', marginTop: 3,
                      }}>{p.badge}</div>
                    )}
                  </div>
                  <span style={{ color: p.waLink ? '#25D366' : labelColor, fontSize: 11, flexShrink: 0 }}>↗</span>
                </button>
              ))}
            </div>
          )}

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 5, width: i === step ? 20 : 5,
                borderRadius: 999,
                background: i === step ? dotActive : dotInactive,
                transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>

          {/* Buttons */}
          {current.cta ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={finish} style={{
                flex: 1, height: 44,
                background: 'transparent',
                border: `0.5px solid ${isLight ? 'rgba(122,56,40,0.18)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 999, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: mutedColor,
              }}>Skip</button>
              <button type="button" onClick={advance} style={{
                flex: 2, height: 44,
                background: ctaBg, border: 'none',
                borderRadius: 999, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 500, fontSize: 10,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: ctaColor,
                boxShadow: isLight
                  ? '0 4px 16px rgba(122,56,40,0.35)'
                  : '0 4px 16px rgba(201,168,76,0.30)',
              }}>{current.cta}</button>
            </div>
          ) : (
            <button type="button" onClick={finish} style={{
              width: '100%', height: 44,
              background: ctaBg, border: 'none',
              borderRadius: 999, cursor: 'pointer',
              fontFamily: F.label, fontWeight: 500, fontSize: 10,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: ctaColor,
              boxShadow: isLight
                ? '0 4px 16px rgba(122,56,40,0.35)'
                : '0 4px 16px rgba(201,168,76,0.30)',
            }}>I'm ready →</button>
          )}

        </div>
      </div>
    </div>
  );
}
