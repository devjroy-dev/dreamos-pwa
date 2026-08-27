'use client';
// components/vendor/slices/WishboneSheet.tsx — TDW_04 A1 (spec Part A1, ST-1;
// absorbs TDW_02 P3's dormant charter — recordCompleteness.js names this block
// as sole consumer/amender of the wire).
//
// The wishbone: a missing-cell chip, tapped, opens this sheet — complete the
// cell inline through the REAL door (PATCH /leads/:id for leads; POST
// /binders/:v/:id/edit for binders — wire truth, verified at HEAD 5773888),
// or hand it to Victor with a primer the cursor lands after.
//
// LAWS CARRIED:
// - Prefill-not-fire (standing primer grammar, CE micro-ruling 2): tell_victor
//   navigates with the Hub's real `draft` param and NEVER auto-sends. The
//   primer grammar mirrors the wire's own: "About <label>: the <cell> is ".
// - Binder `amount` NEVER completes inline here — donna_edit refuses money by
//   design (witnessed-door law); the amount chip routes to Victor only.
// - One door, both callers: this sheet calls the same updateLead/editBinder
//   fns the edit sheets use — no second write path.
// - Writes invalidate via the caller's onSaved (the F2 lesson: raw fetches
//   bypass the bus; these callers refetch through their owners).

import { useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useRouter } from 'next/navigation';
import { A, F, cap } from './SliceRow';

// One vocabulary, both planes (leads: draftContracts LEAD_EXPECTED; binders:
// recordCompleteness RECORD_EXPECTED — names verified against HEAD).
const FIELD_META: Record<string, { label: string; input: 'text' | 'tel' | 'date' | 'number'; placeholder: string; victorOnly?: boolean }> = {
  // lead cells → PATCH /leads/:id (updateLead EDITABLE set)
  name:          { label: 'Name',         input: 'text',   placeholder: 'Their name' },
  phone:         { label: 'Phone',        input: 'tel',    placeholder: '10-digit number' },
  wedding_date:  { label: 'Wedding date', input: 'date',   placeholder: '' },
  wedding_city:  { label: 'City',         input: 'text',   placeholder: 'Wedding city' },
  budget_max:    { label: 'Budget',       input: 'number', placeholder: 'Rs' },
  // binder cells → POST /binders/:v/:id/edit (donna_edit set)
  client:        { label: 'Client name',  input: 'text',   placeholder: 'Their name' },
  date:          { label: 'Date',         input: 'date',   placeholder: '' },
  // money is edited with Victor — the witnessed door. Inline refused by law.
  amount:        { label: 'Amount',       input: 'number', placeholder: 'Rs', victorOnly: true },
};

function chipLabel(cell: string): string {
  return FIELD_META[cell]?.label ?? cap(cell.replace(/_/g, ' '));
}

export function WishboneSheet({ missing, personLabel, onComplete, onDone }: {
  /** The wire's missing cells, in the wire's order. */
  missing: string[];
  /** The person the primer names ("this lead"/"this binder" fallback upstream). */
  personLabel: string;
  /** Complete one cell through the real door. Resolves to null on success,
      or an error string to show inline. Caller refetches on success. */
  onComplete: (cell: string, value: string) => Promise<string | null>;
  /** Called after the last cell completes, or on explicit close. */
  onDone: () => void;
}) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<string[]>(missing);
  const [active, setActive] = useState<string | null>(missing[0] ?? null);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function tellVictor(cell: string) {
    // Prefill-not-fire: the Hub's prefill param is `draft` (composer
    // initialValue) — `primer` without autoSend=1 is a no-op. Verified code
    // truth (TDW_03 drift log); the grammar mirrors the wire's tell_victor.
    const primer = `About ${personLabel}: the ${chipLabel(cell).toLowerCase()} is `;
    router.push(`/vendor?draft=${encodeURIComponent(primer)}`);
  }

  async function save() {
    if (!active || saving) return;
    const v = value.trim();
    if (!v) { setError('Nothing to file yet.'); return; }
    setSaving(true); setError(null);
    const err = await onComplete(active, v);
    setSaving(false);
    if (err) { setError(err); return; }
    const rest = remaining.filter(c => c !== active);
    setRemaining(rest);
    setValue('');
    if (rest.length === 0) { onDone(); return; }
    setActive(rest[0]);
  }

  const meta = active ? FIELD_META[active] : undefined;
  const victorOnly = !!meta?.victorOnly;

  return (
    <>
      <div onClick={onDone} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--atelier-overlay)' }} />
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: 'var(--atelier-sheet-bg)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderTop: '0.5px solid var(--atelier-sheet-border)', padding: '18px 22px 26px',
      }}>
        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>
          Complete the file
        </div>
        <div style={{ fontFamily: F.script, fontWeight: 300, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 4 }}>
          {personLabel} — {remaining.length} detail{remaining.length === 1 ? '' : 's'} missing
        </div>

        {/* The chips — the same render truth the cards carry, now tappable */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {remaining.map(c => (
            <button key={c} type="button" onClick={() => { setActive(c); setValue(''); setError(null); }} style={{
              fontFamily: F.label, fontWeight: c === active ? 400 : 300, fontSize: 16, lineHeight: 1.5,
              color: c === active ? A.ink : A.inkMute, letterSpacing: '0.06em',
              border: `0.5px solid ${c === active ? 'var(--atelier-accent-text)' : 'var(--atelier-ink-dim)'}`,
              borderRadius: 2, padding: '3px 8px', background: 'transparent', cursor: 'pointer',
            }}>+ {chipLabel(c)}</button>
          ))}
        </div>

        {active && (
          <div style={{ marginTop: 14 }}>
            {victorOnly ? (
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.5 }}>
                Money is edited in chat — the witnessed door. Say it there and it files with the full trail.
              </div>
            ) : (
              <input
                type={meta?.input ?? 'text'}
                inputMode={meta?.input === 'number' ? 'numeric' : meta?.input === 'tel' ? 'tel' : undefined}
                placeholder={meta?.placeholder}
                value={value}
                onChange={e => { setValue(e.target.value); setError(null); }}
                autoFocus
                style={{
                  width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                  background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)',
                  borderRadius: 2, fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink,
                }}
              />
            )}
            {error && (
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: 'var(--atelier-alert, #B4552D)', marginTop: 6 }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {!victorOnly && (
                <button type="button" onClick={save} disabled={saving} className={!saving ? 'atelier-fab' : undefined} style={{
                  flex: 1, padding: '11px 14px', borderRadius: 2, cursor: saving ? 'default' : 'pointer',
                  border: '0.5px solid var(--atelier-label)', opacity: saving ? 0.6 : 1,
                  background: saving ? 'rgba(201,168,76,0.18)' : undefined,
                  fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>{saving ? 'Filing…' : 'File it'}</button>
              )}
              <button type="button" onClick={() => tellVictor(active)} style={{
                flex: 1, padding: '11px 14px', background: 'transparent',
                border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>{victorOnly ? 'Send to chat' : 'Ask in chat instead'}</button> {/* A4 copy law: persona-free chrome */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
