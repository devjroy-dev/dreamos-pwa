# G3.1 · SITTING 2 · YOUR WEBSITE — REVIEW COPY & VETO LIST

**Packet** `CE_PACKET/` (transport only, R-40.101 — lands in the tree with the build packet, not before)
**Tips at cut** dreamos-pwa `82612b38` · dream-os `8c262cc` (0146 applied; next free **0147**, R-40.44) — both re-derived by `git fetch -q origin`.
**Prototype** `your-website-s2-proto.html` · 11 frames · 30 shots via `tools/mock_shot.cjs` (374 + 390 primaries, dark + light).
**F-40.254 (bounce) cured** — the chrome is lifted, not drawn: masthead `The Dream Wedding` + room name + `Beta` and the 44 coin (`WorklistShell.tsx:135–157`, rules `:311–317`), the Ask TDW dock (`AiDock.tsx:55–60`, rules `:88–91`), two seats Rooms first (`WorklistShell.tsx:187–192`, `:322–324`, R-37.75), the button register (`:251–257`), `wl-supportaction` (`support/page.tsx:189`), section eyebrow / record head / note (`contracts-mock.html:59–94`, R4-record-* at `:225`), sheet + field (`StudioSheets.tsx:443–461`), the switch and the chevron (`StorefrontScreen.tsx`). Each rule carries its source line in the file's own comment. No FAB: the room creates nothing. Deeper surfaces use the contracts record head; shell rooms have no back bar, so on the prototype the eyebrow is the tap back (declared in the captions).
**Rulings drawn to** R-40.122 (masthead `Your website`; section `SEO — found on Google`; tile + hub row `Your website & SEO` — not in this file, three surfaces in the build) · FORK 2 as drawn · FORK 3 computed from her gaps + her queries, never a fixed set · R-40.77/.78 (switch carried) · master §7 (no score anywhere).

## Frames
W1-page · W1-full · W1-fixed · W2-address · W2-domain · W2-wiring · W2-live · W3-google · W3-report · W4-about · W4-cover. Every phone is live; ↺ resets it; `#solo=<frame>&mode=<dark|light>` for the arm.

## Every vendor-facing byte — silence ships it, strike anything and it is struck
Bytes marked (v) are already founder-vetoed and carried by name; they are not re-opened. Placeholders `{d}` `{n}` are filled at render.

| key | byte | note |
|---|---|---|
| `roomTitle` | Your website | R-40.122: masthead plain; tile + hub row read `Your website & SEO` |
| `seePage` | See the whole page |  |
| `openPage` | Open |  |
| `back` | Your website |  |
| `fixHead` | What to fix |  |
| `fixSub` | A couple reads your page in about a second. These are the gaps she sees. |  |
| `fixNone` | Nothing to fix. Your page is complete. |  |
| `done` | Done |  |
| `addrHead` | Your address |  |
| `addrSub` | Put it in your Instagram bio and on your cards. |  |
| `qrLine` | Scan opens your page. |  |
| `domHead` | Your own name |  |
| `domSub` | Get yourname.in and your page lives there. Registered in your name, not ours. |  |
| `domConfirmH` | Get {d} |  |
| `domConfirmP` | Rs 799 a year, added to your next TDW invoice at cost. We set it up; nothing to configure. |  |
| `domOwn` | The domain is registered in your name, not ours. If you ever leave, it goes with you. | (v) COPY.domainOwnership |
| `domWiring` | Setting up · usually 10–40 minutes |  |
| `domLive` | Live |  |
| `domRenew` | Renews each year unless you switch this off. |  |
| `wedHead` | Weddings on your page | (v) COPY.storefrontWeddingsLabel |
| `wedSub` | Only pages you published and the couple agreed to. |  |
| `wedNone` | None yet. Publish one from Wedding pages. |  |
| `dateSwitch` | Let couples check a date | (v) COPY.storefrontDateSwitch |
| `gHead` | SEO — found on Google | R-40.122: the sold word on the feature that delivers it |
| `gSub` | What Google shows for you, and what people typed to get there. |  |
| `gRow` | Found on Google |  |
| `gSeesH` | What Google shows |  |
| `gSeesP` | Prefilled from your page. Change it if you like. |  |
| `gConnect` | Connect Google |  |
| `gConnectP` | One tap, the same Google account as your reviews. Then this page shows how often you appear, what people typed, and three things to do. |  |
| `gConnected` | Connected to Google |  |
| `gLast` | The last 28 days |  |
| `gPrev` | before that: {n} |  |
| `gTyped` | What people typed |  |
| `gTypedNone` | Nothing yet. Google needs a few weeks. |  |
| `gTodo` | Three things to do |  |
| `gTodoP` | Each one changes what Google can show. |  |
| `savePage` | Save |  |
| `saveToast` | Saved. Your page is updated. |  |
| `leaveWed` | Opens Wedding pages |  |

## Also on the prototype, outside `C`
- The "three things to do" lines (computed, `todos()`): *Name the venue on "…"* / *Publish your first wedding page* / *Add your city* / *Add photos with a line under each* / *Pick a cover photo* / *Mention pre-wedding work in your two lines*, each with a one-line reason. Founder's bytes.
- Domain result rows: `Rs 799 / year` · `Taken`. Toasts: *Opens WhatsApp with your address* · *Saved to your phone* · *Saved. Google picks it up within a few days.* · *Venue named. Your page is updated.*
- Cover sheet empty state: *No approved photos yet. Add some in Portfolio first.*

## Declared
- The QR is a drawing with real finders, not an encoding; the build encodes the address.
- Search Console figures and queries are fixture numbers; no Google door exists until `POST /google/connect` (owed by this sitting, dream-os).
- MAKEUPBYSWATIROY is drawn as a day-one page — no SELECT was run on her row. Verify before the acceptance walk.
- F-40.253: `websiteAddressPending`, `websiteAddressNote`, `checkLive`, `checkPending` in `lib/solutions/copy.ts` have zero readers.
