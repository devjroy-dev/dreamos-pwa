# repo: dreamos-pwa · base 0bebae2fd327 · CE-47 · PTN-A1 app half · handover

What it is: the partner pages (sign-up and sign-in as partners' own kind, the partner area with Settings, the public
partner page, the request link page), the admin's Partners, Contacts and Forward a request (by hand only), and the
"Partner with The Dream Wedding" link under the main page's entry. It talks to dream-os PTN-A1 server (live at bf1fc4d).

New: lib/partner/{words,api}.ts; components/partner/{ExtLink,PartnerShell,OrgForm}.tsx; app/partner/page.tsx,
app/partner/join/page.tsx, app/partner/p/[handle]/page.tsx, app/request/[token]/page.tsx; app/admin/partners/page.tsx,
app/admin/partners/contacts/page.tsx, app/admin/partners/forward/page.tsx; app/admin/_components/{ContactRow,PartnerLinks}.tsx;
scripts/b291_ptn_a1_app_bench.js.
Edited: app/(landing)/page.tsx (one entry line), app/admin/_components/adminNav.ts (the Partners group, three LIVE rows).
Amended BY LABEL: scripts/b20_a4_otpsignup_pwa.proof.mjs (census 34 -> 35, anchors 3 -> 4), scripts/b72_r4210_plan_entry_bench.js
(the style pair named 3 times, anchors 4, census 35, the b20_a4 pins), scripts/tdw10_p1_shell.proof.mjs (disk 38 -> 41,
rows 41 -> 44, LIVE 22 -> 25).

Rulings carried: every handle and website is an anchor (https, new tab, noopener noreferrer); a Stopped contact draws no
WhatsApp and no Call (its links stay); "Just me" opens "Launching soon" until /collab/join lives; About stays a redirect and
/partner/join is the section (the chair, 6 Oct 2026).

Shared file: adminNav.ts is also written by CLB-1's app half (app train 2, ahead of this). This cut is on 0bebae2f; the seat
re-cuts adminNav.ts on CLB's tip when it lands.

Proofs in the seat's container: tsc 0; next build --webpack compiled (a build-only font stand-in, never shipped); b291 41/0
light and dark, --mutate (Stopped row given its phone) reddens 4.1 and restores; RED at base (absent). Differential, each
bench ALONE on base and on cut, 44 radius benches: identical exit and counts on 41; three moved and are amended by label
(b72, tdw10_p1_shell), plus b20_a4; b172 is 31/1 on both sides with the same red (2.0, its next dev did not answer in this
container), run alone in a 900-second window on each side.

## WALK CARD · PTN-A1 (server and app) · held for WALK-1 (filed by the chair, 6 Oct 2026)

Use 9888294440 (DEV440's vendor number; a vendor number may also sign in as a partner, separately). Never 8595356978.
Already on: PARTNER_SESSION_SECRET in Railway; 0216 and 0217 run. Your own Instagram @_devroy__ is the test contact.

1. thedreamwedding.in signed out: under "Not ready to sign up? Tell us what you need →" see "An agency, brand or planner? Partner with The Dream Wedding →". Failed if missing or it does not open the sign-up.
2. Tap it: "Who is signing up?", "Signing up is free. Your first 3 connections are free. After that it is Rs 2,999 a month.", "An organisation", "Just me".
3. "Just me": "Launching soon". Back. Failed if anything else opens.
4. "An organisation": name Walk Test, phone +919888294440, "Send code on WhatsApp": a 6-digit code arrives from TDW's vendor number.
5. Type it, Continue: "Your organisation".
6. Walk Test Agency, Model agency, handle tdw.walk.agency, website tdwwalk.in, Delhi NCR, Save: the area with "NOT YET CHECKED BY TDW", "Calls for you", and the line "Calls come to you, not to your people...".
7. Settings, handle "walk test": refused with "Write the Instagram handle only, for example modelconnect.in". Put it back.
8. Settings: handle and website as links, the partner page address, Calls choice, you as owner.
9. Tap the handle: Instagram opens in a new tab. Failed if plain text or same tab.
10. The partner page: name, "NOT YET CHECKED BY TDW", kind and city, links, the fee line. Failed if any phone or email shows.
11. Sign out; sign in with the same number: the area opens; the name is not asked.
12. Admin, More > Partners: Walk Test Agency under "Not yet checked", links under the row.
13. Its sheet: owner with WhatsApp and Call, "Connections: 0 of 3 free used. Plan: none yet. After the 3rd, Rs 2,999 a month.", Mark as checked, Exempt from the plan, Block with a reason.
14. Exempt: "Connections: 0. Exempt from the plan." Then "Remove the exemption".
15. Mark as checked: moves to Checked; the partner page now says "CHECKED BY TDW".
16. Contacts, + Add contact: Walk contact, Other, _devroy__, no phone, "Walk test": saved with the handle as a link. With "How we know them" empty: "Write how we know them."
17. Forward a request: her handle walk.vendor.test, phone +919888294440, model, Delhi NCR, a date ahead, 3000 to 5000, Paid, Walk contact ticked, "She asked for this" NOT ticked: "Tick "She asked for this" first."
18. Tick it, make the messages, open Walk contact: the message ending "See the request and answer here: https://thedreamwedding.in/request/<code>", Copy message, Open on Instagram, Open on Threads, "I sent it".
19. Copy; Open on Instagram opens @_devroy__ in a new tab (send nothing); tick "I sent it": the row reads "Sent".
20. The link in a private tab: the request with her Instagram as a link, the two answer choices, and the phone line. Failed if any phone number shows.
21. Admin: Block Walk Test Agency with "Walk test, removed": Blocked; the partner page reads "This page does not exist."; the area reads "This partner account is blocked. Write to partners@thedreamwedding.in.".
22. Leave it Blocked (the clean-up). Not walked here: a Stopped contact (b291 §4), and everything in PTN-A2.
