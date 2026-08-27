// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/billing/page.tsx — Billing · Atelier
// ─────────────────────────────────────────────────────────────────────────────
// TDW_10 THE BILLING TAB (R-26.4), founder-ruled 「 Lets put it in avatar under
// Billing 」. Billing is the estate's only revenue surface and it sat ninth on a
// settings page, reachable only by scrolling past seven cards about something
// else. It has its own door now, off the profile coin.
//
// THE SHELL IS THE SETTINGS SHELL, deliberately: same Header, same back
// chevron, same eyebrow register, same scroll container and safe-area padding.
// A vendor arriving here should not feel she has left the building. Nothing is
// invented — every value below is carried from `app/vendor/settings/page.tsx`.
//
// SHELL PARITY, DERIVED not assumed: `app/vendor/layout.tsx`'s roomClassForPath
// sends `/vendor/billing` to the `else` bucket → `room-studio`, which is exactly
// where `/vendor/settings` falls. `BottomNav`'s DOORS list lights no tab for
// either (Home and More are `exact`; no prefix matches). So this route needs
// zero shell bytes and introduces zero atmosphere delta.
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useSettings } from '@/hooks/vendor/useSettings';
import { useToast } from '@/hooks/vendor/useToast';
import { Toast } from '@/components/vendor/Toast';
import { Header } from '@/components/vendor/Header';
import { SubscriptionCard } from '@/components/vendor/SubscriptionCard';
import { A, F } from '@/components/vendor/AtelierForm';

export default function BillingPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <BillingScreen vendorName={session.name ?? null} />;
}

function BillingScreen({ vendorName }: { vendorName: string | null }) {
  const router = useRouter();
  const { current, loading, error } = useSettings();
  const { toast, show } = useToast();

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
    </div>
  );
  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.red }}>{error}</div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* HONEST CONTROLS (CE-209) — THE TOAST MOUNT IS LOAD-BEARING.
          Five of this surface's sentences reach the vendor ONLY through
          `show()`: mintFailed, cancelFailed, mintFailedAfterCancel, notOpenYet.
          A Billing page without this line renders a Cancel button that, when the
          call fails, does nothing and says nothing — a failed cancel that looks
          like a successful one. Cell-asserted, never trusted. */}
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.interactiveWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>Billing</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 22px calc(40px + env(safe-area-inset-bottom))' }}>
        <SubscriptionCard current={current} show={show} />
      </div>
    </div>
  );
}
