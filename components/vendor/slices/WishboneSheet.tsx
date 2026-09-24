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
import { SheetLayer, sheetBound, SHEET_BODY_SCROLL, SHEET_BOTTOM, SHEET_SAFE } from '@/components/vendor/SheetLayer';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useAsk } from '@/lib/worklist/askContext';
import { A, T, cap } from './SliceRow';

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

export function chipLabel(cell: string): string {
  return FIELD_META[cell]?.label ?? cap(cell.replace(/_/g, ' '));
}

export function WishboneSheet({ missing, personLabel, onComplete, onDone, initialValues, start }: {
  /** The wire's missing cells, in the wire's order. */
  missing: string[];
  /** The person the primer names ("this lead"/"this binder" fallback upstream). */
  personLabel: string;
  /** Complete one cell through the real door. Resolves to null on success,
      or an error string to show inline. Caller refetches on success. */
  onComplete: (cell: string, value: string) => Promise<string | null>;
  /** Called after the last cell completes, or on explicit close. */
  onDone: () => void;
  /** CE-43 LC-2 packet 3f · F-43.76: a value already on file for a cell (a month-precision wedding
      date), pre-filled so the vendor makes it exact without retyping. Absent for every other caller. */
  initialValues?: Record<string, string>;
  /** CE-43 LC-2 packet 3g · F-43.108: the cell the vendor tapped. The sheet opens on it, not on the
      first missing cell. Absent means the first. */
  start?: string;
}) {
  const { openAsk } = useAsk();
  const [remaining, setRemaining] = useState<string[]>(missing);
  const first = start && missing.includes(start) ? start : (missing[0] ?? null);
  const [active, setActive] = useState<string | null>(first);
  // ── R-44.11 (founder, 2026-09-18, "ok. first one") · THE ADVANCE DOES NOT TAKE
  //    THE KEYBOARD ─────────────────────────────────────────────────────────────
  // R-44.10's rule, in the chair's words to him: "the keyboard comes up only when she
  // tapped something that names the field, and never just because a sheet opened."
  // The OPENING cell is named by the chip she tapped, so it keeps its focus. A cell
  // reached by `save()`'s advance below was named by nobody, so it renders without one
  // and the keyboard rises on her tap in the field, which is itself a naming tap.
  const [advanced, setAdvanced] = useState(false);
  const [value, setValue] = useState((initialValues && first && initialValues[first]) || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function tellVictor(cell: string) {
    // Prefill-not-fire: the grammar mirrors the wire's tell_victor (TDW_03 drift log).
    // CE-39 S2/6 · F-38.47: this door is tree-blind. It asks lib/worklist/askContext.tsx
    // and pushes nothing — inside the shell the ask sheet opens in place with the stem;
    // on the /vendor tree the provider makes today's `?draft=` push. The push that stood
    // here unmounted the shell from six crossed rooms.
    //
    // ── CE-39 S2/9 · F-39.7 · THE DISMISSAL WAS THE PUSH'S SIDE EFFECT ────────
    // ⚠ THE FOUNDER TAPPED THIS AND NOTHING APPEARED TO HAPPEN. It happened: this sheet's
    // scrim is z-index 60 and its panel 61 (:95, :97), the ask sheet is z-index 40, so the
    // chat opened PREFILLED AND CORRECT, twenty layers underneath the panel he was looking
    // at. His third tap hit this scrim, `onDone` fired, and the ask sheet was revealed
    // already open — which is exactly the three-tap sequence he reported.
    //
    // THE CAUSE IS THE CURE ITSELF, AND THAT IS THE PART WORTH WRITING DOWN. The old door
    // was `router.push('/vendor?draft=…')`. NAVIGATING AWAY TORE THIS SHEET DOWN, so no
    // one ever wrote a dismissal — the push WAS the dismissal, and nobody knew, because a
    // side effect nobody named is a dependency nobody can see. Replacing the push with a
    // door that correctly keeps the shell mounted removed a teardown this surface had been
    // relying on since it was written. F-38.20's family: two authorities over one
    // dismissal, and this time the loud one was deleted.
    //
    // `CalendarDaySheet` is the one door of the four that already did this, and it is the
    // model rather than the exception: a surface that hands the conversation to the chat
    // closes itself, because 「ask in chat INSTEAD」 means instead.
    const primer = `About ${personLabel}: the ${chipLabel(cell).toLowerCase()} is `;
    onDone();
    openAsk(primer);
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
    // R-44.11 · `autoFocus` alone does NOT do this. React applies it on MOUNT, and the
    // next cell reuses the same <input> element, so nothing remounts and the caret — and
    // the keyboard with it — simply stays where it was. Driven in the real room this read
    // RED: activeElement was still an input after the save. So the advance puts the
    // keyboard down itself, and her tap on the field brings it back.
    setAdvanced(true);
    const here = document.activeElement;
    if (here instanceof HTMLElement) here.blur();
    setActive(rest[0]);
  }

  const meta = active ? FIELD_META[active] : undefined;
  const victorOnly = !!meta?.victorOnly;

  // Packet 3j · F-43.116: mounted through the one vendor layer (components/vendor/SheetLayer.tsx). It
  // was z-index 60/61 by hand; it now stacks by open order above whatever sheet opened it, leaves that
  // sheet inert under its own backdrop, and stays within the visible viewport above the keyboard.
  return (
    <SheetLayer open testId="wishbone-sheet">{(z) => (<>
      <div onClick={onDone} style={{ position: 'fixed', inset: 0, zIndex: z.scrim, background: 'var(--atelier-overlay)' }} />
      <div data-lc2="wishbone-sheet" data-sheet-body="" style={{
        position: 'fixed', left: 0, right: 0, bottom: SHEET_BOTTOM, zIndex: z.panel,
        background: 'var(--atelier-sheet-bg)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderTop: '0.5px solid var(--atelier-sheet-border)', padding: `18px 22px calc(26px + ${SHEET_SAFE})`,
        maxHeight: sheetBound('88dvh'), boxSizing: 'border-box', ...SHEET_BODY_SCROLL,
      }}>
        <div style={{ font: T.t5, letterSpacing: '0.08em', textTransform: 'uppercase', color: A.brass }}>
          Complete the file
        </div>
        <div style={{ font: T.t3, color: A.inkMute, marginTop: 4 }}>
          {personLabel} — {remaining.length} detail{remaining.length === 1 ? '' : 's'} missing
        </div>

        {/* The chips — the same render truth the cards carry, now tappable */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {remaining.map(c => (
            <button key={c} type="button" onClick={() => { setActive(c); setValue((initialValues && initialValues[c]) || ''); setError(null); }} style={{
              font: T.t4,
              color: c === active ? A.ink : A.inkMute,
              border: `0.5px solid ${c === active ? 'var(--atelier-accent-text)' : 'var(--atelier-ink-dim)'}`,
              borderRadius: 2,
              padding: '3px 8px',
              background: 'transparent',
              cursor: 'pointer',
            }}>+ {chipLabel(c)}</button>
          ))}
        </div>

        {active && (
          <div style={{ marginTop: 14 }}>
            {victorOnly ? (
              <div style={{ font: T.t3, color: A.inkSoft }}>
                Money is edited in chat — the witnessed door. Say it there and it files with the full trail.
              </div>
            ) : (
              <input
                type={meta?.input ?? 'text'}
                inputMode={meta?.input === 'number' ? 'numeric' : meta?.input === 'tel' ? 'tel' : undefined}
                placeholder={meta?.placeholder}
                value={value}
                onChange={e => { setValue(e.target.value); setError(null); }}
                autoFocus={!advanced}
                style={{
                  font: T.t3,
                  width: '100%',
                  padding: '10px 12px',
                  boxSizing: 'border-box',
                  background: 'var(--atelier-input-bg)',
                  border: '0.5px solid var(--atelier-card-border)',
                  borderRadius: 2,
                  color: A.ink,
                }}
              />
            )}
            {error && (
              <div style={{ font: T.t3, color: 'var(--role-critical)', marginTop: 6 }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {!victorOnly && (
                <button type="button" onClick={save} disabled={saving} className={!saving ? 'atelier-fab' : undefined} style={{
                  font: T.t4,
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: 2,
                  cursor: saving ? 'default' : 'pointer',
                  border: '0.5px solid var(--atelier-label)',
                  opacity: saving ? 0.6 : 1,
                  background: saving ? 'rgba(201,168,76,0.18)' : undefined,
                  color: INK_DEEP,
                }}>{saving ? 'Filing…' : 'File it'}</button>
              )}
              <button type="button" onClick={() => tellVictor(active)} style={{
                font: T.t4,
                flex: 1,
                padding: '11px 14px',
                background: 'transparent',
                border: '0.5px solid var(--atelier-sheet-border)',
                borderRadius: 2,
                cursor: 'pointer',
                color: A.interactiveWarm,
              }}>{victorOnly ? 'Send to chat' : 'Ask in chat instead'}</button> {/* A4 copy law: persona-free chrome */}
            </div>
          </div>
        )}
      </div>
    </>)}</SheetLayer>
  );
}
