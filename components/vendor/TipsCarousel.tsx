'use client';
// TipsCarousel — persistent mini manual. Lives in profile dropdown.
// Carousel of tips covering every page and feature.
// Dismissible per session but always accessible via profile.

import { useState } from 'react';
import { useT } from '@/lib/vendor/ThemeContext';

const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
};

// ── Tip cards — every feature, every page ────────────────────────
const WA_PA_LINK = 'https://wa.me/917982159047?text=Hi%2C%20I%20want%20to%20set%20up%20DreamAi%20as%20my%20WhatsApp%20PA.';

interface Tip { section: string; glyph: string; title: string; body: string; waLink?: string; }
const TIPS: Tip[] = [
  // ── Hub / DreamAi ───────────────────────────────────────────────
  {
    section: 'The Hub',
    glyph: '◎',
    title: 'DreamAi works on WhatsApp too.',
    body: 'Tap "DreamAi on WhatsApp" in your profile to set it up. Once connected, message the TDW number and DreamAi manages your business from your chat. No app needed.',
    waLink: 'https://wa.me/917982159047?text=Hi%2C%20I%20want%20to%20set%20up%20DreamAi%20as%20my%20WhatsApp%20PA.',
  },
  {
    section: 'The Hub',
    glyph: '✦',
    title: 'What you can do on WhatsApp.',
    body: '"Any new enquiries?" — "Who hasn\'t paid me?" — "Raise invoice for Priya Rs 80,000" — "Block 15th June" — "Log petrol Rs 600" — "Reply to Manish\'s lead." Same as the app. Just in a message.',
  },
  {
    section: 'The Hub',
    glyph: '✦',
    title: 'DreamAi speaks plain language.',
    body: 'Type the way you talk. "Who hasn\'t paid me?" "Raise an invoice for Priya, Rs 80,000." "Block 14th June." It understands all of it.',
  },
  {
    section: 'The Hub',
    glyph: '✦',
    title: 'Just Do It mode.',
    body: 'Toggle "Just Do It" below the header. When on, DreamAi executes tasks without confirming every step. For power users.',
  },
  {
    section: 'The Hub',
    glyph: '✦',
    title: 'Quick action pills.',
    body: '+ Client, + Invoice, + Expense, + Event — tap any pill to open DreamAi with a prefilled prompt. Faster than typing from scratch.',
  },
  // ── Leads ────────────────────────────────────────────────────────
  {
    section: 'Leads',
    glyph: '◈',
    title: 'Reply, Hold, or Decline.',
    body: 'Every new enquiry has three actions. Reply opens a thread. Hold parks it without declining. Decline removes it cleanly. All tracked.',
  },
  {
    section: 'Leads',
    glyph: '◈',
    title: 'DreamAi drafts the reply.',
    body: 'Tap Reply on any lead and ask DreamAi — "Draft a professional reply for Manish\'s wedding in June." It reads the brief and writes it.',
  },
  {
    section: 'Leads',
    glyph: '◈',
    title: '5 letters await you.',
    body: 'The Hub shows a count of leads awaiting reply. The enquiry card shows the most recent one. Tap Reply → to open the full conversation.',
  },
  // ── Studio — Calendar ────────────────────────────────────────────
  {
    section: 'Calendar',
    glyph: '◇',
    title: 'Hot dates glow red.',
    body: 'Auspicious Hindu Vivah Muhurat dates are marked automatically. Peak season months show a banner. Never miss a booking window.',
  },
  {
    section: 'Calendar',
    glyph: '◇',
    title: 'Block dates in one tap.',
    body: 'Tap any date on the calendar. Choose a reason — Travel, Personal, Blocked. Blocked dates appear dimmed and won\'t show as available.',
  },
  {
    section: 'Calendar',
    glyph: '◇',
    title: 'Today is always highlighted.',
    body: 'The current date has a deep coin marker. Events below the calendar show your next three engagements with shoot type and day count.',
  },
  // ── Studio — Clients ─────────────────────────────────────────────
  {
    section: 'Clients',
    glyph: '◇',
    title: 'Clients hold everything.',
    body: 'Each client has a conversation thread, linked invoices, linked expenses, and event history. All in one place. Tap a client row to open.',
  },
  {
    section: 'Clients',
    glyph: '◇',
    title: 'WhatsApp from the client card.',
    body: 'Every client row with a phone number has a WhatsApp button. Tap it to open a direct chat. No copy-pasting numbers.',
  },
  // ── Studio — Invoices ────────────────────────────────────────────
  {
    section: 'Invoices',
    glyph: '◇',
    title: 'Invoice states are automatic.',
    body: 'Unpaid, Advance Paid, Paid, Cancelled — DreamAi updates these when you tell it. "Priya paid the advance." Done.',
  },
  {
    section: 'Invoices',
    glyph: '◇',
    title: 'Rs 5,30,000 owed — always visible.', // TDW_09 R-U31: the figure joins the register; the sentence is unchanged
    body: 'The Hub ledger shows total outstanding amount across all unpaid invoices. Tap it or ask DreamAi "Who owes me money?" for the full list.',
  },
  // ── Studio — Expenses ────────────────────────────────────────────
  {
    section: 'Expenses',
    glyph: '◇',
    title: 'Log expenses by voice or text.',
    body: 'Tell DreamAi — "Log petrol Rs 800 for the Sharma shoot." It creates the expense, tags the client, and adds it to your records instantly.',
  },
  // ── Studio — Contracts & TDS ─────────────────────────────────────
  {
    section: 'Studio',
    glyph: '◇',
    title: 'Contracts and TDS in Business.',
    body: 'Upload signed contracts per client. Track TDS deductions by financial year. Access everything from the Business tab in Studio.',
  },
  // ── Discover ─────────────────────────────────────────────────────
  {
    section: 'Discover',
    glyph: '◉',
    title: 'Your portfolio is your storefront.',
    body: 'Upload your best work. The first approved image becomes your hero. Brides on The Dream Wedding see it when they discover your profile.',
  },
  {
    section: 'Discover',
    glyph: '◉',
    title: 'Request access to go live.',
    body: 'Tap Request Access on the Discover page. The TDW team reviews and approves your portfolio. Once live, qualified brides can find and enquire.',
  },
  {
    section: 'Discover',
    glyph: '◉',
    title: 'Collab — work with other vendors.',
    body: 'Post a collab opportunity — looking for a florist, venue, or caterer for a shoot. Other vendors on DreamAi can express interest.',
  },
  {
    section: 'Discover',
    glyph: '◉',
    title: 'TDW Leads are bride-sourced.',
    body: 'When a bride saves or enquires via The Dream Wedding, the lead appears in Discover → Leads. These are pre-qualified — they\'ve seen your work.',
  },
  // ── TDW_09 P2 · fork 8.1 (chair relay #3) — THE SWIPE TIP IS RETIRED WITH
  // THE PAGER. The tip taught 'Swipe left or right on any screen to move
  // between Studio, Hub, and Discover' and named the mode pill — both organs
  // dissolved under R-X27 arm (a). A tip teaching a dead gesture is a lie; the
  // copy dies WITH the chrome, no separate veto owed for the deletion. (The
  // peek-nav tip below it predates this sitting and is F-09.90's census, not
  // this deletion's — sighted, not touched.)
  {
    section: 'Navigation',
    glyph: '↔',
    title: 'The peek nav rises from the bottom.',
    body: 'In the Hub, slowly scroll up — a navigation panel rises from the bottom with Studio, Hub, and Discover shortcuts.',
  },
  // ── Theme ────────────────────────────────────────────────────────
  {
    section: 'Atelier',
    glyph: '◑',
    title: 'Two modes. One app.',
    body: 'Tap your initials → Display → toggle between Dark and Light. Dark is the warm espresso Atelier mode. Light is the editorial paper mode. Your choice persists.',
  },
  // ── Settings ─────────────────────────────────────────────────────
  {
    section: 'Settings',
    glyph: '◎',
    title: 'Your enquiry link is unique.',
    body: 'Settings → Your TDW Handle generates a personal WhatsApp link. Share it with couples — when they message, DreamAi routes the enquiry to you automatically.',
  },
  {
    section: 'Settings',
    glyph: '◎',
    title: 'Set your rates.',
    body: 'Settings → Rates lets you set a minimum and maximum package range. This appears on your Discover profile and helps brides self-qualify.',
  },
];

// Group by section for display
const SECTIONS = [...new Set(TIPS.map(t => t.section))];

interface Props {
  onClose: () => void;
}

export function TipsCarousel({ onClose }: Props) {
  const T = useT();
  const [idx, setIdx]           = useState(0);
  const [fading, setFading]     = useState(false);
  const [filterSection, setFilterSection] = useState<string | null>(null);

  const filtered = filterSection
    ? TIPS.filter(t => t.section === filterSection)
    : TIPS;

  // Clamp idx when filter changes
  const safeIdx = Math.min(idx, filtered.length - 1);
  const tip = filtered[safeIdx];

  function go(next: number) {
    setFading(true);
    setTimeout(() => { setIdx(Math.max(0, Math.min(next, filtered.length - 1))); setFading(false); }, 140);
  }

  function changeSection(s: string | null) {
    setFilterSection(s);
    setIdx(0);
  }

  const isLight    = T.isLight;
  const overlayBg  = isLight ? 'rgba(26,15,8,0.55)' : 'rgba(8,6,4,0.62)';
  const cardBg     = isLight ? T.sheetTop : 'rgba(24,19,15,0.98)';
  const cardBorder = isLight ? T.sheetBorder : 'rgba(201,168,76,0.22)';
  const labelColor = isLight ? T.accent : 'var(--role-metal)';
  const headColor  = isLight ? T.ink : 'var(--atelier-ink)';
  const bodyColor  = isLight ? T.inkSoft : 'rgba(240,230,210,0.65)';
  const mutedColor = isLight ? T.inkMute : 'rgba(240,230,210,0.38)';
  const ctaBg      = isLight
    ? 'linear-gradient(180deg, #9B4E38 0%, #7A3828 100%)'
    : 'linear-gradient(180deg, var(--role-metal) 0%, var(--role-metal) 100%)';
  const ctaColor   = isLight ? '#F5F2EE' : '#1A120E';
  const pillActive = isLight
    ? { bg: 'rgba(122,56,40,0.12)', border: 'rgba(122,56,40,0.40)', color: T.accent }
    : { bg: 'rgba(201,168,76,0.14)', border: 'rgba(201,168,76,0.45)', color: 'var(--role-metal)' };
  const pillInactive = isLight
    ? { bg: 'transparent', border: 'rgba(122,56,40,0.18)', color: T.inkMute }
    : { bg: 'transparent', border: 'rgba(201,168,76,0.16)', color: 'rgba(240,230,210,0.38)' };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: overlayBg,
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        padding: '0 16px max(24px, env(safe-area-inset-bottom))',
        animation: 'tipsIn 240ms cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      <style>{`
        @keyframes tipsIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes tipsCardUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Section filter pills */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          overflowX: 'auto', display: 'flex', gap: 6,
          paddingBottom: 12, scrollbarWidth: 'none' as const,
          animation: 'tipsCardUp 280ms cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {/* All pill */}
        {[null, ...SECTIONS].map((s, i) => {
          const active = filterSection === s;
          const p = active ? pillActive : pillInactive;
          return (
            <button key={i} type="button" onClick={() => changeSection(s)}
              style={{
                flexShrink: 0, height: 28, paddingInline: 12,
                background: p.bg, border: `0.5px solid ${p.border}`,
                borderRadius: 999, cursor: 'pointer',
                fontFamily: F.label, fontWeight: active ? 400 : 300, fontSize: 8,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: p.color, transition: 'all 180ms',
              }}>{s ?? 'All'}</button>
          );
        })}
      </div>

      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          background: cardBg,
          border: `0.5px solid ${cardBorder}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: isLight
            ? '0 -8px 40px rgba(26,15,8,0.20), inset 0 1px 0 rgba(255,255,255,0.7)'
            : '0 -8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,235,212,0.05)',
          animation: 'tipsCardUp 320ms cubic-bezier(0.22,1,0.36,1) both',
          opacity: fading ? 0 : 1,
          transition: 'opacity 140ms',
        }}
      >
        {/* Top accent */}
        <div style={{
          height: 1,
          background: isLight
            ? `linear-gradient(90deg, transparent, ${T.accent}55, transparent)`
            : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)',
        }} />

        <div style={{ padding: '20px 22px 24px' }}>

          {/* Section label + counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: F.label, fontSize: 16, color: labelColor, lineHeight: 1,
              }}>{tip.glyph}</span>
              <span style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.35em', textTransform: 'uppercase' as const,
                color: labelColor,
              }}>{tip.section}</span>
            </div>
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
              letterSpacing: '0.08em', color: mutedColor,
            }}>{safeIdx + 1} / {filtered.length}</span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: F.display, fontStyle: 'italic', fontWeight: 300,
            fontSize: 25, lineHeight: 1.22, color: headColor,
            marginBottom: 10,
          }}>{tip.title}</h3>

          {/* Body */}
          <p style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 16,
            lineHeight: 1.65, color: bodyColor,
            marginBottom: tip.waLink ? 14 : 22,
          }}>{tip.body}</p>

          {/* WhatsApp CTA for WA tips */}
          {tip.waLink && (
            <button type="button"
              onClick={() => window.open(tip.waLink, '_blank')}
              style={{
                width: '100%', height: 44, marginBottom: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(37,211,102,0.10)',
                border: '0.5px solid rgba(37,211,102,0.40)',
                borderRadius: 999, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 9,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: '#25D366',
              }}>
              <span style={{ fontSize: 16, lineHeight: 1.5 }}>◎</span>
              Set up on WhatsApp →
            </button>
          )}

          {/* Progress bar */}
          <div style={{
            height: 2, background: isLight ? 'rgba(122,56,40,0.10)' : 'rgba(201,168,76,0.10)',
            borderRadius: 999, marginBottom: 20, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${((safeIdx + 1) / filtered.length) * 100}%`,
              background: isLight
                ? 'linear-gradient(90deg, #9B4E38, #7A3828)'
                : 'linear-gradient(90deg, var(--role-metal), var(--role-metal))',
              borderRadius: 999,
              transition: 'width 300ms cubic-bezier(0.22,1,0.36,1)',
            }} />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, height: 44,
              background: 'transparent',
              border: `0.5px solid ${isLight ? 'rgba(122,56,40,0.18)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 999, cursor: 'pointer',
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: mutedColor,
            }}>Close</button>

            {safeIdx < filtered.length - 1 ? (
              <button type="button" onClick={() => go(safeIdx + 1)} style={{
                flex: 2, height: 44,
                background: ctaBg,
                border: 'none', borderRadius: 999, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 500, fontSize: 10,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: ctaColor,
                boxShadow: isLight
                  ? '0 4px 16px rgba(122,56,40,0.30)'
                  : '0 4px 16px rgba(201,168,76,0.25)',
              }}>Next →</button>
            ) : (
              <button type="button" onClick={onClose} style={{
                flex: 2, height: 44,
                background: ctaBg,
                border: 'none', borderRadius: 999, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 500, fontSize: 10,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: ctaColor,
                boxShadow: isLight
                  ? '0 4px 16px rgba(122,56,40,0.30)'
                  : '0 4px 16px rgba(201,168,76,0.25)',
              }}>Done ✓</button>
            )}
          </div>

          {/* Prev navigation */}
          {safeIdx > 0 && (
            <button type="button" onClick={() => go(safeIdx - 1)} style={{
              display: 'block', margin: '12px auto 0',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: F.label, fontWeight: 300, fontSize: 8,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: mutedColor,
            }}>← Previous</button>
          )}

        </div>
      </div>
    </div>
  );
}
