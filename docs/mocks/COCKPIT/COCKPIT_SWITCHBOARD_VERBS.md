# CE-41 · SEAT E · THE SWITCHBOARD'S REMAINING VERBS — A COPY SHEET (R-41.100)

**Derived from `lib/admin-api/switchboardCopy.ts` at `dreamos-pwa` `dfc8f27e508868ef58108d0d6ea6a66183fd3057` (`origin/main`, fetch-first, 2026-09-09; 32 gate keys confirmed by command at that tip) — every recipient, line and category below is that file's own, not re-decided.** One verb phrase per gate, plain, R-41.98. The dotted spec is C3's and does not move. **Nothing here is cut into code until the chair vetoes this sheet; E2 (i) does not touch words that are still open.**

**COUNT, DISCLOSED NOT PADDED.** I told the chair "twenty". The file holds **32 gates**; the E1 frames ratified **9** of them by name (#18's list plus the two amended at the veto). **23 remain**, not 20 — the miscount was mine, from counting the frames' rows rather than the file's keys.

Ratified already, for the reader's eye, not open here: *Send payment reminders* · *Use Meta's words for the reminder* · *Send an outside vendor the join alert* · *Tell the couple we found her a vendor* · *Ask the couple for a Google review* · *Verify a vendor's website* · *Update a vendor's Google Business Profile* · *Read a vendor's Instagram account* · *Reply to Instagram DMs*.

---

## §A · CONTRACTS — 5

| # | Key | Proposed verb | Spec (C3's, unchanged) | Current name |
|---|---|---|---|---|
| V1 | `flag.contract_sign_send` | **Send the contract for signing** | to the couple · vendor line · Utility | Contract signing link |
| V2 | `template.tdw_contract_sign` | **Use Meta's words for the signing link** | to the couple · vendor line · Utility | Contract signing link — Meta's words |
| V3 | `template.tdw_contract_sign_otp` | **Use Meta's words for the signing code** | to the couple · vendor line · Authentication | Contract signing code — Meta's words |
| V4 | `flag.contract_copy_send` | **Send the signed contract back** | to the vendor and the couple · vendor line · Utility | Signed contract copy |
| V5 | `template.tdw_contract_copy` | **Use Meta's words for the signed copy** | to the vendor and the couple · vendor line · Utility | Signed contract copy — Meta's words |

## §B · CONCIERGE — 1

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V6 | `template.tdw_assist_found_outside` | **Tell the couple we found an outside vendor** | to the couple · couple line · Utility · not sending yet | Found her a vendor from outside The Dream Wedding |

## §C · REVIEWS — 1

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V7 | `template.tdw_review_request` | **Use Meta's words for the review ask** | to the couple · couple line · Marketing | Google review ask — Meta's words |

## §D · GOOGLE — 1

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V8 | `scope.google.webmasters.readonly` | **Read a vendor's Search Console** | house grant · every vendor's website · granted | Google: read Search Console |

## §E · INSTAGRAM — 3

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V9 | `perm.instagram_business_manage_insights` | **Read a vendor's Instagram insights** | Meta app · feeds the Sunday brief · not filed | Instagram: read insights |
| V10 | `perm.instagram_business_content_publish` | **Post to a vendor's Instagram** | Meta app · posts from the studio · not filed | Instagram: publish |
| V11 | `perm.instagram_business_manage_comments` | **Reply to Instagram comments** | Meta app · not filed | Instagram: reply to comments |

## §F · ADS — 2

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V12 | `perm.ads_read` | **Read a vendor's ad results** | Meta app · needs the second app · not created | Ads: read results |
| V13 | `perm.business_management` | **Manage a vendor's Meta business** | Meta app · needs the second app · not created | Ads: manage the business |

## §G · INTRODUCTIONS — 5

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V14 | `flag.referral_alert_send` | **Tell a peer vendor about a referral** | to the peer vendor · vendor line · Utility | Peer referral alert |
| V15 | `template.tdw_referral_alert` | **Use Meta's words for the referral alert** | to the peer vendor · vendor line · Utility | Peer referral alert — Meta's words |
| V16 | `flag.wedding_credit_send` | **Invite a peer vendor to claim wedding credit** | to the peer vendor · vendor line · Utility | Wedding credit invite |
| V17 | `template.tdw_wedding_credit` | **Use Meta's words for the credit invite** | to the peer vendor · vendor line · Utility | Wedding credit invite — Meta's words |
| V18 | `template.tdw_introduction` | **Introduce The Dream Wedding to a vendor** | to the vendor · marketing line · Marketing · not sent before R9 | Vendor introduction |

## §H · WEDDING REEL — 3

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V19 | `flag.wedding_consent_send` | **Ask the couple to allow the guest gallery** | to the couple · vendor line · Utility | Guest gallery consent ask |
| V20 | `template.tdw_wedding_consent` | **Use Meta's words for the consent ask** | to the couple · vendor line · Utility | Guest gallery consent ask — Meta's words |
| V21 | `flag.wedding_reel` | **Make the wedding reel** | no message · needs ffmpeg on the server · absent today | Wedding reel |

## §I · YOUR NOTICES — 1

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V22 | `template.tdw_capability_armed` | **Tell you when a gate is ready** | to you · vendor line · Utility · not yet filed at Meta | Switchboard notice to you |

## §J · THE STANDING ROW, ABOVE THE GROUPS — 1

| # | Key | Proposed verb | Spec | Current name |
|---|---|---|---|---|
| V23 | `perm.whatsapp_business_pair` | **Use WhatsApp for every message below** *(ruled at the fork, not open)* | Meta app · in review since 2 September | WhatsApp business permissions |

---

## §K · TWO FORKS — **BOTH RULED, 2026-09-09**

**Fork A · five gates have no room in the ruled eleven.** R-41.82's list is Payment reminders · Contracts · Concierge · Reviews · Google · Instagram · Ads · Introductions · Wedding reel · Model routes · Your notices. The referral alert (V14, V15), the wedding credit invite (V16, V17) and the guest gallery consent (V19, V20) name none of them. **RULED:** the referral alert goes to **Introductions** (a peer is recruited); the wedding credit invite goes to **Introductions** (a credited vendor is recruited); the guest gallery consent goes to **Wedding reel**. No sixth outbound room. V14–V17 sit under Introductions, V19–V20 under Wedding reel, as tabled above.

**Fork B · `perm.whatsapp_business_pair` gates every room at once.** It is the permission under which all eight WhatsApp sends ride, so filing it inside any one room makes it look local. **RULED:** a single standing row above the groups, before *Payment reminders* — the page's precondition, not a member of it. No twelfth group of one. Its verb is ratified: **Use WhatsApp for every message below**.

Both rulings are recorded here and cut nowhere: E2 (i) touches no word on this sheet until the 23 are vetoed on this ZIP.

**Derived at `dfc8f27e508868ef58108d0d6ea6a66183fd3057`, `origin/main`, `dreamos-pwa`, 2026-09-09. STOP — the chair's veto, then E2 (i).**
