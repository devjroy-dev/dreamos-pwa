CE-42 · F-42.209 + R-42.15 · R7 THE CHIP, AND CONTENT CREATOR BECOMES A DOOR (dreamos-pwa, base 7a0ed7b6) · [CE-42 SEAT R7]

1 · SHIPPED. Two rulings, one apply.
   **F-42.209** — the Referrals row reads **Open**. `preview` is DROPPED rather than set false: `RoomRow` defaults it, so a working door gets the honest word without being named, and a future row has to ASK to be called Coming. Both chip bytes were already vetoed; nothing new was authored.
   **R-42.15** — `VENDOR_FIELDS` gains a seventh row, last, after Jewellery: `{ label: 'Content Creator', value: 'content creator' }`. One new byte, vetoed in the packet, title case matching its neighbours.

2 · THE VALUE IS THE SPACED FORM, AND THAT IS DERIVED. The chair asked for the derivation before the choice, so: `lib/auth/otpSignup.ts:184` sends `category` **RAW** to `POST /api/v2/vendor/auth/provision`. That door — dream-os `src/api/vendor/auth.js`, at `50781af` — calls `normaliseCategory(rawCategory)` and writes the canonical token, and only when the vendor's category is still empty ("set once at birth"). The alias lives at `src/lib/vendor/categoryFraming.js:138`. RUN AT THE CUT rather than read: `normaliseCategory('content creator')` → `content_creator`, and `'content_creator'` → `content_creator`. **Both forms work.** The spaced form ships because the normaliser is the estate's one home for this mapping — the alias exists precisely so the glass need not know the token. `b76` C16 pins that the shipped value is one the normaliser resolves, so a future edit to either side cannot drift them apart silently.

3 · THE CONTROL INVENTORY DID NOT MOVE, DERIVED NOT ASSUMED. The category picker is ONE control that maps over `VENDOR_FIELDS`; a seventh row is one more OPTION inside it. `b76` C17 asserts exactly that — one `VENDOR_FIELDS.map(`, the option still setting the category, and the Send-code gate untouched — and goes red if the picker ever becomes two controls. Witnessed green after the edit: `b20_a4_otpsignup_pwa` **76/76**, `b20_a5_plan_pwa` **121/121**, `b59` seven-ink census **20/20**, `obp_vendor_form` **VERDICT: GREEN**.

4 · PROVEN / NOT. `b76` **17 GREEN, 0 RED**. C6 AMENDED BY LABEL (it pinned the Coming chip, which had become false on live glass); C16 and C17 new. **Five mutations against production source, each proven RED and reverted**: the Coming chip put back · the seventh row dropped · a value the normaliser misses (`'creator'`) · the row placed before Jewellery · the picker split into a second control. `b74` 12/12, `b75` 11/11, `b76`-sunday 19/19. `tsc --noEmit` clean. Floor `b40`: C50 + C102, the base's own two; this cut adds none.

   PRE-EXISTING, ATTRIBUTED AT THE BASE BY `git stash -u`, NOT MINE AND NOT CURED HERE:
     · `tdw09_landing.proof.mjs` — 99/100, §2.3 red, byte-identical at the untouched base.
     · `tdw_m_bridename_gate.proof.mjs` — throws (`the onboarding routing decision moved — this bench must move with it`) at the base too.
     · `b05_f0589_pwa_name_wire_bench.js` — throws (`sendOtp window not found — this bench is stale`) at the base too.
   The last two are benches that declare their own staleness rather than lying, which is the right failure — but they are stale, and the next hand in `app/(landing)/page.tsx` will meet them.

   NOT PROVEN: `npm run build`. Four `Failed to fetch … from Google Fonts`, identical at the untouched base. `fonts.googleapis.com` is not on this sandbox's allowlist. Owed on the founder's machine.

5 · THE WALK IS NOW UNBLOCKED. The last input was a creator, and there was no way to become one; there is now.
   (a) Vercel green on this cut.
   (b) Sign up a clean number → **Maker** → the picker shows seven, **Content Creator** last → finish onboarding.
   (c) Her Settings shows "Open to requests from vendors", **OFF** by default. Turn it on; reload; it holds. DEV440's Settings shows no such row.
   (d) DEV440 → Referrals & partners → the row now reads **Open** → Influencer exchange → she is in the list, badge **Pending**.
   (e) Tap her → Send request → craft, 2 reels, dates → Send.
   (f) Her seat opens on the INBOX, not the browse list; the row reads Sent with Accept · Decline. Accept.
   (g) DEV440's row reads Accepted → Mark completed → Completed.

   ⚠ TWO THINGS WILL LOOK LIKE DEFECTS AND ARE RULED BEHAVIOUR. The badge stays **Pending** on every card — `influencer_reach_snapshots` is empty until 4c-3b-2, and the room's vetoed banner says so. And **nothing reaches her phone**: in-app only this packet, the template question with G2.

6 · NEXT. 4c-3b-2, chartered as the R6/R7 pair once the walk reads: R6 writes the `follower_demographics` reader in `igOAuth.js` (their file), this seat reads it into the snapshot, the verified badge and the parked `Recent posts` byte (F-42.208).
