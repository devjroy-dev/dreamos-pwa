'use client';
// components/vendor/packages/LeadPackageCard.tsx — CE-43 · LC-2 · packet 2.
//
// The package on a lead (A1 to A9). Reads GET /leads/:leadId/package; attaches through
// POST /leads/:leadId/package (dream-os leadPackages.js, F22 (a)). The schedule, the amounts,
// the dates and the delivery day are the SERVER'S; this card renders them and computes nothing.
//
//   · none attached: `Attach package` (A2) opens the attach sheet (A3).
//   · attached: the couple's package name and fee, one A5 line per schedule row with the row's
//     own share (F26), the A6 fold tell and the A7 count tell when the server names them, the
//     A8 delivery line, and `Change package` (A2), which opens the same sheet.
//   · the attach sheet: Package (the default preselected), Fee for this couple (prefilled from the
//     package), Handover date (only for a handover package, F25), and F23's per-couple edits
//     (name, description, items) with P8's bytes. Submit is A2's `Attach package`.
//   · refusals are A9's four lines by code; any other failure is `attachFailed` (vetoed YES, C-43.16).
//   · packet 3: A2's `Booking confirmed` and `Advance paid` hand their kind to `onBook`; the shell
//     opens the one booking sheet (BookingSheet.tsx, A12). Nothing is written from this card.
//   · packet 3c: the two booking controls are ALWAYS present on a lead that is not booked.
//   · packet 3f · R-43.16: they always open the booking sheet (3c's attach-first redirect is removed,
//     F-43.104); a missing package is fixed from the booking sheet's own refusal line.
//   · packet 3f · F-43.105: the card can take its package read from the detail's own open
//     (`initial`), so it renders with the detail instead of popping in after it.
//   · C-43.16: the attach sheet's Cancel is outlined in the muted ink.
//   · the empty package option reads `Select…`, AddSheet's existing byte (as ClientBookingSheet).
// Tokens only (R-42.6). Full-month dates (R-42.13) through packageDate.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NeedFirst } from '@/components/vendor/NeedFirst';
import { MissingChips } from '@/components/vendor/MissingChips';
import { attachNeeds, type LeadFacts, type NeedCell } from '@/lib/vendor/bookingNeeds';

import {
  fetchLeadPackage, attachLeadPackage, fetchPackages,
  type LeadPackage, type VendorPackage, type PackageLineItem, type AttachInput,
} from '@/lib/vendor/api/vendor';
import {
  LEAD_PACKAGE, PACKAGES, PACKAGE_FAILURES, scheduleRow, packageDate,
} from '@/lib/worklist/packages';
import { formatRs } from '@/lib/vendor/format';
import type { ToastKind } from '@/hooks/vendor/useToast';
import type { BookingKind } from '@/lib/vendor/api/vendor';
import {
  Sheet, IdentityFields, FieldLabel, inputStyle, flagged, actionButton, primaryButton,
  wholeRupees, tidyItems, T,
} from './PackageFields';

type RefusalCode = keyof typeof LEAD_PACKAGE.refusals;
const isRefusal = (c: unknown): c is RefusalCode => typeof c === 'string' && c in LEAD_PACKAGE.refusals;

// ── CE-43 LC-2 packet 3g · F-43.107: the vendor's packages are read once per room visit ─────────
// The Leads room primes this when it mounts and clears it when it leaves; every attach sheet opened
// in between reads it synchronously, so the sheet never draws an empty form that fills in later.
let packagesCache: VendorPackage[] | null = null;
let packagesInflight: Promise<VendorPackage[]> | null = null;
export function resetPackagesCache(): void { packagesCache = null; packagesInflight = null; }
export function loadPackagesOnce(): Promise<VendorPackage[]> {
  if (packagesCache) return Promise.resolve(packagesCache);
  if (!packagesInflight) {
    packagesInflight = fetchPackages()
      .then((r) => {
        if (r && r.ok) { packagesCache = r.packages; return r.packages; }
        packagesInflight = null; // a failed read is not remembered; the next open reads again
        return [] as VendorPackage[];
      })
      .catch(() => { packagesInflight = null; return [] as VendorPackage[]; });
  }
  return packagesInflight;
}

export function LeadPackageCard({ leadId, booked = false, onBook, onToast, onNeedWeddingDate, initial, leadFacts }: {
  leadId: string;
  booked?: boolean;
  onBook?: (kind: BookingKind) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** R-43.16: the fix the attach sheet offers for `Add the wedding date first.` */
  onNeedWeddingDate: () => void;
  /** F-43.105: the package read the detail made with its own open. `undefined` means the card reads
   *  it itself (the pre-3f path); `null` or a row means it is already in, and the card renders at once. */
  initial?: LeadPackage | null;
  /** 3g: the lead's date facts, for the attach sheet's needs. */
  leadFacts: LeadFacts | null;
}) {
  const [lp, setLp] = useState<LeadPackage | null | undefined>(initial);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Packet 3f · R-43.16 (chair-ruled, F-43.104 the seat's): no redirect. The booking pair always
  // hands its kind to the booking sheet; a missing package is fixed from the booking sheet's own
  // refusal line, and `Attach package` above stays this card's own control.
  const book = (k: BookingKind) => { if (onBook) onBook(k); };

  const load = useCallback(async () => {
    try {
      const r = await fetchLeadPackage(leadId);
      setLp(r && r.ok ? r.lead_package : null);
    } catch { setLp(null); }
  }, [leadId]);
  useEffect(() => {
    if (initial !== undefined) { setLp(initial); return; }
    setLp(undefined); void load();
  }, [load, initial]);

  const eyebrow = (
    <span style={{ fontFamily: T.label, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.mute }}>
      {LEAD_PACKAGE.eyebrow}
    </span>
  );

  return (
    // CE-43 LC-2 packet 3d · F-43.97 (a): the card leads the detail body (3c, 1(a)), so it closes
    // with spacing and a hairline before the detail rows. One aligned control column follows the
    // package: Attach package / Change package full width, then the two booking controls as an
    // exactly equal pair (a two-column grid). Tokens only, so Chalk and Graphite both resolve.
    <div data-lc2="lead-package" style={{ paddingBottom: 18, marginBottom: 8, borderBottom: `0.5px solid ${T.card}` }}>
      <div>{eyebrow}</div>
      {lp && (
        <div data-lc2="lead-package-attached" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: T.display, fontSize: 22, lineHeight: 1.2, color: T.ink }}>{lp.snapshot.name}</span>
            <span style={{ fontFamily: T.display, fontSize: 20, color: T.ink, whiteSpace: 'nowrap' }}>{formatRs(lp.total)}</span>
          </div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lp.schedule.map((row) => (
              <li key={row.kind} style={{ fontFamily: T.body, fontSize: 14, lineHeight: 1.45, color: T.ink }}>
                {scheduleRow(row.kind, row.pct, formatRs(row.amount), row.due_on)}
              </li>
            ))}
          </ul>
          {lp.snapshot.tells.includes('middle_folded') && (
            <p style={{ margin: '8px 0 0', fontFamily: T.body, fontSize: 13, color: T.mute }}>{LEAD_PACKAGE.folded}</p>
          )}
          <p style={{ margin: '8px 0 0', fontFamily: T.body, fontSize: 13, color: T.mute }}>{LEAD_PACKAGE.delivery(packageDate(lp.delivery_on))}</p>
          {lp.snapshot.tells.includes('counted_from_wedding') && (
            <p style={{ margin: '4px 0 0', fontFamily: T.body, fontSize: 13, color: T.mute }}>{LEAD_PACKAGE.counted}</p>
          )}
        </div>
      )}
      {lp !== undefined && (
        <div data-lc2="lead-package-controls" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          <button type="button" style={actionButton()} onClick={() => setSheetOpen(true)}>
            {lp ? LEAD_PACKAGE.change : LEAD_PACKAGE.attach}
          </button>
          {!booked && onBook && (
            <div data-lc2="lead-booking-controls" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button type="button" style={{ ...actionButton(), width: '100%' }} onClick={() => book('booking_confirmed')}>{LEAD_PACKAGE.bookingConfirmed}</button>
              <button type="button" style={{ ...actionButton(), width: '100%' }} onClick={() => book('advance_paid')}>{LEAD_PACKAGE.advancePaid}</button>
            </div>
          )}
        </div>
      )}
      <AttachSheet
        open={sheetOpen}
        leadId={leadId}
        current={lp || null}
        onClose={() => setSheetOpen(false)}
        onAttached={(row) => { setLp(row); setSheetOpen(false); }}
        onToast={onToast}
        onNeedWeddingDate={onNeedWeddingDate}
        leadFacts={leadFacts}
      />
    </div>
  );
}

// CE-43 LC-2 packet 3e · F-43.102: exported so the booking sheet opens this same sheet.
// Packet 3f · R-43.16: every refusal line here is a NeedFirst control. A missing package, fee or
// handover date focuses its own field in this sheet; a missing wedding date asks the caller to
// open the lead's wedding-date completion (`onNeedWeddingDate`), and this sheet stays open under
// it. `focus` opens the sheet on the fee or handover field. F-43.105: while the vendor's packages
// load, the sheet shows a still placeholder, never an empty form that fills in later.
export function AttachSheet({ open, leadId, current, onClose, onAttached, onToast, onNeedWeddingDate, focus = null, leadFacts }: {
  open: boolean; leadId: string; current: LeadPackage | null;
  onClose: () => void; onAttached: (row: LeadPackage) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** R-43.16: the fix for `Add the wedding date first.` Required wherever this sheet can refuse it. */
  onNeedWeddingDate: () => void;
  focus?: 'fee' | 'handover' | null;
  /** 3g: the lead's date facts, from the Leads room's own read; null when unknown. */
  leadFacts: LeadFacts | null;
}) {
  const [packages, setPackages] = useState<VendorPackage[] | null>(packagesCache);
  // 3g: set once the vendor taps Attach package with something missing; the chips then track it.
  const [asked, setAsked] = useState(false);
  const [packageId, setPackageId] = useState('');
  const [fee, setFee] = useState('');
  const [handover, setHandover] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<PackageLineItem[]>([]);
  const [need, setNeed] = useState<{ text: string; fix: () => void } | null>(null);
  const [bad, setBad] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const focusOn = useCallback((id: string) => {
    const el = bodyRef.current ? bodyRef.current.querySelector<HTMLElement>(`#${id}`) : null;
    if (el) el.focus();
  }, []);

  const chosen = useMemo(() => (packages || []).find((p) => p.id === packageId) || null, [packages, packageId]);

  const fillFrom = useCallback((p: VendorPackage | null) => {
    setFee(p && p.total != null ? String(p.total) : '');
    setName(p ? p.name : '');
    setDescription(p ? p.description : '');
    setItems(p ? p.line_items.map((x) => ({ ...x })) : []);
    setHandover('');
  }, []);

  useEffect(() => {
    if (!open) return;
    setNeed(null); setBad(null); setBusy(false); setAsked(false);
    let alive = true;
    void loadPackagesOnce().then((list) => {
      if (!alive) return;
      setPackages(list);
      const pick = (current && list.find((p) => p.id === current.package_id))
        || list.find((p) => p.is_default) || null;
      setPackageId(pick ? pick.id : '');
      fillFrom(pick);
    });
    return () => { alive = false; };
  }, [open, current, fillFrom]);

  // `focus` opens the sheet on the field the booking sheet's refusal named, once the form exists.
  useEffect(() => {
    if (!open || packages === null || !focus) return;
    focusOn(focus === 'fee' ? 'att-fee' : 'att-handover');
  }, [open, packages, focus, focusOn]);

  // R-43.16: each refusal code names its own fix.
  const needFor = (code: RefusalCode) => ({
    text: LEAD_PACKAGE.refusals[code],
    fix: code === 'no_wedding_date' ? onNeedWeddingDate
      : code === 'no_fee' ? () => focusOn('att-fee')
      : code === 'no_handover_date' ? () => focusOn('att-handover')
      : () => focusOn('att-pkg'),
  });
  const needForField = (field: string) => ({
    text: field === 'name' ? PACKAGE_FAILURES.nameGate : PACKAGE_FAILURES.fieldGate,
    fix: () => focusOn(field === 'name' ? 'pkg-name' : field === 'description' ? 'pkg-desc' : field === 'total' ? 'att-fee' : field === 'delivery_on' ? 'att-handover' : 'att-pkg'),
  });

  // 3g: what this attach lacks right now, and each chip's own fix (R-43.16).
  const needsNow: NeedCell[] = attachNeeds({ chosen, fee: wholeRupees(fee), handover, lead: leadFacts });
  const pickNeed = (cell: string) => {
    if (cell === 'wedding_date') onNeedWeddingDate();
    else focusOn(cell === 'fee' ? 'att-fee' : cell === 'handover' ? 'att-handover' : 'att-pkg');
  };

  async function submit() {
    if (busy) return;
    if (needsNow.length) {
      setAsked(true); setNeed(null);
      onToast(LEAD_PACKAGE.stillMissing(needsNow.map((c) => LEAD_PACKAGE.needLabel[c])), 'error');
      return;
    }
    if (!chosen) { setNeed(needFor('no_package')); setBad('package_id'); return; }
    const body: AttachInput = { package_id: chosen.id };
    const total = wholeRupees(fee);
    if (total != null && total !== chosen.total) body.total = total;
    if (name.trim() !== chosen.name) body.name = name.trim();
    if (description.trim() !== chosen.description) body.description = description.trim();
    const tidy = tidyItems(items);
    if (JSON.stringify(tidy) !== JSON.stringify(chosen.line_items)) body.line_items = tidy;
    if (chosen.delivery_basis === 'handover' && handover) body.delivery_on = handover;
    setBusy(true); setNeed(null); setBad(null);
    try {
      const r = await attachLeadPackage(leadId, body);
      if (r && r.ok && 'lead_package' in r) { onAttached(r.lead_package); return; }
      const code = r && !r.ok && 'code' in r ? r.code : undefined;
      const field = r && !r.ok && 'field' in r ? r.field : undefined;
      if (isRefusal(code)) {
        setNeed(needFor(code));
        setBad(code === 'no_fee' ? 'total' : code === 'no_handover_date' ? 'delivery_on' : null);
      } else if (field) {
        setBad(field);
        setNeed(needForField(field));
      } else onToast(PACKAGE_FAILURES.attachFailed, 'error');
    } catch {
      onToast(PACKAGE_FAILURES.attachFailed, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet
      open={open}
      testId="attach-sheet"
      title={LEAD_PACKAGE.sheetTitle}
      onClose={onClose}
      footer={(
        <>
          <button type="button" style={actionButton('mute')} onClick={onClose}>{PACKAGES.cancel}</button>
          <button type="button" style={primaryButton()} onClick={() => { void submit(); }} aria-busy={busy}>{LEAD_PACKAGE.attach}</button>
        </>
      )}
    >
      <div ref={bodyRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {asked && (
        <MissingChips testId="attach" onPick={pickNeed}
          cells={needsNow.map((c) => ({ key: c, label: LEAD_PACKAGE.needLabel[c] }))} />
      )}
      {need && <NeedFirst text={need.text} onFix={need.fix} testId="attach" />}
      {/* F-43.107: no still placeholder. The list is primed by the room, so this waits only on a
          cold first open, and then shows nothing until the whole form can render at once. */}
      {packages !== null && (<>
      <div>
        <FieldLabel text={LEAD_PACKAGE.fPackage} htmlFor="att-pkg" />
        <select id="att-pkg" style={{ ...inputStyle, ...(bad === 'package_id' ? flagged : {}) }} value={packageId}
          onChange={(e) => { setPackageId(e.target.value); fillFrom(packages.find((p) => p.id === e.target.value) || null); setNeed(null); }}>
          <option value="" disabled>Select…</option>
          {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <FieldLabel text={LEAD_PACKAGE.fFee} htmlFor="att-fee" />
        <input id="att-fee" inputMode="numeric" style={{ ...inputStyle, ...(bad === 'total' ? flagged : {}) }} value={fee}
          onChange={(e) => setFee(e.target.value.replace(/[^\d]/g, ''))} />
      </div>
      {chosen && chosen.delivery_basis === 'handover' && (
        <div>
          <FieldLabel text={LEAD_PACKAGE.fHandover} htmlFor="att-handover" />
          <input id="att-handover" type="date" style={{ ...inputStyle, ...(bad === 'delivery_on' ? flagged : {}) }} value={handover}
            onChange={(e) => setHandover(e.target.value)} />
        </div>
      )}
      {chosen && (
        <IdentityFields name={name} description={description} items={items}
          onName={setName} onDescription={setDescription} onItems={setItems} badField={bad} />
      )}
      </>)}
      </div>
    </Sheet>
  );
}
