# TDW · CE-47 · HUB-2e APP · "Your page" · handover

Base: dreamos-pwa 0038eb41 (app train 7, with HUB-2d). Server: HUB2E_SRV_1 (server train 16) sends her page read through and her pictures. Against a server without it, the sheet still opens, but its picture list comes back empty and a save of pictures is refused with the server's sentence. For app train 8 or 9. Seat: CLB.

## What she gets
On Mine, a "Your page" button opens a sheet for her page at /c/<handle>:
- **Her address**, with "See your page" (a new tab, https, no opener). The address never changes.
- **Her name, city and Instagram**, shown as her TDW profile has them. They are not edited here: one fact is corrected in one place. A line says where they come from, and "Edit your profile" opens her profile editor (/vendor/discover/profile).
- **What you do**: up to 5 roles, as chips.
- **Open to**: Paid, Barter, Credit only.
- **Website**: the one typed field.
- **Pictures**: her TDW portfolio pictures, as the server lists them (R-47.2: any picture of hers in her portfolio, never one the safety check holds, never a look's).
  - She taps up to 12. Each chosen picture shows its number, in the order she tapped, and a frame in the primary colour.
  - With no portfolio pictures, a line says so and "Open your portfolio" takes her there.
  - There is no uploader.
- **Save** sends only her roles, open to, website and pictures. The sheet closes and Mine shows the server's line ("Your page is saved."). A refusal is shown word for word.

## The founder's answers, and where each is held
| The founder's answer (8 Oct) | Where it is held |
|---|---|
| Her page follows her TDW profile for name, city and Instagram. | Server: read through (HUB2E_SRV_1). App: shown, never sent (b285 10.1, b190 1e.1 and 1e.3). |
| Roles, open to, website and pictures are hers to set on "Your page". | The sheet's chips, field and picture grid (b190 1e.3). |
| Her pictures come only from her TDW portfolio; no second uploader. | The picture list is the server's (GET /hub/me/pictures); the sheet has no file input (b285 10.1, b190 1e.1). |

## R-47.1: every line on "Your page" (all new)
| Where | Old line | New line |
|---|---|---|
| Under the title | | Anyone can open this page at your Collab Hub address. You choose what it shows below. |
| Under her name, city and Instagram | | Your name, city and Instagram come from your TDW profile. To change them, edit your profile. |
| Under "What you do" | | You can choose up to 5. |
| She taps a sixth role | | You have chosen 5, which is the most your page can show. |
| Under "Pictures" | | Choose up to 12 pictures from your TDW portfolio. They appear on your page in the order you choose them. |
| She taps a thirteenth picture | | You have chosen 12 pictures, which is the most your page can show. |
| Her portfolio has no pictures | | Your TDW portfolio has no pictures yet. Pictures you add to your portfolio can be chosen here. |
| After a save (the server's line; this is the fallback) | | Your page is saved. |
| A save that fails | | Your page was not saved. Please try again. |
| Her page cannot be read | | Your page could not be opened. Please try again. |

**Labels** (names, held to SIMPLE and EASY): Your page, Your address, See your page, Edit your profile, Name, City, Instagram, Not added, What you do, Open to, Website, yourwebsite.com (the hint), Pictures, "N of 12 chosen", Open your portfolio, Save, Saving…, Loading…, and the pictures' spoken names "Picture N on your page" and "Picture not on your page".

## Files
- ADDED `v2/components/vendor/hub/YourPageSheet.tsx`: the sheet.
- CHANGED `v2/lib/vendor/hub.ts`:
  - The types MyPage, MeReply, MyPicture, PicturesReply and PageSave, and the door `myPictures`.
  - fetchMyPage, fetchMyPictures and saveMyPage.
  - PROFILE_HREF, PORTFOLIO_HREF, MAX_ROLES (5), MAX_PICTURES (12), and the words `HUB.page`.
- CHANGED `v2/components/vendor/hub/HubMine.tsx`: the "Your page" button and the sheet.
- CHANGED `v2/components/vendor/hub/ShootTogetherSheet.tsx`: `SHEET_CSS` is exported, so both sheets share one look. No other byte changes.
- CHANGED `scripts/b285_hub2_app_bench.js`: new §10 (10.1 to 10.6) and mutations M13 and M14. YourPageSheet.tsx joins its Hub files (6.1: no sample words).
- CHANGED `scripts/b190_fe6_collab_room_bench.js`:
  - The stubs send her page and three pictures, and record the PATCH body.
  - New on glass, §1e: 1e.0 to 1e.4, with mutations P1 and P2.
- ADDED `scripts/floor-manifest-ce47-hub2e-app.txt`, this handover, and `docs/handovers/b285_ledger_HUB2E.txt`.

## Proof (on 0038eb41; each run its own log; floor lines under env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY)
- b285 58/0: its cells, 8.0, M1 to M14 each reddening the cell it names, and 8.9. It ran 20 times under load (b59_v2 and ce41_e2i looping); the ledger is docs/handovers/b285_ledger_HUB2E.txt.
- b190 --mutate, alone, in the main checkout on a fresh .next: 48/0. §1e (1e.0 to 1e.4) is new. P1, P2, N1 to N4, H1 to H3, B1 to B3, G1 and G2 each redden their named cell; 7.0, 7.9 and 8.1 are green.
- tsc --noEmit is clean. eslint is clean on every changed file.
- Lesson 1 and the e-276 walkers.
  - Static, red by red against a clean 0038eb41:
    - b40 v1 and b40_v2: C50 and C102 on both sides, the list unchanged; C40 green.
    - ce41_e2ivb: its one cell red on both sides.
    - Green: b59, b59_v2, b75, ce41_brand_family, ce41_e2i, ce41_e2ia, d1_help_v2.
  - In the browser, one at a time, in the main checkout, all green: b222, b184, b140 v1, b177, b73, ce41_e2iia, ce41_e2iv, b281, b291, b122_v2 and b126_v2.
- b140_v2, strictly alone and narrowed to /vendor/collab: 24/1. The 1 is 3.1, as before (the real faces cannot load here).
