'use client';

export const dynamic = 'force-dynamic';

// app/(frost)/frost/canvas/discover/page.tsx
// Discover v3 — Frost remodel.
//
// Changes from original:
//   1. No DiscoverLanding — swipe feed is default, frost/page.tsx redirects here
//   2. Top chrome: ✦ Sanctuary pill (left) · Blind toggle (right of Sanctuary) · Filter icon (far right)
//      Blind sits beside Sanctuary so it doesn't cover image dots
//   3. GlassOverlay — true frosted glass: rgba(12,10,9,0.45) + blur(28px), photo visible through it
//   4. FilterSheet — same true glass language, dark scrim behind
//      Sections: Mode · City · Vibe · Budget — all collapsed by default, expand on tap
//      Mode options: Couture · Spotlight · Featured · Look Book
//   5. All pills use same frosted glass system as top chrome

import React, {
  useEffect, useState, useCallback, useRef, Suspense,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import { MessageCircle, Lock, Users, SlidersHorizontal, X } from 'lucide-react';
import { fetchDiscoverFeed, makeEnquireLink } from '../../../../../lib/frost-api/discover';

// Demo discover — fetches active demo vendors when in bride demo mode
const BACKEND = 'https://dream-os-production.up.railway.app';
async function fetchDemoDiscoverFeed(): Promise<{ ok: true; vendors: import('../../../../../lib/types/discover').DiscoverVendor[]; page: number; has_more: boolean; total: number }> {
  const res  = await fetch(`${BACKEND}/api/v2/demo/discover`);
  const data = await res.json();
  if (!data.ok) return { ok: true, vendors: [], page: 0, has_more: false, total: 0 };
  return data;
}
function isBrideDemoDiscover(): boolean {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem('tdw_demo_discover') === 'true'; } catch { return false; }
}
import { saveVendorToMuse } from '../../../../../lib/frost-api/muse';
import type { DiscoverVendor } from '../../../../../lib/types/discover';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Venues','Photographers','Makeup Artists','Designers','Jewellery',
  'Choreographers','Content Creators','DJ & Music','Event Managers','Bridal Wellness',
];
const CITIES       = ['Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata','Jaipur','Pune','Udaipur','Goa'];
const VIBE_OPTIONS = ['Candid','Traditional','Luxury','Cinematic','Boho','Festive','Minimalist','Royal','Destination','Contemporary'];
const BUDGET_OPTIONS = [
  { label: 'Under Rs 1L',  value: '100000'  },
  { label: 'Rs 1L – 3L',  value: '300000'  },
  { label: 'Rs 3L – 5L',  value: '500000'  },
  { label: 'Rs 5L – 10L', value: '1000000' },
  { label: 'Rs 10L+',     value: ''        },
];
const MODE_OPTIONS = ['Couture','Spotlight','Featured','Look Book'];

type CategoryId = 'venues'|'photographers'|'mua'|'designers'|'jewellery'|'choreographers'|'content-creators'|'dj'|'event-managers'|'bridal-wellness';

// ── Swipe constants ───────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 45;
const SWIPE_VELOCITY  = 0.3;
const TAP_MAX_MOVE    = 10;
const TAP_MAX_TIME    = 250;
const DOUBLE_TAP_MS   = 280;
const OVERLAY_DISMISS = 80;

const haptic = (ms: number) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch {}
  }
};

// ── Shared glass token — one source of truth ──────────────────────────────────
// Used by every overlay, pill, and sheet.
// The key property: background is ~45% opacity so the photo always shows through.

const GLASS = {
  // Overlays — bottom sheets
  sheet: {
    background:           'rgba(12,10,9,0.55)',
    backdropFilter:       'blur(28px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
    borderTop:            '0.5px solid rgba(255,255,255,0.12)',
  },
  // Scrim behind sheets — very light, preserves photo
  scrim: {
    background: 'rgba(0,0,0,0.25)',
  },
  // Top chrome pills
  pill: {
    background:           'rgba(12,10,9,0.32)',
    backdropFilter:       'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    border:               '0.5px solid rgba(201,168,76,0.22)',
  },
  pillActive: {
    background:           'rgba(201,168,76,0.18)',
    backdropFilter:       'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    border:               '0.5px solid rgba(201,168,76,0.55)',
  },
} as const;

// ── Filter state ──────────────────────────────────────────────────────────────

interface FilterState {
  category: string | null;
  city:     string | null;
  vibes:    string[];
  budget:   string | null;
  mode:     string | null;
}

// ── Collapsible filter section ────────────────────────────────────────────────

function AccordionSection({ label, hasValue, children }: {
  label: string; hasValue: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid rgba(239,233,221,0.10)` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px', background: 'none', border: 'none',
          cursor: 'pointer', touchAction: 'manipulation',
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 9, fontWeight: 300,
          letterSpacing: '0.32em', textTransform: 'uppercase' as const,
          color: hasValue ? '#D89854' : 'rgba(239,233,221,0.45)',
        }}>
          {label}
          {hasValue && <span style={{ color: '#D89854', marginLeft: 6 }}>·</span>}
        </span>
        <span style={{
          color: open ? '#D89854' : 'rgba(239,233,221,0.32)',
          fontSize: 12,
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease, color 200ms ease',
          display: 'inline-block',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 24px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Filter sheet ──────────────────────────────────────────────────────────────

function FilterSheet({ visible, onClose, filters, onApply, isBlind }: {
  visible: boolean; onClose: () => void;
  filters: FilterState; onApply: (f: FilterState) => void;
  isBlind: boolean;
}) {
  const [local, setLocal] = useState<FilterState>(filters);
  useEffect(() => { if (visible) setLocal(filters); }, [visible, filters]);
  if (!visible) return null;

  // Aubade pill — square corners, saffron active state
  const pill = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 2,
    border: active
      ? '1px solid rgba(216,152,84,0.75)'
      : '1px solid rgba(239,233,221,0.16)',
    background: active
      ? 'rgba(216,152,84,0.14)'
      : 'rgba(239,233,221,0.04)',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 9, fontWeight: 300,
    letterSpacing: '0.18em', textTransform: 'uppercase' as const,
    color: active ? '#D89854' : 'rgba(239,233,221,0.62)',
    cursor: 'pointer', whiteSpace: 'nowrap' as const,
    touchAction: 'manipulation' as const,
    transition: 'all 200ms ease',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={onClose}>
      {/* Dark scrim — lighter, photo still visible at top */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,3,5,0.55)', pointerEvents: 'none' }} />

      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(10,9,11,0.92)',
          backdropFilter: 'blur(28px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
          borderTop: '1px solid rgba(239,233,221,0.14)',
          borderRadius: '0 0 0 0',
          paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
          maxHeight: '85vh', overflowY: 'auto', scrollbarWidth: 'none' as const,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px' }}>
          <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(239,233,221,0.18)' }} />
        </div>

        {/* Header — Aubade: mono eyebrow + Fraunces title */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px 20px',
          borderBottom: '1px solid rgba(239,233,221,0.10)',
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 8.5, fontWeight: 300,
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(239,233,221,0.40)',
              marginBottom: 6,
            }}>
              {isBlind ? 'Select category' : 'Refine the catalogue'}
            </div>
            <div style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 28, letterSpacing: '-0.02em',
              color: '#EFE9DD',
              fontFeatureSettings: '"opsz" 9',
            }}>
              {isBlind ? 'Category' : 'Filters'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(239,233,221,0.35)', padding: 4,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 14, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Category */}
        <AccordionSection label="Category" hasValue={!!local.category}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c} style={pill(local.category === c)}
                onClick={() => setLocal(f => ({ ...f, category: f.category === c ? null : c }))}>
                {c}
              </button>
            ))}
          </div>
        </AccordionSection>

        {!isBlind && (
          <>
            <AccordionSection label="Mode" hasValue={!!local.mode}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MODE_OPTIONS.map(m => (
                  <button key={m} style={pill(local.mode === m)}
                    onClick={() => setLocal(f => ({ ...f, mode: f.mode === m ? null : m }))}>
                    {m}
                  </button>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection label="City" hasValue={!!local.city}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CITIES.map(c => (
                  <button key={c} style={pill(local.city === c)}
                    onClick={() => setLocal(f => ({ ...f, city: f.city === c ? null : c }))}>
                    {c}
                  </button>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection label="Vibe" hasValue={local.vibes.length > 0}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {VIBE_OPTIONS.map(v => (
                  <button key={v} style={pill(local.vibes.includes(v))}
                    onClick={() => setLocal(f => ({ ...f, vibes: f.vibes.includes(v) ? f.vibes.filter(x => x !== v) : [...f.vibes, v] }))}>
                    {v}
                  </button>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection label="Budget" hasValue={!!local.budget}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BUDGET_OPTIONS.map(b => (
                  <button key={b.label} style={pill(local.budget === b.value)}
                    onClick={() => setLocal(f => ({ ...f, budget: f.budget === b.value ? null : b.value }))}>
                    {b.label}
                  </button>
                ))}
              </div>
            </AccordionSection>
          </>
        )}

        {/* Actions — Aubade glass */}
        <div style={{ display: 'flex', gap: 10, padding: '28px 24px 0' }}>
          <button
            onClick={() => {
              const e = { category:null, city:null, vibes:[], budget:null, mode:null };
              setLocal(e); onApply(e); onClose();
            }}
            style={{
              flex: 1, padding: '14px 0',
              background: 'transparent',
              border: '1px solid rgba(239,233,221,0.18)',
              borderRadius: 2,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9, fontWeight: 300,
              letterSpacing: '0.28em', textTransform: 'uppercase' as const,
              color: 'rgba(239,233,221,0.40)',
              cursor: 'pointer', touchAction: 'manipulation' as const,
            }}
          >Clear</button>
          <button
            onClick={() => { onApply(local); onClose(); }}
            style={{
              flex: 2, padding: '14px 0',
              background: 'rgba(216,152,84,0.18)',
              border: '1px solid rgba(216,152,84,0.55)',
              borderRadius: 2,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9, fontWeight: 300,
              letterSpacing: '0.28em', textTransform: 'uppercase' as const,
              color: '#D89854',
              cursor: 'pointer', touchAction: 'manipulation' as const,
            }}
          >Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── GlassOverlay — vendor profile, true frosted glass ────────────────────────
// Photo clearly visible through the overlay.

function GlassOverlay({ vendor, visible, onClose, isBlind }: {
  vendor: DiscoverVendor; visible: boolean; onClose: () => void; isBlind: boolean;
}) {
  const dragStartY  = useRef(0);
  const [dragDelta, setDragDelta] = useState(0);
  const isDragging  = useRef(false);
  const [circleToast, setCircleToast] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    setDragDelta(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragDelta(delta);
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    if (dragDelta > OVERLAY_DISMISS) { setDragDelta(0); onClose(); }
    else setDragDelta(0);
  };

  const ty = dragDelta > 0 ? `translateY(${dragDelta}px)` : 'translateY(0)';
  const op = dragDelta > 0 ? Math.max(0.3, 1 - dragDelta / 200) : 1;

  const enquireLink = vendor.enquire_link ||
    (vendor.routing_handle ? makeEnquireLink(vendor.routing_handle) : null);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
      transform: visible ? ty : 'translateY(100%)',
      transition: isDragging.current ? 'none' : 'transform 340ms cubic-bezier(0.22,1,0.36,1)',
      opacity: visible ? op : 0,
      // True glass — photo shows through
      ...GLASS.sheet,
      borderRadius: '20px 20px 0 0',
      paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
    }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
      </div>

      {circleToast && (
        <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(10,9,11,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(239,233,221,0.18)', borderRadius: 2, padding: '8px 16px', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.8)', whiteSpace: 'nowrap', zIndex: 30 }}>
          Add someone to your Circle first
        </div>
      )}

      <div style={{ padding: '0 24px' }}>
        {/* Aubade lede — mono eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
          <p style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 8.5, fontWeight: 300, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', margin: 0, whiteSpace: 'nowrap' }}>
            {vendor.category}{vendor.city ? ` · ${vendor.city}` : ''}
          </p>
        </div>
        {!isBlind && (
          <h2 style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, fontStyle: 'italic', color: '#EFE9DD', margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 0.95, fontFeatureSettings: '"opsz" 144' }}>
            {vendor.name}
          </h2>
        )}
        {vendor.about && (
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 300, fontStyle: 'italic', color: 'rgba(248,247,245,0.7)', margin: '0 0 12px', lineHeight: 1.5 }}>
            {vendor.about}
          </p>
        )}
        {!isBlind && vendor.starting_price && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, color: 'rgba(248,247,245,0.55)', margin: '0 0 20px' }}>
            {vendor.starting_price >= 100000
              ? `Rs ${(vendor.starting_price / 100000).toFixed(vendor.starting_price % 100000 === 0 ? 0 : 1)}L onwards`
              : `Rs ${(vendor.starting_price / 1000).toFixed(0)}K onwards`}
          </p>
        )}
        {isBlind && vendor.vibe_tags.length > 0 && (
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(248,247,245,0.55)', margin: '0 0 20px' }}>
            {vendor.vibe_tags.join(' · ')}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); if (enquireLink) window.open(enquireLink, '_blank'); }}
            style={{ width: '100%', padding: '14px 0', background: 'rgba(248,247,245,0.92)', border: 'none', borderRadius: 10, fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0A09', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, touchAction: 'manipulation' }}
          >
            <MessageCircle size={14} strokeWidth={1.5} /> Enquire
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              disabled
              style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Lock size={12} strokeWidth={1.5} /> Lock Date
              <span style={{ fontSize: 7, fontStyle: 'italic', color: 'rgba(248,247,245,0.3)', textTransform: 'none', letterSpacing: 0 }}>beta</span>
            </button>
            <button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setCircleToast(true); setTimeout(() => setCircleToast(false), 2500); }}
              style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, touchAction: 'manipulation' }}
            >
              <Users size={12} strokeWidth={1.5} /> Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Image dots ────────────────────────────────────────────────────────────────

function PlateCounter({ vendorIdx, total }: { vendorIdx: number; total: number }) {
  const plate    = String(vendorIdx + 1).padStart(3, '0');
  const totalStr = String(total).padStart(3, '0');
  return (
    <div style={{
      position: 'fixed',
      top: 'calc(env(safe-area-inset-top,0px) + 52px)',
      left: 22,
      zIndex: 24,
      pointerEvents: 'none',
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 9, fontWeight: 300,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.75)',
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}>
        Plate {plate}<span style={{ color: 'rgba(255,255,255,0.38)' }}> / {totalStr}</span>
      </span>
    </div>
  );
}

function BlindCentreToast({ hint }: { hint: 'dismiss' | null }) {
  if (!hint) return null;
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 30, pointerEvents: 'none', animation: 'heartPop 500ms cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <span style={{ fontSize: 72, lineHeight: 1, color: '#C9A84C' }}>✕</span>
    </div>
  );
}

function EmptyDeck({ mode }: { mode: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0A090B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <span style={{ color: '#D89854', fontSize: 32, lineHeight: 1 }}>✦</span>
      <span style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, fontStyle: 'italic', color: 'rgba(239,233,221,0.75)', letterSpacing: '-0.02em' }}>
        {mode === 'blind' ? "You've seen them all." : "You've seen everyone."}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9, fontWeight: 300, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.35)' }}>
        Check back soon
      </span>
    </div>
  );
}

// ── Top chrome pills ──────────────────────────────────────────────────────────
// Layout (left → right): [✦ Sanctuary] [Blind] ··· [image dots centre] ··· [⚙ filter]
// Blind sits immediately right of Sanctuary — clear of the dots in the centre.

function TopChrome({ onSanctuary, onFilter, onToggleBlind, isBlind, hasFilters }: {
  onSanctuary:   () => void;
  onFilter:      () => void;
  onToggleBlind: () => void;
  isBlind:       boolean;
  hasFilters:    boolean;
}) {
  const top = 'calc(env(safe-area-inset-top,0px) + 14px)';
  const stopTouch = (e: React.TouchEvent) => e.stopPropagation();

  const romanDate = (() => {
    const now = new Date();
    const ROMAN = ['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];
    const d = String(now.getDate()).padStart(2,'0');
    const m = ROMAN[now.getMonth() + 1];
    const y = String(now.getFullYear()).slice(-2);
    return `${d} . ${m} . ${y}`;
  })();

  const pillBase: React.CSSProperties = {
    position: 'fixed', top, zIndex: 25,
    display: 'flex', alignItems: 'center',
    height: 28, borderRadius: 2,
    cursor: 'pointer', touchAction: 'manipulation', border: 'none',
  };
  const aubaGlass: React.CSSProperties = {
    background: 'rgba(5,6,8,0.36)',
    backdropFilter: 'blur(20px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
    border: '1px solid rgba(255,255,255,0.18)',
  };
  const aubaGlassActive: React.CSSProperties = {
    background: 'rgba(216,152,84,0.18)',
    backdropFilter: 'blur(20px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
    border: '1px solid rgba(216,152,84,0.45)',
  };

  return (
    <>
      {/* Roman date — top right, mono */}
      <div style={{
        position: 'fixed', top, right: 52, zIndex: 25,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 9, fontWeight: 300,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.50)',
        height: 28, display: 'flex', alignItems: 'center',
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
      }}>
        {romanDate}
      </div>

      {/* Sanctuary — left */}
      <button
        onClick={onSanctuary}
        onTouchStart={stopTouch}
        onTouchEnd={stopTouch}
        style={{ ...pillBase, left: 14, gap: 6, padding: '0 14px', ...aubaGlass }}
        aria-label="Sanctuary"
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D89854', flexShrink: 0 }} />
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 8.5, fontWeight: 300,
          letterSpacing: '0.20em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.90)', whiteSpace: 'nowrap',
        }}>
          Sanctuary
        </span>
      </button>

      {/* Blind — beside Sanctuary */}
      <button
        onClick={onToggleBlind}
        onTouchStart={stopTouch}
        onTouchEnd={stopTouch}
        style={{ ...pillBase, left: 'calc(14px + 120px + 8px)', padding: '0 14px', ...(isBlind ? aubaGlassActive : aubaGlass) }}
        aria-label="Toggle blind mode"
      >
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 8.5, fontWeight: 300,
          letterSpacing: '0.20em', textTransform: 'uppercase',
          color: isBlind ? '#D89854' : 'rgba(255,255,255,0.60)',
          whiteSpace: 'nowrap',
        }}>
          Blind
        </span>
      </button>

      {/* Filter — far right */}
      <button
        onClick={onFilter}
        onTouchStart={stopTouch}
        onTouchEnd={stopTouch}
        style={{
          ...pillBase, right: 14, width: 28,
          justifyContent: 'center', padding: 0,
          ...(hasFilters ? aubaGlassActive : aubaGlass),
          position: 'fixed',
        } as React.CSSProperties}
        aria-label="Filters"
      >
        <SlidersHorizontal size={13} strokeWidth={1.5} color={hasFilters ? '#D89854' : 'rgba(255,255,255,0.8)'} />
      </button>
    </>
  );
}

// ── Muse helpers ──────────────────────────────────────────────────────────────

async function handleSaveToMuse(vendorId: string, imageUrl: string | null): Promise<boolean> {
  try {
    const result = await saveVendorToMuse(vendorId, imageUrl);
    return result.ok === true;
  } catch { return false; }
}

function spawnSaveToast(alreadySaved = false) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('muse-save-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'muse-save-toast';
  el.style.cssText = `
    position:fixed;top:calc(env(safe-area-inset-top,0px) + 52px);
    left:50%;transform:translateX(-50%);
    background:rgba(17,17,17,0.75);
    backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    border:0.5px solid rgba(255,255,255,0.15);
    color:rgba(248,247,245,0.9);
    font-family:'Jost',sans-serif;font-size:10px;font-weight:300;
    letter-spacing:0.18em;text-transform:uppercase;
    padding:8px 18px;border-radius:20px;
    z-index:9998;pointer-events:none;white-space:nowrap;
    animation:toastSlideIn 250ms cubic-bezier(0.22,1,0.36,1) forwards;
  `;
  el.textContent = alreadySaved ? 'Already in Muse' : '✦ Saved to Muse';
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 300ms ease'; }, 1800);
  setTimeout(() => el.remove(), 2200);
}

function spawnHeart() {
  if (typeof document === 'undefined') return;
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(0);
    font-size:88px;z-index:9999;pointer-events:none;
    animation:heartPop 700ms cubic-bezier(0.22,1,0.36,1) forwards;
    color:#D89854;
  `;
  el.textContent = '✦';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
  haptic(14);
}

// ── Discovery feed content ────────────────────────────────────────────────────

function DiscoveryFeedContent({
  initialCategory, initialBlind, filters,
  onOpenFilter, onOpenSanctuary, onToggleBlind,
}: {
  initialCategory: CategoryId | null;
  initialBlind:    boolean;
  filters:         FilterState;
  onOpenFilter:    () => void;
  onOpenSanctuary: () => void;
  onToggleBlind:   () => void;
}) {
  const isBlind = initialBlind;

  const [vendors,        setVendors]        = useState<DiscoverVendor[]>([]);
  const [vendorIdx,      setVendorIdx]      = useState(0);
  const [imageIdx,       setImageIdx]       = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [plateKey,       setPlateKey]       = useState(0);   // triggers plate-turn animation
  const [plateDir,       setPlateDir]       = useState<'up'|'down'>('up');
  const [blindHint,      setBlindHint]      = useState<'dismiss' | null>(null);
  const [blindIdx,       setBlindIdx]       = useState(0);
  const [currentPage,    setCurrentPage]    = useState(0);
  const [hasMore,        setHasMore]        = useState(true);
  const [loading,        setLoading]        = useState(true);
  const [showRibbon,     setShowRibbon]     = useState(false);

  const currentPhotoRef = useRef<string | null>(null);
  const touchStart      = useRef<{ x: number; y: number; t: number } | null>(null);
  const tapTimer        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTime     = useRef(0);
  const tapCount        = useRef(0);
  const photoTimer      = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasActiveFilters = !!(filters.category || filters.city || filters.vibes.length > 0 || filters.budget || filters.mode);

  // First-session ribbon — shown once, localStorage flag
  useEffect(() => {
    try {
      const seen = localStorage.getItem('frost_discover_ribbon_seen');
      if (!seen) {
        setShowRibbon(true);
        setTimeout(() => setShowRibbon(false), 5000);
        localStorage.setItem('frost_discover_ribbon_seen', '1');
      }
    } catch {}
  }, []);

  useEffect(() => {
    setLoading(true);
    const feedPromise = isBrideDemoDiscover()
      ? fetchDemoDiscoverFeed()
      : fetchDiscoverFeed({
          page:     0,
          category: initialCategory ?? undefined,
          city:     filters.city    ?? undefined,
          budget:   filters.budget  ?? undefined,
          vibes:    filters.vibes.length > 0 ? filters.vibes.join(',') : undefined,
        });
    feedPromise
      .then(({ vendors: v, has_more }) => {
        setVendors(v); setHasMore(has_more); setVendorIdx(0); setImageIdx(0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialCategory, filters]);

  // Pagination
  useEffect(() => {
    if (!hasMore || vendors.length === 0 || vendorIdx < vendors.length - 3) return;
    const nextPage = currentPage + 1;
    fetchDiscoverFeed({
      page: nextPage, category: initialCategory ?? undefined,
      city: filters.city ?? undefined, budget: filters.budget ?? undefined,
      vibes: filters.vibes.length > 0 ? filters.vibes.join(',') : undefined,
    })
      .then(({ vendors: more, has_more }) => {
        if (more.length > 0) { setVendors(prev => [...prev, ...more]); setCurrentPage(nextPage); setHasMore(has_more); }
        else setHasMore(false);
      })
      .catch(() => {});
  }, [vendorIdx, vendors.length, hasMore, currentPage, initialCategory, filters]);

  const blindQueue = React.useMemo(() => {
    const q: { vendorId: string; imageUrl: string; vendorObj: DiscoverVendor }[] = [];
    vendors.forEach(v => {
      if (v.photos.length === 0) q.push({ vendorId: v.id, imageUrl: '', vendorObj: v });
      else v.photos.forEach(p => q.push({ vendorId: v.id, imageUrl: p, vendorObj: v }));
    });
    return q;
  }, [vendors]);

  const vendor = vendors[vendorIdx];

  // Preload next images
  useEffect(() => {
    if (!vendor) return;
    const toPreload: string[] = [];
    for (let i = imageIdx + 1; i < Math.min(vendor.photos.length, imageIdx + 3); i++) toPreload.push(vendor.photos[i]);
    if (vendorIdx + 1 < vendors.length && vendors[vendorIdx + 1].photos[0]) toPreload.push(vendors[vendorIdx + 1].photos[0]);
    toPreload.forEach(src => { const img = new Image(); img.src = src; });
  }, [vendorIdx, imageIdx, vendor, vendors]);

  // Photo auto-cycle — advances every 4s, resets when vendor changes
  useEffect(() => {
    if (!vendor || vendor.photos.length <= 1 || isBlind) return;
    if (photoTimer.current) clearInterval(photoTimer.current);
    photoTimer.current = setInterval(() => {
      setImageIdx(i => {
        const next = i + 1;
        return next < vendor.photos.length ? next : 0;
      });
    }, 4000);
    return () => { if (photoTimer.current) clearInterval(photoTimer.current); };
  }, [vendorIdx, vendor, isBlind]);

  // Single tap on photo = advance to next photo manually (resets auto-cycle)
  const handlePhotoTap = useCallback(() => {
    if (!vendor || vendor.photos.length <= 1) return;
    setImageIdx(i => (i + 1) % vendor.photos.length);
    // Reset the auto-cycle timer
    if (photoTimer.current) {
      clearInterval(photoTimer.current);
      photoTimer.current = setInterval(() => {
        setImageIdx(i => (i + 1) % vendor.photos.length);
      }, 4000);
    }
    haptic(3);
  }, [vendor]);

  const goNextVendor = useCallback(() => {
    if (vendorIdx >= vendors.length - 1) return;
    setPlateDir('up');
    setVendorIdx(i => i + 1);
    setImageIdx(0);
    setOverlayVisible(false);
    setPlateKey(k => k + 1);
    haptic(6);
  }, [vendorIdx, vendors.length]);

  const handleDoubleTap = useCallback(() => {
    if (isBlind) {
      const item = blindQueue[blindIdx];
      if (!item) return;
      spawnHeart();
      handleSaveToMuse(item.vendorId, item.imageUrl || null).then(ok => spawnSaveToast(!ok));
      setBlindIdx(i => Math.min(i + 1, blindQueue.length - 1));
      setPlateKey(k => k + 1);
      haptic(6);
      return;
    }
    if (!vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id, currentPhotoRef.current).then(ok => spawnSaveToast(!ok));
  }, [isBlind, vendor, blindQueue, blindIdx]);

  const handleLongPress = useCallback(() => {
    if (isBlind) return;
    haptic(8);
    setOverlayVisible(true);
  }, [isBlind]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    // Long press — 350ms threshold
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      handleLongPress();
    }, 350);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);
    const dx = Math.abs(e.touches[0].clientX - touchStart.current.x);
    // Cancel long press if finger moves
    if ((dy > 8 || dx > 8) && pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
    if (!touchStart.current) return;
    const start = touchStart.current;
    touchStart.current = null;
    const end  = e.changedTouches[0];
    const dx   = end.clientX - start.x;
    const dy   = end.clientY - start.y;
    const dt   = Date.now() - start.t;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Tap detection
    if (absX < TAP_MAX_MOVE && absY < TAP_MAX_MOVE && dt < TAP_MAX_TIME) {
      const now   = Date.now();
      const since = now - lastTapTime.current;
      if (since < DOUBLE_TAP_MS && tapCount.current >= 1) {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapCount.current = 0;
        handleDoubleTap();
      } else {
        tapCount.current  = 1;
        lastTapTime.current = now;
        tapTimer.current  = setTimeout(() => {
          if (tapCount.current === 1) {
            // Single tap = advance photo (if overlay not open)
            if (!overlayVisible) handlePhotoTap();
            else setOverlayVisible(false);
          }
          tapCount.current = 0;
        }, DOUBLE_TAP_MS);
      }
      return;
    }

    // Swipe detection — vertical axis only
    const velocity = absY / Math.max(dt, 1);
    if (absY < SWIPE_THRESHOLD && velocity < SWIPE_VELOCITY) return;
    if (absX > absY) return; // ignore horizontal swipes entirely

    // Close overlay on downward swipe
    if (overlayVisible && dy > OVERLAY_DISMISS) { setOverlayVisible(false); return; }

    if (isBlind) {
      // Blind: swipe up = next image
      if (dy < -SWIPE_THRESHOLD) {
        setBlindHint('dismiss');
        setTimeout(() => setBlindHint(null), 500);
        setBlindIdx(i => Math.min(i + 1, blindQueue.length - 1));
        setPlateKey(k => k + 1);
        haptic(5);
      }
      return;
    }

    if (dy < -SWIPE_THRESHOLD) {
      // Swipe up = next vendor
      goNextVendor();
    } else if (dy > 120) {
      // Swipe down with long throw (120px) = enter Sanctuary
      // Short downward swipes ignored — prevents accidental Sanctuary entry
      onOpenSanctuary();
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0A090B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.35)' }}>Loading</span>
      </div>
    );
  }

  if (isBlind && blindQueue.length > 0 && blindIdx >= blindQueue.length) return <EmptyDeck mode="blind" />;
  if (!vendor) return <EmptyDeck mode="discover" />;

  const photos       = vendor.photos.length > 0 ? vendor.photos : [];
  const currentPhoto = photos[imageIdx] || null;
  currentPhotoRef.current = currentPhoto;
  const blindItem  = isBlind ? (blindQueue[blindIdx] || null) : null;
  const blindPhoto = blindItem?.imageUrl || null;

  return (
    <>
      <style jsx global>{`
        @keyframes heartPop {
          0%   { opacity:0; transform:translate(-50%,-50%) scale(0.3); }
          45%  { opacity:1; transform:translate(-50%,-50%) scale(1.15); }
          70%  { transform:translate(-50%,-50%) scale(0.95); }
          100% { opacity:0; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes toastSlideIn {
          from { opacity:0; transform:translateX(-50%) translateY(-8px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        /* Plate-turn — the catalogue page physics */
        /* Current plate exits: scale down + fade out */
        @keyframes plateExit {
          0%   { opacity:1; transform:translateY(0) scale(1); }
          100% { opacity:0; transform:translateY(-28px) scale(0.97); }
        }
        /* Next plate enters: rise from below + fade in */
        @keyframes plateEnter {
          0%   { opacity:0; transform:translateY(18px); }
          100% { opacity:1; transform:translateY(0); }
        }
        .plate-enter {
          animation: plateEnter 320ms cubic-bezier(0.22,1,0.36,1) forwards;
        }
        /* Ribbon fade */
        @keyframes ribbonFade {
          0%   { opacity:0; transform:translateY(6px); }
          15%  { opacity:0.72; transform:translateY(0); }
          75%  { opacity:0.72; }
          100% { opacity:0; }
        }
        .frost-ribbon {
          animation: ribbonFade 5s ease-in-out forwards;
        }
      `}</style>

      <div
        style={{ position: 'fixed', inset: 0, background: '#0A090B', overflow: 'hidden', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Photo — plate-enter animation on vendor change */}
        <div
          key={plateKey}
          className="plate-enter"
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          {(isBlind ? blindPhoto : currentPhoto) ? (
            <img
              src={(isBlind ? blindPhoto : currentPhoto)!}
              alt=""
              draggable={false}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#14120F', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(239,233,221,0.2)' }}>No photo yet</span>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
        </div>

        {/* Photo progress dots — subtle, bottom-right, for multi-photo vendors */}
        {!isBlind && photos.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(env(safe-area-inset-bottom,0px) + 22px)',
            right: 22,
            zIndex: 4,
            display: 'flex', gap: 4,
            pointerEvents: 'none',
          }}>
            {photos.slice(0, 8).map((_, i) => (
              <div key={i} style={{
                width: i === imageIdx ? 14 : 4,
                height: 4,
                borderRadius: 2,
                background: i === imageIdx ? '#D89854' : 'rgba(255,255,255,0.35)',
                transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>
        )}

        {/* Plate counter */}
        {!isBlind && <PlateCounter vendorIdx={vendorIdx} total={vendors.length} />}

        {/* Top chrome */}
        <TopChrome
          onSanctuary={onOpenSanctuary}
          onFilter={onOpenFilter}
          onToggleBlind={onToggleBlind}
          isBlind={isBlind}
          hasFilters={hasActiveFilters}
        />

        {isBlind && <BlindCentreToast hint={blindHint} />}

        {/* Gesture compass — two marks only: top and bottom */}
        <div style={{ position: 'absolute', inset: '100px 0 90px 0', zIndex: 4, pointerEvents: 'none', opacity: 0.50 }}>
          {/* Top — ↑ Next */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 8, fontWeight: 300, letterSpacing: '0.24em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          }}>
            <span style={{ fontSize: 11 }}>↑</span>
            <span>Next</span>
          </div>
          {/* Bottom — ↓ Sanctuary */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 4,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 8, fontWeight: 300, letterSpacing: '0.24em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          }}>
            <span style={{ fontSize: 11 }}>↓</span>
            <span style={{ color: '#D89854' }}>Sanctuary</span>
          </div>
        </div>

        {/* Bottom gesture legend — double-tap save · hold enquire */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(env(safe-area-inset-bottom,0px) + 28px)',
          left: 0, right: 0,
          zIndex: 4, pointerEvents: 'none',
          display: 'flex', justifyContent: 'space-between',
          padding: '0 22px',
          opacity: 0.50,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 7.5, fontWeight: 300, letterSpacing: '0.20em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          }}>
            ⊙ double-tap · save
          </span>
          {!isBlind && (
            <span style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 7.5, fontWeight: 300, letterSpacing: '0.20em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 4px rgba(0,0,0,0.7)',
            }}>
              hold · enquire ⏵
            </span>
          )}
        </div>

        {/* First-session teaching ribbon */}
        {showRibbon && (
          <div className="frost-ribbon" style={{
            position: 'absolute',
            bottom: 'calc(env(safe-area-inset-bottom,0px) + 56px)',
            left: 0, right: 0,
            zIndex: 5, pointerEvents: 'none',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 8.5, fontWeight: 300, letterSpacing: '0.26em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)', textShadow: '0 1px 6px rgba(0,0,0,0.8)',
            }}>
              ─── swipe up to discover · double-tap to save · hold for more ───
            </span>
          </div>
        )}

        {/* Artisan card — always visible at bottom in Aubade style */}
        {!isBlind && !overlayVisible && vendor && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(env(safe-area-inset-bottom,0px) + 56px)',
            left: 22, right: 22,
            zIndex: 4, pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 8.5, fontWeight: 300,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.60)',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
              {vendor.category}{vendor.city ? ` · ${vendor.city}` : ''}
            </div>
            <div style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 34, color: '#fff',
              lineHeight: 0.95, letterSpacing: '-0.025em',
              fontFeatureSettings: '"opsz" 144',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              {vendor.name}
            </div>
          </div>
        )}

        {/* Glass overlay — triggered by long press */}
        {!isBlind && (
          <GlassOverlay
            vendor={vendor}
            visible={overlayVisible}
            onClose={() => setOverlayVisible(false)}
            isBlind={isBlind}
          />
        )}
      </div>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

function DiscoveryFeedInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isBlindMode,    setIsBlindMode]    = useState(false);
  const [filterVisible,  setFilterVisible]  = useState(false);
  const [filters,        setFilters]        = useState<FilterState>({ category: null, city: null, vibes: [], budget: null, mode: null });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ category: null, city: null, vibes: [], budget: null, mode: null });

  useEffect(() => {
    if (searchParams?.get('blind') === '1') setIsBlindMode(true);
  }, [searchParams]);

  return (
    <>
      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={f => { setAppliedFilters(f); setFilters(f); }}
        isBlind={isBlindMode}
      />
      <DiscoveryFeedContent
        initialCategory={null}
        initialBlind={isBlindMode}
        filters={appliedFilters}
        onOpenFilter={() => setFilterVisible(true)}
        onOpenSanctuary={() => router.push('/frost/canvas/sanctuary')}
        onToggleBlind={() => setIsBlindMode(b => !b)}
      />
    </>
  );
}

export default function DiscoveryFeed() {
  return (
    <Suspense fallback={
      <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}>Loading</span>
      </div>
    }>
      <DiscoveryFeedInner />
    </Suspense>
  );
}
