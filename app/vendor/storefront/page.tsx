'use client';
// /vendor/storefront — THE STOREFRONT DOOR · TDW_09 PACKAGE 2 (R-X27 arm (a))
//
// Paper A's fourth seat: R-X20's ruled word becomes a PLACE — everything about
// how she appears to couples lives behind the word that says so (information
// scent). FORK 1 = (a), chair relay #1: this is a HUB PAGE whose sections LINK
// the existing routes; /vendor/portfolio, /vendor/discover,
// /vendor/discover/leads and /vendor/collab keep byte-identical paths (the
// P1-admin precedent — deep links held, not redirected). Nothing that lived at
// those routes moved; this door is a new front on standing rooms.
//
// COPY: the four section labels — Portfolio · Discover · Leads · Collab — are
// FOUNDER-VETOED BYTES (relay #2, 「 all ok 」). The two descriptions are
// CARRIED verbatim from the More page's own retired rows (they were already
// vetoed bytes on that surface; the rows MOVED here, inventory-accounted).
// Leads and Collab ship description-less — no existing vetoed byte fits them,
// and this sitting authors no new vendor-facing words; drafts ride the
// handover's veto table for the founder's option.
//
// Row idiom carried from /vendor/more (MoreRow's shape) — same glyph box, same
// script label, same chevron, same hairline. One house, one row grammar.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import Link from 'next/link';
import { Header } from '@/components/vendor/Header';

const A = {
  ink:       'var(--atelier-ink)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
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

interface Item { href: string; label: string; description: string; glyph: string; }

// The four sections, Paper A's own membership. Descriptions: 'images and photo
// library' and 'your profile on The Dream Wedding' are the More page's own
// vetoed bytes, travelling WITH their rows (MOVED, control inventory).
const SECTIONS: Item[] = [
  { href: '/vendor/portfolio',      label: 'Portfolio', description: 'images and photo library',           glyph: '▣' },
  { href: '/vendor/discover',       label: 'Discover',  description: 'your profile on The Dream Wedding',  glyph: '◈' },
  { href: '/vendor/discover/leads', label: 'Leads',     description: '',                                   glyph: '✉' },
  { href: '/vendor/collab',         label: 'Collab',    description: '',                                   glyph: '◇' },
];

function StoreRow({ item }: { item: Item }) {
  return (
    <Link href={item.href} style={{
      display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 18,
      textDecoration: 'none',
      borderBottom: '0.5px solid var(--atelier-card-border)',
    }}>
      <span style={{
        flexShrink: 0,
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 25,
        color: A.brassWarm, lineHeight: 1,
      }}>{item.glyph}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 20,
          color: A.ink, letterSpacing: '0.005em', lineHeight: 1.15,
        }}>{item.label}</div>
        {item.description && (
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2, letterSpacing: '0.01em',
          }}>{item.description}</div>
        )}
      </div>
      <Chevron />
    </Link>
  );
}

export default function StorefrontPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Header vendorName={session?.name ?? null} />
      <div style={{ flex: 1, paddingBottom: 40 }}>
        <SectionLabel label="Storefront" first />
        {SECTIONS.map(item => <StoreRow key={item.label} item={item} />)}
      </div>
    </div>
  );
}
