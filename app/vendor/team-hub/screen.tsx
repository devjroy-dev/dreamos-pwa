'use client';
// app/vendor/team-hub/screen.tsx — THE TEAM HUB'S BODY, NO CHROME.
//
// ── §4-4 · TEAM CROSSES · R-38.11 · R-38.12 ────────────────────────────────
// Two routes render this module and neither owns it: `app/w/team/page.tsx` mounts it inside
// `WorklistShell`, and `app/vendor/team-hub/page.tsx` survives as the untouched fallback
// and supplies the old `<Header/>` itself. IMPORTED by both, copied by neither.
//
// ── THE `Header` IMPORT IS GONE FROM THIS FILE AND ITS ABSENCE IS ASSERTED ──
// S2's `SliceShell` finding: a conditional does not remove a module from a bundle; only not
// importing it does. The mount lives at the fallback ROUTE.
//
// ── ⚠ THIS ROOM IS THREE DOORS OUT OF THE SHELL, AND THE FOUNDER SAW IT FIRST ──
// `STUDIO_ITEMS` (lib/vendor/studioShared.tsx) points at `/vendor/studio/team`,
// `/vendor/studio/tasks` and `/vendor/studio/team-payments`. None of the three is a room,
// none has a registry entry, and none is chartered to cross this block — so a vendor who
// taps ANY row here LEAVES THE SHELL: second layout, second Splash, second session resolve.
//
// Storefront's Discover row is the precedent and this is the same class, but it is
// three-of-three rather than one-of-two, so it was ruled in advance rather than declared
// after the fact (CE-38 relay, §4-4). All three are named entries in
// `INTERIM_VENDOR_LINKS` with their source line, under C-2's ruling that the set grows by
// named entry at a crossing and shrinks only when the TARGET crosses.
//
// THE HREFS STAY LITERAL AND DO NOT ASK `roomHref`. The address book answers for ROOMS; a
// Studio surface is not one, and pointing a non-room through the registry would make
// `roomHref` return the rooms directory for every miss — a silent wrong answer in place of
// an honest carried link.
//
// ── THE PRESTIGE GATE IS UNCHANGED (R-38.12) ───────────────────────────────
// One `isPrestige` answers here and on the Studio page. Two screens, one answer, and this
// crossing does not become the moment a second one appears.
import { useInShell } from '@/hooks/vendor/useInShell';
import { A, F, STUDIO_ITEMS, SectionLabel, Row, isPrestige } from '@/lib/vendor/studioShared';

export function TeamHubScreen({ tier }: { tier: string | null | undefined }) {
  const inShell = useInShell();
  const prestige = isPrestige(tier);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ flex: 1, paddingBottom: 32 }}>
        {/* ── THE SECTION LABEL IS THE OLD LAYOUT'S CHROME, RETIRED IN THE SHELL ──
            It reads 「Team Hub」 and `WorklistShell` prints 「Team」 one element above it.
            Two names for one surface stacked is the two-mastheads defect in miniature, and
            the second carries nothing the first did not. On the /vendor fallback it renders
            exactly as before, because there the Header prints the vendor's name and nothing
            else names the surface. */}
        {!inShell && <SectionLabel label="Team Hub" first />}
        {STUDIO_ITEMS.map(item => <Row key={item.href} item={{ ...item, locked: !prestige }} />)}

        {!prestige && (
          <div style={{ padding: '24px var(--slice-inset, 28px) 8px' }}>
            <div style={{
              fontFamily: F.script, fontWeight: 300, fontSize: 16,
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
