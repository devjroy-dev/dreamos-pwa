'use client';

// components/frost-bride/atoms.tsx
// Shared building blocks for all frost-bride screens.
// Session reads from couple_session / couple_web_session — same keys as pin-login writes.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, FONTS, RADIUS, BORDER_THIN, EASE } from './tokens';

// ─── Session helper ──────────────────────────────────────────────────────────
export interface CoupleSession {
  id?: string;
  userId?: string;
  coupleId?: string;
  name?: string;
  partner_name?: string;
  phone?: string;
  pin_set?: boolean;
}

export function getCoupleSession(): CoupleSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem('couple_session') ||
      localStorage.getItem('couple_web_session');
    return raw ? (JSON.parse(raw) as CoupleSession) : null;
  } catch { return null; }
}

export function getCoupleId(): string | null {
  const s = getCoupleSession();
  return s?.coupleId || s?.id || null;
}

export function getCoupleAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('access_token'); } catch { return null; }
}

// ─── Guard hook ─────────────────────────────────────────────────────────────
export function useCoupleIdGuard(): string | null {
  const router = useRouter();
  const [coupleId, setCoupleId] = useState<string | null>(null);

  useEffect(() => {
    const id = getCoupleId();
    if (!id) { router.replace('/'); return; }
    setCoupleId(id);
  }, [router]);

  return coupleId;
}

// ─── Shimmer ────────────────────────────────────────────────────────────────
export function Shimmer({
  height = 80, width = '100%', radius = 8, marginTop = 0,
}: { height?: number | string; width?: number | string; radius?: number; marginTop?: number }) {
  return (
    <>
      <style>{`@keyframes fbShim{0%{opacity:.4}50%{opacity:.9}100%{opacity:.4}}`}</style>
      <div style={{ height, width, marginTop, borderRadius: radius, background: '#EEEBE6', animation: 'fbShim 1.6s ease-in-out infinite' }} />
    </>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({
  children, style, onClick,
}: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.card, border: BORDER_THIN, borderRadius: RADIUS.md,
        padding: 16, cursor: onClick ? 'pointer' : 'default',
        transition: `transform 180ms ${EASE}`, ...style,
      }}
    >{children}</div>
  );
}

// ─── State badge ─────────────────────────────────────────────────────────────
const BADGE: Record<string, { bg: string; fg: string }> = {
  confirmed: { bg: COLORS.success,           fg: '#FFFFFF' },
  pending:   { bg: 'rgba(194,136,64,0.12)',  fg: COLORS.warn },
  cancelled: { bg: 'rgba(140,132,128,0.10)', fg: COLORS.muted },
  upcoming:  { bg: 'rgba(201,168,76,0.10)',  fg: COLORS.gold },
  done:      { bg: 'rgba(91,124,83,0.10)',   fg: COLORS.success },
};

export function StateBadge({ state }: { state: string }) {
  const c = BADGE[state] || { bg: 'rgba(140,132,128,0.10)', fg: COLORS.muted };
  return (
    <span style={{
      display: 'inline-block', background: c.bg, color: c.fg,
      fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      padding: '4px 10px', borderRadius: RADIUS.pill, whiteSpace: 'nowrap',
    }}>{state.replace(/_/g, ' ')}</span>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', background: COLORS.card, border: BORDER_THIN, borderRadius: RADIUS.md }}>
      <div style={{ fontFamily: FONTS.cg300, fontSize: 22, fontStyle: 'italic', color: COLORS.dark, lineHeight: 1.4 }}>{title}</div>
      {hint && <div style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.muted, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', color: COLORS.muted, padding: '4px 0 10px' }}>
      {children}
    </div>
  );
}

// ─── Coming soon ─────────────────────────────────────────────────────────────
export function ComingSoon({ title, blurb, eta }: { title: string; blurb?: string; eta?: string }) {
  return (
    <div style={{ padding: '40px 24px', minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
      <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: COLORS.gold }}>Coming Soon</div>
      <div style={{ fontFamily: FONTS.cg300, fontSize: 32, color: COLORS.dark, lineHeight: 1.2 }}>{title}</div>
      {blurb && <div style={{ fontFamily: FONTS.dm300, fontSize: 14, color: COLORS.muted, maxWidth: 320, lineHeight: 1.6 }}>{blurb}</div>}
      {eta && <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, background: COLORS.warm, padding: '6px 14px', borderRadius: RADIUS.pill, border: BORDER_THIN }}>{eta}</div>}
    </div>
  );
}

// ─── Page header ─────────────────────────────────────────────────────────────
export function PageHeader({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{ padding: '24px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
      <div style={{ flex: 1 }}>
        {eyebrow && <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>{eyebrow}</div>}
        <div style={{ fontFamily: FONTS.cg300, fontSize: 28, color: COLORS.dark, lineHeight: 1.15 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.muted, marginTop: 6 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Page error ───────────────────────────────────────────────────────────────
export function PageError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center', background: COLORS.card, border: `0.5px solid ${COLORS.danger}33`, borderRadius: RADIUS.md, margin: '16px 20px' }}>
      <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark, marginBottom: 6 }}>Something went wrong</div>
      <div style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>{message}</div>
      {onRetry && (
        <button onClick={onRetry} style={{ fontFamily: FONTS.jost, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', background: COLORS.dark, color: COLORS.bg, border: 'none', padding: '8px 18px', borderRadius: RADIUS.pill, cursor: 'pointer' }}>
          Try again
        </button>
      )}
    </div>
  );
}
