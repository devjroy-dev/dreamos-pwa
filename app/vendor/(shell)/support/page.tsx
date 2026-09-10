"use client";
// app/w/support/page.tsx — BUSINESS SOLUTIONS, THE ROOM INDEX (R-19.2).
//
// ═══════════════════════════════════════════════════════════════════════════
// WHAT THIS PAGE WAS, AND WHAT SURVIVED THE TAKEOVER
// ═══════════════════════════════════════════════════════════════════════════
// It was the coming-soon sheet (R-37.66/.67 arm c′) — one sentence and a button
// that reached a human on WhatsApp. R-19.2 makes it the index of six surfaces.
//
// THE WHATSAPP LINE SURVIVES, AS THE FOOTER. Ruled at CE-38 relay #1 item 6, and
// the reasoning is worth keeping at the site: displacing it would have traded
// the one row on this page that reaches a person for six rows that all read
// `Coming`. It consumes `COPY.supportAction` UNCHANGED (the footer body shrank to
// the ruled one-liner at the founder walk — see the footer block below)
// from `lib/worklist/copy.ts` — read, never edited, because that file is the
// M-FINISH S2 seat's (kickoff §2). No string is orphaned and no relay was needed.
//
// THE NUMBER IS STILL NEVER INLINE. `supportWaNumber()` remains the declared
// home. F-09.190 counts six homes for that number already; this makes no seventh.
//
// THE TITLE IS UNCHANGED. `rooms.ts:62` already labels this room `Business
// Solutions` and `copy.ts` already reads `supportTitle: 'Business Solutions'`,
// so the tile, the shell title and this page agreed before it was written.
//
// ── R-38.2 · THE FRAME RENDERS FIRST ───────────────────────────────────────
// The six rows render IMMEDIATELY, with their `coming` chips, before any fetch
// resolves. `GET /solutions` then supplies each row's real state. A vendor never
// sees a spinner where her rooms should be, and if the call fails she sees the
// six rows plus a sentence — not an empty page. Billing paid for this lesson;
// this page inherits it.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { COPY as WL } from '@/lib/worklist/copy';
import { supportWaNumber } from '@/lib/waNumbers';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROOM_ROWS, type RoomKey } from '@/lib/solutions/copy';
import { roomHref } from '@/lib/worklist/rooms';
import { WEDDING_PAGES_HREF, GOOGLE_REVIEWS_HREF, REFERRALS_HREF, PAYMENT_REMINDERS_HREF, WEBSITE_HREF, INTRODUCTIONS_HREF, POSTS_HREF, DATES_HREF, NUMBER_HREF } from '@/lib/solutions/routes';
import { RoomRow, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function SolutionsIndexPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <SolutionsIndexScreen />;
}

/**
 * EVERY ROW'S DESTINATION, KEYED BY `ROOM_ROWS`' OWN KEYS — ALL TEN.
 * Every address is read from `lib/solutions/routes.ts`; not one is a literal
 * here, because `b40` C31 matches any `/vendor…` literal reachable from a shell
 * page against a declared set and this file is reachable from all of them.
 *
 * ⚠ A TOTAL `Record<RoomKey, string>`, NOT `Partial<Record<string, string>>`.
 * R-42.12 AMENDED, S5(b): every row navigates, so the type now says so. A row
 * ruled into `ROOM_ROWS` without an entry here fails `tsc` — the destination-
 * less row is caught at the build, not on a vendor's thumb — and a key that is
 * not a row fails the same way. The `Partial` this replaced let both through
 * and rendered the first as a `Coming` row that answered nothing.
 */
const ROOM_HREFS: Record<RoomKey, string> = {
  wedding_pages: WEDDING_PAGES_HREF,
  google:        GOOGLE_REVIEWS_HREF,
  // G5.1 · R-G51.10 — the third of the nine opens. `RoomRow` renders a
  // `StateChip` on EVERY row (`href ? 'open' : 'coming'`), so this one entry is
  // the whole change: the row gains a destination and its chip flips to `Open`.
  // The key is `ROOM_ROWS`' own, not a new string.
  referrals:     REFERRALS_HREF,
  // ── R-42.16 · THE ELEVENTH ROW, AND IT COSTS NO CONSTANT. Derived at the cut,
  // not chosen: `collab` IS a registry room — `lib/worklist/rooms.ts:181`,
  // `{ id: 'collab', band: 'business', href: '/vendor/collab' }` — so its address
  // comes from `roomHref` for exactly the reason `contracts` above does.
  // `lib/solutions/routes.ts` is the home for rooms the registry does NOT own,
  // and a `COLLAB_HREF` for one it does would be a second home for one address.
  //
  // The row is LIVE, so it is absent from `PREVIEW_KEYS` below and its chip reads
  // `Open` — which on this list has meant "the thing works" since Arm C.
  collabs:       roomHref('collab'),
  // ── G3.2 · R-G32.16, AMENDED BY F-40.170 — THE FOURTH OF THE NINE, AND IT
  // COSTS NO CONSTANT EITHER. Contracts is a REGISTRY room (`rooms.ts:168`), so
  // its address comes from `roomHref` for exactly the reason `website` below
  // does: `lib/solutions/routes.ts` is the home for rooms the registry does NOT
  // own, and a constant for one it does is a second home. This row shipped with
  // `CONTRACTS_HREF` and the constant is retired in the same edit that changes
  // this line, so the two never disagree.
  contracts:     roomHref('contracts'),
  // ── G3.1 · R-G31.2 — THE FIFTH OF THE NINE OPENS, AND IT COSTS NO CONSTANT
  // `website` is R-40.1's R3, 「Your website & SEO」. Its destination is the
  // Storefront room, which is a REGISTRY room — so the address comes from
  // `roomHref('storefront')` and NOT from a `STOREFRONT_HREF` in
  // `lib/solutions/routes.ts`.
  //
  // ⚠ THAT ASYMMETRY IS DERIVED, NOT STYLISTIC. `b40` C31 builds its declared
  // set from `rooms.ts`'s own `href:` values plus LEGACY_VENDOR_LINKS plus three
  // nav seats; `/vendor/storefront` is already in it (`rooms.ts:123`). The four
  // rooms above each needed a constant because they are NOT registry rooms
  // (R-G11.12) and the constant is what gets them into that set at all. A fifth
  // constant here would be a second home for an address the registry already
  // owns — `routes.ts`'s own disease, arriving from the other direction.
  website:       WEBSITE_HREF,   // R-40.132: sitting 2's room, off the registry
  // ── G3.4 · R-G34 — THE SIXTH OF THE NINE OPENS ───────────────────────────
  // `reminders` is `ROOM_ROWS`' own key for 「Payment reminders」 (R-40.1's R5).
  // One line, as the map has promised five times: the row gains a destination
  // and `RoomRow`'s chip flips from `Coming` to `Open`. No ternary, no second
  // string, and `ROOM_ROWS`' label is untouched — it is R-40.1's byte.
  //
  // It takes a CONSTANT rather than `roomHref()` because payment reminders is
  // not a registry room: `rooms.ts` has no entry for it, so `b40` C31's declared
  // set would not contain `/vendor/payment-reminders` and the literal would be
  // unreachable-by-declaration. Same asymmetry the four above document, and the
  // same reason `website` goes the other way.
  reminders:     PAYMENT_REMINDERS_HREF,
  // ── CE-42 4a/3b · R-42.8 — THE SEVENTH ROW WITH A DESTINATION, AND IT IS
  // THE TENTH ROW OF THE LIST. One line, no ternary, no second string, and
  // `RoomRow`'s chip flips from `Coming` to `Open` off the presence of an href
  // alone. A CONSTANT rather than `roomHref()`: introductions is not a registry
  // room, so `b40` C31's declared set would not contain `/vendor/introductions`
  // and the address would be unreachable-by-declaration — the same asymmetry
  // `website` documents from the other direction.
  introductions: INTRODUCTIONS_HREF,
  // ── CE-42 4b-1 · R6 · ruling 1(a) — `posts` ("Posts & ads", R-40.1's own row)
  // gains its destination; the chip flips Coming → Open off the href alone. A
  // CONSTANT for the same not-a-registry-room reason as introductions above.
  posts:         POSTS_HREF,
  // ── CE-42 · SHELL · R-42.12 AMENDED — THE LAST TWO ROWS GAIN SCREENS ──────
  // Shell screens: what the capability is, and the one act that says
  // `Launching soon.` on tap. Constants for the not-a-registry-room reason the
  // five above give. Their chips stay `Coming` through `PREVIEW_KEYS` below.
  dates:         DATES_HREF,
  number:        NUMBER_HREF,
};

/**
 * THE ROWS WHOSE SCREEN CANNOT ACT YET — R-42.12 AMENDED, S4(c).
 * Each opens a screen (`ROOM_HREFS` above) whose one control says `Launching
 * soon.`; the chip on its hub row reads `Coming` (register §1a) rather than
 * `Open`, because `Open` on this list has meant "the thing works" since Arm C.
 * An entry LEAVES this set in the same edit that lands the real room — R8 for
 * `dates`, R9 for `number` — and the chip flips with it. No ninth chip.
 */
const PREVIEW_KEYS: ReadonlySet<RoomKey> = new Set<RoomKey>(['dates', 'number']);

function SolutionsIndexScreen() {
  // ── R-40.23 · THE NINE REPLACE THE SIX, AND THE FETCH RETIRES WITH THEM ────
  // This screen used to hold `rows`, `err` and a `fetchIndex()` effect, because
  // six surfaces each had a live status behind `GET /solutions`. Exactly one of
  // the nine is built, and its row has no status to report — it either opens or
  // the app is broken. So there is no state, no effect and no error branch here:
  // R-38.2's lesson (the frame renders first, never a spinner where her rooms
  // should be) is honoured by having nothing to wait for at all.
  //
  // `fetchIndex` retires with this, its only caller (R-G11.18). The dream-os
  // door `GET /api/v2/vendor/solutions` is NOT deleted — F-40.28: eight routes,
  // three files, one GREEN bench reader and one comment reference, so
  // R-G11.18's removal condition fails. It has zero product readers now, and
  // that is filed rather than acted on.
  //
  // `COPY.indexUnavailable` is KEPT in its home and consumed by nothing here —
  // there is no fetch to fail. It is not deleted because it is the S2 seat's
  // string and other surfaces still read the file.
  return (
    <WorklistShell title={WL.supportTitle}>
      <p className="sol-eyebrow" style={{ paddingTop: 14 }}>{COPY.indexEyebrow}</p>
      <nav className="sol-rows">
        {ROOM_ROWS.map((r) => (
          <RoomRow
            key={r.key}
            label={r.label}
            // ── R-42.12 AMENDED · EVERY ROW IS A DOOR ──────────────────────
            // The href is never undefined now: `ROOM_HREFS` is total over
            // `RoomKey`. What the chip says is `PREVIEW_KEYS`' decision, not the
            // href's — `Open` in the accent ink for a row whose room works (the
            // founder's walk of 2026-09-05, Arm C: beside quiet rows the working
            // one must not read as a heading), `Coming` for a row whose screen
            // cannot act yet.
            //
            // ⚠ A MAP, NOT A GROWING TERNARY — still. A new room opens by one
            // line in `ROOM_HREFS`; a preview becomes a room by one entry
            // leaving `PREVIEW_KEYS`. Neither edit touches this element.
            href={ROOM_HREFS[r.key]}
            preview={PREVIEW_KEYS.has(r.key)}
          />
        ))}
      </nav>

      {/* The one row that reaches a human. Strings from their own home.
          ⚠ THE CLASS IS `wl-supportaction`, NOT `sol-btn`, AND THAT IS DELIBERATE.
          The first cut renamed it — gratuitously, since this is the same button
          doing the same job in the same place — and `b40` C10 went RED: its tap-
          target census at `scripts/b40_worklist_shell_bench.js:162` maps
          `app/w/support/page.tsx` to exactly this class, and the rule vanished
          from under it. The button is the worklist's support action, not a
          solutions button, so its name was right and the rename was the error.
          Cured here rather than relayed: an S2 census that correctly tracks a
          live element should not be edited to accommodate a rename that bought
          nothing. Its rule is carried below, ≥44px, where the census can see it. */}
      <div className="sol-footer">
        {/* ── DESK NOTE · THE FOOTER SHRINKS TO THE RULED ONE-LINER ──────────
            Was `WL.supportBody`, a four-line paragraph about SEO, ads and
            campaign pages — written when this room WAS the offer. The six rows
            above now say all of that, so the paragraph repeated the page back to
            itself and pushed the one control that reaches a human below the fold.

            The ruled line is `Something broken? Message us on WhatsApp.` and it
            renders as exactly that: THE TAIL OF THE SENTENCE IS THE BUTTON.
            `WL.supportAction` already reads `Message us on WhatsApp`, so those
            four words keep their one home in the S2 seat's file and this seat
            adds only the three that are new.

            ⚠ `WL.supportBody` is now unreferenced — an orphan in
            `lib/worklist/copy.ts`, which is S2's. Reported, not touched. */}
        <p className="sol-footerbody">{COPY.footerLine}</p>
        <button
          type="button"
          className="wl-supportaction"
          onClick={() => window.open(
            `https://wa.me/${supportWaNumber()}?text=${encodeURIComponent('Hi')}`,
            '_blank', 'noopener',
          )}
        >
          {WL.supportAction}
        </button>
      </div>
      <SolutionsStyles />
      <style>{`
/* Carried from the surface this page replaced, byte-for-byte in its properties.
   R-38.5: the column owns the gutter — vertical only, no horizontal inset. */
.wl-supportaction{background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.wl-supportaction:active{background:var(--atelier-row-hover)}
.wl-supportaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
      `}</style>
    </WorklistShell>
  );
}
