'use client';
// components/vendor/SubscriptionCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// TDW_10 THE BILLING TAB · FORK D (R-26.4) — PURE MOVE, no rewrite.
//
// This card, its two sub-components and its four string sets lived inside
// `app/vendor/settings/page.tsx` until this sitting. The rendered output is
// UNCHANGED — every byte of copy, every style object, every gate expression is
// carried verbatim. Only where the code lives moved. The shape is
// `components/vendor/AtelierForm.tsx`'s own precedent (TDW_07 P2), cited by name.
//
// WHY IT MOVED, and this is the load-bearing half: `settings/page.tsx` is a page
// file that TWO sessions edit. F-09.128 is the live specimen — the UI-vendor
// delivery was cut at `503b254` and applied onto `9f73a8b`, eleven minutes apart,
// and WIPED F-10.92's kill switch in the gap. The razorpay v2 session is paused
// on this very surface. Extraction gives that session a file whose whole content
// is theirs and removes the settings page as a collision surface entirely. That
// is worth more than the tidiness.
//
// ONE HOME, TWO CALLERS: `app/vendor/billing/page.tsx` renders this. Nothing
// else does — the settings page keeps only a signpost (see `#tier` there).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { SCard, SReadRow, A, F } from '@/components/vendor/AtelierForm';
import { subscribeToTier, upgradeToTier, cancelSubscription } from '@/lib/vendor/api/vendor';
import { statusLine } from '@/lib/vendor/billing/statusLine';
import type { SettingsState } from '@/hooks/vendor/useSettings';

// ── M2 · THE FOUNDER-VETOED STRING SET (2026-08-07, verbatim) ───────────────
// Hoisted deliberately: copy under founder veto lives in ONE readable block so
// the next reader can diff it against the veto record without reading JSX. The
// money register is law here — `Rs X,XXX`, zero rupee glyphs, zero k/L shorthand
// (money register law). Canon prices mirror src/lib/billing/razorpay.js
// TIER_PAISE, which pins them as integers so prose cannot drift them (F-10.63).
//
// THE BLOCK MOVED WHOLE, and had to: its whole warrant is that the vetoed bytes
// sit in one readable place. Splitting it across two files to save an import
// would have destroyed the property the block exists for. Zero bytes changed.
// ── M-FINISH S1 · THE VETOED BLOCK MOVED OUT, WHOLE ────────────────────────
// `PLAN_LABEL`, `PLAN_PRICE` and the `V2` set now live at `lib/vendor/billing/plans.ts`.
// Byte-unchanged, same order, same comments — a pure move, the same shape as the move that
// brought them here from `app/vendor/settings/page.tsx` under R-26.4 Fork D.
//
// WHY THEY LEFT, and the reason is a gate verdict rather than a preference: the shell's
// rebuilt money surface (`components/worklist/BillingRoom.tsx`, R-38.8) must read these
// bytes rather than restate them, and importing them FROM A COMPONENT MODULE dragged this
// whole file — and its `statusLine` import — into the shell's Billing chunk. The four
// sentences R-38.8 retires by name were therefore shipping to the browser on the exact
// surface built to retire them. The audit's R-38.6 cell reddened on it. Read that file's
// header before touching either.
//
// THE COPY BLOCK'S OWN WARRANT IS BETTER SERVED THERE THAN IT WAS HERE: vetoed bytes in
// one readable place, diffable against the veto record without reading JSX. That file
// contains no JSX at all.
import { PLAN_LABEL, PLAN_PRICE, V2 } from '@/lib/vendor/billing/plans';

// The fields this surface reads, and only those. Named off `SettingsState` so
// the field names cannot drift into a second vocabulary between the hook and
// its reader — a rename layer here would be F-04.36's family in miniature.
export type SubscriptionFields = Pick<
  SettingsState,
  'tier' | 'billing_status' | 'subscription_link' | 'subscription_id' | 'selfserve_enabled'
>;

// ═══════════════════════════════════════════════════════════════════════════
// THE CARD
// ═══════════════════════════════════════════════════════════════════════════
// ── M2 · THE SUBSCRIPTION SURFACE (F-10.77's cure) ───────────────────
//     Until this section, the ONLY tier byte a vendor ever saw was a
//     read-only row. Her tier moved Prestige → Free at a cancel flip with
//     no notice, no reason, and no action — the flip wrote truth and told
//     nobody. That is F-10.77, and the flip-reason line below is its cell.
//
//     EVERY string here is founder-vetoed verbatim (2026-08-07). The date
//     the first draft carried was DROPPED at his ruling: no flip timestamp
//     exists anywhere in the estate — `billing_status` has no companion
//     stamp, tierFlip.js writes none, and `vendors.updated_at` moves on any
//     profile save, so rendering it would have printed the day she edited
//     her bio as the day her plan changed. A plausible wrong date is worse
//     than no date.
//
//     THE `id="tier"` ANCHOR DID NOT COME WITH THIS CARD, deliberately. It
//     stayed on the signpost left behind in `app/vendor/settings/page.tsx`,
//     because the wire address `/vendor/settings#tier` must keep resolving to
//     something that leads her here. See that file for the retirement
//     condition.
export function SubscriptionCard({ current, show }: {
  current: SubscriptionFields;
  show: (m: string) => void;
}) {
  // ── F-10.110's CURE · ONE CALL, BOTH OUTPUTS (R-26.18, Forks 1 and 2) ─────
  // The Plan label is passed IN, and it is the SAME expression the Plan row
  // renders one line below — one home for the tier vocabulary, no second map.
  // See `lib/vendor/billing/statusLine.ts` for why this reads the pair; the
  // short version is that `vendors.tier` is the entitlement dream-os
  // `chat.js:buildLlmForTurn` actually serves, and `billing_status` is only the
  // payment rail, and two admin write-doors can leave them disagreeing.
  const planLabel = PLAN_LABEL[current.tier] ?? 'Basic';
  const line = statusLine(current.tier, current.billing_status, planLabel);

  return (
    <SCard title="Subscription">
      <SReadRow label="Plan"  value={planLabel} />
      <SReadRow label="Price" value={PLAN_PRICE[current.tier] ?? 'Free — no AI'} />

      {/* NO ROW ON AN UNRECOGNISED STATUS. The retired `?? 'Not set up yet.'`
          fallback asserted a specific false state to a vendor whose status word
          it could not read. Silence is honest under ignorance. */}
      {line.status !== null && <SReadRow label="Status" value={line.status} />}

      {/* F-10.77's cell, now reaching every vendor it is true of. She is told
          WHAT changed and WHY in her own screen rather than discovering it by
          asking Victor something and getting nothing back.

          THE `tier === 'basic'` GATE THAT STOOD HERE IS DELETED, and its
          deletion is the second half of F-10.110's cure. It excluded exactly
          the vendor who most needed the explanation — the one whose plan is
          still on while her rail is dead. Widening it alone would NOT have been
          enough: the old paragraph ends 「 AI is off on Basic 」, which is false
          for her. The sentence had to move with the gate, so both live in the
          resolver and there is no second gate here to drift out of step. */}
      {line.note !== null && (
        <p style={{
          /* F-09.105 CURED: 16, the ruled body floor. Was 13. */
          fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.6,
          color: A.inkSoft, margin: '10px 0 0',
        }}>{line.note}</p>
      )}

      {/* The payment path. R-BILL.1's Subscription Links are issued by the
          founder per vendor from the Razorpay dashboard, so a NULL link is
          a real and currently universal state — it says so plainly rather
          than rendering a button that goes nowhere. */}
      {current.billing_status !== 'active' && (
        <div style={{ marginTop: 14 }}>
          {current.subscription_link ? (
            <>
              <a
                href={current.subscription_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', padding: '13px 0', textAlign: 'center',
                  border: `0.5px solid ${A.interactive}`, borderRadius: 2, textDecoration: 'none',
                  fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.interactive,
                  letterSpacing: '0.42em', textTransform: 'uppercase',
                }}
              >Set up monthly payment</a>
              <p style={{
                /* F-09.105 CURED: 16, the ruled body floor. Was 12. */
                fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.6,
                color: A.inkMute, margin: '10px 0 0',
              }}>
                {`Approve once in your UPI app. Monthly auto-pay, max ${
                  PLAN_PRICE[current.tier] ? PLAN_PRICE[current.tier].split(' / ')[0]
                                           : 'the amount shown on the approval screen'}. `}
                Cancel any time from the app.
              </p>
            </>
          ) : null}

          {/* ── TDW_10 BILLING v2 · THE PICKER ────────────────────────
              This replaces 「 Dev will send you a payment link. 」, which
              described a mechanism this delivery removes.

              RENDERED WHENEVER SHE HAS NO LIVE LINK — which includes the
              churned vendor, deliberately. Her dead subscription id does
              not disqualify her: the server's refusal keys on Razorpay's
              LIVE statuses, not on whether a row holds an id, so a vendor
              who cancelled can subscribe again. Hiding the picker from her
              would be the client re-implementing a rule the server already
              owns, and getting it stricter. */}
          {/* ── F-10.92 · THE CLIENT SHUTS WITH THE ROUTE ──────────────
              `selfserve_enabled` gates the SURFACE, not only the endpoint.
              Before this, an OFF flag produced a picker that 503s — a kill
              switch the vendor could still see and press, which is not a
              kill switch. Now OFF renders nothing here at all.

              OFF IS SILENT, NOT NOSTALGIC: Plan, Price and Status still
              render, and nothing offers her an action the estate cannot
              honour. Restoring the old surface would mean restoring 「 Dev
              will send you a payment link. 」 — a sentence the founder
              retired WITH its mechanism, and which is now simply false.

              THIS GATE WAS WIPED ONCE ALREADY (F-09.128) by a delivery cut
              on an older tree and applied onto a newer one. Both of its
              seats travelled into this file in one move for exactly that
              reason. */}
          {!current.subscription_link && current.selfserve_enabled && (
            <TierPicker
              currentTier={current.tier}
              isUpgrade={current.billing_status === 'active'}
              onDone={() => window.location.reload()}
              show={show}
            />
          )}
        </div>
      )}

      {/* The ACTIVE vendor's exit. Shown only when a plan is actually
          running — cancelling something already cancelled is not an
          action, and the server answers `no_subscription` if it is tried. */}
      {/* F-10.92's second seat — see the gate above and F-09.128. */}
      {current.billing_status === 'active' && current.subscription_id && current.selfserve_enabled && (
        <CancelBlock
          label={PLAN_LABEL[current.tier] ?? 'your plan'}
          onDone={() => window.location.reload()}
          show={show}
        />
      )}
    </SCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TDW_10 BILLING v2 · THE TIER PICKER
// ═══════════════════════════════════════════════════════════════════════════
// Two-step by construction: pick a tier, then read what will happen and
// confirm. The confirm step is not ceremony — it is where the two paths tell
// her different true things. Subscribing opens an approval page. UPGRADING
// STOPS HER CURRENT PLAN FIRST, irreversibly, and she is told so before she
// commits rather than after (Fork U(a)'s seam, priced in copy).
//
// The button is a plain <button> and never a <form> — this surface has no forms.
// Sizes are the ruled rungs: 16 body, 10 engraved register.
function TierPicker({ currentTier, isUpgrade, onDone, show }: {
  currentTier: string;
  isUpgrade: boolean;
  onDone: () => void;
  show: (m: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy]     = useState(false);

  // ── F-10.91 CURED ─────────────────────────────────────────────────────────
  // WITNESSED LIVE, on two real rows: `+918757788550` and `+918595356978`, both
  // `tier='prestige'` with `billing_status='none'` and a NULL subscription id.
  // Both were offered ONLY Essential and Signature. Prestige was filtered out as
  // "her current plan" when it was nothing of the kind — an entitlement someone
  // set by hand, with `billing_status='none'` proving no money ever landed. Every
  // comped, hand-minted or migrated vendor sat in that state, and every one of
  // them was locked out of paying for the tier she was already using.
  //
  // THE DEFECT WAS THE KEY, NOT THE FILTER. `vendors.tier` is an ENTITLEMENT —
  // what she may use. It is NOT a record of what she is subscribed to, and this
  // estate has no such column: the subscription's tier lives at Razorpay, and
  // what the database keeps is the id and the status. Reading an entitlement as
  // if it were a purchase is the whole bug, and the fix is to stop asking it that
  // question.
  //
  // `isUpgrade` ALREADY CARRIES THE TRUTH and was sitting one line away:
  // `billing_status === 'active'` means a live mandate exists. If it does, her
  // paid tier drops out of the picker — re-buying the plan you are currently
  // paying for is not an offer. If it does not, she has nothing live, so nothing
  // is filtered and all three are offered, including the one her entitlement
  // happens to name. No new column, no new wire field, no schema.
  //
  // THE MOVE DID NOT TOUCH THIS EXPRESSION. Re-broken, it re-breaks every comped
  // and every cancelled vendor at once — including 9888294440, who walks this
  // sitting's smoke card on `basic` / `cancelled`.
  const tiers = ['essential', 'signature', 'prestige']
    .filter(t => !(isUpgrade && t === currentTier));

  async function go(tier: string) {
    setBusy(true);
    try {
      const res = isUpgrade ? await upgradeToTier(tier) : await subscribeToTier(tier);
      if ('ok' in res && res.ok) {
        // The link IS the close. She is sent straight to Razorpay rather than
        // shown a second button, because every extra tap between intent and
        // approval is a place the intent dies.
        if (res.subscription_link) { window.location.href = res.subscription_link; return; }
        onDone();
        return;
      }
      // Typed codes, distinct sentences. The third one is the seam.
      const code = (res as { code?: string }).code;
      if (code === 'mint_failed_after_cancel') {
        show(V2.mintFailedAfterCancel(PLAN_LABEL[tier] ?? 'the plan'));
      } else if (code === 'lane_disabled' || code === 'not_configured') {
        show(V2.notOpenYet);
      } else {
        show(V2.mintFailed);
      }
    } catch {
      show(V2.mintFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.brass,
        letterSpacing: '0.42em', textTransform: 'uppercase', marginBottom: 12,
      }}>{V2.pickerHeading}</div>

      {/* F-10.108 · SITE 1 — the offer, where she can read it BEFORE she picks.
          It sits above the three rows rather than inside any one of them because
          it is true of all three uniformly; one string, one home. The warrant for
          the word 「 free 」 is at the string itself, in the V2 block above.
          Body 16 and inkSoft — both already on this surface (the confirm
          paragraph's own rungs). No new size enters this file. */}
      <p style={{
        fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.6,
        color: A.inkSoft, margin: '0 0 12px',
      }}>{V2.offer}</p>

      {tiers.map(t => (
        <div key={t} style={{ marginBottom: 10 }}>
          <button
            type="button"
            disabled={busy}
            onClick={() => setPicked(picked === t ? null : t)}
            style={{
              display: 'flex', width: '100%', alignItems: 'baseline', justifyContent: 'space-between',
              padding: '13px 14px', background: 'transparent', cursor: busy ? 'default' : 'pointer',
              border: `0.5px solid ${picked === t ? A.interactive : 'rgba(0,0,0,0.12)'}`, borderRadius: 2,
            }}
          >
            <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: A.ink }}>
              {PLAN_LABEL[t]}
            </span>
            <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: A.inkMute }}>
              {PLAN_PRICE[t]}
            </span>
          </button>

          {picked === t && (
            <div style={{ padding: '10px 2px 0' }}>
              <p style={{
                fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.6,
                color: A.inkSoft, margin: '0 0 12px',
              }}>
                {isUpgrade
                  ? V2.upgradeExplain(PLAN_LABEL[t], PLAN_PRICE[t])
                  : V2.confirm(PLAN_LABEL[t], PLAN_PRICE[t])}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => go(t)}
                style={{
                  display: 'block', width: '100%', padding: '13px 0', textAlign: 'center',
                  background: 'transparent', cursor: busy ? 'default' : 'pointer',
                  border: `0.5px solid ${A.interactive}`, borderRadius: 2,
                  fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.interactive,
                  letterSpacing: '0.42em', textTransform: 'uppercase',
                }}
              >{busy ? '…' : V2.pickerAction}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TDW_10 BILLING v2 · THE CANCEL BLOCK
// ═══════════════════════════════════════════════════════════════════════════
// Confirm-before-act, and the warning carries the irreversibility because
// Razorpay's cancel genuinely cannot be undone: restarting means a new mandate,
// a new approval, a new short_url. A cancel dialog that said only "are you
// sure?" would be hiding the one fact that makes the decision different from
// every other toggle on this screen.
function CancelBlock({ label, onDone, show }: {
  label: string;
  onDone: () => void;
  show: (m: string) => void;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy]     = useState(false);

  async function doCancel() {
    setBusy(true);
    try {
      const res = await cancelSubscription();
      if ('ok' in res && res.ok) { onDone(); return; }
      const code = (res as { code?: string }).code;
      show(code === 'lane_disabled' || code === 'not_configured' ? V2.notOpenYet : V2.cancelFailed);
    } catch {
      show(V2.cancelFailed);
    } finally {
      setBusy(false);
      setAsking(false);
    }
  }

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} style={{
        width: '100%', padding: '13px 0', marginTop: 14, background: 'transparent',
        border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2, cursor: 'pointer',
        fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.red,
        letterSpacing: '0.42em', textTransform: 'uppercase',
      }}>{V2.cancelYes}</button>
    );
  }

  return (
    <div style={{ marginTop: 14 }}>
      <p style={{
        fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.6,
        color: A.inkSoft, margin: '0 0 12px',
      }}>{V2.cancelWarn(label)}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" disabled={busy} onClick={doCancel} style={{
          flex: 1, padding: '13px 0', background: 'transparent',
          border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2,
          cursor: busy ? 'default' : 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.red,
          letterSpacing: '0.42em', textTransform: 'uppercase',
        }}>{busy ? '…' : V2.cancelYes}</button>
        <button type="button" disabled={busy} onClick={() => setAsking(false)} style={{
          flex: 1, padding: '13px 0', background: 'transparent',
          border: `0.5px solid ${A.interactive}`, borderRadius: 2,
          cursor: busy ? 'default' : 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.interactive,
          letterSpacing: '0.42em', textTransform: 'uppercase',
        }}>{V2.cancelNo}</button>
      </div>
    </div>
  );
}
