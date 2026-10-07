# TDW · CE-47 · HUB-2 APP · Collab Hub in the vendor app · handover

Seat: CLB. Repo: dreamos-pwa. Base: 239fffb (app train 3's tip). Built on a32fbf4e and laid on 239fffb unchanged: none of this package's paths moved in train 3, and screen.tsx is the same at both, so CollabRoomBefore.tsx is byte-equal to 239fffb's screen.tsx too. The server it reads is live: HUB2_SRV_2 (train 9, a1c44e9) carries hub_open, the my-people doors, waiting, waiting_count, shoot_requests_left and the names on Mine.

## Rule 1: two rooms at one address (the chair's ruling (a), 7 Oct 2026)
The new room shows only to a vendor the server calls open: `GET /hub/me` gives `hub_open: true` when she is on clb.testers, or for everyone once admin_config clb.hub is on. **Every other vendor sees today's room, unchanged**: My posts | Opportunities | Roster, "+ Add someone", the same words and the same "?" card. That room is `CollabRoomBefore.tsx`, which is a32fbf4e's `screen.tsx` moved byte for byte; block 1 proves it with `cmp` against the base. If the answer cannot be read (a 500, not JSON, no network), she gets today's room. Nothing is drawn until the answer arrives, so she never sees one room flip into the other. The switch lines are in the HUB-2 SERVER handover.

## What an open vendor sees, in plain words
- The Collab room has three tabs: **Work | People | Mine**. It opens on Work (the chair's ruling, 7 Oct 2026, the order of the approved pictures). Mine shows a count ("Mine · 2") when something waits for her answer: a shoot someone asks her to confirm, or someone interested in one of her open calls.
- **Work**: open calls for her craft in her city, newest first. "All cities" widens the city, never the craft. Each call shows who posted it, with their page, Instagram and website as links, and an "I am interested" button. A call she already answered leaves Work. The tab says in words what is not in yet: briefs from brands, paid jobs from planners, From Threads.
- **People**: everyone on Collab Hub, with chips for My people, a role, her city and a pay kind. A chosen chip is filled (veto 54). "Add to my people" shows only on a vendor. A person or an organisation shows the line "Joins your people only after a shoot you did together, and only when they say yes." With My people on, each card says why it is there, and requests still waiting for a yes are shown apart, never counted. "Take off my people" is a quiet button, shown only on a vendor she added herself.
- **Mine**: her calls (a tap opens the replies; "Mark filled" on an open one, as My posts had), the calls she said she is interested in, requests waiting for her yes (Yes / No), and "Worked with", where every name is a link to that person's page. "+ A shoot we did together" opens the sheet.
- **The shoot sheet**: name, city, month, and who worked on it (search by name or Instagram). It shows how many requests are left: "You can send 20 of these requests in any 30 days. N left now." The approved picture's "18 left in October" is retired, because the server counts any 30 days, not a calendar month. "Remove" is a quiet button. The picture's line "They can join free at thedreamwedding.in/collab/join" is left off until HUB-3, so nothing links to a page that does not exist yet.
- **The public page** `thedreamwedding.in/c/<handle>`, signed out, outside the app: name, roles, city, Instagram and website links, "Open to", up to 12 photos, and "Worked with", with every name a link. Then the server's own closing line. No phone, no email, no check label. A miss is one neutral sentence with no status code shown (F-19.19's rule). Search engines are told not to index it, for every kind of owner, until HUB-3 (the chair has put the question to the founder).
- **No check mark anywhere.** Nothing sets hub_profiles.check_state, and no written rule says what would be checked. (The founder's words for a mark, 7 Oct 2026, are "Verified" and "Unverified"; the Hub shows neither.)
- The call form's chosen chip (Paid / Unpaid / Credit only, the roles) is now filled with the primary too (F-44.367).
- The room's "?" card is **unchanged**. One address has one card, and until the switch is on most vendors see today's room. So the card stays true for them, and it still names New post, which both rooms draw. The card for the Hub ships with the switch, as its own small change. pageHelp.ts is therefore not in this package, so it does not collide with app train 3.

## My people · the ruling (CE-47, 7 Oct 2026)
A vendor adds another vendor directly (vendor_roster). An organisation or a person joins My people only through a credit they answered yes to. Nobody outside the vendor pool appears on a list without having agreed.

## The Roster tab leaves
The Roster tab and its "+ Add someone" (name and phone) are gone from the room. **Old roster rows are kept in the table, not shown, never deleted by this package.** Crew pages and the overflow exchange still read them. The founder was told in plain words by the chair.

## Files
- CHANGED `v2/app/vendor/(shell)/collab/screen.tsx`: the Rule 1 gate (it reads hub_open and draws the Hub or today's room, failing closed). The Hub's room is Work | People | Mine (TAB_ORDER), opening on Work, with Mine's count and "+ New post" as the one pill.
- ADDED `v2/components/vendor/hub/CollabRoomBefore.tsx`: today's room, a32fbf4e's screen.tsx byte for byte (it still exports CollabScreen; the new screen imports it as CollabRoomBefore).
- CHANGED `v2/lib/worklist/collabRoom.ts`: the Hub's words added (work, people, mine, mineWaiting). Today's words (addSomeone, myPostsOpen, opportunities, roster) stay byte for byte, because today's room reads them.
- CHANGED `v2/components/vendor/CollabPostForm.tsx`: `.cp-chip.on` filled with the primary (F-44.367, veto 54). No other change.
- ADDED `v2/lib/vendor/hub.ts`: the doors, the shapes, linkProps (https only, a new tab, no opener, no referrer), and every word.
- ADDED `v2/components/vendor/hub/HubWork.tsx`, `HubPeople.tsx`, `HubMine.tsx`, `ShootTogetherSheet.tsx`.
- ADDED `app/c/[handle]/page.tsx`: the public page.
- CHANGED `scripts/b40_worklist_shell_bench_v2.js`: **amended by label**, cell **C40** only, now for **both rooms**. The Hub (screen.tsx) is work, people, mine; today's room (CollabRoomBefore.tsx) keeps F-38.62's my_posts, opportunities, roster. Each keeps the cell's shape: one declared order, landing = TAB_ORDER[0], the render walks it.
- CHANGED `scripts/b190_fe6_collab_room_bench.js`: **amended by label, both rooms.**
  - §1, an open vendor: cells 1.0 to 1.8 hold the Hub, and they wait on conditions, never fixed pauses (e-275).
  - §1b, a closed vendor: **a32fbf4e's own cells 1.0 to 1.8, verbatim, as 1b.0 to 1b.8**, plus **1b.9**: she never sees Work | People | Mine.
  - §1c: an unreadable hub_open (a 500, not JSON) draws today's room (**1c.1**).
  - §1d (the chair's lesson 2): every Hub door answers a thin `{ ok: true }` with no lists, and Work, People and Mine each still draw, with nothing crashing (**1d.1**; mutation **N4**, Work trusting the answer, reds it).
  - Mutations: N1 to N3 for the Hub (the count, the capitals, "Add" on a person). B1 to B3 are a32fbf4e's own M1 to M3, aimed at CollabRoomBefore.tsx and reddening 1b.1, 1b.2 and 1b.7. G1 shows the Hub without hub_open (reds 1b.0); G2 opens the Hub on an unreadable answer (reds 1c.1).
  - Cells 2.1, 7.9 and 8.1 keep their checks.
  - A mutation now counts only when it reddens the cell it names (before, a red anywhere, such as the load cell, counted as the named one).
- ADDED `scripts/b285_hub2_app_bench.js`: 29 cells + 9 mutations. It covers links, no label, My people, veto 54 and the quiet button, the tabs, **the Rule 1 gate (5b.1 to 5b.3, M8, M9)**, the words, the unchanged "?" card, the guard on every list a door sends, and the public page.
- ADDED `scripts/floor-manifest-ce47-hub2-app.txt`, this handover.
- Read, not changed: `middleware.ts`. On the main host decide() returns null, so /c/<handle> passes untouched.

## Proof (on 239fffb, app train 3's tip; each run its own log)
- b285 38/0 (29 cells, 9 mutations). It ran 20 times under load (b59_v2 and ce41_e2i looping); the ledger is docs/handovers/b285_ledger_HUB2APP.txt.
- b190 (amended) 34/0 with --mutate. §1 is the Hub; §1b is a closed vendor (a32fbf4e's own cells, verbatim); §1c is an unreadable hub_open; §1d is a thin answer. N1 to N4, B1 to B3, G1 and G2 each red the cell they name.
- b281 28/0, as a closed vendor (its stub's bare /hub/me answer is closed).
- tsc --noEmit clean. eslint clean on every new and changed file. The three warnings in CollabRoomBefore.tsx are 239fffb's own screen.tsx, byte for byte, which draws them on main.
- e-276 walkers, compared red by red against a clean 239fffb:
  - b40_v2: C50 and C102 red on both sides, with the list unchanged; C40 green for both rooms.
  - ce41_e2ivb: the same cell red on both sides.
  - Green: b122_v2, b126_v2, b73, d1_help_v2, the other ce41 benches, b59_v2, b177, b75.
- Every other bench that reads a path this package touches (lesson 1, by grep of scripts/):
  - b59 v1 green.
  - b40 v1: the same 2 reds as the base.
  - tdw07_p4b_body: the same 1 red as the base (its §0.4 canary).
  - tdw09_p2_doors: crashes the same way on both sides.
- b140_v2, strictly alone: the full run has only cell 3.1 red (52 rows; the real faces cannot load here, because fonts.googleapis.com is refused). Narrowed to /vendor/collab (lesson 2) it is 23/1, the 1 being 3.1.
- Thin answers (lesson 2): the Hub survives every door answering { ok: true } (b190 1d.1); today's room survives it (b281, b190 1c.1); every Hub list is read through arr() (b285 6b.1).
- No run in this pass drew zero rooms, so lesson 3's stale-cache sign never showed; no run was struck.

## Walk card · HUB-2 (vendor DEV440, 9888294440, only; never 8595356978)
**Switch on:** HUB2_SRV_2 live. Put DEV440 on clb.testers with the add-a-tester line in the server handover. Leave clb.hub off.
1. **As a non-tester first.** Before adding DEV440 to clb.testers, open More → Collab. He sees today's room exactly as before: My posts | Opportunities | Roster, the line "My posts · N open", "+ New post", and "+ Add someone" on Roster. **Failed if** Work, People or Mine shows anywhere, or anything in today's room looks different from yesterday.
2. Now add DEV440 to clb.testers and wait one minute. Open More → Collab again. He sees Work | People | Mine, and the room opens on Work. **Failed if** the room opens on another tab, or a Roster tab or "+ Add someone" shows.
3. Work. He sees his craft's calls in his city, each with the poster's page, Instagram and website as links. Tap "All cities": the chip fills and the list widens. **Failed if** a chosen chip is only outlined, a call or a card shows any check mark ("Verified", "Unverified", or the retired old words), or a link opens in the same tab.
4. People. Tap "My people": the chip fills, and each card says why it is there. Off again, find a vendor and tap "Add to my people": it changes to "In my people". **Failed if** any person or organisation card shows "Add to my people", or anyone is on My people whom he did not add and who has not said yes.
5. Mine → "+ A shoot we did together". Fill in name, city and month, find a DEV440 fixture person, and send. The line reads "You can send 20 of these requests in any 30 days. N left now." **Failed if** the fixture person shows in My people or on either page before they say yes.
6. As the fixture person, answer Yes in Mine. Back as DEV440: the person is on My people with "said yes to <shoot>, <month>", the shoot shows under Worked with with the name as a link, and Mine's count drops by one. **Failed if** a "No" puts them anywhere.
7. Open `thedreamwedding.in/c/<his handle>` signed out, in a private window. **Failed if** a phone number, an email, a check label or an unlinked handle shows, or any link opens in the same tab. Open `thedreamwedding.in/c/nobody.here`. **Failed if** it shows a number such as 404 instead of the one sentence.
8. People → "Take off my people" on the vendor he added. **Failed if** it is underlined like a link instead of a quiet button, or if any credit he gave or got disappears.
