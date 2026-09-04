# P7.3 · THE DEMO DATA TABLE — why the demo studio waits for its data

**Derived at** dreamos-pwa `worklist` **f1e7dd8** · dream-os `main` **7f85ff2**, by command, 2026-09-04.
**Status:** P7.3 DEFERRED past Block 19 (R-39.26, founder). This file is the seat's deliverable, so
**D-2's seed generator is written against it rather than re-deriving it.**

## §1 · THE QUESTION THE SEAT WAS ASKED

The founder ruled (2026-08-28) that `app/demo/vendor/[handle]/*` must render **in** the Graphite
shell as a **demo-mode data source**, not a second UI. The chair ruled the shape: a
`useVendorScope()` context defaulting to the live session, with the transport
(`lib/vendor/api/vendor.ts`) reading its base and auth from the scope in ONE place, and the demo
route group mounting `{ vendorId, source: demo(handle) }`.

The scope is buildable. The derivation that decided the SCHEDULE was per-room: **does a demo
endpoint exist, and does its response shape match the vendor endpoint's?**

## §2 · THE TABLE — 0 MATCH · 3 ADAPTER · 16 NO ENDPOINT

The demo API (`dream-os/src/api/demo/vendor.js`) has **three read doors**:
`GET /:handle` · `GET /:handle/leads` · `GET /:handle/context` — plus three writes
(`POST /:handle/chat`, `/opened`, `/claim`).

| # | room | what the shell room reads | demo endpoint | verdict |
|---|---|---|---|---|
| 1 | **leads** | `LeadsSlice` → typed leads fetch | `GET /:handle/leads` | **ADAPTER** |
| 2 | **storefront** | `StorefrontScreen` → vendor `me` + photos | `GET /:handle` | **ADAPTER** |
| 3 | **portfolio** | `PortfolioScreen` → vendor photos | `GET /:handle` | **ADAPTER** |
| 4 | clients | `ClientsSlice` | — | **NO ENDPOINT** |
| 5 | invoices | `InvoicesSlice` (+ summary) | — | **NO ENDPOINT** |
| 6 | expenses | `ExpensesSlice` | — | **NO ENDPOINT** |
| 7 | events | `EventsSlice` | — | **NO ENDPOINT** |
| 8 | notes | `NotesSlice` | — | **NO ENDPOINT** |
| 9 | books | the month register / money plane | — | **NO ENDPOINT** |
| 10 | calendar | `CalendarScreen` | — | **NO ENDPOINT** |
| 11 | team | `TeamTabs` (members, tasks, payments) | — | **NO ENDPOINT** |
| 12 | contracts | `ContractsScreen` | — | **NO ENDPOINT** |
| 13 | tds | `TdsScreen` | — | **NO ENDPOINT** |
| 14 | couture | `CoutureScreen` | — | **NO ENDPOINT** |
| 15 | collab | `CollabScreen` | — | **NO ENDPOINT** |
| 16 | billing | `BillingRoom` / `BillingScreen` | — | **NO ENDPOINT** |
| 17 | settings | `SettingsScreen` | — | **NO ENDPOINT** |
| 18 | support | `SolutionsIndexScreen` | — | **NO ENDPOINT** |
| 19 | advisor | (advisor body) | — | **NO ENDPOINT** |

## §3 · WHY THE TWO ADAPTERS ARE ADAPTERS, NOT MATCHES

- **leads** — the demo door selects `MASKED_SELECT`
  (`id, demo_vendor_id, bride_name, bride_wedding_date, bride_wedding_city, budget_max, created_at`,
  `src/lib/demo/maskDemoLead.js:76`) and returns `maskDemoLeads(...)`. The masking is deliberate:
  a demo lead has **no bride phone or email by construction**. The shell's `Lead` type is the real
  table's, so the demo shape is a strict, intentional subset — an adapter, never a rename.
- **storefront / portfolio** — `GET /:handle` returns the demo vendor as
  `display_name / category / city / about / rate_display`, not the vendor `me` shape the shell's
  storefront and portfolio screens read.

## §4 · THE FINDING THAT DECIDED THE SCHEDULE

**The wall is the DATA, not the fetcher.** The demo tree does not read vendor tables through a
different lens — it reads **different tables**: `demo_vendors`, `demo_leads`, `demo_claim_requests`
(the only three in `src/api/demo/`), deliberately masked, with a 72h lifecycle and a claim door.
Scoping the transport changes *where* a room fetches from; it cannot conjure invoices, contracts,
calendar rows, team members or a money plane that were never seeded.

So the scope would light **three** rooms and leave **sixteen** rendering a stated demo-empty byte.
A demo studio in which sixteen of nineteen rooms say "not part of the demo" is not a demonstration
of the product; it is a tour of its absence. **R-39.26 (founder): the demo must show the finished
surface**, so P7.3 moves past Block 19.

## §5 · WHAT D-2's SEED GENERATOR IS OWED (write against this, not a re-derivation)

To light room *n* under the scope, a demo vendor needs seeded rows the demo API can serve. Per the
table, that is **sixteen new read doors and their tables**, or a smaller ruled subset. The order
worth considering — the rooms a vendor is shown first, and the ones that carry the product's
argument — is **books · invoices · events · calendar · team · contracts**, then the rest.

Two constraints the generator must inherit, both already load-bearing in the demo lane:
1. **Masking is a rule, not a default.** `maskDemoLead` exists because a demo lead must not carry a
   real bride's contact. Any new demo table needs its own masking decision **before** it has an
   endpoint.
2. **The 72h lifecycle and the claim door are the demo's shape.** Seeded rows must expire with the
   demo vendor, or a claimed demo becomes a live vendor with fiction in his books.

## §6 · WHAT REMAINS TRUE FOR P7.3 WHENEVER IT OPENS

The chair's ruling on the shape stands and needs no re-derivation:
`useVendorScope()` defaulting to the live session · the 32 shell page files changing one identifier
each (`useVendorSession` → `useVendorScope`), a `tsc`-forced mechanical edit · the transport reading
base + auth from the scope in ONE place · the demo route group mounting the demo scope · the demo
tree (2,739 lines mirroring the DELETED `/vendor` tree) retiring · Block 08's vetoed demo banner and
claim bytes carrying over byte-identical · a demo vendor's `/v/` flagged demo with **no review link**.

**Also standing: F-39.86** — `dream-os/scripts/b07_p5_bench.js:1096` reads the pwa's deleted
`app/vendor/list/[slice]/page.tsx` across repos. Pre-existing, inside the unchanged base set.
