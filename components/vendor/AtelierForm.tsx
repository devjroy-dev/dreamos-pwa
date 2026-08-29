'use client';
// components/vendor/AtelierForm.tsx — the Atelier form primitives, ONE HOME.
//
// TDW_07 P2 · PURE MOVE, no rewrite. These five were local to app/vendor/settings/page.tsx
// and TDW_07 P2's Discover Profile needs the identical grammar. Copying them would have
// been a second implementation of the estate's own form language — the class the spec's
// VendorProfileView singularity rule exists to prevent, one level down. Moved verbatim:
// the settings screen's rendered output is byte-unchanged, which is the 04.5 pure-move
// proof form (F11(c)'s studioShared precedent, same shape).
//
// A and F are exported because both screens derive every colour and face from them; the
// design system is locked (protocol §4) and neither screen may mint its own palette.

import React from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';

export const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', red: 'var(--role-critical)',
} as const;
export const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

// ── CE-39 S2/6 · TWO REGISTERS, ONE PRIMITIVE SET (bank §2, chair-accepted) ────
// The engraved register — Jost at 8–9px with .32em–.5em tracking — is what these five
// were moved here wearing, and it is what R-38.4 retires FROM THE SHELL. It is NOT retired
// from the estate. Derived by command at 7addef1, this file's importers are five:
// app/vendor/discover/profile, app/vendor/billing, SubscriptionCard, ProfileMeter and
// SettingsScreen — and SettingsScreen itself renders on BOTH trees. Recutting the bytes
// in place would sweep every one of them (COPY_REGISTER §9, F-38.23) and the main
// surfaces D-2 protects. (The bank's 「six list rooms」 consumer count named the shell's
// crossed bodies, which share the register but import nothing from here — s-39.2.)
// So the recut is a VARIANT, not a replacement. Every primitive takes `register` and
// DEFAULTS TO THE ENGRAVED BYTES — zero change for a caller that does not ask — and only
// app/w/settings, through SettingsScreen, opts into the six rungs. The rung styles read
// `--wl-t*`, which exist inside `.wl` and nowhere else; that is the mechanical reason the
// default is engraved and not rungs — a main-side caller that inherited rungs by accident
// would paint in the user agent's fallback font, which is C-R6's exact finding on the send
// glyph. No sweep. The bench asserts no other caller passes 'rungs'.
export type Register = 'engraved' | 'rungs';

/** The engraved card-title, field-label, read-row-label and save-button styles, and their rung twins. */
const R = {
  cardTitle: (r: Register): React.CSSProperties => r === 'rungs'
    ? { font: 'var(--wl-t5)', letterSpacing: '0.08em', textTransform: 'uppercase', color: A.brass }
    : { fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass },
  fieldLabel: (r: Register): React.CSSProperties => r === 'rungs'
    ? { display: 'block', font: 'var(--wl-t5)', color: A.inkMute, marginBottom: 6 }
    : { display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 },
  input: (r: Register): React.CSSProperties => r === 'rungs'
    ? { font: 'var(--wl-t3)', color: A.ink }
    : { fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink },
  rowText: (r: Register): React.CSSProperties => r === 'rungs'
    ? { font: 'var(--wl-t3)', color: A.ink }
    : { fontFamily: F.script, fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' },
  readLabel: (r: Register): React.CSSProperties => r === 'rungs'
    ? { font: 'var(--wl-t5)', color: A.inkMute }
    : { fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase' },
  readValue: (r: Register): React.CSSProperties => r === 'rungs'
    ? { font: 'var(--wl-t3)', color: A.ink }
    : { fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' },
  // The rung twin takes the shell's 44px tap floor (R-37.73 (1)); the engraved bytes
  // keep their own height, which is the main tree's business.
  saveBtn: (r: Register): React.CSSProperties => r === 'rungs'
    ? { font: 'var(--wl-t4)', color: INK_DEEP, minHeight: 44 }
    : { fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP, letterSpacing: '0.36em', textTransform: 'uppercase' },
};

export function SCard({ title, children, register = 'engraved' }: { title: string; children: React.ReactNode; register?: Register }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={R.cardTitle(register)}>{title}</span>
        <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

export function SField({ label, value, onChange, multiline, placeholder, inputMode, register = 'engraved' }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  register?: Register;
}) {
  const base: React.CSSProperties = {
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
    ...R.input(register), outline: 'none',
    caretColor: A.interactive, resize: 'none' as const, 
  };
  return (
    <div>
      <label style={R.fieldLabel(register)}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} style={base} placeholder={placeholder} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={base} placeholder={placeholder} inputMode={inputMode} />
      }
    </div>
  );
}

export function SToggle({ label, value, onChange, register = 'engraved' }: { label: string; value: boolean; onChange: (v: boolean) => void; register?: Register }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={R.rowText(register)}>{label}</span>
      <button type="button" onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 999, border: '0.5px solid var(--atelier-input-border)',
        cursor: 'pointer', flexShrink: 0,
        background: value ? 'linear-gradient(180deg, var(--atelier-accent-text) 0%, var(--atelier-accent-text) 100%)' : 'var(--atelier-input-bg)',
        position: 'relative', transition: 'background 200ms',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? 22 : 2, width: 18, height: 18, borderRadius: '50%',
          background: value ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
          transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

export function SReadRow({ label, value, register = 'engraved' }: { label: string; value: string; register?: Register }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <span style={R.readLabel(register)}>{label}</span>
      <span style={R.readValue(register)}>{value}</span>
    </div>
  );
}

export function SaveBtn({ dirty, loading, onSave, register = 'engraved' }: { dirty: boolean; loading: boolean; onSave: () => void; register?: Register }) {
  if (!dirty && !loading) return null;
  return (
    <button type="button" onClick={onSave} disabled={loading || !dirty} className={dirty && !loading ? 'atelier-fab' : undefined} style={{
      alignSelf: 'flex-end', padding: '8px 16px', borderRadius: 2,
      border: '0.5px solid var(--atelier-label)',
      cursor: loading || !dirty ? 'default' : 'pointer',
      ...R.saveBtn(register),
      background: !dirty || loading ? 'rgba(201,168,76,0.18)' : undefined,
      opacity: loading || !dirty ? 0.6 : 1,
    }}>{loading ? 'Saving…' : 'Save'}</button>
  );
}
