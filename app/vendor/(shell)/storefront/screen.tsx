// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock's screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/storefront/screen.tsx — THE STOREFRONT DOOR'S BODY, NO CHROME.
//
// ── §4-3 · STOREFRONT CROSSES · R-38.11 · R-38.12 ──────────────────────────
// Two routes render this module and neither owns it: `app/w/storefront/page.tsx` mounts it
// inside `WorklistShell`, and `app/vendor/storefront/page.tsx` survives as the untouched
// fallback and supplies the old `<Header/>` itself. IMPORTED by both, copied by neither.
//
// ── THE `Header` IMPORT IS GONE FROM THIS FILE AND ITS ABSENCE IS ASSERTED ──
// S2's `SliceShell` finding, paid for once: a conditional does not remove a module from a
// bundle; only not importing it does. The mount lives at the fallback ROUTE.
//
// ── THE ADDRESS BOOK PAYS OUT A SECOND TIME, AND THIS TIME IT WAS A LITERAL ─
// `SECTIONS`'s Portfolio row spelled `/vendor/portfolio` as a hardcoded string, written
// long before the shell. It asks `roomHref('portfolio')` now, so Portfolio crossing in this
// same batch moved this row WITHOUT this row being reasoned about a second time — which is
// exactly what the address book was built for at the S2 ZIP bounce.
//
// ⚠ AND IT ANSWERS THE SAME WAY IN BOTH TREES, WHICH IS RULED AND NOT AN OVERSIGHT.
// `roomHref` is deliberately not tree-aware (CE-38 relay, S2 ZIP bounce): a cross-link to a
// DIFFERENT room is a departure whichever tree it starts in, so a vendor on the /vendor
// fallback who taps Portfolio lands in the shell. `SliceDoor`'s tree-awareness is the
// asymmetric case — lateral movement inside ONE family — and Storefront → Portfolio is not
// that. Two rules, two shapes, each with its reason at its own site.
//
// ── THE TWO OUTBOUND LINKS THAT ARE NOT ROOMS ──────────────────────────────
// `/vendor/discover` (the Discover row) and `/vendor/discover/profile` (the bio row) point
// at surfaces that are NOT in the room registry and are not chartered to cross this block.
// Both are declared in `INTERIM_VENDOR_LINKS`, and `/vendor/discover` is the entry that
// forced C-2's ruling at this sitting: that set is the ledger of what crossed surfaces
// still point at, so it GROWS by named entry at a crossing and shrinks only at Phase 7.
// Forbidding its growth would have forbidden crossing itself.
//
// ── THE DECLARED GAP ───────────────────────────────────────────────────────
// The body did not cross typographically (R-38.12): the rooms' older type register and
// F-38.22's colour-literal family. Captured, excluded from the render arm's tuple cell by
// name, priced.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import Link from 'next/link';
import { roomHref } from '@/lib/worklist/rooms';
// ── TDW_09 PHASE B · F-3 = (a) — the bio story seats HERE, §1 of the door ──
// The heading is the FOUNDER-VETOED byte 「 Complete your bio 」; the score is
// THE one model (lib/vendor/profileMeter — moved from the profile page, never
// re-authored) fed by the same reads that page trusts; the row's subtitle is
// the drawer's own vetoed byte 「 How couples see you 」. Route byte-identical:
// this block LINKS /vendor/discover/profile, it does not absorb it.
import { useState } from 'react';
import { useSettings } from '@/hooks/vendor/useSettings';
import { fetchDiscoverStatus, fetchPortfolio, updateMe } from '@/lib/vendor/api/vendor';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';
import { photoFloor } from '@/lib/vendor/discoverFloor';
import { buildGaps, scoreOf } from '@/lib/vendor/profileMeter';
import { Meter } from '@/components/vendor/ProfileMeter';
// ── WALK HOTFIX MICRO · F-09.111 — the late-load flash, this screen's limb ──
import { Reserve } from '@/components/vendor/Reserve';

import { COPY } from '@/lib/worklist/copy';
const A = {
  ink:       'var(--atelier-ink)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
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

function SectionLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{
      padding: first ? '24px var(--slice-inset, 24px) 14px' : '32px var(--slice-inset, 24px) 14px',
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
  // §4-3: THE ADDRESS BOOK, NOT A LITERAL. `/vendor/portfolio` was hardcoded here since
  // Paper A; Portfolio crosses in this same batch and this row followed without being
  // reasoned about again. It is a `roomHref` call rather than a re-spelled `/vendor/portfolio`
  // for the same reason it was wrong the first time: a literal spells a destination, and
  // the registry IS the one place that knows where a room lives.
  { href: roomHref('portfolio'),    label: 'Portfolio', description: 'images and photo library',           glyph: '▣' },
  // NOT A ROOM. `/vendor/discover` is a carried surface with no registry entry and no
  // crossing chartered this block, so it stays a literal and is DECLARED in
  // `INTERIM_VENDOR_LINKS` instead — counted, so it cannot grow quietly, rather than
  // explained, which is the shape the S2 ZIP bounce convicted.
  { href: '/vendor/discover',       label: 'Discover',  description: 'your profile on The Dream Wedding',  glyph: '◈' },
  // R-37.87 (ZIP 14): Collab's row is REMOVED here because it now has its own tile in the
  // shell's bottom band. One home, or it is two — and two doors to one room is the disease
  // the sixteen-tile grid was ruled to end. The SURFACE is untouched and the route is
  // byte-identical (/vendor/collab); only this second door closes. On `main` the row stands.
];

function StoreRow({ item }: { item: Item }) {
  return (
    <Link href={item.href} style={{
      display: 'flex', alignItems: 'center', padding: '16px var(--slice-inset, 24px)', gap: 18,
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
            fontFamily: F.script, fontWeight: 300,
            fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2, letterSpacing: '0.01em',
          }}>{item.description}</div>
        )}
      </div>
      <Chevron />
    </Link>
  );
}

export function StorefrontScreen({ vendorId }: { vendorId: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ flex: 1, paddingBottom: 40 }}>
        <BioBlock vendorId={vendorId} />
        {/* ── THE SECTION LABEL IS THE OLD LAYOUT'S CHROME, RETIRED IN THE SHELL ──
            It reads 「Storefront」, and inside the shell `WorklistShell` already prints that
            exact word in its header one element above. Two 「Storefront」s stacked is the
            two-mastheads defect in miniature — the founder's own double-nav finding wearing
            a smaller face — and the second one carries no information the first did not.
            On the /vendor fallback it renders exactly as before, because there the Header
            prints the vendor's name and nothing names the surface. */}
        
        <PublicPageBand />

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
  // ── F-39.10 · THE LEADS READOUT IS REMOVED-BY-RULING (CE-39, 2026-08-29) ───
  // A `leadsWaiting` state, a `fetchToday` call and a conditional span stood here. All
  // three are GONE, not gated.
  //
  // WHY, in the ruling's own terms: R-P3.5.6 ① says `open_leads_count` is never summed,
  // compared or displayed against Today's masthead in ANY surface, and Storefront IS a
  // room — a default pin, one tile away from Today. The figure came off the ENGINE plane
  // while Today's numeral comes off the TYPED plane, so after Phase 4 this room and that
  // masthead would have shown two numbers about the same leads, from two planes, able to
  // disagree by construction. §8.9 names that as the disease and does not recommend it.
  // TODAY IS THE ONE LEADS FIGURE.
  //
  // THE ENGINE READER ITSELF IS NOT TOUCHED. `fetchToday` and its remaining caller
  // (`hooks/vendor/useVendorData.ts:216`) stand as they were; the predicate is not
  // repaired, it RETIRES at the §8.9 seam (R-P3.5.6's whole reasoning). What left here is
  // a DISPLAY, which is the half the ruling governs.
  //
  // F-09.111: the two fetches that feed the SCORE, settled-or-failed.
  const [statusDone, setStatusDone] = useState(false);
  const [heroDone,   setHeroDone]   = useState(false);
  const metricsReady = statusDone && heroDone;
  useEffect(() => {
    let live = true;
    // BYTE-FOR-BYTE the profile page's own reads (:147-:157) — one authority
    // on the meter's inputs, never a second recipe for the same number.
    fetchDiscoverStatus().then((res) => {
      if (!live) return;
      if (res.ok) {
        setApproved(res.portfolio_summary?.approved ?? 0);
        setPending(res.portfolio_summary?.pending ?? 0);
        setServerFloor(res.min_portfolio_images);
      }
    }).catch(() => { /* the meter degrades to zeros; it never blocks the door */ })
      .finally(() => { if (live) setStatusDone(true); });
    fetchPortfolio(vendorId, 'approved').then((res) => {
      if (!live) return;
      if (res.ok) setHasHero((res.images as PortfolioImage[]).some((i) => i.is_hero));
    }).catch(() => { /* same */ })
      .finally(() => { if (live) setHeroDone(true); });
    return () => { live = false; };
  }, [vendorId]);

  // ── F-09.111 CURED — THE CARD NO LONGER ARRIVES AFTER THE PAGE ─────────────
  // THIS FILE READ, until this delivery:  `if (loading) return null;`
  //
  // THE MECHANISM, NAMED SO ITS NEXT SITTING RE-READS THIS (F-06.85): BioBlock
  // unmounted ENTIRELY while useSettings() loaded, so the page painted with the
  // "Storefront" label at the top and then, on settle, this whole card appeared
  // and shoved the label and all four rows down the screen. Founder-witnessed
  // 2026-08-07. It is a violation of a law the estate had already ratified —
  // S5 Paper C rule 5, "loading is skeleton, never blank".
  //
  // AND A SECOND JUMP UNDERNEATH THE FIRST: the meter's score is fed by
  // fetchDiscoverStatus + fetchPortfolio, which settle INDEPENDENTLY of
  // useSettings. Gating on `loading` alone would have shown the card at
  // settings-settle with a score computed from zeros, and ProfileMeter's arc
  // carries a 420ms stroke transition — so the founder would have watched a
  // wrong number sweep to a right one. `metricsReady` holds the skeleton until
  // the inputs the SCORE reads have landed. A failed fetch still resolves it
  // (the .catch legs below set it too) — a dead network must not hang the card
  // in skeleton forever; the meter degrades to its documented zeros instead.
  //
  // The skeleton branch below mirrors the loaded branch's DOM: same wrapper,
  // same SectionLabel, same paddings, and the meter's box reserved by GHOST
  // (Reserve renders the real Meter invisibly) so the reserved height is the
  // browser's own measurement and no executor arithmetic sits under it.
  if (loading || !metricsReady) {
    return (
      <div style={{ borderBottom: '0.5px solid var(--atelier-card-border)', paddingBottom: 8 }}>
        <SectionLabel label="Complete your bio" first />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 var(--slice-inset, 24px)' }}>
          <Reserve ghost><Meter score={0} /></Reserve>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* 23px = the loaded title's 20px Cormorant at lineHeight 1.15 */}
            <Reserve h={23} w="52%" />
            {/* 24px = the loaded subtitle's 16px Cormorant at lineHeight 1.5 */}
            <Reserve h={24} w="72%" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, padding: '10px var(--slice-inset, 24px) 4px' }}>
          {/* 13px = the loaded readout's 9px Jost line box */}
          <Reserve h={13} w={124} />
        </div>
      </div>
    );
  }

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 var(--slice-inset, 24px)' }}>
        <Meter score={score} />
        {/* F-P72.C (founder walk, 2026-09-04): this row read as a ROW — title, hint, chevron —
            the same grammar as Portfolio and Discover below. But those two are DOORS and this
            one is the ASK: it is the surface that gets a profile finished. The title and the
            drawer's vetoed line stay; the chevron-link becomes the shell's primary button
            beneath the meter. Mock frame `P72C-bio-call`; S19 vetoed. Portfolio and Discover
            KEEP the row grammar on purpose — one call per screen, or the contrast that makes a
            call read as one is gone (founder: Discover becomes a call when Block 09 ports it). */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 20, color: A.ink, lineHeight: 1.15 }}>Your bio</div>
          {/* The drawer's own vetoed byte, carried. */}
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2 }}>How couples see you</div>
        </div>
      </div>
      {/* The shell's button register, read from its one home (WorklistShell's SHELL_CSS, hoisted
          at P7.2 Arm C). The two properties below are this SITE's, not the register's: the
          margin that seats the call under the meter, and the link's own text-decoration. */}
      <Link href="/vendor/discover/profile" className="wl-btn pri"
            style={{ textDecoration: 'none', margin: '12px var(--slice-inset, 24px) 0' }}>
        {COPY.storefrontBioCta}
      </Link>
      {/* Live counts under the same roof (readouts, not copy): */}
      <div style={{ display: 'flex', gap: 18, padding: '10px var(--slice-inset, 24px) 4px' }}>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: A.inkMute }}>
          {approved} photos live{pending > 0 ? ` · ${pending} pending` : ''}
        </span>
      </div>
    </div>
  );
}


// ── §2 — G3.1 · THE PUBLIC PAGE BAND (R-40.77, R-40.78, R-G31.2) ───────────
//
// R-G31.2 opened the Business Solutions row 「Your website & SEO」 onto THIS
// room rather than building a second surface. So the band is additive: the bio
// block above and the four SECTIONS below are untouched.
//
// ⚠ THE BAND IS FACTS, NEVER A SCORE AND NEVER A REPORT — master §7. Her
// address, what a stranger can see on it, and the one permission she controls.
// No SEO grade, no traffic promise, no checklist of things she has not done.
function PublicPageBand() {
  const { current, loading } = useSettings();
  // ⚠ THE SWITCH OWNS ITS OWN STATE AND DOES NOT GO THROUGH `update`/`isDirty`.
  // `useSettings` is a FORM hook built for a Save button; this saves on toggle
  // (founder-ruled: `discover_paused`'s exact posture). Routing it through the
  // dirty-tracking would make an unrelated Save elsewhere carry this flag, and
  // a consent flag must be written by the tap that granted it and nothing else.
  const [on, setOn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  // Seeded from the hook's single `/me` read — never a second fetch.
  const live = on ?? current.date_check_enabled;

  async function toggle() {
    if (busy) return;
    const next = !live;
    setOn(next);                    // optimistic
    setBusy(true);
    try {
      const r = await updateMe({ date_check_enabled: next });
      // ⚠ REVERT ON REFUSAL, and read the door's own echo rather than assuming
      // the write took. `updateMe` returns the updated vendor; if the door said
      // no — or said yes to something else — the row goes back to the truth.
      if (!('ok' in r) || !r.ok) setOn(!next);
      else setOn(r.vendor.date_check_enabled === true);
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  // ── R-40.78 · A TRADE WITH NO CAPACITY TO ANSWER ──────────────────────────
  // Gated on `capacity_reason`, NEVER on `capacity_applicable` — F-40.172: the
  // two came from different ladders and disagreed on seven categories, so a
  // hairstylist would have been shown a switch she could flip, after which every
  // guest checking a date would read the miss sentence.
  //
  // ⚠ ABSENT, NOT DISABLED. A greyed control is a thing she keeps tapping.
  const reason = current.capacity_reason;
  const handle = current.routing_handle;

  return (
    <>
      <SectionLabel label={COPY.storefrontPublicLabel} />
      <div style={{ padding: '0 var(--slice-inset, 24px)' }}>
        {handle ? (
          <a
            href={`https://thedreamwedding.in/v/${handle.toLowerCase()}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: F.script, fontWeight: 400, fontSize: 16, lineHeight: 1.5,
              color: A.brass, textDecoration: 'underline', textUnderlineOffset: 3,
              wordBreak: 'break-all', display: 'block',
            }}
          >{`thedreamwedding.in/v/${handle.toLowerCase()}`}</a>
        ) : null}

        {/* ── THREE STATES, AND THE THIRD SAYS NOTHING — F-40.175 ───────────
            `undefined` is the door not having answered, which is not a fact
            about her trade and must not be rendered as one. No switch (we
            cannot stand behind a permission we could not read) and no sentence
            (we know nothing to tell her). Still fail-closed; simply silent. */}
        {reason === undefined ? null : reason === null ? (
          <>
            <div
              role="switch"
              aria-checked={live}
              aria-label={COPY.storefrontDateSwitch}
              tabIndex={0}
              onClick={toggle}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 0 6px', cursor: 'pointer',
                opacity: busy ? 0.6 : 1,
              }}
            >
              <span style={{
                flex: 1, minWidth: 0,
                fontFamily: F.script, fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: A.ink,
              }}>{COPY.storefrontDateSwitch}</span>
              <span style={{
                width: 46, minWidth: 46, height: 27, borderRadius: 14, position: 'relative',
                background: live ? A.brass : 'var(--atelier-input-bg)',
                border: `0.5px solid ${live ? A.brass : 'var(--atelier-card-border)'}`,
                transition: 'background 140ms ease',
              }}>
                <span style={{
                  position: 'absolute', top: 2, [live ? 'right' : 'left']: 2,
                  width: 21, height: 21, borderRadius: '50%',
                  background: live ? 'var(--role-ink-deep)' : 'var(--atelier-ink-fade)',
                }} />
              </span>
            </div>
            {/* D4 sits beside the switch in BOTH states — see its comment in copy.ts. */}
            <p style={{
              fontFamily: F.script, fontWeight: 300, fontSize: 13, lineHeight: 1.55,
              color: A.inkMute, margin: 0, maxWidth: '34ch',
            }}>{COPY.storefrontDateStanding}</p>
          </>
        ) : (
          <p style={{
            fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
            color: A.inkMute, margin: '12px 0 2px', maxWidth: '30ch',
          }}>
            {reason === 'ruled_off' ? COPY.storefrontDateRuledOff : COPY.storefrontDateUnmapped}
          </p>
        )}
      </div>
    </>
  );
}
