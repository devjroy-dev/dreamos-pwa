'use client';
// components/vendor/packages/PackageEditSheet.tsx — CE-43 · LC-2 · packet 2.
//
// Create (no `pkg`) or edit a package: P8 to P10, Save and Cancel (P6), the toast P12.
// C-43.16 condition 2: the room's "Fee not set" opens THIS sheet with the Fee field focused
// (`focusFee`); the dashed underline in the room is honest only because this handler exists.
//
// GATES before the door (the pending failure bytes): a blank name, and shares that leave no
// remainder. Everything else is the door's refusal (422 `invalid` + field), which flags the
// field and says `fieldGate`. A network or 500 failure says `saveFailed`. The money shown
// anywhere else is the server's; this sheet only collects whole-rupee input.
import { useEffect, useRef, useState } from 'react';
import {
  createPackage, updatePackage,
  type VendorPackage, type PackageLineItem, type PackageInput,
} from '@/lib/vendor/api/vendor';
import { PACKAGES, PACKAGE_FAILURES } from '@/lib/worklist/packages';
import type { ToastKind } from '@/hooks/vendor/useToast';
import {
  Sheet, IdentityFields, FieldLabel, inputStyle, flagged, textButton, primaryButton,
  wholeRupees, tidyItems, T,
} from './PackageFields';

type Basis = 'on_the_day' | 'days' | 'handover';

export function PackageEditSheet({ open, pkg, focusFee, onClose, onSaved, onToast }: {
  open: boolean;
  pkg: VendorPackage | null;
  focusFee: boolean;
  onClose: () => void;
  onSaved: (p: VendorPackage) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<PackageLineItem[]>([]);
  const [fee, setFee] = useState('');
  const [deposit, setDeposit] = useState('30');
  const [middle, setMiddle] = useState('30');
  const [takeMiddle, setTakeMiddle] = useState(true);
  const [basis, setBasis] = useState<Basis>('on_the_day');
  const [days, setDays] = useState('');
  const [bad, setBad] = useState<string | null>(null);
  const [gate, setGate] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const feeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(pkg ? pkg.name : '');
    setDescription(pkg ? pkg.description : '');
    setItems(pkg ? pkg.line_items.map((x) => ({ ...x })) : [{ label: '', detail: '' }]);
    setFee(pkg && pkg.total != null ? String(pkg.total) : '');
    setDeposit(String(pkg ? pkg.deposit_pct : 30));
    setMiddle(String(pkg ? pkg.middle_pct : 30));
    setTakeMiddle(pkg ? pkg.middle_enabled : true);
    setBasis(pkg ? pkg.delivery_basis : 'on_the_day');
    setDays(pkg && pkg.delivery_days != null ? String(pkg.delivery_days) : '');
    setBad(null); setGate(null); setBusy(false);
    if (focusFee) {
      const t = setTimeout(() => feeRef.current?.focus(), 340);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, pkg, focusFee]);

  const intOr = (v: string) => (v.trim() === '' ? NaN : Number(v));

  async function save() {
    if (busy) return;
    const d = intOr(deposit);
    const m = intOr(middle);
    if (!name.trim()) { setBad('name'); setGate(PACKAGE_FAILURES.nameGate); return; }
    if (Number.isInteger(d) && Number.isInteger(m) && d + (takeMiddle ? m : 0) >= 100) {
      setBad('remainder'); setGate(PACKAGE_FAILURES.remainderGate); return;
    }
    const body: PackageInput = {
      name: name.trim(),
      description: description.trim(),
      line_items: tidyItems(items),
      total: wholeRupees(fee),
      deposit_pct: d,
      middle_pct: m,
      middle_enabled: takeMiddle,
      delivery_basis: basis,
      delivery_days: basis === 'days' ? intOr(days) : null,
    };
    setBusy(true); setBad(null); setGate(null);
    try {
      const r = pkg ? await updatePackage(pkg.id, body) : await createPackage(body);
      if (r && r.ok && 'package' in r) { onToast(PACKAGES.saved); onSaved(r.package); onClose(); return; }
      const field = r && !r.ok && 'field' in r ? (r.field as string | undefined) : undefined;
      if (field) {
        setBad(field);
        setGate(field === 'remainder' ? PACKAGE_FAILURES.remainderGate : field === 'name' ? PACKAGE_FAILURES.nameGate : PACKAGE_FAILURES.fieldGate);
      } else onToast(PACKAGE_FAILURES.saveFailed, 'error');
    } catch {
      onToast(PACKAGE_FAILURES.saveFailed, 'error');
    } finally {
      setBusy(false);
    }
  }

  const share = (field: 'deposit_pct' | 'middle_pct') => (bad === field || bad === 'remainder' ? flagged : {});

  return (
    <Sheet
      open={open}
      testId="package-edit-sheet"
      title={pkg ? pkg.name : PACKAGES.add}
      onClose={onClose}
      footer={(
        <>
          <button type="button" style={textButton('mute')} onClick={onClose}>{PACKAGES.cancel}</button>
          <button type="button" style={primaryButton()} onClick={() => { void save(); }} aria-busy={busy}>{PACKAGES.save}</button>
        </>
      )}
    >
      {gate && <p role="alert" style={{ margin: 0, fontFamily: T.body, fontSize: 14, color: T.accent }}>{gate}</p>}
      <IdentityFields name={name} description={description} items={items}
        onName={setName} onDescription={setDescription} onItems={setItems} badField={bad} />
      <div>
        <FieldLabel text={PACKAGES.fFee} htmlFor="pkg-fee" />
        <input id="pkg-fee" ref={feeRef} inputMode="numeric" style={{ ...inputStyle, ...(bad === 'total' ? flagged : {}) }}
          value={fee} onChange={(e) => setFee(e.target.value.replace(/[^\d]/g, ''))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
        <div>
          <FieldLabel text={PACKAGES.fDeposit} htmlFor="pkg-dep" />
          <input id="pkg-dep" inputMode="numeric" style={{ ...inputStyle, ...share('deposit_pct') }} value={deposit} onChange={(e) => setDeposit(e.target.value.replace(/[^\d]/g, ''))} />
        </div>
        <div>
          <FieldLabel text={PACKAGES.fMiddle} htmlFor="pkg-mid" />
          <input id="pkg-mid" inputMode="numeric" disabled={!takeMiddle} style={{ ...inputStyle, opacity: takeMiddle ? 1 : 0.5, ...share('middle_pct') }} value={middle} onChange={(e) => setMiddle(e.target.value.replace(/[^\d]/g, ''))} />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.body, fontSize: 15, color: T.ink, minHeight: 44 }}>
        <input type="checkbox" checked={takeMiddle} onChange={(e) => setTakeMiddle(e.target.checked)} style={{ width: 20, height: 20, accentColor: T.accent }} />
        {PACKAGES.fTakeMiddle}
      </label>
      <div>
        <FieldLabel text={PACKAGES.fDelivery} htmlFor="pkg-basis" />
        <select id="pkg-basis" style={{ ...inputStyle, ...(bad === 'delivery_basis' ? flagged : {}) }} value={basis} onChange={(e) => setBasis(e.target.value as Basis)}>
          <option value="on_the_day">{PACKAGES.dOnTheDay}</option>
          <option value="days">{PACKAGES.dDays}</option>
          <option value="handover">{PACKAGES.dHandover}</option>
        </select>
      </div>
      {basis === 'days' && (
        <div>
          <FieldLabel text={PACKAGES.fDays} htmlFor="pkg-days" />
          <input id="pkg-days" inputMode="numeric" style={{ ...inputStyle, ...(bad === 'delivery_days' ? flagged : {}) }} value={days} onChange={(e) => setDays(e.target.value.replace(/[^\d]/g, ''))} />
        </div>
      )}
    </Sheet>
  );
}
