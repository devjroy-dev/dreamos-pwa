# TDW · CE-47 · ADS-2 · THE APP-SIDE CUT · dreamos-pwa · 1 October 2026

Base 84fa063 (FE-8 landed, its corrective included). Built on FE-8's package; carried by whole-file cmp, none of these
nine files moved between the package and the tip. Both Ads rooms carry every change: v2/ (FE-6's rework) and app/.

## The switchboard words (CE-47's ruling; lib/admin-api/switchboardCopy.ts only, no layout, for ADM-1)
flag.ads "Let vendors run their own Meta ads" · perm.ads_management, perm.pages_read_engagement, perm.pages_show_list,
perm.pages_manage_ads, perm.instagram_basic, perm.instagram_manage_insights (all "Meta app TDW ADS · in review") ·
flag.ig_photo_import "Import a vendor's Instagram photos" ("Meta app App-LIVE · needs Instagram basic and messages");
perm.ads_read and perm.business_management corrected to "Meta app TDW ADS · in review". Seven rooms Ads, one Instagram.
The census (ce41_e2ivb) derives its count: 42 gates, every one named and roomed.

## Item 5 · Connect ad account on every gap card
The page, link, ad-account and inactive gap cards end with "Connect ad account" (ADS.connect.cta), opening the screen
before Meta and Continue to Meta. ONE HOME for the authorize call: useAuthorize(live, keep). LABELLED CHANGE TO AN FE-6
FILE (CE-47 ruling 2): FE-6's Connect only calls the hook now (keep = true; its behaviour unchanged); ConnectAgain calls
it too. No other FE-6 line is touched. b173 green after (38/0).

## Item 4 · the funds line (app half)
Wire: funds?: { amount: number; currency: string } | null. The chooser draws "Funds: Rs 200" (formatRs, the money
home: "Rs 200.50" when paise exist) only for INR; otherwise no funds line. The server half (Meta's funding details into
that shape) rides ADS-2's next dream-os cut; until then null and no line.

## The rupee lock (app half; the server half rides the next dream-os cut)
An account whose currency is known and not INR (funds.currency, else the account's own currency, already on the wire)
is shown with "This account pays in {name}. TDW runs ads on rupee accounts for now." (USD US dollars, EUR euros, GBP
pounds, AED UAE dirhams; an unmapped code by itself), is aria-disabled, cannot be picked, and leaves "Use this ad
account" off. READ for the chair: every money word in the room is rupees from minor units (rs/rsBare in adsWire.ts),
none reads the account's currency; the two locks keep a non-INR account out until its own item is ruled.

## Proof
b143 v2 and b143 (app/): 11.1 to 11.6 in both themes; M13 (no ConnectAgain), M14 (funds for any currency), M15 (a
dollar account pickable), M16 (the names lost), each red and restored by sha. b173 38/0. tsc exit 0.
