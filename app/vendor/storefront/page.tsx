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
// ── TDW_09 PHASE B · F-3 = (a) — the bio story seats HERE, §1 of the door ──
// The heading is the FOUNDER-VETOED byte 「 Complete your bio 」; the score is
// THE one model (lib/vendor/profileMeter — moved from the profile page, never
// re-authored) fed by the same reads that page trusts; the row's subtitle is
// the drawer's own vetoed byte 「 How couples see you 」. Route byte-identical:
// this block LINKS /vendor/discover/profile, it does not absorb it.
import { useState } from 'react';
import { useSettings } from '@/hooks/vendor/useSettings';
import { fetchDiscoverStatus, fetchPortfolio, fetchToday } from '@/lib/vendor/api/vendor';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';
import { photoFloor } from '@/lib/vendor/discoverFloor';
import { buildGaps, scoreOf } from '@/lib/vendor/profileMeter';
import { Meter } from '@/components/vendor/ProfileMeter';

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
// V1/V2 FOUNDER-VETOED (「 pushed and ok 」, 2026-08-07): Leads and Collab
// descriptions land; Portfolio/Discover descriptions carried from More at P2A.
const SECTIONS: Item[] = [
  { href: '/vendor/portfolio',      label: 'Portfolio', description: 'images and photo library',           glyph: '▣' },
  { href: '/vendor/discover',       label: 'Discover',  description: 'your profile on The Dream Wedding',  glyph: '◈' },
  { href: '/vendor/discover/leads', label: 'Leads',     description: 'couples who enquired',               glyph: '✉' },
  { href: '/vendor/collab',         label: 'Collab',    description: 'shared weddings with other vendors', glyph: '◇' },
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
        <BioBlock vendorId={session.id} />
        <SectionLabel label="Storefront" />
        {SECTIONS.map(item => <StoreRow key={item.label} item={{ ...item }} />)}
      </div>
    </div>
  );
}

// ── §1 — the bio story (F-3(a)) + live counts (founder 「 ok 」) ──────────────
function BioBlock({ vendorId }: { vendorId: string }) {
  const { current, loading } = useSettings();
  const [approved, setApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const [hasHero, setHasHero] = useState(false);
  const [serverFloor, setServerFloor] = useState<number | undefined>(undefined);
  const [leadsWaiting, setLeadsWaiting] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    // BYTE-FOR-BYTE the profile page's own reads (:147-:157) — one authority
    // on the meter's inputs, never a second recipe for the same number.
    fetchDiscoverStatus().then((res) => {
      if (!live || !res.ok) return;
      setApproved(res.portfolio_summary?.approved ?? 0);
      setPending(res.portfolio_summary?.pending ?? 0);
      setServerFloor(res.min_portfolio_images);
    }).catch(() => { /* the meter degrades to zeros; it never blocks the door */ });
    fetchPortfolio(vendorId, 'approved').then((res) => {
      if (!live || !res.ok) return;
      setHasHero((res.images as PortfolioImage[]).some((i) => i.is_hero));
    }).catch(() => { /* same */ });
    // Leads count: the SAME engine figure the home ledger reads
    // (TodayResponse.open_leads_count) — one authority, R-O12/R-O15's law.
    fetchToday(vendorId).then((t) => { if (live) setLeadsWaiting(t?.open_leads_count ?? null); }).catch(() => {});
    return () => { live = false; };
  }, [vendorId]);
  if (loading) return null;
  const gaps = buildGaps({
    approved, pending, floor: photoFloor(serverFloor), hasHero,
    about: current.about,
    tags: current.aesthetic_tags.split(',').map((t) => t.trim()).filter(Boolean),
    travelNotes: current.travel_notes, rateMin: current.rate_min,
    ig: current.instagram_handle,
  });
  const score = scoreOf(gaps);
  return (
    <div style={{ borderBottom: '0.5px solid var(--atelier-card-border)', paddingBottom: 8 }}>
      {/* FOUNDER-VETOED heading (relay #2 slate). */}
      <SectionLabel label="Complete your bio" first />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px' }}>
        <Meter score={score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href="/vendor/discover/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 20, color: A.ink, lineHeight: 1.15 }}>Your bio</div>
              {/* The drawer's own vetoed byte, carried. */}
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2 }}>How couples see you</div>
            </div>
            <Chevron />
          </Link>
        </div>
      </div>
      {/* Live counts under the same roof (readouts, not copy): */}
      <div style={{ display: 'flex', gap: 18, padding: '10px 24px 4px' }}>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: A.inkMute }}>
          {approved} photos live{pending > 0 ? ` · ${pending} pending` : ''}
        </span>
        {leadsWaiting !== null && (
          <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: leadsWaiting > 0 ? A.brassWarm : A.inkMute }}>
            {leadsWaiting} {leadsWaiting === 1 ? 'lead waiting' : 'leads waiting'}
          </span>
        )}
      </div>
    </div>
  );
}
