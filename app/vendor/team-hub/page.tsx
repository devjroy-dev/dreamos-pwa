'use client';
// /vendor/team-hub — TDW_04.5 P4 · ruling F11(c).
//
// The SECOND entry point to the Team Hub. More → Team Hub lands here; the
// Studio page keeps showing the same section beneath Your Studio, and both
// render it from the same module, so there is exactly one place the founder's
// three rows are written down.
//
// THIS ROUTE RENDERS THE TEAM HUB SECTION ONLY — Team · Tasks · Team Payments,
// and nothing else. No Your Studio lists, no new rows, no new strings. If this
// screen ever grows a fourth row, it grows it in studioShared.tsx and both
// entry points get it together.
//
// ONE PRESTIGE GATE: the lock state and the upgrade line come from the same
// `isPrestige` the Studio page asks. Two screens, one answer.
//
// NAV: this adds a destination, not an information-architecture change. Collab
// stays under Discover — the Team-Hub-vs-Discover question is founder-deferred
// (CE-59), and nothing here presumes it.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { A, F, STUDIO_ITEMS, SectionLabel, Row, isPrestige } from '@/lib/vendor/studioShared';

export default function TeamHubPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;

  const prestige = isPrestige(session.tier);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Header vendorName={session.name ?? null} />
      <div style={{ flex: 1, paddingBottom: 32 }}>
        <SectionLabel label="Team Hub" first />
        {STUDIO_ITEMS.map(item => <Row key={item.href} item={{ ...item, locked: !prestige }} />)}

        {!prestige && (
          <div style={{ padding: '24px 28px 8px' }}>
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14,
              color: A.inkMute, lineHeight: 1.55, textAlign: 'center',
            }}>
              Team Hub is reserved for Prestige.<br />Contact Swati to upgrade.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
