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
//   · refusals are A9's four lines by code; any other failure is `attachFailed` (pending veto).
//   · the empty package option reads `Select…`, AddSheet's existing byte (as ClientBookingSheet).
// Tokens only (R-42.6). Full-month dates (R-42.13) through packageDate.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchLeadPackage, attachLeadPackage, fetchPackages,
  type LeadPackage, type VendorPackage, type PackageLineItem, type AttachInput,
} from '@/lib/vendor/api/vendor';
import {
  LEAD_PACKAGE, PACKAGES, PACKAGE_FAILURES, scheduleRow, packageDate,
} from '@/lib/worklist/packages';
import { formatRs } from '@/lib/vendor/format';
import type { ToastKind } from '@/hooks/vendor/useToast';
import {
  Sheet, IdentityFields, FieldLabel, inputStyle, flagged, textButton, actionButton, primaryButton,
  wholeRupees, tidyItems, T,
} from './PackageFields';

type RefusalCode = keyof typeof LEAD_PACKAGE.refusals;
const isRefusal = (c: unknown): c is RefusalCode => typeof c === 'string' && c in LEAD_PACKAGE.refusals;

export function LeadPackageCard({ leadId, onToast }: { leadId: string; onToast: (msg: string, kind?: ToastKind) => void }) {
  const [lp, setLp] = useState<LeadPackage | null | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetchLeadPackage(leadId);
      setLp(r && r.ok ? r.lead_package : null);
    } catch { setLp(null); }
  }, [leadId]);
  useEffect(() => { setLp(undefined); void load(); }, [load]);

  const eyebrow = (
    <span style={{ fontFamily: T.label, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.mute }}>
      {LEAD_PACKAGE.eyebrow}
    </span>
  );

  return (
    <div data-lc2="lead-package" style={{ marginTop: 18, paddingTop: 18, borderTop: `0.5px solid ${T.card}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {eyebrow}
        <span style={{ flex: 1 }} />
        {lp !== undefined && (
          <button type="button" style={actionButton()} onClick={() => setSheetOpen(true)}>
            {lp ? LEAD_PACKAGE.change : LEAD_PACKAGE.attach}
          </button>
        )}
      </div>
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
      <AttachSheet
        open={sheetOpen}
        leadId={leadId}
        current={lp || null}
        onClose={() => setSheetOpen(false)}
        onAttached={(row) => { setLp(row); setSheetOpen(false); }}
        onToast={onToast}
      />
    </div>
  );
}

function AttachSheet({ open, leadId, current, onClose, onAttached, onToast }: {
  open: boolean; leadId: string; current: LeadPackage | null;
  onClose: () => void; onAttached: (row: LeadPackage) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}) {
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [packageId, setPackageId] = useState('');
  const [fee, setFee] = useState('');
  const [handover, setHandover] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<PackageLineItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [bad, setBad] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const chosen = useMemo(() => packages.find((p) => p.id === packageId) || null, [packages, packageId]);

  const fillFrom = useCallback((p: VendorPackage | null) => {
    setFee(p && p.total != null ? String(p.total) : '');
    setName(p ? p.name : '');
    setDescription(p ? p.description : '');
    setItems(p ? p.line_items.map((x) => ({ ...x })) : []);
    setHandover('');
  }, []);

  useEffect(() => {
    if (!open) return;
    setMessage(null); setBad(null); setBusy(false);
    let alive = true;
    void fetchPackages().then((r) => {
      if (!alive || !r || !r.ok) return;
      setPackages(r.packages);
      const pick = (current && r.packages.find((p) => p.id === current.package_id))
        || r.packages.find((p) => p.is_default) || null;
      setPackageId(pick ? pick.id : '');
      fillFrom(pick);
    }).catch(() => { /* the select stays empty; submit then refuses with A9's first line */ });
    return () => { alive = false; };
  }, [open, current, fillFrom]);

  async function submit() {
    if (busy) return;
    if (!chosen) { setMessage(LEAD_PACKAGE.refusals.no_package); setBad('package_id'); return; }
    const body: AttachInput = { package_id: chosen.id };
    const total = wholeRupees(fee);
    if (total != null && total !== chosen.total) body.total = total;
    if (name.trim() !== chosen.name) body.name = name.trim();
    if (description.trim() !== chosen.description) body.description = description.trim();
    const tidy = tidyItems(items);
    if (JSON.stringify(tidy) !== JSON.stringify(chosen.line_items)) body.line_items = tidy;
    if (chosen.delivery_basis === 'handover' && handover) body.delivery_on = handover;
    setBusy(true); setMessage(null); setBad(null);
    try {
      const r = await attachLeadPackage(leadId, body);
      if (r && r.ok && 'lead_package' in r) { onAttached(r.lead_package); return; }
      const code = r && !r.ok && 'code' in r ? r.code : undefined;
      const field = r && !r.ok && 'field' in r ? r.field : undefined;
      if (isRefusal(code)) {
        setMessage(LEAD_PACKAGE.refusals[code]);
        setBad(code === 'no_fee' ? 'total' : code === 'no_handover_date' ? 'delivery_on' : null);
      } else if (field) {
        setBad(field);
        setMessage(field === 'name' ? PACKAGE_FAILURES.nameGate : PACKAGE_FAILURES.fieldGate);
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
          <button type="button" style={textButton('mute')} onClick={onClose}>{PACKAGES.cancel}</button>
          <button type="button" style={primaryButton()} onClick={() => { void submit(); }} aria-busy={busy}>{LEAD_PACKAGE.attach}</button>
        </>
      )}
    >
      {message && <p role="alert" style={{ margin: 0, fontFamily: T.body, fontSize: 14, color: T.accent }}>{message}</p>}
      <div>
        <FieldLabel text={LEAD_PACKAGE.fPackage} htmlFor="att-pkg" />
        <select id="att-pkg" style={{ ...inputStyle, ...(bad === 'package_id' ? flagged : {}) }} value={packageId}
          onChange={(e) => { setPackageId(e.target.value); fillFrom(packages.find((p) => p.id === e.target.value) || null); }}>
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
    </Sheet>
  );
}
