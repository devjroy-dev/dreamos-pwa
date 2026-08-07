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
const PLAN_LABEL: Record<string, string> = {
  basic: 'Basic', essential: 'Essential', signature: 'Signature', prestige: 'Prestige',
};
const PLAN_PRICE: Record<string, string> = {
  essential: 'Rs 999 / month',
  signature: 'Rs 1,999 / month',
  prestige:  'Rs 2,999 / month',
};
// Keyed on 0114's CHECK exactly — none, active, pending, halted, cancelled.
// `pending` is the retry-window mercy (R-BILL.3) speaking in her own words: a
// card that bounced once, while Razorpay is still trying, is not a demotion, and
// telling her "nothing changes yet" is the difference between a warning and a
// scare.
const BILLING_STATUS: Record<string, string> = {
  none:      'Not set up yet.',
  active:    'Active. Renews monthly.',
  pending:   "Payment didn't go through. Retrying — nothing changes yet.",
  halted:    "Payment failed. You're on Basic.",
  cancelled: "Cancelled. You're on Basic.",
};

// ── TDW_10 BILLING v2 · THE NEW STRING SET — FOUNDER-VETOED ─────────────────
// Hoisted into the SAME block as the v1 set above, for the reason that block
// gives: copy under veto lives in one readable place so it can be diffed
// against the veto record without reading JSX.
//
// RETIRED WITH THE ERA: 「 Dev will send you a payment link. 」 That sentence
// described the founder minting links by hand, which is the mechanism this
// delivery removes. A sentence must not outlive the mechanism it describes.
//
// MONEY REGISTER: `Rs X,XXX`, zero rupee glyphs, zero k/L/Cr shorthand. Prices
// are read from PLAN_PRICE above rather than retyped, so the canon has one home
// on this surface too.
//
// TYPE SCALE: body copy at 16 (the ruled floor), action words at 10 in the
// engraved register — both named rungs. No new size enters this file.
const V2 = {
  pickerHeading: 'Choose a plan',
  pickerAction:  'Choose',
  confirm: (label: string, price: string) =>
    `This opens a Razorpay page to approve ${label} — ${price}. You approve once; it renews every month until you cancel.`,
  cancelWarn: (label: string) =>
    `Cancel ${label}? Your plan stops and you move to Basic. This can't be undone — starting again means setting up a new monthly payment.`,
  cancelYes: 'Cancel my plan',
  cancelNo:  'Keep my plan',
  upgradeExplain: (label: string, price: string) =>
    `Moving to ${label} stops your current plan first, then opens a new page to approve ${price}. Until you approve it, you're on Basic.`,
  // The failure set. Never a false done — and never a false "nothing happened",
  // which is the harder half. `mintFailedAfterCancel` is Fork U(a)'s priced seam
  // speaking in her own words: without it she would read a generic error, assume
  // her old plan survived, and be wrong about whether she is currently paying.
  //
  // EVERY SENTENCE HERE REACHES HER THROUGH `show()`. A caller that renders this
  // card without mounting <Toast> silently swallows all five — a failed cancel
  // that looks like nothing happened. HONEST CONTROLS (CE-209): the mount is
  // asserted by cell at every caller, not trusted.
  mintFailed:   "Couldn't reach Razorpay just now. Nothing has changed — try again in a moment.",
  cancelFailed: "Couldn't cancel just now. Your plan is unchanged — try again in a moment.",
  mintFailedAfterCancel: (label: string) =>
    `Your old plan is already stopped and the new one didn't open. You're on Basic for now — tap ${label} again to finish.`,
  notOpenYet: 'Plan changes are not open yet.',
};

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
  return (
    <SCard title="Subscription">
      <SReadRow label="Plan"  value={PLAN_LABEL[current.tier] ?? 'Basic'} />
      <SReadRow label="Price" value={PLAN_PRICE[current.tier] ?? 'Free — no AI'} />
      <SReadRow label="Status" value={BILLING_STATUS[current.billing_status] ?? 'Not set up yet.'} />

      {/* F-10.77's cell: she is told WHAT changed and WHY, in her own
          screen, rather than discovering it by asking Victor something and
          getting nothing back. Rendered only when the flip actually
          happened TO her — on the floor tier, off a lapsed rail. */}
      {current.tier === 'basic'
        && (current.billing_status === 'cancelled' || current.billing_status === 'halted') && (
        <p style={{
          /* F-09.105 CURED: 16, the ruled body floor. Was 13. */
          fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.6,
          color: A.inkSoft, margin: '10px 0 0',
        }}>
          {`Moved to Basic — subscription ${current.billing_status === 'cancelled'
            ? 'cancelled' : 'stopped after failed payments'}. `}
          Profile and leads unchanged. AI is off on Basic.
        </p>
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
                  border: `0.5px solid ${A.brass}`, borderRadius: 2, textDecoration: 'none',
                  fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.brass,
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

      {tiers.map(t => (
        <div key={t} style={{ marginBottom: 10 }}>
          <button
            type="button"
            disabled={busy}
            onClick={() => setPicked(picked === t ? null : t)}
            style={{
              display: 'flex', width: '100%', alignItems: 'baseline', justifyContent: 'space-between',
              padding: '13px 14px', background: 'transparent', cursor: busy ? 'default' : 'pointer',
              border: `0.5px solid ${picked === t ? A.brass : 'rgba(0,0,0,0.12)'}`, borderRadius: 2,
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
                  border: `0.5px solid ${A.brass}`, borderRadius: 2,
                  fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.brass,
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
          border: `0.5px solid ${A.brass}`, borderRadius: 2,
          cursor: busy ? 'default' : 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.brass,
          letterSpacing: '0.42em', textTransform: 'uppercase',
        }}>{V2.cancelNo}</button>
      </div>
    </div>
  );
}
