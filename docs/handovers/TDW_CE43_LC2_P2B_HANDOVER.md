# repo: dreamos-pwa @ 2e8972c37eff53c20ecc88ba5d3a9d21aaee8b24
# TDW · CE-43 · SEAT LC-2 · P2b · HANDOVER (the dreamos-pwa half) · 2026-09-17

Cut on dreamos-pwa `2e8972c37eff53c20ecc88ba5d3a9d21aaee8b24` (packet 2), re-derived at origin at the moment of cutting. The dream-os half (F-43.78 on the door) is final and in the founder's hands; its handover carries the packet 2 veto record (eight bytes YES, F-43.77 filed, refusals stay 422) and the P2 walk result.

## §1 · What shipped

| File | What |
|---|---|
| `components/vendor/packages/PackageEditSheet.tsx` | **F-43.78 on the sheet:** with "Take a middle payment" off, the middle share is not sent (the door keeps the stored share), and the remainder gate ignores a blank share when the switch is off. |
| `components/vendor/packages/PackageFields.tsx` | **F-43.79:** `actionButton(tone)`, the shared outlined form (0.5px border, 2px corners, 40px tap height, tokens only); Add item uses it. |
| `app/vendor/(shell)/packages/page.tsx` | **F-43.79:** `.pkg-act` is outlined in the accent; `.pkg-act--quiet` (Delete, and P7's Cancel) in the muted ink, colour and border. The fee affordance stays dashed text (ruled). |
| `components/vendor/packages/LeadPackageCard.tsx` | **F-43.79:** Attach package and Change package use the outlined form. |
| `scripts/b81_lc2_p2_room_bench.js` | §3.14, §4.8, §5.10 to §5.12 and M15 to M18; §3.8 amended by label for the quiet button's border. |
| `scripts/floor-manifest-lc2-p2b-pwa.txt` | The declared dirt. No new directory. |

## §2 · The ruling, as built, and two reports

- **F-43.79 (chair-approved under C-43.16, at the founder's request):** outlined, thin border, 2px corners, 40px tap height; Edit and Set as default in the accent; Delete to the right in the muted ink; P7's Cancel (muted) and Delete (accent) in the same form; Attach package, Change package and Add item in the same form. Save and Attach package in the sheets keep the full-width outline. The fee affordance stays dashed.
- **Report 1 · the sheets' own Cancel** (beside Save and Attach package) is not on the ruled list and stays as muted text. One word from the chair moves it to the outlined form.
- **Report 2 · P7's Delete** keeps the accent (it is the confirming act); the card's Delete, which opens P7, is the muted one, as ruled.

## §3 · What is proven

- **b81: 65/65 on the cured tree.** Both ways against `2e8972c` (a fresh clone, the bench copied in): 55 passed, 10 failed — exactly §3.8 (amended), §3.14, §4.8, §5.10 to §5.12, and M15 to M18, whose targets exist only after the cure.
- **b80: 48/48. `tsc --noEmit`: exit 0.**
- **Readers, base and cured identical by exit code and failing-line count:** b80, b40, b42, b78, `ce41_brand_family`, tdw09_palette, tdw09_uivendor.
- **Not run in the seat's container, declared:** the full pwa floor, `next build`, rendering and the two-theme screenshots, the database. The founder's provisional apply and the P2b card are their witnesses.

## §4 · The walk (card P2b)

Start when Vercel reads Ready on this commit and Railway's vendor service is Active on a deployment newer than the P2b dream-os push. Signed in as DEV440:

1. **The buttons, Chalk.** Open Packages, unfold `Photographs, one day`: Edit and Set as default are outlined in the accent, Delete sits right, outlined in grey. Tap Delete: P7's line, with Cancel (grey outline) and Delete (accent outline). Tap Cancel. **Screenshot.**
2. **F-43.78.** Open `Pre wedding shoot`, tap Edit. Untick "Take a middle payment", clear the Middle payment box, tap Save: `Package saved.` (no "Check the highlighted field."), and the bar shows two parts. **Screenshot of the saved card.**
3. **Add item.** In any Edit sheet, Add item is an outlined button. Tap Cancel.
4. **The lead card.** Open Sarah: Change package is an outlined button. **Screenshot.**
5. **Graphite.** Switch to the dark theme. Screenshot Packages with one card unfolded, and **Sarah's card** (the P2 step 9 screenshot still owed).

**Q-LC2-P2b-rows · read-only** (witness: `public.vendor_packages`, dream-os `docs/db/PUBLIC_SCHEMA.md` at ladder 0168):

```sql
select name, middle_enabled, middle_pct, updated_at
from public.vendor_packages
where vendor_id = '23165e38-6510-4639-ab6a-9f35bab93742' and deleted_at is null
order by created_at;
```

Expect `Pre wedding shoot` with `middle_enabled` false and `middle_pct` 30, its `updated_at` at step 2.

## §5 · What packet 3 picks up

Unchanged from the packet 2 handover: the promotion act and the booking sheet, the swipe `Booked` moved, the Clients sheet wired, the one invoice minted; rungs b83 (dream-os) and b82 (pwa); the pre-cut note naming what the seat cannot run; provisional applies first.

Sequencing beyond this sitting is the founder's.
