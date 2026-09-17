'use client';
// components/vendor/packages/PackageFields.tsx — CE-43 · LC-2 · packet 2.
//
// The sheet chrome and the field editor both package sheets share: the Packages room's edit
// sheet (P8 to P10) and the lead's attach sheet (A4 plus F23's per-couple edits, which reuse
// P8's bytes). Tokens only (R-42.6): every colour is a `var(--atelier-*)`, so Chalk and
// Graphite ([data-theme="dark"], app/globals.css) both resolve.
import type { CSSProperties, ReactNode } from 'react';
import type { PackageLineItem } from '@/lib/vendor/api/vendor';
import { PACKAGES } from '@/lib/worklist/packages';

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
  width: '100%', boxSizing: 'border-box', padding: '12px 14px', minHeight: 44,
  background: 'transparent', border: `0.5px solid ${T.input}`, borderRadius: 2,
  fontFamily: T.body, fontSize: 16, color: T.ink,
};
export const flagged: CSSProperties = { borderColor: T.accent, borderWidth: 1.5 };

export function FieldLabel({ text, htmlFor }: { text: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'block', fontFamily: T.body, fontSize: 12, color: T.mute, marginBottom: 6 }}>
      {text}
    </label>
  );
}

export function textButton(tone: 'accent' | 'mute' = 'accent'): CSSProperties {
  return {
    background: 'none', border: 'none', padding: '8px 0', minHeight: 36, cursor: 'pointer',
    fontFamily: T.body, fontSize: 14, color: tone === 'accent' ? T.accent : T.mute,
  };
}

export function primaryButton(): CSSProperties {
  return {
    flex: 1, minHeight: 48, background: 'transparent', cursor: 'pointer',
    border: `0.5px solid ${T.accent}`, borderRadius: 2,
    fontFamily: T.body, fontSize: 15, color: T.accent,
  };
}

/** A bottom sheet in normal flow of the shell's overlay layer. */
export function Sheet({ open, title, onClose, children, footer, testId }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode; footer: ReactNode; testId: string;
}) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: T.overlay }} />}
      <div data-lc2={testId} role="dialog" aria-modal="true" aria-hidden={!open} style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, backgroundColor: T.sheet,
        borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: `1px solid ${T.sheetBorder}`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        maxHeight: '90dvh', display: 'flex', flexDirection: 'column', paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: T.dim }} />
        </div>
        <div style={{ padding: '6px 24px 12px', borderBottom: `1px solid ${T.sheetBorder}` }}>
          <h2 style={{ fontFamily: T.display, fontWeight: 400, fontSize: 24, lineHeight: 1.3, color: T.ink, margin: 0 }}>{title}</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children}
        </div>
        <div style={{ padding: '12px 24px 16px', borderTop: `1px solid ${T.sheetBorder}`, display: 'flex', gap: 12, alignItems: 'center' }}>
          {footer}
        </div>
      </div>
    </>
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
          <button type="button" style={{ ...textButton(), alignSelf: 'flex-start' }} onClick={() => onItems([...items, { label: '', detail: '' }])}>{PACKAGES.fAddItem}</button>
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
