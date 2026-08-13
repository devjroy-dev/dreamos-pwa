# FROST_BLOOMS — the room-by-room index

**Derived at `dreamos-pwa 66ea400` + TDW_13 D-5, 2026-08-13.** Every figure below
was counted by command against the tree, not written from memory. The control
counts use the sealed census's own six classes, per line, comment-stripped — the
same method `tdw09_frost_parity.proof.mjs` uses, so this document and that bench
agree by construction rather than by luck.

Rows 14 and 15 build on this map. TDW_15's contract is the parity matrix (D-6);
this is the map that tells it which room owns which door.

---

## The shape

Sanctuary is **one screen across fourteen files**.

| | |
|---|---|
| `app/(frost)/frost/canvas/sanctuary/page.tsx` | the **conductor** — 1,117 lines |
| `components/frost/blooms/*.tsx` | **eleven bloom files** — 4,048 lines |
| `components/frost/_shared/*.ts` | `usePress`, `coupleAccessToken` |

The conductor was 5,020 lines before D-4. It now holds the rail, the bloom layer,
the open/close choreography under its FROZEN header, and **Dream** — the one room
with no component of its own.

> **Any bench asking a question about Sanctuary must read the surface, not the
> path.** See `components/frost/_shared/SURFACE.md`. Read the directories; never
> hand-list the blooms.

---

## The eleven blooms

| room | file | lines | controls | data homes | write doors |
|---|---|---|---|---|---|
| **Vendors** | `vendors.tsx` | 348 | **31** | `frost/journey` · `waNumbers` · `vendor/format` | `createBooking` `updateBooking` `deleteBooking` `recordPayment` |
| **Expenses** | `expenses.tsx` | 310 | **23** | `frost/journey` · `vendor/format` · `frost-api/_base` | `deleteReceipt` `recordPayment` |
| **Muse** | `muse.tsx` | 300 | **21** | `frost-api/muse` · `frost-api/img` · `types/discover` | `deleteMuseSave` `uploadMuseImage` `createMuseSaveFromUrl` |
| **People** | `people.tsx` | 274 | **16** | `frost/journey` | `removeCircleMember` |
| **Discover** | `discover.tsx` | 957 | **14** | `frost-api/discover` · `frost-api/muse` · `frost-api/img` · `photoPager` · `budgetBands` · `tagVocabulary` | `saveVendorToMuse` |
| **Circle** | `circle.tsx` | 480 | **11** | `frost/journey` | `inviteCircleMember` `removeCircleMember` |
| **Moments** | `moments.tsx` | 283 | **10** | direct API via `coupleAccessToken` | caption save |
| **Settings** | `settings.tsx` | 264 | **8** | `frost/journey` · `waNumbers` | `saveProfile` |
| **Pages** | `pages.tsx` | 294 | **5** | direct API via `coupleAccessToken` | entry save |
| **Meridian** | `meridian.tsx` | 331 | **5** | direct API via `getAccessToken` | concierge request |
| **Events** | `events.tsx` | 218 | **1** | `frost/journey` (read-only) | — none |
| **Dream** | *in the conductor* | — | 7 (conductor) | `frost-api/couple` (`streamBrideChat`) | — none |

**Controls total 152** across the surface — unchanged since Rider 2 plus D-2's
two. The extraction moved no control between classes and minted none.

---

## What lives with what

Three blooms carry satellites rather than standing alone:

- **`discover.tsx`** also holds `DiscFilterSheet`, `DiscVendorPanel`, the two
  spawn helpers, the `DISC_*` constants, and **`BetaGate`** with its
  founder-authored bytes. FORK-γ ruled co-residence: the gate fences exactly one
  surface, and a standalone file for it invites mounting it elsewhere. The
  conductor imports `BetaGate` and owns the mount decision, because what the gate
  decides is *whether the feed mounts at all*.
- **`muse.tsx`** holds `MuseOverlay` and the three filter constant lists.
- **`circle.tsx`** holds `CircleCompose` and `ROLE_LABELS` — one of the estate's
  **two** role maps, the other being `app/coplanner/settings/page.tsx`. Two, not
  three: `tdw07_f0772_circle.proof.mjs` §15.6 keeps that closed.

---

## Dream, and why it is still in the conductor

Dream has no component. Its messages, input, loading state, streaming and cancel
handle are the page's own `useState` hooks, and its Clear button is a
conductor-level conditional in the room top bar.

Ruled **ε1**: it extracts last, in its own sitting, after the eleven proved the
pattern. **ε3 stays open** — Dream as the conductor's own room, recorded as
design — because Dream's state genuinely *is* the page's state, and that may turn
out to be the honest answer rather than a failure to finish.

---

## The choreography

Fenced in the conductor between `CHOREOGRAPHY — FROZEN (F-1)` and
`FREEZE ENDS (F-1)`. Inside: `openRoom`, `closeRoom`, `BLOOM_CLOSE_MS` and its
readers, the swipe-to-close handlers, the popstate back-trap, the
`bloom-enter`/`bloom-exit` class swap.

**No bloom carries choreography.** A room that animates its own open is a second
conductor, and the fence exists so that stays true.

The freeze landed at D-4, after D-3 gave it one shape worth freezing: until then
the close duration was a bare `300` in three unconnected places (F-13.5) and the
open triad was written twice (F-13.6). A header over that shape would have made
the fork permanent by law, because the diff that fixed it would itself have been
the failed session. **Cure first, fence second.**

---

## Known and open

- **`uid` is declared twice** — module scope in the conductor and again inside
  `MeridianRoom`, byte-identical. It travelled verbatim under F-1 rather than
  being cured on a relocation commit; filed for the chair, unnumbered.
- **The shared stripper leaks** on these files (`scripts/lib/stripComments.mjs`,
  no JSX-text awareness — an apostrophe in prose opens a phantom string). F-13.7's
  leak-guard makes the census safe against it; the stripper itself is unfixed and
  wants its own chartered micro with a census of its eight-plus readers.
- **D-6** is the parity matrix: the 25 `brideTools` capabilities × read-in-bloom /
  write-in-bloom / gap. This map's write-door column is its raw material.
