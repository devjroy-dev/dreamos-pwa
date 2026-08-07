'use client';
// /wedding/settings — Settings · Atelier rebuild
// All PATCH-able vendor fields. Per-section save. Hooks and logic untouched.

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useSettings } from '@/hooks/vendor/useSettings';
import { useToast } from '@/hooks/vendor/useToast';
import { Toast } from '@/components/vendor/Toast';
import { Header } from '@/components/vendor/Header';
import {
  updateMe, updateRoutingHandle, updateInvoicePrefix,
  subscribeToTier, upgradeToTier, cancelSubscription,
} from '@/lib/vendor/api/vendor';
import { clearVendorSession, getVendorSession, setVendorSession } from '@/lib/vendor/session';

// TDW_07 P2 — PURE MOVE. A, F and the five form primitives now live in one home so
// Discover Profile speaks the identical grammar instead of a second copy of it. This
// screen's rendered output is unchanged; only where the code lives moved.
import { SCard, SField, SToggle, SReadRow, SaveBtn, A, F } from '@/components/vendor/AtelierForm';

// ── M2 · THE FOUNDER-VETOED STRING SET (2026-08-07, verbatim) ───────────────
// Hoisted deliberately: copy under founder veto lives in ONE readable block so
// the next reader can diff it against the veto record without reading JSX. The
// money register is law here — `Rs X,XXX`, zero rupee glyphs, zero k/L shorthand
// (money register law). Canon prices mirror src/lib/billing/razorpay.js
// TIER_PAISE, which pins them as integers so prose cannot drift them (F-10.63).
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

// ── TDW_10 BILLING v2 · THE NEW STRING SET — HELD FOR FOUNDER VETO ──────────
// Hoisted into the SAME block as the v1 set above, for the reason that block
// gives: copy under veto lives in one readable place so it can be diffed
// against the veto record without reading JSX. Every string above is UNTOUCHED
// and stays verbatim; these are the additions, and they are sent as one batch.
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
// engraved register — both named rungs. No new size enters this file, so the
// three pre-existing sub-floor sites are the only ones `tdw09_type` can see.
// Those three are F-09.105 and are NOT this delivery's to cure (chair relay #3);
// they are named here so the next reader does not mistake their survival for
// this sitting's carelessness.
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
  mintFailed:   "Couldn't reach Razorpay just now. Nothing has changed — try again in a moment.",
  cancelFailed: "Couldn't cancel just now. Your plan is unchanged — try again in a moment.",
  mintFailedAfterCancel: (label: string) =>
    `Your old plan is already stopped and the new one didn't open. You're on Basic for now — tap ${label} again to finish.`,
  notOpenYet: 'Plan changes are not open yet.',
};

export default function SettingsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <SettingsScreen vendorName={session.name ?? null} />;
}

function SettingsScreen({ vendorName }: { vendorName: string | null }) {
  const router = useRouter();
  const { current, loading, error, update, isDirty, markSaved } = useSettings();
  const { toast, show } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [handleSaved, setHandleSaved] = useState<string | null>(null);
  const [prefixCounter, setPrefixCounter] = useState<number | null>(null);

  async function saveMe(section: string, fields: (keyof typeof current)[], patch: Record<string, unknown>) {
    setSaving(section);
    try {
      const res = await updateMe(patch);
      if (!res.ok) { show((res as { error?: string }).error ?? 'Save failed.', 'error'); return; }
      markSaved(Object.fromEntries(fields.map(f => [f, current[f]])) as Parameters<typeof markSaved>[0]);
      // If name was saved, update the session so the Header reflects it immediately
      if (patch.name && typeof patch.name === 'string') {
        const existing = getVendorSession();
        if (existing) setVendorSession({ ...existing, name: patch.name });
      }
      show('Saved', 'success');
    } catch { show('Network error.', 'error'); }
    finally { setSaving(null); }
  }

  async function saveHandle() {
    setSaving('tdwlink');
    try {
      const h = current.routing_handle.trim().toUpperCase();
      const res = await updateRoutingHandle({ routing_handle: h });
      if (!res.ok) { show((res as { error?: string }).error ?? 'Save failed.', 'error'); return; }
      setHandleSaved(res.routing_handle);
      markSaved({ routing_handle: res.routing_handle });
      show('Handle updated', 'success');
    } catch { show('Network error.', 'error'); }
    finally { setSaving(null); }
  }

  async function savePrefix() {
    setSaving('invoiceprefix');
    try {
      const res = await updateInvoicePrefix({ prefix: current.invoice_prefix.trim() });
      if (!res.ok) { show((res as { error?: string }).error ?? 'Save failed.', 'error'); return; }
      setPrefixCounter(res.current_counter);
      markSaved({ invoice_prefix: res.prefix });
      show('Prefix updated', 'success');
    } catch { show('Network error.', 'error'); }
    finally { setSaving(null); }
  }

  function signOut() { clearVendorSession(); router.replace('/'); }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
    </div>
  );
  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.red }}>{error}</div>
    </div>
  );

  const handle = handleSaved ?? current.routing_handle;
  const waLink = `https://wa.me/917982159047?text=TDW-${handle.toUpperCase()}`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>Settings</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 22px calc(40px + env(safe-area-inset-bottom))' }}>

        {/* TDW_07 P2 · CE ruling §C — ONE EDITOR PER FIELD, and the criterion is
            mechanical: a field Discover RENDERS or profileScore SCORES moved to Discover
            Profile; a field serving operations or the engine stayed here. So business_name
            and city left (card headline + filter), aesthetic_tags left (vibe chips + the
            tags term), the rate pair left (starting_price + the rate term), the Instagram
            handle left (the chip + the ig term) and the travel pair left (the travel term,
            new this sitting). `name` and `style_notes` STAYED: users.name is the engine's
            greeting, and style_notes is written by WhatsApp onboarding and read by the
            admin detail view — neither is rendered or scored by Discover.
            Deep links hold: this route persists, with its remaining fields. */}
        <SCard title="Business">
          <SField label="Your Name" value={current.name} onChange={v => update({ name: v })} placeholder="Dev Roy" />
          <SField label="Style notes" value={current.style_notes} onChange={v => update({ style_notes: v })} multiline />
          <SaveBtn
            dirty={isDirty(['name', 'style_notes'])}
            loading={saving === 'business'}
            onSave={() => saveMe('business', ['name', 'style_notes'], {
              name: current.name || undefined,
              style_notes: current.style_notes || undefined,
            })}
          />
        </SCard>

        {/* FOUNDER-VETOED 2026-07-29 (copy slot 7, 「 go 」). One line where five sections
            used to be — a vendor who looks for a field that moved is told where it went,
            in the interface's own voice, with the route one tap away. */}
        <SCard title="Discover Profile">
          <button type="button" onClick={() => router.push('/vendor/discover/profile')} style={{
            background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', textAlign: 'left',
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.brassWarm,
          }}>Moved to your Discover Profile. ›</button>
        </SCard>

        <SCard title="Payments">
          <SField label="UPI ID" value={current.upi_id} onChange={v => update({ upi_id: v })} placeholder="name@bank" />
          <SField label="GSTIN" value={current.gstin} onChange={v => update({ gstin: v })} placeholder="22AAAAA0000A1Z5" />
          <SaveBtn
            dirty={isDirty(['upi_id', 'gstin'])}
            loading={saving === 'payments'}
            onSave={() => saveMe('payments', ['upi_id', 'gstin'], {
              upi_id: current.upi_id || undefined,
              gstin: current.gstin || undefined,
            })}
          />
        </SCard>

        

        {/* TDW_04 B6-S1 — surfaces item 2 (F-04.64's first half, spec P3's ruled row).
            Rendered for function artists only: capacity_applicable is computed
            BACKEND-SIDE from occupancy's one-home map — this surface holds no copy
            of the category table (F-04.36's law). '' = NULL = category default;
            0 is a lawful posture and saves as 0, never coerced (Q-SP-1).
            All strings below are on the founder's veto-on-sight list. */}
        {current.capacity_applicable && (
          <SCard title="Working Capacity">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button type="button" aria-label="Fewer" onClick={() => {
                const base = current.slot_capacity === '' ? (current.capacity_default ?? 0) : Number(current.slot_capacity);
                update({ slot_capacity: String(Math.max(0, base - 1)) });
              }} style={{
                width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
                background: 'none', border: '0.5px solid rgba(201,168,76,0.35)',
                color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1,
              }}>−</button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: F.display, fontSize: 31, color: A.ink, lineHeight: 1 }}>
                  {current.slot_capacity === ''
                    ? (current.capacity_default != null ? String(current.capacity_default) : '—')
                    : current.slot_capacity}
                </div>
                <div style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  color: A.brassWarm, marginTop: 5,
                }}>
                  {current.slot_capacity === ''
                    ? (current.capacity_default != null ? 'Category default' : 'Not counting yet')
                    : 'Bookings per slot'}
                </div>
              </div>
              <button type="button" aria-label="More" onClick={() => {
                const base = current.slot_capacity === '' ? (current.capacity_default ?? 0) : Number(current.slot_capacity);
                update({ slot_capacity: String(base + 1) });
              }} style={{
                width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
                background: 'none', border: '0.5px solid rgba(201,168,76,0.35)',
                color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1,
              }}>+</button>
            </div>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 8 }}>
              How many bookings each slot of a day can hold. The calendar refuses the one after.
            </div>
            {current.slot_capacity !== '' && (
              <button type="button" onClick={() => update({ slot_capacity: '' })} style={{
                marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.28em', textTransform: 'uppercase', color: A.brassWarm,
              }}>Use category default{current.capacity_default != null ? ` (${current.capacity_default})` : ''}</button>
            )}
            <SaveBtn
              dirty={isDirty(['slot_capacity'])}
              loading={saving === 'capacity'}
              onSave={() => saveMe('capacity', ['slot_capacity'], {
                // null is MEANINGFUL: it resets to the category default. '0' saves as 0.
                slot_capacity: current.slot_capacity === '' ? null : Number(current.slot_capacity),
              })}
            />
          </SCard>
        )}

        

        <SCard title="TDW Enquiry Link">
          <SField label="Handle" value={current.routing_handle} onChange={v => update({ routing_handle: v.toUpperCase().replace(/[^A-Z0-9]/g, '') })} placeholder="YOURHANDLE" />
          {handle && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{waLink}</div>
              <button type="button" onClick={() => navigator.clipboard.writeText(waLink).then(() => show('Link copied', 'success'))}
                style={{
                  background: 'transparent', border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2,
                  padding: '5px 10px', cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brassWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase', flexShrink: 0,
                }}>Copy</button>
            </div>
          )}
          <SaveBtn dirty={isDirty(['routing_handle'])} loading={saving === 'tdwlink'} onSave={saveHandle} />
        </SCard>

        <SCard title="Invoice Settings">
          <SField label="Invoice prefix" value={current.invoice_prefix} onChange={v => update({ invoice_prefix: v })} placeholder="TDW/DEV550" />
          {prefixCounter != null && (
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 4 }}>
              Next invoice: {current.invoice_prefix}/{String(prefixCounter + 1).padStart(2, '0')}
            </div>
          )}
          <SaveBtn
            dirty={isDirty(['invoice_prefix']) && !!current.invoice_prefix.trim()}
            loading={saving === 'invoiceprefix'}
            onSave={savePrefix}
          />
        </SCard>

        <SCard title="Morning Briefing">
          <SToggle label="Enable WhatsApp briefing" value={current.briefing_enabled} onChange={v => update({ briefing_enabled: v })} />
          <SaveBtn
            dirty={isDirty(['briefing_enabled'])}
            loading={saving === 'briefing'}
            onSave={() => saveMe('briefing', ['briefing_enabled'], { briefing_enabled: current.briefing_enabled })}
          />
        </SCard>

        {/* ── M2 · THE SUBSCRIPTION SURFACE (F-10.77's cure) ───────────────────
            Until this section, the ONLY tier byte a vendor ever saw was a
            read-only row. Her tier moved Prestige → Free at a cancel flip with
            no notice, no reason, and no action — the flip wrote truth and told
            nobody. That is F-10.77, and the flip-reason line below is its cell.

            `id="tier"` is load-bearing, not decoration: src/api/vendor-engine/
            chat.js sends `upgrade: { href: '/vendor/settings#tier' }` with every
            capped-meter message, and until now that anchor resolved to nothing —
            the button scrolled her to the top of a settings page and left her to
            hunt. Named per the mechanism-comment law so whoever moves this
            section moves the anchor with it.

            EVERY string here is founder-vetoed verbatim (2026-08-07). The date
            the first draft carried was DROPPED at his ruling: no flip timestamp
            exists anywhere in the estate — `billing_status` has no companion
            stamp, tierFlip.js writes none, and `vendors.updated_at` moves on any
            profile save, so rendering it would have printed the day she edited
            her bio as the day her plan changed. A plausible wrong date is worse
            than no date. */}
        <div id="tier">
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
                fontFamily: F.body, fontWeight: 300, fontSize: 13, lineHeight: 1.6,
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
                      fontFamily: F.body, fontWeight: 300, fontSize: 12, lineHeight: 1.6,
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

                    NOT BYTE-IDENTICAL TO THE PRE-v2 SURFACE, and that is a
                    deliberate departure from acceptance ④ as ratified. Restoring
                    the old surface would mean restoring 「 Dev will send you a
                    payment link. 」 — a sentence the founder retired WITH its
                    mechanism, and which is now simply false: Dev does not send
                    links any more. A rollback that reinstates a lie is worse than
                    a door that closes quietly. So OFF is SILENT, not nostalgic:
                    Plan, Price and Status still render, and nothing offers her an
                    action the estate cannot honour. */}
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
            {current.billing_status === 'active' && current.subscription_id && current.selfserve_enabled && (
              <CancelBlock
                label={PLAN_LABEL[current.tier] ?? 'your plan'}
                onDone={() => window.location.reload()}
                show={show}
              />
            )}
          </SCard>
        </div>

        <SCard title="Account">
          {current.founding_cohort && <SReadRow label="Status" value="Founding cohort" />}
        </SCard>

        <button type="button" onClick={signOut} style={{
          width: '100%', padding: '14px 0', marginTop: 24,
          background: 'transparent', border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2,
          cursor: 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.red,
          letterSpacing: '0.42em', textTransform: 'uppercase',
        }}>Sign Out</button>
      </div>
    </div>
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
