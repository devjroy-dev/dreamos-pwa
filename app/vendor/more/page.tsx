'use client';
// /wedding/more — MORE · Atelier rebuild
// All non-daily-use destinations, grouped by section. Brass monogram glyphs.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import Link from 'next/link';
import { Header } from '@/components/vendor/Header';
import { clearVendorSession } from '@/lib/vendor/session';
// TDW_09 P2 (Paper A: "the Advisor chip pinned top per the spec's own P1") —
// the Business/Advisor control, pinned at the top of More so the ONE surviving
// mode control is reachable from the overflow door. Byte-untouched component;
// only this mount is new.
import { VictorModeChip } from '@/components/vendor/VictorModeChip';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  red:       'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

function Chevron() {
  return (
    <span style={{
      color: 'var(--atelier-label)',
      fontFamily: F.display, fontSize: 16, lineHeight: 1,
      flexShrink: 0,
    }}>›</span>
  );
}

function SectionLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{
      padding: first ? '24px 24px 14px' : '32px 24px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 9,
        letterSpacing: '0.5em', textTransform: 'uppercase',
        color: A.brass,
      }}>{label}</span>
      <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
    </div>
  );
}

interface Item { href?: string; label: string; description: string; glyph: string; danger?: boolean; action?: () => void; }

// TDW_09 P2 — 'Discover Status' and 'Portfolio' rows MOVED to the Storefront
// door (/vendor/storefront), Paper A's fourth seat: those surfaces now live
// behind the word that says so. Their description bytes travelled WITH them
// (control inventory, MOVED). Couture and Featured stay — Paper A seats both
// in More.
const DISCOVER_ITEMS: Item[] = [
  { href: '/vendor/couture',   label: 'Couture',         description: 'appointments and availability',      glyph: '♡' },
  { href: '/vendor/featured',  label: 'Featured',        description: 'promoted slots and promos',          glyph: '✦' },
];

// TDW_04.5 P4 · F11(c) — Team Hub now has its own route, and this row points at
// it. The description is the VETO LEDGER's cure (founder YES, CE-59): the screen
// it lands on shows Team, Tasks and Team Payments, so "briefing" named something
// that was never there.
const TEAM_ITEMS: Item[] = [
  { href: '/vendor/team-hub', label: 'Team Hub', description: 'team, tasks, and payments', glyph: 'T' },
];

const FINANCE_ITEMS: Item[] = [
  { href: '/vendor/tds',       label: 'TDS',       description: 'tax deducted at source',  glyph: '%' },
  { href: '/vendor/contracts', label: 'Contracts', description: 'signed agreements and PDFs', glyph: '§' },
];

function MoreRow({ item }: { item: Item }) {
  const inner = (
    <>
      <span style={{
        flexShrink: 0,
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 25,
        color: item.danger ? A.red : A.brassWarm, lineHeight: 1,
      }}>{item.glyph}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 20,
          color: item.danger ? A.red : A.ink, letterSpacing: '0.005em', lineHeight: 1.15,
        }}>{item.label}</div>
        {item.description && (
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2, letterSpacing: '0.01em',
          }}>{item.description}</div>
        )}
      </div>
      {!item.action && <Chevron />}
    </>
  );

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 18,
    textDecoration: 'none',
    borderBottom: '0.5px solid var(--atelier-card-border)',
    background: 'none',
    border: 'none',
    width: '100%',
    cursor: item.action ? 'pointer' : 'default',
    textAlign: 'left',
  };

  if (item.action) {
    return <button type="button" onClick={item.action} style={rowStyle as React.CSSProperties}>{inner}</button>;
  }
  return <Link href={item.href!} style={{ ...rowStyle, borderBottom: '0.5px solid var(--atelier-card-border)' }}>{inner}</Link>;
}

export default function MorePage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  const ACCOUNT_ITEMS: Item[] = [
    // R-X8 — Notes re-homed here from the retired /vendor/studio hub (F-09.18
    // arm (a)); label, description and glyph carried VERBATIM from that page's
    // own row (existing bytes, no new copy). The leaf route stands untouched.
    { href: '/vendor/studio/notes', label: 'Notes to Self', description: 'thoughts you’ve jotted', glyph: '✎' },
    { href: '/vendor/settings', label: 'Settings', description: 'profile, billing, preferences', glyph: '⚙' },
    {
      label: 'Sign Out',
      description: '',
      danger: true,
      action: () => { clearVendorSession(); router.replace('/'); },
      glyph: '→',
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Header vendorName={session?.name ?? null} />
      <div style={{ flex: 1, paddingBottom: 40 }}>
        {/* Paper A: the Advisor chip pinned top — the one mode control, reachable
            from the overflow door. */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '18px 24px 4px' }}>
          <VictorModeChip />
        </div>
        <SectionLabel label="Discover" first />
        {DISCOVER_ITEMS.map(item => <MoreRow key={item.label} item={item} />)}

        <SectionLabel label="Team" />
        {TEAM_ITEMS.map(item => <MoreRow key={item.label} item={item} />)}

        <SectionLabel label="Finance" />
        {FINANCE_ITEMS.map(item => <MoreRow key={item.label} item={item} />)}

        <SectionLabel label="Account" />
        {ACCOUNT_ITEMS.map(item => <MoreRow key={item.label} item={item} />)}
      </div>
    </div>
  );
}
