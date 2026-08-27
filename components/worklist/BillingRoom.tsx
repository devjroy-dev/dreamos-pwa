"use client";
// components/worklist/BillingRoom.tsx — R-38.8 · BILLING IS THE TEST CASE.
//
// ══ WHY THIS IS A NEW SURFACE AND NOT A RESTYLED SubscriptionCard ═══════════
//
// The chair's own warrant for `WlToast` applies here without amendment: the shell has its
// own nav, its own coin, its own drawer and its own toast (R-37.84 ①), and what it owns in
// each case is PRESENTATION. This file owns presentation and nothing else.
//
// EVERYTHING THAT IS NOT PRESENTATION IS IMPORTED, and the list is worth reading because
// it is the whole argument that this is one home rather than two:
//   · `PLAN_LABEL`, `PLAN_PRICE`, `V2` — the founder-vetoed money bytes and the price
//     canon, from lib/vendor/billing/plans.ts. Not restated. Not paraphrased. They were
//     imported from SubscriptionCard.tsx on the first cut, and the audit reddened: an
//     import from a COMPONENT module drags the component and its statusLine dependency
//     into this chunk, so the four sentences R-38.8 retires were shipping here. See that
//     file's header — the module shape was the defect, not the copy.
//   · `subscribeToTier`, `upgradeToTier`, `cancelSubscription` — the rails.
//   · `useSettings`, `useToast` — the state and the timing.
//   · `billingChip` — the pair logic, which is the one thing R-38.8 genuinely changed.
// What is authored here is markup and CSS, at the six rungs.
//
// ⚠ THE OLD SURFACE SURVIVES ON DISK. `/vendor/billing` still renders `SubscriptionCard`
// and nothing in the shell links to it (R-38.1 permits an untouched fallback this
// sitting). Both read the same maps and the same rails, so a price cannot drift between
// them; only the layout differs, and only until the fallback retires.
//
// ══ THE TOAST MOUNT IS LOAD-BEARING (HONEST CONTROLS, CE-209) ═══════════════
// Five of this surface's sentences reach the vendor ONLY through `show()`: mintFailed,
// cancelFailed, mintFailedAfterCancel, notOpenYet. A caller that renders this without
// mounting <WlToast> ships a Cancel button that, when the call fails, does nothing and
// says nothing — a failed cancel that looks like a successful one. Cell-asserted at the
// caller, never trusted.
import { useState } from 'react';
import { PLAN_LABEL, PLAN_PRICE, V2 } from '@/lib/vendor/billing/plans';
import { subscribeToTier, upgradeToTier, cancelSubscription } from '@/lib/vendor/api/vendor';
import { billingChip } from '@/lib/worklist/billingChip';
import { COPY } from '@/lib/worklist/copy';
import type { SettingsState } from '@/hooks/vendor/useSettings';

type Fields = Pick<SettingsState,
  'tier' | 'billing_status' | 'subscription_link' | 'subscription_id' | 'selfserve_enabled'>;

const TIERS = ['essential', 'signature', 'prestige'];

export function BillingRoom({ current, show, loading = false }: { current: Fields; show: (m: string) => void; loading?: boolean }) {
  const planLabel = PLAN_LABEL[current.tier] ?? PLAN_LABEL.basic;
  const chip = billingChip(current.tier, current.billing_status);
  const isUpgrade = current.billing_status === 'active';

  return (
    <div className="wl-bill">
      {/* ── THE PLAN CARD ────────────────────────────────────────────────────
          Plan name at t2, price at t1, status as a neutral chip. R-38.8's shape, and the
          reason it is a shape rather than a sentence is F-10.110: the row used to blend
          entitlement and rail into one claim and got it wrong for every comped vendor.
          Three separate facts, three separate places, no connective tissue to be wrong.

          「Free — no AI」 RETIRES HERE. It was the Price row's fallback for a vendor on
          Basic, and it was two claims: a price and a capability, neither of which belongs
          in a figure slot. Basic's inclusion line below carries the capability; the price
          slot simply has no figure to show. */}
      <section className="wl-billcard">
        <div className="wl-billlead">{COPY.billingPlanLead}</div>
        {/* THE FRAME RENDERS BEFORE THE FETCH; THE CLAIMS DO NOT. `useSettings` seeds
            `tier: ''`, and an empty tier resolves to 「Basic」 through the same `?? basic`
            floor that keeps an unrecognised word safe at rest — which is correct AFTER a
            read and a lie BEFORE one. A vendor on Prestige must never see 「Basic」 on her
            own money page because a fetch had not landed yet. So the card's shape is
            immediate and every word inside it waits. */}
        {!loading && (
          <>
            <div className="wl-billname">{planLabel}</div>
            {PLAN_PRICE[current.tier] && (
              <div className="wl-billprice">{PLAN_PRICE[current.tier]}</div>
            )}
            {!PLAN_PRICE[current.tier] && (
              <p className="wl-billbasic">{COPY.planBasicIncludes}</p>
            )}
            {/* NO CHIP ON AN UNRECOGNISED STATUS — see billingChip.ts. */}
            {chip.label !== null && <span className={'wl-chipstatus ' + chip.tone}>{chip.label}</span>}
          </>
        )}
      </section>

      {/* ── THE PLANS LIST ───────────────────────────────────────────────────
          One row per plan: name · price · one action. R-38.8 asks each row to carry a
          one-line inclusion too, and THREE OF THE FOUR SHIP WITHOUT ONE, declared:
          nothing in this repo states what Essential, Signature and Prestige include. The
          only tier-differentiated fact reachable from here is the AI message cap, which
          lives in runtime admin config keys (`vendor_ai_daily_*`), not in shipped
          constants. Basic's line is derivable — statusLine.ts's own vetoed byte says AI is
          off there — so Basic has one and the paid three are owed as bytes in
          docs/COPY_REGISTER_M-FINISH.md. Inventing three inclusion lines on a money
          surface is exactly the class of thing the veto register exists to catch. */}
      {!loading && current.selfserve_enabled && current.billing_status !== 'active' && !current.subscription_link && (
        <PlansList currentTier={current.tier} isUpgrade={false} show={show} />
      )}
      {!loading && current.selfserve_enabled && isUpgrade && (
        <PlansList currentTier={current.tier} isUpgrade show={show} />
      )}

      {/* The link path. R-BILL.1's Subscription Links are issued per vendor from the
          Razorpay dashboard, so a NULL link is a real and currently common state — it
          renders nothing rather than a button that goes nowhere. */}
      {!loading && current.billing_status !== 'active' && current.subscription_link && (
        <a className="wl-billaction" href={current.subscription_link} target="_blank" rel="noopener noreferrer">
          Set up monthly payment
        </a>
      )}

      {/* The ACTIVE vendor's exit. Shown only when a plan is actually running — cancelling
          something already cancelled is not an action, and the server answers
          `no_subscription` if it is tried. F-10.92's kill switch gates it too: an OFF flag
          used to produce a control that 503s, which is not a kill switch. */}
      {!loading && isUpgrade && current.subscription_id && current.selfserve_enabled && (
        <CancelBlock label={planLabel} show={show} />
      )}

      <style>{BILL_CSS}</style>
    </div>
  );
}

function PlansList({ currentTier, isUpgrade, show }: {
  currentTier: string; isUpgrade: boolean; show: (m: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ── F-10.91's CURE, CARRIED VERBATIM AS AN EXPRESSION ──────────────────────
  // `vendors.tier` is an ENTITLEMENT — what she MAY use. It is NOT a record of what she is
  // subscribed to, and this estate has no such column. Filtering on it locked every
  // comped, hand-minted and migrated vendor out of paying for the tier she was already
  // using — witnessed live on two real rows at `tier='prestige'`, `billing_status='none'`.
  // `isUpgrade` carries the truth: a live mandate exists, or it does not.
  // ⚠ RE-BROKEN, THIS RE-BREAKS EVERY COMPED AND EVERY CANCELLED VENDOR AT ONCE.
  const tiers = TIERS.filter((t) => !(isUpgrade && t === currentTier));

  async function go(tier: string) {
    setBusy(true);
    try {
      const res = isUpgrade ? await upgradeToTier(tier) : await subscribeToTier(tier);
      if ('ok' in res && res.ok) {
        // The link IS the close. She goes straight to Razorpay rather than to a second
        // button, because every extra tap between intent and approval is a place the
        // intent dies.
        if (res.subscription_link) { window.location.href = res.subscription_link; return; }
        window.location.reload();
        return;
      }
      const code = (res as { code?: string }).code;
      if (code === 'mint_failed_after_cancel') show(V2.mintFailedAfterCancel(PLAN_LABEL[tier] ?? 'the plan'));
      else if (code === 'lane_disabled' || code === 'not_configured') show(V2.notOpenYet);
      else show(V2.mintFailed);
    } catch {
      show(V2.mintFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="wl-plans">
      <div className="wl-billlead">{COPY.billingPlansHead}</div>
      {/* The offer sits above the rows because it is true of all three uniformly. One
          string, one home; its warrant for the word 「free」 is at the string itself. */}
      <p className="wl-billoffer">{V2.offer}</p>
      {tiers.map((t) => (
        <div key={t}>
          <button type="button" className="wl-planrow" disabled={busy}
                  aria-expanded={picked === t}
                  onClick={() => setPicked(picked === t ? null : t)}>
            <span className="wl-planname">{PLAN_LABEL[t]}</span>
            <span className="wl-planprice">{PLAN_PRICE[t]}</span>
          </button>
          {picked === t && (
            <div className="wl-planconfirm">
              {/* THE TWO PATHS TELL HER DIFFERENT TRUE THINGS, and that is why the confirm
                  step is not ceremony. Subscribing opens an approval page. UPGRADING STOPS
                  HER CURRENT PLAN FIRST, irreversibly, and she reads that before she
                  commits rather than after. */}
              <p className="wl-billbody">
                {isUpgrade ? V2.upgradeExplain(PLAN_LABEL[t], PLAN_PRICE[t])
                           : V2.confirm(PLAN_LABEL[t], PLAN_PRICE[t])}
              </p>
              <button type="button" className="wl-billaction" disabled={busy} onClick={() => go(t)}>
                {busy ? '\u2026' : COPY.planAction}
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function CancelBlock({ label, show }: { label: string; show: (m: string) => void }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doCancel() {
    setBusy(true);
    try {
      const res = await cancelSubscription();
      if ('ok' in res && res.ok) { window.location.reload(); return; }
      const code = (res as { code?: string }).code;
      show(code === 'lane_disabled' || code === 'not_configured' ? V2.notOpenYet : V2.cancelFailed);
    } catch {
      show(V2.cancelFailed);
    } finally {
      setBusy(false);
      setAsking(false);
    }
  }

  // The warning carries the irreversibility because Razorpay's cancel genuinely cannot be
  // undone: restarting means a new mandate, a new approval, a new short_url. A dialog that
  // said only "are you sure?" would hide the one fact that makes this different from every
  // other control on the screen.
  if (!asking) {
    return (
      <button type="button" className="wl-billaction danger" onClick={() => setAsking(true)}>
        {V2.cancelYes}
      </button>
    );
  }
  return (
    <div className="wl-cancel">
      <p className="wl-billbody">{V2.cancelWarn(label)}</p>
      <div className="wl-cancelrow">
        <button type="button" className="wl-billaction danger" disabled={busy} onClick={doCancel}>
          {busy ? '\u2026' : V2.cancelYes}
        </button>
        <button type="button" className="wl-billaction" disabled={busy} onClick={() => setAsking(false)}>
          {V2.cancelNo}
        </button>
      </div>
    </div>
  );
}

const BILL_CSS = `
.wl-bill{padding-top:16px;padding-bottom:24px;display:flex;flex-direction:column;gap:16px}
/* R-38.5 · THE EDGE. The plan card's left border is one of the four x values the text-edge
   cell reads — with the wordmark, the first tile and the dock field. It takes NO
   horizontal margin of its own; the column's gutter is the only inset on this axis. */
.wl-billcard{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:16px;min-height:96px;display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.wl-billlead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-billname{font:var(--wl-t2);color:var(--atelier-ink)}
/* t1, and the ONE t1 on this surface. font-variant-numeric AFTER the shorthand, which
   resets it — R-38.5 asks every figure to be tabular and the shorthand would silently
   throw the setting away if it were declared first. */
.wl-billprice{font:var(--wl-t1);color:var(--atelier-ink)}
.wl-billprice{font-variant-numeric:tabular-nums}
.wl-billbasic{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:4px 0 0}
/* A NEUTRAL CHIP. It reports the rail and stops; it is not a colour-coded verdict on her
   business. The caution tone is the only one that departs from neutral, and only where an
   action may be owed.
   (The word above was written between backticks on the first cut — inside a JS template
   literal, which ends it. ZIP 14 owned this exact mistake twice and named it: writing
   ABOUT a syntax inside that syntax. The type floor caught it again, immediately.) */
.wl-chipstatus{margin-top:8px;display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;border:.5px solid var(--atelier-card-border);font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-chipstatus.live{color:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}
.wl-chipstatus.caution{color:var(--role-caution);border-color:var(--role-caution)}
.wl-plans{display:flex;flex-direction:column;gap:8px}
.wl-billoffer{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0}
.wl-planrow{display:flex;align-items:baseline;justify-content:space-between;gap:12px;width:100%;min-height:var(--wl-row);padding:12px 16px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;cursor:pointer;text-align:left;touch-action:manipulation}
.wl-planrow[aria-expanded="true"]{border-color:var(--atelier-accent-text)}
.wl-planname{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-planprice{font:var(--wl-t4);color:var(--atelier-ink-mute);text-align:right}
.wl-planprice{font-variant-numeric:tabular-nums}
.wl-planconfirm{padding:12px 2px 4px;display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.wl-billbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0}
.wl-billaction{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 16px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;font:var(--wl-t4);color:var(--atelier-accent-text);text-decoration:none;touch-action:manipulation}
.wl-billaction.danger{border-color:var(--role-critical);color:var(--role-critical)}
.wl-billaction:active{background:var(--atelier-row-hover)}
.wl-billaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-cancel{display:flex;flex-direction:column;gap:12px}
.wl-cancelrow{display:flex;gap:8px}
.wl-cancelrow > *{flex:1}
`;
