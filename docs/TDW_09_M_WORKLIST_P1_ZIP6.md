# ZIP 6 — R-37.75, ROOMS-FIRST · ONE APP, ONE NAV

**Applied over `8e03fb9`. Floor: seventeen cells, exit 0. `npx tsc --noEmit`: exit 0.**

---

## §1 · ROOMS-FIRST, FOUR SURFACES IN ONE STROKE

| surface | before | after |
|---|---|---|
| `worklist-manifest.json` `start_url` | `/w` | **`/w/rooms`** |
| the Today route | `/w` | **`/w/today`** |
| the bare shell `/w` | *was Today* | **redirects to `/w/rooms`** |
| shell seat order | Today · Rooms | **Rooms · Today** |
| the carried `BottomNav` | five doors | **Rooms · Today** (§3) |

`/w` still exists and still resolves, deliberately. The manifest never routes through it, but a
typed URL, a shared link, a stale bookmark and the service worker's navigation fallback all do.
An app that opens on the directory from its icon and on the placeholder from a link is an app
arguing with itself.

**C17 asserts all five together.** A cell that checked one surface would have gone green while
the app disagreed with itself, which is the failure this ruling exists to prevent.

## §2 · WHAT ROOMS-FIRST BREAKS — DERIVED, AND CURED

**The break is real, not cosmetic.** The first-run manual lives on Today. Under Rooms-first a
brand-new vendor lands on the grid and may never tap the second seat — so the manual that
R-37.68-A ruled would teach him stops being met. The manual's whole design is that it deletes
itself once he has data, which assumes he sees it first.

**The chair proposed a pointer from an empty-badges grid. That is not derivable in Phase 1:**
badges are Phase 4's, so gating the pointer on "empty badges" would be gating on a signal that
has not shipped — a condition that is always true is not a condition, and writing it as one
would read like state logic while being none.

**Cheapest arm that is true today: an unconditional pointer under the grid.** Phase 4 makes it
conditional on the same `has_any` flag that retires the manual, and the two disappear together.

**A NEW VENDOR-FACING BYTE, needing veto:**
- 「New here? Today has a short guide to what TDW does for you.」
- action: 「Read it」

R-37.72's register holds — TDW, never "the app". C14 covers it.

## §3 · ONE APP, ONE NAV — THE VERDICT TABLE

The arm was never opened with this seat before now, so it is **derived here, not reported
closed**. The old `BottomNav` carried five doors. Every job each door reached already has a
named home in the worklist, so nothing is lost by replacing the bar:

| old door | href | its job's home now | verdict |
|---|---|---|---|
| Home | `/vendor` | the DreamAi dock — a work surface, not a destination (R-37.69) | CARRIED-to-dock |
| Calendar | `/vendor/calendar` | the Calendar room, top band, a default pin (§8.2) | CARRIED-to-tile |
| Business | `/vendor/list` | the six slice rooms, top band (R-37.60) | CARRIED-to-tile ×6 |
| Storefront | `/vendor/storefront` | the Storefront room, bottom band | CARRIED-to-tile |
| More | `/vendor/more` | retired (R-37.63 ④); its rows are the bottom band | RETIRED-by-ruling |

**Five direct nav references, five named destinations, zero orphans.** The carried tree's
`BottomNav` now renders Rooms · Today, matching the shell exactly, so **a deep room reaches
Rooms in one tap** and a vendor never meets two navigations in one app. Branch-only; `main`
keeps its five doors.

## §4 · CELLS AND THEIR PROOFS

**C17** — five arms, each proved RED on its own mutation:

| arm | mutation | it said |
|---|---|---|
| manifest | `start_url` → `/w/today` | *manifest start_url is /w/today, expected /w/rooms* |
| redirect | `/w` → `/w/today` | *the bare /w shell does not resolve to Rooms* |
| seat order | seats swapped back | *seat order is navToday,navRooms* |
| carried nav | `Rooms` → `Home` | *the carried nav still reads Home,Today — one app, one nav* |
| pointer | `<Pointer />` unmounted | *the pointer is defined but never mounted* |

**THE POINTER ARM WAS VACUOUS ON ITS FIRST RUN AND IS DISCLOSED, NOT QUIETLY FIXED.** It checked
only that `COPY.roomsPointer` appeared somewhere in the file. Unmounting `<Pointer />` left it
GREEN — the component still referenced the byte while rendering nothing. Caught on its own
mutation, tightened to assert the mount, re-proved RED. This is the second vacuous arm this arc
has caught by mutation rather than by inspection; both were mine.

**C2 amends by label** to name the flipped seats. The freeze law now protects the new order —
C17 owns the seats, C2 owns the sixteen tiles. Amended, not loosened.

## §5 · STILL OPEN

- **Touch in the carried rooms** — C10's floor holds across the worklist shell only. Extending
  it into `/vendor/**` is unruled.
- **The 503** — one console line from the founder's handset still settles it (ZIP 3 §13).
- **Phase 7** — the branch's whole colour and nav divergence becomes real at cutover, for ~22
  paying vendors. Its own word at that seam.

---
---

# THE COMBINED WALK — ZIP 5 + ZIP 6, ONE SITTING

**Founder's real handset. Emulator disqualified. Account `9888294440`.**
**Administered live, one beat at a time. Each beat's claim is labelled with the ZIP it convicts.**

**Read before beat 0:** the branch PWA is a second front door onto the live house — production
backend, real writes behind the deep-links.

**No write path in this walk.** Every beat is a read or a navigation, so no write-before-UI
ordering is needed. If a beat tempts you to save something, stop and say so instead.

**Service worker:** `public/sw.js` is byte-unchanged this arc — last touched at `a534329`,
before the branch was minted. So no clear-site-data step is required for SW reasons. A
**hard reload** is still needed so the new bundle is fetched.

**One fixture re-derived at authoring time, not carried:** beat 6 depends on your
`routing_handle`. It read `DEV440` in your settings screenshot at 04:06 today, but that is a
screenshot and not a derivation — **beat 6 tells you what to expect for both states** and either
is a pass. Your lead list has also moved this week, so no beat asserts a count.

---

**Beat 0 · setup.** Wait for the deployment of this push to read Ready in Vercel. Then hard-reload
the branch domain on your phone. *No claim — setup only.*

**Beat 1 · [ZIP 6] the bare shell resolves to Rooms.** Open
`…vercel.app/w` — with no path after `/w`. **Expect: the sixteen-tile grid, not Today.**

**Beat 2 · [ZIP 6] the seats read Rooms then Today.** Look at the bottom bar.
**Expect: Rooms on the left and lit, Today on the right.**

**Beat 3 · [ZIP 6] the home-screen launch opens the grid.** Delete the old home-screen icon,
re-add from the branch domain, then launch from the icon.
**Expect: the grid, not Today.** This is the manifest's `start_url`, and it is the one thing no
in-browser test can prove.

**Beat 4 · [ZIP 6] a new vendor still meets the manual.** Scroll to the bottom of the grid.
**Expect: 「New here? Today has a short guide to what TDW does for you.」 with a 「Read it」 button.**
Tap it. **Expect: Today.**

**Beat 5 · [ZIP 4] the expanded first-run manual.** You are now on Today.
**Expect, in this order:** the promise line 「Once your work starts flowing, Today becomes your
morning brief…」, then 「What TDW does for you」, then five cards — enquiry desk, your TDW link,
run it all from WhatsApp, every part of your business has a room, ask us for more. **Five chips**
under the WhatsApp card, not four.

**Beat 6 · [ZIP 4] card 1 obeys its gate.** Look for 「Your TDW link」.
- If your `routing_handle` is set — **expect the card present**, second in the list.
- If it is unset — **expect the card absent entirely**, and that is the correct behaviour, not a
  bug. Say which you see; either is a pass, and it re-derives the fixture for the next card.

**Beat 7 · [ZIP 6] one app, one nav — from depth.** Tap Rooms, then any bottom-band tile —
Contracts or TDS. You are now inside the carried tree. **Expect: the same two seats, Rooms and
Today. Not five doors.** Tap Rooms. **Expect: the grid, in one tap.**

**Beat 8 · [ZIP 5] the split reads as one system — proof point 1, the highest-traffic room.**
Rooms → Leads. **Expect: the search field's caret and the filter chips in teal; the ‹ LEADS
back-label and the NEW / CONTACTED state marks still gold.**

**Beat 9 · [ZIP 5] proof point 2 — buttons.** Rooms → Portfolio.
**Expect: 「+ UPLOAD」, 「SEE YOUR PROFILE AS COUPLES DO」 and 「CONNECT INSTAGRAM」 in teal; the
「IMPORT FROM INSTAGRAM」 section header still gold.**

**Beat 10 · [ZIP 5] proof point 3 — the FAB and an active state.** Rooms → Events.
**Expect: the + button teal, the active chip's underline teal, the 「UPCOMING」 mark still gold.**

**Beat 11 · [both] the 503, finally named.** Back on `/w/rooms`, open the console and run:

```
performance.getEntriesByType('resource').filter(e => e.responseStatus >= 400)
  .map(e => e.name + '  ->  ' + e.responseStatus)
```

Paste whatever it prints, including an empty array. *No claim — this closes an open finding.*

---

**A red at any beat convicts the ZIP named in its label, not the pair.**
