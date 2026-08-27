// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// /wedding/more — MORE · Atelier rebuild
// All non-daily-use destinations, grouped by section. Brass monogram glyphs.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import Link from 'next/link';
import { Header } from '@/components/vendor/Header';
import { clearVendorSession } from '@/lib/vendor/session';
// ── TDW_09 · F-09.120 · ARM (a), FOUNDER-CONVICTED — THE MODE PILL IS RETIRED ─
// 「 the mode pills looks forced and out of place. remove it 」
// What stood here: `import { VictorModeChip }`, mounted centred at the top of
// this page under Paper A's line "the Advisor chip pinned top". Paper A seated
// it deliberately — it was the last reachable mode control after R-X27
// dissolved the header slot — so this is a RETIREMENT BY RULING over a live
// prior ruling, never a cleanup of a leftover.
//
// F-09.122 CURES BY THIS DELETION, WHICH IS WHY THE TWO TRAVEL TOGETHER.
// The chip had two mounts and they had DIVERGED: this one was props-less, so
// it flipped mode, reset no thread and published nothing; Home's carried
// `onThreadReset` + `onMode` and did all three. Two controls with one name and
// two behaviours is the defect, and deleting the crippled mount leaves Home's
// well-wired chip as THE one control — one authority, the F-07.30 lesson
// again. The COMPONENT itself is byte-untouched and still has its Home caller;
// only this mount goes.

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
  script:  'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
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

// ── THIS FILE'S `SectionLabel` WENT CALLER-ZERO ABOVE AND IS DELETED WITH ITS
// CALLERS. An orphaned component is an orphaned handler, only quieter.
// READ THIS BEFORE YOU GO LOOKING FOR IT ELSEWHERE (F-09.127): `SectionLabel`
// is defined SEVEN times independently across this estate in TWO incompatible
// signatures — this one took `{ label, first }`, the Header's takes
// `{ children, isLight }` — and a shared export already exists at
// lib/vendor/studioShared. THE DELETION HERE IS FILE-SCOPED AND ONLY
// FILE-SCOPED: nothing outside this file imported this definition, and no
// other definition is touched by this delivery. F-09.127 is filed for the
// duplication itself and is NOT cured here.

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
            fontFamily: F.script, fontWeight: 300,
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
    // TDW_10 THE BILLING TAB — DESCRIPTION AMENDED. This row is the DONOR:
    // `components/vendor/Header.tsx` says outright that the coin's Settings row
    // borrowed this glyph and these three nouns so one door would not learn a
    // second vocabulary. Billing has left Settings, so the middle noun is false
    // on both doors, and both are cured in this one delivery — fixing the
    // borrower and not the donor would break the stated reason they were shared.
    { href: '/vendor/settings', label: 'Settings', description: 'profile and preferences', glyph: '⚙' },
    // `components/vendor/Header.tsx` calls this page 「 the exhaustive index 」
    // — the coin is the reflex, the overflow list is the complete one. A new
    // top-level destination that is reachable ONLY from the coin would falsify
    // that sentence, so Billing is seated here too. Label, description and glyph
    // are the coin row's own bytes, carried verbatim into this page's lowercase
    // description register.
    { href: '/vendor/billing', label: 'Billing', description: 'plan and payment', glyph: '◇' },
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
        {/* ── ONE MERGED LIST, PAPER A'S SEQUENCE — F-09.120 arm (a) ──────────
            The four section labels are REMOVED-BY-RULING, not lost: with the
            pill gone the page is a single overflow index, and four brass rules
            over 8 rows was chrome pretending to be structure. PAPER A'S ORDER
            IS PRESERVED EXACTLY — Discover, then Team, then Finance, then
            Account — so nothing moves relative to anything else; only the
            dividers between the groups go. EVERY ROW IS KEPT. The four source
            arrays stay separate above so each keeps its own warrant comment
            and its own witness. */}
        {[...DISCOVER_ITEMS, ...TEAM_ITEMS, ...FINANCE_ITEMS, ...ACCOUNT_ITEMS]
          .map(item => <MoreRow key={item.label} item={item} />)}
      </div>
    </div>
  );
}
