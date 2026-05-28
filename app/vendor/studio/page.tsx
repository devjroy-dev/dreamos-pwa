'use client';
// /wedding/studio — Studio Suite (Team Hub) · Atelier rebuild
// Chapter-index pattern: brass monogram glyphs, Cormorant titles, italic
// subtitles. Two sections — Studio (links to lists) and Team Hub (prestige-only).

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import Link from 'next/link';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

function Chevron() {
  return <span style={{ color: 'var(--atelier-label)', fontFamily: F.display, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>›</span>;
}

function SectionLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{ padding: first ? '24px 24px 14px' : '32px 24px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass }}>{label}</span>
      <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
    </div>
  );
}

interface Item { href: string; label: string; desc: string; glyph: string; locked?: boolean; }

const LISTS: Item[] = [
  { href: '/vendor/list/clients',  label: 'Clients',  desc: 'your people',            glyph: 'C' },
  { href: '/vendor/list/leads',    label: 'Leads',    desc: 'who to follow up with',  glyph: 'L' },
  { href: '/vendor/list/invoices', label: 'Invoices', desc: 'who owes me money',      glyph: 'I' },
  { href: '/vendor/list/events',   label: 'Events',   desc: 'schedule and shoots',    glyph: '◐' },
  { href: '/vendor/list/expenses', label: 'Expenses', desc: 'what went out',          glyph: '×' },
];

const STUDIO_ITEMS: Item[] = [
  { href: '/vendor/studio/team',          label: 'Team',          desc: 'roster and contact details', glyph: 'T' },
  { href: '/vendor/studio/tasks',         label: 'Tasks',         desc: 'assignments and deadlines',  glyph: '✓' },
  { href: '/vendor/studio/team-payments', label: 'Team Payments', desc: 'what you owe your crew',     glyph: '◇' },
];

function Row({ item }: { item: Item }) {
  const isLocked = item.locked;
  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 18,
    textDecoration: 'none',
    borderBottom: '0.5px solid var(--atelier-card-border)',
    cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.55 : 1,
  };
  const inner = (
    <>
      <span style={{
        flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 26, color: A.brassWarm, lineHeight: 1,
      }}>{item.glyph}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 19, color: A.ink, letterSpacing: '0.005em', lineHeight: 1.15 }}>{item.label}</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginTop: 2, letterSpacing: '0.01em' }}>{item.desc}</div>
      </div>
      {isLocked ? (
        <span style={{
          fontFamily: F.label, fontWeight: 400, fontSize: 8, color: A.brass,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          border: `0.5px solid rgba(201,168,76,0.5)`, borderRadius: 2, padding: '4px 9px', flexShrink: 0,
        }}>Prestige</span>
      ) : <Chevron />}
    </>
  );
  if (isLocked) return <div style={rowStyle}>{inner}</div>;
  return <Link href={item.href} style={rowStyle}>{inner}</Link>;
}

export default function StudioPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;

  const isPrestige = session.tier === 'prestige';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header vendorName={session.name ?? null} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 32 }}>
        <SectionLabel label="Your Studio" first />
        {LISTS.map(item => <Row key={item.href} item={item} />)}

        <SectionLabel label="Team Hub" />
        {STUDIO_ITEMS.map(item => <Row key={item.href} item={{ ...item, locked: !isPrestige }} />)}

        {!isPrestige && (
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
