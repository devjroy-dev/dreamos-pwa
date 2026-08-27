// ══ BRANCH-ONLY · M-WORKLIST ZIP 11 (R-37.84 (1) and (6)) ══════════════════
// (1) ONE MEDALLION. The shell’s coin and this avatar were two identities for one person.
//     This one adopts the shell’s chrome exactly: --role-metal ring, 44px, the label family.
// (6) THE DRAWER IS AN OVERLAY, NOT A SHOVE. It rendered inline and pushed the grid down.
//     It is now anchored under the header’s right edge on a scrim, with the page unmoved
//     beneath it and a scrim-tap to dismiss. A drawer that displaces the page is a drawer
//     that costs the reader his place.
// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// components/Header.tsx — Atelier rebuild · Calling-card dropdown + theme toggle

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipsCarousel } from '@/components/vendor/TipsCarousel';
import { useVendorMe } from '@/hooks/vendor/useVendorMe';
import { useTheme } from '@/hooks/vendor/useTheme';
import { useT } from '@/lib/vendor/ThemeContext';
import { clearVendorSession } from '@/lib/vendor/session';

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  red:       'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function initials(name: string | null | undefined): string {
  if (!name) return 'M';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function titleCase(s: string | null | undefined): string {
  if (!s) return '';
  return s.split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function Header({ vendorName }: { vendorName: string | null }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [tipsOpen, setTipsOpen]       = useState(false);
  const [theme, , setThemeMode] = useTheme();
  const T = useT();

  const me = useVendorMe();
  const displayName = me?.business_name || me?.name || vendorName || 'Vendor';
  const headerName = displayName.split(' ')[0];
  const subtitle = [titleCase(me?.category), me?.city].filter(Boolean).join(' · ');

  // ── TDW_09 PACKAGE 2 · fork 8.4 (chair relay #3) — THE MODE'S HEADER ORGANS,
  // RETIRED BY NAME. What stood here: the F-07.30 classifier read
  // (`vendorModeForPath(pathname)`) feeding the centre-slot ModePill, and
  // `handleModeChange` (setMode + a router.push per mode). The mode is dissolved
  // under R-X27 arm (a) — five stable doors, one membership — so the pill has
  // nothing to switch and its reader has nothing to read. Both die by
  // subtraction. The F-07.30 one-authority LESSON survives on the new bar's
  // DOORS list (components/vendor/BottomNav.tsx), which is now the one
  // membership + active-state authority; the leaf itself went caller-zero and
  // is retired (named line, this sitting's delivery). `data-tour="mode-pill"`
  // died with the slot — the onboarding step it anchored is retired under the
  // same warrant, and the Discover step re-anchors on the bar.

  const profileRef = useRef<HTMLDivElement>(null);

  // ── R-36.9 · THE BOUND IS MEASURED, NOT HAND-SUMMED ───────────────────────
  // R-M1 bounded this card at `calc(100dvh - 88px)` and cured F-09.71 on a
  // 374x691 iOS frame. F-16.23 is that defect RETURNING on a Pixel 10 Pro — a
  // recurrence PAST the cure, not its absence, and the tell is the founder's own
  // words: "menu does not scroll".
  //
  // WHY THAT SENTENCE IS THE DIAGNOSIS. app/vendor/layout.tsx wraps every vendor
  // surface in `height: 100dvh; overflowX: clip; overflowY: hidden`. This card is
  // `position: absolute` inside the header, so it lives INSIDE that clip. Its own
  // bound is `100dvh - 88px`; the room actually below the coin is
  // `100dvh - <the coin's rendered bottom>`. When those disagree the card is
  // CLIPPED, not scrolled — and a clipped card has no overflow of its own, so
  // `overflowY: auto` produces no scrollbar and no gesture. A card merely too
  // tall would scroll.
  //
  // 88 was a hand-sum: 10+34+12 header + 12 gap + 20 foot. It has no relationship
  // to the RENDERED bottom under a device's safe-area insets or display scaling,
  // which is why an iOS frame agreed with it and a Pixel does not.
  //
  // SO IT IS MEASURED ON OPEN. `getBoundingClientRect().bottom` of the coin is
  // the real top edge of the card's room; the gap and foot stay as R-M1 sized
  // them. R-36.9 amends that one clause and NOTHING ELSE of R-M1 — dvh over vh
  // stands, its own scroll stands, momentum stands.
  //
  // ZERO HORIZONTAL DELTA, AND THAT IS BINDING. R-M1 withdrew `right: -16` /
  // `minWidth: 292` with the stated condition that the next walk be a CLEAN TEST
  // of the other (horizontal-clipping) suspect, and that test is still pending.
  // This cure touches only a vertical bound, so the pending test survives this
  // sitting uncontaminated. The `position: fixed` arm was refused for exactly
  // this reason: it would change the containing block, which is horizontal
  // geometry.
  const [menuBound, setMenuBound] = useState('calc(100dvh - 88px)');
  useEffect(() => {
    if (!profileOpen) return;
    const coin = profileRef.current;
    if (!coin) return;
    const measure = () => {
      const bottom = coin.getBoundingClientRect().bottom;
      // 12 gap (the card's own `top: calc(100% + 12px)`) + 20 foot, as R-M1 sized them.
      setMenuBound(`${Math.max(160, window.innerHeight - bottom - 32)}px`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [profileOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    function h(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [profileOpen]);

  function signOut() {
    setProfileOpen(false);
    clearVendorSession();
    router.replace('/');
  }

  // TDW_09 MICRO-2 · F-09.75 — `requestInvite()` stood here and died with the drawer
  // row that was its only caller. See the tombstone at the Actions section below.

  // In light mode, ink colors flip — header text needs to read on cream
  const isLight = theme === 'light';
  const inkColor = isLight ? T.ink : A.ink;
  const inkMuteColor = isLight ? T.inkMute : A.inkMute;

  return (
    <>
    <header data-atelier-backdrop="warm" style={{
      position: 'sticky', top: 0, zIndex: 20,
      backdropFilter: 'blur(40px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      padding: '10px 20px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      borderBottom: 'none',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexShrink: 1 }}>
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 8,
          letterSpacing: '0.42em', textTransform: 'uppercase',
          color: A.brass,
        }}>DreamAi</span>
        <span style={{
          fontFamily: F.display, fontWeight: 400, fontSize: 20,
          color: inkColor, letterSpacing: '0.01em', marginTop: 2, lineHeight: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{headerName}</span>
      </div>

      {/* Right: profile coin + calling-card dropdown */}
      <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button data-tour="profile-coin" type="button" onClick={() => setProfileOpen(o => !o)} aria-label="Profile menu"
          style={{
            // R-37.84 (1): identical to the shell's .wl-coin — same ring token, same 44px,
            // same face. Two identities for one person is one identity too many. The teal
            // ring and the gold wash both go: the medallion is metal, like the shell's.
            width: 44, height: 44, borderRadius: '50%',
            border: '1px solid var(--role-metal)',
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, touchAction: 'manipulation',
            fontFamily: F.label, fontWeight: 500, fontSize: 12, lineHeight: 1,
            color: 'var(--role-metal)', letterSpacing: '0.06em',
          }}>
          {initials(displayName)}
        </button>

        {/* Calling-card dropdown */}
        {/* ── TDW_09 MICRO-2 · F-09.71 · R-M1 — THE PANEL IS BOUNDED BY THE VIEWPORT ──
            This positioner had no maxHeight and no overflow, so on a short frame the
            panel simply hung off the bottom of the screen and its foot — Sign Out
            included — could not be reached by any gesture. Founder-witnessed at
            374×691, where the declared contents want ≈679px and 623px exist.
            dvh, not vh, RULED AT R-M1: the founder walks iOS Safari, where vh
            overstates the viewport under collapsing browser chrome — which is the
            very geometry this cure exists to answer. 88px = the sticky header
            (10+34+12) + this panel's own 12px gap + a 20px foot margin.
            THE BOUND SITS ON THE CARD, NOT THE POSITIONER — D-1 WITHDRAWN. The first
            build put it here and paid for overflow-y:auto's forced overflow-x with
            16px of padding, right:-16 and minWidth 292, to keep the ornate shadow
            from being clipped. That geometry was WRONG TO SHIP: this positioner is
            in the DOM on every page that renders Header whether the drawer is open
            or not (opacity/pointerEvents below, never a conditional mount), so a
            negative right offset put an always-present absolutely-positioned box
            past the header's padding edge on 23 surfaces — and a horizontal
            clipping report arrived on the founder's very next walk. It was NOT
            proven to be this byte and it is not exonerated either; it is simply
            removed, so the next walk is a clean test of the other suspect.
            Moving the bound to the card costs nothing and buys back what the
            padding was for: overflow-y:auto clips to the border radius exactly as
            overflow:hidden did, and a box-shadow is painted OUTSIDE the border box,
            so the element's own overflow cannot clip it. Zero horizontal delta from
            origin. R-M1's substance — viewport-bounded maxHeight, its own scroll,
            momentum on, the card's chrome intact — is fully served. */}
        <>
        {/* R-37.84 (6): the scrim. Fixed, so the page beneath keeps its scroll position, and
            tapping it dismisses. Without this the drawer rendered in flow and shoved the grid
            down — a drawer that displaces the page costs the reader his place.

            ── F-38.13 · IT IS MOUNTED ONLY WHEN THE DRAWER IS OPEN. CE-38 relay #3, arm (a).
            IT WAS NOT, AND THAT KILLED THE AVATAR ON EVERY CARRIED ROOM. The panel below is
            hidden by `opacity` and `pointerEvents`; this scrim had no such guard and no
            conditional mount, so a full-viewport `position:fixed` button sat permanently at
            `zIndex:199` inside this header's own stacking context (`:152-153`,
            position:sticky + zIndex:20). The coin at `:176` carries no `position` and no
            `zIndex`, so it painted BELOW the scrim and could not be tapped. Founder-witnessed
            on `/vendor/team-hub`, `/vendor/list/leads` and `/vendor/list/invoices`; `/w/*`
            renders no Header, which is exactly why Billing — the surface that crossed — was
            the only place the avatar answered.

            MINE, AND BRANCH-ONLY: introduced at `66dd7dc` (ZIP 11) by the very ruling this
            comment cites. `git merge-base --is-ancestor 66dd7dc origin/main` → not an
            ancestor. No paying vendor has met it.

            A CONDITIONAL MOUNT HERE AND STYLE-HIDING BELOW IS NOT AN INCONSISTENCY. The
            panel must stay mounted to animate from — its transition needs a node to move —
            and the scrim has no motion to preserve. Gating both would cost the open/close
            animation, which is why arm (b) was refused. */}
        {profileOpen && (
          <button type="button" aria-label="Close menu" onClick={() => setProfileOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'var(--role-scrim)',
                     border: 'none', cursor: 'pointer' }} />
        )}
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
          minWidth: 260, zIndex: 200,
          opacity: profileOpen ? 1 : 0,
          transform: profileOpen ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: profileOpen ? 'auto' : 'none',
          transition: `opacity 180ms ${EASE}, transform 220ms ${EASE}`,
        }}>
          <div className="atelier-card atelier-card-ornate" style={{
            padding: 0,
            // R-M1 lives here: bounded by the DYNAMIC viewport (vh overstates it
            // under iOS Safari's collapsing chrome — this defect's own class), with
            // its own scroll and momentum. overflowX stays hidden so the horizontal
            // axis behaves exactly as the retired `overflow: hidden` did.
            maxHeight: menuBound, // R-36.9: measured on open, never hand-summed
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            background: `linear-gradient(180deg, ${T.sheetTop} 0%, ${T.sheetBot} 100%)`, // theme-aware (was hardcoded espresso)
            backdropFilter: 'blur(32px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
            boxShadow: isLight
              ? `0 8px 24px -4px rgba(26,15,8,0.15), 0 0 0 0.5px ${T.sheetBorder}`
              : '0 16px 40px -8px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(201,168,76,0.32), inset 0 1px 0 var(--atelier-ink-dim)',
            // `overflow: 'hidden'` stood here. It is retired INTO the overflowX/overflowY
            // pair above, which clips the horizontal axis identically and lets the
            // vertical one scroll. The radius clip it was protecting is unchanged:
            // overflow:auto establishes the same clipping box as overflow:hidden.
          }}>
            {/* Calling card header */}
            <div style={{
              padding: '18px 20px 16px',
              borderBottom: `0.5px solid rgba(201,168,76,0.22)`,
            }}>
              <div style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.5em', textTransform: 'uppercase',
                color: A.brass, marginBottom: 8,
              }}>The Maker</div>
              <div style={{
                fontFamily: F.display, fontWeight: 400, fontSize: 25,
                color: isLight ? '#2C1F14' : 'var(--atelier-ink)',
                lineHeight: 1.1, letterSpacing: '0.005em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{displayName}</div>
              {subtitle && (
                <div style={{
                  fontFamily: F.script, fontWeight: 300,
                  fontSize: 16, lineHeight: 1.5, color: inkMuteColor, marginTop: 5,
                  letterSpacing: '0.01em',
                }}>{subtitle}</div>
              )}
            </div>

            {/* ATELIER section */}
            <SectionLabel isLight={isLight}>Atelier</SectionLabel>
            {/* TDW_07 P2: this entry has said "Discover Profile" since long before the screen
                existed, and pointed at /vendor/settings for want of anywhere better. The
                screen exists now, in DISCOVER mode where it belongs. The label was always
                this feature's name arriving early; only the destination changes. */}
            <DItem glyph="◈" label="Discover Profile"    subtitle="How couples see you" isLight={isLight} onClick={() => { setProfileOpen(false); router.push('/vendor/discover/profile'); }} />
            {/* ── TDW_09 · F-09.118 · C2 · FORK 2(a), FOUNDER-APPROVED 「 yes 」 ──
                THE SETTINGS DOOR, REACHABLE FROM THE COIN. Founder verbatim:
                「 The settings is not accessible through the avatar in the top
                right 」 — /vendor/settings existed and was reachable ONLY through
                More → Account, so the surface a vendor reaches for by instinct
                (her own initials) had no route to her own settings.
                Seated in ATELIER beneath Discover Profile, which is the row it
                belongs beside: both are "your own particulars", and the section
                above already carries the identity register.
                The glyph ⚙ and the subtitle's three nouns are BORROWED from the
                More row (app/vendor/more/page.tsx, ACCOUNT_ITEMS) so one door
                does not learn a second vocabulary — the subtitle's leading
                capital is the founder's approved byte, not the donor's.
                THE MORE → ACCOUNT → SETTINGS DOOR IS KEPT, by ruling. Two doors
                to one destination is the intent here, not a duplicate: the
                overflow list is the exhaustive index, the coin is the reflex. */}
            {/* SUBTITLE AMENDED, TDW_10 THE BILLING TAB: it read 「 Profile,
                billing, preferences 」 until this sitting and that middle noun
                stopped being true the moment billing left this door. A subtitle
                that promises a thing the screen no longer holds is a lying
                control with a smaller font. The donor row in
                `app/vendor/more/page.tsx` (ACCOUNT_ITEMS) carries the same three
                nouns and is amended in the SAME delivery — the comment above
                says outright they were borrowed so one door does not learn a
                second vocabulary, and curing one without the other would break
                the stated reason they were shared. */}
            <DItem glyph="⚙" label="Settings"             subtitle="Profile and preferences" isLight={isLight} onClick={() => { setProfileOpen(false); router.push('/vendor/settings'); }} />
            {/* ── TDW_10 THE BILLING TAB · R-26.4 FORK C ─────────────────────
                FOUNDER-RULED 「 Lets put it in avatar under Billing 」. Billing
                is the estate's only revenue surface and it sat ninth on the
                settings page, behind seven cards about something else.

                SEATED IN ATELIER, DIRECTLY AFTER SETTINGS, and the adjacency is
                the point, not tidiness: the vendor who goes hunting for billing
                in Settings — because its subtitle promised it until this same
                delivery — meets the new door in her eyeline at the exact moment
                that promise is withdrawn. Atelier is also the right section on
                its own merits: it runs particulars-first (Discover Profile,
                Settings) then outward (the site, the manual), and her plan is
                the third particular.

                GLYPH ◇, founder-vetoed: the same geometric family as Discover
                Profile's ◈, which is itself already doubled on Tips, so family
                reuse is the set's own precedent rather than a new vocabulary. */}
            <DItem glyph="◇" label="Billing"              subtitle="Plan and payment" isLight={isLight} onClick={() => { setProfileOpen(false); router.push('/vendor/billing'); }} />
            <DItem glyph="★" label="The Dream Wedding"   isLight={isLight} onClick={() => { setProfileOpen(false); window.open('https://thedreamwedding.in', '_blank'); }} />
            <DItem glyph="◈" label="Tips &amp; Features" subtitle="Mini manual" isLight={isLight} onClick={() => { setProfileOpen(false); setTipsOpen(true); }} accent />

            {/* THEME TOGGLE — between sections */}
            <SectionLabel isLight={isLight}>Display</SectionLabel>
            <DItem glyph="●" label="Dark"  subtitle="Graphite"            isLight={isLight} accent={theme === 'dark'}  onClick={() => { setThemeMode('dark'); }} />
            <DItem glyph="○" label="Light" subtitle="Chalk"           isLight={isLight} accent={theme === 'light'} onClick={() => { setThemeMode('light'); }} />
            {/* TDW_09 R-U19: the third theme row is DELETED with its theme. Two rows
                remain — Dark (Graphite) and Light (Editorial Paper), Addendum A's two. */}

            {/* ACTIONS section */}
            <SectionLabel isLight={isLight}>Actions</SectionLabel>
            {/* ── TDW_09 MICRO-2 · F-09.75 · FORK 5 = (a), FOUNDER-RULED — THE ROW IS DEAD ──
                A `Request Invite · For a client` row stood here. It opened
                wa.me/917982159047 with an invite prefill — THE SAME NUMBER the row
                below opens with "Hi". A duplicate door, and its noun was the
                vocabulary of the invite/waitlist ceremony that dream-os retired whole
                (`src/api/waitlist.js` deleted; see docs/TDW_09_MICRO_HANDOVER.md, L1).
                Removed by ruling, not by cleanup: accounted REMOVED-BY-RULING in this
                sitting's control inventory. Its handler `requestInvite()` went
                caller-zero in the same edit and was deleted with it — an orphaned
                handler is an orphaned require, only quieter.
                THE ROW BELOW IS THE SURVIVING DOOR and is byte-untouched. */}
            <DItem glyph="◎" label="DreamAi on WhatsApp" subtitle="Chat with us" isLight={isLight} onClick={() => window.open('https://wa.me/917982159047?text=Hi', '_blank')} accent />
            <DItem glyph="→" label="Sign Out" isLight={isLight} onClick={signOut} danger last />
          </div>
        </div>
        </>
      </div>

      {/* Brass under-rule */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 0,
        height: '0.5px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </header>

    {tipsOpen && <TipsCarousel onClose={() => setTipsOpen(false)} />}
    </>
  );
}

function SectionLabel({ children, isLight }: { children: React.ReactNode; isLight: boolean }) {
  return (
    <div style={{
      padding: '14px 20px 6px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 8,
        letterSpacing: '0.5em', textTransform: 'uppercase',
        color: 'var(--atelier-label)',
      }}>{children}</span>
      <span style={{ flex: 1, height: '0.5px', background: isLight ? 'rgba(44,31,20,0.15)' : 'rgba(201,168,76,0.18)' }} />
    </div>
  );
}

function DItem({ glyph, label, subtitle, onClick, danger, accent, last, isLight }: {
  glyph: string; label: string; subtitle?: string; onClick: () => void;
  danger?: boolean; accent?: boolean; last?: boolean; isLight: boolean;
}) {
  const [hov, setHov] = useState(false);
  const baseInk = isLight ? '#2C1F14' : 'var(--atelier-ink)';
  const color = danger ? 'var(--role-critical)' : accent ? (isLight ? '#7A3828' : 'var(--atelier-label)') : baseInk;
  const glyphColor = danger ? 'var(--role-critical)' : isLight ? '#7A3828' : 'var(--atelier-label)';
  const hoverBg = isLight ? 'rgba(44,31,20,0.04)' : 'var(--atelier-row-hover)';
  const subtitleColor = isLight ? 'rgba(44,31,20,0.4)' : 'rgba(240,230,210,0.4)';

  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '11px 20px',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        background: hov ? hoverBg : 'transparent',
        transition: `background 150ms ${EASE}`,
        marginBottom: last ? 6 : 0,
        marginTop: last ? 2 : 0,
      }}>
      <span style={{
        flexShrink: 0, width: 22, textAlign: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 16,
        color: glyphColor, lineHeight: 1,
        textShadow: hov ? '0 0 8px rgba(224,188,110,0.3)' : 'none',
        transition: `text-shadow 150ms ${EASE}`,
      }}>{glyph}</span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 16,
          color, letterSpacing: '0.005em', lineHeight: 1.15,
        }}>{label}</span>
        {subtitle && (
          <span style={{
            fontFamily: F.script, fontWeight: 300,
            fontSize: 16, lineHeight: 1.5, color: subtitleColor, marginTop: 1,
            letterSpacing: '0.01em',
          }}>{subtitle}</span>
        )}
      </span>
    </button>
  );
}
