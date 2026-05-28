'use client';
// /wedding/list — BUSINESS · Atelier rebuild
// Sections: PIPELINE (Leads + Clients) and MONEY (Invoices + Expenses)
// Brass monogram glyphs replace SVG icons. Cormorant titles. Italic Cormorant
// subtitles. Brass hairline dividers.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import Link from 'next/link';
import { Header } from '@/components/vendor/Header';

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
  return (
    <span style={{
      color: 'var(--atelier-label)',
      fontFamily: F.display, fontSize: 18, lineHeight: 1,
      flexShrink: 0,
    }}>›</span>
  );
}

function SectionLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{
      padding: first ? '24px 24px 14px' : '36px 24px 14px',
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

interface Item { href: string; label: string; description: string; glyph: string; }

// Brass monograms — chapter-index letters
const PIPELINE: Item[] = [
  { href: '/vendor/list/leads',   label: 'Leads',   description: 'who do I follow up with', glyph: 'L' },
  { href: '/vendor/list/clients', label: 'Clients', description: 'your people',             glyph: 'C' },
];

const MONEY: Item[] = [
  { href: '/vendor/list/invoices', label: 'Invoices', description: 'who owes me money', glyph: 'I' },
  { href: '/vendor/list/expenses', label: 'Expenses', description: 'what went out',     glyph: '×' },
];

function Row({ item }: { item: Item }) {
  return (
    <Link href={item.href} style={{
      display: 'flex', alignItems: 'center',
      padding: '18px 24px',
      gap: 20,
      textDecoration: 'none',
      borderBottom: '0.5px solid var(--atelier-card-border)',
      transition: 'background 200ms ease',
    }}>
      {/* Brass monogram — Italiana letter */}
      <span style={{
        flexShrink: 0,
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 28,
        color: A.brassWarm, lineHeight: 1,
      }}>{item.glyph}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 21,
          color: A.ink, letterSpacing: '0.005em', lineHeight: 1.15,
        }}>{item.label}</div>
        <div style={{
          fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
          fontSize: 13, color: A.inkMute, marginTop: 3, letterSpacing: '0.01em',
        }}>{item.description}</div>
      </div>

      <Chevron />
    </Link>
  );
}

export default function BusinessPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
      <Header vendorName={session?.name ?? null} />
      <div style={{ flex: 1 }}>
        <SectionLabel label="Pipeline" first />
        {PIPELINE.map(item => <Row key={item.href} item={item} />)}
        <SectionLabel label="Money" />
        {MONEY.map(item => <Row key={item.href} item={item} />)}
      </div>
    </div>
  );
}
