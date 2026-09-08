# CE-41 · A7 — THE CONCIERGE WALK'S PWA RIDER · HANDOVER

**Cut by** LE-A **at** dreamos-pwa `3d65c4e8787042225e4f57818564f153e36d40bd` (sibling dream-os `534059f`, A6). Ten files. `tsc` clean; `next build` the founder's.

## 1 · The five cures
| finding | file(s) | what |
|---|---|---|
| **F-41.25** couple sign-out that wasn't one | `lib/frost-api/_base.ts` · `components/frost/blooms/settings.tsx` | `clearCoupleSession()` beside `getCoupleSession()` — the one clear for the one get: removes the six keys (`COUPLE_SESSION_KEYS`) and expires `tdw_couple_session` by the vendor precedent (`session.ts:117`). Settings' sign-out calls it and no longer carries its own list. Behavioural cells: cookie-only reads a couple (the disease) → clear → null (the cure). |
| **F-41.27** admin client dropped the reason | `lib/admin-api/_base.ts` · `app/admin/assistance/page.tsx` | `req()` throws `AdminApiError { status, code, path }` whose `message` is the server's `error` when the body is JSON; estate-wide for every admin door. The queue maps the forward door's codes to the founder's words (`peer_already_has` → "She already has this vendor's enquiry — pick another.") and toasts them. |
| **F-41.28** `Rs Rs` | `app/admin/assistance/page.tsx:77,:173` | `formatRs` carries the prefix; the page no longer adds one. |
| **F-41.29** the sheet forgot | `app/(frost)/frost/canvas/assistance/page.tsx` · `lib/frost-api/assistance.ts` | on mount `fetchMyAssistance()` → `GET /api/v2/couple/assistance` (A6); when a request exists the sheet opens on S2 with her categories, date and city from the request (never this browser), and a **Found so far** list: TDW vendors named with a `/v/` link (#25/#27, KEPT), outsiders as an unnamed row (#28/#29, KEPT); no count of who was asked (#30/#31, STRUCK). Pre-A6 servers 404 → the empty sheet, honestly. |
| **Open: N** | `app/admin/layout.tsx` | `useOpenAssistanceCount()` reads the queue door once per sidebar mount and route change; `NavItem` gains an optional `count`, drawn only when > 0, on the Assistance entry. |

## 2 · Named, not folded
- **A2 defect, dream-os:** `listAssistanceRequests` computes `counts` over the *filtered* result, so `?status=open` reports `forwarded: 0`; the page's three cards share it. The nav reads the unfiltered list (`limit=200`) meanwhile. Server-side counts are one small dream-os byte — finding candidate.
- `couple/pin-login:128` (lockout) still clears two keys by hand — with F-41.19's legacy-key retirement, the auth sitting's.
- The one bench file carries seven A7 cells + one re-aimed A3 cell (#25 was KEPT, now built).

## 3 · Benches / floor
`b20_a3` 81/81 cured; **71/81 RED at `3d65c4e`** (the ten A7 cells). Floor under `--delivery` with this manifest: see the packet note.

## 4 · The founder's witness (Vercel at this tip)
- Sign in as Sarah, Settings → **Sign out** → type the domain → the marketing page and it stays; DevTools → Cookies: no `tdw_couple_session`. Sign in again: W2's "twice, never again" now reads true without touching DevTools.
- Open **Settings → Wedding assistant**: the sheet opens on S2 with *Photography · Makeup — 22 December 2026, Jaipur.* (her sent request), not an empty form; once a forward lands, **Found so far** names the vendor.
- `/admin`: the Assistance nav entry shows an **Open** count; the queue rows read `Photography Rs 1,50,000` (one `Rs`); a refused forward toasts the reason in words.

## 5 · The 409 cause — still owed, one statement, zero placeholders
```sql
select v.routing_handle, l.id, l.source, l.state, l.phone, l.created_at from public.leads l join public.vendors v on v.id = l.vendor_id where l.phone = '+919625759924' and v.routing_handle in ('DEV440','MAKEUPBYSWATIROY') order by l.created_at desc;
```
Rows present → the 409s were `peer_already_has` (createLead's `(vendor_id, phone)` dedupe — correct by the referral precedent); the queue now says so in words, and W6/W7 resume with vendors Sarah has not touched (a second photography vendor and a second makeup vendor from the same lists). No rows → paste the 409 response body from Network → Response, and it is a finding.

Sequencing beyond this sitting is the founder's.
