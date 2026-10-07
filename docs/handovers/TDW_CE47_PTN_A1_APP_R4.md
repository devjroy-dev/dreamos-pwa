# repo: dreamos-pwa · base 239fffb · CE-47 · PTN-A1 app r4 · handover

What it is: the A1 partner pages and the admin's Partners pages after PTN-A2-1 server (dream-os, server train 11): the
partner mark in the founder's words, the mark drawn only when the server sends it, R-46.17's copy boxes, and every PTN
page made to survive a thin answer. No new page, no new door, no new folder.

THE MARK (the founder's words, 7 Oct 2026): "Verified" / "Unverified", never "Checked by TDW" or "Not yet checked by TDW".
- The words come from the server's check_words. A2-1 sends them only while admin_config 'partners.check_label' is on;
  otherwise it sends null.
- components/partner/Mark.tsx (new): null, empty or missing draws NOTHING, not an empty tag (the chair, 7 Oct 2026).
  With words it draws the mark as a 44px target; a tap opens two lines, what it means and what it does not:
  "Verified means TDW has seen that the organisation is real: its own website or Instagram, and a call with a named
  person there." / "It does not mean TDW vouches for its work, its fees or its people." These are the rule's lines 1 and
  2, which are with the founder; they live in lib/partner/words.ts (markMeans, markNot) and change in one place if he
  words them otherwise. Nobody sees them until he rules and the switch is on.
- The public partner page (app/partner/p/[handle]) and the partner's own area (app/partner) draw <Mark>; the two px-tags
  that printed {check_words} are gone.
- Admin, More > Partners: the tabs read Unverified, Verified, Blocked, Reports; a row's tag reads Verified or Unverified;
  the sheet's button reads "Mark as verified". The admin always sees the state, whatever the switch.
- The partner sign-up line no longer promises a mark ("This shows on your partner page.").

R-46.17 (text given to copy sits in its own box, CopyBox, nothing else inside):
- Admin, Forward a request, each person's sheet: the message sits in a CopyBox with "Copy message"; the loose note and
  the separate copy button are gone. Open on Instagram, Open on Threads and "I sent it" stay outside it.
- The partner's Settings: "Your partner page", then thedreamwedding.in/partner/p/<handle> in a CopyBox (the clipboard gets
  the https address), and "Open your partner page" beside it, outside the box.

THIN ANSWERS (the chair's lesson 2): every PTN page drawn against { ok: true } with no lists draws its own empty or first
state and throws no page error: the public partner page ("This page does not exist."), the request page, the partner area
(the organisation step), Partners ("No partners here."), Contacts, Forward a request. Lists are read as lists or as empty.

Paths (13 manifest lines): see scripts/floor-manifest-ptn-a1-app-r4.txt. The r3 handover's walk lines 10, 12, 13 and 15
are amended by label to the new words. r3's own manifest and sha list are kept as its record.

Proofs in the seat's container (base 239fffb; tree e6b3d9d1, A1 app r3 byte for byte on it):
- b291 (amended): the new cells §3.2 (no mark and no empty tag when null), §3.4 (the mark, 44px, the tap's two lines),
  §5.3 (the admin's words), §6.4 and §8.3 (the copy boxes), §8.1 (no mark in the area), §10 (six thin answers).
  --mutate: M1 (ContactRow, as before) reddens §4.1; M2 the mark's null guard dropped reddens §3.2; each restored byte for
  byte. e-277: the run stops first if either anchor is missing.
- b140_v2 derives its routes from app/vendor/(shell); no PTN page is among them. Its source pass, run alone: identical
  at base and cut.
- The walkers of r3's own block (b20_a4, b72, adm1_admin) and tdw10_p1_shell (which counts the admin routes): identical
  cell for cell at base and cut. tdw10_p1_shell's reds (app/admin/_components/tokens.css) are red on base and not PTN's.
- Lint: the same five errors at base and cut, none new (four setState-in-effect in landed pages, one <a> in PartnerShell).
- The F-44.370 sign was watched for: in every run every room drew.

WALK CARD (after A2-1 server lands; partners.check_label off):
1. Open your partner page: no "Verified", no "Unverified", no empty line above the kind and city.
2. Partner area, Settings: "Your partner page" and the address in a box with Copy; tap Copy: "Copied" for two seconds;
   paste somewhere: https://thedreamwedding.in/partner/p/<handle>. "Open your partner page" opens it.
3. Admin, More > Partners: tabs Unverified, Verified, Blocked, Reports. Open a partner: "Mark as verified".
4. Forward a request: open a person: the message in a box with "Copy message"; tap it: "Copied".
5. (Only once the founder rules and the switch is on) The partner page shows VERIFIED or UNVERIFIED; tap it: the two lines.
