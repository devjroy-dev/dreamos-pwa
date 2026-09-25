# repo: devjroy-dev/dreamos-pwa · base d78461c759d518f4076b1174765d2744099cdce0 · TDW CE-45 · IGD-1 · CUT 1 HANDOVER

## What landed

R-45.27 (the founder, 25 September 2026): Business Solutions' "Your own number" row is now the room **WhatsApp and Instagram**. The key
`number`, its place (Get booked, last), its href `/vendor/number` and its Coming chip are unchanged, and the hub keeps eleven rows. Its
line reads "Enquiries on WhatsApp and Instagram, answered in the studio's name" (R-45.20's plain register; D28 retires with the old name).
Its icon is the seat's own drawing of two overlapping speech bubbles, which cures F-44.164 (the old drawing held a telephone handset
inside a bubble, close to WhatsApp's rule against an image confusingly similar to its telephone logo).

Inside the room, in ONE shell: G6's screen under the heading "Your own number", then "Instagram messages" (C1 to C9, C13), then the
quiet time (QT1, QT2: 1, 2, 4 or 8 hours, 2 preselected). Every new byte has one home, `lib/worklist/metaRoom.ts`; C3 and C4 are
hash-carried from the portfolio's H4 and H2. Rung b126 drives the real room in headless Chromium in both themes (48 cells, 4 mutations).
The differential ran over seventeen benches in series on one base, with b77 the one delta, cured. The floor equals the named base, with
no delta.

The room is DARK until dream-os cut 2a: each new part reads its own door, and a 404 or a malformed body draws nothing, so today the room
is G6's screen under its new name.

## The six carried items

1. **For G6-1: the composition change (S1, chair-ruled).** `components/solutions/OwnNumberFlow.tsx` gains two optional props:
   `sectionHead` (drawn under the room's h1 at all five h1 sites) and `after` (drawn after G6's section, inside the same shell, in both
   shells). With both absent it renders what it rendered at d78461c7; G6's words and steps are unchanged. `app/vendor/(shell)/number/page.tsx`
   passes `SECTIONS.number` and `<MetaRoomSections />`, and draws both in its own shell branch too. b120 1.7 and b77 (§1 order, the old
   mock's number seat excused by its exact text, §3's lede heading) are amended by label. G6-1's next pwa cut rebases onto this.
2. **For FE-2's TYPE_1b: one shared dev-server helper.** `scripts/lib/b126_dev_server.js` holds the whole-tree stop, written from the
   chair's description because F-44.160's bytes had not landed: a detached process group, SIGTERM then SIGKILL to the group, then a proof
   that the port is free, with the output kept in `os.tmpdir()/b126_last_run.log` (A-45.6). At the next cut that touches either helper,
   the two converge into ONE shared helper, which F-44.163's cure for b120, b125 and b83 also uses. This is not a swap now.
3. **For the brand-marks cut (the founder: "the ig and WhatsApp exact icon can be done later").** Meta's terms were read 25 September
   2026 at https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/ and https://about.meta.com/brand/resources/instagram/icons (with
   https://www.meta.com/brand/resources/instagram/instagram-brand/). That cut follows them:
   - official files only, downloaded by the founder behind Meta's accept box, unaltered;
   - each mark small, beside its own section heading, never a lockup of the two, never the page's most prominent feature;
   - the Instagram glyph (not the app icon) with its call to action ("Connect Instagram");
   - nothing implying partnership or endorsement;
   - WhatsApp never used as a verb and never combined with another mark or a generic term.
4. **For dream-os cut 2a: the doors' wire** (declared in `lib/vendor/metaRoomDoor.ts`).
   - `GET /api/v2/vendor/solutions/instagram` and `POST .../instagram/switch {on}` answer
     `{ ok:true, state: not_connected|off|on|paused|waiting, authorize_url: https instagram.com address | null }`.
   - `GET/POST /api/v2/vendor/solutions/quiet` answers `{ ok:true, minutes: 60|120|240|480 }`.
   - The server mints the authorize address; the pwa holds no Instagram constant. The quiet time's home is `vendors.reply_quiet_minutes`
     (0172, default 120), owned by IGD-1 and read by G6's 2b.
5. **The master's amendment line (K4, chair-banked).** `docs/specs/TDW_19_V2_BUSINESS_SOLUTIONS_MASTER.md` §5 row I2 reads "Victor
   answers IG DMs"; by R-45.26 it is **Eliza answers IG DMs**. The master lives in dream-os and is amended there at cut 2a.
6. **For the founder: one offer, not a gate.** C4, carried byte for byte from the portfolio's H2 as ruled, contains an em dash ("...for
   professional accounts — business or creator."). If he likes, it becomes a comma ("...for professional accounts, business or
   creator.") in both homes at the next copy touch.

## Disclosures

- e-127: the addendum said OwnNumberFlow would not be edited; S1 edits it.
- e-128: the probe's first run lacked the service-worker bypass (two hollow greens); cured, and the API trace stays in the probe's output.
- e-129: b77 missed by the build; the differential and the floor put in one turn.
- A foreign run found in the container was quarantined and its b77 amendment adopted only after a hunk-by-hunk read (A-45.7).
- One existing ruled byte is reused as the sections' failure line: `COPY.surfaceUnavailable`.
