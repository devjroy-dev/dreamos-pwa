# COPY REGISTER — TDW_19 BUSINESS SOLUTIONS (P0-B)

**For the founder's ONE pass (spec §9).** Every vendor-facing and couple-facing
byte this block ships, in one place. **Nothing here has been through your veto.**
What ships until you rule is PROPOSED.

**Base at the cut:** `dreamos-pwa` `14836e1` · `dream-os` `f7f5a6e`, both
`behind 0`, both trees clean, `tools/preflight.sh` CLEAR.
**Derived, not transcribed:** the 50 pairs below were extracted from
`lib/solutions/copy.ts` by command at the moment of writing, not retyped.

## HOW TO USE THIS

Read the right column. Strike or rewrite anything. **Three columns are marked
⚠ and want your eye first** — they are places where this seat proposed something
beyond what you approved, or where the product says two different things to two
different people.

---

## 1 · THE THREE ITEMS — ALL RULED (CE-38 consolidated relay, 2026-08-28)

They are kept in place rather than deleted: the reasoning is why the bytes read
as they do, and a register that drops it leaves the next reader guessing.

### 1a · `Coming` — ✅ **APPROVED as the seventh chip.** Spec §9 amended by label; its six were authored before R-19.5's gates existed, and a gated-off phase needs a state name. The chip set is now seven, closed.

| Approved (spec §9) | Proposed addition |
|---|---|
| Not connected · Connected · Needs attention · Searching · Live · Expired | **`Coming`** |

R-19.5 needs a word for a row whose env gate is closed. None of your six says it
honestly — **`Not connected` would tell a vendor she can connect something she
cannot**, which is the one thing she must not be told. `Coming` is styled the
quietest of the seven on purpose: it is the only chip that describes *us* rather
than *her*.

`bs_audit` C8 prints it on every run. It is now approved rather than proposed.

### 1b · The demo asymmetry — ✅ **STANDS AS SHIPPED**, stated not hidden.

| Page | `Enquire on WhatsApp` |
|---|---|
| `/v/<code>` — a real vendor | **absent** |
| `/v/<code>` — a demo vendor | **present** |

`public.vendors` has 45 columns and **no phone, and no "my number is public"
flag**. A vendor's number lives on `public.users.phone`. Publishing it because a
button needed a target would put her personal WhatsApp on an open URL on the
strength of a choice she was never asked to make.

`demo_vendors.whatsapp_phone` is a business's own public Instagram contact,
gathered when the demo was built, on a page that says it is a demonstration.

So the two pages differ, and **a couple who sees both will notice**. That is the
cost of the ruling, stated rather than buried. **It retires the day a real public-contact field is chartered (P2).** Until then the demo page carries one affordance the real page does not, and this sentence is the register's record of why.

### 1c · The inline transcriptions — ✅ **ACCEPTED** with their home-and-reason notes. `bs_audit` C24 now guards them.

| String | Home | Also written as a literal in | Why |
|---|---|---|---|
| `reviewUnsetLine` | `lib/solutions/copy.ts` | `app/r/[code]/route.ts` | Route handler on the public edge, no React runtime. Importing the copy module drags `types.ts` and its graph onto a route whose whole job is sixteen words. |
| `publicPageLine`, `publicPageEnquire`, `publicPageUnknown` | `lib/solutions/copy.ts` | `app/v/[code]/page.tsx` | Server component serving strangers; same reason. |

**If the two ever disagree, `copy.ts` wins.** Your veto lands here, on this
register; those files are transcriptions and each says so at the site. Rewriting
a byte below means changing it in two places, and the file comments name the
second.

---

## 2 · ROW LABELS (the room index) — spec §0 order

| Key | Ships as |
|---|---|
| `ROWS.google` | Google page |
| `ROWS.website` | Website |
| `ROWS.seo` | SEO |
| `ROWS.marketing` | Marketing |
| `ROWS.proof` | Proof |
| `ROWS.benchmarks` | Benchmarks |

Nouns, ≤2 words. `bs_audit` C6 asserts the length; C13 asserts the order matches
the backend's.

## 3 · ROW EYEBROWS — what each row DOES, functional register

| Key | Ships as |
|---|---|
| `ROW_EYEBROWS.google` | Your Google listing, kept current |
| `ROW_EYEBROWS.website` | Your own address on the web |
| `ROW_EYEBROWS.seo` | Found when couples search |
| `ROW_EYEBROWS.marketing` | Posts and ads from your own work |
| `ROW_EYEBROWS.proof` | Rate card, profile, answers |
| `ROW_EYEBROWS.benchmarks` | How you compare in your city |

Written against spec §0's doctrine that we sell nothing a generic tool does as
well. A row that oversells is the first place that slips.

## 4 · CHIPS

| Key | Ships as | Status |
|---|---|---|
| `CHIPS.not_connected` | Not connected | spec §9 |
| `CHIPS.connected` | Connected | spec §9 |
| `CHIPS.needs_attention` | Needs attention | spec §9 |
| `CHIPS.searching` | Searching | spec §9 |
| `CHIPS.live` | Live | spec §9 |
| `CHIPS.expired` | Expired | spec §9 |
| `CHIPS.coming` | Coming | ⚠ **PROPOSED — see 1a** |

## 5 · BUTTONS

| Key | Ships as |
|---|---|
| `BUTTONS.connect` | Connect |
| `BUTTONS.disconnect` | Disconnect |
| `BUTTONS.get` | Get |
| `BUTTONS.renew` | Renew |
| `BUTTONS.make` | Make |
| `BUTTONS.share` | Share |

Verbs, ≤2 words. `bs_audit` C7 refuses any word not in spec §9's set.

## 6 · THE SENTENCES SPEC §9 REQUIRES

| Key | Ships as | Note |
|---|---|---|
| `domainOwnership` | The domain is registered in your name, not ours. If you ever leave, it goes with you. | Spec §5's ownership clause. The part that matters — it leaves with her — is placed last so it is what she remembers. |
| `costPassThrough` | Billed at cost on your next invoice. We add nothing to it. | **Carries no figure.** The amount is rendered beside it by `formatRs`, so no price is ever typed into copy and this cannot go stale when the registrar's rate moves. |
| `benchmarksBelowCohort` | Not enough vendors in {city} yet. | Spec §7's own byte. `{city}` is substituted at render. |
| `benchmarksNoCity` | Not enough vendors in your category yet. | ⚠ **Not in the spec.** It exists because `Not enough vendors in null yet` is the byte that ships if nobody writes the second sentence. |
| `subdomainPending` | Your web address is ready once onboarding is finished. | For a vendor mid-onboarding with no `routing_handle`. The alternative was showing her `null.thedreamwedding.in`. |
| `websiteAddressPending` | Arrives with your own domain | ⚠ **F-19.21.** The surface printed `<handle>.thedreamwedding.in` as a live address; the founder opened one and got `DEPLOYMENT_NOT_FOUND`. **No wildcard DNS exists** — that is P2 infrastructure plus a founder-side Vercel/DNS action, filed in the ledger. The row now states when the address arrives. |
| `websiteAddressNote` | Your address is reserved. It goes live when your domain is set up. | Shown under the reserved name, which is rendered muted and unlinked so nothing invites a tap. |
| `withheldNote` | This opens once we finish connecting the service. | ⚠ **F-19.20.** Beside any button whose gate is closed. The founder pressed `Connect` and nothing happened — a withheld door must look withheld and say who is waiting on what. |
| `footerLine` | Something broken? | The room footer, shrunk to the ruled one-liner. **The tail of the sentence is the button:** `supportAction` already reads `Message us on WhatsApp`, so together they render `Something broken? Message us on WhatsApp.` |

## 7 · THE EMPTY STATES

R-19.2: **the empty state is the product's real first state, not a placeholder.**
Each says what the row will do and what her one next action is. **None of them
apologises.**

| Key | Ships as |
|---|---|
| `googleEmpty` | Connect your Google listing and we keep your name, hours and photos in step with your rooms — and ask each couple for a review after their date. |
| `websiteEmpty` | Every vendor gets an address on our domain. Search for your own name here and we buy it, wire it up and put your page on it. |
| `seoEmpty` | Once your page is live we make it findable — structured, fast, indexed — and show you what couples searched to reach it. |
| `marketingEmpty` | Posts and ad briefs written from your own portfolio and calendar. Nothing goes out without you sending it. |
| `proofEmpty` | The three documents you send most: a rate card, a one-page profile, and answers to what couples always ask. |
| `benchmarksEmpty` | How your reply time and enquiries compare with your category in your city. We never show another vendor’s numbers. |

## 8 · THE SMALL WORDS

| Key | Ships as | Where |
|---|---|---|
| `indexEyebrow` | For your business | above the six rows |
| `indexUnavailable` | Current status could not be loaded. The rows below still open. | when `GET /solutions` fails |
| `surfaceUnavailable` | This could not be loaded just now. | when a surface's own door fails |
| `noneYet` | None yet | never "N/A", never "empty" |
| `checkLive` | Live | SEO checklist |
| `checkPending` | Not yet | SEO checklist |
| `docReady` | Ready | Proof |
| `docStale` | Needs redoing | Proof — a Couture change outran the document |
| `medianLabel` | median | so she knows whose the second number is |
| `googleQuotaPending` | Automatic updates start once Google approves our access. | spec §8 gates the SYNC separately from the grant |

**On the two error lines:** neither says "something went wrong". That phrasing
tells a vendor nothing she can act on. Each names what is missing and what still
works — on the index, the six rows are still on screen beneath it and the
WhatsApp footer still reaches a person.

**On the SEO checklist:** words, not ticks. A green tick beside a red cross reads
as a report card, and spec §6 is explicit that this row is not one.

## 9 · THE PUBLIC PAGES — the first bytes any stranger sees

⚠ **These are the only strings in this block a non-vendor will read**, and they
are the first public per-vendor bytes the estate has ever had. `/v/` is gated on
frames separately by the chair for that reason.

| Key | Ships as | Where |
|---|---|---|
| `publicPageLine` | Takes enquiries through The Dream Wedding. | `/v/<code>`, under the name |
| `publicPageEnquire` | Enquire on WhatsApp | `/v/<code>`, demo only — see 1b |
| `publicPageUnknown` | This page is no longer available. | absent, paused or inactive |
| `reviewUnsetLine` | This review link is not set up yet. | `/r/<code>`, **every vendor, always** |
| *(inline, `app/v`)* | This is a demonstration page, built from work published publicly. | demo vendors only |

**`reviewUnsetLine` is what every single person sees at `/r/<code>` today**,
because no review-URL column exists anywhere in the schema (F-19.17). The Meta
template `tdw_vendor_review_request` is approved against that base and pointed at
a framework 404 until this shipped. It resolves when P1 lands.

**`publicPageUnknown` is deliberately the same for three different reasons** —
handle absent, vendor paused, vendor inactive. If they differed, the route would
answer *does this handle exist?* for anyone willing to walk a six-character
keyspace.

## 9b · P2A — THE STOREFRONT'S NEW BYTES (TDW_19 P2-A §3-5)

⚠ **PROPOSED, pending your veto.** `/v/<code>` stopped being a holding page: it
now carries her photographs, her own prose and her rate. Section 9 above is
unchanged and still ships; this section is only what P2-A added or moved.

| Key | Ships as | Where |
|---|---|---|
| *(core)* `Starting at ` + `formatRs` | Starting at Rs 60,000 | `/v/<code>`, and the Frost deck, and the vendor's own preview |
| *(metadata)* title | `<business name> · <category> · <city>` | the WhatsApp / social link preview |
| *(metadata)* description | her `about`, first 200 chars — or `publicPageLine` if she has written none | the link preview |
| *(metadata)* miss title | The Dream Wedding | unknown, paused or inactive handle |

### ⚠ THREE THINGS THIS SECTION ASKS YOU TO RULE

**1 · `Starting at Rs 60,000`, not `From Rs 60,000`.** The relay drafted *From*.
That string is **not this page's to choose**: it lives in the shared card core,
which the Frost deck and the vendor's own Discover preview render from the same
line. Changing it here would either change what every couple sees in the deck, or
fork the money line into two — and forking it is the exact disease the one-card
law exists to prevent. `Starting at` is the byte in the tree today and the byte
the vendor was already promised on her own preview. **If you want *From*, it
changes everywhere at once and that is the right way round** — say so and it
moves in the core, in one cut.

**2 · Her `about` becomes the link preview's description.** A couple forwards
this into a thread and her own sentences are what her friend reads first. Nothing
is generated, summarised or padded — it is her text, trimmed to 200 characters at
a word-safe boundary, and the standing line only when she has written nothing.
The alternative was a written-for-her summary, which would put words in her mouth
on the one surface she has least control over.

**3 · The price never travels into a preview.** `starting_price` is on the page
and deliberately not in the OG description — a rate quoted by a stranger's phone,
outside its register and outside her control, is a number she cannot correct.
`bs_audit` C29 asserts it stays off.

### WHAT MOVED RATHER THAN ARRIVED

`publicPageLine` — *Takes enquiries through The Dream Wedding.* — is unchanged
but now renders **only where a vendor has written no `about`**. Under her own
prose it was a second, quieter voice saying less than the first. On the demo leg
and on a bare profile it still carries the page.

## 10 · WHAT IS NOT HERE

- **Persona names.** Victor, Donna, Harvey, Mira appear nowhere in product
  chrome. `bs_audit` C5 and C20 assert it across every surface.
- **The `₹` glyph, and `k`/`L`/`Cr` shorthand.** Money is `Rs X,XX,XXX`, built
  only by `formatRs` (`lib/vendor/format.ts:21`). C4 and C20 assert no money
  string is built by hand anywhere in this block.
- **Any figure.** No price, rate or count is typed into copy. Every number on
  these surfaces arrives from a door.
- **The support room's own three strings** — `supportTitle`, `supportBody`,
  `supportAction` live in `lib/worklist/copy.ts` (the M-FINISH S2 seat's file)
  and are consumed unchanged. They are not this seat's to change and are not on
  this register.
