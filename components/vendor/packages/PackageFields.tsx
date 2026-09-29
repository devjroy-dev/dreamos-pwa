'use client';
import { RUNG_FONT as RUNG } from '@/lib/worklist/theme'; // CE-45 FE-2 TYPE_2: the app's own type, holding outside the shell (F7)
// components/vendor/packages/PackageFields.tsx — CE-43 · LC-2 · packet 2.
//
// The sheet chrome and the field editor both package sheets share: the Packages room's edit
// sheet (P8 to P10) and the lead's attach sheet (A4 plus F23's per-couple edits, which reuse
// P8's bytes). Tokens only (R-42.6): every colour is a `var(--atelier-*)`, so Chalk and
// Graphite ([data-theme="dark"], app/globals.css) both resolve.
import type { CSSProperties, ReactNode } from 'react';
import type { PackageLineItem } from '@/lib/vendor/api/vendor';
import { PACKAGES } from '@/lib/worklist/packages';
import { SheetLayer, sheetBound, useSheetScrollReset, SHEET_BODY_SCROLL, SHEET_BOTTOM, SHEET_SAFE } from '@/components/vendor/SheetLayer';

export const T = {
  ink: 'var(--atelier-ink)',
  soft: 'var(--atelier-ink-soft)',
  mute: 'var(--atelier-ink-mute)',
  dim: 'var(--atelier-ink-dim)',
  accent: 'var(--atelier-accent-text)',
  card: 'var(--atelier-card-border)',
  input: 'var(--atelier-input-border)',
  sheet: 'var(--atelier-sheet-top)',
  sheetBorder: 'var(--atelier-sheet-border)',
  overlay: 'var(--atelier-overlay)',
  display: 'var(--font-cormorant), Georgia, serif',
  label: 'var(--font-jost), system-ui, sans-serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
} as const;

export const inputStyle: CSSProperties = {
  font: RUNG.t3,
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  minHeight: 44,
  background: 'transparent',
  border: `0.5px solid ${T.input}`,
  borderRadius: 2,
  color: T.ink,
};
export const flagged: CSSProperties = { borderColor: T.accent, borderWidth: 1.5 };

/** CE-44 · R-44.13: a value the sheet shows but cannot edit (the booked couple's
 *  package and fee). Tokens only, the input's own type size, no border. */
export const plainValue: CSSProperties = {
  font: RUNG.t3,
  color: 'var(--atelier-ink)',
  margin: 0,
  padding: '3px 0 2px',
};
/** The toggle's own label text, beside the middle-payment checkbox. */
export const toggleText: CSSProperties = {
  font: RUNG.t3,
  color: 'var(--atelier-ink-soft)',
};

export function FieldLabel({ text, htmlFor }: { text: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} style={{ font: RUNG.t4, display: 'block', color: T.mute, marginBottom: 6 }}>
      {text}
    </label>
  );
}

export function textButton(tone: 'accent' | 'mute' = 'accent'): CSSProperties {
  return {
    font: RUNG.t4,
    background: 'none',
    border: 'none',
    padding: '8px 0',
    minHeight: 36,
    cursor: 'pointer',
    color: tone === 'accent' ? T.accent : T.mute,
  };
}

/** F-43.79 (chair-approved under C-43.16, at the founder's request): a secondary action reads as
 *  a button. Outlined, a thin border, 2px corners, 40px tap height; `accent` for the action,
 *  `mute` for the quiet one (Delete). Tokens only. */
export function actionButton(tone: 'accent' | 'mute' = 'accent'): CSSProperties {
  const c = tone === 'accent' ? T.accent : T.mute;
  return {
    font: RUNG.t4,
    background: 'transparent',
    border: `0.5px solid ${c}`,
    borderRadius: 2,
    minHeight: 40,
    padding: '0 14px',
    cursor: 'pointer',
    color: c,
  };
}

export function primaryButton(): CSSProperties {
  return {
    font: RUNG.t4,
    flex: 1,
    minHeight: 48,
    background: 'transparent',
    cursor: 'pointer',
    border: `0.5px solid ${T.accent}`,
    borderRadius: 2,
    color: T.accent,
  };
}

/** A bottom sheet in normal flow of the shell's overlay layer. */
export function Sheet({ open, title, onClose, children, footer, testId }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode; footer: ReactNode; testId: string;
}) {
  // Packet 3j · F-43.116: the sheet mounts through the one vendor layer (components/vendor/SheetLayer.tsx):
  // portaled, stacked by open order, inert beneath a higher sheet, bounded by the visible viewport and
  // lifted above the keyboard. Its body scrolls on its own and starts at the top on every open.
  const bodyRef = useSheetScrollReset<HTMLDivElement>(open);
  return (
    <SheetLayer open={open} testId={testId}>{(z) => (<>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: z.scrim, backgroundColor: T.overlay }} />}
      {/* F-43.89 (packet 3c, chair-ruled): a closed sheet is `inert`, not `aria-hidden`. The
          browser drops focus from an inert subtree, so a sheet that closes itself while its own
          confirm button holds focus no longer hides a focused element from assistive tech. */}
      <div data-lc2={testId} role="dialog" aria-modal="true" inert={!open} style={{
        position: 'fixed', bottom: SHEET_BOTTOM, left: 0, right: 0, zIndex: z.panel, backgroundColor: T.sheet,
        borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: `1px solid ${T.sheetBorder}`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        maxHeight: sheetBound('90dvh'), boxSizing: 'border-box', display: 'flex', flexDirection: 'column', paddingBottom: SHEET_SAFE,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: T.dim }} />
        </div>
        <div style={{ padding: '6px 24px 12px', borderBottom: `1px solid ${T.sheetBorder}`, flexShrink: 0 }}>
          <h2 style={{ font: RUNG.t1, color: T.ink, margin: 0 }}>{title}</h2>
        </div>
        <div ref={bodyRef} data-sheet-body="" style={{ flex: 1, ...SHEET_BODY_SCROLL, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children}
        </div>
        <div style={{ padding: '12px 24px 16px', borderTop: `1px solid ${T.sheetBorder}`, display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          {footer}
        </div>
      </div>
    </>)}</SheetLayer>
  );
}

/** Name, description and the included items: P8's bytes, shared by both sheets. */
export function IdentityFields({ name, description, items, onName, onDescription, onItems, badField }: {
  name: string; description: string; items: PackageLineItem[];
  onName: (v: string) => void; onDescription: (v: string) => void; onItems: (v: PackageLineItem[]) => void;
  badField: string | null;
}) {
  const setItem = (i: number, k: 'label' | 'detail', v: string) =>
    onItems(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  return (
    <>
      <div>
        <FieldLabel text={PACKAGES.fName} htmlFor="pkg-name" />
        <input id="pkg-name" style={{ ...inputStyle, ...(badField === 'name' ? flagged : {}) }} value={name} onChange={(e) => onName(e.target.value)} autoComplete="off" />
      </div>
      <div>
        <FieldLabel text={PACKAGES.fDescription} htmlFor="pkg-desc" />
        <textarea id="pkg-desc" rows={3} style={{ ...inputStyle, minHeight: 88, resize: 'vertical', ...(badField === 'description' ? flagged : {}) }} value={description} onChange={(e) => onDescription(e.target.value)} />
      </div>
      <div>
        <FieldLabel text={PACKAGES.fIncluded} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,3fr)', gap: 8 }}>
              <input aria-label={PACKAGES.fItem} placeholder={PACKAGES.fItem} style={{ ...inputStyle, ...(badField === 'line_items' && !it.label.trim() ? flagged : {}) }} value={it.label} onChange={(e) => setItem(i, 'label', e.target.value)} />
              <input aria-label={PACKAGES.fDetail} placeholder={PACKAGES.fDetail} style={{ ...inputStyle, ...(badField === 'line_items' && !it.detail.trim() ? flagged : {}) }} value={it.detail} onChange={(e) => setItem(i, 'detail', e.target.value)} />
            </div>
          ))}
          <button type="button" style={{ ...actionButton(), alignSelf: 'flex-start' }} onClick={() => onItems([...items, { label: '', detail: '' }])}>{PACKAGES.fAddItem}</button>
        </div>
      </div>
    </>
  );
}

/** A whole-rupee input: digits only, empty means unset. */
export function wholeRupees(v: string): number | null {
  const digits = v.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

/** Items with both halves blank are dropped before a save; half-filled ones are kept so the door refuses them. */
export function tidyItems(items: PackageLineItem[]): PackageLineItem[] {
  return items.filter((it) => it.label.trim() || it.detail.trim()).map((it) => ({ label: it.label.trim(), detail: it.detail.trim() }));
}
