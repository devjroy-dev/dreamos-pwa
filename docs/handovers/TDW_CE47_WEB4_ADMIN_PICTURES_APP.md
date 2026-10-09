# TDW · CE-47 · WEB-4 · ADMIN PACKAGE · R-47.2, a vendor's pictures belong to her (dreamos-pwa)

Cut at dreamos-pwa `96fa4e06` (app train 8 landed), 9 October 2026. The app half of dream-os cut 30 (0223, b301).
Rung b301p. Lands in app train 9 with server train 17, WEB-8's look editor and FE-9's notices; then switch day.

## 1 What the admin sees now
- **Pictures to look at** (`/admin/approvals/photos`, the same address as "Photos to check"). Two lists, oldest first:
  - **Held by the safety check**, portfolio and look pictures in one list, each with Google's answer in words
    ("Google: Adult likely, Racy possible."). The one act is **Release**. A look picture is released with kind look.
  - **Reported by Dreamers**, with the Dreamer's reason in the founder's words (the server's `reason_line`) and her
    note. The admin closes it with **Hide from Discover** or **No change**. Hide is not offered when the picture is
    already hidden.
  - Each card links to **Open her pictures**. There is no remove button on this page.
- **A vendor's pictures** (`/admin/vendors/portfolio`, was "Upload photos for a vendor"). Each picture carries its
  state: Held, Not on Discover, Not checked yet, or On Discover. Tapping one opens its card:
  - Release, on a held picture;
  - Hide from Discover, or Show on Discover (one tap each way), on any other;
  - **Remove for a legal reason**, last on the card: the admin writes the reason (3 to 300 letters, she will see it),
    then confirms ("Yes, remove"). The server logs it first; if the log cannot be written nothing is removed, and the
    server's sentence is shown. She is told on her portfolio by the server, in the founder's words.
  - The deep link `?vendor=<id>` still preselects her (F-10.54).
  - Upload stays. A picture the admin uploads is passed at once (the server writes it).
- **Home** counts held pictures plus open reports beside "Pictures to look at". The menu says the same.

## 2 What is gone
- Approve, reject, bulk approve, and the reason box. Their doors are gone on the server (cut 30).
- Delete, Hero and Activate on the vendor's pictures. Delete's door is gone (cut 30). The admin vendor-portfolio
  router never had a PATCH door, so Hero and Activate reached nothing before this package either (finding below).
- Three dead pages, deleted, and RETIRED in the route map with their reasons:
  - `/admin/approvals` (index), which approved and rejected over `/api/v3/admin/images` (no server, F-10.84);
  - `/admin/images`, the same doors, with approve-all;
  - `/admin/photos`, approve and reject by PATCH, doors that never existed.
  The old dashboard's "Approve Images" button now opens Pictures to look at.

## 3 One home
`lib/admin-api/pictures.ts`: the six doors, the state of a picture (`pictureState`), Google's answer in words
(`scoresLine`), the legal reason's bounds (3 to 300, as the server holds them) and every admin word. `index.ts`
re-exports `getPhotoQueue` from it, so Home's import is unchanged. No founder line is typed in the app.

## 4 Proven
- **b301p**: 30 cells, 0 failed. §1 the door run for real against a stand-in `_base`; §2 the source; §3 the words;
  §4 six mutations (M1 to M6), each reddening its cell in a child run, through `mutation_guard.js`.
- **Amended by label:**
  - b172 1.23 to 1.25 (the Looks tab is now the one held list; release carries kind; no reason);
  - adm1 7.0 (the dead-page exclusions 14 to 11: approvals, photos and images are gone);
  - ce41_e2i census (the three deleted pages leave its group list);
  - tdw07_f0784 §3.5 (adopters of adminHeaders 20 to 16: three deleted, and the vendor's pictures page reaches the
    same authority through pictures.ts, which the cell now asserts);
  - tdw10_p1 shell (the route ledger: 43 to 40 on disk, 46 rows kept, PHANTOM 14 to 11, RETIRED 3 to 6).
- One colour fix of my own, caught by the census: the held badge reads the role `--role-critical`, no hex.
- **The differential and the floor:** see the card.

## 5 Findings
- **F (admin vendor portfolio):** the Hero and Activate taps called `PATCH /api/v2/admin/vendors/:id/portfolio/:id`,
  which has never existed on dream-os. They failed silently (the old code did not read the answer). Removed here.
- The Discover deck's count read "N approved"; it now reads "N on Discover", which is what the server's
  `photos_approved` counts since cut 30.

## 6 Walk (WALK-1, on DEV440 / 9888294440 only, after switch day)
1. Admin, Pictures to look at: a held picture shows Google's answer; Release it. SEE: it leaves the list, and it is
   on DEV440's website.
2. As the Dreamer (9888294440), report a picture of DEV440's on Discover. Admin: the report shows the Dreamer's reason.
   Tap Hide from Discover. SEE: gone from Discover, still on her website; her portfolio says "This picture is not
   shown on Discover."
3. Admin, A vendor's pictures, DEV440: the picture reads Not on Discover. Tap it, then Show on Discover. SEE: On
   Discover again.
4. Same page: Remove for a legal reason with no reason. SEE: it asks for 3 to 300 letters, and nothing is removed.
   Write a reason, then Yes, remove. SEE: the picture is gone; her portfolio shows the founder's legal line.
IT FAILED IF: any approve, reject or delete appears; a picture is removed without a reason; a report hides a picture
before the admin chooses.
