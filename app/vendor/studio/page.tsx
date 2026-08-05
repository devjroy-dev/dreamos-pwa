'use client';
// /wedding/studio — Studio Suite (Team Hub) · Atelier rebuild
// Chapter-index pattern: brass monogram glyphs, Cormorant titles, italic
// subtitles. Two sections — Studio (links to lists) and Team Hub (prestige-only).

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import Link from 'next/link';
// TDW_04.5 P4 · F11(c) — Row/SectionLabel/STUDIO_ITEMS and the prestige gate now
// live in ONE home, shared with the new /vendor/team-hub route. Moved, not
// rewritten: this screen's rendered output is unchanged.
import { A, F, Item, STUDIO_ITEMS, SectionLabel, Row, isPrestige } from '@/lib/vendor/studioShared';

const LISTS: Item[] = [
  { href: '/vendor/list/clients',  label: 'Clients',  desc: 'your people',            glyph: 'C' },
  { href: '/vendor/list/leads',    label: 'Leads',    desc: 'who to follow up with',  glyph: 'L' },
  { href: '/vendor/list/invoices', label: 'Invoices', desc: 'who owes me money',      glyph: 'I' },
  { href: '/vendor/list/events',   label: 'Events',   desc: 'schedule and shoots',    glyph: '◐' },
  { href: '/vendor/list/expenses', label: 'Expenses', desc: 'what went out',          glyph: '×' },
  { href: '/vendor/studio/notes',  label: 'Notes to Self', desc: 'thoughts you’ve jotted', glyph: '✎' },
];

export default function StudioPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;

  const prestige = isPrestige(session.tier);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Header vendorName={session.name ?? null} />
      <div style={{ flex: 1, paddingBottom: 32 }}>
        <SectionLabel label="Your Studio" first />
        {LISTS.map(item => <Row key={item.href} item={item} />)}

        <SectionLabel label="Team Hub" />
        {STUDIO_ITEMS.map(item => <Row key={item.href} item={{ ...item, locked: !prestige }} />)}

        {!prestige && (
          <div style={{ padding: '24px 28px 8px' }}>
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16,
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
