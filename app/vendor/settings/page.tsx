// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. Italic survives only where a surface sets it WITHOUT the
// script role.
'use client';
// app/vendor/settings/page.tsx — the ROUTE. The screen itself moved out.
//
// M-FINISH S1 · R-38.1. `SettingsScreen` now lives at components/vendor/SettingsScreen.tsx
// because `/w/settings` renders the same component inside WorklistShell, and a page file
// may not export anything but the page contract — Next 16 fails the build on it by name.
// The move is PURE: rendered output here is unchanged, and this route keeps its session
// guard, its chrome and its deep link.
//
// ⚠ THIS ROUTE IS AN UNTOUCHED FALLBACK NOW. Nothing in the shell links to it (R-38.1
// permits the old /vendor routes to survive on disk this sitting). It retires at cutover
// with the rest of the /vendor tree, not before — `/vendor/settings#tier` is a wire
// address that must keep resolving.
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { SettingsScreen } from '@/components/vendor/SettingsScreen';

export default function SettingsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  // THE MASTHEAD MOUNTS HERE, NOT INSIDE THE SCREEN. If it were imported by the screen and
  // merely gated by a prop it would still be BUNDLED into /w/settings, carrying the old
  // drawer and its banned bytes onto a shell surface. A conditional does not remove a
  // module from a chunk; only not importing it does.
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <SettingsScreen />
    </div>
  );
}

// TDW_10 THE BILLING TAB — `TierPicker` and `CancelBlock` were defined below this line and
// moved WHOLE to `components/vendor/SubscriptionCard.tsx` under R-26.4 Fork D. The
// `id="tier"` anchor and its signpost travelled with `SettingsScreen` in this sitting's
// move; the wire address `/vendor/settings#tier` still resolves to it.
