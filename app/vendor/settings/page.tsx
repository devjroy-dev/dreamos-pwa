// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
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
// TDW_10 THE BILLING TAB — `subscribeToTier`, `upgradeToTier` and
// `cancelSubscription` left this import with the surface that called them. Their
// one home is now `components/vendor/SubscriptionCard.tsx`.
import { updateMe, updateRoutingHandle, updateInvoicePrefix } from '@/lib/vendor/api/vendor';
import { clearVendorSession, getVendorSession, setVendorSession } from '@/lib/vendor/session';

// TDW_07 P2 — PURE MOVE. A, F and the five form primitives now live in one home so
// Discover Profile speaks the identical grammar instead of a second copy of it. This
// screen's rendered output is unchanged; only where the code lives moved.
import { SCard, SField, SToggle, SReadRow, SaveBtn, A, F } from '@/components/vendor/AtelierForm';

// ── TDW_10 THE BILLING TAB — THE VETOED STRING BLOCK LEFT WITH ITS SURFACE ──
// `PLAN_LABEL`, `PLAN_PRICE`, `BILLING_STATUS` and the `V2` set stood here.
// Every one of them existed to be rendered by the Subscription card, and that
// card now lives at `components/vendor/SubscriptionCard.tsx`. The block moved
// WHOLE and byte-unchanged: its entire warrant is that copy under founder veto
// sits in ONE readable place, so splitting it across two files to save an
// import would have destroyed the property it exists for.
//
// Nothing on this page renders money any more. The money register still binds
// the estate; it simply has no site here.

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
      <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
    </div>
  );
  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.red }}>{error}</div>
    </div>
  );

  const handle = handleSaved ?? current.routing_handle;
  const waLink = `https://wa.me/917982159047?text=TDW-${handle.toUpperCase()}`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.interactiveWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
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
            fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.interactiveWarm,
          }}>{/* R-37.84 (4): branch-only. A transition-era pointer is noise in a shell whose grid
                    IS the directory — Discover Profile has a room. `main` keeps the pointer. */}</button>
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
                /* F-09.121 CURED — see F-09.119 (app/vendor/tds/page.tsx FAB).
                   Same disease: −/+ set in the display serif, which has no drawn
                   glyph for either. Cured as a PAIR (Fork 4(a)) — curing one and
                   leaving the other is two faces on one control. F.body 20. */
                color: A.interactiveWarm, fontFamily: F.body, fontSize: 20, lineHeight: 1,
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
                /* F-09.121 CURED — see F-09.119 (app/vendor/tds/page.tsx FAB).
                   Same disease: −/+ set in the display serif, which has no drawn
                   glyph for either. Cured as a PAIR (Fork 4(a)) — curing one and
                   leaving the other is two faces on one control. F.body 20. */
                color: A.interactiveWarm, fontFamily: F.body, fontSize: 20, lineHeight: 1,
              }}>+</button>
            </div>
            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 8 }}>
              How many bookings each slot of a day can hold. The calendar refuses the one after.
            </div>
            {current.slot_capacity !== '' && (
              <button type="button" onClick={() => update({ slot_capacity: '' })} style={{
                marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.28em', textTransform: 'uppercase', color: A.interactiveWarm,
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
              <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{waLink}</div>
              <button type="button" onClick={() => navigator.clipboard.writeText(waLink).then(() => show('Link copied', 'success'))}
                style={{
                  background: 'transparent', border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2,
                  padding: '5px 10px', cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.interactiveWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase', flexShrink: 0,
                }}>Copy</button>
            </div>
          )}
          <SaveBtn dirty={isDirty(['routing_handle'])} loading={saving === 'tdwlink'} onSave={saveHandle} />
        </SCard>

        <SCard title="Invoice Settings">
          <SField label="Invoice prefix" value={current.invoice_prefix} onChange={v => update({ invoice_prefix: v })} placeholder="TDW/DEV550" />
          {prefixCounter != null && (
            <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 4 }}>
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

        {/* ── TDW_10 THE BILLING TAB · THE SIGNPOST (R-26.4, Fork B) ─────────
            The Subscription card stood here and has moved to /vendor/billing,
            reachable from the profile coin. What stays is a line telling a
            vendor who looks for billing in Settings where it went — in the
            interface's own voice, with the route one tap away. That shape is
            NOT invented here: it is the `<SCard title="Discover Profile">`
            precedent earlier in this same file, which did exactly this when its
            fields left.

            THE SIGNPOST IS PERMANENT. Ruled. A vendor who reaches for billing
            in the place it used to live should always find the way out, not
            only during a migration window.

            ── `id="tier"` IS TEMPORARY, AND THIS IS ITS RETIREMENT CONDITION ──
            (mechanism-comment law, F-06.85 — named here so the sitting that
            moves the address is forced to read this sentence.)

            dream-os `src/api/vendor-engine/chat.js` sends
            `upgrade: { label: 'Upgrade', href: '/vendor/settings#tier' }` with
            every capped-meter message, and it is the SOLE `#tier` reference and
            the SOLE `/vendor/settings` link in the entire backend (grep-derived
            across `src/`, one hit). The PWA hardcodes nothing:
            `components/vendor/TierMeter.tsx`'s `TierMeter` renders that href as
            a bare <a>, so the address arrives ON THE WIRE from Railway.

            THEREFORE THIS ANCHOR RETIRES ON TWO EVENTS, NOT ONE:
              (1) the combined-cap sitting re-points chat.js to '/vendor/billing'
                  (no fragment — the page IS the picker), AND
              (2) Railway redeploys dream-os so the new href is actually served.
            Until BOTH have happened, deleting this `id` breaks the Upgrade link
            for every capped vendor. After both, it is dead weight and goes.

            F-10.101 RIDES THIS BLOCK: on a cold load the anchor may never have
            scrolled at all — `id="tier"` mounts only after the /me fetch
            resolves (see the `Loading…` return above), and the browser resolves
            a fragment at load. Whether it scrolls is a RACE against the load
            event. The signpost is honest under either outcome: it is visible
            wherever the page lands. */}
        <div id="tier">
          <SCard title="Subscription">
            <button type="button" onClick={() => router.push('/vendor/billing')} style={{
              background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', textAlign: 'left',
              fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.interactiveWarm,
            }}>{/* R-37.84 (4): branch-only — Billing has a tile. */}</button>
          </SCard>
        </div>

        {/* ── F-10.106 CURED (R-26.18, Fork 4) · THE FRAME TAKES THE GATE ────
            The condition stood on the ROW while the CARD stood unconditional,
            so every vendor outside the founding cohort read a brass ACCOUNT
            label over emptiness — `app/vendor/more/page.tsx`'s own warrant
            names the class: chrome pretending to be structure. Pre-existing,
            and made conspicuous the moment the Subscription card left from
            above it.

            WRAPPED, NOT RETIRED, and that is ruled. Wire-or-delete-at-birth
            governs controls born UNWIRED; this row is wired and true — it
            renders a real value from `vendors.founding_cohort` for the cohort
            it was built for. Retiring the card would delete a live surface from
            those vendors in order to cure a frame. The defect was never the
            card; it was a frame that was unconditional while its only content
            was conditional. The condition moves up one level. Zero copy bytes.

            IF A SECOND ROW EVER JOINS THIS CARD, this gate is wrong and must
            move back down to the row — the card would then hold content that is
            true of every vendor. Named here so that sitting is forced to read
            this sentence (F-06.85). */}
        {current.founding_cohort && (
          <SCard title="Account">
            <SReadRow label="Status" value="Founding cohort" />
          </SCard>
        )}

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

// TDW_10 THE BILLING TAB — `TierPicker` and `CancelBlock` were defined below
// this line and moved WHOLE to `components/vendor/SubscriptionCard.tsx` under
// R-26.4 Fork D. Rendered output unchanged; only the code's home moved. The
// warrant is F-09.128, the live specimen: this page file is shared with the
// PAUSED razorpay v2 session, and two sessions editing one page file eleven
// minutes apart already wiped F-10.92's kill switch once.
